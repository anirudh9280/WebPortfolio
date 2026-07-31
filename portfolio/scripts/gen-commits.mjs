/**
 * Writes public/meta/commits.csv -- every commit in this repo's history.
 *
 * This is deliberately NOT the same data as meta/loc.csv. loc.csv is a per-line
 * git blame, so it only sees commits whose lines still survive; a large rewrite
 * collapses it to a handful. The hero plot is labelled "commits to this site",
 * so it needs the actual log.
 *
 * Run with `npm run meta`.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const outPath = resolve(here, "..", "public", "meta", "commits.csv");

const SEP = "";

const raw = execFileSync(
  "git",
  ["log", "--no-merges", `--pretty=format:%H${SEP}%aI${SEP}%an`, "--numstat"],
  { cwd: repoRoot, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
);

const commits = [];
let current = null;

for (const line of raw.split("\n")) {
  if (line.includes(SEP)) {
    const [hash, datetime, author] = line.split(SEP);
    current = {
      hash: hash.slice(0, 8),
      datetime,
      author,
      files: 0,
      insertions: 0,
      deletions: 0,
    };
    commits.push(current);
  } else if (line.trim() && current) {
    // "<added>\t<deleted>\t<path>"; binary files report "-".
    const [added, deleted] = line.split("\t");
    current.files += 1;
    current.insertions += Number(added) || 0;
    current.deletions += Number(deleted) || 0;
  }
}

commits.reverse(); // oldest first

const header = "hash,datetime,author,files,insertions,deletions";
const rows = commits.map(
  (c) =>
    `${c.hash},${c.datetime},${c.author},${c.files},${c.insertions},${c.deletions}`
);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, [header, ...rows].join("\n") + "\n");

console.log(
  `Wrote ${commits.length} commits to ${outPath} ` +
    `(${commits[0]?.datetime.slice(0, 10)} → ${commits.at(-1)?.datetime.slice(0, 10)})`
);
