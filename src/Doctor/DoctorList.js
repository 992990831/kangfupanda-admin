import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Table, Form, Divider, Modal, message, Tag, Space, Select, Input } from 'antd';

import './DoctorList.css';

const columns = [
    {
      title: '治疗师',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
        title: '个人照',
        key: 'pic',
        dataIndex: 'pic',
        render: tags => (
          <>
            <img src='http://106.75.216.135/resources/doctor1.jpg' alt="" className="doctorHeadPic" />
          </>
        ),
      },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
        title: '认证',
        dataIndex: 'verification',
        key: 'verification',
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
      name: 'Albert',
      level: 'L1',
      description: '卫健部执业认证康复治疗师，对运动损伤方面的康复有丰富经验。',
      verification: '已认证',
    },
    {
      key: '2',
      name: 'Delicia',
      level: 'L1',
      description: '主要擅长下肢生物力学调整，关节障碍无痛调整，肌肉骨骼急慢性疼痛及运动损伤调理。',
      verification: '已认证',
    },
    {
      key: '3',
      name: 'Brad',
      level: 'L1',
      description: '长颈肩腰腿痛的复健和早期中风及术后家庭康复方案',
      verification: '已认证',
    },
  ];

  
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

  
class DoctorList extends Component {
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
                  {/* <ImageUploader></ImageUploader> */}
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
             
              </Form>

            </Col>
          </Row>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(DoctorList)