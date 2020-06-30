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
          <SubMenu key="sub1" icon={<UserOutlined />} title="研习社内容管理">
            <Menu.Item key="1">图文+音频审核<Link to='/messagelist' /></Menu.Item>
            <Menu.Item key="2">视频审核<Link to='/videolist' /></Menu.Item>
            <Menu.Item key="3">标签管理<Link to='/tag' /></Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<LaptopOutlined />} title="发现页管理">
            <Menu.Item key="4">专家<Link to='/found' /></Menu.Item>
            <Menu.Item key="5">产品<Link to='/' /></Menu.Item>
            <Menu.Item key="6">活动<Link to='/' /></Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<LaptopOutlined />} title="作品评论管理">
            <Menu.Item key="7">待审核<Link to='/audit/pending' /></Menu.Item>
            <Menu.Item key="8">已通过<Link to='/audit/approved' /></Menu.Item>
            <Menu.Item key="9">已拒绝<Link to='/audit/rejected' /></Menu.Item>
          </SubMenu>
          <SubMenu key="sub4" icon={<LaptopOutlined />} title="用户管理">
            <Menu.Item key="10">专家审核<Link to='/doctorList' /></Menu.Item>
            <Menu.Item key="11">普通用户<Link to='/userlist' /></Menu.Item>
          </SubMenu>
          <SubMenu key="sub5" icon={<LaptopOutlined />} title="官网">
            <Menu.Item key="12">图文+音频<Link to='/officialsite/videolist' /></Menu.Item>
            {/* <Menu.Item key="12">图文<Link to='/officialsite/graphisList' /></Menu.Item> */}
            <Menu.Item key="13">专家<Link to='/officialsite/doctorList' /></Menu.Item>
          </SubMenu>
        </Menu>
    );

}

export default LeftNavigation;
