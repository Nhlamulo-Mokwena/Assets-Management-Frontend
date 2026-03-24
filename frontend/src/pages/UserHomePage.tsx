import React from "react";
import Sidebar from "../components/SideBar";
import EmployeeDashboard from "./EmployeeDashboard";
import AdminDashboard from "./AdminDashboard";
import { useAuth } from "../auth/useAuth";

const UserHomePage = () => {
  const { role } = useAuth();

  const renderDashboard = () => {
    switch (role) {
      case "admin":
        return <AdminDashboard />;
      case "employee":
        return <EmployeeDashboard />;
      default:
        return <div>Unauthorized</div>;
    }
  };

  return <div>{renderDashboard()}</div>;
};

export default UserHomePage;
