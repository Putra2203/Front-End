/* eslint-disable jsx-a11y/img-redundant-alt */
import { PageWelcome } from "../../components1";
import WelcomeImage from "./../../images/about-image.png";
import StoryImage from "./../../images/about1.jpeg";
import VisionImage from "./../../images/about2.png";
import MissionImage from "./../../images/about3.png";
import "./about.scss";

const About = () => {
  return (
    <>
      <PageWelcome title="Mengenai DISKOMINFO" image={WelcomeImage}>
        Mencakup Latar Belakang, Visi dan Misi Dinas Komunikasi, Informatika,
        Statistik dan Persandian Kota Semarang
      </PageWelcome>
      <section className="about__story">
        <div className="about__story-container">
          <div className="about__section-content poppins-regular">
            <p>
              Dinas Komunikasi, Informatika, Statistik dan Persandian Kota
              Semarang berdiri pada tahun 2017 sesuai dengan Peraturan Walikota
              Semarang Nomor 76 Tahun 2016 tentang Kedudukan, Susunan
              Organisasi, Tugas dan Fungsi, Serta Tata Kerja Dinas Komunikasi,
              Informatika, Statistik dan Persandian Kota Semarang.
            </p>
            <p>
              Dinas Komunikasi, Informatika, Statistik dan Persandian Kota
              Semarang semula merupakan bagian dari DISHUBKOMINFO yang mengalami
              pemisahan menjadi DISKOMINFO dan DISHUB. DISKKOMINFO bergabung
              dengan bagian Pelayanan data Elektronik (PDE), Bagian Rumah
              Tangga, dan Bagian Humas Setda Kota Semarang menjadi Dinas
              Komunikasi, Informatika, Statistik dan Persandian Kota Semarang.
            </p>
          </div>
        </div>
      </section>
      <section className="about__vision">
        <div className="about__vision-container">
          <div className="about_vision">
            <div className="content-left">
              <h1 className="poppins-bold">VISI</h1>
            </div>
            <div className="content-right">
              <div className="line"></div>
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
      </section>
      <section className="about__vision">
        <div className="about__vision-container">
          <div className="about_vision">
            <div className="content-left">
              <h2 className="poppins-bold">MISI</h2>
            </div>
            <div className="content-right">
              <div className="line"></div>
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
