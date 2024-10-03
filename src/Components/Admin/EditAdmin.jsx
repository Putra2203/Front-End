import React, { useState, useEffect } from "react";
import { axiosJWTadmin } from "../../config/axiosJWT";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditAdmin = ({ adminId, handleCloseModal, updateAdminData }) => {
    const [adminData, setAdminData] = useState({
        id: null,
        nama: "",
        username: "",
        password: "",
    });

    useEffect(() => {
        if (adminId) {
            getAdminById();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminId]);

    const updateAdmin = async (e) => {
        e.preventDefault();
        try {
            await axiosJWTadmin.patch(`http://localhost:3000/admin/edit-admin/${adminId}`, {
                nama: adminData.nama,
                username: adminData.username,
                password: adminData.password
            });
            updateAdminData(adminData);
            toast.success('Admin data updated successfully', {
                position: 'top-right',
                autoClose: 3000,
            });
            handleCloseModal(); // Optional: only if you want to hide the form after update
        } catch (error) {
            console.log(error);
            toast.error('An error occurred while updating admin data', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    }

    const getAdminById = async () => {
        try {
            const response = await axiosJWTadmin.get(`http://localhost:3000/admin/show-admin-id/${adminId}`);
            if (response.data && response.data.admin) {
                const admin = response.data.admin;
                setAdminData({
                    id: admin.id,
                    nama: admin.nama,
                    username: admin.username,
                    password: "", // Leave password empty for now
                });
            } else {
                console.error("Admin data is missing in the response.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h3>Edit Admin</h3>
            <form onSubmit={updateAdmin}>
                <div className="form-group">
                    <label>Nama</label>
                    <input
                        type="text"
                        value={adminData.nama}
                        onChange={(e) => setAdminData({ ...adminData, nama: e.target.value })}
                        placeholder="Nama"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={adminData.username}
                        onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                        placeholder="Username"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={adminData.password}
                        onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                        placeholder="Password"
                        className="form-control"
                    />
                </div>
                <div style={{ marginTop: "10px" }}>
                    <button type="submit" className="btn btn-success">
                        Update
                    </button>
                    <button type="button" onClick={handleCloseModal} className="btn btn-secondary" style={{ marginLeft: "10px" }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditAdmin;
