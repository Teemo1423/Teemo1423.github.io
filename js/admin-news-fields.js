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

  window.renderNews=function(){
    normalizeAll();
    const e=document.querySelector('#newsList');
    if(!e)return;
    e.innerHTML=news.map((x,i)=>`<article class="cms-item"><div class="cms-item-head"><b>${esc(x.title||'제목 없음')}</b><div class="cms-item-actions"><button class="move" onclick="move(news,${i},-1,renderNews)">↑</button><button class="move" onclick="move(news,${i},1,renderNews)">↓</button><button class="danger" onclick="news.splice(${i},1);renderNews();dirty()">삭제</button></div></div><div class="item-grid"><div><label>날짜</label><input value="${esc(x.date||'')}" oninput="news[${i}].date=this.value;dirty()"></div><div><label>제목</label><input value="${esc(x.title||'')}" oninput="news[${i}].title=this.value;dirty()"></div><div class="full"><label>홈 화면 한 줄 요약(부제목)</label><input value="${esc(x.subtitle||'')}" oninput="news[${i}].subtitle=this.value;news[${i}].text=this.value;dirty()"></div><div class="full"><label>소식 전체 내용</label><textarea class="tall" oninput="news[${i}].body=this.value;dirty()">${esc(x.body||'')}</textarea></div>${mediaField(x.image,'news',i)}</div></article>`).join('');
  };

  window.addNews=function(){
    news.unshift({date:new Date().toISOString().slice(0,10),title:'새 교회소식',subtitle:'',text:'',body:'',image:''});
    renderNews();dirty();
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