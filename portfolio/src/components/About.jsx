import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { SectionWrapper } from "../hoc";
import { fadeIn } from "../utils/motion";
import { focusAreas } from "../constants";
import { coursework, courseCount } from "../constants/coursework";

const About = () => (
  <>
    <SectionHeader
      label="About"
      title="Overview."
      readout="{n} courses"
      count={courseCount}
    />

    <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
      <motion.div variants={fadeIn("", "", 0.1, 0.8)}>
        <p className="max-w-2xl text-[17px] leading-[1.75] text-muted">
          I work at the seam between data engineering and machine learning. At
          the{" "}
          <span className="font-medium text-ink">Salk Institute</span> I train
          and evaluate U-Net keypoint-estimation models in PyTorch, and I care a
          lot about whether the metric reporting the result is actually
          calibrated. At{" "}
          <span className="font-medium text-ink">Narvar</span> and{" "}
          <span className="font-medium text-ink">EVgo</span> I built the
          pipelines underneath the analysis (Airflow into BigQuery, Snowflake
          into S3), plus the semantic layers that let other people answer their
          own questions.
        </p>
        <p className="mt-5 max-w-2xl text-[17px] leading-[1.75] text-muted">
          The thread through all of it is instrumentation: shipping systems that
          report honestly on how well they work. This site is built the same
          way, and{" "}
          <a
            href="/analytics"
            className="text-accent underline decoration-accent/35 underline-offset-4 transition-colors hover:decoration-accent"
          >
            the analytics page
          </a>{" "}
          takes that apart properly.
        </p>

        <ul className="mt-8 flex flex-wrap gap-2">
          {focusAreas.map((area) => (
            <li
              key={area}
              className="rounded-chip border border-line/15 bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-readout text-muted"
            >
              {area}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Coursework as a dept-grouped table. Was a single run-on paragraph. */}
      <motion.div variants={fadeIn("left", "tween", 0.2, 0.8)}>
        <div className="flex items-center gap-4">
          <span className="readout">Relevant coursework</span>
          <span className="panel-rule" aria-hidden="true" />
        </div>

        <div className="mt-5 space-y-6">
          {coursework.map((group) => (
            <div key={group.dept}>
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-[12px] font-medium tracking-readout text-accent">
                  {group.dept}
                </span>
                <span className="text-[12px] text-muted/70">{group.label}</span>
              </div>
              <ul className="mt-2 divide-y divide-line/[0.08]">
                {group.courses.map((course) => (
                  <li
                    key={course.code}
                    className="flex items-baseline gap-3 py-1.5"
                  >
                    <span className="readout-num w-[52px] shrink-0 text-[12px] text-muted">
                      {course.code}
                    </span>
                    <span className="text-[14px] leading-snug text-ink/85">
                      {course.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </>
);

export default SectionWrapper(About, "about");
