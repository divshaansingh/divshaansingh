# DESIGNER_OS_V1.0

Retro pixel-art portfolio website built as a class project for **Graphic Design — Advance Diploma, George Brown Polytechnic**.

**Student:** Divshaan Singh Brar
**Concept:** the portfolio is framed as a retro video-game operating system — every page is a different "screen" in a classic 8-bit/16-bit game.

---

## Pages

| Route | File | Description |
|---|---|---|
| Home | `index.html` | Boot sequence, terminal easter eggs, pixel pet |
| Portfolio | `portfolio.html` | Film-strip carousel — 5 featured projects |
| About | `about.html` | Bio, RPG-style skill bars, timeline, tool inventory |
| Contact | `contact.html` | Transmission-style message form + socials |
| 404 | `404.html` | **Fully playable Space Invaders** (Pixel Invaders) |

> Sitemap is provided as a separate PDF deliverable — not a page on the site.

## Tech stack

- **Bootstrap 5.3** (CDN) — responsive grid, offcanvas mobile nav, form controls, icons
- **Bootstrap Icons 1.11** (CDN) — UI + social icons
- **Google Fonts** — Press Start 2P + Silkscreen
- Hand-rolled vanilla JS (~250 LOC, zero frameworks)
- Web Audio API — chip-tune SFX synthesized on the fly
- Pure CSS CRT effects (scanlines, vignette)

## Assignment compliance

- [x] Mobile-first / progressive enhancement via Bootstrap
- [x] Minimum 1 page — **5 pages + 404**
- [x] 5 portfolio items
- [x] External CSS file (`style.css`) linked on every page
- [x] iOS 9 viewport fix (`shrink-to-fit=no`)
- [x] SVG logo (`assets/logo.svg`)
- [x] Bootstrap Icons used site-wide
- [x] Responsive at mobile / tablet / desktop (breakpoints at 480 / 900 / 1024 px)
- [x] WCAG AA color contrast (`--dim #8a8ab3` on `--bg #12121e` ≈ 6:1)

## File tree

```
portfolio/
├── index.html          · home
├── portfolio.html      · projects (carousel)
├── about.html          · bio / skills / timeline
├── contact.html        · form + socials
├── 404.html            · Pixel Invaders arcade game
├── style.css           · single source of truth for layout + theme
├── script.js           · shared JS (audio, clock, per-page behaviors)
├── assets/
│   └── logo.svg        · DSB pixel wordmark
└── images/             · project cover images
```

## Accessibility

- All interactive elements keyboard-reachable
- `prefers-reduced-motion` media query honored
- `alt` text on all imagery
- Skip-friendly semantic HTML (`<main>`, `<nav>`, `<header>` via `.hud`)
- WCAG AA contrast on body text
- Chip-tune audio only plays after explicit user gesture (clicks/keys)

## Running locally

Just open `index.html` in any modern browser — there's no build step.

## Credits

- **Design + code:** Divshaan Singh Brar
- **Fonts:** Press Start 2P (Cody Boisclair), Silkscreen (Jason Kottke) — via Google Fonts
- **Project images:** self-authored campaign assets
