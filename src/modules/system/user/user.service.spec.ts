import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { UserService } from './user.service';
import { HashingService } from 'src/modules/iam/hashing/hashing.service';
import { MinioService } from 'src/common/minio/minio.service';
import type { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

type UserRecord = {
  id: number;
  account: string;
  password: string;
  isAdmin: boolean;
};

describe('UserService - changePassword', () => {
  let service: UserService;
  let findUnique: jest.Mock;
  let update: jest.Mock;
  let hash: jest.Mock;
  let compare: jest.Mock;

  const buildActiveUser = (sub: number): ActiveUserData => ({
    sub,
    account: 'tester',
    nickname: 'tester',
    roles: [],
  });

  beforeEach(async () => {
    findUnique = jest.fn();
    update = jest.fn().mockResolvedValue({});
    hash = jest.fn().mockResolvedValue('hashed-new');
    compare = jest.fn();

    const prismaServiceMock = {
      client: { user: { findUnique, update } },
    };

    const hashingServiceMock = { hash, compare };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'PrismaService', useValue: prismaServiceMock },
        { provide: HashingService, useValue: hashingServiceMock },
        { provide: MinioService, useValue: {} },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  const stubTarget = (overrides: Partial<UserRecord> = {}) => {
    const target: UserRecord = {
      id: 10,
      account: 'target',
      password: 'stored-hash',
      isAdmin: false,
      ...overrides,
    };
    return target;
  };

  it('自己改自己 + 旧密码正确 → 写入新 hash', async () => {
    const target = stubTarget({ id: 10 });
    findUnique.mockResolvedValueOnce(target);
    compare.mockResolvedValueOnce(true);

    await service.changePassword(
      buildActiveUser(10),
      10,
      'newPwd',
      'oldPwd',
    );

    expect(compare).toHaveBeenCalledWith('oldPwd', 'stored-hash');
    expect(hash).toHaveBeenCalledWith('newPwd');
    expect(update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { password: 'hashed-new' },
    });
  });

  it('自己改自己 + 旧密码错误 → 抛 ConflictException 且不写库', async () => {
    findUnique.mockResolvedValueOnce(stubTarget({ id: 10 }));
    compare.mockResolvedValueOnce(false);

    await expect(
      service.changePassword(buildActiveUser(10), 10, 'newPwd', 'wrong'),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(update).not.toHaveBeenCalled();
  });

  it('普通用户改他人 → 抛 ForbiddenException 且不写库', async () => {
    // 第一次 findUnique 返回操作者（非管理员）
    findUnique.mockResolvedValueOnce(
      stubTarget({ id: 1, isAdmin: false }),
    );

    await expect(
      service.changePassword(buildActiveUser(1), 10, 'newPwd', ''),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(update).not.toHaveBeenCalled();
    expect(hash).not.toHaveBeenCalled();
  });

  it('管理员改他人 → 跳过 oldPassword 校验并写入新 hash', async () => {
    findUnique
      .mockResolvedValueOnce(stubTarget({ id: 1, isAdmin: true })) // operator
      .mockResolvedValueOnce(stubTarget({ id: 10 })); // target

    await service.changePassword(buildActiveUser(1), 10, 'newPwd', '');

    expect(compare).not.toHaveBeenCalled();
    expect(hash).toHaveBeenCalledWith('newPwd');
    expect(update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { password: 'hashed-new' },
    });
  });

  it('目标用户不存在 → 抛 ConflictException', async () => {
    findUnique
      .mockResolvedValueOnce(stubTarget({ id: 1, isAdmin: true })) // operator
      .mockResolvedValueOnce(null); // target 不存在

    await expect(
      service.changePassword(buildActiveUser(1), 999, 'newPwd', ''),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(update).not.toHaveBeenCalled();
  });
});
