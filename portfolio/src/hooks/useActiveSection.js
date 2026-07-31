import { useEffect, useState } from "react";
import { navLinks } from "../constants";

/**
 * Scroll-spy via IntersectionObserver.
 *
 * Replaces a scroll listener that called getBoundingClientRect() on every
 * section per tick and, because it had `active` in its own dependency array,
 * tore itself down mid-scroll and re-registered behind a 100ms timeout. That
 * left the highlight visibly frozen while the page was moving.
 *
 * Shared by Navbar and AxisRail so the page pays for exactly one observer.
 */
export const useActiveSection = (enabled = true) => {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!enabled) {
      setActive("");
      return undefined;
    }

    // navLink ids sit on the .hash-span marker; observe its owning <section>.
    const idByEl = new Map();
    navLinks.forEach(({ id }) => {
      const marker = document.getElementById(id);
      const section =
        marker && (marker.closest("section") || marker.parentElement);
      if (section) idByEl.set(section, id);
    });
    if (idByEl.size === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        // Nothing is active while the hero still owns the viewport. scrollY
        // read inside an IO callback is post-layout, so no forced reflow.
        if (window.scrollY < window.innerHeight * 0.55) {
          setActive("");
          return;
        }
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(idByEl.get(entry.target) ?? "");
        });
      },
      {
        // A thin band 45% down the viewport. Sections are contiguous, so at
        // most one can occupy it and "most visible" falls out for free.
        rootMargin: "-45% 0px -50% 0px",
        threshold: 0,
      }
    );

    idByEl.forEach((_id, el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return active;
};

/** Respects prefers-reduced-motion, which scrollIntoView otherwise overrides. */
export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
};
