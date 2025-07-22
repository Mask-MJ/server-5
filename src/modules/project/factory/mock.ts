export const mockReport = {
  scoreDistribution: [
    { name: '0-60', value: 10 },
    { name: '100', value: 20 },
    { name: '60-70', value: 30 },
    { name: '70-80', value: 40 },
    { name: '80-90', value: 50 },
    { name: '90-100', value: 60 },
  ],
  valveOverallStatus: [
    { name: '正常', value: 100 },
    { name: '报警', value: 20 },
  ],
  valveQuarterStatus: [
    { name: '第一季度', alert: 20, normal: 100 },
    { name: '第二季度', alert: 30, normal: 200 },
    { name: '第三季度', alert: 40, normal: 300 },
    { name: '第四季度', alert: 50, normal: 350 },
  ],
  valveQuarterStatusTrend: [
    {
      tag: '20-FV-1001',
      data: [
        { name: '7月', value: 70 },
        { name: '8月', value: 80 },
        { name: '9月', value: 90 },
        { name: '10月', value: 50 },
        { name: '11月', value: 40 },
        { name: '12月', value: 70 },
      ],
    },
    {
      tag: '20-FV-1002',
      data: [
        { name: '7月', value: 70 },
        { name: '8月', value: 60 },
        { name: '9月', value: 90 },
        { name: '10月', value: 80 },
        { name: '11月', value: 70 },
        { name: '12月', value: 30 },
      ],
    },
  ],
  newProblem: [
    {
      name: '阀门1',
      tag: '20-FV-1001',
      description: '警报记录已满',
      time: '2024年12月12日',
    },
    {
      name: '阀门2',
      tag: '20-FV-1003',
      description: '警报记录已满',
      time: '2024年12月12日',
    },
  ],
  oldProblem: [
    {
      name: '阀门1',
      tag: '20-FV-1002',
      description: '警报记录已满',
      time: '2022年1月1日',
    },
    {
      name: '阀门2',
      tag: '20-FV-1004',
      description: '警报记录已满',
      time: '2022年1月1日',
    },
  ],
  valveDetails: [
    {
      name: '阀门1',
      tag: '20-FV-1001',
      description: '警报记录已满',
      risk: '当警报记录变“满”时，将不会记录新的潜在警报。',
      measures: '请及时清空警报记录。',
      plot: {
        keywordName: '行程',
        keywordId: 1,
        valveId: 222,
        upperLimit: 100,
        lowerLimit: 0,
        dataLine: [
          46.83, 17.66, 41.32, 98.17, 24.37, 13.45, 8.59, 18.61, 11.29, 30.1,
        ],
        auxiliaryLine: {
          averageValue: [
            36.83, 27.66, 31.32, 78.17, 34.37, 13.45, 8.59, 18.61, 11.29, 30.1,
          ],
        },
        predictionLine: {
          linearRegression: [
            22.83, 44.66, 55.32, 66.17, 77.37, 13.45, 8.59, 18.61, 11.29, 30.1,
          ],
        },
        times: [
          '2024-01-01',
          '2024-01-02',
          '2024-01-03',
          '2024-01-04',
          '2024-01-05',
          '2024-01-06',
          '2024-01-07',
          '2024-01-08',
          '2024-01-09',
          '2024-01-10',
        ],
      },
    },
    {
      name: '阀门2',
      tag: '20-FV-1002',
      description: '警报记录已满',
      risk: '当警报记录变“满”时，将不会记录新的潜在警报。',
      measures: '请及时清空警报记录。',
    },
    {
      name: '阀门3',
      tag: '20-FV-1003',
      description: '警报记录已满',
      risk: '当警报记录变“满”时，将不会记录新的潜在警报。',
      measures: '请及时清空警报记录。',
    },
  ],
  valveDynamicControl: [
    {
      tag: 'tag1',
      data: [
        { time: '2019-01-01 00:00:00', score: 90, description: 'good' },
        { time: '2019-01-01 00:00:01', score: 70, description: 'normal' },
        { time: '2019-01-01 00:00:02', score: 30, description: 'bad' },
      ],
    },
    {
      tag: 'tag2',
      data: [
        { time: '2019-01-01 00:00:00', score: 90, description: 'good' },
        { time: '2019-01-01 00:00:01', score: 70, description: 'normal' },
        { time: '2019-01-01 00:00:02', score: 0, description: 'bad' },
      ],
    },
  ],
  valveTravelHistoryRecord: [
    [
      {
        key: 'number',
        name: '序号',
        value: 1,
        style: null as string | null,
      },
      {
        key: 'tag',
        name: '阀门位号',
        value: 'tag1',
        style: null as string | null,
      },
      {
        key: 'travelLow',
        name: '行程低值',
        value: '20%',
        style: '#ffff00',
      },
      {
        key: 'travelLow',
        name: '行程高值',
        value: '80%',
        style: '#ffff00',
      },
      {
        key: 'globeValve',
        name: 'Globe Valve',
        value: true,
        style: null as string | null,
      },
      {
        key: 'rotaryValve',
        name: 'Rotary Valve',
        value: false,
        style: null as string | null,
      },
      {
        key: 'butteValve',
        name: 'Butte Valve',
        value: false,
        style: null as string | null,
      },
      {
        key: 'size',
        name: '尺寸',
        value: null,
        style: null as string | null,
      },
      {
        key: 'description',
        name: '说明',
        value: null,
        style: null as string | null,
      },
    ],
    [
      {
        key: 'number',
        name: '序号',
        value: 2,
        style: null as string | null,
      },
      {
        key: 'tag',
        name: '阀门位号',
        value: 'tag1',
        style: null as string | null,
      },
      {
        key: 'travelLow',
        name: '行程低值',
        value: '20%',
        style: '#ffff00',
      },
      {
        key: 'travelLow',
        name: '行程高值',
        value: '80%',
        style: '#ffff00',
      },
      {
        key: 'globeValve',
        name: 'Globe Valve',
        value: false,
        style: null as string | null,
      },
      {
        key: 'rotaryValve',
        name: 'Rotary Valve',
        value: false,
        style: null as string | null,
      },
      {
        key: 'butteValve',
        name: 'Butte Valve',
        value: false,
        style: null as string | null,
      },
      {
        key: 'size',
        name: '尺寸',
        value: '80%',
        style: null as string | null,
      },
      {
        key: 'description',
        name: '说明',
        value: '80%',
        style: null as string | null,
      },
    ],
  ],
  cycleAccumulation: [
    {
      number: 1,
      tag: 'tag1',
      data: [
        {
          time: '2023年3月',
          cycleCount: {
            name: '循环计数',
            value: 1,
            style: null as string | null,
          },
          dailyMovementCount: {
            name: '日动作次数',
            value: 11,
            style: '#ffff00',
          },
          travelAccumulator: {
            name: '行程累计器',
            value: 111,
            style: null as string | null,
          },
          amplitudePerAction: {
            name: '次动作幅度',
            value: 1111,
            style: null as string | null,
          },
        },
        {
          time: '2023年4月',
          cycleCount: {
            name: '循环计数',
            value: null,
            style: null as string | null,
          },
          dailyMovementCount: {
            name: '日动作次数',
            value: null,
            style: '#ffff00',
          },
          travelAccumulator: {
            name: '行程累计器',
            value: null,
            style: null as string | null,
          },
          amplitudePerAction: {
            name: '次动作幅度',
            value: null,
            style: null as string | null,
          },
        },
        {
          time: '2023年5月',
          cycleCount: {
            name: '循环计数',
            value: 3,
            style: null as string | null,
          },
          dailyMovementCount: {
            name: '日动作次数',
            value: 33,
            style: '#ffff00',
          },
          travelAccumulator: {
            name: '行程累计器',
            value: 333,
            style: null as string | null,
          },
          amplitudePerAction: {
            name: '次动作幅度',
            value: 3333,
            style: null as string | null,
          },
        },
      ],
    },
  ],
};

export const mockReport2: any = {
  cycleAccumulation: [],
  newProblem: [],
  oldProblem: [],
  scoreDistribution: [
    {
      name: '0-60',
      value: 0,
    },
    {
      name: '100',
      value: 0,
    },
    {
      name: '60-70',
      value: 0,
    },
    {
      name: '70-80',
      value: 0,
    },
    {
      name: '80-90',
      value: 0,
    },
    {
      name: '90-100',
      value: 0,
    },
  ],
  valveDetails: [],
  valveOverallStatus: [
    {
      name: '正常',
      value: 0,
    },
    {
      name: '报警',
      value: 0,
    },
  ],
  valveQuarterStatus: [
    {
      alert: 0,
      name: '第一季度',
      normal: 0,
    },
  ],
  valveQuarterStatusTrend: [],
  valveTravelHistoryRecord: [],
};

export const mockValve = {
  detail: {
    healthIndicator: [
      {
        name: '0-60',
        value: 10,
      },
      {
        name: '100',
        value: 20,
      },
      {
        name: '60-70',
        value: 30,
      },
      {
        name: '70-80',
        value: 40,
      },
      {
        name: '80-90',
        value: 50,
      },
      {
        name: '90-100',
        value: 60,
      },
    ],
    alertIndicator: [
      {
        name: 'normal',
        value: 10,
      },
      {
        name: 'alert',
        value: 20,
      },
    ],
  },
};
