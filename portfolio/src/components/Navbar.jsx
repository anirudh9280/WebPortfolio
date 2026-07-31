import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { navLinks } from "../constants";
import { GITHUB_URL, LINKEDIN_URL, RESUME_URL } from "../constants/links";
import { useTheme } from "../context/ThemeContext";
import { useActiveSection, scrollToSection } from "../hooks/useActiveSection";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const isHome = location.pathname === "/";
  const active = useActiveSection(isHome);
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock the page while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNavClick = (id) => {
    setMenuOpen(false);
    if (isHome) {
      scrollToSection(id);
    } else {
      navigate(`/#${id}`);
      // Wait for the home route to mount before looking for the anchor.
      setTimeout(() => scrollToSection(id), 300);
    }
  };

  return (
    <header
      // No backdrop-blur: on a fixed element it forces the compositor to
      // re-sample the backdrop every scrolled frame, and at this opacity the
      // blur was invisible anyway.
      className="fixed top-0 z-20 w-full border-b border-line/10 bg-ground/95 transition-colors duration-300"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-16">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0 })}
          className="group flex items-baseline gap-2.5"
        >
          <span className="font-display text-[16px] font-bold tracking-tight text-ink">
            Anirudh Annabathula
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-readout text-muted sm:inline">
            Data Science
          </span>
        </Link>

        <div className="flex items-center gap-7">
          <ul className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`nav-link font-mono text-[11px] uppercase tracking-readout transition-colors hover:text-ink ${
                    active === link.id
                      ? "active text-ink"
                      : "text-muted"
                  }`}
                >
                  {link.title}
                </button>
              </li>
            ))}
          </ul>

          {/* Highest-value link for a recruiter, so it stays reachable from
              every scroll position rather than only from the hero. */}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-chip border border-accent/40 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-readout text-accent transition-colors hover:bg-accent hover:text-on-accent sm:inline-block"
          >
            Résumé
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
            className="rounded-chip border border-line/15 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-readout text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {/* Names the action, not the current state. */}
            {darkMode ? "Light" : "Dark"}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-6 w-6 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`hamburger-line h-px w-5 bg-ink ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`hamburger-line h-px w-5 bg-ink ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div className="border-t border-line/10 bg-ground md:hidden">
          <ul className="flex flex-col px-6 py-2">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full border-b border-line/[0.06] py-4 text-left font-mono text-[13px] uppercase tracking-readout ${
                    active === link.id ? "text-accent" : "text-muted"
                  }`}
                >
                  {link.title}
                </button>
              </li>
            ))}
            {[
              ["Résumé", RESUME_URL],
              ["GitHub", GITHUB_URL],
              ["LinkedIn", LINKEDIN_URL],
            ].map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-line/[0.06] py-4 font-mono text-[13px] uppercase tracking-readout text-accent"
                >
                  {label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
