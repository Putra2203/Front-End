import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import NavSidebar from "./NavSidebar";
import Footer1 from "./Footer1";
import { axiosJWTadmin } from "../config/axiosJWT";

const Homepage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchDate, setSearchDate] = useState("");
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Deklarasikan fungsi refreshToken sebelum digunakan di useEffect
  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "admin",
        },
      });
      // Misalnya, simpan token baru jika perlu
      const token = response.data.token;
      // Lakukan sesuatu dengan token jika perlu
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const getTotalAttendance = async () => {
    setLoading(true);
    const url = searchDate
      ? `http://localhost:3000/admin/presensi?tanggal=${searchDate}`
      : "http://localhost:3000/admin/presensi";

    try {
      const response = await axiosJWTadmin.get(url);
      setTotalAttendance(response.data.totalSudahPresensi);
    } catch (error) {
      console.error("Error fetching total attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshToken(); 
    const today = new Date().toISOString().slice(0, 10);
    setSearchDate(today);

    getTotalAttendance();
  }, [searchDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Tailwind CSS spinner */}
        <div className="w-16 h-16 border-4 border-green-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <NavSidebar />
      <div className="pl-64">
        <div className="container flex flex-col gap-4 p-4">
          <div className="flex flex-col">
            <h2 className="text-4xl font-semibold font-poppins">
              Dashboard - SISAPPMA
            </h2>
          </div>
          <div className="flex flex-row gap-4 text-center">
            <div className="flex flex-col px-6 py-4 border border-gray-400 shadow-lg bg-slate-200 rounded-3xl">
              <div>Jumlah Peserta Absen Hari Ini</div>
              <p>{totalAttendance}</p>
            </div>
            <div className="flex flex-col px-6 py-4 border border-gray-400 shadow-lg bg-slate-200 rounded-3xl">
              <p>Jumlah Peserta Aktif Magang</p>
              <p>//</p>
            </div>
            <div className="flex flex-col px-6 py-4 border border-gray-400 shadow-lg bg-slate-200 rounded-3xl">
              <p>Jumlah Alumni Magang</p>
              <p>//</p>
            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </div>
  );
};

export default Homepage;
