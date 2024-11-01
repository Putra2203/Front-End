/* eslint-disable jsx-a11y/img-redundant-alt */
import { Link } from "react-router-dom";
import Image from "../images/logoFix.jpg";

const Welcome = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      {/* left container */}
      <div className="flex items-center justify-center max-w-screen-sm -mt-10 lg:-mt-20 lg:max-w-screen-xl h-2/3 ">
        <div className="p-5 lg:pl-10 lg:w-11/12">
          <div className="mb-3 lg:hidden">
            <div>
              <img src={Image} alt="Welcome Image"/>
            </div>
          </div>
          <h4 className="mb-3 text-base lg:text-xl">
            <b>PORTAL SISAPPMA</b>
          </h4>
          <h2 className="text-2xl leading-none lg:w-11/12 lg:leading-10 tfont-normal lg:text-4xl ">
            Dinas Komunikasi, Informatika, Statistik dan Persandian Kota
            Semarang
          </h2>
          <p className="mt-2 lg:w-2/3 lg:text-base">
            <small>
              Layanan Sistem Untuk Peserta Magang DISKOMINFO Kota Semarang
              Perihal Absensi dan Surat Menyurat Magang.
            </small>
          </p>
          <Link to="/about">
            <p className="p-2 px-4 mt-2 text-white rounded-full bg-primary w-fit hover:bg-slate-500 hover:underline">Pelajari Lebih Lanjut</p>
          </Link>
        </div>
        {/* right container */}
        <div>
          <div className="hidden pr-10 lg:flex">
            <img src={Image} alt="Welcome Image"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
