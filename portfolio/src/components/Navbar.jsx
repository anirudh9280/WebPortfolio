import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navLinks } from "../constants";
import { logo } from "../assets";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll-based active section detection (only on home page)
  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => {
        const sections = navLinks.map((link) => link.id);
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;
        const scrollCenter = scrollPosition + viewportHeight / 2;

        let currentSection = "";
        let maxOverlap = 0;

        // Check each section to see which one has the most overlap with viewport
        sections.forEach((sectionId) => {
          const section = document.getElementById(sectionId);
          if (section) {
            const rect = section.getBoundingClientRect();
            const sectionTop = scrollPosition + rect.top;
            const sectionBottom = sectionTop + rect.height;

            // Calculate overlap with viewport
            const overlapTop = Math.max(scrollPosition, sectionTop);
            const overlapBottom = Math.min(
              scrollPosition + viewportHeight,
              sectionBottom
            );
            const overlap = Math.max(0, overlapBottom - overlapTop);

            // If this section has more overlap than current best, use it
            if (overlap > maxOverlap) {
              maxOverlap = overlap;
              currentSection = sectionId;
            }
          }
        });

        // Fallback logic for edge cases
        if (!currentSection || maxOverlap < 100) {
          if (scrollPosition < 300) {
            currentSection = "about";
          } else {
            // Check if we're near the bottom
            const docHeight = document.documentElement.scrollHeight;
            if (scrollPosition + viewportHeight >= docHeight - 200) {
              currentSection = "contact";
            } else {
              // Use the section whose top is closest to the scroll center
              let closestDistance = Infinity;
              sections.forEach((sectionId) => {
                const section = document.getElementById(sectionId);
                if (section) {
                  const rect = section.getBoundingClientRect();
                  const sectionTop = scrollPosition + rect.top;
                  const distance = Math.abs(sectionTop - scrollCenter);

                  if (distance < closestDistance) {
                    closestDistance = distance;
                    currentSection = sectionId;
                  }
                }
              });
            }
          }
        }

        if (currentSection && currentSection !== active) {
          setActive(currentSection);
        }
      };

      // Add a small delay to ensure sections are rendered
      const timeoutId = setTimeout(() => {
        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Set initial active section
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
      setActive(""); // Clear active state on other pages
    }
  }, [location.pathname, active]);

  const handleNavClick = (linkId) => {
    // Immediately set the active state for responsive UI
    setActive(linkId);

    if (location.pathname === "/") {
      // If we're on the home page, just scroll to the section
      const element = document.getElementById(linkId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If we're on another page, navigate to home then scroll to section
      navigate(`/#${linkId}`);
      // Wait longer for page to load and sections to render
      setTimeout(() => {
        const element = document.getElementById(linkId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          // Ensure the active state is maintained after navigation
          setActive(linkId);
        }
      }, 300);
    }
  };

  return (
    <nav
      className={`w-full flex items-center py-4 fixed top-0 z-20 transition-all duration-300 ${
        darkMode
          ? "bg-primary/95 backdrop-blur-sm"
          : "bg-white/95 backdrop-blur-sm"
      } border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
          <p
            className={`${
              darkMode ? "text-white" : "text-gray-900"
            } text-lg font-bold cursor-pointer`}
          >
            Anirudh Annabathula
          </p>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.id} className="relative">
                <button
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-1 py-2 text-sm font-medium transition-colors duration-300 ${
                    active === link.id
                      ? darkMode
                        ? "text-white"
                        : "text-gray-900"
                      : darkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.title}
                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-teal-500 transition-all duration-300 ease-out ${
                      active === link.id ? "w-full" : "w-0"
                    }`}
                  />
                  {/* Hover underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-teal-400 transition-all duration-300 ease-out opacity-0 hover:opacity-100 ${
                      active === link.id ? "w-0" : "hover:w-full"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                darkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {darkMode ? "🌙" : "☀️"}
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors duration-300 ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {/* Hamburger Menu */}
          <button
            onClick={() => setToggle(!toggle)}
            className={`p-2 rounded-lg transition-colors duration-300 ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  toggle ? "rotate-45 translate-y-1" : "-translate-y-1"
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  toggle ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  toggle ? "-rotate-45 -translate-y-1" : "translate-y-1"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full transition-all duration-300 ease-in-out ${
          toggle
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        } ${
          darkMode
            ? "bg-primary/95 border-gray-800"
            : "bg-white/95 border-gray-200"
        } border-b backdrop-blur-sm`}
      >
        <ul className="px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => {
                  handleNavClick(link.id);
                  setToggle(false);
                }}
                className={`block w-full text-left px-1 py-2 text-sm font-medium transition-colors duration-300 ${
                  active === link.id
                    ? darkMode
                      ? "text-white"
                      : "text-gray-900"
                    : darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
