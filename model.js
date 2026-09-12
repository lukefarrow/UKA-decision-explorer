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

  const benchmarks={
    fjs:{direction:'uka',range:[6,14],rctDifference:14.1,rctCI:[9.5,18.6]},
    rom:{direction:'uka',twoYearDifferenceDeg:5.5,ci:[3.6,7.4]},
    pji:{ukaObservedPct:0.4,tkaObservedPct:0.8,adjustedHR:0.53},
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
    const row=revision10y[band][sex];
    return {band,uka:row[bearing],tkr:row.tkr,excess:row[bearing]-row.tkr};
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
    const ages=[65,75,85],uka=[2.1,2.4,3.2],tkr=[2.9,3.6,5.5];
    const a=clamp(age,65,85);
    const i=a<=75?0:1;
    const f=(a-ages[i])/(ages[i+1]-ages[i]);
    return {
      uka:uka[i]+f*(uka[i+1]-uka[i]),
      tkr:tkr[i]+f*(tkr[i+1]-tkr[i]),
      label:age<65?'≤65 reference':age>85?'≥85 reference':'age-adjusted'
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

  function oksTotal(items){
    if(!Array.isArray(items)||items.length!==12) return null;
    const nums=items.map(Number);
    if(nums.some(v=>!Number.isInteger(v)||v<0||v>4)) return null;
    return nums.reduce((a,b)=>a+b,0);
  }

  return {
    MODEL_VERSION,EVIDENCE_CUTOFF,revision10y,benchmarks,
    clamp,lerp,ageBand,revisionEstimate,ukaOksReference,tkrOksReference,
    safety30d,lifetimeRevision,providerContext,oksTotal
  };
});
