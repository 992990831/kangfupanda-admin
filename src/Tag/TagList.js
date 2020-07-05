import React, { Component, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Table, Form, Popconfirm, Modal, message, Tag, Space, Select, Input, notification } from 'antd';
import axios from 'axios';
import { Constants } from '../Utils/Constants';
import ImageUploader from '../Utils/ImageUploader';

import './TagList.css';

const { TextArea } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export function TagList() {
    const columns = [
        {
            title: '标签名',
            dataIndex: 'text',
            key: 'text',
            render: text => <a>{text}</a>,
        },
        {
            title: '操作',
            key: 'action',
            width:'150px',
            render: (text, record) => (
                <Space size="middle">
                     <a onClick={(e) => {
                        showEditTag(record);
                    }}>修改</a>
                    <Popconfirm title="确定删除?" onConfirm={() => {
                        DeleteTag(record.id);
                    }}>
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const addFormRef = useRef();
    const [pagination, setPagination] = useState({current:1, pageSize:10, total:0});
    const [tags, setTags] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    //搜索用的文本内容
    const [text, setText] = useState('');

    //只在初始化时需要出发，所以第二个参数为空
    useEffect(() => {
        getList(pagination.current, pagination.pageSize);
    }, [])

    const getList = () => {
        axios(`${Constants.APIBaseUrl}/tag/list?pageIndex=${pagination.current}&pageSize=${pagination.pageSize}&text=${text}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            pagination.total = res.data.count;
            let tags = res.data.list.map(tag => {
                return { ...tag, key: tag.id }
            })
            setTags(tags);
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
            addTag(values);
        }
        else {
            UpdateTag(values);
        }
    }

    const addTag = (tag) => {
     
        axios.post(`${Constants.APIBaseUrl}/tag/add`, tag, {
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
                    '保存标签失败',
                onClick: () => {
                    //console.log('Notification Clicked!');
                },
                duration: 2
            });
        });
    }


    //添加后清空表单值
    const ClearForm = () => {
        addFormRef.current.resetFields();
    }


      const DeleteTag = (id) =>
      {
        axios.delete(`${Constants.APIBaseUrl}/tag/delete?id=${id}`, {
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => {
            getList();
          })
          .catch(function (error) {
            notification.open({
              message: '删除失败',
              description:
                '删除标签失败',
              onClick: () => {
                //console.log('Notification Clicked!');
              },
              duration: 3
            });
          });
      }

      const showEditTag = (tag) =>
      {
          setShowAdd(true);
          //必须有个延迟，等Form弹出来，否则addFormRef为空
          window.setTimeout(()=>{
            addFormRef.current.setFieldsValue({
              id: tag.id,
              text: tag.text,
            });
          }, 200)

      }

      const UpdateTag = () =>
      {
        var values = addFormRef.current.getFieldsValue();

        axios.post(`${Constants.APIBaseUrl}/tag/update`, values, {
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
                '更新标签失败',
              onClick: () => {
                //console.log('Notification Clicked!');
              },
              duration: 3
            });
          });
      }


    const onPaginationChange = (pageIndex, pageSize) => {
        pagination.current = pageIndex;
        pagination.pageSize = pageSize;
        setPagination(pagination);
        getList(pageIndex, pageSize);
    }    

    return (
        <React.Fragment>
            <Row type="flex" justify='center' style={{marginTop:'10px', marginBottom:'5px'}}>
                <Col span={6}>
                    <Input placeholder='请输入标签名' onChange={(input)=>{
                        setText(input.target.value);
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
            <Table columns={columns} dataSource={tags} 
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: onPaginationChange,
            }}
            />
            <Modal
                title='添加标签'
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
                                name="text"
                                label="标签名"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Form>

                    </Col>
                </Row>
            </Modal>
        </React.Fragment>
    )
}