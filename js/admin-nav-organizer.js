(()=>{
  // 공개 홈페이지 상단 메뉴 순서를 그대로 따라가는 관리자 사이드바
  const groups=[
    ['홈',['dashboard','weeklyHome','content','images']],
    ['교회소개',['worship']],
    ['은혜의 말씀',['sermons']],
    ['사랑방 모임 · 조직/부서',['ministryGroups']],
    ['교회학교',['sundayPro']],
    ['교회소식',['news','galleryPro','media']],
    ['고급 관리',['universal','design']]
  ];
  const labels={
    dashboard:'대시보드',
    weeklyHome:'이번 주 말씀·주보',
    content:'기본 콘텐츠',
    images:'이미지 슬롯',
    worship:'예배 시간',
    sermons:'설교',
    ministryGroups:'사랑방·부서 관리',
    sundayPro:'주일학교 편집',
    news:'교회소식',
    galleryPro:'사진첩 편집',
    media:'미디어',
    universal:'페이지 전체 편집',
    design:'디자인·CSS'
  };
  const sectionNo={
    '홈':'01',
    '교회소개':'02',
    '은혜의 말씀':'03',
    '사랑방 모임 · 조직/부서':'04 · 05',
    '교회학교':'06',
    '교회소식':'07',
    '고급 관리':'관리'
  };

  function organize(){
    const nav=document.getElementById('sideNav');
    if(!nav)return;
    const buttons={};
    nav.querySelectorAll('button[data-page]').forEach(b=>buttons[b.dataset.page]=b);
    nav.querySelectorAll('.nav-section-label').forEach(x=>x.remove());

    groups.forEach(([title,ids])=>{
      const existing=ids.filter(id=>buttons[id]);
      if(!existing.length)return;
      const label=document.createElement('div');
      label.className='nav-section-label';
      label.innerHTML=`<span class="nav-section-no">${sectionNo[title]||''}</span><span>${title}</span>`;
      nav.appendChild(label);
      existing.forEach(id=>{
        const b=buttons[id];
        if(labels[id])b.textContent=labels[id];
        nav.appendChild(b);
      });
    });
  }

  function polish(){
    if(document.getElementById('adminNavPolish'))return;
    const s=document.createElement('style');
    s.id='adminNavPolish';
    s.textContent=`
      .side-nav .nav-section-label{display:flex;align-items:center;gap:8px;margin:19px 12px 6px;padding:0 10px;font-size:10px;letter-spacing:.1em;font-weight:900;opacity:.66}
      .side-nav .nav-section-label .nav-section-no{display:inline-flex;align-items:center;justify-content:center;min-width:29px;height:18px;padding:0 5px;border-radius:999px;background:rgba(255,255,255,.10);font-size:9px;letter-spacing:0;opacity:.9}
      .side-nav button{margin:2px 8px;border-radius:10px}
      .side-nav button.active{font-weight:900}
      .sidebar-brand{padding-bottom:16px}
    `;
    document.head.appendChild(s);
  }

  polish();
  organize();
  let timer;
  new MutationObserver(()=>{
    clearTimeout(timer);
    timer=setTimeout(organize,80);
  }).observe(document.getElementById('sideNav')||document.documentElement,{childList:true,subtree:true});
})();