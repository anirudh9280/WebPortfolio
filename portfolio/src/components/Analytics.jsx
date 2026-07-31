import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import CommitGraph from "./CommitGraph";
import { styles } from "../styles";

const Analytics = () => (
  <div className="relative z-0 min-h-screen bg-ground">
    <Navbar />

    <div className="mx-auto max-w-7xl px-6 pb-20 pt-28 sm:px-16">
      <Link
        to="/"
        className="font-mono text-[11px] uppercase tracking-readout text-muted transition-colors hover:text-accent"
      >
        ← Back to portfolio
      </Link>

      <div className="mt-8">
        <div className="flex items-center gap-4">
          <span className={styles.sectionSubText}>Development analytics</span>
          <span className="panel-rule" aria-hidden="true" />
        </div>
        <h1 className={`${styles.sectionHeadText} mt-4`}>
          How this site got built.
        </h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-[1.75] text-muted">
          Every line of this portfolio, attributed and plotted: when the commits
          happened, which files they touched, and how the codebase grew, read
          from a per-line git blame of the repo itself.
        </p>
      </div>

      <div className="mt-12">
        <CommitGraph />
      </div>
    </div>
  </div>
);

export default Analytics;
