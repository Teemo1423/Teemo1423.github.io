(()=>{
  const menu=[
    {label:'교회소개',href:'/about.html',items:[['인사말 · 교회소개','/about.html'],['섬기시는 사람들','/staff.html'],['예배안내','/worship.html'],['차량 운행 안내','/transport.html'],['오시는 길','/visit.html']]},
    {label:'은혜의 말씀',href:'/sermons.html',items:[['주일예배 설교','/sermons.html']]},
    {label:'사랑방 모임 예배',href:'/sarangbang.html',items:[]},
    {label:'조직/부서',href:'/men-mission.html',items:[['남전도회','/men-mission.html'],['여전도회','/women-mission.html'],['성가대','/choir.html']]},
    {label:'교회학교',href:'/sunday-school.html',items:[['주일학교','/sunday-school.html'],['청년부','/young-adults.html']]},
    {label:'선교·후원',href:'/mission-support.html',items:[]},
    {label:'교회소식',href:'/news.html',items:[['교회소식','/news.html'],['사진첩','/gallery.html']]}
  ];
  const path=location.pathname||'/';
  const isHome=path==='/'||path.endsWith('/index.html');
  const active=href=>path===href||path.endsWith(href.replace(/^\//,''));

  const iconNews=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h12.5a2 2 0 0 1 2 2V19H6a2 2 0 0 1-2-2V5.5Z"/><path d="M18.5 9.5H20a1 1 0 0 1 1 1V17a2 2 0 0 1-2 2h-.5"/><path d="M7 9h4M7 12h8M7 15h8"/></svg>`;
  const iconAlbum=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5h10.5a2 2 0 0 1 2 2V19H6a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z"/><path d="M18.5 7.5H20a1 1 0 0 1 1 1V17a2 2 0 0 1-2 2h-.5"/><rect x="7.5" y="8" width="7.5" height="6.5" rx="1.3"/><path d="m8.5 13 2.2-2.2 1.6 1.6 1.5-1.5 1.2 1.2"/><circle cx="10" cy="9.8" r=".7"/></svg>`;
  const iconPhoto=`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="8" cy="9" r="1.4"/><path d="m5.5 17 4.2-4.3 3 3 2.2-2.2 3.6 3.5"/></svg>`;

  function buildDesktop(nav){
    if(!nav)return;
    nav.innerHTML='';
    const home=document.createElement('a');home.href='/';home.textContent='홈';if(isHome)home.classList.add('active');nav.appendChild(home);
    menu.forEach(group=>{
      if(!group.items.length){const a=document.createElement('a');a.href=group.href;a.textContent=group.label;if(active(group.href))a.classList.add('active');nav.appendChild(a);return}
      const item=document.createElement('div');item.className='navitem';
      const a=document.createElement('a');a.href=group.href;a.textContent=group.label;if([group.href,...group.items.map(x=>x[1])].some(active))a.classList.add('active');
      const dd=document.createElement('div');dd.className='dropdown';group.items.forEach(([label,href])=>{const x=document.createElement('a');x.href=href;x.textContent=label;if(active(href))x.classList.add('active');dd.appendChild(x)});
      item.append(a,dd);nav.appendChild(item)
    })
  }

  function injectStyles(){
    document.getElementById('churchNavHierarchy')?.remove();
    const s=document.createElement('style');s.id='churchNavHierarchy';s.textContent=`
      .navlinks{gap:18px}.navitem>a{font-weight:800}.dropdown{min-width:220px}.dropdown a{font-size:14px}
      .quick-icon svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;display:block}
      .mobile-menu-toggle,.nav-backdrop{display:none!important}.mobile-bottom-nav{display:none}
      .site-footer.unified-footer{background:#09251b;color:#dfe9e4;padding:72px 0 58px!important}
      .unified-footer .footer-grid{display:grid;grid-template-columns:1.05fr 1.6fr .72fr;gap:64px;align-items:start}
      .unified-footer .footer-brand small{display:block;letter-spacing:.14em;font-weight:800;font-size:13px;margin-bottom:4px}.unified-footer .footer-brand strong{display:block;font-size:31px;line-height:1.05;color:#eaf2ee}.unified-footer .footer-brand p{margin:34px 0 0;line-height:1.8;color:#aebdb6;font-size:15px}.unified-footer .footer-info{display:grid;gap:18px}.unified-footer .footer-info p{margin:0;color:#aebdb6;font-size:15px;line-height:1.55}.unified-footer .footer-info b{display:inline-block;min-width:58px;color:#edf4f0}.unified-footer .footer-info a{color:#edf4f0;font-weight:800;text-decoration:none}.unified-footer .footer-info a:hover{text-decoration:underline}.unified-footer .footer-links{display:grid;gap:17px}.unified-footer .footer-links a{color:#e4ece8;font-weight:800;font-size:16px}.unified-footer .footer-links a:hover{opacity:.78}
      @media(max-width:900px){
        body{padding-bottom:0!important}main{padding-bottom:18px!important}.site-footer{padding-bottom:calc(112px + env(safe-area-inset-bottom))!important}
        .site-header{position:sticky!important;top:0!important;z-index:1000!important;background:rgba(255,255,255,.98)!important}.site-header .nav{height:70px!important;min-height:70px!important;padding:8px 20px!important;display:flex!important;align-items:center!important;justify-content:center!important}.site-header .brand{max-width:100%!important;margin:auto!important}.site-header .brand-logo{width:38px!important;height:38px!important}.site-header .brand-copy strong{font-size:18px!important}.site-header .brand-copy small{font-size:8px!important}.site-header .navlinks{display:none!important}
        .mobile-bottom-nav{display:grid!important;grid-template-columns:repeat(5,1fr);position:fixed;left:0;right:0;bottom:0;z-index:2000;background:rgba(255,255,255,.98);border-top:1px solid var(--line,#e4e4df);box-shadow:0 -8px 26px rgba(20,54,41,.10);padding:7px 6px calc(7px + env(safe-area-inset-bottom));min-height:72px;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
        .mobile-bottom-nav a{display:flex;min-width:0;min-height:58px;align-items:center;justify-content:center;flex-direction:column;gap:3px;border-radius:12px;color:#66736d;font-size:11px;font-weight:800;line-height:1;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.mobile-bottom-nav a .mb-icon{width:28px;height:28px;display:grid;place-items:center;line-height:1;font-size:22px;font-family:Arial,sans-serif}.mobile-bottom-nav a .mb-icon svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}.mobile-bottom-nav a.active{color:var(--green,#2f6b4f);background:#eef5f1}.mobile-bottom-nav a:active{background:#e7f1eb;transform:scale(.97)}
        .site-footer.unified-footer{padding:46px 0 calc(112px + env(safe-area-inset-bottom))!important}.unified-footer .footer-grid{grid-template-columns:1fr;gap:32px}.unified-footer .footer-brand strong{font-size:27px}.unified-footer .footer-brand p{margin-top:20px}.unified-footer .footer-links{grid-template-columns:1fr 1fr;gap:14px 18px}.unified-footer .footer-links a{font-size:14px}
      }
    `;document.head.appendChild(s)
  }

  function ensureFooter(){
    if(path.endsWith('/admin.html'))return;
    let footer=document.querySelector('.site-footer');
    if(!footer){footer=document.createElement('footer');document.body.appendChild(footer)}
    footer.className='site-footer unified-footer';
    footer.innerHTML=`<div class="container footer-grid"><div class="footer-brand"><small>MOHYEON SOMANG CHURCH</small><strong>모현소망교회</strong><p>성령과 진리로 예배드리는 교회<br>요한복음 4:24</p></div><div class="footer-info"><p><b>교단</b> 대한예수교장로회</p><p><b>담임목사</b> 이동호 목사</p><p><b>주소</b> 경기 용인시 처인구 모현읍 백옥대로2332번길 21-5</p><p><b>전화</b> <a href="tel:0313323855" aria-label="모현소망교회 031-332-3855 전화하기">031-332-3855</a></p></div><nav class="footer-links" aria-label="하단 메뉴"><a href="/about.html">교회소개</a><a href="/worship.html">예배안내</a><a href="/sermons.html">말씀과 설교</a><a href="/news.html">교회소식</a><a href="/gallery.html">사진첩</a><a href="/visit.html">오시는 길</a><a href="https://pf.kakao.com/_BYtgG" target="_blank" rel="noopener">카카오톡 채널 ↗</a><a href="https://youtube.com/channel/UCiGQ15zMavL6wrRaKZzydiQ?si=7lehv1JcI6BnWYHI" target="_blank" rel="noopener">YouTube ↗</a></nav></div>`;
  }

  function replaceQuickIcons(){const news=document.querySelector('.quick-menu a[href="/news.html"] .quick-icon');const gallery=document.querySelector('.quick-menu a[href="/gallery.html"] .quick-icon');if(news)news.innerHTML=iconNews;if(gallery)gallery.innerHTML=iconAlbum}

  function injectBottomNav(){
    document.querySelector('.mobile-bottom-nav')?.remove();
    const nav=document.createElement('nav');nav.className='mobile-bottom-nav';nav.setAttribute('aria-label','모바일 주요 메뉴');
    const items=[['⌂','홈','/'],['▶','설교','/sermons.html'],[iconNews,'소식','/news.html'],[iconPhoto,'사진','/gallery.html'],['☰','더보기','/menu.html']];
    const morePaths=['/menu.html','/about.html','/staff.html','/worship.html','/transport.html','/visit.html','/sarangbang.html','/men-mission.html','/women-mission.html','/choir.html','/sunday-school.html','/young-adults.html','/mission-support.html'];
    items.forEach(([icon,label,href])=>{const a=document.createElement('a');a.href=href;a.innerHTML=`<span class="mb-icon" aria-hidden="true">${icon}</span><span>${label}</span>`;const isMore=href==='/menu.html'&&morePaths.some(active);if((href==='/'&&isHome)||active(href)||isMore)a.classList.add('active');nav.appendChild(a)});
    document.body.appendChild(nav)
  }

  function loadCommonImageAdjust(){if(document.querySelector('script[data-site-image-adjust]'))return;const s=document.createElement('script');s.dataset.siteImageAdjust='1';s.src='/js/site-image-adjust.js?v=imageadjust3';document.head.appendChild(s)}

  function run(){injectStyles();document.querySelectorAll('.mobile-menu-toggle,.nav-backdrop').forEach(x=>x.remove());document.querySelectorAll('.navlinks').forEach(buildDesktop);replaceQuickIcons();ensureFooter();injectBottomNav();loadCommonImageAdjust()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
