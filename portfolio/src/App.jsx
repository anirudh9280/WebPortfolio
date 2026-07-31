import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";

import {
  About,
  Analytics,
  AxisRail,
  Contact,
  Experience,
  Footer,
  Hero,
  Navbar,
  SkillsMarquee,
  Works,
} from "./components";
import { ThemeProvider } from "./context/ThemeContext";

function HomePage() {
  return (
    <div className="relative z-0 bg-ground">
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
