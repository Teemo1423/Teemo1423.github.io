/* CMS save-conflict hotfix: always refresh the latest GitHub blob SHA before saving. */
putText=async function(path,text,msg,shaOverride){
  async function attempt(){
    let latest=null;
    try{latest=await gh('/contents/'+path+'?ref='+BRANCH)}catch(e){
      if(!String(e.message||e).includes('404'))throw e;
    }
    const body={message:msg,content:utf8ToB64(text),branch:BRANCH};
    if(latest&&latest.sha)body.sha=latest.sha;
    const d=await gh('/contents/'+path,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    cache[path]=d.content.sha;
    return d.content.sha;
  }
  try{return await attempt()}catch(e){
    if(String(e.message||e).includes('409')){
      await new Promise(r=>setTimeout(r,350));
      return attempt();
    }
    throw e;
  }
};

/* Dedicated main-carousel editor extension. */
(()=>{
  const s=document.createElement('script');
  s.src='/js/admin-carousel.js?v=carousel-editor1';
  document.head.appendChild(s);
})();
