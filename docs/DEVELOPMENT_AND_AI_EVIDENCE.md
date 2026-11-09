# Development, team, Git, and AI evidence

## System design

```text
Browser (React/Vite assets)
        |
Cloudflare Worker -- D1 database
        |
Notification Hub (partner Worker) -- webhook callback
```

The Worker serves the user interface and API from one HTTPS origin. D1 stores only fictional demo records. Protected user actions use signed role sessions; the partner integration uses a separate shared webhook secret.

## Development workflow

1. Work on a focused change and run `npm.cmd test` locally.
2. Review `git diff`, then commit a small, descriptive change.
3. Deploy with `npm.cmd run cf:deploy`.
4. Verify the Cloudflare URL and record the evidence in `MANUAL_TEST_EVIDENCE.md`.

## Team contribution record

| Member | Contribution area | Evidence to show |
| --- | --- | --- |
| 6731503012 — Taweesak Sangkoranee | Backend API and cross-group integration | `src/worker.js`, D1 queries, webhook request/callback log |
| 6731503036 — Wichayapon Seepin | UI/UX and job-search experience | Job search screen, filters, responsive layout, relevant commits |
| 6731503044 — Aubolwan Maneechan | Documentation, PDPA, and deployment evidence | README, PDPA/security document, Cloudflare deployment URL |
| 6731503123 — Sawitta Thiabsaeng | Frontend implementation | React pages/components, Student/Employer flows, deployed UI |
| 6731503127 — Onpreya Thinan | Testing and quality assurance | `tests/worker.test.mjs`, test output, manual-test evidence |

## Git evidence

Use these commands during evaluation:

```powershell
git log --oneline -12
git show --stat <commit-id>
git status --short
```

The recent commits include separate Student/Employer sessions, login/session updates, route fixes, and search-page refinement.

## AI usage disclosure

AI was used as a development assistant for code explanation, UI iteration, test-case drafting, documentation structure, and troubleshooting. All generated changes were reviewed in the repository, tested with `npm.cmd test`, and demonstrated against the deployed Cloudflare Worker. AI was not used to process real CVs, personal data, passwords, or webhook secrets.

## Evaluation demonstration roles

- Taweesak: Backend API, authorization, and Notification Hub integration.
- Wichayapon: Job search and UI/UX flow.
- Aubolwan: Documentation, PDPA, and Cloudflare deployment evidence.
- Sawitta: Student/Employer frontend flow.
- Onpreya: Automated and manual test evidence.
