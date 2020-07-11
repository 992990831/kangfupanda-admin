import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom'
import { Row, Col, Button, Table, Form, List, Divider, Modal, AutoComplete, Tag, Space, Select, Input, notification, Popconfirm } from 'antd';
import './GraphicMessage.css';

import ImageUploader from '../Utils/ImageUploader';
import AudioUploader from '../Utils/AudioUploader';
import { Constants } from '../Utils/Constants';

import axios from 'axios';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import ImageCropper from '../Utils/ImageCropper';

const { TextArea } = Input;
const { CheckableTag } = Tag;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

function GraphicMessageList() {
    const columns = [
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author',
            render: text => <a>{text}</a>,
        },
        {
            title: '标题',
            key: 'name',
            dataIndex: 'name',
            render: text => {
                let subText = text?  (text.length > 50 ? text.substring(0, 50) : text) : '无标题';
                return <span>{subText}</span>
            }
        },
        {
            title: '封面',
            dataIndex: 'poster',
            key: 'poster',
            render: poster => (
                <>
                    <img src={`data:image/jpeg;base64,${poster}`} alt="" className="graphicMessagePic" />
                </>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={(e) => {
                        EditGraphicMessage(record);
                        getSelectedTags(record.id);
                    }}>修改</a>
                    <Popconfirm title="确定删除?" onConfirm={() => {
                        DeleteGraphicMessage(record.id);
                    }}>
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const addFormRef = useRef();
    const [messages, setMessages] = useState([]);
    //缓存封面照
    const [poster, setPoster] = useState('');
    //用来缓存添加、修改界面的6个图片
    const [pics, setPics] = useState(['', '', '', '', '', '',]);
    const [audioes, setAudioes] = useState(['', '', '']);
    const [showAdd, setShowAdd] = useState(false);
    // const [showEdit, setShowEdit] = useState(false);
    const [users, setUsers] = useState([]);
    const [editRecord, setEditRecord] = useState({showEdit:false});
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    //图片切割
    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({
        aspect: 1,
        width: 50,
        x: 0,
        y: 0
      });

    const [croppedImageUrl, setCroppedImageUrl] = useState('');

    //只在初始化时需要出发，所以第二个参数为空
    useEffect(() => {
        getList();
        GetUserList();
        getTags();

        if(editRecord.showEdit)
        {
            FillEditForm();
        }

    }, [editRecord])

    const getTags=()=>{
        axios(`${Constants.APIBaseUrl}/tag/list?pageIndex=1&pageSize=999`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            let tags = res.data.list.map(tag => {
                return { ...tag, key: tag.id }
            })
            setTags(tags);
        })
    }

    const getSelectedTags=(graphicId)=>{
        axios(`${Constants.APIBaseUrl}/tagxgraphic/selected?graphicId=${graphicId}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            let tags = res.data.map(tag => {
                return tag.tagtext
            })
            setSelectedTags(tags);
        })
    }


    const getList = () => {
        axios(`${Constants.APIBaseUrl}/message/list`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            let msgs = res.data.map(msg => {
                return { ...msg, key: msg.id }
            })
            setMessages(msgs);
        })
    }

    const GetUserList = () => {
        axios.get(`${Constants.APIBaseUrl}/user/list`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                let users = res.data.map(user => {
                    return { ...user, key: user.id, value: user.nickName };
                })

                setUsers(users);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const showAddForm = () => {
        setShowAdd(true);
    }

    const handleCancel = () => {
        ClearForm();
        setShowAdd(false);
        setEditRecord({showEdit:false});
    }

    const handleOk = () => {
        var values = addFormRef.current.getFieldsValue();

        try
        {
            
            let addResult = addGraphicMessage(values);
            addResult.then( res =>{
                addTags(res.data.Data);
                ClearForm();
                setShowAdd(false);
                setEditRecord({ showEdit: false });
                getList();
            } )
            
        }
        catch(error){
            console.log(error);
            ClearForm();
            setShowAdd(false);
            notification.open({
                message: '保存失败',
                description:
                    '保存图文失败',
                onClick: () => {
                    //console.log('Notification Clicked!');
                },
                duration: 3
            });
        }
        
    }

    const addGraphicMessage = async (values) => {
        let body = {
            id: values.id,
            author: values.author,
            name: values.name,
            text: values.text,
            poster: poster,
            pic01: pics[0],
            pic02: pics[1],
            pic03: pics[2],
            pic04: pics[3],
            pic05: pics[4],
            pic06: pics[5],
            audio01: audioes[0],
            audio02: audioes[1],
            audio03: audioes[2],
        }

        let openId = '';
        users.forEach((user) => {
            if (values.author == user.nickName) {
                openId = user.openId;
            }
        });

        body.openId = openId;

       let res = await axios.post(`${Constants.APIBaseUrl}/message/add`, body, {
            headers: { 'Content-Type': 'application/json' }
        });

        return res;
    }

    const addTags = async (graphicid) => {
        let tags = selectedTags.map(tag => {
            return { graphicid,  tagtext: tag};
        })

        await axios.delete(`${Constants.APIBaseUrl}/tagxgraphic/delete?graphicId=${graphicid}`);

        await axios.post(`${Constants.APIBaseUrl}/tagxgraphic/add`, tags)
    }

    //添加后清空表单值
    const ClearForm = () =>{
        setPics(['','','','','','']);
        setAudioes(['','','']);
        setSelectedTags([]);
        addFormRef.current.resetFields();
    }

    const DeleteGraphicMessage = (id) => {
        axios.delete(`${Constants.APIBaseUrl}/message/delete?id=${id}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                getList();
            })
            .catch(function (error) {
                notification.open({
                    message: '删除失败',
                    description:
                        '删除用图文失败',
                    onClick: () => {
                        //console.log('Notification Clicked!');
                    },
                    duration: 3
                });
            });
    }

    const EditGraphicMessage = (record) =>{
        setEditRecord({...record, showEdit:true });
    }

    const FillEditForm = () => {
        window.setTimeout(() => {

            pics[0] = editRecord.pic01;
            pics[1] = editRecord.pic02;
            pics[2] = editRecord.pic03;
            pics[3] = editRecord.pic04;
            pics[4] = editRecord.pic05;
            pics[5] = editRecord.pic06;
            setPics(pics);

            audioes[0] = editRecord.audio01;
            audioes[1] = editRecord.audio02;
            audioes[2] = editRecord.audio03;
            setAudioes(audioes);

            setPoster(`data:image/jpeg;base64,${editRecord.poster}`);

            addFormRef.current.setFieldsValue({
                id: editRecord.id,
                author: editRecord.author,
                name: editRecord.name,
                text: editRecord.text
            });          
        }, 500);
    }

    const handleAfterUploadImage01 = (pic) => {
        pics[0] = pic;
        setPics(pics);
    }
    const handleAfterUploadImage02 = (pic) => {
        pics[1] = pic;
        setPics(pics);
    }
    const handleAfterUploadImage03 = (pic) => {
        pics[2] = pic;
        setPics(pics);
    }
    const handleAfterUploadImage04 = (pic) => {
        pics[3] = pic;
        setPics(pics);
    }
    const handleAfterUploadImage05 = (pic) => {
        pics[4] = pic;
        setPics(pics);
    }
    const handleAfterUploadImage06 = (pic) => {
        pics[5] = pic;
        setPics(pics);
    }

    const handleAfterUploadAudio01 = (audio) => {
        audioes[0] = audio;
        setAudioes(audioes);
    }

    const handleAfterUploadAudio02 = (audio) => {
        audioes[1] = audio;
        setAudioes(audioes);
    }

    const handleAfterUploadAudio03 = (audio) => {
        audioes[2] = audio;
        setAudioes(audioes);
    }

    //图片切割
   const onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            debugger;
          const reader = new FileReader();
          reader.addEventListener("load", () =>
            setSrc({ src: reader.result })
          );
          console.log(reader.result);
          reader.readAsDataURL(e.target.files[0]);
        }
      };
    
      const onImageLoaded = (image, pixelCrop) => {
        //this.imageRef = image;
      };
    
      const   onCropComplete = (crop, pixelCrop) => {
        //this.makeClientCrop(crop, pixelCrop);
      };
    
      const onCropChange = crop => {
        setCrop({ crop });
      };
    
      const makeClientCrop = async (crop, pixelCrop) => {
        if (this.imageRef && crop.width && crop.height) {
          const croppedImageUrl = await this.getCroppedImg(
            this.imageRef,
            pixelCrop,
            "newFile.jpeg"
          );
          this.setState({ croppedImageUrl });
        }
      }
    
      const  getCroppedImg = (image, pixelCrop, fileName) => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");
    
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
    
        return new Promise((resolve, reject) => {
          canvas.toBlob(blob => {
            if (!blob) {
              //reject(new Error('Canvas is empty'));
              console.error("Canvas is empty");
              return;
            }
            blob.name = fileName;
            window.URL.revokeObjectURL(this.fileUrl);
            this.fileUrl = window.URL.createObjectURL(blob);
            resolve(this.fileUrl);
          }, "image/jpeg");
        });
      }
    

    return (
        <React.Fragment>
            <Row type="flex" justify='end'>
                <Col>
                    <Button type="primary" onClick={showAddForm}>添加</Button>
                </Col>
            </Row>
            {/* 为了简单起见，这里的分页是前端分页 */}
            {/* 分页控件参考：https://ant.design/components/pagination-cn/ */}
            <Table columns={columns} dataSource={messages} 
                pagination={{
                    showSizeChanger: true,
                    defaultCurrent: 1,
                    defaultPageSize: 50,
                    total: messages.length
                }}
            />
            <Modal
                title='添加图文'
                visible={showAdd || editRecord.showEdit}
                onCancel={()=>{
                    handleCancel();
                }}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" loading={false} onClick={handleOk}>
                        保存
                    </Button>,
                ]}
            >
                <Row>
                    <Col span={24}>
                        <Form ref={addFormRef} {...layout}>
                        <Form.Item
                                name="id"
                                label="id"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input readOnly={true} />
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
                                    options={users}
                                    placeholder="请输入用户昵称查找"
                                    filterOption={(inputValue, option) => {
                                        return option.nickName.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }

                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                name="name"
                                label="标题"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="tag"
                                label="标签"
                            >
                                <div>
                                    {
                                        tags.map(tag=>{
                                            return(
                                            <CheckableTag key={tag.id} 
                                            checked={selectedTags.indexOf(tag.text) > -1}
                                            onChange={checked => {
                                                const nextSelectedTags = checked ? [...selectedTags, tag.text] : selectedTags.filter(t => t !== tag.text);
                                                setSelectedTags(nextSelectedTags)
                                            }}
                                            style={{border:'solid grey 1px'}}>{tag.text}</CheckableTag>
                                            )
                                        })
                                    }
                                </div>
                            </Form.Item>
                            <Form.Item
                                name="text"
                                label="文字"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <TextArea rows={2} />
                            </Form.Item>
                            <Form.Item
                                name="headpic"
                                label="图片"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <List>
                                    <List.Item>
                                        <ImageUploader afterUpload={handleAfterUploadImage01} defaultImage={editRecord && editRecord.pic01? `${Constants.ResourceUrl}${editRecord.pic01}` : null}></ImageUploader>
                                        <ImageUploader afterUpload={handleAfterUploadImage02} defaultImage={editRecord && editRecord.pic02? `${Constants.ResourceUrl}${editRecord.pic02}` : null}></ImageUploader>
                                        <ImageUploader afterUpload={handleAfterUploadImage03} defaultImage={editRecord && editRecord.pic03? `${Constants.ResourceUrl}${editRecord.pic03}` : null}></ImageUploader>
                                    </List.Item>
                                    <List.Item>
                                        <ImageUploader afterUpload={handleAfterUploadImage04} defaultImage={editRecord && editRecord.pic04? `${Constants.ResourceUrl}${editRecord.pic04}` : null}></ImageUploader>
                                        <ImageUploader afterUpload={handleAfterUploadImage05} defaultImage={editRecord && editRecord.pic05? `${Constants.ResourceUrl}${editRecord.pic05}` : null}></ImageUploader>
                                        <ImageUploader afterUpload={handleAfterUploadImage06} defaultImage={editRecord && editRecord.pic06? `${Constants.ResourceUrl}${editRecord.pic06}` : null}></ImageUploader>
                                    </List.Item>
                                </List>


                            </Form.Item>
                            <Form.Item name='poster' label='封面'>
                                {/* <div>
                                    <input type="file" onChange={onSelectFile} />
                                </div>
                                {src && (
                                <ReactCrop
                                    src={src}
                                    crop={crop}
                                    onImageLoaded={onImageLoaded}
                                    onComplete={onCropComplete}
                                    onChange={onCropChange}
                                />
                                )} */}
                                {/* {croppedImageUrl && (
                                    <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
                                )} */}
                
                                <ImageCropper onCrop={(imgBase64)=>{
                                    setPoster(imgBase64);
                                }}
                                defaultImage={editRecord && editRecord.poster? `data:image/jpeg;base64,${editRecord.poster}`:''}
                                ></ImageCropper>
                            </Form.Item>
                            <Form.Item
                                name="audio"
                                label="音频"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <List>
                                    <List.Item>
                                        <AudioUploader afterUpload={handleAfterUploadAudio01} defaultAudio={editRecord.audio01}></AudioUploader>
                                    </List.Item>
                                    <List.Item>
                                        <AudioUploader afterUpload={handleAfterUploadAudio02} defaultAudio={editRecord.audio02}></AudioUploader>
                                    </List.Item>
                                    <List.Item>
                                        <AudioUploader afterUpload={handleAfterUploadAudio03} defaultAudio={editRecord.audio03}></AudioUploader>
                                    </List.Item>
                                </List>


                            </Form.Item>
                        </Form>

                    </Col>
                </Row>
            </Modal>
        </React.Fragment>
    )
}

export default withRouter(GraphicMessageList)


function CropDemo({ src }) {
    const [crop, setCrop] = useState({ aspect: 16 / 9 });
    return <ReactCrop src={src} crop={crop} onChange={newCrop => setCrop(newCrop)} />;
  }