/* Advanced MP Plumbing & Heating - scroll engine
   Reports scroll progress into CSS custom properties; the stylesheet owns the choreography.
     --p  on <main>            progress through the pinned hero runway
     --sp on each [data-scrub] progress through that section
   Everything degrades to a static layout when JS is off or motion is reduced. */
(() => {
  "use strict";

  const main = document.querySelector(".mp");
  const runway = document.querySelector(".mp-runway");
  if (!main || !runway) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mdUp = window.matchMedia("(min-width: 768px)");
  const lgUp = window.matchMedia("(min-width: 1024px)");
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const vh = () => window.innerHeight;

  /* ---------- runway ---------- */
  const HERO_OUT_AT = 0.1355, HERO_BACK_AT = 0.1152;
  let runTop = 0, runSpan = 1, lastP = -1;
  const measureRunway = () => {
    runTop = runway.getBoundingClientRect().top + window.scrollY;
    runSpan = Math.max(1, runway.offsetHeight - vh());
    lastP = -1;
  };
  const scrubRunway = () => {
    const p = clamp01((window.scrollY - runTop) / runSpan);
    if (Math.abs(p - lastP) < 0.001) return;
    lastP = p;
    main.style.setProperty("--p", p.toFixed(4));
    if (p >= HERO_OUT_AT) main.dataset.heroOut = "true";
    else if (p <= HERO_BACK_AT) delete main.dataset.heroOut;
  };

  /* ---------- sections ---------- */
  const wide = (el) => (el.closest("[data-wide]") ? lgUp : mdUp).matches;
  const mode = (s) => (!wide(s.el) && s.el.dataset.scrubSm) || s.el.dataset.scrub;
  const screenH = (el) => {
    const sc = el.querySelector("[data-screen]");
    return sc ? sc.offsetHeight : vh();
  };
  const sections = [...document.querySelectorAll("[data-scrub]")].map((el) => ({
    el, base: 0, span: 1, last: -1, live: false,
    flipAt: Number(el.dataset.flip) || 0,
    flipEl: el.dataset.flip ? el.querySelector("input[type='checkbox']") : null,
    flipSide: -1,
    steps: Number(el.dataset.steps) || 0, stepNow: -1,
    cueAt: -1, cueOn: false,
  }));
  const byEl = new Map(sections.map((s) => [s.el, s]));

  const measureSections = () => {
    const h = vh();
    for (const s of sections) {
      const cue = (!wide(s.el) && s.el.dataset.cueSm) || s.el.dataset.cue;
      s.cueAt = cue === undefined ? -1 : Number(cue);
      const top = s.el.getBoundingClientRect().top + window.scrollY;
      if (mode(s) === "runway") {
        s.base = top;
        s.span = Math.max(1, s.el.offsetHeight - screenH(s.el));
        s.el.style.removeProperty("--sv");
      } else {
        // "travel": progress from the section entering the viewport to it leaving
        s.base = top - h;
        s.span = Math.max(1, Math.min(s.el.offsetHeight + h, document.documentElement.scrollHeight - top));
        s.el.style.setProperty("--sv", (h / s.span).toFixed(4));
      }
      s.last = -1;
    }
  };
  const scrubSection = (s) => {
    const t = clamp01((window.scrollY - s.base) / s.span);
    if (Math.abs(t - s.last) < 0.001) return;
    applyState(s, t);
  };
  const applyState = (s, t) => {
    s.last = t;
    s.el.style.setProperty("--sp", t.toFixed(4));
    if (s.flipEl) {
      const side = t >= s.flipAt ? 1 : 0;
      if (side !== s.flipSide) { s.flipSide = side; s.flipEl.checked = side === 0; }
    }
    if (s.steps) {
      const st = Math.min(s.steps - 1, Math.floor(t * s.steps));
      if (st !== s.stepNow) { s.stepNow = st; s.el.dataset.step = String(st); }
    }
    if (s.cueAt >= 0) {
      const on = t >= s.cueAt;
      if (on !== s.cueOn) { s.cueOn = on; s.el.toggleAttribute("data-cued", on); }
    }
  };
  const liveIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const s = byEl.get(e.target);
      if (!s) continue;
      s.live = e.isIntersecting;
      s.el.toggleAttribute("data-live", s.live);
      s.last = -1;
      if (on && !frozen) scrubSection(s);
    }
  }, { rootMargin: "12% 0px 12% 0px" });
  for (const s of sections) liveIO.observe(s.el);

  /* ---------- reveals (enter once) ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("is-in");
      revealIO.unobserve(e.target);
    }
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  const revealTargets = document.querySelectorAll("[data-reveal], [data-reveal-line], [data-reveal-head]");

  /* ---------- reviews deck: gather offsets ---------- */
  const deck = document.querySelector("[data-gather]");
  const measureDeck = () => {
    if (!deck || !lgUp.matches) return;
    const [sx, sy] = deck.dataset.gather.split(" ").map(Number);
    const cards = [...deck.querySelectorAll(".mp-say-card")];
    const cx = deck.clientWidth / 2, cy = deck.clientHeight / 2;
    const mid = (cards.length - 1) / 2;
    cards.forEach((c, i) => {
      c.style.setProperty("--gx", (cx + sx * (i - mid) - c.offsetLeft - c.offsetWidth / 2).toFixed(1));
      c.style.setProperty("--gy", (cy + sy * (i - mid) - c.offsetTop - c.offsetHeight / 2).toFixed(1));
    });
  };

  /* ---------- chapter rail ---------- */
  const rail = document.querySelector(".mp-rail");
  const chapters = [
    { at: () => runTop, dark: [0, 1] },                                            // hero
    { at: () => runTop + runSpan * HERO_OUT_AT },                                   // statement
    { at: () => runTop + runSpan * 0.5524, dark: [0.55, 1] },                       // tile reveal
    { sel: ".mp-meet" }, { sel: ".mp-bp" }, { sel: ".mp-witness", dark: [0.34, 0.8] },
    { sel: ".mp-how" }, { sel: ".mp-fact", dark: [0.17, 0.45] }, { sel: ".mp-crew" },
    { sel: ".mp-quote" }, { sel: ".mp-say", dark: [0, 1] }, { sel: ".mp-specs" }, { sel: ".mp-faq" },
    { sel: ".mp-nf", dark: [0, 1] },
  ];
  let edges = [], lastAi = -1;
  const measureRail = () => {
    edges = chapters.map((c) => c.sel ? document.querySelector(c.sel).getBoundingClientRect().top + window.scrollY : c.at());
    edges.push(document.documentElement.scrollHeight);
    lastAi = -1;
  };
  const scrubRail = () => {
    if (!rail || !edges.length) return;
    const y = window.scrollY + vh() * 0.35;
    let i = 0;
    while (i < edges.length - 2 && y >= edges[i + 1]) i++;
    const frac = clamp01((y - edges[i]) / Math.max(1, edges[i + 1] - edges[i]));
    const ai = Math.min(chapters.length - 0.5, Math.max(0, i + frac - 0.5));
    if (Math.abs(ai - lastAi) < 0.002) return;
    lastAi = ai;
    rail.style.setProperty("--ai", ai.toFixed(3));
    const d = chapters[i].dark;
    rail.style.setProperty("--rail-ink", d && frac >= d[0] && frac < d[1] ? "1" : "0");
  };

  /* ---------- nav: transparent over the hero photo, solid paper after it,
     slides fully out of view while scrolling down and back in on scroll up ---------- */
  const nav = document.querySelector(".mp-nav");
  let lastY = window.scrollY, navHidden = false, sheetOpen = false;
  const scrubNav = () => {
    const y = window.scrollY;
    if (sheetOpen) { lastY = y; return; }
    const overHero = !main.dataset.heroOut && y < vh() * 0.9;
    nav.classList.toggle("is-over-media", overHero);
    nav.classList.toggle("is-solid", !overHero);
    const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (goingDown && y > vh() && !navHidden) { navHidden = true; main.dataset.navHidden = "true"; }
    else if ((goingUp || y < 40) && navHidden) { navHidden = false; delete main.dataset.navHidden; }
    lastY = y;
  };

  /* ---------- main loop ---------- */
  let on = false, raf = 0, frozen = false;
  const frame = () => {
    raf = 0;
    if (!on || frozen) return;
    scrubRunway();
    for (const s of sections) if (s.live) scrubSection(s);
    scrubRail();
    scrubNav();
  };
  const tick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  const measureAll = () => { measureRunway(); measureSections(); measureDeck(); measureRail(); tick(); };

  const setOn = (v) => {
    on = v;
    main.classList.toggle("mp-x", v);
    if (v) {
      measureAll();
      for (const t of revealTargets) revealIO.observe(t);
    } else {
      main.style.removeProperty("--p");
      delete main.dataset.heroOut;
      for (const s of sections) {
        s.el.style.removeProperty("--sp"); s.el.style.removeProperty("--sv");
        s.el.removeAttribute("data-live"); s.el.removeAttribute("data-cued"); delete s.el.dataset.step;
      }
      for (const t of revealTargets) { t.classList.add("is-in"); revealIO.unobserve(t); }
      nav.classList.remove("is-over-media"); nav.classList.add("is-solid");
    }
  };
  const dev = new URLSearchParams(location.search);
  setOn(!reduce.matches && !dev.has("static"));
  reduce.addEventListener?.("change", (e) => setOn(!e.matches));
  // dev aids (screenshots of scroll states without scrolling):
  //   ?p=0.3                      freeze the runway at progress 0.3, hide everything after it
  //   ?focus=.mp-bp&sp=0.4        show only that section, frozen at progress 0.4
  //   ?at=1200                    jump to a scroll position once laid out
  if (dev.has("p") || dev.has("focus")) {
    frozen = true;
    for (const t of revealTargets) t.classList.add("is-in");
    if (dev.has("p")) {
      const p = clamp01(Number(dev.get("p")));
      main.style.setProperty("--p", p.toFixed(4));
      if (p >= HERO_OUT_AT) main.dataset.heroOut = "true";
      document.querySelector(".mp-after").style.display = "none";
      nav.classList.toggle("is-over-media", p < HERO_OUT_AT);
      nav.classList.toggle("is-solid", p >= HERO_OUT_AT);
    } else {
      const sel = dev.get("focus");
      runway.style.display = "none";
      for (const el of document.querySelectorAll(".mp-after > section")) if (!el.matches(sel)) el.style.display = "none";
      const host = document.querySelector(sel);
      const scrubEl = host.matches("[data-scrub]") ? host : host.querySelector("[data-scrub]");
      const s = scrubEl && byEl.get(scrubEl);
      if (s) { s.el.setAttribute("data-live", ""); applyState(s, clamp01(Number(dev.get("sp") || 0))); }
      nav.classList.remove("is-over-media"); nav.classList.add("is-solid");
    }
  } else if (dev.has("at")) {
    const go = () => { measureAll(); window.scrollTo(0, Number(dev.get("at")) || 0); tick(); };
    window.addEventListener("load", () => { go(); setTimeout(go, 400); });
  }

  window.addEventListener("scroll", tick, { passive: true });
  let rto = 0;
  const onResize = () => { clearTimeout(rto); rto = setTimeout(() => { if (on) measureAll(); }, 120); };
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
  window.addEventListener("load", () => { if (on) measureAll(); });
  if (document.fonts?.ready) document.fonts.ready.then(() => { if (on) measureAll(); });
  new ResizeObserver(onResize).observe(document.body);

  /* ---------- hero: the tape swaps the winter evening for a summer morning ---------- */
  const egg = document.querySelector("[data-hero-egg]");
  const altShot = document.querySelector(".mp-hero-alt");
  const heroStage = document.querySelector(".mp-stage-hero");
  if (egg && altShot && heroStage) {
    let flipped = false;
    egg.addEventListener("click", () => {
      if (reduce.matches) return;
      flipped = !flipped;
      if (flipped && !altShot.src) altShot.src = altShot.dataset.src;
      heroStage.classList.toggle("mp-hero-flip", flipped);
      egg.setAttribute("aria-pressed", String(flipped));
    });
  }

  /* ---------- "Learn more": a guided scroll through the first chapters ---------- */
  const learn = document.querySelector("[data-learn-more]");
  if (learn) {
    const beats = [
      { y: () => runTop + runSpan * 0.30, dwell: 1400 },
      { y: () => runTop + runSpan * 0.92, dwell: 1400 },
      { sel: ".mp-meet", p: 0.55, dwell: 1600 },
      { sel: ".mp-bp", p: 0.125, dwell: 900 },
      { sel: ".mp-bp", p: 0.375, dwell: 900 },
      { sel: ".mp-bp", p: 0.625, dwell: 900 },
      { sel: ".mp-bp", p: 0.875, dwell: 1000 },
      { sel: ".mp-witness .mp-witness-catch", p: 0.5, dwell: 900 },
      { sel: ".mp-witness .mp-witness-catch", p: 0.93, dwell: 1300 },
      { sel: ".mp-how", p: 0.98, dwell: 1200 },
    ];
    let touring = false, cancel = null;
    const target = (b) => {
      if (b.y) return b.y();
      const el = document.querySelector(b.sel);
      const s = byEl.get(el);
      return s ? s.base + s.span * b.p : el.getBoundingClientRect().top + window.scrollY;
    };
    const glide = (to, speed) => new Promise((res) => {
      const from = window.scrollY, dist = to - from;
      const dur = Math.min(2600, Math.max(600, Math.abs(dist) / speed));
      const t0 = performance.now();
      const step = (now) => {
        if (!touring) return res(false);
        const k = clamp01((now - t0) / dur);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        window.scrollTo(0, from + dist * e);
        if (k < 1) requestAnimationFrame(step); else res(true);
      };
      requestAnimationFrame(step);
    });
    const wait = (ms) => new Promise((res) => { const id = setTimeout(res, ms); cancel = () => { clearTimeout(id); res(); }; });
    const stop = () => { touring = false; cancel?.(); document.documentElement.classList.remove("mp-touring"); };
    const tour = async () => {
      if (touring) return;
      touring = true;
      document.documentElement.classList.add("mp-touring");
      for (const b of beats) {
        if (!touring) break;
        if (on) measureAll();
        const ok = await glide(target(b), 1.1);
        if (!ok) break;
        await wait(b.dwell);
      }
      stop();
    };
    learn.addEventListener("click", (e) => {
      if (reduce.matches || !on) return;
      e.preventDefault();
      tour();
    });
    for (const ev of ["wheel", "touchstart", "keydown", "pointerdown"]) {
      window.addEventListener(ev, (e) => {
        if (!touring) return;
        if (ev === "pointerdown" && e.target === learn) return;
        stop();
      }, { passive: true });
    }
  }

  /* ---------- mobile nav sheet ---------- */
  const burger = document.querySelector(".mp-nav-burger");
  const sheet = document.getElementById("nav-sheet");
  if (burger && sheet) {
    const setSheet = (open) => {
      sheetOpen = open;
      sheet.dataset.open = String(open);
      sheet.style.height = open ? sheet.firstElementChild.scrollHeight + "px" : "0px";
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) { nav.classList.remove("is-over-media"); nav.classList.add("is-solid"); }
      else if (on && !frozen) scrubNav();
    };
    burger.addEventListener("click", () => setSheet(sheet.dataset.open !== "true"));
    sheet.addEventListener("click", (e) => { if (e.target.closest("a")) setSheet(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && sheet.dataset.open === "true") setSheet(false); });
  }

  /* ---------- quote form: inline validation ---------- */
  const form = document.querySelector(".mp-form");
  if (form) {
    const status = form.querySelector(".mp-form-status");
    const email = form.querySelector("#q-email");
    const emailError = form.querySelector("#q-email-error");
    // optional email: blank passes, anything typed must look like an address
    const emailOk = () => !email || email.value.trim() === "" || email.validity.valid;
    const showEmailError = (bad) => {
      if (!email) return;
      emailError.hidden = !bad;
      email.setAttribute("aria-invalid", bad ? "true" : "false");
    };
    form.addEventListener("submit", (e) => {
      const requiredOk = [...form.querySelectorAll("[required]")].every((f) => f.validity.valid);
      const okEmail = emailOk();
      showEmailError(!okEmail);
      if (requiredOk && okEmail) return;
      e.preventDefault();
      if (!requiredOk) {
        status.textContent = "Please fill in your name, phone number and postcode so we can call you back.";
        form.querySelector("[required]:invalid")?.focus();
      } else {
        status.textContent = "";
        email.focus();
      }
    });
    form.addEventListener("input", (e) => {
      if (e.target === email && emailOk()) showEmailError(false);
      if (form.checkValidity()) status.textContent = "";
    });
  }
})();
