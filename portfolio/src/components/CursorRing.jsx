import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMotionPref } from "../context/MotionContext";

const SIZE = 26;

/**
 * A ring that trails the pointer.
 *
 * The native cursor stays visible on purpose. Hiding it with `cursor: none`
 * breaks the pointer-size and high-contrast settings people configure for
 * accessibility, and there is no CSS media query to detect that they did, so
 * there is no way to avoid harming them. This adds a layer instead of taking
 * one away.
 *
 * Tuning notes, because this is easy to get wrong and it feels broken when it
 * is. A spring's damping ratio is z = c / (2 * sqrt(k * m)). The first version
 * used damping 28 / stiffness 350 / mass 0.35, i.e. z = 1.27: overdamped, so it
 * crawls toward the pointer without overshooting and reads as input lag. These
 * values give z = 0.92, just under critical, so it arrives fast with a hint of
 * follow-through. Natural frequency is ~58 rad/s, settling in well under 100ms.
 *
 * Two more rules that matter:
 *  - Pointer position is never React state. pointermove fires up to ~500Hz on
 *    high-poll-rate mice against 60 usable frames. Motion values are plain
 *    setters that framer-motion coalesces into its own frame loop, so writing
 *    them directly on every event is correct and cheap.
 *  - Hover state comes from pointerover, NOT pointermove. The first version ran
 *    element.closest('a, button, ...') on every move event, walking the DOM
 *    hundreds of times a second for an answer that only changes when the
 *    element under the cursor changes.
 *
 * Portaled to document.body because `transform`, `opacity`, `filter` and
 * `will-change` all create stacking contexts, so any framer-motion wrapper
 * would otherwise confine a position:fixed child.
 */
const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"]';

const CursorRing = () => {
  const { motionOn } = useMotionPref();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const spring = { damping: 32, stiffness: 1000, mass: 0.3, restDelta: 0.5 };
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);
  // Starts hidden, or it flashes at the origin before the first pointermove.
  const opacity = useMotionValue(0);

  useEffect(() => {
    if (!motionOn) {
      setEnabled(false);
      return undefined;
    }
    // Coarse pointers (touch) have no cursor to trail.
    if (!window.matchMedia("(any-hover: hover) and (pointer: fine)").matches) {
      return undefined;
    }
    setEnabled(true);

    const onMove = (e) => {
      x.set(e.clientX - SIZE / 2);
      y.set(e.clientY - SIZE / 2);
      opacity.set(1);
    };

    // Fires only when the element under the pointer changes.
    const onOver = (e) => {
      const el = e.target;
      setActive(el instanceof Element && !!el.closest(INTERACTIVE));
    };

    const onLeave = () => opacity.set(0);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [motionOn, x, y, opacity]);

  if (!enabled) return null;

  return createPortal(
    <motion.div
      aria-hidden="true"
      // Border colour is a class, not a framer-motion animation: the tokens are
      // rgb(var(--token) / a) strings, which framer-motion cannot interpolate
      // ("not an animatable color"). CSS transitions handle var() fine.
      className={`cursor-ring${active ? " is-active" : ""}`}
      style={{ x: springX, y: springY, opacity, width: SIZE, height: SIZE }}
      animate={{ scale: active ? 1.6 : 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    />,
    document.body
  );
};

export default CursorRing;
