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
    .photo-card.smart-link-card .smart-link-arrow{opacity:.88}
    @media(max-width:760px){.smart-link-arrow{opacity:.92;transform:none;width:34px;height:34px;right:12px;top:12px}.smart-link-card:hover{transform:none}.quick-menu a:hover,.btn:hover,.channel-actions a:hover{transform:none}}
  `;
  document.head.appendChild(style);

  function safeImg(el,src){
    if(!el)return;
    if(!src){if(el.tagName==='IMG')el.style.display='none';return}
    if(el.tagName==='IMG'){
      el.style.display='block';el.src=src;el.onerror=()=>{el.style.display='none'};
    }else{
      el.style.backgroundImage=`linear-gradient(rgba(10,35,26,.18),rgba(10,35,26,.34)),url('${src}')`;
      const test=new Image();test.onerror=()=>{el.style.backgroundImage='linear-gradient(135deg,#dfe9e3,#eff4f0)'};test.src=src;
    }
  }

  function makeCardLink(el,href,label='자세히 보기',external=false){
    if(!el||!href||el.dataset.smartLinked==='1')return;
    el.dataset.smartLinked='1';
    el.classList.add('smart-link-card');
    el.setAttribute('role','link');el.setAttribute('tabindex','0');el.setAttribute('aria-label',label);
    const arrow=document.createElement('span');arrow.className='smart-link-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='→';el.appendChild(arrow);
    const go=()=>external?window.open(href,'_blank','noopener'):location.href=href;
    el.addEventListener('click',e=>{if(e.target.closest('a,button,input,textarea,select'))return;go()});
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}});
  }

  document.querySelectorAll('a').forEach(a=>{
    const t=a.textContent.replace(/\s+/g,' ').trim();
    if(t==='소식'||t==='교회소식'||t.includes('교회소식 보기'))a.href='/news.html?v=news2';
  });
  document.querySelectorAll('.navlinks').forEach(nav=>{
    if(!nav.querySelector('a[href*="gallery.html"]')){
      const link=document.createElement('a');link.href='/gallery.html';link.textContent='사진첩';
      if(document.title.includes('사진첩'))link.className='active';
      const visit=[...nav.querySelectorAll('a')].find(a=>a.textContent.trim()==='오시는 길');
      if(visit)nav.insertBefore(link,visit);else nav.appendChild(link);
    }
  });

  async function renderGallery(){
    const box=document.querySelector('[data-gallery-list]');if(!box)return;
    try{
      const photos=await get('/content/gallery.json');
      const empty=document.querySelector('[data-gallery-empty]');
      const render=filter=>{
        const list=filter==='전체'?photos:photos.filter(p=>p.category===filter);
        box.innerHTML=list.map(p=>`<article class="photo-card"><div class="photo-media"><img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" onerror="this.closest('.photo-card').style.display='none'"></div><div class="photo-copy"><div class="photo-meta"><span>${esc(p.category)}</span><span>·</span><span>${esc(p.date)}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div></article>`).join('');
        if(empty)empty.style.display=list.length?'none':'block';
        [...box.querySelectorAll('.photo-card')].forEach((card,i)=>{const p=list[i];if(p?.image)makeCardLink(card,p.image,'사진 크게 보기',true)});
      };
      render('전체');
      document.querySelectorAll('[data-gallery-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-gallery-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');render(btn.dataset.galleryFilter)}));
    }catch(e){console.warn('gallery load failed',e)}
  }

  async function main(){
    let site={};
    try{
      site=await get('/content/site.json');window.__site=site;
      document.querySelectorAll('[data-site-text]').forEach(el=>{const k=el.dataset.siteText;el.textContent=site[k]||''});
      document.querySelectorAll('[data-site-html]').forEach(el=>{const k=el.dataset.siteHtml;el.innerHTML=esc(site[k]||'').replace(/\n/g,'<br>')});
      document.querySelectorAll('[data-site-image]').forEach(el=>safeImg(el,site[el.dataset.siteImage]));
      document.querySelectorAll('[data-site-link]').forEach(el=>{const k=el.dataset.siteLink;if(site[k])el.href=site[k]});
      document.querySelectorAll('.brand-copy small').forEach(el=>el.textContent=site.churchNameEn||'');
      document.querySelectorAll('.brand-copy strong').forEach(el=>el.textContent=site.churchName||'');
      document.querySelectorAll('.copyright').forEach(el=>el.textContent=`© 2026 ${site.churchName||'교회'}. All rights reserved.`);

      if(document.querySelector('.hero')){
        const hero=document.querySelector('.hero');safeImg(hero,site.heroImage);
        const h=hero.querySelector('h1');if(h)h.innerHTML=esc(site.heroTitle||'').replace(/\n/g,'<br>');
        const p=hero.querySelector('p');if(p)p.textContent=site.heroText||'';
      }

      const schedule=document.querySelector('[data-worship-list]');
      if(schedule&&Array.isArray(site.worship))schedule.innerHTML=site.worship.map(x=>`<div class="item"><b>${esc(x.name)}</b>${esc(x.time)}</div>`).join('');

      if(document.querySelector('[data-bulletin]')){
        try{
          const sermons=(await get('/content/sermons.json')).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)));
          const latest=sermons[0];
          if(latest){
            const scripture=(latest.text||'').split('·')[0].trim();
            const t=document.querySelector('[data-bulletin-sermonTitle]');if(t)t.textContent=latest.title||'';
            const s=document.querySelector('[data-bulletin-scripture]');if(s)s.textContent=scripture||latest.text||'';
            const d=document.querySelector('[data-bulletin-date]');if(d)d.textContent=latest.date||'';
            const p=document.querySelector('[data-bulletin-preacher]');if(p)p.textContent=site.pastor||'';
          }
        }catch(e){console.warn('latest sermon load failed',e)}
      }
    }catch(e){console.warn('CMS load failed',e)}

    await renderGallery();
    const path=location.pathname;
    if(path==='/'||path.endsWith('/index.html')){
      makeCardLink(document.querySelector('.feature-card.emphasis'),'/sermons.html#sermon-0','최신 설교 보기');
      const f=[...document.querySelectorAll('.feature-card')];if(f[1])makeCardLink(f[1],'/news.html','교회소식 보기');
      const v=[...document.querySelectorAll('.visual-card')];if(v[0])makeCardLink(v[0],'/about.html','교회 소개 보기');if(v[1])makeCardLink(v[1],'/visit.html','오시는 길 보기');
      const o=[...document.querySelectorAll('.overlay-card')];if(o[0])makeCardLink(o[0],'/worship.html','예배 안내 보기');if(o[1])makeCardLink(o[1],'/ministries.html','공동체 사역 보기');if(o[2])makeCardLink(o[2],'/gallery.html','다음세대 사진 보기');
      const c=[...document.querySelectorAll('.connect-card')];if(c[0])makeCardLink(c[0],'/visit.html','오시는 길 보기');if(c[1]&&site.kakao)makeCardLink(c[1],site.kakao,'카카오톡 채널 열기',true);if(c[2]&&site.youtube)makeCardLink(c[2],site.youtube,'YouTube 열기',true);
      document.querySelectorAll('.schedule .item').forEach(x=>makeCardLink(x,'/worship.html','예배 안내 보기'));
    }
    if(path.endsWith('/about.html')){
      document.querySelectorAll('.about-photo').forEach(x=>makeCardLink(x,'/gallery.html','교회 사진첩 보기'));
      const cards=[...document.querySelectorAll('.vision-grid .card')];if(cards[0])makeCardLink(cards[0],'/worship.html','예배 안내 보기');if(cards[1])makeCardLink(cards[1],'/sermons.html','말씀과 설교 보기');if(cards[2])makeCardLink(cards[2],'/ministries.html','교육·사역 보기');
    }
    if(path.endsWith('/staff.html'))document.querySelectorAll('.people-grid .card').forEach(x=>makeCardLink(x,'/ministries.html','교육·사역 보기'));
    if(path.endsWith('/worship.html')){
      const hero=document.querySelector('.worship-heroimg');if(hero)makeCardLink(hero,'/gallery.html','예배 사진 보기');
      document.querySelectorAll('.schedule .item').forEach(x=>makeCardLink(x,'/visit.html','오시는 길 보기'));
    }
    if(path.endsWith('/ministries.html')){
      document.querySelectorAll('.ministry-photo-card,.grid3 .card').forEach(x=>makeCardLink(x,'/gallery.html','사역 사진 보기'));
    }
    if(path.endsWith('/visit.html')){
      const loc=document.querySelector('.location-card');if(loc)makeCardLink(loc,'https://map.kakao.com/?q=%EB%AA%A8%ED%98%84%EC%86%8C%EB%A7%9D%EA%B5%90%ED%9A%8C','카카오맵에서 보기',true);
      const ch=[...document.querySelectorAll('.channel-card')];if(ch[0]&&site.kakao)makeCardLink(ch[0],site.kakao,'카카오톡 채널 열기',true);if(ch[1]&&site.youtube)makeCardLink(ch[1],site.youtube,'YouTube 열기',true);
    }
  }
  main();
})();