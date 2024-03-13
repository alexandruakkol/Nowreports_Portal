import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Divider } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleSignup } from "../firebase";
import GoogleSignupButton from "../components/GoogleSignupButton";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {Navbar} from 'readyui';
//import {Navbar} from '../components/Navbar';

const Login = () => {
  const [formErr, setFormErr] = useState("");

  const onFinish = (values) => {
    if (!(values.email && values.password)) return;
    setFormErr("");

    signInWithEmailAndPassword(auth, values.email, values.password)
      //.then((userCredential) => {})
      .catch((error) => {
        if (error.code == "auth/invalid-credential")
          return setFormErr("Invalid credentials.");
        else setFormErr("Invalid sign in");
      });
  };

  async function signinGoogle() {
    googleSignup(
      // same as signin
      (data) => {},
      (err) => {}
    );
  }

  const large_logo = <img  
      style={{width: '12rem'}}
      className="clickable"
      alt="Now Reports Logo"
      src='./nr_w_text_black.png'
      onClick={()=>{window.location.pathname='/login'}}
    ></img>//TODO: centralize


  return (
    <div id="login-container">
      <Navbar large_logo={large_logo} items={[]}></Navbar>
      <div id="login-text1" className="text-center text-bold text-medium rethink">Sign in</div>
      <div id="login-signup-square">
        <Form
          name="normal_login"
          className="login-form"
          layout={'vertical'}
          requiredMark={false}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Username!" }]}
            label="Email"
            type="email"
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="user@email.com"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          {/* <Form.Item>
  
            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item> */}

          <Form.Item>
            <Button
                htmlType="submit"
                className="nowrep-button highlight-anim red-anim account-button gsi-material-button login-form-button"
              >
                Sign in
            </Button>
          </Form.Item>

        </Form>

        <div className="error-msg">{formErr}</div>

        <Divider ><span className="text-small rethink">Or continue with</span></Divider>
          <div className="lower-login">
            <a onClick={signinGoogle} type="d">
              <GoogleSignupButton text="Sign in with Google"></GoogleSignupButton>
            </a>
          

          <div className="text-small rethink text-center">
            Don't have an account?{" "}
            <p>
              <u
                className="pointer"
                onClick={() =>
                  (window.location.href = window.location.origin + "/signup")
                }
              >
                Register here
              </u>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
