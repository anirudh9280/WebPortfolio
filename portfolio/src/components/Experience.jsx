import PropTypes from "prop-types";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

import SectionHeader from "./SectionHeader";
import { SectionWrapper } from "../hoc";
import { experiences } from "../constants";

const currentCount = experiences.filter((e) => e.current).length;

const ExperienceCard = ({ experience }) => (
  <VerticalTimelineElement
    // Surfaces and arrows are driven by tokens in index.css so this stays
    // correct in both themes without a JS branch.
    contentStyle={{ background: "rgb(var(--surface))" }}
    contentArrowStyle={{ borderRight: "7px solid rgb(var(--grid) / 0.14)" }}
    date={`${experience.date}  ·  ${experience.location}`}
    iconStyle={{ background: "rgb(var(--surface-2))" }}
    icon={
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={experience.icon}
          alt=""
          loading="lazy"
          className="h-[62%] w-[62%] rounded-[3px] object-contain"
        />
      </div>
    }
  >
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <h3 className="font-display text-[19px] font-bold leading-tight text-ink">
        {experience.title}
      </h3>
      {experience.current ? (
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-readout text-signal">
          <span className="h-1 w-1 rounded-full bg-signal" />
          Current
        </span>
      ) : null}
    </div>

    {experience.website ? (
      <a
        href={experience.website}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-block font-mono text-[12px] uppercase tracking-readout text-accent transition-opacity hover:opacity-75"
      >
        {experience.company_name} ↗
      </a>
    ) : (
      <p className="mt-1 font-mono text-[12px] uppercase tracking-readout text-muted">
        {experience.company_name}
      </p>
    )}

    <ul className="ml-4 mt-4 list-disc space-y-2.5">
      {experience.points.map((point, i) => (
        <li
          key={`${experience.company_name}-point-${i}`}
          className="pl-1 text-[14px] leading-[1.65] text-muted"
        >
          {point}
        </li>
      ))}
    </ul>

    {experience.links?.length ? (
      <div className="mt-4 flex flex-wrap gap-2">
        {experience.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-chip border border-line/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-readout text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    ) : null}
  </VerticalTimelineElement>
);

ExperienceCard.propTypes = {
  experience: PropTypes.shape({
    title: PropTypes.string.isRequired,
    company_name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string,
    current: PropTypes.bool,
    website: PropTypes.string,
    points: PropTypes.arrayOf(PropTypes.string).isRequired,
    links: PropTypes.arrayOf(
      PropTypes.shape({ label: PropTypes.string, href: PropTypes.string })
    ),
  }).isRequired,
};

const Experience = () => (
  <>
    <SectionHeader
      label="Experience"
      title="Where I've worked."
      readout={`${experiences.length} roles · ${currentCount} current`}
    />

    <div className="mt-12">
      {/* animate={false}: the library runs its own visibility-sensor bounce-in
          on top of SectionWrapper's framer-motion entrance. The two fight, and
          left-side cards end up stuck part-way through at reduced opacity. */}
      <VerticalTimeline lineColor="rgb(var(--grid) / 0.14)" animate={false}>
        {experiences.map((experience) => (
          <ExperienceCard
            key={`${experience.company_name}-${experience.date}`}
            experience={experience}
          />
        ))}
      </VerticalTimeline>
    </div>
  </>
);

export default SectionWrapper(Experience, "work");
