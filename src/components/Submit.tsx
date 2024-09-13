import React, { useState, useEffect } from "react";
import { Table, Button, message, Tag, Space } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RentalList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [rentals, setRentals] = useState<any[]>([]);
  const [updating, setUpdating] = useState<number | null>(null);
  const navigate = useNavigate();

  // Fetch all rental records
  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      const token = localStorage.getItem("token"); // Get token
      try {
        const response = await axios.get("http://localhost:3000/rentals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRentals(response.data);
      } catch (error) {
        message.error("Failed to fetch rental records");
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  // Update rental status
  const updateStatus = async (rentalId: number, newStatus: string) => {
    setUpdating(rentalId);
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:3000/rentals/${rentalId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success(`Status updated to ${newStatus}`);
      setRentals((prevRentals) =>
        prevRentals.map((rental) =>
          rental.id === rentalId ? { ...rental, status: newStatus } : rental
        )
      );
    } catch (error) {
      message.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  // Table column configuration
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
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
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            disabled={record.status !== "new" || updating === record.id}
            onClick={() => updateStatus(record.id, "pending")}
          >
            Approve as Pending
          </Button>
          <Button
            type="default"
            disabled={record.status !== "pending" || updating === record.id}
            onClick={() => updateStatus(record.id, "accepted")}
          >
            Approve as Accepted
          </Button>
          <Button
            type="primary"
            danger
            disabled={record.status !== "pending" || updating === record.id}
            onClick={() => updateStatus(record.id, "rejected")}
          >
            Approve as Rejected
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Rental List</h2>
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

export default RentalList;
