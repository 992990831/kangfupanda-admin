import React, { useState, useEffect, useRef, useReducer, useContext } from 'react';
import { Menu, Badge } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { Router, Route, Switch, Link } from 'react-router-dom';
import { Constants } from './Utils/Constants';
import { AuditContext } from './Utils/AuditContext';
import axios from 'axios';

const { SubMenu } = Menu;

function LeftNavigation() {
  const auditContext = useContext(AuditContext);

  useEffect(() => {
    GetPendingAuditCount();
  }, [])

  const GetPendingAuditCount = () => {
    axios(`${Constants.APIBaseUrl}/comments/audit/pending/count`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      //setPendingAuditCount(res.data);
     
      auditContext.dispatch({
        type: 'set',
        payload: { count: res.data }
        });
    })
  }

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
          <Menu.Item key="11">推荐<Link to='/found/recommend' /></Menu.Item>
          <Menu.Item key="12">关注<Link to='/found/follow' /></Menu.Item>
          <Menu.Item key="13">参加<Link to='/found/join' /></Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" icon={<LaptopOutlined />} title={<Badge count={auditContext.state.count}>作品评论管理&nbsp;&nbsp;</Badge>}>
          <Menu.Item key="21">待精选<Link to='/audit/pending' /></Menu.Item>
          <Menu.Item key="22">已通过<Link to='/audit/approved' /></Menu.Item>
          <Menu.Item key="23">已拒绝<Link to='/audit/rejected' /></Menu.Item>
        </SubMenu>
        <SubMenu key="sub4" icon={<LaptopOutlined />} title="用户管理">
          <Menu.Item key="31">专家审核<Link to='/doctorList' /></Menu.Item>
          <Menu.Item key="32">普通用户<Link to='/userlist' /></Menu.Item>
          {/* <Menu.Item key="33">访问量统计<Link to='/log' /></Menu.Item> */}
        </SubMenu>
        <SubMenu key="sub5" icon={<LaptopOutlined />} title="官网">
          <Menu.Item key="41">图文+音频<Link to='/officialsite/videolist' /></Menu.Item>
          {/* <Menu.Item key="12">图文<Link to='/officialsite/graphisList' /></Menu.Item> */}
          <Menu.Item key="42">专家<Link to='/officialsite/doctorList' /></Menu.Item>
        </SubMenu>
      </Menu>

  );

}

export default LeftNavigation;
