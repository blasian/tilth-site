---
layout: guide
title: "The Pacific Northwest Plant Diagnosis Guide"
description: "A complete diagnostic framework for PNW gardeners — how to figure out what's wrong with your plant, with focused articles on every common symptom and underlying cause."
permalink: /guide/
---

*Your tomato leaves are yellow. Your pepper plant looks stunted. Slugs are eating everything overnight.*

Most plant problems are one of about thirty things. The trick isn't memorizing them — it's knowing how to triangulate between symptom, weather, soil, and plant species fast enough to act before the plant actually dies.

This guide is the diagnostic framework Pacific Northwest gardeners can use across the eight most common symptoms and six underlying cause categories. For PNW-specific growing notes per plant (when to plant, what varieties work, common problems), see the [plant guide](/plants/).

## Contents

1. [How diagnosis works](#how-it-works) — the framework
2. [Diagnose by symptom](#by-symptom) — start here when you've spotted something visible
3. [Diagnose by cause](#by-cause) — start here when you have a hypothesis to test
4. [The easy way](#the-easy-way) — let an app do the cross-referencing

---

## How diagnosis works {#how-it-works}

Diagnosing a plant problem isn't really about the symptom — it's about cross-referencing the symptom with everything else going on. The same yellowed leaf could be a dozen different things, and which one it actually is depends on details that mostly live in your head: what species, what soil, what weather, what changed recently. Most diagnostic mistakes come from skipping the cross-reference and matching a symptom to whatever cause feels most familiar.

### The four questions every diagnosis needs {#four-questions}

Whether you're using an app, asking a friend, or thinking it through alone, every plant diagnosis needs answers to four questions. Skip any of them and you're guessing.

**1. What's the species?** The same symptom means different things on different plants. Yellow leaves on a tomato usually point to nitrogen or water. Yellow leaves on kale are often natural senescence — kale sheds bottom leaves as it grows tall and there's nothing wrong. Heat stress on a pepper at 95°F is serious; on okra at 95°F it's normal. Species — and ideally variety — anchors everything else.

**2. What's the local weather been doing?** Most plant problems trace back to something the weather did in the past two weeks. A frost three weeks ago. A heat wave that lasted three days. Nine consecutive days without rain after a wet stretch. Plants integrate weather slowly, so today's symptom often reflects last week's weather — and most people don't remember the weather from three weeks back, let alone how it compares to normal for their zone.

**3. What's the soil situation?** Soil pH controls nutrient availability. Soil composition controls drainage. Fertilizer history controls salt buildup and how much excess nitrogen is in the system. None of this is visible from the surface. *"I don't know my pH"* is itself diagnostic information — it means pH stays on the differential until something rules it out.

**4. What changed recently?** The single most useful diagnostic question, and the one most people skip. Transplanted three weeks ago. Mulched last weekend. Neighbor sprayed Roundup on their lawn. New fertilizer. Switched watering schedules. Removed nearby shade. The plant's "before and after" tells you what it's reacting to — and if you didn't write any of this down, you're guessing.

Asking these four questions for every diagnosis, and remembering the answers across months of growing, is how good diagnosis happens. It's also a lot of cognitive load, which is why most people skip it and either guess or ask a chatbot for a generic checklist.

### Why generic advice doesn't work {#generic-advice}

Without the four questions answered, all you have is a symptom and a list of possibilities. Here's what that looks like in practice.

A typical query: *"My tomato leaves are turning yellow."*

A generic answer — what most search results, articles, and chatbot responses give:

> Possible causes include nitrogen deficiency, overwatering, underwatering, disease (early blight, septoria), nutrient lockout from pH imbalance, pest damage, viral infection, or natural senescence. Try fertilizing, check soil moisture, look for spots on the leaves, consider a soil test.

The user is back where they started — with more options and no clear next step.

A context-aware answer, with the four questions answered:

> Cherokee Purple tomato, planted six weeks ago, transplanted from greenhouse three weeks ago. Soil is heavy clay, pH 6.4, last fertilized two weeks before transplant. Past 14 days: 9 days without rain following 5 days of heavy rain on April 6–10; nighttime lows in the low 50s.
>
> Most likely cause: transplant shock compounded by water stress — roots haven't fully established yet, the heavy clay drained slowly after the wet stretch and is now overdrying. The pH is fine, the soil composition is normal, the weather pattern explains the timing. Action this week: water deeply at the soil line, mulch to even out moisture swings, hold off on fertilizer for another two weeks. Expect recovery.

The difference isn't that one is "smarter." Both come from the same kind of language model. The difference is that one has the inputs the diagnosis actually needs and the other doesn't.

---

## Diagnose by symptom {#by-symptom}

Start here when you can see what's wrong. Each symptom article walks through the most likely causes, how to tell them apart, and a "first check" prompt that narrows the diagnosis in under a minute.

- [**Yellow leaves**](/yellow-leaves) — the most-Googled plant problem. Means six different things depending on which leaves and how fast.
- [**Brown or crispy leaves**](/brown-leaves) — dead tissue. Question is whether it's finished or still spreading.
- [**Wilting plants**](/wilting-plants) — wilting in dry soil = thirsty. Wilting in wet soil = root or vascular trouble.
- [**Holes in leaves**](/holes-in-leaves) — something is eating it. In PNW, slugs are usually the answer.
- [**Spots on leaves**](/spots) — usually fungal, sometimes bacterial. Color and pattern identify which.
- [**Curling leaves**](/curling-leaves) — direction tells you the cause: down for water/heat, up for herbicide/virus.
- [**Stunted plants**](/stunted-plants) — comparison problem. All plants stunted? Bed cause. One plant stunted? Individual cause.
- [**No flowers / no fruit**](/no-flowers-no-fruit) — leaves but no production. PNW special: cool nights below 55°F drop tomato fruit set.

---

## Diagnose by cause {#by-cause}

Start here when you have a hypothesis to test. Each cause article walks through how to recognize the cause, which symptoms it produces, and how to fix it (per scenario when needed).

- [**Watering problems**](/watering) — over and under produce nearly identical symptoms. The diagnostic test fixes most cases.
- [**Sunlight issues**](/sunlight) — easiest cause to verify, slowest to recognize. PNW sun is weaker per hour than at lower latitudes.
- [**Nutrient deficiencies**](/nutrients) — most show as yellowing or distorted growth. The pattern identifies which nutrient.
- [**Pests**](/pests) — slugs, caterpillars, beetles, aphids. PNW slug pressure is constant.
- [**Diseases**](/diseases) — fungal (most common), bacterial, viral. Prevention beats treatment in every category.
- [**Environmental stress**](/environment) — heat, frost, wind, transplant shock. The cause people most often miss because it requires remembering what the weather was doing.

---

## The easy way {#the-easy-way}

Tilth is an iPhone app I built specifically to log [the four questions](#four-questions) in the background — so when something goes wrong, the diagnosis already has the context. You don't enter the data when the plant is struggling. You've already entered or auto-logged it weeks before.

### What Tilth does automatically {#what-tilth-does}

Each of the four questions maps to something Tilth handles automatically.

**Species — handled when you add the plant.** Add a plant by photo (Claude Vision identifies the species and pre-fills the growing profile) or by name (Tilth looks up sun preference, water needs, pH range, frost tolerance, and days to harvest). The species, variety, and planted date stay with the plant for life.

**Weather — auto-logged in the background.** Tilth uses Apple's WeatherKit to record local conditions every day: temps, rainfall, humidity, frost events. The first time you use it, the app backfills the past two weeks of historical weather so the diagnostic context is full from day one. You never enter weather data — it's just there.

**Soil — per bed, once.** Each bed gets a soil profile: composition (clay, loam, sand percentages), pH, drainage rating, and amendments over time. You fill it out once when you set up the bed and update it when you amend or test. Most people fill it in incrementally over a season, which works fine — Tilth tells you what's missing if a diagnosis would benefit from more.

**Recent changes — captured by photo check-ins.** This is where most apps stop being useful. Tilth lets you check in on a plant with a photo, optional note, and action tags: Watered, Fertilized, Pruned, Harvested, or a custom label. Each check-in is timestamped with the local weather at the time. Months later, the activity log shows exactly what was happening in the days leading up to a problem.

**The diagnosis — one tap.** When you ask "why isn't this growing?", Tilth assembles all four layers — species, weather, soil, recent activity — plus your specific concern, and sends it as a structured payload to Claude. What comes back is a ranked differential diagnosis with the specific evidence cited: *"Based on 9 days without rain following the April 6 storm, your clay soil drainage profile, and the transplant from April 17, the most likely cause is transplant shock with water stress."*

Not a chat window. Not a checklist. A specific diagnosis with the data it used.

### The honest version {#honest-version}

Tilth isn't magic. The LLM doing the reasoning is the same one anyone can query through ChatGPT. What makes Tilth different isn't the model — it's the structured context the app builds: weather, soil, species, recent activity, all assembled automatically and sent as input the model can actually reason over.

Pricing reflects that. Tilth is free to log unlimited plants, take unlimited check-in photos, and see weather alerts and condition warnings on up to three beds. The diagnostic feature is the premium part: three free diagnoses a month, then $4.99/month or $29.99/year for unlimited diagnoses and unlimited beds.

There's no account. No cloud sync. No email signup. Your garden data lives in a local database on your phone. Cancel the subscription and the data stays — there's nothing in anyone else's hands to lose.

If the four questions changed how you think about diagnosis, Tilth is the easy version of doing them every day. If they didn't, the guide is yours to keep regardless.
