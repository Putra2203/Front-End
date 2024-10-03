import { axiosJWTadmin } from "../config/axiosJWT";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../Assets/diskominfo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditUser from "../Components/Admin/EditUser";
import icon from "../Assets/icon.png";
import Footer from "./footer";
import { showSuccessNotification } from "../Components/User/toastSuccess";
import { showErrorNotification } from "../Components/User/toastFailed";

export const Peserta = () => {
  const [users, setUsers] = useState([]);
  const [showNav, setShowNav] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [editingUserId, setEditingUserId] = useState(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  
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

  const [validationErrors, setValidationErrors] = useState({});

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const getUsers = async (category) => {
    try {
      let endpoint;
      switch (category) {
        case "aktif":
          endpoint = "peserta-aktif";
          break;
        case "alumni":
          endpoint = "peserta-alumni";
          break;
        case "calon":
          endpoint = "peserta-calon";
          break;
        default:
          endpoint = "peserta";
      }

      const response = await axiosJWTadmin.get(
        `http://localhost:3000/admin/${endpoint}`
      );
      setUsers(response.data.peserta_magang);
      setActiveCategory(category);
    } catch (error) {
      navigate("/");
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getUsers(activeCategory).finally(() => setIsLoading(false));
  }, [activeCategory]);

  const saveUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axiosJWTadmin.post("http://localhost:3000/admin/peserta/add", formData);
      showSuccessNotification("Berhasil menambahkan peserta");
      handleCloseTaskForm();
      getUsers(activeCategory); // Refresh the list of users
    } catch (error) {
      showErrorNotification("Gagal menambahkan peserta");
      console.error("Error adding participant:", error);
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.nama.trim()) {
      errors.nama = "Nama harus diisi!";
      isValid = false;
    }
    if (!formData.asal_univ.trim()) {
      errors.asal_univ = "Asal Universitas harus diisi!";
      isValid = false;
    }
    if (!formData.asal_jurusan.trim()) {
      errors.asal_jurusan = "Asal jurusan harus diisi!";
      isValid = false;
    }
    if (!formData.no_telp.trim()) {
      errors.no_telp = "Nomor telepon harus diisi!";
      isValid = false;
    }
    if (!formData.username.trim()) {
      errors.username = "Username harus diisi!";
      isValid = false;
    }
    if (!formData.password) {
      errors.password = "Password harus diisi!";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
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
    setValidationErrors({});
  };

  const handleShowTaskForm = () => setShowTaskForm(true);

  const handleOpenEditUserModal = (userId) => {
    setEditingUserId(userId);
    setShowEditUserModal(true);
  };

  const handleCloseEditUserModal = () => {
    setShowEditUserModal(false);
    getUsers(activeCategory); // Refresh the list after editing
  };

  const filteredUsers = users.filter((user) =>
    user.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const displayedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="body-main">
      <div className={`body-area${showNav ? " body-pd" : ""}`}>
        <header className={`header${showNav ? " body-pd" : ""}`}>
          <div className="header_toggle"></div>
          <div className="header_img">
            <img src={icon} alt="User icon" />
          </div>
        </header>
        <div className={`sidebar${showNav ? " open" : ""}`}>
          <div className="logo-details">
            <a href="/homepage" target="_self" className="logo_name">
              <img src={logo} alt="Diskominfo" style={{ width: "120px" }} />
            </a>
            <i className="bi-list" id="btn" onClick={() => setShowNav(!showNav)}></i>
          </div>
          <ul className="nav-list">
            <li><a href="homepage"><i className="bi bi-house nav_icon" />Home</a></li>
            <li><a href="admin"><i className="bi bi-person-check-fill nav_icon" />Admin</a></li>
            <li><a href="peserta"><i className="bi bi-person nav_icon" />Peserta</a></li>
            <li><a href="presensi"><i className="bi bi-person-check nav_icon" />Presensi Magang</a></li>
            <li><a href="penugasan"><i className="bi bi-list-task nav_icon" />Penugasan</a></li>
            <li><a href="profile"><i className="bi bi-person nav_icon" />Profile</a></li>
            <li><a href="/"><i className="bi bi-box-arrow-left nav_icon" />Sign Out</a></li>
          </ul>
        </div>

        <div className="home-section">
          <div className="pb-4">
            <div className="mt-5 columns">
              <div className="column">
                <div className="info-peserta-magang" style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 25, marginBottom: 20 }}>Peserta</p>
                  <p className="count-peserta" style={{ textAlign: "center" }}>
                    Jumlah Peserta: {searchTerm === "" ? users.length : filteredUsers.length} Peserta
                  </p>
                </div>

                <div className="search-peserta" style={{ display: "flex", justifyContent: "space-between" }}>
                  <button onClick={handleShowTaskForm} className="button is-success" style={{ marginTop: 18 }}>Tambah Peserta</button>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      placeholder="Cari Peserta..."
                      onChange={handleSearch}
                      style={{
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        fontSize: "16px",
                        width: "100%",
                        maxWidth: "300px",
                        margin: "10px 0",
                      }}
                    />
                    <i className="bi bi-search" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}></i>
                  </div>
                </div>

                <div className="table-container-peserta">
                  <table className="custom-table-peserta">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Universitas</th>
                        <th>Jurusan</th>
                        <th>No telp</th>
                        <th>Tanggal Mulai</th>
                        <th>Tanggal Selesai</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr><td colSpan="8">Loading...</td></tr>
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
                            <td>
                              <button
                                className="button is-small is-info"
                                style={{ minWidth: "60px" }}
                                onClick={() => handleOpenEditUserModal(user.id)}
                              >
                                Edit
                              </button>
                              <button className="button is-small is-danger" style={{ minWidth: "60px" }}>Delete</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Edit User Modal */}
                  {showEditUserModal && (
                    <EditUser
                      userId={editingUserId}
                      handleCloseModal={handleCloseEditUserModal}
                      showEditUserModal={showEditUserModal}
                      updateUserData={() => getUsers(activeCategory)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Peserta */}
      {showTaskForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Tambah Peserta</h5>
              <button className="close" onClick={handleCloseTaskForm}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={saveUser}>
                <div className="form-group">
                  <label>Nama</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  />
                  {validationErrors.nama && <p style={{ color: "red" }}>{validationErrors.nama}</p>}
                </div>
                <div className="form-group">
                  <label>Universitas</label>
                  <input
                    type="text"
                    value={formData.asal_univ}
                    onChange={(e) => setFormData({ ...formData, asal_univ: e.target.value })}
                  />
                  {validationErrors.asal_univ && <p style={{ color: "red" }}>{validationErrors.asal_univ}</p>}
                </div>
                <div className="form-group">
                  <label>Jurusan</label>
                  <input
                    type="text"
                    value={formData.asal_jurusan}
                    onChange={(e) => setFormData({ ...formData, asal_jurusan: e.target.value })}
                  />
                  {validationErrors.asal_jurusan && <p style={{ color: "red" }}>{validationErrors.asal_jurusan}</p>}
                </div>
                <div className="form-group">
                  <label>No Telepon</label>
                  <input
                    type="text"
                    value={formData.no_telp}
                    onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })}
                  />
                  {validationErrors.no_telp && <p style={{ color: "red" }}>{validationErrors.no_telp}</p>}
                </div>
                <div className="form-group">
                  <label>Tanggal Mulai</label>
                  <input
                    type="date"
                    value={formData.tanggal_mulai}
                    onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                  />
                  {validationErrors.tanggal_mulai && <p style={{ color: "red" }}>{validationErrors.tanggal_mulai}</p>}
                </div>
                <div className="form-group">
                  <label>Tanggal Selesai</label>
                  <input
                    type="date"
                    value={formData.tanggal_selesai}
                    onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                  />
                  {validationErrors.tanggal_selesai && <p style={{ color: "red" }}>{validationErrors.tanggal_selesai}</p>}
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                  {validationErrors.username && <p style={{ color: "red" }}>{validationErrors.username}</p>}
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  {validationErrors.password && <p style={{ color: "red" }}>{validationErrors.password}</p>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseTaskForm}>Batal</button>
                  <button type="submit" className="btn btn-primary">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Peserta;
