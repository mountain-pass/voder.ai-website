
# Voder Pre-Launch Website Specification

The **voder.ai** website is a **minimalist, single-page, pre-launch site** designed to generate intrigue without revealing detailed product information.

## 🎯 Purpose

The website exists to signal that something significant is coming in the world of software creation and delivery. It creates a sense of mystery and anticipation while hinting at a fundamental shift in how applications will be built in the future.

## 👥 Audience

The website is intended for:

- Founders and Product Leaders
- CTOs and Engineering Managers
- Creators, innovators, and problem solvers who fund or shape software projects
- Decision-makers who care about speed to market, quality, and alignment between business vision and software delivery

The tone and content are crafted to resonate with people who **pay for software to get built**, not necessarily the developers themselves.

## ✨ Tone and Feel

The tone of the site is:

- Visionary  
- Outcome-focused  
- Strategic  
- Minimalist  
- Conceptual  

The language is declarative, crisp, and designed to speak to business needs, not technical features.

## 🧭 Homepage Format: Pitch Deck

The homepage **is a linear pitch deck**, built using [Reveal.js](https://revealjs.com/).  
This format is intentionally chosen for the pre-launch phase, allowing tight narrative control, deep intrigue, and a presentation-style reveal of the Voder vision.

This replaces a traditional scroll-based homepage.

Later, as the product matures, this deck can be moved to `/deck` and a more conventional landing page introduced.

## 🎨 Visual Design (Optimised for Decision Makers)

| Element | Specification |
|---|---|
| **Colour palette** | Dark mode is default. Black or deep grey backgrounds with executive accents: deep blues, metallic greys, or muted purples. |
| **Typography** | Modern, clean sans-serif fonts with strong hierarchy. Headings feel strategic. |
| **Imagery** | Conceptual vector graphics, abstract flows, roadmap visuals. |
| **Animation** | Professional and subtle. Smooth fades, slide-ins, and progress animations. |
| **Layout** | Slide-based (Reveal.js). Each idea gets its own slide, with generous spacing and visual contrast. Use https://mont-fort.com/ for inspiration (3d animations and animated transitions) |

## 🏗️ Slide Architecture (Reveal.js)

| Slide | Description |
|---|---|
| **1. Title** | Voder logo + subtitle (e.g., “From Intent to Implementation”) |
| **2. The Why** | “We believe software should start with intent, not syntax...” |
| **3. The Problem** | Current pain points of translating vision into code |
| **4. The Metaphor** | GPS vs Passenger Seat metaphor (destination vs directions) |
| **5. The Vision** | Prompt → Voder → Application Source Code → Working App |
| **6. How Voder Is Different** | Not another code generator. Works from your intent. |
| **7. What This Enables** | Focus on outcomes, speed to market, brand integrity |
| **8. Closing Slide** | “Coming Soon. voder.ai” or simply “Voder. 2025.” |

## 🚫 Explicit Exclusions

The voder.ai website does not include:

- Email capture forms  
- Waitlist or sign-up calls-to-action  
- Social media links  
- Product screenshots  
- Pricing information  
- Navigation menus  

## 🛠️ Technical Implementation Notes

The website is:

- Built with Reveal.js (self-contained HTML)
- Fast-loading (static hosting recommended)
- Fully mobile responsive (Reveal.js config adjusted)
- SEO-primed with basic meta tags: title, description, Open Graph preview
