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

  const run=async()=>{
    applyGlobalTone();
    try{
      const r=await fetch('/content/site.json'+bust,{cache:'no-store'});
      if(r.ok)applyIndividual(await r.json());
    }catch(e){console.warn('image adjustments unavailable',e)}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();