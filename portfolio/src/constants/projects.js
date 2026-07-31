import {
  chainsense,
  talentlens,
  nextup,
  evocharge,
  keysofparkinsons,
  cred,
  spayla,
  van,
  ecommerce,
} from "../assets";

// Ordered most-substantial first. `metric` is the mono readout on each card --
// one real, checkable number rather than a marketing line.
export const projects = [
  {
    name: "ChainSense",
    blurb: "Behavioral segmentation of Ethereum wallets",
    description:
      "Clusters ~6.3M active Ethereum wallets into behavioral archetypes from on-chain activity alone — no address labels, no token lists. Each wallet becomes a 26-dimensional feature vector clustered with HDBSCAN. A 159K-wallet cohort surfaced purely from behavior turned out to be phishing-victim drain wallets, confirmed after the fact against Etherscan.",
    metric: "6.3M wallets · 18 clusters · 7 archetypes",
    tags: ["Python", "DuckDB", "HDBSCAN", "XGBoost", "FastAPI", "React"],
    image: chainsense,
    source_code_link: "https://github.com/anirudh9280/ChainSense",
    deploy_code_link: "https://ucsd-chainsense.vercel.app/",
  },
  {
    name: "TalentLens",
    blurb: "Resume ranking with a fine-tuned cross-encoder",
    description:
      "An NLP pipeline that ingests resumes as PDFs and scanned images, extracts text with pdfplumber and a Tesseract OCR fallback, then embeds and ranks candidates against a job description using a fine-tuned cross-encoder over a ChromaDB vector store. FastAPI backend with a Streamlit demo UI.",
    metric: "cross-encoder SFT v1 · ChromaDB · OCR fallback",
    tags: ["Python", "sentence-transformers", "ChromaDB", "FastAPI", "Streamlit"],
    image: talentlens,
    source_code_link: "https://github.com/anirudh9280/TalentLens_Public",
    deploy_code_link:
      "https://talentlenspublic-nakqyg2siefop4zhwucjcq.streamlit.app/",
  },
  {
    name: "Next Up",
    blurb: "Predicting NBA G-League call-ups",
    description:
      "Pulls five seasons of player stats from the SportsRadar API plus official call-up transactions, engineers 88 features across 2,437 player-seasons, and trains Logistic Regression and XGBoost against a heavily imbalanced 8.3% call-up rate. Ships as a Streamlit app with player prediction, team analysis, and model-insight pages.",
    metric: "0.910 ROC-AUC · 82% recall · 88 features",
    tags: ["Python", "scikit-learn", "XGBoost", "SHAP", "Streamlit"],
    image: nextup,
    source_code_link: "https://github.com/anirudh9280/Next-Up",
    deploy_code_link: "https://next-up.streamlit.app/",
  },
  {
    name: "EvoCharge",
    blurb: "EV charging cost prediction for California",
    description:
      "Joins 16,455 California EV charging stations with county-level electricity rates and a Lasso regression trained on 3,500 charging sessions. Enter a ZIP code and session parameters to get an energy and cost estimate, with an interactive Folium map of the station network color-coded by rate tier.",
    metric: "16,455 stations · 58 counties · R² 0.40–0.50",
    tags: ["Python", "scikit-learn", "Folium", "GeoPandas", "Streamlit"],
    image: evocharge,
    source_code_link: "https://github.com/anirudh9280/EvoCharge",
    deploy_code_link: "https://evocharge.streamlit.app/",
  },
  {
    name: "Keys of Parkinsons",
    blurb: "Typing dynamics as a Parkinson's signal",
    description:
      "An interactive data-visualization study of keyboard dynamics as an early signal for Parkinson's disease, built on the NeuroQWERTY MIT-CSXPD dataset from PhysioNet. Includes a typing-density keyboard visualization, a statistical simulation module, and scatter plots correlating typing metrics against UPDRS scores.",
    metric: "NeuroQWERTY MIT-CSXPD · UPDRS correlation",
    tags: ["D3.js", "JavaScript", "Data Viz", "PhysioNet"],
    image: keysofparkinsons,
    source_code_link: "https://github.com/k1mittal/Keys-of-Parkinsons",
    deploy_code_link: "https://k1mittal.github.io/Keys-of-Parkinsons/",
  },
  {
    name: "CRED",
    blurb: "Reentry services site and intake portal",
    description:
      "Built with Triton Software Engineering for CRED, a San Diego nonprofit reducing recidivism among formerly incarcerated people. Replaces their original site with a modular marketing site plus a custom applicant intake form and a gated admin dashboard with sortable tables and PDF export.",
    metric: "Nonprofit client · intake + admin portal",
    tags: ["Next.js", "TypeScript", "Tailwind", "MongoDB", "Firebase"],
    image: cred,
    source_code_link: "https://github.com/TritonSE/CRED",
    deploy_code_link: "https://cred-sd.vercel.app/",
  },
  {
    name: "SpayLA",
    blurb: "Advocacy site with a newsletter CMS",
    description:
      "Built with Triton Software Engineering for Spay.LA, a campaign pushing Los Angeles to fund affordable spay/neuter clinics. A long-form advocacy site backed by a rich-text newsletter editor and an email subscriber manager behind an admin login.",
    metric: "Nonprofit client · newsletter CMS",
    tags: ["Next.js", "TypeScript", "styled-components", "MongoDB", "Firebase"],
    image: spayla,
    source_code_link: "https://github.com/TritonSE/SpayLA-Website",
    deploy_code_link: "https://spay-la-website-three.vercel.app/",
  },
  {
    name: "Vanlife",
    blurb: "Van rental marketplace",
    description:
      "A web platform for searching, booking, and managing van rentals across providers, with Firebase authentication and per-host dashboards.",
    metric: "React Router · Firebase auth",
    tags: ["React", "Firebase", "Authentication"],
    image: van,
    source_code_link: "https://github.com/annabathula28/van-life4",
    deploy_code_link: "https://gleeful-frangollo-4aef40.netlify.app/",
  },
  {
    name: "Ecommerce Site",
    blurb: "Storefront with cart and REST catalog",
    description:
      "A storefront that pulls a product catalog from a REST API and supports browsing, filtering, and cart management.",
    metric: "REST catalog · cart state",
    tags: ["React", "REST API", "Tailwind"],
    image: ecommerce,
    source_code_link: "https://github.com/annabathula28/EcommerceSite",
    deploy_code_link: "https://ecommerce-74a54.web.app/",
  },
];

export const projectCount = projects.length;
