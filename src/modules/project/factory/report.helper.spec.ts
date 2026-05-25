import {
  buildAlarmChartOption,
  table_valves_travel_month,
} from './report.helper';
import type { ValveDetailItem } from './report.helper';

describe('buildAlarmChartOption', () => {
  const basePlot: NonNullable<ValveDetailItem['plot']> = {
    times: ['2025-05-15', '2025-06-15'],
    upperLimit: 5,
    lowerLimit: 1,
    dataLine: [0.19, 6.56],
    predictionLine: { linearRegression: [0.5, 6] },
    auxiliaryLine: { averageValue: [3.38, 3.38] },
  };

  it('yAxis.max is rounded UP to the next integer (B6)', () => {
    const opt = buildAlarmChartOption(basePlot);
    // raw max in dataLine is 6.56 → expect 7
    expect((opt.yAxis as { max: number }).max).toBe(7);
  });

  it('yAxis.min is rounded DOWN to the previous integer (B6)', () => {
    const opt = buildAlarmChartOption({
      ...basePlot,
      dataLine: [0.19, 6.56],
      lowerLimit: 0.5,
    });
    // raw min = min(0.19, 0.5) = 0.19 → expect 0
    expect((opt.yAxis as { min: number }).min).toBe(0);
  });

  it('series renders 标准线 → 平均值 → 预测线 → 数据线 (B8 data line on top)', () => {
    const opt = buildAlarmChartOption(basePlot);
    const series = opt.series as Array<{ name: string }>;
    expect(series.map((s) => s.name)).toEqual([
      '标准线',
      '平均值',
      '预测线',
      '数据线',
    ]);
  });

  it('legend label renames 辅助线 → 平均值 (B9)', () => {
    const opt = buildAlarmChartOption(basePlot);
    const legend = opt.legend as { data: string[] };
    expect(legend.data).toContain('平均值');
    expect(legend.data).not.toContain('辅助线');
  });

  it('series colors match frontend ECharts default palette by name (B7)', () => {
    // 前端 (client) ChartModal/workTable 不设 color, 用 ECharts 默认调色板,
    // 按前端 series 顺序 [数据线, 预测线, 辅助线, 标准线] = [蓝, 绿, 黄, 红]
    // PDF 这边 series 重排 (B8 为让数据线在最上层), 因此必须按 name 显式绑色
    const opt = buildAlarmChartOption(basePlot);
    const series = opt.series as Array<{
      name: string;
      itemStyle?: { color: string };
      lineStyle?: { color: string };
    }>;
    const byName = Object.fromEntries(series.map((s) => [s.name, s]));
    expect(byName['数据线'].itemStyle?.color).toBe('#5470c6'); // ECharts 默认 [0] 蓝
    expect(byName['预测线'].itemStyle?.color).toBe('#91cc75'); // ECharts 默认 [1] 绿
    expect(byName['平均值'].itemStyle?.color).toBe('#fac858'); // ECharts 默认 [2] 黄
    expect(byName['标准线'].itemStyle?.color).toBe('#ee6666'); // ECharts 默认 [3] 红
  });
});

describe('table_valves_travel_month', () => {
  it('returns explicit notice text when records is empty (B2)', () => {
    const result = table_valves_travel_month({
      records: [],
      descriptions: [],
    });
    const json = JSON.stringify(result);
    expect(json).toContain('未发现阀门超出有效Cv操作区间');
  });
});
