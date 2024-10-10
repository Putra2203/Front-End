import { useState } from "react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// Import images for Alumni Magang section (slider)
import unnes from '../../images/unnes.jpg';
import udinus from '../../images/udinus.jpg';
import unika from '../../images/unika.jpg';
import undip from '../../images/undip.jpg';

// Import images for Seputar Diskominfo section (grid)
import gallery1 from '../../images/gallery1.jpg';
import gallery2 from '../../images/gallery2.jpg';
import gallery3 from '../../images/gallery3.jpg';
import gallery4 from '../../images/gallery4.jpg';
import gallery5 from '../../images/gallery5.jpg';
import gallery6 from '../../images/gallery6.jpg';
import gallery7 from '../../images/gallery7.jpg';
import gallery8 from '../../images/gallery8.jpg';
import gallery9 from '../../images/gallery9.jpg';
import gallery10 from '../../images/gallery10.jpg';
import gallery11 from '../../images/gallery11.jpg';
import gallery12 from '../../images/gallery12.jpg';
import gallery13 from '../../images/gallery13.jpg';
import gallery14 from '../../images/gallery14.jpg';
import gallery15 from '../../images/gallery15.jpg';

const Gallery = () => {
  const [relatedImages, setRelatedImages] = useState([]); // State untuk menyimpan gambar terkait
  const [relatedTitle, setRelatedTitle] = useState(""); // State untuk menyimpan nama kampus
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol tampilan modal

  const sliderData = [
    { src: unnes, label: "Unnes", related: [gallery1, gallery2, gallery3] },
    { src: udinus, label: "Udinus", related: [gallery4, gallery5, gallery6] },
    { src: unika, label: "Unika", related: [gallery7, gallery8, gallery9] },
    { src: undip, label: "Undip", related: [gallery10, gallery11, gallery12] },
  ];

  // Gambar untuk grid Seputar Diskominfo
  const gridImages = [
    gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, 
    gallery7, gallery8, gallery9, gallery13, gallery10, gallery11, 
    gallery12, gallery14, gallery15
  ];

  // Fungsi untuk menangani klik pada slider
  const handleSliderClick = (item) => {
    setRelatedImages(item.related); 
    setRelatedTitle(item.label); 
    setIsModalOpen(true); 
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="container max-w-screen-xl px-4 mx-auto mb-10 mt-15">
        <h2 className="mb-10 text-3xl font-bold text-center">GALLERY</h2>

        {/* Bagian Slider */}
        <div className="mb-12">
          <div className="inline-block px-4 py-2 mb-4 text-2xl font-bold text-white bg-black rounded-full">
            Alumni Magang
          </div>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar]}
            spaceBetween={20}
            slidesPerView={1} // Menampilkan 1 slide untuk mobile
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            breakpoints={{
              640: { slidesPerView: 1 }, // 1 slide untuk mobile
              768: { slidesPerView: 2 }, // 2 slides untuk tablet
              1024: { slidesPerView: 3 }, // 3 slides untuk desktop kecil
              1280: { slidesPerView: 4 }, // 4 slides untuk desktop besar
            }}
            className="px-4"
          >
            {sliderData.map((item, index) => (
              <SwiperSlide key={index} onClick={() => handleSliderClick(item)}>
                <div className="overflow-hidden bg-white rounded-md shadow-md cursor-pointer">
                  <div className="w-full h-64 overflow-hidden">
                    <img
                      src={item.src}
                      alt={`Slider Image ${item.label}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="py-2 text-lg text-center text-white bg-black">
                    {item.label}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Menampilkan Gambar Terkait dalam Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
              <h2 className="mb-4 text-2xl font-bold">Alumni dari {relatedTitle}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {relatedImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Related Image ${index + 1}`}
                    className="w-full h-auto rounded-md"
                  />
                ))}
              </div>
              <button
                onClick={closeModal}
                className="px-6 py-2 mt-4 text-white bg-blue-500 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Bagian Grid Seputar Diskominfo */}
        <div className="mt-12">
          <div className="inline-block px-4 py-2 mb-4 text-2xl font-bold text-white bg-black rounded-full">
            Seputar Diskominfo
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {gridImages.map((src, index) => (
              <div key={index} className="rounded-md">
                <img
                  src={src}
                  alt={`Grid Image ${index + 1}`}
                  className="w-full h-auto rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;
