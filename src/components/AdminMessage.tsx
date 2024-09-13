import React, { useState, useEffect } from "react";
import { List, Input, Button, message, Form } from "antd";
import axios from "axios";

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 获取所有用户的消息
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:3000/admin/messages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        message.error("Failed to fetch messages");
      }
    };

    fetchMessages();
  }, []);

  // 回复消息
  const handleReply = async (messageId: number) => {
    if (!reply) return;

    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/messages/${messageId}/reply`,
        { admin_reply: reply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Reply sent successfully!");
      setReply("");
      // Refresh the messages list
      const response = await axios.get("http://localhost:3000/admin/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      message.error("Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Message Replies</h2>
      <List
        bordered
        dataSource={messages}
        renderItem={(item: any) => (
          <List.Item>
            <div>
              <strong>User Message:</strong> {item.message}
              <br />
              <strong>Admin Reply:</strong> {item.admin_reply || "No reply yet"}
              <br />
              <Form layout="vertical">
                <Form.Item label="Reply">
                  <Input.TextArea
                    rows={4}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  onClick={() => handleReply(item.id)}
                  loading={loading}
                >
                  Send Reply
                </Button>
              </Form>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default AdminMessages;
