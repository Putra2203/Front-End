import { PageWelcome } from "../../components1";

const About = () => {
  return (
    <>
      <PageWelcome title="MENGENAI DISKOMINFO">
        Mencakup Latar Belakang, Visi dan Misi Dinas Komunikasi, Informatika,
        Statistik dan Persandian Kota Semarang
      </PageWelcome>

      <section className="justify-center max-w-screen-xl mx-auto my-12">
        <div className="text-xl font-medium text-justify font-poppins">
          <p className="mb-4">
            Dinas Komunikasi, Informatika, Statistik dan Persandian Kota
            Semarang berdiri pada tahun 2017 sesuai dengan Peraturan Walikota
            Semarang Nomor 76 Tahun 2016 tentang Kedudukan, Susunan Organisasi,
            Tugas dan Fungsi, Serta Tata Kerja Dinas Komunikasi, Informatika,
            Statistik dan Persandian Kota Semarang.
          </p>
          <p>
            Dinas Komunikasi, Informatika, Statistik dan Persandian Kota
            Semarang semula merupakan bagian dari DISHUBKOMINFO yang mengalami
            pemisahan menjadi DISKOMINFO dan DISHUB. DISKKOMINFO bergabung
            dengan bagian Pelayanan data Elektronik (PDE), Bagian Rumah Tangga,
            dan Bagian Humas Setda Kota Semarang menjadi Dinas Komunikasi,
            Informatika, Statistik dan Persandian Kota Semarang.
          </p>
        </div>

        <div className="relative mx-auto mt-12">
          <div className="flex-col">
            <h1 className="absolute text-3xl font-semibold -top-4 font-poppins">
              VISI
            </h1>
            <div className="pl-16">
              <hr className="my-4 border-t-2 border-black" />
              <p>
                <b>2021-2024</b>
              </p>
              <p>
                " Terwujudnya Kota Semarang yang Semakin Hebat berlandaskan
                Pancasila dalam Bingkai NKRI Yang Ber-Bhineka Tunggal Ika "
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto">
          <div className="flex-col">
            <h1 className="absolute text-3xl font-semibold -top-4 font-poppins">
              MISI
            </h1>
            <div className="pl-16">
              <hr className="my-4 border-t-2 border-black" />
              <p>
                Misi kami adalah meningkatkan kualitas dan kapasitas sumber daya
                manusia yang unggul dan produktif untuk mencapai kesejahteraan
                dan keadilan sosial. Kami juga berkomitmen untuk meningkatkan
                potensi ekonomi lokal yang berdaya saing melalui stimulasi
                pembangunan industri, yang didasarkan pada riset dan inovasi,
                sesuai dengan prinsip demokrasi ekonomi Pancasila. Selain itu,
                kami menjamin kemerdekaan masyarakat dalam menjalankan ibadah,
                pemenuhan hak dasar, dan perlindungan kesejahteraan sosial serta
                hak asasi manusia secara berkeadilan. Kami mendukung
                pengembangan infrastruktur berkualitas yang berwawasan
                lingkungan untuk mendorong kemajuan kota. Akhirnya, kami
                menjalankan reformasi birokrasi pemerintahan secara dinamis,
                serta mengarahkan produk hukum sesuai dengan nilai-nilai
                Pancasila dalam rangka menjaga kesatuan Republik Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
