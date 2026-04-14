

## Plan

### Problem
The app uses `HashRouter`, which relies on the URL hash (`#/`) for routing. Anchor links like `href="#dataset"` overwrite that hash, causing the router to navigate to a non-existent route and show 404.

### Solution

**1. Fix navigation links — use scroll instead of anchor hrefs**

In `Navbar.tsx` and `HeroSection.tsx`, replace `href="#dataset"` style links with `onClick` handlers that use `document.getElementById('dataset')?.scrollIntoView({ behavior: 'smooth' })`. This avoids interfering with HashRouter.

Files changed: `src/components/Navbar.tsx`, `src/components/HeroSection.tsx`

**2. Create a README.md for the academic project**

Write a README in Portuguese explaining:
- Project title: HeartRisk EDA — Análise Exploratória de Dados de Risco de Infarto
- Academic context: IA & Machine Learning course
- Dataset: synthetic global dataset with 8,763 patients from 20 countries, 26 variables
- What the site shows: EDA with charts (correlation matrix, BMI vs blood pressure, age vs risk, habits, cholesterol/triglycerides, gender vs risk)
- Tech stack: React, TypeScript, Vite, Tailwind CSS, deployed on GitHub Pages
- How to run locally

File changed: `README.md`

### Technical Detail
- Navigation will use `scrollIntoView({ behavior: 'smooth' })` with `e.preventDefault()` to prevent hash changes
- Section IDs (`dataset`, `graficos`, `conclusao`, `codigo`) already exist on the components

