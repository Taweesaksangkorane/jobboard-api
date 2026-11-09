# Manual test evidence — Cloudflare demo

Run these checks in a browser against the deployed Worker. The completed rows below record the live verification performed on 2026-11-09. Before evaluation, capture one fresh browser screenshot per row and write the presenter name beside it. The records are intentionally fictional; never enter real names, contact details, CVs, or passwords.

| ID | Human action | Expected result | Evidence to capture | Result |
| --- | --- | --- | --- | --- |
| M-01 | Open `/` | Job Board opens over HTTPS and routes a signed-in user to their dashboard | Browser address bar and dashboard | Live deployment/API verified 2026-11-09; capture final browser image |
| M-02 | Open Login; sign in as the configured Student account; open notifications | Worker creates session; Student dashboard and that account's notification list load | Login response/cookie and notifications page | Observed 2026-11-09; Student dashboard screenshot available in evaluation chat |
| M-03 | Sign in as Employer; update fictional application `62` from `shortlisted` to `interview` | Status changes and API response reports an integration event | UI plus network response | Verified live 2026-11-09; `notification_sent: true` |
| M-04 | Confirm the matching Student notification after the status update | Partner webhook result is stored and visible for the matching demo profile | Both systems plus request/response | Verified live 2026-11-09; callback stored notification ID `3016` |
| M-05 | Enter a phone number longer than 10 digits, then submit | Client/API rejects it; no application is created | Form error or HTTP 400 response | Automated API test added; capture final browser image |
| M-06 | Replay an already processed partner event | Duplicate is acknowledged without a second notification | Response with `duplicate: true` | Pending joint run — requires partner test event |
| M-07 | Send a webhook request with a wrong secret | Request is rejected with HTTP 401 | Postman response; do not expose secret | Automated verification complete; capture Postman image |

## Evaluation handoff

Use the Postman collection in `postman/` for M-04, M-06, and M-07. Save screenshots outside this repository if they contain any identity or secret. M-06 remains the only joint manual run that has not been evidenced yet.
