import React, { useEffect, useState } from "react";
import Sidebar from "./Navbar";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const Data = () => {
  const [presensi, setPresensi] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch token and presensi data
  const fetchToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "peserta_magang",
        },
      });
      const decoded = jwt_decode(response.data.token);
      return decoded.userId;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        console.error("Error fetching token", error);
      }
      return null;
    }
  };

  const fetchDataAndPresensiData = async () => {
    try {
      const userId = await fetchToken();
      if (!userId) return;

      const response = await axios.get(
        `http://localhost:3000/user/presensi/${userId}`
      );

      const dataWithKosong = response.data.presensi.map((item) => ({
        ...item,
        check_in: item.check_in || "Belum Presensi",
        check_out: item.check_out || "Belum Presensi",
        tanggal: new Date(item.tanggal),
      }));

      setPresensi(dataWithKosong);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchDataAndPresensiData();
  }, []);

  const events = presensi.map((item) => {
    let color;

    if (item.check_in !== "Belum Presensi" && item.check_out !== "Belum Presensi") {
      color = "green"; // Both check-in and check-out are present
    } else if (item.check_in !== "Belum Presensi" || item.check_out !== "Belum Presensi") {
      color = "yellow"; // Either check-in or check-out is present
    } else {
      color = "red"; // Both are absent
    }

    return {
      title: `${item.nama} - Check-in: ${item.check_in}, Check-out: ${item.check_out}`,
      start: item.tanggal,
      end: item.tanggal,
      allDay: true,
      data: item,
      color, // Add color property
    };
  });

  // Custom Event Component to style based on color
  const CustomEvent = ({ event }) => (
    <div style={{ backgroundColor: event.color, padding: "5px", borderRadius: "4px", color: "#fff" }}>
      {event.title}
    </div>
  );

  const handleEventSelect = (event) => {
    setSelectedEvent(event.data);
  };

  const closeEventModal = () => setSelectedEvent(null);

  return (
    <div className="flex flex-col w-full">
      <Sidebar />
      <div className="h-screen pl-0 mt-24 lg:pl-64 lg:mt-0">
        <div className="container flex flex-col p-4">
          <h1 className="mb-8 text-3xl font-bold">
            Calendar View - History Presensi
          </h1>
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              onSelectEvent={handleEventSelect}
              components={{
                event: CustomEvent, // Use the custom event component
              }}
            />
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-bold">{selectedEvent.nama}</h2>
            <p>
              <strong>Tanggal:</strong>{" "}
              {moment(selectedEvent.tanggal).format("DD-MM-YYYY")}
            </p>
            <p>
              <strong>Check-in:</strong> {selectedEvent.check_in}
            </p>
            <p>
              <strong>Lokasi Check-in:</strong>{" "}
              {selectedEvent.lokasi_in || "Belum Presensi"}
            </p>

            {selectedEvent.image_url_in ? (
              <div className="my-2">
                <strong>Image In:</strong>
                <img
                  src={selectedEvent.image_url_in}
                  alt="Presensi In"
                  className="object-cover w-32 h-32 mx-auto mt-2 rounded-lg"
                />
              </div>
            ) : (
              <p>Image In: Belum Presensi</p>
            )}

            <p>
              <strong>Check-out:</strong> {selectedEvent.check_out}
            </p>
            <p>
              <strong>Lokasi Check-out:</strong>{" "}
              {selectedEvent.lokasi_out || "Belum Presensi"}
            </p>

            {selectedEvent.image_url_out ? (
              <div className="my-2">
                <strong>Image Out:</strong>
                <img
                  src={selectedEvent.image_url_out}
                  alt="Presensi Out"
                  className="object-cover w-32 h-32 mx-auto mt-2 rounded-lg"
                />
              </div>
            ) : (
              <p>Image Out: Belum Presensi</p>
            )}

            <div className="mt-4 modal-action">
              <button
                className="w-full btn btn-error"
                onClick={closeEventModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Data;
