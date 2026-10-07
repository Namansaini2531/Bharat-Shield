# 🛡️ Bharat-Shield-Sentinel

**Bharat-Shield-Sentinel** is an advanced, enterprise-grade AI and Blockchain-powered Information Operations (IO) & Misinformation Intelligence Sentinel system. Designed for real-time monitoring, multilingual semantic threat classification, cross-platform coordination detection, and tamper-proof evidence preservation.

---

## 🌟 Key Features

- **🌐 Multilingual Tipline & Signal Ingestion**: Real-time signal collection supporting multiple regional languages with automated translation & intent classification.
- **🧠 Vector Similarity & Semantic Clustering**: Utilizes `pgvector` with HNSW vector indexing and `sentence-transformers` (384-dimensional embeddings) to detect emergent disinformation campaigns.
- **⚡ AI Threat & Coordination Scoring**: Algorithmic threat matrix for evaluating botnet activity, synthetic media probability, and cross-platform campaign reach.
- **🔗 Blockchain Evidence Audit Ledger**: Cryptographic SHA-256 hashing and immutable audit logging for evidence packages, ensuring chain-of-custody for legal and compliance analysis.
- **📊 Real-time Monitoring Dashboard**: Modern React + Vite frontend dashboard built for intelligence analysts and threat responders.
- **🐳 Containerized Architecture**: Out-of-the-box support for Docker Compose orchestrating PostgreSQL (with pgvector extension) and Redis pub/sub caching.

---

## 🏗️ Architecture & Component Overview

```
Bharat-Shield-Sentinel/
├── 🧠 ai/                   # AI/ML Pipeline & Threat Engine
│   ├── clustering/         # Campaign grouping & semantic clustering
│   ├── threat_scoring/     # Botnet & coordination scoring matrices
│   └── embeddings.py       # Sentence Transformers embedding generator
├── ⚙️ backend/              # FastAPI REST API & Ingestion Engine
│   ├── app/                # Main application logic & endpoints
│   └── requirements.txt    # Backend Python dependencies
├── 🔗 blockchain/           # Cryptographic Audit Ledger & Proof Engine
│   └── evidence/           # SHA-256 tamper-proof evidence hashing
├── 🗄️ database/             # Relational & Vector Storage Layer
│   ├── init.sql            # PostgreSQL schema with pgvector & HNSW index
│   └── db.py               # Database connections & ORM models
├── 🖥️ frontend/             # React + Vite Sentinel Dashboard
│   ├── src/                # UI Components & Analytics views
│   └── package.json        # Frontend dependencies
├── 📊 data/                 # Raw/Processed signal storage & datasets
├── 🛠️ scripts/              # Dataset generation & benchmark tools
└── 🐳 docker-compose.yml    # Service orchestration (Postgres pg16 + Redis)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Docker & Docker Compose](https://www.docker.com/)
- [Python 3.10+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/)

### 1. Database & Cache Setup (Docker)
Start the PostgreSQL (with `pgvector`) and Redis containers:
```bash
docker-compose up -d
```

### 2. Backend API Setup
Navigate to the `backend` directory, install dependencies, and start the FastAPI server:
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`

### 3. Frontend Setup
Navigate to the `frontend` directory, install packages, and launch the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
- Web Dashboard: `http://localhost:5173`

### 4. Synthetic Intelligence Data Generation
To populate the database with benchmark signals and test campaigns:
```bash
python scripts/generate_dataset.py
python scripts/test_intelligence.py
```

---

## 🗄️ Database Schema & Vector Indexing

The PostgreSQL database leverages `pgvector/pgvector:pg16` with the following core entities:
1. `campaigns`: Tracks active disinformation campaigns, language distribution, platform reach, and overall threat levels.
2. `tipline_signals`: Stores incoming raw payloads, detected languages, intent classifications, severity, and `vector(384)` embeddings indexed with HNSW (`vector_cosine_ops`).
3. `audit_ledger`: SHA-256 hash verified tamper-proof log for tracking analyst activity and evidence preservation.

---

## 🛡️ License & Compliance

Developed for information security research, digital threat response, and platform integrity verification.
