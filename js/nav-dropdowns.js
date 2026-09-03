(()=>{
  function injectMobileStyles(){
    if(document.getElementById('mobileNavFix2'))return;
    const style=document.createElement('style');
    style.id='mobileNavFix2';
    style.textContent=`
      .mobile-menu-toggle{display:none;border:0;background:transparent;padding:8px;width:44px;height:44px;border-radius:12px;cursor:pointer;align-items:center;justify-content:center;flex-direction:column;gap:5px;color:var(--ink,#14231d)}
      .mobile-menu-toggle span{display:block;width:23px;height:2px;background:currentColor;border-radius:2px;transition:.2s ease}
      .mobile-menu-toggle.is-open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
      .mobile-menu-toggle.is-open span:nth-child(2){opacity:0}
      .mobile-menu-toggle.is-open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
      @media(max-width:900px){
        .site-header{position:sticky!important;top:0!important;z-index:1000!important;background:rgba(255,255,255,.98)!important}
        .site-header .nav{position:relative!important;display:flex!important;align-items:center!important;justify-content:space-between!important;height:76px!important;min-height:76px!important;padding:8px 20px!important;gap:12px!important}
        .site-header .brand{display:flex!important;align-items:center!important;min-width:0!important;width:auto!important;max-width:calc(100% - 56px)!important}
        .site-header .brand-logo{width:40px!important;height:40px!important;flex:0 0 40px!important}
        .site-header .brand-copy{min-width:0!important}
        .site-header .brand-copy small{font-size:9px!important;white-space:nowrap!important}
        .site-header .brand-copy strong{font-size:18px!important;white-space:nowrap!important}
        .mobile-menu-toggle{display:flex!important;flex:0 0 44px!important;position:relative!important;z-index:1002!important}
        .site-header .navlinks{position:absolute!important;top:76px!important;left:20px!important;right:20px!important;width:auto!important;display:none!important;flex-direction:column!important;align-items:stretch!important;gap:0!important;overflow:visible!important;white-space:normal!important;padding:10px!important;margin:0!important;background:#fff!important;border:1px solid var(--line,#e4e4df)!important;border-radius:16px!important;box-shadow:0 16px 42px rgba(20,54,41,.16)!important;z-index:1001!important;max-height:calc(100vh - 96px)!important;overflow-y:auto!important}
        .site-header .navlinks.mobile-open{display:flex!important}
        .site-header .navlinks>a,.site-header .navitem>a{display:flex!important;align-items:center!important;min-height:46px!important;padding:0 12px!important;border-radius:10px!important}
        .site-header .navitem{display:block!important}
        .site-header .dropdown{display:block!important;position:static!important;transform:none!important;opacity:1!important;visibility:visible!important;box-shadow:none!important;border:0!important;background:#f7faf8!important;border-radius:10px!important;min-width:0!important;padding:4px!important;margin:0 6px 6px!important}
        .site-header .dropdown a{padding:9px 10px!important;font-size:13px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function enhance(nav){
    if(!nav||nav.dataset.dropdownReady==='1')return;
    nav.dataset.dropdownReady='1';
    const header=nav.closest('.site-header');
    const navWrap=nav.closest('.nav');
    const links=[...nav.children].filter(el=>el.tagName==='A'||el.classList?.contains('navitem'));
    const findDirect=text=>links.find(el=>el.tagName==='A'&&el.textContent.trim()===text);
    const wrap=(anchor,items,key)=>{
      if(!anchor||anchor.parentElement?.classList.contains('navitem'))return;
      const item=document.createElement('div');item.className='navitem';item.dataset.navDropdown=key;
      anchor.parentNode.insertBefore(item,anchor);item.appendChild(anchor);
      const dd=document.createElement('div');dd.className='dropdown';
      items.forEach(([label,href])=>{const a=document.createElement('a');a.href=href;a.textContent=label;dd.appendChild(a)});
      item.appendChild(dd);
    };
    wrap(findDirect('교회소개'),[['교회 소개','/about.html'],['목회자 · 섬기시는 분','/staff.html']],'about');
    wrap(findDirect('교육·사역'),[['교육·사역 홈','/ministries.html'],['주일학교','/sunday-school.html']],'ministries');

    if(navWrap && !navWrap.querySelector('.mobile-menu-toggle')){
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='mobile-menu-toggle';
      btn.setAttribute('aria-label','메뉴 열기');
      btn.setAttribute('aria-expanded','false');
      btn.innerHTML='<span></span><span></span><span></span>';
      const brand=navWrap.querySelector('.brand');
      if(brand) brand.insertAdjacentElement('afterend',btn); else navWrap.insertBefore(btn,nav);
      const close=()=>{nav.classList.remove('mobile-open');btn.classList.remove('is-open');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','메뉴 열기')};
      btn.addEventListener('click',e=>{
        e.stopPropagation();
        const open=!nav.classList.contains('mobile-open');
        nav.classList.toggle('mobile-open',open);
        btn.classList.toggle('is-open',open);
        btn.setAttribute('aria-expanded',String(open));
        btn.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');
      });
      nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});
      window.addEventListener('resize',()=>{if(window.innerWidth>900)close()},{passive:true});
      document.addEventListener('click',e=>{if(window.innerWidth<=900&&header&&!header.contains(e.target))close()});
    }
  }
  injectMobileStyles();
  const run=()=>document.querySelectorAll('.navlinks').forEach(enhance);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();