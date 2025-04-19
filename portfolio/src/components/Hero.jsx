/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";
import { useTheme } from "../context/ThemeContext";

const Hero = () => {
  const { darkMode } = useTheme();

  return (
    <section className="relative w-full h-screen mx-auto">
      <div
        className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div
            className={`w-5 h-5 rounded-full ${darkMode ? "bg-[#915eff]" : "bg-[#6d28d9]"}`}
          />
          <div
            className={`w-1 sm:h-80 h-40 ${darkMode ? "violet-gradient" : "bg-gradient-to-b from-[#6d28d9] to-transparent"}`}
          />
        </div>
        <div>
          <h1 className={`${styles.heroHeadText}`}>
            Hi, I'm{" "}
            <span
              className={
                darkMode ? "text-[#91feff]" : "text-[#0891b2] font-bold"
              }
            >
              Anirudh
            </span>
          </h1>
          <p
            className={`${styles.heroSubText} mt-100 ${!darkMode && "font-medium text-gray-800"}`}
          >
            I am a sophomore majoring in Data Science{" "}
            <br className="sm: block hidden" /> at UC San Diego. I am passionate
            about leveraging data to drive innovative solutions.
          </p>
        </div>
      </div>
      <ComputersCanvas />
      <div className="mt-10 absolute xs:bottom-0 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="mt-30">
            <div
              className={`w-[35px] h-[64px] rounded-3xl border-4 ${darkMode ? "border-secondary" : "border-gray-500"} flex justify-center items-start p-2`}
            >
              <motion.div
                animate={{
                  y: [0, 24, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className={`w-3 h-3 rounded-full ${darkMode ? "bg-secondary" : "bg-gray-500"} mb-1`}
              />
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
