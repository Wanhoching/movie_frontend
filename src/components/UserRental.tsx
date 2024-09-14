import React, { useState, useEffect } from "react";
import { Table, Tag, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserRentalList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [rentals, setRentals] = useState<any[]>([]);
  const navigate = useNavigate();

  // 获取当前用户的租赁记录
  useEffect(() => {
    const fetchUserRentals = async () => {
      setLoading(true);
      const token = localStorage.getItem("token"); // 获取 token
      try {
        const response = await axios.get("http://localhost:3000/user/rentals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRentals(response.data);
      } catch (error) {
        // message.e  rror("Failed to fetch rental records");
      } finally {
        setLoading(false);
      }
    };
    fetchUserRentals();
  }, []);

  // 表格的列配置
  const columns = [
    {
      title: "Video Name",
      dataIndex: "video_name",
      key: "video_name",
    },
    {
      title: "Rental Date",
      dataIndex: "rental_date",
      key: "rental_date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "pending") color = "orange";
        if (status === "accepted") color = "green";
        if (status === "rejected") color = "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Rental Records</h2>
      <Table
        columns={columns}
        dataSource={rentals}
        rowKey="id"
        loading={loading}
        bordered
      />
    </div>
  );
};

export default UserRentalList;
