import type { NextPage } from 'next'
import Head from 'next/head'
import { Layout, Menu } from 'antd';
import Login from './login';

const { Header, Content, Footer } = Layout;

const Home: NextPage = () => {
  return (
    <Layout className="layout">

      <Head>
        <title>CMS</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className="logo" defaultValue="CMS"/>
        <Menu
          theme="dark"
          mode="horizontal"
        >
          <Menu.Item>item</Menu.Item>
          <Menu.Item>item</Menu.Item>
          <Menu.Item>item</Menu.Item>
          <Menu.Item>item</Menu.Item>
          <Menu.Item>item</Menu.Item>
          <Menu.Item>SIGN IN</Menu.Item>
        </Menu>
      </Header>

      <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
          <Login/>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>©2022</Footer>

    </Layout>
  )
}

export default Home
