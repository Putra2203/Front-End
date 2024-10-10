
const Trainer = ({ image, name, job, socials }) => {
  return (
    <div className="p-10 shadow-md bg-slate-200 rounded-3xl">
      <div className="flex flex-col items-center text-center">
        <img src={image} alt={name} className="h-[350px]" />
        <h3 className="mt-4 text-lg font-semibold font-poppins">{name}</h3>
        <p className="font-medium font-poppins">{job}</p>
        <div className="flex gap-4 mt-4">
          {socials.map(({ link, icon }, index) => {
            return (
              <a href={link} key={index} className="p-2 text-2xl border-2 border-black border-solid rounded-md bg-slate-300 hover:bg-slate-100">
                {icon}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Trainer;
