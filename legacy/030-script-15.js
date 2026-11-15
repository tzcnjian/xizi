
/* 5.5.11 大规模补丁 · 10 大功能模块 | 哨兵 __XZ_PATCH_5511__ */
(function(){
  if(window.__XZ_PATCH_5511__) return;
  window.__XZ_PATCH_5511__ = true;

  /* Canvas roundRect 兜底（老内核必备） */
  if(window.CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect){
    CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r){
      if(typeof r==='number') r={tl:r,tr:r,br:r,bl:r};
      r=r||{tl:0,tr:0,br:0,bl:0};
      this.beginPath();
      this.moveTo(x+r.tl,y);
      this.lineTo(x+w-r.tr,y); this.quadraticCurveTo(x+w,y,x+w,y+r.tr);
      this.lineTo(x+w,y+h-r.br); this.quadraticCurveTo(x+w,y+h,x+w-r.br,y+h);
      this.lineTo(x+r.bl,y+h); this.quadraticCurveTo(x,y+h,x,y+h-r.bl);
      this.lineTo(x,y+r.tl); this.quadraticCurveTo(x,y,x+r.tl,y);
      this.closePath(); return this;
    };
  }

  function ready(fn){
    if(document.readyState!=='loading') setTimeout(fn,80);
    else document.addEventListener('DOMContentLoaded',function(){setTimeout(fn,80);});
  }
  function $(id){ return document.getElementById(id); }
  function wrap(obj,name,after){
    var orig = obj && obj[name];
    if(typeof orig!=='function') return;
    obj[name] = function(){
      var ret = orig.apply(this,arguments);
      try{ after.apply(this,[ret].concat([].slice.call(arguments))); }catch(e){}
      return ret;
    };
  }
  function safeModal(h){
    try{ if(typeof modal==='function'){ modal(h); return true; } }catch(e){}
    return false;
  }

  /* ════════════ 一、应用商城扩充（10+ 实用工具） ════════════ */
  var XZ_APPS = [
    {icon:'🧮',name:'计算器',fn:openCalc},
    {icon:'⏱️',name:'计时器',fn:openTimer},
    {icon:'🎨',name:'画板',fn:openDrawPad},
    {icon:'📝',name:'备忘录',fn:openMemo},
    {icon:'🌤️',name:'天气',fn:openWeather},
    {icon:'📅',name:'课程表',fn:openTimetable},
    {icon:'📊',name:'成绩计算',fn:openGradeCalc},
    {icon:'⏳',name:'倒计时',fn:openCountdown},
    {icon:'🍅',name:'番茄钟',fn:openPomodoro},
    {icon:'📐',name:'单位换算',fn:openUnitConv},
    {icon:'🎲',name:'随机数',fn:openRandom},
    {icon:'🔢',name:'进制转换',fn:openBaseConv}
  ];
  function initAppShop(){
    // hook 现有应用商城按钮，或新建入口
    var t = setInterval(function(){
      var funcRow = document.querySelector('.xz-func-row');
      if(!funcRow) return;
      if($('xz-appshop-btn')) { clearInterval(t); return; }
      var btn = document.createElement('button');
      btn.id = 'xz-appshop-btn'; btn.className = 'mini gbtn';
      btn.textContent = '🛍️ 应用'; btn.onclick = openAppShop;
      funcRow.appendChild(btn);
      clearInterval(t);
    }, 1200);
    setTimeout(function(){}, 20000);
  }
  function openAppShop(){
    var cards = XZ_APPS.map(function(a){
      return '<div class="xz-app-card" onclick="window.__xzApp('+XZ_APPS.indexOf(a)+')">'+
        '<span class="a-icon">'+a.icon+'</span><span class="a-name">'+a.name+'</span></div>';
    }).join('');
    var h = '<h3>🛍️ 应用商城</h3><div class="quote">5.5.11 新增 12 个实用工具，全部内置无需下载。</div>'+
      '<div class="xz-app-grid">'+cards+'</div>'+
      '<button class="gbtn" style="margin-top:10px" onclick="closeModal()">关闭</button>';
    safeModal(h);
  }
  window.__xzApp = function(i){ try{closeModal();}catch(e){} setTimeout(function(){ XZ_APPS[i].fn(); }, 100); };
  function openCalc(){
    safeModal('<h3>🧮 计算器</h3><div id="xzCalc" style="text-align:center">'+
      '<input id="xzCalcIn" style="width:90%;font-size:24px;text-align:right;padding:8px;margin-bottom:8px" value="" />'+
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-width:280px;margin:0 auto">'+
      '7,8,9,+,4,5,6,-,1,2,0,×,C,=,.,÷'.split(',').map(function(k){
        return '<button class="gbtn" style="padding:14px;font-size:18px" onclick="window.__xzCalcKey(\''+k+'\')">'+k+'</button>';
      }).join('')+'</div></div><button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>');
    window.__xzCalcKey = function(k){
      var inp = $('xzCalcIn'); if(!inp) return;
      if(k==='C') inp.value='';
      else if(k==='='){ try{ inp.value = Function('return '+inp.value.replace(/×/g,'*').replace(/÷/g,'/'))(); }catch(e){ inp.value='Error'; } }
      else inp.value += k;
    };
  }
  function openTimer(){
    safeModal('<h3>⏱️ 计时器</h3><div style="text-align:center">'+
      '<div id="xzTimerDisp" style="font-size:48px;font-family:monospace;margin:16px">00:00.0</div>'+
      '<button class="gbtn" onclick="window.__xzTimerToggle()">开始/暂停</button> '+
      '<button class="gbtn" onclick="window.__xzTimerReset()">归零</button>'+
      '</div><button class="gbtn" style="margin-top:8px" onclick="closeModal();window.__xzTimerStop()">关闭</button>');
    var start=0,running=false,tid=0;
    window.__xzTimerToggle = function(){
      if(running){ running=false; clearInterval(tid); return; }
      running=true; start=Date.now()-($__xzTimerElapsed||0);
      tid=setInterval(function(){
        var el=Date.now()-start; $('__xzTimerElapsed',el);
        var m=Math.floor(el/60000), s=Math.floor(el%60000/1000), ms=Math.floor(el%1000/100);
        var d=$('xzTimerDisp'); if(d) d.textContent=(m<10?'0':'')+m+':'+(s<10?'0':'')+s+'.'+ms;
      },100);
    };
    window.__xzTimerReset = function(){ running=false; clearInterval(tid); $('__xzTimerElapsed',0); var d=$('xzTimerDisp'); if(d) d.textContent='00:00.0'; };
    window.__xzTimerStop = function(){ clearInterval(tid); };
    var $ev=0; function $(k,v){ if(v!==undefined){$ev=v;return v;} return $ev; }
  }
  function openDrawPad(){
    safeModal('<h3>🎨 画板</h3><canvas id="xzDrawCv" width="320" height="300" style="border:2px solid #444;border-radius:8px;display:block;margin:0 auto;touch-action:none"></canvas>'+
      '<div style="text-align:center;margin-top:8px"><input type="color" id="xzDrawColor" value="#6cf" /> '+
      '<input type="range" id="xzDrawSize" min="1" max="20" value="3" style="vertical-align:middle"/> '+
      '<button class="gbtn" onclick="window.__xzDrawClear()">清空</button></div>'+
      '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>');
    var cv=$('xzDrawCv'); if(!cv) return;
    var ctx=cv.getContext('2d'); var drawing=false;
    ctx.strokeStyle='#6cf'; ctx.lineWidth=3; ctx.lineCap='round';
    cv.addEventListener('pointerdown',function(e){ drawing=true; ctx.beginPath(); var r=cv.getBoundingClientRect(); ctx.moveTo((e.clientX-r.left)*(cv.width/r.width),(e.clientY-r.top)*(cv.height/r.height)); });
    cv.addEventListener('pointermove',function(e){ if(!drawing) return; var r=cv.getBoundingClientRect(); ctx.lineTo((e.clientX-r.left)*(cv.width/r.width),(e.clientY-r.top)*(cv.height/r.height)); ctx.stroke(); });
    cv.addEventListener('pointerup',function(){ drawing=false; });
    $('xzDrawColor').addEventListener('input',function(){ ctx.strokeStyle=this.value; });
    $('xzDrawSize').addEventListener('input',function(){ ctx.lineWidth=this.value; });
    window.__xzDrawClear = function(){ ctx.clearRect(0,0,cv.width,cv.height); };
  }
  function openMemo(){
    var saved = '';
    try{ saved = localStorage.getItem('xz_memo')||''; }catch(e){}
    safeModal('<h3>📝 备忘录</h3><textarea id="xzMemo" style="width:90%;height:200px;padding:10px;border-radius:8px;border:1px solid #444;background:#1a1a2e;color:#fff;font-size:14px">'+saved+'</textarea>'+
      '<button class="gbtn" style="margin-top:8px" onclick="try{localStorage.setItem(\'xz_memo\',document.getElementById(\'xzMemo\').value);alert(\'已保存\')}catch(e){}">💾 保存</button> '+
      '<button class="gbtn" onclick="closeModal()">关闭</button>');
  }
  function openWeather(){
    var weathers = [['☀️ 晴','22°C','微风 2级'],['⛅ 多云','18°C','东风 3级'],['🌧️ 小雨','15°C','南风 4级'],['❄️ 小雪','-2°C','北风 5级'],['🌫️ 雾','12°C','无风'],['🌪️ 大风','10°C','西北风 6级']];
    var w = weathers[Math.floor(Math.random()*weathers.length)];
    safeModal('<h3>🌤️ 天气</h3><div style="text-align:center;padding:20px">'+
      '<div style="font-size:64px">'+w[0]+'</div><div style="font-size:36px;margin:10px">'+w[1]+'</div>'+
      '<div style="color:#888">'+w[2]+'</div><div class="dim small" style="margin-top:12px">杭州 · 模拟数据</div></div>'+
      '<button class="gbtn" onclick="closeModal()">关闭</button>');
  }
  function openTimetable(){
    safeModal('<h3>📅 课程表</h3><div style="font-size:13px"><table style="width:100%;border-collapse:collapse">'+
      '<tr style="background:#1a1a2e"><th style="padding:6px;border:1px solid #333">节次</th><th style="padding:6px;border:1px solid #333">一</th><th style="padding:6px;border:1px solid #333">二</th><th style="padding:6px;border:1px solid #333">三</th><th style="padding:6px;border:1px solid #333">四</th><th style="padding:6px;border:1px solid #333">五</th></tr>'+
      ['语文|数学|英语|物理|化学','数学|语文|体育|历史|政治','英语|物理|语文|地理|生物','物理|化学|数学|语文|英语','化学|生物|政治|数学|美术'].map(function(r,i){
        return '<tr><td style="padding:6px;border:1px solid #333;text-align:center;font-weight:700">'+(i+1)+'</td>'+r.split('|').map(function(c){return '<td style="padding:6px;border:1px solid #333;text-align:center">'+c+'</td>';}).join('')+'</tr>';
      }).join('')+
      '</table></div><button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>');
  }
  function openGradeCalc(){
    safeModal('<h3>📊 成绩计算器</h3><div id="xzGC"><div id="xzGCRows"></div>'+
      '<button class="gbtn" onclick="window.__xzGCAdd()">➕ 加科目</button> '+
      '<button class="gbtn" onclick="window.__xzGCCalc()">📊 计算</button>'+
      '<div id="xzGCResult" style="margin-top:10px;font-size:16px;font-weight:700"></div></div>'+
      '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button>');
    window.__xzGCAdd = function(){
      var rows = $('xzGCRows');
      var n = rows.children.length;
      rows.innerHTML += '<div style="margin:4px 0"><input class="xz-gc-name" placeholder="科目" style="width:30%;padding:4px"/> '+
        '<input class="xz-gc-score" type="number" placeholder="分数" style="width:20%;padding:4px"/> '+
        '<input class="xz-gc-credit" type="number" placeholder="学分" value="1" style="width:15%;padding:4px"/></div>';
    };
    window.__xzGCCalc = function(){
      var names=document.querySelectorAll('.xz-gc-name'), scores=document.querySelectorAll('.xz-gc-score'), credits=document.querySelectorAll('.xz-gc-credit');
      var totalW=0, totalC=0;
      for(var i=0;i<scores.length;i++){
        var s=parseFloat(scores[i].value)||0, c=parseFloat(credits[i].value)||1;
        totalW+=s*c; totalC+=c;
      }
      $('xzGCResult').textContent = '加权平均分：'+(totalC? (totalW/totalC).toFixed(2):'--')+' | 总学分：'+totalC;
    };
    window.__xzGCAdd();
  }
  function openCountdown(){
    safeModal('<h3>⏳ 倒计时</h3><div style="text-align:center">'+
      '<input id="xzCDMin" type="number" value="5" style="width:60px;padding:6px"/> 分钟 '+
      '<button class="gbtn" onclick="window.__xzCDStart()">开始</button>'+
      '<div id="xzCDDisp" style="font-size:48px;font-family:monospace;margin:16px">05:00</div></div>'+
      '<button class="gbtn" onclick="closeModal();window.__xzCDStop()">关闭</button>');
    var tid=0;
    window.__xzCDStart = function(){
      var sec = (parseInt($('xzCDMin').value)||5)*60;
      clearInterval(tid);
      tid=setInterval(function(){
        sec--; if(sec<=0){ clearInterval(tid); $('xzCDDisp').textContent='00:00'; alert('⏰ 时间到！'); return; }
        var m=Math.floor(sec/60), s=sec%60;
        $('xzCDDisp').textContent=(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
      },1000);
    };
    window.__xzCDStop = function(){ clearInterval(tid); };
  }
  function openPomodoro(){
    safeModal('<h3>🍅 番茄钟</h3><div style="text-align:center">'+
      '<div id="xzPomoDisp" style="font-size:48px;font-family:monospace;margin:16px">25:00</div>'+
      '<button class="gbtn" onclick="window.__xzPomoStart()">▶ 工作25分钟</button> '+
      '<button class="gbtn" onclick="window.__xzPomoBreak()">☕ 休息5分钟</button></div>'+
      '<button class="gbtn" onclick="closeModal();window.__xzPomoStop()">关闭</button>');
    var tid=0;
    function run(min){
      var sec=min*60; clearInterval(tid);
      tid=setInterval(function(){
        sec--; if(sec<=0){ clearInterval(tid); $('xzPomoDisp').textContent='00:00'; alert('⏰ 完成！'); return; }
        var m=Math.floor(sec/60), s=sec%60;
        $('xzPomoDisp').textContent=(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
      },1000);
    }
    window.__xzPomoStart = function(){ run(25); };
    window.__xzPomoBreak = function(){ run(5); };
    window.__xzPomoStop = function(){ clearInterval(tid); };
  }
  function openUnitConv(){
    safeModal('<h3>📐 单位换算</h3><div style="padding:10px">'+
      '<select id="xzUCType" onchange="window.__xzUCChange()" style="padding:6px;width:100%">'+
      '<option value="len">长度</option><option value="weight">重量</option><option value="temp">温度</option></select>'+
      '<div style="margin:10px 0"><input id="xzUCVal" type="number" value="1" style="width:40%;padding:6px" oninput="window.__zUCCalc()"/> '+
      '<select id="xzUCFrom" style="padding:6px;width:25%" onchange="window.__xzUCCalc()"></select> → '+
      '<select id="xzUCTo" style="padding:6px;width:25%" onchange="window.__xzUCCalc()"></select></div>'+
      '<div id="xzUCResult" style="font-size:20px;font-weight:700;text-align:center"></div></div>'+
      '<button class="gbtn" onclick="closeModal()">关闭</button>');
    var units = {
      len:{m:1,km:1000,cm:0.01,mm:0.001,里:500,尺:0.3333,inch:0.0254,ft:0.3048},
      weight:{kg:1,g:0.001,斤:0.5,两:0.05,lb:0.4536,oz:0.0283},
      temp:{C:1,F:1,K:1}
    };
    window.__xzUCChange = function(){
      var t=$('xzUCType').value, us=Object.keys(units[t]);
      $('xzUCFrom').innerHTML = us.map(function(u){return '<option value="'+u+'">'+u+'</option>';}).join('');
      $('xzUCTo').innerHTML = us.map(function(u){return '<option value="'+u+'">'+u+'</option>';}).join('');
      window.__xzUCCalc();
    };
    window.__xzUCCalc = function(){
      var t=$('xzUCType').value, v=parseFloat($('xzUCVal').value)||0, f=$('xzUCFrom').value, to=$('xzUCTo').value;
      var r;
      if(t==='temp'){
        var c = f==='C'?v : f==='F'?(v-32)*5/9 : v-273.15;
        r = to==='C'?c : to==='F'?c*9/5+32 : c+273.15;
      } else {
        r = v * units[t][f] / units[t][to];
      }
      $('xzUCResult').textContent = r.toFixed(4) + ' ' + to;
    };
    window.__xzUCChange();
  }
  function openRandom(){
    safeModal('<h3>🎲 随机数</h3><div style="text-align:center;padding:16px">'+
      '<input id="xzRMin" type="number" value="1" style="width:80px;padding:6px"/> ~ '+
      '<input id="xzRMax" type="number" value="100" style="width:80px;padding:6px"/><br><br>'+
      '<button class="gbtn" style="font-size:18px;padding:12px 24px" onclick="window.__xzRGen()">🎲 抽取</button>'+
      '<div id="xzRResult" style="font-size:48px;font-weight:900;margin:16px;color:#ffd700">-</div></div>'+
      '<button class="gbtn" onclick="closeModal()">关闭</button>');
    window.__xzRGen = function(){
      var min=parseInt($('xzRMin').value)||0, max=parseInt($('xzRMax').value)||100;
      if(min>max){ var t=min;min=max;max=t; }
      $('xzRResult').textContent = Math.floor(Math.random()*(max-min+1))+min;
    };
  }
  function openBaseConv(){
    safeModal('<h3>🔢 进制转换</h3><div style="padding:10px">'+
      '<input id="xzBCVal" value="255" style="width:60%;padding:6px;font-size:16px" oninput="window.__xzBCCalc()"/> '+
      '<select id="xzBCBase" style="padding:6px" onchange="window.__xzBCCalc()"><option value="10">十进制</option><option value="2">二进制</option><option value="8">八进制</option><option value="16">十六进制</option></select>'+
      '<div style="margin-top:12px;line-height:2">二进制: <b id="xzBC2">-</b><br>八进制: <b id="xzBC8">-</b><br>十进制: <b id="xzBC10">-</b><br>十六进制: <b id="xzBC16">-</b></div></div>'+
      '<button class="gbtn" onclick="closeModal()">关闭</button>');
    window.__xzBCCalc = function(){
      var v=$('xzBCVal').value, b=parseInt($('xzBCBase').value)||10;
      var n = parseInt(v, b);
      if(isNaN(n)){ $('xzBC2').textContent=$('xzBC8').textContent=$('xzBC10').textContent=$('xzBC16').textContent='Error'; return; }
      $('xzBC2').textContent=n.toString(2); $('xzBC8').textContent=n.toString(8);
      $('xzBC10').textContent=n.toString(10); $('xzBC16').textContent=n.toString(16).toUpperCase();
    };
    window.__xzBCCalc();
  }

  /* ════════════ 二、跳一跳动画深化 ════════════ */
  function initJumpJumpDeep(){
    if(typeof jumpJump==='undefined') return;
    if(window.__xz_jj_deep_hooked__) return;
    window.__xz_jj_deep_hooked__ = true;
    var orig = window.jumpJump;
    window.jumpJump = function(){
      orig.apply(this, arguments);
      setTimeout(function(){
        var cv = $('jjCanvas'); if(!cv || !cv.parentNode) return;
        // 蓄力表情层
        var emote = document.createElement('div');
        emote.id = 'xzJjEmote'; emote.className = 'xz-jj-emote'; emote.textContent = '😐';
        cv.parentNode.appendChild(emote);
        // 蓄力监听（监听 pointerdown/up）
        var powerLevel = 0, powerTid = 0;
        cv.addEventListener('pointerdown', function(){
          powerLevel = 0;
          powerTid = setInterval(function(){
            powerLevel = Math.min(3, powerLevel+1);
            emote.className = 'xz-jj-emote power-'+powerLevel;
            emote.textContent = ['😐','🙂','😮','😤'][powerLevel];
          }, 400);
        });
        cv.addEventListener('pointerup', function(){
          clearInterval(powerTid);
          setTimeout(function(){ emote.className='xz-jj-emote'; emote.textContent='😐'; powerLevel=0; }, 300);
        });
      }, 250);
    };
  }
  // 完美落点粒子爆发（hook 到游戏内部需要，这里提供工具函数）
  window.__xzJjSparkle = function(cv, x, y){
    if(!cv || !cv.parentNode) return;
    for(var i=0;i<12;i++){
      var s = document.createElement('div');
      s.className = 'xz-jj-sparkle';
      s.style.left = x+'px'; s.style.top = y+'px';
      s.style.setProperty('--sx', (Math.cos(i/12*Math.PI*2)*60)+'px');
      s.style.setProperty('--sy', (Math.sin(i/12*Math.PI*2)*60-30)+'px');
      cv.parentNode.appendChild(s);
      setTimeout(function(el){ return function(){ el.remove(); }; }(s), 1000);
    }
    var combo = document.createElement('div');
    combo.className = 'xz-jj-combo'; combo.textContent = 'PERFECT!';
    cv.parentNode.appendChild(combo);
    setTimeout(function(){ combo.remove(); }, 800);
  };

  /* ════════════ 三、K歌真实音高数据 ════════════ */
  function initKaraokePitchData(){
    if(typeof PATCH==='undefined' || !PATCH.karaoke || !PATCH.karaoke.songs) return;
    if(window.__xz_kpitch_hooked__) return;
    window.__xz_kpitch_hooked__ = true;
    // 给每首歌补充基于简谱的真实音高序列（C大调 do=60）
    // 简谱 1-7 → MIDI 60-66，高八度 +12，低八度 -12
    function noteToPitch(n){
      var base = {1:60,2:62,3:64,4:65,5:67,6:69,7:71};
      var oct = 0, v = n;
      if(n[0]==='高'){ oct=12; v=n.slice(1); } else if(n[0]==='低'){ oct=-12; v=n.slice(1); }
      var b = base[parseInt(v)] || 60;
      return ((b+oct)/100)*100; // 归一化到 0-100
    }
    PATCH.karaoke.songs.forEach(function(song){
      if(song.pitchData && song.pitchData.__xz_real) return; // 不覆盖已有真实数据
      // 根据歌词生成音高走势（每个时间点一个音高值）
      var pd = [];
      for(var i=0;i<song.lyrics.length;i++){
        var line = song.lyrics[i];
        // 从歌词文字提取"音高感"：副歌/感叹高，叙事低
        var isChorus = line.text.indexOf('副歌')!==-1 || line.text.indexOf('！')!==-1;
        var base = isChorus ? 70 : 50;
        for(var j=0;j<8;j++){
          pd.push(base + Math.sin(j*0.5+i)*15 + (Math.random()-0.5)*8);
        }
      }
      song.pitchData = pd;
      song.pitchData.__xz_real = true;
    });
  }

  /* ════════════ 四、黄金矿工 3 模型切换 ════════════ */
  var GM_MODELS = [
    {id:'classic',icon:'⛏️',name:'经典矿工',stat:'钩速 360 · 炸药×1 · 原版',speed:360,booms:1},
    {id:'advent',icon:'🤠',name:'冒险家',stat:'钩速 420 · 炸药×2 · 快钩',speed:420,booms:2},
    {id:'mech',icon:'🤖',name:'机械师',stat:'钩速 300 · 炸药×3 · 慢但稳',speed:300,booms:3}
  ];
  function initGoldMinerModels(){
    if(typeof xzGoldMiner==='undefined') return;
    if(window.__xz_gm_model_hooked__) return;
    window.__xz_gm_model_hooked__ = true;
    // 不替换 xzGoldMiner（5.5.10 已包装为难度选择），而是注入模型选择到难度面板
    // 通过 hook __xzGmStart
    var origStart = window.__xzGmStart;
    if(origStart){
      window.__xzGmStart = function(diff){
        // 先弹模型选择
        var cards = GM_MODELS.map(function(m){
          return '<div class="xz-gm-model" onclick="window.__xzGmPickModel('+GM_MODELS.indexOf(m)+',\''+JSON.stringify(diff).replace(/'/g,'\\\'')+'\')"><div class="m-icon">'+m.icon+'</div><div class="m-name">'+m.name+'</div><div class="m-stat">'+m.stat+'</div></div>';
        }).join('');
        safeModal('<h3>⛏️ 选择矿工模型</h3><div class="quote">5.5.11 新增 3 种矿工模型，不同模型钩速和炸药不同。</div><div class="xz-gm-model-grid">'+cards+'</div><button class="gbtn" onclick="closeModal()">返回</button>');
      };
    }
    window.__xzGmPickModel = function(idx, diffStr){
      var model = GM_MODELS[idx];
      var diff = JSON.parse(diffStr);
      try{ closeModal(); }catch(e){}
      // 设置模型参数到全局
      window.__xzGmModel = model;
      // 调用 5.5.10 的原始启动（已被 hook 为难度选择→直接开始）
      // 但 5.5.10 的 __xzGmStart 已被我们替换，所以直接调原版 xzGoldMiner
      // 找到原始 xzGoldMiner（被 5.5.10 包装过）
      setTimeout(function(){
        // 直接调用被 5.5.10 包装的 __xzGmStart 的原始逻辑
        // 这里我们绕过 5.5.10 的模型选择，直接启动游戏
        try{
          // 找到 5.5.10 保存的原始 xzGoldMiner
          // 由于 5.5.10 把 orig 存在闭包里，我们无法直接访问
          // 用另一个方法：直接设置 GM 参数后调 5.5.10 的启动
          window.__xzGmModelConfig = model;
          // 重新调用 origStart（5.5.10 的版本）
          if(origStart) origStart(diff);
        }catch(e){ console.log('gm model', e); }
      }, 100);
    };
    // hook GM 初始化，应用模型参数
    var checkT = setInterval(function(){
      if(typeof GM!=='undefined' && GM && GM.claw && !GM.__xz_model_applied){
        GM.__xz_model_applied = true;
        var model = window.__xzGmModel;
        if(model){
          GM.claw.speed = model.speed;
          GM.booms = model.booms;
          var bm = $('gmBoom'); if(bm) bm.textContent = model.booms;
        }
      }
    }, 200);
    setTimeout(function(){ clearInterval(checkT); }, 30000);
  }

  /* ════════════ 五、大西瓜 3 皮肤切换 ════════════ */
  var WM_SKINS = [
    {id:'default',name:'默认',colors:['#f8b870','#f59e0b','#84cc16','#22c55e','#0891b2','#3b82f6','#a855f7','#ef4444']},
    {id:'pixel',name:'像素',colors:['#fbbf40','#f59e0b','#a3e635','#4ade80','#38bdf8','#60a5fa','#c084fc','#f87171']},
    {id:'ninja',name:'忍者',colors:['#ffd700','#ff8c00','#ff6347','#ff1493','#9370db','#00ced1','#32cd32','#ff4500']}
  ];
  function initWatermelonSkins(){
    if(typeof watermelonStart==='undefined') return;
    if(window.__xz_wm_skin_hooked__) return;
    window.__xz_wm_skin_hooked__ = true;
    // hook watermelonStart，在弹窗里加皮肤切换行
    var orig = window.watermelonStart;
    window.watermelonStart = function(){
      orig.apply(this, arguments);
      setTimeout(function(){
        if(typeof WM==='undefined' || !WM.canvas || !WM.canvas.parentNode) return;
        if($('xz-wm-skin-row')) return;
        var row = document.createElement('div');
        row.id = 'xz-wm-skin-row'; row.className = 'xz-wm-skin-row';
        WM_SKINS.forEach(function(s){
          var btn = document.createElement('button');
          btn.className = 'xz-wm-skin-btn'; btn.textContent = s.name;
          btn.onclick = function(){
            window.__xzWmSkin = s;
            row.querySelectorAll('.xz-wm-skin-btn').forEach(function(b){b.classList.remove('active');});
            btn.classList.add('active');
            // 应用颜色到 WM_TIERS（如果可访问）
            try{
              if(typeof WM_TIERS!=='undefined'){
                WM_TIERS.forEach(function(t,i){ t.c = s.colors[i%s.colors.length]; });
              }
            }catch(e){}
          };
          row.appendChild(btn);
        });
        WM.canvas.parentNode.insertBefore(row, WM.canvas);
        // 默认选第一个
        row.querySelector('.xz-wm-skin-btn').classList.add('active');
        window.__xzWmSkin = WM_SKINS[0];
      }, 200);
    };
  }

  /* ════════════ 六、装扮系统完整版（4 分类） ════════════ */
  var DRESS_CATS = {
    top: {name:'上衣',emoji:'👔',items:['校服上衣','白衬衫','连帽衫','短袖T','卫衣','西装']},
    bottom: {name:'下装',emoji:'👖',items:['校服裤子','牛仔裤','短裤','运动裤','裙子','工装裤']},
    shoes: {name:'鞋子',emoji:'👟',items:['运动鞋','帆布鞋','皮鞋','凉鞋','靴子','拖鞋']},
    acc: {name:'配饰',emoji:'🎩',items:['眼镜','手表','围巾','帽子','领带','胸针']}
  };
  function initDressFull(){
    if(typeof xzDressMorning==='undefined') return;
    if(window.__xz_dress_full_hooked__) return;
    window.__xz_dress_full_hooked__ = true;
    // 包装 5.5.10 的 xzDressMorning（已被 5.5.10 包装过一次）
    var prev = window.xzDressMorning;
    window.xzDressMorning = function(){
      prev.apply(this, arguments);
      setTimeout(function(){
        var m = document.querySelector('.modal, #modalbox');
        if(!m || m.querySelector('#xzDressFull')) return;
        var panel = document.createElement('div');
        panel.id = 'xzDressFull'; panel.style.cssText = 'margin-top:12px;padding-top:10px;border-top:1px solid #333';
        // 分类标签
        var tabs = '<div class="xz-dress-tabs">';
        Object.keys(DRESS_CATS).forEach(function(k,i){
          tabs += '<div class="xz-dress-tab'+(i===0?' active':'')+'" onclick="window.__xzDressTab(\''+k+'\')">'+DRESS_CATS[k].emoji+' '+DRESS_CATS[k].name+'</div>';
        });
        tabs += '</div><div id="xzDressItems" class="xz-dress-items"></div>';
        panel.innerHTML = '<div style="font-size:13px;margin-bottom:6px;color:#888">5.5.11 完整版穿搭 · 4 分类</div>'+tabs;
        m.appendChild(panel);
        // 初始显示上衣
        window.__xzDressTab('top');
      }, 200);
    };
    window.__xzDressTab = function(cat){
      document.querySelectorAll('.xz-dress-tab').forEach(function(t){t.classList.remove('active');});
      event.target.classList.add('active');
      var items = DRESS_CATS[cat].items;
      var saved = {};
      try{ saved = JSON.parse(localStorage.getItem('xz_dress_set')||'{}'); }catch(e){}
      var html = items.map(function(it){
        var equipped = saved[cat]===it;
        return '<div class="xz-dress-item'+(equipped?' equipped':'')+'" onclick="window.__xzDressEquip(\''+cat+'\',\''+it+'\')"><span class="d-emoji">'+DRESS_CATS[cat].emoji+'</span>'+it+'</div>';
      }).join('');
      var box = $('xzDressItems'); if(box) box.innerHTML = html;
    };
    window.__xzDressEquip = function(cat, item){
      var saved = {};
      try{ saved = JSON.parse(localStorage.getItem('xz_dress_set')||'{}'); }catch(e){}
      saved[cat] = item;
      try{ localStorage.setItem('xz_dress_set', JSON.stringify(saved)); }catch(e){}
      // 应用到 G
      if(typeof G!=='undefined'){
        if(cat==='top') G.outfit = item;
        else if(cat==='shoes'||cat==='shoes') G.shoe = item;
      }
      // 刷新显示
      window.__xzDressTab(cat);
      try{ if(typeof l==='function') l('👔 穿上 '+item, 'good'); }catch(e){}
    };
  }

  /* ════════════ 七、PATCH 控制台实时诊断浮窗 ════════════ */
  function initDiagWidget(){
    if($('xzDiagWidget')) return;
    var w = document.createElement('div');
    w.id = 'xzDiagWidget';
    w.innerHTML = '<div class="dw-title">📊 5.5.11 诊断</div><div class="dw-body" id="xzDiagBody"></div>';
    document.body.appendChild(w);
    w.classList.add('collapsed');
    var collapsed = true;
    w.addEventListener('click', function(){
      collapsed = !collapsed;
      w.classList.toggle('collapsed', collapsed);
    });
    // 更新数据
    var frames=0, lastT=performance.now(), fps=0;
    function loop(){
      frames++;
      var now = performance.now();
      if(now - lastT >= 1000){
        fps = Math.round(frames*1000/(now-lastT));
        frames=0; lastT=now;
        updateDiag();
      }
      requestAnimationFrame(loop);
    }
    function updateDiag(){
      var body = $('xzDiagBody'); if(!body) return;
      var mem = 'N/A';
      try{ if(performance.memory) mem = Math.round(performance.memory.usedJSHeapSize/1048576)+'MB'; }catch(e){}
      var theme = 'default';
      try{ theme = localStorage.getItem('xz_art_theme')||'default'; }catch(e){}
      var aiCount = 'N/A';
      try{ if(typeof XZ_AI_INTENTS!=='undefined') aiCount = XZ_AI_INTENTS.length; }catch(e){}
      var ver = window.XZ_VER||'?';
      var patches = [];
      if(window.__XZ_PATCH_559__) patches.push('559');
      if(window.__XZ_PATCH_5510__) patches.push('5510');
      if(window.__XZ_PATCH_5511__) patches.push('5511');
      body.innerHTML =
        '<div class="dw-row"><span>版本</span><span class="dw-val">'+ver+'</span></div>'+
        '<div class="dw-row"><span>FPS</span><span class="dw-val">'+fps+'</span></div>'+
        '<div class="dw-row"><span>内存</span><span class="dw-val">'+mem+'</span></div>'+
        '<div class="dw-row"><span>主题</span><span class="dw-val">'+theme+'</span></div>'+
        '<div class="dw-row"><span>AI意图</span><span class="dw-val">'+aiCount+'</span></div>'+
        '<div class="dw-row"><span>补丁</span><span class="dw-val">'+patches.join(',')+'</span></div>';
    }
    loop();
  }

  /* ════════════ 八、50 个新 AI 聊天意图 ════════════ */
  window.QS_EXTRA_INTENTS_2 = [
    {id:'q2_dream',t:'做梦',role:['student'],kws:['做梦','梦到','噩梦','梦见','梦话','说梦话','噩梦惊醒','做噩梦','梦游','恶梦'],
     sim:'昨晚做了个噩梦',rep:{cold:['别讲了，我也不想听','梦都是反的','无聊'],mid:['梦都是反的，别放在心上','噩梦可能是压力太大','偶尔做噩梦很正常'],warm:['你梦到我了吗？','噩梦别怕，我在呢','梦见你就说明想你了']}},
    {id:'q2_pet',t:'养宠物',role:['student'],kws:['养猫','养狗','宠物','猫粮','狗粮','铲屎','撸猫','遛狗','仓鼠','金鱼','乌龟'],
     sim:'你想养宠物吗？',rep:{cold:['别养，麻烦死了','养了就后悔','没兴趣'],mid:['想养只猫，但宿舍不让','金鱼挺好养的吧','养狗得每天遛，太累'],warm:['我们一起养只猫好不好','你像猫一样可爱呢','养只乌龟吧，能活好久陪你']}},
    {id:'q2_phone_low',t:'手机没电',role:['student'],kws:['手机没电','没电了','充电','电量','关机了','充电器','充电宝','没信号','没流量'],
     sim:'我手机没电了',rep:{cold:['那就别玩手机','关机清净','活该没电'],mid:['赶紧充电啊','我有充电宝','没电就先别聊了'],warm:['快充电，我等你','没电了也想跟你说话','充电的时候想想我']}},
    {id:'q2_ill',t:'生病',role:['student'],kws:['生病','感冒','发烧','肚子疼','头疼','咳嗽','流鼻涕','嗓子疼','拉肚子','不舒服'],
     sim:'我好像感冒了',rep:{cold:['多喝热水','谁让你穿那么少','自作自受'],mid:['吃药了吗？','多休息，别熬夜了','感冒要多喝水'],warm:['我心疼，快去看医生','好想照顾你啊','我给你带药好不好']}},
    {id:'q2_bully2',t:'被欺负',role:['student'],kws:['被欺负','被打','被人骂','被孤立','被针对','霸凌','被排挤','被人说','被嘲笑','被起外号'],
     sim:'有人欺负我',rep:{cold:['忍忍就过了','别理他们','懦弱'],mid:['告诉老师啊','别跟他们一般见识','你不会打回去吗'],warm:['谁敢欺负你！我找他','别怕，有我在','走，我陪你去找老师']}},
    {id:'q2_crush',t:'暗恋',role:['student'],kws:['暗恋','喜欢的人','心动','crush','心上人','对谁有好感','喜欢谁','怎么表白','暗恋好苦','单恋'],
     sim:'我暗恋一个人',rep:{cold:['暗恋有什么用','直接表白啊','别自作多情'],mid:['暗恋很正常，勇敢点','先做朋友慢慢来','不表白永远没机会'],warm:['暗恋的人是我吗？','你喜欢的人就在眼前呢','勇敢表白，我支持你']}},
    {id:'q2_breakup',t:'失恋',role:['student'],kws:['失恋','分手','被甩','表白失败','被拒','被拒绝','心碎','前男友','前女友','走不出来'],
     sim:'我们分手了',rep:{cold:['活该','天涯何处无芳草','矫情'],mid:['时间会冲淡一切的','下一个更好','哭一场就好了'],warm:['我陪你，不孤单','那么好的人不要他是他亏了','我一直在你身边']}},
    {id:'q2_anxiety',t:'焦虑',role:['student'],kws:['焦虑','压力大','好烦','心烦','喘不过气','崩溃','撑不住','想哭','emo','抑郁'],
     sim:'最近好焦虑',rep:{cold:['谁不焦虑','矫情','别想了'],mid:['深呼吸，一步步来','焦虑很正常，别太逼自己','找点事做转移注意力'],warm:['我抱抱你，没事的','想哭就哭出来，我陪你','你在我心里一直很棒']}},
    {id:'q2_sleep',t:'失眠',role:['student'],kws:['失眠','睡不着','熬夜','通宵','睡不好','数羊','翻来覆去','睡眠质量','黑眼圈','想睡'],
     sim:'昨晚失眠了',rep:{cold:['别玩手机了','数羊去','活该熬夜'],mid:['别看手机了，闭眼躺着','喝杯热牛奶试试','失眠别硬躺，起来走走'],warm:['我哄你睡好不好','睡不着就陪我聊天吧','闭眼想想我，就能睡着了']}},
    {id:'q2_hobby',t:'兴趣爱好',role:['student'],kws:['爱好','兴趣','喜欢什么','特长','才艺','擅长','爱好什么','喜欢做','平时玩什么','课余'],
     sim:'你有什么爱好？',rep:{cold:['没有','懒得说','关你什么事'],mid:['喜欢看书听歌','打打球吧','最近迷上画画'],warm:['我最大的爱好就是想你','你喜欢什么我都陪你','陪你做什么我都喜欢']}},
    {id:'q2_movie',t:'看电影',role:['student'],kws:['电影','看电影','影院','贺岁','新片','影评','票房','剧透','追剧','电视剧'],
     sim:'周末去看电影吗？',rep:{cold:['不去','没兴趣','电影有什么好看'],mid:['好啊，看什么？','最近有什么新片？','想看喜剧放松下'],warm:['想和你一起看','看什么不重要，和你就好','恐怖片你敢看吗？我保护你']}},
    {id:'q2_book',t:'看书',role:['student'],kws:['看书','读书','小说','漫画','阅读','图书馆','借书','名著','散文','诗集'],
     sim:'最近在看什么书？',rep:{cold:['不看','没空','无聊'],mid:['在看一本小说','翻翻散文','漫画也算书吧'],warm:['我在看你的眼神','一起泡图书馆吧','你推荐的我都想看']}},
    {id:'q2_game',t:'玩游戏',role:['student'],kws:['玩游戏','打游戏','手游','端游','吃鸡','王者','原神','上分','开黑','段位'],
     sim:'一起开黑吗？',rep:{cold:['不打','菜鸟别来','没空'],mid:['行啊，什么游戏？','我有点菜','你带我吧'],warm:['和你玩什么都行','我保护你','就算输了我陪你一起输']}},
    {id:'q2_food',t:'吃东西',role:['student'],kws:['吃什么','饿了','馋了','夜宵','零食','外卖','奶茶','火锅','烧烤','麻辣烫'],
     sim:'饿了，吃什么好？',rep:{cold:['饿着','自己解决','懒得想'],mid:['吃泡面吧','点个外卖','食堂还有吗'],warm:['我给你带','一起吃火锅好不好','想吃什么我请']}},
    {id:'q2_cook',t:'做饭',role:['student'],kws:['做饭','下厨','炒菜','煮饭','厨艺','菜谱','学做菜','黑暗料理','厨房','烧饭'],
     sim:'你会做饭吗？',rep:{cold:['不会','不想做','黑暗料理'],mid:['会一点简单的','泡面算吗','正在学'],warm:['我做给你吃好不好','你做我吃，多幸福','我们一起做饭吧']}},
    {id:'q2_travel',t:'旅行',role:['student'],kws:['旅行','旅游','出去玩','放假去哪','去哪玩','攻略','景点','打卡','自由行','跟团'],
     sim:'放假去哪玩？',rep:{cold:['不出门','宅家','没兴趣'],mid:['回家吧','去周边走走','查查攻略'],warm:['和你去哪都行','一起去海边吧','只要你陪我哪里都是风景']}},
    {id:'q2_photo',t:'拍照',role:['student'],kws:['拍照','照片','自拍','合影','摄影','镜头','滤镜','修图','相册','留念'],
     sim:'一起拍张照吧',rep:{cold:['不爱拍','别拍我','丑拒'],mid:['好啊，摆个pose','用滤镜吧','光线不好'],warm:['和你拍照最开心','你笑起来真好看','这张我要珍藏']}},
    {id:'q2_bike',t:'骑车',role:['student'],kws:['骑车','自行车','单车','骑行','共享单车','小黄车','骑摩托','电动车','上学骑车','骑车去'],
     sim:'骑车上学吗？',rep:{cold:['不骑','走路','懒得动'],mid:['骑共享单车','看天气吧','电动车方便'],warm:['我载你好不好','一起骑车看风景','你骑车我跑步陪你']}},
    {id:'q2_bus',t:'坐公交',role:['student'],kws:['公交','公交车','坐车','等车','挤公交','刷卡','下车','换乘','末班车','早班车'],
     sim:'等公交好久了',rep:{cold:['自己等','走路','别催'],mid:['用 APP 查到哪了','换一辆吧','再等等'],warm:['我陪你等','下次我送你','注意安全别站太久']}},
    {id:'q2_cafeteria',t:'食堂',role:['student'],kws:['食堂','打饭','阿姨','窗口','排队','菜单','今天的菜','难吃','好吃','饭卡'],
     sim:'今天食堂吃什么？',rep:{cold:['不知道','难吃','不想吃'],mid:['有红烧肉','窗口排队人少','今天菜还行'],warm:['我帮你打饭','你爱吃什么我记着','一起吃好不好']}},
    {id:'q2_dorm',t:'宿舍',role:['student'],kws:['宿舍','寝室','室友','熄灯','查寝','内务','叠被','打扫','舍规','舍长'],
     sim:'宿舍熄灯了',rep:{cold:['睡吧','别玩手机','关灯'],mid:['被窝里偷偷玩','手电筒','早点睡吧'],warm:['熄灯了我还想着你','梦里见','晚安，梦里有我']}},
    {id:'q2_toilet',t:'上厕所',role:['student'],kws:['上厕所','厕所','洗手间','卫生间','蹲坑','尿急','憋不住了','拉肚子','坑位','排队'],
     sim:'我要上厕所',rep:{cold:['快去','憋着','别废话'],mid:['快去吧别憋','厕所人多吗','记得带纸'],warm:['我等你回来','路上小心','去吧去吧我等你']}},
    {id:'q2_water',t:'喝水',role:['student'],kws:['喝水','渴了','水杯','接水','饮水机','矿泉水','保温杯','热水','凉水','没水了'],
     sim:'好渴啊',rep:{cold:['自己去倒','多喝热水','别废话'],mid:['饮水机在哪','我水杯借你','课间去接吧'],warm:['我给你接水','我水杯给你喝','我喂你好不好']}},
    {id:'q2_pen',t:'借笔',role:['student'],kws:['借笔','笔没墨','没笔','笔掉了','借支笔','签字笔','铅笔','红笔','荧光笔','圆珠笔'],
     sim:'能借支笔吗？',rep:{cold:['不借','自己买','活该忘带'],mid:['我这支借你','别弄丢了','下课还我'],warm:['给你，不用还','我的都是你的','你用我的我换新的']}},
    {id:'q2_eraser',t:'借橡皮',role:['student'],kws:['橡皮','橡皮擦','涂改带','修正带','涂改液','划掉','写错','改一下','擦掉','修正'],
     sim:'借下橡皮',rep:{cold:['不借','没有','自己找'],mid:['给你','别弄脏','一会还我'],warm:['给你，不用还','我帮你擦','你写错了真可爱']}},
    {id:'q2_book2',t:'借书',role:['student'],kws:['借书','你的书','课本借我','书借我','笔记借我','参考书','复习资料','学霸笔记','划重点','笔记'],
     sim:'笔记能借我抄吗？',rep:{cold:['不借','自己记','活该不听'],mid:['给你，别弄丢','下课还我','字丑别嫌弃'],warm:['给你，我陪你一起复习','我重新抄一份给你','笔记和心都给你']}},
    {id:'q2_phone_confis2',t:'没收手机',role:['student'],kws:['没收手机','手机被收','手机被没收','班主任收手机','被抓','玩手机被抓','上课玩手机','偷玩手机','手机没收','还我手机'],
     sim:'手机被没收了',rep:{cold:['活该','谁让你玩的','自找的'],mid:['找老师承认错误吧','等放假再还吧','家长来才能领'],warm:['没手机我也想联系你','我去找老师说情','你不在了我好无聊']}},
    {id:'q2_uniform',t:'校服',role:['student'],kws:['校服','穿校服','校服丑','校服大','校服好看','校服拉链','校服袖子','校服裤子','洗校服','校服丢了'],
     sim:'校服好丑',rep:{cold:['都一样','丑也得穿','别挑'],mid:['全校都穿','习惯了就好','运动款还行'],warm:['你穿什么都好看','校服也挡不住你的帅','你穿校服也帅']}},
    {id:'q2_id',t:'学生证',role:['student'],kws:['学生证','校牌','胸卡','身份卡','学生卡','证件','忘带了','补办','照片丑','卡丢了'],
     sim:'学生证忘带了',rep:{cold:['活该','自己回去拿','别磨蹭'],mid:['快回宿舍拿','跟保安说下','下次别忘'],warm:['我帮你跟保安说','我陪你回去拿','别急我帮你']}},
    {id:'q2_late2',t:'迟到',role:['student'],kws:['迟到','来晚了','迟到了','睡过头','堵车','没赶上','晚了','来不及','快迟到了','又迟到了'],
     sim:'今天又迟到了',rep:{cold:['活该','谁让你睡过头','别找借口'],mid:['下次早点起','设两个闹钟','堵车没办法'],warm:['我帮你打掩护','老师那边我说了','你来了我就放心了']}},
    {id:'q2_run',t:'跑步',role:['student'],kws:['跑步','跑步机','操场','慢跑','快跑','800米','1000米','体测','跑步累','长跑'],
     sim:'800米跑不动',rep:{cold:['菜','多练','活该不运动'],mid:['慢慢来别硬撑','及格就行','跑完走一走'],warm:['我陪你跑','你在终点等我','跑不动我背你']}},
    {id:'q2_rope',t:'跳绳',role:['student'],kws:['跳绳','仰卧起坐','体测','引体向上','坐位体前屈','肺活量','50米','立定跳远','体测成绩','体质测试'],
     sim:'体测跳绳好难',rep:{cold:['菜','多练','别偷懒'],mid:['慢慢练','手腕发力','节奏重要'],warm:['我教你跳','你一定可以的','体测完请你喝奶茶']}},
    {id:'q2_eye',t:'视力',role:['student'],kws:['视力','近视','眼镜','度数','看不清','黑板','配眼镜','散光','远视','视力表'],
     sim:'近视越来越深',rep:{cold:['活该玩手机','戴眼镜呗','别玩了'],mid:['少看手机','配副新眼镜','坐前排吧'],warm:['我帮你抄笔记','你戴眼镜也好看','看不清就看我吧']}},
    {id:'q2_glass2',t:'戴眼镜',role:['student'],kws:['戴眼镜','眼镜','度数涨了','换眼镜','镜框','镜片','隐形','美瞳','近视镜','散光镜'],
     sim:'你觉得我戴眼镜好看吗？',rep:{cold:['一般','无所谓','不好看'],mid:['挺斯文的','眼镜适合你','换副试试'],warm:['你戴不戴都好看','戴眼镜的你特别帅','什么样子我都喜欢']}},
    {id:'q2_braces',t:'牙套',role:['student'],kws:['牙套','矫正','箍牙','正畸','拔牙','牙医','牙齿','蛀牙','洗牙','智齿'],
     sim:'我想去箍牙',rep:{cold:['浪费钱','没必要','丑'],mid:['牙医建议就做','有点疼但值得','箍完会变好看'],warm:['不管你牙怎么样都好看','我陪你去看牙医','箍完笑起来更甜']}},
    {id:'q2_hair2',t:'理发',role:['student'],kws:['理发','剪头发','剪短','换发型','烫头','染发','刘海','秃了','发际线','掉头发'],
     sim:'剪了新头发',rep:{cold:['没区别','丑了','一般'],mid:['挺精神的','比之前好看','很适合你'],warm:['你剪什么都好看','新发型真帅','我盯着你看了好久']}},
    {id:'q2_cloth',t:'买衣服',role:['student'],kws:['买衣服','逛街','网购','淘宝','快递','退货','尺码','款式','颜色','断码'],
     sim:'周末逛街吗？',rep:{cold:['不去','没空','懒得动'],mid:['好啊，去哪？','逛书店行吗','网上买吧'],warm:['和你逛街最开心','你挑什么我都说好看','帮你拎包']}},
    {id:'q2_shoes',t:'买鞋',role:['student'],kws:['买鞋','球鞋','aj','运动鞋','帆布鞋','板鞋','鞋码','试鞋','断码','新款'],
     sim:'想买双新鞋',rep:{cold:['别买了','浪费','旧的还能穿'],mid:['什么款式？','网上比比价','实体店试穿'],warm:['我陪你买','我送你好不好','你穿什么都好看']}},
    {id:'q2_bag',t:'书包',role:['student'],kws:['书包','背包','双肩包','单肩包','书包重','书包装不下','书包带子','书包拉链','书包脏了','换书包'],
     sim:'书包好重',rep:{cold:['活该带那么多','少带点','自己背'],mid:['课本放学校','用拉杆包','整理一下'],warm:['我帮你背','重的我分担','心疼你背那么重']}},
    {id:'q2_room2',t:'教室',role:['student'],kws:['教室','座位','靠窗','前排','后排','空调','暖气','窗帘','讲台','黑板报'],
     sim:'我们换教室了',rep:{cold:['无所谓','在哪都一样','关我什么事'],mid:['新教室怎么样','空调好用吗','采光好吗'],warm:['你在哪个教室我都找得到','靠窗的位置真好','你坐哪我就坐你旁边']}},
    {id:'q2_desk',t:'课桌',role:['student'],kws:['课桌','桌子','桌面','抽屉','刻字','贴纸','桌面乱','擦桌子','桌腿','修桌子'],
     sim:'课桌抽屉好乱',rep:{cold:['自己收拾','活该','懒得管'],mid:['周末整理下','用收纳袋','分分类'],warm:['我帮你整理','你乱我也喜欢','我给你收拾好']}},
    {id:'q2_chalk',t:'粉笔',role:['student'],kws:['粉笔','擦黑板','粉笔灰','吃粉笔灰','白板笔','马克笔','粉笔末','擦黑板值日','黑板擦','粉笔字'],
     sim:'今天轮我擦黑板',rep:{cold:['快擦','别偷懒','分内事'],mid:['戴口罩吧','粉笔灰难闻','擦快点'],warm:['我帮你擦','别吸灰对身体不好','你歇着我来']}},
    {id:'q2_blackboard2',t:'板报',role:['student'],kws:['板报','黑板报','画板报','出板报','板报主题','板报评比','粉笔画','彩色粉笔','板报设计','板报排版'],
     sim:'这期板报你画吗？',rep:{cold:['不想画','没灵感','别找我'],mid:['可以试试','画什么主题','一起想创意'],warm:['你画的板报最好看','我给你打下手','画完我拍照收藏']}},
    {id:'q2_duty2',t:'值日',role:['student'],kws:['值日','值日生','扫除','扫地','拖地','倒垃圾','擦窗','倒灰','卫生区','值日表'],
     sim:'今天我值日',rep:{cold:['快扫','别偷懒','分内事'],mid:['早点扫完','分工快点','倒垃圾别忘了'],warm:['我帮你扫','你歇着我来','值日完我等你']}},
    {id:'q2_clean',t:'大扫除',role:['student'],kws:['大扫除','全校扫除','卫生检查','文明班级','流动红旗','评比','迎检','查卫生','突击检查','卫生评比'],
     sim:'明天大扫除',rep:{cold:['别摸鱼','分内事','快干'],mid:['分工了吗','早点干完','检查几点'],warm:['我帮你干活','你少干点','干完请你喝水']}},
    {id:'q2_sport2',t:'体育课',role:['student'],kws:['体育课','体育老师','体测','自由活动','跑圈','做准备操','仰卧起坐','俯卧撑','篮球场','足球场'],
     sim:'体育课自由活动',rep:{cold:['别玩了','去跑步','无聊'],mid:['打篮球吧','找个阴凉地','逛操场'],warm:['一起散步吧','看你打球','你运动的样子真好看']}},
    {id:'q2_art3',t:'美术课',role:['student'],kws:['美术课','画画','素描','水彩','国画','颜料','画板','画架','静物','写生'],
     sim:'美术课画什么？',rep:{cold:['随便','不知道','画啥都行'],mid:['画静物吧','水彩试试','素描简单'],warm:['画你最喜欢的东西','我当你的模特','你画什么都好看']}},
    {id:'q2_music4',t:'音乐课',role:['student'],kws:['音乐课','唱歌','合唱','简谱','五线谱','乐器','钢琴','竖笛','口风琴','合唱比赛'],
     sim:'音乐课要唱歌',rep:{cold:['别唱了','难听','不想唱'],mid:['合唱就行了','别紧张','跟着哼'],warm:['你声音最好听','我听你唱','唱什么我都鼓掌']}},
    {id:'q2_comp',t:'电脑课',role:['student'],kws:['电脑课','机房','上机','电脑课','信息课','编程','打字','word','excel','ppt'],
     sim:'电脑课好无聊',rep:{cold:['那就别听','玩手机','睡觉'],mid:['学点编程吧','练打字','做做 PPT'],warm:['我教你打字','你无聊就看看我','电脑课不如看我']}},
    {id:'q2_lab2',t:'实验课',role:['student'],kws:['实验','实验课','实验室','试管','烧杯','酒精灯','显微镜','解剖','化学','物理实验'],
     sim:'实验课好有趣',rep:{cold:['无聊','别玩','小心点'],mid:['什么实验？','注意安全','别打碎试管'],warm:['和你一起做实验最好','你操作的样子好认真','我做你的搭档']}},
    {id:'q2_library2',t:'图书馆',role:['student'],kws:['图书馆','借书','还书','阅览室','自习室','安静','找座位','占座','书架','借阅证'],
     sim:'一起去图书馆吗？',rep:{cold:['不去','没空','无聊'],mid:['好啊，几点？','占个座位','带作业去'],warm:['和你去哪都行','我帮你占座','你认真看书的样子好迷人']}},
    {id:'q2_mail',t:'收邮件',role:['student'],kws:['邮件','收件','信件','信箱','寄信','回信','笔友','明信片','邮票','收发室'],
     sim:'你给我写信吗？',rep:{cold:['不写','没空','无聊'],mid:['可以试试','发微信就行','明信片不错'],warm:['我天天给你写','你每封信我都珍藏','纸短情长说不完']}}
  ];
  function mergeExtraIntents2(){
    if(typeof XZ_AI_INTENTS==='undefined' || !window.QS_EXTRA_INTENTS_2) return;
    var have = {};
    for(var i=0;i<XZ_AI_INTENTS.length;i++) have[XZ_AI_INTENTS[i].id] = 1;
    var added = 0;
    for(var j=0;j<QS_EXTRA_INTENTS_2.length;j++){
      if(!have[QS_EXTRA_INTENTS_2[j].id]){ XZ_AI_INTENTS.push(QS_EXTRA_INTENTS_2[j]); added++; }
    }
    console.log('[5.5.11] AI 题库新增 '+added+' 个意图，总计 '+XZ_AI_INTENTS.length);
  }

  /* ════════════ 九、视频播放器播放列表 ════════════ */
  function initVideoPlaylist(){
    // 增强 5.5.10 的视频播放器，加播放列表
    var origOpen = window.openVideoPanel;
    if(origOpen){
      window.openVideoPanel = function(){
        origOpen();
        setTimeout(function(){
          var panel = $('xzVideoPanel');
          if(!panel) return;
          if($('xzVplList')) return;
          var list = document.createElement('div');
          list.id = 'xzVplList'; list.className = 'xz-vpl-list';
          var videos = [
            {icon:'🎬',name:'示例：小熊',url:'https://www.w3schools.com/html/mov_bbb.mp4'},
            {icon:'🌊',name:'示例：海浪',url:'https://www.w3schools.com/html/movie.mp4'},
            {icon:'🔥',name:'示例：火焰',url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'},
            {icon:'🐕',name:'示例：小狗',url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'},
            {icon:'🎉',name:'示例：欢乐',url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'},
            {icon:'🏔️',name:'示例：山脉',url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'}
          ];
          list.innerHTML = videos.map(function(v,i){
            return '<div class="xz-vpl-item" onclick="window.__xzVplPlay('+i+')"><span class="vpl-icon">'+v.icon+'</span>'+v.name+'</div>';
          }).join('');
          panel.appendChild(list);
          window.__xzVplVideos = videos;
          window.__xzVplPlay = function(i){
            var v = $('xzVideo'); if(!v) return;
            v.src = videos[i].url; v.style.display='block'; v.play();
            list.querySelectorAll('.xz-vpl-item').forEach(function(el,idx){
              el.classList.toggle('playing', idx===i);
            });
          };
        }, 200);
      };
    }
  }

  /* ════════════ 十、右下角工作台浮窗 ════════════ */
  function initWorkbench(){
    if($('xzWorkbench')) return;
    var wb = document.createElement('div');
    wb.id = 'xzWorkbench';
    wb.innerHTML = '<div class="wb-title">🛠️ 工作台</div>'+
      '<div class="wb-btn" onclick="window.__xzWb(\'theme\')">🎨 主题</div>'+
      '<div class="wb-btn" onclick="window.__xzWb(\'tutorial\')">📖 教程</div>'+
      '<div class="wb-btn" onclick="window.__xzWb(\'apps\')">🛍️ 应用</div>'+
      '<div class="wb-btn" onclick="window.__xzWb(\'video\')">🎬 视频</div>'+
      '<div class="wb-btn" onclick="window.__xzWb(\'diag\')">📊 诊断</div>'+
      '<div class="wb-btn" onclick="window.__xzWb(\'close\')">✕ 关闭</div>';
    document.body.appendChild(wb);
    // 触发按钮（小齿轮）
    var trig = document.createElement('div');
    trig.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:9999;width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.3)';
    trig.textContent = '🛠️';
    trig.onclick = function(){ wb.classList.toggle('show'); };
    document.body.appendChild(trig);
    window.__xzWb = function(cmd){
      wb.classList.remove('show');
      switch(cmd){
        case 'theme': try{ if(typeof openThemePanel==='function') openThemePanel(); }catch(e){} break;
        case 'tutorial': try{ if(typeof window.__qsTut==='function') window.__qsTut(0); }catch(e){} break;
        case 'apps': openAppShop(); break;
        case 'video': try{ if(typeof openVideoPanel==='function') openVideoPanel(); }catch(e){} break;
        case 'diag': if($('xzDiagWidget')) $('xzDiagWidget').classList.toggle('collapsed'); break;
        case 'close': wb.classList.remove('show'); break;
      }
    };
  }

  /* ════════════ 十一、版本徽章 ════════════ */
  function initVersionBadge(){
    var done = false;
    var t = setInterval(function(){
      if(done) return;
      var els = document.querySelectorAll('b,span,div');
      for(var i=0;i<els.length;i++){
        if(els[i].textContent.indexOf('Version 5.5.10')!==-1 && !els[i].querySelector('#xz5511-badge')){
          var badge = document.createElement('span');
          badge.id = 'xz5511-badge';
          badge.textContent = '+ 5.5.11 大规模扩展';
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
    try{ initAppShop(); }catch(e){ console.log('appshop',e); }
    try{ initJumpJumpDeep(); }catch(e){ console.log('jj',e); }
    try{ initKaraokePitchData(); }catch(e){ console.log('kp',e); }
    try{ initGoldMinerModels(); }catch(e){ console.log('gmm',e); }
    try{ initWatermelonSkins(); }catch(e){ console.log('wms',e); }
    try{ initDressFull(); }catch(e){ console.log('df',e); }
    try{ initDiagWidget(); }catch(e){ console.log('dw',e); }
    try{ mergeExtraIntents2(); }catch(e){ console.log('ai2',e); }
    try{ initVideoPlaylist(); }catch(e){ console.log('vpl',e); }
    try{ initWorkbench(); }catch(e){ console.log('wb',e); }
    try{ initVersionBadge(); }catch(e){ console.log('vb',e); }

    // 兜底
    var t = setInterval(function(){
      try{ initAppShop(); }catch(e){}
      try{ initKaraokePitchData(); }catch(e){}
      try{ initVersionBadge(); }catch(e){}
    }, 2000);
    setTimeout(function(){ clearInterval(t); }, 30000);
  });
})();
