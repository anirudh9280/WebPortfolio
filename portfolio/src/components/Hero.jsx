import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import * as d3 from "d3";

import { styles } from "../styles";
import ContourField from "./ContourField";
import SplitWords from "./SplitWords";
import { useCountUp } from "../hooks/useCountUp";
import { projectCount } from "../constants/projects";
import { GITHUB_URL, LINKEDIN_URL, RESUME_URL } from "../constants/links";

const fmt = new Intl.NumberFormat("en-US");

const Stat = ({ label, value, format = fmt.format }) => {
  const [ref, shown] = useCountUp(value);
  return (
    <div ref={ref} className="flex items-baseline gap-2">
      <dt className="readout">{label}</dt>
      <dd className="readout-num text-[13px] font-medium tabular-nums text-ink">
        {Number.isFinite(value) ? format(shown) : "···"}
      </dd>
    </div>
  );
};

Stat.propTypes = {
  label: PropTypes.string.isRequired,
  /** NaN while the CSV is still loading, which renders the placeholder. */
  value: PropTypes.number,
  format: PropTypes.func,
};

const Hero = () => {
  const [stats, setStats] = useState(null);

  // Same commits.csv the analytics page reads, generated from the git log by
  // `npm run meta`, so the figures here can't drift from reality.
  useEffect(() => {
    let cancelled = false;
    d3.csv("/meta/commits.csv", (row) => ({
      datetime: new Date(row.datetime),
      churn: (Number(row.insertions) || 0) + (Number(row.deletions) || 0),
    }))
      .then((rows) => {
        if (cancelled || !rows?.length) return;
        const clean = rows
          .filter((r) => !Number.isNaN(+r.datetime))
          .sort((a, b) => a.datetime - b.datetime);
        setStats({
          commits: clean.length,
          churn: d3.sum(clean, (r) => r.churn),
          lastCommit: clean.at(-1)?.datetime ?? null,
        });
      })
      // The readout is enhancement, not content. A missing CSV leaves the hero
      // text intact rather than blanking anything.
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden">
      {/* Ambient layer. Sits behind everything and is aria-hidden. */}
      <ContourField
        className="pointer-events-none absolute inset-0 h-full w-full"
        opacity={0.55}
      />

      <div
        className={`${styles.paddingX} relative z-10 mx-auto w-full max-w-7xl pb-16 pt-28`}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-signal animate-signal-pulse" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
            </span>
            <span className="readout">Open to 2027 new-grad roles</span>
          </div>
        </motion.div>

        <h1 className={`${styles.heroHeadText} mt-6`}>
          <SplitWords text="Anirudh" delay={0.15} />
          <br />
          <SplitWords text="Annabathula" delay={0.28} />
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={`${styles.heroSubText} mt-7 max-w-xl`}>
            Undergraduate senior at UC San Diego majoring in{" "}
            <span className="font-medium text-ink">Data Science</span>, with
            minors in <span className="font-medium text-ink">Mathematics</span>{" "}
            and <span className="font-medium text-ink">Cognitive Science</span>.
            I build data pipelines that move at scale and vision models that
            read what they move.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="rounded-panel bg-accent px-5 py-2.5 font-mono text-[12px] font-medium uppercase tracking-readout text-on-accent transition-opacity hover:opacity-90"
            >
              Selected work
            </a>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-panel border border-line/25 bg-ground/40 px-5 py-2.5 font-mono text-[12px] font-medium uppercase tracking-readout text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Résumé ↗
            </a>
            <a
              href="#contact"
              className="rounded-panel border border-line/25 bg-ground/40 px-5 py-2.5 font-mono text-[12px] font-medium uppercase tracking-readout text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Get in touch
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            {[
              ["GitHub", GITHUB_URL],
              ["LinkedIn", LINKEDIN_URL],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] uppercase tracking-readout text-muted transition-colors hover:text-accent"
              >
                {label} ↗
              </a>
            ))}
          </div>

          {/* Real, checkable figures. The plot they used to accompany now lives
              in full on /analytics, where it has room to be useful. */}
          <dl className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-line/10 pt-5">
            <Stat label="Commits" value={stats?.commits ?? NaN} />
            <Stat label="Lines changed" value={stats?.churn ?? NaN} />
            <Stat label="Projects" value={projectCount} />
            <div className="flex items-baseline gap-2">
              <dt className="readout">Last push</dt>
              <dd className="readout-num text-[13px] font-medium tabular-nums text-ink">
                {stats?.lastCommit
                  ? stats.lastCommit.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "···"}
              </dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
