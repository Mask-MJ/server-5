/**
 * 把 Excel 单元格里的"日期"安全解析为 JS Date。
 * 支持：null/undefined/空串 → null；Date → 原样；
 * ISO 字符串 / YYYY-MM-DD → Date；Excel serial number → Date。
 * 其他不可解析的输入 → throw（由 caller 决定降级策略）。
 *
 * Why: SheetJS 默认 cellDates=false 时 Excel 日期格式单元格会返回 number，
 * 直接当 string 调 .slice 会 TypeError → 整个 import 500。
 */
export function parseExcelDate(value: unknown): Date | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;

  if (typeof value === 'number') {
    // Excel serial epoch = 1899-12-30 (offsets the 1900 leap year bug).
    // 25569 = days between 1899-12-30 and 1970-01-01.
    return new Date(Math.round((value - 25569) * 86_400_000));
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const d = new Date(trimmed);
    if (Number.isNaN(d.getTime())) {
      throw new Error(`无法解析日期: "${value}"`);
    }
    return d;
  }

  throw new Error(`无法解析日期: ${typeof value} ${String(value)}`);
}
