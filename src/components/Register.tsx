// src/components/Register.tsx
import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const Register: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (values: {
    username: string;
    email: string;
    password: string;
    code?: string;
  }) => {
    setLoading(true);
    const role = values.code === "9999" ? "staff" : "public"; // 根据输入的code决定角色
    try {
      await axios.post("http://localhost:3000/register", {
        username: values.username,
        email: values.email,
        password: values.password,
        role,
      });
      message.success("Registration successful!");
    } catch (error) {
      message.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2 style={{ textAlign: "center" }}>Register</h2>
      <Form onFinish={handleRegister}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="code"
          // 移除必填规则，使其成为可选字段
        >
          <Input placeholder="Enter registration code (optional)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Register
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: "center" }}>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
