(()=>{
  // The mission statement is rendered from content/church-info.json by church-info.js.
  // Keep this legacy enhancement file as a no-op so cached pages cannot render a second copy.
  function cleanup(){
    document.querySelectorAll('#mission5,.mission5').forEach(el=>el.remove());
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanup,{once:true});else cleanup();
})();
