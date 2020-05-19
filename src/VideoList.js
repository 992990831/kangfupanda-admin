import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Table, Tag, Space } from 'antd';
import './VideoList.css'

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

  
class VideoList extends Component {
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

export default withRouter(VideoList)