'use strict';
const assert=require('assert');
const M=require('./model.js');
let passed=0;
function test(name,fn){
  try{fn();passed++;process.stdout.write('✓ '+name+'\n');}
  catch(e){process.stderr.write('✗ '+name+'\n'+e.stack+'\n');process.exitCode=1;}
}
function near(a,b,tol=1e-9){assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);}

test('model metadata present',()=>{
  assert.strictEqual(M.MODEL_VERSION,'1.0.0-audit');
  assert.strictEqual(M.EVIDENCE_CUTOFF,'2026-09-12');
});

test('age-band boundaries',()=>{
  assert.strictEqual(M.ageBand(54),'<55');
  assert.strictEqual(M.ageBand(55),'55-64');
  assert.strictEqual(M.ageBand(64),'55-64');
  assert.strictEqual(M.ageBand(65),'65-74');
  assert.strictEqual(M.ageBand(74),'65-74');
  assert.strictEqual(M.ageBand(75),'75+');
});

const expectedRevision={
 '<55':{male:{tkr:6.04,fixed:9.00,mobile:17.06},female:{tkr:5.24,fixed:10.07,mobile:17.53}},
 '55-64':{male:{tkr:3.81,fixed:6.19,mobile:11.09},female:{tkr:3.46,fixed:7.18,mobile:12.56}},
 '65-74':{male:{tkr:2.55,fixed:4.26,mobile:7.84},female:{tkr:2.35,fixed:4.93,mobile:10.32}},
 '75+':{male:{tkr:1.71,fixed:2.93,mobile:5.75},female:{tkr:1.64,fixed:4.31,mobile:8.69}}
};

const expectedRevisionCI={
 '<55':{male:{tkr:[5.69,6.42],fixed:[8.02,10.08],mobile:[15.81,18.41]},female:{tkr:[4.97,5.53],fixed:[9.03,11.23],mobile:[16.40,18.74]}},
 '55-64':{male:{tkr:[3.67,3.95],fixed:[5.58,6.87],mobile:[10.45,11.78]},female:{tkr:[3.35,3.59],fixed:[6.43,8.00],mobile:[11.83,13.32]}},
 '65-74':{male:{tkr:[2.46,2.64],fixed:[3.73,4.86],mobile:[7.27,8.46]},female:{tkr:[2.28,2.43],fixed:[4.27,5.69],mobile:[9.61,11.08]}},
 '75+':{male:{tkr:[1.62,1.80],fixed:[2.15,3.97],mobile:[4.96,6.65]},female:{tkr:[1.57,1.72],fixed:[3.42,5.43],mobile:[7.74,9.76]}}
};

const representativeAge={'<55':50,'55-64':60,'65-74':70,'75+':80};
for(const [band,sexes] of Object.entries(expectedRevision)){
  for(const [sex,vals] of Object.entries(sexes)){
    for(const bearing of ['fixed','mobile']){
      test(`NJR 10y revision ${band} ${sex} ${bearing}`,()=>{
        const x=M.revisionEstimate(representativeAge[band],sex,bearing);
        near(x.uka,vals[bearing]);near(x.tkr,vals.tkr);near(x.excess,vals[bearing]-vals.tkr);assert.deepStrictEqual(x.ukaCI,expectedRevisionCI[band][sex][bearing]);assert.deepStrictEqual(x.tkrCI,expectedRevisionCI[band][sex].tkr);
      });
    }
  }
}

test('UKA revision exceeds TKR in every encoded stratum',()=>{
  for(const band of Object.keys(expectedRevision)) for(const sex of ['male','female']) for(const bearing of ['fixed','mobile']){
    assert.ok(expectedRevision[band][sex][bearing]>expectedRevision[band][sex].tkr);
  }
});

test('fixed-bearing revision is lower than mobile-bearing in every encoded stratum',()=>{
  for(const band of Object.keys(expectedRevision)) for(const sex of ['male','female']){
    assert.ok(expectedRevision[band][sex].fixed<expectedRevision[band][sex].mobile);
  }
});

test('revision declines with age within each sex and construct',()=>{
  for(const sex of ['male','female']) for(const k of ['tkr','fixed','mobile']){
    const xs=Object.keys(expectedRevision).map(b=>expectedRevision[b][sex][k]);
    for(let i=1;i<xs.length;i++) assert.ok(xs[i]<xs[i-1]);
  }
});

for(const [age,u,t] of [[65,2.1,2.9],[75,2.4,3.6],[85,3.2,5.5]]){
  test(`30-day safety published anchor age ${age}`,()=>{const x=M.safety30d(age);near(x.uka,u);near(x.tkr,t);});
}
test('30-day morbidity/mortality interpolates between anchors',()=>{const x=M.safety30d(70);near(x.uka,2.25);near(x.tkr,3.25);});
test('30-day morbidity/mortality does not extrapolate beyond source age range',()=>{
  const lo=M.safety30d(45),hi=M.safety30d(90);
  near(lo.uka,2.1);near(lo.tkr,2.9);near(hi.uka,3.2);near(hi.tkr,5.5);
});
test('UKA 30-day morbidity/mortality risk is lower at all supported integer ages',()=>{
  for(let a=65;a<=85;a++){const x=M.safety30d(a);assert.ok(x.uka<x.tkr);}
});

test('lifetime mixed-model youngest anchors',()=>{const x=M.lifetimeRevision(48);near(x.uka,40.4);near(x.tkr,22.4);});
test('lifetime mixed-model NJR age-67 anchors',()=>{const x=M.lifetimeRevision(67);near(x.uka,13.7);near(x.tkr,3.6);});
test('lifetime mixed-model oldest anchors',()=>{near(M.lifetimeRevision(88).uka,3.7);near(M.lifetimeRevision(92).tkr,1.15);});
test('lifetime risk is monotonic non-increasing across UI age range',()=>{
  let prev=M.lifetimeRevision(45);
  for(let a=46;a<=90;a++){const cur=M.lifetimeRevision(a);assert.ok(cur.uka<=prev.uka+1e-12);assert.ok(cur.tkr<=prev.tkr+1e-12);prev=cur;}
});
test('lifetime UKA estimate exceeds TKR across UI age range',()=>{
  for(let a=45;a<=90;a++){const x=M.lifetimeRevision(a);assert.ok(x.uka>x.tkr);}
});

test('medial lifetime exact published anchors',()=>{
  const expected=[[55,14.9,[12,19]],[65,10.7,[8,13]],[75,6.8,[5,9]],[85,3.7,[3,5]]];
  for(const [age,risk,ci] of expected){const x=M.medialLifetimeReference(age);near(x.risk,risk);assert.deepStrictEqual(x.ci,ci);}
});
test('medial lifetime interpolation is monotonic',()=>{
  let prev=M.medialLifetimeReference(55).risk;
  for(let a=56;a<=85;a++){const cur=M.medialLifetimeReference(a).risk;assert.ok(cur<=prev+1e-12);prev=cur;}
});

test('provider threshold: low caseload',()=>assert.strictEqual(M.providerContext(9,20),'low'));
test('provider threshold: very low usage',()=>assert.strictEqual(M.providerContext(30,4),'low'));
test('provider threshold: high usage and >=30 volume',()=>assert.strictEqual(M.providerContext(30,20),'favourable'));
test('provider threshold: >=10 volume and >=20 usage',()=>assert.strictEqual(M.providerContext(10,20),'moderateHighUsage'));
test('provider threshold: intermediate',()=>assert.strictEqual(M.providerContext(15,10),'intermediate'));

test('OKS helper sums 12 valid item scores',()=>assert.strictEqual(M.oksTotal(Array(12).fill(4)),48));
test('OKS helper supports zero total',()=>assert.strictEqual(M.oksTotal(Array(12).fill(0)),0));
test('OKS helper rejects incomplete arrays',()=>assert.strictEqual(M.oksTotal(Array(11).fill(4)),null));
test('OKS helper rejects invalid item scores',()=>assert.strictEqual(M.oksTotal([...Array(11).fill(4),5]),null));

test('FJS benchmark constants match evidence layer',()=>{near(M.benchmarks.fjs.rctDifference,14.1);assert.deepStrictEqual(M.benchmarks.fjs.rctCI,[9.5,18.6]);});
test('ROM benchmark constants match RCT',()=>{near(M.benchmarks.rom.twoYearDifferenceDeg,5.5);assert.deepStrictEqual(M.benchmarks.rom.ci,[3.6,7.4]);});
test('PJI comparative HR benchmark',()=>near(M.benchmarks.pji.adjustedHR,0.53));
test('randomized OKS time-course benchmarks',()=>{const x=M.benchmarks.oksComparative;near(x.twelveMonth.mukaMean,41.2);assert.deepStrictEqual(x.twelveMonth.mukaCI,[39.6,42.7]);near(x.twelveMonth.tkaMean,38.4);assert.deepStrictEqual(x.twelveMonth.tkaCI,[36.9,40.0]);near(x.twelveMonth.improvementDifference,3.2);assert.deepStrictEqual(x.twelveMonth.differenceCI,[0.9,5.6]);assert.strictEqual(x.twelveMonth.sourcePmid,34162649);near(x.twoYearEndpoint.mukaMean,41.2);near(x.twoYearEndpoint.tkaMean,40.1);near(x.twoYearEndpoint.difference,1.6);assert.deepStrictEqual(x.twoYearEndpoint.differenceCI,[-0.7,3.9]);near(x.twoYearAverage.improvementDifference,3.5);assert.deepStrictEqual(x.twoYearAverage.differenceCI,[2.3,4.7]);assert.strictEqual(x.twoYearAverage.sourcePmid,41662451);assert.deepStrictEqual(x.mcid,[4,5]);});
test('day-case comparative benchmark',()=>{assert.deepStrictEqual(M.benchmarks.dayCase.overall,{uka:42,tka:20});assert.deepStrictEqual(M.benchmarks.dayCase.eligibleEarly,{uka:72,tka:61});});
test('dedicated UKA day-case pooled benchmarks',()=>assert.deepStrictEqual(M.benchmarks.dayCase.ukaIntended,{overall:88,selected:91,unselected:76}));

process.on('exit',()=>{
  if(!process.exitCode) process.stdout.write(`\nAll ${passed} validation tests passed.\n`);
});


const scenarioCases=[
 {name:'young male fixed high-volume',x:{age:52,sex:'male',bmi:27,asa:1,preOks:18,bearing:'fixed',volume:35,usage:25},expect:{band:'<55',ukaRev:9.00,tkrRev:6.04,provider:'favourable'}},
 {name:'typical female fixed',x:{age:65,sex:'female',bmi:28,asa:2,preOks:20,bearing:'fixed',volume:30,usage:20},expect:{band:'65-74',ukaRev:4.93,tkrRev:2.35,provider:'favourable'}},
 {name:'older female mobile low-exposure',x:{age:80,sex:'female',bmi:29,asa:3,preOks:19,bearing:'mobile',volume:6,usage:4},expect:{band:'75+',ukaRev:8.69,tkrRev:1.64,provider:'low'}},
 {name:'boundary 55 male mobile',x:{age:55,sex:'male',bmi:30,asa:2,preOks:24,bearing:'mobile',volume:10,usage:20},expect:{band:'55-64',ukaRev:11.09,tkrRev:3.81,provider:'moderateHighUsage'}},
 {name:'boundary 75 female fixed',x:{age:75,sex:'female',bmi:35,asa:4,preOks:12,bearing:'fixed',volume:15,usage:10},expect:{band:'75+',ukaRev:4.31,tkrRev:1.64,provider:'intermediate'}}
];
for(const sc of scenarioCases){
 test('scenario regression: '+sc.name,()=>{
   const y=M.evaluateScenario(sc.x);
   assert.strictEqual(y.revision.band,sc.expect.band);
   near(y.revision.uka,sc.expect.ukaRev);near(y.revision.tkr,sc.expect.tkrRev);
   assert.strictEqual(y.provider,sc.expect.provider);
   assert.ok(y.safety.uka<y.safety.tkr);
   assert.ok(y.lifetime.uka>y.lifetime.tkr);
 });
}


test('lateral pooled 10-year revision benchmark',()=>{
 const x=M.lateralRevisionEstimate();
 near(x.uka,13.6);near(x.tkr,5.9);near(x.excess,7.7);near(x.adjustedSHR,2.3);assert.deepStrictEqual(x.adjustedSHRCI,[1.6,3.2]);
});
test('lateral contemporary five-year benchmark',()=>{
 assert.deepStrictEqual(M.benchmarks.lateral.contemporaryFiveYear,{lateral:7.3,tka:3.7,period:'2017–2022'});
});
test('lateral-specific RTS benchmark',()=>{
 const x=M.benchmarks.lateral.returnToSport;near(x.rate,92.4);assert.deepStrictEqual(x.ci,[81.5,97.1]);near(x.returnToPerformance,88.5);
});
test('lateral-specific gait OKS benchmark',()=>{
 assert.strictEqual(M.benchmarks.lateral.gait.oksLateral,44);assert.strictEqual(M.benchmarks.lateral.gait.oksTka,36);
});
test('PFA PAT randomized 12-month WOMAC benchmark',()=>{
 const x=M.benchmarks.pfa.patTrial;near(x.womac12mDifference,-1.2);assert.deepStrictEqual(x.womac12mCI,[-9.19,6.80]);
});
test('PFA PAT trial mid-term OKS interpretation',()=>{
 const x=M.benchmarks.pfa.patTrial;assert.strictEqual(x.oks24mDifference,'not significant');assert.strictEqual(x.oks60mDifference,'not significant');
});
test('PFA 2026 GRADE interpretation',()=>{
 const x=M.benchmarks.pfa.grade2026;assert.strictEqual(x.earlyProms,'favours PFA');assert.strictEqual(x.midLongProms,'converge');assert.strictEqual(x.revision,'higher PFA');
});
