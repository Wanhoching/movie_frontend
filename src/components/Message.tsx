import React, { useState, useEffect } from "react";
import { Form, Input, Button, List, message } from "antd";
import axios from "axios";

const Communication: React.FC = () => {
  const [userMessages, setUserMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 获取用户的消息
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:3000/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserMessages(response.data);
      } catch (error) {
        // message.error("Failed to fetch messages");
      }
    };

    fetchMessages();
  }, []);

  // 发送新消息
  const handleSendMessage = async () => {
    if (!newMessage) return;
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3000/messages",
        { message: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Message sent successfully!");
      setNewMessage("");
      // Fetch messages again to display the new one
      const response = await axios.get("http://localhost:3000/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserMessages(response.data);
    } catch (error) {
      message.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Message Communication</h2>

      <List
        header={<div>Your Messages</div>}
        bordered
        dataSource={userMessages}
        renderItem={(item: any) => (
          <List.Item>
            <div>
              <strong>Your Message:</strong> {item.message}
              <br />
              {item.admin_reply && (
                <>
                  <strong>Admin Reply:</strong> {item.admin_reply}
                </>
              )}
            </div>
          </List.Item>
        )}
      />

      <Form layout="vertical" style={{ marginTop: "20px" }}>
        <Form.Item label="New Message">
          <Input.TextArea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={4}
            placeholder="Enter your message here"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSendMessage} loading={loading}>
            Send Message
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Communication;
