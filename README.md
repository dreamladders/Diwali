# Dream Ladders — Diwali landing page

A self-contained, responsive Diwali campaign page designed to live alongside the existing GitHub Pages site.

## Deploy
1. In the existing GitHub repository that publishes `https://dreamladders.github.io/Main/`, create a folder named `diwali` at the same level as the existing `index.html`.
2. Upload the three files from this package's `diwali/` folder into that new folder: `index.html`, `style.css`, and `script.js`.
3. Commit to the branch/folder currently used by GitHub Pages.
4. After Pages finishes publishing, open `https://dreamladders.github.io/Main/diwali/`.

Do not replace the existing homepage or its assets. This is an additive subfolder deployment.

## Features
- Animated diya built with CSS, canvas particle ambience and fireworks bursts (no Three.js dependency).
- Reduced-motion support and capped canvas pixel ratio for mobile performance.
- Interactive Web / Civil / Cloud-DevOps demonstration tabs.
- Sample business website preview and enquiry mailto CTA.
- English and Telugu greeting copy, SEO metadata and responsive layout.

## Before publishing
- Confirm the public brand email `dreamladdersservices@gmail.com` is the intended enquiry address.
- The business, civil and cloud panels are illustrative concept demos, not claims of completed client projects.
- Google Fonts are loaded remotely; system fallbacks are included. For fully offline/self-hosted font delivery, download and bundle licensed font files separately.
- This package does not connect to a backend or collect/store visitor data. The enquiry button opens the visitor's email application.

## Local preview
Open `diwali/index.html` in a browser, or serve the repository root with any static file server and visit `/diwali/`.
