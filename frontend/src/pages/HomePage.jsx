import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {
  const isRegistered = useSelector((state) => state.user.isRegistered);
  return isRegistered ? <Outlet /> : <Navigate to="/register" />;
};

export default HomePage;
