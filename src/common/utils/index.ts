import dayjs from 'dayjs';

export function getLast12Months(): {
  start: string;
  end: string;
  label: string;
}[] {
  const months = [];
  const currentMonth = dayjs();
  for (let i = 0; i < 12; i++) {
    const month = currentMonth.subtract(i, 'month');
    months.push({
      start: month.startOf('month').toISOString(),
      end: month.endOf('month').toISOString(),
      label: month.format('YYYY-MM'),
    });
  }
  return months.reverse(); // 按时间顺序排列
}
