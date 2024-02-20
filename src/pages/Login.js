import React, {useState} from 'react'
import { Button, Checkbox, Form, Input } from 'antd';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebase';
import { StepForwardFilled } from '@ant-design/icons';
import { Navigate } from 'react-router-dom';
import Navbar_out from '../components/Navbar_out';

const Login = () => {

  const [formErr, setFormErr] = useState('');

  const onFinish = (values) => {
    if(!(values.email && values.password)) return;
    setFormErr('');

    signInWithEmailAndPassword(auth, values.email, values.password)
    //.then((userCredential) => {})
    .catch((error) => {
      if(error.code == 'auth/invalid-credential') return setFormErr('Invalid credentials.');
      else setFormErr('Could not sign you in. Please try again later.');
    });
    
  };

  return (
    <div id="login-container">
      <Navbar_out page="login"></Navbar_out>
      <div id="login-text1">Sign in</div>
      <div id="login-square"> 

        <Form
          name="basic"
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          style={{maxWidth: 600}}
          initialValues={{remember: true}}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button htmlType="submit" className="nowrep-button highlight-anim red-anim account-button" >
              Sign in
            </Button>
          </Form.Item>
          <div className="error-msg">{formErr}</div>
          <div className="subscribe-text">
            Not a member? <p><u className="pointer" onClick={()=>window.location.href = window.location.origin+'/signup'}>Subscribe here</u></p>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login