// Global variables for scales and data
let xScale, yScale, rScale;
let data, commits;
let svgChart;

// Load and process data
async function loadData() {
  const data = await d3.csv("loc.csv", (row) => ({
    ...row,
    line: Number(row.line),
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + "T00:00" + row.timezone),
    datetime: new Date(row.datetime),
  }));

  return data;
}

// Process commits from data
function processCommits(data) {
  return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;

      const ret = {
        id: commit,
        url: "https://github.com/anirudh9280/portfolio/commit/" + commit,
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
}

// Display summary statistics
function renderCommitInfo(data, commits) {
  // Create the dl element
  const dl = d3.select("#stats").append("dl").attr("class", "stats");

  // Add total LOC
  dl.append("dt").html('Total <abbr title="Lines of code">LOC</abbr>');
  dl.append("dd").text(data.length);

  // Add total commits
  dl.append("dt").text("Total commits");
  dl.append("dd").text(commits.length);

  // Add number of files
  const fileCount = d3.group(data, (d) => d.file).size;
  dl.append("dt").text("Number of files");
  dl.append("dd").text(fileCount);

  // Add average file length
  const fileLengths = d3.rollups(
    data,
    (v) => d3.max(v, (d) => d.line),
    (d) => d.file
  );
  const avgFileLength = Math.round(d3.mean(fileLengths, (d) => d[1]));
  dl.append("dt").text("Avg. file length");
  dl.append("dd").text(`${avgFileLength} lines`);

  // Add the longest file
  const longestFile = d3.greatest(fileLengths, (d) => d[1]);
  dl.append("dt").text("Longest file");
  dl.append("dd").text(`${longestFile[0]} (${longestFile[1]} lines)`);

  // Add average line length
  const avgLineLength = Math.round(d3.mean(data, (d) => d.length));
  dl.append("dt").text("Avg. line length");
  dl.append("dd").text(`${avgLineLength} chars`);
}

// Update tooltip content
function renderTooltipContent(commit) {
  const link = document.getElementById("commit-link");
  const date = document.getElementById("commit-date");
  const time = document.getElementById("commit-time");
  const author = document.getElementById("commit-author");
  const lines = document.getElementById("commit-lines");

  if (!commit) return;

  link.href = commit.url;
  link.textContent = commit.id.substring(0, 7);
  date.textContent = commit.datetime?.toLocaleString("en", {
    dateStyle: "full",
  });
  time.textContent = commit.datetime?.toLocaleString("en", {
    timeStyle: "short",
  });
  author.textContent = commit.author;
  lines.textContent = `${commit.totalLines} changed`;
}

// Update tooltip visibility
function updateTooltipVisibility(isVisible) {
  const tooltip = document.getElementById("commit-tooltip");
  tooltip.hidden = !isVisible;
}

// Update tooltip position
function updateTooltipPosition(event) {
  const tooltip = document.getElementById("commit-tooltip");
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
}

// Check if a commit is within brush selection
function isCommitSelected(selection, commit) {
  if (!selection) return false;

  const x = xScale(commit.datetime);
  const y = yScale(commit.hourFrac);

  return (
    x >= selection[0][0] &&
    x <= selection[1][0] &&
    y >= selection[0][1] &&
    y <= selection[1][1]
  );
}

// Render selection count
function renderSelectionCount(selection) {
  const selectedCommits = selection
    ? commits.filter((d) => isCommitSelected(selection, d))
    : [];

  const countElement = document.querySelector("#selection-count");
  countElement.textContent = `${selectedCommits.length || "No"} commits selected`;

  return selectedCommits;
}

// Render language breakdown from selected commits
function renderLanguageBreakdown(selection) {
  const selectedCommits = selection
    ? commits.filter((d) => isCommitSelected(selection, d))
    : [];
  const container = document.getElementById("language-breakdown");

  if (selectedCommits.length === 0) {
    container.innerHTML = "";
    return;
  }

  const lines = selectedCommits.flatMap((d) => d.lines);

  // Group by language/type
  const breakdown = d3.rollup(
    lines,
    (v) => v.length,
    (d) => d.type || "unknown"
  );

  // Sort by count
  const sortedBreakdown = Array.from(breakdown.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  // Update DOM with breakdown
  container.innerHTML = "";

  for (const [language, count] of sortedBreakdown) {
    const proportion = count / lines.length;
    const formatted = d3.format(".1~%")(proportion);

    const dt = document.createElement("dt");
    dt.textContent = language;

    const dd = document.createElement("dd");
    dd.textContent = `${count} lines (${formatted})`;

    container.appendChild(dt);
    container.appendChild(dd);
  }
}

// Handle brush events
function brushed(event) {
  const selection = event.selection;
  d3.selectAll("circle").classed("selected", (d) =>
    isCommitSelected(selection, d)
  );
  renderSelectionCount(selection);
  renderLanguageBreakdown(selection);
}

// Render the scatter plot
function renderScatterPlot(data, commits) {
  const width = 1000;
  const height = 400;
  const margin = { top: 10, right: 20, bottom: 50, left: 60 };

  // Sort commits by size for better visibility
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
  svgChart = d3
    .select("#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("overflow", "visible")
    .style("width", "100%")
    .style("height", "auto");

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

  // Add the brushing feature
  svgChart.call(
    d3
      .brush()
      .extent([
        [usableArea.left, usableArea.top],
        [usableArea.right, usableArea.bottom],
      ])
      .on("start brush end", brushed)
  );

  // Add gridlines
  const gridlines = svgChart
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

  // Add dots
  const dots = svgChart.append("g").attr("class", "dots");

  dots
    .selectAll("circle")
    .data(sortedCommits)
    .join("circle")
    .attr("cx", (d) => xScale(d.datetime))
    .attr("cy", (d) => yScale(d.hourFrac))
    .attr("r", (d) => rScale(d.totalLines))
    .attr("fill", (d) => {
      // Color based on time of day
      const hour = d.hourFrac;
      if (hour < 6) return "#1a365d"; // Night (00:00-06:00): Dark blue
      if (hour < 12) return "#3182ce"; // Morning (06:00-12:00): Blue
      if (hour < 18) return "#ed8936"; // Afternoon (12:00-18:00): Orange
      return "#805ad5"; // Evening (18:00-24:00): Purple
    })
    .style("fill-opacity", 0.7)
    .on("mouseenter", (event, commit) => {
      d3.select(event.currentTarget).style("fill-opacity", 1);
      renderTooltipContent(commit);
      updateTooltipVisibility(true);
      updateTooltipPosition(event);
    })
    .on("mousemove", (event) => {
      updateTooltipPosition(event);
    })
    .on("mouseleave", (event) => {
      d3.select(event.currentTarget).style("fill-opacity", 0.7);
      updateTooltipVisibility(false);
    });

  // Raise dots above the brush overlay
  svgChart.selectAll(".dots, .overlay ~ *").raise();

  // Add axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat((d) => String(d % 24).padStart(2, "0") + ":00")
    .tickValues(d3.range(0, 25, 4)); // Every 4 hours

  // Add X axis
  svgChart
    .append("g")
    .attr("transform", `translate(0, ${usableArea.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("x", usableArea.left + usableArea.width / 2)
    .attr("y", 40)
    .attr("fill", "currentColor")
    .attr("text-anchor", "middle")
    .text("Date");

  // Add Y axis
  svgChart
    .append("g")
    .attr("transform", `translate(${usableArea.left}, 0)`)
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -usableArea.top - usableArea.height / 2)
    .attr("y", -40)
    .attr("fill", "currentColor")
    .attr("text-anchor", "middle")
    .text("Time of Day");

  // Add a legend for dot sizes
  const legendGroup = svgChart
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
    .text("Lines Changed");

  const sizes = [minLines, Math.round((minLines + maxLines) / 2), maxLines];

  sizes.forEach((size, i) => {
    legendGroup
      .append("circle")
      .attr("cx", 0)
      .attr("cy", i * 25)
      .attr("r", rScale(size))
      .attr("fill", "#666")
      .attr("fill-opacity", 0.7);

    legendGroup
      .append("text")
      .attr("x", 20)
      .attr("y", i * 25 + 5)
      .attr("font-size", "12px")
      .text(size);
  });
}

// Initialize the visualization
async function init() {
  data = await loadData();
  commits = processCommits(data);

  renderCommitInfo(data, commits);
  renderScatterPlot(data, commits);
}

// Start the application
init();
