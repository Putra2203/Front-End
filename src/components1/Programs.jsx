import { AiFillCaretRight } from "react-icons/ai";
import { programs } from "../data";
import { Link } from "react-router-dom";

const Programs = () => {
  return (
    <section className="programs">
      <div className="container programs__container">
        <div className="section_header">
          <h1 className="poppins-bold">LAYANAN SISAPPMA</h1>
        </div>
        <div className="container_card">
          <div className="programs__wrapper">
            {programs.map(({ id, icon, title, info, path }) => {
              return (
                <>
                  <div className="programs__program" key={id}>
                    <div className="icon_programs">
                      <span>{icon}</span>
                    </div>
                    <h4>{title}</h4>
                    <small>{info}</small>
                    <Link to={path} className="btn_program">
                      Detail <AiFillCaretRight />
                    </Link>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
