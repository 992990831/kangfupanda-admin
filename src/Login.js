import React, { useRef,forwardRef,useImperativeHandle  } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { createHashHistory } from 'history';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login = forwardRef((props, ref) => {
  
  const addFormRef = useRef();

  useImperativeHandle(ref, () => ({

    onLogin(){
      var values = addFormRef.current.getFieldsValue();
      if(values.name != 'admin' || values.password != 'kfp123')
      {
        return false;
      }
  
      return true;
    }
  

  }));
  
  const onFinish = values => {
    debugger;

    var values = addFormRef.getFieldsValue();
    if(values.name != 'admin' || values.password != 'kfp123')
    {
      return false;

    }

    console.log('Success:', values);
    const history = createHashHistory();
    history.push('/videolist');
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form ref={addFormRef}
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="用户名"
        name="name"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password />
      </Form.Item>
    </Form>
  );
});

export default Login;