# James Russo — Portfolio

> **Unity & XR Developer** — Gameplay, VR/MR, and interactive UX.
> Open to full-time roles. Based in Boise, ID — open to remote or relocation.

**Live site:** [jamesrusso12.github.io/Portfolio-2.0](https://jamesrusso12.github.io/Portfolio-2.0/)

---

## About this repo

This is the source for my personal portfolio — hand-written HTML, CSS, and
JavaScript, deployed via GitHub Pages. No build step, no framework. It's meant
to both *describe* my work and *be* a piece of it: every optimization, a11y
choice, and visual decision is on display.

Featured case studies:

| Project | Role | Stack | Platform |
| --- | --- | --- | --- |
| **Ghost Defiant** — MR shooter capstone | Solo dev & designer | Unity 6 · C# · Meta AIO SDK v72 | Quest 3 (Mixed Reality) |
| **Bookshelf Adventures** — iOS AR reader | AR specialist & co-UI designer | SwiftUI · ARKit | iOS |
| **Finance Simulator** — BSU student tool | Lead interaction designer | HTML · CSS · JS | Web |

Plus seven smaller prototypes (Unreal 5 fighter, Unreal multiplayer target
range, D3 dashboard, Alexa voice UX, full-stack Halo Maps DB, Unity showcase
reel, OnRamp AR).

---

## Tech

- **Pages:** `index.html` + three project sub-pages (`game-development.html`,
  `web-development.html`, `uiux-design.html`)
- **Styling:** single CSS file with CSS custom properties for theming
  (light / dark), WCAG AA contrast, `prefers-reduced-motion`, `:focus-visible`
- **JS:** vanilla where possible — jQuery is only loaded for Owl Carousel
  on the prototypes reel
- **Performance:** videos compressed with ffmpeg (H.264, `+faststart`, scaled
  to 1280 wide), YouTube embeds swapped for
  [`lite-youtube-embed`](https://github.com/paulirish/lite-youtube-embed)
  (click-to-load), image lazy-loading via the native `loading="lazy"` attribute
- **Accessibility:** skip-to-main link, `<main>` landmark, ARIA roles on tab
  panels, keyboard-navigable image galleries, reduced-motion rules

---

## File organization

```
Portfolio-2.0/
│
├── index.html                    # landing: hero + playable target demo
├── about.html                    # experience, education, stack, influences
├── prototypes.html               # eight smaller technical prototypes
│
├── ghost-defiant.html            # case studies
├── bookshelf-adventures.html
├── unreal-prototypes.html
│
├── game-development.html         # image galleries
├── uiux-design.html
├── web-development.html
│
├── assets/
│   ├── css/cathode.css           # design tokens + all redesign styles
│   ├── css/style.css             # legacy stylesheet (galleries)
│   ├── js/                       # nav, blades, target demo, galleries
│   ├── img/                      # stills a page references
│   ├── video/                    # compressed video a page references
│   └── docs/current-resume.pdf
│
├── archive/                      # kept, but referenced by no page
│   ├── media/  fonts/  bootstrap-js/
│
├── img/_originals/               # uncompressed video masters (gitignored)
│
└── scripts/compress-videos.sh
```

Rule of thumb: if a page references it, it lives under `assets/`. If nothing
references it but it is worth keeping, it lives under `archive/`.

---

## Running locally

No build tools required. From the repo root:

```sh
# any static server works
python3 -m http.server 8080
# then open http://localhost:8080
```

If you open `index.html` directly via `file://`, most things still work but
a few features (iframe-based YouTube embeds, fetch-based form posts) may not.

---

## Re-compressing videos

If you drop new raw footage into `assets/video/`, run:

```sh
brew install ffmpeg      # if you haven't already
./scripts/compress-videos.sh
```

- Only files larger than 5 MB are touched
- Originals are moved to `img/_originals/` (gitignored)
- Output: H.264, CRF 28, 1280 wide max, `+faststart` for streaming

---

## Contact

- **Email:** [jrusso03@icloud.com](mailto:jrusso03@icloud.com)
- **LinkedIn:** [linkedin.com/in/jamesjrusso](https://www.linkedin.com/in/jamesjrusso/)
- **GitHub:** [github.com/jamesrusso12](https://github.com/jamesrusso12)
- **Resume:** [assets/docs/current-resume.pdf](assets/docs/current-resume.pdf)

---

<sub>&copy; James Russo. All work shown on the live site is mine unless otherwise
credited in its case study.</sub>
