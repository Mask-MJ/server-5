import { parseExcelDate } from './parse-excel-date';

describe('parseExcelDate', () => {
  it('returns null for null', () => {
    expect(parseExcelDate(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(parseExcelDate(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseExcelDate('')).toBeNull();
  });

  it('returns null for whitespace-only string', () => {
    expect(parseExcelDate('   ')).toBeNull();
  });

  it('returns the same Date instance content when given a Date', () => {
    const d = new Date('2012-01-01T00:00:00.000Z');
    expect(parseExcelDate(d)?.getTime()).toBe(d.getTime());
  });

  it('parses ISO string with Z suffix', () => {
    const result = parseExcelDate('2012-01-01T00:00:00.000Z');
    expect(result?.toISOString()).toBe('2012-01-01T00:00:00.000Z');
  });

  it('parses simple YYYY-MM-DD date string', () => {
    const result = parseExcelDate('2012-01-01');
    expect(result?.toISOString()).toBe('2012-01-01T00:00:00.000Z');
  });

  it('parses Excel serial number (1900-based, leap-year bug compensated)', () => {
    // Excel serial 40909 = 2012-01-01
    const result = parseExcelDate(40909);
    expect(result?.toISOString()).toBe('2012-01-01T00:00:00.000Z');
  });

  it('throws Error for invalid string', () => {
    expect(() => parseExcelDate('not a date')).toThrow(/无法解析日期/);
  });

  it('throws Error for non-supported type (boolean)', () => {
    expect(() => parseExcelDate(true as unknown)).toThrow(/无法解析日期/);
  });
});
