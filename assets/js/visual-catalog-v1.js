/* QuadroLabel Studio — Catálogo Visual DIN, v1. Sem dependências externas. */
(function(){
'use strict';
var grid=document.getElementById('quickLibrary');
var input=document.getElementById('quickLibrarySearch');
var count=document.getElementById('quickLibraryCount');
if(!grid||!input||!count||typeof hardwareSVG!=='function')return;
var DATA=[
 {kind:'mcb',name:'Disjuntor termomagnético',short:'Disjuntor',group:'protection',widths:[1,2,3,4],polarity:'width',tags:'mcb minidisjuntor protecao'},
 {kind:'idr',name:'Interruptor diferencial residual',short:'DR / IDR',group:'protection',widths:[2,4],polarity:'width',tags:'diferencial residual choque tipo a ac'},
 {kind:'dps',name:'Dispositivo de proteção contra surtos',short:'DPS',group:'protection',widths:[1,2,3,4],polarity:'width',tags:'surto transitorio raio descarga'},
 {kind:'isolator',name:'Chave seccionadora modular',short:'Seccionadora',group:'protection',widths:[1,2,3,4],polarity:'width',tags:'chave isolamento interruptor geral'},
 {kind:'protector',name:'Proteção de tensão',short:'Protetor V',group:'protection',widths:[1,2,3],polarity:1,tags:'protetor sub tensao sobre tensao monitor'},
 {kind:'contactor',name:'Contator modular',short:'Contator',group:'control',widths:[1,2,3,4],polarity:2,tags:'rele contato bobina comando'},
 {kind:'timer',name:'Temporizador DIN',short:'Temporizador',group:'control',widths:[1,2],polarity:1,tags:'timer relogio atraso tempo'},
 {kind:'voltageRelay',name:'Relé monitor de tensão',short:'Relé de tensão',group:'control',widths:[1,2,3],polarity:1,tags:'rele monitor fase sub sobre'},
 {kind:'meter',name:'Medidor de energia DIN',short:'Medidor kWh',group:'measurement',widths:[1,2,3,4,6],polarity:1,tags:'medidor contador energia consumo kwh'},
 {kind:'powerSupply',name:'Fonte de alimentação DIN',short:'Fonte DIN',group:'automation',widths:[2,3,4,6],polarity:1,tags:'fonte alimentacao dc 12v 24v'},
 {kind:'automation',name:'Controlador de automação DIN',short:'Automação',group:'automation',widths:[2,4,6,8],polarity:1,tags:'smart relé programavel automacao iot esp32'}
];
var entries=DATA.flatMap(function(f){
 return f.widths.map(function(w){
  return {id:f.kind+'-'+w,kind:f.kind,name:f.name,short:f.short,group:f.group,width:w,
   poles:f.polarity==='width'?Math.min(4,w):f.polarity,search:(f.short+' '+f.name+' '+f.kind+' '+f.tags+' '+w+' modulo '+w+' modulos '+w+'m').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()};
 });
});
var STORE='quadrolabel_visual_catalog_v1';
var saved={favorites:[],recent:[]};
try{var loaded=JSON.parse(localStorage.getItem(STORE)||'{}');if(Array.isArray(loaded.favorites))saved.favorites=loaded.favorites.filter(function(id){return entries.some(function(e){return e.id===id})});if(Array.isArray(loaded.recent))saved.recent=loaded.recent.filter(function(id){return entries.some(function(e){return e.id===id})}).slice(0,8)}catch(err){}
function remember(){try{localStorage.setItem(STORE,JSON.stringify(saved))}catch(err){}}
var view='all',width='all';
function simplify(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
var views=[
 ['all','Todos'],['protection','Proteção'],['control','Comando'],
 ['measurement','Medição'],['automation','Automação'],['favorites','★ Favoritos'],['recent','◷ Recentes']
];
var toolbar=document.createElement('div');
toolbar.className='ql-vc-toolbar';
toolbar.setAttribute('aria-label','Filtros da biblioteca de dispositivos');
toolbar.innerHTML='<div class="ql-vc-heading"><div><span>ACERVO VISUAL · DIN</span><strong>'+entries.length+' configurações ilustrativas</strong></div><span class="ql-vc-version">BIBLIOTECA PRO</span></div>'+
 '<div class="ql-vc-filters" role="group" aria-label="Filtrar por família">'+
 views.map(function(v){return '<button type="button" data-ql-view="'+v[0]+'" aria-pressed="'+(v[0]==='all')+'">'+v[1]+'</button>'}).join('')+
 '</div><div class="ql-vc-options"><label for="qlVcWidth">Largura DIN<select id="qlVcWidth"><option value="all">Todas as larguras</option>'+
 [1,2,3,4,6,8].map(function(n){return '<option value="'+n+'">'+n+' módulo'+(n>1?'s':'')+'</option>'}).join('')+
 '</select></label><small>Desenhos conceituais · largura do equipamento não determina sua quantidade de polos</small></div>';
grid.parentNode.insertBefore(toolbar,grid);
grid.classList.add('ql-vc-grid');
var empty=document.createElement('div');
empty.className='ql-vc-empty';
empty.hidden=true;
grid.insertAdjacentElement('afterend',empty);
function variantMarkup(item){
 var favorite=saved.favorites.indexOf(item.id)!==-1;
 var groupLabel={protection:'PROTEÇÃO',control:'COMANDO',measurement:'MEDIÇÃO',automation:'AUTOMAÇÃO'}[item.group];
 return '<article class="ql-vc-card" data-ql-catalog-id="'+item.id+'" data-ql-group="'+item.group+'" data-ql-width="'+item.width+'">'+
  '<button type="button" class="ql-vc-insert" data-quick-device="'+item.kind+'" data-quick-width="'+item.width+'" data-quick-poles="'+item.poles+'" aria-label="Inserir '+item.short+' com largura de '+item.width+' módulos DIN">'+
   '<span class="ql-vc-family">'+groupLabel+'</span>'+
   '<span class="quick-art ql-vc-art">'+hardwareSVG(item.kind,'',item.width)+'</span>'+
   '<strong>'+item.short+'</strong>'+
   '<span class="ql-vc-caption">'+item.width+' M · '+(item.kind==='idr'?'IDR':item.kind==='dps'?'DPS':item.kind==='mcb'?'MCB':'DIN')+'</span>'+
   '<span class="ql-vc-action">＋ Inserir no quadro</span>'+
  '</button>'+
  '<button type="button" class="ql-vc-favorite'+(favorite?' chosen':'')+'" data-ql-fav="'+item.id+'" aria-pressed="'+favorite+'" aria-label="'+(favorite?'Remover dos':'Adicionar aos')+' favoritos: '+item.short+' '+item.width+' módulos" title="Favorito">'+(favorite?'★':'☆')+'</button>'+
 '</article>';
}
function redraw(){
 var ordered=entries.slice().sort(function(a,b){
   var fa=Number(saved.favorites.indexOf(a.id)!==-1),fb=Number(saved.favorites.indexOf(b.id)!==-1);
   if(fa!==fb)return fb-fa;
   var ra=saved.recent.indexOf(a.id),rb=saved.recent.indexOf(b.id);
   if(ra<0)ra=999;if(rb<0)rb=999;
   if(ra!==rb)return ra-rb;
   return entries.indexOf(a)-entries.indexOf(b);
 });
 grid.innerHTML=ordered.map(variantMarkup).join('');
 applyFilters();
}
function applyFilters(){
 var term=simplify(input.value);
 var n=0;
 grid.querySelectorAll('[data-ql-catalog-id]').forEach(function(card){
  var item=entries.find(function(e){return e.id===card.dataset.qlCatalogId});
  var groupOk=view==='all'||item.group===view||(view==='favorites'&&saved.favorites.indexOf(item.id)!==-1)||(view==='recent'&&saved.recent.indexOf(item.id)!==-1);
  var match=groupOk&&(width==='all'||item.width===Number(width))&&(!term||term.split(/\s+/).every(function(word){return item.search.indexOf(word)!==-1}));
  card.hidden=!match;if(match)n++;
 });
 count.textContent=n+' de '+entries.length+' opções';
 empty.hidden=n!==0;
 empty.innerHTML=n?'':'<strong>Nenhum dispositivo encontrado.</strong><p>Experimente outra largura, categoria ou termo de pesquisa.</p><button type="button" data-ql-reset>Limpar filtros</button>';
 toolbar.querySelectorAll('[data-ql-view]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.qlView===view))});
}
toolbar.addEventListener('click',function(event){
 var btn=event.target.closest('[data-ql-view]');if(!btn)return;
 view=btn.dataset.qlView;applyFilters();
});
toolbar.querySelector('#qlVcWidth').addEventListener('change',function(e){width=e.target.value;applyFilters()});
empty.addEventListener('click',function(e){if(!e.target.closest('[data-ql-reset]'))return;view='all';width='all';input.value='';toolbar.querySelector('#qlVcWidth').value='all';applyFilters();input.focus()});
grid.addEventListener('click',function(e){
 var fav=e.target.closest('[data-ql-fav]');
 if(fav){
  e.preventDefault();e.stopImmediatePropagation();
  var id=fav.dataset.qlFav,pos=saved.favorites.indexOf(id);
  if(pos>=0)saved.favorites.splice(pos,1);else saved.favorites.unshift(id);
  remember();redraw();
  var returned=grid.querySelector('[data-ql-fav="'+id+'"]');
  if(returned&&!returned.closest('[hidden]'))returned.focus({preventScroll:true});
  return;
 }
 var insert=e.target.closest('[data-quick-device]');
 if(insert){
  var selected=insert.dataset.quickDevice+'-'+insert.dataset.quickWidth;
  saved.recent=[selected].concat(saved.recent.filter(function(id){return id!==selected})).slice(0,8);
  remember();
 }
},true);
var detail=grid.closest('details');
if(detail)detail.addEventListener('toggle',function(){if(detail.open)redraw()});
window.qlVisualCatalogApplyFilters=applyFilters;
window.filterQuickLibrary=applyFilters;
window.renderQuickLibrary=function(){if(typeof renderQuickPositions==='function')renderQuickPositions();if(typeof renderPhotoCredits==='function')renderPhotoCredits();redraw()};
redraw();
})();
