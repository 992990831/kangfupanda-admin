import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Table, Form, List, Divider, Modal, message, Tag, Space, Select, Input, notification, Popconfirm } from 'antd';
import axios from 'axios';
import { Constants } from '../Utils/Constants';

export const ApprovedList = () => {
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
                    <Popconfirm title="确定改为拒绝?" onConfirm={() => {
                        Reject(record.comment_id);
                    }}>
                        <a href="javascript:;">改为拒绝</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const [pagination, setPagination] = useState({current:1, pageSize:100, total:0});
    const [comments, setComments] = useState([]);

    useEffect(() => {
        getList(pagination.current, pagination.pageSize);
    }, [])

    const getList = (current, pageSize) => {
        axios(`${Constants.APIBaseUrl}/comments/audit/list/approved?pageIndex=${current}&pageSize=${pageSize}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            pagination.total = res.data.count;
            setPagination(pagination);//这里必须要按照useState定义时的顺序，先setPagination，再是setComments。否则会出现set之后不生效的问题。

            let commentList = res.data.lists.map(comment => {
                return {...comment, key: comment.comment_id};
              })
            setComments(commentList);
        })
    }

    // const Approve = (commentId)=>{
    //     axios(`${Constants.APIBaseUrl}/comments/audit/approve?commentId=${commentId}`, {
    //         headers: { 'Content-Type': 'application/json' }
    //     }).then(res => {
    //         getList();
    //     })

        
    // }
    
    const Reject = (commentId)=>{
        axios(`${Constants.APIBaseUrl}/comments/audit/reject?commentId=${commentId}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            getList();
        })
    }

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
            <span style={{fontSize:'18px', color:'#1890ff'}}>已通过</span>
            <Table columns={columns} dataSource={comments} 
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