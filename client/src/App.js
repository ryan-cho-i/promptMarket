import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Routes, Route, Navigate } from "react-router-dom";

import ToolBar from "./components/ToolBar";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ImagePage from "./pages/ImagePage";

function App() {
  return (
    <>
      <ToastContainer />
      <ToolBar />
      <div style={{ maxWidth: 600, margin: "auto" }}>
        <Routes>
          <Route path="/images/:imageId" element={<ImagePage />}></Route>
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          {/* To keep the history clean, you should set replace prop. */}
        </Routes>
      </div>
    </>
  );
}

export default App;
