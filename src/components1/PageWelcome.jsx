import image from "../images/about1.jpeg";

const PageWelcome = ({ title, children }) => {
  return (
    <header
      className="relative flex items-center justify-center h-screen bg-center bg-cover "
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute w-1/2 text-center text-white">
        <h2 className="mb-4 text-4xl font-semibold font-poppins">{title}</h2>
        <p className="text-xl">{children}</p>
      </div>
    </header>
  );
};

export default PageWelcome;
