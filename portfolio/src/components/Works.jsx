/* eslint-disable react/prop-types */
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn } from "../utils/motion";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

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
  name,
  description,
  tags,
  image,
  deploy_code_link,
  source_code_link,
}) => {
  const randomTagClass = randomNoRepeats(stylesForTag);
  return (
    <div>
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
    </div>
  );
};

const YearPieChart = ({ onYearSelect, onSearchQuery }) => {
  const { darkMode } = useTheme();
  const svgRef = useRef();
  const [selectedYear, setSelectedYear] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    // Get unique years from projects
    const years = [...new Set(projects.map((project) => project.year))].sort();

    // Count projects per year
    const yearCounts = years.map((year) => ({
      year,
      count: projects.filter((project) => project.year === year).length,
    }));

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Chart dimensions - increased width and height, larger margins
    const width = 350;
    const height = 350;
    const margin = 70;
    const radius = Math.min(width, height) / 2 - margin;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Add a border to visualize SVG boundaries (helpful for debugging)
    // d3.select(svgRef.current).style("border", "1px dashed #ccc");

    // Color scale
    const color = d3
      .scaleOrdinal()
      .domain(years)
      .range(
        darkMode
          ? ["#8884d8", "#4CAF50", "#FFA500", "#9C27B0", "#03A9F4", "#FF5722"]
          : ["#6366f1", "#22c55e", "#f59e0b", "#8b5cf6", "#06b6d4", "#f43f5e"]
      );

    // Pie generator
    const pie = d3
      .pie()
      .value((d) => d.count)
      .sort(null);

    // Arc generator
    const arc = d3
      .arc()
      .innerRadius(radius * 0.3)
      .outerRadius(radius * 0.8);

    // Outer arc for labels - positioned farther out
    const outerArc = d3
      .arc()
      .innerRadius(radius * 1.0)
      .outerRadius(radius * 1.0);

    // Create pie chart
    const arcs = svg
      .selectAll("arc")
      .data(pie(yearCounts))
      .enter()
      .append("g")
      .attr("class", "arc")
      .style("cursor", "pointer")
      .style("opacity", (d) => {
        // If searching, make all slices semi-transparent
        if (isSearching) return 0.4;
        // Otherwise, highlight selected year or all if none selected
        return selectedYear === null || selectedYear === d.data.year ? 1 : 0.4;
      })
      .on("click", (event, d) => {
        if (selectedYear === d.data.year) {
          setSelectedYear(null);
          onYearSelect(null);
        } else {
          setSelectedYear(d.data.year);
          onYearSelect(d.data.year);
        }
      })
      .on("mouseover", function () {
        d3.select(this).transition().duration(200).style("opacity", 1);
      })
      .on("mouseout", function (event, d) {
        if (
          isSearching ||
          (selectedYear !== null && selectedYear !== d.data.year)
        ) {
          d3.select(this).transition().duration(200).style("opacity", 0.4);
        }
      });

    // Add paths with color animation when a year is selected
    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => {
        // If a year is selected, use its color for all slices when it's that year
        if (selectedYear === d.data.year) {
          return color(d.data.year);
        } else if (selectedYear !== null) {
          // Return a muted version of the color for non-selected years
          return darkMode ? "#4b5563" : "#d1d5db";
        }
        // Normal color when no year selected
        return color(d.data.year);
      })
      .attr("stroke", darkMode ? "#1f2937" : "#ffffff")
      .attr("stroke-width", 2)
      .transition()
      .duration(750)
      .attrTween("d", function (d) {
        // Animation for the pie slices
        if (selectedYear === null || selectedYear === d.data.year) {
          const i = d3.interpolate(
            { startAngle: d.startAngle, endAngle: d.startAngle },
            d
          );
          return function (t) {
            return arc(i(t));
          };
        }
        return function () {
          return arc(d);
        };
      });

    // Add labels
    arcs
      .append("text")
      .attr("transform", (d) => {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 1.1 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr("dy", ".35em")
      .style("text-anchor", (d) => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? "start" : "end";
      })
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", darkMode ? "#ffffff" : "#111827")
      .style("opacity", (d) => {
        // Make labels for non-selected years more transparent
        return selectedYear === null || selectedYear === d.data.year ? 1 : 0.4;
      })
      .text((d) => `${d.data.year} (${d.data.count})`);

    // Add polylines between arcs and labels - longer lines
    arcs
      .append("polyline")
      .attr("points", (d) => {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 1.1 * (midAngle < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      })
      .style("fill", "none")
      .style("stroke", darkMode ? "#9ca3af" : "#6b7280")
      .style("stroke-width", 1)
      .style("opacity", (d) => {
        // Make polylines for non-selected years more transparent
        return selectedYear === null || selectedYear === d.data.year ? 1 : 0.4;
      });

    // Add center text
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", darkMode ? "#ffffff" : "#111827")
      .text(selectedYear ? `${selectedYear}` : "Projects by Year");
  }, [darkMode, selectedYear, onYearSelect, isSearching]);

  const handleReset = () => {
    setSelectedYear(null);
    setSearchQuery("");
    setIsSearching(false);
    onYearSelect(null);
    onSearchQuery("");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchQuery(value);
    setIsSearching(value.trim() !== "");
  };

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between gap-8 mt-10 mb-10 w-full ${darkMode ? "text-white" : "text-gray-800"}`}
    >
      {/* Search box */}
      <div className="w-full md:w-1/3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors ${
              darkMode
                ? "bg-transparent border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                : "bg-transparent border-gray-300 text-gray-800 placeholder-gray-500 focus:border-indigo-500"
            }`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Pie chart - updated container size */}
      <div className="w-full md:w-2/3 flex flex-col items-center md:pl-10">
        <div
          className="pie-chart-container"
          style={{ width: "380px", height: "380px" }}
        >
          <svg ref={svgRef}></svg>
        </div>

        <button
          onClick={handleReset}
          className={`mt-4 px-6 py-2 rounded-xl font-medium transition-all duration-300 border-2 ${
            darkMode
              ? "border-gray-600 hover:bg-gray-800 text-white"
              : "border-gray-300 hover:bg-gray-100 text-gray-800"
          }`}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

const Works = () => {
  const [filteredYear, setFilteredYear] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter projects based on year AND search query
  const displayedProjects = projects.filter((project) => {
    // Filter out projects with display:false
    if (project.display === false) return false;

    // Apply year filter if active
    if (filteredYear !== null && project.year !== filteredYear) {
      return false;
    }

    // Apply search query filter if active
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some((tag) => tag.name.toLowerCase().includes(query))
      );
    }

    // If we passed both filters (or no filters are active), show the project
    return true;
  });

  return (
    <>
      <div className="relative">
        <div>
          <p className={styles.sectionSubText}>My Projects</p>
          <div className="flex items-center">
            <h2 className={styles.sectionHeadText}>Projects.</h2>
            <div className="ml-24">
              <ProjectCounter count={displayedProjects.length} />
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 flex flex-col">
          <div className="w-full max-w-[350px]">
            <GitHubStats />
          </div>
        </div>

        <div className="w-full mt-10">
          <p className="mt-3 text-secondary max-w-3xl leading-[30px] text-[17px]">
            In this section, I invite you to explore a collection of projects
            that reflect my passion for technology and my dedication to crafting
            meaningful solutions to every-day problems. Each project represents
            a unique journey, a problem solved, and a new skill acquired. Feel
            free to click on any project - each of which are briefly described
            with links to code repositories and live demos. I hope you find
            insight in these endeavors that I have completed and get a glimpse
            of what I can bring to your team or project.
          </p>
        </div>
      </div>

      {/* Filter section: Year Pie Chart Selector and Search */}
      <YearPieChart
        onYearSelect={setFilteredYear}
        onSearchQuery={setSearchQuery}
      />

      {/* Project count indicator when filtering */}
      {(filteredYear !== null || searchQuery.trim() !== "") && (
        <div className="text-center mb-8">
          <span className="text-secondary text-lg">
            {filteredYear !== null && searchQuery.trim() !== ""
              ? `Showing ${displayedProjects.length} project${
                  displayedProjects.length !== 1 ? "s" : ""
                } from ${filteredYear} matching "${searchQuery}"`
              : searchQuery.trim() !== ""
                ? `Showing ${displayedProjects.length} project${
                    displayedProjects.length !== 1 ? "s" : ""
                  } matching "${searchQuery}"`
                : `Showing ${displayedProjects.length} project${
                    displayedProjects.length !== 1 ? "s" : ""
                  } from ${filteredYear}`}
          </span>
        </div>
      )}

      {/* Display message if no projects match the filters */}
      {displayedProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-8 mb-8">
          <p className="text-secondary text-xl mb-4">
            No projects match your current filters
          </p>
          <button
            onClick={() => {
              setFilteredYear(null);
              setSearchQuery("");
            }}
            className="px-6 py-2 rounded-xl border-2 text-white font-medium bg-tertiary"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Project cards */}
      <div className="mt-8 flex flex-wrap gap-7 justify-center">
        {displayedProjects.map((project, index) => (
          <ProjectCard key={`project-${index}`} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
