// src/components/Protected.tsx
import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Protected: React.FC = () => {
  const [messageText, setMessageText] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/protected", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMessageText(response.data.message);
      })
      .catch((error) => {
        message.error("Access denied. Please log in.");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    message.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h2>{messageText || "Protected Page"}</h2>
      <Button type="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Protected;
