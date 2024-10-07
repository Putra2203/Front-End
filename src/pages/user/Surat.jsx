import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Pastikan path file Navbar.jsx benar

const SuratMagang = () => {
  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    programStudi: "",
    fakultas: "",
    asalInstansi: "",
    tanggalMasuk: "",
    tanggalKeluar: "",
    jenisSurat: "",
    checkbox: false,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fungsi untuk melakukan refresh token saat komponen dimuat
  useEffect(() => {
    refreshToken();
  }, []);

  // Fungsi refresh token untuk memastikan pengguna terautentikasi
  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "peserta_magang",
        },
      });
      const decoded = jwt_decode(response.data.token);

      // Menyimpan token untuk penggunaan API berikutnya
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    } catch (error) {
      console.error("Error refreshing token:", error);
      // Jika token tidak valid, arahkan ke halaman login
      navigate("/");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Menghapus pesan error saat pengguna mulai mengetik
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nama) newErrors.nama = "Nama wajib diisi";
    if (!formData.nim) newErrors.nim = "NIM wajib diisi";
    if (!formData.programStudi)
      newErrors.programStudi = "Program Studi wajib diisi";
    if (!formData.fakultas) newErrors.fakultas = "Fakultas wajib diisi";
    if (!formData.asalInstansi)
      newErrors.asalInstansi = "Asal Instansi wajib diisi";
    if (!formData.tanggalMasuk)
      newErrors.tanggalMasuk = "Tanggal Masuk wajib diisi";
    if (!formData.tanggalKeluar)
      newErrors.tanggalKeluar = "Tanggal Keluar wajib diisi";
    if (!formData.jenisSurat)
      newErrors.jenisSurat = "Jenis Surat wajib dipilih";
    if (!formData.checkbox)
      newErrors.checkbox = "Anda harus menyetujui data sudah benar";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      // Jika tidak ada error, proses download file
      downloadSurat(formData.jenisSurat);
    }
  };

  const downloadSurat = async (jenisSurat) => {
    try {
      const endpoint =
        jenisSurat === "selesai_magang"
          ? "/generate-selesai-magang"
          : "/generate-sertifikat-magang";
      const response = await axios.get(`http://localhost:3000${endpoint}`, {
        responseType: "blob",
        withCredentials: true,
      });

      if (response.status === 200) {
        // File generated successfully, initiate download
        const downloadUrl = window.URL.createObjectURL(
          new Blob([response.data])
        );
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `${jenisSurat}.docx`);
        document.body.appendChild(link);
        link.click();
      } else {
        console.error("Error generating file:", response.data.error);
      }
    } catch (error) {
      console.error("Error saat mengunduh surat:", error);
      if (error.response && error.response.status === 401) {
        navigate("/"); // Arahkan ke halaman login jika tidak terautentikasi
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Sidebar */}
      <Navbar />
      {/* Main Content */}
      <div className="pl-64">
        <div className="container flex flex-col p-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-[#171a34]">
            Surat Selesai Magang - SISAPPMA
          </h1>
          <form
            onSubmit={handleSubmit}
            className="w-full p-4 space-y-4 rounded-lg shadow-lg bg-slate-100 md:p-6"
          >
            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                Nama:
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan Nama"
                  className="mt-1 border p-2 rounded-lg w-full text-[#171a34]"
                />
                {errors.nama && (
                  <p className="text-sm text-red-600">{errors.nama}</p>
                )}
              </label>

              <label className="block">
                NIM:
                <input
                  type="text"
                  name="nim"
                  value={formData.nim}
                  onChange={handleChange}
                  placeholder="Masukkan NIM"
                  className="mt-1 border p-2 rounded-lg w-full text-[#171a34]"
                />
                {errors.nim && (
                  <p className="text-sm text-red-600">{errors.nim}</p>
                )}
              </label>

              <label className="block">
                Program Studi:
                <input
                  type="text"
                  name="programStudi"
                  value={formData.programStudi}
                  onChange={handleChange}
                  placeholder="Masukkan Program Studi"
                  className="mt-1 border p-2 rounded-lg w-full text-[#171a34]"
                />
                {errors.programStudi && (
                  <p className="text-sm text-red-600">{errors.programStudi}</p>
                )}
              </label>

              <label className="block">
                Fakultas:
                <input
                  type="text"
                  name="fakultas"
                  value={formData.fakultas}
                  onChange={handleChange}
                  placeholder="Masukkan Fakultas"
                  className="mt-1 border p-2 rounded-lg w-full text-[#171a34]"
                />
                {errors.fakultas && (
                  <p className="text-sm text-red-600">{errors.fakultas}</p>
                )}
              </label>

              <label className="block">
                Asal Instansi:
                <input
                  type="text"
                  name="asalInstansi"
                  value={formData.asalInstansi}
                  onChange={handleChange}
                  placeholder="Masukkan Asal Instansi"
                  className="mt-1 border p-2 rounded-lg w-full text-[#171a34]"
                />
                {errors.asalInstansi && (
                  <p className="text-sm text-red-600">{errors.asalInstansi}</p>
                )}
              </label>

              <label className="block">
                Tanggal Masuk:
                <input
                  type="date"
                  name="tanggalMasuk"
                  value={formData.tanggalMasuk}
                  onChange={handleChange}
                  className="mt-1 border p-2 rounded-lg w-full text-[#171a34]"
                />
                {errors.tanggalMasuk && (
                  <p className="text-sm text-red-600">{errors.tanggalMasuk}</p>
                )}
              </label>

              <label className="block">
                Tanggal Keluar:
                <input
                  type="date"
                  name="tanggalKeluar"
                  value={formData.tanggalKeluar}
                  onChange={handleChange}
                  className="mt-1 border p-2 rounded-lg w-full text-[#171a34]"
                />
                {errors.tanggalKeluar && (
                  <p className="text-sm text-red-600">{errors.tanggalKeluar}</p>
                )}
              </label>

              <label className="block">
                Jenis Surat:
                <select
                  name="jenisSurat"
                  value={formData.jenisSurat}
                  onChange={handleChange}
                  className="mt-1 border p-2 rounded-lg w-full text-[#171a34]"
                >
                  <option value="">Pilih Satu Jenis Surat</option>
                  <option value="selesai_magang">Surat Selesai Magang</option>
                  <option value="sertifikat_magang">Sertifikat Magang</option>
                </select>
                {errors.jenisSurat && (
                  <p className="text-sm text-red-600">{errors.jenisSurat}</p>
                )}
              </label>
            </div>

            <label className="flex items-center mt-4">
              <input
                type="checkbox"
                name="checkbox"
                checked={formData.checkbox}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-[#171a34]">
                Saya telah mengisi data saya dengan benar
              </span>
              {errors.checkbox && (
                <p className="text-sm text-red-600">{errors.checkbox}</p>
              )}
            </label>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-[#000126] text-[#ffffff] py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Unduh
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuratMagang;
