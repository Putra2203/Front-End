import React, { useState } from 'react';
import Navbar from './Navbar'; // Pastikan path file Navbar.jsx sudah benar

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
  });
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleDownload = (e) => {
    e.preventDefault();

    if (isChecked) {
      let fileUrl = '';

      if (formData.jenisSurat === 'Surat Selesai Magang') {
        fileUrl = '/documents/selesaimagang.docx'; // URL file di public folder
      } else if (formData.jenisSurat === 'Sertifikat Magang') {
        fileUrl = '/documents/sertifikatmagang.docx'; // URL file di public folder
      }

      if (fileUrl) {
        // Mulai unduh file
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileUrl.split('/').pop(); // Nama file yang akan diunduh
        link.click();
      } else {
        alert('Pilih jenis surat sebelum mengunduh.');
      }
    } else {
      alert('Harap konfirmasi data sebelum mengunduh.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar /> {/* Memanggil Navbar */}

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">Surat Selesai Magang - SISAPPMA</h1>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <form className="grid grid-cols-1 gap-4">
            <label>
              Nama:
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                placeholder="Masukkan Nama"
              />
            </label>

            <label>
              NIM:
              <input
                type="text"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                placeholder="Masukkan NIM"
              />
            </label>

            <label>
              Program Studi:
              <input
                type="text"
                name="programStudi"
                value={formData.programStudi}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                placeholder="Masukkan Program Studi"
              />
            </label>

            <label>
              Fakultas:
              <input
                type="text"
                name="fakultas"
                value={formData.fakultas}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                placeholder="Masukkan Fakultas"
              />
            </label>

            <label>
              Asal Instansi:
              <input
                type="text"
                name="asalInstansi"
                value={formData.asalInstansi}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                placeholder="Masukkan Asal Instansi"
              />
            </label>

            <label>
              Tanggal Masuk:
              <input
                type="date"
                name="tanggalMasuk"
                value={formData.tanggalMasuk}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
              />
            </label>

            <label>
              Tanggal Keluar:
              <input
                type="date"
                name="tanggalKeluar"
                value={formData.tanggalKeluar}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
              />
            </label>

            <label>
              Jenis Surat:
              <select
                name="jenisSurat"
                value={formData.jenisSurat}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
              >
                <option value="" disabled>
                  Pilih Satu Jenis Surat
                </option>
                <option value="Surat Selesai Magang">Surat Selesai Magang</option>
                <option value="Sertifikat Magang">Sertifikat Magang</option>
              </select>
            </label>

            <div>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label>Saya telah mengisi data saya dengan benar</label>
            </div>

            <button
              type="submit"
              onClick={handleDownload}
              className="bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Unduh
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuratMagang;
