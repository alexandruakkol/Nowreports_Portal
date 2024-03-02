import React, {useState} from 'react'
import { Button, Checkbox, Form, Input } from 'antd';
import {auth, googleSignup} from '../firebase';
import { StepForwardFilled, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import Navbar_out from '../components/Navbar_out';
import { sendLog, FB_err_handler } from '../utils';
import GoogleSignupButton from '../components/GoogleSignupButton';
import {newAccountSequence, FBError} from '../account_operations';

const Signup = () => {

    const [formErr, setFormErr] = useState('');
    const [formSuccess, setFormSuccess] = useState(false);
    //if(FB_USER.uid) window.location.href =window.location.origin+'/login';

    async function signupGoogleFend(){
        googleSignup(
            (data)=>{},
            (err)=>{}
        );
    }

  const onFinish = async (values) => {
    const {email, password, password2, name} = values;
    if(!(email && password)) return;
    if(password != password2) return setFormErr('Passwords do not match.');
    setFormErr('');

    const newAccountRes = await newAccountSequence(
        values,
        (err) => {setFormErr(err?.message || String(err))}, //err handler
        (fb_err_code) => {setFormErr(FB_err_handler(fb_err_code))}, //firebase error handler
    );
    if(newAccountRes?.ok) {
        setFormErr('');
        setFormSuccess(true);
    }
    
  };

  function BeforeSuccess(){
    return  <>
        <div id="login-text1">Create your account</div>
        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                maxWidth: 600,
                minWidth: 400
            }}
            onSubmit={e => e.preventDefault()}
            onFinish={onFinish}
            autoComplete="off"
        >
        <Form.Item
            label="First name"
            name="name"
            rules={[
            {
                required: true,
                message: 'Please input your name!',
            },
            ]}
        >
            <Input />
        </Form.Item>

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
            label="Retype password"
            name="password2"
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
            wrapperCol={{
            offset: 8,
            span: 16,
            }}
        >
            <Button htmlType="submit" className="nowrep-button highlight-anim red-anim account-button"> 
                Create account
            </Button>
        </Form.Item>
        <div className="error-msg">{formErr}</div>
        </Form> 
        <a onClick={signupGoogleFend}>
            <GoogleSignupButton></GoogleSignupButton>
        </a>
    </>
  }

  function AfterSuccess(){
    return <>
        <div id="signup-success-container">
            <span><CheckCircleOutlined className="green subscribe-check-icon"/><span> Your account has been created.</span></span>
        </div>
        {/* {TODO: onscroll underline effects on this and on all text} */}
        {/* <div id="goto_portal_text" onClick={()=>window.location.href = window.location.origin}>Go to AI Portal</div> */}
    </>
  }

  return (
    <div id="login-container">
         <Navbar_out></Navbar_out>
        {formSuccess ? <AfterSuccess/> : <BeforeSuccess/>}
    </div>
  )
}

export default Signup