import { Card } from 'antd'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'

export default function IncrementChart(props: any) {
  const {chartOptions} = props
  return (
      <HighchartsReact highcharts={Highcharts} options={chartOptions}></HighchartsReact>
  )
}
