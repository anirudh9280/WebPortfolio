/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// function add two numbers

import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import "react-vertical-timeline-component/style.min.css";
import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { useTheme } from "../context/ThemeContext";

const ExperienceCard = ({ experience }) => {
  const { darkMode } = useTheme();

  return (
    <VerticalTimelineElement
      contentStyle={{
        background: darkMode ? "#1d1836" : "#ffffff",
        color: darkMode ? "#fff" : "#0f172a",
        border: darkMode ? "none" : "1px solid #cbd5e1",
      }}
      contentArrowStyle={{
        borderRight: darkMode ? "7px solid #232631" : "7px solid #e2e8f0",
      }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className="flex justify-center items-center w-full h-full">
          <img
            src={experience.icon}
            alt={experience.company_name}
            className="w-[100%] h-[85%] object-contain"
          />
        </div>
      }
    >
      <div>
        <h3
          className={`${darkMode ? "text-white" : "text-gray-900"} text-[24px] font-bold`}
        >
          {experience.title}
        </h3>
        <p
          className={`${darkMode ? "text-secondary" : "text-gray-600"} text-[16px] font-semibold`}
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>
      <ul className="mt-5 list-disc ml-5 space-y-2">
        {experience.points.map((point, index) => {
          if (point === "<divider/>") {
            return (
              <div
                key={`divider-${index}`}
                className={`my-3 border-t ${darkMode ? "border-gray-600" : "border-gray-300"} w-full mx-auto`}
                style={{ listStyle: "none" }}
              />
            );
          }
          return (
            <li
              key={`experience-point-${index}`}
              className={`${darkMode ? "text-white-100" : "text-gray-700"} text-[14px] pl-1 tracking-wider`}
            >
              {point}
            </li>
          );
        })}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What I have done so far</p>
        <h2 className={styles.sectionHeadText}>Experience.</h2>
      </motion.div>
      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
