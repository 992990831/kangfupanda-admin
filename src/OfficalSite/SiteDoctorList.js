import React, { useState, useEffect, useRef } from 'react';
import ImageUploader from '../Utils/ImageUploader';
import { withRouter } from 'react-router-dom'
import { Row, Col, Button, Table, Form, List, Divider, Modal, message, Tag, Space, Select, Input, notification, Popconfirm } from 'antd';

import './SiteGraphicMessage.css';
import axios from 'axios';
import { Constants } from '../Utils/Constants';

const { TextArea } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export const SiteDoctorList = () => {
    const formRef = useRef();
    const [pics, setPics] = useState(['','','','']);
    useEffect(() => {
        getList();
    }, [])

    const getList = () => {
        axios(`${Constants.APIBaseUrl}/site/list/doctor`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            pics[0] = res.data.pic01;
            pics[1] = res.data.pic02;
            pics[2] = res.data.pic03;
            pics[3] = res.data.pic04;
            setPics(pics);
            debugger;
            formRef.current.setFieldsValue({
                name01: res.data.name01,
                comment01: res.data.comment01,
                pic01: pics[0],
                name02: res.data.name02,
                comment02: res.data.comment02,
                pic02: pics[1],
                name03: res.data.name03,
                comment03: res.data.comment03,
                pic03: pics[2],
                name04: res.data.name04,
                comment04: res.data.comment04,
                pic04: pics[3],
            })
            
        })
    }

    const handleAfterUploadPic01 = (picName) => {
        pics[0] = picName;
        setPics(pics);
    }

    const handleAfterUploadPic02 = (picName) => {
        pics[1] = picName;
        setPics(pics);
    }

    const handleAfterUploadPic03 = (picName) => {
        pics[2] = picName;
        setPics(pics);
    }
    

    const handleAfterUploadPic04 = (picName) => {
        pics[3] = picName;
        setPics(pics);
    }
    
    const saveForm = () => {
        var values = formRef.current.getFieldsValue();
        values.pic01 = pics[0];
        values.pic02 = pics[1];
        values.pic03 = pics[2];
        values.pic04 = pics[3];
        
        axios.post(`${Constants.APIBaseUrl}/site/save/doctor`, values, {
            headers: { 'Content-Type': 'application/json' }
          })
            .then(res => {
                notification.open({
                    message: '保存成功',
                    description:
                      '保存成功',
                    onClick: () => {
                      //console.log('Notification Clicked!');
                    },
                    duration: 3
                  });
            })
            .catch( (error) => {
              notification.open({
                message: '保存失败',
                description:
                  '保存失败',
                onClick: () => {
                  //console.log('Notification Clicked!');
                },
                duration: 3
              });
            });
    }
    
    return (
        <React.Fragment>
            {/* <Row gutter={[16, 16]}>
                <Col span={6}>
                  111222333
                </Col>
                <Col span={6} />
                <Col span={6} />
                <Col span={6} />
            </Row> */}
            <Form ref={formRef} {...layout} style={{ marginTop: '20px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Form.Item
                            name="name01"
                            label="医生"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="comment01"
                            label="描述"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <TextArea />
                        </Form.Item>

                        <Form.Item
                            name="pic01"
                            label="照片"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <ImageUploader afterUpload={handleAfterUploadPic01} uploadUrl='video/UploadSiteVideo' imageUrl={{urls: pics, index:0, prefix: Constants.OfficialSiteResourceUrl}}></ImageUploader>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="name02"
                            label="医生"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="comment02"
                            label="描述"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <TextArea />
                        </Form.Item>

                        <Form.Item
                            name="pic02"
                            label="照片"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <ImageUploader afterUpload={handleAfterUploadPic02} uploadUrl='video/UploadSiteVideo' imageUrl={{urls: pics, index:1, prefix: Constants.OfficialSiteResourceUrl}}></ImageUploader>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="name03"
                            label="医生"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="comment03"
                            label="描述"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <TextArea />
                        </Form.Item>

                        <Form.Item
                            name="pic03"
                            label="图片"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <ImageUploader afterUpload={handleAfterUploadPic03} uploadUrl='video/UploadSiteVideo' imageUrl={{urls: pics, index:2, prefix: Constants.OfficialSiteResourceUrl}}></ImageUploader>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="name04"
                            label="医生"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="comment04"
                            label="描述"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <TextArea />
                        </Form.Item>

                        <Form.Item
                            name="pic04"
                            label="图片"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <ImageUploader afterUpload={handleAfterUploadPic04} uploadUrl='video/UploadSiteVideo' imageUrl={{urls: pics, index:3, prefix: Constants.OfficialSiteResourceUrl}}></ImageUploader>
                        </Form.Item>
                    </Col>
                </Row>
                <Row type="flex" justify='end'>
                    <Col>
                        <Button type="primary" onClick={saveForm}>保存</Button>
                    </Col>
                </Row>
            </Form>

        </React.Fragment>
    )
}

//export default withRouter(SiteGraphicMessageList)