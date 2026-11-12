(()=>{
  const bust='?v='+Date.now();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const get=async p=>{const r=await fetch(p+bust,{cache:'no-store'});if(!r.ok)throw new Error(p);return r.json()};

  const style=document.createElement('style');
  style.textContent=`
    a,.btn,.text-link,.channel-actions a,.about-tabs a,.gallery-filter button,.quick-menu a{cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,background .18s ease,color .18s ease,opacity .18s ease}
    .btn:hover,.channel-actions a:hover,.about-tabs a:hover,.gallery-filter button:hover,.quick-menu a:hover{transform:translateY(-2px)}
    .quick-menu a:hover{background:#f5f9f6}
    .smart-link-card{position:relative;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;outline:none}
    .smart-link-card:hover,.smart-link-card:focus-visible{transform:translateY(-4px);box-shadow:0 18px 40px rgba(20,54,41,.14);border-color:rgba(47,107,79,.32)}
    .smart-link-card:focus-visible{box-shadow:0 0 0 3px rgba(47,107,79,.18),0 18px 40px rgba(20,54,41,.14)}
    .smart-link-arrow{position:absolute;right:16px;top:16px;z-index:5;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.95);color:#2f6b4f;font-size:20px;font-weight:900;box-shadow:0 8px 20px rgba(20,54,41,.12);opacity:0;transform:translateX(-4px);transition:.18s ease;pointer-events:none}
    .smart-link-card:hover .smart-link-arrow,.smart-link-card:focus-visible .smart-link-arrow{opacity:1;transform:translateX(0)}
    .site-footer{padding:52px 0 24px!important}.footer-main{display:grid;grid-template-columns:1.1fr 1.4fr .8fr;gap:42px;align-items:start}.footer-brand .brand{margin-bottom:18px}.footer-brand p{margin:0;color:#9fb0a7;font-size:13px;line-height:1.8}.footer-info{display:grid;gap:8px;color:#becbc4;font-size:13px}.footer-info b{color:#edf5f0;margin-right:8px}.footer-links{display:grid;gap:8px}.footer-links a{color:#dce8e1;font-size:13px;font-weight:700}.footer-links a:hover{color:#fff;text-decoration:underline}.footer-bottom{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,.12);margin-top:34px;padding-top:20px}.footer-bottom .copyright{border:0!important;margin:0!important;padding:0!important}.footer-policy{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:#829188}.footer-policy a:hover{color:#dce8e1}.footer-contact-row{display:flex;gap:14px;flex-wrap:wrap}.footer-contact-row a{display:inline-flex;align-items:center;gap:6px;color:#dce8e1;font-weight:700}
    /* The carousel is photo-first. Do not overlay translucent copy panels on photos. */ .hero.hero-photo-first{display:block!important;position:relative!important;min-height:0!important;padding:0!important;overflow:hidden!important;background:#fff!important;color:#234733!important} .hero.hero-photo-first::before,.hero.hero-photo-first::after{content:none!important;display:none!important} .hero-photo-first .hero-carousel-shell{width:100%!important;max-width:1200px!important;margin:0 auto!important;padding:0!important} .hero-photo-first .hero-carousel-viewport{display:block!important;position:relative!important;min-height:0!important;overflow:hidden!important;container-type:inline-size!important} .hero-photo-first .site-hero-item{display:none!important;animation:heroFade .3s ease;width:100%!important;min-height:0!important;height:auto!important;background:none!important} .hero-photo-first .site-hero-item.active{display:flex!important;flex-direction:column!important;align-items:stretch!important}  .hero-photo-first .hero-photo-picture{display:block!important;width:100%!important;flex:0 0 auto!important} .hero-photo-first .hero-photo-media{display:block!important;width:100%!important;height:auto!important;aspect-ratio:16 / 9!important;flex:0 0 auto!important;object-fit:cover!important;object-position:center 65%!important;filter:none!important;opacity:1!important;background:#e7eee8!important} .hero-photo-first .hero-copy{display:block!important;position:relative!important;inset:auto!important;transform:none!important;min-height:0!important;width:100%!important;padding:19px max(24px,calc((100vw - 1090px)/2)) 23px!important;background:#fff!important;color:#244633!important;border:0!important;border-radius:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important} .hero-photo-first .hero-label{font-size:12px!important;letter-spacing:.14em!important;font-weight:900!important;color:#387754!important;line-height:1.5!important;margin:0 0 6px!important} .hero-photo-first .hero-copy h1{font-size:clamp(24px,2.8vw,34px)!important;line-height:1.25!important;letter-spacing:-.045em!important;color:#224631!important;margin:0!important;max-width:1100px!important} .hero-photo-first .hero-copy p{font-size:clamp(14px,1.5vw,17px)!important;line-height:1.65!important;color:#5c6e64!important;margin:0!important;max-width:950px!important} .hero-photo-first .hero-glass-meta{display:flex;gap:7px;flex-wrap:wrap;margin:14px 0 0;font-size:12px} .hero-photo-first .hero-glass-meta span{padding:5px 10px;border-radius:999px;border:1px solid #d8e5da;background:#f1f7f2;color:#365e48;font-weight:700} .hero-photo-first .hero-copy-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:14px} .hero-photo-first .hero-copy-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:41px;padding:0 20px;border-radius:999px;background:#2f6b4f;color:#fff;font-weight:800;font-size:14px} .hero-photo-first .hero-copy-actions a.ghost{background:#fff;color:#2f6b4f;border:1px solid #9ebca8} .hero-photo-first .hero-carousel-controls{position:absolute!important;left:16px!important;right:16px!important;top:calc(56.25cqw - 60px)!important;bottom:auto!important;height:48px!important;display:flex!important;justify-content:space-between!important;align-items:center!important;gap:12px!important;pointer-events:none!important;z-index:10!important} .hero-photo-first .hero-carousel-nav{display:flex;gap:8px;pointer-events:auto} .hero-photo-first .hero-carousel-nav button{width:42px;height:42px;border:1px solid rgba(255,255,255,.7);border-radius:50%;background:rgba(20,42,32,.5);color:white;font-size:23px;line-height:1;cursor:pointer;backdrop-filter:none!important;-webkit-backdrop-filter:none!important} .hero-photo-first .hero-carousel-dots{display:flex;gap:7px;align-items:center;pointer-events:auto} .hero-photo-first .hero-carousel-dots button{width:9px;height:9px;min-width:9px;padding:0;border:0;border-radius:100px;background:rgba(255,255,255,.65);cursor:pointer;transition:width .2s} .hero-photo-first .hero-carousel-dots button.active{width:30px;background:#fff} .hero-photo-first .hero-slide-count{display:none!important} @keyframes heroFade{from{opacity:.65}to{opacity:1}}
    @media(max-width:760px){ .smart-link-arrow{opacity:.92;transform:none;width:34px;height:34px;right:12px;top:12px}.smart-link-card:hover{transform:none}.quick-menu a:hover,.btn:hover,.channel-actions a:hover{transform:none}.footer-main{grid-template-columns:1fr;gap:28px}.site-footer{padding:38px 0 22px!important}.footer-bottom{display:block}.footer-policy{margin-top:10px} .hero-photo-first .hero-carousel-viewport{container-type:inline-size!important}.hero-photo-first .hero-photo-media{width:100%!important;aspect-ratio:1 / 1!important;height:auto!important;object-fit:cover!important;object-position:center!important} .hero-photo-first .hero-copy{padding:15px 20px 19px!important} .hero-photo-first .hero-label{font-size:10px!important;letter-spacing:.09em!important} .hero-photo-first .hero-copy h1{font-size:clamp(20px,5.4vw,24px)!important;line-height:1.3!important;word-break:keep-all!important;display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;overflow:hidden!important} .hero-photo-first .hero-copy p{font-size:14px!important} .hero-photo-first .hero-carousel-controls{left:12px!important;right:12px!important;top:calc(100cqw - 54px)!important} .hero-photo-first .hero-carousel-nav button{width:38px;height:38px} .hero-photo-first .hero-copy-actions{margin-top:12px!important}.hero-photo-first .hero-copy-actions a{min-height:40px;padding:0 16px} }
  `;
  /* Keep shortcut tiles below carousel text and action buttons on all viewports. */
  style.textContent += `
    body:has(.hero-photo-first) .quick-wrap{
      margin-top:24px!important;
      margin-bottom:18px!important;
      position:relative!important;
      z-index:1!important;
      clear:both!important;
    }
    @media(max-width:760px){
      body:has(.hero-photo-first) .quick-wrap{margin-top:18px!important}
    }
  `;
  /* Subtle color correction for the first hero photo only (PC and mobile). */
  style.textContent += '.hero-photo-first .hero-carousel-item[data-hero-slide="0"] .hero-photo-media{filter:brightness(.97) saturate(.90) contrast(.96)!important}';
  document.head.appendChild(style);

  function safeImg(el,src){
    if(!el)return;
    if(!src){if(el.tagName==='IMG')el.style.display='none';return}
    if(el.tagName==='IMG'){el.style.display='block';el.src=src;el.onerror=()=>{el.style.display='none'}}
    else{el.style.backgroundImage=el.matches('.about-photo,.worship-heroimg')?`url('${src}')`:`linear-gradient(rgba(10,35,26,.18),rgba(10,35,26,.34)),url('${src}')`;const test=new Image();test.onerror=()=>{el.style.backgroundImage='linear-gradient(135deg,#dfe9e3,#eff4f0)'};test.src=src}
  }

  function makeCardLink(el,href,label='자세히 보기',external=false){
    if(!el||!href||el.dataset.smartLinked==='1')return;
    el.dataset.smartLinked='1';el.classList.add('smart-link-card');el.setAttribute('role','link');el.setAttribute('tabindex','0');el.setAttribute('aria-label',label);
    const arrow=document.createElement('span');arrow.className='smart-link-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='→';el.appendChild(arrow);
    const go=()=>external?window.open(href,'_blank','noopener'):location.href=href;
    el.addEventListener('click',e=>{if(e.target.closest('a,button,input,textarea,select'))return;go()});
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})
  }

  function renderFooter(site){
    document.querySelectorAll('.site-footer').forEach(footer=>{
      footer.innerHTML=`<div class="container"><div class="footer-main"><div class="footer-brand"><div class="brand"><img class="brand-logo" src="/assets/site/logo.png" alt="${esc(site.churchName||'모현소망교회')} 공식 로고"><span class="brand-copy"><small>${esc(site.churchNameEn||'MOHYEON SOMANG CHURCH')}</small><strong>${esc(site.churchName||'모현소망교회')}</strong></span></div><p>${esc(site.slogan||'성령과 진리로 예배드리는 교회')}<br>${esc(site.sloganVerse||'요한복음 4:24')}</p></div><div class="footer-info"><div><b>교단</b>${esc(site.denomination||'대한예수교장로회')}</div><div><b>담임목사</b>${esc(site.pastor||'')}</div><div><b>주소</b>${esc(site.address||'')}</div><div class="footer-contact-row"><span><b>전화</b><a href="tel:${esc((site.phone||'').replace(/[^0-9+]/g,''))}">${esc(site.phone||'')}</a></span>${site.email?`<span><b>이메일</b><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></span>`:''}</div></div><div class="footer-links"><a href="/about.html">교회소개</a><a href="/worship.html">예배안내</a><a href="/sermons.html">말씀과 설교</a><a href="/news.html">교회소식</a><a href="/gallery.html">사진첩</a><a href="/visit.html">오시는 길</a>${site.kakao?`<a href="${esc(site.kakao)}" target="_blank" rel="noopener">카카오톡 채널 ↗</a>`:''}${site.youtube?`<a href="${esc(site.youtube)}" target="_blank" rel="noopener">YouTube ↗</a>`:''}</div></div><div class="footer-bottom"><div class="copyright">© 2026 ${esc(site.churchName||'모현소망교회')}. All rights reserved.</div><div class="footer-policy"><a href="/about.html">교회안내</a><a href="/visit.html">오시는 길</a><span>사이트 내 콘텐츠의 무단 사용을 금합니다.</span></div></div></div>`;
    })
  }

  async function initHeroCarousel(site){
    const hero=document.querySelector('.hero');
    const path=location.pathname;
    if(!hero||!(path==='/'||path.endsWith('/index.html')))return;
    let sermons=[],news=[];
    try{[sermons,news]=await Promise.all([get('/content/sermons.json'),get('/content/news.json')])}catch(e){console.warn('hero carousel data fallback',e)}
    const latestSermon=Array.isArray(sermons)?[...sermons].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))[0]:null;
    const latestNews=(Array.isArray(news)?news:[]).filter(n=>String(n.category||n.type||'').toLowerCase()!=='story').slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))[0]||null;
    const scripture=latestSermon?String(latestSermon.text||'').split('·')[0].trim():'';
    const slides=[
      {label:'WELCOME TO MOHYEON SOMANG CHURCH',title:'하나님 중심 · 말씀 중심 · 교회 중심',text:site.heroText||'',image:site.heroImage||site.churchFrontImage||'',mobileImage:site.heroImageMobile||'',meta:[site.denomination,site.pastor,site.slogan].filter(Boolean),actions:[['예배 안내','/worship.html',false],['교회 소개','/about.html',true]]},
      latestSermon&&{label:'LATEST SERMON',title:latestSermon.title||'최근 설교',text:latestSermon.text||'',image:site.carouselSermonImage||latestSermon.image||site.worshipImage||site.heroImage||'',mobileImage:site.carouselSermonImageMobile||'',meta:[latestSermon.date,scripture,site.pastor].filter(Boolean),actions:[['설교 보기','/sermons.html#sermon-0',false]]},
      latestNews&&{label:'CHURCH NEWS',title:latestNews.title||'교회소식',text:latestNews.text||'',image:site.carouselNewsImage||latestNews.image||site.churchFrontImage||site.heroImage||'',mobileImage:site.carouselNewsImageMobile||'',meta:[latestNews.date,'모현소망교회'].filter(Boolean),actions:[['교회소식 보기','/news.html?category=notice&post='+encodeURIComponent(String(latestNews.title||'')),false]]}
    ].filter(Boolean);
    if(!slides.length)return;
    hero.classList.remove('hero-glass');hero.classList.add('hero-photo-first');hero.style.removeProperty('background-image');
    hero.removeAttribute('data-site-image');
    hero.innerHTML=`<div class="container hero-carousel-shell"><div class="hero-carousel-viewport">${slides.map((s,i)=>`<article class="site-hero-item${i===0?' active':''}" data-hero-slide="${i}"><picture class="hero-photo-picture"><source media="(max-width:760px)" srcset="${esc(s.mobileImage||s.image)}"><img class="hero-photo-media" src="${esc(s.image)}" alt="${esc(s.label)}" loading="${i===0?'eager':'lazy'}" decoding="async"></picture><div class="hero-copy"><div class="hero-label">${esc(s.label)}</div><h1>${esc(s.title).replace(/\n/g,'<br>')}</h1><div class="hero-copy-actions">${s.actions.map((a,j)=>`<a${j?' class="ghost"':''} href="${esc(a[1])}">${esc(a[0])}</a>`).join('')}</div></div></article>`).join('')}<div class="hero-carousel-controls"><div class="hero-carousel-nav"><button type="button" data-hero-prev aria-label="이전 배너">‹</button><button type="button" data-hero-next aria-label="다음 배너">›</button></div><div class="hero-carousel-dots">${slides.map((_,i)=>`<button type="button" data-hero-dot="${i}" class="${i===0?'active':''}" aria-label="${i+1}번째 배너"></button>`).join('')}</div><div class="hero-slide-count"><span data-hero-current>01</span> / ${String(slides.length).padStart(2,'0')}</div></div></div></div>`;
    const items=[...hero.querySelectorAll('[data-hero-slide]')],dots=[...hero.querySelectorAll('[data-hero-dot]')];
    let current=0,timer=null,touchStart=0;
    const show=n=>{current=(n+slides.length)%slides.length;items.forEach((el,i)=>{const selected=i===current;el.classList.toggle('active',selected);el.style.setProperty('display',selected?'flex':'none','important');el.setAttribute('aria-hidden',String(!selected));});dots.forEach((el,i)=>el.classList.toggle('active',i===current));const count=hero.querySelector('[data-hero-current]');if(count)count.textContent=String(current+1).padStart(2,'0')};
    const stop=()=>{if(timer){clearInterval(timer);timer=null}};
    const start=()=>{stop();if(slides.length>1)timer=setInterval(()=>show(current+1),6500)};
    hero.querySelector('[data-hero-prev]')?.addEventListener('click',()=>{show(current-1);start()});
    hero.querySelector('[data-hero-next]')?.addEventListener('click',()=>{show(current+1);start()});
    dots.forEach((d,i)=>d.addEventListener('click',()=>{show(i);start()}));
    hero.addEventListener('mouseenter',stop);hero.addEventListener('mouseleave',start);hero.addEventListener('focusin',stop);hero.addEventListener('focusout',start);
    hero.addEventListener('touchstart',e=>{touchStart=e.touches[0]?.clientX||0},{passive:true});
    hero.addEventListener('touchend',e=>{const x=e.changedTouches[0]?.clientX||0;if(Math.abs(x-touchStart)>48){show(current+(x<touchStart?1:-1));start()}},{passive:true});
    show(0);start();
  }

  document.querySelectorAll('a').forEach(a=>{const t=a.textContent.replace(/\s+/g,' ').trim();if((t==='소식'||t==='교회소식')&&!a.closest('.hero-slide')&&!a.closest('.feature-card'))a.href='/news.html?v=news2'});
  document.querySelectorAll('.navlinks').forEach(nav=>{if(!nav.querySelector('a[href*="gallery.html"]')){const link=document.createElement('a');link.href='/gallery.html';link.textContent='사진첩';if(document.title.includes('사진첩'))link.className='active';const visit=[...nav.querySelectorAll('a')].find(a=>a.textContent.trim()==='오시는 길');if(visit)nav.insertBefore(link,visit);else nav.appendChild(link)}});

  async function renderGallery(){
    const box=document.querySelector('[data-gallery-list]');if(!box)return;
    try{const photos=await get('/content/gallery.json');const empty=document.querySelector('[data-gallery-empty]');const render=filter=>{const list=filter==='전체'?photos:photos.filter(p=>p.category===filter);box.innerHTML=list.map(p=>`<article class="photo-card"><div class="photo-media"><img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" onerror="this.closest('.photo-card').style.display='none'"></div><div class="photo-copy"><div class="photo-meta"><span>${esc(p.category)}</span><span>·</span><span>${esc(p.date)}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div></article>`).join('');if(empty)empty.style.display=list.length?'none':'block'};render('전체');document.querySelectorAll('[data-gallery-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-gallery-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');render(btn.dataset.galleryFilter)}))}catch(e){console.warn('gallery load failed',e)}
  }

  async function main(){
    let site={};
    try{
      site=await get('/content/site.json');window.__site=site;
      document.querySelectorAll('[data-site-text]').forEach(el=>{const k=el.dataset.siteText;el.textContent=site[k]||''});document.querySelectorAll('[data-site-html]').forEach(el=>{const k=el.dataset.siteHtml;el.innerHTML=esc(site[k]||'').replace(/\n/g,'<br>')});document.querySelectorAll('[data-site-image]').forEach(el=>{if(el.dataset.siteImage==='pastorImage'&&document.querySelector('.pastor-photo')&&location.pathname.endsWith('/staff.html'))return;safeImg(el,site[el.dataset.siteImage])});document.querySelectorAll('[data-site-link]').forEach(el=>{const k=el.dataset.siteLink;if(site[k])el.href=site[k]});document.querySelectorAll('.brand-copy small').forEach(el=>el.textContent=site.churchNameEn||'');document.querySelectorAll('.brand-copy strong').forEach(el=>el.textContent=site.churchName||'');
      renderFooter(site);
      if(document.querySelector('.hero')){const hero=document.querySelector('.hero');safeImg(hero,site.heroImage);const h=hero.querySelector('h1');if(h)h.innerHTML=esc(site.heroTitle||'').replace(/\n/g,'<br>');const p=hero.querySelector('p');if(p)p.textContent=site.heroText||''}
      const schedule=document.querySelector('[data-worship-list]');if(schedule&&Array.isArray(site.worship))schedule.innerHTML=site.worship.map(x=>`<div class="item"><b>${esc(x.name)}</b>${esc(x.time)}</div>`).join('');
      if(document.querySelector('[data-bulletin]')){try{const sermons=(await get('/content/sermons.json')).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)));const latest=sermons[0];if(latest){const scripture=(latest.text||'').split('·')[0].trim();const t=document.querySelector('[data-bulletin-sermonTitle]');if(t)t.textContent=latest.title||'';const s=document.querySelector('[data-bulletin-scripture]');if(s)s.textContent=scripture||latest.text||'';const d=document.querySelector('[data-bulletin-date]');if(d)d.textContent=latest.date||'';const p=document.querySelector('[data-bulletin-preacher]');if(p)p.textContent=site.pastor||''}}catch(e){console.warn('latest sermon load failed',e)}}
      await initHeroCarousel(site);
    }catch(e){console.warn('CMS load failed',e)}

    await renderGallery();
    const path=location.pathname;
    if(path==='/'||path.endsWith('/index.html')){
      makeCardLink(document.querySelector('.feature-card.emphasis'),'/sermons.html#sermon-0','최신 설교 보기');
      const f=[...document.querySelectorAll('.feature-card')];if(f[1])makeCardLink(f[1],'/news.html','교회소식 보기');
      const c=[...document.querySelectorAll('.connect-card')];if(c[0])makeCardLink(c[0],'/visit.html','오시는 길 보기');if(c[1]&&site.kakao)makeCardLink(c[1],site.kakao,'카카오톡 채널 열기',true);if(c[2]&&site.youtube)makeCardLink(c[2],site.youtube,'YouTube 열기',true);
    }
    if(path.endsWith('/visit.html')){
      const loc=document.querySelector('.location-card');if(loc)makeCardLink(loc,'https://map.kakao.com/?q=%EB%AA%A8%ED%98%84%EC%86%8C%EB%A7%9D%EA%B5%90%ED%9A%8C','카카오맵에서 보기',true);
      const ch=[...document.querySelectorAll('.channel-card')];if(ch[0]&&site.kakao)makeCardLink(ch[0],site.kakao,'카카오톡 채널 열기',true);if(ch[1]&&site.youtube)makeCardLink(ch[1],site.youtube,'YouTube 열기',true);
    }
  }
  main();
})();