// Relevant coursework, grouped by department and rendered as a mono table.
//
// Scope: DSC / CSE / MATH, plus the two COGS courses that are squarely data
// science (108, 118C). COGS 9, COGS 100, COGS 101C and all MUS courses are
// deliberately excluded.

export const coursework = [
  {
    dept: "DSC",
    label: "Data Science",
    courses: [
      { code: "10", title: "Principles of Data Science" },
      { code: "20", title: "Programming & Data Structures" },
      { code: "30", title: "Data Structures & Algorithms" },
      { code: "40A", title: "Theoretical Foundations I" },
      { code: "40B", title: "Theoretical Foundations II" },
      { code: "80", title: "Practice of Data Science" },
      { code: "100", title: "Data Management" },
      { code: "102", title: "Systems for Scalable Analytics" },
      { code: "106", title: "Data Visualization" },
      { code: "140A", title: "Probabilistic Modeling & ML" },
      { code: "140B", title: "Representation Learning" },
      { code: "180A", title: "Data Science Project I" },
      { code: "180B", title: "Data Science Project II" },
    ],
  },
  {
    dept: "CSE",
    label: "Computer Science",
    courses: [
      { code: "151B", title: "Deep Learning" },
      { code: "153", title: "Machine Learning for Music" },
      { code: "158R", title: "Recommender Systems & Web Mining" },
    ],
  },
  {
    dept: "MATH",
    label: "Mathematics",
    courses: [
      { code: "18", title: "Linear Algebra" },
      { code: "20E", title: "Vector Calculus" },
      { code: "173A", title: "Optimization for Data Science I" },
      { code: "173B", title: "Optimization for Data Science II" },
      { code: "180A", title: "Introduction to Probability" },
      { code: "181A", title: "Mathematical Statistics I" },
      { code: "189", title: "Data Analysis & Inference" },
    ],
  },
  {
    dept: "COGS",
    label: "Cognitive Science",
    courses: [
      { code: "108", title: "Data Science in Practice" },
      { code: "118C", title: "Neural Signal Processing" },
      { code: "181", title: "Neural Networks & Deep Learning" },
    ],
  },
];

export const courseCount = coursework.reduce(
  (n, group) => n + group.courses.length,
  0
);
