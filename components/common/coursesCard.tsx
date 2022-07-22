import { Button, Card, Col, Row } from 'antd'
import React from 'react'

export default function CoursesCard() {

  return (
    <Col span={6}>
      <Card
        extra={
          <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"></img>
        }
      >
        <Row></Row>
        <Row></Row>
        <Row></Row>
        <Row></Row>
        <Button/>
      </Card>
    </Col>
  )
}
