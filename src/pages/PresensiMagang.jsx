import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { axiosJWTadmin } from "../config/axiosJWT";
import ImageOverlay from "../Components/Admin/ImageOverlay";
import NavSidebar from "./NavSidebar";

export const PresensiMagang = () => {
  const [users, setUsers] = useState([]);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageOverlay(true);
  };

  const handleCloseImageOverlay = () => {
    setSelectedImage("");
    setShowImageOverlay(false);
  };

  const getFormattedLocalTime = () => {
    const now = new Date();
    const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
    const date = now.toLocaleDateString("id-ID", dateOptions);
    const time = now.toLocaleTimeString("id-ID", timeOptions);
    return `${date} - ${time}`;
  };

  useEffect(() => {
    getUsers();
    const today = new Date().toISOString().split("T")[0];
    setSearchDate(today);
    setCurrentTime(getFormattedLocalTime());

    const intervalId = setInterval(() => {
      setCurrentTime(getFormattedLocalTime());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setSearchDate(selectedDate);
  };

  useEffect(() => {
    if (searchDate) {
      getUsers();
    }
  }, [searchDate]);

  const exportPresensi = async () => {
    const requestUrl = searchDate
      ? `http://localhost:3000/admin/export-presensi?tanggal=${searchDate}`
      : "http://localhost:3000/admin/export-presensi";

    const response = await axiosJWTadmin.get(requestUrl, {
      responseType: "arraybuffer",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "Presensi.xlsx";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
  };

  const getUsers = async () => {
    setLoading(true);
    const url = searchDate
      ? `http://localhost:3000/admin/presensi?tanggal=${searchDate}`
      : `http://localhost:3000/admin/presensi`;

    try {
      const response = await axiosJWTadmin.get(url);
      setUsers(response.data.presensi);
      setTotalAttendance(response.data.totalSudahPresensi);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPresensiBelum = async () => {
    try {
      const response = await axiosJWTadmin.get(
        "http://localhost:3000/admin/presensi/negatif"
      );
      setUsers(response.data.presensi);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDateTime = (date) => {
    if (date === null) {
      return "-";
    }

    const jakartaTimeZone = "Asia/Jakarta";
    const options = {
      timeZone: jakartaTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    return new Intl.DateTimeFormat("id-ID", options).format(new Date(date));
  };

  return (
    <div className="flex flex-col w-full">
      <NavSidebar />
      <div className="h-screen pl-0 lg:pl-64">
        <div className="flex flex-col p-4">
          <div className="flex flex-col gap-2 lg:justify-between justify-normal lg:flex-row lg:gap-0">
            <p className="mt-24 text-2xl font-semibold lg:text-4xl font-poppins lg:mt-0">
              Presensi Magang - SISAPPMA
            </p>
            <div className="bg-[#183028] px-4 text-white py-4 text-center rounded-lg">
              <p>Tanggal Hari Ini</p>
              <p>{currentTime}</p>
            </div>
          </div>

          <div className="flex flex-col mt-4">
            <div className="bg-[#183028] px-4 text-white py-4 text-center rounded-lg w-44">
              <p>Total Hadir Hari Ini</p>
              <p>{totalAttendance}</p>
            </div>
            <div className="mt-4">
              <input
                className="px-4 border bg-slate-200 rounded-3xl"
                type="date"
                value={searchDate}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4 lg:justify-between lg:flex-row lg:gap-0">
            <div className="flex gap-4">
              <button
                onClick={() => getPresensiBelum()}
                className="bg-[#183028] px-4 text-white py-2 text-center rounded-3xl hover:bg-slate-400"
              >
                Peserta Belum Absen
              </button>
              <button
                onClick={() => getUsers()}
                className="bg-[#183028] px-4 text-white py-2 text-center rounded-3xl hover:bg-slate-400"
              >
                Peserta Sudah Absen
              </button>
            </div>
            <div>
              <button
                onClick={exportPresensi}
                className="bg-[#183028] px-4 text-white py-2 text-center rounded-3xl hover:bg-slate-400"
              >
                Export to Excel
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="p-10 mt-4 overflow-x-auto bg-slate-200 rounded-2xl">
              <table className="table w-full text-center">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Asal Universitas</th>
                    <th>Asal Jurusan</th>
                    <th>Nomor Telepon</th>
                    <th>Tanggal</th>
                    <th>Check-In</th>
                    <th>Lokasi Check-In</th>
                    <th>Check-Out</th>
                    <th>Lokasi Check-Out</th>
                    <th>Image In</th>
                    <th>Image Out</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(users) &&
                    users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.nama}</td>
                        <td>{user.asal_univ}</td>
                        <td>{user.asal_jurusan}</td>
                        <td>{user.no_telp}</td>
                        {user.presensimagang.map((entry) => (
                          <React.Fragment key={entry.id}>
                            <td>{formatDateTime(entry.tanggal)}</td>
                            <td>{formatDateTime(entry.check_in)}</td>
                            <td>
                              {entry.latitude_in && entry.longitude_in
                                ? `${entry.latitude_in}, ${entry.longitude_in}`
                                : "Lokasi tidak tersedia"}
                            </td>
                            <td>{formatDateTime(entry.check_out)}</td>
                            <td>
                              {entry.latitude_out && entry.longitude_out
                                ? `${entry.latitude_out}, ${entry.longitude_out}`
                                : "Lokasi tidak tersedia"}
                            </td>
                            <td>
                              {entry.image_url_in ? (
                                <button
                                  onClick={() =>
                                    handleImageClick(entry.image_url_in)
                                  }
                                  className="button is-small is-success"
                                >
                                  Absen Masuk
                                </button>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              {entry.image_url_out ? (
                                <button
                                  onClick={() =>
                                    handleImageClick(entry.image_url_out)
                                  }
                                  className="button is-small is-success"
                                >
                                  Absen Pulang
                                </button>
                              ) : (
                                "-"
                              )}
                            </td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {showImageOverlay && (
            <ImageOverlay
              imageUrl={selectedImage}
              onClose={handleCloseImageOverlay}
            />
          )}
        </div>
      </div>
      <div className="w-full"></div>
    </div>
  );
};

export default PresensiMagang;
