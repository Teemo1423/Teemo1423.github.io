/* Weekly board editor — uses the existing GitHub connection and save workflow. */
(function(){
const configs={
 sharingEditor:{path:'content/sarangbang-sharing.json',title:'사랑방 나눔',fields:[['date','날짜'],['title','제목'],['image','대표 이미지 경로','image'],['originalText','카카오톡 원문 (붙여넣기)','textarea'],['images','추가 이미지 경로 (한 줄당 하나)','images'],['scripture','성경 본문'],['summary','설교 요약','textarea'],['application','말씀 적용','textarea'],['meaning','사랑방 의미','textarea'],['questions','함께 나눌 질문 (줄마다 하나)','questions'],['invitation','나눔 초대','textarea'],['note','담당자 메모','textarea']]},
 schoolEditor:{path:'content/sunday-school.json',title:'주일학교 소식',fields:[['date','날짜'],['title','제목'],['scripture','오늘의 말씀'],['summary','말씀 이야기','textarea'],['activity','적용 활동','textarea'],['familyGuide','가정에서 함께','textarea'],['prayer','기도','textarea'],['nextWeek','다음 주 안내','textarea'],['image','대표 이미지 경로','image'],['originalText','카카오톡 원문 (붙여넣기)','textarea'],['images','추가 이미지 경로 (한 줄당 하나)','images']]}
};
const records={};let loaded={};
const escapeText=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function list(type){return document.getElementById(type+'List')}
function mark(){dirty()}
async function load(type){if(!token){status('먼저 GitHub 관리자 연결을 해주세요.',false);return}try{const d=await getJson(configs[type].path);records[type]=type==='schoolEditor'?(Array.isArray(d.weekly)?d.weekly:[]):Array.isArray(d)?d:[];loaded[type]=true;render(type)}catch(e){status(configs[type].title+' 로딩 실패: '+e.message,false)}}
function render(type){const root=list(type);if(!root)return;const cfg=configs[type];const rows=records[type]||[];root.innerHTML=rows.length?rows.map((r,i)=>'<article class="cms-item"><div class="cms-item-head"><b>'+escapeText(r.title||'새 게시물')+'</b><div class="cms-item-actions"><button type="button" data-copy="'+i+'">카카오 링크 복사</button><button type="button" class="danger" data-delete="'+i+'">삭제</button></div></div><div class="item-grid">'+cfg.fields.map(([field,label,kind])=>'<div class="full"><label>'+label+'</label>'+(kind==='textarea'||kind==='questions'||kind==='images'?'<textarea data-index="'+i+'" data-field="'+field+'" rows="'+(kind==='questions'?4:3)+'">'+escapeText(kind==='questions'?(r.questions||[]).join('\n'):kind==='images'?(r.images||[]).join('\n'):r[field])+'</textarea>':'<input data-index="'+i+'" data-field="'+field+'" value="'+escapeText(r[field])+'">'+(kind==='image'?'<div class="cms-item-actions" style="margin-top:8px;gap:8px;display:flex;flex-wrap:wrap"><button type="button" data-upload-image="'+i+'">+ 새 이미지 넣기</button><button type="button" class="ghost" data-existing-image="'+i+'">기존 이미지 선택</button><button type="button" class="ghost" data-clear-image="'+i+'">이미지 비우기</button></div>'+(r[field]?'<img src="'+escapeText(r[field])+'" alt="대표 이미지 미리보기" style="display:block;max-width:260px;width:100%;height:auto;border-radius:12px;margin-top:10px">':''):''))+'</div>').join('')+'</div></article>').join(''):'<p class="muted">등록된 게시물이 없습니다. 게시물 추가를 눌러주세요.</p>';root.querySelectorAll('[data-field]').forEach(el=>el.addEventListener('input',()=>{const r=rows[Number(el.dataset.index)];r[el.dataset.field]=(el.dataset.field==='questions'||el.dataset.field==='images')?el.value.split('\n').map(x=>x.trim()).filter(Boolean):el.value;mark()}));{root.querySelectorAll('[data-upload-image]').forEach(btn=>btn.addEventListener('click',()=>{const index=Number(btn.dataset.uploadImage);const input=document.createElement('input');input.type='file';input.accept='image/*';input.onchange=async()=>{const file=input.files&&input.files[0];if(!file)return;try{status(cfg.title+' 대표 이미지 업로드 중...');const path=await uploadBlob(await canvasJpeg(file),file.name);rows[index].image=path;render(type);mark();await save(type);status('대표 이미지 업로드 및 게시물 저장 완료. 홈페이지 반영까지 잠시 기다려주세요.')}catch(e){status('이미지 업로드 실패: '+e.message,false)}};input.click()}));root.querySelectorAll('[data-existing-image]').forEach(btn=>btn.addEventListener('click',async()=>{const index=Number(btn.dataset.existingImage);try{if(typeof loadImages==='function')await loadImages();openMediaPicker('weekly:'+type+':'+index)}catch(e){status('기존 이미지 불러오기 실패: '+e.message,false)}}));root.querySelectorAll('[data-clear-image]').forEach(btn=>btn.addEventListener('click',()=>{rows[Number(btn.dataset.clearImage)].image='';render(type);mark()}))} root.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{const item=rows[Number(btn.dataset.copy)];const page=type==='sharingEditor'?'sarangbang-sharing.html':'sunday-school-news.html';const campaign=type==='sharingEditor'?'sarangbang_sharing':'sunday_school_news';const url='https://mohyeonsomang.org/'+page+'?date='+encodeURIComponent(item.date||'')+'&post='+encodeURIComponent(item.title||'')+'&utm_source=kakao&utm_medium=social&utm_campaign='+campaign;try{await navigator.clipboard.writeText(url);status('해당 게시물 링크를 복사했습니다. 카카오톡에 붙여넣으세요.')}catch(e){prompt('게시물 링크를 복사하세요.',url)}}));root.querySelectorAll('[data-delete]').forEach(btn=>btn.addEventListener('click',()=>{if(!confirm('이 게시물을 삭제할까요?'))return;rows.splice(Number(btn.dataset.delete),1);render(type);mark()}))}
async function save(type){if(!loaded[type])return false;try{status(configs[type].title+' 저장 중...');const path=configs[type].path;let payload=records[type];if(type==='schoolEditor'){const original=await getJson(path);payload={...original,weekly:records[type]}}await putJson(path,payload,'CMS: update '+configs[type].title+' posts');clean();status(configs[type].title+' 게시물 저장 완료. 홈페이지 반영까지 잠시 기다려주세요.');return true}catch(e){status('저장 실패: '+e.message,false);return false}}
document.querySelectorAll('[data-weekly-add]').forEach(btn=>btn.addEventListener('click',async()=>{const type=btn.dataset.weeklyAdd;if(!loaded[type])await load(type);if(!loaded[type])return;const today=new Date();const date=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('.');records[type].unshift({date,title:'새 게시물',questions:type==='sharingEditor'?['','','']:undefined});render(type);mark()}));

/* Archive migration: use actual Kakao text and uploaded source images.
   Never synthesize historic text or silently replace existing posts. */
(function installKakaoImporter(){
  const style=document.createElement('style');style.id='kakao-archive-import-style';
  style.textContent='.kakao-paste-import{margin:16px 0 22px;padding:14px 16px;border:1px solid #dce8df;border-radius:16px;background:#f4f8f5}.kakao-paste-import summary{cursor:pointer;color:#285a43;font-weight:800;font-size:15px}.kakao-import-grid{display:grid;grid-template-columns:minmax(0,180px) minmax(0,1fr);gap:12px;margin-top:16px}.kakao-import-grid label{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:700;color:#3d5c4b}.kakao-import-grid .full{grid-column:1/-1}.kakao-import-grid input,.kakao-import-grid textarea{display:block;width:100%;min-width:0;box-sizing:border-box;border:1px solid #d9e5dd;background:white;border-radius:10px;padding:10px;font-size:14px;color:#18372a}.kakao-import-grid textarea{min-height:180px;resize:vertical;white-space:pre-wrap}.kakao-import-grid button{justify-self:start}.kakao-import-hint{font-size:12px;color:#65796d;line-height:1.65}@media(max-width:640px){.kakao-import-grid{grid-template-columns:1fr}.kakao-import-grid .full{grid-column:1}.kakao-import-grid input,.kakao-import-grid textarea{font-size:16px}}';
  document.head.appendChild(style);
  Object.keys(configs).forEach(type=>{
    const target=list(type);if(!target)return;
    const panel=document.createElement('details');panel.className='kakao-paste-import';
    panel.innerHTML='<summary>📥 카카오톡 이전 게시물 가져오기</summary><div class="kakao-import-grid"><label>게시 날짜<input data-kakao-date type="date" required></label><label>게시물 제목<input data-kakao-title type="text" placeholder="카카오톡에 게시한 제목 그대로" required></label><label class="full">카카오톡 게시물 원문<textarea data-kakao-text placeholder="카카오톡 채널 게시물의 글 전체를 그대로 붙여넣으세요. 문단과 이모티콘도 유지됩니다." required></textarea></label><label class="full">게시물 이미지 (여러 장 선택 가능)<input data-kakao-images type="file" accept="image/*" multiple></label><p class="kakao-import-hint full">기존 게시물은 그대로 유지합니다. 등록 시 사진은 홈페이지에 별도로 업로드되며, 원문은 수정하지 않고 보관합니다.</p><button data-kakao-submit type="button">원문과 사진을 홈페이지에 추가</button></div>';
    target.parentNode.insertBefore(panel,target);
    panel.querySelector('[data-kakao-submit]').addEventListener('click',async()=>{
      const dateInput=panel.querySelector('[data-kakao-date]'),titleInput=panel.querySelector('[data-kakao-title]'),textInput=panel.querySelector('[data-kakao-text]'),filesInput=panel.querySelector('[data-kakao-images]'),button=panel.querySelector('[data-kakao-submit]');
      const dateValue=dateInput.value,title=titleInput.value.trim(),originalText=textInput.value.replace(/\r\n/g,'\n');
      if(!dateValue||!title||!originalText.trim()){status('날짜, 제목, 카카오톡 원문을 모두 입력해 주세요.',false);return}
      if(!loaded[type])await load(type);
      if(!loaded[type])return;
      const date=type==='sharingEditor'?dateValue.replace(/-/g,'.'):dateValue;
      const identical=(records[type]||[]).some(x=>String(x.date||'').replace(/\D/g,'')===date.replace(/\D/g,'')&&String(x.title||'').trim()===title);
      if(identical){status('같은 날짜와 제목의 게시물이 이미 있습니다. 중복 추가하지 않았습니다.',false);return}
      button.disabled=true;
      try{
        const photos=[];const files=Array.from(filesInput.files||[]);
        for(let i=0;i<files.length;i++){
          const file=files[i];if(!file.type.startsWith('image/'))throw Error('이미지 파일만 업로드할 수 있습니다.');
          status(configs[type].title+' 사진 업로드 ('+(i+1)+'/'+files.length+')...');
          photos.push(await uploadBlob(await canvasJpeg(file),file.name));
        }
        const record={date,title,originalText,image:photos[0]||'',images:photos.slice(1)};
        records[type].unshift(record);render(type);mark();
        const saved=await save(type);
        if(saved){dateInput.value='';titleInput.value='';textInput.value='';filesInput.value='';panel.open=false;status('카카오톡 게시물과 이미지 '+files.length+'장을 홈페이지에 저장했습니다.')}
      }catch(e){status('카카오톡 자료 가져오기 실패: '+e.message,false)}
      finally{button.disabled=false}
    });
  });
})();
const originalSelectMedia=selectMedia;selectMedia=async function(path){if(typeof pickerTarget==='string'&&pickerTarget.startsWith('weekly:')){const parts=pickerTarget.split(':');const type=parts[1],index=Number(parts[2]);if(records[type]&&records[type][index]){records[type][index].image=path;render(type);mark();await save(type);status('기존 이미지 선택 및 게시물 저장 완료. 홈페이지 반영까지 잠시 기다려주세요.')}closeMediaPicker();return}return originalSelectMedia(path)};
const originalGo=goPage;goPage=function(name){originalGo(name);if(configs[name]&&!loaded[name])load(name)};
const originalSave=saveCurrent;saveCurrent=function(){if(configs[currentPage])return save(currentPage);return originalSave()};
const originalAll=saveAll;saveAll=async function(){await originalAll();for(const type of Object.keys(configs)){if(loaded[type])await save(type)}};
})();