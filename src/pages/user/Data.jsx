import React, { useEffect, useState } from "react";
import Sidebar from "./Navbar";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Data = () => {
  // Format waktu untuk presensi
  function formatDueDate(inputDate) {
    const date = new Date(inputDate);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return hours + ":" + minutes;
  }

  const [presensi, setPresensi] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Tentukan berapa banyak data per halaman

  useEffect(() => {
    const fetchDataAndPresensiData = async () => {
      try {
        const ambilid = await axios.get("http://localhost:3000/account/token", {
          headers: {
            role: "peserta_magang",
          },
        });

        const decoded = jwt_decode(ambilid.data.token);
        const response = await axios.get(
          `http://localhost:3000/user/presensi/${decoded.userId}`
        );

        const dataWithKosong = response.data.presensi.map((item) => ({
          ...item,
          check_in: item.check_in
            ? formatDueDate(item.check_in)
            : "Belum Presensi",
          check_out: item.check_out
            ? formatDueDate(item.check_out)
            : "Belum Presensi",
          image_url_in: item.image_url_in || "Belum Ada Gambar",
          image_url_out: item.image_url_out || "Belum Ada Gambar",
        }));

        setPresensi(dataWithKosong);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchDataAndPresensiData();
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  // Logika Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = presensi.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(presensi.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="pl-64">
        <div className="container flex flex-col p-4">
          <h1 className="mb-8 text-3xl font-bold">
            History Presensi - SISAPPMA
          </h1>

          <div className="p-10 overflow-x-auto bg-slate-200 rounded-2xl">
            <table className="table w-full text-center">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Check-in</th>
                  <th>Lokasi Check-in</th>
                  <th>Check-Out</th>
                  <th>Lokasi Check-Out</th>
                  <th>Image In</th>
                  <th>Image Out</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.tanggal}</td>
                      <td>{item.check_in}</td>
                      <td>{item.lokasiCheckIn}</td>
                      <td>{item.check_out}</td>
                      <td>{item.lokasiCheckOut}</td>
                      <td>
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleImageClick(item.image_url_in)}
                        >
                          {item.image_url_in === "Belum Ada Gambar"
                            ? "Belum Presensi"
                            : "Lihat Gambar"}
                        </span>
                      </td>
                      <td>
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleImageClick(item.image_url_out)}
                        >
                          {item.image_url_out === "Belum Ada Gambar"
                            ? "Belum Presensi"
                            : "Lihat Gambar"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-sm text-center">
                      Tidak ada data presensi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center">
            <div className="mt-4 join">
              <button
                className="join-item btn"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                «
              </button>
              <button className="join-item btn">
                Page {currentPage} of {totalPages}
              </button>
              <button
                className="join-item btn"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal untuk gambar */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <img
              src={selectedImage}
              alt="Presensi"
              className="max-w-full max-h-full"
            />
            <button
              className="px-4 py-2 mt-4 text-white bg-red-500 rounded-lg"
              onClick={closeImageModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Data;
