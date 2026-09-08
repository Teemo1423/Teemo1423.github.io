(()=>{
  const isHome=location.pathname==='/'||location.pathname.endsWith('/index.html');
  if(!isHome)return;

  let reloading=false;
  const safeReload=()=>{
    if(reloading)return;
    reloading=true;
    location.reload();
  };

  window.addEventListener('pageshow',e=>{
    if(e.persisted)safeReload();
  });

  window.addEventListener('pagehide',()=>{
    const track=document.getElementById('heroTrack');
    if(track)track.style.willChange='auto';
  });
})();
