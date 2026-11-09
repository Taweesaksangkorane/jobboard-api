# Mini Project Final Presentation Requirements

**Event:** Mini Project Final Present  
**Date:** 10 November 2026  
**Time:** 13:00–18:00  
**Course:** 2026_PlatformDev

## Submission Checklist

### 1. System Completion and Cloud Deployment

- [x] The system is fully functional.
- [x] The system is deployed on a cloud platform such as Cloudflare, Firebase, Vercel, or an equivalent service.
- [x] The deployed system is accessible and ready for demonstration.
- [x] The project is not running only on localhost or ngrok.
- [x] The Production URL has been tested before the evaluation.

### 2. Features and Scenario Demonstration

- [x] Key features and functionalities are prepared for demonstration.
- [x] The Happy Path is prepared as a complete successful end-to-end workflow.
- [x] The demonstration uses real functionality from the deployed system.
- [x] The presentation fits the expected 5–10 minute evaluation period.

Recommended Happy Path evidence:

```text
Public job search
    -> Student login
    -> Submit application
    -> Employer reviews application
    -> Employer updates application status
    -> Notification webhook integration
    -> Student views notification
```

### 3. Cross-Group Platform Integration

- [x] The system integrates with at least one other group's system.
- [x] The integration uses an API or Webhook.
- [ ] The partner group is available during the evaluation.
- [x] The outbound request or API call is prepared.
- [x] The inbound callback or response is prepared.
- [x] Source code for the integration is ready to show.
- [x] Request and response evidence is ready to show.
- [x] Webhook execution results are ready to show.

Evidence to prepare:

- Integration source code
- API endpoint and HTTP method
- Request payload
- Response payload
- Webhook authentication result
- Duplicate-event result, if supported

### 4. Development Process and AI Usage Evidence

- [x] System architecture and design are documented.
- [x] Development workflow is documented.
- [x] Team member contributions are documented.
- [x] AI tools used during development are documented.
- [x] The purpose of AI usage is explained, such as UI design, code suggestions, debugging, testing, or documentation.
- [x] GitHub repository URL is ready.
- [x] Commit history is ready to show.
- [ ] Each member can explain their contribution.

### 5. Security and PDPA Compliance

- [x] Authentication mechanisms are implemented and demonstrable.
- [x] Role-based access control is implemented and demonstrable.
- [x] Security protection measures are documented.
- [x] Personal data handling is explained.
- [x] PDPA considerations are documented.
- [x] Input validation is implemented.
- [x] Common attack prevention or mitigation is demonstrated.
- [x] Security evidence is shown from the actual implementation, not only described.

Recommended evidence:

- Authentication and session handling
- Student/Employer authorization checks
- Security response headers
- CORS protection
- Prepared SQL statements and bound parameters
- Webhook secret validation
- Invalid request response such as HTTP 401 or HTTP 400
- Fictional demo data and data-minimization policy

### 6. Testing and Quality Assurance

- [x] Automated test scripts are available.
- [x] Automated test results are available.
- [x] Manual browser testing is completed.
- [x] Manual API/Postman testing is completed.
- [x] Successful test cases are recorded.
- [x] Failed or pending test cases are recorded honestly.
- [x] Test screenshots are prepared.

Recommended commands:

```powershell
npm.cmd run test:worker
npm.cmd test
```

Automated evidence should show:

- Total test count
- Passed test count
- Failed test count
- Frontend TypeScript check
- Frontend production build
- Wrangler deployment dry-run

Manual evidence should cover:

- Production website access
- Student login
- Employer application status update
- Student notification
- Invalid phone number
- Duplicate webhook event
- Invalid webhook secret returning HTTP 401

### 7. Source Code Understanding and Live Modification

- [ ] Every group member can explain their source code.
- [ ] Every group member can explain their implementation and assigned responsibility.
- [ ] The team is prepared for a minor code modification or fix requested by the evaluator.
- [x] The team knows how to run the tests after a modification.
- [x] The team knows how to redeploy the updated system.

Useful commands:

```powershell
npm.cmd test
npm.cmd run cf:deploy
```

### 8. Final Evaluation and Group Attendance

- [ ] All group members will attend the evaluation.
- [x] The presentation is limited to approximately 5–10 minutes.
- [x] Speaker order is agreed in advance.
- [ ] Screen handoff between speakers is rehearsed.
- [ ] The partner group has been contacted.
- [ ] Both connected systems will be available during the evaluation.
- [x] Production URLs, Postman, source code, and evidence files are ready.

## Important Reminders

The evaluation focuses on working systems, real integration, security, testing, and the team's ability to explain and maintain the source code.

Screenshots and presentation slides alone are not sufficient. The deployed system must be ready for live demonstration.

Do not include the following in screenshots, documents, commits, or chat messages:

- Passwords
- Webhook secrets
- Session cookies
- API keys
- Real applicant personal data
- Real CVs or contact details

## Final Go/No-Go Check

The project is ready for evaluation only when all of the following are true:

- [x] Production URL works.
- [x] Happy Path works from start to finish.
- [x] Cross-group integration works with the partner system.
- [x] Security and PDPA evidence is available.
- [x] Automated and manual testing evidence is available.
- [ ] All members can explain the source code.
- [ ] The team can make and redeploy a minor fix.
- [ ] All members and the partner group are ready.
