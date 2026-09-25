const state={module:'medial',sex:'female',bearing:'fixed',robotic:'manual'};
const M=UKAModel;
const $=id=>document.getElementById(id);

function metric(label,val,sub=''){return `<div class="metric"><div class="metric-label">${label}</div><div class="metric-value">${val}</div><div class="metric-sub">${sub}</div></div>`}
function evidence(text,refs){return `<details class="evidence"><summary>Evidence & references</summary><div>${text}<div class="ref-list">${refs.map(r=>`<div><a target="_blank" rel="noopener" href="https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/">${r.label}</a></div>`).join('')}</div></div></details>`}
function tradeRow(name,sub,dir,label){return `<div class="trade-row"><div><div class="trade-name">${name}</div><div class="trade-sub">${sub}</div></div><div class="scale"><span class="marker ${dir}"></span></div><span class="badge ${dir==='tkr'?'tkr':dir==='similar'?'similar':'uka'}">${label}</span></div>`}
function notModelled(name,why){return `<div class="trade-row not-modelled"><div><div class="trade-name">${name}</div><div class="trade-sub">${why}</div></div><div class="scale scale-empty"><span>No comparative estimate</span></div><span class="badge na">Not modelled</span></div>`}

function commonInputs(){
 ['age','oks','volume','usage'].forEach(id=>{const el=$(id);if(!el)return;const v=el.value;$(id+'Out').textContent=id==='age'?`${v} years`:id==='oks'?`${v} / 48`:id==='usage'?`${v}%`:v});
 return {age:+$('age').value,pre:+$('oks').value,vol:+$('volume').value,use:+$('usage').value};
}

function providerText(vol,use){
 const cls=M.providerContext(vol,use);
 return cls==='favourable'
  ?'Favourable medial UKA provider context: ≥30 cases/year and ≥20% usage.'
  :cls==='low'
   ?'Low-exposure medial UKA context: <10 cases/year or very low usage; population revision estimates may be optimistic.'
   :cls==='moderateHighUsage'
    ?'Moderate-volume / higher-usage medial UKA context.'
    :'Intermediate medial UKA provider context.';
}

function configureControls(){
 const medial=state.module==='medial',lateral=state.module==='lateral',pfa=state.module==='pfa';
 $('constructTitle').textContent='Procedure settings';
 $('constructSubtitle').textContent=medial?'Bearing and surgical-assistance context for medial UKA.':lateral?'Surgical-assistance context for lateral UKA.':'Surgical-assistance context for patellofemoral arthroplasty.';
 $('ageField').style.display=lateral?'none':'';
 $('sexField').style.display=lateral?'none':'';
 $('patientInputNote').textContent=lateral?'Current lateral UKA estimates are population-level and are not personalised by age or sex. Optional OKS can still be recorded below.':'Age and sex are used where registry estimates are stratified by these factors.';
 $('bearingField').style.display=medial?'':'none';
 $('bearingCopy').style.display=medial?'':'none';
 $('roboticField').style.display='';
 $('roboticCopy').style.display='';
 $('roboticLabel').textContent=pfa?'PFA surgical technique':'UKA surgical technique';
 $('roboticCopy').textContent=medial
  ?'Robotic assistance is contextual only and does not numerically alter the medial UKA revision estimate.'
  :lateral
   ?'Robotic assistance is contextual only. Lateral-specific robotic outcomes are encouraging, but comparative superiority over conventional lateral UKA is not established well enough for a numeric modifier.'
   :'Robotic assistance is contextual only. Short- to mid-term comparative evidence suggests fewer complications and implant-related revisions with robotic PFA, but no long-term numeric modifier is applied.';
 $('providerSettings').style.display=medial?'':'none';
 $('scopeCopy').textContent=medial
  ?'Medial UKA has the most complete evidence module. Several outcomes are medial-specific; 30-day morbidity/mortality, PJI and lifetime revision use broader UKA registry evidence where compartment-specific data are unavailable.'
  :lateral
   ?'This lateral UKA module is a stand-alone comparison of lateral UKA with TKA. It uses a lateral-specific national-registry revision comparison plus lateral-specific functional and activity evidence. Outcomes without adequate lateral-specific evidence are explicitly left unmodelled.'
   :'This patellofemoral arthroplasty module is a stand-alone comparison of PFA with TKA. It uses PFA-specific NJR revision data and randomized PFA-vs-TKA functional evidence. Outcomes without adequate PFA-specific evidence are explicitly left unmodelled.';
 $('axisLabel').textContent=medial?'mUKA ← similar → TKA':lateral?'lateral UKA ← similar → TKA':'PFA ← similar → TKA';
}

function renderMedial(x){
 const rev=M.revisionEstimate(x.age,state.sex,state.bearing),s=M.safety30d(x.age),life=M.lifetimeRevision(x.age),medialLife=M.medialLifetimeReference(x.age);
 const uRev=rev.uka,tRev=rev.tkr,band=rev.band;
 const bearingLabel=state.bearing==='fixed'?'Fixed-bearing mUKA':'Mobile-bearing mUKA';
 const provider=providerText(x.vol,x.use);
 const bearingText=state.bearing==='fixed'
   ?'Fixed-bearing medial UKA has lower revision/bearing-related failure than mobile-bearing in the current NJR strata.'
   :'Mobile-bearing medial UKA has higher revision/bearing-related failure than fixed-bearing in the current NJR strata.';
 const roboticText=state.robotic==='robotic'
   ?'Robotic assistance is contextual only. Current AOANJRR evidence does not support applying a numeric revision reduction.'
   :'No robotic revision modifier is applied.';

 const oxfordMobileBlock=state.bearing==='mobile'
   ? `<div class="compare top-gap">${metric('Mobile-bearing medial UKA reference',medialLife.risk.toFixed(1)+'%',`95% CI ~${medialLife.ci[0].toFixed(1)}–${medialLife.ci[1].toFixed(1)}%`)}${metric('Context','Specialist series','Oxford mobile-bearing medial UKA')}</div><div class="outcome-copy">This specialist Oxford series applies specifically to mobile-bearing medial UKA performed using recommended indications and technique. It should not be extrapolated to fixed-bearing UKA.</div>`
   : '';

 $('comparisonTitle').textContent='Medial UKA vs TKA treatment trade-off';
 $('tradeoffRows').innerHTML=[
  tradeRow('Pain & function','Faster early recovery; small OKS differences by 1–2 years','similar','Broadly similar'),
  tradeRow('Natural-feeling knee','Forgotten Joint Score','uka','Favours mUKA'),
  tradeRow('10-year revision',`${uRev.toFixed(1)}% vs ${tRev.toFixed(1)}%`,'tkr','Favours TKA'),
  tradeRow('Lifetime revision · registry context',`~${Math.round(life.uka)}% vs ~${Math.round(life.tkr)}%`,'tkr','Favours TKA'),
  tradeRow('30-day morbidity / mortality',`${s.uka.toFixed(1)}% vs ${s.tkr.toFixed(1)}%`,'uka','Favours mUKA'),
  tradeRow('Periprosthetic joint infection','UKA registry HR 0.53','uka','Favours UKA'),
  tradeRow('Same-day discharge','Higher likelihood in selected fast-track pathways','uka','Favours mUKA'),
  tradeRow('Cost-effectiveness','Randomized NHS economic evidence','uka','Favours mUKA'),
  tradeRow('Recovery speed','Early recovery','uka','Favours mUKA'),
  tradeRow('Return to activity','Comparative evidence','uka','Favours mUKA'),
  tradeRow('ROM / movement quality','~+5.5° ROM at 2 years','uka','Favours mUKA')
 ].join('');

 $('outcomesGrid').innerHTML=`
 <article class="outcome-card"><div class="eyebrow dark">Pain & function · medial UKA</div><h3>Oxford Knee Score</h3><div class="compare">${metric('12 months · medial UKA','41.2','95% CI 39.6–42.7')}${metric('12 months · TKA','38.4','95% CI 36.9–40.0')}</div><div class="delta">Adjusted 12-month improvement difference: +3.2 points favouring medial UKA (95% CI 0.9–5.6).</div><div class="compare top-gap">${metric('2 years · medial UKA','41.2','95% CI 39.7–42.7')}${metric('2 years · TKA','40.1','95% CI 38.7–41.6')}</div><div class="delta">At 2 years the between-group difference was 1.6 points (95% CI −0.7 to 3.9), with no clear superiority on OKS.</div><div class="outcome-copy">Randomized evidence consistently suggests faster early recovery after medial UKA, but conventional OKS differences become small by 1–2 years. A larger 2026 double-blinded trial found an average 2-year OKS improvement advantage of 3.5 points (95% CI 2.3–4.7), below the commonly cited 4–5 point MCID. Baseline OKS is therefore recorded as optional clinical context rather than used to generate an individualized treatment prediction.</div>${evidence('The 12-month and 2-year absolute OKS values are from the 2021 Finnish randomized multicentre trial. The 2026 350-patient randomized trial independently supports a small average OKS advantage without clear clinically important superiority.',[{pmid:34162649,label:'2021 randomized medial UKA vs TKA trial'},{pmid:41662451,label:'2026 double-blinded multicentre randomized trial'},{pmid:41270774,label:'TOPKAT 10-year comparison'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Joint awareness</div><h3>Forgotten Joint Score</h3><div class="outcome-main">Favours mUKA</div><div class="delta">RCT difference +14.1 points (95% CI 9.5–18.6).</div>${evidence('Less joint awareness is a consistent medial UKA advantage in contemporary comparative evidence.',[{pmid:41662451,label:'2026 blinded multicentre RCT'},{pmid:41825825,label:'2026 FJS meta-analysis'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Longevity</div><h3>10-year revision</h3><div class="compare">${metric(bearingLabel,uRev.toFixed(1)+'%',`95% CI ${rev.ukaCI[0].toFixed(1)}–${rev.ukaCI[1].toFixed(1)}%; ${band}, ${state.sex}`)}${metric('TKA',tRev.toFixed(1)+'%',`95% CI ${rev.tkrCI[0].toFixed(1)}–${rev.tkrCI[1].toFixed(1)}%`)}</div><div class="delta">Absolute excess revision with mUKA: +${(uRev-tRev).toFixed(1)} percentage points.</div><div class="outcome-copy">${provider} ${bearingText} ${roboticText}</div></article>

 <article class="outcome-card"><div class="eyebrow dark">Revision context · medial UKA</div><h3>If revision becomes necessary</h3><div class="outcome-main">Conversion to TKA is generally closer to primary TKA than revision TKA</div><div class="outcome-copy">Revision of a failed medial UKA usually means conversion to a TKA. Contemporary matched evidence suggests PROMs and overall outcome burden are often much closer to primary TKA than to revision TKA, although conversion can be technically more complex and some functional scores remain slightly lower than after primary TKA.</div><div class="delta">This does not reduce the higher revision risk of UKA; it provides context about the likely consequence if revision occurs.</div>${evidence('A matched three-group study found revised medial UKA had Knee Society and Forgotten Joint Score outcomes close to primary TKA and better than revision TKA. A matched-study meta-analysis found no significant difference versus primary TKA in revision risk, total complications, WOMAC or pain, although some functional scores still favoured primary TKA.',[{pmid:40532925,label:'2025 medial UKA revision vs primary and revision TKA'},{pmid:37708740,label:'2023 UKA-to-TKA vs primary TKA meta-analysis'}])}</article>\n\n <article class="outcome-card"><div class="eyebrow dark">Longevity · lifetime revision</div><h3>Remaining-lifetime revision</h3><div class="compare">${metric('UKA','~'+Math.round(life.uka)+'%',life.ukaLabel)}${metric('TKA','~'+Math.round(life.tkr)+'%',life.tkrLabel)}</div><div class="delta">Lifetime revision exposure is higher after UKA than TKA, particularly in younger patients.</div><div class="outcome-copy">This pragmatic population estimate combines national-registry lifetime-risk anchors with a contemporary NJR mid-life implant-design anchor. It is intended to represent the broad UKA population and is most applicable to medial UKA, which comprises the majority of routine UKA practice. Values are rounded and should be interpreted as counselling estimates rather than validated individual probabilities.</div>${oxfordMobileBlock}${evidence('Population lifetime-risk estimates are informed by NZJR and NJR data. The Oxford lifetime series is shown only for mobile-bearing medial UKA because that is the construct studied.',[{pmid:35638212,label:'NZJR UKA lifetime revision risk'},{pmid:35094573,label:'NZJR TKA lifetime revision risk'},{pmid:39631511,label:'NJR implant-specific lifetime revision modelling'},{pmid:33180153,label:'Oxford mobile-bearing medial UKA lifetime revision series'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Early postoperative complications</div><h3>30-day morbidity and mortality</h3><div class="compare">${metric('UKA',s.uka.toFixed(1)+'%',`95% CI ~${s.ukaCI[0].toFixed(1)}–${s.ukaCI[1].toFixed(1)}%`)}${metric('TKA',s.tkr.toFixed(1)+'%',`95% CI ~${s.tkrCI[0].toFixed(1)}–${s.tkrCI[1].toFixed(1)}%`)}</div><div class="outcome-copy">Supportive UKA evidence: the source does not separate medial and lateral UKA.</div>${evidence('This is a composite of 30-day morbidity or mortality, not a generic “safety” score.',[{pmid:39233099,label:'Age-specific UKA vs TKA 30-day morbidity/mortality'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Infection</div><h3>Periprosthetic joint infection revision</h3><div class="compare">${metric('UKA','0.4%','observed registry revisions')}${metric('TKA','0.8%','observed registry revisions')}</div><div class="delta">Adjusted PJI-related revision HR 0.53.</div><div class="outcome-copy">Supportive UKA evidence; compartment was not separately modelled.</div>${evidence('Swiss SIRIS national registry comparison.',[{pmid:41779036,label:'2026 SIRIS PJI analysis'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Pathway & discharge</div><h3>Same-day discharge</h3><div class="outcome-main">More likely after medial UKA</div><div class="outcome-copy">Medial UKA is more compatible with successful same-day discharge in appropriately selected fast-track pathways than TKA. A single percentage is not shown because success depends heavily on patient selection, anaesthetic and analgesic protocols, operating time, social support and local discharge criteria.</div>${evidence('Direction is supported by medial-UKA fast-track cohorts and UKA same-day-discharge studies, but absolute rates are pathway-specific.',[{pmid:39496281,label:'2024 fast-track medial UKA/TKA cohort'},{pmid:35951077,label:'UKA same-day discharge meta-analysis'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Health economics · medial UKA</div><h3>Cost-effectiveness</h3><div class="outcome-main">Favours medial partial knee replacement</div><div class="outcome-copy">The strongest evidence comes from TOPKAT, a UK multicentre randomized trial in medial-compartment osteoarthritis. At 10 years, partial knee replacement had lower NHS healthcare costs and slightly greater accumulated QALYs than TKA. This is health-system evidence rather than a patient-specific financial prediction.</div>${evidence('TOPKAT 10-year economic analysis: mean healthcare cost difference −£731 (95% CI −£1,352 to −£110) and QALY difference +0.322 (95% CI −0.069 to 0.712), favouring partial knee replacement. Earlier 5-year trial analysis reached the same overall conclusion.',[{pmid:41270774,label:'TOPKAT 10-year clinical and cost-effectiveness trial'},{pmid:29706598,label:'NJR lifetime UKR vs TKA cost-effectiveness model'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Recovery & activity</div><h3>Return to activity</h3><div class="outcome-main">Favours mUKA</div><div class="outcome-copy">Medial UKA generally supports quicker early recovery and higher return-to-sport/activity rates than TKA.</div>${evidence('Comparative activity evidence favours UKA, especially for higher-demand activity.',[{pmid:40825370,label:'Return-to-sport meta-analysis'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Movement quality</div><h3>Range of motion & gait</h3><div class="outcome-main">Favours mUKA</div><div class="delta">Approximately +5.5° ROM at 2 years in randomized evidence.</div>${evidence('ROM benefit is supported by medial-specific randomized evidence.',[{pmid:41662451,label:'2026 blinded multicentre RCT'}])}</article>`;

 const notes=[
  x.age<60?'Younger age makes long-term revision exposure especially important.':x.age>=75?'Older age reduces remaining-lifetime revision exposure through competing mortality.':'Age remains an important modifier of revision.',
  bearingText,roboticText,provider,
  'The medial module has the broadest evidence coverage of the three compartments.'
 ];
 $('scenarioNotes').innerHTML=notes.map(n=>`<div class="note">${n}</div>`).join('');
}

function renderLateral(x){
 const rev=M.lateralRevisionEstimate();
 const label='Lateral UKA';
 $('comparisonTitle').textContent='Lateral UKA vs TKA treatment trade-off';
 $('tradeoffRows').innerHTML=[
  tradeRow('Pain & function','Comparative cohort OKS 44 vs 36','uka','Favours lateral UKA'),
  notModelled('Natural-feeling knee','No robust lateral-specific FJS comparator'),
  tradeRow('10-year revision',`${rev.uka.toFixed(1)}% vs ${rev.tkr.toFixed(1)}%`,'tkr','Favours TKA'),
  notModelled('Lifetime revision','No validated lateral-specific lifetime model'),
  tradeRow('90-day readmission / complications','No significant difference in matched registry study','similar','Similar'),
  notModelled('Periprosthetic joint infection','No lateral-specific comparative estimate'),
  notModelled('Same-day discharge','No lateral-specific comparative pathway estimate'),
  notModelled('Cost-effectiveness','Insufficient lateral-specific comparative cost-utility evidence'),
  tradeRow('Return to sport','~92.4% pooled lateral UKA RTS','uka','High RTS after lateral UKA'),
  tradeRow('Gait / movement quality','Near-normal gait; 7.0 vs 5.5 km/h top speed','uka','Favours lateral UKA')
 ].join('');

 const lateralRoboticCard=state.robotic==='robotic'
   ? `<article class="outcome-card"><div class="eyebrow dark">Robotic assistance · lateral UKA</div><h3>Contextual robotic evidence</h3><div class="compare">${metric('Pooled survivorship','98.8%','95% CI 97.1–99.8; mean follow-up 53.4 months')}${metric('Satisfaction','95.4%','95% CI 92.9–97.4')}</div><div class="outcome-copy">Robotic lateral UKA has excellent early-to-mid-term survivorship and PROMs, but the evidence is predominantly small, heterogeneous observational cohorts. No robotic adjustment is applied to the 10-year lateral UKA revision estimate.</div>${evidence('Lateral-specific robotic systematic review and meta-analysis.',[{pmid:42159185,label:'2026 robotic lateral UKA meta-analysis'}])}</article>`
   : `<article class="outcome-card"><div class="eyebrow dark">Surgical technique · lateral UKA</div><h3>Conventional technique</h3><div class="outcome-copy">The registry and comparative estimates in this module are not altered by surgical-assistance selection. Robotic evidence is shown only when robotic-assisted surgery is selected.</div></article>`;

 $('outcomesGrid').innerHTML=`
 ${lateralRoboticCard}
 <article class="outcome-card"><div class="eyebrow dark">Pain & function · lateral-specific</div><h3>Oxford Knee Score / patient-reported function</h3><div class="compare">${metric('Lateral UKA','44','mean OKS; matched cohort')}${metric('TKA','36','mean OKS; matched cohort')}</div><div class="outcome-copy">This is a matched observational gait/function cohort, not a randomized treatment-effect estimate. It supports better function after lateral UKA but should not be used as an individualized prediction.</div>${evidence('A contemporary matched study found higher OKS and more physiological gait after lateral UKA than TKA.',[{pmid:41642280,label:'2026 lateral UKA vs TKA gait and outcome study'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Longevity · lateral-specific national registry</div><h3>10-year revision</h3><div class="compare">${metric(label,rev.uka.toFixed(1)+'%','all lateral UKA; Danish national registry')}${metric('TKA',rev.tkr.toFixed(1)+'%','matched valgus-aligned TKA comparator')}</div><div class="delta">Absolute excess revision: +${rev.excess.toFixed(1)} percentage points. Adjusted subdistribution HR ${rev.adjustedSHR.toFixed(1)} (95% CI ${rev.adjustedSHRCI[0].toFixed(1)}–${rev.adjustedSHRCI[1].toFixed(1)}).</div><div class="outcome-copy">This national-registry estimate includes all primary lateral UKAs from 1997–2022 and matched TKAs for valgus-aligned knees. It is not age- or sex-personalized. Contemporary 5-year revision improved to 7.3% for lateral UKA versus 3.7% for TKA in 2017–2022.</div>${evidence('National Danish registry study with competing-risk analysis and propensity-matched TKA comparator.',[{pmid:40652369,label:'2025 Danish lateral UKA registry study'}])}</article>\n\n <article class="outcome-card"><div class="eyebrow dark">Revision context · supportive UKA evidence</div><h3>If lateral UKA requires conversion</h3><div class="outcome-copy">Most published conversion studies combine medial and lateral UKA rather than reporting lateral UKA separately. Across mixed UKA cohorts, conversion to TKA generally produces outcomes nearer to primary TKA than to revision TKA, but this should be treated as supportive rather than lateral-specific evidence.</div>${evidence('No robust lateral-only PROM comparison was identified, so mixed-UKA conversion evidence is shown only as contextual support.',[{pmid:37708740,label:'2023 UKA-to-TKA vs primary TKA meta-analysis'}])}</article>\n\n <article class="outcome-card"><div class="eyebrow dark">Early postoperative outcomes · lateral-specific</div><h3>90-day readmission and complications</h3><div class="outcome-main">No significant difference</div><div class="outcome-copy">The national Danish registry comparison found no significant difference in 90-day readmissions or complications between lateral UKA and matched TKA. A numerical patient-specific risk is not available, so the module shows direction only.</div>${evidence('Lateral-specific national registry evidence.',[{pmid:40652369,label:'2025 Danish lateral UKA registry study'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Activity · lateral-specific</div><h3>Return to sport</h3><div class="outcome-main">High return rate after lateral UKA</div><div class="delta">Pooled RTS 92.4% (95% CI 81.5–97.1); return to performance 88.5% (75.1–95.1).</div><div class="outcome-copy">Evidence is mainly Level IV and non-comparative. High-impact participation often decreases despite a high overall return rate.</div>${evidence('Recent lateral-specific systematic review/meta-analysis.',[{pmid:40878711,label:'2025 lateral UKA return-to-sport meta-analysis'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Movement quality · lateral-specific</div><h3>Gait</h3><div class="compare">${metric('Lateral UKA','7.0 km/h','mean top walking speed')}${metric('TKA','5.5 km/h','matched comparator')}</div><div class="delta">Lateral UKA walked 26% faster with nearer-normal vertical ground-reaction forces and longer stride length.</div>${evidence('Matched gait study; small sample, so this is supportive functional evidence rather than a population forecast.',[{pmid:41642280,label:'2026 lateral UKA vs TKA gait study'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Evidence gap</div><h3>Lifetime revision and early complications</h3><div class="outcome-copy">A lateral-specific lifetime competing-risk model, PJI comparison, 30-day morbidity/mortality model and same-day-discharge comparison were not identified at a quality sufficient to populate this module. The app deliberately does not substitute medial UKA numbers.</div></article>`;
}

function renderPFA(x){
 const rev=M.pfaRevisionEstimate(x.age,state.sex),band=rev.band,b=M.benchmarks.pfa;
 $('comparisonTitle').textContent='Patellofemoral arthroplasty vs TKA treatment trade-off';
 $('tradeoffRows').innerHTML=[
  tradeRow('Pain & function','PAT RCT: similar at 12 months; OKS similar at 2 and 5 years','similar','Broadly similar'),
  notModelled('Natural-feeling knee','No robust PFA-specific FJS model'),
  tradeRow('10-year revision',`${rev.pfa.toFixed(1)}% vs ${rev.tkr.toFixed(1)}%`,'tkr','Favours TKA'),
  notModelled('Lifetime revision','No validated PFA lifetime model'),
  notModelled('30-day morbidity / mortality','No PFA-specific comparative estimate'),
  notModelled('Periprosthetic joint infection','No PFA-specific comparative estimate'),
  notModelled('Same-day discharge','No PFA-specific comparative pathway estimate'),
  tradeRow('ROM / movement','Early advantage reported; diminishes over time','uka','Early PFA advantage'),
  tradeRow('Return to sport','Evidence limited; lower rates than UKA','similar','Uncertain'),
  tradeRow('Cost-effectiveness','Procedure-specific economic evidence; uncertainty remains','uka','Potentially favours PFA')
 ].join('');

 const pfaRoboticCard=state.robotic==='robotic'
   ? `<article class="outcome-card"><div class="eyebrow dark">Robotic assistance · PFA</div><h3>Contextual robotic evidence</h3><div class="compare">${metric('Complications','15% vs 30%','robotic vs conventional pooled comparison')}${metric('Implant-related revision','0.7% vs 1.9%','OR 0.32; short–mid-term')}</div><div class="delta">Reoperation 6.3% vs 8.6% (OR 0.67).</div><div class="outcome-copy">Comparative meta-analysis suggests lower short- to mid-term complication, reoperation and implant-related revision rates with robotic PFA. Evidence remains observational and follow-up is limited, so the NJR 10-year PFA revision estimate is not numerically modified.</div>${evidence('Comparative robotic PFA evidence is promising but not yet sufficient for a long-term calibrated modifier.',[{pmid:41627484,label:'2026 robotic PFA comparative meta-analysis'},{pmid:40548200,label:'MARCQI manual vs robotic PFA study'},{pmid:41614388,label:'2026 robotic PFA survivorship meta-analysis'}])}</article>`
   : `<article class="outcome-card"><div class="eyebrow dark">Surgical technique · PFA</div><h3>Conventional technique</h3><div class="outcome-copy">The PFA registry and randomized outcome estimates are not altered by surgical-assistance selection. Robotic evidence is shown only when robotic-assisted surgery is selected.</div></article>`;

 $('outcomesGrid').innerHTML=`
 ${pfaRoboticCard}
 <article class="outcome-card"><div class="eyebrow dark">Pain & function · PFA-specific randomized evidence</div><h3>Patient-reported outcomes</h3><div class="outcome-main">Broadly similar by 12 months and mid-term</div><div class="delta">PAT randomized trial: WOMAC function adjusted mean difference −1.2 at 12 months (95% CI −9.19 to 6.80); no significant OKS difference at 24 or 60 months.</div><div class="outcome-copy">A 2026 GRADE systematic review concludes that PFA may provide faster recovery and better early PROMs in selected patients, but PROMs converge by mid- to long-term follow-up. This module therefore avoids claiming a persistent PROM advantage.</div>${evidence('Primary randomized evidence is the independent PAT trial. A separate 6-year PFA trial previously used here carries an Expression of Concern and subsequent erratum, so its original numerical effect estimates are not used as primary model inputs.',[{pmid:32114806,label:'PAT randomized clinical trial'},{pmid:41677917,label:'2026 GRADE systematic review'},{pmid:36516356,label:'Expression of Concern affecting separate 6-year RCT'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Longevity · PFA-specific NJR</div><h3>10-year revision</h3><div class="compare">${metric('Patellofemoral arthroplasty',rev.pfa.toFixed(1)+'%',`95% CI ${rev.pfaCI[0].toFixed(1)}–${rev.pfaCI[1].toFixed(1)}%; ${band}, ${state.sex}`)}${metric('TKA',rev.tkr.toFixed(1)+'%',`95% CI ${rev.tkrCI[0].toFixed(1)}–${rev.tkrCI[1].toFixed(1)}%`)}</div><div class="delta">Absolute excess revision with PFA: +${rev.excess.toFixed(1)} percentage points.</div><div class="outcome-copy">The NJR reports PFA separately by age and sex, allowing the same transparent 10-year registry methodology used elsewhere in the app.</div></article>

 <article class="outcome-card"><div class="eyebrow dark">Movement quality</div><h3>Range of motion</h3><div class="outcome-main">Possible early advantage with PFA</div><div class="outcome-copy">Systematic reviews report better early postoperative ROM with PFA, but the advantage diminishes over time and estimates are inconsistent across small trials. No single numerical ROM effect is used in the model.</div>${evidence('Moderate-certainty synthesis supports an early ROM advantage but not a durable large effect.',[{pmid:41677917,label:'2026 GRADE systematic review'},{pmid:33858458,label:'2021 PFA vs TKA meta-analysis'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Revision context · PFA</div><h3>If conversion to TKA becomes necessary</h3><div class="outcome-main">Usually technically closer to primary TKA, but not equivalent</div><div class="outcome-copy">Conversion of a failed patellofemoral arthroplasty to TKA can usually be performed with primary-type implants and produces functional outcomes that are often nearer to primary TKA than to revision TKA. However, complication and repeat-revision risks are higher than after a primary TKA, so it should not be presented as a simple primary-equivalent procedure.</div><div class="delta">The reason for PFA failure matters: conversions for patellar component failure may have worse motion and PROMs than conversions for progression of tibiofemoral arthritis.</div>${evidence('A direct three-group comparison found revised PFA had knee scores and range of motion closer to primary TKA than revision TKA, with most cases treated using standard implants. Registry data place repeat-revision risk between primary and revision TKA. More recent cohort evidence suggests outcomes are generally similar to primary TKA except in some patellar-component failures.',[{pmid:24980643,label:'PFA revision: primary-like or revision-like TKA?'} ,{pmid:31136442,label:'Australian registry repeat-revision risk after PFA-to-TKA'},{pmid:37210859,label:'2023 PFA-to-TKA conversion outcomes'},{pmid:36889525,label:'PFA failure mechanism and conversion outcomes'}])}</article>\n\n <article class="outcome-card"><div class="eyebrow dark">Health economics · PFA</div><h3>Cost-effectiveness</h3><div class="outcome-main">Potentially cost-effective, with important uncertainty</div><div class="outcome-copy">Procedure-specific comparative economic studies suggest PFA can be less costly and provide similar or greater quality-adjusted health benefit than TKA in selected patients. Long-term conclusions are sensitive to assumptions about postoperative utility, implant longevity and age, so this should be interpreted as supportive evidence rather than a universal economic advantage.</div>${evidence('A randomized-trial economic analysis found PFA cheaper and more effective at one year. A 2026 NJR/NHS Markov analysis found PFA may be cost-effective, particularly in older patients, but with substantial decision uncertainty driven mainly by postoperative utility assumptions.',[{pmid:32228074,label:'Randomized PFA vs TKA cost-effectiveness analysis'},{pmid:42624592,label:'2026 NJR/NHS PFA vs TKA cost-effectiveness model'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Activity</div><h3>Return to sport</h3><div class="outcome-main">Evidence limited</div><div class="outcome-copy">A recent systematic review found lower return-to-sport participation after PFA than after UKA, with reported return varying substantially by sport-impact category. This is not yet strong enough for an individualized PFA-vs-TKA estimate.</div>${evidence('Return-to-sport evidence exists but is heterogeneous and not suitable for a patient-specific probability.',[{pmid:40825370,label:'2025 knee arthroplasty return-to-sport meta-analysis'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Evidence gap</div><h3>Lifetime revision and early complications</h3><div class="outcome-copy">No validated PFA-specific lifetime revision, 30-day morbidity/mortality, PJI or same-day-discharge model was identified at sufficient quality for this tool. These domains are therefore not borrowed from UKA.</div></article>`;
}

function render(){
 const x=commonInputs();
 configureControls();
 if(state.module==='lateral') renderLateral(x);
 else if(state.module==='pfa') renderPFA(x);
 else renderMedial(x);
}

document.querySelectorAll('.segmented').forEach(group=>group.addEventListener('click',e=>{
 if(e.target.tagName!=='BUTTON')return;
 group.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
 e.target.classList.add('active');
 state[group.dataset.input]=e.target.dataset.value;
 render();
}));
['age','oks','volume','usage'].forEach(id=>$(id).addEventListener('input',render));

function resetAll(){
 $('age').value=65;
 $('oks').value=20;
 $('volume').value=30;
 $('usage').value=20;
 state.module='medial';
 state.sex='female';
 state.bearing='fixed';
 state.robotic='manual';
 document.querySelectorAll('.segmented').forEach(g=>g.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.value===state[g.dataset.input])));
 render();
}
$('resetAll').addEventListener('click',resetAll);

function initOksHelper(){
 const holder=$('oksItems');
 if(!holder)return;
 holder.innerHTML=Array.from({length:12},(_,i)=>`
   <div class="field"><label for="oksItem${i+1}">Item ${i+1}</label>
   <select id="oksItem${i+1}" class="oks-item-select"><option value="">Select score</option>
   <option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>`).join('');
 const selects=[...document.querySelectorAll('.oks-item-select')],totalEl=$('oksCalcTotal'),useBtn=$('useOksScore');
 function recalc(){
   const vals=selects.map(s=>s.value===''?null:+s.value),complete=vals.every(v=>v!==null);
   if(!complete){totalEl.textContent='— / 48';useBtn.disabled=true;return;}
   const total=M.oksTotal(vals); totalEl.textContent=`${total} / 48`;useBtn.disabled=false;useBtn.dataset.score=String(total);
 }
 selects.forEach(s=>s.addEventListener('change',recalc));
 useBtn.addEventListener('click',()=>{if(useBtn.disabled)return;$('oks').value=useBtn.dataset.score;render();$('oksHelper').open=false;});
}
initOksHelper();
render();
