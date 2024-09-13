import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, DatePicker } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"; // 导入插件

dayjs.extend(customParseFormat);

const RentForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [videoName, setVideoName] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/videos/${id}`);
        setVideoName(response.data.name);
      } catch (error) {
        message.error("Failed to fetch video details.");
      }
    };
    fetchVideoDetails();
  }, [id]);

  const onFinish = async (values: any) => {
    setLoading(true);
    const token = localStorage.getItem("token"); // 从 localStorage 获取 token
    try {
      await axios.post(
        "http://localhost:3000/rentals",
        {
          video_id: id,
          rental_date: values.rentalDate.format("YYYY-MM-DD"),
          description: values.description,
          status: "new",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 设置 Authorization header
          },
        }
      );
      message.success("租赁申请提交成功！");
      navigate("/");
    } catch (error) {
      message.error("提交失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>租赁视频: {videoName}</h2>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="租赁描述"
            name="description"
            rules={[{ required: true, message: "请输入租赁描述" }]}
          >
            <Input.TextArea placeholder="输入租赁描述" rows={4} />
          </Form.Item>

          <Form.Item
            label="选择租赁日期"
            name="rentalDate"
            rules={[{ required: true, message: "请选择租赁日期" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              placeholder="选择租赁日期"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              提交申请
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RentForm;
