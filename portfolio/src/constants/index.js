import {
  tse,
  evgo,
  ucsdlogo,
  ds3,
  hemut,
  narvar,
  salk,
} from "../assets";

export const navLinks = [
  { id: "about", title: "About" },
  { id: "work", title: "Experience" },
  { id: "skills", title: "Skills" },
  { id: "projects", title: "Projects" },
  { id: "contact", title: "Contact" },
];

// What the work actually is, stated plainly. Rendered as mono chips.
export const focusAreas = [
  "Computer vision",
  "Data engineering",
  "Machine learning",
  "Full-stack",
];

// Newest first. `current` drives the signal dot; `location` and `metrics`
// feed the mono readout on each card.
export const experiences = [
  {
    title: "Data Engineer Intern",
    company_name: "Narvar",
    icon: narvar,
    iconBg: "#1C1832",
    date: "Jul 2026 — Sep 2026",
    location: "San Mateo, CA",
    current: true,
    website: "https://corp.narvar.com/",
    points: [
      "Engineered a Python/Airflow pipeline ingesting Rocketlane API transcripts and metadata into BigQuery with rate-limit handling, pagination, and incremental CDC loads across 10+ tables",
      "Built cohort retention analytics in BigQuery/SQL quantifying GRR/NRR across 10 vintages and 5+ cross-cuts, surfacing churn and multi-product stickiness signals from Salesforce and ChurnZero",
      "Deployed a self-serve Hex semantic layer on BigQuery, cutting stakeholder SQL dependency with endorsed models and dashboards validated against Metabase",
    ],
  },
  {
    title: "Computer Vision Undergraduate Researcher",
    company_name: "Talmo Lab — Salk Institute",
    icon: salk,
    iconBg: "#1C1832",
    date: "May 2026 — Present",
    location: "La Jolla, CA",
    current: true,
    website: "https://talmolab.org/",
    points: [
      "Trained and evaluated a U-Net CNN keypoint-estimation model end-to-end in PyTorch (sleap-nn) on an RTX A5000 GPU, benchmarking at 4.15 px mean landmark error and 0.186 val mOKS",
      "Analyzed a U-Net receptive-field sweep (max stride 8→64) across 7 Weights & Biases runs, documenting a ~1.5–1.7× accuracy spread in localization error (dist 0.99–2.08 px) and flagging a mis-calibrated OKS metric",
      "Committed the CNN reference baseline as network-free JSON fixtures, growing the test suite 65→84 tests (+29%) so model-performance numbers are locked against silent drift in CI",
    ],
  },
  {
    title: "Data Engineer Intern",
    company_name: "EVgo",
    icon: evgo,
    iconBg: "#1C1832",
    date: "Jun 2025 — Aug 2025",
    location: "El Segundo, CA",
    website: "https://evgo.com/",
    points: [
      "Refactored a legacy pipeline to TypeScript, automating Snowflake-to-AWS S3 revenue reports and building an internal UI to view or generate reports on demand",
      "Built a Snowflake stored procedure that reduced manual filtering by 95% by flagging Tesla charging sessions and routing entries into a dedicated analysis table",
      "Built an ELT pipeline with an S3 event listener to parse incoming CSVs and load data into Snowflake tables",
    ],
  },
  {
    title: "Software Developer",
    company_name: "Triton Software Engineering",
    icon: tse,
    iconBg: "#1C1832",
    date: "Dec 2024 — Present",
    location: "La Jolla, CA",
    current: true,
    website: "https://tritonse.github.io/",
    points: [
      "Built scalable apps for nonprofits using React Native, Expo, Express.js, MongoDB, and TailwindCSS, containerized with Docker and tested via Postman",
      "Shipped CRED, a reentry-services site and applicant intake portal for a San Diego nonprofit, and SpayLA, an advocacy site with a newsletter CMS",
      "Followed Agile methodologies to simulate professional development, ensuring efficient team collaboration",
    ],
  },
  {
    title: "Assistant Project Director & Software Developer",
    company_name: "Data Science Student Alliance, UCSD",
    icon: ds3,
    iconBg: "#1C1832",
    date: "Nov 2024 — Present",
    location: "La Jolla, CA",
    current: true,
    website: "https://ds3ucsd.com/",
    points: [
      "Led 12+ data science projects, mentoring teams on AI model optimization",
      "Matched project ideas with teams based on expertise and organized showcases and workshops",
      "Enhanced the DS3 website using Svelte and MongoDB, boosting user engagement and backend performance",
    ],
  },
  {
    title: "Software Engineering Intern",
    company_name: "Hemut",
    icon: hemut,
    iconBg: "#1C1832",
    date: "Dec 2024 — Mar 2025",
    location: "Los Angeles, CA",
    website: "https://www.hemut.com/",
    points: [
      "Integrated real-time API fuel-price data and applied the A* algorithm with an admissible heuristic to compute optimal trucking routes by cost and distance",
      "Built a graph structure mapping stops and fueling stations with cost and distance weights",
    ],
  },
  {
    title: "Full-Stack Undergraduate Researcher",
    company_name: "Sensory Communication Lab, UCSD",
    icon: ucsdlogo,
    iconBg: "#1C1832",
    date: "Aug 2024 — Jul 2025",
    location: "La Jolla, CA",
    website: "https://listeningtowaves.com/",
    points: [
      "Developed an interactive Spectrogram tool using React, enabling real-time frequency visualization and generation",
      "Trained TensorFlow hand-pose models with 92% accuracy in gesture recognition for webcam-based interaction",
      "Developed MFlow, an audio interface built with Howler.js and ReactFlow for processing and visualization",
    ],
    links: [
      { label: "spectrogram", href: "https://spectrogram.sciencemusic.org/" },
      { label: "mflow", href: "https://mflow.sciencemusic.org/" },
    ],
  },
];
