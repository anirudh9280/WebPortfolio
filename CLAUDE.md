# CLAUDE.md

Personal portfolio for Anirudh Annabathula — live at **anirudhannabathula.com**.

## Repo shape

The repo root is a thin wrapper. **The entire app lives in `portfolio/`** — always `cd portfolio` before running anything.

```
portfolio/
├── src/
│   ├── components/          # all React components (flat)
│   │   └── canvas/          # react-three-fiber scenes
│   ├── constants/           # site content as data — see below
│   ├── context/ThemeContext.jsx
│   ├── hoc/SectionWrapper.jsx
│   ├── utils/motion.js      # framer-motion variant factories
│   ├── assets/              # images; re-exported through assets/index.js
│   ├── styles.js            # shared Tailwind class strings
│   └── index.css            # design tokens + theme overrides
├── public/meta/loc.csv      # per-line git blame, feeds the analytics page
└── dist/                    # build output — this is what ships
```

## Commands

```bash
cd portfolio
npm run dev       # vite dev server on :5173
npm run build     # → portfolio/dist/
npm run preview   # serve the built output
npm run lint
```

## Deploy

**Manual.** `npm run build`, then upload the contents of `portfolio/dist/` to Hostinger, which redeploys on upload. There is no CI deploy — the `.github/workflows/firebase-hosting-*.yml` files are stale (they run `npm run build` at the repo root, where there is no `package.json`) and Firebase is not the live host.

`vite.config.js` sets `base: "./"` so `dist/` emits relative asset URLs and drops into any static host.

## Content lives in data files, not components

Editing site copy means editing `src/constants/`, not JSX:

| File | Holds |
|---|---|
| `constants/index.js` | `navLinks`, `services`, `experiences` |
| `constants/projects.js` | project cards |
| `constants/skills.js` | skills marquee — react-icons refs + per-theme brand colors |
| `constants/coursework.js` | relevant coursework, grouped by department |

Images are **Vite-resolved imports**, never URL strings. Add a file to `src/assets/`, export it from `src/assets/index.js`, then import it in the constants file.

## Design system — "instrumented"

The site is built from the vernacular of measurement: axis rails, tick marks, monospace readouts of real numbers. The signature element is the left-edge axis rail plus a hero scatterplot of this repo's own commit history.

**Palette is viridis-derived** (the matplotlib default colormap). Tokens are CSS custom properties on `.dark-mode` / `.light-mode` in `index.css` and mirrored into `tailwind.config.js`:

| Token | Role |
|---|---|
| `--ground` / `--surface` | backgrounds |
| `--ink` / `--muted` | text |
| `--accent` (viridis teal) | links, active state, primary CTA |
| `--signal` (viridis yellow) | "live/now" only — use sparingly |
| `--series` (viridis indigo) | plot marks |
| `--grid` | hairlines, dividers |

**Type has three roles.** Space Grotesk = display only, large sizes. IBM Plex Sans = body. **IBM Plex Mono = every number, date, metric, tag, and readout** — this is what makes the design legible rather than asserted. Fonts are self-hosted via `@fontsource/*` so there is no external request.

House rules, deliberately: tight radii (2–4px), no purple gradients, no glassmorphism, no sequence numbers (`01 / 02 / 03`), no fake terminal chrome. Boldness is spent on the axis rail and nowhere else.

## Theming

`ThemeContext` toggles `.dark-mode` / `.light-mode` on `document.body` and persists to `localStorage`. First-time visitors get `prefers-color-scheme`; the site stops following the OS once they toggle manually.

Two things are easy to break here:

- **`localStorage` is written only inside `toggleTheme`.** Writing it in a `[darkMode]` effect would make "user has chosen explicitly" true on mount and permanently kill OS-preference following.
- **The inline script in `index.html` must stay the first child of `<body>`**, not `<head>` — `document.body` is null during head parsing. It sets the theme class before React mounts, which is what prevents a white flash.

Theme transitions are opt-in: `toggleTheme` adds `.theme-transition` to `<html>` for ~350 ms. Do **not** reintroduce a blanket `* { transition: ... }` — that was a measurable scroll-jank source.

`tailwind.config.js` sets `darkMode: ["selector", ".dark-mode"]`, so new components can use `dark:` variants. Prefer that over JS ternaries in new code, but **never mix both in one component** — `.light-mode .text-white` and `.dark-mode .dark\:text-white` have identical specificity and resolve by stylesheet order.

## Performance constraints

Learned the hard way; re-breaking these regresses scroll smoothness:

- **Scroll-spy uses `IntersectionObserver`, not a scroll listener.** The old version called `getBoundingClientRect()` on every section per scroll tick and had `active` in its own dep array, so it tore itself down mid-scroll.
- **Every `<Canvas>` needs a `frameloop` policy.** `StarsCanvas` gates on visibility; an ungated canvas renders forever, including off-screen.
- **The skills marquee is CSS `@keyframes` on `transform`**, not framer-motion — it must stay on the compositor thread. `will-change: transform` belongs on the two tracks only, never the ~96 chips.
- Marquee seam math: the track is `w-max` with two identical groups animating `translateX(0) → -50%`. The gap lives on each **group** (`gap-x-N pr-N`, equal at every breakpoint), never on the track — a gap on the track leaves the loop short by `gap/2` and stutters every cycle.

## The analytics page

`/analytics` renders `CommitGraph.jsx` — a D3 scrollytelling analysis of this repo's commit history, with a time-of-day scatter, brush-driven language breakdown, a datetime range slider, and story mode. It reads `public/meta/loc.csv`, regenerated with the `elocuent` devDependency.

Note the commit permalinks in that file point at `github.com/anirudh9280/portfolio`, but the actual remote is `anirudh9280/WebPortfolio`.

## Skills available

`.claude/skills/` vendors two skills from `anthropics/skills`:

- **`frontend-design`** — read before any visual work. Enforces brainstorm → critique → build, and names the generic looks to avoid.
- **`webapp-testing`** — Playwright loop for screenshotting and verifying changes:
  ```bash
  python .claude/skills/webapp-testing/scripts/with_server.py \
    --server "cd portfolio && npm run dev" --port 5173 -- python your_script.py
  ```

Verify visual changes with screenshots in **both themes** at 1440px and 390px. Light mode is a first-class design, not an inverted afterthought.
