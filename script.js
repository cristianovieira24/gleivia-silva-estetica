const services={
  'pedicure-calista':{title:'Pedicure Calista',price:'€45',duration:'1 h 30',desc:'Cuidado especializado dos pés e unhas, com atenção à saúde da pele, conforto e acabamento.',benefits:['Cuidado detalhado de pés e unhas','Atenção às zonas que precisam de mais cuidado','Conforto e sensação de leveza','Acabamento profissional'],when:'Boa opção para quem procura um cuidado mais completo dos pés.'},
  manicure:{title:'Manicure',price:'€15+',duration:'40 min',desc:'Cuidado das mãos, unhas e cutículas com acabamento delicado e elegante.',benefits:['Unhas mais cuidadas','Manutenção das cutículas','Acabamento limpo e elegante','Sensação de mãos bem tratadas'],when:'Indicada para manutenção das mãos ou antes de uma ocasião especial.'},
  facial:{title:'Limpeza de Pele Premium',price:'€50',duration:'1 h 30',desc:'Cuidado facial pensado para limpeza, equilíbrio e luminosidade, com uma experiência tranquila e personalizada.',benefits:['Limpeza profunda','Ajuda a remover impurezas','Sensação de pele fresca e equilibrada','Momento de cuidado facial'],when:'Boa escolha para quem procura limpeza, renovação e um cuidado facial completo.'},
  massagem:{title:'Massagens',price:'desde €30',duration:'variável',desc:'Um momento pensado para relaxar, diminuir a tensão e devolver leveza ao corpo.',benefits:['Promove relaxamento','Ajuda a reduzir a sensação de tensão','Momento de pausa','Sensação de leveza'],when:'Indicada para quem procura relaxamento e bem-estar.'}
};

const reviews=[
  ['Tom','TS','“Muito profissional, gostei muito do atendimento, lugar agradável, tranquilo e serviço de qualidade. Recomendo muito.”'],
  ['Orlando P','OP','“Além do tratamento magnífico que nos proporciona também ajuda a alma. Gleivia fantástica como profissional e como pessoa.”'],
  ['Isadora','IS','“Estou muito feliz e satisfeita mais uma vez com o serviço! És incrivelmente maravilhosa Gleivia 💖”'],
  ['António V','AV','“Excelente profissional, sempre cuidadosa e muito atenta ao que faz e com as melhores dicas e técnicas.”']
];

const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];

function openModal(id){
  const modal=document.getElementById(id);
  if(!modal)return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('is-locked');
}
function closeModal(id){
  const modal=document.getElementById(id);
  if(!modal)return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  if(!$('.modal-backdrop.open'))document.body.classList.remove('is-locked');
}
function showService(id){
  const service=services[id];
  if(!service)return;
  $('#serviceTitle').textContent=service.title;
  $('#serviceDesc').textContent=service.desc;
  $('#serviceBenefits').innerHTML=service.benefits.map(item=>`<li>${item}</li>`).join('');
  $('#serviceWhen').textContent=service.when;
  $('#serviceMeta').textContent=`${service.price} · ${service.duration}`;
  openModal('serviceModal');
}

function initScrollEffects(){
  const header=$('.site-header');
  const progress=$('.site-progress');
  const heroImage=$('.hero-image');
  const update=()=>{
    header?.classList.toggle('scrolled',window.scrollY>30);
    const max=document.documentElement.scrollHeight-window.innerHeight;
    if(progress)progress.style.width=max>0?`${(window.scrollY/max)*100}%`:'0%';
    if(heroImage&&window.scrollY<window.innerHeight*1.2){
      heroImage.style.transform=`translateY(${window.scrollY*.10}px) scale(1.06)`;
    }
  };
  window.addEventListener('scroll',update,{passive:true});
  update();

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -30px'});
  $$('.reveal').forEach(el=>observer.observe(el));
}

function initCursor(){
  if(!window.matchMedia('(pointer:fine)').matches)return;
  const dot=$('.cursor-dot');
  const ring=$('.cursor-ring');
  if(!dot||!ring)return;
  window.addEventListener('pointermove',event=>{
    dot.style.left=`${event.clientX}px`;
    dot.style.top=`${event.clientY}px`;
    ring.style.left=`${event.clientX}px`;
    ring.style.top=`${event.clientY}px`;
  });
  $$('a,button,.treatment-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      ring.style.width='46px';
      ring.style.height='46px';
      ring.style.background='rgba(255,255,255,.12)';
    });
    el.addEventListener('mouseleave',()=>{
      ring.style.width='28px';
      ring.style.height='28px';
      ring.style.background='transparent';
    });
  });
}

function initReviews(){
  let index=0;
  const card=$('.review-card');
  function render(direction=1){
    if(!card)return;
    const review=reviews[index];
    card.style.opacity='0';
    card.style.transform=`translateX(${direction*16}px)`;
    window.setTimeout(()=>{
      $('#reviewIndex').textContent=`0${index+1} / 04`;
      $('#reviewName').textContent=review[0];
      $('#reviewText').textContent=review[2];
      $('#reviewAvatar').textContent=review[1];
      card.style.opacity='1';
      card.style.transform='translateX(0)';
    },170);
  }
  $('#reviewPrev')?.addEventListener('click',()=>{index=(index-1+reviews.length)%reviews.length;render(-1)});
  $('#reviewNext')?.addEventListener('click',()=>{index=(index+1)%reviews.length;render(1)});
  if(card)card.style.transition='opacity .22s ease,transform .22s ease';
}

function initBooking(){
  $$('.js-book').forEach(button=>button.addEventListener('click',()=>openModal('bookingModal')));
  $$('[data-close]').forEach(button=>button.addEventListener('click',()=>closeModal(button.dataset.close)));
  $$('.modal-backdrop').forEach(backdrop=>backdrop.addEventListener('click',event=>{
    if(event.target===backdrop)closeModal(backdrop.id);
  }));
  window.addEventListener('keydown',event=>{
    if(event.key==='Escape')$$('.modal-backdrop.open').forEach(modal=>closeModal(modal.id));
  });

  $$('.treatment-card').forEach(card=>{
    const open=()=>showService(card.dataset.service);
    card.addEventListener('click',open);
    card.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){event.preventDefault();open();}
    });
  });

  $('#serviceModal .js-book')?.addEventListener('click',()=>{
    closeModal('serviceModal');
    openModal('bookingModal');
  });

  $('#confirmBooking')?.addEventListener('click',()=>{
    const name=$('#bookingName').value.trim();
    const date=$('#bookingDate').value;
    const result=$('#bookingResult');
    result.hidden=false;
    result.textContent=name&&date
      ? 'Demonstração concluída. Numa versão final, este passo será ligado à agenda real da Gleivia.'
      : 'Preencha o seu nome e escolha uma data para concluir a demonstração.';
  });
  const dateField=$('#bookingDate');
  if(dateField)dateField.value=new Date(Date.now()+172800000).toISOString().slice(0,10);
}

document.addEventListener('DOMContentLoaded',()=>{
  initScrollEffects();
  initCursor();
  initReviews();
  initBooking();
});