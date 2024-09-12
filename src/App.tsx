import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import Login from "./components/Login";
import Register from "./components/Register";
import Protected from "./components/Protected";
import Submit from "./components/Submit";
import Home from "./components/Home";
import RentForm from "./components/RentForm"; // 引入租赁表单组件

const { Header, Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["/"]}>
            <Menu.Item key="home">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="login">
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="register">
              <Link to="/register">Register</Link>
            </Menu.Item>
            <Menu.Item key="protected">
              <Link to="/protected">Protected</Link>
            </Menu.Item>
            <Menu.Item key="submit">
              <Link to="/submit">Submit</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "50px", minHeight: "calc(100vh - 64px)" }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/protected" element={<Protected />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/rent/:id" element={<RentForm />} />{" "}
            {/* 新增租赁路由 */}
            <Route path="/" element={<Home />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
