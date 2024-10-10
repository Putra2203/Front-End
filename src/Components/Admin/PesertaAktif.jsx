import React, { useState, useEffect } from "react";
import axios from "axios";

const PesertaAktif = () => {
  const [jumlahPesertaAktif, setJumlahPesertaAktif] = useState(0); // State untuk menyimpan jumlah peserta aktif
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk error handling

  // Fungsi untuk mengambil data peserta aktif dari API
  const fetchPesertaAktif = async () => {
    try {
        const token = localStorage.getItem("token"); // Ambil token dari local storage
        const response = await axios.get("http://localhost:3000/admin/peserta-aktif", {
          headers: {
            Authorization: `Bearer ${token}`, // Sertakan token dalam header
          },
        });

      setJumlahPesertaAktif(response.data.peserta_magang.length);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError("Gagal mengambil data peserta aktif.");
      setLoading(false);
    }
  };

  // Gunakan useEffect untuk memanggil API saat komponen dimuat pertama kali
  useEffect(() => {
    fetchPesertaAktif();
  }, []);

  // Tampilkan jumlah peserta aktif atau pesan error/loading
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="peserta-aktif-container">
      <h2>Jumlah Peserta Aktif</h2>
      <p>{jumlahPesertaAktif} Peserta</p>
    </div>
  );
};

export default PesertaAktif;
