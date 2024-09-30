import { Link, NavLink } from "react-router-dom";
import Logo from "./../images/logo.png";
import { links } from "../data"; // Assume links is an array of { name: "Home", path: "/" } objects
import { VscThreeBars, VscClose } from "react-icons/vsc"; // Mobile icons for open/close
import { useState } from "react";

const Navbar = () => {
  // State to manage mobile menu visibility
  const [nav, setNav] = useState(false);

  return (
    <nav className="bg-[#d2a67d] p-2 z-50">
      <div className="flex items-center justify-between max-w-screen-sm mx-auto lg:max-w-screen-xl">
        {/* Logo */}
        <Link to="/" onClick={() => setNav(false)}>
          <img src={Logo} alt="Nav Logo" className="w-36" />
        </Link>

        {/* Links for desktop and mobile */}
        <ul
          className={`md:flex md:items-center absolute md:static bg-[#d2a67d] w-full left-0 top-0 md:top-0 transform ${
            nav ? "translate-y-0" : "-translate-y-full"
          } md:translate-y-0 transition-transform md:w-auto z-40 md:z-auto ease-in`}
        >
          {links.map(({ name, path }, index) => (
            <li key={index} className="p-2 md:ml-4">
              <NavLink
                to={path}
                className="text-[#633015] hover:underline"
                onClick={() => setNav(false)}
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Hamburger icon for mobile */}
        <div className="z-50 md:hidden">
          <button onClick={() => setNav(!nav)}>
            {nav ? (
              <VscClose className="text-[#633015]" size={24} />
            ) : (
              <VscThreeBars className="text-[#633015]" size={24} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
