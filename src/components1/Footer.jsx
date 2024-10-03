import { Link } from "react-router-dom";
import Logo from "./../images/logo.png";
import { AiFillInstagram } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { BsGlobe, BsMap } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import loc from "../images/loc.png";

const Footer = () => {
  return (
    <>
      <div className="p-10 text-white bg-primary">
        <div className="container flex flex-col justify-center max-w-screen-sm gap-12 mx-auto mt-5 text-center lg:max-w-screen-xl lg:gap-28 lg:flex-row lg:text-left">
          <article className="font-semibold font-poppins">
            <Link to="/" className="logo">
              <img src={Logo} alt="Footer Logo" />
            </Link>
            <p className="mt-4 font-normal text-justify">
              Sistem Absensi & Persuratan Peserta Magang (SISAPPMA) merupakan
              sistem yang dibuat oleh Dinas Komunikasi, Informatika, Statistik
              dan Persandian Kota Semarang dalam mengelola data Absensi Peserta
              Magang dan Persuratan yang berdiri dilingkungan Kota Semarang.
              Seluruh data akan dikelola untuk penilaian terhadap Peserta Magang
              DISKOMINFO Kota Semarang.
            </p>
            <div className="mt-4">
              <div className="text-xl font-semibold font-poppins">
                Contact Us
              </div>
              <ul className="mt-2">
                <li className="flex items-center gap-2 text-base">
                  <BsGlobe className="icon_footer" />

                  <a
                    href="https://diskominfo.semarangkota.go.id/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    diskominfo.semarangkota.go.id/
                  </a>
                </li>
                <li className="flex items-center gap-2 text-base">
                  <MdEmail className="icon_footer" />

                  <a
                    href="mailto:diskominfo@semarangkota.go.id"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    diskominfo@semarangkota.go.id
                  </a>
                </li>
                <li className="flex items-center gap-2 text-base">
                  <AiFillInstagram className="icon_footer" />

                  <a
                    href="https://www.instagram.com/diskominfokotasemarang/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    diskominfokotasemarangkota
                  </a>
                </li>
                <li className="flex items-center gap-2 text-base">
                  <IoCallOutline className="icon_footer" />

                  <a href="#" target="_blank" rel="noreferrer noopener">
                    (024) 3549448
                  </a>
                </li>
              </ul>
            </div>
          </article>

          <article className="flex flex-col gap-5">
            <h4>Lainnya</h4>
            <Link to="/about" className="underline hover:text-[#914F1E]">
              About
            </Link>
            <Link to="/plans" className="underline hover:text-[#914F1E]">
              Plans
            </Link>
            <Link to="/trainers" className="underline hover:text-[#914F1E]">
              Trainers
            </Link>
            <Link to="/gallery" className="underline hover:text-[#914F1E]">
              Gallery
            </Link>
            <Link to="/contact" className="underline hover:text-[#914F1E]">
              Login
            </Link>
          </article>

          <article className="flex flex-col gap-5">
            <h4>Layanan</h4>
            <a
              href="https://sistel.semarangkota.go.id/"
              target="_blank"
              rel="noreferrer noopener"
              className="underline hover:text-[#914F1E]"
            >
              SIMENTEL
            </a>
            <a
              href="https://diskominfo.semarangkota.go.id/page/detail/29"
              target="_blank"
              rel="noreferrer noopener"
              className="underline hover:text-[#914F1E]"
            >
              PELAYANAN
            </a>
            <a
              href="https://layanandiskominfo.semarangkota.go.id/"
              target="_blank"
              rel="noreferrer noopener"
              className="underline hover:text-[#914F1E]"
            >
              DOMAIN
            </a>
            <a
              href="https://ppid.semarangkota.go.id/"
              target="_blank"
              rel="noreferrer noopener"
              className="underline hover:text-[#914F1E]"
            >
              PPID
            </a>
            <a
              href="https://smartcity.semarangkota.go.id/"
              target="_blank"
              rel="noreferrer noopener"
              className="underline hover:text-[#914F1E]"
            >
              SMARTCITY
            </a>
          </article>

          <article className="">
            <div className="flex items-center gap-2 mb-5">
              <BsMap />
              <a
                href="https://maps.app.goo.gl/2RVLWLciQSgJF78i8"
                target="_blank"
                rel="noreferrer noopener"
                className="underline hover:text-[#914F1E]"
              >
                Lokasi
              </a>
            </div>
            <div className="w-[300px]">
              <img src={loc} alt="" />
            </div>
          </article>
        </div>
      </div>
      <div className="items-center justify-center py-3 text-center text-white bg-primary">
        <div className="bg-white p-[1px] w-full"></div>
        <small>2024 copyright &copy; all right reserved</small>
      </div>
    </>
  );
};

export default Footer;