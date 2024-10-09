import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../Assets/diskominfo.png";
import { axiosJWTadmin } from "../config/axiosJWT";
import icon from "../Assets/icon.png";
import Profile1 from "../images/profile.png";
import Edit from "../images/edit.png";
import jwt_decode from "jwt-decode";
import { isUnauthorizedError } from "../config/errorHandling";
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
  const [userName, setUserName] = useState("");
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
      setUserName(decoded.username);
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

      await axiosJWTadmin.patch(
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
    <div className="flex flex-col w-full min-h-screen bg-gray-100 md:flex-row">
      <NavSidebar />
      <div className="flex-grow p-6 md:pl-72">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <img
                src={profilePicture || Profile1}
                alt="Profile"
                className="w-32 h-32 border-4 border-gray-300 rounded-full"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="absolute bottom-0 right-0 p-2 text-white rounded-full shadow-lg cursor-pointer bg-primary hover:bg-primary-focus"
              >
                <img src={Edit} alt="Edit" className="w-5 h-5" />
              </label>
            </div>
            <h2 className="text-2xl font-semibold">{nama}</h2>
            <p className="text-gray-500">@{userName}</p>
          </div>
        </div>

        {/* Modal untuk pratinjau gambar menggunakan DaisyUI */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h2 className="text-xl font-bold">Preview</h2>
              <img
                src={tempImage}
                alt="Preview"
                className="w-full mt-4 rounded-lg"
              />
              <div className="modal-action">
                <button onClick={closeModal} className="btn btn-error">
                  Close
                </button>
                <button onClick={handleSubmit} className="btn btn-success">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
