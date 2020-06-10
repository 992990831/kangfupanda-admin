import React, { useState, useEffect, useRef } from 'react';
import ImageUploader from '../Utils/ImageUploader';
import { withRouter } from 'react-router-dom'
import { Row, Col, Button, Table, Form, List, Divider, Modal, message, Tag, Space, Select, Input, notification, Popconfirm } from 'antd';

import './SiteGraphicMessage.css';
import axios from 'axios';
import { Constants } from '../Utils/Constants';

import RichText from '../Utils/RichText';

const { TextArea } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export const SiteGraphicMessageList = () => {
    const formRef = useRef();
    const [pics, setPics] = useState(['','','','']);

    useEffect(() => {
        getList();
    }, [])

    const getList = () => {
        axios(`${Constants.APIBaseUrl}/site/list/graphic`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            pics[0] = res.data.pic01;
            pics[1] = res.data.pic02;
            pics[2] = res.data.pic03;
            pics[3] = res.data.pic04;
            setPics(pics);

            formRef.current.setFieldsValue({
                author01: res.data.author01,
                text01: res.data.text01,
                pic01: pics[0],
                author02: res.data.author02,
                text02: res.data.text02,
                pic02: pics[1],
                author03: res.data.author03,
                text03: res.data.text03,
                pic03: pics[2],
                author04: res.data.author04,
                text04: res.data.text04,
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
    
    const handleRichTextChange01 = (value) =>{
        formRef.current.setFieldsValue({
            text01: value,
        })
    }

    const handleRichTextChange02 = (value) =>{
        formRef.current.setFieldsValue({
            text02: value,
        })
    }

    const handleRichTextChange03 = (value) =>{
        formRef.current.setFieldsValue({
            text03: value,
        })
    }

    const handleRichTextChange04 = (value) =>{
        formRef.current.setFieldsValue({
            text04: value,
        })
    }

    const saveForm = () => {
        var values = formRef.current.getFieldsValue();
        values.pic01 = pics[0];
        values.pic02 = pics[1];
        values.pic03 = pics[2];
        values.pic04 = pics[3];
        axios.post(`${Constants.APIBaseUrl}/site/save/graphic`, values, {
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
            <Form ref={formRef} {...layout} style={{ marginTop: '20px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            name="author01"
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
                            name="text01"
                            label="描述"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                            style={{ height: '300px' }}
                        >
                            <RichText onValueChange={handleRichTextChange01} />
                        </Form.Item>

                        <Form.Item
                            name="pic01"
                            label="图片"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <ImageUploader afterUpload={handleAfterUploadPic01} uploadUrl='video/UploadSiteVideo' imageUrl={{urls: pics, index:0, prefix: Constants.OfficialSiteResourceUrl}}></ImageUploader>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="author02"
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
                            name="text02"
                            label="描述"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                            style={{ height: '300px' }}
                        >
                            <RichText onValueChange={handleRichTextChange02} />
                        </Form.Item>

                        <Form.Item
                            name="pic02"
                            label="图片"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <ImageUploader afterUpload={handleAfterUploadPic02} uploadUrl='video/UploadSiteVideo' imageUrl={{urls: pics, index:1, prefix: Constants.OfficialSiteResourceUrl}}></ImageUploader>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            name="author03"
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
                            name="text03"
                            label="描述"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                            style={{ height: '300px' }}
                        >
                            <RichText onValueChange={handleRichTextChange03} />
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
                    <Col span={12}>
                        <Form.Item
                            name="author04"
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
                            name="text04"
                            label="描述"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                            style={{ height: '300px' }}
                        >
                            <RichText onValueChange={handleRichTextChange04} />
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