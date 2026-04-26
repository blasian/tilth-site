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
  const commonProblemPanels = extractCommonProblems(article);
  if (commonProblemPanels.length >= 9) {
    return commonProblemPanels.slice(0, 9);
  }

  const panels = [...commonProblemPanels, ...extractArticleSpecificPanels(article)];

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
  return trimWords(
    normalizeText(value)
    .replace(/^Lots of /i, "")
    .replace(/^Tiny /i, "Tiny ")
      .replace(/\s+in\s+early\s+summer$/i, ""),
    6
  );
}

function shortAction(value: string): string {
  const firstSentence = normalizeText(value)
    .replace(/\s*\([^)]*\)/g, "")
    .match(/^[^.!?]+[.!?]?/)?.[0] ?? value;

  return trimWords(
    firstSentence.replace(/[.!?]$/, ""),
    8
  );
}

function trimWords(value: string, maxWords: number): string {
  const trailingWords = new Set([
    "and",
    "at",
    "by",
    "during",
    "for",
    "from",
    "in",
    "of",
    "on",
    "or",
    "the",
    "to",
    "with"
  ]);
  const words = value.split(/\s+/).filter(Boolean);
  let clipped = words.slice(0, maxWords);

  while (clipped.length > 1 && trailingWords.has(clipped[clipped.length - 1].toLowerCase())) {
    clipped = clipped.slice(0, -1);
  }

  return clipped.join(" ").replace(/[,;:]$/, "");
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
