# Milestone 09 Report

Date: 2026-07-12
Branch: `feature/custom-review-capture-system-pivot`
Validated commit: `1212415512acc33dd775aa5095097c69bf976d44`
Status: Blocked before production release

## Decision

The Vercel preview is technically healthy, but Milestone 9 is not complete and
production was not deployed. Required email configuration and real receipt are
missing, GitHub Actions has not run for the final commit, and the Vercel project
still uses obsolete production domain aliases.

## Preview Record

- URL: `https://gcweb-8rnqkej32-mlrspetes-projects.vercel.app`
- Deployment ID: `dpl_BdmRm1SxkPydHeoo3MceBe7tJFuB`
- Commit: `1212415512acc33dd775aa5095097c69bf976d44`
- State: READY

The protected preview passed route, metadata, schema, sitemap, robots,
responsive, frozen-zone, fit-check, compliance, reduced-motion, console, API and
analytics-PII checks. Stage One emitted no Fetch/XHR request and no request body.

## Environment Audit

Only variable presence and scope were inspected:

- `NEXT_PUBLIC_SITE_URL`: Production present; Preview missing.
- `LEAD_TO_EMAIL`: Preview and Production missing.
- `LEAD_FROM_EMAIL`: Preview and Production missing.
- `RESEND_API_KEY` or `EMAIL_PROVIDER_API_KEY`: Preview and Production missing.
- `NEXT_PUBLIC_CONTACT_EMAIL`: Preview and Production missing; optional.

Both environments require redeployment after required variables are added.

## Email Result

Not run and not passed. Without sender, recipient and provider credentials, the
release cannot prove final submission delivery, subject, reply-to, expected
fields, escaping, success timing or honeypot no-send behavior.

## CI Result

Local `npm ci`, `npm run validate` and `npm run qa:pivot` pass. Vercel reports a
successful deployment status for the final commit. The GitHub Actions workflow
has no run because it triggers only for `main`, pull requests to `main` or manual
dispatch. The connected GitHub app could not create a draft PR (403), and GitHub
CLI is unavailable.

## Production And Rollback

No new production deployment was made.

Current production:

- ID: `dpl_64wyTfzLVE7vWZjpAVwq9r2TexpT`
- commit: `df8080dc6e44f794e8ad7c57580073ce375f42ef`
- URL: `https://gcweb-g9629y9wd-mlrspetes-projects.vercel.app`

Previous production rollback target:

- ID: `dpl_2tvSMWsKPaFGNGbydpCdXpCjJyUU`
- commit: `37dedd5c928acc5715abd0d224ac02c1b47accf9`
- URL: `https://gcweb-50tmsk6cg-mlrspetes-projects.vercel.app`

Rollback command: `vercel rollback <deployment-id-or-url> --yes`.

## Exact Blockers

- Configure required Preview and Production email variables and redeploy.
- Receive and inspect a controlled application email.
- Prove honeypot no-send behavior against the configured inbox.
- Open a PR and obtain a passing GitHub validation workflow.
- Confirm the intended production domain and remove obsolete `grubclub.gg`
  aliases in Vercel.
- Complete Australian legal review before accepting payment invitations.

The final release commit message `release: deploy review capture system pivot`
was intentionally not used because no production release occurred.
