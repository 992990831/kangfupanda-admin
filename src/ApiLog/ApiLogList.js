import React, { Component, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Table, Form, Popconfirm, Modal, message, Tag, Space, Select, Input, notification } from 'antd';
import axios from 'axios';
import { Constants } from '../Utils/Constants';
import ImageUploader from '../Utils/ImageUploader';

import './ApiLogList.css';

const { TextArea } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export function ApiLogList() {
    const columns = [
        // {
        //   title: 'id',
        //   dataIndex: 'openId',
        //   key: 'openId',
        // render: text => <span style={{width:'10px'}}>{text}</span>,
        // },
        {
            title: 'openId',
            dataIndex: 'openId',
            key: 'openId',
            // width:'150px',
            render: text => <span>{text}</span>,
        },
        {
            title: '昵称',
            key: 'nickName',
            dataIndex: 'nickName',
            // width:'150px',
            render: text => <span>{text}</span>,
        },
        {
            title: '最后访问时间',
            dataIndex: 'lastVisitedAt',
            key: 'lastVisitedAt',
            style: { width: 'auto' },
            render: text => <span>{text}</span>,
        },
        {
            title: '过去一周访问量',
            dataIndex: 'visitCountLastWeek',
            key: 'visitCountLastWeek',
            style: { width: 'auto' },
            render: text => <span>{text}</span>,
        },
    ];

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [logs, setLogss] = useState([]);


    //只在初始化时需要出发，所以第二个参数为空
    useEffect(() => {
        getList(pagination.current, pagination.pageSize);
    }, [])

    const getList = () => {
        axios(`${Constants.APIBaseUrl}/apilog/list?pageIndex=${pagination.current}&pageSize=${pagination.pageSize}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            pagination.total = res.data.count;
            let logs = res.data.list.map(log => {
                return { ...log, key: log }
            })
            setLogss(logs);
        })
    }

    const onPaginationChange = (pageIndex, pageSize) => {
        pagination.current = pageIndex;
        pagination.pageSize = pageSize;
        setPagination(pagination);
        getList(pageIndex, pageSize);
    }

    return (
        <React.Fragment>
            <Table columns={columns} dataSource={logs}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: onPaginationChange,
                }}
            />
        </React.Fragment>
    )
}