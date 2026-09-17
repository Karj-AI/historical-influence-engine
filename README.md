# 🌳 Historical Influence Engine

An interactive exploration of history's most influential figures, navigated
through a stylized Yggdrasil-inspired world tree instead of a map or list.
Click a continent branch, then a country branch, and see who shaped that
region — with a time slider that dynamically recalculates the ranking as
you move through history.

## Features

- 🌲 **Interactive world tree** — a procedurally-built, tapered, twisting
  trunk with branches attached at different heights, ending in dense pixel
  foliage clusters. Continents branch off the trunk; clicking one reveals
  its countries as smaller sub-branches
- 📊 **Dynamic influence ranking** — each figure has a calculated score from
  three weighted factors (global impact, longevity, cross-region impact),
  not a fixed number
- ⏳ **Time slider (1000 BC → 2025)** — dragging it live-recalculates who
  qualifies and ranks in the top 10 for a region, based on whether their
  influence had begun by that year
- 🔍 **Search** — find any of the 59 figures by name; selecting a result
  flies the relevant country into focus and opens their detail panel
- 🔗 **Influence connections** — each figure's detail view shows who they
  influenced and who influenced them
- 🏳️ **Stylized pixel flags** — procedurally generated per-country flag
  icons instead of generic avatars
- 📜 **Parchment-style detail panels** — opaque, aged-paper panels with ink
  colored text, styled to feel like an old scroll rather than a modern
  glass card
- 🍎 apple-emoji cursor and a dark, star-filled mythic background as a
  finishing touch

## Data

15 countries across 4 continents (Europe, Asia, Africa, Americas), 59 real
historical figures total, each with a factual description and an influence
score breakdown. A handful of real influence relationships are wired
between figures (e.g. Cleopatra → Caesar → Augustus) to populate the
"influenced / influenced by" detail view.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS, custom pixel-art SVG/Canvas rendering |
| Animation | Framer Motion |
| Backend | Flask (Python) |
| Database | SQLite via SQLAlchemy |
| Cross-origin requests | Flask-CORS |

## How the Ranking Works

```
User selects a country (via tree or search)
        ↓
Backend filters that country's people to only those whose
influence had started by the selected year (era_start <= year)
        ↓
Remaining people are ranked by influence_score, top 10 returned
        ↓
Moving the time slider re-triggers this filter+rank in real time
```

`influence_score` is calculated per person as a weighted combination of
three 0-100 sub-scores (global impact 50%, longevity 30%, cross-region
impact 20%) rather than a single arbitrary number, so it's transparent and
explainable in the detail view's breakdown section.

## Installation

```bash
git clone <this-repo-url>
cd historical-influence-engine

# --- Backend ---
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt

# --- Frontend ---
cd ../frontend
npm install
```

## Running Locally

Two terminals required.

**Terminal 1 (backend):**
```bash
cd backend
python seed_data.py   # only needed once, or after deleting historical.db
python app.py
```
Runs on `http://127.0.0.1:5050`

**Terminal 2 (frontend):**
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:5173` — open this in your browser. API calls are
proxied automatically to the Flask backend.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/countries` | List of all countries with continent, coordinates |
| GET | `/people?country_id=&year=` | Top 10 ranked figures for a country at a given year |
| GET | `/person/<id>` | Full detail for one figure, including influence links |
| GET | `/search?q=` | Search figures by name (min 2 characters) |

## Project Structure

```
historical-influence-engine/
├── backend/
│   ├── app.py              ← Flask routes
│   ├── models.py           ← Country, Person, influence relationship models
│   ├── seed_data.py        ← Populates the 15-country, 59-person dataset
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.jsx                     ← Top-level state and layout
        ├── api.js                      ← Fetch helpers
        ├── index.css                    ← Theme, parchment panel styles
        └── components/
            ├── WorldTree.jsx             ← The core interactive tree
            ├── PixelFlag.jsx              ← Procedural country flag icons
            ├── RegionPanel.jsx             ← Time slider + ranked list
            ├── TimeSlider.jsx
            ├── FigureCard.jsx
            ├── FigureDetail.jsx
            └── SearchBar.jsx
```

## Limitations

- This is a portfolio/demo project — no authentication, no user accounts,
  no production security hardening (rate limiting, CSRF, etc. were not
  added since there's no user input beyond search and no data being
  written by visitors)
- SQLite is fine at this scale but isn't built for concurrent write-heavy
  production use
- The dataset (59 figures) is illustrative, not exhaustive — many more
  historical figures and countries could be added following the same
  `seed_data.py` pattern

## Future Improvements

- [ ] More countries and figures
- [ ] A proper "influence graph" visualization connecting figures across regions
- [ ] Deploy live (Render + Vercel or similar) for a shareable demo link
- [ ] Mobile-responsive tree layout
