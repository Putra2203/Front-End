// utils.js

/**
 * Fungsi untuk menghitung persentase kehadiran
 * @param {Array} presensiData - Array dari data presensi
 * @returns {number} - Persentase kehadiran
 */
export const hitungPersentaseKehadiran = (presensiData) => {
    const totalPresensi = presensiData.length;
    const validPresensi = presensiData.filter(
      (item) => item.check_in !== "Belum Presensi"
    ).length;
  
    const attendancePercentage =
      totalPresensi > 0 ? (validPresensi / totalPresensi) * 100 : 0;
  
    return attendancePercentage;
  };
  