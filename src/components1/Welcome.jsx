/* eslint-disable jsx-a11y/img-redundant-alt */
import { Link } from "react-router-dom";
import Image from "../images/diskominfoicon1.png";

const Welcome = () => {
  return (
    <header className="welcome">
      <div className="container welcome-container">
        <div className="welcome-left">
          <div>
            <div className="welcome-image-up">
              <img src={Image} alt="Welcome Image" />
            </div>
          </div>
          <h4 className="poppins-semibold text-black">
            <b>PORTAL SISAPPMA</b>
          </h4>
          <h2 className="poppins-medium">
            Dinas Komunikasi, Informatika, Statistik dan Persandian Kota
            Semarang
          </h2>
          <p className="poppins-regular">
            <small>
              Layanan Sistem Untuk Peserta Magang DISKOMINFO Kota Semarang
              Perihal Absensi dan Surat Menyurat Magang.
            </small>
          </p>
          <Link to="/plans" className="button-more">
            <p className="poppins-semibold">Pelajari Lebih Lanjut</p>
          </Link>
        </div>
        <div className="welcome-right">
          <div className="welcome-image-down">
            <img src={Image} alt="Welcome Image" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Welcome;
