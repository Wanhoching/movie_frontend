import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  message,
  Typography,
  Input,
  Select,
  Button,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 使用 useNavigate 代替 useHistory

const { Title } = Typography;
const { Option } = Select;

interface Video {
  id: number;
  name: string;
  status: string;
  description: string;
  video: string;
}

const Home: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const navigate = useNavigate(); // 使用 useNavigate 代替 useHistory

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/videos", {
        params: {
          name: nameFilter,
          status: statusFilter,
        },
      });
      setVideos(response.data.data);
    } catch (error) {
      message.error("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [nameFilter, statusFilter]);

  const handleRent = (videoId: number) => {
    // 跳转至租赁表单页面，假设路由为 /rent/:id
    navigate(`/rent/${videoId}`);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
      {/* 搜索框 */}
      <Input
        placeholder="Search by name"
        onChange={(e) => setNameFilter(e.target.value)}
        style={{
          marginBottom: 20,
          width: "100%",
          borderRadius: "10px",
          border: "1px solid #1890ff",
          fontSize: "16px",
        }}
        onFocus={(e) =>
          (e.target.style.boxShadow = "0 4px 12px rgba(24, 144, 255, 0.3)")
        }
        onBlur={(e) =>
          (e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)")
        }
      />

      {/* 状态筛选 */}
      <Select
        placeholder="Filter by status"
        onChange={(value) => setStatusFilter(value)}
        style={{ marginBottom: 20, width: "100%", borderRadius: "8px" }}
        allowClear
      >
        <Option value="new">New</Option>
        <Option value="pending">Pending</Option>
        <Option value="accepted">Accepted</Option>
        <Option value="rejected">Rejected</Option>
      </Select>

      {/* 视频展示 */}
      <Row gutter={[16, 16]}>
        {videos.map((video) => (
          <Col xs={24} sm={12} md={8} lg={6} key={video.id}>
            <Card
              hoverable
              cover={
                <video
                  src={video.video}
                  controls
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              }
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Card.Meta
                title={
                  <span style={{ fontWeight: "bold", color: "#595959" }}>
                    {video.name}
                  </span>
                }
                description={
                  <span style={{ color: "#8c8c8c" }}>{video.description}</span>
                }
              />
              <div style={{ marginTop: 10, color: "#1890ff" }}>
                Status: {video.status}
              </div>
              {/* 租赁按钮 */}
              <Button
                type="primary"
                style={{ marginTop: 10 }}
                onClick={() => handleRent(video.id)}
              >
                租赁
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
