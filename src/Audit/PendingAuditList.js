import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Table, Form, List, Divider, Modal, message, Tag, Space, Select, Input, notification, Popconfirm } from 'antd';
import axios from 'axios';
import { Constants } from '../Utils/Constants';



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

    const [comments, setComments] = useState([]);
    useEffect(() => {
        getList();
    }, [])

    const getList = () => {
        axios(`${Constants.APIBaseUrl}/comments/audit/list`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            let commentList = res.data.map(comment => {
                return {...comment, key: comment.comment_id};
              })
            setComments(commentList);
        })
    }

    const Approve = (commentId)=>{
        axios(`${Constants.APIBaseUrl}/comments/audit/approve?commentId=${commentId}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            getList();
        })

        
    }
    
    const Reject = (commentId)=>{
        axios(`${Constants.APIBaseUrl}/comments/audit/reject?commentId=${commentId}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            getList();
        })
    }

    return (
        <React.Fragment>
            <Table columns={columns} dataSource={comments} />
        </React.Fragment>
    )
}