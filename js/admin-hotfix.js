/* Robust CMS save layer.
   Uses Git blobs/trees/commits instead of the Contents API SHA precondition,
   avoiding repeated 409 "does not match" errors when the branch changes. */
putText=async function(path,text,msg,shaOverride){
  const api='https://api.github.com/repos/'+REPO;
  const headers={Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'};
  let lastErr=null;
  for(let attempt=0;attempt<6;attempt++){
    try{
      const refRes=await fetch(api+'/git/ref/heads/'+encodeURIComponent(BRANCH)+'?_='+Date.now(),{headers,cache:'no-store'});
      if(!refRes.ok)throw new Error((await refRes.text())||refRes.statusText);
      const ref=await refRes.json();
      const head=ref.object.sha;

      const commitRes=await fetch(api+'/git/commits/'+head+'?_='+Date.now(),{headers,cache:'no-store'});
      if(!commitRes.ok)throw new Error((await commitRes.text())||commitRes.statusText);
      const commit=await commitRes.json();

      const blobRes=await fetch(api+'/git/blobs',{method:'POST',headers,cache:'no-store',body:JSON.stringify({content:text,encoding:'utf-8'})});
      if(!blobRes.ok)throw new Error((await blobRes.text())||blobRes.statusText);
      const blob=await blobRes.json();

      const treeRes=await fetch(api+'/git/trees',{method:'POST',headers,cache:'no-store',body:JSON.stringify({base_tree:commit.tree.sha,tree:[{path,mode:'100644',type:'blob',sha:blob.sha}]})});
      if(!treeRes.ok)throw new Error((await treeRes.text())||treeRes.statusText);
      const tree=await treeRes.json();

      const newCommitRes=await fetch(api+'/git/commits',{method:'POST',headers,cache:'no-store',body:JSON.stringify({message:msg,tree:tree.sha,parents:[head]})});
      if(!newCommitRes.ok)throw new Error((await newCommitRes.text())||newCommitRes.statusText);
      const newCommit=await newCommitRes.json();

      const updateRes=await fetch(api+'/git/refs/heads/'+encodeURIComponent(BRANCH),{method:'PATCH',headers,cache:'no-store',body:JSON.stringify({sha:newCommit.sha,force:false})});
      if(updateRes.ok){cache[path]=blob.sha;return blob.sha}
      const errText=(await updateRes.text())||updateRes.statusText;
      if(updateRes.status!==409&&updateRes.status!==422)throw new Error(errText);
      lastErr=new Error(errText);
      await new Promise(r=>setTimeout(r,350*(attempt+1)));
    }catch(e){
      lastErr=e;
      const m=String(e.message||e);
      if(!(m.includes('409')||m.includes('422')||m.includes('Reference update failed')) )throw e;
      await new Promise(r=>setTimeout(r,350*(attempt+1)));
    }
  }
  throw lastErr||new Error('저장 충돌이 계속 발생했습니다. 잠시 후 다시 시도해주세요.');
};

/* Prevent accidental double-clicked saves from running at the same time. */
(()=>{
  let saving=false;
  const oldCurrent=window.saveCurrent,oldAll=window.saveAll;
  if(typeof oldCurrent==='function')window.saveCurrent=async function(){if(saving)return status('이미 저장 중입니다. 잠시만 기다려주세요.');saving=true;try{return await oldCurrent()}finally{saving=false}};
  if(typeof oldAll==='function')window.saveAll=async function(){if(saving)return status('이미 저장 중입니다. 잠시만 기다려주세요.');saving=true;try{return await oldAll()}finally{saving=false}};
})();

/* Transparent PNG QR codes: paint white before JPEG conversion. */
canvasJpeg=async function(file){
  let bmp;
  try{bmp=await createImageBitmap(file)}catch(e){const img=new Image();img.src=URL.createObjectURL(file);await img.decode();bmp=img}
  const max=2000,scale=Math.min(1,max/Math.max(bmp.width,bmp.height));
  const c=document.createElement('canvas');c.width=Math.max(1,Math.round(bmp.width*scale));c.height=Math.max(1,Math.round(bmp.height*scale));
  const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(bmp,0,0,c.width,c.height);
  return new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(new Error('이미지 변환 실패')),'image/jpeg',.95));
};

/* Dedicated main-carousel editor extension. */
(()=>{const s=document.createElement('script');s.src='/js/admin-carousel.js?v=carousel-editor3';document.head.appendChild(s)})();
