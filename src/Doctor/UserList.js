import React, { Component, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Table, Form, Popconfirm, Modal, message, Tag, Space, Select, Input, notification } from 'antd';
import axios from 'axios';
import { Constants } from '../Utils/Constants';
import ImageUploader from '../Utils/ImageUploader';

import './DoctorList.css';

const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function UserList() {
  

  const addFormRef = useRef();
  const [users, setUsers] = useState([]);
  //模拟登录用
  const [userOpenId, setUserOpenId] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQRCode] = useState('');

  const [headpic, setHeadpic] = useState(null);
  const [certificate, setCertificate] = useState(null);

  const [pagination, setPagination] = useState({ current: 1, pageSize: 100, total: 0 });

  //只在初始化时需要出发，所以第二个参数为空
  useEffect(() => {
    getList(pagination.current, pagination.pageSize, 'descend');
  }, [])

  const columns = [
    {
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickname',
      width: '180px',
      render: (text, record) => <span>{text} {(record.openId && record.openId.length > 32) ? <span style={{ color: 'red' }}>(自)</span> : <></>}</span>,
    },
    {
      title: '个人照',
      key: 'headpic',
      dataIndex: 'headpic',
      width: '100px',
      render: headpic => (
        <>
          <img src={ headpic && headpic.substring(0, 4) == 'http' ? headpic : `${Constants.ResourceUrl}${headpic}`} alt="" className="doctorHeadPic" />
        </>
      ),
    },
    {
      title: '用户类型',
      dataIndex: 'usertype',
      width: '100px',
      key: 'usertype',
    },
    {
      title: '简介',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: '最后访问时间',
      dataIndex: 'lastVisitedAt',
      key: 'lastVisitedAt',
      width: '120px',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.lastVisitedAt - b.lastVisitedAt,
      render: text => (
        <>
          {text}
        </>
      ),
    },
    {
      title: '前一周访问量',
      dataIndex: 'visitCountLastWeek',
      key: 'visitCountLastWeek',
      width: '120px'
    },
    {
      title: '市',
      dataIndex: 'city',
      key: 'city',
      width: '100px',
    },
    {
      title: '操作',
      key: 'action',
      width: '150px',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={(e) => {
            showEditUser(record);
          }}>修改</a>
          <a onClick={(e) => {
            getQRCode(record.openId);
          }}>二维码</a>
          {/* <Popconfirm title="确定删除?" onConfirm={() => {
            DeleteUser(record.openId);
          }}>
            <a href="javascript:;">删除</a>
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  const getQRCode=(openId) => {
    axios(`${Constants.APIBaseUrl}/user/mini/qrcode?openId=${openId}`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      setShowQR(true);
      setQRCode(res.data.Data);
    })
  }

  const getList = (pageIndex, pageSize, order) => {
    if(!pageIndex)
    {
      pageIndex = pagination.current;
    }
    if(!pageSize)
    {
      pageSize = pagination.pageSize;
    }

    if(!order)
    {
      order='';
    }

    axios(`${Constants.APIBaseUrl}/user/admin/list/user?pageIndex=${pageIndex}&pageSize=${pageSize}&order=${order}`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      pagination.total = res.data.count;

      let tempUsers = res.data.list.map(user => {
        return { ...user, key: user.openId }
      })
      setUsers(tempUsers);
    })
  }

  const onPaginationChange = (pageIndex, pageSize) => {
    pagination.current = pageIndex;
    pagination.pageSize = pageSize;
    setPagination(pagination);
    getList(pageIndex, pageSize);
  }

  const onShowSizeChange = (pageIndex, pageSize) => {
    pagination.current = pageIndex;
    pagination.pageSize = pageSize;
    setPagination(pagination);
    getList(pageIndex, pageSize);
  }
  
  const onTableChange = (pagination, filters, sorter) => {
    pagination.current = pagination.current;
    pagination.pageSize = pagination.pageSize;
    setPagination(pagination);
    getList(pagination.current, pagination.pageSize, sorter.order);
  };

  const showAddForm = () => {
    setShowAdd(true);
  }

  const handleCancel = () => {
    setShowAdd(false);
  }

  const handleOk = () => {
    var values = addFormRef.current.getFieldsValue();
    if (!values.openId) {
      addUser(values);
    }
    else {
      UpdateUser(values);
    }
  }

  const addUser = (user) => {
    user.headpic = headpic;
    user.certificate = certificate;
    axios.post(`${Constants.APIBaseUrl}/user/add`, user, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        ClearForm();
        setShowAdd(false);
        getList();
      })
      .catch((error) => {
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

  //添加后清空表单值
  const ClearForm = () => {
    setHeadpic('');
    setCertificate('');
    addFormRef.current.resetFields();
  }

  const showEditUser = (user) => {
    setShowAdd(true);

    setHeadpic(user.headpic);
    setCertificate(user.certificate);

    //必须有个延迟，等Form弹出来，否则addFormRef为空
    window.setTimeout(() => {
      setHeadpic(user.headpic);
      setCertificate(user.certificate);
      addFormRef.current.setFieldsValue({
        openId: user.openId,
        nickname: user.nickName,
        province: user.province,
        city: user.city,
        sex: user.sex,
        headpic: user.headpic,
        certificate: user.certificate,
        expertise: user.expertise,
        usertype: user.usertype,
        note: user.note
      });
    }, 200)
  }

  const UpdateUser = () => {
    var values = addFormRef.current.getFieldsValue();

    values.headpic = headpic;
    values.certificate = certificate;
    axios.post(`${Constants.APIBaseUrl}/user/update`, values, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        ClearForm();
        setShowAdd(false);
        getList();
      })
      .catch((error) => {
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

  const handleAfterUploadCert = (cert) => {
    setCertificate(cert);
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

  const displayInApp = (openId) => {
    axios(`${Constants.APIBaseUrl}/user/display?openId=${openId}`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      getList();
    })
  }

  const hideFromApp = (openId) => {
    axios(`${Constants.APIBaseUrl}/user/hide?openId=${openId}`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      getList();
    })
  }

  return (
    <React.Fragment>
      <Row type="flex" justify='center' style={{ marginTop: '10px', marginBottom: '5px' }}>
        <Col span={6}>
          <Select style={{ width: '60%' }} onChange={(value) => {
            setUserOpenId(value);
          }}>
            {
              users.map(u => (
                <Option key={u.id} value={u.openId}>{u.nickName}</Option>
              ))
            }
          </Select>
          <Button type="primary" onClick={() => {
            window.open(`http://app.kangfupanda.com/#/home?openId=${userOpenId}`)
          }}>模拟登录</Button>
        </Col>
        <Col span={3}>
          
        </Col>
        <Col span={3}>
          <Button type="primary" onClick={showAddForm}>添加</Button>
        </Col>
      </Row>

      <Table columns={columns} dataSource={users}  onChange={onTableChange} showSorterTooltip={false}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          //有了Table->onTableChange，就不需要这两个了
          // onChange: onPaginationChange,
          // onShowSizeChange: onShowSizeChange,
          showTotal: ((total) => {
            return `共 ${total} 条`;
          }),
        }}
      />
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
        onCancel={() => {
          ClearForm();
          setShowAdd(false);
        }}
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
                <Input readOnly={true} />
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
              <Form.Item label="特长" name="expertise">
                <Select defaultValue="">
                  <Select.Option value="医学护肤">医学护肤</Select.Option>
                  <Select.Option value="医学减重">医学减重</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="用户类型" name="usertype">
                <Select defaultValue="">
                  <Select.Option value="普通用户">普通用户</Select.Option>
                  <Select.Option value="专家-医学护肤">专家-医学护肤</Select.Option>
                  <Select.Option value="专家-运动康复">专家-运动康复</Select.Option>
                  <Select.Option value="专家-营养">专家-营养</Select.Option>
                  <Select.Option value="专家-产后康复">专家-产后康复</Select.Option>
                  <Select.Option value="专家-儿童康复">专家-儿童康复</Select.Option>
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
                <ImageUploader afterUpload={handleAfterUploadImage} defaultImage={headpic && headpic.startsWith('http') ? headpic : `${Constants.ResourceUrl}${headpic}`}></ImageUploader>
              </Form.Item>
              {/* <Form.Item
                name="certificate"
                label="资质证书"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <ImageUploader uploadUrl="/video/UploadDoctorCert" afterUpload={handleAfterUploadCert} defaultImage={certificate ? `${Constants.ResourceUrl}${certificate}` : null}></ImageUploader>
              </Form.Item> */}
            </Form>

          </Col>
        </Row>
      </Modal>
      <Modal maskClosable={true} visible={showQR}
        footer={[
          <Button key="back" onClick={() => {
            setShowQR(false);
            setQRCode(null);
          }}>
            关闭
            </Button>
        ]}
        // onOk={this.handleOk.bind(this)}
        onCancel={() => {
          setShowQR(false);
          setQRCode(null);
        }}>
          {
            qrCode?
            <img src={`data:image/jpeg;base64,${qrCode}`} />: <></>
          }
          
      </Modal>
    </React.Fragment>
  )
}

export default withRouter(UserList)