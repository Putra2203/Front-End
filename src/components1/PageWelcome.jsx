import image from "../images/about1.jpeg";

const PageWelcome = ({ title, children }) => {
  return (
    <header
      className="relative flex items-center justify-center h-screen bg-center bg-cover "
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute m-6 text-center text-white lg:w-1/2">
        <h2 className="mb-4 text-2xl font-semibold lg:text-4xl font-poppins">{title}</h2>
        <p className="text-base lg:text-xl">{children}</p>
      </div>
    </header>
  );
};

export default PageWelcome;
