# vizune-template-frosted-hollow

**Frosthollow** is a dark, icy fantasy landing-page template built with [Astro](https://astro.build).

## Getting started

Requires Node.js 22.23.4 or newer (even-numbered releases, e.g. 22.x or 24.x).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in ./dist
npm run preview   # serve the built site
```

## Structure

```
public/
  images/            banner, logo and the cropped artwork used across the page
  favicon.png
src/
  data/site.ts       all page copy: nav, hero chapters, news, features, gallery, socials
  data/social-icons.ts  brand icon paths (Simple Icons)
  layouts/Layout.astro  <head>, fonts, global CSS, scripts
  components/        Header, Hero, NewsCard, WorldSection, Gallery, Community, Footer…
  scripts/main.ts    hero chapter pan, gallery carousel, mobile menu, newsletter feedback
  styles/global.css  design tokens (top of file) and all styles
```

## Customising

- **Copy & links**: edit `src/data/site.ts`. Nothing in the components needs touching.
- **Hero chapters**: selecting a chapter swaps the hero text. They also auto-advance every
  9 seconds (disabled when the visitor prefers reduced motion).
- **Artwork**: news cards and the gallery use crops of the banner in `public/images/`.
  Swap in your own images and update the paths in `site.ts`.
- **Colours & fonts**: change the custom properties at the top of `global.css`.
  Fonts are Cinzel (display) and Cormorant Garamond (body) from Google Fonts.
- **Search**: the header search (click the magnifier or press `/`) searches the news, gallery
  and page sections defined in `site.ts` — see `SearchPanel.astro`. Once the site has real
  pages, [Pagefind](https://pagefind.app) is a good drop-in source for the results.
- **Newsletter**: the form only shows a thank-you message. Point it at your provider
  (Buttondown, Mailchimp, etc.) in `Footer.astro` / `scripts/main.ts`.
