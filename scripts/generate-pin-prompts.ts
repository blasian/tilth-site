import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type Frontmatter = Record<string, string>;

type Article = {
  slug: string;
  plantName: string;
  landingUrl: string;
  permalink: string;
  frontmatter: Frontmatter;
  body: string;
  sections: Map<string, string>;
};

type Panel = {
  problem: string;
  action: string;
};

const repoRoot = process.cwd();
const plantsDir = path.join(repoRoot, "plants");
const outputDir = path.join(repoRoot, "pin-prompts", "plants");

const plantNames: Record<string, string> = {
  blueberries: "Blueberry",
  cucumber: "Cucumber",
  dahlia: "Dahlia",
  garlic: "Garlic",
  hydrangea: "Hydrangea",
  kale: "Kale",
  lettuce: "Lettuce",
  pepper: "Pepper",
  rhododendron: "Rhododendron",
  squash: "Squash & zucchini",
  strawberries: "Strawberry",
  tomato: "Tomato"
};

const tomatoCalibrationPanels: Panel[] = [
  { problem: "Yellow leaves", action: "check water before nitrogen" },
  { problem: "Curling tops", action: "heat stress or drift" },
  { problem: "Brown spots", action: "remove low leaves" },
  { problem: "No fruit", action: "cool nights below 55°F" },
  { problem: "Black bottoms", action: "water more consistently" },
  { problem: "Wet leaves", action: "stop overhead watering" },
  { problem: "Late ripening", action: "choose early varieties" },
  { problem: "Leggy growth", action: "needs 8+ hours sun" },
  { problem: "Too leafy", action: "avoid excess nitrogen" }
];

const fallbackBySlug: Record<string, Panel[]> = {
  blueberries: [
    { problem: "Yellow leaves", action: "soil pH too high" },
    { problem: "Few berries", action: "plant a second cultivar" },
    { problem: "Bird damage", action: "net before ripening" },
    { problem: "Browning leaves", action: "check drainage" },
    { problem: "Weak growth", action: "test acidic soil" },
    { problem: "Low yield", action: "avoid heavy pruning" },
    { problem: "Dry roots", action: "mulch and water steadily" },
    { problem: "Young plants", action: "expect light early crops" },
    { problem: "Clay soil", action: "raise the bed" }
  ],
  cucumber: [
    { problem: "Bitter fruit", action: "even out watering" },
    { problem: "Powdery mildew", action: "improve airflow" },
    { problem: "Downy mildew", action: "remove affected leaves" },
    { problem: "Cold soil", action: "wait for 65°F" },
    { problem: "Old transplants", action: "start only 3 weeks" },
    { problem: "Weak slicers", action: "choose pickling types" },
    { problem: "Oversized fruit", action: "harvest every few days" },
    { problem: "Damaged stems", action: "cut fruit off" },
    { problem: "Slow production", action: "pick more often" }
  ],
  dahlia: [
    { problem: "Missing sprouts", action: "protect from slugs" },
    { problem: "Rotten tubers", action: "wait for warm soil" },
    { problem: "No blooms", action: "avoid excess nitrogen" },
    { problem: "Powdery mildew", action: "thin crowded foliage" },
    { problem: "Winter rot", action: "lift or improve drainage" },
    { problem: "Floppy stems", action: "stake at planting" },
    { problem: "Weak branching", action: "pinch at 12 inches" },
    { problem: "Dry tubers", action: "store cool, not wet" },
    { problem: "Late flowers", action: "pre-sprout in April" }
  ],
  garlic: [
    { problem: "Tiny bulbs", action: "plant earlier in fall" },
    { problem: "Wet soil", action: "use raised beds" },
    { problem: "Yellow leaves", action: "often harvest is near" },
    { problem: "Weak spring growth", action: "side-dress in March" },
    { problem: "Small cloves", action: "plant the largest cloves" },
    { problem: "Missed scapes", action: "cut after one curl" },
    { problem: "Poor storage", action: "cure before trimming" },
    { problem: "Softneck trouble", action: "choose hardneck varieties" },
    { problem: "Broken tops", action: "lift with a fork" }
  ],
  hydrangea: [
    { problem: "No blooms", action: "pruned at wrong time" },
    { problem: "Wilting leaves", action: "water deeply" },
    { problem: "Pink blooms", action: "soil less acidic" },
    { problem: "Blue fades", action: "check soil pH" },
    { problem: "Frost damage", action: "buds froze in spring" },
    { problem: "Too much shade", action: "add morning sun" },
    { problem: "Wrong pruning", action: "identify the type" },
    { problem: "Young plant", action: "wait 1–2 years" },
    { problem: "Dry roots", action: "mulch after planting" }
  ],
  kale: [
    { problem: "Cabbage worms", action: "use row cover" },
    { problem: "Yellow lowers", action: "often natural aging" },
    { problem: "Bitter leaves", action: "heat stress or bolting" },
    { problem: "Clubroot risk", action: "keep pH slightly alkaline" },
    { problem: "Weak growth", action: "feed long-season plants" },
    { problem: "Winter pause", action: "harvest resumes in spring" },
    { problem: "Bolting stalks", action: "harvest buds early" },
    { problem: "Summer pests", action: "cover before butterflies" },
    { problem: "Tough leaves", action: "pick in cool weather" }
  ],
  lettuce: [
    { problem: "Bolting", action: "skip July planting" },
    { problem: "Bitter leaves", action: "heat pushed flowering" },
    { problem: "Slug holes", action: "bait at planting" },
    { problem: "Afternoon wilt", action: "usually heat stress" },
    { problem: "Slow growth", action: "plant in cool seasons" },
    { problem: "Dry leaves", action: "water consistently" },
    { problem: "Crowded heads", action: "thin seedlings early" },
    { problem: "Summer scorch", action: "use partial shade" },
    { problem: "Winter loss", action: "use row cover" }
  ],
  pepper: [
    { problem: "Stalled growth", action: "soil is too cold" },
    { problem: "Few peppers", action: "needs more heat" },
    { problem: "Bell struggle", action: "grow small-fruited types" },
    { problem: "Shot holes", action: "flea beetles; cover early" },
    { problem: "Leafy plants", action: "avoid excess nitrogen" },
    { problem: "Late ripening", action: "pick green if needed" },
    { problem: "Cool nights", action: "use season extenders" },
    { problem: "Weak sun", action: "give every available beam" },
    { problem: "Cold beds", action: "try black plastic mulch" }
  ],
  rhododendron: [
    { problem: "Plant decline", action: "planted too deep" },
    { problem: "Yellow leaves", action: "iron locked by pH" },
    { problem: "Brown drop", action: "root rot from wet soil" },
    { problem: "No flowers", action: "too much shade" },
    { problem: "Frosted buds", action: "late freeze damage" },
    { problem: "Wet feet", action: "raise the planting site" },
    { problem: "Dry first year", action: "water deeply weekly" },
    { problem: "Mulch rot", action: "keep bark off trunk" },
    { problem: "Alkaline soil", action: "acidify before planting" }
  ],
  squash: [
    { problem: "Powdery mildew", action: "expected by August" },
    { problem: "Sudden wilt", action: "check vine borer" },
    { problem: "Cold soil", action: "wait for 65°F" },
    { problem: "Poor transplanting", action: "direct seed when warm" },
    { problem: "Too many leaves", action: "avoid excess nitrogen" },
    { problem: "Small fruit", action: "water deeply" },
    { problem: "Oversized zucchini", action: "pick every few days" },
    { problem: "Winter squash late", action: "choose short-season types" },
    { problem: "Crowded vines", action: "give 4–6 feet" }
  ],
  strawberries: [
    { problem: "Slug damage", action: "bait before berries ripen" },
    { problem: "Crown rot", action: "planted too deep" },
    { problem: "Dry crowns", action: "planted too shallow" },
    { problem: "Few flowers", action: "too much nitrogen" },
    { problem: "Bird damage", action: "net before they notice" },
    { problem: "Distorted berries", action: "pollination or plant bugs" },
    { problem: "Everbearer lag", action: "plant Junebearers" },
    { problem: "Old patch", action: "renew after year four" },
    { problem: "Overripe fruit", action: "pick every 1–2 days" }
  ]
};

main();

function main() {
  mkdirSync(outputDir, { recursive: true });

  const articles = readdirSync(plantsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(plantsDir, entry.name, "index.md"))
    .filter((filePath) => filePath !== path.join(plantsDir, "index.md"))
    .map(readArticle)
    .sort((a, b) => a.slug.localeCompare(b.slug));

  for (const article of articles) {
    const panels = buildPanels(article);
    const output = renderPromptMarkdown(article, panels);
    writeFileSync(path.join(outputDir, `${article.slug}-problems-grid.md`), output);
  }

  console.log(`Generated ${articles.length} plant pin prompt files in ${path.relative(repoRoot, outputDir)}`);
}

function readArticle(filePath: string): Article {
  const raw = readFileSync(filePath, "utf8");
  const slug = path.basename(path.dirname(filePath));
  const { frontmatter, body } = parseMarkdown(raw);
  const permalink = frontmatter.permalink ?? `/${slug}/`;
  const landingUrl = `https://gettilth.com${permalink.replace(/\/$/, "")}`;

  return {
    slug,
    plantName: plantNames[slug] ?? inferPlantName(frontmatter.title, slug),
    landingUrl,
    permalink,
    frontmatter,
    body,
    sections: parseSections(body)
  };
}

function parseMarkdown(raw: string): { frontmatter: Frontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: raw };
  }

  const frontmatter: Frontmatter = {};
  for (const line of match[1].split("\n")) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) continue;
    frontmatter[field[1]] = field[2].replace(/^["']|["']$/g, "");
  }

  return { frontmatter, body: match[2] };
}

function parseSections(body: string): Map<string, string> {
  const sections = new Map<string, string>();
  const matches = [...body.matchAll(/^##\s+(.+)$/gm)];

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const next = matches[index + 1];
    const title = normalizeText(match[1]).toLowerCase();
    const start = (match.index ?? 0) + match[0].length;
    const end = next?.index ?? body.length;
    sections.set(title, body.slice(start, end).trim());
  }

  return sections;
}

function buildPanels(article: Article): Panel[] {
  // TODO: Move slug-specific calibration into data files once this prompt family expands.
  if (article.slug === "tomato") {
    return tomatoCalibrationPanels;
  }

  const calibratedPanels = fallbackBySlug[article.slug];
  if (calibratedPanels?.length >= 9) {
    return calibratedPanels.slice(0, 9);
  }

  const panels = [
    ...extractCommonProblems(article),
    ...extractArticleSpecificPanels(article),
    ...(calibratedPanels ?? [])
  ];

  return uniquePanels(panels).slice(0, 9);
}

function extractCommonProblems(article: Article): Panel[] {
  const section = article.sections.get("common problems");
  if (!section) return [];

  return section
    .split("\n")
    .filter((line) => line.trim().startsWith("- "))
    .map(panelFromBullet)
    .filter(Boolean) as Panel[];
}

function panelFromBullet(line: string): Panel | undefined {
  const clean = normalizeText(stripMarkdown(line.replace(/^-\s*/, "")));
  const [rawProblem, rawAction] = clean.split(/\s+[—-]\s+/, 2);
  if (!rawProblem || !rawAction) return undefined;

  return {
    problem: shortProblem(rawProblem),
    action: shortAction(rawAction)
  };
}

function extractArticleSpecificPanels(article: Article): Panel[] {
  const sourceSections = [
    "watering",
    "sun and soil",
    "when to plant",
    "planting depth — critical",
    "varieties that work",
    "varieties that work in the pnw",
    "adding heat",
    "harvest",
    "harvesting",
    "overwintering",
    "soil ph",
    "planting"
  ];

  // TODO: Add section-specific extractors for new article shapes instead of relying on keyword scans.
  const text = sourceSections
    .map((name) => article.sections.get(name))
    .filter(Boolean)
    .join("\n");

  const candidates: Panel[] = [];

  const rules: Array<[RegExp, Panel]> = [
    [/overhead watering|water at the soil line/i, { problem: "Wet leaves", action: "water at soil line" }],
    [/less than 6 hours|too much shade|insufficient sun/i, { problem: "Low light", action: "give more direct sun" }],
    [/excess nitrogen|too much nitrogen|high-nitrogen/i, { problem: "Too leafy", action: "avoid excess nitrogen" }],
    [/soil reaches 65°F|cold soil/i, { problem: "Cold soil", action: "wait for warm soil" }],
    [/soil reaches 60°F/i, { problem: "Cold soil", action: "wait for 60°F soil" }],
    [/pH|acidic|alkaline/i, { problem: "Wrong pH", action: "test soil before treating" }],
    [/mulch/i, { problem: "Dry soil", action: "mulch to steady moisture" }],
    [/direct seed|transplant/i, { problem: "Transplant shock", action: "time starts carefully" }],
    [/harvest|pick/i, { problem: "Harvest timing", action: "pick before quality drops" }]
  ];

  for (const [pattern, panel] of rules) {
    if (pattern.test(text)) candidates.push(panel);
  }

  return candidates;
}

function renderPromptMarkdown(article: Article, panels: Panel[]): string {
  const headline = `${article.plantName} problems — quick diagnosis (PNW)`;
  const subhead = "what your plant is telling you";
  const footerUrl = `GETTILTH.COM/${article.slug.toUpperCase()}`;
  const promptPanels = panels
    .map((panel, index) => `${index + 1}. ${panel.problem} → ${panel.action}`)
    .join("\n");

  return `# ${headline}

## Plant name
${article.plantName}

## Landing URL
${article.landingUrl}

## Pin headline
${headline}

## Pin subhead
${subhead}

## The 9 grid panels
${promptPanels}

## Final copy-paste DALL·E prompt

A Pinterest pin in a structured grid layout, editorial gardening style (Tilth brand).

Vertical 2:3 format (1000x1500).

TOP:
Large serif headline:
"${headline}"
Subhead:
"${subhead}"

MAIN SECTION:
3x3 grid of square panels (clean spacing)

Each panel contains:
- simple minimal illustration of ${article.plantName.toLowerCase()} issue
- short label (bold serif)
- 1-line explanation

Panels include:
${promptPanels}

STYLE:
- warm paper background (#f6efe5)
- muted earth tones (terracotta, brown, soft green accents only if needed)
- minimal, clean illustrations (not cartoonish)
- serif typography (editorial feel)
- soft borders or dividers between panels
- high readability at small size

FOOTER:
${footerUrl} (small, mono style)

No bright colors, no emojis, no clutter. Calm, premium, structured.
`;
}

function uniquePanels(panels: Panel[]): Panel[] {
  const seen = new Set<string>();
  const result: Panel[] = [];

  for (const panel of panels) {
    const key = panel.problem.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(panel);
  }

  return result;
}

function shortProblem(value: string): string {
  return normalizeText(value)
    .replace(/^Lots of /i, "")
    .replace(/^Tiny /i, "Tiny ")
    .replace(/\s+in\s+early\s+summer$/i, "")
    .split(/\s+/)
    .slice(0, 4)
    .join(" ");
}

function shortAction(value: string): string {
  return normalizeText(value)
    .replace(/\.$/, "")
    .replace(/\s*\([^)]*\)/g, "")
    .split(/\s+/)
    .slice(0, 7)
    .join(" ");
}

function stripMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function inferPlantName(title: string | undefined, slug: string): string {
  const fromTitle = title?.match(/^Growing\s+(.+?)\s+in\s+the\s+Pacific Northwest$/i)?.[1];
  if (fromTitle) return fromTitle;

  return slug
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
