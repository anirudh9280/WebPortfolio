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

const CommitGraph = () => {
  const { darkMode } = useTheme();
  const containerRef = useRef(null);
  const statsRef = useRef(null);
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);
  const selectionCountRef = useRef(null);
  const languageBreakdownRef = useRef(null);

  // Clear data refs to ensure proper refresh
  const dataRef = useRef(null);
  const commitsRef = useRef(null);

  useEffect(() => {
    // Force immediate initialization without any blocking conditions
    const renderVisualization = async () => {
      try {
        // Clear previous content
        if (statsRef.current) statsRef.current.innerHTML = "";
        if (chartRef.current) chartRef.current.innerHTML = "";
        if (languageBreakdownRef.current)
          languageBreakdownRef.current.innerHTML = "";

        // Global variables for scales
        let xScale, yScale, rScale;

        // Load data
        const loadData = async () => {
          try {
            // Log to debug loading process
            console.log("Loading CSV data...");

            // Try multiple possible paths to find the CSV file
            let data;

            try {
              // First attempt: absolute path from public directory
              data = await d3.csv("/meta/loc.csv", (row) => ({
                ...row,
                line: Number(row.line),
                depth: Number(row.depth),
                length: Number(row.length),
                date: new Date(row.date + "T00:00" + row.timezone),
                datetime: new Date(row.datetime),
              }));

              if (data && data.length > 0) {
                console.log(
                  "CSV data loaded successfully from /meta/loc.csv:",
                  data.length,
                  "rows"
                );
                return data;
              }
            } catch (err) {
              console.warn(
                "Could not load from /meta/loc.csv, trying alternative path...",
                err
              );
            }

            try {
              // Second attempt: relative path
              data = await d3.csv("meta/loc.csv", (row) => ({
                ...row,
                line: Number(row.line),
                depth: Number(row.depth),
                length: Number(row.length),
                date: new Date(row.date + "T00:00" + row.timezone),
                datetime: new Date(row.datetime),
              }));

              if (data && data.length > 0) {
                console.log(
                  "CSV data loaded successfully from meta/loc.csv:",
                  data.length,
                  "rows"
                );
                return data;
              }
            } catch (err) {
              console.warn("Could not load from meta/loc.csv either", err);
            }

            console.error("Failed to load data from any path");
            return [];
          } catch (error) {
            console.error("Error loading data:", error);
            return [];
          }
        };

        // Process commits
        const processCommits = (data) => {
          return d3
            .groups(data, (d) => d.commit)
            .map(([commit, lines]) => {
              let first = lines[0];
              let { author, date, time, timezone, datetime } = first;
              let ret = {
                id: commit,
                url:
                  "https://github.com/anirudh9280/portfolio/commit/" + commit,
                author,
                date,
                time,
                timezone,
                datetime,
                hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                totalLines: lines.length,
              };

              Object.defineProperty(ret, "lines", {
                value: lines,
                enumerable: false,
                writable: false,
                configurable: false,
              });

              return ret;
            });
        };

        // Render commit information
        const renderCommitInfo = (data, commits) => {
          // Remove any existing content
          d3.select(statsRef.current).html("");

          // Create a flex container for horizontal layout
          const container = d3
            .select(statsRef.current)
            .append("div")
            .attr("class", "flex flex-wrap justify-around gap-4");

          // Function to add a stat block
          const addStat = (title, value) => {
            const statBlock = container
              .append("div")
              .attr("class", "stat-block text-center");

            statBlock
              .append("div")
              .attr("class", "stat-title text-sm opacity-75")
              .html(title);

            statBlock
              .append("div")
              .attr("class", "stat-value text-2xl font-bold")
              .text(value);
          };

          // Add total LOC
          addStat('Total <abbr title="Lines of code">LOC</abbr>', data.length);

          // Add total commits
          addStat("Total Commits", commits.length);

          // Add number of files
          let uniqueFiles = new Set(data.map((d) => d.file)).size;
          addStat("Number of Files", uniqueFiles);

          // Add average file length
          const fileGroups = d3.groups(data, (d) => d.file);
          let averageFileLength = d3.mean(
            fileGroups.map((group) => group[1].length)
          );
          addStat("Avg. File Length", averageFileLength.toFixed(2) + " lines");

          // Add longest file
          const fileLengths = fileGroups.map((group) => ({
            name: group[0],
            length: group[1].length,
          }));
          const longestFile = d3.greatest(fileLengths, (d) => d.length);
          const shortFileName = longestFile.name.split("/").pop();
          addStat(
            "Longest File",
            `${shortFileName} (${longestFile.length} lines)`
          );
        };

        // Update tooltip content
        const renderTooltipContent = (commit) => {
          const tooltip = tooltipRef.current;
          if (!tooltip || !commit) return;

          const link = tooltip.querySelector("#commit-link");
          const date = tooltip.querySelector("#commit-date");
          const time = tooltip.querySelector("#commit-time");
          const author = tooltip.querySelector("#commit-author");
          const lines = tooltip.querySelector("#commit-lines");

          if (link) link.href = commit.url || "#";
          if (link)
            link.textContent = commit.id
              ? commit.id.substring(0, 7)
              : "Unknown";
          if (date)
            date.textContent =
              commit.datetime?.toLocaleString("en", {
                dateStyle: "full",
              }) || "Unknown";
          if (time)
            time.textContent =
              commit.datetime?.toLocaleString("en", {
                timeStyle: "short",
              }) || "Unknown";
          if (author) author.textContent = commit.author || "Unknown";
          if (lines) lines.textContent = `${commit.totalLines || 0} changed`;
        };

        // Update tooltip visibility
        const updateTooltipVisibility = (isVisible) => {
          const tooltip = tooltipRef.current;
          if (!tooltip) return;
          tooltip.hidden = !isVisible;
        };

        // Update tooltip position
        const updateTooltipPosition = (event) => {
          const tooltip = tooltipRef.current;
          if (!tooltip) return;

          const padding = 10;

          // Calculate position relative to viewport
          let left = event.clientX + padding;
          let top = event.clientY + padding;

          // Adjust if tooltip would go beyond viewport
          const tooltipRect = tooltip.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          if (left + tooltipRect.width > viewportWidth) {
            left = event.clientX - tooltipRect.width - padding;
          }

          if (top + tooltipRect.height > viewportHeight) {
            top = event.clientY - tooltipRect.height - padding;
          }

          tooltip.style.left = `${left}px`;
          tooltip.style.top = `${top}px`;
        };

        // Check if commit is in selection
        const isCommitSelected = (selection, commit) => {
          if (!selection) return false;

          // Extract the x and y bounds from the selection
          const [[x0, y0], [x1, y1]] = selection;

          // Map commit data to screen coordinates using the scales
          const x = xScale(commit.datetime);
          const y = yScale(commit.hourFrac);

          // Check if the point is within the selection rectangle
          return x >= x0 && x <= x1 && y >= y0 && y <= y1;
        };

        // Filter to only show relevant language types
        const filterRelevantLanguages = (breakdown) => {
          const relevantTypes = ["jsx", "tsx", "js", "css"];
          return Array.from(breakdown.entries())
            .filter(([type]) => relevantTypes.includes(type.toLowerCase()))
            .sort((a, b) => b[1] - a[1]);
        };

        // Render language breakdown
        const renderLanguageBreakdown = (selection) => {
          if (!languageBreakdownRef.current) return;

          // Clear previous content
          languageBreakdownRef.current.innerHTML = "";

          if (!selection) return;

          const selectedCommits = selection
            ? commitsRef.current.filter((d) => isCommitSelected(selection, d))
            : [];

          if (selectedCommits.length === 0) return;

          const lines = selectedCommits.flatMap((d) => d.lines);

          // Use d3.rollup to count lines per language
          const breakdown = d3.rollup(
            lines,
            (v) => v.length,
            (d) => d.type || "unknown"
          );

          // Filter to only show relevant language types and sort by count
          const filteredBreakdown = filterRelevantLanguages(breakdown);

          // Calculate total for percentage
          const totalSelectedLines = lines.length;

          // Add header
          const header = document.createElement("h4");
          header.className = "language-breakdown-header";
          header.textContent = "Language Breakdown:";
          languageBreakdownRef.current.appendChild(header);

          // Update DOM with breakdown
          filteredBreakdown.forEach(([language, count]) => {
            const proportion = count / totalSelectedLines;
            const formatted = d3.format(".1~%")(proportion);

            const dt = document.createElement("dt");
            dt.textContent = language.toUpperCase();

            const dd = document.createElement("dd");
            dd.textContent = `${count} lines (${formatted})`;

            languageBreakdownRef.current.appendChild(dt);
            languageBreakdownRef.current.appendChild(dd);
          });
        };

        // Brush event handler
        const brushed = (event) => {
          const selection = event.selection;

          // Reset all circles to original color and opacity
          d3.selectAll(".commit-circle")
            .classed("selected", false)
            .attr("fill", darkMode ? "#ffffff" : "#000000") // Use the theme colors
            .style("fill-opacity", 0.7);

          // If there's a selection, highlight the selected circles
          if (selection) {
            // First filter the commits to find those that are selected
            const selectedCommits = commitsRef.current.filter((d) =>
              isCommitSelected(selection, d)
            );

            // Update the count display
            if (selectionCountRef.current) {
              selectionCountRef.current.textContent = `${selectedCommits.length || "No"} commits selected`;
            }

            // Only proceed if we have commits selected
            if (selectedCommits.length > 0) {
              // Highlight the dots
              d3.selectAll(".commit-circle")
                .filter((d) => isCommitSelected(selection, d))
                .classed("selected", true)
                .attr("fill", "#ff6b6b") // Highlight color
                .style("fill-opacity", 1);

              // Get all lines from selected commits
              const lines = selectedCommits.flatMap((d) => d.lines);

              // Update language breakdown
              if (languageBreakdownRef.current) {
                languageBreakdownRef.current.innerHTML = "";

                // Filter to relevant languages
                const breakdown = d3.rollup(
                  lines,
                  (v) => v.length,
                  (d) => d.type || "unknown"
                );

                const relevantTypes = ["jsx", "tsx", "js", "css"];
                const filteredBreakdown = Array.from(breakdown.entries())
                  .filter(([type]) =>
                    relevantTypes.includes(String(type).toLowerCase())
                  )
                  .sort((a, b) => b[1] - a[1]);

                // Show breakdown if we have data
                if (filteredBreakdown.length > 0) {
                  // Create container for horizontal display
                  const container = document.createElement("div");
                  container.className =
                    "language-breakdown-container flex flex-wrap gap-4 mt-2 justify-start";
                  languageBreakdownRef.current.appendChild(container);

                  // Add header as first item
                  const header = document.createElement("div");
                  header.className =
                    "language-breakdown-header self-center mr-2";
                  header.textContent = "Language Breakdown:";
                  container.appendChild(header);

                  // Calculate total for percentage
                  const totalLines = filteredBreakdown.reduce(
                    (sum, [, count]) => sum + count,
                    0
                  );

                  // Add each language as a horizontal item
                  filteredBreakdown.forEach(([language, count]) => {
                    const proportion = count / totalLines;
                    const formatted = d3.format(".1~%")(proportion);

                    const item = document.createElement("div");
                    item.className =
                      "language-item px-3 py-2 rounded-lg " +
                      (darkMode ? "bg-gray-700" : "bg-gray-100");

                    const langName = document.createElement("span");
                    langName.className = "font-medium";
                    langName.textContent = String(language).toUpperCase();

                    const langStats = document.createElement("span");
                    langStats.className = "ml-2 opacity-80";
                    langStats.textContent = `${count} (${formatted})`;

                    item.appendChild(langName);
                    item.appendChild(langStats);
                    container.appendChild(item);
                  });
                }
              }
            } else {
              // If no commits selected, clear the language breakdown
              if (languageBreakdownRef.current) {
                languageBreakdownRef.current.innerHTML = "";
              }
            }
          } else {
            // If no selection, reset display
            if (selectionCountRef.current) {
              selectionCountRef.current.textContent = "No commits selected";
            }
            if (languageBreakdownRef.current) {
              languageBreakdownRef.current.innerHTML = "";
            }
          }
        };

        // Create brush selector
        const createBrushSelector = (svg, usableArea) => {
          // Clear any existing brush
          svg.selectAll(".brush-container").remove();

          const brushGroup = svg.append("g").attr("class", "brush-container");

          // Create brush
          const brush = d3
            .brush()
            .extent([
              [usableArea.left, usableArea.top],
              [usableArea.right, usableArea.bottom],
            ])
            .on("start brush end", brushed);

          brushGroup.call(brush);

          // Make sure dots are above the brush overlay
          svg.selectAll(".dots").raise();
        };

        // Render scatter plot
        const renderScatterPlot = (data, commits) => {
          // Store commits in ref for access in other functions
          commitsRef.current = commits;

          // Clear the chart container
          d3.select(chartRef.current).html("");

          const chartWidth = chartRef.current.clientWidth || 800;
          const width = chartWidth;
          const height = 500;
          const margin = { top: 20, right: 30, bottom: 50, left: 60 };

          // Sort commits by size for better visibility (larger dots in the back)
          const sortedCommits = d3.sort(commits, (d) => -d.totalLines);

          // Define usable area
          const usableArea = {
            top: margin.top,
            right: width - margin.right,
            bottom: height - margin.bottom,
            left: margin.left,
            width: width - margin.left - margin.right,
            height: height - margin.top - margin.bottom,
          };

          // Create SVG
          const svg = d3
            .select(chartRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("overflow", "visible");

          // Group commits by year to identify time gap
          const commitsByYear = d3.group(commits, (d) =>
            d.datetime.getFullYear()
          );
          const years = Array.from(commitsByYear.keys()).sort();

          // Create scales
          xScale = d3
            .scaleTime()
            .domain(d3.extent(commits, (d) => d.datetime))
            .range([usableArea.left, usableArea.right])
            .nice();

          yScale = d3
            .scaleLinear()
            .domain([0, 24])
            .range([usableArea.bottom, usableArea.top]);

          // Create radius scale with square root for proper area perception
          const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
          rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([3, 15]);

          // Add gridlines
          const gridlines = svg
            .append("g")
            .attr("class", "gridlines")
            .attr("transform", `translate(${usableArea.left}, 0)`);

          gridlines.call(
            d3
              .axisLeft(yScale)
              .tickFormat("")
              .tickSize(-usableArea.width)
              .tickValues(d3.range(0, 25, 4)) // Every 4 hours
          );

          // Add a visual break if there's a significant time gap between commit groups
          if (years.length > 1 && years[years.length - 1] - years[0] > 1) {
            // Add a dashed line between years
            const midpointDate = new Date(
              (new Date(`${years[0]}-12-31`).getTime() +
                new Date(`${years[1]}-01-01`).getTime()) /
                2
            );

            svg
              .append("line")
              .attr("class", "time-break")
              .attr("x1", xScale(midpointDate))
              .attr("y1", usableArea.top)
              .attr("x2", xScale(midpointDate))
              .attr("y2", usableArea.bottom)
              .attr("stroke", darkMode ? "#6b7280" : "#9ca3af")
              .attr("stroke-width", 2)
              .attr("stroke-dasharray", "5,5");

            // Add a label for the time gap
            svg
              .append("text")
              .attr("class", "time-break-label")
              .attr("x", xScale(midpointDate))
              .attr("y", usableArea.top - 15)
              .attr("text-anchor", "middle")
              .attr("fill", darkMode ? "#e5e7eb" : "#4b5563")
              .text("Time Gap");
          }

          // Add dots - use black/white color for dots based on theme
          const dots = svg.append("g").attr("class", "dots");

          const dotColor = darkMode ? "#ffffff" : "#000000"; // White in dark mode, Black in light mode

          dots
            .selectAll("circle")
            .data(sortedCommits)
            .join("circle")
            .attr("class", "commit-circle")
            .attr("cx", (d) => xScale(d.datetime))
            .attr("cy", (d) => yScale(d.hourFrac))
            .attr("r", (d) => rScale(d.totalLines))
            .attr("fill", dotColor)
            .style("fill-opacity", 0.7)
            .on("mouseenter", (event, commit) => {
              // Check if commit has required data before showing tooltip
              if (!commit || !commit.datetime) return;

              // Highlight this dot
              d3.select(event.currentTarget)
                .style("fill-opacity", 1)
                .transition()
                .duration(200)
                .attr("r", (d) => rScale(d.totalLines) * 1.5);

              renderTooltipContent(commit);
              updateTooltipVisibility(true);
              updateTooltipPosition(event);
            })
            .on("mousemove", (event) => {
              updateTooltipPosition(event);
            })
            .on("mouseleave", (event) => {
              // Restore original size
              d3.select(event.currentTarget)
                .style("fill-opacity", () =>
                  d3.select(event.currentTarget).classed("selected") ? 1 : 0.7
                )
                .transition()
                .duration(200)
                .attr("r", (d) => rScale(d.totalLines));

              updateTooltipVisibility(false);
            });

          // Create and add the brush
          createBrushSelector(svg, usableArea);

          // Add axes
          const xAxis = d3.axisBottom(xScale);
          const yAxis = d3
            .axisLeft(yScale)
            .tickFormat((d) => String(d % 24).padStart(2, "0") + ":00")
            .tickValues(d3.range(0, 25, 4)); // Every 4 hours

          // Add X axis
          svg
            .append("g")
            .attr("transform", `translate(0, ${usableArea.bottom})`)
            .call(xAxis)
            .append("text")
            .attr("x", usableArea.left + usableArea.width / 2)
            .attr("y", 40)
            .attr("fill", darkMode ? "#e5e7eb" : "currentColor")
            .attr("text-anchor", "middle")
            .text("Date");

          // Add Y axis
          svg
            .append("g")
            .attr("transform", `translate(${usableArea.left}, 0)`)
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -usableArea.top - usableArea.height / 2)
            .attr("y", -40)
            .attr("fill", darkMode ? "#e5e7eb" : "currentColor")
            .attr("text-anchor", "middle")
            .text("Time of Day");

          // Add a legend for dot sizes
          const legendGroup = svg
            .append("g")
            .attr("class", "legend")
            .attr(
              "transform",
              `translate(${usableArea.right - 100}, ${usableArea.top + 20})`
            );

          legendGroup
            .append("text")
            .attr("x", 0)
            .attr("y", -10)
            .attr("text-anchor", "start")
            .attr("font-size", "12px")
            .attr("fill", darkMode ? "#e5e7eb" : "#4b5563")
            .text("Lines Changed");

          const sizes = [
            minLines,
            Math.round((minLines + maxLines) / 2),
            maxLines,
          ];

          sizes.forEach((size, i) => {
            legendGroup
              .append("circle")
              .attr("cx", 0)
              .attr("cy", i * 25)
              .attr("r", rScale(size))
              .attr("fill", dotColor)
              .attr("fill-opacity", 0.7);

            legendGroup
              .append("text")
              .attr("x", 20)
              .attr("y", i * 25 + 5)
              .attr("font-size", "12px")
              .attr("fill", darkMode ? "#e5e7eb" : "#4b5563")
              .text(size);
          });
        };

        // Load data and initialize visualization
        console.log("Starting data loading process...");
        const data = await loadData();
        dataRef.current = data; // Store for reference

        if (data?.length > 0) {
          console.log("Processing commits...");
          const commits = processCommits(data);
          console.log("Rendering visualization...");
          renderCommitInfo(data, commits);
          renderScatterPlot(data, commits);
        } else {
          console.error("No data loaded or empty dataset");

          // Show error message in chart
          if (chartRef.current) {
            d3.select(chartRef.current)
              .append("div")
              .attr("class", "error-message")
              .style("color", darkMode ? "#f87171" : "#ef4444")
              .style("padding", "2rem")
              .style("text-align", "center")
              .html(
                "<h3>Error Loading Data</h3><p>Could not load commit data. Please check if meta/loc.csv exists.</p>"
              );
          }
        }
      } catch (error) {
        console.error("Error in visualization:", error);
      }
    };

    // Run visualization immediately
    console.log("CommitGraph mounted, initializing visualization...");
    renderVisualization();

    // Set up a small delay to re-render after the component has fully mounted
    const timer = setTimeout(() => {
      if (containerRef.current && !dataRef.current) {
        console.log("Trying visualization again after delay...");
        renderVisualization();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [darkMode]); // Only depend on darkMode - we don't want to rerun the whole viz on every render

  // Update style when dark mode changes
  useEffect(() => {
    if (!containerRef.current) return;

    // Apply styling based on current theme
    const style = document.getElementById("commit-graph-styles");
    if (style) {
      style.remove(); // Remove existing style if present
    }

    const newStyle = document.createElement("style");
    newStyle.id = "commit-graph-styles";
    newStyle.textContent = `
      .commit-graph-container {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .commit-graph-container .stats {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 0.5rem 1.5rem;
        margin-bottom: 20px;
      }
      
      .commit-graph-container .stats dt {
        font-weight: 500;
        opacity: 0.8;
      }
      
      .commit-graph-container .stats dd {
        font-weight: 600;
      }
      
      .commit-graph-container .tooltip {
        position: fixed;
        background-color: ${darkMode ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)"};
        color: ${darkMode ? "#e5e7eb" : "#374151"};
        border-radius: 6px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        padding: 12px;
        border: 1px solid ${darkMode ? "#374151" : "#e5e7eb"};
        z-index: 1000;
        max-width: 300px;
        backdrop-filter: blur(5px);
        transition: opacity 300ms, visibility 300ms;
      }
      
      .commit-graph-container .tooltip dt {
        font-weight: 500;
        opacity: 0.8;
        font-size: 0.9rem;
      }
      
      .commit-graph-container .tooltip dd {
        margin-bottom: 8px;
        font-weight: 500;
      }
      
      .commit-graph-container .tooltip a {
        color: ${darkMode ? "#60a5fa" : "#3b82f6"};
        text-decoration: none;
      }
      
      .commit-graph-container .tooltip a:hover {
        text-decoration: underline;
      }
      
      .commit-graph-container .tooltip[hidden] {
        opacity: 0;
        visibility: hidden;
      }
      
      .commit-graph-container circle {
        transition: all 200ms;
        transform-origin: center;
        transform-box: fill-box;
        cursor: pointer;
      }
      
      .commit-graph-container circle.selected {
        fill: #ff6b6b !important;
      }
      
      .commit-graph-container .selection {
        fill-opacity: 0.1;
        stroke: ${darkMode ? "#e5e7eb" : "#1f2937"};
        stroke-opacity: 0.7;
        stroke-dasharray: 5 3;
        animation: marching-ants 2s linear infinite;
      }
      
      @keyframes marching-ants {
        to {
          stroke-dashoffset: -8;
        }
      }
      
      .commit-graph-container .selection-info {
        margin-top: 20px;
      }
      
      .commit-graph-container #selection-count {
        font-size: 1.1rem;
        font-weight: 500;
        margin-bottom: 10px;
      }
      
      .commit-graph-container .gridlines line {
        stroke: ${darkMode ? "#374151" : "#e5e7eb"};
        stroke-opacity: 0.7;
      }
      
      .commit-graph-container .language-breakdown-header {
        font-size: 1.1rem;
        font-weight: 600;
        color: ${darkMode ? "#e5e7eb" : "#374151"};
      }
      
      .commit-graph-container .language-breakdown-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 0.75rem;
        align-items: center;
      }
      
      .commit-graph-container .language-item {
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        background-color: ${darkMode ? "rgba(55, 65, 81, 0.7)" : "rgba(243, 244, 246, 0.7)"};
        font-size: 0.9rem;
        line-height: 1.2;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .commit-graph-container .language-item span {
        display: block;
      }
    `;
    document.head.appendChild(newStyle);

    return () => {
      if (newStyle && newStyle.parentNode) {
        newStyle.parentNode.removeChild(newStyle);
      }
    };
  }, [darkMode]);

  return (
    <div
      className={`w-full mt-16 mb-16 ${
        darkMode ? "text-white" : "text-gray-800"
      }`}
      ref={containerRef}
    >
      <div className="commit-graph-container">
        <h2 className={`text-center text-3xl font-bold mb-2`}>
          Portfolio Development Activity
        </h2>
        <p className="text-center text-lg mb-8">
          Tracking commits and development patterns for this personal portfolio
        </p>

        {/* Stats bar - horizontal instead of vertical */}
        <div
          ref={statsRef}
          className={`p-6 rounded-lg mb-8 ${
            darkMode
              ? "bg-gray-800/80 border border-gray-700"
              : "bg-white/80 border border-gray-200"
          }`}
        ></div>

        {/* Main chart section - now full width */}
        <div
          className={`p-6 rounded-lg ${
            darkMode
              ? "bg-gray-800/80 border border-gray-700"
              : "bg-white/80 border border-gray-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Commits by Time of Day</h3>
          <p className="mb-4 opacity-75">
            Drag to select commits and see language breakdown
          </p>
          <div ref={chartRef}></div>

          <dl ref={tooltipRef} className="tooltip" hidden>
            <dt>Commit</dt>
            <dd>
              <a href="" id="commit-link" target="_blank" rel="noreferrer"></a>
            </dd>
            <dt>Date</dt>
            <dd id="commit-date"></dd>
            <dt>Time</dt>
            <dd id="commit-time"></dd>
            <dt>Author</dt>
            <dd id="commit-author"></dd>
            <dt>Lines</dt>
            <dd id="commit-lines"></dd>
          </dl>

          <div className="selection-info mt-4">
            <p ref={selectionCountRef} id="selection-count">
              No commits selected
            </p>
            <dl ref={languageBreakdownRef} className="stats mt-2"></dl>
          </div>
        </div>
      </div>
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

      {/* Commit Graph after project cards - no animation wrapper */}
      <div className="mt-16">
        <h2 className={`${styles.sectionHeadText} text-center mb-6`}>
          Development Activity
        </h2>
        <CommitGraph />
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
