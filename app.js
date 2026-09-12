const state={sex:'female',asa:'2',bearing:'fixed'};
const revision={
 '<55':{male:{tkr:6.04,fixed:9.00,mobile:17.06},female:{tkr:5.24,fixed:10.07,mobile:17.53}},
 '55-64':{male:{tkr:3.81,fixed:6.19,mobile:11.09},female:{tkr:3.46,fixed:7.18,mobile:12.56}},
 '65-74':{male:{tkr:2.55,fixed:4.26,mobile:7.84},female:{tkr:2.35,fixed:4.93,mobile:10.32}},
 '75+':{male:{tkr:1.71,fixed:2.93,mobile:5.75},female:{tkr:1.64,fixed:4.31,mobile:8.69}}
};
const $=id=>document.getElementById(id);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function ageBand(a){return a<55?'<55':a<65?'55-64':a<75?'65-74':'75+'}
function ukaOks(age,pre){const ad=age<=75?.14*(age-65):.14*10-.18*(age-75);return clamp(37.5+.24*(pre-21.9)+ad,0,48)}
function tkrOks(age,sex,bmi,asa,pre){let am=age<60?0:age<70?.8:age<80?1.4:-2.5,mi=age<60?0:age<70?4.8:age<80?4.3:8.1;let x=32.9+am-1.5*(bmi/10)+.4*pre+(asa>=3?-2:0);if(sex==='male')x+=-4.8+mi;return clamp(x,0,48)}
function safety(age){const A=[65,75,85],U=[2.1,2.4,3.2],T=[2.9,3.6,5.5],a=clamp(age,65,85);let i=a<=75?0:1,f=(a-A[i])/(A[i+1]-A[i]);return{uka:U[i]+f*(U[i+1]-U[i]),tkr:T[i]+f*(T[i+1]-T[i]),label:age<65?'≤65 reference':age>85?'≥85 reference':'age-adjusted'}}
function lifetime(age){if(age<55)return{u:'~30–40%',t:'~15–22%',n:'Young-patient registry range; lifetime revision risk is highly age-sensitive.'};if(age<65)return{u:'~15–25%',t:'~7–12%',n:'Literature range across registry and specialist-practice estimates.'};if(age<75)return{u:'~11–14%',t:'~3–5%',n:'Around age 65–69, published modelling reports ~13.7% unicondylar vs ~3.6% unconstrained TKA.'};if(age<85)return{u:'~5–8%',t:'~2–3%',n:'Competing mortality reduces remaining-lifetime revision exposure.'};return{u:'~3–4%',t:'~1–2%',n:'Oldest-age registry context; competing mortality dominates.'}}
function metric(label,val,sub=''){return `<div class="metric"><div class="metric-label">${label}</div><div class="metric-value">${val}</div><div class="metric-sub">${sub}</div></div>`}
function evidence(text,refs){return `<details class="evidence"><summary>Evidence & references</summary><div>${text}<div class="ref-list">${refs.map(r=>`<div><a target="_blank" rel="noopener" href="https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/">${r.label}</a></div>`).join('')}</div></div></details>`}
function tradeRow(name,sub,dir,label){return `<div class="trade-row"><div><div class="trade-name">${name}</div><div class="trade-sub">${sub}</div></div><div class="scale"><span class="marker ${dir}"></span></div><span class="badge ${dir==='tkr'?'tkr':dir==='similar'?'similar':'uka'}">${label}</span></div>`}
function render(){
 ['age','bmi','oks','volume','usage'].forEach(id=>{const v=$(id).value;$(id+'Out').textContent=id==='age'?`${v} years`:id==='bmi'?Number(v).toFixed(1):id==='oks'?`${v} / 48`:id==='usage'?`${v}%`:v});
 const age=+$('age').value,bmi=+$('bmi').value,pre=+$('oks').value,band=ageBand(age);
 const r=revision[band][state.sex],uRev=r[state.bearing],tRev=r.tkr,s=safety(age),life=lifetime(age),uO=ukaOks(age,pre),tO=tkrOks(age,state.sex,bmi,+state.asa,pre);
 const bearingLabel=state.bearing==='fixed'?'Fixed-bearing UKA':'Mobile-bearing UKA';
 $('tradeoffRows').innerHTML=[
  tradeRow('Pain & function','Conventional OKS','similar','Broadly similar'),
  tradeRow('Natural-feeling knee','Forgotten Joint Score','uka','Favours UKA'),
  tradeRow('10-year revision',`${uRev.toFixed(1)}% vs ${tRev.toFixed(1)}%`,'tkr','Favours TKR'),
  tradeRow('Lifetime revision','Competing-risk literature','tkr','Favours TKR'),
  tradeRow('30-day medical safety',`${s.uka.toFixed(1)}% vs ${s.tkr.toFixed(1)}%`,'uka','Favours UKA'),
  tradeRow('Same-day discharge','42% vs 20% overall fast-track cohort','uka','Favours UKA'),
  tradeRow('Recovery speed','Early recovery','uka','Favours UKA'),
  tradeRow('Return to activity','Activity','uka','Favours UKA'),
  tradeRow('ROM / movement quality','~+5.5° ROM at 2 years','uka','Favours UKA')
 ].join('');

 const provider=+$('volume').value>=30&&+$('usage').value>=20?'Higher-volume / higher-usage UKA context.':+$('volume').value<10||+$('usage').value<10?'Low UKA volume/usage: interpret registry UKA revision estimates cautiously.':'Intermediate provider UKA context.';
 const bearingText=state.bearing==='fixed'
   ?'Current evidence suggests fixed-bearing UKA has lower revision and bearing/dislocation risk than mobile-bearing UKA, with broadly similar PROMs.'
   :'Current evidence suggests mobile-bearing UKA has higher revision and bearing/dislocation risk than fixed-bearing UKA, while PROMs are broadly similar.';

 $('outcomesGrid').innerHTML=`
 <article class="outcome-card"><div class="eyebrow dark">Pain & function</div><h3>Oxford Knee Score</h3><div class="compare">${metric('UKA ~6 months',uO.toFixed(1),`change ~${(uO-pre>=0?'+':'')+(uO-pre).toFixed(1)}`)}${metric('TKR 12 months',tO.toFixed(1),`change ~${(tO-pre>=0?'+':'')+(tO-pre).toFixed(1)}`)}</div><div class="outcome-copy">These are prognostic research references from different source models and timepoints, not a direct causal treatment-effect estimate. Randomized comparative evidence suggests the conventional OKS difference is small.</div>${evidence('Recent randomized evidence reports at most a modest conventional PROM difference, while TOPKAT found no clinically important mean OKS difference at long-term follow-up.',[{pmid:41662451,label:'2026 blinded multicentre RCT'},{pmid:41270774,label:'TOPKAT 10-year randomized comparison'},{pmid:25042552,label:'Large UKA PROM prediction cohort'},{pmid:29467465,label:'Externally validated TKR OKS prediction model'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Joint awareness</div><h3>Forgotten Joint Score</h3><div class="outcome-main">Favours UKA</div><div class="delta">Typical comparative difference: about +6 to +14 FJS points with UKA, depending on follow-up.</div><div class="outcome-copy">This is a treatment-level comparative effect, not an individualized FJS forecast from the sliders.</div>${evidence('Comparative studies consistently report less joint awareness after UKA than TKR, with effect size varying by follow-up.',[{pmid:41825825,label:'2026 FJS meta-analysis'},{pmid:41662451,label:'2026 blinded multicentre RCT'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Longevity</div><h3>10-year revision</h3><div class="compare">${metric(bearingLabel,uRev.toFixed(1)+'%',`${band}, ${state.sex}`)}${metric('TKR',tRev.toFixed(1)+'%','cemented unconstrained fixed-bearing')}</div><div class="delta">Absolute excess revision with ${state.bearing}-bearing UKA: +${(uRev-tRev).toFixed(1)} percentage points.</div><div class="outcome-copy">${provider} ${bearingText} Registry figures are not causal treatment effects.</div>${evidence('Revision risk varies materially by age, sex and UKA construct. Fixed-bearing UKA has shown lower revision risk than mobile-bearing UKA in recent randomized and meta-analytic evidence, but certainty is not uniform across all outcomes.',[{pmid:42448245,label:'2026 fixed vs mobile systematic review/meta-analysis'},{pmid:41442900,label:'Minimum 10-year randomized fixed vs mobile UKA trial'},{pmid:39216863,label:'Large contemporary fixed vs mobile cohort'},{pmid:41270774,label:'TOPKAT 10-year UKA vs TKR comparison'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Longevity</div><h3>Remaining-lifetime revision</h3><div class="compare">${metric('UKA',life.u,'literature range')}${metric('TKR',life.t,'literature range')}</div><div class="outcome-copy">${life.n}</div>${evidence('Age dominates remaining-lifetime revision exposure. Sex and ASA also modify risk, but no complete open age×sex×ASA competing-risk equation was identified for faithful individual calculation.',[{pmid:35638212,label:'NZ registry lifetime UKA revision risk'},{pmid:39631511,label:'NJR implant-specific lifetime revision modelling'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Early safety</div><h3>30-day morbidity / mortality</h3><div class="compare">${metric('UKA',s.uka.toFixed(1)+'%',s.label)}${metric('TKR',s.tkr.toFixed(1)+'%',s.label)}</div><div class="delta">Approx. ${(s.tkr-s.uka).toFixed(1)} percentage points lower with UKA.</div><div class="outcome-copy">Age-based published anchors; not a comprehensive individualized perioperative-risk calculator.</div>${evidence('Large comparative datasets consistently favour UKA for early medical safety, although absolute risk depends on patient and pathway factors.',[{pmid:39233099,label:'Age-specific UKA vs TKA 30-day safety study'},{pmid:30792179,label:'Systematic review of patient-relevant UKA vs TKR outcomes'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Pathway & discharge</div><h3>Same-day discharge</h3><div class="compare">${metric('Medial UKA','42%','overall fast-track cohort')}${metric('TKR','20%','overall fast-track cohort')}</div><div class="delta">Among eligible patients operated before 1 pm: 72% UKA vs 61% TKR achieved same-day discharge.</div><div class="outcome-copy">This is strongly pathway-dependent. In dedicated UKA day-case programmes, pooled successful same-day discharge was ~88% overall, ~91% in selected patients and ~76% in unselected cohorts. These figures use different denominators and should not be interpreted as an individualized probability.</div>${evidence('Modern fast-track comparative data show higher day-case eligibility and success after medial UKA than TKR. Dedicated UKA day-case studies report even higher success when same-day discharge is explicitly intended.',[{pmid:39496281,label:'2024 prospective multicentre fast-track UKA/TKA cohort'},{pmid:35951077,label:'Systematic review/meta-analysis of same-day UKA'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Recovery & activity</div><h3>Early recovery and return to activity</h3><div class="outcome-main">Favours UKA</div><div class="outcome-copy">UKA is associated with shorter hospital stay and generally quicker early recovery. Comparative literature also tends to favour UKA for return to sport/activity, particularly higher-demand activity, though individual return timing cannot be predicted reliably here.</div>${evidence('The direction of benefit is consistent, but effect estimates vary by pathway and activity definition.',[{pmid:30792179,label:'Systematic review of patient-relevant outcomes'},{pmid:40825370,label:'Return-to-sport/activity meta-analysis'}])}</article>

 <article class="outcome-card"><div class="eyebrow dark">Movement quality</div><h3>Range of motion & gait</h3><div class="outcome-main">Favours UKA</div><div class="delta">Randomized evidence: approximately +5.5° greater ROM with UKA at 2 years.</div><div class="outcome-copy">Biomechanical studies also suggest more physiological movement after UKA, although gait evidence is smaller and more heterogeneous than the PROM/revision literature.</div>${evidence('ROM benefit is supported by randomized evidence; gait remains a lower-certainty comparative trend.',[{pmid:41662451,label:'2026 blinded multicentre RCT'},{pmid:37321113,label:'UKA vs TKA gait meta-analysis'}])}</article>`;

 const notes=[];
 notes.push(age<60?'Younger age makes long-term and lifetime revision exposure especially important in counselling.':age>=75?'Older age reduces remaining-lifetime revision exposure through competing mortality.':'Age remains an important modifier of revision and early safety.');
 if(bmi>=35)notes.push('Higher BMI influences some prognostic models, but it is not treated here as a reason to exclude UKA or as a universal modifier of every outcome.');
 if(+state.asa>=3)notes.push('Higher ASA increases absolute medical-risk context; this explorer does not force ASA into outcomes where the source evidence does not support it.');
 notes.push(bearingText);
 notes.push(provider);
 notes.push('Same-day discharge depends heavily on local anaesthetic, mobilisation and discharge pathways, so the displayed percentages are pathway benchmarks rather than a personal forecast.');
 $('scenarioNotes').innerHTML=notes.map(n=>`<div class="note">${n}</div>`).join('');
}
document.querySelectorAll('.segmented').forEach(group=>group.addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;group.querySelectorAll('button').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');state[group.dataset.input]=e.target.dataset.value;render()}));
['age','bmi','oks','volume','usage'].forEach(id=>$(id).addEventListener('input',render));
const presets={younger:{age:52,bmi:27,oks:18,volume:35,usage:25,sex:'male',asa:'1',bearing:'fixed'},typical:{age:65,bmi:28,oks:20,volume:30,usage:20,sex:'female',asa:'2',bearing:'fixed'},older:{age:80,bmi:29,oks:19,volume:30,usage:20,sex:'female',asa:'3',bearing:'fixed'}};
function applyPreset(x){const p=presets[x];Object.entries(p).forEach(([k,v])=>{if($(k))$(k).value=v;else state[k]=String(v)});document.querySelectorAll('.segmented').forEach(g=>g.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.value===state[g.dataset.input])));render()}
document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>applyPreset(b.dataset.preset)));
$('resetAll').addEventListener('click',()=>applyPreset('typical'));
render();