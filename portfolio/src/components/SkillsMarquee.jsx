import { useState } from "react";
import PropTypes from "prop-types";
import { useReducedMotion } from "framer-motion";

import SectionHeader from "./SectionHeader";
import { SectionWrapper } from "../hoc";
import { useTheme } from "../context/ThemeContext";
import { skills, skillCount, SKILL_CATEGORIES } from "../constants/skills";

// Seconds of travel per chip, so px/s stays constant as the list grows.
const SECONDS_PER_ITEM = 2.6;

// Deal alternately. The source array is category-ordered, so index parity
// gives each row a mix rather than "row one is every language".
const rowA = skills.filter((_, i) => i % 2 === 0);
const rowB = skills.filter((_, i) => i % 2 === 1);

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
const MarqueeGroup = ({ items, darkMode, clone }) => (
  <ul
    className="flex shrink-0 items-center gap-x-3 pr-3 sm:gap-x-4 sm:pr-4"
    aria-hidden={clone || undefined}
  >
    {items.map((skill) => (
      <SkillChip key={skill.name} skill={skill} darkMode={darkMode} />
    ))}
  </ul>
);

MarqueeGroup.propTypes = {
  items: PropTypes.array.isRequired,
  darkMode: PropTypes.bool.isRequired,
  clone: PropTypes.bool,
};

const MarqueeRow = ({ items, direction, darkMode, paused }) => (
  <div
    // w-max is load-bearing: without width:max-content the track is 100% of
    // its parent and -50% becomes half the VIEWPORT, not half the content.
    className={`marquee-track flex w-max ${
      direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
    } ${paused ? "is-paused" : ""}`}
    style={{
      "--marquee-duration": `${(items.length * SECONDS_PER_ITEM).toFixed(1)}s`,
    }}
  >
    <MarqueeGroup items={items} darkMode={darkMode} />
    <MarqueeGroup items={items} darkMode={darkMode} clone />
  </div>
);

MarqueeRow.propTypes = {
  items: PropTypes.array.isRequired,
  direction: PropTypes.oneOf(["left", "right"]).isRequired,
  darkMode: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
};

/** Reduced-motion fallback: static, and grouped by category. */
const StaticSkillList = ({ darkMode }) => (
  <div className="mt-10 space-y-8">
    {SKILL_CATEGORIES.map((category) => (
      <div key={category}>
        <div className="flex items-center gap-4">
          <span className="readout">{category}</span>
          <span className="panel-rule" aria-hidden="true" />
        </div>
        <ul className="mt-3 flex flex-wrap gap-3">
          {skills
            .filter((s) => s.category === category)
            .map((skill) => (
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
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  return (
    <>
      <SectionHeader
        label="Skills"
        title="What I work with."
        readout={`${skillCount} tracked`}
      />

      {reduceMotion ? (
        <StaticSkillList darkMode={darkMode} />
      ) : (
        <>
          {/* Negative margins cancel SectionWrapper's px so the band spans the
              full content box. Deliberately not 100vw -- that includes the
              scrollbar and causes horizontal overflow on desktop. */}
          <div className="-mx-6 mt-10 sm:-mx-16">
            <div className="marquee-viewport relative overflow-hidden py-1">
              <div className="flex flex-col gap-3 sm:gap-4">
                <MarqueeRow
                  items={rowA}
                  direction="left"
                  darkMode={darkMode}
                  paused={paused}
                />
                <MarqueeRow
                  items={rowB}
                  direction="right"
                  darkMode={darkMode}
                  paused={paused}
                />
              </div>
            </div>
          </div>

          {/* WCAG 2.2.2: auto-moving content needs an explicit control.
              Hover-pause alone excludes keyboard and touch users. */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              className="rounded-chip border border-line/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-readout text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {paused ? "Resume" : "Pause"} animation
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default SectionWrapper(SkillsMarquee, "skills");
