(()=>{
  const cfg=[
    {key:'welcome',label:'1번 · 교회 메인',desc:'Welcome 배너 배경',type:'site',field:'heroImage'},
    {key:'sermon',label:'2번 · 최신 설교',desc:'최신 설교 캐러셀 배경',type:'sermons'},
    {key:'news',label:'3번 · 교회소식',desc:'최신 교회소식 캐러셀 배경',type:'news'}
  ];
  function latestIndex(arr){
    if(!Array.isArray(arr)||!arr.length)return -1;
    let best=0;
    for(let i=1;i<arr.length;i++) if(String(arr[i]?.date||'').localeCompare(String(arr[best]?.date||''))>0) best=i;
    return best;
  }
  function refFor(c){
    if(c.type==='site') return {value:site?.[c.field]||'',target:`site:${c.field}`};
    const arr=c.type==='news'?news:sermons,idx=latestIndex(arr);
    return {value:idx>=0?(arr[idx]?.image||''):'',target:idx>=0?`${c.type}:${idx}`:''};
  }
  function setValue(c,v){
    if(c.type==='site') site[c.field]=v;
    else {const arr=c.type==='news'?news:sermons,idx=latestIndex(arr);if(idx>=0)arr[idx].image=v}
    dirty();renderCarouselEditor();
  }
  window.renderCarouselEditor=function(){
    const box=document.getElementById('carouselEditorGrid');if(!box)return;
    box.innerHTML=cfg.map((c,i)=>{const r=refFor(c),v=r.value;return `<article class="slot-card"><div class="slot-head"><b>${c.label}</b><span>16:9 권장</span></div><p class="hint">${c.desc}</p><div class="slot-preview" style="${v?`background-image:url('${v}?v=${Date.now()}')`:''}"></div><input value="${v||''}" placeholder="이미지 경로" oninput="carouselSet(${i},this.value)"><div class="slot-actions"><button class="ghost" ${r.target?'':'disabled'} onclick="carouselPick(${i})">기존 이미지</button><button ${r.target?'':'disabled'} onclick="carouselUpload(${i})">새 이미지</button><button class="ghost" ${r.target?'':'disabled'} onclick="carouselClear(${i})">비우기</button></div>${!r.target?'<p class="hint">먼저 설교/교회소식을 1개 이상 등록하세요.</p>':''}</article>`}).join('');
  };
  window.carouselSet=(i,v)=>setValue(cfg[i],v);
  window.carouselPick=i=>{const r=refFor(cfg[i]);if(r.target)openMediaPicker(r.target)};
  window.carouselClear=i=>setValue(cfg[i],'');
  window.carouselUpload=i=>{
    const c=cfg[i],r=refFor(c);if(!r.target)return;
    const inp=document.createElement('input');inp.type='file';inp.accept='image/*';
    inp.onchange=async()=>{const f=inp.files?.[0];if(!f)return;try{status('캐러셀 이미지 업로드 중...');const p=await uploadBlob(await canvasJpeg(f),f.name);setValue(c,p);await loadImages();status('캐러셀 이미지 적용 완료. 저장을 눌러주세요.')}catch(e){status('업로드 실패: '+e.message,false)}};
    inp.click();
  };
  function install(){
    const nav=document.getElementById('sideNav'),editor=document.getElementById('editor');if(!nav||!editor)return;
    if(!nav.querySelector('[data-page="carousel"]')){
      const b=document.createElement('button');b.dataset.page='carousel';b.textContent='메인 캐러셀';
      const imageBtn=nav.querySelector('[data-page="images"]');if(imageBtn?.nextSibling)nav.insertBefore(b,imageBtn.nextSibling);else nav.appendChild(b);
      b.addEventListener('click',()=>{
        currentPage='carousel';document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.dataset.page==='carousel'));document.querySelectorAll('#sideNav button').forEach(x=>x.classList.toggle('active',x===b));
        document.getElementById('pageTitle').textContent='메인 캐러셀';document.getElementById('pageDesc').textContent='메인 배너 1·2·3번의 배경 이미지를 각각 관리합니다.';renderCarouselEditor();window.scrollTo({top:0,behavior:'smooth'});
      });
    }
    if(!editor.querySelector('[data-page="carousel"]')){
      const s=document.createElement('section');s.className='page';s.dataset.page='carousel';s.innerHTML='<section class="card"><div class="section-head"><div><h2>메인 캐러셀 배경</h2><p class="muted">각 슬라이드의 배경을 독립적으로 교체합니다. 2번은 최신 설교, 3번은 최신 교회소식의 대표 이미지와 연결됩니다.</p></div></div><div id="carouselEditorGrid" class="slot-grid"></div></section>';
      const savebar=editor.querySelector('.savebar');editor.insertBefore(s,savebar||null);
    }
    const oldSelect=window.selectMedia;
    if(typeof oldSelect==='function'&&!window.__carouselSelectWrapped){
      window.__carouselSelectWrapped=true;
      window.selectMedia=function(path){oldSelect(path);setTimeout(renderCarouselEditor,0)};
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();