# Final Launch Report

Date: 2026-07-12
Branch: `feature/custom-review-capture-system-pivot`
Validated code commit: `1212415512acc33dd775aa5095097c69bf976d44`

## Release Decision

Production release is blocked. The code-level and protected-preview QA gates
pass, but required email configuration, real inbox receipt, honeypot no-send
proof, GitHub Actions validation and the final production domain are unresolved.
No production deployment was triggered for commit `1212415`.

## Preview

- URL: `https://gcweb-8rnqkej32-mlrspetes-projects.vercel.app`
- Deployment ID: `dpl_BdmRm1SxkPydHeoo3MceBe7tJFuB`
- Commit: `1212415512acc33dd775aa5095097c69bf976d44`
- State: READY
- Vercel commit status: success
- Deployment protection: enabled; QA used an in-memory automation bypass secret
  that was not written to files or reports.

Protected-preview verification passed:

- `/`, `/privacy`, `/terms`, `/satisfaction-guarantee`, `/sitemap.xml`,
  `/robots.txt` and `/api/health` returned 200;
- `/api/checkout` returned 404;
- six-viewport browser QA, fit-check UI, compliance hash, reduced motion,
  console, resize and memory checks passed;
- Stage One emitted zero Fetch/XHR requests and no request body;
- analytics events contained no prohibited PII keys;
- metadata and `ProfessionalService`/`Offer`/`Service` JSON-LD matched the pivot;
- schema contained no rating, review, address, telephone or award fields/types;
- sitemap contained the four approved public routes; and
- preview robots returned `Disallow: /`.

## Environment Presence Audit

No values were read or reported.

| Variable                                     | Preview | Production | Redeploy required |
| -------------------------------------------- | ------- | ---------- | ----------------- |
| `NEXT_PUBLIC_SITE_URL`                       | Missing | Present    | Yes for Preview   |
| `LEAD_TO_EMAIL`                              | Missing | Missing    | Yes               |
| `LEAD_FROM_EMAIL`                            | Missing | Missing    | Yes               |
| `RESEND_API_KEY` or `EMAIL_PROVIDER_API_KEY` | Missing | Missing    | Yes               |
| `NEXT_PUBLIC_CONTACT_EMAIL`                  | Missing | Missing    | Only if desired   |

No analytics environment variable is consumed by the current application.

## Email And Honeypot Result

Not tested and not passed. The preview and production scopes have no configured
recipient, sender or email-provider key. A controlled final submission therefore
cannot prove delivery, exact subject, reply-to, HTML escaping or expected fields.
The honeypot no-send condition also cannot be proven against a configured inbox.

Production must not be deployed until a controlled application is received at
the configured destination and a separate honeypot submission is confirmed to
send no email.

## GitHub Validation

Local gates passed:

- `npm ci`
- `npm run validate`
- optimized production server
- `npm run qa:pivot`

The GitHub workflow runs only for `main`, pull requests to `main` or manual
dispatch. Commit `1212415` has no Actions run. Creating a draft PR through the
connected GitHub app returned 403, and GitHub CLI is not installed, so the CI
gate remains open. The successful Vercel status is not a substitute for the
repository validation workflow.

## Production And Domain State

Current production before this release attempt:

- deployment URL: `https://gcweb-g9629y9wd-mlrspetes-projects.vercel.app`
- deployment ID: `dpl_64wyTfzLVE7vWZjpAVwq9r2TexpT`
- commit: `df8080dc6e44f794e8ad7c57580073ce375f42ef`

The Vercel project still aliases production to `grubclub.gg` and
`www.grubclub.gg`, which do not match the Growth Specialists brand. The obsolete
repository `CNAME` was removed, but Vercel domain aliases require external
confirmation and correction before production release.

## Rollback Readiness

Previous production deployment:

- URL: `https://gcweb-50tmsk6cg-mlrspetes-projects.vercel.app`
- deployment ID: `dpl_2tvSMWsKPaFGNGbydpCdXpCjJyUU`
- commit: `37dedd5c928acc5715abd0d224ac02c1b47accf9`

After any future release, the prior deployment can be restored with:

```text
vercel rollback <deployment-id-or-url> --yes
```

Rollback is required for form delivery failure, a hydration/runtime crash,
severe layout or frozen-hero regression, accidental PII analytics, checkout
route reappearance or material compliance-copy drift. Harmless minor visual
differences should be fixed forward when safe.

## Remaining Actions

- Configure required Preview and Production email variables without exposing
  their values, then redeploy both scopes.
- Confirm the intended Growth Specialists production domain and remove obsolete
  Vercel aliases.
- Open a pull request and obtain a passing GitHub validation workflow.
- Run and receive a controlled real application email.
- Confirm subject, reply-to, fields, escaping, no secret leakage and success
  timing.
- Confirm a honeypot submission sends no email.
- Complete Australian legal review before accepting payment invitations.
- Monitor field performance and email delivery after release.
- Recheck source statistics periodically.
