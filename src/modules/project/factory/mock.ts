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
      tag: '20-FV-1001',
      items: [
        {
          name: '阀门1',
          sort: '问题1',
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
              46.83, 17.66, 41.32, 98.17, 24.37, 13.45, 8.59, 18.61, 11.29,
              30.1,
            ],
            auxiliaryLine: {
              averageValue: [
                36.83, 27.66, 31.32, 78.17, 34.37, 13.45, 8.59, 18.61, 11.29,
                30.1,
              ],
            },
            predictionLine: {
              linearRegression: [
                22.83, 44.66, 55.32, 66.17, 77.37, 13.45, 8.59, 18.61, 11.29,
                30.1,
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
          name: '阀门1',
          sort: '问题2',
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
              46.83, 17.66, 41.32, 98.17, 24.37, 13.45, 8.59, 18.61, 11.29,
              30.1,
            ],
            auxiliaryLine: {
              averageValue: [
                36.83, 27.66, 31.32, 78.17, 34.37, 13.45, 8.59, 18.61, 11.29,
                30.1,
              ],
            },
            predictionLine: {
              linearRegression: [
                22.83, 44.66, 55.32, 66.17, 77.37, 13.45, 8.59, 18.61, 11.29,
                30.1,
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
      ],
    },
    {
      tag: '20-FV-1002',
      items: [
        {
          name: '阀门2',
          sort: '问题1',
          tag: '20-FV-1002',
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
              46.83, 17.66, 41.32, 98.17, 24.37, 13.45, 8.59, 18.61, 11.29,
              30.1,
            ],
            auxiliaryLine: {
              averageValue: [
                36.83, 27.66, 31.32, 78.17, 34.37, 13.45, 8.59, 18.61, 11.29,
                30.1,
              ],
            },
            predictionLine: {
              linearRegression: [
                22.83, 44.66, 55.32, 66.17, 77.37, 13.45, 8.59, 18.61, 11.29,
                30.1,
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
          sort: '问题2',
          tag: '20-FV-1002',
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
              46.83, 17.66, 41.32, 98.17, 24.37, 13.45, 8.59, 18.61, 11.29,
              30.1,
            ],
            auxiliaryLine: {
              averageValue: [
                36.83, 27.66, 31.32, 78.17, 34.37, 13.45, 8.59, 18.61, 11.29,
                30.1,
              ],
            },
            predictionLine: {
              linearRegression: [
                22.83, 44.66, 55.32, 66.17, 77.37, 13.45, 8.59, 18.61, 11.29,
                30.1,
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
      ],
    },
    {
      tag: '20-FV-1003',
      items: [
        {
          name: '阀门3',
          sort: '问题1',
          tag: '20-FV-1003',
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
              46.83, 17.66, 41.32, 98.17, 24.37, 13.45, 8.59, 18.61, 11.29,
              30.1,
            ],
            auxiliaryLine: {
              averageValue: [
                36.83, 27.66, 31.32, 78.17, 34.37, 13.45, 8.59, 18.61, 11.29,
                30.1,
              ],
            },
            predictionLine: {
              linearRegression: [
                22.83, 44.66, 55.32, 66.17, 77.37, 13.45, 8.59, 18.61, 11.29,
                30.1,
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
          name: '阀门3',
          sort: '问题2',
          tag: '20-FV-1003',
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
              46.83, 17.66, 41.32, 98.17, 24.37, 13.45, 8.59, 18.61, 11.29,
              30.1,
            ],
            auxiliaryLine: {
              averageValue: [
                36.83, 27.66, 31.32, 78.17, 34.37, 13.45, 8.59, 18.61, 11.29,
                30.1,
              ],
            },
            predictionLine: {
              linearRegression: [
                22.83, 44.66, 55.32, 66.17, 77.37, 13.45, 8.59, 18.61, 11.29,
                30.1,
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
      ],
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
  valveTravelHistoryRecord: {
    records: [
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
          style: null,
        },
        {
          key: 'tag',
          name: '阀门位号',
          value: 'FV-4032',
          style: null,
        },
        {
          key: 'travelLow',
          name: '行程低值',
          value: '-0.13%',
          style: '#6E298D',
        },
        {
          key: 'travelHigh',
          name: '行程高值',
          value: '83.11%',
          style: '#FF0000',
        },
        {
          key: 'globeValve',
          name: 'Globe Valve',
          value: false,
          style: null,
        },
        {
          key: 'rotaryValve',
          name: 'Rotary Valve',
          value: false,
          style: null,
        },
        {
          key: 'butteValve',
          name: 'Butterfly Valve',
          value: true,
          style: null,
        },
        {
          key: 'size',
          name: '尺寸',
          value: '8 inch',
          style: null,
        },
        {
          key: 'description',
          name: '说明',
          value: '问题1',
          style: null,
        },
      ],
    ],
    descriptions: [
      '问题1: xxx',
      '问题2: xxx',
      '问题3: xxx',
      '问题4: xxx',
      '问题5: xxx',
    ],
  },

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

export const mockReport3: any = {
  cycleAccumulation: [
    {
      data: [
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: null },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/08/01-2025/08/30',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: null,
          },
        },
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: null },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/08/31-2025/09/29',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: null,
          },
        },
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: {
            name: '循环计数',
            style: null,
            value: 1238202,
          },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/09/30-2025/10/29',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: 4916262,
          },
        },
      ],
      number: 1,
      tag: 'FV-312604',
    },
    {
      data: [
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: null },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/08/01-2025/08/30',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: null,
          },
        },
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: null },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/08/31-2025/09/29',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: null,
          },
        },
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: 57945 },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/09/30-2025/10/29',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: 230040,
          },
        },
      ],
      number: 2,
      tag: 'FV-309215',
    },
    {
      data: [
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: null },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/08/01-2025/08/30',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: null,
          },
        },
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: null },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/08/31-2025/09/29',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: null,
          },
        },
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: 21314 },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/09/30-2025/10/29',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: 60239,
          },
        },
      ],
      number: 3,
      tag: 'FV-309219',
    },
    {
      data: [
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: null },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/08/01-2025/08/30',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: null,
          },
        },
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: null },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/08/31-2025/09/29',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: null,
          },
        },
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: 18164 },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/09/30-2025/10/29',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: 70248,
          },
        },
      ],
      number: 4,
      tag: 'FV-320510',
    },
    {
      data: [
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: null },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/08/01-2025/08/30',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: null,
          },
        },
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: null },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/08/31-2025/09/29',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: null,
          },
        },
        {
          amplitudePerAction: {
            name: '次动作幅度',
            style: null,
            value: null,
          },
          cycleCount: { name: '循环计数', style: null, value: 2160 },
          dailyMovementCount: {
            name: '日动作次数',
            style: null,
            value: null,
          },
          time: '2025/09/30-2025/10/29',
          travelAccumulator: {
            name: '行程累计器',
            style: null,
            value: 21521,
          },
        },
      ],
      number: 5,
      tag: 'FV-320611',
    },
  ],
  newProblem: [
    {
      description:
        '阶跃响应, 死区时间, 最大超量中，最大超量, 最大误差不符合规格。',
      name: '阶跃响应',
      tag: 'FV-309219',
      time: '2025年10月22日',
    },
    {
      description:
        "0：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Analysis In Progress': 'A friction estimate will be reported when a sufficient number of travel reversals have taken place to compute a reliable value', 'Uncertain Friction': 'Estimated Friction = 0.00 Ibf. User Defined Friction Range: 10.00 - 100. 00 Ibf. Possible Cause(s): There are not sufficient travel reversals to compute a reliable friction value.'}\", None)】；1：【(\"{'No Active Alerts Detected': ''}\", None)】；2：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': ''}\", None)】；3：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Travel Near Cutoff': 'Device is near Travel Cutoff. Data analysis is suspended until device leaves cutoff.'}\", None)】；5：【(\"{'No Active Alerts Detected': ''}\", None)】；",
      name: 'PD一键测试',
      tag: 'FV-309219',
      time: '2025年10月22日',
    },
    {
      description:
        '阀门由于摩檫力增加，阀内件损坏，或者弹簧膜片损坏，导致动作时间过长',
      name: '第10步和第11步行程时间',
      tag: 'FV-309219',
      time: '2025年10月22日',
    },
    {
      description:
        "0：【(\"{'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Actual travel - Actuator effective area - Bench set. - Nominal supply pressure From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.', 'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Uncertain Friction': 'Estimated Friction = 0.00 Ibf. User Defined Friction Range: 10.00 - 100. 00 Ibf. Possible Cause(s): There are not sufficient travel reversals to compute a reliable friction value.'}\", None)】；1：【(\"{'No Active Alerts Detected': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed:. - Bench set - Nominal supply pressure From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset..'}\", None)】；2：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set - Nominal supply pressure. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset..'}\", None)】；3：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set - Nominal supply pressure From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset..', 'Travel Near Cutoff': 'Device is near Travel Cutoff. Data analysis is suspended until device. leaves cutoff.'}\", None)】；5：【(\"{'No Active Alerts Detected': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set - Nominal supply pressure From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；",
      name: 'PD一键测试',
      tag: 'FV-320611',
      time: '2025年10月29日',
    },
    {
      description:
        '阀门往复调节动作超过1千万次，有可能是整定参数不合适，或者阀门机械问题导致阀门出现喘动。也可能是调节回路中其他因素引起。',
      name: '循环计数，阀门往复调节动作过高',
      tag: 'FV-312604',
      time: '2025年10月23日',
    },
    {
      description:
        "0：【(\"{'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete. The following parameters should be reviewed:. - Bench set. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset..', 'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Uncertain Friction': 'Estimated Friction = 0.00 Ibf. User Defined Friction Range: 10.00 - 100. 00 Ibf. Possible Cause(s): There are not sufficient travel reversals to compute a reliable friction value.'}\", None)】；1：【(\"{'No Active Alerts Detected': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete. The following parameters should be reviewed: - Bench set. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；2：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；3：【(\"{'No Active Alerts Detectec': '', 'Supply Pressure OK': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete. The following parameters should be reviewed:. - Bench set. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset..'}\", None)】；5：【(\"{'No Active Alerts Detected': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；",
      name: 'PD一键测试',
      tag: 'FV-312604',
      time: '2025年10月23日',
    },
    {
      description: '阶跃响应, 死区时间, 最大超量中，最大误差不符合规格。',
      name: '阶跃响应',
      tag: 'FV-320510',
      time: '2025年10月22日',
    },
    {
      description:
        "0：【(\"{'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.', 'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Uncertain Friction': 'Estimated Friction = 0.00 Ibf. User Defined Friction Range: 10.00 - 100. 00 Ibf. Possible Cause(s): There are not sufficient travel reversals to compute a reliable friction value.'}\", None)】；1：【(\"{'No Active Alerts Detected': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete. The following parameters should be reviewed: - Bench set. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；2：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；3：【(\"{'No Active Alerts Detectec': '', 'Supply Pressure OK': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete. The following parameters should be reviewed:. - Bench set. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset..'}\", None)】；5：【(\"{'No Active Alerts Detected': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete. The following parameters should be reviewed: - Bench set. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；",
      name: 'PD一键测试',
      tag: 'FV-320510',
      time: '2025年10月22日',
    },
    {
      description:
        '阀门由于摩檫力增加，阀内件损坏，或者弹簧膜片损坏，导致动作时间过长。或者因整定值过慢，导致误差和线性度过高。',
      name: '完全扫描',
      tag: 'FV-320510',
      time: '2025年10月22日',
    },
    {
      description:
        "0：【(\"{'No Active Alerts Detected': '', 'High Supply Pressure': 'Supply pressure exceeds 125% of sensor range.. Possible Cause(s): High Supply Pressure Check specified sensor range. (From the main menu, select Instrument Setup  Detailed Setup  Instrument | Instrument.)', 'Decrease the supply pressure. Supply pressure should be 5 psig above': 'Decrease the supply pressure. Supply pressure should be 5 psig above the operating range. For piston actuators, supply pressure should be at least 40 psig. Check the calibration of the supply pressure sensor..', 'Analysis In Progress': 'A friction estimate will be reported when a sufficient number of travel reversals have taken place to compute a reliable value.', 'Uncertain Friction': 'Estimated Friction = 0.00 Ibf. User Defined Friction Range: 10.00 - 100. 00 Ibf. Possible Cause(s): There are not sufficient travel reversals to compute a reliable friction value.'}\", None)】；1：【(\"{'No Active Alerts Detected': '', 'High Supply Pressure': 'Supply pressure exceeds 125% of sensor range. Possible Cause(s): High Supply Pressure Check specified sensor range. (From the main menu, select Instrument Setup  Detailed Setup  Instrument [ Instrument.).', 'Decrease the supply pressure. Supply pressure should be 5 psig above': 'the operating range. For piston actuators, supply pressure should be at least 40 psig. Check the calibration of the supply pressure sensor..'}\", None)】；2：【(\"{'No Active Alerts Detected': '', 'High Supply Pressure': 'Supply pressure exceeds 125% of sensor range. Possible Cause(s): High Supply Pressure Check specified sensor range. (From the main menu, select Instrument Setup  Detailed Setup  Instrument [ Instrument.). Decrease the supply pressure. Supply pressure should be 5 psig above the operating range. For piston actuators, supply pressure should be at least 40 psig. Check the calibration of the supply pressure sensor..'}\", None)】；3：【(\"{'No Active Alerts Detectec': '', 'High Supply Pressure': 'Supply pressure exceeds 125% of sensor range. Possible Cause(s): High Supply Pressure Check specified sensor range. (From the main menu, select Instrument Setup  Detailed Setup  Instrument | Instrument.) Decrease the supply pressure. Supply pressure should be 5 psig above the operating range. For piston actuators, supply pressure should be at least 40 psig. Check the calibration of the supply pressure sensor.'}\", None)】；5：【(\"{'No Active Alerts Detected': '', 'High Supply Pressure': 'Supply pressure exceeds 125% of sensor range.. Possible Cause(s): High Supply Pressure Check specified sensor range. (From the main menu, select Instrument Setup  Detailed Setup  Instrument | Instrument.) Decrease the supply pressure. Supply pressure should be 5 psig above the operating range. For piston actuators, supply pressure should be at least 40 psig. Check the calibration of the supply pressure sensor.'}\", None)】；",
      name: 'PD一键测试',
      tag: 'FV-309215',
      time: '2025年10月22日',
    },
  ],
  oldProblem: [],
  scoreDistribution: [
    { name: '0-73', style: '#ff0000', value: 0 },
    { name: '73-85', style: '#ffff00', value: 1 },
    { name: '85-100', style: '#00b050', value: 4 },
  ],
  valveDetails: [
    {
      items: [
        {
          description:
            '阶跃响应, 死区时间, 最大超量中，最大超量, 最大误差不符合规格。',
          measures:
            '建议比较特征扫描数据，如是阀门机械性能问题，则进行维修翻新，如是整定问题，则可使用性能调谐和稳定优化进行动态性能调整。',
          name: '阶跃响应',
          plot: {},
          risk: '阀门可能存在性能问题，要么是阀座和填料变质，要么是DVC调整不合适。',
          sort: '问题1',
          tag: 'FV-309219',
        },
        {
          description:
            "0：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Analysis In Progress': 'A friction estimate will be reported when a sufficient number of travel reversals have taken place to compute a reliable value', 'Uncertain Friction': 'Estimated Friction = 0.00 Ibf. User Defined Friction Range: 10.00 - 100. 00 Ibf. Possible Cause(s): There are not sufficient travel reversals to compute a reliable friction value.'}\", None)】；1：【(\"{'No Active Alerts Detected': ''}\", None)】；2：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': ''}\", None)】；3：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Travel Near Cutoff': 'Device is near Travel Cutoff. Data analysis is suspended until device leaves cutoff.'}\", None)】；5：【(\"{'No Active Alerts Detected': ''}\", None)】；",
          measures: '',
          name: 'PD一键测试',
          plot: {},
          risk: '',
          sort: '问题2',
          tag: 'FV-309219',
        },
        {
          description:
            '阀门由于摩檫力增加，阀内件损坏，或者弹簧膜片损坏，导致动作时间过长',
          measures: '结合特征扫描数据判断故障部件，进行针对性维修。',
          name: '第10步和第11步行程时间',
          plot: {},
          risk: '阀门无法满足工艺调节的需求，导致生产效率下降和中断。',
          sort: '问题3',
          tag: 'FV-309219',
        },
      ],
      tag: 'FV-309219',
    },
    {
      items: [
        {
          description:
            "0：【(\"{'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Actual travel - Actuator effective area - Bench set. - Nominal supply pressure From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.', 'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Uncertain Friction': 'Estimated Friction = 0.00 Ibf. User Defined Friction Range: 10.00 - 100. 00 Ibf. Possible Cause(s): There are not sufficient travel reversals to compute a reliable friction value.'}\", None)】；1：【(\"{'No Active Alerts Detected': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed:. - Bench set - Nominal supply pressure From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset..'}\", None)】；2：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set - Nominal supply pressure. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset..'}\", None)】；3：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set - Nominal supply pressure From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset..', 'Travel Near Cutoff': 'Device is near Travel Cutoff. Data analysis is suspended until device. leaves cutoff.'}\", None)】；5：【(\"{'No Active Alerts Detected': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set - Nominal supply pressure From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；",
          measures: '',
          name: 'PD一键测试',
          plot: {},
          risk: '',
          sort: '问题1',
          tag: 'FV-320611',
        },
      ],
      tag: 'FV-320611',
    },
    {
      items: [
        {
          description:
            '阀门往复调节动作超过1千万次，有可能是整定参数不合适，或者阀门机械问题导致阀门出现喘动。也可能是调节回路中其他因素引起。',
          measures:
            '进一步运行离线诊断，确认阀门的死区和摩檫力等机械问题是否是导致阀门动作过度的动态性能问题。检查DCS的回路整定。根据诊断结果维修阀门。',
          name: '循环计数，阀门往复调节动作过高',
          plot: {
            auxiliaryLine: { averageValue: [0] },
            dataLine: [0],
            keywordId: null,
            keywordName: '循环计数',
            predictionLine: { linearRegression: [0] },
            times: ['2025/10/22'],
            valveId: 2933,
          },
          risk: '过高的循环往复会加速填料、弹簧、膜片、密封件的损坏。产生一系列机械问题。',
          sort: '问题1',
          tag: 'FV-312604',
        },
        {
          description:
            "0：【(\"{'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete. The following parameters should be reviewed:. - Bench set. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset..', 'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Uncertain Friction': 'Estimated Friction = 0.00 Ibf. User Defined Friction Range: 10.00 - 100. 00 Ibf. Possible Cause(s): There are not sufficient travel reversals to compute a reliable friction value.'}\", None)】；1：【(\"{'No Active Alerts Detected': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete. The following parameters should be reviewed: - Bench set. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；2：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；3：【(\"{'No Active Alerts Detectec': '', 'Supply Pressure OK': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete. The following parameters should be reviewed:. - Bench set. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset..'}\", None)】；5：【(\"{'No Active Alerts Detected': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；",
          measures: '',
          name: 'PD一键测试',
          plot: {},
          risk: '',
          sort: '问题2',
          tag: 'FV-312604',
        },
      ],
      tag: 'FV-312604',
    },
    {
      items: [
        {
          description: '阶跃响应, 死区时间, 最大超量中，最大误差不符合规格。',
          measures:
            '建议比较特征扫描数据，如是阀门机械性能问题，则进行维修翻新，如是整定问题，则可使用性能调谐和稳定优化进行动态性能调整。',
          name: '阶跃响应',
          plot: {},
          risk: '阀门可能存在性能问题，要么是阀座和填料变质，要么是DVC调整不合适。',
          sort: '问题1',
          tag: 'FV-320510',
        },
        {
          description:
            "0：【(\"{'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.', 'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Uncertain Friction': 'Estimated Friction = 0.00 Ibf. User Defined Friction Range: 10.00 - 100. 00 Ibf. Possible Cause(s): There are not sufficient travel reversals to compute a reliable friction value.'}\", None)】；1：【(\"{'No Active Alerts Detected': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete. The following parameters should be reviewed: - Bench set. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；2：【(\"{'No Active Alerts Detected': '', 'Supply Pressure OK': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete The following parameters should be reviewed: - Bench set From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；3：【(\"{'No Active Alerts Detectec': '', 'Supply Pressure OK': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete. The following parameters should be reviewed:. - Bench set. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset..'}\", None)】；5：【(\"{'No Active Alerts Detected': '', 'Check ValveLink Spec. Shee': 'ValveLink Spec. Sheet data is either missing or invalid. Analysis may be suspended or incomplete. The following parameters should be reviewed: - Bench set. From the main menu, select Spec Sheet | Valve and Actuator and fill in the missing information. Important: when complete, select Save Dataset.'}\", None)】；",
          measures: '',
          name: 'PD一键测试',
          plot: {},
          risk: '',
          sort: '问题2',
          tag: 'FV-320510',
        },
        {
          description:
            '阀门由于摩檫力增加，阀内件损坏，或者弹簧膜片损坏，导致动作时间过长。或者因整定值过慢，导致误差和线性度过高。',
          measures: '结合特征扫描数据判断故障部件，进行针对性维修。',
          name: '完全扫描',
          plot: {},
          risk: '阀门无法满足工艺调节的需求，导致生产效率下降和中断。',
          sort: '问题3',
          tag: 'FV-320510',
        },
      ],
      tag: 'FV-320510',
    },
    {
      items: [
        {
          description:
            "0：【(\"{'No Active Alerts Detected': '', 'High Supply Pressure': 'Supply pressure exceeds 125% of sensor range.. Possible Cause(s): High Supply Pressure Check specified sensor range. (From the main menu, select Instrument Setup  Detailed Setup  Instrument | Instrument.)', 'Decrease the supply pressure. Supply pressure should be 5 psig above': 'Decrease the supply pressure. Supply pressure should be 5 psig above the operating range. For piston actuators, supply pressure should be at least 40 psig. Check the calibration of the supply pressure sensor..', 'Analysis In Progress': 'A friction estimate will be reported when a sufficient number of travel reversals have taken place to compute a reliable value.', 'Uncertain Friction': 'Estimated Friction = 0.00 Ibf. User Defined Friction Range: 10.00 - 100. 00 Ibf. Possible Cause(s): There are not sufficient travel reversals to compute a reliable friction value.'}\", None)】；1：【(\"{'No Active Alerts Detected': '', 'High Supply Pressure': 'Supply pressure exceeds 125% of sensor range. Possible Cause(s): High Supply Pressure Check specified sensor range. (From the main menu, select Instrument Setup  Detailed Setup  Instrument [ Instrument.).', 'Decrease the supply pressure. Supply pressure should be 5 psig above': 'the operating range. For piston actuators, supply pressure should be at least 40 psig. Check the calibration of the supply pressure sensor..'}\", None)】；2：【(\"{'No Active Alerts Detected': '', 'High Supply Pressure': 'Supply pressure exceeds 125% of sensor range. Possible Cause(s): High Supply Pressure Check specified sensor range. (From the main menu, select Instrument Setup  Detailed Setup  Instrument [ Instrument.). Decrease the supply pressure. Supply pressure should be 5 psig above the operating range. For piston actuators, supply pressure should be at least 40 psig. Check the calibration of the supply pressure sensor..'}\", None)】；3：【(\"{'No Active Alerts Detectec': '', 'High Supply Pressure': 'Supply pressure exceeds 125% of sensor range. Possible Cause(s): High Supply Pressure Check specified sensor range. (From the main menu, select Instrument Setup  Detailed Setup  Instrument | Instrument.) Decrease the supply pressure. Supply pressure should be 5 psig above the operating range. For piston actuators, supply pressure should be at least 40 psig. Check the calibration of the supply pressure sensor.'}\", None)】；5：【(\"{'No Active Alerts Detected': '', 'High Supply Pressure': 'Supply pressure exceeds 125% of sensor range.. Possible Cause(s): High Supply Pressure Check specified sensor range. (From the main menu, select Instrument Setup  Detailed Setup  Instrument | Instrument.) Decrease the supply pressure. Supply pressure should be 5 psig above the operating range. For piston actuators, supply pressure should be at least 40 psig. Check the calibration of the supply pressure sensor.'}\", None)】；",
          measures: '',
          name: 'PD一键测试',
          plot: {},
          risk: '',
          sort: '问题1',
          tag: 'FV-309215',
        },
      ],
      tag: 'FV-309215',
    },
  ],
  valveOverallStatus: [
    { name: '正常', style: '#00b050', value: 5 },
    { name: '报警', style: '#ff0000', value: 0 },
  ],
  valveQuarterStatus: [
    { alert: 10, name: '2025年1季度', normal: 10 },
    { alert: 10, name: '2025年2季度', normal: 10 },
    { alert: 10, name: '2025年3季度', normal: 10 },
    { alert: 10, name: '2025年4季度', normal: 5 },
  ],
  valveQuarterStatusTrend: [
    {
      data: [
        { name: '2025/05/03-2025/06/01', style: null, value: 'N/A' },
        { name: '2025/06/02-2025/07/01', style: null, value: 'N/A' },
        { name: '2025/07/02-2025/07/31', style: null, value: 'N/A' },
        { name: '2025/08/01-2025/08/30', style: null, value: 'N/A' },
        { name: '2025/08/31-2025/09/29', style: null, value: 'N/A' },
        { name: '2025/09/30-2025/10/29', style: '#ffff00', value: 80 },
      ],
      tag: 'FV-309219',
    },
    {
      data: [
        { name: '2025/05/03-2025/06/01', style: null, value: 'N/A' },
        { name: '2025/06/02-2025/07/01', style: null, value: 'N/A' },
        { name: '2025/07/02-2025/07/31', style: null, value: 'N/A' },
        { name: '2025/08/01-2025/08/30', style: null, value: 'N/A' },
        { name: '2025/08/31-2025/09/29', style: null, value: 'N/A' },
        { name: '2025/09/30-2025/10/29', style: '#00b050', value: 88 },
      ],
      tag: 'FV-320611',
    },
    {
      data: [
        { name: '2025/05/03-2025/06/01', style: null, value: 'N/A' },
        { name: '2025/06/02-2025/07/01', style: null, value: 'N/A' },
        { name: '2025/07/02-2025/07/31', style: null, value: 'N/A' },
        { name: '2025/08/01-2025/08/30', style: null, value: 'N/A' },
        { name: '2025/08/31-2025/09/29', style: null, value: 'N/A' },
        { name: '2025/09/30-2025/10/29', style: '#00b050', value: 91 },
      ],
      tag: 'FV-312604',
    },
    {
      data: [
        { name: '2025/05/03-2025/06/01', style: null, value: 'N/A' },
        { name: '2025/06/02-2025/07/01', style: null, value: 'N/A' },
        { name: '2025/07/02-2025/07/31', style: null, value: 'N/A' },
        { name: '2025/08/01-2025/08/30', style: null, value: 'N/A' },
        { name: '2025/08/31-2025/09/29', style: null, value: 'N/A' },
        { name: '2025/09/30-2025/10/29', style: '#00b050', value: 86 },
      ],
      tag: 'FV-320510',
    },
    {
      data: [
        { name: '2025/05/03-2025/06/01', style: null, value: 'N/A' },
        { name: '2025/06/02-2025/07/01', style: null, value: 'N/A' },
        { name: '2025/07/02-2025/07/31', style: null, value: 'N/A' },
        { name: '2025/08/01-2025/08/30', style: null, value: 'N/A' },
        { name: '2025/08/31-2025/09/29', style: null, value: 'N/A' },
        { name: '2025/09/30-2025/10/29', style: '#00b050', value: 92 },
      ],
      tag: 'FV-309215',
    },
  ],
  valveTravelHistoryRecord: {
    descriptions: ['问题1: 阀门全开或全关'],
    records: [
      [
        { key: 'number', name: '序号', style: null, value: 1 },
        {
          key: 'tag',
          name: '阀门位号',
          style: null,
          value: 'FV-309219',
        },
        {
          key: 'travelLow',
          name: '行程低值',
          style: '#6E298D',
          value: '-0.22%',
        },
        {
          key: 'travelHigh',
          name: '行程高值',
          style: null,
          value: '-0.22%',
        },
        {
          key: 'globeValve',
          name: 'Globe Valve',
          style: null,
          value: true,
        },
        {
          key: 'rotaryValve',
          name: 'Rotary Valve',
          style: null,
          value: false,
        },
        {
          key: 'butteValve',
          name: 'Butterfly Valve',
          style: null,
          value: false,
        },
        { key: 'size', name: '尺寸', style: null, value: '1 inch' },
        {
          key: 'description',
          name: '说明',
          style: null,
          value: '问题1',
        },
      ],
      [
        { key: 'number', name: '序号', style: null, value: 2 },
        {
          key: 'tag',
          name: '阀门位号',
          style: null,
          value: 'FV-320611',
        },
        {
          key: 'travelLow',
          name: '行程低值',
          style: '#6E298D',
          value: '0.43%',
        },
        {
          key: 'travelHigh',
          name: '行程高值',
          style: null,
          value: '0.43%',
        },
        {
          key: 'globeValve',
          name: 'Globe Valve',
          style: null,
          value: true,
        },
        {
          key: 'rotaryValve',
          name: 'Rotary Valve',
          style: null,
          value: false,
        },
        {
          key: 'butteValve',
          name: 'Butterfly Valve',
          style: null,
          value: false,
        },
        { key: 'size', name: '尺寸', style: null, value: 'D inch' },
        {
          key: 'description',
          name: '说明',
          style: null,
          value: '问题1',
        },
      ],
    ],
  },
};
