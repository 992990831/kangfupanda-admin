import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom'
import { Row, Col, Button, Table, Form, List, Divider, Modal, AutoComplete, Tag, Space, Select, Input, notification, Popconfirm } from 'antd';
import './GraphicMessage.css';

import ImageUploader from '../Utils/ImageUploader';
import AudioUploader from '../Utils/AudioUploader';
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
            title: '标题',
            key: 'name',
            dataIndex: 'name',
            render: text => {
                let subText = text?  (text.length > 50 ? text.substring(0, 50) : text) : '无标题';
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
                        EditGraphicMessage(record);

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
    //用来缓存添加、修改界面的6个图片
    const [pics, setPics] = useState(['', '', '', '', '', '',]);
    const [audioes, setAudioes] = useState(['', '', '']);
    const [showAdd, setShowAdd] = useState(false);
    // const [showEdit, setShowEdit] = useState(false);
    const [users, setUsers] = useState([]);
    const [editRecord, setEditRecord] = useState({showEdit:false});


    //只在初始化时需要出发，所以第二个参数为空
    useEffect(() => {
        getList();
        GetUserList();

        if(editRecord.showEdit)
        {
            FillEditForm();
        }

    }, [editRecord])

    const getList = () => {
        axios(`${Constants.APIBaseUrl}/message/list`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            setMessages(res.data);
        })
    }

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

    const showAddForm = () => {
        setShowAdd(true);
    }

    const handleCancel = () => {
        ClearForm();
        setShowAdd(false);
        setEditRecord({showEdit:false});
    }

    const handleOk = () => {
        var values = addFormRef.current.getFieldsValue();

        addGraphicMessage(values);
    }

    const addGraphicMessage = (values) => {
        let body = {
            id: values.id,
            author: values.author,
            name: values.name,
            text: values.text,
            pic01: pics[0],
            pic02: pics[1],
            pic03: pics[2],
            pic04: pics[3],
            pic05: pics[4],
            pic06: pics[5],
            audio01: audioes[0],
            audio02: audioes[1],
            audio03: audioes[2],
        }

        let openId = '';

        users.forEach((user) => {
            if (values.author == user.nickName) {
                openId = user.openId;
            }
        });

        body.openId = openId;

        axios.post(`${Constants.APIBaseUrl}/message/add`, body, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                ClearForm();
                setShowAdd(false);
                setEditRecord({showEdit:false});                
                getList();
            })
            .catch((error) => {
                console.log(error);
                ClearForm();
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

    //添加后清空表单值
    const ClearForm = () =>{
        setPics(['','','','','','']);
        setAudioes(['','','']);
        addFormRef.current.resetFields();
    }

    const DeleteGraphicMessage = (id) => {
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

    const EditGraphicMessage = (record) =>{
        setEditRecord({...record, showEdit:true });
    }

    const FillEditForm = () => {
        window.setTimeout(() => {

            pics[0] = editRecord.pic01;
            pics[1] = editRecord.pic02;
            pics[2] = editRecord.pic03;
            pics[3] = editRecord.pic04;
            pics[4] = editRecord.pic05;
            pics[5] = editRecord.pic06;
            setPics(pics);

            audioes[0] = editRecord.audio01;
            audioes[1] = editRecord.audio02;
            audioes[2] = editRecord.audio03;
            setAudioes(audioes);

            addFormRef.current.setFieldsValue({
                id: editRecord.id,
                author: editRecord.author,
                name: editRecord.name,
                text: editRecord.text
            });          
        }, 500);
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

    const handleAfterUploadAudio01 = (audio) => {
        audioes[0] = audio;
        setAudioes(audioes);
    }

    const handleAfterUploadAudio02 = (audio) => {
        audioes[1] = audio;
        setAudioes(audioes);
    }

    const handleAfterUploadAudio03 = (audio) => {
        audioes[2] = audio;
        setAudioes(audioes);
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
                visible={showAdd || editRecord.showEdit}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" loading={false} onClick={handleOk}>
                        保存
                    </Button>,
                ]}
            >
                <Row>
                    <Col span={24}>
                        <Form ref={addFormRef} {...layout}>
                        <Form.Item
                                name="id"
                                label="id"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input readOnly={true} />
                            </Form.Item>
                            <Form.Item
                                name="author"
                                label="作者"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <AutoComplete
                                    style={{
                                        width: 200,
                                    }}
                                    backfill={true}
                                    options={users}
                                    placeholder="请输入用户昵称查找"
                                    filterOption={(inputValue, option) => {
                                        return option.nickName.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }

                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                name="name"
                                label="标题"
                                rules={[
                                    {
                                        required: false,
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
                                        <ImageUploader afterUpload={handleAfterUploadImage01} defaultImage={`${Constants.ResourceUrl}${editRecord.pic01}`}></ImageUploader>
                                        <ImageUploader afterUpload={handleAfterUploadImage02} defaultImage={`${Constants.ResourceUrl}${editRecord.pic02}`}></ImageUploader>
                                        <ImageUploader afterUpload={handleAfterUploadImage03} defaultImage={`${Constants.ResourceUrl}${editRecord.pic03}`}></ImageUploader>
                                    </List.Item>
                                    <List.Item>
                                        <ImageUploader afterUpload={handleAfterUploadImage04} defaultImage={`${Constants.ResourceUrl}${editRecord.pic04}`}></ImageUploader>
                                        <ImageUploader afterUpload={handleAfterUploadImage05} defaultImage={`${Constants.ResourceUrl}${editRecord.pic05}`}></ImageUploader>
                                        <ImageUploader afterUpload={handleAfterUploadImage06} defaultImage={`${Constants.ResourceUrl}${editRecord.pic06}`}></ImageUploader>
                                    </List.Item>
                                </List>


                            </Form.Item>
                            <Form.Item
                                name="audio"
                                label="音频"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <List>
                                    <List.Item>
                                        <AudioUploader afterUpload={handleAfterUploadAudio01} defaultAudio={editRecord.audio01}></AudioUploader>
                                    </List.Item>
                                    <List.Item>
                                        <AudioUploader afterUpload={handleAfterUploadAudio02} defaultAudio={editRecord.audio02}></AudioUploader>
                                    </List.Item>
                                    <List.Item>
                                        <AudioUploader afterUpload={handleAfterUploadAudio03} defaultAudio={editRecord.audio03}></AudioUploader>
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