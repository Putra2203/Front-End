import React, { useState } from 'react';
import { FiHome, FiClock, FiCamera, FiClipboard, FiMail, FiLogOut } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import logo from '../../images/logo.png';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const Sidebar = ({ userData = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Use navigate instead of useHistory

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    sessionStorage.removeItem('token'); 

    // Redirect user to login page
    navigate('/login'); // Adjust the path to your login route
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed rounded-tr-3xl inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
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
          <div className="flex flex-col items-center justify-center gap-4 mt-8">
            <img
              src={userData.profilePicture || 'https://via.placeholder.com/50'}
              alt="Profile"
              className="object-cover w-32 h-32 rounded-full border-2 border-white"
            />
            <h1 className="font-semibold text-lg">Selamat Datang, {userData.name}</h1>
            <p className="text-sm text-gray-300">Username: {userData.username}</p>
          </div>
          <nav className="mt-8">
            <ul className="flex flex-col gap-5 my-4">
              {/* Daftar halaman */}
              <li className="px-4 rounded-3xl hover:bg-white hover:text-black">
                <Link to="/user/Homepage" className="flex flex-row items-center gap-2 text-xl">
                  <FiHome /> Home
                </Link>
              </li>
              <li className="px-4 rounded-3xl hover:bg-white hover:text-black">
                <Link to="/user/riwayat" className="flex flex-row items-center gap-2 text-xl">
                  <FiClock /> History Presensi
                </Link>
              </li>
              <li className="px-4 rounded-3xl hover:bg-white hover:text-black">
                <Link to="/user/Presensi" className="flex flex-row items-center gap-2 text-xl">
                  <FiCamera /> Lakukan Presensi
                </Link>
              </li>
              <li className="px-4 rounded-3xl hover:bg-white hover:text-black">
                <Link to="/user/Tugas" className="flex flex-row items-center gap-2 text-xl">
                  <FiClipboard /> Penugasan
                </Link>
              </li>
              <li className="px-4 rounded-3xl hover:bg-white hover:text-black">
                <Link to="/user/surat" className="flex flex-row items-center gap-2 text-xl">
                  <FiMail /> Persuratan
                </Link>
              </li>
            </ul>
            <div className="fixed bottom-5 left-5">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 border-2 border-gray-300 rounded-3xl hover:bg-red-700">
                <FiLogOut className="mr-2 text-xl" /> Log Out
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Navbar */}
      <div className="flex-1 md:ml-[12rem] transition-all duration-300">
        <header className="fixed z-40 flex items-center gap-4 w-full p-4 text-white bg-blue-900 shadow-md lg:hidden">
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
            <img src={logo} alt="#" className="w-36" />
          </div>
        </header>
        <main className="p-8 mt-16 md:mt-0">
          {/* Tempatkan konten utama di sini */}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
