
/* ================================================================
   5.5.703 修复：PATCH 工作台共用“详情/答题层” test-question-area
   历代合并中该容器被误删，导致 霍兰德/KSOG/MBTI/古代智慧等所有
   渲染进 test-question-area 的功能点击无反应。此处全局重建（电脑+手机）。
   ================================================================ */
(function(){
 if(window.__XZ_PATCHFIX)return;window.__XZ_PATCHFIX=true;
 function boot(){
  var content=document.getElementById('patch-content');
  if(!content){return false;}
  var area=document.getElementById('test-question-area');
  var wrap=document.getElementById('xz-detail-wrap');
  if(!wrap){
   wrap=document.createElement('div');
   wrap.id='xz-detail-wrap';
   wrap.innerHTML='<div class="xz-detail-bar"><button type="button" class="xz-detail-back" onclick="xzPatchDetailBack()">← 返回上一级</button></div>';
   if(area){wrap.appendChild(area);}
   else{area=document.createElement('div');area.id='test-question-area';wrap.appendChild(area);}
   content.appendChild(wrap);
  }else if(!area){
   area=document.createElement('div');area.id='test-question-area';wrap.appendChild(area);
  }
  // 注入样式（浅色清爽答题卡，电脑/手机一致；手机端另有 703 规则加大触控）
  if(!document.getElementById('xz-patchfix-css')){
   var st=document.createElement('style');st.id='xz-patchfix-css';
   st.textContent=
   '#xz-detail-wrap{display:none;width:100%}'+
   '#xz-detail-wrap.xz-on{display:block;animation:xzfade .22s ease}'+
   '@keyframes xzfade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'+
   '#patch-content.xz-detail>.panel{display:none!important}'+
   '.xz-detail-bar{display:flex;justify-content:flex-start;margin-bottom:12px}'+
   '.xz-detail-back{min-height:42px;padding:9px 18px;border-radius:12px;border:1px solid #c9d8ff;background:#eef3ff;color:#3557d6;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 4px 12px rgba(53,87,214,.15)}'+
   '#test-question-area{color:#3a4566}'+
   '#test-question-area .question-card{background:#f6f9ff;border:1px solid #dbe4ff;border-radius:18px;padding:22px;box-shadow:0 10px 28px rgba(40,70,140,.10)}'+
   '#test-question-area .question-text{font-size:17px;color:#243056;line-height:1.65;margin:6px 0 16px;font-weight:700}'+
   '#test-question-area .option-btn{min-height:50px;text-align:left;padding:12px 16px;border-radius:12px;border:1px solid #c9d8ff;background:#fff;color:#243056;font-size:15px;cursor:pointer;transition:.15s;line-height:1.4}'+
   '#test-question-area .option-btn:hover{background:#eaf0ff;border-color:#9db6f5;transform:translateY(-1px)}'+
   '#test-question-area h1,#test-question-area h2,#test-question-area h3,#test-question-area h4{color:#243056}'+
   '#test-question-area p,#test-question-area span,#test-question-area td,#test-question-area th,#test-question-area label,#test-question-area li,#test-question-area b,#test-question-area strong{color:#3a4566}';
   document.head.appendChild(st);
  }
  function sync(){
   var on=area.innerHTML.replace(/\s+/g,'').length>0;
   wrap.classList.toggle('xz-on',on);
   content.classList.toggle('xz-detail',on);
   if(on){try{content.scrollTop=0;}catch(e){}}
  }
  new MutationObserver(sync).observe(area,{childList:true,characterData:true,subtree:true});
  sync();
  window.xzPatchDetailBack=function(){area.innerHTML='';};
  // 包装导航/关闭/测试中心初始化：离开详情时清空答题层
  function getPATCH(){try{return(typeof PATCH!=='undefined'&&PATCH)?PATCH:null;}catch(e){return null;}}
  function wrapPATCH(){
   var P=getPATCH();
   if(!P){return false;}
   if(!P.__xzWrapped){
    if(P.openPanel){var oo=P.openPanel;P.openPanel=function(id){try{area.innerHTML='';}catch(e){}return oo.apply(this,arguments);};}
    if(P.closePanel){var oc=P.closePanel;P.closePanel=function(){try{area.innerHTML='';}catch(e){}return oc.apply(this,arguments);};}
    if(P.tests&&P.tests.init){var oi=P.tests.init;P.tests.init=function(){try{area.innerHTML='';}catch(e){}return oi.apply(this,arguments);};}
    P.__xzWrapped=true;
   }
   return true;
  }
  if(!wrapPATCH()){var t=setInterval(function(){if(wrapPATCH())clearInterval(t);},120);setTimeout(function(){clearInterval(t);},8000);}
  return true;
 }
 function start(){if(!boot()){document.addEventListener('DOMContentLoaded',boot);var t=setInterval(function(){if(boot())clearInterval(t);},150);setTimeout(function(){clearInterval(t);},10000);}}
 start();
})();

