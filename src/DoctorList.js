import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Table, Tag, Space } from 'antd';

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

  
class DoctorList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: [],
      isStar: true
    }
  }
  componentWillMount() {
    this.setState({
      item: this.props.item
    })
  }
 
  render() {
    const { item } = this.state;
    return (
      <React.Fragment>
        <Table columns={columns} dataSource={data} />
      </React.Fragment>
    );
  }
}

export default withRouter(DoctorList)