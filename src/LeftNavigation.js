import React from 'react';
import { Menu } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { Router, Route, Switch, Link } from 'react-router-dom';

const { SubMenu } = Menu;

function LeftNavigation(handleClick) {
    return (
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu key="sub1" icon={<UserOutlined />} title="内容管理">
            <Menu.Item key="1">视频管理<Link to='/videolist' /></Menu.Item>
            <Menu.Item key="2">治疗师管理<Link to='/doctorlist' /></Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<LaptopOutlined />} title="设置">
            <Menu.Item key="5">option5</Menu.Item>
            <Menu.Item key="6">option6</Menu.Item>
            <Menu.Item key="7">option7</Menu.Item>
            <Menu.Item key="8">option8</Menu.Item>
          </SubMenu>
        </Menu>
    );

}

export default LeftNavigation;
