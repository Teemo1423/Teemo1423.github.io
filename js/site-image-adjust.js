(()=>{
  const bust='?v='+Date.now();
  const clamp=v=>Math.max(70,Math.min(140,Number(v)||100));
  const apply=site=>{
    const map=site.imageAdjustments||{};
    let css='';
    Object.entries(map).forEach(([key,val])=>{
      if(key==='heroImage')return;
      const pct=clamp(val);
      css+=`[data-site-image="${key}"]{filter:brightness(${pct/100}) contrast(1.02) saturate(1.02)!important}`;
    });
    let style=document.getElementById('siteImageAdjustmentRules');
    if(!style){style=document.createElement('style');style.id='siteImageAdjustmentRules';document.head.appendChild(style)}
    style.textContent=css;

    const heroPct=clamp(map.heroImage??100);
    const alpha=Math.min(.4,Math.abs(heroPct-100)/100);
    const tint=heroPct<100?`rgba(0,0,0,${alpha})`:heroPct>100?`rgba(255,255,255,${alpha})`:'rgba(0,0,0,0)';
    let heroStyle=document.getElementById('heroBrightnessRule');
    if(!heroStyle){heroStyle=document.createElement('style');heroStyle.id='heroBrightnessRule';document.head.appendChild(heroStyle)}
    heroStyle.textContent=`.hero.hero-glass{--hero-brightness-tint:${tint}}.hero.hero-glass:after{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background:var(--hero-brightness-tint,transparent)}.hero.hero-glass>.container{position:relative;z-index:1}`;
  };
  const run=async()=>{try{const r=await fetch('/content/site.json'+bust,{cache:'no-store'});if(r.ok)apply(await r.json())}catch(e){console.warn('image adjustments unavailable',e)}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();