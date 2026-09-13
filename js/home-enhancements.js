(()=>{
  const style=document.createElement('style');style.id='homeEnhancementsStyles';style.textContent=`
    .sermon-meditation-link{display:flex;align-items:center;justify-content:center;gap:12px;width:100%;min-height:58px;margin-top:20px;padding:12px 20px;border-radius:999px;background:#fff;border:0;color:#2f6b4f!important;font-size:16px;font-weight:900;line-height:1.2;text-decoration:none;box-shadow:0 6px 20px rgba(12,48,34,.08)}.sermon-meditation-link:hover{background:#f4f8f5}.sermon-meditation-link svg{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}.sermon-meditation-arrow{font-size:24px;font-weight:500;line-height:1;margin-left:2px}
    .home-newcomer{padding:28px 0 68px;background:#fff}.home-newcomer-card{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;padding:28px 32px;border-radius:24px;background:#f1f6f3;border:1px solid #dce9e1}.home-newcomer-card h3{font-size:28px;margin:5px 0 8px;letter-spacing:-.035em}.home-newcomer-card p{margin:0;color:var(--muted);line-height:1.7}.home-newcomer-card a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:999px;background:var(--green);color:#fff;font-weight:900;white-space:nowrap}
    @media(max-width:820px){.sermon-meditation-link{min-height:60px;margin-top:18px;padding:13px 16px;font-size:15px;gap:10px}.sermon-meditation-link svg{width:27px;height:27px}.sermon-meditation-arrow{font-size:22px}.home-newcomer{padding:20px 0 44px}.home-newcomer-card{grid-template-columns:1fr;padding:24px}.home-newcomer-card h3{font-size:24px}.home-newcomer-card a{width:100%}}
  `;document.head.appendChild(style);
  function addNewcomer(){if(document.querySelector('.home-newcomer'))return;const connect=[...document.querySelectorAll('section')].find(s=>s.querySelector('.connect-strip'));if(!connect)return;const sec=document.createElement('section');sec.className='home-newcomer';sec.innerHTML=`<div class="container"><div class="home-newcomer-card"><div><div class="kicker">FIRST VISIT</div><h3>처음 오셨나요?</h3><p>예배시간부터 새가족 등록, 문의, 오시는 길까지 한 번에 안내해 드립니다.</p></div><a href="/newcomers.html">새가족 안내 보기 →</a></div></div>`;connect.parentNode.insertBefore(sec,connect)}
  function addMeditationLink(){
    document.querySelector('.home-meditation')?.remove();
    const card=document.getElementById('latestSermonCard');if(!card||card.querySelector('.sermon-meditation-link'))return;
    const meta=card.querySelector('.feature-meta');
    const link=document.createElement('a');link.className='sermon-meditation-link';link.href='/weekly-meditation.html';link.innerHTML=`<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4.5 6.5c4.6-.9 8.4.1 11.5 3v16c-3.1-2.9-6.9-3.9-11.5-3V6.5Z"/><path d="M27.5 6.5c-4.6-.9-8.4.1-11.5 3v16c3.1-2.9 6.9-3.9 11.5-3V6.5Z"/></svg><span>이번 주 말씀묵상 보기</span><span class="sermon-meditation-arrow">→</span>`;
    if(meta)meta.insertAdjacentElement('afterend',link);else card.appendChild(link);
    link.addEventListener('click',e=>e.stopPropagation());
  }
  function cleanHeroSermonMeta(){
    document.querySelectorAll('.hero-slide').forEach(slide=>{
      const label=slide.querySelector('.hero-label')?.textContent?.trim();
      if(label!=='LATEST SERMON')return;
      const meta=slide.querySelector('.hero-glass-meta');
      if(!meta)return;
      const spans=[...meta.querySelectorAll('span')];
      if(spans.length>=3)spans[1].remove();
    });
  }
  function run(){addNewcomer();addMeditationLink();cleanHeroSermonMeta()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
  const observer=new MutationObserver(()=>cleanHeroSermonMeta());observer.observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>observer.disconnect(),5000);
})();