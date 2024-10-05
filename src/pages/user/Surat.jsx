import React, { useState } from 'react';
import Navbar from './Navbar'; // Pastikan path file Navbar.jsx benar

const SuratMagang = () => {
  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    programStudi: '',
    fakultas: '',
    asalInstansi: '',
    tanggalMasuk: '',
    tanggalKeluar: '',
    jenisSurat: '',
    checkbox: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Menghapus pesan error saat pengguna mulai mengetik
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nama) newErrors.nama = 'Nama wajib diisi';
    if (!formData.nim) newErrors.nim = 'NIM wajib diisi';
    if (!formData.programStudi) newErrors.programStudi = 'Program Studi wajib diisi';
    if (!formData.fakultas) newErrors.fakultas = 'Fakultas wajib diisi';
    if (!formData.asalInstansi) newErrors.asalInstansi = 'Asal Instansi wajib diisi';
    if (!formData.tanggalMasuk) newErrors.tanggalMasuk = 'Tanggal Masuk wajib diisi';
    if (!formData.tanggalKeluar) newErrors.tanggalKeluar = 'Tanggal Keluar wajib diisi';
    if (!formData.jenisSurat) newErrors.jenisSurat = 'Jenis Surat wajib dipilih';
    if (!formData.checkbox) newErrors.checkbox = 'Anda harus menyetujui data sudah benar';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      // Jika tidak ada error, proses download file
      if (formData.jenisSurat === 'selesai_magang') {
        window.open('/path/to/selesaimagang.docx');
      } else if (formData.jenisSurat === 'sertifikat_magang') {
        window.open('/path/to/sertifikatmagang.docx');
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f7f7f7]"> {/* Background terang */}
      {/* Sidebar */}
      <div className="md:w-[13%]">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-[#171a34]">Surat Selesai Magang - SISAPPMA</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full space-y-4" // Menggunakan w-full untuk lebar penuh
        >
          <div className="grid grid-cols-1 gap-4"> {/* Kolom tunggal per input */}
            <label className="block">
              Nama:
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan Nama"
                className="mt-1 border p-2 rounded-lg w-full text-[#171a34]" // Warna teks lebih gelap
              />
              {errors.nama && <p className="text-red-600 text-sm">{errors.nama}</p>}
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
              {errors.nim && <p className="text-red-600 text-sm">{errors.nim}</p>}
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
              {errors.programStudi && <p className="text-red-600 text-sm">{errors.programStudi}</p>}
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
              {errors.fakultas && <p className="text-red-600 text-sm">{errors.fakultas}</p>}
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
              {errors.asalInstansi && <p className="text-red-600 text-sm">{errors.asalInstansi}</p>}
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
              {errors.tanggalMasuk && <p className="text-red-600 text-sm">{errors.tanggalMasuk}</p>}
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
              {errors.tanggalKeluar && <p className="text-red-600 text-sm">{errors.tanggalKeluar}</p>}
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
              {errors.jenisSurat && <p className="text-red-600 text-sm">{errors.jenisSurat}</p>}
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
            <span className="text-[#171a34]">Saya telah mengisi data saya dengan benar</span>
            {errors.checkbox && <p className="text-red-600 text-sm">{errors.checkbox}</p>}
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
  );
};

export default SuratMagang;
