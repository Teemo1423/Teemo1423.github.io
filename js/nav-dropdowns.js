(()=>{
  const menu=[
    {label:'교회소개',href:'/about.html',items:[['인사말 · 교회소개','/about.html'],['섬기시는 사람들','/staff.html'],['예배안내','/worship.html'],['오시는 길','/visit.html']]},
    {label:'은혜의 말씀',href:'/sermons.html',items:[['주일예배 설교','/sermons.html']]},
    {label:'사랑방 모임',href:'/sarangbang.html',items:[]},
    {label:'조직/부서',href:'/men-mission.html',items:[['남전도회','/men-mission.html'],['여전도회','/women-mission.html'],['성가대','/choir.html']]},
    {label:'교회학교',href:'/sunday-school.html',items:[['주일학교','/sunday-school.html'],['청년부','/young-adults.html']]},
    {label:'교회소식',href:'/news.html',items:[['교회소식','/news.html'],['사진첩','/gallery.html']]}
  ];

  function injectStyles(){
    document.getElementById('churchNavHierarchy')?.remove();
    const s=document.createElement('style');
    s.id='churchNavHierarchy';
    s.textContent=`
      .navlinks{gap:18px}.navitem>a{font-weight:800}.dropdown{min-width:220px}.dropdown a{font-size:14px}
      .mobile-menu-toggle{display:none;border:0;background:transparent;padding:8px;width:46px;height:46px;border-radius:12px;cursor:pointer;align-items:center;justify-content:center;flex-direction:column;gap:5px;color:var(--ink,#14231d);position:relative;pointer-events:auto!important;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
      .mobile-menu-toggle span{display:block;width:24px;height:2px;background:currentColor;border-radius:2px;transition:.2s ease;pointer-events:none}.mobile-menu-toggle.is-open span:nth-child(1){transform:translateY(7px) rotate(45deg)}.mobile-menu-toggle.is-open span:nth-child(2){opacity:0}.mobile-menu-toggle.is-open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
      @media(max-width:900px){
        html.menu-open{overflow:hidden!important;overscroll-behavior:none!important}
        body.menu-open{overflow:hidden!important;overscroll-behavior:none!important;width:100%!important}
        .site-header{position:sticky!important;top:0!important;z-index:1200!important;background:rgba(255,255,255,.99)!important}
        .site-header .nav{position:relative!important;display:flex!important;align-items:center!important;justify-content:space-between!important;height:76px!important;min-height:76px!important;padding:8px 20px!important;gap:12px!important}
        .site-header .brand{display:flex!important;align-items:center!important;max-width:calc(100% - 60px)!important;min-width:0!important;position:relative!important;z-index:1201!important}
        .site-header .brand-logo{width:40px!important;height:40px!important;flex:0 0 40px!important}
        .site-header .brand-copy{min-width:0!important}.site-header .brand-copy small{font-size:9px!important;white-space:nowrap!important}.site-header .brand-copy strong{font-size:18px!important;white-space:nowrap!important}
        .mobile-menu-toggle{display:flex!important;z-index:1402!important;flex:0 0 46px!important;background:#fff!important}
        .site-header .navlinks{position:fixed!important;top:0!important;right:0!important;left:auto!important;width:min(88vw,390px)!important;height:100dvh!important;max-height:100dvh!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:0!important;padding:96px 0 28px!important;margin:0!important;background:#fff!important;border:0!important;border-left:1px solid var(--line,#e4e4df)!important;border-radius:0!important;box-shadow:-18px 0 45px rgba(20,54,41,.18)!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;touch-action:pan-y!important;white-space:normal!important;z-index:1401!important;transform:translate3d(102%,0,0)!important;opacity:1!important;visibility:visible!important;transition:transform .28s ease!important;pointer-events:none!important}
        .site-header .navlinks.mobile-open{transform:translate3d(0,0,0)!important;pointer-events:auto!important}
        .site-header .navlinks:before{content:'모현소망교회 메뉴';position:absolute;top:0;left:0;right:0;height:76px;display:flex;align-items:center;padding:0 22px;border-bottom:1px solid var(--line,#e4e4df);font-size:13px;letter-spacing:.08em;color:var(--green,#2f6b4f);font-weight:900;background:#fff}
        .site-header .navlinks>a,.site-header .navitem>a{display:flex!important;align-items:center!important;min-height:54px!important;padding:0 22px!important;font-size:17px!important;font-weight:800!important;border-bottom:1px solid var(--line,#e4e4df)!important;border-radius:0!important}
        .site-header .navitem{display:block!important}
        .site-header .dropdown{display:block!important;position:static!important;transform:none!important;opacity:1!important;visibility:visible!important;box-shadow:none!important;border:0!important;background:#fafbf9!important;border-radius:0!important;min-width:0!important;padding:5px 0 10px!important;margin:0!important}
        .site-header .dropdown a{display:block!important;padding:10px 28px 10px 42px!important;font-size:14px!important;color:#33443c!important;position:relative}.site-header .dropdown a:before{content:'└';position:absolute;left:25px;color:#9aa69f}
        .nav-backdrop{display:block!important;position:fixed!important;inset:0!important;background:rgba(12,25,20,.34)!important;z-index:1399!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:opacity .25s ease,visibility .25s ease!important;touch-action:none!important}.nav-backdrop.show{opacity:1!important;visibility:visible!important;pointer-events:auto!important}
      }
    `;
    document.head.appendChild(s);
  }

  function isActive(path,href){return path===href||path.endsWith(href.replace(/^\//,''))}

  function build(nav){
    if(!nav)return;
    const path=location.pathname||'/';
    nav.innerHTML='';
    const home=document.createElement('a');home.href='/';home.textContent='홈';if(path==='/'||path.endsWith('/index.html'))home.classList.add('active');nav.appendChild(home);
    menu.forEach(group=>{
      if(!group.items.length){const a=document.createElement('a');a.href=group.href;a.textContent=group.label;if(isActive(path,group.href))a.classList.add('active');nav.appendChild(a);return}
      const item=document.createElement('div');item.className='navitem';
      const a=document.createElement('a');a.href=group.href;a.textContent=group.label;
      const all=[group.href,...group.items.map(x=>x[1])];if(all.some(h=>isActive(path,h)))a.classList.add('active');
      const dd=document.createElement('div');dd.className='dropdown';
      group.items.forEach(([label,href])=>{const x=document.createElement('a');x.href=href;x.textContent=label;if(isActive(path,href))x.classList.add('active');dd.appendChild(x)});
      item.append(a,dd);nav.appendChild(item);
    });
  }

  function enhance(nav){
    if(!nav||nav.dataset.mobileStable==='8')return;
    nav.dataset.mobileStable='8';
    build(nav);
    const wrap=nav.closest('.nav');if(!wrap)return;
    let btn=wrap.querySelector('.mobile-menu-toggle');
    if(!btn){btn=document.createElement('button');btn.type='button';btn.className='mobile-menu-toggle';btn.setAttribute('aria-label','메뉴 열기');btn.setAttribute('aria-expanded','false');btn.innerHTML='<span></span><span></span><span></span>';const brand=wrap.querySelector('.brand');brand?brand.insertAdjacentElement('afterend',btn):wrap.insertBefore(btn,nav)}
    let backdrop=document.querySelector('.nav-backdrop');
    if(!backdrop){backdrop=document.createElement('div');backdrop.className='nav-backdrop';document.body.appendChild(backdrop)}

    let lockedScrollY=0;
    const lockPage=()=>{
      lockedScrollY=window.scrollY||window.pageYOffset||0;
      document.documentElement.classList.add('menu-open');
      document.body.classList.add('menu-open');
      document.body.style.position='fixed';
      document.body.style.top=`-${lockedScrollY}px`;
      document.body.style.left='0';
      document.body.style.right='0';
      document.body.style.width='100%';
    };
    const unlockPage=()=>{
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
      document.body.style.position='';
      document.body.style.top='';
      document.body.style.left='';
      document.body.style.right='';
      document.body.style.width='';
      window.scrollTo(0,lockedScrollY);
    };
    const close=()=>{const wasOpen=nav.classList.contains('mobile-open');nav.classList.remove('mobile-open');btn.classList.remove('is-open');backdrop.classList.remove('show');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','메뉴 열기');if(wasOpen)unlockPage()};
    const open=()=>{lockPage();nav.classList.add('mobile-open');btn.classList.add('is-open');backdrop.classList.add('show');btn.setAttribute('aria-expanded','true');btn.setAttribute('aria-label','메뉴 닫기')};

    btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();nav.classList.contains('mobile-open')?close():open()},{passive:false});
    backdrop.addEventListener('click',close,false);
    backdrop.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
    nav.addEventListener('touchmove',e=>e.stopPropagation(),{passive:true});
    nav.querySelectorAll('a[href]').forEach(link=>link.addEventListener('click',e=>{const href=link.getAttribute('href');if(!href)return;e.preventDefault();close();setTimeout(()=>window.location.assign(href),40)},false));
    window.addEventListener('resize',()=>{if(innerWidth>900)close()},{passive:true});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }

  injectStyles();
  const run=()=>document.querySelectorAll('.navlinks').forEach(enhance);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
