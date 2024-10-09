import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { isUnauthorizedError } from "../../config/errorHandling";
import { MdEmail } from "react-icons/md";
import Navbar from "./Navbar";

const Surat = () => {
  const [nama, setNama] = useState("");
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    nim: "",
    prodi: "",
    fakultas: "",
    universitas: "",
    tgl_masuk: "",
    tgl_keluar: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

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
    } catch (error) {
      if (isUnauthorizedError(error)) {
        navigate("/");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage(""); // Clear error message when input fields are filled
  };

  const handleConfirmationChange = (e) => {
    setConfirmationChecked(e.target.checked);
  };

  const handleGenerateDocx = async () => {
    try {
      if (
        !formData.first_name ||
        !formData.last_name ||
        !formData.nim ||
        !formData.prodi ||
        !formData.fakultas ||
        !formData.universitas ||
        !formData.tgl_masuk ||
        !formData.tgl_keluar
      ) {
        setErrorMessage("Isi data diatas terlebih dahulu.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/generateDocx",
        {
          data: formData,
        },
        { responseType: "blob", withCredentials: true }
      );

      if (response.status === 200) {
        const downloadUrl = window.URL.createObjectURL(
          new Blob([response.data])
        );
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "SuratDiterimaMagang.docx");
        document.body.appendChild(link);
        link.click();
      } else {
        console.error("Error generating file:", response.data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="pl-64">
        <div className="container flex flex-col p-4">
          <div className="flex flex-col gap-2 p-6 rounded-lg bg-slate-200">
            <h1 className="text-xl font-bold">Unduh Surat Diterima Magang</h1>
            <div className="flex flex-col justify-between gap-1">
              <label>First Name:</label>
              <input
                type="text"
                name="first_name"
                className="input"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col justify-between gap-1">
              <label>Last Name:</label>
              <input
                type="text"
                name="last_name"
                className="input"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col justify-between gap-1">
              <label>NIM:</label>
              <input
                type="text"
                name="nim"
                className="input"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col justify-between gap-1">
              <label>Program Studi:</label>
              <input
                type="text"
                name="prodi"
                className="input"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col justify-between gap-1">
              <label>Fakultas:</label>
              <input
                type="text"
                name="fakultas"
                className="input"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col justify-between gap-1">
              <label>Asal Instansi:</label>
              <input
                type="text"
                name="universitas"
                className="input"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col justify-between gap-1">
              <label>Tanggal Masuk:</label>
              <input
                type="text"
                name="tgl_masuk"
                className="input"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col justify-between gap-1">
              <label>Tanggal Keluar:</label>
              <input
                type="text"
                name="tgl_keluar"
                className="input"
                onChange={handleInputChange}
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="confirmation-checkbox">
              <input
                type="checkbox"
                id="confirmation"
                checked={confirmationChecked}
                onChange={handleConfirmationChange}
              />
              <label htmlFor="confirmation">
                &nbsp;Saya telah mengisi data diatas dengan benar
              </label>
            </div>
            <div className="mt-4">
              <button
                className="bg-[#000126] text-white px-4 py-2 rounded-lg"
                onClick={handleGenerateDocx}
                disabled={!confirmationChecked}
              >
                Generate Docx
              </button>
            </div>
          </div>
          <div className="flex flex-col my-2">
            <p>Referensi: </p>
            <p>Nama terdaftar :&nbsp;{nama}</p>
          </div>
          <div className="flex flex-col">
            <a
              href="/user/surat"
              target="_parent"
              rel="noreferrer noopener"
              className="flex items-center gap-2 px-4 py-3 text-white bg-red-500 rounded-md"
            >
              <MdEmail />{" "}
              <span>
                <b> Unduh Surat Diterima Magang </b>
              </span>
            </a>
            <br />
            <a
              href="/user/suratkeluar"
              target="_parent"
              rel="noreferrer noopener"
              className="flex items-center gap-2 px-4 py-3 text-white bg-red-500 rounded-md"
            >
              <MdEmail />{" "}
              <span>
                <b> Unduh Surat Selesai Magang </b>
              </span>
            </a>
            <br></br>
            <a
              href="/user/sertifikat"
              target="_parent"
              rel="noreferrer noopener"
              className="flex items-center gap-2 px-4 py-3 text-white bg-red-500 rounded-md"
            >
              <MdEmail />{" "}
              <span>
                <b> Unduh Sertifikat Magang </b>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Surat;
