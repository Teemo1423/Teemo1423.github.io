(()=>{
  const baseRender=window.renderNews;
  const baseAdd=window.addNews;

  window.renderNews=function(){
    baseRender();
    // Subtitle is rendered by admin-news-fields.js. Do not inject a second field:
    // filtered/reordered lists make DOM position differ from the news array index.
  };

  window.addNews=function(){
    if(typeof news!=='undefined'&&Array.isArray(news)){
      news.unshift({date:new Date().toISOString().slice(0,10),title:'새 교회소식',subtitle:'',text:'내용을 입력하세요.',image:''});
      renderNews();dirty();
    }else if(typeof baseAdd==='function')baseAdd();
  };
})();
