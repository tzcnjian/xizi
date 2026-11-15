
/* ================================================================
   5.5.703 补丁：通用弹窗返回按钮 + 游戏内顶部快捷设置
   ================================================================ */
(function(){
 if(window.__XZ_UI57)return;window.__XZ_UI57=true;
 function el(id){return document.getElementById(id);}

 /* ---------- 1) 通用弹窗右上角“返回/关闭”按钮 ---------- */
 var closeBtn=document.createElement('button');
 closeBtn.id='xzModalClose';closeBtn.innerHTML='✕';closeBtn.title='返回 / 关闭';
 closeBtn.addEventListener('click',function(){
  try{
   /* 优先关闭 PATCH 控制台（它是独立全屏面板） */
   var pp=el('patch-main-panel');
   if(pp&&pp.classList.contains('active')){ if(window.PATCH&&PATCH.closePanel){PATCH.closePanel();} else {pp.classList.remove('active');} return; }
  }catch(e){}
  try{ if(typeof closeModal==='function'){closeModal();return;} }catch(e){}
  var m=el('modal');if(m)m.classList.add('hidden');
 });
 document.body.appendChild(closeBtn);

 /* 包装 modal()：每次弹窗都显示返回按钮 */
 var _modal=window.modal;
 window.modal=function(html,cls){
  var r=_modal.apply(this,arguments);
  try{closeBtn.classList.add('show');}catch(e){}
  return r;
 };
 var _close=window.closeModal;
 window.closeModal=function(){
  try{closeBtn.classList.remove('show');}catch(e){}
  return _close.apply(this,arguments);
 };
 /* PATCH 控制台打开时也显示关闭钮 */
 document.addEventListener('click',function(e){
  setTimeout(function(){
   var pp=el('patch-main-panel');
   if(pp&&pp.classList.contains('active'))closeBtn.classList.add('show');
  },50);
 },true);

 /* ---------- 2) 游戏内顶部“快捷设置”按钮 ---------- */
 window.xzQuickSettings=function(){
  var lm=(typeof XZ_LRC_MODE!=='undefined')?XZ_LRC_MODE:'pop';
  var liquidOn=document.documentElement.classList.contains('liquid')||document.body.classList.contains('liquid');
  var h='<h3>⚙️ 快捷设置</h3>'+
   '<div class="dim small" style="margin-bottom:6px">歌词显示模式（顶栏中间）</div>'+
   '<div class="xz-qset">'+
     '<button class="gbtn '+(lm==='pop'?'gold2':'')+'" onclick="xzLrcSetMode(\'pop\');xzQuickSettings()">⚪ 逐句弹出</button>'+
     '<button class="gbtn '+(lm==='scroll'?'gold2':'')+'" onclick="xzLrcSetMode(\'scroll\');xzQuickSettings()">↔️ 滚动模式</button>'+
   '</div>'+
   '<div class="dim small" style="margin:10px 0 6px">界面与音效</div>'+
   '<div class="xz-qset">'+
     '<button class="gbtn" onclick="try{xzLiquidToggle()}catch(e){};setTimeout(xzQuickSettings,60)">🧊 液态玻璃开关</button>'+
     '<button class="gbtn" onclick="closeModal();try{xzLrcPanel()}catch(e){}">🎵 打开歌词面板</button>'+
   '</div>'+
   '<button class="big gold2" style="width:100%;margin-top:12px" onclick="closeModal();try{openSettings()}catch(e){}">🛠️ 打开完整设置</button>'+
   '<button class="big" style="width:100%;margin-top:8px" onclick="closeModal()">关闭</button>';
  modal(h);
 };

 function injectTop(){
  try{
   var right=document.querySelector('#game .topline .tl-right');
   if(right&&!el('xzTopSettings')){
    var b=document.createElement('button');
    b.id='xzTopSettings';b.textContent='⚙️ 设置';
    b.addEventListener('click',function(){xzQuickSettings();});
    /* 放到性取向/液态玻璃之前，保证可见 */
    right.insertBefore(b,right.firstChild);
   }
  }catch(e){}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectTop);
 else injectTop();
 /* 游戏开始后再注入一次（topline 可能被重绘） */
 var _sg=window.startGame;
 if(typeof _sg==='function'){window.startGame=function(){var r=_sg.apply(this,arguments);setTimeout(injectTop,300);setTimeout(injectTop,1200);return r;};}
})();
