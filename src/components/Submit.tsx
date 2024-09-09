// src/components/SubmitApplication.tsx
import React, { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import axios from "axios";

const SubmitApplication: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // Handle form submission
  const onFinish = async (values: { item: string; description: string }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // 假设 token 存储在 localStorage 中
      const response = await axios.post(
        "http://localhost:3000/applications",
        {
          item: values.item,
          description: values.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 使用 JWT token 进行身份验证
          },
        }
      );
      message.success("Application submitted successfully!");
    } catch (error) {
      message.error("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="application-form-container"
      style={{ maxWidth: 600, margin: "50px auto" }}
    >
      <Card bordered={true} title="Submit Rental Application">
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ item: "", description: "" }}
        >
          {/* Item input */}
          <Form.Item
            label="Item"
            name="item"
            rules={[
              {
                required: true,
                message: "Please enter the item you want to rent!",
              },
            ]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>

          {/* Description input */}
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter a description for the rental item"
            />
          </Form.Item>

          {/* Submit button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit Application
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SubmitApplication;
