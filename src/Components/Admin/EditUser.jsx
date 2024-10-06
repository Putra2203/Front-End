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
    nama_dosen: "",
    no_telp_dosen: "",
    status_aktif: "",
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
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-semibold font-poppins">Edit User</h2>
          <button
            className="px-2 py-1 bg-red-500 rounded-lg hover:bg-slate-400"
            onClick={handleCloseModal}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleUpdateUser} className="flex flex-col gap-2 mt-4">
          <div className="flex flex-row justify-between">
            <label>Nama</label>
            <input
              type="text"
              placeholder="Masukkan nama"
              value={userData.nama}
              className="flex px-2 py-1 border"
              onChange={(e) =>
                setUserData({ ...userData, nama: e.target.value })
              }
            />
          </div>

          <div className="flex flex-row justify-between">
            <label>Asal Universitas</label>
            <input
              type="text"
              placeholder="Masukkan asal universitas"
              value={userData.asal_univ}
              className="flex px-2 py-1 border"
              onChange={(e) =>
                setUserData({ ...userData, asal_univ: e.target.value })
              }
            />
          </div>

          <div className="flex flex-row justify-between">
            <label>Asal Jurusan</label>
            <input
              type="text"
              placeholder="Masukkan asal jurusan"
              value={userData.asal_jurusan}
              className="flex px-2 py-1 border"
              onChange={(e) =>
                setUserData({ ...userData, asal_jurusan: e.target.value })
              }
            />
          </div>

          <div className="flex flex-row justify-between">
            <label>Nomor Telepon</label>
            <input
              type="text"
              placeholder="Masukkan nomor telepon"
              value={userData.no_telp}
              className="flex px-2 py-1 border"
              onChange={(e) =>
                setUserData({ ...userData, no_telp: e.target.value })
              }
            />
          </div>

          <div className="flex flex-row justify-between">
            <label>Tanggal Mulai</label>
            <input
              type="date"
              value={userData.tanggal_mulai}
              className="flex px-2 py-1 border"
              onChange={(e) =>
                setUserData({ ...userData, tanggal_mulai: e.target.value })
              }
            />
          </div>

          <div className="flex flex-row justify-between">
            <label>Tanggal Selesai</label>
            <input
              type="date"
              value={userData.tanggal_selesai}
              className="flex px-2 py-1 border"
              onChange={(e) =>
                setUserData({ ...userData, tanggal_selesai: e.target.value })
              }
            />
          </div>

          {/* Tambahan Nama Dosen */}
          <div className="flex flex-row justify-between">
            <label>Nama Dosen</label>
            <input
              type="text"
              placeholder="Masukkan nama dosen"
              value={userData.nama_dosen}
              className="flex px-2 py-1 border"
              onChange={(e) =>
                setUserData({ ...userData, nama_dosen: e.target.value })
              }
            />
          </div>

          {/* Tambahan Nomor Telepon Dosen */}
          <div className="flex flex-row justify-between">
            <label>Nomor Telepon Dosen</label>
            <input
              type="text"
              placeholder="Masukkan nomor telepon dosen"
              value={userData.no_telp_dosen}
              className="flex px-2 py-1 border"
              onChange={(e) =>
                setUserData({ ...userData, no_telp_dosen: e.target.value })
              }
            />
          </div>

          {/* Tambahan Dropdown Status Aktif */}
          <div className="flex flex-row justify-between">
            <label>Status Aktif</label>
            <select
              value={userData.status_aktif}
              className="flex px-2 py-1 border"
              onChange={(e) =>
                setUserData({
                  ...userData,
                  status_aktif: parseInt(e.target.value),
                })
              }
            >
              <option value="">--Pilih Status--</option>
              <option value="2">Aktif</option>
              <option value="1">Alumni</option>
              <option value="3">Calon</option>
            </select>
          </div>

          <div className="flex flex-row justify-between">
            <label>Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              value={userData.username}
              className="flex px-2 py-1 border"
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
            />
          </div>

          <div className="flex flex-row justify-between">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password (biarkan kosong jika tidak ingin mengubah)"
              className="flex px-2 py-1 border"
              onChange={(e) => {
                setUserData({ ...userData, password: e.target.value });
              }}
            />
          </div>

          <div className="mt-4">
            <button type="submit" className="px-4 py-1 bg-[#183028] text-white rounded-3xl hover:bg-slate-400">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
