import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";

/**
 * The panel header used by every section:
 *
 *   ABOUT ———————————————————————————————  20 COURSES
 *   Overview.
 *
 * The right-hand readout is always a real, checkable number. It is the
 * smallest unit of the "instrumented" idea and the reason every section
 * carries one.
 */
const SectionHeader = ({ label, title, readout }) => (
  <motion.div variants={textVariant()}>
    <div className="flex items-center gap-4">
      <span className={styles.sectionSubText}>{label}</span>
      <span className="panel-rule" aria-hidden="true" />
      {readout ? (
        <span className="readout readout-num shrink-0 normal-case tracking-[0.1em]">
          {readout}
        </span>
      ) : null}
    </div>
    <h2 className={`${styles.sectionHeadText} mt-4`}>{title}</h2>
  </motion.div>
);

SectionHeader.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  readout: PropTypes.string,
};

export default SectionHeader;
