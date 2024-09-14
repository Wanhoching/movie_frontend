import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddVideo: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // 存储视频 URL
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    if (!videoUrl) {
      message.error("Please upload a video file");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:3000/videos",
        {
          name: values.name,
          description: values.description,
          video: videoUrl, // 使用上传的文件的 URL
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Video created successfully!");
      navigate("/"); // 提交后跳转到首页
    } catch (error) {
      message.error("Failed to create video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 处理上传成功的回调
  const handleUploadChange = (info: any) => {
    if (info.file.status === "done") {
      // 上传成功后，获取返回的文件 URL
      const response = info.file.response;
      setVideoUrl(response.url); // 假设后端返回的 URL 在 response.url 中
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Add New Video</h2>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Video Name"
          name="name"
          rules={[{ required: true, message: "Please enter video name" }]}
        >
          <Input placeholder="Enter video name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>

        <Form.Item label="Upload Video">
          <Upload
            action="http://localhost:3000/upload" // 上传文件的后端接口
            headers={{
              Authorization: `Bearer ${localStorage.getItem("token")}`, // 使用 token 验证
            }}
            onChange={handleUploadChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select Video</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Add Video
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddVideo;
