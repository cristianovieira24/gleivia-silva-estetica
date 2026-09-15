const services={
'pedicure-calista':{title:'Pedicure Calista',price:'€45',duration:'1 h 30',desc:'Um cuidado especializado para os pés e unhas, com atenção à saúde da pele, conforto e acabamento. É um dos serviços de destaque no perfil atual da Gleivia.',benefits:['Ajuda a manter pés e unhas bem cuidados','Cuidado detalhado de zonas que precisam de mais atenção','Contribui para conforto e sensação de leveza','Acabamento cuidado para uma aparência mais saudável'],when:'Boa opção para quem procura um cuidado mais completo dos pés ou sente que precisa de uma abordagem mais detalhada.'},
'pedicure-tradicional':{title:'Pedicure Tradicional',price:'€30',duration:'1 h',desc:'Uma pedicure completa para manutenção, higiene e beleza dos pés, com tempo para um acabamento cuidado.',benefits:['Higiene e manutenção das unhas','Cuidado das cutículas','Acabamento e aparência mais cuidada','Sensação de conforto e frescura'],when:'Indicada para manutenção regular dos pés e para quem quer um cuidado completo sem necessidade de um protocolo específico.'},
'pedicure-simples':{title:'Pedicure Simples',price:'€23',duration:'40 min',desc:'Uma opção mais rápida para manter os pés cuidados entre sessões completas.',benefits:['Manutenção prática','Cuidado essencial das unhas','Sensação de frescura','Ideal para rotinas de manutenção'],when:'Boa para quem já mantém os pés regularmente e procura uma sessão mais curta.'},
manicure:{title:'Manicure',price:'€15+',duration:'variável',desc:'Cuidado das mãos, unhas e cutículas com acabamento delicado e elegante.',benefits:['Unhas visualmente mais cuidadas','Manutenção das cutículas','Acabamento limpo e elegante','Sensação de mãos bem tratadas'],when:'Indicada para manutenção das mãos e unhas ou antes de uma ocasião especial.'},
'facial-premium':{title:'Limpeza de Pele Premium',price:'€50',duration:'1 h 30',desc:'Um cuidado facial focado em limpeza, equilíbrio e luminosidade, pensado para deixar a pele com sensação renovada.',benefits:['Limpeza profunda da pele','Ajuda a remover impurezas','Sensação de pele mais fresca e equilibrada','Pode ser uma boa preparação para uma rotina de cuidados'],when:'Boa escolha para quem sente a pele congestionada, sem luminosidade ou precisa de uma sessão de limpeza e cuidado.'},
massagem:{title:'Massagens',price:'desde €30',duration:'variável',desc:'Um momento pensado para relaxar, diminuir a tensão e devolver leveza ao corpo.',benefits:['Promove relaxamento','Ajuda a reduzir sensação de tensão muscular','Momento de pausa e bem-estar','Pode ajudar a recuperar sensação de leveza'],when:'Indicada para quem procura relaxamento e um momento de cuidado corporal.'},
depilacao:{title:'Depilação',price:'variável',duration:'variável',desc:'Cuidados de depilação para diferentes zonas, com atenção à técnica e à sensibilidade da pele.',benefits:['Pele com aparência mais uniforme','Remoção dos pelos da zona escolhida','Atendimento adaptado à área tratada','Cuidado com a preparação e conforto da pele'],when:'A escolha depende da zona e do objetivo. No agendamento, o serviço específico pode ser selecionado.'}
};

const reviews=[
['Tom','TS','“Muito profissional, gostei muito do atendimento, lugar agradável, tranquilo e serviço de qualidade. Recomendo muito.”'],
['Orlando P','OP','“Além do tratamento magnífico que nos proporciona também ajuda a alma. Gleivia fantástica como profissional e como pessoa.”'],
['Isadora','IS','“Estou muito feliz e satisfeita mais uma vez com o serviço! És incrivelmente maravilhosa Gleivia 💖”'],
['António V','AV','“Excelente profissional, sempre cuidadosa e muito atenta ao que faz e com as melhores dicas e técnicas.”']
];

function qs(sel,root=document){return root.querySelector(sel)}
function qsa(sel,root=document){return [...root.querySelectorAll(sel)]}
function openModal(id){const el=document.getElementById(id);if(!el)return;el.classList.add('open');el.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeModal(id){const el=document.getElementById(id);if(!el)return;el.classList.remove('open');el.setAttribute('aria-hidden','true');if(!document.querySelector('.modal-backdrop.open'))document.body.style.overflow=''}

document.addEventListener('DOMContentLoaded',()=>{
  const progress=document.createElement('div');progress.className='site-progress';document.body.appendChild(progress);
  const updateProgress=()=>{const d=document.documentElement;const max=d.scrollHeight-d.clientHeight;progress.style.width=max>0?`${(d.scrollTop/max)*100}%`:'0%'};
  window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();

  qsa('.js-booking').forEach(btn=>btn.addEventListener('click',()=>openModal('bookingModal')));
  qsa('[data-close]').forEach(btn=>btn.addEventListener('click',()=>closeModal(btn.dataset.close)));
  qsa('.modal-backdrop').forEach(backdrop=>backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeModal(backdrop.id)}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')qsa('.modal-backdrop.open').forEach(m=>closeModal(m.id))});

  function showService(id){const s=services[id];if(!s)return;qs('#serviceModalTitle').textContent=s.title;qs('#serviceDescription').textContent=s.desc;qs('#serviceBenefits').innerHTML=s.benefits.map(x=>`<li>${x}</li>`).join('');qs('#serviceWhen').textContent=s.when;qs('#serviceMeta').textContent=`${s.price} · ${s.duration}`;openModal('serviceModal')}
  qsa('.js-service').forEach(card=>card.addEventListener('click',()=>showService(card.dataset.service)));
  qsa('#serviceModal .js-booking').forEach(btn=>btn.addEventListener('click',()=>{closeModal('serviceModal');openModal('bookingModal')}));

  qsa('.portfolio-tabs button').forEach(tab=>tab.addEventListener('click',()=>{
    qsa('.portfolio-tabs button').forEach(x=>x.classList.remove('active'));tab.classList.add('active');
    const filter=tab.dataset.filter;qsa('.portfolio-card').forEach(card=>{const show=filter==='all'||card.dataset.cat===filter;card.classList.toggle('is-hidden',!show)});
  }));

  let reviewIndex=0;
  function renderReview(direction=1){
    const panel=qs('.review-content');if(!panel)return;const r=reviews[reviewIndex];
    panel.style.opacity='0';panel.style.transform=`translateX(${direction*15}px)`;
    setTimeout(()=>{qs('#reviewAvatar').textContent=r[1];qs('#reviewName').textContent=r[0];qs('#reviewText').textContent=r[2];qs('#reviewIndex').textContent=`0${reviewIndex+1} / 04`;panel.style.opacity='1';panel.style.transform='translateX(0)'},160);
  }
  qs('#reviewPrev')?.addEventListener('click',()=>{reviewIndex=(reviewIndex-1+reviews.length)%reviews.length;renderReview(-1)});
  qs('#reviewNext')?.addEventListener('click',()=>{reviewIndex=(reviewIndex+1)%reviews.length;renderReview(1)});
  if(qs('.review-content'))qs('.review-content').style.transition='opacity .2s ease,transform .2s ease';

  const quizSteps=[
    {q:'O que quer cuidar?',opts:[['Pés ou unhas','pedicure'],['Mãos e unhas','manicure'],['Pele do rosto','pele'],['Corpo / relaxamento','massagem'],['Depilação','depilacao']]},
    {q:'Qual é o seu objetivo principal?',opts:[['Manutenção e cuidado','maintenance'],['Preciso de algo mais completo','complete'],['Quero relaxar','relax'],['Quero perceber melhor o que preciso','uncertain']]}
  ];
  let quizStep=0,quizAnswers=[];
  function renderQuiz(){
    const q=quizSteps[quizStep];
    qs('#quizContent').innerHTML=`<h3>Encontre uma boa opção <em>${quizStep+1}/${quizSteps.length}</em></h3><p class="muted">Escolha a opção que melhor descreve o que procura.</p><div class="quiz-question"><h4>${q.q}</h4><div class="quiz-options">${q.opts.map(([label,value])=>`<button type="button" data-answer="${value}">${label}<span>→</span></button>`).join('')}</div></div>`;
    qsa('.quiz-options button').forEach((b,i)=>{b.style.opacity='0';b.style.transform='translateY(8px)';setTimeout(()=>{b.style.transition='opacity .35s ease,transform .35s ease';b.style.opacity='1';b.style.transform='none'},i*55);b.addEventListener('click',()=>{quizAnswers.push(b.dataset.answer);quizStep++;quizStep<quizSteps.length?renderQuiz():showQuizResult()})});
  }
  function showQuizResult(){
    const a=quizAnswers[0];let id='pedicure-tradicional';if(a==='manicure')id='manicure';if(a==='pele')id='facial-premium';if(a==='massagem')id='massagem';if(a==='depilacao')id='depilacao';if(a==='pedicure')id=quizAnswers[1]==='complete'?'pedicure-calista':'pedicure-tradicional';const s=services[id];
    qs('#quizContent').innerHTML=`<div class="quiz-result"><div class="modal-kicker">Possível indicação</div><h4>${s.title}</h4><p>${s.desc}</p><p><strong>Porquê:</strong> ${s.when}</p><button class="primary-button" id="quizBook">Ver tratamento e agendar →</button></div>`;
    qs('#quizBook').addEventListener('click',()=>{closeModal('quizModal');showService(id)});
  }
  function startQuiz(){quizStep=0;quizAnswers=[];renderQuiz();openModal('quizModal')}
  qs('#openQuiz')?.addEventListener('click',startQuiz);qs('#openQuiz2')?.addEventListener('click',startQuiz);qs('.js-service-list')?.addEventListener('click',startQuiz);

  qs('#demoConfirm')?.addEventListener('click',()=>{const date=qs('#bookingDate').value;const name=qs('#bookingName').value.trim();const result=qs('#bookingResult');if(!date||!name){result.hidden=false;result.textContent='Para a demonstração, escolha uma data e indique o seu nome.';return}result.hidden=false;result.textContent='Demonstração concluída. Numa versão contratada, este passo criaria a reserva real na agenda da Gleivia.'});
  if(qs('#bookingDate'))qs('#bookingDate').value=new Date(Date.now()+86400000*2).toISOString().slice(0,10);

  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12,rootMargin:'0px 0px -5% 0px'});
  qsa('.reveal,.reveal-stagger').forEach(el=>observer.observe(el));

  const hero=qs('.hero');const heroArt=qs('.hero-art');
  hero?.addEventListener('pointermove',e=>{if(!heroArt||window.matchMedia('(max-width:650px)').matches)return;const r=hero.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;heroArt.style.setProperty('--mx',`${x*10}px`);heroArt.style.setProperty('--my',`${y*8}px`)});
  hero?.addEventListener('pointerleave',()=>{heroArt?.style.setProperty('--mx','0px');heroArt?.style.setProperty('--my','0px')});

  qsa('img').forEach(img=>img.addEventListener('error',()=>{const parent=img.closest('.hero-photo,.card-image,.portfolio-card');parent?.classList.add('image-error');},{once:true}));
});
