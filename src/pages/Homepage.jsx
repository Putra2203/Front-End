import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import imageCon from "../Assets/balaikota.png";
import penugasan from "../Assets/image_Buat Penugasan.svg";
import peserta from "../Assets/image_Peserta magang.svg";
import NavSidebar from "./NavSidebar";
import Footer1 from "./Footer1";


const Homepage = () => {
  const [nama, setNama] = useState("");
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleNavLinkClick = (path) => {
    setActiveLink(path);
  };

  useEffect(() => {
    refreshToken();
    setActiveLink(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "admin",
        },
      });
      const decoded = jwt_decode(response.data.token);
      setNama(decoded.nama);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      <NavSidebar />
      <div className="pl-64">
        <div className="container flex flex-col p-4">
          <div className="flex-grow">
            <div className="account-info-container">
              <div className="info-box">
                <div className="user-info">
                  <p className="user-info-1">Selamat Datang,</p>
                  <p className="user-info-1">{nama}</p>
                </div>
              </div>
            </div>

            <div className="image-container">
              <img className="background-home" src={imageCon} alt="" />
            </div>
          </div>

          <div className="action-buttons">
            <a href="/peserta">
              <img src={peserta} alt="" />
              <span>Peserta</span>
            </a>
            <a href="/penugasan">
              <img src={penugasan} alt="" />
              <span>Penugasan</span>
            </a>
          </div>
        </div>
      </div>
      <Footer1 />
    </div>
  );
};

export default Homepage;
