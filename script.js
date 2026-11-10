// VMS site — shared interactions
(function(){
  var hd=document.getElementById('hd');
  if(hd)addEventListener('scroll',function(){hd.classList.toggle('scrolled',scrollY>50)});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.13});
  document.querySelectorAll('.rv:not(.in)').forEach(function(el){io.observe(el)});
  function fmt(n){return n>=1000?n.toLocaleString('pt-BR'):n}
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target,t=+el.dataset.count,p=el.dataset.prefix||'',s=el.dataset.suffix||'',t0=performance.now();
    function tk(n){var k=Math.min(1,(n-t0)/1400),v=Math.round(t*(1-Math.pow(1-k,3)));el.innerHTML=p+'<em>'+fmt(v)+s+'</em>';if(k<1)requestAnimationFrame(tk)}requestAnimationFrame(tk);cio.unobserve(el)})},{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el)});
  // portal live ticker
  var secs=0;setInterval(function(){secs+=3;var a=document.getElementById('ago');if(a)a.textContent='atualizado há '+secs+'s'},3000);
  setInterval(function(){var v1=90+Math.floor(Math.random()*5),v2=86+Math.floor(Math.random()*5),k1=document.getElementById('k1');if(k1){k1.textContent=v1+'%';var b1=document.getElementById('b1');if(b1)b1.style.width=v1+'%';var k2=document.getElementById('k2');if(k2)k2.textContent=v2+'%';var b2=document.getElementById('b2');if(b2)b2.style.width=v2+'%';var a=document.getElementById('ago');if(a)a.textContent='atualizado agora';secs=0}},6000);
  // accordion
  document.querySelectorAll('.acc h4').forEach(function(h){h.addEventListener('click',function(){var a=h.parentElement,b=a.querySelector('.body'),open=a.classList.contains('open');a.classList.toggle('open');b.style.maxHeight=open?null:b.scrollHeight+'px'})});
})();
// portal tabs (global)
function pTab(i,el){document.querySelectorAll('.ptab').forEach(function(t){t.classList.remove('active')});el.classList.add('active');var a=document.getElementById('pp0'),b=document.getElementById('pp1');if(a)a.classList.toggle('show',i===0);if(b)b.classList.toggle('show',i===1)}
// quiz (global)
var QZ={
  fiscal:{tag:'Diagnóstico Fiscal',steps:[
    {q:'A sua obra é residencial (MCMV/HIS) ou multifamiliar?',o:[['Sim',2],['Outro tipo',1],['Não sei',2]]},
    {q:'Em que fase a obra está?',o:[['Planejamento',1],['Em execução',2],['Perto do Habite-se',3]]},
    {q:'Quem cuida do ISS/INSS da obra hoje?',o:[['Ninguém definido',3],['Contador interno',2],['Uma consultoria externa',1]]},
    {q:'Como você recebe os resultados fiscais?',o:[['Quase não recebo',3],['Relatório mensal por e-mail',2],['Em tempo real',0]]},
    {q:'Já teve pendência ou passivo em fiscalização?',o:[['Sim',3],['Não sei',2],['Não',1]]}
  ]},
  eng:{tag:'Diagnóstico de Engenharia',steps:[
    {q:'Qual seu principal desafio agora?',o:[['Planejar uma nova obra',2],['Controlar uma obra em andamento',2],['Reformar locais comerciais',2],['Medição para liberar financiamento',2]]},
    {q:'Você tem cronograma físico-financeiro atualizado?',o:[['Não',3],['Mais ou menos',2],['Sim',1]]},
    {q:'A obra está dentro do prazo e do orçamento?',o:[['Não / atrasada',3],['No limite',2],['Sim',1]]},
    {q:'Quem gerencia a obra hoje?',o:[['Ninguém dedicado',3],['Equipe própria sobrecarregada',2],['Já terceirizo',1]]}
  ]}
};
var cur=null,step=0,score=0;
function openQuiz(t){cur=t;step=0;score=0;document.getElementById('modal').classList.add('show');qRender()}
function closeQuiz(){document.getElementById('modal').classList.remove('show')}
function pick(v){score+=v;step++;qRender()}
function qRender(){
  var z=QZ[cur],box=document.getElementById('qbox');
  if(step<z.steps.length){
    var s=z.steps[step],pct=Math.round(step/z.steps.length*100),h='<button class="x" onclick="closeQuiz()">×</button><div class="qprog"><i style="width:'+pct+'%"></i></div>';
    h+='<span class="tag">'+z.tag+' · '+(step+1)+'/'+z.steps.length+'</span><h3>'+s.q+'</h3>';
    s.o.forEach(function(o){h+='<button class="opt" onclick="pick('+o[1]+')">'+o[0]+'</button>'});
    box.innerHTML=h;
  }else{
    var max=z.steps.reduce(function(a,s){return a+Math.max.apply(0,s.o.map(function(o){return o[1]}))},0),r=score/max,title,txt;
    if(r>=.62){title='Alto potencial — vale um diagnóstico urgente.';txt='Há forte chance de economia não aproveitada e de risco a blindar na sua obra. Um especialista da VMS aponta exatamente onde, sem compromisso.';}
    else if(r>=.38){title='Há oportunidades a destravar.';txt='Sua operação tem pontos de economia e de risco que valem uma 2ª opinião da VMS — e você passa a acompanhar tudo pelo Portal.';}
    else{title='Parece organizado — mas confirme.';txt='Mesmo com a casa arrumada, uma revisão independente costuma encontrar crédito deixado na mesa. Vale uma conversa rápida.';}
    var tipo=cur==='fiscal'?'fiscal':'de obra';
    var wa='https://wa.me/5511994044124?text='+encodeURIComponent('Olá! Fiz o diagnóstico '+tipo+' no site da VMS e meu resultado foi: "'+title+'". Quero falar com um especialista.');
    var mail='mailto:mariana@vmsconsultoria.com?subject='+encodeURIComponent('Diagnóstico '+tipo+' — site VMS')+'&body='+encodeURIComponent('Olá, VMS!\n\nFiz o diagnóstico '+tipo+' no site e meu resultado foi: '+title+'\n\nQuero falar com um especialista.\n\nMeu nome:\nEmpresa / obra:\nTelefone:');
    box.innerHTML='<button class="x" onclick="closeQuiz()">×</button><div class="qres"><span class="score">Resultado do seu diagnóstico</span><h3>'+title+'</h3><p>'+txt+'</p><a class="btn btn-g" href="'+wa+'" target="_blank" rel="noopener">Falar no WhatsApp</a> <a class="btn btn-o" href="'+mail+'">Enviar por e-mail</a></div>';
  }
}
document.addEventListener('click',function(e){var m=document.getElementById('modal');if(m&&e.target===m)closeQuiz()});
