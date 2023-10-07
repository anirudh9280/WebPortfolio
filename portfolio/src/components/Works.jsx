/* eslint-disable react/prop-types */
import React from 'react'
import {Tilt} from "react-tilt"
import {motion} from "framer-motion"
import {styles} from "../styles"
import {github} from "../assets"
import { SectionWrapper } from '../hoc'
import {projects} from "../constants"
import {fadeIn, textVariant} from "../utils/motion"
import { random } from 'maath'

const stylesForTag = [
    'bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500', 
    'bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600',
    'bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',
    'bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100',
    'bg-clip-text text-transparent bg-gradient-to-r from-red-800 via-yellow-600 to-yellow-500',
    'bg-clip-text text-transparent bg-gradient-to-r from-rose-700 to-pink-600',
    'bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600',
    'bg-clip-text text-transparent bg-gradient-to-tr from-violet-500 to-orange-300',
    'bg-clip-text text-transparent bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-200 via-violet-600 to-sky-900',
    'bg-clip-text text-transparent bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600',
    'bg-clip-text text-transparent bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700 via-orange-300 to-rose-800',
    'bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800',
    'bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-lime-600',
    'bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-400 to-red-500',
    'bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-violet-400',
    'bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300',
    'bg-clip-text text-transparent bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-yellow-500 via-purple-500 to-blue-500',
    'bg-clip-text text-transparent bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-300 via-green-400 to-rose-700',
    'bg-clip-text text-transparent bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-sky-500 via-orange-200 to-yellow-600',
    'bg-clip-text text-transparent bg-[conic-gradient(at_bottom,_var(--tw-gradient-stops))] from-white via-sky-500 to-sky-500',
    'bg-clip-text text-transparent bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-rose-900 via-amber-800 to-rose-400',
    'bg-clip-text text-transparent bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-orange-900 via-amber-100 to-orange-900',
    'bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-gray-50 to-teal-300',
    'bg-clip-text text-transparent bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-red-900 via-violet-200 to-orange-500',
    'bg-clip-text text-transparent bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-red-900 via-violet-200 to-orange-500',
    'bg-clip-text text-transparent bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-200 via-violet-600 to-sky-900',
  ]
  function randomNoRepeats(array) {
    var copy = array.slice(0);
    return function () {
      if (copy.length < 1) { copy = array.slice(0); }
      var index = Math.floor(Math.random() * copy.length);
      var item = copy[index];
      copy.splice(index, 1);
      return item;
    };
  }

const ProjectCard = ({ index, name, description, tags, image, deploy_code_link, source_code_link}) => {
  const randomTagClass = randomNoRepeats(stylesForTag)
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt options={{
        max: 45, 
        scale: 1, 
        speed: 450,
      }} className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full">
        <div className="relative w-full h-[230px]">
          <img src={image} alt={name} className="w-full h-full object-cover rounded-2xl"/>
          <div className="absolute inset-0 flex justify-end m-3 card_img_hover">
            <div onClick={() => window.open(deploy_code_link, '_blank')} className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer">
              <img src={github} alt="github" className="w-1/2 h-1/2 object-contain"/>
            </div>
            <div onClick={() => window.open(source_code_link, '_blank')} className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer">
              <img src={github} alt="github" className="w-1/2 h-1/2 object-contain"/>
            </div>
          </div>

        </div>
        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{name}</h3>
          <p className="mt-2 text-secondary text-[14px]">{description}</p>

        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => {
            return (
              <p key={tag.name} className={`text-[14px] ${randomTagClass()}`}>#{tag.name}</p>
            )
          })}
        </div>

      </Tilt>
    </motion.div>
  )

}

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>My Work</p>
          <h2 className={styles.sectionHeadText}>Projects.</h2>
      </motion.div>
      <div className="w-full flex">
        <motion.p variants={fadeIn("", "", 0.1, 1)} className="mt-3 text-secondary max-w-3xl leading-[30px] text-[17px]">
          In this section, I invite you to explore a collection of projects that reflect my passion for technology and my dedication to crafting meaningful solutions to every-day problems. Each project represents a unique journey, a problem solved, and a new skill acquired. Feel free to click on any project - each of which are briefly described with links to code repositories and live demos. I hope you find insight in these endeavors that I have completed and get a glimpse of what I can bring to your team or project. 
        </motion.p>
      </div>
      <div className="mt-20 flex flex-wrap gap-7">
        {projects.map((project, index) => {
          return (<ProjectCard key={`project-${index}`} index={index} {...project}/>)
        })}

      </div>
    </>
  )
}

export default SectionWrapper(Works, "")