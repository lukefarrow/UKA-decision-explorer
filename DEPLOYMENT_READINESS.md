# Deployment Readiness and Security Plan

## Current status

The public GitHub Pages deployment is appropriate for a research prototype, but it is not yet a production clinical deployment.

At the v1.0 candidate freeze:
- the public site is built from GitHub;
- deployment is gated by syntax, model and browser validation;
- `main` is **not currently protected**;
- commits are not currently required to be cryptographically signed;
- the repository has no enforced independent review requirement.

These are governance gaps rather than evidence-model failures.

## Recommended release architecture

### 1. Development
Feature branches only. No routine direct edits to the production branch.

### 2. Pull-request review
Every executable or evidence change should enter through a pull request.

Changes to the following should require explicit review:
- `model.js`
- `app.js`
- `validation.test.js`
- `browser.smoke.test.js`
- `MODEL_AUDIT.md`
- deployment workflows
- evidence/version metadata

### 3. Protected production branch
Enable branch protection or a repository ruleset for `main`:
- require pull request before merge;
- require the validation status check;
- prevent force pushes;
- prevent branch deletion;
- require conversation resolution;
- ideally require at least one reviewer other than the author for clinical/evidence changes;
- consider signed commits/tags for formal releases.

### 4. Staging and production
Use two deployment targets:
- **staging**: latest reviewed development build;
- **production**: immutable approved release only.

A production deployment should record:
- release version;
- commit SHA;
- evidence cut-off;
- validation-report version;
- deployment timestamp.

### 5. Release integrity
For each clinical/research release:
1. freeze the candidate SHA;
2. run all automated tests;
3. perform evidence-review sign-off;
4. create an immutable version tag;
5. generate release notes;
6. deploy only that tag/SHA;
7. verify the deployed asset SHA/version;
8. retain the previous approved release for rollback.

## Threat model

### Highest-probability risks
- accidental code change;
- stale or partially deployed assets;
- compromised GitHub credentials;
- malicious or mistaken dependency/workflow change;
- an evidence update reaching production without review;
- branch force-push or deletion;
- deployment of a commit different from the reviewed build.

### Lower-probability but material risks
- deliberate tampering with model constants or references;
- malicious pull requests;
- supply-chain compromise;
- domain/DNS compromise if a custom domain is introduced.

## Mitigations already present

- model and UI share the same calculation layer;
- deployment depends on automated validation;
- syntax checking prevents malformed JavaScript from deploying;
- browser smoke tests exercise the real page and module switching;
- asset cache-busting reduces stale-browser risk;
- source/model audit is maintained in the repository.

## Additional controls to implement before clinical deployment

- protected `main`;
- mandatory PR workflow;
- CODEOWNERS/reviewer ownership;
- two-factor authentication for maintainers;
- minimum-permission GitHub tokens/apps;
- dependency update review;
- Dependabot/security scanning where appropriate;
- signed release tags;
- production/staging separation;
- deployment attestation or SHA display in the app footer/about panel;
- documented rollback procedure;
- incident-response contact and process;
- periodic restore/redeployment test.

## Medical-software deployment workstream

Security hardening is necessary but not sufficient. Before clinical deployment also complete:
- intended-use statement;
- regulatory classification assessment;
- clinical safety case/hazard log;
- usability/human-factors testing;
- external/prospective validation;
- privacy/data-protection assessment if any patient data are stored or transmitted;
- post-release evidence surveillance and change-control process.

## Native mobile apps

Do not make native iOS/Android development a prerequisite for v1.0. A hardened responsive web/PWA deployment is the lower-risk route for validation and early adoption. Reassess native apps only after regulatory scope, clinical demand and willingness-to-pay are clearer.
