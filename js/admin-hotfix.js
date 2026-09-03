/* CMS save-conflict hotfix: fetch the newest blob SHA with cache disabled before every save. */
putText=async function(path,text,msg,shaOverride){
  const api='https://api.github.com/repos/'+REPO;
  const headers={Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28'};
  let lastErr=null;
  for(let attempt=0;attempt<5;attempt++){
    try{
      const latestRes=await fetch(api+'/contents/'+path+'?ref='+encodeURIComponent(BRANCH)+'&_='+Date.now(),{headers,cache:'no-store'});
      let latest=null;
      if(latestRes.ok) latest=await latestRes.json();
      else if(latestRes.status!==404) throw new Error((await latestRes.text())||latestRes.statusText);
      const body={message:msg,content:utf8ToB64(text),branch:BRANCH};
      if(latest&&latest.sha) body.sha=latest.sha;
      const putRes=await fetch(api+'/contents/'+path,{method:'PUT',headers:{...headers,'Content-Type':'application/json'},cache:'no-store',body:JSON.stringify(body)});
      if(putRes.ok){
        const d=await putRes.json();
        cache[path]=d.content.sha;
        return d.content.sha;
      }
      const errText=(await putRes.text())||putRes.statusText;
      if(putRes.status!==409) throw new Error(errText);
      lastErr=new Error(errText);
      await new Promise(r=>setTimeout(r,300*(attempt+1)));
    }catch(e){
      lastErr=e;
      if(!String(e.message||e).includes('409')) throw e;
      await new Promise(r=>setTimeout(r,300*(attempt+1)));
    }
  }
  throw lastErr||new Error('저장 충돌이 계속 발생했습니다. 잠시 후 다시 시도해주세요.');
};

/* Transparent PNG QR codes were turning black during JPEG conversion.
   Paint a white canvas first, then draw the image, so transparency becomes white. */
canvasJpeg=async function(file){
  let bmp;
  try{bmp=await createImageBitmap(file)}catch(e){
    const img=new Image();
    img.src=URL.createObjectURL(file);
    await img.decode();
    bmp=img;
  }
  const max=2000,scale=Math.min(1,max/Math.max(bmp.width,bmp.height));
  const c=document.createElement('canvas');
  c.width=Math.max(1,Math.round(bmp.width*scale));
  c.height=Math.max(1,Math.round(bmp.height*scale));
  const ctx=c.getContext('2d');
  ctx.fillStyle='#fff';
  ctx.fillRect(0,0,c.width,c.height);
  ctx.drawImage(bmp,0,0,c.width,c.height);
  return new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(new Error('이미지 변환 실패')),'image/jpeg',.95));
};

/* Dedicated main-carousel editor extension. */
(()=>{
  const s=document.createElement('script');
  s.src='/js/admin-carousel.js?v=carousel-editor2';
  document.head.appendChild(s);
})();
