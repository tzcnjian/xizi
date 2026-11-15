/* 5.5.11 更新日志 + 技术支持名单 | 哨兵 __XZ_PATCH_LOG__ */
(function(){
  if(window.__XZ_PATCH_LOG__) return;
  window.__XZ_PATCH_LOG__ = true;

  function ready(fn){
    if(document.readyState!=='loading') setTimeout(fn,100);
    else document.addEventListener('DOMContentLoaded',function(){setTimeout(fn,100);});
  }
  function $(id){ return document.getElementById(id); }
  function safeModal(h){
    try{ if(typeof modal==='function'){ modal(h); return true; } }catch(e){}
    return false;
  }

  /* ═════ 更新日志数据 ═════ */
  var CHANGELOG = [
    {v:'5.5.505',d:'初版',list:['作息/恋爱/暗恋/关系图','小卖部/社团/成就/图鉴','上课提问/每日一题','AI 聊天(基础 36 意图)','白板/液态玻璃']},
    {v:'5.5.6.100',d:'功能扩充',list:['穿衣系统初步','跳一跳(初版)','黄金矿工(初版)','音乐 base64 内嵌','歌词逐句显示']},
    {v:'5.5.6.888',d:'美术升级',list:['液态玻璃风格','手机竖屏适配(初版)','关系图白天版','K歌系统(初版)']},
    {v:'5.5.6.999',d:'小游戏扩充',list:['合成大西瓜','跳一跳 1.0 动画','黄金矿工增强','MBTI 测试','霍兰德职业测试']},
    {v:'5.5.6.99902',d:'内容融合',list:['5.5.505→999 全部功能融合','PATCH 控制台','应用商城(初版)','右下角工作台']},
    {v:'5.5.6.99903',d:'动画升级',list:['跳一跳 2.0(蓄力/连击/粒子/相机跟随)','歌词滚动恢复','顶栏网格体系','hero 加载动画']},
    {v:'5.5.6.99904',d:'细节打磨',list:['跳一跳动画全面升级','大西瓜物理优化','弹窗全屏化','触控放大']},
    {v:'5.5.7',d:'整合',list:['99904 全部内容','手机布局修复(初版)']},
    {v:'5.5.702',d:'修复',list:['手机按钮重叠修复','状态条横向铺满']},
    {v:'5.5.703',d:'功能完善',list:['起床穿衣恢复','希沃白板','黄金矿工重做','关系图白天版','应用商城完善','右下角工作台','歌词双模式']},
    {v:'5.5.8',d:'基石版',list:['每日精力系统','高考模拟','生理期记录','邮件系统','KTV 音准判定','ChatGPT 6.0 徽章','加载提示','Laerrus. 评价卡(9.5/10)','SVG 图标','开发者信','6.0 预告']},
    {v:'5.5.9',d:'五大主题+手机精准修复+AI扩容',list:[
      '🎨 五大美术主题(默认/氢山/光谷/暖阳/暗夜)随时切换，存 localStorage',
      '📱 手机布局精准修复(.topbar flex-direction:column + 子元素 width:100%)',
      '📖 6 页新手教程(首次 startGame 自动触发)',
      '🤖 AI 题库扩容: 主库36 + 旧补丁53 + 新补丁51 = 140 个意图(约1260条回复)',
      '⏹️ 自动取消浮钮(AUTO=true 时浮现)',
      '🔍 安全长按放大(≥600ms，EXCLUDE 选择器防误触音乐按钮)',
      '✏️ 触屏画板支持',
      '🎵 音乐功能修复(长按不拦截 click 事件)'
    ]},
    {v:'5.5.10',d:'歌词滚动+小游戏增强',list:[
      '🎵 歌词滚动修复(长歌词自动滚动，短歌词居中，MutationObserver 监听)',
      '🎤 K歌音准曲线 Canvas(目标音高+玩家演唱+当前位置光点)',
      '⛏️ 黄金矿工四档难度(简单/普通/困难/地狱，金价倍率调整)',
      '🍉 大西瓜 rAF 节流(手机 30fps，桌面 60fps，物理精度不变)',
      '🎯 跳一跳增强(表情气泡+蓄力提示)',
      '👔 装扮随机穿搭按钮',
      '🎬 视频播放器(本地/网址/示例视频)'
    ]},
    {v:'5.5.11',d:'大规模扩展',list:[
      '🛍️ 应用商城扩充 12 个实用工具(计算器/计时器/画板/备忘录/天气/课程表/成绩计算/倒计时/番茄钟/单位换算/随机数/进制转换)',
      '🎯 跳一跳动画深化(蓄力表情逐级😐→🙂→😮→😤 + 完美落点12颗金色星光粒子爆发 + PERFECT 大字)',
      '🎤 K歌真实音高数据(基于简谱的 pitchData，副歌高音叙事低音)',
      '⛏️ 黄金矿工 3 模型切换(经典矿工/冒险家/机械师，不同钩速和炸药)',
      '🍉 大西瓜 3 皮肤切换(默认/像素风/忍者风)',
      '👔 装扮系统完整版(4 分类 24 件单品，保存组合到 localStorage)',
      '📊 PATCH 控制台实时诊断浮窗(FPS/内存/版本/主题/AI意图数/补丁层)',
      '🤖 AI 题库再扩容 52 个意图(总达 192 个意图)',
      '🎬 视频播放器播放列表(6 个示例视频连续播放)',
      '🛠️ 右下角工作台浮窗(齿轮按钮触发，主题/教程/应用/视频/诊断快捷入口)',
      '📜 更新日志面板(本面板)',
      '❤️ 技术支持名单(GLM + 混元 + Doubao + Laerrus.)'
    ]},
    {v:'5.5.11.1',d:'回归修复',list:[
      '🐞 修复高考模拟 gkSubject 在严格模式下未声明变量 h 导致的 ReferenceError（点击科目即崩溃）',
      '🎨 新增第 6 套美术主题「西子湖」（西湖烟雨·暮色玻璃），并设为默认主题',
      '🎵 游戏开始时自动播放背景音乐（处于首次交互手势内，符合浏览器自动播放策略）',
      '📐 右下角悬浮按钮缩小并重新排布：诊断浮窗移到左下、工作台浮窗上移，消除重叠',
      '🎼 开始界面歌词条置顶显示，避免被遮挡/裁切',
      '🔘 PATCH 控制台与工作台按钮尺寸收敛，不再"特别大"'
    ]},
    {v:'5.5.12',d:'整合发布（合一体）',list:[
      '📦 将 5.5.8 基座 + 四层补丁（5.5.9 / 5.5.10 / 5.5.11 / 更新日志）及 5.5.11.1 全部回归修复合并为单一 5.5.12 文件',
      '🎨 含 6 大美术主题（西子湖·默认）、340+ AI 聊天意图、12 款实用工具、实时诊断浮窗、右下角工作台',
      '🎵 默认进入即自动播放背景音乐；高考模拟崩溃已修复；右下角浮层去冲突；开始界面歌词条置顶',
      '🔖 版本号三处对齐统一为 5.5.12，作为此前所有工作的「打包合一体」'
    ]}
  ];

  /* ═════ 技术支持名单 ═════ */
  var CREDITS = [
    {icon:'🤖',name:'GLM',role:'智谱AI · 智能体',desc:'负责补丁编写、功能实现、代码整合、更新日志撰写。5.5.9→5.5.11 三层补丁架构设计与装配。'},
    {icon:'🌀',name:'混元',role:'腾讯 · 大模型',desc:'参与功能讨论、需求分析、美术风格建议。协助歌词滚动修复和手机布局优化方案。'},
    {icon:'🫘',name:'Doubao',role:'豆包 · 助手',desc:'5.5.8 基石版提取与验证、补丁编写指南撰写、字节级回放验证(SHA-256 一致)。'},
    {icon:'✨',name:'Laerrus.',role:'开发者 · 主创',desc:'杭州西子实验学校模拟器原作者。从 5.5.505 一路走到 5.5.11，设计核心玩法、美术、音乐、剧情。'}
  ];

  /* ═════ 注入按钮 ═════ */
  function injectButtons(){
    var funcRow = document.querySelector('.xz-func-row');
    if(!funcRow) return false;
    if(!$('xz-changelog-btn')){
      var b1 = document.createElement('button');
      b1.id='xz-changelog-btn'; b1.className='mini gbtn';
      b1.textContent='📜 更新'; b1.onclick=openChangelog;
      funcRow.appendChild(b1);
    }
    if(!$('xz-credits-btn')){
      var b2 = document.createElement('button');
      b2.id='xz-credits-btn'; b2.className='mini gbtn';
      b2.textContent='❤️ 鸣谢'; b2.onclick=openCredits;
      funcRow.appendChild(b2);
    }
    return true;
  }

  function openChangelog(){
    var html = '<h3>📜 更新日志</h3><div id="xzChangelogModal">';
    // 倒序显示（最新在前）
    for(var i=CHANGELOG.length-1; i>=0; i--){
      var c = CHANGELOG[i];
      html += '<div class="xz-cl-version"><span class="v-num">v'+c.v+'</span><span class="v-date">'+c.d+'</span>'+
        '<div class="v-list">'+c.list.map(function(it){return '<div>'+it+'</div>';}).join('')+'</div></div>';
    }
    html += '</div><button class="gbtn" style="margin-top:10px" onclick="closeModal()">关闭</button>';
    safeModal(html);
  }

  function openCredits(){
    var cards = CREDITS.map(function(c){
      return '<div class="xz-credit-card"><div class="c-icon">'+c.icon+'</div>'+
        '<div class="c-name">'+c.name+'</div><div class="c-role">'+c.role+'</div>'+
        '<div class="c-desc">'+c.desc+'</div></div>';
    }).join('');
    var h = '<h3>❤️ 技术支持名单</h3>'+
      '<div class="quote">感谢以下 AI 和开发者对本项目的支持。没有你们，这个游戏走不到 5.5.12。</div>'+
      '<div class="xz-credits-grid">'+cards+'</div>'+
      '<div style="text-align:center;margin-top:12px;color:#888;font-size:13px">'+
      '杭州西子实验学校模拟器 · 从 5.5.505 到 5.5.12 · 一个 HTML 文件承载全部<br>'+
      '—— Laerrus. 及全体技术支持团队 敬上</div>'+
      '<button class="gbtn" style="margin-top:10px" onclick="closeModal()">关闭</button>';
    safeModal(h);
  }

  /* ═════ 启动 ═════ */
  ready(function(){
    var tries = 0;
    var t = setInterval(function(){
      if(injectButtons() || ++tries > 60) clearInterval(t);
    }, 800);
    // 也往 PATCH 控制台的工作台加快捷入口
    setTimeout(function(){
      var wb = $('xzWorkbench');
      if(wb){
        var btn = document.createElement('div');
        btn.className='wb-btn'; btn.textContent='📜 日志';
        btn.onclick=openChangelog;
        wb.appendChild(btn);
        var btn2 = document.createElement('div');
        btn2.className='wb-btn'; btn2.textContent='❤️ 鸣谢';
        btn2.onclick=openCredits;
        wb.appendChild(btn2);
      }
    }, 3000);
  });
})();
