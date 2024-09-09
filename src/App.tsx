// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Protected from "./components/Protected";
import Submit from "./components/Submit";

import Home from "./components/Home"; // Import the Home component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/protected" element={<Protected />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/" element={<Home />} /> {/* Home route */}
      </Routes>
    </Router>
  );
};

export default App;
