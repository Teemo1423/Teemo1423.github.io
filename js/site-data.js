(async()=>{
  const bust='?v='+Date.now();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const get=async p=>{const r=await fetch(p+bust,{cache:'no-store'});if(!r.ok)throw new Error(p);return r.json()};

  function safeImg(el,src){
    if(!el)return;
    if(!src){if(el.tagName==='IMG')el.style.display='none';return}
    if(el.tagName==='IMG'){
      el.style.display='block';el.src=src;el.onerror=()=>{el.style.display='none'};
    }else{
      el.style.backgroundImage=`linear-gradient(rgba(10,35,26,.18),rgba(10,35,26,.34)),url('${src}')`;
      const test=new Image();
      test.onerror=()=>{el.style.backgroundImage=`linear-gradient(135deg,#dfe9e3,#eff4f0)`};
      test.src=src;
    }
  }

  /* 기존 페이지에 남아 있던 예전 소식 링크를 모두 현재 소식 페이지로 통일 */
  document.querySelectorAll('a').forEach(a=>{
    const t=a.textContent.replace(/\s+/g,' ').trim();
    if(t==='소식'||t==='교회소식'||t.includes('교회소식 보기')) a.href='/news.html?v=news2';
  });

  /* 모든 상단 메뉴에 사진첩 카테고리를 자동 추가 */
  document.querySelectorAll('.navlinks').forEach(nav=>{
    if(!nav.querySelector('a[href*="gallery.html"]')){
      const link=document.createElement('a');
      link.href='/gallery.html';
      link.textContent='사진첩';
      if(document.title.includes('사진첩')) link.className='active';
      const visit=[...nav.querySelectorAll('a')].find(a=>a.textContent.trim()==='오시는 길');
      if(visit) nav.insertBefore(link,visit); else nav.appendChild(link);
    }
  });

  try{
    const site=await get('/content/site.json');
    window.__site=site;
    document.querySelectorAll('[data-site-text]').forEach(el=>{const k=el.dataset.siteText;el.textContent=site[k]||''});
    document.querySelectorAll('[data-site-html]').forEach(el=>{const k=el.dataset.siteHtml;el.innerHTML=esc(site[k]||'').replace(/\n/g,'<br>')});
    document.querySelectorAll('[data-site-image]').forEach(el=>safeImg(el,site[el.dataset.siteImage]));
    document.querySelectorAll('[data-site-link]').forEach(el=>{const k=el.dataset.siteLink;if(site[k])el.href=site[k]});
    document.querySelectorAll('.brand-copy small').forEach(el=>el.textContent=site.churchNameEn||'');
    document.querySelectorAll('.brand-copy strong').forEach(el=>el.textContent=site.churchName||'');
    document.querySelectorAll('.copyright').forEach(el=>el.textContent=`© 2026 ${site.churchName||'교회'}. All rights reserved.`);

    if(document.querySelector('.hero')){
      const hero=document.querySelector('.hero');
      safeImg(hero,site.heroImage);
      const h=hero.querySelector('h1');if(h)h.innerHTML=esc(site.heroTitle||'').replace(/\n/g,'<br>');
      const p=hero.querySelector('p');if(p)p.textContent=site.heroText||'';
    }

    if(document.querySelector('[data-bulletin]')&&site.latestBulletin){
      const b=site.latestBulletin;
      const map={date:'date',sermonTitle:'sermonTitle',scripture:'scripture',preacher:'preacher'};
      Object.keys(map).forEach(k=>{const el=document.querySelector(`[data-bulletin-${k}]`);if(el)el.textContent=b[map[k]]||''});
    }

    const schedule=document.querySelector('[data-worship-list]');
    if(schedule&&Array.isArray(site.worship))schedule.innerHTML=site.worship.map(x=>`<div class="item"><b>${esc(x.name)}</b>${esc(x.time)}</div>`).join('');

    if(document.title.includes('교회소식')){
      const news=await get('/content/news.json');
      const box=document.querySelector('[data-news-list]');
      if(box)box.innerHTML=news.map(n=>`<article class="notice">${n.image?`<img class="content-thumb" src="${esc(n.image)}" onerror="this.style.display='none'">`:''}<small>${esc(n.date)}</small><h3>${esc(n.title)}</h3><p>${esc(n.text)}</p></article>`).join('');
    }

    if(document.title.includes('설교')){
      const sermons=await get('/content/sermons.json');
      const box=document.querySelector('[data-sermon-list]');
      if(box)box.innerHTML=sermons.map(s=>`<article class="sermon-card">${s.image?`<div class="sermon-thumb"><img src="${esc(s.image)}" onerror="this.parentElement.style.display='none'"></div>`:''}<div class="sermon-body"><div class="date">${esc(s.date)}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${s.video?`<a class="text-link" href="${esc(s.video)}" target="_blank" rel="noopener">영상 보기 →</a>`:''}</div></article>`).join('');
    }

    if(document.title.includes('사진첩')){
      const photos=await get('/content/gallery.json');
      const box=document.querySelector('[data-gallery-list]');
      const empty=document.querySelector('[data-gallery-empty]');
      const render=filter=>{
        const list=filter==='전체'?photos:photos.filter(p=>p.category===filter);
        if(box)box.innerHTML=list.map(p=>`<article class="photo-card"><div class="photo-media"><img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" onerror="this.closest('.photo-card').style.display='none'"></div><div class="photo-copy"><div class="photo-meta"><span>${esc(p.category)}</span><span>·</span><span>${esc(p.date)}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div></article>`).join('');
        if(empty)empty.style.display=list.length?'none':'block';
      };
      render('전체');
      document.querySelectorAll('[data-gallery-filter]').forEach(btn=>btn.addEventListener('click',()=>{
        document.querySelectorAll('[data-gallery-filter]').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        render(btn.dataset.galleryFilter);
      }));
    }
  }catch(e){console.warn('CMS load failed',e)}
})();