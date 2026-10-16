/* QuadroLabel Visual Studio v21 — optical-only preferences; no project mutation. */
(function(){
'use strict';
const area=document.getElementById('previewArea'),deck=document.getElementById('qlVisualStudio'),rows=document.getElementById('boardRows');
if(!area||!deck||!rows)return;
const KEY='quadrolabel-visual-studio-v21';
const defaults={light:'day',camera:'front',strength:58,spotlight:false};
let state={...defaults};
try{
 const raw=JSON.parse(localStorage.getItem(KEY)||'null');
 if(raw&&typeof raw==='object'){
  if(['day','soft','dramatic'].includes(raw.light))state.light=raw.light;
  if(['front','left','right'].includes(raw.camera))state.camera=raw.camera;
  if(Number.isFinite(raw.strength))state.strength=Math.max(0,Math.min(100,Math.round(raw.strength)));
  if(typeof raw.spotlight==='boolean')state.spotlight=raw.spotlight;
 }
}catch(_){}
const field=id=>document.getElementById(id);
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){}}
function ensureLightOverlay(){
 const cabinet=area.querySelector('.cabinet');
 if(cabinet&&!cabinet.querySelector('.ql-vs-light-overlay')){
  const overlay=document.createElement('div');overlay.className='ql-vs-light-overlay';
  overlay.setAttribute('aria-hidden','true');cabinet.append(overlay);
 }
}
function selectable(){
 if(typeof circuits==='undefined'||!Array.isArray(circuits))return [];
 return circuits.map((c,i)=>({c,i})).filter(x=>!x.c.empty);
}
function selectedIndex(){
 const selected=rows.querySelector('.breaker.device-selected[data-inspect]');
 if(selected)return Number(selected.dataset.inspect);
 if(typeof selectedDeviceId!=='undefined'){
  const pair=selectable().find(x=>x.c.id===selectedDeviceId);
  if(pair)return pair.i;
 }
 return -1;
}
function location(i){
 if(typeof findDinPosition==='function'){
  const pos=findDinPosition(i);if(pos)return 'Trilho '+pos.rail+' · M'+pos.start+(pos.end>pos.start?'–M'+pos.end:'');
 }
 return 'Posição no quadro';
}
function detail(){
 const list=selectable(),index=selectedIndex();
 const record=list.find(x=>x.i===index),current=record?.c;
 const name=field('qlVsDeviceName'),meta=field('qlVsDeviceMeta'),fraction=field('qlVsDeviceCount');
 if(!name||!meta||!fraction)return;
 if(!current){
  name.textContent='Selecione um dispositivo no quadro';
  meta.textContent='Clique em um equipamento ou use os botões de navegação.';
  fraction.textContent=list.length+' equipamentos';
 }else{
  name.textContent=current.name||'Dispositivo sem descrição';
  const family=typeof hardwareTypes!=='undefined'?(hardwareTypes[current.device]||'Equipamento modular'):'Equipamento modular';
  meta.textContent=location(index)+' · '+(Number(current.poles)||1)+' M · '+family+(current.amp?' · '+String(current.amp):'');
  fraction.textContent=(list.findIndex(x=>x.i===index)+1)+' de '+list.length;
 }
 const has=list.length>0;
 ['qlVsPrevious','qlVsNext'].forEach(id=>{const btn=field(id);if(btn)btn.disabled=!has});
 area.classList.toggle('ql-vs-has-selection',!!current);
}
function sync(){
 ['day','soft','dramatic'].forEach(v=>area.classList.toggle('ql-vs-light-'+v,state.light===v));
 ['front','left','right'].forEach(v=>area.classList.toggle('ql-vs-camera-'+v,state.camera===v));
 area.classList.toggle('ql-vs-spotlight',state.spotlight);
 area.style.setProperty('--ql-vs-strength',String(state.strength/100));
 deck.querySelectorAll('[data-vs-light]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.vsLight===state.light)));
 deck.querySelectorAll('[data-vs-camera]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.vsCamera===state.camera)));
 const slider=field('qlVsStrength'),value=field('qlVsStrengthValue');
 if(slider&&Number(slider.value)!==state.strength)slider.value=String(state.strength);
 if(value)value.textContent=state.strength+'%';
 const focus=field('qlVsSpotlight');
 if(focus){focus.setAttribute('aria-pressed',String(state.spotlight));focus.textContent=state.spotlight?'◎ Remover destaque':'◉ Destacar dispositivo';}
 const scene=field('qlVsSceneStatus');
 if(scene)scene.textContent={day:'Luz de oficina',soft:'Luz suave',dramatic:'Luz cênica'}[state.light];
 const live=area.classList.contains('ql-real-panel');
 deck.querySelectorAll('[data-vs-light],[data-vs-camera],#qlVsStrength,#qlVsSpotlight').forEach(x=>x.disabled=!live);
 ensureLightOverlay();detail();
}
function navigate(delta){
 const list=selectable();if(!list.length)return;
 const index=selectedIndex(),current=list.findIndex(x=>x.i===index);
 let pos=current<0?(delta<0?list.length-1:0):(current+delta+list.length)%list.length;
 const next=list[pos];
 if(typeof qlLocateCircuit==='function')qlLocateCircuit(next.i);
 else {
  const target=rows.querySelector('[data-inspect="'+next.i+'"]');
  if(target)target.click();
 }
 detail();
}
deck.addEventListener('click',e=>{
 const light=e.target.closest('[data-vs-light]');
 if(light){state.light=light.dataset.vsLight;persist();sync();return}
 const cam=e.target.closest('[data-vs-camera]');
 if(cam){
  state.camera=cam.dataset.vsCamera;
  const oldView=field('cabinetView');
  if(oldView&&oldView.value!=='front'){oldView.value='front';oldView.dispatchEvent(new Event('change',{bubbles:true}));}
  persist();sync();return;
 }
 if(e.target.closest('#qlVsPrevious')){navigate(-1);return}
 if(e.target.closest('#qlVsNext')){navigate(1);return}
 if(e.target.closest('#qlVsSpotlight')){
  const enabling=!state.spotlight;
  state.spotlight=enabling;
  if(enabling&&selectedIndex()<0&&selectable().length)navigate(1);
  persist();sync();return;
 }
});
field('qlVsStrength').addEventListener('input',e=>{
 state.strength=Math.max(0,Math.min(100,Number(e.target.value)||0));persist();sync();
});
window.qlVisualStudioRefresh=()=>{ensureLightOverlay();sync()};
window.qlVisualStudioRefresh();
})();
