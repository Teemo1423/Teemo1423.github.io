(()=>{
  const style=document.createElement('style');style.id='homeEnhancementsStyles';style.textContent=`
    .sermon-meditation-link{display:inline-flex;align-items:center;gap:7px;margin-top:16px;padding:9px 13px;border-radius:999px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.28);color:#fff!important;font-size:13px;font-weight:900;line-height:1;text-decoration:none;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}.sermon-meditation-link:hover{background:rgba(255,255,255,.22)}
    .home-newcomer{padding:28px 0 68px;background:#fff}.home-newcomer-card{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;padding:28px 32px;border-radius:24px;background:#f1f6f3;border:1px solid #dce9e1}.home-newcomer-card h3{font-size:28px;margin:5px 0 8px;letter-spacing:-.035em}.home-newcomer-card p{margin:0;color:var(--muted);line-height:1.7}.home-newcomer-card a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:999px;background:var(--green);color:#fff;font-weight:900;white-space:nowrap}
    @media(max-width:820px){.sermon-meditation-link{margin-top:14px;padding:10px 13px;font-size:12px}.home-newcomer{padding:20px 0 44px}.home-newcomer-card{grid-template-columns:1fr;padding:24px}.home-newcomer-card h3{font-size:24px}.home-newcomer-card a{width:100%}}
  `;document.head.appendChild(style);
  function addNewcomer(){if(document.querySelector('.home-newcomer'))return;const connect=[...document.querySelectorAll('section')].find(s=>s.querySelector('.connect-strip'));if(!connect)return;const sec=document.createElement('section');sec.className='home-newcomer';sec.innerHTML=`<div class="container"><div class="home-newcomer-card"><div><div class="kicker">FIRST VISIT</div><h3>처음 오셨나요?</h3><p>예배시간부터 새가족 등록, 문의, 오시는 길까지 한 번에 안내해 드립니다.</p></div><a href="/newcomers.html">새가족 안내 보기 →</a></div></div>`;connect.parentNode.insertBefore(sec,connect)}
  function addMeditationLink(){
    document.querySelector('.home-meditation')?.remove();
    const card=document.getElementById('latestSermonCard');if(!card||card.querySelector('.sermon-meditation-link'))return;
    const meta=card.querySelector('.feature-meta');
    const link=document.createElement('a');link.className='sermon-meditation-link';link.href='/weekly-meditation.html';link.textContent='이번 주 말씀묵상 →';
    if(meta)meta.insertAdjacentElement('afterend',link);else card.appendChild(link);
    link.addEventListener('click',e=>e.stopPropagation());
  }
  function run(){addNewcomer();addMeditationLink()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();