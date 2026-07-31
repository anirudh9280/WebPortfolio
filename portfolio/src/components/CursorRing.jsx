import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { frame, motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

const SIZE = 28;

/**
 * A ring that trails the pointer.
 *
 * The native cursor stays visible on purpose. Hiding it with `cursor: none`
 * breaks the pointer-size and high-contrast settings people configure for
 * accessibility, and there is no CSS media query to detect that they did, so
 * there is no way to avoid harming them. This version adds a layer instead of
 * taking one away.
 *
 * Two implementation rules that matter:
 *  - Pointer position is never React state. pointermove fires up to ~500Hz on
 *    high-poll-rate mice against 60 usable frames; a state-based hook would
 *    re-render every consumer per event.
 *  - Position is written through motion values as `x`/`y` so the element stays
 *    transform-only and never triggers layout.
 *
 * Portaled to document.body because `transform`, `opacity`, `filter` and
 * `will-change` all create stacking contexts, so any framer-motion wrapper
 * would otherwise confine a position:fixed child.
 */
const CursorRing = () => {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 28, stiffness: 350, mass: 0.35 });
  const springY = useSpring(y, { damping: 28, stiffness: 350, mass: 0.35 });
  // Starts hidden, or it flashes at the origin before the first pointermove.
  const opacity = useMotionValue(0);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    // Coarse pointers (touch) have no cursor to trail.
    const fine = window.matchMedia("(any-hover: hover) and (pointer: fine)");
    if (!fine.matches) return undefined;
    setEnabled(true);

    const onMove = (e) => {
      // frame.read batches with framer-motion's own render loop instead of
      // writing style on every one of up to ~500 events per second.
      frame.read(() => {
        x.set(e.clientX - SIZE / 2);
        y.set(e.clientY - SIZE / 2);
        opacity.set(1);
      });

      const el = e.target;
      setActive(
        !!(el instanceof Element) &&
          !!el.closest('a, button, input, textarea, select, [role="button"]')
      );
    };

    const onLeave = () => opacity.set(0);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [prefersReducedMotion, x, y, opacity]);

  if (!enabled) return null;

  return createPortal(
    <motion.div
      aria-hidden="true"
      // Border colour is a class, not a framer-motion animation: the tokens are
      // rgb(var(--token) / a) strings, which framer-motion cannot interpolate
      // ("not an animatable color"). CSS transitions handle var() fine.
      className={`cursor-ring${active ? " is-active" : ""}`}
      style={{ x: springX, y: springY, opacity, width: SIZE, height: SIZE }}
      animate={{ scale: active ? 1.55 : 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    />,
    document.body
  );
};

export default CursorRing;
