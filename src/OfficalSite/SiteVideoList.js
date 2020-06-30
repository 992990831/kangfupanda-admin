import React, { useState, useEffect, useRef } from 'react';
import ImageUploader from '../Utils/ImageUploader';
import VideoUploader from '../Utils/VideoUploader';
import { withRouter } from 'react-router-dom'
import { Row, Col, Button, Table, Form, List, Divider, Modal, message, Tag, Space, Select, Input, notification, Popconfirm } from 'antd';

import './SiteVideo.css';
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

export const SiteVideoList = () => {
    const formRef = useRef();
    const [videos, setvideos] = useState(['', '', '', '']);
    const [posters, setPosters] = useState(['', '', '', '']);

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

            posters[0] = res.data.poster01;
            posters[1] = res.data.poster02;
            posters[2] = res.data.poster03;
            posters[3] = res.data.poster04;
            setPosters(posters);

            formRef.current.setFieldsValue({
                author01: res.data.author01,
                text01: res.data.text01,
                poster01: res.data.poster01,
                video01: res.data.video01,
                author02: res.data.author02,
                text02: res.data.text02,
                poster02: res.data.poster02,
                video02: res.data.video02,
                author03: res.data.author03,
                text03: res.data.text03,
                poster03: res.data.poster03,
                video03: res.data.video03,
                author04: res.data.author04,
                text04: res.data.text04,
                poster04: res.data.poster04,
                video04: res.data.video04,
            })
        })
    }
    
    const handleAfterUploadImage01 = (imageName) => {
        posters[0] = imageName;
        formRef.current.setFieldsValue({
            poster01: imageName,
        })
        setPosters(posters);
    }

    const handleAfterUploadImage02 = (imageName) => {
        posters[1] = imageName;
        formRef.current.setFieldsValue({
            poster02: imageName,
        })
        setPosters(posters);
    }
    
    const handleAfterUploadImage03 = (imageName) => {
        posters[2] = imageName;
        formRef.current.setFieldsValue({
            poster03: imageName,
        })
        setPosters(posters);
    }
    
    const handleAfterUploadImage04 = (imageName) => {
        posters[3] = imageName;
        formRef.current.setFieldsValue({
            poster04: imageName,
        })
        setPosters(posters);
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
            .catch((error) => {
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
                            label="标题"
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
                            name="poster01"
                            label="封面"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <ImageUploader afterUpload={handleAfterUploadImage01} uploadUrl='video/UploadSiteVideo' imageUrl={{urls: posters, index:0, prefix: Constants.OfficialSiteResourceUrl}}></ImageUploader>
                        </Form.Item>
                        <Form.Item
                            name="video01"
                            label="音频"
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
                            label="已上传音频"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <input readOnly style={{ width: '100%' }}></input>
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
                            name="poster02"
                            label="视频封面"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <ImageUploader afterUpload={handleAfterUploadImage02} uploadUrl='video/UploadSiteVideo' imageUrl={{urls: posters, index:1, prefix: Constants.OfficialSiteResourceUrl}}></ImageUploader>
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
                            <input readOnly style={{ width: '100%' }}></input>
                        </Form.Item>
                    </Col>
                </Row>
                <Divider dashed={true} style={{borderColor:'grey'}}></Divider>
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
                            name="poster03"
                            label="视频封面"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <ImageUploader afterUpload={handleAfterUploadImage03} uploadUrl='video/UploadSiteVideo' imageUrl={{urls: posters, index:2, prefix: Constants.OfficialSiteResourceUrl}}></ImageUploader>
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
                            <input readOnly style={{ width: '100%' }}></input>
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
                            name="poster04"
                            label="视频封面"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <ImageUploader afterUpload={handleAfterUploadImage04} uploadUrl='video/UploadSiteVideo' imageUrl={{urls: posters, index:3, prefix: Constants.OfficialSiteResourceUrl}}></ImageUploader>
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
                            <input readOnly style={{ width: '100%' }}></input>
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