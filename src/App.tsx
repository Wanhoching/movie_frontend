import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import Login from "./components/Login";
import Register from "./components/Register";
import Protected from "./components/Protected";
import RentalManager from "./components/RentalManager";
import Home from "./components/Home";
import RentForm from "./components/RentForm";
import UserRental from "./components/UserRental";
import Message from "./components/Message";
import AddVideo from "./components/AddVideo";
import AdminMessage from "./components/AdminMessage";

const { Header, Content } = Layout;

const AppContent: React.FC = () => {
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const navigate = useNavigate(); // 使用 useNavigate

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
    navigate("/login"); // 登出后跳转至登录页
  };

  const renderNavbar = () => {
    if (!role) return null; // 如果没有角色，隐藏Navbar

    return (
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["/"]}>
          <Menu.Item key="home">
            <Link to="/home">Home</Link>
          </Menu.Item>
          {role === "staff" && (
            <>
              <Menu.Item key="Videos">
                <Link to="/">Videos Manager</Link>
              </Menu.Item>
              <Menu.Item key="submit">
                <Link to="/submit">Submit</Link>
              </Menu.Item>
              <Menu.Item key="RentalManager">
                <Link to="/RentalManager">Rental Manager</Link>
              </Menu.Item>
              <Menu.Item key="AdminMessage">
                <Link to="/AdminMessage">Admin Message</Link>
              </Menu.Item>
            </>
          )}
          {role === "public" && (
            <>
              <Menu.Item key="protected">
                <Link to="/userRent">Rent</Link>
              </Menu.Item>
              <Menu.Item key="message">
                <Link to="/Message">Message</Link>
              </Menu.Item>
            </>
          )}
          <Menu.Item key="logout">
            <a onClick={handleLogout}>Logout</a>
          </Menu.Item>
        </Menu>
      </Header>
    );
  };

  return (
    <Layout>
      {/* 检查当前路径，仅在 /login 和 /register 页面隐藏 Navbar */}
      {!["/login", "/register"].includes(window.location.pathname) &&
        renderNavbar()}

      <Content style={{ padding: "50px", minHeight: "calc(100vh - 64px)" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Protected />} />
          <Route path="/RentalManager" element={<RentalManager />} />
          <Route path="/rent/:id" element={<RentForm />} />
          <Route path="/submit" element={<AddVideo />} />
          <Route path="/userRent" element={<UserRental />} />
          <Route path="/" element={<Home />} />
          <Route path="/Message" element={<Message />} />
          <Route path="/AdminMessage" element={<AdminMessage />} />
        </Routes>
      </Content>
    </Layout>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
