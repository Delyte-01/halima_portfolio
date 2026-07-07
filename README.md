# Portfolio Starter

A Next.js (App Router) + TypeScript starter pre-wired with:

- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — accessible component primitives (Button included, add more with the CLI)
- **GSAP** + **@gsap/react** (`useGSAP` hook) — animation
- **Lenis** — smooth scrolling, synced with GSAP's ticker + ScrollTrigger

## Getting started

1. Unzip the project and open the folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Adding more shadcn components

`components.json` is already configured. Once `node_modules` is installed, add components with:

```bash
npx shadcn@latest add card
npx shadcn@latest add navigation-menu
```

(shadcn will detect the existing config and drop files into `components/ui`.)

## Project structure

```
app/
  layout.tsx        # Root layout, wraps everything in <SmoothScroll>
  page.tsx          # Home page (Hero + ScrollSection)
  globals.css       # Tailwind + shadcn CSS variables
components/
  SmoothScroll.tsx  # Lenis instance synced to gsap.ticker + ScrollTrigger
  Hero.tsx          # Example useGSAP() entrance animation
  ScrollSection.tsx # Example ScrollTrigger-based reveal animations
  ui/
    button.tsx      # shadcn Button
lib/
  utils.ts          # cn() helper (clsx + tailwind-merge)
```

## Notes on GSAP + Lenis + Next.js

- `SmoothScroll` is a client component (`"use client"`) that creates a single
  `Lenis` instance, disables its internal RAF loop (`autoRaf: false`), and
  drives it from `gsap.ticker` instead. This keeps Lenis and any
  `ScrollTrigger`-based animations perfectly in sync.
- `Hero.tsx` and `ScrollSection.tsx` show the two common GSAP patterns in
  React: a simple mount-in timeline with `useGSAP`, and scroll-triggered
  reveals using `ScrollTrigger` inside `useGSAP`'s scoped context (so
  animations/triggers are automatically cleaned up on unmount).
- Feel free to delete the example content in `Hero.tsx` / `ScrollSection.tsx`
  and replace it with your real sections — the animation wiring will keep
  working the same way.

## Build

```bash
npm run build
npm start
```
