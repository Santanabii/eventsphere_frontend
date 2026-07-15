# EventSphere — Hybrid Ticket Marketplace

A full-stack event ticketing platform for the Kenyan market: official ticket sales, a fraud-protected peer-to-peer resale marketplace, M-Pesa payments, QR gate check-in, and live organiser analytics.

## Tech stack

**Frontend** (this repo)
- React 18 + Vite
- Tailwind CSS v4
- React Router
- TanStack Query (data fetching/caching)
- Framer Motion (animation)
- Recharts (analytics charts)
- html5-qrcode (gate scanner)
- Axios (with JWT auto-refresh interceptors)
- react-hot-toast

**Backend** (separate repo)
- Django + Django REST Framework
- Django Channels (WebSocket — live analytics)
- PostgreSQL
- django-daraja (M-Pesa STK Push)
- SendGrid (ticket delivery email)
- ReportLab (PDF ticket generation)

## Folder structure

```
src/
  App.jsx, App.css, main.jsx, index.css
  components/
    Logo.jsx        Navbar.jsx        Footer.jsx        EventCard.jsx
  context/
    AuthContext.jsx          (JWT auth state, not in this bundle — see note below)
  services/
    api.js                   (axios instance + endpoint definitions, not in this bundle)
  pages/
    Landing.jsx    Events.jsx    EventDetail.jsx
    Login.jsx      Register.jsx
    Marketplace.jsx    MyTickets.jsx    Scanner.jsx
    organiser/
      Dashboard.jsx    CreateEvent.jsx    Analytics.jsx
```



## Local setup

**Prerequisites:** Node 18+, and the Django backend running (locally or deployed).

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Base URL of the Django backend, no trailing slash. Used for both REST calls (`services/api.js`) and the WebSocket connection on the organiser Analytics page. |

Vite only exposes variables prefixed `VITE_` to the browser — don't rename this without updating both `api.js` and `Analytics.jsx`.

## Connecting frontend to backend

This is almost entirely one variable (`VITE_API_URL`), plus two things to check on the **Django side** (not covered by this frontend bundle — check your backend project):

1. **CORS** — `django-cors-headers` needs your frontend's origin allowed:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",
       "https://eventsphere-frontend-iota.vercel.app/",   
   ]
   ```
2. **ALLOWED_HOSTS** — must include your Render backend's own domain (e.g. `eventsphere-api.onrender.com`).


## Deployment

### Backend → Render
Out of scope for this bundle (separate repo), but at minimum you'll need these set as Render environment variables: `SECRET_KEY`, `DATABASE_URL` (Render's managed Postgres provides this automatically), `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, your Daraja (M-Pesa) credentials, and your SendGrid API key.

### Frontend → Vercel
1. Push this repo to GitHub.
2. In Vercel: **New Project** → import the repo → framework preset **Vite** (build command `npm run build`, output directory `dist` — Vercel usually detects both automatically).
3. Add the `VITE_API_URL` environment variable in **Project Settings → Environment Variables**, pointing at your deployed Render backend (not localhost).
4. `vercel.json` (included in this bundle) adds the rewrite rule React Router needs — without it, refreshing on any route other than `/` (e.g. `/events/12`) 404s in production. Make sure it's in the project root, not inside `src/`.
5. Deploy. Every push to your main branch redeploys automatically.



## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
