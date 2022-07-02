import type { NextPage } from "next";
import React, { useEffect, useState } from 'react';
import AppLayout from "../../../components/layout/layout";
import { DeploymentUnitOutlined, ReadOutlined, SolutionOutlined } from '@ant-design/icons';
import Students from "../../../pages/dashboard/manager/students"
import { Card, Col, Row, Select } from "antd";
import IncrementChart from "../../../components/manager/Increment";
import TypeCompareChart from "../../../components/manager/TypeCompare";
import LanguagesChart from "../../../components/manager/Languages";
import apiService from "../../../lib/services/api-service";
import { CourseClassTimeStatistic, CourseStatistics, Statistic, StatisticsOverviewResponse, StatisticsResponse } from "../../../lib/model/statistics";
import { StudentWithProfile } from "../../../lib/model/student";
import { Teacher, TeacherProfile } from "../../../lib/model/teacher";
import { Role } from "../../../lib/model/role";
import { Course, Schedule } from "../../../lib/model/courses";
import dynamic from "next/dynamic";
import OverviewCard from "../../../components/manager/OverviewCard";
import HeatChart from "../../../components/manager/HeatChart";

type StudentStatistics = StatisticsResponse<StudentWithProfile>;

type TeacherStatistics = StatisticsResponse<Teacher & TeacherProfile>;

const DistributionChart = dynamic(() => import('../../../components/manager/Distribution'), {
  ssr: false,
});

const Home: NextPage = () => {
  const [hoverData, setHoverData] = useState(null);
  const [typesData, setTypesData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [overview, setOverview] = useState<StatisticsOverviewResponse | null>(null);
  const [studentStatistics, setStudentStatistics] = useState<StudentStatistics | null>(null);
  const [teacherStatistics, setTeacherStatistics] = useState<TeacherStatistics | null>(null);
  const [courseStatistics, setCourseStatistics] = useState<CourseStatistics | null>(null);
  const [distributionRole, setDistributionRole] = useState<string>(Role.student);
  const [selectedType, setSelectedType] = useState<string>('Student Type');

  useEffect(() => {
    // apiService.getStatisticsOverview().then((res) => {
    //   const { data } = res;
    //   if (data) {
    //     setOverview(data);
    //     console.log(data);
    //   }
    // });

    // apiService.getStatistics<StudentWithProfile>(Role.student).then((res) => {
    //   const { data } = res;
    //   if (data) {
    //     setStudentStatistics(data);
    //     console.log(data);
    //   }
    // });

    // apiService.getStatistics<TeacherProfile & Teacher>(Role.teacher).then((res) => {
    //   const { data } = res;
    //   if (data) {
    //     setTeacherStatistics(data);
    //     console.log(data);
    //   }
    // });

    apiService.getStatistics<Course & Schedule, CourseClassTimeStatistic>('course').then((res) => {
      const { data } = res;
      if (data) {
        setCourseStatistics(data);
        console.log(data);
      }
    });
  }, [])

  return (
    <AppLayout>
      <div className="overview-container bg-white">
        <Row align="middle" gutter={[24, 16]}>
          <OverviewCard
            data={overview?.student}
            style={{ background: '#1890ff' }}
            title='COURSES'
            icon={<ReadOutlined />}
          />
          <OverviewCard
            data={overview?.teacher}
            style={{ background: '#9254de' }}
            title='COURSES'
            icon={<DeploymentUnitOutlined />}
          />
          <OverviewCard
            data={overview?.course}
            style={{ background: '#faad14' }}
            title='COURSES'
            icon={<SolutionOutlined />}
          />
        </Row>

        <Row style={{ margin: "-8px -3px -3px" }}>
          <Col span={12} className="overview-charts">
            <Card
              title="Distribution"
              extra={
                <Select defaultValue="student" onSelect={setDistributionRole} bordered={false}>
                  <Select.Option value={Role.student}>Student</Select.Option>
                  <Select.Option value={Role.teacher}>Teacher</Select.Option>
                </Select>
              }
            >
              <DistributionChart
                data={
                  (distributionRole === Role.student
                    ? studentStatistics?.country
                    : teacherStatistics?.country) as Statistic[]
                }
                title={
                  (distributionRole === Role.student
                    ? 'student'
                    : 'teacher')
                }
              />
            </Card>
          </Col>

          <Col span={12} className="overview-charts">
            <Card title="Types"
              extra={
                <Select defaultValue="Student Type" onSelect={setSelectedType} bordered={false}>
                  <Select.Option value='Student Type'>Student Type</Select.Option>
                  <Select.Option value='Course Type'>Course Type</Select.Option>
                  <Select.Option value='Gender'>Gender</Select.Option>
                </Select>
              }
            >
              {
                (selectedType === "Student Type") ? (
                  <TypeCompareChart data={studentStatistics?.type} title={selectedType} />
                )
                  : (selectedType === "Course Type") ? (
                    <TypeCompareChart data={courseStatistics?.type} title={selectedType} />
                  )
                    : (
                      <Row>
                        <Col span={12}><TypeCompareChart data={overview?.student} title={selectedType} /></Col>
                        <Col span={12}><TypeCompareChart data={overview?.teacher} title={selectedType} /></Col>
                      </Row>
                    )
              }

            </Card>
          </Col>

          <Col span={12} className="overview-charts">
            <Card title="Increment">
              <IncrementChart
                studentData={studentStatistics?.createdAt}
                teacherData={teacherStatistics?.createdAt}
                courseData={courseStatistics?.createdAt}
              />
            </Card>

          </Col>
          <Col span={12} className="overview-charts">
            <Card title="Languages">
              <LanguagesChart
                data={{
                  interest: studentStatistics?.interest as Statistic[],
                  teacher: teacherStatistics?.skills as Statistic[],
                }} />
            </Card>
          </Col>
        </Row>
      </div>
      <Row gutter={[24, 16]}>
        <Col span={24}>
          <Card title="Course Schedule">
            <HeatChart
              data={courseStatistics?.classTime as CourseClassTimeStatistic[]}
              title="Course schedule per weekday"
            />
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default Home;