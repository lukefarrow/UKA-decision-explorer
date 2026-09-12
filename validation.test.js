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
const representativeAge={'<55':50,'55-64':60,'65-74':70,'75+':80};
for(const [band,sexes] of Object.entries(expectedRevision)){
  for(const [sex,vals] of Object.entries(sexes)){
    for(const bearing of ['fixed','mobile']){
      test(`NJR 10y revision ${band} ${sex} ${bearing}`,()=>{
        const x=M.revisionEstimate(representativeAge[band],sex,bearing);
        near(x.uka,vals[bearing]);near(x.tkr,vals.tkr);near(x.excess,vals[bearing]-vals.tkr);
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

test('UKA OKS reference anchor',()=>near(M.ukaOksReference(65,21.9),37.5));
test('UKA OKS baseline coefficient',()=>near(M.ukaOksReference(65,31.9),39.9));
test('UKA OKS age coefficient through 75',()=>near(M.ukaOksReference(75,21.9),38.9));
test('UKA OKS post-75 slope',()=>near(M.ukaOksReference(85,21.9),37.1));
test('UKA OKS remains bounded 0-48',()=>{
  for(const age of [45,65,75,90]) for(const pre of [0,48]) {
    const x=M.ukaOksReference(age,pre);assert.ok(x>=0&&x<=48);
  }
});

test('TKR reduced model typical female scenario',()=>near(M.tkrOksReference(65,'female',28,2,20),37.5));
test('TKR reduced model BMI coefficient is -1.5 per 10 BMI units',()=>{
  near(M.tkrOksReference(65,'female',38,2,20)-M.tkrOksReference(65,'female',28,2,20),-1.5);
});
test('TKR reduced model baseline OKS coefficient is +0.4 per point',()=>{
  near(M.tkrOksReference(65,'female',28,2,30)-M.tkrOksReference(65,'female',28,2,20),4.0);
});
test('TKR reduced model ASA3/4 penalty is -2',()=>{
  near(M.tkrOksReference(65,'female',28,3,20)-M.tkrOksReference(65,'female',28,2,20),-2);
});
test('TKR reduced model age-sex interaction at 65 offsets male main effect',()=>{
  near(M.tkrOksReference(65,'male',28,2,20),M.tkrOksReference(65,'female',28,2,20));
});
test('TKR OKS remains bounded 0-48',()=>{
  for(const age of [45,65,75,90]) for(const sex of ['male','female']) for(const bmi of [18,45]) for(const asa of [1,4]) for(const pre of [0,48]){
    const x=M.tkrOksReference(age,sex,bmi,asa,pre);assert.ok(x>=0&&x<=48);
  }
});

for(const [age,u,t] of [[65,2.1,2.9],[75,2.4,3.6],[85,3.2,5.5]]){
  test(`30-day safety published anchor age ${age}`,()=>{const x=M.safety30d(age);near(x.uka,u);near(x.tkr,t);});
}
test('30-day safety interpolates between anchors',()=>{const x=M.safety30d(70);near(x.uka,2.25);near(x.tkr,3.25);});
test('30-day safety does not extrapolate beyond source age range',()=>{
  const lo=M.safety30d(45),hi=M.safety30d(90);
  near(lo.uka,2.1);near(lo.tkr,2.9);near(hi.uka,3.2);near(hi.tkr,5.5);
});
test('UKA early safety is better at all supported integer ages',()=>{
  for(let a=65;a<=85;a++){const x=M.safety30d(a);assert.ok(x.uka<x.tkr);}
});

test('lifetime anchor age 48',()=>{const x=M.lifetimeRevision(48);near(x.uka,40.4);near(x.tkr,22.4);});
test('lifetime hybrid anchor age 67',()=>{const x=M.lifetimeRevision(67);near(x.uka,13.7);near(x.tkr,3.6);});
test('lifetime UKA oldest anchor/cap',()=>{near(M.lifetimeRevision(88).uka,3.7);near(M.lifetimeRevision(90).uka,3.7);});
test('lifetime TKR oldest anchor',()=>near(M.lifetimeRevision(92).tkr,1.15));
test('lifetime risk is monotonic non-increasing across UI age range',()=>{
  let prev=M.lifetimeRevision(45);
  for(let a=46;a<=90;a++){const cur=M.lifetimeRevision(a);assert.ok(cur.uka<=prev.uka+1e-12);assert.ok(cur.tkr<=prev.tkr+1e-12);prev=cur;}
});
test('lifetime UKA estimate exceeds TKR across UI age range',()=>{
  for(let a=45;a<=90;a++){const x=M.lifetimeRevision(a);assert.ok(x.uka>x.tkr);}
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
test('day-case comparative benchmark',()=>{assert.deepStrictEqual(M.benchmarks.dayCase.overall,{uka:42,tka:20});assert.deepStrictEqual(M.benchmarks.dayCase.eligibleEarly,{uka:72,tka:61});});
test('dedicated UKA day-case pooled benchmarks',()=>assert.deepStrictEqual(M.benchmarks.dayCase.ukaIntended,{overall:88,selected:91,unselected:76}));

process.on('exit',()=>{
  if(!process.exitCode) process.stdout.write(`\nAll ${passed} validation tests passed.\n`);
});
