/**
 * 把 xlsx 单元格里任意类型的值归一化为 Prisma 期望的类型。
 *
 * Why: SheetJS 解析时若用户把列填成"数字"格式(如 actuatorSize=30),返回的是 number
 * 类型;而 Prisma schema 里这些列是 String?,直接喂会触发 PrismaClientValidationError。
 * 卡博特蓝星化工 xlsx 已在生产实测复现该问题(60/62 行全部 skipped)。
 *
 * 不在 schema/类型系统层信任 xlsx 解析结果,而是在系统边界统一归一化,符合
 * "validate at system boundaries" 原则。
 */

/** 把任意值归一化为 string:null/undefined → ''、其它类型 → String(v)。不做 trim,避免吞掉用户的预期空格。 */
export function toStr(v: unknown): string {
  if (v === null || v === undefined) return '';
  return typeof v === 'string' ? v : String(v);
}

/** 把任意值归一化为 Int|null:用于 sovQty / lsQty 等数量列。空串、占位符、NaN 一律 null。 */
export function toIntOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') {
    return Number.isFinite(v) ? Math.trunc(v) : null;
  }
  const s = String(v).trim();
  if (!s || s === '-' || s === '/' || s === '无' || s === 'N/A') return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
