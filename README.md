## Cooling System Dashboard

A full‑stack cooling system monitoring dashboard built with **React + Vite + TypeScript** on the frontend and **Django REST Framework** on the backend.

The frontend visualizes temperature, frequency, RB cells, RFID access, materials, and security logs. The backend exposes JWT‑protected APIs consumed by the frontend.

---

## Prerequisites

- **Node.js** ≥ 18 and **npm**
- **Python** ≥ 3.10
- (Windows) **PowerShell**

---

## Project Structure

- `src/` – React frontend (Vite, Tailwind CSS)
- `beckend/` – Django backend (`manage.py`, apps: `Users`, `temp`, `freq`, `rbs`, `rfid`, `material`, `ai_model`, `desc`)
- `.env` – frontend environment (already set to `VITE_API_URL=http://localhost:8000`)

---

## Running the Backend (Django API)

From a **new PowerShell window**:

```powershell
cd "c:\Users\happy\Downloads\cooling system\cooling system\beckend"
```

1. **Create and activate a virtual environment** (recommended):

```powershell
py -m venv .venv
.\.venv\Scripts\activate
```

2. **Install Python dependencies**  
Install Django, DRF, auth + CORS, and AI libraries:

```powershell
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers xgboost stable-baselines3
```

3. **(Optional but recommended) Freeze dependencies to `requirements.txt`**:

```powershell
pip freeze > requirements.txt
```

4. **Apply database migrations**:

```powershell
py manage.py migrate
```

5. (Optional) **Create a superuser** to log in with admin credentials:

```powershell
py manage.py createsuperuser
```

6. **Default demo login user**

On first startup, the backend automatically creates a demo admin user:

- **Username**: `demo`
- **Password**: `demo1234`

You can use this account to log into the dashboard immediately. You can also create your own users later from Django or via the API.

7. **Run the development server**:

```powershell
py manage.py runserver
```

The API will be available at `http://127.0.0.1:8000` (same as `http://localhost:8000`), which matches the frontend configuration.

> **Note on AI models**
>
> - Pre‑trained XGBoost models are expected at:
>   - `beckend/ai_model/models/xgb_rbs_model.json`
>   - `beckend/ai_model/models/xgb_freq_model.json`
> - An optional RL model can be placed at:
>   - `beckend/ai_model/models/dc_cooling_ppo.zip`
> - If the RL model file is missing, the backend uses a **dummy policy** that returns a neutral action so the API still runs.

---

## Running the Frontend (React + Vite)

In another **PowerShell window**:

```powershell
cd "c:\Users\happy\Downloads\cooling system\cooling system"
```

1. **Install Node dependencies** (only needed once):

```powershell
npm install
```

2. **Ensure API URL is configured**  
The file `.env` should contain:

```bash
VITE_API_URL=http://localhost:8000
```

3. **Start the Vite dev server**:

```powershell
npm run dev
```

Vite will print a URL such as `http://localhost:5173`. Open it in your browser.

4. **Login**  
Use a user that exists in the Django database (for example the superuser you created) to sign in. On successful login, the frontend stores a JWT token and starts calling the protected API endpoints.

---

## Why you might see “failed to load data”

On the **Energy** and **Dashboard** pages, the frontend fetches data from several endpoints via `src/api.ts`. When a request fails, it shows error toasts:

- `EnergyPage.tsx` calls `addToast('failed_to_load_data', 'error')` for:
  - `api.getSystemStats()` → `GET /temp/list-stats/`
  - `api.getFrequencyData()` → `GET /freq/list-signal-data/`
  - `api.getRbsData()` → `GET /rbs/list-signal-data/`
- `DashboardPage.tsx` shows similar toasts like **"Failed to load temperature data"**, **"Failed to load frequency data"**, etc.

Common reasons for this error:

- **Backend is not running** on `http://localhost:8000` → all fetches fail.
- **Wrong URL / port** → make sure `.env` uses `VITE_API_URL=http://localhost:8000` and `src/api.ts` `BASE` is `http://localhost:8000`.
- **Authentication failure (401/403)** → you are not logged in or token is invalid; login again.
- **Endpoint path mismatch** between frontend and Django URLs (e.g. `/temp/list-stats/` not defined).

---

## Quick Checklist to Fix “failed to load data”

- **1. Backend running?**
  - In the `beckend` folder, run `py manage.py runserver` and keep it open.
- **2. Frontend using correct API base URL?**
  - `.env` contains `VITE_API_URL=http://localhost:8000`.
  - `src/api.ts` has `const BASE = 'http://localhost:8000';`.
- **3. Logged in with a valid user?**
  - Login from the UI; confirm network requests now include `Authorization: Bearer <token>`.
- **4. Endpoints exist in Django?**
  - Make sure Django `urls.py` in apps `temp`, `freq`, `rbs`, `rfid`, `material`, `desc`, `Users` define paths like:
    - `/temp/list-stats/`
    - `/freq/list-signal-data/`
    - `/rbs/list-signal-data/`
    - `/rfid/list/`
    - `/materials/list/`
    - `/logs/logs/`
    - `/users/token/`, `/users/register/`, `/users/admin/users/`

If any of these are missing or have different paths, update either the Django URLs or `src/api.ts` so both sides match.

---

## Building for Production

To create an optimized production build of the frontend:

```powershell
cd "c:\Users\happy\Downloads\cooling system\cooling system"
npm run build
```

The static files will be generated in the `dist/` folder.

