// Every outbound link to me, in one place. Components import from here rather
// than hardcoding URLs, so there is a single thing to update.

export const EMAIL = "anirudh.annabathula@gmail.com";
export const PHONE = "408-838-9692";

export const GITHUB_URL = "https://github.com/anirudh9280";
export const LINKEDIN_URL = "https://www.linkedin.com/in/anirudha9/";

// Self-hosted rather than the Google Drive share link: Drive shows an
// interstitial, can prompt for sign-in depending on the viewer's session, and
// is slower. This opens straight into the browser's PDF viewer. The filename
// is verbose on purpose -- it becomes the download name.
export const RESUME_URL = "/Anirudh-Annabathula-Resume.pdf";

export const socialLinks = [
  { label: "GitHub", href: GITHUB_URL, handle: "anirudh9280" },
  { label: "LinkedIn", href: LINKEDIN_URL, handle: "anirudha9" },
  { label: "Résumé", href: RESUME_URL, handle: "PDF" },
];

/** True for anything that should open in a new tab with rel=noopener. */
export const isExternal = (href) =>
  href.startsWith("http") || href.endsWith(".pdf");
