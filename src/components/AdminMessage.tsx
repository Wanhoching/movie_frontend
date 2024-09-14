import React, { useState, useEffect } from "react";
import { List, Input, Button, message, Form, Card } from "antd";
import axios from "axios";

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [replies, setReplies] = useState<{ [key: number]: string }>({});
  const [activeReply, setActiveReply] = useState<number | null>(null); // 控制哪个消息显示回复框
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
    const reply = replies[messageId]; // 获取当前消息的回复内容
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
      setReplies({ ...replies, [messageId]: "" });
      setActiveReply(null);
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
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Admin Message Replies
      </h2>
      <List
        grid={{ gutter: 16, column: 1 }} // 控制布局
        dataSource={messages}
        renderItem={(item: any) => (
          <List.Item>
            <Card
              title={`User: ${item.username}`}
              bordered
              style={{ width: "100%" }}
            >
              <p>
                <strong>User Message:</strong> {item.message}
              </p>
              <p>
                <strong>Admin Reply:</strong>{" "}
                {item.admin_reply || "No reply yet"}
              </p>
              {/* 仅当点击了 Reply 按钮时显示输入框 */}
              {activeReply === item.id ? (
                <Form layout="vertical">
                  <Form.Item label="Reply">
                    <Input.TextArea
                      rows={3}
                      value={replies[item.id] || ""}
                      onChange={(e) =>
                        setReplies({ ...replies, [item.id]: e.target.value })
                      }
                      placeholder="Enter your reply here"
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() => handleReply(item.id)}
                    loading={loading}
                    block
                  >
                    Send Reply
                  </Button>
                  <Button
                    style={{ marginTop: "10px" }}
                    onClick={() => setActiveReply(null)} // 取消回复
                    block
                  >
                    Cancel
                  </Button>
                </Form>
              ) : (
                <Button
                  type="default"
                  onClick={() => setActiveReply(item.id)} // 点击显示回复框
                  block
                >
                  Reply
                </Button>
              )}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default AdminMessages;
