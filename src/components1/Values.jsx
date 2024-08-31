import Image from "../Assets/valueImage.png";
import { values } from "../data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation} from "swiper/modules";
import "swiper/swiper-bundle.css";

const Values = () => {
  return (
    <section className="values">
      <div className="container values__container">
        <div className="values__left">
          <div className="values__image">
            <img src={Image} alt="Values Image" />
          </div>
        </div>
        <div className="values__right">
          <h1 className="poppins-semibold">TATA PENGGUNAAN</h1>
          <div className="values__wrapper">
            <Swiper
              modules={[Navigation]}
              spaceBetween={15}
              slidesPerView={2}
              navigation
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
            >
              {values.map(({ id, title, icon, desc }) => {
                return (
                  <div className="card_values_wraper">
                    <SwiperSlide>
                      <div className="values__value" key={id}>
                        <div className="number_values">
                          <span>{icon}</span>
                        </div>
                        <small>{desc}</small>
                      </div>
                    </SwiperSlide>
                  </div>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;
