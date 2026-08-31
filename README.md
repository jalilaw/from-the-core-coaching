# From The Core Coaching — Website

Marketing site for From The Core Coaching, LLC (Jayme Alilaw) — executive coach, keynote speaker, vocal artist. Static HTML/CSS/JS, no build step, deployed on Netlify from this repo.

Rebuilt from a Claude Design handoff bundle (`.dc.html` design references + `README.md` spec) into production HTML/CSS/JS. The original design spec's ground rules and tokens are preserved below for future edits.

## Structure

```
index.html                    homepage
resonant-voice.html           The Resonant Voice™ landing page
soul-chart-session.html       Soul Chart Session offering page
soul-chart-one-sheet.html     Soul Chart Session print one-sheet
speaker-one-sheet.html        1-page speaker one-sheet (print)
resonant-voice-one-sheet.html 2-page Resonant Voice one-sheet (print)
css/tokens.css                design tokens (colors, type, spacing) + base styles
css/main.css                  component styles for all pages
js/main.js                    mobile nav, testimonial carousel, forms, Credly loader
assets/                       images and logo marks
netlify.toml                  Netlify build config
```

## Design system

- **Colors:** charcoal `#2d2d2d`, rose `#a46161`, teal `#507076`, blush `#cebfb8`, off-white `#f8f8f8`. See `css/tokens.css`.
- **Type:** Cormorant Garamond (headings/quotes), Cinzel (eyebrows/labels/buttons, always uppercase + wide tracking), Jost (body).
- **Radius:** effectively zero everywhere except the testimonial carousel's circular arrows/dots. Don't soften the hard edges.
- **Structural rule:** `2px solid #507076` marks section boundaries (nav bottom, credential list top, footer top, one-sheet rules).
- Section vertical padding is deliberately tight (3rem, 4.5rem on mobile) — don't re-add whitespace.

## Forms

All three forms (main inquiry, newsletter, footer newsletter) submit to **Netlify Forms** via AJAX (`js/main.js`), with inline field-level validation (no `alert()`) and an inline success state that swaps the form out. Netlify detects these automatically from the static `data-netlify="true"` + hidden `form-name` markup — no server code needed. Submissions land in the site's Netlify dashboard under Forms; wire up email notifications there.

## Known gaps / follow-ups

1. **Photography credit** to Marsha N. Wilson Photography is implemented as a CSS `:hover` reveal on the four portrait photos (hero, about, organizations, contact) — confirm licensing before publishing further uses.
2. **Fonts** load from Google Fonts CDN; self-host for production if desired.
3. **Credly badge** (`data-share-badge-id="18f192da-e929-456e-abf8-68cf2a5063df"`) embed script loads at the end of `js/main.js`'s `DOMContentLoaded`, after the target div exists in the DOM — confirm the badge ID is still current.
4. The 13 testimonials in `index.html` and the carousel data are copied verbatim from the design handoff's `testimonialsData` array — don't rewrite this copy.
5. **`assets/rv-logo.png`** (the real Resonant Voice mark) has an opaque black background baked into the export rather than transparency — it reads fine as a dark badge on both the white hero panel and the charcoal one-sheet headers, but if a transparent version becomes available, swap it in for a cleaner look.
