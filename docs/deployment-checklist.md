# Deployment Checklist

Last audited: 2026-07-12

## Code And Local Gates

- [x] Feature branch is pushed.
- [x] `npm ci` succeeds.
- [x] `npm run validate` succeeds.
- [x] Optimized production build starts locally.
- [x] `npm run qa:pivot` passes locally.
- [x] No public Stripe checkout code or route remains.
- [x] Legal pages, sitemap and robots build successfully.
- [x] Milestones 0-8 and the source-of-truth plan are committed.
- [ ] GitHub validation workflow passes for the final release commit.

## Vercel Environment

- [ ] Preview `NEXT_PUBLIC_SITE_URL` is configured.
- [x] Production `NEXT_PUBLIC_SITE_URL` is present.
- [ ] Preview and Production `LEAD_TO_EMAIL` are configured.
- [ ] Preview and Production `LEAD_FROM_EMAIL` are configured.
- [ ] Preview and Production have `RESEND_API_KEY` or
      `EMAIL_PROVIDER_API_KEY`.
- [ ] Environments are redeployed after configuration changes.
- [ ] Intended Growth Specialists production domain is confirmed.
- [ ] Obsolete `grubclub.gg` Vercel aliases are removed.

Do not print environment values in commands, screenshots, CI logs or reports.

## Preview

- [x] Commit `1212415` has a READY protected preview.
- [x] Root and three policy pages return 200 through authenticated Vercel QA.
- [x] Sitemap and robots return 200.
- [x] Preview robots disallow indexing.
- [x] Metadata, canonical and JSON-LD are valid.
- [x] Responsive browser QA passes at all six target widths.
- [x] Frozen-zone, fit-check, compliance hash and reduced-motion checks pass.
- [x] `/api/checkout` returns 404.
- [x] Console is clean and analytics contain no PII keys.
- [x] Stage One sends no Fetch/XHR request or request body.

Preview URL: `https://gcweb-8rnqkej32-mlrspetes-projects.vercel.app`

## Real Email And Honeypot

- [ ] Submit a controlled application with synthetic data.
- [ ] Receive it at the configured destination.
- [ ] Confirm subject is `New Growth Specialists review system application`.
- [ ] Confirm reply-to is the synthetic work email.
- [ ] Confirm all expected fields and HTML escaping.
- [ ] Confirm no secret value appears.
- [ ] Confirm success appears only after provider success.
- [ ] Submit the honeypot case and confirm no email is delivered.

These checks are blocked until the required email variables are configured.

## Production Release

- [ ] Australian legal review is complete before accepting payment invitations.
- [ ] Required environment and email gates pass.
- [ ] Final PR is reviewed and GitHub validation passes.
- [ ] Feature branch is merged through the normal repository workflow.
- [ ] Vercel production deployment is READY on the intended domain.
- [ ] Production smoke tests independently pass.
- [ ] Controlled production email test passes when appropriate.
- [ ] New production deployment ID and commit are recorded.

Production release is currently blocked. Preview success must not be treated as
production success.

## Rollback

Current production ID: `dpl_64wyTfzLVE7vWZjpAVwq9r2TexpT`

Previous production ID: `dpl_2tvSMWsKPaFGNGbydpCdXpCjJyUU`

Rollback command:

```text
vercel rollback <deployment-id-or-url> --yes
```

Rollback for form delivery failure, runtime crash, severe layout/frozen-hero
regression, PII analytics, checkout-route reappearance or material compliance
copy drift.
