(()=>{
  const adjustable=['heroImage','churchFrontImage','churchSideImage','worshipImage','fellowshipImage','childrenImage','pastorImage'];
  const labels={heroImage:'메인 배너',churchFrontImage:'교회 정면',churchSideImage:'교회 측면',worshipImage:'예배 사진',fellowshipImage:'교제·성경공부',childrenImage:'다음세대',pastorImage:'담임목사'};
  const guides={
    heroImage:{ratio:'16:9',size:'1920×1080px 이상',use:'메인 첫 화면 · 배너',tip:'가로로 넓고 인물이 중앙에 몰리지 않은 사진 추천'},
    churchFrontImage:{ratio:'4:3',size:'1600×1200px 이상',use:'메인 · 교회소개',tip:'건물 전체가 잘리고 않도록 여백 있는 사진 추천'},
    churchSideImage:{ratio:'4:3',size:'1600×1200px 이상',use:'교회소개 · 외관 보조',tip:'정면 사진과 비슷한 밝기·색감 권장'},
    worshipImage:{ratio:'4:3',size:'1600×1200px 이상',use:'예배 안내 · 메인',tip:'예배 장면은 좌우에 약간의 여백이 있으면 좋음'},
    fellowshipImage:{ratio:'4:3',size:'1600×1200px 이상',use:'사랑방 · 공동체',tip:'여러 사람이 자연스럽게 보이는 가로 사진 추천'},
    childrenImage:{ratio:'4:3',size:'1600×1200px 이상',use:'주일학교 · 다음세대',tip:'아이들 얼굴이 화면 가장자리에 붙지 않은 사진 추천'},
    pastorImage:{ratio:'3:4',size:'1200×1600px 이상',use:'섬기시는 사람들',tip:'상반신 중심 세로 사진, 머리 위 여백 확보 권장'},
    kakaoQr:{ratio:'1:1',size:'1000×1000px 이상',use:'오시는 길 · 카카오 QR',tip:'정사각형 원본 그대로 사용 권장'},
    youtubeQr:{ratio:'1:1',size:'1000×1000px 이상',use:'오시는 길 · YouTube QR',tip:'정사각형 원본 그대로 사용 권장'}
  };
  function ensure(){site.imageAdjustments=site.imageAdjustments||{};adjustable.forEach(k=>{if(site.imageAdjustments[k]==null)site.imageAdjustments[k]=100})}
  function addGuide(card,k){
    if(!card||card.querySelector('[data-ratio-guide]'))return;
    const g=guides[k];if(!g)return;
    const box=document.createElement('div');box.dataset.ratioGuide='1';
    box.style.cssText='margin:10px 0 12px;padding:11px 12px;border-radius:12px;background:#f4f8f5;border:1px solid #e0e9e3;color:#405047;font-size:12px;line-height:1.55';
    box.innerHTML=`<div style="font-weight:900;color:#285d48;margin-bottom:4px">추천 사진 규격</div><div><b>비율</b> ${g.ratio} · <b>권장 크기</b> ${g.size}</div><div><b>사용 위치</b> ${g.use}</div><div style="color:#6f7d75">${g.tip}</div>`;
    const hint=card.querySelector('.hint');
    if(hint&&hint.nextSibling)card.insertBefore(box,hint.nextSibling);else card.appendChild(box);
  }
  function attach(){
    ensure();
    const cards=[...document.querySelectorAll('#slotGrid .slot-card')];
    slots.forEach((slot,idx)=>{if(cards[idx])addGuide(cards[idx],slot[0])});
    adjustable.forEach(k=>{
      const idx=slots.findIndex(x=>x[0]===k);if(idx<0||!cards[idx])return;
      const card=cards[idx];if(card.querySelector('[data-brightness-control]'))return;
      const value=Number(site.imageAdjustments[k]??100);
      const preview=card.querySelector('.slot-preview');
      if(preview)preview.style.filter=`brightness(${value/100}) contrast(1.02) saturate(1.02)`;
      const wrap=document.createElement('div');wrap.dataset.brightnessControl='1';wrap.style.cssText='margin-top:14px;padding-top:12px;border-top:1px solid #e7e9e6';
      wrap.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:6px"><label style="margin:0;font-weight:800">사진 밝기</label><strong data-brightness-value>${value}%</strong></div><input type="range" min="70" max="140" step="1" value="${value}" style="width:100%" aria-label="${labels[k]} 밝기"><div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#7b857f"><span>어둡게</span><button type="button" class="ghost mini" data-reset-brightness>기본 100%</button><span>밝게</span></div>`;
      const range=wrap.querySelector('input[type=range]'),out=wrap.querySelector('[data-brightness-value]');
      const applyPreview=()=>{if(preview)preview.style.filter=`brightness(${Number(range.value)/100}) contrast(1.02) saturate(1.02)`};
      range.oninput=()=>{site.imageAdjustments[k]=Number(range.value);out.textContent=range.value+'%';applyPreview();dirty()};
      wrap.querySelector('[data-reset-brightness]').onclick=()=>{range.value=100;site.imageAdjustments[k]=100;out.textContent='100%';applyPreview();dirty()};
      card.appendChild(wrap);
    })
  }
  function patch(){if(typeof renderSlots!=='function')return false;const original=renderSlots;renderSlots=function(){original();setTimeout(attach,0)};setTimeout(attach,0);return true}
  if(!patch()){let n=0;const t=setInterval(()=>{if(patch()||++n>60)clearInterval(t)},100)}
})();