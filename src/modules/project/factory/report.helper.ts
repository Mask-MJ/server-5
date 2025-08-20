import * as echarts from 'echarts';
import {
  AlignmentType,
  ImageRun,
  Paragraph,
  PatchType,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { readFileSync } from 'fs';
import dayjs from 'dayjs';
import { find } from 'lodash';

interface ReportProblemTable {
  tag: string;
  name: string;
  description: string;
  time: string;
}

interface ValveDetail {
  tag: string;
  description: string;
  risk: string;
  measures: string;
  name: string;
  plot?: {
    times: string[];
    upperLimit: number;
    lowerLimit: number;
    dataLine: number[];
    predictionLine: {
      linearRegression: number[];
    };
    auxiliaryLine: {
      averageValue: number[];
    };
  };
}
interface CycleAccumulation {
  number: number;
  tag: string;
  data: {
    time: string;
    cycleCount: { name: string; value: string | number; style: any };
    dailyMovementCount: { name: string; value: string | number; style: any };
    travelAccumulator: { name: string; value: string | number; style: any };
    amplitudePerAction: { name: string; value: string | number; style: any };
  }[];
}

export interface ValveTravelHistoryRecord {
  key: string;
  name: string;
  value: string;
  style: any;
}

const renderTableHeaderRow = (data: string[]) => {
  const children = data.map((item) => {
    return new TableCell({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: item, color: '#ffffff' })],
        }),
      ],
      verticalAlign: VerticalAlign.CENTER,
      shading: {
        fill: 'b79c2f',
        type: ShadingType.SOLID,
        color: '#43545D',
      },
    });
  });
  return new TableRow({ children });
};

const getTableCellStyle = (value: number, type: number) => {
  if (type === 1) {
    if (value >= 85) {
      return '#00b050';
    } else if (value < 85 && value >= 73) {
      return '#ffff00';
    } else if (value < 73 && value > 0) {
      return '#ff0000';
    } else {
      return '#ffffff';
    }
  } else if (type === 2) {
    if (value >= 80) {
      return '#00b050';
    } else if (value < 80 && value >= 73) {
      return '#ffff00';
    } else if (value < 73 && value > 0) {
      return '#ff0000';
    } else {
      return '#6e298d';
    }
  }
};

// 问题表格
export const table_alarm = (data: ReportProblemTable[]) => {
  if (data.length === 0) {
    return {
      type: PatchType.PARAGRAPH,
      children: [new TextRun({ text: ' ' })],
    };
  }
  return {
    type: PatchType.DOCUMENT,
    children: [
      new Table({
        rows: [
          renderTableHeaderRow(['序号', '阀门位号', '问题描述', '报告日期']),
          ...data.map((item, index) => {
            return new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: `${index + 1}` })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: item.tag })],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 4000, type: WidthType.DXA },
                  children: [new Paragraph({ text: item.name })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: item.time })],
                }),
              ],
            });
          }),
        ],
      }),
    ],
  };
};
// 健康饼图
export const chart_valves_health_overview = (
  data: { name: string; value: number }[],
) => {
  const chart = echarts.init(null, null, {
    renderer: 'svg',
    ssr: true,
    width: 250,
    height: 300,
  });
  chart.setOption({
    color: ['#ff0000', '#ffff00', '#00b050', '#00b050', '#00b050'],
    legend: { top: '5%', left: 'center' },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          position: 'inner',
          fontSize: 14,
          color: '#000000',
          formatter: '{c}',
        },
        labelLine: { show: false },
        data,
      },
    ],
  });
  return {
    type: PatchType.PARAGRAPH,
    children: [
      new ImageRun({
        type: 'svg',
        data: Buffer.from(chart.renderToSVGString(), 'utf-8'),
        transformation: { width: 250, height: 300 },
        fallback: {
          type: 'png',
          data: readFileSync('public/linux-png.png'),
        },
      }),
    ],
  };
};
// 告警饼图
export const chart_values_alarm_overivew = (
  data: { name: string; value: number }[],
) => {
  const chart = echarts.init(null, null, {
    renderer: 'svg',
    ssr: true,
    width: 250,
    height: 300,
  });
  chart.setOption({
    color: ['#00b050', '#ff0000'],
    legend: { top: '5%', left: 'center' },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        label: {
          position: 'inner',
          fontSize: 14,
          color: '#000000',
          formatter: '{b}: {c}',
        },
        labelLine: { show: false },
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        data: data.map((item) => {
          return {
            name: item.name,
            value: item.value,
            itemStyle: {
              color: item.name === '正常' ? '#00b050' : '#ff0000',
            },
          };
        }),
      },
    ],
  });
  return {
    type: PatchType.PARAGRAPH,
    children: [
      new ImageRun({
        type: 'svg',
        data: Buffer.from(chart.renderToSVGString(), 'utf-8'),
        transformation: { width: 250, height: 300 },
        fallback: {
          type: 'png',
          data: readFileSync('public/linux-png.png'),
        },
      }),
    ],
  };
};
// 状况状态柱状图
export const chart_valves_quarter = (
  data: { name: string; alert: number; normal: number }[],
) => {
  const names = data.map((item) => item.name);
  const alerts = data.map((item) => item.alert);
  const normals = data.map((item) => item.normal);
  const chart = echarts.init(null, null, {
    renderer: 'svg',
    ssr: true,
    width: 500,
    height: 300,
  });
  chart.setOption({
    color: ['#00b050', '#ff0000'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [{ type: 'category', data: names }],
    yAxis: [{ type: 'value' }],
    series: [
      {
        name: '正常',
        type: 'bar',
        stack: 'Ad',
        label: {
          show: true,
          position: 'inside',
          color: '#000000',
          formatter: '{c}',
        },
        itemStyle: { color: '#00b050' },
        data: normals,
      },
      {
        name: '告警',
        type: 'bar',
        stack: 'Ad',
        label: {
          show: true,
          position: 'inside',
          color: '#000000',
          formatter: '{c}',
        },
        itemStyle: { color: '#ff0000' },
        data: alerts,
      },
    ],
  });
  return {
    type: PatchType.PARAGRAPH,
    children: [
      new TextRun({ text: ` `, break: 1 }),
      new ImageRun({
        type: 'svg',
        data: Buffer.from(chart.renderToSVGString(), 'utf-8'),
        transformation: { width: 500, height: 300 },
        fallback: {
          type: 'png',
          data: readFileSync('public/linux-png.png'),
        },
      }),
    ],
  };
};
// 阀门健康趋势
export const table_valves_health_month = (
  data: { tag: string; data: { name: string; value: number }[] }[],
) => {
  if (data.length === 0) {
    return {
      type: PatchType.PARAGRAPH,
      children: [new TextRun({ text: ' ' })],
    };
  }
  return {
    type: PatchType.DOCUMENT,
    children: [
      new Table({
        width: {
          size: 9000,
          type: WidthType.DXA,
        },
        rows: [
          renderTableHeaderRow([
            '序号',
            '阀门位号',
            ...data[0].data.map((i) => i.name),
          ]),
          ...data.map((item, index) => {
            return new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: `${index + 1}` })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: item.tag })],
                    }),
                  ],
                }),
                ...item.data.map((i) => {
                  return new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: `${i.value}`,
                            color: '#000000',
                          }),
                        ],
                      }),
                    ],
                    shading: {
                      fill: 'b79c2f',
                      type: ShadingType.SOLID,
                      color: getTableCellStyle(i.value, 1),
                    },
                  });
                }),
              ],
            });
          }),
        ],
      }),
    ],
  };
};
// 问题详情列表
export const detail_valves_alarm = (data: ValveDetail[]) => {
  return {
    type: PatchType.DOCUMENT,
    children: [
      ...data.map((item, index) => {
        let chart: echarts.ECharts | undefined = undefined;
        // item.plot 不是空对象
        if (
          item.plot &&
          Object.keys(item.plot).length > 0 &&
          item.plot.times &&
          item.plot.dataLine
        ) {
          const max = Math.max(
            ...item.plot.dataLine,
            item.plot.upperLimit || 0,
          );
          const min = Math.min(
            ...item.plot.dataLine,
            item.plot.lowerLimit || 0,
          );
          const lowerLimit = Number(item.plot.lowerLimit || 0);
          const upperLimit = Number(item.plot.upperLimit || 0);
          chart = echarts.init(null, null, {
            renderer: 'svg',
            ssr: true,
            width: 400,
            height: 300,
          });
          chart.setOption({
            color: ['#00b050', '#6e298d', '#ffff00', '#ff0000'],
            legend: { data: ['数据线', '预测线', '辅助线', '标准线'] },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: item.plot.times },
            yAxis: { type: 'value', max, min },
            label: {
              fontSize: 14,
            },
            series: [
              {
                type: 'line',
                name: '数据线',
                data: item.plot.dataLine,
                label: { show: true, position: 'top', color: '#000000' },
              },
              {
                type: 'line',
                name: '预测线',
                data: item.plot.predictionLine.linearRegression,
                label: { show: true, position: 'top', color: '#000000' },
              },
              {
                type: 'line',
                name: '辅助线',
                data: item.plot.auxiliaryLine.averageValue,
                label: { show: true, position: 'top', color: '#000000' },
              },
              {
                type: 'line',
                name: '标准线',
                label: { show: true, position: 'top', color: '#000000' },
                markLine: {
                  lineStyle: { color: 'red' },
                  data: [
                    { name: '下限值', yAxis: lowerLimit },
                    { name: '上限值', yAxis: upperLimit },
                  ],
                },
              },
            ],
          });
        }
        return new Paragraph({
          children: [
            new TextRun({
              text: `问题${index + 1}： ${item.name || ''}`,
              bold: true,
              break: 1,
            }),
            new TextRun({ text: `阀门位号：${item.tag}`, break: 1 }),
            new TextRun({ text: `问题描述：${item.description}`, break: 1 }),
            new TextRun({ text: `潜在风险：${item.risk}`, break: 1 }),
            new TextRun({ text: `建议措施：${item.measures}`, break: 1 }),
            new TextRun({ text: ` `, break: 1 }),

            chart &&
              new ImageRun({
                type: 'svg',
                data: Buffer.from(chart.renderToSVGString(), 'utf-8'),
                transformation: { width: 500, height: 300 },
                fallback: {
                  type: 'png',
                  data: readFileSync('public/linux-png.png'),
                },
              }),
          ],
        });
      }),
    ],
  };
};
// 动态控制 性能趋势
export const table_dynamic_control_month = (
  data: {
    tag: string;
    data: { time: string; score: number; description: string }[];
  }[],
) => {
  if (data.length === 0) {
    return {
      type: PatchType.PARAGRAPH,
      children: [new TextRun({ text: ' ' })],
    };
  }
  const times = data[0].data.map((i) => dayjs(i.time).format('YYYY-MM-DD'));
  return {
    type: PatchType.DOCUMENT,
    children: [
      new Table({
        rows: [
          renderTableHeaderRow(['序号', '阀门位号', ...times]),
          ...data.map((item, index) => {
            return new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: `${index + 1}` })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: item.tag })],
                    }),
                  ],
                }),
                ...item.data.map((i) => {
                  return new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: `${i.description}`,
                            color: '#ffffff',
                          }),
                        ],
                      }),
                    ],
                    shading: {
                      fill: 'b79c2f',
                      type: ShadingType.SOLID,
                      color: getTableCellStyle(i.score, 2),
                    },
                  });
                }),
              ],
            });
          }),
        ],
      }),
    ],
  };
};
// 季度阀门行程历史记录
export const table_valves_travel_month = (
  data: ValveTravelHistoryRecord[][],
) => {
  if (data.length === 0) {
    return {
      type: PatchType.PARAGRAPH,
      children: [new TextRun({ text: ' ' })],
    };
  }
  const tableHeaderRow = data[0].map((i) => i.name);
  return {
    type: PatchType.DOCUMENT,
    children: [
      new Table({
        rows: [
          renderTableHeaderRow(tableHeaderRow),
          ...data.map((item) => {
            const children: any[] = [];
            for (let i = 0; i < item.length; i++) {
              const cell = find(item, (o) => o.name === tableHeaderRow[i]);
              if (!cell) {
                continue;
              }
              const getCellValue = (cell: ValveTravelHistoryRecord) => {
                if (
                  ['globeValve', 'rotaryValve', 'butteValve'].includes(cell.key)
                ) {
                  return cell.value ? '✓' : '';
                }
                return cell.value ? cell.value + '' : '';
              };
              children.push(
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: getCellValue(cell),
                          color: cell.style ? '#000000' : '#000000',
                        }),
                      ],
                    }),
                  ],
                  shading: {
                    fill: 'b79c2f',
                    type: ShadingType.SOLID,
                    color: cell.style || '#ffffff',
                  },
                }),
              );
            }
            return new TableRow({ children });
          }),
        ],
      }),
    ],
  };
};
// 周期计数/行程百分比累积
export const table_cyclecount_travelaccumulate = (
  data: CycleAccumulation[],
) => {
  if (data.length === 0) {
    return {
      type: PatchType.PARAGRAPH,
      children: [new TextRun({ text: ' ' })],
    };
  }
  const times = data[0].data.map((i) => i.time);
  const headerBase = ['序号', '阀门位号'];
  const header = ['循环计数', '日动作次数', '行程累计器', '次动作幅度'];
  // 根据时间生成表头
  const row1 = new TableRow({
    children: [
      ...headerBase.map((item) => {
        return new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: item || '', color: '#000000' })],
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          shading: {
            fill: 'b79c2f',
            type: ShadingType.SOLID,
            color: '#43545D',
          },
        });
      }),
      ...header.map((item) => {
        return new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: item || '', color: '#ffffff' })],
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          columnSpan: 3,
          shading: {
            fill: 'b79c2f',
            type: ShadingType.SOLID,
            color: '#43545D',
          },
        });
      }),
    ],
  });
  const timesRow = times.map((item) => {
    return new TableCell({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: item + '', color: '#ffffff' })],
        }),
      ],
      verticalAlign: VerticalAlign.CENTER,
      columnSpan: 1,
      shading: {
        fill: 'b79c2f',
        type: ShadingType.SOLID,
        color: '#43545D',
      },
    });
  });

  const timesRow2: any[] = [];
  header.map(() => {
    timesRow2.push(...timesRow);
  });

  // https://github.com/dolanmiu/docx/issues/695
  return {
    type: PatchType.DOCUMENT,
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          row1,
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: '', color: '#ffffff' })],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: '', color: '#ffffff' })],
                  }),
                ],
              }),
              ...timesRow2,
            ],
          }),
          ...data.map((item) => {
            const children: any[] = [
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: `${item.number}` })],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: item.tag || '' })],
                  }),
                ],
              }),
            ];
            // 获取阀门月份数组
            const valveMonth = item.data.map((i) => i.time);
            console.log(valveMonth);
            const valveHeader = [
              'cycleCount',
              'dailyMovementCount',
              'travelAccumulator',
              'amplitudePerAction',
            ];
            // 查找 valveHeader 中 time 对应的数据
            valveHeader.forEach(
              (i: Exclude<keyof CycleAccumulation['data'][0], 'time'>) => {
                // 根据顺序获取对应的月份数据
                valveMonth.forEach((month) => {
                  const cell = find(item.data, (o) => o.time === month);
                  if (!cell) {
                    return;
                  }
                  children.push(
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: `${cell[i].value || ''}`,
                              color: cell[i].style ? '#000000' : '#000000',
                            }),
                          ],
                        }),
                      ],
                      shading: {
                        fill: 'b79c2f',
                        type: ShadingType.SOLID,
                        color: cell[i].style || '#ffffff',
                      },
                    }),
                  );
                });
              },
            );
            return new TableRow({ children });
          }),
        ],
      }),
    ],
  };
};
