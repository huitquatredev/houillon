# Landing‑3 (Barrique UI Kit) — Astro implementation plan

Reference: https://barrique-ui-kit.webflow.io/home-page/landing-3

## 1. Scope

**In**

- One page at `/` reproducing the horizontal-scrolling landing (14 panels).
- Vertical scroll → horizontal track, with the original pacing and smoothing.
- Parallax/marquee effects, masked line reveals, image reveals.
- Micro-interactions: bottle colour switcher, glass-photo hover, growing button underline.
- Responsive behaviour identical to the source (horizontal ≥ 992 px, stacked ≤ 991 px).
- Local assets (images + video) and self-hosted fonts.
- Reduced-motion / no-JS fallback, keyboard access.

**Out (explicitly dropped)**

- Navbar, full-screen menu, logo switcher.
- Custom cursor (`.pointer`, `cursor: none`).
- Template pop-up ("Buy Now").
- Newsletter form submission (the panel is kept as a visual block only).
- Other pages, Webflow badge, jQuery/Webflow runtime.

---

## 2. How the original actually works (measured, not guessed)

Structure at 989×696:

| Element | Role | Computed |
| --- | --- | --- |
| `.contact-section.content-wrap-copy.about-copy` | scroll runway | `height: 700vh` (600vh ≥1440px) |
| `.horizontal-div-wrapper._2` | sticky viewport | `position: sticky; top: 0; height: 100vh; overflow: hidden` |
| `.overflow-mask` | clipping | overflow hidden |
| `.horizontal-scrollable-section.about` | horizontal track | `width: 800vw`, `display: flex` |
| `.horizontal-content` | flex row of panels | 8000 px at a 1000 px viewport |

The Webflow interaction (`PAGE_SCROLL`, smoothing 95) translates the track
**0 % → −87 %** of its own width (≈ 6960 px at a 1000 px viewport) while the
page scrolls 4200 px (600 vh). That is **≈ 1.66 px horizontal per 1 px vertical**,
with heavy smoothing.

Important: the track is **not** a native horizontal scroll container. There is no
`overflow-x` scrolling, no drag, no snap. It is a pure scroll-linked transform,
exactly what GSAP ScrollTrigger's `pin` + `scrub` reproduces.

### 2.1 Panel inventory (left → right)

Base widths below 1440 px; the `≥1440` column lists overrides.

| # | Element | Base | ≥1440 | Content |
| --- | --- | --- | --- | --- |
| 1 | `.container-grid` | 30vw | 20vw | bottle PNG on white (`m1.png`), enters with `x:-50%; scale:.75` |
| 2 | `.wrapper-heading` | 70vw | – | `TRADITION` / `passion` (right-aligned) / `FLAVORS` — 25vh Italiana, line-height .78/.9, uppercase |
| 3 | `.image-wrapper` | 34vw | – | portrait vineyard photo, bottom-aligned |
| 4 | `.text-wrapper.intro-second` | 40vw | auto | quote, 4.5vh Italiana, padding 100/140 |
| 5 | `.container-about-landing-2` | 100vw | 80vw | black panel, cellar photo pinned right, `care of details` in white 150px (140px ≥1440) |
| 6 | `.container-paragraph._2` | 550px + 80px margin | – | label `identity` (wine, underlined), 4vh quote, 14px uppercase note |
| 7 | `.container-intro` | 40vw | – | huge `a unique experience of plesant sensation` (13vh, absolute) + 55vh square image acting as a "window" with a white duplicate of the text on top |
| 8 | `.container-paragraph` | 550px | – | two 14px uppercase paragraphs + `View More` |
| 9 | `.video-background._2` | 100vw | – | full-viewport looping video + `rgba(255,255,255,.55)` veil |
| 10 | `.container-paragraph.in` | 550px | – | one paragraph, bottle image that swaps Red/White, `View More` |
| 11 | `.container-image` | 74vh | – | tall glass photo; two extra photos slide up on switcher hover |
| 12 | `.container-intro` (2nd) | 40vw | – | two 55vh squares (`3.jpg`, `4.jpg`) drifting vertically (20 % → −11 %) |
| 13 | `.bg-start` | 100vw | – | full-viewport photo + `extraordinary identity` marquee (−67 % → +6 %), 54 % black, nowrap |
| 14 | `.contact-grid-card-text` | 542px | – | `Subscribe to our newsletter` + form → **visual only / optional** |

All panels are direct flex children. Because their nominal widths add up to
~825vw inside an 800vw track, several of them **flex-shrink** (e.g.
`.container-about-landing-2` renders 874 px instead of 1000 px at 1000 px
viewport). To stay pixel-faithful, port the width rules as they are and keep
`flex-wrap: nowrap` (the original uses `wrap-reverse`, which only works by
accident).

### 2.2 Animation inventory (from the IX2 data)

| Effect | Target | Range | Values |
| --- | --- | --- | --- |
| Master horizontal scroll | track | 0 → 100 % | `x: 0% → −87%` (of 800vw), smoothing 95 |
| Load intro | bottle | on load | `x:-50% → 0`, `scale .75 → 1`, fade |
| Load intro | 3 headline lines | on load, staggered | mask + `y: 100% → 0` |
| Line parallax | line 1 & 3 | by ~20 % of the track | `x: 0 → −38px` |
| Line parallax | line 2 (`passion`) | by ~20 % | `x: 0 → +93px` |
| Paragraph nudge | one content block | at ~95 % | `x: −217px` |
| Marquee | `extraordinary identity` | 59 % → 100 % | `x: −67% → +6%` |
| Vertical drift | gallery squares | 68 % → 100 % | `y: +20% → −11%` |
| Background | `<body>` | 0–80 % → 100 % | `#fff` → `#0d0d0d` |
| Reveals | headings / blocks / images | on entering viewport | mask-y 100 %, y 100px + fade, scale 0.9→1 |

### 2.3 Design tokens

```
--black:    #2c2c2c
--black-2:  #0d0d0d
--dark-red: #920707
--white:    #ffffff
```

- Display font: **Italiana** 400 (uppercase for headings).
- UI/body: **Kumbh Sans** 300 (paragraphs), 400 (buttons), 700 (button labels).
- Type is set in `vh`/`vw` on purpose (`25vh` headlines, `13vh` big text,
  `1.2vw` labels) — keep that, it is core to the look.

### 2.4 Assets (all small, ~4 MB total)

| Local file | Source | Size |
| --- | --- | --- |
| `bottle-hero.png` | `…/5f88225b697f3c2cfc23b0fe_m1.png` | 242 KB |
| `vineyard.jpg` | `…/5f88225b697f3c55f823b137_1 (2).jpg` | 128 KB |
| `cellar.jpg` | `…/5f88225b697f3c268423b13d_2.jpg` | 26 KB |
| `square-1.jpg` | `…/5f88225b697f3c704323b0c1_1.jpg` | 117 KB |
| `square-2.jpg` | `…/5f88225b697f3cb45223b12b_3.jpg` | 183 KB |
| `square-3.jpg` | `…/5f88225b697f3c3f7e23b0c3_4.jpg` | 270 KB |
| `about-bg.jpg` | `…/5f88225b697f3c638123b133_about0.jpg` | 145 KB |
| `bottle-red.png` | `…/5f88225b697f3c80e223b125_m8.png` | 208 KB |
| `bottle-white.png` | `…/5f88225b697f3c220b23b13c_m3.png` | 214 KB |
| `glass-1.jpg` | `…/5f88225b697f3c00ec23b0e0_glass7.jpg` | 38 KB |
| `glass-2.jpg` | `…/5f88225b697f3c03cb23b145_hover1.jpg` | 51 KB |
| `glass-3.jpg` | `…/5f88225b697f3cce5123b140_hover2.jpg` | 62 KB |
| `barrique.mp4` | `…/5f88225b697f3c33b823b0d9_barrique-transcode.mp4` | 2.3 MB |
| `barrique-poster.jpg` | `…/5f6db7dce1b16c55767eafbf_barrique-poster-00001.jpg` | – |

Base host: `https://assets-global.website-files.com/5f88225b697f3c2ab623b070/`
(video/poster on `https://cdn.prod.website-files.com/...`).

---

## 3. Stack decision

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | **Astro 5**, static, TypeScript | zero runtime, `.astro` components, scoped CSS, Vite bundling for GSAP |
| Scroll animation | **GSAP 3 + ScrollTrigger** | `pin` + `scrub` + `containerAnimation` is a 1:1 match for the Webflow model |
| Smoothing | **Lenis** (optional) | reproduces Webflow's `smoothing: 95`; official ScrollTrigger integration |
| Styling | **plain CSS** + custom properties + BEM-ish classes | the layout is vh/vw-tuned; utility classes would fight it |
| Fonts | `@fontsource/italiana`, `@fontsource/kumbh-sans` | no Google CDN, no FOUT |
| Assets | local `/public` | avoid hotlinking a template CDN |

No React/Vue islands. GSAP is imported from a module `<script>` in the page, so
Astro bundles and tree-shakes it.

---

## 4. Project structure

```
houillon/
├─ astro.config.mjs
├─ package.json
├─ public/
│  ├─ images/landing3/*.jpg|png
│  ├─ video/barrique.mp4
│  └─ video/barrique-poster.jpg
└─ src/
   ├─ layouts/Base.astro          # html/head/fonts/global css
   ├─ pages/index.astro           # page assembly + script import
   ├─ components/landing/
   │  ├─ Landing.astro            # section + track wrapper
   │  ├─ panels/
   │  │  ├─ HeroBottle.astro
   │  │  ├─ Headline.astro
   │  │  ├─ PhotoPanel.astro
   │  │  ├─ Quote.astro
   │  │  ├─ CareOfDetails.astro
   │  │  ├─ Identity.astro
   │  │  ├─ BlackHeadline.astro
   │  │  ├─ Statement.astro
   │  │  ├─ VideoPanel.astro
   │  │  ├─ BottlePicker.astro
   │  │  ├─ GlassPanel.astro
   │  │  ├─ Gallery.astro
   │  │  ├─ Marquee.astro
   │  │  └─ Newsletter.astro   # optional
   │  └─ shared/{MaskedLine,Button}.astro
   ├─ data/landing3.ts            # copy + asset constants
   ├─ scripts/
   │  ├─ landing.ts               # entry: matchMedia, init
   │  ├─ horizontal.ts            # pin + master tween
   │  ├─ reveals.ts               # containerAnimation reveals
   │  ├─ parallax.ts              # marquee, drift, line nudges, bg
   │  ├─ micro.ts                 # bottle switcher, glass hover, buttons
   │  └─ smooth.ts                # Lenis
   └─ styles/
      ├─ tokens.css
      ├─ base.css
      └─ landing.css
```

---

## 5. Implementation steps

### Step 0 — Scaffold

```bash
npm create astro@latest . -- --template minimal --install --no-git
npx astro add tailwind --yes      # optional, not required — skip if you prefer
npm i gsap lenis @fontsource/italiana @fontsource/kumbh-sans
```

Download assets into `public/images/landing3/` (script in the repo, run once).

### Step 1 — Tokens & base CSS

`src/styles/tokens.css`

```css
:root {
  --black: #2c2c2c;
  --black-2: #0d0d0d;
  --dark-red: #920707;
  --white: #fff;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --panel-h: 100vh;
}
```

`src/styles/base.css` — reset, `body { margin:0; background:#fff; color:var(--black-2); }`,
`img { display:block; max-width:none; }`, `.mask { overflow:hidden; }`.

Fonts in `Base.astro`:

```ts
import "@fontsource/italiana/400.css";
import "@fontsource/kumbh-sans/300.css";
import "@fontsource/kumbh-sans/400.css";
import "@fontsource/kumbh-sans/700.css";
```

### Step 2 — Markup

Keep the DOM shallow and the class names close to the source so the CSS can be
ported almost verbatim.

```astro
<section class="l3" data-landing>
  <div class="l3__track" data-landing-track>
    <HeroBottle />
    <Headline />
    <PhotoPanel />
    <Quote />
    <CareOfDetails />
    <Identity />
    <BlackHeadline />
    <Statement />
    <VideoPanel />
    <BottlePicker />
    <GlassPanel />
    <Gallery />
    <Marquee />
    <Newsletter />   <!-- optional -->
  </div>
</section>
```

Heading lines always use the mask pattern:

```astro
<div class="mask">
  <h1 class="l3-headline__line" data-reveal="line">TRADITION</h1>
</div>
```

### Step 3 — Layout CSS

```css
.l3 {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: transparent;
}

.l3__track {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;       /* not wrap-reverse */
  height: 100%;
  width: 800vw;
  will-change: transform;
}
```

Panel widths (exact source values):

```css
.p-bottle      { width: 30vw; display:flex; align-items:center; justify-content:center; height:100%; }
.p-headline    { width: 70vw; height:100%; padding-inline:80px; display:flex; flex-direction:column;
                 justify-content:center; align-items:center; }
.p-photo       { width: 34vw; height:100%; display:flex; }
.p-quote       { width: 40vw; height:100%; padding:0 140px 8rem 100px; display:flex;
                 flex-direction:column; justify-content:flex-end; }
.p-care        { width: 100vw; height:100%; background:#000 url(/images/landing3/cellar.jpg) 100%/auto 100% no-repeat;
                 display:flex; align-items:flex-end; padding:0 0 8em 8em; }
.p-identity    { width:550px; margin-left:80px; margin-right:80px; padding:80px 100px; }
.p-blackhead   { width:40vw; padding:50px 60px; align-self:center; position:relative; }
.p-statement   { width:550px; margin-right:80px; padding:80px 100px; }
.p-video       { width:100vw; height:100vh; position:relative; }
.p-picker      { width:550px; margin-right:40px; padding:80px 100px; }
.p-glass       { width:74vh; height:100vh; position:relative; overflow:hidden; }
.p-gallery     { width:40vw; padding:50px 60px; align-self:center; }
.p-marquee     { width:100vw; height:100vh; position:relative;
                 background:url(/images/landing3/about-bg.jpg) 50%/cover; }
.p-newsletter  { width:542px; padding:34px 140px; }
```

Breakpoint override at `min-width:1440px` (container-grid 20vw, care panel 80vw,
headings 140px, black paragraphs 20px/600px, `@media` block copied from the
source) and the ≤991/767/479 blocks (full vertical stack, 18vh/12vh/19vw
headline sizes, 40px/100px paddings …). Copy those exactly from
`barrique-ui-kit.webflow.*.css`.

Two source quirks to fix rather than reproduce:

- the bottle is a background image at `-190%` **and** a hidden `<img>`; render
  one `<img>` in panel 1;
- `.container-grid`'s `flex-shrink` is needed, so keep `width:30vw` (no
  `flex: none`) — do not add `flex-shrink: 0` or the track will grow to ~825vw.

### Step 4 — Pin + master horizontal tween

`src/scripts/horizontal.ts`

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initHorizontal(root: HTMLElement, track: HTMLElement) {
  const distance = () => track.scrollWidth - window.innerWidth;

  // 600vh of scroll below 1440px, 500vh above — matches the source's 700vh/600vh sections
  const runway = () =>
    window.innerWidth >= 1440 ? window.innerHeight * 5 : window.innerHeight * 6;

  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: () => `+=${runway()}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.9,          // Webflow smoothing: 95
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  return tween;
}
```

Why this and not CSS `sticky` + a scrub trigger:

- `pin` + `pinSpacing` creates the 600vh runway itself, so the section stays
  `100vh` tall (no double-height bug when mixing sticky with a 700vh parent).
- `containerAnimation` (next step) requires exactly this kind of standalone,
  scrubbed x-tween.

`invalidateOnRefresh: true` + `ScrollTrigger.refresh()` on `document.fonts.ready`
and after the video metadata keeps the end distance correct on resize.

### Step 5 — Reveals with `containerAnimation`

```ts
export function initReveals(scrollTween: gsap.core.Tween) {
  gsap.utils.toArray<HTMLElement>('[data-reveal="line"]').forEach((line) => {
    gsap.from(line, {
      yPercent: 110,
      duration: 1.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: line.parentElement,
        containerAnimation: scrollTween,
        start: "left 92%",
        toggleActions: "play none none reverse",
      },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal="up"]').forEach((el) => {
    gsap.from(el, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        containerAnimation: scrollTween,
        start: "left 88%",
        toggleActions: "play none none reverse",
      },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal="image"]').forEach((el) => {
    gsap.from(el, {
      scale: 1.12,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        containerAnimation: scrollTween,
        start: "left 95%",
        toggleActions: "play none none reverse",
      },
    });
  });
}
```

On load, an intro timeline replays the source's initial state:

```ts
const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
intro
  .from(".js-hero-bottle", { xPercent: -50, scale: 0.75, opacity: 0, duration: 1.4 }, 0)
  .from(".js-headline .line-inner", { yPercent: 110, duration: 1.2, stagger: 0.1 }, 0.15);
```

### Step 6 — Parallax

Use `containerAnimation` on each element so the values are relative to the
panel's own pass through the viewport (very close to the Webflow keyframes).

```ts
export function initParallax(scrollTween: gsap.core.Tween) {
  // marquee: −67% → +6% of its own width
  gsap.fromTo(".js-marquee-text",
    { xPercent: -67 },
    { xPercent: 6, ease: "none",
      scrollTrigger: { trigger: ".js-marquee", containerAnimation: scrollTween,
                       start: "left right", end: "right left", scrub: true } });

  // two square photos drift up
  gsap.fromTo(".js-gallery",
    { yPercent: 20 },
    { yPercent: -11, ease: "none",
      scrollTrigger: { trigger: ".js-gallery", containerAnimation: scrollTween,
                       start: "left right", end: "right left", scrub: true } });

  // headline line nudges (−38 / +93 px in the source)
  gsap.fromTo(".js-line-1, .js-line-3",
    { x: 0 }, { x: -38, ease: "none",
      scrollTrigger: { trigger: ".js-headline", containerAnimation: scrollTween,
                       start: "left right", end: "center center", scrub: true } });

  gsap.fromTo(".js-line-2",
    { x: 0 }, { x: 93, ease: "none",
      scrollTrigger: { trigger: ".js-headline", containerAnimation: scrollTween,
                       start: "left right", end: "center center", scrub: true } });
}
```

Body background: white until 80 % of the pin, then `#0d0d0d`.

```ts
gsap.timeline({
  scrollTrigger: { trigger: "[data-landing]", start: "top top",
                   end: () => `+=${runway}`, scrub: 0.9 },
}).to("body", { backgroundColor: "#0d0d0d", ease: "none", duration: 0.2 }, 0.8);
```

### Step 7 — Micro-interactions

- **Bottle switcher** (`.js-btn-red`, `.js-btn-white`): crossfade
  `bottle-red.png` / `bottle-white.png` inside `.p-picker` with
  `yPercent: 4 → 0`, `opacity`, 0.5 s `power2.out`; active dot state.
- **Glass panel**: `glass-2.jpg` / `glass-3.jpg` are absolutely stacked and
  start at `yPercent: 100; opacity: 0`; hovering the matching switcher slides
  the right one in (`yPercent: 0`), leaving the other out.
- **Buttons**: underline `scaleX: 0 → 1` from the left, 0.4 s; label colour
  stays `--dark-red`; `cursor: pointer` (no custom cursor).
- All hover states gated behind `@media (hover: hover) and (pointer: fine)`.

### Step 8 — Smooth scrolling (Lenis)

```ts
import Lenis from "lenis";

const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

Do not stack a high Lenis `lerp` with a high ScrollTrigger `scrub`: `lerp 0.1`
+ `scrub 0.9` feels like the source. Destroy Lenis in the `matchMedia` cleanup.

### Step 9 — Responsive

`gsap.matchMedia()`:

```ts
const mm = gsap.matchMedia();

mm.add("(min-width: 992px) and (prefers-reduced-motion: no-preference)", () => {
  initLenis();
  const tween = initHorizontal(root, track);
  initReveals(tween);
  initParallax(tween);
  // cleanup is automatic, but destroy Lenis + remove ticker callback here
});
```

| Breakpoint | Behaviour |
| --- | --- |
| ≥ 1440 | 500vh runway, `container-grid` 20vw, care panel 80vw, 140px headings, 20px body |
| 992–1439 | 600vh runway, base widths, 25vh headlines |
| ≤ 991 | **no JS pin**, CSS column layout, static section, 18vh headlines, 100px headings, sections full width |
| ≤ 767 | 12vh headlines, 9vh big text, 70vw squares |
| ≤ 479 | 19vw headlines, 40px `care of details`, 17vw big text, 20px paddings |

Mobile keeps the reveal animations via a plain (non-`containerAnimation`)
ScrollTrigger (`start: "top 85%"`), which is safe because the track is vertical
there.

Add `html.no-js` fallback: without JS the same column layout is used, so all
content is readable.

### Step 10 — Accessibility & performance

- `@media (prefers-reduced-motion: reduce)`: no Lenis, no pin, column layout,
  no transforms; keep focus styles.
- Keyboard: during the pin, links remain reachable; add ←/→ shortcuts that scroll
  the page by 0.5 × runway.
- Images: explicit `width`/`height` (or `aspect-ratio`) to avoid CLS; first three
  panels `loading="eager" fetchpriority="high"`, the rest `lazy`.
- Video: `muted loop playsinline preload="metadata"` + poster; pause with
  `IntersectionObserver` when the panel leaves.
- `will-change: transform` only on `.l3__track`; never on panels.
- Avoid animating `width`, `height`, `top`, `left`; transforms only.
- Call `ScrollTrigger.refresh()` once fonts + video metadata are ready; debounce
  resize (`ignoreMobileResize` not needed, desktop-only pin).
- Test with 6× CPU throttling: the marquee + video are the two risky spots.

---

## 6. QA / acceptance checklist

1. At 1440×900 and 1280×800, take screenshots of the reference and the clone at
   pin progress 0 / 20 / 40 / 60 / 80 / 100 %; compare panel order, widths,
   type sizes, gaps, image crops.
2. Verify pacing: total pin distance ≈ 5 × viewport height (≥1440) / 6 × (below),
   first panel visible at scroll 0, last panel flush with the right edge at the
   end (the source stops 55 px short with its −87 %; we use the exact distance).
3. Check the four signature effects: masked headline rise, `care of details`
   panel, text-over-image window, marquee over the photo.
4. Resize while mid-pin (992 ↔ 1200): no jump, no leftover pin spacer.
5. `prefers-reduced-motion`: no horizontal movement, content fully readable.
6. Keyboard-only pass + `prefers-color-scheme` untouched (design is fixed light).
7. Lighthouse ≥ 90 performance on desktop; no CLS from images/video.
8. No console errors; no horizontal page scrollbar.

Jump-to-progress helper for QA:

```js
const st = ScrollTrigger.getAll()[0];
window.scrollTo(0, st.start + (st.end - st.start) * 0.5);
```

---

## 7. Effort estimate

| Phase | Work | Time |
| --- | --- | --- |
| 1 | Scaffold, assets, tokens, fonts | 0.5 d |
| 2 | Markup of 14 panels + copy | 0.5 d |
| 3 | Layout CSS + breakpoints | 1 d |
| 4 | Pin, reveals, parallax | 1 d |
| 5 | Micro-interactions, video, polish | 0.5 d |
| 6 | QA against reference, fixes | 1 d |
| | **Total** | **~4.5 days** |

---

## 8. Decisions (confirmed)

1. **Ending panel** — keep the newsletter block. Visual only: heading, email
   field and submit button are rendered for fidelity, but the form does not
   submit (no backend). Background turns `#0d0d0d` behind it as in the source.
2. **Assets** — download all images + the video into `public/` (~4 MB), with a
   one-shot `scripts/fetch-assets.sh`.
3. **Smoothing** — Lenis (`lerp: 0.1`) + ScrollTrigger `scrub: 0.9`.
4. **Content** — keep the template's wine copy and imagery; copy is centralised
   in `src/data/landing3.ts` so it can be swapped in one file later.

No blocking questions remain — implementation can start.
