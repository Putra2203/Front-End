import { Outlet } from "react-router-dom";
import Navbar from "./components1/Navbar";
import { Footer } from "./components1";

const LayoutWithNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default LayoutWithNavbar;
