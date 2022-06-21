import { Form, Input, Button, Radio, Checkbox, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { LoginFormValues } from '../lib/model/login';
import apiService from '../lib/services/api-service';
import storage from '../lib/services/storage';

export default function Login() {
  const router = useRouter();
  const axios = require('axios').default;
  const AES = require("crypto-js/aes")

  const onFinish = (values: { role: string, email: string, password: string }) => {
    axios.post('http://cms.chtoma.com/api/login', {
      ...values,
      password: AES.encrypt(values.password, 'cms').toString()
    }).then((result: any) => {
      const data = result.data.data;
      localStorage.setItem('cms', JSON.stringify(data))
      router.push('dashboard')
    }).catch((error: any) => {
      message.error('Please input right pwd')
    });
  };

  const login = async (loginRequest: LoginFormValues) => {
    const { data } = await apiService.login(loginRequest);

    if (!!data) {
      storage.setUserInfo(data);
      router.push('dashboard');
    }
  };

  return (
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
            onFinish={(values: LoginFormValues) => login(values)}
          >
            <Form.Item name='role' rules={[{ required: true }]}>
              <Radio.Group>
                <Radio.Button value="student">Student</Radio.Button>
                <Radio.Button value="teacher">Teacher</Radio.Button>
                <Radio.Button value="manager">Manager</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ type: "email", required: true, message: 'Please input your username!' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{
                required: true,
                message: ' Your password must be between 4 and 16 characters',
                min: 4,
                max: 16
              }]}
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
