import { Image, Button, Card, Col, Divider, List, Row, Skeleton } from "antd";
import { useEffect, useState } from "react";
import CoursesCard from "../../../../components/common/coursesCard";
import AppLayout from "../../../../components/layout/layout";
import { Course } from "../../../../lib/model/courses";
import apiService from "../../../../lib/services/api-service";
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from "next/link";
import { useUserRole } from "../../../../components/custom-hooks/login-state";

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
                extra={
                  <Image height={260} src={item.cover} alt=''/>
                }
              >
                <Row>{item.name}</Row>
                <Row justify="space-between">
                  <Col>{item.createdAt}</Col>
                  <Col><b>{item.star}</b></Col>
                </Row>
                <Row justify="space-between">
                  <Col>Duration:</Col>
                  <Col><b>{item.duration} {item.durationUnit}</b></Col>
                </Row>
                <Row justify="space-between">
                  <Col>Teacher:</Col>
                  <Col>
                    <b>
                      <Link href={`teachers/${item.teacherId}`}>
                        {item.teacherName}
                      </Link>
                    </b>
                  </Col>
                </Row>
                <Row justify="space-between">
                  <Col>Student Limit:</Col>
                  <Col><b>{item.maxStudents}</b></Col>
                </Row>
                <Button type="primary">Read More</Button>
              </Card>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </AppLayout>
  )
}