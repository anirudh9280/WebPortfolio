import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { useMotionPref } from "../context/MotionContext";

import SectionHeader from "./SectionHeader";
import { SectionWrapper } from "../hoc";
import { useTheme } from "../context/ThemeContext";
import { skills, skillCount, SKILL_CATEGORIES } from "../constants/skills";

// Seconds of travel per chip. Constant across rows so every row moves at the
// same px/s regardless of how many skills it holds.
const SECONDS_PER_ITEM = 2.6;

const rows = SKILL_CATEGORIES.map((category, i) => ({
  category,
  items: skills.filter((s) => s.category === category),
  direction: i % 2 === 0 ? "left" : "right",
}));

/**
 * How many times a category must repeat inside one group so the group is at
 * least as wide as the visible band.
 *
 * Measured rather than guessed: a fixed item count gets this wrong because chip
 * widths vary a lot ("R" vs "Weights & Biases"), and it can't account for the
 * viewport, the breakpoint gap change, or webfonts landing after first paint.
 * Categories here run 7-11 items, so a hardcoded floor of 10 left the Languages
 * row at 1234px against a 1280px band -- a 46px gap scrolling past once a cycle.
 *
 * Two identical groups is what keeps the translateX(-50%) loop exact, so the
 * repetition happens inside each group rather than by adding more groups.
 */
const useGroupCopies = (itemCount) => {
  const viewportRef = useRef(null);
  const groupRef = useRef(null);
  const [copies, setCopies] = useState(1);

  useLayoutEffect(() => {
    const measure = () => {
      const band = viewportRef.current?.offsetWidth ?? 0;
      const groupW = groupRef.current?.offsetWidth ?? 0;
      if (!band || !groupW) return;
      const oneRep = groupW / copies;
      if (oneRep <= 0) return;
      // +8px guards against subpixel rounding leaving a hairline gap.
      const needed = Math.max(1, Math.ceil((band + 8) / oneRep));
      if (needed !== copies) setCopies(needed);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (groupRef.current) ro.observe(groupRef.current);
    return () => ro.disconnect();
  }, [copies, itemCount]);

  // Webfonts land after first paint and change chip widths, so re-measure.
  useEffect(() => {
    if (!document.fonts?.ready) return;
    document.fonts.ready.then(() => setCopies((c) => c));
  }, []);

  return { viewportRef, groupRef, copies };
};

const SkillChip = ({ skill, darkMode }) => {
  const Icon = skill.icon;
  // Several brand hexes are invisible on one background or the other.
  const brand = (darkMode && skill.colorDark) || skill.color;

  return (
    <li className="skill-chip flex shrink-0 items-center gap-2.5 rounded-panel border border-line/12 bg-surface px-4 py-2.5">
      {/* react-icons sizes to 1em and fills with currentColor, so font-size
          drives the glyph and `color` drives the tint. */}
      <span
        className="text-[19px] leading-none"
        style={{ color: brand }}
        aria-hidden="true"
      >
        <Icon />
      </span>
      <span className="whitespace-nowrap font-mono text-[12px] tracking-[0.06em] text-ink/90">
        {skill.name}
      </span>
    </li>
  );
};

SkillChip.propTypes = {
  skill: PropTypes.object.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

/**
 * One copy of a row.
 *
 * gap-x-N and pr-N MUST stay numerically equal at every breakpoint. That makes
 * each group exactly (sum of chips + n * gap) wide, so the two-group track is
 * exactly 2x one group and translateX(-50%) lands pixel-perfect. Putting the
 * gap on the track instead leaves the loop short by gap/2 and stutters visibly
 * once per cycle.
 */
const MarqueeGroup = forwardRef(function MarqueeGroup(
  { items, copies, darkMode, category, clone },
  ref
) {
  return (
    <ul
      ref={ref}
      className="flex shrink-0 items-center gap-x-3 pr-3 sm:gap-x-4 sm:pr-4"
      // Only the first copy is announced. The clone, and any repetition needed
      // to fill the band, are decorative -- hence the index in the key.
      aria-hidden={clone || undefined}
      aria-label={clone ? undefined : category}
    >
      {Array.from({ length: copies }, () => items)
        .flat()
        .map((skill, i) => (
          <SkillChip
            key={`${skill.name}-${i}`}
            skill={skill}
            darkMode={darkMode}
          />
        ))}
    </ul>
  );
});

MarqueeGroup.propTypes = {
  items: PropTypes.array.isRequired,
  copies: PropTypes.number.isRequired,
  darkMode: PropTypes.bool.isRequired,
  category: PropTypes.string.isRequired,
  clone: PropTypes.bool,
};

const MarqueeRow = ({ row, darkMode }) => {
  const { viewportRef, groupRef, copies } = useGroupCopies(row.items.length);

  return (
    <div>
      {/* Label sits inside the padded container; the band is full-bleed. */}
      <div className="flex items-center gap-4 px-6 pb-2 sm:px-16">
        <span className="readout">{row.category}</span>
        <span className="panel-rule" aria-hidden="true" />
        <span className="readout readout-num shrink-0 normal-case tracking-[0.1em]">
          {row.items.length}
        </span>
      </div>

      <div
        ref={viewportRef}
        className="marquee-viewport relative overflow-hidden py-1"
      >
        <div
          // w-max is load-bearing: without width:max-content the track is 100%
          // of its parent and -50% becomes half the VIEWPORT, not the content.
          className={`marquee-track flex w-max ${
            row.direction === "left"
              ? "animate-marquee-left"
              : "animate-marquee-right"
          }`}
          style={{
            // Scales with the filled length so px/s stays constant across rows.
            "--marquee-duration": `${(row.items.length * copies * SECONDS_PER_ITEM).toFixed(1)}s`,
          }}
        >
          <MarqueeGroup
            ref={groupRef}
            items={row.items}
            copies={copies}
            darkMode={darkMode}
            category={row.category}
          />
          <MarqueeGroup
            items={row.items}
            copies={copies}
            darkMode={darkMode}
            category={row.category}
            clone
          />
        </div>
      </div>
    </div>
  );
};

MarqueeRow.propTypes = {
  row: PropTypes.object.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

/** Motion-off form: the same category grouping, standing still and complete. */
const StaticSkillList = ({ darkMode }) => (
  <div className="mt-10 space-y-8">
    {rows.map((row) => (
      <div key={row.category}>
        <div className="flex items-center gap-4">
          <span className="readout">{row.category}</span>
          <span className="panel-rule" aria-hidden="true" />
          <span className="readout readout-num shrink-0 normal-case tracking-[0.1em]">
            {row.items.length}
          </span>
        </div>
        <ul className="mt-3 flex flex-wrap gap-3">
          {row.items.map((skill) => (
            <SkillChip key={skill.name} skill={skill} darkMode={darkMode} />
          ))}
        </ul>
      </div>
    ))}
  </div>
);

StaticSkillList.propTypes = { darkMode: PropTypes.bool.isRequired };

const SkillsMarquee = () => {
  const { darkMode } = useTheme();
  const { motionOn, prefersReducedMotion: prefersReduced } = useMotionPref();
  // Animating is the default for everyone, by explicit product decision: the
  // rows are the point of the section and shouldn't need a click to appear.
  // Reduced-motion visitors therefore see movement until they hit Pause, which
  // is the tradeoff being accepted. Everything else on the site still honours
  // the OS setting; this is the one deliberate exception.
  // null = follow the site-wide Motion switch in the navbar. A click here sets
  // an explicit local override, so this button can still pause just the rows
  // without also turning off the hero canvas and the cursor ring.
  const [override, setOverride] = useState(null);
  const animating = override ?? motionOn;

  return (
    <>
      <SectionHeader
        label="Skills"
        title="What I work with."
        readout={`{n} tracked · ${SKILL_CATEGORIES.length} groups`}
        count={skillCount}
      />

      {animating ? (
        // Negative margins cancel SectionWrapper's px so the bands span the
        // full content box. Deliberately not 100vw -- that includes the
        // scrollbar and causes horizontal overflow on desktop.
        <div className="-mx-6 mt-10 flex flex-col gap-6 sm:-mx-16">
          {rows.map((row) => (
            <MarqueeRow key={row.category} row={row} darkMode={darkMode} />
          ))}
        </div>
      ) : (
        <StaticSkillList darkMode={darkMode} />
      )}

      {/* WCAG 2.2.2: auto-moving content needs an explicit control, and
          hover-pause alone excludes keyboard and touch users. Works both ways,
          so reduced-motion visitors can opt in rather than being locked out. */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setOverride(!animating)}
          aria-pressed={animating}
          className="rounded-chip border border-line/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-readout text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {animating ? "Pause animation" : "Animate skills"}
        </button>
        {animating && prefersReduced ? (
          <p className="text-center font-mono text-[10px] text-muted/70">
            Your system asks for reduced motion. Pause to stop the rows.
          </p>
        ) : null}
      </div>
    </>
  );
};

export default SectionWrapper(SkillsMarquee, "skills");
