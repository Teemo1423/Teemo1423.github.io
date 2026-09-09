(()=>{
  const path=location.pathname||'/';
  const isHome=path==='/'||path.endsWith('/index.html');
  if(!isHome)return;
  if(sessionStorage.getItem('churchChannelPopupClosed')==='1')return;

  const kakao='https://pf.kakao.com/_BYtgG';
  const youtube='https://youtube.com/channel/UCiGQ15zMavL6wrRaKZzydiQ?si=7lehv1JcI6BnWYHI';
  const style=document.createElement('style');
  style.textContent=`
    .channel-popup-backdrop{position:fixed;inset:0;z-index:5000;background:rgba(5,18,13,.48);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:grid;place-items:center;padding:20px}
    .channel-popup{width:min(680px,100%);max-height:calc(100vh - 40px);overflow:auto;background:#fff;border-radius:28px;box-shadow:0 28px 90px rgba(0,0,0,.28);position:relative;padding:34px}
    .channel-popup-close{position:absolute;right:18px;top:18px;width:38px;height:38px;border:0;border-radius:50%;background:#f1f4f2;color:#3b4b43;font-size:22px;cursor:pointer}
    .channel-popup-logo{width:54px;height:54px;object-fit:contain;display:block;margin-bottom:18px}
    .channel-popup h2{font-size:31px;line-height:1.25;letter-spacing:-.04em;margin:0 46px 8px 0;color:#173e2f}
    .channel-popup-sub{margin:0 0 26px;color:#6f7d76;font-size:15px}.channel-popup-sub b{color:#2f6b4f}
    .channel-popup-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .channel-box{border:1px solid #e2e8e4;border-radius:20px;padding:20px;background:#fbfcfb;text-align:center}
    .channel-box h3{font-size:19px;margin:0 0 5px}.channel-box p{font-size:13px;line-height:1.55;color:#7b8781;margin:0 0 15px}
    .qr-slot{width:150px;aspect-ratio:1;margin:0 auto 16px;border:1px dashed #b9c6bf;border-radius:14px;background:#fff;display:grid;place-items:center;color:#8b9891;font-size:12px;font-weight:800;overflow:hidden}
    .qr-slot img{width:100%;height:100%;object-fit:cover;display:none}
    .channel-go{display:flex;align-items:center;justify-content:center;min-height:44px;border-radius:12px;background:#2f6b4f;color:#fff!important;font-weight:900;text-decoration:none}.channel-box.youtube .channel-go{background:#202624}
    .channel-popup-foot{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:20px;font-size:13px;color:#707d76}
    .channel-popup-foot button{border:0;background:none;color:#53645b;font-weight:800;cursor:pointer;padding:7px}
    @media(max-width:620px){.channel-popup{padding:27px 18px 20px;border-radius:22px}.channel-popup h2{font-size:25px}.channel-popup-grid{grid-template-columns:1fr}.channel-box{display:grid;grid-template-columns:100px 1fr;gap:14px;text-align:left;align-items:center;padding:15px}.channel-box .qr-slot{grid-row:1/4;width:100px;margin:0}.channel-box h3{margin:0}.channel-box p{margin:2px 0 7px}.channel-go{min-height:40px}.channel-popup-foot{margin-top:14px}.channel-popup-backdrop{padding:12px}}
  `;
  document.head.appendChild(style);

  const wrap=document.createElement('div');
  wrap.className='channel-popup-backdrop';
  wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-label','모현소망교회 채널 안내');
  wrap.innerHTML=`<section class="channel-popup"><button class="channel-popup-close" type="button" aria-label="팝업 닫기">×</button><img class="channel-popup-logo" src="/assets/site/logo.png" alt="모현소망교회 로고"><h2>모현소망교회 소식 알아보기 !</h2><p class="channel-popup-sub"><b>&lt; 카카오톡 채널 &amp; 유튜브 &gt;</b><br>교회 소식과 말씀 영상을 더 편하게 만나보세요.</p><div class="channel-popup-grid"><article class="channel-box kakao"><div class="qr-slot" data-qr="kakao"><img alt="카카오톡 채널 QR"><span>카카오톡<br>QR 이미지 영역</span></div><h3>카카오톡 채널</h3><p>교회 공지와 새로운 소식을 받아보세요.</p><a class="channel-go" href="${kakao}" target="_blank" rel="noopener">카카오톡 채널 열기</a></article><article class="channel-box youtube"><div class="qr-slot" data-qr="youtube"><img alt="YouTube 채널 QR"><span>YouTube<br>QR 이미지 영역</span></div><h3>YouTube</h3><p>주일 말씀과 교회 영상을 확인하세요.</p><a class="channel-go" href="${youtube}" target="_blank" rel="noopener">YouTube 채널 열기</a></article></div><div class="channel-popup-foot"><span>QR 이미지는 추후 관리자에서 교체 가능하도록 확장할 수 있습니다.</span><button type="button" data-close-today>이번 접속에서 닫기</button></div></section>`;
  document.body.appendChild(wrap);

  const close=()=>wrap.remove();
  wrap.querySelector('.channel-popup-close').onclick=close;
  wrap.querySelector('[data-close-today]').onclick=()=>{sessionStorage.setItem('churchChannelPopupClosed','1');close()};
  wrap.addEventListener('click',e=>{if(e.target===wrap)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.contains(wrap))close()});
})();
