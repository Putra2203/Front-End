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
  const [selectedMonth, setSelectedMonth] = useState(""); // State untuk menyimpan bulan yang dipilih
  const [allUsers, setAllUsers] = useState([]); // Untuk menyimpan semua data peserta yang asli

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

      setAllUsers(response.data.peserta_magang); // Simpan semua data asli
      setUsers(response.data.peserta_magang); // Atur data yang akan ditampilkan (bisa difilter nantinya)
      setActiveCategory(category); // Set kategori aktif
    } catch (error) {
      navigate("/");
      console.log(error);
    }
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false); // Menutup modal AddUser
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

  const handleShowTaskForm = () => setShowTaskForm(true); // Membuka modal AddUser

  const handleOpenEditUserModal = (userId) => {
    setEditingUserId(userId);
    setShowEditUserModal(true);
  };

  const handleCloseEditUserModal = () => {
    setShowEditUserModal(false);
    getUsers(activeCategory);
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
    setSelectedMonth(month); // Simpan bulan yang dipilih di state

    if (month !== "") {
      const filtered = allUsers.filter((user) => {
        const startDate = new Date(user.tanggal_mulai); // Konversi tanggal mulai ke objek Date
        const endDate = new Date(user.tanggal_selesai); // Konversi tanggal selesai ke objek Date
        return (
          startDate.getMonth() + 1 === parseInt(month) ||
          endDate.getMonth() + 1 === parseInt(month)
        );
      });
      setUsers(filtered); // Tampilkan data yang sudah difilter
    } else {
      setUsers(allUsers); // Reset ke data asli jika tidak ada bulan yang dipilih
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
                  onChange={(e) => handleFilterByMonth(e.target.value)} // Panggil fungsi filter ketika bulan dipilih
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
            <table className="table w-full text-center">
              <thead>
                <tr className="text-black">
                  <th>No</th>
                  <th>Nama</th>
                  <th>Universitas</th>
                  <th>Jurusan</th>
                  <th>No telp</th>
                  <th>Tanggal Mulai</th>
                  <th>Tanggal Selesai</th>
                  <th>Nama Dosen</th>
                  <th>No Dosen</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8">Loading...</td>
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
          {/* Pagination using DaisyUI */}
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
    </div>
  );
};

export default Peserta;
