import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { hitungPersentaseKehadiran } from "../../Components/User/percantage";
import SisaWaktuMagang from "../../Components/User/SisaWaktuMagang";

const UserPages = () => {
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
      setUserData((prevState) => ({
        ...prevState,
        name: decoded.nama,
        username: decoded.username,
      }));

      // Set token untuk digunakan dalam permintaan API selanjutnya
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      // Memuat data setelah mendapatkan token yang valid
      fetchUserData();
      fetchPresensiData();
      fetchPenugasanData();
      fetchSisaWaktuMagang(decoded.userId);
    } catch (error) {
      console.error("Error refreshing token:", error);
      navigate("/"); // Arahkan ke login jika token tidak valid
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
      <div className="pl-64">
        <div className="container flex flex-col p-4">
          <h1 className="mb-8 text-2xl font-bold md:text-3xl">
            Dashboard - SISAPPMA
          </h1>

          {/* Presensi */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-white rounded-lg shadow-md md:col-span-2 md:p-6">
              <h2 className="mb-4 text-lg font-semibold md:text-xl">
                Presensi
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {presensi.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 md:p-4 rounded-lg ${
                      item.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.status === "completed" ? (
                      <FiCheckCircle className="mr-2" />
                    ) : (
                      <FiXCircle className="mr-2" />
                    )}
                    {item.date}
                  </div>
                ))}
              </div>
            </div>

            {/* Sisa Waktu Magang */}
            <div className="p-4 text-center bg-white rounded-lg shadow-md md:p-6">
              <h2 className="mb-2 font-semibold text-md md:text-lg">
                Sisa Waktu Magang
              </h2>
              <p className="text-xl font-bold md:text-2xl">
                {userData.remainingTime !== "" &&
                userData.remainingTime !== null
                  ? `${userData.remainingTime} hari`
                  : "Loading..."}
              </p>
            </div>

            {/* Penugasan */}
            <div className="p-4 bg-white rounded-lg shadow-md md:col-span-2 md:p-6">
              <h2 className="mb-4 text-lg font-semibold md:text-xl">
                Penugasan
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {penugasan.map((task, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 md:p-4 rounded-lg ${
                      task.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {task.status === "completed" ? (
                      <FiCheckCircle className="mr-2" />
                    ) : (
                      <FiXCircle className="mr-2" />
                    )}
                    {task.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Presentase Kehadiran */}
            <div className="p-4 text-center bg-white rounded-lg shadow-md md:p-6">
              <h2 className="mb-2 font-semibold text-md md:text-lg">
                Presentase Kehadiran
              </h2>
              <div className="relative w-24 h-24 mx-auto mb-4 md:w-40 md:h-40">
                <svg
                  className="absolute top-0 left-0 w-full h-full"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-gray-300"
                    strokeDasharray="100, 100"
                    d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    className="text-blue-600"
                    strokeDasharray={`${userData.attendancePercentage}, 100`}
                    d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <p className="absolute inset-0 flex items-center justify-center text-2xl font-bold md:text-3xl">
                  {attendancePercentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPages;
