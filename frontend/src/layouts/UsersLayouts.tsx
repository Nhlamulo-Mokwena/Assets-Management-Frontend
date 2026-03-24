import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "../components/SideBar";

const UsersLayouts = () => {
  return (
    <div>
      <Sidebar />
      <ToastContainer />
      <Outlet />
    </div>
  );
};

export default UsersLayouts;
