(function(root,factory){
  const api=factory();
  if(typeof module==='object' && module.exports) module.exports=api;
  root.UKAModel=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const MODEL_VERSION='1.0.0-audit';
  const EVIDENCE_CUTOFF='2026-09-12';

  const revision10y={
    '<55':{
      male:{tkr:6.04,fixed:9.00,mobile:17.06},
      female:{tkr:5.24,fixed:10.07,mobile:17.53}
    },
    '55-64':{
      male:{tkr:3.81,fixed:6.19,mobile:11.09},
      female:{tkr:3.46,fixed:7.18,mobile:12.56}
    },
    '65-74':{
      male:{tkr:2.55,fixed:4.26,mobile:7.84},
      female:{tkr:2.35,fixed:4.93,mobile:10.32}
    },
    '75+':{
      male:{tkr:1.71,fixed:2.93,mobile:5.75},
      female:{tkr:1.64,fixed:4.31,mobile:8.69}
    }
  };

  const revision10yCI={
    '<55':{
      male:{tkr:[5.69,6.42],fixed:[8.02,10.08],mobile:[15.81,18.41]},
      female:{tkr:[4.97,5.53],fixed:[9.03,11.23],mobile:[16.40,18.74]}
    },
    '55-64':{
      male:{tkr:[3.67,3.95],fixed:[5.58,6.87],mobile:[10.45,11.78]},
      female:{tkr:[3.35,3.59],fixed:[6.43,8.00],mobile:[11.83,13.32]}
    },
    '65-74':{
      male:{tkr:[2.46,2.64],fixed:[3.73,4.86],mobile:[7.27,8.46]},
      female:{tkr:[2.28,2.43],fixed:[4.27,5.69],mobile:[9.61,11.08]}
    },
    '75+':{
      male:{tkr:[1.62,1.80],fixed:[2.15,3.97],mobile:[4.96,6.65]},
      female:{tkr:[1.57,1.72],fixed:[3.42,5.43],mobile:[7.74,9.76]}
    }
  };

  const lateralRevision10y={
    '<55':{male:{tkr:6.04,fixed:11.06,mobile:19.09},female:{tkr:5.24,fixed:12.52,mobile:17.78}},
    '55-64':{male:{tkr:3.81,fixed:6.43,mobile:16.07},female:{tkr:3.46,fixed:6.66,mobile:11.97}},
    '65-74':{male:{tkr:2.55,fixed:9.48,mobile:18.53},female:{tkr:2.35,fixed:6.51,mobile:8.20}},
    '75+':{male:{tkr:1.71,fixed:5.81,mobile:10.84},female:{tkr:1.64,fixed:7.08,mobile:9.77}}
  };
  const lateralRevision10yCI={
    '<55':{male:{tkr:[5.69,6.42],fixed:[7.96,15.25],mobile:[13.31,26.97]},female:{tkr:[4.97,5.53],fixed:[9.24,16.85],mobile:[12.64,24.71]}},
    '55-64':{male:{tkr:[3.67,3.95],fixed:[3.97,10.33],mobile:[10.43,24.33]},female:{tkr:[3.35,3.59],fixed:[4.46,9.89],mobile:[8.30,17.09]}},
    '65-74':{male:{tkr:[2.46,2.64],fixed:[5.68,15.60],mobile:[11.88,28.26]},female:{tkr:[2.28,2.43],fixed:[4.14,10.17],mobile:[5.36,12.44]}},
    '75+':{male:{tkr:[1.62,1.80],fixed:[2.49,13.24],mobile:[5.02,22.58]},female:{tkr:[1.57,1.72],fixed:[4.18,11.87],mobile:[6.14,15.36]}}
  };
  const pfaRevision10y={
    '<55':{male:{tkr:6.04,pfa:21.05},female:{tkr:5.24,pfa:17.49}},
    '55-64':{male:{tkr:3.81,pfa:19.78},female:{tkr:3.46,pfa:17.05}},
    '65-74':{male:{tkr:2.55,pfa:16.91},female:{tkr:2.35,pfa:15.89}},
    '75+':{male:{tkr:1.71,pfa:7.61},female:{tkr:1.64,pfa:8.75}}
  };
  const pfaRevision10yCI={
    '<55':{male:{tkr:[5.69,6.42],pfa:[18.68,23.69]},female:{tkr:[4.97,5.53],pfa:[16.38,18.67]}},
    '55-64':{male:{tkr:[3.67,3.95],pfa:[17.38,22.46]},female:{tkr:[3.35,3.59],pfa:[15.79,18.39]}},
    '65-74':{male:{tkr:[2.46,2.64],pfa:[14.22,20.06]},female:{tkr:[2.28,2.43],pfa:[14.32,17.60]}},
    '75+':{male:{tkr:[1.62,1.80],pfa:[5.11,11.27]},female:{tkr:[1.57,1.72],pfa:[7.10,10.77]}}
  };

  const benchmarks={
    oksComparative:{direction:'uka',timepointMonths:12,mukaMean:41.2,mukaCI:[39.6,42.7],tkaMean:38.4,tkaCI:[36.9,40.0],improvementDifference:3.2,differenceCI:[0.9,5.6],mcid:[4,5],twoYearAverageDifference:3.5,twoYearAverageCI:[2.3,4.7]},
    fjs:{direction:'uka',range:[6,14],rctDifference:14.1,rctCI:[9.5,18.6]},
    rom:{direction:'uka',twoYearDifferenceDeg:5.5,ci:[3.6,7.4]},
    pji:{ukaObservedPct:0.4,tkaObservedPct:0.8,adjustedHR:0.53},
    lateral:{
      tenYearRegistryContext:{danishAllEraLuka:13.6,danishAllEraTka:5.9,adjustedSHR:2.3},
      returnToSport:{rate:92.4,ci:[81.5,97.1],returnToPerformance:88.5,returnToPerformanceCI:[75.1,95.1]},
      gait:{direction:'lateral',oksLateral:44,oksTka:36}
    },
    pfa:{
      rct6yOksImprovementDifference:5,rct6yOksDifferenceCI:[2,8],
      rct5yRomDifferenceDeg:7,rct5yRomCI:[1,13],
      rct6yRevision:{pfa:10,tka:4,pfaCI:[4,20],tkaCI:[1,12]},
      returnToSportRange:[64.7,91],
      contemporaryRegistryTenYearRevision:18.5,
      contemporaryRegistryTenYearRevisionCI:[17.75,19.3]
    },
    dayCase:{
      overall:{uka:42,tka:20},
      eligibleEarly:{uka:72,tka:61},
      ukaIntended:{overall:88,selected:91,unselected:76}
    }
  };

  function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
  function lerp(x,x1,y1,x2,y2){return y1+(x-x1)*(y2-y1)/(x2-x1);}
  function ageBand(age){return age<55?'<55':age<65?'55-64':age<75?'65-74':'75+';}

  function revisionEstimate(age,sex,bearing){

    const band=ageBand(age);
    if(!revision10y[band] || !revision10y[band][sex]) throw new Error('Invalid sex or age');
    if(!['fixed','mobile'].includes(bearing)) throw new Error('Invalid bearing');
    const row=revision10y[band][sex],ci=revision10yCI[band][sex];
    return {band,uka:row[bearing],tkr:row.tkr,ukaCI:ci[bearing],tkrCI:ci.tkr,excess:row[bearing]-row.tkr};
  }

  function lateralRevisionEstimate(age,sex,bearing){
    const band=ageBand(age),row=lateralRevision10y[band][sex],ci=lateralRevision10yCI[band][sex];
    if(!['fixed','mobile'].includes(bearing)) throw new Error('Invalid bearing');
    return {band,uka:row[bearing],tkr:row.tkr,ukaCI:ci[bearing],tkrCI:ci.tkr,excess:row[bearing]-row.tkr};
  }

  function pfaRevisionEstimate(age,sex){
    const band=ageBand(age),row=pfaRevision10y[band][sex],ci=pfaRevision10yCI[band][sex];
    return {band,pfa:row.pfa,tkr:row.tkr,pfaCI:ci.pfa,tkrCI:ci.tkr,excess:row.pfa-row.tkr};
  }

  // Reconstructed UKA 6-month OKS reference, not the original published full prediction equation.
  function ukaOksReference(age,preOks){
    const ageAdj=age<=75?0.14*(age-65):0.14*10-0.18*(age-75);
    return clamp(37.5+0.24*(preOks-21.9)+ageAdj,0,48);
  }

  // Reduced/reference-profile application of Sanchez-Santos et al.
  // Omitted predictors are held at the favourable/reference category:
  // IMD contribution=0, no anxiety/depression, no previous arthroscopy,
  // no other mobility condition, no fixed flexion deformity, intact ACL.
  function tkrOksReference(age,sex,bmi,asa,preOks){
    const ageMain=age<60?0:age<70?0.8:age<80?1.4:-2.5;
    const maleInteraction=age<60?0:age<70?4.8:age<80?4.3:8.1;
    let x=32.9+ageMain-1.5*(bmi/10)+0.4*preOks+(Number(asa)>=3?-2:0);
    if(sex==='male') x+=-4.8+maleInteraction;
    return clamp(x,0,48);
  }

  function safety30d(age){
    const ages=[65,75,85],uka=[2.1,2.4,3.2],tkr=[2.9,3.6,5.5],ukaLo=[1.8,2.0,2.3],ukaHi=[2.3,2.8,4.1],tkrLo=[2.7,3.3,4.7],tkrHi=[3.0,3.8,6.3];
    const a=clamp(age,65,85);
    const i=a<=75?0:1;
    const f=(a-ages[i])/(ages[i+1]-ages[i]);
    return {
      uka:uka[i]+f*(uka[i+1]-uka[i]),
      tkr:tkr[i]+f*(tkr[i+1]-tkr[i]),
      ukaCI:[ukaLo[i]+f*(ukaLo[i+1]-ukaLo[i]),ukaHi[i]+f*(ukaHi[i+1]-ukaHi[i])],
      tkrCI:[tkrLo[i]+f*(tkrLo[i+1]-tkrLo[i]),tkrHi[i]+f*(tkrHi[i+1]-tkrHi[i])],
      label:age<65?'≤65 published reference':age>85?'≥85 published reference':'age-interpolated published risk'
    };
  }

  // Hybrid age interpolation for research display only; not a validated competing-risk model.
  function lifetimeRevision(age){
    const a=clamp(age,48,92);
    let uka,tkr;
    if(a<=67){
      uka=lerp(a,48,40.4,67,13.7);
      tkr=lerp(a,48,22.4,67,3.6);
    } else {
      uka=a>=88?3.7:lerp(a,67,13.7,88,3.7);
      tkr=lerp(a,67,3.6,92,1.15);
    }
    return {uka:Math.max(0,uka),tkr:Math.max(0,tkr)};
  }

  function providerContext(volume,usage){
    if(volume>=30&&usage>=20) return 'favourable';
    if(volume<10||usage<5) return 'low';
    if(volume>=10&&usage>=20) return 'moderateHighUsage';
    return 'intermediate';
  }

  function evaluateScenario(x){
    const revision=revisionEstimate(x.age,x.sex,x.bearing);
    return {
      revision,
      ukaOks:ukaOksReference(x.age,x.preOks),
      tkrOks:tkrOksReference(x.age,x.sex,x.bmi,x.asa,x.preOks),
      safety:safety30d(x.age),
      lifetime:lifetimeRevision(x.age),
      provider:providerContext(x.volume,x.usage)
    };
  }

  function oksTotal(items){
    if(!Array.isArray(items)||items.length!==12) return null;
    const nums=items.map(Number);
    if(nums.some(v=>!Number.isInteger(v)||v<0||v>4)) return null;
    return nums.reduce((a,b)=>a+b,0);
  }

  return {
    MODEL_VERSION,EVIDENCE_CUTOFF,revision10y,revision10yCI,lateralRevision10y,lateralRevision10yCI,pfaRevision10y,pfaRevision10yCI,benchmarks,
    clamp,lerp,ageBand,revisionEstimate,lateralRevisionEstimate,pfaRevisionEstimate,ukaOksReference,tkrOksReference,
    safety30d,lifetimeRevision,providerContext,evaluateScenario,oksTotal
  };
});
