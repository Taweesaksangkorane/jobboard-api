# Job Board frontend

React/Vite UI integrated with the Cloudflare Worker and D1 backend.

## Run locally

From the repository root:

```powershell
npm.cmd run cf:db:local
npm.cmd run cf:dev
```

Open the URL printed by Wrangler (normally `http://localhost:8787`).
Use the Login/Register link to choose the development-only Student #4 or Employer #1 role.

## Cloudflare architecture

- `src/worker.js` serves the API and frontend assets.
- D1 stores jobs, applications, notifications, integration events and the retry outbox.
- A Cron Trigger retries pending notification events every minute.
- Authentication/profile remains development-only role selection because it was not part of the original backend contract.
