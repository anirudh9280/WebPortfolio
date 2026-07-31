import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

import SectionHeader from "./SectionHeader";
import { SectionWrapper } from "../hoc";
import { fadeIn } from "../utils/motion";
import { projects, projectCount } from "../constants/projects";

/**
 * Live GitHub profile stats. Independent of the projects array -- it reads the
 * public API, which is unauthenticated and rate-limited per IP, so a failure
 * renders nothing rather than an error state.
 */
const GitHubStats = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.github.com/users/anirudh9280", {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) =>
        setData({
          repos: json.public_repos,
          followers: json.followers,
          following: json.following,
        })
      )
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (!data) return null;

  return (
    <dl className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {[
        ["Repos", data.repos],
        ["Followers", data.followers],
        ["Following", data.following],
      ].map(([label, value]) => (
        <div key={label} className="flex items-baseline gap-2">
          <dt className="readout">{label}</dt>
          <dd className="readout-num text-[13px] font-medium text-ink">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

const ProjectCard = ({ project, index }) => (
  <motion.article
    variants={fadeIn("up", "tween", 0.06 * (index % 3), 0.6)}
    className="project-card flex flex-col overflow-hidden rounded-panel border border-line/12 bg-surface"
  >
    <div className="project-card__cover overflow-hidden border-b border-line/10 bg-surface-2">
      <img
        src={project.image}
        alt=""
        loading="lazy"
        width={640}
        height={400}
        className="aspect-[16/10] w-full object-cover"
      />
    </div>

    <div className="flex flex-1 flex-col p-5">
      <h3 className="font-display text-[20px] font-bold leading-tight text-ink">
        {project.name}
      </h3>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-readout text-accent">
        {project.blurb}
      </p>

      <p className="mt-3 flex-1 text-[14px] leading-[1.65] text-muted">
        {project.description}
      </p>

      {/* One real, checkable number per project. */}
      <p className="readout-num mt-4 border-t border-line/10 pt-3 text-[11px] text-muted">
        {project.metric}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-chip border border-line/12 bg-surface-2 px-2 py-1 font-mono text-[10px] tracking-[0.06em] text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>

      {/* Real anchors, not div+window.open: keyboard focus, middle-click and
          "copy link address" all work. */}
      <div className="mt-5 flex items-center gap-4 border-t border-line/10 pt-4">
        <a
          href={project.source_code_link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] uppercase tracking-readout text-muted transition-colors hover:text-accent"
        >
          Source ↗
        </a>
        {project.deploy_code_link ? (
          <a
            href={project.deploy_code_link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-readout text-muted transition-colors hover:text-accent"
          >
            Live ↗
          </a>
        ) : null}
      </div>
    </div>
  </motion.article>
);

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

const Works = () => (
  <>
    <SectionHeader
      label="Projects"
      title="Selected work."
      readout={`${projectCount} shipped`}
    />

    <div className="mt-6">
      <GitHubStats />
    </div>

    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard key={project.name} project={project} index={index} />
      ))}
    </div>
  </>
);

export default SectionWrapper(Works, "projects");
