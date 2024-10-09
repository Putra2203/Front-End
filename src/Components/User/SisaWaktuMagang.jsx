import React, { useEffect, useState } from "react";
import axios from "axios";

const SisaWaktuMagang = ({ pesertaMagangId }) => {
  const [sisaWaktu, setSisaWaktu] = useState(null);  // Menyimpan sisa waktu magang
  const [loading, setLoading] = useState(true);      // Mengontrol status loading
  const [error, setError] = useState(null);          // Menyimpan pesan error jika ada

  useEffect(() => {
    // Fungsi untuk mengambil data sisa waktu magang dari API
    const fetchSisaWaktuMagang = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/peserta/${pesertaMagangId}/sisa-waktu`);
        
        // Menyimpan data sisa waktu ke state
        setSisaWaktu(response.data.sisaWaktu);
      } catch (err) {
        // Menangani error jika terjadi
        setError(err.response ? err.response.data.message : "Error fetching data");
      } finally {
        setLoading(false); // Selesai loading
      }
    };

    fetchSisaWaktuMagang();
  }, [pesertaMagangId]);

  // Menampilkan UI loading atau error jika ada
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Menampilkan sisa waktu magang
  return (
    <div>
      <h2>Sisa Waktu Magang</h2>
      {sisaWaktu !== null ? (
        <p>Sisa waktu magang: {sisaWaktu} hari</p>
      ) : (
        <p>Data sisa waktu tidak tersedia.</p>
      )}
    </div>
  );
};

export default SisaWaktuMagang;
