# 🛡️ Bharat-Shield-Sentinel Dashboard (Frontend)

This directory contains the user interface and analytics dashboard for **Bharat-Shield-Sentinel**, built using **React** and **Vite**.

## 🚀 Features

- **Real-Time Threat Monitoring**: Interactive dashboard views displaying active campaigns, signal severity breakdown, and platform propagation metrics.
- **Multilingual Signal Feed**: Live tipline stream showing raw and translated signals alongside intent classifications.
- **Evidence Audit View**: Interface for inspecting cryptographic SHA-256 evidence packages and audit trails.
- **High-Performance UI**: Powered by Vite with fast HMR (Hot Module Replacement) and optimized bundling.

---

## 🛠️ Development Setup

### 1. Installation
Install dependencies via npm:
```bash
npm install
```

### 2. Run Local Development Server
Start Vite dev server:
```bash
npm run dev
```
By default, the application will run at `http://localhost:5173`.

### 3. Build for Production
To bundle the application for production deployment:
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

### 5. Code Linting
Run ESLint to check for code quality and formatting issues:
```bash
npm run lint
```

---

## 📁 Project Structure

```
frontend/
├── public/            # Static assets and icons
├── src/
│   ├── assets/        # Visual assets and styles
│   ├── components/    # Reusable UI components
│   ├── App.jsx        # Root application layout
│   └── main.jsx       # Application entry point
├── index.html         # HTML template
├── vite.config.js     # Vite configuration
└── package.json       # Project dependencies & scripts
```

---

## 🔌 API Integration

The frontend connects to the backend FastAPI service (default `http://localhost:8000`). Make sure the backend server is running and CORS is configured appropriately.
