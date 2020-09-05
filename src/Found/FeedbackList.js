import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Table, Form, Popconfirm, Modal, message, Tag, Space, Select, Input, notification } from 'antd';
import axios from 'axios';
import { Constants } from '../Utils/Constants';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export function FeedbackList(){
    const columns = [
        {
            title: '反馈人',
            dataIndex: 'nickName',
            key: 'nickName',
            width:'150px',
            // render: text => <a>{text}</a>,
        },
        {
            title: '电话',
            key: 'phone',
            dataIndex: 'phone',
            width:'150px',
            // render: headpic => (
            //     <>
            //         <img src={headpic.substring(0, 4) == 'http' ? headpic : `${Constants.ResourceUrl}${headpic}`} alt="" className="doctorHeadPic" />
            //     </>
            // ),
        },
        {
            title: '产品',
            dataIndex: 'productName',
            key: 'createdAtStr',
            width:'250px',
            render: (text, record) => (
                <span style={{whiteSpace:'pre-wrap'}}>
                    {record.productName}
                </span>
            )
        },
        {
            title: '评论',
            dataIndex: 'comment',
            key: 'comment',
            style:{width:'auto'},
            render: (text, record) => (
                <span style={{whiteSpace:'pre-wrap'}}>
                    {record.comment}
                </span>
            )
        },
        // {
        //     title: '操作',
        //     key: 'action',
        //     width:'200px',
        //     render: (text, record) => (
        //         <Space size="middle">
        //             <Popconfirm title="确定取消关注?" onConfirm={() => {
        //                 //DeleteFollow(record.id);
        //                 unfollow(record.id);
        //             }}>
        //                 <a href="javascript:;">取消关注</a>
        //             </Popconfirm>
        //         </Space>
        //     ),
        // },
    ];

    //pagination参见： https://ant.design/components/pagination-cn/
    const [pagination, setPagination] = useState({current:1, pageSize:100, total:0});
    const [feedbacks, setFeedbacks] = useState([]);
    //const [name, setName] = useState('');

     //只在初始化时需要出发，所以第二个参数为空
     useEffect(() => {
        getList();
    }, [])

    const getList = () => {
        axios.get(`${Constants.APIBaseUrl}/feedback/list?pageIndex=${pagination.current}&pageSize=${pagination.pageSize}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            pagination.total = res.data.count;
            let feedbacks = res.data.feedbacks.map(feedback => {
                return { ...feedback, key: feedback.id }
            })
            setFeedbacks(feedbacks);
        })
    }

    // const unfollow = (followId) =>{
    //     axios.get(`${Constants.APIBaseUrl}/follow/unfollow/${followId}`, {
    //         headers: { 'Content-Type': 'application/json' }
    //     }).then(res => {
    //         getList();
    //     })
    // }

    const onPaginationChange = (pageIndex, pageSize) => {
        pagination.current = pageIndex;
        pagination.pageSize = pageSize;
        setPagination(pagination);
        getList(pageIndex, pageSize);
    }    

    const onShowSizeChange = (pageIndex, pageSize) => {
        pagination.current = pageIndex;
        pagination.pageSize = pageSize;
        setPagination(pagination);
        getList(pageIndex, pageSize);
    }

    return (
        <React.Fragment>
            {/* <Row type="flex" justify='center' style={{marginTop:'10px', marginBottom:'5px'}}>
                <Col span={6}>
                    <Input placeholder='请输入关注人姓名' onChange={(input)=>{
                        setName(input.target.value);
                    }}></Input>
                </Col>
                <Col span={3}>
                    <Button type="primary" onClick={()=>{
                        getList();
                    }}>搜索</Button>
                </Col>
            </Row> */}
            <Table columns={columns} dataSource={feedbacks} 
            pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: onPaginationChange,
                onShowSizeChange: onShowSizeChange,
                showTotal: ((total) => {
                    return `共 ${total} 条`;
                  }),
            }}
            />
            </React.Fragment>
    )
}