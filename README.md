# Prompt Wars Assistant

## Vertical / Persona
**Personal Productivity Assistant** – a lightweight chatbot that helps you stay focused, provides quick jokes for breaks, tells the current time, and offers simple “help” instructions.

## Project Overview
This is a tiny, static web application (HTML + CSS + JavaScript) that demonstrates a **smart, dynamic assistant** while meeting all Prompt Wars challenge constraints:
- **Public GitHub repository** (single branch, < 10 MB)
- **Premium UI** – dark glass‑morphic design, Google Font *Inter*, micro‑animations
- **Context‑aware logic** – responds to jokes, time, weather queries, and generic help
- **Clean, maintainable code** – modular CSS variables, well‑commented JS functions
- **Accessibility** – high‑contrast colors, ARIA roles, keyboard navigation

## How It Works
1. **User input** → the assistant parses the message for keywords.
2. **Decision engine** (`script.js`) selects a response:
   - `joke` → random joke from a built‑in list
   - `time` → current local time
   - `weather` → static fallback message (no external API)
   - `help` → short usage guide
   - otherwise → generic friendly reply
3. The UI shows a **typing indicator** (`Thinking…`) with a 0.5‑1.5 s simulated delay to feel more “human”.
4. Responses appear in glass‑morphic chat bubbles with smooth fade‑in animation.

## Assumptions
- No external API keys are required; all data is generated locally.
- The assistant runs entirely in the browser – no backend server.
- Users will run the app by opening `index.html` in a modern browser (Chrome/Edge/Firefox).
- The repository will be created manually by the participant after these files are generated.

## Setup & Usage
1. Clone the repo (or copy the `prompt_wars_challenge` folder) to a local directory.
2. Open `index.html` in a browser.
3. Type a question or command (e.g., `Tell me a joke`, `What time is it?`, `Help`).
4. Interact with the assistant and observe the responsive UI.

## Repository Structure
```
prompt_wars_challenge/
│   index.html       # Main UI markup
│   style.css        # Premium glass‑morphic styling
│   script.js        # Assistant logic
│   README.md        # This document
└─ assets/            # (optional) generated mockup images
```

## Evaluation Focus Areas
- **Code Quality** – clear separation of concerns, comments, CSS variables.
- **Security** – no external network calls, no user‑generated script execution.
- **Efficiency** – lightweight static assets, minimal JavaScript.
- **Testing** – manual interaction verifies each keyword response.
- **Accessibility** – ARIA labels, keyboard‑friendly input.

## License
MIT – feel free to fork, improve, and submit your own version.

---
*Repo size stays well under the 10 MB limit.*
