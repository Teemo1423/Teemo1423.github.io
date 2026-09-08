(()=>{
  const isHome=location.pathname==='/'||location.pathname.endsWith('/index.html');
  if(!isHome)return;

  const resetHome=()=>{
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

  window.addEventListener('pageshow',e=>{
    if(e.persisted)resetHome();
  });

  window.addEventListener('pagehide',()=>{
    const track=document.getElementById('heroTrack');
    if(track)track.style.willChange='auto';
  });
})();
