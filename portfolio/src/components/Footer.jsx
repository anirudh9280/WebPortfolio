import { Link } from "react-router-dom";

const LINKS = [
  { label: "GitHub", href: "https://github.com/anirudh9280" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/anirudha9" },
  { label: "Email", href: "mailto:anirudh.annabathula@gmail.com" },
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
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="font-mono text-[11px] uppercase tracking-readout text-muted transition-colors hover:text-accent"
          >
            {link.label} ↗
          </a>
        ))}
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
