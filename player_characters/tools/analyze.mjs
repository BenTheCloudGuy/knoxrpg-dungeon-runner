// One-off: survey all rosters to scope content coverage + validate parse.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseCharacter } from "./sheet/ddb-parse.mjs";
import { FEATURE_EXPLAIN, RACE_EXPLAIN, CLASS_EXPLAIN, SUBCLASS_EXPLAIN, RESOURCE_LIBRARY } from "./sheet/content.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(here, "..", "data");
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));

const races = new Set(), classes = new Set(), subs = new Set();
const feats = new Set(), classFeatures = new Set(), metamagic = new Set();
let featureSnippetHave = 0, featureSnippetMiss = 0;

for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf8")).data;
  const m = parseCharacter(data);
  console.log(`${(m.name||"?").padEnd(20)} | ${String(m.raceBase).padEnd(12)} | ${m.classLine.padEnd(34)} | AC ${String(m.ac).padEnd(3)} HP ${String(m.maxHP).padEnd(3)} | spells:${Object.keys(m.spellsByLevel).length ? "Y" : "n"}`);
  races.add(m.raceBase);
  classes.add(m.className);
  if (m.subclass) subs.add(m.subclass);
  for (const x of m.classFeatures) classFeatures.add(x.name);
  for (const x of m.feats) feats.add(x.name);
  for (const x of m.metamagic) metamagic.add(x);
  // snippet availability on class features
  for (const c of data.classes || []) for (const cf of c.classFeatures || []) {
    const d = cf.definition || {};
    if ((d.snippet || "").trim()) featureSnippetHave++; else featureSnippetMiss++;
  }
}

const miss = (set, lib) => [...set].filter((x) => x && !lib[x]).sort();
console.log("\n== RACES ==", [...races].sort().join(", "));
console.log("MISSING RACE_EXPLAIN:", miss(races, RACE_EXPLAIN).join(", ") || "none");
console.log("\n== CLASSES ==", [...classes].sort().join(", "));
console.log("MISSING CLASS_EXPLAIN:", miss(classes, CLASS_EXPLAIN).join(", ") || "none");
console.log("\n== SUBCLASSES ==", [...subs].sort().join(", "));
console.log("MISSING SUBCLASS_EXPLAIN:", miss(subs, SUBCLASS_EXPLAIN).join(", ") || "none");
console.log("\n== FEATS (" + feats.size + ") ==", [...feats].sort().join(" | "));
console.log("MISSING FEATURE_EXPLAIN (feats):", miss(feats, FEATURE_EXPLAIN).join(" | ") || "none");
console.log("\n== CLASS FEATURES (" + classFeatures.size + ") ==", [...classFeatures].sort().join(" | "));
console.log("MISSING FEATURE_EXPLAIN (class features):", miss(classFeatures, FEATURE_EXPLAIN).join(" | ") || "none");
console.log("\n== METAMAGIC ==", [...metamagic].sort().join(", "));
console.log(`\nfeature snippets: have=${featureSnippetHave} miss=${featureSnippetMiss}`);
