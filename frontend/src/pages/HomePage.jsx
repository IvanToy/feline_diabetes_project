import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { isRegistered } = useSelector((state) => state.user.userData);

  return isRegistered ? <Outlet /> : <Navigate to="/register" />;
};

export default HomePage;
