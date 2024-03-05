import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Divider } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleSignup } from "../firebase";
import Navbar_out from "../components/Navbar_out";
import GoogleSignupButton from "../components/GoogleSignupButton";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

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

  return (
    <div id="login-container">
      <Navbar_out page="login"></Navbar_out>
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

        <Divider ><span className="text-small">Or continue with</span></Divider>
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



{/* 
        <Form
          name="basic"
          className="login-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          // initialValues={{remember: true}}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
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
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <div id="signin-methods">
              <Button
                htmlType="submit"
                className="nowrep-button highlight-anim red-anim account-button gsi-material-button login-form-button"
              >
                Sign in
              </Button>
              <a onClick={signinGoogle}>
                <GoogleSignupButton text="Sign in with Google"></GoogleSignupButton>
              </a>
            </div>
          </Form.Item>
          <div className="error-msg">{formErr}</div>
          <div className="subscribe-text">
            Not a member?{" "}
            <p>
              <u
                className="pointer"
                onClick={() =>
                  (window.location.href = window.location.origin + "/signup")
                }
              >
                Subscribe here
              </u>
            </p>
          </div>
        </Form> */}

      </div>
    </div>
  );
};

export default Login;
