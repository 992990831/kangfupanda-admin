import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Table, Form, List, Divider, Modal, message, Tag, Space, Select, Input, notification, Popconfirm } from 'antd';
import axios from 'axios';
import { Constants } from '../Utils/Constants';

const { TextArea } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export const NewsList = () => {
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width:'350px',
            // render: text => <a>{text}</a>,
        },
        // {
        //     title: '作者',
        //     key: 'author',
        //     dataIndex: 'author',
        //     width:'150px',
        //     // render: headpic => (
        //     //     <>
        //     //         <img src={headpic.substring(0, 4) == 'http' ? headpic : `${Constants.ResourceUrl}${headpic}`} alt="" className="doctorHeadPic" />
        //     //     </>
        //     // ),
        // },
        {
            title: '封面',
            key: 'thumb_url',
            dataIndex: 'thumb_url',
            width:'150px',
            render: thumb_url => (
                <>
                    {/* <img src={`data:image/jpeg;base64,${getImage(thumb_url).then(data)}`} alt="" style={{width:'100px'}} /> */}
                    <img src={thumb_url} alt="" style={{width:'100px'}} />
                </>
            ),
        },
        {
            title: '摘要',
            dataIndex: 'digest',
            key: 'digest',
            style:{width:'auto'},
            render: (text, record) => (
                <span style={{whiteSpace:'pre-wrap'}}>
                    {record.digest}
                </span>
            )
        },
        {
            title: '操作',
            key: 'action',
            width:'200px',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm title="确定发布?" onConfirm={() => {
                       postMessage(record);
                    }}>
                        <a href="javascript:;">发布到小程序</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const [news, setNews] = useState([]);
    const [abc, setABC] = useState('');

    useEffect(() => {
        getList().then(result=>{
            let newsStr = result.data;
            let news = JSON.parse(newsStr);
            news = news.item.map(news => {
                return { ...news.content.news_item[0], key: news.media_id }
            })

            news.forEach(item => {
                getImage(item);
            });

            setNews(news);
        });
    }, [])

    useEffect(()=>{
        //为了在获取图片后刷新UI，否则getImage后不会刷新UI
    }, [abc]);

    const getList = async () => {
       let result = await  axios('https://api.kangfupanda.com/wechat/list/news', {
            headers: { 'Content-Type': 'application/json' }
        });
        return result;
    }

    const getImage = async (item) => {
         let imgBase64 = await axios(`${Constants.APIBaseUrl}/wechat/image?url=${item.thumb_url}`, {
            headers: { 'Content-Type': 'application/json' }
        });

        item.thumb_url = `data:image/jpeg;base64,${imgBase64.data}`;
        setABC(imgBase64.data);
    }

    const postMessage = (news) => {
        axios.post(`${Constants.APIBaseUrl}/wechat/add`, {
            "author": news.author,
            "name": news.title,
            "text": news.digest,
            "poster": news.thumb_url,
            "wechatMediaId": news.thumb_media_id,
            "wechatUrl": news.url
        }, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            debugger;
            notification.open({
                message: res.data.Message,
                description:
                res.data.Message,
                onClick: () => {
                    //console.log('Notification Clicked!');
                },
                duration: 2
            });
        });
    }

    // const getList = (token) => {
    //     axios.post(`https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${token}`, {
    //             "type":"news",
    //             "offset":0,
    //             "count":10
    //     }, {
    //         headers: { 'Content-Type': 'application/json' }
    //     }).then(res=>{
    //         debugger;
    //         let news = res.data.item.map(news => {
    //             return { ...news.content.news_item, key: news.media_id }
    //         })

    //         setNews(news);
    //     });
    // }

    return (
        <React.Fragment>          
             <Table columns={columns} dataSource={news} 
            // pagination={{
            //     showSizeChanger: true,
            //     showQuickJumper: true,
            //     current: pagination.current,
            //     pageSize: pagination.pageSize,
            //     total: pagination.total,
            //     onChange: onPaginationChange,
            //     onShowSizeChange: onShowSizeChange,
            //     showTotal: ((total) => {
            //         return `共 ${total} 条`;
            //       }),
            // }}
            />
        </React.Fragment>
    )
}

//export default withRouter(SiteGraphicMessageList)