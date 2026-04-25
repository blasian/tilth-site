# Pin design context — Tilth

You are designing Pinterest pins for **Tilth**, an iPhone app for Pacific Northwest gardeners. Each pin in this directory has its own brief; this file is the shared design and brand context that all of them inherit.

---

## What Tilth is

Tilth is a garden journal + AI diagnosis app for iPhone. Tagline: *"Your garden has a memory now."* The app logs weather, soil, plant species, and recent activity automatically, then assembles that context into structured plant-problem diagnoses on demand.

The Tilth landing page is at [gettilth.com](https://gettilth.com). The two articles these pins drive traffic to are:

- `gettilth.com/guide` — The Pacific Northwest Plant Diagnosis Guide
- `gettilth.com/plants` — The Pacific Northwest Plant Guide (12 plant cards)

---

## What these pins are for

Organic content marketing on Pinterest. The reader is searching for specific gardening help — *"yellow tomato leaves," "PNW pepper growing," "powdery mildew zucchini"* — and a pin that matches their search appears in the results. A great pin:

1. **Matches the search intent** in its title (titles are Pinterest's primary search signal)
2. **Looks scannable at thumbnail size** — readers decide in 2–3 seconds
3. **Promises useful, region-specific information** — PNW is the differentiator
4. **Earns the click** to the destination article

The reader is **not** looking for an app pitch. The pin should be useful content first. Tilth attribution lives in a small footer.

---

## Brand identity

### Name
**Tilth** — singular, capital T, no qualifier. Not "Tilth App" or "Tilth.io." Lowercase `tilth` is acceptable as a wordmark in some compositions.

### Voice
Editorial, not corporate. Honest, slightly understated. Direct without being curt. Lowercase preferred where natural (the app uses lowercase headings: *"diagnosis."*, *"settings."*). Sentence case for pin headlines unless brand-y.

No emoji on pins (descriptive text in Pinterest UI can use them sparingly; the pin image itself is emoji-free).

### Visual palette

Warm, earthen, paper-and-soil. Color values are OKLCH for fidelity; use the closest sRGB equivalent your tool supports.

| Token | OKLCH | Approx. hex | Use |
|---|---|---|---|
| `--paper` | `oklch(0.965 0.012 75)` | `#f6efe5` | Warm cream background (default) |
| `--paper-dim` | `oklch(0.93 0.015 72)` | `#ece1d2` | Subtle alt background |
| `--accent` | `oklch(0.54 0.125 40)` | `#b85f3c` | Terracotta — the brand accent |
| `--accent-deep` | `oklch(0.42 0.13 40)` | `#8e3d1f` | Deep terracotta for emphasis |
| `--accent-dim` | `oklch(0.88 0.04 45)` | `#ead2c0` | Pale terracotta for backgrounds |
| `--ink` | `oklch(0.22 0.018 55)` | `#2a201a` | Dark warm brown body text |
| `--ink-dim` | `oklch(0.38 0.014 55)` | `#52453d` | Secondary text |
| `--ink-mute` | `oklch(0.55 0.012 55)` | `#7e7268` | Muted text, labels, footers |
| `--rule` | `oklch(0.82 0.018 70)` | `#cfc3b3` | Divider lines |
| `--rule-soft` | `oklch(0.88 0.015 72)` | `#dcd0c0` | Subtle dividers |

The palette evokes **paper, terracotta soil, dark coffee-stain ink**. *Not* the typical garden-brand green/yellow/blue.

A green is used in the app icon for the sprout glyph (`oklch(0.58 0.12 130)` ≈ `#5e8a3e`). Reserve it strictly for sprout illustrations or the icon itself — never for body text or backgrounds.

### Typography

| Use | Font | Weight | Notes |
|---|---|---|---|
| Headlines / titles | **Source Serif 4** | Semibold (600) or Regular (400) | Both Google Fonts free |
| Subheads / body | Source Serif 4 | Regular (400) | |
| Labels / footers | **JetBrains Mono** | Medium (500) | Uppercase, +14% letter-spacing |

Fallback stack: New York → ui-serif → Source Serif 4 → Georgia. On Apple platforms New York is preferred (it's what the app uses); on cross-platform pins, Source Serif 4 is the canonical choice.

**Avoid:** sans-serifs (Inter, Helvetica, etc.); condensed fonts; script fonts; geometric display fonts.

### Logo / mark

Tilth wordmark = **Tilth** in Source Serif 4 Semibold, optionally preceded by the sprout-on-soil icon.

The app icon (sprout + 3 stripe layers in cream/terracotta/ochre/umber) lives at `/Users/spearman/code/tilth-site/assets/app-icon.png`. **Use the file** rather than recreating it.

---

## Pin format

- **1000 × 1500 px** vertical (2:3 ratio) — Pinterest's preferred size
- **PNG** preferred (typography stays crisp); JPG acceptable for photo-dominant pins
- File size **< 5 MB**

---

## Composition zones

Every pin uses a 5-zone vertical stack:

```
┌─────────────────────────────┐
│  BRAND ZONE                 │  ← Tilth wordmark, top
├─────────────────────────────┤
│  TITLE ZONE                 │  ← headline + subhead
│                             │
├─────────────────────────────┤
│  HERO ZONE (optional)       │  ← plant illustration / photo
│                             │
├─────────────────────────────┤
│  CONTENT ZONE               │  ← bullets, quick facts, tips
│                             │
│                             │
├─────────────────────────────┤
│  CALLOUT ZONE (optional)    │  ← gotcha / tip / quote
├─────────────────────────────┤
│  FOOTER ZONE                │  ← URL + attribution
└─────────────────────────────┘
```

Not every pin uses every zone, but the order is fixed. Generous whitespace between zones — pins should feel calm, not crammed.

---

## Templates

Three base templates cover all pin types. Each per-pin brief specifies which template applies.

### Template A — Growing-guide pin

For pins like *"PNW Tomato Growing Guide"*. Lives at `pin-briefs/plants/[plant]-growing.md`.

- Brand zone (small)
- Title (large serif) + 1-line subhead
- Hero zone — plant illustration or photo (~30% of canvas)
- Quick facts block — 4 lines, mono UPPERCASE label + serif body, e.g.:
  - `PLANT — after May 1, nights above 50°F`
  - `SUN — 8+ hours direct`
  - `WATER — 1–2 in/wk, deep, mulched`
  - `SOIL — pH 6.0–6.8, well-draining`
- PNW gotcha callout — terracotta accent (left border or background tint), italic body
- Footer URL — mono small, right-aligned

### Template B — Problems-list pin

For pins like *"5 Most Common Tomato Problems."* Lives at `pin-briefs/plants/[plant]-problems.md`.

- Brand zone
- Title + subhead
- Hero zone — small or skipped
- Bulleted list — 4–5 problems, each with bold problem name + short cause/action, e.g.:
  - **Yellow lower leaves** → check water before nitrogen
  - **Curling tops in summer** → heat stress or herbicide drift
- Optional gotcha callout
- Footer URL

### Template C — Diagnosis-question pin

For pins like *"Why Are My Tomato Leaves Yellow?"* Lives at `pin-briefs/diagnosis/symptoms-*.md` and `pin-briefs/diagnosis/causes-*.md`.

- Brand zone
- Title (the question or topic, large)
- Subhead (one-line teaser)
- Bulleted list of likely causes / fixes with short descriptions
- Optional "first check" callout
- Footer URL

---

## Per-pin brief format

Each brief is a markdown file with YAML frontmatter:

```yaml
---
filename: tomato-growing.png
landing-url: https://gettilth.com/plants#tomato
title: PNW Tomato Growing Guide | Tilth
description: When to plant tomatoes in the Pacific Northwest, what varieties work in cool summers, and how much sun and water they need. From the Tilth garden guide.
category: plant-growing | plant-problems | symptom | cause | hub
template: A | B | C
---
```

Followed by clearly labeled sections: **Headline**, **Subhead**, **Hero**, **Body**, **Callout**, **Footer URL**, **Notes**.

The `title` field is what appears as the pin's title on Pinterest itself (max 100 chars, search-optimized). The `description` field is the Pinterest description (max 500 chars, but shorter is better — 200 chars typical). Include the deep `landing-url` so readers land directly on the relevant section, not the top of the article.

---

## Tone for pin text

- **Specific over generic** — "9 days without rain" beats "drought stress"
- **Honest hedging** — "most likely" beats "definitely"
- **No hype** — "plant this in May" beats "transform your garden!"
- **Sentence case for headlines** unless intentionally brand-y
- **Em-dashes for asides**, not parentheses
- **PNW context where relevant** — Seattle, Pacific Northwest, "in our cool summers"

---

## Don'ts

- Don't use stock garden imagery clichés (generic green sprout on white, basket of fresh produce)
- Don't use saturated emoji-style colors — Tilth's palette is muted and warm
- Don't add app-pitch copy ("DOWNLOAD NOW", "Get the app today") on the pin
- Don't squeeze more than 6 content items into one pin
- Don't drop title text below ~36pt — Pinterest readers scan at thumbnail
- Don't use pure white (`#fff`) backgrounds — Tilth is paper cream
- Don't add hashtags on the pin image — those go in the Pinterest description, not the design
- Don't recreate the Tilth icon — use the file at `tilth-site/assets/app-icon.png`

---

## Output

For each brief, produce one pin image at the spec above. Save as the `filename` from the frontmatter. Variations (color shifts, layout adjustments) are welcome as long as they match the template + brand.

If a brief is unclear or under-specified, surface the question rather than guessing. The brand consistency across the series is more valuable than any single pin's polish.
