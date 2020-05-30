import React, { useState, useEffect, useRef } from 'react';
import VideoUploader from '../Utils/VideoUploader';
import { withRouter } from 'react-router-dom'
import { Row, Col, Button, Table, Form, List, Divider, Modal, message, Tag, Space, Select, Input, notification, Popconfirm } from 'antd';

import './SiteVideo.css';
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

export const SiteVideoList = () => {
    const formRef = useRef();
    const [videos, setvideos] = useState(['','','','']);

    useEffect(() => {
        getList();
    }, [])

    const getList = () => {
        axios(`${Constants.APIBaseUrl}/site/list/video`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            videos[0] = res.data.video01;
            videos[1] = res.data.video02;
            videos[2] = res.data.video03;
            videos[3] = res.data.video04;
            setvideos(videos);
            formRef.current.setFieldsValue({
                author01: res.data.author01,
                text01: res.data.text01,
                video01: res.data.video01,
                author02: res.data.author02,
                text02: res.data.text02,
                video02: res.data.video02,
                author03: res.data.author03,
                text03: res.data.text03,
                video03: res.data.video03,
                author04: res.data.author04,
                text04: res.data.text04,
                video04: res.data.video04,
            })
        })
    }

    const handleAfterUploadVideo01 = (videoName) => {
        videos[0] = videoName;
        formRef.current.setFieldsValue({
            video01: videoName,
        })
        setvideos(videos);
    }

    const handleAfterUploadVideo02 = (videoName) => {
        videos[1] = videoName;
        formRef.current.setFieldsValue({
            video02: videoName,
        })
        setvideos(videos);
    }

    const handleAfterUploadVideo03 = (videoName) => {
        videos[2] = videoName;
        formRef.current.setFieldsValue({
            video03: videoName,
        })
        setvideos(videos);
    }
    

    const handleAfterUploadVideo04 = (videoName) => {
        videos[3] = videoName;
        formRef.current.setFieldsValue({
            video04: videoName,
        })
        setvideos(videos);
    }
    
    const saveForm = () => {
        var values = formRef.current.getFieldsValue();
        values.video01 = videos[0];
        values.video02 = videos[1];
        values.video03 = videos[2];
        values.video04 = videos[3];
        axios.post(`${Constants.APIBaseUrl}/site/save/video`, values, {
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
                        >
                            <TextArea />
                        </Form.Item>

                        <Form.Item
                            name="video01"
                            label="视频"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <VideoUploader afterUpload={handleAfterUploadVideo01} uploadUrl='video/UploadSiteVideo'></VideoUploader>
                        </Form.Item>
                        <Form.Item
                            name="video01"
                            label="已上传视频"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <input readOnly style={{width:'100%'}}></input>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
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
                        >
                            <TextArea />
                        </Form.Item>

                        <Form.Item
                            name="video02"
                            label="视频"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <VideoUploader afterUpload={handleAfterUploadVideo02} uploadUrl='video/UploadSiteVideo'></VideoUploader>
                        </Form.Item>
                        <Form.Item
                            name="video02"
                            label="已上传视频"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <input readOnly style={{width:'100%'}}></input>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
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
                        >
                            <TextArea />
                        </Form.Item>

                        <Form.Item
                            name="video03"
                            label="视频"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <VideoUploader afterUpload={handleAfterUploadVideo03} uploadUrl='video/UploadSiteVideo'></VideoUploader>
                        </Form.Item>
                        <Form.Item
                            name="video03"
                            label="已上传视频"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <input readOnly style={{width:'100%'}}></input>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
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
                        >
                            <TextArea />
                        </Form.Item>

                        <Form.Item
                            name="video04"
                            label="视频"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <VideoUploader afterUpload={handleAfterUploadVideo04} uploadUrl='video/UploadSiteVideo'></VideoUploader>
                        </Form.Item>
                        <Form.Item
                            name="video04"
                            label="已上传视频"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <input readOnly style={{width:'100%'}}></input>
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


//export default withRouter(SiteVideoList)