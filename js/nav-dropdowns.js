(()=>{
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
      btn.addEventListener('click',()=>{
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
  const run=()=>document.querySelectorAll('.navlinks').forEach(enhance);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();