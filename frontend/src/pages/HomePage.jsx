import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { isUserRegistered } = useSelector((state) => state.user.userState);

  return isUserRegistered ? <Outlet /> : <Navigate to="/register" />;
};

export default HomePage;
