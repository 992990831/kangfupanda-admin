import React from 'react';
import 'antd/dist/antd.css';
import { Button, Card, Col, Row, Layout, Menu, Breadcrumb, Dropdown, Avatar, Badge, Modal } from 'antd';
import { Router, Route, Switch, Link } from 'react-router-dom';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

import LeftNavigation from './LeftNavigation';
import history from './history';
import VideoList from './Video/VideoList';
import DoctorList from './DoctorList';

const { SubMenu } = Menu;
const { Sider, Header, Content, Footer } = Layout

let minHeight = `${window.innerHeight}px`;

let collapsed = false;

function App() {
  return (
    <Router history={history}>
      <Layout>
        {/* <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header> */}
        <Layout>
          <Sider width={200} className="site-layout-background">
            <div style={{ height: '100%', minHeight: minHeight, overflowY: 'scroll', backgroundColor: '#4e73df' }}>
              <LeftNavigation></LeftNavigation>
            </div>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
              <Switch>
                <Route exact path="/" component={VideoList} />
                <Route exact path="/videolist" component={VideoList} />
                <Route exact path="/doctorlist" component={DoctorList} />
                {/* <Route path="/app/template/create" component={CreateTemplateHOC} />
                <Route path="/app/template/list" component={TemplateList} />
                <Route path="/app/template/view/:templateId?" component={ViewTemplate} />
                <Route path="/app/template/approve/:templateId?" component={ApproveTemplate} />
                <Route path="/app/project/create/:draftId?" component={CreateProjectForm} />
                <Route path="/app/project/list/:status?" component={ProjectList} />
                <Route path="/app/project/draft/" component={DraftList} />
                <Route path="/app/project/view/:projId?" component={ViewProject} />
                <Route path="/app/project/approve/:projId?" component={ApproveProject} />
                <Route path="/app/flow/setting" component={FlowSetting} />
                <Route path="/app/flow/list" component={FlowList} />
               
                <Route path="/app/department/list" component={DepartmentList} />
                <Route path="/app/jurisdictionManage/menuManage" component={MenuManage} />
                <Route path="/app/jurisdictionManage/roleManage" component={RoleManage} />
                <Route path="/app/jurisdictionManage/userManage" component={UserList} />
                <Route path="/app/log/list" component={LogList} />
                <Route path="/app/outMemberInfo/list" component={OutMemberInfoList} />

                <Route path="/app/formLib/index" component={FormLib} /> */}
              </Switch>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
