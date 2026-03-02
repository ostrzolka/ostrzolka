# Ostrzółka

**Ostrzółka** is an open-source, crowdsourced digital archive and bibliography dedicated to the city of **Bydgoszcz**. The project aims to map the DNA of the city by indexing historical and contemporary addresses, buildings, organizations, and the people who shaped them.

By bridging the gap between raw data and historical sources, Ostrzółka provides a centralized platform for enthusiasts, historians, academics and citizens to document Bydgoszcz's urban evolution.

The project is an innitiative of Bydgoski Ruch Miejski.
---

## Maintainers

This project is an open-source initiative developed and maintained by:
* **Jakub Pacocha** ([@JPacoch](https://github.com/JPacoch))

Feel free to reach out if you have questions regarding the technical architecture or contribution guidelines.

## Tech Stack

We’ve chosen a modern, high-performance stack to ensure the archive is as fluid and accessible as possible:

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animation:** [GSAP](https://greensock.com/gsap/) for sophisticated motion design.
* **Scrolling:** [Lenis](https://lenis.darkroom.engineering/) for smooth, cinematic inertial scrolling.
* **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, and Storage).
* **Deployment:** Optimized for [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

---

## Development

Ensure you have **Node.js** (v18 or higher) and **npm/yarn/pnpm/bun** installed.
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing website pages by modifying `page.tsx`'s. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

---
Developed and maintained with ❤️ by [@JPacoch](https://github.com/JPacoch)