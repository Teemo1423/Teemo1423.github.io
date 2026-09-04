(()=>{
  const bust='?v='+Date.now();
  const apply=site=>{
    const map=site.imageAdjustments||{};
    Object.entries(map).forEach(([key,val])=>{
      const pct=Math.max(70,Math.min(140,Number(val)||100));
      document.querySelectorAll(`[data-site-image="${key}"]`).forEach(el=>{el.style.filter=`brightness(${pct/100}) contrast(1.02) saturate(1.02)`});
    });
  };
  const run=async()=>{try{const r=await fetch('/content/site.json'+bust,{cache:'no-store'});if(r.ok)apply(await r.json())}catch(e){console.warn('image adjustments unavailable',e)}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();