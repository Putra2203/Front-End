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
  const prevTestimonial = () => {
    const newIndex = !index ? testimonials.length - 1 : index - 1;
    setIndex(newIndex);
  };
  const nextTestimonial = () => {
    const newIndex = index === testimonials.length - 1 ? 0 : index + 1;
    setIndex(newIndex);
  };

  return (
    <>
      <div className="container mt-32 ">
        <div className="max-w-screen-xl mx-auto mb-8">
          <h1 className="text-4xl font-semibold font-poppins">
            TESTIMONIAL'S
          </h1>
        </div>
      </div>
      <section className="flex flex-col items-center justify-center max-w-screen-xl mx-auto ">
        <div className="container relative flex flex-col items-center justify-center w-8/12 p-10 ">
          <div className="flex bg-[#DEAC80] p-6 gap-4  justify-center items-center rounded-3xl shadow-2xl">
            <div className="w-56">
              <img
                src={avatar}
                alt={name}
                className="w-full h-full rounded-full"
              />
            </div>
            <div className="">
              <h5 className="font-semibold font-poppins text-[#331200]">
                {name}
              </h5>
              <small className="font-normal font-poppins">{job}</small>
              <p className="mt-3">"{quote}"</p>
            </div>
          </div>

          <div className="absolute flex justify-between w-full ">
            <button
              className="text-[#914F1E] text-4xl hover:text-[#EAD8B1]"
              onClick={prevTestimonial}
            >
              <IoIosArrowDropleftCircle />
            </button>
            <button
              className="text-[#914F1E] text-4xl hover:text-[#EAD8B1]"
              onClick={nextTestimonial}
            >
              <IoIosArrowDroprightCircle />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
