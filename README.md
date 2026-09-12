# UKA vs TKR Decision Explorer

Interactive evidence-based research prototype for exploring trade-offs between medial unicompartmental knee arthroplasty (UKA) and total knee replacement (TKR/TKA) in potentially eligible patients.

## Features
- Live sliders for age, BMI, pre-op OKS, flexion contracture and maximum flexion.
- Stage 1 anatomical phenotype assessment.
- Age/sex/construct-stratified 10-year revision estimates.
- Lifetime revision context.
- 30-day medical safety comparison.
- FJS / natural-feeling knee evidence.
- Recovery, activity and ROM comparison.
- Provider volume and UKA usage context.
- Younger, typical and older patient presets.

## Architecture
Static HTML/CSS/JavaScript. All scenario calculations run in the browser; no R runtime or server is required.

## Scientific status
Research prototype only. It is not a validated medical device and must not be used for autonomous treatment decisions.

The app deliberately distinguishes between registry-stratified estimates, reconstructed/reference-profile prognostic estimates, literature ranges and comparative evidence.

## GitHub Pages
A Pages workflow is included at `.github/workflows/pages.yml`.

After making the repository **Public**, enable GitHub Pages with **Settings → Pages → Source: GitHub Actions**.

Expected public address:

https://lukefarrow.github.io/UKA-decision-explorer/
