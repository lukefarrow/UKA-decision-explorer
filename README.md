# Partial Knee vs TKR Outcome Explorer

Interactive evidence-based research prototype comparing **medial UKA, lateral UKA, and patellofemoral arthroplasty** with total knee replacement (TKR/TKA) in patients already considered anatomically suitable for the selected procedure.

## Scope
This public explorer does not assess anatomical eligibility. It contains separate evidence modules for **medial UKA, lateral UKA, and patellofemoral arthroplasty**. Each module only uses compartment-specific quantitative evidence where it is sufficiently reproducible; unavailable domains are explicitly left unmodelled.

## Inputs
- Age
- Sex
- BMI
- ASA grade
- Preoperative Oxford Knee Score
- UKA bearing type: fixed vs mobile
- UKA surgical technique: manual vs robotic-assisted (contextual only; no numeric revision adjustment)
- Provider UKA volume and usage as contextual settings

## Outputs
- Pain and function / Oxford Knee Score
- Forgotten Joint Score / joint awareness
- 10-year revision
- Remaining-lifetime revision context
- 30-day postoperative morbidity / mortality
- Periprosthetic joint infection revision risk
- Same-day discharge / day-case surgery
- Early recovery and return to activity
- Range of motion and gait / movement quality

## Evidence approach
The app uses multiple references per outcome where appropriate and triangulates UK NJR estimates against international registry evidence where this improves interpretation. It distinguishes between:
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


## Registry calibration strategy
- UK NJR age × sex × construct strata remain the primary source for the live 10-year revision estimate because they can be reproduced transparently at patient-scenario level.
- International registry studies (including New Zealand, Swiss and US/MARCQI data, plus multi-registry analyses involving Australia) are used as external validation and contextual checks rather than naively pooled.
- Surgeon caseload and UKA usage are interpreted using published thresholds. The app does not apply an unvalidated multiplicative correction to patient revision risk.
- Robotic assistance is contextual only. Earlier AOANJRR analyses suggested lower revision, but the 2025 AOANJRR adjusted analysis reports no difference in revision for unicompartmental knee replacement; therefore no robotic multiplier is applied.
- Infection is shown separately from all-cause revision using the 2026 Swiss SIRIS national registry comparison.


## Model governance and automated validation

The browser UI and automated tests use the same calculation layer in `model.js`.

- Full evidence/model audit: `MODEL_AUDIT.md`
- Automated regression/source tests: `validation.test.js`
- Run locally with Node: `node validation.test.js`
- GitHub Pages deployment is gated on the validation job. A failed model test prevents deployment.

Current audited model metadata:
- Model version: **1.0.0-audit**
- Evidence cut-off: **12 September 2026**
- Automated checks include source-value, boundary, uncertainty and complete scenario regression tests

The audit deliberately distinguishes directly reproducible registry/anchor estimates from reconstructed prognostic references, contextual comparative evidence and research interpolation.


## Compartment modules

### Medial UKA
Most complete module: matched PROM/FJS/ROM evidence, NJR age×sex×bearing 10-year revision, supportive lifetime/30-day/PJI evidence, same-day discharge, provider context and robotics context.

### Lateral UKA
Uses NJR lateral fixed/mobile age×sex 10-year revision estimates, lateral-specific return-to-sport evidence and lateral-specific gait/function evidence. Lifetime revision, early morbidity, PJI, same-day discharge and provider modifiers are not currently modelled.

### Patellofemoral arthroplasty
Uses NJR age×sex PFA 10-year revision estimates plus randomized PFA-vs-TKA PROM and ROM evidence. Lifetime revision, early morbidity, PJI, same-day discharge and UKA-specific construct/provider modifiers are not applied.
