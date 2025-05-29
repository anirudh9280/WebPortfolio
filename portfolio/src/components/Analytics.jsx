import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Navbar from "./Navbar";
import CommitGraph from "./CommitGraph";
import { styles } from "../styles";

const Analytics = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/#contact");
    // Scroll to bottom after navigation
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div
      className={`relative z-0 min-h-screen ${darkMode ? "bg-primary" : "bg-slate-100"}`}
    >
      {/* Same navbar as home page */}
      <div className={`${darkMode ? "bg-primary" : "bg-slate-100"}`}>
        <Navbar />
      </div>

      {/* Page content with proper top padding to account for fixed navbar */}
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        {/* Back Button - positioned at top of content, not fixed */}
        <div className="mb-6">
          <button
            onClick={handleBackClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
                : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-300"
            } shadow-lg hover:shadow-xl`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>

        {/* Page header */}
        <div className="text-center mb-8">
          <p className={styles.sectionSubText}>Development Analytics</p>
          <h1 className={styles.sectionHeadText}>Portfolio Analytics.</h1>
          <p
            className={`mt-4 ${darkMode ? "text-secondary" : "text-gray-600"} text-[17px] max-w-3xl mx-auto leading-[30px]`}
          >
            Dive deep into the development patterns and commit history of this
            portfolio website. Explore when I code, what languages I use, and
            how the project has evolved over time.
          </p>
        </div>

        {/* Commit Graph Component */}
        <CommitGraph />
      </div>
    </div>
  );
};

export default Analytics;
