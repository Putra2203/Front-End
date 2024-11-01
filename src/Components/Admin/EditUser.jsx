import React, { useState, useEffect } from "react";
import { axiosJWTadmin } from "../../config/axiosJWT";
import { toast } from "react-toastify";

const EditUser = ({
  userId,
  handleCloseModal,
  showEditUserModal,
  updateUserData,
}) => {
  const PENEMPATAN_OPTIONS = [
    "Bidang 1",
    "Bidang 2",
    "Bidang 3",
    "Bidang 4",
    "Bidang 5",
    "Kesekretariatan",
  ];

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
    penempatan: "",
    specialPenempatan: "",
  });

  const isStandardPenempatan = (value) => {
    return PENEMPATAN_OPTIONS.includes(value);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await axiosJWTadmin.get(
          `http://localhost:3000/admin/peserta/${userId}`
        );

        const { peserta_magang } = response.data;

        // Cek apakah penempatan adalah nilai standar atau khusus
        const isSpecial = !isStandardPenempatan(peserta_magang.penempatan);

        setUserData({
          ...peserta_magang,
          tanggal_mulai: peserta_magang.tanggal_mulai.split("T")[0],
          tanggal_selesai: peserta_magang.tanggal_selesai.split("T")[0],

          penempatan: isSpecial ? "special" : peserta_magang.penempatan,
          specialPenempatan: isSpecial ? peserta_magang.penempatan : "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Gagal mengambil data peserta");
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      // Validasi untuk penempatan khusus
      if (
        userData.penempatan === "special" &&
        !userData.specialPenempatan.trim()
      ) {
        toast.error("Penempatan khusus harus diisi");
        return;
      }

      // Siapkan data yang akan dikirim
      const updatedData = {
        ...userData,
        // Jika penempatan special, gunakan nilai specialPenempatan
        penempatan:
          userData.penempatan === "special"
            ? userData.specialPenempatan.trim()
            : userData.penempatan,
      };

      delete updatedData.specialPenempatan;
      if (!updatedData.password) {
        delete updatedData.password;
      }

      console.log("Data yang akan dikirim:", updatedData);

      await axiosJWTadmin.patch(
        `http://localhost:3000/admin/peserta/${userId}/edit`,
        updatedData
      );

      updateUserData(updatedData);
      handleCloseModal();
      toast.success("Data peserta berhasil diperbarui");
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal memperbarui data peserta";
      toast.error(errorMessage);
    }
  };

  const handlePenempatanChange = (e) => {
    const value = e.target.value;
    setUserData((prev) => ({
      ...prev,
      penempatan: value,
      specialPenempatan: value === "special" ? prev.specialPenempatan : "",
    }));
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
      <div className="modal-box bg-secondary">
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
              className="flex px-2 py-1 border rounded-lg bg-slate-50"
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
              className="flex px-2 py-1 border rounded-lg bg-slate-50"
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
              className="flex px-2 py-1 border rounded-lg bg-slate-50"
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
              className="flex px-2 py-1 border rounded-lg bg-slate-50"
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
              className="flex px-2 py-1 border rounded-lg bg-slate-50"
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
              className="flex px-2 py-1 border rounded-lg bg-slate-50"
              onChange={(e) =>
                setUserData({ ...userData, tanggal_selesai: e.target.value })
              }
            />
          </div>

          <div className="flex flex-row justify-between">
            <label>Nama Pembimbing</label>
            <input
              type="text"
              placeholder="Masukkan nama dosen"
              value={userData.nama_dosen}
              className="flex px-2 py-1 border rounded-lg bg-slate-50"
              onChange={(e) =>
                setUserData({ ...userData, nama_dosen: e.target.value })
              }
            />
          </div>

          <div className="flex flex-row justify-between">
            <label>Nomor Telepon Pembimbing</label>
            <input
              type="text"
              placeholder="Masukkan nomor telepon dosen"
              value={userData.no_telp_dosen}
              className="flex px-2 py-1 border rounded-lg bg-slate-50"
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
              className="flex px-2 py-1 border rounded-lg bg-slate-50"
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

          {/* Dropdown Penempatan */}
          <div className="flex flex-row justify-between">
            <label>Penempatan</label>
            <select
              value={userData.penempatan}
              onChange={handlePenempatanChange}
              className="flex px-2 py-1 border rounded-lg bg-slate-50"
            >
              <option value="">--Pilih Penempatan--</option>
              {PENEMPATAN_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="special">Alternatif</option>
            </select>
          </div>

          {/* Input Penempatan Khusus */}
          {userData.penempatan === "special" && (
            <div className="flex flex-row justify-between mt-2">
              <label>Penempatan Khusus</label>
              <input
                type="text"
                placeholder="Masukkan nilai khusus"
                value={userData.specialPenempatan}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    specialPenempatan: e.target.value,
                  })
                }
                className="flex px-2 py-1 border rounded-lg bg-slate-50"
              />
            </div>
          )}

          <div className="flex flex-row justify-between">
            <label>Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              value={userData.username}
              className="flex px-2 py-1 border rounded-lg bg-slate-50"
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
              className="flex px-2 py-1 border rounded-lg bg-slate-50"
              onChange={(e) => {
                setUserData({ ...userData, password: e.target.value });
              }}
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="px-4 py-1 bg-[#183028] text-white rounded-3xl hover:bg-slate-400"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
