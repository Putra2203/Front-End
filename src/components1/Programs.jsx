import { AiFillCaretRight } from "react-icons/ai";
import { programs } from "../data";
import { Link } from "react-router-dom";

const Programs = () => {
  return (
    <section className="container">
      <div className="justify-center max-w-screen-sm mx-auto lg:max-w-screen-xl">
        <h1 className="p-2 mb-16 text-2xl font-semibold text-center lg:text-left lg:text-4xl font-poppins lg:p-0">
          LAYANAN SISAPPMA
        </h1>
        <div className="flex flex-col items-center justify-center gap-10 lg:gap-4 lg:items-stretch lg:flex-row">
          {programs.map(({ id, icon, title, info, path }) => {
            return (
              <>
                <div
                  className=" bg-[#DEAC80] w-72 lg:w-60 p-4 items-center justify-center flex-col flex relative rounded-3xl text-center"
                  key={id}
                >
                  <div className="bg-[#914F1E] w-fit p-3 rounded-full absolute top-0 -translate-y-7">
                    <span className="text-5xl text-white">{icon}</span>
                  </div>
                  <h4 className="mt-10 text-[#331200] text-xl">{title}</h4>
                  <small className="mt-4 text-base text-pretty">
                    <p>{info}</p>
                  </small>
                  <Link
                    to={path}
                    className="flex items-center mt-14 bg-[#914F1E] hover:bg-[#EAD8B1] p-2 rounded-3xl text-sm px-4 text-white"
                  >
                    Detail <AiFillCaretRight />
                  </Link>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Programs;
