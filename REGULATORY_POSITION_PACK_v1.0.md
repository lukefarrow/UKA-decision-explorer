# UKA Decision Explorer — Regulatory Position Pack v1.0

**Status:** Pre-submission regulatory position document  
**Date:** 13 September 2026  
**Application candidate:** `release/v1.0-candidate`  
**Audited application SHA:** `74cdf225c29ac81268036e6add9b1b81282fff09`  
**Model version:** `1.0.0-audit`  
**Evidence cut-off:** 12 September 2026

## 1. Purpose of this document

This document summarises the UKA Decision Explorer for an initial MHRA qualification/classification enquiry. It is intended to allow the MHRA to advise whether the current clinician-facing software is likely to qualify as Software as a Medical Device (SaMD) under the UK Medical Devices Regulations 2002, and if so what further classification/conformity route should be considered.

This document does not assert a final legal or regulatory classification.

## 2. Proposed intended purpose

The UKA Decision Explorer is intended to present and contextualise published comparative evidence regarding outcomes of medial unicompartmental knee arthroplasty, lateral unicompartmental knee arthroplasty and patellofemoral arthroplasty versus total knee replacement, for use by appropriately qualified orthopaedic clinicians during evidence review and shared decision-making.

The software does not assess anatomical eligibility, diagnose disease, select a procedure or provide an autonomous treatment recommendation. Clinical decisions remain the responsibility of the treating clinician.

Where published registry evidence is stratified by patient characteristics, the software displays the relevant published stratum or an explicitly labelled interpolation to aid interpretation of the evidence.

## 3. Intended users

Primary intended users:
- consultant orthopaedic knee surgeons;
- orthopaedic clinicians involved in knee arthroplasty shared decision-making.

Potential secondary users during supervised shared decision-making:
- patients viewing the evidence together with their treating clinician.

The current candidate is not intended for unsupervised patient self-diagnosis or autonomous procedure selection.

## 4. Intended population

Adults with knee osteoarthritis who have already undergone normal clinical and radiographic assessment and have been judged by an appropriately qualified clinician to be anatomically suitable for one of:
- medial UKA;
- lateral UKA;
- PFA.

The software itself does not establish that suitability.

## 5. Clinical workflow

1. Clinician performs normal history, examination and imaging assessment.
2. Clinician determines whether a compartment-specific partial knee arthroplasty is anatomically suitable.
3. Clinician opens the UKA Decision Explorer.
4. Clinician selects the relevant procedure.
5. Where applicable, limited patient/procedure characteristics select the corresponding published evidence stratum: age, sex and medial UKA bearing type.
6. The software displays procedure-specific comparative evidence against TKR.
7. Contextual evidence is displayed separately from quantitative model outputs.
8. The clinician discusses the trade-offs with the patient.
9. The clinician and patient make the treatment decision outside the software.

**No treatment recommendation, ranking score or automated suitability decision is produced.**

## 6. Software inputs

### Medial UKA
- age;
- sex;
- fixed- vs mobile-bearing construct;
- robotic/manual selection for contextual evidence only;
- optional provider volume/usage for contextual interpretation;
- optional baseline Oxford Knee Score for clinical context only.

### Lateral UKA
- robotic/manual selection for contextual evidence only.
- Age and sex are deliberately not used because the active lateral registry comparison is pooled rather than patient-stratified.

### PFA
- age;
- sex;
- robotic/manual selection for contextual evidence only.

No personal identifier is required.

## 7. Software outputs

The software displays evidence regarding:
- pain and patient-reported function;
- joint awareness;
- 10-year revision risk;
- remaining-lifetime revision context where supported;
- short-term morbidity/mortality where supported;
- PJI-related revision where supported;
- recovery/day-case likelihood;
- return to activity;
- range of motion/gait;
- cost-effectiveness where procedure-specific evidence exists;
- consequences of revision/conversion;
- robotic-assistance evidence.

Outputs are labelled by evidence type and compartment. Where evidence is insufficient, the software displays **Not modelled**, not an inferred neutral effect.

## 8. Nature of the computation

The product does not use machine learning or a de novo proprietary treatment-selection algorithm.

Its active calculations comprise:
- direct selection of published age/sex/construct registry strata;
- arithmetic differences between published comparative values;
- explicitly labelled linear interpolation between published anchors for limited lifetime-risk context;
- display logic controlling which evidence is shown for each compartment.

Robotic, provider-volume and economic evidence do not currently alter patient-specific risk estimates.

## 9. Explicit exclusions

The software is not intended to:
- diagnose osteoarthritis;
- determine compartment-specific anatomical suitability;
- recommend UKA/PFA/TKR;
- rank procedures using a composite score;
- replace multidisciplinary or clinician assessment;
- determine implant brand;
- determine surgical technique;
- predict an individual patient's outcome with a validated multivariable patient-level model;
- replace discussion of patient values/preferences;
- be used as an autonomous patient-facing treatment selector.

## 10. Current regulatory uncertainty

The developers recognise that the distinction between a reference/evidence resource and medical-device clinical decision-support software depends on intended purpose and functionality, not on whether the underlying evidence or equations were newly invented.

The current software goes beyond a static digital textbook because it can select published evidence strata from limited patient characteristics and can interpolate explicitly labelled published lifetime-risk anchors.

At the same time, it does not diagnose, determine eligibility or output a treatment recommendation.

The central regulatory question is therefore whether this evidence-selection/contextualisation function constitutes a medical purpose under UK MDR 2002 sufficient to qualify the current software as SaMD.

## 11. Evidence and validation status

The v1.0 candidate has:
- compartment-specific evidence architecture;
- formal source-by-source evidence audit;
- automated quantitative/source regression tests;
- browser/DOM smoke testing;
- explicit model/evidence versioning;
- UI/interpretation audit;
- documented limitations;
- controlled release-candidate branch.

Supporting documents:
- `VALIDATION_REPORT_v1.0.md`
- `SOURCE_AUDIT_v1.0.md`
- `MODEL_AUDIT.md`
- `DEPLOYMENT_READINESS.md`
- `RELEASE_CHECKLIST.md`
- `SECURITY.md`

The product has **not** yet undergone:
- formal external/prospective clinical validation;
- formal human-factors/usability validation;
- medical-device conformity assessment;
- clinical safety-case sign-off;
- post-market surveillance;
- MHRA device registration.

## 12. Current public availability

A public GitHub Pages research prototype is currently available.

It is:
- clearly labelled as a research/shared-decision-support development prototype;
- not promoted as a clinically validated medical device;
- not sold or licensed;
- not designed to store patient-identifiable information;
- currently intended for research, evidence review and development.

The developers recognise that free availability does not by itself determine whether a product is considered placed on the market or whether UK MDR obligations apply if the product otherwise qualifies as a medical device.

Specific MHRA advice is requested regarding whether the current public research-prototype status should be changed while classification is being clarified.

## 13. Risk-control features already built into the design

- no autonomous treatment recommendation;
- no composite “winner” score;
- anatomical suitability assumed rather than inferred;
- unsupported evidence is labelled Not modelled;
- compartment-specific evidence is not silently transferred;
- contextual evidence does not alter quantitative estimates;
- source links are displayed;
- uncertainty and evidence limitations are stated;
- automated deployment validation;
- release/version traceability;
- protected-branch and code-review governance.

## 14. Foreseeable misuse / preliminary hazards

Potential foreseeable misuse includes:
- treating population estimates as precise individual predictions;
- interpreting Not modelled as evidence of no difference;
- using the app without establishing anatomical suitability;
- treating a contextual robotic/provider association as a causal patient-level effect;
- using the app as an autonomous treatment recommender;
- relying on an outdated evidence version;
- applying evidence outside the compartment or population studied;
- misunderstanding revision risk without appreciating revision-consequence context.

These hazards will be developed into a formal clinical-safety hazard log if clinical deployment proceeds.

## 15. Questions for the MHRA

### Qualification
1. Given the proposed intended purpose and functionality, is this software likely to qualify as a medical device / SaMD under UK MDR 2002?
2. Does selecting a published registry stratum according to age/sex/construct materially change qualification compared with a static evidence-reference tool?
3. Does transparent interpolation between published lifetime-risk anchors materially change that assessment?

### Intended purpose and workflow
4. Is the proposed clinician-facing shared-decision-support intended purpose sufficiently specific?
5. Does explicitly excluding anatomical eligibility and treatment recommendation materially affect qualification?
6. Are any additional exclusions or workflow constraints advisable to make the intended purpose unambiguous?

### Classification / route to market
7. If the software qualifies as SaMD, what UK risk-classification framework/rule should be applied?
8. Would third-party conformity assessment be expected, or could a self-declaration route potentially apply depending on classification?
9. For Great Britain, should the developers consider UKCA conformity, CE conformity recognised in GB, or another route under the current transitional framework?

### Public research prototype
10. Does continued free public availability of the research prototype create a regulatory concern before conformity assessment, given that it is explicitly labelled as unvalidated research/evidence-review software and is not promoted for routine clinical use?
11. Would MHRA recommend restricting access or changing public-facing wording while qualification/classification is being clarified?

### Evidence and validation
12. What level of clinical/performance evidence would MHRA expect for the proposed intended purpose if the software qualifies as SaMD?
13. Would a clinician usability/human-factors study plus prospective external validation be an appropriate next evidence programme?
14. Would the current transparent source-by-source verification and version-controlled evidence architecture be considered appropriate foundations for a clinical evaluation?

## 16. Requested MHRA outcome

The developers are seeking:
1. initial qualification advice;
2. if applicable, classification guidance;
3. advice on whether the existing public research prototype may remain available during development;
4. confirmation of the most appropriate next regulatory route.

The developers are not seeking MHRA endorsement of the clinical content or product.

## 17. Proposed initial contact route

Current MHRA guidance states that general medical-device queries, including software/AI medical-device classification questions, should be directed to **info@mhra.gov.uk**.

If application of published guidance remains unclear, a formal medical-device regulatory advice meeting can then be requested. The Innovation Office may be appropriate if MHRA considers the product sufficiently novel or framework-challenging.
