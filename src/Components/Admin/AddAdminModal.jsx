import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { axiosJWTadmin } from "../../config/axiosJWT";
import 'react-toastify/dist/ReactToastify.css';

const AddAdminModal = ({ showTaskForm, handleCloseTaskForm, getAdmin }) => {
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const clearForm = () => {
    setFormData({
      nama: '',
      username: '',
      password: '',
    });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.nama.trim()) {
      errors.nama = 'Nama harus diisi!';
      isValid = false;
    }

    if (!formData.username.trim()) {
      errors.username = 'Username harus diisi!';
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = 'Password harus diisi!';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const saveAdmin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      await axiosJWTadmin.post('http://localhost:3000/admin/add-admin', formData);
      getAdmin(); // Update list of admins
      handleCloseTaskForm(); // Close the modal
      toast.success('Pengguna berhasil ditambahkan.', {
        position: 'top-right',
        autoClose: 3000,
      });
      clearForm();
    } catch (error) {
      toast.error('Gagal menambahkan pengguna.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.log(error);
    }
  };

  return (
    <>
      {showTaskForm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Tambah Admin</h3>
            <form onSubmit={saveAdmin}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nama</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama"
                  className="input input-bordered"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                />
                {validationErrors.nama && (
                  <span className="text-sm text-red-500">{validationErrors.nama}</span>
                )}
              </div>

              <div className="mt-4 form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan username"
                  className="input input-bordered"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                {validationErrors.username && (
                  <span className="text-sm text-red-500">{validationErrors.username}</span>
                )}
              </div>

              <div className="mt-4 form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Masukkan password"
                  className="input input-bordered"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {validationErrors.password && (
                  <span className="text-sm text-red-500">{validationErrors.password}</span>
                )}
              </div>

              <div className="modal-action">
                <button type="button" onClick={handleCloseTaskForm} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAdminModal;
