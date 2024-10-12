import React, { useEffect, useState } from "react";
import Sidebar from "./Navbar";
import axios from "axios";
import jwt_decode from "jwt-decode";
import SisaWaktuMagang from "../../Components/User/SisaWaktuMagang";

const Data = () => {
  const [presensi, setPresensi] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [userId, setUserId] = useState(null);

  // Separate function to get token
  const fetchToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "peserta_magang",
        },
      });
      const decoded = jwt_decode(response.data.token);
      return decoded.userId;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
        // Handle session expiry logic, like redirecting to login page
      } else {
        console.error("Error fetching token", error);
      }
      return null;
    }
  };

  // Fetch presensi data
  const fetchDataAndPresensiData = async () => {
    try {
      const userId = await fetchToken();
      if (!userId) return; // Exit if token fetch failed

      const response = await axios.get(
        `http://localhost:3000/user/presensi/${userId}`
      );

      console.log(response.data.presensi);

      const dataWithKosong = response.data.presensi.map((item) => ({
        ...item,
        check_in: item.check_in || "Belum Presensi",
        check_out: item.check_out || "Belum Presensi",
        image_url_in: item.image_url_in || null,
        image_url_out: item.image_url_out || null,
        lokasi_in: item.lokasi_in || null,
        lokasi_out: item.lokasi_out || null,
      }));

      setPresensi(dataWithKosong);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchDataAndPresensiData();
  }, []);

  const handleImageClick = (imageUrl) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setShowImageModal(true);
    }
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

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
      <Sidebar />
      <div className="h-screen pl-0 mt-24 lg:pl-64 lg:mt-0">
        <div className="container flex flex-col p-4">
          <h1 className="mb-8 text-3xl font-bold">
            History Presensi - SISAPPMA
          </h1>
          <div className="p-10 overflow-x-auto bg-slate-200 rounded-2xl">
            <table className="table w-full text-center">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Tanggal</th>
                  <th>Hari</th>
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
                      <td>{item.nama}</td>
                      <td>{item.tanggal}</td>
                      <td>{item.hari}</td>
                      <td>{item.check_in}</td>
                      <td>{item.lokasi_in}</td>
                      <td>{item.check_out}</td>
                      <td>{item.lokasi_out}</td>
                      <td>
                        {item.image_url_in ? (
                          <span
                            className="text-blue-500 cursor-pointer"
                            onClick={() => handleImageClick(item.image_url_in)}
                          >
                            Lihat Gambar
                          </span>
                        ) : (
                          "Belum Presensi"
                        )}
                      </td>
                      <td>
                        {item.image_url_out ? (
                          <span
                            className="text-blue-500 cursor-pointer"
                            onClick={() => handleImageClick(item.image_url_out)}
                          >
                            Lihat Gambar
                          </span>
                        ) : (
                          "Belum Presensi"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-sm text-center">
                      Tidak ada data presensi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
