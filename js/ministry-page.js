(()=>{
  const slug=document.body.dataset.ministrySlug||'';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]));
  const nl=s=>esc(s).replace(/\n/g,'<br>');
  async function run(){
    try{
      const r=await fetch('/content/ministry-groups.json?v='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('data');
      const items=await r.json();const x=Array.isArray(items)?items.find(v=>v.slug===slug):null;if(!x)return;
      document.title=`${x.name} | 모현소망교회`;
      const q=id=>document.getElementById(id);
      if(q('minLabel'))q('minLabel').textContent=x.label||'MINISTRY';
      if(q('minName'))q('minName').textContent=x.name||'';
      if(q('minSubtitle'))q('minSubtitle').textContent=x.subtitle||'';
      if(q('minIntro'))q('minIntro').textContent=x.intro||'';
      if(q('minTarget'))q('minTarget').textContent=x.target||'-';
      if(q('minSchedule'))q('minSchedule').textContent=x.schedule||'-';
      if(q('minPlace'))q('minPlace').textContent=x.place||'-';
      if(q('minLeader'))q('minLeader').textContent=x.leader||'-';
      if(q('minContact')){q('minContact').textContent=x.contact||'교회로 문의';q('minContactRow').hidden=!x.contact;}
      if(q('minScripture')){q('minScripture').textContent=x.scripture||'';q('minScriptureWrap').hidden=!x.scripture;}
      if(q('minActivities'))q('minActivities').innerHTML=nl(x.activities||'');
      if(q('minPrayer'))q('minPrayer').textContent=x.prayer||'';
      const hero=q('minImage');if(hero&&x.image){hero.style.backgroundImage=`url('${x.image}')`;hero.style.filter='brightness(1.18) contrast(1.03) saturate(1.04)';}
    }catch(e){console.warn('ministry data fallback',e)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();