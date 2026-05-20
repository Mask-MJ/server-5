import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';

import { ValveService } from './valve.service';
import type { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

describe('ValveService - findAll scope', () => {
  let service: ValveService;
  let userFindUnique: jest.Mock;
  let factoryFindMany: jest.Mock;
  let valvePaginate: jest.Mock;
  let withPages: jest.Mock;

  const buildUser = (sub = 1): ActiveUserData => ({
    sub,
    account: 'tester',
    nickname: 'tester',
    roles: [],
  });

  beforeEach(async () => {
    userFindUnique = jest.fn();
    factoryFindMany = jest.fn().mockResolvedValue([{ id: 10 }, { id: 11 }]);
    withPages = jest.fn().mockResolvedValue([[], { totalCount: 0 }]);
    valvePaginate = jest.fn().mockReturnValue({ withPages });

    const prismaMock = {
      client: {
        user: { findUnique: userFindUnique },
        factory: { findMany: factoryFindMany },
        valve: { paginate: valvePaginate },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValveService,
        { provide: 'PrismaService', useValue: prismaMock },
        { provide: HttpService, useValue: {} },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    service = module.get<ValveService>(ValveService);
  });

  it('admin → no factoryId restriction', async () => {
    userFindUnique.mockResolvedValue({ isAdmin: true, role: [] });
    await service.findAll(buildUser(), {} as any);
    const where = valvePaginate.mock.calls[0][0].where;
    expect(where.factoryId).toBeUndefined();
    expect(factoryFindMany).not.toHaveBeenCalled();
  });

  it('grant-all role → no factoryId restriction', async () => {
    userFindUnique.mockResolvedValue({
      isAdmin: false,
      role: [{ id: 1, grantAllFactories: true }],
    });
    await service.findAll(buildUser(), {} as any);
    const where = valvePaginate.mock.calls[0][0].where;
    expect(where.factoryId).toBeUndefined();
    expect(factoryFindMany).not.toHaveBeenCalled();
  });

  it('normal role → factoryId restricted to role-accessible ids', async () => {
    userFindUnique.mockResolvedValue({
      isAdmin: false,
      role: [{ id: 7, grantAllFactories: false }],
    });
    await service.findAll(buildUser(), {} as any);
    expect(factoryFindMany).toHaveBeenCalledWith({
      where: { role: { some: { id: { in: [7] } } } },
      select: { id: true },
    });
    const where = valvePaginate.mock.calls[0][0].where;
    expect(where.factoryId).toEqual({ in: [10, 11] });
  });

  it('explicit factoryId query param overrides for normal role', async () => {
    userFindUnique.mockResolvedValue({
      isAdmin: false,
      role: [{ id: 7, grantAllFactories: false }],
    });
    await service.findAll(buildUser(), { factoryId: 99 } as any);
    const where = valvePaginate.mock.calls[0][0].where;
    expect(where.factoryId).toBe(99);
  });
});
