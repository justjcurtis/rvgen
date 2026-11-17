# Reveal — Hidden Image Reveal Game

A single-page web app where you pick a session type, define options, and each option gets a unique image from Picsum. All images start hidden behind cards — click to reveal each one, or hit "Reveal All".

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS v4
- **Images:** [Picsum](https://picsum.photos) (public, no API key needed)
- **Testing:** Vitest + React Testing Library

## Getting Started

```bash
npm install
npm run dev       # Start dev server (localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build
npm test          # Run tests
```

## Architecture

Two views managed by conditional rendering in `App.tsx`:

- **Config view** — Choose session type (Yes/No, Numbered, Labeled), provide input, click "Start Session"
- **Game view** — Grid of hidden image cards, click to reveal, "Reveal All" button

### Project Structure

```
src/
  components/       # UI components (Header, SessionTypeSelector, OptionInput, ImageCard, GameBoard)
  hooks/            # Custom hooks (useGameState, useImages)
  services/         # Data sources (imageService — Picsum URL generation)
  types/            # Shared TypeScript types
  utils/            # Pure helper functions (sessionUtils)
```

### Session Types

| Type | Input | Options Generated |
|------|-------|-------------------|
| Yes/No | None | `["Yes", "No"]` |
| Numbered | Integer N (2–20) | `["1", "2", ..., "N"]` |
| Labeled | Comma-separated text | Each label as typed (≥ 2 required) |

## Image Attribution

Images provided by [Picsum](https://picsum.photos) — random, seeded, deterministic per option.