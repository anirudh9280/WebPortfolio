import {
  tse,
  blackscholes,
  imagerender,
  ucsdlogo,
  van,
  streamerstakes,
  ds3,
  tutor,
  hemut,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  threejs,
  ecommerce,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Experience",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Data Scientist",
    icon: web,
  },
  {
    title: "ML Engineer",
    icon: web,
  },
  {
    title: "Full-Stack Developer",
    icon: backend,
  },
  {
    title: "AI Researcher",
    icon: creator,
  },
];

const technologies = [
  {
    name: "Pandas",
    icon: html,
  },
  {
    name: "Matplotlib",
    icon: html,
  },
  {
    name: "Numpy",
    icon: html,
  },
  {
    name: "TensorFlow",
    icon: html,
  },
  {
    name: "PyTorch",
    icon: html,
  },
  {
    name: "Java",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "Python",
    icon: html,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "OpenCV",
    icon: docker,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "Figma",
    icon: figma,
  },
  {
    name: "Docker",
    icon: docker,
  },
  {
    name: "NLTK",
    icon: docker,
  },
  {
    name: "R",
    icon: docker,
  },
  {
    name: "SQL",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Software Developer Intern",
    company_name: "Hemut",
    icon: hemut,
    iconBg: "#383E56",
    date: "December 2024 - May 2025",
    points: [
      "Integrated real-time API data to access fuel prices across major trucking routes",
      "Built a graph structure to map stops and fueling stations with cost and distance weights",
      "Utilized the A* algorithm with an admissible heuristic to compute optimal routes dependent on cost and distance",
    ],
  },
  {
    title: "Software Engineer Intern",
    company_name: "StreamerStakes",
    icon: streamerstakes,
    iconBg: "#383E56",
    date: "Aug 2024 - Dec 2024",
    points: [
      "Developed an AI-driven internal tool using LLM models to generate marketing ideas for games hosted on the site",
      "Built a React frontend and Node.js backend, streamlining the marketing team's content creation process",
      "Enhanced marketing efficiency by automating the generation of tailored promotional content",
    ],
  },
  {
    title: "Undergraduate Researcher",
    company_name: "Sensory Communication Lab - UCSD",
    icon: ucsdlogo,
    iconBg: "#3b444b",
    date: "Aug 2024 - PRESENT",
    points: [
      "Developed an interactive spectrogram visualization tool using React that enables real-time frequency analysis and manipulation of audio signals",
      "Designed and implemented dynamic frequency filters with customizable parameters, enhancing user control over audio processing and synthesis",
      "Visit the website: https://spectrogram.sciencemusic.org/",
      "<divider/>",
      "Built a modular audio flow programming interface with React and Tone.js, allowing users to create complex audio sequences through node-based connections",
      "Implemented interval and timing control systems that enable precise audio event scheduling and dynamic parameter adjustments during playback",
      "Visit the website: https://mflow.sciencemusic.org/",
    ],
  },
  {
    title: "Assistant Project Director & Software Developer",
    company_name: "Data Science Student Alliance, UCSD",
    icon: ds3,
    iconBg: "#3b444b",
    date: "Nov 2024 - PRESENT",
    points: [
      "Led 12+ data science projects, mentoring teams on AI model optimization",
      "Matched project ideas with teams based on expertise and organized showcases and workshops",
      "Enhanced the DS3 website using Svelte and MongoDB, boosting user engagement and backend performance",
    ],
  },
  {
    title: "Software Developer",
    company_name: "Triton Software Engineering, UCSD",
    icon: tse,
    iconBg: "#3b444b",
    date: "Dec 2024 - PRESENT",
    points: [
      "Engineered software solutions for nonprofit organizations, utilizing tools such as Docker and Postman",
      "Built scalable apps using React Native and Expo and web platforms with Express.js and MongoDB",
      "Followed Agile methodologies to simulate professional development, ensuring efficient team collaboration",
    ],
  },
  {
    title: "Python Tutor",
    company_name: "Tri-Valley Excel",
    icon: tutor,
    iconBg: "#383E56",
    date: "October 2020 - May 2023",
    points: [
      "Created customized learning plans for students based on current skill levels, goals, and areas of interest.",
      "Curated unique assignments and assessments along with interactive projects to establish a strong foundation in programming. ",
      "Prepared students for future high school and extracurricular courses that are offered.",
    ],
  },
  //{
  //title: "Full stack Developer",
  //company_name: "Meta",
  //icon: meta,
  //iconBg: "#E6DEDD",
  //date: "Jan 2023 - Present",
  //points: [
  // "Developing and maintaining web applications using React.js and other related technologies.",
  // "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
  //"Implementing responsive design and ensuring cross-browser compatibility.",
  // "Participating in code reviews and providing constructive feedback to other developers.",
  //],
  // },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Black-Scholes Option Pricer",
    description:
      "Calculate European call and put option prices using the Black-Scholes model. Enter asset price, volatility, expiration, risk-free rate, and option type for instant results, with dynamic graphs showing real-time Greek values for added insights.",
    tags: [
      {
        name: "python",
        color: "red-text-gradient",
      },
      {
        name: "django",
        color: "yellow-text-gradient",
      },
      {
        name: "numpy",
        color: "pink-text-gradient",
      },
    ],
    image: blackscholes,
    deploy_code_link: "https://blackscholesapp-e835e285f907.herokuapp.com/",
    source_code_link: "https://github.com/anirudh9280/Black-Scholes.git",
    year: 2024,
  },
  {
    name: "Vanlife",
    description:
      "Web-based platform that allows users to search, book, and manage van rentals from various providers, providing a convenient and efficient solution for transportation needs.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "firebase",
        color: "green-text-gradient",
      },
      {
        name: "authentication",
        color: "pink-text-gradient",
      },
    ],
    image: van,
    deploy_code_link: "https://gleeful-frangollo-4aef40.netlify.app/",
    source_code_link: "https://github.com/annabathula28/van-life4.git",
    year: 2023,
  },
  {
    name: "Ecommerce Site",
    description:
      "Web application that allows users to browse for items and add it to a cart.",
    tags: [
      {
        name: "react",
        color: "red-text-gradient",
      },
      {
        name: "restapi",
        color: "yellow-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: ecommerce,
    deploy_code_link: "https://ecommerce-74a54.web.app/",
    source_code_link: "https://github.com/annabathula28/EcommerceSite.git",
    year: 2023,
  },
  {
    name: "Number Classifier (KNN)",
    description:
      "Implemented a custom PriorityQueue in Java for efficient k-nearest neighbors classification, achieving over 90% accuracy on handwritten digits with interactive graphical visualization.",
    tags: [
      {
        name: "java",
        color: "purple-text-gradient",
      },
      {
        name: "PriorityQueue",
        color: "green-text-gradient",
      },
      {
        name: "Image-Rendering",
        color: "orange-text-gradient",
      },
    ],
    image: imagerender,
    deploy_code_link: "https://github.com/anirudh9280/Number-Classifier-",
    source_code_link: "https://github.com/anirudh9280/Number-Classifier-",
    year: 2022,
  },
  {
    name: "AI Chat Application",
    description:
      "A real-time AI chat application that uses GPT-4 to provide intelligent responses to user queries. Features include conversation history, prompt templates, and custom knowledge base integration.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "openai",
        color: "green-text-gradient",
      },
      {
        name: "firebase",
        color: "pink-text-gradient",
      },
    ],
    image: ecommerce, // Reusing image as placeholder
    deploy_code_link: "https://github.com/",
    source_code_link: "https://github.com/",
    year: 2023,
  },
  {
    name: "Data Visualization Dashboard",
    description:
      "Interactive dashboard for visualizing complex datasets with customizable charts, filters, and real-time updates. Built with D3.js and React, featuring responsive design and export capabilities.",
    tags: [
      {
        name: "d3.js",
        color: "orange-text-gradient",
      },
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "typescript",
        color: "green-text-gradient",
      },
    ],
    image: imagerender, // Reusing image as placeholder
    deploy_code_link: "https://github.com/",
    source_code_link: "https://github.com/",
    year: 2022,
  },
  {
    name: "Machine Learning Pipeline",
    description:
      "End-to-end ML pipeline for data preprocessing, model training, and deployment. Includes automated feature selection, hyperparameter tuning, and model versioning with performance metrics tracking.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "scikit-learn",
        color: "green-text-gradient",
      },
      {
        name: "mlflow",
        color: "pink-text-gradient",
      },
    ],
    image: blackscholes, // Reusing image as placeholder
    deploy_code_link: "https://github.com/",
    source_code_link: "https://github.com/",
    year: 2022,
  },
  {
    name: "Neural Network from Scratch",
    description:
      "Implemented a neural network from scratch using only NumPy, with support for multiple hidden layers, various activation functions, and backpropagation. Achieved 95% accuracy on MNIST dataset.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "numpy",
        color: "green-text-gradient",
      },
      {
        name: "machinelearning",
        color: "pink-text-gradient",
      },
    ],
    image: blackscholes,
    deploy_code_link: "https://github.com/",
    source_code_link: "https://github.com/",
    year: 2021,
  },
  {
    name: "Sentiment Analysis Tool",
    description:
      "Built a sentiment analysis tool using NLP techniques and BERT models. The system analyzes text from social media, reviews, and support tickets to categorize sentiment with 88% accuracy.",
    tags: [
      {
        name: "nlp",
        color: "blue-text-gradient",
      },
      {
        name: "pytorch",
        color: "green-text-gradient",
      },
      {
        name: "huggingface",
        color: "pink-text-gradient",
      },
    ],
    image: van,
    deploy_code_link: "https://github.com/",
    source_code_link: "https://github.com/",
    year: 2021,
  },
];

export { services, technologies, experiences, testimonials, projects };
