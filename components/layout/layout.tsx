import React, { useState } from 'react';
import Head from "next/head";
import {
  DashboardOutlined,
  SolutionOutlined,
  TeamOutlined,
  DeploymentUnitOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, message, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadOutlined,
  FileAddOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useRouter } from "next/router";
import apiService from '../../lib/services/api-service';
import storage from '../../lib/services/storage';
import Link from 'next/link';
import Breadcrumbs from '../common/breadcrumbs';
import { Role } from '../../lib/model/role';

const { Header, Content, Sider, Footer } = Layout;


export default function AppLayout(props: React.PropsWithChildren<any>) {
  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const userRole = storage.role || (router.pathname.split('/')[2] as Role);
  const items2: MenuProps['items'] = [
    {
      label: <Link href={'/dashboard'}>Overview</Link>,
      key: 'overview-sidebar',
      icon: React.createElement(DashboardOutlined)
    },
    {
      label: 'Student',
      key: 'student-sidebar',
      icon: React.createElement(SolutionOutlined),
      children: [
        {
          label: <Link href={'/dashboard/'+ userRole + '/students'}>Student List</Link>,
          key: 'student-list-sidebar',
          icon: React.createElement(TeamOutlined),
        }
      ]
    },
    {
      label: 'Teacher',
      key: 'teacher-sidebar',
      icon: React.createElement(DeploymentUnitOutlined),
      children: [
        {
          label: 'Teacher List',
          key: 'teacher-list-sidebar',
          icon: React.createElement(TeamOutlined)
        }
      ]
    },
    {
      label: 'Course',
      key: 'course-sidebar',
      icon: React.createElement(ReadOutlined),
      children: [
        {
          label: 'All Course',
          key: 'all-course-sidebar',
          icon: React.createElement(ProjectOutlined)
        },
        {
          label: 'Add Course',
          key: 'add-course-sidebar',
          icon: React.createElement(FileAddOutlined)
        },
        {
          label: 'Edit Course',
          key: 'edit-course-sidebar',
          icon: React.createElement(EditOutlined)
        },
      ]
    }
  ]

  const onLogOut = async () => {

    const { data: isLogout } = await apiService.logout();

    if (isLogout) {
      storage.deleteUserInfo();
      router.push('/login');
    }
  }

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items1: MenuProps['items'] = [
    {
      label:
        <a
          onClick={onLogOut}
        >
          Log Out
        </a>,
      key: 'logout'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>CMS</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}

          items={items2}
        />
      </Sider>

      <Layout>
        <Header className="header flex justify-end" style={{ position: 'fixed', zIndex: 1000, width: '100%' }}>
          <div className="logo flex-grow">
            <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            items={items1}
            style={{ width: '20%' }}
          />
        </Header>
        <Layout
          style={{
            padding: '0 24px 24px',
            marginTop: '70px'
          }}>
          <Breadcrumbs />
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >

            {children}
          </Content>

          {/* <Footer style={{ textAlign: "center" }}>©2022</Footer> */}
        </Layout>
      </Layout>
    </Layout>
  );
}
