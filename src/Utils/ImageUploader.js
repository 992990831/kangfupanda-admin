import React from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Constants } from './Constants';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请选择JPG/PNG图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片不能大于2MB');
    }
    return isJpgOrPng && isLt2M;
  }
  
  class ImageUploader extends React.Component {
    state = {
      loading: false,
    };
  
    componentDidMount(){
    }

    componentWillReceiveProps(nextProp){
      if(nextProp.imageUrl && nextProp.imageUrl.urls && nextProp.imageUrl.urls[nextProp.imageUrl.index])
      {
        this.setState({
          imageUrl: nextProp.imageUrl.prefix + nextProp.imageUrl.urls[nextProp.imageUrl.index]
        });
      }
      
    }

    componentWillUpdate(nextProp){
    }

    handleChange = info => {
      if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl =>
          {
            this.setState({
              imageUrl,
              loading: false,
            });

            if (this.props.afterUpload) {
              this.props.afterUpload(info.file.response.Data);
            }
          }
        );        
      }
    };
  
    render() {
      
      const uploadButton = (
        <div>
          {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      const { imageUrl } = this.state;

      let uploadUrl = this.props.uploadUrl? this.props.uploadUrl : '/video/Upload';

      return (
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action= {`${Constants.APIBaseUrl}${uploadUrl}`}
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
        >
          {
          imageUrl ? 
          <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : 
          (
            this.props.defaultImage?
            <img src={`${Constants.ResourceUrl}${this.props.defaultImage}`} alt="avatar" style={{ width: '100%' }} /> :
            uploadButton
          
           )
          
          }
        </Upload>
      );
    }
  }

  export default ImageUploader;