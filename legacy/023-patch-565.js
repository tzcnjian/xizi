
/* ================================================================
   5.5.703 顶栏去重与重构（后置，电脑+手机）
   历代合并残留两个 .topline，tlRep/tlLyric 重复 ID，导致名声/歌词重复、
   顶部拥挤、手机错位。这里把唯一的“齿轮设置”移入新栏 #xzTopline，
   永久隐藏旧栏；并重排为：名声左 / 歌词中(手机整行) / 性取向·液态·齿轮右。
   另修：红色关闭钮 #xzModalClose 关闭面板后残留；悬浮名声条手机遮挡。
   ================================================================ */
(function(){
 if(window.__XZ_TOP703B)return;window.__XZ_TOP703B=true;

 var css=
 '/* 合并后的唯一顶栏（电脑横排） */'+
 '#xzTopline{display:flex!important;flex-wrap:nowrap!important;align-items:center;gap:8px}'+
 '#xzTopline #tlRep{order:1;flex:0 0 auto}'+
 '#xzTopline #tlLyric{order:2;flex:1 1 100%;min-width:0}'+
 '#xzTopline #tlPref{order:3;flex:0 0 auto}'+
 '#xzTopline #tlLiquid{order:4;flex:0 0 auto}'+
 '#xzTopline .tl-right{order:5;flex:0 0 auto;display:flex!important;gap:6px;align-items:center}'+
 '/* 隐藏合并残留的旧顶栏 */'+
 '.topline:not(#xzTopline){display:none!important}'+
 '/* 手机竖屏：grid 两行 */'+
 '@media (max-width:900px){'+
 ' #xzTopline{display:grid!important;grid-template-columns:1fr auto auto auto;'+
 ' grid-template-areas:"rep pref liquid gear" "lyric lyric lyric lyric";gap:6px 8px;width:100%;box-sizing:border-box}'+
 ' #xzTopline #tlRep{grid-area:rep;justify-self:start;order:0}'+
 ' #xzTopline #tlPref{grid-area:pref;justify-self:end;order:0}'+
 ' #xzTopline #tlLiquid{grid-area:liquid;justify-self:end;order:0}'+
 ' #xzTopline .tl-right{grid-area:gear;justify-self:end;order:0}'+
 ' #xzTopline #tlLyric{grid-area:lyric;order:0;width:100%;min-width:0;min-height:32px;text-align:center;display:flex;align-items:center;justify-content:center}'+
 ' #xzTopline .tl-item{max-width:100%}'+
 ' #xzTopline #tlRep,#xzTopline #tlPref{white-space:nowrap}'+
 ' /* 悬浮名声通知条下移，不遮挡顶栏 */'+
 ' #repBar{top:auto!important;bottom:84px!important;left:50%!important;right:auto!important;transform:translateX(-50%);max-width:90vw}'+
 '}'+
 '/* 手机横屏：单行紧凑 */'+
 '@media (max-width:960px) and (orientation:landscape){'+
 ' #xzTopline{display:flex!important;flex-wrap:nowrap!important;grid-template-areas:none}'+
 ' #xzTopline #tlRep,#xzTopline #tlPref,#xzTopline #tlLiquid,#xzTopline .tl-right{grid-area:auto}'+
 ' #xzTopline #tlLyric{grid-area:auto;flex:1 1 100%;min-width:0;min-height:0;display:block}'+
 '}';

 function injectCss(){var s=document.createElement('style');s.id='xz-top703b-css';s.textContent=css;document.body.appendChild(s);}

 function mergeTop(){
  var t1=document.getElementById('xzTopline');
  if(!t1)return false;
  var t2=null;
  [].forEach.call(document.querySelectorAll('.topline'),function(t){if(t!==t1)t2=t;});
  // 只把唯一的“齿轮设置”移进新栏（不搬旧栏里重复的名声/歌词/性取向/液态）
  var gear=document.getElementById('xzTopSettings');
  if(gear&&!t1.contains(gear)){
   var wr=t1.querySelector('.tl-right');
   if(!wr){wr=document.createElement('span');wr.className='tl-right';t1.appendChild(wr);}
   wr.appendChild(gear);
  }
  // 新栏内若出现重复 id，只保留第一个
  ['tlRep','tlLyric','tlPref','tlLiquid'].forEach(function(id){
   var els=t1.querySelectorAll('#'+id);
   for(var i=1;i<els.length;i++){var ex=els[i];if(ex.parentNode)ex.parentNode.removeChild(ex);}
  });
  // 整体移除合并残留的旧顶栏（消除重复 ID）
  if(t2&&t2.parentNode)t2.parentNode.removeChild(t2);
  return true;
 }

 function syncClose(){
  var cb=document.getElementById('xzModalClose');if(!cb)return;
  var pp=document.getElementById('patch-main-panel');
  var m=document.getElementById('modal');
  var panelOpen=pp&&pp.classList.contains('active');
  var modalOpen=m&&!m.classList.contains('hidden');
  cb.classList.toggle('show',!!(panelOpen||modalOpen));
 }

 function start(){
  injectCss(); syncClose();
  var pp=document.getElementById('patch-main-panel'),m=document.getElementById('modal');
  var mo=new MutationObserver(syncClose);
  if(pp)mo.observe(pp,{attributes:true,attributeFilter:['class']});
  if(m)mo.observe(m,{attributes:true,attributeFilter:['class']});
  document.addEventListener('click',function(){setTimeout(syncClose,80);},true);
  // 旧顶栏可能由更晚的脚本注入，持续重试合并，直到齿轮就位
  var tries=0;
  function tick(){mergeTop();syncClose();tries++;
   var gear=document.getElementById('xzTopSettings');
   var t1=document.getElementById('xzTopline');
   if((gear&&t1&&t1.contains(gear))||tries>60)clearInterval(timer);
  }
  tick();
  var timer=setInterval(tick,200);
  window.addEventListener('load',function(){for(var i=0;i<3;i++)setTimeout(tick,100+i*300);});
  setTimeout(function(){clearInterval(timer);},14000);
 }
 start();
})();

