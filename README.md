# Advanced MP Plumbing & Heating

Single-page site for Advanced MP Plumbing & Heating Ltd (Hornchurch, Essex). Hand-written
HTML, CSS and vanilla JS, no build step. Deploys straight to Netlify from this folder.

## Files

- `index.html` - the page. Sections are in scroll order; copy lives here.
- `styles.css` - tokens at the top, then one block per section. Motion is driven by
  `--p` (hero runway) and `--sp` (each `[data-scrub]` section), set by the script.
- `script.js` - scroll engine, chapter rail, nav, hero tape swap, guided "Learn more"
  tour, mobile sheet, form validation.
- `success.html` - Netlify form thank-you page.
- `privacy.html` - privacy policy, linked from the footer and the estimate form.
- `assets/img/` - generated stand-in photography, illustrations and icons.
- `DESIGN.md` - the design lock and the facts checklist.

## Dev aids

Append to the URL while previewing:

- `?static=1` - static layout, no scroll effects (also what reduced-motion users get)
- `?p=0.6` - freeze the hero runway at 60% progress
- `?focus=.mp-witness&sp=0.8` - show one section frozen at 80% progress
- `?at=1200` - jump to a scroll position on load

Preview locally with `python -m http.server 4197` from this folder (launch config
`advanced-mp`). Screenshots of scrolled states come back blank in both the Browser pane
and headless Edge; use `?p=` and `?focus=` instead, which keep scroll at 0.

## Before launch

1. Replace the six placeholder cards in the reviews deck with real customer reviews
   (search `Placeholder` in `index.html`).
2. Confirm the experience figure ("over 27 years" is from the old site) and whether
   Age Concern / Age UK approval and CIPHE membership still stand. See DESIGN.md.
3. Add the Gas Safe badge next to the registration number (the client's own site has
   one at `sitebuildercontent/sitebuilderpictures/gas-safe.jpg`, 213x236).
4. Swap generated photos for real job photos as they come in; the hero, the boiler
   shot and the bathroom matter most.
5. The estimate form posts to Netlify Forms (`name="estimate"`). Enable notifications
   so submissions reach pat@adv-mpplumbing.co.uk.
