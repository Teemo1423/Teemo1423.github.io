(()=>{
  let ministryGroups=[];
  const editors=[
    {page:'sarangbangEdit',slug:'sarangbang',label:'사랑방 모임',desc:'사랑방 모임 페이지의 소개·모임 정보·대표 이미지를 관리합니다.'},
    {page:'menMissionEdit',slug:'men-mission',label:'남전도회',desc:'남전도회 페이지의 소개·모임 정보·대표 이미지를 관리합니다.'},
    {page:'womenMissionEdit',slug:'women-mission',label:'여전도회',desc:'여전도회 페이지의 소개·모임 정보·대표 이미지를 관리합니다.'},
    {page:'choirEdit',slug:'choir',label:'성가대',desc:'성가대 페이지의 소개·모임 정보·대표 이미지를 관리합니다.'},
    {page:'youngAdultsEdit',slug:'young-adults',label:'청년부',desc:'청년부 페이지의 소개·모임 정보·대표 이미지를 관리합니다.'}
  ];
  const pageForSlug=slug=>slug==='sarangbang'?'/sarangbang.html':slug==='men-mission'?'/men-mission.html':slug==='women-mission'?'/women-mission.html':slug==='choir'?'/choir.html':slug==='young-adults'?'/young-adults.html':'/ministries.html';
  const norm=()=>{if(!Array.isArray(ministryGroups))ministryGroups=[]};
  const getItem=slug=>{norm();let x=ministryGroups.find(v=>v.slug===slug);if(!x){const def=editors.find(e=>e.slug===slug);x={slug,name:def?.label||'새 사역',label:'MINISTRY',subtitle:'',intro:'',target:'',schedule:'',place:'',leader:'',contact:'',scripture:'',activities:'',prayer:'',image:'',visible:true};ministryGroups.push(x)}return x};

  function installNav(){
    const n=document.getElementById('sideNav');if(!n)return;
    n.querySelector('[data-page="ministryGroups"]')?.remove();
    editors.forEach(e=>{
      if(n.querySelector(`[data-page="${e.page}"]`))return;
      const b=document.createElement('button');b.dataset.page=e.page;b.textContent=e.label;b.onclick=()=>openEditor(e.page);n.appendChild(b);
    });
  }
  function installPages(){
    const ed=document.getElementById('editor');if(!ed)return;
    ed.querySelector('[data-page="ministryGroups"]')?.remove();
    editors.forEach(e=>{
      if(ed.querySelector(`[data-page="${e.page}"]`))return;
      const s=document.createElement('section');s.className='page';s.dataset.page=e.page;s.innerHTML=`<div id="${e.page}Root"></div>`;ed.insertBefore(s,ed.querySelector('.savebar')||null);
    });
  }
  function editorMeta(page){return editors.find(e=>e.page===page)};
  function openEditor(page){
    const meta=editorMeta(page);if(!meta)return;
    currentPage=page;
    document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.dataset.page===page));
    document.querySelectorAll('#sideNav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
    document.getElementById('pageTitle').textContent=meta.label;
    document.getElementById('pageDesc').textContent=meta.desc;
    renderEditor(page);window.scrollTo({top:0,behavior:'smooth'});
  }
  function renderEditor(page){
    const meta=editorMeta(page),root=document.getElementById(page+'Root');if(!meta||!root)return;
    const x=getItem(meta.slug),i=ministryGroups.indexOf(x);
    root.innerHTML=`<section class="card"><div class="section-head"><div><h2>${esc(meta.label)} 편집</h2><p class="muted">홈페이지 전체메뉴의 “${esc(meta.label)}” 항목과 1:1로 연결됩니다.</p></div><div><a class="ghost" href="${pageForSlug(meta.slug)}?v=${Date.now()}" target="_blank">페이지 보기</a> <button onclick="saveMinistryGroups()">저장</button></div></div><div class="item-grid"><div><label>영문 라벨</label><input value="${esc(x.label||'')}" oninput="ministryGroups[${i}].label=this.value;dirty()"></div><div><label>페이지 제목</label><input value="${esc(x.name||'')}" oninput="ministryGroups[${i}].name=this.value;dirty()"></div><div class="full"><label>한 줄 소개</label><input value="${esc(x.subtitle||'')}" oninput="ministryGroups[${i}].subtitle=this.value;dirty()"></div><div class="full"><label>상세 소개</label><textarea class="tall" oninput="ministryGroups[${i}].intro=this.value;dirty()">${esc(x.intro||'')}</textarea></div><div><label>대상</label><input value="${esc(x.target||'')}" oninput="ministryGroups[${i}].target=this.value;dirty()"></div><div><label>모임 시간</label><input value="${esc(x.schedule||'')}" oninput="ministryGroups[${i}].schedule=this.value;dirty()"></div><div><label>장소</label><input value="${esc(x.place||'')}" oninput="ministryGroups[${i}].place=this.value;dirty()"></div><div><label>담당</label><input value="${esc(x.leader||'')}" oninput="ministryGroups[${i}].leader=this.value;dirty()"></div><div class="full"><label>문의/연락처</label><input value="${esc(x.contact||'')}" oninput="ministryGroups[${i}].contact=this.value;dirty()"></div><div class="full"><label>핵심 말씀</label><input value="${esc(x.scripture||'')}" oninput="ministryGroups[${i}].scripture=this.value;dirty()"></div><div class="full"><label>주요 활동</label><textarea oninput="ministryGroups[${i}].activities=this.value;dirty()">${esc(x.activities||'')}</textarea><p class="hint">한 줄에 하나씩 작성하면 홈페이지에서도 줄바꿈됩니다.</p></div><div class="full"><label>기도제목 / 사역 목표</label><textarea oninput="ministryGroups[${i}].prayer=this.value;dirty()">${esc(x.prayer||'')}</textarea></div><div class="full"><label>대표 이미지</label><div class="image-input-row"><input value="${esc(x.image||'')}" oninput="ministryGroups[${i}].image=this.value;dirty()"><button class="ghost" onclick="openMediaPicker('ministry:${meta.slug}')">기존 이미지</button><button onclick="uploadMinistryImage('${meta.slug}')">새 이미지</button><button class="ghost" onclick="clearMinistryImage('${meta.slug}')">비우기</button></div></div></div></section>`;
  }
  window.ministryGroups=ministryGroups;
  window.uploadMinistryImage=slug=>{const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.onchange=async()=>{const f=inp.files?.[0];if(!f)return;try{status('대표 이미지 업로드 중...');const x=getItem(slug);x.image=await uploadBlob(await canvasJpeg(f),f.name);await loadImages();renderEditor(editorMetaBySlug(slug)?.page);dirty();status('대표 이미지 적용 완료. 저장해주세요.')}catch(e){status('업로드 실패: '+e.message,false)}};inp.click()};
  const editorMetaBySlug=slug=>editors.find(e=>e.slug===slug);
  window.clearMinistryImage=slug=>{getItem(slug).image='';const m=editorMetaBySlug(slug);if(m)renderEditor(m.page);dirty()};
  window.saveMinistryGroups=async()=>{try{status('사역·부서 저장 중...');await putJson('content/ministry-groups.json',ministryGroups,'CMS: update ministry groups');clean();status('저장 완료.')}catch(e){status('저장 실패: '+e.message,false)}};

  const originalSelect=window.selectMedia;window.selectMedia=function(path){if(String(pickerTarget||'').startsWith('ministry:')){const slug=String(pickerTarget).slice(9);getItem(slug).image=path;dirty();closeMediaPicker();const m=editorMetaBySlug(slug);if(m)renderEditor(m.page);return}return originalSelect(path)};
  const oldLoadAll=window.loadAll;window.loadAll=async function(){await oldLoadAll();try{ministryGroups=await getJson('content/ministry-groups.json');window.ministryGroups=ministryGroups;norm();editors.forEach(e=>renderEditor(e.page))}catch(e){status('사역·부서 데이터 로딩 실패: '+e.message,false)}};
  const oldSaveCurrent=window.saveCurrent;window.saveCurrent=async function(){if(editors.some(e=>e.page===currentPage))return saveMinistryGroups();return oldSaveCurrent()};
  function install(){installNav();installPages();const sel=document.getElementById('rawFileSelect');if(sel&&!Array.from(sel.options).some(o=>o.value==='content/ministry-groups.json')){const o=document.createElement('option');o.value='content/ministry-groups.json';o.textContent='사역·부서 데이터 - ministry-groups.json';sel.appendChild(o)}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();