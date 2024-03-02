import React, { useState, useContext } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Avatar, Popover, Button } from 'antd';
import {AuthContext} from '../App';
import {LogoutOutlined} from '@ant-design/icons';
import { fb_signOut } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const {FB_USER} = useContext(AuthContext);
  const navigate = useNavigate();

  const avatarContext = (
    <div id="avatar-context">
      <p className='avatar-context-option' onClick={()=>navigate('/settings')}>Account and settings</p>
      <p className='avatar-context-option' onClick={fb_signOut}><LogoutOutlined></LogoutOutlined> Logout</p>
    </div>
  );

    function CreditCounter(){
      return FB_USER.credits ? <div id="credit-counter">
        <div>{FB_USER.credits}</div>
        <div>Queries remaining</div>
      </div> : <></>
    }


  const [current, setCurrent] = useState('mail');

  const onClick = (e) => {
    setCurrent(e.key);
  };


  return (
    <nav className="Navbar">
      <div id="navbar-1" onClick={()=>navigate('/portal')}>
        <img id="navbar-logo" src="/nr_logo_black.svg"></img>
      </div>
      {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} /> */}
      <div id="navbar-2">
        <Popover content={avatarContext} title={`Welcome, ${FB_USER.name}`}>
          <Avatar
            style={{
              backgroundColor: '#a70000',
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