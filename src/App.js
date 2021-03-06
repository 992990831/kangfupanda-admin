import React, { useState, useRef, useEffect, useReducer } from 'react';
import 'antd/dist/antd.css';
import { Button, notification, Card, Col, Row, Layout, Menu, Breadcrumb, Dropdown, Avatar, Badge, Modal } from 'antd';
import { Router, Route, Switch, Link } from 'react-router-dom';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

import LeftNavigation from './LeftNavigation';
import history from './history';
import Login from './Login';
import VideoList from './Video/VideoList';
import DoctorList from './Doctor/DoctorList';
import UserList from './Doctor/UserList';
import GraphicMessageList from './GraphicMessage/GraphicMessageList';

import { SiteVideoList, SiteGraphicMessageList, SiteDoctorList } from './OfficalSite';
import { PendingAuditList, ApprovedList, RejectedList } from './Audit';
import { FoundList, FollowList, JoinList, FeedbackList } from './Found';
import { NewsList } from './WeChat';

import { TagList } from './Tag';
import { ApiLogList } from './ApiLog';

import { Constants } from './Utils/Constants';

import { UsersContext } from './Utils/UsersContext';
import { AuditContext, auditReducer, initState } from './Utils/AuditContext';

import axios from 'axios';

const { Sider, Header, Content, Footer } = Layout

let minHeight = `${window.innerHeight}px`;

let collapsed = false;

function onlogin() {
  debugger
}

function App() {
  const [initLoading, setInitLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [state, dispatch] = useReducer(auditReducer, initState);

  const loginFormRef = useRef();
  // const testRef = useRef();

  useEffect(() => {
    GetUserList();
  }, [])

  const GetUserList = () => {
    axios.get(`${Constants.APIBaseUrl}/user/list`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        let users = res.data.map(user => {
          return { ...user, key: user.id, value: user.nickName };
        })

        setUsers(users);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <UsersContext.Provider value={users}>
      <AuditContext.Provider value={{ state, dispatch: dispatch }}>
        <Router history={history}>
          <Layout>
            <Layout>
              <Sider width={220} className="site-layout-background">
                <div style={{ height: '100%', minHeight: minHeight, overflowY: 'scroll', backgroundColor: '#4e73df' }}>
                  <LeftNavigation></LeftNavigation>
                </div>
              </Sider>
              <Layout style={{ padding: '0 24px 24px' }}>
                <Switch>
                  <Route exact path="/" component={GraphicMessageList} />
                  <Route exact path="/videolist" component={VideoList} />
                  <Route exact path="/doctorlist" component={DoctorList} />
                  <Route exact path="/userlist" component={UserList} />
                  <Route exact path="/messagelist" component={GraphicMessageList} />
                  <Route exact path="/feedback" component={FeedbackList} />
                  <Route exact path="/found/recommend" component={FoundList} />
                  <Route exact path="/found/follow" component={FollowList} />
                  <Route exact path="/found/join" component={JoinList} />
                  <Route exact path="/tag" component={TagList} />
                  <Route exact path="/log" component={ApiLogList} />
                  <Route exact path="/officialsite/videolist" component={SiteVideoList} />
                  <Route exact path="/officialsite/graphisList" component={SiteGraphicMessageList} />
                  <Route exact path="/officialsite/doctorList" component={SiteDoctorList} />
                  <Route exact path="/audit/pending" component={PendingAuditList} />
                  <Route exact path="/audit/approved" component={ApprovedList} />
                  <Route exact path="/audit/rejected" component={RejectedList} />
                  <Route exact path="/wechat/news" component={NewsList} />
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
                    if (loginFormRef && loginFormRef.current.onLogin && loginFormRef.current.onLogin()) {
                      setInitLoading(false);
                    }
                    else {
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
      </AuditContext.Provider>
    </UsersContext.Provider>
  );
}

export default App;
