// ========== SHARED CORE ==========
'use strict';
let _A, _userActed=false;
function sfx(f=440,d=.06){
  if(!_userActed)return;
  try{_A=_A||new(window.AudioContext||window.webkitAudioContext)();
    const o=_A.createOscillator(),g=_A.createGain();
    o.type='square';o.frequency.value=f;g.gain.value=.04;
    o.connect(g);g.connect(_A.destination);o.start();
    g.gain.exponentialRampToValueAtTime(.0001,_A.currentTime+d);
    o.stop(_A.currentTime+d);
  }catch(e){}
}
addEventListener('pointerdown',()=>{_userActed=true},{once:true});
addEventListener('keydown',()=>{_userActed=true},{once:true});

// Clock (all pages have #clk)
const _clk=document.getElementById('clk');
if(_clk)setInterval(()=>{_clk.textContent=new Date().toTimeString().slice(0,8)},1000);

// Nav hover SFX (shared)
document.querySelectorAll('.side a,.foot a,.btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>sfx(680,.03));
  el.addEventListener('click',()=>sfx(960,.05));
});
// Burger + offcanvas
document.querySelectorAll('.burger').forEach(b=>b.addEventListener('click',()=>sfx(780,.05)));
document.querySelectorAll('.offcanvas').forEach(oc=>{
  oc.addEventListener('shown.bs.offcanvas',()=>sfx(900,.05));
  oc.addEventListener('hidden.bs.offcanvas',()=>sfx(500,.05));
});
// Chip hover (delegated so it also catches dynamically-injected chips)
document.addEventListener('mouseenter',e=>{
  const t=e.target;
  if(t&&t.classList&&t.classList.contains('chip'))sfx(760,.02);
},true);

// ========== HOME ==========
const boot=document.getElementById('boot');
if(boot){
  const fl=document.getElementById('fl'),tp=document.getElementById('tp'),mono=document.getElementById('mono'),cmd=document.getElementById('cmd'),out=document.getElementById('out');
  let p=0,started=false;
  const iv=setInterval(()=>{
    p+=4;fl.style.width=p+'%';
    if(p%20===0)sfx(300+p*4,.03);
    if(p>=100){clearInterval(iv);setTimeout(()=>{boot.classList.add('off');sfx(660,.08);setTimeout(()=>sfx(880,.1),100);startType()},400)}
  },30);
  addEventListener('keydown',e=>{if(!boot.classList.contains('off')){sfx(880,.1);boot.classList.add('off');clearInterval(iv);startType()}},{once:true});

  const lines=['Currently shipping: Steam OWNED campaign.','Available for freelance & full-time.','Press Start 2P enjoyer since 2003.','Coffee + pixels = portfolio.'];
  let li=0,ci=0,del=false;
  function startType(){if(started)return;started=true;setTimeout(type,500)}
  function type(){const l=lines[li];tp.textContent=l.slice(0,ci);if(!del&&ci<l.length){ci++;setTimeout(type,55)}else if(!del){del=true;setTimeout(type,1800)}else if(ci>0){ci--;setTimeout(type,25)}else{del=false;li=(li+1)%lines.length;setTimeout(type,300)}}

  // Monogram glitch
  const mv='DSB';
  mono.addEventListener('mouseenter',()=>{sfx(520,.05);let i=0;const gt=setInterval(()=>{mono.textContent=[...mv].map(c=>Math.random()<.4?String.fromCharCode(33+Math.random()*90):c).join('');if(++i>8){clearInterval(gt);mono.textContent=mv}},40)});

  // Stat counters
  const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const el=e.target,t=+el.dataset.c;let n=0;const st=setInterval(()=>{n+=Math.ceil(t/20);if(n>=t){n=t;clearInterval(st);sfx(1100+Math.random()*200,.05)}el.textContent=n},50);sio.unobserve(el)}}));
  document.querySelectorAll('.stat .n').forEach(n=>sio.observe(n));

  // Terminal
  cmd.addEventListener('keydown',e=>{if(e.key==='Enter'){sfx(700,.04);const v=cmd.value.trim().toLowerCase();const r={help:'cmds: whoami, contact, work, clear',whoami:'divshaan singh brar',contact:'→ opening comms...',work:'→ redirecting...',clear:''}[v]||'command not found: '+v;out.textContent=r;if(v==='work')setTimeout(()=>location.href='portfolio.html',500);if(v==='contact')setTimeout(()=>location.href='contact.html',500);cmd.value=''}});
  // Typewriter key clicks in the terminal
  cmd.addEventListener('keydown',e=>{if(e.key.length===1)sfx(1700+Math.random()*200,.012);else if(e.key==='Backspace')sfx(420,.02)});
}

// ========== ABOUT ==========
const up=document.getElementById('up');
if(up){
  const bd=new Date(2003,9,9,20,55);
  setInterval(()=>{const y=((Date.now()-bd)/31557600000).toFixed(4);up.innerHTML=y+' <b>YRS</b>'},100);

  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w+'%';sfx(500+Math.random()*300,.04);io.unobserve(e.target)}}),{threshold:.3});
  document.querySelectorAll('.fl[data-w]').forEach(f=>io.observe(f));

  const io2=new IntersectionObserver(es=>es.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>{e.target.classList.add('on');sfx(700,.04)},i*150);io2.unobserve(e.target)}}),{threshold:.2});
  document.querySelectorAll('.ev').forEach(e=>io2.observe(e));

  document.querySelectorAll('.tool').forEach(t=>{t.addEventListener('mouseenter',()=>sfx(800,.03));t.addEventListener('click',()=>sfx(1150,.05))});

  const k=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let ki=0;
  const kn=document.getElementById('kn');
  addEventListener('keydown',e=>{if(e.key.toLowerCase()===k[ki].toLowerCase()){ki++;sfx(600+ki*60,.05);if(ki===k.length){ki=0;if(kn)kn.classList.add('off');document.body.style.animation='spin 1s';setTimeout(()=>{alert('🎮 CHEAT UNLOCKED: You just hired me.');document.body.style.animation=''},1100);for(let i=0;i<8;i++)setTimeout(()=>sfx(400+i*80,.08),i*80)}}else{if(ki>0)sfx(200,.08);ki=0}});
  const st=document.createElement('style');st.textContent='@keyframes spin{to{transform:rotate(360deg) scale(.95)}}';document.head.appendChild(st);
}

// ========== CONTACT ==========
const frm=document.getElementById('frm');
if(frm){
  const nm=document.getElementById('nm'),em=document.getElementById('em'),ms=document.getElementById('ms'),tp2=document.getElementById('tp'),cc=document.getElementById('cc'),tx=document.getElementById('tx'),txfl=document.getElementById('txfl'),tz=document.getElementById('tz');
  ms.addEventListener('input',()=>{cc.textContent=ms.value.length;sfx(900,.02)});
  [nm,em].forEach(el=>el.addEventListener('input',()=>sfx(850,.02)));
  if(tp2)tp2.addEventListener('change',()=>{sfx(850,.04);setTimeout(()=>sfx(1050,.04),60)});
  document.querySelectorAll('.cp').forEach(el=>{el.addEventListener('click',()=>{navigator.clipboard.writeText(el.dataset.cp);el.classList.add('ok');sfx(1000,.06);setTimeout(()=>sfx(1200,.06),80);setTimeout(()=>el.classList.remove('ok'),1800)})});
  let txIv=null;
  frm.addEventListener('submit',e=>{e.preventDefault();if(!nm.value||!em.value||!ms.value){sfx(180,.18);setTimeout(()=>sfx(140,.22),110);return}sfx(660,.08);setTimeout(()=>sfx(880,.1),100);tx.classList.add('on');let p=0;txIv=setInterval(()=>{p+=3;txfl.style.width=p+'%';if(p%15===0)sfx(400+p*6,.03);if(p>=100){clearInterval(txIv);txIv=null;setTimeout(()=>{tx.classList.add('done');[1000,1200,1400].forEach((f,i)=>setTimeout(()=>sfx(f,.1),i*120));const body=encodeURIComponent(`From: ${nm.value}\nEmail: ${em.value}\nType: ${tp2.value}\n\n${ms.value}`);window.location.href=`mailto:singhbrardivshaan@gmail.com?subject=${encodeURIComponent('['+tp2.value+'] from '+nm.value)}&body=${body}`},300)}},25)});
  document.querySelectorAll('[data-tx-close]').forEach(b=>b.addEventListener('click',()=>{sfx(440,.06);if(txIv){clearInterval(txIv);txIv=null}tx.classList.remove('on','done');txfl.style.width='0'}));
  try{tz.textContent=Intl.DateTimeFormat().resolvedOptions().timeZone}catch(e){}
}

// ========== PORTFOLIO ==========
const stg=document.getElementById('stg');
if(stg){
  const P=[
   {n:'01',cat:'BRAND CAMPAIGN',yr:'2025',title:'SAPPORO',role:'ART DIRECTION / PRINT',
    folder:'sapporo',
    imgs:['sap1.jpg','sap2.jpg','sap3.jpg','sap4.jpg','sap5.jpg','sap6.jpg','spa7.jpg','spa8.jpg','spa9.jpg'],
    desc:'A bold integrated campaign for Sapporo Premium leaning into its <b>samurai legacy</b>. Visual system, OOH and tone of voice positioning it as the thinking drinker\'s lager.',
    story:'Sapporo needed to re-center its samurai heritage without leaning on a dated gimmick. I built a <b>disciplined visual system</b> — single-stroke sumi brush marks, a restrained palette of ink black, paper white and Sapporo red, and a type voice that mixes Western editorial with Japanese vertical cadence. The campaign runs across print, OOH and digital, always framing the drinker as the patient, thinking warrior.',
    chips:['Art Direction','Campaign','Print','Copy']},
   {n:'02',cat:'BRANDING',yr:'2024',title:'DEPOP',role:'BRANDING / ADVERTISING',
    folder:'depop',
    imgs:['Adcamp1-07.jpg','Adcamp1-01.jpg','Adcamp1-02.jpg','Adcamp1-03.jpg','Adcamp1-04.jpg','Adcamp1-05.jpg','Adcamp1-06.jpg'],
    desc:'Reimagined Depop\'s youth-first energy into a <b>high-contrast print campaign</b> celebrating Gen-Z resellers.',
    story:'Depop\'s existing comms felt indistinguishable from every other Gen-Z marketplace. I leaned the opposite way — <b>editorial posters</b> that treat individual sellers like magazine cover stars. Layouts borrow from 90s fashion rags: big, loud serif heads; wide margins; collage overlays; warm film grain. The goal: make resellers feel seen, not just sold to.',
    chips:['Branding','Advertising','Typography']},
   {n:'03',cat:'INTEGRATED',yr:'2025',title:'RED CROSS',role:'INTEGRATED CAMPAIGN',
    folder:'redcross',
    imgs:['rc1.jpg','rc2.jpg','rc3.jpg','rc4.jpg'],
    desc:'<b>"Panic is Optional"</b> — emergency-preparedness spanning print, OOH, Reels and direct mail.',
    story:'Most emergency-prep comms scream at you. <b>"Panic is Optional"</b> takes the opposite posture — a calm, typographic voice that assumes the reader is an adult. Soft serif headlines, generous whitespace, a single red accent. The campaign scales from a mailed preparedness booklet down to 9:16 reels, with each touchpoint making one small, doable ask.',
    chips:['Integrated','OOH','Social','DM']},
   {n:'04',cat:'EDITORIAL',yr:'2024',title:'GAMESCOM',role:'EDITORIAL / EVENT BRANDING',
    folder:'gamescom',
    imgs:['edim.jpg','edi1-01.jpg','edi1-02.jpg','edi1-03.jpg','edi1-04.jpg','edi1-05.jpg','edi1-06.jpg'],
    desc:'An editorial-led identity for Gamescom exploring the <b>intersection of gaming and print</b>.',
    story:'Gamescom\'s print footprint was an afterthought. I treated it like a magazine instead — <b>pixel grids as editorial grids</b>, 8-bit glyphs as decorative caps, and CMYK-overprint as a nod to arcade misregistration. Covers, features and booth signage all speak the same language: gaming culture viewed through a designer\'s eye.',
    chips:['Editorial','Event','Pixel']},
   {n:'05',cat:'WEB DESIGN',yr:'2025',title:'BERKSHIRE',role:'WEB REDESIGN / HTML-CSS',
    folder:'berkshire',
    imgs:['webm.jpg','web1.jpg','webm2.jpg'],
    site:'https://divshaan.github.io/BERKSHIRE-HATHAWAY-Sample/',
    desc:'Full-scale redesign concept for Berkshire Hathaway — bringing a storied site into a <b>modern, accessible design system</b>. <i>Live demo shown on the right.</i>',
    story:'<b>berkshirehathaway.com</b> is legendary for being stuck in 1997. I wrote a redesign that keeps its famously restrained tone but applies a modern system: a proper type scale, intentional whitespace, accessible contrast, and a semantic document structure. The visual voice stays dry and serious — but the information is finally reachable. Live demo: <b>divshaan.github.io/BERKSHIRE-HATHAWAY-Sample</b>.',
    chips:['Web','UX','HTML/CSS']}
  ];
  const strip=document.getElementById('strip'),dts=document.getElementById('dts'),trk=document.getElementById('trk'),pv=document.getElementById('pv'),nx=document.getElementById('nx'),cn=document.getElementById('cn'),tt=document.getElementById('tt');
  P.forEach(p=>{
    const s=document.createElement('div');s.className='slide';
    const media=p.site
      ? `<div class="pimg live"><span class="tag">${p.cat}</span><div class="livelabel">● LIVE PREVIEW</div><iframe src="${p.site}" title="${p.title} — live site preview" loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups"></iframe><a class="iframe-shield" href="${p.site}" target="_blank" rel="noopener" aria-label="Open ${p.title} site in a new tab"></a></div>`
      : `<div class="pimg"><span class="tag">${p.cat}</span>${p.imgs.map((src,i)=>`<img src="./images/${p.folder}/${src}" alt="${p.title} ${i+1} of ${p.imgs.length}" loading="lazy"${i===0?' class="on"':''}>`).join('')}<span class="imgcnt">01 / ${String(p.imgs.length).padStart(2,'0')}</span></div>`;
    const cta=p.site
      ? `<a class="btn yl" href="${p.site}" target="_blank" rel="noopener" data-site="${p.n}">► OPEN LIVE SITE <i class="bi bi-box-arrow-up-right"></i></a>`
      : `<button class="btn yl" data-case="${p.n}" type="button">► VIEW CASE STUDY</button>`;
    s.innerHTML=`<div class="num">FRAME <b>${p.n}</b> / 05</div>${media}<div class="pinfo"><div class="y">&gt; ${p.yr} // ${p.cat}</div><h2>${p.title}</h2><div class="role">${p.role}</div><p>${p.desc}</p><div class="chips">${p.chips.map(c=>`<span class="chip">${c}</span>`).join('')}</div>${cta}</div>`;
    strip.appendChild(s);
  });
  P.forEach((_,i)=>{const d=document.createElement('div');d.className='d2';d.setAttribute('aria-label','Go to slide '+(i+1));d.onclick=()=>go(i);dts.appendChild(d)});
  let idx=0;const slides=document.querySelectorAll('.slide');
  tt.textContent=String(P.length).padStart(2,'0');
  // Per-slide image cycler
  const cyclers=[];
  slides.forEach((s,i)=>{
    const imgs=s.querySelectorAll('.pimg img');
    const cnt=s.querySelector('.imgcnt');
    if(imgs.length>1){
      let ci=0,iv=null;
      const tick=()=>{imgs[ci].classList.remove('on');ci=(ci+1)%imgs.length;imgs[ci].classList.add('on');sfx(1500+Math.random()*200,.015);if(cnt)cnt.textContent=String(ci+1).padStart(2,'0')+' / '+String(imgs.length).padStart(2,'0')};
      cyclers.push({
        start:()=>{if(iv)return;iv=setInterval(tick,2400)},
        stop:()=>{if(iv){clearInterval(iv);iv=null}}
      });
    }else cyclers.push({start:()=>{},stop:()=>{}});
  });
  function go(i){
    idx=Math.max(0,Math.min(P.length-1,i));
    const sw=window.innerWidth*.84;
    const sideW=window.innerWidth>900?180:0;
    const off=(window.innerWidth-sideW-sw)/2;
    strip.style.transform=`translateX(${off-idx*sw}px)`;
    slides.forEach((s,j)=>s.classList.toggle('on',j===idx));
    document.querySelectorAll('.d2').forEach((d,j)=>d.classList.toggle('on',j===idx));
    cn.textContent=String(idx+1).padStart(2,'0');
    trk.style.width=((idx+1)/P.length*100)+'%';
    pv.disabled=idx===0;nx.disabled=idx===P.length-1;
    cyclers.forEach((c,j)=>j===idx?c.start():c.stop());
    sfx(500+idx*80,.06);setTimeout(()=>sfx(700+idx*80,.04),60);
  }
  pv.onclick=()=>go(idx-1);nx.onclick=()=>go(idx+1);
  addEventListener('keydown',e=>{if(cs.classList.contains('on'))return;if(e.key==='ArrowRight')go(idx+1);if(e.key==='ArrowLeft')go(idx-1)});
  let wt=0;stg.addEventListener('wheel',e=>{if(!stg.contains(e.target))return;e.preventDefault();if(Date.now()-wt<900)return;wt=Date.now();go(idx+(e.deltaY>0||e.deltaX>0?1:-1))},{passive:false});
  let sx=0,dg=false;stg.addEventListener('mousedown',e=>{if(e.target.closest('iframe,.iframe-shield'))return;dg=true;sx=e.clientX;stg.classList.add('drag')});
  addEventListener('mouseup',e=>{if(!dg)return;dg=false;stg.classList.remove('drag');const d=e.clientX-sx;if(Math.abs(d)>80)go(idx+(d<0?1:-1))});
  stg.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  stg.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>60)go(idx+(d<0?1:-1))});
  addEventListener('resize',()=>go(idx));

  // Case study modal
  const cs=document.getElementById('cs');
  const csBody=document.getElementById('csBody');
  const csClose=document.getElementById('csClose');
  function openCase(n){
    const p=P.find(x=>x.n===n);if(!p)return;
    csBody.innerHTML=`<div class="cs-head"><div class="cs-meta">&gt; FRAME ${p.n} // ${p.cat} // ${p.yr}</div><h2>${p.title}</h2><div class="cs-role">${p.role}</div></div><div class="cs-story"><p>${p.story||p.desc}</p><div class="chips">${p.chips.map(c=>`<span class="chip">${c}</span>`).join('')}</div></div><div class="cs-gallery">${p.imgs.map((src,i)=>`<figure><img src="./images/${p.folder}/${src}" alt="${p.title} image ${i+1}" loading="lazy"><figcaption>IMG_${String(i+1).padStart(2,'0')}.JPG</figcaption></figure>`).join('')}</div>`;
    cs.classList.add('on');document.body.classList.add('lockcs');
    sfx(660,.08);setTimeout(()=>sfx(880,.1),100);
    csBody.scrollTop=0;
  }
  function closeCase(){cs.classList.remove('on');document.body.classList.remove('lockcs');sfx(440,.06)}
  strip.addEventListener('click',e=>{
    const t=e.target.closest('[data-case]');
    if(t){e.preventDefault();sfx(880,.08);openCase(t.dataset.case)}
    const s=e.target.closest('[data-site]');
    if(s){sfx(1000,.08)}
  });
  csClose.addEventListener('click',closeCase);
  cs.addEventListener('click',e=>{if(e.target===cs)closeCase()});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&cs.classList.contains('on'))closeCase()});

  setTimeout(()=>go(0),250);
  document.body.classList.add('lock');
}

// ========== V2: TERMINAL EASTER EGGS (home only) ==========
if(document.getElementById('cmd')){
  const cmd=document.getElementById('cmd'),out=document.getElementById('out');
  const extra={
    'sudo hire me':()=>{document.body.style.animation='shake .4s 3';return'→ application submitted to dsb@reality.exe'},
    'matrix':()=>{const o=document.createElement('div');o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.9);color:#0f0;font-family:monospace;font-size:14px;z-index:9000;padding:20px;overflow:hidden;cursor:pointer';o.textContent=Array(400).fill('01').join(' ');o.onclick=()=>o.remove();document.body.appendChild(o);return'→ wake up, divshaan...'},
    'theme pink':()=>{document.documentElement.style.setProperty('--cy','#ff77cc');document.documentElement.style.setProperty('--yl','#ffccee');return'→ theme: rose quartz'},
    'theme default':()=>{document.documentElement.style.setProperty('--cy','#8aceff');document.documentElement.style.setProperty('--yl','#ffdd74');return'→ theme: default'},
    'snake':()=>'→ jk, play at https://playsnake.org',
    'coffee':()=>'→ brewing... ☕',
    'ls -la':()=>'drwxr-xr-x  dreams  ambition  caffeine  pixels'
  };
  const extraSfx={
    'sudo hire me':()=>[1200,1400,1600,2000].forEach((f,i)=>setTimeout(()=>sfx(f,.08),i*80)),
    'matrix':()=>{for(let i=0;i<6;i++)setTimeout(()=>sfx(220+i*40,.08),i*60)},
    'theme pink':()=>[1200,1500,1800].forEach((f,i)=>setTimeout(()=>sfx(f,.08),i*90)),
    'theme default':()=>[900,1100,1300].forEach((f,i)=>setTimeout(()=>sfx(f,.08),i*90)),
    'snake':()=>[600,800,600,800].forEach((f,i)=>setTimeout(()=>sfx(f,.08),i*100)),
    'coffee':()=>[500,650,800].forEach((f,i)=>setTimeout(()=>sfx(f,.08),i*120)),
    'ls -la':()=>{for(let i=0;i<5;i++)setTimeout(()=>sfx(700+i*90,.04),i*50)}
  };
  cmd.addEventListener('keydown',e=>{if(e.key==='Enter'){const v=cmd.value.trim().toLowerCase();if(extra[v]){out.textContent=extra[v]();(extraSfx[v]||(()=>sfx(700,.04)))();cmd.value='';e.stopImmediatePropagation()}}},true);
  const sh=document.createElement('style');sh.textContent='@keyframes shake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}';document.head.appendChild(sh);
}
