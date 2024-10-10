import React from "react";
import { axiosJWTadmin } from "../../config/axiosJWT"; 

const ExportPesertaCalon = () => {
  const handleExportPesertaCalon = async () => {
    try {
      const response = await axiosJWTadmin.get(
        "http://localhost:3000/admin/export-peserta-calon",
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Peserta Calon.xlsx";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error saat mengekspor peserta calon:", error);
    }
  };

  return (
    <button onClick={handleExportPesertaCalon} className="bg-[#183028] px-4 py-1 text-white mb-4 rounded-3xl hover:bg-slate-400 ">
      Export Calon Peserta
    </button>
  );
};

export default ExportPesertaCalon;
