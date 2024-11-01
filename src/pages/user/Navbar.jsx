import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../images/logo.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { RiHomeOfficeFill, RiUserFollowFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { FaUserGroup, FaUserPen } from "react-icons/fa6";
import { GoTasklist } from "react-icons/go";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [profil, setProfil] = useState("");
  const [presensiFull, setPresensiFull] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/account/token", {
        headers: { role: "peserta_magang" },
      });
      const decoded = jwt_decode(response.data.token);
      setNama(decoded.nama);
      setProfil(decoded.foto_profil);
      await checkPresensiFull(decoded.userId); // Memanggil fungsi untuk mengecek kehadiran setelah mendapatkan userId
    } catch (error) {
      console.error("Error fetching token");
    }
  };

  const checkPresensiFull = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/user/presensi/${userId}`);
      const presensiData = response.data.presensi;

      // Hitung jumlah presensi lengkap
      const kehadiranLengkap = presensiData.filter(
        (item) => item.check_in && item.check_out
      ).length;

      const totalPresensi = presensiData.length;
      const kehadiranPercentage = (kehadiranLengkap / totalPresensi) * 100;
      setPresensiFull(kehadiranPercentage >= 75);
    } catch (error) {
      console.error("Error checking presensi status", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex">
      <div
        className={`fixed rounded-tr-3xl inset-y-0 left-0 z-50 w-64 bg-[#000126] text-white transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <img src={logo} alt="logo" className="w-40" />
            {isOpen && (
              <button onClick={toggleSidebar} className="text-white md:hidden">
                <IoClose size={20} />
              </button>
            )}
          </div>
          <div className="w-full h-[1px] bg-white mt-4"></div>
          <nav className="mt-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <img
                src={profil}
                alt="profil"
                className="object-cover w-32 h-32 rounded-full"
              />
              <h1>Hai, {nama}</h1>
            </div>
            <ul className="flex flex-col gap-5 my-4">
              <li
                className={`px-4 rounded-3xl ${
                  isActive("/user/homepage") ? "bg-white text-black" : "hover:bg-white hover:text-black"
                }`}
              >
                <Link to="/user/homepage" className="flex flex-row items-center gap-2 text-xl ">
                  <FaUserPen />
                  Home
                </Link>
              </li>
              <li
                className={`px-4 rounded-3xl ${
                  isActive("/user/riwayat") ? "bg-white text-black" : "hover:bg-white hover:text-black"
                }`}
              >
                <Link to="/user/riwayat" className="flex flex-row items-center gap-2 text-xl ">
                  <RiUserFollowFill />
                  History Presensi
                </Link>
              </li>
              <li
                className={`px-4 rounded-3xl ${
                  isActive("/user/presensi") ? "bg-white text-black" : "hover:bg-white hover:text-black"
                }`}
              >
                <Link to="/user/presensi" className="flex flex-row items-center gap-2 text-xl ">
                  <RiHomeOfficeFill />
                  Lakukan Presensi
                </Link>
              </li>
              <li
                className={`px-4 rounded-3xl ${
                  isActive("/user/tugas") ? "bg-white text-black" : "hover:bg-white hover:text-black"
                }`}
              >
                <Link to="/user/tugas" className="flex flex-row items-center gap-2 text-xl ">
                  <GoTasklist />
                  Penugasan
                </Link>
              </li>
              {presensiFull && (
                <li
                  className={`px-4 rounded-3xl ${
                    isActive("/user/surat") ? "bg-white text-black" : "hover:bg-white hover:text-black"
                  }`}
                >
                  <Link to="/user/surat" className="flex flex-row items-center gap-2 text-xl ">
                    <FaUser />
                    Persuratan
                  </Link>
                </li>
              )}
              <li
                className={`px-4 rounded-3xl ${
                  isActive("/user/profil") ? "bg-white text-black" : "hover:bg-white hover:text-black"
                }`}
              >
                <Link to="/user/profil" className="flex flex-row items-center gap-2 text-xl ">
                  <FaUserGroup />
                  Profil
                </Link>
              </li>
            </ul>
            <div className="fixed bottom-5 right-5">
              <button onClick={handleLogout} className="px-4 py-2 border-2 border-gray-300 rounded-3xl hover:bg-white hover:text-black">
                Log Out
              </button>
            </div>
          </nav>
        </div>
      </div>
      <div className="w-full">
        <header className="fixed z-40 flex items-center gap-4 w-full p-4 text-white bg-[#183028] shadow-md lg:hidden">
          <button onClick={toggleSidebar} className="text-white focus:outline-none md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <div className="flex">
            <img src={logo} alt="#" className="w-36" />
          </div>
        </header>
      </div>
    </div>
  );
};

export default Navbar;
