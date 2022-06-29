import { Card } from 'antd'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'

export default function IncrementChart(props: any) {
  const data = props
  const chartOptions = {
    
  }
  return (
      <HighchartsReact highcharts={Highcharts} options={chartOptions}></HighchartsReact>
  )
}
