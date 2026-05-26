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

  // 与卡博特 xlsx 一致:actuatorSize/Series 列被设成"数字"格式 → number 进 SheetJS。
  // 同时覆盖 5 个 qty 字段:空串/0/数字 → toIntOrNull 行为。
  const buildFileFullSchema = (
    dataRows: Record<string, unknown>[],
  ): Express.Multer.File => {
    const headers = [
      'no',
      'unit',
      'serialNumber',
      'tag',
      'since',
      'valveBrand',
      'valveSize',
      'actuatorSize',
      'actuatorSeries',
      'sovQty',
      'lsQty',
      'vbQty',
      'qeQty',
      'pilotQty',
    ];
    const buffer = buildXlsxBuffer([
      headers,
      headers.map(() => 'cn'),
      ...dataRows.map((r) => headers.map((h) => (h in r ? r[h] : ''))),
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

  it('number-typed xlsx cells (actuatorSize=30, actuatorSeries=667) are normalized to string before prisma.create', async () => {
    // 卡博特 xlsx 现场复现:这两列被填表人设成"数字"格式 → SheetJS 解析为 number →
    // 旧代码直接喂 Prisma String? → ValidationError → 全部 skipped。新代码 toStr() 拦截。
    const file = buildFileFullSchema([
      {
        no: 1,
        unit: '除氯',
        serialNumber: '20948863',
        tag: 'FV-3301-1',
        since: '2012-01-01',
        valveBrand: 'Fisher',
        valveSize: 4, // 也可能是 number
        actuatorSize: 30, // ⭐ 卡博特原样
        actuatorSeries: 667, // ⭐ 卡博特原样
      },
    ]);

    const result = await service.import(buildUser(), file, {
      factoryId: 1,
    } as never);

    expect(result.created).toBe(1);
    const data = valveCreate.mock.calls[0][0].data;
    expect(data.actuatorSize).toBe('30');
    expect(typeof data.actuatorSize).toBe('string');
    expect(data.actuatorSeries).toBe('667');
    expect(typeof data.actuatorSeries).toBe('string');
    expect(data.valveSize).toBe('4');
    expect(typeof data.valveSize).toBe('string');
    // actuatorDescription fallback 也用归一化后的字符串
    expect(typeof data.actuatorDescription).toBe('string');
    expect(data.actuatorDescription).toContain('667');
    expect(data.actuatorDescription).toContain('30');
  });

  it('qty fields: "" → null, 0 → 0, "10" → 10, number 5 → 5 (also fixes "0 → null" legacy bug)', async () => {
    const file = buildFileFullSchema([
      {
        no: 1,
        unit: '除氯',
        serialNumber: 'S-A',
        tag: 'T-A',
        since: '2012-01-01',
        valveBrand: 'Fisher',
        sovQty: '', // 空串 → null
        lsQty: 0, // 0 → 0 (旧 code `qty ? Number(qty) : null` 错把 0 当 null)
        vbQty: '10', // 字符串数字 → 10
        qeQty: 5, // number → 5
        pilotQty: '-', // 占位符 → null
      },
    ]);

    const result = await service.import(buildUser(), file, {
      factoryId: 1,
    } as never);

    expect(result.created).toBe(1);
    const data = valveCreate.mock.calls[0][0].data;
    expect(data.sovQty).toBeNull();
    expect(data.lsQty).toBe(0);
    expect(data.vbQty).toBe(10);
    expect(data.qeQty).toBe(5);
    expect(data.pilotQty).toBeNull();
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
