/* eslint-disable react/prop-types */
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";

const stylesForTag = [
  "bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
  "bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600",
  "bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400",
  "bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100",
  "bg-clip-text text-transparent bg-gradient-to-r from-red-800 via-yellow-600 to-yellow-500",
  "bg-clip-text text-transparent bg-gradient-to-r from-rose-700 to-pink-600",
  "bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600",
  "bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-orange-300",
  "bg-clip-text text-transparent bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-200 via-violet-600 to-sky-900",
  "bg-clip-text text-transparent bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600",
  "bg-clip-text text-transparent bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700 via-orange-300 to-rose-800",
  "bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800",
  "bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-lime-600",
  "bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-400 to-red-500",
  "bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-violet-400",
  "bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300",
  "bg-clip-text text-transparent bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-yellow-500 via-purple-500 to-blue-500",
  "bg-clip-text text-transparent bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-300 via-green-400 to-rose-700",
  "bg-clip-text text-transparent bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-sky-500 via-orange-200 to-yellow-600",
  "bg-clip-text text-transparent bg-[conic-gradient(at_bottom,_var(--tw-gradient-stops))] from-white via-sky-500 to-sky-500",
  "bg-clip-text text-transparent bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-rose-900 via-amber-800 to-rose-400",
  "bg-clip-text text-transparent bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-orange-900 via-amber-100 to-orange-900",
  "bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-gray-50 to-teal-300",
  "bg-clip-text text-transparent bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-red-900 via-violet-200 to-orange-500",
  "bg-clip-text text-transparent bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-red-900 via-violet-200 to-orange-500",
  "bg-clip-text text-transparent bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-200 via-violet-600 to-sky-900",
];

function randomNoRepeats(array) {
  var copy = array.slice(0);
  return function () {
    if (copy.length < 1) {
      copy = array.slice(0);
    }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}

const ProjectCounter = ({ count }) => {
  const { darkMode } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          w-16 h-16 rounded-full flex items-center justify-center
          ${
            darkMode
              ? "bg-gradient-to-br from-purple-600 to-blue-500"
              : "bg-gradient-to-br from-teal-400 to-blue-500"
          }
          shadow-lg relative
        `}
      >
        <div className="absolute inset-0.5 rounded-full bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <span className="text-white text-2xl font-bold">{count}</span>
        </div>
        <svg
          className="absolute -right-1 -top-1 h-5 w-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
      <div
        className={`flex flex-col ${darkMode ? "text-white" : "text-gray-800"}`}
      >
        <span className="text-sm font-medium">Total</span>
        <span className="text-xl font-bold">Projects</span>
      </div>
    </div>
  );
};

const GitHubStat = ({ label, value, darkMode }) => {
  return (
    <div className="flex justify-between items-center w-full py-6">
      <span
        className={`text-xl uppercase tracking-wider font-normal ${darkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        {label}
      </span>
      <span
        className={`text-4xl font-normal ml-10 ${darkMode ? "text-white" : "text-gray-800"}`}
      >
        {value}
      </span>
    </div>
  );
};

const GitHubStats = () => {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    public_repos: 0,
    isLoading: true,
  });

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/anirudh9280"
        );
        const data = await response.json();

        setStats({
          followers: data.followers,
          following: data.following,
          public_repos: data.public_repos,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching GitHub stats:", error);
        setStats((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchGitHubStats();
  }, []);

  if (stats.isLoading) {
    return (
      <div className="w-full animate-pulse h-64 bg-gray-300 rounded-lg"></div>
    );
  }

  return (
    <motion.div
      variants={fadeIn("left", "spring", 0.3, 0.75)}
      className={`
        flex flex-col w-full mt-4 px-8 py-8 rounded-xl shadow-lg
        ${
          darkMode
            ? "bg-gray-800/80 border border-gray-700"
            : "bg-white/80 border border-gray-200"
        }
        backdrop-filter backdrop-blur-sm
      `}
    >
      <motion.h3
        variants={fadeIn("left", "spring", 0.4, 0.75)}
        className={`text-2xl font-semibold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}
      >
        GitHub Stats:
      </motion.h3>

      <motion.div variants={fadeIn("left", "spring", 0.5, 0.75)}>
        <GitHubStat
          label="Followers"
          value={stats.followers}
          darkMode={darkMode}
        />
      </motion.div>

      <motion.div variants={fadeIn("left", "spring", 0.6, 0.75)}>
        <GitHubStat
          label="Following"
          value={stats.following}
          darkMode={darkMode}
        />
      </motion.div>

      <motion.div variants={fadeIn("left", "spring", 0.7, 0.75)}>
        <GitHubStat
          label="Public Repos"
          value={stats.public_repos}
          darkMode={darkMode}
        />
      </motion.div>
    </motion.div>
  );
};

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  deploy_code_link,
  source_code_link,
}) => {
  const randomTagClass = randomNoRepeats(stylesForTag);
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 flex justify-end m-3 card_img_hover">
            <div
              onClick={() => window.open(deploy_code_link, "_blank")}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              {/* <img src={github} alt="github" className="w-1/2 h-1/2 object-contain"/>*/}
              <p className="">{`</>`}</p>
            </div>
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <img
                src={github}
                alt="github"
                className="w-1/2 h-1/2 object-contain"
              />
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
              <p key={tag.name} className={`text-[14px] ${randomTagClass()}`}>
                #{tag.name}
              </p>
            );
          })}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  // Filter projects - only include those you want to display
  // You can add a 'display: false' property to projects you want to hide
  const displayedProjects = projects.filter(
    (project) => project.display !== false
  );

  return (
    <>
      <div className="relative">
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>My Work</p>
          <div className="flex items-center">
            <h2 className={styles.sectionHeadText}>Projects.</h2>
            <div className="ml-24">
              <ProjectCounter count={displayedProjects.length} />
            </div>
          </div>
        </motion.div>

        <div className="absolute right-0 top-0 flex flex-col">
          <div className="w-full max-w-[350px]">
            <GitHubStats />
          </div>
        </div>

        <div className="w-full mt-10">
          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            className="mt-3 text-secondary max-w-3xl leading-[30px] text-[17px]"
          >
            In this section, I invite you to explore a collection of projects
            that reflect my passion for technology and my dedication to crafting
            meaningful solutions to every-day problems. Each project represents
            a unique journey, a problem solved, and a new skill acquired. Feel
            free to click on any project - each of which are briefly described
            with links to code repositories and live demos. I hope you find
            insight in these endeavors that I have completed and get a glimpse
            of what I can bring to your team or project.
          </motion.p>
        </div>
      </div>

      <div className="mt-32 flex flex-wrap gap-7">
        {displayedProjects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");
