import { Image, Button, Card, Col, Divider, List, Row, Skeleton } from "antd";
import { useEffect, useState } from "react";
import CoursesCard from "../../../../components/common/coursesCard";
import AppLayout from "../../../../components/layout/layout";
import { Course } from "../../../../lib/model/courses";
import apiService from "../../../../lib/services/api-service";
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from "next/link";
import { useUserRole } from "../../../../components/custom-hooks/login-state";
import styled from "styled-components";
import { Gutter } from 'antd/lib/grid/row';
import { HeartFilled, UserOutlined } from '@ant-design/icons';
import { DurationUnit } from "../../../../lib/constant/duration";
import storage from "../../../../lib/services/storage";

const StyledRow = styled(Row)`
  position: relative;
  margin: -8px -3px 8px;
  :after {
    content: '';
    position: absolute;
    bottom: 0;
    background: #f0f0f0;
    width: 100%;
    height: 1px; 
  }
`;
const gutter: [Gutter, Gutter] = [6, 16];

const getDuration = (data: Course): string => {
  const { duration, durationUnit } = data;
  const text = `${duration} ${DurationUnit[durationUnit]}`;

  return duration > 1 ? text + 's' : text;
};

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [isMore, setIsMore] = useState(false);
  const userRole = useUserRole();

  useEffect(() => {
    apiService.getCourses({
      page: page,
      limit: limit,
      // name: '',
      // uid: '',
      // typeId: 0,
      // userId: 0,
    }).then((res) => {
      const { data } = res;
      if (data) {
        setCourses([...courses, ...data.courses]);
        setIsMore((page * limit < data.total) ? true : false);
        console.log(data);
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit])

  return (
    <AppLayout>
      <InfiniteScroll
        dataLength={courses.length}
        next={() => setPage(page + 1)}
        hasMore={isMore}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={courses}
          renderItem={item => (
            <List.Item key={`${item.id}_${item.name}`}>
              <Card
                cover={
                  <Image src={item.cover} style={{ height: 260 }} alt='' />
                }
              >
                <Row gutter={gutter}><h3>{item.name}</h3></Row>
                <StyledRow gutter={gutter} justify="space-between">
                  <Col>{item.createdAt}</Col>
                  <Col><HeartFilled style={{ marginRight: 5, fontSize: 16, color: 'red' }} /><b>{item.star}</b></Col>
                </StyledRow>
                <StyledRow gutter={gutter} justify="space-between">
                  <Col>Duration:</Col>
                  <Col>
                  <b>{getDuration(item)}</b>
                  </Col>
                </StyledRow>
                <StyledRow gutter={gutter} justify="space-between">
                  <Col>Teacher:</Col>
                  <Col>
                    <b>
                      <Link href={`teachers/${item.teacherId}`}>
                        {item.teacherName}
                      </Link>
                    </b>
                  </Col>
                </StyledRow>
                <Row gutter={gutter} justify="space-between">
                  <Col>
                    <UserOutlined style={{ marginRight: 5, fontSize: 16, color: '#1890ff' }} />
                    <span>
                      Student Limit:
                    </span>

                  </Col>
                  <Col><b>{item.maxStudents}</b></Col>
                </Row>
                <Row style={{ marginTop: '12px' }}>
                <Link href={`/dashboard/${storage.role}/courses/${item.id}`} passHref>
                  <Button type="primary">Read More</Button>
                </Link>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </AppLayout>
  )
}