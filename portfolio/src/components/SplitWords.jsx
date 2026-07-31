import { Fragment } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

/**
 * Word-by-word reveal: each word rises from behind a clip mask.
 *
 * Split by WORD, never by character. Adrian Roselli tested character-splitting
 * across eight screen-reader/browser pairs: JAWS+Chrome announces nothing at
 * all, Narrator+Edge reads only the first letter, VoiceOver+Safari reads a
 * partial subset, and the usual aria-label workaround does not reliably fix it.
 * Word splitting reads correctly in the same matrix, which is the whole reason
 * this component is safe.
 *
 * Because word splitting reads correctly, there is deliberately NO hidden
 * duplicate copy of the text. An earlier version had one, and it doubled the
 * heading in text selection, copy-paste and find-in-page. The real words with
 * real spaces between them are the accessible text.
 *
 * Under reduced motion, MotionConfig reducedMotion="user" in App.jsx collapses
 * the transforms, so the words simply appear.
 */
const SplitWords = ({ text, className = "", delay = 0, stagger = 0.045 }) => {
  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            // The clip window. inline-block is required for overflow to apply,
            // but it is per WORD, so line breaking still works between words.
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "bottom",
            }}
          >
            <motion.span
              variants={{
                hidden: { y: "110%", opacity: 0 },
                show: {
                  y: "0%",
                  opacity: 1,
                  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              style={{ display: "inline-block", willChange: "transform" }}
            >
              {word}
            </motion.span>
          </span>
          {/* The separator must be a SIBLING of the inline-block, not its last
              child. Inside it, CSS treats the space as trailing whitespace in
              the box and collapses it away, which silently ran headings
              together as "WhereI'veworked." */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
};

SplitWords.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  delay: PropTypes.number,
  stagger: PropTypes.number,
};

export default SplitWords;
