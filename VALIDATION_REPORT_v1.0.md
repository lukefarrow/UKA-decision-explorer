# UKA Decision Explorer — v1.0 Candidate Validation Report

**Status:** Release candidate / research prototype  
**Application build under validation:** `74cdf225c29ac81268036e6add9b1b81282fff09`  
**Release-candidate branch:** `release/v1.0-candidate`  
**Model version:** `1.0.0-audit`  
**Evidence cut-off:** 12 September 2026  
**Validation date:** 13 September 2026

## 1. Intended scope

The Partial Knee vs TKR Outcome Explorer is an evidence-based research and shared-decision-support prototype for patients who have already been judged anatomically suitable for medial UKA, lateral UKA, or patellofemoral arthroplasty (PFA). It compares procedure-specific outcomes with total knee replacement (TKR/TKA).

It does **not** determine anatomical eligibility, make an autonomous treatment recommendation, or replace clinician judgement.

## 2. Evidence architecture

Evidence is separated into directly reproducible registry/trial estimates, stratified registry estimates, explicitly labelled research interpolation, comparative treatment effects, contextual evidence that does not numerically alter the model, and domains explicitly left unmodelled when compartment-specific evidence is insufficient.

Evidence from one compartment is not numerically transferred to another compartment.

## 3. Medial UKA module

Active quantitative domains include UK NJR age × sex × bearing 10-year revision, population lifetime-revision context, age-specific 30-day morbidity/mortality, and randomized matched-timepoint OKS evidence.

Comparative/contextual domains include FJS, ROM, return to activity, PJI-related revision, directional same-day discharge, provider context, robotics, cost-effectiveness, and revision-consequence counselling.

The Oxford lifetime series applies specifically to **mobile-bearing medial Oxford UKA** and is not extrapolated to fixed-bearing UKA.

## 4. Lateral UKA module

Active quantitative domains include the Danish national-registry pooled 10-year lateral UKA vs matched valgus TKA comparison, contemporary 5-year revision context, lateral-specific gait/function evidence, and return-to-sport evidence.

Robotics and revision-consequence evidence are contextual. No lateral-specific lifetime revision, PJI, same-day discharge, provider adjustment, or cost-utility model is applied.

## 5. Patellofemoral arthroplasty module

Active quantitative domains include UK NJR age × sex 10-year revision and randomized PFA-vs-TKR pain/function evidence.

Robotics, cost-effectiveness and PFA→TKR revision-consequence evidence are contextual. Lifetime revision, 30-day morbidity/mortality, PJI and same-day discharge are not modelled.

## 6. User-interface audit

The formal UI audit removed inputs that no longer altered an active estimate: BMI, ASA and patient-archetype presets. Baseline OKS is optional clinical context. Age/sex are hidden for lateral UKA because its current registry comparison is pooled. Bearing is medial-only. Provider context is medial-only. Robotics is contextual in all three modules.

“Not modelled” is visually distinct from “Similar”, and the app uses an **Evidence summary** rather than a composite recommendation score.

## 7. Automated validation

Deployment is gated by `npm test`, which runs:
1. JavaScript syntax checks for `model.js` and `app.js`;
2. quantitative/source regression tests in `validation.test.js`;
3. a jsdom browser smoke test using the real `index.html`, `model.js`, and `app.js`.

The browser tests verify all three modules, control visibility, bearing restrictions, robotics, OKS presentation, revision-context panels, economics, cache-busted assets, “Not modelled” presentation, and re-rendering after input changes.

## 8. Independent scientific audit

Independent source checking identified and corrected important issues including lateral revision-source interpretation, inappropriate reliance on a PFA RCT subject to an Expression of Concern, PFA NJR extraction, matched-timepoint OKS attribution, mobile-bearing scope of the Oxford lifetime series, and evidence hierarchy for robotics, economics and revision-consequence counselling.

Automated tests verify implementation fidelity; they do not replace independent scientific verification of evidence selection.

## 9. Known limitations

- Not externally validated as a complete clinical decision-support system.
- Several outputs are population estimates rather than calibrated individual predictions.
- Lifetime revision includes transparent interpolation and is not a validated patient-level competing-risk equation.
- Evidence maturity differs by compartment.
- Provider, robotic and economic effects are contextual rather than patient-level modifiers.
- Local pathway performance, surgeon experience and patient preference are incompletely represented.
- Formal medical-device classification, clinical safety-case review, usability validation and prospective impact evaluation remain outstanding.

## 10. Release recommendation

Suitable for research demonstration, clinician usability testing, evidence-methodology review and shared-decision-support development.

Not yet suitable to be represented as a clinically validated medical device or autonomous treatment recommendation tool.

Before clinical production deployment: protect the release path, complete source-by-source verification, obtain regulatory/classification advice, complete clinical safety and data-protection review, perform structured usability testing and external/prospective validation, and establish evidence-surveillance/change-control procedures.
