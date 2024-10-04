import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Navbar'; // Pastikan path ini benar

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

  useEffect(() => {
    // Fetch task data from the database
    axios.get('/api/tasks')
      .then(response => {
        const { proses, selesai } = response.data;
        setTasks({ proses, selesai });
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Post form data to database
    axios.post('/api/submit-task', formData)
      .then(() => {
        setSuccessMessage('Tugas Berhasil Dikumpulkan!');
        setPengumpulanStatus('Dikirimkan untuk dinilai');
        setLastUpdated(new Date().toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        
        // Optionally, clear form data after successful submission
        setFormData({
          komentar: '',
          linkPengumpulan: '',
        });
      })
      .catch(error => {
        console.error('Error submitting task:', error);
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Panggil Sidebar */}
      <Sidebar />

      {/* Konten utama */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">Penugasan - SISAPPMA</h1>

        {/* Success message after submission */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 mb-8 rounded-lg">
            🎉 {successMessage} 🎉
            <br />
            Selamat, Tugasmu telah berhasil diunggah dan diterima oleh sistem.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bagian Proses */}
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

            <h2 className="text-xl font-semibold mt-8 mb-4">Selesai</h2>
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
          <div className="bg-white p-6 rounded-lg shadow-md border">
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

const TaskCard = ({ title, description, dueDate }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="font-bold">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
    <p className="text-sm text-gray-600">📅 Due {dueDate}</p>
  </div>
);

export default Tugas;
