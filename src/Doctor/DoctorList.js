import React, { Component, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Table, Form, Popconfirm, Modal, message, Tag, Space, Select, Input,notification } from 'antd';
import axios from 'axios';
import { Constants } from '../Utils/Constants';
import ImageUploader from '../Utils/ImageUploader';
import VideoUploader from '../Utils/VideoUploader';

import ImageCropper from '../Utils/ImageCropper';

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

function DoctorList() {
  const addFormRef = useRef();
  const [users, setUsers] = useState([]);
  //模拟登录用
  const [userOpenId, setUserOpenId] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQRCode] = useState('');

  const [headpic, setHeadpic] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [certificate1, setCertificate1] = useState(null);
  const [certificate2, setCertificate2] = useState(null);
  const [certificate3, setCertificate3] = useState(null);
  const [certificate4, setCertificate4] = useState(null);
  const [certificate5, setCertificate5] = useState(null);
  const [certificate6, setCertificate6] = useState(null);
  const [certificate7, setCertificate7] = useState(null);

  const [certtext, setCertText] = useState(null);
  const [cert1text, setCert1Text] = useState(null);
  const [cert2text, setCert2Text] = useState(null);
  const [cert3text, setCert3Text] = useState(null);
  const [cert4text, setCert4Text] = useState(null);
  const [cert5text, setCert5Text] = useState(null);
  const [cert6text, setCert6Text] = useState(null);
  const [cert7text, setCert7Text] = useState(null);

  const [profilevideo, setProfilevideo] = useState(null);
  const [profilevideoposter, setProfilevideoPoster] = useState(null);

  // const [sortedInfo, setSortedInfo] = useState({
  //   order: 'descend',
  //   columnKey: 'lastVisitedAt',
  // });

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
      width:'180px',
    render: (text, record) => <span>{text} {(record.openId && record.openId.length>32) ? <span style={{color: 'red'}}>(自)</span>:<></>}</span>,
    },
    {
      title: '个人照',
      key: 'headpic',
      dataIndex: 'headpic',
      width:'100px',
      render: headpic => (
        <>
          <img src={headpic && headpic.substring(0,4)=='http'?  headpic : `${Constants.ResourceUrl}${headpic}`} alt="" className="doctorHeadPic" />
        </>
      ),
    },
    {
      title: '用户类型',
      dataIndex: 'usertype',
      width:'100px',
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
      //sortOrder: sortedInfo.columnKey === 'lastVisitedAt' && sortedInfo.order,
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
      width:'100px',
    },
    {
      title: '操作',
      key: 'action',
      width:'150px',
      render: (text, record) => (
        <Space size="middle" style={{display:'block'}}>
          <div>
            {
              !record.verified? 
              <a onClick={(e) => {
                verifyUser(record.openId);
              }}>认证</a>:
              <a onClick={(e) => {
                unverifyUser(record.openId);
              }}>取消认证</a>
            }
            <a style={{marginLeft:'5px'}} onClick={(e) => {
              showEditUser(record);
            }}>修改</a>
          </div>
          <div>
            <a onClick={(e) => {
              getQRCode(record.openId);
            }}>二维码</a>
          </div>
          
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

    axios(`${Constants.APIBaseUrl}/user/admin/list/doctor?pageIndex=${pageIndex}&pageSize=${pageSize}&order=${order}`, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      pagination.total = res.data.count;
      let tempUsers = res.data.list.map(user => {
        return {...user, key: user.openId}
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
    if(!values.openId){
      addUser(values);
    }
    else{
      UpdateUser(values);
    }
  }

  const addUser = (user) =>{
    user.headpic = headpic;
    user.certificate = certificate;
    user.certificate1 = certificate1;
    user.certificate2 = certificate2;
    user.certificate3 = certificate3;
    user.certificate4 = certificate4;
    user.certificate5 = certificate5;
    user.certificate6 = certificate6;
    user.certificate7 = certificate7;

    user.certtext = certtext;
    user.cert1text = cert1text;
    user.cert2text = cert2text;
    user.cert3text = cert3text;
    user.cert4text = cert4text;
    user.cert5text = cert5text;
    user.cert6text = cert6text;
    user.cert7text = cert7text;
    user.profilevideo = profilevideo;
    user.profilevideoposter = profilevideoposter;

    axios.post(`${Constants.APIBaseUrl}/user/add`, user, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        ClearForm();
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

  //添加后清空表单值
  const ClearForm = () => {
    setHeadpic('');
    setCertificate('');
    setCertificate1('');
    setCertificate2('');
    setCertificate3('');
    setCertificate4('');
    setCertificate5('');
    setCertificate6('');
    setCertificate7('');

    setCertText('');
    setCert1Text('');
    setCert2Text('');
    setCert3Text('');
    setCert4Text('');
    setCert5Text('');
    setCert6Text('');
    setCert7Text('');
    setProfilevideo('');
    setProfilevideoPoster('');

    addFormRef.current.resetFields();
  }

  // const DeleteUser = (openId) =>
  // {
  //   axios.delete(`${Constants.APIBaseUrl}/user/delete?openId=${openId}`, {
  //     headers: { 'Content-Type': 'application/json' }
  //   })
  //     .then(res => {
  //       getList();
  //     })
  //     .catch(function (error) {
  //       notification.open({
  //         message: '删除失败',
  //         description:
  //           '删除用户信息失败',
  //         onClick: () => {
  //           //console.log('Notification Clicked!');
  //         },
  //         duration: 3
  //       });
  //     });
  // }

  const showEditUser = (user) =>
  {
      setShowAdd(true);

      //必须有个延迟，等Form弹出来，否则addFormRef为空
      window.setTimeout(()=>{
        setHeadpic(user.headpic);
        setCertificate(user.certificate);
        setCertificate1(user.certificate1);
        setCertificate2(user.certificate2);
        setCertificate3(user.certificate3);
        setCertificate4(user.certificate4);
        setCertificate5(user.certificate5);
        setCertificate6(user.certificate6);
        setCertificate7(user.certificate7);
        
        setCertText(user.certText);
        setCert1Text(user.cert1Text);
        setCert2Text(user.cert2Text);
        setCert3Text(user.cert3Text);
        setCert4Text(user.cert4Text);
        setCert5Text(user.cert5Text);
        setCert6Text(user.cert6Text);
        setCert7Text(user.cert7Text);

        setProfilevideo(user.profilevideo);
        setProfilevideoPoster(user.profilevideoposter);

        addFormRef.current.setFieldsValue({
          openId: user.openId,
          nickname: user.nickName,
          province: user.province,
          city: user.city,
          sex: user.sex,
          headpic: user.headpic,
          certificate: user.certificate,
          certtext: user.certText,
          certificate1: user.certificate1,
          cert1text: user.cert1Text,
          certificate2: user.certificate2,
          cert2text: user.cert2Text,
          certificate3: user.certificate3,
          cert3text: user.cert3Text,
          certificate4: user.certificate4,
          cert4text: user.cert4Text,
          certificate5: user.certificate5,
          cert5text: user.cert5Text,
          certificate6: user.certificate6,
          cert6text: user.cert6Text,
          certificate7: user.certificate7,
          cert7text: user.cert7Text,

          profilevideo: user.profilevideo,
          profilevideoposter: user.profilevideoposter,

          expertise: user.expertise,
          usertype: user.usertype,
          note: user.note
        });
      }, 200)      
  }

  const UpdateUser = () =>
  {
    var values = addFormRef.current.getFieldsValue();

    values.headpic = headpic;
    values.certificate = certificate;
    values.certificate1 = certificate1;
    values.certificate2 = certificate2;
    values.certificate3 = certificate3;
    values.certificate4 = certificate4;
    values.certificate5 = certificate5;
    values.certificate6 = certificate6;
    values.certificate7 = certificate7;

    values.certtext = certtext;
    values.cert1text = cert1text;
    values.cert2text = cert2text;
    values.cert3text = cert3text;
    values.cert4text = cert4text;
    values.cert5text = cert5text;
    values.cert6text = cert6text;
    values.cert7text = cert7text;

    values.profilevideo = profilevideo;
    values.profilevideoposter = profilevideoposter;

    axios.post(`${Constants.APIBaseUrl}/user/update`, values, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        ClearForm();
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

  const handleAfterUploadCertificate = (certificate) => {
    setCertificate(certificate);
  }

  const handleAfterUploadCertificate1 = (certificate) => {
    setCertificate1(certificate);
  }

  const handleAfterUploadCertificate2 = (certificate) => {
    setCertificate2(certificate);
  }

  const handleAfterUploadCertificate3 = (certificate) => {
    setCertificate3(certificate);
  }

  const handleAfterUploadCertificate4 = (certificate) => {
    setCertificate4(certificate);
  }

  const handleAfterUploadCertificate5 = (certificate) => {
    setCertificate5(certificate);
  }

  const handleAfterUploadCertificate6 = (certificate) => {
    setCertificate6(certificate);
  }

  const handleAfterUploadCertificate7 = (certificate) => {
    setCertificate7(certificate);
  }

  const onCertTextChange = (obj) => {
    setCertText(obj.target.value);
  }

  const onCert1TextChange = (obj) => {
    setCert1Text(obj.target.value);
  }

  const onCert2TextChange = (obj) => {
    setCert2Text(obj.target.value);
  }

  const onCert3TextChange = (obj) => {
    setCert3Text(obj.target.value);
  }

  const onCert4TextChange = (obj) => {
    setCert4Text(obj.target.value);
  }

  const onCert5TextChange = (obj) => {
    setCert5Text(obj.target.value);
  }

  const onCert6TextChange = (obj) => {
    setCert6Text(obj.target.value);
  }

  const onCert7TextChange = (obj) => {
    setCert7Text(obj.target.value);
  }

  const handleAfterUploadProfilevideo = (video) => {
    setProfilevideo(video);
  }

  const handleAfterUploadProfilevideoPoster = (poster) => {
    setProfilevideoPoster(poster);
  }

  const clearCert = ()=>
  {
    setCertificate(null);
    setCertText(null);
  }

  const clearCert1 = ()=>
  {
    setCertificate1(null);
    setCert1Text(null);
  }

  const clearCert2 = ()=>
  {
    setCertificate2(null);
    setCert2Text(null);
  }

  const clearCert3 = ()=>
  {
    setCertificate3(null);
    setCert3Text(null);
  }

  const clearCert4 = ()=>
  {
    setCertificate4(null);
    setCert4Text(null);
  }

  const clearCert5 = ()=>
  {
    setCertificate5(null);
    setCert5Text(null);
  }

  const clearCert6 = ()=>
  {
    setCertificate6(null);
    setCert6Text(null);
  }

  const clearCert7 = ()=>
  {
    setCertificate7(null);
    setCert7Text(null);
  }

  const clearProfilevideo = ()=>
  {
    setProfilevideoPoster(null);
    setProfilevideo(null);
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

      {/* <Row type="flex" justify='end'>
        <Col>
          <Button type="primary" onClick={showAddForm}>添加</Button>
        </Col>
      </Row> */}
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
          onCancel={()=>{
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
                  <ImageCropper onCrop={(imgBase64)=>{
                                    setHeadpic(imgBase64);
                                }}
                                defaultImage={headpic && headpic.substring(0, 4) == 'http'? headpic: `${Constants.ResourceUrl}${headpic}`}
                               aspect={1}  ></ImageCropper>
                  {/* <ImageUploader afterUpload={handleAfterUploadImage} defaultImage={headpic && headpic.startsWith('http')? headpic: `${Constants.ResourceUrl}${headpic}`}></ImageUploader> */}
                </Form.Item>
                <Form.Item
                  name="certificate"
                  label="资质证书1"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <input onChange={onCertTextChange} defaultValue={certtext} style={{width:'100%'}} />
                  <ImageUploader uploadUrl="/video/UploadDoctorCert" afterUpload={handleAfterUploadCertificate} defaultImage={certificate? `${Constants.ResourceCertUrl}${certificate}` : null}></ImageUploader>
                  <a href="javascript:void(0)" onClick={clearCert}>清除</a>
                </Form.Item>
                <Form.Item
                  name="certificate1"
                  label="资质证书2"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <input onChange={onCert1TextChange} defaultValue={cert1text} style={{width:'100%'}} />
                  <ImageUploader uploadUrl="/video/UploadDoctorCert" afterUpload={handleAfterUploadCertificate1} defaultImage={certificate1? `${Constants.ResourceCertUrl}${certificate1}` : null}></ImageUploader>
                  <a href="javascript:void(0)" onClick={clearCert1}>清除</a>
                </Form.Item>
                <Form.Item
                  name="certificate2"
                  label="资质证书3"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <input onChange={onCert2TextChange} defaultValue={cert2text} style={{width:'100%'}} />
                  <ImageUploader uploadUrl="/video/UploadDoctorCert" afterUpload={handleAfterUploadCertificate2} defaultImage={certificate2? `${Constants.ResourceCertUrl}${certificate2}` : null}></ImageUploader>
                  <a href="javascript:void(0)" onClick={clearCert2}>清除</a>
                </Form.Item>
                <Form.Item
                  name="certificate3"
                  label="资质证书4"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <input onChange={onCert3TextChange} defaultValue={cert3text} style={{width:'100%'}} />
                  <ImageUploader uploadUrl="/video/UploadDoctorCert" afterUpload={handleAfterUploadCertificate3} defaultImage={certificate3? `${Constants.ResourceCertUrl}${certificate3}` : null}></ImageUploader>
                  <a href="javascript:void(0)" onClick={clearCert3}>清除</a>
                </Form.Item>
                <Form.Item
                  name="certificate4"
                  label="资质证书5"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <input onChange={onCert4TextChange} defaultValue={cert4text} style={{width:'100%'}} />
                  <ImageUploader uploadUrl="/video/UploadDoctorCert" afterUpload={handleAfterUploadCertificate4} defaultImage={certificate4? `${Constants.ResourceCertUrl}${certificate4}` : null}></ImageUploader>
                  <a href="javascript:void(0)" onClick={clearCert4}>清除</a>
                </Form.Item>
                <Form.Item
                  name="certificate5"
                  label="资质证书6"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <input onChange={onCert5TextChange} defaultValue={cert5text} style={{width:'100%'}} />
                  <ImageUploader uploadUrl="/video/UploadDoctorCert" afterUpload={handleAfterUploadCertificate5} defaultImage={certificate5? `${Constants.ResourceCertUrl}${certificate5}` : null}></ImageUploader>
                  <a href="javascript:void(0)" onClick={clearCert5}>清除</a>
                </Form.Item>
                <Form.Item
                  name="certificate6"
                  label="资质证书7"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <input onChange={onCert6TextChange} defaultValue={cert6text} style={{width:'100%'}} />
                  <ImageUploader uploadUrl="/video/UploadDoctorCert" afterUpload={handleAfterUploadCertificate6} defaultImage={certificate6? `${Constants.ResourceCertUrl}${certificate6}` : null}></ImageUploader>
                  <a href="javascript:void(0)" onClick={clearCert6}>清除</a>
                </Form.Item>
                <Form.Item
                  name="certificate7"
                  label="资质证书8"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <input onChange={onCert7TextChange} defaultValue={cert7text} style={{width:'100%'}} />
                  <ImageUploader uploadUrl="/video/UploadDoctorCert" afterUpload={handleAfterUploadCertificate7} defaultImage={certificate7? `${Constants.ResourceCertUrl}${certificate7}` : null}></ImageUploader>
                  <a href="javascript:void(0)" onClick={clearCert7}>清除</a>
                </Form.Item>


                <Form.Item
                  name="profilevideo"
                  label="介绍录像"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <VideoUploader uploadUrl="/video/UploadProfilevideo" afterUpload={handleAfterUploadProfilevideo} ></VideoUploader>
                </Form.Item>
                <Form.Item
                  name="profilevideoposter"
                  label="录像封面"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <ImageUploader uploadUrl="/video/UploadProfilevideo" afterUpload={handleAfterUploadProfilevideoPoster} defaultImage={profilevideoposter? `${Constants.ResourceProfileVideoUrl}${profilevideoposter}` : null}></ImageUploader>
                  <a href="javascript:void(0)" onClick={clearProfilevideo}>清除</a>
                </Form.Item>
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

export default withRouter(DoctorList)