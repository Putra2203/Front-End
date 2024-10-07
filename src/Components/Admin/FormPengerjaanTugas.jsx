import React, { useState } from 'react';
import axios from 'axios';

const FormPengerjaanTugas = ({ tugasId, onFormSubmit }) => {
  const [lampiran, setLampiran] = useState(null);
  const [keterangan, setKeterangan] = useState('');
  const [status, setStatus] = useState('belum');

  const handleFileChange = (e) => {
    setLampiran(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('lampiran', lampiran);
    formData.append('keterangan', keterangan);
    formData.append('status', status);

    try {
      await axios.post(`http://localhost:3000/participant/tugas/${tugasId}/update`, formData);
      alert('Pekerjaan berhasil diunggah!');

      // Memanggil callback untuk meng-update data di tabel Detail Penugasan
      if (onFormSubmit) {
        onFormSubmit();
      }
    } catch (error) {
      console.error('Error mengunggah pekerjaan:', error);
      alert('Gagal mengunggah pekerjaan');
      
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label className="font-semibold">Upload Lampiran Pekerjaan:</label>
        <input type="file" onChange={handleFileChange} className="w-full file-input file-input-bordered" />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold">Keterangan:</label>
        <textarea
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="textarea textarea-bordered"
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold">Status Pengerjaan:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select select-bordered"
        >
          <option value="belum">Belum Selesai</option>
          <option value="selesai">Sudah Selesai</option>
        </select>
      </div>
      <button type="submit" className="mt-4 btn btn-primary">Kirim Pekerjaan</button>
    </form>
  );
};

export default FormPengerjaanTugas;
