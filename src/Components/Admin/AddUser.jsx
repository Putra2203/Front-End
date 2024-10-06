import React, { useState } from "react";
import { axiosJWTadmin } from "../../config/axiosJWT";
import { showSuccessNotification } from "../User/toastSuccess";
import { showErrorNotification } from "../User/toastFailed";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddUser = ({ handleClose, refreshData }) => {
  const [formData, setFormData] = useState({
    nama: "",
    asal_univ: "",
    asal_jurusan: "",
    no_telp: "",
    tanggal_mulai: null,
    tanggal_selesai: null,
    username: "",
    password: "",
    nama_dosen: "",
    no_telp_dosen: "",
    status_aktif: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
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
    if (!formData.nama_dosen.trim()) {
      errors.nama_dosen = "Nama dosen harus diisi!";
      isValid = false;
    }
    if (!formData.no_telp_dosen.trim()) {
      errors.no_telp_dosen = "Nomor telepon dosen harus diisi!";
      isValid = false;
    }
    if (!formData.status_aktif) {
      errors.status_aktif = "Status aktif harus dipilih!";
      isValid = false;
    }
    if (!formData.tanggal_mulai) {
      errors.tanggal_mulai = "Tanggal mulai harus dipilih!";
      isValid = false;
    }
    if (!formData.tanggal_selesai) {
      errors.tanggal_selesai = "Tanggal selesai harus dipilih!";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const saveUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      console.log(formData);
      await axiosJWTadmin.post(
        "http://localhost:3000/admin/peserta/add",
        {
          ...formData,
          tanggal_mulai: formData.tanggal_mulai
            ? formData.tanggal_mulai.toISOString().split("T")[0]
            : "",
          tanggal_selesai: formData.tanggal_selesai
            ? formData.tanggal_selesai.toISOString().split("T")[0]
            : "",
        }
      );
      showSuccessNotification("Sukses Menambahkan Peserta");
      handleClose();
      if (typeof refreshData === "function") {
        refreshData();
      }
    } catch (error) {
      showErrorNotification("Gagal Menambahkan Peserta");
      console.error("Error adding participant:", error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <form onSubmit={saveUser} className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold font-poppins">Tambah Peserta</h1>
          <div className="flex justify-between mt-4">
            <label className="label">Nama</label>
            <input
              type="text"
              placeholder="Masukkan nama"
              value={formData.nama}
              onChange={(e) => {
                setFormData({ ...formData, nama: e.target.value });
                setValidationErrors({ ...validationErrors, nama: "" });
              }}
              className={`input border-black ${
                validationErrors.nama ? "input-error" : ""
              }`}
            />
            {validationErrors.nama && (
              <p className="text-sm text-red-500">{validationErrors.nama}</p>
            )}
          </div>
          <div className="flex justify-between">
            <label className="label">Universitas</label>
            <input
              type="text"
              placeholder="Masukkan universitas"
              value={formData.asal_univ}
              onChange={(e) => {
                setFormData({ ...formData, asal_univ: e.target.value });
                setValidationErrors({ ...validationErrors, asal_univ: "" });
              }}
              className={`input border-black ${
                validationErrors.asal_univ ? "input-error" : ""
              }`}
            />
            {validationErrors.asal_univ && (
              <p className="text-sm text-red-500">
                {validationErrors.asal_univ}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <label className="label">Jurusan</label>
            <input
              type="text"
              placeholder="Masukkan jurusan"
              value={formData.asal_jurusan}
              onChange={(e) => {
                setFormData({ ...formData, asal_jurusan: e.target.value });
                setValidationErrors({
                  ...validationErrors,
                  asal_jurusan: "",
                });
              }}
              className={`input border-black ${
                validationErrors.asal_jurusan ? "input-error" : ""
              }`}
            />
            {validationErrors.asal_jurusan && (
              <p className="text-sm text-red-500">
                {validationErrors.asal_jurusan}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <label className="label">Nomor telepon</label>
            <input
              type="text"
              placeholder="Masukkan nomor telepon"
              value={formData.no_telp}
              onChange={(e) => {
                setFormData({ ...formData, no_telp: e.target.value });
                setValidationErrors({ ...validationErrors, no_telp: "" });
              }}
              className={`input border-black ${
                validationErrors.no_telp ? "input-error" : ""
              }`}
            />
            {validationErrors.no_telp && (
              <p className="text-sm text-red-500">{validationErrors.no_telp}</p>
            )}
          </div>
          <div className="flex justify-between">
            <label className="label">Nama Dosen</label>
            <input
              type="text"
              placeholder="Masukkan nama dosen"
              value={formData.nama_dosen}
              onChange={(e) => {
                setFormData({ ...formData, nama_dosen: e.target.value });
                setValidationErrors({ ...validationErrors, nama_dosen: "" });
              }}
              className={`input border-black ${
                validationErrors.nama_dosen ? "input-error" : ""
              }`}
            />
            {validationErrors.nama_dosen && (
              <p className="text-sm text-red-500">
                {validationErrors.nama_dosen}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <label className="label">Nomor Telepon Dosen</label>
            <input
              type="text"
              placeholder="Masukkan nomor telepon dosen"
              value={formData.no_telp_dosen}
              onChange={(e) => {
                setFormData({ ...formData, no_telp_dosen: e.target.value });
                setValidationErrors({
                  ...validationErrors,
                  no_telp_dosen: "",
                });
              }}
              className={`input border-black ${
                validationErrors.no_telp_dosen ? "input-error" : ""
              }`}
            />
            {validationErrors.no_telp_dosen && (
              <p className="text-sm text-red-500">
                {validationErrors.no_telp_dosen}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <label className="label">Status Aktif</label>
            <select
              value={formData.status_aktif}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  status_aktif: parseInt(e.target.value, 10),
                }); // Kirim integer
              }}
              className={`select border-black ${
                validationErrors.status_aktif ? "select-error" : ""
              }`}
            >
              <option value="">--Pilih Status--</option>
              <option value="2">Aktif</option>
              <option value="1">Alumni</option>
              <option value="3">Calon</option>
            </select>
            {validationErrors.status_aktif && (
              <p className="text-sm text-red-500">
                {validationErrors.status_aktif}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <label className="label">Tanggal Mulai</label>
            <DatePicker
              selected={formData.tanggal_mulai}
              onChange={(date) =>
                setFormData({ ...formData, tanggal_mulai: date })
              }
              dateFormat={"yyyy-MM-dd"}
              className={`input border-black ${
                validationErrors.tanggal_mulai ? "input-error" : ""
              }`}
            />
            {validationErrors.tanggal_mulai && (
              <p className="text-sm text-red-500">
                {validationErrors.tanggal_mulai}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <label className="label">Tanggal Selesai</label>
            <DatePicker
              selected={formData.tanggal_selesai}
              onChange={(date) =>
                setFormData({ ...formData, tanggal_selesai: date })
              }
              dateFormat={"yyyy-MM-dd"}
              className={`input border-black ${
                validationErrors.tanggal_selesai ? "input-error" : ""
              }`}
            />
            {validationErrors.tanggal_selesai && (
              <p className="text-sm text-red-500">
                {validationErrors.tanggal_selesai}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <label className="label">Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                setValidationErrors({ ...validationErrors, username: "" });
              }}
              className={`input border-black ${
                validationErrors.username ? "input-error" : ""
              }`}
            />
            {validationErrors.username && (
              <p className="text-sm text-red-500">
                {validationErrors.username}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setValidationErrors({ ...validationErrors, password: "" });
              }}
              className={`input border-black ${
                validationErrors.password ? "input-error" : ""
              }`}
            />
            {validationErrors.password && (
              <p className="text-sm text-red-500">
                {validationErrors.password}
              </p>
            )}
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-1 text-white bg-red-500 rounded-3xl hover:bg-slate-400"
            >
              Batal
            </button>
            <button type="submit" className="px-4 py-1 bg-[#183028] text-white rounded-3xl hover:bg-slate-400">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
