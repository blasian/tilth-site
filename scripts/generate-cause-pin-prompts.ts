import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type Frontmatter = Record<string, string>;

type Article = {
  slug: string;
  causeName: string;
  landingUrl: string;
  frontmatter: Frontmatter;
  body: string;
  sections: Map<string, string>;
};

type Panel = {
  problem: string;
  action: string;
};

const repoRoot = process.cwd();
const causesDir = path.join(repoRoot, "causes");
const outputDir = path.join(repoRoot, "pin-prompts", "causes");

const ignoredTopLevelSections = new Set([
  "plant-specific notes",
  "pnw-specific notes",
  "pnw-specific environmental issues",
  "related",
  "how to identify environmental stress"
]);

main();

function main() {
  mkdirSync(outputDir, { recursive: true });

  const articles = readdirSync(causesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(causesDir, entry.name, "index.md"))
    .map(readArticle)
    .sort((a, b) => a.slug.localeCompare(b.slug));

  for (const article of articles) {
    const panels = buildPanels(article);
    const output = renderPromptMarkdown(article, panels);
    writeFileSync(path.join(outputDir, `${article.slug}-guide.md`), output);
  }

  console.log(`Generated ${articles.length} cause pin prompt files in ${path.relative(repoRoot, outputDir)}`);
}

function readArticle(filePath: string): Article {
  const raw = readFileSync(filePath, "utf8");
  const slug = path.basename(path.dirname(filePath));
  const { frontmatter, body } = parseMarkdown(raw);
  const permalink = frontmatter.permalink ?? `/${slug}/`;
  const landingUrl = `https://gettilth.com${permalink.replace(/\/$/, "")}`;

  return {
    slug,
    causeName: inferCauseName(frontmatter.title, slug),
    landingUrl,
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
  if (article.slug === "diseases") {
    return panelsFromSubsections(article, ["fungal diseases", "bacterial diseases", "viral diseases"]);
  }

  if (article.slug === "pests") {
    return panelsFromSubsections(article, ["chewers", "suckers", "borers", "soil pests"]);
  }

  if (article.slug === "nutrients") {
    return panelsFromSubsections(article, ["common deficiencies and signs"]);
  }

  return panelsFromTopLevelSections(article, ignoredTopLevelSections);
}

function panelsFromSubsections(article: Article, sectionTitles: string[]): Panel[] {
  return sectionTitles.flatMap((sectionTitle) => {
    const section = findSection(article, sectionTitle);
    if (!section) return [];

    return parseSubsections(section)
      .map(([title, subsection]) => panelFromSection(title, subsection))
      .filter(Boolean) as Panel[];
  });
}

function panelsFromTopLevelSections(article: Article, ignoredSections: Set<string>): Panel[] {
  return [...article.sections.entries()]
    .filter(([title]) => !ignoredSections.has(title))
    .map(([title, section]) => panelFromSection(title, section))
    .filter(Boolean) as Panel[];
}

function panelFromSection(title: string, section: string): Panel | undefined {
  const cleanPanelTitle = cleanTitle(stripMarkdown(title));
  const clue = extractClue(cleanPanelTitle, section);
  if (!clue) return undefined;

  return {
    problem: shortProblem(cleanPanelTitle),
    action: shortAction(stripMarkdown(clue))
  };
}

function findSection(article: Article, titlePrefix: string): string | undefined {
  return [...article.sections.entries()].find(([title]) => title.startsWith(titlePrefix))?.[1];
}

function parseSubsections(section: string): Array<[string, string]> {
  const matches = [...section.matchAll(/^###\s+(.+)$/gm)];

  return matches.map((match, index) => {
    const next = matches[index + 1];
    const start = (match.index ?? 0) + match[0].length;
    const end = next?.index ?? section.length;
    return [match[1], section.slice(start, end).trim()];
  });
}

function extractClue(title: string, section: string): string | undefined {
  if (title.toLowerCase() === "diagnostic test") {
    return "Wet soil means wait; dry soil means water deeply";
  }

  if (title.toLowerCase() === "how to measure your sun") {
    return "Count direct sun hours on a clear day";
  }

  const source = title.toLowerCase().startsWith("fix:")
    ? section
    : section.split(/\n\*\*(?:Control|Manage|Fix):\*\*/)[0];

  const pattern = source.match(/\*\*Pattern:\*\*\s*([^\n]+)/);
  if (pattern?.[1]) return pattern[1];

  const patternBlock = source.match(/\*\*Pattern:\*\*\s*\n([\s\S]*?)(?=\n\n|$)/);
  if (patternBlock) {
    const firstPatternBullet = patternBlock[1].match(/^-\s+([^\n]+)/m);
    if (firstPatternBullet) return firstPatternBullet[1];
  }

  const symptomSection = parseSubsections(source).find(([heading]) => normalizeText(heading).toLowerCase() === "symptoms");
  if (symptomSection) {
    const symptomClue = extractClue(title, symptomSection[1]);
    if (symptomClue) return symptomClue;
  }

  if (title.toLowerCase().startsWith("fix:")) {
    const numbered = section.match(/^\d+\.\s+\*\*([^*]+)\*\*\s*(?:[—-]\s*)?([^\n]*)/m);
    if (numbered) return `${numbered[1]}${numbered[2] ? ` — ${numbered[2]}` : ""}`;
  }

  const firstBullet = source.match(/^-\s+([^\n]+)/m);
  if (firstBullet) return firstBullet[1];

  const introParagraph = source
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .find((part) => part && !part.startsWith("###") && !part.startsWith("**Control:") && !part.startsWith("**Manage:") && !part.startsWith("**Fix:"));
  if (introParagraph && !introParagraph.startsWith("- ") && !introParagraph.match(/^\d+\./)) return introParagraph;

  const boldLead = source.match(/^\*\*([^*]+)\*\*\s*(?:[—-]\s*)?([^\n]*)/m);
  if (boldLead) return `${boldLead[1]}${boldLead[2] ? ` — ${boldLead[2]}` : ""}`;

  const boldLeadBullet = source.match(/^-\s+\*\*([^*]+)\*\*\s*(?:[—-]\s*)?([^\n]*)/m);
  if (boldLeadBullet) return `${boldLeadBullet[1]}${boldLeadBullet[2] ? ` — ${boldLeadBullet[2]}` : ""}`;

  const firstNumbered = source.match(/^\d+\.\s+([^\n]+)/m);
  if (firstNumbered) return firstNumbered[1];

  return introParagraph;
}

function renderPromptMarkdown(article: Article, panels: Panel[]): string {
  const headline = inferHeadline(article.frontmatter.title, article.causeName);
  const subhead = `${panels.length} signs and fixes for PNW gardens`;
  const footerUrl = `GETTILTH.COM/${article.slug.toUpperCase()}`;
  const promptPanels = panels
    .map((panel, index) => `${index + 1}. ${panel.problem} → ${panel.action}`)
    .join("\n");

  return `# ${article.causeName} — guide pin (PNW)

## Cause name
${article.causeName}

## Landing URL
${article.landingUrl}

## Pin headline
${headline}

## Pin subhead
${subhead}

## The ${panels.length} guide panels
${promptPanels}

## Final copy-paste DALL·E prompt

A Pinterest pin in a structured educational guide layout, editorial gardening style (Tilth brand).

Vertical 2:3 format (1000x1500).

TOP:
Large serif headline:
"${headline}"
Subhead:
"${subhead}"

HERO:
A clean, realistic garden diagnostic illustration representing ${article.causeName.toLowerCase()}, with visible plant symptoms and simple visual comparison cues.

MAIN SECTION:
Compact multi-panel guide grid with clean spacing. Use ${panels.length} panels, grouped in balanced rows.

Each panel contains:
- simple minimal illustration of the sign, pest, disease, or fix
- short label (bold serif)
- 1-line diagnostic clue or action

Panels include:
${promptPanels}

STYLE:
- warm paper background (#f6efe5)
- muted earth tones (terracotta, brown, soft green, pale yellow accents only if needed)
- minimal, clean illustrations (not cartoonish)
- serif typography (editorial feel)
- soft borders or dividers between panels
- high readability at small size

FOOTER:
${footerUrl} (small, mono style)

No bright colors, no emojis, no clutter. Calm, premium, structured.
`;
}

function shortProblem(value: string): string {
  return capitalizeFirst(trimWords(normalizeText(value), 6));
}

function shortAction(value: string): string {
  const firstSentence = normalizeText(value)
    .replace(/^-\s*/, "")
    .replace(/\s+[→]\s+/g, " = ")
    .replace(/\s*\([^)]*\)/g, "")
    .match(/^[^.!?]+[.!?]?/)?.[0] ?? value;

  return trimWords(firstSentence.replace(/[.!?]$/, ""), 16);
}

function trimWords(value: string, maxWords: number): string {
  const trailingWords = new Set(["and", "at", "by", "during", "for", "from", "in", "of", "on", "or", "the", "to", "with"]);
  const words = value.split(/\s+/).filter(Boolean);
  let clipped = words.slice(0, maxWords);

  while (clipped.length > 1 && trailingWords.has(clipped[clipped.length - 1].toLowerCase())) {
    clipped = clipped.slice(0, -1);
  }

  return clipped.join(" ").replace(/[,;:]$/, "");
}

function cleanTitle(value: string): string {
  return normalizeText(value)
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/^the\s+/i, "")
    .replace(/^fix for\s+/i, "Fix: ")
    .replace(/^pH\b/i, "pH")
    .replace(/^pnw\b/i, "PNW")
    .replace(/\s+\/\s+/g, " / ");
}

function capitalizeFirst(value: string): string {
  if (/^pH\b/.test(value)) return value;
  return value ? value[0].toUpperCase() + value.slice(1) : value;
}

function stripMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*/g, "");
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function inferHeadline(title: string | undefined, causeName: string): string {
  return normalizeText(title ?? causeName).replace(/\s+[—-]\s+.*$/, "");
}

function inferCauseName(title: string | undefined, slug: string): string {
  if (title) {
    return inferHeadline(title, slug)
      .replace(/^Plant\s+/i, "")
      .replace(/\s+in\s+the\s+Pacific\s+Northwest$/i, "")
      .replace(/\s+for\s+Plants$/i, "")
      .replace(/\s+Problems$/i, " problems");
  }

  return slug
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
