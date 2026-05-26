import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import * as XLSX from 'xlsx';

import { FactoryService } from './factory.service';
import { MinioService } from 'src/common/minio/minio.service';
import { ValveService } from '../valve/valve.service';
import type { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

describe('FactoryService - import resilience', () => {
  let service: FactoryService;
  let deviceFindFirst: jest.Mock;
  let deviceCreate: jest.Mock;
  let valveFindFirst: jest.Mock;
  let valveCreate: jest.Mock;
  let valveUpdate: jest.Mock;
  let loggerLog: jest.Mock;
  let loggerWarn: jest.Mock;

  const buildUser = (): ActiveUserData => ({
    sub: 1,
    account: 'tester',
    nickname: 'tester',
    roles: [],
  });

  const buildXlsxBuffer = (rows: unknown[][]): Buffer => {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  };

  // 模板表头：英文字段名 + 中文说明行 + 数据行
  // 只放 import 必读的少数字段，其它由 destructure 默认值兜底
  const buildFile = (
    dataRows: Record<string, unknown>[],
  ): Express.Multer.File => {
    const headers = [
      'no',
      'unit',
      'serialNumber',
      'tag',
      'since',
      'valveBrand',
    ];
    const cnRow = [
      '序号',
      '装置',
      '阀体序列号',
      '位号',
      '投用时间',
      '阀体品牌',
    ];
    const buffer = buildXlsxBuffer([
      headers,
      cnRow,
      ...dataRows.map((r) => headers.map((h) => r[h] ?? '')),
    ]);
    return { buffer } as Express.Multer.File;
  };

  beforeEach(async () => {
    deviceFindFirst = jest.fn().mockResolvedValue(null);
    deviceCreate = jest
      .fn()
      .mockImplementation(({ data }) =>
        Promise.resolve({ id: 99, name: data.name }),
      );
    valveFindFirst = jest.fn().mockResolvedValue(null);
    valveCreate = jest.fn().mockResolvedValue({ id: 1 });
    valveUpdate = jest.fn().mockResolvedValue({ id: 1 });
    loggerLog = jest.fn();
    loggerWarn = jest.fn();

    const prismaMock = {
      client: {
        device: { findFirst: deviceFindFirst, create: deviceCreate },
        valve: {
          findFirst: valveFindFirst,
          create: valveCreate,
          update: valveUpdate,
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FactoryService,
        { provide: 'PrismaService', useValue: prismaMock },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
        { provide: HttpService, useValue: {} },
        { provide: MinioService, useValue: {} },
        {
          provide: Logger,
          useValue: { log: loggerLog, warn: loggerWarn, error: jest.fn() },
        },
        { provide: ValveService, useValue: {} },
      ],
    }).compile();

    service = module.get<FactoryService>(FactoryService);
  });

  it('parses since="2012-01-01" string into a real Date (no crash)', async () => {
    const file = buildFile([
      {
        no: 1,
        unit: '除氯',
        serialNumber: '20948863',
        tag: 'FV-3301-1',
        since: '2012-01-01',
        valveBrand: 'Fisher',
      },
    ]);

    const result = await service.import(buildUser(), file, {
      factoryId: 1,
    } as never);

    expect(result.created).toBe(1);
    expect(valveCreate).toHaveBeenCalledTimes(1);
    const data = (valveCreate.mock.calls[0][0] as { data: { since: Date } })
      .data;
    expect(data.since).toBeInstanceOf(Date);
    expect((data.since as Date).toISOString()).toBe('2012-01-01T00:00:00.000Z');
  });

  it('un-parseable since string → row goes to skipped, no throw', async () => {
    const file = buildFile([
      {
        no: 1,
        unit: '除氯',
        serialNumber: '20948863',
        tag: 'FV-3301-1',
        since: 'not-a-date',
        valveBrand: 'Fisher',
      },
    ]);

    const result = await service.import(buildUser(), file, {
      factoryId: 1,
    } as never);

    expect(result.skipped).toBe(1);
    expect(result.skippedRows[0]).toMatchObject({
      row: 3,
      reason: expect.stringContaining('日期'),
    });
    expect(valveCreate).not.toHaveBeenCalled();
  });

  it('prisma write failure on one row → that row skipped, other rows continue', async () => {
    valveCreate
      .mockRejectedValueOnce(new Error('unique constraint'))
      .mockResolvedValue({ id: 2 });

    const file = buildFile([
      {
        no: 1,
        unit: '除氯',
        serialNumber: '20948863',
        tag: 'FV-3301-1',
        since: '2012-01-01',
        valveBrand: 'Fisher',
      },
      {
        no: 2,
        unit: '除氯',
        serialNumber: '20948864',
        tag: 'FV-3305-1',
        since: '2012-01-01',
        valveBrand: 'Fisher',
      },
    ]);

    const result = await service.import(buildUser(), file, {
      factoryId: 1,
    } as never);

    expect(result.created).toBe(1);
    expect(result.skipped).toBe(1);
    expect(result.skippedRows[0]).toMatchObject({
      row: 3,
      reason: expect.stringContaining('unique constraint'),
    });
  });

  it('always logs an import summary; logs warn with skipped reasons when any row skipped', async () => {
    const file = buildFile([
      {
        no: 1,
        unit: '除氯',
        serialNumber: '20948863',
        tag: 'FV-3301-1',
        since: '2012-01-01',
        valveBrand: 'Fisher',
      },
      {
        // 故意缺 unit → 进 skipped
        no: 2,
        unit: '',
        serialNumber: '20948864',
        tag: 'FV-3305-1',
        since: '2012-01-01',
        valveBrand: 'Fisher',
      },
    ]);

    await service.import(buildUser(), file, { factoryId: 7 } as never);

    expect(loggerLog).toHaveBeenCalledWith(
      expect.stringContaining('factoryId=7'),
    );
    expect(loggerLog).toHaveBeenCalledWith(
      expect.stringMatching(/created=1.*skipped=1/),
    );
    expect(loggerWarn).toHaveBeenCalledWith(
      expect.stringContaining('missing-unit'),
    );
  });

  it('does not warn when no rows are skipped', async () => {
    const file = buildFile([
      {
        no: 1,
        unit: '除氯',
        serialNumber: '20948863',
        tag: 'FV-3301-1',
        since: '2012-01-01',
        valveBrand: 'Fisher',
      },
    ]);

    await service.import(buildUser(), file, { factoryId: 7 } as never);

    expect(loggerLog).toHaveBeenCalled();
    expect(loggerWarn).not.toHaveBeenCalled();
  });
});
