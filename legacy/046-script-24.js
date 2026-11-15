
(function(){
  function showNow(){
    try{
      var b=document.getElementById('heroStartBtn');
      if(!b) return;
      if(typeof showStartBtn888==='function'){ if(!window._btnShown) showStartBtn888(); }
      else { b.style.display='inline-block'; }
      b.classList.remove('x583-label-hide','x590-hidden');
      b.style.display='inline-block';
    }catch(e){}
  }
  function arm(){ if(document.readyState==='complete') showNow(); else setTimeout(arm,300); }
  setTimeout(arm, 2500);   /* 主兜底 */
  setTimeout(showNow, 5000); /* 二次兜底，防中间状态被其它逻辑改回 */
})();
