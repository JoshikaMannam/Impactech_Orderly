# Orderly

Orderly is a full-stack restaurant ordering platform scaffold with separate backend and frontend workspaces.

## Project Overview

The repository is organized as a monorepo with:

- `backend/` for API routes, business logic, models, database helpers, and middleware.
- `frontend/` for the React-based user interface, split into customer and staff flows.

Current status:
- The project structure is fully scaffolded.
- Most source files are currently placeholders and ready for implementation.

## Folder Structure

- `backend/main.py` - backend application entry point
- `backend/routes/` - auth, menu, orders, staff, voice route modules
- `backend/services/` - AI, order, recommendation, and voice services
- `backend/models/` - domain models (users, orders, menu items)
- `backend/database/` - database setup/helpers
- `backend/middleware/` - custom middleware such as auth handling

- `frontend/src/pages/` - page-level UI for landing, customer, and staff dashboards
- `frontend/src/components/customer/` - customer ordering UI components
- `frontend/src/components/staff/` - staff order management components
- `frontend/src/components/analytics/` - analytics charts and visualizations
- `frontend/src/context/` - shared React contexts
- `frontend/src/hooks/` - reusable custom hooks
- `frontend/src/services/` - frontend API and auth service modules

## Getting Started

### 1. Clone and enter project

```bash
git clone <your-repo-url>
cd orderly
```

### 2. Backend setup (Python)

```bash
cd backend
python -m venv .venv
```

Activate virtual environment:

- Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

- macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies (when `requirements.txt` is populated):

```bash
pip install -r requirements.txt
```

### 3. Frontend setup (Node.js)

```bash
cd ../frontend
npm install
```

Run frontend (once scripts are added to `frontend/package.json`):

```bash
npm run dev
```

## Recommended Next Steps

- Add backend framework/dependencies to `backend/requirements.txt`.
- Add frontend scripts and dependencies to `frontend/package.json`.
- Implement API in `backend/main.py` and route modules.
- Wire frontend service layer in `frontend/src/services/` to backend endpoints.

## Contributing

1. Create a feature branch.
2. Commit focused changes.
3. Open a pull request with clear scope and testing notes.

## License

Add your preferred license in a `LICENSE` file.
