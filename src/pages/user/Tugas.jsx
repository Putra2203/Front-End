import React, { useEffect, useState } from "react";
import Cards from "../../Assets/Cards";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { axiosJWTuser } from "../../config/axiosJWT";
import { isUnauthorizedError } from "../../config/errorHandling";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Navbar";

function Tugas() {
  const [cardData, setData] = useState([]);
  const navigate = useNavigate();

  // Menyortir tugas berdasarkan deadline
  const filterTasksByDueDate = (dueDate, filterType) => {
    const currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const taskDueDate = new Date(dueDate);
    currentDate.setHours(0, 0, 0, 0);
    taskDueDate.setHours(0, 0, 0, 0);

    switch (filterType) {
      case "today":
        return (
          taskDueDate.getDate() === currentDate.getDate() &&
          taskDueDate.getMonth() === currentDate.getMonth() &&
          taskDueDate.getFullYear() === currentDate.getFullYear()
        );
      case "nextWeek":
        const nextWeek = new Date(currentDate.getTime() + 7 * oneDay);
        return taskDueDate > currentDate && taskDueDate <= nextWeek;
      case "all":
        return true;
      default:
        return false;
    }
  };

  // Variabel yang berisi tugas terpisah berdasarkan deadline
  const dueTodayTasks = cardData.filter((card) =>
    filterTasksByDueDate(card.tugas.dueDate, "today")
  );
  const nextWeekTasks = cardData.filter((card) =>
    filterTasksByDueDate(card.tugas.dueDate, "nextWeek")
  );
  const allTasks = cardData.filter((card) =>
    filterTasksByDueDate(card.tugas.dueDate, "all")
  );

  // Mengambil data tugas dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ambilid = await axios.get("http://localhost:3000/account/token", {
          headers: {
            role: "peserta_magang",
          },
        });
        const decoded = jwt_decode(ambilid.data.token);

        const response = await axiosJWTuser.get(
          `http://localhost:3000/user/tugas-list/${decoded.userId}`
        );
        setData(response.data.tugas);
      } catch (error) {
        if (isUnauthorizedError(error)) {
          navigate("/");
        }
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <Sidebar />
      <div className="pl-64">
        <div className="container flex flex-col p-4">
          <h1 className="ml-4 text-2xl font-semibold">Penugasan - SISAPPMA</h1>
          

          {/* Main Content */}
          <div className="p-6">
            {/* Tenggat Hari Ini */}
            <h2 className="mb-4 text-xl font-semibold">Tenggat Hari Ini</h2>
            {!dueTodayTasks.length ? (
              <p className="text-gray-600">Tidak ada tugas untuk hari ini.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dueTodayTasks.map((card) => (
                  <Cards key={card.id} data={card} setData={setData} />
                ))}
              </div>
            )}

            {/* Tenggat dalam 7 Hari */}
            <h2 className="mt-10 mb-4 text-xl font-semibold">
              Tenggat dalam 7 Hari
            </h2>
            {!nextWeekTasks.length ? (
              <p className="text-gray-600">
                Tidak ada tugas dalam 7 hari ke depan.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {nextWeekTasks.map((card) => (
                  <Cards key={card.id} data={card} setData={setData} />
                ))}
              </div>
            )}

            {/* Semua Tugas */}
            <h2 className="mt-10 mb-4 text-xl font-semibold">Semua Tugas</h2>
            {!allTasks.length ? (
              <p className="text-gray-600">
                Tidak ada tugas yang harus dikerjakan.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allTasks.map((card) => (
                  <Cards key={card.id} data={card} setData={setData} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tugas;
