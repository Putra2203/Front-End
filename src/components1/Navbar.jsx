import { Link, NavLink } from "react-router-dom";
import Logo from "./../images/logo.png";
import { links } from "../data"; // Assume links is an array of { name: "Home", path: "/" } objects
import { VscThreeBars, VscClose } from "react-icons/vsc"; // Mobile icons for open/close
import { useState } from "react";

const Navbar = () => {
  // State to manage mobile menu visibility
  const [nav, setNav] = useState(false);

  return (
    <nav className="z-50 p-5 ">
      <div className="flex items-center justify-between max-w-screen-sm mx-auto lg:max-w-screen-xl">
        {/* Logo */}
        <Link to="/" onClick={() => setNav(false)}>
          <img src={Logo} alt="Nav Logo" className="w-36" />
        </Link>

        {/* Links for desktop and mobile */}
        <ul
          className={`md:flex md:items-center absolute md:static  w-full left-0 top-0 md:top-0 transform ${
            nav ? "translate-y-0 bg-primary p-5" : "-translate-y-full "
          } md:translate-y-0 transition-transform md:w-auto z-40  md:z-auto ease-in`}
        >
          {links.map(({ name, path }, index) => (
            <li key={index} className="p-2 md:ml-4">
              <NavLink
                to={path}
                className="text-white md:text-black hover:underline"
                onClick={() => setNav(true)}
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Hamburger icon for mobile */}
        <div className="z-50 md:hidden ">
          <button onClick={() => setNav(!nav)}>
            {nav ? (
              <VscClose className="text-white" size={24} />
            ) : (
              <VscThreeBars className="text-black" size={24} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
