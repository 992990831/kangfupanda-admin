import React, { useState, useEffect, useRef, useContext } from 'react';
import { Row, Col, Button, Table, Form, List, Divider, Modal, message, Tag, Space, Select, Input, notification, Popconfirm } from 'antd';
import axios from 'axios';
import { Constants } from '../Utils/Constants';
import { UsersContext } from '../Utils/UsersContext';

const { Option } = Select;

export const PendingAuditList = () => {
    const columns = [
        {
            title: '评论人昵称',
            dataIndex: 'comment_user_name',
            key: 'comment_user_name',
            render: text => <a>{text}</a>,
        },
        {
            title: '评论人头像',
            key: 'comment_user_pic',
            dataIndex: 'comment_user_pic',
            render: headpic => (
                <>
                    <img src={headpic.substring(0, 4) == 'http' ? headpic : `${Constants.ResourceUrl}${headpic}`} alt="" className="doctorHeadPic" />
                </>
            ),
        },
        {
            title: '评论内容',
            dataIndex: 'comment_content',
            key: 'comment_content',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm title="确定通过?" onConfirm={() => {
                        Approve(record.comment_id);
                    }}>
                        <a href="javascript:;">通过</a>
                    </Popconfirm>
                    <Popconfirm title="确定拒绝?" onConfirm={() => {
                        Reject(record.comment_id);
                    }}>
                        <a href="javascript:;">拒绝</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const [pagination, setPagination] = useState({current:1, pageSize:15, total:0});
    const [comments, setComments] = useState([]);
    const [userOpenId, setUserOpenId] = useState('');

    const users = useContext(UsersContext);

    useEffect(() => {
        getList(pagination.current, pagination.pageSize);
    }, [])

    const getList = (current, pageSize, openId) => {
        openId = openId? openId:'';

        axios(`${Constants.APIBaseUrl}/comments/audit/list?pageIndex=${current}&pageSize=${pageSize}&openId=${openId}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
           
            pagination.total = res.data.count;
            setPagination(pagination); //这里必须要按照useState定义时的顺序，先setPagination，再是setComments。否则会出现set之后不生效的问题。

            let commentList = res.data.lists.map(comment => {
                return {...comment, key: comment.comment_id};
              })
            setComments(commentList);

           
        })
    }

    const onPaginationChange = (pageIndex, pageSize) => {
        pagination.current = pageIndex;
        pagination.pageSize = pageSize;
        setPagination(pagination);
        getList(pageIndex, pageSize);
    }    

    const Approve = (commentId)=>{
        axios(`${Constants.APIBaseUrl}/comments/audit/approve?commentId=${commentId}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            getList(pagination.current, pagination.pageSize);
        })

        
    }
    
    const Reject = (commentId)=>{
        axios(`${Constants.APIBaseUrl}/comments/audit/reject?commentId=${commentId}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            getList(pagination.current, pagination.pageSize);
        })
    }

    const Search= (openId) => {
        debugger;
        getList(pagination.current, pagination.pageSize, openId);
    }

    return (
        <React.Fragment>
                <Row gutter={8}>
                    <Col span={24}>
                        <span style={{ fontSize: '18px', color: '#1890ff' }}>待审核</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        评论人：<Select style={{ width: '60%' }} onChange={(value)=>{
                            debugger;
                            setUserOpenId(value);
                        }}>
                        {
                            users.map(u => (
                                <Option key={u.id} value={u.openId}>{u.nickName}</Option>
                              ))
                        }
                        </Select>
                    </Col>
                    {/* <Col span={5}>
                        评论人 <Input style={{ width: '70%' }} defaultValue={'123'} onChange={() => { }} />
                    </Col> 

                    <Col span={8}>
                        状态：<Select defaultValue={1} style={{ width: '60%' }} onChange={() => { }}>
                            <Option value={-1}>--全部--</Option>
                            <Option value={0}>未启动</Option>
                            <Option value={1}>进行中</Option>
                            <Option value={2}>已完成</Option>
                        </Select>
                    </Col>*/}

                    <Col span={3}>
                        <Button type="primary" onClick={()=>{
                            Search(userOpenId);
                        }}>
                            搜索
                            </Button>
                    </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                    <Col span={24}>
                        <Table columns={columns} dataSource={comments}
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: pagination.total,
                                onChange: onPaginationChange,
                            }}
                        />
                    </Col>
                </Row>

        </React.Fragment>
    )
}