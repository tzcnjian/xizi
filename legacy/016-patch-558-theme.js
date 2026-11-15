
/* ================================================================
   5.5.703 新增：右下角「工作台」 + 主页「应用商城」（完整新系统）
   ================================================================ */
(function(){
 if(window.__XZ_WB_LOADED)return; window.__XZ_WB_LOADED=true;
 function el(id){return document.getElementById(id);}
 function $q(s){return document.querySelector(s);}
 /* ---------- 工作台工具数据（本地存储持久化） ---------- */
 var WB_KEY='xz_wb_v1';
 function wbLoad(){try{return JSON.parse(localStorage.getItem(WB_KEY)||'{}');}catch(e){return {};}}
 function wbSave(o){try{localStorage.setItem(WB_KEY,JSON.stringify(o));}catch(e){}}
 /* ---------- 计算器 ---------- */
 function wbCalc(){
  var disp='';
  function render(){var d=$q('#wbCalcDisp');if(d)d.value=disp||'0';}
  function press(v){
   if(v==='C')disp='';
   else if(v==='='){try{disp=String(Function('"use strict";return ('+disp+')')());}catch(e){disp='错误';}}
   else disp+=v;
   render();
  }
  var btns=['C','(',' )','/','7','8','9','*','4','5','6','-','1','2','3','+','0','.','=','%'];
  var h='<h3>🧮 工作台 · 计算器</h3><input id="wbCalcDisp" style="width:100%;padding:12px;font-size:22px;text-align:right;border-radius:12px;border:1px solid var(--line2);background:rgba(9,14,30,.9);color:var(--txt);margin-bottom:10px" value="0">'+
   '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:7px">';
  for(var i=0;i<btns.length;i++)(function(v){h+='<button class="mini" style="padding:13px 0;font-size:16px" onclick="window.__wbPress(\''+v+'\')">'+v+'</button>';})(btns[i]);
  h+='</div><div class="row" style="margin-top:12px"><button class="big gold2" style="flex:1" onclick="workbench()">← 返回工作台</button></div>';
  modal(h);
  window.__wbPress=press;
 }
 /* ---------- 备忘录 ---------- */
 function wbNote(){
  var d=wbLoad();d.note=d.note||'';
  var h='<h3>📝 工作台 · 备忘录</h3><textarea id="wbNoteTa" placeholder="写点什么…" style="width:100%;min-height:220px;padding:12px;border-radius:12px;border:1px solid var(--line2);background:rgba(9,14,30,.9);color:var(--txt);font-size:15px;line-height:1.6">'+d.note+'</textarea>'+
   '<div class="row" style="margin-top:10px"><button class="big gold2" style="flex:1" onclick="window.__wbSaveNote()">💾 保存</button><button class="big" style="flex:1" onclick="workbench()">← 返回</button></div>';
  modal(h);
  window.__wbSaveNote=function(){var o=wbLoad();o.note=$q('#wbNoteTa').value;wbSave(o);var b=$q('#wbNoteTa');b.style.borderColor='var(--good)';setTimeout(function(){if(b)b.style.borderColor='';},900);};
 }
 /* ---------- 待办清单 ---------- */
 function wbTodo(){
  var d=wbLoad();d.todo=d.todo||[];
  function render(){
   var list=$q('#wbTodoList');if(!list)return;list.innerHTML='';
   for(var i=0;i<d.todo.length;i++){(function(idx){
    var it=d.todo[idx];
    var row=document.createElement('div');
    row.style.cssText='display:flex;gap:8px;align-items:center;padding:8px;border-radius:10px;border:1px solid var(--line2);background:rgba(9,14,30,.7);margin-bottom:6px';
    row.innerHTML='<input type="checkbox" '+(it.done?'checked':'')+' style="width:20px;height:20px" onchange="window.__wbTodoToggle('+idx+')">'+
     '<span style="flex:1;'+(it.done?'text-decoration:line-through;opacity:.5':'')+'">'+esc(it.t)+'</span>'+
     '<button class="gbtn r" onclick="window.__wbTodoDel('+idx+')">✕</button>';
    list.appendChild(row);
   })(i);}
  }
  var h='<h3>✅ 工作台 · 待办清单</h3><div class="row"><input id="wbTodoIn" type="text" placeholder="添加一条待办…" style="flex:1"><button class="big gold2" style="flex:0 0 auto" onclick="window.__wbTodoAdd()">＋</button></div>'+
   '<div id="wbTodoList" style="margin-top:10px"></div>'+
   '<div class="row" style="margin-top:12px"><button class="big" style="flex:1" onclick="workbench()">← 返回工作台</button></div>';
  modal(h);render();
  window.__wbTodoAdd=function(){var v=$q('#wbTodoIn').value.trim();if(!v)return;d.todo.push({t:v,done:false});wbSave(d);$q('#wbTodoIn').value='';render();};
  window.__wbTodoToggle=function(i){d.todo[i].done=!d.todo[i].done;wbSave(d);render();};
  window.__wbTodoDel=function(i){d.todo.splice(i,1);wbSave(d);render();};
 }
 /* ---------- 小画板 ---------- */
 function wbPad(){
  var h='<h3>🖌️ 工作台 · 小画板</h3><canvas id="wbPadCv" style="width:100%;height:300px;background:#fff;border-radius:12px;touch-action:none;display:block"></canvas>'+
   '<div class="row" style="margin-top:10px;gap:6px;flex-wrap:wrap">'+
   '<button class="gbtn" style="background:#f33" onclick="window.__wbColor(\'#f33\')">●</button>'+
   '<button class="gbtn" style="background:#f90" onclick="window.__wbColor(\'#f90\')">●</button>'+
   '<button class="gbtn" style="background:#fc0" onclick="window.__wbColor(\'#fc0\')">●</button>'+
   '<button class="gbtn" style="background:#3c3" onclick="window.__wbColor(\'#3c3\')">●</button>'+
   '<button class="gbtn" style="background:#36f" onclick="window.__wbColor(\'#36f\')">●</button>'+
   '<button class="gbtn" style="background:#639" onclick="window.__wbColor(\'#639\')">●</button>'+
   '<button class="gbtn" style="background:#000" onclick="window.__wbColor(\'#000\')">●</button>'+
   '<button class="gbtn" onclick="window.__wbClear()">🧹 清空</button>'+
   '<button class="gbtn" onclick="window.__wbSavePad()">💾 保存</button>'+
   '</div>'+
   '<div class="row" style="margin-top:10px"><button class="big" style="flex:1" onclick="workbench()">← 返回工作台</button></div>';
  modal(h);
  var cv=$q('#wbPadCv'),ctx=cv.getContext('2d'),drawing=false,lastX=0,lastY=0,color='#36f';
  function px(e){var r=cv.getBoundingClientRect();return [(e.clientX-r.left)*(cv.width/r.width),(e.clientY-r.top)*(cv.height/r.height)];}
  function start(e){drawing=true;var p=px(e);lastX=p[0];lastY=p[1];e.preventDefault();}
  function move(e){if(!drawing)return;var p=px(e);ctx.strokeStyle=color;ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(lastX,lastY);ctx.lineTo(p[0],p[1]);ctx.stroke();lastX=p[0];lastY=p[1];e.preventDefault();}
  function end(){drawing=false;}
  cv.addEventListener('pointerdown',start);cv.addEventListener('pointermove',move);cv.addEventListener('pointerup',end);cv.addEventListener('pointerleave',end);
  cv.width=400;cv.height=300;
  window.__wbColor=function(c){color=c;};
  window.__wbClear=function(){ctx.clearRect(0,0,cv.width,cv.height);};
  window.__wbSavePad=function(){var url=cv.toDataURL('image/png');var a=document.createElement('a');a.href=url;a.download='我的画作.png';a.click();};
 }
 /* ---------- 灵感便签 ---------- */
 function wbIdea(){
  var d=wbLoad();d.ideas=d.ideas||[];
  function render(){
   var list=$q('#wbIdeaList');if(!list)return;list.innerHTML='';
   for(var i=0;i<d.ideas.length;i++){(function(idx){
    var row=document.createElement('div');
    row.style.cssText='padding:9px;border-radius:10px;border:1px dashed var(--line2);background:rgba(9,14,30,.7);margin-bottom:6px;display:flex;gap:8px;align-items:flex-start';
    row.innerHTML='<span style="flex:1;white-space:pre-wrap">'+esc(d.ideas[idx])+'</span><button class="gbtn r" onclick="window.__wbIdeaDel('+idx+')">✕</button>';
    list.appendChild(row);
   })(i);}
  }
  var h='<h3>💡 工作台 · 灵感便签</h3><textarea id="wbIdeaTa" placeholder="记录一闪而过的灵感…" style="width:100%;min-height:120px;padding:12px;border-radius:12px;border:1px solid var(--line2);background:rgba(9,14,30,.9);color:var(--txt)"></textarea>'+
   '<div class="row" style="margin-top:8px"><button class="big gold2" style="flex:1" onclick="window.__wbIdeaAdd()">＋ 记下</button></div>'+
   '<div id="wbIdeaList" style="margin-top:10px"></div>'+
   '<div class="row" style="margin-top:12px"><button class="big" style="flex:1" onclick="workbench()">← 返回工作台</button></div>';
  modal(h);render();
  window.__wbIdeaAdd=function(){var v=$q('#wbIdeaTa').value.trim();if(!v)return;d.ideas.push(v);wbSave(d);$q('#wbIdeaTa').value='';render();};
  window.__wbIdeaDel=function(i){d.ideas.splice(i,1);wbSave(d);render();};
 }
 /* ---------- 工作台主界面 ---------- */
 window.workbench=function(){
  var tools=[
   {i:'🧮',n:'计算器',d:'支持四则运算与括号',fn:wbCalc},
   {i:'📝',n:'备忘录',d:'随手记录，本地保存',fn:wbNote},
   {i:'✅',n:'待办清单',d:'管理每日计划',fn:wbTodo},
   {i:'🖌️',n:'小画板',d:'涂鸦并导出图片',fn:wbPad},
   {i:'💡',n:'灵感便签',d:'收藏一闪而过的想法',fn:wbIdea}
  ];
  var h='<h3>🛠️ 工作台</h3><div class="quote">你的随身小工具集合。所有内容自动保存在本机。</div>'+
   '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:9px">';
  for(var i=0;i<tools.length;i++)(function(t){
   h+='<div class="card" style="cursor:pointer;text-align:center;padding:14px 8px" onclick="'+t.fn.name+'()"><div style="font-size:26px">'+t.i+'</div><div style="font-weight:700;margin-top:6px">'+t.n+'</div><div class="dim small" style="margin-top:3px">'+t.d+'</div></div>';
  })(tools[i]);
  h+='</div><button class="big" style="margin-top:12px" onclick="closeModal()">关闭</button>';
  modal(h);
 };
 /* ---------- 应用商城 ---------- */
 window.appStore=function(){
  var apps=[
   {i:'🎵',n:'音乐播放器',d:'六首歌 · 歌词同步',open:function(){try{musicPlayer&&musicPlayer();}catch(e){}}},
   {i:'🖼️',n:'校园图鉴',d:'浏览校园像素画',open:function(){try{openAtlas&&openAtlas();}catch(e){}}},
   {i:'🎮',n:'小游戏大厅',d:'十几款休闲小游戏',open:function(){try{openGame&&openGame();}catch(e){}}},
   {i:'⛏️',n:'黄金矿工',d:'挖金 · 模型切换',open:function(){try{xzGoldMiner&&xzGoldMiner();}catch(e){}}},
   {i:'🍉',n:'合成大西瓜',d:'经典合成玩法',open:function(){try{watermelonStart&&watermelonStart();}catch(e){}}},
   {i:'🎯',n:'跳一跳',d:'蓄力连击 · 动画版',open:function(){try{jumpJump&&jumpJump();}catch(e){}}},
   {i:'💗',n:'恋爱系统',d:'心动日常 · 纪念日',open:function(){try{loveSys&&loveSys();}catch(e){}}},
   {i:'🤖',n:'AI 聊天',d:'接入智能对话',open:function(){try{xzOpenChat&&xzOpenChat();}catch(e){}}},
   {i:'🖊️',n:'希沃白板',d:'可书写的教学白板',open:function(){try{xzWhiteboard&&xzWhiteboard();}catch(e){}}},
   {i:'📚',n:'每日一练',d:'每天一道好题',open:function(){try{xzDaily88802&&xzDaily88802();}catch(e){}}}
  ];
  var h='<h3>🛍️ 应用商城</h3><div class="quote">精选应用，点击即可打开。全部已内置，无需下载。</div>'+
   '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:9px">';
  for(var i=0;i<apps.length;i++)(function(a){
   h+='<div class="card" style="padding:12px 10px"><div style="display:flex;gap:8px;align-items:center"><div style="font-size:24px">'+a.i+'</div><div style="flex:1"><div style="font-weight:700">'+a.n+'</div><div class="dim small">'+a.d+'</div></div></div>'+
    '<button class="gbtn" style="width:100%;margin-top:8px" onclick="window.__appStoreOpen('+i+')">打开</button></div>';
  })(apps[i]);
  h+='</div><button class="big" style="margin-top:12px" onclick="closeModal()">关闭</button>';
  modal(h);
  window.__appStoreOpen=function(i){try{apps[i].open();}catch(e){}};
 };
 /* ---------- 注入入口按钮 ---------- */
 function inject(){
  try{
   /* 1) 右下角悬浮工作台按钮 */
   if(!el('xzWorkbenchFab')){
    var fab=document.createElement('div');
    fab.id='xzWorkbenchFab';
    fab.innerHTML='🛠️';
    fab.style.cssText='position:fixed;right:16px;bottom:20px;width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#4a7dff,#8b5cf6);color:#fff;font-size:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 26px rgba(108,140,255,.55);z-index:9999;border:none;user-select:none;-webkit-tap-highlight-color:transparent';
    fab.title='打开工作台';
    fab.addEventListener('click',function(){workbench();});
    document.body.appendChild(fab);
   }
   /* 2) 主页(hero)加「应用商城」按钮 */
   var hb=document.querySelector('.hero-buttons');
   if(hb&&!el('xzHeroStore')){
    var b=document.createElement('button');
    b.id='xzHeroStore';b.className='hero-btn ghost';
    b.innerHTML='🛍️ 应用商城';
    b.style.cssText='border:1px solid var(--line2);background:linear-gradient(180deg,rgba(30,40,76,.9),rgba(19,27,54,.9));color:var(--txt);border-radius:12px;padding:11px 14px;cursor:pointer;font-size:13px';
    b.addEventListener('click',function(){appStore();});
    hb.appendChild(b);
   }
  }catch(e){}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject);
 else inject();
})();
