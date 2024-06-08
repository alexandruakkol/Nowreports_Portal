import React, { useState, useContext } from 'react';
import { Avatar, Popover } from 'antd';
import {AuthContext} from '../App';
import {LogoutOutlined} from '@ant-design/icons';
import { fb_signOut } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { IoReturnDownBack } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

const Old_navbar = () => {

  const {FB_USER} = useContext(AuthContext);
  const navigate = useNavigate();

  const avatarContext = (
    <div id="avatar-context">
      <p className='avatar-context-option' onClick={()=>navigate('/settings')}>
        <FaUser></FaUser>Account and settings</p>
      <p className='avatar-context-option' onClick={() => {window.location.href=window.location.origin}}>
        <IoReturnDownBack></IoReturnDownBack>
        Go to Home
      </p>
      <p className='avatar-context-option' onClick={fb_signOut}><LogoutOutlined></LogoutOutlined> Logout</p>
    </div>
  );

    function CreditCounter(){
      return FB_USER.credits ? <div id="credit-counter">
        {/* <div>{FB_USER.credits}</div>
        <div>Queries remaining</div> */}
      </div> : <></>
    }


  const [current, setCurrent] = useState('mail');

  const onClick = (e) => {
    setCurrent(e.key);
  };


  return (
    <nav className="Navbar">
      <div id="navbar-1" onClick={()=>navigate('/portal')}>
        <img id="navbar-logo" src="CEOChat_combo_inline_black.png" alt="CEOChat logo"></img>
      </div>
      {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} /> */}
      <div id="navbar-2">
        <Popover content={avatarContext} width  title={`Welcome, ${FB_USER.name}`} placement="bottomRight">
          <Avatar
            style={{
              backgroundColor: '#343434',
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

export default Old_navbar