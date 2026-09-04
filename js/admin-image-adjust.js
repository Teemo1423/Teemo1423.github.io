(()=>{
  const adjustable=['churchFrontImage','churchSideImage','worshipImage','fellowshipImage','childrenImage','pastorImage'];
  const labels={churchFrontImage:'교회 정면',churchSideImage:'교회 측면',worshipImage:'예배 사진',fellowshipImage:'교제·성경공부',childrenImage:'다음세대',pastorImage:'담임목사'};
  function ensure(){site.imageAdjustments=site.imageAdjustments||{};adjustable.forEach(k=>{if(site.imageAdjustments[k]==null)site.imageAdjustments[k]=108})}
  function attach(){
    ensure();
    const cards=[...document.querySelectorAll('#slotGrid .slot-card')];
    adjustable.forEach(k=>{
      const idx=slots.findIndex(x=>x[0]===k);if(idx<0||!cards[idx])return;
      const card=cards[idx];if(card.querySelector('[data-brightness-control]'))return;
      const value=Number(site.imageAdjustments[k]||100);
      const wrap=document.createElement('div');wrap.dataset.brightnessControl='1';wrap.style.cssText='margin-top:14px;padding-top:12px;border-top:1px solid #e7e9e6';
      wrap.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:6px"><label style="margin:0;font-weight:800">사진 밝기</label><strong data-brightness-value>${value}%</strong></div><input type="range" min="70" max="140" step="1" value="${value}" style="width:100%" aria-label="${labels[k]} 밝기"><div style="display:flex;justify-content:space-between;font-size:11px;color:#7b857f"><span>어둡게</span><button type="button" class="ghost mini" data-reset-brightness>기본 100%</button><span>밝게</span></div>`;
      const range=wrap.querySelector('input[type=range]'),out=wrap.querySelector('[data-brightness-value]');
      range.oninput=()=>{site.imageAdjustments[k]=Number(range.value);out.textContent=range.value+'%';dirty()};
      wrap.querySelector('[data-reset-brightness]').onclick=()=>{range.value=100;site.imageAdjustments[k]=100;out.textContent='100%';dirty()};
      card.appendChild(wrap);
    })
  }
  function patch(){if(typeof renderSlots!=='function')return false;const original=renderSlots;renderSlots=function(){original();setTimeout(attach,0)};setTimeout(attach,0);return true}
  if(!patch()){let n=0;const t=setInterval(()=>{if(patch()||++n>40)clearInterval(t)},100)}
})();