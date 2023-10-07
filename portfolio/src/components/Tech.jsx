import React from 'react'
import { BallCanvas } from "./canvas"
import { SectionWrapper } from "../hoc"
import {technologies} from "../constants"

const Tech = () => {
  const styles = [
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

  return (
    <div className="flex flex-row flex-wrap justify-center gap-10">
      {technologies.map((technology) => {
        const randomClass = randomNoRepeats(styles)
        return (
          <div className="w-28 h-28" key={technology.name}>
            <h2 className={randomClass()}key={technology.name}>{technology.name}</h2>
          </div>
        )
      })}
    </div>
  )
}

export default SectionWrapper(Tech, "")