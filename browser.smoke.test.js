'use strict';

const assert=require('assert');
const path=require('path');
const {JSDOM,VirtualConsole}=require('jsdom');

async function loadApp(){
  const errors=[];
  const vc=new VirtualConsole();
  vc.on('jsdomError',e=>errors.push(e));
  vc.on('error',e=>errors.push(e));

  const dom=await JSDOM.fromFile(path.join(__dirname,'index.html'),{
    runScripts:'dangerously',
    resources:'usable',
    url:'file://'+path.join(__dirname,'index.html'),
    pretendToBeVisual:true,
    virtualConsole:vc
  });

  await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('Timed out loading app')),5000);
    dom.window.addEventListener('load',()=>{clearTimeout(timer);setTimeout(resolve,50);},{once:true});
  });

  if(errors.length) throw errors[0];
  return dom;
}

function click(dom,selector){
  const el=dom.window.document.querySelector(selector);
  assert.ok(el,'Missing element: '+selector);
  el.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
}

function text(dom,selector){
  const el=dom.window.document.querySelector(selector);
  assert.ok(el,'Missing element: '+selector);
  return el.textContent;
}

(async()=>{
  const dom=await loadApp();
  const d=dom.window.document;

  assert.ok(dom.window.UKAModel,'UKAModel not loaded');
  assert.ok(d.querySelector('#outcomesGrid').children.length>0,'Initial medial module did not render');
  assert.match(text(dom,'#comparisonTitle'),/Medial UKA vs TKR/);

  click(dom,'[data-input="module"] button[data-value="lateral"]');
  assert.match(text(dom,'#comparisonTitle'),/Lateral UKA vs TKR/);
  assert.match(text(dom,'#tradeoffRows'),/13\.6% vs 5\.9%/);
  assert.doesNotMatch(text(dom,'#outcomesGrid'),/mobile bearing|mobile-bearing/i);
  assert.ok(d.querySelector('#bearingField').style.display==='none','Bearing control should be hidden for lateral module');

  click(dom,'[data-input="module"] button[data-value="pfa"]');
  assert.match(text(dom,'#comparisonTitle'),/Patellofemoral arthroplasty vs TKR/);
  assert.match(text(dom,'#outcomesGrid'),/PAT randomized trial/);
  assert.doesNotMatch(text(dom,'#outcomesGrid'),/mobile bearing|mobile-bearing/i);
  assert.ok(d.querySelector('#bearingField').style.display==='none','Bearing control should be hidden for PFA module');

  click(dom,'[data-input="module"] button[data-value="medial"]');
  assert.match(text(dom,'#comparisonTitle'),/Medial UKA vs TKR/);
  assert.ok(d.querySelector('#bearingField').style.display!=='none','Bearing control should be visible for medial module');

  assert.doesNotMatch(text(dom,'#outcomesGrid'),/Mobile-bearing medial UKA reference/,'Oxford mobile-bearing lifetime reference should be hidden for fixed bearing');
  click(dom,'[data-input="bearing"] button[data-value="mobile"]');
  assert.match(text(dom,'#outcomesGrid'),/Mobile-bearing medial UKA reference/,'Oxford mobile-bearing lifetime reference should appear for mobile bearing');
  click(dom,'[data-input="bearing"] button[data-value="fixed"]');

  const age=d.querySelector('#age');
  age.value='75';
  age.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
  assert.match(text(dom,'#ageOut'),/75 years/);
  assert.ok(d.querySelector('#outcomesGrid').children.length>0,'Medial rerender failed after input change');

  console.log('✓ Browser smoke test loaded and rendered medial, lateral, and PFA modules');
})().catch(err=>{
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});
