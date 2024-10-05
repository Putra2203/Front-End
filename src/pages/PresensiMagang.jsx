import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../Assets/diskominfo.png";
import { axiosJWTadmin } from "../config/axiosJWT";
import ImageOverlay from "../Components/Admin/ImageOverlay";
import icon from "../Assets/icon.png";
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

  useEffect(() => {
    getUsers();
    fetchCurrentTime();
    const today = new Date().toISOString().slice(0, 10);
    setSearchDate(today);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setSearchDate(selectedDate);
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const fetchCurrentTime = async () => {
    try {
      const response = await fetch(
        "https://worldtimeapi.org/api/timezone/Asia/Jakarta"
      );
      const data = await response.json();
      const dateTimeString = data.datetime;
      const dateTime = new Date(dateTimeString);

      const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
      const timeOptions = { hour: "2-digit", minute: "2-digit" };

      const date = dateTime.toLocaleDateString(undefined, dateOptions);
      const time = dateTime.toLocaleTimeString(undefined, timeOptions);

      const dateTimeStringFormatted = `${date} - ${time}`;
      setCurrentTime(dateTimeStringFormatted);
    } catch (error) {
      console.error("Error fetching current time:", error);
    }
  };

  const getUsers = async () => {
    setLoading(true);
    const url = searchDate
      ? `http://localhost:3000/admin/presensi?tanggal=${searchDate}`
      : "http://localhost:3000/admin/presensi";

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

  const formatDateTime = (dateTime) => {
    if (dateTime === null) {
      return "-";
    }

    const jakartaTimeZone = "Asia/Jakarta";
    const options = {
      timeZone: jakartaTimeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    const date = new Date(dateTime);
    const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    return formattedTime;
  };

  return (
    <div className="flex flex-col w-full">
      <NavSidebar />
      <div className="pl-64">
        <div className="container flex flex-col p-4">
          <div className="column">
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 25,
                marginBottom: 20,
              }}
            >
              Presensi Magang
            </p>
            <div className="cards">
              <div
                className="card-1"
                style={{
                  backgroundColor: "#4CAF50",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "white" }}>Total Hadir Hari Ini</p>
                <p style={{ color: "white" }}>{totalAttendance}</p>
              </div>
              <div
                className="card-2"
                style={{
                  backgroundColor: "#FF5733",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "white" }}>Tanggal Hari Ini</p>
                <p style={{ color: "white" }}>{currentTime}</p>
              </div>
            </div>
            <div className="button-container">
              <button
                onClick={() => getPresensiBelum()}
                className="button is-small is-danger"
              >
                Peserta Belum Absen
              </button>
              <button
                onClick={() => getUsers()}
                className="button is-small is-success"
              >
                Peserta Sudah Absen
              </button>
            </div>
            <div className="search">
              <input
                type="date"
                value={searchDate}
                onChange={handleDateChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  width: "100%",
                  maxWidth: "300px",
                  margin: "10px 0",
                }}
              />
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="table-container-presensi">
                <table className="custom-table-presensi">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Check-In</th>
                      <th>Check-Out</th>
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
                          {user.presensimagang.map((entry, entryIndex) => (
                            <React.Fragment key={entry.id}>
                              <td>
                                {entry.check_in
                                  ? formatDateTime(entry.check_in)
                                  : "-"}
                              </td>
                              <td>
                                {entry.check_out
                                  ? formatDateTime(entry.check_out)
                                  : "-"}
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
            <button
              onClick={exportPresensi}
              className="button is-success"
              style={{ marginTop: 18, float: "right" }}
            >
              Export to Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresensiMagang;
