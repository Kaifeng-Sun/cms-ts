import type { NextPage } from "next";
import React, { useEffect, useState } from 'react';
import AppLayout from "../../../components/layout/layout";
import Students from "../../../pages/dashboard/manager/students"
import { Card, Col, Row } from "antd";
import IncrementChart from "../../../components/manager/Increment";
import DistributionChart from "../../../components/manager/Distribution";
import TypeCompareChart from "../../../components/manager/TypeCompare";
import LanguagesChart from "../../../components/manager/Languages";
import apiService from "../../../lib/services/api-service";
import { CourseClassTimeStatistic, CourseStatistics, StatisticsOverviewResponse, StatisticsResponse } from "../../../lib/model/statistics";
import { StudentWithProfile } from "../../../lib/model/student";
import { Teacher, TeacherProfile } from "../../../lib/model/teacher";
import { Role } from "../../../lib/model/role";
import { Course, Schedule } from "../../../lib/model/courses";

type StudentStatistics = StatisticsResponse<StudentWithProfile>;

type TeacherStatistics = StatisticsResponse<Teacher & TeacherProfile>;

const Home: NextPage = () => {
  const [hoverData, setHoverData] = useState(null);
  const [distributionData, distributionDataData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [overview, setOverview] = useState<StatisticsOverviewResponse | null>(null);
  const [studentStatistics, setStudentStatistics] = useState<StudentStatistics | null>(null);
  const [teacherStatistics, setTeacherStatistics] = useState<TeacherStatistics | null>(null);
  const [courseStatistics, setCourseStatistics] = useState<CourseStatistics | null>(null);

  useEffect(() => {
    apiService.getStatisticsOverview().then((res) => {
      const { data } = res;
      if (data) {
        setOverview(data);
        console.log(overview);      
      }
    });

    apiService.getStatistics<StudentWithProfile>(Role.student).then((res) => {
      const { data } = res;
      if (data) {
        setStudentStatistics(data);
      }
    });

    apiService.getStatistics<TeacherProfile & Teacher>(Role.teacher).then((res) => {
      const { data } = res;
      if (data) {
        setTeacherStatistics(data);
      }
    });

    apiService.getStatistics<Course & Schedule, CourseClassTimeStatistic>('course').then((res) => {
      const { data } = res;
      if (data) {
        setCourseStatistics(data);
      }
    });
  },[])
  // const updateSeries = () => {
  //   setChartOptions({series: [{ data: [Math.random() * 5, 2, 1]}]});
  //   }
  return (
    <AppLayout>
      <div className="overview-container bg-white">
        <Row>
          <Col span={8}>

          </Col>
          <Col span={8}>

          </Col>
          <Col span={8}>

          </Col>
        </Row>

        <Row style={{ margin: "-8px -3px -3px" }}>
          <Col span={12} className="overview-charts">
            <Card title="Distribution">
              <DistributionChart data={distributionData} />
            </Card>
          </Col>

          <Col span={12} className="overview-charts">
            <Card title="Types">
              <TypeCompareChart chartOptions={chartOptions} />
            </Card>
          </Col>

          <Col span={12} className="overview-charts">
            <Card title="Increment">
              <IncrementChart chartOptions={chartOptions} />
            </Card>

          </Col>
          <Col span={12} className="overview-charts">
            <Card title="Languages">
              <LanguagesChart chartOptions={chartOptions} />
            </Card>
          </Col>
        </Row>
      </div>

      {/* <button onClick={updateSeries}>Update Series</button> */}
    </AppLayout>
  );
};

export default Home;