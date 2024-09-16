
const Trainer = ({ image, name, job, socials }) => {
  return (
    <div className="trainer">
      <div className="trainer__img">
        <img src={image} alt={name} />
        <h3>{name}</h3>
        <p>{job}</p>
        <div className="trainer__socials">
          {socials.map(({ link, icon }, index) => {
            return (
              <a href={link} key={index}>
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
