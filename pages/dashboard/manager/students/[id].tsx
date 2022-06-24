import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout/layout";
import Breadcrumb from "../../../../components/common/breadcrumbs";
import { Avatar, Card, Col, Row } from "antd";
import axios from "axios";
import storage from "../../../../lib/services/storage";
import apiService from "../../../../lib/services/api-service";
import { Student, StudentResponse } from "../../../../lib/model/student";



export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  const [info, setInfo] = useState<{ label: string; value: string | number }[]>([]);
  const [about, setAbout] = useState<{ label: string; value: string | number }[]>([]);
  const [data, setData] = useState<StudentResponse>(null);
  const [activeTabKey1, setActiveTabKey1] = useState<string>('tab1');

  const slug = router.pathname;
  useEffect(() => {
    async function fetchStudent(id: number) {
      const { data } = await apiService.getStudentById(id)
      if (!!data) {
        return data
      }
    }
    if (!!id) {
      const detailRespond = fetchStudent(+id)
      if (!!detailRespond) {
        detailRespond.then(res => {
          const data = res
          if (!!data) {
            const info = [
              { label: 'Name', value: data.name },
              { label: 'Age', value: data.age },
              { label: 'Email', value: data.email },
              { label: 'Phone', value: data.phone },
            ];
            const about = [
              { label: 'Eduction', value: data.education },
              { label: 'Area', value: data.country },
              { label: 'Gender', value: data.gender === 1 ? 'Male' : 'Female' },
              { label: 'Member Period', value: data.memberStartAt + ' - ' + data.memberEndAt },
              { label: 'Type', value: data.type.name },
              { label: 'Create Time', value: data.ctime },
              { label: 'Update Time', value: data.updateAt },
            ];
            setAbout(about)
            setInfo(info)
            setData(data)
          }
        })
      }
    }
  }, [id]);

  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
  };

  const tabList = [
    {
      key: 'about',
      tab: 'About',
    },
    {
      key: 'courses',
      tab: 'Courses',
    },
  ];

  const contentList: Record<string, React.ReactNode> = {
    tab1: <p>content1</p>,
    tab2: <p>content2</p>,
  };
  return (
    <>
      <Layout>
        <div className="container bg-white h-full">
          <div className="pt-3 pl-5 pr-5"></div>
          <Row gutter={[6, 16]} style={{ width: '100%', height: '100%' }}>
            <Col
              className="container "
              span={9}
            >
              <Card
                title={
                  <Avatar
                    src={data?.avatar}
                    style={{ width: 100, height: 100, display: 'block', margin: 'auto' }}
                  />
                }
              >
                <Row>
                  {info.map((item) => (
                    <Col span={12} key={item.label} style={{ textAlign: 'center' }}>
                      <b>{item.label}</b>
                      <p>{item.value}</p>
                    </Col>
                  ))}
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <b>Address</b>
                    <p>{data?.address}</p>
                  </Col>
                </Row>


              </Card>
            </Col>
            <Col
              className="container ml-10"
              span={14}
            >
              <Card
                style={{ width: '100%', height: '100%' }}
                tabList={tabList}
                activeTabKey={activeTabKey1}
                onTabChange={key => {
                  onTab1Change(key);
                }}
              >
                {contentList[activeTabKey1]}
              </Card>
            </Col>
          </Row>
        </div>

      </Layout>
    </>
  );
}
