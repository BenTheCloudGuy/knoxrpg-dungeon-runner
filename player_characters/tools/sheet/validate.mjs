import fs from "fs";
import { parseCharacter } from "./ddb-parse.mjs";

const data = JSON.parse(fs.readFileSync(process.argv[2], "utf8")).data;
const c = parseCharacter(data);

const line = (k, v) => console.log(k.padEnd(16), v);
line("Name", c.name);
line("Race/BG", `${c.race} | ${c.background}`);
line("Class", c.classLine);
line("Level/Prof", `${c.level} / ${c.profText}`);
console.log("Abilities:");
for (const a of Object.keys(c.abilities)) {
  const x = c.abilities[a];
  process.stdout.write(`  ${a} ${x.score} (${x.modText})  save ${c.saves[a].totalText}${c.saves[a].proficient ? "*" : ""}\n`);
}
line("AC", c.ac);
line("Initiative", c.initiativeText);
line("Speed", c.speed);
line("Max HP", c.maxHP);
line("Hit Dice", c.hitDice);
line("Passives", `Perc ${c.passives.perception} Inv ${c.passives.investigation} Ins ${c.passives.insight}`);
if (c.spellcasting) line("Spellcasting", `${c.spellcasting.ability} DC ${c.spellcasting.saveDC} atk ${c.spellcasting.attack >= 0 ? "+" : ""}${c.spellcasting.attack}`);
line("Slots", c.spellSlots ? c.spellSlots.slice(0, 5).join("/") : "none");
console.log("Proficient skills:", c.skills.filter((s) => s.proficient).map((s) => `${s.label}${s.totalText}`).join(", "));
console.log("Spells by level:");
for (const lvl of Object.keys(c.spellsByLevel).sort()) {
  console.log(`  L${lvl}: ` + c.spellsByLevel[lvl].map((s) => `${s.name}[${s.source}]`).join(", "));
}
console.log("Feats:", c.feats.map((f) => f.name).join(", "));
console.log("Metamagic:", c.metamagic.join(", "));
console.log("Class features (<=lvl):", c.classFeatures.map((f) => f.name).join(", "));
