import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const UserPages = () => {
  const [userData, setUserData] = useState({
    profilePicture: '',
    name: '',
    username: '',
    remainingTime: '',
    attendancePercentage: 0,
  });
  const [presensi, setPresensi] = useState([]);
  const [penugasan, setPenugasan] = useState([]);

  useEffect(() => {
    // Fetch user data from the database
    axios.get('/api/user')
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

    // Fetch presensi data from the database
    axios.get('/api/presensi')
      .then(response => {
        setPresensi(response.data);
      })
      .catch(error => {
        console.error('Error fetching presensi data:', error);
      });

    // Fetch penugasan data from the database
    axios.get('/api/penugasan')
      .then(response => {
        setPenugasan(response.data);
      })
      .catch(error => {
        console.error('Error fetching penugasan data:', error);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <div className="md:w-[13%]">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Dashboard - SISAPPMA</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Presensi */}
          <div className="md:col-span-2 bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Presensi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {presensi.map((item, index) => (
                <div key={index} className={`flex items-center p-3 md:p-4 rounded-lg ${item.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                  {item.status === 'completed' ? <FiCheckCircle className="mr-2" /> : <FiXCircle className="mr-2" />}
                  {item.date}
                </div>
              ))}
            </div>
          </div>

          {/* Sisa Waktu Magang */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
            <h2 className="text-md md:text-lg font-semibold mb-2">Sisa Waktu Magang</h2>
            <p className="text-xl md:text-2xl font-bold">{userData.remainingTime}</p>
          </div>

          {/* Penugasan */}
          <div className="md:col-span-2 bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Penugasan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {penugasan.map((task, index) => (
                <div key={index} className={`flex items-center p-3 md:p-4 rounded-lg ${task.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                  {task.status === 'completed' ? <FiCheckCircle className="mr-2" /> : <FiXCircle className="mr-2" />}
                  {task.title}
                </div>
              ))}
            </div>
          </div>

          {/* Presentase Kehadiran */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
            <h2 className="text-md md:text-lg font-semibold mb-2">Presentase Kehadiran</h2>
            <div className="relative w-24 h-24 md:w-40 md:h-40 mx-auto mb-4">
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-300"
                  strokeDasharray="100, 100"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  className="text-blue-600"
                  strokeDasharray={`${userData.attendancePercentage}, 100`}
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <p className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl font-bold">{userData.attendancePercentage}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPages;
