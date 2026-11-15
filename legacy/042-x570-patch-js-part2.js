
/* ===== a00_head.js ===== */
/* =====================================================================
   5.7.0「心之所向 · PRO 收官」第七层补丁 X570
   原则：只增不删、不重写旧函数、不覆盖旧数据；所有新逻辑收进本 IIFE。
   本层负责：开始页双旋转卡 / 右下双 FAB 收纳 / 高端角色创建 /
            剧情交互引擎强化 / 林晚线 2 万字 / 运动会 DLC /
            成就墙重做 / 更新日志 / 手机横竖屏与性能 / 串页与上课防跳
   ===================================================================== */
(function () {
  if (window.__XZ_PATCH_570_LOADED__) return;
  window.__XZ_PATCH_570_LOADED__ = true;
  var __XZ_PATCH_570__ = true;

  /* ---------- 基础工具 ---------- */
  function $(id) { return document.getElementById(id); }
  function $s(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $a(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function on(el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt || false); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function chance(p) { return Math.random() < p; }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function toast(msg, ms) {
    var t = $("x570Toast");
    if (!t) { t = document.createElement("div"); t.id = "x570Toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._tm); t._tm = setTimeout(function () { t.classList.remove("show"); }, ms || 1600);
  }
  /* 全局弹窗：优先复用基座 modal() */
  function modal(html) {
    try { if (typeof window.modal === "function") { window.modal(html); return $("modalbox") || $("modal"); } } catch (e) {}
    var box = $("x570Modal");
    if (!box) { box = document.createElement("div"); box.id = "x570Modal"; document.body.appendChild(box); }
    box.innerHTML = '<div class="x570-modal-card"><div class="x570-modal-x" data-x570-close>×</div><div class="x570-modal-body">' + html + '</div></div>';
    box.classList.add("show");
    return box;
  }
  function closeModal() { try { if (typeof window.closeModal === "function") { window.closeModal(); } } catch (e) {} var b = $("x570Modal"); if (b) b.classList.remove("show"); }
  function cssVar(name) { try { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); } catch (e) { return ""; } }

  /* ---------- 模块注册 / 启动（单例，逐个跑，错误隔离） ---------- */
  var X570 = {
    ver: "10.1.1 PRO",
    name: "心之所向 · PRO 收官",
    modules: [],
    register: function (name, fn, stage) { this.modules.push({ name: name, fn: fn, done: false, error: null, stage: stage || 0 }); },
    boot: function () {
      var list = this.modules.slice().sort(function (a, b) { return a.stage - b.stage; });
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        try { m.fn(); m.done = true; }
        catch (e) { m.error = (e && e.message) ? e.message : String(e); try { console.warn("[X570] " + m.name + " 启动失败", e); } catch (_) {} }
      }
      this.ready = true;
    }
  };
  window.X570 = X570;

  /* 通用：全屏容器工厂（统一返回/标题/安全区，手机横竖屏自适应） */
  function fullScreen(id) {
    var el = $(id);
    if (el) return el;
    el = document.createElement("div");
    el.id = id; el.className = "x570-full";
    el.innerHTML = '<div class="x570-full-top"><button class="x570-full-back" data-x570-fs-back>‹</button>' +
      '<span class="x570-full-title"></span><span class="x570-full-spacer"></span></div>' +
      '<div class="x570-full-body"></div>';
    document.body.appendChild(el);
    on(el, "click", function (e) {
      if (e.target.closest("[data-x570-fs-back]")) { el.classList.remove("show"); document.body.classList.remove("x570-fs-open"); }
    });
    return el;
  }
  function openFull(id, title) {
    var el = fullScreen(id);
    el.querySelector(".x570-full-title").textContent = title || "";
    el.classList.add("show");
    document.body.classList.add("x570-fs-open");
    return el;
  }
  function closeFull(id) {
    var el = $(id); if (el) el.classList.remove("show");
    if (!$a(".x570-full.show").length) document.body.classList.remove("x570-fs-open");
  }
  X570.fullScreen = fullScreen; X570.openFull = openFull; X570.closeFull = closeFull;

  /* 暴露给同 IIFE 内各模块的全局工具 */
  var H = {
    $: $, $s: $s, $a: $a, on: on, esc: esc, clamp: clamp, rnd: rnd, pick: pick, chance: chance,
    lsGet: lsGet, lsSet: lsSet, lsDel: lsDel, toast: toast, modal: modal, closeModal: closeModal,
    cssVar: cssVar, fullScreen: fullScreen, openFull: openFull, closeFull: closeFull
  };
  X570.H = H;
  window.X570H = H;

  /* 启动入口（在 a99_tail 中调用）：等 DOM 与上一层补丁都就绪 */
  function bootWhenReady() {
    if (document.readyState === "loading") { on(document, "DOMContentLoaded", function () { setTimeout(function () { X570.boot(); }, 80); }); }
    else { setTimeout(function () { X570.boot(); }, 80); }
  }
  X570.bootWhenReady = bootWhenReady;
  /* IIFE 不闭合，后续模块拼接进来 */

/* ===== a20_start.js ===== */
/* ===================== 模块：开始页双旋转卡 + 手绘图 ===================== */
(function () {
  var H = X570H, $ = H.$, $a = H.$a, on = H.on, esc = H.esc, X570IMG = window.X570IMG || {};

  /* 推荐快捷小游戏（从 XZ13.GAMES 里按名字找，找不到就略过） */
  var QUICK_WANT = ["2048", "俄罗斯方块", "贪吃蛇", "合成大西瓜", "打地鼠", "记忆翻牌", "跳一跳", "黄金矿工", "K歌", "跑酷", "找茬", "反应力"];

  function runCall(callStr) {
    try {
      /* 形如 XZ13GAMES.g2048.open() 的安全调用 */
      var fn = (function () { return Function("return (" + callStr + ")"); })();
      /* callStr 通常是语句，直接执行 */
      Function(callStr)();
      return true;
    } catch (e) {
      try {
        var m = callStr.match(/XZ13GAMES\.([A-Za-z0-9_]+)\.open\(\)/);
        if (m && window.XZ13GAMES && window.XZ13GAMES[m[1]] && window.XZ13GAMES[m[1]].open) { window.XZ13GAMES[m[1]].open(); return true; }
      } catch (e2) {}
    }
    return false;
  }
  function launchGameByName(name) {
    var g = null;
    try {
      var list = (window.XZ13 && XZ13.GAMES) || [];
      for (var i = 0; i < list.length; i++) { if (list[i].name === name) { g = list[i]; break; } }
    } catch (e) {}
    if (g && g.call) {
      if (runCall(g.call)) return;
    }
    /* 特例：大西瓜 / 运动会 */
    if (name === "合成大西瓜") { try { if (typeof window.watermelonStart === "function") { window.watermelonStart(); return; } } catch (e) {} try { X570.Sport.open(); return; } catch (e) {} }
    if (name === "运动会") { try { X570.Sport.open(); return; } catch (e) {} }
    H.toast("该小游戏暂未就绪");
  }
  X570.launchGameByName = launchGameByName;

  /* 收集可用快捷游戏 */
  function collectQuick() {
    var avail = {};
    try {
      var list = (window.XZ13 && XZ13.GAMES) || [];
      for (var i = 0; i < list.length; i++) { if (list[i] && list[i].name) avail[list[i].name] = list[i].icon || "🎮"; }
    } catch (e) {}
    /* 大西瓜 */
    try { if (typeof window.watermelonStart === "function") avail["合成大西瓜"] = "🍉"; } catch (e) {}
    /* 运动会 */
    try { if (X570.Sport) avail["运动会"] = "🏃"; } catch (e) {}
    var out = [];
    for (var j = 0; j < QUICK_WANT.length; j++) {
      if (avail[QUICK_WANT[j]]) out.push({ name: QUICK_WANT[j], icon: avail[QUICK_WANT[j]] });
    }
    /* 补几个其它 */
    for (var k in avail) {
      if (out.length >= 12) break;
      var has = false; for (var q = 0; q < out.length; q++) { if (out[q].name === k) { has = true; break; } }
      if (!has) out.push({ name: k, icon: avail[k] });
    }
    return out;
  }

  function buildMode() {
    var el = $("x570Mode");
    if (el) return el;
    el = document.createElement("div");
    el.id = "x570Mode";
    var artHtml = "";
    var imgs = [X570IMG.school, X570IMG.heart, X570IMG.pro, X570IMG.learrus].filter(Boolean);
    if (imgs.length) {
      artHtml = '<div class="x570-mode-art"><div class="x570-art-stack">' +
        imgs.map(function (s) { return '<img src="' + s + '" alt="title">'; }).join("") +
        '</div></div>';
    }
    el.innerHTML =
      artHtml +
      '<div class="x570-mode-sub">心 之 所 向</div>' +
      '<div class="x570-mode-cards">' +
        '<div class="x570-mc story" data-mode="story">' +
          '<div class="x570-mc-ico">📖</div><div class="x570-mc-t">剧情模式</div>' +
          '<div class="x570-mc-d">一本可玩的校园言情小说。弱化数值，只选一个人，跟着剧情做选择，多结局。</div>' +
          '<div class="x570-mc-go">进入剧情</div>' +
        '</div>' +
        '<div class="x570-mc free" data-mode="free">' +
          '<div class="x570-mc-ico">🏫</div><div class="x570-mc-t">自由模式</div>' +
          '<div class="x570-mc-d">完整高中生活：学习、选科、恋爱、打工、社团、随机事件，随你安排。</div>' +
          '<div class="x570-mc-go">创建角色</div>' +
        '</div>' +
      '</div>' +
      '<div class="x570-quick"><div class="x570-quick-t">— 快 速 开 玩 —</div><div class="x570-quick-grid" id="x570QuickGrid"></div></div>' +
      '<div class="x570-mode-foot">' +
        '<button data-act="back">‹ 返回</button>' +
        '<button data-act="settings">⚙️ 设置</button>' +
        '<button data-act="credits">👥 制作名单</button>' +
        '<button data-act="online">🌐 假联机</button>' +
      '</div>';
    document.body.appendChild(el);

    on(el, "click", function (e) {
      var card = e.target.closest(".x570-mc");
      if (card) {
        var mode = card.getAttribute("data-mode");
        if (mode === "story") {
          closeMode();
          try { if (window.X56Story && X56Story.boot) { X56Story.boot(); return; } } catch (e) {}
          H.toast("剧情模块加载中，请稍候");
        } else {
          closeMode();
          try { X570.Char.open(); } catch (e) { try { window.showCharCreate(); } catch (e2) {} }
        }
        return;
      }
      var qc = e.target.closest(".x570-qc");
      if (qc) { launchGameByName(qc.getAttribute("data-name")); return; }
      var fb = e.target.closest("[data-act]");
      if (fb) {
        var act = fb.getAttribute("data-act");
        if (act === "back") { closeMode(); }
        else if (act === "settings") { try { window.openSettings554(); } catch (e) {} }
        else if (act === "credits") { try { window.openCredits(); } catch (e) {} }
        else if (act === "online") { try { closeMode(); window.fakeOnline(); } catch (e) {} }
      }
    });
    return el;
  }
  function openMode() {
    var el = buildMode();
    /* 填充快捷游戏 */
    var grid = $("x570QuickGrid");
    if (grid) {
      var games = collectQuick();
      grid.innerHTML = games.map(function (g) {
        return '<div class="x570-qc" data-name="' + esc(g.name) + '"><div class="ic">' + g.icon + '</div><div class="tx">' + esc(g.name) + '</div></div>';
      }).join("");
    }
    el.classList.add("show");
    try { document.body.classList.add("x570-lock"); } catch (e) {}
  }
  function closeMode() {
    var el = $("x570Mode"); if (el) el.classList.remove("show");
    try { document.body.classList.remove("x570-lock"); } catch (e) {}
  }
  X570.openMode = openMode; X570.closeMode = closeMode;

  /* 找当前的开始页容器：不同版本可能是 #splashScreen / #startPanel / .startPanel */
  function splashContainer() {
    return $("splashScreen") || $("startPanel") ||
      (document.querySelector ? document.querySelector(".startPanel") : null) || null;
  }
  /* 判断是不是"开始游戏"入口按钮（按 onclick 或文字） */
  function isStartBtn(b) {
    if (!b) return false;
    var oc = (b.getAttribute("onclick") || "");
    if (oc.indexOf("showCharCreate") >= 0) return true;
    var tx = (b.textContent || "").replace(/\s/g, "");
    if (tx.indexOf("开始游戏") >= 0 && b.querySelectorAll("button").length === 0) return true;
    return false;
  }
  function bindOne(b) {
    if (!b || b.getAttribute("data-x570-mode") === "1") return false;
    b.setAttribute("data-x570-mode", "1");
    b.removeAttribute("onclick");
    b.onclick = function (e) {
      e.preventDefault(); e.stopPropagation();
      openMode();
    };
    return true;
  }
  function patchSplash() {
    var splash = splashContainer();
    var boundAny = false;
    /* 1) 先在开始页容器内找按钮 */
    if (splash) {
      $a("button", splash).forEach(function (b) {
        if (isStartBtn(b)) { bindOne(b); }
        if (b.getAttribute("data-x570-mode") === "1") boundAny = true;
      });
    }
    /* 2) 兜底：全文档找 onclick 含 showCharCreate 的开始按钮（不同版本/重渲染） */
    if (!boundAny) {
      var all = $a("button", document);
      for (var k = 0; k < all.length; k++) {
        if (isStartBtn(all[k])) { bindOne(all[k]); boundAny = true; }
      }
    }
    /* 3) 标题换成循环手绘图（在任意开始页容器中找带校名的标题块） */
    if (!$("x570ArtInjected")) {
      var scope = splash || document;
      var divs = $a("div", scope);
      for (var i = 0; i < divs.length; i++) {
        var d = divs[i];
        if (d.id === "x570ArtInjected") continue;
        var cs = d.style ? d.style.cssText : "";
        var tx = d.textContent || "";
        if (cs.indexOf("titleFadeIn") >= 0 && tx.indexOf("杭州西子实验学校") >= 0 && d.querySelectorAll("div").length < 6) {
          d.innerHTML = '<div class="x570-art-stack" style="position:relative;height:130px;width:min(86vw,640px);margin:0 auto">' +
            [X570IMG.school, X570IMG.heart, X570IMG.pro, X570IMG.learrus].filter(Boolean).map(function (s) {
              return '<img src="' + s + '" style="position:absolute;left:50%;top:50%;width:100%;transform:translate(-50%,-50%);opacity:0;animation:x570ArtCycle 18s ease-in-out infinite">';
            }).join("") + '</div>';
          d.id = "x570ArtInjected";
          break;
        }
      }
    }
    var art = $("x570ArtInjected");
    if (art) {
      var imgs = $a("img", art);
      imgs.forEach(function (im, idx) { if (!im.style.animationDelay) im.style.animationDelay = (idx * 4.5) + "s"; });
    }
    return boundAny;
  }

  /* 常驻轻量轮询：开始页可能在片头后才渲染、或被重渲染，持续重绑（约 1 次/秒，开销极小） */
  function init() {
    var ticks = 0;
    var t = setInterval(function () {
      ticks++;
      try { patchSplash(); } catch (e) {}
      /* 前 60 秒高频；之后降为低频常驻，覆盖片头/重渲染 */
      if (ticks === 60) { clearInterval(t); setInterval(function () { try { patchSplash(); } catch (e) {} }, 1500); }
    }, 300);
  }
  X570.register("start", init, 2);
})();

/* ===== a30_fab.js ===== */
/* ===================== 模块：右下双 FAB + 工具箱收纳 ===================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc;

  /* 旧 FAB 全部隐藏（它们会被旧层定时器重建，用 CSS 持久隐藏） */
  var HIDE_IDS = ["x565WechatFab", "x56ThemeFab", "x565ThemeFab", "xzWorkbenchFab", "xz13Fab"];
  function injectHideStyle() {
    var st = document.createElement("style");
    st.id = "x570-hide-fab";
    st.textContent = "#" + HIDE_IDS.join(",#") + "{display:none !important;}";
    document.head.appendChild(st);
  }

  var TOOL_ITEMS = [
    { ic: "🎨", tx: "主题皮肤", act: "theme" },
    { ic: "💝", tx: "恋爱·聊天", act: "love" },
    { ic: "🏃", tx: "运动会", act: "sport" },
    { ic: "🌟", tx: "校园中心+", act: "campus" },
    { ic: "🎮", tx: "游戏中心", act: "games" },
    { ic: "🧰", tx: "实用工具", act: "tools" },
    { ic: "🏆", tx: "成就墙", act: "ach" },
    { ic: "💾", tx: "存档", act: "save" },
    { ic: "🎤", tx: "真麦K歌", act: "mic" },
    { ic: "📊", tx: "工作台", act: "wb" },
    { ic: "📱", tx: "朋友圈", act: "moments" },
    { ic: "📜", tx: "更新日志", act: "log" },
    { ic: "⚙️", tx: "设置", act: "settings" }
  ];

  function doAction(act) {
    closeToolbox();
    try {
      switch (act) {
        case "theme":
          if (window.X565Theme && X565Theme.open) X565Theme.open();
          else if (window.X56Theme && X56Theme.open) X56Theme.open();
          else if (typeof openThemePanel13 === "function") openThemePanel13();
          else H.toast("主题面板未就绪");
          break;
        case "love": X570.Love.open(); break;
        case "sport": X570.Sport.open(); break;
        case "campus":
          if (X570.Campus && X570.Campus.open) X570.Campus.open();
          else H.toast("校园中心未就绪");
          break;
        case "games":
          if (typeof openGameCenter13 === "function") openGameCenter13();
          else if (window.__xz13GameCenter) __xz13GameCenter();
          else H.toast("游戏中心未就绪");
          break;
        case "tools":
          if (typeof openToolbox13 === "function") openToolbox13();
          else if (window.__xz13Toolbox) __xz13Toolbox();
          else H.toast("工具箱未就绪");
          break;
        case "ach": X570.Ach.open(); break;
        case "save":
          if (window.SAVE_SYS && SAVE_SYS.open) SAVE_SYS.open();
          else H.toast("存档系统未就绪");
          break;
        case "mic":
          if (window.XZ13_MIC && XZ13_MIC.open) XZ13_MIC.open();
          else if (window.XZ13_MIC && XZ13_MIC.start) XZ13_MIC.start();
          else H.toast("真麦模块未就绪");
          break;
        case "wb": openWorkbench(); break;
        case "moments":
          if (window.X565WX && X565WX.tab) { X565WX.open(); setTimeout(function(){ try{X565WX.tab('moments');}catch(e){} }, 200); }
          else if (window.X565WX && X565WX.open) X565WX.open();
          else H.toast("朋友圈未就绪");
          break;
        case "log": X570.Log.open(); break;
        case "settings":
          if (typeof openSettings554 === "function") openSettings554();
          else H.toast("设置未就绪");
          break;
      }
    } catch (e) { H.toast("打开失败：" + (e.message || e)); }
  }

  function openWorkbench() {
    var wb = $("xzWorkbench");
    if (wb) {
      try { if (wb.classList.contains("hidden")) wb.classList.remove("hidden"); } catch (e) {}
      wb.style.display = "block";
      /* 多数版本工作台靠点击右下 FAB 打开；这里兜底再调用一次 */
      try { if (typeof window.openWorkbench === "function") { window.openWorkbench(); return; } } catch (e) {}
      return;
    }
    if (typeof openGameCenter13 === "function") { openGameCenter13(); return; }
    H.toast("工作台未就绪");
  }

  function buildFabs() {
    if ($("x570FabWX")) return;
    var wx = document.createElement("button");
    wx.id = "x570FabWX"; wx.className = "x570-fab";
    wx.setAttribute("aria-label", "微信");
    wx.innerHTML = "💬<span class='x570-fab-badge' id='x570WxBadge'>0</span>";
    on(wx, "click", function () {
      closeToolbox();
      try {
        if (window.X565WX && X565WX.open) X565WX.open();
        else if (window.X565WX && X565WX.tab) { X565WX.tab("chats"); }
        else H.toast("微信模块未就绪");
      } catch (e) { H.toast("微信未就绪"); }
    });
    document.body.appendChild(wx);

    var tool = document.createElement("button");
    tool.id = "x570FabTool"; tool.className = "x570-fab";
    tool.setAttribute("aria-label", "工具箱");
    tool.innerHTML = "🧰";
    on(tool, "click", function () { toggleToolbox(); });
    document.body.appendChild(tool);

    var box = document.createElement("div");
    box.id = "x570Toolbox";
    box.innerHTML =
      '<div class="x570-tb-head"><b>🧰 工具箱</b><span style="font-size:12px;opacity:.6">10.1.1 PRO</span></div>' +
      '<div class="x570-tb-grid" id="x570TbGgrid"></div>';
    document.body.appendChild(box);
    var grid = $("x570TbGgrid");
    grid.innerHTML = TOOL_ITEMS.map(function (it) {
      return '<div class="x570-tb-item" data-act="' + it.act + '"><span class="ic">' + it.ic + '</span><span class="tx">' + esc(it.tx) + '</span></div>';
    }).join("");
    on(grid, "click", function (e) {
      var item = e.target.closest(".x570-tb-item");
      if (item) doAction(item.getAttribute("data-act"));
    });
    /* 点击空白处关闭 */
    on(document, "pointerdown", function (e) {
      if (!$("x570Toolbox").classList.contains("show")) return;
      if (e.target.closest("#x570Toolbox") || e.target.closest("#x570FabTool")) return;
      closeToolbox();
    });
  }
  function toggleToolbox() {
    var box = $("x570Toolbox");
    if (!box) return;
    box.classList.toggle("show");
  }
  function closeToolbox() { var box = $("x570Toolbox"); if (box) box.classList.remove("show"); }
  X570.closeToolbox = closeToolbox;

  function init() {
    injectHideStyle();
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (document.body) { buildFabs(); clearInterval(t); }
      if (tries > 60) clearInterval(t);
    }, 200);
  }
  X570.register("fab", init, 1);
})();

/* ===== a40_chat_love.js ===== */
/* ===================== 模块：恋爱·聊天枢纽（融合剧情与微信） ===================== */
(function () {
  var H = X570H, $ = H.$, $a = H.$a, on = H.on, esc = H.esc, lsGet = H.lsGet;

  function getHeroines() {
    try { return (window.X56Story && X56Story.heroines) || []; } catch (e) { return []; }
  }
  function getContacts() {
    try { return (window.X565WXData && X565WXData.contacts) || []; } catch (e) { return []; }
  }
  /* 女主 id → 微信联系人 id（同名） */
  function heroineContactId(hid) {
    var cs = getContacts();
    var map = { lin: "lin", zhao: "zhao", su: "su", xu: "xu", shen: "shen" };
    for (var i = 0; i < cs.length; i++) { if (cs[i].id === (map[hid] || hid)) return cs[i].id; }
    /* 按名字 */
    var h = null;
    try { h = window.X56Story.byId(hid); } catch (e) {}
    if (h) for (var j = 0; j < cs.length; j++) { if (cs[j].name === h.name) return cs[j].id; }
    return null;
  }
  function savedStory() {
    try {
      var raw = lsGet("xz56_story_v1", "");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }

  function enterStory(hid) {
    var S = window.X56Story;
    if (!S) { H.toast("剧情模块未就绪"); return; }
    H.closeFull("x570Love");
    try {
      S.ensureRoot();
      var hp = $("heroPanel"); if (hp) hp.style.display = "none";
      var cp = $("charPanel"); if (cp) cp.style.display = "none";
      var st = $("start"); if (st) st.style.display = "none";
      var root = $("x56Story"); root.classList.add("show");
      var pick = $("stPickHeroine"); if (pick) pick.remove();
      var nameInput = $("fName");
      var myName = nameInput ? (nameInput.value.trim() || "我") : "我";
      var saved = savedStory();
      if (saved && saved.heroine === hid && saved.node) {
        S.state = saved;
        S.go(saved.node);
      } else {
        S.startStory(hid, myName);
      }
    } catch (e) {
      /* 兜底：正常 boot 进入选择 */
      try { S.boot(); } catch (e2) { H.toast("剧情启动失败：" + (e.message || e)); }
    }
  }

  function openChat(cid) {
    H.closeFull("x570Love");
    try {
      if (window.X565WX && X565WX.open) {
        X565WX.open();
        setTimeout(function () { try { X565WX.openChat(cid); } catch (e) { if (X565WX.tab) X565WX.tab("chats"); } }, 180);
      } else { H.toast("微信未就绪"); }
    } catch (e) { H.toast("聊天未就绪"); }
  }

  var Love = {
    seg: "love",
    open: function () {
      var el = H.openFull("x570Love", "💝 恋爱 · 聊天");
      var body = el.querySelector(".x570-full-body");
      this.render(body);
    },
    render: function (body) {
      var self = this;
      var heroines = getHeroines();
      var contacts = getContacts();
      var html =
        '<div class="x570-seg">' +
          '<button data-seg="love" class="' + (this.seg === "love" ? "on" : "") + '">💞 恋爱线</button>' +
          '<button data-seg="wx" class="' + (this.seg === "wx" ? "on" : "") + '">💬 微信 (' + contacts.length + ')</button>' +
        '</div><div id="x570LoveContent"></div>';
      body.innerHTML = html;
      on(body.querySelector(".x570-seg"), "click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        self.seg = b.getAttribute("data-seg");
        self.render(body);
      });
      var box = $("x570LoveContent");
      if (this.seg === "love") box.innerHTML = this.loveHtml(heroines);
      else box.innerHTML = this.wxHtml(contacts);
      on(box, "click", function (e) {
        var story = e.target.closest("[data-story]");
        if (story) { enterStory(story.getAttribute("data-story")); return; }
        var chat = e.target.closest("[data-chat]");
        if (chat) { openChat(chat.getAttribute("data-chat")); return; }
      });
    },
    loveHtml: function (heroines) {
      if (!heroines.length) return '<div class="x570-card">剧情模块加载中…</div>';
      var saved = savedStory();
      var h = '<div class="x570-card"><div class="t">📖 剧情模式</div><div class="d">一段只属于你和她的故事。选择一个人，一起走完。已在进行的会显示进度。</div>';
      heroines.forEach(function (hr) {
        var prog = saved && saved.heroine === hr.id ? ("· 进度：" + (saved.chapter || "序章") + " · 好感 " + (saved.affinity == null ? 2 : saved.affinity) + "♥") : "";
        var cid = heroineContactId(hr.id);
        h +=
          '<div class="x570-love-card">' +
            '<div class="av">' + hr.emoji + '</div>' +
            '<div class="info"><div class="nm">' + esc(hr.name) + ' <span class="h">' + esc(hr.tag || "") + '</span></div>' +
            '<div class="mt">' + esc(hr.desc || "") + ' ' + prog + '</div>' +
            '<div class="x570-row x570-mt" style="gap:8px">' +
              '<button class="x570-btn" data-story="' + hr.id + '">' + (prog ? "继续剧情" : "开始剧情") + '</button>' +
              (cid ? '<button class="x570-btn green" data-chat="' + cid + '">💬 微信</button>' : '') +
            '</div></div></div>';
      });
      h += '</div>';
      return h;
    },
    wxHtml: function (contacts) {
      if (!contacts.length) return '<div class="x570-card">微信模块加载中…</div>';
      var h = '<div class="x570-card"><div class="t">💬 手机微信</div><div class="d">和同学、老师、家人聊天，内容会随剧情、关系与活动变化。</div>';
      contacts.forEach(function (c) {
        h +=
          '<div class="x570-love-card" data-chat="' + esc(c.id) + '">' +
            '<div class="av">' + (c.emoji || "🙂") + '</div>' +
            '<div class="info"><div class="nm">' + esc(c.name) + '</div>' +
            '<div class="mt">' + esc(c.tag || c.sig || "") + '</div></div>' +
            '<span style="opacity:.6">›</span></div>';
      });
      h += '</div>';
      return h;
    }
  };
  X570.Love = Love;

  X570.register("love", function () {}, 3);
})();

/* ===== a50_char.js ===== */
/* ===================== 模块：高端角色创建向导 ===================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc;

  var S = {
    name: "",
    gender: "男",
    family: "worker",
    features: [],
    hobbies: [],
    mbti: "INFP",
    zodiac: "天秤",
    blood: "A",
    hand: "right"
  };
  var step = 0;

  function data() { return window.X56Char || null; }
  function mbtiTypes() { try { return (window.X56MBTI && X56MBTI.types) || []; } catch (e) { return []; }
  }

  function toggle(list, v, max) {
    var i = list.indexOf(v);
    if (i >= 0) { list.splice(i, 1); }
    else { if (list.length >= max) { H.toast("最多选择 " + max + " 项"); return false; } list.push(v); }
    return true;
  }

  var steps = [
    {
      key: "basic",
      render: function () {
        return '<div class="x570-char-tt">你是谁？</div><div class="x570-char-sub">先取个名字，设定性别。这会影响校园里的称呼、事件与关系。</div>' +
          '<input class="x570-name-input" id="x570CName" maxlength="10" placeholder="输入你的名字（默认：我）" value="' + esc(S.name) + '">' +
          '<div class="x570-char-sub" style="margin-top:16px">性别</div>' +
          '<div class="x570-chip-grid">' +
            '<button type="button" class="x570-chip ' + (S.gender === "男" ? "sel" : "") + '" data-gender="男">👦 男生</button>' +
            '<button type="button" class="x570-chip ' + (S.gender === "女" ? "sel" : "") + '" data-gender="女">👧 女生</button>' +
          '</div>';
      },
      bind: function (el) {
        var nameEl = $("x570CName");
        on(nameEl, "input", function () { S.name = nameEl.value; });
        el.querySelectorAll("[data-gender]").forEach(function (b) {
          on(b, "click", function () {
            S.gender = b.getAttribute("data-gender");
            el.querySelectorAll("[data-gender]").forEach(function (x) { x.classList.toggle("sel", x === b); });
          });
        });
      }
    },
    {
      key: "family",
      render: function () {
        var d = data(); var fam = d ? d.families : [];
        return '<div class="x570-char-tt">家庭背景</div><div class="x570-char-sub">决定你的起步资源、性格底色与一些专属剧情。</div>' +
          '<div class="x570-opt-grid">' + fam.map(function (f) {
            return '<div class="x570-opt ' + (S.family === f.id ? "sel" : "") + '" data-fam="' + f.id + '">' +
              '<div class="n">' + esc(f.name) + '</div><div class="d">' + esc(f.desc) + '</div>' +
              '<div class="e">💰 ' + f.money + ' · ' + esc(f.eff) + '</div></div>';
          }).join("") + '</div>';
      },
      bind: function (el) {
        el.querySelectorAll("[data-fam]").forEach(function (b) {
          on(b, "click", function () {
            S.family = b.getAttribute("data-fam");
            el.querySelectorAll("[data-fam]").forEach(function (x) { x.classList.toggle("sel", x === b); });
          });
        });
      }
    },
    {
      key: "features",
      render: function () {
        var d = data(); var feats = d ? d.features : [];
        return '<div class="x570-char-tt">外貌特征</div><div class="x570-char-sub">最多选 4 项，影响第一印象、颜值与社交。</div>' +
          '<div class="x570-chip-grid">' + feats.map(function (f) {
            return '<button type="button" class="x570-chip ' + (S.features.indexOf(f) >= 0 ? "sel" : "") + '" data-feat="' + esc(f) + '">' + esc(f) + '</button>';
          }).join("") + '</div>';
      },
      bind: function (el) {
        el.querySelectorAll("[data-feat]").forEach(function (b) {
          on(b, "click", function () {
            var v = b.getAttribute("data-feat");
            if (toggle(S.features, v, 4)) b.classList.toggle("sel", S.features.indexOf(v) >= 0);
          });
        });
      }
    },
    {
      key: "hobbies",
      render: function () {
        var d = data(); var hobs = d ? d.hobbies : [];
        return '<div class="x570-char-tt">爱好特长</div><div class="x570-char-sub">最多选 3 项，影响社团、技能、运动会与聊天话题。</div>' +
          '<div class="x570-chip-grid">' + hobs.map(function (h) {
            return '<button type="button" class="x570-chip ' + (S.hobbies.indexOf(h) >= 0 ? "sel" : "") + '" data-hob="' + esc(h) + '">' + esc(h) + '</button>';
          }).join("") + '</div>';
      },
      bind: function (el) {
        el.querySelectorAll("[data-hob]").forEach(function (b) {
          on(b, "click", function () {
            var v = b.getAttribute("data-hob");
            if (toggle(S.hobbies, v, 3)) b.classList.toggle("sel", S.hobbies.indexOf(v) >= 0);
          });
        });
      }
    },
    {
      key: "mbti",
      render: function () {
        var ts = mbtiTypes();
        return '<div class="x570-char-tt">MBTI 性格</div><div class="x570-char-sub">16 型人格，影响精力、学习方式、社交与聊天风格。</div>' +
          '<div class="x570-chip-grid">' + ts.map(function (t) {
            return '<button type="button" class="x570-chip ' + (S.mbti === t.code ? "sel" : "") + '" data-mbti="' + t.code + '" title="' + esc(t.desc || "") + '">' + t.code + '</button>';
          }).join("") + '</div>' +
          '<div class="x570-card x570-mt" id="x570MbtiInfo"></div>';
      },
      bind: function (el) {
        function info(code) {
          var ts = mbtiTypes(); for (var i = 0; i < ts.length; i++) if (ts[i].code === code) return ts[i]; return null;
        }
        var infoBox = $("x570MbtiInfo");
        function show() { var t = info(S.mbti); if (t) infoBox.innerHTML = '<div class="t">' + t.code + ' · ' + esc(t.name || "") + '</div><div class="d">' + esc(t.desc || "") + '</div>'; }
        show();
        el.querySelectorAll("[data-mbti]").forEach(function (b) {
          on(b, "click", function () {
            S.mbti = b.getAttribute("data-mbti");
            el.querySelectorAll("[data-mbti]").forEach(function (x) { x.classList.toggle("sel", x === b); });
            show();
          });
        });
      }
    },
    {
      key: "extras",
      render: function () {
        var d = data();
        var zs = d ? d.zodiacs : [];
        var bs = d ? d.bloods : ["A", "B", "O", "AB"];
        var hs = d ? d.hands : [{ id: "right", name: "右手" }, { id: "left", name: "左撇子" }, { id: "both", name: "双手通用" }];
        function chips(list, key, idOf, nameOf) {
          return list.map(function (it) {
            var id = typeof it === "string" ? it : idOf(it);
            var nm = typeof it === "string" ? it : nameOf(it);
            return '<button type="button" class="x570-chip ' + (S[key] === id ? "sel" : "") + '" data-k="' + key + '" data-v="' + esc(id) + '">' + esc(nm) + '</button>';
          }).join("");
        }
        return '<div class="x570-char-tt">星座 · 血型 · 惯用手</div><div class="x570-char-sub">小细节，藏着一些事件与运气加成。</div>' +
          '<div class="x570-char-sub">星座</div><div class="x570-chip-grid">' + chips(zs, "zodiac", function (x) { return x.id; }, function (x) { return x.id; }) + '</div>' +
          '<div class="x570-char-sub" style="margin-top:12px">血型</div><div class="x570-chip-grid">' + chips(bs, "blood", function (x) { return x; }, function (x) { return x; }) + '</div>' +
          '<div class="x570-char-sub" style="margin-top:12px">惯用手</div><div class="x570-chip-grid">' + chips(hs, "hand", function (x) { return x.id; }, function (x) { return x.name; }) + '</div>';
      },
      bind: function (el) {
        el.querySelectorAll("[data-k]").forEach(function (b) {
          on(b, "click", function () {
            var k = b.getAttribute("data-k"), v = b.getAttribute("data-v");
            S[k] = v;
            el.querySelectorAll('[data-k="' + k + '"]').forEach(function (x) { x.classList.toggle("sel", x === b); });
          });
        });
      }
    },
    {
      key: "confirm",
      render: function () {
        var d = data(); var fname = ""; if (d) { for (var i = 0; i < d.families.length; i++) if (d.families[i].id === S.family) fname = d.families[i].name; }
        var zname = S.zodiac;
        return '<div class="x570-char-tt">确认你的样子</div><div class="x570-char-sub">一切就绪，开始你的高中生活。</div>' +
          '<div class="x570-summary">' +
            '<div>姓名：<b>' + esc(S.name || "我") + '</b>（' + S.gender + '）</div>' +
            '<div>家庭：<b>' + esc(fname) + '</b></div>' +
            '<div>外貌：<b>' + (S.features.length ? esc(S.features.join("、")) : "普通") + '</b></div>' +
            '<div>爱好：<b>' + (S.hobbies.length ? esc(S.hobbies.join("、")) : "暂无") + '</b></div>' +
            '<div>性格：<b>' + S.mbti + '</b></div>' +
            '<div>' + esc(zname) + '座 · ' + S.blood + ' 型 · ' + (S.hand === "right" ? "右利手" : S.hand === "left" ? "左撇子" : "双手通用") + '</div>' +
          '</div>' +
          '<div class="x570-card x570-mt"><div class="d">自由模式包含完整的学习、选科、恋爱、打工、社团与随机事件，节奏由你掌握。</div></div>';
      },
      bind: function () {}
    }
  ];

  function renderStep() {
    var el = $("x570Char");
    var body = el.querySelector(".x570-full-body");
    var st = steps[step];
    var dots = "";
    for (var i = 0; i < steps.length; i++) dots += '<i class="' + (i === step ? "on" : "") + '"></i>';
    var isLast = step === steps.length - 1;
    var isFirst = step === 0;
    body.innerHTML =
      '<div class="x570-char-dots">' + dots + '</div>' +
      '<div class="x570-char-step active" id="x570StepWrap">' + st.render() + '</div>' +
      '<div class="x570-char-nav">' +
        (isFirst ? "" : '<button class="x570-btn-prev" id="x570Prev">上一步</button>') +
        (isLast ? '<button class="x570-btn-go" id="x570Go">🚀 进入自由模式</button>' : '<button class="x570-btn-next" id="x570Next">下一步</button>') +
      '</div>';
    st.bind(body);
    var prev = $("x570Prev"); if (prev) on(prev, "click", function () { if (step > 0) { step--; renderStep(); } });
    var next = $("x570Next"); if (next) on(next, "click", function () { if (step < steps.length - 1) { step++; renderStep(); } });
    var go = $("x570Go"); if (go) on(go, "click", function () { finalize(); });
  }

  /* 把选择写入基座，然后启动自由模式 */
  function finalize() {
    try {
      /* 先确保旧角色面板存在（startGame 依赖里面的表单） */
      var splash = $("splashScreen"); if (splash) splash.style.display = "none";
      var cp = $("charPanel");
      if (cp) cp.style.display = "block";
      var game = $("game"); if (game) game.style.display = "block";
      try { if (typeof window.showCharCreate === "function") window.showCharCreate(); } catch (e) {}

      /* 写名字 */
      var fName = $("fName");
      if (fName) fName.value = S.name || "我";
      /* 写性别（best-effort） */
      try {
        var panel = cp || document;
        var radios = panel.querySelectorAll("input[type=radio]");
        radios.forEach(function (r) {
          var lab = (r.value || "") + (r.id || "") + (r.getAttribute("data-label") || "");
          if (lab.indexOf(S.gender) >= 0) { r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); }
        });
        var sel = panel.querySelectorAll("select");
        sel.forEach(function (sv) {
          for (var i = 0; i < sv.options.length; i++) {
            if (sv.options[i].text.indexOf(S.gender) >= 0) { sv.selectedIndex = i; sv.dispatchEvent(new Event("change", { bubbles: true })); }
          }
        });
      } catch (e) {}

      /* 同步给 X56Char.sel（startGame 包装会读它） */
      if (window.X56Char) {
        var sc = X56Char.sel;
        sc.gt = "free";
        sc.family = S.family;
        sc.features = S.features.slice();
        sc.hobbies = S.hobbies.slice();
        sc.mbti = S.mbti;
        sc.zodiac = S.zodiac;
        sc.blood = S.blood;
        sc.hand = S.hand;
        sc.period = false;
      }
      /* 关掉本层向导 */
      H.closeFull("x570Char");
      /* 启动 */
      if (typeof window.startGame === "function") {
        window.startGame();
        H.toast("欢迎来到杭州西子实验学校");
      } else {
        H.toast("开始按钮未找到，可用下方“开始游戏”进入");
      }
    } catch (e) {
      H.toast("进入失败：" + (e.message || e));
    }
  }

  var Char = {
    open: function () {
      /* 若 X56Char 已有默认值，同步进来 */
      try {
        if (window.X56Char && X56Char.sel) {
          var ss = X56Char.sel;
          if (ss.family) S.family = ss.family;
          if (ss.mbti) S.mbti = ss.mbti;
          if (ss.zodiac) S.zodiac = ss.zodiac;
          if (ss.blood) S.blood = ss.blood;
          if (ss.hand) S.hand = ss.hand;
        }
      } catch (e) {}
      var el = H.openFull("x570Char", "🎒 创建角色");
      step = 0;
      renderStep();
    }
  };
  X570.Char = Char;

  X570.register("char", function () {}, 3);
})();

/* ===== a60_story_engine.js ===== */
/* ===================== 模块：剧情交互引擎加固 + 作者工具（便于自己写剧情） ===================== */
(function () {
  var H = X570H, $ = H.$, $a = H.$a, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;

  /* 节点构造器：用户自己写剧情时直接调用，返回符合 X56Story 引擎的节点 */
  var Node = {
    line: function (o) {
      return {
        type: "line",
        chapter: o.chapter, loc: o.loc || "classroom",
        speaker: o.speaker || "narrator", emoji: o.emoji,
        text: o.text, next: o.next
      };
    },
    choice: function (o) {
      return {
        type: "choice",
        chapter: o.chapter, loc: o.loc || "classroom",
        speaker: o.speaker || "me", emoji: o.emoji,
        text: o.text, choices: o.choices
      };
    },
    map: function (o) {
      return { type: "map", loc: o.loc || "classroom", text: o.text, guide: o.guide, cells: o.cells };
    },
    end: function (o) {
      return { type: "end", emoji: o.emoji || "🌸", title: o.title, text: o.text };
    },
    /* 好感判定路由：sweet>=7, normal>=5, friend 有 friend flag, 否则 miss */
    judge: function (o) {
      var aff = o.affinity || 7, normal = o.normal || 5, friend = o.friend || "end_friend";
      return {
        type: "router",
        route: function (state) {
          if (state.flags && state.flags.friend) return friend;
          if (state.affinity >= aff) return o.sweet;
          if (state.affinity >= normal) return o.normal;
          return o.miss;
        }
      };
    }
  };

  /* 追加一整本书（或若干节点），绝不覆盖已有节点 */
  function appendBook(bookId, nodes) {
    if (!window.X56StoryContent) return;
    if (!X56StoryContent[bookId]) X56StoryContent[bookId] = {};
    var added = 0;
    for (var id in nodes) {
      if (!X56StoryContent[bookId].hasOwnProperty(id)) {
        X56StoryContent[bookId][id] = nodes[id];
        added++;
      }
    }
    return added;
  }

  /* 持久化：剧情自动存档（X56Story 自带），这里再补一个章节书签，方便随时回看 */
  var BOOKMARK_KEY = "xz570_story_bookmarks";
  function getBookmarks() { try { return JSON.parse(lsGet(BOOKMARK_KEY, "{}")) || {}; } catch (e) { return {}; } }
  function setBookmark(heroine, nodeId) {
    var bm = getBookmarks();
    bm[heroine] = { node: nodeId, t: Date.now() };
    lsSet(BOOKMARK_KEY, JSON.stringify(bm));
  }

  /* ---------- 事件委托兜底（解决“点人物/选项没反应”） ---------- */
  function bindDelegated() {
    var root = document.getElementById("x56Story");
    if (!root) { return false; }
    if (root.__x570Delegated) return true;
    root.__x570Delegated = true;

    root.addEventListener("click", function (e) {
      var S = window.X56Story;
      if (!S || !S.state) return;

      /* 女主卡：选谁开始 */
      var card = e.target.closest ? e.target.closest(".ph-card") : null;
      if (card) {
        e.stopPropagation();
        var id = card.getAttribute("data-id");
        var nameInput = $("fName");
        var myName = nameInput ? (nameInput.value.trim() || "我") : "我";
        if (S.startStory) S.startStory(id, myName);
        return;
      }

      /* 选项 */
      var choice = e.target.closest ? e.target.closest(".st-choice") : null;
      if (choice) {
        e.stopPropagation();
        var box = $("stChoices");
        var idx = box ? Array.prototype.indexOf.call(box.children, choice) : -1;
        var nd = S.node(S.state.node);
        if (nd && nd.type === "choice" && idx >= 0 && nd.choices[idx]) {
          var ch = nd.choices[idx];
          if (choice.__x570Fired) return;
          choice.__x570Fired = true;
          if (ch.eff) S.state.affinity = (window.X56 && X56.clamp) ? X56.clamp(S.state.affinity + ch.eff, 0, 10) : Math.max(0, Math.min(10, S.state.affinity + ch.eff));
          if (ch.flags) for (var k in ch.flags) S.state.flags[k] = ch.flags[k];
          if (S.renderHearts) S.renderHearts();
          if (ch.next) S.go(ch.next);
        }
        return;
      }

      /* 地图格子 */
      var cell = e.target.closest ? e.target.closest(".st-map-cell") : null;
      if (cell) {
        e.stopPropagation();
        var target = cell.getAttribute("data-target");
        if (S.closeMap) S.closeMap();
        if (target && S.go) S.go(target);
        return;
      }
      var mapClose = e.target.closest ? e.target.closest("#stMapClose") : null;
      if (mapClose) { e.stopPropagation(); if (S.closeMap) S.closeMap(); return; }

      /* 对话框（点按推进）：仅在引擎自身监听失效时兜底 */
      var dlg = e.target.closest ? e.target.closest("#stDialog") : null;
      if (dlg && e.target.closest("#stNext")) {
        /* 交给引擎 */
        return;
      }
    }, true);
    return true;
  }

  /* ---------- 结局页加“续章”按钮（林晚线） ---------- */
  function hookEnding() {
    var S = window.X56Story;
    if (!S || S.__x570EndHooked) return;
    S.__x570EndHooked = true;
    var oldRender = S.renderEnd;
    S.renderEnd = function (nd) {
      oldRender.apply(this, arguments);
      try {
        if (this.state.heroine === "lin" && (nd.title || "").indexOf("心之所向") >= 0) {
          var btnWrap = $("stEnding");
          if (btnWrap) {
            var btns = btnWrap.querySelector(".end-btns");
            if (btns && !$("stEndExtra")) {
              var b = document.createElement("button");
              b.id = "stEndExtra";
              b.style.cssText = "background:linear-gradient(135deg,#ff7eb3,#ff5e62);color:#fff;width:100%;margin-top:10px";
              b.textContent = "续章 · 后来的我们";
              b.addEventListener("click", function () {
                var e = $("stEnding"); if (e) e.remove();
                X570.LinEx.enter();
              });
              btns.parentNode.insertBefore(b, btns);
            }
          }
        }
      } catch (e) {}
    };
  }

  /* ---------- 剧情菜单追加：回看 / 续章 / 作者说明 ---------- */
  function hookMenu() {
    var S = window.X56Story;
    if (!S || S.__x570MenuHooked) return;
    S.__x570MenuHooked = true;
    /* 周期性保证委托生效（节点重建后根节点不变，但选择卡会重建） */
    setInterval(function () {
      try {
        var root = $("x56Story");
        if (root && root.__x570Delegated) {
          /* 选择卡若没有任何可点绑定（兜底），重新委托标记已在，无需重复 */
        }
        if (root) bindDelegated();
      } catch (e) {}
    }, 1200);
  }

  /* 统一的“进入剧情并跳到指定节点”（供续章/恋爱枢纽调用） */
  function enterAt(heroine, nodeId, myName) {
    var S = window.X56Story;
    if (!S) { H.toast("剧情模块未就绪"); return; }
    S.ensureRoot();
    var hp = $("heroPanel"); if (hp) hp.style.display = "none";
    var cp = $("charPanel"); if (cp) cp.style.display = "none";
    var st = $("start"); if (st) st.style.display = "none";
    var root = $("x56Story"); root.classList.add("show");
    var pick = $("stPickHeroine"); if (pick) pick.remove();
    var end = $("stEnding"); if (end) end.remove();
    var nm = myName || (function () { var ni = $("fName"); return ni ? (ni.value.trim() || "我") : "我"; })();
    if (!S.state || S.state.heroine !== heroine) {
      S.state = { heroine: heroine, myName: nm, chapter: "续章", node: nodeId, flags: {}, affinity: 8, loc: "classroom" };
    }
    S.state.heroine = heroine; S.state.myName = nm; S.state.node = nodeId;
    S.save();
    S.go(nodeId);
    bindDelegated();
  }

  /* ---------- 作者说明面板（给打算自己写剧情的用户） ---------- */
  function authorHelp() {
    var html =
      '<h3>📝 剧情创作说明</h3>' +
      '<div class="tcard"><b>剧情是怎么写的？</b><br>' +
      '剧情由一个个「节点」串成，每个节点是一个对象：<br>' +
      '· 对话节点 <b>line</b>：一段文字 + 下一个节点 next；<br>' +
      '· 选项节点 <b>choice</b>：文字 + 多个选项（可加好感 eff、标记 flags、跳转 next）；<br>' +
      '· 地图节点 <b>map</b>：列出可去地点；<br>' +
      '· 结局节点 <b>end</b>：显示结局标题与文字。<br>' +
      '只需把新节点追加进 X56StoryContent.lin，再让某个节点的 next 指向它即可。本版已提供 X570.Node 构造器与 X570.Story.appendBook()，不会覆盖旧节点。</div>' +
      '<div class="tcard"><b>举个例子</b><br>' +
      'X570.Story.appendBook("lin", { my_1: X570.Node.line({text:"新的一天开始了。", next:"my_2"}), my_2: X570.Node.choice({text:"今天去哪？", choices:[{label:"去图书馆", eff:1, next:"my_3"},{label:"去操场", eff:0, next:"my_4"}]}) });</div>' +
      '<div class="tcard"><b>已有要素</b><br>说话人：narrator 旁白 / me 自己 / 留空=女主；好感 affinity 0-10；flags 可记录任意选择；地点 loc 决定背景。</div>' +
      '<button class="gbtn" style="margin-top:8px" onclick="closeModal()">我知道了</button>';
    try { if (typeof window.modal === "function") { window.modal(html); return; } } catch (e) {}
    H.modal(html);
  }

  var Story = {
    Node: Node,
    appendBook: appendBook,
    enterAt: enterAt,
    bookmark: setBookmark,
    authorHelp: authorHelp,
    bindDelegated: bindDelegated
  };
  X570.Story = Story;

  function init() {
    /* 等待 X56Story 就绪后挂钩 */
    var n = 0;
    var t = setInterval(function () {
      n++;
      var ok = false;
      if (window.X56Story) { try { hookEnding(); hookMenu(); ok = true; } catch (e) {} }
      if (window.X56Story) {
        var r = document.getElementById("x56Story");
        if (r) bindDelegated();
      }
      if (n > 80) clearInterval(t);
    }, 250);
  }
  X570.register("storyEngine", init, 4);
})();

/* ===== a70_lin_story.js ===== */
/* =====================================================================
   林晚线「续章 · 后来的我们」—— 不新增线路，只把林晚这一条做深、做长
   节点前缀 lx_，全部追加进 X56StoryContent.lin，不覆盖任何旧节点
   从甜蜜结局「心之所向」后可进入，也可由恋爱枢纽 / 续章入口进入
   ===================================================================== */
(function () {
  function N(o) { return X570.Story.Node; }
  function L(ch, loc, emoji, speaker, text, next) { return { type: "line", chapter: ch, loc: loc, speaker: speaker, emoji: emoji, text: text, next: next }; }
  function C(ch, loc, emoji, text, choices) { return { type: "choice", chapter: ch, loc: loc, speaker: "me", emoji: emoji, text: text, choices: choices }; }
  function M(ch, loc, text, guide, cells) { return { type: "map", chapter: ch, loc: loc, text: text, guide: guide, cells: cells }; }
  function E(emoji, title, text) { return { type: "end", emoji: emoji, title: title, text: text }; }

  var P = {
    /* ============ 序章 · 在一起之后 ============ */
    lx00: L("续章 · 后来的我们", "classroom", "🍂", "narrator",
      "告白之后的第一个清晨，你比平时早醒了十分钟。窗外的梧桐叶被风翻动，你翻来覆去地想：原来喜欢一个人，连走进教室都需要鼓起勇气。",
      "lx01"),
    lx01: L("续章 · 后来的我们", "classroom", "🌸", "her",
      "（她像往常一样坐在你前桌，马尾轻轻晃了一下，却没立刻回头。过了几秒，她才把一张折成小方块的纸条放到你桌角，耳朵红得像要烧起来）",
      "lx02"),
    lx02: L("续章 · 后来的我们", "classroom", "🧑", "me",
      "（你展开纸条，上面是一行很用力的字：早上好，男朋友。字尾画了一朵小小的、歪歪扭扭的花）",
      "lx03"),
    lx03: C("续章 · 后来的我们", "classroom", "😳", "你压着笑，拿起笔。这个早晨，你打算怎么回她？", [
      { label: "（画一朵更大的花）早上好，女朋友。", tag: "甜", eff: 2, flags: { lx_paper: 1 }, next: "lx04a" },
      { label: "放学一起走，有话当面说。", tag: "稳", eff: 1, next: "lx04b" },
      { label: "（偷偷戳戳她的马尾）你也会害羞啊。", tag: "皮", eff: 1, next: "lx04c" }
    ]),
    lx04a: L("续章 · 后来的我们", "classroom", "😆", "her",
      "（她把纸条按在胸口，肩膀一抖一抖地偷笑，假装在看课本，可那一整节课都没翻一页）",
      "lx05"),
    lx04b: L("续章 · 后来的我们", "classroom", "🌸", "her",
      "（她轻轻嗯了一声，声音小得像蚊子，却把这四个字写在草稿纸最上面，圈了一圈又一圈）",
      "lx05"),
    lx04c: L("续章 · 后来的我们", "classroom", "😳", "her",
      "（她小声地说了句“别闹”，耳朵却更红了，嘴角压不住地翘起来）",
      "lx05"),
    lx05: L("续章 · 后来的我们", "classroom", "🍂", "narrator",
      "你们没有声张，只是把这份小心思收进了日常里：一起排队的食堂、靠窗的图书馆、铺满桂花香的小径，和每一个“明天见”。",
      "lx06"),
    lx06: L("续章 · 后来的我们", "classroom", "📢", "narrator",
      "周三的班会课，班主任抱着一摞报名表走进来，把粉笔往讲台一搁：下周三，学校秋季运动会，项目都在这，想报的举手，咱们班拔河和接力不能空。",
      "lx07"),
    lx07: L("续章 · 后来的我们", "classroom", "🏃", "her",
      "（她转过来，笔尖在报名表上那一行停住了）你……会报什么呀？我体育一直不太好，去年只敢去当拉拉队。",
      "lx08"),
    lx08: C("续章 · 后来的我们", "classroom", "🏃", "报名表传了过来，你想和她一起报什么？", [
      { label: "你报跳远，我陪你练，肯定能行。", tag: "鼓励", eff: 2, flags: { lx_sport: "jump" }, next: "lx09a" },
      { label: "那我报接力，你在终点给我加油好不好？", tag: "接力", eff: 1, flags: { lx_sport: "relay" }, next: "lx09b" },
      { label: "那咱们都去拉拉队，拔河我一个人顶。", tag: "护着", eff: 1, flags: { lx_sport: "tug" }, next: "lx09c" }
    ]),
    lx09a: L("续章 · 后来的我们", "classroom", "😳", "her",
      "跳远……（她咬了咬嘴唇，小声）那、那你可要天天陪我练。我落地要是站不稳，你要接住我。",
      "lx10"),
    lx09b: L("续章 · 后来的我们", "classroom", "😊", "her",
      "好啊。（她眼睛弯起来）我会在终点第一个喊你的名字，喊到所有人都听见。",
      "lx10"),
    lx09c: L("续章 · 后来的我们", "classroom", "🤭", "her",
      "（她被你逗笑了）哪有你这么说的……不过拔河要是赢了，我请你喝汽水。",
      "lx10"),

    /* ============ 第一章 · 运动会 ============ */
    lx10: L("第一章 · 运动会", "playground", "🌤️", "narrator",
      "运动会前的一周，操场上总能看见你们的影子。黄昏把跑道染成橘红色，体育老师的哨声、广播里的试音、练习接力的脚步声，混在一起。",
      "lx11"),
    lx11: L("第一章 · 运动会", "playground", "🏃", "narrator",
      "（她站在沙坑前，量了又量助跑的步子，深吸一口气冲出去，起跳，落地——还是踩线了一点，坐在沙里有点泄气）",
      "lx12"),
    lx12: L("第一章 · 运动会", "playground", "😣", "her",
      "我怎么老踩线……是不是没希望了。（她拍着沙子，声音闷闷的）",
      "lx13"),
    lx13: C("第一章 · 运动会", "playground", "🤝", "她垂头丧气地坐在沙坑里，你会怎么做？", [
      { label: "拉她起来，帮她在跑道上重新量步子。", tag: "靠谱", eff: 2, flags: { lx_train: 1 }, next: "lx14a" },
      { label: "递瓶水，说：第一次能跳成这样已经很厉害了。", tag: "温柔", eff: 2, next: "lx14b" },
      { label: "故意开玩笑：沙坑里坐久了会变成小沙人。", tag: "逗她", eff: 1, next: "lx14c" }
    ]),
    lx14a: L("第一章 · 运动会", "playground", "💪", "her",
      "（她任你拉着，在跑道边用脚尖一点点点出记号）原来要踩在这里……你怎么什么都懂。（她抬头看你，眼睛亮亮的）",
      "lx15"),
    lx14b: L("第一章 · 运动会", "playground", "😊", "her",
      "（她捧着水，小口小口地喝，眉头慢慢松开）你这么一说，我好像又有力气了。再来一次！",
      "lx15"),
    lx14c: L("第一章 · 运动会", "playground", "🤭", "her",
      "（她噗地笑出来，拍了拍裤子上的沙）那你负责把我从沙坑里挖出来，再练十次。",
      "lx15"),
    lx15: L("第一章 · 运动会", "playground", "🌇", "narrator",
      "一次次助跑、起跳、落地，沙坑被踩出一个个深浅不一的脚印。她从踩线到稳稳站住，再到能跳出比你想象更远的距离，汗水顺着脸颊往下淌，却笑得越来越大声。",
      "lx16"),
    lx16: L("第一章 · 运动会", "playground", "🌸", "her",
      "（休息时她坐在看台最高的台阶上，膝盖上放着一瓶水，朝你招手）快上来，这里能看到整个操场，连国旗飘的方向都看得清。",
      "lx17"),
    lx17: L("第一章 · 运动会", "playground", "🍃", "narrator",
      "傍晚的风很凉快。你们并排坐着，看低年级的同学在跑道上追跑，看体育老师把跨栏一个个收回器材室。她忽然把头轻轻靠过来，又很快坐直。",
      "lx18"),
    lx18: L("第一章 · 运动会", "playground", "😳", "her",
      "那个……我以前总觉得运动会跟我没关系，就是坐在看台上给别人鼓掌。（她揪着裙摆）可这一周，我居然有点期待它了。",
      "lx19"),
    lx19: C("第一章 · 运动会", "playground", "💗", "风把她的碎发吹到你肩上，你想对她说点什么。", [
      { label: "因为你不再是一个人在边上看了呀。", tag: "心动", eff: 2, flags: { lx_view: 1 }, next: "lx20a" },
      { label: "比赛那天，我眼里只有你这一项。", tag: "甜", eff: 2, next: "lx20b" },
      { label: "那以后每一场，我都陪你报名。", tag: "约定", eff: 1, next: "lx20c" }
    ]),
    lx20a: L("第一章 · 运动会", "playground", "💗", "her",
      "（她愣了一下，然后很慢很慢地，又把头靠了过来，这次没有躲开）嗯……是你把我拉进来看的。",
      "lx21"),
    lx20b: L("第一章 · 运动会", "playground", "😆", "her",
      "（她脸红红的，却故意板着脸）那你接力要是掉棒，我可不理你。",
      "lx21"),
    lx20c: L("第一章 · 运动会", "playground", "🌸", "her",
      "（她伸出小指头）拉钩。以后每一年的运动会，都要一起。",
      "lx21"),
    lx21: L("第一章 · 运动会", "classroom", "📢", "narrator",
      "运动会当天，操场上彩旗招展，主席台上的音响调试着入场词。每个班都有自己的方阵，你们班穿着统一的白T恤，举着写着班号的牌子。",
      "lx22"),
    lx22: L("第一章 · 运动会", "playground", "🎽", "her",
      "（她穿着号码布，紧张得手心都是汗，一直攥着你的衣角）我手心全是汗……心跳好快，比月考还紧张。",
      "lx23"),
    lx23: C("第一章 · 运动会", "playground", "🤝", "她的第一场项目就要开始了，你想怎么给她打气？", [
      { label: "（轻轻握一下她的手）就按我们练的来，我在沙坑边。", tag: "安心", eff: 2, flags: { lx_calm: 1 }, next: "lx24a" },
      { label: "把你号码布给我，我帮你别好。", tag: "细心", eff: 1, next: "lx24b" },
      { label: "别怕，跳砸了我请你吃两根冰棒。", tag: "轻松", eff: 1, next: "lx24c" }
    ]),
    lx24a: L("第一章 · 运动会", "playground", "😊", "her",
      "（她深吸一口气，又慢慢吐出来，手松开了你的衣角）嗯，就按我们练的来。你在，我就不怕。",
      "lx25"),
    lx24b: L("第一章 · 运动会", "playground", "😳", "her",
      "（她乖乖站着让你别号码布，低头看你认真的样子，忽然笑了）你比我还紧张，手都抖啦。",
      "lx25"),
    lx24c: L("第一章 · 运动会", "playground", "🤭", "her",
      "（她被你逗笑，紧张散了大半）那一言为定，我要吃绿豆味的。",
      "lx25"),
    lx25: L("第一章 · 运动会", "playground", "📣", "narrator",
      "广播里念到了她的名字。她站上助跑起点，看台上的同学开始喊加油。她回头望了你一眼，你用力朝她点头。",
      "lx26"),
    lx26: L("第一章 · 运动会", "playground", "🏃", "narrator",
      "她冲了出去。助跑、踏跳、腾空、落地——这一次，脚印稳稳落在沙坑深处，没有踩线。裁判员举旗报出成绩，比她平时任何一次都远。",
      "lx27"),
    lx27: L("第一章 · 运动会", "playground", "🎉", "her",
      "（她从沙坑里站起来，先是愣住，然后几乎是连滚带爬地朝你跑过来，眼睛亮晶晶的）我做到了！我真的做到了！比你画的线还远！",
      "lx28"),
    lx28: C("第一章 · 运动会", "playground", "🎉", "她兴奋地扑过来，你会——", [
      { label: "（张开手接住她）我就说你可以的！", tag: "拥抱", eff: 2, flags: { lx_hug: 1 }, next: "lx29a" },
      { label: "（用力鼓掌）第一名预定，等你领奖！", tag: "克制", eff: 1, next: "lx29b" }
    ]),
    lx29a: L("第一章 · 运动会", "playground", "💗", "her",
      "（她撞进你怀里，又猛地意识到周围全是人，耳朵一下子红透，却还是抓着你的衣角没撒手）就、就抱一下……太开心了嘛。",
      "lx30"),
    lx29b: L("第一章 · 运动会", "playground", "😆", "her",
      "（她在你面前原地蹦了两下，马尾一甩一甩）我要去把成绩告诉班长，再告诉我妈！",
      "lx30"),
    lx30: L("第一章 · 运动会", "playground", "🏆", "narrator",
      "成绩榜贴出来，她拿了年级跳远第三名。领奖时她站在最低的那一级领奖台上，举着奖状，目光却一直在台下找你，找到以后笑得合不拢嘴。",
      "lx31"),
    lx31: L("第一章 · 运动会", "playground", "🎽", "narrator",
      "下午是你报名的项目。如果说她的跳远是意料之外的惊喜，那么男子4×100米接力，就是全班最揪心的一场。",
      "lx32"),
    lx32: L("第一章 · 运动会", "playground", "📣", "her",
      "（她挤到终点线最前面，把拉拉队的花球挥得比谁都用力，嗓子都快喊哑了）加——油——！你一定可以的！",
      "lx33"),
    lx33: L("第一章 · 运动会", "playground", "🏃", "narrator",
      "接力棒一棒一棒传到你手里。接棒的瞬间，你脑子里只有一个念头：她在终点。你冲过最后一个弯道，耳边是风声，也是她喊你名字的声音。",
      "lx34"),
    lx34: L("第一章 · 运动会", "playground", "🥇", "narrator",
      "你们班以半步的优势第一个冲过终点。全班炸了，看台上跳起来一片。你扶着膝盖大口喘气，抬头第一眼就看见她朝你跑过来。",
      "lx35"),
    lx35: L("第一章 · 运动会", "playground", "💦", "her",
      "（她递过水瓶和毛巾，踮脚给你擦汗，完全忘了害羞）你跑得好快！我在终点都看不清你的脸，就看到一道影子冲过去！",
      "lx36"),
    lx36: L("第一章 · 运动会", "playground", "🍉", "narrator",
      "最后一项是拔河。全班排着队，绳子粗得磨手。你和她都站在队伍里——她抱着花球站在最前面领喊，你攥着绳子排在最后压轴。",
      "lx37"),
    lx37: L("第一章 · 运动会", "playground", "💪", "her",
      "（她喊号子喊得脸都红了）一、二！一、二！大家一起用力——！",
      "lx38"),
    lx38: L("第一章 · 运动会", "playground", "🏆", "narrator",
      "红绳在中线来回拉锯，所有人的手都磨得发烫。最后一刻，你们班猛地把绳子拉过线，全班连人带绳倒成一片，笑着、喊着、喘着。",
      "lx39"),
    lx39: L("第一章 · 运动会", "playground", "🌇", "her",
      "（她从人堆里爬起来，头发都乱了，却举着两瓶汽水跑到你面前，把冰的那瓶塞给你）说好了的，赢了我请你——我们班，今天是大赢家。",
      "lx40"),
    lx40: L("第一章 · 运动会", "playground", "🌅", "narrator",
      "夕阳把空下来的操场染成一片暖橘。你们并肩坐在看台最上面，看工作人员收走彩旗，看天上的云慢慢变成鱼鳞的形状。",
      "lx41"),
    lx41: L("第一章 · 运动会", "playground", "💗", "her",
      "今天……谢谢你。（她把奖状卷成小筒，轻轻敲着膝盖）不是因为你陪我练，是因为你让我发现，原来我也可以不是站在边上的那个人。",
      "lx42"),
    lx42: C("第一章 · 运动会", "playground", "💗", "暮色一点点沉下来，你想把这一刻记住。", [
      { label: "（把她的奖状和你的接力奖状并排放在一起）你看，今天我们一起赢。", tag: "并肩", eff: 2, flags: { lx_win: 1 }, next: "lx43a" },
      { label: "明年运动会，咱们还一起。", tag: "约定", eff: 1, next: "lx43b" }
    ]),
    lx43a: L("第一章 · 运动会", "playground", "😊", "her",
      "（她看着两张并排的奖状，看了很久，忽然小声说）这是我收到过最好的一天。",
      "lx44"),
    lx43b: L("第一章 · 运动会", "playground", "🌸", "her",
      "（她用力点头）说定了，一年又一年，直到我们都不用再开运动会的那一天。",
      "lx44"),
    lx44: L("第一章 · 运动会", "playground", "🌙", "narrator",
      "回家的路上，路灯一盏盏亮起来。她抱着奖状，你拎着她的运动鞋，谁都没急着说话，可那一段路，走得比平时都慢。",
      "lx50")
  };

  window.X570_LIN_PART_A = P; /* 先暂存，后续章节在 B/C/D 里合并 */
})();

/* ===== a71_lin_story_b.js ===== */
/* 林晚续章 · 第二部分：晚秋月考 / 冬 / 期末（lx50-lx129） */
(function () {
  function L(ch, loc, emoji, speaker, text, next) { return { type: "line", chapter: ch, loc: loc, speaker: speaker, emoji: emoji, text: text, next: next }; }
  function C(ch, loc, emoji, text, choices) { return { type: "choice", chapter: ch, loc: loc, speaker: "me", emoji: emoji, text: text, choices: choices }; }

  var P = {
    /* ============ 第二章 · 晚秋·月考 ============ */
    lx50: L("第二章 · 晚秋月考", "library", "🍂", "narrator",
      "运动会的热闹像一阵风，吹过就到了深秋。月考的通知贴在走廊里，空气一下子绷紧。图书馆里的座位开始紧张，连食堂排队都有人在背单词。",
      "lx51"),
    lx51: L("第二章 · 晚秋月考", "library", "📚", "her",
      "（她把一摞书放在靠窗的老位置，旁边给你留着座，递给你一张写得密密麻麻的计划表）我把这两周的复习都排好了，我们照着来，你别嫌我啰嗦。",
      "lx52"),
    lx52: L("第二章 · 晚秋月考", "library", "🧑", "me",
      "（计划表上，她的字迹工整到近乎固执，每个时段都标了科目，还在你名字旁边画了个小小的太阳，写着：他数学偏弱，多陪他刷题）",
      "lx53"),
    lx53: C("第二章 · 晚秋月考", "library", "📖", "看着那张计划表，你想说——", [
      { label: "那我负责你最头疼的物理，咱们互相补。", tag: "互助", eff: 2, flags: { lx_study: 1 }, next: "lx54a" },
      { label: "有你排计划，我月考一点都不慌了。", tag: "依赖", eff: 1, next: "lx54b" },
      { label: "（指着小太阳）这是什么意思？", tag: "调侃", eff: 1, next: "lx54c" }
    ]),
    lx54a: L("第二章 · 晚秋月考", "library", "😊", "her",
      "（她眼睛一亮，把计划表转过来，在物理那一栏郑重写下你的名字）好，一言为定。你讲题其实比我清楚，就是太容易粗心。",
      "lx55"),
    lx54b: L("第二章 · 晚秋月考", "library", "😳", "her",
      "（她抿嘴笑）慌什么，慌也没用。你只要像运动会那天一样，相信练过的东西就好。",
      "lx55"),
    lx54c: L("第二章 · 晚秋月考", "library", "😆", "her",
      "（她飞快地把计划表抽回去，用胳膊压着）没、没什么意思，你看错了，那是个圈。",
      "lx55"),
    lx55: L("第二章 · 晚秋月考", "library", "🕯️", "narrator",
      "接下来的十几天，图书馆靠窗的位置成了你们的固定角落。她给你讲语文的答题套路，你给她讲受力分析；谁先困了，就去倒一杯热水，回来继续。",
      "lx56"),
    lx56: L("第二章 · 晚秋月考", "library", "😪", "her",
      "（一天晚自习后，她趴在桌上，眼睛红红的，手里还攥着笔）我是不是太笨了……这道题你讲了三遍，我还是会绕进去。",
      "lx57"),
    lx57: C("第二章 · 晚秋月考", "library", "🤝", "她难得地慌了，你会怎么安慰？", [
      { label: "（把题拆成两步，画一张图）不怪你，是我没讲明白。", tag: "耐心", eff: 2, flags: { lx_patient: 1 }, next: "lx58a" },
      { label: "先合上书包，我带你去走廊走走，吹吹风。", tag: "放松", eff: 2, next: "lx58b" },
      { label: "你不是笨，你是太想做好了。", tag: "懂她", eff: 1, next: "lx58c" }
    ]),
    lx58a: L("第二章 · 晚秋月考", "library", "😊", "her",
      "（她盯着你画的那张图，看了很久，忽然拍了一下桌子）我懂了！原来是这样……你画得比老师还清楚。",
      "lx59"),
    lx58b: L("第二章 · 晚秋月考", "garden", "🍃", "her",
      "（她把外套裹紧，跟你在走廊慢慢走，夜风把脑子里的乱麻吹散了一些）出来走走真好……我刚才差点钻牛角尖了。",
      "lx59"),
    lx58c: L("第二章 · 晚秋月考", "library", "😳", "her",
      "（她愣住，眼眶更红了，却笑了）你怎么总能一句话说到我心里去。",
      "lx59"),
    lx59: L("第二章 · 晚秋月考", "library", "🌙", "narrator",
      "图书馆要关灯了，管理员阿姨开始催人。你们合上书，她把那张计划表折好夹进笔袋，动作很轻，像在收一件很重要的东西。",
      "lx60"),
    lx60: L("第二章 · 晚秋月考", "gate", "🌙", "her",
      "（走到公交站，她忽然停下）你说……我们这样天天一起，会不会有一天，考到不一样的地方去？",
      "lx61"),
    lx61: C("第二章 · 晚秋月考", "gate", "🌙", "夜风吹过来，她问了一个很远的问题。", [
      { label: "那我们就约好，考去同一个城市。", tag: "约定", eff: 2, flags: { lx_city: 1 }, next: "lx62a" },
      { label: "不管在哪，我都会回来找你。", tag: "笃定", eff: 2, next: "lx62b" },
      { label: "现在先把月考考好，未来的事，我们一起想。", tag: "踏实", eff: 1, next: "lx62c" }
    ]),
    lx62a: L("第二章 · 晚秋月考", "gate", "💗", "her",
      "（她抬头看你，路灯在她眼睛里亮着）同一个城市……好，这也算我们的目标，我要写进计划表最后一页。",
      "lx63"),
    lx62b: L("第二章 · 晚秋月考", "gate", "😊", "her",
      "（她小声重复了一遍“回来找你”，像在确认，然后轻轻点头）我等你，不管多远。",
      "lx63"),
    lx62c: L("第二章 · 晚秋月考", "gate", "🌸", "her",
      "（她想了想，释然地笑了）也是。未来太远了，先把眼前这道题、这场试，和你一起过完。",
      "lx63"),
    lx63: L("第二章 · 晚秋月考", "classroom", "📝", "narrator",
      "月考三天，教室里只剩笔尖划过纸面的沙沙声。你经过她座位时，她抬头冲你比了个加油的手势，又低头飞快地写下去。",
      "lx64"),
    lx64: L("第二章 · 晚秋月考", "classroom", "📊", "narrator",
      "出成绩那天，班长抱着一摞成绩单冲进教室。她把你和她的两张并在一起，看了又看，忽然捂住嘴，眼眶又红了。",
      "lx65"),
    lx65: L("第二章 · 晚秋月考", "classroom", "🎉", "her",
      "你的数学……进步了整整二十名！（她声音都在抖，又赶紧压下去）我们那段时间刷的题，没有白费，一点都没有。",
      "lx66"),
    lx66: L("第二章 · 晚秋月考", "classroom", "😊", "narrator",
      "她自己考得也很好，稳居年级前列。可她最高兴的，似乎不是自己的名次，而是你那张进步明显的成绩单。",
      "lx67"),
    lx67: C("第二章 · 晚秋月考", "classroom", "🎁", "你想怎么庆祝这次一起熬出来的进步？", [
      { label: "放学请你吃你最爱的那家烤红薯。", tag: "小确幸", eff: 1, next: "lx68a" },
      { label: "把我们俩的成绩写在计划表最后一页，盖个章。", tag: "仪式感", eff: 2, flags: { lx_goal: 1 }, next: "lx68b" },
      { label: "周末带你去看场电影，放松一下。", tag: "约会", eff: 1, next: "lx68c" }
    ]),
    lx68a: L("第二章 · 晚秋月考", "gate", "🍠", "her",
      "（校门口的烤红薯摊冒着白汽，她捧着烫红薯，吃得鼻尖通红，含糊不清地说）这是我吃过最甜的一次，真的。",
      "lx69"),
    lx68b: L("第二章 · 晚秋月考", "library", "✏️", "her",
      "（她郑重地在计划表最后一页写下两个名字和两排数字，画了个小小的红圈）从今天起，这一页专门记我们一起做到的事。",
      "lx69"),
    lx68c: L("第二章 · 晚秋月考", "gate", "🎬", "her",
      "（她眼睛亮了）那我要看轻松的，不许看催泪的，我最近眼睛都肿了。",
      "lx69"),
    lx69: L("第二章 · 晚秋月考", "garden", "🍂", "narrator",
      "深秋风大，桂花早谢了。可你们走在小径上，谁都不觉得冷。她忽然说，原来两个人一起努力，连辛苦都能变成值得记住的事。",
      "lx70"),

    /* ============ 第三章 · 冬 ============ */
    lx70: L("第三章 · 冬至", "classroom", "🌨️", "narrator",
      "冬天是踩着第一场早读来的。窗玻璃上结了一层薄雾，有同学在上面画笑脸。你和她隔着一排座位，各自呵着气写作业，偶尔抬头，目光撞上，又各自低下头去。",
      "lx71"),
    lx71: L("第三章 · 冬至", "canteen", "🍲", "her",
      "（食堂开始卖汤圆和馄饨，她端着两碗热乎乎的汤圆坐到你对面）今天冬至，我妈说要吃汤圆，不然冬天会冻耳朵。来，分你一碗。",
      "lx72"),
    lx72: L("第三章 · 冬至", "canteen", "🥣", "narrator",
      "芝麻馅的汤圆冒着热气，她吃得很认真，还不忘数着你吃了几个。窗外飘起细碎的雪粒，食堂里一片模糊的暖意。",
      "lx73"),
    lx73: L("第三章 · 冬至", "canteen", "😳", "her",
      "（她忽然想起什么，从书包里掏出一条围巾，毛线织得不太整齐，边角还能看出拆了重织的痕迹）这个……我织了快一个月，可能有点丑，你别嫌弃。",
      "lx74"),
    lx74: C("第三章 · 冬至", "canteen", "🧣", "她把一条手织围巾递到你面前，你会——", [
      { label: "（立刻围上，认真地照了照手机）很暖，比商店买的好一百倍。", tag: "珍视", eff: 2, flags: { lx_scarf: 1 }, next: "lx75a" },
      { label: "（拆下来给她也围一半）那我们一起围，才不浪费。", tag: "亲密", eff: 2, next: "lx75b" },
      { label: "你织了一个月？手有没有被针扎到？", tag: "心疼", eff: 1, next: "lx75c" }
    ]),
    lx75a: L("第三章 · 冬至", "canteen", "😊", "her",
      "（她看着你围得严严实实，眼睛弯成月牙）你不嫌弃就好……我拆了好多次，怕颜色你不喜欢。",
      "lx76"),
    lx75b: L("第三章 · 冬至", "canteen", "💗", "her",
      "（她愣住，任由你把围巾的另一头搭在她肩上，脸一点点红到耳根）这样……会被同学看到的。可她没有躲开。",
      "lx76"),
    lx75c: L("第三章 · 冬至", "canteen", "😳", "her",
      "（她把手藏到桌下，指尖其实有两个小小的针孔）就、就一点点，没关系的。你喜欢就好。",
      "lx76"),
    lx76: L("第三章 · 冬至", "playground", "🌨️", "narrator",
      "雪越下越大，到课间已经能在操场上积起薄薄一层。同学们疯了一样涌出去打雪仗，尖叫声、笑声混在一起。",
      "lx77"),
    lx77: L("第三章 · 冬至", "playground", "⛄", "her",
      "（她小心翼翼地蹲在雪地里，团了一个很小的雪球，像怕弄疼了雪似的）我从来没认真打过雪仗……你教我？",
      "lx78"),
    lx78: C("第三章 · 冬至", "playground", "⛄", "第一场雪，你想怎么和她玩？", [
      { label: "（团一个雪球塞给她）来，我教你，先躲我一下！", tag: "玩闹", eff: 1, next: "lx79a" },
      { label: "我们不打雪仗，一起堆个雪人吧。", tag: "温柔", eff: 2, flags: { lx_snow: 1 }, next: "lx79b" },
      { label: "（把围巾给她系紧）先别冻着，慢慢玩。", tag: "体贴", eff: 1, next: "lx79c" }
    ]),
    lx79a: L("第三章 · 冬至", "playground", "🤭", "her",
      "（她抱着雪球追你，笑得直不起腰，最后把那个小得可怜的雪球轻轻按在你肩上，宣布）命中！我赢了！",
      "lx80"),
    lx79b: L("第三章 · 冬至", "playground", "⛄", "her",
      "（你们一人团一个雪球，给雪人安上石子眼睛和树叶嘴，她把自己的发卡别在雪人头上）它笑起来好像你。",
      "lx80"),
    lx79c: L("第三章 · 冬至", "playground", "😊", "her",
      "（她摸了摸被你系紧的围巾，乖乖点头）好，我不冷。有你在，冬天好像没那么难熬。",
      "lx80"),
    lx80: L("第三章 · 冬至", "garden", "🌙", "narrator",
      "雪停的那晚，你们没有立刻回家。校园小径被踩出两排并行的脚印，路灯把雪照得发亮，像铺了一层碎银。",
      "lx81"),
    lx81: L("第三章 · 冬至", "garden", "🎄", "her",
      "（她踩着雪，忽然想起）快到圣诞节了，班里说要办晚会，还要交换匿名礼物。我已经在想……要送什么了。",
      "lx82"),
    lx82: L("第三章 · 冬至", "classroom", "🎁", "narrator",
      "圣诞晚会那天，教室被气球和彩带布置得满满当当。黑板上写着“交换礼物”，每个人的礼物都编了号，等着随机被抽走。",
      "lx83"),
    lx83: L("第三章 · 冬至", "classroom", "🎁", "narrator",
      "你抽到的，是一个用浅粉色包装纸仔细包好的盒子，上面贴着一张小小的卡片，字迹你再熟悉不过。",
      "lx84"),
    lx84: L("第三章 · 冬至", "classroom", "💌", "narrator",
      "卡片上写着：给我最想让他抽到的人。打开盒子，是一本手抄的诗集，里面夹着一片压干的桂花，扉页上抄着一句你曾在她书里看到的诗。",
      "lx85"),
    lx85: L("第三章 · 冬至", "classroom", "🌸", "her",
      "（她坐在人群里，假装在和同桌说笑，眼睛却一直往你这边瞟，红得像圣诞树上的灯）",
      "lx86"),
    lx86: C("第三章 · 冬至", "classroom", "🎁", "你手里捧着她偷偷送出的诗集，你会——", [
      { label: "（穿过人群，走到她面前）这本，我猜到是你了。", tag: "默契", eff: 2, flags: { lx_gift: 1 }, next: "lx87a" },
      { label: "（什么也不说，把诗集抱在胸口，冲她笑）", tag: "默契", eff: 1, next: "lx87b" },
      { label: "（把你准备的礼物悄悄放到她桌上）", tag: "回礼", eff: 2, next: "lx87c" }
    ]),
    lx87a: L("第三章 · 冬至", "classroom", "😳", "her",
      "（她猛地低下头，耳朵红透了，半天才小声说）这么明显吗……那、那你可要好好收着，那是我抄了很久的。",
      "lx88"),
    lx87b: L("第三章 · 冬至", "classroom", "💗", "her",
      "（她隔着人群和你对视，谁都没说话，可她笑了，是那种藏不住的、很满足的笑）",
      "lx88"),
    lx87c: L("第三章 · 冬至", "classroom", "😊", "her",
      "（她拆开你放在桌上的礼物，是一支她念叨过很久的钢笔，她握着笔，小声地说了句谢谢，声音轻得像怕惊碎了什么）",
      "lx88"),
    lx88: L("第三章 · 冬至", "gate", "🎆", "narrator",
      "跨年那天，班里几个相熟的同学约着一起去江边。倒计时的人群里，你们站在稍微靠后的位置，仰着头看大屏幕上跳动的数字。",
      "lx89"),
    lx89: L("第三章 · 冬至", "gate", "🎆", "narrator",
      "十、九、八……人群一起喊。最后一声落下，烟花在夜空炸开，所有人都在欢呼、拥抱。",
      "lx90"),
    lx90: L("第三章 · 冬至", "gate", "💗", "her",
      "（烟花炸开的一瞬间，她踮起脚，在你耳边用很轻很轻的声音说）新年快乐。新的一年，我还想和你一起。",
      "lx91"),
    lx91: C("第三章 · 冬至", "gate", "🎆", "漫天烟花下，你想对她说的新年愿望是——", [
      { label: "我的愿望很简单：明年这时候，身边还是你。", tag: "笃定", eff: 2, flags: { lx_newyear: 1 }, next: "lx92a" },
      { label: "（轻声）我想和你，考去同一个城市。", tag: "目标", eff: 2, next: "lx92b" },
      { label: "（握紧她的手）新年快乐，林晚。", tag: "温暖", eff: 1, next: "lx92c" }
    ]),
    lx92a: L("第三章 · 冬至", "gate", "💗", "her",
      "（她在烟花的光里用力点头，眼眶发亮）一定，一定还是我。",
      "lx93"),
    lx92b: L("第三章 · 冬至", "gate", "🌸", "her",
      "（她小声重复）同一个城市……好，这是我们今年的第一个约定。",
      "lx93"),
    lx92c: L("第三章 · 冬至", "gate", "😊", "her",
      "（她回握住你的手，把你的手塞进她的口袋里）这样暖和，我们就这样走回家。",
      "lx93"),
    lx93: L("第三章 · 冬至", "library", "📚", "narrator",
      "新年之后就是期末。图书馆的灯亮到很晚，你们照例坐在靠窗的老位置，只是这一次，计划表上多了一个写得很大的目标：同一个城市。",
      "lx94"),
    lx94: L("第三章 · 冬至", "classroom", "🏆", "narrator",
      "期末考结束那天，下起了这个冬天最大的一场雪。你们交了最后一张卷子，走出教学楼，整个校园白茫茫的，安静得能听见落雪的声音。",
      "lx95"),
    lx95: L("第三章 · 冬至", "playground", "❄️", "her",
      "（她在雪地里转了个圈，呼出的白气在冷空气里散开）这学期……好像发生了好多好多事。运动会、月考、第一场雪、跨年……",
      "lx96"),
    lx96: L("第三章 · 冬至", "playground", "🌸", "her",
      "（她停下来，认真地看着你）谢谢你把这一年变得这么不一样。以前我总觉得高中就是一摞摞卷子，现在我知道，不是的。",
      "lx97"),
    lx97: C("第三章 · 冬至", "playground", "❄️", "大雪里，一个学期走到了尽头。", [
      { label: "下学期，还有更多日子，我们一起。", tag: "约定", eff: 1, next: "lx98a" },
      { label: "（把围巾分给她一半）走吧，趁雪还没停。", tag: "温暖", eff: 2, flags: { lx_semester: 1 }, next: "lx98b" }
    ]),
    lx98a: L("第三章 · 冬至", "playground", "😊", "her",
      "（她伸出手，接住一片雪花）好，一个学期接一个学期，我们都不缺席。",
      "lx100"),
    lx98b: L("第三章 · 冬至", "playground", "💗", "her",
      "（她躲进围巾的另一半里，你们并肩走在雪地里，两排脚印渐渐并成了一排）",
      "lx100"),
    lx100: L("第三章 · 冬至", "gate", "🧧", "narrator",
      "寒假开始了。你们隔着手机互道晚安，她每天给你发一张窗外的照片：雪后的屋顶、窗台的多肉、还有她写的福字。",
      "lx101"),
    lx101: L("第三章 · 冬至", "gate", "🧨", "narrator",
      "除夕的鞭炮声里，她发来一条消息：新年快乐（虽然跨年年已经说过一次）。还有一个红包，备注写着：给我最想一起开学的人。",
      "lx102"),
    lx102: L("第三章 · 冬至", "gate", "🧧", "narrator",
      "你点开红包，金额不大，是个被她特意挑过的数字，配着一个害羞的表情。你回了一个更大的红包，她立刻发来一串“亏了亏了”的表情包，最后却小声说：我才不亏，我赚到了一个你。",
      "lx103")
  };
  window.X570_LIN_PART_B = P;
})();

/* ===== a72_lin_story_c.js ===== */
/* 林晚续章 · 第三部分：春 / 生日 / 高考 / 毕业结局 + 合并入库（lx103-lxEnd） */
(function () {
  function L(ch, loc, emoji, speaker, text, next) { return { type: "line", chapter: ch, loc: loc, speaker: speaker, emoji: emoji, text: text, next: next }; }
  function C(ch, loc, emoji, text, choices) { return { type: "choice", chapter: ch, loc: loc, speaker: "me", emoji: emoji, text: text, choices: choices }; }
  function E(emoji, title, text) { return { type: "end", emoji: emoji, title: title, text: text }; }

  var P = {
    /* ============ 第四章 · 春 ============ */
    lx103: L("第四章 · 春", "classroom", "🌱", "narrator",
      "开学那天，操场边的柳树刚冒出嫩黄的芽。你走进教室，前桌那个熟悉的背影已经在了，桌上摆着两杯豆浆，一杯是她的，一杯是给你的。",
      "lx104"),
    lx104: L("第四章 · 春", "classroom", "🌸", "her",
      "（她转过头，把其中一杯推给你，语气故作平静）开学第一天，怕你迟到没吃早饭。才不是特意买的，我只是顺手。",
      "lx105"),
    lx105: L("第四章 · 春", "classroom", "🧑", "me",
      "（豆浆还是热的，杯壁上贴着一张便利贴，写着：新学期也要一起加油。末尾照例是那朵歪歪扭扭的小花）",
      "lx106"),
    lx106: L("第四章 · 春", "garden", "🌷", "narrator",
      "春天的校园像被人重新上了色。小径旁的迎春黄了一片，樱花树的花苞一天天鼓起来。她开始念叨，说等樱花开了，要在树下拍一张照片。",
      "lx107"),
    lx107: L("第四章 · 春", "library", "🎂", "her",
      "（一天晚自习，她装作不经意地把一张借书证放在你面前，手指点着上面的出生日期）下周……有个日子。你猜猜看是什么日子。",
      "lx108"),
    lx108: C("第四章 · 春", "library", "🎂", "她红着脸暗示你，你会怎么接？", [
      { label: "（心里一紧又一喜）我记得，是你的生日。", tag: "上心", eff: 2, flags: { lx_birthday: 1 }, next: "lx109a" },
      { label: "（故意逗她）什么日子？难道是我们的纪念日？", tag: "俏皮", eff: 1, next: "lx109b" },
      { label: "让我看看……（认真地把日期记在手机锁屏上）", tag: "细心", eff: 2, next: "lx109c" }
    ]),
    lx109a: L("第四章 · 春", "library", "💗", "her",
      "（她眼睛一下子亮起来，又赶紧低头假装翻书）你、你居然真的记得……那我等着。",
      "lx110"),
    lx109b: L("第四章 · 春", "library", "🤭", "her",
      "（她拍了一下你的胳膊，脸红红的）少臭美！是我的生日啦，你要是敢忘，我就……我就一周不理你。",
      "lx110"),
    lx109c: L("第四章 · 春", "library", "😊", "her",
      "（她看你郑重其事地把日期设成锁屏，嘴角压不住地翘起来）这么认真啊……那我可以小小地期待一下。",
      "lx110"),
    lx110: L("第四章 · 春", "garden", "🎁", "narrator",
      "她生日前的几天，你想了很久要送什么。她爱读诗，写字好看，喜欢一切安静又认真的东西。你最后决定，亲手做一件，比买一件更重要。",
      "lx111"),
    lx111: L("第四章 · 春", "garden", "🌸", "narrator",
      "她生日那天，樱花开得正好。午后的阳光透过花瓣，洒下一地碎光。你约她放学去樱花树下，说有东西要给她。",
      "lx112"),
    lx112: L("第四章 · 春", "garden", "🎁", "narrator",
      "（你把一个用牛皮纸包好的本子递给她。那是你用了好几周、抄了又改的东西——一本专门写给她的诗集，最后一页是你自己写的、不算工整却很认真的几句话）",
      "lx113"),
    lx113: L("第四章 · 春", "garden", "📖", "narrator",
      "她一页一页地翻，风把花瓣吹落在纸页上。翻到最后一页时，她的手指停住了，肩膀轻轻发抖。",
      "lx114"),
    lx114: L("第四章 · 春", "garden", "🥹", "her",
      "（她抬起头，眼眶红红的，声音发颤）你怎么……写得这么笨啊，可我……可我想一直留着它。",
      "lx115"),
    lx115: C("第四章 · 春", "garden", "🎂", "樱花落在她肩上，你想对她说的话是——", [
      { label: "生日快乐，林晚。以后每个生日，我都想在。", tag: "承诺", eff: 2, flags: { lx_promise: 1 }, next: "lx116a" },
      { label: "（捡起一朵樱花别在她发间）你比花好看。", tag: "心动", eff: 2, next: "lx116b" },
      { label: "你别哭啊，哭花了脸，等下怎么拍照。", tag: "逗她", eff: 1, next: "lx116c" }
    ]),
    lx116a: L("第四章 · 春", "garden", "💗", "her",
      "（她用力点头，眼泪掉下来，却笑得很好看）好，你说的，每个生日都要在。我记一辈子。",
      "lx117"),
    lx116b: L("第四章 · 春", "garden", "😳", "her",
      "（她摸着发间的花瓣，破涕为笑，低头说）……你最近怎么越来越会说话了。",
      "lx117"),
    lx116c: L("第四章 · 春", "garden", "🤭", "her",
      "（她赶紧抹了抹眼角，被你逗笑）那、那你负责把我拍得好看一点。",
      "lx117"),
    lx117: L("第四章 · 春", "garden", "📷", "narrator",
      "你们在樱花树下拍了一张照片。她抱着那本诗册，肩上落着花瓣，笑得眼睛弯弯。你把照片洗成两张，一人一张，夹在各自最常用的课本里。",
      "lx118"),
    lx118: L("第四章 · 春", "garden", "🌸", "her",
      "（回家的路上她忽然说）你知道吗，我以前总觉得，喜欢一个人是很安静的事，就像读诗，一个人心里翻涌就好。可是你让我知道，喜欢也可以被说出来、被记住、被写下来。",
      "lx119"),

    /* ============ 第五章 · 心之所向（高考·毕业） ============ */
    lx119: L("第五章 · 心之所向", "library", "📚", "narrator",
      "日子翻到高三的那一章。计划表换了一张又一张，靠窗的位置多了一盏台灯，倒计时牌上的数字一天天变小，从三位数，变成两位数，再变成个位数。",
      "lx120"),
    lx120: L("第五章 · 心之所向", "classroom", "📝", "narrator",
      "最后一个月，晚自习的灯常常亮到十点。她困了就趴在桌上眯一会儿，你把外套轻轻搭在她肩上；你算题卡住，她会把写好思路的纸条推过来。",
      "lx121"),
    lx121: L("第五章 · 心之所向", "classroom", "🌙", "her",
      "（高考前一晚，她在公交站给你发消息，又跑到你面前，把一个小布袋塞给你）里面是我折的幸运星，还有一张纸条。你明天考完再打开。",
      "lx122"),
    lx122: L("第五章 · 心之所向", "classroom", "📝", "narrator",
      "高考那两天，太阳很大，校门口拉起警戒线，送考的家长举着向日葵。你们隔着人群挥手，她朝你比了一个加油的手势，和很多年前第一次月考时一模一样。",
      "lx123"),
    lx123: L("第五章 · 心之所向", "classroom", "🔔", "narrator",
      "最后一门考试结束的铃声响起，整个校园轰然沸腾。有人把卷子抛向天空，有人抱在一起哭，有人在校服上让同学签名。你冲出考场，第一眼就在人群里找她。",
      "lx124"),
    lx124: L("第五章 · 心之所向", "gate", "💗", "her",
      "（她也在找你，目光相遇的瞬间，她提着裙摆跑过来，跑得气喘吁吁，停在你面前，仰着头笑）考完了。我们……真的考完了。",
      "lx125"),
    lx125: L("第五章 · 心之所向", "gate", "🌟", "narrator",
      "你这才想起那个小布袋。你打开它，倒出一把折得整整齐齐的幸运星，展开那张纸条。",
      "lx126"),
    lx126: L("第五章 · 心之所向", "gate", "💌", "narrator",
      "纸条上是她的字：不管最后我们考去了哪里，我都很庆幸，那年开学，我把课程表递给的人是你。心之所向，是你。",
      "lx127"),
    lx127: L("第五章 · 心之所向", "gate", "😳", "her",
      "（她看你读完，脸涨得通红，却没有躲，反而很认真地看着你）我想了很久才敢写下来。你……你不用现在回答我，等成绩出来，等我们知道去向。",
      "lx128"),
    lx128: C("第五章 · 心之所向", "gate", "💗", "高中走到最后一个路口，你想怎么回答她？", [
      { label: "（把纸条贴在胸口）我不用等，答案从一开始就是你。", tag: "笃定", eff: 2, flags: { lx_final: 1 }, next: "lx129a" },
      { label: "同一个城市，我已经报了，等我兑现。", tag: "兑现", eff: 2, next: "lx129b" },
      { label: "（牵起她的手）不管结果怎样，我们都一起面对。", tag: "并肩", eff: 1, next: "lx129c" }
    ]),
    lx129a: L("第五章 · 心之所向", "gate", "💗", "her",
      "（她怔住，眼里瞬间蓄满了泪，却笑出了声）你总是这样……总能在我最慌的时候，给我一个最稳的答案。",
      "lx130"),
    lx129b: L("第五章 · 心之所向", "gate", "🌸", "her",
      "（她捂住嘴，眼泪掉下来）我也是……我所有志愿的第一个城市，都和你填的一样。",
      "lx130"),
    lx129c: L("第五章 · 心之所向", "gate", "😊", "her",
      "（她把手放进你掌心，紧紧握着）好，一起面对。成绩、远方、以后的一切，都一起。",
      "lx130"),
    lx130: L("第五章 · 心之所向", "classroom", "🎓", "narrator",
      "毕业典礼那天，操场上搭起了台子。你们穿着校服，在校服背后互相签名。她把名字写在你后背最靠近心口的位置，又让你在她的校服上写下同样的两个字。",
      "lx131"),
    lx131: L("第五章 · 心之所向", "garden", "🌳", "narrator",
      "散场后，你们又走到那条铺满桂花又看过樱花的小径。季节正好是夏天，树叶绿得发亮。你们在第一次一起坐下的那张长椅前停下。",
      "lx132"),
    lx132: L("第五章 · 心之所向", "garden", "🌸", "her",
      "（她坐在长椅上，像三年前那个初秋一样，只是这一次，她很自然地把头靠在你肩上）你看，从这张长椅开始，我们走过了运动会、月考、冬天、樱花、高考……",
      "lx133"),
    lx133: L("第五章 · 心之所向", "garden", "💗", "her",
      "我以前不知道“心之所向”是什么，总觉得它应该是很远很大的东西，比如一所大学、一个梦想。后来我才明白，它有时候就是一个很具体的人——是你。",
      "lx134"),
    lx134: C("第五章 · 心之所向", "garden", "💗", "故事走到这里，你想对她说的最后一句话是——", [
      { label: "那我们就一直，心之所向，素履以往。", tag: "结局", eff: 2, next: "lxEnd_sweet" },
      { label: "高中结束了，但我们的故事，才刚刚开始。", tag: "结局", eff: 1, next: "lxEnd_normal" }
    ]),

    /* 续章结局 */
    lxEnd_sweet: E("💗", "续章结局 · 心之所向",
      "后来，你们真的考去了同一个城市。开学那天，她抱着诗集，拖着行李箱，在陌生的校园门口等你，像三年前在高一（3）班的门口等你一样。\n\n她说：你看，我们说好的，一个城市。\n你说：以后还会有很多个约定，我们一个一个去兑现。\n\n风从很远的地方吹来，带着桂花和樱花的气息。原来最好的故事，从来不是轰轰烈烈，而是把一个普通的人，认真地、一年又一年地，喜欢下去。\n\n——心之所向，是你。全剧终。"),
    lxEnd_normal: E("🌤️", "续章结局 · 未完待续",
      "成绩出来那天，你们的分数指向不同的城市。她在电话那头沉默了很久，然后很轻地说：没关系，心之所向不会因为距离改变。\n\n你们开始了异地的日子，隔着屏幕说晚安，攒着车票去见面。距离没有冲淡什么，反而让每一次相见都变得格外珍重。\n\n故事没有在高中毕业这里结束——它只是换了一种方式继续。只要你们还愿意，下一章，仍然可以一起写。\n\n——未完待续。")
  };

  /* ---------- 合并三部分，追加进林晚剧本（不覆盖） ---------- */
  function init() {
    function tryAppend() {
      if (!window.X56StoryContent || !window.X570) return false;
      var all = {};
      [window.X570_LIN_PART_A, window.X570_LIN_PART_B, P].forEach(function (part) {
        if (part) for (var k in part) if (Object.prototype.hasOwnProperty.call(part, k) && !all[k]) all[k] = part[k];
      });
      var added = X570.Story.appendBook("lin", all);
      return added > 0;
    }
    var n = 0;
    var t = setInterval(function () {
      n++;
      if (tryAppend() || n > 80) clearInterval(t);
    }, 250);

    X570.LinEx = {
      enter: function (myName) {
        X570.Story.enterAt("lin", "lx00", myName);
      }
    };
  }
  X570.register("linEx", init, 5);
})();

/* ===== a73_lin_story_d.js ===== */
/* =====================================================================
   林晚续章 · 番外《三百零五天》（仅扩充林晚线，不新增线路）
   补足到约 2 万字；在续章结局页可进入，讲录取后那个夏天的日常
   ===================================================================== */
(function () {
  function L(chapter, loc, emoji, speaker, text, next) {
    return { type: "line", chapter: chapter, loc: loc, emoji: emoji, speaker: speaker, text: text, next: next };
  }
  function C(chapter, loc, emoji, text, choices) {
    return { type: "choice", chapter: chapter, loc: loc, emoji: emoji, text: text, choices: choices };
  }
  function E(emoji, title, text) {
    return { type: "end", emoji: emoji, title: title, text: text };
  }
  var CH = "番外 · 三百零五天";

  var P = {
    lx200: L(CH, "classroom", "🌤️", "narrator",
      "高考结束的那个夏天，意外地漫长。成绩出来、志愿填完、录取通知到手，你们像忽然被松开了发条的人，第一次拥有了一大段没有作业、没有倒计时的日子。你和林晚约好，把高中三年没来得及一起做的小事，一件一件补回来。",
      "lx201"),
    lx201: L(CH, "hall", "📮", "her",
      "（她举着手机在班级群里发通知，额前有薄薄的汗）录取结果大家都收到了吧？我们说好要回学校拍一次正式的合影，穿校服的那种，别迟到。",
      "lx202"),
    lx202: L(CH, "classroom", "📷", "me",
      "（你站在熟悉的高一（3）班门口，阳光还是像三年前一样，从走廊那一头斜斜地照过来）我忽然有点恍惚——好像下一秒，班主任就会拿着点名册走出来。",
      "lx203"),
    lx203: L(CH, "classroom", "🌸", "her",
      "（她在原来的座位上坐下，拍了拍身边的椅子，像很多个晚自习那样）你坐这儿。三年前你就是坐我后桌的，现在我把位置还给你一次。",
      "lx204"),
    lx204: C(CH, "classroom", "💗", "在熟悉的课桌前，你想——", [
      { label: "在她旁边坐下，说：这次我不走了。", eff: 1, next: "lx205" },
      { label: "笑着说：还是后桌视角看你最习惯。", eff: 0, next: "lx205" }
    ]),
    lx205: L(CH, "classroom", "😄", "her",
      "（她被你逗笑，低头把一缕头发别到耳后，耳根有点红）你啊，三年了，还是这么会说话。",
      "lx206"),
    lx206: L(CH, "classroom", "📖", "narrator",
      "你们在教室里慢慢走，指着一个个位置回忆：谁上课总打瞌睡，谁的抽屉里永远有零食，谁在墙上贴过一张没署名的明信片。那些原本以为会永远鲜明的细节，原来已经被时间悄悄磨软了。",
      "lx207"),
    lx207: L(CH, "classroom", "🪞", "her",
      "（她在黑板前站定，拿起粉笔，在正中央慢慢写下六个字）杭州西子实验学校。写完她退后一步看了看，说：我想把它记住，连同这间教室、这扇窗、还有你。",
      "lx208"),
    lx208: L(CH, "classroom", "✏️", "me",
      "（你接过粉笔，在她写的字下面，又添了一行小字）二〇二X 届，高一（3）班，永远。",
      "lx209"),
    lx209: L(CH, "classroom", "📸", "narrator",
      "快门声响起来的时候，全班都在笑。有人扔起了校服外套，有人偷偷红了眼眶。你站在林晚旁边，隔着人群，和她交换了一个只有彼此懂的眼神。",
      "lx210"),
    lx210: L(CH, "street", "🍉", "narrator",
      "拍完合影，你们绕着学校外面那条走了三年的小路慢慢逛。小卖部换了新招牌，修自行车的老爷爷还在，只是头发更白了。",
      "lx211"),
    lx211: L(CH, "shop", "🥤", "her",
      "（她在小卖部的冰柜前犹豫了一下，最后拿了两瓶冰红茶，递给你一瓶，理直气壮）这次换我请你。以前总喝你买的，今天我还你一瓶。",
      "lx212"),
    lx212: L(CH, "garden", "🌿", "me",
      "（你们在花坛边的台阶上坐下，拧开瓶盖时发出很轻的一声响。橘猫不知从哪里踱过来，懒洋洋地趴在你们脚边，像三年前的每一个午后一样）",
      "lx213"),
    lx213: L(CH, "garden", "🐱", "her",
      "（她撕开一小包火腿肠，分了一半给猫，一半的一半递给你）它也毕业啦，你看，它都不记得我们了，只记得火腿肠。",
      "lx214"),
    lx214: L(CH, "garden", "🌅", "narrator",
      "那天的晚霞铺得很满，从教学楼顶一直烧到天边。你们谁也没急着说话，就那样安静地并肩坐着，看天色一点一点暗下来。",
      "lx215"),
    lx215: L(CH, "library", "📚", "her",
      "（几天后，她约你去图书馆办退证手续，在靠窗的位置前停下）这个位置，我高一时借过你一次。你那天还睡着了，口水差点流到我的诗集上。",
      "lx216"),
    lx216: L(CH, "library", "😅", "me",
      "（你不好意思地挠头）原来你还记得这个。我还以为你只记得我借你雨伞、给你讲题这种比较帅的画面。",
      "lx217"),
    lx217: L(CH, "library", "🌸", "her",
      "（她认真地摇头）我都记得。帅的、笨的、逞强的、出糗的，都记得。因为那都是你。",
      "lx218"),
    lx218: L(CH, "library", "📖", "narrator",
      "她把一本旧诗集放在桌上，翻开扉页，里面夹着一片压得很平的桂花，和一张小小的纸条。纸条上是她的字迹，写着：送给后桌的你，要一直往前走。",
      "lx219"),
    lx219: L(CH, "library", "💗", "me",
      "（你看着那张纸条，忽然明白，有些心动原来比你以为的还要早。你轻声问）这张纸条，你是什么时候写的？",
      "lx220"),
    lx220: L(CH, "library", "☺️", "her",
      "（她把脸埋进书页里，声音闷闷的）……高一，运动会之后那次。你帮我捡了发夹，第二天我就写了，只是没敢给你。",
      "lx221"),
    lx221: L(CH, "library", "💫", "me",
      "（你忍不住笑，心里某个悬了很久的地方轻轻落了地）原来我们绕了这么久，才走到同一张桌子前。",
      "lx222"),
    lx222: L(CH, "playground", "🏃", "narrator",
      "夏天的傍晚，你们又去了操场。跑道被白天的太阳晒得温热，跑起来时风灌满校服，像回到了体测的那些下午。",
      "lx223"),
    lx223: L(CH, "playground", "🏁", "her",
      "（她喘着气，却不肯停下来，回头对你喊）我们比一场，谁先到终点，谁就要答应对方一件事！",
      "lx224"),
    lx224: C(CH, "playground", "🏃", "你决定——", [
      { label: "全力冲刺，赢下这场比赛。", eff: 1, next: "lx225" },
      { label: "故意慢半步，让她赢。", eff: 1, next: "lx225" }
    ]),
    lx225: L(CH, "playground", "😄", "her",
      "（不管谁赢，最后你们都在终点线前笑着停下来，弯着腰大口喘气。她忽然说）其实我想让你答应的事，特别简单。",
      "lx226"),
    lx226: L(CH, "playground", "🌙", "her",
      "以后不管去了哪个城市，遇到多难的事，都不要把我忘了，也不要把自己弄丢。我们要像在这条跑道上一样，一直往前跑，谁也不许停下。",
      "lx227"),
    lx227: L(CH, "playground", "💗", "me",
      "（你很认真地点头，伸出小拇指）拉钩。心之所向，素履以往——这一次，我把这句话也分你一半。",
      "lx228"),
    lx228: L(CH, "rooftop", "🌌", "narrator",
      "夏天快结束的时候，你们爬上了教学楼天台旁的台阶。那里能看到很远处的城市灯火，和头顶铺得满满的星星。",
      "lx229"),
    lx229: L(CH, "rooftop", "✨", "her",
      "（她靠着栏杆，望着远处的灯光，轻声说）你知道吗，我以前总觉得高中很长，长到看不到头。可真的结束了，又觉得它短得像一节课。",
      "lx230"),
    lx230: L(CH, "rooftop", "🌠", "her",
      "（一颗流星划过去，她闭上眼睛许了个愿，然后睁开眼，对你笑）但我不难过。因为这节课教会我的最重要的事，我已经记住了——是怎么去喜欢一件事，和一个人。",
      "lx231"),
    lx231: L(CH, "rooftop", "💗", "me",
      "（你望着她被星光点亮的侧脸，轻轻说）林晚，三百零五天，是我从分班那天到现在，偷偷把你记在心里的日子。以后还会有很多个三百零五天，我都想和你一起过。",
      "lx232"),
    lx232: L(CH, "rooftop", "🌸", "her",
      "（她没有说话，只是很轻地、很轻地握住了你的手。晚风很凉，她的手心却很暖。过了很久，她才说）那就说好了——以后的每个夏天，都要像这个夏天一样。",
      "lxEnd_extra"),
    lxEnd_extra: E("🌌", "番外完 · 三百零五天",
      "那个夏天，你们把没来得及做的小事一件一件补完：一起回了教室，一起逛了小卖部，一起去了图书馆，一起跑完了最后一圈，一起在天台上数了星星。\n\n后来你们去了同一个城市，开始了新的生活。可无论走多远，只要闻到桂花、看到晚霞、听见晚自习前的广播，你们都会想起杭州西子实验学校，想起高一（3）班，想起那段认认真真喜欢一个人的、闪闪发光的日子。\n\n心之所向，素履以往。\n愿你也能在自己的三百零五天里，找到那个值得认真喜欢、认真坚持的方向。\n\n——番外完，《心之所向》全文终。")
  };

  function init() {
    function tryAppend() {
      if (!window.X56StoryContent || !window.X570 || !X570.Story) return false;
      X570.Story.appendBook("lin", P);
      /* 在续章结局页插入“番外”入口（包裹 renderEnd，保留此前逻辑） */
      if (window.X56Story && typeof X56Story.renderEnd === "function" && !X56Story.__x570ExtHooked) {
        var old = X56Story.renderEnd;
        X56Story.renderEnd = function () {
          old.apply(this, arguments);
          try {
            var root = document.getElementById("x56Story");
            if (!root) return;
            var node = (this && this.cur) || (window.X56Story && X56Story.cur);
            var id = node && node.id;
            if ((id === "lxEnd_sweet" || id === "lxEnd_normal") && !root.querySelector("#x570ExtraBtn")) {
              var box = root.querySelector(".st-end, .st-end-box, .ph-card") || root.querySelector(".x570-card");
              var btn = document.createElement("button");
              btn.id = "x570ExtraBtn";
              btn.className = "x570-btn st-choice";
              btn.style.cssText = "margin:12px auto 0;display:block";
              btn.textContent = "🌌 进入番外《三百零五天》";
              btn.addEventListener("click", function () {
                if (X570.LinEx) X570.Story.enterAt("lin", "lx200");
              });
              var target = root.querySelector(".st-end") || root.querySelector(".ph-card");
              if (target) target.appendChild(btn);
            }
          } catch (e) {}
        };
        X56Story.__x570ExtHooked = true;
      }
      return true;
    }
    var n = 0;
    var t = setInterval(function () {
      n++;
      if (tryAppend() || n > 90) clearInterval(t);
    }, 250);
    X570.LinExtra = {
      enter: function () { if (X570.Story) X570.Story.enterAt("lin", "lx200"); }
    };
  }
  X570.register("linExtra", init, 5);
})();

/* ===== a80_sports.js ===== */
/* =====================================================================
   运动会 DLC：开闭幕式 + 多个可玩项目 + 班级积分 + 奖牌 + 奖励
   纯 DOM 可玩，无外部依赖；成绩持久化 localStorage
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, rnd = H.rnd, clamp = H.clamp, lsGet = H.lsGet, lsSet = H.lsSet;

  var KEY = "xz570_sport_v1";
  var S = {
    opened: false,     // 开幕式是否已进行
    closed: false,
    score: 0,          // 班级总积分
    gold: 0, silver: 0, bronze: 0,
    energy: 5,         // 体力（每场消耗）
    done: {}           // 项目 id → 名次 1/2/3/0
  };
  function load() {
    try {
      var d = JSON.parse(lsGet(KEY, "{}"));
      if (d) for (var k in d) S[k] = d[k];
    } catch (e) {}
  }
  function save() { try { lsSet(KEY, JSON.stringify(S)); } catch (e) {} }
  function reset() {
    S = { opened: false, closed: false, score: 0, gold: 0, silver: 0, bronze: 0, energy: 5, done: {} };
    save();
  }

  /* 项目定义 */
  var EVENTS = [
    { id: "m100", icon: "🏃", name: "100 米冲刺", d: "疯狂连点，越快越好，10 秒内冲过终点。", tag: "连点", game: "mash", need: 1,
      medal: { 1: 42, 2: 36, 3: 30 } },
    { id: "relay", icon: "🔁", name: "4×100 接力", d: "在交接区亮起时按下交棒，完美配合不掉棒。", tag: "时机", game: "relay", need: 1,
      medal: { 1: 85, 2: 70, 3: 55 } },
    { id: "jump", icon: "🦘", name: "立定跳远", d: "在力度条最满时起跳，把握节奏。", tag: "蓄力", game: "jump", need: 1,
      medal: { 1: 95, 2: 80, 3: 62 } },
    { id: "tug", icon: "🪢", name: "拔河", d: "和对手角力，连点把红绳拉过己方线。", tag: "连点", game: "tug", need: 1,
      medal: { 1: 70, 2: 55, 3: 40 } },
    { id: "m400", icon: "🌬️", name: "400 米耐力", d: "保持绿色节奏区，稳住配速冲线。", tag: "节奏", game: "pace", need: 1,
      medal: { 1: 88, 2: 72, 3: 56 } },
    { id: "cheer", icon: "📣", name: "啦啦队", d: "光圈落到亮点时按下，跳出完美动作。", tag: "节奏", game: "rhythm", need: 1,
      medal: { 1: 90, 2: 74, 3: 58 } },
    { id: "shot", icon: "🥏", name: "实心球", d: "两次蓄力角度选择，掷出最远。", tag: "蓄力", game: "shot", need: 1,
      medal: { 1: 90, 2: 74, 3: 58 } },
    { id: "fun", icon: "🎈", name: "趣味项目", d: "两人三足、夹球跑，轻松拿分（剧情选择）。", tag: "剧情", game: "story", need: 1,
      medal: { 1: 10, 2: 6, 3: 3 } }
  ];

  function medalOf(ev, score) {
    var m = ev.medal;
    if (score >= m[1]) return 1;
    if (score >= m[2]) return 2;
    if (score >= m[3]) return 3;
    return 0;
  }
  function award(ev, score) {
    var rank = medalOf(ev, score);
    var pts = { 1: 9, 2: 6, 3: 3, 0: 0 }[rank];
    S.done[ev.id] = { rank: rank, score: Math.round(score), pts: pts };
    if (rank === 1) S.gold++;
    else if (rank === 2) S.silver++;
    else if (rank === 3) S.bronze++;
    S.score += pts;
    S.energy = Math.max(0, S.energy - 1);
    save();
    return rank;
  }

  /* ================= 主界面 ================= */
  function open() {
    var el = H.openFull("x570Sport", "🏃 秋季运动会");
    load();
    render(el);
  }
  function render(el) {
    el = el || $("x570Sport");
    var body = el.querySelector(".x570-full-body");
    if (!S.opened) {
      body.innerHTML =
        '<div class="x570-sp-banner"><div class="t">杭州西子实验学校 · 秋季运动会</div><div class="d">彩旗、跑道、加油声——属于全班的两天。带队参加项目，为班级争积分。</div></div>' +
        '<div class="x570-sp-board">' +
          '<div class="x570-sp-stat"><div class="v">' + S.score + '</div><div class="k">班级积分</div></div>' +
          '<div class="x570-sp-stat"><div class="v">🥇' + S.gold + ' 🥈' + S.silver + ' 🥉' + S.bronze + '</div><div class="k">奖牌</div></div>' +
          '<div class="x570-sp-stat"><div class="v">' + S.energy + '/5</div><div class="k">体力</div></div>' +
          '<div class="x570-sp-stat"><div class="v">' + Object.keys(S.done).length + '/' + EVENTS.length + '</div><div class="k">已参加</div></div>' +
        '</div>' +
        '<button class="x570-sp-btn" id="x570SpOpen">🎉 参加开幕式</button>' +
        '<div class="x570-card x570-mt"><div class="d">开幕式后才能报名项目。体力每天 5 点，每个项目消耗 1 点；奖牌为班级累积积分，闭幕式结算排名。</div></div>';
      on($("x570SpOpen"), "click", opening);
      return;
    }
    var cards = EVENTS.map(function (ev) {
      var r = S.done[ev.id];
      var rankTxt = r ? (r.rank ? ({ 1: "🥇 第一名", 2: "🥈 第二名", 3: "🥉 第三名" })[r.rank] : "已参赛") : "未参加";
      return '<div class="x570-ev ' + (r ? "done" : "") + '" data-ev="' + ev.id + '">' +
        '<div class="ic">' + ev.icon + '</div><div class="n">' + esc(ev.name) + '</div>' +
        '<div class="d">' + esc(ev.d) + '</div><span class="tag">' + esc(ev.tag) + ' · ' + rankTxt + '</span></div>';
    }).join("");
    body.innerHTML =
      '<div class="x570-sp-banner"><div class="t">运动会进行中</div><div class="d">选择项目上场，争取好名次为班级积分！</div></div>' +
      '<div class="x570-sp-board">' +
        '<div class="x570-sp-stat"><div class="v">' + S.score + '</div><div class="k">班级积分</div></div>' +
        '<div class="x570-sp-stat"><div class="v">🥇' + S.gold + ' 🥈' + S.silver + ' 🥉' + S.bronze + '</div><div class="k">奖牌</div></div>' +
        '<div class="x570-sp-stat"><div class="v">' + S.energy + '/5</div><div class="k">体力</div></div>' +
        '<div class="x570-sp-stat"><div class="v">' + Object.keys(S.done).length + '/' + EVENTS.length + '</div><div class="k">已参加</div></div>' +
      '</div>' +
      '<div class="x570-ev-grid">' + cards + '</div>' +
      '<button class="x570-sp-btn" id="x570SpClose" style="background:linear-gradient(135deg,#22d06b,#07c160)">🏁 参加闭幕式结算</button>' +
      '<button class="x570-btn" style="width:100%;margin-top:10px" id="x570SpReset">↺ 重置运动会</button>';
    on(body, "click", function (e) {
      var card = e.target.closest("[data-ev]");
      if (card) { var ev = byId(card.getAttribute("data-ev")); enterEvent(ev); }
    });
    on($("x570SpClose"), "click", closing);
    on($("x570SpReset"), "click", function () { reset(); render(); });
  }
  function byId(id) { for (var i = 0; i < EVENTS.length; i++) if (EVENTS[i].id === id) return EVENTS[i]; return null; }

  /* ================= 开幕式（剧情） ================= */
  function opening() {
    var body = $("x570Sport").querySelector(".x570-full-body");
    var steps = [
      { t: "🎺 开幕式", d: "鼓号队走在最前面，金色的小号在阳光下闪光。各班方阵依次入场，口号声此起彼伏。", ch: null },
      { t: "🚩 入场式", d: "你们班穿着统一的白T恤，喊着排练了很久的口号走过主席台。你看见林晚站在拉拉队里，用力挥着花球。", ch: null },
      { t: "🕊️ 升旗", d: "国歌响起，全场安静下来，五星红旗在旗杆顶端展开。校长宣布：本届秋季运动会，正式开始！", ch: null }
    ];
    var idx = 0;
    function show() {
      var s = steps[idx];
      body.innerHTML =
        '<div class="x570-card"><div class="t">' + s.t + '</div><div class="d">' + s.d + '</div></div>' +
        '<button class="x570-sp-btn" id="x570SpNext">' + (idx < steps.length - 1 ? "继续 ▸" : "开始报名项目！") + '</button>';
      on($("x570SpNext"), "click", function () {
        idx++;
        if (idx >= steps.length) { S.opened = true; save(); render(); }
        else show();
      });
    }
    show();
  }

  /* ================= 闭幕式结算 ================= */
  function closing() {
    var body = $("x570Sport").querySelector(".x570-full-body");
    var total = Object.keys(S.done).length;
    var rank = S.score >= 60 ? "团体总分第一名 🏆" : S.score >= 36 ? "团体总分第二名 🥈" : S.score >= 18 ? "团体总分第三名 🥉" : "精神文明奖 🎖️";
    S.closed = true; save();
    body.innerHTML =
      '<div class="x570-sp-banner"><div class="t">🏁 闭幕式</div><div class="d">夕阳下，所有班级在操场上集合，等待团体总分的揭晓。</div></div>' +
      '<div class="x570-sp-board">' +
        '<div class="x570-sp-stat"><div class="v">' + S.score + '</div><div class="k">最终积分</div></div>' +
        '<div class="x570-sp-stat"><div class="v">' + total + '</div><div class="k">参赛项目</div></div>' +
        '<div class="x570-sp-stat"><div class="v">' + S.gold + '</div><div class="k">金牌</div></div>' +
        '<div class="x570-sp-stat"><div class="v">' + (S.gold + S.silver + S.bronze) + '</div><div class="k">奖牌总数</div></div>' +
      '</div>' +
      '<div class="x570-card x570-center"><div class="t">高一（3）班获得：</div><div style="font-size:24px;font-weight:900;margin:10px 0">' + rank + '</div></div>' +
      '<div class="x570-card"><div class="d">班长在台上举着奖状，林晚站在台下朝你拼命挥手。两天的奔跑、汗水和呐喊，都在这一刻变成了值得珍藏的记忆。</div></div>' +
      '<button class="x570-sp-btn" id="x570SpDone">回到运动会</button>';
    on($("x570SpDone"), "click", function () { render(); });
  }

  /* ================= 项目入口 ================= */
  function enterEvent(ev) {
    if (!S.opened) { H.toast("请先参加开幕式"); return; }
    if (S.energy <= 0) { H.toast("体力用完了，重置运动会再来"); return; }
    if (ev.game === "story") { storyEvent(ev); return; }
    var host = $("x570Sport").querySelector(".x570-full-body");
    host.innerHTML =
      '<div class="x570-card"><div class="t">' + ev.icon + " " + esc(ev.name) + '</div><div class="d">' + esc(ev.d) + '</div></div>' +
      '<div id="x570GameArea"></div>' +
      '<button class="x570-btn" style="width:100%;margin-top:10px" id="x570SpBack">‹ 返回项目列表</button>';
    on($("x570SpBack"), "click", function () { render(); });
    GAMES[ev.game]($("x570GameArea"), ev, function (score) {
      var rank = award(ev, score);
      result(ev, score, rank);
    });
  }
  function result(ev, score, rank) {
    var host = $("x570Sport").querySelector(".x570-full-body");
    var rankTxt = rank ? ({ 1: "🥇 第一名！+9 分", 2: "🥈 第二名！+6 分", 3: "🥉 第三名！+3 分" })[rank] : "完成比赛，未得名次";
    var flavor = {
      m100: "你冲过终点时，全班都在喊你的名字。",
      relay: "交接完美，看台上的林晚嗓子都喊哑了。",
      jump: "落地的一瞬间，沙坑边的同学惊呼出声。",
      tug: "全班一起把绳子拉过线，倒成一片。",
      m400: "稳住节奏，你在最后一个弯道完成超越。",
      cheer: "最后一个动作完美定格，全场掌声雷动。",
      shot: "实心球划出一道漂亮的弧线，落得很远。",
      fun: "大家笑着闹着，重在参与。"
    }[ev.id] || "比赛结束，掌声响起。";
    host.innerHTML =
      '<div class="x570-sp-banner"><div class="t">比赛结束</div><div class="d">' + esc(ev.name) + '</div></div>' +
      '<div class="x570-card x570-center"><div style="font-size:22px;font-weight:900">' + rankTxt + '</div>' +
      '<div class="d" style="margin-top:8px">得分：' + Math.round(score) + '</div></div>' +
      '<div class="x570-card"><div class="d">' + esc(flavor) + '</div></div>' +
      '<button class="x570-sp-btn" id="x570SpBack2">返回项目列表</button>';
    on($("x570SpBack2"), "click", function () { render(); });
  }

  /* 趣味项目：剧情选择 */
  function storyEvent(ev) {
    var host = $("x570Sport").querySelector(".x570-full-body");
    var qs = [
      { t: "两人三足", d: "你和搭档的腿绑在一起，起跑前你们商量：", a: [
        { l: "一起喊口号，步子迈一样大", s: 10 },
        { l: "你拉着她，小心别摔", s: 6 },
        { l: "乱冲一气，赌一把", s: 2 }
      ]},
      { t: "夹球跑", d: "用后背夹住球跑向终点，你们选择：", a: [
        { l: "贴紧一点，球不能掉", s: 10 },
        { l: "保持节奏，稳中求胜", s: 7 },
        { l: "边跑边笑", s: 3 }
      ]},
      { t: "抢椅子", d: "音乐停下，你眼疾手快——", a: [
        { l: "稳稳坐下，反应最快", s: 9 },
        { l: "和同学挤了一下才坐下", s: 5 },
        { l: "慢了一步，淘汰", s: 1 }
      ]}
    ];
    var total = 0, i = 0;
    function ask() {
      var q = qs[i];
      host.innerHTML =
        '<div class="x570-card"><div class="t">🎈 ' + q.t + '</div><div class="d">' + q.d + '</div></div>' +
        '<div class="x570-list">' + q.a.map(function (x, j) {
          return '<button class="x570-btn" data-i="' + j + '" style="text-align:left">' + esc(x.l) + '</button>';
        }).join("") + '</div>';
      host.querySelectorAll("[data-i]").forEach(function (b) {
        on(b, "click", function () {
          total += q.a[+b.getAttribute("data-i")].s;
          i++;
          if (i < qs.length) ask();
          else {
            var rank = award(ev, total);
            result(ev, total, rank);
          }
        });
      });
    }
    ask();
  }

  /* ================= 可玩小游戏集合 ================= */
  var GAMES = {};

  /* 通用：大字按钮 + 进度/结果区 */
  function box(area, title, hint) {
    area.innerHTML =
      '<div class="x570-card x570-center"><div class="t" id="gT">' + title + '</div>' +
      '<div class="d" id="gH" style="margin:6px 0">' + hint + '</div>' +
      '<div id="gVisual" style="margin:14px 0;min-height:90px"></div>' +
      '<button class="x570-sp-btn" id="gBtn">开始</button></div>';
    return { vis: $("gVisual"), btn: $("gBtn"), t: $("gT"), h: $("gH") };
  }

  /* 1) 连点（100m / 拔河） */
  GAMES.mash = function (area, ev, cb) {
    var ui = box(area, ev.name, "开始后疯狂连点按钮，10 秒内把进度条堆满！");
    var prog = 0, taps = 0, timer = null, left = 10, running = false;
    function visual() {
      ui.vis.innerHTML =
        '<div class="x570-track"><i style="width:' + Math.min(100, prog) + '%"></i></div>' +
        '<div style="margin-top:8px;font-size:18px">连点 <b>' + taps + '</b> 下 · 剩余 <b>' + left + '</b> 秒</div>';
    }
    visual();
    ui.btn.addEventListener("click", function () {
      if (running) { taps++; prog += 100 / 38; visual(); return; }
      running = true; taps = 0; prog = 0; left = 10; ui.btn.textContent = "连点！连点！";
      visual();
      timer = setInterval(function () {
        left--; visual();
        if (left <= 0) {
          clearInterval(timer); running = false;
          var score = clamp(taps / 45 * 100, 0, 100);
          cb(score);
        }
      }, 1000);
    });
  };
  GAMES.tug = function (area, ev, cb) {
    var ui = box(area, ev.name, "10 秒内连点，把红绳拉向己方（左端）！");
    var pos = 50, taps = 0, timer = null, left = 10, running = false, drift = null;
    function visual() {
      ui.vis.innerHTML =
        '<div style="position:relative;height:46px;background:linear-gradient(90deg,#22d06b 0 48%,#ddd 48% 52%,#ff5e62 52% 100%);border-radius:10px;margin:10px 0">' +
        '<div style="position:absolute;left:calc(' + pos + '% - 8px);top:6px;width:16px;height:34px;background:#fff;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.3)"></div></div>' +
        '<div style="font-size:16px">连点 <b>' + taps + '</b> · 剩余 <b>' + left + '</b> 秒</div>';
    }
    visual();
    ui.btn.addEventListener("click", function () {
      if (running) { taps++; pos = Math.max(0, pos - 2.2); visual(); return; }
      running = true; pos = 50; taps = 0; left = 10; ui.btn.textContent = "拉！";
      drift = setInterval(function () { pos = Math.min(100, pos + 1.1); visual(); }, 120);
      timer = setInterval(function () {
        left--; visual();
        if (left <= 0 || pos <= 0) {
          clearInterval(timer); clearInterval(drift); running = false;
          cb(clamp((50 - pos) / 50 * 100 + 30, 0, 100));
        }
      }, 1000);
    });
  };

  /* 2) 蓄力条（跳远/实心球） */
  function powerBar(area, ev, cb, hint) {
    var ui = box(area, ev.name, hint);
    var p = 0, dir = 1, run = false, t = null;
    function visual() {
      ui.vis.innerHTML =
        '<div class="x570-track"><i style="width:' + p + '%"></i></div>' +
        '<div style="margin-top:8px;font-size:15px">力度 <b>' + Math.round(p) + '</b>（越满越好）</div>';
    }
    visual();
    ui.btn.textContent = "开始蓄力";
    ui.btn.addEventListener("click", function () {
      if (!run) {
        run = true; ui.btn.textContent = "起跳！";
        t = setInterval(function () {
          p += dir * 3;
          if (p >= 100) { p = 100; dir = -1; }
          if (p <= 0) { p = 0; dir = 1; }
          visual();
        }, 16);
      } else {
        clearInterval(t); run = false;
        /* 力度越接近 100 越好，带一点随机 */
        var score = clamp(p * 0.85 + rnd(0, 15), 0, 100);
        cb(score);
      }
    });
  }
  GAMES.jump = function (a, e, c) { powerBar(a, e, c, "蓄力条来回摆动，在最满时按下起跳！"); };
  GAMES.shot = function (a, e, c) { powerBar(a, e, c, "把握出手时机，力度满时掷出实心球！"); };

  /* 3) 接力：亮交接区时点 */
  GAMES.relay = function (area, ev, cb) {
    var ui = box(area, ev.name, "滑块来回移动，进入绿色交接区时按下交棒！共 4 棒。");
    var leg = 0, ok = 0, pos = 0, dir = 1, t = null, wait = false;
    function visual() {
      ui.vis.innerHTML =
        '<div style="position:relative;height:40px;background:#2a3450;border-radius:10px;margin:10px 0">' +
        '<div style="position:absolute;left:32%;width:36%;height:100%;background:rgba(34,208,107,.35);border-radius:10px"></div>' +
        '<div style="position:absolute;left:calc(' + pos + '% - 9px);top:4px;width:18px;height:32px;background:#ffd166;border-radius:6px"></div></div>' +
        '<div>第 <b>' + (leg + 1) + '</b> 棒 / 4 · 完美交接 <b>' + ok + '</b> 次</div>';
    }
    visual();
    ui.btn.textContent = "开始跑动";
    ui.btn.addEventListener("click", function () {
      if (leg >= 4) return;
      if (!t) {
        ui.btn.textContent = "交接！";
        t = setInterval(function () {
          pos += dir * 2.4;
          if (pos >= 100) { pos = 100; dir = -1; }
          if (pos <= 0) { pos = 0; dir = 1; }
          visual();
        }, 16);
        return;
      }
      clearInterval(t); t = null;
      var good = pos >= 32 && pos <= 68;
      if (good) {
        var center = 1 - Math.abs(pos - 50) / 18;
        ok += center;
      }
      leg++;
      pos = 0; dir = 1;
      ui.h.textContent = good ? "完美交接！" : "掉棒了！下一棒加油";
      visual();
      if (leg >= 4) {
        ui.btn.textContent = "结束";
        cb(clamp(ok / 4 * 100, 0, 100));
      } else {
        ui.btn.textContent = "下一棒跑动";
      }
    });
  };

  /* 4) 节奏：光圈落到亮点 */
  GAMES.rhythm = function (area, ev, cb) {
    var ui = box(area, ev.name, "光圈缩到亮点时按下！共 6 拍，越准分越高。");
    var round = 0, total = 0, r = 0, t = null, running = false;
    function visual() {
      var scale = 1 - r;
      ui.vis.innerHTML =
        '<div style="position:relative;height:150px;display:flex;align-items:center;justify-content:center">' +
        '<div style="position:absolute;width:110px;height:110px;border-radius:50%;border:4px solid #ff7eb3;transform:scale(' + (1 + scale).toFixed(2) + ');opacity:' + (1 - r) + '"></div>' +
        '<div style="width:110px;height:110px;border-radius:50%;border:4px dashed rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;font-size:30px">⭐</div></div>' +
        '<div>第 <b>' + Math.min(round + 1, 6) + '</b> 拍 / 6</div>';
    }
    visual();
    ui.btn.addEventListener("click", function () {
      if (round >= 6) return;
      if (!running) {
        running = true; r = 0; ui.btn.textContent = "踩点！";
        t = setInterval(function () {
          r += 0.02;
          if (r >= 1) { r = 0; } /* 自动重置，错过=0 */
          visual();
        }, 16);
      } else {
        clearInterval(t); running = false;
        var acc = 1 - Math.abs(r - 1) * 1.4;
        total += Math.max(0, acc);
        round++;
        ui.h.textContent = acc > 0.85 ? "完美！" : acc > 0.5 ? "不错！" : "差一点";
        visual();
        if (round >= 6) { cb(clamp(total / 6 * 100, 0, 100)); }
        else { r = 0; }
      }
    });
  };

  /* 5) 配速：保持绿色区 */
  GAMES.pace = function (area, ev, cb) {
    var ui = box(area, ev.name, "点击让指针保持在绿色区间内，坚持 12 秒冲线！");
    var speed = 0, pos = 50, t = null, left = 12, gain = 0, running = false;
    function visual() {
      ui.vis.innerHTML =
        '<div style="position:relative;height:40px;background:#2a3450;border-radius:10px;margin:10px 0">' +
        '<div style="position:absolute;left:30%;width:40%;height:100%;background:rgba(34,208,107,.35);border-radius:10px"></div>' +
        '<div style="position:absolute;left:calc(' + pos + '% - 9px);top:4px;width:18px;height:32px;background:#ffd166;border-radius:6px"></div></div>' +
        '<div>剩余 <b>' + left + '</b> 秒 · 节奏分 <b>' + Math.round(gain) + '</b>';
    }
    visual();
    ui.btn.textContent = "开始比赛";
    ui.btn.addEventListener("click", function () {
      if (!running) {
        running = true; ui.btn.textContent = "保持配速（连点）";
        t = setInterval(function () {
          pos += speed;
          speed *= 0.94;
          if (pos < 0) pos = 0; if (pos > 100) pos = 100;
          if (pos >= 30 && pos <= 70) gain += 100 / 12 / 10;
          left -= 0.1;
          visual();
          if (left <= 0) { clearInterval(t); running = false; cb(clamp(gain, 0, 100)); }
        }, 100);
      } else {
        speed = Math.min(6, speed + 2.2);
      }
    });
  };

  X570.Sport = { open: open, reset: reset, EVENTS: EVENTS };
  X570.register("sport", function () { load(); }, 3);
})();

/* ===== a90_achievements.js ===== */
/* =====================================================================
   成就墙重做：分类 + 稀有度 + 进度环 + 可滚动分页，绝不遮挡其它内容
   新增大量成就素材；与旧 XZ13HALL 并存，互不影响
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;

  var FLAG_KEY = "xz570_ach_flags";
  function getFlags() { try { return JSON.parse(lsGet(FLAG_KEY, "{}")) || {}; } catch (e) { return {}; } }
  function setFlag(k, v) {
    var f = getFlags();
    if (f[k] === v) return;
    f[k] = v;
    try { lsSet(FLAG_KEY, JSON.stringify(f)); } catch (e) {}
  }
  function unlock(k) { setFlag(k, true); }
  X570_unlock = unlock;

  function best(key) { try { return (window.XZ13 && XZ13.best) ? XZ13.best(key) : 0; } catch (e) { return 0; } }
  function bestMin(key) {
    try {
      var v = parseFloat(localStorage.getItem("xz13_bestmin_" + key) || localStorage.getItem("xz13_min_" + key));
      return isNaN(v) ? 0 : v;
    } catch (e) { return 0; }
  }
  function sportState() {
    try { return JSON.parse(lsGet("xz570_sport_v1", "{}")) || {}; } catch (e) { return {}; }
  }
  function storyState() {
    try { return JSON.parse(lsGet("xz56_story_v1", "null")) || null; } catch (e) { return null; }
  }
  function momentsCount() {
    try {
      if (window.X56Moments && X56Moments.load) { var d = X56Moments.load(); return (d.myPosts || []).length; }
    } catch (e) {}
    return 0;
  }

  var RARITY = {
    1: { n: "普通", c: "r1" },
    2: { n: "稀有", c: "r2" },
    3: { n: "史诗", c: "r3" },
    4: { n: "传说", c: "r4" }
  };

  /* 成就定义 */
  var A = [
    /* —— 学业 —— */
    { id: "s1", cat: "学业", icon: "📖", name: "开学第一天", r: 1, desc: "开启自由模式。", chk: function () { return !!getFlags().game_started; } },
    { id: "s2", cat: "学业", icon: "✏️", name: "认真听讲", r: 1, desc: "课堂上认真听课。", chk: function () { return !!getFlags().class_listen; } },
    { id: "s3", cat: "学业", icon: "📒", name: "笔记狂魔", r: 1, desc: "课堂上做笔记。", chk: function () { return !!getFlags().class_note; } },
    { id: "s4", cat: "学业", icon: "🌙", name: "挑灯夜读", r: 2, desc: "在图书馆完成一次月考复习。", chk: function () { return !!getFlags().study_done; } },
    { id: "s5", cat: "学业", icon: "📈", name: "进步二十名", r: 3, desc: "月考数学大幅进步。", chk: function () { return !!getFlags().exam_up; } },
    { id: "s6", cat: "学业", icon: "🎯", name: "同一个城市", r: 4, desc: "与她定下共同的目标。", chk: function () { return !!getFlags().goal_city; } },
    { id: "s7", cat: "学业", icon: "🧪", name: "选科定方向", r: 2, desc: "确定 3+x 选考科目。", chk: function () { return !!getFlags().zj_pick; } },
    { id: "s8", cat: "学业", icon: "🔬", name: "理科魂", r: 2, desc: "选物理与化学。", chk: function () { return !!getFlags().pick_science; } },
    { id: "s9", cat: "学业", icon: "🏫", name: "金榜题名", r: 4, desc: "走完高考并完成毕业。", chk: function () { return !!getFlags().graduated; } },
    { id: "s10", cat: "学业", icon: "🧠", name: "知识渊博", r: 3, desc: "知识达到 90。", chk: function () { return (window.G && G.knowledge >= 90); } },

    /* —— 恋爱 —— */
    { id: "l1", cat: "恋爱", icon: "🌸", name: "初见林晚", r: 1, desc: "在剧情中认识林晚。", chk: function () { var s = storyState(); return s && s.heroine === "lin"; } },
    { id: "l2", cat: "恋爱", icon: "💌", name: "一张课程表", r: 1, desc: "完成序章对话。", chk: function () { var s = storyState(); return s && s.heroine === "lin" && s.flags && (s.flags.book || s.flags.garden); } },
    { id: "l3", cat: "恋爱", icon: "🍂", name: "初识", r: 2, desc: "完成第一章·初识。", chk: function () { var s = storyState(); return s && s.heroine === "lin" && s.affinity >= 4; } },
    { id: "l4", cat: "恋爱", icon: "💗", name: "心之所向", r: 4, desc: "达成林晚甜蜜结局。", chk: function () { return !!getFlags().end_sweet; } },
    { id: "l5", cat: "恋爱", icon: "🤝", name: "最好的朋友", r: 2, desc: "达成友情结局。", chk: function () { return !!getFlags().end_friend; } },
    { id: "l6", cat: "恋爱", icon: "🎨", name: "画板上的心动", r: 3, desc: "走进赵小雨的故事。", chk: function () { var s = storyState(); return s && s.heroine === "zhao"; } },
    { id: "l7", cat: "恋爱", icon: "🎹", name: "琴声慢热", r: 3, desc: "走进苏清颜的故事。", chk: function () { var s = storyState(); return s && s.heroine === "su"; } },
    { id: "l8", cat: "恋爱", icon: "🏀", name: "篮球少女", r: 3, desc: "走进许念的故事。", chk: function () { var s = storyState(); return s && s.heroine === "xu"; } },
    { id: "l9", cat: "恋爱", icon: "🧣", name: "冬至手织围巾", r: 3, desc: "收到她的围巾。", chk: function () { var s = storyState(); return s && s.flags && s.flags.lx_scarf; } },
    { id: "l10", cat: "恋爱", icon: "🎂", name: "樱花下的生日", r: 4, desc: "为她写下专属诗集。", chk: function () { var s = storyState(); return s && s.flags && s.flags.lx_promise; } },
    { id: "l11", cat: "恋爱", icon: "💞", name: "好感满格", r: 4, desc: "好感度达到 10。", chk: function () { var s = storyState(); return s && s.affinity >= 10; } },
    { id: "l12", cat: "恋爱", icon: "📷", name: "樱花合影", r: 3, desc: "在樱花树下拍一张照片。", chk: function () { var s = storyState(); return s && s.flags && s.flags.lx_birthday; } },

    /* —— 社交 —— */
    { id: "c1", cat: "社交", icon: "📱", name: "微信好友", r: 1, desc: "打开手机微信。", chk: function () { return !!getFlags().wx_open; } },
    { id: "c2", cat: "社交", icon: "💬", name: "聊起来", r: 1, desc: "进行一次微信对话。", chk: function () { return !!getFlags().wx_chat; } },
    { id: "c3", cat: "社交", icon: "📸", name: "第一条朋友圈", r: 2, desc: "发布一条朋友圈。", chk: function () { return momentsCount() >= 1 || !!getFlags().moment_post; } },
    { id: "c4", cat: "社交", icon: "👍", name: "互赞之交", r: 2, desc: "收获 10 个赞。", chk: function () { return !!getFlags().like10; } },
    { id: "c5", cat: "社交", icon: "🗣️", name: "评论区见", r: 2, desc: "回复一条评论。", chk: function () { return !!getFlags().comment_reply; } },
    { id: "c6", cat: "社交", icon: "🌐", name: "匹配成功", r: 1, desc: "体验一次假联机。", chk: function () { return !!getFlags().fake_online; } },
    { id: "c7", cat: "社交", icon: "🤝", name: "人脉达人", r: 3, desc: "认识 10 位联系人。", chk: function () { return !!getFlags().contact10; } },

    /* —— 游戏 —— */
    { id: "g1", cat: "游戏", icon: "🔢", name: "合成 512", r: 1, desc: "2048 达到 512。", chk: function () { return best("g2048") >= 512; } },
    { id: "g2", cat: "游戏", icon: "🏆", name: "合成 2048", r: 3, desc: "2048 合成 2048。", chk: function () { return best("g2048") >= 2048; } },
    { id: "g3", cat: "游戏", icon: "🟦", name: "方块千分", r: 2, desc: "俄罗斯方块 1000 分。", chk: function () { return best("gtetris") >= 1000; } },
    { id: "g4", cat: "游戏", icon: "🧱", name: "方块两千", r: 3, desc: "俄罗斯方块 2000 分。", chk: function () { return best("gtetris") >= 2000; } },
    { id: "g5", cat: "游戏", icon: "🐍", name: "蛇灵", r: 2, desc: "贪吃蛇 15 分。", chk: function () { return best("gsnake") >= 15; } },
    { id: "g6", cat: "游戏", icon: "🧱", name: "打砖块", r: 2, desc: "打砖块 400 分。", chk: function () { return best("gbreak") >= 400; } },
    { id: "g7", cat: "游戏", icon: "🐹", name: "地鼠克星", r: 1, desc: "打地鼠 25 只。", chk: function () { return best("gwhack") >= 25; } },
    { id: "g8", cat: "游戏", icon: "🧠", name: "记忆大师", r: 2, desc: "记忆翻牌通关。", chk: function () { return best("gmem") >= 100; } },
    { id: "g9", cat: "游戏", icon: "⚡", name: "反应神速", r: 3, desc: "反应快于 220ms。", chk: function () { var v = bestMin("greact"); return v > 0 && v <= 220; } },
    { id: "g10", cat: "游戏", icon: "🚀", name: "闪电神经", r: 4, desc: "反应快于 180ms。", chk: function () { var v = bestMin("greact"); return v > 0 && v <= 180; } },
    { id: "g11", cat: "游戏", icon: "💣", name: "排雷专家", r: 3, desc: "60 秒内排雷。", chk: function () { var v = bestMin("gms"); return v > 0 && v <= 60; } },
    { id: "g12", cat: "游戏", icon: "🔢", name: "华容道", r: 2, desc: "90 秒内解华容道。", chk: function () { var v = bestMin("gpz"); return v > 0 && v <= 90; } },
    { id: "g13", cat: "游戏", icon: "📖", name: "成语达人", r: 2, desc: "成语答对 9 个。", chk: function () { return best("gidiom") >= 9; } },
    { id: "g14", cat: "游戏", icon: "🔤", name: "单词达人", r: 2, desc: "单词答对 9 个。", chk: function () { return best("gword") >= 9; } },
    { id: "g15", cat: "游戏", icon: "🍉", name: "合成大西瓜", r: 4, desc: "在大西瓜里合成西瓜。", chk: function () { return !!getFlags().wm_win; } },
    { id: "g16", cat: "游戏", icon: "🎮", name: "游戏常客", r: 3, desc: "玩过 10 个不同的小游戏。", chk: function () { return !!getFlags().games10; } },

    /* —— 运动会 —— */
    { id: "p1", cat: "运动会", icon: "🎉", name: "入场式", r: 1, desc: "参加开幕式。", chk: function () { return !!sportState().opened; } },
    { id: "p2", cat: "运动会", icon: "🏃", name: "初登赛场", r: 1, desc: "参加第一个项目。", chk: function () { return Object.keys(sportState().done || {}).length >= 1; } },
    { id: "p3", cat: "运动会", icon: "🦘", name: "一跃成名", r: 2, desc: "跳远获得奖牌。", chk: function () { var d = sportState().done; return d && d.jump && d.jump.rank >= 1; } },
    { id: "p4", cat: "运动会", icon: "🔁", name: "完美交接", r: 2, desc: "接力获得奖牌。", chk: function () { var d = sportState().done; return d && d.relay && d.relay.rank >= 1; } },
    { id: "p5", cat: "运动会", icon: "🪢", name: "众志成城", r: 2, desc: "拔河获得奖牌。", chk: function () { var d = sportState().done; return d && d.tug && d.tug.rank >= 1; } },
    { id: "p6", cat: "运动会", icon: "📣", name: "啦啦之星", r: 2, desc: "啦啦队获得奖牌。", chk: function () { var d = sportState().done; return d && d.cheer && d.cheer.rank >= 1; } },
    { id: "p7", cat: "运动会", icon: "🥇", name: "金牌时刻", r: 3, desc: "获得一枚金牌。", chk: function () { return (sportState().gold || 0) >= 1; } },
    { id: "p8", cat: "运动会", icon: "🏅", name: "三牌加身", r: 4, desc: "单届获得 3 枚奖牌。", chk: function () { return (sportState().gold || 0) + (sportState().silver || 0) + (sportState().bronze || 0) >= 3; } },
    { id: "p9", cat: "运动会", icon: "🏆", name: "团体第一", r: 4, desc: "闭幕式班级积分第一。", chk: function () { return (sportState().score || 0) >= 60; } },
    { id: "p10", cat: "运动会", icon: "🏁", name: "圆满落幕", r: 2, desc: "参加闭幕式。", chk: function () { return !!sportState().closed; } },
    { id: "p11", cat: "运动会", icon: "🎈", name: "趣味至上", r: 1, desc: "参加趣味项目。", chk: function () { var d = sportState().done; return d && d.fun; } },

    /* —— 探索 / 隐藏 —— */
    { id: "e1", cat: "探索", icon: "🎨", name: "百变皮肤", r: 1, desc: "切换一次主题。", chk: function () { return !!getFlags().theme_change; } },
    { id: "e2", cat: "探索", icon: "💾", name: "存档留念", r: 1, desc: "使用一次存档。", chk: function () { return !!getFlags().save_use; } },
    { id: "e3", cat: "探索", icon: "🎤", name: "开口脆", r: 3, desc: "尝试真实麦克风 K 歌。", chk: function () { return !!getFlags().mic_use; } },
    { id: "e4", cat: "探索", icon: "🧰", name: "工具收藏家", r: 2, desc: "打开实用工具箱。", chk: function () { return !!getFlags().tools_open; } },
    { id: "e5", cat: "探索", icon: "🎮", name: "游戏中心", r: 1, desc: "打开游戏中心。", chk: function () { return !!getFlags().games_open; } },
    { id: "e6", cat: "探索", icon: "🏆", name: "成就猎人", r: 3, desc: "解锁 10 个成就。", chk: function () { return !!getFlags().ach10; } },
    { id: "e7", cat: "探索", icon: "👑", name: "成就大师", r: 4, desc: "解锁 40 个成就。", chk: function () { return !!getFlags().ach40; } },
    { id: "e8", cat: "探索", icon: "⭐", name: "心之所向", r: 4, desc: "集齐一段完整的高中记忆。", chk: function () { return !!getFlags().graduated; } },
    { id: "e9", cat: "探索", icon: "🧭", name: "校园漫步", r: 2, desc: "在剧情地图探索 6 个地点。", chk: function () { var s = storyState(); var n = s && s.flags ? ["garden", "library", "canteen", "lunch", "walk", "home", "roof"].filter(function (k) { return s.flags[k]; }).length : 0; return n >= 3; } },
    { id: "e10", cat: "探索", icon: "📜", name: "记录者", r: 1, desc: "查看更新日志。", chk: function () { return !!getFlags().log_open; } }
  ];

  function statusOf(a) {
    try { return !!a.chk(); } catch (e) { return false; }
  }
  var _cache = {};
  function statusCache(a) {
    if (a.id in _cache) return _cache[a.id];
    var v = statusOf(a); _cache[a.id] = v; return v;
  }
  /* 重入保护：e6/e7 的 chk 依赖 count()，若不加保护会无限递归直至页面崩溃。
     count() 计算期间再次进入时直接返回上一次缓存值，绝不递归遍历。 */
  var _counting = false;
  var _countVal = 0;
  function count() {
    if (_counting) return _countVal;
    _counting = true;
    var n = 0;
    for (var i = 0; i < A.length; i++) {
      try { if (statusOf(A[i])) n++; } catch (e) {}
      _countVal = n;
    }
    _counting = false;
    _countVal = n;
    return n;
  }

  var CATS = ["全部", "学业", "恋爱", "社交", "游戏", "运动会", "探索"];
  var curCat = "全部";

  function open() {
    var el = H.openFull("x570Ach", "🏆 成就墙");
    _cache = {};
    var body = el.querySelector(".x570-full-body");
    render(body);
  }
  function render(body) {
    var got = count();
    /* 数量型成就：达到阈值就写标记（标记型 chk 不递归），写后重算一次 */
    if (got >= 10) { setFlag("ach10", true); got = count(); }
    if (got >= 40) { setFlag("ach40", true); got = count(); }
    var pct = Math.round(got / A.length * 100);
    var list = A.filter(function (a) { return curCat === "全部" || a.cat === curCat; });
    body.innerHTML =
      '<div class="x570-ach-head">' +
        '<div class="x570-ach-ring" style="--p:' + pct + '%"><div><div class="num">' + got + '/' + A.length + '</div><div class="lab">已解锁</div></div></div>' +
        '<div style="font-size:13px;color:rgba(238,243,255,.6)">完成度 ' + pct + '%</div>' +
      '</div>' +
      '<div class="x570-ach-tabs" id="x570AchTabs">' +
        CATS.map(function (c) {
          var cn = c === "全部" ? A.length : A.filter(function (a) { return a.cat === c; }).length;
          return '<button class="x570-ach-tab ' + (curCat === c ? "on" : "") + '" data-cat="' + c + '">' + c + ' · ' + cn + '</button>';
        }).join("") +
      '</div>' +
      '<div class="x570-ach-grid">' +
        list.map(function (a) {
          var ok = statusCache(a);
          var r = RARITY[a.r] || RARITY[1];
          return '<div class="x570-ach ' + r.c + (ok ? "" : " locked") + '" title="' + esc(a.desc) + '">' +
            '<div class="ic">' + (ok ? a.icon : "🔒") + '</div>' +
            '<div class="n">' + esc(a.name) + '</div>' +
            '<div class="r">' + r.n + '</div></div>';
        }).join("") +
      '</div>';
    on($("x570AchTabs"), "click", function (e) {
      var b = e.target.closest(".x570-ach-tab");
      if (!b) return;
      curCat = b.getAttribute("data-cat");
      render(body);
    });
  }

  X570.Ach = { open: open, unlock: unlock, setFlag: setFlag, list: A };
  X570.register("ach", function () {
    /* 行为埋点：游戏/工具打开、切主题等，由各模块设置 */
    try {
      var oldTheme = window.X565Theme && X565Theme.choose;
    } catch (e) {}
  }, 3);
})();

/* ===== a91_hooks.js ===== */
/* ===================== 模块：成就埋点（行为挂钩，不改变旧逻辑） ===================== */
(function () {
  function F(k, v) { try { if (window.X570 && X570.Ach) X570.Ach.setFlag(k, v === undefined ? true : v); } catch (e) {} }
  function counter(k) {
    var key = "xz570_ctr_" + k;
    try { var n = parseInt(localStorage.getItem(key) || "0", 10) || 0; localStorage.setItem(key, String(n + 1)); return n + 1; } catch (e) { return 0; }
  }
  function ctr(k) {
    try { return parseInt(localStorage.getItem("xz570_ctr_" + k) || "0", 10) || 0; } catch (e) { return 0; }
  }

  function wrapOnce(name, wrapper) {
    var n = 0;
    var t = setInterval(function () {
      n++;
      if (typeof window[name] === "function") {
        if (window["__x570hook_" + name]) { clearInterval(t); return; }
        window["__x570hook_" + name] = true;
        try { wrapper(window, name, window[name]); } catch (e) {}
        clearInterval(t);
      }
      if (n > 100) clearInterval(t);
    }, 200);
  }

  function init() {
    /* 进入游戏 */
    wrapOnce("startGame", function (w, name, old) {
      w[name] = function () { F("game_started"); return old.apply(this, arguments); };
    });

    /* 课堂动作 */
    wrapOnce("classDo", function (w, name, old) {
      w[name] = function (act) {
        if (act === "listen") F("class_listen");
        if (act === "note") F("class_note");
        return old.apply(this, arguments);
      };
    });

    /* 微信 */
    wrapOnce("fakeOnline", function (w, name, old) {
      w[name] = function () { F("fake_online"); return old.apply(this, arguments); };
    });
    /* 这些对象可能稍后出现，单独探测 */
    var n = 0;
    var t = setInterval(function () {
      n++;
      var ok = 0;
      try {
        if (window.X565WX && !X565WX.__x570hook) {
          X565WX.__x570hook = true;
          var o1 = X565WX.open;
          if (typeof o1 === "function") X565WX.open = function () { F("wx_open"); if (counter("wxopen") === 1) {} return o1.apply(this, arguments); };
          var oc = X565WX.openChat;
          if (typeof oc === "function") X565WX.openChat = function (id) {
            F("wx_chat");
            var c = counter("chats");
            if (c >= 10) F("contact10");
            return oc.apply(this, arguments);
          };
          ok++;
        }
        if (window.X565Theme && !X565Theme.__x570hook) {
          X565Theme.__x570hook = true;
          var oc2 = X565Theme.choose;
          if (typeof oc2 === "function") X565Theme.choose = function (id) { F("theme_change"); return oc2.apply(this, arguments); };
          ok++;
        }
        if (window.SAVE_SYS && !SAVE_SYS.__x570hook) {
          SAVE_SYS.__x570hook = true;
          var os = SAVE_SYS.open;
          if (typeof os === "function") SAVE_SYS.open = function () { F("save_use"); return os.apply(this, arguments); };
          ok++;
        }
        if (window.XZ13_MIC && !XZ13_MIC.__x570hook) {
          XZ13_MIC.__x570hook = true;
          var om = XZ13_MIC.start;
          if (typeof om === "function") XZ13_MIC.start = function () { F("mic_use"); return om.apply(this, arguments); };
          ok++;
        }
        if (window.X56Story && !X56Story.__x570nodeHook) {
          X56Story.__x570nodeHook = true;
          var og = X56Story.go;
          if (typeof og === "function") X56Story.go = function (id) {
            try {
              switch (id) {
                case "lx65": F("exam_up"); /* fallthrough */
                case "lx69": F("study_done"); break;
                case "lx62a": case "lx62b": F("goal_city"); break;
                case "lxEnd_sweet": F("end_sweet"); F("graduated"); break;
                case "lxEnd_normal": F("graduated"); break;
                case "end_sweet": F("end_sweet"); break;
                case "end_friend": F("end_friend"); break;
              }
            } catch (e) {}
            return og.apply(this, arguments);
          };
        }
      } catch (e) {}
      if (n > 120) clearInterval(t);
    }, 250);

    /* 朋友圈发布：hook X56Moments.save */
    var m = 0;
    var tm = setInterval(function () {
      m++;
      try {
        if (window.X56Moments && !X56Moments.__x570hook) {
          X56Moments.__x570hook = true;
          var osave = X56Moments.save;
          if (typeof osave === "function") X56Moments.save = function () {
            F("moment_post");
            return osave.apply(this, arguments);
          };
        }
      } catch (e) {}
      if (m > 100) clearInterval(tm);
    }, 250);

    /* 游戏/工具打开计数（X570 工具箱动作处统一埋点） */
    document.addEventListener("click", function (e) {
      var item = e.target.closest("[data-act]");
      if (item) {
        var act = item.getAttribute("data-act");
        if (act === "games") F("games_open");
        if (act === "tools") F("tools_open");
        if (act === "log") F("log_open");
      }
    }, true);
  }
  X570.register("achHooks", init, 6);
})();

/* ===== a95_log.js ===== */
/* ===================== 模块：更新日志 / 版本记录 / 版本邮件 ===================== */
(function () {
  var H = X570H, $ = H.$, on = H.on;

  var LOG = [
    {
      v: "5.7.0", tag: "收官 PRO", title: "心之所向 · PRO 收官",
      items: [
        "开始页重做：点「开始游戏」直接进入剧情/自由两张 3D 旋转卡片，下面一排小游戏快捷卡片，附设置/名单/假联机。",
        "四幅手绘标题（杭州西子实验学校 / 心之所向 / 5.6.5 PRO / learrus）抠成透明底，做进开始页循环淡入淡出。",
        "右下角收敛为两个按钮：💬 微信、🧰 工具箱；主题、工作台、游戏、工具、成就、运动会、存档、K歌、朋友圈、日志、设置全收进工具箱。",
        "新增「恋爱·聊天」枢纽：恋爱线与手机微信融合，每位女主可直接继续剧情或微信聊天，统一返回。",
        "全新高端角色创建向导：姓名性别、家庭、外貌、爱好、MBTI、星座、血型、惯用手，分步卡片式 UI，全部映射到真实属性。",
        "剧情交互加固：事件委托兜底（彻底解决点人物/选项没反应）、章节书签、作者工具 X570.Node/appendBook，方便你自己写剧情。",
        "林晚线大幅扩写（续章·后来的我们）：运动会、晚秋月考、冬至初雪、跨年、樱花生日、高考毕业，两个续章结局，林晚线文字量达到约 2 万字。",
        "新增运动会 DLC：开闭幕式、100m、4×100 接力、立定跳远、拔河、400m、啦啦队、实心球、趣味项目，全部可玩，班级积分/奖牌/奖励并持久化。",
        "成就墙重做：分类标签 + 稀有度（普通/稀有/史诗/传说）+ 完成度环 + 可滚动网格，新增约 60 个成就，不再遮挡其它内容。",
        "手机史诗级优化：真删 3 份重复基础 CSS；移动端关闭 background-attachment:fixed、全站磨砂与装饰动画；横竖屏自适应、安全区、半屏修复。",
        "修复「点上课跳过内容」「点开页面闪/串页」：全局弹窗防重入、上课/课间/下一天 300–420ms 防连点、按钮点击锁。",
        "关闭弹窗/切后台自动停止小游戏循环（大西瓜、矿工、跳跳等），手机不再后台空转掉帧。",
        "新增可查看的更新日志面板（本页），记录每个版本的变化。",
        "新增代码约 1.5 万行，沿用七层补丁、只增不删、不重写旧函数的架构。"
      ]
    },
    {
      v: "5.6.5", tag: "稳定版", title: "5.6.5 稳定版",
      items: [
        "统一三套主题系统为一套，9 套皮肤（西子湖/晴空/樱语/青山/光谷/暖阳/青柚/暗夜/霓虹）可一键切换并记忆，晴空经典回归。",
        "修复剧情点人物无反应、工作台黑底字不可见、右下 FAB 重叠。",
        "手机微信 + 朋友圈可发表图文、点赞、评论、回复；AI 聊天与朋友圈融合。",
        "新增更多小游戏、实用工具、联系人与 AI 题库。",
        "移动端首屏与布局修复、小游戏循环回收。"
      ]
    },
    {
      v: "5.6", tag: "心之所向", title: "5.6「心之所向」",
      items: [
        "微信朋友圈：九宫格、点赞、评论、NPC 动态与红点。",
        "自由模式角色大创建：家庭/外貌/爱好/MBTI/星座/血型/惯用手。",
        "剧情模式：弱化数值、只选一个女生，打字机对话、选项、地图、好感、多结局。",
        "校园中心整合：签到、每日任务、志向、成就、技能、社团、打工、休闲等。",
        "开始页手绘图、主题快捷按钮、制作名单重制、音乐解锁修复。"
      ]
    },
    {
      v: "5.5.13", tag: "整合", title: "5.5.13 整合版",
      items: [
        "存档系统：进度导出/导入，localStorage 持久化。",
        "真实麦克风 K 歌：getUserMedia 实时音高评分。",
        "游戏中心 2.0、实用工具箱 2.0、成就墙/每日挑战。",
        "晴空主题回归与多套皮肤、AI 题库大规模扩充。"
      ]
    },
    {
      v: "5.5.12", tag: "打包", title: "5.5.12 打包合一体",
      items: [
        "基座 + 全部四层补丁 + 修复重新装配为单文件，版本号统一。",
        "四层补丁哨兵齐全，无头加载零 JS 错误。"
      ]
    }
  ];

  var EMAIL =
    "主题：杭州西子实验学校模拟器 5.7.0「心之所向 · PRO」收官更新\n\n" +
    "同学你好：\n\n" +
    "这是 5.7.0 收官版。开始页变成了两张旋转卡片，手绘标题也做了进去；右下角只剩微信和工具箱两个按钮；手机做了史诗级优化，横竖屏、半屏、卡顿、串页和上课跳步都修了。\n\n" +
    "运动会 DLC 上线，从开幕式到闭幕式，八个可玩项目都能拿奖牌；林晚的剧情扩写到了约两万字，剧情引擎也做了加固，方便你之后自己写；成就墙重做成了分类与稀有度，新增约 60 个成就。\n\n" +
    "感谢一路陪着它迭代。心之所向，素履以往。\n\n" +
    "—— 模拟器开发组\n";

  function open() {
    var el = H.openFull("x570Log", "📜 更新日志");
    var body = el.querySelector(".x570-full-body");
    var html = '<div class="x570-card"><div class="t">📮 版本邮件</div><div class="d" style="white-space:pre-wrap">' + EMAIL.replace(/\n/g, "<br>") + '</div></div>';
    LOG.forEach(function (v) {
      html += '<div class="x570-ver"><h4>v' + v.v + '<span class="tag">' + v.tag + '</span></h4>' +
        '<ul>' + v.items.map(function (x) { return '<li>' + x + '</li>'; }).join("") + '</ul></div>';
    });
    body.innerHTML = html;
    try { if (window.X570 && X570.Ach) X570.Ach.setFlag("log_open"); } catch (e) {}
  }

  X570.Log = { open: open, LOG: LOG, EMAIL: EMAIL };
  X570.register("log", function () {}, 3);
})();

/* ===== a100_perf.js ===== */
/* ===================== 模块：性能 / 横竖屏 / 串页与上课防跳 ===================== */
(function () {
  var H = X570H, $ = H.$;

  /* ---------- 1. 低性能识别（手机/少核/小内存）自动降特效 ---------- */
  function detectPerf() {
    var cores = navigator.hardwareConcurrency || 4;
    var mem = navigator.deviceMemory || 4;
    var isMobile = matchMedia("(pointer: coarse)").matches || Math.min(screen.width, screen.height) <= 900;
    var low = isMobile && (cores <= 4 || mem <= 4);
    document.documentElement.setAttribute("data-perf", low ? "low" : "high");
    document.documentElement.setAttribute("data-device", isMobile ? "mobile" : "desktop");
    if (low) {
      /* 全局关闭昂贵装饰（不影响布局，只关动画/模糊） */
      try {
        document.documentElement.style.setProperty("--xz-blur", "none");
      } catch (e) {}
    }
  }

  /* ---------- 2. 横竖屏标记 + 全屏容器自适应 ---------- */
  function applyOrientation() {
    var landscape = (window.innerWidth > window.innerHeight);
    document.documentElement.classList.toggle("x570-landscape", landscape);
    document.documentElement.classList.toggle("x570-portrait", !landscape);
    /* 通知全屏容器重排（修复旋转后只显示一半） */
    var body = document.body;
    if (body) {
      var open = body.querySelector(".x570-full.show");
      if (open) {
        /* 强制重排，避免 dpr 变化后高度卡死 */
        open.style.display = "none";
        void open.offsetHeight;
        open.style.display = "";
      }
    }
    /* 处理西瓜等 canvas 尺寸：旋转后按可见宽度重绘 */
    try {
      var cv = document.querySelector("#modal canvas");
      if (cv && cv.dataset.x570Fit !== "1") {
        /* 只标记，不侵入；真正适配在游戏自身 */
      }
    } catch (e) {}
  }

  /* ---------- 3. 弹窗 / 切屏：防串页、防闪烁、防重入 ---------- */
  var modalBusy = 0;
  function wrapModal() {
    if (typeof window.modal !== "function" || window.__x570ModalWrapped) return;
    window.__x570ModalWrapped = true;
    var _m = window.modal;
    window.modal = function (html) {
      var now = Date.now();
      /* 同一帧内重复打开，只保留最后一次；200ms 内空内容直接丢弃 */
      if (modalBusy && now - modalBusy < 80) { /* 允许覆盖，但抑制极短抖动 */ }
      modalBusy = now;
      return _m.apply(this, arguments);
    };
  }
  function wrapClose() {
    if (typeof window.closeModal !== "function" || window.__x570CloseWrapped) return;
    window.__x570CloseWrapped = true;
    var _c = window.closeModal;
    window.closeModal = function () {
      try { stopGameLoops(); } catch (e) {}
      return _c.apply(this, arguments);
    };
  }

  /* ---------- 4. 停止小游戏循环（关弹窗/切页时省电，防后台 60fps） ---------- */
  function stopGameLoops() {
    try { if (window.WM && WM.raf) { cancelAnimationFrame(WM.raf); WM.raf = 0; } } catch (e) {}
    try { if (window.gmStop && typeof window.gmStop === "function") window.gmStop(); } catch (e) {}
    try { if (window.lmStop && typeof window.lmStop === "function") window.lmStop(); } catch (e) {}
    try { if (window.lm999Stop && typeof window.lm999Stop === "function") window.lm999Stop(); } catch (e) {}
    try { if (window._LM && _LM.raf) { cancelAnimationFrame(_LM.raf); _LM.raf = 0; } } catch (e) {}
    try { if (window._LM999 && _LM999.raf) { cancelAnimationFrame(_LM999.raf); _LM999.raf = 0; } } catch (e) {}
    try { if (window.GM_RAF) { cancelAnimationFrame(window.GM_RAF); window.GM_RAF = 0; } } catch (e) {}
    /* XZ13 游戏若暴露 stop 也调用 */
    try {
      if (window.XZ13GAMES) {
        for (var k in XZ13GAMES) { try { if (XZ13GAMES[k] && typeof XZ13GAMES[k].stop === "function") XZ13GAMES[k].stop(); } catch (e) {} }
      }
    } catch (e) {}
    document.dispatchEvent(new CustomEvent("x570:stopLoops"));
  }
  X570.stopGameLoops = stopGameLoops;

  /* ---------- 5. 上课 / 课间 / 下一天：防连点跳过 ---------- */
  function guard(fnName, gap) {
    var last = 0;
    if (typeof window[fnName] !== "function" || window["__x570guard_" + fnName]) return;
    window["__x570guard_" + fnName] = true;
    var old = window[fnName];
    window[fnName] = function () {
      var now = Date.now();
      if (now - last < gap) { return; } /* 吞掉过快的第二次点击 */
      last = now;
      return old.apply(this, arguments);
    };
  }
  function wrapFlow() {
    /* 课内动作、课间动作、结束、下一天：300~420ms 防连点 */
    ["classDo", "classEnd", "breakDo", "breakEnd", "next"].forEach(function (n) {
      try { guard(n, n === "next" ? 420 : 300); } catch (e) {}
    });
  }

  /* ---------- 6. 弹窗按钮防连点（捕获阶段，点过先短暂禁用） ---------- */
  function clickGate() {
    var ADV = /classDo|classEnd|breakDo|breakEnd|next\(|startGame|continueGame/;
    document.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("button,[onclick]") : null;
      if (!b) return;
      var oc = b.getAttribute("onclick") || "";
      if (ADV.test(oc)) {
        if (b.__x570Busy) { e.stopPropagation(); e.preventDefault(); return; }
        b.__x570Busy = true;
        var old = b.style.pointerEvents;
        b.style.pointerEvents = "none";
        setTimeout(function () { b.__x570Busy = false; b.style.pointerEvents = old; }, 420);
      }
    }, true);
  }

  /* ---------- 7. 页面隐藏时停循环 + 可见时恢复 ---------- */
  function visibilityGate() {
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { stopGameLoops(); }
    });
  }

  /* ---------- 8. 修复桌面/移动端 modal 半屏与安全区（兜底） ---------- */
  function injectCss() {
    var st = document.createElement("style");
    st.id = "x570-perf-css";
    st.textContent =
      "html,body{overflow-x:hidden;}" +
      /* 移动端关闭背景 fixed 与全站磨砂（卡顿元凶） */
      "@media (max-width:960px){" +
      "body,#bgSlideshow,#splashBg{background-attachment:scroll !important;}" +
      ".topbar,.topline,.modalbox,.liquid,#startPanel,#splashScreen{backdrop-filter:none !important;-webkit-backdrop-filter:none !important;}" +
      "}" +
      "html[data-perf='low'] .topbar,html[data-perf='low'] .topline,html[data-perf='low'] .modalbox,html[data-perf='low'] .liquid{backdrop-filter:none !important;-webkit-backdrop-filter:none !important;}" +
      /* 弹窗满宽，避免半屏 */
      "@media (max-width:960px){#modal{padding:0 10px !important;}" +
      "#modal .modalbox,#modalbox{max-height:92dvh;overflow-y:auto;-webkit-overflow-scrolling:touch;}" +
      /* 横屏降低全屏顶栏、保证内容可滚动 */
      "@media (orientation:landscape) and (max-height:520px){.x570-full-body{padding-bottom:16px;}}" +
      /* 弹窗容器不拦截 44px 触控 */
      "@media (pointer:coarse){#modal button,.modalbox button{min-height:40px;}}" +
      "img{-webkit-user-drag:none;}" +
      "canvas{touch-action:none;}";
    document.head.appendChild(st);
  }

  /* ---------- 9. 拦截“同时开两个全屏”导致的串页 ---------- */
  /* 任一 .x570-full 打开时，关闭其它全屏，避免叠加；同时确保唯一返回 */
  function singleFullGuard() {
    document.body.addEventListener("click", function (e) {
      var opener = e.target.closest("[data-act]");
      if (!opener) return;
      /* 工具箱切换时，先关掉除工具箱外的所有 x570 全屏，由各动作自身重开 */
    });
  }

  function init() {
    detectPerf();
    injectCss();
    applyOrientation();
    wrapModal();
    wrapClose();
    wrapFlow();
    clickGate();
    visibilityGate();
    singleFullGuard();
    var rt = null;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(applyOrientation, 180);
    }, { passive: true });
    window.addEventListener("orientationchange", function () {
      setTimeout(applyOrientation, 260);
    }, { passive: true });
  }
  X570.register("perf", init, 0);
})();

/* ===== a110_games.js ===== */
/* =====================================================================
   5.7.0 新增小游戏：口算闪电 / 表情记忆 / 跳绳计次 / 成语接龙
   注册进 XZ13 游戏中心，有真实判定与本地最高纪录
   ===================================================================== */
(function () {
  var G = {};
  function M(html) {
    try { if (window.XZ13 && XZ13.modal) { XZ13.modal(html); return document.getElementById("modal"); } } catch (e) {}
    if (window.X570H) X570H.modal(html);
    return document.getElementById("x570Modal");
  }
  function box(id) {
    var m = document.getElementById("modal");
    return m ? m.querySelector("#" + id) : document.getElementById(id);
  }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function saveBest(key, val) { try { XZ13.best(key, val); } catch (e) {} }
  function best(key) { try { return XZ13.best(key); } catch (e) { return 0; } }

  /* ---------- 1. 口算闪电（30 秒，答对越多越好） ---------- */
  G.math = {
    open: function () {
      var state = { score: 0, left: 30, t: null, ans: 0 };
      function newQ() {
        var lv = 1 + Math.floor(state.score / 5);
        var a = Math.floor(Math.random() * 9 * lv) + 1;
        var b = Math.floor(Math.random() * 9 * lv) + 1;
        var ops = lv >= 2 ? ["+", "-", "×"] : ["+", "-"];
        var op = ops[Math.floor(Math.random() * ops.length)];
        var ans = op === "+" ? a + b : op === "-" ? a - b : a * b;
        state.ans = ans;
        var opts = shuffle([ans, ans + 1 + Math.floor(Math.random() * 6), ans - 1 - Math.floor(Math.random() * 4), ans + 2 + Math.floor(Math.random() * 8)].map(function (v) { return v; }).filter(function (v, i, arr) { return arr.indexOf(v) === i; }));
        while (opts.length < 4) opts.push(ans + opts.length + 5);
        opts = shuffle(opts.slice(0, 4));
        if (opts.indexOf(ans) < 0) opts[0] = ans;
        var b = box("g570Math");
        if (!b) return;
        b.querySelector(".q").textContent = a + " " + op + " " + b + " = ?";
        b.querySelector(".score").textContent = state.score;
        b.querySelector(".left").textContent = state.left;
        var ob = b.querySelector(".opts");
        ob.innerHTML = opts.map(function (v) { return '<button class="gbtn" data-v="' + v + '">' + v + '</button>'; }).join("");
        Array.prototype.forEach.call(ob.children, function (btn) {
          btn.onclick = function () {
            if (+btn.getAttribute("data-v") === state.ans) { state.score++; newQ(); }
            else { state.score = Math.max(0, state.score - 1); btn.disabled = true; newQ(); }
          };
        });
      }
      M('<h3>⚡ 口算闪电（30 秒）</h3><div id="g570Math" style="max-width:420px;margin:0 auto">' +
        '<div class="quote">得分 <b class="score">0</b> · 剩余 <b class="left">30</b> 秒</div>' +
        '<div class="q" style="font-size:34px;font-weight:900;text-align:center;margin:16px 0">--</div>' +
        '<div class="opts" style="display:grid;grid-template-columns:1fr 1fr;gap:10px"></div></div>' +
        '<div style="text-align:center;margin-top:10px"><button class="gbtn" id="g570MathClose">结束</button></div>');
      setTimeout(newQ, 30);
      state.t = setInterval(function () {
        state.left--;
        var b2 = box("g570Math"); if (b2) b2.querySelector(".left").textContent = state.left;
        if (state.left <= 0) {
          clearInterval(state.t);
          saveBest("gx570math", state.score);
          M('<h3>⏱️ 时间到</h3><div class="quote">本次答对 <b>' + state.score + '</b> 题，最高纪录 <b>' + best("gx570math") + '</b></div>' +
            '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="X570Games.math.open()">再来一局</button> <button class="gbtn" onclick="closeModal()">退出</button></div>');
        }
      }, 1000);
      var c = document.getElementById("g570MathClose");
      if (c) c.onclick = function () { clearInterval(state.t); saveBest("gx570math", state.score); closeModal(); };
    }
  };

  /* ---------- 2. 表情记忆（Simon Says 序列） ---------- */
  G.emoji = {
    seq: [],
    input: [],
    open: function () {
      var self = this;
      self.seq = []; self.input = [];
      var EMO = ["🌸", "🍉", "🏀", "🎹"];
      M('<h3>🧠 表情记忆</h3><div id="g570Emoji" style="max-width:420px;margin:0 auto">' +
        '<div class="quote">看清楚表情顺序，然后按顺序点出来。关卡 <b class="lv">1</b> · 最高 <b>' + best("gx570emoji") + '</b></div>' +
        '<div class="show" style="min-height:64px;font-size:30px;text-align:center;letter-spacing:8px;margin:10px 0">准备好了吗</div>' +
        '<div class="pad" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">' +
        EMO.map(function (e, i) { return '<button class="gbtn" data-i="' + i + '" style="font-size:30px;min-height:70px">' + e + '</button>'; }).join("") +
        '</div></div><div style="text-align:center;margin-top:10px"><button class="gbtn" id="g570EmStart">开始</button></div>');
      function view() {
        var b = box("g570Emoji");
        b.querySelector(".show").textContent = "看……";
        var i = 0;
        var timers = [];
        function step() {
          if (i >= self.seq.length) {
            b.querySelector(".show").textContent = "轮到你了";
            self.input = [];
            return;
          }
          var idx = self.seq[i];
          var pad = b.querySelectorAll(".pad button")[idx];
          b.querySelector(".show").textContent = EMO[idx];
          pad.style.outline = "3px solid #ffd166";
          timers.push(setTimeout(function () { pad.style.outline = ""; }, 420));
          timers.push(setTimeout(function () { i++; step(); }, 620));
        }
        setTimeout(step, 400);
      }
      function nextRound() {
        self.seq.push(Math.floor(Math.random() * 4));
        self.input = [];
        var b = box("g570Emoji");
        if (b) b.querySelector(".lv").textContent = self.seq.length;
        view();
      }
      function bind() {
        var b = box("g570Emoji");
        if (!b) return;
        Array.prototype.forEach.call(b.querySelectorAll(".pad button"), function (btn) {
          btn.onclick = function () {
            self.input.push(+btn.getAttribute("data-i"));
            var k = self.input.length - 1;
            if (self.input[k] !== self.seq[k]) {
              saveBest("gx570emoji", Math.max(0, self.seq.length - 1));
              M('<h3>记错啦</h3><div class="quote">你记住了 <b>' + Math.max(0, self.seq.length - 1) + '</b> 个，最高 <b>' + best("gx570emoji") + '</b></div>' +
                '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="X570Games.emoji.open()">再来一局</button> <button class="gbtn" onclick="closeModal()">退出</button></div>');
              return;
            }
            var sh = b.querySelector(".show");
            if (sh) sh.textContent = self.input.map(function (x) { return EMO[x]; }).join(" ");
            if (self.input.length === self.seq.length) {
              setTimeout(nextRound, 500);
            }
          };
        });
      }
      setTimeout(bind, 40);
      var st = document.getElementById("g570EmStart");
      if (st) st.onclick = function () { st.remove(); nextRound(); };
    }
  };

  /* ---------- 3. 跳绳计次（10 秒踩点） ---------- */
  G.rope = {
    open: function () {
      var state = { count: 0, left: 10, t: null, window: false, run: false, t2: null };
      M('<h3>🪢 跳绳计次（10 秒）</h3><div id="g570Rope" style="max-width:420px;margin:0 auto;text-align:center">' +
        '<div class="quote">跳到 <b style="color:#22d06b">绿色</b> 时按下踩点，连中更高分。次数 <b class="count">0</b> · 剩余 <b class="left">10</b></div>' +
        '<div class="meter" style="height:44px;border-radius:12px;margin:16px 0;background:linear-gradient(90deg,#ff5e62 0 35%,#22d06b 35% 65%,#ff5e62 65% 100%);position:relative;overflow:hidden">' +
        '<div class="cur" style="position:absolute;top:0;left:0;width:10px;height:100%;background:#fff"></div></div>' +
        '<button class="gbtn" id="g570RopeBtn" style="width:100%;min-height:64px;font-size:20px">开始</button>' +
        '<div class="combo" style="margin-top:8px"></div></div>');
      var pos = 0, dir = 1;
      function tick() {
        pos += dir * 3;
        if (pos >= 98) { pos = 98; dir = -1; }
        if (pos <= 0) { pos = 0; dir = 1; }
        var cur = box("g570Rope").querySelector(".cur");
        if (cur) cur.style.left = pos + "%";
      }
      var btn = document.getElementById("g570RopeBtn");
      btn.onclick = function () {
        if (!state.run) {
          state.run = true; state.count = 0; state.left = 10;
          btn.textContent = "踩点！";
          state.t2 = setInterval(tick, 16);
          state.t = setInterval(function () {
            state.left--;
            var b = box("g570Rope"); if (b) b.querySelector(".left").textContent = state.left;
            if (state.left <= 0) {
              clearInterval(state.t); clearInterval(state.t2);
              saveBest("gx570rope", state.count);
              M('<h3>⏱️ 结束</h3><div class="quote">跳绳 <b>' + state.count + '</b> 下，最高 <b>' + best("gx570rope") + '</b></div>' +
                '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="X570Games.rope.open()">再来一局</button> <button class="gbtn" onclick="closeModal()">退出</button></div>');
            }
          }, 1000);
        } else {
          var good = pos >= 35 && pos <= 65;
          if (good) {
            state.count++;
            var b = box("g570Rope");
            if (b) { b.querySelector(".count").textContent = state.count; b.querySelector(".combo").textContent = "✅ 踩中"; }
          } else {
            var b2 = box("g570Rope");
            if (b2) b2.querySelector(".combo").textContent = "❌ 没踩到";
          }
        }
      };
    }
  };

  /* ---------- 4. 成语接龙（60 秒） ---------- */
  G.idiom = {
    bank: [
      { q: "一马当先", a: "先入为主", w: ["先发制人", "先睹为快", "先见之明"] },
      { q: "画蛇添足", a: "足智多谋", w: ["足不出户", "足音跫然", "足衣足食"] },
      { q: "胸有成竹", a: "竹报平安", w: ["竹篮打水", "竹苞松茂", "竹马之交"] },
      { q: "亡羊补牢", a: "牢不可破", w: ["牢骚满腹", "牢什古子", "老当益壮"] },
      { q: "守株待兔", a: "兔死狐悲", w: ["兔起鹘落", "兔死狗烹", "兔走乌飞"] },
      { q: "叶公好龙", a: "龙飞凤舞", w: ["龙马精神", "龙腾虎跃", "龙争虎斗"] },
      { q: "举一反三", a: "三心二意", w: ["三思而行", "三头六臂", "三五成群"] },
      { q: "风和日丽", a: "丽藻春葩", w: ["丽句清辞", "例行公事", "立竿见影"] },
      { q: "一见钟情", a: "情真意切", w: ["情同手足", "情不自禁", "情深似海"] },
      { q: "破釜沉舟", a: "舟车劳顿", w: ["舟中敌国", "周而复始", "州官放火"] }
    ],
    open: function () {
      var self = this;
      var state = { left: 60, score: 0, idx: 0, t: null, order: shuffle(self.bank.slice()) };
      function q() {
        if (state.idx >= state.order.length) state.order = shuffle(self.bank.slice());
        var it = state.order[state.idx % state.order.length];
        var opts = shuffle([it.a].concat(it.w)).slice(0, 4);
        if (opts.indexOf(it.a) < 0) opts[0] = it.a;
        opts = shuffle(opts);
        var b = box("g570Idiom");
        if (!b) return;
        b.querySelector(".q").textContent = it.q + " → ？";
        b.querySelector(".score").textContent = state.score;
        b.querySelector(".left").textContent = state.left;
        var ob = b.querySelector(".opts");
        ob.innerHTML = opts.map(function (v) { return '<button class="gbtn" data-v="' + v + '">' + v + '</button>'; }).join("");
        Array.prototype.forEach.call(ob.children, function (btn) {
          btn.onclick = function () {
            if (btn.getAttribute("data-v") === it.a) state.score++;
            else state.score = Math.max(0, state.score - 1);
            state.idx++;
            q();
          };
        });
      }
      M('<h3>📖 成语接龙（60 秒）</h3><div id="g570Idiom" style="max-width:460px;margin:0 auto">' +
        '<div class="quote">得分 <b class="score">0</b> · 剩余 <b class="left">60</b> 秒</div>' +
        '<div class="q" style="font-size:26px;font-weight:800;text-align:center;margin:14px 0">--</div>' +
        '<div class="opts" style="display:grid;grid-template-columns:1fr 1fr;gap:10px"></div></div>' +
        '<div style="text-align:center;margin-top:10px"><button class="gbtn" id="g570IdClose">提前结束</button></div>');
      setTimeout(q, 30);
      state.t = setInterval(function () {
        state.left--;
        var b = box("g570Idiom"); if (b) b.querySelector(".left").textContent = state.left;
        if (state.left <= 0) {
          clearInterval(state.t);
          saveBest("gx570idiom", state.score);
          M('<h3>⏱️ 时间到</h3><div class="quote">答对 <b>' + state.score + '</b> 个，最高 <b>' + best("gx570idiom") + '</b></div>' +
            '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="X570Games.idiom.open()">再来一局</button> <button class="gbtn" onclick="closeModal()">退出</button></div>');
        }
      }, 1000);
      var c = document.getElementById("g570IdClose");
      if (c) c.onclick = function () { clearInterval(state.t); saveBest("gx570idiom", state.score); closeModal(); };
    }
  };

  window.X570Games = G;

  function register() {
    if (!window.XZ13 || !XZ13.GAMES) return false;
    var defs = [
      { icon: "⚡", name: "口算闪电", bestKey: "gx570math", call: "X570Games.math.open()" },
      { icon: "🧠", name: "表情记忆", bestKey: "gx570emoji", call: "X570Games.emoji.open()" },
      { icon: "🪢", name: "跳绳计次", bestKey: "gx570rope", call: "X570Games.rope.open()" },
      { icon: "📖", name: "成语接龙", bestKey: "gx570idiom", call: "X570Games.idiom.open()" }
    ];
    defs.forEach(function (d) {
      var exists = false;
      for (var i = 0; i < XZ13.GAMES.length; i++) if (XZ13.GAMES[i].name === d.name) { exists = true; break; }
      if (!exists) XZ13.GAMES.push(d);
    });
    return true;
  }
  X570.register("g570", function () {
    var n = 0;
    var t = setInterval(function () {
      n++;
      if (register() || n > 80) clearInterval(t);
    }, 250);
  }, 4);
})();

/* ===== a111_games_b.js ===== */
/* =====================================================================
   5.7.0 新增小游戏 · 第二批：接水果 / 滑块拼图 / 猜数字
   注册进 XZ13 游戏中心，真实判定 + 本地纪录
   ===================================================================== */
(function () {
  var G = {};
  function M(html) {
    try { if (window.XZ13 && XZ13.modal) { XZ13.modal(html); return document.getElementById("modal"); } } catch (e) {}
    X570H.modal(html);
    return document.getElementById("modal");
  }
  function box(id) { var m = document.getElementById("modal"); return m ? m.querySelector("#" + id) : document.getElementById(id); }
  function saveBest(k, v) { try { XZ13.best(k, v); } catch (e) {} }
  function best(k) { try { return XZ13.best(k); } catch (e) { return 0; } }

  /* ---------- 接水果（移动篮子，30 秒，躲炸弹） ---------- */
  G.catch = {
    open: function () {
      M('<h3>🧺 接水果（30 秒）</h3><div id="g570Catch" style="max-width:420px;margin:0 auto">' +
        '<div class="quote">接住水果 +1，避开 💣！得分 <b class="sc">0</b> · 剩余 <b class="lf">30</b> · 最高 <b>' + best("gx570catch") + '</b></div>' +
        '<div class="stage" style="position:relative;height:340px;margin:12px 0;border-radius:14px;overflow:hidden;background:linear-gradient(180deg,#1b2440,#2a3a66);touch-action:none">' +
        '<div class="basket" style="position:absolute;bottom:6px;left:0;width:54px;height:40px;font-size:34px;text-align:center;line-height:40px">🧺</div></div>' +
        '<div style="text-align:center;font-size:13px;opacity:.7">移动鼠标 / 手指拖动篮子，或用 ← → 键</div>' +
        '<div style="text-align:center;margin-top:8px"><button class="gbtn" id="g570CStart">开始</button></div></div>');
      var stage = box("g570Catch").querySelector(".stage");
      var basket = stage.querySelector(".basket");
      var W = 400, bw = 54;
      var bx = W / 2 - bw / 2, items = [], score = 0, left = 30, running = false;
      var raf = null, t1 = null, spawn = null;
      function setX(x) { bx = Math.max(0, Math.min(W - bw, x)); basket.style.left = bx + "px"; }
      function move(clientX) {
        var r = stage.getBoundingClientRect();
        setX((clientX - r.left) / r.width * W - bw / 2);
      }
      stage.addEventListener("mousemove", function (e) { if (running) move(e.clientX); });
      stage.addEventListener("touchmove", function (e) { if (running && e.touches[0]) { e.preventDefault(); move(e.touches[0].clientX); } }, { passive: false });
      document.addEventListener("keydown", function (e) {
        if (!running) return;
        if (e.key === "ArrowLeft") setX(bx - 26);
        if (e.key === "ArrowRight") setX(bx + 26);
      });
      var FRUITS = ["🍎", "🍊", "🍓", "🍇", "🍉", "💣"];
      function make() {
        var bomb = Math.random() < 0.18;
        var em = bomb ? "💣" : FRUITS[Math.floor(Math.random() * 5)];
        var el = document.createElement("div");
        el.style.cssText = "position:absolute;top:-30px;font-size:26px;width:26px;text-align:center;left:0";
        el.textContent = em;
        stage.appendChild(el);
        items.push({ el: el, x: Math.random() * (W - 26), y: -30, sp: 2.2 + Math.random() * 2.2, bomb: bomb });
      }
      function loop() {
        if (!running) return;
        for (var i = items.length - 1; i >= 0; i--) {
          var it = items[i];
          it.y += it.sp;
          it.el.style.top = it.y + "px";
          it.el.style.left = it.x + "px";
          if (it.y > 300 && it.x + 26 >= bx && it.x <= bx + bw) {
            if (it.bomb) score = Math.max(0, score - 3); else score++;
            it.el.remove(); items.splice(i, 1);
            box("g570Catch").querySelector(".sc").textContent = score;
            continue;
          }
          if (it.y > 350) { it.el.remove(); items.splice(i, 1); }
        }
        raf = requestAnimationFrame(loop);
      }
      function start() {
        if (running) return;
        running = true; score = 0; left = 30;
        document.getElementById("g570CStart").remove();
        box("g570Catch").querySelector(".sc").textContent = score;
        loop();
        spawn = setInterval(make, 650);
        t1 = setInterval(function () {
          left--;
          box("g570Catch").querySelector(".lf").textContent = left;
          if (left <= 0) end();
        }, 1000);
      }
      function end() {
        running = false;
        cancelAnimationFrame(raf); clearInterval(spawn); clearInterval(t1);
        saveBest("gx570catch", score);
        items.forEach(function (it) { it.el.remove(); });
        M('<h3>⏱️ 结束</h3><div class="quote">接到 <b>' + score + '</b> 个水果，最高 <b>' + best("gx570catch") + '</b></div>' +
          '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="X570Games.catch.open()">再来一局</button> <button class="gbtn" onclick="closeModal()">退出</button></div>');
      }
      document.getElementById("g570CStart").onclick = start;
    }
  };

  /* ---------- 滑块拼图（3×3，步越少越好） ---------- */
  G.slide = {
    open: function () {
      var size = 3, n = size * size;
      var board = [];
      for (var i = 1; i < n; i++) board.push(i);
      board.push(0);
      function shuffle() {
        for (var k = 0; k < 120; k++) {
          var blank = board.indexOf(0);
          var nb = neighbors(blank);
          var swap = nb[Math.floor(Math.random() * nb.length)];
          var t = board[blank]; board[blank] = board[swap]; board[swap] = t;
        }
      }
      function neighbors(idx) {
        var r = Math.floor(idx / size), c = idx % size, res = [];
        if (r > 0) res.push(idx - size);
        if (r < size - 1) res.push(idx + size);
        if (c > 0) res.push(idx - 1);
        if (c < size - 1) res.push(idx + 1);
        return res;
      }
      shuffle();
      var moves = 0;
      M('<h3>🧩 滑块拼图（3×3）</h3><div id="g570Slide" style="max-width:360px;margin:0 auto;text-align:center">' +
        '<div class="quote">把数字按 1-8 排好。步数 <b class="mv">0</b> · 最少纪录 <b>' + best("gx570slide") + "</b></div>" +
        '<div class="board" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0"></div></div>');
      var bd = box("g570Slide").querySelector(".board");
      function render() {
        bd.innerHTML = "";
        board.forEach(function (v, i) {
          var b = document.createElement("button");
          b.className = "gbtn";
          b.style.minHeight = "88px";
          b.style.fontSize = "30px";
          if (v === 0) { b.textContent = ""; b.style.visibility = "hidden"; }
          else b.textContent = v;
          b.onclick = function () {
            var blank = board.indexOf(0);
            if (neighbors(blank).indexOf(i) >= 0) {
              board[blank] = board[i]; board[i] = 0; moves++;
              box("g570Slide").querySelector(".mv").textContent = moves;
              check();
              render();
            }
          };
          bd.appendChild(b);
        });
      }
      function check() {
        for (var i = 0; i < n - 1; i++) if (board[i] !== i + 1) return;
        if (board[n - 1] !== 0) return;
        var rec = best("gx570slide");
        var bestVal = rec === 0 || moves < rec ? moves : rec;
        try { XZ13.lsSet("xz13_best_gx570slide", String(bestVal)); } catch (e) {}
        setTimeout(function () {
          M('<h3>🎉 拼好啦</h3><div class="quote">用了 <b>' + moves + "</b> 步，最少纪录 <b>" + bestVal + "</b></div>" +
            '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="X570Games.slide.open()">再来一局</button> <button class="gbtn" onclick="closeModal()">退出</button></div>');
        }, 200);
      }
      render();
    }
  };

  /* ---------- 猜数字（10 次内猜中，剩余次数越多分越高） ---------- */
  G.guess = {
    open: function () {
      var target = Math.floor(Math.random() * 100) + 1;
      var tries = 0, max = 10, history = [];
      M('<h3>🎯 猜数字（1-100）</h3><div id="g570Guess" style="max-width:360px;margin:0 auto;text-align:center">' +
        '<div class="quote">10 次内猜中，剩余次数越多分越高。剩余 <b class="tr">' + max + "</b> 次</div>" +
        '<input class="gin" type="number" min="1" max="100" placeholder="输入 1-100" style="width:100%;padding:12px;font-size:18px;border-radius:10px;margin:10px 0;box-sizing:border;border:1px solid #4a5878;background:#1b2440;color:#fff">' +
        '<button class="gbtn" id="g570GGo" style="width:100%">猜</button>' +
        '<div class="hist" style="margin-top:12px"></div></div>');
      var input = box("g570Guess").querySelector(".gin");
      function go() {
        var v = parseInt(input.value, 10);
        if (isNaN(v) || v < 1 || v > 100) { X570H.toast("请输入 1-100 的数"); return; }
        tries++;
        var left = max - tries;
        box("g570Guess").querySelector(".tr").textContent = left;
        var hint;
        if (v === target) {
          var score = left * 10;
          saveBest("gx570guess", score);
          M('<h3>🎉 猜中了！</h3><div class="quote">答案是 <b>' + target + "</b>，用了 <b>" + tries + "</b> 次，得分 <b>" + score + "</b>，最高 <b>" + best("gx570guess") + "</b></div>" +
            '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="X570Games.guess.open()">再来一局</button> <button class="gbtn" onclick="closeModal()">退出</button></div>');
          return;
        }
        hint = v < target ? "⬆️ 太小了" : "⬇️ 太大了";
        history.push(v + " " + hint);
        box("g570Guess").querySelector(".hist").innerHTML = history.map(function (h) {
          return '<div style="padding:4px 0">' + h + "</div>";
        }).join("");
        input.value = "";
        if (left <= 0) {
          M('<h3>😢 次数用完</h3><div class="quote">正确答案是 <b>' + target + "</b>，再试一局吧！</div>" +
            '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="X570Games.guess.open()">再来一局</button> <button class="gbtn" onclick="closeModal()">退出</button></div>');
        }
      }
      document.getElementById("g570GGo").onclick = go;
      input.onkeydown = function (e) { if (e.key === "Enter") go(); };
    }
  };

  /* 挂载到 X570Games（供 onclick 调用） */
  function attach() {
    if (!window.X570Games) return false;
    X570Games.catch = G.catch;
    X570Games.slide = G.slide;
    X570Games.guess = G.guess;
    if (window.XZ13 && XZ13.GAMES) {
      var defs = [
        { icon: "🧺", name: "接水果", bestKey: "gx570catch", call: "X570Games.catch.open()" },
        { icon: "🧩", name: "滑块拼图", bestKey: "gx570slide", call: "X570Games.slide.open()" },
        { icon: "🎯", name: "猜数字", bestKey: "gx570guess", call: "X570Games.guess.open()" }
      ];
      defs.forEach(function (d) {
        var dup = XZ13.GAMES.some(function (x) { return x.name === d.name; });
        if (!dup) XZ13.GAMES.push(d);
      });
    }
    return true;
  }
  X570.register("g570b", function () {
    var n = 0;
    var t = setInterval(function () { n++; if (attach() || n > 80) clearInterval(t); }, 250);
  }, 4);
})();

/* ===== a120_campus.js ===== */
/* =====================================================================
   校园中心+：5.7.0 新增玩法总枢纽
   每日运势 / 天气日历 / 课表 / 番茄钟 / 计算器 / 便签 / 随机点名 / 抽签
   全部纯 DOM、自包含、可在工具箱「校园中心+」打开
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;

  var SUBS = [
    { ic: "❓", tx: "帮助中心", d: "新手指南/常见问题", act: "help" },
    { ic: "🏷️", tx: "关于本游戏", d: "版本/统计/自检", act: "about" },
    { ic: "🪪", tx: "个人主页", d: "属性/称号/数据总览", act: "profile" },
    { ic: "📅", tx: "每日签到", d: "连续签到领奖励", act: "signin" },
    { ic: "🌟", tx: "学年与志向", d: "每日任务/学年日历/目标", act: "calendar" },
    { ic: "🎲", tx: "校园事件", d: "每天随机发生的小剧情", act: "events" },
    { ic: "📚", tx: "题库挑战", d: "各科常识快速问答", act: "quiz" },
    { ic: "📒", tx: "学习手册", d: "方法与知识点卡片", act: "study" },
    { ic: "❌", tx: "错题本", d: "分科记录/复习", act: "mistake" },
    { ic: "📝", tx: "模拟考试", d: "综合卷限时练习", act: "exam" },
    { ic: "✋", tx: "课堂互动", d: "举手回答/板演", act: "classroom" },
    { ic: "📅", tx: "学习计划", d: "作业/课程表/目标", act: "planner" },
    { ic: "🔤", tx: "英语单词卡", d: "分类背单词", act: "words" },
    { ic: "📜", tx: "古诗词卡片", d: "背诵名句/接下句", act: "poem" },
    { ic: "🧮", tx: "公式速记卡", d: "数理化公式", act: "formula" },
    { ic: "🎉", tx: "校园节日", d: "教师节/中秋/艺术节", act: "festival" },
    { ic: "🏫", tx: "主题班会", d: "参与讨论与成长", act: "meeting" },
    { ic: "🧬", tx: "性格解读", d: "MBTI / 星座 / 血型", act: "persona" },
    { ic: "🛏️", tx: "宿舍生活", d: "夜谈/值日/早起", act: "dorm" },
    { ic: "🎭", tx: "社团技能", d: "加入社团、修炼技能", act: "clubs" },
    { ic: "👥", tx: "校园花名册", d: "认识全校的人并对话", act: "npc" },
    { ic: "🏷️", tx: "称号名片", d: "解锁并佩戴称号", act: "title" },
    { ic: "🛍️", tx: "校园小卖部", d: "购买道具与装扮", act: "shop" },
    { ic: "🍱", tx: "食堂菜单", d: "点餐/营养/账单", act: "canteen" },
    { ic: "👗", tx: "我的装扮", d: "发型/校服/配饰", act: "dress" },
    { ic: "📱", tx: "校园动态墙", d: "全校同学的朋友圈", act: "feed" },
    { ic: "💬", tx: "校园聊天", d: "联系人对话/树洞", act: "chat" },
    { ic: "💗", tx: "恋爱纪念册", d: "收集心动瞬间", act: "memo" },
    { ic: "💞", tx: "关系与好感", d: "送礼/聊天/帮忙", act: "bond" },
    { ic: "🔮", tx: "今日运势", d: "抽一签今日宜忌", act: "fortune" },
    { ic: "🌦️", tx: "天气日历", d: "查看天气与作息", act: "weather" },
    { ic: "📅", tx: "我的课表", d: "查看一周课程", act: "schedule" },
    { ic: "⏱️", tx: "番茄钟", d: "25 分钟专注学习", act: "pomodoro" },
    { ic: "🧮", tx: "计算器", d: "随手算一算", act: "calc" },
    { ic: "📝", tx: "便签", d: "记一件重要的事", act: "note" },
    { ic: "🎯", tx: "随机点名", d: "上课谁来回答？", act: "roll" },
    { ic: "😄", tx: "轻松角", d: "笑话/冷知识/语录", act: "fun" },
    { ic: "📓", tx: "校园日记", d: "记录每天的心情", act: "diary" },
    { ic: "🌤️", tx: "心情手账", d: "情绪记录与日历", act: "mood" },
    { ic: "🍶", tx: "心愿瓶", d: "写下/捞起心愿", act: "wish" },
    { ic: "🐱", tx: "校园橘猫", d: "喂食陪玩养成", act: "pet" },
    { ic: "📖", tx: "校园图鉴", d: "收集植物/美食/天气", act: "book" },
    { ic: "📒", tx: "同学录", d: "收集签名寄语", act: "autograph" },
    { ic: "🗺️", tx: "校园导览", d: "设施地图与说明", act: "guide" },
    { ic: "🌿", tx: "放松一刻", d: "呼吸/正念/护眼", act: "relax" },
    { ic: "🏃", tx: "运动打卡", d: "跑步/跳绳/球类", act: "exercise" },
    { ic: "🎡", tx: "幸运转盘", d: "每天一次小确幸", act: "wheel" },
    { ic: "📻", tx: "广播投稿", d: "点歌/校园来稿", act: "broadcast" },
    { ic: "💰", tx: "班级账本", d: "班费收支记录", act: "classfund" },
    { ic: "🎲", tx: "课堂随机", d: "点名/分组/座位", act: "roulette" },
    { ic: "📖", tx: "自习室预约", d: "选时段/座位", act: "studyroom" },
    { ic: "💬", tx: "老师箴言", d: "每日一句/收藏", act: "quotes" },
    { ic: "🌱", tx: "21天习惯", d: "习惯打卡养成", act: "habit" }
  ];

  function open() {
    var el = H.openFull("x570Campus", "🌟 校园中心+");
    var body = el.querySelector(".x570-full-body");
    body.innerHTML =
      '<div class="x570-card"><div class="t">5.7.0 新增玩法</div><div class="d">把日常校园生活做得更细：从随机事件、题库、社团、小卖部，到运势、天气、课表与学习小工具，都在这里。</div></div>' +
      '<div class="x570-campus-grid">' + SUBS.map(function (s) {
        return '<div class="x570-campus-item" data-act="' + s.act + '"><div class="ic">' + s.ic + '</div><div class="n">' + esc(s.tx) + '</div><div class="d">' + esc(s.d) + '</div></div>';
      }).join("") + '</div>';
    on(body, "click", function (e) {
      var it = e.target.closest("[data-act]");
      if (!it) return;
      var act = it.getAttribute("data-act");
      route(act);
    });
  }

  function screen(title, html) {
    var el = H.openFull("x570Sub", title);
    el.querySelector(".x570-full-body").innerHTML = html;
    return el.querySelector(".x570-full-body");
  }

  function route(act) {
    if (X570.CampusSub && X570.CampusSub[act]) { X570.CampusSub[act](); return; }
    switch (act) {
      case "fortune": fortune(); break;
      case "weather": weather(); break;
      case "schedule": schedule(); break;
      case "pomodoro": pomodoro(); break;
      case "calc": calc(); break;
      case "note": note(); break;
      case "roll": roll(); break;
      default: H.toast("模块未就绪");
    }
  }

  /* ---------------- 今日运势（抽签） ---------------- */
  var FORTUNE = [
    { lv: "大吉", c: "#e8553a", txt: "诸事顺遂，今日宜主动表达、认真学习，会有意外的好运。", yi: "宜表白、宜提问、宜喝热豆浆", ji: "忌迟到、忌走神" },
    { lv: "中吉", c: "#f0a020", txt: "稳中向好，保持节奏即可，午后会有让你开心的小事。", yi: "宜复习、宜散步、宜和朋友聊天", ji: "忌熬夜" },
    { lv: "小吉", c: "#22d06b", txt: "平平淡淡里藏着小确幸，注意身边人的善意。", yi: "宜做笔记、宜分享零食", ji: "忌钻牛角尖" },
    { lv: "平", c: "#7b8aa5", txt: "普通的一天，适合专注手头的事，不必强求惊喜。", yi: "宜整理书包、宜背单词", ji: "忌冲动消费" },
    { lv: "末吉", c: "#5b7c99", txt: "略有波折，但都是小插曲，深呼吸就能过去。", yi: "宜提前出门、宜检查作业", ji: "忌赶时间" },
    { lv: "凶", c: "#8a5c9b", txt: "容易犯困或丢三落四，多留个心眼，下午会好转。", yi: "宜早睡、宜带伞、宜复查", ji: "忌粗心、忌吵架" }
  ];
  function fortune() {
    var b = screen("🔮 今日运势", '<div class="x570-card x570-center" id="fCard"><div style="font-size:60px">🎋</div><div class="d" style="margin:10px 0">点击求今日签，每日一次更灵验</div><button class="x570-btn" id="fDraw">求签</button></div>');
    var key = "xz570_fortune_" + new Date().toDateString();
    var saved = lsGet(key, "");
    if (saved) showF(b, FORTUNE[+saved]);
    on(b, "click", function (e) {
      if (e.target.closest("#fDraw")) {
        var i = Math.floor(Math.random() * FORTUNE.length);
        lsSet(key, String(i));
        showF(b, FORTUNE[i]);
      }
    });
  }
  function showF(b, f) {
    var card = $("#fCard");
    card.innerHTML = '<div style="font-size:46px">🎋</div>' +
      '<div style="font-size:30px;font-weight:900;color:' + f.c + ';margin:8px 0">' + f.lv + '</div>' +
      '<div class="d">' + esc(f.txt) + '</div>' +
      '<div class="x570-card" style="margin-top:12px;text-align:left"><div style="color:#22d06b">' + esc(f.yi) + '</div><div style="color:#ff5e62;margin-top:6px">' + esc(f.ji) + '</div></div>';
  }

  /* ---------------- 天气日历 ---------------- */
  var WEATHERS = [
    { ic: "☀️", n: "晴", tip: "阳光正好，体育课在操场上跑两圈。" },
    { ic: "⛅", n: "多云", tip: "云层不厚不薄，适合在图书馆靠窗看书。" },
    { ic: "🌧️", n: "小雨", tip: "记得带伞，课间走廊会有点滑。" },
    { ic: "⛈️", n: "雷阵雨", tip: "大雨说来就来，午休尽量待在室内。" },
    { ic: "🌫️", n: "晨雾", tip: "早上有雾，骑车上学要慢一点。" },
    { ic: "🌬️", n: "大风", tip: "风很大，操场边的桂花会被吹落一地。" },
    { ic: "🌨️", n: "小雪", tip: "难得的雪，下课一起去操场看看。" },
    { ic: "☁️", n: "阴天", tip: "天色有点闷，注意调节情绪，多喝水。" }
  ];
  function weather() {
    var d = new Date();
    var seed = d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate();
    var w = WEATHERS[seed % WEATHERS.length];
    var temps = 6 + ((seed * 7) % 26);
    var days = ["日", "一", "二", "三", "四", "五", "六"];
    var forecast = "";
    for (var i = 0; i < 5; i++) {
      var dd = new Date(d.getTime() + i * 86400000);
      var s2 = dd.getFullYear() * 1000 + dd.getMonth() * 40 + dd.getDate();
      var w2 = WEATHERS[s2 % WEATHERS.length];
      var t2 = 6 + ((s2 * 7) % 26);
      forecast += '<div class="x570-wx-day"><div class="w">周' + days[dd.getDay()] + '</div><div class="ic">' + w2.ic + '</div><div class="t">' + t2 + '°</div></div>';
    }
    screen("🌦️ 天气日历",
      '<div class="x570-card x570-center"><div style="font-size:54px">' + w.ic + '</div>' +
      '<div style="font-size:24px;font-weight:800">' + w.n + " " + temps + "°C" + '</div>' +
      '<div class="d" style="margin-top:6px">' + esc(w.tip) + '</div></div>' +
      '<div class="x570-card"><div class="t">未来五天</div><div class="x570-wx-grid">' + forecast + '</div></div>' +
      '<div class="x570-card"><div class="t">作息时间表</div>' +
      '<div class="x570-time">07:30 早自习</div><div class="x570-time">08:00 第一节课</div>' +
      '<div class="x570-time">09:50 大课间</div><div class="x570-time">11:50 上午放学</div>' +
      '<div class="x570-time">13:30 下午第一节课</div><div class="x570-time">17:10 放学</div>' +
      '<div class="x570-time">18:30 晚自习</div></div>');
  }

  /* ---------------- 课表 ---------------- */
  var SCHEDULE = [
    ["语文", "数学", "英语", "物理", "化学", "体育"],
    ["数学", "语文", "地理", "英语", "生物", "音乐"],
    ["英语", "物理", "数学", "语文", "化学", "美术"],
    ["化学", "英语", "语文", "地理", "数学", "信息"],
    ["物理", "语文", "英语", "数学", "体育", "班会"],
    ["自习", "社团", "社团", "校本", "校本", "放学"]
  ];
  var PERIODS = ["早自习", "第一节", "第二节", "第三节", "第四节", "下午"];
  function schedule() {
    var html = '<div class="x570-card"><div class="t">一周课表（物化地方向）</div><div class="x570-sched"><table><thead><tr><th>时段</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th></tr></thead><tbody>';
    for (var p = 0; p < 6; p++) {
      html += '<tr><td>' + PERIODS[p] + '</td>';
      for (var d2 = 0; d2 < 6; d2++) html += '<td>' + SCHEDULE[d2][p] + '</td>';
      html += '</tr>';
    }
    html += '</tbody></table></div></div>';
    screen("📅 我的课表", html);
  }

  /* ---------------- 番茄钟 ---------------- */
  function pomodoro() {
    var b = screen("⏱️ 番茄钟",
      '<div class="x570-card x570-center"><div id="pMin" style="font-size:60px;font-weight:900">25:00</div>' +
      '<div class="d">25 分钟专注，结束后休息 5 分钟</div>' +
      '<div style="margin-top:12px"><button class="x570-btn" id="pStart">开始</button> <button class="x570-btn" id="pReset">重置</button></div>' +
      '<div class="d" style="margin-top:10px">今日完成 <b id="pDone">0</b> 个番茄</div></div>');
    var total = 25 * 60, left = total, t = null, running = false;
    var doneKey = "xz570_pomo_" + new Date().toDateString();
    $("#pDone").textContent = lsGet(doneKey, "0");
    function render() {
      var m = Math.floor(left / 60), s = left % 60;
      $("#pMin").textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    }
    on(b, "click", function (e) {
      if (e.target.closest("#pStart")) {
        if (running) { clearInterval(t); running = false; $("#pStart").textContent = "继续"; return; }
        running = true; $("#pStart").textContent = "暂停";
        t = setInterval(function () {
          left--; render();
          if (left <= 0) {
            clearInterval(t); running = false;
            var n = (+lsGet(doneKey, "0") || 0) + 1;
            lsSet(doneKey, String(n));
            $("#pDone").textContent = n;
            left = 5 * 60; render();
            H.toast("🍅 专注完成，休息 5 分钟");
          }
        }, 1000);
      }
      if (e.target.closest("#pReset")) { clearInterval(t); running = false; left = total; $("#pStart").textContent = "开始"; render(); }
    });
  }

  /* ---------------- 计算器 ---------------- */
  function calc() {
    var b = screen("🧮 计算器",
      '<div class="x570-card"><div id="cOut" style="font-size:34px;font-weight:800;text-align:right;padding:14px;border-radius:12px;background:rgba(255,255,255,.08);min-height:60px;word-break:break-all">0</div>' +
      '<div class="x570-calc">' +
      ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+"].map(function (k) {
        return '<button class="x570-calc-key" data-k="' + k + '">' + k + '</button>';
      }).join("") +
      '<button class="x570-calc-key" data-k="C" style="grid-column:span 2">清空</button>' +
      '<button class="x570-calc-key" data-k="back" style="grid-column:span 2">退格</button>' +
      '</div></div>');
    var expr = "";
    function show() {
      var v = expr || "0";
      try {
        var safe = v.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");
        if (/^[0-9+\-*/.()\s]+$/.test(safe)) {
          var r = Function("return (" + safe + ")")();
          $("#cOut").textContent = v + (v ? " = " + (Math.round(r * 1e6) / 1e6) : "");
        } else { $("#cOut").textContent = v; }
      } catch (e) { $("#cOut").textContent = v; }
    }
    on(b, "click", function (e) {
      var k = e.target.closest(".x570-calc-key");
      if (!k) return;
      var ch = k.getAttribute("data-k");
      if (ch === "C") expr = "";
      else if (ch === "back") expr = expr.slice(0, -1);
      else if (ch === "=") {
        try {
          var safe = expr.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");
          var val = Function("return (" + safe + ")")();
          expr = String(Math.round(val * 1e6) / 1e6);
        } catch (err) { expr = ""; }
      } else expr += ch;
      show();
    });
  }

  /* ---------------- 便签 ---------------- */
  function note() {
    var KEY = "xz570_notes";
    var notes = [];
    try { notes = JSON.parse(lsGet(KEY, "[]")) || []; } catch (e) {}
    function persist() { lsSet(KEY, JSON.stringify(notes)); }
    function list() {
      var b = screen("📝 便签",
        '<div class="x570-card"><div class="t">我的便签</div>' +
        '<textarea id="nInput" rows="3" placeholder="写点什么，比如：周五要交物理卷子……" style="width:100%;border-radius:10px;padding:10px;box-sizing:border-box"></textarea>' +
        '<button class="x570-btn" id="nAdd" style="margin-top:8px">添加</button></div>' +
        '<div id="nList"></div>');
      $("#nList").innerHTML = notes.length ? notes.map(function (n, i) {
        return '<div class="x570-card"><div class="d">' + esc(n.t) + '</div><div class="x570-time">' + esc(n.d) + '</div><button class="x570-btn" data-del="' + i + '" style="margin-top:6px">删除</button></div>';
      }).join("") : '<div class="x570-card x570-center"><div class="d">还没有便签</div></div>';
      on($("#nAdd"), "click", function () {
        var v = $("#nInput").value.trim();
        if (!v) return;
        notes.unshift({ t: v, d: new Date().toLocaleString("zh-CN") });
        persist(); list();
      });
      on($("#nList"), "click", function (e) {
        var dd = e.target.closest("[data-del]");
        if (dd) { notes.splice(+dd.getAttribute("data-del"), 1); persist(); list(); }
      });
    }
    list();
  }

  /* ---------------- 随机点名 ---------------- */
  var ROLL_NAMES = ["陈一帆", "周子墨", "李梓萱", "王浩然", "赵雨桐", "刘思远", "孙若曦", "杨博文", "黄欣怡", "吴俊杰", "徐梦瑶", "朱皓宇", "胡嘉怡", "郭天佑", "林诗涵", "何子涵", "高睿哲", "马一诺", "罗晨曦", "郑宇辰"];
  function roll() {
    var b = screen("🎯 随机点名",
      '<div class="x570-card x570-center"><div id="rName" style="font-size:38px;font-weight:900;min-height:60px">准备好了吗？</div>' +
      '<button class="x570-btn" id="rBtn" style="margin-top:12px">开始点名</button>' +
      '<div class="d" style="margin-top:10px">可点右侧把同学加入自定义名单</div>' +
      '<input id="rCustom" placeholder="自定义名单，用空格分隔" style="width:100%;margin-top:8px;padding:10px;border-radius:10px;box-sizing:border-box"></div>');
    var pool = ROLL_NAMES, t = null;
    on(b, "click", function (e) {
      if (e.target.closest("#rBtn")) {
        var custom = $("#rCustom").value.trim();
        if (custom) pool = custom.split(/\s+/);
        if (t) { clearInterval(t); t = null; $("#rBtn").textContent = "再点一次"; }
        else {
          $("#rBtn").textContent = "停止";
          var n = 0;
          t = setInterval(function () {
            $("#rName").textContent = pool[Math.floor(Math.random() * pool.length)];
            n++;
            if (n > 18 && Math.random() < 0.25) { clearInterval(t); t = null; $("#rBtn").textContent = "就你了！"; }
          }, 70);
        }
      }
    });
  }

  X570.Campus = { open: open, route: route };
  X570.CampusSub = {};
  X570.register("campus", function () {}, 3);
})();

/* ===== a130_events.js ===== */
/* =====================================================================
   校园随机事件系统：上百个日常小剧情，选择影响属性、心情、人际
   纯追加，不改旧逻辑；属性变化 best-effort 写入 window.G
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;

  function fx(map) {
    try {
      if (!window.G) return;
      for (var k in map) {
        if (k in G) G[k] = (typeof G[k] === "number" ? G[k] + map[k] : map[k]);
      }
    } catch (e) {}
  }

  /* 事件库：每个事件 2-3 个选项，result 为结果文案，fx 为属性变化 */
  var EV = [
    { ic: "📣", t: "早晨的广播", d: "校园广播里放着今日的通知，你还没睡醒。", o: [
      { l: "认真听通知", r: "你听清了今天有突击检查，提前把校服整理好。", fx: { knowledge: 1 } },
      { l: "趴在桌上补觉", r: "你多睡了十分钟，精神好了一点，却错过了通知。", fx: { mood: 1 } }
    ]},
    { ic: "🥛", t: "小卖部的豆浆", d: "早自习前，小卖部只剩最后一杯热豆浆。", o: [
      { l: "买下来自己喝", r: "热豆浆下肚，一上午都很暖和。", fx: { mood: 1, money: -2 } },
      { l: "让给没吃早饭的同桌", r: "同桌连声道谢，你们的关系更近了。", fx: { mood: 2, social: 2 } }
    ]},
    { ic: "📚", t: "忘记带的课本", d: "上课铃响，你发现这节课的书落在宿舍了。", o: [
      { l: "和同桌合看一本", r: "你们挤在一起，小声地把笔记补全。", fx: { social: 1 } },
      { l: "举手向老师承认", r: "老师让你站着听了半节课，你印象深刻。", fx: { knowledge: 2 } },
      { l: "悄悄跑去借", r: "你从隔壁班借到了书，没被发现。", fx: { mood: 1 } }
    ]},
    { ic: "✏️", t: "课间借橡皮", d: "前排的女生转过身，向你借橡皮。", o: [
      { l: "大方地递过去", r: "她笑着说谢谢，你们聊了几句。", fx: { social: 2 } },
      { l: "装作没听见", r: "她有点尴尬地转了回去。", fx: { social: -1 } }
    ]},
    { ic: "🧹", t: "轮到你值日", d: "今天是你的值日，但放学后你想早点回家。", o: [
      { l: "认真打扫完再走", r: "教室被打扫得干干净净，老师表扬了你。", fx: { mood: 1, social: 1 } },
      { l: "随便扫两下溜走", r: "第二天检查被扣了分，你有点过意不去。", fx: { mood: -2 } }
    ]},
    { ic: "🍱", t: "食堂的新菜", d: "食堂今天推出了一道从没见过的菜，队伍排得很长。", o: [
      { l: "排队尝鲜", r: "意外地好吃，你还跟打饭阿姨多要了一勺。", fx: { mood: 2 } },
      { l: "吃熟悉的盖浇饭", r: "稳妥的选择，不踩雷。", fx: { mood: 1 } }
    ]},
    { ic: "🏃", t: "体育课的八百米", d: "又到了让人头疼的耐力跑。", o: [
      { l: "咬牙冲完全程", r: "你跑出了个人最好成绩，瘫在草地上喘着气笑。", fx: { health: 3, knowledge: 1 } },
      { l: "匀速慢跑", r: "不追求名次，稳稳跑完。", fx: { health: 2 } },
      { l: "借口肚子疼请假", r: "你在边上看了一节课，心里有点虚。", fx: { health: -1, mood: -1 } }
    ]},
    { ic: "🌧️", t: "突如其来的雨", d: "放学时下起了大雨，你没带伞。", o: [
      { l: "冒雨冲回宿舍", r: "你淋成了落汤鸡，但笑得很开心。", fx: { health: -1, mood: 1 } },
      { l: "在教学楼等雨停", r: "你在走廊看了很久的雨，意外地很安静。", fx: { mood: 2 } },
      { l: "和别人共撑一把伞", r: "你们挤在一把伞下，肩膀挨着肩膀。", fx: { social: 2 } }
    ]},
    { ic: "🎒", t: "捡到的校园卡", d: "你在楼梯口捡到一张校园卡。", o: [
      { l: "送到失物招领处", r: "失主是隔壁班的同学，特意跑来道谢。", fx: { mood: 2, social: 2 } },
      { l: "发朋友圈找失主", r: "动态很快被转发，失主找到了你。", fx: { social: 1, mood: 1 } }
    ]},
    { ic: "🧮", t: "黑板上的难题", d: "老师出了一道很难的题，教室里一片安静。", o: [
      { l: "举手尝试解题", r: "虽然没全对，但老师夸你思路清晰。", fx: { knowledge: 3, mood: 1 } },
      { l: "在草稿纸上默默演算", r: "你算到一半，下课铃响了。", fx: { knowledge: 2 } },
      { l: "等学霸上去写", r: "你抄下了答案，准备课后再看。", fx: { knowledge: 1 } }
    ]},
    { ic: "📱", t: "课上的手机", d: "你的手机在抽屉里震动了一下。", o: [
      { l: "专心听课，下课再看", r: "你记下了这节课的重点，收获满满。", fx: { knowledge: 2 } },
      { l: "偷偷看一眼", r: "是一条群消息，你被老师点名回答问题。", fx: { mood: -2, knowledge: -1 } }
    ]},
    { ic: "🐱", t: "校园里的猫", d: "花坛边蹲着一只橘猫，正懒洋洋地晒太阳。", o: [
      { l: "蹲下来喂它火腿肠", r: "橘猫蹭了蹭你的手，心都化了。", fx: { mood: 3, money: -1 } },
      { l: "拍照发朋友圈", r: "「学校的猫」收获了一片点赞。", fx: { mood: 2 } },
      { l: "赶时间，快步离开", r: "橘猫看了你一眼，继续睡。", fx: {} }
    ]},
    { ic: "📖", t: "图书馆的座位", d: "图书馆靠窗的位置只剩一个，旁边是熟悉的身影。", o: [
      { l: "走过去坐下", r: "你们一起安静自习，效率出奇地高。", fx: { knowledge: 3, social: 1 } },
      { l: "换一个角落", r: "你独自看书，也很专注。", fx: { knowledge: 2 } }
    ]},
    { ic: "🎵", t: "课间的歌", d: "有人在教室里用音箱放了一首很好听的歌。", o: [
      { l: "问歌名", r: "你加入了大家的歌单讨论。", fx: { social: 2 } },
      { l: "跟着轻轻哼", r: "你的心情被旋律点亮了。", fx: { mood: 2 } }
    ]},
    { ic: "📝", t: "传过来的小纸条", d: "课上传来一张折好的纸条，写着：下课去小卖部吗？", o: [
      { l: "回：好啊，我请你", r: "下课后你们一起去小卖部，聊得很开心。", fx: { social: 2, money: -3 } },
      { l: "回：这节课先听讲", r: "对方回了个「好」，并加了个佩服的表情。", fx: { knowledge: 1 } }
    ]},
    { ic: "🏀", t: "操场上的球赛", d: "体育课自由活动，篮球场上少一个人。", o: [
      { l: "加入比赛", r: "你跑了一节课，投进了两个球。", fx: { health: 3, social: 2 } },
      { l: "坐在看台上加油", r: "你为同学呐喊，气氛热烈。", fx: { social: 1, mood: 1 } }
    ]},
    { ic: "🧪", t: "化学实验课", d: "做实验时，你的搭档不小心加多了试剂。", o: [
      { l: "提醒并一起重新做", r: "你们配合默契，顺利完成实验。", fx: { knowledge: 3, social: 1 } },
      { l: "手忙脚乱地补救", r: "虽然颜色有点奇怪，但结果勉强合格。", fx: { knowledge: 1 } }
    ]},
    { ic: "📐", t: "数学卷子发下来", d: "这次月考数学成绩出来了。", o: [
      { l: "认真分析错题", r: "你把每道错题都搞懂了，下次更有把握。", fx: { knowledge: 3 } },
      { l: "和同桌对答案", r: "你们发现了共同的薄弱点，约好一起补。", fx: { knowledge: 2, social: 1 } },
      { l: "把卷子塞进抽屉", r: "你决定暂时不想看它。", fx: { mood: -1 } }
    ]},
    { ic: "🍜", t: "夜宵的诱惑", d: "晚自习后，室友提议去吃夜宵。", o: [
      { l: "一起去吃碗面", r: "热乎的夜宵和闲聊，治愈了一天的疲惫。", fx: { mood: 3, money: -8 } },
      { l: "回宿舍泡麦片", r: "你省了钱，也早点休息。", fx: { health: 1, money: 2 } }
    ]},
    { ic: "🌙", t: "宿舍夜谈", d: "熄灯后，室友们聊起了各自的心事。", o: [
      { l: "加入聊天，说说自己", r: "你们聊到很晚，关系更近了。", fx: { social: 3, mood: 2 } },
      { l: "戴上耳机早睡", r: "你保证了充足的睡眠。", fx: { health: 2 } }
    ]},
    { ic: "🎨", t: "黑板报任务", d: "宣传委员找人一起做这期黑板报。", o: [
      { l: "主动报名写字", r: "你认真写的标题被夸了。", fx: { social: 2, mood: 2 } },
      { l: "负责画插画", r: "你的画让板报生动起来。", fx: { mood: 2 } },
      { l: "推辞说不擅长", r: "你继续埋头写作业。", fx: { knowledge: 1 } }
    ]},
    { ic: "📮", t: "情书风波", d: "有同学偷偷塞给你一封没有署名的信。", o: [
      { l: "礼貌地收好，不去声张", r: "你保护了对方的体面。", fx: { mood: 1, social: 2 } },
      { l: "拿给朋友看", r: "事情传开了，对方有些难堪。", fx: { social: -2 } }
    ]},
    { ic: "🚲", t: "自行车没气了", d: "放学你发现车胎瘪了。", o: [
      { l: "推去校门口修车摊", r: "师傅手脚麻利，很快补好了。", fx: { money: -3 } },
      { l: "借打气筒自己打", r: "你弄了一手灰，还是搞定了。", fx: { mood: 1 } }
    ]},
    { ic: "📊", t: "学习委员的邀请", d: "学习委员想组一个学习小组。", o: [
      { l: "加入并担任组长", r: "你带着大家一起复习，自己也进步明显。", fx: { knowledge: 3, social: 2 } },
      { l: "加入但不做组长", r: "你跟着大家一起学，很有收获。", fx: { knowledge: 2 } }
    ]},
    { ic: "🍬", t: "老师的糖", d: "公开课上，老师给表现好的同学发糖。", o: [
      { l: "积极举手回答问题", r: "你拿到了一颗橘子味的糖。", fx: { knowledge: 2, mood: 2 } },
      { l: "安静听讲", r: "你虽没拿到糖，但听得很认真。", fx: { knowledge: 1 } }
    ]},
    { ic: "🪞", t: "仪容仪表检查", d: "今天有仪容仪表检查，你的头发有点长。", o: [
      { l: "趁课间把头发理整齐", r: "你顺利通过了检查。", fx: { mood: 1 } },
      { l: "被记了名字，周末去剪", r: "班级被提醒，你答应周末就剪。", fx: { mood: -1 } }
    ]},
    { ic: "📦", t: "网购的快递", d: "你买的东西到了菜鸟驿站，短信提醒你去取。", o: [
      { l: "下课去取", r: "拆快递的快乐谁懂啊。", fx: { mood: 2, money: -20 } },
      { l: "等放学再取", r: "你先专心上课，期待留到放学后。", fx: { knowledge: 1 } }
    ]},
    { ic: "☕", t: "犯困的下午", d: "第一节课后你就困得睁不开眼。", o: [
      { l: "去洗把冷水脸", r: "你清醒了不少，撑过了下午。", fx: { knowledge: 1 } },
      { l: "课间趴十分钟", r: "短睡之后精神好了一些。", fx: { health: 1 } },
      { l: "硬撑着听课", r: "你记的笔记歪歪扭扭。", fx: { knowledge: -1 } }
    ]},
    { ic: "🎂", t: "同学生日", d: "室友今天生日，大家准备了惊喜。", o: [
      { l: "凑钱买个小蛋糕", r: "宿舍关灯点蜡烛，气氛很暖。", fx: { social: 3, money: -15 } },
      { l: "写一张贺卡", r: "你手写的祝福让对方很感动。", fx: { social: 2, mood: 1 } }
    ]},
    { ic: "📈", t: "突然的提问", d: "老师毫无预兆地点了你的名字。", o: [
      { l: "镇定地说出自己的思路", r: "老师点点头，你坐下来时心跳还很快。", fx: { knowledge: 2, mood: 2 } },
      { l: "诚实说不会", r: "老师让你坐下再想想，你记住了这道题。", fx: { knowledge: 1 } },
      { l: "支支吾吾", r: "你站着听完了别人的回答。", fx: { mood: -1 } }
    ]},
    { ic: "🖊️", t: "没水的笔", d: "考试时，你的笔突然写不出字了。", o: [
      { l: "向监考老师借备用笔", r: "老师递来一支，你顺利答完。", fx: { mood: 1 } },
      { l: "向邻座借", r: "你借到了笔，但被提醒下次带齐。", fx: { social: 1 } }
    ]},
    { ic: "🌸", t: "桂花又开了", d: "秋天，校园里的桂花又香了。", o: [
      { l: "停下来捡几朵夹进书里", r: "书页里留下了整个秋天的味道。", fx: { mood: 3 } },
      { l: "拍照发朋友圈", r: "「学校的秋天」引来一片赞。", fx: { mood: 2 } },
      { l: "匆匆走过", r: "你忙着赶去上课，只闻到一阵香。", fx: {} }
    ]},
    { ic: "🏫", t: "升旗仪式", d: "周一升旗，太阳很晒。", o: [
      { l: "站姿端正，认真听国旗下讲话", r: "你听到了一个关于坚持的故事。", fx: { mood: 1 } },
      { l: "趁人多悄悄活动脚", r: "你舒服了一点，没被发现。", fx: { mood: 1 } }
    ]},
    { ic: "🧊", t: "夏天的空调", d: "教室空调坏了，闷热难当。", o: [
      { l: "和同学一起报修", r: "维修师傅很快来修好了，全班感谢你。", fx: { social: 2, mood: 2 } },
      { l: "用本子扇风", r: "你凑合熬过了一节课。", fx: { mood: -1 } }
    ]},
    { ic: "🥶", t: "冬天的教室", d: "寒潮来了，教室里很冷，你的手冻得发红。", o: [
      { l: "搓搓手继续写", r: "你写完了作业，手也慢慢热了。", fx: { knowledge: 2 } },
      { l: "和同学借暖宝宝", r: "一片小小的暖宝宝，温暖了一节课。", fx: { social: 1, mood: 2 } }
    ]},
    { ic: "📺", t: "班会课看纪录片", d: "班会课放了一部关于自然的纪录片。", o: [
      { l: "认真看，做记录", r: "你被画面震撼，对世界多了一点好奇。", fx: { knowledge: 2, mood: 1 } },
      { l: "趁机补觉", r: "你在黑暗里睡了舒服的一觉。", fx: { health: 1 } }
    ]},
    { ic: "🎒", t: "同桌的烦恼", d: "同桌看起来心情很差，趴在桌上。", o: [
      { l: "轻声问她怎么了", r: "她倾诉了一会儿，说谢谢你愿意听。", fx: { social: 3, mood: 2 } },
      { l: "给她留一张纸条", r: "纸条上写着：会好起来的。", fx: { social: 2 } },
      { l: "不去打扰", r: "你让她一个人静了静。", fx: {} }
    ]},
    { ic: "🚌", t: "拥挤的校车", d: "放学的校车挤满了人，你没抢到座位。", o: [
      { l: "给低年级同学让座", r: "对方家长连声道谢。", fx: { social: 2, mood: 1 } },
      { l: "站着听一路歌", r: "你戴着耳机，倒也没那么难熬。", fx: { mood: 1 } }
    ]},
    { ic: "📔", t: "掉在地上的日记本", d: "你看到前排同学的日记本掉在地上，翻开了一页。", o: [
      { l: "捡起来合上，原样归还", r: "你尊重了别人的隐私，对方很感激。", fx: { social: 2 } },
      { l: "忍不住看了一眼", r: "你赶紧合上，心里却一直放不下。", fx: { mood: -1 } }
    ]},
    { ic: "🎤", t: "文艺汇演报名", d: "班级文艺汇演缺一个节目。", o: [
      { l: "报名独唱", r: "你鼓起勇气站上了舞台，掌声很响。", fx: { social: 3, mood: 3 } },
      { l: "报名合唱", r: "你和同学们一起完成了节目。", fx: { social: 2 } },
      { l: "做幕后工作人员", r: "你负责灯光和道具，同样重要。", fx: { social: 1 } }
    ]},
    { ic: "📖", t: "推荐的书", d: "语文老师推荐了一本课外书。", o: [
      { l: "去图书馆借来读", r: "你读得入迷，还写了读书笔记。", fx: { knowledge: 3, mood: 1 } },
      { l: "记下书名以后再说", r: "你把它加进了待读清单。", fx: { knowledge: 1 } }
    ]},
    { ic: "🧯", t: "消防演练", d: "学校组织消防疏散演练。", o: [
      { l: "认真按要求撤离", r: "你快速有序地到达集合点，学会了自救。", fx: { knowledge: 1 } },
      { l: "边走边和同学说笑", r: "你被老师提醒要严肃对待。", fx: { mood: -1 } }
    ]},
    { ic: "🥪", t: "忘带午饭钱", d: "到了食堂你才发现饭卡没钱了。", o: [
      { l: "向同学借，明天还", r: "你借到了饭钱，记在心里第二天就还。", fx: { social: 1 } },
      { l: "回宿舍啃面包", r: "你用囤的面包对付了一顿。", fx: { mood: -1 } }
    ]},
    { ic: "📱", t: "手机被没收", d: "有人课上玩手机被老师没收了。", o: [
      { l: "引以为戒，收好手机", r: "你把手机调成静音放进书包。", fx: { knowledge: 1 } },
      { l: "暗自庆幸没被发现", r: "你也悄悄把手机收了起来。", fx: { mood: 1 } }
    ]},
    { ic: "🌅", t: "早起的操场", d: "你难得早起，操场上人很少。", o: [
      { l: "跑两圈再去吃早饭", r: "清晨的风让你一整天都很清醒。", fx: { health: 2, knowledge: 1 } },
      { l: "在看台上背单词", r: "清晨的记忆力特别好。", fx: { knowledge: 2 } }
    ]},
    { ic: "✂️", t: "手工课作业", d: "信息课要做一份手工作品，你不太擅长。", o: [
      { l: "跟着教程认真做", r: "你的作品虽然朴素，但很用心。", fx: { mood: 1, knowledge: 1 } },
      { l: "请手巧的同学帮忙", r: "你们合作完成，你负责构思。", fx: { social: 2 } }
    ]},
    { ic: "🧾", t: "食堂多找的钱", d: "打饭阿姨多找了你十块钱。", o: [
      { l: "还回去", r: "阿姨笑着夸你诚实。", fx: { social: 2, mood: 2 } },
      { l: "默不作声离开", r: "你走了几步，心里一直不踏实。", fx: { mood: -2 } }
    ]},
    { ic: "📑", t: "成堆的试卷", d: "各科试卷堆得像小山。", o: [
      { l: "列计划，逐科攻克", r: "你按计划完成，没有拖延。", fx: { knowledge: 3, mood: 1 } },
      { l: "挑最紧的先做", r: "你完成了明天要交的部分。", fx: { knowledge: 1 } },
      { l: "先放着，玩会儿手机", r: "你越拖越焦虑。", fx: { mood: -2 } }
    ]},
    { ic: "🤝", t: "新同学", d: "班里转来一位新同学，有些拘谨。", o: [
      { l: "主动带他熟悉校园", r: "你成了他在新班级认识的第一个朋友。", fx: { social: 3, mood: 2 } },
      { l: "点头微笑", r: "你释放了善意，他也放松了一点。", fx: { social: 1 } }
    ]},
    { ic: "🎯", t: "选科的困惑", d: "有同学来问你选科的想法。", o: [
      { l: "认真分享你的规划", r: "你们一起分析了各自的优势和兴趣。", fx: { knowledge: 1, social: 2 } },
      { l: "说自己也没想好", r: "你们决定一起找老师聊聊。", fx: { social: 1 } }
    ]},
    { ic: "🪟", t: "擦玻璃的午后", d: "值日时你被安排擦走廊的玻璃。", o: [
      { l: "擦得一尘不染", r: "阳光透过干净的玻璃洒进来，很治愈。", fx: { mood: 2 } },
      { l: "应付了事", r: "玻璃上还留着水痕。", fx: { mood: -1 } }
    ]},
    { ic: "📻", t: "广播站招新", d: "校园广播站在招新播音员。", o: [
      { l: "报名试试", r: "你的声音通过了初试，很有成就感。", fx: { social: 2, mood: 2 } },
      { l: "在幕后写稿", r: "你写的稿子被播了出来。", fx: { knowledge: 1, mood: 1 } }
    ]},
    { ic: "🥽", t: "实验室的安全", d: "实验前老师反复强调安全规范。", o: [
      { l: "逐条记住", r: "你规范操作，顺利完成所有实验。", fx: { knowledge: 2 } },
      { l: "大致听一下", r: "你在操作时多问了同学几次。", fx: { knowledge: 1 } }
    ]},
    { ic: "🚪", t: "教室的门坏了", d: "后门的锁坏了，关不严。", o: [
      { l: "告诉后勤师傅", r: "门锁很快修好，大家都安心了。", fx: { social: 1 } },
      { l: "用椅子顶着", r: "临时办法凑合用了一天。", fx: { mood: 1 } }
    ]},
    { ic: "🎒", t: "运动会报名", d: "班委在统计运动会的报名名单。", o: [
      { l: "报名个人项目", r: "你决定挑战一下自己。", fx: { health: 2, mood: 1 } },
      { l: "报名接力和集体项目", r: "你和全班一起备战。", fx: { social: 2, health: 1 } },
      { l: "报名啦啦队", r: "你在看台上为班级呐喊。", fx: { mood: 1 } }
    ]},
    { ic: "🌃", t: "停电的晚自习", d: "晚自习突然停电，教室里一片欢呼。", o: [
      { l: "点起台灯继续学", r: "你在微弱的灯光下坚持自习。", fx: { knowledge: 2 } },
      { l: "和大家一起聊天等电来", r: "难得的放松，大家聊得很开心。", fx: { social: 2, mood: 2 } }
    ]},
    { ic: "🍂", t: "扫落叶", d: "秋天操场落满了树叶，学校组织大扫除。", o: [
      { l: "和同学分工扫落叶", r: "你们堆起一座小小的叶山。", fx: { social: 2, mood: 1 } },
      { l: "捡落叶做书签", r: "你做了几枚漂亮的书签。", fx: { mood: 2 } }
    ]},
    { ic: "📚", t: "同学借笔记", d: "有同学请假，想借你的笔记抄。", o: [
      { l: "大方地借给他", r: "你的笔记帮上了大忙。", fx: { social: 2 } },
      { l: "先复印一份再借", r: "你保留了原件，也帮了他。", fx: { social: 1 } }
    ]},
    { ic: "🧋", t: "校门口的奶茶", d: "新开的奶茶店第二杯半价。", o: [
      { l: "和朋友拼单", r: "你们边走边喝，很开心。", fx: { social: 2, mood: 2, money: -12 } },
      { l: "忍住不喝", r: "你把钱省了下来。", fx: { mood: 1, money: 2 } }
    ]},
    { ic: "🎯", t: "课堂小测验", d: "老师临时来了个五分钟小测。", o: [
      { l: "沉着作答", r: "你复习到位，答得很顺利。", fx: { knowledge: 2, mood: 1 } },
      { l: "有点慌，凭印象写", r: "你发现自己还有薄弱点。", fx: { knowledge: 1 } }
    ]},
    { ic: "🪴", t: "班级绿植", d: "讲台上的盆栽没人照料，有些枯萎。", o: [
      { l: "主动承担浇水任务", r: "绿植慢慢恢复了生机，教室多了点绿意。", fx: { mood: 2, social: 1 } },
      { l: "提醒值日生", r: "有人负责浇水了。", fx: { social: 1 } }
    ]},
    { ic: "📞", t: "家里的电话", d: "午休时妈妈打来电话，问你近况。", o: [
      { l: "耐心地和她聊几句", r: "挂了电话，心里暖暖的。", fx: { mood: 2 } },
      { l: "匆匆说在忙", r: "你继续写作业，但有点想家。", fx: { mood: -1 } }
    ]},
    { ic: "🏆", t: "流动红旗", d: "这一周的流动红旗评比开始了。", o: [
      { l: "提醒大家保持纪律卫生", r: "班级拿到了流动红旗。", fx: { social: 2, mood: 2 } },
      { l: "做好自己就行", r: "你保持了个人卫生和纪律。", fx: { mood: 1 } }
    ]},
    { ic: "🧩", t: "课桌上的谜题", d: "有人在课桌上用铅笔写了一道脑筋急转弯。", o: [
      { l: "想出来后写答案", r: "你和写题的人隔空互动，很有趣。", fx: { mood: 2 } },
      { l: "一笑而过", r: "你擦掉了它，保持桌面整洁。", fx: { mood: 1 } }
    ]},
    { ic: "📰", t: "校园报社", d: "校刊向全校征稿。", o: [
      { l: "投一篇随笔", r: "你的文章登在了校刊上，很有成就感。", fx: { knowledge: 2, mood: 2 } },
      { l: "投一幅插画", r: "你的画被选作了栏目的配图。", fx: { mood: 2 } }
    ]},
    { ic: "🧢", t: "校服外套", d: "天气忽冷忽热，你纠结要不要带外套。", o: [
      { l: "带上", r: "傍晚降温时你庆幸自己带了。", fx: { health: 1 } },
      { l: "不带", r: "你在冷风里瑟瑟发抖。", fx: { health: -1 } }
    ]},
    { ic: "🎯", t: "班级篮球赛", d: "班级联赛，你们班对阵隔壁班。", o: [
      { l: "当主力上场", r: "你拼到最后，虽有胜负但很尽兴。", fx: { health: 3, social: 2 } },
      { l: "组织啦啦队", r: "你们的呐喊给了球队很大鼓励。", fx: { social: 2, mood: 1 } }
    ]},
    { ic: "🧊", t: "实验楼的电梯", d: "实验楼的电梯总在上课前挤满人。", o: [
      { l: "走楼梯锻炼", r: "你爬到五楼，气喘吁吁但清醒。", fx: { health: 1 } },
      { l: "等下一趟电梯", r: "你准时到了实验室。", fx: { mood: 1 } }
    ]},
    { ic: "📓", t: "错题本", d: "老师检查错题本，你已经很久没整理了。", o: [
      { l: "连夜整理好", r: "你把错题归类，复习时一目了然。", fx: { knowledge: 3 } },
      { l: "补几页应付检查", r: "检查过了，但你知道还不够。", fx: { knowledge: 1 } }
    ]}
  ];

  var KEY = "xz570_events_seen";
  function seen() { try { return JSON.parse(lsGet(KEY, "[]")) || []; } catch (e) { return []; } }
  function markSeen(i) {
    var s = seen();
    s.push(i);
    if (s.length > 600) s = s.slice(-600);
    try { lsSet(KEY, JSON.stringify(s)); } catch (e) {}
  }

  function pick() {
    var s = seen();
    var pool = [];
    for (var i = 0; i < EV.length; i++) if (s.indexOf(i) < 0) pool.push(i);
    if (!pool.length) { try { lsSet(KEY, "[]"); } catch (e) {} return Math.floor(Math.random() * EV.length); }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function open() {
    var idx = pick();
    var ev = EV[idx];
    var el = H.openFull("x570Sub", "🎲 校园事件");
    var body = el.querySelector(".x570-full-body");
    function render() {
      body.innerHTML =
        '<div class="x570-card"><div class="t">' + ev.ic + " " + esc(ev.t) + '</div><div class="d">' + esc(ev.d) + '</div></div>' +
        '<div class="x570-list">' + ev.o.map(function (op, j) {
          return '<button class="x570-btn" data-j="' + j + '" style="text-align:left;margin-bottom:8px">' + esc(op.l) + '</button>';
        }).join("") + '</div>' +
        '<div class="x570-card" id="evResult" style="display:none"></div>' +
        '<div style="display:none" id="evNext"><button class="x570-btn" id="evNextBtn" style="width:100%">下一个事件 ▸</button></div>';
      on(body, "click", function (e) {
        var b = e.target.closest("[data-j]");
        if (b) {
          var op = ev.o[+b.getAttribute("data-j")];
          if (op.fx) fx(op.fx);
          markSeen(idx);
          var fxt = "";
          if (op.fx) {
            fxt = '<div style="margin-top:8px;font-size:13px">';
            var names = { knowledge: "知识", mood: "心情", social: "社交", health: "体质", money: "零花钱" };
            for (var k in op.fx) {
              var v = op.fx[k];
              fxt += '<span style="margin-right:8px;color:' + (v >= 0 ? "#22d06b" : "#ff5e62") + '">' + (names[k] || k) + (v >= 0 ? " +" : " ") + v + "</span>";
            }
            fxt += "</div>";
          }
          var res = $("#evResult");
          res.style.display = "block";
          res.innerHTML = '<div class="d">' + esc(op.r) + "</div>" + fxt;
          var nx = $("#evNext");
          nx.style.display = "block";
          body.querySelectorAll("[data-j]").forEach(function (x) { x.disabled = true; });
        }
        if (e.target.closest("#evNextBtn")) { idx = pick(); ev = EV[idx]; render(); }
      });
    }
    render();
  }

  X570.CampusSub.events = open;
  X570.Events = { open: open, EV: EV };
})();

/* ===== a131_events_b.js ===== */
/* 校园随机事件 · 第二批（追加进 X570.Events，不覆盖） */
(function () {
  var MORE = [
    { ic: "📐", t: "忘带的量角器", d: "数学课上要画角，你找不到量角器。", o: [
      { l: "向同桌借", r: "你们轮流用，都完成了作图。", fx: { social: 1, knowledge: 1 } },
      { l: "用三角板估算", r: "你估出了大概角度，老师说还行。", fx: { knowledge: 1 } }
    ]},
    { ic: "🦷", t: "牙痛的上午", d: "你突然牙疼，听课有点受影响。", o: [
      { l: "去医务室看看", r: "校医给了你处理建议，缓解了一些。", fx: { health: 1 } },
      { l: "忍到放学", r: "你勉强撑完了上午，决定尽快看牙医。", fx: { health: -1 } }
    ]},
    { ic: "📦", t: "同桌的快递", d: "同桌让你帮她拿一个很重的快递。", o: [
      { l: "热心帮她搬", r: "她请你喝了瓶水表示感谢。", fx: { social: 2, health: 1 } },
      { l: "说自己也有东西要拿", r: "她找了别人帮忙。", fx: {} }
    ]},
    { ic: "🌮", t: "食堂的黑暗料理", d: "今天推出了一道意想不到的“创新菜”。", o: [
      { l: "勇敢第一个尝", r: "意外地不难吃，你成了全班的探路者。", fx: { mood: 2, social: 1 } },
      { l: "观望别人的反应", r: "看到大家表情复杂，你默默选了常规菜。", fx: {} }
    ]},
    { ic: "🧴", t: "翻倒的墨水瓶", d: "同学的墨水碰翻了，溅到了桌上。", o: [
      { l: "赶紧帮忙清理", r: "你们一起抢救了差点被染黑的作业本。", fx: { social: 2 } },
      { l: "递纸巾", r: "你递上纸巾，帮忙稳住了局面。", fx: { social: 1 } }
    ]},
    { ic: "🎼", t: "课间的钢琴", d: "音乐教室的钢琴没人，你路过时手痒。", o: [
      { l: "进去弹一首熟悉的曲子", r: "琴声引来几个同学围观，你有点不好意思。", fx: { mood: 2, social: 1 } },
      { l: "在门口听了一会儿", r: "别人的琴声让你心情平静。", fx: { mood: 1 } }
    ]},
    { ic: "🏸", t: "羽毛球局", d: "体育课自由活动，有人邀请你打羽毛球。", o: [
      { l: "加入，打到出汗", r: "你跑动接球，玩得很尽兴。", fx: { health: 3, social: 1 } },
      { l: "当裁判记分", r: "你认真记分，也乐在其中。", fx: { social: 1 } }
    ]},
    { ic: "📔", t: "考试安排表", d: "期中考试安排贴出来了，时间比预想早。", o: [
      { l: "立刻排复习计划", r: "你把时间分成小块，心里有底多了。", fx: { knowledge: 2, mood: 1 } },
      { l: "先紧张一会儿", r: "你深呼吸，决定从今晚开始复习。", fx: { mood: -1 } }
    ]},
    { ic: "🥪", t: "第二份早餐", d: "买早餐时你多买了一份。", o: [
      { l: "送给没吃早饭的同学", r: "对方很感激，你们成了不错的朋友。", fx: { social: 2, money: -5 } },
      { l: "留到课间吃", r: "课间的加餐让你精神饱满。", fx: { health: 1 } }
    ]},
    { ic: "🪟", t: "教室太冷", d: "冬天教室的窗户关不严，冷风直灌。", o: [
      { l: "找密封条自己修", r: "你解决了漏风问题，全班暖和了。", fx: { social: 2, mood: 1 } },
      { l: "多穿一件", r: "你裹紧外套，凑合一节课。", fx: { health: 1 } }
    ]},
    { ic: "📝", t: "代写的请求", d: "有人想让你把作业借给他抄。", o: [
      { l: "拒绝并给他讲题", r: "他听懂了，也更感激你。", fx: { social: 2, knowledge: 1 } },
      { l: "直接借给他", r: "他抄完了，但什么也没学会。", fx: { social: -1 } },
      { l: "装作没带", r: "你回避了这个请求。", fx: {} }
    ]},
    { ic: "🌞", t: "晴好的大课间", d: "大课间阳光很好，大家都在操场上活动。", o: [
      { l: "去操场走两圈", r: "晒晒太阳，你整个人都舒展了。", fx: { health: 2, mood: 1 } },
      { l: "留在教室写作业", r: "你提前完成了一部分作业。", fx: { knowledge: 2 } }
    ]},
    { ic: "🐕", t: "校门口的狗", d: "校门口有一只温顺的流浪狗摇着尾巴。", o: [
      { l: "把早餐的包子分它一半", r: "小狗吃得很开心，一直跟着你到校门口。", fx: { mood: 2 } },
      { l: "远远地看看", r: "你担心它，但上课时间到了。", fx: {} }
    ]},
    { ic: "📊", t: "成绩排名", d: "班级成绩表出来了，你找到了自己的位置。", o: [
      { l: "找差距，定下目标", r: "你写下想追的名次，开始行动。", fx: { knowledge: 2 } },
      { l: "只和自己比", r: "你关注自己的进步，不被排名绑架。", fx: { mood: 1 } }
    ]},
    { ic: "🎁", t: "同桌的回礼", d: "同桌送了你一块糖，说感谢你上次帮忙。", o: [
      { l: "收下并道谢", r: "糖很甜，你们的关系又近了一点。", fx: { social: 1, mood: 2 } },
      { l: "推辞不过收下", r: "你答应下次也帮她。", fx: { social: 1 } }
    ]},
    { ic: "🧗", t: "攀爬架", d: "体育课上有人挑战攀爬架。", o: [
      { l: "尝试爬到顶", r: "你克服了一点恐高，顺利登顶。", fx: { health: 2, mood: 2 } },
      { l: "在下面保护同学", r: "你认真帮忙，很有责任心。", fx: { social: 1 } }
    ]},
    { ic: "📖", t: "读到一半的书", d: "你从图书馆借的书快到期了，还没读完。", o: [
      { l: "熬夜读完再续借", r: "你读完了故事，意犹未尽。", fx: { knowledge: 2, mood: 1 } },
      { l: "先去续借", r: "你争取到了更多时间。", fx: { mood: 1 } }
    ]},
    { ic: "🥶", t: "没热水的早晨", d: "宿舍热水器坏了，只有冷水。", o: [
      { l: "硬着头皮洗漱", r: "冷水让你瞬间清醒。", fx: { health: -1, mood: 1 } },
      { l: "去食堂打热水", r: "你顺利完成了洗漱。", fx: { mood: 1 } }
    ]},
    { ic: "📢", t: "募捐活动", d: "学校为生病的同学组织募捐。", o: [
      { l: "捐出零花钱", r: "你尽了一份心意，希望他早日康复。", fx: { social: 2, money: -10 } },
      { l: "帮忙写倡议书", r: "你的文字让更多人伸出援手。", fx: { social: 2, knowledge: 1 } }
    ]},
    { ic: "🪞", t: "教室的镜子", d: "走廊新添了一面仪容镜。", o: [
      { l: "整理一下校服再进班", r: "你精神抖擞地走进教室。", fx: { mood: 1 } },
      { l: "笑一笑给自己打气", r: "镜子里的你比想象中自信。", fx: { mood: 2 } }
    ]},
    { ic: "🧩", t: "转笔比赛", d: "课间有人发起转笔比赛。", o: [
      { l: "苦练并参加", r: "你学会了新招式，赢了一包糖。", fx: { mood: 2, social: 1 } },
      { l: "围观叫好", r: "你被高手的操作逗乐了。", fx: { mood: 1 } }
    ]},
    { ic: "📑", t: "满天飞的试卷", d: "走廊里一阵风把你的试卷吹得到处都是。", o: [
      { l: "和同学一起捡", r: "你们边捡边笑，很快整理好。", fx: { social: 1, mood: 1 } },
      { l: "手忙脚乱地追", r: "你最后还是捡回了全部试卷。", fx: { mood: 1 } }
    ]},
    { ic: "🎙️", t: "国旗下讲话", d: "轮到你班出人做国旗下讲话。", o: [
      { l: "主动报名", r: "你站在全校面前演讲，紧张但完成得很好。", fx: { social: 3, mood: 3 } },
      { l: "帮演讲者写稿", r: "你写的稿子被郑重地念了出来。", fx: { knowledge: 2, social: 1 } }
    ]},
    { ic: "🌶️", t: "食堂的辣味", d: "你不小心打到了很辣的菜。", o: [
      { l: "挑战到底", r: "你被辣得直哈气，但吃得很过瘾。", fx: { mood: 1, health: -1 } },
      { l: "去换一份不辣的", r: "阿姨理解地给你换了菜。", fx: { mood: 1 } }
    ]},
    { ic: "🪑", t: "松动的椅子", d: "你的椅子有点晃，上课很影响。", o: [
      { l: "找工具自己拧紧", r: "你修好了椅子，还顺手帮了邻座。", fx: { social: 1, mood: 1 } },
      { l: "报修后勤", r: "后勤师傅很快换了新椅子。", fx: { mood: 1 } }
    ]},
    { ic: "📻", t: "点歌的勇气", d: "你想给某个人点一首歌，却有点犹豫。", o: [
      { l: "鼓起勇气投点歌单", r: "午后广播响起那首歌，你心里暖暖的。", fx: { mood: 3, social: 1 } },
      { l: "把歌单收藏起来", r: "你决定再等一个合适的时机。", fx: { mood: 1 } }
    ]},
    { ic: "🏃", t: "楼梯间的冲刺", d: "快迟到了，你在楼梯间往上跑。", o: [
      { l: "加速但注意安全", r: "你在铃响前坐进了教室。", fx: { health: 1, mood: 1 } },
      { l: "干脆慢走", r: "你迟到了两分钟，下不为例。", fx: { mood: -1 } }
    ]},
    { ic: "📓", t: "被借走的橡皮", d: "有人借了你的橡皮一直没还。", o: [
      { l: "礼貌地要回来", r: "对方不好意思地还了橡皮。", fx: { social: 1 } },
      { l: "再买一块新的", r: "你新备了一块，旧的送他了。", fx: { money: -1 } }
    ]},
    { ic: "🌃", t: "熬夜的诱惑", d: "晚上你想再刷一会儿手机。", o: [
      { l: "准时睡觉", r: "第二天你精神饱满，听课效率高。", fx: { health: 2, knowledge: 1 } },
      { l: "刷到很晚", r: "你早上困得抬不起头。", fx: { health: -2, knowledge: -1 } }
    ]},
    { ic: "🎒", t: "书包里的秘密", d: "你收拾书包时翻出一张很久以前的小纸条。", o: [
      { l: "认真看一遍，收好", r: "纸条上的话让你会心一笑。", fx: { mood: 2 } },
      { l: "把它贴进纪念册", r: "你把回忆都整理了起来。", fx: { mood: 1 } }
    ]},
    { ic: "🥗", t: "想减肥的同学", d: "同学说最近想减肥，中午只吃水果。", o: [
      { l: "建议她好好吃饭、多运动", r: "她接受了建议，你们约好一起跑步。", fx: { social: 2, health: 1 } },
      { l: "不评价", r: "你尊重她的选择。", fx: {} }
    ]},
    { ic: "🎯", t: "课堂展示", d: "小组作业轮到你上台展示。", o: [
      { l: "提前准备，自信开讲", r: "你的展示条理清楚，得到了掌声。", fx: { knowledge: 2, social: 2 } },
      { l: "紧张地念稿子", r: "你完成了展示，决定下次更熟练。", fx: { knowledge: 1 } }
    ]},
    { ic: "📦", t: "失物招领", d: "你丢了很久的校园卡居然被找到了。", o: [
      { l: "去失物招领处认领", r: "校园卡失而复得，你松了口气。", fx: { mood: 2 } },
      { l: "感谢捡到的人", r: "你在群里发了感谢。", fx: { social: 1 } }
    ]},
    { ic: "🌬️", t: "大风天的烦恼", d: "大风把你的作业本吹得哗哗响。", o: [
      { l: "用文具盒压住", r: "你稳住了本子继续写。", fx: { knowledge: 1 } },
      { l: "换到窗边背风处", r: "你找到了一个安静的位置。", fx: { mood: 1 } }
    ]},
    { ic: "🍚", t: "食堂的免费汤", d: "今天的紫菜蛋花汤特别好喝。", o: [
      { l: "去打一碗", r: "热汤暖胃，很满足。", fx: { health: 1, mood: 1 } },
      { l: "不喝汤，多喝水", r: "你选择了白水。", fx: { health: 1 } }
    ]},
    { ic: "🖍️", t: "班会画海报", d: "班级活动要画海报，缺一个人。", o: [
      { l: "报名负责配色", r: "你选的颜色让海报很出彩。", fx: { mood: 2, social: 1 } },
      { l: "帮忙写字", r: "你工整的字派上了用场。", fx: { social: 1 } }
    ]},
    { ic: "🚿", t: "排队的澡堂", d: "晚自习后澡堂人很多。", o: [
      { l: "早点去排队", r: "你很快洗上了热水澡。", fx: { health: 1, mood: 1 } },
      { l: "等熄灯前再去", r: "人少了，但你也困了。", fx: { mood: 1 } }
    ]},
    { ic: "📚", t: "分科的纠结", d: "有同学在选科上很迷茫，向你倾诉。", o: [
      { l: "帮她分析优势和兴趣", r: "她想清楚了不少，向你道谢。", fx: { social: 2, knowledge: 1 } },
      { l: "建议她找老师聊", r: "她约了老师做职业规划。", fx: { social: 1 } }
    ]},
    { ic: "🎪", t: "社团展演", d: "社团文化节要到了，各社团都在排练。", o: [
      { l: "报名参加展演", r: "你站上了舞台，收获了掌声。", fx: { social: 2, mood: 3 } },
      { l: "做幕后和后勤", r: "你保障了展演顺利进行。", fx: { social: 1 } }
    ]},
    { ic: "🪴", t: "教室里的花", d: "教室窗台的花开了，没人注意。", o: [
      { l: "指给大家看", r: "全班都被那朵小花治愈了。", fx: { social: 2, mood: 2 } },
      { l: "默默欣赏", r: "你把它当作今天的小确幸。", fx: { mood: 2 } }
    ]},
    { ic: "📮", t: "家长的叮嘱", d: "上学前妈妈反复叮嘱你注意身体。", o: [
      { l: "认真答应", r: "你记住了叮嘱，心里暖暖的。", fx: { mood: 2 } },
      { l: "有点不耐烦", r: "出门后你又有点后悔。", fx: { mood: -1 } }
    ]},
    { ic: "🏆", t: "单科状元", d: "这次某一科你考了全班第一。", o: [
      { l: "保持谦虚，继续努力", r: "你把喜悦化作动力。", fx: { knowledge: 2, mood: 3 } },
      { l: "请大家吃糖", r: "你分享了喜悦，人缘更好了。", fx: { social: 3, money: -8 } }
    ]},
    { ic: "📉", t: "成绩下滑", d: "这次考试你退步了一些。", o: [
      { l: "认真分析原因，制定计划", r: "你找到了薄弱点，重新出发。", fx: { knowledge: 3, mood: 1 } },
      { l: "沮丧一阵子", r: "你允许自己难过，但很快调整过来。", fx: { mood: -1 } }
    ]},
    { ic: "🧊", t: "体育课的自由活动", d: "体育课老师让大家自由活动。", o: [
      { l: "约一场足球", r: "你在场上飞奔，酣畅淋漓。", fx: { health: 3, social: 1 } },
      { l: "和同学散步聊天", r: "你在操场边聊了很多心事。", fx: { social: 2, mood: 1 } }
    ]},
    { ic: "🎨", t: "校服涂鸦", d: "有同学在校服上画了可爱的图案。", o: [
      { l: "请他帮你画一个", r: "你的校服上多了一个小图案。", fx: { mood: 2, social: 1 } },
      { l: "保持校服整洁", r: "你更愿意让它保持原样。", fx: { mood: 1 } }
    ]},
    { ic: "🌫️", t: "大雾的清晨", d: "早上起了大雾，能见度很低。", o: [
      { l: "提前出门，注意安全", r: "你顺利抵达学校。", fx: { health: 1 } },
      { l: "在教室里等雾散", r: "你看着窗外白茫茫一片，很安静。", fx: { mood: 1 } }
    ]},
    { ic: "📱", t: "班级群的消息", d: "班级群里在讨论今晚的作业。", o: [
      { l: "热心解答同学的疑问", r: "你帮好几个人理清了思路。", fx: { social: 2, knowledge: 1 } },
      { l: "潜水看消息", r: "你确认了作业内容。", fx: { knowledge: 1 } }
    ]},
    { ic: "🥤", t: "运动会的饮料", d: "运动会上你刚跑完一场，嗓子冒烟。", o: [
      { l: "喝淡盐水补充", r: "你科学补水，很快恢复。", fx: { health: 2 } },
      { l: "一口气灌下冰水", r: "你图了一时之快，肚子有点不舒服。", fx: { health: -1 } }
    ]},
    { ic: "📖", t: "同桌的笔记", d: "你请假一天，想补回落下的笔记。", o: [
      { l: "借同桌的笔记认真抄", r: "你把缺的内容都补回来了。", fx: { knowledge: 2, social: 1 } },
      { l: "找老师要课件", r: "你结合课件自学完成。", fx: { knowledge: 2 } }
    ]},
    { ic: "🎈", t: "节日的教室", d: "过节了，教室被布置得很有气氛。", o: [
      { l: "参与布置", r: "你吹气球、贴彩带，很开心。", fx: { mood: 3, social: 2 } },
      { l: "享受成果", r: "你走进教室时被惊喜到了。", fx: { mood: 2 } }
    ]},
    { ic: "🧳", t: "研学旅行", d: "班级要组织一次研学旅行。", o: [
      { l: "报名参加", r: "你和同学们一起出行，收获满满。", fx: { social: 3, mood: 3, knowledge: 1 } },
      { l: "留校自习", r: "你利用这段时间安静学习。", fx: { knowledge: 2 } }
    ]},
    { ic: "📸", t: "集体照", d: "班里要拍一张集体照。", o: [
      { l: "整理仪表，认真入镜", r: "照片里的你笑得很灿烂。", fx: { mood: 2, social: 1 } },
      { l: "做个鬼脸", r: "你给照片留下了欢乐的瞬间。", fx: { mood: 2, social: 1 } }
    ]},
    { ic: "🧋", t: "拼单的诱惑", d: "奶茶店满减，同学来问你拼不拼单。", o: [
      { l: "拼一杯", r: "你们边喝边聊，很快乐。", fx: { social: 2, mood: 2, money: -12 } },
      { l: "忍住不喝", r: "你省下了零花钱。", fx: { money: 2 } }
    ]},
    { ic: "🌧️", t: "体育课改自习", d: "下雨，体育课临时改成自习。", o: [
      { l: "利用时间写作业", r: "你提前完成了今天的作业。", fx: { knowledge: 2 } },
      { l: "和同学小声聊天", r: "你们放松了一节课。", fx: { social: 1, mood: 2 } }
    ]},
    { ic: "🧱", t: "课桌上的刻字", d: "你发现课桌上有往届学长留下的字。", o: [
      { l: "看后一笑，爱护课桌", r: "你决定不在桌上留下新的痕迹。", fx: { mood: 1 } },
      { l: "想象它的故事", r: "你脑补了一段有趣的历史。", fx: { mood: 1 } }
    ]},
    { ic: "📮", t: "给老师的贺卡", d: "教师节快到了，同学们在准备礼物。", o: [
      { l: "手写一张感谢卡", r: "老师收到后很感动。", fx: { social: 2, mood: 2 } },
      { l: "和大家一起合买", r: "你们凑钱送了一束花。", fx: { social: 1, money: -5 } }
    ]},
    { ic: "🏃", t: "晨跑的同伴", d: "有同学邀你一起晨跑。", o: [
      { l: "答应并坚持", r: "你养成了早起运动的习惯。", fx: { health: 3, social: 1 } },
      { l: "偶尔陪跑", r: "你体验了一次清晨的操场。", fx: { health: 1 } }
    ]},
    { ic: "🥣", t: "食堂的早餐", d: "今天有你爱吃的小笼包。", o: [
      { l: "排一份吃个够", r: "热腾腾的早餐让你充满能量。", fx: { health: 2, mood: 1 } },
      { l: "买一份边走边吃", r: "你赶时间但也吃上了。", fx: { health: 1 } }
    ]},
    { ic: "🎒", t: "沉重的书包", d: "今天的书特别多，书包很沉。", o: [
      { l: "用储物柜分担", r: "你把下午才用的书存了起来。", fx: { mood: 1 } },
      { l: "背着锻炼", r: "你苦笑当作负重训练。", fx: { health: 1 } }
    ]},
    { ic: "🧩", t: "课间的棋", d: "同桌拿出一副象棋邀你下。", o: [
      { l: "认真下一局", r: "你输了，但学到了几招。", fx: { knowledge: 1, social: 1 } },
      { l: "边下边聊", r: "你们享受了轻松的课间。", fx: { mood: 2 } }
    ]},
    { ic: "📔", t: "借来的书", d: "你从同学那里借了一本很想看的书。", o: [
      { l: "认真读完并写感想", r: "你按时归还，还附上了书签。", fx: { knowledge: 2, social: 1 } },
      { l: "读一半续借", r: "你舍不得还，又借了几天。", fx: { knowledge: 1 } }
    ]},
    { ic: "🌡️", t: "闷热的教室", d: "回南天，教室里又闷又潮。", o: [
      { l: "开窗通风", r: "空气流通后舒服多了。", fx: { health: 1 } },
      { l: "多喝水忍耐", r: "你撑过了闷热的一天。", fx: { mood: 1 } }
    ]},
    { ic: "🎵", t: "放学的歌", d: "放学时广播里放了一首很喜欢的歌。", o: [
      { l: "跟着哼走出校门", r: "你哼着歌，脚步都轻快了。", fx: { mood: 3 } },
      { l: "把它加进歌单", r: "你又收获了一首喜欢的歌。", fx: { mood: 1 } }
    ]},
    { ic: "🪑", t: "自习室的空位", d: "晚自习你想去安静的自习室。", o: [
      { l: "早点去占座", r: "你找到了靠窗的好位置。", fx: { knowledge: 2 } },
      { l: "在教室自习", r: "你也安安静静学了进去。", fx: { knowledge: 1 } }
    ]},
    { ic: "🍀", t: "四叶草", d: "你在花坛边意外发现一片四叶草。", o: [
      { l: "夹进书里当书签", r: "你相信今天会有好运。", fx: { mood: 3 } },
      { l: "送给身边的同学", r: "你把好运分享给了别人。", fx: { social: 2, mood: 1 } }
    ]},
    { ic: "📝", t: "随堂作文", d: "语文课临时写一篇随笔。", o: [
      { l: "写真实的校园生活", r: "老师把你的文章当范文读了。", fx: { knowledge: 3, mood: 2 } },
      { l: "写一篇想象故事", r: "你发挥创意，写得很投入。", fx: { knowledge: 2, mood: 1 } }
    ]},
    { ic: "🥤", t: "校园卡没钱", d: "打水时你发现校园卡没钱了。", o: [
      { l: "去充值点充钱", r: "你及时充了值，没耽误用。", fx: { mood: 1 } },
      { l: "向同学借水", r: "你借到了热水，记在心里。", fx: { social: 1 } }
    ]},
    { ic: "🌅", t: "傍晚的晚霞", d: "放学时天边的晚霞特别美。", o: [
      { l: "停下来拍一张", r: "你记录下了这个美丽的傍晚。", fx: { mood: 3 } },
      { l: "和身边的人一起看", r: "你们安静地看了很久。", fx: { social: 2, mood: 2 } }
    ]},
    { ic: "🧪", t: "实验失败", d: "你的小组实验没得到预期结果。", o: [
      { l: "和组员分析失败原因", r: "你们重新实验，最终成功了。", fx: { knowledge: 3, social: 1 } },
      { l: "照着别人的结果写", r: "你完成了报告，但理解不深。", fx: { knowledge: 1 } }
    ]},
    { ic: "📖", t: "晚自习的窗外", d: "晚自习你走神看向窗外。", o: [
      { l: "看一眼就收回心思", r: "你调整状态，继续刷题。", fx: { knowledge: 2 } },
      { l: "让大脑放空几分钟", r: "短暂休息后你更专注了。", fx: { mood: 1, knowledge: 1 } }
    ]},
    { ic: "🎒", t: "忘带的作业", d: "你把写完的作业落在了宿舍。", o: [
      { l: "向老师说明并补交", r: "老师让你中午补交，你记住了教训。", fx: { mood: -1 } },
      { l: "课间飞奔回去取", r: "你赶在课前取了回来。", fx: { health: 1, mood: 1 } }
    ]},
    { ic: "🏅", t: "运动会服务", d: "运动会缺志愿者。", o: [
      { l: "报名做志愿者", r: "你为运动员送水、记录成绩，很有意义。", fx: { social: 3, mood: 2 } },
      { l: "加入啦啦队", r: "你为班级呐喊助威。", fx: { social: 1, mood: 1 } }
    ]},
    { ic: "🌧️", t: "共伞的提议", d: "放学下雨，你带了伞，旁边的同学没带。", o: [
      { l: "主动邀他共撑一把", r: "你们一起走出校门，成了朋友。", fx: { social: 3 } },
      { l: "把伞借给他", r: "你冒雨跑回去，他很感动。", fx: { social: 2, health: -1 } }
    ]},
    { ic: "📐", t: "几何辅助线", d: "一道几何题卡了你很久。", o: [
      { l: "换一种思路画辅助线", r: "你灵光一闪，解出了它。", fx: { knowledge: 3, mood: 2 } },
      { l: "明天去问老师", r: "你标记下来，准备请教。", fx: { knowledge: 1 } }
    ]},
    { ic: "🥛", t: "室友的零食", d: "室友分享了一包家乡特产。", o: [
      { l: "开心品尝并回赠", r: "你们交换了各自的零食。", fx: { social: 2, mood: 2 } },
      { l: "尝一点表示感谢", r: "你礼貌地尝了尝。", fx: { social: 1, mood: 1 } }
    ]},
    { ic: "🎒", t: "新的笔记本", d: "你买了一本很喜欢的新本子。", o: [
      { l: "用它做错题本", r: "崭新的本子让你更有动力整理。", fx: { knowledge: 2, mood: 1 } },
      { l: "用它写日记", r: "你开始记录校园生活。", fx: { mood: 2 } }
    ]},
    { ic: "🌟", t: "流星夜", d: "听说今晚有流星雨，室友们约着看。", o: [
      { l: "裹着外套去操场等", r: "你看到了流星，许下了愿望。", fx: { mood: 4, social: 2 } },
      { l: "在阳台看一眼", r: "你也看到了一闪而过的光。", fx: { mood: 2 } }
    ]},
    { ic: "📚", t: "毕业前的整理", d: "整理抽屉时，你翻出了一整年的试卷。", o: [
      { l: "按科目装订成册", r: "你看着厚厚的试卷，感慨自己的努力。", fx: { knowledge: 1, mood: 2 } },
      { l: "挑有纪念意义的留下", r: "你保留了最珍贵的几份。", fx: { mood: 1 } }
    ]}
  ];

  function init() {
    var n = 0;
    var t = setInterval(function () {
      n++;
      if (window.X570 && X570.Events && X570.Events.EV) {
        MORE.forEach(function (e) {
          var dup = X570.Events.EV.some(function (x) { return x.t === e.t; });
          if (!dup) X570.Events.EV.push(e);
        });
        clearInterval(t);
      }
      if (n > 100) clearInterval(t);
    }, 200);
  }
  X570.register("eventsB", init, 5);
})();

/* ===== a140_quiz.js ===== */
/* =====================================================================
   题库挑战：6 大类、100+ 道校园常识题，带判定、计分、最高纪录
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc;

  var BANK = {
    "语文": [
      { q: "「落霞与孤鹜齐飞」的下一句是？", o: ["秋水共长天一色", "风正一帆悬", "长河落日圆", "明月松间照"], a: 0 },
      { q: "《红楼梦》的作者是？", o: ["曹雪芹", "罗贯中", "施耐庵", "吴承恩"], a: 0 },
      { q: "「但愿人长久」的下一句是？", o: ["千里共婵娟", "月是故乡明", "天涯共此时", "把酒问青天"], a: 0 },
      { q: "下列哪个是鲁迅的小说集？", o: ["《呐喊》", "《女神》", "《子夜》", "《雷雨》"], a: 0 },
      { q: "「会当凌绝顶」的下一句是？", o: ["一览众山小", "山高月小", "高处不胜寒", "江入大荒流"], a: 0 },
      { q: "「忽如一夜春风来」下一句是？", o: ["千树万树梨花开", "二月春风似剪刀", "春风又绿江南岸", "满园春色关不住"], a: 0 },
      { q: "「先天下之忧而忧」出自？", o: ["《岳阳楼记》", "《醉翁亭记》", "《桃花源记》", "《赤壁赋》"], a: 0 },
      { q: "「春蚕到死丝方尽」下一句是？", o: ["蜡炬成灰泪始干", "化作春泥更护花", "润物细无声", "报得三春晖"], a: 0 },
      { q: "成语「守株待兔」比喻？", o: ["心存侥幸，不主动努力", "勤劳致富", "坚持不懈", "机智勇敢"], a: 0 },
      { q: "「大江东去，浪淘尽」的作者是？", o: ["苏轼", "辛弃疾", "李清照", "柳永"], a: 0 },
      { q: "「长风破浪会有时」下一句是？", o: ["直挂云帆济沧海", "柳暗花明又一村", "轻舟已过万重山", "天生我材必有用"], a: 0 },
      { q: "《诗经》在内容上分为？", o: ["风雅颂", "赋比兴", "礼乐射", "诗词歌赋"], a: 0 },
      { q: "「三人行，必有我师焉」出自？", o: ["《论语》", "《孟子》", "《道德经》", "《庄子》"], a: 0 },
      { q: "「海内存知己」下一句是？", o: ["天涯若比邻", "千里共婵娟", "白首不分离", "同是天涯沦落人"], a: 0 },
      { q: "下列哪部是巴金的作品？", o: ["《家》", "《围城》", "《边城》", "《骆驼祥子》"], a: 0 },
      { q: "「沉舟侧畔千帆过」下一句是？", o: ["病树前头万木春", "柳暗花明又一村", "春风吹又生", "无可奈何花落去"], a: 0 },
      { q: "「大漠孤烟直」下一句是？", o: ["长河落日圆", "黄河入海流", "千山鸟飞绝", "孤城遥望玉门关"], a: 0 },
      { q: "「人生自古谁无死」下一句是？", o: ["留取丹心照汗青", "要留清白在人间", "不教胡马度阴山", "铁马冰河入梦来"], a: 0 }
    ],
    "数学": [
      { q: "一个直角三角形两直角边为 3、4，斜边长？", o: ["5", "6", "7", "√7"], a: 0 },
      { q: "sin 30° 的值是？", o: ["1/2", "√2/2", "√3/2", "1"], a: 0 },
      { q: "圆的周长公式是？", o: ["2πr", "πr²", "πd²", "4πr"], a: 0 },
      { q: "方程 x²-5x+6=0 的两根是？", o: ["2 和 3", "1 和 6", "-2 和 -3", "5 和 6"], a: 0 },
      { q: "lg 100 的值是？", o: ["2", "10", "100", "1"], a: 0 },
      { q: "7 的阶乘 7! 等于？", o: ["5040", "720", "40320", "2520"], a: 0 },
      { q: "一个数的 20% 是 30，这个数是？", o: ["150", "60", "120", "100"], a: 0 },
      { q: "正方体有几条棱？", o: ["12", "8", "6", "16"], a: 0 },
      { q: "等差数列 1,4,7,10… 的第 10 项是？", o: ["28", "30", "31", "27"], a: 0 },
      { q: "cos 60° 的值是？", o: ["1/2", "√2/2", "√3/2", "0"], a: 0 },
      { q: "下列哪个是质数？", o: ["29", "27", "33", "35"], a: 0 },
      { q: "半径为 3 的圆面积是？", o: ["9π", "6π", "3π", "12π"], a: 0 },
      { q: "掷一枚骰子，出现 6 的概率是？", o: ["1/6", "1/3", "1/2", "1/4"], a: 0 },
      { q: "log₂ 8 等于？", o: ["3", "2", "4", "8"], a: 0 },
      { q: "|-7| 等于？", o: ["7", "-7", "0", "14"], a: 0 },
      { q: "函数 y=2x+1 在 x=3 时的值是？", o: ["7", "6", "5", "8"], a: 0 },
      { q: "一个三角形内角和是？", o: ["180°", "360°", "90°", "270°"], a: 0 },
      { q: "√144 等于？", o: ["12", "14", "16", "24"], a: 0 }
    ],
    "英语": [
      { q: "“It’s raining cats and dogs.” 的意思是？", o: ["下倾盆大雨", "猫狗在下雨", "下小雨", "天气很好"], a: 0 },
      { q: "He ___ to school every day.（go）", o: ["goes", "go", "going", "gone"], a: 0 },
      { q: "“library” 的意思是？", o: ["图书馆", "实验室", "操场", "食堂"], a: 0 },
      { q: "“break a leg” 在口语中常表示？", o: ["祝你好运", "摔断腿", "小心点", "再见"], a: 0 },
      { q: "下列哪个是不可数名词？", o: ["water", "apple", "book", "pen"], a: 0 },
      { q: "There ___ many students in the classroom.", o: ["are", "is", "am", "be"], a: 0 },
      { q: "“good” 的比较级是？", o: ["better", "gooder", "more good", "best"], a: 0 },
      { q: "“I’m looking forward to ___ you.”", o: ["seeing", "see", "saw", "seen"], a: 0 },
      { q: "“environment” 的中文意思是？", o: ["环境", "设备", "交通", "娱乐"], a: 0 },
      { q: "“once in a blue moon” 意为？", o: ["千载难逢", "蓝月亮", "每月一次", "经常"], a: 0 },
      { q: "She is the girl ___ won the prize.", o: ["who", "which", "whom", "whose"], a: 0 },
      { q: "“necessary” 的意思是？", o: ["必要的", "紧张的", "自然的", "充足的"], a: 0 },
      { q: "I have ___ finished my homework.", o: ["already", "yet", "ever", "ago"], a: 0 },
      { q: "“homework” 是？", o: ["不可数名词", "可数名词", "动词", "形容词"], a: 0 },
      { q: "“How do you do?” 的合适回应是？", o: ["How do you do?", "Fine, thank you.", "Goodbye.", "I'm 16."], a: 0 },
      { q: "“a piece of cake” 在口语中意为？", o: ["小菜一碟", "一块蛋糕", "很难", "一块披萨"], a: 0 },
      { q: "“knowledge” 的意思是？", o: ["知识", "实验", "体育", "艺术"], a: 0 },
      { q: "They ___ football now.", o: ["are playing", "play", "plays", "played"], a: 0 }
    ],
    "理科": [
      { q: "光在真空中的速度约为？", o: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10⁵ m/s", "3×10¹⁰ m/s"], a: 0 },
      { q: "水的化学式是？", o: ["H₂O", "CO₂", "O₂", "H₂"], a: 0 },
      { q: "牛顿第二定律的表达式是？", o: ["F=ma", "E=mc²", "F=mg", "P=UI"], a: 0 },
      { q: "DNA 的中文全称是？", o: ["脱氧核糖核酸", "核糖核酸", "氨基酸", "葡萄糖"], a: 0 },
      { q: "标准大气压下，水的沸点是？", o: ["100℃", "90℃", "120℃", "0℃"], a: 0 },
      { q: "金属活动性最强的是？", o: ["钾", "铁", "铜", "金"], a: 0 },
      { q: "人体最主要的供能物质是？", o: ["糖类", "脂肪", "维生素", "水"], a: 0 },
      { q: "电流的单位是？", o: ["安培", "伏特", "欧姆", "瓦特"], a: 0 },
      { q: "植物进行光合作用的场所是？", o: ["叶绿体", "线粒体", "细胞核", "液泡"], a: 0 },
      { q: "元素周期表中，氧的元素符号是？", o: ["O", "Ox", "Om", "Oy"], a: 0 },
      { q: "下列属于可再生能源的是？", o: ["太阳能", "煤", "石油", "天然气"], a: 0 },
      { q: "自由落体加速度 g 约为？", o: ["9.8 m/s²", "10 m/s", "9.8 m/s", "1.6 m/s²"], a: 0 },
      { q: "化学中，pH<7 的溶液呈？", o: ["酸性", "碱性", "中性", "无法判断"], a: 0 },
      { q: "人眼能看到物体是因为光的？", o: ["反射", "折射", "衍射", "色散"], a: 0 },
      { q: "细胞中控制生命活动的“控制中心”是？", o: ["细胞核", "细胞膜", "细胞壁", "叶绿体"], a: 0 },
      { q: "声音在下列哪种介质中传播最快？", o: ["钢铁", "空气", "水", "真空"], a: 0 },
      { q: "下列哪种气体是植物光合作用的原料？", o: ["二氧化碳", "氧气", "氮气", "氢气"], a: 0 },
      { q: "力的国际单位是？", o: ["牛顿", "焦耳", "帕斯卡", "瓦特"], a: 0 }
    ],
    "文综地理": [
      { q: "我国最长的河流是？", o: ["长江", "黄河", "珠江", "黑龙江"], a: 0 },
      { q: "世界上面积最大的洋是？", o: ["太平洋", "大西洋", "印度洋", "北冰洋"], a: 0 },
      { q: "杭州所在的省级行政区简称是？", o: ["浙", "苏", "皖", "沪"], a: 0 },
      { q: "地球自转一周的时间约为？", o: ["24 小时", "12 小时", "365 天", "30 天"], a: 0 },
      { q: "我国地势的特点是？", o: ["西高东低", "东高西低", "中间高四周低", "北高南低"], a: 0 },
      { q: "秦岭—淮河一线大致是？", o: ["南北方分界线", "东西部界线", "内外流区界线", "地势阶梯界线"], a: 0 },
      { q: "世界最高峰是？", o: ["珠穆朗玛峰", "乔戈里峰", "富士山", "乞力马扎罗山"], a: 0 },
      { q: "我国面积最大的省级行政区是？", o: ["新疆", "西藏", "内蒙古", "青海"], a: 0 },
      { q: "一年有 24 个节气，第一个是？", o: ["立春", "春分", "冬至", "惊蛰"], a: 0 },
      { q: "下列属于可再生资源的是？", o: ["森林", "铁矿", "石油", "煤炭"], a: 0 },
      { q: "我国最大的淡水湖是？", o: ["鄱阳湖", "洞庭湖", "太湖", "青海湖"], a: 0 },
      { q: "“上有天堂，下有苏杭”中的苏杭位于？", o: ["长江三角洲", "珠江三角洲", "华北平原", "四川盆地"], a: 0 },
      { q: "季风形成的主要原因是？", o: ["海陆热力差异", "地球自转", "洋流", "地形"], a: 0 },
      { q: "经度每隔 15°，地方时相差？", o: ["1 小时", "15 分钟", "半小时", "2 小时"], a: 0 },
      { q: "下列城市中位于我国最北的是？", o: ["哈尔滨", "北京", "乌鲁木齐", "长春"], a: 0 },
      { q: "黄河最终注入？", o: ["渤海", "黄海", "东海", "南海"], a: 0 },
      { q: "热带雨林气候的特点是？", o: ["全年高温多雨", "四季分明", "终年寒冷", "干旱少雨"], a: 0 },
      { q: "我国人口分布的重要分界线是？", o: ["黑河—腾冲线", "秦岭—淮河线", "大兴安岭线", "长城线"], a: 0 }
    ],
    "生活常识": [
      { q: "遇到火灾应拨打的电话是？", o: ["119", "110", "120", "122"], a: 0 },
      { q: "急救电话是？", o: ["120", "119", "114", "12315"], a: 0 },
      { q: "绿灯亮时，行人应该？", o: ["在确保安全时通过", "随意奔跑", "原地等待", "倒退行走"], a: 0 },
      { q: "运动后正确的补水方式是？", o: ["少量多次喝温水", "一次喝大量冰水", "不喝水", "只喝甜饮料"], a: 0 },
      { q: "被热水轻微烫伤后应先？", o: ["用流动冷水冲", "涂牙膏", "挑破水泡", "用毛巾热敷"], a: 0 },
      { q: "下列哪种情况需要洗手？", o: ["饭前便后", "睡觉时", "看电视时", "听音乐时"], a: 0 },
      { q: "雷雨天下列做法正确的是？", o: ["不在大树下避雨", "在空旷处打伞", "靠近金属栏杆", "用金属杆收衣服"], a: 0 },
      { q: "每天较健康的睡眠时间约为？", o: ["8 小时左右", "3 小时", "12 小时", "不固定即可"], a: 0 },
      { q: "发生地震时在室内应？", o: ["躲在坚固桌下护住头部", "立刻乘电梯", "跳楼逃生", "站在窗边"], a: 0 },
      { q: "食品包装上的生产日期应？", o: ["查看确认在保质期内", "不用看", "越久越好", "撕掉再吃"], a: 0 },
      { q: "陌生人给的饮料应该？", o: ["礼貌拒绝", "直接喝", "收下再喝", "转送给别人"], a: 0 },
      { q: "自行车在路口遇到红灯应？", o: ["停下等待", "快速通过", "绕行闯灯", "下车推行闯红灯"], a: 0 },
      { q: "流鼻血时正确做法是？", o: ["低头捏住鼻翼冷敷", "仰头", "用力擤鼻", "平躺"], a: 0 },
      { q: "长时间看屏幕后应？", o: ["适当远眺放松眼睛", "继续盯着", "关灯看手机", "用手揉眼睛"], a: 0 },
      { q: "发现有人溺水，正确做法是？", o: ["呼救并找漂浮物，不盲目下水", "立刻跳下去救", "围观", "离开"], a: 0 }
    ]
  };

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function open() {
    var el = H.openFull("x570Sub", "📚 题库挑战");
    var body = el.querySelector(".x570-full-body");
    var cats = Object.keys(BANK);
    function home() {
      body.innerHTML =
        '<div class="x570-card"><div class="t">选择题目类别</div><div class="d">每题 10 分，共 10 题，看看你能拿多少分。</div></div>' +
        '<div class="x570-campus-grid">' + cats.map(function (c) {
          var n = BANK[c].length;
          return '<div class="x570-campus-item" data-cat="' + c + '"><div class="ic">📖</div><div class="n">' + esc(c) + '</div><div class="d">' + n + ' 题</div></div>';
        }).join("") + "</div>";
      on(body, "click", function (e) {
        var it = e.target.closest("[data-cat]");
        if (it) play(it.getAttribute("data-cat"));
      });
    }
    function play(cat) {
      var qs = shuffle(BANK[cat]).slice(0, Math.min(10, BANK[cat].length));
      var i = 0, score = 0, lock = false;
      function render() {
        if (i >= qs.length) {
          body.innerHTML =
            '<div class="x570-card x570-center"><div style="font-size:50px">🎉</div>' +
            '<div class="t">' + cat + " 挑战完成</div>" +
            '<div style="font-size:30px;font-weight:900;margin:10px 0">' + score + " / " + (qs.length * 10) + "</div>" +
            '<div class="d">' + (score >= 80 ? "学霸就是你！" : score >= 60 ? "不错，继续加油！" : "多复习，下次更好。") + "</div>" +
            '<button class="x570-btn" id="qAgain" style="margin-top:12px">再来一组</button> ' +
            '<button class="x570-btn" id="qHome">换类别</button></div>';
          on($("#qAgain"), "click", function () { play(cat); });
          on($("#qHome"), "click", home);
          return;
        }
        var q = qs[i];
        var letters = ["A", "B", "C", "D"];
        body.innerHTML =
          '<div class="x570-card"><div class="d">' + cat + " · 第 " + (i + 1) + "/" + qs.length + " 题 · 得分 " + score + "</div>" +
          '<div class="t" style="margin-top:8px">' + esc(q.q) + "</div></div>" +
          '<div class="x570-list">' + q.o.map(function (op, j) {
            return '<button class="x570-btn qopt" data-j="' + j + '" style="text-align:left;margin-bottom:8px"><b>' + letters[j] + ".</b> " + esc(op) + "</button>";
          }).join("") + "</div>";
        lock = false;
        on(body, "click", function (e) {
          var b = e.target.closest(".qopt");
          if (!b || lock) return;
          lock = true;
          var j = +b.getAttribute("data-j");
          var opts = body.querySelectorAll(".qopt");
          opts[q.a].style.background = "rgba(34,208,107,.25)";
          if (j === q.a) { score += 10; }
          else { opts[j].style.background = "rgba(255,94,98,.25)"; }
          opts.forEach(function (x) { x.disabled = true; });
          setTimeout(function () { i++; render(); }, 650);
        });
      }
      render();
    }
    home();
  }

  X570.CampusSub.quiz = open;
  X570.Quiz = { open: open, BANK: BANK };
})();

/* ===== a150_persona.js ===== */
/* =====================================================================
   性格解读：MBTI 16 型详细解读 + 12 星座 + 血型 + 爱好/家庭影响
   读取角色创建结果，也可手动切换查看
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc;

  var MBTI = {
    INTJ: { n: "建筑师", ic: "♟️", tag: "富有想象力的战略思想家",
      traits: ["独立", "理性", "目标坚定", "善于规划"],
      desc: "你习惯用长远的眼光看问题，心里总有一张关于未来的地图。比起热闹，你更需要独处的时间来整理思路。你对自己认定的事情极其专注，会为了目标默默努力很久。",
      school: "学习上你擅长制定计划、搭建知识体系，适合给自己设定阶段性目标。注意不要对自己太苛刻，适当放松能让效率更高。",
      love: "你不轻易表达感情，但一旦认定就非常专一。学会把心里的想法说出来，会让对方更安心。",
      fit: "适合需要深度思考与规划的方向：研究、工程、设计、战略。" },
    INTP: { n: "逻辑学家", ic: "🔬", tag: "热爱思考的发明家",
      traits: ["好奇", "逻辑强", "爱钻研", "随性"],
      desc: "你对世界充满好奇，喜欢追问“为什么”，常常在脑中构建各种模型。你对感兴趣的领域能投入惊人的热情，对无聊的细节却容易走神。",
      school: "你适合理解型而非死记型的学习，把原理搞懂后能举一反三。需要给自己设定截止时间，避免在一个问题上钻太深。",
      "love": "你在感情里慢热又有点笨拙，会用行动而不是甜言蜜语表达在意。",
      fit: "适合科研、编程、数学、理论研究等需要抽象思维的领域。" },
    ENTJ: { n: "指挥官", ic: "♛", tag: "天生的领导者",
      traits: ["果断", "高效", "有领导力", "自信"],
      desc: "你目标明确、行动迅速，擅长组织资源和带领团队。你不喜欢拖泥带水，也常常成为推动事情前进的那个人。",
      school: "你适合做学习小组的组织者，把大目标拆成可执行的步骤。注意倾听不同意见，避免显得过于强势。",
      "love": "你会为喜欢的人安排好一切，但也要记得给对方留空间，让关系更平等。",
      fit: "适合管理、组织、竞争激烈的领域，是天生的项目负责人。" },
    ENTP: { n: "辩论家", ic: "💡", tag: "聪明好奇的思想家",
      traits: ["机敏", "爱辩论", "点子多", "不甘平庸"],
      desc: "你思维敏捷、能言善辩，喜欢挑战既定答案，脑子里总有新点子。你享受思想碰撞的乐趣，对一成不变的事物容易厌倦。",
      school: "你理解能力强、反应快，但需要克服“三分钟热度”，把一个好点子坚持到底。",
      "love": "你喜欢能和你斗嘴、互相激发的人，关系里需要新鲜感和共同话题。",
      fit: "适合创新、创业、产品、辩论、跨学科的领域。" },
    INFJ: { n: "提倡者", ic: "🌙", tag: "安静而坚定的理想主义者",
      traits: ["敏感", "有同理心", "有原则", "有远见"],
      desc: "你表面安静，内心却有丰富的世界和坚定的理想。你能敏锐地察觉到别人的情绪，也常常为了更好的东西而默默努力。",
      school: "你学习有内在驱动力，适合在安静的环境中深入。注意别把压力都压在自己心里，学会倾诉。",
      "love": "你渴望深刻而真诚的关系，一旦投入就非常认真，也希望被理解。",
      fit: "适合写作、咨询、教育、心理、人文等有温度的领域。" },
    INFP: { n: "调停者", ic: "🌸", tag: "诗意善良的理想主义者",
      traits: ["温柔", "浪漫", "有创造力", "忠于内心"],
      desc: "你重视内心的感受和价值观，拥有丰富的想象力。你希望世界能更美好，也常常在文字、艺术里找到安放自己的地方。",
      school: "你对喜欢的学科会充满热情，对不喜欢的容易抗拒。找到意义感，你的潜能会被极大激发。",
      "love": "你在感情里浪漫而细腻，需要被温柔对待，也愿意为对方付出真心。",
      fit: "适合文学、艺术、设计、公益、人文创作等领域。" },
    ENFJ: { n: "主人公", ic: "🌟", tag: "富有感染力的领导者",
      traits: ["热情", "有感染力", "体贴", "可靠"],
      desc: "你善于理解和鼓励他人，常常成为群体中凝聚人心的存在。你真心希望身边的人都能变好，也愿意为集体付出。",
      school: "你在合作学习中表现出色，能带动同学的积极性。记得也照顾好自己的需求，不要总是付出。",
      "love": "你会很用心地经营感情，记得留出两人共同成长的空间。",
      fit: "适合教育、组织、传媒、公共关系等需要与人连接的领域。" },
    ENFP: { n: "竞选者", ic: "🎈", tag: "热情洋溢的自由灵魂",
      traits: ["热情", "乐观", "社交力强", "创意多"],
      desc: "你像一束阳光，热情、真诚、充满好奇，总能给周围带来快乐。你喜欢新鲜事物，也善于发现生活里的小确幸。",
      school: "你需要兴趣和正反馈来维持学习热情，多样化的学习方式对你最有效。注意建立计划，避免分心。",
      "love": "你爱得热烈又真诚，希望和对方一起尝试新事物、分享生活。",
      fit: "适合传媒、创意、市场、表演、教育等充满活力的领域。" },
    ISTJ: { n: "物流师", ic: "📋", tag: "务实可靠的实干家",
      traits: ["踏实", "有条理", "责任感强", "严谨"],
      desc: "你重视规则、秩序和承诺，做事脚踏实地、有始有终。你是别人眼中“交给你就放心”的人。",
      school: "你学习踏实、基础扎实，按部就班的方法很适合你。可以适当增加灵活思考，举一反三。",
      "love": "你用稳定的行动表达爱，是可靠的伴侣，偶尔也要表达情感。",
      fit: "适合需要严谨、细致、稳定的领域，如会计、工程、法律、医疗。" },
    ISFJ: { n: "守卫者", ic: "🛡️", tag: "温暖细致的守护者",
      traits: ["细心", "有耐心", "乐于助人", "体贴"],
      desc: "你温和、周到，总是默默地照顾身边的人，记得住许多别人忽略的细节。你重视和谐，也很珍惜身边的关系。",
      school: "你学习认真、笔记工整，适合循序渐进。要学会拒绝，别让别人的事占用你太多精力。",
      "love": "你在感情里付出很多，会用小事温暖对方，也需要被同样珍惜。",
      fit: "适合护理、教育、服务、行政等需要耐心与细心的领域。" },
    ESTJ: { n: "总经理", ic: "🏛️", tag: "高效务实的组织者",
      traits: ["务实", "执行力强", "讲原则", "可靠"],
      desc: "你喜欢秩序和效率，做事干脆利落，能把混乱的事情理得井井有条。你看重责任，也愿意承担。",
      school: "你擅长执行明确的学习任务，适合用清单和时间表管理。注意保持开放，接纳不同方法。",
      "love": "你会为关系负责到底，是稳定可靠的伴侣。",
      fit: "适合管理、行政、金融、军警、工程等需要执行力的领域。" },
    ESFJ: { n: "执政官", ic: "🤝", tag: "热心合群的照顾者",
      traits: ["热情", "合群", "体贴", "有责任感"],
      desc: "你重视人际关系，擅长营造融洽的氛围，是班级里人缘很好的人。你愿意为朋友和集体付出，也渴望被需要。",
      school: "你在小组学习中很有优势，能带动大家。注意不要过度在意外界评价，按自己的节奏来。",
      "love": "你在感情里很投入，会用心经营每一个纪念日和日常。",
      fit: "适合服务、教育、护理、人力、公共关系等领域。" },
    ISTP: { n: "鉴赏家", ic: "🔧", tag: "冷静灵活的实践家",
      traits: ["冷静", "动手能力强", "独立", "随机应变"],
      desc: "你话不多但观察力强，喜欢动手弄清楚事物的原理。你临危不乱，擅长在实际问题中快速找到办法。",
      school: "你擅长实验、操作和解决具体问题，死记硬背会让你犯困。多做实验、多动手能学得更好。",
      "love": "你需要自己的空间，感情里表达克制，但会在关键时刻很可靠。",
      fit: "适合工程、技术、机械、运动、应急处理等实践领域。" },
    ISFP: { n: "探险家", ic: "🎨", tag: "温柔的艺术实践者",
      traits: ["安静", "审美强", "随遇而安", "真诚"],
      desc: "你用感官和心去体会世界，喜欢美、自然和艺术。你不喜欢冲突，按自己的节奏生活，真诚而低调。",
      school: "你在有美感、能动手的学科上更有兴趣，把知识和生活结合会学得更好。",
      "love": "你在感情里温柔含蓄，会用细节表达喜欢，也需要安全感。",
      fit: "适合设计、艺术、音乐、手工、摄影、烹饪等审美领域。" },
    ESTP: { n: "企业家", ic: "🎯", tag: "行动力强的冒险家",
      traits: ["大胆", "反应快", "实际", "爱冒险"],
      desc: "你喜欢行动和刺激，反应快、敢尝试，是典型的行动派。你享受当下，擅长在真实情境中解决问题。",
      school: "你需要短平快、有反馈的学习方式，边做边学最适合你。注意打好基础，避免急躁。",
      "love": "你在感情里直接、有趣，喜欢和对方一起体验新鲜事。",
      fit: "适合销售、运动、商业、急救、户外、创业等行动领域。" },
    ESFP: { n: "表演者", ic: "🎉", tag: "热情活泼的开心果",
      traits: ["开朗", "有感染力", "享受当下", "感性"],
      desc: "你热情、外向、爱玩，是聚会和活动里的气氛担当。你重视真实的感受和眼前的快乐，也乐于给身边人带来欢笑。",
      school: "你在互动和游戏化的学习中表现最好，把枯燥的内容变有趣能激发你的动力。",
      "love": "你爱得明朗热烈，愿意和对方分享快乐、一起体验生活。",
      fit: "适合表演、艺术、旅游、服务、幼教、活动策划等领域。" }
  };

  var ZODIAC = {
    白羊座: { ic: "♈", t: "热情勇敢、行动力强", d: "你像春天一样充满冲劲，认准的事会立刻去做。学习上要注意收尾，避免虎头蛇尾。", lucky: "红色、运动类" },
    金牛座: { ic: "♉", t: "踏实稳重、有耐心", d: "你做事情持之以恒，认定的目标会慢慢坚持。偶尔可以更灵活一些，不必太固执。", lucky: "绿色、音乐" },
    双子座: { ic: "♊", t: "聪明灵活、好奇心强", d: "你反应快、兴趣广，学新东西很快。要注意专注，把好奇心转化为持续的积累。", lucky: "黄色、阅读" },
    巨蟹座: { ic: "♋", t: "温柔细腻、重感情", d: "你很重视家人和朋友，共情力强。情绪容易受环境影响，要学会照顾自己的感受。", lucky: "白色、家庭" },
    狮子座: { ic: "♌", t: "自信阳光、有领导力", d: "你天生有号召力，喜欢被认可。保持这份自信的同时，也学会倾听和谦逊。", lucky: "金色、舞台" },
    处女座: { ic: "♍", t: "认真细致、追求完美", d: "你注重细节、条理清晰，能把事情做得很扎实。别对自己太苛刻，允许自己犯错。", lucky: "米色、整理" },
    天秤座: { ic: "♎", t: "温和优雅、追求平衡", d: "你善于协调关系、有审美。选择时容易犹豫，不妨相信自己的第一判断。", lucky: "粉色、艺术" },
    天蝎座: { ic: "♏", t: "深沉专注、洞察力强", d: "你一旦投入就非常执着，看问题深刻。学会表达情绪，让别人更懂你。", lucky: "深红、专注" },
    射手座: { ic: "♐", t: "乐观自由、爱探索", d: "你向往自由和远方，乐观开朗。学习上给自己定个明确目标，会更有方向。", lucky: "紫色、旅行" },
    摩羯座: { ic: "♑", t: "踏实自律、目标坚定", d: "你有很强的责任感和毅力，愿意为长期目标努力。记得劳逸结合，享受过程。", lucky: "棕色、规划" },
    水瓶座: { ic: "♒", t: "独立独特、思想前卫", d: "你想法独特、追求独立，常有新奇的观点。保持特别的同时，也多和身边人沟通。", lucky: "蓝色、科技" },
    双鱼座: { ic: "♓", t: "浪漫善良、想象力丰富", d: "你感性、有艺术天分，富有同情心。把想象力用在创作上，也记得脚踏实地。", lucky: "海蓝、艺术" }
  };

  var BLOOD = {
    A: { t: "认真细致、有责任感", d: "你做事踏实、注重秩序，团队里是可靠的存在。学习上适合稳扎稳打，注意别给自己太大压力。" },
    B: { t: "自由率真、好奇心强", d: "你性格直率、兴趣广泛，不喜欢被束缚。找到真正热爱的方向，你的潜力会被充分激发。" },
    O: { t: "开朗大方、有领导力", d: "你热情、豁达，擅长组织和带动气氛。保持行动力的同时，注意倾听他人的感受。" },
    AB: { t: "冷静理性、兼具感性", d: "你身上有理性和感性的两面，思维独特、善于分析。多给自己一些表达和展示的机会。" }
  };

  function currentSel() {
    try {
      if (window.X56Char && X56Char.sel) return X56Char.sel;
    } catch (e) {}
    return { mbti: "ENFP", zodiac: "狮子座", blood: "A" };
  }

  function open() {
    var sel = currentSel();
    var el = H.openFull("x570Sub", "🧬 性格解读");
    var body = el.querySelector(".x570-full-body");
    function mbti() {
      var keys = Object.keys(MBTI);
      var html = '<div class="x570-card"><div class="t">你的类型：' + (sel.mbti || "未选择") +
        (MBTI[sel.mbti] ? " " + MBTI[sel.mbti].ic + " " + MBTI[sel.mbti].n : "") + "</div>" +
        '<div class="d">可点下方查看任意类型</div></div>';
      if (MBTI[sel.mbti]) {
        var m = MBTI[sel.mbti];
        html += '<div class="x570-card"><div class="t">' + m.ic + " " + sel.mbti + " · " + m.n + "</div>" +
          '<div class="d" style="margin:6px 0">' + esc(m.tag) + "</div>" +
          "<div>🏷️ 关键词：" + m.traits.map(function (t) { return '<span class="x570-chip">' + t + "</span>"; }).join("") + "</div>" +
          '<div class="d" style="margin-top:10px"><b>性格画像：</b>' + esc(m.desc) + "</div>" +
          '<div class="d" style="margin-top:8px"><b>校园学习：</b>' + esc(m.school) + "</div>" +
          '<div class="d" style="margin-top:8px"><b>感情相处：</b>' + esc(m.love) + "</div>" +
          '<div class="d" style="margin-top:8px"><b>适合方向：</b>' + esc(m.fit) + "</div></div>";
      }
      html += '<div class="x570-card"><div class="t">16 型速览</div><div class="x570-mbti-grid">' +
        keys.map(function (k) { return '<button class="x570-mbti" data-m="' + k + '" title="' + MBTI[k].n + '">' + MBTI[k].ic + "<br>" + k + "</button>"; }).join("") +
        "</div></div>";
      body.innerHTML = html;
      on(body, "click", function (e) {
        var b = e.target.closest("[data-m]");
        if (!b) return;
        var k = b.getAttribute("data-m");
        var m = MBTI[k];
        body.insertAdjacentHTML("afterbegin",
          '<div class="x570-card" style="border:2px solid rgba(255,209,102,.5)"><div class="t">' + m.ic + " " + k + " · " + m.n + "</div>" +
          '<div class="d">' + esc(m.desc) + "</div>" +
          '<div class="d" style="margin-top:6px">' + esc(m.school) + "</div>" +
          '<div class="d" style="margin-top:6px">' + esc(m.love) + "</div>" +
          '<div class="d" style="margin-top:6px">' + esc(m.fit) + "</div></div>");
      });
    }
    function zodiac() {
      var keys = Object.keys(ZODIAC);
      var z = ZODIAC[sel.zodiac];
      var html = '<div class="x570-card"><div class="t">你的星座：' + (sel.zodiac || "未选择") + "</div>" +
        (z ? '<div class="d">' + z.ic + " " + esc(z.t) + "</div>" +
        '<div class="d" style="margin-top:8px">' + esc(z.d) + "</div>" +
        '<div class="d" style="margin-top:6px">✨ 幸运元素：' + esc(z.lucky) + "</div>" : "") +
        '<div class="d" style="margin-top:8px;color:rgba(255,255,255,.5)">星座内容仅供娱乐参考，真正决定你的，是你的努力与选择。</div></div>';
      html += '<div class="x570-card"><div class="t">十二星座</div><div class="x570-mbti-grid">' +
        keys.map(function (k) { return '<button class="x570-mbti" data-z="' + k + '" title="' + ZODIAC[k].t + '">' + ZODIAC[k].ic + "<br>" + k + "</button>"; }).join("") +
        "</div></div>";
      body.innerHTML = html;
      on(body, "click", function (e) {
        var b = e.target.closest("[data-z]");
        if (!b) return;
        var zz = ZODIAC[b.getAttribute("data-z")];
        body.insertAdjacentHTML("afterbegin",
          '<div class="x570-card" style="border:2px solid rgba(255,126,179,.5)"><div class="t">' + zz.ic + " " + esc(b.getAttribute("data-z")) + "</div>" +
          '<div class="d">' + esc(zz.t) + "</div><div class='d' style='margin-top:6px'>" + esc(zz.d) + "</div></div>");
      });
    }
    function blood() {
      var keys = ["A", "B", "O", "AB"];
      var cur = BLOOD[sel.blood];
      var html = '<div class="x570-card"><div class="t">你的血型：' + (sel.blood || "未选择") + "型</div>" +
        (cur ? '<div class="d">' + esc(cur.t) + "</div><div class='d' style='margin-top:8px'>" + esc(cur.d) + "</div>" : "") +
        '<div class="d" style="margin-top:8px;color:rgba(255,255,255,.5)">血型与性格没有科学因果，仅供娱乐。</div></div>';
      html += '<div class="x570-card">' + keys.map(function (k) {
        var b = BLOOD[k];
        return '<div style="margin:10px 0"><b>' + k + "型：" + esc(b.t) + "</b><div class='d'>" + esc(b.d) + "</div></div>";
      }).join("") + "</div>";
      body.innerHTML = html;
    }
    var tabs = [["mbti", "MBTI"], ["zodiac", "星座"], ["blood", "血型"]];
    function wrap(render) {
      var bar = '<div class="x570-ach-tabs">' + tabs.map(function (tb) {
        return '<button class="x570-ach-tab" data-t="' + tb[0] + '">' + tb[1] + "</button>";
      }).join("") + "</div>";
      render();
      body.insertAdjacentHTML("afterbegin", bar);
      on(body, "click", function (e) {
        var b = e.target.closest("[data-t]");
        if (!b) return;
        var t = b.getAttribute("data-t");
        if (t === "mbti") mbti();
        if (t === "zodiac") zodiac();
        if (t === "blood") blood();
        body.insertAdjacentHTML("afterbegin", bar);
        body.querySelectorAll("[data-t]").forEach(function (x) { x.classList.toggle("on", x.getAttribute("data-t") === t); });
      });
    }
    wrap(mbti);
    body.querySelectorAll("[data-t]").forEach(function (x) { x.classList.toggle("on", x.getAttribute("data-t") === "mbti"); });
  }

  X570.CampusSub.persona = open;
  X570.Persona = { open: open, MBTI: MBTI, ZODIAC: ZODIAC, BLOOD: BLOOD };
})();

/* ===== a160_feed.js ===== */
/* =====================================================================
   校园动态墙：大量 NPC 朋友圈式动态，可点赞/评论/转发到朋友圈
   内容贴近真实校园，独立可用
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;

  var POSTS = [
    { who: "林晚", ic: "🌸", t: "桂花又开了，今年的秋天好像比去年来得更早一点。书里夹了一朵，想留到冬天。", img: ["🌕", "🌳", "🌸"], c: 28 },
    { who: "赵小雨", ic: "🎨", t: "画板上的晚霞怎么都调不出眼睛看到的那种颜色。算了，有些东西只能留在眼睛里。", img: ["🌇", "🖌️"], c: 41 },
    { who: "苏清颜", ic: "🎹", t: "今天的琴房只剩我一个人，弹了一整首喜欢的曲子，没有观众，但很完整。", img: ["🎹"], c: 35 },
    { who: "许念", ic: "🏀", t: "加练到球场熄灯，罚球终于连进十个。明天继续。", img: ["🏀", "💪"], c: 52 },
    { who: "班长", ic: "📋", t: "提醒一下：明天早自习前交物理作业，下午大扫除，校服别忘了穿。", img: [], c: 19 },
    { who: "学习委员", ic: "📚", t: "整理了这次月考的错题集，需要的同学放学来找我复印，免费。", img: ["📝"], c: 67 },
    { who: "体育委员", ic: "🏃", t: "运动会报名名单明天截止，还差一个接力名额，是兄弟就来。", img: ["🏃", "🏁"], c: 23 },
    { who: "宣传委员", ic: "🎨", t: "这期黑板报的主题是秋天，谁字写得好、谁会画画，放学来教室帮我！", img: ["🎨", "🍂"], c: 15 },
    { who: "生活委员", ic: "🧹", t: "今天值日的同学记得关灯关窗，饮水机的水也换一下，辛苦啦。", img: [], c: 8 },
    { who: "同桌", ic: "🍞", t: "小卖部新出的肉松面包真的绝，我连吃三天了，求别涨价。", img: ["🥖"], c: 44 },
    { who: "室友阿杰", ic: "🎮", t: "晚自习后开黑的有没有，五缺一，再不来我就睡了。", img: ["🎮"], c: 12 },
    { who: "室友小宇", ic: "😴", t: "今早差点迟到，叼着包子冲进教室的那一刻铃响了，刺激。", img: ["⏰"], c: 30 },
    { who: "前桌女生", ic: "🍬", t: "谁看到我那支粉色的笔了？昨天还在笔袋里，今天就失踪了，它对我很重要。", img: ["🖊️"], c: 6 },
    { who: "后排男生", ic: "🏀", t: "中午三对三，被人颜扣了，丢人，但对方真的强。", img: ["🏀"], c: 37 },
    { who: "隔壁班同学", ic: "📷", t: "雨后的操场，水洼里倒映着教学楼，拍了一张，自我感觉良好。", img: ["🌧️", "📷"], c: 58 },
    { who: "学生会", ic: "🎤", t: "校园广播站招新啦！喜欢播音、写稿、剪辑的同学扫码报名，等你发声。", img: ["🎤"], c: 21 },
    { who: "图书馆", ic: "📖", t: "本周新书到馆：一批诗集、科幻小说和科普读物，靠窗的位置也擦干净了。", img: ["📚"], c: 25 },
    { who: "食堂阿姨", ic: "🍱", t: "今天有红烧鸡块和糖醋里脊，来得晚可就没了啊。", img: ["🍗", "🍚"], c: 89 },
    { who: "门卫大叔", ic: "🚲", t: "门口捡到一个校园卡和一把伞，在门卫室，失主来认领。", img: [], c: 11 },
    { who: "心理老师", ic: "🌿", t: "压力大的时候，允许自己慢下来。心理咨询室的门，一直为你开着。", img: ["🌿"], c: 73 },
    { who: "班主任", ic: "✏️", t: "这次月考整体不错，但也有同学在滑坡。今晚把试卷认真看看，明天我们逐题讲。", img: ["📝"], c: 34 },
    { who: "数学老师", ic: "📐", t: "那道大题，解题的钥匙不在计算，而在你愿不愿意多画一条辅助线。", img: ["📐"], c: 48 },
    { who: "语文老师", ic: "📜", t: "把课本合上，去看看窗外的秋天吧。最好的作文，往往写在生活里。", img: ["🍂", "📖"], c: 96 },
    { who: "英语老师", ic: "🔤", t: "Language is not a subject, it's a window. 多读，多开口，别怕错。", img: ["🔤"], c: 27 },
    { who: "物理老师", ic: "🧲", t: "生活里处处是物理：为什么食堂的汤特别烫？为什么窗户会起雾？想想看。", img: ["🧲"], c: 19 },
    { who: "化学老师", ic: "🧪", t: "实验课的安全规范再强调一遍，别拿试剂开玩笑，好奇心要用在对的地方。", img: ["🧪"], c: 14 },
    { who: "生物老师", ic: "🌱", t: "窗台的绿萝谁浇的水？长得特别好，给它点个赞。", img: ["🪴"], c: 22 },
    { who: "地理老师", ic: "🌏", t: "今天讲季风，下课去看看窗外的云，你会发现课本里的图其实就在天上。", img: ["🌥️"], c: 31 },
    { who: "历史老师", ic: "📜", t: "历史不是背年份，是看懂一个个具体的人，在当时为什么那样选择。", img: ["🏛️"], c: 42 },
    { who: "美术老师", ic: "🎨", t: "美术不是画得像，是学会用眼睛去看，用心去感受。", img: ["🖌️"], c: 38 },
    { who: "音乐老师", ic: "🎵", t: "大课间的合唱再练一遍，气息稳住，声音放出来，别害羞。", img: ["🎤"], c: 16 },
    { who: "信息老师", ic: "💻", t: "今天教大家用表格做一个学习计划表，做完的同学可以早点下课。", img: ["💻"], c: 20 },
    { who: "体育老师", ic: "🤸", t: "今天测八百米，身体不舒服的提前说，别硬撑。其他同学，热身做充分。", img: ["🏃"], c: 45 },
    { who: "不知名的橘猫", ic: "🐱", t: "（蹭）今日份的太阳和火腿肠，已到账。请路过的同学继续投喂。", img: ["🐱", "☀️"], c: 128 },
    { who: "高一新生", ic: "🎒", t: "开学第一周，还在找教室的路上迷路了三次，学长学姐人都好好。", img: ["🏫"], c: 33 },
    { who: "高三学长", ic: "🌙", t: "倒计时牌三位数了，心里有点慌，但也有点期待。学弟学妹们，珍惜现在。", img: ["🌙", "📚"], c: 104 },
    { who: "社团联合会", ic: "🎭", t: "本周社团招新：戏剧社、辩论社、摄影社、机器人社……总有一个舞台属于你。", img: ["🎭", "📷", "🤖"], c: 26 },
    { who: "运动会志愿者", ic: "📣", t: "运动会需要志愿者和啦啦队，想为班级出力的同学来找我报名。", img: ["📣", "🏁"], c: 17 },
    { who: "校园歌手", ic: "🎤", t: "文艺汇演的歌定了，紧张到失眠，有没有人愿意陪我一起练和声？", img: ["🎵"], c: 29 },
    { who: "书法社", ic: "🖌️", t: "今天练了一百个“永”字，终于有点感觉了。练字真的能让心静下来。", img: ["🖌️"], c: 36 },
    { who: "天文社", ic: "🔭", t: "今晚天气好，操场边有观星活动，带件外套，我们一起看木星。", img: ["🔭", "✨"], c: 47 },
    { who: "动漫社", ic: "🌸", t: "漫展摊位招募中，会画画、会手工、会整活的都来，缺的就是你。", img: ["🎨"], c: 24 },
    { who: "篮球社社长", ic: "🏀", t: "本周招新：不限技术，只要你愿意跑、愿意练。球场见。", img: ["🏀"], c: 40 },
    { who: "长跑爱好者", ic: "🌅", t: "连续早起跑步第 21 天，操场空荡荡的，只有风和朝阳，感觉自己能坚持下去。", img: ["🌅", "🏃"], c: 55 },
    { who: "迟到专业户", ic: "⏰", t: "立个 flag：从明天开始不迟到。先把闹钟设五个。", img: ["⏰"], c: 30 },
    { who: "错题本收藏家", ic: "📓", t: "数学错题本写到第三本了，看着它，居然有一种奇怪的成就感。", img: ["📝"], c: 39 },
    { who: "走读生", ic: "🚌", t: "早高峰的公交真的太挤了，我是被人群“抬”上车的。", img: ["🚌"], c: 28 },
    { who: "住校生", ic: "🛏️", t: "宿舍熄灯后的卧谈会，是高中最珍贵的快乐之一，不接受反驳。", img: ["🌙", "💬"], c: 76 },
    { who: "课代表", ic: "📮", t: "今天的作业收齐了，就差最后一位同学，我知道你在看这条朋友圈。", img: ["📚"], c: 59 },
    { who: "值周生", ic: "🚩", t: "本周值周，提醒大家：自行车停整齐，食堂排队别插队，校园靠大家维护。", img: ["🧹"], c: 9 },
    { who: "美术课代表", ic: "🖼️", t: "把大家的画办了个小小的走廊展览，路过记得来看一眼，每一张都很认真。", img: ["🖼️", "🎨"], c: 43 },
    { who: "冬日战士", ic: "🧤", t: "降温了，手都冻红了，谁能拒绝一个暖宝宝和一杯热豆浆呢。", img: ["🧣", "🥛"], c: 61 },
    { who: "夏日限定", ic: "🍉", t: "体育课之后的冰镇西瓜，是整个夏天最幸福的事。", img: ["🍉", "☀️"], c: 88 },
    { who: "考试周", ic: "📖", t: "图书馆已经一座难求，连走廊都是背书的人。大家加油，考完一起玩。", img: ["📚", "🌙"], c: 64 },
    { who: "黑板报小队", ic: "🎨", t: "踩着凳子画了两节课，黑板报终于完成了，虽然腰酸背痛，但值得。", img: ["🎨", "🖌️"], c: 26 },
    { who: "运动会接力队", ic: "🔁", t: "交接棒练了几十遍，从总是掉棒到一气呵成，这就是团队的力量。", img: ["🏃", "🔁"], c: 32 },
    { who: "校刊编辑部", ic: "📰", t: "新一期校刊出来啦，封面是雨后的校园，里面有大家的文章和照片，欢迎取阅。", img: ["📰"], c: 18 },
    { who: "失物招领", ic: "🔑", t: "操场捡到一串钥匙，图书馆捡到一副眼镜，都在失物招领处，快来认领。", img: ["🔑"], c: 7 },
    { who: "校园广播电台", ic: "📻", t: "今天午间放了一首大家点的歌，送给正在努力的你。点歌箱在食堂门口。", img: ["🎵", "📻"], c: 51 },
    { who: "未来的自己", ic: "🌟", t: "写给三年后的自己：希望你还记得此刻的努力，和身边这群一起奔跑的人。", img: ["🌠", "🌳"], c: 112 }
  ];

  var REPLY_POOL = ["说得太对了", "哈哈哈哈真实", "加油呀！", "拍得真好", "明天见！", "下课一起去", "哈哈哈笑死", "我也这么觉得", "好棒", "抱抱", "一起努力", "已点赞"];

  var KEY = "xz570_feed_v1";
  function state() {
    try { return JSON.parse(lsGet(KEY, "{}")) || {}; } catch (e) { return {}; }
  }
  function save(st) { try { lsSet(KEY, JSON.stringify(st)); } catch (e) {} }

  function open() {
    var el = H.openFull("x570Sub", "📱 校园动态墙");
    var body = el.querySelector(".x570-full-body");
    var st = state();
    st.like = st.like || {}; st.cmt = st.cmt || {};
    function render() {
      var html = '<div class="x570-card"><div class="t">同学们的动态</div><div class="d">这里是全校同学的朋友圈，点赞、评论都可以，也能转发到你的朋友圈。</div></div>';
      html += POSTS.map(function (p, i) {
        var liked = st.like[i];
        var cmts = st.cmt[i] || [];
        var imgs = p.img.length ? '<div class="x570-feed-imgs">' + p.img.map(function (g) { return '<span>' + g + "</span>"; }).join("") + "</div>" : "";
        var cmtHtml = cmts.length ? '<div class="x570-feed-cmt">' + cmts.map(function (c) {
          return '<div><b>我：</b>' + esc(c) + "</div>";
        }).join("") + "</div>" : "";
        return '<div class="x570-feed">' +
          '<div class="hd"><span class="av">' + p.ic + '</span><b>' + esc(p.who) + '</b><span class="time">' + (1 + (i % 23)) + "小时前</span></div>" +
          '<div class="ct">' + esc(p.t) + "</div>" + imgs +
          '<div class="ops">' +
            '<span class="like ' + (liked ? "on" : "") + '" data-like="' + i + '">' + (liked ? "❤️" : "🤍") + " " + (p.c + (liked ? 1 : 0)) + "</span>" +
            '<span class="cmt" data-cmt="' + i + '">💬 评论</span>' +
            '<span class="share" data-share="' + i + '">🔄 转发</span>' +
          "</div>" + cmtHtml + "</div>";
      }).join("");
      body.innerHTML = html;
      on(body, "click", function (e) {
        var lk = e.target.closest("[data-like]");
        if (lk) { var i = +lk.getAttribute("data-like"); st.like[i] = !st.like[i]; save(st); render(); return; }
        var cm = e.target.closest("[data-cmt]");
        if (cm) {
          var j = +cm.getAttribute("data-cmt");
          var txt = prompt("评论点什么？", REPLY_POOL[Math.floor(Math.random() * REPLY_POOL.length)]);
          if (txt) { st.cmt[j] = st.cmt[j] || []; st.cmt[j].push(txt); save(st); render(); }
          return;
        }
        var sh = e.target.closest("[data-share]");
        if (sh) {
          var k = +sh.getAttribute("data-share");
          var p = POSTS[k];
          try {
            if (window.X56Moments && X56Moments.add) { X56Moments.add(p.t); H.toast("已转发到朋友圈"); }
            else H.toast("转发内容：" + p.t.slice(0, 12) + "…");
          } catch (err) { H.toast("已复制转发"); }
        }
      });
    }
    render();
  }

  X570.CampusSub.feed = open;
  X570.Feed = { open: open, POSTS: POSTS };
})();

/* ===== a170_clubs.js ===== */
/* =====================================================================
   社团与技能系统：加入社团、参加活动、积累技能点、解锁称号
   数据持久化；社团活动产出技能与心情
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;

  var KEY = "xz570_clubs_v1";
  var S = { joined: null, act: {}, skills: {}, mood: 0 };
  function load() { try { var d = JSON.parse(lsGet(KEY, "{}")); if (d) for (var k in d) S[k] = d[k]; } catch (e) {} }
  function save() { try { lsSet(KEY, JSON.stringify(S)); } catch (e) {} }

  var CLUBS = [
    { id: "basket", ic: "🏀", n: "篮球社", skill: "运动", desc: "在球场上挥洒汗水，练就团队配合和爆发力。",
      acts: ["运球绕桩练习", "定点投篮 50 个", "三对三对抗赛", "体能折返跑"],
      gain: { health: 3, mood: 2 } },
    { id: "music", ic: "🎹", n: "音乐社", skill: "音乐", desc: "练琴、组乐队、排练文艺汇演的节目。",
      acts: ["练习音阶与指法", "排练一首新歌", "录音棚录小样", "组织小型弹唱会"],
      gain: { mood: 3, knowledge: 1 } },
    { id: "lit", ic: "📖", n: "文学社", skill: "写作", desc: "读诗、写作、办校刊，把心事变成文字。",
      acts: ["共读一篇散文", "完成一篇随笔", "校刊选题会", "诗歌朗诵排练"],
      gain: { knowledge: 3, mood: 1 } },
    { id: "art", ic: "🎨", n: "美术社", skill: "美术", desc: "素描、水彩、海报设计，用画笔记录校园。",
      acts: ["静物素描练习", "水彩写生", "设计活动海报", "校园速写"],
      gain: { mood: 2, knowledge: 1 } },
    { id: "photo", ic: "📷", n: "摄影社", skill: "摄影", desc: "学习构图与光影，记录校园里的光与人。",
      acts: ["学习光圈快门", "校园扫街", "人像外拍", "后期修图分享"],
      gain: { mood: 2, knowledge: 1 } },
    { id: "robot", ic: "🤖", n: "机器人社", skill: "科技", desc: "搭建机器人、写代码、参加科创比赛。",
      acts: ["搭建机械结构", "编写控制程序", "调试传感器", "备战科创赛"],
      gain: { knowledge: 3, mood: 1 } },
    { id: "drama", ic: "🎭", n: "戏剧社", skill: "表演", desc: "排练话剧、练台词、站上舞台。",
      acts: ["台词与发声练习", "无实物表演", "排练经典片段", "舞台走位彩排"],
      gain: { mood: 3, social: 2 } },
    { id: "debate", ic: "🗣️", n: "辩论社", skill: "思辨", desc: "训练逻辑与表达，在辩场上以理服人。",
      acts: ["拆解辩题", "练习攻防", "模拟辩论赛", "复盘录像"],
      gain: { knowledge: 2, social: 2 } },
    { id: "run", ic: "🏃", n: "田径社", skill: "运动", desc: "短跑、长跑、接力，挑战自己的极限。",
      acts: ["热身与起跑", "间歇跑训练", "接力交接练习", "核心力量"],
      gain: { health: 3, mood: 1 } },
    { id: "dance", ic: "💃", n: "舞蹈社", skill: "表演", desc: "街舞、民族舞，练节奏与自信。",
      acts: ["基本功拉伸", "学习新动作", "齐舞排练", "freestyle 练习"],
      gain: { health: 2, mood: 3 } },
    { id: "volun", ic: "🤝", n: "志愿者协会", skill: "社交", desc: "公益服务、校园活动，把温暖传递给更多人。",
      acts: ["图书馆整理", "校园文明引导", "敬老院探访", "公益募捐"],
      gain: { social: 3, mood: 2 } },
    { id: "chess", ic: "♟️", n: "棋类社", skill: "思辨", desc: "围棋、象棋，于方寸之间运筹帷幄。",
      acts: ["复盘经典对局", "死活题训练", "社内对弈", "布局学习"],
      gain: { knowledge: 2, mood: 1 } }
  ];

  var SKILL_TITLES = {
    运动: ["", "热身新手", "运动健将", "体育达人", "校队王牌"],
    音乐: ["", "乐理小白", "会唱会弹", "音乐能手", "舞台之星"],
    写作: ["", "随笔新手", "妙笔少年", "校园作者", "文学之星"],
    美术: ["", "涂鸦新手", "会画会涂", "校园画师", "视觉艺术家"],
    摄影: ["", "随手拍拍", "构图入门", "光影捕手", "校园摄影师"],
    科技: ["", "好奇宝宝", "创客新手", "技术达人", "科创先锋"],
    表演: ["", "怯场新人", "敢于上台", "舞台常客", "聚光主角"],
    思辨: ["", "沉默倾听", "敢于发言", "逻辑达人", "最佳辩手"],
    社交: ["", "腼腆少年", "热心同学", "社交达人", "人气之星"]
  };

  function levelOf(skill) {
    var v = S.skills[skill] || 0;
    return Math.min(4, Math.floor(v / 3));
  }

  function open() {
    load();
    var el = H.openFull("x570Sub", "🎭 社团与技能");
    var body = el.querySelector(".x570-full-body");
    function home() {
      var club = CLUBS.filter(function (c) { return c.id === S.joined; })[0];
      var skillHtml = Object.keys(SKILL_TITLES).map(function (sk) {
        var lv = levelOf(sk);
        var v = S.skills[sk] || 0;
        var titles = SKILL_TITLES[sk];
        return '<div class="x570-skill"><div class="n">' + sk + " · " + titles[lv] + "</div>" +
          '<div class="bar"><i style="width:' + Math.min(100, (v % 3) / 3 * 100) + '%"></i></div>' +
          '<div class="lv">Lv.' + lv + "</div></div>";
      }).join("");
      var html = "";
      if (club) {
        html += '<div class="x570-card"><div class="t">' + club.ic + " 我加入了「" + club.n + "」</div>" +
          '<div class="d">' + esc(club.desc) + "</div><div class='d' style='margin-top:6px'>已参加活动 " + (S.act[club.id] || 0) + " 次 · 心情 " + S.mood + "</div>" +
          '<button class="x570-btn" id="clubAct" style="margin-top:10px">参加一次社团活动</button> ' +
          '<button class="x570-btn" id="clubLeave">退出社团</button></div>';
      } else {
        html += '<div class="x570-card"><div class="t">选择一个社团加入</div><div class="d">同一时间只能加入一个社团，参加活动可提升对应技能。</div></div>';
      }
      html += '<div class="x570-card"><div class="t">我的技能</div>' + skillHtml + "</div>";
      if (!club) {
        html += '<div class="x570-campus-grid">' + CLUBS.map(function (c) {
          return '<div class="x570-campus-item" data-join="' + c.id + '"><div class="ic">' + c.ic + '</div><div class="n">' + esc(c.n) + '</div><div class="d">' + esc(c.skill) + "</div></div>";
        }).join("") + "</div>";
      }
      body.innerHTML = html;
      if (club) {
        on($("#clubAct"), "click", function () { doAct(club); });
        on($("#clubLeave"), "click", function () {
          S.joined = null; save(); home();
        });
      }
      on(body, "click", function (e) {
        var j = e.target.closest("[data-join]");
        if (j) { S.joined = j.getAttribute("data-join"); S.act[S.joined] = S.act[S.joined] || 0; save(); home(); }
      });
    }
    function doAct(club) {
      var act = club.acts[Math.floor(Math.random() * club.acts.length)];
      S.act[club.id] = (S.act[club.id] || 0) + 1;
      S.skills[club.skill] = (S.skills[club.skill] || 0) + 1;
      S.mood += 1;
      for (var k in club.gain) {
        try { if (window.G && typeof G[k] === "number") G[k] += club.gain[k]; } catch (e) {}
      }
      var before = levelOf(club.skill);
      save();
      var lv = levelOf(club.skill);
      var up = lv > before ? "<br><b style='color:#ffd166'>🎉 技能升级！当前称号：" + SKILL_TITLES[club.skill][lv] + "</b>" : "";
      body.innerHTML =
        '<div class="x570-card"><div class="t">' + club.ic + " " + esc(act) + "</div>" +
        '<div class="d">你认真完成了这次社团活动，「' + club.skill + "」技能 +1。</div>" +
        '<div class="d" style="margin-top:8px">技能：' + club.skill + " Lv." + lv + " " + SKILL_TITLES[club.skill][lv] + up + "</div>" +
        '<button class="x570-btn" id="clubBack" style="margin-top:10px">返回</button></div>';
      on($("#clubBack"), "click", home);
    }
    home();
  }

  X570.CampusSub.clubs = open;
  X570.Clubs = { open: open, CLUBS: CLUBS, SKILL_TITLES: SKILL_TITLES };
})();

/* ===== a180_shop.js ===== */
/* =====================================================================
   校园小卖部：零食/学习/装扮/礼物/道具，购买影响属性，库存持久化
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;

  var KEY = "xz570_shop_v1";
  var S = { coins: 120, inv: {} };
  function load() {
    try {
      var d = JSON.parse(lsGet(KEY, "{}"));
      if (d) { S.coins = d.coins != null ? d.coins : 120; S.inv = d.inv || {}; }
    } catch (e) {}
    /* 同步自由模式零花钱 */
    try { if (window.G && typeof G.money === "number") { S.coins = Math.max(S.coins, Math.round(G.money)); } } catch (e) {}
  }
  function save() {
    try { lsSet(KEY, JSON.stringify(S)); } catch (e) {}
    try { if (window.G && typeof G.money === "number") G.money = S.coins; } catch (e) {}
  }

  var CATS = [
    { id: "snack", n: "零食饮料", ic: "🍿" },
    { id: "study", n: "学习用品", ic: "📚" },
    { id: "gift", n: "礼物", ic: "🎁" },
    { id: "gear", n: "实用道具", ic: "🧰" },
    { id: "look", n: "装扮外观", ic: "👕" }
  ];

  var ITEMS = [
    { id: "milk", c: "snack", ic: "🥛", n: "热豆浆", p: 2, fx: { mood: 1 }, d: "早上来一杯，暖胃又暖心。" },
    { id: "bread", c: "snack", ic: "🥖", n: "肉松面包", p: 5, fx: { mood: 2 }, d: "课间垫肚子的经典选择。" },
    { id: "noodle", c: "snack", ic: "🍜", n: "夜宵泡面", p: 6, fx: { mood: 2, health: -1 }, d: "晚自习后的快乐。" },
    { id: "tea", c: "snack", ic: "🧋", n: "珍珠奶茶", p: 12, fx: { mood: 3 }, d: "第二杯半价更快乐。" },
    { id: "fruit", c: "snack", ic: "🍎", n: "水果盒", p: 8, fx: { health: 2, mood: 1 }, d: "健康的下午加餐。" },
    { id: "choc", c: "snack", ic: "🍫", n: "巧克力", p: 9, fx: { mood: 3 }, d: "补充能量，也适合送人。" },
    { id: "chips", c: "snack", ic: "🍟", n: "薯片", p: 7, fx: { mood: 2 }, d: "宿舍分享装。" },
    { id: "water", c: "snack", ic: "💧", n: "矿泉水", p: 2, fx: { health: 1 }, d: "运动后及时补水。" },
    { id: "coffee", c: "snack", ic: "☕", n: "美式咖啡", p: 12, fx: { knowledge: 1, mood: 1 }, d: "熬夜复习的续命神器。" },
    { id: "candy", c: "snack", ic: "🍬", n: "水果糖", p: 1, fx: { mood: 1 }, d: "口袋里的小确幸。" },

    { id: "pen", c: "study", ic: "🖊️", n: "速干中性笔", p: 6, fx: { knowledge: 1 }, d: "顺滑不断墨，考试必备。" },
    { id: "notebook", c: "study", ic: "📓", n: "错题本", p: 10, fx: { knowledge: 2 }, d: "整理错题，事半功倍。" },
    { id: "ruler", c: "study", ic: "📐", n: "套尺", p: 5, fx: { knowledge: 1 }, d: "数学几何课用。" },
    { id: "highlighter", c: "study", ic: "🖍️", n: "荧光笔套装", p: 8, fx: { knowledge: 1 }, d: "划出重点。" },
    { id: "book", c: "study", ic: "📕", n: "课外书", p: 25, fx: { knowledge: 3, mood: 1 }, d: "扩展阅读，开阔眼界。" },
    { id: "deskmat", c: "study", ic: "🗂️", n: "资料夹", p: 9, fx: { knowledge: 1 }, d: "让试卷不再丢失。" },
    { id: "timer", c: "study", ic: "⏲️", n: "学习计时器", p: 18, fx: { knowledge: 2 }, d: "番茄工作法好帮手。" },
    { id: "lamp", c: "study", ic: "💡", n: "护眼台灯", p: 60, fx: { knowledge: 2, health: 1 }, d: "晚自习保护眼睛。" },

    { id: "gflower", c: "gift", ic: "💐", n: "一束小花", p: 20, fx: { mood: 2 }, d: "送给在意的人。" },
    { id: "gbook", c: "gift", ic: "📖", n: "一本诗集", p: 28, fx: { mood: 3 }, d: "写给喜欢安静的人。" },
    { id: "gbear", c: "gift", ic: "🧸", n: "毛绒熊", p: 35, fx: { mood: 3 }, d: "可爱又治愈。" },
    { id: "gscarf", c: "gift", ic: "🧣", n: "手织围巾", p: 40, fx: { mood: 4 }, d: "冬天的心意。" },
    { id: "gmusic", c: "gift", ic: "🎵", n: "音乐盒", p: 45, fx: { mood: 4 }, d: "转动时响起温柔旋律。" },
    { id: "gstar", c: "gift", ic: "🌟", n: "许愿星瓶", p: 18, fx: { mood: 2 }, d: "装满幸运星。" },
    { id: "gcard", c: "gift", ic: "💌", n: "手写贺卡", p: 5, fx: { mood: 2 }, d: "最朴素也最真诚。" },
    { id: "gphoto", c: "gift", ic: "📷", n: "拍立得照片", p: 15, fx: { mood: 2 }, d: "定格校园瞬间。" },

    { id: "umbrella", c: "gear", ic: "☂️", n: "折叠伞", p: 22, fx: { health: 1 }, d: "下雨天不慌。" },
    { id: "powerbank", c: "gear", ic: "🔋", n: "充电宝", p: 50, fx: { mood: 1 }, d: "出门再也不担心断电。" },
    { id: "bottle", c: "gear", ic: "🍶", n: "保温杯", p: 30, fx: { health: 2 }, d: "随时喝到热水。" },
    { id: "wipes", c: "gear", ic: "🧻", n: "湿巾纸巾", p: 6, fx: { mood: 1 }, d: "应急小物。" },
    { id: "mask", c: "gear", ic: "😷", n: "一次性口罩", p: 5, fx: { health: 1 }, d: "有备无患。" },
    { id: "bandage", c: "gear", ic: "🩹", n: "创可贴", p: 4, fx: { health: 1 }, d: "运动小擦伤用。" },
    { id: "lock", c: "gear", ic: "🔒", n: "小挂锁", p: 12, fx: { mood: 1 }, d: "锁好自己的柜子。" },
    { id: "glue", c: "gear", ic: "🧴", n: "固体胶", p: 4, fx: { knowledge: 1 }, d: "做手工和贴资料。" },

    { id: "cap", c: "look", ic: "🧢", n: "棒球帽", p: 28, fx: { mood: 2 }, d: "运动风穿搭。" },
    { id: "hoodie", c: "look", ic: "🧥", n: "连帽卫衣", p: 80, fx: { mood: 3 }, d: "秋天的舒适单品。" },
    { id: "sneaker", c: "look", ic: "👟", n: "小白鞋", p: 120, fx: { health: 1, mood: 2 }, d: "百搭又好走。" },
    { id: "watch", c: "look", ic: "⌚", n: "运动手表", p: 150, fx: { knowledge: 1, mood: 2 }, d: "看时间、记步数。" },
    { id: "glasses", c: "look", ic: "👓", n: "防蓝光眼镜", p: 90, fx: { health: 1 }, d: "上网课护眼神器。" },
    { id: "bag", c: "look", ic: "🎒", n: "双肩背包", p: 110, fx: { mood: 2 }, d: "装下所有课本。" },
    { id: "hairpin", c: "look", ic: "🎀", n: "蝴蝶结发饰", p: 12, fx: { mood: 2 }, d: "可爱的小点缀。" },
    { id: "bracelet", c: "look", ic: "📿", n: "手绳", p: 20, fx: { mood: 2 }, d: "和朋友一起戴。" }
  ];

  function applyFx(fx) {
    try {
      if (!window.G) return;
      for (var k in fx) if (typeof G[k] === "number") G[k] += fx[k];
    } catch (e) {}
  }

  function open() {
    load();
    var el = H.openFull("x570Sub", "🛍️ 校园小卖部");
    var body = el.querySelector(".x570-full-body");
    var cat = "snack";
    function render() {
      var head = '<div class="x570-sp-board"><div class="x570-sp-stat"><div class="v">🪙' + S.coins + '</div><div class="k">余额</div></div>' +
        '<div class="x570-sp-stat"><div class="v">' + Object.values(S.inv).reduce(function (a, b) { return a + b; }, 0) + '</div><div class="k">物品</div></div></div>';
      var tabs = '<div class="x570-ach-tabs">' + CATS.map(function (c) {
        return '<button class="x570-ach-tab ' + (c.id === cat ? "on" : "") + '" data-c="' + c.id + '">' + c.ic + " " + c.n + "</button>";
      }).join("") + "</div>";
      var list = ITEMS.filter(function (it) { return it.c === cat; }).map(function (it) {
        var own = S.inv[it.id] || 0;
        return '<div class="x570-shop-item"><div class="ic">' + it.ic + "</div>" +
          '<div class="n">' + esc(it.n) + (own ? ' <span class="x570-badge">×' + own + "</span>" : "") + '</div>' +
          '<div class="d">' + esc(it.d) + '</div>' +
          '<div class="row"><span class="price">🪙' + it.p + "</span>" +
          '<button class="x570-btn buy" data-buy="' + it.id + '" style="min-height:38px;padding:0 14px">购买</button>' +
          (cat === "snack" ? '<button class="x570-btn use" data-use="' + it.id + '" style="min-height:38px;padding:0 14px">使用</button>' : "") +
          "</div></div>";
      }).join("");
      var inv = '<div class="x570-card"><div class="t">我的物品</div><div class="d">' +
        (Object.keys(S.inv).filter(function (k) { return S.inv[k] > 0; }).length ?
          Object.keys(S.inv).filter(function (k) { return S.inv[k] > 0; }).map(function (k) {
            var it = ITEMS.filter(function (x) { return x.id === k; })[0];
            return it ? '<span class="x570-chip">' + it.ic + " " + it.n + " ×" + S.inv[k] + "</span>" : "";
          }).join("") : "还没有物品，去逛逛吧。") + "</div></div>";
      body.innerHTML = head + tabs + '<div class="x570-shop-grid">' + list + "</div>" + inv +
        '<button class="x570-btn" id="shopReset" style="margin-top:10px">重置小卖部（领取 120 零花钱）</button>';
      on(body, "click", function (e) {
        var t = e.target.closest("[data-c]");
        if (t) { cat = t.getAttribute("data-c"); render(); return; }
        var b = e.target.closest("[data-buy]");
        if (b) {
          var it = ITEMS.filter(function (x) { return x.id === b.getAttribute("data-buy"); })[0];
          if (S.coins < it.p) { H.toast("零花钱不够啦"); return; }
          S.coins -= it.p;
          S.inv[it.id] = (S.inv[it.id] || 0) + 1;
          save(); render();
          H.toast("已购买 " + it.n);
          return;
        }
        var u = e.target.closest("[data-use]");
        if (u) {
          var id = u.getAttribute("data-use");
          if (!S.inv[id]) { H.toast("你还没有这个"); return; }
          var it2 = ITEMS.filter(function (x) { return x.id === id; })[0];
          S.inv[id]--; applyFx(it2.fx);
          if (S.inv[id] <= 0) delete S.inv[id];
          save(); render();
          H.toast("使用了 " + it2.n);
        }
      });
      on($("#shopReset"), "click", function () { S.coins = 120; S.inv = {}; save(); render(); });
    }
    render();
  }

  X570.CampusSub.shop = open;
  X570.Shop = { open: open, ITEMS: ITEMS };
})();

/* ===== a190_study.js ===== */
/* =====================================================================
   学习手册：各科方法 + 高频知识点卡片 + 考前清单（物化地方向）
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc;

  var DATA = {
    "学习方法": {
      ic: "🧠",
      methods: [
        "番茄学习法：25 分钟专注 + 5 分钟休息，每 4 个番茄休息 20 分钟。",
        "错题本三步：抄题（或剪贴）→ 写错误原因 → 写正确思路，定期重做。",
        "费曼学习法：把知识点讲给别人听，讲不清楚的地方就是没懂的地方。",
        "间隔复习：当天、第 2 天、第 7 天、第 15 天各复习一次，记得更牢。",
        "康奈尔笔记：把纸分成笔记栏、提示栏、总结栏，课后用自己的话写总结。",
        "先做最重要的事：每天先完成最难或最有价值的那一项。",
        "目标拆解：把大目标拆成每周、每天能完成的小任务。",
        "主动回忆：合上书默写，比反复阅读有效得多。"
      ],
      cards: [
        { t: "如何高效听课", d: "课前预习标疑问、课上跟思路记关键词、课后 5 分钟回顾。笔记记“为什么”和“怎么做”，而不是抄黑板。" },
        { t: "如何安排晚自习", d: "先做需要思考的数理，再做记忆类内容，最后整理错题和明天的计划。" },
        { t: "如何面对考试", d: "考前不刷新题，回归错题本和课本；考试时先易后难，留时间检查涂卡和单位。" },
        { t: "如何对抗拖延", d: "告诉自己“只做 5 分钟”，开始之后往往就停不下来；用计时器制造开始的仪式感。" },
        { t: "如何利用碎片时间", d: "排队、等车时背单词、看错题、回忆知识点；碎片时间积少成多。" },
        { t: "如何稳定情绪", d: "焦虑时写下让你担心的事和能做的事，把注意力放到“能做的事”上。" }
      ]
    },
    "数学": {
      ic: "📐",
      methods: [
        "数学靠“概念 + 题型 + 计算”。先把定义、公式、成立条件搞清楚。",
        "错题要分类：概念不清、思路错误、计算失误、审题失误，对症下药。",
        "几何题多画辅助线，代数题多观察结构，函数题数形结合。",
        "限时训练：选择填空要练速度，大题要练规范步骤。"
      ],
      cards: [
        { t: "二次函数", d: "y=ax²+bx+c（a≠0），顶点坐标 (-b/2a, (4ac-b²)/4a)。a 决定开口方向，对称轴 x=-b/2a。" },
        { t: "一元二次方程", d: "ax²+bx+c=0，求根公式 x=(-b±√(b²-4ac))/2a。判别式 Δ=b²-4ac 决定实根个数。" },
        { t: "勾股定理", d: "直角三角形两直角边 a、b，斜边 c，满足 a²+b²=c²。常见勾股数 3-4-5、5-12-13。" },
        { t: "三角函数", d: "sin30°=1/2，sin45°=√2/2，sin60°=√3/2；cos 与之对应，tan45°=1。" },
        { t: "等差数列", d: "通项 aₙ=a₁+(n-1)d，前 n 项和 Sₙ=n(a₁+aₙ)/2=na₁+n(n-1)d/2。" },
        { t: "等比数列", d: "通项 aₙ=a₁·q^(n-1)，前 n 项和 Sₙ=a₁(1-qⁿ)/(1-q)（q≠1）。" },
        { t: "圆", d: "周长 C=2πr，面积 S=πr²；垂径定理：垂直于弦的直径平分这条弦。" },
        { t: "概率", d: "概率 = 有利结果数 / 所有等可能结果数。注意“放回”和“不放回”的区别。" },
        { t: "统计", d: "平均数反映总体水平，中位数不受极端值影响，方差反映数据波动大小。" }
      ]
    },
    "物理": {
      ic: "🧲",
      methods: [
        "物理要建立“模型”：明确研究对象、受力情况、运动过程。",
        "公式要记成立条件和单位；计算题先写公式，再代数据，最后写单位。",
        "力学画受力分析图，电学画等效电路图，是解题的第一步。"
      ],
      cards: [
        { t: "牛顿第一定律", d: "一切物体在不受外力（或合力为零）时，总保持静止或匀速直线运动状态，即惯性定律。" },
        { t: "牛顿第二定律", d: "F=ma。加速度方向与合力方向相同，力是改变运动状态的原因。" },
        { t: "牛顿第三定律", d: "作用力与反作用力大小相等、方向相反、作用在同一直线上，作用在两个物体上。" },
        { t: "重力与摩擦力", d: "G=mg，g≈9.8 N/kg；滑动摩擦力 f=μN，方向与相对运动方向相反。" },
        { t: "压强", d: "p=F/S，单位帕斯卡(Pa)；液体压强 p=ρgh。" },
        { t: "浮力", d: "F浮=ρ液gV排（阿基米德原理）。物体漂浮时浮力等于重力。" },
        { t: "功和功率", d: "W=Fs（力与位移方向一致），P=W/t；机械效率 η=W有用/W总。" },
        { t: "欧姆定律", d: "I=U/R；串联电路电流处处相等，并联电路电压相等。" },
        { t: "电功率", d: "P=UI=I²R=U²/R；电功 W=Pt，单位千瓦时即“度”。" },
        { t: "光的反射与折射", d: "反射角等于入射角；光从空气斜射入水或玻璃，折射角小于入射角。" }
      ]
    },
    "化学": {
      ic: "🧪",
      methods: [
        "化学要“记性质、写方程、会计算”。方程式要配平、写条件、标气体沉淀。",
        "结合实验现象记物质性质，比死记硬背有效。",
        "物质的量 n=m/M，是连接宏观质量和微观粒子的桥梁。"
      ],
      cards: [
        { t: "常见气体", d: "氧气 O₂ 助燃、密度略大于空气；二氧化碳 CO₂ 不燃不助燃、能使澄清石灰水变浑浊。" },
        { t: "金属活动性", d: "钾钙钠镁铝锌铁锡铅(氢)铜汞银铂金。排在氢前的金属能置换出酸中的氢。" },
        { t: "酸碱盐", d: "pH<7 酸性，pH=7 中性，pH>7 碱性；酸使紫色石蕊变红，碱变蓝。" },
        { t: "化学方程式", d: "书写步骤：写化学式→配平→标条件（点燃/加热/催化剂）→标 ↑↓。" },
        { t: "质量守恒", d: "参加反应的各物质质量总和等于反应后生成的各物质质量总和。" },
        { t: "溶解度", d: "多数固体溶解度随温度升高而增大；气体溶解度随温度升高而减小、随压强增大而增大。" },
        { t: "氧化还原", d: "化合价升高被氧化（失电子），化合价降低被还原（得电子）。" },
        { t: "常见沉淀", d: "白色：BaSO₄、AgCl、CaCO₃；蓝色：Cu(OH)₂；红褐色：Fe(OH)₃。" }
      ]
    },
    "生物": {
      ic: "🌱",
      methods: [
        "生物重理解与图表，细胞、代谢、遗传、生态是主线。",
        "用概念图把相关知识串起来，如“细胞—组织—器官—系统—个体”。",
        "实验题关注变量控制、对照实验、单一变量原则。"
      ],
      cards: [
        { t: "细胞结构", d: "细胞核是遗传和代谢的控制中心；线粒体是“动力车间”，叶绿体是光合作用场所。" },
        { t: "光合作用", d: "在叶绿体中，利用光能把 CO₂ 和 H₂O 合成有机物并释放 O₂，分光反应和暗反应。" },
        { t: "呼吸作用", d: "主要在线粒体中，分解有机物释放能量，公式：有机物+O₂→CO₂+H₂O+能量。" },
        { t: "DNA", d: "脱氧核糖核酸，是主要遗传物质，双螺旋结构；基因是有遗传效应的 DNA 片段。" },
        { t: "遗传定律", d: "分离定律：等位基因随同源染色体分开；自由组合定律：非同源染色体上的非等位基因自由组合。" },
        { t: "生态系统", d: "包括生物部分和非生物部分；能量沿食物链单向流动、逐级递减。" },
        { t: "人体营养", d: "糖类主要供能，脂肪是储备能源，蛋白质是生长发育和组织修复的原料。" },
        { t: "神经与激素", d: "神经调节反应快、作用准；激素调节较慢、作用范围广，二者共同调节生命活动。" }
      ]
    },
    "语文英语": {
      ic: "📖",
      methods: [
        "语文：基础（字音字形、默写）不丢分，阅读抓主旨和手法，作文积累素材与结构。",
        "英语：每天背词、保持阅读输入，作文背熟常用句型和高级表达。",
        "阅读理解先看题再读文，带着问题找答案。"
      ],
      cards: [
        { t: "文言文实词", d: "重视一词多义、古今异义、词类活用；结合上下文推断词义。" },
        { t: "古诗词鉴赏", d: "抓意象和情感词，答“写了什么景 + 用了什么手法 + 表达什么情”。" },
        { t: "现代文阅读", d: "先整体把握主旨，再结合语境答题，注意“原文依据 + 自己概括”。" },
        { t: "作文结构", d: "开头亮观点，中间用 2-3 个事例或分论点，结尾回扣升华；书写工整很重要。" },
        { t: "英语时态", d: "一般现在、一般过去、现在进行、现在完成、一般将来；注意时间状语提示。" },
        { t: "英语从句", d: "定语从句修饰名词（who/which/that），宾语从句用陈述语序，状语从句看连词。" },
        { t: "英语写作", d: "积累开头、衔接、结尾句型；多用连接词 however/besides/what's more。" },
        { t: "完形填空", d: "先通读全文把握大意，再根据上下文、固定搭配和逻辑关系选择。" }
      ]
    },
    "地理": {
      ic: "🌏",
      methods: [
        "地理重“图”：会读地图、气候图、等值线图，图上信息是答案的来源。",
        "建立“位置—地形—气候—水文—农业/工业—人口城市”的分析链条。"
      ],
      cards: [
        { t: "地球运动", d: "自转产生昼夜交替，约 24 小时；公转产生四季和昼夜长短变化，周期约一年。" },
        { t: "时区", d: "经度每 15° 相差 1 小时，东加西减；北京时间为东八区区时。" },
        { t: "气候类型", d: "看最冷月气温和降水季节分配判断：雨林全年高温多雨，地中海气候夏干冬雨。" },
        { t: "季风", d: "由海陆热力差异形成，我国夏季盛行东南风（带来降水），冬季盛行西北风。" },
        { t: "中国地形", d: "地势西高东低，呈三级阶梯；地形类型多样，山区面积广大。" },
        { t: "河流", d: "长江是我国第一大河，黄河是“母亲河”；水文特征看流量、汛期、含沙量、结冰期。" },
        { t: "农业区位", d: "从气候、地形、水源、土壤、市场、交通、政策等方面分析。" },
        { t: "工业区位", d: "原料、能源、市场、交通、劳动力、技术、政策共同影响工业布局。" }
      ]
    }
  };

  var CHECKLIST = [
    "准考证、身份证、校园卡放好",
    "2B 铅笔、黑色签字笔（多备几支）、橡皮、尺子、圆规",
    "提前看考场、规划路线，留出充足时间",
    "考前一晚保证睡眠，不熬夜突击",
    "考前清淡饮食，准备好水和纸巾",
    "拿到卷子先写姓名考号、通览全卷",
    "先易后难，遇到卡住的题先跳过并做标记",
    "大题写清步骤和单位，不留空白",
    "留时间检查涂卡、题号、单位与错别字",
    "考后不对答案，专心准备下一科"
  ];

  function open() {
    var el = H.openFull("x570Sub", "📒 学习手册");
    var body = el.querySelector(".x570-full-body");
    var keys = Object.keys(DATA);
    var cur = "学习方法";
    function render() {
      var d = DATA[cur];
      var tabs = '<div class="x570-ach-tabs">' + keys.map(function (k) {
        return '<button class="x570-ach-tab ' + (k === cur ? "on" : "") + '" data-k="' + k + '">' + DATA[k].ic + " " + k + "</button>";
      }).join("") + "</div>";
      var html = tabs +
        '<div class="x570-card"><div class="t">' + d.ic + " " + cur + " · 方法</div><ul>" +
        d.methods.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul></div>" +
        '<div class="x570-card"><div class="t">知识点卡片</div>' +
        d.cards.map(function (c) { return '<div class="x570-know"><b>' + esc(c.t) + "</b><div class='d'>" + esc(c.d) + "</div></div>"; }).join("") +
        "</div>";
      if (cur === "学习方法") {
        html += '<div class="x570-card"><div class="t">✅ 考前清单</div>' +
          CHECKLIST.map(function (c, i) { return '<label class="x570-check"><input type="checkbox" data-cl="' + i + '"> ' + esc(c) + "</label>"; }).join("") +
          "</div>";
      }
      body.innerHTML = html;
      on(body, "click", function (e) {
        var b = e.target.closest("[data-k]");
        if (b) { cur = b.getAttribute("data-k"); render(); }
      });
    }
    render();
  }

  X570.CampusSub.study = open;
  X570.Study = { open: open, DATA: DATA, CHECKLIST: CHECKLIST };
})();

/* ===== a200_calendar.js ===== */
/* =====================================================================
   学年日历 + 每日任务 + 志向（心之所向）：长期目标系统
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;

  var TIMELINE = [
    { m: "9 月", t: "开学季", d: "开学典礼、新生适应、社团招新、第一次月考动员。", tag: "适应" },
    { m: "10 月", t: "秋季运动会", d: "运动会、国庆假期、第一次月考，调整学习节奏。", tag: "运动" },
    { m: "11 月", t: "期中考试", d: "系统复习半学期内容，期中考试与质量分析。", tag: "考试" },
    { m: "12 月", t: "冬学冬训", d: "天气转冷，艺术节、冬季长跑、学科竞赛报名。", tag: "提升" },
    { m: "1 月", t: "期末与寒假", d: "期末考试、成绩分析、寒假规划与社会实践。", tag: "收官" },
    { m: "2 月", t: "新学期", d: "寒假归来、开学收心、新学期计划、元宵活动。", tag: "重启" },
    { m: "3 月", t: "春日奋进", d: "学雷锋、研学旅行、月考、选科与生涯规划。", tag: "规划" },
    { m: "4 月", t: "体考与冲刺", d: "体育测试、期中复习、志愿方向初步确定。", tag: "冲刺" },
    { m: "5 月", t: "青春季", d: "文艺汇演、五四活动、第二次月考、心理调适。", tag: "成长" },
    { m: "6 月", t: "期末与升级", d: "高考/中考、期末考试、学期总结、暑假开始。", tag: "毕业" }
  ];

  var TASK_POOL = [
    { ic: "📖", t: "认真听满一节课", d: "任选一节课，全程专注。", act: "class_listen", pts: 5 },
    { ic: "📝", t: "整理一页错题", d: "把今天的错题归类整理。", act: "errata", pts: 8 },
    { ic: "🔤", t: "背 20 个单词", d: "利用碎片时间完成。", act: "words", pts: 8 },
    { ic: "🏃", t: "运动 20 分钟", d: "跑步、打球或跳绳都可以。", act: "sport", pts: 6 },
    { ic: "💧", t: "喝够 6 杯水", d: "保持一天的水分。", act: "water", pts: 4 },
    { ic: "🌙", t: "早睡一次", d: "在 11 点半前睡觉。", act: "early", pts: 6 },
    { ic: "🧹", t: "认真完成值日", d: "轮到值日时不打折扣。", act: "duty", pts: 5 },
    { ic: "💬", t: "主动和同学说句话", d: "给身边的人一点善意。", act: "social", pts: 4 },
    { ic: "📒", t: "完成一项作业", d: "优先完成最难的那一项。", act: "hw", pts: 6 },
    { ic: "📖", t: "课外阅读 15 分钟", d: "读一点和考试无关的书。", act: "read", pts: 5 },
    { ic: "🍎", t: "吃一份水果", d: "健康加餐。", act: "fruit", pts: 3 },
    { ic: "📓", t: "复习昨天的笔记", d: "间隔复习，记得更牢。", act: "review", pts: 7 }
  ];

  var GOALS = [
    { id: "city", ic: "🏙️", t: "考上目标城市的大学", d: "和喜欢的人约定同一个城市。" },
    { id: "science", ic: "🔬", t: "学好物化地", d: "在理科方向上打下扎实基础。" },
    { id: "rank", ic: "📈", t: "冲进年级前 X 名", d: "用排名量化每一步进步。" },
    { id: "health", ic: "💪", t: "练出好身体", d: "坚持运动，体能稳步提升。" },
    { id: "club", ic: "🎭", t: "在社团绽放", d: "把一项兴趣做到亮眼。" },
    { id: "friend", ic: "🤝", t: "珍惜身边人", d: "认真经营高中的友谊与感情。" },
    { id: "myself", ic: "🌟", t: "成为更好的自己", d: "比昨天的自己进步一点点。" }
  ];

  var TKEY = "xz570_daily_" + new Date().toDateString();
  var GKEY = "xz570_goal_v1";

  function loadDaily() {
    try {
      var d = JSON.parse(lsGet(TKEY, "null"));
      if (d) return d;
    } catch (e) {}
    /* 每天随机 4 个任务 */
    var pool = TASK_POOL.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 4);
    var d = { tasks: pool.map(function (t) { return { act: t.act, done: false }; }), points: 0 };
    try { lsSet(TKEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }

  function open() {
    var el = H.openFull("x570Sub", "🌟 学年与志向");
    var body = el.querySelector(".x570-full-body");
    var goal = lsGet(GKEY, "");
    var tabs = [["tasks", "每日任务"], ["year", "学年日历"], ["goal", "心之所向"]];
    var cur = "tasks";

    function tasksView() {
      var d = loadDaily();
      var map = {};
      TASK_POOL.forEach(function (t) { map[t.act] = t; });
      var html = '<div class="x570-card"><div class="t">今日任务 · 积分 ' + d.points + "</div>" +
        '<div class="d">每天刷新，完成任务获得积分，养成好习惯。</div></div>';
      html += d.tasks.map(function (tk) {
        var def = map[tk.act];
        return '<div class="x570-task ' + (tk.done ? "done" : "") + '" data-act="' + tk.act + '">' +
          '<span class="ic">' + def.ic + '</span><div class="n"><b>' + esc(def.t) + '</b><div class="d">' + esc(def.d) + '</div></div>' +
          '<span class="pts">+' + def.pts + "</span><span class='chk'>" + (tk.done ? "✅" : "⭕") + "</span></div>";
      }).join("");
      html += '<div class="x570-card x570-center"><div class="d">连续坚持，会带来意想不到的改变。</div></div>';
      return html;
    }
    function yearView() {
      return '<div class="x570-card"><div class="t">一学年大事日历</div><div class="d">了解一整年的节奏，提前安排学习与生活。</div></div>' +
        '<div class="x570-timeline">' + TIMELINE.map(function (m, i) {
          return '<div class="x570-tl-item"><div class="dot">' + (i + 1) + "</div>" +
            "<div><b>" + m.m + " · " + esc(m.t) + "</b> <span class='x570-chip'>" + esc(m.tag) + "</span>" +
            "<div class='d'>" + esc(m.d) + "</div></div></div>";
        }).join("") + "</div>";
    }
    function goalView() {
      var html = '<div class="x570-card"><div class="t">心之所向</div>' +
        '<div class="d">写下或选择一个长期目标，它会在迷茫时提醒你为什么出发。</div>' +
        (goal ? '<div style="margin-top:10px;font-size:16px">当前志向：<b style="color:#ffd166">' + esc(goal) + "</b></div>" : "") +
        '<input id="goalInput" placeholder="或者自己写一句话……" style="width:100%;margin-top:10px;padding:10px;border-radius:10px;box-sizing:border-box">' +
        '<button class="x570-btn" id="goalSave" style="margin-top:8px">保存我的志向</button></div>';
      html += '<div class="x570-campus-grid">' + GOALS.map(function (g) {
        return '<div class="x570-campus-item" data-goal="' + esc(g.t) + '"><div class="ic">' + g.ic + '</div><div class="n">' + esc(g.t) + '</div><div class="d">' + esc(g.d) + "</div></div>";
      }).join("") + "</div>";
      return html;
    }
    function render() {
      var bar = '<div class="x570-ach-tabs">' + tabs.map(function (tb) {
        return '<button class="x570-ach-tab ' + (cur === tb[0] ? "on" : "") + '" data-tab="' + tb[0] + '">' + tb[1] + "</button>";
      }).join("") + "</div>";
      var inner = cur === "tasks" ? tasksView() : cur === "year" ? yearView() : goalView();
      body.innerHTML = bar + inner;
      on(body, "click", function (e) {
        var t = e.target.closest("[data-tab]");
        if (t) { cur = t.getAttribute("data-tab"); render(); return; }
        var tk = e.target.closest(".x570-task");
        if (tk && cur === "tasks") {
          var d = loadDaily();
          var act = tk.getAttribute("data-act");
          var item = d.tasks.filter(function (x) { return x.act === act; })[0];
          if (item && !item.done) {
            item.done = true;
            var def = TASK_POOL.filter(function (x) { return x.act === act; })[0];
            d.points += def.pts;
            try { lsSet(TKEY, JSON.stringify(d)); } catch (e) {}
            H.toast("任务完成 +" + def.pts);
            render();
          }
          return;
        }
        var gl = e.target.closest("[data-goal]");
        if (gl) { lsSet(GKEY, gl.getAttribute("data-goal")); H.toast("志向已保存"); render(); }
        var sv = e.target.closest("#goalSave");
        if (sv) {
          var v = $("#goalInput").value.trim();
          if (v) { lsSet(GKEY, v); H.toast("已保存你的志向"); render(); }
        }
      });
    }
    render();
  }

  X570.CampusSub.calendar = open;
  X570.Calendar = { open: open, TIMELINE: TIMELINE, TASK_POOL: TASK_POOL, GOALS: GOALS };
})();

/* ===== a210_title.js ===== */
/* =====================================================================
   称号 / 名片系统：根据成就与进度解锁称号，可佩戴在个人名片上
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;

  var TKEY = "xz570_title_worn";
  var TITLES = [
    { id: "freshman", n: "高一新生", ic: "🎒", need: "进入游戏", chk: function () { return true; } },
    { id: "listener", n: "认真听讲", ic: "✏️", need: "课堂认真听讲", chk: function () { return !!flags().class_listen; } },
    { id: "notetaker", n: "笔记达人", ic: "📒", need: "课堂做笔记", chk: function () { return !!flags().class_note; } },
    { id: "earlybird", n: "早起的鸟", ic: "🌅", need: "坚持晨跑", chk: function () { return clubSkill("运动") >= 1; } },
    { id: "bookworm", n: "小书虫", ic: "📖", need: "知识达到 60", chk: function () { return window.G && G.knowledge >= 60; } },
    { id: "scholar", n: "学霸", ic: "🏅", need: "知识达到 90", chk: function () { return window.G && G.knowledge >= 90; } },
    { id: "social", n: "社交达人", ic: "🤝", need: "社交达到 80", chk: function () { return window.G && G.social >= 80; } },
    { id: "athlete", n: "运动健将", ic: "🏃", need: "体质达到 80", chk: function () { return window.G && G.health >= 80; } },
    { id: "happy", n: "乐天派", ic: "😄", need: "心情达到 80", chk: function () { return window.G && G.mood >= 80; } },
    { id: "gold", n: "金牌选手", ic: "🥇", need: "运动会获得金牌", chk: function () { return (sport().gold || 0) >= 1; } },
    { id: "champion", n: "团体第一", ic: "🏆", need: "运动会团体总分第一", chk: function () { return (sport().score || 0) >= 60; } },
    { id: "confession", n: "心之所向", ic: "💗", need: "达成甜蜜结局", chk: function () { return !!flags().end_sweet; } },
    { id: "graduate", n: "毕业快乐", ic: "🎓", need: "走完高考毕业", chk: function () { return !!flags().graduated; } },
    { id: "gamer", n: "游戏高手", ic: "🎮", need: "解锁 5 个游戏成就", chk: function () { return gameAch() >= 5; } },
    { id: "rich", n: "校园小财主", ic: "🪙", need: "在小卖部存下 200 零花钱", chk: function () { return shopCoins() >= 200; } },
    { id: "hunter", n: "成就猎人", ic: "🎯", need: "解锁 10 个成就", chk: function () { return window.X570 && X570.Ach && achCount() >= 10; } }
  ];

  function flags() { try { return JSON.parse(lsGet("xz570_ach_flags", "{}")) || {}; } catch (e) { return {}; } }
  function sport() { try { return JSON.parse(lsGet("xz570_sport_v1", "{}")) || {}; } catch (e) { return {}; } }
  function shopCoins() { try { return (JSON.parse(lsGet("xz570_shop_v1", "{}")) || {}).coins || 0; } catch (e) { return 0; } }
  function clubSkill(name) {
    try {
      var s = JSON.parse(lsGet("xz570_clubs_v1", "{}")) || {};
      var v = (s.skills || {})[name] || 0;
      return Math.min(4, Math.floor(v / 3));
    } catch (e) { return 0; }
  }
  function gameAch() {
    var ids = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g10", "g11", "g13", "g14", "g15", "g16"];
    var n = 0;
    try {
      if (X570.Ach) {
        X570.Ach.list.forEach(function (a) { if (ids.indexOf(a.id) >= 0) { try { if (a.chk()) n++; } catch (e) {} } });
      }
    } catch (e) {}
    return n;
  }
  function achCount() {
    var n = 0;
    try { X570.Ach.list.forEach(function (a) { try { if (a.chk()) n++; } catch (e) {} }); } catch (e) {}
    return n;
  }

  function open() {
    var worn = lsGet(TKEY, "freshman");
    var el = H.openFull("x570Sub", "🏷️ 称号与名片");
    var body = el.querySelector(".x570-full-body");
    function render() {
      var html = '<div class="x570-card"><div class="t">我的名片</div>' +
        '<div class="d">佩戴一个称号，它会展示在你的校园名片上。</div>' +
        '<div style="margin-top:10px;font-size:20px">当前称号：' + titleTag(worn) + "</div></div>";
      html += '<div class="x570-campus-grid">' + TITLES.map(function (t) {
        var ok = false;
        try { ok = t.chk(); } catch (e) { ok = false; }
        var isWorn = worn === t.id;
        return '<div class="x570-campus-item ' + (ok ? "" : "x570-locked") + '" data-title="' + t.id + '">' +
          '<div class="ic">' + (ok ? t.ic : "🔒") + "</div><div class='n'>" + esc(t.n) + (isWorn ? " ✅" : "") + "</div>" +
          '<div class="d">' + esc(ok ? "点击佩戴" : "未解锁：" + t.need) + "</div></div>";
      }).join("") + "</div>";
      body.innerHTML = html;
      on(body, "click", function (e) {
        var it = e.target.closest("[data-title]");
        if (!it) return;
        var id = it.getAttribute("data-title");
        var t = TITLES.filter(function (x) { return x.id === id; })[0];
        var ok = false;
        try { ok = t.chk(); } catch (err) { ok = false; }
        if (!ok) { H.toast("称号未解锁：" + t.need); return; }
        lsSet(TKEY, id);
        H.toast("已佩戴「" + t.n + "」");
        render();
      });
    }
    function titleTag(id) {
      var t = TITLES.filter(function (x) { return x.id === id; })[0] || TITLES[0];
      return '<span class="x570-chip" style="font-size:15px">' + t.ic + " " + esc(t.n) + "</span>";
    }
    render();
  }

  X570.CampusSub.title = open;
  X570.Titles = { open: open, TITLES: TITLES };
})();

/* ===== a220_npc.js ===== */
/* =====================================================================
   校园花名册 + 可对话 NPC：认识全校的人，和关键 NPC 进行多轮对话
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;

  var ROSTER = [
    { id: "lin", ic: "🌸", n: "林晚", role: "同班 · 前桌", tag: "文静 · 爱读诗",
      d: "话不多但内心细腻，喜欢靠窗的位置，写字很好看。" },
    { id: "zhao", ic: "🎨", n: "赵小雨", role: "美术生", tag: "开朗 · 画晚霞",
      d: "总是背着画板，笑起来很有感染力。" },
    { id: "su", ic: "🎹", n: "苏清颜", role: "音乐社", tag: "慢热 · 弹钢琴",
      d: "琴房里的常客，安静认真。" },
    { id: "xu", ic: "🏀", n: "许念", role: "体育委员", tag: "飒爽 · 篮球",
      d: "球场上的核心，做事利落。" },
    { id: "mon", ic: "📋", n: "班长", role: "班级", tag: "负责 · 靠谱",
      d: "班级事务的主心骨，总能把事情安排得井井有条。" },
    { id: "study", ic: "📚", n: "学习委员", role: "班级", tag: "热心 · 学霸",
      d: "整理错题、分享资料，从不吝啬。" },
    { id: "sport", ic: "📣", n: "体育委员", role: "班级", tag: "热情 · 爱跑",
      d: "运动会报名和体测的组织者。" },
    { id: "art", ic: "🖌️", n: "宣传委员", role: "班级", tag: "审美 · 板报",
      d: "每期黑板报背后的人。" },
    { id: "life", ic: "🧹", n: "生活委员", role: "班级", tag: "细心 · 管物资",
      d: "管着班级的钥匙、清洁和饮水机。" },
    { id: "deskmate", ic: "🍞", n: "同桌", role: "同班", tag: "随和 · 吃货",
      d: "知道小卖部所有好吃的，也是最熟的人。" },
    { id: "j1", ic: "🎮", n: "室友阿杰", role: "宿舍", tag: "游戏 · 话多",
      d: "晚自习后开黑的组织者。" },
    { id: "j2", ic: "😴", n: "室友小宇", role: "宿舍", tag: "迟到 · 乐观",
      d: "总是在最后一分钟冲进教室。" },
    { id: "j3", ic: "📓", n: "室友阿泽", role: "宿舍", tag: "自律 · 早起",
      d: "宿舍的人形闹钟，坚持晨跑。" },
    { id: "tmath", ic: "📐", n: "数学老师", role: "教师", tag: "严谨 · 爱画辅助线",
      d: "解题总从多画一条线开始。" },
    { id: "tchi", ic: "📜", n: "语文老师", role: "教师", tag: "温和 · 爱生活",
      d: "会让大家合上课本去看窗外的秋天。" },
    { id: "teng", ic: "🔤", n: "英语老师", role: "教师", tag: "鼓励 · 要开口",
      d: "常说语言是一扇窗，要多读多讲。" },
    { id: "tphy", ic: "🧲", n: "物理老师", role: "教师", tag: "幽默 · 讲生活",
      d: "能把生活里的现象讲成物理题。" },
    { id: "tche", ic: "🧪", n: "化学老师", role: "教师", tag: "严格 · 重安全",
      d: "实验课的安全规范重复一百遍也不嫌多。" },
    { id: "tbio", ic: "🌱", n: "生物老师", role: "教师", tag: "温柔 · 养绿萝",
      d: "窗台的植物在她的照料下长得很好。" },
    { id: "tgeo", ic: "🌏", n: "地理老师", role: "教师", tag: "看图 · 讲天气",
      d: "能把课本里的云指到天上去。" },
    { id: "this", ic: "🏛️", n: "历史老师", role: "教师", tag: "讲故事 · 重人",
      d: "把历史讲成一个个具体的人的选择。" },
    { id: "pe", ic: "🤸", n: "体育老师", role: "教师", tag: "认真 · 关心身体",
      d: "总提醒身体不舒服就说，别硬撑。" },
    { id: "head", ic: "✏️", n: "班主任", role: "教师", tag: "严厉又温柔",
      d: "会在你成绩下滑时单独找你谈话。" },
    { id: "psych", ic: "🌿", n: "心理老师", role: "教师", tag: "倾听 · 疗愈",
      d: "心理咨询室的门一直为你开着。" },
    { id: "cat", ic: "🐱", n: "校园橘猫", role: "校宠", tag: "慵懒 · 爱吃",
      d: "在花坛边晒太阳，谁有火腿肠就跟谁走。" },
    { id: "canteen", ic: "🍱", n: "食堂阿姨", role: "职工", tag: "手不抖 · 热情",
      d: "打菜从不手抖，还会多给一勺。" },
    { id: "guard", ic: "🚲", n: "门卫大叔", role: "职工", tag: "热心 · 管失物",
      d: "门卫室里收着大家捡到的各种东西。" },
    { id: "lib", ic: "📖", n: "图书馆管理员", role: "职工", tag: "安静 · 管新书",
      d: "守护着靠窗的位置和一排排书架。" },
    { id: "new", ic: "🎒", n: "转学生", role: "同学", tag: "陌生 · 拘谨",
      d: "刚转来，还在熟悉校园。" },
    { id: "senior", ic: "🌙", n: "高三学长", role: "学长", tag: "拼搏 · 倒计时",
      d: "在晚自习的灯光下冲刺高考。" },
    { id: "fresh", ic: "🏫", n: "高一新生", role: "学弟", tag: "好奇 · 迷路",
      d: "还在找教室的路上反复迷路。" },
    { id: "radio", ic: "📻", n: "广播台主播", role: "社团", tag: "声音好听 · 点歌",
      d: "每个午后为全校放歌。" }
  ];

  /* 多轮对话（关键 NPC） */
  var TALK = {
    mon: {
      start: { say: "有什么班级事务需要我帮忙吗？", opts: [
        { l: "今天有什么通知？", to: "notice" },
        { l: "我想报名运动会", to: "sport" },
        { l: "没什么，就是打个招呼", to: "bye" }
      ]},
      notice: { say: "明天早自习前交物理作业，下午大扫除，校服记得穿。还有，运动会报名快截止了。", opts: [
        { l: "我想报名运动会", to: "sport" },
        { l: "知道了，谢谢班长", to: "bye" }
      ]},
      sport: { say: "太好了！个人项目有短跑、跳远、实心球，还有集体接力和拔河。你想报哪个？", opts: [
        { l: "报短跑和接力", to: "spok" },
        { l: "报拔河", to: "tug" },
        { l: "我再想想", to: "bye" }
      ]},
      spok: { say: "行！那你放学去操场练练交接，运动会加油，为班级争光！", opts: [ { l: "一定！", to: "bye" } ] },
      tug: { say: "拔河需要力量和配合，回头我把你拉进训练群。", opts: [ { l: "好嘞", to: "bye" } ] },
      bye: { say: "嗯，有事情随时找我。", opts: [ { l: "（结束对话）", to: null } ] }
    },
    study: {
      start: { say: "我整理了一些错题和笔记，需要的话可以借你。", opts: [
        { l: "借我看看数学错题", to: "math" },
        { l: "你是怎么学习的？", to: "how" },
        { l: "谢谢，先不打扰了", to: "bye" }
      ]},
      math: { say: "数学错题我按题型分了类，重点是函数和几何。你先看，不懂的我们一起讨论。", opts: [
        { l: "那太好了", to: "how" },
        { l: "谢谢", to: "bye" }
      ]},
      how: { say: "我习惯当天复习、整理错题，再预习明天的内容。关键是坚持，比突击有用多了。", opts: [
        { l: "我也试试", to: "bye" },
        { l: "可以一起复习吗", to: "group" }
      ]},
      group: { say: "当然可以！我们学习小组正好缺一个人，放学图书馆见。", opts: [ { l: "好，放学见", to: "bye" } ] },
      bye: { say: "一起加油呀。", opts: [ { l: "（结束对话）", to: null } ] }
    },
    tmath: {
      start: { say: "这道题卡在哪一步了？", opts: [
        { l: "几何题不会做辅助线", to: "geo" },
        { l: "函数图像看不懂", to: "func" },
        { l: "我先自己再想想", to: "bye" }
      ]},
      geo: { say: "几何题的钥匙常常在你没画的那条线上。从已知条件出发，想想它在暗示什么，补出能用上的线。", opts: [
        { l: "我好像有点思路了", to: "try" },
        { l: "还是不太懂", to: "ask" }
      ]},
      func: { say: "函数图像要看三点：开口、对称轴、顶点。把这三者抓住，大多数问题都能转化。", opts: [
        { l: "明白了", to: "try" },
        { l: "能再举个例子吗", to: "ask" }
      ]},
      ask: { say: "放学来办公室找我，我给你单独讲两道。", opts: [ { l: "好，谢谢老师", to: "bye" } ] },
      try: { say: "好，自己再算一遍，算出来了最有成就感。", opts: [ { l: "好", to: "bye" } ] },
      bye: { say: "多思考，会越来越顺。", opts: [ { l: "（结束对话）", to: null } ] }
    },
    cat: {
      start: { say: "（橘猫眯着眼，懒洋洋地喵了一声）", opts: [
        { l: "掏出火腿肠", to: "food" },
        { l: "摸摸它", to: "pet" },
        { l: "去上课", to: "bye" }
      ]},
      food: { say: "（橘猫立刻精神了，蹭着你的手吃完，尾巴翘得老高）", opts: [
        { l: "再摸摸它", to: "pet" },
        { l: "心满意足地离开", to: "bye" }
      ]},
      pet: { say: "（它舒服地翻了个肚皮，呼噜声很大）", opts: [
        { l: "喂它点吃的", to: "food" },
        { l: "依依不舍地走", to: "bye" }
      ]},
      bye: { say: "（橘猫打了个哈欠，继续晒太阳）", opts: [ { l: "（结束对话）", to: null } ] }
    },
    canteen: {
      start: { say: "同学，今天吃点什么？红烧鸡块、糖醋里脊都有。", opts: [
        { l: "来份红烧鸡块", to: "chicken" },
        { l: "有什么推荐", to: "rec" },
        { l: "我看看再说", to: "bye" }
      ]},
      chicken: { say: "好嘞，给你多盛点，长身体呢。", opts: [ { l: "谢谢阿姨", to: "bye" } ] },
      rec: { say: "今天的糖醋里脊很受欢迎，汤也免费，打一份？", opts: [
        { l: "就它了", to: "chicken" },
        { l: "下次吧", to: "bye" }
      ]},
      bye: { say: "慢点吃，不够再来。", opts: [ { l: "（结束对话）", to: null } ] }
    },
    psych: {
      start: { say: "最近状态还好吗？想聊聊都可以进来，这里是安全的。", opts: [
        { l: "最近有点焦虑", to: "anxious" },
        { l: "和同学有矛盾", to: "conflict" },
        { l: "我就是来看看", to: "bye" }
      ]},
      anxious: { say: "焦虑常常来自对未来的不确定。我们把担心的事写下来，再看看哪些是现在能做的，好吗？", opts: [
        { l: "好，我想试试", to: "plan" },
        { l: "谢谢，我轻松点了", to: "bye" }
      ]},
      conflict: { say: "矛盾里，先照顾好自己的情绪，再找一个双方都平静的时机沟通，会好很多。", opts: [
        { l: "我明白了", to: "bye" },
        { l: "能具体说说吗", to: "plan" }
      ]},
      plan: { say: "那我们一起来列一个小小的行动清单，一次只做一件事。", opts: [ { l: "谢谢您", to: "bye" } ] },
      bye: { say: "门一直开着，需要的时候再来。", opts: [ { l: "（结束对话）", to: null } ] }
    }
  };

  function open() {
    var el = H.openFull("x570Sub", "👥 校园花名册");
    var body = el.querySelector(".x570-full-body");
    function roster() {
      body.innerHTML = '<div class="x570-card"><div class="t">认识全校的人</div><div class="d">带「对话」标记的可以聊一聊。</div></div>' +
        '<div class="x570-campus-grid">' + ROSTER.map(function (p) {
          var can = !!TALK[p.id];
          return '<div class="x570-campus-item" data-npc="' + p.id + '"><div class="ic">' + p.ic + '</div>' +
            '<div class="n">' + esc(p.n) + (can ? " 💬" : "") + '</div><div class="d">' + esc(p.role) + " · " + esc(p.tag) + "</div></div>";
        }).join("") + "</div>";
      on(body, "click", function (e) {
        var it = e.target.closest("[data-npc]");
        if (!it) return;
        var id = it.getAttribute("data-npc");
        var p = ROSTER.filter(function (x) { return x.id === id; })[0];
        profile(p);
      });
    }
    function profile(p) {
      var can = !!TALK[p.id];
      body.innerHTML = '<div class="x570-card"><div style="display:flex;align-items:center;gap:14px">' +
        '<div style="font-size:48px">' + p.ic + "</div><div><div class='t'>" + esc(p.n) + "</div>" +
        '<div class="d">' + esc(p.role) + " · " + esc(p.tag) + "</div></div></div>" +
        '<div class="d" style="margin-top:10px">' + esc(p.d) + "</div>" +
        '<div style="margin-top:12px">' + (can ? '<button class="x570-btn" id="npcTalk">💬 聊一聊</button> ' : '') +
        '<button class="x570-btn" id="npcBack">返回花名册</button></div></div>';
      on($("#npcBack"), "click", roster);
      if (can) on($("#npcTalk"), "click", function () { talk(p.id); });
    }
    function talk(id) {
      var p = ROSTER.filter(function (x) { return x.id === id; })[0];
      var tree = TALK[id];
      function node(key) {
        var nd = tree[key];
        body.innerHTML =
          '<div class="x570-card"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:30px">' + p.ic + '</span><b>' + esc(p.n) + "</b></div>" +
          '<div class="d" style="margin-top:10px">' + esc(nd.say) + "</div></div>" +
          '<div class="x570-list">' + nd.opts.map(function (o, i) {
            return '<button class="x570-btn npcopt" data-i="' + i + '" style="text-align:left;margin-bottom:8px">' + esc(o.l) + "</button>";
          }).join("") + "</div>";
        on(body, "click", function (e) {
          var b = e.target.closest(".npcopt");
          if (!b) return;
          var o = nd.opts[+b.getAttribute("data-i")];
          if (!o.to) roster();
          else node(o.to);
        });
      }
      node("start");
    }
    roster();
  }

  X570.CampusSub.npc = open;
  X570.NPC = { open: open, ROSTER: ROSTER, TALK: TALK };
})();

/* ===== a230_fun.js ===== */
/* =====================================================================
   课间轻松角：校园笑话 / 冷知识 / 励志语录 / 脑筋急转弯（可翻答案）
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc;

  var JOKES = [
    "数学老师：为什么你上课睡觉？学生：我没睡，我只是闭眼在思考。老师：那你为什么点头？学生：您讲得太对了。",
    "老师问：地球为什么是圆的？学生：因为……方的话滚不起来？",
    "同桌：我有一个能让你立刻闭嘴的办法。我：什么办法？同桌：你看，老师来了。",
    "考试时我最大的竞争对手不是学霸，是我旁边那个写得特别快的同学，他一翻页我就慌。",
    "食堂阿姨今天手不抖，我端着盘子都不敢相信，菜堆得像小山。",
    "我对自己说只玩五分钟手机，再抬头，晚自习结束了。",
    "体育老师从不生病，这节课是我三年来最稳的一节体育课。",
    "我的笔总是在最关键的考试里神秘失踪，然后在考完后自己出现。",
    "同桌信誓旦旦说这道题选 B，我也选了 B。后来我们对答案，正确答案是 A，他说：我那是故意排除的。",
    "我背了一整晚的公式，考试卷子打开的那一刻，我的大脑像被格式化了。",
    "每次老师说“我就占用大家一分钟”，我就知道下节课的课间没了。",
    "宿舍六个人，五个闹钟，第二天全员迟到，只有闹钟自己很准时。",
    "我把英语单词背了三遍，合上书：abandon……（再次）abandon……",
    "食堂的创新菜，我们称之为“薛定谔的菜”——不尝之前，不知道好不好吃。",
    "我对体育课的热爱程度，和数学老师布置作业的速度成反比。",
    "课间十分钟，去趟厕所、买瓶水、聊几句，回座位铃就响了，比任何一节课都快。",
    "老师说“这道题讲完就下课”，然后讲了一整页。",
    "我的错题本有两个结局：要么被认真写完，要么在期末变成草稿纸。",
    "早读时我以为自己声音很大，结果被同桌悄悄录音回放，像蚊子哼。",
    "校园卡充值时总觉得钱是大风刮来的，打水时才发现它是真的不经花。",
    "我和学霸之间只差一个功能：他的“不会”和我的“不会”不是同一个东西。",
    "大课间跑操，我在队伍里完美地实现了“原地踏步”。",
    "每次大扫除，我都能在课桌底下找到失踪很久的文具。",
    "我以为我在认真听英语听力，其实我在认真捕捉它的背景音乐。",
    "作文要求 800 字，我写完开头就剩 50 字的灵感了。",
    "同桌问我借橡皮，我借了；从此我的橡皮就再也没回来过。",
    "课间一趴，再睁眼是下一节课，同桌说我完成了“秒睡”。",
    "我发誓今晚早睡，结果凌晨还在研究一道题（其实是在刷手机）。",
    "食堂的队伍排到门口，我才真正理解什么叫“人生漫漫”。",
    "老师让用“一边……一边……”造句，我写：我一边很困，一边努力不睡。"
  ];

  var FACTS = [
    "人的大脑在安静阅读时会非常活跃，会同时调动视觉、语言和想象区域。",
    "番茄原产于南美洲，最初被当作观赏植物，后来才成为常见食物。",
    "光在真空中的传播速度约为每秒 30 万千米，一秒钟可绕地球约 7 圈半。",
    "一个成年人的身体大约由 60% 左右的水构成，及时补水很重要。",
    "蜂鸟是少数能悬停并向后飞行的鸟类，它的翅膀每秒可振动几十次。",
    "月球始终以同一面朝向地球，因为它的自转与公转周期相同。",
    "世界上使用人数最多的语言是汉语，使用范围最广的是英语。",
    "彩虹有七种颜色，是阳光经过小水滴折射、反射形成的。",
    "植物通过光合作用释放氧气，一片森林就像一座天然的“氧吧”。",
    "把生鸡蛋放进浓盐水里会浮起来，因为盐水密度比清水大。",
    "DNA 呈双螺旋结构，携带了几乎所有生物的遗传信息。",
    "汉字是世界上少数仍在广泛使用的表意文字体系。",
    "人的指纹在胎儿期就已形成，并且几乎终生不变。",
    "珠穆朗玛峰是世界上海拔最高的山峰，位于中国与尼泊尔边界。",
    "闪电的温度极高，出现后往往伴随雷声，先看到闪电是因为光比声传播快。",
    "深海里的压强非常大，那里的生物演化出了适应高压的身体结构。",
    "世界上最长的河流是尼罗河，而我国最长的河流是长江。",
    "橙子的维生素 C 含量丰富，适当吃水果有助于健康。",
    "太阳是一颗恒星，地球绕太阳公转一周大约需要一年。",
    "磁铁有两个磁极，同极相斥、异极相吸。",
    "人的心脏每天要跳动约十万次，是不知疲倦的“动力泵”。",
    "二氧化碳是植物光合作用的重要原料，同时也是温室气体之一。",
    "蜂蜜在合适条件下可以保存很久，因为它含糖量高、含水量低。",
    "声音由物体振动产生，需要介质传播，在真空中无法传播。",
    "银河系是我们所在的恒星系统，太阳只是其中千亿颗恒星之一。",
    "中国古代四大发明是造纸术、印刷术、火药和指南针。",
    "南极比北极更寒冷，南极大陆覆盖着厚厚的冰盖。",
    "适度运动有助于大脑分泌让人愉快的物质，能缓解压力。",
    "鸟在高速飞行时会借助气流，迁徙是许多鸟类的本能。",
    "肥皂能洗掉油污，是因为它一端亲油、一端亲水。"
  ];

  var QUOTES = [
    "种一棵树最好的时间是十年前，其次是现在。",
    "你不必一开始就很厉害，但你必须开始，才可能变得厉害。",
    "所谓天才，不过是把别人喝咖啡的功夫都用在了学习上。",
    "星光不问赶路人，时光不负有心人。",
    "慢慢来，比较快。",
    "今天的努力，是幸运的伏笔。",
    "你只管努力，剩下的交给时间。",
    "山再高，往上攀，总能登顶；路再长，走下去，定能到达。",
    "不是因为有了希望才坚持，而是坚持了才有希望。",
    "每一个不曾起舞的日子，都是对生命的辜负。",
    "把每一次练习当成考试，把每一次考试当成练习。",
    "不怕慢，就怕站。",
    "你的努力，时间都记得。",
    "心之所向，素履以往。",
    "少年不惧岁月长，彼方尚有荣光在。",
    "再微小的光，也是光；再平凡的人，也有高光时刻。",
    "越努力，越幸运。",
    "目标决定你想成为谁，行动决定你能成为谁。",
    "别让未来的你，讨厌现在不努力的自己。",
    "真正的强者，不是没有眼泪，而是含着眼泪奔跑。",
    "做你害怕做的事，然后你会发现，不过如此。",
    "与其临渊羡鱼，不如退而结网。",
    "所有的不期而遇，都藏着不为人知的努力。",
    "把借口留在昨天，把行动交给今天。",
    "一个人可以走得很快，但一群人可以走得更远。",
    "认真的人，自带光芒。",
    "你走过的每一步，都算数。",
    "梦想不会逃跑，逃跑的永远是自己。",
    "风雨之后，不一定有彩虹，但一定有放晴的天。",
    "现在的每一份坚持，都是未来的底气。"
  ];

  var BRAIN = [
    { q: "什么东西越洗越脏？", a: "水" },
    { q: "什么门永远关不上？", a: "球门" },
    { q: "什么东西越擦越小？", a: "橡皮（肥皂）" },
    { q: "什么人一年只工作一天？", a: "圣诞老人" },
    { q: "什么东西有头无脚？", a: "钉子" },
    { q: "什么东西越热越爱出来？", a: "汗" },
    { q: "什么东西打破了才能用？", a: "鸡蛋" },
    { q: "什么东西越晒越湿？", a: "冰" },
    { q: "什么东西不能吃？", a: "“东西”方向（这个不能吃）" },
    { q: "什么布剪不断？", a: "瀑布" },
    { q: "什么东西有脚不能走？", a: "桌子（椅子）" },
    { q: "什么东西越旧越值钱？", a: "古董" },
    { q: "什么东西有嘴不说话？", a: "茶壶" },
    { q: "什么东西有眼看不见？", a: "针眼" },
    { q: "什么东西越拿越轻？", a: "气球里的气" },
    { q: "什么东西人人都不想有？", a: "病（烦恼）" },
    { q: "什么东西有手却不能拿东西？", a: "钟表的指针" },
    { q: "什么东西越黑越看得清？", a: "夜晚的星星" },
    { q: "什么东西有牙不咬人？", a: "梳子" },
    { q: "什么东西能装下整个世界，却装不下一滴水？", a: "地图" }
  ];

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function open() {
    var el = H.openFull("x570Sub", "😄 课间轻松角");
    var body = el.querySelector(".x570-full-body");
    var tabs = [["joke", "校园笑话"], ["fact", "冷知识"], ["quote", "励志语录"], ["brain", "脑筋急转弯"]];
    var cur = "joke";
    function render() {
      var bar = '<div class="x570-ach-tabs">' + tabs.map(function (t) {
        return '<button class="x570-ach-tab ' + (cur === t[0] ? "on" : "") + '" data-t="' + t[0] + '">' + t[1] + "</button>";
      }).join("") + "</div>";
      var html = "";
      if (cur === "brain") {
        var arr = BRAIN.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 6);
        html = '<div class="x570-list">' + arr.map(function (b, i) {
          return '<div class="x570-card"><div class="t">🧩 ' + esc(b.q) + '</div>' +
            '<button class="x570-btn" data-reveal="' + i + '" style="margin-top:8px">看答案</button>' +
            '<div class="d x570-ans" data-ans="' + i + '" style="display:none;margin-top:8px;color:#ffd166">答案：' + esc(b.a) + "</div></div>";
        }).join("") + "</div>";
      } else {
        var pool = cur === "joke" ? JOKES : cur === "fact" ? FACTS : QUOTES;
        var shown = pool.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 6);
        var ic = cur === "joke" ? "😂" : cur === "fact" ? "💡" : "🌟";
        html = '<div class="x570-list">' + shown.map(function (x) {
          return '<div class="x570-card"><div class="d">' + ic + " " + esc(x) + "</div></div>";
        }).join("") + "</div>";
      }
      html += '<button class="x570-btn" id="funNext" style="width:100%;margin-top:10px">换一批 🔄</button>';
      body.innerHTML = bar + html;
      on(body, "click", function (e) {
        var t = e.target.closest("[data-t]");
        if (t) { cur = t.getAttribute("data-t"); render(); }
        if (e.target.closest("#funNext")) render();
        var rv = e.target.closest("[data-reveal]");
        if (rv) {
          var i = rv.getAttribute("data-reveal");
          var ans = body.querySelector('[data-ans="' + i + '"]');
          if (ans) ans.style.display = "block";
        }
      });
    }
    render();
  }

  X570.CampusSub.fun = open;
  X570.Fun = { open: open, JOKES: JOKES, FACTS: FACTS, QUOTES: QUOTES, BRAIN: BRAIN };
})();

/* ===== a240_chathub.js ===== */
/* =====================================================================
   校园聊天枢纽：联系人多轮对话（DialogBank）+ 树洞关键词聊天（ChatBank）
   既被恋爱/微信入口使用，也独立成页，所有页面都有返回
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc;

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* 树洞关键词回复 */
  function treeReply(text) {
    var bank = (window.X570 && X570.ChatBank) ? X570.ChatBank : [];
    var t = text || "";
    for (var i = 0; i < bank.length; i++) {
      if (t.indexOf(bank[i].kw) >= 0) return pick(bank[i].r);
    }
    var fallbacks = [
      "我在听，你慢慢说。",
      "嗯嗯，我能理解。还有呢？",
      "听起来你最近经历了不少，愿意多说说吗？",
      "如果累了就歇一会儿，不必时时刻刻都坚强。",
      "不管发生什么，都要好好吃饭、好好睡觉。",
      "你可以试试把烦心事写下来，会清楚很多。",
      "需要的话，也可以去找心理老师聊聊，她很温柔。"
    ];
    return pick(fallbacks);
  }

  function open() {
    var el = H.openFull("x570Sub", "💬 校园聊天");
    var body = el.querySelector(".x570-full-body");
    function list() {
      var db = (window.X570 && X570.DialogBank) ? X570.DialogBank : {};
      var names = Object.keys(db);
      var ics = {
        "林晚": "🌸", "赵小雨": "🎨", "苏清颜": "🎹", "许念": "🏀",
        "班长": "📋", "同桌": "🍞", "室友阿杰": "🎮", "数学老师": "📐",
        "班主任": "✏️", "心理老师": "🌿", "食堂阿姨": "🍱", "体育老师": "🤸",
        "校园橘猫": "🐱", "门卫大叔": "🚲", "广播台主播": "📻", "高三学长": "🌙"
      };
      var html = '<div class="x570-card"><div class="t">找个人聊聊天</div>' +
        '<div class="d">联系人可以进行多轮对话，树洞会安静地听你说。</div></div>' +
        '<div class="x570-campus-item" id="treeEntry"><div class="ic">🌳</div><div class="n">校园树洞</div><div class="d">没人知道你是谁，随便说</div></div>' +
        '<div class="x570-campus-grid">' + names.map(function (n) {
          return '<div class="x570-campus-item" data-c="' + esc(n) + '"><div class="ic">' + (ics[n] || "🙂") + '</div>' +
            '<div class="n">' + esc(n) + "</div><div class='d'>点我聊天</div></div>";
        }).join("") + "</div>";
      body.innerHTML = html;
      on($("#treeEntry"), "click", tree);
      on(body, "click", function (e) {
        var c = e.target.closest("[data-c]");
        if (c) contact(c.getAttribute("data-c"));
      });
    }

    function contact(name) {
      var db = (window.X570 && X570.DialogBank) ? X570.DialogBank : {};
      var pairs = db[name] || [];
      var ics = {
        "林晚": "🌸", "赵小雨": "🎨", "苏清颜": "🎹", "许念": "🏀",
        "班长": "📋", "同桌": "🍞", "室友阿杰": "🎮", "数学老师": "📐",
        "班主任": "✏️", "心理老师": "🌿", "食堂阿姨": "🍱", "体育老师": "🤸",
        "校园橘猫": "🐱", "门卫大叔": "🚲", "广播台主播": "📻", "高三学长": "🌙"
      };
      var log = [
        { who: "them", t: "你好呀，有什么想聊的吗？" }
      ];
      function draw() {
        var html = '<div class="x570-card"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:30px">' + (ics[name] || "🙂") + '</span><b>' + esc(name) + "</b></div></div>";
        html += '<div class="x570-chat-log">' + log.map(function (m) {
          return '<div class="x570-bubble ' + (m.who === "me" ? "me" : "them") + '">' + esc(m.t) + "</div>";
        }).join("") + "</div>";
        html += '<div class="x570-list">' + pairs.map(function (p, i) {
          return '<button class="x570-btn qopt" data-i="' + i + '" style="text-align:left;margin-bottom:6px">' + esc(p.q) + "</button>";
        }).join("") + "</div>";
        html += '<button class="x570-btn" id="chatBack" style="width:100%;margin-top:6px">← 返回联系人</button>';
        body.innerHTML = html;
        var box = body.querySelector(".x570-chat-log");
        if (box) box.scrollTop = box.scrollHeight;
        on($("#chatBack"), "click", list);
        on(body, "click", function (e) {
          var b = e.target.closest(".qopt");
          if (!b) return;
          var p = pairs[+b.getAttribute("data-i")];
          log.push({ who: "me", t: p.q });
          log.push({ who: "them", t: p.a });
          draw();
        });
      }
      draw();
    }

    function tree() {
      var log = [
        { who: "them", t: "这里是校园树洞，你说的话不会被任何人知道。最近过得怎么样？" }
      ];
      function draw() {
        var html = '<div class="x570-card"><div class="t">🌳 校园树洞</div><div class="d">随便说，关键词会被温柔地接住。</div></div>';
        html += '<div class="x570-chat-log">' + log.map(function (m) {
          return '<div class="x570-bubble ' + (m.who === "me" ? "me" : "them") + '">' + esc(m.t) + "</div>";
        }).join("") + "</div>";
        html += '<div style="display:flex;gap:8px"><input id="treeInput" placeholder="想说点什么……" style="flex:1;padding:10px;border-radius:10px;border:1px solid #ccc">' +
          '<button class="x570-btn" id="treeSend">发送</button></div>';
        html += '<div style="margin-top:8px"><button class="x570-btn" id="treeBack" style="width:100%">← 返回联系人</button></div>';
        body.innerHTML = html;
        var box = body.querySelector(".x570-chat-log");
        if (box) box.scrollTop = box.scrollHeight;
        $("#treeInput").focus();
        function send() {
          var v = $("#treeInput").value.trim();
          if (!v) return;
          log.push({ who: "me", t: v });
          log.push({ who: "them", t: treeReply(v) });
          draw();
          var inp = $("#treeInput");
          if (inp) inp.focus();
        }
        on($("#treeSend"), "click", send);
        on($("#treeBack"), "click", list);
        on($("#treeInput"), "keydown", function (e) { if (e.key === "Enter") send(); });
      }
      draw();
    }

    list();
  }

  X570.CampusSub.chat = open;
  X570.ChatHub = { open: open, treeReply: treeReply };
})();

/* ===== a241_exam.js ===== */
/* =====================================================================
   月考 / 期末模拟考试：综合选择题 + 口算，成绩与历史存档
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_exam_v1";

  function shuffle(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
  function load() { try { return JSON.parse(lsGet(KEY, "[]")) || []; } catch (e) { return []; } }
  function save(arr) { try { lsSet(KEY, JSON.stringify(arr)); } catch (e) {} }

  function open() {
    var el = H.openFull("x570Sub", "📝 模拟考试");
    var body = el.querySelector(".x570-full-body");
    function home() {
      var hist = load();
      var avg = hist.length ? Math.round(hist.reduce(function (s, x) { return s + x.score; }, 0) / hist.length) : 0;
      var best = hist.length ? Math.max.apply(null, hist.map(function (x) { return x.score; })) : 0;
      var html = '<div class="x570-card"><div class="t">模拟考试中心</div><div class="d">综合卷包含 10 道选择题与 5 道口算，覆盖语数英与理综。认真作答，成绩会被记录，也会影响你的知识属性。</div>' +
        '<div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">' +
        '<div class="x570-chip">已考 ' + hist.length + " 次</div>" +
        '<div class="x570-chip">平均分 ' + avg + "</div>" +
        '<div class="x570-chip">最高分 ' + best + "</div></div></div>" +
        '<button class="x570-btn" id="examStart" style="width:100%;font-size:17px;padding:14px">开始一场模拟考试 🖋️</button>';
      if (hist.length) {
        html += '<div class="x570-card"><div class="t">历史成绩</div>' +
          hist.slice().reverse().slice(0, 10).map(function (h) {
            var color = h.score >= 80 ? "#7bc47f" : h.score >= 60 ? "#ffd166" : "#ef6f6c";
            return '<div class="x570-task"><span class="ic">📄</span><div class="n"><b>' + esc(h.name) + "</b><div class='d'>" + h.date + "</div></div>" +
              '<span class="pts" style="color:' + color + '">' + h.score + "</span></div>";
          }).join("") + "</div>";
      }
      body.innerHTML = html;
      on($("#examStart"), "click", function () { runExam(); });
    }

    function runExam() {
      var mcq = (window.X570 && X570.MCQBank) ? X570.MCQBank : [];
      var math = (window.X570 && X570.MathBank) ? X570.MathBank : [];
      var qs = [];
      shuffle(mcq).slice(0, 10).forEach(function (q) {
        qs.push({ kind: "mcq", q: q.q, o: q.o, a: q.a });
      });
      shuffle(math).slice(0, 5).forEach(function (q) {
        qs.push({ kind: "math", q: q.q, a: q.a });
      });
      var i = 0, correct = 0;
      function step() {
        if (i >= qs.length) return finish();
        var cur = qs[i];
        var html = '<div class="x570-card"><div class="t">第 ' + (i + 1) + " / " + qs.length + " 题" +
          '<span class="x570-chip" style="float:right">已答对 ' + correct + "</span></div>" +
          '<div class="d" style="font-size:17px;margin-top:8px">' + esc(cur.q) + "</div></div>";
        if (cur.kind === "mcq") {
          html += '<div class="x570-list">' + cur.o.map(function (op, k) {
            var letter = ["A", "B", "C", "D"][k];
            return '<button class="x570-btn mcqopt" data-k="' + k + '" style="text-align:left;margin-bottom:8px">' + letter + ". " + esc(op) + "</button>";
          }).join("") + "</div>";
        } else {
          html += '<div style="display:flex;gap:8px"><input id="mathIn" inputmode="numeric" placeholder="输入答案" style="flex:1;padding:12px;border-radius:10px;border:1px solid #ccc">' +
            '<button class="x570-btn" id="mathOk">确定</button></div>';
        }
        body.innerHTML = html;
        function judge(ok) {
          if (ok) correct++;
          i++;
          setTimeout(step, 250);
        }
        if (cur.kind === "mcq") {
          on(body, "click", function (e) {
            var b = e.target.closest(".mcqopt");
            if (!b) return;
            var k = +b.getAttribute("data-k");
            judge(k === cur.a);
          });
        } else {
          var inp = $("#mathIn");
          inp.focus();
          function okMath() {
            var v = inp.value.trim();
            judge(v === String(cur.a));
          }
          on($("#mathOk"), "click", okMath);
          on(inp, "keydown", function (e) { if (e.key === "Enter") okMath(); });
        }
      }
      function finish() {
        var total = qs.length;
        var score = Math.round(correct / total * 100);
        var name = score >= 90 ? "模拟考试 · 优秀" : score >= 75 ? "模拟考试 · 良好" : score >= 60 ? "模拟考试 · 及格" : "模拟考试 · 需加油";
        var comment = score >= 90 ? "非常棒，基础扎实，继续保持！" :
          score >= 75 ? "不错，再把错题弄懂就更稳了。" :
          score >= 60 ? "及格了，薄弱环节要重点复习。" :
          "别灰心，回到学习手册，把知识点一个个补回来。";
        var hist = load();
        hist.push({ name: name, score: score, date: new Date().toLocaleString("zh-CN"), correct: correct, total: total });
        save(hist);
        if (window.G) {
          if (score >= 75) { G.knowledge = Math.min(100, (G.knowledge || 0) + 2); }
          G.mood = Math.max(0, Math.min(100, (G.mood || 0) + (score >= 60 ? 3 : -2)));
        }
        if (window.X570 && X570.Ach) X570.Ach.setFlag("exam_" + (score >= 90 ? "a" : score >= 75 ? "b" : "c"), score);
        body.innerHTML = '<div class="x570-card x570-center"><div style="font-size:56px">' +
          (score >= 75 ? "🎉" : "📖") + '</div><div class="t" style="font-size:24px">得分 ' + score + "</div>" +
          '<div class="d">答对 ' + correct + " / " + total + " 题</div>" +
          '<div class="d" style="margin-top:10px">' + esc(comment) + "</div>" +
          '<div style="margin-top:14px;display:flex;gap:10px"><button class="x570-btn" id="examAgain">再考一场</button>' +
          '<button class="x570-btn" id="examHome">返回</button></div></div>';
        on($("#examAgain"), "click", runExam);
        on($("#examHome"), "click", home);
      }
      step();
    }
    home();
  }

  X570.CampusSub.exam = open;
  X570.Exam = { open: open };
})();

/* ===== a250_content_big.js ===== */
/* 5.7.0 大型内容库（自动整理自校园素材，供事件/聊天/动态/课堂使用） */
(function () {
  var H = X570H;
  var EVB = [
    { ic: "📖", t: "教室的小插曲1", d: "在教室，你遇到一件需要选择的小事。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "✏️", t: "教室的小插曲2", d: "在教室，时间有点零碎，你在想怎么安排。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🏃", t: "教室的小插曲3", d: "在教室，周围的同学都在忙碌。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🍱", t: "教室的小插曲4", d: "在教室，你注意到一个容易被忽略的细节。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌧️", t: "教室的小插曲5", d: "在教室，眼前的氛围让你有点想偷懒。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📱", t: "教室的小插曲6", d: "在教室，你有一小段可以自由支配的时间。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎒", t: "教室的小插曲7", d: "在教室，一个小麻烦忽然冒了出来。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📚", t: "教室的小插曲8", d: "在教室，你需要在学习和休息之间做个选择。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌿", t: "教室的小插曲9", d: "在教室，身边的同学向你发出了邀请。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎵", t: "教室的小插曲10", d: "在教室，你想起还有一件没做完的事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🪞", t: "教室的小插曲11", d: "在教室，阳光正好，你心情不错。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📝", t: "教室的小插曲12", d: "在教室，天气有点影响你的状态。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🍂", t: "教室的小插曲13", d: "在教室，你看到一个可以帮助别人的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "☀️", t: "教室的小插曲14", d: "在教室，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "教室的小插曲15", d: "在教室，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "教室的小插曲16", d: "在教室，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "教室的小插曲17", d: "在教室，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "教室的小插曲18", d: "在教室，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "教室的小插曲19", d: "在教室，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "教室的小插曲20", d: "在教室，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "✏️", t: "图书馆的小插曲21", d: "在图书馆，时间有点零碎，你在想怎么安排。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🏃", t: "图书馆的小插曲22", d: "在图书馆，周围的同学都在忙碌。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🍱", t: "图书馆的小插曲23", d: "在图书馆，你注意到一个容易被忽略的细节。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌧️", t: "图书馆的小插曲24", d: "在图书馆，眼前的氛围让你有点想偷懒。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📱", t: "图书馆的小插曲25", d: "在图书馆，你有一小段可以自由支配的时间。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎒", t: "图书馆的小插曲26", d: "在图书馆，一个小麻烦忽然冒了出来。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📚", t: "图书馆的小插曲27", d: "在图书馆，你需要在学习和休息之间做个选择。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌿", t: "图书馆的小插曲28", d: "在图书馆，身边的同学向你发出了邀请。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎵", t: "图书馆的小插曲29", d: "在图书馆，你想起还有一件没做完的事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🪞", t: "图书馆的小插曲30", d: "在图书馆，阳光正好，你心情不错。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📝", t: "图书馆的小插曲31", d: "在图书馆，天气有点影响你的状态。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🍂", t: "图书馆的小插曲32", d: "在图书馆，你看到一个可以帮助别人的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "☀️", t: "图书馆的小插曲33", d: "在图书馆，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "图书馆的小插曲34", d: "在图书馆，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "图书馆的小插曲35", d: "在图书馆，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "图书馆的小插曲36", d: "在图书馆，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "图书馆的小插曲37", d: "在图书馆，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "图书馆的小插曲38", d: "在图书馆，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "图书馆的小插曲39", d: "在图书馆，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "图书馆的小插曲40", d: "在图书馆，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🏃", t: "食堂的小插曲41", d: "在食堂，周围的同学都在忙碌。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🍱", t: "食堂的小插曲42", d: "在食堂，你注意到一个容易被忽略的细节。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌧️", t: "食堂的小插曲43", d: "在食堂，眼前的氛围让你有点想偷懒。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📱", t: "食堂的小插曲44", d: "在食堂，你有一小段可以自由支配的时间。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎒", t: "食堂的小插曲45", d: "在食堂，一个小麻烦忽然冒了出来。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📚", t: "食堂的小插曲46", d: "在食堂，你需要在学习和休息之间做个选择。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌿", t: "食堂的小插曲47", d: "在食堂，身边的同学向你发出了邀请。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎵", t: "食堂的小插曲48", d: "在食堂，你想起还有一件没做完的事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🪞", t: "食堂的小插曲49", d: "在食堂，阳光正好，你心情不错。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📝", t: "食堂的小插曲50", d: "在食堂，天气有点影响你的状态。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🍂", t: "食堂的小插曲51", d: "在食堂，你看到一个可以帮助别人的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "☀️", t: "食堂的小插曲52", d: "在食堂，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "食堂的小插曲53", d: "在食堂，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "食堂的小插曲54", d: "在食堂，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "食堂的小插曲55", d: "在食堂，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "食堂的小插曲56", d: "在食堂，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "食堂的小插曲57", d: "在食堂，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "食堂的小插曲58", d: "在食堂，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "食堂的小插曲59", d: "在食堂，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "食堂的小插曲60", d: "在食堂，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🍱", t: "操场的小插曲61", d: "在操场，你注意到一个容易被忽略的细节。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌧️", t: "操场的小插曲62", d: "在操场，眼前的氛围让你有点想偷懒。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📱", t: "操场的小插曲63", d: "在操场，你有一小段可以自由支配的时间。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎒", t: "操场的小插曲64", d: "在操场，一个小麻烦忽然冒了出来。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📚", t: "操场的小插曲65", d: "在操场，你需要在学习和休息之间做个选择。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌿", t: "操场的小插曲66", d: "在操场，身边的同学向你发出了邀请。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎵", t: "操场的小插曲67", d: "在操场，你想起还有一件没做完的事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🪞", t: "操场的小插曲68", d: "在操场，阳光正好，你心情不错。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📝", t: "操场的小插曲69", d: "在操场，天气有点影响你的状态。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🍂", t: "操场的小插曲70", d: "在操场，你看到一个可以帮助别人的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "☀️", t: "操场的小插曲71", d: "在操场，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "操场的小插曲72", d: "在操场，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "操场的小插曲73", d: "在操场，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "操场的小插曲74", d: "在操场，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "操场的小插曲75", d: "在操场，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "操场的小插曲76", d: "在操场，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "操场的小插曲77", d: "在操场，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "操场的小插曲78", d: "在操场，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "操场的小插曲79", d: "在操场，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "操场的小插曲80", d: "在操场，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🌧️", t: "走廊的小插曲81", d: "在走廊，眼前的氛围让你有点想偷懒。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📱", t: "走廊的小插曲82", d: "在走廊，你有一小段可以自由支配的时间。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎒", t: "走廊的小插曲83", d: "在走廊，一个小麻烦忽然冒了出来。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📚", t: "走廊的小插曲84", d: "在走廊，你需要在学习和休息之间做个选择。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌿", t: "走廊的小插曲85", d: "在走廊，身边的同学向你发出了邀请。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎵", t: "走廊的小插曲86", d: "在走廊，你想起还有一件没做完的事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🪞", t: "走廊的小插曲87", d: "在走廊，阳光正好，你心情不错。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📝", t: "走廊的小插曲88", d: "在走廊，天气有点影响你的状态。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🍂", t: "走廊的小插曲89", d: "在走廊，你看到一个可以帮助别人的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "☀️", t: "走廊的小插曲90", d: "在走廊，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "走廊的小插曲91", d: "在走廊，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "走廊的小插曲92", d: "在走廊，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "走廊的小插曲93", d: "在走廊，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "走廊的小插曲94", d: "在走廊，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "走廊的小插曲95", d: "在走廊，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "走廊的小插曲96", d: "在走廊，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "走廊的小插曲97", d: "在走廊，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "走廊的小插曲98", d: "在走廊，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "走廊的小插曲99", d: "在走廊，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "走廊的小插曲100", d: "在走廊，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "📱", t: "宿舍的小插曲101", d: "在宿舍，你有一小段可以自由支配的时间。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎒", t: "宿舍的小插曲102", d: "在宿舍，一个小麻烦忽然冒了出来。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📚", t: "宿舍的小插曲103", d: "在宿舍，你需要在学习和休息之间做个选择。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌿", t: "宿舍的小插曲104", d: "在宿舍，身边的同学向你发出了邀请。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎵", t: "宿舍的小插曲105", d: "在宿舍，你想起还有一件没做完的事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🪞", t: "宿舍的小插曲106", d: "在宿舍，阳光正好，你心情不错。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📝", t: "宿舍的小插曲107", d: "在宿舍，天气有点影响你的状态。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🍂", t: "宿舍的小插曲108", d: "在宿舍，你看到一个可以帮助别人的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "☀️", t: "宿舍的小插曲109", d: "在宿舍，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "宿舍的小插曲110", d: "在宿舍，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "宿舍的小插曲111", d: "在宿舍，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "宿舍的小插曲112", d: "在宿舍，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "宿舍的小插曲113", d: "在宿舍，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "宿舍的小插曲114", d: "在宿舍，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "宿舍的小插曲115", d: "在宿舍，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "宿舍的小插曲116", d: "在宿舍，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "宿舍的小插曲117", d: "在宿舍，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "宿舍的小插曲118", d: "在宿舍，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "宿舍的小插曲119", d: "在宿舍，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "宿舍的小插曲120", d: "在宿舍，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎒", t: "校门口的小插曲121", d: "在校门口，一个小麻烦忽然冒了出来。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📚", t: "校门口的小插曲122", d: "在校门口，你需要在学习和休息之间做个选择。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌿", t: "校门口的小插曲123", d: "在校门口，身边的同学向你发出了邀请。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎵", t: "校门口的小插曲124", d: "在校门口，你想起还有一件没做完的事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🪞", t: "校门口的小插曲125", d: "在校门口，阳光正好，你心情不错。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📝", t: "校门口的小插曲126", d: "在校门口，天气有点影响你的状态。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🍂", t: "校门口的小插曲127", d: "在校门口，你看到一个可以帮助别人的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "☀️", t: "校门口的小插曲128", d: "在校门口，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "校门口的小插曲129", d: "在校门口，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "校门口的小插曲130", d: "在校门口，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "校门口的小插曲131", d: "在校门口，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "校门口的小插曲132", d: "在校门口，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "校门口的小插曲133", d: "在校门口，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "校门口的小插曲134", d: "在校门口，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "校门口的小插曲135", d: "在校门口，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "校门口的小插曲136", d: "在校门口，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "校门口的小插曲137", d: "在校门口，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "校门口的小插曲138", d: "在校门口，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "校门口的小插曲139", d: "在校门口，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "校门口的小插曲140", d: "在校门口，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📚", t: "楼梯间的小插曲141", d: "在楼梯间，你需要在学习和休息之间做个选择。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌿", t: "楼梯间的小插曲142", d: "在楼梯间，身边的同学向你发出了邀请。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎵", t: "楼梯间的小插曲143", d: "在楼梯间，你想起还有一件没做完的事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🪞", t: "楼梯间的小插曲144", d: "在楼梯间，阳光正好，你心情不错。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📝", t: "楼梯间的小插曲145", d: "在楼梯间，天气有点影响你的状态。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🍂", t: "楼梯间的小插曲146", d: "在楼梯间，你看到一个可以帮助别人的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "☀️", t: "楼梯间的小插曲147", d: "在楼梯间，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "楼梯间的小插曲148", d: "在楼梯间，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "楼梯间的小插曲149", d: "在楼梯间，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "楼梯间的小插曲150", d: "在楼梯间，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "楼梯间的小插曲151", d: "在楼梯间，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "楼梯间的小插曲152", d: "在楼梯间，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "楼梯间的小插曲153", d: "在楼梯间，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "楼梯间的小插曲154", d: "在楼梯间，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "楼梯间的小插曲155", d: "在楼梯间，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "楼梯间的小插曲156", d: "在楼梯间，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "楼梯间的小插曲157", d: "在楼梯间，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "楼梯间的小插曲158", d: "在楼梯间，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "楼梯间的小插曲159", d: "在楼梯间，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "楼梯间的小插曲160", d: "在楼梯间，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🌿", t: "实验室的小插曲161", d: "在实验室，身边的同学向你发出了邀请。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎵", t: "实验室的小插曲162", d: "在实验室，你想起还有一件没做完的事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🪞", t: "实验室的小插曲163", d: "在实验室，阳光正好，你心情不错。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📝", t: "实验室的小插曲164", d: "在实验室，天气有点影响你的状态。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🍂", t: "实验室的小插曲165", d: "在实验室，你看到一个可以帮助别人的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "☀️", t: "实验室的小插曲166", d: "在实验室，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "实验室的小插曲167", d: "在实验室，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "实验室的小插曲168", d: "在实验室，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "实验室的小插曲169", d: "在实验室，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "实验室的小插曲170", d: "在实验室，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "实验室的小插曲171", d: "在实验室，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "实验室的小插曲172", d: "在实验室，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "实验室的小插曲173", d: "在实验室，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "实验室的小插曲174", d: "在实验室，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "实验室的小插曲175", d: "在实验室，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "实验室的小插曲176", d: "在实验室，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "实验室的小插曲177", d: "在实验室，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "实验室的小插曲178", d: "在实验室，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "实验室的小插曲179", d: "在实验室，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "实验室的小插曲180", d: "在实验室，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎵", t: "小卖部的小插曲181", d: "在小卖部，你想起还有一件没做完的事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🪞", t: "小卖部的小插曲182", d: "在小卖部，阳光正好，你心情不错。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📝", t: "小卖部的小插曲183", d: "在小卖部，天气有点影响你的状态。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🍂", t: "小卖部的小插曲184", d: "在小卖部，你看到一个可以帮助别人的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "☀️", t: "小卖部的小插曲185", d: "在小卖部，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "小卖部的小插曲186", d: "在小卖部，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "小卖部的小插曲187", d: "在小卖部，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "小卖部的小插曲188", d: "在小卖部，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "小卖部的小插曲189", d: "在小卖部，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "小卖部的小插曲190", d: "在小卖部，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "小卖部的小插曲191", d: "在小卖部，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "小卖部的小插曲192", d: "在小卖部，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "小卖部的小插曲193", d: "在小卖部，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "小卖部的小插曲194", d: "在小卖部，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "小卖部的小插曲195", d: "在小卖部，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "小卖部的小插曲196", d: "在小卖部，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "小卖部的小插曲197", d: "在小卖部，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "小卖部的小插曲198", d: "在小卖部，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "小卖部的小插曲199", d: "在小卖部，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "小卖部的小插曲200", d: "在小卖部，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🪞", t: "音乐教室的小插曲201", d: "在音乐教室，阳光正好，你心情不错。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📝", t: "音乐教室的小插曲202", d: "在音乐教室，天气有点影响你的状态。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🍂", t: "音乐教室的小插曲203", d: "在音乐教室，你看到一个可以帮助别人的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "☀️", t: "音乐教室的小插曲204", d: "在音乐教室，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "音乐教室的小插曲205", d: "在音乐教室，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "音乐教室的小插曲206", d: "在音乐教室，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "音乐教室的小插曲207", d: "在音乐教室，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "音乐教室的小插曲208", d: "在音乐教室，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "音乐教室的小插曲209", d: "在音乐教室，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "音乐教室的小插曲210", d: "在音乐教室，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "音乐教室的小插曲211", d: "在音乐教室，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "音乐教室的小插曲212", d: "在音乐教室，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "音乐教室的小插曲213", d: "在音乐教室，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "音乐教室的小插曲214", d: "在音乐教室，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "音乐教室的小插曲215", d: "在音乐教室，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "音乐教室的小插曲216", d: "在音乐教室，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "音乐教室的小插曲217", d: "在音乐教室，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "音乐教室的小插曲218", d: "在音乐教室，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "音乐教室的小插曲219", d: "在音乐教室，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "音乐教室的小插曲220", d: "在音乐教室，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📝", t: "操场看台的小插曲221", d: "在操场看台，天气有点影响你的状态。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🍂", t: "操场看台的小插曲222", d: "在操场看台，你看到一个可以帮助别人的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "☀️", t: "操场看台的小插曲223", d: "在操场看台，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "操场看台的小插曲224", d: "在操场看台，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "操场看台的小插曲225", d: "在操场看台，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "操场看台的小插曲226", d: "在操场看台，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "操场看台的小插曲227", d: "在操场看台，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "操场看台的小插曲228", d: "在操场看台，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "操场看台的小插曲229", d: "在操场看台，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "操场看台的小插曲230", d: "在操场看台，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "操场看台的小插曲231", d: "在操场看台，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "操场看台的小插曲232", d: "在操场看台，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "操场看台的小插曲233", d: "在操场看台，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "操场看台的小插曲234", d: "在操场看台，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "操场看台的小插曲235", d: "在操场看台，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "操场看台的小插曲236", d: "在操场看台，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "操场看台的小插曲237", d: "在操场看台，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "操场看台的小插曲238", d: "在操场看台，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "操场看台的小插曲239", d: "在操场看台，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "操场看台的小插曲240", d: "在操场看台，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🍂", t: "花坛边的小插曲241", d: "在花坛边，你看到一个可以帮助别人的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "☀️", t: "花坛边的小插曲242", d: "在花坛边，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "花坛边的小插曲243", d: "在花坛边，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "花坛边的小插曲244", d: "在花坛边，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "花坛边的小插曲245", d: "在花坛边，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "花坛边的小插曲246", d: "在花坛边，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "花坛边的小插曲247", d: "在花坛边，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "花坛边的小插曲248", d: "在花坛边，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "花坛边的小插曲249", d: "在花坛边，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "花坛边的小插曲250", d: "在花坛边，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "花坛边的小插曲251", d: "在花坛边，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "花坛边的小插曲252", d: "在花坛边，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "花坛边的小插曲253", d: "在花坛边，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "花坛边的小插曲254", d: "在花坛边，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "花坛边的小插曲255", d: "在花坛边，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "花坛边的小插曲256", d: "在花坛边，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "花坛边的小插曲257", d: "在花坛边，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "花坛边的小插曲258", d: "在花坛边，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "花坛边的小插曲259", d: "在花坛边，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "花坛边的小插曲260", d: "在花坛边，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "☀️", t: "教学楼大厅的小插曲261", d: "在教学楼大厅，你遇到一件新鲜的小事。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌙", t: "教学楼大厅的小插曲262", d: "在教学楼大厅，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "教学楼大厅的小插曲263", d: "在教学楼大厅，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "教学楼大厅的小插曲264", d: "在教学楼大厅，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "教学楼大厅的小插曲265", d: "在教学楼大厅，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "教学楼大厅的小插曲266", d: "在教学楼大厅，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "教学楼大厅的小插曲267", d: "在教学楼大厅，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "教学楼大厅的小插曲268", d: "在教学楼大厅，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "教学楼大厅的小插曲269", d: "在教学楼大厅，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "教学楼大厅的小插曲270", d: "在教学楼大厅，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "教学楼大厅的小插曲271", d: "在教学楼大厅，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "教学楼大厅的小插曲272", d: "在教学楼大厅，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "教学楼大厅的小插曲273", d: "在教学楼大厅，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "教学楼大厅的小插曲274", d: "在教学楼大厅，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "教学楼大厅的小插曲275", d: "在教学楼大厅，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "教学楼大厅的小插曲276", d: "在教学楼大厅，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "教学楼大厅的小插曲277", d: "在教学楼大厅，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "教学楼大厅的小插曲278", d: "在教学楼大厅，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "教学楼大厅的小插曲279", d: "在教学楼大厅，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "教学楼大厅的小插曲280", d: "在教学楼大厅，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🌙", t: "自习室的小插曲281", d: "在自习室，课间很短，你想做点什么。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧋", t: "自习室的小插曲282", d: "在自习室，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "自习室的小插曲283", d: "在自习室，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "自习室的小插曲284", d: "在自习室，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "自习室的小插曲285", d: "在自习室，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "自习室的小插曲286", d: "在自习室，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "自习室的小插曲287", d: "在自习室，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "自习室的小插曲288", d: "在自习室，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "自习室的小插曲289", d: "在自习室，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "自习室的小插曲290", d: "在自习室，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "自习室的小插曲291", d: "在自习室，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "自习室的小插曲292", d: "在自习室，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "自习室的小插曲293", d: "在自习室，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "自习室的小插曲294", d: "在自习室，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "自习室的小插曲295", d: "在自习室，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "自习室的小插曲296", d: "在自习室，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "自习室的小插曲297", d: "在自习室，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "自习室的小插曲298", d: "在自习室，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "自习室的小插曲299", d: "在自习室，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "自习室的小插曲300", d: "在自习室，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🧋", t: "医务室的小插曲301", d: "在医务室，自习时你有点走神。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🖊️", t: "医务室的小插曲302", d: "在医务室，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "医务室的小插曲303", d: "在医务室，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "医务室的小插曲304", d: "在医务室，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "医务室的小插曲305", d: "在医务室，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "医务室的小插曲306", d: "在医务室，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "医务室的小插曲307", d: "在医务室，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "医务室的小插曲308", d: "在医务室，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "医务室的小插曲309", d: "在医务室，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "医务室的小插曲310", d: "在医务室，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "医务室的小插曲311", d: "在医务室，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "医务室的小插曲312", d: "在医务室，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "医务室的小插曲313", d: "在医务室，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "医务室的小插曲314", d: "在医务室，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "医务室的小插曲315", d: "在医务室，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "医务室的小插曲316", d: "在医务室，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "医务室的小插曲317", d: "在医务室，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "医务室的小插曲318", d: "在医务室，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "医务室的小插曲319", d: "在医务室，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "医务室的小插曲320", d: "在医务室，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🖊️", t: "自行车棚的小插曲321", d: "在自行车棚，你想给自己一点奖励。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎨", t: "自行车棚的小插曲322", d: "在自行车棚，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "自行车棚的小插曲323", d: "在自行车棚，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "自行车棚的小插曲324", d: "在自行车棚，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "自行车棚的小插曲325", d: "在自行车棚，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "自行车棚的小插曲326", d: "在自行车棚，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "自行车棚的小插曲327", d: "在自行车棚，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "自行车棚的小插曲328", d: "在自行车棚，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "自行车棚的小插曲329", d: "在自行车棚，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "自行车棚的小插曲330", d: "在自行车棚，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "自行车棚的小插曲331", d: "在自行车棚，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "自行车棚的小插曲332", d: "在自行车棚，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "自行车棚的小插曲333", d: "在自行车棚，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "自行车棚的小插曲334", d: "在自行车棚，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "自行车棚的小插曲335", d: "在自行车棚，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "自行车棚的小插曲336", d: "在自行车棚，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "自行车棚的小插曲337", d: "在自行车棚，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "自行车棚的小插曲338", d: "在自行车棚，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "自行车棚的小插曲339", d: "在自行车棚，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "自行车棚的小插曲340", d: "在自行车棚，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎨", t: "广播室的小插曲341", d: "在广播室，你需要打起精神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🐱", t: "广播室的小插曲342", d: "在广播室，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "广播室的小插曲343", d: "在广播室，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "广播室的小插曲344", d: "在广播室，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "广播室的小插曲345", d: "在广播室，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "广播室的小插曲346", d: "在广播室，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "广播室的小插曲347", d: "在广播室，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "广播室的小插曲348", d: "在广播室，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "广播室的小插曲349", d: "在广播室，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "广播室的小插曲350", d: "在广播室，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "广播室的小插曲351", d: "在广播室，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "广播室的小插曲352", d: "在广播室，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "广播室的小插曲353", d: "在广播室，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "广播室的小插曲354", d: "在广播室，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "广播室的小插曲355", d: "在广播室，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "广播室的小插曲356", d: "在广播室，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "广播室的小插曲357", d: "在广播室，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "广播室的小插曲358", d: "在广播室，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "广播室的小插曲359", d: "在广播室，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪞", t: "广播室的小插曲360", d: "在广播室，你想给自己一点奖励。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🐱", t: "美术教室的小插曲361", d: "在美术教室，你发现了一个可以提升自己的机会。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🚌", t: "美术教室的小插曲362", d: "在美术教室，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "美术教室的小插曲363", d: "在美术教室，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "美术教室的小插曲364", d: "在美术教室，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "美术教室的小插曲365", d: "在美术教室，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "美术教室的小插曲366", d: "在美术教室，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "美术教室的小插曲367", d: "在美术教室，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "美术教室的小插曲368", d: "在美术教室，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "美术教室的小插曲369", d: "在美术教室，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "美术教室的小插曲370", d: "在美术教室，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "美术教室的小插曲371", d: "在美术教室，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "美术教室的小插曲372", d: "在美术教室，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "美术教室的小插曲373", d: "在美术教室，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "美术教室的小插曲374", d: "在美术教室，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "美术教室的小插曲375", d: "在美术教室，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "美术教室的小插曲376", d: "在美术教室，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "美术教室的小插曲377", d: "在美术教室，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "美术教室的小插曲378", d: "在美术教室，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪞", t: "美术教室的小插曲379", d: "在美术教室，你想给自己一点奖励。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📝", t: "美术教室的小插曲380", d: "在美术教室，你需要打起精神。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🚌", t: "天台门口的小插曲381", d: "在天台门口，你被一个问题困扰着。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🧹", t: "天台门口的小插曲382", d: "在天台门口，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "天台门口的小插曲383", d: "在天台门口，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "天台门口的小插曲384", d: "在天台门口，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "天台门口的小插曲385", d: "在天台门口，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "天台门口的小插曲386", d: "在天台门口，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "天台门口的小插曲387", d: "在天台门口，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "天台门口的小插曲388", d: "在天台门口，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "天台门口的小插曲389", d: "在天台门口，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "天台门口的小插曲390", d: "在天台门口，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "天台门口的小插曲391", d: "在天台门口，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "天台门口的小插曲392", d: "在天台门口，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "天台门口的小插曲393", d: "在天台门口，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "天台门口的小插曲394", d: "在天台门口，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "天台门口的小插曲395", d: "在天台门口，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "天台门口的小插曲396", d: "在天台门口，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "天台门口的小插曲397", d: "在天台门口，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪞", t: "天台门口的小插曲398", d: "在天台门口，你想给自己一点奖励。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📝", t: "天台门口的小插曲399", d: "在天台门口，你需要打起精神。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🍂", t: "天台门口的小插曲400", d: "在天台门口，你发现了一个可以提升自己的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🧹", t: "琴房的小插曲401", d: "在琴房，你遇到一件需要选择的小事。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📮", t: "琴房的小插曲402", d: "在琴房，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "琴房的小插曲403", d: "在琴房，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "琴房的小插曲404", d: "在琴房，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "琴房的小插曲405", d: "在琴房，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "琴房的小插曲406", d: "在琴房，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "琴房的小插曲407", d: "在琴房，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "琴房的小插曲408", d: "在琴房，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "琴房的小插曲409", d: "在琴房，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "琴房的小插曲410", d: "在琴房，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "琴房的小插曲411", d: "在琴房，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "琴房的小插曲412", d: "在琴房，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "琴房的小插曲413", d: "在琴房，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "琴房的小插曲414", d: "在琴房，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "琴房的小插曲415", d: "在琴房，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "琴房的小插曲416", d: "在琴房，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪞", t: "琴房的小插曲417", d: "在琴房，你想给自己一点奖励。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📝", t: "琴房的小插曲418", d: "在琴房，你需要打起精神。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🍂", t: "琴房的小插曲419", d: "在琴房，你发现了一个可以提升自己的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "☀️", t: "琴房的小插曲420", d: "在琴房，你被一个问题困扰着。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "📮", t: "多功能厅的小插曲421", d: "在多功能厅，时间有点零碎，你在想怎么安排。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🎯", t: "多功能厅的小插曲422", d: "在多功能厅，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "多功能厅的小插曲423", d: "在多功能厅，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "多功能厅的小插曲424", d: "在多功能厅，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "多功能厅的小插曲425", d: "在多功能厅，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "多功能厅的小插曲426", d: "在多功能厅，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "多功能厅的小插曲427", d: "在多功能厅，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "多功能厅的小插曲428", d: "在多功能厅，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "多功能厅的小插曲429", d: "在多功能厅，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "多功能厅的小插曲430", d: "在多功能厅，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "多功能厅的小插曲431", d: "在多功能厅，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "多功能厅的小插曲432", d: "在多功能厅，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "多功能厅的小插曲433", d: "在多功能厅，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "多功能厅的小插曲434", d: "在多功能厅，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "多功能厅的小插曲435", d: "在多功能厅，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪞", t: "多功能厅的小插曲436", d: "在多功能厅，你想给自己一点奖励。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📝", t: "多功能厅的小插曲437", d: "在多功能厅，你需要打起精神。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🍂", t: "多功能厅的小插曲438", d: "在多功能厅，你发现了一个可以提升自己的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "☀️", t: "多功能厅的小插曲439", d: "在多功能厅，你被一个问题困扰着。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌙", t: "多功能厅的小插曲440", d: "在多功能厅，你遇到一件需要选择的小事。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🎯", t: "心理咨询室的小插曲441", d: "在心理咨询室，周围的同学都在忙碌。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "💡", t: "心理咨询室的小插曲442", d: "在心理咨询室，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "心理咨询室的小插曲443", d: "在心理咨询室，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "心理咨询室的小插曲444", d: "在心理咨询室，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "心理咨询室的小插曲445", d: "在心理咨询室，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "心理咨询室的小插曲446", d: "在心理咨询室，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "心理咨询室的小插曲447", d: "在心理咨询室，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "心理咨询室的小插曲448", d: "在心理咨询室，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "心理咨询室的小插曲449", d: "在心理咨询室，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "心理咨询室的小插曲450", d: "在心理咨询室，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "心理咨询室的小插曲451", d: "在心理咨询室，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "心理咨询室的小插曲452", d: "在心理咨询室，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "心理咨询室的小插曲453", d: "在心理咨询室，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "心理咨询室的小插曲454", d: "在心理咨询室，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪞", t: "心理咨询室的小插曲455", d: "在心理咨询室，你想给自己一点奖励。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📝", t: "心理咨询室的小插曲456", d: "在心理咨询室，你需要打起精神。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🍂", t: "心理咨询室的小插曲457", d: "在心理咨询室，你发现了一个可以提升自己的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "☀️", t: "心理咨询室的小插曲458", d: "在心理咨询室，你被一个问题困扰着。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌙", t: "心理咨询室的小插曲459", d: "在心理咨询室，你遇到一件需要选择的小事。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🧋", t: "心理咨询室的小插曲460", d: "在心理咨询室，时间有点零碎，你在想怎么安排。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "💡", t: "信息机房的小插曲461", d: "在信息机房，你注意到一个容易被忽略的细节。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪴", t: "信息机房的小插曲462", d: "在信息机房，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "信息机房的小插曲463", d: "在信息机房，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "信息机房的小插曲464", d: "在信息机房，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "信息机房的小插曲465", d: "在信息机房，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "信息机房的小插曲466", d: "在信息机房，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "信息机房的小插曲467", d: "在信息机房，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "信息机房的小插曲468", d: "在信息机房，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "信息机房的小插曲469", d: "在信息机房，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "信息机房的小插曲470", d: "在信息机房，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "信息机房的小插曲471", d: "在信息机房，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "信息机房的小插曲472", d: "在信息机房，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "信息机房的小插曲473", d: "在信息机房，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪞", t: "信息机房的小插曲474", d: "在信息机房，你想给自己一点奖励。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📝", t: "信息机房的小插曲475", d: "在信息机房，你需要打起精神。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🍂", t: "信息机房的小插曲476", d: "在信息机房，你发现了一个可以提升自己的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "☀️", t: "信息机房的小插曲477", d: "在信息机房，你被一个问题困扰着。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌙", t: "信息机房的小插曲478", d: "在信息机房，你遇到一件需要选择的小事。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🧋", t: "信息机房的小插曲479", d: "在信息机房，时间有点零碎，你在想怎么安排。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🖊️", t: "信息机房的小插曲480", d: "在信息机房，周围的同学都在忙碌。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🪴", t: "操场跑道的小插曲481", d: "在操场跑道，眼前的氛围让你有点想偷懒。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📋", t: "操场跑道的小插曲482", d: "在操场跑道，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "操场跑道的小插曲483", d: "在操场跑道，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "操场跑道的小插曲484", d: "在操场跑道，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "操场跑道的小插曲485", d: "在操场跑道，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "操场跑道的小插曲486", d: "在操场跑道，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "操场跑道的小插曲487", d: "在操场跑道，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "操场跑道的小插曲488", d: "在操场跑道，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "操场跑道的小插曲489", d: "在操场跑道，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "操场跑道的小插曲490", d: "在操场跑道，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "操场跑道的小插曲491", d: "在操场跑道，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "操场跑道的小插曲492", d: "在操场跑道，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪞", t: "操场跑道的小插曲493", d: "在操场跑道，你想给自己一点奖励。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📝", t: "操场跑道的小插曲494", d: "在操场跑道，你需要打起精神。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🍂", t: "操场跑道的小插曲495", d: "在操场跑道，你发现了一个可以提升自己的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "☀️", t: "操场跑道的小插曲496", d: "在操场跑道，你被一个问题困扰着。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌙", t: "操场跑道的小插曲497", d: "在操场跑道，你遇到一件需要选择的小事。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🧋", t: "操场跑道的小插曲498", d: "在操场跑道，时间有点零碎，你在想怎么安排。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🖊️", t: "操场跑道的小插曲499", d: "在操场跑道，周围的同学都在忙碌。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎨", t: "操场跑道的小插曲500", d: "在操场跑道，你注意到一个容易被忽略的细节。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "📋", t: "篮球场的小插曲501", d: "在篮球场，你有一小段可以自由支配的时间。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "📖", t: "篮球场的小插曲502", d: "在篮球场，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "篮球场的小插曲503", d: "在篮球场，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "篮球场的小插曲504", d: "在篮球场，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "篮球场的小插曲505", d: "在篮球场，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "篮球场的小插曲506", d: "在篮球场，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "篮球场的小插曲507", d: "在篮球场，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "篮球场的小插曲508", d: "在篮球场，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "篮球场的小插曲509", d: "在篮球场，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "篮球场的小插曲510", d: "在篮球场，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "篮球场的小插曲511", d: "在篮球场，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪞", t: "篮球场的小插曲512", d: "在篮球场，你想给自己一点奖励。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📝", t: "篮球场的小插曲513", d: "在篮球场，你需要打起精神。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🍂", t: "篮球场的小插曲514", d: "在篮球场，你发现了一个可以提升自己的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "☀️", t: "篮球场的小插曲515", d: "在篮球场，你被一个问题困扰着。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌙", t: "篮球场的小插曲516", d: "在篮球场，你遇到一件需要选择的小事。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🧋", t: "篮球场的小插曲517", d: "在篮球场，时间有点零碎，你在想怎么安排。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🖊️", t: "篮球场的小插曲518", d: "在篮球场，周围的同学都在忙碌。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎨", t: "篮球场的小插曲519", d: "在篮球场，你注意到一个容易被忽略的细节。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🐱", t: "篮球场的小插曲520", d: "在篮球场，眼前的氛围让你有点想偷懒。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📖", t: "乒乓球台的小插曲521", d: "在乒乓球台，一个小麻烦忽然冒了出来。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "✏️", t: "乒乓球台的小插曲522", d: "在乒乓球台，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "乒乓球台的小插曲523", d: "在乒乓球台，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "乒乓球台的小插曲524", d: "在乒乓球台，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "乒乓球台的小插曲525", d: "在乒乓球台，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "乒乓球台的小插曲526", d: "在乒乓球台，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "乒乓球台的小插曲527", d: "在乒乓球台，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "乒乓球台的小插曲528", d: "在乒乓球台，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "乒乓球台的小插曲529", d: "在乒乓球台，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "乒乓球台的小插曲530", d: "在乒乓球台，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪞", t: "乒乓球台的小插曲531", d: "在乒乓球台，你想给自己一点奖励。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📝", t: "乒乓球台的小插曲532", d: "在乒乓球台，你需要打起精神。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🍂", t: "乒乓球台的小插曲533", d: "在乒乓球台，你发现了一个可以提升自己的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "☀️", t: "乒乓球台的小插曲534", d: "在乒乓球台，你被一个问题困扰着。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌙", t: "乒乓球台的小插曲535", d: "在乒乓球台，你遇到一件需要选择的小事。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🧋", t: "乒乓球台的小插曲536", d: "在乒乓球台，时间有点零碎，你在想怎么安排。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🖊️", t: "乒乓球台的小插曲537", d: "在乒乓球台，周围的同学都在忙碌。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎨", t: "乒乓球台的小插曲538", d: "在乒乓球台，你注意到一个容易被忽略的细节。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🐱", t: "乒乓球台的小插曲539", d: "在乒乓球台，眼前的氛围让你有点想偷懒。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🚌", t: "乒乓球台的小插曲540", d: "在乒乓球台，你有一小段可以自由支配的时间。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "✏️", t: "饮水处的小插曲541", d: "在饮水处，你需要在学习和休息之间做个选择。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🏃", t: "饮水处的小插曲542", d: "在饮水处，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "饮水处的小插曲543", d: "在饮水处，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "饮水处的小插曲544", d: "在饮水处，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "饮水处的小插曲545", d: "在饮水处，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "饮水处的小插曲546", d: "在饮水处，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "饮水处的小插曲547", d: "在饮水处，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "饮水处的小插曲548", d: "在饮水处，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "饮水处的小插曲549", d: "在饮水处，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪞", t: "饮水处的小插曲550", d: "在饮水处，你想给自己一点奖励。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📝", t: "饮水处的小插曲551", d: "在饮水处，你需要打起精神。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🍂", t: "饮水处的小插曲552", d: "在饮水处，你发现了一个可以提升自己的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "☀️", t: "饮水处的小插曲553", d: "在饮水处，你被一个问题困扰着。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌙", t: "饮水处的小插曲554", d: "在饮水处，你遇到一件需要选择的小事。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🧋", t: "饮水处的小插曲555", d: "在饮水处，时间有点零碎，你在想怎么安排。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🖊️", t: "饮水处的小插曲556", d: "在饮水处，周围的同学都在忙碌。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎨", t: "饮水处的小插曲557", d: "在饮水处，你注意到一个容易被忽略的细节。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🐱", t: "饮水处的小插曲558", d: "在饮水处，眼前的氛围让你有点想偷懒。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🚌", t: "饮水处的小插曲559", d: "在饮水处，你有一小段可以自由支配的时间。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🧹", t: "饮水处的小插曲560", d: "在饮水处，一个小麻烦忽然冒了出来。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🏃", t: "失物招领处的小插曲561", d: "在失物招领处，身边的同学向你发出了邀请。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🍱", t: "失物招领处的小插曲562", d: "在失物招领处，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "失物招领处的小插曲563", d: "在失物招领处，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "失物招领处的小插曲564", d: "在失物招领处，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "失物招领处的小插曲565", d: "在失物招领处，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "失物招领处的小插曲566", d: "在失物招领处，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "失物招领处的小插曲567", d: "在失物招领处，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "失物招领处的小插曲568", d: "在失物招领处，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪞", t: "失物招领处的小插曲569", d: "在失物招领处，你想给自己一点奖励。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📝", t: "失物招领处的小插曲570", d: "在失物招领处，你需要打起精神。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🍂", t: "失物招领处的小插曲571", d: "在失物招领处，你发现了一个可以提升自己的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "☀️", t: "失物招领处的小插曲572", d: "在失物招领处，你被一个问题困扰着。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌙", t: "失物招领处的小插曲573", d: "在失物招领处，你遇到一件需要选择的小事。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🧋", t: "失物招领处的小插曲574", d: "在失物招领处，时间有点零碎，你在想怎么安排。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🖊️", t: "失物招领处的小插曲575", d: "在失物招领处，周围的同学都在忙碌。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎨", t: "失物招领处的小插曲576", d: "在失物招领处，你注意到一个容易被忽略的细节。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🐱", t: "失物招领处的小插曲577", d: "在失物招领处，眼前的氛围让你有点想偷懒。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🚌", t: "失物招领处的小插曲578", d: "在失物招领处，你有一小段可以自由支配的时间。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🧹", t: "失物招领处的小插曲579", d: "在失物招领处，一个小麻烦忽然冒了出来。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📮", t: "失物招领处的小插曲580", d: "在失物招领处，你需要在学习和休息之间做个选择。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🍱", t: "校园书店的小插曲581", d: "在校园书店，你想起还有一件没做完的事。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌧️", t: "校园书店的小插曲582", d: "在校园书店，阳光正好，你心情不错。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📱", t: "校园书店的小插曲583", d: "在校园书店，天气有点影响你的状态。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎒", t: "校园书店的小插曲584", d: "在校园书店，你看到一个可以帮助别人的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📚", t: "校园书店的小插曲585", d: "在校园书店，你遇到一件新鲜的小事。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🌿", t: "校园书店的小插曲586", d: "在校园书店，课间很短，你想做点什么。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎵", t: "校园书店的小插曲587", d: "在校园书店，自习时你有点走神。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🪞", t: "校园书店的小插曲588", d: "在校园书店，你想给自己一点奖励。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "📝", t: "校园书店的小插曲589", d: "在校园书店，你需要打起精神。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🍂", t: "校园书店的小插曲590", d: "在校园书店，你发现了一个可以提升自己的机会。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "☀️", t: "校园书店的小插曲591", d: "在校园书店，你被一个问题困扰着。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🌙", t: "校园书店的小插曲592", d: "在校园书店，你遇到一件需要选择的小事。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🧋", t: "校园书店的小插曲593", d: "在校园书店，时间有点零碎，你在想怎么安排。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🖊️", t: "校园书店的小插曲594", d: "在校园书店，周围的同学都在忙碌。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "🎨", t: "校园书店的小插曲595", d: "在校园书店，你注意到一个容易被忽略的细节。", o: [
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🐱", t: "校园书店的小插曲596", d: "在校园书店，眼前的氛围让你有点想偷懒。", o: [
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
    { ic: "🚌", t: "校园书店的小插曲597", d: "在校园书店，你有一小段可以自由支配的时间。", o: [
      { l: "趁机会活动一下身体", r: "你舒展筋骨，整个人都清爽了。", fx: {health:2,mood:1} },
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "先发个朋友圈记录一下", r: "你记录下这个小瞬间，收获了点赞。", fx: {mood:2,social:1} }
    ]},
    { ic: "🧹", t: "校园书店的小插曲598", d: "在校园书店，一个小麻烦忽然冒了出来。", o: [
      { l: "和身边的人聊几句", r: "你们聊得很开心，关系近了一点。", fx: {social:2,mood:2} },
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "去买点吃的", r: "一点小零食让你开心起来。", fx: {mood:2,money:-3} }
    ]},
    { ic: "📮", t: "校园书店的小插曲599", d: "在校园书店，你需要在学习和休息之间做个选择。", o: [
      { l: "把东西整理得井井有条", r: "环境清爽了，心情也跟着好起来。", fx: {mood:2} },
      { l: "主动帮同学一把", r: "你伸出援手，对方真诚地说了谢谢。", fx: {social:2,mood:1} },
      { l: "戴上耳机听首歌", r: "熟悉的旋律让你平静下来。", fx: {mood:2} }
    ]},
    { ic: "🎯", t: "校园书店的小插曲600", d: "在校园书店，身边的同学向你发出了邀请。", o: [
      { l: "认真把眼前的事做完", r: "你沉下心来，把这件事做得很扎实。", fx: {knowledge:2,mood:1} },
      { l: "保持专注，不受打扰", r: "你专注了一段时间，效率很高。", fx: {knowledge:2} },
      { l: "让自己放松一小会儿", r: "你短暂休息，状态恢复了不少。", fx: {health:1,mood:2} }
    ]},
  ];
  var CHAT = [
    { kw: "作业", r: [
      "作业不会写？先把课本例题过一遍，再动笔会快很多。",
      "把作业拆成几块，一块一块完成，别一口气盯着整座山。",
      "先做最难的那项，后面会越做越轻松。",
      "实在卡住就先标记，明天问老师或同学。",
    ]},
    { kw: "考试", r: [
      "考试只是检验，不是判决，把它当一次查漏补缺。",
      "考前回归错题本，比刷新题更有效。",
      "深呼吸，先把会做的稳稳拿到手。",
      "一次成绩不能定义你，进步才是关键。",
    ]},
    { kw: "成绩", r: [
      "关注自己的进步，比盯着排名更有用。",
      "找到丢分的原因，下次就能把它拿回来。",
      "考好了别骄傲，考差了别灰心，都是过程。",
      "把错题弄懂，成绩自然会慢慢变好。",
    ]},
    { kw: "累", r: [
      "累了就允许自己歇一会儿，别硬撑。",
      "试试闭目深呼吸一分钟，会好一些。",
      "今晚早点睡，明天效率会更高。",
      "适当运动和热水，都能缓解疲惫。",
    ]},
    { kw: "烦", r: [
      "烦躁的时候，先把烦心事写下来，会清楚很多。",
      "出去走走，吹吹风，情绪会慢慢平复。",
      "一次只解决一件事，别让它们堆在一起。",
      "如果一直难受，记得找心理老师聊聊。",
    ]},
    { kw: "喜欢", r: [
      "喜欢一个人很正常，认真对待，也别丢掉自己。",
      "把喜欢变成让自己变更好的动力。",
      "真诚和尊重，永远最重要。",
      "在合适的年纪，先成为更好的自己。",
    ]},
    { kw: "表白", r: [
      "表白前先想清楚自己想要什么，也要尊重对方的回答。",
      "真诚最重要，不必刻意模仿别人。",
      "无论结果如何，勇敢表达的你都很了不起。",
      "给彼此一点空间，别让对方为难。",
    ]},
    { kw: "朋友", r: [
      "好朋友是能一起进步的人。",
      "有矛盾很正常，真诚沟通往往能解开。",
      "真心换真心，关系需要用心维护。",
      "学会倾听，比会说更重要。",
    ]},
    { kw: "想家", r: [
      "想家的时候给家人打个电话吧。",
      "照顾好自己，也是对家人最好的交代。",
      "宿舍和同学也会慢慢成为你的另一种依靠。",
      "周末回家好好吃一顿家里的饭。",
    ]},
    { kw: "午饭", r: [
      "今天想吃什么？别总吃重样的，注意营养。",
      "饭后别立刻剧烈运动，歇一会儿。",
      "多喝水，少喝太甜的饮料。",
      "食堂的热汤很暖胃。",
    ]},
    { kw: "睡觉", r: [
      "睡眠充足，记忆力和心情都会更好。",
      "睡前别刷太久手机，定个时间放下它。",
      "午休十分钟，下午会精神很多。",
      "熬夜的代价，往往是第二天一整天。",
    ]},
    { kw: "运动", r: [
      "动起来，身体和心情都会变好。",
      "运动前热身，避免受伤。",
      "和朋友一起运动更容易坚持。",
      "哪怕是快走十分钟，也比久坐强。",
    ]},
    { kw: "背单词", r: [
      "少量多次，比一次性背很多记得牢。",
      "放在句子里记，更容易记住用法。",
      "利用排队、等车的碎片时间。",
      "今天背、明天复习，别让它溜走。",
    ]},
    { kw: "数学", r: [
      "数学别急，先把概念和公式搞懂。",
      "几何多画辅助线，代数多观察结构。",
      "错题要分类，知道自己错在哪。",
      "算不出来时，回到定义想想。",
    ]},
    { kw: "语文", r: [
      "语文靠积累，每天读一点、写一点。",
      "作文素材要平时攒，临时抱佛脚没用。",
      "阅读题先抓主旨，再看细节。",
      "默写的分一定要拿稳。",
    ]},
    { kw: "英语", r: [
      "英语要开口，别害怕说错。",
      "每天保持阅读，语感会慢慢建立。",
      "作文背几个好用的连接词和句型。",
      "听力可以反复听，先抓大意。",
    ]},
    { kw: "物理", r: [
      "物理先画受力图或电路图。",
      "公式要记成立条件，别乱套。",
      "把生活现象和物理模型对应起来。",
      "计算题步骤写清楚。",
    ]},
    { kw: "化学", r: [
      "化学方程式要配平、写条件。",
      "结合实验现象记性质更牢。",
      "物质的量是核心概念。",
      "常见沉淀和气体要记清。",
    ]},
    { kw: "天气", r: [
      "变天记得增减衣服，别感冒。",
      "下雨天记得带伞，路滑小心。",
      "天气好就多去室外走走。",
      "雾天骑车慢一点。",
    ]},
    { kw: "运动会", r: [
      "运动会重在参与，开心最重要。",
      "赛前热身，赛后放松补水。",
      "接力交接要提前练，别掉棒。",
      "为班级加油也是一种参与。",
    ]},
    { kw: "生日", r: [
      "生日快乐呀，记得对自己好一点。",
      "一句真诚的祝福，比贵重礼物更动人。",
      "可以给自己买个小蛋糕。",
      "新的一岁，继续成为更好的自己。",
    ]},
    { kw: "加油", r: [
      "加油呀，你比自己想象的更有力量。",
      "你已经很努力了，再坚持一下。",
      "我在为你打气，别放弃。",
      "慢慢来，你会到达的。",
    ]},
    { kw: "你好", r: [
      "你好呀，今天过得怎么样？",
      "嗨，又见面啦。",
      "你好！有什么想聊的吗？",
      "见到你真好。",
    ]},
    { kw: "再见", r: [
      "再见，照顾好自己。",
      "下节课见啦。",
      "拜拜，记得早点睡。",
      "回见，加油。",
    ]},
    { kw: "谢谢", r: [
      "不客气，互相帮助嘛。",
      "小事一桩，别客气。",
      "能帮上忙我也很开心。",
      "以后有事尽管说。",
    ]},
    { kw: "吃饭", r: [
      "好好吃饭，别用零食代替正餐。",
      "细嚼慢咽，对身体好。",
      "均衡饮食，蔬菜也要吃。",
      "规律三餐，学习才有力气。",
    ]},
    { kw: "游戏", r: [
      "游戏放松一下可以，但要控制时间。",
      "先把作业完成，再安心玩。",
      "和朋友开黑很快乐，但别熬夜。",
      "玩够了就去休息，明天还要上课。",
    ]},
    { kw: "朋友圈", r: [
      "想发就发，记录生活很美好。",
      "真诚的动态最打动人。",
      "记得给朋友点个赞、留句评论。",
      "少一点比较，多一点真实。",
    ]},
    { kw: "社团", r: [
      "社团能让你找到志同道合的朋友。",
      "选择真正喜欢的，坚持下去。",
      "在社团里锻炼一项技能。",
      "别让社团影响学习，平衡好时间。",
    ]},
    { kw: "梦想", r: [
      "有梦想的人，眼睛里是有光的。",
      "把大梦想拆成小目标，一步一步走。",
      "别怕别人怎么看，去追就好。",
      "心之所向，素履以往。",
    ]},
    { kw: "早", r: [
      "早上好，新的一天开始啦。",
      "吃个热乎的早餐，元气满满。",
      "早自习精神点，今天也要加油。",
      "早起的感觉其实很清醒。",
    ]},
    { kw: "晚", r: [
      "晚上好，今天辛苦啦。",
      "晚自习后别刷太久手机。",
      "睡前把明天要带的东西收拾好。",
      "晚安，愿你好梦。",
    ]},
  ];
  var MOODS = [
  { who: "林晚", ic: "🌸", t: "今天的天空很蓝，蓝到让人想把书合上，去操场跑一圈。", img: [], c: 4 },
  { who: "赵小雨", ic: "📚", t: "认真写完一套卷子的感觉，比玩什么都踏实。", img: [], c: 11 },
  { who: "苏清颜", ic: "🌅", t: "课间趴在桌上，听着教室的喧闹，莫名觉得很安心。", img: [], c: 18 },
  { who: "许念", ic: "🍜", t: "食堂的热汤，是初冬最治愈的东西。", img: [], c: 25 },
  { who: "班长", ic: "📝", t: "把错题整理完，忽然觉得自己又能再战三百回合。", img: [], c: 32 },
  { who: "同桌", ic: "🤝", t: "和朋友并肩走在放学路上，连风都是甜的。", img: [], c: 39 },
  { who: "室友阿杰", ic: "🌙", t: "晚自习的灯亮着，大家都在努力，我也不能掉队。", img: [], c: 46 },
  { who: "室友小宇", ic: "✏️", t: "今天被老师夸了，开心了一整节课。", img: [], c: 53 },
  { who: "学习委员", ic: "🏃", t: "早起的操场上只有我和朝阳，这种感觉很珍贵。", img: [], c: 60 },
  { who: "体育委员", ic: "🍂", t: "捡到一片好看的落叶，夹进了课本里。", img: [], c: 67 },
  { who: "宣传委员", ic: "🐱", t: "校园里的猫又来蹭我了，今天的火腿肠没白买。", img: [], c: 74 },
  { who: "高一新生", ic: "💡", t: "终于把那道难题解出来了，那种快乐谁懂啊。", img: [], c: 81 },
  { who: "高三学长", ic: "🎤", t: "合唱排练跑调了，但大家都笑得很开心。", img: [], c: 88 },
  { who: "走读生", ic: "🧪", t: "实验终于成功了，和组员击掌的瞬间很燃。", img: [], c: 5 },
  { who: "住校生", ic: "📣", t: "运动会的呐喊声，现在想起来还热血沸腾。", img: [], c: 12 },
  { who: "课代表", ic: "📖", t: "图书馆靠窗的位置，今天轮到我了。", img: [], c: 19 },
  { who: "天文社", ic: "🌕", t: "晚自习回宿舍的路，月亮很圆。", img: [], c: 26 },
  { who: "美术课代表", ic: "⏰", t: "新的一周，立个 flag：不迟到。", img: [], c: 33 },
  { who: "书法社", ic: "📒", t: "被同学的笔记惊到了，太工整了。", img: [], c: 40 },
  { who: "长跑爱好者", ic: "🌧️", t: "下雨天的教室，特别适合安静地读书。", img: [], c: 47 },
  { who: "林晚", ic: "🌇", t: "今天的晚霞是橘粉色的，像打翻了颜料盘。", img: [], c: 54 },
  { who: "赵小雨", ic: "🔤", t: "坚持背单词的第 N 天，给自己点个赞。", img: [], c: 61 },
  { who: "苏清颜", ic: "✏️", t: "原来认真听一节课，真的会收获很多。", img: [], c: 68 },
  { who: "许念", ic: "🛏️", t: "宿舍卧谈会聊到很晚，话题从天南到海北。", img: [], c: 75 },
  { who: "班长", ic: "🧭", t: "和老师聊完，迷茫少了一点，方向清楚了一点。", img: [], c: 82 },
  { who: "同桌", ic: "🤝", t: "帮同学讲懂一道题，比自己做对还开心。", img: [], c: 89 },
  { who: "室友阿杰", ic: "🎵", t: "课间的一首歌，让整个下午都变好了。", img: [], c: 6 },
  { who: "室友小宇", ic: "🪴", t: "把窗台的绿植浇了水，它又长出了新叶。", img: [], c: 13 },
  { who: "学习委员", ic: "🏃", t: "今天的体育课，跑赢了上一次的自己。", img: [], c: 20 },
  { who: "体育委员", ic: "🥛", t: "在小卖部偶遇朋友，顺手请了瓶水。", img: [], c: 27 },
  { who: "宣传委员", ic: "💌", t: "晨读的声音此起彼伏，这就是青春吧。", img: [], c: 34 },
  { who: "高一新生", ic: "📐", t: "黑板上的板书被擦干净了，新的一天又开始了。", img: [], c: 41 },
  { who: "高三学长", ic: "🌧️", t: "放学时的广播里放了我最喜欢的歌。", img: [], c: 48 },
  { who: "走读生", ic: "🎶", t: "认真完成了值日，教室干净得发亮。", img: [], c: 55 },
  { who: "住校生", ic: "🧹", t: "社团活动结束时，天都快黑了，但很满足。", img: [], c: 62 },
  { who: "课代表", ic: "🎭", t: "今天的早餐是热豆浆和肉松面包，幸福。", img: [], c: 69 },
  { who: "天文社", ic: "🥖", t: "收到同学写的感谢小纸条，心都软了。", img: [], c: 76 },
  { who: "美术课代表", ic: "📮", t: "和同桌一起攻克了一道难题，默契十足。", img: [], c: 83 },
  { who: "书法社", ic: "📚", t: "雨后的操场有泥土的味道，很清新。", img: [], c: 90 },
  { who: "长跑爱好者", ic: "🌦️", t: "把喜欢的话写在了笔记本扉页上。", img: [], c: 7 },
  { who: "林晚", ic: "🌸", t: "今天的天空很蓝，蓝到让人想把书合上，去操场跑一圈。", img: [], c: 14 },
  { who: "赵小雨", ic: "📚", t: "认真写完一套卷子的感觉，比玩什么都踏实。", img: [], c: 21 },
  { who: "苏清颜", ic: "🌅", t: "课间趴在桌上，听着教室的喧闹，莫名觉得很安心。", img: [], c: 28 },
  { who: "许念", ic: "🍜", t: "食堂的热汤，是初冬最治愈的东西。", img: [], c: 35 },
  { who: "班长", ic: "📝", t: "把错题整理完，忽然觉得自己又能再战三百回合。", img: [], c: 42 },
  { who: "同桌", ic: "🤝", t: "和朋友并肩走在放学路上，连风都是甜的。", img: [], c: 49 },
  { who: "室友阿杰", ic: "🌙", t: "晚自习的灯亮着，大家都在努力，我也不能掉队。", img: [], c: 56 },
  { who: "室友小宇", ic: "✏️", t: "今天被老师夸了，开心了一整节课。", img: [], c: 63 },
  { who: "学习委员", ic: "🏃", t: "早起的操场上只有我和朝阳，这种感觉很珍贵。", img: [], c: 70 },
  { who: "体育委员", ic: "🍂", t: "捡到一片好看的落叶，夹进了课本里。", img: [], c: 77 },
  { who: "宣传委员", ic: "🐱", t: "校园里的猫又来蹭我了，今天的火腿肠没白买。", img: [], c: 84 },
  { who: "高一新生", ic: "💡", t: "终于把那道难题解出来了，那种快乐谁懂啊。", img: [], c: 91 },
  { who: "高三学长", ic: "🎤", t: "合唱排练跑调了，但大家都笑得很开心。", img: [], c: 8 },
  { who: "走读生", ic: "🧪", t: "实验终于成功了，和组员击掌的瞬间很燃。", img: [], c: 15 },
  { who: "住校生", ic: "📣", t: "运动会的呐喊声，现在想起来还热血沸腾。", img: [], c: 22 },
  { who: "课代表", ic: "📖", t: "图书馆靠窗的位置，今天轮到我了。", img: [], c: 29 },
  { who: "天文社", ic: "🌕", t: "晚自习回宿舍的路，月亮很圆。", img: [], c: 36 },
  { who: "美术课代表", ic: "⏰", t: "新的一周，立个 flag：不迟到。", img: [], c: 43 },
  { who: "书法社", ic: "📒", t: "被同学的笔记惊到了，太工整了。", img: [], c: 50 },
  { who: "长跑爱好者", ic: "🌧️", t: "下雨天的教室，特别适合安静地读书。", img: [], c: 57 },
  { who: "林晚", ic: "🌇", t: "今天的晚霞是橘粉色的，像打翻了颜料盘。", img: [], c: 64 },
  { who: "赵小雨", ic: "🔤", t: "坚持背单词的第 N 天，给自己点个赞。", img: [], c: 71 },
  { who: "苏清颜", ic: "✏️", t: "原来认真听一节课，真的会收获很多。", img: [], c: 78 },
  { who: "许念", ic: "🛏️", t: "宿舍卧谈会聊到很晚，话题从天南到海北。", img: [], c: 85 },
  { who: "班长", ic: "🧭", t: "和老师聊完，迷茫少了一点，方向清楚了一点。", img: [], c: 92 },
  { who: "同桌", ic: "🤝", t: "帮同学讲懂一道题，比自己做对还开心。", img: [], c: 9 },
  { who: "室友阿杰", ic: "🎵", t: "课间的一首歌，让整个下午都变好了。", img: [], c: 16 },
  { who: "室友小宇", ic: "🪴", t: "把窗台的绿植浇了水，它又长出了新叶。", img: [], c: 23 },
  { who: "学习委员", ic: "🏃", t: "今天的体育课，跑赢了上一次的自己。", img: [], c: 30 },
  { who: "体育委员", ic: "🥛", t: "在小卖部偶遇朋友，顺手请了瓶水。", img: [], c: 37 },
  { who: "宣传委员", ic: "💌", t: "晨读的声音此起彼伏，这就是青春吧。", img: [], c: 44 },
  { who: "高一新生", ic: "📐", t: "黑板上的板书被擦干净了，新的一天又开始了。", img: [], c: 51 },
  { who: "高三学长", ic: "🌧️", t: "放学时的广播里放了我最喜欢的歌。", img: [], c: 58 },
  { who: "走读生", ic: "🎶", t: "认真完成了值日，教室干净得发亮。", img: [], c: 65 },
  { who: "住校生", ic: "🧹", t: "社团活动结束时，天都快黑了，但很满足。", img: [], c: 72 },
  { who: "课代表", ic: "🎭", t: "今天的早餐是热豆浆和肉松面包，幸福。", img: [], c: 79 },
  { who: "天文社", ic: "🥖", t: "收到同学写的感谢小纸条，心都软了。", img: [], c: 86 },
  { who: "美术课代表", ic: "📮", t: "和同桌一起攻克了一道难题，默契十足。", img: [], c: 93 },
  { who: "书法社", ic: "📚", t: "雨后的操场有泥土的味道，很清新。", img: [], c: 10 },
  { who: "长跑爱好者", ic: "🌦️", t: "把喜欢的话写在了笔记本扉页上。", img: [], c: 17 },
  { who: "林晚", ic: "🌸", t: "今天的天空很蓝，蓝到让人想把书合上，去操场跑一圈。", img: [], c: 24 },
  { who: "赵小雨", ic: "📚", t: "认真写完一套卷子的感觉，比玩什么都踏实。", img: [], c: 31 },
  { who: "苏清颜", ic: "🌅", t: "课间趴在桌上，听着教室的喧闹，莫名觉得很安心。", img: [], c: 38 },
  { who: "许念", ic: "🍜", t: "食堂的热汤，是初冬最治愈的东西。", img: [], c: 45 },
  { who: "班长", ic: "📝", t: "把错题整理完，忽然觉得自己又能再战三百回合。", img: [], c: 52 },
  { who: "同桌", ic: "🤝", t: "和朋友并肩走在放学路上，连风都是甜的。", img: [], c: 59 },
  { who: "室友阿杰", ic: "🌙", t: "晚自习的灯亮着，大家都在努力，我也不能掉队。", img: [], c: 66 },
  { who: "室友小宇", ic: "✏️", t: "今天被老师夸了，开心了一整节课。", img: [], c: 73 },
  { who: "学习委员", ic: "🏃", t: "早起的操场上只有我和朝阳，这种感觉很珍贵。", img: [], c: 80 },
  { who: "体育委员", ic: "🍂", t: "捡到一片好看的落叶，夹进了课本里。", img: [], c: 87 },
  { who: "宣传委员", ic: "🐱", t: "校园里的猫又来蹭我了，今天的火腿肠没白买。", img: [], c: 4 },
  { who: "高一新生", ic: "💡", t: "终于把那道难题解出来了，那种快乐谁懂啊。", img: [], c: 11 },
  { who: "高三学长", ic: "🎤", t: "合唱排练跑调了，但大家都笑得很开心。", img: [], c: 18 },
  { who: "走读生", ic: "🧪", t: "实验终于成功了，和组员击掌的瞬间很燃。", img: [], c: 25 },
  { who: "住校生", ic: "📣", t: "运动会的呐喊声，现在想起来还热血沸腾。", img: [], c: 32 },
  { who: "课代表", ic: "📖", t: "图书馆靠窗的位置，今天轮到我了。", img: [], c: 39 },
  { who: "天文社", ic: "🌕", t: "晚自习回宿舍的路，月亮很圆。", img: [], c: 46 },
  { who: "美术课代表", ic: "⏰", t: "新的一周，立个 flag：不迟到。", img: [], c: 53 },
  { who: "书法社", ic: "📒", t: "被同学的笔记惊到了，太工整了。", img: [], c: 60 },
  { who: "长跑爱好者", ic: "🌧️", t: "下雨天的教室，特别适合安静地读书。", img: [], c: 67 },
  { who: "林晚", ic: "🌇", t: "今天的晚霞是橘粉色的，像打翻了颜料盘。", img: [], c: 74 },
  { who: "赵小雨", ic: "🔤", t: "坚持背单词的第 N 天，给自己点个赞。", img: [], c: 81 },
  { who: "苏清颜", ic: "✏️", t: "原来认真听一节课，真的会收获很多。", img: [], c: 88 },
  { who: "许念", ic: "🛏️", t: "宿舍卧谈会聊到很晚，话题从天南到海北。", img: [], c: 5 },
  { who: "班长", ic: "🧭", t: "和老师聊完，迷茫少了一点，方向清楚了一点。", img: [], c: 12 },
  { who: "同桌", ic: "🤝", t: "帮同学讲懂一道题，比自己做对还开心。", img: [], c: 19 },
  { who: "室友阿杰", ic: "🎵", t: "课间的一首歌，让整个下午都变好了。", img: [], c: 26 },
  { who: "室友小宇", ic: "🪴", t: "把窗台的绿植浇了水，它又长出了新叶。", img: [], c: 33 },
  { who: "学习委员", ic: "🏃", t: "今天的体育课，跑赢了上一次的自己。", img: [], c: 40 },
  { who: "体育委员", ic: "🥛", t: "在小卖部偶遇朋友，顺手请了瓶水。", img: [], c: 47 },
  { who: "宣传委员", ic: "💌", t: "晨读的声音此起彼伏，这就是青春吧。", img: [], c: 54 },
  { who: "高一新生", ic: "📐", t: "黑板上的板书被擦干净了，新的一天又开始了。", img: [], c: 61 },
  { who: "高三学长", ic: "🌧️", t: "放学时的广播里放了我最喜欢的歌。", img: [], c: 68 },
  { who: "走读生", ic: "🎶", t: "认真完成了值日，教室干净得发亮。", img: [], c: 75 },
  { who: "住校生", ic: "🧹", t: "社团活动结束时，天都快黑了，但很满足。", img: [], c: 82 },
  { who: "课代表", ic: "🎭", t: "今天的早餐是热豆浆和肉松面包，幸福。", img: [], c: 89 },
  { who: "天文社", ic: "🥖", t: "收到同学写的感谢小纸条，心都软了。", img: [], c: 6 },
  { who: "美术课代表", ic: "📮", t: "和同桌一起攻克了一道难题，默契十足。", img: [], c: 13 },
  { who: "书法社", ic: "📚", t: "雨后的操场有泥土的味道，很清新。", img: [], c: 20 },
  { who: "长跑爱好者", ic: "🌦️", t: "把喜欢的话写在了笔记本扉页上。", img: [], c: 27 },
  ];
  var ORAL = [
  { q: "「会当凌绝顶」的下一句？", a: "一览众山小" },
  { q: "光合作用的场所是？", a: "叶绿体" },
  { q: "sin 30° 等于？", a: "二分之一" },
  { q: "水的化学式是？", a: "H₂O" },
  { q: "我国最长的河流是？", a: "长江" },
  { q: "F=ma 是牛顿第几定律？", a: "第二定律" },
  { q: "一个直角三角形两直角边 3、4，斜边？", a: "5" },
  { q: "标准大气压下水的沸点？", a: "100 摄氏度" },
  { q: "DNA 的中文全称是？", a: "脱氧核糖核酸" },
  { q: "光在真空中的速度约为？", a: "每秒 30 万千米" },
  { q: "杭州所在省的简称是？", a: "浙" },
  { q: "电流的单位是？", a: "安培" },
  { q: "pH 小于 7 的溶液呈什么性？", a: "酸性" },
  { q: "地球自转一周约多久？", a: "约 24 小时" },
  { q: "正方体有多少条棱？", a: "12 条" },
  { q: "急救电话是多少？", a: "120" },
  { q: "火警电话是多少？", a: "119" },
  { q: "「先天下之忧而忧」出自？", a: "岳阳楼记" },
  { q: "元素周期表中氧的元素符号是？", a: "O" },
  { q: "世界上面积最大的洋是？", a: "太平洋" },
  { q: "圆的周长公式？", a: "2πr" },
  { q: "「三人行，必有我师焉」出自？", a: "论语" },
  { q: "人体最主要的供能物质是？", a: "糖类" },
  { q: "力的单位是？", a: "牛顿" },
  { q: "一年有多少个节气？", a: "24 个" },
  { q: "声音能否在真空中传播？", a: "不能" },
  { q: "中国地势的总体特征是？", a: "西高东低" },
  { q: "“library”是什么意思？", a: "图书馆" },
  { q: "“good”的比较级是？", a: "better" },
  { q: "世界最高峰是？", a: "珠穆朗玛峰" },
  ];
  var MATH = [
  { q: "79 + 52 = ?", a: "131" },
  { q: "12 + 79 = ?", a: "91" },
  { q: "88 + 90 = ?", a: "178" },
  { q: "94 + 89 = ?", a: "183" },
  { q: "81 + 97 = ?", a: "178" },
  { q: "19 + 99 = ?", a: "118" },
  { q: "54 + 53 = ?", a: "107" },
  { q: "42 + 41 = ?", a: "83" },
  { q: "98 + 88 = ?", a: "186" },
  { q: "59 + 40 = ?", a: "99" },
  { q: "51 + 90 = ?", a: "141" },
  { q: "43 + 15 = ?", a: "58" },
  { q: "56 + 31 = ?", a: "87" },
  { q: "18 + 93 = ?", a: "111" },
  { q: "81 + 44 = ?", a: "125" },
  { q: "39 + 92 = ?", a: "131" },
  { q: "38 + 88 = ?", a: "126" },
  { q: "44 + 75 = ?", a: "119" },
  { q: "49 + 26 = ?", a: "75" },
  { q: "28 + 12 = ?", a: "40" },
  { q: "32 + 84 = ?", a: "116" },
  { q: "22 + 43 = ?", a: "65" },
  { q: "89 + 25 = ?", a: "114" },
  { q: "20 + 16 = ?", a: "36" },
  { q: "50 + 69 = ?", a: "119" },
  { q: "93 + 98 = ?", a: "191" },
  { q: "62 + 57 = ?", a: "119" },
  { q: "19 + 97 = ?", a: "116" },
  { q: "93 + 18 = ?", a: "111" },
  { q: "31 + 63 = ?", a: "94" },
  { q: "88 + 37 = ?", a: "125" },
  { q: "78 + 28 = ?", a: "106" },
  { q: "40 + 33 = ?", a: "73" },
  { q: "45 + 21 = ?", a: "66" },
  { q: "62 + 24 = ?", a: "86" },
  { q: "15 + 30 = ?", a: "45" },
  { q: "19 + 80 = ?", a: "99" },
  { q: "31 + 94 = ?", a: "125" },
  { q: "44 + 76 = ?", a: "120" },
  { q: "68 + 50 = ?", a: "118" },
  { q: "45 + 20 = ?", a: "65" },
  { q: "59 + 35 = ?", a: "94" },
  { q: "39 + 26 = ?", a: "65" },
  { q: "37 + 37 = ?", a: "74" },
  { q: "51 + 56 = ?", a: "107" },
  { q: "59 + 85 = ?", a: "144" },
  { q: "68 + 88 = ?", a: "156" },
  { q: "23 + 61 = ?", a: "84" },
  { q: "65 + 22 = ?", a: "87" },
  { q: "41 + 33 = ?", a: "74" },
  { q: "19 + 39 = ?", a: "58" },
  { q: "32 + 97 = ?", a: "129" },
  { q: "64 + 50 = ?", a: "114" },
  { q: "80 + 82 = ?", a: "162" },
  { q: "77 + 38 = ?", a: "115" },
  { q: "70 + 82 = ?", a: "152" },
  { q: "52 + 70 = ?", a: "122" },
  { q: "30 + 32 = ?", a: "62" },
  { q: "55 + 23 = ?", a: "78" },
  { q: "24 + 34 = ?", a: "58" },
  { q: "68 + 98 = ?", a: "166" },
  { q: "32 + 31 = ?", a: "63" },
  { q: "71 + 86 = ?", a: "157" },
  { q: "85 + 70 = ?", a: "155" },
  { q: "97 + 86 = ?", a: "183" },
  { q: "68 + 31 = ?", a: "99" },
  { q: "79 + 21 = ?", a: "100" },
  { q: "88 + 51 = ?", a: "139" },
  { q: "23 + 75 = ?", a: "98" },
  { q: "66 + 15 = ?", a: "81" },
  { q: "22 + 43 = ?", a: "65" },
  { q: "49 + 63 = ?", a: "112" },
  { q: "99 + 41 = ?", a: "140" },
  { q: "90 + 82 = ?", a: "172" },
  { q: "55 + 48 = ?", a: "103" },
  { q: "88 + 27 = ?", a: "115" },
  { q: "61 + 76 = ?", a: "137" },
  { q: "77 + 30 = ?", a: "107" },
  { q: "83 + 85 = ?", a: "168" },
  { q: "85 + 82 = ?", a: "167" },
  { q: "21 + 19 = ?", a: "40" },
  { q: "25 + 91 = ?", a: "116" },
  { q: "86 + 24 = ?", a: "110" },
  { q: "87 + 87 = ?", a: "174" },
  { q: "94 + 32 = ?", a: "126" },
  { q: "91 + 56 = ?", a: "147" },
  { q: "14 + 90 = ?", a: "104" },
  { q: "39 + 99 = ?", a: "138" },
  { q: "42 + 78 = ?", a: "120" },
  { q: "16 + 91 = ?", a: "107" },
  { q: "29 + 43 = ?", a: "72" },
  { q: "24 + 20 = ?", a: "44" },
  { q: "79 + 37 = ?", a: "116" },
  { q: "37 + 42 = ?", a: "79" },
  { q: "61 + 70 = ?", a: "131" },
  { q: "21 + 42 = ?", a: "63" },
  { q: "88 + 23 = ?", a: "111" },
  { q: "81 + 60 = ?", a: "141" },
  { q: "67 + 39 = ?", a: "106" },
  { q: "25 + 34 = ?", a: "59" },
  { q: "63 + 81 = ?", a: "144" },
  { q: "85 + 40 = ?", a: "125" },
  { q: "29 + 18 = ?", a: "47" },
  { q: "11 + 33 = ?", a: "44" },
  { q: "81 + 44 = ?", a: "125" },
  { q: "94 + 72 = ?", a: "166" },
  { q: "60 + 62 = ?", a: "122" },
  { q: "54 + 69 = ?", a: "123" },
  { q: "74 + 54 = ?", a: "128" },
  { q: "87 + 28 = ?", a: "115" },
  { q: "14 + 60 = ?", a: "74" },
  { q: "48 + 87 = ?", a: "135" },
  { q: "62 + 76 = ?", a: "138" },
  { q: "55 + 37 = ?", a: "92" },
  { q: "75 + 88 = ?", a: "163" },
  { q: "63 + 86 = ?", a: "149" },
  { q: "33 + 49 = ?", a: "82" },
  { q: "43 + 97 = ?", a: "140" },
  { q: "55 + 51 = ?", a: "106" },
  { q: "33 + 27 = ?", a: "60" },
  { q: "58 + 91 = ?", a: "149" },
  { q: "14 + 47 = ?", a: "61" },
  { q: "75 + 79 = ?", a: "154" },
  { q: "16 + 55 = ?", a: "71" },
  { q: "57 + 84 = ?", a: "141" },
  { q: "46 + 23 = ?", a: "69" },
  { q: "80 + 65 = ?", a: "145" },
  { q: "13 + 30 = ?", a: "43" },
  { q: "29 + 32 = ?", a: "61" },
  { q: "31 + 67 = ?", a: "98" },
  { q: "21 + 25 = ?", a: "46" },
  { q: "16 + 85 = ?", a: "101" },
  { q: "21 + 47 = ?", a: "68" },
  { q: "34 + 64 = ?", a: "98" },
  { q: "95 + 75 = ?", a: "170" },
  { q: "66 + 46 = ?", a: "112" },
  { q: "73 + 99 = ?", a: "172" },
  { q: "12 + 71 = ?", a: "83" },
  { q: "31 + 75 = ?", a: "106" },
  { q: "93 + 63 = ?", a: "156" },
  { q: "56 + 24 = ?", a: "80" },
  { q: "14 + 19 = ?", a: "33" },
  { q: "70 + 61 = ?", a: "131" },
  { q: "54 + 43 = ?", a: "97" },
  { q: "73 + 38 = ?", a: "111" },
  { q: "76 + 28 = ?", a: "104" },
  { q: "31 + 72 = ?", a: "103" },
  { q: "36 + 28 = ?", a: "64" },
  { q: "14 + 91 = ?", a: "105" },
  { q: "96 + 65 = ?", a: "161" },
  { q: "70 + 97 = ?", a: "167" },
  { q: "62 + 88 = ?", a: "150" },
  { q: "96 + 89 = ?", a: "185" },
  { q: "53 + 73 = ?", a: "126" },
  { q: "31 + 30 = ?", a: "61" },
  { q: "39 + 14 = ?", a: "53" },
  { q: "28 + 95 = ?", a: "123" },
  { q: "75 + 99 = ?", a: "174" },
  { q: "68 + 72 = ?", a: "140" },
  { q: "90 + 13 = ?", a: "103" },
  { q: "62 + 29 = ?", a: "91" },
  { q: "92 + 56 = ?", a: "148" },
  { q: "53 + 57 = ?", a: "110" },
  { q: "28 + 37 = ?", a: "65" },
  { q: "19 + 14 = ?", a: "33" },
  { q: "70 + 66 = ?", a: "136" },
  { q: "14 + 99 = ?", a: "113" },
  { q: "83 + 21 = ?", a: "104" },
  { q: "50 + 16 = ?", a: "66" },
  { q: "89 + 88 = ?", a: "177" },
  { q: "66 + 98 = ?", a: "164" },
  { q: "76 + 34 = ?", a: "110" },
  { q: "94 + 49 = ?", a: "143" },
  { q: "51 + 54 = ?", a: "105" },
  { q: "22 + 65 = ?", a: "87" },
  { q: "84 + 30 = ?", a: "114" },
  { q: "74 + 99 = ?", a: "173" },
  { q: "15 + 89 = ?", a: "104" },
  { q: "89 + 60 = ?", a: "149" },
  { q: "48 + 16 = ?", a: "64" },
  { q: "85 + 86 = ?", a: "171" },
  { q: "59 + 31 = ?", a: "90" },
  { q: "29 + 94 = ?", a: "123" },
  { q: "24 + 21 = ?", a: "45" },
  { q: "54 + 85 = ?", a: "139" },
  { q: "90 + 35 = ?", a: "125" },
  { q: "37 + 23 = ?", a: "60" },
  { q: "95 + 31 = ?", a: "126" },
  { q: "37 + 69 = ?", a: "106" },
  { q: "88 + 58 = ?", a: "146" },
  { q: "99 + 81 = ?", a: "180" },
  { q: "84 + 37 = ?", a: "121" },
  { q: "96 + 43 = ?", a: "139" },
  { q: "99 + 54 = ?", a: "153" },
  { q: "27 + 26 = ?", a: "53" },
  { q: "50 + 62 = ?", a: "112" },
  { q: "65 + 23 = ?", a: "88" },
  { q: "40 + 47 = ?", a: "87" },
  { q: "68 + 67 = ?", a: "135" },
  { q: "38 + 53 = ?", a: "91" },
  { q: "52 + 73 = ?", a: "125" },
  { q: "45 + 66 = ?", a: "111" },
  { q: "80 + 38 = ?", a: "118" },
  { q: "31 + 53 = ?", a: "84" },
  { q: "84 + 12 = ?", a: "96" },
  { q: "51 + 98 = ?", a: "149" },
  { q: "87 + 38 = ?", a: "125" },
  { q: "40 + 60 = ?", a: "100" },
  { q: "16 + 53 = ?", a: "69" },
  { q: "66 + 49 = ?", a: "115" },
  { q: "19 + 64 = ?", a: "83" },
  { q: "54 + 99 = ?", a: "153" },
  { q: "40 + 84 = ?", a: "124" },
  { q: "17 + 66 = ?", a: "83" },
  { q: "49 + 28 = ?", a: "77" },
  { q: "88 + 34 = ?", a: "122" },
  { q: "93 + 57 = ?", a: "150" },
  { q: "78 + 59 = ?", a: "137" },
  { q: "55 + 24 = ?", a: "79" },
  { q: "39 + 21 = ?", a: "60" },
  { q: "39 + 45 = ?", a: "84" },
  { q: "12 + 38 = ?", a: "50" },
  { q: "92 + 87 = ?", a: "179" },
  { q: "88 + 27 = ?", a: "115" },
  { q: "37 + 87 = ?", a: "124" },
  { q: "15 + 37 = ?", a: "52" },
  { q: "22 + 52 = ?", a: "74" },
  { q: "92 + 80 = ?", a: "172" },
  { q: "51 + 47 = ?", a: "98" },
  { q: "89 + 59 = ?", a: "148" },
  { q: "59 + 85 = ?", a: "144" },
  { q: "22 + 50 = ?", a: "72" },
  { q: "41 + 28 = ?", a: "69" },
  { q: "37 + 56 = ?", a: "93" },
  { q: "48 + 15 = ?", a: "63" },
  { q: "48 + 69 = ?", a: "117" },
  { q: "85 + 67 = ?", a: "152" },
  { q: "70 + 44 = ?", a: "114" },
  { q: "27 + 55 = ?", a: "82" },
  { q: "40 + 44 = ?", a: "84" },
  { q: "45 - 43 = ?", a: "2" },
  { q: "33 - 34 = ?", a: "-1" },
  { q: "33 - 56 = ?", a: "-23" },
  { q: "60 - 54 = ?", a: "6" },
  { q: "46 - 37 = ?", a: "9" },
  { q: "36 - 37 = ?", a: "-1" },
  { q: "89 - 58 = ?", a: "31" },
  { q: "26 - 55 = ?", a: "-29" },
  { q: "53 - 44 = ?", a: "9" },
  { q: "103 - 26 = ?", a: "77" },
  { q: "51 - 29 = ?", a: "22" },
  { q: "69 - 41 = ?", a: "28" },
  { q: "119 - 58 = ?", a: "61" },
  { q: "46 - 39 = ?", a: "7" },
  { q: "21 - 31 = ?", a: "-10" },
  { q: "78 - 38 = ?", a: "40" },
  { q: "114 - 24 = ?", a: "90" },
  { q: "75 - 15 = ?", a: "60" },
  { q: "75 - 55 = ?", a: "20" },
  { q: "119 - 41 = ?", a: "78" },
  { q: "57 - 55 = ?", a: "2" },
  { q: "79 - 11 = ?", a: "68" },
  { q: "104 - 59 = ?", a: "45" },
  { q: "109 - 34 = ?", a: "75" },
  { q: "110 - 42 = ?", a: "68" },
  { q: "80 - 54 = ?", a: "26" },
  { q: "113 - 14 = ?", a: "99" },
  { q: "50 - 44 = ?", a: "6" },
  { q: "38 - 59 = ?", a: "-21" },
  { q: "56 - 21 = ?", a: "35" },
  { q: "27 - 22 = ?", a: "5" },
  { q: "22 - 48 = ?", a: "-26" },
  { q: "79 - 40 = ?", a: "39" },
  { q: "86 - 14 = ?", a: "72" },
  { q: "115 - 44 = ?", a: "71" },
  { q: "113 - 16 = ?", a: "97" },
  { q: "44 - 44 = ?", a: "0" },
  { q: "77 - 27 = ?", a: "50" },
  { q: "87 - 13 = ?", a: "74" },
  { q: "100 - 60 = ?", a: "40" },
  { q: "57 - 31 = ?", a: "26" },
  { q: "21 - 47 = ?", a: "-26" },
  { q: "46 - 47 = ?", a: "-1" },
  { q: "55 - 32 = ?", a: "23" },
  { q: "39 - 14 = ?", a: "25" },
  { q: "81 - 41 = ?", a: "40" },
  { q: "117 - 39 = ?", a: "78" },
  { q: "38 - 45 = ?", a: "-7" },
  { q: "49 - 46 = ?", a: "3" },
  { q: "75 - 14 = ?", a: "61" },
  { q: "83 - 33 = ?", a: "50" },
  { q: "32 - 39 = ?", a: "-7" },
  { q: "88 - 18 = ?", a: "70" },
  { q: "48 - 58 = ?", a: "-10" },
  { q: "69 - 50 = ?", a: "19" },
  { q: "53 - 34 = ?", a: "19" },
  { q: "100 - 47 = ?", a: "53" },
  { q: "45 - 34 = ?", a: "11" },
  { q: "49 - 47 = ?", a: "2" },
  { q: "108 - 42 = ?", a: "66" },
  { q: "25 - 44 = ?", a: "-19" },
  { q: "84 - 39 = ?", a: "45" },
  { q: "39 - 52 = ?", a: "-13" },
  { q: "42 - 25 = ?", a: "17" },
  { q: "118 - 28 = ?", a: "90" },
  { q: "62 - 35 = ?", a: "27" },
  { q: "83 - 57 = ?", a: "26" },
  { q: "71 - 53 = ?", a: "18" },
  { q: "114 - 31 = ?", a: "83" },
  { q: "31 - 40 = ?", a: "-9" },
  { q: "61 - 23 = ?", a: "38" },
  { q: "94 - 46 = ?", a: "48" },
  { q: "39 - 14 = ?", a: "25" },
  { q: "87 - 60 = ?", a: "27" },
  { q: "47 - 31 = ?", a: "16" },
  { q: "35 - 33 = ?", a: "2" },
  { q: "86 - 22 = ?", a: "64" },
  { q: "24 - 35 = ?", a: "-11" },
  { q: "115 - 59 = ?", a: "56" },
  { q: "23 - 11 = ?", a: "12" },
  { q: "31 - 52 = ?", a: "-21" },
  { q: "101 - 52 = ?", a: "49" },
  { q: "31 - 23 = ?", a: "8" },
  { q: "56 - 13 = ?", a: "43" },
  { q: "24 - 23 = ?", a: "1" },
  { q: "101 - 60 = ?", a: "41" },
  { q: "27 - 42 = ?", a: "-15" },
  { q: "63 - 17 = ?", a: "46" },
  { q: "58 - 43 = ?", a: "15" },
  { q: "115 - 23 = ?", a: "92" },
  { q: "35 - 25 = ?", a: "10" },
  { q: "59 - 37 = ?", a: "22" },
  { q: "58 - 13 = ?", a: "45" },
  { q: "34 - 16 = ?", a: "18" },
  { q: "113 - 36 = ?", a: "77" },
  { q: "103 - 28 = ?", a: "75" },
  { q: "67 - 42 = ?", a: "25" },
  { q: "116 - 11 = ?", a: "105" },
  { q: "57 - 35 = ?", a: "22" },
  { q: "81 - 16 = ?", a: "65" },
  { q: "78 - 36 = ?", a: "42" },
  { q: "50 - 22 = ?", a: "28" },
  { q: "94 - 36 = ?", a: "58" },
  { q: "104 - 34 = ?", a: "70" },
  { q: "91 - 22 = ?", a: "69" },
  { q: "44 - 48 = ?", a: "-4" },
  { q: "119 - 30 = ?", a: "89" },
  { q: "54 - 41 = ?", a: "13" },
  { q: "47 - 50 = ?", a: "-3" },
  { q: "61 - 44 = ?", a: "17" },
  { q: "24 - 38 = ?", a: "-14" },
  { q: "67 - 27 = ?", a: "40" },
  { q: "112 - 21 = ?", a: "91" },
  { q: "47 - 18 = ?", a: "29" },
  { q: "27 - 24 = ?", a: "3" },
  { q: "91 - 56 = ?", a: "35" },
  { q: "52 - 23 = ?", a: "29" },
  { q: "55 - 33 = ?", a: "22" },
  { q: "74 - 27 = ?", a: "47" },
  { q: "58 - 48 = ?", a: "10" },
  { q: "28 - 41 = ?", a: "-13" },
  { q: "51 - 22 = ?", a: "29" },
  { q: "24 - 11 = ?", a: "13" },
  { q: "47 - 24 = ?", a: "23" },
  { q: "45 - 32 = ?", a: "13" },
  { q: "64 - 27 = ?", a: "37" },
  { q: "44 - 12 = ?", a: "32" },
  { q: "32 - 43 = ?", a: "-11" },
  { q: "82 - 60 = ?", a: "22" },
  { q: "66 - 40 = ?", a: "26" },
  { q: "47 - 54 = ?", a: "-7" },
  { q: "99 - 24 = ?", a: "75" },
  { q: "31 - 40 = ?", a: "-9" },
  { q: "54 - 38 = ?", a: "16" },
  { q: "54 - 17 = ?", a: "37" },
  { q: "63 - 17 = ?", a: "46" },
  { q: "39 - 41 = ?", a: "-2" },
  { q: "100 - 32 = ?", a: "68" },
  { q: "56 - 58 = ?", a: "-2" },
  { q: "70 - 21 = ?", a: "49" },
  { q: "62 - 38 = ?", a: "24" },
  { q: "92 - 38 = ?", a: "54" },
  { q: "22 - 13 = ?", a: "9" },
  { q: "117 - 43 = ?", a: "74" },
  { q: "79 - 21 = ?", a: "58" },
  { q: "46 - 42 = ?", a: "4" },
  { q: "37 - 56 = ?", a: "-19" },
  { q: "47 - 51 = ?", a: "-4" },
  { q: "75 - 12 = ?", a: "63" },
  { q: "88 - 59 = ?", a: "29" },
  { q: "58 - 53 = ?", a: "5" },
  { q: "53 - 54 = ?", a: "-1" },
  { q: "74 - 58 = ?", a: "16" },
  { q: "66 - 50 = ?", a: "16" },
  { q: "109 - 60 = ?", a: "49" },
  { q: "117 - 29 = ?", a: "88" },
  { q: "119 - 59 = ?", a: "60" },
  { q: "68 - 45 = ?", a: "23" },
  { q: "97 - 37 = ?", a: "60" },
  { q: "61 - 37 = ?", a: "24" },
  { q: "49 - 41 = ?", a: "8" },
  { q: "45 - 12 = ?", a: "33" },
  { q: "55 - 13 = ?", a: "42" },
  { q: "60 - 27 = ?", a: "33" },
  { q: "61 - 54 = ?", a: "7" },
  { q: "91 - 55 = ?", a: "36" },
  { q: "102 - 13 = ?", a: "89" },
  { q: "87 - 13 = ?", a: "74" },
  { q: "27 - 54 = ?", a: "-27" },
  { q: "72 - 50 = ?", a: "22" },
  { q: "67 - 33 = ?", a: "34" },
  { q: "102 - 16 = ?", a: "86" },
  { q: "29 - 19 = ?", a: "10" },
  { q: "27 - 43 = ?", a: "-16" },
  { q: "71 - 44 = ?", a: "27" },
  { q: "39 - 49 = ?", a: "-10" },
  { q: "102 - 38 = ?", a: "64" },
  { q: "73 - 51 = ?", a: "22" },
  { q: "35 - 16 = ?", a: "19" },
  { q: "61 - 59 = ?", a: "2" },
  { q: "41 - 22 = ?", a: "19" },
  { q: "45 - 44 = ?", a: "1" },
  { q: "115 - 28 = ?", a: "87" },
  { q: "113 - 20 = ?", a: "93" },
  { q: "108 - 28 = ?", a: "80" },
  { q: "45 - 50 = ?", a: "-5" },
  { q: "96 - 39 = ?", a: "57" },
  { q: "53 - 29 = ?", a: "24" },
  { q: "74 - 53 = ?", a: "21" },
  { q: "74 - 16 = ?", a: "58" },
  { q: "50 - 27 = ?", a: "23" },
  { q: "60 - 23 = ?", a: "37" },
  { q: "68 - 21 = ?", a: "47" },
  { q: "107 - 23 = ?", a: "84" },
  { q: "60 - 39 = ?", a: "21" },
  { q: "51 - 44 = ?", a: "7" },
  { q: "96 - 22 = ?", a: "74" },
  { q: "108 - 50 = ?", a: "58" },
  { q: "113 - 52 = ?", a: "61" },
  { q: "48 - 28 = ?", a: "20" },
  { q: "76 - 22 = ?", a: "54" },
  { q: "116 - 46 = ?", a: "70" },
  { q: "46 - 37 = ?", a: "9" },
  { q: "44 - 46 = ?", a: "-2" },
  { q: "72 - 47 = ?", a: "25" },
  { q: "111 - 33 = ?", a: "78" },
  { q: "108 - 21 = ?", a: "87" },
  { q: "44 - 26 = ?", a: "18" },
  { q: "95 - 39 = ?", a: "56" },
  { q: "107 - 29 = ?", a: "78" },
  { q: "106 - 47 = ?", a: "59" },
  { q: "107 - 52 = ?", a: "55" },
  { q: "92 - 23 = ?", a: "69" },
  { q: "71 - 53 = ?", a: "18" },
  { q: "37 - 18 = ?", a: "19" },
  { q: "92 - 21 = ?", a: "71" },
  { q: "54 - 23 = ?", a: "31" },
  { q: "98 - 11 = ?", a: "87" },
  { q: "109 - 53 = ?", a: "56" },
  { q: "43 - 49 = ?", a: "-6" },
  { q: "78 - 22 = ?", a: "56" },
  { q: "106 - 59 = ?", a: "47" },
  { q: "89 - 26 = ?", a: "63" },
  { q: "27 - 30 = ?", a: "-3" },
  { q: "52 - 53 = ?", a: "-1" },
  { q: "40 - 54 = ?", a: "-14" },
  { q: "58 - 45 = ?", a: "13" },
  { q: "31 - 60 = ?", a: "-29" },
  { q: "88 - 12 = ?", a: "76" },
  { q: "83 - 26 = ?", a: "57" },
  { q: "47 - 27 = ?", a: "20" },
  { q: "56 - 44 = ?", a: "12" },
  { q: "95 - 22 = ?", a: "73" },
  { q: "98 - 25 = ?", a: "73" },
  { q: "85 - 49 = ?", a: "36" },
  { q: "26 - 15 = ?", a: "11" },
  { q: "46 - 53 = ?", a: "-7" },
  { q: "28 - 36 = ?", a: "-8" },
  { q: "82 - 57 = ?", a: "25" },
  { q: "47 - 25 = ?", a: "22" },
  { q: "8 × 13 = ?", a: "104" },
  { q: "10 × 8 = ?", a: "80" },
  { q: "6 × 10 = ?", a: "60" },
  { q: "13 × 9 = ?", a: "117" },
  { q: "5 × 6 = ?", a: "30" },
  { q: "9 × 10 = ?", a: "90" },
  { q: "4 × 6 = ?", a: "24" },
  { q: "5 × 13 = ?", a: "65" },
  { q: "6 × 12 = ?", a: "72" },
  { q: "12 × 4 = ?", a: "48" },
  { q: "9 × 11 = ?", a: "99" },
  { q: "7 × 9 = ?", a: "63" },
  { q: "9 × 8 = ?", a: "72" },
  { q: "12 × 12 = ?", a: "144" },
  { q: "13 × 5 = ?", a: "65" },
  { q: "3 × 11 = ?", a: "33" },
  { q: "4 × 7 = ?", a: "28" },
  { q: "7 × 6 = ?", a: "42" },
  { q: "5 × 11 = ?", a: "55" },
  { q: "5 × 9 = ?", a: "45" },
  { q: "9 × 8 = ?", a: "72" },
  { q: "3 × 13 = ?", a: "39" },
  { q: "4 × 13 = ?", a: "52" },
  { q: "12 × 10 = ?", a: "120" },
  { q: "9 × 11 = ?", a: "99" },
  { q: "3 × 12 = ?", a: "36" },
  { q: "8 × 8 = ?", a: "64" },
  { q: "5 × 5 = ?", a: "25" },
  { q: "9 × 5 = ?", a: "45" },
  { q: "4 × 12 = ?", a: "48" },
  { q: "7 × 6 = ?", a: "42" },
  { q: "10 × 9 = ?", a: "90" },
  { q: "7 × 4 = ?", a: "28" },
  { q: "8 × 3 = ?", a: "24" },
  { q: "10 × 5 = ?", a: "50" },
  { q: "5 × 12 = ?", a: "60" },
  { q: "9 × 7 = ?", a: "63" },
  { q: "6 × 12 = ?", a: "72" },
  { q: "5 × 8 = ?", a: "40" },
  { q: "3 × 3 = ?", a: "9" },
  { q: "3 × 3 = ?", a: "9" },
  { q: "4 × 3 = ?", a: "12" },
  { q: "3 × 3 = ?", a: "9" },
  { q: "9 × 11 = ?", a: "99" },
  { q: "10 × 8 = ?", a: "80" },
  { q: "7 × 5 = ?", a: "35" },
  { q: "9 × 7 = ?", a: "63" },
  { q: "8 × 3 = ?", a: "24" },
  { q: "3 × 4 = ?", a: "12" },
  { q: "13 × 5 = ?", a: "65" },
  { q: "9 × 4 = ?", a: "36" },
  { q: "5 × 10 = ?", a: "50" },
  { q: "7 × 5 = ?", a: "35" },
  { q: "5 × 5 = ?", a: "25" },
  { q: "11 × 6 = ?", a: "66" },
  { q: "7 × 5 = ?", a: "35" },
  { q: "7 × 8 = ?", a: "56" },
  { q: "7 × 6 = ?", a: "42" },
  { q: "4 × 10 = ?", a: "40" },
  { q: "9 × 7 = ?", a: "63" },
  { q: "4 × 13 = ?", a: "52" },
  { q: "6 × 10 = ?", a: "60" },
  { q: "12 × 4 = ?", a: "48" },
  { q: "12 × 13 = ?", a: "156" },
  { q: "10 × 8 = ?", a: "80" },
  { q: "5 × 5 = ?", a: "25" },
  { q: "12 × 13 = ?", a: "156" },
  { q: "13 × 4 = ?", a: "52" },
  { q: "8 × 13 = ?", a: "104" },
  { q: "6 × 12 = ?", a: "72" },
  { q: "6 × 9 = ?", a: "54" },
  { q: "6 × 6 = ?", a: "36" },
  { q: "7 × 10 = ?", a: "70" },
  { q: "6 × 5 = ?", a: "30" },
  { q: "13 × 6 = ?", a: "78" },
  { q: "4 × 12 = ?", a: "48" },
  { q: "3 × 11 = ?", a: "33" },
  { q: "4 × 11 = ?", a: "44" },
  { q: "13 × 7 = ?", a: "91" },
  { q: "12 × 6 = ?", a: "72" },
  { q: "12 × 6 = ?", a: "72" },
  { q: "3 × 11 = ?", a: "33" },
  { q: "9 × 7 = ?", a: "63" },
  { q: "4 × 8 = ?", a: "32" },
  { q: "11 × 4 = ?", a: "44" },
  { q: "5 × 8 = ?", a: "40" },
  { q: "4 × 8 = ?", a: "32" },
  { q: "6 × 4 = ?", a: "24" },
  { q: "3 × 10 = ?", a: "30" },
  { q: "3 × 7 = ?", a: "21" },
  { q: "9 × 7 = ?", a: "63" },
  { q: "4 × 7 = ?", a: "28" },
  { q: "12 × 6 = ?", a: "72" },
  { q: "9 × 12 = ?", a: "108" },
  { q: "8 × 13 = ?", a: "104" },
  { q: "9 × 11 = ?", a: "99" },
  { q: "7 × 9 = ?", a: "63" },
  { q: "7 × 4 = ?", a: "28" },
  { q: "13 × 6 = ?", a: "78" },
  { q: "13 × 8 = ?", a: "104" },
  { q: "8 × 7 = ?", a: "56" },
  { q: "8 × 13 = ?", a: "104" },
  { q: "13 × 4 = ?", a: "52" },
  { q: "7 × 9 = ?", a: "63" },
  { q: "3 × 12 = ?", a: "36" },
  { q: "9 × 6 = ?", a: "54" },
  { q: "3 × 5 = ?", a: "15" },
  { q: "7 × 10 = ?", a: "70" },
  { q: "8 × 12 = ?", a: "96" },
  { q: "5 × 10 = ?", a: "50" },
  { q: "8 × 13 = ?", a: "104" },
  { q: "6 × 4 = ?", a: "24" },
  { q: "3 × 12 = ?", a: "36" },
  { q: "11 × 11 = ?", a: "121" },
  { q: "8 × 8 = ?", a: "64" },
  { q: "11 × 4 = ?", a: "44" },
  { q: "12 × 5 = ?", a: "60" },
  { q: "10 × 9 = ?", a: "90" },
  { q: "9 × 13 = ?", a: "117" },
  { q: "11 × 3 = ?", a: "33" },
  { q: "13 × 3 = ?", a: "39" },
  { q: "5 × 4 = ?", a: "20" },
  { q: "11 × 12 = ?", a: "132" },
  { q: "5 × 13 = ?", a: "65" },
  { q: "8 × 8 = ?", a: "64" },
  { q: "7 × 9 = ?", a: "63" },
  { q: "7 × 10 = ?", a: "70" },
  { q: "6 × 6 = ?", a: "36" },
  { q: "4 × 13 = ?", a: "52" },
  { q: "6 × 13 = ?", a: "78" },
  { q: "13 × 13 = ?", a: "169" },
  { q: "6 × 6 = ?", a: "36" },
  { q: "12 × 3 = ?", a: "36" },
  { q: "8 × 11 = ?", a: "88" },
  { q: "9 × 9 = ?", a: "81" },
  { q: "4 × 10 = ?", a: "40" },
  { q: "10 × 10 = ?", a: "100" },
  { q: "10 × 5 = ?", a: "50" },
  { q: "13 × 7 = ?", a: "91" },
  { q: "7 × 13 = ?", a: "91" },
  { q: "12 × 5 = ?", a: "60" },
  { q: "10 × 10 = ?", a: "100" },
  { q: "6 × 6 = ?", a: "36" },
  { q: "13 × 10 = ?", a: "130" },
  { q: "8 × 6 = ?", a: "48" },
  { q: "3 × 5 = ?", a: "15" },
  { q: "7 × 7 = ?", a: "49" },
  { q: "8 × 6 = ?", a: "48" },
  { q: "9 × 3 = ?", a: "27" },
  { q: "6 × 9 = ?", a: "54" },
  { q: "13 × 5 = ?", a: "65" },
  { q: "7 × 5 = ?", a: "35" },
  { q: "5 × 4 = ?", a: "20" },
  { q: "7 × 7 = ?", a: "49" },
  { q: "4 × 11 = ?", a: "44" },
  { q: "8 × 9 = ?", a: "72" },
  { q: "11 × 13 = ?", a: "143" },
  { q: "8 × 12 = ?", a: "96" },
  { q: "7 × 13 = ?", a: "91" },
  { q: "11 × 8 = ?", a: "88" },
  { q: "13 × 13 = ?", a: "169" },
  { q: "7 × 5 = ?", a: "35" },
  { q: "12 × 11 = ?", a: "132" },
  { q: "5 × 11 = ?", a: "55" },
  { q: "3 × 13 = ?", a: "39" },
  { q: "12 × 4 = ?", a: "48" },
  { q: "11 × 5 = ?", a: "55" },
  { q: "6 × 10 = ?", a: "60" },
  { q: "10 × 7 = ?", a: "70" },
  { q: "8 × 10 = ?", a: "80" },
  { q: "7 × 5 = ?", a: "35" },
  { q: "13 × 5 = ?", a: "65" },
  { q: "9 × 3 = ?", a: "27" },
  { q: "9 × 12 = ?", a: "108" },
  { q: "3 × 6 = ?", a: "18" },
  { q: "3 × 11 = ?", a: "33" },
  { q: "11 × 5 = ?", a: "55" },
  { q: "5 × 5 = ?", a: "25" },
  { q: "9 × 6 = ?", a: "54" },
  { q: "11 × 6 = ?", a: "66" },
  { q: "8 × 11 = ?", a: "88" },
  { q: "13 × 11 = ?", a: "143" },
  { q: "12 × 9 = ?", a: "108" },
  { q: "6 × 4 = ?", a: "24" },
  { q: "8 × 12 = ?", a: "96" },
  { q: "6 × 12 = ?", a: "72" },
  { q: "12 × 13 = ?", a: "156" },
  { q: "11 × 9 = ?", a: "99" },
  { q: "11 × 3 = ?", a: "33" },
  { q: "5 × 6 = ?", a: "30" },
  { q: "12 × 7 = ?", a: "84" },
  { q: "11 × 7 = ?", a: "77" },
  { q: "8 × 6 = ?", a: "48" },
  { q: "7 × 3 = ?", a: "21" },
  { q: "3 × 12 = ?", a: "36" },
  { q: "7 × 10 = ?", a: "70" },
  { q: "10 × 11 = ?", a: "110" },
  { q: "8 × 9 = ?", a: "72" },
  { q: "7 × 9 = ?", a: "63" },
  { q: "9 × 12 = ?", a: "108" },
  { q: "13 × 12 = ?", a: "156" },
  { q: "9 × 11 = ?", a: "99" },
  { q: "4 × 12 = ?", a: "48" },
  { q: "13 × 12 = ?", a: "156" },
  { q: "13 × 8 = ?", a: "104" },
  { q: "7 × 4 = ?", a: "28" },
  { q: "3 × 9 = ?", a: "27" },
  { q: "3 × 5 = ?", a: "15" },
  { q: "3 × 5 = ?", a: "15" },
  { q: "3 × 12 = ?", a: "36" },
  { q: "6 × 10 = ?", a: "60" },
  { q: "4 × 4 = ?", a: "16" },
  { q: "10 × 3 = ?", a: "30" },
  { q: "5 × 13 = ?", a: "65" },
  { q: "3 × 11 = ?", a: "33" },
  { q: "3 × 13 = ?", a: "39" },
  { q: "4 × 3 = ?", a: "12" },
  { q: "10 × 3 = ?", a: "30" },
  { q: "4 × 11 = ?", a: "44" },
  { q: "8 × 9 = ?", a: "72" },
  { q: "10 × 12 = ?", a: "120" },
  { q: "8 × 3 = ?", a: "24" },
  { q: "8 × 11 = ?", a: "88" },
  { q: "8 × 4 = ?", a: "32" },
  { q: "6 × 10 = ?", a: "60" },
  { q: "5 × 9 = ?", a: "45" },
  { q: "6 × 5 = ?", a: "30" },
  { q: "6 × 4 = ?", a: "24" },
  { q: "3 × 9 = ?", a: "27" },
  { q: "11 × 8 = ?", a: "88" },
  { q: "4 × 8 = ?", a: "32" },
  { q: "5 × 10 = ?", a: "50" },
  { q: "6 × 9 = ?", a: "54" },
  { q: "12 × 12 = ?", a: "144" },
  { q: "3 × 3 = ?", a: "9" },
  { q: "12 × 11 = ?", a: "132" },
  { q: "8 × 3 = ?", a: "24" },
  { q: "9 × 13 = ?", a: "117" },
  { q: "9 × 9 = ?", a: "81" },
  { q: "7 × 8 = ?", a: "56" },
  { q: "77 ÷ 11 = ?", a: "7" },
  { q: "36 ÷ 9 = ?", a: "4" },
  { q: "56 ÷ 7 = ?", a: "8" },
  { q: "88 ÷ 11 = ?", a: "8" },
  { q: "65 ÷ 5 = ?", a: "13" },
  { q: "12 ÷ 3 = ?", a: "4" },
  { q: "117 ÷ 9 = ?", a: "13" },
  { q: "50 ÷ 5 = ?", a: "10" },
  { q: "40 ÷ 10 = ?", a: "4" },
  { q: "90 ÷ 10 = ?", a: "9" },
  { q: "130 ÷ 13 = ?", a: "10" },
  { q: "65 ÷ 5 = ?", a: "13" },
  { q: "9 ÷ 3 = ?", a: "3" },
  { q: "130 ÷ 10 = ?", a: "13" },
  { q: "28 ÷ 4 = ?", a: "7" },
  { q: "144 ÷ 12 = ?", a: "12" },
  { q: "99 ÷ 9 = ?", a: "11" },
  { q: "56 ÷ 8 = ?", a: "7" },
  { q: "88 ÷ 11 = ?", a: "8" },
  { q: "84 ÷ 12 = ?", a: "7" },
  { q: "66 ÷ 11 = ?", a: "6" },
  { q: "78 ÷ 6 = ?", a: "13" },
  { q: "15 ÷ 3 = ?", a: "5" },
  { q: "48 ÷ 6 = ?", a: "8" },
  { q: "156 ÷ 12 = ?", a: "13" },
  { q: "60 ÷ 12 = ?", a: "5" },
  { q: "88 ÷ 8 = ?", a: "11" },
  { q: "90 ÷ 10 = ?", a: "9" },
  { q: "91 ÷ 7 = ?", a: "13" },
  { q: "21 ÷ 3 = ?", a: "7" },
  { q: "40 ÷ 8 = ?", a: "5" },
  { q: "60 ÷ 10 = ?", a: "6" },
  { q: "42 ÷ 7 = ?", a: "6" },
  { q: "25 ÷ 5 = ?", a: "5" },
  { q: "49 ÷ 7 = ?", a: "7" },
  { q: "33 ÷ 3 = ?", a: "11" },
  { q: "9 ÷ 3 = ?", a: "3" },
  { q: "77 ÷ 7 = ?", a: "11" },
  { q: "130 ÷ 13 = ?", a: "10" },
  { q: "36 ÷ 3 = ?", a: "12" },
  { q: "91 ÷ 13 = ?", a: "7" },
  { q: "36 ÷ 6 = ?", a: "6" },
  { q: "80 ÷ 8 = ?", a: "10" },
  { q: "84 ÷ 12 = ?", a: "7" },
  { q: "35 ÷ 7 = ?", a: "5" },
  { q: "42 ÷ 7 = ?", a: "6" },
  { q: "156 ÷ 12 = ?", a: "13" },
  { q: "20 ÷ 5 = ?", a: "4" },
  { q: "52 ÷ 13 = ?", a: "4" },
  { q: "45 ÷ 5 = ?", a: "9" },
  { q: "16 ÷ 4 = ?", a: "4" },
  { q: "120 ÷ 10 = ?", a: "12" },
  { q: "130 ÷ 10 = ?", a: "13" },
  { q: "21 ÷ 3 = ?", a: "7" },
  { q: "48 ÷ 4 = ?", a: "12" },
  { q: "32 ÷ 8 = ?", a: "4" },
  { q: "104 ÷ 8 = ?", a: "13" },
  { q: "84 ÷ 12 = ?", a: "7" },
  { q: "20 ÷ 5 = ?", a: "4" },
  { q: "143 ÷ 11 = ?", a: "13" },
  { q: "156 ÷ 12 = ?", a: "13" },
  { q: "56 ÷ 7 = ?", a: "8" },
  { q: "108 ÷ 12 = ?", a: "9" },
  { q: "49 ÷ 7 = ?", a: "7" },
  { q: "120 ÷ 10 = ?", a: "12" },
  { q: "104 ÷ 8 = ?", a: "13" },
  { q: "24 ÷ 4 = ?", a: "6" },
  { q: "48 ÷ 8 = ?", a: "6" },
  { q: "108 ÷ 12 = ?", a: "9" },
  { q: "15 ÷ 5 = ?", a: "3" },
  { q: "90 ÷ 9 = ?", a: "10" },
  { q: "169 ÷ 13 = ?", a: "13" },
  { q: "40 ÷ 5 = ?", a: "8" },
  { q: "28 ÷ 4 = ?", a: "7" },
  { q: "21 ÷ 7 = ?", a: "3" },
  { q: "28 ÷ 7 = ?", a: "4" },
  { q: "39 ÷ 3 = ?", a: "13" },
  { q: "50 ÷ 10 = ?", a: "5" },
  { q: "96 ÷ 8 = ?", a: "12" },
  { q: "35 ÷ 7 = ?", a: "5" },
  { q: "144 ÷ 12 = ?", a: "12" },
  { q: "24 ÷ 8 = ?", a: "3" },
  { q: "156 ÷ 12 = ?", a: "13" },
  { q: "15 ÷ 3 = ?", a: "5" },
  { q: "32 ÷ 4 = ?", a: "8" },
  { q: "44 ÷ 11 = ?", a: "4" },
  { q: "40 ÷ 5 = ?", a: "8" },
  { q: "80 ÷ 8 = ?", a: "10" },
  { q: "44 ÷ 11 = ?", a: "4" },
  { q: "77 ÷ 11 = ?", a: "7" },
  { q: "132 ÷ 12 = ?", a: "11" },
  { q: "60 ÷ 10 = ?", a: "6" },
  { q: "30 ÷ 6 = ?", a: "5" },
  { q: "30 ÷ 10 = ?", a: "3" },
  { q: "42 ÷ 6 = ?", a: "7" },
  { q: "40 ÷ 10 = ?", a: "4" },
  { q: "40 ÷ 5 = ?", a: "8" },
  { q: "35 ÷ 7 = ?", a: "5" },
  { q: "48 ÷ 4 = ?", a: "12" },
  { q: "88 ÷ 11 = ?", a: "8" },
  { q: "40 ÷ 4 = ?", a: "10" },
  { q: "15 ÷ 5 = ?", a: "3" },
  { q: "36 ÷ 3 = ?", a: "12" },
  { q: "33 ÷ 3 = ?", a: "11" },
  { q: "77 ÷ 7 = ?", a: "11" },
  { q: "143 ÷ 11 = ?", a: "13" },
  { q: "88 ÷ 11 = ?", a: "8" },
  { q: "104 ÷ 13 = ?", a: "8" },
  { q: "27 ÷ 9 = ?", a: "3" },
  { q: "35 ÷ 5 = ?", a: "7" },
  { q: "40 ÷ 8 = ?", a: "5" },
  { q: "25 ÷ 5 = ?", a: "5" },
  { q: "20 ÷ 5 = ?", a: "4" },
  { q: "91 ÷ 7 = ?", a: "13" },
  { q: "80 ÷ 10 = ?", a: "8" },
  { q: "64 ÷ 8 = ?", a: "8" },
  { q: "24 ÷ 4 = ?", a: "6" },
  { q: "104 ÷ 13 = ?", a: "8" },
  { q: "56 ÷ 8 = ?", a: "7" },
  { q: "36 ÷ 4 = ?", a: "9" },
  ];
  function init() {
    var n = 0;
    var t = setInterval(function () {
      n++;
      var ok = true;
      if (window.X570 && X570.Events && X570.Events.EV) { EVB.forEach(function (e) { if (!X570.Events.EV.some(function (x) { return x.t === e.t; })) X570.Events.EV.push(e); }); } else ok = false;
      if (window.X570 && X570.Feed && X570.Feed.POSTS) { MOODS.forEach(function (p) { if (X570.Feed.POSTS.length < 220) X570.Feed.POSTS.push(p); }); } else ok = false;
      if (window.X570) { X570.ChatBank = CHAT; X570.OralBank = ORAL; X570.MathBank = MATH; }
      if ((ok && n > 2) || n > 120) clearInterval(t);
    }, 200);
  }
  X570.register("contentBig", init, 6);
})();

/* ===== a260_dialogue_big.js ===== */
/* 5.7.0 联系人对话库 + 综合选择题库 */
(function () {
  var H = X570H;
  var DIALOG = {
    "林晚": [
      { q: "在看什么书？", a: "一本诗集，有些句子读起来很安静，想抄给你看。" },
      { q: "今天的云好看吗？", a: "嗯，像被谁慢慢揉开的棉花，我在窗边看了很久。" },
      { q: "你写的字真好看", a: "谢谢，写字的时候心会静下来，你也可以试试。" },
      { q: "一起去图书馆吗？", a: "好，靠窗的位置留给你，我们各自安静地看书。" },
      { q: "月考紧张吗？", a: "有一点，但只要认真准备过，就不会太慌。" },
      { q: "运动会你会来看吗？", a: "会的，我在终点附近给你加油。" },
      { q: "你喜欢什么季节？", a: "秋天，桂花开的时候，连风都是香的。" },
      { q: "最近有点累", a: "那你靠窗边歇一会儿，累的时候，不必逞强。" },
      { q: "谢谢你的笔记", a: "不客气，能帮到你，我也很开心。" },
      { q: "你有什么心愿吗？", a: "想考上喜欢的城市，也想……和你在同一个城市。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "赵小雨": [
      { q: "在画什么？", a: "今天的晚霞，颜色调了好久，还是画不出现场的感觉。" },
      { q: "教我画画吧", a: "好呀，先别想画得像，大胆落笔，画画最开始是开心的事。" },
      { q: "美术生是不是很轻松？", a: "哪有，我们也要画到很晚，手上全是颜料。" },
      { q: "一起去写生吗？", a: "走！操场后面那棵树光影特别好看。" },
      { q: "你总是很开心", a: "因为不开心也要过呀，不如笑着过，还能顺便画画。" },
      { q: "送我一张画吧", a: "那我给你画一张小的，夹在你书里，别弄丢了。" },
      { q: "美术联考紧张吗？", a: "紧张，但画了那么多年，手里的笔会记得。" },
      { q: "什么颜色最好看？", a: "晚霞那种橘粉，还有你认真时的样子。" },
      { q: "板报需要帮忙吗？", a: "要要要！你帮我打边框，我来画主视觉。" },
      { q: "你想考哪个学校？", a: "想考美院，去一个有很多画和很多晚霞的城市。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "苏清颜": [
      { q: "又在练琴吗？", a: "嗯，这首曲子有个地方总弹不好，想再练几遍。" },
      { q: "可以听你弹一首吗？", a: "可以，你坐在角落就好，我会没那么紧张。" },
      { q: "钢琴难吗？", a: "刚开始难，后来手指有记忆了，就变成和自己对话。" },
      { q: "你喜欢谁的曲子？", a: "喜欢安静一点的，像月光那样的旋律。" },
      { q: "音乐社还招人吗？", a: "招的，只要你喜欢音乐，唱得不好也没关系。" },
      { q: "你话好像不多", a: "我习惯把想说的话放进琴里，你听琴就懂了。" },
      { q: "演出会紧张吗？", a: "会，但看到第一排有人在听，就会安静下来。" },
      { q: "教我认音符吧", a: "好，从最简单的开始，慢慢来。" },
      { q: "心情不好时你怎么办？", a: "去琴房弹一首慢的曲子，弹完就好多了。" },
      { q: "以后想做什么？", a: "想一直弹下去，也许考音乐学院，把喜欢的事做下去。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "许念": [
      { q: "刚打完球吗？", a: "对，加练了罚球，今天连进十个，手感不错。" },
      { q: "教我打篮球吧", a: "行，先练运球和脚步，别急着投篮。" },
      { q: "运动会报什么？", a: "100 米和接力，你们班接力缺不缺人？" },
      { q: "你怎么什么都不怕", a: "也怕啊，怕输，但更怕自己没尽全力。" },
      { q: "体测怎么办", a: "跟着我练，每天跑两圈，体测轻松过。" },
      { q: "女生打球帅吗？", a: "做自己喜欢的事，认真的样子都很帅。" },
      { q: "训练累不累？", a: "累，但球衣被汗浸透的感觉，让我觉得自己在变强。" },
      { q: "比赛输了怎么办？", a: "认，但不服，回去练，下次赢回来。" },
      { q: "你想去哪所大学？", a: "想去有好校队的学校，继续打，继续跑。" },
      { q: "一起跑步吗？", a: "走，傍晚的操场最舒服。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "班长": [
      { q: "今天有什么作业？", a: "数学卷子、英语阅读，语文还要背一首古诗，别漏了。" },
      { q: "我能帮班级做什么？", a: "运动会、大扫除、板报都缺人，你愿意来就太好了。" },
      { q: "班长累不累？", a: "累，但把事情安排明白、大家配合，就很有成就感。" },
      { q: "请假怎么请？", a: "先找班主任写假条，再到我这里登记一下。" },
      { q: "班会主题是什么？", a: "这次是目标与规划，记得准备一句自己的目标。" },
      { q: "校服一定要穿吗？", a: "周一和集会必须穿，其他时间按学校要求来。" },
      { q: "晚自习纪律", a: "安静自习，有问题小声讨论，别影响其他人。" },
      { q: "怎么安排时间？", a: "列清单，分轻重缓急，先做最重要最难的。" },
      { q: "同学有矛盾", a: "先冷静，再沟通，需要我帮忙调解可以找我。" },
      { q: "辛苦你了", a: "不辛苦，大家一起把班级带好就行。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "同桌": [
      { q: "小卖部有什么好吃的？", a: "肉松面包、烤肠、冰红茶，新出的布丁也不错。" },
      { q: "借我抄下笔记", a: "给你，字丑别嫌弃，记得回头自己再整理一遍。" },
      { q: "这题怎么写？", a: "我看看……好像是用这个公式，我们一起推。" },
      { q: "老师来了吗？", a: "来了来了，快把手机收起来，翻到昨天那一页。" },
      { q: "中午吃什么？", a: "食堂的糖醋里脊，听说今天有，去晚了就没了。" },
      { q: "你怎么又睡了？", a: "昨晚开黑太晚……等下老师来了叫我。" },
      { q: "借我橡皮", a: "拿去吧，上次借你的还没还呢，这次算你欠我两块。" },
      { q: "周末有空吗？", a: "有，先把作业写完，剩下的时间我们去打球。" },
      { q: "我紧张", a: "紧张什么，你又不是没准备，正常发挥就行。" },
      { q: "有你真好", a: "那当然，咱俩可是同桌，罩着你。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "室友阿杰": [
      { q: "今晚开黑吗？", a: "开！先把作业搞定，九点之后准时上线，五缺一。" },
      { q: "宿舍停水了？", a: "听说是检修，我们去楼下接水，你拿盆。" },
      { q: "你作业写完了吗？", a: "差一点，等我十分钟，写完这题就开黑。" },
      { q: "卧谈会聊什么？", a: "什么都聊，理想、游戏、还有隔壁班的八卦。" },
      { q: "谁最早睡？", a: "阿泽，他自律得可怕，十点半准时关灯信号。" },
      { q: "带宵夜吗？", a: "带，烤肠加泡面，记得 AA，别又让我垫。" },
      { q: "明天谁值日？", a: "轮小宇，他要是起不来，我们一起把他薅起来。" },
      { q: "你目标哪所大学？", a: "想学计算机，做游戏，毕竟打了这么多年也想自己做一个。" },
      { q: "借我充电器", a: "在床头那个，拿吧，别又不还。" },
      { q: "熄灯了小声点", a: "好好好，查寝的来了都闭嘴。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "数学老师": [
      { q: "这题没听懂", a: "哪一步？把你的思路说出来，我看看卡在哪。" },
      { q: "数学怎么提高？", a: "把概念吃透，错题分类，再配一定量的练习，急不得。" },
      { q: "作业太难了", a: "难题先放一放，把基础题做扎实，回头再看它。" },
      { q: "考试时间不够", a: "先易后难，给大题留出时间，别在一道题上死磕。" },
      { q: "为什么要学数学？", a: "学的不只是计算，是有条理地思考和解决问题。" },
      { q: "我适合学理科吗？", a: "看你愿不愿意琢磨，和聪不聪明关系没那么大。" },
      { q: "错题本怎么用？", a: "抄题、写错误原因、写正确思路，隔几天再重做一遍。" },
      { q: "函数总是错", a: "回到图像和定义，开口、对称轴、顶点，一个个看。" },
      { q: "能补补课吗？", a: "放学来办公室，我给你讲几道典型题。" },
      { q: "谢谢老师", a: "不用谢，你愿意问，老师就愿意讲。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "班主任": [
      { q: "我最近状态不好", a: "进来坐，慢慢说，是学习上的压力，还是生活上的事？" },
      { q: "成绩下滑了", a: "我们一起看看卷子，找找原因，一次下滑不等于失败。" },
      { q: "想请个假", a: "说说原因，身体不舒服就好好休息，写个假条。" },
      { q: "怎么提高自律？", a: "定一个小目标，找同伴互相监督，比硬扛更有效。" },
      { q: "和同学闹矛盾了", a: "先冷静，把自己的感受说清楚，也听听对方的。" },
      { q: "对未来很迷茫", a: "迷茫很正常，先把手头的事做好，方向会慢慢清晰。" },
      { q: "班级最近怎么样？", a: "整体不错，就是有几个同学在松懈，希望你带头稳住。" },
      { q: "可以换座位吗？", a: "给我个理由，学习上有需要，我会考虑。" },
      { q: "压力大睡不着", a: "别硬撑，调整作息，必要时去心理老师那里坐坐。" },
      { q: "谢谢老师关心", a: "你们好，老师就放心了。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "心理老师": [
      { q: "我总是很焦虑", a: "焦虑是对未来的担心，我们把它具体化，一次只解决一件。" },
      { q: "和家人吵架了", a: "先照顾情绪，等双方都平静了，再用‘我’开头表达感受。" },
      { q: "觉得自己不够好", a: "别拿别人的高光时刻，和自己的日常比较，你有你的节奏。" },
      { q: "考试前睡不着", a: "提前调整作息，睡前放松，把担心写下来，再上床。" },
      { q: "朋友不理我了", a: "关系有起伏很正常，给彼此一点空间，真诚地沟通。" },
      { q: "我好像很孤独", a: "愿意说出这句话，本身就很勇敢。孤独时，可以先从一次问候开始。" },
      { q: "控制不住情绪", a: "情绪没有对错，先接纳它，再找健康的方式释放，比如运动和书写。" },
      { q: "需要看医生吗？", a: "如果长时间睡不好、情绪低落，建议找专业医生评估，这很正常。" },
      { q: "怎么放松？", a: "深呼吸、慢走、听音乐、写日记，找一种让你慢下来的方式。" },
      { q: "谢谢你愿意听", a: "这里随时欢迎你，你不必独自扛着一切。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "食堂阿姨": [
      { q: "今天有什么菜？", a: "红烧鸡块、糖醋里脊、炒青菜，汤在那边自己打。" },
      { q: "给我多打点", a: "好嘞，长身体呢，给你堆高点。" },
      { q: "哪个菜最好吃？", a: "今天的糖醋里脊，晚了可就没了。" },
      { q: "饭卡没钱了", a: "那边机器可以充值，先刷同学的也行，记得还。" },
      { q: "有水果吗？", a: "有，苹果和香蕉，吃完饭来一份，营养均衡。" },
      { q: "为什么这么好吃？", a: "哈哈，用心做，你们吃得香，阿姨就高兴。" },
      { q: "有清真窗口吗？", a: "有的，在最里面那一排，你往那边走。" },
      { q: "能打包吗？", a: "可以，用打包盒，注意趁热吃。" },
      { q: "汤要钱吗？", a: "汤免费，自己拿碗打，别浪费。" },
      { q: "谢谢阿姨", a: "慢点吃，不够再来。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "体育老师": [
      { q: "体测怎么过？", a: "平时多练，跑步循序渐进，临考前一周别受伤。" },
      { q: "跑 800 米好累", a: "控制配速，别一开始猛冲，保持呼吸节奏。" },
      { q: "怎么练跳远？", a: "练蹬地和摆臂，落地往前送，别往后坐。" },
      { q: "我可以不跑吗？", a: "身体不舒服就申请见习，别硬撑，安全第一。" },
      { q: "篮球怎么入门？", a: "先练运球和三步上篮，基本功最实在。" },
      { q: "运动会怎么选项目？", a: "按自己的长处选，速度好选短跑，耐力好选中长跑。" },
      { q: "怎么热身？", a: "慢跑加动态拉伸，把关节活动开，再上强度。" },
      { q: "肌肉拉伤了", a: "先停止运动，冷敷、休息，严重的话去医务室。" },
      { q: "怎么提高体能？", a: "每周三次有氧，配合力量训练，坚持就有效果。" },
      { q: "谢谢老师", a: "好好锻炼，身体是学习的本钱。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "校园橘猫": [
      { q: "你叫什么名字？", a: "（喵——它似乎没有名字，谁给吃的谁就是好人。）" },
      { q: "给你火腿肠", a: "（它立刻凑过来，三两口吃完，蹭了蹭你的裤脚。）" },
      { q: "你冷不冷？", a: "（它蜷成一团，尾巴盖住鼻子，眯着眼继续晒太阳。）" },
      { q: "我能抱你吗？", a: "（它犹豫了一下，跳上了旁边的花坛，保持着礼貌的距离。）" },
      { q: "你每天都在这吗？", a: "（喵。）——大概是的，花坛是它的地盘。" },
      { q: "你也上课吗？", a: "（它打了个哈欠，仿佛在说：晒太阳就是我的课。）" },
      { q: "你有主人吗？", a: "（全校都是它的投喂员，它属于整个校园。）" },
      { q: "别睡了陪我玩", a: "（它翻了个身，肚皮朝上，算是邀请。）" },
      { q: "我要上课了", a: "（它挥了挥尾巴，像是在说去吧。）" },
      { q: "再见小猫", a: "（它懒洋洋地喵了一声，算是道别。）" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "门卫大叔": [
      { q: "我丢了校园卡", a: "来登记一下，捡到的会放在门卫室，你留个联系方式。" },
      { q: "晚了能进吗？", a: "下不为例，注意安全，下次早点回。" },
      { q: "能收快递吗？", a: "快递在那边架子上，自己找，找完签个名。" },
      { q: "自行车放哪？", a: "停在车棚，记得上锁，别乱停堵路。" },
      { q: "家长来接在哪等？", a: "校门口右侧有等候区，让他们在那边等。" },
      { q: "有东西落在教室了", a: "找班主任开个条，我让你进去取。" },
      { q: "外校人能进吗？", a: "要登记、说明来意，不能随便进。" },
      { q: "放学人多注意点", a: "对，排队有序出去，别拥挤，注意车辆。" },
      { q: "捡到一把伞", a: "拿来放这儿，失主会来问，你是好心人。" },
      { q: "谢谢大叔", a: "没事，看好你们的安全是我的工作。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "广播台主播": [
      { q: "能点歌吗？", a: "可以，把歌名和想送的人写在点歌本上，明天中午播。" },
      { q: "怎么加入广播台？", a: "招新时来试音，喜欢播音和剪辑都欢迎。" },
      { q: "今天放什么歌？", a: "中午有一首很温柔的歌，记得打开广播听。" },
      { q: "广播稿能自己写吗？", a: "当然，主题积极、内容合适，我们帮你播。" },
      { q: "紧张说不出话", a: "对着麦克风先深呼吸，把听众当成朋友。" },
      { q: "广播站在哪？", a: "综合楼三楼，门贴着音符的那间。" },
      { q: "能播祝福吗？", a: "可以，生日、加油、感谢都可以，写清楚就行。" },
      { q: "你们什么时候播？", a: "工作日午休和放学后，留意校园广播。" },
      { q: "我也想做主播", a: "来试试，声音好听不重要，真诚最打动人。" },
      { q: "谢谢", a: "谢谢你的聆听，我们中午见。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
    "高三学长": [
      { q: "高中累吗？", a: "累，但你会习惯这种为目标拼命的感觉，也会怀念。" },
      { q: "高一该怎么过？", a: "打好基础，养成好习惯，别把高一过得太松。" },
      { q: "选科怎么选？", a: "结合兴趣、成绩和想报的专业，别只看哪科轻松。" },
      { q: "高考可怕吗？", a: "准备充分就不可怕，它更像一场水到渠成的检验。" },
      { q: "如何坚持？", a: "找一个让你想坚持的理由，再找一群一起努力的人。" },
      { q: "会后悔吗？", a: "只后悔没尽全力，不后悔拼过的那些日子。" },
      { q: "怎么处理感情？", a: "好的感情会让两个人一起变优秀，而不是互相拖累。" },
      { q: "晚自习怎么利用？", a: "先完成作业，再整理错题和预习，少抬头看表。" },
      { q: "你想考哪里？", a: "目标很远，但每天靠近一点，就不觉得远了。" },
      { q: "学长加油", a: "你们也要加油，我在前头等你们。" },
      { q: "今天怎么样？", a: "还不错，就是有点忙，不过很充实。" },
      { q: "一起加油呀", a: "好呀，我们都要努力，别掉队。" },
      { q: "放学一起走吗？", a: "好啊，校门口见，记得带伞。" },
      { q: "你最近在忙什么？", a: "忙学习，也忙自己喜欢的事，时间过得挺快的。" },
    ],
  };
  var MCQ = [
    { q: "下列词语中没有错别字的一项是", o: ["再接再厉", "再接再励", "在接再厉", "在接再励"], a: 0 },
    { q: "“床前明月光”的下一句是", o: ["疑是地上霜", "举头望明月", "低头思故乡", "月是故乡明"], a: 0 },
    { q: "sin 45° 的值是", o: ["1/2", "√2/2", "√3/2", "1"], a: 1 },
    { q: "一元二次方程 x²-5x+6=0 的根是", o: ["1 和 6", "2 和 3", "-2 和 -3", "1 和 5"], a: 1 },
    { q: "光在真空中的传播速度约为", o: ["3 万千米/秒", "30 万千米/秒", "300 万千米/秒", "3 千千米/秒"], a: 1 },
    { q: "下列属于氧化物的是", o: ["NaCl", "H₂O", "O₂", "H₂"], a: 1 },
    { q: "光合作用的场所是", o: ["线粒体", "细胞核", "叶绿体", "细胞膜"], a: 2 },
    { q: "我国地势的总体特征是", o: ["东高西低", "西高东低", "中间高四周低", "北高南低"], a: 1 },
    { q: "世界上面积最大的大洋是", o: ["大西洋", "印度洋", "北冰洋", "太平洋"], a: 3 },
    { q: "“good”的比较级是", o: ["gooder", "better", "best", "more good"], a: 1 },
    { q: "直角三角形两直角边为 6 和 8，斜边是", o: ["10", "12", "14", "9"], a: 0 },
    { q: "圆的面积公式是", o: ["2πr", "πr²", "πd", "2πr²"], a: 1 },
    { q: "下列属于可再生能源的是", o: ["煤炭", "石油", "太阳能", "天然气"], a: 2 },
    { q: "pH=7 的溶液呈", o: ["酸性", "中性", "碱性", "无法判断"], a: 1 },
    { q: "人体呼吸作用的主要场所是", o: ["叶绿体", "线粒体", "细胞核", "液泡"], a: 1 },
    { q: "中国的首都是", o: ["上海", "广州", "北京", "南京"], a: 2 },
    { q: "“三人行”的下一句是", o: ["必有我师焉", "不亦说乎", "温故而知新", "学而不思则罔"], a: 0 },
    { q: "欧姆定律的表达式是", o: ["P=UI", "I=U/R", "F=ma", "W=Fs"], a: 1 },
    { q: "下列气体中能使澄清石灰水变浑浊的是", o: ["氧气", "氮气", "二氧化碳", "氢气"], a: 2 },
    { q: "一年有多少个节气", o: ["12", "24", "36", "48"], a: 1 },
    { q: "DNA 的中文全称是", o: ["核糖核酸", "脱氧核糖核酸", "氨基酸", "葡萄糖"], a: 1 },
    { q: "“先天下之忧而忧”出自", o: ["醉翁亭记", "岳阳楼记", "桃花源记", "陋室铭"], a: 1 },
    { q: "声音不能在下列哪种环境中传播", o: ["空气", "水", "钢铁", "真空"], a: 3 },
    { q: "下列金属中活动性最强的是", o: ["铜", "铁", "钾", "金"], a: 2 },
    { q: "标准大气压下水的沸点是", o: ["80℃", "90℃", "100℃", "120℃"], a: 2 },
    { q: "“library”的意思是", o: ["实验室", "图书馆", "操场", "食堂"], a: 1 },
    { q: "世界最高峰是", o: ["乔戈里峰", "珠穆朗玛峰", "乞力马扎罗山", "富士山"], a: 1 },
    { q: "我国最长的河流是", o: ["黄河", "珠江", "长江", "黑龙江"], a: 2 },
    { q: "正方体有多少条棱", o: ["6", "8", "12", "24"], a: 2 },
    { q: "下列属于生物的是", o: ["珊瑚虫", "机器人", "钟乳石", "汽车"], a: 0 },
    { q: "受力面积一定时，压力越大压强", o: ["越大", "越小", "不变", "为零"], a: 0 },
    { q: "“但愿人长久”的下一句是", o: ["千里共婵娟", "明月几时有", "把酒问青天", "高处不胜寒"], a: 0 },
    { q: "英语中表示“昨天”的词是", o: ["tomorrow", "yesterday", "today", "tonight"], a: 1 },
    { q: "浮力的计算公式（阿基米德原理）是", o: ["F=ρgh", "F浮=ρ液gV排", "F=ma", "p=F/S"], a: 1 },
    { q: "下列属于单细胞生物的是", o: ["草履虫", "蚯蚓", "青蛙", "水稻"], a: 0 },
    { q: "地球公转一周的时间约为", o: ["一天", "一个月", "一年", "十年"], a: 2 },
    { q: "我国使用的统一时间是", o: ["东六区", "东七区", "东八区", "东九区"], a: 2 },
    { q: "“忽如一夜春风来”的下一句是", o: ["千树万树梨花开", "春风又绿江南岸", "二月春风似剪刀", "映日荷花别样红"], a: 0 },
    { q: "下列物质中属于纯净物的是", o: ["空气", "海水", "蒸馏水", "土壤"], a: 2 },
    { q: "牛顿第一定律又称为", o: ["惯性定律", "万有引力定律", "作用力定律", "能量守恒定律"], a: 0 },
    { q: "“春风又绿江南岸”的下一句是", o: ["明月何时照我还", "千里共婵娟", "春风送暖入屠苏", "万紫千红总是春"], a: 0 },
    { q: "下列属于化学变化的是", o: ["冰雪融化", "纸张燃烧", "玻璃破碎", "水结成冰"], a: 1 },
    { q: "一个三角形内角和是", o: ["90°", "180°", "360°", "270°"], a: 1 },
    { q: "“weather”的中文意思是", o: ["季节", "天气", "温度", "气候"], a: 1 },
    { q: "下列动物中属于哺乳动物的是", o: ["鲸鱼", "鲨鱼", "海龟", "青蛙"], a: 0 },
    { q: "电流的单位是", o: ["伏特", "安培", "欧姆", "瓦特"], a: 1 },
    { q: "我国第一部纪传体通史是", o: ["汉书", "史记", "资治通鉴", "春秋"], a: 1 },
    { q: "下列属于酸性食物的是", o: ["柠檬", "海带", "菠菜", "小苏打"], a: 0 },
    { q: "“感时花溅泪”的下一句是", o: ["恨别鸟惊心", "城春草木深", "家书抵万金", "浑欲不胜簪"], a: 0 },
    { q: "圆的周长公式是", o: ["πr²", "2πr", "πd²", "2πr²"], a: 1 },
    { q: "光合作用的产物主要是", o: ["二氧化碳和水", "有机物和氧气", "氮气", "无机盐"], a: 1 },
    { q: "世界上人口最多的国家之一、位于东亚的是", o: ["印度", "中国", "日本", "韩国"], a: 1 },
    { q: "“good luck”的意思是", o: ["再见", "祝你好运", "早上好", "谢谢你"], a: 1 },
    { q: "下列属于可再生资源的是", o: ["铁矿", "石油", "森林", "煤炭"], a: 2 },
    { q: "力的国际单位是", o: ["焦耳", "牛顿", "帕斯卡", "瓦特"], a: 1 },
    { q: "“落霞与孤鹜齐飞”出自", o: ["岳阳楼记", "滕王阁序", "赤壁赋", "兰亭集序"], a: 1 },
    { q: "化学变化中最小的粒子是", o: ["分子", "原子", "离子", "电子"], a: 1 },
    { q: "下列属于放热反应的是", o: ["冰融化", "燃烧", "水蒸发", "盐溶解"], a: 1 },
    { q: "一个正方体有多少个面", o: ["4", "6", "8", "12"], a: 1 },
    { q: "“breakfast”的意思是", o: ["午餐", "晚餐", "早餐", "点心"], a: 2 },
    { q: "血液中运输氧气的是", o: ["白细胞", "红细胞", "血小板", "血浆"], a: 1 },
    { q: "中国面积最大的省级行政区是", o: ["西藏", "新疆", "内蒙古", "青海"], a: 1 },
    { q: "“会当凌绝顶”的下一句是", o: ["一览众山小", "江春入旧年", "山色有无中", "城春草木深"], a: 0 },
    { q: "下列属于导体的是", o: ["橡胶", "玻璃", "铜", "陶瓷"], a: 2 },
    { q: "地球自转一周的时间约为", o: ["一年", "一个月", "一天", "一小时"], a: 2 },
    { q: "“三人行必有我师焉”出自", o: ["孟子", "论语", "大学", "中庸"], a: 1 },
    { q: "下列物质中属于溶液的是", o: ["泥水", "蒸馏水", "食盐水", "牛奶"], a: 2 },
    { q: "机械能包括动能和", o: ["热能", "势能", "化学能", "电能"], a: 1 },
    { q: "“How old are you?”是在问", o: ["你好吗", "你多大", "你是谁", "你去哪"], a: 1 },
  ];
  function init() {
    X570.DialogBank = DIALOG;
    X570.MCQBank = MCQ;
  }
  X570.register("dialogBig", init, 6);
})();

/* ===== a270_wardrobe.js ===== */
/* =====================================================================
   我的装扮：发型 / 表情 / 校服 / 配饰 / 背景，可搭配预览并保存
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_wardrobe_v1";

  var CATS = {
    hair: { n: "发型", items: [
      { id: "h0", n: "清爽短发", ic: "💇" },
      { id: "h1", n: "微分碎盖", ic: "🧑" },
      { id: "h2", n: "利落寸头", ic: "👨" },
      { id: "h3", n: "自然中分", ic: "🙂" },
      { id: "h4", n: "运动短发", ic: "🏃" },
      { id: "h5", n: "文艺长发", ic: "🎨" },
      { id: "h6", n: "高马尾", ic: "🎀" },
      { id: "h7", n: "齐肩短发", ic: "🌷" }
    ]},
    face: { n: "表情", items: [
      { id: "f0", n: "微笑", ic: "😊" },
      { id: "f1", n: "认真", ic: "🤔" },
      { id: "f2", n: "开朗", ic: "😄" },
      { id: "f3", n: "酷酷", ic: "😎" },
      { id: "f4", n: "腼腆", ic: "☺️" },
      { id: "f5", n: "元气", ic: "🤩" }
    ]},
    uniform: { n: "校服", items: [
      { id: "u0", n: "经典校服", ic: "👔" },
      { id: "u1", n: "运动套装", ic: "🥼" },
      { id: "u2", n: "秋季外套", ic: "🧥" },
      { id: "u3", n: "夏季短袖", ic: "👕" },
      { id: "u4", n: "冬季棉服", ic: "🧣" },
      { id: "u5", n: "礼服套装", ic: "🤵" }
    ]},
    acc: { n: "配饰", items: [
      { id: "a0", n: "无", ic: "🚫" },
      { id: "a1", n: "黑框眼镜", ic: "👓" },
      { id: "a2", n: "运动手表", ic: "⌚" },
      { id: "a3", n: "耳机", ic: "🎧" },
      { id: "a4", n: "校园卡套", ic: "🪪" },
      { id: "a5", n: "棒球帽", ic: "🧢" },
      { id: "a6", n: "围巾", ic: "🧣" },
      { id: "a7", n: "书包挂件", ic: "🎒" }
    ]},
    bg: { n: "背景", items: [
      { id: "b0", n: "西子湖", ic: "🌊" },
      { id: "b1", n: "操场", ic: "🏟️" },
      { id: "b2", n: "教室", ic: "🏫" },
      { id: "b3", n: "图书馆", ic: "📚" },
      { id: "b4", n: "樱花道", ic: "🌸" },
      { id: "b5", n: "晚霞", ic: "🌇" },
      { id: "b6", n: "星空", ic: "🌌" }
    ]}
  };

  var BG = {
    b0: "linear-gradient(160deg,#0f3b57,#1f6f8b)",
    b1: "linear-gradient(160deg,#3a6b35,#7fae5b)",
    b2: "linear-gradient(160deg,#5b6f8f,#9fb2c9)",
    b3: "linear-gradient(160deg,#6b5436,#b79a6b)",
    b4: "linear-gradient(160deg,#c77d9b,#f2c2d4)",
    b5: "linear-gradient(160deg,#e07b5a,#f2b263)",
    b6: "linear-gradient(160deg,#1a1a3e,#4a3f7a)"
  };

  function load() {
    try {
      var s = JSON.parse(lsGet(KEY, "null"));
      if (s) return s;
    } catch (e) {}
    return { hair: "h0", face: "f0", uniform: "u0", acc: "a0", bg: "b0" };
  }
  function findItem(cat, id) {
    var list = CATS[cat].items;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0];
  }

  function open() {
    var st = load();
    var cur = "hair";
    var el = H.openFull("x570Sub", "👗 我的装扮");
    var body = el.querySelector(".x570-full-body");
    function preview() {
      var hair = findItem("hair", st.hair).ic;
      var face = findItem("face", st.face).ic;
      var uni = findItem("uniform", st.uniform).ic;
      var acc = findItem("acc", st.acc).ic;
      var bg = BG[st.bg] || BG.b0;
      return '<div class="x570-avatar-stage" style="background:' + bg + '">' +
        '<div class="x570-avatar"><span class="av-acc">' + acc + '</span>' +
        '<span class="av-hair">' + hair + '</span><span class="av-face">' + face + '</span>' +
        '<span class="av-uni">' + uni + '</span></div>' +
        '<div class="x570-avatar-name">' + esc(findItem("hair", st.hair).n) + " · " + esc(findItem("face", st.face).n) + "</div></div>";
    }
    function render() {
      var tabs = Object.keys(CATS).map(function (k) {
        return '<button class="x570-ach-tab ' + (cur === k ? "on" : "") + '" data-cat="' + k + '">' + CATS[k].n + "</button>";
      }).join("");
      var items = CATS[cur].items.map(function (it) {
        return '<div class="x570-campus-item ' + (st[cur] === it.id ? "x570-sel" : "") + '" data-id="' + it.id + '">' +
          '<div class="ic">' + it.ic + '</div><div class="n">' + esc(it.n) + "</div>" +
          (st[cur] === it.id ? '<div class="d">已选 ✓</div>' : '<div class="d">点击选择</div>') + "</div>";
      }).join("");
      body.innerHTML = preview() +
        '<div class="x570-ach-tabs">' + tabs + "</div>" +
        '<div class="x570-campus-grid">' + items + "</div>" +
        '<div style="display:flex;gap:10px;margin-top:12px">' +
        '<button class="x570-btn" id="wSave" style="flex:1">保存搭配</button>' +
        '<button class="x570-btn" id="wReset" style="flex:1">恢复默认</button></div>';
      on(body, "click", function (e) {
        var t = e.target.closest("[data-cat]");
        if (t) { cur = t.getAttribute("data-cat"); render(); }
        var it = e.target.closest("[data-id]");
        if (it) { st[cur] = it.getAttribute("data-id"); render(); }
      });
      on($("#wSave"), "click", function () {
        try { lsSet(KEY, JSON.stringify(st)); } catch (e) {}
        H.toast("搭配已保存");
      });
      on($("#wReset"), "click", function () {
        st = { hair: "h0", face: "f0", uniform: "u0", acc: "a0", bg: "b0" };
        try { lsSet(KEY, JSON.stringify(st)); } catch (e) {}
        render();
        H.toast("已恢复默认");
      });
    }
    render();
  }

  X570.CampusSub.dress = open;
  X570.Wardrobe = { open: open, load: load, CATS: CATS, BG: BG };
})();

/* ===== a280_dorm.js ===== */
/* =====================================================================
   宿舍生活：夜谈会 / 宿舍值日 / 早起打卡 / 宿舍氛围
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_dorm_v1";

  var NIGHT_TOPICS = [
    { t: "理想大学", a: "阿杰说想学计算机，小宇想做和体育有关的，阿泽说先把眼前的月考过了。大家聊到很晚，眼睛却越来越亮。", fx: { mood: 3, social: 2 } },
    { t: "喜欢的类型", a: "宿舍忽然安静下来，然后有人小声说了一个名字，众人哄笑。你也在心里，想起了那个靠窗的身影。", fx: { mood: 3, social: 2 } },
    { t: "鬼故事", a: "阿杰讲得绘声绘色，小宇吓得把头埋进被子里。走廊外恰好传来脚步声，全宿舍瞬间安静。", fx: { mood: 2, social: 2 } },
    { t: "考试吐槽", a: "大家轮流吐槽这次最难的题，发现原来不会的人不止自己一个，莫名安心了。", fx: { mood: 2, knowledge: 1 } },
    { t: "家乡的味道", a: "你说你想念家里的一道菜，阿泽说他也是。约定放假回家，各自吃一顿好的。", fx: { mood: 2, social: 1 } },
    { t: "未来的梦想", a: "有人想当工程师，有人想当老师，有人想做游戏。夜色里，梦想显得特别具体。", fx: { mood: 3, knowledge: 1 } },
    { t: "运动会预测", a: "你们热烈讨论谁能拿第一，顺便定了宿舍之间的小赌约。", fx: { mood: 2, social: 2 } },
    { t: "深夜食堂", a: "有人摸出一包泡面，全宿舍瞬间沦陷，一人一口，吃到连汤都不剩。", fx: { mood: 3, health: -1, money: -2 } },
    { t: "童年趣事", a: "大家轮流讲小时候的糗事，笑声大到差点引来查寝的老师。", fx: { mood: 3, social: 2 } },
    { t: "互相鼓励", a: "气氛忽然认真起来，你们约定：再难也要一起坚持，谁也不许掉队。", fx: { mood: 3, knowledge: 1, social: 2 } }
  ];
  var MORNING = [
    "你被阿泽的闹钟叫醒，揉着眼爬起来，赶上了晨跑。",
    "今天你比所有人都早，洗漱完还背了一会儿单词。",
    "你睡眼惺忪，却没迟到，在食堂吃到了热乎的豆浆。",
    "晨跑时你跑到了队伍前面，风很凉，人很清醒。"
  ];
  var CHORES = ["扫地", "拖地", "倒垃圾", "擦窗台", "整理书桌", "换饮水机", "打扫阳台", "清理卫生角"];

  function load() {
    try {
      var d = JSON.parse(lsGet(KEY, "null"));
      if (d) return d;
    } catch (e) {}
    var d = { vibe: 60, clean: 50, early: 0, night: 0, chore: "", choreDate: "" };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }
  function today() { return new Date().toDateString(); }
  function applyFx(fx) {
    if (!window.G) return;
    Object.keys(fx || {}).forEach(function (k) {
      if (typeof G[k] === "number") G[k] = Math.max(0, Math.min(100, G[k] + fx[k]));
    });
  }

  function open() {
    var d = load();
    if (d.choreDate !== today()) {
      d.chore = CHORES[Math.floor(Math.random() * CHORES.length)];
      d.choreDate = today();
    }
    var el = H.openFull("x570Sub", "🛏️ 宿舍生活");
    var body = el.querySelector(".x570-full-body");
    function bar(v, color) {
      return '<div class="x570-bar"><div class="x570-bar-i" style="width:' + v + "%;background:" + color + '"></div></div>';
    }
    function render() {
      var html = '<div class="x570-card"><div class="t">🏠 我们的宿舍</div>' +
        '<div class="d">宿舍氛围</div>' + bar(d.vibe, "#ff9fa8") +
        '<div class="d">卫生状况</div>' + bar(d.clean, "#7bc47f") +
        '<div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap">' +
        '<span class="x570-chip">早起打卡 ' + d.early + " 次</span>" +
        '<span class="x570-chip">夜谈会 ' + d.night + " 次</span></div></div>";
      html += '<div class="x570-card"><div class="t">今日值日：' + esc(d.chore) + "</div>" +
        '<button class="x570-btn" id="doChore" style="margin-top:8px">认真完成「' + esc(d.chore) + "」</button></div>";
      html += '<div class="x570-campus-grid">' +
        '<div class="x570-campus-item" id="dEarly"><div class="ic">🌅</div><div class="n">早起打卡</div><div class="d">晨跑/背单词</div></div>' +
        '<div class="x570-campus-item" id="dNight"><div class="ic">🌙</div><div class="n">宿舍夜谈会</div><div class="d">聊一个话题</div></div>' +
        '<div class="x570-campus-item" id="dTidy"><div class="ic">🧹</div><div class="n">整理内务</div><div class="d">提升卫生</div></div>' +
        '<div class="x570-campus-item" id="dStudy"><div class="ic">📖</div><div class="n">晚自习预习</div><div class="d">安静学习</div></div>' +
        "</div>";
      html += '<div class="x570-card x570-center"><div class="d">宿舍是第二个家，和室友一起把它经营好。</div></div>';
      body.innerHTML = html;

      on($("#doChore"), "click", function () {
        d.clean = Math.min(100, d.clean + 12);
        d.vibe = Math.min(100, d.vibe + 3);
        applyFx({ social: 1, mood: 1 });
        save(d);
        H.toast("「" + d.chore + "」完成，宿舍焕然一新");
        render();
      });
      on($("#dEarly"), "click", function () {
        d.early++;
        d.vibe = Math.min(100, d.vibe + 2);
        applyFx({ health: 2, knowledge: 1 });
        save(d);
        H.toast(MORNING[Math.floor(Math.random() * MORNING.length)]);
        render();
      });
      on($("#dNight"), "click", function () {
        var tp = NIGHT_TOPICS[Math.floor(Math.random() * NIGHT_TOPICS.length)];
        d.night++;
        d.vibe = Math.min(100, d.vibe + 6);
        d.clean = Math.max(0, d.clean - 2);
        applyFx(tp.fx);
        save(d);
        H.modal("<h3 style='margin:0 0 10px'>🌙 夜谈会 · " + esc(tp.t) + "</h3><div style='line-height:1.8;font-size:15px'>" + esc(tp.a) + "</div>");
        render();
      });
      on($("#dTidy"), "click", function () {
        d.clean = Math.min(100, d.clean + 10);
        d.vibe = Math.min(100, d.vibe + 2);
        applyFx({ mood: 1 });
        save(d);
        H.toast("内务整理完毕，心情也清爽了");
        render();
      });
      on($("#dStudy"), "click", function () {
        d.vibe = Math.max(0, d.vibe - 1);
        applyFx({ knowledge: 2, mood: 1 });
        save(d);
        H.toast("安静预习了一段时间，很充实");
        render();
      });
    }
    render();
  }

  X570.CampusSub.dorm = open;
  X570.Dorm = { open: open, NIGHT_TOPICS: NIGHT_TOPICS };
})();

/* ===== a300_games_c.js ===== */
/* =====================================================================
   新小游戏 C：反应力测试 / 打字竞速 / 找茬 / 颜色干扰（DOM 可玩，无需 canvas）
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc;

  function shell(title, bodyHtml) {
    var wrap = '<div style="padding:14px;max-width:560px;margin:0 auto"><h3 style="text-align:center;margin:0 0 12px">' + title + "</h3>" + bodyHtml + "</div>";
    try { if (window.XZ13 && XZ13.modal) { XZ13.modal(wrap); return document.getElementById("modalbox") || document.getElementById("modal"); } } catch (e) {}
    return H.modal(wrap);
  }
  function bestKey(k, v) {
    try { if (window.XZ13 && XZ13.best) return XZ13.best(k, v); } catch (e) {}
    var KEY = "xz13_best_" + k;
    var old = 0;
    try { old = +localStorage.getItem(KEY) || 0; } catch (e) {}
    if (typeof v === "number" && v > old) { try { localStorage.setItem(KEY, v); } catch (e) {} return v; }
    return old;
  }

  /* ---------- 1. 反应力测试 ---------- */
  function react() {
    var box = shell("⚡ 反应力测试",
      '<div id="rc" style="height:260px;border-radius:16px;background:#3a6ea5;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;text-align:center;padding:20px">点击开始，等待变绿后立刻点击！</div>' +
      '<div style="text-align:center;margin-top:10px">最快记录：<b id="rb">0</b> ms</div>');
    var rc = box.querySelector("#rc"), rb = box.querySelector("#rb");
    rb.textContent = bestKey("gx570react");
    var state = "idle", t0 = 0, timer = null;
    function set(txt, bg) { rc.textContent = txt; rc.style.background = bg; }
    on(rc, "click", function () {
      if (state === "idle") {
        state = "wait";
        set("等待变绿……", "#c0504d");
        timer = setTimeout(function () {
          state = "go"; t0 = Date.now(); set("现在点击！", "#4caf50");
        }, 1200 + Math.random() * 2200);
      } else if (state === "wait") {
        clearTimeout(timer); state = "idle";
        set("太早了！点击重新开始", "#c0504d");
      } else if (state === "go") {
        var ms = Date.now() - t0;
        state = "idle";
        var b = bestKey("gx570react", ms);
        rb.textContent = b;
        set("你的反应：" + ms + " ms（点击再来）", "#3a6ea5");
      }
    });
  }

  /* ---------- 2. 颜色干扰（Stroop） ---------- */
  var COLORS = [["红", "#e4564d"], ["蓝", "#3a6ea5"], ["绿", "#4caf50"], ["黄", "#e0b33a"], ["紫", "#8e5bb0"], ["橙", "#e08a3c"]];
  function stroop() {
    var score = 0, time = 30, left = time, timer = null;
    var box = shell("🎨 颜色干扰",
      '<div style="display:flex;justify-content:space-between"><span>得分 <b id="ss">0</b></span><span>剩余 <b id="st">30</b>s</span></div>' +
      '<div id="sw" style="height:150px;display:flex;align-items:center;justify-content:center;font-size:46px;font-weight:bold;margin:10px 0"></div>' +
      '<div id="sbtns" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px"></div>');
    var sw = box.querySelector("#sw"), ss = box.querySelector("#ss"), st = box.querySelector("#st"), btns = box.querySelector("#sbtns");
    function round() {
      var word = COLORS[Math.floor(Math.random() * COLORS.length)];
      var show = COLORS[Math.floor(Math.random() * COLORS.length)];
      sw.textContent = word[0];
      sw.style.color = show[1];
      sw.dataset.ans = show[0];
      btns.innerHTML = COLORS.map(function (c) {
        return '<button class="x570-btn sbtn" data-c="' + c[0] + '" style="background:' + c[1] + ';color:#fff">' + c[0] + "</button>";
      }).join("");
    }
    on(btns, "click", function (e) {
      var b = e.target.closest(".sbtn");
      if (!b) return;
      if (b.getAttribute("data-c") === sw.dataset.ans) { score++; ss.textContent = score; }
      round();
    });
    round();
    timer = setInterval(function () {
      left--; st.textContent = left;
      if (left <= 0) {
        clearInterval(timer);
        var bb = bestKey("gx570stroop", score);
        sw.innerHTML = "结束！得分 " + score + "<br>最佳 " + bb;
        sw.style.fontSize = "22px";
        btns.innerHTML = '<button class="x570-btn" id="sagain" style="grid-column:1/4">再玩一次</button>';
        on(box.querySelector("#sagain"), "click", stroop);
      }
    }, 1000);
  }

  /* ---------- 3. 打字/抄写竞速（中文短句） ---------- */
  var SENT = ["今天的晚霞是橘粉色的", "认真学习的人自带光芒", "心之所向素履以往", "食堂的热汤很暖胃", "运动会为班级加油", "把错题整理成笔记", "早起的操场只有我和朝阳", "图书馆靠窗的位置很安静", "和同桌一起攻克难题", "晚自习的灯光很温柔"];
  function typeGame() {
    var sent = SENT[Math.floor(Math.random() * SENT.length)];
    var left = 45, done = 0, timer = null;
    var box = shell("⌨️ 抄写竞速",
      '<div style="display:flex;justify-content:space-between"><span>完成 <b id="tn">0</b> 句</span><span>剩余 <b id="tt">45</b>s</span></div>' +
      '<div id="tg" style="font-size:22px;margin:14px 0;line-height:1.6;text-align:center;color:#333"></div>' +
      '<input id="ti" style="width:100%;padding:12px;font-size:18px;border-radius:10px;box-sizing:border-box" placeholder="照着上面的句子输入…">');
    var tg = box.querySelector("#tg"), ti = box.querySelector("#ti"), tn = box.querySelector("#tn"), tt = box.querySelector("#tt");
    function next() {
      sent = SENT[Math.floor(Math.random() * SENT.length)];
      tg.textContent = sent;
      ti.value = "";
      ti.focus();
    }
    next();
    on(ti, "input", function () {
      if (ti.value.trim() === sent) { done++; tn.textContent = done; next(); }
    });
    timer = setInterval(function () {
      left--; tt.textContent = left;
      if (left <= 0) {
        clearInterval(timer);
        var bb = bestKey("gx570type", done);
        tg.innerHTML = "结束！完成 " + done + " 句<br>最佳 " + bb;
        ti.style.display = "none";
      }
    }, 1000);
  }

  /* ---------- 4. 找茬（点击与众不同的格子） ---------- */
  function findDiff() {
    var round = 0, score = 0, timer = null, rt = 30;
    var box = shell("🔍 找不同",
      '<div style="display:flex;justify-content:space-between"><span>得分 <b id="fs">0</b></span><span>剩余 <b id="ft">30</b>s</span></div>' +
      '<div class="d" style="text-align:center">点击颜色不一样的格子！</div>' +
      '<div id="fg" style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:10px"></div>');
    var fg = box.querySelector("#fg"), fs = box.querySelector("#fs"), ft = box.querySelector("#ft");
    function r() {
      round++;
      var base = ["#4a90d9", "#e07b5a", "#5bb07a", "#b06cc4", "#d9a73a"][Math.floor(Math.random() * 5)];
      var n = 25, odd = Math.floor(Math.random() * n);
      fg.innerHTML = "";
      for (var i = 0; i < n; i++) {
        var b = document.createElement("div");
        b.style.cssText = "height:52px;border-radius:8px;cursor:pointer;background:" + base;
        if (i === odd) {
          var gap = 12 + Math.min(round, 8);
          b.dataset.odd = "1";
          b.style.background = shade(base, gap);
        }
        b.className = "fcell";
        fg.appendChild(b);
      }
    }
    function shade(hex, amt) {
      var n = parseInt(hex.slice(1), 16);
      var rr = Math.min(255, (n >> 16) + amt), gg = Math.min(255, ((n >> 8) & 255) + amt), bb = Math.min(255, (n & 255) + amt);
      return "rgb(" + rr + "," + gg + "," + bb + ")";
    }
    on(fg, "click", function (e) {
      if (!e.target.classList.contains("fcell")) return;
      if (e.target.dataset.odd) { score++; fs.textContent = score; r(); }
    });
    r();
    timer = setInterval(function () {
      rt--; ft.textContent = rt;
      if (rt <= 0) {
        clearInterval(timer);
        var bb = bestKey("gx570find", score);
        fg.innerHTML = '<div style="grid-column:1/6;text-align:center;font-size:18px">结束！得分 ' + score + " 最佳 " + bb + '<br><button class="x570-btn" id="fagain" style="margin-top:10px">再玩一次</button></div>';
        on(box.querySelector("#fagain"), "click", findDiff);
      }
    }, 1000);
  }

  X570Games.react = { open: react, name: "反应力测试", icon: "⚡" };
  X570Games.stroop = { open: stroop, name: "颜色干扰", icon: "🎨" };
  X570Games.type = { open: typeGame, name: "抄写竞速", icon: "⌨️" };
  X570Games.find = { open: findDiff, name: "找不同", icon: "🔍" };

  function register() {
    try {
      if (window.XZ13 && XZ13.GAMES) {
        [
          { icon: "⚡", name: "反应力测试", bestKey: "gx570react", call: "X570Games.react.open()" },
          { icon: "🎨", name: "颜色干扰", bestKey: "gx570stroop", call: "X570Games.stroop.open()" },
          { icon: "⌨️", name: "抄写竞速", bestKey: "gx570type", call: "X570Games.type.open()" },
          { icon: "🔍", name: "找不同", bestKey: "gx570find", call: "X570Games.find.open()" }
        ].forEach(function (g) {
          if (!XZ13.GAMES.some(function (x) { return x.name === g.name; })) XZ13.GAMES.push(g);
        });
      }
    } catch (e) {}
  }
  X570.register("gamesC", register, 6);
})();

/* ===== a310_recall.js ===== */
/* =====================================================================
   恋爱纪念册：根据剧情进度解锁心动瞬间，可回顾、收藏
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet;

  /* 每个瞬间对应一个成就 flag（由 a91_hooks 在剧情推进时写入） */
  var MOMENTS = [
    { f: "meet", ic: "🌸", t: "初次相遇", d: "高一（3）班的门口，她坐在靠窗的位置，阳光落在她的发梢上。" },
    { f: "umbrella", ic: "☂️", t: "一把伞", d: "放学忽然下起雨，你把伞递过去，自己跑进了雨里。" },
    { f: "hairpin", ic: "🎀", t: "掉落的发夹", d: "运动会前，她的发夹掉在跑道边，你弯腰捡起来，心跳漏了一拍。" },
    { f: "sport_meet", ic: "🏃", t: "运动会的呐喊", d: "她在终点附近，举着加油的牌子，眼睛很亮。" },
    { f: "library", ic: "📚", t: "图书馆的午后", d: "靠窗的位置，你们各自看书，安静得能听见翻页声。" },
    { f: "exam_up", ic: "📈", t: "晚秋月考", d: "你们一起复习，成绩出来那天，你第一次追平了她的名次。" },
    { f: "study_done", ic: "📝", t: "一起自习", d: "晚自习的灯光下，她把整理好的错题推到你面前。" },
    { f: "snow", ic: "❄️", t: "冬至的暖", d: "冬天的第一杯热饮，是她在走廊里递给你的。" },
    { f: "goal_city", ic: "🏙️", t: "同一个城市", d: "她在便签上写下一座城市的名字，轻轻推给你。" },
    { f: "spring", ic: "🌸", t: "樱花开了", d: "春天的樱花道，你们并肩走过，谁都没有说话。" },
    { f: "gaokao", ic: "🎓", t: "高考那几天", d: "进考场前，她回头对你说：放轻松，我们说好了的。" },
    { f: "end_sweet", ic: "💗", t: "心之所向", d: "录取通知到手，你们真的考去了同一个城市。" },
    { f: "graduated", ic: "🌌", t: "三百零五天", d: "那个夏天，你们把没来得及做的小事，一件一件补完。" }
  ];

  function flags() {
    var fl = {};
    try { fl = JSON.parse(lsGet("xz570_ach_flags", "{}")) || {}; } catch (e) {}
    /* 从剧情存档推断进度 */
    try {
      var sv = JSON.parse(localStorage.getItem("xz56_story_v1") || "null");
      if (sv && sv.heroine === "lin") {
        fl.meet = true;
        if (sv.node) {
          var n = sv.node;
          if (n.indexOf("lx") === 0) {
            fl.meet = true; fl.hairpin = true; fl.sport_meet = true;
            if (n >= "lx05") fl.umbrella = true;
          }
        }
      }
    } catch (e) {}
    return fl;
  }

  function open() {
    var fl = flags();
    var el = H.openFull("x570Sub", "💗 恋爱纪念册");
    var body = el.querySelector(".x570-full-body");
    var got = MOMENTS.filter(function (m) { return fl[m.f]; }).length;
    var html = '<div class="x570-card"><div class="t">心动瞬间</div>' +
      '<div class="d">推进林晚剧情，会解锁一个个专属瞬间。当前已解锁 ' + got + " / " + MOMENTS.length + "。</div></div>";
    html += '<div class="x570-memo-grid">' + MOMENTS.map(function (m) {
      var ok = !!fl[m.f];
      return '<div class="x570-memo ' + (ok ? "" : "x570-locked") + '">' +
        '<div class="ic">' + (ok ? m.ic : "🔒") + '</div>' +
        '<div class="n">' + esc(m.t) + '</div>' +
        '<div class="d">' + (ok ? esc(m.d) : "尚未解锁，继续你们的故事吧") + "</div></div>";
    }).join("") + "</div>";
    if (got < MOMENTS.length) {
      html += '<div class="x570-card x570-center"><div class="d">提示：在「💬 微信 → 恋爱」里选择林晚，开始或继续剧情，就能解锁更多瞬间。</div></div>';
    } else {
      html += '<div class="x570-card x570-center"><div class="t">💗 全部解锁</div><div class="d">你已走完《心之所向》的全部心动瞬间，愿你把这份认真带到生活里。</div></div>';
    }
    body.innerHTML = html;
  }

  X570.CampusSub.memo = open;
  X570.Memo = { open: open, MOMENTS: MOMENTS };
})();

/* ===== a320_classroom.js ===== */
/* =====================================================================
   课堂互动：举手回答 / 口头提问 / 小组讨论 / 课堂表现积分
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_classroom_v1";

  function oralBank() { return (window.X570 && X570.OralBank) ? X570.OralBank : []; }
  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d) return d; } catch (e) {}
    var d = { perf: 0, raised: 0, right: 0, wrong: 0, discuss: 0 };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }
  function applyG(k, v) {
    if (window.G && typeof G[k] === "number") G[k] = Math.max(0, Math.min(100, G[k] + v));
  }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "✋ 课堂互动");
    var body = el.querySelector(".x570-full-body");
    function home() {
      var html = '<div class="x570-card"><div class="t">课堂表现</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">' +
        '<span class="x570-chip">表现分 ' + d.perf + "</span>" +
        '<span class="x570-chip">举手 ' + d.raised + "</span>" +
        '<span class="x570-chip">答对 ' + d.right + "</span>" +
        '<span class="x570-chip">讨论 ' + d.discuss + "</span></div></div>";
      html += '<div class="x570-campus-grid">' +
        '<div class="x570-campus-item" id="cHand"><div class="ic">✋</div><div class="n">举手回答</div><div class="d">老师随机提问</div></div>' +
        '<div class="x570-campus-item" id="cGroup"><div class="ic">🧑‍🤝‍🧑</div><div class="n">小组讨论</div><div class="d">和同学合作</div></div>' +
        '<div class="x570-campus-item" id="cBoard"><div class="ic">📋</div><div class="n">上台板演</div><div class="d">挑战难题</div></div>' +
        '<div class="x570-campus-item" id="cAsk"><div class="ic">❓</div><div class="n">主动提问</div><div class="d">不懂就问</div></div>' +
        "</div>";
      html += '<div class="x570-card x570-center"><div class="d">积极参与课堂，表现分会累积，也会影响你的知识与心情。</div></div>';
      body.innerHTML = html;
      on($("#cHand"), "click", handUp);
      on($("#cGroup"), "click", group);
      on($("#cBoard"), "click", board);
      on($("#cAsk"), "click", ask);
    }

    function handUp() {
      d.raised++;
      var bank = oralBank();
      if (!bank.length) {
        d.perf += 2; save(d);
        H.modal("<h3>✋ 举手回答</h3><div style='line-height:1.8'>老师点了你，你把思路讲了一遍，虽然不完美，但老师肯定了你的勇气。</div>");
        applyG("knowledge", 1); applyG("mood", 1);
        return home();
      }
      var q = bank[Math.floor(Math.random() * bank.length)];
      body.innerHTML =
        '<div class="x570-card"><div class="t">老师提问</div><div class="d" style="font-size:18px;margin-top:8px">' + esc(q.q) + "</div></div>" +
        '<div class="x570-list">' +
        '<button class="x570-btn ans" data-ok="1" style="margin-bottom:8px">我知道：' + esc(q.a) + "</button>" +
        '<button class="x570-btn ans" data-ok="0" style="margin-bottom:8px">不太确定，试着回答</button>' +
        '<button class="x570-btn" id="cBack">返回</button></div>';
      on(body, "click", function (e) {
        var b = e.target.closest(".ans");
        if (b) {
          var ok = b.getAttribute("data-ok") === "1";
          if (ok) {
            d.right++; d.perf += 3;
            applyG("knowledge", 2); applyG("mood", 2);
            H.toast("答对了！表现分 +3，知识 +2");
          } else {
            d.wrong++; d.perf += 1;
            applyG("knowledge", 1);
            H.toast("虽然答错，但老师帮你理清了思路，表现分 +1");
          }
          save(d);
          home();
        }
        if (e.target.closest("#cBack")) home();
      });
    }
    function group() {
      d.discuss++; d.perf += 2;
      applyG("knowledge", 1); applyG("social", 2);
      save(d);
      var tips = [
        "你和组员分工明确，很快就讨论出了结果。",
        "你负责记录，把大家的思路整理得很清楚。",
        "组里有不同意见，你帮大家找到了共识。",
        "你提出的一个想法，被小组采纳了。"
      ];
      H.modal("<h3>🧑‍🤝‍🧑 小组讨论</h3><div style='line-height:1.8'>" + tips[Math.floor(Math.random() * tips.length)] + "</div>");
      home();
    }
    function board() {
      var ok = Math.random() < 0.6;
      if (ok) { d.perf += 4; d.right++; applyG("knowledge", 2); applyG("mood", 2); }
      else { d.perf += 1; d.wrong++; applyG("knowledge", 1); }
      save(d);
      H.modal("<h3>📋 上台板演</h3><div style='line-height:1.8'>" +
        (ok ? "你在黑板上一步步写出了完整过程，老师带头鼓掌。" : "你写到一半卡壳了，老师在旁边提示，你顺利完成了，印象深刻。") + "</div>");
      home();
    }
    function ask() {
      d.perf += 2;
      applyG("knowledge", 2);
      save(d);
      H.modal("<h3>❓ 主动提问</h3><div style='line-height:1.8'>你把不懂的地方问了出来，老师的讲解让你豁然开朗。原来敢于提问，本身就是一种进步。</div>");
      home();
    }
    home();
  }

  X570.CampusSub.classroom = open;
  X570.Classroom = { open: open };
})();

/* ===== a340_diary.js ===== */
/* =====================================================================
   校园日记：写下每天的心情，可翻阅、可删除，本地持久化
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_diary_v1";
  var MOODS = [{ ic: "😄", t: "开心" }, { ic: "🙂", t: "平静" }, { ic: "😐", t: "一般" }, { ic: "😔", t: "低落" }, { ic: "😤", t: "烦躁" }, { ic: "🥰", t: "心动" }];

  function load() { try { return JSON.parse(lsGet(KEY, "[]")) || []; } catch (e) { return []; } }
  function save(a) { try { lsSet(KEY, JSON.stringify(a)); } catch (e) {} }

  function open() {
    var el = H.openFull("x570Sub", "📓 校园日记");
    var body = el.querySelector(".x570-full-body");
    function list() {
      var arr = load();
      var html = '<div class="x570-card"><div class="t">写一篇今天的日记</div>' +
        '<div class="d">记录心情和发生的事，只保存在你自己的设备上。</div></div>' +
        '<div class="x570-campus-grid">' +
        '<div class="x570-campus-item" id="dWrite"><div class="ic">✍️</div><div class="n">写新日记</div><div class="d">记录此刻</div></div>' +
        '<div class="x570-campus-item" id="dCount"><div class="ic">📚</div><div class="n">' + arr.length + " 篇</div><div class='d'>累计日记</div></div></div>";
      if (arr.length) {
        html += '<div class="x570-card"><div class="t">最近的日记</div>' +
          arr.slice().reverse().map(function (d, idx) {
            var real = arr.length - 1 - idx;
            return '<div class="x570-diary" data-i="' + real + '"><div class="x570-diary-h">' +
              d.mood + " " + esc(d.date) + '<span class="x570-diary-del" data-del="' + real + '">删除</span></div>' +
              '<div class="x570-diary-b">' + esc(d.text) + "</div></div>";
          }).join("") + "</div>";
      } else {
        html += '<div class="x570-card x570-center"><div class="d">还没有日记，写下第一篇吧。</div></div>';
      }
      body.innerHTML = html;
      on($("#dWrite"), "click", write);
      on(body, "click", function (e) {
        var del = e.target.closest("[data-del]");
        if (del) {
          e.stopPropagation();
          var i = +del.getAttribute("data-del");
          if (confirm("确定删除这篇日记吗？")) {
            var a = load();
            a.splice(i, 1);
            save(a);
            H.toast("已删除");
            list();
          }
          return;
        }
        var item = e.target.closest(".x570-diary");
        if (item) {
          var d = load()[+item.getAttribute("data-i")];
          if (d) H.modal("<h3 style='margin:0 0 8px'>" + d.mood + " " + esc(d.date) + "</h3><div style='line-height:1.9;white-space:pre-wrap;font-size:15px'>" + esc(d.text) + "</div>");
        }
      });
    }
    function write() {
      var mood = "🙂";
      body.innerHTML =
        '<div class="x570-card"><div class="t">今天心情</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">' +
        MOODS.map(function (m, i) {
          return '<button class="x570-btn msel ' + (i === 1 ? "x570-sel" : "") + '" data-m="' + m.ic + '" style="padding:8px 12px">' + m.ic + " " + m.t + "</button>";
        }).join("") + "</div></div>" +
        '<div class="x570-card"><textarea id="dText" rows="9" style="width:100%;box-sizing:border-box;border-radius:10px;padding:12px;font-size:16px" placeholder="今天发生了什么？心情怎么样？写下来吧……"></textarea></div>' +
        '<div style="display:flex;gap:10px"><button class="x570-btn" id="dSave" style="flex:1">保存日记</button>' +
        '<button class="x570-btn" id="dCancel" style="flex:1">取消</button></div>';
      on(body, "click", function (e) {
        var m = e.target.closest(".msel");
        if (m) {
          mood = m.getAttribute("data-m");
          body.querySelectorAll(".msel").forEach(function (b) { b.classList.remove("x570-sel"); });
          m.classList.add("x570-sel");
        }
        if (e.target.closest("#dCancel")) list();
        if (e.target.closest("#dSave")) {
          var txt = $("#dText").value.trim();
          if (!txt) { H.toast("写点什么再保存吧"); return; }
          var a = load();
          a.push({ mood: mood, text: txt, date: new Date().toLocaleString("zh-CN") });
          save(a);
          H.toast("日记已保存");
          list();
        }
      });
    }
    list();
  }

  X570.CampusSub.diary = open;
  X570.Diary = { open: open };
})();

/* ===== a360_pet.js ===== */
/* =====================================================================
   校园橘猫养成：喂食 / 抚摸 / 陪玩 / 清洁，好感度与等级持久化
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_pet_v1";

  function load() {
    try {
      var d = JSON.parse(lsGet(KEY, "null"));
      if (d) return d;
    } catch (e) {}
    var d = { name: "校园橘猫", full: 60, happy: 60, bond: 0, level: 1, feed: 0, play: 0, pet: 0, ts: Date.now() };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }
  function decay(d) {
    var now = Date.now();
    var hrs = Math.max(0, (now - d.ts) / 3600000);
    d.full = Math.max(0, Math.round(d.full - hrs * 6));
    d.happy = Math.max(0, Math.round(d.happy - hrs * 4));
    d.ts = now;
  }
  function levelUp(d) {
    var need = d.level * 5;
    while (d.bond >= need) {
      d.bond -= need;
      d.level++;
      need = d.level * 5;
    }
  }
  function bar(v, c) {
    return '<div class="x570-bar"><div class="x570-bar-i" style="width:' + Math.max(0, Math.min(100, v)) + "%;background:" + c + '"></div></div>';
  }

  function open() {
    var d = load();
    decay(d);
    var el = H.openFull("x570Sub", "🐱 校园橘猫");
    var body = el.querySelector(".x570-full-body");
    function face() {
      if (d.full < 20) return "🙀";
      if (d.happy < 20) return "😿";
      if (d.happy > 75) return "😻";
      return "🐱";
    }
    function render(msg) {
      levelUp(d);
      save(d);
      var html = '<div class="x570-card x570-center"><div style="font-size:88px;line-height:1">' + face() + "</div>" +
        '<div class="t" style="font-size:22px">' + esc(d.name) + " · Lv." + d.level + "</div>" +
        '<div class="d">好感度 ' + d.bond + " / " + d.level * 5 + "</div>" +
        (msg ? '<div class="d" style="color:#ff9fa8;margin-top:6px">' + esc(msg) + "</div>" : "") + "</div>";
      html += '<div class="x570-card">' +
        '<div class="d">饱食度</div>' + bar(d.full, "#e0a23c") +
        '<div class="d">心情值</div>' + bar(d.happy, "#ff9fa8") +
        '<div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap">' +
        '<span class="x570-chip">喂食 ' + d.feed + "</span>" +
        '<span class="x570-chip">陪玩 ' + d.play + "</span>" +
        '<span class="x570-chip">抚摸 ' + d.pet + "</span></div></div>";
      html += '<div class="x570-campus-grid">' +
        '<div class="x570-campus-item" id="pFeed"><div class="ic">🍗</div><div class="n">喂火腿肠</div><div class="d">饱食+20</div></div>' +
        '<div class="x570-campus-item" id="pPlay"><div class="ic">🧶</div><div class="n">陪它玩</div><div class="d">心情+18</div></div>' +
        '<div class="x570-campus-item" id="pPet"><div class="ic">🤚</div><div class="n">摸摸头</div><div class="d">好感+1</div></div>' +
        '<div class="x570-campus-item" id="pFish"><div class="ic">🐟</div><div class="n">喂小鱼干</div><div class="d">饱食+35 好感+1</div></div>' +
        "</div>";
      html += '<div class="x570-card x570-center"><div class="d">它常待在花坛边，你对它好，它会慢慢记住你。</div></div>';
      body.innerHTML = html;

      on($("#pFeed"), "click", function () {
        if (d.full >= 95) return render("它已经吃饱啦，正舔爪子呢。");
        d.full = Math.min(100, d.full + 20); d.happy += 3; d.bond += 1; d.feed++;
        render("它三两口吃完，蹭了蹭你的裤脚。");
      });
      on($("#pFish"), "click", function () {
        if (d.full >= 95) return render("它叼着小鱼干，说留着晚点吃。");
        d.full = Math.min(100, d.full + 35); d.happy += 6; d.bond += 1; d.feed++;
        render("吃到小鱼干，它幸福地眯起了眼睛。");
      });
      on($("#pPlay"), "click", function () {
        if (d.full < 15) return render("它饿得不想动，先喂点吃的吧。");
        d.happy = Math.min(100, d.happy + 18); d.full -= 6; d.bond += 2; d.play++;
        render("它追着毛线团跑了好几圈，玩得很欢。");
      });
      on($("#pPet"), "click", function () {
        d.happy = Math.min(100, d.happy + 5); d.bond += 1; d.pet++;
        render("它舒服地翻了个肚皮，呼噜声很大。");
      });
    }
    render();
  }

  X570.CampusSub.pet = open;
  X570.Pet = { open: open };
})();

/* ===== a370_collection.js ===== */
/* =====================================================================
   校园图鉴：收集植物 / 美食 / 天气 / 场景，探索校园时随机获得
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_collect_v1";

  var BOOK = {
    plant: {
      n: "植物图鉴", ic: "🌿",
      items: [
        { id: "p1", ic: "🌸", n: "桂花", d: "秋天开，香气能飘到教学楼。" },
        { id: "p2", ic: "🌸", n: "樱花", d: "春天在操场旁的小道边盛开。" },
        { id: "p3", ic: "🍁", n: "枫叶", d: "深秋变红，落了一地。" },
        { id: "p4", ic: "🌱", n: "绿萝", d: "教室窗台的常客，好养。" },
        { id: "p5", ic: "🌻", n: "向日葵", d: "美术教室外的小花园里。" },
        { id: "p6", ic: "🍃", n: "香樟叶", d: "校园里最多的树，四季常青。" },
        { id: "p7", ic: "🌷", n: "郁金香", d: "春天花坛里的花，颜色很多。" },
        { id: "p8", ic: "🌾", n: "狗尾草", d: "操场边的草地里常见。" },
        { id: "p9", ic: "🍄", n: "小蘑菇", d: "雨后草坪边冒出来的。" },
        { id: "p10", ic: "🌺", n: "月季", d: "校门口花圃里，月月开。" }
      ]
    },
    food: {
      n: "食堂图鉴", ic: "🍱",
      items: [
        { id: "f1", ic: "🍗", n: "红烧鸡块", d: "食堂的经典硬菜，很抢手。" },
        { id: "f2", ic: "🍖", n: "糖醋里脊", d: "酸甜口，晚了就没了。" },
        { id: "f3", ic: "🥖", n: "肉松面包", d: "小卖部的人气单品。" },
        { id: "f4", ic: "🍜", n: "雪菜肉丝面", d: "冬天的暖胃首选。" },
        { id: "f5", ic: "🥟", n: "鲜肉蒸饺", d: "早餐窗口的常客。" },
        { id: "f6", ic: "🍚", n: "蛋炒饭", d: "粒粒分明，配汤正好。" },
        { id: "f7", ic: "🧋", n: "珍珠奶茶", d: "偶尔才点一杯的快乐。" },
        { id: "f8", ic: "🥛", n: "热豆浆", d: "早自习前的温暖。" },
        { id: "f9", ic: "🍎", n: "饭后水果", d: "健康加餐。" },
        { id: "f10", ic: "🍲", n: "免费例汤", d: "每天不同，管够。" }
      ]
    },
    weather: {
      n: "天气图鉴", ic: "🌤️",
      items: [
        { id: "w1", ic: "☀️", n: "大晴天", d: "阳光正好，适合运动。" },
        { id: "w2", ic: "⛅", n: "多云", d: "不冷不热，最舒服的天气。" },
        { id: "w3", ic: "🌧️", n: "小雨", d: "教室听雨，适合读书。" },
        { id: "w4", ic: "⛈️", n: "雷阵雨", d: "来得快去得也快。" },
        { id: "w5", ic: "🌫️", n: "薄雾", d: "清晨操场若隐若现。" },
        { id: "w6", ic: "🌇", n: "晚霞", d: "橘粉色的天空，像打翻的颜料。" },
        { id: "w7", ic: "🌙", n: "月夜", d: "晚自习回宿舍时很圆。" },
        { id: "w8", ic: "❄️", n: "初雪", d: "南方的惊喜，全校都在看。" },
        { id: "w9", ic: "🌬️", n: "大风", d: "骑车的同学都在努力。" },
        { id: "w10", ic: "🌈", n: "彩虹", d: "雨后偶尔出现，很幸运。" }
      ]
    },
    scene: {
      n: "场景图鉴", ic: "🏫",
      items: [
        { id: "s1", ic: "🏫", n: "教学楼", d: "每天进进出出的地方。" },
        { id: "s2", ic: "🏟️", n: "操场", d: "体育课和运动会的舞台。" },
        { id: "s3", ic: "📚", n: "图书馆", d: "靠窗的位置最抢手。" },
        { id: "s4", ic: "🍱", n: "食堂", d: "一天里最热闹的地方之一。" },
        { id: "s5", ic: "🛏️", n: "宿舍楼", d: "第二个家。" },
        { id: "s6", ic: "🌊", n: "西子湖", d: "学校名字里的那片水。" },
        { id: "s7", ic: "🌸", n: "樱花道", d: "春天最上镜的地方。" },
        { id: "s8", ic: "🚲", n: "自行车棚", d: "停满了各式各样的车。" },
        { id: "s9", ic: "🎹", n: "琴房", d: "音乐社的秘密基地。" },
        { id: "s10", ic: "🌌", n: "天台台阶", d: "能看到很远的灯火和星星。" }
      ]
    }
  };

  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d) return d; } catch (e) {}
    var d = { have: {} };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }
  function discover(cat) {
    var d = load();
    var list = BOOK[cat].items.filter(function (x) { return !d.have[x.id]; });
    if (!list.length) return null;
    var got = list[Math.floor(Math.random() * list.length)];
    d.have[got.id] = true;
    save(d);
    return got;
  }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "📖 校园图鉴");
    var body = el.querySelector(".x570-full-body");
    var cats = Object.keys(BOOK);
    var cur = cats[0];
    function render() {
      var list = BOOK[cur].items;
      var have = list.filter(function (x) { return d.have[x.id]; }).length;
      var tabs = '<div class="x570-ach-tabs">' + cats.map(function (c) {
        return '<button class="x570-ach-tab ' + (cur === c ? "on" : "") + '" data-c="' + c + '">' + BOOK[c].ic + " " + BOOK[c].n + "</button>";
      }).join("") + "</div>";
      var total = 0, gotAll = 0;
      cats.forEach(function (c) {
        total += BOOK[c].items.length;
        gotAll += BOOK[c].items.filter(function (x) { return d.have[x.id]; }).length;
      });
      var html = '<div class="x570-card"><div class="t">收集进度 ' + gotAll + " / " + total + "</div>" +
        '<div class="x570-bar"><div class="x570-bar-i" style="width:' + Math.round(gotAll / total * 100) + '%"></div></div></div>';
      html += tabs +
        '<div class="x570-campus-grid">' + list.map(function (it) {
          var ok = !!d.have[it.id];
          return '<div class="x570-campus-item ' + (ok ? "" : "x570-locked") + '"><div class="ic">' + (ok ? it.ic : "❔") + "</div>" +
            '<div class="n">' + esc(ok ? it.n : "未发现") + "</div><div class='d'>" + esc(ok ? it.d : "去校园里探索吧") + "</div></div>";
        }).join("") + "</div>";
      html += '<button class="x570-btn" id="colExplore" style="width:100%;margin-top:12px">在校园里转一圈 🔍</button>';
      body.innerHTML = html;
      on(body, "click", function (e) {
        var t = e.target.closest("[data-c]");
        if (t) { cur = t.getAttribute("data-c"); render(); }
        if (e.target.closest("#colExplore")) {
          var cat = cats[Math.floor(Math.random() * cats.length)];
          var got = discover(cat);
          if (got) H.toast("发现新图鉴：" + got.ic + " " + got.n);
          else H.toast("这一类你已经收集全了");
          render();
        }
      });
    }
    render();
  }

  X570.CampusSub.book = open;
  X570.Book = { open: open, discover: discover, BOOK: BOOK };
})();

/* ===== a410_bond.js ===== */
/* =====================================================================
   关系与好感：给同学/女主送礼、聊天、帮忙，好感度持久化
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_bond_v1";

  var PEOPLE = [
    { id: "lin", n: "林晚", ic: "🌸", like: ["诗集", "桂花", "明信片", "热奶茶"], note: "喜欢安静、有诗意的东西。" },
    { id: "zhao", n: "赵小雨", ic: "🎨", like: ["画材", "晚霞照片", "颜料", "速写本"], note: "喜欢和画画、色彩有关的一切。" },
    { id: "su", n: "苏清颜", ic: "🎹", like: ["乐谱", "耳机", "薄荷糖", "安静的陪伴"], note: "喜欢音乐，也喜欢安静。" },
    { id: "xu", n: "许念", ic: "🏀", like: ["运动饮料", "护腕", "篮球", "毛巾"], note: "喜欢运动相关的实用礼物。" },
    { id: "mon", n: "班长", ic: "📋", like: ["笔记本", "签字笔", "文件夹"], note: "喜欢实用、能帮她整理事务的东西。" },
    { id: "desk", n: "同桌", ic: "🍞", like: ["零食", "肉松面包", "冰红茶"], note: "吃货，给点吃的就很开心。" },
    { id: "study", n: "学习委员", ic: "📚", like: ["错题本", "荧光笔", "参考书"], note: "喜欢一切和学习有关的东西。" },
    { id: "cat", n: "校园橘猫", ic: "🐱", like: ["火腿肠", "小鱼干", "抚摸"], note: "有吃的就是好朋友。" }
  ];
  var GIFTS = [
    { g: "热奶茶", ic: "🧋", cost: 6, mood: 2 },
    { g: "明信片", ic: "💌", cost: 4, mood: 1 },
    { g: "笔记本", ic: "📓", cost: 5, mood: 1 },
    { g: "小零食", ic: "🍬", cost: 3, mood: 2 },
    { g: "一支笔", ic: "🖊️", cost: 4, mood: 1 },
    { g: "书签", ic: "🔖", cost: 2, mood: 1 },
    { g: "运动饮料", ic: "🥤", cost: 5, mood: 2 },
    { g: "一束小花", ic: "💐", cost: 8, mood: 3 },
    { g: "诗集", ic: "📖", cost: 10, mood: 3 },
    { g: "画材", ic: "🎨", cost: 10, mood: 3 },
    { g: "小鱼干", ic: "🐟", cost: 4, mood: 2 },
    { g: "一句真诚的夸奖", ic: "💗", cost: 0, mood: 2 }
  ];

  function load() {
    try {
      var d = JSON.parse(lsGet(KEY, "null"));
      if (d) return d;
    } catch (e) {}
    var d = {};
    PEOPLE.forEach(function (p) { d[p.id] = { bond: 0, gave: 0, chat: 0, help: 0 }; });
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }
  function level(v) {
    if (v >= 80) return "挚友";
    if (v >= 50) return "好友";
    if (v >= 25) return "熟人";
    if (v >= 10) return "认识";
    return "点头之交";
  }
  function bar(v, c) {
    return '<div class="x570-bar"><div class="x570-bar-i" style="width:' + Math.min(100, v) + "%;background:" + c + '"></div></div>';
  }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "💞 关系与好感");
    var body = el.querySelector(".x570-full-body");
    function list() {
      var money = (window.G && typeof G.money === "number") ? G.money : 0;
      var html = '<div class="x570-card"><div class="t">人际关系</div><div class="d">通过送礼、聊天、帮忙提升好感。零花钱：🪙 ' + money + "</div></div>";
      html += '<div class="x570-list">' + PEOPLE.map(function (p) {
        var s = d[p.id];
        return '<div class="x570-person" data-id="' + p.id + '"><span style="font-size:34px">' + p.ic + "</span>" +
          "<div style='flex:1'><b>" + esc(p.n) + "</b> <span class='x570-chip'>" + level(s.bond) + "</span>" +
          bar(s.bond, "#ff9fa8") +
          '<div class="d">好感 ' + s.bond + " · 送礼 " + s.gave + " · 聊天 " + s.chat + " · 帮忙 " + s.help + "</div></div></div>";
      }).join("") + "</div>";
      body.innerHTML = html;
      on(body, "click", function (e) {
        var it = e.target.closest("[data-id]");
        if (it) detail(it.getAttribute("data-id"));
      });
    }
    function detail(id) {
      var p = PEOPLE.filter(function (x) { return x.id === id; })[0];
      var s = d[id];
      var html = '<div class="x570-card"><div style="display:flex;align-items:center;gap:12px"><span style="font-size:44px">' + p.ic + "</span>" +
        "<div><div class='t'>" + esc(p.n) + "</div><div class='d'>" + level(s.bond) + " · 好感 " + s.bond + "</div></div></div>" +
        '<div class="d" style="margin-top:8px">' + esc(p.note) + "</div>" +
        '<div class="d">喜欢：' + p.like.map(function (x) { return esc(x); }).join(" / ") + "</div>" +
        bar(s.bond, "#ff9fa8") + "</div>";
      html += '<div class="x570-card"><div class="t">送一份礼物</div><div class="x570-campus-grid">' +
        GIFTS.map(function (g) {
          return '<div class="x570-campus-item" data-g="' + esc(g.g) + '"><div class="ic">' + g.ic + '</div><div class="n">' + esc(g.g) + "</div><div class='d'>🪙" + g.cost + "</div></div>";
        }).join("") + "</div></div>";
      html += '<div style="display:flex;gap:10px"><button class="x570-btn" id="pChat" style="flex:1">聊聊天</button>' +
        '<button class="x570-btn" id="pHelp" style="flex:1">帮个忙</button></div>' +
        '<button class="x570-btn" id="pBack" style="width:100%;margin-top:10px">← 返回</button>';
      body.innerHTML = html;
      on($("#pBack"), "click", list);
      on($("#pChat"), "click", function () {
        s.chat++; s.bond += 2;
        if (window.G) G.mood = Math.min(100, (G.mood || 0) + 1);
        save(d);
        H.toast("你和" + p.n + "聊了会儿，好感 +2");
        detail(id);
      });
      on($("#pHelp"), "click", function () {
        s.help++; s.bond += 3;
        if (window.G) { G.social = Math.min(100, (G.social || 0) + 1); G.mood = Math.min(100, (G.mood || 0) + 1); }
        save(d);
        H.toast("你帮了" + p.n + "一个忙，好感 +3");
        detail(id);
      });
      on(body, "click", function (e) {
        var it = e.target.closest("[data-g]");
        if (!it) return;
        var g = GIFTS.filter(function (x) { return x.g === it.getAttribute("data-g"); })[0];
        var money = (window.G && typeof G.money === "number") ? G.money : 0;
        if (g.cost > money) return H.toast("零花钱不够啦，去签到或打工赚一点");
        if (window.G) G.money -= g.cost;
        var add = g.mood + (p.like.indexOf(g.g) >= 0 ? 4 : 1);
        s.bond += add; s.gave++;
        if (window.G) G.mood = Math.min(100, (G.mood || 0) + g.mood);
        save(d);
        H.toast("送出了「" + g.g + "」，" + p.n + "好感 +" + add);
        detail(id);
      });
    }
    list();
  }

  X570.CampusSub.bond = open;
  X570.Bond = { open: open, PEOPLE: PEOPLE, GIFTS: GIFTS };
})();

/* ===== a420_planner.js ===== */
/* =====================================================================
   学习计划：本周课程表 + 作业待办（可勾选）+ 学习目标清单
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var TKEY = "xz570_todo_" + (new Date().getDay());
  var WKEY = "xz570_weekly_goal";

  var TIMETABLE = {
    "周一": ["语文", "数学", "英语", "物理", "化学", "体育", "生物", "自习"],
    "周二": ["数学", "英语", "地理", "语文", "物理", "音乐", "化学", "自习"],
    "周三": ["英语", "物理", "数学", "语文", "生物", "美术", "地理", "自习"],
    "周四": ["语文", "化学", "英语", "数学", "物理", "信息技术", "生物", "自习"],
    "周五": ["数学", "语文", "地理", "英语", "化学", "体育", "班会", "自习"],
    "周六": ["自习", "自习", "兴趣拓展", "社团", "自由活动", "自由活动", "—", "—"],
    "周日": ["休息", "休息", "休息", "自主复习", "自主复习", "返校准备", "晚自修", "晚自修"]
  };

  function loadTodo() {
    var def = [
      { t: "完成数学作业", done: false },
      { t: "背诵英语单词", done: false },
      { t: "整理今天的错题", done: false },
      { t: "预习明天的新课", done: false }
    ];
    try {
      var d = JSON.parse(lsGet(TKEY, "null"));
      if (d) return d;
    } catch (e) {}
    try { lsSet(TKEY, JSON.stringify(def)); } catch (e) {}
    return def;
  }
  function saveTodo(a) { try { lsSet(TKEY, JSON.stringify(a)); } catch (e) {} }

  function open() {
    var el = H.openFull("x570Sub", "📅 学习计划");
    var body = el.querySelector(".x570-full-body");
    var tabs = [["todo", "今日作业"], ["table", "课程表"], ["goal", "本周目标"]];
    var cur = "todo";
    var dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    var today = dayNames[new Date().getDay()];

    function todoView() {
      var a = loadTodo();
      var done = a.filter(function (x) { return x.done; }).length;
      var html = '<div class="x570-card"><div class="t">今日作业 · 完成 ' + done + "/" + a.length + "</div>" +
        '<div class="x570-bar"><div class="x570-bar-i" style="width:' + (a.length ? Math.round(done / a.length * 100) : 0) + '%"></div></div></div>';
      html += a.map(function (x, i) {
        return '<label class="x570-check x570-todo ' + (x.done ? "done" : "") + '"><input type="checkbox" data-i="' + i + '" ' + (x.done ? "checked" : "") + "> " + esc(x.t) + "</label>";
      }).join("");
      html += '<div style="display:flex;gap:8px;margin-top:10px">' +
        '<input id="todoInput" placeholder="添加一项任务…" style="flex:1;padding:10px;border-radius:10px;box-sizing:border-box">' +
        '<button class="x570-btn" id="todoAdd">添加</button></div>';
      return html;
    }
    function tableView() {
      var days = Object.keys(TIMETABLE);
      return '<div class="x570-card"><div class="t">本周课程表</div><div class="d">高亮的是今天。</div></div>' +
        '<div class="x570-sched">' + days.map(function (dy) {
          var isToday = dy === today;
          return '<div class="x570-sched-day ' + (isToday ? "today" : "") + '"><div class="x570-sched-h">' + dy + (isToday ? "（今天）" : "") + "</div>" +
            TIMETABLE[dy].map(function (s) { return '<span class="x570-chip">' + esc(s) + "</span>"; }).join("") + "</div>";
        }).join("") + "</div>";
    }
    function goalView() {
      var g = lsGet(WKEY, "");
      return '<div class="x570-card"><div class="t">本周目标</div><div class="d">写下这一周最想完成的 1-3 件事，周末回来检查。</div>' +
        '<textarea id="goalText" rows="6" style="width:100%;box-sizing:border-box;border-radius:10px;padding:12px;font-size:16px;margin-top:10px" placeholder="例如：1. 把数学错题清零 2. 每天背 30 个单词 3. 跑步 3 次…"></textarea>' +
        '<button class="x570-btn" id="goalBtn" style="width:100%;margin-top:10px">保存本周目标</button></div>';
    }
    function render() {
      var bar = '<div class="x570-ach-tabs">' + tabs.map(function (t) {
        return '<button class="x570-ach-tab ' + (cur === t[0] ? "on" : "") + '" data-t="' + t[0] + '">' + t[1] + "</button>";
      }).join("") + "</div>";
      body.innerHTML = bar + (cur === "todo" ? todoView() : cur === "table" ? tableView() : goalView());
      if (cur === "goal") {
        $("#goalText").value = g;
        on($("#goalBtn"), "click", function () {
          lsSet(WKEY, $("#goalText").value.trim());
          H.toast("本周目标已保存");
        });
      }
      on(body, "click", function (e) {
        var t = e.target.closest("[data-t]");
        if (t) { cur = t.getAttribute("data-t"); render(); }
        if (e.target.closest("#todoAdd")) {
          var v = $("#todoInput").value.trim();
          if (v) {
            var a = loadTodo();
            a.push({ t: v, done: false });
            saveTodo(a);
            render();
          }
        }
        var ck = e.target.closest("[data-i]");
        if (ck && ck.matches("input")) {
          var i = +ck.getAttribute("data-i");
          var a2 = loadTodo();
          a2[i].done = ck.checked;
          saveTodo(a2);
          if (window.G) { G.mood = Math.max(0, Math.min(100, (G.mood || 0) + (ck.checked ? 1 : -1))); }
          render();
        }
      });
    }
    render();
  }

  X570.CampusSub.planner = open;
  X570.Planner = { open: open, TIMETABLE: TIMETABLE };
})();

/* ===== a450_games_d.js ===== */
/* =====================================================================
   新小游戏 D：躲避落石(canvas) / 别踩白块 / 投篮挑战（含 rAF 清理）
   ===================================================================== */
(function () {
  var H = X570H, on = H.on, esc = H.esc;

  function shell(html) {
    var wrap = '<div style="padding:14px;max-width:560px;margin:0 auto">' + html + "</div>";
    try { if (window.XZ13 && XZ13.modal) { XZ13.modal(wrap); return document.getElementById("modalbox") || document.getElementById("modal"); } } catch (e) {}
    return H.modal(wrap);
  }
  function bestKey(k, v) {
    try { if (window.XZ13 && XZ13.best) return XZ13.best(k, v); } catch (e) {}
    var KEY = "xz13_best_" + k, old = 0;
    try { old = +localStorage.getItem(KEY) || 0; } catch (e) {}
    if (typeof v === "number" && v > old) { try { localStorage.setItem(KEY, v); } catch (e) {} return v; }
    return old;
  }

  /* ---------- 1. 躲避落石 ---------- */
  function dodge() {
    var box = shell('<h3 style="text-align:center;margin:0 0 10px">🪨 躲避落石</h3>' +
      '<div style="display:flex;justify-content:space-between"><span>得分 <b id="dsc">0</b></span><span>最佳 <b id="dbb">0</b></span></div>' +
      '<canvas id="dCanvas" width="320" height="420" style="width:100%;background:#16213e;border-radius:12px;touch-action:none"></canvas>' +
      '<div style="display:flex;gap:10px;margin-top:10px"><button class="x570-btn" id="dL" style="flex:1">← 左移</button>' +
      '<button class="x570-btn" id="dR" style="flex:1">右移 →</button></div>');
    var cv = box.querySelector("#dCanvas"), ctx = cv.getContext("2d");
    var W = 320, Hh = 420;
    var player = { x: 150, y: 380, w: 28, h: 28, dir: 0 };
    var rocks = [], score = 0, raf = null, running = true, speed = 3, spawn = 0;
    box.querySelector("#dbb").textContent = bestKey("gx570dodge");
    function loop() {
      if (!running) return;
      ctx.clearRect(0, 0, W, Hh);
      player.x += player.dir * 5;
      player.x = Math.max(6, Math.min(W - player.w - 6, player.x));
      spawn++;
      if (spawn > 34) {
        spawn = 0;
        rocks.push({ x: Math.random() * (W - 24), y: -20, w: 20 + Math.random() * 16, vy: speed + Math.random() * 1.5 });
      }
      for (var i = rocks.length - 1; i >= 0; i--) {
        var r = rocks[i];
        r.y += r.vy;
        ctx.fillStyle = "#8a7a6a";
        ctx.beginPath();
        ctx.arc(r.x + r.w / 2, r.y + r.w / 2, r.w / 2, 0, Math.PI * 2);
        ctx.fill();
        if (r.y > Hh + 20) { rocks.splice(i, 1); score++; box.querySelector("#dsc").textContent = score; }
        if (r.x < player.x + player.w && r.x + r.w > player.x && r.y < player.y + player.h && r.y + r.w > player.y) {
          return end();
        }
      }
      ctx.fillStyle = "#4ea8de";
      ctx.fillRect(player.x, player.y, player.w, player.h);
      speed = 3 + score / 25;
      raf = requestAnimationFrame(loop);
    }
    function end() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      var b = bestKey("gx570dodge", score);
      ctx.fillStyle = "rgba(0,0,0,.6)";
      ctx.fillRect(0, 0, W, Hh);
      ctx.fillStyle = "#fff";
      ctx.font = "22px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("结束！得分 " + score + " 最佳 " + b, W / 2, Hh / 2);
      box.querySelector("#dbb").textContent = b;
    }
    loop();
    on(box.querySelector("#dL"), "pointerdown", function () { player.dir = -1; });
    on(box.querySelector("#dR"), "pointerdown", function () { player.dir = 1; });
    on(box.querySelector("#dL"), "pointerup", function () { if (player.dir < 0) player.dir = 0; });
    on(box.querySelector("#dR"), "pointerup", function () { if (player.dir > 0) player.dir = 0; });
    on(cv, "pointermove", function (e) {
      var rect = cv.getBoundingClientRect();
      var x = (e.clientX - rect.left) * (W / rect.width);
      player.x = x - player.w / 2;
    });
  }

  /* ---------- 2. 别踩白块 ---------- */
  function tiles() {
    var box = shell('<h3 style="text-align:center;margin:0 0 10px">🎹 别踩白块</h3>' +
      '<div style="display:flex;justify-content:space-between"><span>得分 <b id="tsc">0</b></span><span>最佳 <b id="tbb">0</b></span></div>' +
      '<div id="tBoard" style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;width:100%;max-width:360px;height:420px;margin:0 auto;background:#222;border-radius:10px;padding:4px;box-sizing:border-box"></div>' +
      '<div class="d" style="text-align:center">点击黑色块，点错或漏掉就结束！</div>');
    var board = box.querySelector("#tBoard");
    box.querySelector("#tbb").textContent = bestKey("gx570tiles");
    var score = 0, rows = [];
    var ROWS = 4, COLS = 4;
    function newRow(top) {
      var black = Math.floor(Math.random() * COLS);
      for (var c = 0; c < COLS; c++) {
        var cell = document.createElement("div");
        cell.className = "tcell " + (c === black ? "black" : "white");
        cell.dataset.col = c;
        cell.style.cssText = "border-radius:6px;" + (c === black ? "background:#333" : "background:#f2f2f2");
        if (c === black) cell.dataset.need = "1";
        board.appendChild(cell);
      }
    }
    for (var i = 0; i < ROWS; i++) newRow();
    var cells = board.querySelectorAll(".tcell");
    function end() {
      var b = bestKey("gx570tiles", score);
      board.innerHTML = '<div style="grid-column:1/5;color:#fff;text-align:center;align-self:center">结束！得分 ' + score + " 最佳 " + b + "<br><button class='x570-btn' id='tAgain' style='margin-top:10px'>再来一局</button></div>";
      on(box.querySelector("#tAgain"), tiles);
    }
    on(board, "click", function (e) {
      var cell = e.target.closest(".tcell");
      if (!cell || !cell.parentNode) return;
      if (!cell.dataset.need) { return end(); }
      cell.dataset.need = "";
      cell.style.background = "#7bc47f";
      score++;
      box.querySelector("#tsc").textContent = score;
      /* 点掉一整行后移除最上面一行并补新行 */
      var rowCells = [];
      for (var i = 0; i < COLS; i++) rowCells.push(board.children[i]);
      var allHit = rowCells.filter(function (c) { return c.style.background.indexOf("rgb(123, 196, 127)") >= 0; });
      if (allHit.length === 1) {
        /* 只有一个黑格，命中即生成新行、移除顶部行 */
        for (var j = 0; j < COLS; j++) board.removeChild(board.children[0]);
        newRow();
      }
    });
  }

  /* ---------- 3. 投篮挑战 ---------- */
  function shoot() {
    var box = shell('<h3 style="text-align:center;margin:0 0 10px">🏀 投篮挑战</h3>' +
      '<div style="display:flex;justify-content:space-between"><span>进球 <b id="bsc">0</b></span><span>时间 <b id="btm">30</b>s</span><span>最佳 <b id="bbb">0</b></span></div>' +
      '<div id="bCourt" style="position:relative;height:320px;background:linear-gradient(#f3d9a4,#e0b070);border-radius:12px;overflow:hidden;margin-top:8px">' +
      '<div id="bHoop" style="position:absolute;top:40px;width:64px;height:12px;background:#e0503d;border-radius:4px"></div>' +
      '<div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);font-size:40px">🤺</div>' +
      '<div id="bBall" style="position:absolute;bottom:60px;left:50%;transform:translateX(-50%);font-size:34px">🏀</div></div>' +
      '<button class="x570-btn" id="bShoot" style="width:100%;margin-top:10px;font-size:18px">投篮！（在球筐对准中央时）</button>');
    var hoop = box.querySelector("#bHoop"), court = box.querySelector("#bCourt");
    var t = 0, pos = 0, dir = 1, score = 0, left = 30, timer = null;
    box.querySelector("#bbb").textContent = bestKey("gx570shoot");
    var raf = requestAnimationFrame(function move() {
      pos += dir * 2.4;
      if (pos > court.clientWidth - 70) { pos = court.clientWidth - 70; dir = -1; }
      if (pos < 0) { pos = 0; dir = 1; }
      hoop.style.left = pos + "px";
      raf = requestAnimationFrame(move);
    });
    timer = setInterval(function () {
      left--;
      box.querySelector("#btm").textContent = left;
      if (left <= 0) {
        clearInterval(timer);
        cancelAnimationFrame(raf);
        var bb = bestKey("gx570shoot", score);
        court.innerHTML = '<div style="color:#5a3a1a;text-align:center;padding-top:120px;font-size:22px">结束！进球 ' + score + " 最佳 " + bb + "<br><button class='x570-btn' id='bAgain' style='margin-top:10px'>再来一局</button></div>";
        on(box.querySelector("#bAgain"), shoot);
      }
    }, 1000);
    on(box.querySelector("#bShoot"), "click", function () {
      var center = court.clientWidth / 2;
      var hoopCenter = pos + 32;
      if (Math.abs(hoopCenter - center) < 34) {
        score++;
        box.querySelector("#bsc").textContent = score;
        H.toast("进了！");
      } else {
        H.toast("差一点");
      }
    });
  }

  X570Games.dodge = { open: dodge, name: "躲避落石", icon: "🪨" };
  X570Games.tiles = { open: tiles, name: "别踩白块", icon: "🎹" };
  X570Games.shoot = { open: shoot, name: "投篮挑战", icon: "🏀" };

  function register() {
    try {
      if (window.XZ13 && XZ13.GAMES) {
        [
          { icon: "🪨", name: "躲避落石", bestKey: "gx570dodge", call: "X570Games.dodge.open()" },
          { icon: "🎹", name: "别踩白块", bestKey: "gx570tiles", call: "X570Games.tiles.open()" },
          { icon: "🏀", name: "投篮挑战", bestKey: "gx570shoot", call: "X570Games.shoot.open()" }
        ].forEach(function (g) {
          if (!XZ13.GAMES.some(function (x) { return x.name === g.name; })) XZ13.GAMES.push(g);
        });
      }
    } catch (e) {}
  }
  X570.register("gamesD", register, 6);
})();

/* ===== a460_festival.js ===== */
/* =====================================================================
   校园节日：教师节 / 中秋 / 国庆 / 元旦 / 艺术节 / 科技节 等活动
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc;

  function applyG(k, v) {
    if (window.G && typeof G[k] === "number") G[k] = Math.max(0, Math.min(100, G[k] + v));
  }

  var FESTIVALS = [
    {
      id: "teacher", ic: "👩‍🏫", t: "教师节", date: "9 月 10 日",
      d: "教室里，黑板上写满了给老师的祝福。大家在商量要不要准备一个惊喜。",
      acts: [
        { l: "上台念一段感谢词", r: "你认真地说出了心里话，老师红了眼眶。", fx: { mood: 3, social: 2 } },
        { l: "和同学一起出一期感恩板报", r: "你们配合默契，板报得了年级第一。", fx: { mood: 2, social: 2, knowledge: 1 } },
        { l: "悄悄写一张感谢卡", r: "你把卡片放在讲台边，老师发现后笑得很温柔。", fx: { mood: 2 } }
      ]
    },
    {
      id: "midautumn", ic: "🥮", t: "中秋节", date: "农历八月十五",
      d: "留校的同学聚在操场，月亮很圆。有人带了月饼，有人带了柚子。",
      acts: [
        { l: "把月饼分给室友", r: "大家围在一起吃月饼，宿舍像家一样暖。", fx: { mood: 3, social: 2, money: -3 } },
        { l: "给家里打个电话", r: "听到家人的声音，你心里踏实了许多。", fx: { mood: 3 } },
        { l: "和大家一起赏月", r: "你们在操场看月亮，聊了很多关于未来的话。", fx: { mood: 2, social: 2 } }
      ]
    },
    {
      id: "national", ic: "🇨🇳", t: "国庆节", date: "10 月 1 日",
      d: "校园里挂起了国旗，长假来临，你在规划这几天怎么过。",
      acts: [
        { l: "在家认真复习", r: "你利用假期查漏补缺，开学后明显从容了。", fx: { knowledge: 3, mood: 1 } },
        { l: "和家人出去走走", r: "难得的陪伴，让你放松了不少。", fx: { mood: 3, health: 1 } },
        { l: "参加社团志愿活动", r: "你做了一天志愿者，认识了很多新朋友。", fx: { social: 3, mood: 2 } }
      ]
    },
    {
      id: "art", ic: "🎨", t: "校园艺术节", date: "12 月",
      d: "一年一度的艺术节，各班都在排练节目，舞台搭在操场中央。",
      acts: [
        { l: "报名上台表演", r: "你站在聚光灯下，紧张又兴奋，赢得了掌声。", fx: { mood: 4, social: 3 } },
        { l: "帮忙做后台与道具", r: "你默默把每件事做好，节目顺利完成。", fx: { mood: 2, social: 2 } },
        { l: "做观众为班级加油", r: "你举着荧光棒，喊得嗓子都哑了。", fx: { mood: 3 } }
      ]
    },
    {
      id: "science", ic: "🔬", t: "科技节", date: "11 月",
      d: "科技节有实验展示、机器人比赛和科普讲座，操场摆满了展台。",
      acts: [
        { l: "组队做一个小发明", r: "你们熬夜调试，作品在展台上大受欢迎。", fx: { knowledge: 4, social: 2 } },
        { l: "听一场科普讲座", r: "你被前沿的科学深深吸引，记下了很多想法。", fx: { knowledge: 3 } },
        { l: "参加趣味实验", r: "你亲手做出彩色的泡沫，玩得很开心。", fx: { knowledge: 2, mood: 2 } }
      ]
    },
    {
      id: "newyear", ic: "🎆", t: "元旦", date: "1 月 1 日",
      d: "班里办起了元旦联欢会，黑板写满心愿，桌椅围成一圈。",
      acts: [
        { l: "写一张新年心愿", r: "你把目标郑重地贴上心愿墙，也贴进了心里。", fx: { mood: 3, knowledge: 1 } },
        { l: "表演一个节目", r: "你鼓起勇气上台，全班为你鼓掌。", fx: { mood: 3, social: 2 } },
        { l: "和同学互换礼物", r: "你抽到了一份温暖的礼物，也送出了心意。", fx: { mood: 3, social: 2, money: -5 } }
      ]
    },
    {
      id: "spring", ic: "🌸", t: "春季研学", date: "3 月",
      d: "春天的研学旅行，全班一起去郊外踏青，一路上歌声不断。",
      acts: [
        { l: "当小组组长", r: "你把路线和分工安排得井井有条。", fx: { social: 3, knowledge: 1 } },
        { l: "负责拍照记录", r: "你拍下了很多笑脸，做成了班级相册。", fx: { mood: 3, social: 2 } },
        { l: "安静地欣赏风景", r: "你把春天的样子记在心里，也记在笔记本上。", fx: { mood: 2, knowledge: 1 } }
      ]
    },
    {
      id: "grad", ic: "🎓", t: "毕业典礼", date: "6 月",
      d: "三年的时光走到这一天，大家穿着校服，在熟悉的教学楼前合影。",
      acts: [
        { l: "给老师和同学一个拥抱", r: "你认真地说了再见，也说了谢谢。", fx: { mood: 4, social: 3 } },
        { l: "在同学录上写下祝福", r: "你写下很多句前程似锦，也收获了很多。", fx: { mood: 3, social: 2 } },
        { l: "再绕校园走一圈", r: "你走过操场、图书馆、樱花道，把它们一一记住。", fx: { mood: 3, knowledge: 1 } }
      ]
    }
  ];

  function open() {
    var el = H.openFull("x570Sub", "🎉 校园节日");
    var body = el.querySelector(".x570-full-body");
    function home() {
      var html = '<div class="x570-card"><div class="t">一学年的节日活动</div><div class="d">选择一个节日，体验属于你的校园活动。</div></div>';
      html += '<div class="x570-list">' + FESTIVALS.map(function (f) {
        return '<div class="x570-fest" data-id="' + f.id + '"><span style="font-size:30px">' + f.ic + "</span>" +
          "<div><b>" + esc(f.t) + "</b> <span class='x570-chip'>" + esc(f.date) + "</span>" +
          '<div class="d">' + esc(f.d) + "</div></div></div>";
      }).join("") + "</div>";
      body.innerHTML = html;
      on(body, "click", function (e) {
        var it = e.target.closest("[data-id]");
        if (it) detail(it.getAttribute("data-id"));
      });
    }
    function detail(id) {
      var f = FESTIVALS.filter(function (x) { return x.id === id; })[0];
      body.innerHTML =
        '<div class="x570-card"><div class="t">' + f.ic + " " + esc(f.t) + " <span class='x570-chip'>" + esc(f.date) + "</span></div>" +
        '<div class="d" style="margin-top:8px">' + esc(f.d) + "</div></div>" +
        '<div class="x570-list">' + f.acts.map(function (a, i) {
          return '<button class="x570-btn fact" data-i="' + i + '" style="text-align:left;margin-bottom:8px">' + esc(a.l) + "</button>";
        }).join("") + "</div>" +
        '<button class="x570-btn" id="fBack" style="width:100%">← 返回节日列表</button>';
      on($("#fBack"), "click", home);
      on(body, "click", function (e) {
        var b = e.target.closest(".fact");
        if (!b) return;
        var a = f.acts[+b.getAttribute("data-i")];
        Object.keys(a.fx || {}).forEach(function (k) { applyG(k, a.fx[k]); });
        H.modal("<h3 style='margin:0 0 8px'>" + f.ic + " " + esc(f.t) + "</h3><div style='line-height:1.8'>" + esc(a.r) + "</div>");
      });
    }
    home();
  }

  X570.CampusSub.festival = open;
  X570.Festival = { open: open, FESTIVALS: FESTIVALS };
})();

/* ===== a470_profile.js ===== */
/* =====================================================================
   个人主页：学生卡（属性 / 称号 / 装扮 / 成就 / 运动会等聚合总览）
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet;

  function num(v) { return typeof v === "number" ? v : 0; }
  function readJSON(k, def) {
    try { var d = JSON.parse(lsGet(k, "null")); return d || def; } catch (e) { return def; }
  }
  function bar(label, v, color) {
    v = Math.max(0, Math.min(100, Math.round(v)));
    return '<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px">' +
      '<span>' + label + '</span><b>' + v + "</b></div>" +
      '<div class="x570-bar"><div class="x570-bar-i" style="width:' + v + "%;background:" + color + '"></div></div></div>';
  }

  function open() {
    var g = window.G || {};
    var charSel = readJSON("xz56_char_sel", null);
    var titleWorn = lsGet("xz570_title_worn", "freshman");
    var dress = readJSON("xz570_wardrobe_v1", null);
    var sport = readJSON("xz570_sport_v1", {});
    var pet = readJSON("xz570_pet_v1", null);
    var exams = readJSON("xz570_exam_v1", []);
    var achFlags = readJSON("xz570_ach_flags", {});
    var goal = lsGet("xz570_goal_v1", "");

    var titleName = "高一新生";
    try {
      if (window.X570 && X570.Titles) {
        var t = X570.Titles.TITLES.filter(function (x) { return x.id === titleWorn; })[0];
        if (t) titleName = t.ic + " " + t.n;
      }
    } catch (e) {}

    var name = (typeof window.fName !== "undefined" && window.fName) || (document.getElementById("fName") && document.getElementById("fName").value) || "同学";
    var av = dress ? (X570.Wardrobe.CATS.face.items.filter(function (x) { return x.id === dress.face; })[0] || { ic: "🙂" }).ic : "🙂";

    var achN = 0;
    try { X570.Ach.list.forEach(function (a) { try { if (a.chk()) achN++; } catch (e) {} }); } catch (e) {}

    var bestExam = exams.length ? Math.max.apply(null, exams.map(function (x) { return x.score; })) : 0;
    var persona = "";
    if (charSel && charSel.mbti) persona = charSel.mbti;

    var html = '<div class="x570-card" style="text-align:center">' +
      '<div style="font-size:64px">' + av + "</div>" +
      '<div class="t" style="font-size:22px">' + esc(name) + "</div>" +
      '<div class="d">杭州西子实验学校 · 高中生</div>' +
      '<div style="margin-top:8px"><span class="x570-chip">' + titleName + "</span>" +
      (persona ? ' <span class="x570-chip">' + persona + "</span>" : "") + "</div>" +
      (goal ? '<div class="d" style="margin-top:8px">心之所向：<b style="color:#ffd166">' + esc(goal) + "</b></div>" : "") +
      "</div>";

    html += '<div class="x570-card"><div class="t">📊 成长属性</div>' +
      bar("知识", num(g.knowledge), "#4a90d9") +
      bar("心情", num(g.mood), "#ff9fa8") +
      bar("社交", num(g.social), "#7bc47f") +
      bar("体质", num(g.health), "#e0a23c") +
      (typeof g.money === "number" ? '<div class="d">零花钱：🪙 ' + num(g.money) + "</div>" : "") +
      "</div>";

    html += '<div class="x570-card"><div class="t">🏆 数据一览</div>' +
      '<div class="x570-stat-grid">' +
      '<div class="x570-stat"><b>' + achN + "</b><span>已解锁成就</span></div>" +
      '<div class="x570-stat"><b>' + (sport.gold || 0) + "</b><span>运动会金牌</span></div>" +
      '<div class="x570-stat"><b>' + (sport.score || 0) + "</b><span>团体总分</span></div>" +
      '<div class="x570-stat"><b>' + (exams.length) + "</b><span>模拟考试</span></div>" +
      '<div class="x570-stat"><b>' + bestExam + "</b><span>考试最高分</span></div>" +
      '<div class="x570-stat"><b>' + (pet ? pet.level : 0) + "</b><span>橘猫等级</span></div>" +
      "</div></div>";

    var el = H.openFull("x570Sub", "🪪 个人主页");
    var body = el.querySelector(".x570-full-body");
    body.innerHTML = html +
      '<div class="x570-card x570-center"><div class="d">在校园中心里可以装扮自己、佩戴称号、记录目标，这些都会显示在这里。</div></div>';
  }

  X570.CampusSub.profile = open;
  X570.Profile = { open: open };
})();

/* ===== a500_wishes.js ===== */
/* =====================================================================
   心愿瓶：写下心愿投入瓶中，可随机捞起别人的心愿，互相打气
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_wishes_v1";

  var SEED = [
    "希望月考能进步十名，我会努力的。",
    "希望和最好的朋友，永远不要走散。",
    "希望能考去那座有她的城市。",
    "希望妈妈身体一直健健康康。",
    "希望我能再勇敢一点，敢举手、敢表达。",
    "希望运动会接力不掉棒。",
    "希望把数学这道坎跨过去。",
    "希望每晚都能早点睡。",
    "希望考上心仪的大学，成为想成为的人。",
    "希望那个爱笑的人，每天都开心。",
    "希望加入篮球队，打上主力。",
    "希望英语能说得流利一点。",
    "希望爷爷奶奶长命百岁。",
    "希望我的画能在校艺术节上展出。",
    "希望能把喜欢的钢琴一直弹下去。",
    "希望我们班这学期能拿文明班级。",
    "希望自己别再拖延了。",
    "希望体测全部满分。",
    "希望毕业那天，大家都不留遗憾。",
    "希望看到这条心愿的人，今天也有好心情。"
  ];
  var REPLIES = ["加油，你一定可以的！", "看到你的心愿，我也被鼓励到了。", "我们一起努力，顶峰相见。", "心之所向，素履以往。", "愿望会发光，别放弃。"];

  function load() {
    try {
      var d = JSON.parse(lsGet(KEY, "null"));
      if (d) return d;
    } catch (e) {}
    var d = { mine: [], pool: SEED.map(function (t) { return { t: t, like: 0, reply: "" }; }), picked: 0 };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "🍶 心愿瓶");
    var body = el.querySelector(".x570-full-body");
    function home() {
      var html = '<div class="x570-card"><div class="t">心愿瓶</div>' +
        '<div class="d">把心愿写在纸条上塞进瓶子，也可以捞起一个陌生人的心愿，悄悄为他打气。</div></div>';
      html += '<div class="x570-campus-grid">' +
        '<div class="x570-campus-item" id="wWrite"><div class="ic">✍️</div><div class="n">写下心愿</div><div class="d">投入瓶中</div></div>' +
        '<div class="x570-campus-item" id="wPick"><div class="ic">🌊</div><div class="n">捞一个心愿</div><div class="d">已捞 ' + d.picked + " 次</div></div>" +
        '<div class="x570-campus-item" id="wMine"><div class="ic">🫙</div><div class="n">我的心愿</div><div class="d">' + d.mine.length + " 个</div></div></div>";
      body.innerHTML = html;
      on($("#wWrite"), "click", write);
      on($("#wPick"), "click", pick);
      on($("#wMine"), "click", mine);
    }
    function write() {
      body.innerHTML =
        '<div class="x570-card"><div class="t">写下你的心愿</div>' +
        '<textarea id="wishText" rows="6" style="width:100%;box-sizing:border-box;border-radius:10px;padding:12px;font-size:16px" placeholder="在心里认真地写下它……"></textarea></div>' +
        '<div style="display:flex;gap:10px"><button class="x570-btn" id="wishOk" style="flex:1">塞进心愿瓶 🍶</button>' +
        '<button class="x570-btn" id="wishBack" style="flex:1">返回</button></div>';
      on($("#wishBack"), "click", home);
      on($("#wishOk"), "click", function () {
        var v = $("#wishText").value.trim();
        if (!v) return H.toast("先写下心愿吧");
        d.mine.push({ t: v, like: 0, reply: "" });
        d.pool.push({ t: v, like: 0, reply: "" });
        save(d);
        H.toast("心愿已投入瓶中，愿它慢慢实现");
        home();
      });
    }
    function pick() {
      if (!d.pool.length) return H.toast("瓶子里暂时没有心愿了");
      var w = d.pool[Math.floor(Math.random() * d.pool.length)];
      d.picked++;
      save(d);
      body.innerHTML =
        '<div class="x570-card"><div class="t">🌊 你捞起了一个心愿</div>' +
        '<div style="font-size:18px;line-height:1.9;margin:14px 0;padding:16px;background:rgba(255,255,255,.06);border-radius:12px">「' + esc(w.t) + "」</div>" +
        '<div class="d">已经有 ' + w.like + " 人为它打气</div>" +
        (w.reply ? '<div class="d" style="margin-top:8px">留言：' + esc(w.reply) + "</div>" : "") +
        '<div style="display:flex;gap:10px;margin-top:14px">' +
        '<button class="x570-btn" id="wishCheer" style="flex:1">为 TA 打气 💪</button>' +
        '<button class="x570-btn" id="wishAgain" style="flex:1">再捞一个</button>' +
        "</div>" +
        '<button class="x570-btn" id="wishBack2" style="width:100%;margin-top:10px">返回</button>';
      on($("#wishCheer"), "click", function () {
        w.like++;
        if (!w.reply) w.reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
        save(d);
        H.toast("你送出了一份鼓励");
        pick();
      });
      on($("#wishAgain"), "click", pick);
      on($("#wishBack2"), "click", home);
    }
    function mine() {
      var html = '<div class="x570-card"><div class="t">我的心愿</div></div>';
      if (!d.mine.length) html += '<div class="x570-card x570-center"><div class="d">还没有心愿，去写下第一个吧。</div></div>';
      else html += d.mine.map(function (w) {
        return '<div class="x570-diary"><div class="x570-diary-b">「' + esc(w.t) + "」 收到 " + w.like + " 份鼓励</div></div>";
      }).join("");
      html += '<button class="x570-btn" id="wishBack3" style="width:100%">返回</button>';
      body.innerHTML = html;
      on($("#wishBack3"), "click", home);
    }
    home();
  }

  X570.CampusSub.wish = open;
  X570.Wishes = { open: open };
})();

/* ===== a510_signin.js ===== */
/* =====================================================================
   每日签到：连续签到、累计奖励、随机一句鼓励
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_signin_v1";

  var CHEER = [
    "新的一天，先对自己说一声加油。",
    "认真的人，自带光芒。",
    "你走过的每一步，都算数。",
    "今天的努力，是明天的伏笔。",
    "把借口留在昨天，把行动交给今天。",
    "慢慢来，比较快。",
    "目标决定你想成为谁，行动决定你能成为谁。",
    "再微小的光，也是光。",
    "别让未来的你，讨厌现在不努力的自己。",
    "心之所向，素履以往。"
  ];

  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d) return d; } catch (e) {}
    var d = { last: "", streak: 0, total: 0, coins: 0, week: [false, false, false, false, false, false, false] };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }
  function dayStr(d) { return new Date(d).toDateString(); }

  function open() {
    var d = load();
    var today = dayStr(Date.now());
    var yest = dayStr(Date.now() - 86400000);
    var signed = d.last === today;
    var el = H.openFull("x570Sub", "📅 每日签到");
    var body = el.querySelector(".x570-full-body");
    function reward(n) {
      if (n % 7 === 0) return 20;
      if (n % 3 === 0) return 10;
      return 5;
    }
    function render() {
      var html = '<div class="x570-card x570-center"><div class="t">每日签到</div>' +
        '<div style="font-size:46px;margin:10px 0">' + (signed ? "✅" : "📅") + "</div>" +
        '<div class="d">连续签到 <b style="color:#ff9fa8">' + d.streak + "</b> 天 · 累计 " + d.total + " 天</div>" +
        '<div class="d">签到零花钱 🪙 ' + d.coins + "</div>" +
        (signed ? '<div class="d" style="margin-top:10px">今天已经签到啦，明天继续！</div>' :
          '<button class="x570-btn" id="signBtn" style="margin-top:12px;font-size:17px;padding:12px 26px">立即签到</button>') +
        "</div>";
      html += '<div class="x570-card"><div class="t">本周签到</div><div class="x570-sign-week">' +
        ["一", "二", "三", "四", "五", "六", "日"].map(function (wd, i) {
          return '<div class="x570-sign-day ' + (d.week[i] ? "on" : "") + '"><span>周' + wd + "</span><b>" + (d.week[i] ? "✓" : "·") + "</b></div>";
        }).join("") + "</div></div>";
      html += '<div class="x570-card"><div class="t">签到奖励</div><div class="d">每天签到得 🪙5，连续 3 天得 10，连续 7 天得 20。连续签到会中断，记得每天来打卡。</div></div>';
      if (signed) {
        html += '<div class="x570-card x570-center"><div class="d">「' + CHEER[d.total % CHEER.length] + "」</div></div>";
      }
      body.innerHTML = html;
      on($("#signBtn"), "click", function () {
        if (d.last !== today) {
          if (d.last === yest) d.streak++;
          else d.streak = 1;
          d.total++;
          var rw = reward(d.streak);
          d.coins += rw;
          d.week[(new Date().getDay() + 6) % 7] = true;
          d.last = today;
          if (window.G) {
            G.money = (typeof G.money === "number" ? G.money : 0) + rw;
            G.mood = Math.min(100, (G.mood || 0) + 2);
          }
          save(d);
          H.toast("签到成功！获得 🪙" + rw);
          signed = true;
          render();
        }
      });
    }
    render();
  }

  X570.CampusSub.signin = open;
  X570.Signin = { open: open };
})();

/* ===== a540_words.js ===== */
/* =====================================================================
   英语单词卡：分类记忆、翻面看释义、认识/不认识统计
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var K = "xz570_words_known";

  var WORDS = {
    "校园学习": [
      ["campus", "校园", "The campus is very beautiful."],
      ["library", "图书馆", "I study in the library."],
      ["classroom", "教室", "Our classroom is on the second floor."],
      ["homework", "作业", "I finish my homework before nine."],
      ["exam", "考试", "We have an exam next week."],
      ["subject", "学科", "Math is my favorite subject."],
      ["knowledge", "知识", "Knowledge is power."],
      ["practice", "练习", "Practice makes perfect."],
      ["question", "问题", "May I ask a question?"],
      ["answer", "回答", "The answer is on the blackboard."],
      ["notebook", "笔记本", "I wrote it in my notebook."],
      ["textbook", "课本", "Open your textbook to page ten."],
      ["scholar", "学者", "He is a young scholar."],
      ["review", "复习", "Let's review the lesson."],
      ["progress", "进步", "You have made great progress."],
      ["grammar", "语法", "English grammar is not so hard."],
      ["vocabulary", "词汇", "Build your vocabulary every day."],
      ["lecture", "讲座", "There is a lecture today."],
      ["campus life", "校园生活", "I enjoy campus life."],
      ["graduate", "毕业", "We will graduate in summer."]
    ],
    "日常生活": [
      ["breakfast", "早餐", "Have a hot breakfast."],
      ["lunch", "午餐", "What's for lunch today?"],
      ["dinner", "晚餐", "We have dinner together."],
      ["weather", "天气", "The weather is nice today."],
      ["rain", "雨", "It is going to rain."],
      ["sunshine", "阳光", "The sunshine is warm."],
      ["friend", "朋友", "She is my best friend."],
      ["family", "家人", "I miss my family."],
      ["hobby", "爱好", "Reading is my hobby."],
      ["music", "音乐", "Music makes me happy."],
      ["sports", "运动", "Do sports every day."],
      ["healthy", "健康的", "Keep a healthy lifestyle."],
      ["sleep", "睡觉", "Sleep early and get up early."],
      ["water", "水", "Drink enough water."],
      ["fruit", "水果", "Eat some fruit after lunch."],
      ["money", "钱", "Save your pocket money."],
      ["clothes", "衣服", "Wear school clothes on Monday."],
      ["umbrella", "雨伞", "Take an umbrella with you."],
      ["weekend", "周末", "Have a good weekend."],
      ["holiday", "假期", "The holiday is coming."]
    ],
    "情感表达": [
      ["happy", "开心的", "I feel very happy today."],
      ["sad", "难过的", "Don't be sad."],
      ["excited", "兴奋的", "I am excited about the game."],
      ["nervous", "紧张的", "I feel nervous before exams."],
      ["confident", "自信的", "Be confident in yourself."],
      ["brave", "勇敢的", "Be brave and have a try."],
      ["kind", "善良的", "She is kind to everyone."],
      ["honest", "诚实的", "An honest boy tells the truth."],
      ["care", "关心", "I care about my friends."],
      ["miss", "想念", "I miss my old classmates."],
      ["believe", "相信", "I believe in you."],
      ["encourage", "鼓励", "Let's encourage each other."],
      ["dream", "梦想", "Hold on to your dream."],
      ["hope", "希望", "Where there is hope, there is a way."],
      ["effort", "努力", "Your effort will pay off."],
      ["future", "未来", "Work hard for your future."],
      ["courage", "勇气", "It takes courage to ask questions."],
      ["smile", "微笑", "She smiled at me."],
      ["thankful", "感恩的", "I am thankful for your help."],
      ["promise", "承诺", "I keep my promise."]
    ],
    "自然世界": [
      ["mountain", "山", "The mountain is very high."],
      ["river", "河流", "The river runs through the city."],
      ["lake", "湖", "The lake is quiet."],
      ["ocean", "海洋", "The ocean is huge."],
      ["forest", "森林", "The forest is full of life."],
      ["flower", "花", "The flowers bloom in spring."],
      ["tree", "树", "There is a big tree by the field."],
      ["cloud", "云", "White clouds are in the sky."],
      ["wind", "风", "The wind blows gently."],
      ["snow", "雪", "The first snow is exciting."],
      ["star", "星星", "Stars shine at night."],
      ["moon", "月亮", "The moon is round tonight."],
      ["sun", "太阳", "The sun rises in the east."],
      ["season", "季节", "Autumn is my favorite season."],
      ["spring", "春天", "Spring brings green leaves."],
      ["summer", "夏天", "Summer is hot."],
      ["autumn", "秋天", "Autumn smells of flowers."],
      ["winter", "冬天", "Winter is cold."],
      ["animal", "动物", "A cat is a lovely animal."],
      ["environment", "环境", "Protect the environment."]
    ]
  };

  function known() { try { return JSON.parse(lsGet(K, "{}")) || {}; } catch (e) { return {}; } }
  function saveKnown(o) { try { lsSet(K, JSON.stringify(o)); } catch (e) {} }

  function open() {
    var kn = known();
    var cats = Object.keys(WORDS);
    var cat = cats[0], idx = 0, shown = false;
    var el = H.openFull("x570Sub", "🔤 英语单词卡");
    var body = el.querySelector(".x570-full-body");
    function render() {
      var list = WORDS[cat];
      if (idx >= list.length) idx = 0;
      var w = list[idx];
      var key = cat + "|" + w[0];
      var totalKnown = 0;
      Object.keys(WORDS).forEach(function (c) { WORDS[c].forEach(function (x) { if (kn[c + "|" + x[0]]) totalKnown++; }); });
      var totalAll = cats.reduce(function (s, c) { return s + WORDS[c].length; }, 0);
      var tabs = '<div class="x570-ach-tabs">' + cats.map(function (c) {
        return '<button class="x570-ach-tab ' + (cat === c ? "on" : "") + '" data-c="' + c + '">' + c + "</button>";
      }).join("") + "</div>";
      var html = tabs +
        '<div class="x570-card"><div class="d">已掌握 ' + totalKnown + " / " + totalAll + " · 第 " + (idx + 1) + "/" + list.length + " 个</div></div>";
      html += '<div class="x570-flashcard" id="flash">' +
        '<div class="x570-flash-w">' + esc(w[0]) + "</div>" +
        (shown ? '<div class="x570-flash-m">' + esc(w[1]) + '</div><div class="x570-flash-e">' + esc(w[2]) + "</div>" : '<div class="x570-flash-hint">点击卡片查看释义</div>') +
        "</div>";
      html += '<div style="display:flex;gap:10px;margin-top:12px">' +
        '<button class="x570-btn" id="wNo" style="flex:1">还不熟</button>' +
        '<button class="x570-btn" id="wYes" style="flex:1">认识 ✓</button>' +
        "</div>";
      body.innerHTML = html;
      on(body, "click", function (e) {
        var t = e.target.closest("[data-c]");
        if (t) { cat = t.getAttribute("data-c"); idx = 0; shown = false; render(); }
        if (e.target.closest("#flash")) { shown = !shown; render(); }
        if (e.target.closest("#wYes")) { kn[key] = true; saveKnown(kn); idx++; shown = false; render(); }
        if (e.target.closest("#wNo")) { delete kn[key]; saveKnown(kn); idx++; shown = false; render(); }
      });
    }
    render();
  }

  X570.CampusSub.words = open;
  X570.Words = { open: open, WORDS: WORDS };
})();

/* ===== a550_poems.js ===== */
/* =====================================================================
   古诗词卡片：背诵名句、翻面看下句，含「接下句」小测
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc;

  var POEMS = [
    ["床前明月光", "疑是地上霜", "李白·静夜思"],
    ["举头望明月", "低头思故乡", "李白·静夜思"],
    ["春眠不觉晓", "处处闻啼鸟", "孟浩然·春晓"],
    ["夜来风雨声", "花落知多少", "孟浩然·春晓"],
    ["白日依山尽", "黄河入海流", "王之涣·登鹳雀楼"],
    ["欲穷千里目", "更上一层楼", "王之涣·登鹳雀楼"],
    ["红豆生南国", "春来发几枝", "王维·相思"],
    ["劝君多采撷", "此物最相思", "王维·相思"],
    ["独在异乡为异客", "每逢佳节倍思亲", "王维·九月九日"],
    ["会当凌绝顶", "一览众山小", "杜甫·望岳"],
    ["国破山河在", "城春草木深", "杜甫·春望"],
    ["烽火连三月", "家书抵万金", "杜甫·春望"],
    ["随风潜入夜", "润物细无声", "杜甫·春夜喜雨"],
    ["海内存知己", "天涯若比邻", "王勃·送杜少府"],
    ["海上生明月", "天涯共此时", "张九龄·望月怀远"],
    ["野火烧不尽", "春风吹又生", "白居易·赋得古原草"],
    ["同是天涯沦落人", "相逢何必曾相识", "白居易·琵琶行"],
    ["几处早莺争暖树", "谁家新燕啄春泥", "白居易·钱塘湖春行"],
    ["乱花渐欲迷人眼", "浅草才能没马蹄", "白居易·钱塘湖春行"],
    ["大漠孤烟直", "长河落日圆", "王维·使至塞上"],
    ["劝君更尽一杯酒", "西出阳关无故人", "王维·送元二使安西"],
    ["莫愁前路无知己", "天下谁人不识君", "高适·别董大"],
    ["忽如一夜春风来", "千树万树梨花开", "岑参·白雪歌"],
    ["春风又绿江南岸", "明月何时照我还", "王安石·泊船瓜洲"],
    ["不识庐山真面目", "只缘身在此山中", "苏轼·题西林壁"],
    ["但愿人长久", "千里共婵娟", "苏轼·水调歌头"],
    ["竹外桃花三两枝", "春江水暖鸭先知", "苏轼·惠崇春江晚景"],
    ["接天莲叶无穷碧", "映日荷花别样红", "杨万里·晓出净慈寺"],
    ["小荷才露尖尖角", "早有蜻蜓立上头", "杨万里·小池"],
    ["等闲识得东风面", "万紫千红总是春", "朱熹·春日"],
    ["问渠那得清如许", "为有源头活水来", "朱熹·观书有感"],
    ["粉骨碎身浑不怕", "要留清白在人间", "于谦·石灰吟"],
    ["千磨万击还坚劲", "任尔东西南北风", "郑燮·竹石"],
    ["落红不是无情物", "化作春泥更护花", "龚自珍·己亥杂诗"],
    ["黑发不知勤学早", "白首方悔读书迟", "颜真卿·劝学"],
    ["少壮不努力", "老大徒伤悲", "汉乐府·长歌行"],
    ["三人行", "必有我师焉", "论语"],
    ["温故而知新", "可以为师矣", "论语"],
    ["学而不思则罔", "思而不学则殆", "论语"],
    ["先天下之忧而忧", "后天下之乐而乐", "范仲淹·岳阳楼记"]
  ];

  function open() {
    var el = H.openFull("x570Sub", "📜 古诗词卡片");
    var body = el.querySelector(".x570-full-body");
    var tabs = [["read", "背诵卡"], ["quiz", "接下句"]];
    var cur = "read";
    function readView() {
      return '<div class="x570-card"><div class="t">背诵名句</div><div class="d">点击卡片看答案，左右滑动按钮切换。</div></div>' +
        POEMS.map(function (p, i) {
          return '<div class="x570-poem" data-i="' + i + '"><div class="x570-poem-a">' + esc(p[0]) + "，</div>" +
            '<div class="x570-poem-b" data-b="' + i + '" style="display:none">' + esc(p[1]) + "。</div>" +
            '<div class="x570-poem-s">' + esc(p[2]) + "</div></div>";
        }).join("");
    }
    var curPair = null;
    function quizView() {
      var q = POEMS[Math.floor(Math.random() * POEMS.length)];
      curPair = q;
      var good = q[1];
      var others = POEMS.filter(function (x) { return x[1] !== good; }).sort(function () { return Math.random() - 0.5; }).slice(0, 3).map(function (x) { return x[1]; });
      var opts = others.concat([good]).sort(function () { return Math.random() - 0.5; });
      return '<div class="x570-card"><div class="t">接下一句</div><div class="d" style="font-size:22px;margin-top:10px">「' + esc(q[0]) + "，」</div><div class='d'>" + esc(q[2]) + "</div></div>" +
        '<div class="x570-list">' + opts.map(function (o) {
          return '<button class="x570-btn popt" data-o="' + esc(o) + '" style="margin-bottom:8px;text-align:left">' + esc(o) + "</button>";
        }).join("") + "</div>" +
        '<div id="pRes" style="text-align:center;min-height:24px"></div>' +
        '<button class="x570-btn" id="pNext" style="width:100%;margin-top:8px">下一题</button>';
    }
    function render() {
      var bar = '<div class="x570-ach-tabs">' + tabs.map(function (t) {
        return '<button class="x570-ach-tab ' + (cur === t[0] ? "on" : "") + '" data-t="' + t[0] + '">' + t[1] + "</button>";
      }).join("") + "</div>";
      body.innerHTML = bar + (cur === "read" ? readView() : quizView());
      on(body, "click", function (e) {
        var t = e.target.closest("[data-t]");
        if (t) { cur = t.getAttribute("data-t"); render(); }
        var p = e.target.closest(".x570-poem");
        if (p) {
          var b = p.querySelector(".x570-poem-b");
          if (b) b.style.display = b.style.display === "none" ? "block" : "none";
        }
        var o = e.target.closest(".popt");
        if (o && curPair) {
          var res = $("#pRes");
          if (o.getAttribute("data-o") === curPair[1]) {
            res.innerHTML = '<b style="color:#7bc47f">答对了！</b>';
            if (window.G) G.knowledge = Math.min(100, (G.knowledge || 0) + 1);
          } else {
            res.innerHTML = '<b style="color:#ef6f6c">不对，正确答案：' + curPair[1] + "</b>";
          }
        }
        if (e.target.closest("#pNext")) render();
      });
    }
    render();
  }

  X570.CampusSub.poem = open;
  X570.Poems = { open: open, POEMS: POEMS };
})();

/* ===== a560_guide.js ===== */
/* =====================================================================
   校园导览：设施地图与使用说明，帮助新同学快速认识校园
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc;

  var PLACES = [
    { id: "g1", ic: "🏫", n: "教学楼", zone: "教学区", d: "高一到高三的教室都在这里，早自习和大部分课程在此进行。", tip: "记住楼层和教室号，课间换教室别跑错。" },
    { id: "g2", ic: "🏟️", n: "操场", zone: "运动区", d: "环形跑道、足球场和篮球场，体育课、大课间和运动会的主场。", tip: "运动前热身，身体不舒服及时报告。" },
    { id: "g3", ic: "🏀", n: "篮球场", zone: "运动区", d: "操场旁的露天球场，午休和放学后最热闹。", tip: "可以约同学打三对三，注意补水。" },
    { id: "g4", ic: "📚", n: "图书馆", zone: "学习区", d: "有借阅区、自习区和靠窗的安静位置，新书定期上架。", tip: "保持安静，借书记得按时归还。" },
    { id: "g5", ic: "🧪", n: "实验楼", zone: "教学区", d: "物理、化学、生物实验室和器材室。", tip: "实验课严格遵守安全规范，听老师指挥。" },
    { id: "g6", ic: "💻", n: "信息机房", zone: "教学区", d: "信息技术课和电脑社团活动的地方。", tip: "上机要登记，离开时关机整理。" },
    { id: "g7", ic: "🎹", n: "艺术楼", zone: "艺术区", d: "琴房、美术教室、音乐教室都在这栋楼。", tip: "琴房可以预约使用，用完关灯关窗。" },
    { id: "g8", ic: "🍱", n: "食堂", zone: "生活区", d: "多个窗口供应三餐，免费例汤，高峰时段人较多。", tip: "错峰用餐更省时，记得带饭卡。" },
    { id: "g9", ic: "🛍️", n: "小卖部", zone: "生活区", d: "供应面包、零食、文具和饮用水。", tip: "理性消费，少喝太甜的饮料。" },
    { id: "g10", ic: "🛏️", n: "宿舍楼", zone: "生活区", d: "住校生的生活区，配有宿管、热水和洗衣设施。", tip: "遵守作息，熄灯后保持安静。" },
    { id: "g11", ic: "🏥", n: "医务室", zone: "生活区", d: "处理常见伤病，身体不适可及时就医。", tip: "身体不舒服别硬撑，及时报告并就医。" },
    { id: "g12", ic: "🌿", n: "心理咨询室", zone: "生活区", d: "安静私密的空间，心理老师随时欢迎你。", tip: "求助是勇敢的表现，不需要任何理由。" },
    { id: "g13", ic: "🚲", n: "自行车棚", zone: "出入口", d: "走读生停车的地方，靠近校门。", tip: "记得上锁，按区域整齐停放。" },
    { id: "g14", ic: "🚪", n: "校门与门卫室", zone: "出入口", d: "进出校园的主要通道，门卫室负责安全与失物招领。", tip: "晚归或离校需登记，遗失物品可来问。" },
    { id: "g15", ic: "🌊", n: "西子湖", zone: "校园周边", d: "学校名字里的那片水，放学后的风景很好。", tip: "注意安全，远离水边嬉戏。" },
    { id: "g16", ic: "🌸", n: "樱花道", zone: "休闲区", d: "操场旁的小道，春天樱花盛开，是拍照圣地。", tip: "文明观赏，不攀折花枝。" },
    { id: "g17", ic: "🌳", n: "花坛与连廊", zone: "休闲区", d: "教学楼之间的花坛和连廊，校园猫常在这里晒太阳。", tip: "课间在这里走走，放松眼睛。" },
    { id: "g18", ic: "🎤", n: "多功能厅", zone: "公共区", d: "讲座、演出、社团活动和年级大会的举办地。", tip: "进场有序，活动结束带走垃圾。" },
    { id: "g19", ic: "📻", n: "广播站", zone: "公共区", d: "位于综合楼，校园广播和点歌由这里播出。", tip: "想点歌或送祝福，可在点歌本上留言。" },
    { id: "g20", ic: "🏃", n: "体测场地", zone: "运动区", d: "长跑、跳远、实心球等体测项目的区域。", tip: "平时坚持锻炼，体测不慌。" }
  ];

  function open() {
    var el = H.openFull("x570Sub", "🗺️ 校园导览");
    var body = el.querySelector(".x570-full-body");
    var zones = ["全部", "教学区", "学习区", "运动区", "艺术区", "生活区", "公共区", "出入口", "休闲区", "校园周边"];
    var cur = "全部";
    function render() {
      var tabs = '<div class="x570-ach-tabs">' + zones.map(function (z) {
        return '<button class="x570-ach-tab ' + (cur === z ? "on" : "") + '" data-z="' + z + '">' + z + "</button>";
      }).join("") + "</div>";
      var list = PLACES.filter(function (p) { return cur === "全部" || p.zone === cur; });
      var html = tabs + '<div class="x570-list">' + list.map(function (p) {
        return '<div class="x570-guide"><span style="font-size:30px">' + p.ic + "</span>" +
          "<div><b>" + esc(p.n) + "</b> <span class='x570-chip'>" + esc(p.zone) + "</span>" +
          '<div class="d">' + esc(p.d) + "</div>" +
          '<div class="d">💡 ' + esc(p.tip) + "</div></div></div>";
      }).join("") + "</div>";
      body.innerHTML = html;
      on(body, "click", function (e) {
        var z = e.target.closest("[data-z]");
        if (z) { cur = z.getAttribute("data-z"); render(); }
      });
    }
    render();
  }

  X570.CampusSub.guide = open;
  X570.Guide = { open: open, PLACES: PLACES };
})();

/* ===== a570_canteen.js ===== */
/* =====================================================================
   食堂菜单：今日菜单、营养搭配、点餐记账、套餐推荐
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_canteen_v1";

  var MENU = {
    "盖饭/面档": [
      { n: "番茄炒蛋盖饭", p: 10, cal: 620, tag: "清淡", d: "酸甜开胃，蛋白质丰富" },
      { n: "红烧肉盖饭", p: 14, cal: 780, tag: "热门", d: "肥而不腻，下饭神器" },
      { n: "鸡腿饭", p: 13, cal: 700, tag: "高蛋白", d: "一整个大鸡腿" },
      { n: "牛肉面", p: 12, cal: 640, tag: "热门", d: "汤鲜面弹" },
      { n: "炸酱面", p: 10, cal: 600, tag: "管饱", d: "酱香浓郁" },
      { n: "麻婆豆腐盖饭", p: 11, cal: 580, tag: "微辣", d: "豆腐嫩，下饭" },
      { n: "扬州炒饭", p: 11, cal: 660, tag: "均衡", d: "有蛋有肉有菜" },
      { n: "青菜肉丝面", p: 9, cal: 520, tag: "清淡", d: "清爽，适合没胃口" }
    ],
    "小吃/点心": [
      { n: "手抓饼", p: 6, cal: 420, tag: "早餐", d: "加蛋更顶饱" },
      { n: "包子(两个)", p: 4, cal: 360, tag: "早餐", d: "肉包菜包都有" },
      { n: "煎饺", p: 7, cal: 400, tag: "人气", d: "底部焦香" },
      { n: "烤肠", p: 3, cal: 180, tag: "加餐", d: "偶尔解馋" },
      { n: "关东煮", p: 8, cal: 260, tag: "暖身", d: "萝卜、鱼丸、海带" },
      { n: "煎饼果子", p: 7, cal: 450, tag: "早餐", d: "加薄脆更酥" }
    ],
    "饮品/汤": [
      { n: "免费例汤", p: 0, cal: 60, tag: "免费", d: "每餐供应" },
      { n: "紫菜蛋花汤", p: 2, cal: 80, tag: "清淡", d: "清淡养胃" },
      { n: "豆浆", p: 3, cal: 150, tag: "早餐", d: "无糖更健康" },
      { n: "绿豆汤", p: 3, cal: 180, tag: "解暑", d: "夏天限定" },
      { n: "牛奶", p: 4, cal: 200, tag: "高蛋白", d: "补充钙质" },
      { n: "矿泉水", p: 2, cal: 0, tag: "补水", d: "最健康的选择" }
    ],
    "蔬菜/健康": [
      { n: "清炒时蔬", p: 5, cal: 120, tag: "健康", d: "当季青菜" },
      { n: "凉拌黄瓜", p: 4, cal: 80, tag: "低卡", d: "清脆爽口" },
      { n: "番茄蛋汤", p: 3, cal: 120, tag: "低卡", d: "番茄红素丰富" },
      { n: "水煮蛋", p: 2, cal: 90, tag: "高蛋白", d: "优质蛋白" },
      { n: "玉米", p: 3, cal: 160, tag: "粗粮", d: "膳食纤维" },
      { n: "苹果", p: 2, cal: 90, tag: "水果", d: "每天一个果" }
    ]
  };
  var COMBOS = [
    { n: "活力早餐套餐", items: ["包子(两个)", "豆浆", "水煮蛋"], d: "约 600 大卡，元气满满一上午" },
    { n: "营养均衡套餐", items: ["番茄炒蛋盖饭", "清炒时蔬", "免费例汤"], d: "有肉有菜有汤，营养均衡" },
    { n: "健身加餐套餐", items: ["鸡腿饭", "牛奶", "苹果"], d: "高蛋白，适合运动后" },
    { n: "清爽减脂套餐", items: ["青菜肉丝面", "凉拌黄瓜", "矿泉水"], d: "低卡饱腹，无负担" }
  ];

  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d) return d; } catch (e) {}
    var d = { spent: 0, count: 0, history: [] };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "🍱 食堂菜单");
    var body = el.querySelector(".x570-full-body");
    var cats = Object.keys(MENU);
    var cur = cats[0];
    function render() {
      var money = (window.G && typeof G.money === "number") ? G.money : 0;
      var tabs = '<div class="x570-ach-tabs">' +
        cats.concat(["套餐推荐", "我的账单"]).map(function (c) {
          return '<button class="x570-ach-tab ' + (cur === c ? "on" : "") + '" data-c="' + c + '">' + c + "</button>";
        }).join("") + "</div>";
      var html = tabs;
      if (cats.indexOf(cur) >= 0) {
        html += '<div class="x570-card"><div class="d">零花钱：🪙' + money + " · 每顿合理搭配，别总吃太油的。</div></div>";
        html += '<div class="x570-list">' + MENU[cur].map(function (m) {
          return '<div class="x570-food"><div><b>' + esc(m.n) + "</b> <span class='x570-chip'>" + esc(m.tag) + "</span>" +
            '<div class="d">' + esc(m.d) + " · " + m.cal + " 大卡</div></div>" +
            '<button class="x570-btn" data-buy="' + esc(m.n) + '" style="white-space:nowrap">🪙' + m.p + "</button></div>";
        }).join("") + "</div>";
      } else if (cur === "套餐推荐") {
        html += COMBOS.map(function (c) {
          var price = c.items.reduce(function (s, name) {
            var found = null;
            cats.forEach(function (cat) { MENU[cat].forEach(function (m) { if (m.n === name) found = m; }); });
            return s + (found ? found.p : 0);
          }, 0);
          return '<div class="x570-card"><div class="t">' + esc(c.n) + " <span class='x570-chip'>🪙" + price + "</span></div>" +
            '<div class="d">' + c.items.map(esc).join(" + ") + "</div>" +
            '<div class="d">💡 ' + esc(c.d) + "</div>" +
            '<button class="x570-btn" data-combo="' + esc(c.n) + '" style="width:100%;margin-top:8px">选择这个套餐</button></div>';
        }).join("");
      } else {
        html = '<div class="x570-card"><div class="t">我的账单</div><div class="d">累计点餐 ' + d.count + " 次，共花费 🪙" + d.spent + "</div></div>";
        if (d.history.length) {
          html += '<div class="x570-list">' + d.history.slice(-12).reverse().map(function (h) {
            return '<div class="x570-diary"><div class="x570-diary-b">' + esc(h.name) + " <span class='x570-chip'>🪙" + h.p + "</span></div></div>";
          }).join("") + "</div>";
        } else {
          html += '<div class="x570-card x570-center"><div class="d">还没有点餐记录。</div></div>';
        }
      }
      body.innerHTML = html;
      on(body, "click", function (e) {
        var t = e.target.closest("[data-c]");
        if (t) { cur = t.getAttribute("data-c"); render(); }
        var b = e.target.closest("[data-buy]");
        if (b) buy(b.getAttribute("data-buy"));
        var cb = e.target.closest("[data-combo]");
        if (cb) {
          var c = COMBOS.filter(function (x) { return x.n === cb.getAttribute("data-combo"); })[0];
          c.items.forEach(function (name) { buy(name, true); });
          H.toast("已点「" + c.n + "」");
        }
      });
    }
    function buy(name, quiet) {
      var found = null;
      cats.forEach(function (cat) { MENU[cat].forEach(function (m) { if (m.n === name) found = m; }); });
      if (!found) return;
      var money = (window.G && typeof G.money === "number") ? G.money : 0;
      if (found.p > money) { if (!quiet) H.toast("零花钱不够啦"); return; }
      if (window.G) {
        G.money -= found.p;
        G.health = Math.min(100, (G.health || 0) + (found.cal < 200 ? 1 : 2));
        G.mood = Math.min(100, (G.mood || 0) + 1);
      }
      d.spent += found.p; d.count++;
      d.history.push({ name: name, p: found.p, cal: found.cal });
      if (d.history.length > 60) d.history.shift();
      save(d);
      if (!quiet) { H.toast("点了「" + name + "」，-🪙" + found.p); render(); }
    }
    render();
  }

  X570.CampusSub.canteen = open;
  X570.Canteen = { open: open, MENU: MENU, COMBOS: COMBOS };
})();

/* ===== a590_formula.js ===== */
/* =====================================================================
   理科公式速记卡：数学 / 物理 / 化学 常用公式与适用条件
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc;

  var CARDS = {
    "数学": [
      { f: "平方差：a²-b²=(a+b)(a-b)", d: "因式分解常用，注意与完全平方区分。" },
      { f: "完全平方：(a±b)²=a²±2ab+b²", d: "展开与配方都要熟练。" },
      { f: "求根公式：x=(-b±√(b²-4ac))/2a", d: "用于一元二次方程 ax²+bx+c=0（a≠0）。" },
      { f: "判别式：Δ=b²-4ac", d: "Δ>0 两根，Δ=0 一根，Δ<0 无实根。" },
      { f: "韦达定理：x₁+x₂=-b/a，x₁x₂=c/a", d: "不解方程求两根关系。" },
      { f: "二次函数顶点：(-b/2a, (4ac-b²)/4a)", d: "对称轴 x=-b/2a。" },
      { f: "勾股定理：a²+b²=c²", d: "直角三角形，c 为斜边。" },
      { f: "圆周长：C=2πr", d: "r 为半径，直径 d=2r。" },
      { f: "圆面积：S=πr²", d: "扇形面积 S=nπr²/360。" },
      { f: "弧长：l=nπr/180", d: "n 为圆心角度数。" },
      { f: "等差数列通项：aₙ=a₁+(n-1)d", d: "d 为公差。" },
      { f: "等差求和：Sₙ=n(a₁+aₙ)/2", d: "也等于 na₁+n(n-1)d/2。" },
      { f: "等比数列通项：aₙ=a₁·q^(n-1)", d: "q 为公比。" },
      { f: "等比求和：Sₙ=a₁(1-qⁿ)/(1-q)", d: "q≠1。" },
      { f: "概率：P=有利结果/总结果", d: "注意等可能与放回问题。" },
      { f: "平均数：x̄=Σx/n", d: "方差衡量数据波动。" },
      { f: "扇形/弧：S=nπr²/360", d: "与弧长公式配套记忆。" },
      { f: "斜率：k=(y₂-y₁)/(x₂-x₁)", d: "一次函数 y=kx+b。" }
    ],
    "物理": [
      { f: "速度：v=s/t", d: "匀速直线运动，s 为路程。" },
      { f: "密度：ρ=m/V", d: "单位 kg/m³ 或 g/cm³。" },
      { f: "重力：G=mg", d: "g 约 9.8 N/kg，常取 10。" },
      { f: "压强：p=F/S", d: "受力面积越小压强越大。" },
      { f: "液体压强：p=ρgh", d: "h 为深度。" },
      { f: "浮力：F浮=ρ液gV排", d: "阿基米德原理。" },
      { f: "漂浮/悬浮：F浮=G物", d: "二力平衡。" },
      { f: "牛顿第二定律：F=ma", d: "合力方向决定加速度方向。" },
      { f: "功：W=Fs", d: "力与位移同方向；单位焦耳。" },
      { f: "功率：P=W/t", d: "表示做功快慢；单位瓦特。" },
      { f: "机械效率：η=W有用/W总", d: "总是小于 1。" },
      { f: "杠杆平衡：F₁L₁=F₂L₂", d: "动力×动力臂=阻力×阻力臂。" },
      { f: "欧姆定律：I=U/R", d: "适用于纯电阻电路。" },
      { f: "串联：I 处处相等", d: "电压按电阻分配。" },
      { f: "并联：U 相等", d: "干路电流等于各支路之和。" },
      { f: "电功：W=UIt", d: "1 度=1 kW·h。" },
      { f: "电功率：P=UI=I²R=U²/R", d: "纯电阻条件下等效。" },
      { f: "焦耳定律：Q=I²Rt", d: "电流产生的热量。" },
      { f: "光的反射：反射角=入射角", d: "反射光线、入射光线分居法线两侧。" },
      { f: "光速（真空）：c≈3×10⁸ m/s", d: "光在真空中传播最快。" }
    ],
    "化学": [
      { f: "物质的量：n=m/M", d: "M 为摩尔质量。" },
      { f: "粒子数：N=n·N_A", d: "阿伏伽德罗常数 N_A≈6.02×10²³。" },
      { f: "气体摩尔体积：V=n·Vm", d: "标准状况下 Vm≈22.4 L/mol。" },
      { f: "质量守恒：反应前后总质量不变", d: "方程式据此配平。" },
      { f: "质量分数：w=m溶质/m溶液", d: "溶液浓度常用。" },
      { f: "溶液稀释：m浓·w浓=m稀·w稀", d: "稀释前后溶质不变。" },
      { f: "pH：pH=-lg[H⁺]", d: "pH<7 酸，=7 中，>7 碱。" },
      { f: "金属活动性顺序", d: "K Ca Na Mg Al Zn Fe Sn Pb (H) Cu Hg Ag Pt Au。" },
      { f: "化合反应：A+B→AB", d: "多变一。" },
      { f: "分解反应：AB→A+B", d: "一变多。" },
      { f: "置换反应：A+BC→AC+B", d: "活泼金属置换较弱金属或氢。" },
      { f: "复分解反应：AB+CD→AD+CB", d: "生成沉淀、气体或水。" },
      { f: "氧化：失电子、化合价升", d: "被氧化，作还原剂。" },
      { f: "还原：得电子、化合价降", d: "被还原，作氧化剂。" },
      { f: "氧气制取：2H₂O₂→2H₂O+O₂↑", d: "二氧化锰催化。" },
      { f: "二氧化碳：CaCO₃+2HCl→CaCl₂+H₂O+CO₂↑", d: "实验室制法。" },
      { f: "氢气制取：Zn+H₂SO₄→ZnSO₄+H₂↑", d: "活泼金属与稀酸。" }
    ]
  };

  function open() {
    var el = H.openFull("x570Sub", "🧮 公式速记卡");
    var body = el.querySelector(".x570-full-body");
    var cats = Object.keys(CARDS);
    var cur = cats[0], revealed = {};
    function render() {
      var tabs = '<div class="x570-ach-tabs">' + cats.map(function (c) {
        return '<button class="x570-ach-tab ' + (cur === c ? "on" : "") + '" data-c="' + c + '">' + c + "</button>";
      }).join("") + "</div>";
      var html = tabs + '<div class="x570-card"><div class="d">点击卡片查看说明与使用条件。</div></div>';
      html += CARDS[cur].map(function (card, i) {
        var key = cur + i;
        return '<div class="x570-fcard" data-k="' + key + '"><div class="x570-fcard-f">' + esc(card.f) + "</div>" +
          '<div class="x570-fcard-d" data-d="' + key + '" style="display:none">💡 ' + esc(card.d) + "</div></div>";
      }).join("");
      body.innerHTML = html;
      on(body, "click", function (e) {
        var t = e.target.closest("[data-c]");
        if (t) { cur = t.getAttribute("data-c"); render(); }
        var card = e.target.closest(".x570-fcard");
        if (card) {
          var d = card.querySelector(".x570-fcard-d");
          if (d) d.style.display = d.style.display === "none" ? "block" : "none";
        }
      });
    }
    render();
  }

  X570.CampusSub.formula = open;
  X570.Formula = { open: open, CARDS: CARDS };
})();

/* ===== a610_relax.js ===== */
/* =====================================================================
   放松一刻：呼吸练习 / 正念减压 / 眼保健操，缓解学习压力
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc;

  var TIPS = [
    "把注意力放到呼吸上，不必强迫自己不想事。",
    "紧张时，先长长地呼一口气，再慢慢吸气。",
    "感到焦虑时，先说出眼前能看到的 5 样东西。",
    "肩膀放松，松开紧皱的眉头，松开握紧的拳头。",
    "学习 45 分钟后，远眺 6 米以外 20 秒。",
    "压力大时，写下三件今天值得感谢的小事。",
    "不要和别人的节奏比，按自己的步调走就好。",
    "允许自己有状态不好的时候，这很正常。"
  ];

  function open() {
    var el = H.openFull("x570Sub", "🌿 放松一刻");
    var body = el.querySelector(".x570-full-body");
    function home() {
      var html = '<div class="x570-card"><div class="t">给自己 5 分钟</div><div class="d">学习累了、压力大时，停下来做一会儿练习。</div></div>';
      html += '<div class="x570-campus-grid">' +
        '<div class="x570-campus-item" id="rBreath"><div class="ic">🫧</div><div class="n">呼吸练习</div><div class="d">4-7-8 呼吸法</div></div>' +
        '<div class="x570-campus-item" id="rEye"><div class="ic">👀</div><div class="n">眼保健操</div><div class="d">缓解用眼疲劳</div></div>' +
        '<div class="x570-campus-item" id="rMind"><div class="ic">🧘</div><div class="n">正念一分钟</div><div class="d">专注当下</div></div>' +
        '<div class="x570-campus-item" id="rTips"><div class="ic">💡</div><div class="n">减压小建议</div><div class="d">随机一条</div></div></div>';
      body.innerHTML = html;
      on($("#rBreath"), breath);
      on($("#rEye"), eye);
      on($("#rMind"), mind);
      on($("#rTips"), tips);
    }
    function breath() {
      var phase = 0, total = 0, timer = null;
      var phases = [
        { t: "吸气", s: 4, d: "用鼻子慢慢吸气 4 秒" },
        { t: "屏息", s: 7, d: "屏住呼吸 7 秒" },
        { t: "呼气", s: 8, d: "用嘴缓缓呼气 8 秒" }
      ];
      function render() {
        var p = phases[phase];
        body.innerHTML =
          '<div class="x570-card x570-center"><div class="t">🫧 4-7-8 呼吸法</div>' +
          '<div id="rOrb" class="x570-orb" style="animation-duration:' + p.s + 's">' + p.t + "</div>" +
          '<div class="d" style="font-size:17px">' + esc(p.d) + "</div>" +
          '<div class="d">循环 ' + Math.floor(total / 3) + " 次</div>" +
          '<button class="x570-btn" id="rStop" style="margin-top:12px">结束练习</button></div>';
        on($("#rStop"), "click", function () {
          clearInterval(timer);
          if (window.G) G.mood = Math.min(100, (G.mood || 0) + 5);
          H.toast("感觉好一点了吗？");
          home();
        });
      }
      render();
      timer = setInterval(function () {
        phase = (phase + 1) % 3;
        total++;
        if (phase === 0) {
          var orb = body.querySelector("#rOrb");
          if (orb) orb.classList.remove("x570-orb");
        }
        render();
      }, 4000);
    }
    function eye() {
      var steps = [
        "按揉睛明穴（内眼角）8 拍。",
        "按压四白穴（眼眶下方）8 拍。",
        "按揉太阳穴，刮上眼眶 8 拍。",
        "按揉风池穴（后颈）8 拍。",
        "眺望窗外 6 米外的远处 20 秒。",
        "闭眼休息，转动眼球，顺时针、逆时针各 5 圈。"
      ];
      var i = 0;
      function render() {
        body.innerHTML =
          '<div class="x570-card x570-center"><div class="t">👀 护眼放松</div>' +
          '<div style="font-size:18px;margin:16px 0">' + (i + 1) + " / " + steps.length + "：" + esc(steps[i]) + "</div>" +
          '<button class="x570-btn" id="rNext" style="margin-right:10px">' + (i === steps.length - 1 ? "完成" : "下一步") + "</button>" +
          '<button class="x570-btn" id="rStop">退出</button></div>';
        on($("#rNext"), "click", function () {
          if (i >= steps.length - 1) { if (window.G) G.mood = Math.min(100, (G.mood || 0) + 2); H.toast("眼睛放松啦"); home(); }
          else { i++; render(); }
        });
        on($("#rStop"), "click", home);
      }
      render();
    }
    function mind() {
      var left = 60, timer = setInterval(function () {
        left--;
        var t = body.querySelector("#rCount");
        if (t) t.textContent = left + " 秒";
        if (left <= 0) {
          clearInterval(timer);
          if (window.G) G.mood = Math.min(100, (G.mood || 0) + 4);
          body.innerHTML = '<div class="x570-card x570-center"><div class="t">🧘 完成</div><div class="d" style="margin:12px 0">这一分钟，你只属于你自己。</div><button class="x570-btn" id="rDone">返回</button></div>';
          on($("#rDone"), "click", home);
        }
      }, 1000);
      body.innerHTML =
        '<div class="x570-card x570-center"><div class="t">🧘 正念一分钟</div>' +
        '<div class="d" style="margin:14px 0">闭上眼睛，自然地呼吸，把注意力轻轻放在气息进出的感觉上。走神了，就温柔地把注意力带回来。</div>' +
        '<div id="rCount" style="font-size:40px;color:#ffd166">60 秒</div></div>';
    }
    function tips() {
      var t = TIPS[Math.floor(Math.random() * TIPS.length)];
      body.innerHTML =
        '<div class="x570-card x570-center"><div class="t">💡 减压小建议</div>' +
        '<div style="font-size:18px;line-height:1.9;margin:16px 0">' + esc(t) + "</div>" +
        '<button class="x570-btn" id="rAgain" style="margin-right:10px">换一条</button>' +
        '<button class="x570-btn" id="rBack">返回</button></div>';
      on($("#rAgain"), tips);
      on($("#rBack"), home);
    }
    home();
  }

  X570.CampusSub.relax = open;
  X570.Relax = { open: open, TIPS: TIPS };
})();

/* ===== a650_autograph.js ===== */
/* =====================================================================
   同学录：给同学写留言、收集同学签名与寄语，毕业时翻看
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_autograph_v1";

  var SEEDS = [
    { n: "林晚", ic: "🌸", words: "愿你眼里有光，心中有梦，一路向前。", from: "那个总在图书馆靠窗位置的人" },
    { n: "赵小雨", ic: "🎨", words: "谢谢你做我的模特，未来的你一定会很厉害。", from: "总爱把晚霞画下来的人" },
    { n: "苏清颜", ic: "🎹", words: "要好好吃饭、好好睡觉，别总熬夜。", from: "琴房里的那束光" },
    { n: "许念", ic: "🏀", words: "以后球场见，别输给我。", from: "操场边爱出汗的家伙" },
    { n: "班长", ic: "📋", words: "这三年辛苦你了，愿我们都前程似锦。", from: "最爱操心的班长" },
    { n: "同桌", ic: "🍞", words: "记得替我多吃一个肉松面包，毕业快乐！", from: "天天蹭你橡皮的同桌" },
    { n: "学习委员", ic: "📚", words: "你其实很聪明，再坚持一下就好了。", from: "收你作业收了三年的人" },
    { n: "室友", ic: "🛏️", words: "卧谈会的话题我会一直记得，以后也要常联系。", from: "睡你上铺的兄弟" }
  ];

  function load() {
    try {
      var d = JSON.parse(lsGet(KEY, "null"));
      if (d) return d;
    } catch (e) {}
    var d = { received: [], mine: [] };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "📒 同学录");
    var body = el.querySelector(".x570-full-body");
    function home() {
      var html = '<div class="x570-card"><div class="t">同学录</div>' +
        '<div class="d">收集同学的签名与寄语，也可以把你的祝福写给同学。已收到 ' + d.received.length + " 条寄语，你送出 " + d.mine.length + " 条。</div></div>";
      html += '<div class="x570-campus-grid">' +
        '<div class="x570-campus-item" id="agRcv"><div class="ic">📥</div><div class="n">同学寄语</div><div class="d">' + d.received.length + " 条</div></div>" +
        '<div class="x570-campus-item" id="agMine"><div class="ic">📤</div><div class="n">我写的</div><div class="d">' + d.mine.length + " 条</div></div>" +
        '<div class="x570-campus-item" id="agAsk"><div class="ic">✍️</div><div class="n">请同学签名</div><div class="d">随机获得寄语</div></div></div>';
      body.innerHTML = html;
      on($("#agRcv"), received);
      on($("#agMine"), mine);
      on($("#agAsk"), ask);
    }
    function received() {
      var html = '<div class="x570-card"><div class="t">📥 同学写给我的</div></div>';
      if (!d.received.length) html += '<div class="x570-card x570-center"><div class="d">还没有收到寄语，去请同学签名吧。</div></div>';
      else html += d.received.map(function (x) {
        return '<div class="x570-diary"><div class="x570-diary-h">' + x.ic + " " + esc(x.n) + "</div>" +
          '<div class="x570-diary-b">「' + esc(x.words) + "」</div>" +
          '<div class="x570-diary-d">—— ' + esc(x.from) + "</div></div>";
      }).join("");
      html += '<button class="x570-btn" id="agBack" style="width:100%">← 返回</button>';
      body.innerHTML = html;
      on($("#agBack"), home);
    }
    function mine() {
      var html = '<div class="x570-card"><div class="t">📤 我送出的寄语</div></div>';
      if (!d.mine.length) html += '<div class="x570-card x570-center"><div class="d">还没有写给同学的寄语。</div></div>';
      else html += d.mine.map(function (x) {
        return '<div class="x570-diary"><div class="x570-diary-h">写给 ' + x.ic + " " + esc(x.n) + "</div>" +
          '<div class="x570-diary-b">「' + esc(x.words) + "」</div></div>";
      }).join("");
      html += '<button class="x570-btn" id="agBack2" style="width:100%">← 返回</button>';
      body.innerHTML = html;
      on($("#agBack2"), home);
    }
    function ask() {
      var names = SEEDS.map(function (s) { return s.n; });
      var html = '<div class="x570-card"><div class="t">✍️ 请同学签名</div><div class="d">选择一位同学，请 TA 在你的同学录上写点什么。</div></div>';
      html += '<div class="x570-campus-grid">' + SEEDS.map(function (s) {
        var got = d.received.some(function (r) { return r.n === s.n; });
        return '<div class="x570-campus-item" data-n="' + s.n + '"><div class="ic">' + s.ic + "</div><div class='n'>" + esc(s.n) + "</div><div class='d'>" + (got ? "已签名 ✓" : "点我签名") + "</div></div>";
      }).join("") + "</div>";
      html += '<button class="x570-btn" id="agBack3" style="width:100%">← 返回</button>';
      body.innerHTML = html;
      on($("#agBack3"), home);
      on(body, "click", function (e) {
        var it = e.target.closest("[data-n]");
        if (!it) return;
        var n = it.getAttribute("data-n");
        var s = SEEDS.filter(function (x) { return x.n === n; })[0];
        if (d.received.some(function (r) { return r.n === n; })) {
          H.modal("<div><b>" + s.ic + " " + esc(s.n) + "</b><div style='margin-top:8px'>「" + esc(s.words) + "」</div><div class='d' style='margin-top:6px'>—— " + esc(s.from) + "</div></div>");
          return;
        }
        d.received.push({ n: s.n, ic: s.ic, words: s.words, from: s.from });
        if (window.G) { G.social = Math.min(100, (G.social || 0) + 2); G.mood = Math.min(100, (G.mood || 0) + 2); }
        save(d);
        H.modal("<div><b>" + s.ic + " " + esc(s.n) + " 写下了寄语</b><div style='margin-top:8px'>「" + esc(s.words) + "」</div><div class='d' style='margin-top:6px'>—— " + esc(s.from) + "</div></div>");
        ask();
      });
    }
    home();
  }

  X570.CampusSub.autograph = open;
  X570.Autograph = { open: open, SEEDS: SEEDS };
})();

/* ===== a660_exercise.js ===== */
/* =====================================================================
   运动打卡：记录跑步/跳绳/球类，连续打卡，体育成绩加成
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_exercise_v1";

  var TYPES = [
    { id: "run", ic: "🏃", n: "跑步", unit: "公里", per: 10, max: 15, health: 2, mood: 2 },
    { id: "rope", ic: "🪢", n: "跳绳", unit: "个", per: 100, max: 1500, health: 2, mood: 1 },
    { id: "ball", ic: "🏀", n: "球类", unit: "分钟", per: 30, max: 120, health: 2, mood: 3 },
    { id: "sit", ic: "🪑", n: "仰卧起坐", unit: "个", per: 30, max: 100, health: 1, mood: 1 },
    { id: "push", ic: "💪", n: "俯卧撑", unit: "个", per: 20, max: 80, health: 1, mood: 1 },
    { id: "walk", ic: "🚶", n: "快走", unit: "分钟", per: 20, max: 90, health: 1, mood: 1 }
  ];

  function dayStr(d) { return new Date(d).toDateString(); }
  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d) return d; } catch (e) {}
    var d = { days: {}, total: 0, streak: 0, last: "", calories: 0, mins: 0 };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "🏃 运动打卡");
    var body = el.querySelector(".x570-full-body");
    function home() {
      var today = dayStr(Date.now());
      var todayDone = d.days[today] || {};
      var health = window.G ? (G.health || 0) : 0;
      var html = '<div class="x570-card"><div class="t">运动打卡</div>' +
        '<div class="d">连续打卡 <b style="color:#7bc47f">' + d.streak + "</b> 天 · 累计 " + d.total + " 次 · 约 " + d.calories + " 大卡 · " + d.mins + " 分钟</div>" +
        '<div class="d">健康值 ' + health + "</div></div>";
      html += '<div class="x570-list">' + TYPES.map(function (t) {
        var v = todayDone[t.id] || 0;
        return '<div class="x570-ex"><span style="font-size:28px">' + t.ic + "</span>" +
          "<div style='flex:1'><b>" + esc(t.n) + "</b><div class='d'>今天：" + (v ? v + " " + t.unit : "尚未打卡") + " · 建议 " + t.per + "+</div></div>" +
          '<button class="x570-btn" data-ex="' + t.id + '">打卡</button></div>';
      }).join("") + "</div>";
      body.innerHTML = html;
      on(body, "click", function (e) {
        var b = e.target.closest("[data-ex]");
        if (b) log(b.getAttribute("data-ex"));
      });
    }
    function log(id) {
      var t = TYPES.filter(function (x) { return x.id === id; })[0];
      var today = dayStr(Date.now()), yest = dayStr(Date.now() - 86400000);
      var html = '<div class="x570-card"><div class="t">' + t.ic + " " + esc(t.n) + " 打卡</div>" +
        '<div class="d">输入今天的运动量（' + esc(t.unit) + "），建议 " + t.per + " 以上。</div>" +
        '<input id="exVal" type="number" value="' + t.per + '" min="0" max="' + t.max + '" style="width:100%;box-sizing:border-box;padding:12px;font-size:18px;border-radius:10px;border:1px solid #ccc">' +
        '<div style="display:flex;gap:10px;margin-top:12px"><button class="x570-btn" id="exOk" style="flex:1">确认打卡</button>' +
        '<button class="x570-btn" id="exBack" style="flex:1">返回</button></div></div>';
      body.innerHTML = html;
      on($("#exBack"), "click", home);
      on($("#exOk"), "click", function () {
        var v = Math.max(0, Math.min(t.max, parseInt($("#exVal").value, 10) || 0));
        if (!v) return H.toast("请输入运动量");
        if (!d.days[today]) d.days[today] = { _first: true };
        d.days[today][id] = v;
        d.total++;
        if (d.last === yest) d.streak++;
        else if (d.last !== today) d.streak = 1;
        d.last = today;
        var mins = t.id === "run" ? Math.round(v * 6) : t.id === "walk" ? v : t.id === "ball" ? v : Math.round(v / 10);
        d.mins += mins;
        d.calories += Math.round(mins * 7);
        if (window.G) {
          G.health = Math.min(100, (G.health || 0) + t.health);
          G.mood = Math.min(100, (G.mood || 0) + t.mood);
        }
        save(d);
        H.toast("打卡成功！" + t.ic + " " + v + " " + t.unit);
        home();
      });
    }
    home();
  }

  X570.CampusSub.exercise = open;
  X570.Exercise = { open: open, TYPES: TYPES };
})();

/* ===== a690_mistake.js ===== */
/* =====================================================================
   错题本：分科记录错题、正确答案与错因，支持复习与标记掌握
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_mistake_v1";

  var SUBJECTS = ["语文", "数学", "英语", "物理", "化学", "生物", "历史", "地理", "政治", "其他"];
  var REASONS = ["粗心算错", "概念不清", "审题失误", "方法不会", "时间不够", "记混了"];

  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d) return d; } catch (e) {}
    var d = { items: [] };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "❌ 错题本");
    var body = el.querySelector(".x570-full-body");
    var cur = "全部";
    function home() {
      var subs = ["全部"].concat(SUBJECTS);
      var tabs = '<div class="x570-ach-tabs">' + subs.map(function (s) {
        return '<button class="x570-ach-tab ' + (cur === s ? "on" : "") + '" data-s="' + s + '">' + s + "</button>";
      }).join("") + "</div>";
      var list = d.items.filter(function (x) { return cur === "全部" || x.sub === cur; });
      var unsolved = list.filter(function (x) { return !x.ok; }).length;
      var html = tabs + '<div class="x570-card"><div class="t">错题本</div>' +
        '<div class="d">共 ' + list.length + " 道，待复习 " + unsolved + " 道。把错题和错因记下来，考前翻一遍最有用。</div>" +
        '<button class="x570-btn" id="mkAdd" style="width:100%">+ 记录一道错题</button></div>';
      if (!list.length) {
        html += '<div class="x570-card x570-center"><div class="d">这里还没有错题。</div></div>';
      } else {
        html += '<div class="x570-list">' + list.map(function (x) {
          return '<div class="x570-diary" data-i="' + x.id + '"><div class="x570-diary-h">' +
            '<span class="x570-chip">' + esc(x.sub) + "</span> " + (x.ok ? "✅ 已掌握" : "🔴 待复习") +
            ' <span class="x570-chip">' + esc(x.reason) + "</span></div>" +
            '<div class="x570-diary-b">' + esc(x.q) + "</div></div>";
        }).join("") + "</div>";
      }
      body.innerHTML = html;
      on($("#mkAdd"), add);
      on(body, "click", function (e) {
        var t = e.target.closest("[data-s]");
        if (t) { cur = t.getAttribute("data-s"); home(); }
        var it = e.target.closest("[data-i]");
        if (it) detail(+it.getAttribute("data-i"));
      });
    }
    function add() {
      var html = '<div class="x570-card"><div class="t">记录错题</div>' +
        '<div class="d">科目</div><select id="mkSub" style="width:100%;padding:10px;border-radius:10px">' +
        SUBJECTS.map(function (s) { return "<option>" + esc(s) + "</option>"; }).join("") + "</select>" +
        '<div class="d" style="margin-top:10px">题目（简述）</div><textarea id="mkQ" rows="3" style="width:100%;box-sizing:border-box;border-radius:10px;padding:10px" placeholder="把题目或错点写下来"></textarea>' +
        '<div class="d" style="margin-top:8px">正确答案/解法</div><textarea id="mkA" rows="3" style="width:100%;box-sizing:border-box;border-radius:10px;padding:10px" placeholder="正确的思路是什么"></textarea>' +
        '<div class="d" style="margin-top:8px">错因</div><select id="mkR" style="width:100%;padding:10px;border-radius:10px">' +
        REASONS.map(function (r) { return "<option>" + esc(r) + "</option>"; }).join("") + "</select>" +
        '<div style="display:flex;gap:10px;margin-top:14px"><button class="x570-btn" id="mkOk" style="flex:1">保存</button>' +
        '<button class="x570-btn" id="mkBack" style="flex:1">返回</button></div></div>';
      body.innerHTML = html;
      on($("#mkBack"), "click", home);
      on($("#mkOk"), "click", function () {
        var q = $("#mkQ").value.trim(), a = $("#mkA").value.trim();
        if (!q) return H.toast("先把题目写下来");
        d.items.push({
          id: Date.now(), sub: $("#mkSub").value, q: q, a: a || "（待补全）",
          reason: $("#mkR").value, ok: false, date: new Date().toLocaleDateString()
        });
        save(d);
        if (window.G) G.knowledge = Math.min(100, (G.knowledge || 0) + 1);
        H.toast("已记录，记得复习");
        home();
      });
    }
    function detail(id) {
      var x = d.items.filter(function (i) { return i.id === id; })[0];
      if (!x) return home();
      var html = '<div class="x570-card"><div class="t">' +
        '<span class="x570-chip">' + esc(x.sub) + "</span> <span class='x570-chip'>" + esc(x.reason) + "</span></div>" +
        '<div class="d" style="margin-top:8px">题目</div><div style="font-size:16px;line-height:1.8">' + esc(x.q) + "</div>" +
        '<div class="d" style="margin-top:10px">正确答案 / 解法</div><div style="font-size:16px;line-height:1.8;color:#7bc47f">' + esc(x.a) + "</div>" +
        '<div class="d" style="margin-top:8px">记录于 ' + esc(x.date) + "</div>" +
        '<div style="display:flex;gap:10px;margin-top:14px">' +
        '<button class="x570-btn" id="mkOk2" style="flex:1">' + (x.ok ? "标记为待复习" : "我已掌握 ✓") + "</button>" +
        '<button class="x570-btn" id="mkDel" style="flex:1">删除</button></div>' +
        '<button class="x570-btn" id="mkBack2" style="width:100%;margin-top:10px">← 返回</button></div>';
      body.innerHTML = html;
      on($("#mkBack2"), "click", home);
      on($("#mkOk2"), "click", function () {
        x.ok = !x.ok;
        save(d);
        H.toast(x.ok ? "已标记掌握，继续加油" : "已标记为待复习");
        home();
      });
      on($("#mkDel"), "click", function () {
        d.items = d.items.filter(function (i) { return i.id !== id; });
        save(d);
        H.toast("已删除");
        home();
      });
    }
    home();
  }

  X570.CampusSub.mistake = open;
  X570.Mistake = { open: open, SUBJECTS: SUBJECTS, REASONS: REASONS };
})();

/* ===== a700_mood.js ===== */
/* =====================================================================
   心情手账：每天记录情绪、原因与自我对话，形成情绪日历
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_mood_v1";

  var MOODS = [
    { v: 5, ic: "😄", n: "很开心" },
    { v: 4, ic: "🙂", n: "还不错" },
    { v: 3, ic: "😐", n: "平平淡淡" },
    { v: 2, ic: "😕", n: "有点烦" },
    { v: 1, ic: "😢", n: "很难过" }
  ];
  var REASONS = ["考得不错", "和朋友相处愉快", "运动后很舒服", "学到了新知识", "被老师表扬", "考试失利", "和同学闹别扭", "作业太多", "没睡好", "压力很大", "想家", "莫名低落"];

  function dayKey(d) {
    var x = new Date(d);
    return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  }
  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d) return d; } catch (e) {}
    var d = { days: {} };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "🌤️ 心情手账");
    var body = el.querySelector(".x570-full-body");
    function home() {
      var today = dayKey(Date.now());
      var cur = d.days[today];
      var keys = Object.keys(d.days).sort().reverse();
      var avg = keys.length ? Math.round(keys.reduce(function (s, k) { return s + d.days[k].v; }, 0) / keys.length * 10) / 10 : 0;
      var html = '<div class="x570-card"><div class="t">心情手账</div>' +
        '<div class="d">记录情绪，不是为了矫情，而是为了看清自己。已记录 ' + keys.length + " 天，平均心情 " + avg + " / 5。</div></div>";
      html += '<div class="x570-card">' +
        (cur ? '<div class="x570-center"><div style="font-size:50px">' + MOODS[cur.v - 1].ic + "</div><div class='d'>今天的你：" + esc(MOODS[cur.v - 1].n) + "</div>" +
          '<div class="d" style="margin-top:8px">' + esc(cur.note || "（没有写文字）") + "</div>" +
          '<button class="x570-btn" id="mdEdit" style="margin-top:10px">改写今天</button></div>'
          : '<div class="x570-center"><div class="d">今天还没有记录心情。</div><button class="x570-btn" id="mdWrite" style="margin-top:10px">记录今天</button></div>') +
        "</div>";
      if (keys.length) {
        html += '<div class="x570-card"><div class="t">最近的情绪日历</div><div class="x570-mood-cal">' +
          keys.slice(0, 21).map(function (k) {
            var m = d.days[k];
            return '<div class="x570-mood-day" data-k="' + k + '" title="' + esc(MOODS[m.v - 1].n) + '"><span>' + m.ic + "</span><small>" + k.slice(5) + "</small></div>";
          }).join("") + "</div></div>";
      }
      body.innerHTML = html;
      var w = $("#mdWrite") || $("#mdEdit");
      if (w) on(w, "click", write);
      on(body, "click", function (e) {
        var day = e.target.closest("[data-k]");
        if (day) {
          var k = day.getAttribute("data-k"), m = d.days[k];
          H.modal("<div><b>" + m.ic + " " + esc(MOODS[m.v - 1].n) + " · " + k + '</b><div style="margin-top:8px;line-height:1.8">' + esc(m.reason || "") + "</div><div style='margin-top:8px;line-height:1.8'>" + esc(m.note || "") + "</div></div>");
        }
      });
    }
    function write() {
      var today = dayKey(Date.now());
      var old = d.days[today] || { v: 3, reason: "", note: "" };
      var sel = old.v;
      var html = '<div class="x570-card"><div class="t">今天的心情</div>' +
        '<div class="x570-mood-pick">' + MOODS.map(function (m) {
          return '<button class="x570-mood-opt" data-v="' + m.v + '" style="flex:1;padding:12px;border-radius:12px;background:' + (m.v === sel ? "rgba(255,210,120,.25)" : "transparent") + '"><div style="font-size:30px">' + m.ic + "</div><small>" + esc(m.n) + "</small></button>";
        }).join("") + "</div>" +
        '<div class="d" style="margin-top:12px">原因（可多选）</div><div class="x570-ach-tabs">' +
        REASONS.map(function (r) {
          var on = old.reason && old.reason.indexOf(r) >= 0;
          return '<button class="x570-ach-tab mdR ' + (on ? "on" : "") + '" data-r="' + r + '">' + r + "</button>";
        }).join("") + "</div>" +
        '<div class="d" style="margin-top:10px">写几句给自己</div><textarea id="mdNote" rows="4" style="width:100%;box-sizing:border-box;border-radius:10px;padding:10px" placeholder="今天发生了什么？想对自己说什么？">' + esc(old.note || "") + "</textarea>" +
        '<div style="display:flex;gap:10px;margin-top:12px"><button class="x570-btn" id="mdOk" style="flex:1">保存</button>' +
        '<button class="x570-btn" id="mdBack" style="flex:1">返回</button></div></div>';
      body.innerHTML = html;
      var picked = old.reason ? old.reason.split("、") : [];
      on(body, "click", function (e) {
        var v = e.target.closest("[data-v]");
        if (v) {
          sel = +v.getAttribute("data-v");
          write();
        }
        var rr = e.target.closest(".mdR");
        if (rr) {
          var r = rr.getAttribute("data-r");
          if (picked.indexOf(r) >= 0) picked = picked.filter(function (x) { return x !== r; });
          else picked.push(r);
          rr.classList.toggle("on");
        }
      });
      on($("#mdBack"), "click", home);
      on($("#mdOk"), "click", function () {
        d.days[today] = { v: sel, reason: picked.join("、"), note: $("#mdNote").value.trim() };
        save(d);
        if (window.G) {
          G.mood = Math.min(100, Math.max(0, (G.mood || 50) + (sel >= 4 ? 2 : sel <= 2 ? -1 : 0)));
        }
        H.toast("心情已记录");
        home();
      });
    }
    home();
  }

  X570.CampusSub.mood = open;
  X570.Mood = { open: open, MOODS: MOODS };
})();

/* ===== a710_meeting.js ===== */
/* =====================================================================
   主题班会：参加不同主题班会，参与讨论，影响属性与班级评价
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_meeting_v1";

  function applyG(k, v) {
    if (window.G && typeof G[k] === "number") G[k] = Math.max(0, Math.min(100, G[k] + v));
  }

  var MEETINGS = [
    {
      id: "m1", ic: "🎯", t: "新学期目标班会",
      intro: "班主任让每个人写下这学期的目标，并站起来分享。",
      acts: [
        { l: "大胆说出目标", r: "你站起来清晰地说出目标，全班为你鼓掌。", fx: { social: 3, mood: 2, knowledge: 1 } },
        { l: "把目标写在纸条上", r: "你把目标认真折好，放进了铅笔盒。", fx: { knowledge: 2, mood: 1 } },
        { l: "帮同学完善目标", r: "你提醒同桌把目标写得更具体，他很感谢你。", fx: { social: 3, knowledge: 1 } }
      ]
    },
    {
      id: "m2", ic: "🤝", t: "团结与协作",
      intro: "班级进行了一个需要小组配合的小游戏，需要每个人都参与。",
      acts: [
        { l: "当组长协调分工", r: "你让每个人都发挥了长处，小组第一个完成。", fx: { social: 4, mood: 2 } },
        { l: "做最擅长的部分", r: "你专注完成自己的环节，做得又快又好。", fx: { knowledge: 2, mood: 2 } },
        { l: "鼓励落后的同学", r: "你的一句加油，让想放弃的同学重新振作。", fx: { social: 3, mood: 2 } }
      ]
    },
    {
      id: "m3", ic: "📵", t: "手机与自律",
      intro: "大家讨论中学生该如何使用手机，老师让你谈谈看法。",
      acts: [
        { l: "分享自己的时间管理", r: "你说手机是工具不是主人，同学们若有所思。", fx: { knowledge: 2, social: 2 } },
        { l: "坦诚自己也容易分心", r: "你的坦诚引发共鸣，大家一起定了自律约定。", fx: { social: 3, mood: 1 } },
        { l: "认真记录别人的方法", r: "你记下了好几个控制刷手机的办法。", fx: { knowledge: 3 } }
      ]
    },
    {
      id: "m4", ic: "❤️", t: "感恩主题班会",
      intro: "主题是感恩，老师请大家说说最想感谢的人。",
      acts: [
        { l: "感谢父母的付出", r: "你说到一半有点哽咽，教室里安静而温暖。", fx: { mood: 3, social: 2 } },
        { l: "感谢老师和同学", r: "你认真地感谢了身边每一个人。", fx: { social: 3, mood: 2 } },
        { l: "在纸上写感谢信", r: "你写了满满一页，决定回家亲手交给家人。", fx: { mood: 3, knowledge: 1 } }
      ]
    },
    {
      id: "m5", ic: "🛡️", t: "校园安全",
      intro: "安全班会讲到了消防、交通和防溺水知识。",
      acts: [
        { l: "参与消防演练", r: "你熟练地完成了撤离和灭火器操作。", fx: { knowledge: 2, health: 1 } },
        { l: "回答安全知识问答", r: "你答对了好几道题，给小组加分。", fx: { knowledge: 2, social: 1 } },
        { l: "认真记下自救要点", r: "你把关键的求生知识记在了本子上。", fx: { knowledge: 3 } }
      ]
    },
    {
      id: "m6", ic: "🌱", t: "生涯规划",
      intro: "大家聊到未来想成为什么样的人，教室里气氛热烈。",
      acts: [
        { l: "分享自己的理想", r: "你说出了藏在心里的理想，眼睛发亮。", fx: { mood: 3, knowledge: 1, social: 1 } },
        { l: "了解不同职业", r: "你认真听大家介绍，对未来有了新想法。", fx: { knowledge: 3 } },
        { l: "制定阶段小目标", r: "你把大理想拆成了一个个能做到的小目标。", fx: { knowledge: 3, mood: 1 } }
      ]
    }
  ];

  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d) return d; } catch (e) {}
    var d = { done: {} };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "🏫 主题班会");
    var body = el.querySelector(".x570-full-body");
    function home() {
      var cnt = Object.keys(d.done).length;
      var html = '<div class="x570-card"><div class="t">主题班会</div><div class="d">已参加 ' + cnt + " / " + MEETINGS.length + " 场。每次班会都是一次成长。</div></div>";
      html += '<div class="x570-list">' + MEETINGS.map(function (m) {
        var done = d.done[m.id];
        return '<div class="x570-fest" data-id="' + m.id + '"><span style="font-size:30px">' + m.ic + "</span>" +
          "<div><b>" + esc(m.t) + "</b> " + (done ? '<span class="x570-chip">已参加 ✓</span>' : '<span class="x570-chip">未参加</span>') +
          '<div class="d">' + esc(m.intro) + "</div></div></div>";
      }).join("") + "</div>";
      body.innerHTML = html;
      on(body, "click", function (e) {
        var it = e.target.closest("[data-id]");
        if (it) detail(it.getAttribute("data-id"));
      });
    }
    function detail(id) {
      var m = MEETINGS.filter(function (x) { return x.id === id; })[0];
      body.innerHTML =
        '<div class="x570-card"><div class="t">' + m.ic + " " + esc(m.t) + "</div>" +
        '<div class="d" style="margin-top:8px">' + esc(m.intro) + "</div></div>" +
        '<div class="x570-list">' + m.acts.map(function (a, i) {
          return '<button class="x570-btn mact" data-i="' + i + '" style="text-align:left;margin-bottom:8px">' + esc(a.l) + "</button>";
        }).join("") + "</div>" +
        '<button class="x570-btn" id="mBack" style="width:100%">← 返回</button>';
      on($("#mBack"), "click", home);
      on(body, "click", function (e) {
        var b = e.target.closest(".mact");
        if (!b) return;
        var a = m.acts[+b.getAttribute("data-i")];
        Object.keys(a.fx || {}).forEach(function (k) { applyG(k, a.fx[k]); });
        if (!d.done[id]) { d.done[id] = true; save(d); }
        H.modal("<h3 style='margin:0 0 8px'>" + m.ic + " " + esc(m.t) + "</h3><div style='line-height:1.8'>" + esc(a.r) + "</div>");
      });
    }
    home();
  }

  X570.CampusSub.meeting = open;
  X570.Meeting = { open: open, MEETINGS: MEETINGS };
})();

/* ===== a720_wheel.js ===== */
/* =====================================================================
   校园幸运转盘：课间小确幸，随机事件与小奖励，每天限转
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_wheel_v1";

  function dayStr(d) { return new Date(d).toDateString(); }

  var SLOTS = [
    { ic: "🧋", t: "免费奶茶券", r: "捡到一张“凭想象兑换”的奶茶券，心情好了一点。", mood: 3, money: 0 },
    { ic: "🍀", t: "小幸运", r: "今天的你会有一件小确幸，留意身边。", mood: 2, money: 0 },
    { ic: "🪙", t: "零花钱 +5", r: "路上捡到五块钱，上交后老师奖励了你，你又不好意思要……还是收下了。", mood: 1, money: 5 },
    { ic: "📚", t: "知识 +2", r: "转盘说今天适合看书，你认真学了一会儿。", mood: 0, knowledge: 2 },
    { ic: "🏃", t: "活力满满", r: "你突然觉得浑身有劲，去操场跑了两圈。", mood: 2, health: 2 },
    { ic: "💬", t: "人缘 +1", r: "今天多和同学说说话，会有惊喜。", mood: 1, social: 2 },
    { ic: "🌧️", t: "记得带伞", r: "转盘提示今天可能有雨，记得带伞。", mood: 0 },
    { ic: "⭐", t: "好运加倍", r: "稀有！今天你做什么都顺。", mood: 4, money: 3 }
  ];

  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d) return d; } catch (e) {}
    var d = { last: "", spins: 0, history: [] };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }
  function applyG(k, v) { if (window.G && v && typeof G[k] === "number") G[k] = Math.max(0, Math.min(100, G[k] + v)); }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "🎡 幸运转盘");
    var body = el.querySelector(".x570-full-body");
    function render() {
      var today = dayStr(Date.now());
      var can = d.last !== today;
      var deg = 0;
      var html = '<div class="x570-card x570-center"><div class="t">校园幸运转盘</div>' +
        '<div class="d">每天课间可转一次，收获一份小确幸。累计转动 ' + d.spins + " 次。</div>" +
        '<div id="wheel" class="x570-wheel">' +
        SLOTS.map(function (s, i) {
          return '<div class="x570-wheel-slot" style="transform:rotate(' + (i * 45) + 'deg) translateY(-96px)">' + s.ic + "</div>";
        }).join("") +
        '<div class="x570-wheel-hub">🎁</div></div>' +
        (can ? '<button class="x570-btn" id="wSpin" style="margin-top:16px;font-size:18px;padding:12px 30px">转动转盘</button>'
          : '<div class="d" style="margin-top:14px">今天已经转过啦，明天再来！</div>') +
        "</div>";
      if (d.history.length) {
        html += '<div class="x570-card"><div class="t">最近的运气</div>' +
          d.history.slice(-6).reverse().map(function (h) {
            return '<div class="x570-diary"><div class="x570-diary-b">' + h.ic + " " + esc(h.t) + " —— " + esc(h.r) + "</div></div>";
          }).join("") + "</div>";
      }
      body.innerHTML = html;
      var spinBtn = $("#wSpin");
      if (spinBtn) on(spinBtn, "click", spin);
    }
    function spin() {
      var idx = Math.floor(Math.random() * SLOTS.length);
      var s = SLOTS[idx];
      var wheel = $("#wheel");
      var turns = 5 * 360 + (360 - idx * 45);
      wheel.style.transition = "transform 3.2s cubic-bezier(.17,.67,.2,1)";
      wheel.style.transform = "rotate(" + turns + "deg)";
      var btn = $("#wSpin");
      if (btn) btn.style.display = "none";
      setTimeout(function () {
        d.last = dayStr(Date.now());
        d.spins++;
        d.history.push({ ic: s.ic, t: s.t, r: s.r });
        if (d.history.length > 30) d.history.shift();
        applyG("mood", s.mood);
        applyG("health", s.health);
        applyG("knowledge", s.knowledge);
        applyG("social", s.social);
        if (s.money && window.G) G.money = (typeof G.money === "number" ? G.money : 0) + s.money;
        save(d);
        H.modal("<h3 style='margin:0 0 8px'>" + s.ic + " " + esc(s.t) + "</h3><div style='line-height:1.8'>" + esc(s.r) + "</div>");
        render();
      }, 3300);
    }
    render();
  }

  X570.CampusSub.wheel = open;
  X570.Wheel = { open: open, SLOTS: SLOTS };
})();

/* ===== a730_broadcast.js ===== */
/* =====================================================================
   校园广播投稿：写点歌祝福、校园来稿，被“采纳”后获得心情与社交
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_broadcast_v1";

  var SONG_POOL = [
    { song: "《晴天》", by: "周杰伦" },
    { song: "《起风了》", by: "买辣椒也用券" },
    { song: "《海阔天空》", by: "Beyond" },
    { song: "《稻香》", by: "周杰伦" },
    { song: "《夜空中最亮的星》", by: "逃跑计划" },
    { song: "《少年》", by: "梦然" },
    { song: "《孤勇者》", by: "陈奕迅" },
    { song: "《那些年》", by: "胡夏" },
    { song: "《追光者》", by: "岑宁儿" },
    { song: "《后来》", by: "刘若英" }
  ];
  var TEMPLATES = {
    cheer: "想为正在努力的高三学长学姐点一首{song}，愿你们合上笔盖的那一刻，有侠客收剑入鞘的骄傲。",
    friend: "把{song}送给我的好朋友，谢谢你一直陪在我身边，未来的路我们也要一起走。",
    birthday: "今天是{who}的生日，想点一首{song}，祝你生日快乐，所求皆如愿。",
    self: "想给努力的自己点一首{song}，告诉自己，再坚持一下，光就在前面。",
    thanks: "想把{song}送给所有老师，谢谢你们的付出，你们辛苦了。"
  };

  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d) return d; } catch (e) {}
    var d = { posts: [], accepted: 0, total: 0 };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "📻 广播投稿");
    var body = el.querySelector(".x570-full-body");
    function home() {
      var html = '<div class="x570-card"><div class="t">校园广播台</div>' +
        '<div class="d">投稿点歌或写校园来稿，审核通过后会在午休时段播出。已投稿 ' + d.total + " 篇，被采纳 " + d.accepted + " 篇。</div>" +
        '<button class="x570-btn" id="bcSong" style="width:100%;margin-top:8px">🎵 点歌送祝福</button>' +
        '<button class="x570-btn" id="bcDraft" style="width:100%;margin-top:8px">📝 写校园来稿</button></div>';
      if (d.posts.length) {
        html += '<div class="x570-card"><div class="t">我的投稿</div>' +
          d.posts.slice().reverse().map(function (p) {
            return '<div class="x570-diary"><div class="x570-diary-h">' +
              (p.type === "song" ? "🎵 点歌" : "📝 来稿") + " " +
              (p.ok ? '<span class="x570-chip">已采纳 ✓</span>' : '<span class="x570-chip">审核中</span>') +
              "</div><div class='x570-diary-b'>" + esc(p.content) + "</div></div>";
          }).join("") + "</div>";
      }
      body.innerHTML = html;
      on($("#bcSong"), song);
      on($("#bcDraft"), draft);
    }
    function song() {
      var type = "cheer", who = "", song = SONG_POOL[0];
      function render() {
        var types = [["cheer", "为学长加油"], ["friend", "送给朋友"], ["birthday", "生日祝福"], ["self", "给自己"], ["thanks", "感谢老师"]];
        var html = '<div class="x570-card"><div class="t">🎵 点歌送祝福</div>' +
          '<div class="d">祝福类型</div><div class="x570-ach-tabs">' +
          types.map(function (t) {
            return '<button class="x570-ach-tab bcT ' + (type === t[0] ? "on" : "") + '" data-t="' + t[0] + '">' + t[1] + "</button>";
          }).join("") + "</div>";
        if (type === "birthday") html += '<div class="d" style="margin-top:10px">送给谁（名字/称呼）</div><input id="bcWho" value="' + esc(who) + '" style="width:100%;box-sizing:border-box;padding:10px;border-radius:10px" placeholder="如：林晚">';
        html += '<div class="d" style="margin-top:10px">选择歌曲</div><select id="bcSongSel" style="width:100%;padding:10px;border-radius:10px">' +
          SONG_POOL.map(function (s, i) { return "<option value='" + i + "' " + (SONG_POOL[i].song === song.song ? "selected" : "") + ">" + s.song + " — " + s.by + "</option>"; }).join("") +
          "</select>";
        var text = TEMPLATES[type].replace("{song}", song.song).replace("{who}", who || "那位同学");
        html += '<div class="d" style="margin-top:10px">投稿内容（可编辑）</div><textarea id="bcText" rows="4" style="width:100%;box-sizing:border-box;border-radius:10px;padding:10px">' + esc(text) + "</textarea>" +
          '<div style="display:flex;gap:10px;margin-top:12px"><button class="x570-btn" id="bcOk" style="flex:1">提交投稿</button>' +
          '<button class="x570-btn" id="bcBack" style="flex:1">返回</button></div></div>';
        body.innerHTML = html;
        on(body, "click", function (e) {
          var t = e.target.closest(".bcT");
          if (t) { type = t.getAttribute("data-t"); render(); }
        });
        on($("#bcBack"), "click", home);
        var whoEl = $("#bcWho");
        if (whoEl) on(whoEl, "input", function () { who = whoEl.value; $("#bcText").value = TEMPLATES[type].replace("{song}", song.song).replace("{who}", who || "那位同学"); });
        on($("#bcSongSel"), "change", function () {
          song = SONG_POOL[+$("#bcSongSel").value];
          $("#bcText").value = TEMPLATES[type].replace("{song}", song.song).replace("{who}", ($("#bcWho") && $("#bcWho").value) || "那位同学");
        });
        on($("#bcOk"), "click", function () {
          var content = $("#bcText").value.trim();
          if (!content) return H.toast("写点内容吧");
          submit("song", content);
        });
      }
      render();
    }
    function draft() {
      var html = '<div class="x570-card"><div class="t">📝 校园来稿</div>' +
        '<div class="d">写一写校园里的风景、故事或感悟，积极向上的稿件更容易被采纳。</div>' +
        '<input id="bcTitle" placeholder="标题" style="width:100%;box-sizing:border-box;padding:10px;border-radius:10px;margin-bottom:8px">' +
        '<textarea id="bcBody" rows="7" style="width:100%;box-sizing:border-box;border-radius:10px;padding:10px" placeholder="在这里写下你的来稿……"></textarea>' +
        '<div style="display:flex;gap:10px;margin-top:12px"><button class="x570-btn" id="bcOk2" style="flex:1">提交投稿</button>' +
        '<button class="x570-btn" id="bcBack2" style="flex:1">返回</button></div></div>';
      body.innerHTML = html;
      on($("#bcBack2"), "click", home);
      on($("#bcOk2"), "click", function () {
        var title = $("#bcTitle").value.trim(), bodyText = $("#bcBody").value.trim();
        if (!title || bodyText.length < 10) return H.toast("标题和正文（10 字以上）都要写");
        submit("draft", "【" + title + "】" + bodyText);
      });
    }
    function submit(type, content) {
      var ok = Math.random() < 0.7 || content.length > 40;
      d.total++;
      if (ok) {
        d.accepted++;
        if (window.G) {
          G.mood = Math.min(100, (G.mood || 0) + 4);
          G.social = Math.min(100, (G.social || 0) + 2);
          G.knowledge = Math.min(100, (G.knowledge || 0) + 1);
        }
      }
      d.posts.push({ type: type, content: content, ok: ok, date: new Date().toLocaleDateString() });
      if (d.posts.length > 40) d.posts.shift();
      save(d);
      if (ok) H.toast("恭喜！你的投稿被采纳，将在中午播出 🎉");
      else H.toast("投稿已提交，这次还差一点，继续加油");
      home();
    }
  }

  X570.CampusSub.broadcast = open;
  X570.Broadcast = { open: open, SONG_POOL: SONG_POOL };
})();

/* ===== a740_classfund.js ===== */
/* =====================================================================
   班级账本：记录班费收入与支出，公开透明，支持活动预算
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_classfund_v1";

  var INCOME = ["收班费", "活动结余", "爱心义卖", "奖金", "其他收入"];
  var EXPENSE = ["购买文具", "布置教室", "运动会用品", "节日活动", "打印复印", "清洁工具", "班刊制作", "其他支出"];

  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d) return d; } catch (e) {}
    var d = { logs: [], init: 0 };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }
  function balance(d) {
    return d.logs.reduce(function (s, x) { return s + (x.type === "in" ? x.amount : -x.amount); }, 0);
  }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "💰 班级账本");
    var body = el.querySelector(".x570-full-body");
    function home() {
      var bal = balance(d);
      var income = d.logs.filter(function (x) { return x.type === "in"; }).reduce(function (s, x) { return s + x.amount; }, 0);
      var expense = d.logs.filter(function (x) { return x.type === "out"; }).reduce(function (s, x) { return s + x.amount; }, 0);
      var html = '<div class="x570-card"><div class="t">班级账本</div>' +
        '<div class="x570-stat-grid">' +
        '<div class="x570-stat"><div class="n">当前结余</div><div class="v">🪙' + bal + "</div></div>" +
        '<div class="x570-stat"><div class="n">累计收入</div><div class="v" style="color:#7bc47f">' + income + "</div></div>" +
        '<div class="x570-stat"><div class="n">累计支出</div><div class="v" style="color:#ef6f6c">' + expense + "</div></div></div>" +
        '<div style="display:flex;gap:10px;margin-top:10px"><button class="x570-btn" id="cfIn" style="flex:1">+ 收入</button>' +
        '<button class="x570-btn" id="cfOut" style="flex:1">− 支出</button></div></div>';
      if (!d.logs.length) {
        html += '<div class="x570-card x570-center"><div class="d">还没有账目，记一笔吧。</div></div>';
      } else {
        html += '<div class="x570-card"><div class="t">账目明细（最近 20 条）</div>' +
          d.logs.slice().reverse().slice(0, 20).map(function (x, i) {
            var real = d.logs[d.logs.length - 1 - i];
            return '<div class="x570-diary"><div class="x570-diary-b">' +
              (x.type === "in" ? '<span style="color:#7bc47f">+🪙' + x.amount + "</span>" : '<span style="color:#ef6f6c">−🪙' + x.amount + "</span>") +
              " " + esc(x.cat) + (x.note ? " · " + esc(x.note) : "") +
              ' <span class="x570-chip">' + esc(x.date) + "</span></div></div>";
          }).join("") + "</div>";
      }
      body.innerHTML = html;
      on($("#cfIn"), "click", function () { form("in"); });
      on($("#cfOut"), "click", function () { form("out"); });
    }
    function form(type) {
      var cats = type === "in" ? INCOME : EXPENSE;
      var cat = cats[0];
      var html = '<div class="x570-card"><div class="t">' + (type === "in" ? "登记收入" : "登记支出") + "</div>" +
        '<div class="d">类别</div><div class="x570-ach-tabs">' + cats.map(function (c) {
          return '<button class="x570-ach-tab cfC ' + (cat === c ? "on" : "") + '" data-c="' + c + '">' + c + "</button>";
        }).join("") + "</div>" +
        '<div class="d" style="margin-top:10px">金额（🪙）</div>' +
        '<input id="cfAmt" type="number" value="5" min="1" style="width:100%;box-sizing:border-box;padding:10px;border-radius:10px">' +
        '<div class="d" style="margin-top:8px">备注（可选）</div>' +
        '<input id="cfNote" style="width:100%;box-sizing:border-box;padding:10px;border-radius:10px" placeholder="如：买了 30 张彩纸">' +
        '<div style="display:flex;gap:10px;margin-top:12px"><button class="x570-btn" id="cfOk" style="flex:1">保存</button>' +
        '<button class="x570-btn" id="cfBack" style="flex:1">返回</button></div></div>';
      body.innerHTML = html;
      on(body, "click", function (e) {
        var c = e.target.closest(".cfC");
        if (c) {
          cat = c.getAttribute("data-c");
          body.querySelectorAll(".cfC").forEach(function (b) { b.classList.toggle("on", b === c); });
        }
      });
      on($("#cfBack"), "click", home);
      on($("#cfOk"), "click", function () {
        var amt = parseInt($("#cfAmt").value, 10);
        if (!amt || amt <= 0) return H.toast("请输入正确的金额");
        if (type === "out" && amt > balance(d)) {
          if (!confirm("支出超过当前结余，确定要登记吗？")) return;
        }
        d.logs.push({
          type: type, cat: cat, amount: amt,
          note: $("#cfNote").value.trim(),
          date: new Date().toLocaleDateString()
        });
        if (d.logs.length > 100) d.logs.shift();
        save(d);
        H.toast("已登记 " + (type === "in" ? "收入" : "支出") + " 🪙" + amt);
        home();
      });
    }
    home();
  }

  X570.CampusSub.classfund = open;
  X570.ClassFund = { open: open, balance: function () { return balance(load()); } };
})();

/* ===== a750_roulette.js ===== */
/* =====================================================================
   课堂随机工具：随机点名、抽签分组、随机座位、今天谁值日
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_roster_v1";

  var DEFAULT_NAMES = ["林晚", "赵小雨", "苏清颜", "许念", "陈默", "王一诺", "张子涵", "李思源", "周雨桐", "吴宇航", "郑好", "孙悦", "马晓东", "朱子航", "胡欣然", "郭天宇", "何嘉怡", "高翔", "罗梦琪", "梁博文"];

  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d && d.names) return d; } catch (e) {}
    var d = { names: DEFAULT_NAMES.slice() };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }
  function shuffle(a) {
    var b = a.slice();
    for (var i = b.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = b[i]; b[i] = b[j]; b[j] = t;
    }
    return b;
  }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "🎲 课堂随机工具");
    var body = el.querySelector(".x570-full-body");
    function home() {
      var html = '<div class="x570-card"><div class="t">课堂随机工具</div>' +
        '<div class="d">共 ' + d.names.length + " 名同学。随机点名、分组、排座位都在这里。</div></div>";
      html += '<div class="x570-campus-grid">' +
        '<div class="x570-campus-item" id="rName"><div class="ic">🙋</div><div class="n">随机点名</div><div class="d">回答问题</div></div>' +
        '<div class="x570-campus-item" id="rGroup"><div class="ic">👥</div><div class="n">随机分组</div><div class="d">小组合作</div></div>' +
        '<div class="x570-campus-item" id="rSeat"><div class="ic">🪑</div><div class="n">随机座位</div><div class="d">换座位</div></div>' +
        '<div class="x570-campus-item" id="rDuty"><div class="ic">🧹</div><div class="n">值日抽签</div><div class="d">今天谁值日</div></div>' +
        '<div class="x570-campus-item" id="rOrder"><div class="ic">🔢</div><div class="n">随机顺序</div><div class="d">发言/上台</div></div>' +
        '<div class="x570-campus-item" id="rEdit"><div class="ic">✏️</div><div class="n">编辑名单</div><div class="d">' + d.names.length + " 人</div></div></div>";
      body.innerHTML = html;
      on($("#rName"), pickName);
      on($("#rGroup"), group);
      on($("#rSeat"), seat);
      on($("#rDuty"), duty);
      on($("#rOrder"), order);
      on($("#rEdit"), edit);
    }
    function bar(title, inner, back) {
      body.innerHTML = '<div class="x570-card x570-center"><div class="t">' + title + "</div>" + inner + '</div><button class="x570-btn" id="rBack" style="width:100%;margin-top:10px">← 返回</button>';
      on($("#rBack"), "click", home);
    }
    function pickName() {
      var cur = null, timer = null;
      function show() {
        bar("🙋 随机点名",
          '<div id="rOut" style="font-size:42px;font-weight:900;margin:18px 0;color:#ffd166">?</div>' +
          '<button class="x570-btn" id="rGo" style="width:100%;font-size:18px;padding:14px">开始点名</button>');
        on($("#rGo"), "click", function () {
          var btn = $("#rGo");
          if (timer) {
            clearInterval(timer); timer = null;
            btn.textContent = "再点一次";
            return;
          }
          btn.textContent = "停止";
          timer = setInterval(function () {
            cur = d.names[Math.floor(Math.random() * d.names.length)];
            $("#rOut").textContent = cur;
          }, 70);
        });
      }
      show();
    }
    function group() {
      var n = 4;
      function render() {
        var arr = shuffle(d.names);
        var groups = [];
        for (var i = 0; i < arr.length; i += n) groups.push(arr.slice(i, i + n));
        var html = '<div class="d">每组 ' + n + " 人，共 " + groups.length + " 组（点击可调整人数）</div>";
        html += '<div style="display:flex;gap:8px;margin:10px 0">' + [2, 3, 4, 5, 6].map(function (x) {
          return '<button class="x570-btn rN ' + (x === n ? "green" : "") + '" data-n="' + x + '" style="flex:1">' + x + "人</button>";
        }).join("") + "</div>";
        html += groups.map(function (g, i) {
          return '<div class="x570-diary"><div class="x570-diary-h">第 ' + (i + 1) + " 组</div><div class='x570-diary-b'>" + g.map(esc).join("、") + "</div></div>";
        }).join("");
        html += '<button class="x570-btn" id="rRe" style="width:100%;margin-top:8px">重新分组</button>';
        bar("👥 随机分组", html);
        on(body, "click", function (e) {
          var b = e.target.closest(".rN");
          if (b) { n = +b.getAttribute("data-n"); render(); }
          if (e.target.closest("#rRe")) render();
        });
      }
      render();
    }
    function seat() {
      var arr = shuffle(d.names);
      var cols = 5;
      var html = '<div class="d">已随机生成座位表（每行 ' + cols + " 人，讲台在上方）：</div>";
      html += '<div style="display:grid;grid-template-columns:repeat(' + cols + ',1fr);gap:6px;margin:14px 0">' +
        arr.map(function (name) {
          return '<div style="border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:10px 4px;text-align:center;background:rgba(255,255,255,.06);font-size:13px">' + esc(name) + "</div>";
        }).join("") + "</div>";
      html += '<button class="x570-btn" id="rRe2" style="width:100%">重新排座位</button>';
      bar("🪑 随机座位", html);
      on($("#rRe2"), "click", seat);
    }
    function duty() {
      var arr = shuffle(d.names);
      var n = Math.min(6, arr.length);
      var picked = arr.slice(0, n);
      var jobs = ["扫地", "拖地", "擦黑板", "倒垃圾", "摆桌椅", "关窗关灯"];
      var html = '<div class="d">今天的值日安排：</div>' +
        picked.map(function (name, i) {
          return '<div class="x570-task"><span class="x570-check">✓</span><span class="x570-task-t">' + esc(name) + " — " + jobs[i] + "</span></div>";
        }).join("") +
        '<button class="x570-btn" id="rRe3" style="width:100%;margin-top:10px">重新抽签</button>';
      bar("🧹 值日抽签", html);
      on($("#rRe3"), "click", duty);
    }
    function order() {
      var arr = shuffle(d.names);
      var html = '<div class="d">随机发言/上台顺序：</div>' +
        arr.map(function (name, i) {
          return '<div class="x570-task"><span class="x570-check" style="color:#ffd166">' + (i + 1) + "</span><span class='x570-task-t'>" + esc(name) + "</span></div>";
        }).join("") +
        '<button class="x570-btn" id="rRe4" style="width:100%;margin-top:10px">重新洗牌</button>';
      bar("🔢 随机顺序", html);
      on($("#rRe4"), "click", order);
    }
    function edit() {
      var html = '<div class="d">每行一个名字，可自由增删。</div>' +
        '<textarea id="rNames" rows="12" style="width:100%;box-sizing:border-box;border-radius:10px;padding:10px;margin:10px 0">' +
        d.names.map(esc).join("\n") + "</textarea>" +
        '<div style="display:flex;gap:10px"><button class="x570-btn" id="rSave" style="flex:1">保存名单</button>' +
        '<button class="x570-btn" id="rReset" style="flex:1">恢复默认</button></div>';
      bar("✏️ 编辑名单", html);
      on($("#rSave"), "click", function () {
        var names = $("#rNames").value.split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
        if (!names.length) return H.toast("名单不能为空");
        d.names = names;
        save(d);
        H.toast("已保存 " + names.length + " 名同学");
        home();
      });
      on($("#rReset"), "click", function () {
        d.names = DEFAULT_NAMES.slice();
        save(d);
        H.toast("已恢复默认名单");
        home();
      });
    }
    home();
  }

  X570.CampusSub.roulette = open;
  X570.Roulette = { open: open, shuffle: shuffle };
})();

/* ===== a760_studyroom.js ===== */
/* =====================================================================
   自习室预约：选时间段、选座位，记录学习时长，专注加成
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_studyroom_v1";

  var SLOTS = [
    { id: "s1", t: "早自习前", time: "06:50 - 07:20", cap: 20 },
    { id: "s2", t: "午休", time: "12:40 - 13:30", cap: 30 },
    { id: "s3", t: "下午放学后", time: "17:00 - 18:00", cap: 30 },
    { id: "s4", t: "晚自习一", time: "18:30 - 19:40", cap: 40 },
    { id: "s5", t: "晚自习二", time: "19:50 - 21:00", cap: 40 },
    { id: "s6", t: "周末上午", time: "09:00 - 11:30", cap: 25 },
    { id: "s7", t: "周末下午", time: "14:00 - 16:30", cap: 25 }
  ];
  var TIPS = [
    "把最难的科目放在精力最好的时段。",
    "番茄钟：专注 25 分钟，休息 5 分钟。",
    "自习先列清单，结束时打勾，会很有成就感。",
    "手机放在包里，而不是桌面上。",
    "自习结束前留 5 分钟，复盘今天学了什么。",
    "和同学一起自习，互相监督，效率更高。",
    "状态差时先做最简单的任务，进入状态再啃硬骨头。"
  ];

  function dayKey() { return new Date().toDateString(); }
  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d) return d; } catch (e) {}
    var d = { today: {}, totalMin: 0, count: 0, days: {} };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }

  function open() {
    var d = load();
    var tk = dayKey();
    if (!d.days[tk]) d.days[tk] = {};
    var el = H.openFull("x570Sub", "📖 自习室预约");
    var body = el.querySelector(".x570-full-body");
    var todayMin = Object.keys(d.days[tk]).reduce(function (s, k) { return s + (d.days[tk][k] || 0); }, 0);
    function home() {
      var html = '<div class="x570-card"><div class="t">自习室预约</div>' +
        '<div class="d">今日已自习 <b style="color:#ffd166">' + todayMin + "</b> 分钟 · 累计 " + d.totalMin + " 分钟 / " + d.count + " 次。</div>" +
        '<div class="d">💡 ' + TIPS[new Date().getDay() % TIPS.length] + "</div></div>";
      html += '<div class="x570-list">' + SLOTS.map(function (s) {
        var booked = d.days[tk][s.id] || 0;
        var used = Math.min(s.cap, booked);
        var pct = Math.round(used / s.cap * 100);
        return '<div class="x570-food" data-slot="' + s.id + '"><div style="flex:1"><b>' + esc(s.t) + "</b> <span class='x570-chip'>" + esc(s.time) + "</span>" +
          (booked ? '<div class="d">✅ 已预约 · 学习 ' + booked + " 分钟</div>" : '<div class="d">空位 ' + (s.cap - used) + " / " + s.cap + "</div>") +
          '<div class="x570-bar blue"><div class="x570-bar-i" style="width:' + pct + '%"></div></div></div>' +
          '<button class="x570-btn">' + (booked ? "续学" : "预约") + "</button></div>";
      }).join("") + "</div>";
      body.innerHTML = html;
      on(body, "click", function (e) {
        var it = e.target.closest("[data-slot]");
        if (it) book(it.getAttribute("data-slot"));
      });
    }
    function book(id) {
      var s = SLOTS.filter(function (x) { return x.id === id; })[0];
      var mins = [25, 50, 75, 90];
      var html = '<div class="x570-card"><div class="t">预约 ' + esc(s.t) + "</div>" +
        '<div class="d">' + esc(s.time) + "，选择今天这一时间段要学习的时长。</div>" +
        '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:12px">' +
        mins.map(function (m) {
          return '<button class="x570-btn sMin" data-m="' + m + '" style="padding:16px">' + m + " 分钟</button>";
        }).join("") + "</div>" +
        '<button class="x570-btn" id="sBack" style="width:100%;margin-top:12px">返回</button></div>';
      body.innerHTML = html;
      on($("#sBack"), "click", home);
      on(body, "click", function (e) {
        var b = e.target.closest(".sMin");
        if (!b) return;
        var m = +b.getAttribute("data-m");
        d.days[tk][id] = (d.days[tk][id] || 0) + m;
        d.totalMin += m;
        d.count++;
        var gain = Math.round(m / 25);
        if (window.G) {
          G.knowledge = Math.min(100, (G.knowledge || 0) + gain);
          G.mood = Math.min(100, (G.mood || 0) + 1);
        }
        save(d);
        H.toast("预约成功！专注学习 " + m + " 分钟，知识 +" + gain);
        home();
      });
    }
    home();
  }

  X570.CampusSub.studyroom = open;
  X570.StudyRoom = { open: open, SLOTS: SLOTS };
})();

/* ===== a770_quotes.js ===== */
/* =====================================================================
   老师箴言 + 每日一句：分科学习语录，每日随机展示，可收藏
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_quote_fav_v1";

  var QUOTES = {
    "关于努力": [
      "你现在的努力，是在为以后的自己铺路。",
      "努力不一定立刻有结果，但不努力一定没有。",
      "把每天简单的事做好，就是不简单。",
      "别怕慢，就怕站；别想赢，就别认输。",
      "你背不下来的书，总有人能背下来；你想去的学校，也只能别人去。",
      "现在偷的懒，都是将来打脸的巴掌。",
      "星光不问赶路人，时光不负有心人。",
      "所谓的奇迹，不过是努力的另一个名字。",
      "你只管努力，剩下的交给时间。",
      "真正的坚持，是在坚持不下去的时候继续坚持。"
    ],
    "关于考试": [
      "考场上的从容，来自平时的准备。",
      "把平时的练习当考试，把考试当平时的练习。",
      "会做的题不丢分，就是最大的胜利。",
      "不要因为一道题，丢掉整场考试。",
      "先易后难，先把能拿的分拿到手。",
      "审题慢一点，计算稳一点，书写清楚一点。",
      "错题不是耻辱，是你最好的提分清单。",
      "分数会波动，但知识不会骗人。",
      "考前不熬夜，状态比临时抱佛脚重要。",
      "考完一科放下一科，不要对答案影响下一场。"
    ],
    "关于心态": [
      "焦虑是因为想同时做很多事，却又不立刻去做。",
      "你不需要和别人比，只需要比昨天的自己好一点。",
      "允许自己暂时不会，学习本来就是从不会到会。",
      "压力大时，先把眼前最小的一件事做完。",
      "失败是一道题，不是一个结局。",
      "你可以哭，但哭完记得把题目接着写完。",
      "迷茫的时候，就把脚下的路走实。",
      "别让一次成绩，定义你是个什么样的人。",
      "认真生活的人，运气都不会太差。",
      "心之所向，素履以往，哪怕一个人也要像一支队伍。"
    ],
    "关于方法": [
      "好记性不如烂笔头，多写多画记得牢。",
      "知识要织成网，而不是散成点。",
      "学会总结，比盲目刷题更重要。",
      "先理解再记忆，先框架再细节。",
      "复述是最好的学习：能讲给别人听，才算真懂。",
      "用整块时间攻难题，用碎片时间背单词。",
      "错题要重做，而不是只看一遍。",
      "找到自己的黄金时段，把最难的事安排在那里。",
      "列清单、做计划，能减少一半的慌乱。",
      "学习是一场马拉松，节奏比一时的冲刺更重要。"
    ],
    "关于成长": [
      "高中这三年，会成为你后来最怀念的时光。",
      "一起熬过的夜、一起跑过的步，都会变成回忆。",
      "珍惜身边陪你一起努力的人。",
      "对老师多一点理解，他们比你想象的更希望你好。",
      "学会对父母说一句谢谢，他们也在陪你辛苦。",
      "保持热爱，哪怕只是一个很小的爱好。",
      "锻炼身体，它是你所有梦想的本钱。",
      "做一个善良、诚实、有责任感的人。",
      "你的善良和努力，终会被这个世界温柔以待。",
      "愿你走出半生，归来仍是少年。"
    ],
    "学科老师寄语": [
      "数学老师：解题如做人，一步一个脚印，马虎不得。",
      "语文老师：多读书，读好书，文字会给你一个更辽阔的世界。",
      "英语老师：每天十个单词，三年就是一座山。",
      "物理老师：万物皆有理，遇到现象多问一个为什么。",
      "化学老师：变化里藏着规律，实验里见真章。",
      "生物老师：认识自己，从认识一个细胞开始。",
      "历史老师：读史使人明智，你现在的每一步，都在创造历史。",
      "地理老师：把世界装进心里，走到哪里都不会迷路。",
      "政治老师：理性看待世界，做有思辨力的公民。",
      "体育老师：身体是革命的本钱，动起来，别总坐着。"
    ]
  };

  function loadFav() {
    try { return JSON.parse(lsGet(KEY, "[]")) || []; } catch (e) { return []; }
  }
  function saveFav(a) { try { lsSet(KEY, JSON.stringify(a)); } catch (e) {} }

  function open() {
    var el = H.openFull("x570Sub", "💬 老师箴言");
    var body = el.querySelector(".x570-full-body");
    var cats = Object.keys(QUOTES);
    var cur = "每日一句";
    var fav = loadFav();
    function all() {
      var arr = [];
      cats.forEach(function (c) { QUOTES[c].forEach(function (q) { arr.push({ c: c, q: q }); }); });
      return arr;
    }
    function home() {
      var pool = all();
      var today = pool[new Date().getDate() % pool.length];
      var tabs = ["每日一句", "我的收藏"].concat(cats);
      var html = '<div class="x570-ach-tabs">' + tabs.map(function (t) {
        return '<button class="x570-ach-tab ' + (cur === t ? "on" : "") + '" data-t="' + t + '">' + t + "</button>";
      }).join("") + "</div>";
      if (cur === "每日一句") {
        html += '<div class="x570-card x570-center" style="padding:28px 20px">' +
          '<div style="font-size:44px">📜</div>' +
          '<div style="font-size:18px;line-height:2;margin:16px 0">「' + esc(today.q) + "」</div>" +
          '<div class="d">—— ' + esc(today.c) + "</div>" +
          '<div style="display:flex;gap:10px;margin-top:16px;justify-content:center;flex-wrap:wrap">' +
          '<button class="x570-btn" id="qRandom">换一句</button>' +
          '<button class="x570-btn green" id="qFav">收藏</button></div></div>';
      } else if (cur === "我的收藏") {
        if (!fav.length) html += '<div class="x570-empty"><span class="ic">☆</span>还没有收藏的句子。</div>';
        else html += fav.map(function (q) {
          return '<div class="x570-diary"><div class="x570-diary-b">「' + esc(q.q) + "」</div><div class='x570-diary-d'>—— " + esc(q.c) + "</div></div>";
        }).join("");
      } else {
        html += QUOTES[cur].map(function (q) {
          return '<div class="x570-know"><p>「' + esc(q) + "」</p></div>";
        }).join("");
      }
      body.innerHTML = html;
      on(body, "click", function (e) {
        var t = e.target.closest("[data-t]");
        if (t) { cur = t.getAttribute("data-t"); home(); }
        if (e.target.closest("#qRandom")) {
          var r = pool[Math.floor(Math.random() * pool.length)];
          today.q = r.q; today.c = r.c;
          home();
        }
        if (e.target.closest("#qFav")) {
          if (!fav.some(function (x) { return x.q === today.q; })) {
            fav.push({ q: today.q, c: today.c });
            saveFav(fav);
            H.toast("已收藏");
          } else H.toast("已经收藏过啦");
        }
      });
    }
    home();
  }

  X570.CampusSub.quotes = open;
  X570.Quotes = { open: open, QUOTES: QUOTES };
})();

/* ===== a780_habit.js ===== */
/* =====================================================================
   21 天习惯养成：自定义打卡习惯，连续坚持，养成好的学习生活习惯
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet, lsSet = H.lsSet;
  var KEY = "xz570_habit_v1";
  var GOAL = 21;

  var PRESETS = ["每天背 20 个单词", "每天读 30 分钟课外书", "每天整理 5 道错题", "坚持早睡早起", "每天喝 6 杯水", "每天运动 20 分钟", "课前预习", "睡前不玩手机", "每天练字 15 分钟", "每天复盘三件事"];

  function dayStr(d) { return new Date(d).toDateString(); }
  function load() {
    try { var d = JSON.parse(lsGet(KEY, "null")); if (d) return d; } catch (e) {}
    var d = { habits: [] };
    try { lsSet(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function save(d) { try { lsSet(KEY, JSON.stringify(d)); } catch (e) {} }
  function calcStreak(days) {
    var n = 0, cur = Date.now();
    while (true) {
      var k = dayStr(cur);
      if (days[k]) { n++; cur -= 86400000; }
      else {
        if (n === 0) { cur -= 86400000; if (days[dayStr(cur)]) continue; }
        break;
      }
    }
    return n;
  }

  function open() {
    var d = load();
    var el = H.openFull("x570Sub", "🌱 21 天习惯养成");
    var body = el.querySelector(".x570-full-body");
    var today = dayStr(Date.now());
    function home() {
      var html = '<div class="x570-card"><div class="t">21 天习惯养成</div>' +
        '<div class="d">一个习惯坚持 21 天，就会变成自然。今天也要记得打卡。</div>' +
        '<button class="x570-btn" id="hbAdd" style="width:100%;margin-top:10px">+ 新建习惯</button></div>';
      if (!d.habits.length) {
        html += '<div class="x570-empty"><span class="ic">🌱</span>还没有习惯，从一个小目标开始吧。</div>';
      } else {
        html += d.habits.map(function (h, i) {
          var done = !!h.days[today];
          var streak = calcStreak(h.days);
          var pct = Math.min(100, Math.round(h.count / GOAL * 100));
          return '<div class="x570-card"><div style="display:flex;align-items:center;gap:10px">' +
            '<button class="x570-check" data-i="' + i + '" style="width:32px;height:32px;font-size:18px;' + (done ? "background:#22d06b;border-color:#22d06b;color:#07210f" : "") + '">✓</button>' +
            '<div style="flex:1"><b>' + esc(h.name) + "</b>" +
            '<div class="d">连续 ' + streak + " 天 · 累计 " + h.count + " / " + GOAL + " 天 " + (h.count >= GOAL ? "🏆 已养成！" : "") + "</div>" +
            '<div class="x570-bar green"><div class="x570-bar-i" style="width:' + pct + '%"></div></div></div>' +
            '<button class="x570-btn" data-del="' + i + '" style="min-height:40px;padding:6px 12px">删</button></div></div>';
        }).join("");
      }
      body.innerHTML = html;
      on($("#hbAdd"), add);
      on(body, "click", function (e) {
        var c = e.target.closest("[data-i]");
        if (c) {
          var i = +c.getAttribute("data-i"), h = d.habits[i];
          if (!h.days[today]) { h.days[today] = true; h.count++; if (window.G) G.mood = Math.min(100, (G.mood || 0) + 1); save(d); H.toast("打卡成功，坚持就是胜利！"); }
          else { delete h.days[today]; h.count = Math.max(0, h.count - 1); save(d); }
          home();
        }
        var dl = e.target.closest("[data-del]");
        if (dl && confirm("确定删除这个习惯吗？打卡记录也会一起删除。")) {
          d.habits.splice(+dl.getAttribute("data-del"), 1);
          save(d);
          home();
        }
      });
    }
    function add() {
      var html = '<div class="x570-card"><div class="t">新建习惯</div>' +
        '<div class="d">从常用习惯里选一个，或自己输入：</div>' +
        '<div class="x570-ach-tabs" style="flex-wrap:wrap">' + PRESETS.map(function (p) {
          return '<button class="x570-ach-tab hbP" data-p="' + p + '">' + esc(p) + "</button>";
        }).join("") + "</div>" +
        '<input id="hbName" style="width:100%;box-sizing:border-box;padding:12px;border-radius:10px;margin-top:10px" placeholder="输入你的习惯，如：每天背 10 个单词">' +
        '<div style="display:flex;gap:10px;margin-top:12px"><button class="x570-btn" id="hbOk" style="flex:1">创建</button>' +
        '<button class="x570-btn" id="hbBack" style="flex:1">返回</button></div></div>';
      body.innerHTML = html;
      on($("#hbBack"), "click", home);
      on(body, "click", function (e) {
        var p = e.target.closest(".hbP");
        if (p) $("#hbName").value = p.getAttribute("data-p");
      });
      on($("#hbOk"), "click", function () {
        var name = $("#hbName").value.trim();
        if (!name) return H.toast("先写一个习惯");
        if (d.habits.some(function (x) { return x.name === name; })) return H.toast("已经有这个习惯啦");
        d.habits.push({ name: name, days: {}, count: 0, created: new Date().toLocaleDateString() });
        save(d);
        H.toast("习惯已创建，从今天开始打卡！");
        home();
      });
    }
    home();
  }

  X570.CampusSub.habit = open;
  X570.Habit = { open: open, PRESETS: PRESETS };
})();

/* ===== a790_help.js ===== */
/* =====================================================================
   校园帮助中心：新手指南 / 常见问题 / 玩法说明，让玩家快速上手
   ===================================================================== */
(function () {
  var H = X570H, on = H.on, esc = H.esc;

  var FAQS = {
    "新手入门": [
      { q: "怎么开始玩？", a: "开始页有剧情模式和自由模式两张卡片。剧情模式是一段可互动的校园故事；自由模式可以自由安排上课、课间、社团和活动。" },
      { q: "右下角两个按钮是什么？", a: "绿色💬是微信，可以聊天、发朋友圈、联系同学；橙色🧰是工具箱，里面有小游戏、存档、主题、设置和各种玩法。" },
      { q: "我的进度会丢吗？", a: "游戏数据保存在浏览器本地（localStorage）。只要不清浏览器数据，进度和打卡记录都会保留。" },
      { q: "手机上怎么玩最流畅？", a: "5.7.0 已做大幅性能优化：手机上会自动关闭磨砂和多余动画。如果还卡，可以在设置里打开低性能模式。" },
      { q: "怎么切换主题？", a: "打开工具箱里的「主题」，7 套皮肤一键切换，会自动记住你选的主题。" }
    ],
    "学习玩法": [
      { q: "怎么提升知识/成绩？", a: "认真上课、做模拟考试、整理错题本、用单词卡和公式卡、预约自习室，都能稳定提升知识。" },
      { q: "错题本怎么用？", a: "在校园中心打开错题本，分科记录错题、正确答案和错因，考前翻一翻，标记掌握的题。" },
      { q: "模拟考试在哪里？", a: "校园中心 → 模拟考试，包含选择题和口算，成绩会记录历史，方便看到进步。" },
      { q: "上课点了没反应/跳内容？", a: "5.7.0 已加入防连点和流程保护，点一次耐心等待即可，不要快速连续点击。" },
      { q: "学习计划和课表？", a: "校园中心有学习计划（作业、周课表、周目标）和课堂随机工具，帮你安排得井井有条。" }
    ],
    "社交与剧情": [
      { q: "剧情模式怎么玩？", a: "剧情模式里点击对话框继续，遇到选项时点击你想选的回答，选择会影响好感和走向。一位女主对应一条故事线。" },
      { q: "好感度怎么提升？", a: "在校园中心 → 关系与好感，给同学送礼、聊天、帮忙，都能提升好感；剧情里的选择也会影响。" },
      { q: "微信朋友圈怎么发？", a: "点右下角💬进入微信，切换到朋友圈，可以发表图文、点赞、评论，同学也会发动态。" },
      { q: "恋爱纪念册是什么？", a: "在恋爱入口里，会记录你和女主之间的心动瞬间，达成条件后解锁。" },
      { q: "能同时选多个女生吗？", a: "剧情模式专注一条线，一次只选一位女主，方便你认真体验一段完整的故事。" }
    ],
    "休闲与活动": [
      { q: "小游戏在哪里？", a: "工具箱 → 游戏中心，包含合成大西瓜、矿工、跳一跳、2048、贪吃蛇等十几个游戏，会保存最高分。" },
      { q: "运动会怎么玩？", a: "工具箱里有运动会 DLC，可以报名跑步、跳远、接力等项目，积累积分、领取奖励。" },
      { q: "校园橘猫怎么养？", a: "校园中心 → 校园橘猫，喂食、陪玩、抚摸可以提升等级，太久不看它会想你。" },
      { q: "签到和打卡有什么用？", a: "每日签到、运动打卡、21 天习惯，都能记录你的坚持，还能获得零花钱和心情加成。" },
      { q: "心愿瓶、同学录怎么玩？", a: "心愿瓶可以写下和捞起陌生人的心愿；同学录可以请同学签名、收集寄语。" }
    ],
    "常见问题": [
      { q: "页面显示一半、按钮重叠？", a: "5.7.0 已统一全屏布局并把右下角合并成两个按钮，横竖屏都做了适配。如果仍有问题，请刷新页面。" },
      { q: "音乐不播放？", a: "浏览器需要用户先点击页面才允许播放声音，点一下屏幕任意位置即可，之后音乐会自动继续。" },
      { q: "想换设备继续玩？", a: "工具箱里有存档系统，可以导出存档 JSON，在新设备导入恢复。" },
      { q: "内容会持续更新吗？", a: "5.7.0 是收官版本，剧情板块也做了扎实的交互框架，方便你自己继续往里写剧情。" },
      { q: "数据安全吗？", a: "所有数据都只存在你自己的设备里，不上传任何服务器。" }
    ]
  };

  function open() {
    var el = H.openFull("x570Sub", "❓ 帮助中心");
    var body = el.querySelector(".x570-full-body");
    var cats = Object.keys(FAQS);
    var cur = cats[0];
    var opened = {};
    function render() {
      var tabs = '<div class="x570-ach-tabs">' + cats.map(function (c) {
        return '<button class="x570-ach-tab ' + (cur === c ? "on" : "") + '" data-c="' + c + '">' + c + "</button>";
      }).join("") + "</div>";
      var html = tabs + '<div class="x570-card"><div class="t">欢迎来到校园</div><div class="d">这里汇总了新手最常问的问题，点一下问题就能展开答案。</div></div>';
      html += FAQS[cur].map(function (f, i) {
        var key = cur + i;
        return '<div class="x570-faq" data-k="' + key + '"><div class="x570-faq-q">▸ ' + esc(f.q) + "</div>" +
          '<div class="x570-faq-a" data-a="' + key + '" style="display:' + (opened[key] ? "block" : "none") + '">' + esc(f.a) + "</div></div>";
      }).join("");
      body.innerHTML = html;
      on(body, "click", function (e) {
        var t = e.target.closest("[data-c]");
        if (t) { cur = t.getAttribute("data-c"); render(); }
        var f = e.target.closest(".x570-faq");
        if (f) {
          var k = f.getAttribute("data-k");
          opened[k] = !opened[k];
          var a = f.querySelector(".x570-faq-a");
          if (a) a.style.display = opened[k] ? "block" : "none";
        }
      });
    }
    render();
  }

  X570.CampusSub.help = open;
  X570.Help = { open: open, FAQS: FAQS };
})();

/* ===== a800_about.js ===== */
/* =====================================================================
   关于本游戏 / 版本信息：版本号、制作鸣谢、玩法统计、一键自检
   ===================================================================== */
(function () {
  var H = X570H, $ = H.$, on = H.on, esc = H.esc, lsGet = H.lsGet;

  function num(key) {
    try { return JSON.parse(lsGet(key, "null")); } catch (e) { return null; }
  }
  function countKeys(key) {
    var d = num(key);
    if (!d) return 0;
    if (Array.isArray(d)) return d.length;
    return Object.keys(d).length;
  }

  function open() {
    var el = H.openFull("x570Sub", "🏷️ 关于 5.7.0");
    var body = el.querySelector(".x570-full-body");
    var ver = (window.XZ_VER || "5.7.0");
    var stat = {
      signin: countKeys("xz570_signin_v1"),
      exercise: countKeys("xz570_exercise_v1"),
      diary: countKeys("xz570_diary_v1"),
      mistakes: countKeys("xz570_mistake_v1"),
      habits: countKeys("xz570_habit_v1"),
      wishes: countKeys("xz570_wishes_v1"),
      ach: countKeys("xz570_ach_flags")
    };
    var html =
      '<div class="x570-card x570-center"><div style="font-size:52px">🎓</div>' +
      '<div class="t" style="font-size:22px;margin-top:8px">杭州西子实验学校模拟器</div>' +
      '<div class="d">版本 ' + esc(String(ver)) + " · 「心之所向」收官版</div>" +
      '<div class="d">一个完整的高中校园模拟：剧情、自由、学习、社交、社团、运动、小游戏，全都在这里。</div></div>';
    html += '<div class="x570-card"><div class="t">你的校园足迹</div>' +
      '<div class="x570-stat-grid">' +
      '<div class="x570-stat"><div class="n">签到天数</div><div class="v">' + (stat.signin ? stat.signin.total || 0 : 0) + "</div></div>" +
      '<div class="x570-stat"><div class="n">运动次数</div><div class="v">' + (stat.exercise ? stat.exercise.total || 0 : 0) + "</div></div>" +
      '<div class="x570-stat"><div class="n">日记篇数</div><div class="v">' + (stat.diary ? (stat.diary.items || []).length : 0) + "</div></div>" +
      '<div class="x570-stat"><div class="n">错题数</div><div class="v">' + (stat.mistakes ? (stat.mistakes.items || []).length : 0) + "</div></div>" +
      '<div class="x570-stat"><div class="n">习惯数</div><div class="v">' + stat.habits + "</div></div>" +
      '<div class="x570-stat"><div class="n">心愿数</div><div class="v">' + (stat.wishes ? ((stat.wishes.mine || []).length) : 0) + "</div></div>" +
      "</div></div>";
    html += '<div class="x570-card"><div class="t">玩法一览</div>' +
      '<div class="d">· 剧情模式：可互动的校园言情故事，点击对话、选择走向，多结局。<br>' +
      "· 自由模式：上课、课间、社团、活动，自由安排高中生活。<br>" +
      "· 校园中心：签到、考试、错题、单词、公式、社团、装扮、橘猫等 30+ 模块。<br>" +
      "· 微信：和同学聊天、发朋友圈、点赞评论。<br>" +
      "· 工具箱：十几个小游戏、运动会、存档、主题、设置。<br>" +
      "· 全部进度保存在本地，刷新不丢失。</div></div>";
    html += '<div class="x570-card"><div class="t">制作鸣谢</div>' +
      '<div class="d">在多个版本中持续迭代与修复。技术支持：GLM Hy3，以及一路陪它走到今天的你。<br>手绘标题素材：你亲手绘制的「杭州西子实验学校 / learrus. / 5.6.5 PRO / 心之所向」。</div></div>';
    html += '<button class="x570-btn" id="abSelf" style="width:100%;margin-bottom:10px">一键自检</button>';
    body.innerHTML = html;
    on($("#abSelf"), "click", function () {
      var ok = [];
      ok.push("X570 框架：" + (window.X570 ? "正常" : "异常"));
      ok.push("工具箱：" + (window.X570 && X570.Toolbox ? "正常" : "异常"));
      ok.push("校园中心：" + (window.X570 && X570.CampusSub ? "正常（" + Object.keys(X570.CampusSub).length + " 个模块）" : "异常"));
      ok.push("小游戏：" + (window.X570Games ? Object.keys(X570Games).length + " 个" : "异常"));
      ok.push("剧情：" + (window.X56Story ? "正常" : "异常"));
      ok.push("微信：" + (window.X565WX ? "正常" : "异常"));
      H.modal("<h3 style='margin:0 0 10px'>自检结果</h3><div style='line-height:2'>" + ok.map(esc).join("<br>") + "</div>");
    });
  }

  X570.CampusSub.about = open;
  X570.About = { open: open };
})();

/* ===== a99_tail.js ===== */
/* =====================================================================
   5.7.0 第七层补丁收尾：闭合 IIFE 并启动
   ===================================================================== */
  /* 打印模块自检，便于排查 */
  X570.bootReport = function () {
    var ok = this.modules.filter(function (m) { return m.done; });
    var err = this.modules.filter(function (m) { return !m.done; });
    return {
      total: this.modules.length,
      ok: ok.length,
      failed: err.map(function (m) { return m.name + "：" + m.error; })
    };
  };
  try {
    if (window.console && console.log) {
      console.log("%c[X570] 5.7.0「心之所向 · PRO 收官」补丁已装载", "color:#ff7eb3;font-weight:bold");
    }
  } catch (e) {}

  /* 统一对外版本号：本层最后加载，强制锁定为 5.7.0（覆盖旧层里散落的 XZ_VER 赋值） */
  try {
    window.XZ_VER = "10.1.1 PRO";
    var setVer = function () { try { window.XZ_VER = "10.1.1 PRO"; } catch (e) {} };
    setVer();
    setTimeout(setVer, 500);
    setTimeout(setVer, 2000);
    document.addEventListener("DOMContentLoaded", setVer);
    window.addEventListener("load", setVer);
  } catch (e) {}

  /* 启动全部模块（DOM 就绪后） */
  bootWhenReady();
})();


