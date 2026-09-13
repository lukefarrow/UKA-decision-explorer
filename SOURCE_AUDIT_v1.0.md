# UKA Decision Explorer — Source-by-Source Evidence Audit v1.0

**Audited application SHA:** `74cdf225c29ac81268036e6add9b1b81282fff09`  
**Audit date:** 13 September 2026  
**Evidence cut-off:** 12 September 2026  
**Scope:** active v1.0 candidate claims, quantitative constants, compartment attribution, source links and retired/historical sources.

## Audit result

No major numerical discrepancy was identified in the active quantitative model.

The audit confirmed the principal medial UKA, lateral UKA and PFA estimates against primary trial, registry or systematic-review sources. Historical sources associated with retired prognostic or superseded PFA modelling remain documented for provenance but are not used to drive the active UI.

Two governance observations were recorded:
1. NJR Table 3.K6 is a primary non-PubMed registry source and should remain explicitly listed in the source register.
2. The provider-volume threshold source (PMID 26738897) is active context and must remain explicitly registered even though it was not captured by the earlier automated PMID extraction.

## Status terminology

- **Active — verified:** supports a currently displayed estimate or interpretation and was checked against the primary source/official registry.
- **Supportive — verified:** contextual evidence, not a numeric model modifier.
- **Historical only:** retained to document a previous modelling route or audit correction; must not drive active output.
- **Excluded:** specifically not used because of evidence-quality/correction concerns.

## Official registry source

| Source | Role | Status | Audit finding |
|---|---|---|---|
| UK National Joint Registry 22nd Annual Report 2025, Table 3.K6 | Medial UKA/TKR and PFA 10-year age×sex revision estimates and CIs | Active — verified | Encoded TKR, medial fixed/mobile UKA and PFA strata match the official table. |

## Medial UKA — randomized outcomes and function

| PMID | Role | Status | Audit finding |
|---|---|---|---|
| 34162649 | 12-month and 2-year OKS comparison | Active — verified | 12m mUKA 41.2 vs TKA 38.4; improvement difference +3.2 (0.9–5.6). 2y 41.2 vs 40.1; difference 1.6 (−0.7–3.9). |
| 41662451 | 2-year average OKS improvement, FJS, ROM | Active — verified | Average OKS improvement +3.5 (2.3–4.7), FJS +14.1 (9.5–18.6), ROM +5.5° at 2y (3.6–7.4). |
| 41825825 | FJS meta-analysis | Supportive — verified | UKA favours TKA across short, mid and long follow-up; supports directional joint-awareness claim. |
| 40825370 | Return to sport | Supportive — verified | UKA RTS 80.7% vs TKA 69.0%, OR 1.87; larger high-impact difference. |
| 25042552 | Historical UKA prognostic OKS source | Historical only | Original 6-month UKA prediction/reconstruction source; no longer active in the patient-specific model. |
| 29467465 | Historical TKA prognostic OKS model | Historical only | Valid externally validated TKA model, but not used because no matched UKA model exists. |

## Medial UKA — revision and lifetime risk

| Source / PMID | Role | Status | Audit finding |
|---|---|---|---|
| NJR Table 3.K6 | 10-year revision by age, sex, bearing | Active — verified | All encoded point estimates and CIs retained from official table. |
| 35638212 | UKA lifetime revision anchors | Active — verified | 40.4% age 46–50 to 3.7% age 86–90; higher in women/ASA 3–4. |
| 35094573 | TKA lifetime revision anchors | Active — verified | 22.4% age 46–50 to 1.15% age 90–95. |
| 39631511 | NJR mid-life lifetime-risk anchor | Active — verified | Age 65–69: unicondylar 13.7% vs unconstrained TKA 3.6%. |
| 33180153 | Oxford medial lifetime series | Active — verified with scope restriction | 55y 15%, 65y 11%, 75y 7%, 85y 4%; applies to medial Oxford UKR and is restricted to mobile-bearing context in the app. |

## Medial UKA — provider context

| PMID | Role | Status | Audit finding |
|---|---|---|---|
| 26738897 | Annual caseload thresholds | Active — verified | Revision falls steeply to ~10 UKA/year and plateaus around 30/year; 8y survival 87.9% <10/year vs 92.4% ≥30/year. |
| 26530653 | UKA usage thresholds | Active — verified | Acceptable ≥20% usage; optimal 40–60%; 5y survival 96% optimal vs 90% low usage. |
| 35964854 | Combined caseload/usage context | Active — verified | Low <10/high ≥10 and usage <20/high ≥20; 10y survival 82.8% low/low cemented, 90.0% high/high cemented, 93.3% high/high cementless. |

## Medial/general UKA — early outcomes, infection and day case

| PMID | Role | Status | Audit finding |
|---|---|---|---|
| 39233099 | 30-day morbidity/mortality | Active — verified | Age 65: 2.1 vs 2.9%; 75: 2.4 vs 3.6%; 85: 3.2 vs 5.5%, UKA vs TKA. |
| 41779036 | PJI-related revision | Active — verified | PJI revision HR 0.53 for UKA vs TKA; crude revision counts support ~0.4% vs ~0.8% contextual display. |
| 39496281 | Medial UKA day-case comparison | Active — verified, directional display | mUKA had higher eligibility and success than TKA; app appropriately suppresses pathway-specific percentages in headline UI. |
| 35951077 | UKA SDD meta-analysis | Supportive — verified | Overall intended SDD 88%, selected 91%, unselected 76%; retained as evidence but not headline prediction. |

## Medial UKA — cost effectiveness and revision consequence

| PMID | Role | Status | Audit finding |
|---|---|---|---|
| 41270774 | TOPKAT 10-year clinical/economic comparison | Active — verified | Cost −£731 (−£1,352 to −£110); QALY +0.322 (−0.069 to 0.712); mean OKS clinically similar at 10y. |
| 29706598 | NJR lifetime UKR/TKR economic model | Supportive — verified | UKR lower cost and higher QALYs overall; strong dependence on surgeon usage acknowledged. |
| 40532925 | Revised medial UKA vs primary/revision TKA | Active — verified | rUKA KSS/FJS close to primary TKA and superior to revision TKA; FJS remained statistically slightly lower than primary TKA. |
| 37708740 | UKA→TKA vs primary TKA meta-analysis | Active — verified | No difference in revision, complications, ROM, LOS, WOMAC or pain; KSS favoured primary TKA. App wording appropriately says “closer to”, not equivalent. |

## Lateral UKA

| PMID | Role | Status | Audit finding |
|---|---|---|---|
| 40652369 | National-registry revision comparison | Active — verified | 10y 13.6% lateral UKA vs 5.9% TKA; adjusted sHR 2.3 (1.6–3.2); contemporary 5y 7.3% vs 3.7%; no significant 90d readmission/complication difference. |
| 41642280 | Gait/function comparison | Active — verified | OKS 44 vs 36; top speed 7.0 vs 5.5 km/h; 26% faster and nearer-normal gait. |
| 40878711 | Lateral UKA return to sport | Active — verified | RTS 92.4% (81.5–97.1); RTP 88.5% (75.1–95.1); Level IV evidence. |
| 42159185 | Robotic lateral UKA | Active contextual — verified | Survivorship 98.8% (97.1–99.8), mean survivorship follow-up 53.4m; satisfaction 95.4% (92.9–97.4). No comparative superiority claim applied. |
| 37708740 | Conversion context | Supportive — verified | Mixed-UKA evidence only; app correctly labels it non-lateral-specific. |

## Patellofemoral arthroplasty — primary comparison

| Source / PMID | Role | Status | Audit finding |
|---|---|---|---|
| NJR Table 3.K6 | PFA 10-year revision by age/sex | Active — verified | <55: 21.05/17.49; 55–64: 19.78/17.05; 65–74: 16.91/15.89; ≥75: 7.61/8.75, male/female, with encoded CIs matching table. |
| 32114806 | PAT randomized trial | Active — verified | WOMAC function difference −1.2 (−9.19 to 6.80) at 12m; no significant OKS difference at 24/60m. |
| 41677917 | 2026 GRADE systematic review | Active — verified | Moderate-certainty evidence: early PROM/recovery advantage PFA, mid/long PROM convergence, higher long-term PFA revision. |
| 33858458 | Earlier comparative meta-analysis | Supportive — verified | Supports better early function/activity with PFA; superseded in hierarchy by PAT + 2026 GRADE review. |
| 35315804 | 6-year PFA RCT report | Historical only / excluded from quantitative claims | Original time-weighted PROM claims affected by calculation error. |
| 36516356 | Expression of Concern for PMID 35315804 | Active audit safeguard | Confirms several PROM advantages became no-difference findings after recalculation; current app does not use the affected numerical claims. |

## PFA — robotics

| PMID | Role | Status | Audit finding |
|---|---|---|---|
| 41627484 | Comparative robotic PFA meta-analysis | Active contextual — verified | Complications 15% vs 30%; reoperation 6.3% vs 8.6%, OR 0.67; implant-related revision 0.7% vs 1.9%, OR 0.32. All-cause revision was not significantly different; app correctly limits the claim. |
| 41614388 | Robotic PFA survivorship | Supportive — verified | 93.6% survivorship at mean 3.3y; no randomized trials; uncertainty appropriately stated. |
| 40548200 | MARCQI manual vs robotic PFA | Supportive — verified | 90d complications 31% vs 10%; OR 3.84 for manual; no significant revision difference. |

## PFA — economics and revision consequence

| PMID | Role | Status | Audit finding |
|---|---|---|---|
| 32228074 | Randomized PFA/TKA economic analysis | Active — verified | 12m QALY +0.056; cost −€328; short-term PFA dominance in expert setting. |
| 42624592 | NJR/NHS long-term economic model | Active — verified | PFA lower cost; cost-effectiveness age-dependent and highly sensitive to postoperative utility. “Potentially cost-effective” wording appropriate. |
| 24980643 | PFA→TKA vs primary/revision TKA | Active — verified | Surgical characteristics/ROM closer to primary TKA; KSS intermediate; complications higher than primary TKA; standard implants usually sufficient. |
| 31136442 | Repeat revision after PFA→TKA | Active — verified | Repeat revision risk higher than primary TKA first revision (HR 2.39) but lower than revision-TKA re-revision (HR 0.60). |
| 37210859 | PFA conversion retrieval/clinical series | Active — verified | Technically similar to primary TKA; complication rates more consistent with revision TKA in this cohort. |
| 36889525 | PFA failure mechanism and conversion | Active — verified | Patellar-component failure associated with worse ROM/PROMs; app qualifier is supported. |

## Other historical / provenance sources

| PMID | Role | Status | Audit finding |
|---|---|---|---|
| 25042552 | UKA prognostic modelling | Historical only | Retained for audit provenance; no longer drives active prediction. |
| 29467465 | TKR prognostic modelling | Historical only | Retained for provenance; no longer paired against UKA. |
| 35315804 | PFA 6y RCT | Historical/excluded | Affected PROM calculations not used. |
| 36516356 | Expression of Concern | Audit safeguard | Must remain attached to PMID 35315804 in documentation. |

## Cross-source interpretation checks

### Matched timeframes
The active medial OKS comparison uses matched randomized timepoints. Unmatched UKA/TKA prognostic models were removed.

### Compartment leakage
No lateral- or PFA-specific quantitative estimate is currently borrowed from medial UKA without explicit contextual labelling.

### “Not modelled” vs equivalence
Evidence gaps are explicitly marked “Not modelled” rather than plotted as “Similar”.

### Robotics
Robotic evidence is contextual only in all modules. No long-term numeric revision modifier is applied.

### Economics
Medial UKA has the strongest evidence (TOPKAT). PFA is labelled potentially cost-effective because results are assumption-sensitive. Lateral-specific economics are not modelled.

### Revision consequence
The app correctly avoids saying UKA or PFA conversion is identical to primary TKR. It states that outcomes/technical burden are generally closer to primary than revision TKR while retaining complication/re-revision caveats.

## Required actions from this audit

1. Keep PMID 26738897 explicitly registered as the source for the ≥30/year caseload context.
2. Preserve NJR Table 3.K6 as a first-class non-PubMed primary source.
3. Keep PMID 35315804 excluded from active PFA PROM claims and retain PMID 36516356 as its correction warning.
4. No active quantitative constant requires correction from this audit.
5. Future evidence updates must repeat this source-by-source process before production release.

## Sign-off status

**Scientific source audit:** PASS WITH GOVERNANCE NOTES  
**Active numerical corrections required:** none  
**Traceability actions required:** provider-volume source registration and continued explicit NJR-table provenance  
**Suitable for next stage:** yes — proceed to regulatory/classification and usability/external-validation planning after repository protection is enabled.
