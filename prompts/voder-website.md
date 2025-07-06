
# Voder Pre-Launch Website Specification

The **voder.ai** website is a **high-concept, cinematic pre-launch site** designed to generate intrigue and signal a category-defining shift in how software is created.

## 🎯 Purpose

The website is a digital experience—not just a landing page. Its role is to:

- Create curiosity
- Introduce a new paradigm (source prompts → source code)
- Highlight Voder’s unique ability to intelligently modify code when prompts change
- Deliver an emotionally compelling, visually immersive story
- Impress founders, product leaders, and visionaries with brand confidence

## 👥 Audience

- Founders and Product Leaders
- CTOs and Engineering Managers
- Innovation sponsors and investors
- Strategic thinkers and system architects

The experience is designed for people who fund or influence the creation of software—not necessarily the engineers themselves.

## ✨ Tone and Feel

- Visionary  
- Strategic  
- Minimalist  
- Cinematic  
- High trust / premium  
- Inspired by [mont-fort.com](https://mont-fort.com/)

The experience should feel like a product teaser, film intro, and design manifesto in one.

## 🧭 Format: Custom-Built Interactive Homepage

The homepage is **not built with Reveal.js**, but rather a **custom scroll or interaction-based website**, likely using:

- **Framework**: SvelteKit (preferred) or Next.js
- **Animation**: GSAP for scroll-tied transitions and rhythm
- **3D / Motion**: Three.js or Threlte (for immersive conceptual scenes)
- **Visual Assets**: SVG, .glb/.gltf models, or layered compositing

## 🎨 Visual Design

| Element | Specification |
|---|---|
| **Colours** | Dark mode default. Charcoal or black backgrounds with soft neon or metallic accent tones (green, blue, purple). |
| **Typography** | Strategic, modern sans-serif (e.g., Inter, Suisse, custom). Use heavy weight for emphasis. |
| **Imagery** | Abstract 3D objects, evolving flows, conceptual metaphors (e.g. prompt transforms, route planning). |
| **Animation** | Cinematic pacing. GSAP-powered transitions, camera moves, morphs. Use inertia and easing for elegance. |
| **Audio (optional)** | Subtle ambient tones or synthetic chimes to mark moments (like final reveal). |
| **Spacing** | Large whitespace, balanced layout, slide-like flow without obvious “slides.” |

## 🏗️ Narrative Structure (Scroll or Scene-Based)

| Section | Content | Interaction |
|---|---|---|
| **1. Brand Entry** | Voder logo intro with glowing motion or orbiting 3D object | Auto-play or scroll-triggered 3D scene |
| **2. The Why** | “We believe software should start with intent...” | Text fade-in, cinematic pacing |
| **3. Problem Space** | Show chaos, bottlenecks, fragmentation | Abstract 3D or layered composition with noise and breakup |
| **4. Metaphor** | GPS vs Directions narrative | Visual of a car + route planning vs manual zig-zag paths |
| **5. Vision Flow** | Source Prompts → Voder → Code → Working Product | Flow diagram that animates or morphs step by step |
| **6. Prompt-Driven Iteration** | Highlight Voder’s ability to regenerate only what changes when prompts are modified | Visual diff or animated scene showing stable structure with key pieces adapting |
| **7. Outcome Focus** | What this enables: clarity, speed, alignment | Cards or tiles animating in, scroll-triggered |
| **8. Closing Moment** | “The Compiler for Prompts.” + “Coming Soon.” | Fade to black, visual signature, audio cue (optional) |

## 🚫 Explicit Exclusions

- No email form
- No social links
- No pricing or signup
- No navigation menu
- No technical docs or screenshots

This is a **narrative-first experience**.

## 🛠️ Technical Implementation Notes

- Use **SvelteKit + Threlte + GSAP** (or React + Three.js + GSAP as an alternative)
- All transitions and animations tied to scroll or scene load
- Lightweight assets optimised for mobile and performance
- Hosting via Vercel or Netlify
- SEO-ready with Open Graph tags, meta description, favicon
