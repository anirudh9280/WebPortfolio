/* eslint-disable react/no-unknown-property */
import React from 'react'
import {Tilt} from "react-tilt"
import { motion } from "framer-motion"
import {styles} from "../styles"
import {services } from "../constants"
import {fadeIn, textVariant} from "../utils/motion"
import {SectionWrapper} from "../hoc"

const ServiceCard = ({index, title, icon}) => {
  return (
    <Tilt className="xs:w-[250px] w-full">
      <motion.div variants={fadeIn("right", "spring", 0.5 * index, 0.75)} className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card">
        <div options={{max: 45, scale: 1, speed: 450}} className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
          <img src={icon} alt={title} className="w-16 h-16 object-contain"/>
          <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
        </div>
      </motion.div>
    </Tilt>
  )
}

const About = () => {
  return (
    <p>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>
      <motion.p variants={fadeIn("", "", 0.1, 1)} className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]">
        I am a sophomore at UC San Diego, majoring in Data Science with concentrations in Mathematics and Cognitive Science. I specialize in machine learning, neural networks, and full-stack development. I am passionate about leveraging data to drive insights and solutions. With hands-on experience in developing machine learning models and neural networks, alongside a robust background in full-stack development, I am eager to gain internships and work experience in data-related roles to further hone my skills and contribute to innovative projects.
      </motion.p>
      <p className="mt-5">
        Relavent Coursework: <span className={styles.courseName}>COGS 9</span>: Introduction to Data Science, <span className={styles.courseName}>DSC 10</span>: Principles of Data Science (Python, Pandas), <span className={styles.courseName}>DSC 20</span>: Programming/Data Structures (Python), <span className={styles.courseName}>MATH 18</span>: Linear Algebra, <span className={styles.courseName}>DSC 30</span>: Data Structures and Algorithms (Java), <span className={styles.courseName}>DCS 40A</span>: Theoretical Foundations of Data Science I, <span className={styles.courseName}>DSC 40A</span>: Theoretical Foundations of Data Science II, <span className={styles.courseName}>DSC 80</span>: Practice of Data Science (Python, Pandas)
      </p>
      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (<ServiceCard key={service.title} index={index} {...service} />))}
      </div>
    </p>
  )
}

export default SectionWrapper(About, "about")