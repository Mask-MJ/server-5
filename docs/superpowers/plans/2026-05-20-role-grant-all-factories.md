# Role 全部工厂授权（含后续新增）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Role 模型加 `grantAllFactories` 开关，使持有该角色的非 admin 用户在工厂相关数据查询中等价于 admin 工厂可见范围，自动覆盖当前和后续新增的工厂；同时将分散在 3 处的工厂过滤逻辑收口到公共 helper。

**Architecture:** 数据层在 Role 加布尔字段；新增 `src/common/utils/user-factory-scope.ts` 暴露 `hasAllFactoryScope` 与 `getAccessibleFactoryIds` 两个函数；`factory.service` 的 2 个查询和 `valve.service` 的 1 个查询接入 helper；Role DTO/Service 增字段以持久化；前端角色编辑表单加 Switch。

**Tech Stack:** NestJS + Prisma + Jest（后端），Vue3 + Naive UI（前端，仓库 `/root/code/vls/client`）

**Spec:** `docs/superpowers/specs/2026-05-20-role-grant-all-factories-design.md`

**Branch:** `feature/role-grant-all-factories`（已存在，spec commit 712692d 在其上）

---

## File Structure

### 新建
- `prisma/migrations/<ts>_add_role_grant_all_factories/migration.sql` — Prisma migrate dev 自动生成
- `src/common/utils/user-factory-scope.ts` — helper
- `src/common/utils/user-factory-scope.spec.ts` — helper 单元测试
- `src/modules/project/factory/factory.service.spec.ts` — factory.service 范围分支单元测试
- `src/modules/project/valve/valve.service.spec.ts` — valve.service 范围分支单元测试

### 修改（vls/server）
- `prisma/schema/schema.prisma` (L53-77 Role 模型) — 加字段
- `src/common/utils/index.ts` — 重新导出 helper（保持就近 import）
- `src/modules/project/factory/factory.service.ts` (L71-143) — `findAll` / `findAllList` 接入 helper
- `src/modules/project/valve/valve.service.ts` (L44-101) — `findAll` 接入 helper
- `src/modules/system/role/role.dto.ts` (L48 之后) — 加 `grantAllFactories` 可选字段
- `src/modules/system/role/role.service.ts` (L13-23, L54-66) — create/update 持久化新字段

### 修改（vls/client）
- `src/api/system/role.ts` (RoleInfo 接口) — 加 `grantAllFactories?: boolean`
- `src/views/system/role/data.ts` (setSchemas) — 加 Switch 并联动 `factoryIds` 的 disabled

---

## Task 1: 加 Role.grantAllFactories 字段与 migration

**Files:**
- Modify: `prisma/schema/schema.prisma` (L72-74)
- Create: `prisma/migrations/<timestamp>_add_role_grant_all_factories/migration.sql`（由 prisma 自动生成）

- [ ] **Step 1: 确认当前分支与工作区干净**

Run:
```bash
git status
git rev-parse --abbrev-ref HEAD
```
Expected: branch = `feature/role-grant-all-factories`，working tree clean。若不在该分支：`git checkout feature/role-grant-all-factories`。

- [ ] **Step 2: 修改 Role schema**

文件 `prisma/schema/schema.prisma`，在 Role 模型 `remark` 字段之后、关系字段之前（L72 行前）插入字段：

```prisma
  /// 是否授权全部工厂（含后续新增）
  grantAllFactories Boolean @default(false)
```

修改后 Role 模型应为：

```prisma
model Role {
  id        Int       @id @default(autoincrement())
  name      String    @unique
  value     String    @unique
  sort      Int       @default(1)
  createBy  String
  updateBy  String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  remark    String    @default("")
  /// 是否授权全部工厂（含后续新增）
  grantAllFactories Boolean @default(false)
  factory   Factory[] @relation("FactoryToRole")
  menu      Menu[]    @relation("MenuToRole")
  user      User[]    @relation("RoleToUser")

  @@schema("public")
}
```

- [ ] **Step 3: 生成并应用 migration**

按 prisma-rules，优先 Prisma MCP；若无 MCP 可用 CLI：

```bash
# 若使用 .env.local
pnpm exec dotenvx run --env-file=.env.local --env-file=.env -- \
  prisma migrate dev --name add_role_grant_all_factories

# 仅 .env
pnpm exec prisma migrate dev --name add_role_grant_all_factories
```

Expected output: `Applied migration(s): <timestamp>_add_role_grant_all_factories`，`Generated Prisma Client`。

生成的 SQL 应只含：

```sql
ALTER TABLE "Role" ADD COLUMN "grantAllFactories" BOOLEAN NOT NULL DEFAULT false;
```

- [ ] **Step 4: 验证类型生成**

```bash
pnpm exec tsc --noEmit
```
Expected: 无错误（Prisma client 已更新，`Role` 类型含 `grantAllFactories: boolean`）。

- [ ] **Step 5: Commit**

```bash
git add prisma/schema/schema.prisma prisma/migrations/
git commit -m "feat(prisma): ✨ add Role.grantAllFactories flag

新增布尔字段标记角色是否拥有「全部工厂含后续新增」的可见范围，
默认 false 不影响存量。"
```

---

## Task 2: 创建公共 helper 并 TDD

**Files:**
- Create: `src/common/utils/user-factory-scope.ts`
- Create: `src/common/utils/user-factory-scope.spec.ts`
- Modify: `src/common/utils/index.ts` — re-export helper

- [ ] **Step 1: 写失败的 helper 单元测试**

创建 `src/common/utils/user-factory-scope.spec.ts`：

```typescript
import {
  hasAllFactoryScope,
  getAccessibleFactoryIds,
  type UserWithRoles,
} from './user-factory-scope';

describe('user-factory-scope', () => {
  describe('hasAllFactoryScope', () => {
    it('returns true when user is admin', () => {
      const user: UserWithRoles = { isAdmin: true, role: [] };
      expect(hasAllFactoryScope(user)).toBe(true);
    });

    it('returns true when any role has grantAllFactories=true', () => {
      const user: UserWithRoles = {
        isAdmin: false,
        role: [
          { id: 1, grantAllFactories: false },
          { id: 2, grantAllFactories: true },
        ],
      };
      expect(hasAllFactoryScope(user)).toBe(true);
    });

    it('returns false when not admin and no grant-all role', () => {
      const user: UserWithRoles = {
        isAdmin: false,
        role: [{ id: 1, grantAllFactories: false }],
      };
      expect(hasAllFactoryScope(user)).toBe(false);
    });

    it('returns false when user has no roles and is not admin', () => {
      const user: UserWithRoles = { isAdmin: false, role: [] };
      expect(hasAllFactoryScope(user)).toBe(false);
    });
  });

  describe('getAccessibleFactoryIds', () => {
    const buildPrisma = (factoryIds: number[]) => ({
      client: {
        factory: {
          findMany: jest.fn().mockResolvedValue(
            factoryIds.map((id) => ({ id })),
          ),
        },
      },
    });

    it('returns null when user has all-factory scope (admin)', async () => {
      const prisma = buildPrisma([]);
      const result = await getAccessibleFactoryIds(prisma as any, {
        isAdmin: true,
        role: [],
      });
      expect(result).toBeNull();
      expect(prisma.client.factory.findMany).not.toHaveBeenCalled();
    });

    it('returns null when user has any grantAllFactories role', async () => {
      const prisma = buildPrisma([]);
      const result = await getAccessibleFactoryIds(prisma as any, {
        isAdmin: false,
        role: [{ id: 1, grantAllFactories: true }],
      });
      expect(result).toBeNull();
      expect(prisma.client.factory.findMany).not.toHaveBeenCalled();
    });

    it('returns factoryIds from roles when not all-scope', async () => {
      const prisma = buildPrisma([10, 11]);
      const result = await getAccessibleFactoryIds(prisma as any, {
        isAdmin: false,
        role: [
          { id: 1, grantAllFactories: false },
          { id: 2, grantAllFactories: false },
        ],
      });
      expect(result).toEqual([10, 11]);
      expect(prisma.client.factory.findMany).toHaveBeenCalledWith({
        where: { role: { some: { id: { in: [1, 2] } } } },
        select: { id: true },
      });
    });

    it('returns empty array when user has no roles', async () => {
      const prisma = buildPrisma([]);
      const result = await getAccessibleFactoryIds(prisma as any, {
        isAdmin: false,
        role: [],
      });
      expect(result).toEqual([]);
    });
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
pnpm exec jest src/common/utils/user-factory-scope.spec.ts
```
Expected: Cannot find module './user-factory-scope'（文件还没创建）。

- [ ] **Step 3: 创建 helper 实现**

创建 `src/common/utils/user-factory-scope.ts`：

```typescript
import type { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import type { CustomPrismaService } from 'nestjs-prisma';

export type UserWithRoles = {
  isAdmin: boolean;
  role: { id: number; grantAllFactories: boolean }[];
};

/**
 * 判断用户是否拥有「全部工厂」可见范围。
 * admin 或任一角色 grantAllFactories=true 即视为全部范围。
 */
export function hasAllFactoryScope(user: {
  isAdmin: boolean;
  role: { grantAllFactories: boolean }[];
}): boolean {
  if (user.isAdmin) return true;
  return user.role.some((r) => r.grantAllFactories);
}

/**
 * 解析用户当前可见的 factoryIds。
 * - 全部范围（admin / grant-all role）→ 返回 null（调用方据此跳过 factoryId 过滤）
 * - 非全部范围 → 返回基于 roleIds 关联的 factoryIds 列表（可能为空数组）
 */
export async function getAccessibleFactoryIds(
  prisma: CustomPrismaService<ExtendedPrismaClient>,
  user: UserWithRoles,
): Promise<number[] | null> {
  if (hasAllFactoryScope(user)) return null;
  const roleIds = user.role.map((r) => r.id);
  const rows = await prisma.client.factory.findMany({
    where: { role: { some: { id: { in: roleIds } } } },
    select: { id: true },
  });
  return rows.map((r) => r.id);
}
```

- [ ] **Step 4: 运行测试，确认通过**

```bash
pnpm exec jest src/common/utils/user-factory-scope.spec.ts
```
Expected: PASS, 9 tests。

- [ ] **Step 5: 在 utils/index.ts 重新导出**

编辑 `src/common/utils/index.ts`，在文件末尾加一行：

```typescript
export * from './user-factory-scope';
```

- [ ] **Step 6: tsc 校验**

```bash
pnpm exec tsc --noEmit
```
Expected: 无错误。

- [ ] **Step 7: Commit**

```bash
git add src/common/utils/user-factory-scope.ts \
        src/common/utils/user-factory-scope.spec.ts \
        src/common/utils/index.ts
git commit -m "feat(auth): ✨ add user-factory-scope helper

新增 hasAllFactoryScope / getAccessibleFactoryIds 两个工具函数，
收口分散在 factory/valve service 中的工厂可见范围逻辑。
覆盖 admin、grant-all role、普通 role、无 role 四种场景。"
```

---

## Task 3: factory.service.findAll 接入 helper

**Files:**
- Modify: `src/modules/project/factory/factory.service.ts` (L71-107)
- Create: `src/modules/project/factory/factory.service.spec.ts`

- [ ] **Step 1: 写失败的 service 单元测试**

创建 `src/modules/project/factory/factory.service.spec.ts`：

```typescript
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
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
pnpm exec jest src/modules/project/factory/factory.service.spec.ts
```
Expected: 第 2 个用例（grant-all role）失败 —— 当前实现还按 roleIds 过滤；第 1、3 个可能也失败因为没经过 helper。

- [ ] **Step 3: 改造 findAll 接入 helper**

编辑 `src/modules/project/factory/factory.service.ts`：

1. 在 imports 段加入（与现有 `import { transformationTree } from 'src/common/utils/transformationTree';` 同区）：

```typescript
import { hasAllFactoryScope } from 'src/common/utils/user-factory-scope';
```

2. 替换 L71-107 整段 `findAll` 方法为：

```typescript
async findAll(user: ActiveUserData, queryFactoryDto: QueryFactoryDto) {
  const { name, beginTime, endTime, filterId } = queryFactoryDto;
  const userData = await this.prismaService.client.user.findUnique({
    where: { id: user.sub },
    include: { role: true },
  });
  const baseWhere = {
    name: { contains: name, mode: 'insensitive' as const },
    NOT: { id: filterId, parentId: filterId },
    createdAt: { gte: beginTime, lte: endTime },
  };
  if (hasAllFactoryScope(userData)) {
    const factories = await this.prismaService.client.factory.findMany({
      where: baseWhere,
      orderBy: { createdAt: 'desc' },
    });
    return {
      totalCount: factories.length,
      rows: transformationTree(factories, null),
    };
  }
  const roleIds = userData.role.map((item) => item.id);
  const factories = await this.prismaService.client.factory.findMany({
    where: {
      ...baseWhere,
      role: { some: { id: { in: roleIds } } },
    },
    include: { role: true },
    orderBy: { createdAt: 'desc' },
  });
  return {
    totalCount: factories.length,
    rows: transformationTree(factories, null),
  };
}
```

- [ ] **Step 4: 运行测试，确认通过**

```bash
pnpm exec jest src/modules/project/factory/factory.service.spec.ts
```
Expected: PASS, 3 tests。

- [ ] **Step 5: tsc 校验**

```bash
pnpm exec tsc --noEmit
```
Expected: 无错误。

- [ ] **Step 6: Commit**

```bash
git add src/modules/project/factory/factory.service.ts \
        src/modules/project/factory/factory.service.spec.ts
git commit -m "refactor(auth): ♻️ factory.findAll 接入 user-factory-scope helper

将 admin / 非 admin 分支收口为 hasAllFactoryScope 判断，
非 admin 但持有 grantAllFactories 角色的用户也走全量分支。"
```

---

## Task 4: factory.service.findAllList 接入 helper

**Files:**
- Modify: `src/modules/project/factory/factory.service.ts` (L109-143)
- Modify: `src/modules/project/factory/factory.service.spec.ts` — 追加测试

- [ ] **Step 1: 追加失败的测试用例**

在 `factory.service.spec.ts` 文件末尾、最后一个 `});` 之后加一个新的 describe：

```typescript
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
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
pnpm exec jest src/modules/project/factory/factory.service.spec.ts -t "findAllList scope"
```
Expected: 「grant-all role」用例失败。

- [ ] **Step 3: 改造 findAllList 接入 helper**

替换 `factory.service.ts` L109-143 整段 `findAllList` 方法为：

```typescript
async findAllList(user: ActiveUserData) {
  const userData = await this.prismaService.client.user.findUnique({
    where: { id: user.sub },
    include: { role: true },
  });
  const include = { _count: { select: { valve: true } } } as const;
  if (hasAllFactoryScope(userData)) {
    return this.prismaService.client.factory.findMany({
      include,
      orderBy: { createdAt: 'desc' },
    });
  }
  const roleIds = userData.role.map((item) => item.id);
  return this.prismaService.client.factory.findMany({
    where: {
      OR: [
        { createBy: user.account },
        { role: { some: { id: { in: roleIds } } } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include,
  });
}
```

- [ ] **Step 4: 运行测试，确认通过**

```bash
pnpm exec jest src/modules/project/factory/factory.service.spec.ts
```
Expected: PASS, 6 tests（含 Task 3 的 3 个）。

- [ ] **Step 5: Commit**

```bash
git add src/modules/project/factory/factory.service.ts \
        src/modules/project/factory/factory.service.spec.ts
git commit -m "refactor(auth): ♻️ factory.findAllList 接入 user-factory-scope helper

非 admin 但持有 grantAllFactories 角色的用户也走全量分支，
保留普通角色的 createBy OR role.some 兜底逻辑。"
```

---

## Task 5: valve.service.findAll 接入 helper

**Files:**
- Modify: `src/modules/project/valve/valve.service.ts` (L44-101)
- Create: `src/modules/project/valve/valve.service.spec.ts`

- [ ] **Step 1: 写失败的测试**

创建 `src/modules/project/valve/valve.service.spec.ts`：

```typescript
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
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
pnpm exec jest src/modules/project/valve/valve.service.spec.ts
```
Expected: 「grant-all role」用例失败（当前实现仍会去查 factoryIds）。

- [ ] **Step 3: 改造 findAll 接入 helper**

编辑 `src/modules/project/valve/valve.service.ts`：

1. 在 imports 段加入：

```typescript
import { getAccessibleFactoryIds } from 'src/common/utils/user-factory-scope';
```

2. 替换 L44-101 整段 `findAll` 方法为：

```typescript
async findAll(user: ActiveUserData, queryValveDto: QueryValveDto) {
  const {
    tag,
    factoryId,
    deviceId,
    analysisTaskId,
    valveSeries,
    serialNumber,
    page,
    pageSize,
  } = queryValveDto;
  const userData = await this.prismaService.client.user.findUnique({
    where: { id: user.sub },
    include: { role: true },
  });
  const accessibleIds = await getAccessibleFactoryIds(
    this.prismaService,
    userData,
  );
  const factoryIdFilter =
    factoryId !== undefined
      ? factoryId
      : accessibleIds === null
        ? undefined
        : { in: accessibleIds };
  const [rows, meta] = await this.prismaService.client.valve
    .paginate({
      where: {
        tag: { contains: tag, mode: 'insensitive' },
        factoryId: factoryIdFilter,
        deviceId,
        analysisTask: analysisTaskId
          ? { some: { id: analysisTaskId } }
          : undefined,
        serialNumber: { contains: serialNumber, mode: 'insensitive' },
        valveSeries: { contains: valveSeries, mode: 'insensitive' },
      },
      include: { factory: true, device: true, analysisTask: true },
      orderBy: { updatedAt: 'desc' },
    })
    .withPages({ page, limit: pageSize, includePageCount: true });
  return { rows, ...meta };
}
```

注意要点：
- `accessibleIds === null` 表示全部范围 → `factoryId` 不加限制（undefined）
- `accessibleIds === []` 表示该用户没有任何可见工厂 → `factoryId: { in: [] }` 自然返回空集
- 显式传入 `factoryId` 始终优先（与原行为一致）

- [ ] **Step 4: 运行测试，确认通过**

```bash
pnpm exec jest src/modules/project/valve/valve.service.spec.ts
```
Expected: PASS, 4 tests。

- [ ] **Step 5: tsc 校验**

```bash
pnpm exec tsc --noEmit
```
Expected: 无错误。

- [ ] **Step 6: Commit**

```bash
git add src/modules/project/valve/valve.service.ts \
        src/modules/project/valve/valve.service.spec.ts
git commit -m "refactor(auth): ♻️ valve.findAll 接入 user-factory-scope helper

非 admin 但持有 grantAllFactories 角色的用户跳过 factoryId 限制，
显式 factoryId 查询参数仍然优先生效。"
```

---

## Task 6: Role DTO/Service 增字段持久化

**Files:**
- Modify: `src/modules/system/role/role.dto.ts` (L48 后)
- Modify: `src/modules/system/role/role.service.ts` (L13-23, L54-66)

- [ ] **Step 1: 加 DTO 字段**

编辑 `src/modules/system/role/role.dto.ts`：

1. 顶部 import 增加 `IsBoolean`：

```typescript
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
```

2. 在 `CreateRoleDto` 类的 `factoryIds` 字段（L41-48）之后，添加：

```typescript
  /**
   * 是否授权全部工厂（含后续新增）
   * @example false
   */
  @IsBoolean()
  @IsOptional()
  grantAllFactories?: boolean;
```

`UpdateRoleDto extends PartialType(CreateRoleDto)` 会自动继承该字段，无需改 UpdateRoleDto。

- [ ] **Step 2: 改 create 持久化字段**

编辑 `src/modules/system/role/role.service.ts` L13-23 `create` 方法，替换为：

```typescript
create(user: ActiveUserData, createRoleDto: CreateRoleDto) {
  const { menuIds, factoryIds, grantAllFactories, ...rest } = createRoleDto;
  return this.prismaService.client.role.create({
    data: {
      ...rest,
      grantAllFactories: grantAllFactories ?? false,
      createBy: user.account,
      menu: { connect: menuIds.map((id) => ({ id })) },
      factory: { connect: factoryIds.map((id) => ({ id })) },
    },
  });
}
```

- [ ] **Step 3: 改 update 持久化字段**

编辑 `src/modules/system/role/role.service.ts` L54-66 `update` 方法，替换为：

```typescript
update(id: number, user: ActiveUserData, updateRoleDto: UpdateRoleDto) {
  const { menuIds, factoryIds, grantAllFactories, ...rest } = updateRoleDto;
  return this.prismaService.client.role.update({
    where: { id },
    data: {
      ...rest,
      ...(grantAllFactories !== undefined && { grantAllFactories }),
      updateBy: user.account,
      menu: { set: menuIds.map((id) => ({ id })) },
      factory: { set: factoryIds.map((id) => ({ id })) },
    },
  });
}
```

注意：顺手移除原来的 `console.log(menuIds);`（L56）—— 团队规范禁止 console.log。

- [ ] **Step 4: tsc 校验**

```bash
pnpm exec tsc --noEmit
```
Expected: 无错误。

- [ ] **Step 5: 跑相关测试确认无回归**

```bash
pnpm exec jest src/modules/system src/modules/project
```
Expected: 全部 PASS。

- [ ] **Step 6: Commit**

```bash
git add src/modules/system/role/role.dto.ts src/modules/system/role/role.service.ts
git commit -m "feat(auth): ✨ Role DTO/Service 支持 grantAllFactories 字段

CreateRoleDto 增可选 boolean 字段，create/update 持久化到 DB，
update 未传时保留原值。顺手移除 update 中遗留的 console.log。"
```

---

## Task 7: 集成测试（手工 e2e 验证 + 文档化）

> 后端没有现成的 e2e 测试基础设施用于多用户场景测试，此 Task 用手工脚本验证「核心场景：新建工厂后 grant-all 用户立刻可见」。

**Files:**
- Create: `test/manual/grant-all-factories.md` — 手工验证步骤

- [ ] **Step 1: 启动 dev 服务**

```bash
pnpm dev
```
保持运行。

- [ ] **Step 2: 准备测试数据（在新 terminal 执行）**

获取一个 admin 用户的 JWT token（按现有登录接口拿到，记为 `$ADMIN_TOKEN`），然后：

```bash
# 1) 创建 grant-all 角色
curl -X POST http://localhost:3000/system/role \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"leader-test","value":"leader-test","sort":1,"menuIds":[],"factoryIds":[],"grantAllFactories":true}'
# 记录返回的 roleId，记为 $ROLE_ID

# 2) 创建非 admin 测试用户并绑定该角色（用项目已有的用户创建接口）
curl -X POST http://localhost:3000/system/user \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"account":"leader1","password":"Test1234","nickname":"leader1","isAdmin":false,"roleIds":['"$ROLE_ID"']}'

# 3) 创建两个测试工厂
curl -X POST http://localhost:3000/factory \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"F-A"}'
curl -X POST http://localhost:3000/factory \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"F-B"}'

# 4) 用 leader1 登录拿到 $LEADER_TOKEN
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"leader1","password":"Test1234"}'
```

> 路由名以项目实际为准（如 `auth/sign-in` 等），不确定时翻 `src/modules/iam/authentication/authentication.controller.ts`。

- [ ] **Step 3: 验证 grant-all 用户可见所有工厂**

切换登录为 `leader1`，调用：

```bash
curl -X GET http://localhost:3000/factory \
  -H "Authorization: Bearer <leader1-token>" \
  -H "Content-Type: application/json"
```
Expected: `rows` 包含 `F-A` 和 `F-B`。

- [ ] **Step 4: 验证「后续新增工厂自动可见」核心场景**

用 admin 登录创建工厂 `F-C`：

```bash
curl -X POST http://localhost:3000/factory \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"F-C"}'
```

立刻用 `leader1` 再次查询：

```bash
curl -X GET http://localhost:3000/factory \
  -H "Authorization: Bearer <leader1-token>"
```
Expected: `rows` 包含 `F-A`、`F-B`、`F-C`（**核心验收点**：未对 leader-test 角色做任何额外操作，新工厂自动可见）。

- [ ] **Step 5: 验证 valve 列表同样全可见**

```bash
curl -X GET http://localhost:3000/valve \
  -H "Authorization: Bearer <leader1-token>"
```
Expected: 返回所有工厂下的阀门，无 factoryId 限制。

- [ ] **Step 6: 关闭 grantAllFactories 后回退验证**

调用 Update Role，设 `leader-test` 角色 `grantAllFactories=false`，`factoryIds=[<F-A 的 id>]`：

```bash
curl -X PATCH http://localhost:3000/system/role/<roleId> \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"id":<roleId>,"name":"leader-test","value":"leader-test","sort":1,"menuIds":[],"factoryIds":[<F-A id>],"grantAllFactories":false}'
```

`leader1` 再查 `/factory`：
Expected: 只看到 `F-A`，回退正常。

- [ ] **Step 7: 写验证记录文档**

创建 `test/manual/grant-all-factories.md`，把以上 Step 2-6 的步骤、用到的 curl 命令、预期响应记录下来，便于回归时复用。

- [ ] **Step 8: Commit**

```bash
git add test/manual/grant-all-factories.md
git commit -m "test(auth): ✅ add manual verification steps for grant-all-factories

记录 grant-all 角色的核心场景手工验证步骤，包含新建工厂
立刻可见、关闭开关后回退两个关键路径。"
```

---

## Task 8: 前端 Switch（在 vls/client 仓单独提交）

> 本 Task 切换到 `/root/code/vls/client` 仓库工作。如该仓库还没对应分支，按团队规范开 `feature/role-grant-all-factories`。

**Files (vls/client):**
- Modify: `src/api/system/role.ts` (RoleInfo 接口、CreatedRole 类型)
- Modify: `src/views/system/role/data.ts` (setSchemas)

- [ ] **Step 1: 切到 client 仓并开分支**

```bash
cd /root/code/vls/client
git checkout main
git pull
git checkout -b feature/role-grant-all-factories
```

- [ ] **Step 2: 给 RoleInfo 加字段**

编辑 `src/api/system/role.ts`，在 `RoleInfo` 接口里加：

```typescript
export interface RoleInfo {
  id: number
  name: string
  value: string
  sort: number
  menu?: number[]
  factory?: number[]
  grantAllFactories?: boolean
  remark: string
  createdAt: string
  updatedAt: string
}
```

如果文件里还有创建角色的 DTO（如 `CreatedRole`），相应加上同字段（可选 boolean）。

- [ ] **Step 3: 给表单 schema 加 Switch 和联动**

编辑 `src/views/system/role/data.ts`，在 `setSchemas` 中 `factoryIds` 之前插入新 schema：

```typescript
  {
    path: 'grantAllFactories',
    label: '全部工厂授权',
    component: 'NSwitch',
    componentProps: {
      checkedValue: true,
      uncheckedValue: false
    },
    componentSlots: {
      'checked-icon': () => '开',
      'unchecked-icon': () => '关'
    },
    suffix: '勾选后该角色自动拥有所有当前及后续新增工厂的查看权限'
  },
```

并在 `factoryIds` 的 schema 中加入响应式 disabled：

```typescript
  {
    path: 'factoryIds',
    label: '数据权限',
    component: 'ApiTreeSelect',
    componentProps: ({ formModel }) => ({
      immediate: true,
      api: getFactoryList,
      multiple: true,
      labelField: 'name',
      keyField: 'id',
      checkable: true,
      cascade: true,
      resultField: 'rows',
      disabled: formModel.grantAllFactories === true
    })
  },
```

> 说明：Naive Admin 的 ApiTreeSelect 通过 componentProps 函数形式拿 formModel，触发 disabled 联动。若框架版本不支持该写法，改用 watch 监听并 setPathsValue 触发。

- [ ] **Step 4: 启动前端 dev 服务验证**

```bash
pnpm dev
```

打开「系统管理 → 角色管理」，新增角色：
- 勾选「全部工厂授权」→ 下方「数据权限」灰掉，已选项保留
- 取消勾选 → 数据权限可重新选择
- 提交保存，刷新页面后再次编辑该角色，状态正确回显

- [ ] **Step 5: tsc / build 校验**

```bash
pnpm exec vue-tsc --noEmit
pnpm build
```
Expected: 无错误。

- [ ] **Step 6: Commit（在 client 仓）**

```bash
git add src/api/system/role.ts src/views/system/role/data.ts
git commit -m "feat(auth): ✨ 角色表单支持全部工厂授权开关

新增 grantAllFactories Switch，勾选时禁用数据权限多选，
持久化已选项不丢失；与后端 v1 接口契合。"
git push -u origin feature/role-grant-all-factories
```

- [ ] **Step 7: 切回 server 仓**

```bash
cd /root/code/vls/server
```

---

## Task 9: 整体回归 + PR

**Files:** 无新增改动，仅验证和提交 PR。

- [ ] **Step 1: 后端全套测试**

```bash
cd /root/code/vls/server
pnpm test
```
Expected: 全 PASS，新增测试覆盖 user-factory-scope.spec / factory.service.spec / valve.service.spec。

- [ ] **Step 2: tsc + build**

```bash
pnpm exec tsc --noEmit
pnpm build
```
Expected: 无错误。

- [ ] **Step 3: code-reviewer agent 自审**

调用 `code-reviewer` 子代理 review 本次 diff（针对未推送到远端的 commits）。修复 CRITICAL/HIGH 问题，记录 MEDIUM 项。

- [ ] **Step 4: Push & 开 PR**

```bash
git push -u origin feature/role-grant-all-factories
gh pr create --title "feat(auth): ✨ 角色支持全部工厂授权（含后续新增）" --body "$(cat <<'EOF'
## Summary
- 在 Role 模型加 `grantAllFactories` 布尔字段，持有该开关的角色等价于 admin 工厂可见范围
- 抽公共 helper `hasAllFactoryScope` / `getAccessibleFactoryIds`，收口分散在 factory/valve service 的工厂过滤逻辑
- 前端角色编辑表单新增 Switch（vls/client 仓单独 PR）
- 新工厂上线后 grant-all 角色自动可见，无需逐个授权

## Changes
- `prisma/schema/schema.prisma` — Role 加 grantAllFactories 字段 + migration
- `src/common/utils/user-factory-scope.ts` — 新增 helper + 单测
- `src/modules/project/factory/factory.service.ts` — findAll / findAllList 接入 helper + 单测
- `src/modules/project/valve/valve.service.ts` — findAll 接入 helper + 单测
- `src/modules/system/role/{role.dto,role.service}.ts` — 持久化新字段
- `test/manual/grant-all-factories.md` — 核心场景手工验证步骤

## API Changes
- ⚠️ `POST /system/role` / `PATCH /system/role/:id` — 请求 body 增可选字段 `grantAllFactories: boolean`（向后兼容，未传默认 false / 保留原值）

需要前端在 vls/client `feature/role-grant-all-factories` 分支配合上线。

## Test Checklist
- [x] pnpm test 全绿，含新增 13+ 测试用例
- [x] pnpm exec tsc --noEmit
- [x] pnpm build
- [x] 手工验证 `test/manual/grant-all-factories.md` 中的 4 个场景
- [x] code-reviewer agent 无 CRITICAL/HIGH

## Spec
设计文档：`docs/superpowers/specs/2026-05-20-role-grant-all-factories-design.md`
EOF
)"
```

- [ ] **Step 5: 等 CI 绿**

按团队规则，push 后**立即进入等 CI 状态**，主动监控不让用户操心。CI 红了自己拉日志、定位、修、重 push。

```bash
gh pr checks --watch
```

Expected: 所有 check 为 success。

- [ ] **Step 6: 通知前端 PR 协同**

CI 绿后，通知协作者前端 PR（`vls/client feature/role-grant-all-factories`）也需评审并同步合入。

---

## 完成条件

- [ ] 所有 9 个 Task 的 commit 都在 `feature/role-grant-all-factories` 分支
- [ ] 后端 PR 已开，CI 全绿
- [ ] 前端 PR 已开（在 vls/client 仓）
- [ ] 手工验证文档 `test/manual/grant-all-factories.md` 中的 4 个场景已实测通过
- [ ] Reviewer Approved 后合入 develop / main（按团队 merge 策略）
