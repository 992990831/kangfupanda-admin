import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Row, Col, Button, Table, Form, Divider, Modal, message, Tag, Space, AutoComplete, Input, notification,Popconfirm } from 'antd';
import './VideoList.css';

import ImageUploader from '../Utils/ImageUploader';
import VideoUploader from '../Utils/VideoUploader';
import { Constants } from '../Utils/Constants';

import axios from 'axios';

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
      loading: false,
      users: [],
      videos: []
    }
  }
  componentWillMount() {
    this.GetList();
    this.GetUserList();
  }

  GetList()
  {
    axios.get(`${Constants.APIBaseUrl}/video/GetVideos`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        let videos = res.data.map(video => {
          return {...video, key: video.id};
        })
          this.setState({
            videos,
          });
      })
      .catch(function (error) {
          console.log(error);
      });
  }

  GetUserList()
  {
    axios.get(`${Constants.APIBaseUrl}/user/list`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        let users = res.data.map(user => {
          return {...user, key: user.id, value: user.nickName};
        })

          this.setState({
            users,
          });
      })
      .catch(function (error) {
          console.log(error);
      });
  }

  Add() {
    this.setState({ showAdd: true });
  }

  handleOk = () => {
    this.setState({ loading: true });

    var values = this.refs.addForm.getFieldsValue();

    values.posterUri = this.state.imgName;
    values.videoUri = this.state.videoName;

    let openId = '';
    
    this.state.users.forEach((user)=>{
      if(values.author == user.nickName)
      {
        openId = user.openId;
      }
    });

    values.openId = openId;
    
    axios.post(`${Constants.APIBaseUrl}/video/addVideo`, values, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        console.log("result=>", res);

        this.setState({ loading: false, showAdd: false });
        this.GetList();
      })
      .catch( (error) => {
        console.log(error);
        debugger;
        this.setState({ loading: false });
        notification.open({
          message: '保存失败',
          description:
            '保存视频信息失败',
          onClick: () => {
            //console.log('Notification Clicked!');
          },
          duration: 3
        });
      });
  };

  handleCancel = () => {
    this.setState({ showAdd: false });
  };

  handleAfterUploadImage(imgName) {
    this.setState({ imgName: imgName });
  }

  handleAfterUploadVideo(videoName) {
    this.setState({ videoName: videoName });
  }

  onFinish(values){
    console.log(values);
  };

DeleteVideo(id)
{
  axios.get(`${Constants.APIBaseUrl}/video/DeleteVideo?id=${id}`, {
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => {
        this.GetList();
    })
    .catch(function (error) {
      notification.open({
        message: '删除失败',
        description:
          '删除视频信息失败',
        onClick: () => {
          //console.log('Notification Clicked!');
        },
        duration: 3
      });
    });
}

columns = [
  {
    title: '视频名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: '作者姓名',
    dataIndex: 'author',
    key: 'author',
    render: text => <a>{text}</a>,
  },
  {
    title: '封面',
    key: 'posterUri',
    dataIndex: 'posterUri',
    render: poster => (
      <>
        <img src={`${Constants.ResourceUrl}\\${poster}`} alt="" className="videoPosterPic" />
      </>
    ),
  },
  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>修改</a>
        <Popconfirm title="确定删除?" onConfirm={() => {
                this.DeleteVideo(record.id);
            }}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
      </Space>
    ),
  },
];

  render() {
    const { loading } = this.state;

    return (
      <React.Fragment>
        <Row type="flex" justify='end'>
          <Col>
            <Button type="primary" onClick={this.Add.bind(this)}>添加</Button>
          </Col>
        </Row>
        <Table columns={this.columns} dataSource={this.state.videos} />
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
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <Row>
            <Col span={24}>
              <Form ref='addForm' {...layout} onFinish={this.onFinish.bind(this)}>
                <Form.Item
                  name="name"
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
                    options={this.state.users}
                    placeholder="请输入用户昵称查找"
                    filterOption={(inputValue, option) =>{
                        return option.nickName.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                      
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="posterUri"
                  label="封面"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <ImageUploader afterUpload={this.handleAfterUploadImage.bind(this)}></ImageUploader>
                </Form.Item>
                <Form.Item
                  name="duration"
                  label="时长"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input type="number" style={{ width: '150px' }} />
                </Form.Item>
                <Form.Item
                  name="videoUri"
                  label="视频"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <VideoUploader afterUpload={this.handleAfterUploadVideo.bind(this)}></VideoUploader>
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