import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosJWTadmin } from "../config/axiosJWT";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditAdmin from "../Components/Admin/EditAdmin";
import AddAdminModal from "../Components/Admin/AddAdminModal";
import { IoIosSearch } from "react-icons/io";
import NavSidebar from "./NavSidebar";
import Footer1 from "./Footer1";

export const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [showNav, setShowNav] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(3);
  const maxPageButtons = 5;
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
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
    setShowTaskForm(false); // Close add admin modal if open
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

  const handleShowTaskForm = () => setShowTaskForm(true);
  const handleCloseTaskForm = () => setShowTaskForm(false);

  return (
    <div className="flex flex-col w-full">
      {/* Sidebar */}
      <NavSidebar />

      <div className="h-screen pl-0 lg:pl-64">
        <div className="flex flex-col p-4 ">
          <p className="mt-24 text-2xl font-semibold lg:text-4xl font-poppins lg:mt-0">
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

          <div className="p-4 my-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleShowTaskForm}
                className="bg-[#183028] px-4 py-0.5 text-white mb-4 rounded-3xl hover:bg-slate-400"
              >
                Tambah Admin
              </button>
              <button
                onClick={exportAdmin}
                className="bg-[#183028] px-4 py-0.5 text-white mb-4 rounded-3xl hover:bg-slate-400"
              >
                Export to Excel
              </button>
            </div>

            {/* table */}
            <div className="p-10 overflow-x-auto bg-slate-200 rounded-2xl">
              <table className="table w-full text-center ">
                <thead>
                  <tr className="text-black">
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
                        <div className="flex justify-center gap-2">
                          <button
                            className="px-4 text-white bg-[#183028] rounded-2xl hover:bg-slate-400"
                            onClick={() => handleOpenEditAdminModal(admin.id)}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAdmin(admin.id)}
                            className="px-4 text-white bg-red-700 rounded-2xl hover:bg-slate-400"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-4 join ">
              <button
                onClick={() => paginate(currentPage - 1)}
                className={`join-item bg-slate-200 btn text-black ${
                  currentPage === 1 ? "btn-disabled bg-slate-400" : ""
                }`}
              >
                «
              </button>

              {getRenderedPageNumbers().map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`join-item btn  ${
                    number === currentPage ? "btn-active bg-gray-700" : ""
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                className={`join-item btn ${
                  currentPage === totalPages ? "btn-disabled" : ""
                }`}
              >
                »
              </button>
            </div>

            {/* Modal for editing admin */}
            {showEditAdminModal && (
              <EditAdmin
                adminId={editingAdminId}
                handleCloseModal={handleCloseModal}
                showEditAdminModal={showEditAdminModal}
                updateAdminData={updateAdminData}
              />
            )}

            {/* AddAdminModal component */}
            <AddAdminModal
              showTaskForm={showTaskForm}
              handleCloseTaskForm={handleCloseTaskForm}
              getAdmin={getAdmin}
            />
          </div>
        </div>
      </div>
      <Footer1 />
    </div>
  );
};

export default Admin;
