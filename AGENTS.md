# Jinn: Akinator-style personality guessing game

Domain: jinn.lakshya.uk. Egyptian / Arabian Nights / pyramid theme. A genie asks up to 20 yes/no questions to guess a famous or historic person.

## Stack
- Plain HTML/CSS/JS, no build step. `index.html`, `src/styles.css`, `src/app.js`.
- Backend: `api/jinn.js` (Vercel serverless) calls the Claude API with `claude-haiku-4-5-20251001`.
- Local dev: `npx vercel dev`. Deploy: `npx vercel --prod`.

## Architecture
- `src/app.js` has two engines: Claude mode (via `/api/jinn`, or `claude.use('sample')` inside claude.ai) and an offline archive of ~50 people with a trait-based engine. Claude mode falls back to the archive on any error.
- Game state is the global `S` (`scr`: intro/ask/think/guess/win/lose). `render()` rebuilds the UI; `go()` computes the next state; `fx()` runs the ASCII transition overlay on the `#bg` canvas.
- The opening cinematic is `#op`. The title is a canvas lava fill clipped to the hand-built path `JP` (JINN letters).

## Rules
- NEVER put the API key in client code. The prompt lives server-side in `api/jinn.js`; the client only sends `{ans, rej}`.
- Escape all model output with `esc()` before it goes into `innerHTML`.
- Keep the game console static (no tilt/parallax on `#card`). The ASCII effect is for transitions and in-game moments only, never a permanent background.
- No scanline/grain overlays. Keep the palette: gold `#E2B54A`, parchment `#efe0b6`, ink `#2a1a0c`, night `#070a24`, ruby `#D9341C`.
- Respect `prefers-reduced-motion`. Keep 1-4 keyboard shortcuts working and keep buttons focusable.
- Do not introduce a framework or bundler unless asked.
