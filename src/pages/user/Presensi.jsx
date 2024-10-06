import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar'; // Pastikan path file Navbar.jsx benar
import { useNavigate } from 'react-router-dom'; // Untuk navigasi halaman
import jwt_decode from "jwt-decode"; // Untuk decode token JWT
import axios from 'axios'; // Untuk request ke server
import { isUnauthorizedError } from '../../config/errorHandling'; // Untuk handle error otorisasi (ubah path sesuai dengan struktur proyek)
import { axiosJWTuser } from '../../config/axiosJWT'; // Instance axios yang sudah di-setting JWT (ubah path sesuai struktur proyek)
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Fungsi untuk menghitung jarak menggunakan rumus Haversine
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Radius Bumi dalam meter
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon1 - lon2) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Jarak dalam meter
};

const Presensi = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [stream, setStream] = useState(null);
  const [location, setLocation] = useState(''); // Menyimpan lokasi pengguna
  const [formData, setFormData] = useState({
    nama: 'Putra22',  // Bisa diisi dari userData jika menggunakan API
    hari: '',
    jam: '',
    kategori: 'Mahasiswa',
    lokasi: '',
  });
  const [errorMessage, setErrorMessage] = useState(''); // Menyimpan pesan error
  const [successMessage, setSuccessMessage] = useState(''); // Menyimpan pesan sukses

  const magangLocation = {
    latitude: -6.983109, // Lokasi magang yang baru
    longitude: 110.413630,
    radius: 500, // Radius batasan lokasi dalam meter (500 meter)
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate(); // Hook untuk navigasi halaman

  useEffect(() => {
    let mediaStream = null;

    // Autentikasi token JWT
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3000/account/token', {
          headers: {
            'role': "peserta_magang"
          },
        });
        const decoded = jwt_decode(response.data.token);
        console.log('Decoded token:', decoded);

        // Jika token valid, set data pengguna
        setFormData((prevData) => ({
          ...prevData,
          nama: decoded.name, // Ganti 'name' dengan field sesuai dengan token
        }));

        // Mulai stream kamera
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

      } catch (error) {
        if (isUnauthorizedError(error)) {
          // Jika token tidak valid, arahkan ke halaman login
          navigate('/');
        }
        console.error("Error verifying token: ", error);
      }
    };

    // Jalankan fungsi autentikasi
    checkAuth();

    // Mendapatkan lokasi pengguna
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const lokasiPengguna = `${latitude}, ${longitude}`;
          setLocation(lokasiPengguna);
          setFormData((prevData) => ({
            ...prevData,
            lokasi: lokasiPengguna, // Memasukkan lokasi ke formData
          }));

          // Hitung jarak pengguna dari lokasi magang
          const distance = calculateDistance(
            latitude,
            longitude,
            magangLocation.latitude,
            magangLocation.longitude
          );

          if (distance > magangLocation.radius) {
            setErrorMessage(
              `Anda berada di luar radius lokasi magang. Jarak: ${(distance / 1000).toFixed(2)} km.`
            );
          } else {
            setErrorMessage(''); // Jika jarak dalam batas yang diizinkan
          }
        },
        (error) => {
          console.error("Error mendapatkan lokasi: ", error);
        }
      );
    } else {
      console.error("Geolocation tidak didukung oleh browser ini.");
    }

    // Cleanup saat komponen di-unmount, matikan kamera segera
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();  // Matikan semua track segera
        });
        console.log('Camera stream stopped immediately');
      }
    };
  }, [navigate]); // Pastikan hanya dipanggil sekali

  const takePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    
    // Pastikan ukuran canvas sesuai dengan ukuran video
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;

    // Set ukuran canvas agar sesuai dengan ukuran video
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Gambar video ke canvas dengan proporsi yang benar
    context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

    // Set hasil gambar dari canvas ke imageSrc
    setImageSrc(canvasRef.current.toDataURL('image/png'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Jika ada pesan error (misalnya, berada di luar lokasi), batalkan pengiriman
    if (errorMessage) {
      return;
    }

    try {
      // Ambil token untuk autentikasi
      const response = await axios.get('http://localhost:3000/account/token', {
        headers: {
          'role': "peserta_magang"
        },
      });

      const decoded = jwt_decode(response.data.token);

      // Simpan presensi dengan gambar dan data lainnya
      const formData = new FormData();
      formData.append('image', imageSrc);
      formData.append('nama', decoded.name); // Sesuaikan dengan token
      formData.append('lokasi', location);

      const uploadResponse = await axiosJWTuser.post(`http://localhost:3000/user/presensi/${decoded.userId}`, formData, {
        headers: {
          'role': "peserta_magang",
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload success:', uploadResponse.data);
      setSuccessMessage("Presensi berhasil dikirim!");

      // Stop kamera setelah presensi
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        console.log('Camera stream stopped after form submit');
      }

      // Arahkan kembali ke halaman lain jika diperlukan
      navigate('/user/Homepage');

    } catch (error) {
      console.error('Error uploading presensi:', error);
      setErrorMessage('Gagal mengirim presensi. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="md:w-[13%]">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Lakukan Presensi - SISAPPMA</h1>

        <div className="bg-white p-6 rounded-lg shadow-md border flex flex-col md:flex-row gap-10 items-center justify-center">
          <div className="relative">
            {/* Kamera atau gambar hasil tangkapan */}
            {!imageSrc ? (
              <video ref={videoRef} autoPlay playsInline className="rounded-lg w-[320px] h-[400px] mb-4" />
            ) : (
              <img src={imageSrc} alt="Captured" className="rounded-lg w-[320px] h-[400px] mb-4" />
            )}
            <canvas ref={canvasRef} className="hidden" width="640" height="480"></canvas>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full md:w-auto">
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              <label className="font-semibold">Nama :</label>
              <input
                type="text"
                value={formData.nama}
                disabled
                className="border p-2 rounded-lg bg-gray-200 font-medium"
              />

              <label className="font-semibold">Hari :</label>
              <input
                type="text"
                value={formData.hari}
                disabled
                className="border p-2 rounded-lg bg-gray-200 font-medium"
              />

              <label className="font-semibold">Jam :</label>
              <input
                type="text"
                value={formData.jam}
                disabled
                className="border p-2 rounded-lg bg-gray-200 font-medium"
              />

              <label className="font-semibold">Kategori :</label>
              <input
                type="text"
                value={formData.kategori}
                disabled
                className="border p-2 rounded-lg bg-gray-200 font-medium"
              />

              <label className="font-semibold">Lokasi :</label>
              <input
                type="text"
                value={formData.lokasi}
                disabled
                className="border p-2 rounded-lg bg-gray-200 font-medium"
              />
            </div>

            <p className="text-sm text-gray-500 mt-2 font-light">
              *Pengambilan Foto maks. 1 mahasiswa
            </p>

            {/* Tampilkan pesan error jika ada */}
            {errorMessage && (
              <p className="text-red-600 mt-2">{errorMessage}</p>
            )}

            <div className="flex gap-4 mt-4 justify-end">
              <button
                type="button"
                onClick={takePhoto}
                className="bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Ambil Foto
              </button>

              <button
                type="submit"
                className="bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                disabled={!!errorMessage} // Disable jika ada error
              >
                Kirim Absensi
              </button>
            </div>
          </form>
        </div>

        {/* Notifikasi sukses */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-6" role="alert">
            <strong className="font-bold">🎉 {successMessage}</strong>
            <span className="block sm:inline"> Presensi berhasil disimpan.</span>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Presensi;
