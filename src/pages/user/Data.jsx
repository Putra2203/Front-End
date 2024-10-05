import React, { useEffect, useState } from 'react';
import Sidebar from './Navbar';
import axios from 'axios';

const Data = () => {
  const [presensi, setPresensi] = useState([]);

  useEffect(() => {
    // Fetch data presensi dari API atau backend
    axios.get('/api/presensi')
      .then((response) => {
        setPresensi(response.data);
      })
      .catch((error) => {
        console.error('Error fetching presensi data:', error);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-[13%]">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-8">History Presensi - SISAPPMA</h1>

        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Lokasi Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Check-Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Lokasi Check-Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Image In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Image Out
                </th>
              </tr>
            </thead>
            <tbody>
              {presensi.length > 0 ? (
                presensi.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.tanggal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.checkIn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.lokasiCheckIn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.checkOut}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.lokasiCheckOut}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.imageIn ? 'Ada' : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.imageOut ? 'Ada' : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm">
                    Tidak ada data presensi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Data;
