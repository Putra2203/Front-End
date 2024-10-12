import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../Assets/diskominfo.png";
import { axiosJWTadmin } from "../config/axiosJWT";
import ImageOverlay from "../Components/Admin/ImageOverlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import icon from "../Assets/icon.png";
import EditTugas from "../Components/Admin/EditTugas";
import NavSidebar from "./NavSidebar";
import { HiOutlinePlusSmall } from "react-icons/hi2";


export const Penugasan = () => {
  const [showNav, setShowNav] = useState(false);
  const [activeTasks, setActiveTasks] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeNow, setTimeNow] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tugas, setTugas] = useState([]); // Inisialisasi sebagai array kosong
  const [idtugas, setIdTugas] = useState("");
  const navigate = useNavigate();

  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const handleNavLinkClick = (path) => {
    setActiveLink(path);
  };

  const [formData, setFormData] = useState({
    judul: "",
    tugas_url: "",
    dueDate: "",
  });

  const [showEditTugasModal, setShowEditTugasModal] = useState(false);
  const [selectedTugasId, setSelectedTugasId] = useState(null);

  const handleEditTugas = (tugasId) => {
    setSelectedTugasId(tugasId);
    setShowEditTugasModal(true);
  };

  const handleCloseEditTugasModal = () => {
    getTugas();
    setSelectedTugasId(null);
    setShowEditTugasModal(false);
  };

  const [judulError, setJudulError] = useState("");
  const [deskripsiError, setDeskripsiError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");

  useEffect(() => {
    getTugasById();
    getTugas();
    fetchCurrentTime();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const exportPenugasan = async (tugasId) => {
    try {
      if (tugasId) {
        const response = await axiosJWTadmin.get(
          `http://localhost:3000/admin/tugas/${tugasId}/export-tugas`,
          {
            responseType: "arraybuffer",
          }
        );
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Penugasan.xlsx";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Tugas ID tidak tersedia");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (Array.isArray(tugas)) {
      const activeTaskCount = tugas.filter((tugas) => {
        const dueDate = new Date(tugas.dueDate);
        return dueDate > currentTime;
      }).length;
      setActiveTasks(activeTaskCount);
    }
  }, [currentTime, tugas]);

  const fetchCurrentTime = async () => {
    try {
      const response = await fetch(
        "https://worldtimeapi.org/api/timezone/Asia/Jakarta"
      );
      const data = await response.json();
      const dateTimeString = data.datetime;
      const dateTime = new Date(dateTimeString);

      const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
      const timeOptions = { hour: "2-digit", minute: "2-digit" };

      const date = dateTime.toLocaleDateString(undefined, dateOptions);
      const time = dateTime.toLocaleTimeString(undefined, timeOptions);

      const dateTimeStringFormatted = `${date} - ${time}`;
      setTimeNow(dateTimeStringFormatted);
    } catch (error) {
      console.error("Error fetching current time:", error);
    }
  };

  function formatDueDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const addTugas = async (e) => {
    e.preventDefault();

    let isValid = true;
    if (formData.judul.trim() === "") {
      setJudulError("Judul tugas wajib diisi!");
      isValid = false;
    } else {
      setJudulError("");
    }

    if (formData.tugas_url.trim() === "") {
      setDeskripsiError("Deskripsi tugas wajib diisi!");
      isValid = false;
    } else {
      setDeskripsiError("");
    }

    const dueDateTime = new Date(formData.dueDate);
    const currentTime = new Date();
    const twoHoursAhead = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);

    if (!formData.dueDate || dueDateTime <= twoHoursAhead) {
      setDeadlineError("Deadline harus setidaknya 2 jam dari sekarang.");
      isValid = false;
    } else {
      setDeadlineError("");
    }

    if (isValid) {
      try {
        await axiosJWTadmin.post(
          "http://localhost:3000/admin/tugas/add",
          formData
        );
        getTugas();
        setShowTaskForm(false);
        toast.success("Tugas berhasil ditambahkan!", { position: "top-right" });
        setFormData({
          judul: "",
          tugas_url: "",
          dueDate: "",
        });
      } catch (error) {
        navigate("/");
      }
    }
  };

  const updateTugasData = (updatedTugas) => {
    setTugas((prevTugas) =>
      prevTugas.map((tugas) =>
        tugas.id === updatedTugas.id ? { ...tugas, ...updatedTugas } : tugas
      )
    );
  };

  const getTugas = async () => {
    try {
      const response = await axiosJWTadmin.get(
        "http://localhost:3000/admin/tugas"
      );
      setTugas(response.data.tugas);
    } catch (error) {
      navigate("/");
    }
  };

  const [statustugas, setStatusTugas] = useState([]);

  const getTugasById = async (taskId, index) => {
    try {
      const response = await axiosJWTadmin.get(
        `http://localhost:3000/admin/tugas/${taskId}`
      );
      setStatusTugas(response.data.tugas);
      setIdTugas(taskId);
      setSelectedItemIndex(index);
    } catch (error) {
      navigate("/");
    }
  };

  const deleteTugas = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      try {
        await axiosJWTadmin.delete(
          `http://localhost:3000/admin/tugas/${id}/delete`
        );
        getTugas();
        toast.success("Tugas berhasil dihapus!", { position: "top-right" });
      } catch (error) {
        navigate("/");
        toast.error("Gagal menghapus tugas");
      }
    }
  };

  const handleShowTaskForm = () => {
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
  };

  return (
    <div className="flex flex-col w-full">
      <NavSidebar />
      <div className="h-screen pl-0 lg:pl-64">
        <div className="flex flex-col p-4">
          <div className="body-penugasan">
            <div className="flex flex-col gap-2 lg:justify-between lg:flex-row lg:gap-0">
              <p className="mt-24 text-2xl font-semibold lg:text-4xl font-poppins lg:mt-0">
                Penugasan Magang - SISAPPMA
              </p>
              <div className="bg-[#183028] px-4 text-white py-4 text-center rounded-lg">
                <p>Tanggal Hari Ini</p>
                <p>{timeNow}</p>
              </div>
            </div>
            <section className="flex flex-col gap-2 mt-2 lg:mt-0">
              <div className="bg-[#183028] px-4 text-white py-4 text-center rounded-lg hover:bg-slate-400 w-44">
                <button
                  onClick={handleShowTaskForm}
                  className="flex flex-row items-center justify-center gap-4"
                >
                  Tambah Tugas <HiOutlinePlusSmall />
                </button>
              </div>
              <div className="flex flex-row justify-between">
                <p className="bg-[#183028] px-4 text-white py-4 text-center rounded-lg">
                  Jumlah Tugas Aktif : {activeTasks}
                </p>
                <button
                  onClick={() => exportPenugasan(idtugas)}
                  className="bg-[#183028] px-4 text-white py-4 text-center rounded-lg hover:bg-slate-400"
                >
                  Export to Excel
                </button>
              </div>
            </section>

            <section id="informasi-penugasan">
              <div className="mt-4">
                {/* table */}
                <div className="p-10 overflow-x-auto bg-slate-200 rounded-2xl">
                  <table className="table w-full text-center">
                    <thead>
                      <tr className="text-black">
                        <th>No</th>
                        <th>Judul</th>
                        <th>Deskripsi</th>
                        <th>Deadline</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(tugas) && tugas.length > 0 ? (
                        tugas.map((tugas, index) => (
                          <tr key={tugas.id}>
                            <td>{index + 1}</td>
                            <td>{tugas.judul}</td>
                            <td>{tugas.tugas_url}</td>
                            <td>{formatDueDate(tugas.dueDate)}</td>
                            <td>
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => getTugasById(tugas.id, index)}
                                  className="px-4 text-white bg-blue-500 rounded-2xl hover:bg-slate-400"
                                >
                                  Detail
                                </button>
                                <button
                                  onClick={() => handleEditTugas(tugas.id)}
                                  className="px-4 text-white bg-[#183028] rounded-2xl hover:bg-slate-400"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteTugas(tugas.id)}
                                  className="px-4 text-white bg-red-500 rounded-2xl hover:bg-slate-400"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">Tidak ada tugas yang tersedia</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <EditTugas
                    tugasId={selectedTugasId}
                    handleCloseModal={handleCloseEditTugasModal}
                    showEditTugasModal={showEditTugasModal}
                    updateTugasData={updateTugasData}
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-4 text-xl font-semibold text-center font-poppins">
                  Detail Penugasan
                </p>
                <div className="p-10 overflow-x-auto bg-slate-200 rounded-2xl">
                  <table className="table w-full text-center">
                    <thead>
                      <tr className="text-black">
                        <th>Nama</th>
                        <th>Lampiran Pekerjaan</th>
                        <th>Status Pengerjaan</th>
                        <th>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(statustugas) && statustugas.length > 0 ? (
                        statustugas.map((tugas, index) => (
                          <tr key={tugas.id}>
                            <td>{tugas.nama}</td>
                            <td>
                              {tugas.status_tugas &&
                              tugas.status_tugas[0] &&
                              tugas.status_tugas[0].status_pengerjaan ? (
                                <button
                                  onClick={() => {
                                    setSelectedImageUrl(
                                      tugas.status_tugas[0].tugas_url
                                    );
                                    setSelectedItemIndex(index);
                                    setShowImageOverlay(true);
                                  }}
                                  className="text-blue-500 button is-small is-info"
                                >
                                  Lihat hasil pekerjaan
                                </button>
                              ) : tugas.status_tugas &&
                                tugas.status_tugas[0] &&
                                tugas.status_tugas[0].tugas_url ? (
                                <button
                                  onClick={() => {
                                    setSelectedImageUrl(
                                      tugas.status_tugas[0].tugas_url
                                    );
                                    setSelectedItemIndex(selectedItemIndex);
                                    setShowImageOverlay(true);
                                  }}
                                  className="button is-small is-danger"
                                >
                                  Lihat Gambar
                                </button>
                              ) : (
                                "Belum Mengerjakan"
                              )}
                            </td>
                            <td>
                              {tugas.status_tugas
                                ? tugas.status_tugas[0] &&
                                  tugas.status_tugas[0].status_pengerjaan
                                  ? "Sudah Selesai"
                                  : "Belum Selesai"
                                : "Belum Selesai"}
                            </td>
                            <td>
                              {tugas.status_tugas
                                ? tugas.status_tugas[0]
                                  ? tugas.status_tugas[0].status_pengerjaan
                                    ? tugas.status_tugas[0].keterangan === true
                                      ? "Tepat waktu"
                                      : "Terlambat"
                                    : "-"
                                  : "-"
                                : "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">Belum ada status tugas</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {showImageOverlay && (
                    <ImageOverlay
                      imageUrl={selectedImageUrl}
                      onClose={() => setShowImageOverlay(false)}
                    />
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
        {showTaskForm && (
          <div className="modal modal-open">
            <div className="modal-box bg-secondary">
              <div className="flex items-center justify-between">
                <h5 className="text-xl font-semibold font-poppins">
                  Form Penugasan
                </h5>
                <button
                  className="px-2 bg-red-500 py-0.5 hover:bg-slate-400 rounded-lg"
                  onClick={handleCloseTaskForm}
                >
                  &times;
                </button>
              </div>
              <div className="mt-4">
                <form onSubmit={addTugas} className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <label>Judul</label>
                    <input
                      type="text"
                      value={formData.judul}
                      className="text-black border rounded-lg bg-slate-50"
                      onChange={(e) => {
                        setFormData({ ...formData, judul: e.target.value });
                        setJudulError("");
                      }}
                    />
                    {judulError && <p className="text-red-500">{judulError}</p>}
                  </div>
                  <div className="flex justify-between">
                    <label>Deskripsi</label>
                    <textarea
                      value={formData.tugas_url}
                      className="h-64 text-black border rounded-lg bg-slate-50 w-60"
                      onChange={(e) => {
                        setFormData({ ...formData, tugas_url: e.target.value });
                        setDeskripsiError("");
                      }}
                    />
                    {deskripsiError && (
                      <p className="text-red-500">{deskripsiError}</p>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <label>Deadline</label>
                    <input
                      type="datetime-local"
                      className="px-4 text-black border rounded-lg bg-slate-50"
                      value={
                        formData.dueDate ? formData.dueDate.slice(0, 16) : ""
                      }
                      onChange={(e) => {
                        setFormData({ ...formData, dueDate: e.target.value });
                        setDeadlineError("");
                      }}
                    />
                    {deadlineError && (
                      <p style={{ color: "red", fontSize: "14px" }}>
                        {deadlineError}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-4 py-1 text-white bg-[#183028] rounded-2xl hover:bg-slate-400"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Penugasan;
