import { Card } from 'antd'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect, useInsertionEffect } from 'react'

export default function DistributionChart(props: any) {
  useEffect(()=>{
    
  })
  const chartOptions = {
    title:'Student',
    xAxis: {
      categories: ['A', 'B', 'C'],
    },
    series: [
      {
        name: 'student',
        data: [1, 2, 3]
      },
      {
        name: 'teacher',
        data: [2, 1, 5]
      },
      {
        name: 'course',
        data: [4, 6, 6]
      }
    ],
    plotOptions: {
      series: {
        point: {
          events: {
            mouseOver(e: { target: { category: React.SetStateAction<null>; }; }) {
              // setHoverData(e.target.category)
            }
          }
        }
      }
    }
  }

  return (
    <HighchartsReact highcharts={Highcharts} options={chartOptions}></HighchartsReact>
  )
}