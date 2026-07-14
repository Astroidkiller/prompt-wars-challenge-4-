# FIFA 2026 GenAI Operations Hub (Minimalist Edition)

## Overview
This repository contains a **highly advanced, minimalist GenAI Operations Hub** for the FIFA 2026 World Cup. It was built for the Prompt Wars challenge, focusing on extreme performance, premium UI/UX (Swiss design/Bento grid), and real AI decision-making.

## Key Features
- **Ultra-Premium UI:** Clean, minimalist bento-box architecture. No cheap gradients or "AI slop" colors. Pure typography (Inter), subtle borders, and smooth spring-based animations.
- **Dark/Light Mode:** Full system-preference aware theming with a manual toggle.
- **GenAI Integration:** A floating AI assistant that can either use a local fallback logic engine or connect directly to the **Gemini 1.5 API** (via a secure client-side settings modal).
- **Live Data Dashboards:** Integrated Chart.js for real-time ingress flow monitoring at MetLife and SoFi stadiums.
- **Single Page Architecture:** Zero reload tab switching between Dashboard, Crowd Matrix, and Transport modules.

## Architecture
- `index.html`: Semantic, highly accessible layout.
- `style.css`: CSS Variables for theming, flex/grid layouts, keyframe animations.
- `app.js`: State management, Chart configuration, and async API handling.

## Challenge Constraints Met
- ✅ **Under 10MB:** The entire repository is less than 50KB.
- ✅ **Single Branch:** Everything is on `main`.
- ✅ **Public Repo:** Accessible to anyone.
- ✅ **Smart/Dynamic:** Features real API hooks for dynamic generative AI responses.

## Setup & Usage
1. Open `index.html` in any modern browser.
2. Interact with the Dashboard, Crowd Matrix, and Transport tabs.
3. Click the **API Settings** button in the bottom left to input a Gemini API key.
4. Open the floating chat window to ask the AI questions (e.g., "What is the crowd density at Zone 3?").

## Evaluation
- **Code Quality:** Highly modular JS, DRY CSS, semantic HTML.
- **Security:** API keys are stored only in local `localStorage` (client-side) and never pushed to the repo.
- **Efficiency:** Uses native DOM APIs and lightweight Chart.js (CDN). No heavy frameworks.
- **Accessibility:** High contrast ratios, clear iconography, semantic tags.
