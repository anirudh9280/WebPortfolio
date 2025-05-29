import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { github_icon, linkedin_icon, analytics_icon } from "../assets";

const Footer = () => {
  const { darkMode } = useTheme();

  return (
    <footer
      className={`mt-16 py-8 ${darkMode ? "bg-black-100" : "bg-gray-50"} border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Divider line */}
        <div
          className={`w-full h-px ${darkMode ? "bg-gray-600" : "bg-gray-300"} mb-8`}
        />

        {/* Social Icons */}
        <div className="flex justify-center items-center gap-8 mb-6">
          <a
            href="https://github.com/anirudh9280"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 rounded-full border-2 ${
              darkMode
                ? "border-gray-600 hover:border-white"
                : "border-gray-300 hover:border-gray-600"
            } flex items-center justify-center transition-all duration-300 hover:scale-110`}
          >
            <img
              src={github_icon}
              alt="GitHub"
              className={`w-6 h-6 object-contain ${darkMode ? "invert" : ""}`}
            />
          </a>

          <a
            href="https://www.linkedin.com/in/anirudha9/"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 rounded-full border-2 ${
              darkMode
                ? "border-gray-600 hover:border-blue-400"
                : "border-gray-300 hover:border-blue-600"
            } flex items-center justify-center transition-all duration-300 hover:scale-110`}
          >
            <img
              src={linkedin_icon}
              alt="LinkedIn"
              className={`w-6 h-6 object-contain ${darkMode ? "invert" : ""}`}
            />
          </a>

          <Link
            to="/analytics"
            className={`w-12 h-12 rounded-full border-2 ${
              darkMode
                ? "border-gray-600 hover:border-green-400"
                : "border-gray-300 hover:border-green-600"
            } flex items-center justify-center transition-all duration-300 hover:scale-110`}
          >
            <img
              src={analytics_icon}
              alt="Analytics"
              className={`w-6 h-6 object-contain ${darkMode ? "invert" : ""}`}
            />
          </Link>
        </div>

        {/* Copyright Text */}
        <div className="text-center">
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            © 2025 Anirudh Annabathula. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
