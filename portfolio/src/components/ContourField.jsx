import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { contours } from "d3-contour";
import { geoPath } from "d3-geo";
import { interpolateViridis } from "d3-scale-chromatic";
import { createNoise3D } from "simplex-noise";
import { useReducedMotion } from "framer-motion";

// Coarse field, rendered at full canvas size. Marching squares is O(cells), so
// the grid is the cost knob; geoPath scales the polygons back up for free.
const COLS = 132;
const ROWS = 78;
const BANDS = 11;

// Slow enough that recomputing at 24fps is indistinguishable from 60.
const FRAME_MS = 1000 / 24;
const TIME_SCALE = 0.000055;
const SPACE_SCALE = 0.021;

/**
 * Animated contour field: marching squares over a morphing 3-octave noise
 * field, banded in viridis.
 *
 * This is what a matplotlib.contour call looks like, in the colormap the
 * design system already declares, so it reads as the subject's own vernacular
 * rather than as decoration.
 *
 * Everything expensive is gated. See the canvas contract in CLAUDE.md: an
 * ungated rAF loop rendering off-screen was the single worst perf bug in this
 * repo's history.
 */
const ContourField = ({ className = "", opacity = 0.5 }) => {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const noise3D = createNoise3D();
    const field = new Float32Array(COLS * ROWS);
    const contour = contours().size([COLS, ROWS]);

    let raf = 0;
    let onScreen = false;
    let lastCompute = 0;
    let cssW = 0;
    let cssH = 0;
    // Canvas cannot read CSS custom properties, so the palette is snapshotted
    // from the computed body style and refreshed on theme change. Skipping this
    // is the most likely way to leave dark-mode colours showing in light mode.
    let strokeAlpha = 0.55;
    let fillAlpha = 0.05;

    const readTheme = () => {
      const isDark = document.body.classList.contains("dark-mode");
      // Light mode needs less ink: viridis is a dark-biased ramp, so the same
      // alphas that read as "faint" on #131024 read as "muddy" on #FAFAF8.
      strokeAlpha = isDark ? 0.55 : 0.42;
      fillAlpha = isDark ? 0.05 : 0.035;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    };

    const draw = (t) => {
      if (!cssW && !resize()) return;

      // 3-octave fBm. The third axis is time, which is what makes the isolines
      // reorganise instead of just translating.
      for (let y = 0; y < ROWS; y += 1) {
        for (let x = 0; x < COLS; x += 1) {
          const nx = x * SPACE_SCALE;
          const ny = y * SPACE_SCALE;
          const nt = t * TIME_SCALE;
          field[y * COLS + x] =
            noise3D(nx, ny, nt) +
            0.5 * noise3D(nx * 2.1, ny * 2.1, nt * 1.4) +
            0.25 * noise3D(nx * 4.3, ny * 4.3, nt * 1.9);
        }
      }

      const polygons = contour.thresholds(BANDS)(field);

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.save();
      // The field is COLS x ROWS; scale its coordinate space to the canvas.
      ctx.scale(cssW / (COLS - 1), cssH / (ROWS - 1));
      const path = geoPath(null, ctx);
      // Line width is in the scaled space, so undo the scale to keep hairlines
      // hairline-thin regardless of viewport.
      ctx.lineWidth = (COLS - 1) / cssW;

      polygons.forEach((polygon, i) => {
        const shade = interpolateViridis(i / (polygons.length - 1 || 1));
        ctx.beginPath();
        path(polygon);
        if (i % 2 === 0) {
          ctx.globalAlpha = fillAlpha;
          ctx.fillStyle = shade;
          ctx.fill();
        }
        ctx.globalAlpha = strokeAlpha;
        ctx.strokeStyle = shade;
        ctx.stroke();
      });

      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      if (now - lastCompute >= FRAME_MS) {
        lastCompute = now;
        draw(now);
      }
      raf = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    };

    const start = () => {
      if (raf || !onScreen || document.hidden) return;
      raf = window.requestAnimationFrame(loop);
    };

    readTheme();
    resize();

    if (prefersReducedMotion) {
      // Reduced does not mean none: render one frame and stop. A still contour
      // field is a perfectly good image, so the fallback is not a blank box.
      draw(0);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (prefersReducedMotion) return;
        if (onScreen) start();
        else stop();
      },
      { rootMargin: "120px 0px" }
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!prefersReducedMotion) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      if (resize() && (prefersReducedMotion || !raf)) draw(performance.now());
    });
    ro.observe(canvas);

    // Theme lives as a body class, so watch that rather than polling.
    const mo = new MutationObserver(() => {
      readTheme();
      if (prefersReducedMotion || !raf) draw(performance.now());
    });
    mo.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
};

ContourField.propTypes = {
  className: PropTypes.string,
  opacity: PropTypes.number,
};

export default ContourField;
