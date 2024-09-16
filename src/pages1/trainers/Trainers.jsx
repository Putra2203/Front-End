import { Trainer } from "../../components1/index";
import { trainers } from "../../data";

import "./trainers.scss";

const Trainers = () => {
  return (
    <>
    <div className="header-trainers">
      <h1 className="poppins-bold">SRUKTUR KOORDINATOR</h1>
      <p>Memudahkan Peserta Magang dalam Berinteraksi dengan Koordinator</p>
    </div>
      <section className="trainers">
        <div className="trainers__container">
          {trainers.map((trainer) => {
            return <Trainer key={trainer.id} {...trainer} />;
          })}
        </div>
      </section>
    </>
  );
};

export default Trainers;
