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
  description: string;
  time: string;
}

interface ValveDetail {
  tag: string;
  description: string;
  risk: string;
  measures: string;
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

type CycleAccumulationKeys = keyof CycleAccumulation['data'][0];

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
      return '#62BB46';
    } else if (value < 85 && value >= 60) {
      return '#FFCF22';
    } else {
      return '#D31145';
    }
  } else if (type === 2) {
    if (value >= 80) {
      return '#62BB46';
    } else if (value < 80 && value >= 60) {
      return '#FFCF22';
    } else if (value < 60 && value > 0) {
      return '#D31145';
    } else {
      return '#6E298D';
    }
  }
};

// 问题表格
export const table_alarm = (data: ReportProblemTable[]) => {
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
                  children: [new Paragraph({ text: item.description })],
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
        label: { show: false, position: 'center' },
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
    legend: { top: '5%', left: 'center' },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '70%',
        label: { show: false },
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
    width: 600,
    height: 400,
  });
  chart.setOption({
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
      { name: '正常', type: 'bar', stack: 'Ad', data: normals },
      { name: '告警', type: 'bar', stack: 'Ad', data: alerts },
    ],
  });
  return {
    type: PatchType.PARAGRAPH,
    children: [
      new ImageRun({
        type: 'svg',
        data: Buffer.from(chart.renderToSVGString(), 'utf-8'),
        transformation: { width: 600, height: 400 },
        fallback: {
          type: 'png',
          data: readFileSync('public/linux-png.png'),
        },
      }),
    ],
  };
};
// 月度状态趋势表格
export const table_valves_health_month = (
  data: { tag: string; data: { name: string; value: number }[] }[],
) => {
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
                            color: '#ffffff',
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
        return new Paragraph({
          children: [
            new TextRun({ text: `问题${index + 1}：`, bold: true, break: 1 }),
            new TextRun({ text: `阀门位号：${item.tag}`, break: 1 }),
            new TextRun({ text: `问题描述：${item.description}`, break: 1 }),
            new TextRun({ text: `潜在风险：${item.risk}`, break: 1 }),
            new TextRun({ text: `建议措施：${item.measures}`, break: 1 }),
            // new Paragraph({
            //   children: [new TextRun({ text: `问题${index + 1}：` })],
            // }),
            // new Paragraph({
            //   children: [new TextRun({ text: `阀门位号：${item.tag}` })],
            // }),
            // new Paragraph({
            //   children: [
            //     new TextRun({ text: `问题描述：${item.description}` }),
            //   ],
            // }),
            // new Paragraph({
            //   children: [new TextRun({ text: `潜在风险：${item.risk}` })],
            // }),
            // new Paragraph({
            //   children: [new TextRun({ text: `建议措施：${item.measures}` })],
            // }),
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
  const times = data[0].data.map((i) => dayjs(i.time).format('YYYY-MM-DD'));
  console.log(times);
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
  console.log(data);
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
              children.push(
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `${cell.value}`,
                          color: cell.style ? '#ffffff' : '#000000',
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
              children: [new TextRun({ text: item, color: '#ffffff' })],
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          // columnSpan: 1,
          // rowSpan: 2,
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
              children: [new TextRun({ text: item, color: '#ffffff' })],
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
                    children: [new TextRun({ text: item.tag })],
                  }),
                ],
              }),
            ];
            item.data.forEach((i) => {
              Object.keys(i).forEach((key: CycleAccumulationKeys) => {
                if (key === 'time') {
                  return;
                }
                children.push(
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: `${i[key].value}`,
                            color: i[key].style ? '#ffffff' : '#000000',
                          }),
                        ],
                      }),
                    ],
                    shading: {
                      fill: 'b79c2f',
                      type: ShadingType.SOLID,
                      color: i[key].style || '#ffffff',
                    },
                  }),
                );
              });
            });
            return new TableRow({ children });
          }),
        ],
      }),
    ],
  };
};
