/* =========================================================
   GLEIVIA SILVA ESTÉTICA — interactive experience
   Booking is intentionally handled by the site itself.
   This version stores reservations locally in the browser so the
   complete UX can be tested without an external booking provider.
   For production, the storage layer should be replaced by a shared DB/API.
========================================================= */

const BOOKING_CONFIG = {
  daysAhead: 35,
  openHour: 10,
  closeHour: 19,
  slotMinutes: 30,
  closedWeekday: 0,
  currency: '€',
  services: [
    { id:'pedicure-calista', name:'Pedicure Calista', duration:90, price:45 },
    { id:'pedicure-tradicional', name:'Pedicure Tradicional', duration:60, price:30 },
    { id:'manicure-simples', name:'Manicure Simples', duration:40, price:15 },
    { id:'premium', name:'Limpeza de Pele Premium', duration:90, price:50 },
    { id:'massagem-relaxamento', name:'Massagem de Relaxamento', duration:60, price:35 },
    { id:'zona-l', name:'Depilação — Zona L', duration:15, price:30 },
    { id:'zona-xxl', name:'Depilação — Zona XXL', duration:40, price:50 }
  ]
};

const quotes = [
 ['Tom','“Muito profissional incrível, gostei muito do atendimento, lugar agradável tranquilo e o serviço de qualidade. Recomendo muito.”'],
 ['Orlando P','“Que se pode dizer... além do tratamento magnífico que nos proporciona também ajuda a alma. Gleivia fantástica como profissional e como pessoa.”'],
 ['Isadora','“Estou muito feliz e satisfeita mais uma vez com o serviço! És incrivelmente maravilhosa Gleivia 💖”'],
 ['António V','“Excelente profissional, sempre cuidadosa e muito atenta ao que faz e com as melhores dicas e técnicas.”']
];

let quoteIndex = 0;
const quoteText = document.getElementById('quoteText');
const quoteName = document.getElementById('quoteName');
const quoteCount = document.getElementById('quoteCount');
if (quoteText && quoteName && quoteCount) {
  const renderQuote = () => {
    const q = quotes[quoteIndex];
    quoteName.textContent = q[0];
    quoteText.textContent = q[1];
    quoteCount.textContent = `0${quoteIndex + 1} / 04`;
  };
  document.getElementById('prev')?.addEventListener('click', () => {
    quoteIndex = (quoteIndex - 1 + quotes.length) % quotes.length;
    renderQuote();
  });
  document.getElementById('next')?.addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    renderQuote();
  });
}

/* ---------- Image resilience ----------
   Fresha portfolio URLs are signed and can expire. Instead of leaving
   broken-image icons behind, we replace failed assets with an elegant,
   neutral portfolio panel. The site remains visually intact. */
const placeholder = (label='Imagem') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1100"><rect width="100%" height="100%" fill="#e6ddd5"/><circle cx="450" cy="405" r="155" fill="#d4c3b7"/><path d="M270 760c75-150 285-150 360 0" fill="#c5b0a3"/><text x="450" y="905" text-anchor="middle" font-family="Georgia,serif" font-size="42" fill="#5f5148">${label}</text><text x="450" y="950" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" letter-spacing="4" fill="#8d7d72">GLEIVIA SILVA ESTÉTICA</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', () => {
    if (img.dataset.failed) return;
    img.dataset.failed = '1';
    const label = img.closest('.editorial-image') ? 'Gleivia' : (img.alt || 'Portfólio').slice(0, 24);
    img.src = placeholder(label);
    img.style.objectFit = 'cover';
  }, { once:true });
});

/* ---------- Before / after comparison ---------- */
const range = document.getElementById('compareRange');
const compareFrame = document.getElementById('compareFrame');
const compareTop = document.querySelector('.compare-top');
const compareTopImg = document.querySelector('.compare-top .compare-img');
const compareLine = document.querySelector('.compare-line');
function resizeCompareImage(){
  if (!compareFrame || !compareTopImg) return;
  compareTopImg.style.width = `${compareFrame.clientWidth}px`;
}
function updateCompare(){
  if (!range || !compareTop || !compareLine) return;
  const value = Number(range.value || 50);
  compareTop.style.width = value + '%';
  compareLine.style.left = value + '%';
}
range?.addEventListener('input', updateCompare);
window.addEventListener('resize', resizeCompareImage);
resizeCompareImage();
updateCompare();

/* ---------- Booking system ---------- */
const STORAGE_KEY = 'gleivia-bookings-v1';
const money = (n) => `${BOOKING_CONFIG.currency}${Number(n).toFixed(0)}`;
const pad = (n) => String(n).padStart(2,'0');
const dateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
const prettyDate = (key) => {
  const [y,m,d] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-PT', { weekday:'long', day:'numeric', month:'long' }).format(new Date(y,m-1,d));
};
const storageGet = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};
const storageSet = (v) => localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
const getService = (id) => BOOKING_CONFIG.services.find(s => s.id === id) || BOOKING_CONFIG.services[0];

function nextOpenDates(limit = BOOKING_CONFIG.daysAhead) {
  const dates = [];
  const d = new Date();
  d.setHours(0,0,0,0);
  for (let i=0; i<limit; i++) {
    const candidate = new Date(d);
    candidate.setDate(d.getDate() + i + 1);
    if (candidate.getDay() !== BOOKING_CONFIG.closedWeekday) dates.push(candidate);
  }
  return dates;
}

function slotLabel(minutes){ return `${pad(Math.floor(minutes/60))}:${pad(minutes%60)}`; }
function durationFits(start, duration){ return start + duration <= BOOKING_CONFIG.closeHour * 60; }
function slotIsBooked(date, start, duration){
  const bookings = storageGet().filter(b => b.date === date);
  const end = start + duration;
  return bookings.some(b => {
    const existingStart = b.minutes;
    const existingEnd = existingStart + b.duration;
    return start < existingEnd && end > existingStart;
  });
}
function generateSlots(date, service){
  const slots=[];
  for(let mins=BOOKING_CONFIG.openHour*60; mins<BOOKING_CONFIG.closeHour*60; mins+=BOOKING_CONFIG.slotMinutes){
    if(durationFits(mins, service.duration) && !slotIsBooked(date, mins, service.duration)) slots.push(mins);
  }
  return slots;
}

function injectBookingStyles(){
  if(document.getElementById('booking-runtime-styles')) return;
  const style=document.createElement('style');
  style.id='booking-runtime-styles';
  style.textContent=`
  body.booking-open{overflow:hidden}
  .booking-overlay{position:fixed;inset:0;background:rgba(26,21,18,.52);backdrop-filter:blur(12px);z-index:100;display:grid;place-items:center;padding:18px;opacity:0;pointer-events:none;transition:opacity .25s ease}
  .booking-overlay.open{opacity:1;pointer-events:auto}
  .booking-modal{width:min(1080px,100%);max-height:min(900px,94vh);overflow:auto;background:#fbf9f6;color:#211d19;display:grid;grid-template-columns:1.05fr .95fr;box-shadow:0 30px 90px rgba(0,0,0,.22)}
  .booking-left{padding:42px 42px 36px;border-right:1px solid #ded5cd}
  .booking-right{padding:42px;background:#eee7df}
  .booking-eyebrow{font:10px/1 Manrope,sans-serif;letter-spacing:.17em;text-transform:uppercase;color:#81736a}
  .booking-title{font:clamp(42px,5vw,70px)/.88 Italiana,serif;font-weight:400;letter-spacing:-.04em;margin:18px 0 30px}
  .booking-section-title{font:12px Manrope,sans-serif;text-transform:uppercase;letter-spacing:.14em;margin:0 0 15px}
  .booking-services{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:30px}
  .booking-service{border:1px solid #d8cfc6;background:transparent;padding:16px;text-align:left;cursor:pointer;transition:.2s ease;display:flex;justify-content:space-between;gap:10px}
  .booking-service:hover,.booking-service.selected{background:#2a2522;color:#fff;border-color:#2a2522}
  .booking-service strong{font:21px/1 Italiana,serif;font-weight:400}.booking-service small{display:block;color:#85776e;margin-top:6px;font:10px Manrope,sans-serif}.booking-service.selected small{color:#d8d0ca}.booking-price{font:12px Manrope,sans-serif;white-space:nowrap}
  .booking-close{position:absolute;top:15px;right:18px;width:40px;height:40px;border:1px solid rgba(255,255,255,.45);background:#fbf9f6;color:#2a2522;cursor:pointer;font-size:20px;z-index:102}
  .booking-calendar{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.booking-date{border:1px solid #d8cfc6;background:#fbf9f6;padding:12px 8px;cursor:pointer;text-align:center}.booking-date span{display:block;font:9px Manrope,sans-serif;text-transform:uppercase;letter-spacing:.1em;color:#82756b}.booking-date strong{display:block;font:28px Italiana,serif;font-weight:400;margin:3px 0}.booking-date em{font:10px Manrope,sans-serif;font-style:normal;color:#85776e}.booking-date.selected{background:#2a2522;color:white;border-color:#2a2522}.booking-date.selected span,.booking-date.selected em{color:#ded6cf}
  .booking-times{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.booking-time{border:1px solid #d8cfc6;background:#fff;padding:11px 14px;cursor:pointer;font:11px Manrope,sans-serif}.booking-time:hover,.booking-time.selected{background:#2a2522;color:white;border-color:#2a2522}.booking-empty{font:12px Manrope,sans-serif;color:#83766e;padding:16px 0}
  .booking-summary{position:sticky;top:0}.booking-summary-card{background:#fff;padding:24px}.booking-summary-card h4{font:34px/1 Italiana,serif;font-weight:400;margin:7px 0 14px}.booking-detail{display:flex;justify-content:space-between;gap:20px;padding:11px 0;border-top:1px solid #e2dad2;font:11px Manrope,sans-serif}.booking-detail strong{font-weight:600;text-align:right}.booking-form{display:grid;gap:12px;margin-top:20px}.booking-form input{width:100%;padding:14px 0;background:transparent;border:0;border-bottom:1px solid #cfc4bb;outline:0;font:12px Manrope,sans-serif}.booking-submit{margin-top:18px;padding:15px 18px;border:1px solid #2a2522;background:#2a2522;color:#fff;font:10px Manrope,sans-serif;text-transform:uppercase;letter-spacing:.14em;cursor:pointer}.booking-submit:disabled{opacity:.45;cursor:not-allowed}.booking-note{font:10px/1.6 Manrope,sans-serif;color:#85776e;margin-top:13px}
  .booking-success{display:none;text-align:center;padding:35px 10px}.booking-success.show{display:block}.booking-success h3{font:54px/1 Italiana,serif;font-weight:400;margin:18px 0}.booking-success p{font:12px/1.7 Manrope,sans-serif;color:#756a63}.booking-code{margin:25px auto;padding:14px 18px;border:1px solid #d8cfc6;font:11px Manrope,sans-serif;letter-spacing:.1em;background:#fff;max-width:300px}
  .booking-mobile-note{display:none}
  @media(max-width:760px){.booking-modal{display:block}.booking-left{border-right:0;padding:34px 22px}.booking-right{padding:24px 22px}.booking-services{grid-template-columns:1fr}.booking-calendar{grid-template-columns:repeat(3,1fr)}.booking-close{top:9px;right:9px}.booking-mobile-note{display:block;font:10px Manrope,sans-serif;color:#85776e;margin:0 0 18px}.booking-summary{position:static}}
  `;
  document.head.appendChild(style);
}

function createBookingModal(){
  injectBookingStyles();
  const overlay=document.createElement('div');
  overlay.className='booking-overlay';
  overlay.id='bookingOverlay';
  overlay.innerHTML=`
    <div class="booking-modal" role="dialog" aria-modal="true" aria-label="Agendar tratamento">
      <button class="booking-close" type="button" aria-label="Fechar">×</button>
      <div class="booking-left">
        <div class="booking-eyebrow">Agenda Gleivia Silva Estética</div>
        <h2 class="booking-title">Reserve o seu<br><em>momento.</em></h2>
        <p class="booking-mobile-note">O agendamento acontece aqui mesmo no site. Escolha o tratamento, dia e horário.</p>
        <div class="booking-step active" data-step="1">
          <h3 class="booking-section-title">01 · Tratamento</h3>
          <div class="booking-services"></div>
        </div>
        <div class="booking-step active" data-step="2">
          <h3 class="booking-section-title">02 · Data e hora</h3>
          <div class="booking-calendar"></div>
          <div class="booking-times"></div>
        </div>
      </div>
      <div class="booking-right">
        <div class="booking-summary">
          <div class="booking-eyebrow">O seu agendamento</div>
          <div class="booking-summary-card">
            <div class="booking-summary-empty">Escolha um tratamento para continuar.</div>
            <div class="booking-summary-data" style="display:none">
              <h4 class="summary-service"></h4>
              <div class="booking-detail"><span>Duração</span><strong class="summary-duration"></strong></div>
              <div class="booking-detail"><span>Valor</span><strong class="summary-price"></strong></div>
              <div class="booking-detail"><span>Data</span><strong class="summary-date">Escolha uma data</strong></div>
              <div class="booking-detail"><span>Hora</span><strong class="summary-time">Escolha uma hora</strong></div>
              <form class="booking-form">
                <input name="name" autocomplete="name" placeholder="Nome completo" required>
                <input name="phone" autocomplete="tel" placeholder="Telefone / WhatsApp" required>
                <input name="email" type="email" autocomplete="email" placeholder="Email" required>
                <button class="booking-submit" type="submit" disabled>Confirmar agendamento</button>
              </form>
              <div class="booking-note">Ao confirmar, a reserva fica registada neste navegador. A ligação a uma base de dados partilhada é a próxima etapa para transformar esta agenda em sistema de produção.</div>
            </div>
            <div class="booking-success">
              <div class="booking-eyebrow">Reserva criada</div>
              <h3>Até breve.</h3>
              <p>O seu pedido foi registado com sucesso.</p>
              <div class="booking-code"></div>
              <button class="booking-submit new-booking" type="button">Novo agendamento</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  return overlay;
}

const bookingOverlay = createBookingModal();
const booking = { service: BOOKING_CONFIG.services[0], date: null, time: null };

function renderBookingServices(){
  const box=bookingOverlay.querySelector('.booking-services');
  box.innerHTML=BOOKING_CONFIG.services.map(s=>`<button class="booking-service ${s.id===booking.service.id?'selected':''}" data-service="${s.id}" type="button"><span><strong>${s.name}</strong><small>${s.duration} min</small></span><span class="booking-price">${money(s.price)}</span></button>`).join('');
  box.querySelectorAll('.booking-service').forEach(btn=>btn.addEventListener('click',()=>{
    booking.service=getService(btn.dataset.service);
    booking.time=null;
    renderBookingServices();
    renderBookingDates();
    updateBookingSummary();
  }));
}
function renderBookingDates(){
  const dates=nextOpenDates();
  const box=bookingOverlay.querySelector('.booking-calendar');
  box.innerHTML=dates.slice(0,12).map(d=>{
    const key=dateKey(d), isSelected=key===booking.date;
    const day=new Intl.DateTimeFormat('pt-PT',{weekday:'short'}).format(d).replace('.','');
    const month=new Intl.DateTimeFormat('pt-PT',{month:'short'}).format(d).replace('.','');
    return `<button type="button" class="booking-date ${isSelected?'selected':''}" data-date="${key}"><span>${day}</span><strong>${d.getDate()}</strong><em>${month}</em></button>`;
  }).join('');
  box.querySelectorAll('.booking-date').forEach(btn=>btn.addEventListener('click',()=>{
    booking.date=btn.dataset.date;
    booking.time=null;
    renderBookingDates();
    renderBookingTimes();
    updateBookingSummary();
  }));
  if(!booking.date){
    const first=dates[0];
    if(first){booking.date=dateKey(first);renderBookingDates();renderBookingTimes();}
  } else renderBookingTimes();
}
function renderBookingTimes(){
  const box=bookingOverlay.querySelector('.booking-times');
  if(!booking.date){box.innerHTML='';return;}
  const slots=generateSlots(booking.date,booking.service);
  box.innerHTML=slots.length ? slots.map(m=>`<button type="button" class="booking-time ${booking.time===m?'selected':''}" data-time="${m}">${slotLabel(m)}</button>`).join('') : '<div class="booking-empty">Sem horários disponíveis para este tratamento neste dia.</div>';
  box.querySelectorAll('.booking-time').forEach(btn=>btn.addEventListener('click',()=>{booking.time=Number(btn.dataset.time);renderBookingTimes();updateBookingSummary();}));
}
function updateBookingSummary(){
  const empty=bookingOverlay.querySelector('.booking-summary-empty');
  const data=bookingOverlay.querySelector('.booking-summary-data');
  if(!booking.service){empty.style.display='block';data.style.display='none';return;}
  empty.style.display='none';data.style.display='block';
  bookingOverlay.querySelector('.summary-service').textContent=booking.service.name;
  bookingOverlay.querySelector('.summary-duration').textContent=`${booking.service.duration} min`;
  bookingOverlay.querySelector('.summary-price').textContent=money(booking.service.price);
  bookingOverlay.querySelector('.summary-date').textContent=booking.date?prettyDate(booking.date):'Escolha uma data';
  bookingOverlay.querySelector('.summary-time').textContent=booking.time!==null?slotLabel(booking.time):'Escolha uma hora';
  const form=bookingOverlay.querySelector('.booking-form');
  bookingOverlay.querySelector('.booking-submit').disabled=!(booking.date && booking.time!==null && form.checkValidity());
}

const openBooking=()=>{
  bookingOverlay.classList.add('open');
  document.body.classList.add('booking-open');
  renderBookingServices();renderBookingDates();updateBookingSummary();
  setTimeout(()=>bookingOverlay.querySelector('.booking-service')?.focus(),100);
};
const closeBooking=()=>{bookingOverlay.classList.remove('open');document.body.classList.remove('booking-open');};
bookingOverlay.querySelector('.booking-close').addEventListener('click',closeBooking);
bookingOverlay.addEventListener('click',(e)=>{if(e.target===bookingOverlay)closeBooking();});
document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&bookingOverlay.classList.contains('open'))closeBooking();});
bookingOverlay.querySelector('.booking-form').addEventListener('input',updateBookingSummary);
bookingOverlay.querySelector('.booking-form').addEventListener('submit',(e)=>{
  e.preventDefault();
  const form=new FormData(e.currentTarget);
  const record={
    id:`GLV-${Date.now().toString(36).toUpperCase()}`,
    service:booking.service.name,
    price:booking.service.price,
    duration:booking.service.duration,
    date:booking.date,
    minutes:booking.time,
    name:String(form.get('name')).trim(),
    phone:String(form.get('phone')).trim(),
    email:String(form.get('email')).trim(),
    createdAt:new Date().toISOString()
  };
  const all=storageGet(); all.push(record); storageSet(all);
  bookingOverlay.querySelector('.booking-summary-data').style.display='none';
  bookingOverlay.querySelector('.booking-success').classList.add('show');
  bookingOverlay.querySelector('.booking-code').textContent=`${record.id} · ${prettyDate(record.date)} · ${slotLabel(record.minutes)}`;
});
bookingOverlay.querySelector('.new-booking').addEventListener('click',()=>{
  booking.date=null;booking.time=null;booking.service=BOOKING_CONFIG.services[0];
  bookingOverlay.querySelector('.booking-success').classList.remove('show');
  renderBookingServices();renderBookingDates();updateBookingSummary();
});

/* Turn every Fresha CTA into the native site booking experience. */
document.querySelectorAll('a[href*="fresha.com"]').forEach(link=>{
  link.removeAttribute('target');
  link.removeAttribute('rel');
  link.addEventListener('click',(e)=>{e.preventDefault();openBooking();});
});

document.querySelectorAll('.service-row').forEach(row=>{
  row.style.cursor='pointer';
  row.addEventListener('click',()=>openBooking());
});

/* Hide references to the old external provider in the rendered interface. */
document.querySelectorAll('body *').forEach((el)=>{
  if(el.children.length===0 && /Fresha/i.test(el.textContent)){
    el.textContent=el.textContent.replace(/Fresha/gi,'agenda online');
  }
});

/* ---------- Reveal animations ---------- */
const revealEls=document.querySelectorAll('.hero-copy,.hero-visual,.intro-main,.service-row,.editorial-image,.editorial-copy,.compare-heading,.compare-frame,.gallery-intro,.gallery-mosaic,.testimonial-side,.testimonial-main,.booking-band,.contact-section');
revealEls.forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(22px)';el.style.transition=`opacity .7s ${Math.min(i*.03,.3)}s cubic-bezier(.2,.7,.1,1),transform .7s ${Math.min(i*.03,.3)}s cubic-bezier(.2,.7,.1,1)`});
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='none';obs.unobserve(e.target)}}),{threshold:.12});
revealEls.forEach(el=>obs.observe(el));
