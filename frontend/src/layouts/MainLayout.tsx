import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default MainLayout;
