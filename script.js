const quotes=[
 ['Tom','“Muito profissional incrível, gostei muito do atendimento, lugar agradável tranquilo e o serviço de qualidade. Recomendo muito.”'],
 ['Orlando P','“Que se pode dizer... além do tratamento magnífico que nos proporciona também ajuda a alma. Gleivia fantástica como profissional e como pessoa.”'],
 ['Isadora','“Estou muito feliz e satisfeita mais uma vez com o serviço! És incrivelmente maravilhosa Gleivia 💖”'],
 ['António V','“Excelente profissional, sempre cuidadosa e muito atenta ao que faz e com as melhores dicas e técnicas.”']
];
let quoteIndex=0;
const quoteText=document.getElementById('quoteText');const quoteName=document.getElementById('quoteName');const quoteCount=document.getElementById('quoteCount');
function renderQuote(){const q=quotes[quoteIndex];quoteName.textContent=q[0];quoteText.textContent=q[1];quoteCount.textContent=`0${quoteIndex+1} / 04`}
document.getElementById('prev').addEventListener('click',()=>{quoteIndex=(quoteIndex-1+quotes.length)%quotes.length;renderQuote()});
document.getElementById('next').addEventListener('click',()=>{quoteIndex=(quoteIndex+1)%quotes.length;renderQuote()});
const range=document.getElementById('compareRange');const top=document.querySelector('.compare-top');const line=document.querySelector('.compare-line');
function updateCompare(){const v=range.value;top.style.width=v+'%';line.style.left=v+'%';}
range.addEventListener('input',updateCompare);updateCompare();
const revealEls=document.querySelectorAll('.hero-copy,.hero-visual,.intro-main,.service-row,.editorial-image,.editorial-copy,.compare-heading,.compare-frame,.gallery-intro,.gallery-mosaic,.testimonial-side,.testimonial-main,.booking-band,.contact-section');
revealEls.forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(22px)';el.style.transition=`opacity .7s ${Math.min(i*.03,.3)}s cubic-bezier(.2,.7,.1,1),transform .7s ${Math.min(i*.03,.3)}s cubic-bezier(.2,.7,.1,1)`});
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='none';obs.unobserve(e.target)}}),{threshold:.12});revealEls.forEach(el=>obs.observe(el));
