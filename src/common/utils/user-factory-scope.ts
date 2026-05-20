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
