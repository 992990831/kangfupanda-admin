import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Button, Card, Col, Row, Layout, Menu, Breadcrumb, Dropdown, Avatar, Badge, Modal } from 'antd';
import { Router, Route, Switch, Link } from 'react-router-dom';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

import LeftNavigation from './LeftNavigation';
import history from './history';
import { Login } from './Login';
import VideoList from './Video/VideoList';
import DoctorList from './Doctor/DoctorList';

const { SubMenu } = Menu;
const { Sider, Header, Content, Footer } = Layout

let minHeight = `${window.innerHeight}px`;

let collapsed = false;

function onlogin(){
  debugger
}

function App() {
  const [initLoading, setInitLoading] = useState(true);
  return (
    <Router history={history}>
      <Layout>
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
              </Switch>
          </Layout>
        </Layout>
        <Modal
          title='登录'
          visible={initLoading}
          maskClosable={false}
          footer={[
            <Button key="submit" type="primary" loading={false} onClick={
              () => {
                // setTimeout(() => {
                //   setInitLoading(false);
                // }, 1500);
                setInitLoading(false);
              }
              }>
              登录
            </Button>,
          ]}
          onOk={ () => {setInitLoading(false);} }
          onCancel={ () => {setInitLoading(false);} }
        >
          <Login onLogin={onlogin}></Login>
        </Modal>
      </Layout>
      
    </Router>
  );
}

export default App;
