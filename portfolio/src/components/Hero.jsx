/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { motion } from "framer-motion"
import { styles } from "../styles"
import { ComputersCanvas } from "./canvas"
const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto">
      <div className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5`}>
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915eff]"/>
          <div className="w-1 sm:h-80 h-40 violet-gradient"/>

        </div>
        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>Hi, I'm <span className="text-[#91feff]">Anirudh</span></h1>
          <p className={`${styles.heroSubText} mt-100 text-white-100`}>I am a sophomore majoring in Data Science <br className="sm: block hidden"/> at UC San Diego. I am passionate about leveraging data to drive innovative solutions.</p>
        </div>
      </div>
      <ComputersCanvas />
      <div className="mt-10 absolute xs:bottom-0 bottom-32 w-full flex justify-center items-center" >
        <a href="#about">
          <div className="mt-30">
            <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
              <motion.dev animate={{
              y: [0, 24, 0]}} transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop'
              }} className='w-3 h-3 rounded-full bg-secondary mb-1'/>
          </div>

          </div>
        </a>
      </div>
    </section>
  )
}

export default Hero