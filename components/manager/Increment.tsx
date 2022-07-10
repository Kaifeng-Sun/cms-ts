import { Card } from 'antd'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect } from 'react'

export default function IncrementChart(props: any) {
  const { studentData, teacherData, courseData } = props
  const lineChartData = (data: { name: string, amount: number }[]) => {
    let monthData = new Array(12).fill(0)
    if (!!data) {
      data.forEach(item => {
        const currentYear = new Date().getFullYear()
        const year = +item.name.split("-")[0]
        const month = +item.name.split("-")[1]
        const amount = item.amount
        if (year === currentYear) {
          monthData.fill(amount, month - 1, month)
        }
      })
    }

    return monthData
  }

  const chartOptions = {
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    title: {
      text: ''
    },
    series: [
      {
        name: '1',
        data: lineChartData(studentData),
      },
      {
        name: '2',
        data: lineChartData(teacherData),
      },
      {
        name: '3',
        data: lineChartData(courseData),
      },
    ]
  }
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={chartOptions}
    />
  )
}
