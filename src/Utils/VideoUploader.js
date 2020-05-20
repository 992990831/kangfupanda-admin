import React from 'react';
import { Button,Upload, message } from 'antd';
import { Constants } from './Constants';

import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

class VideoUpload extends React.Component {
    render() {
      const props = {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange({ file, fileList }) {
          if (file.status !== 'uploading') {
            console.log(file, fileList);
          }
        },
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