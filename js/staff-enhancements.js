(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const style=document.createElement('style');style.id='staffEnhancementStyles';style.textContent=`
    .pastor-vision-box{margin-top:28px;padding:24px;border-radius:22px;background:#f1f6f3}.pastor-vision-box h3{margin:0 0 12px;font-size:22px}.pastor-vision-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:18px}.pastor-vision-item{padding:18px;border-radius:16px;background:#fff;border:1px solid var(--line)}.pastor-vision-item b{display:block;color:var(--green);margin-bottom:5px}.pastor-career{margin-top:24px;padding-top:22px;border-top:1px solid var(--line);color:var(--muted);line-height:1.9}.pastor-career h3{margin:0 0 10px;color:var(--ink);font-size:22px}.pastor-career p{margin:0}.pastor-quote2{font-size:23px;line-height:1.55;font-weight:850;letter-spacing:-.03em;color:var(--ink);margin:24px 0}.pastor-more{display:inline-flex;margin-top:18px;padding:11px 17px;border-radius:999px;background:var(--green);color:#fff;font-weight:850}@media(max-width:760px){.pastor-vision-grid{grid-template-columns:1fr}.pastor-quote2{font-size:20px}.pastor-vision-box{padding:20px}}
  `;document.head.appendChild(style);
  async function run(){
    const content=document.querySelector('.pastor-content');if(!content||document.getElementById('pastorEnhancement'))return;
    let d={};try{const r=await fetch('/content/staff.json?v='+Date.now(),{cache:'no-store'});if(r.ok)d=await r.json()}catch(e){}
    if(d.pastorName){const name=document.querySelector('[data-site-text="pastor"]');if(name)name.textContent=d.pastorName}
    if(d.role){const role=document.querySelector('.pastor-role');if(role)role.textContent=d.role}
    if(d.image){const photo=document.querySelector('.pastor-photo');if(photo)photo.style.backgroundImage=`url('${String(d.image).replace(/'/g,"%27")}')`}
    const oldMsg=content.querySelector(':scope > .pastor-message');if(oldMsg&&d.intro)oldMsg.textContent=d.intro;
    const vision=Array.isArray(d.vision)?d.vision:[];
    const wrap=document.createElement('div');wrap.id='pastorEnhancement';wrap.innerHTML=`${d.quote?`<p class="pastor-quote2">${esc(d.quote)}</p>`:''}${d.intro?`<p class="pastor-message">${esc(d.intro)}</p>`:''}${vision.length?`<div class="pastor-vision-box"><h3>목회 비전</h3><div class="pastor-vision-grid">${vision.map(x=>`<div class="pastor-vision-item"><b>${esc(x.title)}</b><span>${esc(x.text)}</span></div>`).join('')}</div></div>`:''}${d.bio?`<div class="pastor-career"><h3>담임목사 약력</h3><p>${esc(d.bio)}</p></div>`:''}${d.direction?`<div class="pastor-career"><b>목회 방향</b><br>${esc(d.direction)}</div>`:''}<a class="pastor-more" href="/about.html">교회 비전 함께 보기 →</a>`;
    content.appendChild(wrap);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();