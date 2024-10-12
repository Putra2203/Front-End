import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { hitungPersentaseKehadiran } from "../../Components/User/percantage";
import SisaWaktuMagang from "../../Components/User/SisaWaktuMagang";
import image from "../../images/image_Data Presensi.svg";
import image1 from "../../images/image_Lakukan Presensi.svg";

const UserPages = () => {
  const [nama, setNama] = useState("");
  const [userData, setUserData] = useState({
    profilePicture: "",
    name: "",
    username: "",
    remainingTime: null,
    attendancePercentage: 0,
  });
  const [presensi, setPresensi] = useState([]);
  const [penugasan, setPenugasan] = useState([]);
  const navigate = useNavigate();

  // Hitung persentase kehadiran menggunakan data presensi
  const attendancePercentage = hitungPersentaseKehadiran(presensi);

  useEffect(() => {
    refreshToken();
  }, []);

  // Fungsi untuk merefresh token
  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "peserta_magang",
        },
      });
      const decoded = jwt_decode(response.data.token);
      setNama(decoded.nama);
      setUserData((prevState) => ({
        ...prevState,
        name: decoded.nama,
        username: decoded.username,
      }));

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      fetchUserData();
      fetchPresensiData();
      fetchPenugasanData();
      fetchSisaWaktuMagang(decoded.userId);
    } catch (error) {
      console.error("Error refreshing token:", error);
      navigate("/");
    }
  };

  // Fungsi untuk mengambil data sisa waktu magang dari backend
  const fetchSisaWaktuMagang = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/peserta/${userId}/sisa-waktu`
      );

      // Pastikan sisa waktu berhasil diambil dari response
      if (response.data && typeof response.data.sisaWaktu === "number") {
        setUserData((prevState) => ({
          ...prevState,
          remainingTime: response.data.sisaWaktu, // Set sisa waktu magang
        }));
      } else {
        console.error("Sisa waktu tidak ditemukan atau format salah");
        setUserData((prevState) => ({
          ...prevState,
          remainingTime: "Tidak tersedia", // Atur sebagai fallback jika tidak ditemukan
        }));
      }
    } catch (error) {
      console.error("Error fetching sisa waktu magang:", error);
      setUserData((prevState) => ({
        ...prevState,
        remainingTime: "Gagal mengambil data", // Jika ada error, tampilkan pesan error
      }));
    }
  };

  // Fungsi untuk mengambil data pengguna
  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/user");
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fungsi untuk mengambil data presensi
  const fetchPresensiData = async () => {
    try {
      const response = await axios.get("/api/presensi");
      setPresensi(response.data);
    } catch (error) {
      console.error("Error fetching presensi data:", error);
    }
  };

  // Fungsi untuk mengambil data penugasan
  const fetchPenugasanData = async () => {
    try {
      const response = await axios.get("/api/penugasan");
      setPenugasan(response.data);
    } catch (error) {
      console.error("Error fetching penugasan data:", error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <div className="h-screen pl-0 mt-24 lg:pl-64 lg:mt-0">
        <div className="container flex flex-col p-4">
          <h1 className="mb-8 text-2xl font-bold md:text-3xl">
            Dashboard - SISAPPMA
          </h1>
          <h1 className="mt-16 text-3xl font-semibold text-center font-poppins">Haloo! {nama} Disini</h1>
          <div className="flex flex-col items-center justify-center my-10 lg:flex-row">
            <div className="flex flex-col">
              <a href="/user/riwayat">
                <img src={image} alt="#" />
                <p className="text-2xl font-semibold text-center underline font-poppins">
                  Histori Presensi
                </p>
              </a>
            </div>
            <div className="flex flex-col">
              <a href="/user/presensi">
                <img src={image1} alt="#" />
                <p className="text-2xl font-semibold text-center underline font-poppins">
                  Lakukan Presensi
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPages;
