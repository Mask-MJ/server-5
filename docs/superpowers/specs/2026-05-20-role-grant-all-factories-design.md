# Role 全部工厂授权（含后续新增）设计

- **Date:** 2026-05-20
- **Owner:** moyaojun
- **Status:** Approved, ready for implementation plan
- **Scope:** vls/server + vls/client

---

## 1. 背景与目标

### 现状

- 数据模型：`User → Role → Factory`（多对多，Role 通过 `FactoryToRole` 关联具体工厂）。
- 仅 `User.isAdmin = true` 可见全部工厂数据；其他用户通过角色绑定的工厂列表过滤。
- 工厂过滤逻辑在三处独立实现，分散在 2 个文件：
  - `src/modules/project/factory/factory.service.ts` `findAll` (L71-107)
  - `src/modules/project/factory/factory.service.ts` `findAllList` (L109-143)
  - `src/modules/project/valve/valve.service.ts` `findAll` (L44-100)

### 问题

部分领导层用户需要查看「全部工厂」数据，但不应授予 `isAdmin`（会一并放开菜单/用户管理等所有管理员权限）。同时，需求要求**含后续新增的工厂**——给角色逐个勾选工厂的现状无法满足，因为新工厂上线后还要再手动加入。

### 目标

- 在角色（Role）层增加一个开关「全部工厂授权（含后续新增）」。
- 任何持有该开关角色的用户，在工厂相关数据查询中等价于 `isAdmin` 的工厂可见范围（**仅限工厂数据，不涉及其它管理员权限**）。
- 不影响菜单、用户管理、审计等其它权限点。
- 顺手把分散的工厂过滤逻辑收口到公共 helper，避免「3 处加一个 if」漏改。

### 非目标

- 不引入新的「角色层级」概念。
- 不动现有 `isAdmin` 的语义和边界。
- 不在本 PR 内做审计日志（如需，单独 issue）。

---

## 2. 数据模型变更

### Prisma Schema

`prisma/schema/schema.prisma` 的 `Role` 模型新增字段：

```prisma
model Role {
  // ... 现有字段
  grantAllFactories Boolean @default(false)
  // ... 现有关系
}
```

- 默认 `false`，存量角色不受影响。
- Migration 名建议：`add_role_grant_all_factories`。
- 无需回填数据。

### 字段语义

- `true`：该角色拥有全部工厂（当前 + 未来新增）的查看权限。
- `false`：按 `Role.factory` 关系限定可见工厂。
- 与 `Role.factory` 关系并存：当 `grantAllFactories = true` 时，`Role.factory` 中的具体工厂关系**保留但被过滤逻辑忽略**。取消勾选后立刻回退到原工厂列表，不丢配置。

---

## 3. 公共 helper

### 位置

`src/common/utils/user-factory-scope.ts`（跨模块共用，不挂在某个业务模块下）。

### 接口

```ts
// 判断用户是否拥有「全部工厂」范围（admin 或任一角色 grantAllFactories=true）
export function hasAllFactoryScope(user: {
  isAdmin: boolean;
  role: { grantAllFactories: boolean }[];
}): boolean;

// 当用户不是全部范围时，查可见 factoryIds（基于其 roleIds 关联的 Factory）
// 是全部范围时返回 null（调用方据此跳过 factoryId 过滤）
export async function getAccessibleFactoryIds(
  prisma: PrismaClient,
  user: { isAdmin: boolean; role: { id: number; grantAllFactories: boolean }[] },
): Promise<number[] | null>;
```

- 拆两个函数：判断「是否全部」是纯函数，无 IO；查 factoryIds 涉及 DB 查询，分开能让调用方按需调用，单元测试也更直观。
- `getAccessibleFactoryIds` 返回 `null` 表示「全部范围」，返回 `number[]` 表示限定列表。调用方据此构造 where 条件。

### 调用方迁移

| 文件 | 方法 | 改造 |
|---|---|---|
| `src/modules/project/factory/factory.service.ts` | `findAll` (L71-107) | `if (hasAllFactoryScope(userData))` → 走全量分支；否则走原 `role: { some: { id: { in: roleIds } } }` |
| `src/modules/project/factory/factory.service.ts` | `findAllList` (L109-143) | 同上，保留 `createBy: user.account` 兜底（普通角色未授权但自建的工厂仍可见） |
| `src/modules/project/valve/valve.service.ts` | `findAll` (L44-100) | `if (hasAllFactoryScope)` → 不限制 factoryId；否则用 `getAccessibleFactoryIds` 返回列表 |

User 查询的 `include: { role: true }` 已经默认 select 所有标量字段，自动包含 `grantAllFactories`，无需调整 include。

---

## 4. Role DTO & Service

### `role.dto.ts`

`CreateRoleDto` / `UpdateRoleDto` 新增可选字段：

```ts
@IsOptional()
@IsBoolean()
@ApiPropertyOptional({ description: '是否授权全部工厂（含后续新增）' })
grantAllFactories?: boolean;
```

### `role.service.ts`

`create` / `update` 解构出 `grantAllFactories` 并写入：

```ts
// create
const { menuIds, factoryIds, grantAllFactories, ...rest } = createRoleDto;
return this.prismaService.client.role.create({
  data: {
    ...rest,
    grantAllFactories: grantAllFactories ?? false,
    createBy: user.account,
    menu: { connect: menuIds.map(id => ({ id })) },
    factory: { connect: factoryIds.map(id => ({ id })) },
  },
});

// update
const { menuIds, factoryIds, grantAllFactories, ...rest } = updateRoleDto;
return this.prismaService.client.role.update({
  where: { id },
  data: {
    ...rest,
    ...(grantAllFactories !== undefined && { grantAllFactories }),
    updateBy: user.account,
    menu: { set: menuIds.map(id => ({ id })) },
    factory: { set: factoryIds.map(id => ({ id })) },
  },
});
```

- create：未传时默认 `false`。
- update：未传时不改（保留原值）；传 `true/false` 时更新。
- `factoryIds` 行为不变：始终按传入更新关系，与 `grantAllFactories` 解耦。

---

## 5. 前端（vls/client）

### 角色编辑/新建表单

在「分配工厂」区域上方新增一个 Switch：

```
[开] 全部工厂授权（含后续新增）
└── 提示：该角色将自动拥有所有当前及后续新增工厂的查看权限
```

行为：
- 勾选时：下方工厂多选 **disable 但保留已选值**（避免误清空）。
- 不勾选：按原有方式从工厂列表多选。
- 表单提交时一并带上 `grantAllFactories`。

### 角色列表展示

可选：在角色列表表格中加一个标记列「工厂范围：全部 / 自定义」。**本期默认不加，避免列表过宽**——如需后续可加。

---

## 6. 测试要求

### 单元测试

- `hasAllFactoryScope`：
  - admin → `true`
  - 无 grantAll role → `false`
  - 至少一个 grantAll role → `true`
- `getAccessibleFactoryIds`：
  - admin / grantAll role → 返回 `null`
  - 普通 role → 返回基于 roleIds 关联的 factoryIds 数组
  - 用户无任何 role → 返回 `[]`（仍是限定列表，只是为空）

### 集成测试

1. 创建一个 `grantAllFactories = true` 的角色，分配给非 admin 用户：
   - 查 factory list → 返回所有工厂
   - 查 valve list → 返回所有工厂下的阀门
2. 新建一个工厂 → 该用户再次查 factory list → 包含新工厂（**核心场景**）
3. 取消该角色的 `grantAllFactories`：
   - 工厂可见范围回退到 `Role.factory` 中的具体列表
4. 回归：原有 admin / 普通角色行为完全不变。

### 覆盖率目标

按团队规范 ≥ 80%。新增 helper 必须 100%。

---

## 7. 安全与权限

- `grantAllFactories = true` **仅放开工厂数据可见范围**，不放开：
  - 菜单（仍按 `Role.menu` 控制）
  - 用户管理（仍按 `isAdmin` 控制）
  - 角色管理（仍按 `isAdmin` 控制）
- 谁能切换这个开关：复用现有角色编辑权限，不另加限制（角色编辑权限本身已是高权限点）。
- 命名清晰：`grantAllFactories` 在 DTO/UI/DB 全栈一致，避免歧义。

---

## 8. 风险与回滚

### 风险

- 三个调用点改动同时进行，漏改一处即出现「列表显示数据但详情进不去」之类的不一致。**Mitigation：helper 收口 + 集成测试覆盖三个入口。**
- 字段 `grantAllFactories` 后续若要扩展为「全部工厂可写 / 全部工厂可见」两层粒度，可能需要再加字段。**当前需求仅"看"，YAGNI 不预留。**

### 回滚

- 数据库：`grantAllFactories` 字段保留即可（默认 `false`，不影响存量）。
- 代码：revert PR；helper 留下不影响（无调用）。
- 无破坏性 schema 变更，不需要数据迁移回滚脚本。

---

## 9. 提交拆分

按团队 git-workflow 规范，本特性影响多个 scope，拆为以下提交（同一分支）：

| Commit | Scope | 内容 |
|---|---|---|
| 1 | `prisma` | schema 加字段 + migration |
| 2 | `auth` | helper + 三处调用点改造 |
| 3 | `auth` | role.dto / role.service 增减字段 |
| 4 | `auth` | 单元 + 集成测试 |
| 5 | `client`（在 vls/client 仓单独提交） | 前端 Switch |

若 commit 2 + 3 + 4 体量都小，可合并为单条 `feat(auth): ✨ 角色支持全部工厂授权`。

PR 标题：`feat(auth): ✨ 角色支持全部工厂授权（含后续新增）`

---

## 10. 验收清单

- [ ] Prisma migration 应用成功，`Role.grantAllFactories` 字段存在
- [ ] helper 单测全绿，覆盖三类场景
- [ ] 三个调用点集成测试全绿，包括「新建工厂立刻可见」核心场景
- [ ] 前端角色编辑页 Switch 工作正常，提交后字段持久化
- [ ] admin / 普通 role 现有行为无回归
- [ ] `pnpm tsc --noEmit` / `pnpm build` 通过
- [ ] code-reviewer agent review 无 CRITICAL/HIGH 项

---

## 11. 开放问题

无（设计已与用户对齐，方案审定）。
