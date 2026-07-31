import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";
import SplitWords from "./SplitWords";
import { useCountUp } from "../hooks/useCountUp";

/**
 * The panel header used by every section:
 *
 *   ABOUT ─────────────────────────  20 COURSES
 *   Overview.
 *
 * The right-hand readout is always a real, checkable number. It is the
 * smallest unit of the "instrumented" idea and the reason every section
 * carries one.
 *
 * Pass `count` to have the leading number count up on entry. `readout` is then
 * the template with `{n}` standing in for it, e.g. "{n} roles · 3 current".
 * Passing a plain `readout` with no `count` renders it verbatim.
 */
const CountingReadout = ({ count, template }) => {
  const [ref, shown] = useCountUp(count);
  return (
    <span
      ref={ref}
      className="readout readout-num shrink-0 normal-case tabular-nums tracking-[0.1em]"
    >
      {template.replace("{n}", String(shown))}
    </span>
  );
};

CountingReadout.propTypes = {
  count: PropTypes.number.isRequired,
  template: PropTypes.string.isRequired,
};

const SectionHeader = ({ label, title, readout, count }) => (
  <motion.div variants={textVariant()}>
    <div className="flex items-center gap-4">
      <span className={styles.sectionSubText}>{label}</span>
      <span className="panel-rule" aria-hidden="true" />
      {readout && Number.isFinite(count) ? (
        <CountingReadout count={count} template={readout} />
      ) : readout ? (
        <span className="readout readout-num shrink-0 normal-case tabular-nums tracking-[0.1em]">
          {readout}
        </span>
      ) : null}
    </div>
    <h2 className={`${styles.sectionHeadText} mt-4`}>
      <SplitWords text={title} />
    </h2>
  </motion.div>
);

SectionHeader.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  readout: PropTypes.string,
  count: PropTypes.number,
};

export default SectionHeader;
