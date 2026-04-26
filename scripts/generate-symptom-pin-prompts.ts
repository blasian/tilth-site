import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type Frontmatter = Record<string, string>;

type Article = {
  slug: string;
  symptomName: string;
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
const symptomsDir = path.join(repoRoot, "symptoms");
const outputDir = path.join(repoRoot, "pin-prompts", "symptoms");

main();

function main() {
  mkdirSync(outputDir, { recursive: true });

  const articles = readdirSync(symptomsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(symptomsDir, entry.name, "index.md"))
    .map(readArticle)
    .sort((a, b) => a.slug.localeCompare(b.slug));

  for (const article of articles) {
    const panels = buildPanels(article);
    const output = renderPromptMarkdown(article, panels);
    writeFileSync(path.join(outputDir, `${article.slug}-diagnosis.md`), output);
  }

  console.log(`Generated ${articles.length} symptom pin prompt files in ${path.relative(repoRoot, outputDir)}`);
}

function readArticle(filePath: string): Article {
  const raw = readFileSync(filePath, "utf8");
  const slug = path.basename(path.dirname(filePath));
  const { frontmatter, body } = parseMarkdown(raw);
  const permalink = frontmatter.permalink ?? `/${slug}/`;
  const landingUrl = `https://gettilth.com${permalink.replace(/\/$/, "")}`;

  return {
    slug,
    symptomName: inferSymptomName(frontmatter.title, slug),
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
  const likelyCauses = article.sections.get("likely causes");
  if (!likelyCauses) return [];

  return [...likelyCauses.matchAll(/^###\s+(.+?)\s*\n([\s\S]*?)(?=^###\s+|(?![\s\S]))/gm)]
    .map((match) => panelFromCauseSection(match[1], match[2]))
    .filter(Boolean) as Panel[];
}

function panelFromCauseSection(title: string, section: string): Panel | undefined {
  const pattern = section.match(/\*\*Pattern:\*\*\s*([^\n]+)/);
  const fix = section.match(/\*\*Fix:\*\*\s*([^\n]+)/);
  if (!pattern && !fix) return undefined;

  return {
    problem: shortProblem(cleanCauseTitle(stripMarkdown(title))),
    action: shortAction(stripMarkdown(pattern?.[1] ?? fix?.[1] ?? ""))
  };
}

function renderPromptMarkdown(article: Article, panels: Panel[]): string {
  const headline = inferHeadline(article.frontmatter.title, article.symptomName);
  const subhead = `${panels.length} causes, one fast first check`;
  const callout = buildDiagnosticCallout(article);
  const gridLayout = panels.length <= 6 ? "2x3 grid" : "compact 2-column diagnosis grid";
  const footerUrl = `GETTILTH.COM/${article.slug.toUpperCase()}`;
  const promptPanels = panels
    .map((panel, index) => `${index + 1}. ${panel.problem} → ${panel.action}`)
    .join("\n");

  return `# ${article.symptomName} — quick diagnosis (PNW)

## Symptom name
${article.symptomName}

## Landing URL
${article.landingUrl}

## Pin headline
${headline}

## Pin subhead
${subhead}

## Diagnostic callout
${callout}

## The ${panels.length} diagnosis panels
${promptPanels}

## Final copy-paste DALL·E prompt

A Pinterest pin in a structured diagnosis layout, editorial gardening style (Tilth brand).

Vertical 2:3 format (1000x1500).

TOP:
Large serif headline:
"${headline}"
Subhead:
"${subhead}"

HERO:
A close, realistic illustration of ${article.symptomName.toLowerCase()} on garden plants, with the key visual patterns easy to compare.

CALLOUT:
Small terracotta-accent diagnostic box:
"${callout}"

MAIN SECTION:
${gridLayout} (clean spacing)

Each panel contains:
- simple minimal illustration of the yellow-leaf pattern
- short cause label (bold serif)
- 1-line diagnosis clue

Panels include:
${promptPanels}

STYLE:
- warm paper background (#f6efe5)
- muted earth tones (terracotta, brown, soft green, pale yellow)
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
  return trimWords(normalizeText(value), 6);
}

function shortAction(value: string): string {
  const firstSentence = normalizeText(value)
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

function cleanCauseTitle(value: string): string {
  return normalizeText(value)
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s+\/\s+/g, " / ");
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

function buildDiagnosticCallout(article: Article): string {
  const firstCheck = [...article.sections.entries()]
    .find(([title]) => title.startsWith("first check"))?.[1];

  if (!firstCheck) return "Start with the pattern, then match the likely cause.";

  const bullets = firstCheck
    .split("\n")
    .filter((line) => line.trim().startsWith("- "))
    .map((line) => shortCallout(stripMarkdown(line.replace(/^-\s*/, ""))));

  if (bullets.length > 0) {
    return `First check: ${bullets.slice(0, 3).join(". ")}`;
  }

  const firstSentence = normalizeText(firstCheck).match(/^[^.!?]+[.!?]?/)?.[0];
  return firstSentence ? `First check: ${firstSentence.replace(/[.!?]$/, "")}` : "Start with the pattern, then match the likely cause.";
}

function shortCallout(value: string): string {
  const [left, right] = value.split(/\s+[—-]\s+/, 2);
  if (!left || !right) return trimWords(value, 12);
  return `${trimWords(left, 5)} = ${trimWords(right, 7)}`;
}

function inferHeadline(title: string | undefined, symptomName: string): string {
  return normalizeText(title ?? symptomName)
    .replace(/\s+[—-]\s+.*$/, "")
    .replace(/\s*\([^)]*\)\s*$/, "");
}

function inferSymptomName(title: string | undefined, slug: string): string {
  if (title) {
    return inferHeadline(title, slug)
      .replace(/^Why\s+(?:Are|Is)\s+My\s+/i, "")
      .replace(/\?$/i, "")
      .replace(/\s+on\s+Plants$/i, "");
  }

  return slug
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
