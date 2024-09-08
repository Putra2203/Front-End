// import Image from "../images/values.jpg";
import { SectionHeader } from "./index";
import { ImQuotesLeft } from "react-icons/im";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { Card } from "../UI";
import { testimonials } from "../data";
import { useState } from "react";

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const { name, quote, job, avatar } = testimonials[index];
  // const generateIndex = () => {
  //   if (index < 0) {
  //     return testimonials.length - 1;
  //   } else if (testimonials.length === index) {
  //     return 0;
  //   }
  // };
  const prevTestimonial = () => {
    const newIndex = !index ? testimonials.length - 1 : index - 1;
    setIndex(newIndex);
  };
  const nextTestimonial = () => {
    const newIndex = index === testimonials.length - 1 ? 0 : index + 1;
    setIndex(newIndex);
  };

  return (
    <section className="testimonials">
      <div className="container testimonials__container">
        <div className="tittle_testimonial poppins-semibold">TESTIMONIAL'S</div>
        <Card className="testimonial poppins-regular">
          <div className="testimonial__avatar">
            <img src={avatar} alt={name} />
          </div>
          <div className="testimonial_right">
            <h5 className="poppins-semibold">{name}</h5>
            <small className="testimonial__title">{job}</small>
            <p className="testimonial__quote">"{quote}"</p>
          </div>
        </Card>
        <div className="testimonials__btn-container">
          <button className="testimonial__btn" onClick={prevTestimonial}>
            <IoIosArrowDropleftCircle />
          </button>
          <button className="testimonial__btn" onClick={nextTestimonial}>
            <IoIosArrowDroprightCircle />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
