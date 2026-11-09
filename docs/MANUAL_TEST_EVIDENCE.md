# Manual test evidence — Cloudflare demo

Run these checks in a browser against the deployed Worker. Record the date, tester, and screenshot/response beside each row before evaluation. The records are intentionally fictional; never enter real names, contact details, CVs, or passwords.

| ID | Human action | Expected result | Evidence to capture | Result |
| --- | --- | --- | --- | --- |
| M-01 | Open `/` | Job Board landing page loads over HTTPS | Browser address bar and page | Pending evaluator run |
| M-02 | Open Demo Access; select a student; open notifications | The selected fictional profile is shown and notification list loads | Selector and notifications page | Pending evaluator run |
| M-03 | Select an employer; update a fictional application's status | Status changes and API response reports the integration event | UI plus network response | Pending evaluator run |
| M-04 | With the partner group present, confirm the student notification | Partner webhook result is stored and visible for the matching demo profile | Both systems plus request/response | Pending joint run |
| M-05 | Submit a job form with required fields omitted | Client/API shows validation failure; no job is created | Form error or HTTP 400 response | Pending evaluator run |
| M-06 | Replay an already processed partner event | Duplicate is acknowledged without a second notification | Response with `duplicate: true` | Pending joint run |
| M-07 | Send a webhook request with a wrong secret | Request is rejected with HTTP 401 | Postman response; do not expose secret | Pending evaluator run |

## Evaluation handoff

Use the Postman collection in `postman/` for M-04, M-06, and M-07. Save screenshots outside this repository if they contain any identity or secret. Do not mark a row passed until a human has observed it on the currently deployed URLs.
