<div align="center">
  <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png" alt="Logo" width="80">
  <h1>Revenue Intelligence Console</h1>
  <p><strong>A single-page application for CROs to visualize revenue performance and identifying risks.</strong></p>

 
  
  <img src="https://img.shields.io/badge/react-19.0.0-blue?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/vite-6.0.0-purple?style=flat-square&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/typescript-5.0.0-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/node.js-18.0.0-green?style=flat-square&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/express-4.21.0-gray?style=flat-square&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/mui-6.0.0-blue?style=flat-square&logo=mui" alt="MUI">
</div>


<p align="center">
  <img width="1918" height="852" alt="sky-geni" src="https://github.com/user-attachments/assets/1d8fc95f-e4bf-4254-81b8-0b4da9410db8" />
  <!-- <img src="https://placehold.co/800x400?text=Revenue+Intelligence+Console+Screenshot&font=montserrat" alt="App Screenshot" width="100%"> -->
</p>

 <p>
    <a href="https://sky-geni-jade.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/Live_Demo-Website-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Website" />
    </a>
    &nbsp;
    <a href="https://server-sky-geni.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/API_Server-Backend-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Server" />
    </a>
  </p>

## ✨ Overview

The **Revenue Intelligence Console** is a specialized dashboard designed for Chief Revenue Officers (CROs). It provides a real-time snapshot of sales performance, deal staleness, and revenue risks.

> [!NOTE]
> **Time Context**: The application simulates a "Current Date" of **Feb 5, 2026**. All fiscal quarters, risk factors, and stale deal calculations are relative to this frozen timestamp.

### 🌟 Key Features

- **Revenue Visualization** - Real-time tracking of QTD sales against targets.
- **Risk Analysis** - Identification of "Stale Deals" and high-risk opportunities.
- **Fiscal Year Tracking** - Automatic calculation of fiscal quarters and year-end projections.
- **Responsive Dashboard** - Built with Material UI for a polished, professional look.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd revenue-intelligence-console
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd server
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../client
    npm install
    ```

### Running the Application

1.  **Start the Backend Server**
    ```bash
    # From the /server directory
    npm run dev
    ```
    The server will start on `http://localhost:3000`.

2.  **Start the Frontend Client**
    ```bash
    # From the /client directory
    npm run dev
    ```
    Open your browser to the URL shown (usually `http://localhost:5173`).

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Component Library**: [Material UI (MUI)](https://mui.com/)
- **Charting**: [Recharts](https://recharts.org/) (assumed based on standard react usage) or Data Visualization libraries.

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Data Store**: In-memory JSON file store (Simulated Database)

## 📚 Project Structure

```
revenue-intelligence-console/
├── client/                   # React Frontend Application
│   ├── src/
│   │   ├── components/       # UI Components (Dashboard cards, charts)
│   │   ├── App.tsx           # Main application entry
│   │   └── main.tsx          # React DOM rendering
│   └── package.json
├── server/                   # Express Backend Application
│   ├── src/
│   │   ├── api.ts            # API Routes and Business Logic
│   │   └── data.ts           # Data Loading Utility
│   ├── data/                 # JSON Data Files (simulating DB)
│   └── package.json
└── README.md                 # Project Documentation
```

---

## 🧠 Architecture & Codebase Analysis

Below is a detailed technical breakdown of the system's design, assumptions, and tradeoffs.

### 1. What assumptions did you make?
- **Static Time Context**: The application assumes a fixed "Current Date" of `2026-02-05`. All logic (quarters, stale deals, risk factors) is relative to this hardcoded timestamp, effectively freezing the dashboard in time.
- **Data Persistence**: It is assumed that data persistence is not required for this iteration. The application relies entirely on in-memory storage populated from JSON files at startup. Support for write operations or data durability across restarts is absent.
- **Data Volume**: The system assumes the dataset will remain small enough to fit entirely in the server's memory (Heap) and to be processed synchronously without blocking the event loop for noticeable periods.
- **Single-Environment**: There is no distinction between development, staging, or production environments regarding data sources or logging strategies.
- **Data Integrity**: It is assumed that the `data/*.json` files are always present, perfectly formatted, and contain referentially consistent data (e.g., `deal.rep_id` always matches a valid `rep`).

### 2. What data issues did you find?
- **Hardcoded & Future Dates**: The `CURRENT_DATE` is hardcoded. Logic for "future" targets (2026) relies on fallbacks or potentially missing data in `targets.json`, which seems to primarily contain 2025 data.
- **Synchronous I/O**: The server loads all data synchronously (`fs.readFileSync`) at startup. While acceptable for a prototype, this inhibits scalability and startup performance.
- **Mutable Global State**: Data is exported as mutable arrays (`export let accounts = []`). This makes the state unpredictable and difficult to test or debug if write operations were ever introduced.
- **Lack of Relationships**: There is no true relational model. Joins (e.g., matching a Deal to a Rep) are done via O(N) lookups (`find`) inside request handlers, leading to N+1 query performance issues in memory.
- **Missing Validations**: There is no schema validation (e.g., Zod/Joi) for the loaded JSON data. Corrupt or missing fields in the JSON files would likely crash the application at runtime.

### 3. What tradeoffs did you choose?
- **Simplicity vs. Scalability**: I prioritized simplicity and ease of setup by using an in-memory "database" (JSON files + Arrays) over a real database (Postgres/Mongo). This removed the need for infrastructure setup (Docker, DB migrations) but sacrificed scalability and persistence.
- **Speed of Development vs. Architectural Purity**: Business logic is placed directly inside the Express route handlers (`api.ts`) rather than separated into a Service/Controller layer. This accelerated development but makes unit testing and refactoring harder.
- **Client-Side Rendering vs. Server-Side Optimization**: The API sends raw computed summaries. For detailed views (like "Trend"), the server computes aggregates on the fly. This offloads complexity from the client but puts heavy CPU pressure on the single-threaded Node.js process.

### 4. What would break at 10× scale?
- **API Latency**: The endpoints use array methods like `.filter()`, `.reduce()`, and nested `.find()` on every request. At 10x data volume, endpoints like `/drivers` and `/trend` would see significantly increased latency, potentially timing out or blocking the main thread.
- **Memory Limits**: Loading 10x or 100x larger JSON files into Node.js memory arrays could hit the V8 heap limit (default ~2GB), causing the process to crash with `OOM` (Out of Memory) errors.
- **Event Loop Blocking**: Since all calculation is synchronous, a heavy calculation for one user (e.g., calculating annual trends for thousands of deals) would block the server for *all* other users.
- **Startup Time**: Synchronously parsing hundreds of megabytes of JSON would make the server take seconds or minutes to start, making auto-scaling or restarts painful.

### 5. AI Contribution vs. Human Decisions
- **AI Contribution**: AI was instrumental in scaffolding the project structure (React + Vite + Express), generating the boilerplate code for the dashboard components (MUI layouts), and creating the mock data generators (JSON structures). It also helped quickly implement the complex date manipulation logic (Fiscal Quarter calculations) and chart data formatting (D3/Recharts preparation).
- **Human Decisions**: The decision to use a file-based, in-memory architecture to avoid database overhead was a strategic human choice for this specific "Task" context. The core business definitions (what constitutes a "Stale Deal" or "High Risk") and the visual layout requirements (matching the specific "SkyGeni" design) were human-directed constraints ensuring the product met the specific business requirements.

---

## 🛣️ Roadmap

- [ ] **Persistence Layer**: Migrate from JSON files to a relational database (PostgreSQL).
- [ ] **Authentication**: Add user login and role-based access control.
- [ ] **Advanced Filtering**: Allow users to filter data by region, product line, or sales rep.
- [ ] **Interactive Charts**: Drill-down capabilities for all dashboard widgets.
