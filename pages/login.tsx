import { Form, Input, Button, Radio, Checkbox, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';

export default function Login() {

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return(
    <>
      <Row justify="center">
        <Col md={8} sm={24}>
          <Form
      name="normal_login"
      className="login-form"
      initialValues={{ 
        remember: true,
        role: "student"
       }}
      onFinish={onFinish}
    >
      <Form.Item name='role'>
        <Radio.Group>
          <Radio.Button value="student">Student</Radio.Button>
          <Radio.Button value="teacher">Teacher</Radio.Button>
          <Radio.Button value="manager">Manager</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="email"
        rules={[{ type: "email" ,required: true, message: 'Please input your username!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ 
          required: true, 
          message: ' Your password must be between 4 and 16 characters', 
          min: 4, 
          max: 16}]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Sign in
        </Button>
        Or <a href="">register now!</a>
      </Form.Item>
    </Form>
        </Col>
      </Row>
    </>
    
  )
};
