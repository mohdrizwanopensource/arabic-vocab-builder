# 🌿 Arabic Vocab Builder

A gentle, modern pastel flashcard web application designed for learning Arabic vocabulary with ease. Built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**.

---

## ✨ Overview & Philosophy

Arabic Vocab Builder is designed around learning efficiency:

- **Word & Meaning First**: Showing Arabic script or complex sentences is **not mandatory**. You can start simply with transliterated or English words (e.g., `kitab / kitabun — book`).
- **Graceful Enrichment**: When Arabic calligraphy, parts of speech, or example sentences are provided, the app dynamically renders them with beautiful typography and RTL alignment.
- **Gentle Pastel Aesthetics**: A calming mint green (`#bde5db`) canvas paired with warm cream (`#fdfcf9`) cards and subtle accents, reducing eye strain during long study sessions.
- **Dual Study Views**: Seamlessly switch between a distraction-free **Simple View** and an enriched **Detailed View**.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.18 or higher (v20+ recommended)
- [pnpm](https://pnpm.io/) (recommended), or npm, yarn, or bun

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone <repository-url>
cd arabic-vocab-builder

# Install dependencies with pnpm
pnpm install
```

### Running Locally (Development Mode)

Start the local development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app supports Hot Module Replacement (HMR).

### Building for Production

Compile an optimized production build:

```bash
pnpm build
```

To run the production server locally after building:

```bash
pnpm start
```

---

## 📖 Key Features & UX

| Feature | Description |
|---|---|
| **Simple View** | Focuses on the prompt word. Tap anywhere or press <kbd>Space</kbd> to reveal the meaning and part of speech. |
| **Detailed View** | Comprehensive breakdown including Arabic calligraphy, transliteration, meaning, part of speech, and example sentences. |
| **Side-by-Side View** | Comparison mode that shows both Simple View and Detailed View simultaneously in a 2-column desktop layout. |
| **Audio Pronunciation 🔊** | Uses browser Web Speech API synthesis (`ar-SA` for Arabic text, `en-US` fallback for transliteration). |
| **Bookmark Ribbon 🔖** | Mark cards to create a personalized saved collection. |
| **Progress Tracking** | Mark cards as **Still learning ✕** (coral red) or **I know this ✓** (pastel emerald) with real-time progress bar. |
| **Deck Filtering** | Filter the deck by `All`, `Still Learning`, `Known`, or `Bookmarked`. |
| **Shuffle & Reset** | Shuffle the deck at any time or reset your study progress. |
| **In-App Word Editor ✏️** | Add new vocabulary words or edit existing ones directly from the UI. |
| **JSON Source Manager `{ }`** | Inspect, copy, download, or edit the underlying vocabulary JSON directly in the browser. |
| **LocalStorage Persistence** | Your study ratings, bookmarks, and custom words persist automatically in your browser's local storage. |

### ⌨️ Keyboard Shortcuts

Speed up flashcard sessions using keyboard controls:

- <kbd>Space</kbd> or <kbd>Enter</kbd> — Reveal answer / Flip card (Simple View)
- <kbd>→</kbd> / <kbd>←</kbd> — Next card / Previous card
- <kbd>1</kbd> — Mark as **Still learning ✕**
- <kbd>2</kbd> — Mark as **I know this ✓**
- <kbd>S</kbd> — Switch to **Simple View**
- <kbd>D</kbd> — Switch to **Detailed View**

---

## 🗂️ Data Source & Customization (`data/vocabulary.json`)

The vocabulary source data is located at [`data/vocabulary.json`](data/vocabulary.json) and mirrored at [`public/vocabulary.json`](public/vocabulary.json).

### Minimal Schema (Word & Meaning Only)

You don't need Arabic script or examples to get started:

```json
[
  {
    "id": "1",
    "word": "kitab / kitabun",
    "meaning": "Book"
  },
  {
    "id": "2",
    "word": "qalam",
    "meaning": "Pen"
  }
]
```

### Full Schema (All Optional Fields)

```json
[
  {
    "id": "1",
    "word": "kitāb / kitābun",
    "arabic": "كِتَاب",
    "meaning": "Book",
    "partOfSpeech": "noun",
    "exampleSentence": {
      "arabic": "هَذَا كِتَابٌ جَدِيدٌ",
      "translation": "This is a new book"
    }
  }
]
```

### Field Definitions

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` \| `number` | **Yes** | Unique identifier for the card. |
| `word` | `string` | **Yes** | Transliterated or English representation (e.g. `kitāb / kitābun`). |
| `meaning` | `string` | **Yes** | English definition / translation. |
| `arabic` | `string` | *Optional* | Arabic script with or without tashkeel / harakat (e.g. `كِتَاب`). |
| `partOfSpeech` | `string` | *Optional* | Grammatical classification (e.g. `noun`, `verb`, `adjective`). |
| `exampleSentence` | `object` | *Optional* | Object with `arabic` (optional) and `translation` (required if object exists). |

### Two Ways to Update Words

1. **Direct File Edit**: Open [`data/vocabulary.json`](data/vocabulary.json) in your code editor and add or edit words.
2. **In-App JSON Manager**: Click the `{ } JSON Source` button in the app header to edit, paste, download, or copy JSON on the fly.

---

## 📂 Project Architecture

```
arabic-vocab-builder/
├── app/
│   ├── globals.css         # Tailwind v4 import, custom pastel variables & animations
│   ├── layout.tsx          # Root layout with offline-safe font stack & metadata
│   └── page.tsx            # Main application state, toolbar, filters & keyboard shortcuts
├── components/
│   ├── Flashcard.tsx       # Core card component (handles Simple and Detailed view states)
│   ├── PhoneMockup.tsx     # Full-width desktop workspace container (controls & navigation)
│   ├── WordModal.tsx       # Modal form to add or edit vocabulary items
│   ├── JsonModal.tsx       # Modal for viewing, editing, copying & downloading JSON
│   └── icons.tsx           # Handcrafted, zero-dependency SVG icon components
├── data/
│   └── vocabulary.json     # Primary bundled JSON vocabulary list
├── public/
│   ├── vocabulary.json     # Public static copy for direct HTTP download / inspection
│   └── favicon.ico
├── types/
│   └── vocabulary.ts       # TypeScript interfaces (VocabWord, ViewMode, FilterMode)
├── next.config.ts          # Next.js configuration
├── package.json            # Scripts and dependencies
├── pnpm-lock.yaml          # Pnpm lockfile
├── postcss.config.mjs      # PostCSS configuration integrating @tailwindcss/postcss
├── tsconfig.json           # TypeScript configuration with path aliases (@/*)
└── README.md
```

---

## 🛠️ Tech Stack & Implementation Details

- **Framework**: [Next.js 16](https://nextjs.org/) using the App Router.
- **UI & State**: [React 19](https://react.dev/) using modern hooks (`useMemo`, `useCallback`, `useState`, `useEffect`).
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss` for reliable build and dev pipeline compilation.
- **Fonts**: Safe system font stack with fallback to standard Arabic typography (`Amiri`, `Traditional Arabic`, `Scheherazade New`, `Noto Sans Arabic`), ensuring zero network dependency during build time.
- **Icons**: Clean inline SVG components with customizable stroke widths and active states.
- **Storage**: Browser `localStorage` for offline persistence with seamless hydration.

---

## 🚢 Deployment

The project can be deployed seamlessly to Vercel, Netlify, or any Node.js hosting platform:

### Deploy on Vercel

```bash
# Using Vercel CLI
pnpm dlx vercel
```

Or connect your GitHub repository directly to [Vercel](https://vercel.com/new). Build command is `pnpm build` with output directory set to default.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
