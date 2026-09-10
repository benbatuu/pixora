# Theme

## Compact token summary
- Brand red: `#e11010` (`--px-red`, `px-red`)
- Black: `#0a0a0a` (`--px-black`), `#1e1e1e` (`--px-black-2`)
- Body gray: `#6d6868` (`--px-body`)
- Background / white: `#ffffff` (`--px-bg`, `--px-white`)
- Fonts: Inter (UI body), Thunder / ThunderMed (display headlines)
- Layout rule: full-width content with `px-16` (4rem); no max-width content containers
- Accent rule: never orange — orange refs become red `#e11010`
- CSS: Tailwind v4 via `@import "tailwindcss"` + `@theme inline` in `app/globals.css` (no separate tailwind.config)
- Admin panel should reuse: black/white/red, Inter for UI chrome, Thunder sparingly for page titles; denser SaaS spacing than marketing site

## Raw: package.json
```json
{
  "name": "pixora",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "framer-motion": "^13.2.0",
    "gsap": "^3.15.0",
    "lenis": "^1.3.26",
    "lucide-react": "^1.44.0",
    "matter-js": "^0.20.0",
    "next": "16.3.4",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "swiper": "^14.2.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/matter-js": "^0.20.2",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}

```

## Raw: app/globals.css
```css
@import "tailwindcss";

@font-face {
  font-family: "Thunder";
  src: url("/fonts/Thunder-BoldLC.woff2") format("woff2"),
    url("/fonts/Thunder-BoldLC.woff") format("woff"),
    url("/fonts/Thunder-BoldLC.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "ThunderMed";
  src: url("/fonts/Thunder-MediumLC.woff2") format("woff2"),
    url("/fonts/Thunder-MediumLC.woff") format("woff"),
    url("/fonts/Thunder-MediumLC.ttf") format("truetype");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

:root {
  --px-red: #e11010;
  --px-black: #0a0a0a;
  --px-black-2: #1e1e1e;
  --px-body: #6d6868;
  --px-bg: #ffffff;
  --px-white: #ffffff;
  --background: #ffffff;
  --foreground: #0a0a0a;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-px-red: #e11010;
  --color-px-black: #0a0a0a;
  --color-px-body: #6d6868;
  --color-px-bg: #ffffff;
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-thunder: "Thunder", Impact, sans-serif;
  --font-thunder-med: "ThunderMed", Impact, sans-serif;
}

/* Base resets must stay in @layer base so components/utilities
   (menu #fff, button text-white, etc.) can override them. */
@layer base {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: auto;
  }

  html.lenis,
  html.lenis body {
    height: auto;
  }

  .lenis.lenis-smooth {
    scroll-behavior: auto !important;
  }

  body {
    margin: 0;
    background: var(--px-bg);
    color: var(--px-black);
    font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: clip;
  }

  img {
    max-width: 100%;
    display: block;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    color: inherit;
  }
}

@keyframes px-zikzak-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes px-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* ── Unavoidable @layer: JS-toggled / parent-state selectors ── */
@layer components {
  /* GSAP fade hook — initial state only */
  .px-fade-anim {
    will-change: transform, opacity;
  }

  /* Hero collage — hover/active driven */
  .px-hero-2-thumb {
    position: relative;
    width: 130px;
    height: 168px;
    border-radius: 12px;
    overflow: hidden;
    filter: grayscale(1);
    transition: filter 0.45s ease, transform 0.45s ease;
  }
  .px-hero-2-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .px-hero-2-item.active .px-hero-2-thumb,
  .px-hero-2-thumb.is-color {
    filter: grayscale(0);
  }
  .px-hero-2-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s ease;
  }
  .px-hero-2-item.active .px-hero-2-content {
    opacity: 1;
  }
  .px-hero-2-content .tp span {
    display: block;
    font-family: "Thunder", Impact, sans-serif;
    font-size: 18px;
    line-height: 1.1;
    color: #fff;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  }
  .px-hero-2-content .tp + .tp span {
    font-size: 13px;
    font-family: var(--font-inter), system-ui, sans-serif;
    font-weight: 500;
    opacity: 0.9;
  }

  /* Capsule physics DOM hooks (Matter.js) */
  .px-capsule-item-wrapper {
    position: relative;
    height: 420px;
    margin-top: -40px;
    overflow: hidden;
    pointer-events: auto;
    touch-action: none;
    user-select: none;
  }
  @media (min-width: 992px) {
    .px-capsule-item-wrapper {
      height: 560px;
      margin-top: -120px;
    }
  }
  .px-capsule-item {
    position: absolute;
    color: var(--px-black);
    font-size: clamp(16px, 1.6vw, 28px);
    font-family: "ThunderMed", Impact, sans-serif;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    line-height: 1.1;
    pointer-events: auto;
    transform-origin: center center;
    background-color: #f6f6f6;
  }
  .px-capsule-physics-item {
    position: absolute;
    top: 0;
    left: 0;
    will-change: transform;
    cursor: grab;
    z-index: 3;
    user-select: none;
  }
  .px-capsule-physics-item:active {
    cursor: grabbing;
  }

  /* Hamburger open state */
  .tp-hamburger-btn,
  .hamburger-btn {
    width: 56px;
    height: 56px;
    border-radius: 9999px;
    border: 0;
    background: #fff;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    padding: 0;
    position: relative;
  }
  .tp-hamburger-btn > span:not(.hamburger-x),
  .hamburger-btn > span:not(.hamburger-x):not(.hamburger-lines) {
    display: block;
    width: 18px;
    height: 2px;
    background: #0a0a0a;
    border-radius: 2px;
  }
  .tp-hamburger-btn > span:not(.hamburger-x):first-of-type,
  .hamburger-btn > span:not(.hamburger-x):not(.hamburger-lines):first-of-type {
    margin-bottom: 5px;
  }
  .hamburger-btn.is-open,
  .tp-hamburger-btn.is-open {
    background: #0a0a0a;
    color: #fff;
  }
  .hamburger-x {
    font-size: 28px;
    line-height: 1;
    color: #fff;
  }

  /*
   * Offcanvas open/close — parent `.menu-open` drives clip-path + staggered reveals.
   * Cannot express cleanly with Tailwind group without rewriting Header animation model.
   */
  .px-offcanvas-2-area {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 70;
    pointer-events: none;
    visibility: hidden;
    transition: visibility 0s linear 1.1s, z-index 0s linear 1.1s;
  }
  .px-offcanvas-2-area.menu-open {
    pointer-events: auto;
    visibility: visible;
    z-index: 70;
    transition: visibility 0s linear 0s, z-index 0s linear 0s;
  }
  .px-offcanvas-2-area .offcanvas-bg {
    position: fixed;
    inset: 0;
    z-index: -1;
    margin: 20px;
    border-radius: 20px;
    background: #0a0a0a;
    overflow: hidden;
    clip-path: circle(0% at calc(100% - 45px) 45px);
    transition: clip-path 0.7s ease-in-out;
    transition-delay: 0.4s;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  }
  @media (max-width: 767px) {
    .px-offcanvas-2-area .offcanvas-bg {
      margin: 5px;
      border-radius: 16px;
    }
  }
  .px-offcanvas-2-area.menu-open .offcanvas-bg {
    clip-path: circle(150% at calc(100% - 45px) 45px);
    transition-delay: 0s;
  }
  .px-offcanvas-bg-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.55;
    pointer-events: none;
  }
  .px-offcanvas-bg-dim {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      rgba(10, 10, 10, 0.72) 0%,
      rgba(10, 10, 10, 0.45) 45%,
      rgba(10, 10, 10, 0.7) 100%
    );
    pointer-events: none;
  }
  .px-offcanvas-2-wrapper {
    position: relative;
    z-index: 1;
    height: 100%;
    padding: 110px 30px 40px;
    pointer-events: none;
  }
  @media (min-width: 992px) {
    .px-offcanvas-2-wrapper {
      padding: 155px 60px 0;
    }
  }
  @media (min-width: 1200px) {
    .px-offcanvas-2-wrapper {
      padding: 155px 100px 0;
    }
  }
  .px-offcanvas-2-area.menu-open .offcanvas-menu {
    pointer-events: auto;
  }
  .px-offcanvas-2-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    align-items: start;
    height: 100%;
    max-height: calc(100vh - 140px);
  }
  @media (min-width: 992px) {
    .px-offcanvas-2-grid {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 48px;
    }
  }
  .px-offcanvas-2-left,
  .px-offcanvas-2-right {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
      transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .px-offcanvas-2-area:not(.menu-open) .px-offcanvas-2-left {
    transition-delay: 0.6s;
  }
  .px-offcanvas-2-area:not(.menu-open) .px-offcanvas-2-right {
    transition-delay: 0s;
  }
  .px-offcanvas-2-area.menu-open .px-offcanvas-2-left {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.76s;
  }
  .px-offcanvas-2-area.menu-open .px-offcanvas-2-right {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 1.31s;
  }
  .tp-offcanvas-menu {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
      transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    margin-bottom: 0;
  }
  .px-offcanvas-2-area.menu-open .tp-offcanvas-menu {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.96s,
      transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.96s;
  }
  .px-offcanvas-2-area:not(.menu-open) .tp-offcanvas-menu {
    transition-delay: 0.4s;
  }
  .tp-offcanvas-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .tp-offcanvas-menu > ul > li:not(:last-child) {
    margin-bottom: 18px;
  }
  @media (min-width: 992px) {
    .tp-offcanvas-menu > ul > li:not(:last-child) {
      margin-bottom: 22px;
    }
  }
  .px-offcanvas-link-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 24px;
  }
  .tp-offcanvas-menu > ul > li > .px-offcanvas-link-row > a {
    font-family: "Thunder", Impact, sans-serif;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: clamp(64px, 9vw, 120px);
    line-height: 0.82;
    color: #fff;
    padding: 0;
  }
  .tp-offcanvas-menu > ul > li > .px-offcanvas-link-row > a.is-active,
  .tp-offcanvas-menu > ul > li.is-active > .px-offcanvas-link-row > a {
    color: #e11010;
  }
  .px-offcanvas-2-right {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 20px;
    min-height: 200px;
    width: 100%;
  }
  .px-offcanvas-2-info {
    color: #fff;
    max-width: 420px;
  }
  @media (min-width: 992px) {
    .px-offcanvas-2-info {
      text-align: right;
    }
  }
  .px-offcanvas-2-info-label {
    margin: 0 0 12px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.45);
  }
  .px-offcanvas-2-info-title {
    margin: 0 0 22px;
    font-family: "Thunder", Impact, sans-serif;
    font-size: clamp(36px, 4vw, 56px);
    font-weight: 600;
    line-height: 0.95;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: #fff;
  }
  .px-offcanvas-2-info-link {
    display: block;
    margin: 0 0 8px;
    color: #fff;
    font-size: clamp(18px, 2vw, 24px);
    font-weight: 500;
    text-decoration: none;
    transition: color 0.25s ease;
  }
  .px-offcanvas-2-info-link:hover {
    color: #e11010;
  }
  .px-offcanvas-2-info-meta {
    margin: 18px 0 0;
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
  }
  .px-offcanvas-2-social ul {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  @media (min-width: 992px) {
    .px-offcanvas-2-social ul {
      justify-content: flex-end;
    }
  }
  .px-offcanvas-2-social ul li a {
    width: 40px;
    height: 40px;
    border-radius: 40px;
    background: #1e1e1e;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease, color 0.3s ease;
  }
  .px-offcanvas-2-social ul li a:hover {
    background: #e11010;
  }

  /* Step pin-spacer (GSAP creates node) */
  .px-step-area .pin-spacer {
    background-color: #f7f7f7 !important;
  }

  /* Swiper continuous marquee helper */
  .tp-slider-transtion .swiper-wrapper {
    transition-timing-function: linear !important;
  }
}

```
