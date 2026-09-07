(()=>{
  if(!(location.pathname==='/'||location.pathname.endsWith('/index.html')))return;

  let subtitle='';

  const patch=()=>{
    if(!subtitle)return;

    const legacy=document.getElementById('carouselNewsText');
    if(legacy)legacy.textContent=subtitle;

    document.querySelectorAll('.hero-slide,.hero-glass-card').forEach(node=>{
      const scope=node.classList.contains('hero-glass-card')?node:node.querySelector('.hero-glass-card')||node;
      const label=scope.querySelector('.hero-label,.eyebrow');
      if(!label||!String(label.textContent||'').toUpperCase().includes('CHURCH NEWS'))return;
      const p=scope.querySelector('p');
      if(p&&p.textContent!==subtitle)p.textContent=subtitle;
    });
  };

  const load=async()=>{
    try{
      const r=await fetch('/content/news.json?v='+Date.now(),{cache:'no-store'});
      if(!r.ok)return;
      const items=await r.json();
      if(!Array.isArray(items)||!items.length)return;
      const dateKey=v=>Number(String(v||'').replace(/\D/g,'').slice(0,8))||0;
      const latest=[...items].sort((a,b)=>dateKey(b.date)-dateKey(a.date))[0]||{};
      subtitle=String(latest.subtitle||'').trim();
      if(!subtitle)return;
      patch();
      const hero=document.querySelector('.hero');
      if(hero){
        const obs=new MutationObserver(()=>patch());
        obs.observe(hero,{childList:true,subtree:true});
        setTimeout(()=>obs.disconnect(),5000);
      }
      setTimeout(patch,100);
      setTimeout(patch,500);
      setTimeout(patch,1200);
    }catch(e){}
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
