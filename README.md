<div align="center">
  <img src="frontend/public/logo.png" alt="Vigil Logo" width="120" />
  
  # Vigil
  
  **The open-source behavioral drift monitor for Large Language Models.**

  <p align="center">
    <i>Know the exact moment your LLM changes its behavior, before your users do.</i>
  </p>

  [![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
  [![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

  [Live Demo](#live-demo) • [How it Works](#how-it-works) • [Getting Started](#getting-started) • [Architecture](#architecture)
</div>

---

## 🚨 The Silent Problem with LLM APIs

You ship an AI feature. It works perfectly. Users are happy.

Three months later, support tickets arrive. The bot sounds different. The JSON output is malformed. A safety check stopped working. Nobody knows why — because the underlying model was silently updated by the provider under the same API endpoint.

This happens constantly. OpenAI updated `gpt-4o` at least 6 times in 2024 without major announcements. You have no way to know.

**Vigil solves this with systematic, automated weekly monitoring.**

---

## ✨ Live Demo & Screenshots

<!-- USER: ADD YOUR LIVE DEMO LINK AND SCREENSHOTS BELOW THIS LINE -->

🔗 **[Live Demo: Vigil](https://vigil-nu-seven.vercel.app/)**

<div align="center">
  <img src="docs/screenshots/dashboard.png" alt="Vigil Dashboard" width="800" />
  <p><i>Dashboard showing active models with real drift data</i></p>
</div>

<details>
<summary><b>View more screenshots</b></summary>

<div align="center">
  <br/>
  <img src="docs/screenshots/model-detail.png" alt="Model Detail" width="800" />
  <p><i>Model detail page with stability trend chart</i></p>
  
  <img src="docs/screenshots/report.png" alt="Technical Report" width="800" />
  <p><i>Full technical report with statistical breakdown</i></p>
</div>

</details>

<!-- USER: END SCREENSHOTS SECTION -->

---

## ⚙️ How It Works

Vigil takes the guesswork out of model consistency by applying rigorous statistical testing to LLM outputs.

### 1️⃣ 100-Prompt Behavioral Test Suite
A curated suite of prompts across 4 behavioral categories runs against your model every week:
- 🧠 **Factual accuracy** — Does it still get established facts right?
- 📋 **Format adherence** — Does it reliably produce valid JSON?
- 🎯 **Instruction following** — Does it follow explicit, multi-step rules?
- 📝 **Response verbosity** — Has its conversational length shifted?

### 2️⃣ Statistical Drift Detection
LLMs are non-deterministic, making drift detection difficult. Vigil requires two conditions to be true before an alert fires, eliminating false alarms:
- **Z-score > 2.5:** Statistically unlikely to be random noise.
- **Cohen's d > 0.2:** The shift is practically significant.

### 3️⃣ Locked Baselines
Baselines only update when you explicitly run `--reset-baselines`. This prevents gradual, slow drift from hiding itself by slowly shifting the reference point.

### 4️⃣ Semantic Similarity
For open-ended responses, Vigil uses `sentence-transformers` to compute the cosine similarity between the current response and the baseline, catching changes in meaning even when the response length stays exactly the same.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Python 3.12+**
- **Node.js 18+**
- [**uv**](https://docs.astral.sh/uv/) (Fast Python package manager)

### 1. Clone & Install
```bash
git clone https://github.com/Akshat1322/vigil.git
cd vigil

# Install Python dependencies
uv sync

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env and add your required API keys (e.g., GROQ_API_KEY)
```

### 3. Run the App
Start the full stack with a single command:
```bash
python start_dev.py
```
> **Frontend:** `http://localhost:3000`  
> **Backend API:** `http://localhost:8000/docs`

### 4. Run the Evaluation Harness
You can manually trigger the evaluation suite against any supported model:
```bash
# Run against a local Ollama model
uv run python -m harness.runner --model ollama/llama3

# Establish or reset the baseline for a model
uv run python -m harness.runner --model ollama/llama3 --reset-baselines
```

---

## 🏗️ Architecture

<details>
<summary><b>Click to view architecture diagram</b></summary>

```text
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
│  ├── Statistical scorer (Cosine similarity)     │
│  ├── Baseline manager                           │
│  ├── Drift detector (Z-score + Cohen's d)       │
│  └── BSI calculator                             │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  SQLite Database (data/drift_monitor.db)        │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  FastAPI Backend (api/)                         │
│  └── Serves stats, history, and reports         │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  Next.js 16 Frontend (frontend/)                │
│  └── Responsive SaaS UI                         │
└─────────────────────────────────────────────────┘
```
</details>

### Key Technologies
- **Backend:** Python 3.12, FastAPI, SQLModel (SQLite), `scipy`, `sentence-transformers`
- **Frontend:** Next.js 16 (App Router), Tailwind CSS, Recharts
- **Infrastructure:** GitHub Actions, Render (API), Vercel (Frontend)

---

## 🗺️ Roadmap

- [x] 100-prompt behavioral test suite
- [x] Statistical drift detection (Z-score + Cohen's d)
- [x] Semantic similarity scoring
- [x] BSI (Behavioral Stability Index) metric
- [x] Dark SaaS dashboard with Glassmorphism
- [x] Mobile-responsive UI
- [x] Automated GitHub Actions CI/CD
- [ ] Email + Slack automated alerts
- [ ] Custom prompt suite uploads
- [ ] User authentication & Pro tier

---

## 🤝 Contributing

Contributions are always welcome! If you have a major architectural change or new feature idea, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

<div align="center">
  <i>Built with 🖤 by <a href="https://github.com/Akshat1322">Akshat Sharma</a></i>
</div>
