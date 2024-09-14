import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, DatePicker } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"; // Import plugin

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
    const token = localStorage.getItem("token"); // Get token from localStorage
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
            Authorization: `Bearer ${token}`, // Set Authorization header
          },
        }
      );
      message.success("Rental request submitted successfully!");
      navigate("/home");
    } catch (error) {
      message.error("Submission failed. Please try again later.");
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
        <h2 style={{ textAlign: "center" }}>Rent Video: {videoName}</h2>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Rental Description"
            name="description"
            rules={[
              { required: true, message: "Please enter a rental description" },
            ]}
          >
            <Input.TextArea placeholder="Enter rental description" rows={4} />
          </Form.Item>

          <Form.Item
            label="Select Rental Date"
            name="rentalDate"
            rules={[{ required: true, message: "Please select a rental date" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              placeholder="Select rental date"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Submit Rental Request
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RentForm;
