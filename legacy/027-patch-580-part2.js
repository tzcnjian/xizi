/* ================================================================
   5.5.8 歌曲包：《去年夏天》王大毛 · 《一点》Muyoi/Pezzi
   注册进 BGM_LIST / BGM_B64 / LRC_DATA；并加“人声开关”（伴奏模式）
   依赖：window.XZ_B64_558（base64，两首，与下方顺序一致）
   ================================================================ */
(function(){
'use strict';
if(window.__XZ_SONGS_558)return;
function ready(f){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',f);else setTimeout(f,0);}

var LRC_QNX=[
 [0,"（前奏）"],
 [11,"我给你的爱"],[14,"疼不疼 痛不痛"],[17,"这样一直被动"],[20,"幻想中我的梦"],[24,"总会过分要命的囧"],
 [28,"在过去每个时候"],[31,"我都会想象的念头"],[35,"别怕你就算我是你的"],[39,"小小狗也总会被打痛"],
 [43,"意念中想不痛"],[46,"却总是被一次掏空"],[49,"在去年夏天跟你说了"],[53,"一个小小要求"],
 [56,"答应了不放手"],[59,"而如今也再不回头"],
 [66,"还有什么等待"],[69,"还有什么悲哀"],[72,"这故事中的人不太精彩"],[76,"夏去了又回来"],
 [79,"而人却已不在"],[82,"它重复着我汹涌的忍耐"],[87,"今年兰花又开"],[90,"开了它也会败"],
 [93,"我想要一个人活得精彩"],[97,"有些人总会来"],[100,"有些人在我心中在徘徊"],
 [105,"我拿了总会还"],[108,"你拿了就逃开"],[111,"在失去中我慢慢的变呆"],[115,"是不同步的未来"],[119,"却把书包中的日记更改"],
 [135,"（间奏）"],
 [150,"我给你的爱"],[153,"疼不疼 痛不痛"],[156,"在过去每个时候"],[160,"我都会想象的念头"],
 [166,"还有什么等待"],[169,"还有什么悲哀"],[172,"这故事中的人不太精彩"],[176,"夏去了又回来"],
 [179,"而人却已不在"],[182,"它重复着我汹涌的忍耐"],[187,"今年兰花又开"],[190,"开了它也会败"],
 [193,"我想要一个人活得精彩"],[197,"有些人总会来"],[200,"有些人在我心中在徘徊"],
 [205,"我拿了总会还"],[208,"你拿了就逃开"],[211,"在失去中我慢慢的变呆"],[215,"是不同步的未来"],[219,"却把书包中的日记更改"],
 [232,"（尾奏）"]
];
var LRC_YD=[
 [0,"（前奏）"],
 [12,"多好的一页"],[15,"故事里新的起点"],[19,"就靠近一点"],[22,"就再靠近一点点"],
 [26,"有着多少的细节"],[29,"藏在你的眼睛里面"],[33,"再看你一眼"],[36,"过分的疯狂迷恋"],
 [41,"多好的一页"],[44,"故事里新的起点"],[48,"飘荡在夜空里埋藏着"],[52,"红着眼眶麻痹神经"],
 [56,"两个人就这样相遇"],[59,"同一片破碎星空里"],
 [64,"楼下的公园里荡着秋千"],[68,"聊些有的没的散步兜圈"],[72,"第一次见她的时候"],[75,"我们互相留恋"],
 [79,"她教我喝酒 我教她抽烟"],[83,"新的相纸定格留下纪念"],[87,"记录落魄的俩人靠着互相依恋"],
 [92,"同样失眠 同样厌倦欺骗"],[96,"公园的长椅一直聊到疲倦"],
 [106,"多好的一页"],[109,"故事里新的起点"],[113,"就靠近一点"],[116,"就再靠近一点点"],
 [120,"有着多少的细节"],[123,"藏在你的眼睛里面"],[128,"再看你一眼"],[131,"过分的疯狂迷恋"],
 [136,"飘荡在夜空里埋藏着"],[140,"红着眼眶麻痹神经"],[144,"两个人就这样相遇"],[148,"同一片破碎星空里"],
 [156,"（尾奏）"]
];
var META=[
 {t:'去年夏天',a:'王大毛',al:'《去年夏天》'},
 {t:'一点',a:'Muyoi / Pezzi',al:'《一点》'}
];
function register(){
 if(window.__XZ_SONGS_558)return;
 var b=window.XZ_B64_558;
 if(!b||!b.length||typeof BGM_LIST==='undefined')return;
 if(!BGM_LIST.some(function(s){return s.t==='去年夏天'||s.t==='一点';})){
  for(var i=0;i<META.length;i++){
   BGM_LIST.push(META[i]);
   if(typeof BGM_B64!=='undefined'&&b[i])BGM_B64.push(b[i]);
   if(typeof LRC_DATA!=='undefined')LRC_DATA.push(i===0?LRC_QNX:LRC_YD);
  }
 }
 window.__XZ_SONGS_558=true;
 try{bgmSave();bgmRender();}catch(e){}
}
/* 人声开关（伴奏模式：低通削弱人声 + 微调音量） */
var XZ_VOCAL=(function(){try{return localStorage.getItem('xzVocal')!=='off';}catch(e){return true;}})();
var xzActx=null,xzSrc=null,xzLp=null,xzGainNode=null,xzWired=false;
function wireAudio(){
 if(xzWired||!window.BGM_AUD||!window.AudioContext)return;
 try{
  xzActx=new (window.AudioContext||window.webkitAudioContext)();
  xzSrc=xzActx.createMediaElementSource(BGM_AUD);
  xzLp=xzActx.createBiquadFilter();xzLp.type='lowpass';
  xzGainNode=xzActx.createGain();
  xzSrc.connect(xzLp);xzLp.connect(xzGainNode);xzGainNode.connect(xzActx.destination);
  xzWired=true;applyVocal();
 }catch(e){xzWired=false;}
}
function applyVocal(){
 try{if(xzActx&&xzActx.state==='suspended')xzActx.resume();}catch(e){}
 if(!xzLp)return;
 if(XZ_VOCAL){xzLp.frequency.value=20000;if(xzGainNode)xzGainNode.gain.value=1;}
 else{xzLp.frequency.value=1100;if(xzGainNode)xzGainNode.gain.value=0.95;}
}
window.xzVocalToggle=function(){
 XZ_VOCAL=!XZ_VOCAL;
 try{localStorage.setItem('xzVocal',XZ_VOCAL?'on':'off');}catch(e){}
 wireAudio();applyVocal();
 var btn=document.getElementById('xzVocalBtn');
 if(btn)btn.textContent=XZ_VOCAL?'🎤 人声：开（原唱）':'🎤 人声：关（伴奏）';
 try{if(typeof PATCH!=='undefined'&&PATCH&&PATCH.toast)PATCH.toast(XZ_VOCAL?'已切回原唱':'伴奏模式（削弱人声）','info');}catch(e){}
};
/* 在音乐播放器注入人声开关 */
function injectVocalBtn(){
 if(typeof musicPlayer!=='function'||window.__XZ_VOCAL_HOOK)return;window.__XZ_VOCAL_HOOK=true;
 var _mp=window.musicPlayer;
 window.musicPlayer=function(){
  var r=_mp.apply(this,arguments);
  setTimeout(function(){
   var list=document.getElementById('mpList');
   if(list&&!document.getElementById('xzVocalBtn')){
    var b=document.createElement('button');b.className='gbtn';b.id='xzVocalBtn';
    b.style.cssText='width:100%;margin:8px 0 4px;background:#7c3aed';
    b.textContent=XZ_VOCAL?'🎤 人声：开（原唱）':'🎤 人声：关（伴奏）';
    b.onclick=function(){wireAudio();if(xzActx&&xzActx.state==='suspended')xzActx.resume();window.xzVocalToggle();};
    list.parentNode.insertBefore(b,list);
   }
  },30);
  return r;
 };
}
ready(function(){register();injectVocalBtn();setTimeout(wireAudio,800);});
setTimeout(function(){register();injectVocalBtn();},1500);
})();

/* ================================================================
   杭州西子实验学校模拟器 · 5.5.8 主补丁 (A)
   修：测试崩溃 / K歌满分光挡键 / 天气权重 / 体力门控 / 跳一跳全屏
       返回主菜单 / 歌词黑字(CSS) / 光标安全
   ================================================================ */
(function(){
'use strict';
if(window.__XZ558_A)return;window.__XZ558_A=true;
function ready(f){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',f);else setTimeout(f,0);}
/* ---- Canvas roundRect 兼容（旧内核无 roundRect，导致K歌音轨/跳一跳绘制崩溃）---- */
if(window.CanvasRenderingContext2D&&!CanvasRenderingContext2D.prototype.roundRect){
 CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,radii){
  if(typeof radii==='number'){radii=[radii,radii,radii,radii];}
  if(!radii){radii=[0,0,0,0];}
  var rr=radii.map(function(v){return Math.max(0,Math.min(v,Math.min(w,h)/2));});
  this.moveTo(x+rr[0],y);
  this.lineTo(x+w-rr[1],y);this.arcTo(x+w,y,x+w,y+rr[1],rr[1]);
  this.lineTo(x+w,y+h-rr[2]);this.arcTo(x+w,y+h,x+w-rr[2],y+h,rr[2]);
  this.lineTo(x+rr[3],y+h);this.arcTo(x,y+h,x,y+h-rr[3],rr[3]);
  this.lineTo(x,y+rr[0]);this.arcTo(x,y,x+rr[0],y,rr[0]);
  this.closePath();return this;
 };
}
function P(){return (typeof PATCH!=='undefined'&&PATCH)?PATCH:null;}
function G(){return (typeof G!=='undefined')?window.G:null;}
function Lg(m,c){try{if(typeof l==='function')l(m,c);}catch(e){}try{if(P()&&P().toast)P().toast(m,'info');}catch(e){}}

/* ================================================================
   ① 心理测试 / MBTI / 霍兰德 / KSOG 代理修复
   ================================================================ */
function fixTests(){
 var T=P()&&P().tests;if(!T||window.__XZ_TESTFIX_558)return;
 if(!T.renderQuestion||String(T.renderQuestion).indexOf('currentTest')<0){
  T.renderQuestion=function(){
   var ct=T.currentTest,g=T[ct];
   if(g&&typeof g.renderQuestion==='function')return g.renderQuestion();
   if(T.mbti&&typeof T.mbti.renderQuestion==='function')return T.mbti.renderQuestion();
  };
 }
 ['holland','ksog','mbti'].forEach(function(n){
  var g=T[n];if(!g||typeof g!=='object')return;
  Object.keys(g).forEach(function(k){
   if(k==='start'||k==='init'||k==='renderQuestion')return;
   if(typeof g[k]==='function'&&typeof T[k]!=='function')T[k]=g[k];
  });
 });
 if(typeof T.init==='function'){
  var oi=T.init;
  T.init=function(){try{var a=document.getElementById('test-question-area');if(a)a.innerHTML='';}catch(e){}return oi.apply(this,arguments);};
 }
 window.__XZ_TESTFIX_558=true;
}

/* ================================================================
   ② 天气：按权重抽取，并大幅降低下雨频率（原 pk 等概率 → 雨≈25%）
   ================================================================ */
function fixWeather(){
 if(window.__XZ_WX558)return;window.__XZ_WX558=true;
 try{
  if(typeof HZ_WEATHERS==='object'){
   Object.keys(HZ_WEATHERS).forEach(function(m){
    (HZ_WEATHERS[m]||[]).forEach(function(x){
     if(!x)return;
     if(x.rain>=1)x.w=1;                       /* 雨/雪/雷/台风 极低 */
     else if(x.n.indexOf('晴')>=0)x.w=7;      /* 晴 主导 */
     else if(x.n.indexOf('多云')>=0)x.w=5;
     else x.w=3;                              /* 阴 */
    });
   });
  }
  function wpk(pool){
   var tot=0;pool.forEach(function(x){tot+=(x.w||1);});
   var r=Math.random()*tot;
   for(var i=0;i<pool.length;i++){r-=(pool[i].w||1);if(r<=0)return pool[i];}
   return pool[pool.length-1];
  }
  var _tick=(typeof tick==='function')?tick:null;
  if(_tick){
   tick=function(){
    _tick();
    try{
     var g=window.G;if(!g||g.over||typeof g.idx==='undefined')return;
     if(g.idx===0&&g.date&&typeof HZ_WEATHERS==='object'){
      var mm=g.date.getMonth()+1,pool=HZ_WEATHERS[mm]||HZ_WEATHERS[10];
      var w=wpk(pool);g.weather=w;g.wtemp=w.t;
     }
    }catch(e){}
   };
  }
 }catch(e){}
}

/* ================================================================
   ③ 每日体力（精力）系统
   - 每天 100 点；课堂/课间动作按时长扣；聊天/履职/约会扣精力
   - 休息/睡觉/吃饭/午休恢复；耗尽则无法继续做“事”，只能结束时段
   - 只加门控，不删除任何原有动作
   ================================================================ */
var EN=window.XZ_EN||(window.XZ_EN={MAX:100});
function dayKey(){try{var g=window.G;if(!g||!g.date)return'';return g.date.getFullYear()+'-'+g.date.getMonth()+'-'+g.date.getDate();}catch(e){return'';}}
function enInit(reset){
 var g=window.G;if(!g)return;
 if(typeof g.energy!=='number'||isNaN(g.energy)||reset){g.energy=EN.MAX;g._enDay=dayKey();}
 if(!g._enDay)g._enDay=dayKey();
}
function enResetDaily(){
 var g=window.G;if(!g)return;
 var k=dayKey();
 if(k&&g._enDay!==k){g.energy=EN.MAX;g._enDay=k;}
 if(typeof g.energy!=='number'||isNaN(g.energy))g.energy=EN.MAX;
 if(g.energy>EN.MAX)g.energy=EN.MAX;
}
function enGet(){var g=window.G;enResetDaily();return g?Math.round(g.energy):EN.MAX;}
function enBar(){
 var e=enGet(),pct=Math.max(0,Math.min(100,e/EN.MAX*100)),low=e<25;
 return '<div class="xz-energy-wrap">⚡ <b>今日精力</b> <span id="enVal">'+e+'</b> / '+EN.MAX+
  '<div class="xz-energy-bar"><div class="xz-energy-fill'+(low?' low':'')+'" style="width:'+pct+'%"></div></div>'+
  '<div class="xz-energy-tip">'+(low?'精力不足：睡觉、午休、好好吃饭可恢复，或直接结束时段。':'每做一件事消耗精力，精力用完今天就只能休息啦。')+'</div></div>';
}
/* 消耗：返回 true 表示允许 */
function enSpend(n,why){
 var g=window.G;if(!g)return true;
 enResetDaily();
 if((g.energy||0)<n){
  Lg('😮‍💨 今天精力不够了（还剩 '+Math.round(g.energy)+'，需要 '+n+'）：'+(why||'做这件事')+'。先休息 / 吃饭 / 睡觉，或结束当前时段。','warn');
  try{if(typeof PATCH!=='undefined'&&PATCH&&PATCH.toast)PATCH.toast('精力不足，先休息吧','warning');}catch(e){}
  return false;
 }
 g.energy=Math.max(0,g.energy-n);
 enRefreshUI();
 return true;
}
function enRecover(n){var g=window.G;if(!g)return;enResetDaily();g.energy=Math.min(EN.MAX,(g.energy||0)+n);enRefreshUI();}
function enRefreshUI(){
 var v=document.getElementById('enVal');
 if(v){var e=enGet();v.textContent=e;var fills=document.querySelectorAll('.xz-energy-fill');
  for(var i=0;i<fills.length;i++){fills[i].style.width=(e/EN.MAX*100)+'%';fills[i].className='xz-energy-fill'+(e<25?' low':'');}}
 var p=document.getElementById('xzEnergyPill');if(p){p.textContent='⚡ 精力 '+enGet();}
}
/* 按时长估算精力消耗（分钟） */
function enCostOf(min){
 if(!min||min<=0)return 6;
 var c=Math.max(5,Math.round(min/5)*5);
 return Math.min(c,25);
}
/* 包裹课堂/课间时段动作 xzTSDo */
function hookTimeSlot(){
 if(typeof xzTSDo!=='function'||window.__XZ_EN_TS)return;window.__XZ_EN_TS=true;
 var _do=xzTSDo;
 window.xzTSDo=function(i){
  var t=window.G&&window.G._ts,a=t&&t.actions&&t.actions[i];
  if(!t||!a)return _do.apply(this,arguments);
  var label=a.t||'';
  var rest=/(睡觉|休息|打瞌睡|打盹|眯|睡一会|趴|养神|吃饭|早饭|午饭|晚饭|加餐|喝水|深呼吸|发呆)/.test(label);
  if(rest){ /* 休息/吃饭恢复精力 */
    var rec=/(睡|午休|睡觉)/.test(label)?18:10;
    var r=_do.apply(this,arguments);enRecover(rec);enRefreshUI();return r;
  }
  var cost=enCostOf(a.r?Math.round((a.r[0]+a.r[1])/2):8);
  if(!enSpend(cost,label)){ /* 不允许：刷新当前面板提示精力 */
    try{if(typeof xzTSRender==='function')xzTSRender();}catch(e){}
    return;
  }
  var r=_do.apply(this,arguments);
  setTimeout(enRefreshUI,30);
  return r;
 };
 /* 在时段面板顶部插入精力条 */
 if(typeof xzTSRender==='function'&&!window.__XZ_EN_TSR){
  window.__XZ_EN_TSR=true;
  var _rr=xzTSRender;
  window.xzTSRender=function(){
   var r=_rr.apply(this,arguments);
   try{
    var box=document.querySelector('#modalbox');
    if(box&&!box.querySelector('.xz-energy-wrap')){
     var h3=box.querySelector('h3');
     var d=document.createElement('div');d.innerHTML=enBar();
     if(h3&&h3.parentNode)h3.parentNode.insertBefore(d.firstChild,h3.nextSibling);
    }
    enRefreshUI();
   }catch(e){}
   return r;
  };
 }
}
/* 包裹通用菜单 MI：履职/聊天/约会/约会等动作消耗精力 */
function hookMenu(){
 if(typeof MI!=='function'||window.__XZ_EN_MI)return;window.__XZ_EN_MI=true;
 var _MI=window.MI;
 window.MI=function(i){
  var it=window.MU&&window.MU[i];
  if(it&&window.G){
   var n=it.n||'';
   if(/履行|收(作业|语文|数学|英语)|发消息|AI\s*对话|和TA|约会|表白|聊天|串门|送礼|约会|约TA|搭讪|互动|聊天/.test(n)){
    var cost=/约会|表白|送礼/.test(n)?14:(/履行|收/.test(n)?10:8);
    if(!enSpend(cost,n)){try{if(typeof upd==='function')upd();}catch(e){}return;}
   }
   if(/休息|睡觉|吃饭|午饭|早饭|晚饭|加餐|喝水/.test(n)){enRecover(10);}
  }
  var r=_MI.apply(this,arguments);
  setTimeout(enRefreshUI,30);
  return r;
 };
}
/* 每天重置：包裹 newDay / next 进入 idx 0 */
function hookNewDay(){
 if(window.__XZ_EN_ND)return;
 if(typeof newDay==='function'){window.__XZ_EN_ND=true;var _nd=newDay;newDay=function(){var r=_nd.apply(this,arguments);try{enInit(true);enRecover(0);}catch(e){}return r;};}
}
/* 顶栏精力小药丸：独立一行，避免插进主按钮网格导致列错乱 */
window.xzEnsureTopActions=function(){
 var host=document.getElementById('xzTopActions');
 if(host)return host;
 var funcRow=document.getElementById('xzRow2');
 if(!funcRow){var fm=document.querySelector('#game .mini');if(fm)funcRow=fm.parentNode;}
 if(!funcRow)return null;
 host=document.createElement('div');host.id='xzTopActions';host.className='xz-top-actions';
 funcRow.parentNode.insertBefore(host,funcRow);
 return host;
};
function addEnergyPill(){
 var host=window.xzEnsureTopActions();
 if(host&&!document.getElementById('xzEnergyPill')){
  var b=document.createElement('button');b.className='mini';b.id='xzEnergyPill';b.textContent='⚡ 精力 '+enGet();
  b.title='今日精力，做事情会消耗，睡觉/吃饭恢复';
  b.onclick=function(){
   modal('<h3>⚡ 今日精力</h3>'+enBar()+'<div class="quote">精力是 5.5.8 新增的“每日行动额度”。<br>每天最多安排约十几件事，避免无限刷知识库、疯狂恋爱或一直履职。<br>睡觉、午休、好好吃饭、课间休息都能恢复精力；第二天自动回满。</div><button class="gbtn" onclick="closeModal()">知道了</button>');
  };
  host.appendChild(b);
 }
 enRefreshUI();
}

/* ================================================================
   ④ K歌：真实音准节奏判定（canvas 音轨 + 高低音曲线 + 按键判定）
   ================================================================ */
function hookKaraoke(){
 var K=P()&&P().karaoke;if(!K||window.__XZ_KZ558)return;window.__XZ_KZ558=true;
 var S=null;
 function songId(){var s=K.currentSong||K.selectedSong||K.song;return s;}
 function ensureGame(){
  var card=document.getElementById('karaoke-score');
  if(!card)return null;
  var wrap=document.getElementById('kzGame');
  if(!wrap){
   wrap=document.createElement('div');wrap.id='kzGame';
   wrap.innerHTML='<div id="kzCombo"></div><div id="kzJudge"></div>'+
    '<canvas id="kzCanvas" width="720" height="405"></canvas>'+
    '<div class="kz-stat"><span>🎯 命中 <b id="kzHitCnt">0</b></span><span>✨ Perfect <b id="kzP">0</b></span><span id="kzLyricNow" style="font-weight:700"></span></div>'+
    '<button id="kzHit" class="kz-hit">🎤 唱（到线时按）</button>'+
    '<div style="text-align:center;margin-top:6px"><button class="gbtn" id="kzStop" style="background:#64748b">⏹ 结束演唱</button></div>';
   card.parentNode.insertBefore(wrap,card);
   var hit=document.getElementById('kzHit');
   function tap(e){if(e)e.preventDefault();doHit();}
   hit.addEventListener('click',tap);
   hit.addEventListener('touchstart',tap,{passive:false});
   document.getElementById('kzStop').addEventListener('click',function(){stop(false);});
  }
  return wrap;
 }
 function notesOf(song){
  var ns=[];
  (song.lyrics||[]).forEach(function(L,idx){
   if(!L||!L.text)return;
   if(/^[（(]/.test(L.text))return; /* 前奏/间奏/尾奏 不出键 */
   var pitch=0.5+0.42*Math.sin(idx*0.7)+0.18*Math.sin(idx*1.7);
   ns.push({t:L.time,text:L.text,pitch:Math.max(0.08,Math.min(0.92,pitch)),hit:null,judged:false});
  });
  ns.sort(function(a,b){return a.t-b.t;});
  return ns;
 }
 function start(){
  var song=songId();
  if(!song){try{P().toast('请先选择一首歌曲','warning');}catch(e){}return;}
  if(K.animationFrame)cancelAnimationFrame(K.animationFrame);
  var wrap=ensureGame();
  S={song:song,notes:notesOf(song),t0:performance.now(),raf:null,combo:0,max:0,perfect:0,good:0,miss:0,total:0,done:false};
  document.getElementById('karaoke-controls').style.display='none';
  document.getElementById('karaoke-score').style.display='block';
  if(wrap)wrap.style.display='block';
  var st=document.getElementById('karaoke-status');if(st)st.textContent='🎤 演唱中：'+(song.title||song.id)+'（跟着音轨，音符到判定线按“唱”）';
  loop();
 }
 function loop(){
  if(!S||S.done)return;
  var now=performance.now();var t=(now-S.t0)/1000;
  /* 自动 miss */
  for(var i=0;i<S.notes.length;i++){var n=S.notes[i];
   if(!n.hit&&!n.judged&&t-n.t>0.45){n.judged=true;n.miss=true;S.miss++;S.total++;S.combo=0;flash('MISS','#94a3b8');}
  }
  draw(t);
  var dur=(S.song.duration||240);
  if(t>=Math.min(dur,(S.notes[S.notes.length-1]?S.notes[S.notes.length-1].t+2:dur))){finish();return;}
  S.raf=requestAnimationFrame(loop);
 }
 function doHit(){
  if(!S||S.done)return;
  var t=(performance.now()-S.t0)/1000,best=null,bd=1e9;
  for(var i=0;i<S.notes.length;i++){var n=S.notes[i];
   if(n.hit||n.judged)continue;
   var d=Math.abs(t-n.t);
   if(d<bd){bd=d;best=n;}
  }
  if(!best||bd>0.5){ /* 空挥：小惩罚 */
   S.combo=0;flash('空拍','#94a3b8');update();return;
  }
  best.hit=true;best.judged=true;S.total++;
  if(bd<=0.22){best.r='perfect';S.perfect++;S.combo++;S.max=Math.max(S.max,S.combo);flash('PERFECT ✨','#ffd166');}
  else if(bd<=0.42){best.r='good';S.good++;S.combo++;S.max=Math.max(S.max,S.combo);flash('GOOD 👍','#6ee7b7');}
  else {best.r='miss';S.miss++;S.combo=0;flash('MISS','#94a3b8');}
  update();
 }
 var judgeTimer=null;
 function flash(txt,color){var j=document.getElementById('kzJudge');if(j){j.textContent=txt;j.style.color=color;clearTimeout(judgeTimer);judgeTimer=setTimeout(function(){j.textContent='';},500);}}
 function update(){
  var n=S.notes.length;
  var pRate=n?S.perfect/n:0,gRate=n?S.good/n:0;
  var pitch=Math.round(40+pRate*58+gRate*12);
  var rhythm=Math.round(42+pRate*56+gRate*16);
  var tech=Math.round(38+pRate*60+gRate*10);
  var breath=Math.round(44+pRate*52+gRate*16);
  var voice=Math.round(40+pRate*56+gRate*12);
  [['pitch',pitch],['rhythm',rhythm],['technique',tech],['breath',breath],['voice',voice]].forEach(function(a){
   var e=document.getElementById('ks-'+a[0]);if(e)e.textContent=a[1];
   var b=document.getElementById('ks-'+a[0]+'-bar');if(b)b.style.width=a[1]+'%';
  });
  var total=Math.round((pitch+rhythm+tech+breath+voice)/5);
  var te=document.getElementById('ks-total');if(te)te.textContent=total;
  var cb=document.getElementById('ks-combo');if(cb)cb.style.width=Math.min(100,S.max*4)+'%';
  var hc=document.getElementById('kzHitCnt');if(hc)hc.textContent=S.perfect+S.good;
  var pc=document.getElementById('kzP');if(pc)pc.textContent=S.perfect;
  var combo=document.getElementById('kzCombo');if(combo)combo.textContent=S.combo>2?'🔥 COMBO ×'+S.combo:'';
 }
 function draw(t){
  var cv=document.getElementById('kzCanvas');if(!cv)return;
  var ctx=cv.getContext('2d');var W=cv.width,H=cv.height;
  var jx=W*0.16, speed=W*0.205;
  var grd=ctx.createLinearGradient(0,0,0,H);grd.addColorStop(0,'#101a3a');grd.addColorStop(1,'#0a1128');
  ctx.fillStyle=grd;ctx.fillRect(0,0,W,H);
  /* 轨道 */
  for(var k=0;k<5;k++){var y=H*0.22+k*H*0.14;ctx.strokeStyle='rgba(120,160,255,.08)';ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  /* 判定线 */
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(jx,H*0.12);ctx.lineTo(jx,H*0.9);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#ffd166';ctx.font='bold 16px sans-serif';ctx.textAlign='center';ctx.fillText('判定',jx,H*0.1);
  /* 音符 + 高低音曲线 */
  var visible=[];
  for(var i=0;i<S.notes.length;i++){var n=S.notes[i];var dt=n.t-t;if(dt<-1||dt>3.2)continue;
   var x=jx+dt*speed;var y=H*(0.86-n.pitch*0.62);visible.push({x:x,y:y,n:n});
  }
  if(visible.length>1){ctx.strokeStyle='rgba(120,180,255,.35)';ctx.lineWidth=2;ctx.beginPath();
   for(var i=0;i<visible.length;i++){var p=visible[i];if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}ctx.stroke();ctx.lineWidth=1;}
  for(var i=0;i<visible.length;i++){var p=visible[i];
   if(p.n.hit){ctx.fillStyle='rgba(110,231,183,.25)';}
   else if(p.n.miss){ctx.fillStyle='rgba(148,163,184,.25)';}
   else{var g2=ctx.createLinearGradient(0,p.y-12,0,p.y+12);g2.addColorStop(0,'#7aa8ff');g2.addColorStop(1,'#5b7fe0');ctx.fillStyle=g2;}
   var rw=p.n.r==='perfect'?30:24;
   ctx.beginPath();
   if(typeof ctx.roundRect==='function')ctx.roundRect(p.x-rw/2,p.y-12,rw,24,8);else ctx.rect(p.x-rw/2,p.y-12,rw,24);
   ctx.fill();
   ctx.fillStyle='#fff';ctx.font='11px sans-serif';ctx.textAlign='center';ctx.fillText(p.n.hit?'✓':(p.n.miss?'×':'♪'),p.x,p.y+4);
  }
  /* 当前歌词 */
  var cur='';for(var i=0;i<S.notes.length;i++){if(S.notes[i].t<=t)cur=S.notes[i].text;}
  ctx.fillStyle='#ffe9a8';ctx.font='bold 18px sans-serif';ctx.textAlign='center';ctx.fillText(cur||'（前奏）',W/2,H-16);
  var lc=document.getElementById('kzLyricNow');if(lc)lc.textContent=cur;
 }
 function finish(){
  if(!S||S.done)return;S.done=true;
  if(S.raf)cancelAnimationFrame(S.raf);
  update();
  var n=S.notes.length;
  var total=Math.round((40+ (S.perfect/n)*58+(S.good/n)*12));
  var sc=Math.round((
   (40+(S.perfect/n)*58+(S.good/n)*12)+
   (42+(S.perfect/n)*56+(S.good/n)*16)+
   (38+(S.perfect/n)*60+(S.good/n)*10)+
   (44+(S.perfect/n)*52+(S.good/n)*16)+
   (40+(S.perfect/n)*56+(S.good/n)*12))/5);
  var grade='D',color='#94a3b8';
  var rate=(S.perfect+S.good)/Math.max(1,n);
  if(rate>=0.95){grade='S';color='#ffd166';}else if(rate>=0.85){grade='A';color='#6ee7b7';}else if(rate>=0.65){grade='B';color='#7aa8ff';}else if(rate>=0.4){grade='C';color='#ffb020';}
  var st=document.getElementById('karaoke-status');
  if(st)st.innerHTML='🏁 演唱结束！评级 <b style="color:'+color+';font-size:22px">'+grade+'</b> · 总分 <b>'+sc+'</b><br>Perfect '+S.perfect+' / Good '+S.good+' / Miss '+S.miss+' · 最高连击 '+S.max;
  var lc=document.getElementById('karaoke-lyrics');if(lc)lc.innerHTML='';
  var wrap=document.getElementById('kzGame');if(wrap)wrap.style.display='none';
  document.getElementById('karaoke-controls').style.display='block';
  try{if(K.scoring)K.scoring.total=sc;}catch(e){}
  try{P().toast('演唱完成：'+grade+' 级 '+sc+'分','success');}catch(e){}
 }
 function stop(manual){
  if(S&&!S.done){S.done=true;if(S.raf)cancelAnimationFrame(S.raf);}
  if(K.animationFrame)cancelAnimationFrame(K.animationFrame);
  K.isPlaying=false;
  var wrap=document.getElementById('kzGame');if(wrap)wrap.style.display='none';
  var c=document.getElementById('karaoke-controls');if(c)c.style.display='block';
  var st=document.getElementById('karaoke-status');if(st)st.textContent='已停止演唱。';
 }
 /* 安装 */
 K.startKaraoke=start;
 K.gameLoop=function(){start();};
 K.stopKaraoke=function(){stop(true);};
 K.endKaraoke=function(){finish();};
 /* 隐藏旧的自动评分（防止它再把分顶满） */
 if(K.updateScoring)K.updateScoring=function(){};
 ready(function(){ensureGame();wireSongList();});
 setInterval(function(){var pk=document.getElementById('panel-karaoke');if(pk&&pk.classList.contains('active')){ensureGame();wireSongList();}},1200);
 /* 静态歌曲列表没有绑定点击（点歌无反应）→ 容器委托按子节点顺序选歌 */
 function wireSongList(){
  var sl=document.getElementById('karaoke-song-list');
  if(!sl||sl.__xzDel)return;sl.__xzDel=1;
  sl.addEventListener('click',function(e){
   var d=e.target;while(d&&d.parentNode!==sl)d=d.parentNode;
   if(!d||!K.songs)return;
   var idx=Array.prototype.indexOf.call(sl.children,d);
   if(idx>=0&&K.songs[idx]){try{K.selectSong(K.songs[idx]);}catch(err){}}
  });
 }
}

/* ================================================================
   ⑤ 跳一跳：全屏 + 等比适配 + 灵敏度/蓄力 中高低显式开关
   ================================================================ */
function hookJump(){
 if(typeof jumpJump!=='function'||window.__XZ_JJ558)return;window.__XZ_JJ558=true;
 var _jj=window.jumpJump;
 if(!window.JJ_SETTINGS){
  var saved={};try{saved=JSON.parse(localStorage.getItem('jj_settings')||'{}');}catch(e){}
  window.JJ_SETTINGS={sens:saved.sens||'m',power:saved.power||'m'};
 }
 window.jumpJump=function(){
  var r=_jj.apply(this,arguments);
  function fitJJ(){
   var cv=document.getElementById('jjCanvas');
   var box=document.getElementById('modalbox');
   if(!cv||!box)return;
   var full=box.classList.contains('xz-jj-full');
   var availW=box.clientWidth-(full?24:36);
   var availH=window.innerHeight-(full?230:270);
   var ratio=420/640,w=availW,h=w/ratio;
   if(h>availH){h=availH;w=h*ratio;}
   if(w<160){w=160;h=w/ratio;}
   var par=cv.parentElement;if(par){par.style.height='auto';par.style.maxHeight='none';}
   cv.style.setProperty('width',Math.floor(w)+'px','important');
   cv.style.setProperty('height',Math.floor(h)+'px','important');
   cv.style.setProperty('max-width','none','important');
   cv.style.setProperty('max-height','none','important');
   cv.style.setProperty('aspect-ratio','auto','important');
   cv.style.display='block';cv.style.margin='0 auto';cv.style.touchAction='none';
  }
  window.__xzFitJJ=fitJJ;
  setTimeout(function(){
   var cv=document.getElementById('jjCanvas');
   var box=document.getElementById('modalbox');
   if(!cv||!box)return;
   fitJJ();
   if(!window.__xzJJResize){window.__xzJJResize=true;
    window.addEventListener('resize',function(){setTimeout(function(){try{window.__xzFitJJ&&window.__xzFitJJ();}catch(e){}},60);});
    window.addEventListener('orientationchange',function(){setTimeout(function(){try{window.__xzFitJJ&&window.__xzFitJJ();}catch(e){}},120);});
   }
   if(!box.querySelector('.jj-sens')){
    var bar=document.createElement('div');bar.className='jj-sens';
    bar.innerHTML=
     '<div style="flex:1"><div class="dim small" style="text-align:center">🧭 灵敏度</div><div class="jj-sens" id="jjSens">'+
      ['l','m','h'].map(function(v){return '<button data-v="'+v+'">'+({l:'低',m:'中',h:'高'})[v]+'</button>';}).join('')+'</div></div>'+
     '<div style="flex:1"><div class="dim small" style="text-align:center">💪 蓄力</div><div class="jj-sens" id="jjPower">'+
      ['l','m','h'].map(function(v){return '<button data-v="'+v+'">'+({l:'低',m:'中',h:'高'})[v]+'</button>';}).join('')+'</div></div>';
    cv.parentNode.insertBefore(bar,cv);
    var fs=document.createElement('button');fs.className='gbtn';fs.style.cssText='width:100%;max-width:460px;margin:8px auto 0;display:block;background:#334155;color:#fff;border:none';
    fs.textContent='⛶ 全屏 / 竖屏适配';
    fs.onclick=function(){
      box.classList.toggle('xz-jj-full');
      var on=box.classList.contains('xz-jj-full');
      if(on){box.style.cssText='position:fixed;inset:0;width:100vw;max-width:100vw;height:100dvh;max-height:100dvh;border-radius:0;padding:12px;overflow-y:auto;z-index:2000';}
      else{box.style.cssText='';}
      setTimeout(fitJJ,30);
    };
    cv.parentNode.insertBefore(fs,bar.nextSibling);
    function bind(groupId,key){
      var grp=document.getElementById(groupId);if(!grp)return;
      var btns=grp.querySelectorAll('button');
      function refresh(){btns.forEach(function(b){b.classList.toggle('on',b.dataset.v===window.JJ_SETTINGS[key]);});}
      btns.forEach(function(b){b.onclick=function(){window.JJ_SETTINGS[key]=b.dataset.v;
        try{localStorage.setItem('jj_settings',JSON.stringify(window.JJ_SETTINGS));}catch(e){}refresh();};});
      refresh();
    }
    bind('jjSens','sens');bind('jjPower','power');
    setTimeout(fitJJ,120);
   }
  },30);
  return r;
 };
}

/* ================================================================
   ⑥ 返回主菜单（带确认）
   ================================================================ */
function addBackToMenu(){
 if(!window.xzBackToMenu){
  window.xzBackToMenu=function(){
   modal('<h3>🏠 返回主菜单</h3><div class="quote">确定要回到主菜单吗？<br>当前进度已自动保存，可从主菜单“继续游戏”进入。</div>'+
    '<button class="gbtn" style="background:#ff6b6b" onclick="xzDoBack()">确认返回</button>'+
    '<button class="gbtn" onclick="closeModal()">继续游玩</button>');
  };
  window.xzDoBack=function(){
   try{closeModal();}catch(e){}
   try{if(typeof PATCH!=='undefined'&&PATCH&&PATCH.closePanel)PATCH.closePanel();}catch(e){}
   try{if(typeof saveGame==='function')saveGame();}catch(e){}
   try{if(typeof AUTO!=='undefined'&&AUTO&&typeof toggleAuto==='function')toggleAuto();}catch(e){}
   try{if(typeof backToHero==='function')backToHero();}catch(e){}
  };
 }
 /* 顶部入口（容器可能由精力胶囊稍后创建，故每次重试） */
 var host=document.getElementById('xzTopActions');
 if(host&&!document.getElementById('xzBackBtn')){
  var b=document.createElement('button');b.className='mini';b.id='xzBackBtn';b.textContent='🏠 主菜单';
  b.onclick=function(){window.xzBackToMenu();};
  host.appendChild(b);
 }
}

/* ================================================================
   ⑦ 光标安全：仅在输入框里显示文字光标，杜绝乱闪“|”
   ================================================================ */
function cursorSafety(){
 var s=document.createElement('style');s.id='xz-cursor-558';
 s.textContent='body{caret-color:transparent}input,textarea,[contenteditable="true"]{caret-color:var(--acc,#6c8cff)!important}'+
  '#kzCanvas,#jjCanvas,#wmCanvas,#gmCanvas,#wbCanvas{caret-color:transparent!important}';
 document.head.appendChild(s);
}

/* ================================================================
   初始化
   ================================================================ */
function boot(){
 try{fixTests();}catch(e){}
 try{fixWeather();}catch(e){}
 try{cursorSafety();}catch(e){}
 try{enInit(false);}catch(e){}
 try{hookTimeSlot();}catch(e){}
 try{hookMenu();}catch(e){}
 try{hookNewDay();}catch(e){}
 try{hookKaraoke();}catch(e){}
 try{hookJump();}catch(e){}
 try{addBackToMenu();}catch(e){}
 try{addEnergyPill();}catch(e){}
 try{enRefreshUI();}catch(e){}
}
ready(boot);
[300,1000,2200,4000].forEach(function(d){setTimeout(function(){
 try{fixTests();hookKaraoke();hookJump();hookTimeSlot();hookMenu();addBackToMenu();addEnergyPill();enInit(false);enRefreshUI();}catch(e){}
},d);});
/* 周期性保证精力 UI 与每日重置 */
setInterval(function(){try{if(window.G&&window.G.idx!==undefined){enResetDaily();enRefreshUI();addEnergyPill();addBackToMenu();}}catch(e){}},2000);
})();

/* ================================================================
   杭州西子实验学校模拟器 · 5.5.8 主补丁 (B) 新功能
   高考模拟+赋分+大学录取 / 生理期 / 邮件(课堂测试邀请) /
   开发者的一封信 / 6.0 预告 / SVG 学校搭建动画
   ================================================================ */
(function(){
'use strict';
if(window.__XZ558_B)return;window.__XZ558_B=true;
function ready(f){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',f);else setTimeout(f,0);}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* ================================================================
   高考模拟题库（真实高考风格 · 选择自动判分 · 大题对照要点自评）
   ================================================================ */
var SUB={
 yw:{n:'语文',full:150,core:true},
 sx:{n:'数学',full:150,core:true},
 yy:{n:'英语',full:150,core:true},
 wl:{n:'物理',full:100},hx:{n:'化学',full:100},sw:{n:'生物',full:100},
 zz:{n:'思想政治',full:100},ls:{n:'历史',full:100},dl:{n:'地理',full:100},js:{n:'技术',full:100}
};
var MC={
yw:[
 {q:'下列词语中，没有错别字的一项是',o:['装钉 提纲 甘拜下风','装帧 提炼 针砭时弊','渲泄 精萃 迫不及待','脉博 寒暄 一诺千斤'],a:1},
 {q:'“无边落木萧萧下，不尽长江滚滚来”的作者是',o:['李白','杜甫','王维','白居易'],a:1},
 {q:'下列句子中没有语病的一项是',o:['通过这次活动，使我明白了团结的道理','能否刻苦学习，是取得好成绩的关键之一','我们要防止这类事故不再发生','老师耐心地纠正并指出了我作文中的错误'],a:1},
 {q:'《红楼梦》中，"心较比干多一窍，病如西子胜三分"描写的是',o:['薛宝钗','林黛玉','王熙凤','史湘云'],a:1},
 {q:'"先天下之忧而忧，后天下之乐而乐"出自',o:['《醉翁亭记》','《岳阳楼记》','《小石潭记》','《赤壁赋》'],a:1},
 {q:'下列加点成语使用正确的是',o:['他做事总是首鼠两端，很有魄力','这篇文章观点鲜明，论证有力，不刊之论','他成了这场比赛的始作俑者，值得表扬','两位老同学萍水相逢，相谈甚欢'],a:1},
 {q:'鲁迅小说《祝福》的主人公是',o:['祥林嫂','子君','阿Q','孔乙己'],a:0},
 {q:'"春风又绿江南岸"中"绿"字的活用方式是',o:['名词作动词','形容词作动词（使动）','动词作名词','形容词作名词'],a:1}
],
sx:[
 {q:'已知集合 A={1,2,3}，B={2,3,4}，则 A∩B=',o:['{1,2}','{2,3}','{3,4}','{1,4}'],a:1},
 {q:'函数 f(x)=x²-2x+3 的最小值为',o:['1','2','3','4'],a:1},
 {q:'sin30°+cos60° 的值为',o:['0.5','1','√3/2','√2'],a:1},
 {q:'等差数列 2,5,8,… 的第 10 项是',o:['27','29','31','33'],a:2},
 {q:'向量 a=(1,2)，b=(2,1)，则 a·b=',o:['3','4','5','6'],a:1},
 {q:'若 log₂(x)=3，则 x=',o:['6','8','9','16'],a:1},
 {q:'曲线 y=x³ 在 x=1 处的切线斜率为',o:['1','2','3','0'],a:2},
 {q:'从 5 人中选 3 人参加比赛，不同选法有',o:['10 种','20 种','60 种','125 种'],a:0},
 {q:'（压轴）函数 f(x)=eˣ−x 的单调递减区间为',o:['(−∞,0)','(0,+∞)','(−∞,1)','(−1,+∞)'],a:0},
 {q:'（压轴）双曲线 x²/4−y²=1 的渐近线为',o:['y=±x/2','y=±2x','y=±x','y=±4x'],a:0}
],
yy:[
 {q:'Choose the correct word: She ___ to school every day.',o:['go','goes','going','gone'],a:1},
 {q:'"I have ___ finished my homework."',o:['already','yet','ever','still'],a:0},
 {q:'The comparative form of "good" is',o:['gooder','more good','better','best'],a:2},
 {q:'He asked me where I ___.',o:['live','lived','living','lives'],a:1},
 {q:'Which is a synonym of "happy"?',o:['sad','joyful','angry','tired'],a:1},
 {q:'"If it ___ tomorrow, we will stay home."',o:['rain','rains','will rain','rained'],a:1},
 {q:'The passive voice of "They built the house" is',o:['The house built','The house was built','The house is build','The house has build'],a:1},
 {q:'Choose the correct article: She is ___ honest girl.',o:['a','an','the','/'],a:1}
],
wl:[
 {q:'牛顿第二定律的表达式是',o:['F=ma','F=mv','E=mc²','p=ρgh'],a:0},
 {q:'真空中的光速约为',o:['3×10⁶ m/s','3×10⁸ m/s','3×10¹⁰ m/s','340 m/s'],a:1},
 {q:'物体做匀速圆周运动时，下列说法正确的是',o:['合力为零','速度方向不变','合力指向圆心','加速度为零'],a:2},
 {q:'动能的表达式是',o:['mgh','½mv²','mv','Fs'],a:1},
 {q:'两电阻 2Ω 与 3Ω 串联，总电阻为',o:['1.2Ω','5Ω','6Ω','2.5Ω'],a:1},
 {q:'（压轴）带电粒子垂直进入匀强磁场，其运动轨迹为',o:['直线','抛物线','圆','椭圆'],a:2}
],
hx:[
 {q:'下列物质属于纯净物的是',o:['空气','盐酸','蒸馏水','海水'],a:2},
 {q:'水的化学式是',o:['CO₂','H₂O','O₂','NaCl'],a:1},
 {q:'钠在氯气中燃烧的产物是',o:['NaCl','Na₂O','HCl','NaOH'],a:0},
 {q:'标准状况下，1 mol 气体的体积约为',o:['11.2 L','22.4 L','33.6 L','44.8 L'],a:1},
 {q:'下列反应属于氧化还原反应的是',o:['NaOH+HCl','CaCO₃ 高温分解','Zn+CuSO₄','CaO+H₂O'],a:2},
 {q:'（压轴）某元素原子最外层电子排布为 2s²2p⁴，它是',o:['碳','氮','氧','氟'],a:2}
],
sw:[
 {q:'细胞进行有氧呼吸的主要场所是',o:['叶绿体','线粒体','细胞核','核糖体'],a:1},
 {q:'DNA 分子的基本单位是',o:['氨基酸','脱氧核苷酸','葡萄糖','脂肪酸'],a:1},
 {q:'光合作用释放的氧气来自',o:['CO₂','H₂O','葡萄糖','O₂'],a:1},
 {q:'人的体细胞中含有的染色体数是',o:['23 条','46 条','44 条','48 条'],a:1},
 {q:'酶的化学本质绝大多数是',o:['糖类','蛋白质','脂质','核酸'],a:1},
 {q:'（压轴）在减数分裂中，同源染色体分离发生在',o:['减数第一次分裂后期','减数第二次分裂后期','间期','末期'],a:0}
],
zz:[
 {q:'我国的根本政治制度是',o:['多党合作制度','人民代表大会制度','民族区域自治制度','基层群众自治制度'],a:1},
 {q:'商品的价值量由什么决定',o:['个别劳动时间','社会必要劳动时间','供求关系','使用价值'],a:1},
 {q:'唯物主义和唯心主义的根本分歧是',o:['世界是否可知','物质和意识谁是本原','是否承认运动','是否承认真理'],a:1},
 {q:'市场在资源配置中起（ ）作用',o:['基础性','决定性','辅助性','补充性'],a:1},
 {q:'公民最基本的政治权利是',o:['选举权和被选举权','监督权','受教育权','劳动权'],a:0},
 {q:'（压轴）价值规律的表现形式是',o:['价格等于价值','价格围绕价值上下波动','价格始终不变','价值由价格决定'],a:1}
],
ls:[
 {q:'我国历史上第一个统一的多民族封建国家是',o:['夏朝','商朝','秦朝','汉朝'],a:2},
 {q:'"贞观之治"出现于哪位皇帝在位时期',o:['唐高祖','唐太宗','武则天','唐玄宗'],a:1},
 {q:'辛亥革命爆发于',o:['1898 年','1911 年','1919 年','1921 年'],a:1},
 {q:'《史记》的作者是',o:['班固','司马迁','陈寿','司马光'],a:1},
 {q:'新航路开辟中，首次到达印度的航海家是',o:['哥伦布','麦哲伦','达·伽马','迪亚士'],a:2},
 {q:'（压轴）标志着中国近代史开端的是',o:['鸦片战争','甲午战争','戊戌变法','洋务运动'],a:0}
],
dl:[
 {q:'地球公转一周的时间约为',o:['24 小时','一个月','一年','一个季度'],a:2},
 {q:'世界上面积最大的大洋是',o:['大西洋','印度洋','北冰洋','太平洋'],a:3},
 {q:'形成"一山有四季，十里不同天"的主要因素是',o:['纬度','海陆位置','地形（垂直地带性）','洋流'],a:2},
 {q:'我国降水的空间分布特点是',o:['东多西少，南多北少','均匀分布','西多东少','北多南少'],a:0},
 {q:'冷锋过境时通常出现',o:['连续性阴雨','大风、降温、雨雪','升温晴朗','雾霾'],a:1},
 {q:'（压轴）北印度洋季风洋流，夏季的流向是',o:['自东向西','自西向东（顺时针）','不流动','由南向北'],a:1}
],
js:[
 {q:'在 Python 中，输出内容使用的函数是',o:['echo()','print()','console.log()','out()'],a:1},
 {q:'二进制 1010 转换为十进制是',o:['8','10','12','14'],a:1},
 {q:'算法的三种基本结构是顺序、选择和',o:['循环','递归','分支','嵌套'],a:0},
 {q:'IP 地址 192.168.1.1 属于',o:['A 类','B 类','C 类','D 类'],a:2},
 {q:'数据库中用于查询数据的语句是',o:['INSERT','SELECT','DELETE','UPDATE'],a:1},
 {q:'（压轴）对 n 个数据进行二分查找，最坏情况下比较次数约为',o:['n','n/2','log₂n','n²'],a:2}
]
};
/* 大题（对照要点自评，每个要点若干分） */
var WR={
 yw:{q:'阅读下面的文字，结合《登高》全诗，分析"万里悲秋常作客"一句中"悲"的丰富情感层次。（12分）',
  pts:[['点出"悲秋"的时令感伤（秋景萧瑟）',2],['"常作客"写出长期漂泊、羁旅之愁',3],['万里写空间之远，联系身世孤苦',2],['与"百年多病独登台"呼应，含年老多病之叹',3],['联系国运/身世，沉郁顿挫的总体风格',2]]},
 sx:{q:'（压轴）已知函数 f(x)=x³−3x。(1)求 f(x) 的单调区间；(2)求 f(x) 在区间 [−2,2] 上的最大值与最小值。（12分）',
  pts:[['正确求导 f′(x)=3x²−3',3],['由 f′(x)=0 得 x=±1，正确判断单调性',4],['算出端点与极值 f(−2)=−2,f(−1)=2,f(1)=−2,f(2)=2',3],['结论：最大值 2，最小值 −2',2]]},
 yy:{q:'书面表达：以"My School Life"为题写一篇 80 词左右的短文，包含学习、朋友与课外活动。（15分）',
  pts:[['内容完整（学习、朋友、活动三要素齐全）',6],['时态、主谓一致基本正确',4],['使用高级词汇/连接词（如 besides, what\'s more）',3],['字数达标、书写与连贯性',2]]}
};
/* 赋分表（3+3 等级赋分 40-100，按原始分占比折算等级） */
function assignScore(raw,full){
 var p=full?raw/full:0;
 var bands=[[.86,1,.86,100],[.72,.86,.71,85],[.58,.72,.56,70],[.40,.58,.41,55],[0,.40,40,40]];
 for(var i=0;i<bands.length;i++){var b=bands[i];
  if(p>=b[0]&&p<=b[1]){
   var lo=b[0],hi=b[1],slo=b[2],shi=b[3];
   if(hi===lo)return Math.round(shi);
   var v=slo+(p-lo)/(hi-lo)*(shi-slo);
   return Math.round(Math.max(40,Math.min(100,v)));
  }
 }
 return 40;
}
/* 大学库（浙江为主 + 全国名校），按录取最低分（满分750参考） */
var UNI=[
 {n:'清华大学',t:'985·C9',s:700,tags:['理工','综合']},{n:'北京大学',t:'985·C9',s:698,tags:['文理','综合']},
 {n:'复旦大学',t:'985·C9',s:685,tags:['综合']},{n:'上海交通大学',t:'985·C9',s:684,tags:['理工']},
 {n:'浙江大学',t:'985·C9',s:663,tags:['综合','浙江']},{n:'中国科学技术大学',t:'985·C9',s:672,tags:['理工']},
 {n:'南京大学',t:'985',s:660,tags:['综合']},{n:'中国人民大学',t:'985',s:662,tags:['文理']},
 {n:'北京航空航天大学',t:'985',s:655,tags:['理工']},{n:'同济大学',t:'985',s:648,tags:['理工']},
 {n:'哈尔滨工业大学(深圳)',t:'985',s:645,tags:['理工']},{n:'武汉大学',t:'985',s:643,tags:['综合']},
 {n:'华东师范大学',t:'985',s:638,tags:['师范']},{n:'电子科技大学',t:'985',s:640,tags:['理工']},
 {n:'宁波诺丁汉大学',t:'中外合作',s:610,tags:['浙江','国际']},{n:'西交利物浦大学',t:'中外合作',s:600,tags:['国际']},
 {n:'浙江工业大学',t:'省重点',s:590,tags:['理工','浙江']},{n:'杭州电子科技大学',t:'省重点',s:585,tags:['理工','浙江']},
 {n:'浙江师范大学',t:'省重点',s:582,tags:['师范','浙江']},{n:'宁波大学',t:'双一流',s:588,tags:['综合','浙江']},
 {n:'浙江财经大学',t:'省重点',s:580,tags:['财经','浙江']},{n:'浙江理工大学',t:'省重点',s:568,tags:['理工','浙江']},
 {n:'杭州师范大学',t:'省重点',s:565,tags:['师范','浙江']},{n:'温州医科大学',t:'省重点',s:575,tags:['医学','浙江']},
 {n:'浙江中医药大学',t:'省重点',s:560,tags:['医学','浙江']},{n:'中国计量大学',t:'省重点',s:558,tags:['理工','浙江']},
 {n:'浙江农林大学',t:'省重点',s:548,tags:['农林','浙江']},{n:'浙江科技大学',t:'公办本科',s:540,tags:['理工','浙江']},
 {n:'浙大城市学院',t:'公办本科',s:545,tags:['综合','浙江']},{n:'浙江传媒学院',t:'公办本科',s:548,tags:['艺术传媒','浙江']},
 {n:'温州大学',t:'公办本科',s:552,tags:['综合','浙江']},{n:'浙江外国语学院',t:'公办本科',s:545,tags:['语言','浙江']},
 {n:'嘉兴学院',t:'公办本科',s:525,tags:['综合','浙江']},{n:'绍兴文理学院',t:'公办本科',s:522,tags:['综合','浙江']},
 {n:'浙江水利水电学院',t:'公办本科',s:515,tags:['理工','浙江']},{n:'台州学院',t:'公办本科',s:512,tags:['综合','浙江']},
 {n:'丽水学院',t:'公办本科',s:500,tags:['综合','浙江']},{n:'宁波工程学院',t:'公办本科',s:510,tags:['理工','浙江']},
 {n:'独立学院/民办本科',t:'民办本科',s:470,tags:['本科']},{n:'优质高职专科',t:'专科',s:380,tags:['专科']}
];
/* 高考模拟状态 */
function gkIntro(){
 var h='<h3>🎓 高考模拟 · 等级赋分版</h3>'+
  '<div class="quote">采用"3+3"模式：<b>语文、数学、英语</b>各 150 分（原始分）；从 <b>物理/化学/生物/政治/历史/地理/技术</b> 中选 <b>3 门</b>选考，每门 100 分并按等级赋分。满分 750。<br>选择题自动判分；大题写完后对照评分要点<b>自评</b>；含各科压轴题，用于判断真实水平。</div>'+
  '<div class="xz-grid c2">'+
  '<button class="xz-bigbtn blue" onclick="gkStart(false)">📝 完整高考模拟（全科）</button>'+
  '<button class="xz-bigbtn gold" onclick="gkStart(true)">⚡ 快速摸底（10题·限时5分钟）</button></div>'+
  '<div class="dim small" style="margin-top:8px">提示：完整模拟含大题与赋分，结束后按总分推荐可报考的大学（含浙江本地院校）。</div>';
 modal(h);
}
window.gkIntro=gkIntro;
window.gkStart=function(quick){
 var st={quick:!!quick,electives:[],raw:{},assigned:{},subjects:[],i:0,qi:0,score:0,written:{},deadline:0,answers:{}};
 window._gk=st;
 if(quick){
  st.subjects=['yw','sx','yy'];
  var pool=[];['yw','sx','yy'].forEach(function(k){MC[k].forEach(function(q){pool.push({k:k,q:q});});});
  /* 随机抽 10 题，含两道压轴 */
  var hard=pool.filter(function(x){return /压轴/.test(x.q.q);}).sort(function(){return Math.random()-.5;}).slice(0,2);
  var easy=pool.filter(function(x){return /压轴/.test(x.q.q)===false;}).sort(function(){return Math.random()-.5;}).slice(0,8);
  st.qs=hard.concat(easy).sort(function(){return Math.random()-.5;});
  st.deadline=Date.now()+5*60*1000;
  st.mode='quick';
  gkAsk();
 }else{
  gkPickElectives();
 }
};
function gkPickElectives(){
 var keys=['wl','hx','sw','zz','ls','dl','js'];
 var h='<h3>① 选择你的 3 门选考科目</h3><div class="quote">已选 <b id="gkCnt">0</b> / 3（点选/取消）</div><div class="xz-grid c3">';
 keys.forEach(function(k){
  h+='<button class="xz-choice" data-k="'+k+'" onclick="gkToggle(this)" style="text-align:center">'+SUB[k].n+'</button>';
 });
 h+='</div><button class="xz-bigbtn blue" id="gkNext" onclick="gkConfirmElectives()" disabled>下一步：开始答题</button>';
 modal(h);
}
window.gkToggle=function(btn){
 var st=window._gk,k=btn.dataset.k;
 var on=btn.classList.toggle('xz-sel');
 if(on){if(st.electives.length>=3){btn.classList.remove('xz-sel');return;}if(st.electives.indexOf(k)<0)st.electives.push(k);}
 else{st.electives=st.electives.filter(function(x){return x!==k;});}
 var cnt=st.electives.length;document.getElementById('gkCnt').textContent=cnt;
 document.getElementById('gkNext').disabled=(cnt!==3);
};
window.gkConfirmElectives=function(){
 var st=window._gk;st.subjects=['yw','sx','yy'].concat(st.electives);
 st.i=0;gkSubject();
};
function gkSubject(){
 var st=window._gk,k=st.subjects[st.i];
 if(!k){gkDone();return;}
 st.curK=k;st.qi=0;
 var h='<h3>📝 '+SUB[k].n+'（'+(SUB[k].core?'原始分':'选考·赋分')+' 满分'+SUB[k].full+'）</h3>';
 h+='<div class="quote">选择题部分（共 '+MC[k].length+' 题）</div><div id="gkBody"></div>';
 modal(h);
 gkAsk();
}
function gkAsk(){
 var st=window._gk;
 if(st.mode==='quick'){
  if(Date.now()>st.deadline){gkDone();return;}
  if(st.qi>=st.qs.length){gkDone();return;}
  var item=st.qs[st.qi],q=item.q;
  var left=Math.max(0,Math.round((st.deadline-Date.now())/1000));
  var h='<h3>⚡ 快速摸底 <span class="dim small">（'+(st.qi+1)+'/'+st.qs.length+' · 剩 '+left+' 秒）</span></h3>';
  h+='<div class="xz-card"><b>'+SUB[item.k].n+'：</b>'+esc(q.q)+'</div>';
  q.o.forEach(function(o,i){h+='<button class="xz-choice" onclick="gkQuickAns('+i+')">'+String.fromCharCode(65+i)+'. '+esc(o)+'</button>';});
  modal(h);
  return;
 }
 /* 完整模式：当前科目选择题 */
 var k=st.curK,arr=MC[k];
 if(st.qi<arr.length){
  var q=arr[st.qi];
  var h='<h3>'+SUB[k].n+' · 选择题 <span class="dim small">（'+(st.qi+1)+'/'+arr.length+'）</span></h3>';
  h+='<div class="xz-card">'+esc(q.q)+'</div>';
  q.o.forEach(function(o,i){h+='<button class="xz-choice" onclick="gkAns('+i+')">'+String.fromCharCode(65+i)+'. '+esc(o)+'</button>';});
  modal(h);
 }else{
  /* 进入大题 */
  gkWritten();
 }
}
window.gkQuickAns=function(i){
 var st=window._gk,item=st.qs[st.qi];
 st.score=st.score||0;
 if(i===item.q.a)st.score++;
 st.qi++;gkAsk();
};
window.gkAns=function(i){
 var st=window._gk,k=st.curK,q=MC[k][st.qi];
 st.raw[k]=st.raw[k]||{right:0,n:0};
 st.raw[k].n++;
 if(i===q.a)st.raw[k].right++;
 st.qi++;gkAsk();
};
function gkWritten(){
 var st=window._gk,k=st.curK;
 if(WR[k]){
  var w=WR[k];
  var h='<h3>'+SUB[k].n+' · 大题（自评 '+w.pts.length+' 个要点）</h3>'+
   '<div class="xz-card">'+esc(w.q)+'</div>'+
   '<textarea class="xz-write" id="gkEssay" placeholder="在这里写下你的答案（写完后对照下面要点自评）…"></textarea>'+
   '<h4>对照评分要点，你做到的就勾选：</h4>';
  w.pts.forEach(function(p,i){h+='<label class="xz-choice" style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" data-p="'+i+'"> <span>'+esc(p[0])+'（'+p[1]+'分）</span></label>';});
  h+='<button class="xz-bigbtn blue" onclick="gkWrittenSubmit()">确认并进入下一科</button>';
  modal(h);
 }else{
  gkNextSubject();
 }
}
window.gkWrittenSubmit=function(){
 var st=window._gk,k=st.curK,w=WR[k],got=0;
 document.querySelectorAll('#modalbox input[data-p]').forEach(function(cb){if(cb.checked)got+=w.pts[parseInt(cb.dataset.p,10)][1];});
 st.written[k]=got;
 gkNextSubject();
};
function gkNextSubject(){
 var st=window._gk;st.i++;
 if(st.i>=st.subjects.length){gkDone();}else{gkSubject();}
}
function gkDone(){
 var st=window._gk;
 if(st.mode==='quick'){
  var total=st.qs.length,sc=st.score||0,pct=sc/total;
  var level=pct>=.9?'顶尖水平（冲刺 C9/985）':pct>=.75?'优秀水平（985/211 可期）':pct>=.55?'中等偏上（省重点/公办本科）':pct>=.35?'一般（普通本科）':'基础薄弱（建议系统复习）';
  var left=Math.max(0,Math.round((st.deadline-Date.now())/1000));
  modal('<h3>⚡ 快速摸底结果</h3><div class="xz-card" style="text-align:center;font-size:18px">答对 <b style="color:#ff8a00;font-size:30px">'+sc+'</b> / '+total+'<br><span class="dim small">剩余 '+left+' 秒</span></div>'+
   '<div class="quote">水平判断：<b>'+level+'</b><br>这是限时 10 题（含压轴）的摸底，完整模拟可获得赋分总分与大学推荐。</div>'+
   '<button class="xz-bigbtn blue" onclick="gkIntro()">再测一次</button><button class="gbtn" onclick="closeModal()">关闭</button>');
  return;
 }
 /* 完整模式算分 */
 var total=0,detail='';
 var core=0,elec=0;
 st.subjects.forEach(function(k){
  var r=st.raw[k]||{right:0,n:0};
  var full=SUB[k].full;
  var mcEach=SUB[k].core?3:4;
  var mcScore=r.right*mcEach;
  var essay=st.written[k]||0;
  var raw=Math.min(full,mcScore+essay);
  if(SUB[k].core){
   core+=raw;
   detail+='<div class="xz-uni"><span>'+SUB[k].n+'（原始分）</span><b>'+raw+' / '+full+'</b></div>';
  }else{
   var as=assignScore(raw,full);
   elec+=as;
   detail+='<div class="xz-uni"><span>'+SUB[k].n+'（原始 '+raw+' → 赋分）</span><b>'+as+' / 100</b></div>';
  }
 });
 total=core+elec;
 /* 可上大学（按总分推荐） */
 var admits=UNI.filter(function(u){return total>=u.s-8;}).sort(function(a,b){return b.s-a.s;}).slice(0,8);
 var reach=UNI.filter(function(u){return total>=u.s-25&&total<u.s-8;}).sort(function(a,b){return b.s-a.s;}).slice(0,4);
 var uh='';
 if(admits.length){uh+='<h4>✅ 较有把握的大学（按 '+total+' 分）</h4>';admits.forEach(function(u){uh+='<div class="xz-uni admit"><span>'+u.n+' <span class="dim small">'+u.t+'</span></span><span class="xz-tag">'+(u.tags.join('·'))+'</span></div>';});}
 if(reach.length){uh+='<h4>🎯 冲一冲（再努力 +'+(reach[0].s-total+8)+' 分左右）</h4>';reach.forEach(function(u){uh+='<div class="xz-uni"><span>'+u.n+' <span class="dim small">'+u.t+'</span></span><span class="xz-tag">线约 '+u.s+'</span></div>';});}
 if(!admits.length&&!reach.length){uh='<div class="quote">继续努力，提升文化课成绩，本科线（约 470 分）在向你招手！</div>';}
 var libArts=st.electives.some(function(k){return k==='zz'||k==='ls'||k==='dl';});
 modal('<h3>🎓 高考模拟成绩报告单</h3>'+
  '<div class="xz-card" style="text-align:center">赋分总分 <b style="font-size:38px;color:#ff8a00">'+total+'</b> / 750<br><span class="dim small">语数英 '+core+' 分 · 选考赋分合计 '+elec+' 分 · 选科：'+st.electives.map(function(k){return SUB[k].n;}).join('、')+'</span></div>'+
  '<h4>各科明细</h4>'+detail+
  '<div class="quote">等级赋分按你在选考科目中的相对位次折算到 40–100 分。'+(libArts?'你选了偏文科组合，竞争侧重在记忆与表达；':'你选了偏理科组合，压轴与计算难度更高；')+'成绩每年试题难度不同，本结果为模拟参考。</div>'+
  uh+
  '<button class="xz-bigbtn blue" onclick="gkIntro()">再来一次</button><button class="gbtn" onclick="closeModal()">关闭</button>');
}

/* ================================================================
   生理期系统（真实克制 · 记录 · 预测 · 疼痛 · 心情体力影响）
   ================================================================ */
function periodInit(){
 var g=window.G;if(!g)return;
 if(!g.period){g.period={starts:[],cycle:28,lastLen:5,pain:[],note:''};}
}
function phaseOf(date,pd){
 if(!pd||!pd.starts||!pd.starts.length)return {ph:'未知',day:0};
 var last=new Date(pd.starts[pd.starts.length-1]);
 var d=Math.floor((date-last)/86400000);
 var len=pd.lastLen||5,cyc=pd.cycle||28;
 if(d<0)return {ph:'（日期早于最近一次记录）',day:d};
 if(d<len)return {ph:'经期',day:d+1};
 if(d<len+7)return {ph:'卵泡期',day:d+1};
 if(d<cyc-9)return {ph:'排卵期前后',day:d+1};
 return {ph:'经前（黄体期）',day:d+1};
}
function nextPeriodDate(pd){
 if(!pd||!pd.starts||!pd.starts.length)return null;
 var last=new Date(pd.starts[pd.starts.length-1]);
 return new Date(last.getTime()+(pd.cycle||28)*86400000);
}
function avgPain(pd){if(!pd||!pd.pain||!pd.pain.length)return 1;var s=pd.pain.reduce(function(a,b){return a+b;},0);return s/pd.pain.length;}
window.xzPeriod=function(){
 periodInit();var g=window.G,pd=g.period;
 var today=g.date?new Date(g.date):new Date();
 var ph=phaseOf(today,pd);
 var next=nextPeriodDate(pd);
 var pain=avgPain(pd);
 var painTxt=['基本无痛','轻微不适','明显疼痛（需休息）','较痛（影响活动）'][Math.round(pain)]||'轻微不适';
 var h='<h3>🌸 生理期记录与预测</h3>';
 h+='<div class="xz-card">';
 h+='<b>当前阶段：</b>'+ph.ph+(ph.day>0?'（周期第 '+ph.day+' 天）':'')+'<br>';
 h+='<b>平均周期：</b>'+(pd.cycle||28)+' 天 · <b>平均经期：</b>'+(pd.lastLen||5)+' 天<br>';
 h+='<b>下次预测：</b>'+(next?fmtDate(next):'记录一次开始后可预测')+'<br>';
 h+='<b>近期疼痛参考：</b>'+painTxt+'</div>';
 h+='<div class="xz-grid c2">';
 h+='<button class="xz-bigbtn pink" onclick="xzPeriodStart()">📝 今天来月经了</button>';
 h+='<button class="xz-bigbtn gray" onclick="xzPeriodEnd()">✅ 今天结束了</button></div>';
 h+='<h4>本次疼痛程度（记录后用于预测）</h4><div class="xz-grid c3">';
 [[0,'😊 不痛'],[1,'🙂 轻微'],[2,'😣 明显'],[3,'😖 很痛']].forEach(function(a){
  h+='<button class="xz-choice" style="text-align:center" onclick="xzPeriodPain('+a[0]+')">'+a[1]+'</button>';});
 h+='</div>';
 h+='<h4>周期 / 经期设置</h4><div class="xz-grid c2">';
 h+='<label class="xz-choice">平均周期（天）<input type="number" id="pdCycle" value="'+(pd.cycle||28)+'" min="21" max="40" style="width:70px;float:right"></label>';
 h+='<label class="xz-choice">经期天数 <input type="number" id="pdLen" value="'+(pd.lastLen||5)+'" min="2" max="9" style="width:70px;float:right"></label></div>';
 h+='<button class="xz-bigbtn blue" onclick="xzPeriodSave()">保存设置</button>';
 h+='<h4>历史记录</h4><div class="xz-card" style="font-size:14px">';
 if(pd.starts.length){pd.starts.slice(-6).reverse().forEach(function(s){h+='· '+fmtDate(new Date(s))+'<br>';});}
 else h+='暂无记录。点击"今天来月经了"开始记录。';
 h+='</div>';
 h+='<div class="quote" style="font-size:13.5px">经期与经前可能出现腹痛、疲惫、情绪低落，这些天游戏内<b>心情和精力会下降</b>，注意保暖、规律作息、避免剧烈运动；疼痛剧烈或周期长期不规律请告诉家长并就医。</div>';
 h+='<button class="gbtn" onclick="closeModal()">关闭</button>';
 modal(h);
};
function fmtDate(d){return (d.getMonth()+1)+'月'+d.getDate()+'日';}
window.xzPeriodStart=function(){
 periodInit();var g=window.G,pd=g.period;
 var key=g.date?g.date.toDateString():new Date().toDateString();
 if(pd.starts.indexOf(key)<0){pd.starts.push(key);l('🌸 记录：月经来潮，注意休息与保暖。','warn');}
 try{if(typeof l==='function'){} }catch(e){}
 g.mood=Math.max(0,(g.mood||50)-8);
 if(window.XZ_EN&&typeof g.energy==='number')g.energy=Math.max(0,g.energy-20);
 modal('<h3>🌸 已记录</h3><div class="quote">已记录本次月经开始（'+fmtDate(g.date?new Date(g.date):new Date())+'）。<br>预测下次约在 '+(pd.cycle||28)+' 天后。经期会更疲惫、情绪可能波动，已为你降低今天的心情与精力。</div><button class="gbtn" onclick="closeModal()">好的</button>');
};
window.xzPeriodEnd=function(){
 periodInit();var g=window.G,pd=g.period;
 pd.lastLen=Math.max(2,Math.min(9,Math.round((pd.pain?5:5))));
 l('🌸 记录：本次月经结束。','good');
 closeModal();
};
window.xzPeriodPain=function(level){
 periodInit();var g=window.G,pd=g.period;
 pd.pain.push(level);if(pd.pain.length>12)pd.pain.shift();
 var moodPen=level*4,enPen=level*6;
 g.mood=Math.max(0,(g.mood||50)-moodPen/2);
 if(window.XZ_EN&&typeof g.energy==='number')g.energy=Math.max(0,g.energy-enPen/2);
 modal('<h3>🌸 疼痛已记录</h3><div class="quote">疼痛等级 '+level+'，已相应调整今天的心情与精力。多次记录后可更准确预测。<br>明显疼痛时记得热敷、喝温水、减少剧烈运动。</div><button class="gbtn" onclick="xzPeriod()">返回</button>');
};
window.xzPeriodSave=function(){
 periodInit();var g=window.G,pd=g.period;
 var c=parseInt(document.getElementById('pdCycle').value,10),len=parseInt(document.getElementById('pdLen').value,10);
 if(c>=21&&c<=40)pd.cycle=c;if(len>=2&&len<=9)pd.lastLen=len;
 try{if(typeof saveGame==='function')saveGame();}catch(e){}
 modal('<h3>已保存</h3><div class="quote">周期 '+pd.cycle+' 天、经期 '+pd.lastLen+' 天。</div><button class="gbtn" onclick="xzPeriod()">返回</button>');
};
/* 每天检查：经期/经前 自动心情与精力影响 + 提醒邮件 */
function periodDailyHook(){
 var g=window.G;if(!g||!g.period)return;
 var today=g.date?new Date(g.date):new Date();
 var key=today.toDateString();
 if(g._pdKey===key)return;g._pdKey=key;
 var ph=phaseOf(today,g.period);
 if(ph.ph==='经期'){
  g.mood=Math.max(0,(g.mood||50)-4);
  if(window.XZ_EN&&typeof g.energy==='number')g.energy=Math.max(0,g.energy-8);
  if(ph.day===1)l('🌸 今天月经来潮，身体有些疲惫，注意保暖。','warn');
 }else if(ph.ph==='经前（黄体期）'){
  var next=nextPeriodDate(g.period),days=Math.round((next-today)/86400000);
  if(days>=0&&days<=2)l('🌸 月经可能在这两天到来，准备好卫生用品，注意休息。','warn');
 }
}

/* ================================================================
   邮件系统（右上角收件箱 + 课堂测试邀请）
   ================================================================ */
function mailInit(){
 var g=window.G;if(!g)return;
 if(!g.mail){g.mail=[
  {id:'m0',from:'系统',sub:'欢迎来到 5.5.8',body:'新增每日精力、高考模拟、生理期记录、邮件、KTV 音准判定等系统。右上角邮件按钮可随时查看。',read:false,time:''},
  {id:'m1',from:'教务处',sub:'关于高考模拟测评的通知',body:'教务处上线"高考模拟"系统，可在课外或生活菜单进入，含等级赋分与大学推荐，建议认真作答。',read:false,time:''}
 ];}
}
function mailUnread(){var g=window.G;if(!g||!g.mail)return 0;return g.mail.filter(function(m){return !m.read;}).length;}
function mailRefresh(){
 var dot=document.getElementById('xzMailDot');
 if(dot){var u=mailUnread();if(u>0){dot.style.display='inline-block';dot.textContent=u>99?'99+':u;}else dot.style.display='none';}
}
function pushMail(m){
 mailInit();var g=window.G;
 m.id='m'+Date.now()+Math.floor(Math.random()*1000);m.read=false;m.time=m.time||'';
 g.mail.unshift(m);
 if(g.mail.length>40)g.mail=g.mail.slice(0,40);
 mailRefresh();
}
window.xzMail=function(){
 mailInit();var g=window.G;
 var h='<h3>📧 校园邮箱</h3><div class="dim small" style="margin-bottom:6px">共 '+g.mail.length+' 封 · 未读 '+mailUnread()+'</div>';
 g.mail.forEach(function(m,i){
  h+='<div class="xz-mail '+(m.read?'read':'unread')+'" onclick="xzMailOpen('+i+')"><span class="dot"></span><span><b>'+esc(m.from)+'</b>：'+esc(m.sub)+'<br><span class="dim small">'+esc(m.time||'')+'</span></span></div>';
 });
 h+='<button class="gbtn" onclick="closeModal()">关闭</button>';
 modal(h);
 g.mail.forEach(function(m){m.read=true;});
 setTimeout(mailRefresh,200);
};
window.xzMailOpen=function(i){
 mailInit();var g=window.G,m=g.mail[i];if(!m)return;
 m.read=true;
 var h='<h3>'+esc(m.sub)+'</h3><div class="dim small">发件人：'+esc(m.from)+'　'+esc(m.time||'')+'</div><div class="xz-card">'+esc(m.body).replace(/\n/g,'<br>')+'</div>';
 if(m.action==='test'){
  h+='<button class="xz-bigbtn pink" onclick="xzMailDoTest()">🧩 立即做同桌发来的测试</button>';
 }
 h+='<button class="gbtn" onclick="xzMail()">返回邮箱</button>';
 modal(h);mailRefresh();
};
window.xzMailDoTest=function(){
 closeModal();
 try{
  if(typeof PATCH!=='undefined'&&PATCH&&PATCH.openPanel&&PATCH.tests){PATCH.openPanel('tests');setTimeout(function(){try{if(PATCH.tests.startMBTIQuick)PATCH.tests.startMBTIQuick();}catch(e){}},400);}
  else if(typeof xzOpenChat==='function'){}
 }catch(e){}
};
/* 课堂上收到测试邀请（低概率，每天最多一次） */
function maybeClassTestInvite(){
 var g=window.G;if(!g||!g._ts)return;
 if(g._ts.opts&&g._ts.opts.kind!=='class')return;
 var k=(g.date?g.date.toDateString():'')+'_test';
 if(g._testInviteKey===k)return;
 if(Math.random()<0.18){
  g._testInviteKey=k;
  var tests=[['同桌','快来测测你是哪种人格！MBTI 超准','mbti'],['后桌','发你一个恋爱年龄差测试，别告诉老师','love'],['班长','课代表发的霍兰德兴趣测试，看看适合啥专业','holland']];
  var t=tests[Math.floor(Math.random()*tests.length)];
  pushMail({from:t[0],sub:'📨 上课偷偷发来一个测试：'+t[1],body:'嘘——老师在写黑板，点开邮件里的链接，我们比一比谁的结果更离谱。',action:'test'});
  try{if(typeof l==='function')l('📨 上课收到一封邮件：'+t[0]+'发来一个测试邀请。','warn');}catch(e){}
  try{if(PATCH&&PATCH.toast)PATCH.toast('📨 新邮件：'+t[0]+'发来测试','info');}catch(e){}
 }
}
/* 顶栏右上角邮件按钮 */
function addMailButton(){
 var host=(window.xzEnsureTopActions&&window.xzEnsureTopActions())||document.getElementById('xzTopActions');
 if(host&&!document.getElementById('xzMailBtn')){
  var b=document.createElement('button');b.className='mini';b.id='xzMailBtn';b.textContent='📧 邮件';
  b.innerHTML='📧 邮件<span id="xzMailDot"></span>';
  b.onclick=function(){window.xzMail();};
  host.appendChild(b);
 }
 mailRefresh();
}

/* ================================================================
   开发者的一封信
   ================================================================ */
window.xzLetter=function(){
 var h='<h3>💌 开发者的一封信</h3>'+
 '<div class="xz-card" style="line-height:1.9">'+
 '致每一位点开《杭州西子实验学校模拟器》的你：<br><br>'+
 '从一个简陋的校园小玩具，到今天这个塞进了作息、恋爱、KTV、跳一跳、AI 聊天、高考模拟的"数字校园"，它已经长得比我最初设想的还要庞大。这一路上有无数个深夜，也有无数次推倒重来——但每次想放弃的时候，是你们的反馈把它一点点救了回来。<br><br>'+
 '特别感谢在这个项目里给过我巨大帮助的朋友们：<br>'+
 '<b>录取人、不呐呐、拜拜武德充沛、千屿、陈奕中、m4</b>。<br>'+
 '你们提供的思路、素材、测试和鼓励，是这个游戏能一路走到 5.5.8 的真正原因。名字会写进更新日志里，也会写进这里。<br><br>'+
 '游戏里的高中只有三年，但屏幕外的人生才刚刚开始。愿你在现实里也能考上心仪的大学、遇到值得的人，把青春过得比游戏里更尽兴。<br><br>'+
 '<div style="text-align:right">—— 开发者 Laerrus.<br>5.5.8 版本敬上</div></div>'+
 '<button class="gbtn" onclick="closeModal()">收下这封信</button>';
 modal(h);
};

/* ================================================================
   6.0 夸张预告
   ================================================================ */
window.xzVersion6=function(){
 var feats=[
  ['🏫','三维校园自由漫游','Three.js 1:1 还原杭州西子实验学校，可从校门一路走到湖心岛，每间教室都能推门进去。'],
  ['🧠','真正接入大模型的"活同学"','NPC 记得你说过的每一句话、你的生日、你借过的橡皮，毕业时会给你写专属同学录。'],
  ['🎓','动态高考与志愿推演','三年每一次考试、每一次选课、每一段恋爱都真实影响你的分数线和录取结果。'],
  ['🗣️','语音点歌与语音对话','上课时对着麦克风小声说"在吗"，同桌真的会回你；K 歌支持麦克风实时音准评分。'],
  ['🌦️','联动真实天气与杭州四季','下雨的日子体育课自动改自习，下雪触发全校打雪仗隐藏事件。'],
  ['💞','多人联机校园','和朋友在同一所学校里当同桌、抢同一碗食堂糖醋里脊、一起熬过晚自习。'],
  ['🎬','三年成长纪录片','毕业时自动生成一部属于你的三年混剪，从军训到高考，全程回放。'],
  ['🏠','毕业后开放世界','考上大学、填报志愿、大学宿舍、社团、兼职与恋爱，校园模拟器→人生模拟器。']
 ];
 var h='<h3>🚀 6.0 版本预告 · 概念前瞻</h3><div class="quote">以下为<b>夸张的未来构想</b>，并非本版功能，留作以后慢慢实现。</div><div class="xz60">';
 feats.forEach(function(f){h+='<li><b>'+f[0]+' '+f[1]+'</b><br><span class="dim small">'+f[2]+'</span></li>';});
 h+='</div><div class="xz-card" style="text-align:center">当前版本：<b>5.5.8</b> · 6.0 敬请期待</div><button class="gbtn" onclick="closeModal()">先把 5.5.8 玩明白</button>';
 modal(h);
};

/* ================================================================
   SVG 学校搭建动画（白墙黛瓦 · 临湖 · 远山 · 湖心岛）
   ================================================================ */
window.xzBuildSchool=function(){
 var svg='<svg id="xzBuildSvg" viewBox="0 0 800 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="学校搭建动画">'+
 '<defs>'+
 '<linearGradient id="xzSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3ff"/><stop offset="1" stop-color="#eef7ff"/></linearGradient>'+
 '<linearGradient id="xzLake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0ee"/><stop offset="1" stop-color="#7bb4dc"/></linearGradient>'+
 '<linearGradient id="xzWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eef1f5"/></linearGradient>'+
 '<linearGradient id="xzRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5568"/><stop offset="1" stop-color="#2d3748"/></linearGradient>'+
 '</defs>'+
 '<rect width="800" height="460" fill="url(#xzSky)"/>'+
 /* 太阳 */
 '<g class="xz-build-stage" style="animation-delay:.1s"><circle cx="680" cy="80" r="34" fill="#ffd76a"/><circle cx="680" cy="80" r="46" fill="#ffd76a" opacity=".18"/></g>'+
 /* 远山 */
 '<g class="xz-build-stage" style="animation-delay:.3s"><polygon points="0,250 140,150 270,250" fill="#b9c8d6"/><polygon points="180,250 340,140 520,250" fill="#aabccf"/><polygon points="430,250 610,160 800,250" fill="#b9c8d6"/></g>'+
 /* 湖面 */
 '<g class="xz-build-stage" style="animation-delay:.6s"><rect x="0" y="270" width="800" height="120" fill="url(#xzLake)"/>'+
 '<path d="M0 300 q40 -8 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#ffffff" stroke-width="2" fill="none" opacity=".5"/>'+
 '<path d="M0 340 q40 -8 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#ffffff" stroke-width="2" fill="none" opacity=".35"/></g>'+
 /* 湖心岛 */
 '<g class="xz-build-stage" style="animation-delay:.9s"><ellipse cx="400" cy="300" rx="96" ry="22" fill="#7fbf8a"/><ellipse cx="400" cy="296" rx="70" ry="14" fill="#8fce9b"/></g>'+
 /* 地面 */
 '<g class="xz-build-stage" style="animation-delay:1.1s"><rect x="0" y="250" width="800" height="26" fill="#cfe3c2"/></g>'+
 /* 主楼（三层白墙黛瓦） */
 '<g class="xz-build-stage" style="animation-delay:1.4s">'+
  '<rect x="250" y="150" width="300" height="100" fill="url(#xzWall)" stroke="#cbd5e0"/>'+
  '<polygon points="238,150 400,108 562,150" fill="url(#xzRoof)"/>'+
  '<rect x="382" y="205" width="36" height="45" fill="#d8b06a"/>'+
  genWin(270,168,5)+genWin(270,200,5)+
  '<rect x="498" y="200" width="34" height="10" fill="#a0aec0"/><rect x="270" y="200" width="34" height="10" fill="#a0aec0"/>'+
 '</g>'+
 /* 左配楼 */
 '<g class="xz-build-stage" style="animation-delay:1.8s"><rect x="96" y="186" width="130" height="64" fill="url(#xzWall)" stroke="#cbd5e0"/><polygon points="88,186 161,158 234,186" fill="url(#xzRoof)"/>'+genWin(108,198,4)+'</g>'+
 /* 右配楼 */
 '<g class="xz-build-stage" style="animation-delay:2.1s"><rect x="574" y="186" width="130" height="64" fill="url(#xzWall)" stroke="#cbd5e0"/><polygon points="566,186 639,158 712,186" fill="url(#xzRoof)"/>'+genWin(586,198,4)+'</g>'+
 /* 岛上小亭子 */
 '<g class="xz-build-stage" style="animation-delay:2.4s"><rect x="386" y="276" width="28" height="20" fill="#f7fafc"/><polygon points="378,276 400,258 422,276" fill="#c05621"/></g>'+
 /* 桥 */
 '<g class="xz-build-stage" style="animation-delay:2.7s"><path d="M300 268 q100 -34 200 0" stroke="#e2e8f0" stroke-width="10" fill="none"/><path d="M300 268 q100 -34 200 0" stroke="#cbd5e0" stroke-width="2" fill="none"/></g>'+
 /* 树 */
 '<g class="xz-build-stage" style="animation-delay:3.0s">'+
  tree(150,250)+tree(650,250)+tree(60,250)+tree(740,250)+
  tree(360,292,0.7)+tree(440,292,0.7)+
 '</g>'+
 /* 校名 */
 '<g class="xz-build-stage xz-glow" style="animation-delay:3.3s"><rect x="320" y="120" width="160" height="20" rx="4" fill="#1a365d"/><text x="400" y="135" text-anchor="middle" font-size="13" fill="#ffe9a8" font-family="sans-serif" font-weight="bold">杭州西子实验学校</text></g>'+
 '</svg>';
 var h='<h3>🏗️ 学校正在搭建中…</h3><div id="xzBuildWrap">'+svg+'</div>'+
 '<div class="quote" style="text-align:center">一砖一瓦，从地基到黛瓦，从远山到湖心岛——<br>这就是我们的学校。（纯 SVG 离线动画，无需联网）</div>'+
 '<button class="xz-bigbtn blue" onclick="xzBuildSchool()">↻ 再看一遍</button><button class="gbtn" onclick="closeModal()">关闭</button>';
 modal(h);
};
function genWin(x0,y,count){
 var s='';for(var i=0;i<count;i++){var x=x0+i*46;s+='<rect x="'+x+'" y="'+y+'" width="22" height="16" fill="#9fc6e8" stroke="#7aa6cf"/>';}return s;
}
function tree(x,y,scale){
 scale=scale||1;
 var r=14*scale;
 return '<g><rect x="'+(x-3*scale)+'" y="'+(y-26*scale)+'" width="'+(6*scale)+'" height="'+(26*scale)+'" fill="#8d5a2b"/>'+
 '<circle cx="'+x+'" cy="'+(y-30*scale)+'" r="'+r+'" fill="#5fa86b"/><circle cx="'+(x-10*scale)+'" cy="'+(y-24*scale)+'" r="'+(r*0.8)+'" fill="#6fb87b"/><circle cx="'+(x+10*scale)+'" cy="'+(y-24*scale)+'" r="'+(r*0.8)+'" fill="#6fb87b"/></g>';
}

/* ================================================================
   入口注入：mini 按钮行 + 新功能 + 周期钩子
   ================================================================ */
function injectButtons(){
 var firstMini=document.querySelector('#game .mini');
 if(!firstMini||document.getElementById('xz558Row'))return;
 var row=document.createElement('div');row.id='xz558Row';
 row.style.cssText='margin:6px 0;display:flex;flex-wrap:wrap;gap:6px';
 var btns=[
  ['🎓 高考模拟','gkIntro()'],
  ['🌸 生理期','xzPeriod()'],
  ['🏗️ 搭建学校','xzBuildSchool()'],
  ['💌 开发者信','xzLetter()'],
  ['🚀 6.0预告','xzVersion6()']
 ];
 btns.forEach(function(b){
  var el=document.createElement('button');el.className='mini';el.innerHTML=b[0];
  el.setAttribute('onclick',b[1]);row.appendChild(el);
 });
 var container=firstMini.parentNode;
 /* 插到现有按钮行之后 */
 if(container.parentNode){container.parentNode.insertBefore(row,container.nextSibling);}
 else container.appendChild(row);
}
function tickHook(){
 try{
  if(window.G&&window.G.idx!==undefined){
   periodDailyHook();
   maybeClassTestInvite();
   mailRefresh();
  }
 }catch(e){}
}
function boot(){
 try{mailInit();}catch(e){}
 try{periodInit();}catch(e){}
 try{injectButtons();}catch(e){}
 try{addMailButton();}catch(e){}
 try{mailRefresh();}catch(e){}
 setInterval(tickHook,1500);
}
ready(boot);
[300,1200,3000,5000].forEach(function(d){setTimeout(function(){try{injectButtons();addMailButton();mailRefresh();}catch(e){}},d);});
})();

