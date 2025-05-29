import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
  Footer,
  Analytics,
} from "./components";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function HomePage() {
  const { darkMode } = useTheme();

  return (
    <div className={`relative z-0 ${darkMode ? "bg-primary" : "bg-slate-100"}`}>
      <div
        className={`${darkMode ? "bg-hero-pattern" : "bg-gradient-to-b from-blue-100 to-white"} bg-cover bg-no-repeat bg-center`}
      >
        <Navbar />
        <Hero />
      </div>
      <About />
      <Experience />
      <Tech />
      <Works />
      <Feedbacks />
      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
