import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

// Viridis stops. Commits are coloured by time of day, so the ramp encodes
// something real rather than decorating the plot.
const VIRIDIS = ["#440154", "#3B528B", "#21918C", "#5EC962", "#FDE725"];

const PLOT_H = 300;
const MARGIN = { top: 16, right: 12, bottom: 26, left: 34 };

/**
 * The hero plot: every commit to this repo, placed by date and time of day.
 *
 * This is the thesis of the design -- the most characteristic thing in the
 * subject's world is a plot of real measurements, and the measurements are of
 * the page you are looking at. It reads the same public/meta/loc.csv the
 * /analytics page uses, so the numbers cannot drift apart.
 *
 * Decorative at the SVG level (aria-hidden); the same figures are exposed as
 * text in the hero readout, which is what screen readers get.
 */
const CommitScatter = ({ onStats }) => {
  const hostRef = useRef(null);
  const [commits, setCommits] = useState([]);
  const [width, setWidth] = useState(720);

  useEffect(() => {
    let cancelled = false;

    d3.csv("/meta/loc.csv", (row) => ({
      commit: row.commit,
      datetime: new Date(row.datetime),
      type: row.type,
      file: row.file,
    }))
      .then((rows) => {
        if (cancelled || !rows?.length) return;

        const grouped = d3
          .groups(rows, (d) => d.commit)
          .map(([id, lines]) => ({
            id,
            datetime: lines[0].datetime,
            hourFrac:
              lines[0].datetime.getHours() + lines[0].datetime.getMinutes() / 60,
            totalLines: lines.length,
          }))
          .filter((c) => !Number.isNaN(+c.datetime))
          .sort((a, b) => a.datetime - b.datetime);

        setCommits(grouped);
        onStats?.({
          commits: grouped.length,
          lines: rows.length,
          files: new Set(rows.map((r) => r.file)).size,
          lastCommit: grouped.length
            ? grouped[grouped.length - 1].datetime
            : null,
        });
      })
      // The plot is enhancement, not content. A missing CSV leaves the hero
      // text intact rather than blanking the page.
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [onStats]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.max(280, entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { points, xTicks, yTicks } = useMemo(() => {
    if (!commits.length) return { points: [], xTicks: [], yTicks: [] };

    const innerW = width - MARGIN.left - MARGIN.right;
    const innerH = PLOT_H - MARGIN.top - MARGIN.bottom;

    const x = d3
      .scaleTime()
      .domain(d3.extent(commits, (d) => d.datetime))
      .range([0, innerW])
      .nice();
    const y = d3.scaleLinear().domain([24, 0]).range([innerH, 0]);
    const r = d3
      .scaleSqrt()
      .domain(d3.extent(commits, (d) => d.totalLines))
      .range([3, 15]);
    const color = d3
      .scaleQuantize()
      .domain([0, 24])
      .range(VIRIDIS);

    return {
      points: commits.map((c) => ({
        key: c.id,
        cx: x(c.datetime),
        cy: y(c.hourFrac),
        r: r(c.totalLines),
        fill: color(c.hourFrac),
      })),
      xTicks: x.ticks(Math.max(2, Math.floor(innerW / 130))).map((t) => ({
        key: +t,
        x: x(t),
        label: d3.timeFormat("%b %Y")(t).toUpperCase(),
      })),
      yTicks: [0, 6, 12, 18, 24].map((h) => ({
        key: h,
        y: y(h),
        label: `${String(h).padStart(2, "0")}:00`,
      })),
    };
  }, [commits, width]);

  return (
    <div ref={hostRef} className="w-full">
      <svg
        width="100%"
        height={PLOT_H}
        viewBox={`0 0 ${width} ${PLOT_H}`}
        role="presentation"
        aria-hidden="true"
        className="overflow-visible"
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {yTicks.map((t) => (
            <g key={t.key}>
              <line
                x1={0}
                x2={width - MARGIN.left - MARGIN.right}
                y1={t.y}
                y2={t.y}
                stroke="rgb(var(--grid))"
                strokeOpacity={0.1}
              />
              <text
                x={-10}
                y={t.y}
                dy="0.32em"
                textAnchor="end"
                className="fill-muted"
                style={{
                  fontFamily: "IBM Plex Mono, ui-monospace, monospace",
                  fontSize: 9,
                  letterSpacing: "0.08em",
                }}
              >
                {t.label}
              </text>
            </g>
          ))}

          {xTicks.map((t) => (
            <text
              key={t.key}
              x={t.x}
              y={PLOT_H - MARGIN.top - MARGIN.bottom + 18}
              textAnchor="middle"
              className="fill-muted"
              style={{
                fontFamily: "IBM Plex Mono, ui-monospace, monospace",
                fontSize: 9,
                letterSpacing: "0.12em",
              }}
            >
              {t.label}
            </text>
          ))}

          {points.map((p) => (
            <circle
              key={p.key}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={p.fill}
              fillOpacity={0.62}
              stroke={p.fill}
              strokeOpacity={0.9}
              strokeWidth={1}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

CommitScatter.propTypes = {
  /** Called once with { commits, lines, files, lastCommit } after the CSV loads. */
  onStats: PropTypes.func,
};

export default CommitScatter;
