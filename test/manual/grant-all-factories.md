# 「全部工厂授权」手工集成验证

> 适用：vls/server 在 dev 或 staging 环境部署后，验证 `grantAllFactories` 角色字段端到端工作。
>
> 前置：已通过 `prisma migrate deploy` 应用 migration `20260520143701_add_role_grant_all_factories`。
>
> 路由前缀：本项目通过 `setGlobalPrefix(PREFIX)` 统一加全局前缀（`PREFIX` 取自 env，常见值为 `api`）；
> 业务路由再叠加 `RouterModule` 注册的二级前缀（如 `system` / `project`）。
> 下文以 `BASE=http://localhost:3000/api` 占位，按实际部署调整。
>
> 响应格式：`FormatResponse` 拦截器**不包 `{ code, data }` 信封**——非分页接口直接返回原始对象，
> 分页接口返回 `{ rows, page, pageSize, total }` 顶层结构。jq 取值时注意区分。

## 准备

```bash
export BASE="http://localhost:3000/api"   # 按实际部署调整 PREFIX

# 用 admin 账号登录拿 token
ADMIN_TOKEN=$(curl -s -X POST "$BASE/authentication/sign-in" \
  -H "Content-Type: application/json" \
  -d '{"account":"admin","password":"<admin-pwd>"}' \
  | jq -r '.accessToken')

echo "$ADMIN_TOKEN"  # 应为有效 JWT
```

> sign-in 返回顶层 `{ accessToken, refreshToken }`，故 jq 取 `.accessToken`（不是 `.data.accessToken`）。

## 1. 创建 grant-all 角色

```bash
ROLE_ID=$(curl -s -X POST "$BASE/system/role" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"leader-test",
    "value":"leader-test",
    "sort":1,
    "menuIds":[],
    "factoryIds":[],
    "grantAllFactories":true
  }' | jq -r '.id')

echo "ROLE_ID=$ROLE_ID"
```

预期：返回的 role 对象顶层包含 `"grantAllFactories": true`，`id` 为新生成的数字 ID。

## 2. 创建非 admin 测试用户并绑定该角色

```bash
LEADER_ID=$(curl -s -X POST "$BASE/system/user" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "account":"leader1",
    "password":"Test1234",
    "nickname":"leader1",
    "roleIds":['"$ROLE_ID"']
  }' | jq -r '.id')

echo "LEADER_ID=$LEADER_ID"
```

> 字段名以 `src/modules/system/user/user.dto.ts` (`CreateUserDto`) 为准，当前确认使用 `roleIds: number[]`。
> 注意：`CreateUserDto` 没有 `isAdmin` 字段，是否管理员通过角色判定，无需显式传。

## 3. 创建两个测试工厂（admin 身份）

```bash
F_A=$(curl -s -X POST "$BASE/project/factory" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"F-A"}' | jq -r '.id')
F_B=$(curl -s -X POST "$BASE/project/factory" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"F-B"}' | jq -r '.id')
echo "F-A=$F_A  F-B=$F_B"
```

## 4. 用 leader1 登录拿 token

```bash
LEADER_TOKEN=$(curl -s -X POST "$BASE/authentication/sign-in" \
  -H "Content-Type: application/json" \
  -d '{"account":"leader1","password":"Test1234"}' \
  | jq -r '.accessToken')

echo "$LEADER_TOKEN"
```

## 5. 验证：leader1 能看到所有工厂

```bash
curl -s -X GET "$BASE/project/factory?page=1&pageSize=100" \
  -H "Authorization: Bearer $LEADER_TOKEN" | jq '.rows[] | .name'
```

**预期：** 输出包含 `"F-A"` 和 `"F-B"`。

> 分页响应是顶层 `{ rows, page, pageSize, total }`，故 jq 取 `.rows[]`（不是 `.data.rows[]`）。

## 6. 核心验证：新建工厂自动可见

用 admin 创建一个新工厂 F-C：

```bash
F_C=$(curl -s -X POST "$BASE/project/factory" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"F-C"}' | jq -r '.id')
echo "F-C=$F_C"
```

立刻用 leader1 再查：

```bash
curl -s -X GET "$BASE/project/factory?page=1&pageSize=100" \
  -H "Authorization: Bearer $LEADER_TOKEN" | jq '.rows[] | .name'
```

**预期（核心验收点）：** 输出包含 `"F-A"`、`"F-B"`、`"F-C"`，且过程中未对 `leader-test` 角色做任何额外操作。

## 7. valve 列表也无 factoryId 限制

```bash
curl -s -X GET "$BASE/project/valve?page=1&pageSize=10" \
  -H "Authorization: Bearer $LEADER_TOKEN" | jq '.total'
```

**预期：** 返回 leader1 视角下所有工厂的阀门总数（应等于 admin 视角下的阀门数；若 DB 中无阀门则为 0）。

可同时对比 admin 视角：

```bash
curl -s -X GET "$BASE/project/valve?page=1&pageSize=10" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.total'
```

两者应一致。

## 8. 关闭 grantAllFactories，验证回退

```bash
curl -s -X PATCH "$BASE/system/role/$ROLE_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "id":'"$ROLE_ID"',
    "name":"leader-test",
    "value":"leader-test",
    "sort":1,
    "menuIds":[],
    "factoryIds":['"$F_A"'],
    "grantAllFactories":false
  }'

# leader1 再次查
curl -s -X GET "$BASE/project/factory?page=1&pageSize=100" \
  -H "Authorization: Bearer $LEADER_TOKEN" | jq '.rows[] | .name'
```

**预期：** 仅返回 `"F-A"`，回退到按 `factoryIds` 列表过滤的原行为。

## 9. 清理

```bash
# 按本项目实际 DELETE 接口清理测试数据
curl -X DELETE "$BASE/system/user/$LEADER_ID"   -H "Authorization: Bearer $ADMIN_TOKEN"
curl -X DELETE "$BASE/system/role/$ROLE_ID"     -H "Authorization: Bearer $ADMIN_TOKEN"
curl -X DELETE "$BASE/project/factory/$F_A"     -H "Authorization: Bearer $ADMIN_TOKEN"
curl -X DELETE "$BASE/project/factory/$F_B"     -H "Authorization: Bearer $ADMIN_TOKEN"
curl -X DELETE "$BASE/project/factory/$F_C"     -H "Authorization: Bearer $ADMIN_TOKEN"
```

> 若工厂下挂了阀门 / 关联数据，DELETE 可能因外键约束失败；按需先清子表或改用 `factory/removeAll`。

## 验收清单

- [ ] Step 5 leader1 能看到现有工厂（F-A, F-B）
- [ ] **Step 6 新建工厂 F-C 后 leader1 立即可见（核心场景，无需任何角色调整）**
- [ ] Step 7 valve 列表与 admin 视角总数一致，无 factoryId 限制
- [ ] Step 8 关闭 `grantAllFactories` 后回退到 `factoryIds` 列表行为，仅看到 F-A
