(()=>{
  const isHome=location.pathname==='/'||location.pathname.endsWith('/index.html');
  if(!isHome)return;

  const dateKey=v=>Number(String(v||'').replace(/\D/g,'').slice(0,8))||0;
  const set=(id,val)=>{const el=document.getElementById(id);if(el&&val!==undefined&&val!==null&&String(val)!=='')el.textContent=val};

  async function refreshHome(){
    try{
      const stamp=Date.now();
      const [siteRes,sermonRes,newsRes]=await Promise.all([
        fetch('/content/site.json?v='+stamp,{cache:'no-store'}),
        fetch('/content/sermons.json?v='+stamp,{cache:'no-store'}),
        fetch('/content/news.json?v='+stamp,{cache:'no-store'})
      ]);
      const site=siteRes.ok?await siteRes.json():{};
      const sermons=sermonRes.ok?await sermonRes.json():[];
      const news=newsRes.ok?await newsRes.json():[];

      const latestMeta=site.latestBulletin||{};
      const sermon=Array.isArray(sermons)?[...sermons].sort((a,b)=>dateKey(b.date)-dateKey(a.date))[0]||{}:{};
      const latestNews=Array.isArray(news)?[...news].sort((a,b)=>dateKey(b.date)-dateKey(a.date))[0]||{}:{};

      const title=latestMeta.sermonTitle||sermon.title||'';
      const scripture=latestMeta.scripture||String(sermon.text||'').split('·')[0]?.trim()||'';
      const date=latestMeta.date||sermon.date||'';
      const preacher=latestMeta.preacher||site.pastor||'';

      set('latestSermonTitle',title);
      set('latestSermonScripture',scripture);
      set('latestSermonDate',date);
      set('latestSermonPreacher',preacher);
      set('carouselSermonTitle',title);
      set('carouselSermonDate',date);
      set('carouselSermonScripture',scripture);

      const subtitle=String(latestNews.subtitle||'').trim();
      if(subtitle)set('carouselNewsText',subtitle);
    }catch(e){console.warn('home runtime fallback',e)}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refreshHome,{once:true});
  else refreshHome();
})();
