
(function(){
if(window.__XZ_PATCH_5513__){return;}window.__XZ_PATCH_5513__=true;
/* ===== x5513_core.js ===== */
/* ============================================================
   5.5.13 · 第 1 模块：共享工具 / 主题回归 / 存档系统 / 启动器
   5.5.13 第五层补丁（在 5.5.12 四层之上，只增不删，哨兵防重）
   ============================================================ */
var XZ13 = {
  ver: '5.5.13',
  GAMES: [],      // 游戏中心注册项（由 games 模块填充）
  TOOLS: [],      // 工具箱注册项（由 tools 模块填充）
  inits: [],      // 各模块初始化回调（在主界面就绪后执行）
  $: function (id) { return document.getElementById(id); },
  $$: function (s, r) { return (r || document).querySelectorAll(s); },
  $s: function (s, r) { return (r || document).querySelector(s); },
  ready: function (fn) {
    if (document.readyState !== 'loading') setTimeout(fn, 1);
    else document.addEventListener('DOMContentLoaded', function () { setTimeout(fn, 1); });
  },
  esc: function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  },
  modal: function (h) {
    try { if (typeof modal === 'function') { modal(h); return true; } } catch (e) { return XZ13._fallbackModal(h); }
    return XZ13._fallbackModal(h);
  },
  closeModal: function () {
    try { if (typeof closeModal === 'function') { closeModal(); return; } } catch (e) {}
    var m = XZ13.$('modal'); if (m) { m.classList.remove('show'); m.innerHTML = ''; }
  },
  _fallbackModal: function (h) {
    var m = XZ13.$('modal');
    if (!m) { alert('弹窗容器缺失'); return false; }
    m.innerHTML = '<div class="modalbox" id="modalbox">' + h + '<button class="gbtn" onclick="document.getElementById(\'modal\').classList.remove(\'show\')">关闭</button></div>';
    m.classList.add('show');
    return true;
  },
  toast: function (msg, ms) {
    try {
      var t = XZ13.$('xz13SaveToast');
      if (!t) { t = document.createElement('div'); t.id = 'xz13SaveToast'; document.body.appendChild(t); }
      t.textContent = msg; t.classList.add('show');
      clearTimeout(t._timer);
      t._timer = setTimeout(function () { t.classList.remove('show'); }, ms || 1600);
    } catch (e) {}
  },
  lsGet: function (k, d) {
    try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; }
  },
  lsSet: function (k, v) {
    try { localStorage.setItem(k, v); return true; } catch (e) { return false; }
  },
  lsDel: function (k) {
    try { localStorage.removeItem(k); } catch (e) {}
  },
  log: function (txt, cls) {
    try { if (typeof l === 'function') { l(txt, cls || 'good'); } } catch (e) {}
  },
  /* 本地最高分（key 名带前缀，绝不污染既有存档） */
  best: function (key, val) {
    var k = 'xz13_best_' + key;
    if (typeof val === 'number') {
      var cur = parseFloat(XZ13.lsGet(k, '0')) || 0;
      if (val > cur) { XZ13.lsSet(k, String(val)); return val; }
      return cur;
    }
    return parseFloat(XZ13.lsGet(k, '0')) || 0;
  },
  fmtTime: function (ts) {
    var d = new Date(ts);
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
};
window.XZ13 = XZ13;

/* ────────────────────────────────────────────────────────────
   一、主题系统：还原「晴空」浅色默认 + 新增「樱语」皮肤
   ──────────────────────────────────────────────────────────── */
var THEME13 = {
  list: [
    { id: 'classic', icon: '🌤️', name: '晴空（原版）', desc: '浅蓝晴空·白色玻璃·还原截图经典', tag: '还原' },
    { id: 'sakura', icon: '🌸', name: '樱语春日', desc: '奶油粉白·樱花飘落·5.5.13 原创', tag: '新' },
    { id: 'xizi', icon: '🌊', name: '西子湖', desc: '西湖烟雨·暮色玻璃', tag: '' },
    { id: 'qingshan', icon: '🏔️', name: '氢山', desc: '白墙黛瓦·临湖青山', tag: '' },
    { id: 'guanggu', icon: '🌅', name: '光谷', desc: '清新明亮·光之谷', tag: '' },
    { id: 'warm', icon: '☀️', name: '暖阳', desc: '暖色调·温馨校园', tag: '' },
    { id: 'darknight', icon: '🌙', name: '暗夜', desc: '深紫星空·静谧夜', tag: '' }
  ],
  classes: ['theme-classic', 'theme-sakura', 'theme-xizi', 'theme-qingshan', 'theme-guanggu', 'theme-warm', 'theme-darknight'],
  isLight: function (id) { return id === 'classic' || id === 'sakura' || id === 'guanggu' || id === 'warm'; }
};
function getCurrentTheme13() {
  var v = XZ13.lsGet('xz_art_theme', '');
  v = v ? String(v).trim() : '';
  // 5.5.11.1 曾把默认强制为深色 xizi；5.5.13 起恢复浅色晴空：
  // 未设置 / 旧默认值 / 显式 default → 一律回到「晴空」
  if (v === '' || v === 'xizi' || v === 'default' || v === 'default2') return 'classic';
  var valid = ['classic', 'sakura', 'qingshan', 'guanggu', 'warm', 'darknight'];
  for (var i = 0; i < valid.length; i++) if (v === valid[i]) return v;
  return 'classic';
}
function applyArtTheme13(id) {
  try {
    var body = document.body;
    for (var i = 0; i < THEME13.classes.length; i++) body.classList.remove(THEME13.classes[i]);
    var html = document.documentElement;
    if (THEME13.isLight(id)) { html.classList.add('light'); html.classList.remove('dark'); }
    if (id === 'darknight') { html.classList.add('dark'); html.classList.remove('light'); }
    body.classList.add('theme-' + id);
    XZ13.lsSet('xz_art_theme', id);
    // 同步基座显示模式：浅皮肤锁定白天，暗夜锁定黑夜
    try {
      XZ13.lsSet('xz_theme', THEME13.isLight(id) ? 'light' : 'dark');
      if (typeof G !== 'undefined' && G) { G.theme = THEME13.isLight(id) ? 'light' : 'dark'; }
    } catch (e) {}
    if (id === 'sakura') startPetals(); else stopPetals();
    // 同步面板按钮高亮
    XZ13.$$('.qs-theme-btn').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-t13') === id);
    });
  } catch (e) { XZ13.log('🎨 主题切换失败：' + e.message, 'bad'); }
}
function openThemePanel13() {
  var cur = getCurrentTheme13();
  var html = '<h3>🎨 美术皮肤（5.5.13 共 7 套）</h3>' +
    '<p class="dim small">默认已恢复为「晴空」原版浅色；点卡片即时切换并记忆。</p>';
  for (var i = 0; i < THEME13.list.length; i++) {
    var t = THEME13.list[i];
    var on = t.id === cur ? ' on' : '';
    var tag = t.tag ? '<span class="xz13-theme-tag ' + (t.tag === '新' ? 'xz13-tag-new' : 'xz13-tag-back') + '">' + t.tag + '</span>' : '';
    html += '<div class="qs-theme-btn' + on + '" data-t13="' + t.id + '" onclick="__xz13ApplyTheme(\'' + t.id + '\')" style="text-align:left;padding:12px;margin:6px 0;cursor:pointer;border-radius:12px;border:1px solid rgba(127,127,127,.25);">' +
      '<div style="font-size:16px;font-weight:800;">' + t.icon + ' ' + t.name + tag + '</div>' +
      '<div class="t-desc dim small" style="margin-top:2px;font-size:12px;">' + t.desc + '</div></div>';
  }
  html += '<button class="gbtn" style="margin-top:10px" onclick="closeModal()">关闭</button>';
  XZ13.modal(html);
}
window.__xz13ApplyTheme = applyArtTheme13;
window.openThemePanel = openThemePanel13; // 全局覆盖，供工作台调用
window.__xz13OpenTheme = openThemePanel13;

/* 樱花花瓣飘落（仅樱语皮肤） */
var petalsEl = null;
function startPetals() {
  try {
    if (!petalsEl) {
      petalsEl = document.createElement('div');
      petalsEl.id = 'xzPetals';
      document.body.appendChild(petalsEl);
    }
    petalsEl.style.display = 'block';
    if (petalsEl.childElementCount) return;
    var sym = ['🌸', '🌺', '🌸', '🌷'];
    for (var i = 0; i < 16; i++) {
      var p = document.createElement('span');
      p.className = 'xz-petal';
      p.textContent = sym[i % sym.length];
      p.style.left = (Math.random() * 100) + '%';
      p.style.fontSize = (12 + Math.random() * 14) + 'px';
      p.style.animationDuration = (8 + Math.random() * 9) + 's';
      p.style.animationDelay = (-Math.random() * 12) + 's';
      p.style.opacity = (0.35 + Math.random() * 0.4);
      petalsEl.appendChild(p);
    }
  } catch (e) {}
}
function stopPetals() {
  if (petalsEl) petalsEl.style.display = 'none';
}

/* 拦截基座 tick 上的自动昼夜：浅皮肤始终保持白天 */
function lockBaseTheme() {
  try {
    var orig = window.applyTheme;
    window.applyTheme = function () {
      var art = getCurrentTheme13();
      if (THEME13.isLight(art)) {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        return;
      }
      if (typeof orig === 'function') return orig.apply(this, arguments);
    };
    // 5.5.9 的主题应用也接管
    window.__qsApplyTheme = function (id) { applyArtTheme13(id); };
  } catch (e) {}
}

/* ────────────────────────────────────────────────────────────
   二、存档系统：自动存档 / 3 槽位 / 导出导入 JSON
   复用基座 saveGame/continueGame 的同一份数据，绝不破坏原存档
   ──────────────────────────────────────────────────────────── */
var SAVE_SYS = {
  quick: 'xz_save_v1',
  slotKey: function (n) { return 'xz13_slot_' + n; },
  // 触发基座 saveGame 并读回 JSON（与原存档结构完全一致）
  snapshot: function () {
    try {
      if (typeof saveGame === 'function' && typeof G !== 'undefined' && G) {
        saveGame();
        var raw = localStorage.getItem(SAVE_SYS.quick);
        if (raw) return raw;
      }
    } catch (e) {}
    return null;
  },
  metaOf: function (raw) {
    try {
      var d = JSON.parse(raw);
      var name = d.name || '未命名';
      var mode = d.mode === 'teacher' ? '教师线' : '学生线';
      var day = (typeof d.day === 'number') ? d.day : 0;
      var loc = d.loc || '未知地点';
      var dateStr = '';
      try { dateStr = d.date ? new Date(d.date).toLocaleDateString('zh-CN') : ''; } catch (e) {}
      return { name: name, mode: mode, day: day, loc: loc, date: dateStr, raw: raw };
    } catch (e) { return null; }
  },
  saveToSlot: function (n) {
    var raw = SAVE_SYS.snapshot();
    if (!raw) { XZ13.toast('⚠️ 请先进入游戏再存档'); return false; }
    XZ13.lsSet(SAVE_SYS.slotKey(n), JSON.stringify({ at: Date.now(), raw: raw, ver: XZ13.ver }));
    XZ13.toast('💾 已存入槽位 ' + n);
    return true;
  },
  loadSlot: function (n) {
    var wrap = XZ13.lsGet(SAVE_SYS.slotKey(n), null);
    if (!wrap) { XZ13.toast('槽位 ' + n + ' 为空'); return false; }
    try {
      var raw = JSON.parse(wrap).raw;
      return SAVE_SYS.loadRaw(raw);
    } catch (e) { XZ13.toast('⚠️ 槽位 ' + n + ' 存档损坏'); return false; }
  },
  // 将一份原始游戏 JSON 写入快速槽并调用基座 continueGame
  loadRaw: function (raw) {
    try {
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.name === 'undefined') { XZ13.toast('⚠️ 不是有效的存档'); return false; }
      localStorage.setItem(SAVE_SYS.quick, raw);
      if (typeof continueGame === 'function') {
        continueGame();
        XZ13.toast('📖 存档已读取');
        setTimeout(function () { XZ13.closeModal(); }, 300);
        return true;
      }
      XZ13.toast('⚠️ 读档函数不可用');
      return false;
    } catch (e) { XZ13.toast('⚠️ 读档失败：' + e.message); return false; }
  },
  deleteSlot: function (n) {
    XZ13.lsDel(SAVE_SYS.slotKey(n));
    XZ13.toast('🗑️ 已删除槽位 ' + n);
  },
  exportFile: function () {
    var raw = SAVE_SYS.snapshot();
    if (!raw) { XZ13.toast('⚠️ 请先进入游戏再导出'); return; }
    var payload = { xz13: true, ver: XZ13.ver, exportedAt: Date.now(), game: raw };
    try {
      var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      var meta = SAVE_SYS.metaOf(raw);
      var fn = '西子模拟器存档_' + (meta ? meta.name : '存档') + '_' + XZ13.ver + '.json';
      a.href = url; a.download = fn;
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 500);
      XZ13.toast('📤 已导出存档 JSON');
    } catch (e) { XZ13.toast('⚠️ 导出失败：' + e.message); }
  },
  importFile: function () {
    var inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.json,application/json';
    inp.onchange = function () {
      var f = inp.files && inp.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        var text = String(fr.result || '');
        var raw = null;
        try {
          var obj = JSON.parse(text);
          if (obj && obj.xz13 === true && obj.game) raw = obj.game;
          else if (obj && obj.name) raw = JSON.stringify(obj);
        } catch (e) {}
        if (!raw) { XZ13.toast('⚠️ 文件不是有效存档'); return; }
        if (SAVE_SYS.loadRaw(raw)) { XZ13.toast('📥 已导入并读取'); }
      };
      fr.readAsText(f);
    };
    inp.click();
  },
  open: function () {
    var h = '<h3>💾 存档管理（5.5.13）</h3>' +
      '<p class="dim small">支持 3 个手动槽位 + 自动存档；可导出 JSON 备份/换机，也可从文件导入。</p>' +
      '<div class="xz13-save-bar">' +
      '<button class="xz13-save-ss-btn primary" onclick="XZ13_SAVE.exportFile()">📤 导出存档</button>' +
      '<button class="xz13-save-ss-btn" onclick="XZ13_SAVE.importFile()">📥 导入存档</button></div>';
    for (var n = 1; n <= 3; n++) {
      var wrap = XZ13.lsGet(SAVE_SYS.slotKey(n), null);
      var meta = null, at = null;
      if (wrap) { try { var w = JSON.parse(wrap); meta = SAVE_SYS.metaOf(w.raw); at = w.at; } catch (e) {} }
      if (meta) {
        h += '<div class="xz13-save-slot"><div class="ss-head"><span class="ss-title">槽位 ' + n + ' · ' + XZ13.esc(meta.name) + '</span>' +
          '<span class="ss-meta">' + meta.mode + '｜第 ' + (meta.day + 1) + ' 天｜' + XZ13.esc(meta.loc) + (meta.date ? '｜' + meta.date : '') + (at ? '｜' + XZ13.fmtTime(at) : '') + '</span></div>' +
          '<div class="ss-actions">' +
          '<button class="xz13-save-ss-btn primary" onclick="XZ13_SAVE.loadSlot(' + n + ')">📖 读取</button>' +
          '<button class="xz13-save-ss-btn" onclick="XZ13_SAVE.saveToSlot(' + n + ');XZ13_SAVE.open()">💾 覆盖保存</button>' +
          '<button class="xz13-save-ss-btn danger" onclick="XZ13_SAVE.deleteSlot(' + n + ');XZ13_SAVE.open()">🗑️ 删除</button>' +
          '</div></div>';
      } else {
        h += '<div class="xz13-save-slot empty"><div class="ss-head"><span class="ss-title">槽位 ' + n + '（空）</span></div>' +
          '<div class="ss-actions"><button class="xz13-save-ss-btn" onclick="XZ13_SAVE.saveToSlot(' + n + ');XZ13_SAVE.open()">💾 存到这里</button>' +
          '<button class="xz13-save-ss-btn" disabled>暂无数据</button></div></div>';
      }
    }
    h += '<button class="gbtn" style="margin-top:10px" onclick="closeModal()">关闭</button>';
    XZ13.modal(h);
  }
};
window.XZ13_SAVE = SAVE_SYS;

/* 自动存档：游戏进行中每 30 秒静默保存，切后台/关闭前再存一次 */
function startAutosave() {
  try {
    setInterval(function () {
      try { if (typeof G !== 'undefined' && G && !G.over && typeof saveGame === 'function') saveGame(); } catch (e) {}
    }, 30000);
    window.addEventListener('pagehide', function () {
      try { if (typeof G !== 'undefined' && G && !G.over && typeof saveGame === 'function') saveGame(); } catch (e) {}
    });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        try { if (typeof G !== 'undefined' && G && !G.over && typeof saveGame === 'function') saveGame(); } catch (e) {}
      }
    });
  } catch (e) {}
}

/* ────────────────────────────────────────────────────────────
   三、游戏中心 / 工具箱 启动器
   ──────────────────────────────────────────────────────────── */
function openGameCenter13() {
  var h = '<h3>🎮 游戏中心 2.0（5.5.13 新增）</h3><p class="dim small">' + XZ13.GAMES.length + ' 个全新可玩游戏，全部有真实判定 + 本地最高纪录。</p><div class="xz13-gc-grid">';
  for (var i = 0; i < XZ13.GAMES.length; i++) {
    var g = XZ13.GAMES[i];
    var best = g.bestKey ? XZ13.best(g.bestKey) : 0;
    h += '<div class="xz13-gc-card" onclick="' + g.call + '">' +
      '<span class="gc-icon">' + g.icon + '</span><span class="gc-name">' + g.name + '</span>' +
      (g.bestKey ? '<span class="gc-best">🏆 ' + best + '</span>' : '<span class="gc-best">即开即玩</span>') +
      '</div>';
  }
  h += '</div>';
  // 也放一个入口回到原版小游戏
  h += '<button class="gbtn" onclick="try{__xz13Hall.open();}catch(e){}">🏆 成就墙/每日挑战</button>';
  h += '<button class="gbtn" onclick="try{openGame();}catch(e){}">🕹️ 原版小游戏（13 个）</button>';
  h += '<button class="gbtn" style="margin-left:8px" onclick="closeModal()">关闭</button>';
  XZ13.modal(h);
}
window.__xz13GameCenter = openGameCenter13;

function openToolbox13() {
  var h = '<h3>🧰 实用工具箱 2.0（5.5.13 新增）</h3><p class="dim small">' + XZ13.TOOLS.length + ' 个学习/生活工具，本地存储，刷新不丢。</p><div class="xz13-gc-grid">';
  for (var i = 0; i < XZ13.TOOLS.length; i++) {
    var t = XZ13.TOOLS[i];
    h += '<div class="xz13-gc-card" onclick="' + t.call + '"><span class="gc-icon">' + t.icon + '</span><span class="gc-name">' + t.name + '</span></div>';
  }
  h += '</div>';
  h += '<button class="gbtn" onclick="try{openAppShop();}catch(e){}">🛍️ 原版应用商城（12 个）</button>';
  h += '<button class="gbtn" style="margin-left:8px" onclick="closeModal()">关闭</button>';
  XZ13.modal(h);
}
window.__xz13Toolbox = openToolbox13;

/* ────────────────────────────────────────────────────────────
   四、入口按钮注入（顶部功能行 + 工作台 + 右下 FAB）
   ──────────────────────────────────────────────────────────── */
function injectEntries() {
  var row = XZ13.$s('.xz-func-row');
  if (row) {
    addMini(row, 'xz13-save-btn', '💾 存档', function () { SAVE_SYS.open(); });
    addMini(row, 'xz13-gamecenter-btn', '🎮 游戏', function () { openGameCenter13(); });
    addMini(row, 'xz13-toolbox-btn', '🧰 工具', function () { openToolbox13(); });
  }
  // 工作台
  var wb = XZ13.$('xzWorkbench');
  if (wb) {
    addWb(wb, 'xz13-wb-theme', '🎨 皮肤', function () { openThemePanel13(); });
    addWb(wb, 'xz13-wb-save', '💾 存档', function () { SAVE_SYS.open(); });
    addWb(wb, 'xz13-wb-game', '🎮 游戏中心', function () { openGameCenter13(); });
    addWb(wb, 'xz13-wb-tool', '🧰 工具箱', function () { openToolbox13(); });
  }
  // 重接 5.5.9 主题按钮：克隆节点移除其旧闭包监听，改开新面板
  var oldThemeBtn = XZ13.$('xz559-theme-btn');
  if (oldThemeBtn) {
    try {
      var nb = oldThemeBtn.cloneNode(true);
      nb.addEventListener('click', function () { openThemePanel13(); });
      oldThemeBtn.parentNode.replaceChild(nb, oldThemeBtn);
    } catch (e) {}
  }
}
function addMini(row, id, text, fn) {
  if (XZ13.$(id)) return;
  try {
    var b = document.createElement('button');
    b.id = id; b.className = 'mini gbtn'; b.textContent = text;
    b.addEventListener('click', function () { try { fn(); } catch (e) { XZ13.toast('⚠️ ' + e.message); } });
    row.appendChild(b);
  } catch (e) {}
}
function addWb(wb, id, text, fn) {
  if (XZ13.$(id)) return;
  try {
    var d = document.createElement('div');
    d.id = id; d.className = 'wb-btn'; d.textContent = text;
    d.addEventListener('click', function () { try { fn(); } catch (e) { XZ13.toast('⚠️ ' + e.message); } });
    wb.appendChild(d);
  } catch (e) {}
}

/* 右下快捷 FAB（游戏中心），与诊断（左下）、工作台（右下）避让 */
function injectFab() {
  if (XZ13.$('xz13Fab')) return;
  try {
    var fab = document.createElement('button');
    fab.id = 'xz13Fab'; fab.title = '游戏中心 2.0'; fab.textContent = '🎮';
    fab.addEventListener('click', function () { openGameCenter13(); });
    document.body.appendChild(fab);
  } catch (e) {}
}

/* ────────────────────────────────────────────────────────────
   五、更新日志：向现有日志面板顶部插入 5.5.13 条目
   ──────────────────────────────────────────────────────────── */
var LOG_5513 = [
  '🌤️ 美术恢复：默认主题回到「晴空」浅色原版（浅蓝晴空·白色玻璃·彩色状态条），即参考截图样式',
  '🌸 全新皮肤「樱语春日」：奶油粉白玻璃 + 樱花飘落动画，共 7 套皮肤一键切换',
  '💾 存档系统：3 个手动槽位 + 30 秒自动存档 + 切后台保存 + 导出/导入 JSON 备份换机',
  '🎤 真实麦克风 K 歌：getUserMedia 实时采音，自相关算法检测基频，音名/波形/音准评分，拒绝授权自动回退',
  '🎮 游戏中心 2.0：新增 2048、记忆翻牌、打地鼠、反应力、俄罗斯方块 5 个完整游戏，全部有判定和本地纪录',
  '🧰 工具箱 2.0：记事本、习惯打卡、课堂点名、密码生成、心情日记、高考倒计时、转盘决定等 8 个工具',
  '🤖 AI 题库继续扩容：新增大量校园生活意图，覆盖学科/考试/食堂/宿舍/情感/网络热梗',
  '🛡️ 全模块 try/catch 隔离、哨兵防重、Canvas 兼容、浮层避让，修一轮崩溃与重叠问题'
];
function patchChangelogObserver() {
  try {
    var mo = new MutationObserver(function () {
      var box = XZ13.$('xzChangelogModal');
      if (box && !box.getAttribute('data-xz13')) {
        box.setAttribute('data-xz13', '1');
        var items = LOG_5513.map(function (it) { return '<div>' + it + '</div>'; }).join('');
        var block = document.createElement('div');
        block.className = 'xz-cl-version';
        block.innerHTML = '<span class="v-num">v5.5.13</span><span class="v-date">美术回归+存档+真麦+新游戏+新工具</span><div class="v-list">' + items + '</div>';
        box.insertBefore(block, box.firstChild);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
}

/* ────────────────────────────────────────────────────────────
   六、启动
   ──────────────────────────────────────────────────────────── */
XZ13.ready(function () {
  var bootSteps = [
    function () { lockBaseTheme(); },
    function () { applyArtTheme13(getCurrentTheme13()); },
    function () { startAutosave(); },
    function () { injectEntries(); },
    function () { injectFab(); },
    function () { patchChangelogObserver(); },
    function () {
      // 运行各模块注册的 init
      for (var i = 0; i < XZ13.inits.length; i++) {
        try { XZ13.inits[i](); } catch (e) { /* 隔离 */ }
      }
    }
  ];
  // 功能行/工作台由 5.5.9 起的补丁轮询注入，故用定时器持续补偿
  function runBoot(i) {
    if (i >= bootSteps.length) return;
    try { bootSteps[i](); } catch (e) {}
    setTimeout(function () { runBoot(i + 1); }, 30);
  }
  runBoot(0);
  // 入口补偿：功能行可能很晚才出现，持续尝试 30 秒
  var tries = 0;
  var timer = setInterval(function () {
    injectEntries();
    if (++tries > 75) clearInterval(timer);
  }, 400);
  // 页面加载后再次确保主题正确（抵消旧补丁的初始化）
  setTimeout(function () { try { applyArtTheme13(getCurrentTheme13()); } catch (e) {} }, 600);
  setTimeout(function () { try { applyArtTheme13(getCurrentTheme13()); } catch (e) {} }, 1800);
});

/* ===== x5513_mic.js ===== */
/* ============================================================
   5.5.13 · 第 2 模块：真实麦克风 K 歌 / 音准检测
   getUserMedia 采音 + 自相关(ACF)基频检测 + 实时音名/波形/音量
   跟唱「小星星」简谱，按真实音高评分；无麦/被拒时优雅回退
   ============================================================ */
var MIC13 = {
  active: false,
  audioCtx: null,
  analyser: null,
  stream: null,
  raf: 0,
  source: null,
  // 演唱状态
  seq: [],          // 目标 MIDI 音序列
  idx: 0,
  hold: 0,          // 当前音已稳定累计帧数
  noteStart: 0,     // 当前目标音开始时间
  noteDur: 1500,    // 每目标音时长 ms
  results: [],      // 每个音 {hit, cents}
  combo: 0,
  maxCombo: 0,
  centsBuf: [],     // 稳定性统计
  volBuf: [],
  curFreq: 0,
  curMidi: -1,
  curCents: 0,
  curVol: 0,
  noteNames: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
};
window.XZ13_MIC = MIC13;

function micFreqToMidi(f) {
  if (f <= 0) return -1;
  return 69 + 12 * Math.log2(f / 440);
}
function micMidiName(m) {
  if (m < 0) return '--';
  var name = MIC13.noteNames[Math.round(m) % 12];
  var oct = Math.floor(Math.round(m) / 12) - 1;
  return name + oct;
}
function micMidiFreq(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

/* 自相关基频检测（带通 50–900Hz，足够覆盖人声常用区间） */
function autoCorrelate(buf, sampleRate) {
  var SIZE = buf.length;
  var rms = 0;
  for (var i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.012) return { freq: -1, rms: rms };
  var r1 = 0, r2 = SIZE - 1;
  var th = 0.2;
  for (var a = 0; a < SIZE / 2; a++) { if (Math.abs(buf[a]) < th) { r1 = a; break; } }
  for (var b = 1; b < SIZE / 2; b++) { if (Math.abs(buf[SIZE - b]) < th) { r2 = SIZE - b; break; } }
  var seg = buf.slice(r1, r2);
  var c = new Array(seg.length).fill(0);
  for (var x = 0; x < seg.length; x++) {
    for (var y = 0; y < seg.length - x; y++) {
      c[x] = c[x] + seg[y] * seg[y + x];
    }
  }
  var d = 0;
  while (d < c.length - 1 && c[d] > c[d + 1]) d++;
  var maxv = -1, maxl = -1;
  var minLag = Math.floor(sampleRate / 900);
  var maxLag = Math.ceil(sampleRate / 50);
  for (var l = minLag; l < Math.min(maxLag, c.length); l++) {
    if (c[l] > maxv) { maxv = c[l]; maxl = l; }
  }
  var T0 = maxl;
  if (T0 <= 0) return { freq: -1, rms: rms };
  // 抛物线插值
  var x1 = (T0 > 0 ? c[T0 - 1] : c[T0]);
  var x2 = c[T0];
  var x3 = (T0 < c.length - 1 ? c[T0 + 1] : c[T0]);
  var a2 = (x1 + x3 - 2 * x2) / 2;
  var b2 = (x3 - x1) / 2;
  if (a2) T0 = T0 - b2 / (2 * a2);
  return { freq: sampleRate / T0, rms: rms };
}

function openMicKaraoke() {
  var h = '<h3>🎤 真麦 K 歌 · 音准检测</h3>' +
    '<div class="xz13-mic-wrap">' +
    '<div class="xz13-mic-hint">点「开始」并允许麦克风权限。跟着亮起的音唱「小星星」，音准/稳定/节奏实时评分。</div>' +
    '<canvas id="xz13MicCanvas" width="480" height="130"></canvas>' +
    '<div class="xz13-mic-note" id="xz13MicNote">--</div>' +
    '<div class="xz13-mic-meter"><i id="xz13MicVol"></i></div>' +
    '<div class="xz13-mic-targets" id="xz13MicTargets"></div>' +
    '<div class="xz13-mic-scores" id="xz13MicScores">' +
    '<div class="xz13-mic-sc"><b id="xz13MicHits">0/0</b><span>命中</span></div>' +
    '<div class="xz13-mic-sc"><b id="xz13MicCombo">0</b><span>最高连击</span></div>' +
    '<div class="xz13-mic-sc"><b id="xz13MicCents">--</b><span>音分偏差</span></div>' +
    '<div class="xz13-mic-sc"><b id="xz13MicStatus">待开始</b><span>状态</span></div>' +
    '</div>' +
    '<button class="xz13-mic-btn" id="xz13MicStartBtn" onclick="XZ13_MIC.start()">🎤 开始真麦演唱</button>' +
    '<button class="xz13-mic-btn stop" onclick="XZ13_MIC.finish(true)">结束并评分</button>' +
    '<button class="gbtn" onclick="XZ13_MIC.finish(true);closeModal()">关闭</button>' +
    '<div class="xz13-mic-hint" id="xz13MicFallback"></div>' +
    '</div>';
  XZ13.modal(h);
}
window.__xz13Mic = { open: openMicKaraoke };

function micRenderTargets() {
  var box = document.getElementById('xz13MicTargets');
  if (!box) return;
  var h = '';
  for (var i = 0; i < MIC13.seq.length; i++) {
    var cls = '';
    if (MIC13.results[i]) cls = MIC13.results[i].hit ? ' hit' : ' miss';
    else if (i === MIC13.idx) cls = ' active';
    h += '<div class="xz13-mic-tn' + cls + '"><b>' + micMidiName(MIC13.seq[i]) + '</b><span>' + (i + 1) + '</span></div>';
  }
  box.innerHTML = h;
}

MIC13.start = function () {
  var self = this;
  var btn = document.getElementById('xz13MicStartBtn');
  if (btn) { btn.disabled = true; btn.textContent = '🎙️ 正在请求麦克风…'; }
  var fallback = document.getElementById('xz13MicFallback');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    self.failBack('当前环境不支持麦克风（可能是 file:// 或旧浏览器）。已为你保留模拟 K 歌音准曲线。');
    return;
  }
  navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
  }).then(function (stream) {
    self.stream = stream;
    var AC = window.AudioContext || window.webkitAudioContext;
    self.audioCtx = new AC();
    self.analyser = self.audioCtx.createAnalyser();
    self.analyser.fftSize = 2048;
    self.source = self.audioCtx.createMediaStreamSource(stream);
    self.source.connect(self.analyser);
    self.buf = new Float32Array(self.analyser.fftSize);
    // 小星星 C4 C4 G4 G4 A4 A4 G4 / F4 F4 E4 E4 D4 D4 C4
    self.seq = [60, 60, 67, 67, 69, 69, 67, 65, 65, 64, 64, 62, 62, 60];
    self.idx = 0; self.hold = 0; self.results = []; self.combo = 0; self.maxCombo = 0;
    self.centsBuf = []; self.volBuf = []; self.noteStart = Date.now(); self.active = true;
    if (btn) { btn.disabled = true; btn.textContent = '🎙️ 演唱中…'; }
    var st = document.getElementById('xz13MicStatus'); if (st) st.textContent = '请演唱';
    micRenderTargets();
    self.loop();
  }).catch(function (err) {
    self.failBack('麦克风被拒绝或不可用：' + (err && err.name ? err.name : '未知') + '。可在地址栏授权后重试，或使用原版模拟 K 歌。');
  });
};

MIC13.failBack = function (msg) {
  var self = this;
  var f = document.getElementById('xz13MicFallback');
  if (f) f.textContent = msg;
  var btn = document.getElementById('xz13MicStartBtn');
  if (btn) { btn.disabled = false; btn.textContent = '🔁 重试麦克风'; }
  // 回退：用模拟音高也能体验一遍（不评分准确性，但流程完整）
  self.active = false;
  self.cleanup();
};

MIC13.cleanup = function () {
  var self = this;
  if (self.raf) { cancelAnimationFrame(self.raf); self.raf = 0; }
  try { if (self.stream) { self.stream.getTracks().forEach(function (t) { t.stop(); }); } } catch (e) {}
  try { if (self.source) self.source.disconnect(); } catch (e) {}
  try { if (self.audioCtx) self.audioCtx.close(); } catch (e) {}
  self.stream = null; self.source = null; self.audioCtx = null; self.analyser = null;
};

MIC13.loop = function () {
  var self = this;
  if (!self.active) return;
  var now = Date.now();
  var analysis = self.analyser;
  if (analysis) {
    analysis.getFloatTimeDomainData(self.buf);
    var r = autoCorrelate(self.buf, self.audioCtx.sampleRate);
    self.curFreq = r.freq; self.curVol = r.rms;
    if (r.freq > 0) {
      var midi = micFreqToMidi(r.freq);
      self.curMidi = midi;
      var target = self.seq[self.idx];
      self.curCents = Math.round((midi - target) * 100);
      var noteEl = document.getElementById('xz13MicNote');
      if (noteEl) {
        noteEl.textContent = micMidiName(midi);
        var ad = Math.abs(midi - target);
        noteEl.style.color = ad < 0.5 ? '#1f9e6e' : ad < 1 ? '#ffb020' : '#e04870';
      }
      var ce = document.getElementById('xz13MicCents');
      if (ce) ce.textContent = (self.curCents > 0 ? '+' : '') + self.curCents;
      self.centsBuf.push(self.curCents);
      // 命中判定：连续约 0.5 秒（30 帧）稳定在 ±0.5 半音内
      if (Math.abs(midi - target) < 0.5) {
        self.hold++;
        self.volBuf.push(r.rms);
        if (self.hold >= 28) {
          var avgCents = 0;
          var slice = self.centsBuf.slice(-28);
          for (var k = 0; k < slice.length; k++) avgCents += Math.abs(slice[k]);
          avgCents = avgCents / slice.length;
          self.results[self.idx] = { hit: true, cents: Math.round(avgCents) };
          self.combo++; self.maxCombo = Math.max(self.maxCombo, self.combo);
          self.advance();
        }
      } else {
        self.hold = Math.max(0, self.hold - 2);
      }
    } else {
      self.curMidi = -1;
      var ne = document.getElementById('xz13MicNote');
      if (ne) { ne.textContent = '--'; ne.style.color = 'inherit'; }
    }
    var vol = document.getElementById('xz13MicVol');
    if (vol) vol.style.width = Math.min(100, Math.round(r.rms * 280)) + '%';
    var hits = document.getElementById('xz13MicHits');
    if (hits) {
      var hn = 0; for (var h2 = 0; h2 < self.results.length; h2++) if (self.results[h2] && self.results[h2].hit) hn++;
      hits.textContent = hn + '/' + self.seq.length;
    }
    var cb = document.getElementById('xz13MicCombo');
    if (cb) cb.textContent = self.maxCombo;
    // 超时未唱中 → 判 miss 并前进
    if (now - self.noteStart > self.noteDur) {
      if (!self.results[self.idx]) {
        self.results[self.idx] = { hit: false, cents: 100 };
        self.combo = 0;
      }
      self.advance();
    }
    self.draw(r.rms);
  }
  self.raf = requestAnimationFrame(function () { self.loop(); });
};

MIC13.advance = function () {
  var self = this;
  self.idx++; self.hold = 0; self.noteStart = Date.now();
  micRenderTargets();
  if (self.idx >= self.seq.length) {
    self.finish(false);
  }
};

MIC13.draw = function (rms) {
  var self = this;
  var cv = document.getElementById('xz13MicCanvas');
  if (!cv || !self.analyser) return;
  var ctx = cv.getContext('2d');
  var W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  // 背景
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, W, H);
  // 网格
  ctx.strokeStyle = 'rgba(127,140,255,.12)';
  ctx.lineWidth = 1;
  for (var gy = 0; gy <= 4; gy++) { var yy = H * gy / 4; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
  // 波形
  ctx.lineWidth = 2;
  var grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, '#4a7dff'); grad.addColorStop(1, '#ff8ab5');
  ctx.strokeStyle = grad;
  ctx.beginPath();
  var n = self.buf.length;
  for (var i = 0; i < n; i += 4) {
    var x = (i / n) * W;
    var y = H / 2 + self.buf[i] * H * 0.45;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // 目标音高参考线（当前目标 → 横线位置）
  var target = self.seq[self.idx];
  if (target) {
    var yNote = H - (((target - 48) / 24) * H);
    if (yNote < 8) yNote = 8; if (yNote > H - 8) yNote = H - 8;
    ctx.strokeStyle = '#3ddc97';
    ctx.setLineDash([6, 4]); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, yNote); ctx.lineTo(W, yNote); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#3ddc97'; ctx.font = '11px sans-serif';
    ctx.fillText('目标 ' + micMidiName(target), 8, yNote - 4);
  }
  // 剩余时间进度
  var prog = Math.min(1, (Date.now() - self.noteStart) / self.noteDur);
  ctx.fillStyle = 'rgba(255,177,32,.7)';
  ctx.fillRect(0, H - 3, W * prog, 3);
};

MIC13.finish = function (manual) {
  var self = this;
  var wasActive = self.active;
  self.active = false;
  self.cleanup();
  // 统计
  var total = self.seq.length, hits = 0, errSum = 0, errCnt = 0;
  for (var i = 0; i < self.results.length; i++) {
    if (self.results[i] && self.results[i].hit) {
      hits++; errSum += self.results[i].cents; errCnt++;
    }
  }
  var acc = errCnt ? Math.max(0, 100 - Math.round(errSum / errCnt * 2)) : 0;
  var hitRate = total ? Math.round(hits / total * 100) : 0;
  var comboRate = total ? Math.round(self.maxCombo / total * 100) : 0;
  var volAvg = 0;
  if (self.volBuf.length) {
    for (var v = 0; v < self.volBuf.length; v++) volAvg += self.volBuf[v];
    volAvg = volAvg / self.volBuf.length;
  }
  var breath = Math.max(0, Math.min(100, Math.round(volAvg * 320)));
  var stability = errCnt ? Math.max(0, Math.min(100, Math.round(acc * 0.7 + comboRate * 0.3))) : 0;
  var overall = Math.round(hitRate * 0.4 + acc * 0.35 + stability * 0.15 + breath * 0.1);
  var grade = overall >= 90 ? 'SSS' : overall >= 80 ? 'S' : overall >= 68 ? 'A' : overall >= 50 ? 'B' : 'C';
  if (!wasActive && hits === 0) {
    // 没有成功启动过麦克风，仅重置按钮，不弹评分
    var b0 = document.getElementById('xz13MicStartBtn');
    if (b0) { b0.disabled = false; b0.textContent = '🎤 开始真麦演唱'; }
    var st0 = document.getElementById('xz13MicStatus'); if (st0) st0.textContent = '待开始';
    return;
  }
  var btn = document.getElementById('xz13MicStartBtn');
  if (btn) { btn.disabled = false; btn.textContent = '🔁 再来一次'; btn.onclick = function () { openMicKaraoke(); }; }
  var st = document.getElementById('xz13MicStatus'); if (st) st.textContent = '已结束';
  // 给玩家游戏内奖励（在局内）
  try {
    if (typeof G !== 'undefined' && G && !G.over) {
      G.mood += 8 + Math.round(overall / 10);
      G.charm += 2;
      if (typeof clampAll === 'function') clampAll();
      if (typeof upd === 'function') upd();
      XZ13.log('🎤 真麦 K 歌评级 ' + grade + '（' + overall + '分），心情提升！', 'good');
    }
  } catch (e) {}
  var h = '<h3>🎤 演唱结果 · 评级 ' + grade + '</h3>' +
    '<div class="xz13-mic-scores">' +
    '<div class="xz13-mic-sc"><b style="font-size:26px">' + overall + '</b><span>总分</span></div>' +
    '<div class="xz13-mic-sc"><b>' + hits + '/' + total + '</b><span>命中</span></div>' +
    '<div class="xz13-mic-sc"><b>' + acc + '</b><span>音准</span></div>' +
    '<div class="xz13-mic-sc"><b>' + stability + '</b><span>稳定</span></div>' +
    '<div class="xz13-mic-sc"><b>' + breath + '</b><span>气息/音量</span></div>' +
    '<div class="xz13-mic-sc"><b>' + self.maxCombo + '</b><span>最高连击</span></div>' +
    '</div>' +
    '<div class="xz13-mic-hint">评级参考：SSS≥90，S≥80，A≥68，B≥50。保持音量稳定、贴住目标音即可拿高分。</div>' +
    '<button class="gbtn" onclick="XZ13_MIC.open()">🔁 再唱一次</button>' +
    '<button class="gbtn" onclick="closeModal()">关闭</button>';
  setTimeout(function () { XZ13.modal(h); }, 250);
};

/* 在原版 K 歌面板里挂一个「真麦」入口 */
function hookKaraokeMicEntry() {
  try {
    if (typeof PATCH === 'undefined' || !PATCH.karaoke || typeof PATCH.karaoke.startKaraoke !== 'function') return;
    if (window.__xz13_mic_hooked__) return;
    window.__xz13_mic_hooked__ = true;
    var orig = PATCH.karaoke.startKaraoke;
    PATCH.karaoke.startKaraoke = function () {
      try {
        if (orig) orig.apply(this, arguments);
      } catch (e) {}
      setTimeout(function () {
        var status = document.getElementById('karaoke-status');
        if (status && !document.getElementById('xz13MicEntryBtn')) {
          var b = document.createElement('button');
          b.id = 'xz13MicEntryBtn'; b.className = 'gbtn';
          b.style.cssText = 'margin:8px auto;display:block;';
          b.textContent = '🎤 真麦模式（设备麦克风音准）';
          b.onclick = function () { openMicKaraoke(); };
          status.parentNode.insertBefore(b, status.nextSibling);
        }
      }, 200);
    };
  } catch (e) {}
}
XZ13.inits.push(function () {
  hookKaraokeMicEntry();
  // 轮询补偿 PATCH 延迟定义
  var t = setInterval(function () {
    hookKaraokeMicEntry();
    if (window.__xz13_mic_hooked__) clearInterval(t);
  }, 1000);
  setTimeout(function () { clearInterval(t); }, 20000);
});

/* ===== x5513_games_a.js ===== */
/* ============================================================
   5.5.13 · 第 3 模块（A）：新游戏 —— 2048 / 记忆翻牌 / 打地鼠 / 反应力
   每个游戏自包含，有真实判定、本地最高纪录、移动端按钮与滑动、
   关闭弹窗即清理定时器/键盘监听，绝不残留。
   ============================================================ */
var XZ13G = window.XZ13GAMES || {};
window.XZ13GAMES = XZ13G;

/* 通用：把游戏内表现结算成奖励（仅在局内有效） */
function gcReward(mood, knowledge, fitness) {
  try {
    if (typeof G === 'undefined' || !G || G.over) return;
    G.mood = (G.mood || 0) + mood;
    if (knowledge) G.knowledge = (G.knowledge || 0) + knowledge;
    if (fitness) G.fitness = (G.fitness || 0) + fitness;
    if (typeof clampAll === 'function') clampAll();
    if (typeof upd === 'function') upd();
  } catch (e) {}
}
/* 通用：监听容器是否已随弹窗关闭，是则清理 */
function gcWatch(id, cleanup) {
  var n = 0;
  var t = setInterval(function () {
    n++;
    if (!document.getElementById(id)) {
      clearInterval(t);
      try { cleanup(); } catch (e) {}
    } else if (n > 3600) { // 最长 30 分钟兜底
      clearInterval(t);
    }
  }, 500);
  return t;
}
/* 越低越好的最小成绩（如反应毫秒） */
function gcBestMin(key, val) {
  var k = 'xz13_best_min_' + key;
  if (typeof val === 'number') {
    var cur = parseFloat(XZ13.lsGet(k, '99999'));
    if (!isFinite(cur)) cur = 99999;
    if (val < cur) { XZ13.lsSet(k, String(val)); return val; }
    return cur;
  }
  var v = parseFloat(XZ13.lsGet(k, '0')) || 0;
  return v;
}
/* 排行榜（本地最近 5 条） */
function gcPushBoard(key, name, val) {
  try {
    var k = 'xz13_board_' + key;
    var list = [];
    try { list = JSON.parse(XZ13.lsGet(k, '[]')) || []; } catch (e) { list = []; }
    list.push({ name: name || '我', val: val, at: Date.now() });
    list.sort(function (a, b) { return b.val - a.val; });
    list = list.slice(0, 5);
    XZ13.lsSet(k, JSON.stringify(list));
    return list;
  } catch (e) { return []; }
}
function gcBoard(key) {
  try { return JSON.parse(XZ13.lsGet('xz13_board_' + key, '[]')) || []; } catch (e) { return []; }
}
function gcBoardHtml(key) {
  var list = gcBoard(key);
  if (!list.length) return '<div class="dim small">暂无纪录，来拿第一名！</div>';
  var h = '<div class="xz13-lb">';
  for (var i = 0; i < list.length; i++) {
    h += '<div class="xz13-lb-row r' + (i + 1) + '"><span class="rank">第 ' + (i + 1) + ' 名</span><span>' + XZ13.esc(list[i].name) + ' · ' + list[i].val + '</span></div>';
  }
  return h + '</div>';
}

/* ═══════════════════════════════════════════════
   1) 2048
   ═══════════════════════════════════════════════ */
XZ13G.g2048 = {
  grid: [], score: 0, over: false, won: false, moving: false,
  colors: {
    2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563', 32: '#f67c5f',
    64: '#f65e3b', 128: '#edcf72', 256: '#edcc61', 512: '#edc850', 1024: '#edc53f',
    2048: '#edc22e', 4096: '#3c3a32', 8192: '#16213e'
  },
  open: function () {
    var g = this;
    g.grid = new Array(16).fill(0); g.score = 0; g.over = false; g.won = false;
    g.spawn(); g.spawn();
    XZ13.modal('<h3>🔢 2048</h3>' +
      '<div class="xz13-2048-wrap">' +
      '<div class="xz13-2048-hd"><span>分数：<b id="g2048Score">0</b></span><span>最高：<b>' + XZ13.best('g2048') + '</b></span></div>' +
      '<div class="xz13-2048-box"><div class="xz13-2048-grid" id="g2048Grid"></div></div>' +
      '<div class="dim small" style="text-align:center;margin:8px 0">方向键 / WASD / 滑动；手机可用下方按钮</div>' +
      '<div style="text-align:center">' +
      '<button class="gbtn" data-m="up">↑</button><br>' +
      '<button class="gbtn" data-m="left">←</button><button class="gbtn" data-m="down">↓</button><button class="gbtn" data-m="right">→</button>' +
      '</div>' +
      '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.g2048.open()">重开</button><button class="gbtn" onclick="closeModal()">退出</button></div>' +
      '<div id="g2048Overlay"></div></div>');
    g.render();
    g.bind();
  },
  spawn: function () {
    var g = this;
    var empty = [];
    for (var i = 0; i < 16; i++) if (!g.grid[i]) empty.push(i);
    if (!empty.length) return;
    var idx = empty[Math.floor(Math.random() * empty.length)];
    g.grid[idx] = Math.random() < 0.9 ? 2 : 4;
  },
  render: function () {
    var g = this;
    var el = document.getElementById('g2048Grid');
    if (!el) return;
    var h = '';
    for (var i = 0; i < 16; i++) {
      var v = g.grid[i];
      var bg = v ? g.colors[v] || '#3c3a32' : 'rgba(255,255,255,.35)';
      var fg = v <= 4 ? '#5a4a78' : '#fff';
      var fs = v >= 1024 ? '19px' : '24px';
      h += '<div class="xz13-2048-cell" style="background:' + bg + ';color:' + fg + ';font-size:' + fs + '">' + (v || '') + '</div>';
    }
    el.innerHTML = h;
    var sc = document.getElementById('g2048Score');
    if (sc) sc.textContent = g.score;
  },
  move: function (dir) {
    var g = this;
    if (g.over || g.moving) return;
    var before = g.grid.join(',');
    var lines = [];
    for (var r = 0; r < 4; r++) {
      var line;
      if (dir === 'left') line = [g.grid[r * 4], g.grid[r * 4 + 1], g.grid[r * 4 + 2], g.grid[r * 4 + 3]];
      else if (dir === 'right') line = [g.grid[r * 4 + 3], g.grid[r * 4 + 2], g.grid[r * 4 + 1], g.grid[r * 4]];
      else if (dir === 'up') line = [g.grid[r], g.grid[r + 4], g.grid[r + 8], g.grid[r + 12]];
      else line = [g.grid[r + 12], g.grid[r + 8], g.grid[r + 4], g.grid[r]];
      lines.push(line);
    }
    for (var a = 0; a < 4; a++) {
      var arr = lines[a].filter(function (x) { return x; });
      for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) { arr[i] *= 2; g.score += arr[i]; arr.splice(i + 1, 1); }
      }
      while (arr.length < 4) arr.push(0);
      lines[a] = arr;
    }
    for (var rr = 0; rr < 4; rr++) {
      for (var cc = 0; cc < 4; cc++) {
        var val;
        if (dir === 'left') val = lines[rr][cc];
        else if (dir === 'right') val = lines[rr][3 - cc];
        else if (dir === 'up') val = lines[cc][rr];
        else val = lines[3 - cc][rr];
        g.grid[rr * 4 + cc] = val;
      }
    }
    if (g.grid.join(',') === before) return;
    g.spawn();
    g.render();
    if (!g.won && g.grid.indexOf(2048) >= 0) { g.won = true; g.overlay('🎉 合成 2048！可继续挑战', false); }
    if (!g.canMove()) { g.over = true; g.end(); }
  },
  canMove: function () {
    var g = this;
    for (var i = 0; i < 16; i++) {
      if (!g.grid[i]) return true;
      if (i % 4 !== 3 && g.grid[i] === g.grid[i + 1]) return true;
      if (i < 12 && g.grid[i] === g.grid[i + 4]) return true;
    }
    return false;
  },
  overlay: function (msg, over) {
    var o = document.getElementById('g2048Overlay');
    if (!o) return;
    o.innerHTML = '<div class="xz13-2048-over"><b>' + msg + '</b></div>';
    if (over) {
      o.innerHTML = '<div class="xz13-2048-over"><b>' + msg + '</b><br><span>分数 ' + g.score + '</span><br>' +
        '<button class="gbtn" onclick="XZ13GAMES.g2048.open()">再来一局</button></div>';
    }
  },
  end: function () {
    var g = this;
    var best = XZ13.best('g2048', g.score);
    var board = gcPushBoard('g2048', '我', g.score);
    gcReward(8 + Math.round(g.score / 200), 0, 0);
    var o = document.getElementById('g2048Overlay');
    if (o) o.innerHTML = '<div class="xz13-2048-over"><b>游戏结束</b><br><span>本局 ' + g.score + ' 分｜最高 ' + best + '</span><br>' +
      '<button class="gbtn" onclick="XZ13GAMES.g2048.open()">再来一局</button><button class="gbtn" onclick="closeModal()">退出</button>' +
      gcBoardHtml('g2048') + '</div>';
  },
  bind: function () {
    var g = this;
    g.handler = function (e) {
      var map = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down' };
      var m = map[e.key];
      if (m) { e.preventDefault(); g.move(m); }
    };
    window.addEventListener('keydown', g.handler);
    // 屏幕按钮
    XZ13.$$('[data-m]').forEach(function (b) {
      b.addEventListener('click', function () { g.move(b.getAttribute('data-m')); });
    });
    // 滑动
    var grid = document.getElementById('g2048Grid');
    if (grid) {
      var sx = 0, sy = 0;
      grid.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      grid.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
        if (Math.abs(dx) > Math.abs(dy)) g.move(dx > 0 ? 'right' : 'left');
        else g.move(dy > 0 ? 'down' : 'up');
      }, { passive: true });
    }
    gcWatch('g2048Grid', function () {
      if (g.handler) window.removeEventListener('keydown', g.handler);
    });
  }
};

/* ═══════════════════════════════════════════════
   2) 记忆翻牌（4×4，8 对）
   ═══════════════════════════════════════════════ */
XZ13G.mem = {
  emojis: ['🍎', '📚', '⚽', '🎧', '🐱', '🌈', '🍜', '🎸'],
  cards: [], open: [], matched: 0, moves: 0, lock: false, secs: 0, timer: 0, started: false,
  open: function () {
    var m = this;
    var deck = m.emojis.concat(m.emojis);
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = deck[i]; deck[i] = deck[j]; deck[j] = t;
    }
    m.cards = deck; m.open = []; m.matched = 0; m.moves = 0; m.lock = false; m.secs = 0; m.started = false;
    clearInterval(m.timer);
    XZ13.modal('<h3>🧠 记忆翻牌</h3>' +
      '<div class="xz13-mem-hd">步数 <b id="gmemMoves">0</b> ｜ 配对 <b id="gmemPair">0/8</b> ｜ 用时 <b id="gmemTime">0s</b> ｜ 最高 <b>' + XZ13.best('gmem') + '</b></div>' +
      '<div class="xz13-mem-grid" id="gmemGrid"></div>' +
      '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="XZ13GAMES.mem.open()">重开</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
    m.render();
    gcWatch('gmemGrid', function () { clearInterval(m.timer); });
  },
  render: function () {
    var m = this;
    var el = document.getElementById('gmemGrid');
    if (!el) return;
    var h = '';
    for (var i = 0; i < m.cards.length; i++) {
      h += '<div class="xz13-mem-card" data-i="' + i + '"><div class="xz13-mem-inner">' +
        '<div class="xz13-mem-face xz13-mem-front">❓</div>' +
        '<div class="xz13-mem-face xz13-mem-back">' + m.cards[i] + '</div>' +
        '</div></div>';
    }
    el.innerHTML = h;
    XZ13.$$('#gmemGrid .xz13-mem-card').forEach(function (card) {
      card.addEventListener('click', function () { m.flip(parseInt(card.getAttribute('data-i'), 10)); });
    });
  },
  flip: function (i) {
    var m = this;
    if (m.lock) return;
    if (m.open.indexOf(i) >= 0) return;
    if (m.open.length === 0 && m.cards[i] && m.cards[i].done) return;
    // 已配对的不可再点
    if (m.cards[i] === null) return;
    if (!m.started) { m.started = true; m.timer = setInterval(function () { m.secs++; var te = document.getElementById('gmemTime'); if (te) te.textContent = m.secs + 's'; }, 1000); }
    var card = document.querySelector('#gmemGrid .xz13-mem-card[data-i="' + i + '"]');
    if (card && card.classList.contains('done')) return;
    if (card) card.classList.add('flipped');
    m.open.push(i);
    if (m.open.length === 2) {
      m.moves++;
      var me = document.getElementById('gmemMoves'); if (me) me.textContent = m.moves;
      var [a, b] = m.open;
      if (m.cards[a] === m.cards[b]) {
        m.lock = true;
        setTimeout(function () {
          var ca = document.querySelector('#gmemGrid .xz13-mem-card[data-i="' + a + '"]');
          var cb = document.querySelector('#gmemGrid .xz13-mem-card[data-i="' + b + '"]');
          if (ca) { ca.classList.remove('flipped'); ca.classList.add('done'); }
          if (cb) { cb.classList.remove('flipped'); cb.classList.add('done'); }
          m.cards[a] = null; m.cards[b] = null;
          m.matched++; m.open = []; m.lock = false;
          var pe = document.getElementById('gmemPair'); if (pe) pe.textContent = m.matched + '/8';
          if (m.matched === 8) m.end();
        }, 260);
      } else {
        m.lock = true;
        setTimeout(function () {
          var ca = document.querySelector('#gmemGrid .xz13-mem-card[data-i="' + a + '"]');
          var cb = document.querySelector('#gmemGrid .xz13-mem-card[data-i="' + b + '"]');
          if (ca) ca.classList.remove('flipped');
          if (cb) cb.classList.remove('flipped');
          m.open = []; m.lock = false;
        }, 680);
      }
    }
  },
  end: function () {
    var m = this;
    clearInterval(m.timer);
    var score = Math.max(100, 10000 - m.moves * 120 - m.secs * 12);
    var best = XZ13.best('gmem', score);
    gcPushBoard('gmem', '我', score);
    gcReward(6, 0, 0);
    XZ13.modal('<h3>🎉 全部配对完成！</h3>' +
      '<div class="xz13-mem-hd">用时 ' + m.secs + ' 秒｜步数 ' + m.moves + '｜得分 ' + score + '｜最高 ' + best + '</div>' +
      gcBoardHtml('gmem') +
      '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="XZ13GAMES.mem.open()">再来一局</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  }
};

/* ═══════════════════════════════════════════════
   3) 打地鼠（30 秒）
   ═══════════════════════════════════════════════ */
XZ13G.whack = {
  time: 30, hits: 0, misses: 0, upIdx: -1, timer: 0, popTimer: 0, remain: 30,
  open: function () {
    var w = this;
    w.time = 30; w.hits = 0; w.misses = 0; w.remain = 30; w.upIdx = -1;
    clearInterval(w.timer); clearTimeout(w.popTimer);
    XZ13.modal('<h3>🔨 打地鼠</h3>' +
      '<div class="xz13-whack-wrap"><div class="xz13-whack-hd">剩余 <span id="gwhTime">30</span> 秒 ｜ 命中 <span id="gwhHits">0</span> ｜ 最高 <b>' + XZ13.best('gwhack') + '</b></div>' +
      '<div class="xz13-whack-grid" id="gwhGrid"></div>' +
      '<div style="margin-top:10px"><button class="gbtn" onclick="XZ13GAMES.whack.open()">重开</button><button class="gbtn" onclick="closeModal()">退出</button></div></div>');
    var grid = document.getElementById('gwhGrid');
    for (var i = 0; i < 9; i++) {
      var hole = document.createElement('div');
      hole.className = 'xz13-whack-hole'; hole.id = 'gwhHole' + i;
      hole.innerHTML = '<div class="xz13-whack-mole">🐹</div>';
      (function (idx, h) {
        h.addEventListener('click', function () { w.bonk(idx, h); });
      })(i, hole);
      grid.appendChild(hole);
    }
    w.timer = setInterval(function () {
      w.remain--;
      var te = document.getElementById('gwhTime'); if (te) te.textContent = w.remain;
      if (w.remain <= 0) w.end();
    }, 1000);
    w.popLoop();
    gcWatch('gwhGrid', function () { clearInterval(w.timer); clearTimeout(w.popTimer); });
  },
  popLoop: function () {
    var w = this;
    if (w.remain <= 0) return;
    if (w.upIdx >= 0) {
      var old = document.getElementById('gwhHole' + w.upIdx);
      if (old) old.classList.remove('up');
      w.upIdx = -1;
    }
    var idx = Math.floor(Math.random() * 9);
    w.upIdx = idx;
    var hole = document.getElementById('gwhHole' + idx);
    if (hole) { hole.classList.remove('bonk'); hole.classList.add('up'); }
    // 难度随时间提升：露头间隔缩短
    var speed = Math.max(420, 820 - (30 - w.remain) * 12);
    w.popTimer = setTimeout(function () {
      if (w.upIdx === idx) {
        // 未打到 → 一次失误统计
        if (hole && hole.classList.contains('up')) w.misses++;
      }
      if (hole) hole.classList.remove('up');
      w.upIdx = -1;
      w.popLoop();
    }, speed);
  },
  bonk: function (idx, hole) {
    var w = this;
    if (idx === w.upIdx && hole.classList.contains('up')) {
      w.hits++;
      hole.classList.add('bonk');
      setTimeout(function () { hole.classList.remove('up'); hole.classList.remove('bonk'); }, 120);
      w.upIdx = -1;
      var he = document.getElementById('gwhHits'); if (he) he.textContent = w.hits;
      clearTimeout(w.popTimer);
      w.popLoop();
    }
  },
  end: function () {
    var w = this;
    clearInterval(w.timer); clearTimeout(w.popTimer);
    var best = XZ13.best('gwhack', w.hits);
    gcPushBoard('gwhack', '我', w.hits);
    gcReward(5, 0, 3);
    XZ13.modal('<h3>⏰ 时间到！</h3>' +
      '<div class="xz13-whack-hd">命中 ' + w.hits + ' 只地鼠｜最高 ' + best + '</div>' +
      gcBoardHtml('gwhack') +
      '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="XZ13GAMES.whack.open()">再来一局</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  }
};

/* ═══════════════════════════════════════════════
   4) 反应力（红绿灯，5 轮取平均）
   ═══════════════════════════════════════════════ */
XZ13G.react = {
  state: 'idle', rounds: 0, times: [], startTime: 0, timer: 0,
  open: function () {
    var r = this;
    r.state = 'idle'; r.rounds = 0; r.times = [];
    var rb = gcBestMin('greact');
    XZ13.modal('<h3>⚡ 反应力测试</h3>' +
      '<div class="dim small" style="text-align:center">看到变绿的瞬间点击；提前点算抢跑。共 5 轮，取平均。最快 <b>' + (rb || '--') + 'ms</b></div>' +
      '<div class="xz13-react-stage idle" id="greactStage">点击开始</div>' +
      '<div class="xz13-game-hud" id="greactHud"><span>第 1/5 轮</span><span>最好 ' + (rb ? rb + 'ms' : '--') + '</span></div>' +
      '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="closeModal()">退出</button></div>');
    var stage = document.getElementById('greactStage');
    stage.addEventListener('click', function () { r.tap(); });
    gcWatch('greactStage', function () { clearTimeout(r.timer); });
  },
  setStage: function (cls, text) {
    var s = document.getElementById('greactStage');
    if (s) { s.className = 'xz13-react-stage ' + cls; s.textContent = text; }
  },
  tap: function () {
    var r = this;
    if (r.state === 'idle' || r.state === 'result') {
      r.state = 'wait';
      r.setStage('wait', '等绿色出现…');
      var delay = 1500 + Math.random() * 2800;
      r.timer = setTimeout(function () {
        r.state = 'go';
        r.startTime = Date.now();
        r.setStage('go', '点击！');
      }, delay);
    } else if (r.state === 'wait') {
      clearTimeout(r.timer);
      r.state = 'idle';
      r.setStage('result', '抢跑啦！点此重来');
    } else if (r.state === 'go') {
      var ms = Date.now() - r.startTime;
      r.times.push(ms); r.rounds++;
      r.state = 'result';
      var hud = document.getElementById('greactHud');
      if (hud) hud.innerHTML = '<span>第 ' + Math.min(r.rounds + 1, 5) + '/5 轮</span><span>本轮 ' + ms + 'ms</span>';
      if (r.rounds >= 5) { r.end(); return; }
      r.setStage('result', ms + ' ms · 点此继续');
    }
  },
  end: function () {
    var r = this;
    var sum = 0, best = r.times[0];
    for (var i = 0; i < r.times.length; i++) { sum += r.times[i]; if (r.times[i] < best) best = r.times[i]; }
    var avg = Math.round(sum / r.times.length);
    var rec = gcBestMin('greact', best); // 越低越好
    gcReward(4, 0, 2);
    var grade = best < 180 ? '反应超群 🏆' : best < 240 ? '反应敏捷' : best < 320 ? '反应正常' : '可以再练练';
    var isRecord = (best <= rec);
    XZ13.modal('<h3>⚡ 测试完成' + (isRecord ? ' · 新纪录！' : '') + '</h3>' +
      '<div class="xz13-whack-hd" style="text-align:center">平均 <b>' + avg + 'ms</b> ｜ 最快 <b>' + best + 'ms</b> ｜ 历史最快 <b>' + rec + 'ms</b></div>' +
      '<div class="xz13-game-hud"><span>' + grade + '</span></div>' +
      '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.react.open()">再测一次</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  }
};

/* ===== x5513_games_b.js ===== */
/* ============================================================
   5.5.13 · 第 3 模块（B）：俄罗斯方块（完整）+ 游戏注册
   ============================================================ */
XZ13G.tetris = {
  COLS: 10, ROWS: 20, BLOCK: 22,
  grid: [], piece: null, next: null, score: 0, lines: 0, level: 0,
  over: false, paused: false, raf: 0, last: 0, acc: 0,
  shapes: {
    I: { m: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], c: '#39d0d8' },
    J: { m: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], c: '#4a7dff' },
    L: { m: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], c: '#ff9f43' },
    O: { m: [[1, 1], [1, 1]], c: '#ffd166' },
    S: { m: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], c: '#3ddc97' },
    T: { m: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], c: '#8b5cf6' },
    Z: { m: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], c: '#ff5d73' }
  },
  keys: ['I', 'J', 'L', 'O', 'S', 'T', 'Z'],
  open: function () {
    var t = this;
    t.grid = [];
    for (var r = 0; r < t.ROWS; r++) t.grid.push(new Array(t.COLS).fill(null));
    t.score = 0; t.lines = 0; t.level = 0; t.over = false; t.paused = false; t.acc = 0;
    XZ13.modal('<h3>🟦 俄罗斯方块</h3>' +
      '<div class="xz13-tetris-wrap"><div><canvas id="gtetrisCanvas" width="220" height="440"></canvas></div>' +
      '<div class="xz13-tetris-side">' +
      '<canvas id="gtetrisNext" width="96" height="96"></canvas>' +
      '<div class="xz13-game-hud" style="display:block;margin-top:8px">' +
      '<span id="gtetrisScore">分数 0</span><span id="gtetrisLines">消除 0</span><span id="gtetrisLevel">等级 0</span><span>最高 ' + XZ13.best('gtetris') + '</span></div>' +
      '<div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:6px">' +
      '<button class="gbtn" id="gtL">←</button><button class="gbtn" id="gtR">→</button>' +
      '<button class="gbtn" id="gtD">↓</button><button class="gbtn" id="gtRot">旋转</button>' +
      '<button class="gbtn" id="gtDrop" style="grid-column:1/3">硬降</button>' +
      '<button class="gbtn" id="gtPause" style="grid-column:1/3">暂停</button>' +
      '</div><button class="gbtn" style="margin-top:8px" onclick="closeModal()">退出</button>' +
      '</div></div>');
    t.next = t.newPiece();
    t.spawn();
    t.bind();
    t.last = performance.now();
    t.raf = requestAnimationFrame(function (ts) { t.frame(ts); });
  },
  newPiece: function () {
    var t = this;
    var k = t.keys[Math.floor(Math.random() * t.keys.length)];
    var def = t.shapes[k];
    var m = def.m.map(function (row) { return row.slice(); });
    return { m: m, c: def.c, x: Math.floor((t.COLS - m[0].length) / 2), y: 0 };
  },
  spawn: function () {
    var t = this;
    t.piece = t.next;
    t.next = t.newPiece();
    if (t.collide(t.piece, 0, 0)) {
      t.gameOver();
    }
  },
  collide: function (p, dx, dy, m) {
    var t = this;
    var mm = m || p.m;
    for (var y = 0; y < mm.length; y++) {
      for (var x = 0; x < mm[y].length; x++) {
        if (!mm[y][x]) continue;
        var nx = p.x + x + dx, ny = p.y + y + dy;
        if (nx < 0 || nx >= t.COLS || ny >= t.ROWS) return true;
        if (ny >= 0 && t.grid[ny][nx]) return true;
      }
    }
    return false;
  },
  rotateCW: function (m) {
    var n = m.length;
    var out = [];
    for (var y = 0; y < n; y++) {
      out.push([]);
      for (var x = 0; x < n; x++) out[y].push(m[n - 1 - x][y]);
    }
    return out;
  },
  move: function (dx) {
    var t = this;
    if (!t.collide(t.piece, dx, 0)) t.piece.x += dx;
  },
  softDrop: function () {
    var t = this;
    if (!t.collide(t.piece, 0, 1)) { t.piece.y++; t.score += 1; }
    else t.lock();
  },
  rotate: function () {
    var t = this;
    var rotated = t.rotateCW(t.piece.m);
    var kicks = [0, -1, 1, -2, 2];
    for (var i = 0; i < kicks.length; i++) {
      if (!t.collide(t.piece, kicks[i], 0, rotated)) {
        t.piece.m = rotated; t.piece.x += kicks[i]; return;
      }
    }
  },
  hardDrop: function () {
    var t = this;
    var d = 0;
    while (!t.collide(t.piece, 0, 1)) { t.piece.y++; d++; }
    t.score += d * 2;
    t.lock();
  },
  lock: function () {
    var t = this;
    var p = t.piece;
    for (var y = 0; y < p.m.length; y++) {
      for (var x = 0; x < p.m[y].length; x++) {
        if (p.m[y][x]) {
          var gy = p.y + y, gx = p.x + x;
          if (gy >= 0 && gy < t.ROWS && gx >= 0 && gx < t.COLS) t.grid[gy][gx] = p.c;
        }
      }
    }
    t.clearLines();
    t.spawn();
  },
  clearLines: function () {
    var t = this;
    var cleared = 0;
    for (var y = t.ROWS - 1; y >= 0; y--) {
      var full = true;
      for (var x = 0; x < t.COLS; x++) { if (!t.grid[y][x]) { full = false; break; } }
      if (full) {
        t.grid.splice(y, 1);
        t.grid.unshift(new Array(t.COLS).fill(null));
        cleared++; y++;
      }
    }
    if (cleared) {
      var pts = [0, 100, 300, 500, 800][cleared] * (t.level + 1);
      t.score += pts;
      t.lines += cleared;
      t.level = Math.floor(t.lines / 10);
    }
  },
  speed: function () {
    return Math.max(90, 700 * Math.pow(0.82, this.level));
  },
  frame: function (ts) {
    var t = this;
    if (!document.getElementById('gtetrisCanvas')) { t.stop(); return; }
    if (!t.over && !t.paused) {
      var dt = ts - t.last;
      t.last = ts;
      t.acc += dt;
      if (t.acc >= t.speed()) { t.softDrop(); t.acc = 0; }
      t.draw();
    } else {
      t.last = ts;
    }
    t.raf = requestAnimationFrame(function (n) { t.frame(n); });
  },
  draw: function () {
    var t = this;
    var cv = document.getElementById('gtetrisCanvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var B = t.BLOCK;
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, cv.width, cv.height);
    // 网格线
    ctx.strokeStyle = 'rgba(255,255,255,.05)';
    ctx.lineWidth = 1;
    for (var gx = 0; gx <= t.COLS; gx++) { ctx.beginPath(); ctx.moveTo(gx * B, 0); ctx.lineTo(gx * B, t.ROWS * B); ctx.stroke(); }
    for (var gy = 0; gy <= t.ROWS; gy++) { ctx.beginPath(); ctx.moveTo(0, gy * B); ctx.lineTo(t.COLS * B, gy * B); ctx.stroke(); }
    // 已落方块
    for (var y = 0; y < t.ROWS; y++) {
      for (var x = 0; x < t.COLS; x++) {
        if (t.grid[y][x]) t.block(ctx, x * B, y * B, t.grid[y][x]);
      }
    }
    // 当前方块
    if (t.piece) {
      for (var py = 0; py < t.piece.m.length; py++) {
        for (var px = 0; px < t.piece.m[py].length; px++) {
          if (t.piece.m[py][px]) t.block(ctx, (t.piece.x + px) * B, (t.piece.y + py) * B, t.piece.c);
        }
      }
    }
    if (t.paused) {
      ctx.fillStyle = 'rgba(0,0,0,.6)';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('已暂停', cv.width / 2, cv.height / 2);
      ctx.textAlign = 'left';
    }
    // 下一个
    var nc = document.getElementById('gtetrisNext');
    if (nc) {
      var nctx = nc.getContext('2d');
      nctx.fillStyle = '#0d1117'; nctx.fillRect(0, 0, nc.width, nc.height);
      var nb = 22;
      var nm = t.next.m;
      var offX = (nc.width - nm[0].length * nb) / 2;
      var offY = (nc.height - nm.length * nb) / 2;
      for (var ny = 0; ny < nm.length; ny++) {
        for (var nx = 0; nx < nm[ny].length; nx++) {
          if (nm[ny][nx]) t.block(nctx, offX + nx * nb, offY + ny * nb, t.next.c, nb);
        }
      }
    }
    var s1 = document.getElementById('gtetrisScore'); if (s1) s1.textContent = '分数 ' + t.score;
    var l1 = document.getElementById('gtetrisLines'); if (l1) l1.textContent = '消除 ' + t.lines;
    var v1 = document.getElementById('gtetrisLevel'); if (v1) v1.textContent = '等级 ' + t.level;
  },
  block: function (ctx, x, y, color, B) {
    B = B || this.BLOCK;
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, B - 2, B - 2);
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    ctx.fillRect(x + 1, y + 1, B - 2, 4);
    ctx.fillStyle = 'rgba(0,0,0,.18)';
    ctx.fillRect(x + 1, y + B - 5, B - 2, 4);
  },
  gameOver: function () {
    var t = this;
    t.over = true;
    t.stop();
    var best = XZ13.best('gtetris', t.score);
    gcPushBoard('gtetris', '我', t.score);
    gcReward(6 + Math.round(t.score / 400), 0, 0);
    XZ13.modal('<h3>💀 游戏结束</h3>' +
      '<div class="xz13-whack-hd" style="text-align:center">分数 ' + t.score + ' ｜ 消除 ' + t.lines + ' 行 ｜ 最高 ' + best + '</div>' +
      gcBoardHtml('gtetris') +
      '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="XZ13GAMES.tetris.open()">再来一局</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  },
  stop: function () {
    var t = this;
    if (t.raf) { cancelAnimationFrame(t.raf); t.raf = 0; }
    if (t.kh) window.removeEventListener('keydown', t.kh);
  },
  bind: function () {
    var t = this;
    t.kh = function (e) {
      if (t.over) return;
      var k = e.key;
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') { e.preventDefault(); t.move(-1); t.draw(); }
      else if (k === 'ArrowRight' || k === 'd' || k === 'D') { e.preventDefault(); t.move(1); t.draw(); }
      else if (k === 'ArrowDown' || k === 's' || k === 'S') { e.preventDefault(); t.softDrop(); t.draw(); }
      else if (k === 'ArrowUp' || k === 'w' || k === 'W') { e.preventDefault(); t.rotate(); t.draw(); }
      else if (k === ' ') { e.preventDefault(); t.hardDrop(); t.draw(); }
      else if (k === 'p' || k === 'P') { e.preventDefault(); t.paused = !t.paused; var pb = document.getElementById('gtPause'); if (pb) pb.textContent = t.paused ? '继续' : '暂停'; }
    };
    window.addEventListener('keydown', t.kh);
    var bind = function (id, fn) {
      var b = document.getElementById(id);
      if (b) {
        b.addEventListener('click', function () { if (t.over) return; fn(); t.draw(); });
        b.addEventListener('touchstart', function (e) { e.preventDefault(); if (t.over) return; fn(); t.draw(); }, { passive: false });
      }
    };
    bind('gtL', function () { t.move(-1); });
    bind('gtR', function () { t.move(1); });
    bind('gtD', function () { t.softDrop(); });
    bind('gtRot', function () { t.rotate(); });
    bind('gtDrop', function () { t.hardDrop(); });
    bind('gtPause', function () { t.paused = !t.paused; var pb = document.getElementById('gtPause'); if (pb) pb.textContent = t.paused ? '继续' : '暂停'; });
    gcWatch('gtetrisCanvas', function () { t.stop(); });
  }
};

/* ═══════════════════════════════════════════════
   注册到游戏中心
   ═══════════════════════════════════════════════ */
XZ13.GAMES.push(
  { icon: '🔢', name: '2048', bestKey: 'g2048', call: 'XZ13GAMES.g2048.open()' },
  { icon: '🟦', name: '俄罗斯方块', bestKey: 'gtetris', call: 'XZ13GAMES.tetris.open()' },
  { icon: '🧠', name: '记忆翻牌', bestKey: 'gmem', call: 'XZ13GAMES.mem.open()' },
  { icon: '🐹', name: '打地鼠', bestKey: 'gwhack', call: 'XZ13GAMES.whack.open()' },
  { icon: '⚡', name: '反应力', bestKey: null, call: 'XZ13GAMES.react.open()' }
);

/* ===== x5513_games_c.js ===== */
/* ============================================================
   5.5.13 · 第 3 模块（C）：扫雷 / 打砖块 / 贪吃蛇 Pro
   自包含 DOM 与 Canvas，全部含判定与本地纪录，关闭即清理。
   ============================================================ */

/* ═══════════════════════════════════════════════
   6) 扫雷（9×9，10 雷）
   ═══════════════════════════════════════════════ */
XZ13G.mines = {
  N: 9, MINES: 10, cells: [], shown: [], flag: [], over: false, win: false,
  secs: 0, timer: 0, started: false, flagMode: false,
  open: function () {
    var m = this;
    XZ13.modal('<h3>💣 扫雷</h3>' +
      '<div style="max-width:380px;margin:0 auto">' +
      '<div class="xz13-game-hud"><span>雷 <b id="gmsMines">10</b></span><span>时间 <b id="gmsTime">0</b>s</span><span>最快 <b>' + (gcBestMin('gms') || '--') + 's</b></span></div>' +
      '<div class="xz13-save-bar" style="justify-content:center"><button class="xz13-save-ss-btn" id="gmsFlag">🚩 模式：挖开</button>' +
      '<button class="xz13-save-ss-btn" onclick="XZ13GAMES.mines.open()">重开</button><button class="xz13-save-ss-btn" onclick="closeModal()">退出</button></div>' +
      '<div id="gmsGrid" style="display:grid;grid-template-columns:repeat(9,1fr);gap:3px;max-width:340px;margin:8px auto"></div></div>');
    m.reset();
    var fb = document.getElementById('gmsFlag');
    if (fb) fb.onclick = function () { m.flagMode = !m.flagMode; this.textContent = m.flagMode ? '🚩 模式：插旗' : '🚩 模式：挖开'; };
    gcWatch('gmsGrid', function () { clearInterval(m.timer); });
  },
  reset: function () {
    var m = this, N = m.N;
    m.shown = []; m.flag = []; m.cells = []; m.over = false; m.win = false; m.secs = 0; m.started = false;
    clearInterval(m.timer);
    for (var i = 0; i < N * N; i++) { m.shown.push(false); m.flag.push(false); m.cells.push(0); }
    // 布雷
    var placed = 0;
    while (placed < m.MINES) {
      var r = Math.floor(Math.random() * N * N);
      if (m.cells[r] !== -1) { m.cells[r] = -1; placed++; }
    }
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        if (m.cells[y * N + x] === -1) continue;
        var c = 0;
        m.around(x, y, function (nx, ny) { if (m.cells[ny * N + nx] === -1) c++; });
        m.cells[y * N + x] = c;
      }
    }
    this.render();
  },
  around: function (x, y, fn) {
    for (var dy = -1; dy <= 1; dy++) {
      for (var dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        var nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < this.N && ny >= 0 && ny < this.N) fn(nx, ny);
      }
    }
  },
  render: function () {
    var m = this;
    var grid = document.getElementById('gmsGrid');
    if (!grid) return;
    var colors = ['', '#4a7dff', '#1f9e6e', '#ff9f43', '#d9405c', '#8b5cf6', '#39d0d8', '#7a3', '#c2405c'];
    var h = '';
    for (var i = 0; i < m.N * m.N; i++) {
      var style = 'aspect-ratio:1;border-radius:5px;font-size:14px;font-weight:800;border:1px solid var(--line2,#3d4f82);cursor:pointer;';
      var content = '', bg = 'rgba(127,127,127,.15)';
      if (m.shown[i]) {
        bg = 'rgba(127,127,127,.06)';
        if (m.cells[i] === -1) { content = '💣'; bg = '#ffd0d8'; }
        else if (m.cells[i] > 0) { content = m.cells[i]; style += 'color:' + colors[m.cells[i]] + ';'; }
      } else if (m.flag[i]) {
        content = '🚩';
      }
      h += '<div data-i="' + i + '" style="' + style + 'background:' + bg + ';display:flex;align-items:center;justify-content:center">' + content + '</div>';
    }
    grid.innerHTML = h;
    XZ13.$$('#gmsGrid [data-i]').forEach(function (cell) {
      cell.addEventListener('click', function () {
        var i = parseInt(cell.getAttribute('data-i'), 10);
        if (m.flagMode) m.mark(i); else m.dig(i);
      });
      cell.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        m.mark(parseInt(cell.getAttribute('data-i'), 10));
      });
    });
    var mc = document.getElementById('gmsMines');
    if (mc) mc.textContent = m.MINES - m.flag.filter(Boolean).length;
  },
  startTimer: function () {
    var m = this;
    if (m.started) return;
    m.started = true;
    m.timer = setInterval(function () {
      m.secs++;
      var te = document.getElementById('gmsTime'); if (te) te.textContent = m.secs;
    }, 1000);
  },
  mark: function (i) {
    var m = this;
    if (m.over || m.shown[i]) return;
    m.flag[i] = !m.flag[i];
    m.render();
  },
  dig: function (i) {
    var m = this;
    if (m.over || m.flag[i] || m.shown[i]) return;
    m.startTimer();
    if (m.cells[i] === -1) {
      m.shown[i] = true; m.lose();
      return;
    }
    var stack = [i];
    while (stack.length) {
      var cur = stack.pop();
      if (m.shown[cur]) continue;
      m.shown[cur] = true;
      if (m.cells[cur] === 0) {
        var cx = cur % m.N, cy = Math.floor(cur / m.N);
        m.around(cx, cy, function (nx, ny) {
          var ni = ny * m.N + nx;
          if (!m.shown[ni] && m.cells[ni] !== -1) stack.push(ni);
        });
      }
    }
    m.render();
    var openCount = m.shown.filter(Boolean).length;
    if (openCount === m.N * m.N - m.MINES) m.win();
  },
  lose: function () {
    var m = this;
    m.over = true;
    clearInterval(m.timer);
    for (var i = 0; i < m.N * m.N; i++) if (m.cells[i] === -1) m.shown[i] = true;
    m.render();
    XZ13.modal('<h3>💥 踩到雷了</h3><div class="xz13-whack-hd" style="text-align:center">用时 ' + m.secs + ' 秒</div>' +
      '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.mines.open()">再来一局</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  },
  win: function () {
    var m = this;
    m.over = true; m.win = true;
    clearInterval(m.timer);
    var rec = gcBestMin('gms', m.secs);
    gcReward(8, 2, 0);
    XZ13.modal('<h3>🎉 排雷成功！</h3>' +
      '<div class="xz13-whack-hd" style="text-align:center">用时 <b>' + m.secs + 's</b> ｜ 最快 <b>' + rec + 's</b></div>' +
      '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.mines.open()">再来一局</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  }
};

/* ═══════════════════════════════════════════════
   7) 打砖块（Breakout）
   ═══════════════════════════════════════════════ */
XZ13G.breakout = {
  W: 400, H: 460,
  raf: 0, running: false, over: false,
  paddle: { x: 150, w: 90, h: 12 },
  ball: { x: 200, y: 380, vx: 3.2, vy: -3.4, r: 7 },
  bricks: [], score: 0, lives: 3,
  open: function () {
    var b = this;
    b.over = false; b.running = true; b.score = 0; b.lives = 3;
    b.paddle.x = (b.W - b.paddle.w) / 2;
    b.ball = { x: b.W / 2, y: 380, vx: (Math.random() < .5 ? -1 : 1) * 3.2, vy: -3.4, r: 7 };
    b.buildBricks();
    XZ13.modal('<h3>🧱 打砖块</h3>' +
      '<div style="text-align:center">' +
      '<div class="xz13-game-hud"><span id="gboScore">分数 0</span><span id="gboLives">❤ 3</span><span>最高 ' + XZ13.best('gbreak') + '</span></div>' +
      '<canvas id="gboCanvas" width="400" height="460" style="max-width:96vw;background:#0d1117;border-radius:12px;touch-action:none"></canvas>' +
      '<div style="margin-top:8px"><button class="gbtn" id="gboL">←</button><button class="gbtn" id="gboR">→</button><button class="gbtn" id="gboPause">暂停</button><button class="gbtn" onclick="closeModal()">退出</button></div></div>');
    b.bind();
    b.raf = requestAnimationFrame(function () { b.loop(); });
  },
  buildBricks: function () {
    var b = this;
    b.bricks = [];
    var rows = 5, cols = 8, pad = 6, bw = (b.W - pad * (cols + 1)) / cols, bh = 18;
    var colsColor = ['#ff5d73', '#ff9f43', '#ffd166', '#3ddc97', '#4a7dff'];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        b.bricks.push({
          x: pad + c * (bw + pad), y: 50 + r * (bh + pad),
          w: bw, h: bh, alive: true, color: colsColor[r]
        });
      }
    }
  },
  bind: function () {
    var b = this;
    var cv = document.getElementById('gboCanvas');
    if (!cv) return;
    function moveTo(clientX) {
      var rect = cv.getBoundingClientRect();
      var ratio = b.W / rect.width;
      var x = (clientX - rect.left) * ratio - b.paddle.w / 2;
      b.paddle.x = Math.max(0, Math.min(b.W - b.paddle.w, x));
    }
    cv.addEventListener('mousemove', function (e) { moveTo(e.clientX); });
    cv.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (e.touches[0]) moveTo(e.touches[0].clientX);
    }, { passive: false });
    b.kh = function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); b.paddle.x = Math.max(0, b.paddle.x - 28); }
      else if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); b.paddle.x = Math.min(b.W - b.paddle.w, b.paddle.x + 28); }
      else if (e.key === ' ') { e.preventDefault(); b.running = !b.running; var p = document.getElementById('gboPause'); if (p) p.textContent = b.running ? '暂停' : '继续'; }
    };
    window.addEventListener('keydown', b.kh);
    var press = function (dir) {
      return function () { b.paddle.x = Math.max(0, Math.min(b.W - b.paddle.w, b.paddle.x + dir * 30)); };
    };
    var bl = document.getElementById('gboL'), br = document.getElementById('gboR'), bp = document.getElementById('gboPause');
    if (bl) { bl.onclick = press(-1); bl.ontouchstart = function (e) { e.preventDefault(); press(-1)(); }; }
    if (br) { br.onclick = press(1); br.ontouchstart = function (e) { e.preventDefault(); press(1)(); }; }
    if (bp) bp.onclick = function () { b.running = !b.running; this.textContent = b.running ? '暂停' : '继续'; };
    gcWatch('gboCanvas', function () { if (b.raf) cancelAnimationFrame(b.raf); if (b.kh) window.removeEventListener('keydown', b.kh); });
  },
  loop: function () {
    var b = this;
    if (!document.getElementById('gboCanvas')) { b.stop(); return; }
    var ctx = b.ctx();
    if (b.running && !b.over) {
      b.step();
      b.draw(ctx);
    } else {
      b.draw(ctx);
    }
    b.raf = requestAnimationFrame(function () { b.loop(); });
  },
  ctx: function () {
    var cv = document.getElementById('gboCanvas');
    return cv ? cv.getContext('2d') : null;
  },
  step: function () {
    var b = this;
    var ball = b.ball;
    ball.x += ball.vx; ball.y += ball.vy;
    if (ball.x < ball.r) { ball.x = ball.r; ball.vx = -ball.vx; }
    if (ball.x > b.W - ball.r) { ball.x = b.W - ball.r; ball.vx = -ball.vx; }
    if (ball.y < ball.r) { ball.y = ball.r; ball.vy = -ball.vy; }
    // 挡板
    var px = b.paddle.x, pw = b.paddle.w, py = b.H - 30;
    if (ball.y + ball.r >= py && ball.y + ball.r <= py + b.paddle.h + 10 && ball.x >= px && ball.x <= px + pw && ball.vy > 0) {
      ball.y = py - ball.r;
      var hit = (ball.x - (px + pw / 2)) / (pw / 2); // -1..1
      ball.vx = hit * 4.6;
      ball.vy = -Math.abs(ball.vy) - 0.05;
      var sp = Math.hypot(ball.vx, ball.vy);
      var max = 7.2;
      if (sp > max) { ball.vx *= max / sp; ball.vy *= max / sp; }
    }
    // 砖块
    for (var i = 0; i < b.bricks.length; i++) {
      var k = b.bricks[i];
      if (!k.alive) continue;
      if (ball.x + ball.r > k.x && ball.x - ball.r < k.x + k.w && ball.y + ball.r > k.y && ball.y - ball.r < k.y + k.h) {
        k.alive = false;
        b.score += 10;
        // 简单判定从上下/左右撞入
        var prevX = ball.x - ball.vx, prevY = ball.y - ball.vy;
        if (prevX + ball.r <= k.x || prevX - ball.r >= k.x + k.w) ball.vx = -ball.vx;
        else ball.vy = -ball.vy;
        break;
      }
    }
    var s = document.getElementById('gboScore'); if (s) s.textContent = '分数 ' + b.score;
    // 掉底
    if (ball.y > b.H + 20) {
      b.lives--;
      var lv = document.getElementById('gboLives'); if (lv) lv.textContent = '❤ ' + b.lives;
      if (b.lives <= 0) { b.gameOver(); return; }
      ball.x = b.W / 2; ball.y = 380; ball.vx = (Math.random() < .5 ? -1 : 1) * 3.2; ball.vy = -3.4;
      b.running = false;
      setTimeout(function () { b.running = true; }, 600);
    }
    // 全清
    var any = false;
    for (var j = 0; j < b.bricks.length; j++) if (b.bricks[j].alive) any = true;
    if (!any) { b.buildBricks(); ball.vx *= 1.1; ball.vy *= 1.1; }
  },
  draw: function (ctx) {
    if (!ctx) return;
    var b = this;
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, b.W, b.H);
    for (var i = 0; i < b.bricks.length; i++) {
      var k = b.bricks[i];
      if (!k.alive) continue;
      ctx.fillStyle = k.color;
      ctx.fillRect(k.x, k.y, k.w, k.h);
      ctx.fillStyle = 'rgba(255,255,255,.2)';
      ctx.fillRect(k.x, k.y, k.w, 3);
    }
    ctx.fillStyle = '#e8f0ff';
    ctx.fillRect(b.paddle.x, b.H - 30, b.paddle.w, b.paddle.h);
    ctx.beginPath();
    ctx.fillStyle = '#ffd166';
    ctx.arc(b.ball.x, b.ball.y, b.ball.r, 0, Math.PI * 2);
    ctx.fill();
    if (!b.running && !b.over) {
      ctx.fillStyle = 'rgba(0,0,0,.55)';
      ctx.fillRect(0, 0, b.W, b.H);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('已暂停', b.W / 2, b.H / 2);
      ctx.textAlign = 'left';
    }
  },
  gameOver: function () {
    var b = this;
    b.over = true; b.stop();
    var best = XZ13.best('gbreak', b.score);
    gcPushBoard('gbreak', '我', b.score);
    gcReward(6, 0, 1);
    XZ13.modal('<h3>游戏结束</h3><div class="xz13-whack-hd" style="text-align:center">分数 ' + b.score + ' ｜ 最高 ' + best + '</div>' +
      gcBoardHtml('gbreak') +
      '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.breakout.open()">再来一局</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  },
  stop: function () {
    var b = this;
    if (b.raf) { cancelAnimationFrame(b.raf); b.raf = 0; }
    if (b.kh) window.removeEventListener('keydown', b.kh);
  }
};

/* ═══════════════════════════════════════════════
   8) 贪吃蛇 Pro（Canvas，加速）
   ═══════════════════════════════════════════════ */
XZ13G.snake = {
  S: 300, G: 18, raf: 0, acc: 0, step: 150,
  snake: [], dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 },
  food: null, score: 0, over: false, running: true,
  open: function () {
    var s = this;
    s.snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
    s.dir = { x: 1, y: 0 }; s.nextDir = { x: 1, y: 0 };
    s.score = 0; s.over = false; s.running = true; s.acc = 0; s.step = 150;
    s.spawnFood();
    XZ13.modal('<h3>🐍 贪吃蛇 Pro</h3>' +
      '<div style="text-align:center"><div class="xz13-game-hud"><span id="gskScore">长度 3</span><span>最高 ' + XZ13.best('gsnake') + '</span></div>' +
      '<canvas id="gskCanvas" width="300" height="300" style="max-width:92vw;background:#0d1117;border-radius:12px;touch-action:none"></canvas>' +
      '<div style="margin-top:8px"><button class="gbtn" id="gskL">←</button><button class="gbtn" id="gskU">↑</button><button class="gbtn" id="gskD">↓</button><button class="gbtn" id="gskR">→</button><button class="gbtn" id="gskP">暂停</button><button class="gbtn" onclick="closeModal()">退出</button></div></div>');
    s.bind();
    s.last = performance.now();
    s.raf = requestAnimationFrame(function (t) { s.loop(t); });
  },
  spawnFood: function () {
    var s = this;
    while (true) {
      var f = { x: Math.floor(Math.random() * s.G), y: Math.floor(Math.random() * s.G) };
      var hit = false;
      for (var i = 0; i < s.snake.length; i++) if (s.snake[i].x === f.x && s.snake[i].y === f.y) hit = true;
      if (!hit) { s.food = f; return; }
    }
  },
  setDir: function (x, y) {
    var s = this;
    if (s.dir.x + x === 0 && s.dir.y + y === 0) return; // 不能反向
    s.nextDir = { x: x, y: y };
  },
  bind: function () {
    var s = this;
    s.kh = function (e) {
      var map = { ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0], ArrowRight: [1, 0], d: [1, 0], D: [1, 0], ArrowUp: [0, -1], w: [0, -1], W: [0, -1], ArrowDown: [0, 1], s: [0, 1], S: [0, 1] };
      var mv = map[e.key];
      if (mv) { e.preventDefault(); s.setDir(mv[0], mv[1]); }
      else if (e.key === ' ') { e.preventDefault(); s.running = !s.running; }
    };
    window.addEventListener('keydown', s.kh);
    var b2 = function (id, x, y) {
      var el = document.getElementById(id);
      if (el) {
        el.onclick = function () { s.setDir(x, y); };
        el.ontouchstart = function (e) { e.preventDefault(); s.setDir(x, y); };
      }
    };
    b2('gskL', -1, 0); b2('gskR', 1, 0); b2('gskU', 0, -1); b2('gskD', 0, 1);
    var cv = document.getElementById('gskCanvas');
    if (cv) {
      var sx = 0, sy = 0;
      cv.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      cv.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) > Math.abs(dy)) s.setDir(dx > 0 ? 1 : -1, 0);
        else s.setDir(0, dy > 0 ? 1 : -1);
      }, { passive: true });
    }
    var bp = document.getElementById('gskP');
    if (bp) bp.onclick = function () { s.running = !s.running; this.textContent = s.running ? '暂停' : '继续'; };
    gcWatch('gskCanvas', function () { if (s.raf) cancelAnimationFrame(s.raf); if (s.kh) window.removeEventListener('keydown', s.kh); });
  },
  loop: function (t) {
    var s = this;
    if (!document.getElementById('gskCanvas')) { s.stop(); return; }
    if (s.running && !s.over) {
      s.acc += t - s.last;
      if (s.acc >= s.step) { s.tick(); s.acc = 0; }
    }
    s.last = t;
    s.draw();
    s.raf = requestAnimationFrame(function (n) { s.loop(n); });
  },
  tick: function () {
    var s = this;
    s.dir = s.nextDir;
    var head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
    if (head.x < 0 || head.x >= s.G || head.y < 0 || head.y >= s.G) { s.gameOver(); return; }
    for (var i = 0; i < s.snake.length; i++) {
      if (s.snake[i].x === head.x && s.snake[i].y === head.y) { s.gameOver(); return; }
    }
    s.snake.unshift(head);
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score++;
      s.step = Math.max(70, 150 - s.score * 3);
      var se = document.getElementById('gskScore'); if (se) se.textContent = '长度 ' + s.snake.length;
      s.spawnFood();
    } else {
      s.snake.pop();
    }
  },
  draw: function () {
    var s = this;
    var cv = document.getElementById('gskCanvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var cell = s.S / s.G;
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, s.S, s.S);
    ctx.strokeStyle = 'rgba(255,255,255,.04)';
    for (var g = 0; g <= s.G; g++) {
      ctx.beginPath(); ctx.moveTo(g * cell, 0); ctx.lineTo(g * cell, s.S); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, g * cell); ctx.lineTo(s.S, g * cell); ctx.stroke();
    }
    // 食物
    ctx.fillStyle = '#ff5d73';
    ctx.beginPath();
    ctx.arc(s.food.x * cell + cell / 2, s.food.y * cell + cell / 2, cell / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    // 蛇
    for (var i = 0; i < s.snake.length; i++) {
      var p = s.snake[i];
      ctx.fillStyle = i === 0 ? '#3ddc97' : '#2aa977';
      ctx.fillRect(p.x * cell + 1, p.y * cell + 1, cell - 2, cell - 2);
    }
    if (s.over) {
      ctx.fillStyle = 'rgba(0,0,0,.6)';
      ctx.fillRect(0, 0, s.S, s.S);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('长度 ' + s.snake.length, s.S / 2, s.S / 2);
      ctx.textAlign = 'left';
    }
  },
  gameOver: function () {
    var s = this;
    s.over = true; s.stop();
    var best = XZ13.best('gsnake', s.score);
    gcPushBoard('gsnake', '我', s.score);
    gcReward(5, 0, 1);
    XZ13.modal('<h3>游戏结束</h3><div class="xz13-whack-hd" style="text-align:center">吃了 ' + s.score + ' 个 ｜ 长度 ' + s.snake.length + ' ｜ 最高 ' + best + '</div>' +
      gcBoardHtml('gsnake') +
      '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.snake.open()">再来一局</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  },
  stop: function () {
    var s = this;
    if (s.raf) { cancelAnimationFrame(s.raf); s.raf = 0; }
    if (s.kh) window.removeEventListener('keydown', s.kh);
  }
};

XZ13.GAMES.push(
  { icon: '💣', name: '扫雷', bestKey: null, call: 'XZ13GAMES.mines.open()' },
  { icon: '🧱', name: '打砖块', bestKey: 'gbreak', call: 'XZ13GAMES.breakout.open()' },
  { icon: '🐍', name: '贪吃蛇 Pro', bestKey: 'gsnake', call: 'XZ13GAMES.snake.open()' }
);

/* ===== x5513_games_d.js ===== */
/* ============================================================
   5.5.13 · 第 3 模块（D）：五子棋（人机，启发式攻防 AI）
   ============================================================ */
XZ13G.gomoku = {
  N: 15, cell: 26, pad: 18,
  board: [], over: false, busy: false, wins: 0, loses: 0,
  open: function () {
    var g = this;
    g.board = [];
    for (var i = 0; i < g.N * g.N; i++) g.board.push(0);
    g.over = false; g.busy = false;
    var sz = g.pad * 2 + g.cell * (g.N - 1);
    XZ13.modal('<h3>⚫ 五子棋（你执黑先手）</h3>' +
      '<div style="text-align:center">' +
      '<div class="xz13-game-hud"><span id="ggmStatus">轮到你落子</span><span>你胜 <b id="ggmW">0</b></span><span>AI 胜 <b id="ggmL">0</b></span></div>' +
      '<canvas id="ggmCanvas" width="' + sz + '" height="' + sz + '" style="max-width:94vw;background:#e8c99b;border-radius:10px;touch-action:none"></canvas>' +
      '<div style="margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.gomoku.open()">重开</button><button class="gbtn" onclick="closeModal()">退出</button></div>' +
      '<div class="dim small" style="margin-top:6px">黑棋=你，白棋=AI；横、竖、斜任意方向连成 5 子即胜。</div></div>');
    g.draw();
    g.bind();
  },
  bind: function () {
    var g = this;
    var cv = document.getElementById('ggmCanvas');
    if (!cv) return;
    function place(clientX, clientY) {
      if (g.over || g.busy) return;
      var rect = cv.getBoundingClientRect();
      var px = (clientX - rect.left) * (cv.width / rect.width);
      var py = (clientY - rect.top) * (cv.height / rect.height);
      var x = Math.round((px - g.pad) / g.cell);
      var y = Math.round((py - g.pad) / g.cell);
      if (x < 0 || x >= g.N || y < 0 || y >= g.N) return;
      if (g.board[y * g.N + x] !== 0) return;
      g.board[y * g.N + x] = 1;
      g.draw();
      if (g.checkWin(x, y, 1)) { g.finish(true); return; }
      g.busy = true;
      var st = document.getElementById('ggmStatus'); if (st) st.textContent = 'AI 思考中…';
      setTimeout(function () { g.aiMove(); }, 350);
    }
    cv.addEventListener('click', function (e) { place(e.clientX, e.clientY); });
    cv.addEventListener('touchend', function (e) {
      e.preventDefault();
      if (e.changedTouches[0]) place(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }, { passive: false });
    gcWatch('ggmCanvas', function () { g.busy = false; });
  },
  lineInfo: function (x, y, dx, dy, who) {
    var g = this;
    var count = 1, open = 0;
    var f1 = true, f2 = true;
    for (var s = 1; s < 5; s++) {
      var nx = x + dx * s, ny = y + dy * s;
      if (nx < 0 || nx >= g.N || ny < 0 || ny >= g.N) { f1 = false; break; }
      var v = g.board[ny * g.N + nx];
      if (v === who) count++;
      else { if (v === 0) open++; f1 = false; break; }
    }
    for (var t2 = 1; t2 < 5; t2++) {
      var px = x - dx * t2, py = y - dy * t2;
      if (px < 0 || px >= g.N || py < 0 || py >= g.N) { f2 = false; break; }
      var pv = g.board[py * g.N + px];
      if (pv === who) count++;
      else { if (pv === 0) open++; f2 = false; break; }
    }
    return { count: count, open: open };
  },
  scorePoint: function (x, y, who) {
    var g = this;
    var dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
    var total = 0;
    for (var i = 0; i < dirs.length; i++) {
      var info = g.lineInfo(x, y, dirs[i][0], dirs[i][1], who);
      var c = info.count, o = info.open;
      if (c >= 5) total += 1000000;
      else if (c === 4) total += o === 2 ? 100000 : (o === 1 ? 10000 : 0);
      else if (c === 3) total += o === 2 ? 5000 : (o === 1 ? 500 : 0);
      else if (c === 2) total += o === 2 ? 200 : (o === 1 ? 50 : 0);
      else if (c === 1) total += o === 2 ? 10 : 2;
    }
    return total;
  },
  aiMove: function () {
    var g = this;
    var best = -1, bestScore = -1;
    var candidates = [];
    for (var y = 0; y < g.N; y++) {
      for (var x = 0; x < g.N; x++) {
        if (g.board[y * g.N + x] !== 0) continue;
        if (!g.nearStone(x, y)) continue;
        var atk = g.scorePoint(x, y, 2);
        var def = g.scorePoint(x, y, 1);
        var score = atk * 1.15 + def + Math.random() * 8;
        if (score > bestScore) { bestScore = score; best = y * g.N + x; }
      }
    }
    if (best === -1) best = Math.floor(g.N / 2) * g.N + Math.floor(g.N / 2);
    var bx = best % g.N, by = Math.floor(best / g.N);
    g.board[best] = 2;
    g.busy = false;
    g.draw();
    var st = document.getElementById('ggmStatus');
    if (g.checkWin(bx, by, 2)) { g.finish(false); return; }
    if (st) st.textContent = '轮到你落子';
  },
  nearStone: function (x, y) {
    var g = this;
    for (var dy = -2; dy <= 2; dy++) {
      for (var dx = -2; dx <= 2; dx++) {
        var nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= g.N || ny < 0 || ny >= g.N) continue;
        if (g.board[ny * g.N + nx] !== 0) return true;
      }
    }
    return false;
  },
  checkWin: function (x, y, who) {
    var g = this;
    var dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
    for (var i = 0; i < dirs.length; i++) {
      var n = 1;
      for (var s = 1; s < 5; s++) {
        var nx = x + dirs[i][0] * s, ny = y + dirs[i][1] * s;
        if (nx < 0 || nx >= g.N || ny < 0 || ny >= g.N || g.board[ny * g.N + nx] !== who) break;
        n++;
      }
      for (var t2 = 1; t2 < 5; t2++) {
        var px = x - dirs[i][0] * t2, py = y - dirs[i][1] * t2;
        if (px < 0 || px >= g.N || py < 0 || py >= g.N || g.board[py * g.N + px] !== who) break;
        n++;
      }
      if (n >= 5) return true;
    }
    return false;
  },
  finish: function (playerWin) {
    var g = this;
    g.over = true;
    if (playerWin) { g.wins++; gcReward(10, 0, 0); }
    else { g.loses++; }
    var w = document.getElementById('ggmW'), l = document.getElementById('ggmL'), st = document.getElementById('ggmStatus');
    if (w) w.textContent = g.wins;
    if (l) l.textContent = g.loses;
    if (st) st.textContent = playerWin ? '🎉 你赢了！' : 'AI 连子成功';
    XZ13.modal('<h3>' + (playerWin ? '🎉 五子连珠，你赢了！' : '🤖 AI 获胜') + '</h3>' +
      '<div class="xz13-game-hud"><span>你胜 ' + g.wins + ' 局</span><span>AI 胜 ' + g.loses + ' 局</span></div>' +
      '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.gomoku.open()">再来一局</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  },
  draw: function () {
    var g = this;
    var cv = document.getElementById('ggmCanvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var sz = cv.width;
    ctx.fillStyle = '#e8c99b';
    ctx.fillRect(0, 0, sz, sz);
    ctx.strokeStyle = 'rgba(90,60,20,.7)';
    ctx.lineWidth = 1;
    for (var i = 0; i < g.N; i++) {
      var p = g.pad + i * g.cell;
      ctx.beginPath(); ctx.moveTo(g.pad, p); ctx.lineTo(g.pad + g.cell * (g.N - 1), p); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(p, g.pad); ctx.lineTo(p, g.pad + g.cell * (g.N - 1)); ctx.stroke();
    }
    // 天元与星位
    var stars = [3, 7, 11];
    ctx.fillStyle = 'rgba(90,60,20,.8)';
    for (var sy = 0; sy < 3; sy++) {
      for (var sx = 0; sx < 3; sx++) {
        ctx.beginPath();
        ctx.arc(g.pad + stars[sx] * g.cell, g.pad + stars[sy] * g.cell, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    for (var y = 0; y < g.N; y++) {
      for (var x = 0; x < g.N; x++) {
        var v = g.board[y * g.N + x];
        if (!v) continue;
        var cx = g.pad + x * g.cell, cy = g.pad + y * g.cell, r = g.cell / 2 - 2;
        var grad = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, r);
        if (v === 1) { grad.addColorStop(0, '#555'); grad.addColorStop(1, '#000'); }
        else { grad.addColorStop(0, '#fff'); grad.addColorStop(1, '#cfcfcf'); }
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
};

XZ13.GAMES.push(
  { icon: '⚫', name: '五子棋', bestKey: null, call: 'XZ13GAMES.gomoku.open()' }
);

/* ===== x5513_games_e.js ===== */
/* ============================================================
   5.5.13 · 第 3 模块（E）：成语填空 / 数字华容道 / 井字棋
   ============================================================ */

/* ═══════════════════════════════════════════════
   9) 成语填空（四选一）
   ═══════════════════════════════════════════════ */
XZ13G.idiom = {
  idioms: ['一心一意', '三心二意', '画蛇添足', '守株待兔', '亡羊补牢', '掩耳盗铃', '井底之蛙', '对牛弹琴',
    '自相矛盾', '刻舟求剑', '杯弓蛇影', '班门弄斧', '滥竽充数', '囫囵吞枣', '胸有成竹', '水滴石穿',
    '愚公移山', '熟能生巧', '举一反三', '锲而不舍', '废寝忘食', '专心致志', '孜孜不倦', '旗开得胜',
    '马到成功', '一举两得', '事半功倍', '迎难而上', '坚持不懈', '持之以恒', '聚精会神', '全神贯注',
    '奋不顾身', '临危不惧', '齐心协力', '同舟共济', '肝胆相照', '一诺千金', '言而有信', '脚踏实地',
    '厚积薄发', '出类拔萃', '名列前茅'],
  questions: [], idx: 0, score: 0,
  open: function () {
    var g = this;
    var pool = g.idioms.slice();
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    g.questions = pool.slice(0, 10);
    g.idx = 0; g.score = 0;
    g.render();
  },
  render: function () {
    var g = this;
    if (g.idx >= g.questions.length) { g.result(); return; }
    var word = g.questions[g.idx];
    var blankPos = 1 + Math.floor(Math.random() * 3);
    var answer = word.charAt(blankPos);
    var shown = word.split('');
    shown[blankPos] = '＿';
    var distractors = [];
    var chars = g.idioms.join('').split('');
    var uniq = [];
    for (var i = 0; i < chars.length; i++) { if (uniq.indexOf(chars[i]) < 0) uniq.push(chars[i]); }
    while (distractors.length < 3) {
      var c = uniq[Math.floor(Math.random() * uniq.length)];
      if (c !== answer && distractors.indexOf(c) < 0) distractors.push(c);
    }
    var opts = distractors.concat([answer]);
    for (var a = opts.length - 1; a > 0; a--) {
      var b = Math.floor(Math.random() * (a + 1));
      var tt = opts[a]; opts[a] = opts[b]; opts[b] = tt;
    }
    var h = '<h3>📖 成语填空</h3>' +
      '<div style="max-width:420px;margin:0 auto">' +
      '<div class="xz13-game-hud"><span>第 ' + (g.idx + 1) + '/10 题</span><span>得分 ' + g.score + '</span><span>最高 ' + XZ13.best('gidiom') + '</span></div>' +
      '<div class="xz13-2048-box" style="min-height:90px;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:900;letter-spacing:6px;margin:10px 0">' + shown.join('') + '</div>' +
      '<div id="gidOpts">' + opts.map(function (o) {
        return '<button class="gbtn" style="width:48%;margin:4px 1%;font-size:20px" onclick="XZ13GAMES.idiom.answer(this,\'' + o + '\',\'' + answer + '\')">' + o + '</button>';
      }).join('') + '</div></div>';
    XZ13.modal(h);
  },
  answer: function (btn, chosen, answer) {
    var g = this;
    var btns = XZ13.$$('#gidOpts button');
    btns.forEach(function (b) {
      b.disabled = true;
      if (b.textContent === answer) b.style.background = 'linear-gradient(135deg,#3ddc97,#1f9e6e)';
      else if (b === btn) b.style.background = 'linear-gradient(135deg,#ff5d73,#c2405c)';
    });
    if (chosen === answer) g.score++;
    setTimeout(function () { g.idx++; g.render(); }, 600);
  },
  result: function () {
    var g = this;
    var best = XZ13.best('gidiom', g.score);
    gcReward(4 + g.score, 4, 0);
    var grade = g.score === 10 ? '满腹经纶！' : g.score >= 8 ? '学富五车' : g.score >= 6 ? '不错哦' : '再多积累';
    XZ13.modal('<h3>📖 完成</h3>' +
      '<div class="xz13-whack-hd" style="text-align:center">答对 <b>' + g.score + '/10</b> ｜ 最高 ' + best + '</div>' +
      '<div class="xz13-game-hud"><span>' + grade + '</span></div>' +
      '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.idiom.open()">再来一轮</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  }
};

/* ═══════════════════════════════════════════════
   10) 数字华容道（4×4 滑块）
   ═══════════════════════════════════════════════ */
XZ13G.puzzle = {
  N: 4, tiles: [], moves: 0, secs: 0, timer: 0, started: false, over: false,
  open: function () {
    var p = this;
    p.tiles = [];
    for (var i = 1; i < 16; i++) p.tiles.push(i);
    p.tiles.push(0);
    p.moves = 0; p.secs = 0; p.started = false; p.over = false;
    clearInterval(p.timer);
    p.shuffle();
    XZ13.modal('<h3>🔢 数字华容道</h3>' +
      '<div style="max-width:340px;margin:0 auto;text-align:center">' +
      '<div class="xz13-game-hud"><span>步数 <b id="gpzMoves">0</b></span><span>时间 <b id="gpzTime">0</b>s</span><span>最快 <b>' + (gcBestMin('gpz') || '--') + 's</b></span></div>' +
      '<div class="xz13-2048-box" style="display:inline-block"><div id="gpzGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;width:300px"></div></div>' +
      '<div style="margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.puzzle.open()">重新打乱</button><button class="gbtn" onclick="closeModal()">退出</button></div>' +
      '<div class="dim small">点空位旁的数字滑动，按 1→15 排好。</div></div>');
    p.render();
    gcWatch('gpzGrid', function () { clearInterval(p.timer); });
  },
  shuffle: function () {
    var p = this;
    // 用随机合法移动打乱，保证可解
    var last = -1;
    for (var k = 0; k < 200; k++) {
      var blank = p.tiles.indexOf(0);
      var bx = blank % 4, by = Math.floor(blank / 4);
      var nbrs = [];
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
        var nx = bx + d[0], ny = by + d[1];
        if (nx >= 0 && nx < 4 && ny >= 0 && ny < 4) {
          var idx = ny * 4 + nx;
          if (idx !== last) nbrs.push(idx);
        }
      });
      var pick = nbrs[Math.floor(Math.random() * nbrs.length)];
      p.tiles[blank] = p.tiles[pick];
      p.tiles[pick] = 0;
      last = blank;
    }
  },
  render: function () {
    var p = this;
    var grid = document.getElementById('gpzGrid');
    if (!grid) return;
    var h = '';
    for (var i = 0; i < 16; i++) {
      var v = p.tiles[i];
      if (v === 0) {
        h += '<div style="width:68px;height:68px;border-radius:10px;background:rgba(255,255,255,.12)"></div>';
      } else {
        var correct = v === i + 1;
        h += '<div data-i="' + i + '" style="width:68px;height:68px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;cursor:pointer;background:' +
          (correct ? 'linear-gradient(135deg,#3ddc97,#1f9e6e)' : 'linear-gradient(135deg,#4a7dff,#8b5cf6)') + ';color:#fff">' + v + '</div>';
      }
    }
    grid.innerHTML = h;
    XZ13.$$('#gpzGrid [data-i]').forEach(function (cell) {
      cell.onclick = function () { p.slide(parseInt(cell.getAttribute('data-i'), 10)); };
    });
    var mv = document.getElementById('gpzMoves'); if (mv) mv.textContent = p.moves;
  },
  slide: function (i) {
    var p = this;
    if (p.over) return;
    var blank = p.tiles.indexOf(0);
    var x = i % 4, y = Math.floor(i / 4), bx = blank % 4, by = Math.floor(blank / 4);
    if (Math.abs(x - bx) + Math.abs(y - by) !== 1) return;
    if (!p.started) {
      p.started = true;
      p.timer = setInterval(function () {
        p.secs++;
        var te = document.getElementById('gpzTime'); if (te) te.textContent = p.secs;
      }, 1000);
    }
    p.tiles[blank] = p.tiles[i];
    p.tiles[i] = 0;
    p.moves++;
    p.render();
    if (p.solved()) p.win();
  },
  solved: function () {
    var p = this;
    for (var i = 0; i < 15; i++) if (p.tiles[i] !== i + 1) return false;
    return p.tiles[15] === 0;
  },
  win: function () {
    var p = this;
    p.over = true;
    clearInterval(p.timer);
    var rec = gcBestMin('gpz', p.secs);
    XZ13.best('gpzmoves', p.moves);
    gcReward(8, 3, 0);
    XZ13.modal('<h3>🎉 拼图完成！</h3>' +
      '<div class="xz13-whack-hd" style="text-align:center">用时 ' + p.secs + ' 秒｜步数 ' + p.moves + '｜最快 ' + rec + ' 秒</div>' +
      '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.puzzle.open()">再来一局</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  }
};

/* ═══════════════════════════════════════════════
   11) 井字棋（人机，极小极大 AI）
   ═══════════════════════════════════════════════ */
XZ13G.ttt = {
  b: [], over: false, busy: false,
  open: function () {
    var t = this;
    t.b = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    t.over = false; t.busy = false;
    XZ13.modal('<h3>⭕ 井字棋（你是 ❌）</h3>' +
      '<div style="max-width:300px;margin:0 auto;text-align:center">' +
      '<div id="gtttStatus" style="margin-bottom:8px;font-weight:800">轮到你了</div>' +
      '<div id="gtttGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px"></div>' +
      '<div style="margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.ttt.open()">重开</button><button class="gbtn" onclick="closeModal()">退出</button></div>' +
      '<div class="dim small">AI 采用极小极大，永不落败，试着逼平它！</div></div>');
    t.render();
  },
  render: function () {
    var t = this;
    var grid = document.getElementById('gtttGrid');
    if (!grid) return;
    var h = '';
    for (var i = 0; i < 9; i++) {
      var mark = t.b[i] === 1 ? '❌' : t.b[i] === 2 ? '⭕' : '';
      h += '<div data-i="' + i + '" style="aspect-ratio:1;border-radius:12px;background:rgba(127,127,127,.12);display:flex;align-items:center;justify-content:center;font-size:38px;cursor:pointer">' + mark + '</div>';
    }
    grid.innerHTML = h;
    XZ13.$$('#gtttGrid [data-i]').forEach(function (cell) {
      cell.onclick = function () { t.play(parseInt(cell.getAttribute('data-i'), 10)); };
    });
  },
  play: function (i) {
    var t = this;
    if (t.over || t.busy || t.b[i] !== 0) return;
    t.b[i] = 1;
    t.render();
    if (t.winner(t.b) === 1) { t.finish('你赢了'); return; }
    if (t.b.indexOf(0) < 0) { t.finish('平局'); return; }
    t.busy = true;
    var st = document.getElementById('gtttStatus'); if (st) st.textContent = 'AI 思考…';
    setTimeout(function () {
      var move = t.bestMove();
      t.b[move] = 2;
      t.busy = false;
      t.render();
      if (t.winner(t.b) === 2) { t.finish('AI 获胜'); return; }
      if (t.b.indexOf(0) < 0) { t.finish('平局'); return; }
      if (st) st.textContent = '轮到你了';
    }, 300);
  },
  winner: function (b) {
    var lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i];
      if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[1]] === b[l[2]]) return b[l[0]];
    }
    return 0;
  },
  bestMove: function () {
    var t = this;
    var best = -Infinity, move = -1;
    for (var i = 0; i < 9; i++) {
      if (t.b[i] !== 0) continue;
      t.b[i] = 2;
      var score = t.minimax(t.b, 0, false);
      t.b[i] = 0;
      if (score > best) { best = score; move = i; }
    }
    return move;
  },
  minimax: function (b, depth, aiTurn) {
    var t = this;
    var w = t.winner(b);
    if (w === 2) return 10 - depth;
    if (w === 1) return depth - 10;
    if (b.indexOf(0) < 0) return 0;
    var best = aiTurn ? -Infinity : Infinity;
    for (var i = 0; i < 9; i++) {
      if (b[i] !== 0) continue;
      b[i] = aiTurn ? 2 : 1;
      var score = t.minimax(b, depth + 1, !aiTurn);
      b[i] = 0;
      if (aiTurn) best = Math.max(best, score);
      else best = Math.min(best, score);
    }
    return best;
  },
  finish: function (result) {
    var t = this;
    t.over = true;
    var st = document.getElementById('gtttStatus');
    if (st) st.textContent = result;
    if (result === '你赢了') gcReward(6, 0, 0);
    XZ13.modal('<h3>' + result + '</h3>' +
      '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.ttt.open()">再来一局</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  }
};

XZ13.GAMES.push(
  { icon: '📖', name: '成语填空', bestKey: 'gidiom', call: 'XZ13GAMES.idiom.open()' },
  { icon: '🔢', name: '数字华容道', bestKey: null, call: 'XZ13GAMES.puzzle.open()' },
  { icon: '⭕', name: '井字棋', bestKey: null, call: 'XZ13GAMES.ttt.open()' }
);

/* ===== x5513_games_f.js ===== */
/* ============================================================
   5.5.13 · 第 3 模块（F）：数独（唯一解生成 + 提示 + 校验）
   ============================================================ */
XZ13G.sudoku = {
  N: 9, solution: [], puzzle: [], cur: [], fixed: [],
  selected: -1, secs: 0, timer: 0, hints: 3, mistakes: 0, over: false,
  open: function () {
    var s = this;
    s.over = false; s.secs = 0; s.hints = 3; s.mistakes = 0; s.selected = -1;
    var grid = new Array(81).fill(0);
    s.fillGrid(grid, 0);
    s.solution = grid.slice();
    s.makePuzzle(grid, 42);
    s.puzzle = grid.slice();
    s.cur = grid.slice();
    s.fixed = grid.map(function (v) { return v !== 0; });
    clearInterval(s.timer);
    XZ13.modal('<h3>🔢 数独（简单）</h3>' +
      '<div style="max-width:420px;margin:0 auto;text-align:center">' +
      '<div class="xz13-game-hud"><span>时间 <b id="gsdTime">0</b>s</span><span>提示 <b id="gsdHint">3</b></span><span>错误 <b id="gsdMiss">0</b></span></div>' +
      '<div id="gsdGrid" style="display:grid;grid-template-columns:repeat(9,1fr);gap:0;width:330px;margin:6px auto;border:3px solid var(--line2,#3d4f82);border-radius:6px;overflow:hidden"></div>' +
      '<div style="margin:6px 0">' +
      [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) {
        return '<button class="gbtn" style="width:30px;height:36px;padding:0;margin:1px" onclick="XZ13GAMES.sudoku.input(' + n + ')">' + n + '</button>';
      }).join('') +
      '</div>' +
      '<div><button class="gbtn" onclick="XZ13GAMES.sudoku.doHint()">💡提示</button>' +
      '<button class="gbtn" onclick="XZ13GAMES.sudoku.erase()">清除</button>' +
      '<button class="gbtn" onclick="XZ13GAMES.sudoku.open()">换一题</button>' +
      '<button class="gbtn" onclick="closeModal()">退出</button></div></div>');
    s.timer = setInterval(function () {
      s.secs++;
      var te = document.getElementById('gsdTime'); if (te) te.textContent = s.secs;
    }, 1000);
    s.render();
    gcWatch('gsdGrid', function () { clearInterval(s.timer); });
  },
  cands: function () {
    var a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  },
  valid: function (g, i, v) {
    var r = Math.floor(i / 9), c = i % 9;
    for (var k = 0; k < 9; k++) {
      if (g[r * 9 + k] === v || g[k * 9 + c] === v) return false;
    }
    var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (var y = 0; y < 3; y++) {
      for (var x = 0; x < 3; x++) {
        if (g[(br + y) * 9 + (bc + x)] === v) return false;
      }
    }
    return true;
  },
  fillGrid: function (g, i) {
    if (i === 81) return true;
    if (g[i] !== 0) return this.fillGrid(g, i + 1);
    var nums = this.cands();
    for (var k = 0; k < 9; k++) {
      if (this.valid(g, i, nums[k])) {
        g[i] = nums[k];
        if (this.fillGrid(g, i + 1)) return true;
        g[i] = 0;
      }
    }
    return false;
  },
  countSolutions: function (g, limit) {
    var count = 0;
    function solve() {
      if (count >= limit) return;
      var idx = -1, best = 10;
      for (var i = 0; i < 81; i++) {
        if (g[i] === 0) {
          var opts = 0;
          for (var v = 1; v <= 9; v++) {
            var r = Math.floor(i / 9), c = i % 9, ok = true;
            for (var kk = 0; kk < 9; kk++) {
              if (g[r * 9 + kk] === v || g[kk * 9 + c] === v) { ok = false; break; }
            }
            var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
            for (var y = 0; y < 3 && ok; y++) {
              for (var x = 0; x < 3; x++) {
                if (g[(br + y) * 9 + (bc + x)] === v) { ok = false; break; }
              }
            }
            if (ok) opts++;
          }
          if (opts < best) { best = opts; idx = i; if (best === 0) break; }
        }
      }
      if (idx === -1) { count++; return; }
      if (best === 0) return;
      for (var v2 = 1; v2 <= 9; v2++) {
        if (XZ13GAMES.sudoku.isValidAt(g, idx, v2)) {
          g[idx] = v2;
          solve();
          g[idx] = 0;
          if (count >= limit) return;
        }
      }
    }
    solve();
    return count;
  },
  isValidAt: function (g, i, v) {
    var r = Math.floor(i / 9), c = i % 9;
    for (var k = 0; k < 9; k++) {
      if (g[r * 9 + k] === v || g[k * 9 + c] === v) return false;
    }
    var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (var y = 0; y < 3; y++) {
      for (var x = 0; x < 3; x++) {
        if (g[(br + y) * 9 + (bc + x)] === v) return false;
      }
    }
    return true;
  },
  makePuzzle: function (g, givens) {
    var order = [];
    for (var i = 0; i < 81; i++) order.push(i);
    for (var a = order.length - 1; a > 0; a--) {
      var b = Math.floor(Math.random() * (a + 1));
      var t = order[a]; order[a] = order[b]; order[b] = t;
    }
    var current = 81;
    for (var k = 0; k < order.length && current > givens; k++) {
      var idx = order[k];
      var backup = g[idx];
      if (backup === 0) continue;
      g[idx] = 0;
      var test = g.slice();
      if (this.countSolutions(test, 2) !== 1) {
        g[idx] = backup; // 会破坏唯一解，还原
      } else {
        current--;
      }
    }
  },
  render: function () {
    var s = this;
    var grid = document.getElementById('gsdGrid');
    if (!grid) return;
    var h = '';
    for (var i = 0; i < 81; i++) {
      var r = Math.floor(i / 9), c = i % 9;
      var bd = [];
      if (c % 3 === 2 && c !== 8) bd.push('border-right:2px solid var(--line2,#3d4f82)');
      if (r % 3 === 2 && r !== 8) bd.push('border-bottom:2px solid var(--line2,#3d4f82)');
      if (c % 3 !== 2 && c !== 8) bd.push('border-right:1px solid rgba(127,127,127,.3)');
      if (r % 3 !== 2 && r !== 8) bd.push('border-bottom:1px solid rgba(127,127,127,.3)');
      var bg = 'rgba(127,127,127,.05)';
      var color = '';
      if (s.fixed[i]) { bg = 'rgba(127,127,127,.16)'; color = 'font-weight:900'; }
      if (i === s.selected) bg = 'rgba(74,125,255,.35)';
      if (!s.fixed[i] && s.cur[i] !== 0 && s.cur[i] !== s.solution[i]) color = 'color:#e04870;font-weight:800';
      var val = s.cur[i] === 0 ? '' : s.cur[i];
      h += '<div data-i="' + i + '" style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;background:' + bg + ';' + bd.join(';') + ';' + color + '">' + val + '</div>';
    }
    grid.innerHTML = h;
    XZ13.$$('#gsdGrid [data-i]').forEach(function (cell) {
      cell.onclick = function () {
        var i = parseInt(cell.getAttribute('data-i'), 10);
        if (!s.fixed[i]) { s.selected = i; s.render(); }
      };
    });
  },
  input: function (n) {
    var s = this;
    if (s.over || s.selected < 0 || s.fixed[s.selected]) return;
    if (s.cur[s.selected] === n) { /* 重复填同值忽略 */ }
    s.cur[s.selected] = n;
    if (s.solution[s.selected] !== n) {
      s.mistakes++;
      var ms = document.getElementById('gsdMiss'); if (ms) ms.textContent = s.mistakes;
    }
    s.render();
    if (s.cur.join('') === s.solution.join('')) s.win();
  },
  erase: function () {
    var s = this;
    if (s.over || s.selected < 0 || s.fixed[s.selected]) return;
    s.cur[s.selected] = 0;
    s.render();
  },
  doHint: function () {
    var s = this;
    if (s.over || s.hints <= 0) { XZ13.toast('提示次数用完了'); return; }
    if (s.selected < 0 || s.fixed[s.selected]) {
      // 自动找一个未填/错误的格子
      for (var i = 0; i < 81; i++) {
        if (!s.fixed[i] && s.cur[i] !== s.solution[i]) { s.selected = i; break; }
      }
    }
    if (s.selected >= 0) {
      s.cur[s.selected] = s.solution[s.selected];
      s.fixed[s.selected] = true; // 提示的格视为锁定
      s.hints--;
      var he = document.getElementById('gsdHint'); if (he) he.textContent = s.hints;
      s.render();
      if (s.cur.join('') === s.solution.join('')) s.win();
    }
  },
  win: function () {
    var s = this;
    s.over = true;
    clearInterval(s.timer);
    var best = gcBestMin('gsudoku', s.secs);
    gcReward(12, 3, 0);
    XZ13.modal('<h3>🎉 数独完成！</h3>' +
      '<div class="xz13-whack-hd" style="text-align:center">用时 <b>' + s.secs + 's</b> ｜ 错误 ' + s.mistakes + ' ｜ 最快 <b>' + best + 's</b></div>' +
      '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="XZ13GAMES.sudoku.open()">再来一题</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  }
};

XZ13.GAMES.push({ icon: '🔢', name: '数独', bestKey: null, call: 'XZ13GAMES.sudoku.open()' });

/* ===== x5513_tools.js ===== */
/* ============================================================
   5.5.13 · 第 4 模块：实用工具箱 2.0（8 个本地工具）
   数据全部存 localStorage，刷新不丢；彼此独立，互不影响。
   ============================================================ */
var XZ13T = window.XZ13TOOLS || {};
window.XZ13TOOLS = XZ13T;
function tlsKey(name) { return 'xz13_tool_' + name; }
function tlsGet(name, d) {
  try { var v = localStorage.getItem(tlsKey(name)); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
}
function tlsSet(name, v) {
  try { localStorage.setItem(tlsKey(name), JSON.stringify(v)); return true; } catch (e) { return false; }
}
function tTodayStr(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function tUid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

/* ── 1. 记事本 ───────────────────────────────────────────── */
XZ13T.notes = {
  cur: null,
  open: function () {
    var list = tlsGet('notes', []);
    if (!list.length) { list = [{ id: tUid(), title: '欢迎笔记', body: '在这里记录待办、灵感、作业…\n左侧新建，自动保存。', at: Date.now() }]; tlsSet('notes', list); }
    this.cur = this.cur || list[0].id;
    this.render();
  },
  render: function () {
    var self = this;
    var list = tlsGet('notes', []);
    var cur = list.filter(function (n) { return n.id === self.cur; })[0] || list[0];
    self.cur = cur ? cur.id : null;
    var nav = list.map(function (n) {
      var on = cur && n.id === cur.id;
      return '<button class="gbtn" style="margin:3px;justify-content:flex-start;' + (on ? 'border-color:var(--acc);box-shadow:0 0 0 2px rgba(108,140,255,.25)' : '') + '" onclick="XZ13TOOLS.notes.select(\'' + n.id + '\')">' + XZ13.esc(n.title || '无标题') + '</button>';
    }).join('');
    var h = '<h3>📝 记事本</h3>' +
      '<div style="max-width:460px;margin:0 auto">' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">' + nav + '</div>' +
      '<input type="text" id="tnTitle" placeholder="标题" value="' + XZ13.esc(cur ? cur.title : '') + '" style="width:100%;margin-bottom:6px">' +
      '<textarea id="tnBody" rows="8" placeholder="写点什么…" style="width:100%;resize:vertical">' + XZ13.esc(cur ? cur.body : '') + '</textarea>' +
      '<div class="xz13-save-bar"><button class="xz13-save-ss-btn primary" onclick="XZ13TOOLS.notes.save()">💾 保存</button>' +
      '<button class="xz13-save-ss-btn" onclick="XZ13TOOLS.notes.add()">➕ 新建</button>' +
      '<button class="xz13-save-ss-btn danger" onclick="XZ13TOOLS.notes.del()">🗑️ 删除</button>' +
      '<button class="xz13-save-ss-btn" onclick="closeModal()">关闭</button></div>' +
      '<div class="dim small">自动保存，可存任意多条。</div></div>';
    XZ13.modal(h);
  },
  select: function (id) { this.save(true); this.cur = id; this.render(); },
  add: function () {
    var list = tlsGet('notes', []);
    var n = { id: tUid(), title: '新笔记', body: '', at: Date.now() };
    list.push(n); tlsSet('notes', list); this.cur = n.id; this.render();
  },
  save: function (silent) {
    var list = tlsGet('notes', []);
    var titleEl = document.getElementById('tnTitle'), bodyEl = document.getElementById('tnBody');
    if (!titleEl) return;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === this.cur) {
        list[i].title = titleEl.value || '无标题';
        list[i].body = bodyEl.value;
        list[i].at = Date.now();
      }
    }
    tlsSet('notes', list);
    if (!silent) XZ13.toast('💾 已保存');
  },
  del: function () {
    var list = tlsGet('notes', []).filter(function (n) { return n.id !== XZ13T.notes.cur; });
    tlsSet('notes', list);
    this.cur = list.length ? list[0].id : null;
    if (!list.length) { XZ13.modal('<h3>📝 记事本</h3><p class="dim">没有笔记了</p><button class="gbtn" onclick="closeModal()">关闭</button>'); return; }
    this.render();
  }
};

/* ── 2. 21 天习惯打卡 ─────────────────────────────────────── */
XZ13T.habits = {
  open: function () {
    var list = tlsGet('habits', []);
    var h = '<h3>✅ 21 天习惯打卡</h3><div style="max-width:460px;margin:0 auto">' +
      '<div class="xz13-save-bar"><input type="text" id="thName" placeholder="新习惯，如：背 20 个单词" style="flex:1">' +
      '<button class="xz13-save-ss-btn primary" onclick="XZ13TOOLS.habits.add()">➕ 添加</button></div>';
    if (!list.length) h += '<p class="dim small">还没有习惯，添加一个并坚持 21 天吧。</p>';
    for (var i = 0; i < list.length; i++) {
      h += this.rowHtml(list[i]);
    }
    h += '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">关闭</button></div>';
    XZ13.modal(h);
  },
  rowHtml: function (hb) {
    var days = hb.days || [];
    var today = tTodayStr();
    var done = days.indexOf(today) >= 0;
    var streak = this.streakOf(days);
    var cells = '';
    for (var i = 13; i >= 0; i--) {
      var d = new Date(); d.setDate(d.getDate() - i);
      var ds = tTodayStr(d);
      var on = days.indexOf(ds) >= 0;
      cells += '<span class="hb-d ' + (on ? 'on' : '') + '">' + (on ? '✓' : '') + '</span>';
    }
    return '<div class="xz13-habit"><span class="hb-name">' + XZ13.esc(hb.name) + ' 🔥' + streak + ' 天</span>' +
      '<span class="hb-days">' + cells + '</span>' +
      '<button class="xz13-save-ss-btn ' + (done ? '' : 'primary') + '" onclick="XZ13TOOLS.habits.toggle(\'' + hb.id + '\')">' + (done ? '已打卡' : '打卡') + '</button>' +
      '<button class="xz13-save-ss-btn danger" onclick="XZ13TOOLS.habits.del(\'' + hb.id + '\')">×</button></div>';
  },
  streakOf: function (days) {
    var s = 0;
    var d = new Date();
    // 今天没打则从昨天开始算
    if (days.indexOf(tTodayStr(d)) < 0) d.setDate(d.getDate() - 1);
    while (days.indexOf(tTodayStr(d)) >= 0) { s++; d.setDate(d.getDate() - 1); }
    return s;
  },
  add: function () {
    var el = document.getElementById('thName');
    var name = el ? el.value.trim() : '';
    if (!name) { XZ13.toast('请输入习惯名'); return; }
    var list = tlsGet('habits', []);
    list.push({ id: tUid(), name: name, days: [] });
    tlsSet('habits', list);
    this.open();
  },
  toggle: function (id) {
    var list = tlsGet('habits', []);
    var today = tTodayStr();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        list[i].days = list[i].days || [];
        var k = list[i].days.indexOf(today);
        if (k >= 0) list[i].days.splice(k, 1); else list[i].days.push(today);
      }
    }
    tlsSet('habits', list);
    this.open();
  },
  del: function (id) {
    tlsSet('habits', tlsGet('habits', []).filter(function (x) { return x.id !== id; }));
    this.open();
  }
};

/* ── 3. 课堂随机点名 ─────────────────────────────────────── */
XZ13T.roll = {
  timer: 0,
  open: function () {
    var names = tlsGet('roll_names', '');
    var drawn = tlsGet('roll_drawn', []);
    XZ13.modal('<h3>🎯 课堂随机点名</h3>' +
      '<div class="xz13-roll-stage"><div class="xz13-roll-name" id="trName">准备就绪</div>' +
      '<button class="xz13-mic-btn" id="trGoBtn" onclick="XZ13TOOLS.roll.roll()">开始点名</button></div>' +
      '<div class="xz13-save-bar"><span class="xz13-save-ss-btn">已抽 ' + drawn.length + ' 人</span>' +
      '<button class="xz13-save-ss-btn" onclick="XZ13TOOLS.roll.reset()">♻️ 重置已抽</button></div>' +
      '<textarea id="trNames" rows="6" placeholder="把名单贴进来，每行一个或用逗号分隔" style="width:100%">' + XZ13.esc(names) + '</textarea>' +
      '<div class="xz13-save-bar"><button class="xz13-save-ss-btn primary" onclick="XZ13TOOLS.roll.saveList()">保存名单</button>' +
      '<button class="xz13-save-ss-btn" onclick="closeModal()">关闭</button></div>');
  },
  parse: function () {
    var el = document.getElementById('trNames');
    var text = el ? el.value : tlsGet('roll_names', '');
    return text.split(/[\n,，、;；]/).map(function (s) { return s.trim(); }).filter(Boolean);
  },
  saveList: function () {
    tlsSet('roll_names', this.parse().join('\n'));
    XZ13.toast('名单已保存');
  },
  roll: function () {
    var self = this;
    clearInterval(self.timer);
    var drawn = tlsGet('roll_drawn', []);
    var all = self.parse();
    if (!all.length) { XZ13.toast('请先填写名单'); return; }
    var remain = all.filter(function (n) { return drawn.indexOf(n) < 0; });
    if (!remain.length) {
      var el = document.getElementById('trName');
      if (el) el.textContent = '全部抽完啦';
      XZ13.toast('已全部抽完，点重置');
      return;
    }
    var btn = document.getElementById('trGoBtn');
    if (btn) btn.disabled = true;
    var ticks = 0;
    var final = remain[Math.floor(Math.random() * remain.length)];
    self.timer = setInterval(function () {
      ticks++;
      var el = document.getElementById('trName');
      if (el) el.textContent = remain[Math.floor(Math.random() * remain.length)];
      if (ticks >= 18) {
        clearInterval(self.timer);
        if (el) el.textContent = '👉 ' + final;
        drawn.push(final);
        tlsSet('roll_drawn', drawn);
        if (btn) { btn.disabled = false; btn.textContent = '再抽一个'; }
        XZ13.log('🎯 点名：' + final, 'good');
      }
    }, 70);
  },
  reset: function () {
    tlsSet('roll_drawn', []);
    var el = document.getElementById('trName');
    if (el) el.textContent = '已重置';
    XZ13.toast('已重置已抽名单');
  }
};

/* ── 4. 密码生成器 ───────────────────────────────────────── */
XZ13T.password = {
  open: function () {
    XZ13.modal('<h3>🔐 密码生成器</h3>' +
      '<div style="max-width:420px;margin:0 auto">' +
      '<div class="xz13-pw-out" id="tpOut">点下方生成</div>' +
      '<div class="xz13-save-bar"><span>长度</span><input type="range" id="tpLen" min="6" max="32" value="14" style="flex:1" oninput="XZ13TOOLS.password.setLen()"><span id="tpLenV">14</span></div>' +
      '<label style="display:block;margin:5px 0"><input type="checkbox" id="tpUpper" checked> 大写字母 A-Z</label>' +
      '<label style="display:block;margin:5px 0"><input type="checkbox" id="tpLower" checked> 小写字母 a-z</label>' +
      '<label style="display:block;margin:5px 0"><input type="checkbox" id="tpDigit" checked> 数字 0-9</label>' +
      '<label style="display:block;margin:5px 0"><input type="checkbox" id="tpSym"> 特殊符号 !@#$%^&*</label>' +
      '<div class="xz13-save-bar"><button class="xz13-save-ss-btn primary" onclick="XZ13TOOLS.password.gen()">🎲 生成</button>' +
      '<button class="xz13-save-ss-btn" onclick="XZ13TOOLS.password.copy()">📋 复制</button>' +
      '<button class="xz13-save-ss-btn" onclick="closeModal()">关闭</button></div>' +
      '<div class="dim small">本地生成，不上传，不存储。</div></div>');
    this.gen();
  },
  setLen: function () {
    var s = document.getElementById('tpLen'), v = document.getElementById('tpLenV');
    if (s && v) v.textContent = s.value;
  },
  charset: function () {
    var sets = [];
    if (document.getElementById('tpUpper').checked) sets.push('ABCDEFGHJKLMNPQRSTUVWXYZ');
    if (document.getElementById('tpLower').checked) sets.push('abcdefghijkmnpqrstuvwxyz');
    if (document.getElementById('tpDigit').checked) sets.push('23456789');
    if (document.getElementById('tpSym').checked) sets.push('!@#$%^&*?');
    return sets.join('');
  },
  gen: function () {
    var cs = this.charset();
    if (!cs) { XZ13.toast('至少勾选一类'); return; }
    var len = parseInt(document.getElementById('tpLen').value, 10) || 14;
    var arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    var out = '';
    for (var i = 0; i < len; i++) out += cs[arr[i] % cs.length];
    var el = document.getElementById('tpOut');
    if (el) el.textContent = out;
  },
  copy: function () {
    var el = document.getElementById('tpOut');
    if (!el) return;
    var text = el.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { XZ13.toast('📋 已复制'); }, function () { XZ13.fallbackCopy(text); });
    } else XZ13.fallbackCopy(text);
  }
};

/* ── 5. 心情日记 ─────────────────────────────────────────── */
XZ13T.diary = {
  open: function () {
    var list = tlsGet('diary', []);
    var moods = ['😄', '🙂', '😐', '😕', '😢', '😡', '😴', '🥰'];
    var h = '<h3>📔 心情日记</h3><div style="max-width:460px;margin:0 auto">' +
      '<div class="xz13-seg" id="tdMood">';
    for (var i = 0; i < moods.length; i++) {
      h += '<button data-mood="' + moods[i] + '" onclick="XZ13TOOLS.diary.pickMood(this)">' + moods[i] + '</button>';
    }
    h += '</div><textarea id="tdText" rows="4" placeholder="今天发生了什么？" style="width:100%"></textarea>' +
      '<div class="xz13-save-bar"><button class="xz13-save-ss-btn primary" onclick="XZ13TOOLS.diary.add()">📖 记下</button>' +
      '<button class="xz13-save-ss-btn" onclick="closeModal()">关闭</button></div><hr>';
    if (!list.length) h += '<p class="dim small">还没有日记。</p>';
    list.sort(function (a, b) { return b.at - a.at; });
    for (var j = 0; j < Math.min(list.length, 40); j++) {
      h += '<div class="xz13-diary-entry"><span class="de-mood">' + list[j].mood + '</span> <span class="de-date">' + XZ13.fmtTime(list[j].at) + '</span><div>' + XZ13.esc(list[j].text).replace(/\n/g, '<br>') + '</div></div>';
    }
    h += '</div>';
    XZ13.modal(h);
    this.picked = '🙂';
  },
  pickMood: function (b) {
    XZ13.$$('#tdMood button').forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on');
    this.picked = b.getAttribute('data-mood');
  },
  add: function () {
    var el = document.getElementById('tdText');
    var text = el ? el.value.trim() : '';
    if (!text) { XZ13.toast('写点内容吧'); return; }
    var list = tlsGet('diary', []);
    list.push({ id: tUid(), mood: this.picked || '🙂', text: text, at: Date.now() });
    tlsSet('diary', list);
    this.open();
  }
};

/* ── 6. 高考倒计时 ───────────────────────────────────────── */
XZ13T.countdown = {
  open: function () {
    var target = tlsGet('gaokao', '');
    var h = '<h3>⏰ 高考倒计时</h3>' +
      '<div style="max-width:420px;margin:0 auto">' +
      '<label class="dim small">目标日期</label>' +
      '<input type="date" id="tcDate" value="' + XZ13.esc(target) + '" style="width:100%;margin:6px 0">' +
      '<div class="xz13-save-bar"><button class="xz13-save-ss-btn primary" onclick="XZ13TOOLS.countdown.set()">设置目标</button>' +
      '<button class="xz13-save-ss-btn" onclick="XZ13TOOLS.countdown.preset(2027)">2027 高考</button>' +
      '<button class="xz13-save-ss-btn" onclick="XZ13TOOLS.countdown.preset(2028)">2028 高考</button></div>' +
      '<div id="tcResult" style="text-align:center;margin:14px 0"></div>' +
      '<button class="gbtn" onclick="closeModal()">关闭</button></div>';
    XZ13.modal(h);
    this.show();
  },
  preset: function (y) {
    var d = y + '-06-07';
    var el = document.getElementById('tcDate');
    if (el) el.value = d;
    this.set();
  },
  set: function () {
    var el = document.getElementById('tcDate');
    var v = el ? el.value : '';
    if (!v) { XZ13.toast('请选择日期'); return; }
    tlsSet('gaokao', v);
    this.show();
  },
  show: function () {
    var v = tlsGet('gaokao', '');
    var el = document.getElementById('tcResult');
    if (!el) return;
    if (!v) { el.innerHTML = '<p class="dim">还没设置目标日期</p>'; return; }
    var target = new Date(v + 'T09:00:00');
    var now = new Date();
    var diff = target - now;
    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var html;
    if (diff > 0) {
      html = '<div style="font-size:56px;font-weight:900;color:var(--acc)">' + days + '</div>' +
        '<div class="dim">天后开考</div>' +
        '<div class="xz13-game-hud" style="margin-top:10px"><span>' + hours + ' 时</span><span>' + mins + ' 分</span></div>' +
        '<p class="dim small">目标：' + v + '。每一步都算数。</p>';
    } else {
      html = '<div style="font-size:30px;font-weight:900">该日期已到/已过</div>';
    }
    el.innerHTML = html;
  }
};

/* ── 7. 转盘决定 ─────────────────────────────────────────── */
XZ13T.wheel = {
  timer: 0,
  open: function () {
    var opts = tlsGet('wheel', '吃食堂\n点外卖\n去小卖部\n吃泡面\n吃水果\n再想想');
    XZ13.modal('<h3>🎡 转盘决定</h3>' +
      '<div class="xz13-roll-stage"><div class="xz13-roll-name" id="twResult">?</div>' +
      '<button class="xz13-mic-btn" id="twBtn" onclick="XZ13TOOLS.wheel.spin()">转一个</button></div>' +
      '<textarea id="twOpts" rows="5" style="width:100%">' + XZ13.esc(opts) + '</textarea>' +
      '<div class="xz13-save-bar"><button class="xz13-save-ss-btn primary" onclick="XZ13TOOLS.wheel.save()">保存选项</button>' +
      '<button class="xz13-save-ss-btn" onclick="closeModal()">关闭</button></div>');
  },
  parse: function () {
    var el = document.getElementById('twOpts');
    return (el ? el.value : tlsGet('wheel', '')).split(/[\n,，、;；]/).map(function (s) { return s.trim(); }).filter(Boolean);
  },
  save: function () { tlsSet('wheel', this.parse().join('\n')); XZ13.toast('已保存'); },
  spin: function () {
    var self = this;
    var opts = self.parse();
    if (!opts.length) { XZ13.toast('请先填写选项'); return; }
    var btn = document.getElementById('twBtn');
    if (btn) btn.disabled = true;
    var final = opts[Math.floor(Math.random() * opts.length)];
    var total = 26;
    var n = 0;
    clearTimeout(self.timer);
    function step() {
      var el = document.getElementById('twResult');
      if (el) { el.textContent = opts[Math.floor(Math.random() * opts.length)]; el.style.color = 'inherit'; }
      n++;
      if (n >= total) {
        if (el) { el.textContent = '🎉 ' + final; el.style.color = 'var(--acc)'; }
        if (btn) btn.disabled = false;
        XZ13.log('🎡 转盘决定：' + final, 'good');
        return;
      }
      self.timer = setTimeout(step, 50 + n * n * 1.2);
    }
    step();
  }
};

/* ── 8. 记忆卡（背单词/知识点） ───────────────────────────── */
XZ13T.flash = {
  idx: 0, flipped: false,
  open: function () {
    var cards = tlsGet('cards', []);
    if (!cards.length) {
      cards = [
        { f: 'abandon', b: 'v. 放弃；抛弃' },
        { f: 'benefit', b: 'n./v. 好处；有益于' },
        { f: 'concept', b: 'n. 概念；观念' }
      ];
      tlsSet('cards', cards);
    }
    this.idx = 0; this.flipped = false;
    this.render();
  },
  render: function () {
    var self = this;
    var cards = tlsGet('cards', []);
    var c = cards[self.idx] || { f: '', b: '' };
    var face = self.flipped ? c.b : c.f;
    var h = '<h3>📇 记忆卡</h3>' +
      '<div style="max-width:440px;margin:0 auto">' +
      '<div class="xz13-game-hud"><span>' + (self.idx + 1) + ' / ' + cards.length + '</span><span id="tfTag">' + (self.flipped ? '背面' : '正面') + '</span></div>' +
      '<div class="xz13-2048-box" id="tfCard" style="min-height:150px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:22px;font-weight:800;cursor:pointer;padding:20px" onclick="XZ13TOOLS.flash.flip()">' + XZ13.esc(face) + '</div>' +
      '<div class="dim small" style="text-align:center">点卡片翻面</div>' +
      '<div class="xz13-save-bar" style="justify-content:center">' +
      '<button class="xz13-save-ss-btn" onclick="XZ13TOOLS.flash.prev()">← 上一张</button>' +
      '<button class="xz13-save-ss-btn primary" onclick="XZ13TOOLS.flash.flip()">翻面</button>' +
      '<button class="xz13-save-ss-btn" onclick="XZ13TOOLS.flash.next()">下一张 →</button></div><hr>' +
      '<div class="xz13-save-bar"><input type="text" id="tfFront" placeholder="正面（如单词）" style="flex:1">' +
      '<input type="text" id="tfBack" placeholder="背面（如释义）" style="flex:1">' +
      '<button class="xz13-save-ss-btn primary" onclick="XZ13TOOLS.flash.add()">➕ 添加</button></div>' +
      '<div class="xz13-save-bar"><button class="xz13-save-ss-btn danger" onclick="XZ13TOOLS.flash.del()">删除当前</button>' +
      '<button class="xz13-save-ss-btn" onclick="XZ13TOOLS.flash.shuffle()">🔀 打乱</button>' +
      '<button class="xz13-save-ss-btn" onclick="closeModal()">关闭</button></div></div>';
    XZ13.modal(h);
  },
  flip: function () { this.flipped = !this.flipped; this.render(); },
  next: function () {
    var cards = tlsGet('cards', []);
    if (!cards.length) return;
    this.idx = (this.idx + 1) % cards.length; this.flipped = false; this.render();
  },
  prev: function () {
    var cards = tlsGet('cards', []);
    if (!cards.length) return;
    this.idx = (this.idx - 1 + cards.length) % cards.length; this.flipped = false; this.render();
  },
  add: function () {
    var f = document.getElementById('tfFront'), b = document.getElementById('tfBack');
    var fc = f ? f.value.trim() : '', bc = b ? b.value.trim() : '';
    if (!fc || !bc) { XZ13.toast('正反面都要填'); return; }
    var cards = tlsGet('cards', []);
    cards.push({ f: fc, b: bc });
    tlsSet('cards', cards);
    this.idx = cards.length - 1; this.flipped = false;
    this.render();
  },
  del: function () {
    var cards = tlsGet('cards', []);
    cards.splice(this.idx, 1);
    tlsSet('cards', cards);
    this.idx = Math.max(0, this.idx - 1); this.flipped = false;
    if (!cards.length) { XZ13.modal('<h3>📇 记忆卡</h3><p class="dim">没有卡片了</p><button class="gbtn" onclick="closeModal()">关闭</button>'); return; }
    this.render();
  },
  shuffle: function () {
    var cards = tlsGet('cards', []);
    for (var i = cards.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = cards[i]; cards[i] = cards[j]; cards[j] = t;
    }
    tlsSet('cards', cards);
    this.idx = 0; this.flipped = false;
    this.render();
  }
};

/* 注册到工具箱 */
XZ13.TOOLS.push(
  { icon: '📝', name: '记事本', call: 'XZ13TOOLS.notes.open()' },
  { icon: '✅', name: '习惯打卡', call: 'XZ13TOOLS.habits.open()' },
  { icon: '🎯', name: '随机点名', call: 'XZ13TOOLS.roll.open()' },
  { icon: '🔐', name: '密码生成', call: 'XZ13TOOLS.password.open()' },
  { icon: '📔', name: '心情日记', call: 'XZ13TOOLS.diary.open()' },
  { icon: '⏰', name: '高考倒计时', call: 'XZ13TOOLS.countdown.open()' },
  { icon: '🎡', name: '转盘决定', call: 'XZ13TOOLS.wheel.open()' },
  { icon: '📇', name: '记忆卡', call: 'XZ13TOOLS.flash.open()' }
);

/* fallbackCopy 供密码模块使用（挂到 XZ13） */
XZ13.fallbackCopy = function (text) {
  try {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    ta.remove();
    XZ13.toast('📋 已复制');
  } catch (e) { XZ13.toast('复制失败，请手动选择'); }
};

/* ===== x5513_tools_b.js ===== */
/* ============================================================
   5.5.13 · 第 4 模块（B）：记账本 / 单词测验
   ============================================================ */

/* ── 9. 记账本 ───────────────────────────────────────────── */
XZ13T.ledger = {
  catsOut: ['🍜 餐食', '📚 学习', '🧴 日用', '🎮 娱乐', '🧋 奶茶零食', '🚗 交通', '其他'],
  catsIn: ['🧧 零花钱', '🧧 红包', '💼 兼职', '其他收入'],
  open: function () {
    var recs = tlsGet('ledger', []);
    var income = 0, expense = 0;
    var catSum = {};
    for (var i = 0; i < recs.length; i++) {
      if (recs[i].type === 'in') income += recs[i].amount;
      else { expense += recs[i].amount; catSum[recs[i].cat] = (catSum[recs[i].cat] || 0) + recs[i].amount; }
    }
    var catHtml = Object.keys(catSum).sort(function (a, b) { return catSum[b] - catSum[a]; }).map(function (c) {
      return '<div class="xz13-lb-row"><span>' + XZ13.esc(c) + '</span><span>¥' + catSum[c].toFixed(2) + '</span></div>';
    }).join('');
    var listHtml = recs.slice(-12).reverse().map(function (r) {
      var sign = r.type === 'in' ? '<span style="color:#1f9e6e">+</span>' : '<span style="color:#e04870">-</span>';
      return '<div class="xz13-lb-row"><span>' + XZ13.esc(r.cat) + ' · ' + XZ13.esc(r.note || '') + '</span>' +
        '<span>' + sign + '¥' + r.amount.toFixed(2) +
        ' <span style="cursor:pointer;opacity:.6" onclick="XZ13TOOLS.ledger.del(\'' + r.id + '\')">×</span></span></div>';
    }).join('');
    var h = '<h3>💰 记账本</h3>' +
      '<div style="max-width:440px;margin:0 auto">' +
      '<div class="xz13-mic-scores">' +
      '<div class="xz13-mic-sc"><b style="color:#1f9e6e">¥' + income.toFixed(2) + '</b><span>收入</span></div>' +
      '<div class="xz13-mic-sc"><b style="color:#e04870">¥' + expense.toFixed(2) + '</b><span>支出</span></div>' +
      '<div class="xz13-mic-sc"><b>¥' + (income - expense).toFixed(2) + '</b><span>结余</span></div></div>' +
      '<div class="xz13-seg" id="tlType"><button class="on" data-t="out">支出</button><button data-t="in">收入</button></div>' +
      '<div class="xz13-save-bar"><input type="number" id="tlAmount" placeholder="金额" step="0.01" style="width:110px">' +
      '<select id="tlCat" style="flex:1"></select>' +
      '<input type="text" id="tlNote" placeholder="备注（可选）" style="flex:1"></div>' +
      '<button class="xz13-save-ss-btn primary" style="width:100%" onclick="XZ13TOOLS.ledger.add()">➕ 记一笔</button>' +
      '<div class="dim small" style="margin-top:8px">支出分类</div>' + (catHtml || '<div class="dim small">暂无</div>') +
      '<hr><div class="dim small">最近记录</div>' + (listHtml || '<div class="dim small">还没有记录</div>') +
      '<div class="xz13-save-bar"><button class="xz13-save-ss-btn danger" onclick="XZ13TOOLS.ledger.clear()">清空全部</button>' +
      '<button class="xz13-save-ss-btn" onclick="closeModal()">关闭</button></div></div>';
    XZ13.modal(h);
    var self = this;
    self.type = 'out';
    self.fillCats();
    XZ13.$$('#tlType button').forEach(function (b) {
      b.onclick = function () {
        XZ13.$$('#tlType button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        self.type = b.getAttribute('data-t');
        self.fillCats();
      };
    });
  },
  fillCats: function () {
    var sel = document.getElementById('tlCat');
    if (!sel) return;
    var cats = this.type === 'out' ? this.catsOut : this.catsIn;
    sel.innerHTML = cats.map(function (c) { return '<option>' + c + '</option>'; }).join('');
  },
  add: function () {
    var amt = parseFloat(document.getElementById('tlAmount').value);
    if (!isFinite(amt) || amt <= 0) { XZ13.toast('请输入正确金额'); return; }
    var recs = tlsGet('ledger', []);
    recs.push({
      id: tUid(), type: this.type, amount: Math.round(amt * 100) / 100,
      cat: document.getElementById('tlCat').value,
      note: document.getElementById('tlNote').value.trim(),
      at: Date.now()
    });
    tlsSet('ledger', recs);
    this.open();
  },
  del: function (id) {
    tlsSet('ledger', tlsGet('ledger', []).filter(function (r) { return r.id !== id; }));
    this.open();
  },
  clear: function () {
    if (confirm('确定清空全部记账记录吗？')) {
      tlsSet('ledger', []);
      this.open();
    }
  }
};

/* ── 10. 单词测验（英文→中文，四选一） ───────────────────── */
XZ13T.wordquiz = {
  bank: [
    ['abandon', '放弃'], ['benefit', '好处'], ['concept', '概念'], ['decide', '决定'], ['improve', '改善'],
    ['achieve', '实现'], ['balance', '平衡'], ['consider', '考虑'], ['develop', '发展'], ['encourage', '鼓励'],
    ['familiar', '熟悉的'], ['generate', '产生'], ['hesitate', '犹豫'], ['imagine', '想象'], ['judge', '判断'],
    ['knowledge', '知识'], ['limited', '有限的'], ['mention', '提到'], ['necessary', '必要的'], ['obvious', '明显的'],
    ['particular', '特别的'], ['quality', '质量'], ['recognize', '认出'], ['suggest', '建议'], ['tradition', '传统'],
    ['university', '大学'], ['various', '各种各样的'], ['wealth', '财富'], ['explore', '探索'], ['challenge', '挑战'],
    ['opportunity', '机会'], ['communicate', '交流'], ['determine', '决定'], ['efficient', '高效的'], ['gradually', '逐渐地'],
    ['independent', '独立的'], ['maintain', '维持'], ['perspective', '观点'], ['recommend', '推荐'], ['significant', '重要的'],
    ['temperature', '温度'], ['understand', '理解'], ['volunteer', '志愿者'], ['wander', '漫步'], ['anxiety', '焦虑'],
    ['confident', '自信的'], ['demonstrate', '证明'], ['emphasize', '强调'], ['frequent', '频繁的'], ['guarantee', '保证']
  ],
  total: 10, q: [], idx: 0, score: 0,
  open: function () {
    var q = this;
    // 优先使用记忆卡（取正为英文、背为中文的卡），否则用内置词库
    var bank = q.bank.slice();
    try {
      var cards = tlsGet('cards', []);
      if (cards && cards.length >= 4) {
        var usable = cards.filter(function (c) { return c.f && c.b && c.f.length < 20 && c.b.length < 12; });
        if (usable.length >= 4) bank = usable.map(function (c) { return [c.f, c.b]; });
      }
    } catch (e) {}
    // 洗牌
    for (var i = bank.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = bank[i]; bank[i] = bank[j]; bank[j] = t;
    }
    q.questions = bank.slice(0, Math.min(q.total, bank.length));
    q.bankFull = bank;
    q.idx = 0; q.score = 0;
    q.render();
  },
  render: function () {
    var q = this;
    if (q.idx >= q.questions.length) { q.result(); return; }
    var item = q.questions[q.idx];
    var answer = item[1];
    var distractors = q.bankFull.filter(function (w) { return w[1] !== answer; });
    for (var i = distractors.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = distractors[i]; distractors[i] = distractors[j]; distractors[j] = t;
    }
    var opts = distractors.slice(0, 3).map(function (w) { return w[1]; });
    opts.push(answer);
    for (var a = opts.length - 1; a > 0; a--) {
      var b = Math.floor(Math.random() * (a + 1));
      var tt = opts[a]; opts[a] = opts[b]; opts[b] = tt;
    }
    var h = '<h3>🔤 单词测验</h3>' +
      '<div style="max-width:420px;margin:0 auto">' +
      '<div class="xz13-game-hud"><span>第 ' + (q.idx + 1) + '/' + q.questions.length + ' 题</span><span>得分 ' + q.score + '</span><span>最高 ' + XZ13.best('gword') + '</span></div>' +
      '<div class="xz13-2048-box" style="min-height:90px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;margin:10px 0">' + XZ13.esc(item[0]) + '</div>' +
      '<div id="gwordOpts">' + opts.map(function (o) {
        return '<button class="gbtn" style="width:100%;margin:5px 0;text-align:left" onclick="XZ13TOOLS.wordquiz.answer(this,\'' + o.replace(/'/g, '') + '\',\'' + answer.replace(/'/g, '') + '\')">' + XZ13.esc(o) + '</button>';
      }).join('') + '</div></div>';
    XZ13.modal(h);
  },
  answer: function (btn, chosen, answer) {
    var q = this;
    var btns = XZ13.$$('#gwordOpts button');
    btns.forEach(function (b) {
      b.disabled = true;
      if (b.textContent === answer) b.style.background = 'linear-gradient(135deg,#3ddc97,#1f9e6e)';
      else if (b === btn) b.style.background = 'linear-gradient(135deg,#ff5d73,#c2405c)';
    });
    if (chosen === answer) q.score++;
    setTimeout(function () { q.idx++; q.render(); }, 650);
  },
  result: function () {
    var q = this;
    var best = XZ13.best('gword', q.score);
    gcReward(5 + q.score, 3, 0);
    var grade = q.score === q.questions.length ? '满分，词汇大师！' : q.score >= q.questions.length * 0.8 ? '很优秀' : q.score >= q.questions.length * 0.6 ? '及格了' : '继续背单词';
    XZ13.modal('<h3>🔤 测验完成</h3>' +
      '<div class="xz13-whack-hd" style="text-align:center">答对 <b>' + q.score + '/' + q.questions.length + '</b> ｜ 最高 ' + best + '</div>' +
      '<div class="xz13-game-hud"><span>' + grade + '</span></div>' +
      '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="XZ13TOOLS.wordquiz.open()">再来一组</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
  }
};

XZ13.TOOLS.push(
  { icon: '💰', name: '记账本', call: 'XZ13TOOLS.ledger.open()' },
  { icon: '🔤', name: '单词测验', call: 'XZ13TOOLS.wordquiz.open()' }
);

/* ===== x5513_tools_c.js ===== */
/* ============================================================
   5.5.13 · 第 4 模块（C）：节拍器 / 骰子硬币
   ============================================================ */

/* ── 11. 节拍器（WebAudio，无需音频文件） ─────────────────── */
XZ13T.metronome = {
  bpm: 90, beat: 0, timer: 0, ac: null, on: false,
  open: function () {
    var m = this;
    m.stop();
    XZ13.modal('<h3>🎵 节拍器</h3>' +
      '<div style="max-width:380px;margin:0 auto;text-align:center">' +
      '<div id="tmBpm" style="font-size:56px;font-weight:900;margin:6px 0">' + m.bpm + '</div>' +
      '<div class="dim small">BPM 拍/分钟</div>' +
      '<div style="margin:12px 0">' +
      '<button class="gbtn" onclick="XZ13TOOLS.metronome.chg(-5)">-5</button>' +
      '<button class="gbtn" onclick="XZ13TOOLS.metronome.chg(-1)">-1</button>' +
      '<button id="tmStart" class="gbtn" onclick="XZ13TOOLS.metronome.toggle()">▶ 开始</button>' +
      '<button class="gbtn" onclick="XZ13TOOLS.metronome.chg(1)">+1</button>' +
      '<button class="gbtn" onclick="XZ13TOOLS.metronome.chg(5)">+5</button></div>' +
      '<div style="font-size:13px">常用：<a href="javascript:void(0)" onclick="XZ13TOOLS.metronome.set(60)">60 慢板</a> · ' +
      '<a href="javascript:void(0)" onclick="XZ13TOOLS.metronome.set(90)">90 中板</a> · ' +
      '<a href="javascript:void(0)" onclick="XZ13TOOLS.metronome.set(120)">120 快板</a></div>' +
      '<div style="margin-top:16px"><button class="gbtn" onclick="closeModal()">关闭</button></div></div>');
  },
  chg: function (d) {
    this.set(this.bpm + d);
  },
  set: function (b) {
    this.bpm = Math.max(30, Math.min(240, b));
    var el = document.getElementById('tmBpm');
    if (el) el.textContent = this.bpm;
    if (this.on) { this.stop(); this.start(); }
  },
  toggle: function () {
    if (this.on) this.stop(); else this.start();
  },
  start: function () {
    var m = this;
    try {
      if (!m.ac) m.ac = new (window.AudioContext || window.webkitAudioContext)();
      m.on = true;
      m.beat = 0;
      var btn = document.getElementById('tmStart');
      if (btn) btn.textContent = '⏸ 停止';
      m.click(true);
      m.timer = setInterval(function () {
        m.beat = (m.beat + 1) % 4;
        m.click(m.beat === 0);
      }, 60000 / m.bpm);
    } catch (e) { XZ13.toast('当前环境不支持音频'); }
  },
  stop: function () {
    this.on = false;
    if (this.timer) { clearInterval(this.timer); this.timer = 0; }
    var btn = document.getElementById('tmStart');
    if (btn) btn.textContent = '▶ 开始';
  },
  click: function (accent) {
    var m = this;
    try {
      if (!m.ac) return;
      var o = m.ac.createOscillator();
      var g = m.ac.createGain();
      o.type = 'square';
      o.frequency.value = accent ? 1320 : 880;
      g.gain.setValueAtTime(accent ? 0.25 : 0.15, m.ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, m.ac.currentTime + 0.05);
      o.connect(g); g.connect(m.ac.destination);
      o.start();
      o.stop(m.ac.currentTime + 0.06);
    } catch (e) {}
  }
};

/* ── 12. 骰子 / 抛硬币 ───────────────────────────────────── */
XZ13T.dice = {
  open: function () {
    XZ13.modal('<h3>🎲 骰子 / 硬币</h3>' +
      '<div style="max-width:400px;margin:0 auto;text-align:center">' +
      '<div id="tdOut" style="font-size:64px;font-weight:900;margin:14px 0;min-height:80px">?</div>' +
      '<div id="tdDetail" class="dim small" style="margin-bottom:10px"></div>' +
      '<div style="margin-bottom:10px"><button class="gbtn" onclick="XZ13TOOLS.dice.roll(1,6)">🎲 1 个 d6</button>' +
      '<button class="gbtn" onclick="XZ13TOOLS.dice.roll(2,6)">🎲 2 个 d6</button>' +
      '<button class="gbtn" onclick="XZ13TOOLS.dice.roll(1,20)">🎲 d20</button>' +
      '<button class="gbtn" onclick="XZ13TOOLS.dice.coin()">🪙 抛硬币</button></div>' +
      '<div style="margin-bottom:10px"><button class="gbtn" onclick="XZ13TOOLS.dice.roll(1,4)">d4</button>' +
      '<button class="gbtn" onclick="XZ13TOOLS.dice.roll(1,8)">d8</button>' +
      '<button class="gbtn" onclick="XZ13TOOLS.dice.roll(1,10)">d10</button>' +
      '<button class="gbtn" onclick="XZ13TOOLS.dice.roll(1,12)">d12</button>' +
      '<button class="gbtn" onclick="XZ13TOOLS.dice.roll(1,100)">d100</button></div>' +
      '<div><button class="gbtn" onclick="closeModal()">关闭</button></div></div>');
  },
  anim: function (finalFn) {
    var out = document.getElementById('tdOut');
    if (!out) { finalFn(); return; }
    var n = 0;
    var iv = setInterval(function () {
      n++;
      out.textContent = String(Math.floor(Math.random() * 6) + 1) + ' · ' + String(Math.floor(Math.random() * 6) + 1);
      if (n >= 8) { clearInterval(iv); finalFn(); }
    }, 55);
  },
  roll: function (count, sides) {
    var out = document.getElementById('tdOut');
    var detail = document.getElementById('tdDetail');
    if (!out) return;
    var vals = [];
    for (var i = 0; i < count; i++) vals.push(Math.floor(Math.random() * sides) + 1);
    var sum = vals.reduce(function (a, b) { return a + b; }, 0);
    var n = 0;
    clearInterval(this.iv);
    var self = this;
    this.iv = setInterval(function () {
      n++;
      out.textContent = vals.map(function () { return Math.floor(Math.random() * sides) + 1; }).join(' · ');
      if (n >= 8) {
        clearInterval(self.iv);
        out.textContent = vals.join(' · ');
        if (detail) detail.textContent = count > 1 ? '点数合计 ' + sum + '（' + sides + ' 面骰 ×' + count + '）' : sides + ' 面骰结果';
      }
    }, 55);
  },
  coin: function () {
    var out = document.getElementById('tdOut');
    var detail = document.getElementById('tdDetail');
    if (!out) return;
    var faces = ['🪙', '⭐'];
    var n = 0;
    clearInterval(this.iv);
    var self = this;
    this.iv = setInterval(function () {
      n++;
      out.textContent = n % 2 ? '正' : '反';
      if (n >= 10) {
        clearInterval(self.iv);
        var head = Math.random() < 0.5;
        out.textContent = head ? '正面' : '反面';
        out.style.color = head ? '#e0a83c' : '#8b5cf6';
        if (detail) detail.textContent = head ? '硬币：正面（50%）' : '硬币：反面（50%）';
        setTimeout(function () { out.style.color = ''; }, 400);
      }
    }, 60);
  }
};

XZ13.TOOLS.push(
  { icon: '🎵', name: '节拍器', call: 'XZ13TOOLS.metronome.open()' },
  { icon: '🎲', name: '骰子硬币', call: 'XZ13TOOLS.dice.open()' }
);

/* ===== x5513_tools_d.js ===== */
/* ============================================================
   5.5.13 · 第 4 模块（D）：课程表 / 画板
   ============================================================ */

/* ── 13. 课程表（周一~周日，可编辑） ─────────────────────── */
XZ13T.timetable = {
  days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  periods: 8,
  data: {},
  open: function () {
    var t = this;
    t.data = tlsGet('timetable', {});
    var rows = '';
    for (var p = 0; p < t.periods; p++) {
      rows += '<tr><th style="width:46px">' + (p + 1) + '</th>';
      for (var d = 0; d < 7; d++) {
        var key = d + '_' + p;
        var val = t.data[key] || '';
        rows += '<td class="tt-cell" data-d="' + d + '" data-p="' + p + '" style="border:1px solid var(--line2,#3d4f82);padding:2px;min-width:56px;cursor:pointer;text-align:center">' + XZ13.esc(val) + '</td>';
      }
      rows += '</tr>';
    }
    var h = '<h3>📅 我的课程表</h3>' +
      '<div style="overflow-x:auto;max-width:640px;margin:0 auto">' +
      '<table style="border-collapse:collapse;width:100%;font-size:12px">' +
      '<thead><tr><th></th>' + t.days.map(function (d) { return '<th style="padding:4px">' + d + '</th>'; }).join('') + '</tr></thead>' +
      '<tbody id="ttBody">' + rows + '</tbody></table></div>' +
      '<div class="xz13-save-bar" style="justify-content:center;margin-top:10px">' +
      '<button class="xz13-save-ss-btn" onclick="XZ13TOOLS.timetable.quickFill()">一键示例</button>' +
      '<button class="xz13-save-ss-btn danger" onclick="XZ13TOOLS.timetable.clear()">清空</button>' +
      '<button class="xz13-save-ss-btn" onclick="closeModal()">关闭</button></div>' +
      '<div class="dim small" style="text-align:center;margin-top:6px">点格子输入课程，自动保存到本地。</div>';
    XZ13.modal(h);
    XZ13.$$('#ttBody .tt-cell').forEach(function (cell) {
      cell.onclick = function () {
        var d = cell.getAttribute('data-d'), p = cell.getAttribute('data-p');
        var key = d + '_' + p;
        var cur = t.data[key] || '';
        var val = prompt('「' + t.days[d] + ' 第' + (parseInt(p, 10) + 1) + '节」课程（留空清除）：', cur);
        if (val === null) return;
        val = val.trim();
        if (val) t.data[key] = val;
        else delete t.data[key];
        tlsSet('timetable', t.data);
        t.open();
      };
    });
  },
  quickFill: function () {
    var sample = ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理', '体育', '信息', '美术', '音乐'];
    var d = {};
    for (var day = 0; day < 5; day++) {
      for (var p = 0; p < 8; p++) {
        if (p === 3 || p === 7) continue;
        d[day + '_' + p] = sample[(day * 3 + p) % sample.length];
      }
    }
    d['0_3'] = '体育'; d['2_6'] = '班会';
    tlsSet('timetable', d);
    this.open();
  },
  clear: function () {
    if (confirm('确定清空课程表吗？')) {
      tlsSet('timetable', {});
      this.open();
    }
  }
};

/* ── 14. 画板（随手画 / 可导出图片） ─────────────────────── */
XZ13T.draw = {
  cv: null, ctx: null, drawing: false, color: '#4a7dff', size: 4, undoStack: [],
  palette: ['#222222', '#e04870', '#ff9f43', '#ffd166', '#3ddc97', '#4a7dff', '#8b5cf6', '#ffffff'],
  open: function () {
    var d = this;
    d.undoStack = [];
    XZ13.modal('<h3>🎨 画板</h3>' +
      '<div style="max-width:460px;margin:0 auto;text-align:center">' +
      '<div id="tdPalette" style="margin:6px 0">' +
      d.palette.map(function (c, i) {
        return '<span data-c="' + c + '" style="display:inline-block;width:28px;height:28px;border-radius:50%;background:' + c +
          ';margin:2px;cursor:pointer;border:2px solid ' + (i === 5 ? '#4a7dff' : 'rgba(127,127,127,.3)') + '"></span>';
      }).join('') + '</div>' +
      '<div style="margin-bottom:6px">粗细 <input type="range" id="tdSize" min="1" max="20" value="4"></div>' +
      '<canvas id="tdCanvas" width="420" height="320" style="max-width:96vw;background:#fff;border-radius:10px;touch-action:none;border:1px solid var(--line2,#3d4f82)"></canvas>' +
      '<div style="margin-top:8px"><button class="gbtn" onclick="XZ13TOOLS.draw.undo()">↩ 撤销</button>' +
      '<button class="gbtn" onclick="XZ13TOOLS.draw.clear()">🗑 清空</button>' +
      '<button class="gbtn" onclick="XZ13TOOLS.draw.save()">💾 保存图片</button>' +
      '<button class="gbtn" onclick="closeModal()">退出</button></div></div>');
    d.cv = document.getElementById('tdCanvas');
    d.ctx = d.cv.getContext('2d');
    d.ctx.fillStyle = '#fff';
    d.ctx.fillRect(0, 0, d.cv.width, d.cv.height);
    d.pushUndo();
    var sizeInput = document.getElementById('tdSize');
    if (sizeInput) sizeInput.oninput = function () { d.size = parseInt(this.value, 10); };
    XZ13.$$('#tdPalette span').forEach(function (sw) {
      sw.onclick = function () {
        d.color = sw.getAttribute('data-c');
        XZ13.$$('#tdPalette span').forEach(function (x) { x.style.outline = ''; });
        sw.style.outline = '3px solid #4a7dff';
      };
    });
    d.bind();
  },
  bind: function () {
    var d = this;
    var cv = d.cv;
    function pos(e) {
      var rect = cv.getBoundingClientRect();
      var cx = (e.touches ? e.touches[0].clientX : e.clientX);
      var cy = (e.touches ? e.touches[0].clientY : e.clientY);
      return { x: (cx - rect.left) * (cv.width / rect.width), y: (cy - rect.top) * (cv.height / rect.height) };
    }
    function start(e) {
      e.preventDefault();
      d.drawing = true;
      var p = pos(e);
      d.ctx.beginPath();
      d.ctx.moveTo(p.x, p.y);
      d.ctx.lineCap = 'round';
      d.ctx.lineJoin = 'round';
    }
    function move(e) {
      if (!d.drawing) return;
      e.preventDefault();
      var p = pos(e);
      d.ctx.strokeStyle = d.color;
      d.ctx.lineWidth = d.size;
      d.ctx.lineTo(p.x, p.y);
      d.ctx.stroke();
    }
    function end() {
      if (d.drawing) { d.drawing = false; d.pushUndo(); }
    }
    cv.addEventListener('mousedown', start);
    cv.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    cv.addEventListener('touchstart', start, { passive: false });
    cv.addEventListener('touchmove', move, { passive: false });
    cv.addEventListener('touchend', end);
    gcWatch('tdCanvas', function () {
      cv.removeEventListener('mousedown', start);
      cv.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
    });
  },
  pushUndo: function () {
    var d = this;
    try {
      d.undoStack.push(d.cv.toDataURL());
      if (d.undoStack.length > 20) d.undoStack.shift();
    } catch (e) {}
  },
  undo: function () {
    var d = this;
    if (d.undoStack.length <= 1) return;
    d.undoStack.pop();
    var img = new Image();
    img.onload = function () {
      d.ctx.clearRect(0, 0, d.cv.width, d.cv.height);
      d.ctx.drawImage(img, 0, 0);
    };
    img.src = d.undoStack[d.undoStack.length - 1];
  },
  clear: function () {
    var d = this;
    d.ctx.fillStyle = '#fff';
    d.ctx.fillRect(0, 0, d.cv.width, d.cv.height);
    d.pushUndo();
  },
  save: function () {
    var a = document.createElement('a');
    a.download = '我的画作.png';
    a.href = this.cv.toDataURL('image/png');
    a.click();
    XZ13.toast('已保存画作');
  }
};

XZ13.TOOLS.push(
  { icon: '📅', name: '课程表', call: 'XZ13TOOLS.timetable.open()' },
  { icon: '🎨', name: '画板', call: 'XZ13TOOLS.draw.open()' }
);

/* ===== x5513_tools_e.js ===== */
/* ============================================================
   5.5.13 · 第 4 模块（E）：待办清单 / 随机分组
   ============================================================ */

/* ── 15. 待办清单（优先级 + 完成） ───────────────────────── */
XZ13T.todo = {
  items: [],
  prioName: { 1: '🔴 高', 2: '🟡 中', 3: '⚪ 低' },
  open: function () {
    var t = this;
    t.items = tlsGet('todo', []);
    var pending = t.items.filter(function (i) { return !i.done; });
    var done = t.items.filter(function (i) { return i.done; });
    pending.sort(function (a, b) { return a.prio - b.prio; });
    var list = pending.concat(done);
    var html = list.map(function (it) {
      var st = it.done ? 'text-decoration:line-through;opacity:.5' : '';
      return '<div class="xz13-habit" style="display:flex;align-items:center;gap:8px;margin:6px 0">' +
        '<input type="checkbox" ' + (it.done ? 'checked' : '') + ' onchange="XZ13TOOLS.todo.toggle(\'' + it.id + '\')">' +
        '<span style="flex:1;' + st + '">' + XZ13.esc(it.text) + '</span>' +
        '<span style="font-size:12px">' + t.prioName[it.prio] + '</span>' +
        '<span style="cursor:pointer" onclick="XZ13TOOLS.todo.del(\'' + it.id + '\')">×</span></div>';
    }).join('');
    var h = '<h3>✅ 待办清单</h3>' +
      '<div style="max-width:440px;margin:0 auto">' +
      '<div class="xz13-game-hud"><span>待办 <b>' + pending.length + '</b></span><span>已完成 <b>' + done.length + '</b></span></div>' +
      '<div class="xz13-save-bar"><input type="text" id="ttdText" placeholder="要做什么？" style="flex:1">' +
      '<select id="ttdPrio" style="width:80px"><option value="1">🔴 高</option><option value="2" selected>🟡 中</option><option value="3">⚪ 低</option></select>' +
      '<button class="xz13-save-ss-btn primary" onclick="XZ13TOOLS.todo.add()">添加</button></div>' +
      '<div id="ttdList" style="margin-top:8px">' + (html || '<div class="dim small">还没有待办，加一条吧～</div>') + '</div>' +
      '<div class="xz13-save-bar" style="margin-top:10px">' +
      '<button class="xz13-save-ss-btn" onclick="XZ13TOOLS.todo.clearDone()">清除已完成</button>' +
      '<button class="xz13-save-ss-btn" onclick="closeModal()">关闭</button></div></div>';
    XZ13.modal(h);
    var inp = document.getElementById('ttdText');
    if (inp) inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') t.add(); });
  },
  save: function () { tlsSet('todo', this.items); },
  add: function () {
    var inp = document.getElementById('ttdText');
    var text = inp.value.trim();
    if (!text) { XZ13.toast('先写点内容'); return; }
    var prio = parseInt(document.getElementById('ttdPrio').value, 10) || 2;
    this.items.push({ id: tUid(), text: text, done: false, prio: prio, at: Date.now() });
    this.save();
    this.open();
  },
  toggle: function (id) {
    this.items.forEach(function (it) { if (it.id === id) it.done = !it.done; });
    this.save();
    this.open();
  },
  del: function (id) {
    this.items = this.items.filter(function (it) { return it.id !== id; });
    this.save();
    this.open();
  },
  clearDone: function () {
    this.items = this.items.filter(function (it) { return !it.done; });
    this.save();
    this.open();
  }
};

/* ── 16. 随机分组 / 抽签 ─────────────────────────────────── */
XZ13T.group = {
  open: function () {
    var g = this;
    XZ13.modal('<h3>🧑‍🤝‍🧑 随机分组</h3>' +
      '<div style="max-width:460px;margin:0 auto">' +
      '<textarea id="tgpNames" rows="5" placeholder="把名单贴进来，每行一个，或用逗号/空格分隔" style="width:100%;box-sizing:border-box"></textarea>' +
      '<div class="xz13-save-bar" style="margin:8px 0">' +
      '<label style="flex:1">分成 <input type="number" id="tgpN" value="4" min="2" max="20" style="width:60px"> 组</label>' +
      '<button class="xz13-save-ss-btn primary" onclick="XZ13TOOLS.group.run()">🎲 开始分组</button>' +
      '<button class="xz13-save-ss-btn" onclick="XZ13TOOLS.group.pickOne()">🙋 随机点一人</button></div>' +
      '<div id="tgpResult"></div>' +
      '<div style="margin-top:10px"><button class="gbtn" onclick="closeModal()">关闭</button></div></div>');
    var prev = XZ13.lsGet('xz13_group_names', '');
    var ta = document.getElementById('tgpNames');
    if (ta && prev) ta.value = prev;
  },
  parseNames: function () {
    var ta = document.getElementById('tgpNames');
    if (!ta) return [];
    XZ13.lsSet('xz13_group_names', ta.value);
    return ta.value.split(/[\n,，、\s]+/).map(function (s) { return s.trim(); }).filter(Boolean);
  },
  shuffle: function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  },
  run: function () {
    var names = this.parseNames();
    var n = parseInt(document.getElementById('tgpN').value, 10);
    var box = document.getElementById('tgpResult');
    if (names.length < 2) { box.innerHTML = '<div class="dim small">至少输入两个名字</div>'; return; }
    if (!n || n < 2 || n > names.length) { box.innerHTML = '<div class="dim small">组数要在 2 ~ 人数之间</div>'; return; }
    var shuffled = this.shuffle(names);
    var groups = [];
    for (var i = 0; i < n; i++) groups.push([]);
    for (var k = 0; k < shuffled.length; k++) groups[k % n].push(shuffled[k]);
    var colors = ['#4a7dff', '#e04870', '#1f9e6e', '#ff9f43', '#8b5cf6', '#0bb5c4', '#d63384', '#6f42c1'];
    var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-top:10px">';
    for (var g = 0; g < groups.length; g++) {
      html += '<div style="border:1px solid ' + colors[g % colors.length] + ';border-radius:10px;padding:8px">' +
        '<div style="font-weight:800;color:' + colors[g % colors.length] + '">第 ' + (g + 1) + ' 组（' + groups[g].length + '人）</div>' +
        groups[g].map(function (name) { return '<div style="font-size:13px;margin:2px 0">· ' + XZ13.esc(name) + '</div>'; }).join('') +
        '</div>';
    }
    html += '</div>';
    box.innerHTML = html;
  },
  pickOne: function () {
    var names = this.parseNames();
    var box = document.getElementById('tgpResult');
    if (!names.length) { box.innerHTML = '<div class="dim small">先输入名单</div>'; return; }
    var n = 0;
    box.innerHTML = '<div style="text-align:center;font-size:30px;font-weight:900;margin:14px 0" id="tgpPick">…</div>';
    var el = document.getElementById('tgpPick');
    var iv = setInterval(function () {
      n++;
      el.textContent = names[Math.floor(Math.random() * names.length)];
      if (n >= 12) {
        clearInterval(iv);
        var win = names[Math.floor(Math.random() * names.length)];
        el.textContent = '👉 ' + win;
        el.style.color = '#4a7dff';
      }
    }, 70);
  }
};

XZ13.TOOLS.push(
  { icon: '✅', name: '待办清单', call: 'XZ13TOOLS.todo.open()' },
  { icon: '🧑‍🤝‍🧑', name: '随机分组', call: 'XZ13TOOLS.group.open()' }
);

/* ===== x5513_tools_f.js ===== */
/* ============================================================
   5.5.13 · 第 4 模块（F）：成绩记录本（总分/均分/趋势）
   ============================================================ */
XZ13T.grades = {
  data: [],
  open: function () {
    var g = this;
    g.data = tlsGet('grades', []);
    var rows = g.data.map(function (ex, i) {
      var got = 0, full = 0;
      ex.scores.forEach(function (s) { got += parseFloat(s.score) || 0; full += parseFloat(s.full) || 100; });
      var pct = full ? Math.round(got / full * 1000) / 10 : 0;
      var trend = '';
      if (i > 0) {
        var prev = g.data[i - 1], pg = 0, pf = 0;
        prev.scores.forEach(function (s) { pg += parseFloat(s.score) || 0; pf += parseFloat(s.full) || 100; });
        var pp = pf ? pg / pf * 100 : 0;
        var diff = Math.round((pct - pp) * 10) / 10;
        trend = diff > 0 ? '<span style="color:#1f9e6e">▲' + diff + '%</span>'
          : diff < 0 ? '<span style="color:#e04870">▼' + Math.abs(diff) + '%</span>'
          : '<span style="opacity:.6">—</span>';
      }
      var detail = ex.scores.map(function (s) {
        return XZ13.esc(s.sub) + ' ' + s.score + '/' + s.full;
      }).join('　');
      return '<div class="xz13-habit" style="margin:6px 0">' +
        '<div style="display:flex;justify-content:space-between;align-items:center"><b>' + XZ13.esc(ex.name) + '</b>' +
        '<span>' + trend + ' <span style="cursor:pointer" onclick="XZ13TOOLS.grades.del(' + i + ')">×</span></span></div>' +
        '<div style="font-size:13px;margin-top:3px">' + detail + '</div>' +
        '<div class="dim small">总分 ' + got + '/' + full + ' ｜ 得分率 ' + pct + '%</div></div>';
    }).join('');
    var h = '<h3>📊 成绩记录本</h3>' +
      '<div style="max-width:480px;margin:0 auto">' +
      '<div id="tgList">' + (rows || '<div class="dim small">还没有记录，先添加一次考试成绩吧。</div>') + '</div>' +
      '<hr><div id="tgForm"><div class="dim small">添加一次成绩</div>' +
      '<input type="text" id="tgName" placeholder="考试名称，如：第一次月考" style="width:100%;box-sizing:border-box;margin:6px 0">' +
      '<div id="tgRows"></div>' +
      '<div class="xz13-save-bar"><button class="xz13-save-ss-btn" onclick="XZ13TOOLS.grades.addRow()">➕ 加科目</button>' +
      '<button class="xz13-save-ss-btn primary" onclick="XZ13TOOLS.grades.save()">保存这次成绩</button>' +
      '<button class="xz13-save-ss-btn danger" onclick="XZ13TOOLS.grades.clearAll()">清空</button></div></div>' +
      '<div style="margin-top:8px"><button class="gbtn" onclick="closeModal()">关闭</button></div></div>';
    XZ13.modal(h);
    g.addRow(3);
  },
  addRow: function (n) {
    var box = document.getElementById('tgRows');
    if (!box) return;
    var make = function (sub) {
      var div = document.createElement('div');
      div.className = 'xz13-save-bar';
      div.style.margin = '4px 0';
      div.innerHTML = '<input type="text" class="tg-sub" placeholder="科目" value="' + (sub || '') + '" style="width:110px">' +
        '<input type="number" class="tg-score" placeholder="得分" style="width:90px">' +
        '<input type="number" class="tg-full" placeholder="满分" value="100" style="width:80px">' +
        '<button class="xz13-save-ss-btn danger" onclick="this.parentNode.remove()">删</button>';
      box.appendChild(div);
    };
    if (typeof n === 'number') {
      ['语文', '数学', '英语', '物理', '化学', '地理'].forEach(function (s) { make(s); });
    } else {
      make('');
    }
  },
  collect: function () {
    var scores = [];
    XZ13.$$('#tgRows .xz13-save-bar').forEach(function (row) {
      var sub = row.querySelector('.tg-sub').value.trim();
      var score = row.querySelector('.tg-score').value.trim();
      var full = row.querySelector('.tg-full').value.trim() || '100';
      if (sub && score !== '') scores.push({ sub: sub, score: parseFloat(score) || 0, full: parseFloat(full) || 100 });
    });
    return scores;
  },
  save: function () {
    var g = this;
    var name = document.getElementById('tgName').value.trim();
    var scores = g.collect();
    if (!name) { XZ13.toast('填一下考试名称'); return; }
    if (!scores.length) { XZ13.toast('至少填一科成绩'); return; }
    g.data.push({ name: name, at: Date.now(), scores: scores });
    g.data.sort(function (a, b) { return a.at - b.at; });
    tlsSet('grades', g.data);
    g.open();
  },
  del: function (i) {
    this.data.splice(i, 1);
    tlsSet('grades', this.data);
    this.open();
  },
  clearAll: function () {
    if (confirm('确定清空全部成绩记录吗？')) {
      tlsSet('grades', []);
      this.open();
    }
  }
};

XZ13.TOOLS.push({ icon: '📊', name: '成绩记录本', call: 'XZ13TOOLS.grades.open()' });

/* ===== x5513_enhance.js ===== */
/* ============================================================
   5.5.13 · 第 7 模块：游戏成就墙 / 每日挑战 / 操作防滚动
   完全只读既有成绩，不侵入原版小游戏内部逻辑。
   ============================================================ */
var XZ13HALL = {
  /* 成就定义：根据各游戏本地最高分判定（higher=分越高越好，min=毫秒/秒越低越好） */
  achievements: [
    { id: 'a_2048_1024', icon: '🔢', name: '合成 1024', check: function () { return XZ13.best('g2048') >= 1024; } },
    { id: 'a_2048_2048', icon: '🏆', name: '合成 2048', check: function () { return XZ13.best('g2048') >= 2048; } },
    { id: 'a_tetris_2000', icon: '🟦', name: '方块 2000 分', check: function () { return XZ13.best('gtetris') >= 2000; } },
    { id: 'a_tetris_40', icon: '🧱', name: '消除 40 行', check: function () { return XZ13.best('gtetris') >= 4000; } },
    { id: 'a_snake_15', icon: '🐍', name: '贪吃蛇 15 分', check: function () { return XZ13.best('gsnake') >= 15; } },
    { id: 'a_break_400', icon: '🧱', name: '打砖块 400 分', check: function () { return XZ13.best('gbreak') >= 400; } },
    { id: 'a_whack_25', icon: '🐹', name: '打地鼠 25 只', check: function () { return XZ13.best('gwhack') >= 25; } },
    { id: 'a_mem_full', icon: '🧠', name: '记忆翻牌通关', check: function () { return XZ13.best('gmem') >= 100; } },
    { id: 'a_react_220', icon: '⚡', name: '反应快于 220ms', check: function () { var v = gcBestMin('greact'); return v > 0 && v <= 220; } },
    { id: 'a_react_180', icon: '🚀', name: '反应快于 180ms', check: function () { var v = gcBestMin('greact'); return v > 0 && v <= 180; } },
    { id: 'a_mines_60', icon: '💣', name: '60 秒内排雷', check: function () { var v = gcBestMin('gms'); return v > 0 && v <= 60; } },
    { id: 'a_puzzle_90', icon: '🔢', name: '华容道 90 秒', check: function () { var v = gcBestMin('gpz'); return v > 0 && v <= 90; } },
    { id: 'a_idiom_9', icon: '📖', name: '成语答对 9 个', check: function () { return XZ13.best('gidiom') >= 9; } },
    { id: 'a_word_9', icon: '🔤', name: '单词答对 9 个', check: function () { return XZ13.best('gword') >= 9; } }
  ],
  /* 每日挑战：按日期在各游戏间轮换，给出一个目标，完成即记录 */
  dailySeed: function () {
    var d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  },
  dailyList: [
    { icon: '🔢', name: '2048', target: 512, type: 'hi', key: 'g2048', call: function () { XZ13GAMES.g2048.open(); } },
    { icon: '🐹', name: '打地鼠', target: 20, type: 'hi', key: 'gwhack', call: function () { XZ13GAMES.whack.open(); } },
    { icon: '🐍', name: '贪吃蛇 Pro', target: 10, type: 'hi', key: 'gsnake', call: function () { XZ13GAMES.snake.open(); } },
    { icon: '🧱', name: '打砖块', target: 300, type: 'hi', key: 'gbreak', call: function () { XZ13GAMES.breakout.open(); } },
    { icon: '📖', name: '成语填空', target: 8, type: 'hi', key: 'gidiom', call: function () { XZ13GAMES.idiom.open(); } },
    { icon: '🔤', name: '单词测验', target: 8, type: 'hi', key: 'gword', call: function () { XZ13TOOLS.wordquiz.open(); } },
    { icon: '🟦', name: '俄罗斯方块', target: 1500, type: 'hi', key: 'gtetris', call: function () { XZ13GAMES.tetris.open(); } },
    { icon: '🧠', name: '记忆翻牌', target: 1, type: 'played', key: 'gmem', call: function () { XZ13GAMES.mem.open(); } }
  ],
  today: function () {
    var seed = this.dailySeed();
    return this.dailyList[seed % this.dailyList.length];
  },
  dailyDone: function () {
    var t = this.today();
    var k = 'xz13_daily_done';
    var rec = {};
    try { rec = JSON.parse(XZ13.lsGet(k, '{}')) || {}; } catch (e) { rec = {}; }
    if (rec.date !== this.dailySeed()) return false;
    return rec.task === t.name;
  },
  open: function () {
    var self = this;
    var got = 0;
    var cards = this.achievements.map(function (a) {
      var ok = false;
      try { ok = a.check(); } catch (e) { ok = false; }
      if (ok) got++;
      var op = ok ? 1 : 0.25;
      var filter = ok ? 'none' : 'grayscale(1)';
      return '<div style="text-align:center;padding:8px;border-radius:12px;background:rgba(127,127,127,.07);opacity:' + op + '">' +
        '<div style="font-size:30px;filter:' + filter + '">' + a.icon + '</div>' +
        '<div style="font-size:12px;margin-top:4px">' + a.name + '</div>' +
        '<div style="font-size:14px">' + (ok ? '✅' : '🔒') + '</div></div>';
    }).join('');
    var t = this.today();
    var done = this.dailyDone();
    // 每次打开成就墙，顺带判定今日挑战是否已达成
    if (!done) {
      try {
        if (t.type === 'hi' && XZ13.best(t.key) >= t.target) {
          XZ13.lsSet('xz13_daily_done', JSON.stringify({ date: this.dailySeed(), task: t.name }));
          done = true;
        }
      } catch (e) {}
    }
    var h = '<h3>🏆 游戏成就墙</h3>' +
      '<div style="max-width:460px;margin:0 auto">' +
      '<div class="quote" style="margin-bottom:10px">已解锁 <b>' + got + '/' + this.achievements.length + '</b> 个成就</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:8px">' + cards + '</div>' +
      '<hr><h3 style="text-align:center">🎯 每日挑战</h3>' +
      '<div class="xz13-save-slot" style="text-align:center">' +
      '<div style="font-size:22px;margin:6px 0">' + t.icon + ' ' + t.name +
      (t.type === 'hi' ? '（目标 ' + t.target + '）' : '') + '</div>' +
      (done ? '<div style="color:#1f9e6f;font-weight:800">✅ 今日已完成，明天再来！</div>' :
        '<button class="xz13-save-ss-btn primary" onclick="XZ13HALL.playToday()">开始挑战</button>') +
      '</div>' +
      '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="closeModal()">关闭</button></div></div>';
    XZ13.modal(h);
  },
  playToday: function () {
    var t = this.today();
    if (t && typeof t.call === 'function') t.call();
  }
};
window.__xz13Hall = XZ13HALL;

/* 操作防滚动：游戏面板打开时，方向键/空格不滚动页面 */
function hallScrollGuard() {
  var gameMarkers = ['g2048Grid', 'gtetrisCanvas', 'gskCanvas', 'gboCanvas', 'ggmCanvas'];
  document.addEventListener('keydown', function (e) {
    var block = false;
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      for (var i = 0; i < gameMarkers.length; i++) {
        if (document.getElementById(gameMarkers[i])) { block = true; break; }
      }
    }
    if (block) {
      var modal = XZ13.$('modal');
      if (modal && modal.classList.contains('show')) e.preventDefault();
    }
  }, { passive: false });
}
XZ13.inits.push(hallScrollGuard);

/* ===== x5513_ai_a.js ===== */
/* ============================================================
   5.5.13 · 第 5 模块（A）：AI 题库第三批扩容（学科/考试/校园）
   仅追加不覆盖；用唯一 id q3_* 与去重，绝不破坏旧库。
   ============================================================ */
var QS3 = window.QS_EXTRA_INTENTS_3 || [];
window.QS_EXTRA_INTENTS_3 = QS3;

QS3.push(
  { id: 'q3_math', t: '数学', role: ['student'], kws: ['数学题', '数学好难', '函数', '几何', '代数', '导数', '数学卷子', '算不出', '证明题', '数学作业'],
    sim: '这道数学题好难', rep: { cold: ['自己想', '不会就别做了', '懒得讲'], mid: ['画个图试试', '哪一步卡住了？', '把已知条件列出来'], warm: ['我陪你一起解', '你一定能做出来的', '慢慢来，我们一步步来'] } },
  { id: 'q3_physics', t: '物理', role: ['student'], kws: ['物理', '物理题', '受力分析', '电路图', '牛顿', '运动学', '浮力', '电磁', '物理公式', '实验题'],
    sim: '物理听不懂', rep: { cold: ['那就别听', '物理本来就难', '自找的'], mid: ['先把公式搞懂', '受力分析是关键', '多做例题'], warm: ['我帮你整理公式', '你可以的，我相信你', '不懂的我们一起查'] } },
  { id: 'q3_chemistry', t: '化学', role: ['student'], kws: ['化学', '化学方程式', '元素周期表', '配平', '化合价', '有机化学', '化学实验', '摩尔', '离子', '化学难'],
    sim: '化学方程式配不平', rep: { cold: ['背去', '这么简单', '懒得理'], mid: ['按元素守恒配', '先找氧原子', '多练几道就会'], warm: ['我和你一起配', '你记性好，一定行', '配平有技巧，我教你'] } },
  { id: 'q3_english', t: '英语', role: ['student'], kws: ['英语', '英语单词', '背单词', '语法', '时态', '英语阅读', '完形填空', '英语作文', '英语听力', '口语'],
    sim: '单词总记不住', rep: { cold: ['多背', '你太懒', '活该记不住'], mid: ['用词根记忆法', '每天复习一点', '艾宾浩斯曲线'], warm: ['我陪你每天背', '你已经很棒了', '坚持就是胜利呀'] } },
  { id: 'q3_listen', t: '英语听力', role: ['student'], kws: ['听力', '听不懂听力', '听力考试', '听力材料', '磨耳朵', '听力填空', '听不出', '英语听力差', '听力技巧', '朗读'],
    sim: '英语听力总丢分', rep: { cold: ['多听去', '别问我', '天生的'], mid: ['先听关键词', '看原文再听一遍', '每天听十分钟'], warm: ['我陪你练听力', '你进步很快的', '听不懂我给你念'] } },
  { id: 'q3_chinese', t: '语文', role: ['student'], kws: ['语文', '语文作文', '阅读理解', '文言文', '古诗', '默写', '作文素材', '中心思想', '语文作业', '记叙文'],
    sim: '作文不知道写什么', rep: { cold: ['随便编', '懒得想', '自己写'], mid: ['先列提纲', '从身边小事写', '积累点素材'], warm: ['你的想法最独特', '写你自己的故事', '你文笔很好的'] } },
  { id: 'q3_poem', t: '古诗词', role: ['student'], kws: ['古诗', '诗词', '背古诗', '默写古诗', '诗歌鉴赏', '诗人', '唐诗', '宋词', '名句', '背不出'],
    sim: '古诗好难背', rep: { cold: ['死记硬背', '谁让你不背', '活该'], mid: ['理解意思再背', '联想画面记忆', '多读几遍'], warm: ['我陪你一句句背', '你记性真好', '背下来我请你吃糖'] } },
  { id: 'q3_biology', t: '生物', role: ['student'], kws: ['生物', '细胞', '遗传', '孟德尔', '基因', '光合作用', '生物题', '有丝分裂', '染色体', '生态'],
    sim: '遗传定律搞不懂', rep: { cold: ['看不懂', '放弃吧', '懒得讲'], mid: ['画遗传图解', '先分清显隐性', '记牢分离比'], warm: ['我和你一起画图', '你肯定能搞懂的', '不懂的我都讲给你'] } },
  { id: 'q3_history', t: '历史', role: ['student'], kws: ['历史', '历史年代', '背历史', '时间轴', '历史事件', '历史材料题', '朝代', '历史意义', '历史难', '历史笔记'],
    sim: '历史年代记不住', rep: { cold: ['自己背', '你太懒', '没办法'], mid: ['做时间轴', '按事件串起来', '理解前因后果'], warm: ['我陪你一起理', '你的记忆力很好', '慢慢来不急呀'] } },
  { id: 'q3_geography', t: '地理', role: ['student'], kws: ['地理', '地图', '气候', '经纬网', '地形', '地理题', '洋流', '时区', '区域地理', '地理难'],
    sim: '经纬网分不清', rep: { cold: ['看地图去', '这么简单', '懒得讲'], mid: ['多看图就熟了', '记住几条重要经纬线', '口诀记忆'], warm: ['我陪你看地图', '你方向感很好的', '学会了带你去看世界'] } },
  { id: 'q3_politics', t: '政治', role: ['student'], kws: ['政治', '政治大题', '背书', '时政', '政治知识点', '道法', '主观题', '政治背诵', '政治答题模板', '开卷'],
    sim: '政治大题不会答', rep: { cold: ['抄书去', '背就完了', '懒得说'], mid: ['按知识点分点', '材料+原理', '背答题模板'], warm: ['我帮你整理框架', '你逻辑很好的', '一起背得快'] } },
  { id: 'q3_recite', t: '背书', role: ['student'], kws: ['背书', '背诵', '记不住', '背不下来', '要背的', '背诵任务', '背书好困', '背完了吗', '抽查', '默写'],
    sim: '今天要背的好多', rep: { cold: ['谁让你拖', '慢慢背', '活该'], mid: ['分小段背', '睡前记忆好', '先理解再背'], warm: ['我来抽查你', '你背得又快又好', '背完我给你奖励'] } },
  { id: 'q3_review', t: '复习', role: ['student'], kws: ['复习', '复习计划', '怎么复习', '复习不完', '考前复习', '刷题', '错题本', '查漏补缺', '复习资料', '看不完'],
    sim: '快考试了还没复习', rep: { cold: ['活该', '谁让你玩', '来不及了'], mid: ['先抓重点科目', '做错题最有效', '别慌，还来得及'], warm: ['我陪你一起复习', '按计划来没问题的', '你很努力，一定行'] } },
  { id: 'q3_score', t: '考试分数', role: ['student'], kws: ['分数', '出分', '成绩', '考了多少', '分数出来', '没考好', '考砸', '进步', '退步', '分数线'],
    sim: '这次没考好', rep: { cold: ['你活该', '早干嘛去了', '菜'], mid: ['总结下原因', '一次而已', '下次加油'], warm: ['我一直相信你', '分数不代表全部', '你努力的样子我都看在眼里'] } },
  { id: 'q3_rank', t: '排名', role: ['student'], kws: ['排名', '班级排名', '年级排名', '名次', '排名掉了', '排名上升', '排第几', '光荣榜', '排名表', '年级第几'],
    sim: '排名掉了十名', rep: { cold: ['你不行', '退步了吧', '活该'], mid: ['看看是哪科拖后腿', '排名有波动正常', '稳住心态'], warm: ['你在我心里第一', '下次一定追回来', '我陪你一起分析'] } },
  { id: 'q3_exam', t: '考试', role: ['student'], kws: ['考试', '月考', '期中', '期末', '周测', '单元考', '模拟考', '联考', '统考', '开考'],
    sim: '明天就要考试了', rep: { cold: ['紧张啥', '又考不好', '自找的'], mid: ['早点休息', '把文具准备好', '看看错题'], warm: ['放轻松，你准备得很好', '我给你加油', '考完来见我'] } },
  { id: 'q3_gaokao', t: '高考', role: ['student'], kws: ['高考', '志愿', '选专业', '选大学', '录取', '一本', '二本', '分数线', '高考加油', '高考目标'],
    sim: '高考目标定哪所大学？', rep: { cold: ['想多了', '你考不上', '别做梦'], mid: ['先把分数提上去', '按兴趣选专业', '看看往年位次'], warm: ['你的目标一定能实现', '我陪你冲到高考', '考去哪我都支持你'] } },
  { id: 'q3_xuanke', t: '选科', role: ['student'], kws: ['选科', '物化地', '物化生', '政史地', '文理分科', '选科组合', '赋分', '选考', '学考', '选科纠结'],
    sim: '选科好纠结', rep: { cold: ['随便选', '自己想', '问别人去'], mid: ['按优势科目选', '考虑将来专业', '物化地选择面广'], warm: ['按你喜欢的来', '你地理很好，选它', '不管选啥我都支持你'] } },
  { id: 'q3_homework', t: '作业', role: ['student'], kws: ['作业', '写作业', '作业多', '作业没写完', '交作业', '抄作业', '对答案', '作业堆', '赶作业', '补作业'],
    sim: '今晚作业好多', rep: { cold: ['活该', '谁让你白天玩', '慢慢写'], mid: ['先做会的', '列个顺序', '别分心'], warm: ['我陪你一起写', '写完我给你揉肩', '你写作业的样子真认真'] } },
  { id: 'q3_correct', t: '错题本', role: ['student'], kws: ['错题本', '错题', '整理错题', '错题重做', '粗心', '同类型错', '错题集', '订正', '为什么错', '再错'],
    sim: '同一类题老错', rep: { cold: ['你笨', '不长记性', '活该'], mid: ['把错题归类', '找出错因', '隔几天重做'], warm: ['你已经在进步了', '我们一起把它搞懂', '这次一定不错'] } },
  { id: 'q3_answer_card', t: '答题卡', role: ['student'], kws: ['答题卡', '涂卡', '涂错卡', '答题卡涂错', '机读卡', '2B铅笔', '涂答题卡', '漏涂', '错位', '答题纸'],
    sim: '涂答题卡好怕涂错', rep: { cold: ['细心点', '别犯傻', '活该'], mid: ['做完五个涂一次', '对好题号', '留时间检查'], warm: ['你一向很细心', '别紧张，慢慢来', '相信你不会错的'] } },
  { id: 'q3_morning_read', t: '早读', role: ['student'], kws: ['早读', '晨读', '早读课', '背书声', '早读犯困', '读英语', '读语文', '早读迟到', '早读任务', '齐声朗读'],
    sim: '早读好困', rep: { cold: ['活该熬夜', '站着读', '别睡'], mid: ['洗把冷水脸', '大声读提神', '课间眯一会'], warm: ['想想我就精神啦', '下课我给你带早餐', '你读书声最好听'] } },
  { id: 'q3_evening', t: '晚自习', role: ['student'], kws: ['晚自习', '晚自修', '夜自习', '自习课', '晚自习放学', '晚自习讲话', '自习安静', '晚自习困', '自习效率', '看自习'],
    sim: '晚自习效率好低', rep: { cold: ['别学了', '你太懒', '活该'], mid: ['先列任务清单', '把手机收起来', '番茄钟试试'], warm: ['我陪你一起学', '你认真起来超厉害', '学完我等你'] } },
  { id: 'q3_rollcall', t: '课堂点名', role: ['student'], kws: ['点名', '老师提问', '被点名', '回答问题', '不会回答', '点到我', '举手', '提问我', '被叫起来', '答不上来'],
    sim: '上课被点到答不上来', rep: { cold: ['谁让你没听', '丢脸', '活该'], mid: ['诚实说还在想', '课后补上', '别太在意'], warm: ['没关系，你下次会的', '我教你怎么答', '在我心里你最棒'] } },
  { id: 'q3_delay', t: '老师拖堂', role: ['student'], kws: ['拖堂', '老师拖堂', '占课', '不下课', '占体育课', '占用课间', '又拖堂', '讲完这道', '延迟下课', '占用自习'],
    sim: '老师又拖堂了', rep: { cold: ['忍着', '为你好', '别抱怨'], mid: ['理解一下，内容多', '想上厕所悄悄说', '体育课最常被占'], warm: ['委屈你了，下课我陪你', '别急，我等你', '拖堂的几分钟我都想你'] } },
  { id: 'q3_leave', t: '请假', role: ['student'], kws: ['请假', '请假条', '病假', '事假', '请假回家', '请假不批', '写假条', '请事假', '请病假', '销假'],
    sim: '想请个假', rep: { cold: ['请什么假', '别逃学', '自己找老师'], mid: ['病假要病历', '找班主任签字', '按流程来'], warm: ['需要我陪你吗', '身体要紧', '我帮你想想理由'] } },
  { id: 'q3_skip', t: '旷课', role: ['student'], kws: ['旷课', '逃课', '翘课', '逃学', '旷课被抓', '缺课', '没去上课', '翘课去玩', '点名不到', '缺勤'],
    sim: '想翘一节课', rep: { cold: ['不行', '你敢', '别找我'], mid: ['不建议，会被记', '缺课不好补', '实在不舒服就请假'], warm: ['别逃呀，我会担心的', '乖乖上课，放学见', '你来了我才安心'] } },
  { id: 'q3_stand', t: '罚站', role: ['student'], kws: ['罚站', '罚抄', '被罚', '站后面', '站着上课', '罚抄课文', '罚跑', '被批评', '罚写', '罚站一节课'],
    sim: '今天被老师罚站了', rep: { cold: ['活该', '谁让你犯错', '自找的'], mid: ['下次注意', '态度好点', '别再犯就行'], warm: ['别难过，我心疼你', '改了就好', '我给你带吃的安慰你'] } },
  { id: 'q3_parents_meeting', t: '家长会', role: ['student'], kws: ['家长会', '叫家长', '请家长', '家长来学校', '家长开放日', '家长群', '班主任找家长', '怕家长会', '家长签字', '家访'],
    sim: '下周开家长会', rep: { cold: ['看你表现', '等着挨骂', '活该'], mid: ['最近表现好点', '跟家长提前说', '老师一般说好话'], warm: ['你最近很努力，不怕', '家长会我陪你紧张', '你一直是我的骄傲'] } },
  { id: 'q3_raise_flag', t: '升旗仪式', role: ['student'], kws: ['升旗', '升旗仪式', '升国旗', '唱国歌', '国旗下讲话', '敬礼', '站军姿', '晨会', '升旗迟到', '旗手'],
    sim: '周一升旗要站好久', rep: { cold: ['忍着', '站着别动', '废话'], mid: ['站直，别晃', '吃点早饭防晕', '结束得挺快'], warm: ['升旗时我在想你', '别低血糖，我给你带糖', '你认真的样子真好看'] } },
  { id: 'q3_exercise', t: '课间操', role: ['student'], kws: ['课间操', '广播操', '做操', '眼保健操', '跑操', '做操划水', '做操动作', '体转运动', '体操比赛', '大课间'],
    sim: '做操动作老记不住', rep: { cold: ['跟着做', '你太笨', '活该'], mid: ['看前面的人', '跟着节奏', '多做几遍'], warm: ['我在队伍里偷偷看你', '你做操也可爱', '做错了我不笑你'] } },
  { id: 'q3_sports_meet', t: '运动会', role: ['student'], kws: ['运动会', '校运会', '运动会报名', '接力', '运动会加油', '比赛项目', '田赛', '径赛', '运动会稿子', '运动会开幕式'],
    sim: '运动会我报了一千米', rep: { cold: ['跑你的', '别垫底', '关我什么事'], mid: ['提前练一练', '注意别受伤', '热身做足'], warm: ['我去给你加油', '终点我给你递水', '你在我心里永远是冠军'] } },
  { id: 'q3_art_fest', t: '艺术节', role: ['student'], kws: ['艺术节', '文艺汇演', '晚会', '节目', '上台表演', '彩排', '艺术节节目', '合唱比赛', '文艺委员', '汇演'],
    sim: '艺术节要上台表演', rep: { cold: ['别紧张', '丢人', '自己练'], mid: ['多排练', '深呼吸', '把观众当萝卜'], warm: ['我在台下给你拍照', '你是最亮的星', '你一上台我就只看你'] } },
  { id: 'q3_military', t: '军训', role: ['student'], kws: ['军训', '教官', '站军姿', '踢正步', '军训晒黑', '拉练', '军训汇演', '军训累', '防晒', '军训服'],
    sim: '军训好累还晒黑', rep: { cold: ['忍着', '谁都一样', '别矫情'], mid: ['多喝水', '防晒涂够', '热水泡脚'], warm: ['晒黑了我也喜欢', '我给你送冰饮', '坚持住，我在等你'] } },
  { id: 'q3_spring_trip', t: '春游研学', role: ['student'], kws: ['春游', '秋游', '研学', '研学旅行', '出去玩', '研学报告', '集合', '分组活动', '带零食', '春游分组'],
    sim: '下周要去春游', rep: { cold: ['别去', '浪费钱', '懒得管'], mid: ['带点零食和水', '手机充满电', '分组跟好朋友'], warm: ['跟你一组好不好', '我带好吃的分你', '出去玩也要想着我'] } },
  { id: 'q3_holiday', t: '放假', role: ['student'], kws: ['放假', '寒假', '暑假', '假期', '放假安排', '调休', '补课', '假期作业', '什么时候放假', '假期计划'],
    sim: '什么时候放寒假啊', rep: { cold: ['天天想放假', '别想了', '看日历'], mid: ['按校历走', '调休比较烦', '假期作业不少'], warm: ['放假我天天陪你', '假期我们一起玩', '倒计时我帮你算'] } },
  { id: 'q3_club', t: '社团', role: ['student'], kws: ['社团', '社团招新', '社团活动', '报名社团', '社团社长', '社团课', '社团联', '社团表演', '兴趣社团', '加入社团'],
    sim: '报哪个社团好呢', rep: { cold: ['随便', '别耽误学习', '自己看'], mid: ['按兴趣选', '别报太多', '时间能错开'], warm: ['你报哪个我报哪个', '我们一起参加', '你在哪哪个社团最好'] } },
  { id: 'q3_student_union', t: '学生会', role: ['student'], kws: ['学生会', '学生会竞选', '竞选演讲', '学生干部', '班委', '班长', '团支书', '课代表', '组长', '当干部'],
    sim: '要不要竞选学生会', rep: { cold: ['别去', '累', '没意思'], mid: ['锻炼能力', '看时间够不够', '想清楚再报'], warm: ['你竞选我第一个投票', '你一定能胜任', '你认真负责的样子最帅'] } },
  { id: 'q3_deskmate', t: '同桌', role: ['student'], kws: ['同桌', '换座位', '新同桌', '同桌借东西', '前后桌', '划三八线', '同桌讲话', '同桌吵架', '同桌睡觉', '同桌关系'],
    sim: '我和同桌闹矛盾了', rep: { cold: ['自己解决', '别理他', '活该'], mid: ['主动说句话', '各退一步', '找老师换座'], warm: ['别不开心，有我呢', '同桌哪有我重要', '我永远站你这边'] } },
  { id: 'q3_paper_note', t: '传纸条', role: ['student'], kws: ['传纸条', '小纸条', '纸条', '写纸条', '递纸条', '纸条被抓', '上课传纸条', '纸条内容', '小纸条聊天', '扔纸条'],
    sim: '上课想给你传纸条', rep: { cold: ['别传', '认真听讲', '会被抓'], mid: ['小心老师', '下课再说', '别太明显'], warm: ['纸条上写我喜欢你', '收到你的纸条我会开心一整天', '你写的我都收藏'] } },
  { id: 'q3_bestie', t: '闺蜜兄弟', role: ['student'], kws: ['闺蜜', '好兄弟', '死党', '好朋友', '最好的朋友', '姐妹', '哥们', '挚友', '友谊', '好朋友闹掰'],
    sim: '我和闺蜜吵架了', rep: { cold: ['正常', '别理她', '自己的事'], mid: ['冷静几天', '把话说开', '换位思考'], warm: ['我也是你的依靠呀', '你还有我呢', '和好的朋友才长久'] } },
  { id: 'q3_jealous', t: '吃醋', role: ['student'], kws: ['吃醋', '你和别人', '嫉妒', '吃醋了', '酸了', '你跟别人说话', '不理我', '醋坛子', '嫉妒你朋友', '你是不是喜欢别人'],
    sim: '看到你和别人说话我吃醋了', rep: { cold: ['小心眼', '随便你', '懒得理'], mid: ['那是普通朋友', '你想多了', '别多想'], warm: ['我只喜欢你呀', '我和别人保持距离', '你吃醋的样子好可爱'] } },
  { id: 'q3_gift', t: '送礼物', role: ['student'], kws: ['送礼物', '生日礼物', '礼物', '选礼物', '送什么好', '纪念日礼物', '买礼物', '礼物推荐', '心意', '回礼'],
    sim: '你生日快到了，送你什么好？', rep: { cold: ['不用', '随便', '别浪费钱'], mid: ['心意最重要', '实用点的好', '看看我喜欢啥'], warm: ['你在就是最好的礼物', '你送的我都喜欢', '只要是你挑的我都珍藏'] } },
  { id: 'q3_birthday', t: '生日', role: ['student'], kws: ['生日', '生日快乐', '过生日', '生日蛋糕', '生日愿望', '生日惊喜', '生日party', '寿星', '生日怎么过', '生日歌'],
    sim: '我生日快到了', rep: { cold: ['哦', '不记得', '随便'], mid: ['想要什么礼物', '约朋友一起', '吃个蛋糕'], warm: ['生日快乐！我提前给你准备惊喜', '你出生的日子我最想庆祝', '想陪你过以后每个生日'] } },
  { id: 'q3_love_letter', t: '写情书', role: ['student'], kws: ['情书', '写情书', '表白信', '告白', '表白', '怎么表白', '表白被拒', '表白方式', '写情书怎么写', '表白语'],
    sim: '想给喜欢的人写情书', rep: { cold: ['别写', '会被笑', '直接说'], mid: ['真诚最重要', '别太肉麻', '选个合适的时机'], warm: ['就写我喜欢你，简单直接', '我教你，其实我也想收到', '你写的一定最打动人'] } }
);

/* ===== x5513_ai_b.js ===== */
/* ============================================================
   5.5.13 · 第 5 模块（B）：AI 题库第三批扩容（情绪/潮流/生活）
   ============================================================ */
QS3.push(
  { id: 'q3_tuoyan', t: '拖延', role: ['student'], kws: ['拖延', '拖延症', '拖到最后', '不想开始', '一直拖', '明日复明日', '拖延作业', '戒拖延', '磨蹭', '拖到深夜'],
    sim: '作业又拖到最后一刻', rep: { cold: ['活该', '没救了', '自找的'], mid: ['先做五分钟', '番茄钟', '关掉手机'], warm: ['现在开始还来得及', '我陪你一起做', '你可以的，别自责'] } },
  { id: 'q3_neijuan', t: '内卷', role: ['student'], kws: ['内卷', '太卷了', '卷王', '大家都在卷', '卷不动', '躺平', '摆烂', '偷偷学', '卷起来', '卷死'],
    sim: '班里大家都好卷', rep: { cold: ['那你也卷', '别摆烂', '没用的'], mid: ['按自己节奏来', '别被别人带焦虑', '比昨天的自己好就行'], warm: ['你不需要和别人比', '你已经很努力了', '累了就休息，我陪着你'] } },
  { id: 'q3_nixi', t: '逆袭', role: ['student'], kws: ['逆袭', '翻盘', '进步', '从差到好', '逆袭故事', '后来居上', '追赶', '提分', '弯道超车', '咸鱼翻身'],
    sim: '我想从倒数逆袭', rep: { cold: ['做梦', '不可能', '太晚了'], mid: ['从最基础的补', '每天进步一点', '坚持最重要'], warm: ['我相信你一定能逆袭', '你有这个潜力', '我陪你一起翻盘'] } },
  { id: 'q3_zilv', t: '自律', role: ['student'], kws: ['自律', '自律打卡', '计划表', '早睡早起', '自我管理', '坚持不下去', '自律方法', '管住自己', '打卡', '养成习惯'],
    sim: '总想玩手机，自律不了', rep: { cold: ['没毅力', '你不行', '活该'], mid: ['手机放到另一个房间', '把目标拆小', '找个打卡伙伴'], warm: ['我当你的监督员', '慢慢来，我陪你', '你每坚持一天我都为你高兴'] } },
  { id: 'q3_shekong', t: '社恐', role: ['student'], kws: ['社恐', '内向', '不敢说话', '害怕社交', 'i人', 'e人', '人多紧张', '不敢举手', '回避社交', '社恐发作'],
    sim: '我有点社恐', rep: { cold: ['胆子大点', '没出息', '自己改'], mid: ['内向不是缺点', '先从点头微笑开始', '慢慢适应'], warm: ['在我面前你不用紧张', '你安静的样子我也喜欢', '我带你慢慢变勇敢'] } },
  { id: 'q3_maobi', t: '容貌焦虑', role: ['student'], kws: ['容貌焦虑', '长得不好看', '颜值', '身材焦虑', '长胖', '减肥', '长痘', '脸大', '不好看', '自卑长相'],
    sim: '最近长痘，好焦虑', rep: { cold: ['别矫情', '那就保养', '想多了'], mid: ['青春期正常，少熬夜', '注意饮食作息', '别老盯着镜子'], warm: ['你怎样都好看', '我喜欢你的全部', '你笑起来最好看'] } },
  { id: 'q3_mimang', t: '迷茫', role: ['student'], kws: ['迷茫', '不知道干什么', '没目标', '没方向', '未来', '想不清楚', '理想', '为了什么', '人生目标', '没有梦想'],
    sim: '对未来好迷茫', rep: { cold: ['想那么多', '谁不迷茫', '先读书'], mid: ['先把手头的事做好', '多尝试才知道', '目标会慢慢清晰'], warm: ['不用急，我陪你一起找', '你本身就很优秀', '不管未来怎样我都在'] } },
  { id: 'q3_mengxiang', t: '梦想职业', role: ['student'], kws: ['梦想', '想当什么', '理想职业', '长大做什么', '职业', '梦想工作', '想做的工作', '兴趣职业', '未来想做', '志向'],
    sim: '长大以后你想做什么？', rep: { cold: ['随便', '没想过', '不现实'], mid: ['结合兴趣和能力', '先了解那个职业', '先考上对口大学'], warm: ['你想做什么我都支持', '你认真追梦的样子最帅', '我陪你把梦想变成现实'] } },
  { id: 'q3_kuajiang', t: '夸奖', role: ['student'], kws: ['夸夸我', '鼓励我', '表扬我', '夸我', '求夸', '我棒吗', '夸我一句', '支持我', '给我力量', '没信心'],
    sim: '今天有点丧，夸夸我吧', rep: { cold: ['没什么好夸', '自己加油', '懒得夸'], mid: ['你今天也很努力', '坚持到现在已经很棒', '你比想象中厉害'], warm: ['你是我见过最棒的人', '你的光芒别人都挡不住', '在我这里你永远满分，抱抱'] } },
  { id: 'q3_biaoyan', t: '被批评', role: ['student'], kws: ['被批评', '被老师说', '被骂', '受委屈', '批评我', '冤枉', '背锅', '不是我的错', '被误解', '被指责'],
    sim: '今天被老师冤枉了', rep: { cold: ['忍着', '解释也没用', '活该'], mid: ['找合适时机解释', '别和老师顶', '把事实讲清楚'], warm: ['我相信你，委屈就跟我说', '我永远站你这边', '走，我陪你去找老师说'] } },
  { id: 'q3_zhouji', t: '网络热梗', role: ['student'], kws: ['热梗', '梗', '什么梗', '网络热词', '流行语', '爆梗', '笑死', '梗图', '热梗百科', '新词'],
    sim: '这个梗是什么意思？', rep: { cold: ['自己搜', '我不知道', '别老看梗'], mid: ['你说说我猜猜', '可能是网上的梗', '梗更新太快'], warm: ['你教我呀，我想和你有共同话题', '为了和你聊天我恶补热梗', '你说的梗我都觉得好笑'] } },
  { id: 'q3_biaoqing', t: '表情包', role: ['student'], kws: ['表情包', '斗图', 'emoji', '发表情', '熊猫头', '表情包收藏', '存图', '搞笑图', '动图', '表情包大战'],
    sim: '来斗图啊', rep: { cold: ['不斗', '没图', '幼稚'], mid: ['我图不多', '放马过来', '你先发'], warm: ['你发的每个表情包我都想收藏', '你就是我最好的表情包', '斗图我认输，你赢了我的心'] } },
  { id: 'q3_duanshipin', t: '短视频', role: ['student'], kws: ['短视频', '刷视频', '刷手机', '刷到停不下来', '视频软件', '推荐算法', '一刷就停不下来', '看视频', '直播', '博主'],
    sim: '昨晚刷短视频到两点', rep: { cold: ['活该困', '没自控力', '自己找的'], mid: ['设个使用时限', '睡前别刷', '调个闹钟'], warm: ['别熬太晚，我心疼', '以后我们互相监督', '早点睡，梦里我陪你'] } },
  { id: 'q3_zhuixing', t: '追星', role: ['student'], kws: ['追星', '偶像', '明星', '爱豆', '饭圈', '偶像的歌', '演唱会', '应援', '偶像新专辑', '偶像塌房'],
    sim: '我有个特别喜欢的偶像', rep: { cold: ['别追了', '没用', '幼稚'], mid: ['向优秀的地方学习', '别影响学习', '理性追星'], warm: ['你追的偶像很优秀，你也一样', '陪你一起听他的歌', '你是我唯一的偶像'] } },
  { id: 'q3_manhua', t: '动漫二次元', role: ['student'], kws: ['动漫', '番剧', '漫画', '二次元', '追番', '新番', 'cos', 'cosplay', '手办', '谷子'],
    sim: '最近在追一部新番', rep: { cold: ['幼稚', '别看了', '没兴趣'], mid: ['哪部？什么类型', '别熬夜追', '完结了再看'], warm: ['你喜欢的角色我都记住', '你cos一定很好看', '你喜欢的世界我也想了解'] } },
  { id: 'q3_cp', t: '嗑CP', role: ['student'], kws: ['磕cp', 'cp', '嗑糖', '这对好甜', '官配', '磕到了', 'be', 'he', '同人', '磕cp好快乐'],
    sim: '我最近磕的CP太甜了', rep: { cold: ['无聊', '假的', '不理解'], mid: ['开心就好', '别太上头', '是哪对'], warm: ['你磕的CP哪有我们甜', '我可以只做你的糖吗', '现实中我们就是最甜的一对'] } },
  { id: 'q3_mbti', t: 'MBTI', role: ['student'], kws: ['mbti', '人格测试', 'i人', 'e人', 'entp', 'intp', '人格', '16型人格', '你是什么人格', '人格类型'],
    sim: '我测出来是 i 人', rep: { cold: ['不准', '没意义', '别信'], mid: ['就当参考', 'i人也有优势', '挺有意思的'], warm: ['不管你是什么人格，我都喜欢你', '你是我心中最特别的人格', '我愿意为你变 e'] } },
  { id: 'q3_xingzuo', t: '星座', role: ['student'], kws: ['星座', '什么星座', '星座运势', '星座配对', '水逆', '十二星座', '星座性格', '星座合不合', '金牛座', '双子座'],
    sim: '你是什么星座？', rep: { cold: ['不信', '迷信', '无聊'], mid: ['图个乐', '我是某座', '星座就当参考'], warm: ['不管星座合不合，我们都合', '为了你我愿意相信星座', '你是我命中注定的那座'] } },
  { id: 'q3_guitar', t: '吉他', role: ['student'], kws: ['吉他', '练吉他', '弹吉他', '和弦', '吉他指弹', '学吉他', '吉他手', '弹唱', '吉他谱', '横按'],
    sim: '我在学吉他', rep: { cold: ['三分钟热度', '吵', '别弹了'], mid: ['手指疼过了就好', '每天练一会', '先学简单的曲子'], warm: ['你弹吉他的样子最帅', '我想听你弹一首情歌', '你练琴我就在旁边听'] } },
  { id: 'q3_piano', t: '钢琴', role: ['student'], kws: ['钢琴', '练琴', '弹琴', '钢琴曲', '琴键', '考级', '指法', '钢琴课', '五线谱', '钢琴难'],
    sim: '钢琴考级好紧张', rep: { cold: ['紧张啥', '练得不够', '别考了'], mid: ['多练几遍', '上台前深呼吸', '平时当考试'], warm: ['我当你的第一个听众', '你弹琴的样子超优雅', '考完我给你庆祝'] } },
  { id: 'q3_dance', t: '跳舞', role: ['student'], kws: ['跳舞', '舞蹈', '街舞', '爵士', '练舞', '排舞', '舞蹈动作', '舞社', '舞蹈课', '跳舞协调性'],
    sim: '我在学街舞', rep: { cold: ['你不行', '别丢人', '没兴趣'], mid: ['多练基础', '数拍子', '协调性会越来越好'], warm: ['你跳舞一定超帅', '想看你为我跳一支', '你努力的样子最迷人'] } },
  { id: 'q3_basketball', t: '篮球', role: ['student'], kws: ['篮球', '打球', '投篮', '运球', '三分球', '上篮', '篮球场', '篮球赛', '打篮球', '球鞋'],
    sim: '放学一起打球吗', rep: { cold: ['不去', '你太菜', '累'], mid: ['好啊，打几场', '打后卫行吗', '注意别受伤'], warm: ['你打球，我在旁边看你', '进球第一个想看见你', '你打球的样子我移不开眼'] } },
  { id: 'q3_badminton', t: '羽毛球', role: ['student'], kws: ['羽毛球', '打羽毛球', '羽毛球拍', '杀球', '发球', '羽毛球馆', '双打', '羽毛球比赛', '羽毛球约', '拉吊'],
    sim: '周末打羽毛球吗', rep: { cold: ['不去', '不会', '累'], mid: ['好啊，我水平一般', '带个备用拍', '打个双打'], warm: ['我喂你球好不好', '你扣杀我捡球', '和你打球我都故意输给你'] } },
  { id: 'q3_swim', t: '游泳', role: ['student'], kws: ['游泳', '游泳课', '换气', '蛙泳', '自由泳', '游泳馆', '怕水', '游泳装备', '学游泳', '游泳考试'],
    sim: '我学不会换气', rep: { cold: ['怕水就别学', '多练', '胆小'], mid: ['先在浅水区练', '头埋水再吐气', '放松别紧张'], warm: ['我在岸上看着你', '你一定能学会', '别怕，有我在呢'] } },
  { id: 'q3_skateboard', t: '滑板', role: ['student'], kws: ['滑板', '滑滑板', 'ollie', '双翘', '长板', '滑板入门', '滑板摔', '滑板技巧', '刷街', '平衡'],
    sim: '我想学滑板', rep: { cold: ['危险', '别摔', '不务正业'], mid: ['戴好护具', '先练滑行平衡', '别急着练动作'], warm: ['你滑起来一定很帅', '注意安全别让我担心', '你敢尝试新事物真酷'] } },
  { id: 'q3_boardgame', t: '桌游剧本杀', role: ['student'], kws: ['剧本杀', '密室', '狼人杀', '桌游', '玩桌游', '剧本', '推理', '密室逃脱', '组团', '桌游店'],
    sim: '周末去玩剧本杀吗', rep: { cold: ['不去', '费钱', '没意思'], mid: ['选个简单的本', '凑够人再去', '玩推理还是情感'], warm: ['和你一起玩最好', '我当你队友', '你推理时超聪明'] } },
  { id: 'q3_calligraphy', t: '书法练字', role: ['student'], kws: ['书法', '练字', '写字', '字帖', '硬笔', '毛笔', '练字帖', '写字难看', '硬笔字', '书法课'],
    sim: '我字写得好丑', rep: { cold: ['那也是', '多练', '没救'], mid: ['每天临帖十分钟', '先练结构', '握笔姿势要对'], warm: ['你的字很有特点', '你认真写就很好看', '你写的名字我都想收藏'] } },
  { id: 'q3_weather', t: '天气', role: ['student'], kws: ['天气', '下雨', '降温', '升温', '台风', '高温', '天气预报', '变天', '冷空气', '闷热'],
    sim: '明天好像要下雨', rep: { cold: ['自己看', '带伞', '关我什么事'], mid: ['记得带伞', '降温加件外套', '台风天别出门'], warm: ['我提醒你带伞', '淋不到你，我护着', '下雨正好和你共撑一把伞'] } },
  { id: 'q3_coffee', t: '提神', role: ['student'], kws: ['咖啡', '提神', '犯困', '好困', '红牛', '美式', '困死了', '上课困', '不困', '咖啡提神'],
    sim: '上课好困，喝什么提神', rep: { cold: ['活该睡太晚', '掐自己', '别喝'], mid: ['黑咖啡管用', '课间洗把脸', '站着听一会'], warm: ['别喝太多伤胃', '下课我陪你走走', '我给你带杯热饮'] } },
  { id: 'q3_nap', t: '午睡', role: ['student'], kws: ['午睡', '午休', '趴桌睡', '睡午觉', '午休睡不醒', '午睡流口水', '午觉', '中午犯困', '趴睡', '午睡压手'],
    sim: '午睡醒来更困了', rep: { cold: ['别睡', '睡太多', '活该'], mid: ['睡二十分钟正好', '别趴着压手臂', '醒后洗把脸'], warm: ['没睡好让我给你揉揉肩', '你睡着的样子好可爱', '醒了先看看我提提神'] } },
  { id: 'q3_breakfast', t: '早餐', role: ['student'], kws: ['早餐', '早饭', '没吃早餐', '早餐吃什么', '早餐店', '豆浆油条', '包子', '早自习来不及', '不吃早餐', '早点'],
    sim: '今天没吃早餐', rep: { cold: ['饿着', '活该起晚', '自己解决'], mid: ['包里备点面包', '课间补充能量', '长期不吃不好'], warm: ['我分你一半', '明天我帮你带', '你饿肚子我会心疼'] } },
  { id: 'q3_snack', t: '小卖部', role: ['student'], kws: ['小卖部', '超市', '买零食', '零食', '辣条', '薯片', '买水', '校园超市', '排队', '小卖部挤'],
    sim: '课间去小卖部吗', rep: { cold: ['不去', '你自己去', '没钱'], mid: ['好啊，人多赶紧', '你请我就去', '看看有什么'], warm: ['你想吃什么我买给你', '我帮你排队', '分你一半零食'] } },
  { id: 'q3_milktea', t: '奶茶', role: ['student'], kws: ['奶茶', '喝奶茶', '点奶茶', '奶茶店', '全糖', '珍珠', '芋圆', '奶茶热量', '请喝奶茶', '奶茶拼单'],
    sim: '想喝奶茶了', rep: { cold: ['胖死你', '别喝', '没钱'], mid: ['少糖吧', '拼单更划算', '偶尔喝一杯'], warm: ['我请你喝，全糖去冰', '你比奶茶还甜', '我们一起拼单'] } },
  { id: 'q3_allowance', t: '零花钱', role: ['student'], kws: ['零花钱', '压岁钱', '钱不够', '省钱', '生活费', '存钱', '钱花完了', '没钱了', '攒钱', '零花钱不够'],
    sim: '这个月零花钱花完了', rep: { cold: ['活该乱花', '省着点', '我没有'], mid: ['记个账', '分清需要和想要', '留点应急'], warm: ['需要的话我帮你', '我们一起存钱', '钱不够我请你'] } },
  { id: 'q3_parttime', t: '兼职', role: ['student'], kws: ['兼职', '打工', '做兼职', '暑假工', '发传单', '家教', '赚零花钱', '实习', '临时工', '兼职体验'],
    sim: '暑假想去做兼职', rep: { cold: ['别耽误学习', '很累', '没意义'], mid: ['家教挺合适', '注意安全', '别去太辛苦的'], warm: ['体验一下挺好，我支持你', '别太累，照顾好自己', '你想做的我都陪你规划'] } },
  { id: 'q3_school_card', t: '校园卡', role: ['student'], kws: ['校园卡', '饭卡', '充饭卡', '饭卡没钱', '卡丢了', '挂失', '饭卡余额', '水卡', '一卡通', '充值'],
    sim: '饭卡又没钱了', rep: { cold: ['省着点', '自己充', '活该'], mid: ['机器上就能充', '别一次充太多', '丢了赶紧挂失'], warm: ['我请你吃饭', '需要的话先借你', '你卡丢了我帮你一起找'] } },
  { id: 'q3_dorm_chase', t: '宿管', role: ['student'], kws: ['宿管', '查寝', '宿舍阿姨', '宿管大爷', '晚归', '回宿舍', '锁门', '宿舍关门', '查夜', '宿舍登记'],
    sim: '今晚回来晚了怕被查寝', rep: { cold: ['活该', '早点回', '别想溜'], mid: ['跟阿姨说一声', '走登记流程', '别翻墙'], warm: ['注意安全，我送你到宿舍', '别让我担心', '到了给我发消息'] } },
  { id: 'q3_laundry', t: '洗衣服', role: ['student'], kws: ['洗衣服', '洗衣服', '手洗', '洗衣机', '晾衣服', '衣服没干', '袜子', '住校洗衣服', '洗衣房', '校服脏'],
    sim: '住校洗衣服好麻烦', rep: { cold: ['懒', '自己的事自己做', '惯的'], mid: ['攒一起用洗衣机', '浅色深色分开', '阴天多备几件'], warm: ['我帮你想办法', '你别累着', '你手冻着我心疼'] } },
  { id: 'q3_roommate', t: '室友相处', role: ['student'], kws: ['室友', '室友打呼', '室友吵', '宿舍关系', '作息不一样', '室友熬夜', '舍友', '室友矛盾', '宿舍矛盾', '室友带饭'],
    sim: '室友晚上太吵睡不着', rep: { cold: ['忍着', '耳塞', '自己解决'], mid: ['好好沟通定个时间', '戴耳塞', '买个眼罩'], warm: ['别委屈自己，我教你怎么说', '睡不好我会心疼', '需要我帮你想办法吗'] } },
  { id: 'q3_broadcast', t: '校园广播', role: ['student'], kws: ['广播', '校园广播', '广播稿', '点歌', '广播站', '广播台', '播音员', '广播点歌', '广播放歌', '通知'],
    sim: '我想给你点一首歌', rep: { cold: ['不用', '幼稚', '别点'], mid: ['去广播站点', '点我们都喜欢的', '看看怎么点'], warm: ['点给我？我一定准时听', '我也想为你点一首歌', '你的声音应该去当播音员'] } },
  { id: 'q3_recess', t: '课间', role: ['student'], kws: ['课间', '下课', '课间十分钟', '去厕所', '接水', '课间休息', '走廊', '下课铃', '下节课', '课间打闹'],
    sim: '课间十分钟根本不够用', rep: { cold: ['习惯了', '别乱跑', '坐着'], mid: ['先上厕所再接水', '预备铃前回来', '少走远'], warm: ['课间我去找你', '能见你一面十分钟也值', '我在走廊等你'] } },
  { id: 'q3_waterfountain', t: '接水', role: ['student'], kws: ['饮水机', '接水', '打水', '热水', '直饮水', '排队接水', '水卡', '没热水', '接水烫', '饮水处'],
    sim: '饮水机前排好长队', rep: { cold: ['等会', '自己排队', '急什么'], mid: ['错峰去接', '大瓶一次接满', '注意烫手'], warm: ['我帮你排队打水', '你坐着我去接', '小心烫，我帮你'] } },
  { id: 'q3_lost', t: '丢东西', role: ['student'], kws: ['丢了', '找不到', '东西丢了', '丢东西', '丢了笔', '丢了钥匙', '丢了水杯', '落在哪', '失物招领', '找回'],
    sim: '我钥匙找不到了', rep: { cold: ['丢三落四', '自己找', '活该'], mid: ['去失物招领看看', '想想最后在哪用', '问问同学'], warm: ['别急，我帮你一起找', '找不着我陪你配新的', '你别太着急，有我呢'] } },
  { id: 'q3_borrow', t: '借钱', role: ['student'], kws: ['借钱', '借我钱', '没钱了借点', '借两块', '周转', '借钱不还', '借钱给同学', '借饭卡', '欠钱', '要钱'],
    sim: '同学找我借钱', rep: { cold: ['别借', '自己都不够', '拒绝'], mid: ['量力而行', '了解用途', '亲兄弟明算账'], warm: ['如果对方真需要，小金额可以帮', '别为难自己', '钱的事我们一起想'] } },
  { id: 'q3_cheer', t: '加油打气', role: ['student'], kws: ['加油', '我好累', '坚持不住', '撑不住了', '没动力', '想放弃', '鼓励', '我可以吗', '太难了', '没有力气'],
    sim: '最近真的撑不住了', rep: { cold: ['谁不累', '矫情', '别放弃'], mid: ['休息一下再继续', '把目标拆小', '一步一步来'], warm: ['你已经做得很好了，我陪着你', '抱抱，累了就靠着我', '无论怎样我都在，别一个人扛'] } },
  { id: 'q3_thanks', t: '感谢', role: ['student'], kws: ['谢谢', '谢谢你', '感谢', '多亏有你', '有你真好', '谢谢陪伴', '谢谢你帮我', '太感谢了', '谢谢你在', '感恩'],
    sim: '有你真好', rep: { cold: ['客气', '没什么', '别谢'], mid: ['不客气', '应该的', '互相帮助嘛'], warm: ['能陪你我才最幸福', '以后也一直在你身边', '不用谢，你开心我就开心'] } },
  { id: 'q3_goodnight', t: '晚安', role: ['student'], kws: ['晚安', '睡觉了', '睡了', '去睡', '早点睡', '梦里见', '晚安安', '睡觉', '准备睡', '困了去睡'],
    sim: '我要睡啦', rep: { cold: ['嗯', '睡吧', '晚安'], mid: ['晚安，明天见', '盖好被子', '别熬夜'], warm: ['晚安，梦里要有我', '我会想你到睡着', '你睡好，我替你守着夜'] } },
  { id: 'q3_goodmorning', t: '早安', role: ['student'], kws: ['早安', '早上好', '早啊', '醒了', '起床了', '新的一天', '早', 'morning', '起来了', '早上好呀'],
    sim: '早上好！', rep: { cold: ['早', '嗯', '别吵'], mid: ['早，吃早饭没', '今天加油', '醒啦'], warm: ['早安，一睁眼就想你', '今天也为你打气', '阳光和你都在，真好'] } }
);

/* 去重合并（id 与关键词都不覆盖旧库） */
function mergeExtraIntents3() {
  try {
    if (typeof XZ_AI_INTENTS === 'undefined') return;
    var have = {};
    for (var i = 0; i < XZ_AI_INTENTS.length; i++) have[XZ_AI_INTENTS[i].id] = 1;
    var added = 0;
    for (var j = 0; j < QS3.length; j++) {
      if (!have[QS3[j].id]) { XZ_AI_INTENTS.push(QS3[j]); added++; }
    }
    window.__xz13_ai_added = (window.__xz13_ai_added || 0) + added;
    console.log('[5.5.13] AI 题库第三批新增 ' + added + ' 个意图，总计 ' + XZ_AI_INTENTS.length);
  } catch (e) { console.warn('[5.5.13] AI 合并失败', e); }
}
XZ13.inits.push(function () {
  mergeExtraIntents3();
  // 库可能由补丁晚加载，做几次延迟补偿
  var n = 0;
  var t = setInterval(function () {
    mergeExtraIntents3();
    if (++n > 20) clearInterval(t);
  }, 500);
});

/* ===== x5513_ai_c.js ===== */
/* ============================================================
   5.5.13 · 第 5 模块（C）：AI 意图第四批（校园场景细化）
   ============================================================ */
var QS4 = [];
function a4(id, t, kws, sim, cold, mid, warm) {
  QS4.push({ id: id, t: t, role: ['student'], kws: kws, sim: sim, rep: { cold: [cold], mid: [mid], warm: [warm] } });
}

a4('q4_zaodu', '早读', ['早读', '晨读', '背书', '早自习'], '早读好困读不进怎么办',
  '读不进就先读，张嘴就行。', '先读要默写的重点，出声读容易集中。', '陪你一起读，咱们一段一段来，你背一句我听一句！'),
a4('q4_wanxi', '晚自习', ['晚自习', '晚自修', '自习到很晚'], '晚自习怎么安排',
  '安静写作业就行。', '先做难的，再做抄写类，最后留时间背。', '把晚自习排个小计划，搞定一项划掉一项，超有成就感！'),
a4('q4_zuo13', '课堂笔记', ['课堂笔记', '记笔记', '做笔记', '板书'], '笔记怎么记',
  '记重点就行。', '老师反复讲的和板书框架要记，别整句抄。', '我教你用「关键词+箭头」记，课后再补全，又快又清楚！'),
a4('q4_cuotiben', '错题本', ['错题本', '错题', '订正', '错题整理'], '错题本怎么用',
  '抄下来重做。', '错题要写清错因和正确思路，定期重做。', '把错题按知识点分类，考前专攻它们，提分最快！'),
a4('q4_yuxi', '预习', ['预习', '提前看'], '预习有必要吗',
  '有空就看看。', '预习重点是标出不懂的地方，上课专听。', '我陪你快速过一遍明天的内容，标三个疑问点，上课就有目标啦！'),
a4('q4_fuxi', '复习', ['复习', '巩固', '回顾'], '怎么复习高效',
  '多看几遍。', '先回忆再翻书，用自测代替反复读。', '咱们用「合上书复述」的方法，你讲给我听，我帮你查漏！'),
a4('q4_moxie', '默写', ['默写', '听写', '默错', '语文默写'], '默写总错怎么办',
  '多写几遍。', '错的字单独抄，隔天再默一次。', '把易错字做成记忆卡，工具箱里就能练，几天就记住！'),
a4('q4_yanbaocao', '眼保健操', ['眼保健操', '眼操', '揉眼睛'], '要做眼保健操吗',
  '跟着做就行。', '认真做对穴位能放松，别睁眼别偷懒。', '来，闭眼跟我数拍子，做完眼睛清亮亮的～'),
a4('q4_guangbo', '广播体操', ['广播体操', '早操', '做操', '课间操'], '广播体操不想做',
  '规定动作还是要做。', '活动开了下午更精神，动作标准点。', '就当伸展放松啦，我陪你数八拍，做完超舒服！'),
a4('q4_shengqi', '升旗', ['升旗', '升旗仪式', '国旗'], '升旗要注意什么',
  '肃立行注目礼。', '穿校服、站姿端正，保持安静。', '仪式感拉满，站好行注目礼，这是每周的庄重时刻。'),
a4('q4_yundonghui', '运动会', ['运动会', '校运会', '运动会报名', '跑步比赛'], '运动会报什么项目',
  '看自己擅长的。', '短跑靠爆发，长跑靠耐力，报你练过的。', '告诉我你想冲成绩还是图开心，我帮你挑项目还陪你练！'),
a4('q4_chunyou', '春游秋游', ['春游', '秋游', '研学', '校外实践'], '春游带什么',
  '带水和零食。', '水、垫肚子的、雨具、垃圾袋，轻装。', '我帮你列个春游清单，零食分好类，咱们玩得开心又不丢东西！'),
a4('q4_junxun', '军训', ['军训', '拉练', '军姿'], '军训累吗',
  '都要经历的。', '防晒补水，动作听指挥，咬牙就过去了。', '我给你打气！站军姿就当锻炼意志，晚上咱们聊放松～'),
a4('q4_xiaofu', '校服', ['校服', '校牌', '穿校服', '校徽'], '一定要穿校服吗',
  '学校规定就穿。', '升旗、检查日必须穿，平时按规定。', '穿校服其实省得纠结穿搭，把校牌别好，清爽又统一～'),
a4('q4_zhiri', '值日', ['值日', '扫地', '擦黑板', '搞卫生'], '值日怎么偷懒',
  '该做还是要做。', '分工明确，干完就走，别拖。', '咱们快速分工，你擦黑板我（精神上）陪你，几分钟搞定！'),
a4('q4_dasaochu', '大扫除', ['大扫除', '班级卫生', '打扫教室'], '大扫除累',
  '集体劳动都一样。', '分到具体任务专心做，比抢着干强。', '把大扫除当成给教室「换皮肤」，干完窗明几净心情好！'),
a4('q4_jiazhanghui', '家长会', ['家长会', '家长来', '叫家长'], '怕开家长会',
  '平常心。', '平时表现如实反映，没大问题不用慌。', '你最近进步我都看在眼里，我帮你整理亮点，家长会上你也有底气！'),
a4('q4_pingjiang', '评奖评优', ['评奖', '评优', '三好学生', '奖状'], '怎么评三好学生',
  '看成绩和表现。', '成绩、纪律、活动综合看，平时要稳。', '咱们把每个维度都提一提，期末你也能把奖状抱回家！'),
a4('q4_shitang', '食堂', ['食堂', '打饭', '窗口', '排队打饭'], '食堂吃什么好',
  '吃饱就行。', '荤素搭配，别总吃油炸。', '今天我帮你配：一荤一素一汤，吃完还能给窗口点个赞！'),
a4('q4_paidui', '排队', ['排队', '插队', '加塞'], '有人插队怎么办',
  '让一下算了。', '可以提醒他排队，语气平和点。', '别生气，笑着指一下队伍尾部，既不伤和气又守住规矩。'),
a4('q4_tushuguan', '图书馆', ['图书馆', '借书', '图书角', '还书'], '怎么借书',
  '按馆里规定登记。', '记住还书日期，别超期。', '挑本喜欢的书，我帮你记着还书时间，读完一起聊内容！'),
a4('q5_zixi', '自习纪律', ['自习纪律', '自习吵', '课堂吵', '纪律差'], '自习太吵学不进',
  '忍一忍。', '可以轻声提醒，或找老师反映。', '戴上耳塞专注自己的，我陪你心里默念计划，把噪音挡在外面～'),
a4('q4_xinxi', '信息课', ['信息课', '电脑课', '微机课', '机房'], '信息课好玩吗',
  '认真学操作。', '学会基础软件和打字，以后用得上。', '完成任务后还能练打字，我教你几个快捷键，全班最快！'),
a4('q4_meishu', '美术课', ['美术课', '画画', '绘画', '水彩'], '不会画画怎么办',
  '照着画就行。', '大胆下笔，先抓大形再抠细节。', '画画没有标准答案，我陪你从最简单的线稿开始，越画越有信心！'),
a4('q4_yinyue', '音乐课', ['音乐课', '唱歌课', '视唱', '简谱'], '音乐课不敢唱',
  '跟着大家一起唱。', '声音小没关系，先跟唱找音准。', '在游戏里的 K 歌练几次，下次音乐课你就敢大声唱啦！'),
a4('q4_tiyu', '体育课', ['体育课', '体活', '体锻', '跑步'], '体育课怕跑圈',
  '都要跑。', '调整呼吸节奏，循序渐进，别一上来猛冲。', '我帮你定个小目标，这周多跑半圈，下周你会发现轻松不少！'),
a4('q4_qingjin', '请假', ['请假', '病假', '事假', '请个假'], '怎么请假',
  '按流程找老师。', '病假让家长说明，事后补假条。', '需要的话我帮你拟一段清楚的请假说明，发给老师礼貌又得体。'),
a4('q4_shetuan', '社团', ['社团', '社团招新', '社团活动', '兴趣小组'], '加哪个社团好',
  '看兴趣。', '选你愿意长期投入的，别贪多。', '说说你的兴趣，我帮你匹配最适合的社团，说不定还能交到好朋友！'),
a4('q4_jingsai', '竞赛', ['竞赛', '比赛', '学科竞赛', '奥赛'], '要不要参加竞赛',
  '有余力再去。', '先把课内稳住，竞赛当拓展。', '想挑战的话我陪你找资料刷题，从一道好题开始，慢慢上手！'),
a4('q4_yanjiang', '演讲', ['演讲', '上台讲', '发言', '当众讲话'], '演讲紧张怎么办',
  '讲完就好了。', '把开头背熟，看着熟人，放慢语速。', '我陪你对稿演练三遍，你负责讲，我负责鼓掌，上台就不慌啦！'),
a4('q4_langdu', '朗读', ['朗读', '读课文', '朗诵'], '朗读怎么有感情',
  '读清楚就行。', '注意停顿和重音，别念成一个调子。', '我读一句你跟一句，把标点的停顿读出来，马上就有感情！'),
a4('q4_qinshi', '寝室', ['寝室', '宿舍', '宿管', '室友'], '宿舍怎么相处',
  '各过各的。', '作息互相迁就，卫生轮流，有事直说。', '室友是朝夕相处的伙伴，我帮你想想怎么定个大家都舒服的小约定。'),
a4('q4_shouji', '手机管理', ['手机', '上交手机', '手机被收', '带手机'], '手机想带又怕被收',
  '遵守校规。', '学校不让带就别带，被收更麻烦。', '在校安心学，放学再玩，我帮你把想玩的列成「放学清单」，更有盼头！'),
a4('q4_wangluo', '网络安全', ['网络安全', '被骗', '陌生链接', '账号安全'], '怎么不被骗',
  '别点陌生链接。', '不轻信转账、不透露验证码，遇事核实。', '遇到可疑的先发给我看看，咱们一起判断，守住钱包和账号！'),
a4('q4_zuoye_tongji', '作业统计', ['作业好多', '写不完', '作业堆', '作业量'], '作业太多写不完',
  '挑紧急的先做。', '按截止时间和难易排序，做不完及时说明。', '别慌，我帮你把作业排个序，一项项清，咱们肯定能搞定！'),
a4('q4_kaoshi_anpai', '考试安排', ['考试安排', '考试时间', '哪天考试', '考场'], '考试时间记不住',
  '看通知。', '记在日历上，提前一天备齐文具。', '我帮你把考试科目和时间列成清单，工具箱的倒计时还能帮你盯着！'),
a4('q4_tixing', '提神', ['犯困', '提神', '上课困', '打瞌睡'], '上课犯困怎么办',
  '掐自己一下。', '晚上睡够，课间起来走动洗把脸。', '课间跟我聊两句动一动，再喝口水，下节课精神点！'),
a4('q4_zhuli', '帮助同学', ['帮同学', '讲题', '同学问我', '教别人'], '同学总问我题',
  '看你心情。', '会的可以讲，讲题也是复习，别耽误自己。', '讲题能加深理解，你讲我听顺便帮你把关，双赢的事！'),
a4('q4_haoyi', '好感', ['喜欢的人', '有好感', '心动', '在意TA'], '对同学有好感怎么办',
  '正常现象。', '先自然相处，别影响学习和关系。', '这种小悸动挺美好的，咱们先从成为聊得来的朋友开始，慢慢来～'),
a4('q4_maodun', '同学矛盾', ['吵架', '闹矛盾', '同学关系', '被孤立'], '和同学闹矛盾了',
  '先冷静。', '弄清原因，愿意的话主动沟通，别冷战。', '我陪你把事情捋一遍，想想怎么开口，能化解就别让它堵在心里。'),
a4('q4_laoshi', '老师互动', ['找老师', '问老师', '怕老师', '老师找我'], '不敢找老师问问题',
  '老师都欢迎问。', '把问题想清楚再去，效率更高。', '我帮你把要问的整理成一句话，你照着说，老师会很乐意解答！'),
a4('q4_xinqing', '心情不好', ['心情不好', '烦', '不开心', '郁闷'], '今天心情不好',
  '会过去的。', '先做点小事让自己缓一缓，别硬扛。', '我在呢，想吐槽就吐槽，工具箱里的心情日记也能写两句，说出来会好受些。'),
a4('q4_zhoumo', '周末', ['周末', '双休日', '周末安排'], '周末怎么安排',
  '先写完作业。', '上午学习效率高，下午放松运动。', '我陪你做个周末小计划：作业、运动、玩游戏都安排上，不虚度也不亏待自己！'),
a4('q4_jiaqi', '假期', ['放假', '假期', '寒暑假', '长假'], '假期怎么不浪费',
  '保持节奏。', '留点学习时间，也要休息和运动。', '咱们定个轻松假期计划，每天一点点，开学你会惊艳全班～'),
a4('q4_xuexifangfa', '学习方法', ['学习方法', '怎么学', '学不进去', '效率低'], '找不到学习方法',
  '多试几种。', '先定目标、拆任务、及时自测，找到适合自己的。', '别急，我陪你做个「方法实验」，一周试一种，找到最顺手的！'),
a4('q4_beishu', '背书', ['背课文', '背书慢', '记不住', '背诵'], '背书背得慢',
  '多重复。', '先理解再分段，边读边回忆比反复读强。', '我教你「首字提示法」，你背卡壳我提一个字，几轮就顺下来了！'),
a4('q4_zuowen', '作文', ['作文', '写作文', '没素材', '开头结尾'], '作文没素材不会写',
  '多积累。', '平时记点小事和金句，先列提纲再写。', '我陪你头脑风暴素材，帮你搭框架，好作文是改出来的！'),
a4('q4_yuedu', '阅读理解', ['阅读理解', '现代文', '阅读题', '答不到点'], '阅读题总丢分',
  '多练多总结。', '答案回原文找依据，按分值分点答。', '我陪你拆几道题，教你怎么从文中「抠」出得分点！'),
a4('q4_yingyu', '英语口语', ['口语', '说英语', '英语发音', '不敢开口'], '不敢开口说英语',
  '多读就行。', '大声跟读模仿，别担心说错。', '先用单词测验积累，再跟我大声读，错了也没人笑你，越说越溜！'),
a4('q4_wuli', '物理', ['物理', '力学', '电学', '公式不会用'], '物理听不懂',
  '先记公式。', '搞懂每个公式的物理意义和适用条件，配例题。', '我陪你从一道基础题开始，画图列条件，慢慢你就开窍了！'),
a4('q4_huaxue', '化学', ['化学', '方程式', '元素', '实验题'], '化学方程式记不住',
  '多写多配平。', '理解反应规律，别死记，配平要练。', '我帮你把反应归类，几类一掌握，方程式自己都能推出来！'),
a4('q4_lishi', '历史', ['历史', '背年代', '历史事件', '时间线'], '历史年代记不住',
  '串成线记。', '按因果和时间线串，别孤立背。', '我陪你做一条时间线，事件之间用「因为…所以…」连起来，就好记了！'),
a4('q4_dili', '地理', ['地理', '地图', '气候', '经纬网'], '地理看不懂图',
  '多看地图。', '图文结合，先定位再分析。', '我教你看图三步：定位、看要素、找规律，地图题其实很有套路！'),
a4('q4_zhengzhi', '道德与法治', ['道法', '政治', '主观题', '大题'], '道法大题不会答',
  '抄材料加观点。', '材料+课本观点+怎么做，分点写。', '我帮你总结答题模板，遇到题往里套，分数稳稳的！'),
a4('q4_shengwu', '生物', ['生物', '遗传', '细胞', '光合作用'], '生物知识点碎',
  '画框架。', '用概念图把零散知识串起来。', '我陪你画思维导图，把细胞、遗传这些串成网，碎知识就不乱了！'),
a4('q4_jiyou', '集邮式收集', ['图鉴', '收集', '成就', '解锁'], '游戏里喜欢收集',
  '玩得开心就好。', '收集类玩法慢慢攒，别有压力。', '去成就墙看看，新游戏有十几个成就等你解锁，我陪你一个个点亮！'),
a4('q4_pifu', '皮肤装扮', ['皮肤', '装扮', '换主题', '界面好看'], '喜欢换皮肤',
  '工作台里能换。', '新做了浅蓝晴空和樱语春日两套皮肤。', '点🎨皮肤就能换！想清新选晴空，想温柔选樱花，随你心情～'),
a4('q4_dangao', '存档', ['存档', '保存进度', '换设备', '进度没了'], '进度会丢吗',
  '可以手动存。', '现在支持多槽位存档，还能导出备份。', '点💾存档，三个槽位随便存，还能导出成文件，换设备也不怕！'),
a4('q4_maikefeng', '麦克风K歌', ['麦克风', '真实唱歌', '音准', 'K歌评分'], '想真唱评分',
  '用 K 歌功能。', '授权麦克风后能测真实音高。', '点 K 歌面板里的「真麦」按钮，授权后我听你唱，小星星跟唱直接给分！'),
a4('q4_jiemuzhu', '节目主持', ['主持', '节目', '班会主持', '串词'], '要主持班会',
  '把串词写熟。', '开场、过渡、结尾都准备好，多练。', '我帮你写轻松自然的主持串词，你过一遍，台风稳稳的！'),
a4('q4_banhui', '主题班会', ['主题班会', '班会', '班级活动'], '班会要发言',
  '准备几句就行。', '围绕主题说真实想法，简短清楚。', '告诉我班会主题，我帮你写一段有观点又不空泛的发言。'),
a4('q4_banji', '班级荣誉', ['班级荣誉', '团结', '集体', '凝聚力'], '怎么让班级更团结',
  '多一起活动。', '共同目标和集体活动能增进凝聚力。', '从小组比赛、运动会加油开始，我帮你出几个增进团结的小点子！'),
a4('q4_zibei', '自信', ['不自信', '自卑', '觉得自己不行', '没信心'], '总觉得自己不行',
  '别老跟别人比。', '关注自己的小进步，记录做成的事。', '你能想到这些就很了不起了，我陪你列一张「我做到了」清单，你会发现自己超棒！'),
a4('q4_jiaolv', '考前焦虑', ['考前紧张', '焦虑', '心慌', '怕考砸'], '考前特别紧张',
  '正常，适度紧张有利发挥。', '把注意力放回复习和呼吸，别想结果。', '先深呼吸，我陪你把能做的最后过一遍，准备充分了心就定了。'),
a4('q4_chengji', '成绩波动', ['成绩下降', '退步', '成绩波动', '排名掉了'], '成绩退步了',
  '一次说明不了什么。', '找出是哪块失分，针对性补。', '咱们一起分析试卷，退步只是提醒，找到问题下次就追回来！'),
a4('q4_mubiao', '目标', ['定目标', '目标大学', '想考', '理想'], '不知道怎么定目标',
  '先定眼前的。', '大目标拆成小目标，跳一跳够得着。', '我陪你把大目标拆成这学期、这月、今天的小任务，每天都有方向！'),
a4('q4_xiguan', '习惯养成', ['习惯', '坚持', '自律', '打卡'], '坚持不下来',
  '别定太难。', '从很小的动作开始，连续打卡形成习惯。', '工具箱有「习惯打卡」，咱们每天只定一个小目标，我陪你连续点亮！'),
a4('q4_fenshen', '专注力', ['走神', '分心', '专注', '注意力'], '上课容易走神',
  '发现走神就拉回来。', '带着问题听课、做笔记能防走神。', '用「老师这句话我记个关键词」的方法，我帮你练专注，慢慢就稳了！'),
a4('q4_dushu', '课外阅读', ['课外书', '读书', '名著', '阅读习惯'], '读不进课外书',
  '从感兴趣的开始。', '每天读几页，固定时间更容易坚持。', '说说你喜欢的类型，我帮你挑本读得进去的，读完咱们一起聊！'),
a4('q4_riji', '写日记', ['写日记', '日记', '记录生活'], '写日记有什么用',
  '看个人。', '记录和梳理情绪，也能练笔。', '工具箱的心情日记就能写，三五句话也行，回头看会很有意思。'),
a4('q4_youxi_tan', '游戏话题', ['游戏', '玩什么游戏', '小游戏', '摸鱼'], '课间想玩小游戏',
  '课间放松一下可以。', '点到为止，别影响下节课。', '游戏中心有十几个新小游戏，课间来一局 2048 或打地鼠，爽一把就收心！'),
a4('q4_linghua', '零花钱', ['零花钱', '攒钱', '花钱', '预算'], '零花钱不够花',
  '记记账。', '分清想要和需要，先攒后花。', '用工具箱的记账本，我帮你看清钱花哪了，攒钱目标很快就能达成！'),
a4('q4_lan', '拖延', ['拖延', '懒得写', '不想动', '拖到最后'], '总拖延怎么办',
  '先开始五分钟。', '拆成最小任务，先动起来再说。', '咱们就先做「最简单的一道题」，你会发现一上手就停不下来，我在这陪你！'),
a4('q4_kujiang', '夸奖', ['夸我', '表扬', '鼓励一下', '没动力'], '夸夸我',
  '继续努力。', '你愿意主动调整状态，已经很不错了。', '认真又上进的你最棒啦！不管今天完成多少，愿意开始就是大进步，给你点赞！')
;

/* 合并（按 id 去重） */
function mergeExtraIntents4() {
  if (typeof XZ_AI_INTENTS === 'undefined' || !XZ_AI_INTENTS) return;
  var exist = {};
  for (var i = 0; i < XZ_AI_INTENTS.length; i++) exist[XZ_AI_INTENTS[i].id] = true;
  var added = 0;
  for (var j = 0; j < QS4.length; j++) {
    if (!exist[QS4[j].id]) { XZ_AI_INTENTS.push(QS4[j]); added++; }
  }
  window.__xz13_ai_added = (window.__xz13_ai_added || 0) + added;
}
XZ13.inits.push(mergeExtraIntents4);

/* ===== x5513_bugs.js ===== */
/* ============================================================
   5.5.13 · 第 6 模块：兼容性兜底 / 崩溃防护 / 自检
   只做防护，不改既有玩法；错误仅记录不阻断。
   ============================================================ */

/* 1. Canvas roundRect 兼容补丁（部分内核/旧浏览器没有，圆角填充会报错） */
(function () {
  try {
    if (typeof window !== 'undefined' && window.CanvasRenderingContext2D &&
      !CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
        r = r || {};
        var tl = r.tl || 0, tr = r.tr || 0, br = r.br || 0, bl = r.bl || 0;
        if (w < 2 * tl) tl = w / 2; if (w < 2 * tr) tr = w / 2;
        if (w < 2 * br) br = w / 2; if (w < 2 * bl) bl = w / 2;
        if (h < 2 * tl) tl = h / 2; if (h < 2 * tr) tr = h / 2;
        if (h < 2 * br) br = h / 2; if (h < 2 * bl) bl = h / 2;
        this.moveTo(x + tl, y);
        this.arcTo(x + w, y, x + w, y + h, tr);
        this.arcTo(x + w, y + h, x, y + h, br);
        this.arcTo(x, y + h, x, y, bl);
        this.arcTo(x, y, x + w, y, tl);
        this.closePath();
        return this;
      };
    }
  } catch (e) {}
})();

/* 2. crypto.getRandomValues 兜底（密码生成器在极老环境） */
(function () {
  try {
    if (!window.crypto) window.crypto = {};
    if (!window.crypto.getRandomValues) {
      window.crypto.getRandomValues = function (arr) {
        for (var i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * (arr.max ? arr.max() + 1 : 0x100000000));
        return arr;
      };
    }
  } catch (e) {}
})();

/* 3. 错误记录（只收集用于诊断，不弹窗、不阻断游戏） */
window.__xz13Errors = [];
window.addEventListener('error', function (e) {
  try {
    window.__xz13Errors.push({
      msg: e.message || String(e),
      src: (e.filename || '') + ':' + (e.lineno || ''),
      t: Date.now()
    });
    if (window.__xz13Errors.length > 30) window.__xz13Errors.shift();
  } catch (x) {}
}, true);
window.addEventListener('unhandledrejection', function (e) {
  try {
    window.__xz13Errors.push({ msg: 'Promise: ' + (e.reason && e.reason.message ? e.reason.message : String(e.reason)), src: 'rejection', t: Date.now() });
    if (window.__xz13Errors.length > 30) window.__xz13Errors.shift();
  } catch (x) {}
}, true);

/* 4. 防止 localStorage 不可用时整站崩溃（隐私模式/配额） */
XZ13.storageOk = (function () {
  try {
    var k = '__xz13_test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch (e) { return false; }
})();

/* 5. 弹窗安全：若同时打开多个 modal，确保关闭按钮总是可用 */
XZ13.inits.push(function () {
  try {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var m = XZ13.$('modal');
        if (m && m.classList.contains('show')) {
          // 若当前是游戏/工具面板，交给各自 ESC 逻辑；否则不处理以免误关
        }
      }
    });
  } catch (e) {}
});

/* 6. 新版面统一“安全开始/继续”：开始页若存在继续存档，补一个稳妥入口（不破坏原按钮） */
XZ13.inits.push(function () {
  try {
    var hasSave = false;
    try { hasSave = !!localStorage.getItem('xz_save_v1'); } catch (e) {}
    if (!hasSave) return;
    // 仅在开始页存在且没有我们的“继续”入口时，于控制台给出提示，不重复按钮，避免破坏布局
    console.log('[5.5.13] 检测到本地存档，可在「继续游戏」或 💾 存档管理中读取。');
  } catch (e) {}
});

/* 7. 诊断信息暴露给控制台，便于回归验证 */
XZ13.ready(function () {
  setTimeout(function () {
    try {
      var info = {
        layer: '5.5.13',
        sentinel: !!window.__XZ_PATCH_5513__,
        theme: (function () { try { return getCurrentTheme13(); } catch (e) { return '?'; } })(),
        games: XZ13.GAMES.length,
        tools: XZ13.TOOLS.length,
        aiAdded: window.__xz13_ai_added || 0,
        aiTotal: (typeof XZ_AI_INTENTS !== 'undefined') ? XZ_AI_INTENTS.length : -1,
        storageOk: XZ13.storageOk,
        mic: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
      };
      window.__xz13Info = info;
      console.log('[5.5.13] 自检', info);
    } catch (e) { console.warn('[5.5.13] 自检失败', e); }
  }, 1200);
});

})();

