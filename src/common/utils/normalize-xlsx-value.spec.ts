import { toStr, toIntOrNull } from './normalize-xlsx-value';

describe('toStr', () => {
  it.each([
    [null, ''],
    [undefined, ''],
    ['', ''],
    ['hello', 'hello'],
    [30, '30'], // 卡博特 xlsx 实锤场景:actuatorSize 是 number
    [0, '0'],
    [3.14, '3.14'],
    [true, 'true'],
    [false, 'false'],
  ])('toStr(%p) → %p', (input, expected) => {
    expect(toStr(input)).toBe(expected);
  });

  it('preserves leading/trailing whitespace (no auto-trim)', () => {
    expect(toStr('  hello  ')).toBe('  hello  ');
  });
});

describe('toIntOrNull', () => {
  it.each([
    [null, null],
    [undefined, null],
    ['', null],
    [' ', null],
    ['-', null],
    ['/', null],
    ['无', null],
    ['N/A', null],
    [10, 10],
    [10.7, 10], // 截断小数
    ['10', 10],
    ['  10  ', 10],
    [0, 0], // 重要:0 不应被当作 null(旧代码 `qty ? Number(qty) : null` 把 0 错当 null)
    ['0', 0],
    [NaN, null],
    [Infinity, null],
    ['abc', null],
  ])('toIntOrNull(%p) → %p', (input, expected) => {
    expect(toIntOrNull(input)).toBe(expected);
  });
});
