(()=>{
  const baseRender=window.renderNews;
  const baseAdd=window.addNews;

  window.renderNews=function(){
    if(typeof baseRender==='function')baseRender();
    const list=document.getElementById('newsList');
    if(!list||typeof news==='undefined'||!Array.isArray(news))return;
    [...list.querySelectorAll('.cms-item')].forEach((card,i)=>{
      const grid=card.querySelector('.item-grid');
      if(!grid||grid.querySelector('[data-news-subtitle]'))return;
      const content=grid.querySelector('.full');
      const wrap=document.createElement('div');
      wrap.className='full';
      wrap.setAttribute('data-news-subtitle','1');
      wrap.innerHTML=`<label>부제목 · 메인 캐러셀용</label><input value="${esc(news[i]?.subtitle||'')}" placeholder="예배와 모임, 기도제목 등 이번 주 주요 소식을 안내드립니다."><p class="hint">메인 캐러셀에는 제목과 이 부제목만 표시됩니다.</p>`;
      const input=wrap.querySelector('input');
      input.addEventListener('input',()=>{news[i].subtitle=input.value;dirty()});
      if(content)grid.insertBefore(wrap,content);else grid.appendChild(wrap);
    });
  };

  window.addNews=function(){
    if(typeof news!=='undefined'&&Array.isArray(news)){
      news.unshift({date:new Date().toISOString().slice(0,10),title:'새 교회소식',subtitle:'',text:'내용을 입력하세요.',image:''});
      renderNews();dirty();
    }else if(typeof baseAdd==='function')baseAdd();
  };
})();
