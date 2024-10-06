import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Pastikan path file Navbar benar

const Tugas = () => {
  const [tasks, setTasks] = useState({
    proses: [],
    selesai: [],
  });
  const [formData, setFormData] = useState({
    komentar: '',
    linkPengumpulan: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [pengumpulanStatus, setPengumpulanStatus] = useState('Belum Dikirim');
  const [lastUpdated, setLastUpdated] = useState('-');
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken(); // Refresh token ketika komponen dimuat
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:3000/account/token', {
        headers: {
          'role': 'peserta_magang',
        },
      });
      const decoded = jwt_decode(response.data.token);

      // Menyimpan token untuk penggunaan API berikutnya
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      // Setelah mendapatkan token, lakukan permintaan data
      fetchTasks();
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Jika token tidak valid, arahkan ke halaman login
      navigate('/');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      const { proses, selesai } = response.data;
      setTasks({ proses, selesai });
    } catch (error) {
      console.error('Error mendapatkan data tugas:', error);
      if (error.response && error.response.status === 401) {
        navigate('/'); // Arahkan ke halaman login jika tidak terautentikasi
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mengirimkan data form ke database
    axios.post('/api/submit-task', formData)
      .then(() => {
        setSuccessMessage('Tugas Berhasil Dikumpulkan!');
        setPengumpulanStatus('Dikirimkan untuk dinilai');
        setLastUpdated(new Date().toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

        // Reset form setelah berhasil dikirim
        setFormData({
          komentar: '',
          linkPengumpulan: '',
        });
      })
      .catch(error => {
        console.error('Error saat mengirim tugas:', error);
        if (error.response && error.response.status === 401) {
          navigate('/'); // Arahkan ke halaman login jika tidak terautentikasi
        }
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="md:w-[13%]">
        <Navbar />
      </div>

      {/* Konten Utama */}
      <div className="flex-1 p-4 md:p-10 mt-5 md:ml-10 md:mt-0">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 mt-20 md:mt-0">Penugasan - SISAPPMA</h1>

        {/* Pesan sukses setelah pengumpulan tugas */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 mb-4 rounded-lg">
            🎉 {successMessage} 🎉
            <br />
            Selamat, Tugasmu telah berhasil diunggah dan diterima oleh sistem.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Bagian Tugas Proses */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Proses</h2>
            <div className="space-y-4">
              {tasks.proses.length > 0 ? (
                tasks.proses.map((task, index) => (
                  <TaskCard key={index} title={task.title} description={task.description} dueDate={task.dueDate} />
                ))
              ) : (
                <p className="text-gray-600">Tidak ada tugas dalam proses.</p>
              )}
            </div>

            <h2 className="text-xl font-semibold mt-4 mb-4">Selesai</h2>
            <div className="space-y-4">
              {tasks.selesai.length > 0 ? (
                tasks.selesai.map((task, index) => (
                  <TaskCard key={index} title={task.title} description={task.description} dueDate={task.dueDate} />
                ))
              ) : (
                <p className="text-gray-600">Tidak ada tugas yang sudah selesai.</p>
              )}
            </div>
          </div>

          {/* Bagian Form Pengumpulan */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-4">Pengumpulan</h2>
            <div className="space-y-2 text-sm">
              <p>Status Pengumpulan: <span className="font-bold">{pengumpulanStatus}</span></p>
              <p>Terakhir Diubah: <span className="font-bold">{lastUpdated}</span></p>
              <p>Pengumpulan Link: <span className="font-bold">{formData.linkPengumpulan || '-'}</span></p>
              <p>Komentar: <span className="font-bold">Komentar (0)</span></p>
            </div>

            <div className="mb-4 mt-4">
              <textarea
                value={formData.komentar}
                onChange={(e) => setFormData({ ...formData, komentar: e.target.value })}
                className="w-full p-3 border rounded-lg text-sm"
                rows="4"
                placeholder="Tambahkan komentar"
              ></textarea>
            </div>

            <button onClick={handleSubmit} className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full text-center">
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen TaskCard untuk menampilkan tugas
const TaskCard = ({ title, description, dueDate }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="font-bold">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
    <p className="text-sm text-gray-600">📅 Tanggal Pengumpulan: {dueDate}</p>
  </div>
);

export default Tugas;
