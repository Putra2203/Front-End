import { axiosJWTadmin } from "../config/axiosJWT";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditUser from "../Components/Admin/EditUser";
import AddUser from "../Components/Admin/AddUser";
import NavSidebar from "./NavSidebar";
import { IoIosSearch } from "react-icons/io";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import ExportPeserta from "../Components/Admin/ExportPeserta";
import ExportPesertaAktif from "../Components/Admin/ExportPesertaAktif";
import ExportPesertaAlumni from "../Components/Admin/ExportPesertaAlumni";
import ExportPesertaCalon from "../Components/Admin/ExportPesertaCalon";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export const Peserta = () => {
  const [users, setUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [editingUserId, setEditingUserId] = useState(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(""); 
  const [allUsers, setAllUsers] = useState([]); 
  const [showRekapAbsenModal, setShowRekapAbsenModal] = useState(false);
  const [presensi, setPresensi] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getUsers(activeCategory).finally(() => {
      setIsLoading(false);
      setShouldRefresh(false);
    });
  }, [activeCategory, shouldRefresh]);

  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    password: "",
    asal_univ: "",
    asal_jurusan: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    no_telp: "",
  });

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const getUsers = async (category) => {
    try {
      let endpoint;
      switch (category) {
        case "2":
          endpoint = "peserta-aktif";
          break;
        case "1":
          endpoint = "peserta-alumni";
          break;
        case "3":
          endpoint = "peserta-calon";
          break;
        default:
          endpoint = "peserta";
      }

      const response = await axiosJWTadmin.get(
        `http://localhost:3000/admin/${endpoint}`
      );

      setAllUsers(response.data.peserta_magang); 
      setUsers(response.data.peserta_magang); 
      setActiveCategory(category); 
    } catch (error) {
      navigate("/");
      console.log(error);
    }
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false); 
    setFormData({
      nama: "",
      username: "",
      password: "",
      asal_univ: "",
      asal_jurusan: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      no_telp: "",
    });
  };

  const handleShowTaskForm = () => setShowTaskForm(true); 

  const handleOpenEditUserModal = (userId) => {
    setEditingUserId(userId);
    setShowEditUserModal(true);
  };

  const handleCloseEditUserModal = () => {
    setShowEditUserModal(false);
    getUsers(activeCategory);
  };

  const fetchPresensiData = async (userId) => {
    try {
      const response = await axiosJWTadmin.get(
        `http://localhost:3000/user/presensi/${userId}`
      );
      const dataWithDefaults = response.data.presensi.map((item) => ({
        ...item,
        check_in: item.check_in || "Belum Presensi",
        check_out: item.check_out || "Belum Presensi",
        tanggal: new Date(item.tanggal),
      }));
      setPresensi(dataWithDefaults);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const handleShowRekapAbsen = (userId) => {
    fetchPresensiData(userId);
    setShowRekapAbsenModal(true);
  };

  const closeRekapAbsenModal = () => {
    setShowRekapAbsenModal(false);
    setSelectedEvent(null);
  };

  const events = presensi.map((item) => ({
    title: `Check-in: ${item.check_in}, Check-out: ${item.check_out}`,
    start: item.tanggal,
    end: item.tanggal,
    allDay: true,
    data: item,
  }));

  const handleEventSelect = (event) => {
    setSelectedEvent(event.data);
  };

  const filteredUsers = users.filter((user) =>
    user.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const displayedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterByMonth = (month) => {
    setSelectedMonth(month); 

    if (month !== "") {
      const filtered = allUsers.filter((user) => {
        const startDate = new Date(user.tanggal_mulai); 
        const endDate = new Date(user.tanggal_selesai); 
        return (
          startDate.getMonth() + 1 === parseInt(month) ||
          endDate.getMonth() + 1 === parseInt(month)
        );
      });
      setUsers(filtered); 
    } else {
      setUsers(allUsers); 
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      try {
        await axiosJWTadmin.delete(
          `http://localhost:3000/admin/peserta/${id}/delete`
        );
        getUsers();
        toast.success("Pengguna berhasil dihapus.");
      } catch (error) {
        navigate("/");
        toast.error("Gagal menghapus pengguna.");
        console.log(error);
      }
    }
  };

  const calculateRemainingDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const timeDiff = end - today;
    return timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) : 0;
  };

  return (
    <div className="flex flex-col w-full">
      <NavSidebar />
      <div className="h-screen pl-0 lg:pl-64">
        <div className="flex flex-col p-4 ">
          <p className="mt-24 text-2xl font-semibold lg:text-4xl font-poppins lg:mt-0">
            Daftar Peserta Magang - SISAPPMA
          </p>

          <div className="relative w-64 mt-4">
            <input
              type="text"
              placeholder="Cari Peserta..."
              onChange={handleSearch}
              className="w-64 px-4 border rounded-3xl bg-slate-200"
            />
            <i className="absolute top-1 right-3">
              <IoIosSearch />
            </i>
          </div>

          <div className="flex flex-col items-start justify-start gap-4 mt-4 lg:items-center lg:justify-between lg:flex-row">
            <div className="flex flex-col gap-4 lg:flex-row">
              <button
                onClick={handleShowTaskForm}
                className="bg-[#183028] px-4 py-1 text-white mb-4 rounded-3xl hover:bg-slate-400 flex items-center gap-2"
              >
                Tambah Peserta <HiOutlinePlusSmall />
              </button>
              <div className="dropdown">
                <select
                  value={activeCategory}
                  onChange={(e) => getUsers(e.target.value)}
                  className="bg-[#183028] px-4 py-1 text-white mb-4 rounded-3xl hover:bg-slate-400 "
                >
                  <option value="all">Semua Peserta</option>
                  <option value="2">Peserta Aktif</option>
                  <option value="1">Peserta Alumni</option>
                  <option value="3">Peserta Calon</option>
                </select>
              </div>
              <div className="dropdown">
                <select
                  value={selectedMonth}
                  onChange={(e) => handleFilterByMonth(e.target.value)} 
                  className="bg-[#183028] px-4 py-1 text-white mb-4 rounded-3xl hover:bg-slate-400"
                >
                  <option value="">Periode / Bulan</option>
                  <option value="01">Januari</option>
                  <option value="02">Februari</option>
                  <option value="03">Maret</option>
                  <option value="04">April</option>
                  <option value="05">Mei</option>
                  <option value="06">Juni</option>
                  <option value="07">Juli</option>
                  <option value="08">Agustus</option>
                  <option value="09">September</option>
                  <option value="10">Oktober</option>
                  <option value="11">November</option>
                  <option value="12">Desember</option>
                </select>
              </div>
            </div>
            <p className="bg-[#183028] px-4 py-1 text-white mb-4 rounded-3xl ">
              Jumlah Peserta:{" "}
              {searchTerm === "" ? users.length : filteredUsers.length} Peserta
            </p>
          </div>

          <div className="flex flex-col gap-0 lg:gap-4 lg:flex-row">
            <ExportPeserta />
            <ExportPesertaAktif />
            <ExportPesertaAlumni />
            <ExportPesertaCalon />
          </div>

          <div className="p-10 overflow-x-auto bg-slate-200 rounded-2xl">
            <table className="table text-center table-zebra w-wfull">
              <thead>
                <tr className="text-black">
                  <th>No</th>
                  <th>Nama</th>
                  <th>Universitas</th>
                  <th>Jurusan</th>
                  <th>No Telp</th>
                  <th>Tanggal Mulai</th>
                  <th>Tanggal Selesai</th>
                  <th>Nama Pembimbing</th>
                  <th>No Pembimbing</th>
                  <th>Penempatan</th>
                  <th>Sisa Hari</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="12">Loading...</td>
                  </tr>
                ) : (
                  displayedUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.nama}</td>
                      <td>{user.asal_univ}</td>
                      <td>{user.asal_jurusan}</td>
                      <td>{user.no_telp}</td>
                      <td>{user.tanggal_mulai}</td>
                      <td>{user.tanggal_selesai}</td>
                      <td>{user.nama_dosen}</td>
                      <td>{user.no_telp_dosen}</td>
                      <td>{user.penempatan}</td>
                      <td>{calculateRemainingDays(user.tanggal_selesai)}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="bg-[#183028] text-white rounded-3xl hover:bg-slate-400"
                            style={{ minWidth: "60px" }}
                            onClick={() => handleOpenEditUserModal(user.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-[#183028] text-white rounded-3xl hover:bg-slate-400"
                            style={{ minWidth: "60px" }}
                            onClick={() => handleShowRekapAbsen(user.id)}
                          >
                            Rekap Absen
                          </button>
                          <button
                            className="text-white bg-red-500 rounded-3xl hover:bg-slate-400"
                            style={{ minWidth: "60px" }}
                            onClick={() => deleteUser(user.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4 join">
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            <button className="join-item btn">
              Page {currentPage} of {totalPages}
            </button>
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      </div>

      {showEditUserModal && (
        <EditUser
          userId={editingUserId}
          handleCloseModal={handleCloseEditUserModal}
          showEditUserModal={showEditUserModal}
          updateUserData={() => getUsers(activeCategory)}
        />
      )}

      {showTaskForm && (
        <AddUser
          handleClose={handleCloseTaskForm}
          refreshData={() => getUsers(activeCategory)}
        />
      )}

      {showRekapAbsenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-lg">
            <button onClick={closeRekapAbsenModal} className="float-right text-red-500">Close</button>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              onSelectEvent={handleEventSelect}
            />
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-bold">{selectedEvent.nama}</h2>
            <p>
              <strong>Tanggal:</strong> {moment(selectedEvent.tanggal).format("DD-MM-YYYY")}
            </p>
            <p><strong>Check-in:</strong> {selectedEvent.check_in}</p>
            <p><strong>Lokasi Check-in:</strong> {selectedEvent.lokasi_in || "Belum Presensi"}</p>
            {selectedEvent.image_url_in ? (
              <div className="my-2">
                <strong>Image In:</strong>
                <img src={selectedEvent.image_url_in} alt="Presensi In" className="object-cover w-32 h-32 mx-auto mt-2 rounded-lg"/>
              </div>
            ) : <p>Image In: Belum Presensi</p>}
            <p><strong>Check-out:</strong> {selectedEvent.check_out}</p>
            <p><strong>Lokasi Check-out:</strong> {selectedEvent.lokasi_out || "Belum Presensi"}</p>
            {selectedEvent.image_url_out ? (
              <div className="my-2">
                <strong>Image Out:</strong>
                <img src={selectedEvent.image_url_out} alt="Presensi Out" className="object-cover w-32 h-32 mx-auto mt-2 rounded-lg"/>
              </div>
            ) : <p>Image Out: Belum Presensi</p>}
            <div className="mt-4 modal-action">
              <button className="w-full btn btn-error" onClick={() => setSelectedEvent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Peserta;
