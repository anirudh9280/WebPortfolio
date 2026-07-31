import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useMotionPref } from "../context/MotionContext";

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

/**
 * Counts a number up when it scrolls into view.
 *
 * The design system says mono carries every number on this site, so animating
 * those figures animates the thesis rather than decorating around it.
 *
 * Returns [ref, displayValue]. Attach the ref to the element that should
 * trigger. Always lands exactly on `value`: the final frame is assigned from
 * the target, not from the interpolation, so a count-up can never leave a
 * wrong figure on screen.
 *
 * Pair the rendered output with `tabular-nums` in any proportional font, or the
 * whole line shifts as digits change.
 */
export const useCountUp = (value, { duration = 1100 } = {}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const { motionOn } = useMotionPref();
  const prefersReducedMotion = !motionOn;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!Number.isFinite(value)) return undefined;

    if (!inView || prefersReducedMotion) {
      // Reduced motion, or not yet reached: show the real number immediately
      // rather than a stale zero.
      if (prefersReducedMotion) setDisplay(value);
      return undefined;
    }

    let raf = 0;
    let start = 0;

    const step = (now) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      if (t >= 1) {
        setDisplay(value);
        return;
      }
      setDisplay(Math.round(easeOutCubic(t) * value));
      raf = window.requestAnimationFrame(step);
    };

    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [value, inView, prefersReducedMotion, duration]);

  return [ref, Number.isFinite(value) ? display : value];
};

export default useCountUp;
