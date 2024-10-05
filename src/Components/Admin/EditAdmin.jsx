import React, { useState, useEffect } from "react";
import { axiosJWTadmin } from "../../config/axiosJWT";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditAdmin = ({
  adminId,
  handleCloseModal,
  updateAdminData,
  showEditAdminModal,
}) => {
  const [adminData, setAdminData] = useState({
    id: null,
    nama: "",
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading saat submit

  useEffect(() => {
    if (adminId) {
      getAdminById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminId]);

  const updateAdmin = async (e) => {
    e.preventDefault();

    // Validasi sederhana sebelum submit
    if (!adminData.nama || !adminData.username) {
      toast.error("Nama dan username tidak boleh kosong", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const updatedAdminData = {
      nama: adminData.nama,
      username: adminData.username,
    };

    // Hanya kirim password jika diisi
    if (adminData.password) {
      updatedAdminData.password = adminData.password;
    }

    setIsSubmitting(true); // Mulai proses loading

    try {
      await axiosJWTadmin.patch(
        `http://localhost:3000/admin/edit-admin/${adminId}`,
        updatedAdminData
      );
      updateAdminData(adminData);
      toast.success("Admin data updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      handleCloseModal(); // Tutup modal setelah sukses
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false); // Hentikan proses loading
    }
  };

  const getAdminById = async () => {
    try {
      const response = await axiosJWTadmin.get(
        `http://localhost:3000/admin/show-admin-id/${adminId}`
      );
      if (response.data && response.data.admin) {
        const admin = response.data.admin;
        setAdminData({
          id: admin.id,
          nama: admin.nama,
          username: admin.username,
          password: "", // Biarkan password kosong saat edit
        });
      } else {
        console.error("Admin data is missing in the response.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {showEditAdminModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Edit Admin</h3>
            <form onSubmit={updateAdmin}>
              <div className="form-control">
                <label className="label">Nama</label>
                <input
                  type="text"
                  value={adminData.nama}
                  onChange={(e) =>
                    setAdminData({ ...adminData, nama: e.target.value })
                  }
                  placeholder="Nama"
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">Username</label>
                <input
                  type="text"
                  value={adminData.username}
                  onChange={(e) =>
                    setAdminData({ ...adminData, username: e.target.value })
                  }
                  placeholder="Username"
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">Password (Opsional)</label>
                <input
                  type="password"
                  value={adminData.password}
                  onChange={(e) =>
                    setAdminData({ ...adminData, password: e.target.value })
                  }
                  placeholder="Password"
                  className="input input-bordered"
                />
              </div>

              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isSubmitting} // Disable button saat proses submit
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditAdmin;
