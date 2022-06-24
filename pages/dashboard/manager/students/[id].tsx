import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout/layout";
import Breadcrumb from "../../../../components/common/breadcrumbs";
import { Card, Col, Row } from "antd";
import axios from "axios";
import storage from "../../../../lib/services/storage";
import apiService from "../../../../lib/services/api-service";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  const slug = router.pathname;
  useEffect(() => {
    async function fetchStudent(id: any) {
      const { data } = await apiService.getStudentById({ id: id })
      if (!!data) {
        return data
      }
    }
    if (!!id) {
      const data = fetchStudent(id)
      console.log(data);
    }


    // axios
    //   .get("http://cms.chtoma.com/api/students/"+id, 
    //     {headers: {
    //       'Authorization': 'Bearer ' + storage.token
    //     }})
    //   .then((res) => {
    //     console.log(res);
    //   });

  }, [id]);
  return (
    <>
      <Layout>
        <Row className="bg-white h-full justify-around">
          <Col
            className="container "
            span={9}
          >
            <Card 
              title="Default size card" 
            >
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </Col>
          <Col
            className="container ml-10 border-slate-200 border-2"
            span={14}
          >

          </Col>
        </Row>
      </Layout>
    </>
  );
}
