(()=>{
  if(!(location.pathname==='/'||location.pathname.endsWith('/index.html')))return;
  const apply=async()=>{
    const el=document.getElementById('carouselNewsText');
    if(!el)return;
    try{
      const r=await fetch('/content/news.json?v='+Date.now(),{cache:'no-store'});
      if(!r.ok)return;
      const items=await r.json();
      if(!Array.isArray(items)||!items.length)return;
      const dateKey=v=>Number(String(v||'').replace(/\D/g,'').slice(0,8))||0;
      const latest=[...items].sort((a,b)=>dateKey(b.date)-dateKey(a.date))[0]||{};
      const subtitle=String(latest.subtitle||'').trim();
      if(subtitle)el.textContent=subtitle;
    }catch(e){}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
