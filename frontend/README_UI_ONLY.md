# Team 18 — Frontend UI source only

This package is extracted from the teammate's uploaded `UI-jobboard` ZIP, **not** from the previously merged MVP ZIP.

## What is included
- `src/pages/`: original non-login student, employer and public page designs.
- `src/layouts/`, `src/components/`: original page shells, styles, and visual components.
- `src/index.css`: original styling (Tailwind).
- `src/i18n/`, `src/constants/`, `src/types/`, `src/utils/`: supporting frontend files.
- `src/App.tsx` and `src/main.tsx`: frontend routing and entry points (login routes removed).
- `index.html`, `vite.config.ts`, `package.json`, `tsconfig.json`: Vite/React frontend configuration.

## Removed intentionally
- `server.ts` (teammate's Express backend).
- `supabase/` (teammate's database schema).
- `src/services/` (teammate's API/auth/job/application/notification clients).
- `src/lib/supabase.ts` (teammate's Supabase client).
- `src/contexts/AuthContext.tsx` and the login/register/Google-OAuth screens.
- `.env.example`, lockfiles, backend dependencies, fake demo user-account fixtures.

## Important: not yet a working app
**This is UI source for Codex to integrate, not an executable completed frontend.**
The original page and layout components are intentionally left visually unchanged. Some pages still *refer to* the original `services/*` or `contexts/AuthContext` from their TSX bodies; the modules are not shipped. Those references will need to be replaced with the **existing root jobboard-api** contracts, and any authentication guards removed or substituted with an explicit development-only role selection. `npm run dev` will not render all screens until that integration is complete.

Do **not** add back the teammate's Express server, Supabase schema, OAuth, or their service implementation. Keep the repo's original backend, webhook, AI flow/fallback and tests untouched.

### Suggested Codex handoff

> Use this package only as the visual React/Vite frontend for our existing Job Board API. Preserve the layouts, pages, components, CSS and translation styling. Integrate it with the root backend and its actual API contract. Remove unresolved imports from the old services and AuthContext, make public student/employer demo navigation without login for the MVP, and implement post/search/apply plus validation. Do not import the teammate's server, schema, OAuth or old API clients. Verify the finished Vite build, browser flows and backend tests. Do not alter the root backend unless strictly necessary and explain such changes first.
