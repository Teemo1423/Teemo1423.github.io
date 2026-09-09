(()=>{
  const origin='https://mohyeonsomang.org';
  const path=location.pathname==='/'?'/':location.pathname;
  const canonical=origin+path;
  const pageTitle=document.title||'모현소망교회';
  const descriptions={
    '/':'경기도 용인시 처인구 모현읍에 위치한 모현소망교회입니다. 예배 안내, 주일설교, 교회소식, 다음세대와 공동체 소식을 확인하세요.',
    '/about.html':'모현소망교회의 소개와 비전, 신앙공동체의 방향을 안내합니다.',
    '/staff.html':'모현소망교회를 섬기는 목회자와 교역자를 소개합니다.',
    '/worship.html':'모현소망교회의 주일예배와 예배 시간, 장소를 안내합니다.',
    '/sermons.html':'모현소망교회 주일예배 설교와 말씀 영상을 확인하세요.',
    '/news.html':'모현소망교회의 예배, 행사, 공동체와 다음세대의 최신 소식을 안내합니다.',
    '/gallery.html':'모현소망교회의 예배와 행사, 공동체 현장을 사진으로 만나보세요.',
    '/visit.html':'모현소망교회 주소, 연락처와 오시는 길을 안내합니다.',
    '/sunday-school.html':'모현소망교회 주일학교 예배와 다음세대 소식을 안내합니다.',
    '/young-adults.html':'모현소망교회 청년부 예배와 공동체를 소개합니다.'
  };
  const description=descriptions[path]||'모현소망교회 공식 홈페이지입니다. 예배와 말씀, 교회소식과 공동체 안내를 확인하세요.';
  const setMeta=(attr,key,value)=>{let el=document.head.querySelector(`meta[${attr}="${key}"]`);if(!el){el=document.createElement('meta');el.setAttribute(attr,key);document.head.appendChild(el)}el.setAttribute('content',value)};
  const setLink=(rel,href)=>{let el=document.head.querySelector(`link[rel="${rel}"]`);if(!el){el=document.createElement('link');el.rel=rel;document.head.appendChild(el)}el.href=href};
  setMeta('name','description',description);
  setMeta('property','og:type','website');
  setMeta('property','og:site_name','모현소망교회');
  setMeta('property','og:title',pageTitle);
  setMeta('property','og:description',description);
  setMeta('property','og:url',canonical);
  setMeta('property','og:locale','ko_KR');
  setMeta('property','og:image',origin+'/siteicon.png');
  setMeta('name','twitter:card','summary_large_image');
  setMeta('name','twitter:title',pageTitle);
  setMeta('name','twitter:description',description);
  setMeta('name','twitter:image',origin+'/siteicon.png');
  setLink('canonical',canonical);
  setLink('icon',origin+'/favicon.ico');
  setLink('shortcut icon',origin+'/favicon.ico');
  setLink('apple-touch-icon',origin+'/apple-touch-icon.png');
})();
