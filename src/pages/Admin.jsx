import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../Assets/diskominfo.png";
import { axiosJWTadmin } from "../config/axiosJWT";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditAdmin from "../Components/Admin/EditAdmin";
import icon from "../Assets/icon.png";
import Footer from "./footer";

export const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [showNav, setShowNav] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(20);
  const maxPageButtons = 5;
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);

  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;

  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleNavLinkClick = (path) => {
    setActiveLink(path);
  };

  const totalPages = Math.ceil(admins.length / adminsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getRenderedPageNumbers = () => {
    if (totalPages <= maxPageButtons) {
      return pageNumbers;
    }

    const halfButtons = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(currentPage - halfButtons, 1);
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const handleOpenEditAdminModal = (adminId) => {
    setEditingAdminId(adminId);
    setShowEditAdminModal(true);
  };

  const handleCloseModal = () => {
    setEditingAdminId(null);
    setShowEditAdminModal(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportAdmin = async () => {
    try {
      const response = await axiosJWTadmin.get(
        "http://localhost:3000/admin/export-admin",
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
      a.download = "Admins.xlsx";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      navigate("/");
    }
  };

  const getAdmin = async () => {
    try {
      const response = await axiosJWTadmin.get(
        "http://localhost:3000/admin/show-admin"
      );
      setAdmins(response.data.admin);
    } catch (error) {
      navigate("/");
    }
  };

  const updateAdminData = (updatedAdminData) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === updatedAdminData.id ? updatedAdminData : admin
      )
    );
  };

  const deleteAdmin = async (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus admin ini?")) {
      try {
        await axiosJWTadmin.delete(
          `http://localhost:3000/admin/admin/${id}/delete`
        );
        getAdmin();
        toast.success("Admin berhasil dihapus!", { position: "top-right" });
      } catch (error) {
        navigate("/admin");
        toast.error("Gagal menghapus admin");
        console.log(error);
      }
    }
  };

  const displayedAdmins = filteredAdmins.slice(
    indexOfFirstAdmin,
    indexOfLastAdmin
  );

  return (
    <div className="body-main">
      <div className={`body-area${showNav ? " body-pd" : ""}`}>
        <header className={`header${showNav ? " body-pd" : ""}`}>
          <div className="header_toggle"></div>
          <div className="header_img">
            <img src={icon} alt="" />
          </div>
        </header>
        <div className={`sidebar${showNav ? " open" : ""}`}>
          <div className="logo-details">
            <i className="bx bxl-c-plus-plus icon"></i>
            <a href="/homepage" target="_self" className="logo_name">
              <img
                src={logo}
                alt=""
                style={{ width: "120px", height: "auto" }}
              />
            </a>
            <i
              class="bi-list"
              id="btn"
              onClick={() => setShowNav(!showNav)}
            ></i>
          </div>
          <ul class="nav-list">
            <li>
              <a href="homepage">
                <i className="bi bi-house nav_icon" />
                <span class="links_name">Home</span>
              </a>
              <span class="tooltip">Home</span>
            </li>
            <li>
              <a href="admin">
                <i className="bi bi-person-check-fill nav_icon" />
                <span class="links_name">Admin</span>
              </a>
              <span class="tooltip">Admin</span>
            </li>
            <li>
              <a href="peserta">
                <i className="bi bi-person nav_icon" />
                <span class="links_name">Peserta</span>
              </a>
              <span class="tooltip">Peserta</span>
            </li>
            <li>
              <a href="presensi">
                <i className="bi bi-person-check nav_icon" />
                <span class="links_name">Presensi Magang</span>
              </a>
              <span class="tooltip">Presensi Magang</span>
            </li>
            <li>
              <a href="penugasan">
                <i className="bi bi-list-task nav_icon" />
                <span class="links_name">Penugasan</span>
              </a>
              <span class="tooltip">Penugasan</span>
            </li>
            <li>
              <a href="profile">
                <i className="bi bi-person nav_icon" />
                <span class="links_name">Profile</span>
              </a>
              <span class="tooltip">Profile</span>
            </li>
            <li className="profile">
              <a href="/">
                <i className="bi bi-box-arrow-left nav_icon"></i>
                <span class="links_name">Sign Out</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="home-section">
          <div className="pb-4">
            <div className="mt-5 columns">
              <div className="column">
                <div
                  className="info-admin-magang"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 25,
                      marginBottom: 20,
                    }}
                  >
                    Admin
                  </p>
                  <p className="count-admin" style={{ textAlign: "center" }}>
                    Jumlah Admin:{" "}
                    {searchTerm === "" ? admins.length : filteredAdmins.length}{" "}
                    Admin
                  </p>
                </div>
                <div
                  className="search-peserta"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      placeholder="Cari Admin..."
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
                    <i
                      className="bi bi-search"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    ></i>
                  </div>
                </div>
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Username</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedAdmins.map((admin, index) => (
                        <tr key={admin.id}>
                          <td>{index + 1}</td>
                          <td>{admin.nama}</td>
                          <td>{admin.username}</td>
                          <td>
                            <button
                              className="button is-small is-info"
                              onClick={() => handleOpenEditAdminModal(admin.id)}
                            >
                              Edit
                            </button>
                            <button
                              style={{ minWidth: "60px" }}
                              onClick={() => deleteAdmin(admin.id)}
                              className="button is-small is-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <EditAdmin
                    adminId={editingAdminId}
                    handleCloseModal={handleCloseModal}
                    showEditAdminModal={showEditAdminModal}
                    updateAdminData={updateAdminData}
                  />
                </div>
                <div className="pagination-admin" style={{ marginTop: 10 }}>
                  <ul className="pagination-list-admin">
                    <li className="pagination-item">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        className={`pagination-link ${
                          currentPage === 1 ? "is-disabled" : ""
                        }`}
                      >
                        Previous
                      </button>
                    </li>
                    {getRenderedPageNumbers().map((number) => (
                      <li key={number} className="pagination-item">
                        <button
                          onClick={() => paginate(number)}
                          className={`pagination-link ${
                            number === currentPage ? "is-current" : ""
                          }`}
                        >
                          {number}
                        </button>
                      </li>
                    ))}
                    <li className="pagination-item">
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        className={`pagination-link ${
                          currentPage === totalPages ? "is-disabled" : ""
                        }`}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={exportAdmin}
                  className="export-button button is-success"
                >
                  Export to Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
