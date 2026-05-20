-- AddValveFactorySerialPartialUnique
--
-- Why:
--   阀门按 (factoryId, serialNumber) 是唯一身份, 加 partial unique 防止并发/逻辑错误造成同 serial 多条记录。
--   早先 valve 导入 race condition 已在应用层修复 (PR #1), 此 migration 在 DB 层兜底。
--
-- Partial 谓词:
--   排除 NULL / 空串 / 'N/A' 等约定占位值, 因为业务允许同 factory 内多条占位 serial 共存。
--   现实数据例: fid=175 有 213 条 serialNumber='N/A' 是合法的。
--
-- 应用历史:
--   - 生产 (vls-a, 共享 DB 200.200.200.18) 已用 CREATE UNIQUE INDEX CONCURRENTLY 手动建好;
--     部署时通过 `prisma migrate resolve --applied` 标记本 migration 为已应用, 不重复执行 SQL。
--   - 其他环境 (dev / staging / 新建库) 通过 `prisma migrate deploy` 自动应用本 SQL。
--
-- 注意:
--   - 若目标库已存在违反此约束的脏数据 (同 factoryId 下同一非占位 serial 多条), 本 migration 将失败。
--     需先按生产清洗逻辑 (留 createdAt 最早一条, 其余按业务判断删/改) 处理后再 deploy。
--   - 索引未加 CONCURRENTLY: Prisma migrate 默认在事务内执行, CONCURRENTLY 不允许进事务。
--     现 Valve 表数据量 ~1300 行, CREATE INDEX 的短暂表锁可接受。

CREATE UNIQUE INDEX IF NOT EXISTS "Valve_factoryId_serialNumber_partial_key"
  ON "Valve" ("factoryId", "serialNumber")
  WHERE "serialNumber" IS NOT NULL
    AND "serialNumber" NOT IN ('N/A', 'n/a', '无', '-', '/', '待补充', '');
