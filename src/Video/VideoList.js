import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Row, Col, Button, Table, Form, Divider, Modal, message, Tag, Space, Select, Input } from 'antd';
import './VideoList.css';

import ImageUploader from '../Utils/ImageUploader';
import VideoUploader from '../Utils/VideoUploader';

const columns = [
  {
    title: '视频名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: '封面',
    key: 'poster',
    dataIndex: 'poster',
    render: tags => (
      <>
        <img src='http://106.75.216.135/resources/A001.png' alt="" className="videoPosterPic" />
      </>
    ),
  },
  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
  },
  // {
  //   title: 'Address',
  //   dataIndex: 'address',
  //   key: 'address',
  // },
  {
    title: '标签',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === '肩颈') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>修改</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: '肩颈痛的西医治疗',
    duration: 15,
    address: 'New York No. 1 Lake Park',
    tags: ['西医', '肩颈'],
    poster: ''
  },
  {
    key: '2',
    name: '1分钟缓解颈部疼痛',
    duration: 60,
    address: 'London No. 1 Lake Park',
    tags: ['西医'],
    poster: ''
  },
  {
    key: '3',
    name: '三个动作解决肩颈酸痛',
    duration: 30,
    address: 'Sidney No. 1 Lake Park',
    tags: ['西医', '腰椎'],
    poster: ''
  },
];

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class VideoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAdd: false,
      loading: false
    }
  }
  componentWillMount() {

  }

  Add() {
    this.setState({ showAdd: true });
  }

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, showAdd: false });
    }, 1500);
  };

  handleCancel = () => {
    this.setState({ showAdd: false });
  };

  render() {
    const { loading } = this.state;

    return (
      <React.Fragment>
        <Row type="flex" justify='end'>
          <Col>
            <Button type="primary" onClick={this.Add.bind(this)}>添加</Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={data} />
        <Modal
          title='添加视频'
          visible={this.state.showAdd}
          footer={[
            <Button key="back" onClick={this.handleCancel.bind(this)}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk.bind(this)}>
              保存
            </Button>,
          ]}
          onOk={ this.handleOk.bind(this) }
          onCancel={ this.handleCancel.bind(this) }
        >
          <Row>
            <Col span={24}>
              <Form {...layout}>
                <Form.Item
                  name="视频名称"
                  label="视频名称"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="封面"
                  label="封面"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <ImageUploader></ImageUploader>
                </Form.Item>
                <Form.Item
                  name="时长"
                  label="时长"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input type="number" style={{width:'150px'}} />
                </Form.Item>
                <Form.Item
                  name="视频"
                  label="视频"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <VideoUploader></VideoUploader>
                </Form.Item>
              </Form>

            </Col>
          </Row>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(VideoList)