
/**
 * Fungsi untuk menghitung persentase kehadiran
 * @param {Array} presensiData - Array dari data presensi
 * @returns {number} - Persentase kehadiran
 */
export const hitungPersentaseKehadiran = (presensi) => {
  if (!presensi.length) return 0; // Menghindari pembagian dengan nol

  const total = presensi.length; // Total presensi
  const completed = presensi.filter(
    (item) => item.status === "completed"
  ).length; // Hitung yang selesai

  return (completed / total) * 100; // Hitung persentase
};
