import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout/layout";
import Breadcrumb from "../../../../components/common/breadcrumb";
import { Col, Row } from "antd";
import axios from "axios";

export default function Page(props: { id: number }) {
  const router = useRouter();
  const { id } = router.query;
  const slug = router.pathname;
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("cms") || "").token;
    axios
      .get("http://cms.chtoma.com/api/students/"+id, 
        {headers: {
          'Authorization': 'Bearer ' + token
        }})
      .then((res) => {
        console.log(res);
      });
  });
  return (
    <>
      <Layout>
        <Breadcrumb slug={slug} />
        <Row>
          <Col
            className="container"
            span={10}
            style={{ background: "red", height: "500px" }}
          ></Col>
          <Col
            className="container"
            span={14}
            style={{ background: "green", height: "500px" }}
          ></Col>
        </Row>
      </Layout>
    </>
  );
}
