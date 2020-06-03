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
            <Menu.Item key="2">图文管理<Link to='/messagelist' /></Menu.Item>
            <Menu.Item key="3">用户管理<Link to='/doctorlist' /></Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<LaptopOutlined />} title="评论">
            <Menu.Item key="5">待审核<Link to='/pendingAuditList' /></Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<LaptopOutlined />} title="官网">
            <Menu.Item key="6">视频列表<Link to='/officialsite/videolist' /></Menu.Item>
            <Menu.Item key="7">图文<Link to='/officialsite/graphisList' /></Menu.Item>
            <Menu.Item key="8">医生<Link to='/officialsite/doctorList' /></Menu.Item>
          </SubMenu>
        </Menu>
    );

}

export default LeftNavigation;
