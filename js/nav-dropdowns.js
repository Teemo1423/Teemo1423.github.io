(()=>{
  function enhance(nav){
    if(!nav||nav.dataset.dropdownReady==='1')return;
    nav.dataset.dropdownReady='1';
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
  }
  const run=()=>document.querySelectorAll('.navlinks').forEach(enhance);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();