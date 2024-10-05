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
    return null; // Jika modal tidak ditampilkan, return null.
  }

  return (
    <>
      {showEditTugasModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="modal-header">
              <h5>Edit Tugas</h5>
              <button className="close" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateTugas}>
                <div className="form-group">
                  <label>Judul</label>
                  <input
                    type="text"
                    value={tugasData.judul}
                    onChange={(e) =>
                      setTugasData({ ...tugasData, judul: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Tugas URL</label>
                  <input
                    type="text"
                    value={tugasData.tugas_url}
                    onChange={(e) =>
                      setTugasData({ ...tugasData, tugas_url: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="datetime-local"
                    value={tugasData.dueDate}
                    onChange={(e) =>
                      setTugasData({ ...tugasData, dueDate: e.target.value })
                    }
                  />
                </div>
                <div className="modal-footer">
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
