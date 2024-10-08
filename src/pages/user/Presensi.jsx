import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { showSuccessNotification } from "../../Components/User/toastSuccess";
import { showErrorNotification } from "../../Components/User/toastFailed";
import Sidebar from "./Navbar";

const Presensi = () => {
  const videoRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [captureTime, setCaptureTime] = useState(null);
  const [presensi, setPresensi] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  const isUnauthorizedError = (error) => {
    return error.response && error.response.status === 401;
  };

  // Separate function to fetch and decode token
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
      if (isUnauthorizedError(error)) {
        alert("Session expired. Please login again.");
        navigate("/"); // Redirect to login if unauthorized
      } else {
        console.error("Error fetching token:", error);
      }
      return null; // Return null in case of error
    }
  };

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        const userId = await fetchToken(); // Get token before starting the camera
        if (!userId) return;

        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        if (isUnauthorizedError(error)) {
          navigate("/");
        }
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [navigate]);

  // Fetch presensi data from backend
  useEffect(() => {
    const fetchDataAndPresensiData = async () => {
      try {
        const userId = await fetchToken(); // Get token here
        if (!userId) return;

        const response = await axios.get(
          `http://localhost:3000/user/presensi/${userId}`
        );

        const dataWithKosong = response.data.presensi.map((item) => ({
          ...item,
          nama: item.nama,
          check_in: item.check_in || "Belum Presensi",
          check_out: item.check_out || "Belum Presensi",
          image_url_in: item.image_url_in || null,
          image_url_out: item.image_url_out || null,
          lokasi_in:
            item.latitude_in && item.longitude_in
              ? `${item.latitude_in}, ${item.longitude_in}`
              : "Lokasi tidak tersedia",
          lokasi_out:
            item.latitude_out && item.longitude_out
              ? `${item.latitude_out}, ${item.longitude_out}`
              : "Lokasi tidak tersedia",
        }));

        setPresensi(dataWithKosong);
      } catch (error) {
        console.error("Error fetching data", error);
        if (isUnauthorizedError(error)) {
          navigate("/");
        }
      }
    };

    fetchDataAndPresensiData();
  }, [navigate]);

  // Get user's location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            showErrorNotification(
              "Gagal mendapatkan lokasi. Aktifkan GPS Anda."
            );
          }
        );
      } else {
        showErrorNotification("Geolocation tidak didukung di browser ini.");
      }
    };

    getLocation();
  }, []);

  const capture = async () => {
    if (!userLocation) {
      showErrorNotification("Gagal mengambil gambar. Lokasi tidak tersedia.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const capturedImageBlob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg")
    );
    const capturedImageFile = new File(
      [capturedImageBlob],
      "captured-image.jpg",
      {
        type: "image/jpeg",
      }
    );

    setImageSrc(capturedImageFile);
    setCaptureTime(new Date());
    console.log("Captured Image:", capturedImageFile);
    setShowModal(true); // Show modal after image is captured
  };

  const uploadImage = async () => {
    try {
      const userId = await fetchToken(); // Get token before uploading
      if (!userId) return;

      if (!imageSrc) {
        throw new Error("No image captured");
      }

      const formData = new FormData();
      formData.append("image", imageSrc);
      formData.append("latitude", userLocation.latitude);
      formData.append("longitude", userLocation.longitude);

      const response = await axios.patch(
        `http://localhost:3000/user/presensi/${userId}/up`,
        formData,
        {
          headers: {
            role: "peserta_magang",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showSuccessNotification("Berhasil Melakukan Presensi");
      setShowModal(false); // Close modal after successful upload
    } catch (error) {
      console.error("Error object:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        showErrorNotification(
          `Gagal Melakukan Presensi: ${error.response.data.message}`
        );
      } else if (error.message) {
        showErrorNotification(`Gagal Melakukan Presensi: ${error.message}`);
      }

      if (isUnauthorizedError(error)) {
        navigate("/");
      }

      console.error("Error detail:", error);
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#F5F5F5]">
      <Sidebar />
      <div className="h-screen pl-0 mt-24 lg:pl-64 lg:mt-0 ">
        <div className="container flex flex-col p-4">
          <h2 className="text-2xl font-semibold lg:text-4xl font-poppins">
            Lakukan Presensi - SISAPPMA
          </h2>
          <div className="flex flex-col items-center justify-center lg:my-16 lg:flex-row">
            <div className="flex p-10 m-10 shadow-lg bg-slate-200 rounded-xl">
              <div className="flex flex-col items-center justify-center gap-4 my-5 h-96">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="object-cover rounded-lg h-96 w-96"
                ></video>
                {userLocation && (
                  <p>
                    Lokasi Anda: {userLocation.latitude.toFixed(5)},{" "}
                    {userLocation.longitude.toFixed(5)}
                  </p>
                )}
                <button onClick={capture} className="flex btn btn-primary">
                  Ambil Gambar
                </button>
                {imageSrc && <p>Gambar berhasil diambil</p>}
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col gap-4">
                <h1 className="text-xl font-semibold underline font-poppins">
                  Waktu Presensi
                </h1>
                <ul className="flex flex-col gap-4">
                  <li className="p-4 rounded-lg shadow-md bg-slate-100">
                    <p>Hari kerja Senin hingga Kamis</p>
                    <p>• Absen pagi: 07:45 - 08:15</p>
                    <p>• Absen sore: 15:45 - 16:15</p>
                  </li>
                  <li className="p-4 rounded-lg shadow-md bg-slate-100">
                    <p>Hari Jumat</p>
                    <p>• Absen pagi: 07:15 - 08:45</p>
                    <p>• Absen sore: 13:45 - 14:15</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal using DaisyUI */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Konfirmasi Presensi</h3>
            <ul className="py-4">
              <li>
                <strong>Nama:</strong> {presensi[0]?.nama || "Tidak tersedia"}
              </li>
              <li>
                <strong>Tanggal:</strong>{" "}
                {new Date().toLocaleDateString("id-ID")}
              </li>
              <li>
                <strong>Hari:</strong>{" "}
                {new Date().toLocaleDateString("en-US", { weekday: "long" })}
              </li>
              <li>
                <strong>Check-in:</strong>{" "}
                {presensi[0]?.check_in || "Belum check-in"}
              </li>
              <li>
                <strong>Check-out:</strong>{" "}
                {presensi[0]?.check_out || "Belum check-out"}
              </li>
              <li>
                <strong>Lokasi Anda:</strong>{" "}
                {userLocation?.latitude.toFixed(5)},{" "}
                {userLocation?.longitude.toFixed(5)}
              </li>
              <li>
                <strong>Lokasi Check-in:</strong>{" "}
                {presensi[0]?.lokasi_in || "Lokasi tidak tersedia"}
              </li>
              <li>
                <strong>Lokasi Check-out:</strong>{" "}
                {presensi[0]?.lokasi_out || "Lokasi tidak tersedia"}
              </li>
            </ul>
            <div className="modal-action">
              <button onClick={uploadImage} className="btn btn-primary">
                Kirim Presensi
              </button>
              <button onClick={() => setShowModal(false)} className="btn">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Presensi;
