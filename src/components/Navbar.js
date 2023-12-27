import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const Navbar = () => {
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

  return (
    <nav id="Navbar">
      <h2 className="navbar-1">nowReports <span className="navbar-2">portal</span></h2>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    </nav>
  )
}

export default Navbar