import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { axiosJWTuser } from "../../config/axiosJWT";
import { isUnauthorizedError } from "../../config/errorHandling";
import { showSuccessNotification } from "../../Components/User/toastSuccess";
import { showErrorNotification } from "../../Components/User/toastFailed";
import Navbar from "./Navbar";

const Profil = () => {
  const [nama, setNama] = useState("");
  const [username, setUserName] = useState("");
  const [asal_univ, setAsalUniv] = useState("");
  const [asal_jurusan, setAsalJurusan] = useState("");
  const [no_telp, setNoTelp] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "peserta_magang",
        },
      });
      const decoded = jwt_decode(response.data.token);
      setNama(decoded.nama);
      setUserName(decoded.username);
      setAsalUniv(decoded.asal_univ);
      setAsalJurusan(decoded.asal_jurusan);
      setNoTelp(decoded.no_telp);
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
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const ambilid = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "peserta_magang",
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

      const response = await axiosJWTuser.patch(
        `http://localhost:3000/user/peserta/${decoded.userId}/edit-foto-profil`,
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
      showErrorNotification("Gagal Update Foto Profil");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTempImage(null);
  };

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="pl-64">
        <div className="container flex flex-col items-center justify-center h-screen p-4">
          <div className="flex flex-col w-full max-w-3xl p-8 bg-white border rounded-lg shadow-2xl">
            <div className="flex items-center gap-6">
              {/* Profile Picture */}
              <div className="avatar">
                <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" />
                  ) : (
                    <div className="w-full h-full bg-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">{nama}</h2>
                <p className="text-gray-600">@{username}</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Asal Universitas
              </label>
              <input
                type="text"
                value={asal_univ}
                className="w-full max-w-lg input input-bordered"
                disabled
              />
            </div>

            <div className="mt-6">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Asal Jurusan
              </label>
              <input
                type="text"
                value={asal_jurusan}
                className="w-full max-w-lg input input-bordered"
                disabled
              />
            </div>

            <div className="mt-6">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Nomor Telepon
              </label>
              <input
                type="text"
                value={no_telp}
                className="w-full max-w-lg input input-bordered"
                disabled
              />
            </div>

            {/* Upload Profile Picture Button */}
            <div className="mt-6">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Update Foto Profil
              </label>
              <input
                type="file"
                onChange={handlePictureChange}
                className="w-full max-w-xs file-input file-input-bordered"
              />
            </div>

            {/* Modal for image confirmation */}
            {isModalOpen && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <h3 className="text-lg font-bold">Konfirmasi Foto Profil</h3>
                  <div className="flex justify-center mt-4">
                    <img
                      src={tempImage}
                      alt="Preview"
                      className="w-32 h-32 rounded-full"
                    />
                  </div>
                  <div className="modal-action">
                    <button onClick={handleSubmit} className="btn btn-primary">
                      Simpan
                    </button>
                    <button onClick={closeModal} className="btn btn-secondary">
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
