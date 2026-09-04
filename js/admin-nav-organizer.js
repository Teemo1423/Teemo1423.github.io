(()=>{
  // 공개 홈페이지 전체메뉴와 같은 순서/하위 카테고리로 관리자 사이드바 구성
  const groups=[
    ['홈',['dashboard','weeklyHome','content','images']],
    ['교회소개',['worship']],
    ['은혜의 말씀',['sermons']],
    ['사랑방 모임',['sarangbangEdit']],
    ['조직/부서',['menMissionEdit','womenMissionEdit','choirEdit']],
    ['교회학교',['sundayPro','youngAdultsEdit']],
    ['교회소식',['news','galleryPro','media']],
    ['고급 관리',['universal','design']]
  ];
  const labels={
    dashboard:'대시보드',weeklyHome:'이번 주 말씀·주보',content:'기본 콘텐츠',images:'이미지 슬롯',
    worship:'예배안내 · 시간',sermons:'주일예배 설교',
    sarangbangEdit:'사랑방 모임',menMissionEdit:'남전도회',womenMissionEdit:'여전도회',choirEdit:'성가대',
    sundayPro:'주일학교',youngAdultsEdit:'청년부',
    news:'교회소식',galleryPro:'사진첩',media:'미디어 라이브러리',
    universal:'페이지 전체 편집',design:'디자인·CSS'
  };
  const sectionNo={'홈':'01','교회소개':'02','은혜의 말씀':'03','사랑방 모임':'04','조직/부서':'05','교회학교':'06','교회소식':'07','고급 관리':'관리'};
  const submenuGroups=new Set(['사랑방 모임','조직/부서','교회학교','교회소식']);

  function organize(){
    const nav=document.getElementById('sideNav');if(!nav)return;
    const buttons={};nav.querySelectorAll('button[data-page]').forEach(b=>buttons[b.dataset.page]=b);
    nav.querySelectorAll('.nav-section-label').forEach(x=>x.remove());
    groups.forEach(([title,ids])=>{
      const existing=ids.filter(id=>buttons[id]);if(!existing.length)return;
      const label=document.createElement('div');label.className='nav-section-label';label.innerHTML=`<span class="nav-section-no">${sectionNo[title]||''}</span><span>${title}</span>`;nav.appendChild(label);
      existing.forEach(id=>{const b=buttons[id];if(labels[id])b.textContent=labels[id];b.classList.toggle('nav-subitem',submenuGroups.has(title));nav.appendChild(b)});
    });
  }
  function polish(){
    if(document.getElementById('adminNavPolish'))return;
    const s=document.createElement('style');s.id='adminNavPolish';s.textContent=`
      .side-nav .nav-section-label{display:flex;align-items:center;gap:8px;margin:19px 12px 6px;padding:0 10px;font-size:10px;letter-spacing:.1em;font-weight:900;opacity:.66}
      .side-nav .nav-section-label .nav-section-no{display:inline-flex;align-items:center;justify-content:center;min-width:29px;height:18px;padding:0 5px;border-radius:999px;background:rgba(255,255,255,.10);font-size:9px;letter-spacing:0;opacity:.9}
      .side-nav button{margin:2px 8px;border-radius:10px}.side-nav button.active{font-weight:900}
      .side-nav button.nav-subitem{margin-left:20px;width:calc(100% - 28px);position:relative;padding-left:24px!important}
      .side-nav button.nav-subitem:before{content:'•';position:absolute;left:10px;opacity:.55;font-size:13px}
      .sidebar-brand{padding-bottom:16px}
    `;document.head.appendChild(s)
  }
  polish();organize();let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(organize,80)}).observe(document.getElementById('sideNav')||document.documentElement,{childList:true,subtree:true});
})();