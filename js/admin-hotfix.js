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
