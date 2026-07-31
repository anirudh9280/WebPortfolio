import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";

const STORAGE_KEY = "motion";

const readStored = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // private mode / blocked storage
  }
};

/**
 * Motion is ON by default for everyone, including visitors whose OS asks for
 * reduced motion.
 *
 * That is a deliberate product decision, not an oversight. The previous
 * behaviour had each component call useReducedMotion() independently, so a
 * machine with "Reduce motion" enabled silently lost the hero animation, the
 * cursor ring and the skills rows with no visible explanation and no way to
 * turn them on. The tradeoff is accepted on the condition that there is one
 * obvious, persistent control that turns all of it off, which is what this
 * context exists to provide.
 *
 * When the OS does ask for reduced motion, the navbar control says so, so the
 * state is at least explained rather than just wrong.
 */
const getInitialMotion = () => {
  if (typeof window === "undefined") return true;
  const saved = readStored();
  if (saved !== null) return saved === "on";
  return true;
};

const MotionContext = createContext({
  motionOn: true,
  prefersReducedMotion: false,
  toggleMotion: () => {},
});

export const MotionProvider = ({ children }) => {
  const [motionOn, setMotionOn] = useState(getInitialMotion);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Tracked only so the control can explain itself. It does not gate anything.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // A class on <html> so CSS animations (marquee, axis rail, cover parallax,
  // signal pulse) can be switched off from the same single source of truth.
  // The inline script in index.html sets it before React mounts.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("motion-off", !motionOn);
    html.classList.toggle("motion-on", motionOn);
  }, [motionOn]);

  const toggleMotion = useCallback(() => {
    setMotionOn((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ motionOn, prefersReducedMotion, toggleMotion }),
    [motionOn, prefersReducedMotion, toggleMotion]
  );

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
};

MotionProvider.propTypes = { children: PropTypes.node.isRequired };

export const useMotionPref = () => useContext(MotionContext);

export default MotionContext;
