import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Gallery = () => {
  return (
    <>
      <div className="mt-32">
        <div className="container flex justify-center max-w-screen-xl mx-auto bg-slate-100" >
          {/* top-content */}
          <div className="w-full bg-slate-400">
            <Swiper
              // install Swiper modules
              modules={[Navigation, Pagination, Scrollbar]}
              spaceBetween={50}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              onSwiper={(swiper) => console.log(swiper)}
              onSlideChange={() => console.log("slide change")}
              className="p-14"
            >
              <SwiperSlide>
                <div className="shadow-xl card card-compact bg-base-100 w-96">
                  <figure>
                    <img
                      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                      alt="Shoes"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">Shoes!</h2>
                    <p>If a dog chews shoes whose shoes does he choose?</p>
                    <div className="justify-end card-actions">
                      <button className="btn btn-primary">Buy Now</button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;
