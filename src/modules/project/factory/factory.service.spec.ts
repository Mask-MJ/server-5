import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';

import { FactoryService } from './factory.service';
import { MinioService } from 'src/common/minio/minio.service';
import { ValveService } from '../valve/valve.service';
import type { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

describe('FactoryService - findAll scope', () => {
  let service: FactoryService;
  let userFindUnique: jest.Mock;
  let factoryFindMany: jest.Mock;

  const buildUser = (sub = 1): ActiveUserData => ({
    sub,
    account: 'tester',
    nickname: 'tester',
    roles: [],
  });

  beforeEach(async () => {
    userFindUnique = jest.fn();
    factoryFindMany = jest.fn().mockResolvedValue([]);

    const prismaMock = {
      client: {
        user: { findUnique: userFindUnique },
        factory: { findMany: factoryFindMany },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FactoryService,
        { provide: 'PrismaService', useValue: prismaMock },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
        { provide: HttpService, useValue: {} },
        { provide: MinioService, useValue: {} },
        { provide: Logger, useValue: { log: jest.fn(), error: jest.fn() } },
        { provide: ValveService, useValue: {} },
      ],
    }).compile();

    service = module.get<FactoryService>(FactoryService);
  });

  it('admin → no role filter', async () => {
    userFindUnique.mockResolvedValue({ isAdmin: true, role: [] });
    await service.findAll(buildUser(), {} as any);
    const where = factoryFindMany.mock.calls[0][0].where;
    expect(where.role).toBeUndefined();
  });

  it('grant-all role → no role filter', async () => {
    userFindUnique.mockResolvedValue({
      isAdmin: false,
      role: [{ id: 1, grantAllFactories: true }],
    });
    await service.findAll(buildUser(), {} as any);
    const where = factoryFindMany.mock.calls[0][0].where;
    expect(where.role).toBeUndefined();
  });

  it('normal role → role filter applied', async () => {
    userFindUnique.mockResolvedValue({
      isAdmin: false,
      role: [{ id: 7, grantAllFactories: false }],
    });
    await service.findAll(buildUser(), {} as any);
    const where = factoryFindMany.mock.calls[0][0].where;
    expect(where.role).toEqual({ some: { id: { in: [7] } } });
  });
});

describe('FactoryService - findAllList scope', () => {
  let service: FactoryService;
  let userFindUnique: jest.Mock;
  let factoryFindMany: jest.Mock;

  const buildUser = (sub = 1, account = 'tester'): ActiveUserData => ({
    sub,
    account,
    nickname: 'tester',
    roles: [],
  });

  beforeEach(async () => {
    userFindUnique = jest.fn();
    factoryFindMany = jest.fn().mockResolvedValue([]);

    const prismaMock = {
      client: {
        user: { findUnique: userFindUnique },
        factory: { findMany: factoryFindMany },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FactoryService,
        { provide: 'PrismaService', useValue: prismaMock },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
        { provide: HttpService, useValue: {} },
        { provide: MinioService, useValue: {} },
        { provide: Logger, useValue: { log: jest.fn(), error: jest.fn() } },
        { provide: ValveService, useValue: {} },
      ],
    }).compile();

    service = module.get<FactoryService>(FactoryService);
  });

  it('admin → returns all factories (no where)', async () => {
    userFindUnique.mockResolvedValue({ isAdmin: true, role: [] });
    await service.findAllList(buildUser());
    const args = factoryFindMany.mock.calls[0][0];
    expect(args.where).toBeUndefined();
  });

  it('grant-all role → returns all factories (no where)', async () => {
    userFindUnique.mockResolvedValue({
      isAdmin: false,
      role: [{ id: 1, grantAllFactories: true }],
    });
    await service.findAllList(buildUser());
    const args = factoryFindMany.mock.calls[0][0];
    expect(args.where).toBeUndefined();
  });

  it('normal role → OR(createBy, role.some)', async () => {
    userFindUnique.mockResolvedValue({
      isAdmin: false,
      role: [{ id: 7, grantAllFactories: false }],
    });
    await service.findAllList(buildUser(1, 'alice'));
    const where = factoryFindMany.mock.calls[0][0].where;
    expect(where.OR).toEqual([
      { createBy: 'alice' },
      { role: { some: { id: { in: [7] } } } },
    ]);
  });
});
