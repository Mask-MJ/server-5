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

const getTableCellStyle = (value: number) => {
  if (value >= 85) {
    return '#62BB46';
  } else if (value < 85 && value >= 60) {
    return '#FFCF22';
  } else {
    return '#D31145';
  }
};

// 生成工厂中所有阀门问题表格
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
// 生成工厂中所有阀门健康饼图
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
// 生成工厂中所有阀门告警饼图
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
// 生成工厂中所有阀门状况状态柱状图
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
// 生成工厂中所有阀门月度状态趋势表格
export const table_valves_health_month = (
  data: { tag: string; data: { name: string; value: number }[] }[],
) => {
  return {
    type: PatchType.DOCUMENT,
    children: [
      new Table({
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
                      color: getTableCellStyle(i.value),
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
// 生成工厂中所有阀门问题详情列表
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
