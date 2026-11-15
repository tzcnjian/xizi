/* 5.5.10 · 歌词滚动修复 + K歌音准曲线 + 黄金矿工难度 + 大西瓜节流 + 跳一跳增强 + 装扮增强 + 视频播放器 */
(function(){
  if(window.__XZ_PATCH_5510__) return;
  window.__XZ_PATCH_5510__ = true;

  function ready(fn){
    if(document.readyState !== 'loading') setTimeout(fn, 80);
    else document.addEventListener('DOMContentLoaded', function(){ setTimeout(fn, 80); });
  }
  function $(id){ return document.getElementById(id); }

  /* ════════════ 一、歌词滚动修复（同时处理顶栏 #tlLyric 和 hero 区 #lyricBar） ════════════ */
  function fixOneLyric(box){
    if(!box) return;
    var span = box.querySelector('#lyricText') || box.querySelector('.lyricText-move') || box.querySelector('span');
    if(!span) return;
    var boxW = box.clientWidth || 200;
    var textW = span.scrollWidth || span.offsetWidth || 0;
    if(textW > boxW + 4){
      var shift = textW - boxW + 8;
      box.style.setProperty('--lyric-shift', shift + 'px');
      var dur = Math.max(6, Math.min(30, textW / 18));
      box.style.setProperty('--lyric-duration', dur + 's');
      box.classList.add('xz-scrolling');
    } else {
      box.classList.remove('xz-scrolling');
      box.style.removeProperty('--lyric-shift');
    }
  }
  function fixLyricScroll(){
    fixOneLyric($('tlLyric'));
    fixOneLyric($('lyricBar'));
  }
  function initLyricScrollFix(){
    var boxes = [$('tlLyric'), $('lyricBar')];
    var any = false;
    for(var i=0;i<boxes.length;i++){
      var box = boxes[i];
      if(!box || box.__xz_lyric_obs) continue;
      box.__xz_lyric_obs = true;
      any = true;
      try{
        var mo = new MutationObserver(function(){ setTimeout(fixLyricScroll, 50); });
        mo.observe(box, { childList: true, characterData: true, subtree: true, attributes: true });
      }catch(e){}
    }
    if(any) fixLyricScroll();
    window.addEventListener('resize', fixLyricScroll);
  }

  /* ════════════ 二、K歌音准曲线 Canvas（分离注入与 hook，避免 PATCH 延迟定义导致漏 hook） ════════════ */
  var pitchRAF = 0, pitchStart = 0, playerCurve = [], targetCurve = [];
  function injectPitchCanvas(){
    var status = $('karaoke-status');
    if(!status) return;
    if($('xzPitchCanvas')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = '<canvas id="xzPitchCanvas" width="480" height="120"></canvas>'+
      '<div id="xzPitchLegend"><span class="lg"><span class="dot" style="background:#3fb950"></span>目标音高</span>'+
      '<span class="lg"><span class="dot" style="background:#39d0d8"></span>你的演唱</span>'+
      '<span class="lg"><span class="dot" style="background:#ffd700"></span>当前位置</span></div>';
    status.parentNode.insertBefore(wrap, status.nextSibling);
  }
  function hookKaraokePitch(){
    if(window.__xz_pitch_hooked__) return;
    if(typeof PATCH === 'undefined' || !PATCH.karaoke) return;
    if(typeof PATCH.karaoke.startKaraoke !== 'function') return;
    window.__xz_pitch_hooked__ = true;
    var origStart = PATCH.karaoke.startKaraoke;
    var origStop = PATCH.karaoke.stopKaraoke;
    PATCH.karaoke.startKaraoke = function(){
      if(origStart) origStart.apply(this, arguments);
      injectPitchCanvas();
      pitchStart = Date.now();
      playerCurve = [];
      targetCurve = [];
      for(var k=0;k<300;k++){
        targetCurve.push(50 + Math.sin(k*0.12)*28 + Math.sin(k*0.04)*12);
      }
      drawPitchLoop();
    };
    PATCH.karaoke.stopKaraoke = function(){
      if(origStop) origStop.apply(this, arguments);
      pitchStart = 0;
      if(pitchRAF){ cancelAnimationFrame(pitchRAF); pitchRAF = 0; }
    };
  }
  function initPitchCanvas(){
    injectPitchCanvas();
    hookKaraokePitch();
  }
  function drawPitchLoop(){
    if(!pitchStart) return;
    var cv = $('xzPitchCanvas');
    if(!cv){ pitchRAF = 0; return; }
    var ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0,0,W,H);
    // 网格
    ctx.strokeStyle = '#1a2332'; ctx.lineWidth = 1;
    for(var i=0;i<=4;i++){ var y=H*i/4; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    for(var j=0;j<=6;j++){ var x=W*j/6; ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    // 时间
    var elapsed = (Date.now() - pitchStart) / 1000;
    var visWin = 12;
    // 玩家曲线
    playerCurve.push(50 + Math.sin(elapsed*0.7)*24 + (Math.random()-0.5)*16);
    if(playerCurve.length > 400) playerCurve.shift();
    // 画目标曲线
    ctx.strokeStyle = '#3fb950'; ctx.lineWidth = 2; ctx.setLineDash([5,3]);
    ctx.beginPath();
    var sIdx = Math.max(0, Math.floor(elapsed*8) - visWin*8);
    var drawn = 0;
    for(var idx=sIdx; idx<targetCurve.length && drawn<visWin*8; idx++, drawn++){
      var px = (drawn/(visWin*8))*W;
      var py = H - (targetCurve[idx]/100)*H;
      if(drawn===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.stroke(); ctx.setLineDash([]);
    // 画玩家曲线
    ctx.strokeStyle = '#39d0d8'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    var pStart = Math.max(0, playerCurve.length - visWin*8);
    var pdrawn = 0;
    for(var pi=pStart; pi<playerCurve.length; pi++, pdrawn++){
      var ppx = (pdrawn/(visWin*8))*W;
      var ppy = H - (playerCurve[pi]/100)*H;
      if(pdrawn===0) ctx.moveTo(ppx,ppy); else ctx.lineTo(ppx,ppy);
    }
    ctx.stroke();
    // 当前位置光点
    if(playerCurve.length>0){
      var last = playerCurve[playerCurve.length-1];
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(W-6, H-(last/100)*H, 5, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
    }
    pitchRAF = requestAnimationFrame(drawPitchLoop);
  }

  /* ════════════ 三、黄金矿工难度选择 ════════════ */
  var GM_DIFF = { target: 150, time: 60, mult: 1, name: '普通' };
  function initGoldMinerDiff(){
    if(typeof xzGoldMiner === 'undefined') return;
    if(window.__xz_gm_hooked__) return;
    window.__xz_gm_hooked__ = true;
    var orig = window.xzGoldMiner;
    window.xzGoldMiner = function(){
      var h = '<h3>⛏️ 黄金矿工 · 选择难度</h3>'+
        '<div class="quote">5.5.10 新增四档难度，金价随难度调整。</div>'+
        '<div class="xz-diff-grid">'+
        '<button class="xz-diff-btn" onclick="window.__xzGmStart({target:100,time:75,mult:0.8,name:\'简单\'})"><span class="d-name">😌 简单</span><span class="d-desc">目标 $100 · 75秒<br>金价 ×0.8</span></button>'+
        '<button class="xz-diff-btn" onclick="window.__xzGmStart({target:150,time:60,mult:1,name:\'普通\'})"><span class="d-name">🙂 普通</span><span class="d-desc">目标 $150 · 60秒<br>原版难度</span></button>'+
        '<button class="xz-diff-btn" onclick="window.__xzGmStart({target:220,time:50,mult:1.3,name:\'困难\'})"><span class="d-name">😰 困难</span><span class="d-desc">目标 $220 · 50秒<br>金价 ×1.3</span></button>'+
        '<button class="xz-diff-btn" onclick="window.__xzGmStart({target:350,time:40,mult:1.6,name:\'地狱\'})"><span class="d-name">😤 地狱</span><span class="d-desc">目标 $350 · 40秒<br>金价 ×1.6</span></button>'+
        '</div>'+
        '<button class="gbtn" onclick="closeModal()">取消</button>';
      try{ modal(h); }catch(e){ orig(); }
    };
    window.__xzGmStart = function(diff){
      GM_DIFF = diff;
      try{ closeModal(); }catch(e){}
      orig();
      setTimeout(function(){
        if(typeof GM !== 'undefined'){
          GM.target = diff.target;
          GM.time = diff.time;
          GM.diffName = diff.name;
          GM.diffMult = diff.mult;
          var tgt = $('gmTarget'); if(tgt) tgt.textContent = '$' + diff.target;
          var tm = $('gmTime'); if(tm) tm.textContent = diff.time;
          // 调整物品价值
          if(GM.items){
            for(var i=0;i<GM.items.length;i++){
              if(GM.items[i].w) GM.items[i].w = Math.round(GM.items[i].w * diff.mult);
            }
          }
        }
      }, 60);
    };
    // hook gmGenLevel 调整生成物品价值
    if(typeof gmGenLevel === 'function' && !window.__xz_gmgen_hooked__){
      window.__xz_gmgen_hooked__ = true;
      var origGen = window.gmGenLevel;
      window.gmGenLevel = function(){
        origGen.apply(this, arguments);
        if(typeof GM !== 'undefined' && GM.items){
          for(var i=0;i<GM.items.length;i++){
            if(GM.items[i].w) GM.items[i].w = Math.round(GM.items[i].w * (GM_DIFF.mult || 1));
          }
        }
      };
    }
  }

  /* ════════════ 四、大西瓜 rAF 节流 ════════════ */
  function initWatermelonThrottle(){
    if(typeof xzWMDraw === 'undefined') return;
    if(window.__xz_wm_hooked__) return;
    window.__xz_wm_hooked__ = true;
    var targetFPS = (window.innerWidth < 820 || /Mobi|Android|iPhone/i.test(navigator.userAgent)) ? 30 : 60;
    var origDraw = window.xzWMDraw;
    var drawLast = 0;
    window.xzWMDraw = function(){
      var now = performance.now();
      if(now - drawLast < 1000/targetFPS - 1) return;
      drawLast = now;
      origDraw.apply(this, arguments);
    };
    // 注入 fps 徽章
    var t = setInterval(function(){
      if(typeof WM !== 'undefined' && WM.canvas && WM.canvas.parentNode && !$('xzFpsBadge')){
        try{
          WM.canvas.parentNode.style.position = 'relative';
          var badge = document.createElement('div');
          badge.id = 'xzFpsBadge';
          badge.textContent = targetFPS + 'fps';
          WM.canvas.parentNode.appendChild(badge);
        }catch(e){}
      }
    }, 800);
    setTimeout(function(){ clearInterval(t); }, 10000);
  }

  /* ════════════ 五、跳一跳动画增强 ════════════ */
  function initJumpJumpEnhance(){
    if(typeof jumpJump === 'undefined') return;
    if(window.__xz_jump_hooked__) return;
    window.__xz_jump_hooked__ = true;
    var origJJ = window.jumpJump;
    window.jumpJump = function(){
      origJJ.apply(this, arguments);
      setTimeout(function(){
        // 跳一跳 canvas 固定 id="jjCanvas"
        var cv = document.getElementById('jjCanvas');
        if(cv && cv.parentNode){
          var emote = document.createElement('div');
          emote.className = 'xz-jump-emote';
          emote.style.cssText = 'top:8px;left:50%;transform:translateX(-50%)';
          emote.textContent = '🎯';
          cv.parentNode.appendChild(emote);
          // 蓄力提示
          var hint = document.createElement('div');
          hint.style.cssText = 'position:absolute;bottom:8px;left:50%;transform:translateX(-50%);font-size:12px;color:#ffd700;background:rgba(0,0,0,.5);padding:4px 12px;border-radius:8px;pointer-events:none;z-index:99';
          hint.textContent = '按住蓄力 · 松开起跳 · 落正中心连击';
          cv.parentNode.appendChild(hint);
        }
      }, 250);
    };
  }

  /* ════════════ 六、装扮系统增强 ════════════ */
  function initDressEnhance(){
    if(typeof xzDressMorning === 'undefined') return;
    if(window.__xz_dress_hooked__) return;
    window.__xz_dress_hooked__ = true;
    var origDM = window.xzDressMorning;
    window.xzDressMorning = function(){
      origDM.apply(this, arguments);
      setTimeout(function(){
        var m = document.querySelector('.modal, #modalBody, #modal');
        if(!m) m = document.body;
        if(m.querySelector('.xz-dress-random')) return;
        var btn = document.createElement('button');
        btn.className = 'gbtn xz-dress-random';
        btn.textContent = '🎲 随机穿搭';
        btn.style.cssText = 'margin-top:8px;width:100%;padding:10px';
        btn.onclick = function(){
          var outfits = ['校服','便服','运动装','外套','连帽衫','短袖','卫衣','衬衫'];
          var shoes = ['运动鞋','帆布鞋','皮鞋','凉鞋','靴子'];
          var o = outfits[Math.floor(Math.random()*outfits.length)];
          var s = shoes[Math.floor(Math.random()*shoes.length)];
          if(typeof G !== 'undefined'){
            G.outfit = o;
            if(G.shoe !== undefined) G.shoe = s;
          }
          try{ if(typeof wearOutfit === 'function') wearOutfit(o, true); }catch(e){}
          try{ if(typeof l === 'function') l('🎲 随机穿搭：' + o + ' + ' + s, 'good'); }catch(e){}
          try{ if(typeof next === 'function') next(); }catch(e){}
          try{ closeModal(); }catch(e){}
        };
        m.appendChild(btn);
      }, 120);
    };
  }

  /* ════════════ 七、视频播放器 ════════════ */
  function initVideoPanel(){
    var t = setInterval(function(){
      var funcRow = document.querySelector('.xz-func-row');
      if(!funcRow) return;
      if($('xz-video-btn')) return;
      var btn = document.createElement('button');
      btn.id = 'xz-video-btn';
      btn.className = 'mini gbtn';
      btn.textContent = '🎬 视频';
      btn.onclick = function(){ openVideoPanel(); };
      funcRow.appendChild(btn);
    }, 1500);
    setTimeout(function(){ clearInterval(t); }, 30000);
  }
  function openVideoPanel(){
    var h = '<div id="xzVideoPanel"><h3>🎬 视频播放器</h3>'+
      '<div class="quote">5.5.10 新增。支持本地视频、网址播放和示例视频。</div>'+
      '<video id="xzVideo" controls style="display:none"></video>'+
      '<div style="margin:10px 0">'+
      '<input id="xzVideoUrl" placeholder="输入视频网址 (mp4/webm)" style="width:70%;padding:8px;border-radius:8px;border:1px solid #555;background:#222;color:#fff">'+
      '<button class="gbtn" onclick="window.__xzPlayUrl()">▶ 播放</button></div>'+
      '<div style="margin:10px 0"><input type="file" id="xzVideoFile" accept="video/*" style="display:none" onchange="window.__xzPlayFile(event)">'+
      '<button class="gbtn" onclick="document.getElementById(\'xzVideoFile\').click()">📁 选择本地视频</button></div>'+
      '<div class="xz-video-list">'+
      '<div class="xz-video-item" onclick="window.__xzPlaySample(1)"><span class="v-icon">🎬</span><span class="v-name">示例：小熊</span></div>'+
      '<div class="xz-video-item" onclick="window.__xzPlaySample(2)"><span class="v-icon">🌊</span><span class="v-name">示例：海浪</span></div>'+
      '<div class="xz-video-item" onclick="window.__xzPlaySample(3)"><span class="v-icon">🏞️</span><span class="v-name">示例：风景</span></div>'+
      '</div>'+
      '<button class="gbtn" style="margin-top:10px" onclick="closeModal()">关闭</button></div>';
    try{ modal(h); }catch(e){ alert('视频播放器需要游戏内环境'); }
  }
  window.__xzPlayUrl = function(){
    var url = ($('xzVideoUrl')||{}).value; if(!url||!url.trim()) return;
    var v = $('xzVideo'); if(!v) return;
    v.src = url.trim(); v.style.display = 'block'; v.play();
  };
  window.__xzPlayFile = function(e){
    var f = e.target.files[0]; if(!f) return;
    var v = $('xzVideo'); if(!v) return;
    v.src = URL.createObjectURL(f); v.style.display = 'block'; v.play();
  };
  window.__xzPlaySample = function(n){
    var v = $('xzVideo'); if(!v) return;
    var urls = [
      'https://www.w3schools.com/html/mov_bbb.mp4',
      'https://www.w3schools.com/html/movie.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    ];
    v.src = urls[(n-1)%urls.length]; v.style.display = 'block'; v.play();
  };

  /* ════════════ 八、5.5.10 版本徽章 ════════════ */
  function initVersionBadge(){
    var done = false;
    var t = setInterval(function(){
      if(done) return;
      var els = document.querySelectorAll('b, span, div');
      for(var i=0;i<els.length;i++){
        if(els[i].textContent.indexOf('Version 5.5.9') !== -1 && !els[i].querySelector('#xz5510-badge')){
          var badge = document.createElement('span');
          badge.id = 'xz5510-badge';
          badge.textContent = '+ 5.5.10 扩展包';
          els[i].appendChild(badge);
          done = true;
          break;
        }
      }
    }, 2000);
    setTimeout(function(){ clearInterval(t); }, 20000);
  }

  /* ════════════ 启动 ════════════ */
  ready(function(){
    try{ initLyricScrollFix(); }catch(e){ console.log('lyric', e); }
    try{ initGoldMinerDiff(); }catch(e){ console.log('gold', e); }
    try{ initWatermelonThrottle(); }catch(e){ console.log('wm', e); }
    try{ initJumpJumpEnhance(); }catch(e){ console.log('jump', e); }
    try{ initDressEnhance(); }catch(e){ console.log('dress', e); }
    try{ initVideoPanel(); }catch(e){ console.log('video', e); }
    try{ initVersionBadge(); }catch(e){ console.log('badge', e); }

    // 兜底：切屏后重新初始化
    var t = setInterval(function(){
      try{ initLyricScrollFix(); }catch(e){}
      try{ initPitchCanvas(); }catch(e){}
    }, 2000);
    setTimeout(function(){ clearInterval(t); }, 30000);
  });
})();
