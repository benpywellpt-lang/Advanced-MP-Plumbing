# Advanced MP Plumbing & Heating - design lock

**Design read:** single-page product-style landing for a Hornchurch plumbing and heating
firm (Essex homeowners, landlords, older customers), replicating the Base Power "Core"
page language: full-bleed hero, sticky scroll runway, word-by-word blur-in statements,
tile reveal, ON/OFF scene toggle, tape and marker accents on a warm dot-grid paper.
Built on the same engine as `../air-con-one` and re-skinned.

Dials: DESIGN_VARIANCE 8 / MOTION_INTENSITY 8 / VISUAL_DENSITY 4.

## Locks

- **Palette.** Paper `#f0eeeb` with 11px dot grid (kept from the reference; the brief is
  an explicit replication, so the warm-paper ban is overridden on purpose). Ink `#292826`.
  Brand petrol `#0f4450` (headings, dark scenes) and `#082a31` (footer). Primary CTA tint
  `#a8dcd7` with petrol text. One accent, copper `#c0521a` (4.7:1 under white text), for every hand-drawn mark,
  tape, chip and the heating-ON switch. OFF is cold slate `#4d626b`. Yellow only as the
  second chip tint and the review stars. `--error` red is reserved for form validation.
  The client has no existing identity (Trellix template site), so this palette is ours.
- **Shape.** 8px buttons/inputs, 16px cards, 24px big media boxes, pill for toggle,
  chips and step numbers. Same scale as the reference.
- **Type.** Geist 400/500/600/700 for everything (stand-in for PP Neue Montreal).
  Caveat 700 for the script "tape" and "Meet" moments (stand-in for Dahlia Blues).
- **Motion.** Scroll-progress driven via CSS custom properties (`--p` on the runway,
  `--sp` per section), ease-settle `cubic-bezier(.22,1,.36,1)`, reduced-motion turns
  every scrub into a static layout.
- **The switch.** "Heating ON / OFF": the same cutaway house, warm and lit vs. cold and
  blue. The OFF image was generated as an edit of the ON image so the two register.
  The finale inverts the reference: a cold wash lifts and the street warms up.
- **Call bar.** Below 1024px the nav has no phone button and hides on scroll, so a floating
  bar (Call + Free estimate) fills the gaps: it appears once the hero has gone and steps
  aside whenever a section CTA, the form or the footer is on screen. Never two CTAs stacked.
- **Logo.** None exists. The nav uses a type lockup with a simple droplet mark.
- **Imagery.** The live site has no photography at all (only a Gas Safe badge and an
  IoP logo), so every photo, illustration and icon is a generated stand-in. The Gas Safe badge is
  the one real asset, taken from the client's site.

## Verified facts vs. deliberate omissions

Verified (adv-mpplumbing.co.uk, Companies House):
- Advanced MP Plumbing & Heating Ltd, company no. 08693541, incorporated 17 Sep 2013,
  active. Director Patrick George Hasted.
- Gas Safe registered, no. 77903.
- Phones 01708 475 041 and 07930 149 046. Email pat@adv-mpplumbing.co.uk.
- Mill Park Avenue, Hornchurch, Essex. The house number is left off, as on their own
  site, because it is a home address.
- No call-out charge, free estimates, 1 year guarantee on parts and labour, OAP
  discounts, "fully qualified, insured, vetted and polite", engineers throughout Essex,
  all emergency work.
- Services: full central heating installations, full bathroom suites, repairs and
  upgrades, landlord certificates, power flushing, water softeners supplied and fitted,
  toilets and drains unblocked, leaks and burst pipes, toilets/sinks/taps, radiators
  and pipes.
- "Over 27 years of experience": their wording. The live site dates from around 2009,
  so the true figure is now higher. Used as a floor; confirm the current number.

Omitted on purpose:
- "Established in Hornchurch for the last 17 years" (stale by the same logic).
- "Age Concern approved" (Age Concern became Age UK in 2009; needs re-confirming).
- Institute of Plumbing membership (the IoP became the CIPHE in 2008; needs confirming).
- 24/7 or out-of-hours claims. The site says "all emergency work" but never gives hours.
- Prices. The HaMuch listing shows hourly rates but they are modelled, not the client's.
- Customer reviews. None are published anywhere; the deck holds labelled placeholders.
