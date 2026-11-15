/* 5.5.9 v3 · 五大主题 + 手机精准修复 + 自动取消 + 新手教程 + AI题库大扩容 (id="xz559") */
(function(){
  if(window.__XZ_PATCH_559__) return;
  window.__XZ_PATCH_559__ = true;

  function ready(fn){
    if(document.readyState !== 'loading') setTimeout(fn, 80);
    else document.addEventListener('DOMContentLoaded', function(){ setTimeout(fn, 80); });
  }
  function $(id){ return document.getElementById(id); }
  function safeModal(h){
    try{ if(typeof modal === 'function'){ modal(h); return true; } }catch(e){}
    return false;
  }

  /* ════════════ 一、五大美术主题系统 ════════════ */
  var THEMES = [
    {id:'xizi',      icon:'🌊', name:'西子湖', desc:'西湖烟雨 · 暮色玻璃（默认）'},
    {id:'default',   icon:'🎨', name:'默认',   desc:'原始深蓝玻璃风格'},
    {id:'qingshan',  icon:'🏔️', name:'氢山',   desc:'白墙黛瓦 · 临湖青山'},
    {id:'guanggu',   icon:'🌅', name:'光谷',   desc:'清新明亮 · 光之谷'},
    {id:'warm',      icon:'☀️', name:'暖阳',   desc:'暖色调 · 温馨校园'},
    {id:'darknight', icon:'🌙', name:'暗夜',   desc:'深紫星空 · 静谧夜'}
  ];
  var THEME_CLASSES = ['theme-xizi','theme-qingshan','theme-guanggu','theme-warm','theme-darknight'];

  function applyArtTheme(id){
    THEME_CLASSES.forEach(function(c){ document.body.classList.remove(c); });
    if(id && id !== 'default') document.body.classList.add('theme-' + id);
    try{ localStorage.setItem('xz_art_theme', id || 'default'); }catch(e){}
  }
  function getCurrentTheme(){
    try{
      var t = localStorage.getItem('xz_art_theme');
      // 新默认主题：西子湖。若用户未曾选择（或仍是旧默认 'default'），则使用西子湖
      if(!t || t === 'default') return 'xizi';
      return t;
    }catch(e){ return 'xizi'; }
  }
  window.__qsApplyTheme = function(id){
    applyArtTheme(id);
    var btns = document.querySelectorAll('.qs-theme-btn');
    btns.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-tid') === id); });
  };
  function openThemePanel(){
    var cur = getCurrentTheme();
    var h = '<h3>🎨 美术主题</h3><div class="quote">随时切换 5 种预设美术风格，立即生效，自动保存</div>';
    THEMES.forEach(function(t){
      var active = (cur === t.id);
      h += '<button class="gbtn qs-theme-btn' + (active ? ' active' : '') + '" data-tid="' + t.id + '" ' +
           'onclick="window.__qsApplyTheme(\'' + t.id + '\')">' +
           '<span>' + t.icon + ' ' + t.name + ' <span class="dim small">' + t.desc + '</span></span>' +
           (active ? '<span>✅</span>' : '') + '</button>';
    });
    h += '<button class="gbtn" style="margin-top:10px;width:100%" onclick="closeModal()">关闭</button>';
    safeModal(h);
  }
  function addRowBtn(container, id, cls, html, fn, beforeSel){
    if(!container || $(id)) return;
    var btn = document.createElement('button');
    btn.id = id; btn.className = cls; btn.innerHTML = html;
    btn.addEventListener('click', function(e){ e.stopPropagation(); fn(); });
    var anchor = beforeSel ? container.querySelector(beforeSel) : null;
    if(anchor && anchor.parentNode) anchor.parentNode.insertBefore(btn, anchor);
    else container.appendChild(btn);
  }
  function initThemeButton(){
    var c = $('xzRow2') || document.querySelector('.xz-func-row');
    if(!c) return;
    addRowBtn(c, 'xz559-theme-btn', 'mini xf-old', '🎨 主题', openThemePanel, '[onclick*="openSettings"]');
  }

  /* ════════════ 二、新手教程 ════════════ */
  var TUT_PAGES = [
    {t:'📖 新手教程 · 1/6 基础操作', c:
      '欢迎来到《杭州西子实验学校模拟器》！<br><br>'+
      '🎮 <b>开始游戏</b>：点击"开始游戏"按钮，选择横屏/竖屏，创建角色（姓名、性别、选考科目、恋爱倾向、住宿/走读、手机、道具、天赋）。<br>'+
      '📱 <b>双模式</b>：学生模式有课表/小卖部/出门单；老师模式有巡查/行政会/纪委。<br>'+
      '💾 <b>自动存档</b>：进度自动保存，下次打开点"继续上次进度"即可。'},
    {t:'📖 新手教程 · 2/6 顶栏信息', c:
      '顶部三行是你的"仪表盘"：<br><br>'+
      '⭐ <b>第一行</b>：名声（点击查看详情）· 当前歌词 · 性取向（❤️/🌈）· 液态玻璃开关 🧊。<br>'+
      '🧾 <b>第二行</b>：身份 · 日期时间 · 位置 · 天气 · 金钱处分 · 🎵 音乐（点击打开播放器）。<br>'+
      '🔘 <b>第三行</b>：功能按钮（手机/恋爱/AI聊天/白板/小游戏/设置…），点"⏷ 更多"展开全部；右下角圆形按钮是工作台。'},
    {t:'📖 新手教程 · 3/6 校园日常', c:
      '⏰ <b>作息</b>：6:10 起床铃 → 早读 → 上午四节 → 午休 → 下午 → 晚自习四节 → 22:20 熄灯，全真实作息。<br>'+
      '📚 <b>上课</b>：时段内会出现课堂动作（认真听讲/偷看小说/睡觉…），不同选择不同后果。<br>'+
      '🎯 <b>选择</b>：屏幕中央是当前场景与选项，点按钮推进剧情；⏩ 自动模式可挂机（右下角红色浮钮可随时取消）。<br>'+
      '🌦️ <b>天气</b>：晴/雨/雾/台风会影响心情与活动。'},
    {t:'📖 新手教程 · 4/6 恋爱与AI聊天', c:
      '💗 <b>恋爱系统</b>：点"💗 恋爱"查看关系，可以表白、约会、纪念日；"💘 暗恋"系统让你偷偷喜欢一个人。<br>'+
      '🤖 <b>AI 聊天</b>：点"🤖 AI聊天"打开微信式聊天框，直接打字对话！<br>'+
      '💡 <b>聊天技巧</b>：题库超丰富（吃饭/上课/八卦/心事都能聊）；打错别字、缩写（yyds、xswl）也能识别；相似问题会提示"你是不是想问…"；回复按对方性格和好感度变化——好感低很冷淡，好感高会主动撩你！'},
    {t:'📖 新手教程 · 5/6 小游戏与测试', c:
      '🎮 <b>小游戏大厅</b>：合成大西瓜、黄金矿工、跳一跳等。<br>'+
      '🖐️ <b>跳一跳</b>：长按蓄力松手起跳，可调灵敏度/蓄力（低中高），支持全屏。<br>'+
      '🧠 <b>心理测试/MBTI</b>：在工作台面板里，霍兰德 72 题、KSOG 69 题、MBTI 都能测。<br>'+
      '🎤 <b>K歌</b>：选歌开唱，音轨从右向左，判定线打 Perfect/Good/Miss，五维评分。<br>'+
      '🖊️ <b>希沃白板</b>：下课后可以画画，手机上支持触屏！'},
    {t:'📖 新手教程 · 6/6 设置与主题', c:
      '🎨 <b>美术主题</b>：点顶栏"🎨 主题"按钮，六种风格随时切换（西子湖·默认 / 氢山 / 光谷 / 暖阳 / 暗夜 / 原版），自动保存。<br>'+
      '🌗 <b>显示模式</b>：设置里可切白天/黑夜/自动（18点后自动入夜）。<br>'+
      '🎵 <b>音乐</b>：点顶栏"🎵"打开播放器，六首真歌+同步歌词，音量可调。<br>'+
      '🏆 <b>成就/图鉴</b>：更多按钮里可查看成就与校园像素图鉴。<br><br>'+
      '<b>祝你在西子实验学校度过难忘的时光！</b> 🏫✨'}
  ];
  function qsTutorial(idx){
    idx = idx || 0;
    var p = TUT_PAGES[idx];
    var h = '<h3>' + p.t + '</h3><div class="quote" style="line-height:1.8">' + p.c + '</div>';
    h += '<div style="display:flex;gap:8px;margin-top:10px">';
    if(idx > 0) h += '<button class="gbtn" style="flex:1" onclick="window.__qsTut(' + (idx-1) + ')">← 上一页</button>';
    if(idx < TUT_PAGES.length-1) h += '<button class="gbtn" style="flex:1" onclick="window.__qsTut(' + (idx+1) + ')">下一页 →</button>';
    else h += '<button class="gbtn" style="flex:1" onclick="closeModal()">开始游玩 🎉</button>';
    h += '</div>';
    if(idx < TUT_PAGES.length-1) h += '<button class="gbtn" style="width:100%;margin-top:6px" onclick="closeModal()">跳过教程</button>';
    safeModal(h);
  }
  window.__qsTut = qsTutorial;
  function initTutorialBtn(){
    var c = $('xzRow2') || document.querySelector('.xz-func-row');
    if(c) addRowBtn(c, 'xz559-tut-btn', 'mini xf-old', '📖 教程', function(){ qsTutorial(0); }, '[onclick*="openSettings"]');
    // 开始页也放一个入口
    var hero = document.querySelector('#start .hero-buttons, #start .hero-btns');
    if(hero && !$('xz559-tut-hero')){
      var b = document.createElement('button');
      b.id = 'xz559-tut-hero';
      b.className = 'hero-btn ghost';
      b.innerHTML = '📖 新手教程';
      b.addEventListener('click', function(){ qsTutorial(0); });
      hero.appendChild(b);
    }
  }
  function hookStartGame(){
    if(window.__qsHookedSG) return;
    var sg = window.startGame;
    if(typeof sg !== 'function') return;
    window.__qsHookedSG = true;
    window.startGame = function(){
      var r = sg.apply(this, arguments);
      try{
        var seen = false;
        try{ seen = localStorage.getItem('xz_tut_seen') === '1'; }catch(e){}
        if(!seen){
          setTimeout(function(){
            var gm = $('game');
            if(gm && gm.classList && gm.classList.contains('show')){
              qsTutorial(0);
              try{ localStorage.setItem('xz_tut_seen','1'); }catch(e){}
            }
          }, 1200);
        }
      }catch(e){}
      try{
        // 默认开始播放背景音乐（处于首次交互手势内，符合浏览器自动播放策略）
        setTimeout(function(){
          try{
            if(typeof BGM_ON !== 'undefined' && BGM_ON &&
               typeof BGM_AUD !== 'undefined' && BGM_AUD && BGM_AUD.paused){ bgmPlay(); }
          }catch(e){}
        }, 400);
      }catch(e){}
      return r;
    };
  }

  /* ════════════ 三、自动取消浮钮 ════════════ */
  function initAutoCancel(){
    if($('qs-auto-cancel')) return;
    var btn = document.createElement('button');
    btn.id = 'qs-auto-cancel';
    btn.innerHTML = '⏹ 取消自动';
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      try{ if(typeof AUTO !== 'undefined' && AUTO && typeof toggleAuto === 'function') toggleAuto(); }catch(err){}
      btn.classList.remove('show');
    });
    document.body.appendChild(btn);
    setInterval(function(){
      try{ btn.classList.toggle('show', (typeof AUTO !== 'undefined') && AUTO); }catch(e){}
    }, 500);
  }

  /* ════════════ 四、安全的长按点字全屏 ════════════ */
  function initTapEnlarge(){
    if($('qs-fullview')) return;
    var box = document.createElement('div');
    box.id = 'qs-fullview';
    box.innerHTML = '<div class="content" id="qs-full-content"></div><div class="hint">点击任意处关闭</div>';
    document.body.appendChild(box);
    box.addEventListener('click', function(){ box.classList.remove('active'); });
    var timer = null, target = null;
    function fire(el){
      var text = (el.getAttribute('title') || el.textContent || '').trim();
      if(!text || text.length < 2) return;
      $('qs-full-content').textContent = text;
      box.classList.add('active');
    }
    function cancel(){ if(timer){ clearTimeout(timer); timer = null; } }
    var EXCLUDE = 'button,a,input,textarea,select,canvas,#modalbox,#mpList,.song,.mini,.gbtn,.pill,.choice,.choice-btn,[onclick],[role=button],audio,video,.topbar,.xz-info-row,.xz-func-row';
    document.addEventListener('touchstart', function(e){
      if(window.innerWidth > 600) return;
      var t = e.target;
      if(t.closest(EXCLUDE)) return;
      if(t.children && t.children.length === 0 && t.textContent && t.textContent.trim().length > 0){
        target = t;
        timer = setTimeout(function(){ fire(target); }, 600);
      }
    }, {passive:true});
    document.addEventListener('touchend', cancel, {passive:true});
    document.addEventListener('touchmove', cancel, {passive:true});
    document.addEventListener('touchcancel', cancel, {passive:true});
  }

  /* ════════════ 五、希沃/画板触屏 ════════════ */
  function initTouchCanvas(){
    var ids = ['xizoCanvas','drawCanvas','wbCanvas','seewoCanvas','sketchCanvas'];
    ids.forEach(function(id){
      var c = $(id);
      if(!c || c.dataset.qsTouch) return;
      c.dataset.qsTouch = '1';
      function map(type, e){
        e.preventDefault();
        var tch = e.changedTouches[0];
        c.dispatchEvent(new MouseEvent(type, {clientX:tch.clientX, clientY:tch.clientY, bubbles:true, cancelable:true, view:window}));
      }
      c.addEventListener('touchstart', function(e){ map('mousedown', e); }, {passive:false});
      c.addEventListener('touchmove',  function(e){ map('mousemove', e); }, {passive:false});
      c.addEventListener('touchend',   function(e){ map('mouseup', e); }, {passive:false});
    });
  }

  /* ════════════ 六、AI 题库大扩容：48 个全新高频意图 ════════════ */
  window.QS_EXTRA_INTENTS=[
  /* === 学业考试 === */
  {id:'q_hw',t:'作业没写完',role:['student'],kws:['作业没写完','作业写不完','没写作业','抄作业','补作业','作业太多','赶作业','熬夜写作业','作业借我','答案发我','没交作业','作业忘带','作业忘家里'],
   sim:'作业没写完怎么办？',
   rep:{cold:['活该，谁让你昨晚打游戏','关我什么事','自己想办法'],mid:['课间赶紧补，能补多少是多少','抄我的？小心被逮到','跟老师说忘带了，下次一定交'],warm:['我借你抄，别抄的一模一样哈','下课我帮你分担点','没事，大不了被骂一顿，我陪你']}},

  {id:'q_exam',t:'考试周',role:['student'],kws:['月考','周测','考试周','下次考试','考砸','复习','月考范围','考试难吗','押题','挂科','不及格','补考','考多少分','排名多少'],
   sim:'月考你复习了吗？',
   rep:{cold:['复习什么，裸考就完事','考砸也无所谓','别提考试，烦'],mid:['临时抱佛脚，刚背完重点','这次难度听说挺大','考完就解放了，撑住'],warm:['我整理了笔记，给你看？','一起复习呀，图书馆走起','考砸了也没事，还有我呢']}},

  {id:'q_rank',t:'成绩排名',role:['student'],kws:['排名','成绩单','年级多少名','进步了','退步了','班级第几','前十','倒数','出分','查分','分数出来'],
   sim:'你这次排名多少？',
   rep:{cold:['别问我排名，问就是菜','不想说','垫底怎么了'],mid:['比上次进了十几名！','中游吧，不上不下','物理拖后腿了'],warm:['只要你夸我，排名第几都行','进步了！请我喝奶茶呗','你考好了我比你还开心']}},

  {id:'q_seat',t:'换座位',role:['student'],kws:['换座位','调座位','同桌','坐谁前面','坐谁后面','视力表换座','按成绩排座','随机换座','想和你同桌','新同桌'],
   sim:'下次换座位你想和谁坐？',
   rep:{cold:['随便，坐哪都一样','千万别和我同桌','老师排的，问了也白问'],mid:['听说按身高排','希望能坐窗边','和谁坐都行，别太吵就行'],warm:['我想和你同桌，你去跟老师说嘛','要是我们坐一起，上课传纸条方便了','你坐我旁边，我教你数学']}},

  {id:'q_timetable',t:'课程表',role:['student'],kws:['课程表','课表','下节什么课','第几节','今下午什么课','体育课调课','课表换了','连堂','自习课','音乐课多少周'],
   sim:'下节课是什么？',
   rep:{cold:['自己看课表','我怎么知道','问课代表去'],mid:['下节体育，自由活动！','数学，完了没写作业','今天下午两节连堂，惨'],warm:['下节美术，一起画画呀','下节自习，陪你聊天','管它什么课，看到你就行']}},

  {id:'q_pe',t:'体育课自由活动',role:['student'],kws:['体育课','自由活动','打球','跑步测验','八百米','一千米','引体向上','跳远','体育老师有事','占课','测肺活量'],
   sim:'体育课自由活动你去干嘛？',
   rep:{cold:['去小卖部买东西','找个地方睡觉','躲树荫下玩手机'],mid:['打半场篮球','和同学跳皮筋','绕操场散步聊天'],warm:['看你打球呀','一起跑两圈？我陪你','你跑步我在终点等你']}},

  /* === 班级日常 === */
  {id:'q_duty',t:'值日',role:['student'],kws:['值日','值日生','扫地','拖地','倒垃圾','擦黑板','今天谁值日','值周','大扫除','卫生检查','扣分'],
   sim:'今天是你值日吗？',
   rep:{cold:['不是我，别赖我','扫地这种活能逃就逃','检查的又来了，装忙'],mid:['我擦黑板，你倒垃圾呗','大扫除全班一起干快一些','卫生流动红旗就靠咱们班'],warm:['我帮你扫地，你歇着','一起值日完一起走呀','你扫的地真干净，夸你']}},

  {id:'q_board',t:'黑板报',role:['student'],kws:['黑板报','板报','宣传委员','画板报','主题黑板报','评比','粉笔','板报评比','后台报设计'],
   sim:'黑板报是你画的吗？',
   rep:{cold:['随便糊弄的，能看就行','别提了，画了一晚上','评比垫底也无所谓'],mid:['这期主题是中秋，还行吧','字体是我描的','下周要换新主题了'],warm:['画的呀，你发现啦？','给你在角落画了只小猫，看到了吗','你名字的首字母我藏进花边里了']}},

  {id:'q_late',t:'迟到',role:['student'],kws:['迟到','迟到了','早上起不来','点名没到','被记迟到','门口罚站','迟到几次','跑操迟到','预备铃'],
   sim:'你迟到过几次？',
   rep:{cold:['迟到记录比考勤还多','爱来不来','罚站就罚站'],mid:['这学期就迟过一次','闹钟响了按掉又睡了','跑着来刚好压铃'],warm:['昨天差点迟到，怕见不到你早上不敢赖床','你要迟到喊我，我叫你起床','等你一起，迟到也一起']}},

  {id:'q_leave',t:'请假',role:['student'],kws:['请假','病假','事假','出门条','请假条','回家一趟','不舒服请假','校医室请假','批假','销假'],
   sim:'请假条好批吗？',
   rep:{cold:['班主任卡得死，批不了','请假？除非快死了','别做梦了'],mid:['肚子疼这种好批一些','要家长打电话确认','出门条要盖章的'],warm:['不舒服就别硬撑，我陪你去校医室','帮你跟班主任说一声？','你请假我也想跟着溜出去看你']}},

  {id:'q_clinic',t:'医务室',role:['student'],kws:['医务室','校医','发烧','感冒','肚子疼','创可贴','量体温','校园卡挂号','医务室阿姨','药','头疼'],
   sim:'医务室的校医凶吗？',
   rep:{cold:['就会让你多喝水','没什么大病别去凑热闹','敷衍两句就打发你'],mid:['量个体温给你开点药','校医人还行','发烧会被隔离观察的'],warm:['你生病了？我陪你去看','我兜里常备创可贴，给你','多喝热水这句话我也说，但我是真的会给你带水']}},

  /* === 活动事件 === */
  {id:'q_sports',t:'运动会',role:['student'],kws:['运动会','校运会','开幕式','入场式','接力','广播稿','加油稿','运动员','志愿者的运动会','运动会三天','方阵'],
   sim:'运动会你报了什么项目？',
   rep:{cold:['什么都没报，纯观众','报了个没人要的','运动会就是大型摸鱼现场'],mid:['跑了4×100接力','写了两篇加油稿','在观众席嗑瓜子'],warm:['我报了和你同一天的项目，你来加油吗','你跑的时候我负责递水','穿着班服找你的样子超显眼']}},

  {id:'q_party',t:'元旦晚会',role:['student'],kws:['元旦晚会','文艺汇演','表演节目','唱歌跳舞','报节目','彩排','晚会','艺术节','合唱比赛','班级节目'],
   sim:'元旦晚会你想表演什么？',
   rep:{cold:['不表演，当观众','节目都是老师定的','社死现场不去'],mid:['合唱一首歌','有没有人一起跳舞','上次小品笑翻全场'],warm:['想和你合唱一首','你上台我在台下举灯牌','结束后一起去看烟花呀']}},

  {id:'q_drill',t:'疏散演练',role:['student'],kws:['消防演练','疏散演练','地震演习','防空警报','逃生演练','弯腰捂鼻','操场集合演练','安全演习'],
   sim:'消防演练你是跑还是走？',
   rep:{cold:['慢慢走，反正没人管','演练就是提前下课','躲厕所等结束'],mid:['要弯腰捂口鼻，按疏散图跑','三分钟全班到操场','每次都挤在楼梯口'],warm:['拉着你一起跑，别被人流冲散','演练完顺便在操场聊会天','认真点啦，安全第一']}},

  {id:'q_inspect',t:'领导检查',role:['student'],kws:['领导检查','教育局来','督导','大扫除迎检','检查团','校园开放日','听课','领导视察','突击检查'],
   sim:'领导来检查你们紧张吗？',
   rep:{cold:['关我什么事','检查前才大扫除，形式主义','照常上课呗'],mid:['全班大扫除了一下午','课桌擦得能反光','班主任反复叮嘱礼仪'],warm:['你坐直点，领导喜欢认真的学生','检查完请你喝饮料，配合一下','听说检查那天停自习，开心']}},

  /* === 校园设施 === */
  {id:'q_lib',t:'图书馆',role:['student'],kws:['图书馆','阅览室','借书','还书','占座','小说','杂志',' quiet','自习去图书馆','借书卡','新华书店'],
   sim:'图书馆你常去吗？',
   rep:{cold:['去图书馆？睡觉都不去那','书又旧又少','占座的人比书多'],mid:['考试周才去','借过几本悬疑小说','三楼靠窗位置最舒服'],warm:['周末一起去图书馆呀','帮你占了个靠你的位置','你看书我看你，双赢']}},

  {id:'q_lab',t:'实验课',role:['student'],kws:['实验课','实验室','化学实验','物理实验','生物实验','显微镜','酒精灯','试管','分组实验','实验报告','爆炸'],
   sim:'实验课你喜欢吗？',
   rep:{cold:['实验课就是换地方写作业','试剂味道难闻死了','最怕分组汇报'],mid:['上次镁条燃烧超亮眼','显微镜下看洋葱表皮','实验报告写到崩溃'],warm:['和你一组的话我什么都愿意做','你认真做实验的样子好专注','帮你记数据，你来操作']}},

  {id:'q_computer',t:'机房电脑课',role:['student'],kws:['电脑课','信息课','机房','微机课','上网课','玩游戏被抓','信息技术','机房断网','穿鞋套','屏幕被控'],
   sim:'机房上课你们偷玩什么？',
   rep:{cold:['扫雷都玩腻了','机房电脑卡成PPT','老师一键全控，没得玩'],mid:['偷偷玩4399','和同桌联机小游戏','趁老师演示自己乱点'],warm:['坐你旁边教你快捷键','被老师抓到算我招的','下机前帮你是清了历史记录']}},

  {id:'q_cat',t:'校园猫',role:['student'],kws:['校园猫','流浪猫','橘猫','喂猫','猫在教学楼','撸猫','校宠','猫在哪','小猫','狗','校园动物'],
   sim:'你见过学校的橘猫吗？',
   rep:{cold:['猫有什么好看的','别喂，会被咬','看见就绕道'],mid:['常在食堂后门蹲点','被门卫大爷喂得可肥了','下雨天会躲车棚'],warm:['我书包里有猫条，带你去找它','它今天在花坛晒太阳，超可爱','像你，都很招人喜欢']}},

  {id:'q_lake',t:'铜鉴湖',role:['student'],kws:['铜鉴湖','湖边','散湖','看湖','湖景','落日','湖边散步','看夕阳','周末湖边','划船','荷花'],
   sim:'放学去湖边走走吗？',
   rep:{cold:['湖边风大，不去','看了三年看腻了','蚊子多'],mid:['春天荷花开了很美','晚自习前去走一圈','落日的时候拍照绝了'],warm:['放学陪我去看落日吧','湖边风大，我把外套给你','和你一起看湖，比湖好看']}},

  /* === 天气季节 === */
  {id:'q_rain',t:'下雨天',role:['student'],kws:['下雨','暴雨','没带伞','淋雨','共伞','雨天','积水','梅雨','回南天','雨靴'],
   sim:'下雨没带伞怎么办？',
   rep:{cold:['淋着呗，反正就湿一点','谁让你不看天气预报','跑快点不就行了'],mid:['在校门口等雨小一点','跟同学挤一把伞','小卖部有卖一次性雨衣'],warm:['我带了伞，送你回去','一把伞两个人，靠近点','你淋湿了会感冒的，站这别动我去叫车']}},

  {id:'q_summer',t:'夏天',role:['student'],kws:['夏天','热','空调','教室热','蚊子','冰棍','西瓜','暑假','蝉','短袖','电扇','中暑'],
   sim:'夏天教室热怎么办？',
   rep:{cold:['热死了，学校不装空调没人性','忍着呗','去厕所冲把脸'],mid:['风扇开到最大档','下课后去小卖部买冰棍','靠窗的位置有风'],warm:['把我的冰棍分你一半','给你扇扇子，虽然没什么用','夏天和你一起吃西瓜才完整']}},

  {id:'q_winter',t:'冬天',role:['student'],kws:['冬天','冷','下雪','手冷','手套','围巾','暖气','热水袋','冬训','跑操冬天','结冰','冻疮'],
   sim:'冬天你的手怎么暖？',
   rep:{cold:['靠一身正气取暖','教室和冰窖一样','缩在被窝不起'],mid:['揣兜里搓一搓','去食堂打热汤','课间跑去小卖部暖和一下'],warm:['我手热，给你捂着','给你织的手套戴着呀','跑操的时候偷偷拉你袖口']}},

  /* === 社交日常 === */
  {id:'q_game2',t:'打游戏',role:['student'],kws:['打游戏','开黑','王者','原神','吃鸡','五排','上分','掉分','手机游戏','周末打','带我一个'],
   sim:'周末开黑吗？',
   rep:{cold:['游戏而已，至于吗','不打，幼稚','菜就别拉我'],mid:['晚上八点，不见不散','就打两把，作业还多着','你玩什么位置？'],warm:['带你上分，躺好','输了算我的，赢了你请奶茶','其实我挂机也想听你说话']}},

  {id:'q_night',t:'熬夜',role:['student'],kws:['熬夜','失眠','睡不着','凌晨','黑眼圈','晚睡','作息','熬夜打游戏','熬夜看小说','掉头发'],
   sim:'你熬夜一般干嘛？',
   rep:{cold:['熬夜关你什么事','习惯了，改不了','失眠是因为烦'],mid:['追剧追到十二点','写作业写着写着就晚了','睡前刷手机停不下来'],warm:['以后早点睡，我心疼','睡不着就给我发消息，我陪你','梦要是太无聊，就梦梦我']}},

  {id:'q_morning',t:'早起',role:['student'],kws:['早起','起不来','闹钟','赖床','6点10分','起床铃','早铃','睡过头','起床气','洗漱'],
   sim:'你起床气大吗？',
   rep:{cold:['别跟我说话，让我再躺五分钟','起床铃是世界上最吵的东西','谁发明的早起'],mid:['三个闹钟都叫不醒','洗把脸就清醒了','铃一响就弹起来，习惯了'],warm:['听到铃就想起你要早读了','有你的早安消息就不想起床气','赖床五分钟，梦里都是你']}},

  {id:'q_food',t:'零食分享',role:['student'],kws:['零食','吃的','分我一口','薯片','奶茶','炸鸡','辣条','糖果','面包','分享','饿了','馋'],
   sim:'你的零食藏哪了？',
   rep:{cold:['不给，自己买','就一口还想要？','馋死你'],mid:['课桌抽屉里，别声张','分你一半，别告诉别人','小卖部新出的挺好吃的'],warm:['全给你，我看着你吃','给你留了你最爱的那款','你要是饿了，天塌下来我也去给你买']}},

  {id:'q_music2',t:'听歌',role:['student'],kws:['听歌','歌单','新歌','周杰伦','许嵩','单曲循环','耳机','分享歌曲','这歌好听','ktv'],
   sim:'你最近单曲循环什么歌？',
   rep:{cold:['我的歌单凭什么给你','不听歌','老歌才有味道'],mid:['循环到耳机要没电了','给你听个小众的','KTV必点曲目了解一下'],warm:['这首是想到你的时候在听的','副歌部分像你笑起来的样子','建了个歌单，全是你说过好听的']}},

  {id:'q_star',t:'追星',role:['student'],kws:['追星','偶像','爱豆','演唱会','打榜','周边','海报','明星','粉丝','塌房','专辑'],
   sim:'你有喜欢的爱豆吗？',
   rep:{cold:['追星的都是傻子','不追这些东西','塌房了吧，早说了'],mid:['喜欢他的歌而已','攒钱买专辑中','演唱会门票好难抢'],warm:['你是我的唯一爱豆','你的照片就是我的壁纸','比起遥远的明星，我更喜欢眼前的你']}},

  {id:'q_basketball',t:'篮球赛',role:['student'],kws:['篮球赛','班赛','年级比赛','看球','打球帅','三分','灌篮','篮球场','比赛输了','校队'],
   sim:'今天篮球赛你看了吗？',
   rep:{cold:['一堆人抢一个球，无聊','不看，吵死了','输了活该'],mid:['最后绝杀太帅了','比分咬得好紧','下次我也想上场'],warm:['你进球那刻我心跳比你还快','全场我就只看你','输了别难过，请你去吃炸鸡']}},

  {id:'q_birthday',t:'生日',role:['student'],kws:['生日','蛋糕','许愿','生日礼物','谁过生日','生日会','长寿面','蜡烛','生日快乐'],
   sim:'快到你生日了吧？',
   rep:{cold:['生日而已，不过','别送礼物，浪费钱','没人记得也无所谓的'],mid:['全班唱生日歌好尴尬','蛋糕被抹了一脸','愿望许了三个'],warm:['你的生日我早就记在备忘录了','礼物准备了很久，不许嫌弃','希望你每年生日我都在']}},

  {id:'q_secret',t:'秘密',role:['student'],kws:['秘密','告诉你个事','别告诉别人','偷偷','只跟你说','保密','小道消息','八卦','吃瓜'],
   sim:'有什么秘密只告诉我？',
   rep:{cold:['秘密就是没有秘密','无聊透顶','我不听这些'],mid:['你发誓不告诉别人','这瓜有点大，坐稳','只说给你一个人听'],warm:['我的秘密全是你','这个秘密是：我喜欢你','连秘密都想跟你共享']}},

  {id:'q_miss',t:'想你了',kws:['想你','想你了','好想你','见不到你','什么时候见面','想你啦','梦到你'],
   sim:'你有没有想我？',
   rep:{cold:['谁想你了，自作多情','无聊就想这些？','别自作多情'],mid:['嗯…偶尔有一点点','刚还在说你怎么不出现','这句我先记下了'],warm:['我也想你，从早自习想到现在','做梦都是你在操场回头笑','明天见到你，要补回今天的想念']}},

  {id:'q_today',t:'今天怎么样',kws:['今天怎么样','今天如何','过得咋样','今天累吗','开心吗','心情怎么样','今天还好吗'],
   sim:'你今天过得怎么样？',
   rep:{cold:['就那样，无所谓','别管我','累，别问'],mid:['还行，就是有点困','数学课被点名，惊险','中午的糖醋排骨不错'],warm:['见到你就好起来了','有点累，但想到你就不累了','今天的一切都想讲给你听']}},

  {id:'q_goodnight',t:'晚安',kws:['晚安','睡觉了','睡了','早点睡','做个好梦','晚安啦','困了先睡'],
   sim:'晚安，做个好梦。',
   rep:{cold:['哦','谁要跟你说晚安','睡了别吵'],mid:['晚安，明天见','你也早点睡','做个好梦'],warm:['晚安，梦里也要有我哦','再聊五分钟就睡，骗你的，再聊十分钟','你先睡，我看着你的头像说晚安']}},

  {id:'q_teachers',t:'找老师聊天',role:['student','teacher'],kws:['找老师','老师办公室','问老师','和老师聊','老师好','请教老师','问题目','去办公室'],
   sim:'你敢去办公室问题目吗？',
   rep:{cold:['能不去就不去','去就是挨训','办公室的门我绕着走'],mid:['问题目老师还挺耐心','带上作业去，态度好一点','下课十分钟刚好跑个来回'],warm:['陪你去，我在门口等你','帮你是把问题列好，效率高','老师夸你了，比我还开心']}},

  {id:'q_phone2',t:'手机被没收',role:['student'],kws:['手机被没收','没收','上交手机','手机被缴','要回手机','期末还手机','藏手机','手机被抓'],
   sim:'手机被收了怎么办？',
   rep:{cold:['活该，谁让你上课玩','没收了就好好学习呗','自求多福'],mid:['期末才还，惨','写保证书领回来','备用机了解下'],warm:['没收了正好，可以用我的','你只能联系我一个人的日子开始了','没有手机的日子，我会多陪你说说话']}},

  {id:'q_confess2',t:'被表白',role:['student'],kws:['表白','告白','喜欢我','做我对象','情书','表白被拒','答应我','在一起吧'],
   sim:'如果有人向你表白你会答应吗？',
   rep:{cold:['想都别想','学习为重，不谈这些','拒绝得干脆点'],mid:['看是谁吧','这要讲究场合和心情','现在还早呢'],warm:['这要看表白的人是谁了，比如你？','其实我等这句话很久了','先从一起吃饭开始好不好']}},

  {id:'q_breakup',t:'闹别扭',kws:['生气了','不理你','闹别扭','吵架','和好','对不起','原谅我','冷战中','你干嘛','烦你'],
   sim:'我们和好好不好？',
   rep:{cold:['不想说话','让我静静','随便你'],mid:['消消气就好了','你先哄，哄两句就不气了','这件事你有不对，但算了'],warm:['哼，罚你陪我一下午','其实我没真生气，就是想被哄','和好了，拉勾']}},

  {id:'q_weekend',t:'周末安排',role:['student'],kws:['周末','放假','周日下午回校','补课','双休','假期作业','周末干嘛','返校'],
   sim:'周末你一般怎么过？',
   rep:{cold:['睡觉睡觉睡觉','补课补到麻木','躺尸，别约我'],mid:['写作业+打游戏经典套餐','周日下午回校赶上晚自习','偶尔去图书馆'],warm:['想和你视频写作业','周末来找我玩呀','返校那天记得给我带吃的']}},

  {id:'q_holiday',t:'假期',role:['student'],kws:['暑假','寒假','国庆','五一','放假多少天','假期计划','长假','调休','放假通知'],
   sim:'假期你有什么计划？',
   rep:{cold:['睡到天昏地暗','计划就是没有计划','作业都写不完还计划'],mid:['前十天狂写作业，后面疯玩','全家旅游一趟','集训/补课警告'],warm:['假期也想天天见到你','给你寄明信片呀','开学的时候，把攒的话都讲给你听']}},

  {id:'q_train',t:'体育训练',role:['student'],kws:['体训','集训','体育生','晨训','体能','体测','仰卧起坐','跳绳测试','训练累'],
   sim:'体训累不累？',
   rep:{cold:['累到怀疑人生','体训队是非人类待的','想退出想了一百次'],mid:['肌肉酸痛但很爽','教练今天又加练','体测临近，冲刺期'],warm:['我陪你拉伸放松','累了靠着我歇会','你坚持的样子真的很帅']}},

  {id:'q_art2',t:'美术课',role:['student'],kws:['美术课','画画','素描','色彩','画室','美术生','联考','写生','美术作业'],
   sim:'美术课你画了什么？',
   rep:{cold:['火柴人画家就是我','画得丑，不展示','应付完事'],mid:['这次静物素描还行','调色调到眼花','美术生真的很苦'],warm:['画了窗边的你，不给你看','你当我的模特好不好','以后我画里的主角都是你']}},

  {id:'q_music3',t:'音乐课',role:['student'],kws:['音乐课','唱歌','乐理','合唱团','琴房','音乐生','视唱练耳','五线谱','跑调'],
   sim:'音乐课你唱歌跑调吗？',
   rep:{cold:['跑调跑到隔壁班','张嘴假唱专业户','音乐课自习课'],mid:['合唱比赛凑人数','五音不全但热情高','乐理知识零蛋'],warm:['跑调也要唱给你听','你是我的专属调音师','想和你合唱一首，跑调也甜']}},

  {id:'q_board2',t:'公告栏',role:['student'],kws:['公告栏','通知','喜报','处分公告','光荣榜','海报','社团招新','讲座通知'],
   sim:'公告栏有什么新通知？',
   rep:{cold:['与我无关','看那玩意干嘛','都是形式'],mid:['社团招新开始了','上次光荣榜有咱们班','讲座可以盖实践章'],warm:['我去看你名字有没有上光荣榜','把你的喜报拍下来发你了','以后喜报上会常有你的名字']}},

  {id:'q_money2',t:'零花钱',role:['student'],kws:['零花钱','没钱了','生活费','穷','压岁钱','省钱','吃土','月底','储蓄'],
   sim:'你生活费够花吗？',
   rep:{cold:['没钱活该乱花','穷就不该买奶茶','别问我借钱'],mid:['月初富翁月底吃土','记账也存不下','省吃俭用为了买鞋'],warm:['我的就是你的，说吧要多少','请你吃，别跟我客气','一起攒钱买我们说好的那个']}},

  {id:'q_grad',t:'毕业季',role:['student'],kws:['毕业','高三','毕业照','散伙饭','纪念册','同学录','离别','毕业典礼','最后一课'],
   sim:'毕业以后我们还会联系吗？',
   rep:{cold:['毕业就是各奔东西','没什么好感慨的','断了就断了'],mid:['把同学录写满再走','散伙饭肯定哭成一片','合照多拍点留纪念'],warm:['毕业不是结束，我们的故事才刚开始','我会一直在，升学也不算分开','把你写进纪念册第一页']}},

  {id:'q_bully',t:'矛盾调解',role:['student'],kws:['被人欺负','吵架了','矛盾','打架','告老师','和解','孤立','流言','被误会'],
   sim:'有人欺负你怎么办？',
   rep:{cold:['打得过就打，打不过就告','自己解决别烦我','忍忍就过去了'],mid:['先报告班主任最稳妥','别冲动，把事情说清楚','同学之间说开了就好'],warm:['有事一定要告诉我，我站在你这边','谁欺负你，我第一个不答应','你不是一个人，我陪你处理']}},

  {id:'q_study2',t:'学习方法',role:['student'],kws:['怎么学','学习方法','笔记','错题','效率','背不下来','专注','预习','刷题','学霸怎么学'],
   sim:'你的学习方法是什么？',
   rep:{cold:['学什么学，躺平','抄抄补补就过去了','天赋论，努力没用'],mid:['错题本很关键','番茄钟专注法','睡前过一遍今天的内容'],warm:['我教你呀，包教包会','你专注的样子最迷人了','一起自习，互相提问效率翻倍']}},

  {id:'q_laerrus',t:'制作人',kws:['制作人','Laerrus','做这个游戏的人','开发者','作者','这个游戏谁做的','开发信'],
   sim:'你知道这个游戏是谁做的吗？',
   rep:{cold:['管他是谁做的，能玩就行','开发者给我打钱','这游戏bug真多'],mid:['听说是Laerrus一个人做的','开发者的信你看没看','一个人写几万行代码，离谱'],warm:['他一定是个很温柔又很执着的人','把一所学校装进一个文件，厉害吧','替我给制作人点个赞！']}},

  {id:'q_help',t:'求助',kws:['帮我','求你','帮个忙','可以帮我吗','拜托','搭把手','帮帮我'],
   sim:'能帮我个忙吗？',
   rep:{cold:['自己的事自己做','凭什么帮你','没空'],mid:['看什么忙，说','小事可以，大事不行','先说清楚是什么忙'],warm:['你说，赴汤蹈火','你的忙我永远有空帮','都交给我，你就负责开心']}}
  ];

  function mergeExtraIntents(){
    try{
      if(typeof XZ_AI_INTENTS === 'undefined' || !window.QS_EXTRA_INTENTS) return;
      var have = {};
      for(var i=0;i<XZ_AI_INTENTS.length;i++) have[XZ_AI_INTENTS[i].id] = 1;
      var added = 0;
      for(var j=0;j<QS_EXTRA_INTENTS.length;j++){
        if(!have[QS_EXTRA_INTENTS[j].id]){ XZ_AI_INTENTS.push(QS_EXTRA_INTENTS[j]); added++; }
      }
      try{ console.log('[xz559] AI题库扩容 +' + added + ' 意图，总数 ' + XZ_AI_INTENTS.length); }catch(e){}
    }catch(e){}
  }

  /* ════════════ 启动 ════════════ */
  ready(function(){
    try{ applyArtTheme(getCurrentTheme()); }catch(e){}
    try{ initThemeButton(); }catch(e){ console.log('theme btn', e); }
    try{ initTutorialBtn(); }catch(e){ console.log('tut btn', e); }
    try{ initAutoCancel(); }catch(e){ console.log('auto cancel', e); }
    try{ initTapEnlarge(); }catch(e){ console.log('tap', e); }
    try{ initTouchCanvas(); }catch(e){ console.log('canvas', e); }
    try{ mergeExtraIntents(); }catch(e){ console.log('merge ai', e); }
    try{ hookStartGame(); }catch(e){ console.log('hook sg', e); }

    // 兜底：切屏/重进后补回按钮
    var t = setInterval(function(){
      try{
        if(!$('xz559-theme-btn')) initThemeButton();
        if(!$('xz559-tut-btn')) initTutorialBtn();
        initTouchCanvas();
      }catch(e){}
    }, 1500);
    setTimeout(function(){ clearInterval(t); }, 30000);
  });
})();
