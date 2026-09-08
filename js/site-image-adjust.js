(()=>{
  const bust='?v='+Date.now();
  const GLOBAL={brightness:1.10,contrast:.98,saturate:.98};
  const photoFilter=`brightness(${GLOBAL.brightness}) contrast(${GLOBAL.contrast}) saturate(${GLOBAL.saturate})`;

  function applyGlobalTone(){
    let style=document.getElementById('siteGlobalPhotoTone');
    if(!style){style=document.createElement('style');style.id='siteGlobalPhotoTone';document.head.appendChild(style)}
    style.textContent=`
      main img:not(.brand-logo):not([src*="logo"]):not([src*="qr"]):not([src*="QR"]),
      .visual-img,.overlay-card,.notice img,.sermon-card img,.gallery-card img,.gallery-item img,
      [data-site-image]:not(.hero),.staff-photo,.ministry-photo,.sunday-school-photo{
        filter:${photoFilter}!important;
      }
      .hero.hero-glass{--global-photo-tone:rgba(255,255,255,.10)}
      .hero.hero-glass:after{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background:var(--global-photo-tone)}
      .hero.hero-glass>.container{position:relative;z-index:1}
      @media(max-width:420px){
        .unified-footer>.container{padding-left:12px!important;padding-right:12px!important}
        .unified-footer .footer-info p:nth-child(3){font-size:12.5px!important;letter-spacing:-.04em;white-space:nowrap;line-height:1.45!important}
        .unified-footer .footer-info p:nth-child(3) b{min-width:48px!important}
      }
    `;

    document.querySelectorAll('main img').forEach(img=>{
      const src=(img.getAttribute('src')||'').toLowerCase();
      if(src.includes('logo')||src.includes('qr'))return;
      img.style.filter=photoFilter;
    });
  }

  const clamp=v=>Math.max(70,Math.min(140,Number(v)||100));
  const applyIndividual=site=>{
    const map=site.imageAdjustments||{};
    Object.entries(map).forEach(([key,val])=>{
      if(key==='heroImage')return;
      const pct=clamp(val)/100;
      document.querySelectorAll(`[data-site-image="${key}"]`).forEach(el=>{
        el.style.filter=`brightness(${GLOBAL.brightness*pct}) contrast(${GLOBAL.contrast}) saturate(${GLOBAL.saturate})`;
      });
    });
  };

  async function applyHomeNewsSubtitle(){
    const path=location.pathname||'/';
    if(!(path==='/'||path.endsWith('/index.html')))return;
    try{
      const r=await fetch('/content/news.json?v='+Date.now(),{cache:'no-store'});
      if(!r.ok)return;
      const items=await r.json();
      if(!Array.isArray(items)||!items.length)return;
      const dateKey=v=>Number(String(v||'').replace(/\D/g,'').slice(0,8))||0;
      const latest=[...items].sort((a,b)=>dateKey(b.date)-dateKey(a.date))[0]||{};
      const subtitle=String(latest.subtitle||'').trim();
      if(!subtitle)return;

      const patch=()=>{
        const legacy=document.getElementById('carouselNewsText');
        if(legacy&&legacy.textContent!==subtitle)legacy.textContent=subtitle;

        document.querySelectorAll('.hero-slide').forEach(slide=>{
          const label=slide.querySelector('.hero-label,.eyebrow');
          if(!label||!String(label.textContent||'').toUpperCase().includes('CHURCH NEWS'))return;
          const p=slide.querySelector('.hero-glass-card p,.glass-panel p');
          if(p&&p.textContent!==subtitle)p.textContent=subtitle;
        });
      };

      patch();
      const hero=document.querySelector('.hero');
      if(hero){
        const observer=new MutationObserver(()=>patch());
        observer.observe(hero,{childList:true,subtree:true,characterData:true});
        setTimeout(()=>observer.disconnect(),15000);
      }
      [100,300,700,1500,3000,6000].forEach(ms=>setTimeout(patch,ms));
    }catch(e){console.warn('home news subtitle unavailable',e)}
  }

  async function syncLatestSermonCard(){
    const path=location.pathname||'/';
    if(!(path==='/'||path.endsWith('/index.html')))return;
    try{
      const [sermonRes,siteRes]=await Promise.all([
        fetch('/content/sermons.json?v='+Date.now(),{cache:'no-store'}),
        fetch('/content/site.json?v='+Date.now(),{cache:'no-store'})
      ]);
      if(!sermonRes.ok)return;
      const sermons=await sermonRes.json();
      const site=siteRes.ok?await siteRes.json():{};
      if(!Array.isArray(sermons)||!sermons.length)return;
      const dateKey=v=>Number(String(v||'').replace(/\D/g,'').slice(0,8))||0;
      const latest=[...sermons].sort((a,b)=>dateKey(b.date)-dateKey(a.date))[0]||{};
      const scripture=String(latest.text||'').split('·')[0].trim();
      const set=(id,value)=>{const el=document.getElementById(id);if(el&&value!=null&&el.textContent!==String(value))el.textContent=String(value)};
      const patch=()=>{
        set('latestSermonTitle',latest.title||'최근 설교');
        set('latestSermonScripture',scripture||latest.text||'');
        set('latestSermonDate',latest.date||'');
        set('latestSermonPreacher',site.pastor||'이동호 목사');
        const card=document.getElementById('latestSermonCard');
        if(card)card.href='/sermons.html#sermon-0';
      };
      patch();
      const target=document.getElementById('latestSermonCard')?.parentElement||document.querySelector('main');
      if(target){
        const observer=new MutationObserver(()=>patch());
        observer.observe(target,{childList:true,subtree:true,characterData:true});
        setTimeout(()=>observer.disconnect(),15000);
      }
      [100,300,700,1500,3000,6000].forEach(ms=>setTimeout(patch,ms));
    }catch(e){console.warn('latest sermon sync unavailable',e)}
  }

  const run=async()=>{
    applyGlobalTone();
    try{
      const r=await fetch('/content/site.json'+bust,{cache:'no-store'});
      if(r.ok)applyIndividual(await r.json());
    }catch(e){console.warn('image adjustments unavailable',e)}
    applyHomeNewsSubtitle();
    syncLatestSermonCard();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();