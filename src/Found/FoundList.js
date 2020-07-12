import React, { Component, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Table, Form, Popconfirm, Modal, message, Tag, Space, Select, Input, notification } from 'antd';
import axios from 'axios';
import { Constants } from '../Utils/Constants';
import ImageUploader from '../Utils/ImageUploader';

import './FoundList.css';

const { TextArea } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export function FoundList() {
    const columns = [
        // {
        //   title: 'id',
        //   dataIndex: 'openId',
        //   key: 'openId',
        // render: text => <span style={{width:'10px'}}>{text}</span>,
        // },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width:'150px',
            render: text => <a>{text}</a>,
        },
        {
            title: '个人照',
            key: 'headpic',
            dataIndex: 'headpic',
            width:'150px',
            render: headpic => (
                <>
                    <img src={headpic.substring(0, 4) == 'http' ? headpic : `${Constants.ResourceUrl}${headpic}`} alt="" className="doctorHeadPic" />
                </>
            ),
        },
        // {
        //   title: '用户类型',
        //   dataIndex: 'usertype',
        //   key: 'usertype',
        // },
        // {
        //   title: 'App中显示',
        //   key: 'displayinapp',
        //   dataIndex: 'displayinapp',
        //   render: (text, record) => (
        //     <Space size="middle">
        //       {
        //         !record.displayinapp? 
        //         <a onClick={(e) => {
        //           displayInApp(record.openId);
        //         }}>不显示</a>:
        //         <a onClick={(e) => {
        //           hideFromApp(record.openId);
        //         }}>显示</a>
        //       }
        //     </Space>
        //   ),
        // },
        {
            title: '简介',
            dataIndex: 'note',
            key: 'note',
            style:{width:'auto'},
            render: (text, record) => (
                <span style={{whiteSpace:'pre-wrap'}}>
                    {record.note}
                </span>
            )
        },
        // {
        //   title: '省',
        //   dataIndex: 'province',
        //   key: 'province',
        // },
        // {
        //     title: '城市',
        //     dataIndex: 'city',
        //     key: 'city',
        // },
        {
            title: '操作',
            key: 'action',
            width:'150px',
            render: (text, record) => (
                <Space size="middle">
                     <a onClick={(e) => {
                        showEditFound(record);
                    }}>修改</a>
                    <Popconfirm title="确定删除?" onConfirm={() => {
                        DeleteFund(record.id);
                    }}>
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const addFormRef = useRef();
    //pagination参见： https://ant.design/components/pagination-cn/
    const [pagination, setPagination] = useState({current:1, pageSize:100, total:0});
    const [founds, setFounds] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [headpic, setHeadpic] = useState(null);
    const [detailimage, setDetailImage] = useState(null);
    const [name, setName] = useState('');

    //只在初始化时需要出发，所以第二个参数为空
    useEffect(() => {
        getList(pagination.current, pagination.pageSize);
    }, [])

    const getList = () => {
        axios(`${Constants.APIBaseUrl}/found/list?pageIndex=${pagination.current}&pageSize=${pagination.pageSize}&name=${name}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            pagination.total = res.data.count;
            let founds = res.data.list.map(found => {
                return { ...found, key: found.id }
            })
            setFounds(founds);
        })
    }

    const showAddForm = () => {
        setShowAdd(true);
    }

    const handleCancel = () => {
        ClearForm();
        setShowAdd(false);
    }

    const handleOk = () => {
        var values = addFormRef.current.getFieldsValue();
        if (!values.id) {
            addFound(values);
        }
        else {
            UpdateFound(values);
        }
    }

    const addFound = (found) => {
        found.headpic = headpic;
        found.detailimage = detailimage;
        axios.post(`${Constants.APIBaseUrl}/found/add`, found, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            ClearForm();
            setShowAdd(false);
            getList(pagination.current, pagination.pageSize);
        }).catch((error) => {
            console.log(error);
            setShowAdd(false);
            notification.open({
                message: '保存失败',
                description:
                    '保存专家信息失败',
                onClick: () => {
                    //console.log('Notification Clicked!');
                },
                duration: 2
            });
        });
    }


    //添加后清空表单值
    const ClearForm = () => {
        setHeadpic('');
        setDetailImage('');
        addFormRef.current.resetFields();
    }


      const DeleteFund = (id) =>
      {
        axios.delete(`${Constants.APIBaseUrl}/found/delete?id=${id}`, {
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => {
            getList();
          })
          .catch(function (error) {
            notification.open({
              message: '删除失败',
              description:
                '删除专家信息失败',
              onClick: () => {
                //console.log('Notification Clicked!');
              },
              duration: 3
            });
          });
      }

      const showEditFound = (found) =>
      {
          setShowAdd(true);

          setHeadpic(found.headpic);
          setDetailImage(found.detailimage);

          //必须有个延迟，等Form弹出来，否则addFormRef为空
          window.setTimeout(()=>{
            setHeadpic(found.headpic);
            setDetailImage(found.detailimage);
            addFormRef.current.setFieldsValue({
              id: found.id,
              name: found.name,
              headpic: found.headpic,
              detailimage: found.detailimage,
              note: found.note
            });
          }, 200)

      }

      const UpdateFound = () =>
      {
        var values = addFormRef.current.getFieldsValue();

        values.headpic = headpic;
        values.detailimage = detailimage;
        axios.post(`${Constants.APIBaseUrl}/found/update`, values, {
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
              message: '更新失败',
              description:
                '更新专家信息失败',
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

    const handleAfterUploadDetailImage = (detailimage) => {
        setDetailImage(detailimage);
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
    return (
        <React.Fragment>
            <Row type="flex" justify='center' style={{marginTop:'10px', marginBottom:'5px'}}>
                <Col span={6}>
                   
                    <Input placeholder='请输入姓名' onChange={(input)=>{
                        setName(input.target.value);
                    }}></Input>
                </Col>
                <Col span={3}>
                    <Button type="primary" onClick={()=>{
                        getList();
                    }}>搜索</Button>
                </Col>
                <Col span={3}>
                    <Button type="primary" onClick={showAddForm}>添加</Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={founds} 
            pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: onPaginationChange,
                onShowSizeChange: onShowSizeChange,
                showTotal: ((total) => {
                    return `共 ${total} 条`;
                  }),
            }}
            />
            <Modal
                title='添加专家'
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
                                name="id"
                                label="Id"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input readOnly={true} />
                            </Form.Item>
                            <Form.Item
                                name="name"
                                label="姓名"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            {/* <Form.Item
                                name="city"
                                label="市"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item> */}
                            <Form.Item
                                name="note"
                                label="简介"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <TextArea rows={5} />
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
                                <ImageUploader afterUpload={handleAfterUploadImage} defaultImage={headpic && headpic.startsWith('http') ? headpic : headpic ? `${Constants.ResourceUrl}${headpic}` : null}></ImageUploader>
                            </Form.Item>
                            <Form.Item
                                name="detailimage"
                                label="详情照"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <ImageUploader afterUpload={handleAfterUploadDetailImage} defaultImage={detailimage ? `${Constants.ResourceUrl}${detailimage}` : null}></ImageUploader>
                            </Form.Item>
                        </Form>

                    </Col>
                </Row>
            </Modal>
        </React.Fragment>
    )
}