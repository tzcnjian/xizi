
/* ================================================================
   5.5.703 手机版增强功能（不影响电脑逻辑，纯增量）
   1) 方向随时可重选/可取消（解决“点了自动很难取消”）
   2) 字体大小四档（手机字小 → 一键放大）
   3) 背景亮度调节（图片背景太暗/太亮）
   4) 快捷设置面板扩展
   ================================================================ */
(function(){
 if(window.__XZ_M703)return;window.__XZ_M703=true;
 var ORIENT_NAME={auto:'自动适配',portrait:'竖屏',landscape:'横屏'};

 /* ---------- 应用方向 ---------- */
 window.xzApplyOrient=function(o){
  try{localStorage.setItem('xzOrient',o);}catch(e){}
  var de=document.documentElement;
  de.classList.remove('landscape');
  if(o==='landscape')de.classList.add('landscape');
 };
 /* 方向选择菜单；inGame=true 时选完留在游戏，否则回到角色创建 */
 window.xzOrientMenu=function(inGame){
  var cur='auto';try{cur=localStorage.getItem('xzOrient')||'auto';}catch(e){}
  function b(o,icon){return '<button class="big '+(cur===o?'gold2':'')+'" style="width:100%;margin-top:8px" '
    +'onclick="xzPickOrient(\''+o+'\','+(inGame?1:0)+')">'+icon+' '+ORIENT_NAME[o]+(cur===o?' ✓':'')+'</button>';}
  var h='<h3>📱 切换游玩方向</h3>'+
   '<div class="quote"><b>自动适配（推荐）</b>：跟随手机横竖屏，任何时候都能在这改。</div>'+
   b('auto','📱')+b('portrait','📲')+b('landscape','🖥️')+
   '<button class="big" style="width:100%;margin-top:12px" onclick="closeModal()">← 返回</button>';
  modal(h);
 };
 window.xzPickOrient=function(o,inGame){
  xzApplyOrient(o);
  if(inGame){
   closeModal();
   try{l('📱 已切换为「'+ORIENT_NAME[o]+'」','good');}catch(e){}
   try{if(window.PATCH&&PATCH.toast)PATCH.toast('方向已切换为 '+ORIENT_NAME[o],'success');}catch(e){}
  }else{
   closeModal();
   try{showCharCreate();}catch(e){}
  }
 };

 /* ---------- 字体大小 ---------- */
 window.xzFontSet=function(sz){
  try{localStorage.setItem('xz_font',sz);}catch(e){}
  document.documentElement.setAttribute('data-fz',sz);
  var name={sm:'小号',mid:'标准',lg:'大号',xl:'特大'}[sz]||'标准';
  try{if(window.PATCH&&PATCH.toast)PATCH.toast('字体：'+name,'success');}catch(e){}
  setTimeout(function(){try{xzQuickSettings();}catch(e){}},80);
 };
 function applyFont(){var sz='mid';try{sz=localStorage.getItem('xz_font')||'mid';}catch(e){}
  document.documentElement.setAttribute('data-fz',sz);}

 /* ---------- 背景亮度 ---------- */
 window.xzBrightSet=function(d){
  var v=parseFloat((document.documentElement.style.getPropertyValue('--xz-bg-bright')||'1'),10);
  if(isNaN(v))v=1; v=Math.max(0.55,Math.min(1.4,+(v+d).toFixed(2)));
  document.documentElement.style.setProperty('--xz-bg-bright',v);
  try{localStorage.setItem('xz_bg_bright',v);}catch(e){}
  try{if(window.PATCH&&PATCH.toast)PATCH.toast('背景亮度 '+(v*100).toFixed(0)+'%','success');}catch(e){}
  setTimeout(function(){try{xzQuickSettings();}catch(e){}},80);
 };
 function applyBright(){var v='1';try{v=localStorage.getItem('xz_bg_bright')||'1';}catch(e){}
  document.documentElement.style.setProperty('--xz-bg-bright',v);}

 /* ---------- 扩展快捷设置（保留原有歌词/液态玻璃，新增方向/字体/亮度） ---------- */
 window.xzQuickSettings=function(){
  var lm=(typeof XZ_LRC_MODE!=='undefined')?XZ_LRC_MODE:'pop';
  var fz=document.documentElement.getAttribute('data-fz')||'mid';
  var br=parseFloat(document.documentElement.style.getPropertyValue('--xz-bg-bbright')||document.documentElement.style.getPropertyValue('--xz-bg-bright')||'1',10);
  if(isNaN(br))br=1;
  function fbtn(sz,label){return '<button class="gbtn '+(fz===sz?'gold2':'')+'" onclick="xzFontSet(\''+sz+'\')">'+label+'</button>';}
  var h='<h3>⚙️ 快捷设置</h3>'+
   '<div class="dim small" style="margin:6px 0">歌词显示模式</div>'+
   '<div class="xz-qset">'+
     '<button class="gbtn '+(lm==='pop'?'gold2':'')+'" onclick="xzLrcSetMode(\'pop\');xzQuickSettings()">⚪ 逐句弹出</button>'+
     '<button class="gbtn '+(lm==='scroll'?'gold2':'')+'" onclick="xzLrcSetMode(\'scroll\');xzQuickSettings()">↔️ 滚动模式</button>'+
   '</div>'+
   '<div class="dim small" style="margin:12px 0 6px">📱 游玩方向（随时可改）</div>'+
   '<button class="big" style="width:100%" onclick="xzOrientMenu('+(document.getElementById('game')&&document.getElementById('game').classList.contains('show')?'true':'false')+')">🔄 切换横竖屏 / 自动适配</button>'+
   '<div class="dim small" style="margin:12px 0 6px">🔠 字体大小（手机可调大）</div>'+
   '<div class="xz-qset">'+fbtn('sm','小')+fbtn('mid','标准')+fbtn('lg','大')+fbtn('xl','特大')+'</div>'+
   '<div class="dim small" style="margin:12px 0 6px">💡 背景图片亮度（当前 '+(br*100).toFixed(0)+'%）</div>'+
   '<div class="xz-qset">'+
     '<button class="gbtn" onclick="xzBrightSet(-0.12)">🔅 暗一点</button>'+
     '<button class="gbtn" onclick="xzBrightSet(0.12)">🔆 亮一点</button>'+
   '</div>'+
   '<div class="dim small" style="margin:12px 0 6px">界面与音效</div>'+
   '<div class="xz-qset">'+
     '<button class="gbtn" onclick="try{xzLiquidToggle()}catch(e){};setTimeout(xzQuickSettings,60)">🧊 液态玻璃</button>'+
     '<button class="gbtn" onclick="closeModal();try{xzLrcPanel()}catch(e){}">🎵 歌词面板</button>'+
   '</div>'+
   '<button class="big gold2" style="width:100%;margin-top:12px" onclick="closeModal();try{openSettings()}catch(e){}">🛠️ 完整设置</button>'+
   '<button class="big" style="width:100%;margin-top:8px" onclick="closeModal()">关闭</button>';
  modal(h);
 };

 /* ---------- 开局方向弹窗加“返回首页”，避免选了就回不去 ---------- */
 var _sf=window.startFlow;
 window.startFlow=function(){
  try{_sf&&_sf.apply(this,arguments);}catch(e){try{var _s=window.startFlow;}catch(e2){}}
  setTimeout(function(){
   var mb=document.getElementById('modalbox');
   if(mb && mb.textContent.indexOf('选择游玩方向')>=0 && !mb.querySelector('.xz-orient-back')){
    var b=document.createElement('button');
    b.className='big xz-orient-back';b.type='button';
    b.style.cssText='width:100%;margin-top:12px';
    b.textContent='← 返回首页';
    b.onclick=function(){
     closeModal();
     try{
      var hp=document.getElementById('heroPanel');if(hp)hp.style.display='';
      var cp=document.getElementById('charPanel');if(cp)cp.style.display='none';
     }catch(e){}
    };
    mb.appendChild(b);
   }
  },40);
 };

 /* ---------- 角色创建面板顶部加“切换方向” ---------- */
 function injectCharOrient(){
  try{
   var cp=document.getElementById('charPanel');
   if(!cp||cp.style.display==='none')return;
   if(cp.querySelector('.xz-char-orient'))return;
   var b=document.createElement('button');
   b.className='big xz-char-orient';b.type='button';
   b.style.cssText='width:100%;margin:6px 0 10px';
   b.textContent='📱 切换游玩方向（自动 / 竖屏 / 横屏）';
   b.onclick=function(){xzOrientMenu(false);};
   cp.insertBefore(b,cp.firstChild);
  }catch(e){}
 }
 var _scc=window.showCharCreate;
 if(typeof _scc==='function'){
  window.showCharCreate=function(){var r=_scc.apply(this,arguments);setTimeout(injectCharOrient,60);setTimeout(injectCharOrient,300);return r;};
 }

 function init(){applyFont();applyBright();injectCharOrient();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
 else init();
 setTimeout(init,400);setTimeout(init,1500);
})();

