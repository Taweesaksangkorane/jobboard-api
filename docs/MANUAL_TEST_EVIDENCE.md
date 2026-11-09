# Manual test evidence — Cloudflare demo

Run these checks in a browser against the deployed Worker. The completed rows below record the live verification performed on 2026-11-09. Before evaluation, capture one fresh browser screenshot per row and write the presenter name beside it. The records are intentionally fictional; never enter real names, contact details, CVs, or passwords.

| ID | Human action | Expected result | Presenter | Evidence to capture | Result/status |
| --- | --- | --- | --- | --- | --- |
| M-01 | Open `/` | Job Board opens over HTTPS and routes a signed-in user to their dashboard | Sawitta | Browser address bar and dashboard screenshot | Live deployment/API verified 2026-11-09; attach final browser image |
| M-02 | Open Login; sign in as the configured Student account; open notifications | Worker creates session; Student dashboard and that account's notification list load | Sawitta | Login result and notifications page screenshot | Observed 2026-11-09; attach final screenshot |
| M-03 | Sign in as Employer; update fictional application `62` from `shortlisted` to `interview` | Status changes and API response reports an integration event | Taweesak | UI plus request/response screenshot | Verified live 2026-11-09; `notification_sent: true` |
| M-04 | Confirm the matching Student notification after the status update | Partner webhook result is stored and visible for the matching demo profile | Taweesak | Both systems plus request/response screenshot | Verified live 2026-11-09; callback stored notification ID `3016` |
| M-05 | Enter a phone number longer than 10 digits, then submit | Client/API rejects it; no application is created | Onpreya | Form error screenshot and/or HTTP 400 response | API test verified; browser screenshot still required |
| M-06 | Replay an already processed partner event | Duplicate is acknowledged without a second notification | Taweesak | Partner response with `duplicate: true` | Pending joint run; do not mark complete until both teams verify it |
| M-07 | Send a webhook request with a wrong secret | Request is rejected with HTTP 401 | Onpreya | Postman response screenshot without secret | Automated verification complete; attach final Postman image |

## Evaluation handoff

Use the Postman collection in `postman/` for M-04, M-06, and M-07. Save screenshots outside this repository if they contain any identity or secret. M-06 remains the only joint run that has not been evidenced yet; M-01, M-02, M-05, and M-07 still need their final screenshots attached before evaluation.
