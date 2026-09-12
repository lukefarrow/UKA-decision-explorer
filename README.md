# UKA vs TKR Outcome Explorer

Interactive evidence-based research prototype for comparing outcomes between medial unicompartmental knee arthroplasty (UKA) and total knee replacement (TKR/TKA) **in patients already considered anatomically suitable for medial UKA**.

## Scope
This public explorer does not assess UKA eligibility. It is focused on treatment trade-offs and scenario testing.

## Inputs
- Age
- Sex
- BMI
- ASA grade
- Preoperative Oxford Knee Score
- UKA bearing type: fixed vs mobile
- Provider UKA volume and usage as contextual settings

## Outputs
- Pain and function / Oxford Knee Score
- Forgotten Joint Score / joint awareness
- 10-year revision
- Remaining-lifetime revision context
- 30-day medical safety
- Same-day discharge / day-case surgery
- Early recovery and return to activity
- Range of motion and gait / movement quality

## Evidence approach
The app uses multiple references per outcome where appropriate and distinguishes between:
- registry-stratified estimates;
- reconstructed/reference-profile prognostic estimates;
- literature ranges;
- randomized comparative effects;
- pathway benchmarks.

Fixed- vs mobile-bearing UKA is represented primarily through revision/failure-profile evidence rather than assuming major PROM differences.

## Architecture
Static HTML/CSS/JavaScript. All scenario calculations run in the browser.

## Scientific status
Research prototype only. Not a validated medical device and not for autonomous treatment decisions.

## GitHub Pages
A Pages workflow is included at `.github/workflows/pages.yml`.

Public site:
https://lukefarrow.github.io/UKA-decision-explorer/
