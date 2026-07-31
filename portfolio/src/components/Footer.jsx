import { Link } from "react-router-dom";
import {
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  RESUME_URL,
} from "../constants/links";

const LINKS = [
  { label: "GitHub", href: GITHUB_URL },
  { label: "LinkedIn", href: LINKEDIN_URL },
  { label: "Résumé", href: RESUME_URL },
  { label: "Email", href: `mailto:${EMAIL}` },
];

const Footer = () => (
  <footer className="border-t border-line/10">
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-16">
      <div>
        <p className="font-display text-[15px] font-bold text-ink">
          Anirudh Annabathula
        </p>
        <p className="readout mt-1.5">
          UC San Diego · Data Science · Class of 2027
        </p>
      </div>

      <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {LINKS.map((link) => {
          const external =
            link.href.startsWith("http") || link.href.endsWith(".pdf");
          return (
            <a
              key={link.label}
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="font-mono text-[11px] uppercase tracking-readout text-muted transition-colors hover:text-accent"
            >
              {link.label} ↗
            </a>
          );
        })}
        <Link
          to="/analytics"
          className="font-mono text-[11px] uppercase tracking-readout text-muted transition-colors hover:text-accent"
        >
          Site analytics
        </Link>
      </nav>
    </div>
  </footer>
);

export default Footer;
