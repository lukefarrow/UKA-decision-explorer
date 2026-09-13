# v1.0 Release Checklist

Use this checklist for any release intended to be cited, externally evaluated, or used beyond internal development.

## A. Freeze
- [ ] Confirm intended-use statement.
- [ ] Record application commit SHA.
- [ ] Record model version.
- [ ] Record evidence cut-off date.
- [ ] Create/update release-candidate branch.
- [ ] Confirm no unreviewed clinical/model changes remain.

## B. Scientific verification
- [ ] Verify every displayed numerical estimate against its primary source.
- [ ] Verify all PMID/reference links.
- [ ] Confirm outcome timepoints are matched where comparisons are displayed.
- [ ] Confirm no compartment-specific evidence has been transferred without explicit labelling.
- [ ] Confirm mobile-bearing Oxford evidence is shown only for mobile-bearing medial UKA.
- [ ] Confirm “Not modelled” means insufficient evidence, not equivalence.
- [ ] Review robotics, economics and revision-consequence wording for overstatement.
- [ ] Independent reviewer signs off evidence changes.

## C. Software validation
- [ ] `npm test` passes.
- [ ] Syntax checks pass.
- [ ] Quantitative/source regression tests pass.
- [ ] Browser smoke test passes.
- [ ] All three modules render.
- [ ] Module-specific controls show/hide correctly.
- [ ] Reset works.
- [ ] OKS helper works.
- [ ] No stale/mobile-bearing leakage into lateral/PFA.
- [ ] Cache-busted production assets load.

## D. Security / repository governance
- [ ] `main` protected.
- [ ] Pull request required before merge.
- [ ] Validation status check required.
- [ ] Force pushes blocked.
- [ ] Branch deletion blocked.
- [ ] CODEOWNERS review enforced for critical files.
- [ ] Maintainer 2FA confirmed.
- [ ] GitHub tokens/apps use least privilege.
- [ ] Release tag signed/verified where feasible.

## E. Deployment
- [ ] Staging build reviewed.
- [ ] Production release points to approved SHA/tag.
- [ ] Production page displays model version/evidence cut-off/release identifier.
- [ ] Deployed build verified against approved SHA.
- [ ] Previous release retained for rollback.
- [ ] Rollback procedure tested/documented.

## F. Clinical/regulatory readiness
- [ ] Regulatory classification advice obtained.
- [ ] Clinical safety hazards reviewed.
- [ ] Data/privacy assessment completed.
- [ ] Usability/human-factors testing completed.
- [ ] External/prospective validation plan approved.
- [ ] Evidence surveillance/update responsibility assigned.

## G. Release sign-off
- [ ] Clinical/evidence reviewer:
- [ ] Software/release reviewer:
- [ ] Release date:
- [ ] Release tag:
- [ ] Production SHA:
