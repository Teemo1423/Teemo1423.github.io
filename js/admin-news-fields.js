(()=>{
  const normalizeNewsItem=x=>{
    if(!x||typeof x!=='object')return x;
    const subtitle=String(x.subtitle??'').trim()||String(x.text??'').trim();
    const body=String(x.body??'').trim()||String(x.text??'').trim();
    x.subtitle=subtitle;
    x.text=subtitle;
    x.body=body;
    return x;
  };

  const normalizeAll=()=>{if(Array.isArray(news))news.forEach(normalizeNewsItem)};

  window.openNewsCategory=function(filter){
    newsFilter=filter||'all';currentPage='news';
    document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.dataset.page==='news'));
    document.querySelectorAll('#sideNav button').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('#sideNav button[data-page="news"]').forEach(b=>b.classList.toggle('active',(b.dataset.newsFilter||'all')===newsFilter));
    const title=document.getElementById('pageTitle'),desc=document.getElementById('pageDesc');
    if(title)title.textContent=newsFilter==='story'?'모현소망 이야기':newsFilter==='notice'?'주보 · 공지':'전체 교회소식';
    if(desc)desc.textContent=newsFilter==='story'?'모현소망 이야기 게시물을 관리합니다.':newsFilter==='notice'?'주보와 일반 공지를 관리합니다.':'교회소식 전체를 관리합니다.';
    renderNews();window.scrollTo({top:0,behavior:'smooth'});
  };

  window.renderNews=function(){
    normalizeAll();const e=document.querySelector('#newsList');if(!e)return;
    const f=typeof newsFilter==='string'?newsFilter:'all';
    const rows=news.map((x,i)=>({x,i})).filter(({x})=>f==='all'||(f==='story'?String(x.category||x.type||'').toLowerCase()==='story':String(x.category||x.type||'').toLowerCase()!=='story')).sort((a,b)=>String(b.x.date||'').replace(/[^0-9]/g,'').padEnd(8,'0').localeCompare(String(a.x.date||'').replace(/[^0-9]/g,'').padEnd(8,'0')) || a.i-b.i);
    const et=document.getElementById('newsEditorTitle'),ed=document.getElementById('newsEditorDesc');
    if(et)et.textContent=f==='story'?'모현소망 이야기':f==='notice'?'주보 · 공지':'전체 교회소식';
    if(ed)ed.textContent=f==='story'?'교회 밖에서도 이어지는 모현소망교회의 이야기를 관리합니다.':f==='notice'?'주보와 일반 공지·행사를 관리합니다.':'공지와 모현소망 이야기를 한눈에 관리합니다.';
    e.innerHTML=rows.map(({x,i})=>`<article class="cms-item"><div class="cms-item-head"><b>${esc(x.title||'제목 없음')}</b><div class="cms-item-actions"><button class="move" onclick="move(news,${i},-1,renderNews)">↑</button><button class="move" onclick="move(news,${i},1,renderNews)">↓</button><button class="danger" onclick="news.splice(${i},1);renderNews();dirty()">삭제</button></div></div><div class="item-grid"><div><label>날짜</label><input value="${esc(x.date||'')}" oninput="news[${i}].date=this.value;dirty()"></div><div><label>제목</label><input value="${esc(x.title||'')}" oninput="news[${i}].title=this.value;dirty()"></div><div class="full"><label>홈 화면 한 줄 요약(부제목)</label><input value="${esc(x.subtitle||'')}" oninput="news[${i}].subtitle=this.value;news[${i}].text=this.value;dirty()"></div><div class="full"><label>소식 전체 내용</label><textarea class="tall" oninput="news[${i}].body=this.value;dirty()">${esc(x.body||'')}</textarea></div>${(String(x.postType||'')==='youtube'||(String(x.externalUrl||'').includes('youtu')&&String(x.category||'').toLowerCase()==='story'))?'<div class="full"><label>대표 이미지</label><p class="hint">YouTube 영상 썸네일을 자동으로 사용합니다.</p></div>':mediaField(x.image,'news',i)}${f==='story'?`<div class="full"><label>원문·영상 링크</label><input type="url" placeholder="https://..." value="${esc(x.externalUrl||'')}" oninput="news[${i}].externalUrl=this.value;dirty()"></div><div class="full"><label>이미지 출처 표기</label><input value="${esc(x.imageCredit||'')}" oninput="news[${i}].imageCredit=this.value;dirty()"></div><div class="full"><label>이미지 출처 링크</label><input type="url" value="${esc(x.imageCreditUrl||'')}" oninput="news[${i}].imageCreditUrl=this.value;dirty()"></div><div class="full"><label>영상 출처 표기</label><input value="${esc(x.mediaCredit||'')}" oninput="news[${i}].mediaCredit=this.value;dirty()"></div><div class="full"><label>영상 출처 링크</label><input type="url" value="${esc(x.mediaCreditUrl||'')}" oninput="news[${i}].mediaCreditUrl=this.value;dirty()"></div>`:''}</div></article>`).join('')||'<p class="muted">등록된 소식이 없습니다.</p>';
  };

  window.addNews=function(){
    const f=typeof newsFilter==='string'?newsFilter:'all';
    if(f==='story'){
      const old=document.getElementById('storyTypePicker');if(old){old.remove();return}
      const box=document.createElement('div');box.id='storyTypePicker';box.innerHTML='<div style="position:fixed;inset:0;background:rgba(10,28,21,.42);z-index:9998"></div><div style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(420px,calc(100vw - 36px));background:#fff;border-radius:24px;padding:22px;z-index:9999;box-shadow:0 24px 70px rgba(0,0,0,.2)"><h3 style="margin:0 0 8px;font-size:22px">게시물 유형 선택</h3><p style="margin:0 0 18px;color:#718078">어떤 이야기를 등록할까요?</p><div style="display:grid;gap:10px"><button type="button" onclick="createStoryPost(\'youtube\')" style="min-height:58px;font-size:16px;font-weight:800">🎬 YouTube 영상 게시물</button><button type="button" onclick="createStoryPost(\'article\')" style="min-height:58px;font-size:16px;font-weight:800">🖼️ 일반 · 기사 게시물</button><button type="button" class="ghost" onclick="document.getElementById(\'storyTypePicker\').remove()">취소</button></div></div>';document.body.appendChild(box);return;
    }
    news.unshift({date:new Date().toLocaleDateString('sv-SE'),title:'새 교회소식',subtitle:'',text:'',body:'',image:'',category:'notice'});renderNews();dirty();
  };
  window.createStoryPost=function(type){
    document.getElementById('storyTypePicker')?.remove();
    const youtube=type==='youtube';news.unshift({date:new Date().toLocaleDateString('sv-SE'),title:youtube?'새 YouTube 이야기':'새 모현소망 이야기',subtitle:'',text:'',body:'',image:'',externalUrl:'',category:'story',postType:youtube?'youtube':'article'});renderNews();dirty();window.scrollTo({top:0,behavior:'smooth'});
  };

  const baseSaveNews=window.saveNews;
  window.saveNews=async function(){
    normalizeAll();
    return baseSaveNews();
  };

  const baseLoadAll=window.loadAll;
  window.loadAll=async function(){
    await baseLoadAll();
    normalizeAll();
    renderNews();
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{normalizeAll();renderNews()},{once:true});else{normalizeAll();renderNews()}
})();