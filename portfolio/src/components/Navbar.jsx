import { useState } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  const navItemClass = (isActive) => `
    ${
      isActive
        ? darkMode
          ? "text-white"
          : "text-gray-900"
        : darkMode
          ? "text-secondary"
          : "text-gray-600"
    }
    text-[18px] font-medium cursor-pointer
    transition-colors duration-300
    ${darkMode ? "text-teal-300 hover:text-white" : "text-teal-600 hover:text-teal-800"}
  `;

  return (
    <div>
      <nav
        className={`${styles.paddingX}, w-full flex items-center py-5 fixed top-0 z-20 ${darkMode ? "bg-primary" : "bg-slate-200"}`}
      >
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => {
              setActive("");
              window.scrollTo(0, 0);
            }}
          >
            <img src={logo} alt="logo" className="w-9 h-9 object-contain" />
            <p
              className={`${darkMode ? "text-white" : "text-gray-900"} text-[18px] font-bold cursor-pointer flex`}
            >
              Anirudh &nbsp;<span className="">Annabathula</span>
            </p>
          </Link>
          <ul className="list-none hidden sm:flex flex-row gap-10">
            {navLinks.map((link) => (
              <li
                key={link.id}
                className={navItemClass(active === link.title)}
                onClick={() => setActive(link.title)}
              >
                <a href={`#${link.id}`}>{link.title}</a>
              </li>
            ))}
            <li className={navItemClass(false)}>
              <a
                href="https://www.linkedin.com/in/anirudha9/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current hover:after:w-full after:transition-all after:duration-300"
              >
                LinkedIn
              </a>
            </li>
            <li className={navItemClass(false)}>
              <a
                href="https://github.com/anirudh9280"
                target="_blank"
                rel="noopener noreferrer"
                className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current hover:after:w-full after:transition-all after:duration-300"
              >
                Github
              </a>
            </li>
            <li className="flex items-center ml-4">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="toggle"
                  id="theme-toggle"
                  checked={!darkMode}
                  onChange={toggleTheme}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-300 ease-in-out"
                />
                <label
                  htmlFor="theme-toggle"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${darkMode ? "bg-gray-600" : "bg-teal-400"}`}
                ></label>
              </div>
              <span
                className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {darkMode ? "🌙" : "☀️"}
              </span>
            </li>
          </ul>
          <div className="sm:hidden flex flex-1 justify-end items-center">
            <div className="mr-4">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="toggle-mobile"
                  id="theme-toggle-mobile"
                  checked={!darkMode}
                  onChange={toggleTheme}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-300 ease-in-out"
                />
                <label
                  htmlFor="theme-toggle-mobile"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${darkMode ? "bg-gray-600" : "bg-teal-400"}`}
                ></label>
              </div>
              <span
                className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {darkMode ? "🌙" : "☀️"}
              </span>
            </div>
            <img
              src={toggle ? close : menu}
              alt="menu"
              className="w-[28px] object-contain cursor-pointer"
              onClick={() => setToggle(!toggle)}
            />
            <div
              className={`${!toggle ? "hidden" : "flex"} p-6 ${darkMode ? "black-gradient" : "bg-slate-100"} absolute top-20 right-0 mx-4 my-2 min-w[140px] z-10 rounded-xl`}
            >
              <ul className="list-none flex justify-end items-start flex-col gap-4">
                {navLinks.map((link) => (
                  <li
                    key={link.id}
                    className={`${
                      active === link.title
                        ? darkMode
                          ? "text-white"
                          : "text-gray-900"
                        : darkMode
                          ? "text-secondary"
                          : "text-gray-600"
                    } 
                      font-poppins font-medium cursor-pointer text-[16px]
                      transition-colors duration-300
                      ${darkMode ? "hover:text-white" : "hover:text-teal-800"}`}
                    onClick={() => {
                      setToggle(!toggle);
                      setActive(link.title);
                    }}
                  >
                    <a href={`#${link.id}`}>{link.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
