import { Card, Col, Progress, Row } from 'antd'
import React from 'react'
import { OverviewIconCol, OverviewCol } from '../common/styled'

export default function OverviewCard(props: any) {
  const { style, data, title, icon } = props
  const total = data?.total
  const lastMonthAddedPercentage = +parseFloat(String((data?.lastMonthAdded / total) * 100)).toFixed(1)
  return (
    <Col span={8}>
      <Card
        style={{ borderRadius: 5, cursor: 'pointer', ...style }}
      >
        <Row>
          <OverviewIconCol span={6}>
            {icon}
          </OverviewIconCol>
          <OverviewCol span={18}>
            <h3>TOTAL {title}</h3>
            <h2>{total}</h2>
            <Progress
              percent={100 - lastMonthAddedPercentage}
              size="small"
              showInfo={false}
              strokeColor="white"
              trailColor="lightgreen"
            />
            <p>{`${lastMonthAddedPercentage + '%'} Increase in 30 Days`}</p>

          </OverviewCol>
        </Row>

      </Card>
    </Col>

  )
}
