import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import NavSidebar from "./NavSidebar";
import Footer1 from "./Footer1";
import { axiosJWTadmin } from "../config/axiosJWT";
import image1 from "../Assets/image_Buat Penugasan.svg";
import image2 from "../Assets/image_Peserta magang.svg";

// Fungsi debouncing yang dapat digunakan untuk menunda eksekusi fungsi
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}

const Homepage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchDate, setSearchDate] = useState("");
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingPesertaAktif, setLoadingPesertaAktif] = useState(true);
  const [jumlahPesertaAktif, setJumlahPesertaAktif] = useState(0);
  const [errorPesertaAktif, setErrorPesertaAktif] = useState(null);
  const [loadingPesertaAlumni, setLoadingPesertaAlumni] = useState(true);
  const [jumlahPesertaAlumni, setJumlahPesertaAlumni] = useState(0);
  const [errorPesertaAlumni, setErrorPesertaAlumni] = useState(null);

  // Fungsi untuk memperbarui token
  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "admin",
        },
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      return token;
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
      throw error;
    }
  };

  // Fungsi untuk mendapatkan jumlah absen total dengan debouncing
  const getTotalAttendance = debounce(async () => {
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
  }, 1000); // Delay 1 detik untuk debouncing

  // Fungsi untuk mengambil data peserta aktif dengan debouncing
  const fetchPesertaAktif = debounce(async () => {
    try {
      const token = await refreshToken();
      const response = await axios.get(
        "http://localhost:3000/admin/peserta-aktif",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJumlahPesertaAktif(response.data.peserta_magang.length);
      setLoadingPesertaAktif(false);
    } catch (err) {
      console.error("Error:", err);
      setErrorPesertaAktif("Gagal mengambil data peserta aktif.");
      setLoadingPesertaAktif(false);
    }
  }, 2000); // Delay 1 detik untuk debouncing

  // Fungsi untuk mengambil data peserta alumni dengan debouncing
  const fetchPesertaAlumni = debounce(async () => {
    try {
      const token = await refreshToken();
      const response = await axios.get(
        "http://localhost:3000/admin/peserta-alumni",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJumlahPesertaAlumni(response.data.peserta_magang.length);
      setLoadingPesertaAlumni(false);
    } catch (err) {
      console.error("Error:", err);
      setErrorPesertaAlumni("Gagal mengambil data peserta Alumni.");
      setLoadingPesertaAlumni(false);
    }
  }, 5000); // Delay 1 detik untuk debouncing

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setSearchDate(today);

    // Panggil fungsi secara terpisah dengan debouncing
    getTotalAttendance();
    fetchPesertaAktif();
    fetchPesertaAlumni();
  }, [searchDate]);

  if (loading || loadingPesertaAktif || loadingPesertaAlumni) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-green-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full ">
      <NavSidebar />
      <div className="h-screen pl-0 mt-24 lg:pl-64 lg:mt-0">
        <div className="container flex flex-col gap-4 p-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold lg:text-4xl font-poppins">
              Dashboard - SISAPPMA
            </h2>
          </div>
          <div className="flex flex-col gap-4 text-center lg:flex-row">
            <div className="flex flex-col px-6 py-4 border border-gray-400 shadow-lg bg-slate-200 rounded-3xl">
              <div>Jumlah Peserta Absen Hari Ini</div>
              <p>{totalAttendance}</p>
            </div>
            <div className="flex flex-col px-6 py-4 border border-gray-400 shadow-lg bg-slate-200 rounded-3xl">
              <p>Jumlah Peserta Aktif Magang</p>
              {errorPesertaAktif ? (
                <p>{errorPesertaAktif}</p>
              ) : (
                <p>{jumlahPesertaAktif} Peserta</p>
              )}
            </div>
            <div className="flex flex-col px-6 py-4 border border-gray-400 shadow-lg bg-slate-200 rounded-3xl">
              <p>Jumlah Alumni Magang</p>
              {errorPesertaAlumni ? (
                <p>{errorPesertaAlumni}</p>
              ) : (
                <p>{jumlahPesertaAlumni} Peserta</p>
              )}
            </div>
          </div>

          <div className="flex flex-row justify-center mt-20">
            <div>
              <a href="/penugasan">
                <img src={image1} alt="#" />
                <h1 className="text-2xl font-semibold text-center underline font-poppins">PENUGASAN</h1>
              </a>
            </div>
            <div>
              <a href="/peserta">
                <img src={image2} alt="#" />
                <h1 className="text-2xl font-semibold text-center underline font-poppins">PESERTA</h1>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </div>
  );
};

export default Homepage;
