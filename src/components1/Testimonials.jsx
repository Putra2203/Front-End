import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
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
      <div className="container flex max-w-screen-sm p-10 mx-auto mt-12 lg:mt-32 lg:max-w-screen-xl">
        <div className="mb-0 lg:mb-8">
          <h1 className="text-4xl font-semibold font-poppins">
            TESTIMONIAL'S
          </h1>
        </div>
      </div>
      <section className="flex flex-col items-center justify-center max-w-screen-xl mx-auto mb-32 ">
        <div className="container relative flex flex-col items-center justify-center w-8/12 p-10 ">
          <div className="flex flex-col items-center justify-center gap-4 p-6 shadow-lg lg:flex-row bg-secondary rounded-3xl">
            <div className="relative w-48 lg:w-56">
              <img
                src={avatar}
                alt={name}
                className="w-full h-48 rounded-full lg:h-full"
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

          <div className="absolute bottom-0 flex justify-center w-full gap-4 mx-auto lg:right-0 lg:justify-between lg:top-0 lg:gap-0">
            <button
              className="text-4xl text-primary hover:text-slate-500"
              onClick={prevTestimonial}
            >
              <IoIosArrowDropleftCircle />
            </button>
            <button
              className="text-4xl text-primary hover:text-slate-500"
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
