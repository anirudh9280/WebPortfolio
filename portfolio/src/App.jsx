import { BrowserRouter, Routes, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { MotionConfig } from "framer-motion";

import {
  About,
  Analytics,
  AxisRail,
  Contact,
  CursorRing,
  Experience,
  Footer,
  Hero,
  Navbar,
  SkillsMarquee,
  Works,
} from "./components";
import { ThemeProvider } from "./context/ThemeContext";
import { MotionProvider, useMotionPref } from "./context/MotionContext";

// overflow-x-clip, not hidden: entrance animations translate elements up to
// 100px sideways, which makes a 390px viewport briefly scrollable. `clip`
// suppresses that without creating a scroll container, so position:fixed (the
// axis rail) and smooth scrolling keep working.
function HomePage() {
  return (
    <div className="relative z-0 overflow-x-clip bg-ground">
      <Navbar />
      <AxisRail />
      <main>
        <Hero />
        <About />
        <Experience />
        <SkillsMarquee />
        <Works />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

/**
 * Framer-motion's own reduced-motion handling is driven from the site switch
 * rather than the OS query: "never" forces animations on, "always" strips the
 * transforms. That way one control governs framer-motion, the CSS keyframes
 * (via the html.motion-off class) and the canvas loop together.
 */
function MotionShell({ children }) {
  const { motionOn } = useMotionPref();
  return (
    <MotionConfig reducedMotion={motionOn ? "never" : "always"}>
      {children}
    </MotionConfig>
  );
}

MotionShell.propTypes = { children: PropTypes.node };

function App() {
  return (
    <ThemeProvider>
      <MotionProvider>
        <MotionShell>
          {/* Outside the router so it survives route changes. Renders nothing
              on touch devices or when motion is off. */}
          <CursorRing />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </BrowserRouter>
        </MotionShell>
      </MotionProvider>
    </ThemeProvider>
  );
}

export default App;
