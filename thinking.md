# Thinking Process & Codebase Analysis

Answer:

## 1. What assumptions did you make?
- **Static Time Context**: The application assumes a fixed "Current Date" of `2026-02-05`. All logic (quarters, stale deals, risk factors) is relative to this hardcoded timestamp, effectively freezing the dashboard in time.
- **Data Persistence**: It is assumed that data persistence is not required for this iteration. The application relies entirely on in-memory storage populated from JSON files at startup. Support for write operations or data durability across restarts is absent.
- **Data Volume**: The system assumes the dataset will remain small enough to fit entirely in the server's memory (Heap) and to be processed synchronously without blocking the event loop for noticeable periods.
- **Single-Environment**: There is no distinction between development, staging, or production environments regarding data sources or logging strategies.
- **Data Integrity**: It is assumed that the `data/*.json` files are always present, perfectly formatted, and contain referentially consistent data (e.g., `deal.rep_id` always matches a valid `rep`).

## 2. What data issues did you find?
- **Hardcoded & Future Dates**: The `CURRENT_DATE` is hardcoded. Logic for "future" targets (2026) relies on fallbacks or potentially missing data in `targets.json`, which seems to primarily contain 2025 data.
- **Synchronous I/O**: The server loads all data synchronously (`fs.readFileSync`) at startup. While acceptable for a prototype, this inhibits scalability and startup performance.
- **Mutable Global State**: Data is exported as mutable arrays (`export let accounts = []`). This makes the state unpredictable and difficult to test or debug if write operations were ever introduced.
- **Lack of Relationships**: There is no true relational model. Joins (e.g., matching a Deal to a Rep) are done via O(N) lookups (`find`) inside request handlers, leading to N+1 query performance issues in memory.
- **Missing Validations**: There is no schema validation (e.g., Zod/Joi) for the loaded JSON data. Corrupt or missing fields in the JSON files would likely crash the application at runtime.

## 3. What tradeoffs did you choose?
- **Simplicity vs. Scalability**: I prioritized simplicity and ease of setup by using an in-memory "database" (JSON files + Arrays) over a real database (Postgres/Mongo). This removed the need for infrastructure setup (Docker, DB migrations) but sacrificed scalability and persistence.
- **Speed of Development vs. Architectural Purity**: Business logic is placed directly inside the Express route handlers (`api.ts`) rather than separated into a Service/Controller layer. This accelerated development but makes unit testing and refactoring harder.
- **Client-Side Rendering vs. Server-Side Optimization**: The API sends raw computed summaries. For detailed views (like "Trend"), the server computes aggregates on the fly. This offloads complexity from the client but puts heavy CPU pressure on the single-threaded Node.js process.

## 4. What would break at 10× scale?
- **API Latency**: The endpoints use array methods like `.filter()`, `.reduce()`, and nested `.find()` on every request. At 10x data volume, endpoints like `/drivers` and `/trend` would see significantly increased latency, potentially timing out or blocking the main thread.
- **Memory Limits**: Loading 10x or 100x larger JSON files into Node.js memory arrays could hit the V8 heap limit (default ~2GB), causing the process to crash with `OOM` (Out of Memory) errors.
- **Event Loop Blocking**: Since all calculation is synchronous, a heavy calculation for one user (e.g., calculating annual trends for thousands of deals) would block the server for *all* other users.
- **Startup Time**: Synchronously parsing hundreds of megabytes of JSON would make the server take seconds or minutes to start, making auto-scaling or restarts painful.

## 5. What did AI help with vs what you decided?
- **AI Contribution**: AI was instrumental in scaffolding the project structure (React + Vite + Express), generating the boilerplate code for the dashboard components (MUI layouts), and creating the mock data generators (JSON structures). It also helped quickly implement the complex date manipulation logic (Fiscal Quarter calculations) and chart data formatting (D3/Recharts preparation).
- **Human Decisions**: The decision to use a file-based, in-memory architecture to avoid database overhead was a strategic human choice for this specific "Task" context. The core business definitions (what constitutes a "Stale Deal" or "High Risk") and the visual layout requirements (matching the specific "SkyGeni" design) were human-directed constraints ensuring the product met the specific business requirements.
