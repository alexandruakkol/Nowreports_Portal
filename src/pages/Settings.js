import React, {useContext, useState} from 'react';
import {Card, Input, Form, Button} from 'antd';
import {AuthContext} from '../App';
import { prettifyDate } from '../etc';
import {auth} from '../firebase';
import {updatePassword, reauthenticateWithCredential, EmailAuthProvider} from 'firebase/auth';
import {CheckCircleOutlined} from '@ant-design/icons';

const Settings = () => {

  const {FB_USER} = useContext(AuthContext);
  const [passError, setPassError] = useState('');
  const [isPassSuccess, setIsPassSuccess] = useState(false);
  console.log({FB_USER})

  function onPasswordFormSubmit(values){
    const {oldpass, pass1, pass2} = values;
    if(pass1 !== pass2) return setPassError('Passwords do not match.');

    // -------------- PASSWORD RESET --------------
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      oldpass
    )
    reauthenticateWithCredential(auth.currentUser, credential)
    .then(() => {
      updatePassword(auth.currentUser, pass1)
      .then((res) => {setPassError(''); setIsPassSuccess(true);})
      .catch((err) => {setPassError('Password change failed.'); console.log(err)});
    })
    .catch(err=>{setPassError('Wrong old password.');console.log(err)});
  
  }

  return (
    <div id="frame-div">
      <Card title="Account information" className="settings-card">
        <div id="settings-list">
          <div>Email: {FB_USER.email}</div>
        </div>
      </Card>

      <Card title="Change password" className="settings-card">
        {isPassSuccess && 
          <div id="passchange-success">
            <CheckCircleOutlined className="green" id="passchange-icon"></CheckCircleOutlined>
            <p>Your password was changed successfully.</p>
            </div>}
        <div id="settings-list">
          <Form onFinish={onPasswordFormSubmit}
                autoComplete="off">
            <Form.Item 
              label="Old password" 
              name="oldpass" 
              rules={[{required: true}]}>
                <div className="input_label">
                  <Input type="password"></Input>
                </div>
            </Form.Item>

            <Form.Item 
              label="New password"  
              name="pass1"
              rules={[{required: true}]}>
              <div className="input_label">
                <Input type="password"></Input>
              </div>
            </Form.Item>

            <Form.Item 
              label="Confirm new password"  
              name="pass2"
              rules={[{required: true}]}>
              <div className="input_label">
                <Input type="password"></Input>
              </div>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                  offset: 8,
                  span: 16,
              }}>
              <Button type="default" htmlType="submit">
                  Change password
              </Button>
            </Form.Item>
            <p className="error-msg">{passError}</p>
          </Form>
        </div>
      </Card>

      <Card title="Current subscription" className="settings-card">
        <div id="settings-list">
          {FB_USER.sub_exp && <div >Access to Now Reports AI until <b>{FB_USER.sub_exp.split('T')[0]}</b></div>}
        </div>
      </Card>
    </div>
  )
}

export default Settings