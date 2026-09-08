(()=>{
  const isHome=location.pathname==='/'||location.pathname.endsWith('/index.html');

  const resetHome=()=>{
    if(!isHome)return;
    const track=document.getElementById('heroTrack');
    const dots=[...document.querySelectorAll('.hero-dot')];
    if(track){
      track.style.transition='none';
      track.style.transform='translateX(0%)';
      track.style.willChange='auto';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{track.style.transition=''}));
    }
    dots.forEach((d,i)=>d.classList.toggle('active',i===0));
  };

  // Mobile Safari/Kakao in-app browsers can restore a half-suspended page from bfcache.
  // Bottom navigation therefore opens a fresh document instead of reviving that old page.
  document.addEventListener('click',e=>{
    const a=e.target.closest?.('.mobile-bottom-nav a');
    if(!a)return;
    const url=new URL(a.href,location.origin);
    if(url.origin!==location.origin)return;
    e.preventDefault();
    if(url.pathname===location.pathname){
      window.scrollTo({top:0,behavior:'smooth'});
      return;
    }
    url.searchParams.set('_nav',Date.now().toString());
    location.assign(url.pathname+url.search+url.hash);
  },true);

  window.addEventListener('pageshow',e=>{
    if(e.persisted)resetHome();
  });

  window.addEventListener('pagehide',()=>{
    if(!isHome)return;
    const track=document.getElementById('heroTrack');
    if(track)track.style.willChange='auto';
  });
})();
