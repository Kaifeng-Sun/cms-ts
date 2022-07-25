import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Layout, Menu, message, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import router, { useRouter } from "next/router";
import apiService from '../../lib/services/api-service';
import storage from '../../lib/services/storage';
import Link from 'next/link';
import Breadcrumbs from '../common/breadcrumbs';
import { Role } from '../../lib/model/role';
import { routes, SideBarItem } from '../../lib/constant/routes';
import { getActiveKey } from '../../lib/util/side-nav';
import { useUserRole } from '../custom-hooks/login-state';
import styled from 'styled-components';

const {Header, Content, Sider, Footer } = Layout;

const StyledContent = styled(Content)`
  margin: 16px;
  background-color: #fff;
  padding: 16px;
  min-height: auto;
`;

const StyledLayoutHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
`;

function renderMenuItems(data: SideBarItem[], parent = '') {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const userRole = useUserRole();
  return data.map((item, index) => {
    const key = `${item.label}_${index}`

    if (item.subMenu) {
      return (
        <Menu.SubMenu key={key} title={item.label} icon={item.icon}>
          {renderMenuItems(item.subMenu, item.path.join('/'))}
        </Menu.SubMenu>
      );
    }
    else {
      return item.hide ? null : (
        <Menu.Item key={key} title={item.label} icon={item.icon}>
          {!!item.path.length || item.label.toLocaleLowerCase() === 'overview' ? (
            <Link href={['/dashboard', userRole, parent, ...item.path].join('/')}>
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </Menu.Item>
      );
    }
  });
}

const getMenuConfig = (
  data: SideBarItem[]
): { defaultSelectedKeys: string[]; defaultOpenKeys: string[] } => {
  const key = getActiveKey(data);
  const defaultSelectedKeys = [key.split('/').pop()] as string[];
  const defaultOpenKeys = key.split('/').slice(0, -1);

  return { defaultSelectedKeys, defaultOpenKeys };
};

export default function AppLayout(props: React.PropsWithChildren<any>) {
  const { children } = props;
  const router = useRouter();
  const userRole = useUserRole();
  const sideMenu = routes.get(userRole) as SideBarItem[];
  const menuItems = renderMenuItems(sideMenu);
  const [collapsed, toggleCollapse] = useState(false);
  const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(sideMenu);

  const onLogOut = async () => {

    const { data: isLogout } = await apiService.logout();

    if (isLogout) {
      storage.deleteUserInfo();
      router.push('/login');
    }
  }

  const toggleCollapsed = () => {
    toggleCollapse(!collapsed);
  };

  const items1: MenuProps['items'] = [
    {
      label: <a onClick={onLogOut}>Log Out</a>,
      key: 'logout'
    }
  ];

  return (
    <Layout
     style={{
      height: '100vh',
    }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(isCollapsed) => toggleCollapse(isCollapsed)}
        style={{position: 'fixed',height:'100vh'}}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={defaultOpenKeys}
          defaultSelectedKeys={defaultSelectedKeys}
        >
          {menuItems}
        </Menu>
      </Sider>

      <Layout style={{marginLeft:'200px'}}>
        <StyledLayoutHeader
          className="header flex justify-end"
        >
          <div className="flex-grow">
            <Button
              type="primary"
              onClick={toggleCollapsed}
              style={{ marginBottom: 16 }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            items={items1}
            style={{ width: '20%' }}
          />
        </StyledLayoutHeader>
        <Layout>
          <Breadcrumbs/>
          <StyledContent
            className="site-layout-background"
          >
            {children}
          </StyledContent>

          {/* <Footer style={{ textAlign: "center" }}>©2022</Footer> */}
        </Layout>
      </Layout>
    </Layout>
  );
}
