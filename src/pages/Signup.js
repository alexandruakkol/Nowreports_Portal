import React, {useState} from 'react'
import { Button, Checkbox, Form, Input } from 'antd';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebase';
import { StepForwardFilled, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const Signup = () => {

    const [formErr, setFormErr] = useState('');
    const [formSuccess, setFormSuccess] = useState(false);

    function FB_err_handler(errCode){
        switch(errCode){
            case 'auth/weak-password' : 
                setFormErr('Password too weak. Strenghten your password.');
                break;
            case 'auth/email-already-in-use' : 
                setFormErr('Cannot create account with this email.');
                break;
            default:
                setFormErr('Account creation error. Please try again later. Code 24.')
        }
    }

  const onFinish = async (values) => {
    const {email, password, password2, name} = values;
    if(!(email && password)) return;
    if(password != password2) return setFormErr('Passwords do not match.');
    setFormErr('');
    try{
        // ------------- CREATE FIREBASE USER ------------- \\
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if(!userCredential?.user) return setFormErr('Unexpected error. Code 22.');
        const idtoken = await userCredential.user.getIdToken();
        setFormErr('');
        
        // ------------- CREATE STRIPE CUSTOMER ------------- \\
        const customer_res = await axios.post('/create-stripe-customer', {email, name});
        const stripe_customer_id = customer_res.data?.id;
        if(!stripe_customer_id) return setFormErr('Unexpected error. Code 25.');

        // ------------- INSERT DB CLIENT ------------- \\
        const data = {email, name, idtoken, stripe_customer_id};
        const db_req = await axios.post('/createAccount', data );
    
        if(db_req.status === 200) {
            setFormErr('');
            setFormSuccess(true);
        }
    } catch(err){
        console.log(err);
        if(err.code) return FB_err_handler(err.code); // if firebase error
        setFormErr('Unexpected generic form error. Code 23.'); 
    }
   
  };

  function BeforeSuccess(){
    return  <>
        <div id="login-text1">Sign up to Now Reports AI</div>
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
            onSubmit={e=>{console.log(e); e.preventDefault()}}
            onFinish={onFinish}
            autoComplete="off"
        >
        <Form.Item
            label="Name"
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
            <Button htmlType="submit"> 
                Submit
            </Button>
        </Form.Item>
        <div className="error-msg">{formErr}</div>
        </Form> 
    </>
  }

  function AfterSuccess(){
    return <>
        <div id="signup-success-container">
            <span><CheckCircleOutlined className="green subscribe-check-icon"/><span> Your account has been created.</span></span>
        </div>
        {/* {TODO: onscroll underline effects on this and on all text} */}
        <div id="goto_portal_text" onClick={()=>window.location.href = window.location.origin}>Go to AI Portal</div>
    </>
  }

  return (
    <div id="login-container">
        <header id="login-header">Now Reports</header>
        {formSuccess ? <AfterSuccess/> : <BeforeSuccess/>}
    </div>
  )
}

export default Signup