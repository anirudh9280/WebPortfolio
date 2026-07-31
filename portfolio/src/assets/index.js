// Barrel for every image used by the site. Vite resolves these at build time,
// so an entry here that points at a missing file breaks the whole build.

import logo from "./logo.svg";
import github from "./github.png";
import analytics_icon from "./analytics_icon.png";
import github_icon from "./github_icon.png";
import linkedin_icon from "./linkedin_icon.png";

// Company / org marks for the experience timeline.
import ds3 from "./ds3.png";
import evgo from "./evgo.png";
import hemut from "./hemut.png";
import tse from "./tse.png";
import ucsdlogo from "./ucsdlogo.png";
import narvar from "./company/narvar.svg";
import salk from "./company/salk.svg";

// Project covers, all hand-authored SVG at 640x400 on the same dark panel:
// abstract plots of what each project actually does, and layout wireframes for
// the ones that are sites rather than analyses. Kept as one system on purpose --
// the two older projects used to carry photo screenshots, which read as a
// different design language sitting next to the plots.
import chainsense from "./projects/chainsense.svg";
import talentlens from "./projects/talentlens.svg";
import nextup from "./projects/nextup.svg";
import evocharge from "./projects/evocharge.svg";
import keysofparkinsons from "./projects/keysofparkinsons.svg";
import cred from "./projects/cred.svg";
import spayla from "./projects/spayla.svg";
import ds3site from "./projects/ds3.svg";
import van from "./projects/vanlife.svg";
import ecommerce from "./projects/ecommerce.svg";

export {
  logo,
  github,
  analytics_icon,
  github_icon,
  linkedin_icon,
  ds3,
  evgo,
  hemut,
  tse,
  ucsdlogo,
  narvar,
  salk,
  chainsense,
  talentlens,
  nextup,
  evocharge,
  keysofparkinsons,
  cred,
  spayla,
  ds3site,
  van,
  ecommerce,
};
