import Image from "../Assets/fixImage.png";
import { values } from "../data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

const Values = () => {
  return (
    <section className="mt-32">
      <div className="flex flex-col justify-center max-w-screen-sm gap-2 p-10 mx-auto lg:flex-row lg:max-w-screen-xl lg:gap-11 lg:p-0">
        <div className="lg:w-4/12">
          <div className="mx-auto ">
            <img src={Image} alt="#" />
          </div>
        </div>
        <div className="lg:w-5/12 ">
          <h1 className="mt-10 text-2xl font-semibold lg:text-4xl font-poppins">
            TATA PENGGUNAAN
          </h1>

          <Swiper
            modules={[Navigation]}
            spaceBetween={15}
            slidesPerView={2}
            navigation
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            breakpoints={{
              300: {
                slidesPerView: 1,
                spaceBetween: 7,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 12,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 1,
              },
            }}
          >
            {values.map(({ id, icon, desc }) => {
              return (
                <SwiperSlide className="p-12" key={id}>
                  <div className="relative flex flex-col items-center justify-center p-4 mb-4 text-center shadow-lg bg-secondary rounded-3xl h-60">
                    <div className="absolute top-0 p-3 px-5 -translate-y-5 rounded-full bg-primary">
                      <span className="text-base text-white">{icon}</span>
                    </div>
                    <small className="mb-7 mt-7">{desc}</small>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Values;
