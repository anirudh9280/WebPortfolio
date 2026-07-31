import { navLinks } from "../constants";
import { useActiveSection, scrollToSection } from "../hooks/useActiveSection";

/**
 * The signature element: a hairline y-axis pinned to the left edge, with a
 * labelled tick per section and the current position marked.
 *
 * It is an axis, not a stepper -- the ticks carry section names, never
 * sequence numbers. Hidden below 1180px where there is no gutter to spare.
 */
const AxisRail = () => {
  const active = useActiveSection();

  return (
    <nav className="axis-rail" aria-label="Section position">
      <span className="axis-rail-line" aria-hidden="true" />
      {navLinks.map(({ id, title }) => (
        <button
          key={id}
          type="button"
          className="axis-tick"
          aria-current={active === id ? "true" : undefined}
          onClick={() => scrollToSection(id)}
        >
          <span className="axis-tick-mark" aria-hidden="true" />
          <span className="axis-tick-label">{title}</span>
        </button>
      ))}
    </nav>
  );
};

export default AxisRail;
