import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect, useState } from 'react'

export default function TypeCompareChart(props: any) {
  const { data, title } = props
  // const [pieData, setPieData] = useState<any>()
  const [options, setOptions] = useState<any>({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> <br> total: {point.y}',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
      },
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    }
  })

  useEffect(() => {
    if (!data) {
      return;
    }

   let pieData

    if (title !== 'Gender') {
      pieData = data.map((item: any) =>
      ({
        name: item.name,
        y: item.amount,
      }))
    }
    else {
      console.log(data.gender);
      pieData = Object.entries(data.gender).map(([name, amount]) => ({
        name: name,
        y: amount
      }))
    }

    setOptions({
      title: {
        text: title
      },
      subtitle: {
        text: `${title.split(' ')[0]} total: ${pieData.reduce((acc:any, cur:any) => acc + cur.y, 0)}`,
        align: 'right',
      },
      series: [{
        name: 'Percentage',
        colorByPoint: true,
        data: pieData,
      }]

    })
  }, [title, data])
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  )
}
