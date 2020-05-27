import React, { Component, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Table, Form, Popconfirm, Modal, message, Tag, Space, Select, Input,notification } from 'antd';
import axios from 'axios';
import { Constants } from '../Utils/Constants';
import ImageUploader from '../Utils/ImageUploader';

import './DoctorList.css';

const { TextArea } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function DoctorList() {
  const columns = [
    // {
    //   title: 'id',
    //   dataIndex: 'openId',
    //   key: 'openId',
    // render: text => <span style={{width:'10px'}}>{text}</span>,
    // },
    {
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickname',
      render: text => <a>{text}</a>,
    },
    {
      title: '个人照',
      key: 'headpic',
      dataIndex: 'headpic',
      render: headpic => (
        <>
          <img src={headpic} alt="" className="doctorHeadPic" />
        </>
      ),
    },
    {
      title: '用户类型',
      dataIndex: 'usertype',
      key: 'usertype',
    },
    {
      title: '简介',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: '省',
      dataIndex: 'province',
      key: 'province',
    },
    {
      title: '市',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          {
            !record.verified? 
            <a onClick={(e) => {
              verifyUser(record.openId);
            }}>认证</a>:
            <a onClick={(e) => {
              unverifyUser(record.openId);
            }}>取消认证</a>
          }
          
          
          <a onClick={(e) => {
            showEditUser(record);
          }}>修改</a>
          <Popconfirm title="确定删除?" onConfirm={() => {
                DeleteUser(record.openId);
              }}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
        </Space>
      ),
    },
  ];

  const addFormRef = useRef();
  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [headpic, setHeadpic] = useState(null);

  useEffect(() => {

    if (users && users.length > 0) {
      return;
    }

    getList();
  })

  const getList = () => {
    axios(`${Constants.APIBaseUrl}/user/list`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      setUsers(res.data);
    })
  }

  const showAddForm = () => {
    setShowAdd(true);
  }

  const handleCancel = () => {
    setShowAdd(false);
  }

  const handleOk = () => {
    var values = addFormRef.current.getFieldsValue();
    debugger;
    if(!values.openId){
      addUser(values);
    }
    else{
      UpdateUser(values);
    }
  }

  const addUser = (user) =>{
    user.headpic = headpic;
    axios.post(`${Constants.APIBaseUrl}/user/add`, user, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        setShowAdd(false);
        getList();
      })
      .catch( (error) => {
        console.log(error);
        setShowAdd(false);
        notification.open({
          message: '保存失败',
          description:
            '保存用户信息失败',
          onClick: () => {
            //console.log('Notification Clicked!');
          },
          duration: 3
        });
      });
  }

  const DeleteUser = (openId) =>
  {
    axios.delete(`${Constants.APIBaseUrl}/user/delete?openId=${openId}`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        getList();
      })
      .catch(function (error) {
        notification.open({
          message: '删除失败',
          description:
            '删除用户信息失败',
          onClick: () => {
            //console.log('Notification Clicked!');
          },
          duration: 3
        });
      });
  }

  const showEditUser = (user) =>
  {
      setShowAdd(true);

      //必须有个延迟，等Form弹出来，否则addFormRef为空
      window.setTimeout(()=>{
        setHeadpic(user.headpic);
        addFormRef.current.setFieldsValue({
          openId: user.openId,
          nickname: user.nickName,
          province: user.province,
          city: user.city,
          sex: user.sex,
          headpic: user.headpic,
          usertype: user.usertype,
          note: user.note
        });
      }, 200)
      
  }

  const UpdateUser = () =>
  {
    debugger
    var values = addFormRef.current.getFieldsValue();

    values.headpic = headpic;
    axios.post(`${Constants.APIBaseUrl}/user/update`, values, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        setShowAdd(false);
        getList();
      })
      .catch( (error) => {
        console.log(error);
        setShowAdd(false);
        notification.open({
          message: '保存失败',
          description:
            '保存用户信息失败',
          onClick: () => {
            //console.log('Notification Clicked!');
          },
          duration: 3
        });
      });
  }

  const handleAfterUploadImage = (headpic) => {
    setHeadpic(headpic);
  }

  const verifyUser = (openId) => {
    axios(`${Constants.APIBaseUrl}/user/verify?openId=${openId}`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      getList();
    })
  }

  const unverifyUser = (openId) => {
    axios(`${Constants.APIBaseUrl}/user/unverify?openId=${openId}`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      getList();
    })
  }

  return (
    <React.Fragment>
      <Row type="flex" justify='end'>
        <Col>
          <Button type="primary" onClick={showAddForm}>添加</Button>
        </Col>
      </Row>
      <Table columns={columns} dataSource={users} />
      <Modal
          title='添加用户'
          visible={showAdd}
          footer={[
            <Button key="back" onClick={handleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={false} onClick={handleOk}>
              保存
            </Button>,
          ]}
          // onOk={this.handleOk.bind(this)}
          // onCancel={this.handleCancel.bind(this)}
        >
          <Row>
            <Col span={24}>
              <Form ref={addFormRef} {...layout}>
              <Form.Item
                  name="openId"
                  label="openId"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input readOnly={true}/>
                </Form.Item>
                <Form.Item
                  name="nickname"
                  label="昵称"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="province"
                  label="省"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="city"
                  label="市"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="note"
                  label="简介"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <TextArea rows={2} />
                </Form.Item>
                <Form.Item label="用户类型" name="usertype">
                  <Select defaultValue="普通用户">
                    <Select.Option value="普通用户">普通用户</Select.Option>
                    <Select.Option value="治疗师">治疗师</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="headpic"
                  label="头像"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <ImageUploader afterUpload={handleAfterUploadImage}></ImageUploader>
                </Form.Item>
              </Form>

            </Col>
          </Row>
        </Modal>
    </React.Fragment>
  )
}

// class DoctorList extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       showAdd: false,
//       loading: false
//     }
//   }
//   componentWillMount() {
//   }

//   render() {
//     const { loading } = this.state;

//     return (
//       <React.Fragment>
//         <Row type="flex" justify='end'>
//           <Col>
//             <Button type="primary" onClick={this.Add.bind(this)}>添加</Button>
//           </Col>
//         </Row>
//         <Table columns={columns} dataSource={data} />
//       </React.Fragment>
//     );
//   }
// }

export default withRouter(DoctorList)