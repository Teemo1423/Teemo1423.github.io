(()=>{
  const cfg=[
    {key:'welcome',label:'1번 · 교회 메인',desc:'Welcome 배너 배경',type:'site',field:'heroImage',mobileField:'heroImageMobile'},
    {key:'sermon',label:'2번 · 최신 설교',desc:'최신 설교 캐러셀 배경',type:'sermons',mobileField:'carouselSermonImageMobile'},
    {key:'news',label:'3번 · 교회소식',desc:'최신 교회소식 캐러셀 배경',type:'news',mobileField:'carouselNewsImageMobile'}
  ];
  function latestIndex(arr){
    if(!Array.isArray(arr)||!arr.length)return -1;
    let best=0;
    for(let i=1;i<arr.length;i++) if(String(arr[i]?.date||'').localeCompare(String(arr[best]?.date||''))>0) best=i;
    return best;
  }
  const imageKey=(c,mobile=false)=>mobile?c.mobileField:(c.type==='site'?c.field:(c.type==='sermons'?'carouselSermonImage':'carouselNewsImage'));
  function refFor(c,mobile=false){
    const key=imageKey(c,mobile);
    return {value:site?.[key]||'',target:`site:${key}`};
  }
  function setValue(c,v,mobile=false){
    site[imageKey(c,mobile)]=v;
    dirty();renderCarouselEditor();
  }
  window.renderCarouselEditor=function(){
    const box=document.getElementById('carouselEditorGrid');if(!box)return;
    const field=(c,i,mobile)=>{const r=refFor(c,mobile),v=r.value,ratio=mobile?'1:1 (1080 × 1080px)':'16:9 (1920 × 1080px)';
      const display=v||(!mobile?'':refFor(c,false).value);
      const preview=display?`background-image:url("${esc(display)}")`:'';
      return `<div class="carousel-device"><div class="slot-head"><b>${mobile?'📱 모바일 이미지':'🖥️ PC 이미지 · 가로형'}</b><span>${ratio}</span></div><div class="slot-preview" style="${preview};aspect-ratio:${mobile?'1/1':'16/9'};height:auto;background-size:cover;background-position:center"></div><label>${mobile?'모바일 이미지 경로 (비우면 PC 이미지 사용)':'PC 이미지 경로'}</label><input value="${esc(v)}" placeholder="${mobile?'미등록 시 PC 이미지 사용':'이미지 경로'}" oninput="carouselSet(${i},this.value,${mobile})"><div class="slot-actions"><button class="ghost" onclick="carouselPick(${i},${mobile})">기존 이미지</button><button onclick="carouselUpload(${i},${mobile})">새 이미지</button><button class="ghost" onclick="carouselClear(${i},${mobile})">비우기</button></div></div>`;
    };
    box.innerHTML=cfg.map((c,i)=>`<article class="slot-card" style="width:100%;max-width:none"><h3>${c.label}</h3><p class="hint">${c.desc}</p><div class="carousel-device-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:18px">${field(c,i,false)}${field(c,i,true)}</div></article>`).join('');
  };
  window.carouselSet=(i,v,mobile=false)=>setValue(cfg[i],v,mobile);
  // Carousel backgrounds are stored in different JSON files; save the active source.
  const oldSaveCurrent=window.saveCurrent;
  if(typeof oldSaveCurrent==='function')window.saveCurrent=async function(...args){
    if(currentPage!=='carousel')return oldSaveCurrent.apply(this,args);
    try{status('캐러셀 저장 중...');await saveSite();clean();status('캐러셀 저장 완료.')}catch(e){status('저장 실패: '+e.message,false)}
  };
  window.carouselPick=(i,mobile=false)=>{const r=refFor(cfg[i],mobile);if(r.target)openMediaPicker(r.target)};
  window.carouselClear=(i,mobile=false)=>setValue(cfg[i],'',mobile);
  window.carouselUpload=(i,mobile=false)=>{
    const c=cfg[i],r=refFor(c,mobile);if(!r.target)return;
    const inp=document.createElement('input');inp.type='file';inp.accept='image/*';
    inp.onchange=async()=>{const f=inp.files?.[0];if(!f)return;try{status('캐러셀 이미지 업로드 중...');const p=await uploadBlob(await canvasJpeg(f),f.name);setValue(c,p,mobile);await loadImages();status('캐러셀 이미지 적용 완료. 저장을 눌러주세요.')}catch(e){status('업로드 실패: '+e.message,false)}};
    inp.click();
  };
  function openCarousel(){
    currentPage='carousel';document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.dataset.page==='carousel'));document.querySelectorAll('#sideNav button').forEach(x=>x.classList.toggle('active',x.dataset.page==='carousel'));
    document.getElementById('pageTitle').textContent='메인 캐러셀';document.getElementById('pageDesc').textContent='메인 배너 1·2·3번의 PC 16:9 (1920×1080px) · 모바일 1:1 (1080×1080px) 이미지를 각각 관리합니다.';renderCarouselEditor();window.scrollTo({top:0,behavior:'smooth'});
  }
  window.openCarouselEditor=openCarousel;
  function install(){
    const nav=document.getElementById('sideNav'),editor=document.getElementById('editor');if(!nav||!editor)return;
    let b=nav.querySelector('[data-page="carousel"]');
    if(!b){
      b=document.createElement('button');b.dataset.page='carousel';b.textContent='메인 캐러셀';
      const imageBtn=nav.querySelector('[data-page="images"]');if(imageBtn?.nextSibling)nav.insertBefore(b,imageBtn.nextSibling);else nav.appendChild(b);
    }
    b.onclick=e=>{e.preventDefault();e.stopPropagation();openCarousel()};
    if(!editor.querySelector('[data-page="carousel"]')){
      const s=document.createElement('section');s.className='page';s.dataset.page='carousel';s.innerHTML='<section class="card"><div class="section-head"><div><h2>메인 캐러셀 배경</h2><p class="muted">각 슬라이드의 PC(16:9)·모바일(1:1) 이미지를 독립적으로 등록합니다. 모바일 이미지를 비우면 PC 이미지가 표시됩니다. 2·3번 PC 이미지를 비우면 최신 게시물 이미지를 사용합니다.</p></div></div><div id="carouselEditorGrid" class="slot-grid"></div></section>';
      const savebar=editor.querySelector('.savebar');editor.insertBefore(s,savebar||null);
    }
    const oldSelect=window.selectMedia;
    if(typeof oldSelect==='function'&&!window.__carouselSelectWrapped){
      window.__carouselSelectWrapped=true;
      window.selectMedia=function(path){oldSelect(path);setTimeout(renderCarouselEditor,0)};
    }
    const oldLoadAll=window.loadAll;
    if(typeof oldLoadAll==='function'&&!window.__carouselLoadWrapped){
      window.__carouselLoadWrapped=true;
      window.loadAll=async function(...args){const result=await oldLoadAll.apply(this,args);renderCarouselEditor();return result};
    }
    // The editor extension may load while login/loadAll is still in progress.
    // Refresh when the underlying sermon/news data arrives, including on iOS Safari.
    let lastSignature='';
    const refreshIfChanged=()=>{
      if(!document.getElementById('carouselEditorGrid'))return;
      const signature=[Array.isArray(sermons)?sermons.length:-1,Array.isArray(news)?news.length:-1,
        Array.isArray(sermons)?latestIndex(sermons):-1,Array.isArray(news)?latestIndex(news):-1].join(':');
      if(signature!==lastSignature){lastSignature=signature;renderCarouselEditor()}
    };
    refreshIfChanged();
    window.addEventListener('focus',refreshIfChanged);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshIfChanged()});
    setInterval(refreshIfChanged,700);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();