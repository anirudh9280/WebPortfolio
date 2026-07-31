import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <ThemeProvider>
      {/* Covers every framer-motion animation at once, including the section
          entrances, so reduced-motion doesn't have to be handled per-component. */}
      <MotionConfig reducedMotion="user">
        {/* Outside the router so it survives route changes. Renders nothing on
            touch devices or under reduced motion. */}
        <CursorRing />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App;
