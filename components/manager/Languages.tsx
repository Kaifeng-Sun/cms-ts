import { Card } from 'antd'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { uniq } from 'lodash';
import React, { useEffect, useState } from 'react'
import { SkillDes } from '../../lib/constant/config';
import { Statistic } from '../../lib/model/statistics';

export interface BarChartProps {
  data: {
    interest: Statistic[];
    teacher: Statistic[];
  };
}

type ISeriesItem = {
  name: string;
  stack: string;
  data: number[];
};

export default function LanguagesChart({ data }: BarChartProps) {
  const [options, setOptions] = useState<any>({
    chart: {
      type: 'column',
    },
    title: {
      text: 'Student VS Teacher',
    },
    subtitle: {
      text: 'Comparing what students are interested in and teachers’ skills',
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Interested VS Skills',
      },
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
        },
      },
    },
    exporting: {
      enabled: false,
    }
  });

  useEffect(() => {
    if (!data || Object.values(data).some((item) => !item)) {
      return;
    }

    const { interest, teacher } = data;
    const xCategories: string[] = uniq([
      ...interest.map(({ name }) => name),
      ...Object.keys(teacher),
    ]);

    const interestItem: ISeriesItem = xCategories.reduce(
      (acc, language) => {
        const target = interest.find((item) => item.name === language);
        const value = target ? target.amount : 0
        acc.data.push(value);
        return acc;
      },
      //init obj acc
      { name: 'Interest', stack: 'interest', data: [] as number[] }
    );
    
    const levels = uniq(
      Object.values(teacher)
        .flat()
        .map((item) => item.level)
    ).sort();

    const teacherBar: ISeriesItem[] = levels.map((level) => ({
      name: SkillDes[level],
      data: xCategories.map(
        (language:string) => teacher[language]?.find((item: Statistic) => item.level === level)?.amount || 0
      ),
      stack: 'teacher',
    }));

    setOptions({
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
        categories: xCategories,
      },
      series: [interestItem,...teacherBar],
    });
  }, [data]);

  return (
    <HighchartsReact highcharts={Highcharts} options={options}></HighchartsReact>
  )
}