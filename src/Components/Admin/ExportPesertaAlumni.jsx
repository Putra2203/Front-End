import React from "react";
import { axiosJWTadmin } from "../../config/axiosJWT"; 

const ExportPesertaAlumni = () => {
  const handleExportPesertaAlumni = async () => {
    try {
      const response = await axiosJWTadmin.get(
        "http://localhost:3000/admin/export-peserta-alumni",
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
      a.download = "Alumni.xlsx";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error saat mengekspor alumni:", error);
    }
  };

  return (
    <button onClick={handleExportPesertaAlumni} className="bg-[#183028] px-4 py-1 text-white mb-4 rounded-3xl hover:bg-slate-400 ">
      Export Alumni
    </button>
  );
};

export default ExportPesertaAlumni;
