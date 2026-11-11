// VMS site — shared interactions
(function(){
  var hd=document.getElementById('hd'),prog=document.getElementById('prog');
  function onScroll(){
    if(hd)hd.classList.toggle('scrolled',scrollY>50);
    if(prog){var h=document.documentElement.scrollHeight-innerHeight;prog.style.width=(h>0?Math.min(100,(scrollY/h)*100):0)+'%'}
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  // menu mobile: fecha ao clicar em link, fora do menu ou com ESC
  document.querySelectorAll('header nav a').forEach(function(a){a.addEventListener('click',function(){if(hd)hd.classList.remove('menu-open')})});
  addEventListener('click',function(e){if(hd&&hd.classList.contains('menu-open')&&!hd.contains(e.target))hd.classList.remove('menu-open')});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&hd)hd.classList.remove('menu-open')});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.13});
  document.querySelectorAll('.rv:not(.in)').forEach(function(el){io.observe(el)});
  function fmt(n){return n>=1000?n.toLocaleString('pt-BR'):n}
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target,t=+el.dataset.count,p=el.dataset.prefix||'',s=el.dataset.suffix||'',t0=performance.now();
    function tk(n){var k=Math.min(1,(n-t0)/1400),v=Math.round(t*(1-Math.pow(1-k,3)));el.innerHTML='<em>'+p+fmt(v)+s+'</em>';if(k<1)requestAnimationFrame(tk)}requestAnimationFrame(tk);cio.unobserve(el)})},{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el)});
  // portal live ticker (ilustrativo)
  var secs=0;setInterval(function(){secs+=3;var a=document.getElementById('ago');if(a)a.textContent='atualizado há '+secs+'s'},3000);
  setInterval(function(){var v1=90+Math.floor(Math.random()*5),v2=86+Math.floor(Math.random()*5),k1=document.getElementById('k1');if(k1){k1.textContent=v1+'%';var b1=document.getElementById('b1');if(b1)b1.style.width=v1+'%';var k2=document.getElementById('k2');if(k2)k2.textContent=v2+'%';var b2=document.getElementById('b2');if(b2)b2.style.width=v2+'%';var a=document.getElementById('ago');if(a)a.textContent='atualizado agora';secs=0}},6000);
  // accordion
  document.querySelectorAll('.acc h4').forEach(function(h){h.addEventListener('click',function(){var a=h.parentElement,b=a.querySelector('.body'),open=a.classList.contains('open');a.classList.toggle('open');b.style.maxHeight=open?null:b.scrollHeight+'px'})});
})();
// menu mobile (global)
function toggleMenu(ev){if(ev&&ev.stopPropagation)ev.stopPropagation();var hd=document.getElementById('hd');if(hd)hd.classList.toggle('menu-open')}
// trilha guiada "como funciona" (global)
function fStep(i,el){document.querySelectorAll('.fstep').forEach(function(s){s.classList.remove('active')});el.classList.add('active');for(var k=0;k<3;k++){var p=document.getElementById('fp'+k);if(p)p.classList.toggle('show',k===i)}}
// portal tabs (global)
function pTab(i,el){document.querySelectorAll('.ptab').forEach(function(t){t.classList.remove('active')});el.classList.add('active');var a=document.getElementById('pp0'),b=document.getElementById('pp1');if(a)a.classList.toggle('show',i===0);if(b)b.classList.toggle('show',i===1)}
// ===== Diagnóstico / lead (global) =====
var QZ={
  fiscal:{tag:'Diagnóstico Fiscal',steps:[
    {q:'Qual o tipo da sua obra?',o:[['Residencial (MCMV/HIS)',2],['Residencial multifamiliar',1],['Comercial / galpão',1],['Não sei',2]]},
    {q:'Em que fase a obra está?',o:[['Planejamento',1],['Em execução',2],['Perto do Habite-se',3]]},
    {q:'Quem cuida do ISS/INSS da obra hoje?',o:[['Ninguém definido',3],['Contador / equipe interna',2],['Uma consultoria externa',1]]},
    {q:'Já teve pendência ou passivo em fiscalização?',o:[['Sim',3],['Não',1],['Não sei',2]]},
    {q:'Sobre quais serviços você quer saber mais?',multi:true,o:['Gestão fiscal (ISS/INSS)','Isenção de ISS','Documentação trabalhista','Habite-se & CND','Auditoria pós-obra']}
  ]},
  eng:{tag:'Diagnóstico de Engenharia',steps:[
    {q:'Em que fase está a sua obra?',o:[['Viabilidade / projeto',2],['Em execução',2],['Finalização',2],['Ainda não iniciada',2]]},
    {q:'Você tem cronograma físico-financeiro atualizado?',o:[['Não',3],['Mais ou menos',2],['Sim',1]]},
    {q:'A obra tem financiamento (banco/fundo) com medições?',o:[['Sim',2],['Não',1],['Pretendo buscar',2]]},
    {q:'Quem gerencia a obra hoje?',o:[['Ninguém dedicado',3],['Equipe própria sobrecarregada',2],['Já terceirizo',1]]},
    {q:'Sobre quais serviços você quer saber mais?',multi:true,o:['Planejamento de obras','Orçamento','Gerenciamento','Planejamento para financiamento (banco)','Medição para financiador']}
  ]}
};
var cur=null,step=0,score=0,ans=[],sel=[],lead={};
function openQuiz(t){cur=t;step=0;score=0;ans=[];sel=[];lead={};document.getElementById('modal').classList.add('show');qRender()}
function closeQuiz(){document.getElementById('modal').classList.remove('show')}
function pick(v,i){var s=QZ[cur].steps[step];ans.push({q:s.q,a:s.o[i][0]});score+=v;step++;qRender()}
function toggleSel(i){var o=QZ[cur].steps[step].o[i],k=sel.indexOf(o);if(k<0)sel.push(o);else sel.splice(k,1);qRender()}
function nextStep(){step++;qRender()}
function submitLead(){
  var n=(document.getElementById('ld-nome').value||'').trim(),
      t=(document.getElementById('ld-tel').value||'').trim(),
      m=(document.getElementById('ld-email').value||'').trim(),
      e=document.getElementById('ld-err'),err='';
  if(!n)err='Preencha seu nome.';
  else if(t.replace(/\D/g,'').length<10)err='Informe um telefone/WhatsApp com DDD.';
  else if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m))err='Informe um e-mail válido.';
  if(err){if(e){e.textContent=err;e.style.display='block'}return}
  lead={nome:n,tel:t,email:m};qRender();
}
function qRender(){
  var z=QZ[cur],box=document.getElementById('qbox'),total=z.steps.length+1,h;
  if(step<z.steps.length){
    var s=z.steps[step],pct=Math.round(step/total*100);
    h='<button class="x" onclick="closeQuiz()">×</button><div class="qprog"><i style="width:'+pct+'%"></i></div>';
    h+='<span class="tag">'+z.tag+' · '+(step+1)+'/'+total+'</span><h3>'+s.q+'</h3>';
    if(s.multi){
      h+='<p class="qhint">Pode marcar mais de uma.</p>';
      s.o.forEach(function(o,i){var on=sel.indexOf(o)>=0;h+='<button class="opt'+(on?' on':'')+'" onclick="toggleSel('+i+')">'+o+(on?'<span class="ck">✓</span>':'')+'</button>'});
      h+='<button class="btn btn-g" style="width:100%;justify-content:center;margin-top:8px" onclick="nextStep()">Continuar →</button>';
    }else{
      s.o.forEach(function(o,i){h+='<button class="opt" onclick="pick('+o[1]+','+i+')">'+o[0]+'</button>'});
    }
    box.innerHTML=h;
  }else if(!lead.nome){
    var pct2=Math.round(z.steps.length/total*100);
    h='<button class="x" onclick="closeQuiz()">×</button><div class="qprog"><i style="width:'+pct2+'%"></i></div>';
    h+='<span class="tag">'+z.tag+' · último passo</span><h3>Pra onde enviamos seu diagnóstico?</h3>';
    h+='<p class="qhint">Um especialista da VMS retorna com a análise. Sem compromisso — todos os campos são obrigatórios.</p>';
    h+='<div class="qfield"><label>Seu nome *</label><input id="ld-nome" type="text" placeholder="Nome e sobrenome"></div>';
    h+='<div class="qfield"><label>WhatsApp / telefone *</label><input id="ld-tel" type="tel" inputmode="tel" placeholder="(11) 90000-0000"></div>';
    h+='<div class="qfield"><label>E-mail *</label><input id="ld-email" type="email" inputmode="email" placeholder="voce@empresa.com"></div>';
    h+='<p id="ld-err" style="display:none;color:#A32D2D;font-size:13px;margin-bottom:10px">Preencha todos os campos.</p>';
    h+='<button class="btn btn-g" style="width:100%;justify-content:center" onclick="submitLead()">Ver meu diagnóstico →</button>';
    box.innerHTML=h;
  }else{
    var max=z.steps.filter(function(s){return !s.multi}).reduce(function(a,s){return a+Math.max.apply(0,s.o.map(function(o){return o[1]}))},0),r=max?score/max:0,title,txt;
    if(r>=.6){title='Alto potencial — vale uma análise com prioridade.';txt='Há forte chance de economia não aproveitada e de risco a blindar na sua obra. Nosso time aponta exatamente onde.';}
    else if(r>=.38){title='Há oportunidades a destravar.';txt='Sua operação tem pontos de economia e de risco que valem uma segunda opinião da VMS.';}
    else{title='Parece organizado — mas confirme.';txt='Mesmo com a casa arrumada, uma revisão independente costuma encontrar crédito deixado na mesa.';}
    var tipo=cur==='fiscal'?'fiscal':'de obra';
    var linhas=ans.map(function(a){return '• '+a.q+' '+a.a}).join('\n');
    var serv=sel.length?sel.join(', '):'—';
    var msg='Olá, VMS! Fiz o diagnóstico '+tipo+' no site.\n\nNome: '+lead.nome+'\nTelefone: '+lead.tel+'\nE-mail: '+lead.email+'\n\nRespostas:\n'+linhas+'\n\nQuero saber mais sobre: '+serv+'\n\nResultado: '+title;
    var wa='https://wa.me/5511994044124?text='+encodeURIComponent(msg);
    var mail='mailto:mariana@vmsconsultoria.com?subject='+encodeURIComponent('Lead — Diagnóstico '+tipo+' (site VMS)')+'&body='+encodeURIComponent(msg);
    h='<button class="x" onclick="closeQuiz()">×</button><div class="qres"><span class="score">Resultado · '+lead.nome.split(' ')[0]+'</span><h3>'+title+'</h3><p>'+txt+'</p>';
    h+='<p class="qhint" style="margin-top:-6px">Toque abaixo pra enviar seu diagnóstico e falar com um especialista.</p>';
    h+='<a class="btn btn-g" href="'+wa+'" target="_blank" rel="noopener">Enviar no WhatsApp</a> <a class="btn btn-o" href="'+mail+'">Enviar por e-mail</a></div>';
    box.innerHTML=h;
  }
}
document.addEventListener('click',function(e){var m=document.getElementById('modal');if(m&&e.target===m)closeQuiz()});
