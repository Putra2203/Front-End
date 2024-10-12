import './card.css';
import React, { useState } from 'react';
import { axiosJWTuser } from '../config/axiosJWT';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cards = ({ data, setData }) => {

  const [selectedTaskID, setSelectedTaskID] = useState(null);
  const [file, setFile] = useState();
  const [show, setShow] = useState(false);

  const handleShow = (taskID) => {
    setSelectedTaskID(taskID);
    setShow(true);
  }

  const handleClose = () => {
    setShow(false);
    setSelectedTaskID(null);
  }

  const hadleFile = (event) => {
    setFile(event.target.files[0]);
  }

  const uploadFile = async () => {
    try {
      const ambilid = await axios.get('http://localhost:3000/account/token', {
        headers: { 'role': "peserta_magang" },
      });
      const decoded = jwt_decode(ambilid.data.token);

      const formData = new FormData();
      formData.append('image', file);
      const response = await axiosJWTuser.patch(`http://localhost:3000/user/tugas/${decoded.userId}/submit/${selectedTaskID}`, formData);

      const updatedResponse = await axiosJWTuser.get(`http://localhost:3000/user/tugas-list/${decoded.userId}`);
      setData(updatedResponse.data.tugas);

      toast.success("Berhasil Submit Gambar");
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      window.alert("Gagal Submit Gambar");
      handleClose();
    }
  }

  return (
    <div>
      {/* Kartu Tugas */}
      <div className="shadow-xl card bg-base-100" style={{ cursor: "pointer" }} onClick={() => handleShow(data.tugas.id)}>
        <h2 className="p-4 card-title">
          {data.tugas.judul}
        </h2>
        <p className="px-4 py-2">
          {data.tugas.tugas_url}
        </p>
        <div className="px-4 py-2 card-footer">
          <p>{data.tugas.dueDate}</p>
        </div>
      </div>

      {/* Modal DaisyUI */}
      {show && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Submit Tugas</h3>
            <p className="py-4">Pilih gambar yang akan diupload</p>
            <input 
              type='file' 
              name='image' 
              accept="image/jpeg, image/png" 
              onChange={hadleFile}
              className="w-full max-w-xs file-input file-input-bordered"
            />
            <div className="modal-action">
              <button className="btn" onClick={handleClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={uploadFile}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cards;
