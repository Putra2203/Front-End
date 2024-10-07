import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import logo from "../Assets/diskominfo.png";
import { axiosJWTadmin } from "../config/axiosJWT";
import { TabTitle } from "../TabName";
import icon from "../Assets/icon.png";
import Profile1 from "../images/profile.png";
import Edit from "../images/edit.png";
import jwt_decode from "jwt-decode";
import { isUnauthorizedError } from "../config/errorHandling";
import { useNavigate } from "react-router-dom";
import { showSuccessNotification } from "../Components/User/toastSuccess";
import { showErrorNotification } from "../Components/User/toastFailed";
import NavSidebar from "./NavSidebar";

export const Profile = () => {
  const [showNav, setShowNav] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [profilePicture, setProfilePicture] = useState(Profile1);
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [tempImage, setTempImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "admin",
        },
      });
      const decoded = jwt_decode(response.data.token);
      setNama(decoded.nama);
      setProfilePicture(decoded.foto_profil);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        navigate("/");
      }
    }
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result);
        setIsModalOpen(true); // Modal terbuka setelah gambar dipilih
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const ambilid = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "admin",
        },
      });

      const decoded = jwt_decode(ambilid.data.token);

      if (!tempImage) {
        throw new Error("No image selected");
      }

      // Convert base64 to Blob
      const byteString = atob(tempImage.split(",")[1]);
      const mimeString = tempImage.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      const formData = new FormData();
      formData.append("image", blob, "profile.png");

      const response = await axiosJWTadmin.patch(
        `http://localhost:3000/admin/edit-admin/${decoded.userId}/edit-foto-profil`,
        formData,
        {
          headers: {
            role: "peserta_magang",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showSuccessNotification("Berhasil Update Foto Profil");
      setIsModalOpen(false);
      setProfilePicture(tempImage);
    } catch (error) {
      console.error("Terjadi Kesalahan:", error);
      showErrorNotification("Gagal Update Foto Profil");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTempImage(null);
  };

  return (
    <div className="flex flex-col w-fullbody-main">
      <NavSidebar />
      <div className="pl-64">
        <div className="flex flex-col p-4">
          <div className="profile-picture">
            <img
              src={profilePicture || Profile1}
              alt="Profile"
              className="w-24 h-24 border-2 border-gray-300 rounded-full profile-img"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="hidden upload-input"
              id="file-input"
            />
            <label htmlFor="file-input" className="mt-4 upload-button btn btn-primary">
              <img src={Edit} alt="Edit" className="w-5 h-5 edit-icon" /> Upload Gambar
            </label>
          </div>
          <center>
            <strong className="text-xl">Selamat Datang, {nama}</strong>
          </center>
        </div>
      </div>

      {/* Modal untuk pratinjau gambar menggunakan DaisyUI */}
      <div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h2 className="text-xl font-bold">Preview</h2>
          <img src={tempImage} alt="Preview" className="w-full mt-4 rounded-lg modal-img" />
          <div className="modal-action">
            <button onClick={closeModal} className="btn btn-error">
              Close
            </button>
            {/* Tombol Save di dalam modal */}
            <button onClick={handleSubmit} className="btn btn-success">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
