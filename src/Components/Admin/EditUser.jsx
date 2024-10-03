import React, { useState, useEffect } from "react";
import { axiosJWTadmin } from "../../config/axiosJWT";
import { toast } from "react-toastify";

const EditUser = ({
  userId,
  handleCloseModal,
  showEditUserModal,
  updateUserData,
}) => {
  const [userData, setUserData] = useState({
    nama: "",
    asal_univ: "",
    asal_jurusan: "",
    no_telp: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    if (userId) {
      axiosJWTadmin
        .get(`http://localhost:3000/admin/peserta/${userId}`)
        .then((response) => {
          const { peserta_magang } = response.data;
          setUserData({
            ...peserta_magang,
            tanggal_mulai: peserta_magang.tanggal_mulai.split("T")[0], // Menangani format tanggal
            tanggal_selesai: peserta_magang.tanggal_selesai.split("T")[0],
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userId]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axiosJWTadmin.patch(
        `http://localhost:3000/admin/peserta/${userId}/edit`,
        userData
      );
      updateUserData(userData);
      handleCloseModal();
      showSuccessNotification("User updated successfully.");
    } catch (error) {
      showErrorNotification("Failed to update user.");
      console.error(error);
    }
  };

  const showSuccessNotification = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
    });
  };

  const showErrorNotification = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
    });
  };

  if (!showEditUserModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit User</h2>
          <button className="close-button" onClick={handleCloseModal}>
            &times;
          </button>
        </div>
        <form onSubmit={handleUpdateUser}>
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              placeholder="Masukkan nama"
              value={userData.nama}
              onChange={(e) => setUserData({ ...userData, nama: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Asal Universitas</label>
            <input
              type="text"
              placeholder="Masukkan asal universitas"
              value={userData.asal_univ}
              onChange={(e) =>
                setUserData({ ...userData, asal_univ: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Asal Jurusan</label>
            <input
              type="text"
              placeholder="Masukkan asal jurusan"
              value={userData.asal_jurusan}
              onChange={(e) =>
                setUserData({ ...userData, asal_jurusan: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Nomor Telepon</label>
            <input
              type="text"
              placeholder="Masukkan nomor telepon"
              value={userData.no_telp}
              onChange={(e) =>
                setUserData({ ...userData, no_telp: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Tanggal Mulai</label>
            <input
              type="date"
              value={userData.tanggal_mulai}
              onChange={(e) =>
                setUserData({ ...userData, tanggal_mulai: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Tanggal Selesai</label>
            <input
              type="date"
              value={userData.tanggal_selesai}
              onChange={(e) =>
                setUserData({ ...userData, tanggal_selesai: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              value={userData.username}
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password (biarkan kosong jika tidak ingin mengubah)"
              onChange={(e) => {
                setUserData({ ...userData, password: e.target.value });
              }}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
