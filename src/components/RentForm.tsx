import React, { useState } from "react";
import { Form, Input, Button, DatePicker, message, Card } from "antd";
import { useNavigate } from "react-router-dom";

const RentForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("租赁请求提交成功！");
      navigate("/"); // 提交后跳转回首页
    }, 2000);
  };

  return (
    <Card title="租赁表单" style={{ maxWidth: 600, margin: "0 auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="租赁人姓名"
          name="name"
          rules={[{ required: true, message: "请输入租赁人姓名" }]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>

        <Form.Item
          label="租赁日期"
          name="date"
          rules={[{ required: true, message: "请选择租赁日期" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="租赁时长(天)"
          name="duration"
          rules={[{ required: true, message: "请输入租赁时长" }]}
        >
          <Input placeholder="请输入租赁时长" type="number" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RentForm;
