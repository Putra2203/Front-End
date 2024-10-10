import React, { useState, useEffect } from "react";
import { axiosJWTadmin } from "../../config/axiosJWT";
import { toast } from "react-toastify";

const EditTugas = ({
  tugasId,
  handleCloseModal,
  showEditTugasModal,
  updateTugasData,
}) => {
  const [tugasData, setTugasData] = useState({
    judul: "",
    tugas_url: "",
    dueDate: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (tugasId) {
      axiosJWTadmin
        .get(`http://localhost:3000/admin/tugas-by-id/${tugasId}`)
        .then((response) => {
          const tugas = response.data.tugas;
          const formattedDueDate = new Date(tugas.dueDate)
            .toISOString()
            .slice(0, 16);
          setTugasData({
            judul: tugas.judul,
            tugas_url: tugas.tugas_url,
            dueDate: formattedDueDate,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [tugasId]);

  const handleUpdateTugas = async (e) => {
    e.preventDefault();
    try {
      await axiosJWTadmin.patch(
        `http://localhost:3000/admin/tugas/${tugasId}/edit`,
        tugasData
      );
      updateTugasData({ id: tugasId, ...tugasData });
      handleCloseModal();
      showSuccessNotification("Keterangan tugas berhasil diubah.");
    } catch (error) {
      showErrorNotification("Gagal mengubah keterangan tugas.");
      console.error(error);
    }
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

  if (!showEditTugasModal) {
    return null; 
  }

  return (
    <>
      {showEditTugasModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-secondary">
            <div className="flex items-center justify-between mb-4">
              
              <h5 className="text-xl font-semibold font-poppins">Edit Tugas</h5>
              <button className="text-2xl text-black -translate-y-2" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="">
              <form onSubmit={handleUpdateTugas} className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <label>Judul</label>
                  <input
                  className="p-2 border rounded-lg bg-slate-50"
                    type="text"
                    value={tugasData.judul}
                    onChange={(e) =>
                      setTugasData({ ...tugasData, judul: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <label>Deskripsi</label>
                  <input
                  className="p-2 border rounded-lg bg-slate-50"
                    type="text"
                    value={tugasData.tugas_url}
                    onChange={(e) =>
                      setTugasData({ ...tugasData, tugas_url: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <label>Due Date</label>
                  <input
                  className="p-2 border rounded-lg bg-slate-50"
                    type="datetime-local"
                    value={tugasData.dueDate}
                    onChange={(e) =>
                      setTugasData({ ...tugasData, dueDate: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditTugas;
