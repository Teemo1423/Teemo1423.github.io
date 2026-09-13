(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const style=document.createElement('style');style.id='homeEnhancementsStyles';style.textContent=`
    .home-meditation{padding:26px 0 10px;background:#fff}.home-meditation-line{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:14px;align-items:center;padding:16px 20px;border-radius:18px;background:#f1f6f3;border:1px solid #dce9e1}.home-meditation-label{font-size:12px;letter-spacing:.12em;font-weight:900;color:var(--green);white-space:nowrap}.home-meditation-text{min-width:0;font-size:15px;line-height:1.5;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.home-meditation-text b{font-weight:900}.home-meditation-link{display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:0 14px;border-radius:999px;background:var(--green);color:#fff;font-size:13px;font-weight:900;white-space:nowrap}
    .home-newcomer{padding:28px 0 68px;background:#fff}.home-newcomer-card{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;padding:28px 32px;border-radius:24px;background:#f1f6f3;border:1px solid #dce9e1}.home-newcomer-card h3{font-size:28px;margin:5px 0 8px;letter-spacing:-.035em}.home-newcomer-card p{margin:0;color:var(--muted);line-height:1.7}.home-newcomer-card a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:999px;background:var(--green);color:#fff;font-weight:900;white-space:nowrap}
    @media(max-width:820px){.home-meditation{padding:18px 0 6px}.home-meditation-line{grid-template-columns:1fr auto;gap:8px 12px;padding:14px 16px}.home-meditation-label{grid-column:1/-1;font-size:11px}.home-meditation-text{font-size:14px}.home-meditation-link{min-height:36px;padding:0 12px;font-size:12px}.home-newcomer{padding:20px 0 44px}.home-newcomer-card{grid-template-columns:1fr;padding:24px}.home-newcomer-card h3{font-size:24px}.home-newcomer-card a{width:100%}}
    @media(max-width:390px){.home-meditation-line{grid-template-columns:1fr}.home-meditation-link{width:100%}}
  `;document.head.appendChild(style);
  function addNewcomer(){if(document.querySelector('.home-newcomer'))return;const connect=[...document.querySelectorAll('section')].find(s=>s.querySelector('.connect-strip'));if(!connect)return;const sec=document.createElement('section');sec.className='home-newcomer';sec.innerHTML=`<div class="container"><div class="home-newcomer-card"><div><div class="kicker">FIRST VISIT</div><h3>처음 오셨나요?</h3><p>예배시간부터 새가족 등록, 문의, 오시는 길까지 한 번에 안내해 드립니다.</p></div><a href="/newcomers.html">새가족 안내 보기 →</a></div></div>`;connect.parentNode.insertBefore(sec,connect)}
  async function run(){
    addNewcomer();
    try{
      const r=await fetch('/content/meditation.json?v='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('meditation');const d=await r.json();if(d.enabled===false)return;
      const quick=document.querySelector('.quick-wrap');if(!quick||document.querySelector('.home-meditation'))return;
      const sec=document.createElement('section');sec.className='home-meditation';
      const line=String(d.summary||d.title||'').trim();
      sec.innerHTML=`<div class="container"><div class="home-meditation-line"><div class="home-meditation-label">이번 주 말씀묵상</div><div class="home-meditation-text"><b>${esc(d.title||'')}</b>${line&&line!==(d.title||'')?' · '+esc(line):''}</div><a class="home-meditation-link" href="/weekly-meditation.html">묵상 보기 →</a></div></div>`;
      quick.insertAdjacentElement('afterend',sec);
    }catch(e){console.warn('home meditation unavailable',e)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();