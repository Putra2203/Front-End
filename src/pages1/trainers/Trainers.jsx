import { Trainer } from "../../components1/index";
import { trainers } from "../../data";

const Trainers = () => {
  return (
    <>
    <div className="my-12 text-center">
      <h1 className="text-4xl font-bold font-poppins">STRUKTUR KOORDINATOR</h1>
      <p className="text-xl">Memudahkan Peserta Magang dalam Berinteraksi dengan Koordinator</p>
    </div>
      <section className="p-10 mb-12 lg:p-0">
        <div className="flex flex-wrap justify-center max-w-screen-xl gap-4 mx-auto">
          {trainers.map((trainer) => {
            return (
              <div className="w-full sm:w-1/2 lg:w-1/4 p-0" key={trainer.id}>
                <Trainer {...trainer} />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Trainers;
