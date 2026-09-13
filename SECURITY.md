# Security Policy

## Project status

This repository contains a research prototype for evidence-based knee arthroplasty decision support. It is not yet a clinically validated medical device.

## Reporting a vulnerability or integrity concern

Please do **not** publish exploitable security or model-integrity vulnerabilities in a public issue before maintainers have had an opportunity to assess them.

Report concerns privately to the repository owner through GitHub's available private contact/security mechanisms.

Relevant concerns include:
- unauthorized modification of model constants;
- deployment of a build different from the reviewed commit;
- workflow or dependency compromise;
- cross-site scripting or content injection;
- compromised references/evidence links;
- exposure of patient-identifiable information;
- unexpected storage/transmission of user-entered data.

## Integrity principles

A production release should:
- correspond to a documented commit SHA;
- pass the complete automated validation suite;
- have evidence/model changes independently reviewed;
- retain an auditable evidence cut-off and model version;
- be reversible to the previous approved release.

## Data handling

The current static prototype performs calculations locally in the browser and is not designed to store patient-identifiable information. Clinical deployment should not add storage, telemetry or external data transfer without a separate privacy, security and regulatory review.
