# Vashisht Constructions

A premium, production-ready builder portfolio website built with React 19, Vite, TypeScript, and Tailwind CSS v4.

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- React Router
- Framer Motion
- Lucide React
- React Helmet Async
- Embla Carousel
- Netlify Forms

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Data architecture

All editable site content lives in the root **`data/`** folder as JSON:

```
data/
  company.json
  about.json
  hero.json
  stats.json
  why-choose-us.json
  timeline.json
  footer.json
  testimonials.json
  faq.json
  projects/
    _index.json          # ordered list of project slugs
    ganraj-apartment.json
```

Images live in **`public/images/`** (mirrored by slug) and are referenced by path in those JSON files:

```
public/images/
  hero/hero.webp
  about/studio.webp
  projects/
    ganraj-apartment/
      hero.jpeg
      thumb.jpeg
      1.jpeg …
```

App code stays under **`src/`** — no content or media duplicates there.

## Admin Panel

Visit `/admin/login`

- **Username:** `yash`
- **Password:** `aditya`

While `npm run dev` is running, saving in the admin panel **writes directly to the `data/` JSON files** (and image uploads to `public/images/`).

### Global publish workflow

1. Run `npm run dev`
2. Edit content in `/admin`
3. Confirm the files under `data/` (and `public/images/`) changed
4. Commit + push
5. Netlify redeploys → every visitor sees the update

### Optional: live admin → GitHub auto-commit

In Netlify environment variables set:

- `GITHUB_TOKEN` — personal access token with repo write access
- `GITHUB_REPO` — `owner/repo`
- `GITHUB_BRANCH` — usually `main`

Then production admin saves can commit JSON changes and trigger a redeploy automatically.

## Deploy to Netlify

1. Push to a Git repository
2. Connect the repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

Netlify Forms are configured via `public/contact-form.html` and the React contact form.
