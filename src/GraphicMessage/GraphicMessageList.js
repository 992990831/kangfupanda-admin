import React, {  useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom'
import { Row, Col, Button, Table, Form, List, Divider, Modal, message, Tag, Space, Select, Input, notification, Popconfirm } from 'antd';
import './GraphicMessage.css';

import ImageUploader from '../Utils/ImageUploader';
import { Constants } from '../Utils/Constants';

import axios from 'axios';

const { TextArea } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

function GraphicMessageList() {
    const columns = [
        // {
        //   title: 'id',
        //   dataIndex: 'openId',
        //   key: 'openId',
        // render: text => <span style={{width:'10px'}}>{text}</span>,
        // },
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author',
            render: text => <a>{text}</a>,
        },
        {
            title: '文字',
            key: 'text',
            dataIndex: 'text',
            render: text => {
                let subText = text.length > 50 ? text.substring(0, 50) : text;
                return <span>{subText}</span>
            }
        },
        {
            title: '图片1',
            dataIndex: 'pic01',
            key: 'pic01',
            render: pic01 => (
                <>
                    <img src={`${Constants.ResourceUrl}/${pic01}`} alt="" className="graphicMessagePic" />
                </>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={(e) => {
                        //showEditUser(record);
                    }}>修改</a>
                    <Popconfirm title="确定删除?" onConfirm={() => {
                        DeleteGraphicMessage(record.id);
                    }}>
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const addFormRef = useRef();
    const [messages, setMessages] = useState([]);
    const [pics, setPics] = useState(['','','','','','',]);
    const [showAdd, setShowAdd] = useState(false);

    //只在初始化时需要出发，所以第二个参数为空
    useEffect(() => {
        getList();
    }, [])

    const getList = () => {
        axios(`${Constants.APIBaseUrl}/message/list`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            setMessages(res.data);
        })
    }

    const showAddForm = () => {
        setShowAdd(true);
    }

    const handleCancel = () => {
        setShowAdd(false);
    }

    const handleOk = () => {
        debugger;
        var values = addFormRef.current.getFieldsValue();

        addGraphicMessage(values);
        // var values = addFormRef.current.getFieldsValue();
        // debugger;
        // if(!values.openId){
        //   addUser(values);
        // }
        // else{
        //   UpdateUser(values);
        // }
    }

    const addGraphicMessage = (values) =>{
        let body = {
            author: values.author,
            text: values.text,
            pic01: pics[0],
            pic02: pics[1],
            pic03: pics[2],
            pic04: pics[3],
            pic05: pics[4],
            pic06: pics[5],
        }

        axios.post(`${Constants.APIBaseUrl}/message/add`, body, {
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
                  '保存图文失败',
                onClick: () => {
                  //console.log('Notification Clicked!');
                },
                duration: 3
              });
            });
    }

    const DeleteGraphicMessage = (id) =>
  {
    axios.delete(`${Constants.APIBaseUrl}/message/delete?id=${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        getList();
      })
      .catch(function (error) {
        notification.open({
          message: '删除失败',
          description:
            '删除用图文失败',
          onClick: () => {
            //console.log('Notification Clicked!');
          },
          duration: 3
        });
      });
  }

    const handleAfterUploadImage01 = (pic) => {
        pics[0] = pic;
        setPics(pics);
    }
    const handleAfterUploadImage02 = (pic) => {
        pics[1] = pic;
        setPics(pics);
    }
    const handleAfterUploadImage03 = (pic) => {
        pics[2] = pic;
        setPics(pics);
    }
    const handleAfterUploadImage04 = (pic) => {
        pics[3] = pic;
        setPics(pics);
    }
    const handleAfterUploadImage05 = (pic) => {
        pics[4] = pic;
        setPics(pics);
    }
    const handleAfterUploadImage06 = (pic) => {
        pics[5] = pic;
        setPics(pics);
    }

    return (
        <React.Fragment>
            <Row type="flex" justify='end'>
                <Col>
                    <Button type="primary" onClick={showAddForm}>添加</Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={messages} />
            <Modal
                title='添加图文'
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
                                name="author"
                                label="作者"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="text"
                                label="文字"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <TextArea rows={2} />
                            </Form.Item>
                            <Form.Item
                                name="headpic"
                                label="图片"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                    <List>
                                        <List.Item>
                                            <ImageUploader afterUpload={handleAfterUploadImage01}></ImageUploader>
                                            <ImageUploader afterUpload={handleAfterUploadImage02}></ImageUploader>
                                            <ImageUploader afterUpload={handleAfterUploadImage03}></ImageUploader>
                                        </List.Item>
                                        <List.Item>
                                            <ImageUploader afterUpload={handleAfterUploadImage04}></ImageUploader>
                                            <ImageUploader afterUpload={handleAfterUploadImage05}></ImageUploader>
                                            <ImageUploader afterUpload={handleAfterUploadImage06}></ImageUploader>
                                        </List.Item>
                                    </List>
                                
                                
                            </Form.Item>
                        </Form>

                    </Col>
                </Row>
            </Modal>
        </React.Fragment>
    )
}

export default withRouter(GraphicMessageList)