import { Trainer } from "../../components1/index";
import { trainers } from "../../data";

const Trainers = () => {
  return (
    <>
    <div className="my-12 text-center">
      <h1 className="text-4xl font-bold font-poppins">STRUKTUR KOORDINATOR</h1>
      <p className="text-xl">Memudahkan Peserta Magang dalam Berinteraksi dengan Koordinator</p>
    </div>
      <section className="mb-12">
        <div className="flex justify-center max-w-screen-xl gap-3 mx-auto">
          {trainers.map((trainer) => {
            return <Trainer key={trainer.id} {...trainer} />;
          })}
        </div>
      </section>
    </>
  );
};

export default Trainers;
