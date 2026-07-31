import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import CommitScatter from "./CommitScatter";
import { projectCount } from "../constants/projects";

const fmt = new Intl.NumberFormat("en-US");

const Hero = () => {
  const [stats, setStats] = useState(null);
  // Stable identity so CommitScatter's effect doesn't re-run on every render.
  const handleStats = useCallback((next) => setStats(next), []);

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-center">
      <div className={`${styles.paddingX} mx-auto w-full max-w-7xl pt-32 pb-14`}>
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

          <h1 className={`${styles.heroHeadText} mt-6`}>
            Anirudh
            <br />
            Annabathula
          </h1>

          <p className={`${styles.heroSubText} mt-7 max-w-xl`}>
            Senior at UC San Diego majoring in{" "}
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
              href="#contact"
              className="rounded-panel border border-line/25 px-5 py-2.5 font-mono text-[12px] font-medium uppercase tracking-readout text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Get in touch
            </a>
          </div>
        </motion.div>
      </div>

      {/* The plot is the hero's thesis: real measurements, of this page. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className={`${styles.paddingX} mx-auto w-full max-w-7xl`}
      >
        <div className="flex items-center gap-4 pb-2">
          <span className="readout">Commits to this site</span>
          <span className="panel-rule" aria-hidden="true" />
        </div>

        <CommitScatter onStats={handleStats} />

        <dl className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-line/10 pt-4">
          {[
            ["Commits", stats ? fmt.format(stats.commits) : "—"],
            ["Lines changed", stats ? fmt.format(stats.churn) : "—"],
            [
              "Last push",
              stats?.lastCommit
                ? stats.lastCommit.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—",
            ],
            ["Projects", fmt.format(projectCount)],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline gap-2">
              <dt className="readout">{label}</dt>
              <dd className="readout-num text-[13px] font-medium text-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
};

export default Hero;
