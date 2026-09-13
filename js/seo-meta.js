(()=>{
  const origin='https://mohyeonsomang.org';
  const rawPath=location.pathname||'/';
  const path=(rawPath==='/'||rawPath==='/index.html')?'/':rawPath;
  const canonical=origin+path;
  const titles={
    '/':'모현소망교회 | 용인 모현읍 교회',
    '/about.html':'교회소개 | 모현소망교회',
    '/staff.html':'목회자 · 섬기시는 분 | 모현소망교회',
    '/newcomers.html':'새가족 안내 | 모현소망교회',
    '/weekly-meditation.html':'이번 주 말씀묵상 | 모현소망교회',
    '/worship.html':'예배안내 | 모현소망교회',
    '/transport.html':'차량 운행 안내 | 모현소망교회',
    '/visit.html':'오시는 길 | 모현소망교회',
    '/sermons.html':'주일예배 설교 | 모현소망교회',
    '/sarangbang.html':'사랑방 모임 예배 | 모현소망교회',
    '/men-mission.html':'남전도회 | 모현소망교회',
    '/women-mission.html':'여전도회 | 모현소망교회',
    '/choir.html':'성가대 | 모현소망교회',
    '/sunday-school.html':'주일학교 | 모현소망교회',
    '/young-adults.html':'청년부 | 모현소망교회',
    '/mission-support.html':'선교 · 후원 | 모현소망교회',
    '/news.html':'교회소식 | 모현소망교회',
    '/gallery.html':'사진첩 | 모현소망교회',
    '/ministries.html':'교육 · 사역 | 모현소망교회',
    '/menu.html':'전체 메뉴 | 모현소망교회'
  };
  const descriptions={
    '/':'경기도 용인시 처인구 모현읍 모현소망교회 공식 홈페이지입니다. 주일예배, 설교, 이번 주 말씀묵상, 교회소식, 새가족 안내와 오시는 길을 확인하세요.',
    '/about.html':'모현소망교회의 비전과 예배·교제·훈련·사역·선교의 사명, 신앙공동체의 방향을 소개합니다.',
    '/staff.html':'모현소망교회 이동호 담임목사의 목회 인사와 목회 비전, 교회를 섬기는 분들을 소개합니다.',
    '/newcomers.html':'모현소망교회에 처음 오시는 분을 위한 예배시간, 새가족 등록, 문의와 오시는 길 안내입니다.',
    '/weekly-meditation.html':'모현소망교회의 이번 주 말씀묵상입니다. 주일 말씀을 본문과 핵심 적용으로 다시 묵상해 보세요.',
    '/worship.html':'모현소망교회 주일예배, 주일학교, 수요예배, 저녁기도회 등 예배 시간과 모임을 안내합니다.',
    '/transport.html':'모현소망교회 예배 참석을 위한 차량 운행과 신청 방법을 안내합니다.',
    '/visit.html':'경기도 용인시 처인구 모현읍 모현소망교회의 주소, 전화번호, 카카오맵, 카카오톡 채널과 오시는 길을 안내합니다.',
    '/sermons.html':'모현소망교회 주일예배에서 선포된 설교와 말씀 영상을 날짜순으로 다시 볼 수 있습니다.',
    '/sarangbang.html':'모현소망교회 사랑방 모임 예배와 말씀 나눔, 공동체 안내를 확인하세요.',
    '/men-mission.html':'모현소망교회 남전도회 소개와 섬김 사역을 안내합니다.',
    '/women-mission.html':'모현소망교회 여전도회 소개와 섬김 사역을 안내합니다.',
    '/choir.html':'모현소망교회 성가대와 찬양 사역을 안내합니다.',
    '/sunday-school.html':'모현소망교회 주일학교 예배, 말씀, 활동과 다음세대 소식을 안내합니다.',
    '/young-adults.html':'모현소망교회 청년부 예배와 공동체, 청년 사역을 소개합니다.',
    '/mission-support.html':'모현소망교회의 선교와 후원 사역을 안내합니다.',
    '/news.html':'모현소망교회의 예배, 행사, 공동체, 다음세대의 최신 교회소식을 확인하세요.',
    '/gallery.html':'모현소망교회의 예배, 행사, 공동체와 다음세대 현장을 사진으로 만나보세요.',
    '/ministries.html':'모현소망교회의 교육부서와 각 사역을 한눈에 안내합니다.',
    '/menu.html':'모현소망교회 홈페이지의 주요 메뉴를 한눈에 확인하세요.'
  };
  const pageTitle=titles[path]||document.title||'모현소망교회';
  const description=descriptions[path]||'모현소망교회 공식 홈페이지입니다. 예배와 말씀, 교회소식과 공동체 안내를 확인하세요.';
  if(titles[path])document.title=pageTitle;
  const setMeta=(attr,key,value)=>{let el=document.head.querySelector(`meta[${attr}="${key}"]`);if(!el){el=document.createElement('meta');el.setAttribute(attr,key);document.head.appendChild(el)}el.setAttribute('content',value)};
  const setLink=(rel,href)=>{let el=document.head.querySelector(`link[rel="${rel}"]`);if(!el){el=document.createElement('link');el.rel=rel;document.head.appendChild(el)}el.href=href};
  setMeta('name','description',description);setMeta('name','robots','index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');setMeta('name','googlebot','index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');setMeta('name','yeti','index,follow');setMeta('property','og:type','website');setMeta('property','og:site_name','모현소망교회');setMeta('property','og:title',pageTitle);setMeta('property','og:description',description);setMeta('property','og:url',canonical);setMeta('property','og:locale','ko_KR');setMeta('property','og:image',origin+'/siteicon.png');setMeta('name','twitter:card','summary');setMeta('name','twitter:title',pageTitle);setMeta('name','twitter:description',description);setMeta('name','twitter:image',origin+'/siteicon.png');setLink('canonical',canonical);setLink('icon',origin+'/favicon.ico');setLink('shortcut icon',origin+'/favicon.ico');setLink('apple-touch-icon',origin+'/apple-touch-icon.png');
  const navItems=[['교회소개','/about.html'],['섬기시는 분','/staff.html'],['새가족 안내','/newcomers.html'],['예배안내','/worship.html'],['이번 주 말씀묵상','/weekly-meditation.html'],['주일예배 설교','/sermons.html'],['교회소식','/news.html'],['사진첩','/gallery.html'],['오시는 길','/visit.html']];
  const graph=[{'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'모현소망교회',alternateName:'MOHYEON SOMANG CHURCH',inLanguage:'ko-KR'},{'@type':['Organization','Church'],'@id':origin+'/#church',name:'모현소망교회',alternateName:'MOHYEON SOMANG CHURCH',url:origin+'/',logo:origin+'/assets/site/logo.png',image:origin+'/siteicon.png',telephone:'031-332-3855',address:{'@type':'PostalAddress',streetAddress:'백옥대로2332번길 21-5',addressLocality:'용인시 처인구 모현읍',addressRegion:'경기도',addressCountry:'KR'},sameAs:['https://pf.kakao.com/_BYtgG','https://youtube.com/channel/UCiGQ15zMavL6wrRaKZzydiQ']},{'@type':'ItemList','@id':origin+'/#main-navigation',name:'모현소망교회 주요 메뉴',itemListElement:navItems.map((n,i)=>({'@type':'SiteNavigationElement',position:i+1,name:n[0],url:origin+n[1]}))}];
  if(path!=='/'){const label=(titles[path]||'모현소망교회').split(' | ')[0];graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'홈',item:origin+'/'},{'@type':'ListItem',position:2,name:label,item:canonical}]})}
  let ld=document.head.querySelector('script[data-seo-jsonld="1"]');if(!ld){ld=document.createElement('script');ld.type='application/ld+json';ld.dataset.seoJsonld='1';document.head.appendChild(ld)}ld.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph});
})();