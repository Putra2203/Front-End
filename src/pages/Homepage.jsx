import React, { useState, useEffect } from "react";
import { axiosJWTadmin } from "../config/axiosJWT";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../Assets/diskominfo.png";
import Footer from "./footer";
import "../Components/SideBar/Navbar.css";
import "../Components/SideBar/Sidebar.css";
import "./Homestyle.css";
import { TabTitle } from "../TabName";

const Homepage = () => {
  TabTitle("Homepage");
  const [nama, setNama] = useState("");
  const [fotoProfil, setFotoProfil] = useState("");
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  //jumlah total attendance
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers();
    const today = new Date().toISOString().slice(0, 10);
    setSearchDate(today);
  }, []);

  useEffect(() => {
    getUsers();
  }, [searchDate]);

  const getUsers = async () => {
    setLoading(true);
    const url = searchDate
      ? `http://localhost:3000/admin/presensi?tanggal=${searchDate}`
      : "http://localhost:3000/admin/presensi";

    try {
      const response = await axiosJWTadmin.get(url);
      setTotalAttendance(response.data.totalSudahPresensi);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavLinkClick = (path) => {
    setActiveLink(path);
  };

  useEffect(() => {
    refreshToken();
    setActiveLink(location.pathname);
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
      setFotoProfil(decoded.foto_profil); // Menyimpan foto profil ke state
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  return (
    <div className="body-main">
      <div className={`body-area${showNav ? " body-pd" : ""}`}>
        <header className={`header${showNav ? " body-pd" : ""}`}>
          <div className="header_toggle"></div>
          <div className="header_img"></div>
        </header>
        <div className={`sidebar${showNav ? " open" : ""}`}>
          <div className="logo-details">
            <i className="bx bxl-c-plus-plus icon"></i>
            <a href="/homepage" target="_self" className="logo_name">
              <img
                src={logo}
                alt=""
                style={{ width: "120px", height: "auto" }}
              />
            </a>
            <i
              className="bi-list"
              id="btn"
              onClick={() => setShowNav(!showNav)}
            ></i>
          </div>
          <ul className="nav-list">
            <div>
              <img src={fotoProfil} alt="" />
              <h1>CEK {nama}</h1>
            </div>
            <li>
              <a
                href="homepage"
                onClick={() => handleNavLinkClick("homepage")}
                className={activeLink === "homepage" ? " active" : ""}
              >
                <i className="bi bi-house nav_icon" />
                <span className="links_name">Home</span>
              </a>
              <span className="tooltip">Home</span>
            </li>
            <li>
              <a
                href="admin"
                onClick={() => handleNavLinkClick("admin")}
                className={activeLink === "admin" ? " active" : ""}
              >
                <i className="bi bi-person-check-fill nav_icon" />
                <span className="links_name">Admin</span>
              </a>
              <span className="tooltip">Admin</span>
            </li>
            <li>
              <a
                href="peserta"
                onClick={() => handleNavLinkClick("peserta")}
                className={activeLink === "peserta" ? " active" : ""}
              >
                <i className="bi bi-person nav_icon" />
                <span className="links_name">Peserta</span>
              </a>
              <span className="tooltip">Peserta</span>
            </li>
            <li>
              <a
                href="presensi"
                onClick={() => handleNavLinkClick("presensi")}
                className={activeLink === "presensi" ? " active" : ""}
              >
                <i className="bi bi-person-check nav_icon" />
                <span className="links_name">Presensi Magang</span>
              </a>
              <span className="tooltip">Presensi Magang</span>
            </li>
            <li>
              <a
                href="penugasan"
                onClick={() => handleNavLinkClick("penugasan")}
                className={activeLink === "penugasan" ? " active" : ""}
              >
                <i className="bi bi-list-task nav_icon" />
                <span className="links_name">Penugasan</span>
              </a>
              <span className="tooltip">Penugasan</span>
            </li>
            <li>
              <a
                href="profile"
                onClick={() => handleNavLinkClick("profile")}
                className={activeLink === "profile" ? " active" : ""}
              >
                <i className="bi bi-person nav_icon" />
                <span className="links_name">Profile</span>
              </a>
              <span className="tooltip">Profile</span>
            </li>
            <li className="profile">
              <a
                href="/"
                onClick={() => handleNavLinkClick("/")}
                className="sign-out"
              >
                <i className="bi bi-box-arrow-left nav_icon"></i>
                <span className="links_name">Sign Out</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="home-section">
          <div className="homepage-container">
            <h1 className="poppins-semibold">Dashboard - SISAPPMA</h1>
            <div className="userdata-1">
              <div className="userdata-wrapper">
                <h3>Jumlah Mahasiswa Absen Hari ini</h3>
                <p>{totalAttendance}</p>
              </div>
              <div className="userdata-wrapper">
                <h3>Jumlah Mahasiswa Absen Hari ini</h3>
                <p>//jumlah</p>
              </div>
              <div className="userdata-wrapper">
                <h3>Jumlah Mahasiswa Absen Hari ini</h3>
                <p>//jumlah</p>
              </div>
            </div>

            <h1 className="poppins-semibold">Data Penugasan</h1>
            <div className="table-contaiener">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Ketua Kelompok</th>
                    <th>Judul</th>
                    <th>Deskripsi</th>
                    <th>Dateline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Erdin Purwa Putra</td>
                    <td>SISAPPMA</td>
                    <td>
                      Nemo excepturi repellat voluptatum cum, quibusdam, culpa
                      perferendis sit iure inventore modi ea incidunt voluptas
                      deserunt
                    </td>
                    <td>0209209</td>
                  </tr>
                  <tr>
                    <td>Putra</td>
                    <td>SISAPPMA</td>
                    <td>
                      perferendis sit iure inventore modi ea incidunt voluptas
                      deserunt voluptatibus autem placeat nam, totam adipisci.
                    </td>
                    <td>0209209</td>
                  </tr>
                  <tr>
                    <td>Putra</td>
                    <td>SISAPPMA</td>
                    <td>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Nemo excepturi
                    </td>
                    <td>0209209</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h1 className="poppins-semibold">Data Absensi</h1>
            <div className="table-contaiener">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Instansi</th>
                    <th>Persentase Kehadiran</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Putra</td>
                    <td>SISAPPMA</td>
                    <td>
                      Nemo excepturi repellat voluptatum cum, quibusdam, culpa
                      perferendis sit iure inventore modi ea incidunt voluptas
                      deserunt
                    </td>
                    <td>0209209</td>
                  </tr>
                  <tr>
                    <td>Putra</td>
                    <td>SISAPPMA</td>
                    <td>
                      perferendis sit iure inventore modi ea incidunt voluptas
                      deserunt voluptatibus autem placeat nam, totam adipisci.
                    </td>
                    <td>0209209</td>
                  </tr>
                  <tr>
                    <td>Putra</td>
                    <td>SISAPPMA</td>
                    <td>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Nemo excepturi
                    </td>
                    <td>0209209</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;
