import React from 'react';
import { Button, Upload, message } from 'antd';
import { Constants } from './Constants';

import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

class VideoUpload extends React.Component {
  handleChange = ({ file, fileList }) => {
    //let fileList = [...info.fileList];

    // 1.限制上传文件
    fileList = fileList.slice(-1);

    // 2. 读取返回数据
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = file.response.Data;
      }
      return file;
    });

    if (fileList && fileList.length > 0 && fileList[0].status === "done") {//fileList.length > 0 && fileList[0].url) {
      if (this.props.afterUpload) {
        this.props.afterUpload(file.response.Data);
      }
    }

  }
  render() {
    
    let uploadUrl = this.props.uploadUrl? this.props.uploadUrl : '/video/Upload';

    const props = {
      action: `${Constants.APIBaseUrl}${uploadUrl}`,
      onChange: this.handleChange,
      defaultFileList: [
      ],
      showUploadList: {
        showDownloadIcon: true,
        downloadIcon: 'download ',
        showRemoveIcon: true,
        removeIcon: <DeleteOutlined onClick={e => console.log(e, 'custom removeIcon event')} />,
      },
    };

    //进行中
    return (
      <Upload {...props}>
        <Button>
          <UploadOutlined /> Upload
          </Button>
      </Upload>
    );
  }
}

export default VideoUpload;