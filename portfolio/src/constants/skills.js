/**
 * Skills marquee data.
 *
 * `icon` values are React component *references* from react-icons. This file
 * contains no JSX, so it stays a plain .js module. It is imported only by
 * SkillsMarquee.jsx -- keeping it out of constants/index.js means the 5MB
 * pre-bundled simple-icons dep chunk doesn't become a transitive dependency of
 * every component during dev.
 *
 * Colour contract:
 *   color     -- LIGHT mode. Must clear ~3:1 against the #FAFAF8 ground.
 *   colorDark -- DARK mode. Optional, falls back to `color`.
 *                Must clear ~4:1 against the #131024 ground.
 * Several brand hexes fail on one background: #000 (Next.js, Express,
 * Three.js) vanishes on dark; #F7DF1E (JavaScript), #61DAFB (React) and
 * #FFBE00 (W&B) vanish on light. Those carry both values.
 *
 * Name traps in react-icons v5, all verified against the installed package:
 * SiJavascript / SiTypescript are lowercase-s, CSS is SiCss (not SiCss3),
 * Airflow is SiApacheairflow, MUI is SiMui, and Node/Three/Next carry a
 * `dotjs` suffix. Java, Azure, AWS and Salesforce have no simple-icons entry
 * at all (trademark policy) and come from fa6 / vsc instead. Matplotlib, NLTK,
 * SLEAP and Hex have no brand icon anywhere, so they take a semantic lucide
 * outline glyph -- never a lettered chip, which reads as broken rather than
 * intentional.
 *
 * A wrong name is a build error, not a runtime one, so `npm run build` is the
 * check.
 */
import {
  SiPython,
  SiCplusplus,
  SiPostgresql,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss,
  SiLua,
  SiR,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiThreedotjs,
  SiFastapi,
  SiJunit5,
  SiMui,
  SiWordpress,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiTensorflow,
  SiPytorch,
  SiOpencv,
  SiStreamlit,
  SiTailwindcss,
  SiGit,
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiJenkins,
  SiApacheairflow,
  SiPostman,
  SiWeightsandbiases,
  SiMetabase,
  SiFigma,
  SiGooglecloud,
  SiGooglebigquery,
  SiSnowflake,
  SiMongodb,
} from "react-icons/si";
// AWS and Salesforce were dropped from simple-icons over trademark policy, so
// they come from Font Awesome. Java and Azure are absent for the same reason.
import { FaJava, FaAws, FaSalesforce } from "react-icons/fa6";
import { VscAzure } from "react-icons/vsc";
import { LuChartLine, LuLanguages, LuPawPrint, LuHexagon } from "react-icons/lu";

export const SKILL_CATEGORIES = [
  "Languages",
  "Frameworks",
  "Libraries",
  "Developer Tools",
  "Cloud & Data",
];

export const skills = [
  // ---- Languages ----
  { name: "Python", category: "Languages", icon: SiPython, color: "#3776AB" },
  { name: "Java", category: "Languages", icon: FaJava, color: "#E76F00" },
  { name: "C++", category: "Languages", icon: SiCplusplus, color: "#00599C", colorDark: "#659AD2" },
  { name: "PostgreSQL", category: "Languages", icon: SiPostgresql, color: "#4169E1" },
  { name: "JavaScript", category: "Languages", icon: SiJavascript, color: "#A38700", colorDark: "#F7DF1E" },
  { name: "TypeScript", category: "Languages", icon: SiTypescript, color: "#3178C6" },
  { name: "HTML5", category: "Languages", icon: SiHtml5, color: "#E34F26" },
  { name: "CSS3", category: "Languages", icon: SiCss, color: "#1572B6" },
  { name: "Lua", category: "Languages", icon: SiLua, color: "#2C2D72", colorDark: "#7A7CE0" },
  { name: "R", category: "Languages", icon: SiR, color: "#276DC3" },

  // ---- Frameworks ----
  { name: "React", category: "Frameworks", icon: SiReact, color: "#087EA4", colorDark: "#61DAFB" },
  { name: "Next.js", category: "Frameworks", icon: SiNextdotjs, color: "#000000", colorDark: "#FFFFFF" },
  { name: "Node.js", category: "Frameworks", icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Express", category: "Frameworks", icon: SiExpress, color: "#000000", colorDark: "#FFFFFF" },
  { name: "Three.js", category: "Frameworks", icon: SiThreedotjs, color: "#000000", colorDark: "#FFFFFF" },
  { name: "FastAPI", category: "Frameworks", icon: SiFastapi, color: "#009688" },
  { name: "JUnit 5", category: "Frameworks", icon: SiJunit5, color: "#25A162" },
  { name: "Material UI", category: "Frameworks", icon: SiMui, color: "#007FFF" },
  { name: "WordPress", category: "Frameworks", icon: SiWordpress, color: "#21759B" },

  // ---- Libraries ----
  { name: "Pandas", category: "Libraries", icon: SiPandas, color: "#150458", colorDark: "#E70488" },
  { name: "NumPy", category: "Libraries", icon: SiNumpy, color: "#013243", colorDark: "#4DABCF" },
  { name: "Matplotlib", category: "Libraries", icon: LuChartLine, color: "#11557C", colorDark: "#4A9BD1" },
  { name: "scikit-learn", category: "Libraries", icon: SiScikitlearn, color: "#C26A00", colorDark: "#F7931E" },
  { name: "TensorFlow", category: "Libraries", icon: SiTensorflow, color: "#FF6F00" },
  { name: "PyTorch", category: "Libraries", icon: SiPytorch, color: "#EE4C2C" },
  { name: "OpenCV", category: "Libraries", icon: SiOpencv, color: "#5C3EE8", colorDark: "#8C74F0" },
  { name: "NLTK", category: "Libraries", icon: LuLanguages, color: "#475569", colorDark: "#94A3B8" },
  { name: "SLEAP", category: "Libraries", icon: LuPawPrint, color: "#0F766E", colorDark: "#2DD4BF" },
  { name: "Streamlit", category: "Libraries", icon: SiStreamlit, color: "#FF4B4B" },
  { name: "Tailwind CSS", category: "Libraries", icon: SiTailwindcss, color: "#0891B2", colorDark: "#06B6D4" },

  // ---- Developer Tools ----
  { name: "Git", category: "Developer Tools", icon: SiGit, color: "#F05032" },
  { name: "Docker", category: "Developer Tools", icon: SiDocker, color: "#2496ED" },
  { name: "Kubernetes", category: "Developer Tools", icon: SiKubernetes, color: "#326CE5", colorDark: "#6B95E8" },
  { name: "Terraform", category: "Developer Tools", icon: SiTerraform, color: "#844FBA", colorDark: "#A47FD6" },
  { name: "Jenkins", category: "Developer Tools", icon: SiJenkins, color: "#D33833" },
  { name: "Airflow", category: "Developer Tools", icon: SiApacheairflow, color: "#017CEE", colorDark: "#4BA3F0" },
  { name: "Postman", category: "Developer Tools", icon: SiPostman, color: "#FF6C37" },
  { name: "Weights & Biases", category: "Developer Tools", icon: SiWeightsandbiases, color: "#9C7A00", colorDark: "#FFBE00" },
  { name: "Hex", category: "Developer Tools", icon: LuHexagon, color: "#4F46E5", colorDark: "#818CF8" },
  { name: "Metabase", category: "Developer Tools", icon: SiMetabase, color: "#3A7CBE", colorDark: "#509EE3" },
  { name: "Figma", category: "Developer Tools", icon: SiFigma, color: "#F24E1E" },

  // ---- Cloud & Data ----
  { name: "AWS", category: "Cloud & Data", icon: FaAws, color: "#232F3E", colorDark: "#FF9900" },
  { name: "Google Cloud", category: "Cloud & Data", icon: SiGooglecloud, color: "#3B78E7", colorDark: "#7BAAF7" },
  { name: "BigQuery", category: "Cloud & Data", icon: SiGooglebigquery, color: "#3C74C4", colorDark: "#669DF6" },
  { name: "Azure", category: "Cloud & Data", icon: VscAzure, color: "#0078D4", colorDark: "#4BA6E8" },
  { name: "Snowflake", category: "Cloud & Data", icon: SiSnowflake, color: "#1B7FA8", colorDark: "#29B5E8" },
  { name: "Salesforce", category: "Cloud & Data", icon: FaSalesforce, color: "#0080B3", colorDark: "#00A1E0" },
  { name: "MongoDB", category: "Cloud & Data", icon: SiMongodb, color: "#3F8C3D", colorDark: "#47A248" },
];

export const skillCount = skills.length;
