import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../Assets/diskominfo.png";
import { axiosJWTadmin } from "../config/axiosJWT";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditAdmin from "../Components/Admin/EditAdmin";
import icon from "../Assets/icon.png";
import { IoIosSearch } from "react-icons/io";
import NavSidebar from "./NavSidebar";
import Footer1 from "./Footer1";

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
    <div className="flex flex-col w-full">
      {/* Sidebar */}
      <NavSidebar />

      <div className="pl-64">
        <div className="flex flex-col p-4 bg-slate-300">
          <div className="bg-white">
            <p className="text-4xl font-semibold font-poppins">
              Admin - SISAPPMA
            </p>
            <div className="mt-4">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Cari Admin..."
                  onChange={handleSearch}
                  className="w-64 px-4 border rounded-3xl bg-slate-200"
                />
                <i className="absolute top-1 right-3">
                  <IoIosSearch />
                </i>
              </div>
            </div>
            
            {/* table component */}
            <div className="my-4">
              <table className="w-full text-center">
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
  );
};

export default Admin;
