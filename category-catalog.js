const CATEGORY_CATALOG={
  featured:{label:'Em destaque',tag:'Seleção',title:'Em destaque',description:'Os serviços que melhor representam a experiência da Gleivia e aparecem primeiro no agendamento.',image:'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1500&q=90',options:[
    ['Pedicure Calista','1 h 30','€45','Cuidado especializado dos pés e unhas.'],
    ['Manicure Simples','40 min','€15','Manutenção das mãos, unhas e cutículas.'],
    ['Premium','1 h 30','€50','Limpeza de pele premium com cuidado avançado.'],
    ['Pernas','35 min','€45','Serviço disponível no catálogo atual.']
  ]},
  pedicure:{label:'Pedicure e Manicure',tag:'Mãos · Pés',title:'Pedicure e Manicure',description:'Cuidados de mãos e pés com serviços separados, duração e preço próprios.',image:'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&w=1400&q=90',options:[
    ['Pedicure Calista','1 h 30','€45','Cuidado especializado dos pés e unhas.'],
    ['Pedicure Tradicional','1 h','€30','Manutenção, higiene e acabamento dos pés.'],
    ['Pedicure Simples','40 min','€23','Manutenção rápida dos pés.'],
    ['Manicure Simples','40 min','€15','Cuidado das mãos, unhas e cutículas.']
  ]},
  corporal:{label:'Massagem Corporal',tag:'Corpo',title:'Massagem Corporal',description:'Escolha o tipo de massagem de acordo com o objetivo e o tempo disponível.',image:'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=90',options:[
    ['Top Relax com Pedras Frias','30 min','€30','Experiência de relaxamento e sensação de leveza.'],
    ['Massagem por Zonas','25 min','€30','Massagem concentrada na zona escolhida.'],
    ['Massagem Top Terapêutica','1 h 10','€60','Cuidado terapêutico com maior duração.']
  ]},
  facial:{label:'Massagem Facial',tag:'Rosto',title:'Massagem Facial',description:'Cuidado facial pensado para relaxar e cuidar da pele. O serviço Top Face está listado publicamente no catálogo da Gleivia.',image:'https://images.unsplash.com/photo-1775642548888-7183ff686cb6?auto=format&fit=crop&w=1400&q=90',options:[
    ['Top Face','30 min','€25','Massagem facial do catálogo atual.']
  ]},
  laser:{label:'Depilação a laser',tag:'Laser',title:'Depilação a laser',description:'Categoria própria no agendamento da Gleivia. As zonas e preços podem variar; nesta demonstração, cada opção deve ser confirmada antes de fechar o pedido.',image:'https://images.unsplash.com/photo-1700760933574-9f0f4ea9aa3b?auto=format&fit=crop&w=1400&q=90',options:[
    ['Escolher zona','—','Consultar','Abrir o agendamento para ver zonas e preço atuais.']
  ]},
  cera:{label:'Depilação a Cera',tag:'Cera',title:'Depilação a Cera',description:'Escolha diretamente a zona. Cada zona é um serviço diferente e entra separadamente no carrinho.',image:'https://images.unsplash.com/photo-1526413425697-1d271fdbe7a9?auto=format&fit=crop&w=1400&q=90',options:[
    ['Zona XL','40 min','€30','Braços, pernas, virilhas e glúteos.'],
    ['Zona XXL','1 h 30','€45','Costas completa, abdómen e pernas completas.']
  ]},
  maquina:{label:'Depilação a Máquina',tag:'Máquina',title:'Depilação a Máquina',description:'Categoria própria no agendamento da Gleivia. Abra para consultar a zona e o serviço escolhido antes de adicionar.',image:'https://images.unsplash.com/photo-1702261347927-11207f77e751?auto=format&fit=crop&w=1400&q=90',options:[
    ['Escolher zona','—','Consultar','Abrir o agendamento para ver os serviços atuais.']
  ]},
  gillette:{label:'Depilação a Gillette',tag:'Gillette',title:'Depilação a Gillette',description:'Serviços separados por zona, exatamente como no fluxo de agendamento.',image:'https://images.unsplash.com/photo-1769028857040-b63673bf3557?auto=format&fit=crop&w=1400&q=90',options:[
    ['Zona M','15 min','€15','Mãos e pés, maçã do rosto e pescoço.'],
    ['Zona L','20 min','€20','Axilas, ombros e perianal.'],
    ['Zona XL','40 min','€35','Braços, pernas, virilha e glúteos.'],
    ['Zona XXL','1 h 30','€50','Costas completa, abdómen e pernas completas.']
  ]},
  pele:{label:'Limpeza de Pele',tag:'Pele',title:'Limpeza de Pele',description:'Cada protocolo é um serviço diferente. Veja a explicação antes de adicionar ao seu agendamento.',image:'https://images.unsplash.com/photo-1761718210089-ba3bb5ccb54f?auto=format&fit=crop&w=1400&q=90',options:[
    ['Esfoliação Corporal','1 h 15','€50','Revitaliza a pele, remove impurezas e promove renovação celular. Não inclui banho.'],
    ['Silver','1 h','€45','Remove impurezas, células mortas, comedões, milium e excesso de oleosidade.'],
    ['Premium','1 h 30','€50','Higienização profunda, esfoliação, máscaras de alta performance e tecnologia para tratar, nutrir e rejuvenescer.']
  ]}
};

let catalogCart=[];
const CQS=(s,r=document)=>r.querySelector(s),CQA=(s,r=document)=>[...r.querySelectorAll(s)];
const euroValue=v=>Number(String(v).replace('€','').replace(',','.').trim())||0;

function buildCatalog(){
  const grid=CQS('.treatment-grid');
  if(!grid)return;
  grid.className='catalog-grid';
  grid.innerHTML=Object.entries(CATEGORY_CATALOG).map(([id,c],i)=>`
    <article class="category-card ${id==='featured'?'featured':''}" data-category="${id}" tabindex="0">
      <img src="${c.image}" alt="${c.title}" loading="lazy">
      <div class="category-top"><span>${String(i+1).padStart(2,'0')}</span><span>${c.tag}</span></div>
      <div class="category-bottom"><h3>${c.title}</h3><p class="category-description">${c.description}</p><div class="category-arrow">Ver serviços · adicionar ao agendamento ↗</div></div>
    </article>`).join('');
  CQA('.category-card').forEach(card=>{
    const open=()=>openCategory(card.dataset.category);
    card.addEventListener('click',open);
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
  });
}

function ensureCategorySection(){
  const oldHead=CQS('.section-head');
  if(oldHead){oldHead.classList.add('catalog-head');oldHead.querySelector('p:last-child').textContent='As categorias seguem a estrutura do agendamento da Gleivia. Clique para ver o que inclui cada uma, duração, valor e adicionar serviços ao seu pedido.'}
  const section=CQS('#tratamentos');
  if(section){section.id='serviceCatalog';}
}

function ensureServiceModal(){
  const modal=CQS('#serviceModal');
  if(!modal)return;
  if(!CQS('.category-modal-image',modal)){
    const image=document.createElement('img');
    image.className='category-modal-image';
    image.alt='';
    CQS('#serviceDesc',modal).insertAdjacentElement('beforebegin',image);
  }
  const title=CQS('.kicker',modal);
  if(title)title.textContent='Serviços e agendamento';
}

function openCategory(id){
  const c=CATEGORY_CATALOG[id];
  if(!c)return;
  ensureServiceModal();
  const modal=CQS('#serviceModal',document);
  const img=CQS('.category-modal-image',modal);
  img.src=c.image;
  img.alt=c.title;
  CQS('#serviceTitle').textContent=c.title;
  CQS('#serviceDesc').textContent=c.description;
  CQS('#serviceMeta').textContent=`${c.options.length} opções · adicione quantas quiser`;
  const benefits=CQS('#serviceBenefits');
  benefits.innerHTML='<div class="service-option-list">'+c.options.map((o,i)=>`<button type="button" data-category-add="${id}" data-option-index="${i}"><strong>${o[0]}</strong><b>${o[2]}</b><small>${o[1]} · ${o[3]}</small></button>`).join('')+'</div>';
  CQS('#serviceWhen').textContent='Ao adicionar, o serviço entra no carrinho. Pode combinar vários serviços antes de finalizar.';
  CQS('#serviceModal').classList.add('open');
  CQS('#serviceModal').setAttribute('aria-hidden','false');
  document.body.classList.add('is-locked');
  CQA('[data-category-add]').forEach(btn=>btn.addEventListener('click',()=>{
    const option=c.options[Number(btn.dataset.optionIndex)];
    addToCart(c.title,option);
  }));
}

function addToCart(category,option){
  catalogCart.push({category,name:option[0],duration:option[1],price:option[2],amount:euroValue(option[2]),desc:option[3]});
  renderCart();
  closeCatalogModal();
}

function closeCatalogModal(){
  const modal=CQS('#serviceModal');
  if(!modal)return;
  modal.classList.remove('open');modal.setAttribute('aria-hidden','true');
  if(!document.querySelector('.modal-backdrop.open'))document.body.classList.remove('is-locked');
}

function ensureCart(){
  if(CQS('.catalog-cart'))return;
  const button=document.createElement('button');
  button.className='catalog-cart';
  button.type='button';
  button.innerHTML='<span class="cart-count">0 serviços</span><span>Ver agendamento</span><strong class="cart-total">€0</strong>';
  button.addEventListener('click',openCart);
  document.body.appendChild(button);
}

function renderCart(){
  ensureCart();
  const button=CQS('.catalog-cart');
  const count=catalogCart.length;
  const total=catalogCart.reduce((sum,item)=>sum+item.amount,0);
  button.classList.toggle('is-visible',count>0);
  button.querySelector('.cart-count').textContent=`${count} ${count===1?'serviço':'serviços'}`;
  button.querySelector('.cart-total').textContent=`€${total}`;
}

function openCart(){
  let panel=CQS('.cart-panel');
  if(!panel){
    panel=document.createElement('div');panel.className='cart-panel';
    panel.innerHTML='<div class="cart-sheet"><button class="cart-close" type="button">×</button><p class="kicker">Seu agendamento</p><h3>Serviços<br><em>selecionados.</em></h3><div class="cart-items"></div><div class="cart-total-line"><span>Total</span><strong>€0</strong></div><div class="cart-actions"><button class="button button-dark" type="button" id="cartContinue">Continuar →</button></div></div>';
    document.body.appendChild(panel);
    panel.addEventListener('click',e=>{if(e.target===panel)panel.remove()});
    CQS('.cart-close',panel).addEventListener('click',()=>panel.remove());
    CQS('#cartContinue',panel).addEventListener('click',()=>{panel.remove();const b=CQS('.js-book');if(b)b.click()});
  }
  const items=CQS('.cart-items',panel);
  const total=catalogCart.reduce((sum,item)=>sum+item.amount,0);
  items.innerHTML=catalogCart.length?catalogCart.map((item,i)=>`<div class="cart-row"><div><strong>${item.name}</strong><small>${item.category} · ${item.duration}</small></div><b>€${item.amount}</b></div>`).join(''):'<div class="category-empty-note">Nenhum serviço adicionado ainda.</div>';
  CQS('.cart-total-line strong',panel).textContent=`€${total}`;
  document.body.appendChild(panel);
}

function initCategoryCatalog(){
  ensureCategorySection();
  buildCatalog();
  ensureCart();
  renderCart();
  const close=CQS('[data-close="serviceModal"]');
  close?.addEventListener('click',closeCatalogModal);
}

document.addEventListener('DOMContentLoaded',()=>{
  initCategoryCatalog();
  initCategoryScroll();
});

function initCategoryScroll(){
  const cards=CQA('.category-card');
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.08});
  cards.forEach(c=>io.observe(c));
}
