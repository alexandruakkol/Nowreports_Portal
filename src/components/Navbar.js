import React, { useState, useContext } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Avatar, Popover, Button } from 'antd';
import {AuthContext, MainModeContext} from '../App';
import {LogoutOutlined} from '@ant-design/icons';
import { fb_signOut } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const {FB_USER} = useContext(AuthContext);
  //const {setMAIN_MODE} = useContext(MainModeContext);
  const navigate = useNavigate();

  const items = [
    {
      label: 'Navigation One',
      key: 'mail',
    },
    {
      label: 'Navigation Two',
      key: 'app',
    },
    {
      label: 'Navigation Three - Submenu',
      key: 'SubMenu',
    },
  ];

  const [current, setCurrent] = useState('mail');

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const avatarContext = (
    <div id="avatar-context">
      <p className='avatar-context-option' onClick={()=>navigate('/settings')}>Account and settings</p>
      <p className='avatar-context-option' onClick={fb_signOut}><LogoutOutlined></LogoutOutlined> Logout</p>
    </div>
  );

    function CreditCounter(){
      return FB_USER.credits ? <div id="credit-counter">
        <div>{FB_USER.credits}</div>
        <div>Credits remaining</div>
      </div> : <></>
    }

  return (
    <nav id="Navbar">
      <h2 id="navbar-1" onClick={()=>{navigate('/')}}>Now Reports<span className="navbar-ai-span">AI</span></h2>
      {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} /> */}
      <div id="navbar-2">
        <Popover content={avatarContext} title={`Welcome, ${FB_USER.name}`}>
          <Avatar
            style={{
              backgroundColor: 'purple',
              verticalAlign: 'middle',
            }}
            size="large"
          >
            {FB_USER.name[0]}
          </Avatar>
        </Popover>
        <CreditCounter></CreditCounter>
      </div>
    </nav>
  )
}

export default Navbar