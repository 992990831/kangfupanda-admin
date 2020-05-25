import React, { Component, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Table, Form, Divider, Modal, message, Tag, Space, Select, Input } from 'antd';
import axios from 'axios';
import { Constants } from '../Utils/Constants';

import './DoctorList.css';

const columns = [
  {
    title: '治疗师',
    dataIndex: 'nickName',
    key: 'nickname',
    render: text => <a>{text}</a>,
  },
  {
    title: '个人照',
    key: 'headpic',
    dataIndex: 'headpic',
    render: headpic => (
      <>
        <img src={headpic} alt="" className="doctorHeadPic" />
      </>
    ),
  },
  {
    title: '省',
    dataIndex: 'province',
    key: 'province',
  },
  {
    title: '市',
    dataIndex: 'city',
    key: 'city',
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

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function DoctorList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {

      if(users && users.length>0)
      {
        return;
      }

      axios(`${Constants.APIBaseUrl}/user/list`, {
        headers: { 'Content-Type': 'application/json' }
      }).then( res => {
        setUsers(res.data);
      })
  })

  return (
    <React.Fragment>
      <Table columns={columns} dataSource={users} />
    </React.Fragment>
  )
}

// class DoctorList extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       showAdd: false,
//       loading: false
//     }
//   }
//   componentWillMount() {
//   }

//   render() {
//     const { loading } = this.state;

//     return (
//       <React.Fragment>
//         <Row type="flex" justify='end'>
//           <Col>
//             <Button type="primary" onClick={this.Add.bind(this)}>添加</Button>
//           </Col>
//         </Row>
//         <Table columns={columns} dataSource={data} />
//       </React.Fragment>
//     );
//   }
// }

export default withRouter(DoctorList)