# Vigil — AI Model Monitor

> Know when your AI changes behavior.

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

LLM providers update their models silently. The same API 
endpoint you called last month may behave differently today 
— and you won't know until your users complain.

**Vigil** runs 100 behavioral checks against your AI models 
every week and alerts you the moment something shifts, 
before your users notice.

---

## Live Demo

🔗 **[vigil.live](https://vigil.live)** ← coming soon

![Vigil Dashboard](docs/screenshots/dashboard.png)
*Dashboard showing two models with real drift data*

![Model Detail](docs/screenshots/model-detail.png)
*Model detail page with stability trend chart*

![Technical Report](docs/screenshots/report.png)
*Full technical report with statistical breakdown*

---

## The Problem

You ship an AI feature. It works. Users are happy.

Three months later, support tickets arrive. The bot sounds 
different. JSON output is malformed. A safety check stopped 
working. Nobody knows why — because the model changed 
silently under the same API endpoint.

This happens constantly. OpenAI updated GPT-4o at least 
6 times in 2024 without major announcements. Google updates 
Gemini Flash regularly. You have no way to know.

**Vigil solves this with systematic weekly monitoring.**

---

## How It Works

**1. 100-prompt behavioral test suite**
A curated suite of prompts across 4 behavioral categories 
runs against your model every week:
- **Factual accuracy** — does it still get facts right?
- **Format adherence** — does it still produce valid JSON?
- **Instruction following** — does it follow explicit rules?
- **Response length consistency** — has verbosity shifted?

**2. Statistical drift detection**
Two conditions must both be true before an alert fires:
- **Z-score > 2.5** — statistically unlikely to be noise
- **Cohen's d > 0.2** — large enough to matter in practice

This dual-threshold approach eliminates false alarms from 
normal LLM variance while catching real behavioral shifts.

**3. Baselines are locked, not rolling**
Baselines only update when you explicitly run 
`--reset-baselines`. This prevents gradual drift from 
hiding itself by slowly shifting the reference point.

**4. Semantic similarity scoring**
For open-ended responses, Vigil uses sentence-transformers 
to compute cosine similarity between the current response 
and the baseline — catching meaning drift even when 
response length stays the same.

---

## Key Metrics

| Metric | Description |
|--------|-------------|
| **BSI (Behavioral Stability Index)** | 0-100 composite score across all categories |
| **Regression Rate** | Fraction of prompts showing drift (e.g. 3%) |
| **Semantic Similarity** | Cosine similarity to baseline response (verbosity category) |
| **Cohen's d** | Effect size — separates meaningful drift from noise |

---

## Dashboard

Three-layer UI designed for both technical and 
non-technical users:

**Landing page** — explains the product to new visitors

**Dashboard** — plain English status for each model
- "All clear" / "Changes detected" / "Needs attention"
- Checks passed (e.g. "97 of 100")
- Stability trend sparkline
- Real-time relative timestamps

**Technical report** — full statistical breakdown
- Per-prompt Z-score, Cohen's d, semantic similarity
- Direction and magnitude of each drift event
- Sortable by category

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│  GitHub Actions (weekly cron — every Monday)    │
│  uv run python -m harness.runner                │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  Harness (Python)                               │
│  ├── 100-prompt suite (prompts_v2.json)         │
│  ├── Deterministic scorers                      │
│  │   (exact_match, json_valid, exact_count,     │
│  │    token_count)                              │
│  ├── Statistical scorer                         │
│  │   (cosine similarity via sentence-           │
│  │    transformers)                             │
│  ├── Baseline manager                           │
│  │   (static ground truth + rolling median)    │
│  ├── Drift detector                             │
│  │   (Z-score + Cohen's d + Mann-Whitney U)     │
│  └── BSI calculator                             │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  SQLite Database (data/drift_monitor.db)        │
│  ├── RunResult — per-prompt scores              │
│  ├── Baseline — established reference points    │
│  └── SemanticBaseline — embedding baseline text │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  FastAPI Backend (api/)                         │
│  ├── GET /api/models                            │
│  ├── GET /api/models/{id}                       │
│  ├── GET /api/models/{id}/history               │
│  ├── GET /api/models/{id}/report                │
│  └── POST /api/cache/clear                      │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  Next.js Frontend (frontend/)                   │
│  ├── / — Landing page                           │
│  ├── /dashboard — Model cards + sparklines      │
│  ├── /models/[id] — Detail + trend chart        │
│  └── /reports/[id] — Full technical report      │
└─────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Python 3.12 |
| Package manager | uv |
| Backend framework | FastAPI + Uvicorn |
| Database ORM | SQLModel (SQLite) |
| Statistical tests | scipy (Mann-Whitney U, Z-score) |
| Embeddings | sentence-transformers (all-MiniLM-L6-v2) |
| Frontend | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Scheduling | GitHub Actions |
| Deployment | Render (API) + Vercel (Frontend) |

---

## How Drift Detection Works

LLMs are non-deterministic — the same prompt produces 
slightly different outputs on every call. This makes drift 
detection hard: how do you know if a model genuinely changed, 
or if you're seeing normal random variation?

Vigil separates these deliberately:

**Baselines are locked, not rolling.**
When you run `--reset-baselines`, the current model behavior 
is recorded as the reference point. Every subsequent run 
compares against that fixed baseline — not last week's run. 
Gradual drift can't hide by slowly shifting the reference.

**Both statistical AND practical significance required.**
A change must pass two independent tests:
- Z-score > 2.5 (statistically unlikely to be random noise)
- Cohen's d > 0.2 (large enough to actually matter)

This prevents false alarms from low-variance categories 
where tiny changes produce large Z-scores.

**Baselines only reset when you say so.**
Only `uv run python -m harness.runner --reset-baselines` 
updates them. A model that drifts and drifts back will 
show both events correctly.

---

## Local Development

### Prerequisites
- Python 3.12+
- Node.js 18+
- [uv](https://docs.astral.sh/uv/) package manager
- [Ollama](https://ollama.ai/) (for local model testing)

### Setup

```bash
# Clone the repo
git clone https://github.com/Akshat1322/vigil.git
cd vigil

# Install Python dependencies
uv sync

# Install frontend dependencies
cd frontend && npm install && cd ..

# Copy environment variables
cp .env.example .env
# Edit .env and add your API keys

# Pull a local model (for testing)
ollama pull llama3
```

### Running locally

```bash
# Option 1 — One command (recommended)
python start_dev.py

# Option 2 — Two terminals
# Terminal 1:
uv run uvicorn api.main:app --host 0.0.0.0 --port 8000

# Terminal 2:
cd frontend && npm run dev
```

Then visit:
- `http://localhost:3000` — Landing page
- `http://localhost:3000/dashboard` — Dashboard
- `http://localhost:8000/docs` — API documentation

### Running the harness

```bash
# Run against local Ollama
uv run python -m harness.runner --model ollama/llama3

# Establish/reset baselines
uv run python -m harness.runner --model ollama/llama3 \
  --reset-baselines

# Run against Gemini Flash (requires GOOGLE_API_KEY)
uv run python -m harness.runner \
  --model gemini/gemini-1.5-flash
```

---

## Prompt Suite

100 prompts across 4 behavioral categories 
(25 prompts each):

| Category | Scorer | Baseline Type | What It Tests |
|----------|--------|---------------|---------------|
| Factual accuracy | Exact match | Static ground truth | Single-fact questions with known answers |
| Format adherence | JSON validation | Deterministic | JSON output with required keys |
| Instruction following | Exact count | Deterministic | Lists with exact item counts |
| Response length | Token count + cosine similarity | Rolling median | Open-ended explanations |

Prompt suite versioned in `harness/prompts/`. 
Current version: **v2** (100 prompts).

---

## Project Structure

```
vigil/
├── harness/                 # Core evaluation engine
│   ├── prompts/             # Prompt suite (JSON)
│   ├── scorers/             # Deterministic + statistical
│   ├── baseline/            # Baseline management
│   ├── drift/               # Drift detection + BSI
│   ├── runner.py            # Main entry point
│   └── db.py                # SQLite via SQLModel
├── api/                     # FastAPI REST API
│   ├── routes/              # Endpoint handlers
│   ├── schemas.py           # Pydantic response models
│   └── main.py              # App + startup
├── frontend/                # Next.js dashboard
│   ├── app/                 # App Router pages
│   │   ├── page.tsx         # Landing page
│   │   ├── dashboard/       # Model cards
│   │   ├── models/[id]/     # Model detail
│   │   └── reports/[id]/    # Technical report
│   ├── components/          # Shared components
│   └── lib/                 # API client + constants
├── .github/workflows/       # GitHub Actions (weekly runs)
├── data/                    # SQLite database
├── render.yaml              # Render deployment config
└── start_dev.py             # One-command local setup
```

---

## Roadmap

- [x] 100-prompt behavioral test suite
- [x] Statistical drift detection (Z-score + Cohen's d)
- [x] Semantic similarity scoring
- [x] BSI (Behavioral Stability Index) metric
- [x] Regression rate metric
- [x] Multi-model support
- [x] BSI trend chart
- [x] Dark SaaS dashboard (Vigil)
- [x] Landing page
- [x] GitHub Actions automation
- [ ] Gemini Flash integration (Phase 6)
- [ ] Email + Slack alerts
- [ ] Custom prompt suite upload
- [ ] "Test your own prompt" feature
- [ ] User authentication
- [ ] Pricing + Pro tier

---

## Contributing

Pull requests welcome. For major changes, 
open an issue first.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Built by [Akshat Sharma](https://github.com/Akshat1322)*

---
