import React, { useState, useRef } from 'react';
import 'antd/dist/antd.css';
import { Button, notification, Card, Col, Row, Layout, Menu, Breadcrumb, Dropdown, Avatar, Badge, Modal } from 'antd';
import { Router, Route, Switch, Link } from 'react-router-dom';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

import LeftNavigation from './LeftNavigation';
import history from './history';
import Login from './Login';
import VideoList from './Video/VideoList';
import DoctorList from './Doctor/DoctorList';
import GraphicMessageList from './GraphicMessage/GraphicMessageList';

import { SiteVideoList, SiteGraphicMessageList, SiteDoctorList } from './OfficalSite';

const { SubMenu } = Menu;
const { Sider, Header, Content, Footer } = Layout

let minHeight = `${window.innerHeight}px`;

let collapsed = false;

function onlogin(){
  debugger
}

function App() {
  const [initLoading, setInitLoading] = useState(true);
  const loginFormRef = useRef();
  // const testRef = useRef();

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
                <Route exact path="/messagelist" component={GraphicMessageList} />
                <Route exact path="/officialsite/videolist" component={SiteVideoList} />
                <Route exact path="/officialsite/graphisList" component={SiteGraphicMessageList} />
                <Route exact path="/officialsite/doctorList" component={SiteDoctorList} />
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
                if(loginFormRef && loginFormRef.current.onLogin && loginFormRef.current.onLogin())
                {
                  setInitLoading(false);
                }
                else
                {
                  notification.open({
                    message: '登录失败',
                    description:
                      '登录失败',
                    onClick: () => {
                      //console.log('Notification Clicked!');
                    },
                    duration: 3
                  });
                }
              }
              }>
              登录
            </Button>,
          ]}
        >
          
          <Login ref={loginFormRef}></Login>
        </Modal>
      </Layout>
      
    </Router>
  );
}

export default App;
