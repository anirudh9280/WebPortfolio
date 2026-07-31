import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

/**
 * The /analytics visualisation.
 *
 * Colours are CSS custom properties (`rgb(var(--accent))`, …) rather than
 * darkMode branches: an SVG attribute containing a var() resolves live, so the
 * plot follows the theme without re-running the whole render.
 *
 * Reads meta/loc.csv, which is a per-line `git blame`. That is a real
 * limitation, not a bug: a commit only appears here while at least one of its
 * lines survives in the current tree, so the commit count is always <= the
 * length of the git log. The labels below say so.
 */

// Viridis stops, the same ramp CommitScatter uses on the home page. Rotated
// for categorical use: assignment starts from the legible middle, because the
// darkest stop (#440154) disappears on the dark surface and the brightest
// (#FDE725) on the light one. There are three file types, so in practice only
// the first three are ever handed out.
const VIRIDIS = ["#3B528B", "#21918C", "#5EC962", "#440154", "#FDE725"];

// 24-hour ticks. The previous 12-hour formatter mapped BOTH hour 12 and hour
// 24 to "12 PM", so the axis printed "12 PM" twice; five ticks also beats the
// ~13 d3 chose by default on a 0..24 domain.
const HOUR_TICKS = [0, 6, 12, 18, 24];
const formatHour = (h) => `${String(h).padStart(2, "0")}:00`;

// The commits span years, so a bare "%b %d" was ambiguous. Multi-scale: show
// the clock only once the ticks are finer than a day.
const formatDate = (d) =>
  (d3.timeDay(d) < d ? d3.timeFormat("%H:%M") : d3.timeFormat("%b %d, %Y"))(
    d
  ).toUpperCase();

/**
 * Stat readouts. Hoisted so the initial render and the slider update cannot
 * drift apart -- they were two separate copies of the same builder before.
 */
const renderStats = (node, data, commits) => {
  if (!node) return;

  d3.select(node).html("");
  const grid = d3
    .select(node)
    .append("div")
    .attr(
      "class",
      "grid grid-cols-2 gap-px bg-line/10 sm:grid-cols-3 lg:grid-cols-5"
    );

  const addStat = (label, value, sub) => {
    const block = grid.append("div").attr("class", "bg-surface px-5 py-4");
    block.append("div").attr("class", "readout").text(label);
    block
      .append("div")
      .attr(
        "class",
        "readout-num mt-2 text-[22px] font-medium leading-none text-ink"
      )
      .text(value);
    if (sub) {
      block
        .append("div")
        .attr("class", "readout-num mt-2 truncate text-[11px] text-muted")
        .text(sub);
    }
  };

  addStat("Lines of code", data.length);
  // NOT the length of the git log -- see the note under this panel.
  addStat("Commits in blame", commits.length);
  addStat("Files tracked", d3.group(data, (d) => d.file).size);

  const fileLengths = d3.rollups(
    data,
    (v) => d3.max(v, (d) => d.line),
    (d) => d.file
  );
  const avgFileLength = Math.round(d3.mean(fileLengths, (d) => d[1]));
  addStat("Avg file length", avgFileLength, "lines");

  const longestFile = d3.greatest(fileLengths, (d) => d[1]);
  addStat("Longest file", longestFile[1], longestFile[0].split("/").pop());
};

const CommitGraph = () => {
  const containerRef = useRef(null);
  const statsRef = useRef(null);
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);
  const selectionCountRef = useRef(null);
  const languageBreakdownRef = useRef(null);
  const filesContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollStepsRef = useRef([]);

  // State for timeline slider
  const [commitProgress, setCommitProgress] = useState(100);
  const [commitMaxTime, setCommitMaxTime] = useState(null);
  const [filteredCommits, setFilteredCommits] = useState([]);
  const [scrollMode, setScrollMode] = useState(false);

  // Global variables for scales
  const xScaleRef = useRef(null);
  const yScaleRef = useRef(null);
  const rScaleRef = useRef(null);
  const dataRef = useRef(null);
  const commitsRef = useRef(null);
  const timeScaleRef = useRef(null);

  // Handle timeline slider change
  const handleTimeSliderChange = (value) => {
    setCommitProgress(value);
    if (timeScaleRef.current && commitsRef.current) {
      const newMaxTime = timeScaleRef.current.invert(value);
      setCommitMaxTime(newMaxTime);
      const filtered = commitsRef.current.filter(
        (d) => d.datetime <= newMaxTime
      );
      setFilteredCommits(filtered);
    }
  };

  // Update tooltip content
  const updateTooltip = (d) => {
    if (!tooltipRef.current) return;

    const commitElement = tooltipRef.current.querySelector("#commit-link");
    const dateElement = tooltipRef.current.querySelector("#commit-date");
    const timeElement = tooltipRef.current.querySelector("#commit-time");
    const authorElement = tooltipRef.current.querySelector("#commit-author");
    const linesElement = tooltipRef.current.querySelector("#commit-lines");

    if (commitElement) {
      commitElement.textContent = d.id.substring(0, 7);
      commitElement.href = d.url;
    }
    if (dateElement) {
      dateElement.textContent = d.datetime?.toLocaleString("en", {
        dateStyle: "full",
      });
    }
    if (timeElement) {
      timeElement.textContent = d.datetime?.toLocaleString("en", {
        timeStyle: "short",
      });
    }
    if (authorElement) authorElement.textContent = d.author;
    if (linesElement) linesElement.textContent = `${d.totalLines} changed`;
  };

  useEffect(() => {
    const renderVisualization = async () => {
      try {
        // Clear previous content
        if (statsRef.current) statsRef.current.innerHTML = "";
        if (chartRef.current) chartRef.current.innerHTML = "";
        if (languageBreakdownRef.current)
          languageBreakdownRef.current.innerHTML = "";

        // Load data from the CSV file generated by elocuent
        const loadData = async () => {
          try {
            const data = await d3.csv("/meta/loc.csv", (row) => ({
              ...row,
              line: Number(row.line),
              depth: Number(row.depth),
              length: Number(row.length),
              date: new Date(row.date + "T00:00" + row.timezone),
              datetime: new Date(row.datetime),
            }));

            return data;
          } catch (error) {
            console.error("Error loading CSV data:", error);
            return [];
          }
        };

        // Process commits from data
        const processCommits = (data) => {
          return d3
            .groups(data, (d) => d.commit)
            .map(([commit, lines]) => {
              let first = lines[0];
              let { author, date, time, timezone, datetime } = first;

              const ret = {
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

              // Store the lines array as a non-enumerable property
              Object.defineProperty(ret, "lines", {
                value: lines,
                enumerable: false,
                configurable: true,
                writable: true,
              });

              return ret;
            });
        };

        // Check if commit is within selection bounds
        const isCommitSelected = (selection, commit) => {
          if (!selection || !xScaleRef.current || !yScaleRef.current)
            return false;

          const x = xScaleRef.current(commit.datetime);
          const y = yScaleRef.current(commit.hourFrac);

          return (
            x >= selection[0][0] &&
            x <= selection[1][0] &&
            y >= selection[0][1] &&
            y <= selection[1][1]
          );
        };

        // Brush event handler
        const brushed = (event) => {
          const selection = event.selection;

          // Reset all circles to original color and opacity
          d3.selectAll(".commit-circle")
            .classed("selected", false)
            .attr("fill", "rgb(var(--accent))")
            .style("fill-opacity", 0.7)
            .style("stroke", "rgb(var(--accent))");

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
              // Highlight selected commits
              d3.selectAll(".commit-circle")
                .filter((d) => isCommitSelected(selection, d))
                .classed("selected", true)
                .attr("fill", "rgb(var(--signal))")
                .style("fill-opacity", 1)
                .style("stroke", "rgb(var(--signal))");

              // Generate language breakdown for selected commits
              if (languageBreakdownRef.current) {
                languageBreakdownRef.current.innerHTML = "";

                // Get all lines from selected commits
                const allSelectedLines = selectedCommits.flatMap(
                  (commit) => commit.lines
                );

                // Create language breakdown
                const languageBreakdown = d3.rollup(
                  allSelectedLines,
                  (v) => v.length,
                  (d) => d.type || "unknown"
                );

                // Convert to array and sort by count
                const filteredBreakdown = Array.from(
                  languageBreakdown.entries()
                )
                  .filter(([language]) => language && language !== "")
                  .sort(([, a], [, b]) => b - a);

                if (filteredBreakdown.length > 0) {
                  // Create container for horizontal display
                  const container = document.createElement("div");
                  container.className =
                    "language-breakdown-container flex flex-wrap items-center gap-2";
                  languageBreakdownRef.current.appendChild(container);

                  // Add header as first item
                  const header = document.createElement("div");
                  header.className = "readout mr-1";
                  header.textContent = "Language mix";
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
                      "rounded-chip border border-line/12 bg-surface-2 px-2.5 py-1.5";

                    const langName = document.createElement("span");
                    langName.className =
                      "font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink";
                    langName.textContent = String(language).toUpperCase();

                    const langStats = document.createElement("span");
                    langStats.className =
                      "readout-num ml-2 text-[11px] text-muted";
                    langStats.textContent = `${count} (${formatted})`;

                    item.appendChild(langName);
                    item.appendChild(langStats);
                    container.appendChild(item);
                  });
                }
              }
            }
          } else {
            // No selection - reset count and clear language breakdown
            if (selectionCountRef.current) {
              selectionCountRef.current.textContent = "No commits selected";
            }
            if (languageBreakdownRef.current) {
              languageBreakdownRef.current.innerHTML = "";
            }
          }
        };

        // Load and process data
        const data = await loadData();
        dataRef.current = data;

        if (data.length === 0) {
          if (statsRef.current) {
            statsRef.current.innerHTML = `
              <div class="px-5 py-6">
                <p class="font-display text-[18px] font-bold text-ink">No commit data available</p>
                <p class="mt-2 text-[14px] text-muted">Unable to load repository commit history</p>
              </div>
            `;
          }
          return;
        }

        const commits = processCommits(data);
        commitsRef.current = commits;

        // Create time scale for the slider
        const [minDate, maxDate] = d3.extent(commits, (d) => d.datetime);
        timeScaleRef.current = d3
          .scaleTime()
          .domain([minDate, maxDate])
          .range([0, 100]);

        // Initialize filtered commits and max time
        if (!commitMaxTime) {
          setCommitMaxTime(maxDate);
          setFilteredCommits(commits);
        }

        // Render basic stats
        renderStats(statsRef.current, data, filteredCommits);

        // Set up visualization dimensions. Measured from the chart slot rather
        // than the outer container, which is wider by the panel padding and
        // used to push the SVG past the panel's right edge.
        // right leaves room for the largest dot's radius at the domain edge.
        const margin = { top: 24, right: 40, bottom: 58, left: 68 };
        const width = Math.max(
          720,
          chartRef.current?.clientWidth ||
            containerRef.current?.clientWidth ||
            800
        );
        const height = 480;

        const usableArea = {
          left: margin.left,
          right: width - margin.right,
          top: margin.top,
          bottom: height - margin.bottom,
          width: width - margin.left - margin.right,
          height: height - margin.top - margin.bottom,
        };

        // Clear and create SVG
        d3.select(chartRef.current).selectAll("*").remove();
        const svg = d3
          .select(chartRef.current)
          .append("svg")
          .attr("width", width)
          .attr("height", height);

        // Set up scales
        xScaleRef.current = d3
          .scaleTime()
          .domain([minDate, maxDate])
          .range([usableArea.left, usableArea.right])
          .nice();

        yScaleRef.current = d3
          .scaleLinear()
          .domain([0, 24])
          .range([usableArea.bottom, usableArea.top]);

        const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
        rScaleRef.current = d3
          .scaleSqrt()
          .domain([minLines, maxLines])
          .range([3, 15]);

        // Create brush
        const brush = d3
          .brush()
          .extent([
            [usableArea.left, usableArea.top],
            [usableArea.right, usableArea.bottom],
          ])
          .on("brush end", brushed);

        // Add brush to SVG
        svg.append("g").attr("class", "brush").call(brush);

        // Add gridlines -- on the same hours the axis labels, so a line always
        // has a number next to it.
        const gridlines = svg
          .append("g")
          .attr("class", "gridlines")
          .attr("transform", `translate(${usableArea.left}, 0)`);

        gridlines.call(
          d3
            .axisLeft(yScaleRef.current)
            .tickFormat("")
            .tickSize(-usableArea.width)
            .tickValues(HOUR_TICKS)
        );

        // Add axes
        const xAxis = d3
          .axisBottom(xScaleRef.current)
          .ticks(5)
          .tickFormat(formatDate);
        const yAxis = d3
          .axisLeft(yScaleRef.current)
          .tickValues(HOUR_TICKS)
          .tickFormat(formatHour);

        // Add X axis
        svg
          .append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0, ${usableArea.bottom})`)
          .call(xAxis)
          .append("text")
          .attr("class", "axis-title")
          .attr("x", usableArea.left + usableArea.width / 2)
          .attr("y", 42)
          .attr("text-anchor", "middle")
          .text("Commit date");

        // Add Y axis
        svg
          .append("g")
          .attr("class", "y-axis")
          .attr("transform", `translate(${usableArea.left}, 0)`)
          .call(yAxis)
          .append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .attr("x", -usableArea.top - usableArea.height / 2)
          .attr("y", -50)
          .attr("text-anchor", "middle")
          .text("Time of day");

        // Sort commits by size for better visibility
        const sortedCommits = d3.sort(filteredCommits, (d) => -d.totalLines);

        // Add circles for commits
        svg
          .selectAll(".commit-circle")
          .data(sortedCommits, (d) => d.id) // Add key function for stable transitions
          .enter()
          .append("circle")
          .attr("class", "commit-circle")
          .attr("cx", (d) => xScaleRef.current(d.datetime))
          .attr("cy", (d) => yScaleRef.current(d.hourFrac))
          .attr("r", (d) => rScaleRef.current(d.totalLines))
          .attr("fill", "rgb(var(--accent))")
          .style("fill-opacity", 0.7)
          .style("stroke", "rgb(var(--accent))")
          .style("stroke-width", 1)
          .style("cursor", "pointer")
          .on("mouseover", function (event, d) {
            // Show tooltip
            if (tooltipRef.current) {
              updateTooltip(d);
              tooltipRef.current.hidden = false;
              const tooltip = d3.select(tooltipRef.current);
              tooltip
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 10 + "px");
            }

            // Highlight circle
            d3.select(this).style("fill-opacity", 1).style("stroke-width", 2);
          })
          .on("mousemove", function (event) {
            if (tooltipRef.current) {
              const tooltip = d3.select(tooltipRef.current);
              tooltip
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 10 + "px");
            }
          })
          .on("mouseout", function () {
            // Hide tooltip
            if (tooltipRef.current) {
              tooltipRef.current.hidden = true;
            }

            // Reset circle appearance (unless it's selected)
            if (!d3.select(this).classed("selected")) {
              d3.select(this)
                .style("fill-opacity", 0.7)
                .style("stroke-width", 1);
            }
          })
          .on("click", function (event, d) {
            window.open(d.url, "_blank");
          });

        // Raise dots above the brush overlay
        svg.selectAll(".commit-circle").raise();
      } catch (error) {
        console.error("Error in renderVisualization:", error);
        if (statsRef.current) {
          statsRef.current.innerHTML = `
            <div class="px-5 py-6">
              <p class="font-display text-[18px] font-bold text-ink">Error loading visualization</p>
              <p class="mt-2 text-[14px] text-muted">${error.message}</p>
            </div>
          `;
        }
      }
    };

    renderVisualization();

    // Scoped styles for the things React does not own: the d3 axes, the brush
    // overlay, the tooltip and the range input's shadow-DOM parts. Every colour
    // is a token, so this block is written once and follows the theme.
    const newStyle = document.createElement("style");
    newStyle.textContent = `
      .commit-graph-container .tooltip {
        position: absolute;
        background: rgb(var(--surface));
        border: 1px solid rgb(var(--grid) / 0.14);
        border-radius: 4px;
        padding: 12px 14px;
        font-size: 12px;
        pointer-events: none;
        z-index: 1000;
        color: rgb(var(--ink));
        display: grid;
        grid-template-columns: auto auto;
        gap: 4px 16px;
        align-items: baseline;
      }

      /* display:grid above out-specifies the UA's [hidden] rule, so restate it. */
      .commit-graph-container .tooltip[hidden] {
        display: none;
      }

      .commit-graph-container .tooltip dt {
        font-family: "IBM Plex Mono", ui-monospace, monospace;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgb(var(--muted));
      }

      .commit-graph-container .tooltip dd {
        font-family: "IBM Plex Mono", ui-monospace, monospace;
        font-variant-numeric: tabular-nums;
        font-size: 11px;
        margin: 0;
        color: rgb(var(--ink));
        text-align: right;
      }

      .commit-graph-container .tooltip a {
        color: rgb(var(--accent));
        text-decoration: none;
      }

      /* d3 axes: mono ticks, hairline domain and tick marks. */
      .commit-graph-container .x-axis text,
      .commit-graph-container .y-axis text {
        fill: rgb(var(--muted));
        font-family: "IBM Plex Mono", ui-monospace, monospace;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.1em;
      }

      .commit-graph-container .x-axis .domain,
      .commit-graph-container .y-axis .domain,
      .commit-graph-container .x-axis .tick line,
      .commit-graph-container .y-axis .tick line {
        stroke: rgb(var(--grid) / 0.2);
      }

      .commit-graph-container .x-axis text.axis-title,
      .commit-graph-container .y-axis text.axis-title {
        font-size: 11px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      .commit-graph-container .gridlines line {
        stroke: rgb(var(--grid) / 0.14);
      }

      .commit-graph-container .gridlines path {
        display: none;
      }

      .commit-graph-container .brush .selection {
        fill: rgb(var(--accent));
        fill-opacity: 0.08;
        stroke: rgb(var(--accent));
        stroke-opacity: 0.6;
        stroke-dasharray: 4 3;
      }

      /* Range input: a hairline rail with a square thumb, to match the
         instrument vernacular rather than the default pill. */
      .commit-graph-container input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        height: 2px;
        background: rgb(var(--grid) / 0.2);
        border-radius: 0;
        outline: none;
        cursor: pointer;
      }

      .commit-graph-container input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        background: rgb(var(--accent));
        border-radius: 2px;
        cursor: pointer;
        transition: box-shadow 0.2s ease;
      }

      .commit-graph-container input[type="range"]::-webkit-slider-thumb:hover {
        box-shadow: 0 0 0 6px rgb(var(--accent) / 0.16);
      }

      .commit-graph-container input[type="range"]::-moz-range-thumb {
        width: 12px;
        height: 12px;
        background: rgb(var(--accent));
        border-radius: 2px;
        cursor: pointer;
        border: none;
        transition: box-shadow 0.2s ease;
      }

      .commit-graph-container input[type="range"]::-moz-range-thumb:hover {
        box-shadow: 0 0 0 6px rgb(var(--accent) / 0.16);
      }

      /* Entry animation for circles */
      @starting-style {
        .commit-circle {
          r: 0;
        }
      }

      .commit-circle {
        transition: all 200ms, r calc(var(--r) * 50ms);
      }
    `;
    document.head.appendChild(newStyle);

    return () => {
      if (newStyle && newStyle.parentNode) {
        newStyle.parentNode.removeChild(newStyle);
      }
    };
    // Mount-only on purpose. This effect loads the CSV and builds the whole D3
    // scene once; it reads filteredCommits/commitMaxTime for the initial draw
    // only. Adding them as dependencies would re-run the fetch and rebuild
    // every scale and axis on every slider tick. Subsequent updates are handled
    // by the redraw effect below, which does list them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update visualization when filtered commits change
  useEffect(() => {
    if (filteredCommits.length === 0 || !dataRef.current || !xScaleRef.current)
      return;

    // Update stats
    renderStats(statsRef.current, dataRef.current, filteredCommits);

    // Update scatter plot
    const svg = d3.select(chartRef.current).select("svg");
    if (!svg.node()) return;

    // Update x-axis domain
    const [minDate, maxDate] = d3.extent(filteredCommits, (d) => d.datetime);
    xScaleRef.current.domain([minDate, maxDate]);

    // Update x-axis
    const xAxis = d3
      .axisBottom(xScaleRef.current)
      .ticks(5)
      .tickFormat(formatDate);
    svg.select(".x-axis").transition().duration(500).call(xAxis);

    // Update radius scale
    const [minLines, maxLines] = d3.extent(
      filteredCommits,
      (d) => d.totalLines
    );
    const rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([3, 15]);

    // Sort commits by size
    const sortedCommits = d3.sort(filteredCommits, (d) => -d.totalLines);

    // Update circles with transitions
    svg
      .selectAll(".commit-circle")
      .data(sortedCommits, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "commit-circle")
            .attr("cx", (d) => xScaleRef.current(d.datetime))
            .attr("cy", (d) => yScaleRef.current(d.hourFrac))
            .attr("r", 0)
            .attr("fill", "rgb(var(--accent))")
            .style("fill-opacity", 0.7)
            .style("stroke", "rgb(var(--accent))")
            .style("stroke-width", 1)
            .style("cursor", "pointer")
            .call((enter) =>
              enter
                .transition()
                .duration(500)
                .attr("r", (d) => rScale(d.totalLines))
            ),
        (update) =>
          update
            .transition()
            .duration(500)
            .attr("cx", (d) => xScaleRef.current(d.datetime))
            .attr("r", (d) => rScale(d.totalLines)),
        (exit) => exit.transition().duration(500).attr("r", 0).remove()
      )
      .on("mouseover", function (event, d) {
        if (tooltipRef.current) {
          updateTooltip(d);
          tooltipRef.current.hidden = false;
          const tooltip = d3.select(tooltipRef.current);
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px");
        }
        d3.select(this).style("fill-opacity", 1).style("stroke-width", 2);
      })
      .on("mousemove", function (event) {
        if (tooltipRef.current) {
          const tooltip = d3.select(tooltipRef.current);
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px");
        }
      })
      .on("mouseout", function () {
        if (tooltipRef.current) {
          tooltipRef.current.hidden = true;
        }
        if (!d3.select(this).classed("selected")) {
          d3.select(this).style("fill-opacity", 0.7).style("stroke-width", 1);
        }
      })
      .on("click", function (event, d) {
        window.open(d.url, "_blank");
      });

    // Ensure dots are above brush
    svg.selectAll(".commit-circle").raise();

    // Update file visualization
    if (filesContainerRef.current) {
      const lines = filteredCommits.flatMap((d) => d.lines);
      const files = d3
        .groups(lines, (d) => d.file)
        .map(([name, lines]) => ({ name, lines }))
        .sort((a, b) => b.lines.length - a.lines.length);

      // Create ordinal color scale for file types
      const colors = d3.scaleOrdinal(VIRIDIS);

      // Update file display
      const filesContainer = d3
        .select(filesContainerRef.current)
        .selectAll("div.file-item")
        .data(files, (d) => d.name)
        .join(
          (enter) =>
            enter
              .append("div")
              .attr(
                "class",
                "file-item grid grid-cols-[minmax(0,1fr)_3fr] items-start gap-5 border-b border-line/10 py-3 last:border-b-0"
              )
              .call((div) => {
                div
                  .append("div")
                  .attr("class", "file-info min-w-0")
                  .call((info) => {
                    info
                      .append("code")
                      .attr(
                        "class",
                        "block break-all font-mono text-[11px] leading-[1.5] text-ink"
                      );
                    info
                      .append("small")
                      .attr(
                        "class",
                        "readout-num mt-1 block text-[10px] text-muted"
                      );
                  });
                div
                  .append("div")
                  .attr(
                    "class",
                    "file-lines flex flex-wrap items-start gap-[0.15em]"
                  );
              }),
          (update) => update,
          (exit) => exit.remove()
        );

      // Update file names and line counts
      filesContainer.select(".file-info code").text((d) => d.name);
      filesContainer
        .select(".file-info small")
        .text((d) => `${d.lines.length} lines`);

      // Update dots for each line
      filesContainer.each(function (fileData) {
        d3.select(this)
          .select(".file-lines")
          .selectAll("div.loc")
          .data(fileData.lines)
          .join("div")
          .attr("class", "loc")
          .style("width", "0.45em")
          .style("height", "0.45em")
          .style("background", (d) => colors(d.type || "unknown"))
          .style("border-radius", "50%");
      });
    }
  }, [filteredCommits]);

  // Set up scrollytelling with Intersection Observer
  useEffect(() => {
    if (!scrollMode || !commitsRef.current || !timeScaleRef.current) return;

    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const commitData = entry.target.__commitData;
          if (commitData) {
            // Update progress based on the commit's datetime
            const progress = timeScaleRef.current(commitData.datetime);
            setCommitProgress(progress);
            handleTimeSliderChange(progress);
          }
        }
      });
    }, observerOptions);

    // Snapshot the ref: by cleanup time scrollStepsRef.current may point at a
    // different array, which would leave the original nodes observed.
    const steps = scrollStepsRef.current;
    steps.forEach((step) => {
      if (step) observer.observe(step);
    });

    return () => {
      steps.forEach((step) => {
        if (step) observer.unobserve(step);
      });
      observer.disconnect();
    };
    // commitsRef.current used to be listed here, but mutating a ref does not
    // re-render so it never did anything. scrollMode is what actually remounts
    // the steps this observer watches.
  }, [scrollMode]);

  return (
    <div className="w-full text-ink" ref={containerRef}>
      <div className="commit-graph-container space-y-8">
        {/* Timeline slider */}
        {commitMaxTime && (
          <div className="rounded-panel border border-line/12 bg-surface px-5 py-4">
            <label className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="readout shrink-0">Show commits until</span>
              <input
                type="range"
                min="0"
                max="100"
                value={commitProgress}
                onChange={(e) => handleTimeSliderChange(e.target.value)}
                className="min-w-[140px] flex-1"
                id="commit-progress"
              />
              <time className="readout-num shrink-0 text-[12px] font-medium text-ink">
                {commitMaxTime.toLocaleString("en", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </time>
            </label>
          </div>
        )}

        {/* Stat readouts */}
        <div className="overflow-hidden rounded-panel border border-line/12 bg-surface">
          <div ref={statsRef}></div>
          <p className="border-t border-line/10 px-5 py-3.5 text-[12px] leading-[1.7] text-muted">
            Read from a per-line{" "}
            <span className="font-mono text-ink">git blame</span> of the tracked
            tree, so a commit is counted only while at least one of its lines
            still survives in the current code. The full history is longer than
            the figure above, because the home page reads the complete git log
            instead.
          </p>
        </div>

        {/* Main chart section */}
        <div className="rounded-panel border border-line/12 bg-surface p-6">
          <div className="flex items-center gap-4">
            <h3 className="readout shrink-0">Commits by time of day</h3>
            <span className="panel-rule" aria-hidden="true" />
            <span className="readout readout-num shrink-0 normal-case tracking-[0.1em]">
              {filteredCommits.length} plotted
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-[14px] leading-[1.7] text-muted">
            Each dot is one commit, placed by date and local clock time and
            sized by how many lines it left behind. Drag across the plot to
            select a range and read its language mix; click a dot to open the
            commit on GitHub.
          </p>

          <div ref={chartRef} className="mt-6 overflow-x-auto"></div>

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

          <div className="selection-info mt-6 border-t border-line/10 pt-4">
            <p ref={selectionCountRef} id="selection-count" className="readout">
              No commits selected
            </p>
            <dl ref={languageBreakdownRef} className="stats mt-3"></dl>
          </div>
        </div>

        {/* File visualization section */}
        {filteredCommits.length > 0 && (
          <div className="rounded-panel border border-line/12 bg-surface p-6">
            <div className="flex items-center gap-4">
              <h3 className="readout shrink-0">Lines by file</h3>
              <span className="panel-rule" aria-hidden="true" />
              <span className="readout readout-num shrink-0 normal-case tracking-[0.1em]">
                {filteredCommits.flatMap((c) => c.lines).length} lines
              </span>
            </div>

            <p className="mt-4 max-w-2xl text-[14px] leading-[1.7] text-muted">
              Every surviving line from the visible commits, one dot per line,
              coloured by file type and ordered longest file first.
            </p>

            <div
              ref={filesContainerRef}
              className="mt-6 max-h-96 overflow-y-auto pr-1"
            ></div>
          </div>
        )}

        {/* Scrollytelling section */}
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setScrollMode(!scrollMode)}
              className="rounded-panel bg-accent px-5 py-2.5 font-mono text-[12px] font-medium uppercase tracking-readout text-on-accent transition-opacity hover:opacity-90"
            >
              {scrollMode ? "Exit story mode" : "Enter story mode"}
            </button>
            {scrollMode && (
              <p className="text-[13px] text-muted">
                Scroll to walk the repository forward one commit at a time.
              </p>
            )}
          </div>

          {scrollMode && (
            <div className="relative mt-10 flex gap-8" ref={scrollContainerRef}>
              {/* Story content on the left */}
              <div className="flex-1 space-y-[50vh]">
                {commitsRef.current &&
                  commitsRef.current.map((commit, i) => (
                    <div
                      key={commit.id}
                      ref={(el) => {
                        scrollStepsRef.current[i] = el;
                        if (el) el.__commitData = commit;
                      }}
                      className="rounded-panel border border-line/12 bg-surface p-6"
                    >
                      <time className="readout readout-num block normal-case tracking-[0.1em]">
                        {commit.datetime.toLocaleString("en", {
                          dateStyle: "long",
                          timeStyle: "short",
                        })}
                      </time>
                      <p className="mt-3 text-[15px] leading-[1.7] text-muted">
                        {i > 0 ? "Commit" : "First commit"}{" "}
                        <a
                          href={commit.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[13px] text-accent underline underline-offset-2"
                        >
                          {commit.id.substring(0, 7)}
                        </a>{" "}
                        left{" "}
                        <span className="readout-num font-medium text-ink">
                          {commit.totalLines}
                        </span>{" "}
                        lines still in the tree, across{" "}
                        <span className="readout-num font-medium text-ink">
                          {
                            d3.rollups(
                              commit.lines,
                              (D) => D.length,
                              (d) => d.file
                            ).length
                          }
                        </span>{" "}
                        files.
                      </p>
                    </div>
                  ))}
              </div>

              {/* Fixed visualization on the right */}
              <div className="sticky top-20 h-[80vh] flex-1">
                <div className="h-full overflow-hidden rounded-panel border border-line/12 bg-surface p-5">
                  <div className="flex items-center gap-4">
                    <h4 className="readout shrink-0">
                      Repository at this point
                    </h4>
                    <span className="panel-rule" aria-hidden="true" />
                  </div>
                  <div className="readout-num mt-3 text-[12px] text-muted">
                    {filteredCommits.length} commits ·{" "}
                    {filteredCommits.flatMap((c) => c.lines).length} lines
                  </div>

                  {/* File visualization */}
                  <div className="mt-4 h-[calc(100%-6rem)] overflow-y-auto pr-1">
                    {(() => {
                      const lines = filteredCommits.flatMap((d) => d.lines);
                      const files = d3
                        .groups(lines, (d) => d.file)
                        .map(([name, lines]) => ({ name, lines }))
                        .sort((a, b) => b.lines.length - a.lines.length);

                      const colors = d3.scaleOrdinal(VIRIDIS);

                      return files.map((file) => (
                        <div
                          key={file.name}
                          className="grid grid-cols-[minmax(0,1fr)_3fr] items-start gap-4 border-b border-line/10 py-3 last:border-b-0"
                        >
                          <div className="file-info min-w-0">
                            <code className="block break-all font-mono text-[10px] leading-[1.5] text-ink">
                              {file.name}
                            </code>
                            <small className="readout-num mt-1 block text-[10px] text-muted">
                              {file.lines.length} lines
                            </small>
                          </div>
                          <div className="file-lines flex flex-wrap items-start gap-[0.15em]">
                            {file.lines.map((line, i) => (
                              <div
                                key={`${file.name}-${i}`}
                                className="loc"
                                style={{
                                  width: "0.45em",
                                  height: "0.45em",
                                  background: colors(line.type || "unknown"),
                                  borderRadius: "50%",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommitGraph;
