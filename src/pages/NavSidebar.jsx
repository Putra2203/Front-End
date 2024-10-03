import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { RiHomeOfficeFill, RiUserFollowFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { FaUserGroup, FaUserPen } from "react-icons/fa6";
import { GoTasklist } from "react-icons/go";
import { IoClose } from "react-icons/io5"; 

const NavSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [profil, setProfil] = useState("");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "admin",
        },
      });
      const decoded = jwt_decode(response.data.token);
      setNama(decoded.nama);
      setProfil(decoded.foto_profil);
    } catch (error) {
      console.error("Error fetching token");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed rounded-tr-3xl inset-y-0 left-0 z-50 w-64 bg-[#183028] text-white transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <img src={logo} alt="logo" className="w-40" />
            {isOpen && (
              <button onClick={toggleSidebar} className="text-white md:hidden">
                <IoClose size={20} /> {/* Icon close untuk menutup sidebar */}
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
              {/* Daftar halaman */}
              <li className="px-4 rounded-3xl hover:bg-white hover:text-black">
                <Link
                  to="/homepage"
                  className="flex flex-row items-center gap-2 text-xl "
                >
                  <RiHomeOfficeFill />
                  Home
                </Link>
              </li>
              <li className="px-4 rounded-3xl hover:bg-white hover:text-black">
                <Link
                  to="/admin"
                  className="flex flex-row items-center gap-2 text-xl "
                >
                  <FaUser />
                  Admin
                </Link>
              </li>
              <li className="px-4 rounded-3xl hover:bg-white hover:text-black">
                <Link
                  to="/peserta"
                  className="flex flex-row items-center gap-2 text-xl "
                >
                  <FaUserGroup />
                  Peserta
                </Link>
              </li>
              <li className="px-4 rounded-3xl hover:bg-white hover:text-black">
                <Link
                  to="/presensimagang"
                  className="flex flex-row items-center gap-2 text-xl "
                >
                  <RiUserFollowFill />
                  Presensi Magang
                </Link>
              </li>
              <li className="px-4 rounded-3xl hover:bg-white hover:text-black">
                <Link
                  to="/penugasan"
                  className="flex flex-row items-center gap-2 text-xl "
                >
                  <GoTasklist />
                  Penugasan
                </Link>
              </li>
              <li className="px-4 rounded-3xl hover:bg-white hover:text-black">
                <Link
                  to="/profile"
                  className="flex flex-row items-center gap-2 text-xl "
                >
                  <FaUserPen />
                  Profile
                </Link>
              </li>
            </ul>
            <div className="fixed bottom-5 right-5">
              <button className="px-4 py-2 border-2 border-gray-300 rounded-3xl hover:">
                Log Out
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Navbar */}
      <div className="w-full">
        <header className="fixed z-40 flex items-center gap-4 w-full p-4 text-white bg-[#183028] shadow-md lg:hidden">
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <div className="flex">
            <img src={logo} alt="#" className="w-36"/>
          </div>
          <div className="items-center hidden space-x-4 md:flex">
            <Link to="/profile" className="hover:text-gray-400">
              Profile
            </Link>
            <Link to="/settings" className="hover:text-gray-400">
              Settings
            </Link>
          </div>
        </header>
      </div>
    </div>
  );
};

export default NavSidebar;
