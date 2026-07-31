import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";

const SectionWrapper = (Component, idName, className = "") => {
  const HOC = () => (
    <motion.section
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      // Deliberately NO `amount`. It was 0.25, meaning a quarter of the section
      // had to be on screen -- but a section taller than 4x the viewport can
      // never reach that fraction, so the Experience timeline stayed invisible
      // forever. The default ("some") fires as soon as any part crosses in;
      // the bottom margin just delays it slightly so it isn't triggered by the
      // section's own top padding.
      viewport={{ once: true, margin: "0px 0px -120px 0px" }}
      className={`${styles.padding} mx-auto relative z-10 max-w-7xl ${className}`}
    >
      <span className="hash-span" id={idName}>
        &nbsp;
      </span>
      <Component />
    </motion.section>
  );

  HOC.displayName = `SectionWrapper(${Component.displayName || Component.name || "Component"})`;
  return HOC;
};

SectionWrapper.propTypes = {
  Component: PropTypes.elementType,
  idName: PropTypes.string,
  className: PropTypes.string,
};

export default SectionWrapper;
