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
    penempatan: "",
    specialPenempatan: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validasi umum
    const requiredFields = {
      nama: "Nama harus diisi!",
      asal_univ: "Asal Universitas harus diisi!",
      asal_jurusan: "Asal jurusan harus diisi!",
      no_telp: "Nomor telepon harus diisi!",
      username: "Username harus diisi!",
      password: "Password harus diisi!",
      nama_dosen: "Nama dosen harus diisi!",
      no_telp_dosen: "Nomor telepon dosen harus diisi!",
      status_aktif: "Status aktif harus dipilih!",
      tanggal_mulai: "Tanggal mulai harus dipilih!",
      tanggal_selesai: "Tanggal selesai harus dipilih!",
      penempatan: "Penempatan harus dipilih!",
    };

    // Validasi field-field wajib
    Object.keys(requiredFields).forEach((field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && !formData[field].trim())
      ) {
        errors[field] = requiredFields[field];
        isValid = false;
      }
    });

    // Validasi khusus untuk penempatan special
    if (formData.penempatan === "special") {
      if (!formData.specialPenempatan || !formData.specialPenempatan.trim()) {
        errors.specialPenempatan = "Masukkan nilai khusus untuk penempatan!";
        isValid = false;
      } else if (formData.specialPenempatan.length < 3) {
        errors.specialPenempatan =
          "Nilai penempatan khusus minimal 3 karakter!";
        isValid = false;
      } else if (formData.specialPenempatan.length > 50) {
        errors.specialPenempatan =
          "Nilai penempatan khusus maksimal 50 karakter!";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handlePenempatanChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      penempatan: value,
      specialPenempatan: value === "special" ? prev.specialPenempatan : "",
    }));
    setValidationErrors((prev) => ({
      ...prev,
      penempatan: "",
      specialPenempatan: "",
    }));
  };

  const saveUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const finalPenempatan =
        formData.penempatan === "special"
          ? formData.specialPenempatan
          : formData.penempatan;

      const postData = {
        ...formData,
        penempatan: finalPenempatan,
        tanggal_mulai: formData.tanggal_mulai
          ? formData.tanggal_mulai.toISOString().split("T")[0]
          : "",
        tanggal_selesai: formData.tanggal_selesai
          ? formData.tanggal_selesai.toISOString().split("T")[0]
          : "",
      };

      delete postData.specialPenempatan;

      await axiosJWTadmin.post(
        "http://localhost:3000/admin/peserta/add",
        postData
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
      <div className="modal-box bg-secondary">
        <form onSubmit={saveUser} className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold font-poppins">Tambah Peserta</h1>
          <div className="flex justify-between mt-4">
            <label className="label">Nama</label>
            <input
              type="text"
              placeholder="Masukkan nama"
              value={formData.nama}
              onChange={(e) => handleInputChange("nama", e.target.value)}
              className={`input border-black bg-slate-50 ${
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
              onChange={(e) => handleInputChange("asal_univ", e.target.value)}
              className={`input border-black bg-slate-50 ${
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
              onChange={(e) =>
                handleInputChange("asal_jurusan", e.target.value)
              }
              className={`input border-black bg-slate-50 ${
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
              onChange={(e) => handleInputChange("no_telp", e.target.value)}
              className={`input border-black bg-slate-50 ${
                validationErrors.no_telp ? "input-error" : ""
              }`}
            />
            {validationErrors.no_telp && (
              <p className="text-sm text-red-500">{validationErrors.no_telp}</p>
            )}
          </div>
          <div className="flex justify-between">
            <label className="label">Nama Pembimbing</label>
            <input
              type="text"
              placeholder="Masukkan nama dosen"
              value={formData.nama_dosen}
              onChange={(e) => handleInputChange("nama_dosen", e.target.value)}
              className={`input border-black bg-slate-50 ${
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
            <label className="label">Nomor Telepon Pembimbing</label>
            <input
              type="text"
              placeholder="Masukkan nomor telepon dosen"
              value={formData.no_telp_dosen}
              onChange={(e) =>
                handleInputChange("no_telp_dosen", e.target.value)
              }
              className={`input border-black bg-slate-50 ${
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
              onChange={(e) =>
                handleInputChange("status_aktif", parseInt(e.target.value, 10))
              }
              className={`select border-black bg-slate-50 ${
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
              onChange={(date) => handleInputChange("tanggal_mulai", date)}
              dateFormat="yyyy-MM-dd"
              className={`input border-black bg-slate-50 ${
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
              onChange={(date) => handleInputChange("tanggal_selesai", date)}
              dateFormat="yyyy-MM-dd"
              className={`input border-black bg-slate-50 ${
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
            <label className="label">Penempatan</label>
            <select
              value={formData.penempatan}
              onChange={handlePenempatanChange}
              className={`select border-black bg-slate-50 ${
                validationErrors.penempatan ? "select-error" : ""
              }`}
            >
              <option value="">--Pilih Penempatan--</option>
              <option value="Bidang 1">Bidang 1</option>
              <option value="Bidang 2">Bidang 2</option>
              <option value="Bidang 3">Bidang 3</option>
              <option value="Bidang 4">Bidang 4</option>
              <option value="Bidang 5">Bidang 5</option>
              <option value="Kesekretariatan">Kesekretariatan</option>
              <option value="special">Alternatif</option>
            </select>
            {validationErrors.penempatan && (
              <p className="text-sm text-red-500">
                {validationErrors.penempatan}
              </p>
            )}
          </div>
          {formData.penempatan === "special" && (
            <div className="flex justify-between mt-2">
              <label className="label">Penempatan Khusus</label>
              <input
                type="text"
                placeholder="Penempatan Khusus"
                value={formData.specialPenempatan}
                onChange={(e) =>
                  handleInputChange("specialPenempatan", e.target.value)
                }
                className={`input border-black bg-slate-50 ${
                  validationErrors.specialPenempatan ? "input-error" : ""
                }`}
                maxLength={50}
              />
              {validationErrors.specialPenempatan && (
                <p className="text-sm text-red-500">
                  {validationErrors.specialPenempatan}
                </p>
              )}
            </div>
          )}
          <div className="flex justify-between">
            <label className="label">Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={`input border-black bg-slate-50 ${
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
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`input border-black bg-slate-50 ${
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
            <button
              type="submit"
              className="px-4 py-1 bg-[#183028] text-white rounded-3xl hover:bg-slate-400"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
