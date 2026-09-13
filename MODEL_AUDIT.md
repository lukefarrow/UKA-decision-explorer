# UKA vs TKR Outcome Explorer — Model Audit

**Model version:** 1.0.0-audit  
**Evidence cut-off:** 12 September 2026  
**Scope:** Patients already considered anatomically suitable for medial UKA. This audit covers the quantitative and directional outcome model only. The model must not be extrapolated to lateral UKA or patellofemoral arthroplasty.

## Audit classification

Each output is classified as:

- **A — directly reproducible:** value is taken from a published table/anchor or a transparent interpolation between published anchors.
- **B — reconstructed/reference-profile:** derived from published coefficients but is not the complete validated source model as implemented.
- **C — comparative/contextual:** evidence supports direction or benchmark, but the app does not claim a patient-specific probability.
- **D — research interpolation:** transparent synthesis of multiple published anchors that has not itself undergone model validation.

## Findings by domain

| Domain | Status | Class | Audit finding |
|---|---|---:|---|
| 10-year revision | PASS | A | Exact NJR 22nd Annual Report Table 3.K6 age × sex × cemented medial fixed/mobile UKA values, cemented unconstrained fixed-bearing TKR comparator, and corresponding 95% CIs are encoded. |
| Bearing type | PASS | A/C | Fixed-bearing UKA has lower encoded NJR 10-year revision than mobile-bearing in every age/sex stratum; comparative literature also supports lower dislocation/bearing-related failure. |
| Robotic assistance | PASS | C | No numeric modifier is applied. Current wording reflects the latest AOANJRR conclusion that adjusted UKA revision is not different with robotics, while retaining earlier evidence context. |
| UKA OKS | QUALIFIED | B | 6-month reference estimate is reconstructed from the Liddle cohort mean (21.9→37.5), pre-op OKS coefficient 0.24 and age spline. It is not the original complete multivariable prediction equation and omits deprivation, anxiety/depression, self-rated health/disability and other predictors. |
| TKR OKS | QUALIFIED | B | Included coefficients match Sanchez-Santos et al. for intercept, age, sex×age, BMI, baseline OKS and ASA. Uncollected IMD, anxiety/depression, prior arthroscopy, mobility comorbidity, fixed flexion deformity and ACL status are held at zero/reference. This is a reference-profile application, not a validated reduced model. |
| Medial UKA vs TKR OKS treatment effect | PASS | A/C | Primary display now uses a matched 12-month randomized medial UKA vs TKR comparison: mean OKS 41.2 vs 38.4, adjusted improvement difference +3.2 (95% CI 0.9–5.6). The unmatched 6-month UKA and 12-month TKR prognostic estimates are no longer juxtaposed in the UI. |
| Forgotten Joint Score | PASS | C | Direction favours UKA. RCT difference 14.1 points is encoded in evidence constants; UI appropriately avoids an individualized FJS prediction. |
| Lifetime revision | QUALIFIED | D | Current function is a monotonic age-only hybrid interpolation using NZJR young/old anchors plus the NJR/SAP 65–69 implant-design anchor. It is transparent but is not a published competing-risk equation. Sex and ASA effects are contextual only. |
| 30-day morbidity/mortality | PASS | A | Exact published probabilities and 95% CIs at ages 65, 75 and 85 are reproduced. The endpoint is explicitly labelled as the study's composite of 30-day morbidity or mortality / short-term complications. Linear interpolation is used only between anchors; values outside 65–85 are capped rather than extrapolated. |
| PJI-related revision | PASS | A/C | SIRIS observed proportions (0.4% UKA, 0.8% TKA) and adjusted HR 0.53 are correctly represented and clearly identified as registry follow-up rather than fixed-time individualized risk. |
| Same-day discharge | PASS | A/C | Comparative 42% vs 20% overall and 72% vs 61% eligible/early-surgery benchmarks match the prospective fast-track cohort; dedicated UKA pathway pooled rates 88/91/76% match meta-analysis. |
| Provider caseload/usage | PASS | C | Thresholds <10 vs ≥10 cases/year and <20% vs ≥20% usage are evidence based. ≥30/year is used as a favourable contextual threshold. No unsupported patient-level multiplier is applied. |
| Return to activity/sport | PASS | C | Direction favours UKA; no individualized time-to-return forecast is generated. |
| ROM/gait | PASS | C | 2-year ROM difference +5.5° matches the 2026 RCT. Gait is appropriately described as a heterogeneous comparative trend. |
| OKS scoring helper | PASS | A | Requires exactly 12 integer item scores from 0–4 and sums to 0–48. Questionnaire wording is intentionally not reproduced because licensing is separate. |

## Primary source mapping

### NJR 10-year revision
National Joint Registry 22nd Annual Report 2025, Table 3.K6:
https://www.ncbi.nlm.nih.gov/books/NBK618761/table/ch3.tk6/

### UKA 6-month OKS reconstruction
Liddle AD et al. *Determinants of revision and functional outcome following unicompartmental knee replacement.* Osteoarthritis Cartilage. 2014. PMID 25042552.
https://pubmed.ncbi.nlm.nih.gov/25042552/

Relevant published elements:
- mean pre-op OKS 21.9
- mean 6-month OKS 37.5
- pre-op OKS coefficient +0.24 per point
- age spline with improvement up to approximately age 75

### TKR 12-month OKS reference profile
Sanchez-Santos MT et al. *Development and validation of a clinical prediction model for patient-reported pain and function after primary total knee replacement surgery.* Sci Rep. 2018. PMID 29467465.
https://pmc.ncbi.nlm.nih.gov/articles/PMC5821875/

Included coefficients:
- intercept 32.9
- age 60–69 +0.8; 70–79 +1.4; ≥80 −2.5
- male −4.8
- male×age interactions +4.8 / +4.3 / +8.1
- BMI −1.5 per 10 kg/m²
- baseline OKS +0.4 per point
- ASA 3/4 −2.0

Omitted/reference predictors:
- IMD −0.6 per 10 units
- anxiety/depression −1.6
- previous arthroscopy −1.6
- another condition affecting mobility −3.3
- fixed flexion deformity +1.7
- damaged/absent ACL +1.0

**Audit implication:** the displayed TKR result must continue to be labelled a reference-profile estimate. It must not be described as the externally validated full model.

### Comparative PROM / FJS / ROM evidence
2026 double-blind multicentre RCT, PMID 41662451:
https://pubmed.ncbi.nlm.nih.gov/41662451/

Key comparative effects:
- OKS improvement +3.5 (95% CI 2.3–4.7) favouring mUKA
- FJS +14.1 (95% CI 9.5–18.6)
- ROM at 2 years +5.5° (95% CI 3.6–7.4)

### Lifetime revision
NZJR UKA lifetime-risk study, PMID 35638212:
https://pubmed.ncbi.nlm.nih.gov/35638212/

Published anchors and modifiers:
- age 46–50: UKA lifetime revision 40.4%
- age 86–90: 3.7%
- women higher than men across age groups
- ASA 3–4 higher than ASA 1
- TKA approximately half UKA across age groups; TKA range 1.6–22.4%

NJR/SAP implant-design lifetime model, PMID 39631511:
https://pubmed.ncbi.nlm.nih.gov/39631511/

Age 65–69:
- unicondylar 13.7% (95% CI 12.4–15.2)
- unconstrained KA 3.6% (95% CI 3.4–3.9)

**Audit implication:** the app's continuous curve is a research interpolation, not the published life-table model. It should not be reported with model-derived confidence intervals until a source-consistent reconstruction is available.

### 30-day safety
PMID 39233099:
https://pubmed.ncbi.nlm.nih.gov/39233099/

Published probabilities:
- age 65: UKA 2.1%, TKA 2.9%
- age 75: 2.4%, 3.6%
- age 85: 3.2%, 5.5%

### PJI
Swiss SIRIS registry, PMID 41779036:
https://pubmed.ncbi.nlm.nih.gov/41779036/

- 35,286 UKA; 188,952 TKA
- PJI revision: 149 UKA (0.4%), 1,546 TKA (0.8%)
- adjusted PJI revision HR 0.53
- higher PJI revision risk in males and ASA ≥3

### Same-day discharge
Prospective fast-track comparative cohort, PMID 39496281:
https://pubmed.ncbi.nlm.nih.gov/39496281/

- overall day-case success: mUKA 42%, TKA 20%
- eligible and surgery before 13:00: mUKA 72%, TKA 61%
- eligibility: mUKA 52%, TKA 34%

UKA systematic review/meta-analysis, PMID 35951077:
https://pubmed.ncbi.nlm.nih.gov/35951077/

- intended same-day discharge: 88% overall
- selected cohorts: 91%
- unselected cohorts: 76%

### Provider caseload and usage
NJR mobile-bearing UKA analysis, PMID 35964854:
https://pubmed.ncbi.nlm.nih.gov/35964854/

- low caseload <10/year; high caseload ≥10/year
- low usage <20%; high usage ≥20%
- high-caseload/high-usage 10-year survival: 90.0% cemented, 93.3% cementless

Usage study, PMID 26530653:
https://pubmed.ncbi.nlm.nih.gov/26530653/

- acceptable revision outcomes at usage ≥20%
- optimal registry outcomes reported around 40–60% usage

## Automated validation scope

The repository contains `validation.test.js`, which imports the exact `model.js` used by the browser. Tests cover:

1. model version/evidence cut-off;
2. all NJR age × sex × bearing 10-year revision values;
3. age-band boundaries;
4. expected revision ordering and age trends;
5. UKA OKS anchors, slopes and bounds;
6. TKR included coefficients and bounds;
7. 30-day safety anchors, interpolation and non-extrapolation;
8. lifetime-risk anchors, monotonicity and UKA>TKA ordering;
9. provider volume/usage classification boundaries;
10. OKS helper validity;
11. FJS, ROM, randomized OKS effect, PJI and day-case benchmark constants;
12. full synthetic scenario regression tests spanning young/old, male/female, fixed/mobile, low/high provider exposure and boundary ages.

Deployment is configured to stop if the validation suite fails.

## Residual model risks and recommended next work

### Priority 1 — lifetime revision
Replace the hybrid interpolation with either:
- a source-consistent age-band table directly extracted from a single lifetime-risk study; or
- a reproducible competing-risk/life-table implementation using published source data.

Until then, classify it as **research estimate / lower confidence**, display rounded whole-percentage values, and avoid model-derived confidence intervals.

### Priority 2 — OKS display
The two displayed prognostic estimates use different source models and follow-up times (UKA ~6 months; TKR 12 months). Continue to prohibit direct subtraction. Consider visually separating:
- **prognostic reference estimate**, and
- **randomized comparative treatment effect**.

### Priority 3 — uncertainty
Add source CIs where they can be reproduced without creating pseudo-individualized uncertainty:
- NJR revision CIs;
- 30-day safety anchor CIs;
- RCT FJS/ROM/OKS effect CIs;
- day-case benchmark CIs.

### Priority 4 — external validation
Software verification is not clinical validation. A future clinical validation phase should compare predicted/benchmark outputs against an independent cohort and assess calibration, discrimination where applicable, subgroup performance and decision impact.


## Compartment-specific evidence audit

### Medial UKA
This is the intended target intervention for the current model. The strongest directly comparative components are medial-specific, including:
- the randomized medial UKA vs TKA PROM/FJS/ROM trial;
- the prospective same-day-discharge comparison of medial UKA vs TKA;
- NJR medial fixed- and mobile-bearing construct revision strata;
- NJR mobile-bearing medial UKA provider-volume/usage analyses.

Some supportive registry outcomes are reported simply as UKA without compartment stratification:
- 30-day morbidity/mortality (ACS-NSQIP);
- Swiss SIRIS PJI-related revision;
- NZJR lifetime revision risk.
These are therefore supportive UKA estimates rather than strictly medial-specific patient models.

### Lateral UKA
There is a growing literature base, including contemporary systematic reviews, cohort studies and registry analyses of lateral UKA. However, the evidence is substantially smaller than for medial UKA and does not currently provide a comparable, validated set of matched inputs and outputs across PROMs, 10-year age×sex revision, lifetime revision, early morbidity, discharge, provider-volume effects and movement outcomes. Lateral UKA should therefore be developed as a separate evidence module rather than inferred from the medial model.

### Patellofemoral arthroplasty
Patellofemoral arthroplasty also has systematic-review, registry and comparative evidence, particularly for revision and functional outcomes. However, its indications, failure modes, implant generations and comparator populations differ materially from medial UKA. The present medial UKA algorithms should not be applied to PFA. A future PFA module would require independent model development and validation.


## Lateral UKA module — implementation status

### Numeric outputs
- **10-year revision:** NJR 2025 age × sex lateral UKA strata with 95% CIs, compared with the same cemented unconstrained fixed-bearing TKR comparator. The lateral module does not expose or discuss a bearing selector.
- **Return to sport:** pooled lateral-specific RTS 92.4% (95% CI 81.5–97.1); return to performance 88.5% (75.1–95.1).
- **Gait/function benchmark:** matched cohort mean OKS 44 lateral UKA vs 36 TKA; top walking speed 7.0 vs 5.5 km/h.

### Directional/contextual outputs
- Pain/function and gait favour lateral UKA based on matched observational evidence.
- Return to sport is high after lateral UKA, but evidence is mostly Level IV.

### Deliberately not modelled
- lifetime revision;
- 30-day morbidity/mortality;
- PJI-related revision;
- same-day discharge;
- provider-volume/usage adjustment;
- robotic adjustment;
- FJS.

These are omitted because no sufficiently robust lateral-specific model was identified. Medial UKA values are not substituted.

## Patellofemoral arthroplasty module — implementation status

### Numeric outputs
- **10-year revision:** NJR 2025 age × sex PFA strata with 95% CIs, compared with the same TKR comparator.
- **PROM effect:** randomized PFA-vs-TKA trial shows time-weighted 6-year OKS improvement difference +5 points (95% CI 2–8) favouring PFA.
- **ROM:** randomized 5-year difference +7° (95% CI 1–13) favouring PFA.

### Directional/contextual outputs
- Earlier and time-weighted patient-reported recovery favours PFA, although most single-timepoint PROM differences converge by 6 years.
- Return-to-sport evidence exists but is heterogeneous and is not used for an individualized PFA-vs-TKR probability.

### Deliberately not modelled
- lifetime revision;
- 30-day morbidity/mortality;
- PJI-related revision;
- same-day discharge;
- provider-volume/usage adjustment;
- bearing/robotic modifiers;
- FJS.

These are omitted rather than inferred from UKA evidence.

## Multi-compartment governance rule

The application now contains three stand-alone evidence modules:
1. medial UKA;
2. lateral UKA;
3. patellofemoral arthroplasty.

A coefficient or benchmark may only be reused across modules when the underlying source explicitly supports that procedure population or when the app labels it as broader supportive evidence. Each module must be interpretable independently. Missing compartment-specific evidence is shown as **not modelled**, rather than back-filled from another compartment.


## Independent validation pass — 12 September 2026

A second-pass source audit was performed independently from the encoded constants.

### Material findings

1. **Lateral UKA revision model corrected.** The prior stand-alone lateral implementation had inadvertently retained a construct-specific NJR lateral series after bearing terminology was removed. Presenting those values as generic lateral UKA was not valid. The lateral module now uses the Danish national registry's bearing-agnostic all-lateral-UKA comparison: 10-year cumulative revision 13.6% vs 5.9% for propensity-matched valgus TKA; adjusted sHR 2.3 (95% CI 1.6–3.2). Contemporary 2017–2022 5-year revision was 7.3% vs 3.7%.

2. **PFA PROM/ROM hierarchy corrected.** The previously used 6-year PFA-vs-TKA RCT (PMID 35315804) is subject to an Expression of Concern (PMID 36516356) and subsequent correction. Its original numerical advantage estimates are therefore removed as primary model constants. The primary randomized comparator is now the independent PAT trial (PMID 32114806): no significant WOMAC-function difference at 12 months and no significant OKS difference at 24 or 60 months. The 2026 GRADE review (PMID 41677917) is used for the broader interpretation that early recovery/PROMs may favour PFA, while mid- to long-term PROMs converge and revision risk remains higher.

3. **PFA 10-year NJR revision tables independently re-extracted and confirmed.** The age × sex PFA 10-year values and CIs encoded in the model match NJR 2025 Table 3.K6.

4. **Lateral RTS and gait evidence independently confirmed.** Lateral-specific pooled RTS 92.4% (95% CI 81.5–97.1), return to performance 88.5% (75.1–95.1), matched OKS 44 vs 36, and top walking speed 7.0 vs 5.5 km/h were confirmed against the source publications.

### Validation conclusion
The independent pass identified two clinically material evidence-interpretation errors that were not detectable by regression tests alone. Both have been corrected. Automated tests verify implementation fidelity; independent source audit verifies that the encoded model itself is scientifically justified.


## Lifetime revision model revision — source-consistent implementation

The prior lifetime function mixed NZJR endpoint data with an NJR 65–69 implant-design anchor. That hybrid curve has been removed.

### Primary comparative display
The current population comparison uses only the paired New Zealand Joint Registry lifetime-risk studies:
- UKA: 40.4% at age 46–50, falling sequentially to 3.7% at age 86–90 (PMID 35638212).
- TKA: 22.4% at age 46–50, falling approximately linearly to 1.15% at age 90–95 (PMID 35094573).

The app uses transparent interpolation between the published endpoint age-group midpoints for display. This remains a population-level interpolation and is not described as a validated patient-level competing-risk equation.

### Medial-specific reference
A separate medial Oxford UKR series is shown without being numerically merged into the national registry comparison:
- age 55: 14.9% (95% CI 12–19)
- age 65: 10.7% (8–13)
- age 75: 6.8% (5–9)
- age 85: 3.7% (3–5)

These estimates come from a 1,000-case medial Oxford UKR designer series using recommended indications and technique. They provide useful procedure-specific context but are expected to differ from population registry estimates because of case selection, implant, surgeon and revision-threshold effects.

### Governance decision
The app now displays population registry context and medial-specific specialist-series context side by side, rather than splicing them into a single synthetic curve.


## Lifetime revision bearing scope

The primary lifetime-revision display uses a pragmatic population model combining NZJR lifetime-risk anchors with the contemporary NJR age 65–69 lifetime-revision anchor. It is presented as a counselling estimate rather than a validated individual competing-risk equation. The all-UKA population evidence is considered most applicable to medial UKA because medial procedures comprise the large majority of UKA practice.

The Oxford lifetime-revision series is treated separately and applies specifically to **mobile-bearing medial Oxford UKA** performed using recommended indications and technique. It is displayed only when mobile-bearing medial UKA is selected and is not extrapolated to fixed-bearing UKA.


## Robotic assistance — lateral UKA and PFA

Robotic assistance is represented as contextual evidence only in the lateral UKA and PFA modules. It does not modify the long-term registry revision estimate.

### Lateral UKA
A 2026 lateral-specific systematic review/meta-analysis (PMID 42159185) reported pooled robotic lateral UKA survivorship of 98.8% (95% CI 97.1–99.8) at mean 53.4 months and satisfaction 95.4% (92.9–97.4). The underlying evidence is predominantly small, heterogeneous observational cohorts. These figures are displayed only as robotic context and are not used to recalibrate the 10-year lateral UKA revision estimate.

### Patellofemoral arthroplasty
A 2026 comparative meta-analysis (PMID 41627484) reported lower pooled complication rates (15% vs 30%), reoperation (6.3% vs 8.6%; OR 0.67), and implant-related revision (0.7% vs 1.9%; OR 0.32) for robotic versus conventional PFA at short- to mid-term follow-up. A MARCQI study (PMID 40548200) provides additional observational comparative context. Because the evidence is not long-term randomized evidence, no robotic multiplier is applied to NJR 10-year PFA revision estimates.


## Oxford Knee Score presentation/model audit

The OKS section now distinguishes **comparative randomized evidence** from **individual prognostic modelling**.

### Primary medial UKA comparison
The 12-month and 2-year absolute OKS values are taken from the Finnish randomized multicentre trial (PMID 34162649):
- 12 months: medial UKA 41.2 (95% CI 39.6–42.7) vs TKR 38.4 (36.9–40.0); adjusted improvement difference +3.2 (0.9–5.6).
- 2 years: medial UKA 41.2 (39.7–42.7) vs TKR 40.1 (38.7–41.6); between-group difference 1.6 (−0.7 to 3.9).

The larger 2026 double-blinded multicentre randomized trial (PMID 41662451) is used as independent corroboration: average 2-year OKS improvement difference +3.5 (95% CI 2.3–4.7), below the conventional 4–5 point MCID.

### Baseline OKS input
Baseline OKS remains available as an **optional clinical-context input** and can be calculated using the 12-item scoring helper. It does not alter the current treatment-comparison estimates. No matched, externally validated pair of patient-specific 12-month prediction models exists for medial UKA and TKR using the same predictors and outcome definition.

The reconstructed 6-month UKA and reduced-profile 12-month TKR prognostic equations have therefore been removed from the active model. This avoids presenting unmatched prognostic estimates as though they were a fair treatment comparison.


## Formal UI / interpretation audit

The clinician-facing interface was reviewed against the active evidence model with the principle that every prominent control should either alter a displayed estimate or add essential procedural context.

### Core workflow changes
- Younger / typical / older scenario presets removed.
- BMI and ASA removed from the core input panel because they no longer alter any active comparative estimate after removal of the unmatched prognostic OKS models.
- Baseline OKS retained only inside a collapsed **Optional clinical context** section; it does not alter treatment-comparison estimates.
- Age and sex remain core inputs for medial UKA and PFA because registry revision estimates are stratified by them.
- Age and sex are hidden in the lateral UKA module because the current lateral revision comparison is a pooled population estimate and is not personalised by either variable.
- Procedure settings are compartment-specific: bearing is visible only for medial UKA; robotic assistance remains contextual in all three modules; provider context is visible only for medial UKA.

### Interpretation changes
Rows with insufficient evidence are no longer plotted at the midpoint of the UKA–TKR axis. They display an explicit **No comparative estimate / Not modelled** state so absence of evidence cannot be mistaken for equivalence.

The at-a-glance section is labelled **Evidence summary** rather than Live comparison to better reflect that several outputs are population-level or contextual rather than dynamically patient-predicted.


## Same-day discharge presentation

Same-day discharge is presented directionally rather than as a single absolute percentage. Medial UKA is described as having a higher likelihood of successful same-day discharge in appropriately selected fast-track pathways. Absolute rates are omitted from the headline UI because they are highly dependent on pathway design, eligibility criteria, anaesthetic and analgesic protocols, operating time, social support and local discharge rules.

## Health economics domain

Health economics is included only where procedure-specific comparative evidence is sufficient.

### Medial UKA
TOPKAT provides randomized NHS evidence in medial-compartment osteoarthritis. At 10 years, partial knee replacement was associated with lower healthcare costs (mean difference −£731, 95% CI −£1,352 to −£110) and greater accumulated QALYs (+0.322, 95% CI −0.069 to 0.712) than TKR (PMID 41270774). This is presented as a directional cost-effectiveness advantage rather than a patient-specific financial estimate.

### Lateral UKA
No robust contemporary lateral-specific cost-utility comparison with TKR was identified. Generic UKA economic models are not extrapolated into the lateral module. The domain is explicitly marked **not modelled**.

### Patellofemoral arthroplasty
Procedure-specific evidence exists. A randomized-trial economic analysis found PFA cheaper and more effective than TKA at one year (PMID 32228074). A 2026 NJR/NHS Markov analysis (PMID 42624592) found PFA may be cost-effective, particularly in older patients, but with substantial uncertainty driven mainly by postoperative utility assumptions. The app therefore describes PFA as **potentially cost-effective** rather than universally economically superior.
