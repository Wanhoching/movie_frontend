import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import Login from "./components/Login";
import Register from "./components/Register";
import Protected from "./components/Protected";
import RentalManager from "./components/RentalManager";
import Home from "./components/Home";
import RentForm from "./components/RentForm";
import UserRental from "./components/UserRental";
import Message from "./components/Message";
import AdminMessage from "./components/AdminMessage";

const { Header, Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["/"]}>
            <Menu.Item key="home">
              <Link to="/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="protected">
              <Link to="/userRent">Rent</Link>
            </Menu.Item>
            <Menu.Item key="submit">
              <Link to="/submit">Submit</Link>
            </Menu.Item>
            <Menu.Item key="message">
              <Link to="/Message">Message</Link>
            </Menu.Item>
            <Menu.Item key="logout">
              <Link to="/login">Logout</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "50px", minHeight: "calc(100vh - 64px)" }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Protected />} />
            <Route path="/RentalManager" element={<RentalManager />} />
            <Route path="/rent/:id" element={<RentForm />} />
            <Route path="/userRent" element={<UserRental />} />
            <Route path="/" element={<Home />} />
            <Route path="/Message" element={<Message />} />
            <Route path="/AdminMessage" element={<AdminMessage />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
