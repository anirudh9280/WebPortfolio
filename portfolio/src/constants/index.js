import {
    van,
    tutor, 
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    meta,
    starbucks,
    tesla,
    shopify,
    carrent,
    jobit,
    tripguide,
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
        title: "Work",
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
        title: "Web Developer",
        icon: web,
    },
    {
        title: "Backend Developer",
        icon: backend,
    },
    {
        title: "UI/UX Designer",
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
        name: "HTML 5",
        icon: html,
    },
    {
        name: "CSS 3",
        icon: css,
    },
    {
        name: "JavaScript",
        icon: javascript,
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
];

const experiences = [
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
            "Hosted virtual webinars to educate parents and students about high school and college classes.",
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
    },
    {
        name: "Ecommerce Site",
        description:
            "Web application that allows users to browse for items and add it to a cart.",
        tags: [
            {
                name: "react",
                color: "blue-text-gradient",
            },
            {
                name: "restapi",
                color: "green-text-gradient",
            },
            {
                name: "tailwind",
                color: "pink-text-gradient",
            },
        ],
        image: ecommerce,
        deploy_code_link: "https://ecommerce-74a54.web.app/",
        source_code_link: "https://github.com/annabathula28/EcommerceSite.git",
    },

];

export { services, technologies, experiences, testimonials, projects };