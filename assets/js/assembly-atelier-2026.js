/* QuadroLabel Estúdio de Montagem — controles puramente visuais. */
(function(){
 'use strict';
 const root=document.getElementById('previewArea'),panel=document.getElementById('qlAtelier'),board=document.getElementById('boardRows');
 if(!root||!panel||!board)return;
 const key='quadrolabel-atelier-2026',base={mode:'studio',ducts:true,terminals:true,fixings:true,uncovered:false};
 let state={...base};
 try{let x=JSON.parse(localStorage.getItem(key));if(x&&typeof x==='object'){if(['studio','inspection','expanded'].includes(x.mode))state.mode=x.mode;for(const f of ['ducts','terminals','fixings','uncovered'])if(typeof x[f]==='boolean')state[f]=x[f]}}catch(_){}
 function store(){try{localStorage.setItem(key,JSON.stringify(state))}catch(_){}}
 function div(cls){let a=document.createElement('div');a.className=cls;return a}
 function initialize(){
  const cab=root.querySelector('.cabinet'),up=cab?.querySelector('.ql-panel-upper'),tray=cab?.querySelector('.ql-panel-tray');
  if(!cab||!up||!tray)return;
  if(!cab.querySelector('.ql-at-backplate'))cab.prepend(div('ql-at-backplate'));
  if(!cab.querySelector('.ql-at-fasteners')){
   let a=div('ql-at-fasteners');a.setAttribute('aria-hidden','true');for(let i=0;i<4;i++){let x=document.createElement('i');x.className='ql-at-screw';a.append(x)}cab.append(a);
  }
  if(!cab.querySelector('.ql-at-terminal-bank')){
   let bank=div('ql-at-terminal-bank');bank.setAttribute('aria-label','Bornes genéricos, sem ligações definidas');
   bank.innerHTML='<div class="ql-at-bank-title"><strong>BORNES AUXILIARES</strong><small>Ilustração sem conexões</small></div><div class="ql-at-bridge" aria-hidden="true">'+Array.from({length:8},(_,i)=>'<div class="ql-at-terminal '+(i<2?'blue':i<4?'pe':'')+'"><span>'+(i<2?'N':i<4?'PE':'A'+(i-3))+'</span></div>').join('')+'</div><small class="ql-at-bank-caption">SEM LIGAÇÕES</small>';
   up.insertAdjacentElement('afterend',bank);
  }
  if(!cab.querySelector('.ql-at-duct-top')){
   let d=div('ql-at-duct-top');d.setAttribute('aria-hidden','true');tray.insertAdjacentElement('beforebegin',d);
  }
 }
 function rows(){
  board.querySelectorAll('.rack-row').forEach((row,i)=>{
    let rail=row.querySelector('.rail');if(!rail)return;
    if(!rail.querySelector('.ql-at-rail-clamps')){
      let a=div('ql-at-rail-clamps');a.setAttribute('aria-hidden','true');a.innerHTML='<i></i><i></i>';rail.append(a);
      let tag=document.createElement('small');tag.className='ql-at-microlabel';tag.textContent='DIN '+String(i+1).padStart(2,'0');rail.append(tag);
    }
  });
  board.querySelectorAll('.ql-panel-interrail').forEach(el=>{
    if(!el.querySelector('.ql-at-midduct')){let d=div('ql-at-midduct');d.setAttribute('aria-hidden','true');el.append(d);}
  });
  const summary=document.getElementById('qlAtSummary');
  if(summary){let rails=board.querySelectorAll('.rack-row').length,items=board.querySelectorAll('.rack-row .breaker').length;
    summary.innerHTML='<span><strong>'+rails+'</strong> trilho(s) visualizados</span><span><strong>'+items+'</strong> dispositivos no quadro</span><span>Alterações <strong>somente visuais</strong></span>';}
 }
 function sync(){
  root.classList.toggle('ql-at-inspection',state.mode==='inspection');
  root.classList.toggle('ql-at-expanded',state.mode==='expanded');
  root.classList.toggle('ql-at-hide-ducts',!state.ducts);
  root.classList.toggle('ql-at-hide-fix',!state.fixings);
  root.classList.toggle('ql-at-uncovered',state.uncovered&&state.ducts);
  root.querySelectorAll('.ql-at-terminal-bank').forEach(el=>el.hidden=!state.terminals);
  let real=root.classList.contains('ql-real-panel');
  panel.querySelectorAll('[data-at-mode]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.atMode===state.mode));b.disabled=!real});
  panel.querySelectorAll('[data-at-layer]').forEach(x=>{let f=x.dataset.atLayer;x.checked=Boolean(state[f]);x.disabled=!real||(f==='uncovered'&&!state.ducts)});
  document.getElementById('qlAtCurrent').textContent={studio:'Oficina',inspection:'Inspeção',expanded:'Expandida'}[state.mode];
 }
 panel.addEventListener('click',event=>{const b=event.target.closest('[data-at-mode]');if(!b)return;state.mode=b.dataset.atMode;store();sync()});
 panel.addEventListener('change',event=>{const x=event.target.closest('[data-at-layer]');if(!x)return;state[x.dataset.atLayer]=x.checked;store();sync()});
 window.qlRefreshAtelier=function(){initialize();rows();sync()};
 window.qlRefreshAtelier();
})();
