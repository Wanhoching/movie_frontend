import React, { useEffect, useState } from "react";
import { Table, message, Card, Typography, Input, Select } from "antd";
import axios from "axios";
import "./Home.css"; // 引入自定义样式

const { Title } = Typography;
const { Option } = Select;

// Define the application data structure
interface Application {
  id: number;
  name: string;
  status: string;
  description: string;
  video: string;
}

const Home: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nameFilter, setNameFilter] = useState<string>(""); // Search by name
  const [statusFilter, setStatusFilter] = useState<string>(""); // Filter by status
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page
  const [pageSize, setPageSize] = useState<number>(5); // Page size
  const [total, setTotal] = useState<number>(0); // Total records

  // Fetch applications data from the backend
  const fetchApplications = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/videos", {
        params: {
          name: nameFilter,
          status: statusFilter,
          page,
          pageSize,
        },
      });
      setApplications(response.data.data); // Store the data in state
      setTotal(response.data.total); // Set total number of records
      // message.success("Applications fetched successfully");
    } catch (error) {
      message.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(currentPage, pageSize);
  }, [nameFilter, statusFilter, currentPage, pageSize]); // Refetch when filters or pagination change

  // Define columns for the table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Video",
      dataIndex: "video",
      key: "video",
      render: (text: string) => <a href={text}>View Video</a>, // Renders as a link
    },
  ];

  return (
    <div className="home-container">
      <Card className="home-card" bordered={true}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
          Applications List
        </Title>

        {/* Filter by name */}
        <Input
          placeholder="Search by name"
          onChange={(e) => setNameFilter(e.target.value)}
          style={{ marginBottom: 20, width: "100%" }}
        />

        {/* Filter by status */}
        <Select
          placeholder="Filter by status"
          onChange={(value) => setStatusFilter(value)}
          style={{ marginBottom: 20, width: "100%" }}
          allowClear
        >
          <Option value="new">New</Option>
          <Option value="pending">Pending</Option>
          <Option value="accepted">Accepted</Option>
          <Option value="rejected">Rejected</Option>
        </Select>

        <Table
          columns={columns}
          dataSource={applications}
          loading={loading}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>
    </div>
  );
};

export default Home;
