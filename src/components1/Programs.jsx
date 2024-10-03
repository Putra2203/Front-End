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
                  className="relative flex flex-col items-center justify-center p-4 text-center shadow-lg bg-secondary w-72 lg:w-60 rounded-3xl"
                  key={id}
                >
                  <div className="absolute top-0 p-3 rounded-full bg-primary w-fit -translate-y-7">
                    <span className="text-5xl text-white">{icon}</span>
                  </div>
                  <h4 className="mt-10 text-xl">{title}</h4>
                  <small className="mt-4 text-base text-pretty">
                    <p>{info}</p>
                  </small>
                  <Link
                    to={path}
                    className="flex items-center p-2 px-4 text-sm text-white mt-14 bg-primary hover:bg-slate-500 rounded-3xl"
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
