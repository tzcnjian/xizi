

/* ===== p00_head.js ===== */
/* ============================================================================
   杭州西子实验学校模拟器 · 5.6.5「心之所向 · 稳定版」
   第六层补丁 · 只增不删
   修复：主题统一选择器 / 剧情点击 / 移动端布局 / 性能卡顿
   新增：手机微信（聊天+朋友圈融合）/ 新皮肤 / 新内容 / 新小游戏
   ============================================================================ */
(function () {
  "use strict";
  var __XZ_PATCH_565__ = true;
  if (window.__XZ_PATCH_565_LOADED__) return;
  window.__XZ_PATCH_565_LOADED__ = true;

  /* ---- 基础工具 ---- */
  function $(id) { return document.getElementById(id); }
  function $s(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $a(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function on(el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt || false); }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function storageGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function storageSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function storageDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function toast(msg, ms) {
    try {
      var t = document.createElement("div");
      t.className = "x565-toast";
      t.textContent = msg;
      t.style.cssText = "position:fixed;left:50%;top:22%;transform:translateX(-50%);z-index:33000;" +
        "padding:11px 22px;border-radius:14px;font-size:14px;max-width:84%;text-align:center;" +
        "background:rgba(20,28,48,.94);color:#fff;box-shadow:0 12px 34px rgba(0,0,0,.4);line-height:1.5;";
      document.body.appendChild(t);
      setTimeout(function () { t.style.transition = "opacity .35s"; t.style.opacity = "0";
        setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 380); }, ms || 1800);
    } catch (e) {}
  }
  function modalOpen(h) {
    try { if (typeof window.modal === "function") { window.modal(h); return true; } } catch (e) {}
    try {
      var ov = document.createElement("div");
      ov.id = "modal"; ov.className = "show";
      ov.style.cssText = "position:fixed;inset:0;z-index:30000;display:flex;align-items:center;justify-content:center;padding:16px;";
      var box = document.createElement("div");
      box.id = "modalbox";
      box.style.cssText = "max-width:640px;width:100%;max-height:88vh;overflow-y:auto;border-radius:18px;padding:20px;background:var(--surface,#fff);color:var(--ink,#111);";
      box.innerHTML = h;
      ov.appendChild(box);
      on(ov, "click", function (e) { if (e.target === ov) { if (ov.parentNode) ov.parentNode.removeChild(ov); } });
      document.body.appendChild(ov);
      return true;
    } catch (e) { return false; }
  }
  function modalClose() {
    try { if (typeof window.closeModal === "function") { window.closeModal(); return; } } catch (e) {}
    var ov = $("modal"); if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
  }
  function ready(fn) {
    if (document.readyState !== "loading") setTimeout(fn, 120);
    else document.addEventListener("DOMContentLoaded", function () { setTimeout(fn, 120); });
  }
  function isMobile() {
    return Math.max(window.innerWidth || 0, window.innerHeight || 0) < 860 ||
      (navigator.maxTouchPoints > 0 && Math.min(window.innerWidth, window.innerHeight) < 860) ||
      /Android|iPhone|iPod|Mobile|HarmonyOS/i.test(navigator.userAgent);
  }

  /* 命名空间 */
  var X565 = {
    ver: "5.6.5",
    $: $, $s: $s, $a: $a, on: on, esc: esc, clamp: clamp, pick: pick,
    storageGet: storageGet, storageSet: storageSet, storageDel: storageDel,
    toast: toast, modalOpen: modalOpen, modalClose: modalClose,
    isMobile: isMobile,
    modules: []
  };
  window.X565 = X565;

  /* 安全注册模块：每个模块独立 try/catch，互不影响 */
  function register(name, fn) {
    X565.modules.push({ name: name, fn: fn });
  }
  X565.register = register;

  function bootAll() {
    for (var i = 0; i < X565.modules.length; i++) {
      var m = X565.modules[i];
      if (m.done) continue;
      try { m.fn(); m.done = true; }
      catch (e) { try { console.warn("[5.6.5] 模块 " + m.name + " 启动失败", e); } catch (x) {} }
    }
    try { console.log("[5.6.5] 模块启动完成：" + X565.modules.length + " 个"); } catch (e) {}
  }
  window.X565.bootAll = bootAll;
  window.X565Boot = bootAll;
  /* 注意：IIFE 由 p99_tail.js 收尾并安排启动 */


/* ===== p10_theme.js ===== */
/* ============================================================================
   模块一 · 5.6.5 权威主题系统
   统一 9 套皮肤（原 7 套 + 新增 青柚/霓虹），一个面板、即时生效、可返回、
   接管 FAB / 工作台 / 5.5.9 / 5.5.13 全部入口，并让旧纠偏不再打架
   ============================================================================ */
register("theme", function () {
  var X565Theme = {
    KEY_EFF: "xz_art_theme",
    KEY_INTENT: "xz56_user_theme",
    KEY_ALIAS: "xz_theme",
    KEYS: ["xz_art_theme", "xz56_user_theme", "xz_theme"],
    themes: [
      { id: "xizi", name: "西子湖", desc: "西湖烟雨 · 暮色玻璃（默认）", mode: "dark",
        grad: "linear-gradient(135deg,#0b1a2b,#102536 55%,#161b36)",
        dots: ["#0b1a2b", "#102536", "#7fd1ae", "#ff9eb5"] },
      { id: "classic", name: "晴空", desc: "浅蓝晴空 · 白色玻璃 · 上一版经典", mode: "light",
        grad: "linear-gradient(135deg,#eef4ff,#fbfdff 55%,#e8f0fb)",
        dots: ["#eef4ff", "#ffffff", "#4a86f5", "#63a3f8"] },
      { id: "sakura", name: "樱语", desc: "奶油粉白 · 樱花飘落", mode: "light",
        grad: "linear-gradient(135deg,#fff5f8,#fffafc 55%,#fdeef3)",
        dots: ["#fff5f8", "#ffffff", "#f278a6", "#f69cc0"] },
      { id: "qingshan", name: "青山", desc: "水墨湖山 · 黑白极简", mode: "light",
        grad: "linear-gradient(135deg,#f6faf9,#ffffff 55%,#eef5f4)",
        dots: ["#f6faf9", "#ffffff", "#4a8a7a", "#5ba3b3"] },
      { id: "guanggu", name: "光谷", desc: "清新明亮 · 光之谷", mode: "light",
        grad: "linear-gradient(135deg,#f0f6ff,#ffffff 55%,#f5faff)",
        dots: ["#f0f6ff", "#ffffff", "#4a9eff", "#7dc3ff"] },
      { id: "warm", name: "暖阳", desc: "暖色温馨 · 小太阳", mode: "light",
        grad: "linear-gradient(135deg,#fff8f0,#fffcf5 55%,#fff5eb)",
        dots: ["#fff8f0", "#fffcf5", "#e89856", "#f0b070"] },
      { id: "mint", name: "青柚", desc: "清新薄荷绿 · 青春校园（5.6.5 新皮肤）", mode: "light",
        grad: "linear-gradient(135deg,#eefaf3,#fbfefc 55%,#e3f6ec)",
        dots: ["#eefaf3", "#ffffff", "#22b07d", "#34c98e"] },
      { id: "darknight", name: "暗夜", desc: "深紫星空 · 静谧夜", mode: "dark",
        grad: "linear-gradient(135deg,#0d0b1a,#14102a 55%,#0f0d20)",
        dots: ["#0d0b1a", "#14102a", "#9b7af5", "#b79af8"] },
      { id: "neon", name: "霓虹", desc: "赛博紫青 · 夜景都市（5.6.5 新皮肤）", mode: "dark",
        grad: "linear-gradient(135deg,#0a0a1a,#10102a 55%,#0e0a22)",
        dots: ["#0a0a1a", "#10102a", "#ff4ba0", "#00d6ff"] }
    ],
    byId: function (id) {
      for (var i = 0; i < this.themes.length; i++) if (this.themes[i].id === id) return this.themes[i];
      return this.themes[0];
    },
    isValid: function (id) {
      for (var i = 0; i < this.themes.length; i++) if (this.themes[i].id === id) return true;
      return false;
    },
    /* 读取当前：依次看意图/生效/兼容键（xz_theme），默认 xizi */
    get: function () {
      var v = storageGet(this.KEY_INTENT) || storageGet(this.KEY_EFF) || storageGet(this.KEY_ALIAS);
      if (!v || v === "default" || v === "0") return "xizi";
      return this.isValid(v) ? v : "xizi";
    },
    writeKeys: function (id) {
      var self = this;
      this.KEYS.forEach(function (k) { try { storageSet(k, id); } catch (e) {} });
    },
    ensurePanel: function () {
      var p = $("x565ThemePanel");
      if (p) return p;
      p = document.createElement("div");
      p.id = "x565ThemePanel";
      p.innerHTML =
        '<div class="x565tp-top">' +
          '<button class="x565tp-back" data-act="close" aria-label="返回">‹</button>' +
          '<div><div class="x565tp-title">🎨 主题皮肤</div>' +
          '<div class="x565tp-sub">九套皮肤 · 点卡片立即生效并自动保存</div></div>' +
        '</div>' +
        '<div class="x565tp-body"><div class="x565tp-grid" id="x565tpGrid"></div></div>' +
        '<div class="x565tp-foot">' +
          '<button class="x565-btn x565tp-reset" data-act="reset">恢复默认</button>' +
          '<button class="x565-btn x565tp-done" data-act="close">✓ 完成</button>' +
        '</div>';
      document.body.appendChild(p);
      var self = this;
      /* 事件委托：面板内所有点击一次绑定、永远有效 */
      p.addEventListener("click", function (e) {
        var closeBtn = e.target.closest ? e.target.closest('[data-act="close"]') : null;
        var resetBtn = e.target.closest ? e.target.closest('[data-act="reset"]') : null;
        var card = e.target.closest ? e.target.closest(".x565tp-card") : null;
        if (closeBtn) { self.close(); return; }
        if (resetBtn) { self.choose("xizi"); toast("已恢复默认：西子湖"); return; }
        if (card) { self.choose(card.getAttribute("data-tid")); }
      });
      return p;
    },
    renderGrid: function () {
      var grid = $("x565tpGrid");
      if (!grid) return;
      var cur = this.get();
      var self = this;
      grid.innerHTML = this.themes.map(function (t) {
        var dots = t.dots.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("");
        return '<button class="x565tp-card' + (t.id === cur ? " cur" : "") + '" data-tid="' + t.id + '">' +
          '<div class="x565tp-preview" style="background:' + t.grad + '">' +
            '<div class="x565tp-check">✓</div>' +
            '<div class="x565tp-badge">' + (t.mode === "dark" ? "夜间" : "日间") + '</div>' +
            '<div class="x565tp-dots">' + dots + '</div>' +
          '</div>' +
          '<div class="x565tp-info">' +
            '<div class="x565tp-name">' + esc(t.name) + '</div>' +
            '<div class="x565tp-desc">' + esc(t.desc) + '</div>' +
          '</div>' +
        '</button>';
      }).join("");
    },
    open: function () {
      var p = this.ensurePanel();
      this.renderGrid();
      p.classList.add("show");
      try { document.body.style.overflow = "hidden"; } catch (e) {}
    },
    close: function () {
      var p = $("x565ThemePanel");
      if (p) p.classList.remove("show");
      try { document.body.style.overflow = ""; } catch (e) {}
    },
    choose: function (id) {
      if (!this.isValid(id)) id = "xizi";
      this.writeKeys(id);
      this.apply(id);
      toast("已切换：" + this.byId(id).name, 1100);
    },
    apply: function (id, quiet) {
      if (!this.isValid(id)) id = "xizi";
      var cur = this.get();
      var m = document.body.className.match(/theme-([a-z]+)/);
      var bodyNow = m ? m[1] : "";
      /* 已是目标主题且键一致，就跳过，避免高频重排（性能） */
      if (bodyNow === id && cur === id) return;
      for (var i = 0; i < this.themes.length; i++)
        document.body.classList.remove("theme-" + this.themes[i].id);
      /* 同时移除旧补丁可能出现的其它皮肤类 */
      document.body.classList.remove("theme-default");
      document.body.classList.add("theme-" + id);
      var t = this.byId(id);
      document.documentElement.classList.toggle("light", t.mode === "light");
      document.documentElement.classList.toggle("dark", t.mode === "dark");
      document.documentElement.setAttribute("data-theme", id);
      document.body.setAttribute("data-theme", id);
      this.writeKeys(id);
      try {
        var eve = new Event("x565themechange"); eve.theme = id; document.dispatchEvent(eve);
      } catch (e) {}
      this.renderGrid();
    }
  };
  window.X565Theme = X565Theme;

  /* 让 5.6 的主题对象完全收敛到本权威实现 */
  function converge() {
    if (window.X56Theme) {
      var T = window.X56Theme;
      T.choose = function (id) { X565Theme.choose(id); };
      T.apply = function (id) { X565Theme.apply(id); };
      T.openPanel = function () { X565Theme.open(); };
      T.closePanel = function () { X565Theme.close(); };
      T.intentGet = function () { return X565Theme.get(); };
      T.get = function () { return X565Theme.get(); };
      T.isValid = function (id) { return X565Theme.isValid(id); };
      T.byId = function (id) { return X565Theme.byId(id); };
      /* 旧纠偏：只做“收敛到当前选择”，且 apply 内部会在一致时跳过，不打架 */
      T.guard = function () { X565Theme.apply(X565Theme.get()); };
      T.refreshPanel = function () { X565Theme.renderGrid(); };
    }
    /* 旧补丁全局入口 */
    window.applyArtTheme = function (id) { X565Theme.choose(id || X565Theme.get()); };
    window.__qsApplyTheme = function (id) { X565Theme.choose(id || X565Theme.get()); };
    window.__xz13ApplyTheme = function (id) { X565Theme.choose(id || X565Theme.get()); };
    window.applyArtTheme13 = function (id) { X565Theme.choose(id || X565Theme.get()); };
    window.getCurrentTheme = function () { return X565Theme.get(); };
    window.getCurrentTheme13 = function () { return X565Theme.get(); };
    window.applyTheme = function (id) { X565Theme.apply(X565Theme.get()); };
    window.setTheme = function () {};
  }

  /* 接管所有“主题/皮肤”入口（FAB、工作台、559） */
  function isThemeEntry(t) {
    if (!t || t.id === "x565ThemePanel") return false;
    var id = t.id || "";
    if (id === "xz559-theme-btn" || id === "xz13-wb-theme" || id === "x56ThemeFab") return true;
    var tx = (t.getAttribute && (t.getAttribute("data-theme-entry") || t.getAttribute("data-wb-key"))) || "";
    if (tx && /theme|主题|皮肤|skin/i.test(tx)) return true;
    var text = (t.textContent || "").trim();
    if (text && text.length <= 12 && /^(🎨|🌈|🌙|☀️)?\s*(主题|皮肤|主题皮肤|外观|皮肤切换)$/.test(text)) {
      /* 仅在工作台/弹层内拦截，避免误伤 */
      if (t.closest("#patch-main-panel, #xz13Workbench, #xzWorkbench, .modal, #modalbox, #heroPanel, #charPanel")) return true;
    }
    return false;
  }
  function interceptEntries() {
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var el = t.closest("#xz559-theme-btn, #xz13-wb-theme, #x56ThemeFab, [data-wb-key='theme'], [data-theme-entry]");
      if (el && isThemeEntry(el)) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        X565Theme.open();
        return;
      }
    }, true);
  }

  /* 确保 🎨 FAB 可点（在其上叠加捕获监听，保证无论旧绑定如何都能打开）；
     若 5.6 的 FAB 不存在，则自建一个，保证任何情况下都有统一入口 */
  function ensureFab() {
    var fab = $("x56ThemeFab");
    if (!fab) {
      var mine = $("x565ThemeFab");
      if (mine) return;
      mine = document.createElement("button");
      mine.id = "x565ThemeFab";
      mine.className = "x565-fab x565-theme-fab";
      mine.setAttribute("aria-label", "主题皮肤");
      mine.innerHTML = "🎨";
      document.body.appendChild(mine);
      fab = mine;
    }
    if (fab && !fab.__x565Bound) {
      fab.__x565Bound = true;
      fab.addEventListener("click", function (e) {
        e.preventDefault(); e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        X565Theme.open();
      }, true);
    }
  }

  /* 应用初始主题并接管 */
  converge();
  X565Theme.ensurePanel();
  X565Theme.apply(X565Theme.get(), true);
  interceptEntries();
  ensureFab();

  /* 持续补偿（低频）：旧入口/FAB 可能晚到 */
  var t1 = setInterval(function () {
    try {
      converge();
      X565Theme.apply(X565Theme.get(), true);
      ensureFab();
    } catch (e) {}
  }, 800);
  setTimeout(function () { clearInterval(t1); }, 14000);
  /* 14 秒后再用更轻的频率仅补偿入口存在性，不再高频改主题 */
  setInterval(function () { try { ensureFab(); } catch (e) {} }, 3000);
});


/* ===== p20_story.js ===== */
/* ============================================================================
   模块二 · 剧情模式修复
   根因：角色面板把 X56Story.boot 作为裸引用传给 addEventListener，
   触发时 this=按钮，this.ensureRoot() 直接 TypeError，点“进入剧情”无反应。
   女主卡 / 选项 / 地图又依赖 60ms 延迟绑定，弱网/慢机易丢。
   方案：① 捕获阶段重接进入入口；② 根节点事件委托，立即响应、不依赖延迟绑定；
        ③ 女主选择页加返回键；④ 所有方法强制以 X56Story 为 this 调用。
   ============================================================================ */
register("story-fix", function () {
  var S = window.X565Story = window.X56Story;
  if (!S) {
    /* 晚到：稍后再试 */
    setTimeout(function () { if (window.X56Story) X565.bootAll(); }, 600);
    return;
  }

  /* 1) 把关键方法包成“无论谁调用都以 S 为 this” */
  ["boot", "ensureRoot", "showPickHeroine", "startStory", "node", "go", "typewrite",
   "skipType", "onTap", "renderChoices", "renderMapNode", "closeMap", "renderHearts",
   "renderEnd", "openMenu", "exit", "save"].forEach(function (name) {
    if (typeof S[name] === "function") {
      var orig = S[name];
      S[name] = function () { return orig.apply(S, arguments); };
    }
  });

  /* 2) 在根节点上做一次捕获级事件委托（永久有效） */
  function attachRoot(root) {
    if (!root || root.__x565StBound) return;
    root.__x565StBound = true;
    root.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var back = t.closest("[data-act='story-pick-back']");
      if (back) {
        e.preventDefault(); e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        S.exit(); return;
      }
      var card = t.closest(".ph-card");
      if (card) {
        e.preventDefault(); e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        var id = card.getAttribute("data-id");
        S.startStory(id, S._x565MyName || "我");
        return;
      }
      var cell = t.closest(".st-map-cell");
      if (cell) {
        e.preventDefault(); e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        S.closeMap();
        var target = cell.getAttribute("data-target");
        if (target) S.go(target);
        return;
      }
      var ch = t.closest(".st-choice");
      if (ch) {
        e.preventDefault(); e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        var box = document.getElementById("stChoices");
        var idx = box ? Array.prototype.indexOf.call(box.children, ch) : -1;
        var nd = S.node(S.state.node);
        if (nd && nd.choices && nd.choices[idx]) {
          var c = nd.choices[idx];
          if (c.eff) S.state.affinity = X565.clamp(S.state.affinity + c.eff, 0, 10);
          if (c.flags) for (var k in c.flags) S.state.flags[k] = c.flags[k];
          S.renderHearts();
          if (c.next) S.go(c.next);
        }
        return;
      }
    }, true);
  }

  /* 3) 拦截“进入剧情”入口（无论旧绑定是否裸传） */
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var btn = t.closest("#x56StoryStartBtn, [data-story-start]");
    if (btn) {
      e.preventDefault(); e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      try { S.boot(); } catch (err) { console.warn("[5.6.5] boot 兜底", err); }
    }
  }, true);

  /* 4) 包一层 showPickHeroine：记下主角名 + 注入返回键 + 立即委托 */
  var _showPick = S.showPickHeroine;
  S.showPickHeroine = function (myName) {
    S._x565MyName = myName || "我";
    /* 防止重复进入时叠加多张女主选择卡（boot 每次都新建） */
    var old = document.getElementById("stPickHeroine");
    if (old && old.parentNode) { try { old.parentNode.removeChild(old); } catch (e) {} }
    _showPick.call(S, myName);
    var pick = document.getElementById("stPickHeroine");
    if (pick && !document.getElementById("x565StBack")) {
      var b = document.createElement("button");
      b.id = "x565StBack";
      b.setAttribute("data-act", "story-pick-back");
      b.setAttribute("aria-label", "返回");
      b.textContent = "‹";
      pick.appendChild(b);
    }
  };

  /* 5) 包一层 boot：确保根节点存在并挂上委托 */
  var _boot = S.boot;
  S.boot = function () {
    _boot.call(S);
    var root = document.getElementById("x56Story");
    if (root) attachRoot(root);
  };
  /* 若根节点已存在（理论上 boot 才创建，这里兜底） */
  var root0 = document.getElementById("x56Story");
  if (root0) attachRoot(root0);
  /* 监听根节点晚到（一次性） */
  var mo = new MutationObserver(function () {
    var root = document.getElementById("x56Story");
    if (root) { attachRoot(root); }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { try { mo.disconnect(); } catch (e) {} }, 20000);

  /* 6) 强化 renderChoices：给每个选项写 data-index，确保可点 */
  var _renderChoices = S.renderChoices;
  S.renderChoices = function (nd) {
    _renderChoices.call(S, nd);
    /* 原方法已绑定；这里补 data-index，便于委托与兜底重接 */
    var box = document.getElementById("stChoices");
    if (box) {
      var btns = X565.$a(".st-choice", box);
      btns.forEach(function (b, i) {
        b.setAttribute("data-index", i);
        if (!b.__x565T) {
          b.__x565T = true;
          b.style.touchAction = "manipulation";
        }
      });
    }
  };
  /* 强化 renderMapNode：写 data-target 已有，保证 show 后可点 */
  var _renderMap = S.renderMapNode;
  S.renderMapNode = function (nd) {
    _renderMap.call(S, nd);
    var root = document.getElementById("x56Story");
    if (root) attachRoot(root);
  };

  /* 7) 结局“回到主界面/再玩一次”确保能退出（包一层 exit，避免主界面被隐藏） */
  var _exit = S.exit;
  S.exit = function () {
    _exit.call(S);
    var root = document.getElementById("x56Story");
    if (root) root.classList.remove("show");
    var st = document.getElementById("start");
    if (st) { st.style.display = ""; st.classList.add("show"); }
  };
});


/* ===== p30_mobile.js ===== */
/* ============================================================================
   模块三 · 移动端布局修复
   1) 合成大西瓜皮肤行（默认/像素/忍者）手机上压成竖条、画布溢出 → 强制横排+自适应
   2) 全屏面板（PATCH 控制台等）补可达的返回键
   3) 弹窗内输入框被软键盘遮挡时自动滚入视口
   不改动桌面端既有布局（CSS 全部在窄屏媒体查询内）
   ============================================================================ */
register("mobile-fix", function () {
  document.documentElement.setAttribute("data-mobile", isMobile() ? "1" : "0");

  /* 1) 游戏弹窗 DOM 规范化：皮肤行移到画布上方、保证横排、画布宽度自适应 */
  function normalizeGameModal() {
    try {
      var rows = $a(".xz-wm-skin-row");
      rows.forEach(function (row) {
        var panel = row.closest(".wm-panel");
        if (!panel) return;
        panel.style.flexDirection = "column";
        panel.style.alignItems = "stretch";
        row.style.flexDirection = "row";
        row.style.flexWrap = "wrap";
        row.style.width = "100%";
        row.style.order = "-1";
        row.style.margin = "0 0 10px 0";
        row.style.justifyContent = "center";
        var btns = $a(".xz-wm-skin-btn", row);
        btns.forEach(function (b) {
          b.style.flex = "0 0 auto";
          b.style.height = "auto";
          b.style.width = "auto";
          b.style.minHeight = "40px";
          b.style.whiteSpace = "nowrap";
          b.style.writingMode = "horizontal-tb";
        });
        /* 确保行在面板最前 */
        if (panel.firstElementChild !== row) panel.insertBefore(row, panel.firstElementChild);
      });
      var canvases = $a(".wm-canvas, .gm-canvas, .wb-canvas");
      canvases.forEach(function (cv) {
        cv.style.maxWidth = "100%";
        cv.style.height = "auto";
        cv.style.touchAction = "none";
        cv.style.margin = "0 auto";
      });
    } catch (e) {}
  }

  /* 监听弹窗/全屏容器增删，出现即规范化 */
  var gameMO = new MutationObserver(function () {
    if ($("modal") || $a(".wm-panel").length || $a(".gm-panel").length) normalizeGameModal();
  });
  gameMO.observe(document.documentElement, { childList: true, subtree: true, attributes: false });
  /* 开局再补一次 */
  setInterval(normalizeGameModal, 1500);

  /* 2) 移动端通用返回按钮（仅在缺可达关闭的全屏面板上出现） */
  var SKIP = ["x565ThemePanel", "x565Phone", "x56Story"];
  function hasCloseInTop(el) {
    var rect = el.getBoundingClientRect();
    if (!rect.height) return false;
    var btns = $a("button, [onclick], [class*=close], [id*=close], [class*=back]", el);
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      var r = b.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      var st = getComputedStyle(b);
      if (st.display === "none" || st.visibility === "hidden" || st.opacity === "0") continue;
      if (r.top < 80 && r.right > rect.right - 90) return true; /* 右上角有关闭 */
    }
    return false;
  }
  function findTopOverlay() {
    /* 全屏遮罩均挂在 body 直接子节点；只扫这一层，避免在大 DOM 上每 700ms 全量 getComputedStyle 造成卡顿 */
    var nodes = $a("body > *");
    var best = null, bestZ = -1;
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (SKIP.indexOf(el.id) >= 0) continue;
      var st = getComputedStyle(el);
      if (st.position !== "fixed" || st.display === "none" || st.visibility === "hidden") continue;
      var z = parseInt(st.zIndex, 10) || 0;
      if (z < 9000) continue;
      var r = el.getBoundingClientRect();
      if (r.width < Math.min(window.innerWidth, 360) * 0.9 || r.height < window.innerHeight * 0.85) continue;
      if (el.id === "game" || el.id === "start" || el.classList.contains("screen")) continue;
      if (hasCloseInTop(el)) continue;
      if (z > bestZ) { bestZ = z; best = el; }
    }
    return best;
  }
  function backBtn() {
    var b = $("x565Back");
    if (!b) {
      b = document.createElement("button");
      b.id = "x565Back";
      b.className = "x565-panel-close";
      b.innerHTML = "‹";
      b.setAttribute("aria-label", "返回");
      b.style.display = "none";
      on(b, "click", function () {
        var el = b.__target;
        if (el && el.id === "patch-main-panel" && window.PATCH && typeof window.PATCH.closePanel === "function") {
          try { window.PATCH.closePanel(); return; } catch (e) {}
        }
        /* 优先点面板内自带的关闭/返回 */
        if (el) {
          var c = $a("[class*=close], [id*=close], [class*=back], [class*=Back]", el)
            .filter(function (x) { var r = x.getBoundingClientRect(); return r.width && r.height; });
          if (c.length) { c[0].click(); return; }
        }
        try { modalClose(); } catch (e) {}
        if (el) { el.style.display = "none"; el.classList.remove("show"); }
      });
      document.body.appendChild(b);
    }
    return b;
  }
  function updateBack() {
    if (!isMobile()) return;
    var b = backBtn();
    var ov = findTopOverlay();
    if (ov) { b.__target = ov; b.style.display = "flex"; }
    else b.style.display = "none";
  }
  if (isMobile()) {
    setInterval(updateBack, 700);
    window.addEventListener("scroll", updateBack, true);
  }

  /* 3) 软键盘遮挡：聚焦输入框时滚入视口（弹窗内） */
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", function () {
      try {
        var ae = document.activeElement;
        if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) {
          ae.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      } catch (e) {}
    });
  }

  /* 4) 阻止弹层/游戏上的横向溢出（双指缩放与橡皮筋） */
  document.addEventListener("touchmove", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest(".wm-canvas, .gm-canvas, .wb-canvas")) { e.preventDefault(); }
  }, { passive: false });

  /* 5) 启动后立刻规范化一次 */
  normalizeGameModal();
});


/* ===== p40_perf.js ===== */
/* ============================================================================
   模块四 · 历史性性能优化
   · 硬件分层（低/中/高），手机弱机关闭昂贵高斯模糊与动画（CSS 已配合）
   · 后台隐藏时暂停高频 setInterval（安全：不影响定时器 id 与取消）
   · 关闭游戏弹窗时回收 rAF，避免“西瓜/矿工/白板”后台空转
   · 长列表 content-visibility 隔离、瞬态元素自动回收
   · 轻量计算缓存 X565Cache
   ============================================================================ */
register("performance", function () {
  var Perf = {
    cache: {},
    tier: "high",
    detectTier: function () {
      var mem = navigator.deviceMemory || 4;
      var cores = navigator.hardwareConcurrency || 4;
      var save = navigator.connection && navigator.connection.saveData;
      var shortEdge = Math.min(window.innerWidth || 999, window.innerHeight || 999);
      var mob = isMobile();
      var t = "high";
      if (mob) {
        if (save || mem <= 3 || cores <= 3 || shortEdge < 380) t = "low";
        else if (mem <= 5 || cores <= 6 || shortEdge < 560) t = "mid";
        else t = "high";
      } else {
        if (save || mem <= 2) t = "mid";
      }
      /* 用户偏好：可手动覆盖（localStorage x565_perf） */
      var forced = storageGet("x565_perf");
      if (forced === "low" || forced === "mid" || forced === "high") t = forced;
      this.tier = t;
      document.documentElement.setAttribute("data-perf", t);
      return t;
    }
  };
  window.X565Perf = Perf;
  Perf.detectTier();

  /* 1) 高频定时器在后台隐藏时不跑（仅拦截 ms<1500 的热循环，安全） */
  var _setInterval = window.setInterval.bind(window);
  window.setInterval = function (fn, ms) {
    if (typeof fn !== "function" || ms >= 1500) return _setInterval(fn, ms);
    var wrapped = function () {
      if (document.hidden) return; /* 后台不跑热循环 */
      if (Perf.tier === "low" && ms < 100) {
        /* 极弱机：把 <100ms 的循环统一压到约 100ms */
        wrapped._n = (wrapped._n || 0) + 1;
        if (wrapped._n % 2 === 0) return;
      }
      return fn.apply(this, arguments);
    };
    return _setInterval(wrapped, ms);
  };

  /* 2) 通用 rAF 追踪：弹窗里有 canvas 时产生的帧记为“游戏帧”，
     关弹窗时统一取消，可回收跳一跳等闭包内、外部拿不到句柄的游戏循环 */
  var _raf = window.requestAnimationFrame.bind(window);
  var _caf = window.cancelAnimationFrame.bind(window);
  var gameRafIds = (function () { var s = new Set(); return s; })();
  function gameCanvasAlive() {
    try {
      var n = document.querySelector("#modalbox canvas, #modal canvas");
      return !!n;
    } catch (e) { return false; }
  }
  window.requestAnimationFrame = function (cb) {
    var id = _raf(function (ts) {
      try { gameRafIds["delete"](id); } catch (e) {}
      return cb(ts);
    });
    try { if (gameCanvasAlive()) gameRafIds.add(id); } catch (e) {}
    return id;
  };
  window.cancelAnimationFrame = function (id) {
    try { gameRafIds["delete"](id); } catch (e) {}
    return _caf(id);
  };
  function cancelTrackedGameRafs() {
    try {
      gameRafIds.forEach(function (id) { try { _caf(id); } catch (e) {} });
      gameRafIds.clear();
    } catch (e) {}
  }

  /* 关闭弹窗时回收游戏 rAF（防止后台空转占满 CPU/GPU） */
  function stopGameLoops() {
    /* 先取消所有“弹窗内 canvas”产生的待执行帧（覆盖跳一跳等闭包游戏） */
    cancelTrackedGameRafs();
    try {
      /* 合成大西瓜 */
      if (window.WM) {
        if (window.WM.raf) { try { _caf(window.WM.raf); } catch (e) {} }
        window.WM.raf = 0;
        window.WM.stopRAF = true;
      }
    } catch (e) {}
    try {
      /* 黄金矿工（两套全局：GM.raf / window.GM_RAF + gmStop） */
      if (window.GM) {
        if (window.GM.raf) { try { _caf(window.GM.raf); } catch (e) {} }
        window.GM.raf = 0;
      }
      if (window.GM_RAF) { try { _caf(window.GM_RAF); } catch (e) {} window.GM_RAF = 0; }
      if (typeof window.gmStop === "function") { try { window.gmStop(); } catch (e) {} }
    } catch (e) {}
    try {
      /* 恋爱地图（love-map）两个版本：全局函数 lmStop / lm999Stop */
      if (typeof window.lmStop === "function") { try { window.lmStop(); } catch (e) {} }
      if (typeof window.lm999Stop === "function") { try { window.lm999Stop(); } catch (e) {} }
    } catch (e) {}
    try {
      /* K 歌 / 麦克风 */
      if (window.PATCH && window.PATCH.karaoke && window.PATCH.karaoke.animationFrame) {
        try { _caf(window.PATCH.karaoke.animationFrame); } catch (e) {}
        window.PATCH.karaoke.animationFrame = null;
      }
      if (window.pitchRAF) { try { _caf(window.pitchRAF); } catch (e) {} window.pitchRAF = 0; }
    } catch (e) {}
    try {
      /* 白板/其它通用 raf 句柄 */
      ["wbRaf", "WB_raf", "canvasRaf", "gameLoop", "wmLoop", "gmLoop", "jjLoop", "xzLoop"].forEach(function (k) {
        if (typeof window[k] === "number") { try { _caf(window[k]); } catch (e) {} window[k] = null; }
      });
    } catch (e) {}
  }
  /* 重启游戏时解除停止标记 */
  var _modal = window.modal;
  if (typeof _modal === "function") {
    window.modal = function () {
      try {
        /* 新弹窗打开前，若是别的游戏切换，重置西瓜标记 */
        if (window.WM) window.WM.stopRAF = false;
      } catch (e) {}
      return _modal.apply(this, arguments);
    };
  }
  var _closeModal = window.closeModal;
  if (typeof _closeModal === "function") {
    window.closeModal = function () {
      /* 仅当关闭的是游戏弹窗时回收：用标记判断，无游戏则无害 */
      var hadGame = document.querySelector(".wm-canvas,.gm-canvas,.wb-canvas");
      var r = _closeModal.apply(this, arguments);
      if (hadGame) setTimeout(stopGameLoops, 30);
      return r;
    };
  }
  /* 弹窗通过点击遮罩/红 X 直接加 .hidden（不经过 closeModal）也回收：
     监听 #modal 的 class 变化，一旦变 hidden 且里面有游戏 canvas，就停循环 */
  function armModalWatcher() {
    var modalEl = document.getElementById("modal");
    if (!modalEl || modalEl.__x565Watched) return;
    modalEl.__x565Watched = true;
    var wasCanvas = false;
    new MutationObserver(function () {
      var hasCanvas = gameCanvasAlive();
      var hidden = modalEl.classList.contains("hidden");
      if (hasCanvas && !hidden) wasCanvas = true;
      if (hidden && wasCanvas) {
        wasCanvas = false;
        setTimeout(stopGameLoops, 30);
      }
    }).observe(modalEl, { attributes: true, attributeFilter: ["class"] });
  }
  armModalWatcher();
  setInterval(armModalWatcher, 2000);

  /* 3) 切到后台：进一步停掉游戏 rAF；回来不强制重启（玩家再点开始即可） */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopGameLoops();
  });

  /* 4) 瞬态元素（彩带/飘心/装饰）自动回收，防止长时间游戏后 DOM 膨胀 */
  var TRASH_SELECTOR = ".confetti, .mm-heart-pop, .x56-toast, .heart-pop, .float-score, .xz-float";
  setInterval(function () {
    try {
      if (document.hidden) return;
      var now = Date.now();
      var nodes = $a(TRASH_SELECTOR);
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        el.__x565Seen = el.__x565Seen || now;
        if (now - el.__x565Seen > 8000) {
          if (el.parentNode) el.parentNode.removeChild(el);
        }
      }
    } catch (e) {}
  }, 2000);

  /* 5) 长列表自动加渲染隔离（朋友圈/聊天/排行榜/成就等） */
  var CV_SELECTOR = [
    "#x56Moments .m-feed", ".wx-moments-list", ".wx-msgs", ".wx-clist",
    ".xz13-gc-grid", ".ach-list", ".rank-list", ".changelog-list"
  ].join(",");
  function applyContainment() {
    $a(CV_SELECTOR).forEach(function (el) {
      if (!el.__x565cv) {
        el.__x565cv = true;
        el.classList.add("x565-cv");
        el.style.contentVisibility = "auto";
        el.style.containIntrinsicSize = "auto 400px";
      }
    });
  }
  setInterval(applyContainment, 2500);
  applyContainment();

  /* 6) 轻量计算缓存（供其它模块复用） */
  var X565Cache = {
    get: function (k) {
      var it = this.store[k];
      if (!it) return null;
      if (it.exp && Date.now() > it.exp) { delete this.store[k]; return null; }
      return it.val;
    },
    set: function (k, val, ttl) {
      this.store[k] = { val: val, exp: ttl ? Date.now() + ttl : 0 };
    },
    store: {}
  };
  window.X565Cache = X565Cache;

  /* 7) 低性能设备：自动关闭“星空/流光”等高成本背景（保留视觉，关闭高斯） */
  if (Perf.tier === "low") {
    document.documentElement.classList.add("x565-low");
    /* 限制大 blur：对实时模糊元素批量降采样（通过 CSS 类，CSS 已处理） */
  }

  /* 8) 性能信息（调试用） */
  Perf.report = function () {
    return {
      tier: Perf.tier,
      mobile: isMobile(),
      deviceMemory: navigator.deviceMemory || "n/a",
      cores: navigator.hardwareConcurrency || "n/a",
      domNodes: document.getElementsByTagName("*").length
    };
  };
  try { console.log("[5.6.5] 性能分层 =", Perf.tier, Perf.report()); } catch (e) {}
});


/* ===== p52_wxdata.js ===== */
/* ============================================================================
   模块五（数据）· 手机微信：联系人 + 人设回复引擎
   全局 XZ_AI_INTENTS（500+ 意图）作为通用回复底座，每位联系人有独立人设
   与专属话题；女主与剧情模式角色一致，真正“可聊”。
   ============================================================================ */
(function () {
  /* 这个文件向 window.X565WXData 写入数据（仍处于第六层 IIFE 内） */
  var B = function (id, name, emoji, bg, tag, sig, warm, opt) {
    opt = opt || {};
    return {
      id: id, name: name, emoji: emoji, bg: bg, tag: tag, sig: sig,
      warm: warm, greeting: opt.greeting || [],
      bank: opt.bank || [], fallback: opt.fallback || [],
      sys: opt.sys || ""
    };
  };

  /* 便捷：一组话题 */
  function K(kws, reps) { return { kws: kws, reps: reps }; }

  var contacts = [
    B("lin", "林晚", "🌸", "linear-gradient(135deg,#ffc2d8,#f59ab8)", "高一(3)班 · 同桌",
      "诗集翻到哪页，就写哪页的风。", 2, {
      sys: "你通过了林晚的好友验证（高一(3)班 同桌）。",
      greeting: ["新同学你好，我是林晚……以后有不懂的可以问我。"],
      bank: [
        K(["海子", "诗", "诗歌", "诗集", "写诗"], ["是海子呀，《面朝大海春暖花开》你也喜欢吗？", "我总觉得诗是把说不出口的话，换一种方式讲给风听。"]),
        K(["语文", "作文", "背诵", "岳阳楼记", "茅屋", "默写"], ["默写我昨晚又读了两遍，你要不要一起背？我检查你。", "作文我也总写不好，不过写你真心想写的，就不会太差。"]),
        K(["雨", "下雨", "伞"], ["下雨的时候我最喜欢靠窗的位置。", "没带伞的话……我可以分你一半，正好顺路。"]),
        K(["桂", "桂花", "小径", "长椅"], ["桂花开了，你也闻到了吗？课间我常在小径长椅上看书。"]),
        K(["喜欢", "好感", "在意", "心动"], ["你…你别突然说这些，我会当真的。", "我也……其实等你这句话，挺久了。"]),
        K(["运动会", "运动会加油"], ["运动会我报名了跳远，你会来看吗？", "你要是跑 1000 米，我去给你递水好不好？"]),
        K(["一起", "放学", "回家", "自习"], ["那……一起？我等你。", "好呀，图书馆见，我给你留靠窗的位置。"]),
        K(["天台", "告白", "表白"], ["天台的风会把秘密吹得很远，也会把心意吹到该去的人耳边。"]),
        K(["误会", "生气", "吵架", "不理"], ["我没有真的生你气……只是有点难过。你来找我，我就原谅你。"]),
        K(["抱抱", "安慰", "难过", "想哭"], ["来，我在呢。难过就靠着一会儿，会好起来的。"]),
        K(["晚安", "睡了", "休息"], ["晚安，明天见。诗集放你桌角了，里面夹了片桂花。"]),
        K(["早餐", "食堂", "吃的"], ["早上食堂的豆浆很烫，你慢点喝。我帮你占过位置吗？"]),
        K(["歌", "许嵩", "音乐"], ["许嵩的歌很安静，晚自习放学路上听刚好。"]),
        K(["故事", "结局", "剧情"], ["如果是我们的故事，我希望结局是好的。你要好好选哦。"])
      ],
      fallback: ["嗯……让我想想。", "你说的话，我会认真记着的。", "课间再说可以吗？我把这句先写进本子里。", "你愿意多讲一点吗？我在听。"]
    }),
    B("zhao", "赵小雨", "🎨", "linear-gradient(135deg,#d8c2f5,#b09ae8)", "美术社 · 元气少女",
      "颜料盒里要永远留一格给夕阳。", 2, {
      sys: "赵小雨把你加为了好友（来源：美术社）。",
      greeting: ["嘿！新同学！我是赵小雨，美术社的，以后叫我小雨就行～"],
      bank: [
        K(["画画", "水彩", "美术", "颜料", "素描"], ["来美术社玩呀！我教你调色，先从一片云开始。", "画画最重要的是大胆，颜色错了也是一幅画。"]),
        K(["西湖", "远山", "风景"], ["我上周画了西湖，老师说远山再淡一点。周末一起去写生好不好？"]),
        K(["喜欢", "可爱", "心动", "表白"], ["哇你这么直接的吗！不过……我好像也不讨厌哈哈。", "你要是认真的，我就认真听哦。"]),
        K(["运动", "跑步", "体育"], ["体育我不行啦，跑两步就喘，但我会在终点给你举牌子加油！"]),
        K(["食堂", "甜", "奶茶", "蛋糕"], ["糖醋里脊冲！吃完我们去买杯奶茶，我请客（下次你请）。"]),
        K(["颜色", "搭配", "皮肤", "主题"], ["你喜欢什么颜色？我最近超爱薄荷绿和樱花粉。", "我觉得颜色是有心情的，阴天就该用暖一点的。"]),
        K(["画画比赛", "比赛", "画展"], ["有画展我一定第一个拉你去，我的画也挂在里面哦。"]),
        K(["难过", "不开心", "安慰"], ["别丧！走，我请你吃甜的，糖分能解决 80% 的烦恼。"]),
        K(["朋友", "闺蜜", "死党"], ["我们现在算好朋友了吧？最好的那种！"]),
        K(["晚安"], ["晚安啦～明天美术课我给你画张小像！"]),
        K(["故事", "剧情"], ["我的故事呀，应该是色彩明亮的那种，你也在画里。"])
      ],
      fallback: ["哈哈是嘛！", "哦哦哦这个有意思！", "我想想怎么回你——总之你说的我都爱听～", "放学陪我去买画材？"]
    }),
    B("su", "苏清颜", "🎵", "linear-gradient(135deg,#b9c7ff,#8a9bf0)", "音乐社 · 钢琴",
      "琴声里没说出口的话，都给你留着。", 1, {
      sys: "苏清颜通过了好友验证（来自音乐社）。",
      greeting: ["你好，我是苏清颜。音乐社的，有什么事吗？"],
      bank: [
        K(["钢琴", "琴", "音乐", "曲", "练习"], ["这首曲子我练了很久，弹到某一段总会想起你。", "音乐室午休通常没人，你可以来听。"]),
        K(["演奏", "比赛", "演出", "表演"], ["校园演奏会我有一段独奏……你能来吗？我会很紧张。"]),
        K(["冷", "高冷", "不好接近", "距离感"], ["我不是冷，只是不太会说话。对你，我已经在努力了。"]),
        K(["喜欢", "在意", "表白"], ["……这种话，等我弹完这首曲子，再说一遍好吗？", "我不太会表达，但琴声里你听得见吗？"]),
        K(["晚", "独自", "一个人", "孤独"], ["音乐室的灯常常是我最后一个关。你要是在，就不会觉得那么长了。"]),
        K(["歌", "许嵩", "唱"], ["我比较喜欢纯音乐，不过如果你想唱，我可以给你伴奏。"]),
        K(["雨"], ["下雨天我会把琴谱盖好，再听雨落在琴房的窗上。"]),
        K(["晚安"], ["晚安。明早有一节钢琴课，我先收琴了。"]),
        K(["难过", "安慰"], ["……我不擅长安慰人。不过，这首曲子送给你。"]),
        K(["故事", "结局"], ["如果是我，我希望结局是一段完整的琴曲，有你在听众席。"])
      ],
      fallback: ["嗯，是这样。", "我会把这句话放进旋律里。", "你说，我听着。", "……有点意思。"]
    }),
    B("xu", "许念", "🏀", "linear-gradient(135deg,#8fd8ad,#5fc08a)", "体育少女 · 短发飒爽",
      "球场上我罩你，学习上你罩我。", 2, {
      sys: "许念通过了好友验证（校篮球队 · 短发体育少女）。",
      greeting: ["喂，新同学！我是许念，篮球队的。以后谁欺负你，报我名字。"],
      bank: [
        K(["篮球", "打球", "对位", "后卫", "投篮", "球"], ["放学球场见！我打后卫，你敢不敢来对位？", "投篮手腕要柔，我手把手教你，别走步。"]),
        K(["跑步", "田径", "体育", "训练", "运动会", "体测"], ["跟我练两圈！前两圈难熬，过了极限就爽了。", "运动会你报什么？我给你特训，保证不垫底。"]),
        K(["短发", "男生头", "像男生", "飒"], ["短发怎么了，凉快又利落！我又不靠头发取胜。"]),
        K(["仗义", "兄弟", "哥们", "义气"], ["你是我兄弟，你的事就是我的事，别跟我客气。"]),
        K(["喜欢", "表白", "在意", "在一起"], ["……你说这种话我会当真的。别看我大大咧咧，其实我心细着呢。", "你要是赢我一场单挑，我就认真考虑（小声）。"]),
        K(["累", "坚持", "放弃", "坚持不下去", "难过"], ["撑不住的时候再走一步，就那一步最关键。我陪你。", "走，跑两圈出一身汗，什么不开心都没了。"]),
        K(["早餐", "水", "能量", "补水", "吃"], ["训练完记得补水！我多带了根香蕉，给你。"]),
        K(["作业", "考试", "题", "学习"], ["学习我不如你，你教我做题，我教你打球，扯平。"]),
        K(["晚安", "睡"], ["晚安！明天别迟到，晨练我可不等你。"]),
        K(["故事", "结局"], ["我的故事要在球场上赢，而你最好是我下场后第一个递水的人。"])
      ],
      fallback: ["哈哈冲！", "走走走，动起来！", "你可以的！", "别磨叽，说重点！"]
    }),
    B("shen", "沈知夏", "🌻", "linear-gradient(135deg,#f5e0a0,#e8c870)", "青梅竹马 · 隔壁班",
      "你什么样子我没见过，所以别装。", 2, {
      sys: "沈知夏把你加为好友（青梅竹马 · 隔壁班）。",
      greeting: ["喂，分在隔壁班就算了，课间还不来找我？我在你班门口等你半天了。"],
      bank: [
        K(["青梅", "小时候", "一起长大", "发小", "幼儿园", "邻居"], ["咱俩穿一条裤子长大的，你三岁尿床的事我都记得，别想抵赖。", "你什么糗样我没见过？所以在我面前装什么成熟。"]),
        K(["早餐", "吃饭", "食堂", "占座"], ["我买了两份早餐，老地方，校门口柱子边，快过来。", "食堂位置我帮你占了，再不来糖醋里脊没了。"]),
        K(["操场", "玩", "等你", "找你"], ["一下课我就跑你班门口，你同桌都认识我了。"]),
        K(["喜欢", "表白", "在意", "在一起", "心动"], ["……你认真的？我们认识十几年了，你现在才说？", "其实我等你这句话，比你以为的久多了。"]),
        K(["嘴硬", "凶", "吵架", "生气", "误会"], ["我嘴上凶你，心里哪次没帮你？自己体会。", "我没真生气，你买杯奶茶我就好了。"]),
        K(["难过", "安慰", "压力", "累"], ["行了别丧了，走，带你去吃小时候那家店，我请。", "天塌下来有我呢，我们不是一起长大的吗？"]),
        K(["别人追", "追你", "情敌", "表白你的"], ["谁？哪个班的？……我就是问问。你、你别答应啊。"]),
        K(["晚安", "睡"], ["晚安，明早我还是在老地方等你，别赖床。"]),
        K(["考试", "学习", "作业"], ["作业又没写？拿过来，我虽然嘴硬，但不会真不管你。"]),
        K(["故事", "结局"], ["我们的故事开头在幼儿园，结局嘛……我希望那个人一直是你。"])
      ],
      fallback: ["喂，说重点。", "你是不是又想偷懒？", "哈哈你这人，从小就这样。", "行行行，知道了，我在呢。"]
    }),
    B("chen", "陈墨", "⚽", "linear-gradient(135deg,#c2f0d2,#8fd8ad)", "男同学 · 体育委员",
      "先投三分再说别的。", 1, {
      greeting: ["兄弟，我是陈墨，体委！打球、跑步都叫我。"],
      bank: [
        K(["打球", "篮球", "足球", "体育", "篮球", "球"], ["放学球场，少你不行！"]),
        K(["跑", "1000", "体测", "运动会"], ["1000 米跟我节奏，包你不垫底。"]),
        K(["作业", "抄", "题"], ["作业我也没写，找学委去哈哈。"]),
        K(["游戏", "开黑", "上分"], ["晚上开黑叫我，我打野！"]),
        K(["喜欢", "表白"], ["你有喜欢的人？兄弟冲啊，扭扭捏捏不像你。"]),
        K(["食堂", "吃"], ["下课冲食堂，比谁跑得快！"])
      ],
      fallback: ["哈哈可以的", "兄弟稳", "真的假的", "下课说，先上课"]
    }),
    B("zhou", "周子航", "🎮", "linear-gradient(135deg,#c8e8f5,#9fd0e0)", "男同学 · 游戏搭子",
      "再玩亿把。", 1, {
      greeting: ["在吗？上号上号，就差你一个！"],
      bank: [
        K(["游戏", "开黑", "上号", "上分", "王者", "原神", "吃鸡"], ["快上号！我刚抽了个新角色。", "今晚别又写作业了，排位掉星了！"]),
        K(["熬夜", "困", "打瞌睡"], ["昨晚又打到两点……数学课我直接磕头。"]),
        K(["梗", "哈哈", "搞笑"], ["这个梗太新了我也看不懂，年轻人太猛。"]),
        K(["作业", "题", "考试"], ["作业？什么作业？？完了。"]),
        K(["戒游戏", "不玩"], ["戒游戏是不可能的，只能少玩一点点。"]),
        K(["喜欢", "表白"], ["你还会表白？不像你啊，我教你，要主动！"])
      ],
      fallback: ["666", "哈哈哈哈", "牛啊", "等我开个箱"]
    }),
    B("tian", "徐甜甜", "📚", "linear-gradient(135deg,#f5e6b0,#e8cf8a)", "女同学 · 课代表",
      "今天也要元气满满地收作业！", 1, {
      greeting: ["你好呀！我是徐甜甜，课代表。作业没交的话我可是会催的哦～"],
      bank: [
        K(["作业", "交", "没写", "催"], ["作业交了吗？别想赖，我都记着呢。"]),
        K(["笔记", "重点", "复习"], ["重点我整理好了，要的话发你，记得请我喝奶茶。"]),
        K(["奶茶", "甜", "零食"], ["走，课间买奶茶！第二杯半价。"]),
        K(["八卦", "谁喜欢谁", "表白"], ["我跟你说个八卦……（凑近）你别告诉别人！"]),
        K(["食堂", "占座", "早饭"], ["我帮你占食堂位置，你帮我带杯豆浆，成交！"]),
        K(["晚安", "睡"], ["晚安！明天默写记得背，别又被抓包啦。"]),
        K(["难过", "安慰"], ["怎么啦怎么啦？跟我说说，我帮你出气！"])
      ],
      fallback: ["嗯嗯！", "真的吗真的吗？", "我也觉得！", "哈哈我懂我懂～"]
    }),
    B("wu", "吴磊", "🏃", "linear-gradient(135deg,#a8d0ff,#7fb0f5)", "男同学 · 体育委员",
      "报名截止前都还来得及。", 1, {
      greeting: ["运动会报名找我！100/400/1000 米、跳远、接力，总有一个适合你。"],
      bank: [
        K(["报名", "运动会", "项目", "接力"], ["报名表给你留着，想报哪个？"]),
        K(["跑步", "训练", "体测"], ["每天放学后操场训练，想跟队直接来。"]),
        K(["篮球", "比赛", "球"], ["体育器材室找我，借球登记一下。"]),
        K(["加油", "紧张", "比赛"], ["别紧张，正常发挥，你训练量够了。"]),
        K(["作业", "考试"], ["我体育还行，文化课……求带。"])
      ],
      fallback: ["收到！", "行，没问题。", "操场见！"]
    }),
    B("wang", "王老师", "👩‍🏫", "linear-gradient(135deg,#f6c89a,#e8a866)", "班主任 · 语文",
      "先把今天的默写过了。", 1, {
      greeting: ["同学，作业、作息、身体，有任何困难都可以跟老师说。"],
      bank: [
        K(["默写", "背诵", "茅屋", "岳阳楼", "作业"], ["今晚再读两遍，明天默写重点句。"]),
        K(["成绩", "退步", "考差", "压力", "焦虑"], ["一次成绩说明不了什么。我们一起分析错题，把节奏找回来。"]),
        K(["矛盾", "同学", "吵架", "被欺负", "霸凌"], ["发生这种事第一时间告诉老师，不要一个人扛。"]),
        K(["身体", "生病", "不舒服", "请假"], ["不舒服就去医务室，别硬撑，健康最重要。"]),
        K(["目标", "大学", "志愿", "未来"], ["目标要具体到能写在纸上。你想考哪所学校？老师帮你规划。"]),
        K(["恋爱", "早恋", "喜欢", "表白"], ["老师不反对正常的好感，但希望你们把它变成一起变好的动力。"]),
        K(["社团", "活动", "运动会"], ["活动要参加，但不能影响学习，时间要安排好。"])
      ],
      fallback: ["好的，老师知道了。", "这件事下课到办公室，我们单独聊。", "注意劳逸结合，有问题随时找老师。"]
    }),
    B("radio", "校园广播站", "📢", "linear-gradient(135deg,#8fb9f2,#6ea0ec)", "官方 · 通知",
      "铜鉴湖畔，西子之声。", 1, {
      greeting: ["这里是西子校园广播站，投稿、点歌、失物招领都可以发消息给我们。"],
      bank: [
        K(["投稿", "加油稿", "点歌", "失物", "招领", "通知"], ["请把投稿内容和班级姓名发给我，播出时段为午间与傍晚。"]),
        K(["运动会", "开幕式"], ["本周四 14:30 秋季运动会开幕式，请各班穿校服、提前在操场列队。"]),
        K(["铃声", "作息", "时间表"], ["早自习 7:20，放学 16:25，晚自习结束 21:50，注意作息。"]),
        K(["失物", "丢", "捡到"], ["请描述物品与遗失地点，我们登记后会广播。"])
      ],
      fallback: ["收到，已登记。", "请关注广播站后续通知。", "如需点歌，请提供歌曲名与想说的话。"]
    }),
    B("canteen", "西子食堂", "🍲", "linear-gradient(135deg,#ffd6a0,#f5b07a)", "官方 · 食堂",
      "今日也要光盘哦。", 1, {
      greeting: ["今日菜单、窗口上新、失物都会在这里发布，记得按时吃饭～"],
      bank: [
        K(["菜单", "今天吃", "有什么", "窗口", "上新"], ["今日窗口：糖醋里脊、番茄牛腩、麻辣香锅（不辣/微辣可选）。"]),
        K(["价格", "多少钱", "刷卡", "饭卡"], ["刷卡即可，套餐 8-15 元，有问题到窗口找值班老师。"]),
        K(["挑食", "减肥", "不吃饭"], ["学生要均衡营养，别不吃正餐，少喝碳酸饮料哦。"]),
        K(["丢", "捡到", "饭卡", "失物"], ["捡到物品请送到一楼服务台，报失也在那里。"]),
        K(["评价", "好吃", "难吃", "排队"], ["谢谢你的反馈，我们会转达给窗口。排队请耐心，错峰更快。"])
      ],
      fallback: ["开饭时间：早餐 7:00、午餐 11:50、晚餐 17:40。", "记得光盘行动，按需取餐～"]
    }),
    B("aiza", "西子小助手", "🤖", "linear-gradient(135deg,#7fd1ae,#7cc4e8)", "AI · 校园百事通",
      "校园生活，没有我不知道的。", 1, {
      greeting: ["你好，我是西子小助手！作业、考试、作息、感情、游戏、攻略……尽管问。"],
      bank: [],
      fallback: [
        "这个问题我记下了，你也可以换个说法，比如“作业好难”“想吃什么”“心情不好”。",
        "我能聊校园生活的方方面面：作业、考试、同学、食堂、运动、心情……直接问我就行。",
        "嗯……要不你从“今天怎么样”“在干嘛”这类话题开始？"
      ]
    })
  ];

  /* ---- 全局意图匹配（基于 XZ_AI_INTENTS，500+ 意图） ---- */
  var intentCache = null;
  function allIntents() {
    if (intentCache) return intentCache;
    try {
      intentCache = window.XZ_AI_INTENTS || [];
    } catch (e) { intentCache = []; }
    return intentCache;
  }
  function pickReplyFromIntent(intent, warm) {
    if (!intent) return null;
    var rep = intent.rep;
    var arr;
    if (rep) {
      if (Array.isArray(rep)) arr = rep;
      else if (warm === 2 && rep.warm && rep.warm.length) arr = rep.warm;
      else if (warm === 0 && rep.cold && rep.cold.length) arr = rep.cold;
      else if (rep.mid && rep.mid.length) arr = rep.mid;
      else arr = rep.warm || rep.mid || rep.cold;
    }
    if (!arr || !arr.length) {
      if (intent.ans) arr = Array.isArray(intent.ans) ? intent.ans : [intent.ans];
    }
    if (!arr || !arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function matchIntent(text) {
    var list = allIntents();
    var best = null, bestLen = 0;
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      var kws = it.kws || [];
      for (var j = 0; j < kws.length; j++) {
        var kw = String(kws[j]);
        if (kw && text.indexOf(kw) >= 0 && kw.length > bestLen) {
          best = it; bestLen = kw.length;
        }
      }
    }
    return best;
  }

  /* 联系人专属话题 */
  function contactBankReply(contact, text) {
    for (var i = 0; i < contact.bank.length; i++) {
      var item = contact.bank[i];
      for (var j = 0; j < item.kws.length; j++) {
        if (text.indexOf(item.kws[j]) >= 0) {
          return item.reps[Math.floor(Math.random() * item.reps.length)];
        }
      }
    }
    return null;
  }

  /* 主回复函数 */
  function reply(contact, text) {
    text = String(text || "").trim();
    /* 纯表情/语气 */
    if (!text) return contact.fallback[0];
    /* 1) 联系人专属 */
    var personal = contactBankReply(contact, text);
    if (personal) return personal;
    /* 2) 小助手 & 所有人：走全局 500+ 意图 */
    var intent = matchIntent(text);
    if (intent) {
      /* 对“喜欢/恋爱”等敏感意图，女主要更贴合人设，这里允许全局暖回复 */
      var r = pickReplyFromIntent(intent, contact.warm);
      if (r) return r;
    }
    /* 3) 兜底 */
    if (contact.fallback.length) return contact.fallback[Math.floor(Math.random() * contact.fallback.length)];
    return "嗯嗯，我在听。";
  }

  window.X565WXData = {
    contacts: contacts,
    byId: function (id) {
      for (var i = 0; i < contacts.length; i++) if (contacts[i].id === id) return contacts[i];
      return contacts[0];
    },
    reply: reply,
    matchIntent: matchIntent
  };
})();


/* ===== p53_wxdata2.js ===== */
/* ============================================================================
   p53 · 手机微信数据扩充（紧随 p52 立即执行）
   · 新增 3 位剧情女主联系人：陆知意 / 颜汐 / 唐糖
   · 为全部 16 位联系人补充大量校园话题，全部能聊、贴合人设
   ============================================================================ */
(function () {
  var D = window.X565WXData;
  if (!D || !D.contacts) return;
  var has = {};
  D.contacts.forEach(function (c) { has[c.id] = 1; });
  function K(kws, reps) { return { kws: kws, reps: reps }; }
  function B(id, name, emoji, bg, tag, sig, warm, opt) {
    opt = opt || {};
    return { id: id, name: name, emoji: emoji, bg: bg, tag: tag, sig: sig,
      warm: warm, greeting: opt.greeting || [], bank: opt.bank || [],
      fallback: opt.fallback || [], sys: opt.sys || "" };
  }
  function add(id, kws, reps) {
    var c = D.byId(id);
    if (c) c.bank.push(K(kws, reps));
  }
  function addContact(o) { if (!has[o.id]) { D.contacts.push(o); has[o.id] = 1; } }

  /* ─────────────────────────────────────────────────────────────
     新增三位剧情女主
     ───────────────────────────────────────────────────────────── */
  addContact(B("lu", "陆知意", "🔔", "linear-gradient(135deg,#9db4f5,#7c9cf0)", "学生会长 · 干练",
    "事情总要有人做，我来。", 2, {
    sys: "陆知意通过了好友验证（学生会会长 · 高二1班）。",
    greeting: ["我是陆知意，学生会会长。活动方案有问题直接找我，别拖。"] },
    ));
  var lu = D.byId("lu");
  lu.bank = [
    K(["学生会", "会长", "会长很忙", "执勤"], ["会里事多，习惯了。你要是有空，可以来帮忙，我不白用。", "执勤是常规，别违纪就行。"]),
    K(["方案", "活动", "流程", "预算", "文化节"], ["方案我改到很晚，你帮我看一遍，逻辑你比我清楚。", "预算对不上，你帮我核一下，我头都大了。"]),
    K(["认真", "严格", "不近人情", "凶"], ["我知道有人说我不近人情。但规则要是松了，最后累的是认真的人。", "我不是凶，我是怕做不好。"]),
    K(["逞强", "熬夜", "生病", "休息", "别硬撑"], ["……我没逞强。（停顿）好吧，就这一次，听你的。", "你总看穿我。我会早点睡，你也是。"]),
    K(["红袖章", "登记", "校服", "仪容"], ["校服是规定，我也不例外。你别想走后门。", "登记本不是为了为难谁，是让每个人都一样。"]),
    K(["副会长", "搭档", "别的女生", "吃醋"], ["副会长只是工作搭档，我把流程交给他而已。", "……我解释这些干什么，你想听就听。"]),
    K(["喜欢", "在意", "表白", "在一起"], ["你这么说，我需要认真考虑。我做决定很慢，但不会敷衍。", "我会认真的。你别后悔。"]),
    K(["晚安", "睡", "早点休息"], ["晚安，方案我收了，你也早点睡。", "今天谢谢你，真的。"]),
    K(["早餐", "吃饭", "食堂"], ["我经常忙到错过饭点。（小声）你要是顺路，帮我带一份。"]),
    K(["累", "压力", "撑不住", "难过"], ["撑不住就说出来，别一个人扛。我帮你拆，就像你帮我那样。"]),
    K(["天台", "晚霞", "结束"], ["活动结束那天，陪我去天台看晚霞吧。我有话想对你说。"]),
    K(["目标", "理想", "未来", "大学"], ["我想把每件事都做好，包括自己。你呢？你的目标是什么？"]),
    K(["检查", "纪律", "扣分", "迟到"], ["迟到会扣分，别让我为难，我不想在登记本上写你名字。"]),
    K(["笑话", "开心", "放松", "笑一个"], ["（板着脸）……我不会讲笑话。但你可以讲给我听。"])
  ];
  lu.fallback = ["嗯，我记下了。", "说重点。", "我会处理，你别担心。", "认真的，我听着呢。"];

  addContact(B("yan", "颜汐", "🎤", "linear-gradient(135deg,#ffc09e,#ff9a76)", "校园广播站 · 主播",
    "把你的点歌，放在最后。", 2, {
    sys: "颜汐通过了好友验证（校园广播站主播）。",
    greeting: ["你好呀，我是颜汐，广播站的。欢迎来点歌，我会念给你听。"] },
    ));
  var yan = D.byId("yan");
  yan.bank = [
    K(["广播", "主播", "广播室", "话筒", "点歌"], ["傍晚那段我值班，你要是点歌，我把它放在最后。", "话筒推上去之前我会紧张，虽然听不出来。"]),
    K(["歌", "音乐", "耳机", "歌单", "听歌"], ["这首歌适合发呆，你试试。", "我把耳机分你一只，别嫌我品味。"]),
    K(["声音", "好听", "温柔", "念稿"], ["你是第一个当面夸我声音的人。（小声）再夸一句？", "念煽情的段落我会先把自己念哭，别笑。"]),
    K(["停电", "怕黑", "雨夜", "暴雨"], ["停电那次，谢谢你握着我的手。我现在还觉得，很暖。", "我不怕黑了，因为那时候有你在。"]),
    K(["别人点歌", "吃醋", "情歌", "误会"], ["那些情歌是后勤老师的侄子点的谢礼，我念得很官方的。笨蛋。", "情歌我只想播给你一个人。"]),
    K(["直播", "红灯", "全校", "广播表白"], ["红灯亮着的时候我不敢说，后来才发现，我只想让你听见。"]),
    K(["夕阳", "傍晚", "看夕阳", "黄昏"], ["傍晚广播配夕阳，是我一天里最放松的时刻。你要是在就更好。"]),
    K(["录", "自然", "风声", "落叶", "声音素材"], ["我在收集秋天的声音，你来踩落叶，沙沙的很好听。"]),
    K(["喜欢", "在意", "表白", "在一起"], ["……那这段，不许录，也不许笑。我好像，也喜欢你。"]),
    K(["晚安", "睡", "明天见"], ["晚安，明早的广播记得听，有彩蛋。"]),
    K(["感冒", "嗓子", "喉咙", "不舒服"], ["嗓子哑了就不能播了，我会多喝热水。你也是。"]),
    K(["难过", "安慰", "累"], ["我给你读一段吧，什么都不用说，闭着眼睛听。"]),
    K(["朗诵", "稿子", "主持", "朗读"], ["主持稿我改了好几遍，你帮我听听停顿对不对。"]),
    K(["食堂", "吃饭", "占座"], ["我吃饭也在听音乐，你来了我就摘下一只耳机。"])
  ];
  yan.fallback = ["嗯嗯，我在听哦。", "你说，我记下来。", "这句话我可以播给全校听吗？", "嘿嘿，真的吗。"];

  addContact(B("tang", "唐糖", "🍰", "linear-gradient(135deg,#fbd89a,#f6c177)", "烘焙社 · 软萌",
    "最成功的一块，给最重要的人。", 2, {
    sys: "唐糖通过了好友验证（烘焙社 · 双马尾）。",
    greeting: ["我是唐糖！下次烤成功的点心，第一块给你尝！"] },
    ));
  var tang = D.byId("tang");
  tang.bank = [
    K(["烘焙", "蛋糕", "甜点", "饼干", "面包", "做"], ["我今天在练习裱花，你帮我扶着转盘好不好？", "失败的也别浪费，我会重新烤成功的。"]),
    K(["好吃", "尝", "试吃", "甜"], ["真的好吃吗？（眼睛亮）那最大的给你！", "你说好吃，我就特别有动力。"]),
    K(["奶油", "面粉", "草莓", "裱花", "烤箱"], ["我又把奶油抹到鼻尖了，你别笑。", "烤箱温度要靠感觉，我教你。"]),
    K(["生日", "蛋糕", "生日蛋糕", "庆生"], ["生日蛋糕我做了心形草莓，你发现了吗？", "你的生日我一定要亲手做蛋糕。"]),
    K(["义卖", "校庆", "烘焙社", "摊位"], ["校庆义卖我做了一个不卖的小蛋糕，上面写了两个字，你猜。"]),
    K(["烤糊", "失败", "失手", "没做好"], ["第一次那盘是意外啦！现在我已经很稳了。", "烤糊了你也吃了，我那时候就想，要一直给你做成功的。"]),
    K(["喜欢", "在意", "表白", "在一起"], ["（脸红）我、我把心意写在蛋糕上了，你看清楚了吗？", "我的甜点，只给你一个人做。"]),
    K(["给别人", "误会", "别人的", "吃醋"], ["那个是谢礼啦！我帮人搬烤箱才做的。心意只有一份。"]),
    K(["桂花", "桂花糕", "摘桂花"], ["我在摘桂花做桂花糕，第一块给你，拉钩。"]),
    K(["晚安", "睡", "明天"], ["晚安，明天我做新口味给你！"]),
    K(["早餐", "牛奶", "能量", "吃"], ["早上别空着肚子，我给你留了小饼干。"]),
    K(["难过", "安慰", "累", "哭"], ["不哭不哭，我给你做个甜甜的，吃了就开心啦。"]),
    K(["运动会", "跑步", "加油"], ["你跑完我给你送水和爱心饼干，别找错人哦。"]),
    K(["胖", "减肥", "长胖"], ["减肥哪有甜点重要！（认真）你一点都不胖，我不许你说。"]),
    K(["天气", "下雨", "好冷"], ["下雨就在家政教室做热乎的，你来，我给你留着。"])
  ];
  tang.fallback = ["嘿嘿，你接着说。", "要不要尝一口？", "你真好～", "我记下来啦，下次做给你！"];

  /* ─────────────────────────────────────────────────────────────
     为原 13 位联系人补充话题（贴合各自人设）
     ───────────────────────────────────────────────────────────── */
  /* 林晚 · 温柔文艺 */
  add("lin", ["早读", "晨读", "上课", "第一节课"], ["早读我会提前十分钟到，你别迟到。"]);
  add("lin", ["考试", "月考", "成绩", "分数"], ["分数别太在意，我们一起把错题弄懂。"]);
  add("lin", ["同桌", "座位", "前桌", "坐你前面"], ["做你前桌挺开心的，转身就能看见你。"]);
  add("lin", ["食堂", "吃饭", "排队", "午饭"], ["午饭人多，你要是先到，帮我占个位置好不好。"]);
  add("lin", ["睡觉", "困", "打盹", "晚自习"], ["晚自习困了就洗把脸，我陪你一起坚持。"]);
  add("lin", ["喜欢的书", "小说", "散文", "图书馆"], ["图书馆靠窗的位置最好，我帮你占。"]);
  add("lin", ["周末", "放假", "去哪玩"], ["周末我想去书店，你要是愿意，陪我逛逛？"]);
  add("lin", ["天气", "晴天", "阳光", "风"], ["今天风很好，我读了一首诗，第一个想给你听。"]);
  add("lin", ["谢谢", "感谢", "帮我"], ["你不用总谢我，能帮上你，我也开心。"]);
  add("lin", ["对不起", "抱歉", "迟到了"], ["没关系，下次注意就好，别放在心上。"]);
  add("lin", ["加油", "努力", "坚持"], ["嗯，一起加油，我在你前桌呢。"]);
  add("lin", ["生日", "礼物", "想要什么"], ["你记得我生日？（小声）那我想让你写一首诗给我。"]);

  /* 赵小雨 · 美术 */
  add("zhao", ["画板", "颜料", "画笔", "速写", "调色"], ["画板太重了，你帮我背嘛，回头给你画一张。"]);
  add("zhao", ["画展", "美术展", "作品", "展览"], ["画展我有一张参展，你一定要来，我不告诉你是哪张。"]);
  add("zhao", ["涂鸦", "恶搞", "画你", "画像"], ["我把你画成了鬼脸，哈哈哈，别生气！（其实偷偷画了认真的）"]);
  add("zhao", ["恶作剧", "捉弄", "玩笑"], ["捉弄你才好玩嘛，别人我还懒得理。"]);
  add("zhao", ["颜色", "配色", "色彩", "蓝色"], ["你在我心里是那种很暖的蓝色，像晴天。"]);
  add("zhao", ["美术室", "画室", "画室没人"], ["放学后画室没人，你来看我画画？给你留个苹果当模特。"]);
  add("zhao", ["困", "熬夜", "没睡"], ["熬夜赶稿呢，你帮我带杯热可可，我让你看半成品。"]);
  add("zhao", ["喜欢", "表白", "在一起"], ["（停顿）我恶作剧这么久，你还没看出来我喜欢你？笨蛋。"]);
  add("zhao", ["吃醋", "别人", "别的女生"], ["你跟谁学画画呢？（小声）我画得比她好。"]);
  add("zhao", ["周末", "写生", "外出"], ["周末我去湖边写生，你帮我扛画架，我请你吃冰棍。"]);
  add("zhao", ["画材", "买颜料", "文具店"], ["颜料用完了，陪我去文具店，我砍价你拎包。"]);

  /* 苏清颜 · 钢琴学霸 */
  add("su", ["钢琴", "琴键", "曲子", "弹琴", "伴奏"], ["琴键是有温度的，我练熟了弹给你听。"]);
  add("su", ["年级第一", "学霸", "第一", "排名"], ["第一不是理所当然，是我比别人多练了很多遍。"]);
  add("su", ["自习", "刷题", "图书馆", "学习"], ["我在图书馆老位置，你要来自习，我给你留座。"]);
  add("su", ["不会", "教我", "这道题", "怎么解"], ["这道题我给你讲，你先把已知条件列出来。"]);
  add("su", ["乐理", "考级", "比赛", "演奏"], ["比赛那天，你会来吗？我想在观众席看到你。"]);
  add("su", ["高冷", "话少", "冷漠", "难接近"], ["我只是话慢，不是冷。你在的话，我可以多说一点。"]);
  add("su", ["喜欢", "表白", "在一起"], ["等我弹完这首，你再说一遍。（停顿）我也是。"]);
  add("su", ["雨", "琴房", "伞"], ["下雨我会把琴谱盖好，你要是也在琴房，一起走？"]);
  add("su", ["难过", "考砸", "失误"], ["一次失误不代表什么，我陪你把原因找出来。"]);
  add("su", ["休息", "别学了", "睡"], ["你也别熬太晚。我停琴了，你也合上书。"]);

  /* 许念 · 体育 */
  add("xu", ["篮球", "打球", "投篮", "后卫", "三分"], ["放学问我球场，我让你三球，赢了请你喝水。"]);
  add("xu", ["运动会", "体测", "训练", "校队"], ["运动会我报名了，你来看我比赛，给我加油。"]);
  add("xu", ["跑步", "晨跑", "圈数", "耐力"], ["晨跑六圈，你能跟几圈？跟不动我拉你。"]);
  add("xu", ["受伤", "崴脚", "擦伤", "摔"], ["让我看看，别动，我带你去医务室。打球哪有不受伤的。"]);
  add("xu", ["短发", "像男生", "女生"], ["短发怎么了，照样把你打趴下！（笑）"]);
  add("xu", ["哥们", "兄弟", "仗义"], ["你是我兄弟，你的事就是我的事。"]);
  add("xu", ["喜欢", "表白", "在一起"], ["……你这么说我会当真。（小声）其实我也喜欢你。"]);
  add("xu", ["补课", "作业", "学习"], ["我学习不如你，你教我，我教你打球，公平。"]);
  add("xu", ["水", "运动饮料", "补水"], ["打完球记得补水，我这儿多一瓶，给你。"]);
  add("xu", ["比赛", "决赛", "赢了", "输了"], ["赢了一起庆祝，输了我请你撸串，别闷闷不乐。"]);

  /* 沈知夏 · 青梅竹马 */
  add("shen", ["发小", "小时候", "幼儿园", "邻居", "一起长大"], ["你三岁尿床我都记得，别想装成熟。"]);
  add("shen", ["早餐", "老地方", "校门口", "柱子"], ["两份早餐我买好了，老地方，再不来凉了。"]);
  add("shen", ["嘴硬", "凶我", "吵架"], ["我嘴硬是习惯，心里哪次没帮你？"]);
  add("shen", ["吃醋", "别人", "追你"], ["谁追你？（停顿）我就是问问，你别随便答应。"]);
  add("shen", ["喜欢", "表白", "在一起"], ["我们认识十几年，你现在才说？……其实我等更久。"]);
  add("shen", ["占座", "食堂", "糖醋里脊"], ["食堂位置我占了，再不来糖醋里脊没了。"]);
  add("shen", ["难过", "安慰", "累"], ["走，带你去吃小时候那家店，我请。"]);
  add("shen", ["下雨", "伞", "淋"], ["你又没带伞？（叹气）过来，一起走，别淋着。"]);
  add("shen", ["作业", "没写", "抄"], ["别抄我的，我给你讲一遍，下次自己写。"]);
  add("shen", ["周末", "回家", "阿姨", "你妈"], ["你妈让我叫你回家吃饭，做了你爱吃的。"]);

  /* 陈墨 · 男同学体委 */
  add("chen", ["篮球", "打球", "三分", "球场"], ["放学球场，五个人，就差你，快点！"]);
  add("chen", ["体测", "一千", "八百", "引体向上"], ["体测别怕，我带你练，包你及格。"]);
  add("chen", ["游戏", "开黑", "组队", "排位"], ["晚上开黑，你打辅助，我carry。"]);
  add("chen", ["作业", "抄", "没写", "数学"], ["数学借我看看？我也没写，咱俩一起找学霸。"]);
  add("chen", ["累", "困", "烦"], ["累啥，体育课干一场，出完汗就好了。"]);
  add("chen", ["食堂", "加菜", "鸡腿"], ["今天有鸡腿，快去晚了没了！"]);

  /* 周屿 · 数学课代表 */
  add("zhou", ["数学", "函数", "几何", "导数", "压轴"], ["压轴题我整理了三种解法，下课给你看。"]);
  add("zhou", ["竞赛", "奥赛", "奥数", "刷题"], ["竞赛班周末有课，你要不要一起，我给你占位。"]);
  add("zhou", ["作业", "订正", "错题", "没听懂"], ["错题本要分类，别只抄答案。我把我的借你。"]);
  add("zhou", ["考试", "分数", "名次", "发挥"], ["这次你进步了，我看到了，别谦虚。"]);
  add("zhou", ["公式", "背", "记不住", "定理"], ["公式别死背，自己推一遍，比背十遍都牢。"]);

  /* 徐甜甜 · 课代表 */
  add("tian", ["作业", "收作业", "没交", "补交"], ["作业今天必须收齐，你可别让我难做。"]);
  add("tian", ["英语", "单词", "听写", "背诵"], ["听写我会划重点，你背这些就行。"]);
  add("tian", ["笔记", "课件", "资料", "PPT"], ["课件我发群里了，你注意查收。"]);
  add("tian", ["喜欢", "表白", "在一起"], ["……这种话别在催作业的时候说！我会分心的。"]);
  add("tian", ["生日", "礼物"], ["你记得我生日？那我想要一个新的笔记本。"]);

  /* 吴昊 · 同桌 */
  add("wu", ["同桌", "划界", "三八线", "借东西"], ["喂，橡皮借我。（小声）还有，别越界。"]);
  add("wu", ["作业", "抄", "帮忙", "听课"], ["上课别睡，老师看过来了，我踢你。"]);
  add("wu", ["零食", "辣条", "薯片", "分享"], ["辣条分你一半，别告诉老师。"]);
  add("wu", ["暗恋", "喜欢", "表白"], ["我偷偷告诉你，我喜欢隔壁班的，你别传！"]);
  add("wu", ["游戏", "开黑", "账号"], ["放学我带你飞，老时间。"]);

  /* 老王 · 班主任 */
  add("wang", ["成绩", "下滑", "退步", "状态"], ["成绩是结果，状态是原因，你最近状态不对，跟我说说。"]);
  add("wang", ["请假", "病假", "不舒服", "回家"], ["身体不舒服先去医务室，别硬撑。"]);
  add("wang", ["早恋", "恋爱", "在一起", "影响"], ["青春期有好感很正常，但要把握分寸，别耽误彼此。"]);
  add("wang", ["目标", "大学", "理想", "志愿"], ["目标可以高一点，但脚下的路要一步步走。"]);
  add("wang", ["纪律", "违纪", "处分", "通报"], ["别在纪律上栽跟头，那是最不值的。"]);
  add("wang", ["鼓励", "压力", "焦虑", "考差"], ["考差不可怕，可怕的是不敢面对。老师相信你。"]);
  add("wang", ["家长", "请家长", "家校"], ["你父母关心你，只是方式你不一定喜欢。"]);

  /* 校园广播 · 服务号 */
  add("radio", ["失物", "丢了", "捡到", "招领"], ["失物请到一楼广播室登记，记得说清特征。"]);
  add("radio", ["点歌", "放歌", "祝福", "生日"], ["点歌请注明送给谁和祝福，我们会在傍晚时段播出。"]);
  add("radio", ["寻物", "饭卡", "钥匙", "校牌"], ["捡到饭卡的同学请交到广播室，谢谢。"]);
  add("radio", ["通知", "活动", "比赛", "报名"], ["最新活动通知以公告栏为准，也可以问我。"]);

  /* 食堂 · 服务号 */
  add("canteen", ["今天", "菜单", "吃什么", "菜"], ["今天有糖醋里脊、可乐鸡翅和小炒，还有例汤。"]);
  add("canteen", ["营业时间", "几点", "开门", "关门"], ["早餐 6:40-7:30，午餐 11:30-12:30，晚餐 17:00-18:00。"]);
  add("canteen", ["充值", "饭卡", "余额", "挂失"], ["饭卡充值在食堂西侧窗口，挂失去后勤处。"]);
  add("canteen", ["忌口", "辣", "素", "清真"], ["有素菜窗口，辣的菜会标注，注意看。"]);

  /* 西子小助手 · 补充常见校园问题 */
  add("aiza", ["厕所在哪", "卫生间", "洗手间", "在哪栋"], ["教学楼每层走廊尽头都有，操场旁看台下面也有。"]);
  add("aiza", ["医务室", "看病", "校医", "发烧"], ["医务室在行政楼一层东侧，发烧先量体温再联系老师。"]);
  add("aiza", ["社团", "招新", "社团活动", "报名"], ["社团招新在开学第二周，广场摆摊，喜欢就去填报名表。"]);
  add("aiza", ["图书馆", "借书", "还书", "开放时间"], ["图书馆开放到 21:00，借书刷校牌，一次最多借 5 本。"]);
  add("aiza", ["作息", "起床", "熄灯", "几点睡"], ["早自习 7:10，晚自习到 21:30，宿舍 22:30 熄灯。"]);
  add("aiza", ["快递", "取件", "菜鸟", "包裹"], ["快递点在北门西侧，凭取件码扫码领取。"]);
  add("aiza", ["宿舍", "查寝", "热水", "洗衣机"], ["宿舍热水 17:00-22:30，洗衣机在一楼，查寝 22:30。"]);
  add("aiza", ["选课", "选科", "物化地", "物化生", "史政"], ["选科看兴趣也看优势，建议结合目标专业反推，别只看当下。"]);
  add("aiza", ["心理", "压力大", "焦虑", "失眠", "想哭"], ["压力大很正常，学校心理室在综合楼，倾诉是保密的。"]);
  add("aiza", ["奖学金", "贫困生", "补助", "申请"], ["助学金和奖学金政策去学生处问，材料我可以列给你。"]);
  add("aiza", ["打印", "复印", "打印店", "打资料"], ["打印店在图书馆负一层，也可以找老师帮忙打印。"]);
  add("aiza", ["公交", "地铁", "回家路线", "怎么坐车"], ["北门有公交站，直达地铁站；具体路线告诉我你家地址。"]);
  add("aiza", ["天气", "明天", "下雨", "带伞"], ["看天气预报，明早可能有雨，出门带伞。"]);
})();


/* ===== p50_wechat.js ===== */
/* ============================================================================
   模块六 · 手机微信（外壳 / 聊天列表 / 聊天窗）
   与 AI 聊天（XZ_AI_INTENTS + 人设）、朋友圈（X565WXMoments）数据互通
   ============================================================================ */
register("wechat", function () {
  var D = window.X565WXData;
  if (!D) return;

  var WX = {
    KEY: "xz565_wx_v1",
    view: "list",
    cur: null,
    data: null,
    typer: null,
    defaultData: function () {
      return { msgs: {}, unread: {}, seeded: false, myName: "" };
    },
    load: function () {
      if (this.data) return this.data;
      try {
        var raw = storageGet(this.KEY);
        this.data = raw ? JSON.parse(raw) : this.defaultData();
      } catch (e) { this.data = this.defaultData(); }
      if (!this.data.msgs) this.data.msgs = {};
      if (!this.data.unread) this.data.unread = {};
      return this.data;
    },
    save: function () { try { storageSet(this.KEY, JSON.stringify(this.data)); } catch (e) {} },
    myName: function () {
      var inp = $("fName");
      var n = (inp && inp.value) ? inp.value.trim() : "";
      if (n) { this.data.myName = n; this.save(); }
      return this.data.myName || "我";
    },
    /* 首次：给每个联系人塞一条招呼（像刚加好友的微信） */
    seed: function () {
      var d = this.load();
      if (d.seeded) return;
      d.seeded = true;
      var now = Date.now();
      D.contacts.forEach(function (c, i) {
        if (c.greeting && c.greeting.length) {
          d.msgs[c.id] = c.greeting.map(function (g, k) {
            return { from: "them", text: g, t: now - (D.contacts.length - i) * 420000 - k * 60000 };
          });
          /* 官方号和部分女主给未读，其余已读 */
          if (["lin", "zhao", "radio", "canteen", "aiza", "shen"].indexOf(c.id) >= 0) d.unread[c.id] = 1;
        }
      });
      this.save();
    },
    nowHM: function (t) {
      var d = new Date(t || Date.now());
      var h = d.getHours(), m = d.getMinutes();
      return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
    },
    /* ─────────────── 外壳 ─────────────── */
    ensureShell: function () {
      var el = $("x565Phone");
      if (el) return el;
      el = document.createElement("div");
      el.id = "x565Phone";
      el.innerHTML =
        '<div class="wx-screen">' +
          '<div class="wx-statusbar"><span id="wxClock">--:--</span><span>📶 📡 🔋</span></div>' +
          '<div class="wx-navbar" id="wxNavbar">' +
            '<button class="wx-nav-back" id="wxBack" style="display:none">‹</button>' +
            '<span id="wxTitle">微信</span>' +
            '<button class="wx-nav-more" id="wxMore" style="display:none">···</button>' +
          '</div>' +
          '<div class="wx-content" id="wxContent"></div>' +
          '<div class="wx-tabbar" id="wxTabbar">' +
            '<button class="wx-tab active" data-tab="chats"><span class="wx-tab-ic">💬</span>微信<span class="wx-tab-dot" id="wxTabChatDot" style="display:none"></span></button>' +
            '<button class="wx-tab" data-tab="contacts"><span class="wx-tab-ic">👥</span>通讯录</button>' +
            '<button class="wx-tab" data-tab="moments"><span class="wx-tab-ic">🌈</span>朋友圈</button>' +
            '<button class="wx-tab" data-tab="me"><span class="wx-tab-ic">😀</span>我</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(el);
      var self = this;
      /* 委托：tabbar */
      on($("wxTabbar"), "click", function (e) {
        var t = e.target.closest(".wx-tab");
        if (t) { self.tab(t.getAttribute("data-tab")); }
      });
      on($("wxBack"), "click", function () { self.back(); });
      on($("wxMore"), "click", function () { self.chatMore(); });
      /* 内容区委托（列表 / 通讯录 / 聊天 / 我） */
      on($("wxContent"), "click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var open = t.closest("[data-open-chat]");
        if (open) { self.openChat(open.getAttribute("data-open-chat")); return; }
        var send = t.closest("#wxSend");
        if (send) { self.sendInput(); return; }
        var act = t.closest("[data-wx-act]");
        if (act) { self.handleMeAct(act.getAttribute("data-wx-act")); return; }
      });
      on($("wxContent"), "keydown", function (e) {
        if (e.target && e.target.id === "wxInput" && e.key === "Enter" && !e.shiftKey) {
          e.preventDefault(); self.sendInput();
        }
      });
      /* 分享面板委托 */
      on(document, "click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var sh = t.closest("[data-wx-share]");
        if (sh) {
          if (window.X565WXMoments) X565WXMoments.openComposer(sh.getAttribute("data-wx-share") || "");
          var shmask = $("wxSheetMask"); if (shmask) shmask.classList.remove("show");
          var shsheet = $("wxSheet"); if (shsheet) shsheet.classList.remove("show");
        }
      });
      return el;
    },
    setBadge: function () {
      var d = this.load();
      var total = 0;
      for (var k in d.unread) total += d.unread[k] || 0;
      var fab = $("x565WechatFab");
      if (fab) {
        var b = fab.querySelector(".x565-wx-badge");
        if (total > 0) {
          if (!b) {
            b = document.createElement("span"); b.className = "x565-wx-badge";
            fab.appendChild(b);
          }
          b.textContent = total > 99 ? "99+" : total;
        } else if (b) b.remove();
      }
      var dot = $("wxTabChatDot");
      if (dot) dot.style.display = total > 0 ? "flex" : "none";
    },
    open: function () {
      this.load();
      this.myName();
      this.seed();
      var el = this.ensureShell();
      var c = $("wxClock");
      if (c) c.textContent = this.nowHM();
      el.classList.add("show");
      try { document.body.style.overflow = "hidden"; } catch (e) {}
      this.tab("chats");
      this.setBadge();
    },
    close: function () {
      var el = $("x565Phone");
      if (el) el.classList.remove("show");
      try { document.body.style.overflow = ""; } catch (e) {}
    },
    back: function () {
      if (this.view === "chat") { this.tab("chats"); }
      else if (this.view === "contacts" || this.view === "moments" || this.view === "me") { this.tab("chats"); }
      else this.close();
    },
    /* ─────────────── tab 切换 ─────────────── */
    tab: function (name) {
      this.view = name;
      $a(".wx-tab").forEach(function (t) {
        t.classList.toggle("active", t.getAttribute("data-tab") === name);
      });
      var back = $("wxBack"), more = $("wxMore"), tabbar = $("wxTabbar"), title = $("wxTitle");
      tabbar.style.display = "flex";
      more.style.display = "none";
      back.style.display = name === "chats" ? "none" : "flex";
      if (name === "chats") {
        title.textContent = "微信";
        back.style.display = "none";
        this.renderChatList();
      } else if (name === "contacts") {
        title.textContent = "通讯录";
        this.renderContacts();
      } else if (name === "moments") {
        title.textContent = "朋友圈";
        if (window.X565WXMoments) X565WXMoments.renderTab();
        else $("wxContent").innerHTML = '<div style="padding:30px;text-align:center;color:#999">朋友圈加载中…</div>';
      } else if (name === "me") {
        title.textContent = "我";
        this.renderMe();
      }
      try { if (window.X565WXMoments) window.X565WXMoments.setChrome(name === "moments"); } catch (e) {}
    },
    /* ─────────────── 聊天列表 ─────────────── */
    lastMsg: function (id) {
      var ms = this.data.msgs[id] || [];
      return ms.length ? ms[ms.length - 1] : null;
    },
    previewText: function (m, c) {
      if (!m) return c.sys || "开始打个招呼吧";
      var prefix = m.from === "me" ? "我: " : "";
      return prefix + m.text;
    },
    renderChatList: function () {
      var d = this.load();
      var self = this;
      var html =
        '<div class="wx-search"><div class="wx-search-inner">🔍 搜索</div></div>' +
        '<div class="wx-clist">';
      D.contacts.forEach(function (c) {
        var m = self.lastMsg(c.id);
        var un = d.unread[c.id] || 0;
        var badge = un ? '<span class="wx-clist-badge">' + (un > 99 ? "99+" : un) + '</span>'
          : '<span class="wx-clist-mute">';
        var badgeClose = un ? '' : '›</span>';
        var tm = m ? self.nowHM(m.t) : "";
        html +=
          '<div class="wx-clist-item" data-open-chat="' + c.id + '">' +
            '<div class="wx-avatar" style="background:' + c.bg + '">' + c.emoji + '</div>' +
            '<div class="wx-clist-main">' +
              '<div class="wx-clist-name">' + esc(c.name) + '</div>' +
              '<div class="wx-clist-last">' + esc(self.previewText(m, c)) + '</div>' +
            '</div>' +
            '<div class="wx-clist-right"><div class="wx-clist-time">' + tm + '</div>' +
              badge + badgeClose +
            '</div>' +
          '</div>';
      });
      html += '</div>';
      $("wxContent").innerHTML = html;
    },
    /* ─────────────── 通讯录 ─────────────── */
    renderContacts: function () {
      var html = "";
      var groups = {
        "剧情女主": ["lin", "zhao", "su", "xu", "shen", "lu", "yan", "tang"],
        "同班同学": ["chen", "zhou", "tian", "wu"],
        "老师 / 官方": ["wang", "radio", "canteen"],
        "AI 助手": ["aiza"]
      };
      Object.keys(groups).forEach(function (g) {
        html += '<div class="wx-contact-letter">' + g + '</div>';
        groups[g].forEach(function (id) {
          var c = D.byId(id);
          if (!c) return;
          html += '<div class="wx-contact" data-open-chat="' + c.id + '">' +
            '<div class="wx-avatar" style="background:' + c.bg + '">' + c.emoji + '</div>' +
            '<div class="wx-contact-name">' + esc(c.name) + '</div>' +
            '<span class="wx-contact-tag">' + esc(c.tag) + '</span></div>';
        });
      });
      $("wxContent").innerHTML = html;
    },
    /* ─────────────── 我 ─────────────── */
    renderMe: function () {
      var name = this.myName();
      var tier = window.X565Perf ? X565Perf.tier : "high";
      var tierName = { low: "省电（低配）", mid: "均衡", high: "流畅" }[tier];
      $("wxContent").innerHTML =
        '<div class="wx-me">' +
          '<div class="wx-me-head">' +
            '<div class="wx-avatar" style="width:66px;height:66px;font-size:38px;background:linear-gradient(135deg,#7fd1ae,#7cc4e8)">🧑</div>' +
            '<div><div class="wx-me-name">' + esc(name) + '</div>' +
            '<div class="wx-me-sub">西子实验学校 · 高一</div></div>' +
          '</div>' +
          '<div class="wx-me-group">' +
            '<div class="wx-me-item" data-wx-act="moments"><span class="ic">🌈</span><span class="tx">我的朋友圈</span><span class="ar">›</span></div>' +
            '<div class="wx-me-item" data-wx-act="fav"><span class="ic">⭐</span><span class="tx">收藏</span><span class="ar">›</span></div>' +
          '</div>' +
          '<div class="wx-me-group">' +
            '<div class="wx-me-item" data-wx-act="perf"><span class="ic">⚡</span><span class="tx">性能模式：' + tierName + '</span><span class="ar">›</span></div>' +
            '<div class="wx-me-item" data-wx-act="clearchat"><span class="ic">🧹</span><span class="tx">清空聊天记录</span><span class="ar">›</span></div>' +
            '<div class="wx-me-item" data-wx-act="about"><span class="ic">ℹ️</span><span class="tx">关于 5.6.5</span><span class="ar">›</span></div>' +
          '</div>' +
        '</div>';
    },
    handleMeAct: function (act) {
      if (act === "moments") { this.tab("moments"); }
      else if (act === "fav") { toast("收藏夹还没有内容，看到好的朋友圈可以收藏"); }
      else if (act === "clearchat") {
        if (confirm("确定清空所有聊天记录吗？（朋友圈内容不受影响）")) {
          this.data = this.defaultData();
          this.data.seeded = true;
          this.save();
          this.renderChatList();
          toast("已清空聊天记录");
        }
      } else if (act === "about") {
        toast("杭州西子实验学校模拟器 5.6.5 心之所向·稳定版", 2600);
      } else if (act === "perf") {
        this.cyclePerf();
      }
    },
    cyclePerf: function () {
      var order = ["high", "mid", "low"];
      var names = { high: "流畅", mid: "均衡", low: "省电（低配）" };
      var cur = storageGet("x565_perf") || (window.X565Perf ? X565Perf.tier : "high");
      var idx = order.indexOf(cur);
      var next = order[(idx + 1) % 3];
      storageSet("x565_perf", next);
      if (window.X565Perf) { X565Perf.tier = next; document.documentElement.setAttribute("data-perf", next); }
      toast("性能模式已切换为：" + names[next] + "（部分效果重开后生效）", 2000);
      this.renderMe();
    },
    /* ─────────────── 聊天窗 ─────────────── */
    openChat: function (id) {
      var c = D.byId(id);
      this.cur = id;
      this.view = "chat";
      this.data.unread[id] = 0;
      this.save();
      this.setBadge();
      var title = $("wxTitle"), back = $("wxBack"), more = $("wxMore"), tabbar = $("wxTabbar");
      title.textContent = c.name;
      back.style.display = "flex";
      more.style.display = "flex";
      tabbar.style.display = "none";
      this.renderChatView();
    },
    curContact: function () { return D.byId(this.cur); },
    renderChatView: function () {
      var c = this.curContact();
      var msgs = this.data.msgs[c.id] || [];
      var self = this;
      var html = '<div class="wx-chatview"><div class="wx-msgs" id="wxMsgs">';
      html += '<div class="wx-day"><span>今天</span></div>';
      if (c.sys) html += '<div class="wx-msg sys"><div class="wx-bubble wx-sys">' + esc(c.sys) + '</div></div>';
      msgs.forEach(function (m) {
        if (m.from === "me") {
          html += '<div class="wx-msg me"><div class="wx-avatar" style="background:linear-gradient(135deg,#7fd1ae,#7cc4e8)">🧑</div>' +
                  '<div class="wx-bubble">' + esc(m.text) + '</div></div>';
        } else {
          html += '<div class="wx-msg"><div class="wx-avatar" style="background:' + c.bg + '">' + c.emoji + '</div>' +
                  '<div class="wx-bubble">' + esc(m.text) + '</div></div>';
        }
      });
      html += '</div>' +
        '<div class="wx-quick" id="wxQuick"></div>' +
        '<div class="wx-inputbar">' +
          '<button class="wx-ib-btn" id="wxEmoji">😊</button>' +
          '<textarea id="wxInput" rows="1" placeholder="说点什么…"></textarea>' +
          '<button class="wx-send" id="wxSend">发送</button>' +
        '</div></div>';
      $("wxContent").innerHTML = html;
      this.scrollBottom();
      /* 快捷语 */
      var chips = ["在吗", "今天怎么样", "作业写了吗", "一起吃饭吗", "周末有空吗", "晚安"];
      var q = $("wxQuick");
      q.innerHTML = chips.map(function (x) { return '<button data-q="' + esc(x) + '">' + esc(x) + '</button>'; }).join("");
      on(q, "click", function (e) {
        var b = e.target.closest("[data-q]");
        if (b) {
          var inp = $("wxInput");
          inp.value = b.getAttribute("data-q");
          self.sendInput();
        }
      });
      var inp = $("wxInput");
      setTimeout(function () { try { inp.focus(); } catch (e) {} }, 60);
      /* 表情插入 */
      on($("wxEmoji"), "click", function () {
        var em = ["😀", "😂", "🥰", "😭", "😅", "👍", "🙏", "💪", "🎉", "🌹", "🔥", "☕", "🍜", "🏀"];
        var cur = inp.value;
        inp.value = cur + pick(em);
        inp.focus();
      });
    },
    scrollBottom: function () {
      var box = $("wxMsgs");
      if (box) box.scrollTop = box.scrollHeight;
    },
    pushMsg: function (id, from, text) {
      var d = this.load();
      if (!d.msgs[id]) d.msgs[id] = [];
      d.msgs[id].push({ from: from, text: text, t: Date.now() });
      this.save();
    },
    sendInput: function () {
      if (this.view !== "chat") return;
      var inp = $("wxInput");
      if (!inp) return;
      var text = inp.value.trim();
      if (!text) return;
      var id = this.cur;
      this.pushMsg(id, "me", text);
      inp.value = "";
      this.renderChatView();
      this.scheduleReply(id, text);
    },
    scheduleReply: function (id, text) {
      var self = this;
      var box = $("wxMsgs");
      if (!box) return;
      var c = D.byId(id);
      /* 正在输入 */
      var typ = document.createElement("div");
      typ.className = "wx-typing";
      typ.id = "wxTyping";
      typ.innerHTML = '<div class="wx-avatar" style="background:' + c.bg + '">' + c.emoji +
        '</div><div class="wx-bubble"><i></i><i></i><i></i></div>';
      box.appendChild(typ);
      this.scrollBottom();
      clearTimeout(this.typer);
      this.typer = setTimeout(function () {
        var replyText;
        try { replyText = D.reply(c, text); } catch (e) { replyText = pick(c.fallback) || "嗯嗯，我在听。"; }
        /* 若聊天窗已被切走，存为未读 */
        if (self.cur === id && self.view === "chat" && $("wxMsgs")) {
          var t2 = $("wxTyping"); if (t2) t2.remove();
          self.pushMsg(id, "them", replyText);
          self.renderChatView();
        } else {
          self.pushMsg(id, "them", replyText);
          self.data.unread[id] = (self.data.unread[id] || 0) + 1;
          self.save();
          self.setBadge();
        }
      }, 550 + Math.random() * 650);
    },
    chatMore: function () {
      if (this.view !== "chat") return;
      var c = this.curContact();
      var last = this.lastMsg(this.cur);
      var shareText = last ? "「和" + c.name + "的聊天」" + last.text : "和" + c.name + "的聊天记录";
      var mask = $("wxSheetMask"), sheet = $("wxSheet");
      var scr = $("x565Phone");
      /* 动态创建操作面板 */
      if (!$("wxSheetMask")) {
        mask = document.createElement("div"); mask.id = "wxSheetMask"; mask.className = "wx-sheet-mask";
        sheet = document.createElement("div"); sheet.id = "wxSheet"; sheet.className = "wx-sheet";
        scr.querySelector(".wx-screen").appendChild(mask);
        scr.querySelector(".wx-screen").appendChild(sheet);
        on(mask, "click", function () { mask.classList.remove("show"); sheet.classList.remove("show"); });
      }
      sheet.innerHTML =
        '<div class="wx-sheet-title">' + esc(c.name) + '</div>' +
        '<button data-wx-share="' + esc(shareText) + '">🌈 分享到朋友圈</button>' +
        '<button id="wxClearOne">🧹 清空与 TA 的聊天</button>' +
        '<button class="danger" id="wxSheetClose">取消</button>';
      mask.classList.add("show");
      sheet.classList.add("show");
      on($("wxSheetClose"), "click", function () { mask.classList.remove("show"); sheet.classList.remove("show"); });
      on($("wxClearOne"), "click", function () {
        self.data.msgs[self.cur] = [];
        self.save();
        mask.classList.remove("show"); sheet.classList.remove("show");
        self.renderChatView();
        toast("已清空与 " + c.name + " 的聊天");
      });
    },
    /* 外部（朋友圈/其它）主动打开某人的聊天 */
    openChatById: function (id) { this.open(); this.openChat(id); }
  };
  window.X565WX = WX;

  /* FAB */
  function ensureFab() {
    var fab = $("x565WechatFab");
    if (fab) return fab;
    fab = document.createElement("button");
    fab.id = "x565WechatFab";
    fab.title = "微信";
    fab.textContent = "💬";
    document.body.appendChild(fab);
    on(fab, "click", function () { WX.open(); });
    return fab;
  }
  ensureFab();
  WX.load();
  WX.setBadge();
  /* 周期性刷新未读角标（等回复到达时） */
  setInterval(function () { try { WX.setBadge(); } catch (e) {} }, 2000);
  /* 防御：基座切屏/重建若把 FAB 弄丢，前 20 秒持续补偿 */
  var __fabGuard = 0;
  var __fabIv = setInterval(function () {
    try {
      if (!document.getElementById("x565WechatFab")) ensureFab();
      if (++__fabGuard >= 10) { clearInterval(__fabIv); }
    } catch (e) { if (++__fabGuard >= 10) clearInterval(__fabIv); }
  }, 2000);
});


/* ===== p51_wxmoments.js ===== */
/* ============================================================================
   模块七 · 手机微信「朋友圈」（与既有 X56Moments 数据互通）
   真正可发表图文 / 点赞 / 评论 / 回复 / 删除 / 从聊天分享；
   NPC 会在发布后自动点赞评论，红点持久化。同时修复 5.6 编辑器定位按钮 bug。
   ============================================================================ */
register("wechat-moments", function () {
  var M = window.X56Moments;
  var WX = window.X565WX;
  var D = window.X565WXData;
  if (!M || !WX || !D) return;

  var MM = {
    compose: { text: "", imgs: [], loc: "" },
    commentTarget: null,
    gradients: M.gradients,
    palette: M.emojiPalette,
    reacted: {},
    feed: function () {
      var d = M.load();
      var feed = (d.myPosts || []).slice();
      M.seedFeed().forEach(function (s) { feed.push(s); });
      return feed;
    },
    who: function (id) {
      return M.npcs[id] || { name: "我", emoji: "🧑", bg: "linear-gradient(135deg,#7fd1ae,#7cc4e8)" };
    },
    renderTab: function () {
      var d = M.load();
      var myName = WX.myName();
      d.myName = myName;
      M.save();
      var self = this;
      var feed = this.feed();
      var html =
        '<div class="wx-moments">' +
          '<div class="wx-moments-cover">' +
            '<div class="wx-mc-me"><span class="wx-mc-name">' + esc(myName) + '</span>' +
            '<div class="wx-mc-av">🧑</div></div>' +
          '</div>' +
          '<div class="wx-moments-list" id="wxMomentList">';
      feed.forEach(function (m) { html += self.renderOne(m); });
      html += '<div style="text-align:center;color:#aaa;font-size:12px;padding:18px 0">—— 到底啦，点右下角相机发一条 ——</div>' +
          '</div>' +
        '</div>';
      $("wxContent").innerHTML = html;
      this.buildChrome();
      this.bind();
    },
    /* 发表按钮/评论条固定在手机外壳上，不随内容滚动 */
    buildChrome: function () {
      var screen = $("x565Phone").querySelector(".wx-screen");
      var post = $("wxMomentPost");
      if (!post) {
        post = document.createElement("button");
        post.id = "wxMomentPost"; post.className = "wx-moments-post";
        post.title = "发表动态"; post.textContent = "📷";
        screen.appendChild(post);
      }
      var bar = $("wxMomentCmt");
      if (!bar) {
        bar = document.createElement("div");
        bar.id = "wxMomentCmt"; bar.className = "wx-cmt-input";
        bar.innerHTML = '<input id="wxMomentCmtInput" placeholder="说点什么…" /><button id="wxMomentCmtSend">发送</button>';
        screen.appendChild(bar);
      }
      this.setChrome(true);
    },
    setChrome: function (show) {
      var post = $("wxMomentPost"), bar = $("wxMomentCmt");
      if (post) post.classList.toggle("show", !!show);
      if (bar && !show) bar.classList.remove("show");
    },
    photoGrid: function (imgs) {
      var self = this;
      if (!imgs || !imgs.length) return "";
      var html = '<div class="wx-mo-grid">';
      imgs.forEach(function (p) {
        var g = self.gradients[(p.g || 0) % self.gradients.length];
        html += '<div class="wx-mo-ph" style="background:' + g + '">' + (p.e || "") + '</div>';
      });
      return html + '</div>';
    },
    renderOne: function (m) {
      var d = M.load();
      var who = this.who(m.who);
      var isMine = !!m.mine;
      var likes = M.likeNames(m);
      var comments = M.comments(m);
      var lc = "";
      if (likes.length || comments.length) {
        var likesH = likes.length ? '<div class="wx-mo-likes">♥ ' +
          likes.map(function (n) { return esc(n); }).join("，") + '</div>' : "";
        var cmtsH = comments.map(function (c) {
          var to = c.to ? '<span style="color:#576b95"> 回复 ' + esc(c.to) + '</span>' : "";
          return '<div class="wx-mo-cmt"><span style="color:#576b95">' + esc(c.n) + '</span>' + to +
            '：' + esc(c.c) + '</div>';
        }).join("");
        lc = '<div class="wx-mo-lc">' + likesH + cmtsH + '</div>';
      }
      var liked = !!d.liked[m.id];
      var actions =
        '<div class="wx-mo-actions">' +
          '<button data-act="like" data-id="' + esc(m.id) + '">' + (liked ? "♥ 已赞" : "♡ 赞") + '</button>' +
          '<button data-act="cmt" data-id="' + esc(m.id) + '">评论</button>' +
          (isMine ? '<button class="danger" data-act="del" data-id="' + esc(m.id) + '">删除</button>' : "") +
        '</div>';
      return '<div class="wx-moment" data-id="' + esc(m.id) + '">' +
        '<div class="wx-mo-av" style="background:' + who.bg + '">' + who.emoji + '</div>' +
        '<div class="wx-mo-body">' +
          '<div class="wx-mo-name">' + esc(who.name) + '</div>' +
          '<div class="wx-mo-text">' + esc(m.text || "") + '</div>' +
          this.photoGrid(m.imgs) +
          (m.loc ? '<div style="font-size:12px;color:#888;margin-top:3px">📍 ' + esc(m.loc) + '</div>' : "") +
          lc +
          '<div class="wx-mo-time">' + esc(m.time || "") + '</div>' +
          actions +
        '</div></div>';
    },
    bind: function () {
      var self = this;
      var root = $("wxContent");
      /* 持久元素只绑定一次：renderTab 会反复重建 innerHTML 并再次调用 bind，
         若重复绑定，点赞会被翻转偶数次（表现为“点了没反应”）、评论重复发送 */
      if (root && !root.dataset.wxBound) {
        root.dataset.wxBound = "1";
        on(root, "click", function (e) {
          var t = e.target;
          if (!t || !t.closest) return;
          var b = t.closest("[data-act]");
          if (b) {
            var act = b.getAttribute("data-act");
            var id = b.getAttribute("data-id");
            if (act === "like") self.toggleLike(id);
            else if (act === "cmt") self.openCommentBar(id, null);
            else if (act === "del") self.confirmDelete(id);
            return;
          }
          /* 点击评论名字 → 回复 */
          var nm = t.closest(".wx-mo-cmt span");
          if (nm) {
            var card = t.closest(".wx-moment");
            if (card) self.openCommentBar(card.getAttribute("data-id"), nm.textContent.trim());
          }
        });
      }
      var post = $("wxMomentPost");
      if (post && !post.dataset.wxBound) {
        post.dataset.wxBound = "1";
        on(post, "click", function () { self.openComposer(""); });
      }
      var send = $("wxMomentCmtSend");
      if (send && !send.dataset.wxBound) {
        send.dataset.wxBound = "1";
        on(send, "click", function () { self.sendComment(); });
      }
      var cinput = $("wxMomentCmtInput");
      if (cinput && !cinput.dataset.wxBound) {
        cinput.dataset.wxBound = "1";
        on(cinput, "keydown", function (e) {
          if (e.key === "Enter") { e.preventDefault(); self.sendComment(); }
        });
      }
    },
    toggleLike: function (id) {
      var d = M.load();
      d.liked[id] = !d.liked[id];
      M.save();
      this.renderTab();
    },
    openCommentBar: function (id, replyTo) {
      var bar = $("wxMomentCmt");
      var input = $("wxMomentCmtInput");
      this.commentTarget = { id: id, replyTo: replyTo };
      if (bar) {
        bar.classList.add("show");
        input.placeholder = replyTo ? "回复 " + replyTo + "：" : "说点什么…";
        setTimeout(function () { input.focus(); }, 60);
      }
    },
    sendComment: function () {
      var input = $("wxMomentCmtInput");
      var bar = $("wxMomentCmt");
      var text = input.value.trim();
      if (!text || !this.commentTarget) { if (bar) bar.classList.remove("show"); return; }
      var d = M.load();
      var id = this.commentTarget.id;
      if (!d.comments[id]) d.comments[id] = [];
      var c = { n: WX.myName(), c: text };
      if (this.commentTarget.replyTo) c.to = this.commentTarget.replyTo;
      d.comments[id].push(c);
      M.save();
      input.value = "";
      if (bar) bar.classList.remove("show");
      this.commentTarget = null;
      this.renderTab();
    },
    confirmDelete: function (id) {
      if (!confirm("删除这条动态？")) return;
      var d = M.load();
      d.myPosts = (d.myPosts || []).filter(function (p) { return p.id !== id; });
      delete d.comments[id];
      delete d.liked[id];
      M.save();
      this.renderTab();
      toast("已删除", 1000);
    },
    /* ─────────────── 发表 ─────────────── */
    openComposer: function (prefill) {
      var self = this;
      this.compose = { text: prefill || "", imgs: [], loc: "" };
      function render() {
        var c = self.compose;
        var imgsH = c.imgs.map(function (p, i) {
          var g = self.gradients[(p.g || 0) % self.gradients.length];
          return '<div class="wx-mo-ph" data-del-img="' + i + '" style="position:relative;background:' + g + '">' +
            (p.e || "") + '<span style="position:absolute;top:-6px;right:-6px;background:#fa5151;color:#fff;border-radius:50%;width:18px;height:18px;font-size:12px;display:flex;align-items:center;justify-content:center">×</span></div>';
        }).join("");
        var paletteH = self.palette.map(function (e) {
          return '<button type="button" data-emoji="' + e + '" style="width:42px;height:42px;font-size:24px;border:none;background:#fff;border-radius:8px;margin:3px">' + e + '</button>';
        }).join("");
        $("wxContent").innerHTML =
          '<div style="display:flex;flex-direction:column;height:100%;background:#ededed">' +
            '<div style="background:#f7f7f7;padding:10px 14px;display:flex;align-items:center;gap:10px">' +
              '<button id="wxCpBack" style="border:none;background:transparent;font-size:24px">‹</button>' +
              '<b style="font-size:16px">发表动态</b>' +
              '<button id="wxCpPost" style="margin-left:auto;background:#07c160;color:#fff;border:none;border-radius:8px;padding:8px 18px;font-weight:700">发表</button>' +
            '</div>' +
            '<div style="padding:12px;flex:1;overflow:auto">' +
              '<textarea id="wxCpText" rows="4" placeholder="这一刻的想法…" style="width:100%;border:1px solid #e2e2e2;border-radius:10px;padding:12px;font-size:15px;box-sizing:border-box;resize:none;font-family:inherit"></textarea>' +
              '<div style="margin-top:10px"><button type="button" id="wxCpLoc" style="border:1px solid #ddd;background:#fff;border-radius:999px;padding:7px 16px;font-size:13px">📍 加上位置</button></div>' +
              '<div class="wx-mo-grid" style="max-width:100%;margin-top:12px">' + imgsH +
                '<button type="button" id="wxCpAdd" style="aspect-ratio:1;border:1px dashed #bbb;background:#fff;border-radius:6px;font-size:30px;color:#999">+</button></div>' +
              '<div id="wxCpPalette" style="margin-top:12px;display:none">' + paletteH + '</div>' +
            '</div>' +
          '</div>';
        var ta = $("wxCpText");
        ta.value = c.text;
        ta.focus();
        on($("wxCpBack"), "click", function () { self.renderTab(); });
        on($("wxCpPost"), "click", function () {
          self.compose.text = $("wxCpText").value.trim();
          self.submit();
        });
        on($("wxCpLoc"), "click", function () {
          var locs = ["杭州西子实验学校", "操场", "图书馆", "食堂", "教学楼", "校门口", "西湖", "铜鉴湖"];
          self.compose.loc = pick(locs);
          var lb = $("wxCpLoc");
          lb.textContent = "📍 " + self.compose.loc;
          lb.style.color = "#07c160";
        });
        on($("wxCpAdd"), "click", function () {
          var p = $("wxCpPalette");
          p.style.display = p.style.display === "none" ? "block" : "none";
        });
        on($("wxCpPalette"), "click", function (e) {
          var b = e.target.closest("[data-emoji]");
          if (!b) return;
          if (self.compose.imgs.length >= 9) { toast("最多 9 张图"); return; }
          self.compose.imgs.push({ e: b.getAttribute("data-emoji"), g: Math.floor(Math.random() * self.gradients.length) });
          render();
        });
        on($("wxContent"), "click", function (e) {
          var dd = e.target.closest("[data-del-img]");
          if (dd) {
            var i = parseInt(dd.getAttribute("data-del-img"), 10);
            self.compose.imgs.splice(i, 1);
            render();
          }
        });
      }
      $("wxTabbar").style.display = "none";
      $("wxTitle").textContent = "发表动态";
      $("wxBack").style.display = "flex";
      $("wxMore").style.display = "none";
      this.setChrome(false);
      var bar = $("wxMomentCmt");
      if (bar) bar.classList.remove("show");
      render();
      WX.view = "composer";
    },
    submit: function () {
      var text = this.compose.text;
      var imgs = this.compose.imgs.slice(0, 9);
      if (!text && !imgs.length) { toast("写点什么或选张图吧"); return; }
      var d = M.load();
      var post = {
        id: "my" + Date.now(), mine: true, who: "me",
        time: "刚刚", loc: this.compose.loc,
        text: text, imgs: imgs, likes: [], comments: []
      };
      d.myPosts = d.myPosts || [];
      d.myPosts.unshift(post);
      M.save();
      toast("已发表 🎉", 1200);
      this.scheduleReaction(post.id);
      WX.tab("moments");
    },
    /* 发布后 NPC 自动点赞/评论 */
    scheduleReaction: function (id) {
      var self = this;
      setTimeout(function () {
        if (self.reacted[id]) return;
        self.reacted[id] = true;
        var d = M.load();
        var friends = ["林晚", "赵小雨", "徐甜甜", "陈墨", "周子航", "吴磊"];
        var comments = [
          "哈哈哈哈太强了！", "支持！", "好耶～", "这个好", "我也要来",
          "点赞！", "今天也元气满满", "校园生活记录者 +1", "也太真实了吧"
        ];
        var post = null;
        for (var j = 0; j < d.myPosts.length; j++) {
          if (d.myPosts[j].id === id) { post = d.myPosts[j]; break; }
        }
        var nLike = 1 + Math.floor(Math.random() * 2);
        for (var i = 0; i < nLike; i++) {
          var nm = friends[Math.floor(Math.random() * friends.length)];
          if (post) {
            post.likes = post.likes || [];
            if (post.likes.indexOf(nm) < 0) post.likes.push(nm);
          }
        }
        if (Math.random() < 0.6) {
          var cm = comments[Math.floor(Math.random() * comments.length)];
          var cn = friends[Math.floor(Math.random() * friends.length)];
          if (!d.comments[id]) d.comments[id] = [];
          d.comments[id].push({ n: cn, c: cm });
        }
        M.save();
        if (WX.view === "moments") self.renderTab();
      }, 1800 + Math.random() * 2200);
    }
  };
  window.X565WXMoments = MM;

  /* 修复 5.6 全屏朋友圈编辑器「加上位置」按钮引用未定义 b 的 bug（捕获级，先于原监听器） */
  var _openComposer = M.openComposer;
  M.openComposer = function () {
    _openComposer.apply(M, arguments);
    setTimeout(function () {
      var locBtn = $("mmPMLoc");
      if (locBtn && !locBtn.__x565Fix) {
        locBtn.__x565Fix = true;
        locBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          var locs = ["杭州西子实验学校", "操场", "图书馆", "食堂", "教学楼", "校门口", "西湖"];
          M.composer.loc = locs[Math.floor(Math.random() * locs.length)];
          locBtn.textContent = "📍 " + M.composer.loc;
          locBtn.style.color = "#07c160";
        }, true);
      }
    }, 120);
  };
});


/* ===== p54_story2.js ===== */
/* ══════════════════════════════════════════════════════════
   p54 · 5.6.5 剧情扩容：新增三位女主完整长篇
   陆知意（学生会长·认真干练）/ 颜汐（广播站主播·温柔声线）/ 唐糖（烘焙社·软萌治愈）
   节点 schema 严格对齐 5.6 剧情引擎：line/choice/map/router/end
   ══════════════════════════════════════════════════════════ */
X565.register("story-565", function () {
  var SC = window.X56Story;
  var CC = window.X56StoryContent;
  if (!SC || !CC) return;

  function registerHeroine(h, book) {
    if (!SC.byId(h.id)) SC.heroines.push(h);
    CC[h.id] = book;
    /* 尽量融入约会番外 / 人物志 / 朋友圈 / 聊天顺序 */
    if (window.X56Date) {
      if (!window.X56Date.heroineMeta) window.X56Date.heroineMeta = {};
      window.X56Date.heroineMeta[h.id] = { name: h.name, emoji: h.emoji, color: h.color };
      if (window.X56Date.order && window.X56Date.order.indexOf(h.id) < 0) window.X56Date.order.push(h.id);
    }
    if (window.X56Core && window.X56Core.roster) {
      var exist = window.X56Core.roster.map(function (p) { return p.id; });
      if (exist.indexOf(h.id) < 0) {
        window.X56Core.roster.push({ id: h.id, name: h.name, emoji: h.emoji, tag: h.tag, bio: h.desc });
      }
    }
    if (window.X56Moments && window.X56Moments.npcs) {
      window.X56Moments.npcs[h.id] = { name: h.name, emoji: h.emoji, bg: "linear-gradient(135deg," + h.color + "," + h.color + "cc)" };
    }
    if (window.X56MomentsExtra && window.X56MomentsExtra.npcNames && window.X56MomentsExtra.npcNames.indexOf(h.name) < 0) {
      window.X56MomentsExtra.npcNames.push(h.name);
    }
    if (window.X56Chat && window.X56Chat.scriptOrder && window.X56Chat.scriptOrder.indexOf(h.id) < 0) {
      window.X56Chat.scriptOrder.push(h.id);
    }
  }

  /* ══════════════════════════════════════════════════════════
     一、陆知意 · 学生会长（🔔 干练 / 认真 / 表面冷其实心软）
     序章(执勤点名)→初识(各处协作)→靠近(一起办校园活动)→心动(熬夜改方案)
     →误会(她和副会长讨论工作)→告白(活动结束的天台)
     ══════════════════════════════════════════════════════════ */
  var LU = {
    /* 序章 */
    c0: { type: "line", chapter: "序章", loc: "classroom", speaker: "narrator", emoji: "📋",
      text: "九月的早读课，一个别着“学生会”红袖章的高个女生走进教室，点名、检查仪容、登记没交作业的人，动作利落得像在执行任务。",
      next: "c0a" },
    c0a: { type: "line", loc: "classroom", emoji: "🔔",
      text: "你没穿校服外套，按规定要登记。（她走到你桌前，笔尖点在本子上）姓名，班级，还有——理由。",
      next: "c0b" },
    c0b: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她的眼睛很认真，半点没有通融的意思。",
      choices: [
        { label: "抱歉，我忘了，马上补上，麻烦你了。", tag: "配合", eff: 2, flags: { obey: 1 }, next: "c0c" },
        { label: "会长，外套在抽屉里，我现在就穿，能通融一次吗？", tag: "机灵", eff: 1, next: "c0c_smart" },
        { label: "（满不在乎）天太热了，不穿也没事吧。", tag: "顶撞", eff: 0, flags: { rude: 1 }, next: "c0c_rude" }
      ] },
    c0c: { type: "line", loc: "classroom", emoji: "🔔",
      text: "态度不错，我叫陆知意，高二（1）班，学生会会长。记你一次提醒，下不为例。", next: "c1" },
    c0c_smart: { type: "line", loc: "classroom", emoji: "😐",
      text: "（她看着你三秒）……规则是规则，穿好了我就不记。下次别让我再提醒。", next: "c1" },
    c0c_rude: { type: "line", loc: "classroom", emoji: "🙂",
      text: "热不是理由。（她刷刷写下名字）我叫陆知意，你会在学生会办公室再见到我的。", next: "c1" },

    /* 第一章：初识（地图） */
    c1: { type: "line", chapter: "第一章 · 初识", loc: "classroom", speaker: "narrator", emoji: "🍂",
      text: "开学第一周，校园里到处是学生会的身影。陆知意似乎永远在忙：检查、布置、开会、搬东西。",
      next: "m1" },
    m1: { type: "map", loc: "classroom",
      text: "【自由活动】去不同的地方，说不定能帮上会长的忙。",
      guide: "她常出现在教室、图书馆、操场和校门口。多帮她几次，会留下好印象。",
      cells: [
        { loc: "gate", target: "l1_gate", rec: true },
        { loc: "library", target: "l1_lib", rec: true },
        { loc: "playground", target: "l1_play", rec: true },
        { loc: "canteen", target: "l1_can" },
        { loc: "classroom", target: "l1_class" },
        { loc: "garden", target: "l1_garden" }
      ] },
    l1_gate: { type: "line", loc: "gate", speaker: "narrator", emoji: "🚪",
      text: "校门口，陆知意正一个人搬一摞宣传展板，差点没抱住。", next: "l1_gate_a" },
    l1_gate_a: { type: "choice", loc: "gate", speaker: "me", emoji: "🧑",
      text: "展板快滑下来了。",
      choices: [
        { label: "（快步上前）我来帮你搬，会长。", eff: 2, flags: { help1: 1 }, next: "l1_gate_b" },
        { label: "小心！（扶住最下面那摞）", eff: 1, next: "l1_gate_b" }
      ] },
    l1_gate_b: { type: "line", loc: "gate", emoji: "🔔",
      text: "（她愣了一下）谢谢……你是那天没穿外套的同学。算你将功补过。", next: "m1b" },
    l1_lib: { type: "line", loc: "library", speaker: "narrator", emoji: "📚",
      text: "图书馆里，陆知意在清点学生借阅记录，桌上堆着厚厚的登记本。", next: "l1_lib_a" },
    l1_lib_a: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
      text: "她一个人核对得很慢。",
      choices: [
        { label: "我帮你一起核，两个人快。", eff: 2, flags: { help1: 1 }, next: "l1_lib_b" },
        { label: "会长也会亲自做这种杂活？", eff: 1, next: "l1_lib_b" }
      ] },
    l1_lib_b: { type: "line", loc: "library", emoji: "😐",
      text: "会长不是用来发号施令的。（她把另一本递给你）你帮我读，我来记。", next: "m1b" },
    l1_play: { type: "line", loc: "playground", speaker: "narrator", emoji: "🏃",
      text: "操场上，陆知意拿着卷尺在量运动会跑道的分道线。", next: "l1_play_a" },
    l1_play_a: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
      text: "风很大，她按着卷尺的手都冻红了。",
      choices: [
        { label: "（跑过去按住卷尺另一头）我帮你固定。", eff: 2, flags: { help1: 1 }, next: "l1_play_b" },
        { label: "需要帮忙吗？", eff: 1, next: "l1_play_b" }
      ] },
    l1_play_b: { type: "line", loc: "playground", emoji: "🔔",
      text: "正好。（她小声）……你手怎么也这么凉，等会儿我请你喝热的。", next: "m1b" },
    l1_can: { type: "line", loc: "canteen", speaker: "narrator", emoji: "🍜",
      text: "食堂里，陆知意在维持排队秩序，轮到自己时已经没什么菜了。", next: "l1_can_a" },
    l1_can_a: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
      text: "她端着只剩青菜的盘子。",
      choices: [
        { label: "我这份鸡腿给你，我还有别的。", eff: 2, flags: { food: 1 }, next: "l1_can_b" },
        { label: "会长辛苦，我去帮你看看后厨还有没有。", eff: 1, next: "l1_can_b" }
      ] },
    l1_can_b: { type: "line", loc: "canteen", emoji: "😳",
      text: "……不用，我减肥。（嘴上这么说，却还是接过了）谢谢，下次我请回来。", next: "m1b" },
    l1_class: { type: "line", loc: "classroom", emoji: "📝",
      text: "课间，她来检查值日表，在你班门口停了一下。", next: "l1_class_a" },
    l1_class_a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她好像在找值日生。",
      choices: [
        { label: "今天我值日，检查吧会长。", eff: 1, next: "l1_class_b" },
        { label: "你一天到晚都不休息吗？", eff: 1, next: "l1_class_b" }
      ] },
    l1_class_b: { type: "line", loc: "classroom", emoji: "🔔",
      text: "习惯了，事情总得有人做。（她顿了顿）……倒是你，最近总在帮我。", next: "m1b" },
    l1_garden: { type: "line", loc: "garden", speaker: "narrator", emoji: "🌳",
      text: "校园小径上，陆知意难得一个人坐着，手边是一摞没看完的方案。", next: "l1_garden_a" },
    l1_garden_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "她在揉太阳穴。",
      choices: [
        { label: "休息一下吧，方案不会跑。", eff: 1, next: "l1_garden_b" },
        { label: "（默默去买了瓶水放在她手边）", eff: 2, flags: { water: 1 }, next: "l1_garden_b" }
      ] },
    l1_garden_b: { type: "line", loc: "garden", emoji: "😐",
      text: "（她看着水，沉默两秒）……你怎么知道我没带水。谢了。", next: "m1b" },

    m1b: { type: "map", loc: "classroom",
      text: "【自由活动】你帮了她不少忙，她对你不再只是公事公办。",
      guide: "想推进剧情，去教学楼看看她又在忙什么（推荐）。",
      cells: [
        { loc: "classroom", target: "c2", rec: true },
        { loc: "library", target: "l1_lib_a" },
        { loc: "garden", target: "l1_garden_a" }
      ] },

    /* 第二章：靠近（一起办校园活动） */
    c2: { type: "line", chapter: "第二章 · 搭档", loc: "classroom", speaker: "narrator", emoji: "🎪",
      text: "学校要办“金秋文化节”，学生会人手不够，陆知意找到你。",
      next: "c2a" },
    c2a: { type: "line", loc: "classroom", emoji: "🔔",
      text: "我看你挺靠谱的。愿不愿意来活动组帮忙？会很累，但我会盯着，不让你白干。",
      next: "c2b" },
    c2b: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她很少主动找人。",
      choices: [
        { label: "没问题，会长安排，我随叫随到。", eff: 2, flags: { join: 1 }, next: "c2c" },
        { label: "有你盯着，我还怕吃亏吗？我加入。", eff: 2, next: "c2c" },
        { label: "我考虑一下。", eff: 0, next: "c2_hes" }
      ] },
    c2c: { type: "line", loc: "classroom", emoji: "😐",
      text: "那好，从今天起你是我临时搭档。（她声音放轻）……别让我失望。", next: "c2_work" },
    c2_hes: { type: "line", loc: "classroom", emoji: "🔔",
      text: "可以考虑，但报名表明天截止。（她看着你）……我希望你会来。", next: "c2_work" },
    c2_work: { type: "line", loc: "classroom", speaker: "narrator", emoji: "📦",
      text: "接下来的两周，你们一起搬桌椅、排节目、做预算、改流程。她总是最后一个走，你也留下来。",
      next: "c2c1" },
    c2c1: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "晚上九点，活动室只剩你们两个。",
      choices: [
        { label: "你先回去吧，剩下的我来收尾。", eff: 2, flags: { care: 1 }, next: "c2c2" },
        { label: "一起收尾，效率高。", eff: 1, next: "c2c2" }
      ] },
    c2c2: { type: "line", loc: "classroom", emoji: "😳",
      text: "（她没抬头，耳朵却红了）……你不用总让着我。不过，谢谢你留下来。", next: "c3" },

    /* 第三章：心动（熬夜改方案） */
    c3: { type: "line", chapter: "第三章 · 心动", loc: "library", speaker: "narrator", emoji: "🌙",
      text: "文化节前一晚，主方案被打回要重写。学生会办公室的灯，亮到很晚。",
      next: "c3a" },
    c3a: { type: "line", loc: "library", emoji: "🤒",
      text: "（她咳嗽了两声，脸色不太好，却还在改）没事，老毛病，改完就好。",
      next: "c3b" },
    c3b: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
      text: "她手都在抖，明显是撑着。",
      choices: [
        { label: "（把外套披给她）你这样会倒下，方案我来改，你看着。", eff: 3, flags: { protect: 1 }, next: "c3c" },
        { label: "先去医务室，剩下的我们分摊。", eff: 2, next: "c3c" },
        { label: "那你加油，我先走了。", eff: 0, flags: { leave: 1 }, next: "c3_leave" }
      ] },
    c3c: { type: "line", loc: "library", emoji: "😳",
      text: "（她裹着外套，沉默了很久）……从来没人，在我逞强的时候拦过我。", next: "c3d" },
    c3d: { type: "line", loc: "library", speaker: "narrator", emoji: "💡",
      text: "那晚你改完方案，她趴在桌上睡着了，手里还攥着红笔。你把灯调暗，给她留了张纸条。",
      next: "c3e" },
    c3e: { type: "line", loc: "library", emoji: "🔔",
      text: "第二天她找到你，把叠好的外套还你，里面夹着一张写着“谢谢”的便利贴，字迹难得地工整。",
      next: "c4" },
    c3_leave: { type: "line", loc: "library", emoji: "🍃",
      text: "（她看着你离开的背影，轻轻嗯了一声，继续改到很晚）", next: "c4" },

    /* 第四章：误会（副会长） */
    c4: { type: "line", chapter: "第四章 · 在意", loc: "classroom", speaker: "narrator", emoji: "🎭",
      text: "文化节当天，你看见陆知意和副会长凑在一起核对流程，有说有笑，副会长还帮她理了理红袖章。",
      next: "c4a" },
    c4a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "你心里莫名有点不是滋味。",
      choices: [
        { label: "（直接走过去）会长，需要我做什么？", eff: 1, next: "c4b" },
        { label: "（有点失落，躲到一边搬东西）", eff: 0, flags: { mope: 1 }, next: "c4_mope" }
      ] },
    c4b: { type: "line", loc: "classroom", emoji: "😐",
      text: "（她立刻看过来）你去哪了？流程上的事我得找你，别人我不放心。", next: "c4c" },
    c4c: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她特意强调“别人不放心”。",
      choices: [
        { label: "我看你和副会长挺熟的，怕打扰。", eff: 1, flags: { honest: 1 }, next: "c4d" },
        { label: "没什么，我随时在。", eff: 1, next: "c4d" }
      ] },
    c4d: { type: "line", loc: "classroom", emoji: "😳",
      text: "（她怔住，随即偏过头）他只是工作搭档……你吃哪门子的醋。（声音却越来越小）", next: "c5" },
    c4_mope: { type: "line", loc: "classroom", speaker: "narrator", emoji: "📦",
      text: "你搬了一下午东西，没怎么说话。散场时，她第一个找到你。", next: "c4_mope2" },
    c4_mope2: { type: "line", loc: "classroom", emoji: "🔔",
      text: "你躲我一下午了。（她抿嘴）副会长是来交接工作的，红袖章歪了他顺手扶了一下。你……在不高兴？",
      next: "c4_mope3" },
    c4_mope3: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "被她一语道破。",
      choices: [
        { label: "……嗯，有点。", eff: 2, next: "c4d" },
        { label: "没有，我只是忙。", eff: 0, next: "c4d" }
      ] },

    /* 第五章：告白（活动结束的天台） */
    c5: { type: "line", chapter: "第五章 · 心之所向", loc: "rooftop", speaker: "narrator", emoji: "🌇",
      text: "文化节圆满结束，你们一起收拾到最后。她抱着一摞奖状，提议去天台看看晚霞。",
      next: "c5a" },
    c5a: { type: "line", loc: "rooftop", emoji: "🔔",
      text: "这次活动能成，一半是你的功劳。（她望着远处）我一直觉得，认真做事的人，很值得。",
      next: "c5b" },
    c5b: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
      text: "晚风很轻，她把奖状抱得更紧了些。",
      choices: [
        { label: "陆知意，我喜欢你。从你熬夜改方案那晚开始。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "（看着她）以后别一个人逞强了，有我。", eff: 2, flags: { protect2: 1 }, next: "c5_judge" },
        { label: "（笑笑）我们会一直是好搭档。", flags: { friend: 1 }, next: "c5_judge" }
      ] },
    c5_judge: { type: "router",
      route: function (s) {
        if (s.flags.friend) return "end_friend";
        if (s.affinity >= 7) return "end_sweet";
        if (s.affinity >= 4) return "end_normal";
        return "end_miss";
      } },
    end_sweet: { type: "end", emoji: "🔔",
      title: "结局 · 并肩的人",
      text: "她低头看着奖状，好一会儿才开口：“……我把‘最佳搭档’的奖状，颁给你一辈子，好不好。” 晚霞落在她肩上，那个永远一丝不苟的会长，第一次把头靠在了你的肩膀上。" },
    end_normal: { type: "end", emoji: "🌤️",
      title: "结局 · 还在路上",
      text: "她的耳朵红了，却还是那个认真的会长：“这件事……我需要认真考虑。你知道的，我做决定很慢。” 你笑了，说你等得起，就像等她把每一件事都做好。" },
    end_friend: { type: "end", emoji: "🤝",
      title: "结局 · 最佳搭档",
      text: "她愣了一下，然后郑重地伸出手：“好搭档，一言为定。” 有些并肩同行，没成为爱情，却成了整个高中最可靠的后盾。" },
    end_miss: { type: "end", emoji: "🍂",
      title: "结局 · 错过的晚风",
      text: "她把奖状抱得更紧，轻声说了句“对不起”。风从天台吹过，吹散了那句没说出口的话。你依然是她认可的人，只是缘分还差一点点。" }
  };

  /* ══════════════════════════════════════════════════════════
     二、颜汐 · 校园广播站主播（🎤 温柔声线 / 夜晚陪伴）
     序章(送广播稿)→初识(各处点歌)→靠近(一起值班)→心动(停电雨夜)
     →误会(别人给她点歌)→告白(直播间里)
     ══════════════════════════════════════════════════════════ */
  var YAN = {
    c0: { type: "line", chapter: "序章", loc: "musicroom", speaker: "narrator", emoji: "🎙️",
      text: "广播站在教学楼顶层，门半掩着。班主任让你把运动会的稿件送上去。你推开门，一个戴着耳机的女孩正对着话筒试音。",
      next: "c0a" },
    c0a: { type: "line", loc: "musicroom", emoji: "🎤",
      text: "（她摘下一边耳机，声音比广播里还软）你好呀，送稿的同学吗？我是颜汐，广播站的。",
      next: "c0b" },
    c0b: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "耳机里漏出一段很轻的音乐。",
      choices: [
        { label: "你声音真好听，和广播里一样。", tag: "夸赞", eff: 2, flags: { praise: 1 }, next: "c0c" },
        { label: "稿件给你，需要我帮忙吗？", tag: "热心", eff: 1, next: "c0c_help" },
        { label: "（把稿子放下就走）", tag: "腼腆", eff: 0, next: "c0c_shy" }
      ] },
    c0c: { type: "line", loc: "musicroom", emoji: "😳",
      text: "（她笑了，眼睛弯起来）谢谢～第一次有人当面夸我。你叫什么名字？以后欢迎来点歌。", next: "c1" },
    c0c_help: { type: "line", loc: "musicroom", emoji: "🎤",
      text: "正好，帮我把这一摞 CD 按名字排好呗。（她递过糖）辛苦啦，这是酬劳。", next: "c1" },
    c0c_shy: { type: "line", loc: "musicroom", emoji: "🍃",
      text: "（她看着你匆忙的背影，对着话筒小声说）……真是个害羞的人呢。", next: "c1" },

    c1: { type: "line", chapter: "第一章 · 初识", loc: "classroom", speaker: "narrator", emoji: "🍂",
      text: "从那以后，每天中午和傍晚的校园广播，你都会下意识地听。她的声音好像会跟着你走遍整个校园。",
      next: "m1" },
    m1: { type: "map", loc: "classroom",
      text: "【自由活动】你可以去不同地方，也可以给广播站点歌。",
      guide: "广播站在音乐教室，她也常在图书馆、操场和食堂。多去点歌，她会记住你。",
      cells: [
        { loc: "musicroom", target: "l1_music", rec: true },
        { loc: "library", target: "l1_lib", rec: true },
        { loc: "playground", target: "l1_play", rec: true },
        { loc: "canteen", target: "l1_can" },
        { loc: "garden", target: "l1_garden" },
        { loc: "gate", target: "l1_gate" }
      ] },
    l1_music: { type: "line", loc: "musicroom", speaker: "narrator", emoji: "🎵",
      text: "广播站里，颜汐在整理点歌本，看到你进来眼睛一亮。", next: "l1_music_a" },
    l1_music_a: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "点歌本摊在桌上。",
      choices: [
        { label: "我想点一首……送给一个声音很好听的人。", eff: 2, flags: { song1: 1 }, next: "l1_music_b" },
        { label: "今天播什么？我来听听。", eff: 1, next: "l1_music_b" }
      ] },
    l1_music_b: { type: "line", loc: "musicroom", emoji: "😳",
      text: "（她在本子上写字，笔尖顿了一下）……那我晚上一定播。你要在广播下听哦。", next: "m1b" },
    l1_lib: { type: "line", loc: "library", speaker: "narrator", emoji: "📖",
      text: "图书馆里，颜汐戴着耳机轻声念稿子，好像在练朗诵。", next: "l1_lib_a" },
    l1_lib_a: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
      text: "她练得很投入。",
      choices: [
        { label: "（在旁边坐下，安静听她读完）", eff: 1, next: "l1_lib_b" },
        { label: "这段读得真好，停顿很有感觉。", eff: 2, flags: { listen: 1 }, next: "l1_lib_b" }
      ] },
    l1_lib_b: { type: "line", loc: "library", emoji: "🎤",
      text: "你听到了？（她摘下耳机）我最怕念煽情的段落，会先把自己念哭。", next: "m1b" },
    l1_play: { type: "line", loc: "playground", speaker: "narrator", emoji: "🏃",
      text: "操场上，傍晚广播响起，颜汐的声音铺满跑道，她本人却在终点线边看夕阳。", next: "l1_play_a" },
    l1_play_a: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
      text: "她正跟着广播轻轻哼。",
      choices: [
        { label: "你哼歌比广播还好听。", eff: 2, flags: { song1: 1 }, next: "l1_play_b" },
        { label: "（在她旁边坐下一起看夕阳）", eff: 1, next: "l1_play_b" }
      ] },
    l1_play_b: { type: "line", loc: "playground", emoji: "😳",
      text: "（她脸有点红）别、别乱讲……不过有人陪我看夕阳，挺好的。", next: "m1b" },
    l1_can: { type: "line", loc: "canteen", speaker: "narrator", emoji: "🍜",
      text: "食堂里很吵，颜汐却戴着耳机听轻音乐，小声打着拍子。", next: "l1_can_a" },
    l1_can_a: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
      text: "她没注意到你。",
      choices: [
        { label: "（在对面坐下，挥挥手）", eff: 1, next: "l1_can_b" },
        { label: "听什么歌？分我一只耳机。", eff: 2, flags: { ear: 1 }, next: "l1_can_b" }
      ] },
    l1_can_b: { type: "line", loc: "canteen", emoji: "🎤",
      text: "（她摘下耳机递过来）这首很适合发呆的时候听，你试试。", next: "m1b" },
    l1_garden: { type: "line", loc: "garden", speaker: "narrator", emoji: "🌳",
      text: "小径上，颜汐对着手机录音，像是在录自然的声音。", next: "l1_garden_a" },
    l1_garden_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "她在收集“秋天的声音”。",
      choices: [
        { label: "（轻轻踩落叶，给她制造声音）", eff: 1, next: "l1_garden_b" },
        { label: "录到了吗？我帮你找风。", eff: 2, next: "l1_garden_b" }
      ] },
    l1_garden_b: { type: "line", loc: "garden", emoji: "😳",
      text: "沙沙的声音很好听！（她笑）你好像，总能给我新的灵感。", next: "m1b" },
    l1_gate: { type: "line", loc: "gate", speaker: "narrator", emoji: "🌇",
      text: "校门口，颜汐抱着一摞 CD 等车，头发被晚风吹乱。", next: "l1_gate_a" },
    l1_gate_a: { type: "choice", loc: "gate", speaker: "me", emoji: "🧑",
      text: "她的车似乎晚点了。",
      choices: [
        { label: "我陪你等车吧，天黑了。", eff: 2, flags: { wait: 1 }, next: "l1_gate_b" },
        { label: "需要我帮你抱 CD 吗？", eff: 1, next: "l1_gate_b" }
      ] },
    l1_gate_b: { type: "line", loc: "gate", emoji: "🎤",
      text: "（她小声）那……今晚的广播，你听了吗？我把你点的歌，放在了最后。", next: "m1b" },

    m1b: { type: "map", loc: "classroom",
      text: "【自由活动】她的声音和你越来越熟。",
      guide: "想推进剧情，去广播站看看（推荐）。",
      cells: [
        { loc: "musicroom", target: "c2", rec: true },
        { loc: "playground", target: "l1_play_a" },
        { loc: "library", target: "l1_lib_a" }
      ] },

    /* 第二章：靠近（一起值班） */
    c2: { type: "line", chapter: "第二章 · 搭档", loc: "musicroom", speaker: "narrator", emoji: "🎚️",
      text: "广播站缺一个晚间值班的人，颜汐拿着报名表，第一个跑来问你。",
      next: "c2a" },
    c2a: { type: "line", loc: "musicroom", emoji: "🎤",
      text: "就是陪我放放歌、念念稿，傍晚那段时间。（她有点紧张）你……愿意吗？我可以教你。",
      next: "c2b" },
    c2b: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "她把报名表递过来，眼睛亮晶晶的。",
      choices: [
        { label: "我愿意，以后傍晚我都陪你。", eff: 2, flags: { join: 1 }, next: "c2c" },
        { label: "好啊，正好我也想学广播。", eff: 1, next: "c2c" }
      ] },
    c2c: { type: "line", loc: "musicroom", emoji: "😳",
      text: "太好了！（她轻轻鼓掌）那从今天起，我们就是搭档啦。", next: "c2_work" },
    c2_work: { type: "line", loc: "musicroom", speaker: "narrator", emoji: "🌆",
      text: "每个傍晚，你们一起守着小小的广播站。她教你推音量键，你帮她看着稿子。窗外的天一点点暗下来。",
      next: "c2c1" },
    c2c1: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "下播后，两个人对着没关的话筒发呆。",
      choices: [
        { label: "你播一段，只播给我听，好吗？", eff: 2, flags: { private: 1 }, next: "c2c2" },
        { label: "和你一起值班，时间过得好快。", eff: 1, next: "c2c2" }
      ] },
    c2c2: { type: "line", loc: "musicroom", emoji: "🎤",
      text: "（她红着脸，把话筒往你那边推了推）……那这段，不许录，也不许笑。", next: "c3" },

    /* 第三章：心动（停电雨夜） */
    c3: { type: "line", chapter: "第三章 · 心动", loc: "musicroom", speaker: "narrator", emoji: "🌧️",
      text: "一个暴雨的傍晚，广播还没结束，整栋楼突然跳闸停电。小小的广播站瞬间漆黑。",
      next: "c3a" },
    c3a: { type: "line", loc: "musicroom", emoji: "😱",
      text: "（黑暗里传来她带着颤的声音）你、你还在吗……我有点怕黑。",
      next: "c3b" },
    c3b: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "你听见她的声音在发抖。",
      choices: [
        { label: "（摸索着握住她的手）我在，别怕，我陪你。", eff: 3, flags: { hold: 1 }, next: "c3c" },
        { label: "（打开手机灯）我在这儿，灯开着，你看。", eff: 2, next: "c3c" },
        { label: "我去看看电闸，你别动。", eff: 1, next: "c3c" }
      ] },
    c3c: { type: "line", loc: "musicroom", emoji: "😳",
      text: "（黑暗里她握紧了你的手，过了好一会儿才小声说）……谢谢你没走。这只手，很暖。", next: "c3d" },
    c3d: { type: "line", loc: "musicroom", speaker: "narrator", emoji: "💡",
      text: "电来了，她还没来得及松手，两个人都愣了一下，脸同时红了。",
      next: "c3e" },
    c3e: { type: "line", loc: "musicroom", emoji: "🎤",
      text: "那晚的广播她临时改了歌单，最后一首，是一首很安静的情歌，她说是“献给陪我等电来的人”。",
      next: "c4" },

    /* 第四章：误会（别人给她点歌） */
    c4: { type: "line", chapter: "第四章 · 在意", loc: "classroom", speaker: "narrator", emoji: "💌",
      text: "第二天，你听到点歌本里有个陌生名字，连着三天给颜汐点情歌，还附了很暧昧的留言。",
      next: "c4a" },
    c4a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "广播里念出那些留言时，你心里一沉。",
      choices: [
        { label: "（去广播站问清楚）那些点歌，是谁？", eff: 1, next: "c4b" },
        { label: "（闷着不说话，值班也没怎么开口）", eff: 0, flags: { mope: 1 }, next: "c4_mope" }
      ] },
    c4b: { type: "line", loc: "musicroom", emoji: "😐",
      text: "（她翻了翻本子，恍然大悟）哦，那是隔壁班的同学点给……等下，你是不是不高兴了？", next: "c4c" },
    c4c: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "她盯着你看。",
      choices: [
        { label: "……嗯，我不想听别人给你点情歌。", eff: 2, flags: { honest: 1 }, next: "c4d" },
        { label: "没有，随便问问。", eff: 0, next: "c4d" }
      ] },
    c4d: { type: "line", loc: "musicroom", emoji: "😳",
      text: "（她抿嘴笑了）那些歌是点给广播站“感谢修音响”的，我还特意把留言念得很官方……笨蛋。", next: "c5" },
    c4_mope: { type: "line", loc: "musicroom", speaker: "narrator", emoji: "🎧",
      text: "你一晚上没怎么说话。下播后，她把耳机摘下，认真地看着你。", next: "c4_mope2" },
    c4_mope2: { type: "line", loc: "musicroom", emoji: "🎤",
      text: "你在吃醋对不对？（她把点歌本翻给你看）这个名字，是后勤老师的侄子，点歌谢我帮他修好话筒。你呀。",
      next: "c4_mope3" },
    c4_mope3: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "误会解开了。",
      choices: [
        { label: "……那以后情歌我包了。", eff: 2, next: "c4d" },
        { label: "我就说嘛，没事。", eff: 0, next: "c4d" }
      ] },

    /* 第五章：告白（直播间里） */
    c5: { type: "line", chapter: "第五章 · 心之所向", loc: "musicroom", speaker: "narrator", emoji: "🌙",
      text: "期末前最后一次广播，颜汐说今晚有“特别节目”，让你务必留下来陪她。",
      next: "c5a" },
    c5a: { type: "line", loc: "musicroom", emoji: "🎤",
      text: "节目快结束时，她把“正在直播”的红灯打开，却没有说话，只是把耳机分你一只。",
      next: "c5b" },
    c5b: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "红灯亮着，整个校园都在听。",
      choices: [
        { label: "（对着话筒，轻声）颜汐，我喜欢你。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "颜汐，把你以后的声音，都留给我一个人好不好。", eff: 2, flags: { promise: 1 }, next: "c5_judge" },
        { label: "（轻轻说）我们会一直是最好的搭档。", flags: { friend: 1 }, next: "c5_judge" }
      ] },
    c5_judge: { type: "router",
      route: function (s) {
        if (s.flags.friend) return "end_friend";
        if (s.affinity >= 7) return "end_sweet";
        if (s.affinity >= 4) return "end_normal";
        return "end_miss";
      } },
    end_sweet: { type: "end", emoji: "🎤",
      title: "结局 · 说给全世界听",
      text: "红灯还亮着，她却忽然凑近话筒，声音轻得像羽毛：“……我也是。” 整个校园的喇叭里，同时响起了她那句轻轻的“我也是”，和你心跳的声音。" },
    end_normal: { type: "end", emoji: "🌤️",
      title: "结局 · 未播完的歌",
      text: "她没有立刻回答，只是按下了下一首情歌，把耳机塞回你耳朵里：“这首歌……你先听着。答案，等我敢在广播里说的时候告诉你。”" },
    end_friend: { type: "end", emoji: "🤝",
      title: "结局 · 最好的听众",
      text: "她愣了一下，笑了：“那你要做我一辈子的听众哦。” 有些陪伴没变成爱情，却成了每个傍晚最安心的声音。" },
    end_miss: { type: "end", emoji: "🍂",
      title: "结局 · 下播之后",
      text: "红灯熄灭，她轻声说了句“对不起”。广播里的歌还在放，你们谁都没再开口。也许有些话，只能留在那些没说出口的频率里。" }
  };

  /* ══════════════════════════════════════════════════════════
     三、唐糖 · 烘焙社（🍰 软萌治愈 / 用甜点表达心意）
     序章(家政课失败的饼干)→初识(各处试吃)→靠近(一起做生日蛋糕)
     →心动(她把唯一成功的留给你)→误会(给别人做甜点)→告白(校庆义卖)
     ══════════════════════════════════════════════════════════ */
  var TANG = {
    c0: { type: "line", chapter: "序章", loc: "canteen", speaker: "narrator", emoji: "🧁",
      text: "家政课上，一个扎着双马尾的女生端着一盘黑乎乎的饼干，急得快哭了。她是烘焙社的唐糖，据说手艺和名字一样甜——只是今天失手了。",
      next: "c0a" },
    c0a: { type: "line", loc: "canteen", emoji: "🍰",
      text: "怎么办怎么办，烤糊了……（她抬起头看见你，眼睛红红的）你、你要不要尝尝？也许……还能吃？",
      next: "c0b" },
    c0b: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
      text: "那盘饼干看着就很苦。",
      choices: [
        { label: "（拿了一块认真吃下去）虽然糊了点，但是是甜的。", tag: "温柔", eff: 2, flags: { kind: 1 }, next: "c0c" },
        { label: "我陪你重新烤一份，别灰心。", tag: "帮忙", eff: 2, flags: { bake: 1 }, next: "c0c_help" },
        { label: "（实话实说）这……确实有点糊。", tag: "实话", eff: 0, next: "c0c_honest" }
      ] },
    c0c: { type: "line", loc: "canteen", emoji: "😳",
      text: "真的吗？（她眼睛一下子亮了，像没糊过一样）你是第一个肯吃的人！我叫唐糖，烘焙社的，我以后给你做成功的！", next: "c1" },
    c0c_help: { type: "line", loc: "canteen", emoji: "🍰",
      text: "真的吗？！（她破涕为笑）太好了，我们一起，我教你，你帮我试温度！", next: "c1" },
    c0c_honest: { type: "line", loc: "canteen", emoji: "🥺",
      text: "（她垮下脸）……果然。（小声）不过谢谢你没骗我。下次我一定烤成功，第一个给你尝。", next: "c1" },

    c1: { type: "line", chapter: "第一章 · 初识", loc: "classroom", speaker: "narrator", emoji: "🍂",
      text: "开学第一周，唐糖好像无处不在——家政教室、食堂、操场、天台，到处都有她提着小点心盒的身影。",
      next: "m1" },
    m1: { type: "map", loc: "classroom",
      text: "【自由活动】去各处找找她，她总在试做新甜点。",
      guide: "她常在食堂、家政教室（音乐教室旁）和操场。多帮她、多试吃，她会特别开心。",
      cells: [
        { loc: "canteen", target: "l1_can", rec: true },
        { loc: "musicroom", target: "l1_music", rec: true },
        { loc: "playground", target: "l1_play", rec: true },
        { loc: "garden", target: "l1_garden" },
        { loc: "gate", target: "l1_gate" },
        { loc: "library", target: "l1_lib" }
      ] },
    l1_can: { type: "line", loc: "canteen", speaker: "narrator", emoji: "🥮",
      text: "食堂里，唐糖在试做新口味的月饼，围着围裙，鼻尖沾了一点面粉。", next: "l1_can_a" },
    l1_can_a: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
      text: "她看到你，开心地挥手。",
      choices: [
        { label: "我来当小白鼠！（尝一口）嗯，好吃！", eff: 2, flags: { eat: 1 }, next: "l1_can_b" },
        { label: "你鼻尖沾到面粉了，好可爱。", eff: 2, flags: { cute: 1 }, next: "l1_can_b" }
      ] },
    l1_can_b: { type: "line", loc: "canteen", emoji: "😳",
      text: "（她慌忙擦鼻子，脸红红的）真、真的好吃吗？那这块最大的给你！", next: "m1b" },
    l1_music: { type: "line", loc: "musicroom", speaker: "narrator", emoji: "🧁",
      text: "家政教室里，唐糖在练习裱花，奶油怎么都挤不好。", next: "l1_music_a" },
    l1_music_a: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "她挤坏了第三个蛋糕。",
      choices: [
        { label: "我帮你扶着转盘，你慢慢来。", eff: 2, flags: { help: 1 }, next: "l1_music_b" },
        { label: "没关系，歪歪扭扭的也很可爱。", eff: 1, next: "l1_music_b" }
      ] },
    l1_music_b: { type: "line", loc: "musicroom", emoji: "🍰",
      text: "（她看着你帮忙的手，小声）有你在，我手都不抖了……这个蛋糕，做好给你。", next: "m1b" },
    l1_play: { type: "line", loc: "playground", speaker: "narrator", emoji: "🏃",
      text: "运动会上，唐糖提着点心盒来给运动员送能量饼干，看到你在跑步。", next: "l1_play_a" },
    l1_play_a: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
      text: "你跑完口干舌燥。",
      choices: [
        { label: "（冲过终点）唐糖！有没有水？", eff: 1, next: "l1_play_b" },
        { label: "你的饼干，是给我留的吗？", eff: 2, flags: { mine: 1 }, next: "l1_play_b" }
      ] },
    l1_play_b: { type: "line", loc: "playground", emoji: "😳",
      text: "当、当然有！（她递水和饼干，盒子里最漂亮那块果然留给了你）这是爱心形状的，别看错啦！", next: "m1b" },
    l1_garden: { type: "line", loc: "garden", speaker: "narrator", emoji: "🌼",
      text: "小径上，唐糖在摘桂花，说要做桂花糕。", next: "l1_garden_a" },
    l1_garden_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "她踮脚够不到高处的花枝。",
      choices: [
        { label: "（帮她折下一枝）够得着吗？", eff: 1, next: "l1_garden_b" },
        { label: "桂花糕做好了，要第一个给我尝。", eff: 2, flags: { promise: 1 }, next: "l1_garden_b" }
      ] },
    l1_garden_b: { type: "line", loc: "garden", emoji: "🍰",
      text: "一言为定！（她把桂花小心地装进袋子）我做的第一块，一定给你。", next: "m1b" },
    l1_gate: { type: "line", loc: "gate", speaker: "narrator", emoji: "🌇",
      text: "校门口，唐糖提着一个小盒子，犹豫着不敢进去。", next: "l1_gate_a" },
    l1_gate_a: { type: "choice", loc: "gate", speaker: "me", emoji: "🧑",
      text: "她好像在等人。",
      choices: [
        { label: "等谁呢？是送我的吗？", eff: 1, next: "l1_gate_b" },
        { label: "（陪她一起站着）", eff: 1, next: "l1_gate_b" }
      ] },
    l1_gate_b: { type: "line", loc: "gate", emoji: "😳",
      text: "才、才不是……（她把盒子往身后藏）这是我练了一晚上的曲奇，想……想让你尝。", next: "m1b" },
    l1_lib: { type: "line", loc: "library", speaker: "narrator", emoji: "📖",
      text: "图书馆里，唐糖在抄烘焙食谱，抄得很认真，像在做笔记。", next: "l1_lib_a" },
    l1_lib_a: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
      text: "她抄得满头大汗。",
      choices: [
        { label: "我帮你一起抄，快一点。", eff: 1, next: "l1_lib_b" },
        { label: "你这么用心，做出来一定很好吃。", eff: 2, flags: { praise: 1 }, next: "l1_lib_b" }
      ] },
    l1_lib_b: { type: "line", loc: "library", emoji: "🍰",
      text: "（她小声）因为……想让喜欢的人，吃到最成功的那一块呀。", next: "m1b" },

    m1b: { type: "map", loc: "classroom",
      text: "【自由活动】她的甜点几乎都先留给你。",
      guide: "想推进剧情，去家政教室看看（推荐）。",
      cells: [
        { loc: "musicroom", target: "c2", rec: true },
        { loc: "canteen", target: "l1_can_a" },
        { loc: "garden", target: "l1_garden_a" }
      ] },

    /* 第二章：靠近（一起做生日蛋糕） */
    c2: { type: "line", chapter: "第二章 · 搭档", loc: "musicroom", speaker: "narrator", emoji: "🎂",
      text: "烘焙社要给当月生日的同学办个小型庆生会，唐糖抱着一个大蛋糕胚来找你。",
      next: "c2a" },
    c2a: { type: "line", loc: "musicroom", emoji: "🍰",
      text: "我一个人做不完这么大的……你能不能帮我？就这一次！我把奶油和水果都分你一半。",
      next: "c2b" },
    c2b: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "她双手合十，眼睛水汪汪的。",
      choices: [
        { label: "好，我陪你，做到多晚都行。", eff: 2, flags: { join: 1 }, next: "c2c" },
        { label: "那我只帮你，别人可没这待遇。", eff: 2, next: "c2c" }
      ] },
    c2c: { type: "line", loc: "musicroom", emoji: "😳",
      text: "嗯！（她笑得很甜）那我们开始吧，你负责抹奶油，我负责……偷偷看你。", next: "c2_work" },
    c2_work: { type: "line", loc: "musicroom", speaker: "narrator", emoji: "🍓",
      text: "一下午，你们挤在小小的家政教室里。你把奶油抹到她鼻尖，她把草莓塞进你嘴里。",
      next: "c2c1" },
    c2c1: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "蛋糕快做好了，最后一颗草莓放哪？",
      choices: [
        { label: "（放在正中间，摆成心形）", eff: 2, flags: { heart: 1 }, next: "c2c2" },
        { label: "你说放哪就放哪。", eff: 1, next: "c2c2" }
      ] },
    c2c2: { type: "line", loc: "musicroom", emoji: "😳",
      text: "（她看着那圈心形草莓，脸红到耳根）……你这是、什么意思嘛。", next: "c3" },

    /* 第三章：心动（唯一成功的一块） */
    c3: { type: "line", chapter: "第三章 · 心动", loc: "musicroom", speaker: "narrator", emoji: "🌙",
      text: "庆生会很成功，可她自己那份“限量版芝士蛋糕”，一整个烤箱只成功了一块。",
      next: "c3a" },
    c3a: { type: "line", loc: "musicroom", emoji: "🍰",
      text: "社里好多人都想吃这块，她却把它小心地装进盒子，藏在了身后。",
      next: "c3b" },
    c3b: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "你看见她在偷偷看你。",
      choices: [
        { label: "是留给我的吗？", eff: 2, next: "c3c" },
        { label: "你自己都没舍得吃，留着干嘛？", eff: 1, next: "c3c" }
      ] },
    c3c: { type: "line", loc: "musicroom", emoji: "😳",
      text: "（她把盒子塞进你怀里，声音小得像蚊子）……最成功的一块，当然要给最重要的人。", next: "c3d" },
    c3d: { type: "line", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "你尝了一口，是你吃过最甜的芝士蛋糕。她紧张地盯着你的表情。",
      next: "c3e" },
    c3e: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "她在等你的评价。",
      choices: [
        { label: "和你一样甜。", eff: 3, flags: { sweet: 1 }, next: "c3f" },
        { label: "好吃，是我吃过最好吃的。", eff: 2, next: "c3f" }
      ] },
    c3f: { type: "line", loc: "musicroom", emoji: "🥺",
      text: "（她低下头，小声）……那我以后，天天都给你做，只给你一个人做。", next: "c4" },

    /* 第四章：误会（给别人做甜点） */
    c4: { type: "line", chapter: "第四章 · 在意", loc: "classroom", speaker: "narrator", emoji: "🎁",
      text: "几天后，你看见唐糖提着一个包装得很精致的小蛋糕盒，递给了隔壁班一个男生，还笑着说了些什么。",
      next: "c4a" },
    c4a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "你心里一下子空了。",
      choices: [
        { label: "（去找她）那个蛋糕，是给谁的？", eff: 1, next: "c4b" },
        { label: "（装作没看见，连着几天没去找她）", eff: 0, flags: { mope: 1 }, next: "c4_mope" }
      ] },
    c4b: { type: "line", loc: "musicroom", emoji: "😐",
      text: "（她愣了一下，眨眨眼）那个呀？是隔壁班同学帮我搬了烤箱，我答应做谢礼的……你怎么了？", next: "c4c" },
    c4c: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "她一脸不解。",
      choices: [
        { label: "……我以为你只给我做。", eff: 2, flags: { honest: 1 }, next: "c4d" },
        { label: "没什么，随便问问。", eff: 0, next: "c4d" }
      ] },
    c4d: { type: "line", loc: "musicroom", emoji: "😳",
      text: "（她忽然笑出声，又赶紧捂住嘴）傻瓜，那个是谢礼，又不是心意。我的心意，从来只有一份。", next: "c5" },
    c4_mope: { type: "line", loc: "musicroom", speaker: "narrator", emoji: "🥺",
      text: "你几天没出现，她抱着点心盒满学校找你，最后在小径直直堵住你。", next: "c4_mope2" },
    c4_mope2: { type: "line", loc: "musicroom", emoji: "🍰",
      text: "你为什么躲着我？（她急得眼睛红红的）那个蛋糕是谢礼啦！隔壁班帮我搬烤箱，我才做的。你是不是误会了？",
      next: "c4_mope3" },
    c4_mope3: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "她急得快哭了。",
      choices: [
        { label: "对不起，我只是……有点吃醋。", eff: 2, next: "c4d" },
        { label: "我没事，就是最近忙。", eff: 0, next: "c4d" }
      ] },

    /* 第五章：告白（校庆义卖） */
    c5: { type: "line", chapter: "第五章 · 心之所向", loc: "rooftop", speaker: "narrator", emoji: "🎪",
      text: "校庆义卖，烘焙社的摊位前排起长队。唐糖忙了一整天，最后收摊时，端出一个谁也没见过的小蛋糕。",
      next: "c5a" },
    c5a: { type: "line", loc: "rooftop", emoji: "🍰",
      text: "这个我不卖。（她把蛋糕端到你面前，上面用奶油写着两个字，她没让你看清）你先尝尝。",
      next: "c5b" },
    c5b: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
      text: "她紧张得手指都绞在一起。",
      choices: [
        { label: "唐糖，我喜欢你。喜欢吃你做的甜点，更喜欢你。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "（把蛋糕转过来，看清上面写的是“喜欢”）我也是。", eff: 2, flags: { same: 1 }, next: "c5_judge" },
        { label: "（揉她的头）我们会一直是最好的朋友。", flags: { friend: 1 }, next: "c5_judge" }
      ] },
    c5_judge: { type: "router",
      route: function (s) {
        if (s.flags.friend) return "end_friend";
        if (s.affinity >= 7) return "end_sweet";
        if (s.affinity >= 4) return "end_normal";
        return "end_miss";
      } },
    end_sweet: { type: "end", emoji: "🍰",
      title: "结局 · 甜味的心意",
      text: "她“哇”地一声，眼泪先掉下来，然后用力点头：“我、我练了好多次，就怕把‘喜欢你’三个字写歪！” 蛋糕上的奶油还没化，她踮起脚，把最甜的那块，喂到了你嘴边。" },
    end_normal: { type: "end", emoji: "🌤️",
      title: "结局 · 还在发酵",
      text: "她脸红了，捏着围裙角：“这、这个问题太突然了，我……我还需要再烤一块，好好想想。” 你笑着说好，反正你已经等过那么多炉甜点了。" },
    end_friend: { type: "end", emoji: "🤝",
      title: "结局 · 最好的试吃员",
      text: "她愣了一下，随即笑了：“那你要当我一辈子的试吃员哦！” 有些甜没有成为爱情，却成了每个课间最期待的那一口。" },
    end_miss: { type: "end", emoji: "🍂",
      title: "结局 · 烤糊的心意",
      text: "她低下头，小声说“对不起”，蛋糕上的奶油慢慢塌下去。你尝了一口，是甜的，却像少了一味。有些心意，就像第一炉饼干，烤糊了，就再也回不去了。" }
  };

  registerHeroine(
    { id: "lu", name: "陆知意", emoji: "🔔", color: "#7c9cf0",
      tag: "学生会长 · 认真干练", desc: "永远在忙的学生会会长，表面一丝不苟，其实心软得要命，最怕一个人逞强。" },
    LU
  );
  registerHeroine(
    { id: "yan", name: "颜汐", emoji: "🎤", color: "#ff9a76",
      tag: "校园主播 · 温柔声线", desc: "广播站的主播，声音软软的，会把你的点歌放在最后，还会在停电的夜里陪着你。" },
    YAN
  );
  registerHeroine(
    { id: "tang", name: "唐糖", emoji: "🍰", color: "#f6c177",
      tag: "烘焙社 · 软萌治愈", desc: "和名字一样甜的烘焙社女孩，手艺偶尔翻车，却总把最成功的那一块，偷偷留给你。" },
    TANG
  );
});


/* ===== p56_story3.js ===== */
/* ══════════════════════════════════════════════════════════
   p56 · 剧情扩容第二批：两位女主完整长篇
   温以宁（学习委员·年级第一，外冷内热）/ 安宁（摄影社转学生，内向温柔）
   节点 schema 严格对齐 5.6 剧情引擎：line/choice/map/router/end
   ══════════════════════════════════════════════════════════ */
X565.register("story-565-2", function () {
  var SC = window.X56Story;
  var CC = window.X56StoryContent;
  if (!SC || !CC) return;

  function registerHeroine(h, book) {
    if (!SC.byId(h.id)) SC.heroines.push(h);
    CC[h.id] = book;
    if (window.X56Date) {
      if (!window.X56Date.heroineMeta) window.X56Date.heroineMeta = {};
      window.X56Date.heroineMeta[h.id] = { name: h.name, emoji: h.emoji, color: h.color };
      if (window.X56Date.order && window.X56Date.order.indexOf(h.id) < 0) window.X56Date.order.push(h.id);
    }
    if (window.X56Core && window.X56Core.roster) {
      var exist = window.X56Core.roster.map(function (p) { return p.id; });
      if (exist.indexOf(h.id) < 0) window.X56Core.roster.push({ id: h.id, name: h.name, emoji: h.emoji, tag: h.tag, bio: h.desc });
    }
    if (window.X56Moments && window.X56Moments.npcs) {
      window.X56Moments.npcs[h.id] = { name: h.name, emoji: h.emoji, bg: "linear-gradient(135deg," + h.color + "," + h.color + "cc)" };
    }
    if (window.X56MomentsExtra && window.X56MomentsExtra.npcNames && window.X56MomentsExtra.npcNames.indexOf(h.name) < 0) {
      window.X56MomentsExtra.npcNames.push(h.name);
    }
    if (window.X56Chat && window.X56Chat.scriptOrder && window.X56Chat.scriptOrder.indexOf(h.id) < 0) {
      window.X56Chat.scriptOrder.push(h.id);
    }
    /* 微信联系人（p56 自带，避免数据模块缺失） */
    if (window.X565WXData && window.X565WXData.contacts) {
      var has = window.X565WXData.contacts.some(function (c) { return c.id === h.id; });
      if (!has) {
        window.X565WXData.contacts.push({
          id: h.id, name: h.name, emoji: h.emoji, bg: "linear-gradient(135deg," + h.color + "," + h.color + "cc)",
          tag: h.tag, sig: h.desc, warm: 2, greeting: [],
          bank: h.bank || [], fallback: h.fallback || ["嗯。", "我在听。", "认真的。"], sys: ""
        });
      }
    }
  }

  /* ══════════════════════════════════════════════════════════
     温以宁 · 学习委员（📘 年级第一，清冷、严谨，其实很会照顾人）
     结对帮扶→一起自习→她熬夜帮你整理笔记→误会（她给别人讲题）→告白
     ══════════════════════════════════════════════════════════ */
  var WEN = {
    c0: { type: "line", chapter: "序章", loc: "classroom", speaker: "narrator", emoji: "🍂",
      text: "月考排名出来，你的数学又没及格。班主任把你叫到办公室，指着一个抱着笔记本、表情平静的女生说：“这是学习委员温以宁，以后你们结对，她帮你补。”",
      next: "c0a" },
    c0a: { type: "line", loc: "classroom", emoji: "📘",
      text: "（她推了推眼镜，语气没有起伏）我叫温以宁。每天晚自习后，图书馆靠窗那桌，别迟到。我不喜欢等人。",
      next: "c0b" },
    c0b: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她看起来很不好接近。",
      choices: [
        { label: "好，谢谢学习委员，我一定准时到。", tag: "认真", eff: 2, flags: { promise: 1 }, next: "c0c" },
        { label: "（小声）……麻烦你了，我基础很差。", tag: "坦诚", eff: 1, next: "c0c" },
        { label: "（满不在乎）我自己也能学，不劳费心。", tag: "抗拒", eff: 0, flags: { cold: 1 }, next: "c0d" }
      ] },
    c0c: { type: "line", loc: "classroom", emoji: "😐",
      text: "（她看你一眼，眼神里有一点意外）……基础差没关系，我会从最前面讲。我怕的是你不肯来。",
      next: "c1" },
    c0d: { type: "line", loc: "classroom", emoji: "📘",
      text: "（她面无表情）没关系。但老师已经登记了。明晚见，或者——让我在你成绩单上写‘放弃’。",
      next: "c1" },

    /* 第一章：初识 */
    c1: { type: "line", chapter: "第一章 · 约定", loc: "library", speaker: "narrator", emoji: "🌙",
      text: "晚自习后的图书馆很安静，只有翻书声。她坐在靠窗的位置，已经把你的错题摊开，用红笔标出了每一处。",
      next: "m1" },
    m1: { type: "map", loc: "library",
      text: "【课余时间】你可以选择不同的地方补习，也可以去看看她。",
      guide: "她几乎都在图书馆、教室和小花园自习。多坚持、多配合，她会慢慢对你改观。",
      cells: [
        { loc: "library", target: "l1_lib", rec: true },
        { loc: "classroom", target: "l1_cls", rec: true },
        { loc: "garden", target: "l1_garden", rec: true },
        { loc: "canteen", target: "l1_can" },
        { loc: "rooftop", target: "l1_roof" }
      ] },
    l1_lib: { type: "line", loc: "library", speaker: "narrator", emoji: "✏️",
      text: "你提前到了，她难得地把一杯温水推到你面前：“先喝口水，今天讲函数。”",
      next: "l1_lib_a" },
    l1_lib_a: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
      text: "她讲得很细，连公式为什么这么变形都告诉你。",
      choices: [
        { label: "认真听完，把不懂的立刻问出来。", eff: 2, flags: { study1: 1 }, next: "l1_lib_b" },
        { label: "假装听懂了，点头。", eff: 0, next: "l1_lib_c" }
      ] },
    l1_lib_b: { type: "line", loc: "library", emoji: "📘",
      text: "（她停下笔，认真地看着你）你肯问，说明你在听。今天进度比我预想的快。（顿了顿）……谢谢。",
      next: "m1b" },
    l1_lib_c: { type: "line", loc: "library", emoji: "😐",
      text: "（她一眼看穿，语气平静）你没懂。别装，我不会笑你。来，我再讲一遍，听懂为止。",
      next: "m1b" },
    l1_cls: { type: "line", loc: "classroom", speaker: "narrator", emoji: "📝",
      text: "午休时，教室里只剩她一个人在刷题。她面前摆着两份错题本，一份是她的，一份是你的。",
      next: "l1_cls_a" },
    l1_cls_a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她居然把你的错题也抄了一遍。",
      choices: [
        { label: "你怎么还帮我抄了一本？太麻烦你了。", eff: 2, next: "l1_cls_b" },
        { label: "（默默坐下，陪她一起写）", eff: 2, next: "l1_cls_b" }
      ] },
    l1_cls_b: { type: "line", loc: "classroom", emoji: "📘",
      text: "我做我的，顺手。（她顿了顿，声音放轻）……这样你不用抱着一摞卷子翻，省时间。",
      next: "m1b" },
    l1_garden: { type: "line", loc: "garden", speaker: "narrator", emoji: "🌿",
      text: "你在小花园背单词，看见她一个人坐在长椅上，没在刷题，只是望着远处发呆。",
      next: "l1_g_a" },
    l1_g_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "这是你第一次见她不学习。",
      choices: [
        { label: "（走过去）学习委员也会摸鱼啊？", eff: 1, next: "l1_g_b" },
        { label: "（不打扰，在旁边坐下一起背）", eff: 2, next: "l1_g_c" }
      ] },
    l1_g_b: { type: "line", loc: "garden", emoji: "😐",
      text: "（她没有反驳，只是轻声）……脑子也需要休息。我又不是机器。（看向你）你来了，正好，陪我坐五分钟。",
      next: "m1b" },
    l1_g_c: { type: "line", loc: "garden", emoji: "📘",
      text: "（她侧头看你，没说话，过了一会儿，把一片银杏叶夹进了你的单词本）……书签，免得你翻到哪页都不知道。",
      next: "m1b" },
    l1_can: { type: "line", loc: "canteen", emoji: "🍚",
      text: "食堂里，她端着餐盘站在你旁边：“……你这顿没有蔬菜。” 她把自己餐盘里的青菜夹了一半给你。",
      next: "m1b" },
    l1_roof: { type: "line", loc: "rooftop", emoji: "🌬️",
      text: "天台的风很大，你看见她在收晾晒的作业本，赶紧上前帮忙。她难得说了句完整的软话：“……谢谢，今天你也别太累。”",
      next: "m1b" },
    m1b: { type: "line", loc: "library", speaker: "narrator", emoji: "🌙",
      text: "一周又一周，你不再迟到，错题本越写越满。她依旧话少，但你开始能在她平静的语气里，听到一点温度。",
      next: "c2" },

    /* 第二章：靠近 */
    c2: { type: "line", chapter: "第二章 · 靠近", loc: "classroom", speaker: "narrator", emoji: "📊",
      text: "周测成绩出来，你的数学第一次及格，还高了分数线二十分。你几乎是冲进图书馆想告诉她。",
      next: "c2a" },
    c2a: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
      text: "她正低着头写着什么，灯照着她的侧脸。",
      choices: [
        { label: "（把卷子放在她面前）我及格了！多亏你。", eff: 2, next: "c2b" },
        { label: "（小声）这二十分，有你一半。", eff: 3, flags: { touch: 1 }, next: "c2c" }
      ] },
    c2b: { type: "line", loc: "library", emoji: "📘",
      text: "（她看着分数，沉默了几秒，然后嘴角很轻地弯了一下，快得像错觉）……我只是讲题。分数是你自己考的。",
      next: "c2d" },
    c2c: { type: "line", loc: "library", emoji: "😳",
      text: "（她的笔顿在纸上，耳尖微微发红，却还是那副平静的样子）……别乱说。（低头）但你能这么想，我很高兴。",
      next: "c2d" },
    c2d: { type: "line", loc: "library", speaker: "me", emoji: "🧑",
      text: "你注意到她桌角有一张揉皱又抚平的纸，上面是密密麻麻的笔记，时间是凌晨一点。",
      next: "c2e" },
    c2e: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
      text: "原来她每天讲题之外，自己还要熬夜整理。",
      choices: [
        { label: "你昨晚是不是又熬夜了？这是给我的笔记？", eff: 2, flags: { care: 1 }, next: "c2f" },
        { label: "（把热牛奶放到她手边）你也别只想着我。", eff: 3, next: "c2g" }
      ] },
    c2f: { type: "line", loc: "library", emoji: "📘",
      text: "（她下意识把纸往回收，动作顿住）……被你看到了。我睡得不少，别用那种眼神看我。",
      next: "c2h" },
    c2g: { type: "line", loc: "library", emoji: "😳",
      text: "（她盯着那杯牛奶，沉默了很久，伸手捧住）……温的。（声音很轻）你什么时候注意到我没好好吃饭的？",
      next: "c2h" },
    c2h: { type: "line", loc: "garden", speaker: "narrator", emoji: "🌙",
      text: "从那天起，补习不再只是讲题。她会等你一起去食堂，会在你犯困时递来薄荷糖，也会把自己的伞，悄悄往你那边倾斜。",
      next: "c3" },

    /* 第三章：心动 */
    c3: { type: "line", chapter: "第三章 · 心动", loc: "classroom", speaker: "narrator", emoji: "🌧️",
      text: "一场大雨困住了没带伞的你。图书馆门口，她撑着一把黑伞，回头看你：“顺路。一起走。”",
      next: "c3a" },
    c3a: { type: "line", loc: "garden", speaker: "me", emoji: "🧑",
      text: "一把伞很小，你们靠得很近。你能闻到她身上淡淡的洗衣液味道。",
      next: "c3b" },
    c3b: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "你发现她的半边肩膀都湿了，伞几乎全在你这边。",
      choices: [
        { label: "（把伞往她那边推）你都淋湿了，别只顾着我。", eff: 2, next: "c3c" },
        { label: "（伸手搂住她肩膀，靠紧一点）这样就都淋不到了。", eff: 3, flags: { close: 1 }, next: "c3d" }
      ] },
    c3c: { type: "line", loc: "garden", emoji: "📘",
      text: "（她一怔，看着你，雨声里她的声音很轻）……你居然还会关心人。（顿了顿，把伞放正，肩膀却靠得更近了一点）",
      next: "c3e" },
    c3d: { type: "line", loc: "garden", emoji: "😳",
      text: "（她身体僵了一瞬，没有躲开，耳尖通红，低头看着水洼）……你这样，我会分心的。",
      next: "c3e" },
    c3e: { type: "line", loc: "library", speaker: "narrator", emoji: "💓",
      text: "那晚之后，你做题时会忍不住看她的侧脸；她讲题时，也会因为你凑得太近而忽然说不下去。",
      next: "c4" },

    /* 第四章：误会 */
    c4: { type: "line", chapter: "第四章 · 误会", loc: "classroom", speaker: "narrator", emoji: "🍂",
      text: "连续几天，她放学后都不再等你，而是去了另一个班，给一个男生讲题。你站在走廊，看着她耐心的样子，心里不是滋味。",
      next: "c4a" },
    c4a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "你想起她对你说话的样子，心里一沉。",
      choices: [
        { label: "（直接去问她）那个男生是谁？", eff: 1, next: "c4b" },
        { label: "（什么都不问，开始躲着她）", eff: 0, flags: { mope: 1 }, next: "c4_mope" }
      ] },
    c4b: { type: "line", loc: "classroom", emoji: "😐",
      text: "（她看着你，似乎明白了什么，语气依旧平静）……那是我弟。他初三，老师让我帮忙带一段。你在吃醋？",
      next: "c4c" },
    c4c: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她把问题摆到了明面上。",
      choices: [
        { label: "……是。我不想你对别人也那么耐心。", eff: 2, flags: { honest: 1 }, next: "c4d" },
        { label: "没有，我就是随便问问。", eff: 0, next: "c4_d" }
      ] },
    c4d: { type: "line", loc: "classroom", emoji: "😳",
      text: "（她低下头，沉默了几秒，再抬眼看你时，平静里藏着一点笑意）……你知不知道，我对你，从来不是‘随便’。",
      next: "c5" },
    c4_d: { type: "line", loc: "classroom", emoji: "📘",
      text: "（她平静地看着你，过了一会儿）……你不诚实。我讲题给别人，你会不高兴；那你对我，到底是什么？",
      next: "c5" },
    c4_mope: { type: "line", loc: "library", speaker: "narrator", emoji: "🥺",
      text: "你连续三天没去图书馆。第四天，她直接抱着书出现在你班门口，当着全班的面：“你出来。”",
      next: "c4_mope2" },
    c4_mope2: { type: "line", loc: "classroom", emoji: "📘",
      text: "你为什么躲我？（她把笔记本往你桌上一放，声音压得很低）我给我弟讲题，你就不高兴了？你要是在意，就当面问，别让我一个人猜。",
      next: "c4_mope3" },
    c4_mope3: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她第一次在你面前情绪波动。",
      choices: [
        { label: "对不起……是我喜欢你，喜欢到会吃醋。", eff: 2, next: "c4d" },
        { label: "我最近有点事，不是躲你。", eff: 0, next: "c5" }
      ] },

    /* 第五章：告白 */
    c5: { type: "line", chapter: "第五章 · 心之所向", loc: "rooftop", speaker: "narrator", emoji: "🌆",
      text: "期末，你冲进了年级前三十。成绩单贴出来那天，她破天荒地把你叫到天台，手里攥着一本写满字的本子。",
      next: "c5a" },
    c5a: { type: "line", loc: "rooftop", emoji: "📘",
      text: "这是给你的最后一本错题本。（她把本子递给你，声音很轻）……以后成绩追上了，你就不用再找我了。",
      next: "c5b" },
    c5b: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
      text: "你看着她，忽然明白她为什么不开心。",
      choices: [
        { label: "温以宁，我喜欢的不是‘有人教我’，是你。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "我不想要最后一本。我想一直找你，不只是为了题。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "谢谢你，你是我遇到过最好的学习委员。", flags: { friend: 1 }, next: "c5_judge" }
      ] },
    c5_judge: { type: "router",
      route: function (s) {
        if (s.flags.friend) return "end_friend";
        if (s.affinity >= 7) return "end_sweet";
        if (s.affinity >= 4) return "end_normal";
        return "end_miss";
      } },
    end_sweet: { type: "end", emoji: "📘",
      title: "结局 · 你是我满分的答案",
      text: "她攥着本子的手紧了紧，眼泪毫无预兆地落下来，却还是嘴硬：“……你这个人，明明反应这么慢，怎么偏偏这道题答得这么快。” 她把头靠在你肩上，第一次没有推开你。窗外的夕阳，把两个人的影子叠在一起。" },
    end_normal: { type: "end", emoji: "🌤️",
      title: "结局 · 未完的错题",
      text: "她愣住，耳尖通红，过了很久才轻声说：“……这道题，我没有标准答案，让我想一晚上。” 第二天，你的笔袋里多了一张便签，只写了一行字：“今晚，老位置。”" },
    end_friend: { type: "end", emoji: "🤝",
      title: "结局 · 并肩的同桌",
      text: "她笑了，恢复了那副平静的样子：“那我就当你一辈子的学习委员。” 有些感情没有说出口，却在每一次递来的温水和错题本里，安静地陪着你往前走。" },
    end_miss: { type: "end", emoji: "🍂",
      title: "结局 · 没说出口的那页",
      text: "她低下头，把本子塞进你手里，轻声说了句“恭喜”，然后转身走了。你后来才知道，那本错题本的最后一页，写着一句你没能看见的话，被她用修正带轻轻盖住了。" }
  };

  /* ══════════════════════════════════════════════════════════
     安宁 · 摄影社转学生（📷 内向、害羞，用镜头记录世界）
     转学解围→一起拍校园→她的镜头总对着你→误会（影展主角）→告白
     ══════════════════════════════════════════════════════════ */
  var AN = {
    c0: { type: "line", chapter: "序章", loc: "classroom", speaker: "narrator", emoji: "🍂",
      text: "班里来了个转学生，叫安宁，抱着一台旧相机，低着头做自我介绍，声音小得几乎听不见。后排有男生起哄：“转学生，给我们拍一张呗！”",
      next: "c0a" },
    c0a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她的手指紧张地攥着相机，眼圈有点红。",
      choices: [
        { label: "（站起来挡在她前面）人家第一天，别为难她。", tag: "解围", eff: 2, flags: { help: 1 }, next: "c0b" },
        { label: "（轻声对她说）别怕，我帮你介绍。", tag: "温柔", eff: 2, flags: { gentle: 1 }, next: "c0b" },
        { label: "（围观，没出声）", tag: "旁观", eff: 0, next: "c0c" }
      ] },
    c0b: { type: "line", loc: "classroom", emoji: "📷",
      text: "（她躲在你身后，小声说了一句）……谢谢你。我叫安宁，喜欢拍照。（她抬起头，看了你一眼，又迅速低下头）",
      next: "c1" },
    c0c: { type: "line", loc: "classroom", emoji: "📷",
      text: "（她窘迫地站着，最后什么也没说，低着头回到座位。那台相机，被她紧紧抱在怀里。）",
      next: "c1" },

    c1: { type: "line", chapter: "第一章 · 镜头", loc: "garden", speaker: "narrator", emoji: "🌿",
      text: "你渐渐发现，安宁总在校园各处出现：花园、操场、天台，举着相机，却从不让人拍她。",
      next: "m1" },
    m1: { type: "map", loc: "garden",
      text: "【课余时间】她总拿着相机出现在校园各个角落。",
      guide: "去她常拍照的地方找她，帮她、陪她，她会慢慢敢对你说话。",
      cells: [
        { loc: "garden", target: "l1_g", rec: true },
        { loc: "playground", target: "l1_p", rec: true },
        { loc: "rooftop", target: "l1_r", rec: true },
        { loc: "library", target: "l1_lib" },
        { loc: "gate", target: "l1_gate" }
      ] },
    l1_g: { type: "line", loc: "garden", speaker: "narrator", emoji: "🌸",
      text: "她蹲在桂花树下拍一朵花，你走近时她没发现，嘴里还小声嘀咕着：“再低一点……光……”",
      next: "l1_g_a" },
    l1_g_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "她专心的样子很可爱。",
      choices: [
        { label: "（帮她挡住身后的人影）这样背景干净一点。", eff: 2, next: "l1_g_b" },
        { label: "需要我帮你扶一下那枝花吗？", eff: 2, next: "l1_g_b" }
      ] },
    l1_g_b: { type: "line", loc: "garden", emoji: "📷",
      text: "（她吓了一跳，看清是你，松了口气）……是你。（低头看了看相机，小声）这张……拍得很好，谢谢你。",
      next: "m1b" },
    l1_p: { type: "line", loc: "playground", speaker: "narrator", emoji: "🏀",
      text: "操场边，她举着相机想拍奔跑的同学，却一直不敢靠近，怕被球砸到。",
      next: "l1_p_a" },
    l1_p_a: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
      text: "一个篮球正朝她飞过来。",
      choices: [
        { label: "（冲过去把她拉开）小心！", eff: 3, flags: { save: 1 }, next: "l1_p_b" },
        { label: "（喊）同学，小心球！", eff: 1, next: "l1_p_c" }
      ] },
    l1_p_b: { type: "line", loc: "playground", emoji: "😳",
      text: "（她被你拉到怀里，惊魂未定，紧紧抓着你的衣角）……谢、谢谢。（脸通红，却没有松手）",
      next: "m1b" },
    l1_p_c: { type: "line", loc: "playground", emoji: "📷",
      text: "（她及时低头，球擦着相机飞过。她小声地说）……还好你提醒我。",
      next: "m1b" },
    l1_r: { type: "line", loc: "rooftop", speaker: "narrator", emoji: "🌅",
      text: "天台上，她对着夕阳拍了很久，忽然把相机放下，轻轻叹了口气。",
      next: "l1_r_a" },
    l1_r_a: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
      text: "她看起来有点孤单。",
      choices: [
        { label: "一个人来拍照？我陪你。", eff: 2, next: "l1_r_b" },
        { label: "（不说话，在她旁边坐下）", eff: 2, next: "l1_r_b" }
      ] },
    l1_r_b: { type: "line", loc: "rooftop", emoji: "📷",
      text: "（她看了你一眼，把相机递过来，指了指屏幕）你看……夕阳是圆的，可只有拍下来，它才不会马上消失。",
      next: "m1b" },
    l1_lib: { type: "line", loc: "library", emoji: "📖",
      text: "她在图书馆翻拍旧报纸上的校园照片，看到你，小声说：“……我在找这所学校以前的样子。”",
      next: "m1b" },
    l1_gate: { type: "line", loc: "gate", emoji: "🚪",
      text: "放学，她在校门口拍来往的同学，看到你，悄悄按下快门，又慌忙把相机藏到身后。",
      next: "m1b" },
    m1b: { type: "line", loc: "garden", speaker: "narrator", emoji: "💓",
      text: "渐渐地，她只在你面前敢说话。你成了她镜头里最常出现的人，也是唯一被允许靠近她拍照的人。",
      next: "c2" },

    /* 第二章：靠近 */
    c2: { type: "line", chapter: "第二章 · 你在镜头里", loc: "classroom", speaker: "narrator", emoji: "📷",
      text: "你偶然看到她相机的相册，翻了几页，愣住了——里面几乎全是你：你做题、你打球、你发呆、你在天台看夕阳。",
      next: "c2a" },
    c2a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她慌张地把相机抢回去。",
      choices: [
        { label: "你拍了我这么多？", eff: 2, next: "c2b" },
        { label: "（笑）原来我在你眼里是这样的。", eff: 3, flags: { tease: 1 }, next: "c2c" }
      ] },
    c2b: { type: "line", loc: "classroom", emoji: "😳",
      text: "（她把脸埋进相机后面，声音闷闷的）……因为、因为你好看。不是！是、是光线好！（越说越乱）",
      next: "c2d" },
    c2c: { type: "line", loc: "classroom", emoji: "📷",
      text: "（她耳朵红透了，小声）……我、我只是觉得，你在认真做一件事的时候，特别好看。不、不只是好看……",
      next: "c2d" },
    c2d: { type: "line", loc: "garden", speaker: "narrator", emoji: "🌿",
      text: "从那天起，她开始敢把镜头对着你笑，也开始愿意被你拍。你第一次拍到她的脸，是她在桂花树下，没来得及躲。",
      next: "c3" },

    /* 第三章：心动 */
    c3: { type: "line", chapter: "第三章 · 影展", loc: "classroom", speaker: "narrator", emoji: "🖼️",
      text: "校园摄影社要办影展，她是被指导老师点名参展的人。她却迟迟不肯提交作品，每天抱着相机发呆。",
      next: "c3a" },
    c3a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她明明拍得最好。",
      choices: [
        { label: "你拍得那么好，为什么不参展？", eff: 2, next: "c3b" },
        { label: "我帮你一起挑照片，好吗？", eff: 2, next: "c3b" }
      ] },
    c3b: { type: "line", loc: "classroom", emoji: "📷",
      text: "（她抱着相机，声音很小）……我拍了很多，但最重要的那张，我不敢让别人看到。我怕……被人笑话。",
      next: "c3c" },
    c3c: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她不敢展示的，会是什么？",
      choices: [
        { label: "能让我先看吗？我不笑。", eff: 3, flags: { trust: 1 }, next: "c3d" },
        { label: "不管拍了什么，我都站在你这边。", eff: 2, next: "c3d" }
      ] },
    c3d: { type: "line", loc: "classroom", emoji: "😳",
      text: "（她犹豫了很久，把相机递给你。屏幕上，是一张你在天台看夕阳的背影，标题只有一行字——《我最喜欢的人》。）",
      next: "c3e" },
    c3e: { type: "line", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "你愣住了，转头看她。她已经红了眼眶，不敢看你。",
      next: "c4" },

    /* 第四章：误会 */
    c4: { type: "line", chapter: "第四章 · 误会", loc: "classroom", speaker: "narrator", emoji: "🍂",
      text: "影展前一周，你偶然看到她把一张照片交给了另一个男生——摄影社社长，两人还在照片前有说有笑。",
      next: "c4a" },
    c4a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "你心里咯噔一下。",
      choices: [
        { label: "（直接问她）那张照片，你给他了？", eff: 1, next: "c4b" },
        { label: "（没问，心里别扭）", eff: 0, flags: { mope: 1 }, next: "c4_mope" }
      ] },
    c4b: { type: "line", loc: "classroom", emoji: "📷",
      text: "（她愣了一下，忽然明白了，眼睛弯起来）……你说社长？他只是帮我把照片洗出来。（声音变小）你在吃醋？",
      next: "c4c" },
    c4c: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她似乎很想听到你的回答。",
      choices: [
        { label: "……是。我希望你镜头里的人，一直是我。", eff: 2, flags: { honest: 1 }, next: "c4d" },
        { label: "没有，我就问问。", eff: 0, next: "c4_e" }
      ] },
    c4d: { type: "line", loc: "classroom", emoji: "😳",
      text: "（她抬起头，看着你，一字一句地说）……镜头里，一直只有你。从你第一天帮我的那个早晨开始。",
      next: "c5" },
    c4_e: { type: "line", loc: "classroom", emoji: "📷",
      text: "（她小声）你骗人，你明明很在意。（停顿）……那我问你，你愿不愿意，当我照片里的主角？",
      next: "c5" },
    c4_mope: { type: "line", loc: "garden", speaker: "narrator", emoji: "🥺",
      text: "你几天没去找她。影展前一天，她在小花园堵住你，相机抱在怀里，眼圈红红的。",
      next: "c4_mope2" },
    c4_mope2: { type: "line", loc: "garden", emoji: "📷",
      text: "你为什么躲我？（她声音发抖）社长只是帮我洗照片……你是不是，根本不想出现在我的照片里？",
      next: "c4_mope3" },
    c4_mope3: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "她快哭了。",
      choices: [
        { label: "不是。是我喜欢你，喜欢到不敢看你把照片给别人。", eff: 2, next: "c4d" },
        { label: "我最近忙，没躲你。", eff: 0, next: "c5" }
      ] },

    /* 第五章：告白 */
    c5: { type: "line", chapter: "第五章 · 心之所向", loc: "garden", speaker: "narrator", emoji: "🖼️",
      text: "影展那天，你在展厅最中央，看到了那张你熟悉的照片——《我最喜欢的人》，下面署着她的名字。",
      next: "c5a" },
    c5a: { type: "line", loc: "garden", emoji: "📷",
      text: "她站在照片旁边，紧张得手都在抖。看到你，她深吸一口气，举起相机，对准你。",
      next: "c5b" },
    c5b: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "她在等你回答。",
      choices: [
        { label: "安宁，我喜欢你。以后请你只拍我，我也只看你。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "（走到照片前）我想当你一辈子的主角。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "照片很好看，你是个很棒的摄影师。", flags: { friend: 1 }, next: "c5_judge" }
      ] },
    c5_judge: { type: "router",
      route: function (s) {
        if (s.flags.friend) return "end_friend";
        if (s.affinity >= 7) return "end_sweet";
        if (s.affinity >= 4) return "end_normal";
        return "end_miss";
      } },
    end_sweet: { type: "end", emoji: "📷",
      title: "结局 · 永远的主角",
      text: "她按下快门，眼泪却先落了下来。“……这是我拍过，最好看的一张。” 照片里，是你笑着向她走来。她从那天起，再也没有把镜头对准别人；而她的镜头之外，也多了一个愿意替她挡球、陪她看夕阳的人。" },
    end_normal: { type: "end", emoji: "🌤️",
      title: "结局 · 正在对焦",
      text: "她红着脸，小声说：“……这句话，我在心里排练了很多次。你让我再对一次焦，好吗？” 你点头。她慢慢举起相机，这一次，把镜头对准的是你们两个的合影。" },
    end_friend: { type: "end", emoji: "🤝",
      title: "结局 · 镜头后的朋友",
      text: "她笑了，虽然有点遗憾：“那……你愿意当我一辈子的模特吗？” 有些画面没有成为爱情，却被一张张照片，认真地保存了下来。" },
    end_miss: { type: "end", emoji: "🍂",
      title: "结局 · 没拍到的瞬间",
      text: "她低下头，轻声说了句“谢谢”，然后把那张照片取了下来。后来你再没在她的镜头里出现过。有些瞬间，对焦对了，却错过了按下快门的勇气。" }
  };

  registerHeroine(
    { id: "wen", name: "温以宁", emoji: "📘", color: "#8a9bf0",
      tag: "学习委员 · 年级第一", desc: "清冷严谨的学习委员，讲题一丝不苟，会熬夜为你整理错题，却把关心藏得很深。",
      bank: [
        { kws: ["补课", "讲题", "这道题", "不会"], reps: ["晚自习后图书馆靠窗那桌，我再给你讲一遍。", "别装懂，不会就问，我不笑你。"] },
        { kws: ["喜欢", "表白", "在一起"], reps: ["……你这道题，答得倒是快。", "我对你，从来不是随便。"] },
        { kws: ["熬夜", "休息", "别累", "牛奶"], reps: ["我睡得不少。倒是你，把牛奶喝了。"] }
      ],
      fallback: ["嗯。", "认真的。", "我在听。"] },
    WEN
  );
  registerHeroine(
    { id: "an", name: "安宁", emoji: "📷", color: "#7fb0c9",
      tag: "摄影社 · 转学生", desc: "内向害羞的转学生，抱着旧相机记录校园，她的镜头里，不知不觉全是你。",
      bank: [
        { kws: ["拍照", "摄影", "相机", "照片", "影展"], reps: ["你、你别动，这个光很好……", "我镜头里，一直只有你。"] },
        { kws: ["喜欢", "表白", "在一起"], reps: ["（举起相机）……这是我拍过最好看的一张。", "我想让你当我照片里的主角。"] },
        { kws: ["转学", "新同学", "不熟", "紧张"], reps: ["刚来的时候，谢谢你帮我。", "有你在，我就没那么怕了。"] }
      ],
      fallback: ["……嗯。", "你说，我在听。", "（小声）好。"] },
    AN
  );
});


/* ===== p57_story4.js ===== */
/* ══════════════════════════════════════════════════════════
   p57 · 剧情扩容第三批：两位女主完整长篇
   江晚舟（女足队长，飒爽阳光、讲义气）/ 岑诺（辩论社社长，毒舌、嘴硬心软）
   节点 schema 严格对齐 5.6 剧情引擎
   ══════════════════════════════════════════════════════════ */
X565.register("story-565-3", function () {
  var SC = window.X56Story;
  var CC = window.X56StoryContent;
  if (!SC || !CC) return;

  function registerHeroine(h, book) {
    if (!SC.byId(h.id)) SC.heroines.push(h);
    CC[h.id] = book;
    if (window.X56Date) {
      if (!window.X56Date.heroineMeta) window.X56Date.heroineMeta = {};
      window.X56Date.heroineMeta[h.id] = { name: h.name, emoji: h.emoji, color: h.color };
      if (window.X56Date.order && window.X56Date.order.indexOf(h.id) < 0) window.X56Date.order.push(h.id);
    }
    if (window.X56Core && window.X56Core.roster) {
      var exist = window.X56Core.roster.map(function (p) { return p.id; });
      if (exist.indexOf(h.id) < 0) window.X56Core.roster.push({ id: h.id, name: h.name, emoji: h.emoji, tag: h.tag, bio: h.desc });
    }
    if (window.X56Moments && window.X56Moments.npcs) {
      window.X56Moments.npcs[h.id] = { name: h.name, emoji: h.emoji, bg: "linear-gradient(135deg," + h.color + "," + h.color + "cc)" };
    }
    if (window.X56MomentsExtra && window.X56MomentsExtra.npcNames && window.X56MomentsExtra.npcNames.indexOf(h.name) < 0) {
      window.X56MomentsExtra.npcNames.push(h.name);
    }
    if (window.X56Chat && window.X56Chat.scriptOrder && window.X56Chat.scriptOrder.indexOf(h.id) < 0) {
      window.X56Chat.scriptOrder.push(h.id);
    }
    if (window.X565WXData && window.X565WXData.contacts) {
      var has = window.X565WXData.contacts.some(function (c) { return c.id === h.id; });
      if (!has) {
        window.X565WXData.contacts.push({
          id: h.id, name: h.name, emoji: h.emoji, bg: "linear-gradient(135deg," + h.color + "," + h.color + "cc)",
          tag: h.tag, sig: h.desc, warm: 2, greeting: [],
          bank: h.bank || [], fallback: h.fallback || ["嗯。", "我在。", "废话不多说。"], sys: ""
        });
      }
    }
  }

  /* ══════════════════════════════════════════════════════════
     江晚舟 · 女足队长（⚽ 飒爽、阳光、讲义气，校队主力）
     球场相遇→陪她训练/当后勤→她受伤你照顾→误会（她推开你）→告白
     ══════════════════════════════════════════════════════════ */
  var JIA = {
    c0: { type: "line", chapter: "序章", loc: "playground", speaker: "narrator", emoji: "🍂",
      text: "体育课上，一个足球飞速滚到你脚边。你抬头，一个扎着高马尾、挽着裤腿的女生冲你喊：“喂——球！麻烦传一脚！”",
      next: "c0a" },
    c0a: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
      text: "她目光很亮，跑得飞快。",
      choices: [
        { label: "（用力把球踢回去）给！", tag: "干脆", eff: 2, next: "c0b" },
        { label: "（捡起球，跑过去递给她）", tag: "温和", eff: 1, next: "c0c" }
      ] },
    c0b: { type: "line", loc: "playground", emoji: "⚽",
      text: "（她稳稳停住球，挑眉看你）哟，脚法不错。我叫江晚舟，女足队长。看你这架势，要不要来队里练两天？",
      next: "c1" },
    c0c: { type: "line", loc: "playground", emoji: "⚽",
      text: "（她接过球，看你一眼，笑了）这么客气？我叫江晚舟。踢球还是看球？看球也行，反正我们队缺一个会喊加油的。",
      next: "c1" },

    c1: { type: "line", chapter: "第一章 · 训练场", loc: "playground", speaker: "narrator", emoji: "🌇",
      text: "从那天起，放学后你常能看见她在球场训练。她比男生还拼，一个人练到天黑，球衣湿透了也不停。",
      next: "m1" },
    m1: { type: "map", loc: "playground",
      text: "【课余时间】你可以去球场找她，也可以去别的地方。",
      guide: "陪她训练、给她递水、当她的球迷，她会越来越把你当自己人。",
      cells: [
        { loc: "playground", target: "l1_p", rec: true },
        { loc: "canteen", target: "l1_c", rec: true },
        { loc: "rooftop", target: "l1_r", rec: true },
        { loc: "gate", target: "l1_g" },
        { loc: "clinic", target: "l1_m" }
      ] },
    l1_p: { type: "line", loc: "playground", speaker: "narrator", emoji: "🥅",
      text: "她在练任意球，一遍又一遍，球一次次打在门框上。",
      next: "l1_p_a" },
    l1_p_a: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
      text: "她已经练了快一个小时。",
      choices: [
        { label: "（在球门后帮她捡球）我帮你捡，你只管踢。", eff: 2, next: "l1_p_b" },
        { label: "你已经踢得很好了，歇会儿？", eff: 2, next: "l1_p_c" }
      ] },
    l1_p_b: { type: "line", loc: "playground", emoji: "⚽",
      text: "（她咧嘴一笑，把球摆好）够意思！有你捡球，我效率翻倍。（一脚踢出，球擦着横梁入网）看见没？",
      next: "m1b" },
    l1_p_c: { type: "line", loc: "playground", emoji: "⚽",
      text: "歇什么，还差一点。（她跑过来，却还是接过你递的水，一口气喝完）……谢了，你在这儿，我好像没那么累。",
      next: "m1b" },
    l1_c: { type: "line", loc: "canteen", speaker: "narrator", emoji: "🍚",
      text: "食堂里，她端着两大盘饭菜坐到你对面：“训练消耗大，我吃得比你多，别笑。”",
      next: "l1_c_a" },
    l1_c_a: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
      text: "她吃得很豪迈。",
      choices: [
        { label: "多吃点，我这份鸡腿给你。", eff: 2, next: "l1_c_b" },
        { label: "（笑）以后我请你吃饭。", eff: 2, next: "l1_c_b" }
      ] },
    l1_c_b: { type: "line", loc: "canteen", emoji: "⚽",
      text: "（她也不客气，一口收下）行，那我可记着了。（顿了顿，小声）……跟你一起吃饭，比跟那帮大大咧咧的队友舒服多了。",
      next: "m1b" },
    l1_r: { type: "line", loc: "rooftop", speaker: "narrator", emoji: "🌆",
      text: "你在天台撞见她一个人坐着，望着球场，没了平日的张扬。",
      next: "l1_r_a" },
    l1_r_a: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
      text: "她看起来有点心事。",
      choices: [
        { label: "（在她旁边坐下）怎么了，江队长？", eff: 1, next: "l1_r_b" },
        { label: "（不追问，递一瓶水给她）", eff: 2, next: "l1_r_c" }
      ] },
    l1_r_b: { type: "line", loc: "rooftop", emoji: "⚽",
      text: "……下个月市里的比赛，我怕输。（她自嘲地笑）你看，平时大大咧咧的人，也会怕。",
      next: "m1b" },
    l1_r_c: { type: "line", loc: "rooftop", emoji: "⚽",
      text: "（她接过水，沉默了一会儿）……你怎么知道我需要这个？（轻声）有你在，真好。",
      next: "m1b" },
    l1_g: { type: "line", loc: "gate", emoji: "🚪",
      text: "放学，她背着球包从你身边跑过，回头喊：“明天比赛，来给我加油！”",
      next: "m1b" },
    l1_m: { type: "line", loc: "clinic", emoji: "🩹",
      text: "你路过医务室，看到她在处理小腿上的擦伤，还满不在乎地摆手：“小伤，不影响踢球。”",
      next: "m1b" },
    m1b: { type: "line", loc: "playground", speaker: "narrator", emoji: "💓",
      text: "你成了她训练场边的固定观众。她每进一个球，都会第一时间朝你的方向看；她的水瓶，也总是你帮她拿着。",
      next: "c2" },

    c2: { type: "line", chapter: "第二章 · 受伤", loc: "playground", speaker: "narrator", emoji: "🩹",
      text: "一场训练赛，她为了抢一个角球，被狠狠撞倒在地，半天没有站起来。球场一下子安静了。",
      next: "c2a" },
    c2a: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
      text: "她抱着脚踝，咬着牙没出声。",
      choices: [
        { label: "（第一个冲过去）别动，我背你去医务室！", eff: 2, flags: { carry: 1 }, next: "c2b" },
        { label: "（蹲下查看）很疼吗？我去找老师。", eff: 2, next: "c2c" }
      ] },
    c2b: { type: "line", loc: "clinic", emoji: "😳",
      text: "（她趴在你背上，没了平时的气势，声音闷闷的）……你跑得比我还快。我是不是很重？",
      next: "c2d" },
    c2c: { type: "line", loc: "clinic", emoji: "⚽",
      text: "（她看着你焦急的样子，反而笑了）别哭丧着脸，我江晚舟没那么娇气。（但她抓住你袖子的手，一直没松开）",
      next: "c2d" },
    c2d: { type: "line", loc: "clinic", speaker: "me", emoji: "🧑",
      text: "校医说是扭伤，要静养，不能再上场。她一听，脸色立刻沉了下来。",
      next: "c2e" },
    c2e: { type: "choice", loc: "clinic", speaker: "me", emoji: "🧑",
      text: "她的眼眶有点红，却强撑着。",
      choices: [
        { label: "比赛重要，可你更重要。先把伤养好。", eff: 2, flags: { care: 1 }, next: "c2f" },
        { label: "（每天帮她带饭、记笔记）这些交给我。", eff: 3, next: "c2f" }
      ] },
    c2f: { type: "line", loc: "classroom", speaker: "narrator", emoji: "🌤️",
      text: "接下来的日子，你每天帮她带饭、记笔记、扶她上下楼。她嘴上嫌你啰嗦，却把你做的每一件事，都记在了心里。",
      next: "c3" },

    c3: { type: "line", chapter: "第三章 · 推开", loc: "playground", speaker: "narrator", emoji: "🍂",
      text: "她伤好归队，却开始躲着你，训练时不再朝你看，吃饭也和队友坐在一起，好像在刻意和你保持距离。",
      next: "c3a" },
    c3a: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
      text: "你心里很不是滋味。",
      choices: [
        { label: "（直接拦住她）你为什么躲我？", eff: 1, next: "c3b" },
        { label: "（不追问，默默继续给她备水）", eff: 2, flags: { wait: 1 }, next: "c3_mope" }
      ] },
    c3b: { type: "line", loc: "playground", emoji: "⚽",
      text: "（她停下脚步，背对着你，声音很轻）……我怕。我怕你对我好，我会舍不得；更怕比赛一输，我连陪你的时间都没有。",
      next: "c3c" },
    c3c: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
      text: "她第一次显得这么没底气。",
      choices: [
        { label: "江晚舟，我喜欢你，不是让你分心的。", eff: 2, flags: { honest: 1 }, next: "c3d" },
        { label: "我可以等，等你踢完所有比赛。", eff: 2, next: "c3d" }
      ] },
    c3d: { type: "line", loc: "playground", emoji: "😳",
      text: "（她转过身，眼睛红红的，却笑了）……你这个人，怎么比我还直。（轻声）那你说的，要等我，可别反悔。",
      next: "c4" },
    c3_mope: { type: "line", loc: "playground", speaker: "narrator", emoji: "🥺",
      text: "你没再追问，只是每天把水放在她的位置上。第三天，她终于在你放完水转身时，从背后叫住了你。",
      next: "c3_mope2" },
    c3_mope2: { type: "line", loc: "playground", emoji: "⚽",
      text: "你是不是傻，我躲你，你就不会主动找我吗？（她声音发颤）……我只是怕拖累你，更怕你对我好，我就再也坚强不起来了。",
      next: "c3_mope3" },
    c3_mope3: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
      text: "她在你面前卸下了所有伪装。",
      choices: [
        { label: "在我面前，你不需要坚强。", eff: 2, next: "c3d" },
        { label: "我喜欢你，包括你不坚强的样子。", eff: 3, next: "c3d" }
      ] },

    c4: { type: "line", chapter: "第四章 · 决赛", loc: "playground", speaker: "narrator", emoji: "🏆",
      text: "市里的决赛，最后一分钟，比分还平着。她带球突破，全场屏息。就在出脚的瞬间，她看了一眼场边的你。",
      next: "c4a" },
    c4a: { type: "line", loc: "playground", emoji: "⚽",
      text: "球划出一道漂亮的弧线，应声入网。比赛结束——她们赢了。",
      next: "c4b" },
    c4b: { type: "line", loc: "playground", speaker: "me", emoji: "🧑",
      text: "她不顾一切地跑向场边，在所有人的欢呼里停在你面前，额头还淌着汗。",
      next: "c5" },

    c5: { type: "line", chapter: "第五章 · 心之所向", loc: "playground", speaker: "narrator", emoji: "🌇",
      text: "队友们在身后起哄，她把奖牌攥在手里，深吸一口气，抬头看你。",
      next: "c5a" },
    c5a: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
      text: "她在等你开口。",
      choices: [
        { label: "江晚舟，你赢了比赛，现在该我赢你了。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "你踢得最帅。以后，我当你一辈子的球迷。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "恭喜你，队长，你真的很厉害。", flags: { friend: 1 }, next: "c5_judge" }
      ] },
    c5_judge: { type: "router",
      route: function (s) {
        if (s.flags.friend) return "end_friend";
        if (s.affinity >= 7) return "end_sweet";
        if (s.affinity >= 4) return "end_normal";
        return "end_miss";
      } },
    end_sweet: { type: "end", emoji: "⚽",
      title: "结局 · 我把胜利踢给你",
      text: "她大笑起来，把奖牌一把挂到你脖子上，顺势抱住你：“听见没，这球是踢给你的！以后我的每场球，你都得在场。” 夕阳下，她的球衣还带着汗，可你觉得，那是全世界最帅的拥抱。" },
    end_normal: { type: "end", emoji: "🌤️",
      title: "结局 · 加时赛",
      text: "她红着脸，挠了挠头：“这种事，你让我先想一晚上……不对，我江晚舟踢球从来不怕，怎么到你这儿就怂了。你等我赢完下一场，我给你答案。”" },
    end_friend: { type: "end", emoji: "🤝",
      title: "结局 · 头号球迷",
      text: "她咧嘴一笑，拍了拍你的肩：“那你就是我封的头号球迷，终身制！” 有些感情停在了友情，可你依旧是她望向看台时，第一个寻找的人。" },
    end_miss: { type: "end", emoji: "🍂",
      title: "结局 · 没接住的传球",
      text: "她张了张嘴，最后只说了句“谢谢你这段时间”，转身被队友簇拥着离开。后来她的每一场比赛，看台上都少了一个固定的身影。" }
  };

  /* ══════════════════════════════════════════════════════════
     岑诺 · 辩论社社长（🗣️ 毒舌、逻辑缜密，嘴硬心软）
     辩论赛交锋→一起备赛→她偷偷照顾你→误会（她帮别人写稿）→告白
     ══════════════════════════════════════════════════════════ */
  var NUO = {
    c0: { type: "line", chapter: "序章", loc: "classroom", speaker: "narrator", emoji: "🍂",
      text: "年级辩论赛，你被临时拉去当观众提问。站起来时，你紧张得说错了一个概念，引来一片轻笑。对面的一辩女生却微微挑眉，没有嘲笑你。",
      next: "c0a" },
    c0a: { type: "line", loc: "classroom", emoji: "🗣️",
      text: "（赛后，她走到你面前，抱着一摞资料）我叫岑诺，辩论社社长。你刚才那个问题，其实角度很好，只是术语用错了。想知道怎么改吗？",
      next: "c0b" },
    c0b: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她说话一针见血，却没有恶意。",
      choices: [
        { label: "想，你愿意教我吗？", tag: "认真", eff: 2, next: "c0c" },
        { label: "（笑）你是不是觉得我挺笨的？", tag: "坦诚", eff: 1, next: "c0d" }
      ] },
    c0c: { type: "line", loc: "classroom", emoji: "🗣️",
      text: "（她愣了一下，似乎没想到你这么直接，随即勾起嘴角）……孺子可教。明天放学后，图书馆，我给你补十分钟。别迟到，我不等人。",
      next: "c1" },
    c0d: { type: "line", loc: "classroom", emoji: "🗣️",
      text: "（她推了推资料，语气平淡）笨不笨是另一回事，肯不肯学才是关键。你要是想搞清楚，明天图书馆，我多说的这十分钟，不收费。",
      next: "c1" },

    c1: { type: "line", chapter: "第一章 · 备赛", loc: "library", speaker: "narrator", emoji: "🌙",
      text: "你才知道，辩论社要准备市里的决赛，岑诺是主力一辩。她每天泡在图书馆，资料摊得满满一桌，逻辑严谨得让人喘不过气。",
      next: "m1" },
    m1: { type: "map", loc: "library",
      text: "【课余时间】她几乎都在图书馆和辩论社备赛。",
      guide: "陪她备赛、帮她找资料、做她的对手帮她演练，她会从毒舌变成偶尔的柔软。",
      cells: [
        { loc: "library", target: "l1_lib", rec: true },
        { loc: "classroom", target: "l1_cls", rec: true },
        { loc: "garden", target: "l1_g", rec: true },
        { loc: "canteen", target: "l1_c" },
        { loc: "rooftop", target: "l1_r" }
      ] },
    l1_lib: { type: "line", loc: "library", speaker: "narrator", emoji: "📚",
      text: "她正在和队友争论一个论点，语速飞快，对方都被她问得哑口无言。她看见你，递来一沓资料。",
      next: "l1_lib_a" },
    l1_lib_a: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
      text: "那是她标满批注的辩词。",
      choices: [
        { label: "我帮你找反方的资料，提前预判。", eff: 2, next: "l1_lib_b" },
        { label: "我当你的对手，你拿我练攻辩。", eff: 2, next: "l1_lib_c" }
      ] },
    l1_lib_b: { type: "line", loc: "library", emoji: "🗣️",
      text: "（她看你一眼，眼神里闪过一丝赞许）……你倒是比我那几个队友上道。资料找齐了，我请你喝奶茶。",
      next: "m1b" },
    l1_lib_c: { type: "line", loc: "library", emoji: "🗣️",
      text: "（她勾起嘴角）好，你尽管问，问倒我算你赢。（几个回合下来，她忽然停下来，看着你）……你这几个问题，比我预想的锋利。",
      next: "m1b" },
    l1_cls: { type: "line", loc: "classroom", speaker: "narrator", emoji: "📝",
      text: "午休，你发现她趴在桌上睡着了，手边的稿子还没写完，眼镜歪在一边。",
      next: "l1_cls_a" },
    l1_cls_a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她大概又熬到很晚。",
      choices: [
        { label: "（轻轻把外套披在她身上，关好窗）", eff: 3, flags: { coat: 1 }, next: "l1_cls_b" },
        { label: "帮她把散落的资料整理好", eff: 2, next: "l1_cls_c" }
      ] },
    l1_cls_b: { type: "line", loc: "classroom", emoji: "😳",
      text: "（她醒来后，抱着那件外套，耳根微红，却故作镇定）……谁让你乱动我东西的。（顿了顿，把外套叠好，小声）……谢了，很暖。",
      next: "m1b" },
    l1_cls_c: { type: "line", loc: "classroom", emoji: "🗣️",
      text: "（她看着整理好的资料，语气难得柔和）……你居然把顺序都理清楚了。（小声）比我自己还细心。",
      next: "m1b" },
    l1_g: { type: "line", loc: "garden", speaker: "narrator", emoji: "🌿",
      text: "小花园里，她一个人对着空气练开场陈词，语速极快，像在背一篇精密的文章。",
      next: "l1_g_a" },
    l1_g_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "她连放松都在备赛。",
      choices: [
        { label: "你已经背得很熟了，歇会儿吧。", eff: 2, next: "l1_g_b" },
        { label: "（坐在旁边安静听）", eff: 2, next: "l1_g_b" }
      ] },
    l1_g_b: { type: "line", loc: "garden", emoji: "🗣️",
      text: "（她停下，看了你一眼，轻声）……你在这儿，我反而背不下去了。（顿了顿）因为我会在意你有没有在听。",
      next: "m1b" },
    l1_c: { type: "line", loc: "canteen", emoji: "🍚",
      text: "她打饭时还在默念辩词，差点撞到窗口。你伸手帮她稳住餐盘，她别扭地说了句：“……多管闲事。” 耳朵却红了。",
      next: "m1b" },
    l1_r: { type: "line", loc: "rooftop", emoji: "🌆",
      text: "天台，她难得放下资料，望着远处：“我说话太直，朋友都说我毒舌。你……不嫌我烦？”",
      next: "m1b" },
    m1b: { type: "line", loc: "library", speaker: "narrator", emoji: "💓",
      text: "渐渐地，她的毒舌只对别人，对你却总是话到嘴边又咽回去。她会在你杯子空了时默默添水，会在你犯困时把提醒写在便利贴上。",
      next: "c2" },

    c2: { type: "line", chapter: "第二章 · 软处", loc: "library", speaker: "narrator", emoji: "🌙",
      text: "决赛前一周，你感冒了还硬撑着陪她查资料，第二天直接在图书馆打起了喷嚏，头昏脑涨。",
      next: "c2a" },
    c2a: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
      text: "你不想在她备赛的关键时刻添麻烦。",
      choices: [
        { label: "没事，小感冒，我还能帮你找资料。", eff: 1, next: "c2b" },
        { label: "（撑着，却还是咳了几声）", eff: 1, next: "c2b" }
      ] },
    c2b: { type: "line", loc: "library", emoji: "🗣️",
      text: "（她“啪”地合上资料，第一次对你用了不容反驳的语气）……你是猪吗？都烧成这样了还逞强。坐下，别动。",
      next: "c2c" },
    c2c: { type: "line", loc: "library", speaker: "me", emoji: "🧑",
      text: "她放下手头所有的事，去医务室拿了药，又去食堂打了热粥，盯着你一口一口喝完。",
      next: "c2d" },
    c2d: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
      text: "她忙前忙后，嘴上还在数落你。",
      choices: [
        { label: "你对我这么好，会让我误会的。", eff: 2, flags: { tease: 1 }, next: "c2e" },
        { label: "谢谢，岑诺。你其实很温柔。", eff: 2, next: "c2e" }
      ] },
    c2e: { type: "line", loc: "library", emoji: "😳",
      text: "（她动作一顿，别过脸，声音又冷又乱）……少自作多情。我只是、只是不想我唯一的陪练病倒。（可她把药片分好的手，格外认真）",
      next: "c3" },

    c3: { type: "line", chapter: "第三章 · 误会", loc: "classroom", speaker: "narrator", emoji: "🍂",
      text: "决赛前几天，你看见她在走廊，把一份写得工工整整的稿子递给了隔壁班的一个男生，还耐心地讲了很久。",
      next: "c3a" },
    c3a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她从来没为你写过稿子。",
      choices: [
        { label: "（直接问她）那份稿子，是给谁的？", eff: 1, next: "c3b" },
        { label: "（没问，心里憋着）", eff: 0, flags: { mope: 1 }, next: "c3_mope" }
      ] },
    c3b: { type: "line", loc: "classroom", emoji: "🗣️",
      text: "（她挑眉，瞬间看穿）……你在不高兴？（停顿）那是我表弟，他参加初中的辩论赛，求我帮他改稿。怎么，你吃醋了？",
      next: "c3c" },
    c3c: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她把问题摆到了台面上。",
      choices: [
        { label: "……是。我希望你写的稿子，第一个给我看。", eff: 2, flags: { honest: 1 }, next: "c3d" },
        { label: "没有，我随便问问。", eff: 0, next: "c3_e" }
      ] },
    c3d: { type: "line", loc: "classroom", emoji: "😳",
      text: "（她难得地被噎住，耳尖微红，随即扬起下巴）……幼稚。（声音却轻了）……不过，你要是愿意，我决赛的开场陈词，第一个读给你听。",
      next: "c4" },
    c3_e: { type: "line", loc: "classroom", emoji: "🗣️",
      text: "（她盯着你，语气犀利）你不诚实。（顿了顿）……你要是真那么在意，我以后的稿子，你都有资格第一个看。满意了？",
      next: "c4" },
    c3_mope: { type: "line", loc: "library", speaker: "narrator", emoji: "🥺",
      text: "你连着几天没去图书馆。决赛前一天，她直接抱着一摞资料，堵住了你的去路，眼神又冷又急。",
      next: "c3_mope2" },
    c3_mope2: { type: "line", loc: "library", emoji: "🗣️",
      text: "你给我解释一下，为什么躲我？（她把稿子拍在桌上）我给我表弟改个稿，你就给我玩消失？岑诺我从不解释第二遍，今天为你破例。",
      next: "c3_mope3" },
    c3_mope3: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
      text: "她眼底有委屈，也有不肯低头的倔强。",
      choices: [
        { label: "对不起，是我喜欢你，喜欢到会乱吃醋。", eff: 2, next: "c3d" },
        { label: "我最近在忙别的，没躲你。", eff: 0, next: "c4" }
      ] },

    c4: { type: "line", chapter: "第四章 · 决赛", loc: "classroom", speaker: "narrator", emoji: "🏆",
      text: "辩论赛决赛现场，攻辩环节到了最激烈的时候。对方步步紧逼，岑诺却站起身，目光扫过全场，最后落在你身上，然后从容开口。",
      next: "c4a" },
    c4a: { type: "line", loc: "classroom", emoji: "🗣️",
      text: "她逻辑清晰、攻守兼备，一句句把对方的论点拆解殆尽。全场掌声雷动——她们赢了。",
      next: "c5" },

    c5: { type: "line", chapter: "第五章 · 心之所向", loc: "garden", speaker: "narrator", emoji: "🌿",
      text: "赛后，她抱着奖杯，在小花园等你，没有了赛场上的锋芒，只是把一张纸递给你。",
      next: "c5a" },
    c5a: { type: "line", loc: "garden", emoji: "🗣️",
      text: "这是我决赛开场陈词的原稿。（她别过脸）……第一页，念给你听。",
      next: "c5b" },
    c5b: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "你翻开第一页，上面写着：“我赢得了所有的辩论，却想在你面前，放下所有的论证。”",
      choices: [
        { label: "岑诺，我喜欢你。不用论证，这是我唯一的结论。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "以后别再毒舌推开我，让我留在你身边。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "恭喜你，你是我见过最厉害的辩手。", flags: { friend: 1 }, next: "c5_judge" }
      ] },
    c5_judge: { type: "router",
      route: function (s) {
        if (s.flags.friend) return "end_friend";
        if (s.affinity >= 7) return "end_sweet";
        if (s.affinity >= 4) return "end_normal";
        return "end_miss";
      } },
    end_sweet: { type: "end", emoji: "🗣️",
      title: "结局 · 无需论证的结论",
      text: "她的眼眶一下子红了，却还要嘴硬：“……这句话，我准备了无数个论点，却没有一个能用来反驳你。” 她低下头，把奖杯塞进你手里，轻声说：“我认输。这场，我心甘情愿输给你。”" },
    end_normal: { type: "end", emoji: "🌤️",
      title: "结局 · 休庭",
      text: "她难得地卡了壳，过了好一会儿才开口：“……这个命题太重大，我需要一点时间，准备一份完整的答辩。” 她抬起头，眼神却带着笑意，“但你可以先期待一下，我不会让你输。”" },
    end_friend: { type: "end", emoji: "🤝",
      title: "结局 · 最佳陪练",
      text: "她挑了挑眉，恢复了那副从容：“那你就是我亲自认证的最佳陪练，终身有效。” 有些话没有说出口，却藏在了她每一篇稿子的第一页。" },
    end_miss: { type: "end", emoji: "🍂",
      title: "结局 · 没有上诉的判决",
      text: "她沉默了很久，把稿子轻轻收回，只说了一句“谢谢”，然后转身离开。她的毒舌后来依旧犀利，只是再也没有为谁，放下过论证。" }
  };

  registerHeroine(
    { id: "jia", name: "江晚舟", emoji: "⚽", color: "#5fc7a3",
      tag: "女足队长 · 飒爽阳光", desc: "校女足队长，比男生还拼，平时大大咧咧、讲义气，受伤和逞强时，才会露出柔软的一面。",
      bank: [
        { kws: ["踢球", "足球", "比赛", "训练", "球场"], reps: ["放学球场，缺个捡球的，你来不来？", "我把每个球都踢给你看。"] },
        { kws: ["喜欢", "表白", "在一起"], reps: ["你赢了比赛，现在该你赢我了。", "我踢球从来不怂，到你这儿……另说。"] },
        { kws: ["受伤", "疼", "扭伤", "照顾"], reps: ["小伤，别大惊小怪……不过你扶我，我不拒绝。"] }
      ],
      fallback: ["行，够意思。", "废话不多说。", "看我踢球。"] },
    JIA
  );
  registerHeroine(
    { id: "nuo", name: "岑诺", emoji: "🗣️", color: "#b08ae0",
      tag: "辩论社社长 · 毒舌犀利", desc: "逻辑缜密、说话一针见血的辩论社社长，看似毒舌难接近，却会在你生病时放下所有事，嘴硬心软。",
      bank: [
        { kws: ["辩论", "辩论社", "攻辩", "辩题", "逻辑"], reps: ["明天图书馆，我多说十分钟，教你。", "你的问题角度不错，只是术语用错了。"] },
        { kws: ["喜欢", "表白", "在一起"], reps: ["这句话我准备了无数论点，却没有一个能反驳你。", "我认输，心甘情愿输给你。"] },
        { kws: ["生病", "感冒", "逞强", "照顾", "吃药"], reps: ["烧成这样还逞强，你是猪吗？坐下，把药吃了。"] }
      ],
      fallback: ["……嗯。", "幼稚。", "孺子可教。"] },
    NUO
  );
});


/* ===== p58_story5.js ===== */
/* ══════════════════════════════════════════════════════════
   p58 · 剧情扩容第四批：两位女主完整长篇
   桑榆（舞蹈社，台上自信台下迷糊）/ 苗妙（英语课代表·口语社，活泼冷幽默）
   节点 schema 严格对齐 5.6 剧情引擎
   ══════════════════════════════════════════════════════════ */
X565.register("story-565-4", function () {
  var SC = window.X56Story;
  var CC = window.X56StoryContent;
  if (!SC || !CC) return;

  function registerHeroine(h, book) {
    if (!SC.byId(h.id)) SC.heroines.push(h);
    CC[h.id] = book;
    if (window.X56Date) {
      if (!window.X56Date.heroineMeta) window.X56Date.heroineMeta = {};
      window.X56Date.heroineMeta[h.id] = { name: h.name, emoji: h.emoji, color: h.color };
      if (window.X56Date.order && window.X56Date.order.indexOf(h.id) < 0) window.X56Date.order.push(h.id);
    }
    if (window.X56Core && window.X56Core.roster) {
      var exist = window.X56Core.roster.map(function (p) { return p.id; });
      if (exist.indexOf(h.id) < 0) window.X56Core.roster.push({ id: h.id, name: h.name, emoji: h.emoji, tag: h.tag, bio: h.desc });
    }
    if (window.X56Moments && window.X56Moments.npcs) {
      window.X56Moments.npcs[h.id] = { name: h.name, emoji: h.emoji, bg: "linear-gradient(135deg," + h.color + "," + h.color + "cc)" };
    }
    if (window.X56MomentsExtra && window.X56MomentsExtra.npcNames && window.X56MomentsExtra.npcNames.indexOf(h.name) < 0) {
      window.X56MomentsExtra.npcNames.push(h.name);
    }
    if (window.X56Chat && window.X56Chat.scriptOrder && window.X56Chat.scriptOrder.indexOf(h.id) < 0) {
      window.X56Chat.scriptOrder.push(h.id);
    }
    if (window.X565WXData && window.X565WXData.contacts) {
      var has = window.X565WXData.contacts.some(function (c) { return c.id === h.id; });
      if (!has) {
        window.X565WXData.contacts.push({
          id: h.id, name: h.name, emoji: h.emoji, bg: "linear-gradient(135deg," + h.color + "," + h.color + "cc)",
          tag: h.tag, sig: h.desc, warm: 2, greeting: [],
          bank: h.bank || [], fallback: h.fallback || ["嗯。", "我在。"], sys: ""
        });
      }
    }
  }

  /* ══════════════════════════════════════════════════════════
     桑榆 · 舞蹈社（💃 台上自信耀眼，台下迷糊爱忘事）
     练功房相遇→帮她捡东西/记动作→脚伤照顾→误会（她与男搭档）→汇报演出告白
     ══════════════════════════════════════════════════════════ */
  var SANG = {
    c0: { type: "line", chapter: "序章", loc: "musicroom", speaker: "narrator", emoji: "🍂",
      text: "放学后，你路过形体房，门没关严。里面一个女孩正对着镜子练舞，旋转、跳跃，像一只发光的蝶。一曲终了，她却一个踉跄，差点摔倒，发带和水杯撒了一地。",
      next: "c0a" },
    c0a: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "你就站在门口。",
      choices: [
        { label: "（推门进去，帮她捡东西）没事吧？", tag: "上前", eff: 2, next: "c0b" },
        { label: "（敲了敲门，递回滚到脚边的水杯）", tag: "克制", eff: 2, next: "c0c" }
      ] },
    c0b: { type: "line", loc: "musicroom", emoji: "💃",
      text: "（她抬头，头发有点乱，却笑得很甜）哎呀，被你看到我出丑了。我叫桑榆，舞蹈社的。你看——我刚才那个转圈是不是很帅？可惜收尾没站稳。",
      next: "c1" },
    c0c: { type: "line", loc: "musicroom", emoji: "💃",
      text: "（她接过水杯，眼睛弯起来）谢谢！你是路过的吧？我叫桑榆。（小声）……你来得正好，帮我看看，我动作到底顺不顺，我自己照镜子总觉得别扭。",
      next: "c1" },

    c1: { type: "line", chapter: "第一章 · 练功房", loc: "musicroom", speaker: "narrator", emoji: "🎵",
      text: "学校艺术节要排一支独舞，桑榆是主角。从那以后，你常看见她在形体房练到很晚，一遍又一遍，直到每个动作都干净利落。",
      next: "m1" },
    m1: { type: "map", loc: "musicroom",
      text: "【课余时间】她几乎都在形体房排练。",
      guide: "陪她排练、帮她看动作、记着她忘带的东西，她会越来越依赖你。",
      cells: [
        { loc: "musicroom", target: "l1_m", rec: true },
        { loc: "canteen", target: "l1_c", rec: true },
        { loc: "garden", target: "l1_g", rec: true },
        { loc: "clinic", target: "l1_cl" },
        { loc: "rooftop", target: "l1_r" }
      ] },
    l1_m: { type: "line", loc: "musicroom", speaker: "narrator", emoji: "💃",
      text: "她在练一段快速旋转，转了一次又一次，停下来时扶着镜子，脸色发白。",
      next: "l1_m_a" },
    l1_m_a: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "她转得太狠了。",
      choices: [
        { label: "先停下，喝口水，别硬转。", eff: 2, next: "l1_m_b" },
        { label: "我帮你数着，你转三圈就停。", eff: 2, next: "l1_m_b" }
      ] },
    l1_m_b: { type: "line", loc: "musicroom", emoji: "💃",
      text: "（她听话地停下来，喘着气笑）……奇怪，舞蹈老师的话我都敢顶，你一开口我就乖乖照做。（接过水，轻声）有你在，我好像没那么急了。",
      next: "m1b" },
    l1_c: { type: "line", loc: "canteen", speaker: "narrator", emoji: "🍚",
      text: "食堂里，她翻遍了舞蹈包，一脸沮丧：“糟了，我的饭卡又忘在练功房了……”",
      next: "l1_c_a" },
    l1_c_a: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
      text: "她的迷糊劲儿又犯了。",
      choices: [
        { label: "我帮你刷，你先去坐着。", eff: 2, next: "l1_c_b" },
        { label: "我陪你回练功房拿。", eff: 2, next: "l1_c_b" }
      ] },
    l1_c_b: { type: "line", loc: "canteen", emoji: "💃",
      text: "（她双手合十，做了个夸张的感谢动作）桑榆的命是你救的！（坐下，小声）……我什么都能忘，就是不会忘了你。",
      next: "m1b" },
    l1_g: { type: "line", loc: "garden", speaker: "narrator", emoji: "🌿",
      text: "小花园里，她蹲在地上系舞鞋的带子，系了好几次都松，最后干脆把脸埋进膝盖。",
      next: "l1_g_a" },
    l1_g_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "她有点泄气。",
      choices: [
        { label: "（蹲下，帮她系好舞鞋）我来。", eff: 2, next: "l1_g_b" },
        { label: "别急，我教你一个打死结的办法。", eff: 2, next: "l1_g_b" }
      ] },
    l1_g_b: { type: "line", loc: "garden", emoji: "😳",
      text: "（她看着你低头帮她系鞋带的样子，安静了好一会儿，小声）……你认真的样子，比我在台上还好看。",
      next: "m1b" },
    l1_cl: { type: "line", loc: "clinic", emoji: "🩹",
      text: "医务室门口，她的脚踝贴着膏药，却还想回去练：“就差一点了，我能行。”",
      next: "m1b" },
    l1_r: { type: "line", loc: "rooftop", emoji: "🌆",
      text: "天台上，她难得安静地坐着：“别人都以为我上台从不紧张，其实我每次都怕跳错。”",
      next: "m1b" },
    m1b: { type: "line", loc: "musicroom", speaker: "narrator", emoji: "💓",
      text: "你成了她的“专属后勤”：帮她记着忘带的发带、水、饭卡，在她转圈时为她数拍。台上的她光芒万丈，台下的她，却越来越依赖你。",
      next: "c2" },

    c2: { type: "line", chapter: "第二章 · 脚伤", loc: "musicroom", speaker: "narrator", emoji: "🩹",
      text: "汇报演出前一周，她在排练一个高难度托举动作时，脚踝崴了，重重摔在地板上。你冲进去时，她正咬着牙，眼泪在眼眶里打转。",
      next: "c2a" },
    c2a: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "她想站起来，却疼得缩回去。",
      choices: [
        { label: "别动，我扶你去医务室。", eff: 2, flags: { care: 1 }, next: "c2b" },
        { label: "（脱下外套垫在她脚下）", eff: 2, next: "c2b" }
      ] },
    c2b: { type: "line", loc: "clinic", emoji: "💃",
      text: "（她坐在医务室，终于忍不住红了眼眶）……下周就要演出了，我不能在这个时候受伤。（声音发抖）我准备了那么久。",
      next: "c2c" },
    c2c: { type: "choice", loc: "clinic", speaker: "me", emoji: "🧑",
      text: "她最怕的不是疼，是错过舞台。",
      choices: [
        { label: "演出会等你的，先把脚养好，我陪你。", eff: 2, next: "c2d" },
        { label: "实在不行，我帮你向老师申请延期。", eff: 2, next: "c2d" }
      ] },
    c2d: { type: "line", loc: "musicroom", speaker: "narrator", emoji: "🌤️",
      text: "那些天，你每天陪她做恢复训练，帮她热敷、计时、记动作。她不能跳的时候，你就在旁边陪她用手比划。她看着你，眼神一点点亮起来。",
      next: "c3" },

    c3: { type: "line", chapter: "第三章 · 误会", loc: "musicroom", speaker: "narrator", emoji: "🍂",
      text: "她的脚好了一些，你却看见她和一个男搭档在排练托举动作，对方搂着她的腰，把她高高举起。她笑得很开心。",
      next: "c3a" },
    c3a: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "你站在门口，心里堵得慌。",
      choices: [
        { label: "（转身离开）", eff: 0, flags: { mope: 1 }, next: "c3_mope" },
        { label: "（等她排练完，问那个动作）", eff: 1, next: "c3b" }
      ] },
    c3b: { type: "line", loc: "musicroom", emoji: "💃",
      text: "（她顺着你的目光看过去，立刻明白了，跑过来拉住你）你想哪去了？那是舞蹈老师安排的搭档，托举动作必须有人配，我跟他一句话都不多说的。",
      next: "c3c" },
    c3c: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "她急得脸都红了。",
      choices: [
        { label: "……是我吃醋了，我不喜欢别人碰你。", eff: 2, flags: { honest: 1 }, next: "c3d" },
        { label: "我没事，就是有点突然。", eff: 0, next: "c3_e" }
      ] },
    c3d: { type: "line", loc: "musicroom", emoji: "😳",
      text: "（她愣住，随即笑出声，眼睛弯成月牙）……原来你也会这样。（她踮起脚，凑到你耳边小声）那我以后，只跳给你一个人看。",
      next: "c4" },
    c3_e: { type: "line", loc: "musicroom", emoji: "💃",
      text: "（她盯着你，认真地说）你骗不了我。（牵起你的手）那你记住，舞台上的我是节目的，台下的我——只想找你。",
      next: "c4" },
    c3_mope: { type: "line", loc: "musicroom", speaker: "narrator", emoji: "🥺",
      text: "你连着两天没去看她排练。第三天，她顾不上换练功服，一瘸一拐地堵在你班门口。",
      next: "c3_mope2" },
    c3_mope2: { type: "line", loc: "musicroom", emoji: "💃",
      text: "你为什么躲我？（她声音发颤）那个搭档是老师安排的！你要是在意，就直接说，别让我一个人练完，还找不到你。",
      next: "c3_mope3" },
    c3_mope3: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "她脚还没好，就急着跑来。",
      choices: [
        { label: "对不起，是我喜欢你，喜欢到失去理智。", eff: 2, next: "c3d" },
        { label: "我只是这两天忙。", eff: 0, next: "c4" }
      ] },

    c4: { type: "line", chapter: "第四章 · 舞台", loc: "musicroom", speaker: "narrator", emoji: "🏆",
      text: "艺术节汇报演出，聚光灯亮起。她站在舞台中央，深吸一口气，目光扫过台下，找到了你，然后露出一个安心的微笑。",
      next: "c4a" },
    c4a: { type: "line", loc: "musicroom", emoji: "💃",
      text: "她旋转、跳跃，每一个动作都干净利落。最后一个高难度动作，她稳稳落地，全场掌声雷动。",
      next: "c5" },

    c5: { type: "line", chapter: "第五章 · 心之所向", loc: "musicroom", speaker: "narrator", emoji: "🌷",
      text: "谢幕后，她抱着一束花跑下台，妆都没卸，径直跑到你面前，喘着气，眼睛亮晶晶的。",
      next: "c5a" },
    c5a: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
      text: "她还穿着舞裙，像一只发光的蝶。",
      choices: [
        { label: "桑榆，你是舞台上最亮的光，也是我心里的。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "我喜欢你。以后，你只跳给我看。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "你跳得太美了，恭喜演出成功。", flags: { friend: 1 }, next: "c5_judge" }
      ] },
    c5_judge: { type: "router",
      route: function (s) {
        if (s.flags.friend) return "end_friend";
        if (s.affinity >= 7) return "end_sweet";
        if (s.affinity >= 4) return "end_normal";
        return "end_miss";
      } },
    end_sweet: { type: "end", emoji: "💃",
      title: "结局 · 只跳给你看",
      text: "她把花塞进你怀里，踮起脚，在你耳边轻轻说：“这支舞，我从头到尾，都是跳给你看的。” 聚光灯还没暗，她在掌声里抱住你，像一只终于找到归宿的蝶。" },
    end_normal: { type: "end", emoji: "🌤️",
      title: "结局 · 谢幕之后",
      text: "她脸红了，把脸藏在花束后面：“……你等我卸完妆，再回答你行不行？今天太亮了，我怕你看不清我。” 你笑了，说好，反正你已经看得清清楚楚。" },
    end_friend: { type: "end", emoji: "🤝",
      title: "结局 · 第一排的观众",
      text: "她笑得灿烂，把最好的一张票塞给你：“那以后我的每一场，第一排都给你留着。” 有些喜欢没有说出口，却永远拥有最好的位置。" },
    end_miss: { type: "end", emoji: "🍂",
      title: "结局 · 没跳完的独舞",
      text: "她抱着花，在原地站了很久，最后轻轻说了句“谢谢”，转身跑回了后台。后来她的每一场演出，第一排都空着，那个位置再也没有补上。" }
  };

  /* ══════════════════════════════════════════════════════════
     苗妙 · 英语课代表/口语社（🌍 活泼开朗、爱讲冷笑话、自来熟）
     晨读领读→一起练口语→她怕你觉得她吵→误会（你和别人练英语）→演讲比赛告白
     ══════════════════════════════════════════════════════════ */
  var MIAO = {
    c0: { type: "line", chapter: "序章", loc: "classroom", speaker: "narrator", emoji: "🍂",
      text: "英语晨读，课代表站在讲台上领读。她声音清脆、表情夸张，还会配上手势，全班都被她逗得精神了。轮到你站起来读，一个长单词卡住了。",
      next: "c0a" },
    c0a: { type: "line", loc: "classroom", emoji: "🌍",
      text: "（她没有笑你，反而放慢语速，一个音节一个音节地带你读完，课后还蹦到你桌边）Hi！我叫苗妙，英语课代表。你刚才那个词，其实超简单，我教你个小窍门？",
      next: "c0b" },
    c0b: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她像一颗小太阳，自带热闹。",
      choices: [
        { label: "好啊，谢谢你，苗妙。", tag: "开朗", eff: 2, next: "c0c" },
        { label: "我英语口语很差，会不会很笨？", tag: "不自信", eff: 1, next: "c0d" }
      ] },
    c0c: { type: "line", loc: "classroom", emoji: "🌍",
      text: "（她打了个响指）No problem！（又笑着补中文）放心，我最擅长把笨办法变成好玩的办法。明天口语角，你可不许缺席。",
      next: "c1" },
    c0d: { type: "line", loc: "classroom", emoji: "🌍",
      text: "（她夸张地捂住胸口）谁说你笨我跟谁急！语言嘛，开口就赢了一半。（认真一点）明天来口语角，我陪你从最简单的句子开始。",
      next: "c1" },

    c1: { type: "line", chapter: "第一章 · 口语角", loc: "garden", speaker: "narrator", emoji: "🌿",
      text: "口语角在小花园的一角。苗妙是最活跃的人，她能把最枯燥的对话变成情景剧，还总在冷场时讲一个冷笑话，把大家逗笑。",
      next: "m1" },
    m1: { type: "map", loc: "garden",
      text: "【课余时间】她常在小花园、教室和图书馆练口语。",
      guide: "多开口、多和她对话，她会把最认真的耐心留给你。",
      cells: [
        { loc: "garden", target: "l1_g", rec: true },
        { loc: "classroom", target: "l1_c", rec: true },
        { loc: "library", target: "l1_l", rec: true },
        { loc: "canteen", target: "l1_ca" },
        { loc: "rooftop", target: "l1_r" }
      ] },
    l1_g: { type: "line", loc: "garden", speaker: "narrator", emoji: "🗣️",
      text: "她正在和外教用流利的英语对话，回头看到你，立刻招手：“Come here！今天的话题是 hobby，你的爱好是什么？”",
      next: "l1_g_a" },
    l1_g_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "你有点紧张。",
      choices: [
        { label: "（用磕磕绊绊的英语说出爱好）", eff: 2, next: "l1_g_b" },
        { label: "你能先说一遍，我跟着学吗？", eff: 2, next: "l1_g_b" }
      ] },
    l1_g_b: { type: "line", loc: "garden", emoji: "🌍",
      text: "（你说完后，她用力鼓掌，眼睛发亮）See？你完全可以！（小声）你比我第一次开口强多了，我当年把发音错得像在叫外星语。",
      next: "m1b" },
    l1_c: { type: "line", loc: "classroom", speaker: "narrator", emoji: "📝",
      text: "她的英语笔记本上，单词旁边画满了小漫画和记忆口诀，五颜六色的。",
      next: "l1_c_a" },
    l1_c_a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
      text: "她的笔记有趣得让人想背单词。",
      choices: [
        { label: "你这笔记能借我复印一份吗？", eff: 1, next: "l1_c_b" },
        { label: "我帮你把这些口诀整理成电子版吧。", eff: 2, next: "l1_c_b" }
      ] },
    l1_c_b: { type: "line", loc: "classroom", emoji: "🌍",
      text: "（她愣了一下，笑得很开心）你认真的？那太好了！（忽然有点不好意思）……其实我这么用心，是希望有人能看懂，也愿意一起用。",
      next: "m1b" },
    l1_l: { type: "line", loc: "library", speaker: "narrator", emoji: "📖",
      text: "图书馆里，她戴着耳机跟读，没注意到你走近，一抬头差点叫出声：“哎呀你吓死我了！我在练演讲比赛的稿子。”",
      next: "l1_l_a" },
    l1_l_a: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
      text: "她的稿子标满了停顿和重音。",
      choices: [
        { label: "我当你的听众，你练给我听。", eff: 2, next: "l1_l_b" },
        { label: "演讲比赛你一定没问题。", eff: 1, next: "l1_l_b" }
      ] },
    l1_l_b: { type: "line", loc: "library", emoji: "🌍",
      text: "（她眼睛一亮，又有点紧张）真的？……那你可不许笑我。（清了清嗓子，可你发现，她面对你时，声音反而比平时轻。）",
      next: "m1b" },
    l1_ca: { type: "line", loc: "canteen", emoji: "🍚",
      text: "她打饭时还在用英语自言自语，点错了菜，最后捧着一份不爱吃的苦瓜，苦着脸冲你笑。",
      next: "m1b" },
    l1_r: { type: "line", loc: "rooftop", emoji: "🌆",
      text: "天台上，她难得没有讲笑话，只是望着远处：“我话这么多，是不是很吵？有时候我怕，热闹是我的保护色。”",
      next: "m1b" },
    m1b: { type: "line", loc: "garden", speaker: "narrator", emoji: "💓",
      text: "你成了她最特别的练习对象。她会把新学的笑话第一个讲给你，也会在你开口说英语时，用最温柔的眼神鼓励你。她的热闹，渐渐只对你一个人认真。",
      next: "c2" },

    c2: { type: "line", chapter: "第二章 · 安静的一面", loc: "rooftop", speaker: "narrator", emoji: "🌙",
      text: "演讲比赛前一周，你在天台发现她一个人坐着，没有平时的笑脸，稿子被攥得皱巴巴的。",
      next: "c2a" },
    c2a: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
      text: "这是你第一次见她这么安静。",
      choices: [
        { label: "（在她身边坐下）怎么了，平时的小太阳呢？", eff: 1, next: "c2b" },
        { label: "（递一瓶水，不说话）", eff: 2, next: "c2c" }
      ] },
    c2b: { type: "line", loc: "rooftop", emoji: "🌍",
      text: "（她沉默了一会儿，轻声）……我怕。平时我吵吵闹闹，是怕冷场、怕别人觉得我没意思。可演讲比赛那天，我要一个人站在台上，说我真正想说的话。",
      next: "c2d" },
    c2c: { type: "line", loc: "rooftop", emoji: "🌍",
      text: "（她接过水，看着你，忽然有点鼻酸）……只有在你面前，我才敢不那么热闹。（轻声）我想讲的，是一个关于勇气的故事。",
      next: "c2d" },
    c2d: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
      text: "她卸下了所有的保护色。",
      choices: [
        { label: "你不吵，你很真实。我喜欢听你说任何话。", eff: 2, flags: { care: 1 }, next: "c2e" },
        { label: "你把故事讲给我一个人听，我帮你练。", eff: 2, next: "c2e" }
      ] },
    c2e: { type: "line", loc: "garden", speaker: "narrator", emoji: "🌤️",
      text: "接下来的日子，你成了她唯一的听众。她在你面前，一遍一遍讲那个关于勇气的故事，讲到后来，你甚至能背出每一个停顿。",
      next: "c3" },

    c3: { type: "line", chapter: "第三章 · 误会", loc: "garden", speaker: "narrator", emoji: "🍂",
      text: "你想多练口语，便找了口语社另一个女生一起练对话。苗妙远远看见你们有说有笑，整个人忽然安静了下来，转身走了。",
      next: "c3a" },
    c3a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "她连续两天没有来讲笑话，也没拉你去口语角。",
      choices: [
        { label: "（去找她）你这两天怎么不理我？", eff: 1, next: "c3b" },
        { label: "（继续和别人练，等她消气）", eff: 0, flags: { mope: 1 }, next: "c3_mope" }
      ] },
    c3b: { type: "line", loc: "garden", emoji: "🌍",
      text: "（她背对着你，声音闷闷的，没有平时的活泼）……你不是有人陪你练英语了吗？我又不是你唯一的练习对象。（顿了顿）你看，原来我也会小心眼。",
      next: "c3c" },
    c3c: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "她吃醋了。",
      choices: [
        { label: "我找她只是练口语，我真正想对话的人是你。", eff: 2, flags: { honest: 1 }, next: "c3d" },
        { label: "你是我最重要的人，苗妙。", eff: 3, next: "c3d" }
      ] },
    c3d: { type: "line", loc: "garden", emoji: "😳",
      text: "（她猛地转过身，眼圈有点红，却又笑了，笑着笑着用手背蹭了下眼睛）……你用英语说一遍，我就信。",
      next: "c3e" },
    c3e: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "她在考你。",
      choices: [
        { label: "You are the only person I want to talk to.（你是我唯一想对话的人）", eff: 3, flags: { en: 1 }, next: "c3_f" },
        { label: "（认真）我现在还说不流利，但我会为你学会。", eff: 2, next: "c3_f" }
      ] },
    c3_f: { type: "line", loc: "garden", emoji: "🌍",
      text: "（她愣住，随即脸涨得通红，平时的伶牙俐齿全不见了，只小声说）……你发音还得再练。（可她嘴角怎么也压不下去）",
      next: "c4" },
    c3_mope: { type: "line", loc: "garden", speaker: "narrator", emoji: "🥺",
      text: "你找了她好几天，最后在天台堵住她。她抱着膝盖，没有闹，只是安安静静地看着你。",
      next: "c3_mope2" },
    c3_mope2: { type: "line", loc: "garden", emoji: "🌍",
      text: "你是不是觉得，我平时那么热闹，就不会难过？（她声音很轻）……其实我最怕的，就是你习惯了别人的热闹。",
      next: "c3_mope3" },
    c3_mope3: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "她在你面前彻底卸下了伪装。",
      choices: [
        { label: "你的热闹和安静，我都喜欢。对不起，让你难过了。", eff: 2, next: "c3_d2" },
        { label: "我喜欢你，所以只会想和你说话。", eff: 2, next: "c3_d2" }
      ] },
    c3_d2: { type: "line", loc: "garden", emoji: "🌍",
      text: "（她破涕为笑，轻轻捶了你一下）……那你以后练英语，只能找我。这是我苗妙的规定。",
      next: "c4" },

    c4: { type: "line", chapter: "第四章 · 演讲", loc: "classroom", speaker: "narrator", emoji: "🏆",
      text: "英语演讲比赛，苗妙最后一个上场。她站在聚光灯下，目光在台下找到你，深吸一口气，然后没有用任何夸张的手势，只是安静而真诚地开口。",
      next: "c4a" },
    c4a: { type: "line", loc: "classroom", emoji: "🌍",
      text: "她讲的是一个关于勇气的故事——一个不敢开口的人，因为一个愿意倾听的人，第一次勇敢地说出了自己。全场安静，然后爆发出掌声。",
      next: "c5" },

    c5: { type: "line", chapter: "第五章 · 心之所向", loc: "garden", speaker: "narrator", emoji: "🌍",
      text: "比赛结束，她跑下台，没有像往常一样大声欢呼，而是走到你面前，有些紧张地问：“你……听懂了吗？故事里那个愿意倾听的人，是你。”",
      next: "c5a" },
    c5a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
      text: "她在等你的回答。",
      choices: [
        { label: "苗妙，I like you. 这句话，我练了很多遍。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "以后你可以不热闹，在我面前做你自己。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
        { label: "你的演讲很棒，你是最好的英语课代表。", flags: { friend: 1 }, next: "c5_judge" }
      ] },
    c5_judge: { type: "router",
      route: function (s) {
        if (s.flags.friend) return "end_friend";
        if (s.affinity >= 7) return "end_sweet";
        if (s.affinity >= 4) return "end_normal";
        return "end_miss";
      } },
    end_sweet: { type: "end", emoji: "🌍",
      title: "结局 · 我唯一的听众",
      text: "她的眼泪一下子涌出来，却笑着扑进你怀里：“I like you too！这句话，我也在心里练了无数遍。” 她在你耳边，用最流利也最温柔的英语，又轻轻说了一遍。这一次，她的热闹与安静，都只为你一个人。" },
    end_normal: { type: "end", emoji: "🌤️",
      title: "结局 · 再练一遍",
      text: "她脸红了，恢复了几分伶牙俐齿：“这句话我要打个分……发音 90 分，诚意 100 分。剩下的，你得再对我练一百遍。” 你笑着说好，你们有的是时间。" },
    end_friend: { type: "end", emoji: "🤝",
      title: "结局 · 永远的同桌口语",
      text: "她眨眨眼，露出招牌笑容：“那你就是我口语角的终身搭档！” 有些话没有说出口，却藏在每一个逗你笑的冷笑话里。" },
    end_miss: { type: "end", emoji: "🍂",
      title: "结局 · 没说出口的英语",
      text: "她安静了很久，最后只说了句“谢谢你做我的听众”，然后转身离开。后来她依旧在口语角里最热闹，只是再也没有把那个关于勇气的故事，讲给第二个人听。" }
  };

  registerHeroine(
    { id: "sang", name: "桑榆", emoji: "💃", color: "#e88ab0",
      tag: "舞蹈社 · 自信迷糊", desc: "台上发光、台下迷糊爱忘事的舞蹈社女孩，练舞时最拼，却会在你面前露出全部依赖。",
      bank: [
        { kws: ["跳舞", "舞蹈", "练功", "排练", "形体"], reps: ["来帮我看看这个动作顺不顺？", "你在这儿，我转圈就不晕了。"] },
        { kws: ["喜欢", "表白", "在一起"], reps: ["这支舞，我从头到尾都是跳给你看的。", "以后我只跳给你一个人看。"] },
        { kws: ["脚伤", "崴脚", "受伤", "忘带", "饭卡"], reps: ["我又忘带饭卡了，你救我！", "脚没事，你别紧张。"] }
      ],
      fallback: ["嘿嘿。", "你来看我啦？", "我有点记不住事。"] },
    SANG
  );
  registerHeroine(
    { id: "miao", name: "苗妙", emoji: "🌍", color: "#4fb8c9",
      tag: "英语课代表 · 活泼冷幽默", desc: "像小太阳一样热闹的英语课代表，冷笑话不断，却把最认真、最安静的一面，只留给愿意倾听的你。",
      bank: [
        { kws: ["英语", "口语", "单词", "演讲", "发音"], reps: ["No problem！开口就赢了一半。", "Come here，我教你个好玩的办法。"] },
        { kws: ["喜欢", "表白", "在一起"], reps: ["I like you too，这句话我练了无数遍。", "你是我唯一想对话的人。"] },
        { kws: ["吵", "热闹", "安静", "笑话", "紧张"], reps: ["我怕一不热闹，就没人在意我了。", "在你面前，我可以不热闹。"] }
      ],
      fallback: ["Hi 你好呀！", "我给你讲个冷笑话吧。", "Come on！"] },
    MIAO
  );
});


/* ===== p55_moments_feed.js ===== */
/* ============================================================================
   p55 · 朋友圈初始动态大扩充（seedFeed 追加，不覆盖）
   让 8 位女主 + 老师/服务号都有真实校园动态，含图、赞、评论、回复
   ============================================================================ */
register("moments-feed", function () {
  var M = window.X56Moments;
  if (!M) return;

  /* 补全新角色头像（p54 已注册的不覆盖） */
  var NPCS = {
    su: { name: "苏清颜", emoji: "🎹", bg: "linear-gradient(135deg,#cdd8ff,#9fb4f0)" },
    shen: { name: "沈知夏", emoji: "🌻", bg: "linear-gradient(135deg,#ffe2a0,#f6c879)" },
    lu: { name: "陆知意", emoji: "🔔", bg: "linear-gradient(135deg,#b9c8f5,#8aa3ef)" },
    yan: { name: "颜汐", emoji: "🎤", bg: "linear-gradient(135deg,#ffc8a8,#ff9f7e)" },
    tang: { name: "唐糖", emoji: "🍰", bg: "linear-gradient(135deg,#fbd89a,#f3b878)" },
    club: { name: "社团联合会", emoji: "🎪", bg: "linear-gradient(135deg,#a8e6cf,#7fd1ae)" },
    library: { name: "校图书馆", emoji: "📖", bg: "linear-gradient(135deg,#c8d8f5,#9fb8e8)" }
  };
  Object.keys(NPCS).forEach(function (id) {
    if (!M.npcs[id]) M.npcs[id] = NPCS[id];
  });

  function P(o) {
    return {
      id: o.id, who: o.who, time: o.time, loc: o.loc || "",
      text: o.text, imgs: o.imgs || [],
      likes: o.likes || [], comments: o.comments || []
    };
  }
  function I(e, g) { return { e: e, g: g }; }

  var extra = [
    P({ id: "s565-01", who: "su", time: "12分钟前", loc: "琴房",
      text: "这首曲子练了快一个月，终于能完整弹下来了。周末想在琴房录一遍，应该不会太丢人。",
      imgs: [I("🎹", 0), I("🎵", 6)],
      likes: ["王老师", "林晚", "唐糖", "颜汐"],
      comments: [
        { n: "颜汐", c: "我可以在广播站放一段吗？你弹得真的很好听" },
        { n: "苏清颜", c: "回复颜汐：……你先别笑，我录好了发你" }
      ] }),
    P({ id: "s565-02", who: "tang", time: "20分钟前", loc: "家政教室",
      text: "今天练的是草莓慕斯！奶油终于不塌啦，最成功的那一块，我想给一个一直帮我扶转盘的人🍓",
      imgs: [I("🍰", 3), I("🍓", 4), I("🥛", 1)],
      likes: ["林晚", "唐糖", "徐甜甜", "吴磊"],
      comments: [
        { n: "林晚", c: "看起来好甜！我也想学" },
        { n: "唐糖", c: "回复林晚：来呀，我教你，奶油分给你～" }
      ] }),
    P({ id: "s565-03", who: "yan", time: "35分钟前", loc: "广播站",
      text: "傍晚的点歌时段，最后一首是我自己加的，没有署名。点给那个总在傍晚路过广播窗、会停下来听的人。",
      imgs: [I("🎤", 0), I("🌅", 6), I("🎧", 2)],
      likes: ["苏清颜", "林晚", "周子航"],
      comments: [
        { n: "林晚", c: "好浪漫……是谁呀" },
        { n: "颜汐", c: "回复林晚：（笑）是秘密" }
      ] }),
    P({ id: "s565-04", who: "lu", time: "48分钟前", loc: "学生会办公室",
      text: "文化节方案改到第七版，流程和预算终于对平了。谢谢帮我核到半夜的人，这次活动，我想给你一个不用登记的位置。",
      imgs: [I("📋", 5), I("🔔", 0), I("💻", 2)],
      likes: ["王老师", "陈墨", "徐甜甜", "陆知意"],
      comments: [
        { n: "王老师", c: "辛苦了，方案很严谨，按这个推进" },
        { n: "陈墨", c: "会长威武！缺人搬桌子喊我" }
      ] }),
    P({ id: "s565-05", who: "shen", time: "1小时前", loc: "校门口",
      text: "某人又没带伞，在柱子后面躲雨。我先去买了，你站着别动，淋湿了又要感冒。",
      imgs: [I("🌧️", 2), I("☔", 4)],
      likes: ["林晚", "陈墨", "吴磊"],
      comments: [
        { n: "陈墨", c: "这不就是那个发小吗哈哈哈哈" },
        { n: "沈知夏", c: "回复陈墨：多管闲事，打球去" }
      ] }),
    P({ id: "s565-06", who: "lin", time: "1小时前", loc: "图书馆",
      text: "窗边的位置真好，阳光斜斜地照进来，书页都暖了。今天读完了《海子诗选》，想把最喜欢的一句抄给某个人。",
      imgs: [I("📖", 1), I("🌸", 4), I("☀️", 6)],
      likes: ["赵小雨", "苏清颜", "唐糖", "徐甜甜"],
      comments: [{ n: "赵小雨", c: "抄给我抄给我，我配画！" }] }),
    P({ id: "s565-07", who: "zhao", time: "2小时前", loc: "美术教室",
      text: "偷偷画了一个人认真的侧脸，没有署名，夹在画夹最里面。敢说出去我就把你画成鬼脸。",
      imgs: [I("🎨", 4), I("✏️", 1), I("🖼️", 0)],
      likes: ["林晚", "周子航", "徐甜甜"],
      comments: [
        { n: "周子航", c: "画的谁啊这么神秘" },
        { n: "赵小雨", c: "回复周子航：画你的鬼脸！别问了" }
      ] }),
    P({ id: "s565-08", who: "xu", time: "2小时前", loc: "操场",
      text: "下午和人打了场单挑，险胜，输的人请喝水。今天手感不错，三分球连进三个，谁放学来挑战我？",
      imgs: [I("🏀", 2), I("🏃", 0), I("🥤", 5)],
      likes: ["陈墨", "吴磊", "周子航"],
      comments: [
        { n: "陈墨", c: "我来！这次一定赢回来" },
        { n: "吴磊", c: "许哥手下留情" }
      ] }),
    P({ id: "s565-09", who: "club", time: "3小时前", loc: "社团广场",
      text: "本周社团活动一览：周一辩论社、周二摄影社、周三烘焙社、周四篮球社、周五广播社。想加社的同学直接来广场填表，社团多多，欢迎光临！",
      imgs: [I("🎪", 4), I("📷", 6), I("🏀", 2), I("🎂", 3)],
      likes: ["校园广播站", "唐糖", "陈墨", "颜汐", "陆知意"],
      comments: [
        { n: "唐糖", c: "烘焙社在周三！我准备了曲奇试吃" },
        { n: "颜汐", c: "广播社也收人哦，喜欢念稿的来" }
      ] }),
    P({ id: "s565-10", who: "library", time: "3小时前", loc: "校图书馆",
      text: "本周新增一批文学与科普书籍，靠窗自习区已开放到 21:00。文明自习，离开时记得带走水杯、把椅子轻轻归位。",
      imgs: [I("📚", 1), I("📖", 5), I("🪟", 6)],
      likes: ["苏清颜", "林晚", "王老师", "徐甜甜"],
      comments: [{ n: "徐甜甜", c: "收到！晚上我在靠窗那桌" }] }),
    P({ id: "s565-11", who: "wang", time: "4小时前", loc: "",
      text: "今天晚自习前，看见操场边有同学在帮别人讲题，夕阳落在两个人身上。这大概就是我做老师最想看到的样子。加油，孩子们。",
      imgs: [I("🌅", 6), I("📖", 1)],
      likes: ["全班同学", "林晚", "苏清颜", "陆知意", "陈墨", "吴磊", "唐糖", "颜汐"],
      comments: [
        { n: "林晚", c: "老师也辛苦了" },
        { n: "陆知意", c: "明天值日表我已排好，老师放心" }
      ] }),
    P({ id: "s565-12", who: "chen", time: "5小时前", loc: "操场",
      text: "运动会方阵排练，全班配合度满分！虽然最后有人顺拐了（不点名），但大家一起笑的样子真的好。运动会冲！",
      imgs: [I("🏅", 6), I("🏃", 0), I("🎉", 4)],
      likes: ["陈墨", "吴磊", "徐甜甜", "周子航", "王老师"],
      comments: [
        { n: "吴磊", c: "顺拐的是谁心里有数哈哈" },
        { n: "徐甜甜", c: "别笑！是紧张！" }
      ] }),
    P({ id: "s565-13", who: "su", time: "6小时前", loc: "图书馆",
      text: "整理了数学错题本，按题型分了类。有人问我借，我愿意借给那个总在图书馆陪我到闭馆、又不吵我的人。",
      imgs: [I("✏️", 1), I("📓", 5), I("📐", 0)],
      likes: ["林晚", "徐甜甜", "周子航"],
      comments: [{ n: "周子航", c: "学霸求带飞，我保证不吵" }] }),
    P({ id: "s565-14", who: "yan", time: "7小时前", loc: "天台",
      text: "暴雨前的云压得很低，我录了一段风穿过操场的声音。那时候你在我旁边，我才发现，声音原来可以是暖的。",
      imgs: [I("🌧️", 2), I("🎙️", 6), I("🌫️", 0)],
      likes: ["苏清颜", "林晚", "赵小雨"],
      comments: [{ n: "赵小雨", c: "文案好有画面感，我要配画" }] }),
    P({ id: "s565-15", who: "tang", time: "8小时前", loc: "烘焙社",
      text: "义卖摊位的小蛋糕全部卖光啦！有一个没卖的，我写了两个字，送给那个收摊时帮我搬烤箱的人。猜猜写的什么？",
      imgs: [I("🧁", 3), I("🎀", 4), I("💌", 0)],
      likes: ["唐糖", "林晚", "颜汐", "吴磊"],
      comments: [
        { n: "颜汐", c: "我知道！是不是“喜欢”！" },
        { n: "唐糖", c: "回复颜汐：哎呀你小声点！" }
      ] }),
    P({ id: "s565-16", who: "lu", time: "9小时前", loc: "走廊",
      text: "执勤时发现有人把走廊的灯关了，靠的是窗外的月光。我没有扣分，只是把我的外套轻轻放在了那个睡着的人身上。",
      imgs: [I("🌙", 6), I("🔔", 0)],
      likes: ["林晚", "苏清颜", "王老师", "颜汐"],
      comments: [
        { n: "王老师", c: "规则之外的温度，会长也学会了" },
        { n: "陆知意", c: "回复王老师：（脸红）老师，早点休息" }
      ] }),
    P({ id: "s565-17", who: "shen", time: "10小时前", loc: "食堂",
      text: "两份早餐，多要了一杯豆浆。老地方。某人再赖床，我就把他那份吃了，说到做到。",
      imgs: [I("🥟", 3), I("🥛", 1), I("🌅", 6)],
      likes: ["陈墨", "吴磊", "唐糖"],
      comments: [{ n: "陈墨", c: "管得真宽，但是酸到我了" }] }),
    P({ id: "s565-18", who: "lin", time: "昨天 22:10", loc: "宿舍",
      text: "熄灯前收到一张纸条，上面抄了半句诗。我把它夹在诗集里，想了很久，没有舍得还回去。晚安。",
      imgs: [I("📄", 5), I("🌸", 4), I("🌙", 6)],
      likes: ["赵小雨", "苏清颜", "唐糖", "颜汐"],
      comments: [
        { n: "赵小雨", c: "谁写的谁写的！快交代" },
        { n: "林晚", c: "回复赵小雨：……是秘密" }
      ] }),
    P({ id: "s565-19", who: "radio", time: "昨天 21:00", loc: "广播站",
      text: "明日天气：晴转多云，午后有小概率阵雨，建议带伞。傍晚点歌通道开放，想给同学/老师点歌的，把名字和祝福投到广播室门口信箱。",
      imgs: [I("🌤️", 6), I("☔", 4), I("📮", 5)],
      likes: ["校图书馆", "西子食堂", "王老师", "颜汐"],
      comments: [{ n: "颜汐", c: "傍晚时段我值班，欢迎来稿" }] }),
    P({ id: "s565-20", who: "canteen", time: "昨天 17:30", loc: "西子食堂",
      text: "周末加菜预告：周六午餐供应红烧排骨、清炒时蔬和紫菜蛋花汤，例汤免费续。同学们排好队，一个一个来，阿姨手不抖。",
      imgs: [I("🍖", 3), I("🥬", 2), I("🍲", 5)],
      likes: ["陈墨", "吴磊", "唐糖", "林晚", "许念"],
      comments: [
        { n: "吴磊", c: "阿姨手不抖！这句我信" },
        { n: "陈墨", c: "排骨我要双份！" }
      ] }),
    P({ id: "s565-21", who: "zhao", time: "昨天 15:20", loc: "写生台",
      text: "去湖边写生，画了整整一沓速写。回来翻到最后一张，发现画的全是同一个人的背影，连我自己都没察觉。",
      imgs: [I("🖌️", 4), I("🌊", 0), I("📒", 1)],
      likes: ["林晚", "赵小雨", "苏清颜"],
      comments: [{ n: "林晚", c: "画会替你说出心里话的" }] }),
    P({ id: "s565-22", who: "xu", time: "昨天 12:40", loc: "篮球场",
      text: "训练完在球场边捡到一个保温水壶，标签写着“别再受伤了”。谁放的，自己站出来，我……当面还你。",
      imgs: [I("💧", 5), I("🏀", 2), I("🩹", 0)],
      likes: ["陈墨", "吴磊", "唐糖", "林晚"],
      comments: [
        { n: "陈墨", c: "哟，我们许哥也有今天" },
        { n: "许念", c: "回复陈墨：闭嘴，传球" }
      ] }),
    P({ id: "s565-23", who: "tang", time: "前天 20:30", loc: "宿舍",
      text: "第一次烤糊的那盘，有人没嫌弃全吃完了。那天我就想，以后一定要做出最成功的一块，给他一个人。现在快做到了。",
      imgs: [I("🍪", 3), I("🥰", 4), I("🌙", 6)],
      likes: ["林晚", "唐糖", "颜汐", "苏清颜"],
      comments: [{ n: "颜汐", c: "双向奔赴，我锁死" }] }),
    P({ id: "s565-24", who: "lu", time: "前天 18:00", loc: "天台",
      text: "活动全部结束，我在天台坐了很久。习惯了安排所有人的流程，却第一次希望，有一个人能不按流程地留下来。",
      imgs: [I("🌆", 6), I("🔔", 0), I("📋", 5)],
      likes: ["王老师", "林晚", "颜汐", "陆知意"],
      comments: [{ n: "颜汐", c: "那就广播一段，喊他名字？" }] }),
    P({ id: "s565-25", who: "shen", time: "前天 07:10", loc: "上学路上",
      text: "从小一起走到校门口，十几年了。以前嫌你烦，现在发现，要是哪天你没在路口等我，我反而会回头。",
      imgs: [I("🌅", 6), I("🌻", 4), I("🏫", 1)],
      likes: ["陈墨", "林晚", "唐糖", "吴磊"],
      comments: [
        { n: "陈墨", c: "这是明牌了吧？" },
        { n: "沈知夏", c: "回复陈墨：（别胡说）……快走，要迟到了" }
      ] })
  ];

  var origSeed = M.seedFeed;
  M.seedFeed = function () {
    var base;
    try { base = origSeed.call(M); } catch (e) { base = []; }
    return base.concat(extra);
  };
});


/* ===== p75_moments_feed2.js ===== */
/* ============================================================================
   p75 · 朋友圈初始动态（第二批 26 条），seedFeed 追加，不覆盖
   覆盖新女主 温以宁/安宁，以及校园日常、社团、服务号、同窗百态
   ============================================================================ */
register("moments-feed2", function () {
  var M = window.X56Moments;
  if (!M) return;

  var NPCS = {
    wen: { name: "温以宁", emoji: "📘", bg: "linear-gradient(135deg,#c5d0f7,#9fb0f0)" },
    an: { name: "安宁", emoji: "📷", bg: "linear-gradient(135deg,#c2ddee,#8fb6d4)" },
    club: { name: "社团联合会", emoji: "🎪", bg: "linear-gradient(135deg,#a8e6cf,#7fd1ae)" },
    library: { name: "校图书馆", emoji: "📖", bg: "linear-gradient(135deg,#c8d8f5,#9fb8e8)" },
    canteen: { name: "食堂阿姨", emoji: "🍲", bg: "linear-gradient(135deg,#ffd9b0,#f5b377)" },
    sports: { name: "体育组", emoji: "🏅", bg: "linear-gradient(135deg,#b6e6c8,#7fd1ae)" },
    radio: { name: "校园广播站", emoji: "📢", bg: "linear-gradient(135deg,#ffc8a8,#ff9f7e)" },
    monitor: { name: "班委值班号", emoji: "📋", bg: "linear-gradient(135deg,#c8d0f0,#9aa8e0)" }
  };
  Object.keys(NPCS).forEach(function (id) {
    if (!M.npcs[id]) M.npcs[id] = NPCS[id];
  });

  function P(o) {
    return { id: o.id, who: o.who, time: o.time, loc: o.loc || "", text: o.text, imgs: o.imgs || [], likes: o.likes || [], comments: o.comments || [] };
  }
  function I(e, g) { return { e: e, g: g }; }

  var extra = [
    P({ id: "s565b-01", who: "wen", time: "8分钟前", loc: "图书馆",
      text: "把今天要讲的函数，又整理成了一份更细的步骤。基础差没关系，我会从最前面讲到你懂。……我不喜欢等人，但愿意等你。",
      imgs: [I("📘", 0), I("✏️", 6), I("🌙", 2)],
      likes: ["王老师", "林晚", "陆知意", "安宁"],
      comments: [
        { n: "陆知意", c: "学习委员又熬夜了？注意休息" },
        { n: "温以宁", c: "回复陆知意：……没熬夜，顺手而已" }
      ] }),
    P({ id: "s565b-02", who: "wen", time: "40分钟前", loc: "教室",
      text: "辅导的同学数学第一次及格，比分数线高了二十分。我只负责讲题，分数是他自己考的。……但我好像比他还高兴。",
      imgs: [I("📊", 5), I("✅", 3), I("📝", 1)],
      likes: ["王老师", "陈墨", "温以宁", "颜汐"],
      comments: [
        { n: "颜汐", c: "哇，年级第一也会为别人开心" },
        { n: "温以宁", c: "回复颜汐：……他很努力，值得。" }
      ] }),
    P({ id: "s565b-03", who: "an", time: "15分钟前", loc: "小花园",
      text: "今天的桂花落在地上，光刚好。我蹲在那里拍了很久，还有人帮我挡住了背景的人影。……谢谢你，没让我害怕。",
      imgs: [I("🌸", 4), I("📷", 0), I("🌿", 6)],
      likes: ["温以宁", "唐糖", "沈知夏", "安宁"],
      comments: [
        { n: "唐糖", c: "拍得好温柔呀！" },
        { n: "安宁", c: "回复唐糖：……是花好看。" }
      ] }),
    P({ id: "s565b-04", who: "an", time: "1小时前", loc: "天台",
      text: "夕阳是圆的，只有拍下来，它才不会马上消失。相册里有一张照片，标题叫《我最喜欢的人》。影展那天，我想让他第一个看到。",
      imgs: [I("🌅", 6), I("📷", 0), I("💓", 4)],
      likes: ["颜汐", "林晚", "温以宁", "唐糖"],
      comments: [
        { n: "颜汐", c: "我在广播里为你放一首勇气！" },
        { n: "安宁", c: "回复颜汐：……请、请别念我的名字。" }
      ] }),
    P({ id: "s565b-05", who: "club", time: "2小时前", loc: "社团活动室",
      text: "【社团招新倒计时】摄影社、烘焙社、音乐社、广播站、篮球队、学生会……百团大战本周五开启，找到属于你的位置吧！",
      imgs: [I("🎪", 0), I("📢", 3), I("🎨", 5)],
      likes: ["林晚", "唐糖", "安宁", "陈墨"],
      comments: [{ n: "陈墨", c: "篮球社缺后卫，速来" }] }),
    P({ id: "s565b-06", who: "library", time: "3小时前", loc: "图书馆",
      text: "本周新到一批课外读物，已在二楼新书区上架。安静阅读，是对自己最好的犒赏。闭馆时间：21:30。",
      imgs: [I("📖", 0), I("📚", 1), I("🔖", 4)],
      likes: ["温以宁", "林晚", "苏清颜", "陆知意"],
      comments: [{ n: "温以宁", c: "我预约的那本，帮我留一下。" }] }),
    P({ id: "s565b-07", who: "canteen", time: "今天 11:50", loc: "食堂",
      text: "今天上新：糖醋里脊、麻辣香锅（可点不辣）、例汤免费！光盘行动的同学，记得领水果哦～",
      imgs: [I("🍗", 3), I("🍲", 0), I("🍊", 4)],
      likes: ["陈墨", "吴磊", "唐糖", "沈知夏"],
      comments: [
        { n: "吴磊", c: "阿姨手别抖，多给一块！" },
        { n: "食堂阿姨", c: "回复吴磊：管够，排队去。" }
      ] }),
    P({ id: "s565b-08", who: "sports", time: "今天 09:20", loc: "操场",
      text: "运动会项目报名中：4×100接力、跳远、跳高、1500米。班级荣誉需要你，后勤志愿者同样欢迎。报名找体委。",
      imgs: [I("🏅", 3), I("🏃", 0), I("🥇", 4)],
      likes: ["许念", "陈墨", "吴磊", "沈知夏"],
      comments: [{ n: "许念", c: "接力带我一个。" }] }),
    P({ id: "s565b-09", who: "radio", time: "昨天 18:00", loc: "广播站",
      text: "今日点歌已送达。明天傍晚的点歌通道继续开放，把想说的话写下来，也许会被温柔地播出来。",
      imgs: [I("🎤", 0), I("🎧", 2), I("🌆", 6)],
      likes: ["颜汐", "苏清颜", "安宁", "林晚"],
      comments: [{ n: "颜汐", c: "今晚的最后一首，是我自己加的。" }] }),
    P({ id: "s565b-10", who: "monitor", time: "昨天 17:40", loc: "教室",
      text: "本周值日表已更新，黑板报主题定为“安全教育”，请各组按时完成。放学后请关好门窗、灯和空调。",
      imgs: [I("📋", 0), I("🧹", 3), I("🪟", 5)],
      likes: ["陆知意", "林晚", "温以宁", "陈墨"],
      comments: [{ n: "陆知意", c: "需要人手可以找学生会。" }] }),
    P({ id: "s565b-11", who: "lin", time: "昨天 21:10", loc: "宿舍",
      text: "今天的作业好难，但是和同桌一起讨论完，居然全部做出来了。果然一个人卡住的题，两个人聊一聊就通了。",
      imgs: [I("📝", 1), I("💡", 4), I("🌙", 6)],
      likes: ["赵小雨", "温以宁", "唐糖", "林晚"],
      comments: [
        { n: "温以宁", c: "卡住的地方，明天我可以再讲一遍。" },
        { n: "林晚", c: "回复温以宁：谢谢学习委员！" }
      ] }),
    P({ id: "s565b-12", who: "zhao", time: "昨天 16:20", loc: "美术教室",
      text: "帮文化节画的海报初稿完成啦！颜色调了七八版，最后还是觉得暖一点的最好看。有意见欢迎提～",
      imgs: [I("🎨", 0), I("🖌️", 3), I("🌻", 4)],
      likes: ["赵小雨", "唐糖", "安宁", "沈知夏"],
      comments: [
        { n: "安宁", c: "这个光影处理得真好。" },
        { n: "赵小雨", c: "回复安宁：你拍照才厉害，教教我取景！" }
      ] }),
    P({ id: "s565b-13", who: "su", time: "前天 20:05", loc: "琴房",
      text: "录到一半停电了，琴房里一片黑，我却没有害怕。因为有人举着手机的灯，在门口说：“别怕，我在。”",
      imgs: [I("🎹", 0), I("🕯️", 6), I("🌙", 2)],
      likes: ["颜汐", "苏清颜", "陆知意", "林晚"],
      comments: [
        { n: "颜汐", c: "这一幕我可以写进广播稿吗？" },
        { n: "苏清颜", c: "回复颜汐：……别写名字。" }
      ] }),
    P({ id: "s565b-14", who: "xu", time: "前天 18:30", loc: "篮球场",
      text: "今天的三分球，十投八中。训练完发现有人放了瓶水在我包里，没留名字。下次别躲，我请你喝回去。",
      imgs: [I("🏀", 0), I("💧", 5), I("🌇", 6)],
      likes: ["陈墨", "吴磊", "许念", "沈知夏"],
      comments: [
        { n: "吴磊", c: "许哥你就从了吧。" },
        { n: "许念", c: "回复吴磊：传球，别废话。" }
      ] }),
    P({ id: "s565b-15", who: "shen", time: "前天 12:15", loc: "教室",
      text: "向日葵又长高了，朝着窗外的光。同桌说它跟我一样，看着大大咧咧，其实一直向着同一个方向。……他什么意思啊？",
      imgs: [I("🌻", 4), I("☀️", 4), I("🪴", 6)],
      likes: ["林晚", "唐糖", "沈知夏", "赵小雨"],
      comments: [
        { n: "唐糖", c: "意思是他在说你专情呀！" },
        { n: "沈知夏", c: "回复唐糖：……我、我去浇水了。" }
      ] }),
    P({ id: "s565b-16", who: "lu", time: "大前天 22:00", loc: "学生会办公室",
      text: "所有活动都结束了，反而有点空。习惯了替所有人安排好一切，今天却想问问：有没有人，愿意安排我一次？",
      imgs: [I("🔔", 0), I("📋", 5), I("🌙", 6)],
      likes: ["王老师", "颜汐", "林晚", "温以宁"],
      comments: [
        { n: "颜汐", c: "会长，你也该休息一下了。" },
        { n: "陆知意", c: "回复颜汐：……嗯，谢谢你。" }
      ] }),
    P({ id: "s565b-17", who: "yan", time: "大前天 17:55", loc: "广播站",
      text: "有一封点歌便签，字写得很认真，只写了一句：“给总在最后放歌的人。” 我把它夹进了笔记本的第一页。",
      imgs: [I("🎤", 0), I("📝", 1), I("🎧", 2)],
      likes: ["苏清颜", "颜汐", "安宁", "唐糖"],
      comments: [
        { n: "安宁", c: "我能拍下这张便签吗？" },
        { n: "颜汐", c: "回复安宁：（脸红）……不行，是我私藏的。" }
      ] }),
    P({ id: "s565b-18", who: "tang", time: "大前天 15:30", loc: "家政教室",
      text: "新口味试做：柚子慕斯！酸一点点，像没说出口的话。我把它分成了两份，一份给帮我试吃的人，一份……留给自己壮胆。",
      imgs: [I("🍰", 3), I("🍋", 4), I("🥄", 1)],
      likes: ["唐糖", "林晚", "赵小雨", "唐糖"],
      comments: [{ n: "赵小雨", c: "壮胆做什么呀，我闻到了恋爱的味道。" }] }),
    P({ id: "s565b-19", who: "chen", time: "4天前", loc: "教室",
      text: "作为班长，今天把文化节的账算平了，一分不差。谢谢大家愿意配合我这个有点较真的人。",
      imgs: [I("📋", 0), I("🧮", 5), I("✅", 3)],
      likes: ["陆知意", "王老师", "林晚", "陈墨"],
      comments: [
        { n: "陆知意", c: "账做得很规范，辛苦了。" },
        { n: "陈墨", c: "回复陆知意：会长过奖。" }
      ] }),
    P({ id: "s565b-20", who: "an", time: "4天前", loc: "校门口",
      text: "转学第一天，我抱着相机不敢抬头，是有人挡在我前面，说“别为难她”。那张照片我没敢拍，但我记住了。",
      imgs: [I("📷", 0), I("🚪", 1), I("🍂", 6)],
      likes: ["唐糖", "林晚", "温以宁", "安宁"],
      comments: [
        { n: "唐糖", c: "好感人，那位同学是谁呀？" },
        { n: "安宁", c: "回复唐糖：……是我镜头里的人。" }
      ] }),
    P({ id: "s565b-21", who: "wen", time: "4天前", loc: "天台",
      text: "一个学生冲进年级前三十那天，我在天台等他，手里攥着最后一本错题本。我明明该高兴，却怕他以后不再需要我。",
      imgs: [I("📘", 0), I("🌆", 6), I("📝", 1)],
      likes: ["林晚", "陆知意", "颜汐", "温以宁"],
      comments: [
        { n: "颜汐", c: "这哪里是错题本，这是喜欢啊。" },
        { n: "温以宁", c: "回复颜汐：……别瞎说。" }
      ] }),
    P({ id: "s565b-22", who: "canteen", time: "5天前", loc: "食堂",
      text: "降温啦，今天免费提供热姜茶，同学们记得添衣，别着凉。身体才是学习的本钱。",
      imgs: [I("🍵", 4), I("🧣", 5), I("🍲", 0)],
      likes: ["王老师", "沈知夏", "林晚", "吴磊"],
      comments: [{ n: "吴磊", c: "阿姨的姜茶最暖！" }] }),
    P({ id: "s565b-23", who: "sports", time: "5天前", loc: "操场",
      text: "晨跑注意：请靠内侧、注意脚下。天气不好时会改成室内拉伸，安全第一。最后一名也值得掌声，请为坚持的同学加油。",
      imgs: [I("🏃", 0), I("🤝", 3), I("🌅", 6)],
      likes: ["许念", "陈墨", "沈知夏", "陆知意"],
      comments: [{ n: "陈墨", c: "陪最后一名冲线，安排。" }] }),
    P({ id: "s565b-24", who: "club", time: "6天前", loc: "小花园",
      text: "【校园摄影社影展】本周六在艺术楼一层开展，主题“我看见的校园”。有一张照片，被放在了展厅最中央。",
      imgs: [I("🖼️", 5), I("📷", 0), I("🌿", 6)],
      likes: ["安宁", "赵小雨", "颜汐", "温以宁"],
      comments: [
        { n: "赵小雨", c: "一定要去看《我最喜欢的人》！" },
        { n: "安宁", c: "回复赵小雨：……你小声点。" }
      ] }),
    P({ id: "s565b-25", who: "library", time: "6天前", loc: "图书馆",
      text: "读书分享会报名开启。把你喜欢的一本书讲给别人听，也是一次勇敢的表达。",
      imgs: [I("📖", 0), I("🎤", 3), I("📚", 1)],
      likes: ["温以宁", "林晚", "苏清颜", "颜汐"],
      comments: [{ n: "温以宁", c: "我报名，讲那本讲方法的书。" }] }),
    P({ id: "s565b-26", who: "monitor", time: "一周前", loc: "教室",
      text: "感谢本周主动承担黑板报、图书角、绿植照料的同学。一个班级的温度，来自这些不起眼的小事。",
      imgs: [I("📋", 0), I("🌱", 6), I("🎨", 4)],
      likes: ["陆知意", "林晚", "唐糖", "王老师"],
      comments: [{ n: "林晚", c: "我们班越来越好啦！" }] })
  ];

  var origSeed = M.seedFeed;
  M.seedFeed = function () {
    var base;
    try { base = origSeed.call(M); } catch (e) { base = []; }
    return base.concat(extra);
  };
});


/* ===== p78_moments_feed3.js ===== */
/* ============================================================================
   p78 · 朋友圈初始动态（第三批 16 条）：聚焦新女主 江晚舟/岑诺/桑榆/苗妙
   seedFeed 追加，不覆盖
   ============================================================================ */
register("moments-feed3", function () {
  var M = window.X56Moments;
  if (!M) return;
  var NPCS = {
    jia: { name: "江晚舟", emoji: "⚽", bg: "linear-gradient(135deg,#a8e6cf,#5fc7a3)" },
    nuo: { name: "岑诺", emoji: "🗣️", bg: "linear-gradient(135deg,#d8c5f5,#b08ae0)" },
    sang: { name: "桑榆", emoji: "💃", bg: "linear-gradient(135deg,#fbc5dd,#e88ab0)" },
    miao: { name: "苗妙", emoji: "🌍", bg: "linear-gradient(135deg,#b5e6ef,#4fb8c9)" },
    sports: { name: "体育组", emoji: "🏅", bg: "linear-gradient(135deg,#b6e6c8,#7fd1ae)" },
    english: { name: "英语角", emoji: "🌍", bg: "linear-gradient(135deg,#b5e6ef,#4fb8c9)" }
  };
  Object.keys(NPCS).forEach(function (id) { if (!M.npcs[id]) M.npcs[id] = NPCS[id]; });
  function P(o) { return { id: o.id, who: o.who, time: o.time, loc: o.loc || "", text: o.text, imgs: o.imgs || [], likes: o.likes || [], comments: o.comments || [] }; }
  function I(e, g) { return { e: e, g: g }; }

  var extra = [
    P({ id: "s565c-01", who: "jia", time: "6分钟前", loc: "操场",
      text: "任意球连进三个，最后那脚我自己都没想到。场边帮我捡球的人，今天的水我请。",
      imgs: [I("⚽", 0), I("🥅", 3), I("🌇", 6)],
      likes: ["陈墨", "吴磊", "许念", "江晚舟"],
      comments: [
        { n: "吴磊", c: "江队这脚法，牛！" },
        { n: "江晚舟", c: "回复吴磊：少废话，明天多跑两圈。" }
      ] }),
    P({ id: "s565c-02", who: "jia", time: "1小时前", loc: "操场",
      text: "扭伤那天，有人比我还紧张，背我去医务室，还天天帮我打饭记笔记。我平时大大咧咧，这些都记着。",
      imgs: [I("🩹", 0), I("🍚", 3), I("🌇", 6)],
      likes: ["沈知夏", "林晚", "唐糖", "江晚舟"],
      comments: [
        { n: "唐糖", c: "好甜，是谁呀？" },
        { n: "江晚舟", c: "回复唐糖：……球场的事，球场见。" }
      ] }),
    P({ id: "s565c-03", who: "sports", time: "2小时前", loc: "操场",
      text: "恭喜我校女足在市级联赛夺冠！最后一分钟的绝杀进球，来自队长江晚舟。全校的掌声，送给她们。",
      imgs: [I("🏆", 3), I("⚽", 0), I("🥇", 4)],
      likes: ["王老师", "江晚舟", "许念", "陈墨", "吴磊"],
      comments: [{ n: "陈墨", c: "江队最后那球，是踢给看台上的人吧。" }] }),
    P({ id: "s565c-04", who: "jia", time: "3小时前", loc: "操场",
      text: "奖牌我挂在别人脖子上了。赢球的瞬间我第一个看向看台，他果然在。以后我的每场球，你都得在场。",
      imgs: [I("🥇", 4), I("🌇", 6), I("⚽", 0)],
      likes: ["江晚舟", "沈知夏", "林晚", "唐糖"],
      comments: [
        { n: "沈知夏", c: "官宣了官宣了！" },
        { n: "江晚舟", c: "回复沈知夏：这球是踢给他的。" }
      ] }),
    P({ id: "s565c-05", who: "nuo", time: "20分钟前", loc: "图书馆",
      text: "把决赛的论点又推演了一遍，对方可能的攻辩我都备好了。只有开场陈词的第一页，我改了无数遍。",
      imgs: [I("📚", 1), I("🗣️", 0), I("📝", 5)],
      likes: ["王老师", "温以宁", "陆知意", "岑诺"],
      comments: [
        { n: "陆知意", c: "逻辑很严密，注意休息。" },
        { n: "岑诺", c: "回复陆知意：会长放心，我有数。" }
      ] }),
    P({ id: "s565c-06", who: "nuo", time: "2小时前", loc: "图书馆",
      text: "有个人感冒还硬撑着陪我查资料，我把他骂了一顿，又去打了热粥盯着他喝完。我毒舌，但不是不讲道理。",
      imgs: [I("🍵", 4), I("💊", 3), I("📚", 1)],
      likes: ["温以宁", "林晚", "颜汐", "岑诺"],
      comments: [
        { n: "颜汐", c: "嘴硬心软第一名。" },
        { n: "岑诺", c: "回复颜汐：……我只是不想陪练病倒。" }
      ] }),
    P({ id: "s565c-07", who: "nuo", time: "4小时前", loc: "小花园",
      text: "赢了所有的辩论，却想在一个人面前放下所有论证。决赛开场陈词的第一页，写给他。他听懂了。",
      imgs: [I("🗣️", 0), I("🌿", 6), I("📝", 5)],
      likes: ["岑诺", "林晚", "温以宁", "颜汐", "苗妙"],
      comments: [
        { n: "苗妙", c: "这句太浪漫了，我要学！" },
        { n: "岑诺", c: "回复苗妙：……少煽情。" }
      ] }),
    P({ id: "s565c-08", who: "sang", time: "12分钟前", loc: "形体房",
      text: "独舞的最后一个旋转，我练了一百遍，脚都磨破了。但想到第一排有他，我就停不下来。",
      imgs: [I("💃", 0), I("🎵", 6), I("🩰", 3)],
      likes: ["赵小雨", "唐糖", "苗妙", "桑榆"],
      comments: [
        { n: "唐糖", c: "你一定是最亮的那只蝶！" },
        { n: "桑榆", c: "回复唐糖：嘿嘿，我要跳给一个人看。" }
      ] }),
    P({ id: "s565c-09", who: "sang", time: "1小时前", loc: "形体房",
      text: "我又忘带饭卡了，每次都是他在。我什么都能忘，就是不会忘了他。",
      imgs: [I("🍚", 3), I("💃", 0), I("🌷", 4)],
      likes: ["桑榆", "唐糖", "林晚", "苗妙"],
      comments: [
        { n: "林晚", c: "迷糊鬼，小心点。" },
        { n: "桑榆", c: "回复林晚：有他在，我什么都不怕。" }
      ] }),
    P({ id: "s565c-10", who: "sang", time: "昨天 21:00", loc: "形体房",
      text: "谢幕了，我抱着花跑到他面前。这支舞，从头到尾，都是跳给他看的。以后，我只跳给一个人看。",
      imgs: [I("💐", 4), I("💃", 0), I("🌟", 6)],
      likes: ["赵小雨", "唐糖", "苗妙", "桑榆", "颜汐"],
      comments: [
        { n: "颜汐", c: "祝你们！我要在广播里放一首。" },
        { n: "桑榆", c: "回复颜汐：要甜甜的那种！" }
      ] }),
    P({ id: "s565c-11", who: "miao", time: "10分钟前", loc: "小花园",
      text: "今天口语角，有个男生开口磕磕绊绊地说了爱好，我超用力鼓掌。他不知道，我第一次开口比他还糗。",
      imgs: [I("🌍", 0), I("🗣️", 3), I("🌿", 6)],
      likes: ["苗妙", "温以宁", "林晚", "岑诺"],
      comments: [
        { n: "温以宁", c: "你很会鼓励人。" },
        { n: "苗妙", c: "回复温以宁：开口就赢了一半嘛！" }
      ] }),
    P({ id: "s565c-12", who: "english", time: "2小时前", loc: "小花园",
      text: "校园英语演讲比赛圆满落幕，苗妙同学的《勇气》打动全场。她没有用夸张的手势，却让所有人安静下来。",
      imgs: [I("🏆", 3), I("🌍", 0), I("🎤", 6)],
      likes: ["王老师", "苗妙", "温以宁", "岑诺", "林晚"],
      comments: [{ n: "林晚", c: "故事里的听众是谁呀？" }] }),
    P({ id: "s565c-13", who: "miao", time: "3小时前", loc: "天台",
      text: "我平时吵吵闹闹，是怕冷场、怕没意思。可在他面前，我才敢安静。今天我用英语说：You are the only person I want to talk to.",
      imgs: [I("🌍", 0), I("🌆", 6), I("💓", 4)],
      likes: ["苗妙", "唐糖", "颜汐", "桑榆", "岑诺"],
      comments: [
        { n: "岑诺", c: "发音还得练，诚意满分。" },
        { n: "苗妙", c: "回复岑诺：你就不能只夸我吗！" }
      ] }),
    P({ id: "s565c-14", who: "miao", time: "昨天 20:30", loc: "教室",
      text: "那个愿意倾听的人，是我故事里的主角。原来不热闹的我，也可以被喜欢。以后练口语，只找他一个人。",
      imgs: [I("📖", 1), I("🌍", 0), I("🌙", 6)],
      likes: ["温以宁", "苗妙", "林晚", "唐糖", "桑榆"],
      comments: [{ n: "唐糖", c: "锁死，这对太可爱了。" }] }),
    P({ id: "s565c-15", who: "nuo", time: "昨天 18:40", loc: "食堂",
      text: "给表弟改完稿子，才发现有人在旁边吃醋了。我把决赛陈词的第一页先给他看了。幼稚。……但我不讨厌。",
      imgs: [I("📝", 5), I("🍚", 3), I("🗣️", 0)],
      likes: ["岑诺", "温以宁", "苗妙", "颜汐"],
      comments: [
        { n: "苗妙", c: "社长也会说这种话！" },
        { n: "岑诺", c: "回复苗妙：陈述事实而已。" }
      ] }),
    P({ id: "s565c-16", who: "sang", time: "前天 19:10", loc: "医务室",
      text: "崴脚那天我还想偷偷回去练，结果被他一眼看穿。他说“演出会等你，先把脚养好”。第一次有人让我觉得，不用那么拼也没关系。",
      imgs: [I("🩹", 0), I("💃", 6), I("🌤️", 4)],
      likes: ["赵小雨", "唐糖", "桑榆", "江晚舟"],
      comments: [
        { n: "江晚舟", c: "受伤就好好养，别学我。" },
        { n: "桑榆", c: "回复江晚舟：你也一样！" }
      ] })
  ];
  var origSeed = M.seedFeed;
  M.seedFeed = function () {
    var base;
    try { base = origSeed.call(M); } catch (e) { base = []; }
    return base.concat(extra);
  };
});


/* ===== p60_games.js ===== */
/* ============================================================================
   模块八 · 5.6.5 新增小游戏（3 个，自包含，有真实判定 + 本地最高纪录）
   1) 接卷子（Canvas 反应游戏，手机/电脑均可）
   2) 口算竞速（60 秒限时，考验速算）
   3) 成语挑战（成语填空，寓教于乐）
   全部注册进 5.5.13「游戏中心」，关闭弹窗即清理循环。
   ============================================================================ */
register("games-565", function () {
  var G = window.X565GAMES = {};
  var XZ13 = window.XZ13 || null;
  function showModal(html) {
    if (XZ13 && typeof XZ13.modal === "function") XZ13.modal(html);
    else if (typeof window.modal === "function") window.modal(html);
  }
  /* 当根节点从弹窗消失时，停止循环 */
  function watch(rootId, stopFn) {
    var t = setInterval(function () {
      if (!document.getElementById(rootId)) {
        clearInterval(t);
        try { stopFn && stopFn(); } catch (e) {}
      }
    }, 400);
    return t;
  }
  function bestGet(key) { var v = parseInt(storageGet(key), 10); return isNaN(v) ? 0 : v; }
  function bestSet(key, v) { storageSet(key, String(v)); }

  /* ═══════════════════════════════════════════════
     1) 接卷子（Canvas）
     ═══════════════════════════════════════════════ */
  G.catch = {
    raf: 0, running: false,
    open: function () {
      var g = this;
      g.best = bestGet("g565_catch");
      showModal(
        '<h3>📜 接卷子大作战</h3>' +
        '<div style="max-width:380px;margin:0 auto">' +
        '<div class="xz13-game-hud"><span>得分 <b id="gctScore">0</b></span>' +
        '<span>生命 <b id="gctLife">❤❤❤</b></span>' +
        '<span>最高 <b>' + g.best + '</b></span></div>' +
        '<div style="text-align:center"><canvas id="gctCanvas" width="360" height="460" style="width:100%;max-width:340px;height:auto;border-radius:14px;touch-action:none;background:linear-gradient(180deg,#cfe8ff,#eaf7ff)"></canvas></div>' +
        '<div class="xz13-save-bar" style="justify-content:center">' +
        '<button class="xz13-save-ss-btn" id="gctRestart">重开</button>' +
        '<button class="xz13-save-ss-btn" onclick="closeModal()">退出</button></div>' +
        '<p class="dim small" style="text-align:center">移动接 📜/📚/🍎，躲开 💣（电脑方向键 / 手机拖动）</p>' +
        '</div>'
      );
      var cv = document.getElementById("gctCanvas");
      if (!cv) return;
      var ctx = cv.getContext("2d");
      var W = cv.width, H = cv.height;
      g.state = {
        x: W / 2 - 34, y: H - 46, bw: 68, bh: 26,
        items: [], score: 0, life: 3, t: 0, spawn: 0, speed: 2.4,
        keyLeft: false, keyRight: false, pointerX: null
      };
      function bw() { return g.state.bw; }
      function drawBasket() {
        var s = g.state;
        ctx.fillStyle = "#e8884a";
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") ctx.roundRect(s.x, s.y, s.bw, s.bh, 8);
        else ctx.rect(s.x, s.y, s.bw, s.bh);
        ctx.fill();
        ctx.fillStyle = "#c96b32";
        ctx.fillRect(s.x + 4, s.y + s.bh - 8, s.bw - 8, 8);
        ctx.fillStyle = "#fff";
        ctx.font = "16px serif";
        ctx.fillText("🧺", s.x + s.bw / 2 - 9, s.y + 18);
      }
      function spawn() {
        var s = g.state;
        var r = Math.random();
        var kind;
        if (r < 0.55) kind = { e: "📜", pts: 1, bomb: false };
        else if (r < 0.72) kind = { e: "🍎", pts: 2, bomb: false };
        else if (r < 0.88) kind = { e: "📚", pts: 3, bomb: false };
        else kind = { e: "💣", pts: 0, bomb: true };
        s.items.push({ x: 16 + Math.random() * (W - 48), y: -24, e: kind.e, pts: kind.pts, bomb: kind.bomb });
      }
      function end() {
        g.running = false;
        cancelAnimationFrame(g.raf);
        if (g.state.score > g.best) { g.best = g.state.score; bestSet("g565_catch", g.best); }
        showModal(
          '<h3>📜 游戏结束</h3>' +
          '<div style="text-align:center;font-size:18px;padding:14px">本次得分 <b style="font-size:30px;color:#e8884a">' + g.state.score + '</b><br>' +
          '<span class="dim">历史最高 ' + g.best + '</span></div>' +
          '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="X565GAMES.catch.open()">再来一局</button>' +
          '<button class="gbtn" onclick="closeModal()">退出</button></div>'
        );
      }
      function step() {
        if (!g.running) return;
        var s = g.state;
        s.t++;
        ctx.clearRect(0, 0, W, H);
        /* 移动 */
        if (s.pointerX != null) {
          s.x += (s.pointerX - s.bw / 2 - s.x) * 0.35;
        } else {
          if (s.keyLeft) s.x -= 7;
          if (s.keyRight) s.x += 7;
        }
        s.x = Math.max(0, Math.min(W - s.bw, s.x));
        /* 生成 */
        s.spawn--;
        if (s.spawn <= 0) {
          spawn();
          s.spawn = Math.max(26, 56 - Math.floor(s.score / 6));
          s.speed = 2.4 + Math.min(3.2, s.score / 30);
        }
        /* 下落 */
        for (var i = s.items.length - 1; i >= 0; i--) {
          var it = s.items[i];
          it.y += s.speed;
          /* 接住 */
          if (it.y + 20 >= s.y && it.y + 20 <= s.y + s.bh + 16 &&
              it.x + 18 >= s.x && it.x + 18 <= s.x + s.bw) {
            if (it.bomb) {
              s.life--;
              var lh = document.getElementById("gctLife");
              if (lh) lh.textContent = "❤".repeat(Math.max(0, s.life)) || "💔";
              if (s.life <= 0) { s.items.splice(i, 1); end(); return; }
            } else {
              s.score += it.pts;
              var sc = document.getElementById("gctScore");
              if (sc) sc.textContent = s.score;
            }
            s.items.splice(i, 1);
            continue;
          }
          if (it.y > H + 24) {
            if (it.bomb) { /* 炸弹落地无害 */ }
            else if (it.pts >= 3) { /* 漏掉书扣一点，但不扣命 */ }
            s.items.splice(i, 1);
          }
        }
        /* 绘制 */
        s.items.forEach(function (it) {
          ctx.font = "30px serif";
          ctx.fillText(it.e, it.x, it.y);
        });
        drawBasket();
        g.raf = requestAnimationFrame(step);
      }
      /* 键盘 */
      g._kd = function (e) {
        var s = g.state;
        if (e.key === "ArrowLeft" || e.key === "a") s.keyLeft = true;
        if (e.key === "ArrowRight" || e.key === "d") s.keyRight = true;
      };
      g._ku = function (e) {
        var s = g.state;
        if (e.key === "ArrowLeft" || e.key === "a") s.keyLeft = false;
        if (e.key === "ArrowRight" || e.key === "d") s.keyRight = false;
      };
      document.addEventListener("keydown", g._kd);
      document.addEventListener("keyup", g._ku);
      function pointerMove(clientX) {
        var r = cv.getBoundingClientRect();
        var px = (clientX - r.left) * (W / r.width);
        g.state.pointerX = Math.max(0, Math.min(W, px));
      }
      g._pm = function (e) {
        if (e.touches && e.touches.length) { pointerMove(e.touches[0].clientX); }
        else pointerMove(e.clientX);
      };
      g._pu = function () { g.state.pointerX = null; };
      cv.addEventListener("mousemove", g._pm);
      cv.addEventListener("mouseleave", g._pu);
      cv.addEventListener("touchmove", g._pm, { passive: true });
      cv.addEventListener("touchstart", g._pm, { passive: true });
      cv.addEventListener("touchend", g._pu);
      var rb = document.getElementById("gctRestart");
      if (rb) rb.onclick = function () { g.cleanup(); g.open(); };
      g.running = true;
      step();
      g._watch = watch("gctCanvas", function () { g.cleanup(); });
    },
    cleanup: function () {
      var g = this;
      g.running = false;
      cancelAnimationFrame(g.raf);
      try { document.removeEventListener("keydown", g._kd); document.removeEventListener("keyup", g._ku); } catch (e) {}
      if (g._watch) clearInterval(g._watch);
    }
  };

  /* ═══════════════════════════════════════════════
     2) 口算竞速（60 秒）
     ═══════════════════════════════════════════════ */
  G.math = {
    timer: 0,
    open: function () {
      var g = this;
      g.best = bestGet("g565_math");
      showModal(
        '<h3>🧮 口算竞速（60 秒）</h3>' +
        '<div style="max-width:420px;margin:0 auto">' +
        '<div class="xz13-game-hud"><span>剩余 <b id="gmtTime">60</b>s</span>' +
        '<span>答对 <b id="gmtScore">0</b></span>' +
        '<span>连击 <b id="gmtCombo">0</b></span>' +
        '<span>最高 <b>' + g.best + '</b></span></div>' +
        '<div id="gmtQ" style="text-align:center;font-size:40px;font-weight:800;margin:18px 0"></div>' +
        '<div id="gmtOpts" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:320px;margin:0 auto"></div>' +
        '<div style="text-align:center;margin-top:10px"><button class="gbtn" onclick="closeModal()">退出</button></div>' +
        '</div>'
      );
      g.score = 0; g.combo = 0; g.left = 60; g.over = false;
      function next() {
        var a = 1 + Math.floor(Math.random() * 40);
        var b = 1 + Math.floor(Math.random() * 40);
        var ops = ["+", "-", "×"];
        var op = ops[Math.floor(Math.random() * ops.length)];
        var ans;
        if (op === "+") { ans = a + b; }
        else if (op === "-") { if (a < b) { var t = a; a = b; b = t; } ans = a - b; }
        else { a = 2 + Math.floor(Math.random() * 12); b = 2 + Math.floor(Math.random() * 12); ans = a * b; }
        g.ans = ans;
        var q = document.getElementById("gmtQ");
        if (q) q.textContent = a + " " + op + " " + b + " = ?";
        var opts = [ans];
        while (opts.length < 4) {
          var delta = Math.max(1, Math.floor(ans * 0.25));
          var w = ans + Math.floor(Math.random() * delta * 2) - delta;
          if (w >= 0 && opts.indexOf(w) < 0) opts.push(w);
        }
        opts.sort(function () { return Math.random() - 0.5; });
        var box = document.getElementById("gmtOpts");
        if (!box) return;
        box.innerHTML = opts.map(function (o) {
          return '<button class="gbtn" data-ans="' + o + '" style="font-size:20px;padding:14px">' + o + '</button>';
        }).join("");
        Array.prototype.forEach.call(box.querySelectorAll("[data-ans]"), function (btn) {
          btn.onclick = function () {
            if (g.over) return;
            var v = parseInt(btn.getAttribute("data-ans"), 10);
            if (v === g.ans) {
              g.score++; g.combo++;
              btn.style.background = "#34c759";
            } else {
              g.combo = 0;
              btn.style.background = "#fa5151";
            }
            var s = document.getElementById("gmtScore"); if (s) s.textContent = g.score;
            var c = document.getElementById("gmtCombo"); if (c) c.textContent = g.combo;
            setTimeout(next, 120);
          };
        });
      }
      g.timer = setInterval(function () {
        if (g.over) return;
        g.left--;
        var t = document.getElementById("gmtTime");
        if (t) t.textContent = g.left;
        if (g.left <= 0) {
          g.over = true;
          clearInterval(g.timer);
          if (g.score > g.best) { g.best = g.score; bestSet("g565_math", g.best); }
          showModal(
            '<h3>🧮 时间到！</h3>' +
            '<div style="text-align:center;font-size:18px;padding:14px">60 秒答对 <b style="font-size:30px;color:#4a7dff">' + g.score + '</b> 题<br>' +
            '<span class="dim">历史最高 ' + g.best + '</span></div>' +
            '<div style="text-align:center;margin-top:8px"><button class="gbtn" onclick="X565GAMES.math.open()">再来一局</button>' +
            '<button class="gbtn" onclick="closeModal()">退出</button></div>'
          );
        }
      }, 1000);
      next();
      watch("gmtQ", function () { g.over = true; clearInterval(g.timer); });
    }
  };

  /* ═══════════════════════════════════════════════
     3) 成语挑战（填空）
     ═══════════════════════════════════════════════ */
  G.idiom = {
    BANK: [
      { id: "huajian", text: "画龙点睛", blank: 2, mean: "比喻关键处一笔点题。" },
      { id: "shouzhudaitu", text: "守株待兔", blank: 2, mean: "心存侥幸，不劳而获。" },
      { id: "wengzhong", text: "掩耳盗铃", blank: 0, mean: "自欺欺人。" },
      { id: "wangyang", text: "亡羊补牢", blank: 0, mean: "出了问题再补救，尚未为晚。" },
      { id: "jingdi", text: "井底之蛙", blank: 2, mean: "见识短浅的人。" },
      { id: "kelou", text: "刻舟求剑", blank: 0, mean: "拘泥不知变通。" },
      { id: "chengyu", text: "胸有成竹", blank: 1, mean: "做事前已有完整把握。" },
      { id: "yiyuan", text: "一心一意", blank: 1, mean: "心思专一。" },
      { id: "sigu", text: "三顾茅庐", blank: 0, mean: "诚心诚意一再邀请。" },
      { id: "rujisi", text: "如饥似渴", blank: 2, mean: "形容迫切要求。" },
      { id: "jiabiany", text: "家徒四壁", blank: 1, mean: "形容十分贫穷。" },
      { id: "yimeng", text: "一鸣惊人", blank: 1, mean: "平时没有突出表现，一下子做出惊人成绩。" },
      { id: "fenghe", text: "风和日丽", blank: 1, mean: "天气晴朗暖和。" },
      { id: "jianwei", text: "见微知著", blank: 2, mean: "从苗头看到发展趋势。" },
      { id: "luodi", text: "脚踏实地", blank: 0, mean: "做事认真踏实。" },
      { id: "qinhao", text: "勤能补拙", blank: 1, mean: "勤奋能弥补笨拙。" },
      { id: "zhongli", text: "众志成城", blank: 2, mean: "众人一心，力量无比。" },
      { id: "houjibo", text: "厚积薄发", blank: 1, mean: "充分积累，慢慢释放。" },
      { id: "buxiu", text: "坚持不懈", blank: 1, mean: "坚持到底，毫不松懈。" },
      { id: "wenji", text: "闻鸡起舞", blank: 0, mean: "有志之士及时奋发。" },
      { id: "yixu", text: "一丝不苟", blank: 1, mean: "做事极其认真细致。" },
      { id: "xiexial", text: "锲而不舍", blank: 0, mean: "不断地镂刻，比喻有恒心。" },
      { id: "lihua", text: "力争上游", blank: 1, mean: "努力争取先进。" },
      { id: "fenfa", text: "奋发图强", blank: 1, mean: "振作精神，谋求强盛。" },
      { id: "duanlian", text: "精益求精", blank: 1, mean: "好了还求更好。" },
      { id: "shiwai", text: "事半功倍", blank: 0, mean: "费力小、收效大。" },
      { id: "gongyi", text: "功不唐捐", blank: 1, mean: "功夫不会白白付出。" },
      { id: "baoji", text: "宝剑锋从磨砺出", blank: 0, mean: "喻人要经磨难才能成才。" },
      { id: "shanhai", text: "书山有路勤为径", blank: 2, mean: "学习需勤奋。" },
      { id: "xianjia", text: "先苦后甜", blank: 1, mean: "先经历艰苦后获得甘甜。" },
      { id: "xuehai", text: "学海无涯", blank: 1, mean: "学问没有边际。" },
      { id: "zhichi", text: "持之以恒", blank: 2, mean: "长久坚持。" },
      { id: "xinfeng", text: "心驰神往", blank: 1, mean: "一心向往。" },
      { id: "zhiyuan", text: "志存高远", blank: 1, mean: "志向远大。" },
      { id: "tuile", text: "推陈出新", blank: 1, mean: "去掉旧的，产生新的。" },
      { id: "duchuang", text: "独具匠心", blank: 1, mean: "有独到的构思。" },
      { id: "miaoqu", text: "妙趣横生", blank: 1, mean: "充满美妙的情趣。" },
      { id: "yiran", text: "怡然自得", blank: 0, mean: "安适愉快。" },
      { id: "shenji", text: "神机妙算", blank: 0, mean: "善于估计复杂情势。" },
      { id: "mouduan", text: "谋事在人", blank: 0, mean: "事情的成败取决于人的努力。" }
    ],
    used: [],
    open: function () {
      var g = this;
      g.best = bestGet("g565_idiom");
      showModal(
        '<h3>📖 成语挑战</h3>' +
        '<div style="max-width:420px;margin:0 auto">' +
        '<div class="xz13-game-hud"><span>得分 <b id="gidScore">0</b></span>' +
        '<span>连击 <b id="gidCombo">0</b></span>' +
        '<span>最高 <b>' + g.best + '</b></span></div>' +
        '<div id="gidQ" style="text-align:center;font-size:38px;font-weight:800;letter-spacing:4px;margin:16px 0"></div>' +
        '<div id="gidMean" class="dim small" style="text-align:center;min-height:18px"></div>' +
        '<div id="gidOpts" style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;max-width:300px;margin:12px auto"></div>' +
        '<div style="text-align:center"><button class="gbtn" onclick="closeModal()">退出</button></div>' +
        '</div>'
      );
      g.score = 0; g.combo = 0; g.used = [];
      function next() {
        if (g.used.length >= g.BANK.length) g.used = [];
        var idx;
        do { idx = Math.floor(Math.random() * g.BANK.length); } while (g.used.indexOf(idx) >= 0 && g.used.length < g.BANK.length);
        g.used.push(idx);
        var item = g.BANK[idx];
        var ans = item.text[item.blank];
        var chars = item.text.split("");
        chars[item.blank] = "＿";
        var q = document.getElementById("gidQ");
        if (q) q.textContent = chars.join(" ");
        var m = document.getElementById("gidMean");
        if (m) m.textContent = "";
        var opts = [ans];
        var pool = "天地人龙兔蛙舟剑竹意顾茅渴壁鸣丽著地拙城薄懈积苦恒往远陈匠横怡神谋".split("");
        while (opts.length < 4) {
          var w = pool[Math.floor(Math.random() * pool.length)];
          if (opts.indexOf(w) < 0) opts.push(w);
        }
        opts.sort(function () { return Math.random() - 0.5; });
        var box = document.getElementById("gidOpts");
        if (!box) return;
        box.innerHTML = opts.map(function (o) {
          return '<button class="gbtn" data-c="' + o + '" style="font-size:22px;padding:12px">' + o + '</button>';
        }).join("");
        Array.prototype.forEach.call(box.querySelectorAll("[data-c]"), function (btn) {
          btn.onclick = function () {
            if (btn.getAttribute("data-c") === ans) {
              g.score++; g.combo++;
              if (m) m.textContent = "✅ " + item.text + "：" + item.mean;
              setTimeout(next, 850);
            } else {
              g.combo = 0;
              btn.style.background = "#fa5151";
              if (m) m.textContent = "❌ 正确答案是「" + ans + "」，" + item.mean;
            }
            var s = document.getElementById("gidScore"); if (s) s.textContent = g.score;
            var c = document.getElementById("gidCombo"); if (c) c.textContent = g.combo;
            if (g.score > g.best) { g.best = g.score; bestSet("g565_idiom", g.best); }
          };
        });
      }
      next();
    }
  };

  /* 注册进游戏中心 */
  try {
    if (window.XZ13 && window.XZ13.GAMES) {
      window.XZ13.GAMES.push(
        { icon: "📜", name: "接卷子", bestKey: "g565_catch", call: "X565GAMES.catch.open()" },
        { icon: "🧮", name: "口算竞速", bestKey: "g565_math", call: "X565GAMES.math.open()" },
        { icon: "📖", name: "成语挑战", bestKey: "g565_idiom", call: "X565GAMES.idiom.open()" }
      );
    }
  } catch (e) {}
});


/* ===== p61_games2.js ===== */
/* ============================================================================
   p61 · 5.6.5 新增小游戏（再 4 个，自包含，真实判定 + 本地最高纪录）
   4) 翻牌配对（记忆翻牌，校园主题）
   5) 食堂抢饭（节奏反应，绿色区间下手）
   6) 单词冲刺（60 秒英→中速选）
   7) 记忆方块（Simon 序列，越背越长）
   全部注册进 5.5.13「游戏中心」，关闭弹窗即清理定时器
   ============================================================================ */
register("games2-565", function () {
  var G = window.X565GAMES = window.X565GAMES || {};
  var XZ13 = window.XZ13 || null;
  function showModal(html) {
    if (XZ13 && typeof XZ13.modal === "function") XZ13.modal(html);
    else if (typeof window.modal === "function") window.modal(html);
  }
  /* 根节点消失即停止该游戏的所有定时器/动画 */
  function watch(rootId, handles) {
    var t = setInterval(function () {
      if (!document.getElementById(rootId)) {
        clearInterval(t);
        (handles || []).forEach(function (h) {
          try { if (typeof h === "number") clearInterval(h); else if (typeof h === "function") h(); } catch (e) {}
        });
      }
    }, 400);
    return t;
  }
  function bestGet(key) { var v = parseInt(storageGet(key), 10); return isNaN(v) ? 0 : v; }
  function bestSet(key, v) { storageSet(key, String(v)); }
  function bar(hud, btn) {
    return '<div class="xz13-save-bar" style="justify-content:center">' +
      '<button class="xz13-save-ss-btn" id="' + btn + '">重开</button>' +
      '<button class="xz13-save-ss-btn" onclick="closeModal()">退出</button></div>';
  }

  /* ═══════════════════════════════════════════════
     4) 翻牌配对（记忆）
     ═══════════════════════════════════════════════ */
  G.memory = {
    open: function () {
      var g = this;
      g.bestMoves = bestGet("g565_mem_best");
      showModal(
        '<div id="gmemRoot" style="max-width:400px;margin:0 auto">' +
        '<h3>🃏 翻牌配对</h3>' +
        '<div class="xz13-game-hud"><span>已配对 <b id="gmemPairs">0/8</b></span>' +
        '<span>步数 <b id="gmemMoves">0</b></span>' +
        '<span>最佳步数 <b id="gmemBest">' + (g.bestMoves || "—") + '</b></span></div>' +
        '<div id="gmemGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:380px;margin:8px auto"></div>' +
        bar("", "gmemRestart") +
        '<p class="dim small" style="text-align:center">点卡片翻牌，找出相同的一对，步数越少越好</p></div>'
      );
      var grid = document.getElementById("gmemGrid");
      var emojis = ["📚", "✏️", "🏀", "🎹", "🎨", "🍰", "🎤", "🌸"];
      var deck = emojis.concat(emojis).sort(function () { return Math.random() - 0.5; });
      var first = null, lock = false, moves = 0, pairs = 0;
      function upd() {
        var pm = document.getElementById("gmemPairs"); if (pm) pm.textContent = pairs + "/8";
        var mv = document.getElementById("gmemMoves"); if (mv) mv.textContent = moves;
      }
      deck.forEach(function (e, i) {
        var c = document.createElement("button");
        c.className = "gmem-card";
        c.style.cssText = "height:72px;border-radius:12px;border:1px solid rgba(127,127,127,.25);background:linear-gradient(135deg,#7fd1ae,#4fb3a6);font-size:28px;cursor:pointer;color:transparent;transition:transform .15s";
        c.textContent = e;
        c.dataset.e = e;
        c.onclick = function () {
          if (lock || c.classList.contains("done") || c === first) return;
          c.style.background = "#fff"; c.style.color = "#333";
          if (!first) { first = c; return; }
          moves++; upd();
          var a = first;
          if (a.dataset.e === c.dataset.e) {
            a.classList.add("done"); c.classList.add("done");
            a.style.background = "#e8f8ee"; c.style.background = "#e8f8ee";
            first = null; pairs++; upd();
            if (pairs === 8) {
              if (!g.bestMoves || moves < g.bestMoves) { g.bestMoves = moves; bestSet("g565_mem_best", moves); }
              setTimeout(function () {
                var b = document.getElementById("gmemBest"); if (b) b.textContent = g.bestMoves || "—";
                toast("全部配对成功！用了 " + moves + " 步");
              }, 200);
            }
          } else {
            lock = true;
            var x = first, y = c;
            setTimeout(function () {
              x.style.background = "linear-gradient(135deg,#7fd1ae,#4fb3a6)"; x.style.color = "transparent";
              y.style.background = "linear-gradient(135deg,#7fd1ae,#4fb3a6)"; y.style.color = "transparent";
              first = null; lock = false;
            }, 620);
          }
        };
        grid.appendChild(c);
      });
      var rb = document.getElementById("gmemRestart");
      if (rb) rb.onclick = function () { G.memory.open(); };
    }
  };

  /* ═══════════════════════════════════════════════
     5) 食堂抢饭（节奏）
     ═══════════════════════════════════════════════ */
  G.canteen = {
    open: function () {
      var g = this;
      g.best = bestGet("g565_canteen");
      showModal(
        '<div id="gcanRoot" style="max-width:400px;margin:0 auto">' +
        '<h3>🍚 食堂抢饭</h3>' +
        '<div class="xz13-game-hud"><span>轮次 <b id="gcanRnd">1/10</b></span>' +
        '<span>得分 <b id="gcanScore">0</b></span>' +
        '<span>最高 <b id="gcanBest">' + g.best + '</b></span></div>' +
        '<div class="dim small" style="text-align:center">指针移动到<span style="color:#22b07d;font-weight:800">绿色菜区</span>时，立刻点「夹菜」</div>' +
        '<div id="gcanTrack" style="position:relative;height:44px;border-radius:12px;background:linear-gradient(90deg,#f6c6c6,#f3d9a6,#7fd1ae 40%,#7fd1ae 60%,#f3d9a6,#f6c6c6);margin:10px 0;overflow:hidden">' +
          '<div id="gcanZone" style="position:absolute;top:0;bottom:0;left:40%;width:20%;background:rgba(34,176,125,.35);border-left:2px dashed #15966b;border-right:2px dashed #15966b"></div>' +
          '<div id="gcanPtr" style="position:absolute;top:0;bottom:0;width:6px;background:#e8513f;border-radius:3px;left:0;box-shadow:0 0 6px rgba(232,81,63,.8)"></div>' +
        '</div>' +
        '<div style="text-align:center;font-size:40px;margin:6px 0" id="gcanDish">🍜</div>' +
        '<button class="gbtn big" id="gcanHit" style="width:100%;min-height:56px;font-size:18px">🥢 夹菜！</button>' +
        bar("", "gcanRestart") +
        '<p class="dim small" style="text-align:center">每轮绿色区间随机移动，越正中得分越高</p></div>'
      );
      var dishes = ["🍜", "🍛", "🍗", "🥟", "🍤", "🍚", "🥘", "🍲", "🥗", "🧋"];
      var pos = 0, dir = 1, speed = 1.6, rnd = 1, score = 0, zoneL = 40, zoneR = 60, playing = true;
      var track = document.getElementById("gcanTrack");
      var ptr = document.getElementById("gcanPtr");
      var zone = document.getElementById("gcanZone");
      function newRound() {
        zoneL = 12 + Math.floor(Math.random() * 64);
        zoneR = Math.min(88, zoneL + 18);
        if (zone) { zone.style.left = zoneL + "%"; zone.style.width = (zoneR - zoneL) + "%"; }
        var d = document.getElementById("gcanDish"); if (d) d.textContent = dishes[(rnd - 1) % dishes.length];
        var r = document.getElementById("gcanRnd"); if (r) r.textContent = Math.min(rnd, 10) + "/10";
        speed = 1.4 + rnd * 0.18;
      }
      function hit() {
        if (!playing) return;
        var pct = pos;
        var mid = (zoneL + zoneR) / 2;
        var gain = 0, msg = "";
        if (pct >= zoneL && pct <= zoneR) {
          var dist = Math.abs(pct - mid);
          if (dist < 3) { gain = 10; msg = "正中！+" + gain; }
          else if (dist < 6) { gain = 7; msg = "夹到了！+" + gain; }
          else { gain = 4; msg = "勉强夹到 +" + gain; }
          score += gain;
        } else {
          msg = "夹空了…";
          var d = document.getElementById("gcanDish"); if (d) d.textContent = "😩";
        }
        var s = document.getElementById("gcanScore"); if (s) s.textContent = score;
        toast(msg, 650);
        rnd++;
        if (rnd > 10) {
          playing = false;
          clearInterval(h);
          if (score > g.best) { g.best = score; bestSet("g565_canteen", score); }
          var b = document.getElementById("gcanBest"); if (b) b.textContent = g.best;
          var dd = document.getElementById("gcanDish"); if (dd) dd.textContent = "🏁";
          toast("十轮结束，总分 " + score);
          return;
        }
        newRound();
      }
      var h = setInterval(function () {
        if (!playing) return;
        pos += dir * speed;
        if (pos >= 100) { pos = 100; dir = -1; }
        if (pos <= 0) { pos = 0; dir = 1; }
        if (ptr) ptr.style.left = "calc(" + pos + "% - 3px)";
      }, 20);
      var hitBtn = document.getElementById("gcanHit");
      if (hitBtn) hitBtn.onclick = hit;
      var rb = document.getElementById("gcanRestart");
      if (rb) rb.onclick = function () { clearInterval(h); G.canteen.open(); };
      newRound();
      watch("gcanRoot", [h]);
    }
  };

  /* ═══════════════════════════════════════════════
     6) 单词冲刺（英→中速选）
     ═══════════════════════════════════════════════ */
  G.word = {
    words: [
      ["library", "图书馆"], ["playground", "操场"], ["canteen", "食堂"], ["dormitory", "宿舍"],
      ["blackboard", "黑板"], ["homework", "作业"], ["exam", "考试"], ["break", "课间"],
      ["classroom", "教室"], ["teacher", "老师"], ["student", "学生"], ["headmaster", "校长"],
      ["lesson", "课程"], ["subject", "科目"], ["chalk", "粉笔"], ["pencil", "铅笔"],
      ["eraser", "橡皮"], ["ruler", "尺子"], ["notebook", "笔记本"], ["backpack", "书包"],
      ["breakfast", "早餐"], ["lunch", "午餐"], ["dinner", "晚餐"], ["noodles", "面条"],
      ["dumpling", "饺子"], ["vegetable", "蔬菜"], ["exercise", "锻炼"], ["basketball", "篮球"],
      ["piano", "钢琴"], ["painting", "绘画"], ["music", "音乐"], ["science", "科学"],
      ["history", "历史"], ["geography", "地理"], ["biology", "生物"], ["chemistry", "化学"],
      ["physics", "物理"], ["english", "英语"], ["chinese", "语文"], ["math", "数学"],
      ["monday", "星期一"], ["friday", "星期五"], ["weekend", "周末"], ["holiday", "假期"],
      ["morning", "早晨"], ["evening", "傍晚"], ["weather", "天气"], ["umbrella", "雨伞"],
      ["friend", "朋友"], ["classmate", "同学"]
    ],
    open: function () {
      var g = this;
      g.best = bestGet("g565_word");
      var pool = g.words.slice();
      showModal(
        '<div id="gwordRoot" style="max-width:400px;margin:0 auto">' +
        '<h3>🔤 单词冲刺</h3>' +
        '<div class="xz13-game-hud"><span>时间 <b id="gwordTime">60</b>s</span>' +
        '<span>得分 <b id="gwordScore">0</b></span>' +
        '<span>最高 <b id="gwordBest">' + g.best + '</b></span></div>' +
        '<div id="gwordQ" style="text-align:center;font-size:30px;font-weight:800;margin:18px 0"></div>' +
        '<div id="gwordOpts" style="display:grid;grid-template-columns:1fr 1fr;gap:8px"></div>' +
        bar("", "gwordRestart") +
        '<p class="dim small" style="text-align:center">60 秒内选对中文，答对加时，答错扣 2 秒</p></div>'
      );
      var time = 60, score = 0, playing = true;
      var qEl = document.getElementById("gwordQ");
      var opts = document.getElementById("gwordOpts");
      function pick(n) { var a = []; while (a.length < n) { var w = pool[Math.floor(Math.random() * pool.length)]; if (a.indexOf(w) < 0) a.push(w); } return a; }
      function next() {
        if (!playing) return;
        var w = pool[Math.floor(Math.random() * pool.length)];
        if (qEl) qEl.textContent = w[0];
        var choices = pick(4);
        if (choices.indexOf(w) < 0) choices[0] = w;
        choices.sort(function () { return Math.random() - 0.5; });
        opts.innerHTML = choices.map(function (c) {
          return '<button class="gbtn gwordOpt" data-c="' + c[1] + '" style="min-height:48px;font-size:16px">' + c[1] + '</button>';
        }).join("");
        Array.prototype.forEach.call(opts.querySelectorAll(".gwordOpt"), function (btn) {
          btn.onclick = function () {
            if (!playing) return;
            if (btn.getAttribute("data-c") === w[1]) {
              score++; time += 1;
              if (time > 60) time = 60;
              var s = document.getElementById("gwordScore"); if (s) s.textContent = score;
              btn.style.background = "#22b07d";
              setTimeout(next, 200);
            } else {
              time -= 2;
              btn.style.background = "#fa5151";
              toast("是「" + w[1] + "」", 600);
            }
          };
        });
      }
      var t = setInterval(function () {
        if (!playing) return;
        time--;
        var el = document.getElementById("gwordTime");
        if (el) el.textContent = Math.max(0, time);
        if (time <= 0) {
          playing = false; clearInterval(t);
          if (score > g.best) { g.best = score; bestSet("g565_word", score); }
          var b = document.getElementById("gwordBest"); if (b) b.textContent = g.best;
          opts.innerHTML = "";
          if (qEl) qEl.innerHTML = '⏰ 时间到！<br><span style="font-size:18px">答对 ' + score + ' 个</span>';
        }
      }, 1000);
      var rb = document.getElementById("gwordRestart");
      if (rb) rb.onclick = function () { clearInterval(t); G.word.open(); };
      next();
      watch("gwordRoot", [t]);
    }
  };

  /* ═══════════════════════════════════════════════
     7) 记忆方块（Simon）
     ═══════════════════════════════════════════════ */
  G.simon = {
    open: function () {
      var g = this;
      g.best = bestGet("g565_simon");
      showModal(
        '<div id="gsimRoot" style="max-width:360px;margin:0 auto">' +
        '<h3>🧠 记忆方块</h3>' +
        '<div class="xz13-game-hud"><span>关卡 <b id="gsimLv">1</b></span>' +
        '<span>最高 <b id="gsimBest">' + g.best + '</b></span>' +
        '<span id="gsimTip" style="color:var(--accent,#4fb3a6)">看好顺序</span></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:300px;margin:10px auto">' +
          '<button class="gsimPad" data-i="0" style="height:120px;border-radius:16px;border:none;background:#ff7a7a;cursor:pointer"></button>' +
          '<button class="gsimPad" data-i="1" style="height:120px;border-radius:16px;border:none;background:#7fb3ff;cursor:pointer"></button>' +
          '<button class="gsimPad" data-i="2" style="height:120px;border-radius:16px;border:none;background:#7fd1ae;cursor:pointer"></button>' +
          '<button class="gsimPad" data-i="3" style="height:120px;border-radius:16px;border:none;background:#f6cf6e;cursor:pointer"></button>' +
        '</div>' +
        bar("", "gsimRestart") +
        '<p class="dim small" style="text-align:center">记住亮起顺序，按相同顺序点击，序列每次 +1</p></div>'
      );
      var pads = Array.prototype.slice.call(document.querySelectorAll(".gsimPad"));
      var base = ["#ff7a7a", "#7fb3ff", "#7fd1ae", "#f6cf6e"];
      var flash = ["#ffd2d2", "#d2e2ff", "#d2f2e2", "#fdeec2"];
      var seq = [], input = [], lv = 1, busy = false;
      var handles = [];
      function light(i, on) {
        pads[i].style.background = on ? flash[i] : base[i];
      }
      function playSeq() {
        busy = true; input = [];
        var tip = document.getElementById("gsimTip"); if (tip) tip.textContent = "看好顺序…";
        var i = 0;
        var step = function () {
          if (i >= seq.length) {
            pads.forEach(function (p, k) { light(k, false); });
            busy = false;
            if (tip) tip.textContent = "请按顺序点";
            return;
          }
          pads.forEach(function (p, k) { light(k, false); });
          light(seq[i], true);
          var cur = i;
          var t1 = setTimeout(function () { light(cur, false); }, 360);
          handles.push(t1);
          var t2 = setTimeout(function () { i++; step(); }, 620);
          handles.push(t2);
        };
        step();
      }
      function fail() {
        busy = true;
        var tip = document.getElementById("gsimTip"); if (tip) tip.textContent = "❌ 错了，最终 " + (lv - 1) + " 关";
        pads.forEach(function (p, k) { p.style.background = "#ddd"; });
        var finalLv = lv - 1;
        if (finalLv > g.best) { g.best = finalLv; bestSet("g565_simon", finalLv); }
        var b = document.getElementById("gsimBest"); if (b) b.textContent = g.best;
        handles.push(setTimeout(function () {
          seq = []; lv = 1;
          var l = document.getElementById("gsimLv"); if (l) l.textContent = lv;
          pads.forEach(function (p, k) { p.style.background = base[k]; });
          startRound();
        }, 1400));
      }
      function startRound() {
        seq.push(Math.floor(Math.random() * 4));
        var l = document.getElementById("gsimLv"); if (l) l.textContent = lv;
        handles.push(setTimeout(playSeq, 700));
      }
      pads.forEach(function (p) {
        p.onclick = function () {
          if (busy) return;
          var i = parseInt(p.getAttribute("data-i"), 10);
          light(i, true);
          handles.push(setTimeout(function () { light(i, false); }, 200));
          input.push(i);
          var k = input.length - 1;
          if (input[k] !== seq[k]) { fail(); return; }
          if (input.length === seq.length) {
            busy = true;
            lv++;
            var tip = document.getElementById("gsimTip"); if (tip) tip.textContent = "✅ 正确！";
            handles.push(setTimeout(startRound, 800));
          }
        };
      });
      startRound();
      var rb = document.getElementById("gsimRestart");
      if (rb) {
        rb.onclick = function () {
          handles.forEach(function (h) { clearTimeout(h); });
          G.simon.open();
        };
      }
      watch("gsimRoot", [function () { handles.forEach(function (h) { clearTimeout(h); }); }]);
    }
  };

  /* 注册进游戏中心 */
  try {
    if (window.XZ13 && window.XZ13.GAMES) {
      window.XZ13.GAMES.push(
        { icon: "🃏", name: "翻牌配对", bestKey: "g565_mem_best", call: "X565GAMES.memory.open()" },
        { icon: "🍚", name: "食堂抢饭", bestKey: "g565_canteen", call: "X565GAMES.canteen.open()" },
        { icon: "🔤", name: "单词冲刺", bestKey: "g565_word", call: "X565GAMES.word.open()" },
        { icon: "🧠", name: "记忆方块", bestKey: "g565_simon", call: "X565GAMES.simon.open()" }
      );
    }
  } catch (e) {}
});


/* ===== p63_games3.js ===== */
/* ============================================================================
   p63 · 5.6.5 新增小游戏（第三批 4 个）
   8) 打地鼠（30 秒反应）
   9) 2048（4×4 合并，键盘/触屏滑动）
   10) 反应测试（等变绿，测反应毫秒）
   11) 数字华容道（3×3 滑块，计步计时）
   全部注册进游戏中心，关闭弹窗即清理
   ============================================================================ */
register("games3-565", function () {
  var G = window.X565GAMES = window.X565GAMES || {};
  var XZ13 = window.XZ13 || null;
  function showModal(html) {
    if (XZ13 && typeof XZ13.modal === "function") XZ13.modal(html);
    else if (typeof window.modal === "function") window.modal(html);
  }
  function watch(rootId, handles) {
    var t = setInterval(function () {
      if (!document.getElementById(rootId)) {
        clearInterval(t);
        (handles || []).forEach(function (h) {
          try { if (typeof h === "number") clearInterval(h); else if (typeof h === "function") h(); } catch (e) {}
        });
      }
    }, 400);
    return t;
  }
  function bestGet(key) { var v = parseInt(storageGet(key), 10); return isNaN(v) ? 0 : v; }
  function bestSet(key, v) { storageSet(key, String(v)); }
  function bar(btn) {
    return '<div class="xz13-save-bar" style="justify-content:center;margin-top:8px">' +
      '<button class="xz13-save-ss-btn" id="' + btn + '">重开</button>' +
      '<button class="xz13-save-ss-btn" onclick="closeModal()">退出</button></div>';
  }

  /* ═══════════ 8) 打地鼠 ═══════════ */
  G.whack = {
    open: function () {
      var g = this;
      g.best = bestGet("g565_whack");
      showModal(
        '<div id="gwhRoot" style="max-width:380px;margin:0 auto">' +
        '<h3>🔨 打地鼠</h3>' +
        '<div class="xz13-game-hud"><span>时间 <b id="gwhTime">30</b>s</span>' +
        '<span>得分 <b id="gwhScore">0</b></span>' +
        '<span>最高 <b id="gwhBest">' + g.best + '</b></span></div>' +
        '<div id="gwhGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:340px;margin:10px auto"></div>' +
        bar("gwhRestart") +
        '<p class="dim small" style="text-align:center">冒头的🐹点一下，别点到💣</p></div>'
      );
      var grid = document.getElementById("gwhGrid");
      var cells = [];
      for (var i = 0; i < 9; i++) {
        var c = document.createElement("button");
        c.style.cssText = "height:86px;border-radius:14px;border:none;font-size:38px;background:linear-gradient(180deg,#c9a06a,#9c744a);cursor:pointer;color:#6e4f2a";
        c.textContent = "";
        c.dataset.mole = "0";
        c.onclick = function () {
          if (this.dataset.mole === "mole") {
            score++; this.dataset.mole = "0"; this.textContent = "💥";
            var s = document.getElementById("gwhScore"); if (s) s.textContent = score;
          } else if (this.dataset.mole === "bomb") {
            score = Math.max(0, score - 2); this.dataset.mole = "0"; this.textContent = "😵";
            var s2 = document.getElementById("gwhScore"); if (s2) s2.textContent = score;
          }
        };
        grid.appendChild(c); cells.push(c);
      }
      var time = 30, score = 0, running = true, pop = 0, tick = 0;
      function spawn() {
        cells.forEach(function (c) { if (Math.random() < 0.35) { c.dataset.mole = "0"; c.textContent = ""; } });
        var idx = Math.floor(Math.random() * 9);
        var isBomb = Math.random() < 0.18;
        cells[idx].dataset.mole = isBomb ? "bomb" : "mole";
        cells[idx].textContent = isBomb ? "💣" : "🐹";
      }
      var h = setInterval(function () {
        if (!running) return;
        tick++;
        if (tick % 3 === 0) spawn();
        if (tick % 10 === 0) {
          time--;
          var t = document.getElementById("gwhTime"); if (t) t.textContent = Math.max(0, time);
          if (time <= 0) {
            running = false; clearInterval(h);
            if (score > g.best) { g.best = score; bestSet("g565_whack", score); }
            var b = document.getElementById("gwhBest"); if (b) b.textContent = g.best;
            cells.forEach(function (c) { c.dataset.mole = "0"; c.textContent = "🏁"; });
            toast("时间到！得分 " + score);
          }
        }
      }, 100);
      spawn();
      var rb = document.getElementById("gwhRestart");
      if (rb) rb.onclick = function () { clearInterval(h); G.whack.open(); };
      watch("gwhRoot", [h]);
    }
  };

  /* ═══════════ 9) 2048 ═══════════ */
  G.g2048 = {
    open: function () {
      var g = this;
      g.best = bestGet("g565_2048");
      showModal(
        '<div id="g2048Root" style="max-width:360px;margin:0 auto">' +
        '<h3>🔢 2048</h3>' +
        '<div class="xz13-game-hud"><span>分数 <b id="g2048Score">0</b></span>' +
        '<span>最高 <b id="g2048Best">' + g.best + '</b></span></div>' +
        '<div id="g2048Board" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-width:320px;margin:10px auto;background:#bbada0;padding:8px;border-radius:12px;touch-action:none"></div>' +
        '<div style="display:flex;gap:8px;justify-content:center" id="g2048Pad">' +
          '<button class="gbtn" data-m="up">↑</button>' +
          '<button class="gbtn" data-m="down">↓</button>' +
          '<button class="gbtn" data-m="left">←</button>' +
          '<button class="gbtn" data-m="right">→</button>' +
        '</div>' + bar("g2048Restart") +
        '<p class="dim small" style="text-align:center">方向键 / 滑动 / 按钮移动，相同数字合并</p></div>'
      );
      var board = document.getElementById("g2048Board");
      var tiles = [], score = 0, over = false;
      var colors = { 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563", 32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72", 256: "#edcc61", 512: "#edc850", 1024: "#edc53f", 2048: "#edc22e" };
      function render() {
        board.innerHTML = "";
        for (var i = 0; i < 16; i++) {
          var v = tiles[i], cell = document.createElement("div");
          cell.style.cssText = "height:70px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;background:" +
            (v ? (colors[v] || "#3c3a32") : "#cdc1b4") + ";color:" + (v && v <= 4 ? "#776e65" : "#fff");
          cell.textContent = v || "";
          board.appendChild(cell);
        }
        var s = document.getElementById("g2048Score"); if (s) s.textContent = score;
      }
      function addTile() {
        var empty = [];
        for (var i = 0; i < 16; i++) if (!tiles[i]) empty.push(i);
        if (!empty.length) return;
        tiles[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4;
      }
      function slide(row) {
        var arr = row.filter(Boolean);
        for (var i = 0; i < arr.length - 1; i++) {
          if (arr[i] === arr[i + 1]) { arr[i] *= 2; score += arr[i]; arr.splice(i + 1, 1); }
        }
        while (arr.length < 4) arr.push(0);
        return arr;
      }
      function move(dir) {
        if (over) return;
        var before = tiles.slice();
        var grid = [[], [], [], []];
        for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) grid[r][c] = tiles[r * 4 + c];
        if (dir === "left") for (var r1 = 0; r1 < 4; r1++) grid[r1] = slide(grid[r1]);
        if (dir === "right") for (var r2 = 0; r2 < 4; r2++) grid[r2] = slide(grid[r2].reverse()).reverse();
        if (dir === "up") {
          for (var c1 = 0; c1 < 4; c1++) { var col = [grid[0][c1], grid[1][c1], grid[2][c1], grid[3][c1]]; col = slide(col); for (var k = 0; k < 4; k++) grid[k][c1] = col[k]; }
        }
        if (dir === "down") {
          for (var c2 = 0; c2 < 4; c2++) { var col2 = [grid[3][c2], grid[2][c2], grid[1][c2], grid[0][c2]]; col2 = slide(col2); for (var k2 = 0; k2 < 4; k2++) grid[3 - k2][c2] = col2[k2]; }
        }
        for (var i2 = 0; i2 < 4; i2++) for (var c3 = 0; c3 < 4; c3++) tiles[i2 * 4 + c3] = grid[i2][c3];
        var changed = before.some(function (v, i) { return v !== tiles[i]; });
        if (changed) {
          addTile(); render();
          if (score > g.best) { g.best = score; bestSet("g565_2048", score); var b = document.getElementById("g2048Best"); if (b) b.textContent = g.best; }
          if (!canMove()) { over = true; toast("无法移动，结束！分数 " + score); }
        }
      }
      function canMove() {
        for (var i = 0; i < 16; i++) if (!tiles[i]) return true;
        for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
          var v = tiles[r * 4 + c];
          if (c < 3 && tiles[r * 4 + c + 1] === v) return true;
          if (r < 3 && tiles[(r + 1) * 4 + c] === v) return true;
        }
        return false;
      }
      function reset() {
        tiles = new Array(16).fill(0); score = 0; over = false;
        addTile(); addTile(); render();
      }
      Array.prototype.forEach.call(document.querySelectorAll("#g2048Pad [data-m]"), function (b) {
        b.onclick = function () { move(b.getAttribute("data-m")); };
      });
      function key(e) {
        var map = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
        if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
      }
      document.addEventListener("keydown", key);
      var sx = 0, sy = 0, root = document.getElementById("g2048Root");
      root.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      root.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
        if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left");
        else move(dy > 0 ? "down" : "up");
      }, { passive: true });
      var watchT = setInterval(function () {
        if (!document.getElementById("g2048Root")) { clearInterval(watchT); document.removeEventListener("keydown", key); }
      }, 500);
      var rb = document.getElementById("g2048Restart");
      if (rb) rb.onclick = function () { reset(); };
      reset();
    }
  };

  /* ═══════════ 10) 反应测试 ═══════════ */
  G.react = {
    open: function () {
      var g = this;
      g.best = bestGet("g565_react");
      showModal(
        '<div id="greactRoot" style="max-width:380px;margin:0 auto;text-align:center">' +
        '<h3>⚡ 反应测试</h3>' +
        '<div class="dim small">最佳（毫秒，越小越好）：<b id="greactBest">' + (g.best || "—") + "</b></div>" +
        '<div id="greactPad" style="height:200px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;margin:14px 0;background:#6ea0ec;color:#fff;cursor:pointer;user-select:none">点击开始</div>' +
        bar("greactRestart") +
        '<p class="dim small">等变绿再点，抢跑会失败；共 5 次取平均</p></div>'
      );
      var pad = document.getElementById("greactPad");
      var rounds = 0, times = [], state = "idle", startT = 0, timer = 0;
      function setIdle(msg, color) {
        state = "idle";
        pad.textContent = msg;
        pad.style.background = color || "#6ea0ec";
      }
      function beginRound() {
        if (rounds >= 5) {
          var avg = Math.round(times.reduce(function (a, b) { return a + b; }, 0) / times.length);
          if (!g.best || avg < g.best) { g.best = avg; bestSet("g565_react", avg); }
          var b = document.getElementById("greactBest"); if (b) b.textContent = g.best;
          setIdle("平均 " + avg + " ms！点这里重测", "#22b07d");
          rounds = 0; times = [];
          return;
        }
        state = "wait";
        pad.textContent = "等待变绿…（别抢）";
        pad.style.background = "#e8513f";
        var delay = 1200 + Math.random() * 2200;
        timer = setTimeout(function () {
          state = "go";
          startT = performance.now();
          pad.textContent = "快！";
          pad.style.background = "#22b07d";
        }, delay);
      }
      pad.onclick = function () {
        if (state === "idle") {
          rounds = 0; times = [];
          beginRound();
        } else if (state === "wait") {
          clearTimeout(timer);
          setIdle("抢跑啦！点这里重来", "#e8a83c");
          rounds = 0; times = [];
        } else if (state === "go") {
          var ms = Math.round(performance.now() - startT);
          times.push(ms); rounds++;
          setIdle(ms + " ms（" + rounds + "/5）", "#6ea0ec");
          setTimeout(beginRound, 800);
        }
      };
      var rb = document.getElementById("greactRestart");
      if (rb) rb.onclick = function () { clearTimeout(timer); rounds = 0; times = []; setIdle("点击开始", "#6ea0ec"); };
      watch("greactRoot", [function () { clearTimeout(timer); }]);
    }
  };

  /* ═══════════ 11) 数字华容道（3×3） ═══════════ */
  G.puzzle = {
    open: function () {
      var g = this;
      g.best = bestGet("g565_puzzle");
      showModal(
        '<div id="gpuzRoot" style="max-width:340px;margin:0 auto;text-align:center">' +
        '<h3>🧩 数字华容道</h3>' +
        '<div class="xz13-game-hud"><span>步数 <b id="gpuzMoves">0</b></span>' +
        '<span>时间 <b id="gpuzTime">0</b>s</span>' +
        '<span>最佳步数 <b id="gpuzBest">' + (g.best || "—") + "</b></span></div>" +
        '<div id="gpuzBoard" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:300px;margin:10px auto"></div>' +
        bar("gpuzRestart") +
        '<p class="dim small">点空格旁的数字滑动，按 1–8 顺序排好</p></div>'
      );
      var board = document.getElementById("gpuzBoard");
      var arr = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      var moves = 0, sec = 0, started = false, won = false, timer = 0;
      function render() {
        board.innerHTML = "";
        arr.forEach(function (v, i) {
          var b = document.createElement("button");
          b.style.cssText = "height:86px;border-radius:12px;border:none;font-size:32px;font-weight:800;cursor:pointer" +
            (v ? ";background:linear-gradient(135deg,#7fd1ae,#4fb3a6);color:#fff" : ";background:transparent");
          b.textContent = v || "";
          if (v) b.onclick = function () { tryMove(i); };
          board.appendChild(b);
        });
        var m = document.getElementById("gpuzMoves"); if (m) m.textContent = moves;
      }
      function neighbors(empty) {
        var r = Math.floor(empty / 3), c = empty % 3, out = [];
        if (r > 0) out.push(empty - 3);
        if (r < 2) out.push(empty + 3);
        if (c > 0) out.push(empty - 1);
        if (c < 2) out.push(empty + 1);
        return out;
      }
      function tryMove(i) {
        if (won) return;
        var e = arr.indexOf(0);
        if (neighbors(e).indexOf(i) < 0) return;
        if (!started) { started = true; timer = setInterval(function () { sec++; var t = document.getElementById("gpuzTime"); if (t) t.textContent = sec; }, 1000); }
        arr[e] = arr[i]; arr[i] = 0; moves++;
        render();
        if (arr.slice(0, 8).join("") === "12345678") {
          won = true; clearInterval(timer);
          if (!g.best || moves < g.best) { g.best = moves; bestSet("g565_puzzle", moves); }
          var b = document.getElementById("gpuzBest"); if (b) b.textContent = g.best;
          toast("完成！" + moves + " 步，" + sec + " 秒");
        }
      }
      function shuffle() {
        /* 随机执行若干合法移动，保证有解 */
        var cur = arr.slice();
        for (var k = 0; k < 80; k++) {
          var e = cur.indexOf(0);
          var ns = neighbors(e);
          var pick = ns[Math.floor(Math.random() * ns.length)];
          cur[e] = cur[pick]; cur[pick] = 0;
        }
        if (cur.slice(0, 8).join("") === "12345678") { return shuffle(); }
        arr = cur;
      }
      var rb = document.getElementById("gpuzRestart");
      if (rb) rb.onclick = function () {
        clearInterval(timer); moves = 0; sec = 0; started = false; won = false;
        var t = document.getElementById("gpuzTime"); if (t) t.textContent = "0";
        shuffle(); render();
      };
      shuffle(); render();
      watch("gpuzRoot", [function () { clearInterval(timer); }]);
    }
  };

  /* 注册 */
  try {
    if (window.XZ13 && window.XZ13.GAMES) {
      window.XZ13.GAMES.push(
        { icon: "🔨", name: "打地鼠", bestKey: "g565_whack", call: "X565GAMES.whack.open()" },
        { icon: "🔢", name: "2048", bestKey: "g565_2048", call: "X565GAMES.g2048.open()" },
        { icon: "⚡", name: "反应测试", bestKey: "g565_react", call: "X565GAMES.react.open()" },
        { icon: "🧩", name: "数字华容道", bestKey: "g565_puzzle", call: "X565GAMES.puzzle.open()" }
      );
    }
  } catch (e) {}
});


/* ===== p65_games4.js ===== */
/* ============================================================================
   p65 · 5.6.5 新增小游戏（第四批 5 个）
   12) 贪吃蛇（canvas + 方向键/按钮）
   13) 猜数字（1-100，提示大小，计次数）
   14) 猜谜语（20 题题库）
   15) 井字棋（人机对战，简单 AI）
   16) 打砖块（canvas 弹球）
   ============================================================================ */
register("games4-565", function () {
  var G = window.X565GAMES = window.X565GAMES || {};
  var XZ13 = window.XZ13 || null;
  function showModal(html) {
    if (XZ13 && typeof XZ13.modal === "function") XZ13.modal(html);
    else if (typeof window.modal === "function") window.modal(html);
  }
  function watch(rootId, handles) {
    var t = setInterval(function () {
      if (!document.getElementById(rootId)) {
        clearInterval(t);
        (handles || []).forEach(function (h) {
          try { if (typeof h === "number") { clearInterval(h); cancelAnimationFrame(h); } else if (typeof h === "function") h(); } catch (e) {}
        });
      }
    }, 400);
    return t;
  }
  function bestGet(key) { var v = parseInt(storageGet(key), 10); return isNaN(v) ? 0 : v; }
  function bestSet(key, v) { storageSet(key, String(v)); }
  function closeBtn(btn) {
    return '<div class="xz13-save-bar" style="justify-content:center;margin-top:8px"><button class="xz13-save-ss-btn" id="' + btn + '">重开</button><button class="xz13-save-ss-btn" onclick="closeModal()">退出</button></div>';
  }

  /* ═══════════ 12) 贪吃蛇 ═══════════ */
  G.snake = {
    open: function () {
      var g = this;
      g.best = bestGet("g565_snake");
      showModal(
        '<div id="gskRoot" style="max-width:340px;margin:0 auto;text-align:center">' +
        '<h3>🐍 贪吃蛇</h3>' +
        '<div class="xz13-game-hud"><span>得分 <b id="gskScore">0</b></span><span>最高 <b id="gskBest">' + g.best + "</b></span></div>" +
        '<canvas id="gskCv" width="300" height="300" style="background:#11202b;border-radius:12px;touch-action:none;max-width:100%"></canvas>' +
        '<div id="gskPad" style="display:grid;grid-template-columns:repeat(3,56px);gap:6px;justify-content:center;margin-top:8px">' +
          '<span></span><button class="gbtn" data-d="up">↑</button><span></span>' +
          '<button class="gbtn" data-d="left">←</button><button class="gbtn" data-d="down">↓</button><button class="gbtn" data-d="right">→</button></div>' +
        closeBtn("gskRestart") + '</div>'
      );
      var cv = document.getElementById("gskCv"), ctx = cv.getContext("2d");
      var N = 15, cell = 20, snake, dir, food, score, dead, timer = 0;
      function reset() {
        snake = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }];
        dir = { x: 1, y: 0 }; score = 0; dead = false;
        placeFood();
        var s = document.getElementById("gskScore"); if (s) s.textContent = 0;
        clearInterval(timer);
        timer = setInterval(tick, 160);
        draw();
      }
      function placeFood() {
        do { food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; }
        while (snake.some(function (p) { return p.x === food.x && p.y === food.y; }));
      }
      function tick() {
        if (dead) return;
        var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || snake.some(function (p) { return p.x === head.x && p.y === head.y; })) {
          dead = true; clearInterval(timer);
          if (score > g.best) { g.best = score; bestSet("g565_snake", score); }
          var b = document.getElementById("gskBest"); if (b) b.textContent = g.best;
          ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.fillRect(0, 0, 300, 300);
          ctx.fillStyle = "#fff"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center";
          ctx.fillText("游戏结束 " + score + " 分", 150, 150);
          return;
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) { score++; var s = document.getElementById("gskScore"); if (s) s.textContent = score; placeFood(); }
        else snake.pop();
        draw();
      }
      function draw() {
        ctx.fillStyle = "#11202b"; ctx.fillRect(0, 0, 300, 300);
        ctx.fillStyle = "#ff5a5a"; ctx.beginPath(); ctx.arc(food.x * cell + 10, food.y * cell + 10, 7, 0, 7); ctx.fill();
        snake.forEach(function (p, i) {
          ctx.fillStyle = i === 0 ? "#7fd1ae" : "#4fb3a6";
          ctx.fillRect(p.x * cell + 1, p.y * cell + 1, cell - 2, cell - 2);
        });
      }
      function setD(x, y) {
        if (dir.x === -x && dir.y === -y) return;
        dir = { x: x, y: y };
      }
      Array.prototype.forEach.call(document.querySelectorAll("#gskPad [data-d]"), function (b) {
        b.onclick = function () {
          var d = b.getAttribute("data-d");
          if (d === "up") setD(0, -1); else if (d === "down") setD(0, 1);
          else if (d === "left") setD(-1, 0); else setD(1, 0);
        };
      });
      function key(e) {
        var map = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
        if (map[e.key]) { e.preventDefault(); setD(map[e.key][0], map[e.key][1]); }
      }
      document.addEventListener("keydown", key);
      var sx = 0, sy = 0;
      cv.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      cv.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
        if (Math.abs(dx) > Math.abs(dy)) setD(dx > 0 ? 1 : -1, 0); else setD(0, dy > 0 ? 1 : -1);
      }, { passive: true });
      var rb = document.getElementById("gskRestart");
      if (rb) rb.onclick = reset;
      watch("gskRoot", [timer, function () { document.removeEventListener("keydown", key); }]);
      reset();
    }
  };

  /* ═══════════ 13) 猜数字 ═══════════ */
  G.number = {
    open: function () {
      var g = this;
      g.best = bestGet("g565_number");
      showModal(
        '<div id="gnumRoot" style="max-width:340px;margin:0 auto;text-align:center">' +
        '<h3>🔢 猜数字</h3>' +
        '<div class="dim small">最少次数纪录：<b id="gnumBest">' + (g.best || "—") + '</b></div>' +
        '<div id="gnumHint" style="font-size:18px;margin:14px 0;min-height:30px">我想了一个 1–100 的数</div>' +
        '<div style="display:flex;gap:8px;justify-content:center"><input id="gnumIn" type="number" min="1" max="100" placeholder="输入 1-100" style="width:140px;padding:10px;border-radius:10px;border:1px solid rgba(127,127,127,.3)"><button class="gbtn" id="gnumGo">猜</button></div>' +
        '<div class="dim small" id="gnumTries" style="margin-top:8px">已猜 0 次</div>' + closeBtn("gnumRestart") + '</div>'
      );
      var ans = Math.floor(Math.random() * 100) + 1, tries = 0, done = false;
      function guess() {
        if (done) return;
        var v = parseInt(document.getElementById("gnumIn").value, 10);
        if (isNaN(v) || v < 1 || v > 100) { toast("请输入 1-100"); return; }
        tries++;
        var hint = document.getElementById("gnumHint");
        var tt = document.getElementById("gnumTries");
        if (tt) tt.textContent = "已猜 " + tries + " 次";
        if (v === ans) {
          done = true;
          if (!g.best || tries < g.best) { g.best = tries; bestSet("g565_number", tries); }
          var b = document.getElementById("gnumBest"); if (b) b.textContent = g.best;
          if (hint) hint.innerHTML = "🎉 猜对了！答案就是 " + ans + "，用了 " + tries + " 次";
        } else if (hint) {
          hint.textContent = (v < ans ? "⬆️ 太小了，" : "⬇️ 太大了，") + "再猜";
        }
        document.getElementById("gnumIn").value = "";
        document.getElementById("gnumIn").focus();
      }
      document.getElementById("gnumGo").onclick = guess;
      document.getElementById("gnumIn").addEventListener("keydown", function (e) { if (e.key === "Enter") guess(); });
      var rb = document.getElementById("gnumRestart");
      if (rb) rb.onclick = function () { G.number.open(); };
    }
  };

  /* ═══════════ 14) 猜谜语 ═══════════ */
  G.riddle = {
    DATA: [
      { q: "什么东西越洗越脏？", a: "水" },
      { q: "一个黑孩，从不开口，要是开口，掉出舌头。", a: "瓜子" },
      { q: "有头无颈，有眼无眉，无脚能走，有翅难飞。", a: "鱼" },
      { q: "弟兄七八个，围着柱子坐，大家一分手，衣服都扯破。", a: "大蒜" },
      { q: "身穿绿衣裳，肚里水汪汪，生的子儿多，个个黑脸膛。", a: "西瓜" },
      { q: "红口袋，绿口袋，有人怕，有人爱。", a: "辣椒" },
      { q: "弯弯藤儿架上爬，串串珍珠上边挂。", a: "葡萄" },
      { q: "一个南瓜两头儿空，肚里开花放光明。", a: "灯笼" },
      { q: "上不怕水，下不怕火；家家厨房，都有一个。", a: "锅" },
      { q: "四四方方一块砖，砖儿软软不能搬。", a: "豆腐" },
      { q: "千条线，万条线，掉到水里看不见。", a: "雨" },
      { q: "有时候，圆又圆；有时候，弯又弯。", a: "月亮" },
      { q: "白胖娃娃泥里藏，腰身细细心眼多。", a: "莲藕" },
      { q: "看着像块糕，不能用嘴咬，洗衣和洗澡，都要用到它。", a: "肥皂" },
      { q: "一群小白鹅，嘎嘎跳下河，个个都浮起，全都上了桌。", a: "饺子" },
      { q: "小小诸葛亮，独坐中军帐，摆起八阵图，专捉飞来将。", a: "蜘蛛" },
      { q: "头戴红帽子，身穿白袍子，走路摆架子，说话伸脖子。", a: "鹅" },
      { q: "一物生来身穿三百多件衣，每天脱一件，年底剩张皮。", a: "日历" },
      { q: "麻屋子，红帐子，里面住个白胖子。", a: "花生" },
      { q: "青枝绿叶开红花，我家就在水底下。", a: "荷花" }
    ],
    open: function () {
      var g = this;
      g.best = bestGet("g565_riddle");
      var list = g.DATA.slice().sort(function () { return Math.random() - 0.5; });
      var idx = 0, score = 0;
      function card() {
        if (idx >= list.length) {
          if (score > g.best) { g.best = score; bestSet("g565_riddle", score); }
          showModal('<div id="gridRoot" style="max-width:360px;margin:0 auto;text-align:center"><h3>🧩 猜谜语</h3>' +
            '<div style="font-size:18px;margin:18px 0">答对 <b style="color:#22b07d">' + score + "</b>/" + list.length + "</div>" +
            '<button class="gbtn" id="gridAgain" style="margin:8px">再来一轮</button><button class="gbtn" onclick="closeModal()">退出</button></div>');
          var ag = document.getElementById("gridAgain");
          if (ag) ag.onclick = function () { G.riddle.open(); };
          return;
        }
        var r = list[idx];
        showModal('<div id="gridRoot" style="max-width:380px;margin:0 auto"><h3>🧩 猜谜语 ' + (idx + 1) + "/" + list.length + '</h3>' +
          '<div style="background:rgba(110,160,236,.1);border-radius:12px;padding:16px;font-size:17px;line-height:1.8;margin:10px 0">' + r.q + "</div>" +
          '<div id="gridAns" style="display:none;background:rgba(127,209,174,.15);border-radius:10px;padding:12px;margin:10px 0">谜底：<b>' + r.a + "</b></div>" +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">' +
            '<button class="gbtn" id="gridKnow">我知道了（算对）</button><button class="gbtn" id="gridShow">看谜底</button>' +
            '<button class="gbtn" id="gridNext">下一题</button></div>' + closeBtn("gridQuit") + '</div>');
        document.getElementById("gridKnow").onclick = function () {
          score++;
          var a = document.getElementById("gridAns"); if (a) a.style.display = "block";
          this.disabled = true;
        };
        document.getElementById("gridShow").onclick = function () {
          var a = document.getElementById("gridAns"); if (a) a.style.display = "block";
        };
        document.getElementById("gridNext").onclick = function () { idx++; card(); };
        document.getElementById("gridQuit").onclick = function () { closeModal(); };
      }
      card();
    }
  };

  /* ═══════════ 15) 井字棋（人机） ═══════════ */
  G.tic = {
    open: function () {
      showModal(
        '<div id="gttRoot" style="max-width:300px;margin:0 auto;text-align:center">' +
        '<h3>⭕ 井字棋（你是 ❌）</h3>' +
        '<div id="gttMsg" style="min-height:28px;font-size:17px;margin:8px">你的回合</div>' +
        '<div id="gttBoard" style="display:grid;grid-template-columns:repeat(3,80px);gap:6px;justify-content:center;margin:0 auto"></div>' +
        closeBtn("gttRestart") + '</div>'
      );
      var board = new Array(9).fill(""), over = false;
      var boardEl = document.getElementById("gttBoard");
      var lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      function win(b, p) {
        return lines.some(function (l) { return l.every(function (i) { return b[i] === p; }); });
      }
      function msg(t) { var m = document.getElementById("gttMsg"); if (m) m.textContent = t; }
      function render() {
        boardEl.innerHTML = "";
        board.forEach(function (v, i) {
          var b = document.createElement("button");
          b.textContent = v;
          b.style.cssText = "height:80px;font-size:36px;border-radius:10px;border:none;background:rgba(127,127,127,.12);cursor:pointer;color:" + (v === "X" ? "#6ea0ec" : "#ff7a59");
          b.onclick = function () { human(i); };
          boardEl.appendChild(b);
        });
      }
      function checkEnd() {
        if (win(board, "X")) { over = true; msg("🎉 你赢了！"); return true; }
        if (win(board, "O")) { over = true; msg("电脑赢了，再来一局"); return true; }
        if (board.every(Boolean)) { over = true; msg("平局"); return true; }
        return false;
      }
      function human(i) {
        if (over || board[i]) return;
        board[i] = "X"; render();
        if (checkEnd()) return;
        msg("电脑思考中…");
        setTimeout(ai, 350);
      }
      function ai() {
        /* 能赢就赢，否则堵玩家，再否则中心、角、边 */
        var move = findWin("O");
        if (move < 0) move = findWin("X");
        if (move < 0 && !board[4]) move = 4;
        if (move < 0) {
          var corners = [0, 2, 6, 8].filter(function (i) { return !board[i]; });
          if (corners.length) move = corners[Math.floor(Math.random() * corners.length)];
        }
        if (move < 0) {
          var edges = board.map(function (v, i) { return v ? -1 : i; }).filter(function (i) { return i >= 0; });
          if (edges.length) move = edges[Math.floor(Math.random() * edges.length)];
        }
        if (move >= 0) board[move] = "O";
        render();
        if (!checkEnd()) msg("你的回合");
      }
      function findWin(p) {
        for (var i = 0; i < 9; i++) {
          if (!board[i]) {
            board[i] = p;
            var w = win(board, p);
            board[i] = "";
            if (w) return i;
          }
        }
        return -1;
      }
      var rb = document.getElementById("gttRestart");
      if (rb) rb.onclick = function () { G.tic.open(); };
      render();
    }
  };

  /* ═══════════ 16) 打砖块 ═══════════ */
  G.brick = {
    open: function () {
      var g = this;
      g.best = bestGet("g565_brick");
      showModal(
        '<div id="gbkRoot" style="max-width:340px;margin:0 auto;text-align:center">' +
        '<h3>🧱 打砖块</h3>' +
        '<div class="xz13-game-hud"><span>分数 <b id="gbkScore">0</b></span><span>最高 <b id="gbkBest">' + g.best + "</b></span></div>" +
        '<canvas id="gbkCv" width="320" height="360" style="background:#101b26;border-radius:12px;touch-action:none;max-width:100%"></canvas>' +
        '<div style="display:flex;gap:8px;justify-content:center;margin-top:6px"><button class="gbtn" id="gbkLeft">←</button><button class="gbtn" id="gbkRight">→</button></div>' +
        closeBtn("gbkRestart") + '</div>'
      );
      var cv = document.getElementById("gbkCv"), ctx = cv.getContext("2d");
      var W = 320, H = 360, raf = 0, running = true;
      var paddle = { x: 120, w: 70, h: 10 }, ball = { x: 160, y: 300, dx: 3, dy: -3, r: 6 }, score = 0, keys = { l: false, r: false };
      var bricks = [];
      var colors = ["#ff7a59", "#f0a93c", "#7fd1ae", "#6ea0ec"];
      for (var r = 0; r < 4; r++) for (var c = 0; c < 8; c++) {
        bricks.push({ x: 8 + c * 39, y: 30 + r * 20, w: 34, h: 14, color: colors[r], alive: true });
      }
      function setMove(id, v) { var b = document.getElementById(id); if (b) { b.onmousedown = function () { keys.l = id === "gbkLeft" ? v : keys.l; keys.r = id === "gbkRight" ? v : keys.r; }; b.onmouseup = function () { if (id === "gbkLeft") keys.l = false; else keys.r = false; }; b.ontouchstart = function (e) { e.preventDefault(); if (id === "gbkLeft") keys.l = true; else keys.r = true; }; b.ontouchend = function (e) { e.preventDefault(); if (id === "gbkLeft") keys.l = false; else keys.r = false; }; } }
      setMove("gbkLeft", true); setMove("gbkRight", true);
      cv.addEventListener("touchmove", function (e) {
        var rect = cv.getBoundingClientRect();
        paddle.x = (e.touches[0].clientX - rect.left) * (W / rect.width) - paddle.w / 2;
      }, { passive: true });
      function key(e, v) {
        if (e.key === "ArrowLeft") keys.l = v;
        if (e.key === "ArrowRight") keys.r = v;
      }
      function kd(e) { key(e, true); } function ku(e) { key(e, false); }
      document.addEventListener("keydown", kd); document.addEventListener("keyup", ku);
      function loop() {
        if (!running) return;
        raf = requestAnimationFrame(loop);
        if (keys.l) paddle.x -= 6; if (keys.r) paddle.x += 6;
        paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x));
        ball.x += ball.dx; ball.y += ball.dy;
        if (ball.x < ball.r || ball.x > W - ball.r) ball.dx *= -1;
        if (ball.y < ball.r) ball.dy *= -1;
        if (ball.y > H - 24 && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w && ball.dy > 0) {
          ball.dy = -Math.abs(ball.dy);
          var rel = (ball.x - paddle.x) / paddle.w - 0.5;
          ball.dx = rel * 6;
        }
        if (ball.y > H + 10) {
          running = false;
          if (score > g.best) { g.best = score; bestSet("g565_brick", score); }
          var b = document.getElementById("gbkBest"); if (b) b.textContent = g.best;
          ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#fff"; ctx.font = "bold 20px sans-serif"; ctx.textAlign = "center";
          ctx.fillText("游戏结束 " + score + " 分", W / 2, H / 2);
          return;
        }
        bricks.forEach(function (br) {
          if (!br.alive) return;
          if (ball.x > br.x && ball.x < br.x + br.w && ball.y > br.y && ball.y < br.y + br.h) {
            br.alive = false; ball.dy *= -1; score += 10;
            var s = document.getElementById("gbkScore"); if (s) s.textContent = score;
          }
        });
        if (bricks.every(function (br) { return !br.alive; })) {
          running = false;
          if (score > g.best) { g.best = score; bestSet("g565_brick", score); }
          ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#7fd1ae"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center";
          ctx.fillText("通关！" + score + " 分", W / 2, H / 2);
          return;
        }
        ctx.fillStyle = "#101b26"; ctx.fillRect(0, 0, W, H);
        bricks.forEach(function (br) { if (br.alive) { ctx.fillStyle = br.color; ctx.fillRect(br.x, br.y, br.w, br.h); } });
        ctx.fillStyle = "#fff"; ctx.fillRect(paddle.x, H - 14, paddle.w, paddle.h);
        ctx.beginPath(); ctx.fillStyle = "#ffd36e"; ctx.arc(ball.x, ball.y, ball.r, 0, 7); ctx.fill();
      }
      loop();
      var rb = document.getElementById("gbkRestart");
      if (rb) rb.onclick = function () { G.brick.open(); };
      watch("gbkRoot", [function () { running = false; cancelAnimationFrame(raf); document.removeEventListener("keydown", kd); document.removeEventListener("keyup", ku); }]);
    }
  };

  /* 注册 */
  try {
    if (window.XZ13 && window.XZ13.GAMES) {
      window.XZ13.GAMES.push(
        { icon: "🐍", name: "贪吃蛇", bestKey: "g565_snake", call: "X565GAMES.snake.open()" },
        { icon: "🔢", name: "猜数字", bestKey: "g565_number", call: "X565GAMES.number.open()" },
        { icon: "🧩", name: "猜谜语", bestKey: "g565_riddle", call: "X565GAMES.riddle.open()" },
        { icon: "⭕", name: "井字棋", call: "X565GAMES.tic.open()" },
        { icon: "🧱", name: "打砖块", bestKey: "g565_brick", call: "X565GAMES.brick.open()" }
      );
    }
  } catch (e) {}
});


/* ===== p67_games5.js ===== */
/* ============================================================================
   p67 · 5.6.5 新增小游戏（第五批 5 个）
   17) 扫雷（8×8，10 雷，插旗/展开）
   18) 五子棋（人机，简单 AI）
   19) emoji 猜成语（30 题）
   20) 口算 60 秒（连对计分）
   21) 颜色反应（斯特鲁普测试）
   ============================================================================ */
register("games5-565", function () {
  var G = window.X565GAMES = window.X565GAMES || {};
  var XZ13 = window.XZ13 || null;
  function showModal(html) {
    if (XZ13 && typeof XZ13.modal === "function") XZ13.modal(html);
    else if (typeof window.modal === "function") window.modal(html);
  }
  function watch(rootId, handles) {
    var t = setInterval(function () {
      if (!document.getElementById(rootId)) {
        clearInterval(t);
        (handles || []).forEach(function (h) {
          try { if (typeof h === "number") { clearInterval(h); cancelAnimationFrame(h); } else if (typeof h === "function") h(); } catch (e) {}
        });
      }
    }, 400);
    return t;
  }
  function bestGet(key) { var v = parseInt(storageGet(key), 10); return isNaN(v) ? 0 : v; }
  function bestSet(key, v) { storageSet(key, String(v)); }
  function bar(btn) {
    return '<div class="xz13-save-bar" style="justify-content:center;margin-top:8px"><button class="xz13-save-ss-btn" id="' + btn + '">重开</button><button class="xz13-save-ss-btn" onclick="closeModal()">退出</button></div>';
  }

  /* ═══════════ 17) 扫雷 ═══════════ */
  G.mine = {
    SIZE: 8, MINES: 10,
    open: function () {
      var g = this;
      showModal(
        '<div id="gmiRoot" style="max-width:380px;margin:0 auto;text-align:center">' +
        '<h3>💣 扫雷</h3>' +
        '<div class="dim small">剩余雷数 <b id="gmiLeft">10</b>　<span id="gmiState">点格展开，长按/右键插旗</span></div>' +
        '<div id="gmiBoard" style="display:grid;grid-template-columns:repeat(8,1fr);gap:2px;max-width:340px;margin:8px auto;touch-action:manipulation"></div>' +
        bar("gmiRestart") + '</div>'
      );
      var SIZE = g.SIZE, N = SIZE * SIZE, board, opened, flagged, over, firstClick, flags;
      var boardEl = document.getElementById("gmiBoard");
      function reset() {
        board = new Array(N).fill(0);
        opened = new Array(N).fill(false);
        flagged = new Array(N).fill(false);
        over = false; firstClick = true; flags = 0;
        document.getElementById("gmiLeft").textContent = g.MINES;
        document.getElementById("gmiState").textContent = "点格展开，长按/右键插旗";
        render();
      }
      function placeMines(safe) {
        var mines = 0;
        while (mines < g.MINES) {
          var i = Math.floor(Math.random() * N);
          if (board[i] === -1 || i === safe) continue;
          board[i] = -1; mines++;
        }
        for (var k = 0; k < N; k++) {
          if (board[k] === -1) continue;
          board[k] = neighbors(k).filter(function (x) { return board[x] === -1; }).length;
        }
      }
      function neighbors(i) {
        var r = Math.floor(i / SIZE), c = i % SIZE, out = [];
        for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          var nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) out.push(nr * SIZE + nc);
        }
        return out;
      }
      function render() {
        boardEl.innerHTML = "";
        for (var i = 0; i < N; i++) {
          (function (i) {
            var b = document.createElement("button");
            b.style.cssText = "height:38px;font-size:15px;border-radius:4px;border:1px solid rgba(127,127,127,.25);cursor:pointer";
            if (opened[i]) {
              b.style.background = board[i] === -1 ? "#e8513f" : "rgba(127,127,127,.18)";
              b.textContent = board[i] === -1 ? "💣" : (board[i] ? board[i] : "");
              var colors = ["", "#6ea0ec", "#22b07d", "#f0a93c", "#b08ae0", "#ff7a59", "#0aa", "#d33", "#555"];
              if (board[i] > 0) b.style.color = colors[board[i]];
            } else {
              b.style.background = "linear-gradient(135deg,#cfe0f5,#a9c4ea)";
              b.textContent = flagged[i] ? "🚩" : "";
            }
            var timer = 0;
            b.oncontextmenu = function (e) { e.preventDefault(); toggleFlag(i); };
            b.onmousedown = function () { timer = setTimeout(function () { toggleFlag(i); }, 450); };
            b.onmouseup = function () { clearTimeout(timer); };
            b.onmouseleave = function () { clearTimeout(timer); };
            b.onclick = function () { clearTimeout(timer); openCell(i); };
            b.ontouchstart = function () { timer = setTimeout(function () { toggleFlag(i); }, 450); };
            b.ontouchend = function (e) { if (timer) { clearTimeout(timer); } };
            boardEl.appendChild(b);
          })(i);
        }
      }
      function toggleFlag(i) {
        if (over || opened[i]) return;
        flagged[i] = !flagged[i];
        flags += flagged[i] ? 1 : -1;
        document.getElementById("gmiLeft").textContent = g.MINES - flags;
        render();
      }
      function openCell(i) {
        if (over || flagged[i] || opened[i]) return;
        if (firstClick) { firstClick = false; placeMines(i); }
        if (board[i] === -1) {
          over = true;
          for (var k = 0; k < N; k++) if (board[k] === -1) opened[k] = true;
          document.getElementById("gmiState").textContent = "踩雷了！";
          render();
          toast("踩到雷了，点重开再来");
          return;
        }
        flood(i);
        render();
        if (checkWin()) {
          over = true;
          document.getElementById("gmiState").textContent = "🎉 全部排除！";
          toast("扫雷成功！");
        }
      }
      function flood(i) {
        if (opened[i]) return;
        opened[i] = true;
        if (board[i] === 0) neighbors(i).forEach(function (x) { if (board[x] !== -1) flood(x); });
      }
      function checkWin() {
        for (var i = 0; i < N; i++) if (board[i] !== -1 && !opened[i]) return false;
        return true;
      }
      document.getElementById("gmiRestart").onclick = reset;
      reset();
    }
  };

  /* ═══════════ 18) 五子棋 ═══════════ */
  G.gomoku = {
    open: function () {
      showModal(
        '<div id="ggmRoot" style="max-width:340px;margin:0 auto;text-align:center">' +
        '<h3>⚫ 五子棋（你执黑）</h3>' +
        '<div id="ggmMsg" style="min-height:26px;margin-bottom:4px">你的回合</div>' +
        '<canvas id="ggmCv" width="330" height="330" style="background:#e8c98f;border-radius:8px;touch-action:none;max-width:100%"></canvas>' +
        bar("ggmRestart") + '</div>'
      );
      var cv = document.getElementById("ggmCv"), ctx = cv.getContext("2d");
      var N = 13, cell = 24, off = 21, grid = [], over = false, busy = false;
      function reset() {
        grid = [];
        for (var r = 0; r < N; r++) grid.push(new Array(N).fill(0));
        over = false; busy = false;
        msg("你的回合");
        draw();
      }
      function msg(t) { var m = document.getElementById("ggmMsg"); if (m) m.textContent = t; }
      function draw() {
        ctx.fillStyle = "#e8c98f"; ctx.fillRect(0, 0, 330, 330);
        ctx.strokeStyle = "#a9864f";
        for (var i = 0; i < N; i++) {
          ctx.beginPath(); ctx.moveTo(off, off + i * cell); ctx.lineTo(off + (N - 1) * cell, off + i * cell); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(off + i * cell, off); ctx.lineTo(off + i * cell, off + (N - 1) * cell); ctx.stroke();
        }
        for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
          if (grid[r][c]) {
            ctx.fillStyle = grid[r][c] === 1 ? "#222" : "#fff";
            ctx.beginPath(); ctx.arc(off + c * cell, off + r * cell, 9, 0, 7); ctx.fill();
            ctx.strokeStyle = "#777"; ctx.stroke();
          }
        }
      }
      function win(r, c, p) {
        var dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
        for (var d = 0; d < 4; d++) {
          var cnt = 1;
          for (var s = 1; s < 5; s++) {
            var nr = r + dirs[d][0] * s, nc = c + dirs[d][1] * s;
            if (nr < 0 || nc < 0 || nr >= N || nc >= N || grid[nr][nc] !== p) break;
            cnt++;
          }
          for (var s2 = 1; s2 < 5; s2++) {
            var nr2 = r - dirs[d][0] * s2, nc2 = c - dirs[d][1] * s2;
            if (nr2 < 0 || nc2 < 0 || nr2 >= N || nc2 >= N || grid[nr2][nc2] !== p) break;
            cnt++;
          }
          if (cnt >= 5) return true;
        }
        return false;
      }
      function aiMove() {
        /* 简单评分：优先阻挡/连子，找最高分分位置 */
        var best = null, bestScore = -1;
        for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
          if (grid[r][c]) continue;
          var near = false;
          for (var dr = -1; dr <= 1 && !near; dr++) for (var dc = -1; dc <= 1; dc++) {
            var nr = r + dr, nc = c + dc;
            if (nr >= 0 && nc >= 0 && nr < N && nc < N && grid[nr][nc]) near = true;
          }
          if (!near) continue;
          grid[r][c] = 2; var sc = scoreAt(r, c, 2);
          grid[r][c] = 1; var scD = scoreAt(r, c, 1);
          grid[r][c] = 0;
          var total = sc * 1.1 + scD + Math.random();
          if (total > bestScore) { bestScore = total; best = [r, c]; }
        }
        if (!best) best = [Math.floor(N / 2), Math.floor(N / 2)];
        grid[best[0]][best[1]] = 2;
        draw();
        if (win(best[0], best[1], 2)) { over = true; msg("电脑赢了，再来一局"); return; }
        busy = false; msg("你的回合");
      }
      function scoreAt(r, c, p) {
        var dirs = [[0, 1], [1, 0], [1, 1], [1, -1]], total = 0;
        for (var d = 0; d < 4; d++) {
          var cnt = 1;
          for (var s = 1; s < 5; s++) {
            var nr = r + dirs[d][0] * s, nc = c + dirs[d][1] * s;
            if (nr < 0 || nc < 0 || nr >= N || nc >= N || grid[nr][nc] !== p) break;
            cnt++;
          }
          total += cnt * cnt;
        }
        return total;
      }
      function place(e) {
        if (over || busy) return;
        var rect = cv.getBoundingClientRect();
        var pe = e.changedTouches ? e.changedTouches[0] : e;
        var x = (pe.clientX - rect.left) * (330 / rect.width);
        var y = (pe.clientY - rect.top) * (330 / rect.height);
        var c = Math.round((x - off) / cell), r = Math.round((y - off) / cell);
        if (r < 0 || c < 0 || r >= N || c >= N || grid[r][c]) return;
        grid[r][c] = 1; draw();
        if (win(r, c, 1)) { over = true; msg("🎉 你赢了！"); return; }
        busy = true; msg("电脑思考中…");
        setTimeout(aiMove, 350);
      }
      cv.addEventListener("click", place);
      cv.addEventListener("touchend", function (e) { e.preventDefault(); place(e); }, { passive: false });
      document.getElementById("ggmRestart").onclick = reset;
      reset();
    }
  };

  /* ═══════════ 19) emoji 猜成语 ═══════════ */
  G.idiom2 = {
    DATA: [
      ["🐔🐕🙈🙉", "鸡犬不宁"], ["🐑🚪🐯", "羊入虎口"], ["🔥🌸🌸🌸", "火树银花"], ["🐎🏃⚡", "快马加鞭"],
      ["🐂🎹", "对牛弹琴"], ["🐍🦶", "画蛇添足"], ["🐰🦊😭", "兔死狐悲"], ["🐉🐯", "龙潭虎穴"],
      ["🐦🙊", "一石二鸟"], ["🌊🏔️", "山高水长"], ["🌧️☔", "风雨同舟"], ["☀️🌙", "日积月累"],
      ["👀👂", "耳闻目睹"], ["❤️💊", "苦口婆心"], ["🧊❄️", "冰天雪地"], ["🍚🍚", "津津有味"],
      ["🌙🌸", "花好月圆"], ["🐦🏹", "惊弓之鸟"], ["🐔🥚", "鸡飞蛋打"], ["🌳🐒", "树倒猢狲散"],
      ["✋🖐️", "拍手称快"], ["👁️🔍", "一目了然"], ["💪🔥", "热火朝天"], ["🐟🐲", "鱼跃龙门"],
      ["🦊🐯", "狐假虎威"], ["🐺🐯", "狼吞虎咽"], ["🐑🐑", "顺手牵羊"], ["🐎👀🌸", "走马观花"],
      ["🎨🐉", "画龙点睛"], ["📏🌊", "望洋兴叹"]
    ],
    open: function () {
      var g = this;
      var list = g.DATA.slice().sort(function () { return Math.random() - 0.5; });
      var idx = 0, score = 0, wrong = 0;
      function card() {
        if (idx >= list.length) {
          showModal('<div id="gidRoot" style="max-width:380px;margin:0 auto;text-align:center"><h3>🧠 emoji 猜成语</h3>' +
            '<div style="font-size:18px;margin:16px 0">对 <b style="color:#22b07d">' + score + "</b>　错 <b style=\"color:#e8513f\">" + wrong + "</b> / " + list.length + "</div>" +
            '<button class="gbtn" id="gidAgain">再来一轮</button> <button class="gbtn" onclick="closeModal()">退出</button></div>');
          document.getElementById("gidAgain").onclick = function () { G.idiom2.open(); };
          return;
        }
        var it = list[idx];
        showModal('<div id="gidRoot" style="max-width:380px;margin:0 auto;text-align:center"><h3>🧠 emoji 猜成语 ' + (idx + 1) + "/" + list.length + "</h3>" +
          '<div style="font-size:52px;margin:20px 0;letter-spacing:6px">' + it[0] + "</div>" +
          '<input id="gidIn" placeholder="输入成语" style="width:80%;padding:10px;border-radius:10px;border:1px solid rgba(127,127,127,.3)">' +
          '<div id="gidRes" style="min-height:26px;margin:8px"></div>' +
          '<div style="display:flex;gap:8px;justify-content:center"><button class="gbtn" id="gidOk">确定</button><button class="gbtn" id="gidSkip">看下一个</button></div>' +
          bar("gidQuit") + "</div>");
        var inp = document.getElementById("gidIn");
        function check() {
          var v = inp.value.replace(/\s/g, "");
          var res = document.getElementById("gidRes");
          if (v === it[1]) { score++; if (res) res.innerHTML = '<b style="color:#22b07d">✓ 答对了：' + it[1] + "</b>"; setTimeout(next, 600); }
          else { wrong++; if (res) res.innerHTML = '<span style="color:#e8513f">✗ 正确答案：' + it[1] + "</span>"; setTimeout(next, 1000); }
        }
        function next() { idx++; card(); }
        document.getElementById("gidOk").onclick = check;
        document.getElementById("gidSkip").onclick = function () { wrong++; next(); };
        inp.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
        document.getElementById("gidQuit").onclick = function () { closeModal(); };
      }
      card();
    }
  };

  /* ═══════════ 20) 口算 60 秒 ═══════════ */
  G.math2 = {
    open: function () {
      var g = this;
      g.best = bestGet("g565_math2");
      showModal(
        '<div id="gmaRoot" style="max-width:360px;margin:0 auto;text-align:center">' +
        '<h3>🧮 口算 60 秒</h3>' +
        '<div class="xz13-game-hud"><span>时间 <b id="gmaTime">60</b></span><span>对 <b id="gmaOk">0</b></span><span>连对 <b id="gmaStreak">0</b></span><span>最高 <b id="gmaBest">' + g.best + "</b></span></div>" +
        '<div id="gmaQ" style="font-size:34px;font-weight:800;margin:18px 0"></div>' +
        '<input id="gmaIn" type="number" placeholder="答案" style="width:180px;padding:10px;font-size:20px;text-align:center;border-radius:10px;border:1px solid rgba(127,127,127,.3)">' +
        '<div id="gmaTip" style="min-height:24px;margin:8px"></div>' +
        bar("gmaRestart") + "</div>"
      );
      var time = 60, ok = 0, streak = 0, ans = 0, timer = 0, running = true;
      function newQ() {
        var a = Math.floor(Math.random() * 89) + 11, b = Math.floor(Math.random() * 89) + 11;
        var op = ["+", "-", "×"][Math.floor(Math.random() * 3)];
        if (op === "+") ans = a + b;
        else if (op === "-") { if (a < b) { var t = a; a = b; b = t; } ans = a - b; }
        else { a = Math.floor(Math.random() * 12) + 2; b = Math.floor(Math.random() * 12) + 2; ans = a * b; }
        var q = document.getElementById("gmaQ"); if (q) q.textContent = a + " " + op + " " + b + " = ?";
        var inp = document.getElementById("gmaIn"); if (inp) { inp.value = ""; inp.focus(); }
      }
      var inp = document.getElementById("gmaIn");
      inp.addEventListener("input", function () {
        if (!running) return;
        if (parseInt(inp.value, 10) === ans) {
          ok++; streak++;
          if (streak > 0) { var s = document.getElementById("gmaStreak"); if (s) s.textContent = streak; }
          var o = document.getElementById("gmaOk"); if (o) o.textContent = ok;
          var tip = document.getElementById("gmaTip"); if (tip) tip.innerHTML = '<span style="color:#22b07d">✓</span>';
          newQ();
        }
      });
      timer = setInterval(function () {
        time--;
        var t = document.getElementById("gmaTime"); if (t) t.textContent = Math.max(0, time);
        if (time <= 0) {
          running = false; clearInterval(timer);
          if (ok > g.best) { g.best = ok; bestSet("g565_math2", ok); }
          var b = document.getElementById("gmaBest"); if (b) b.textContent = g.best;
          var q = document.getElementById("gmaQ"); if (q) q.textContent = "时间到！";
          var tip = document.getElementById("gmaTip"); if (tip) tip.innerHTML = "共答对 <b>" + ok + "</b> 题";
        }
      }, 1000);
      document.getElementById("gmaRestart").onclick = function () { clearInterval(timer); G.math2.open(); };
      watch("gmaRoot", [timer]);
      newQ();
    }
  };

  /* ═══════════ 21) 颜色反应（斯特鲁普） ═══════════ */
  G.stroop = {
    open: function () {
      var g = this;
      g.best = bestGet("g565_stroop");
      showModal(
        '<div id="gstRoot" style="max-width:360px;margin:0 auto;text-align:center">' +
        '<h3>🎨 颜色反应</h3>' +
        '<div class="dim small">点出“文字的颜色”，别被字义带偏　最高 <b id="gstBest">' + (g.best || "—") + "</b></div>" +
        '<div id="gstWord" style="font-size:48px;font-weight:800;margin:20px 0;min-height:60px"></div>' +
        '<div id="gstBtns" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"></div>' +
        '<div class="dim small" style="margin-top:10px">本轮 <b id="gstScore">0</b> 分　剩余 <b id="gstTime">30</b>s</div>' +
        bar("gstRestart") + "</div>"
      );
      var colors = [
        { name: "红", hex: "#e8513f" }, { name: "蓝", hex: "#6ea0ec" },
        { name: "绿", hex: "#22b07d" }, { name: "黄", hex: "#f0a93c" }, { name: "紫", hex: "#b08ae0" }
      ];
      var time = 30, score = 0, target, timer = 0;
      var btns = document.getElementById("gstBtns");
      colors.forEach(function (c) {
        var b = document.createElement("button");
        b.className = "gbtn"; b.textContent = c.name;
        b.style.cssText += ";min-width:60px";
        b.onclick = function () {
          if (c.name === target.name) {
            score++;
            var s = document.getElementById("gstScore"); if (s) s.textContent = score;
          }
          newRound();
        };
        btns.appendChild(b);
      });
      function newRound() {
        var wordColor = colors[Math.floor(Math.random() * colors.length)];
        var wordName = colors[Math.floor(Math.random() * colors.length)];
        target = wordColor;
        var w = document.getElementById("gstWord");
        if (w) { w.textContent = wordName.name; w.style.color = wordColor.hex; }
      }
      timer = setInterval(function () {
        time--;
        var t = document.getElementById("gstTime"); if (t) t.textContent = Math.max(0, time);
        if (time <= 0) {
          clearInterval(timer);
          if (!g.best || score > g.best) { g.best = score; bestSet("g565_stroop", score); }
          var b = document.getElementById("gstBest"); if (b) b.textContent = g.best;
          var w = document.getElementById("gstWord"); if (w) w.textContent = "结束 " + score + " 分";
        }
      }, 1000);
      document.getElementById("gstRestart").onclick = function () { clearInterval(timer); G.stroop.open(); };
      watch("gstRoot", [timer]);
      newRound();
    }
  };

  /* 注册 */
  try {
    if (window.XZ13 && window.XZ13.GAMES) {
      window.XZ13.GAMES.push(
        { icon: "💣", name: "扫雷", call: "X565GAMES.mine.open()" },
        { icon: "⚫", name: "五子棋", call: "X565GAMES.gomoku.open()" },
        { icon: "🧠", name: "emoji猜成语", call: "X565GAMES.idiom2.open()" },
        { icon: "🧮", name: "口算60秒", bestKey: "g565_math2", call: "X565GAMES.math2.open()" },
        { icon: "🎨", name: "颜色反应", bestKey: "g565_stroop", call: "X565GAMES.stroop.open()" }
      );
    }
  } catch (e) {}
});


/* ===== p62_tools.js ===== */
/* ============================================================================
   p62 · 5.6.5 新增实用工具（5 个，自包含，本地保存，关闭弹窗即清理）
   1) 番茄钟（25/5 专注循环）
   2) 决策转盘（输入选项，随机抽取，带旋转动画）
   3) 分组值日（粘贴名单，自动分组/排班）
   4) 零花钱记账（收支记录、余额、分类）
   5) 古诗文背诵卡（翻面记忆，标记已背）
   全部注册进 5.5.13「4.0 工具箱」
   ============================================================================ */
register("tools-565", function () {
  var T = window.X565TOOLS = window.X565TOOLS || {};
  var XZ13 = window.XZ13 || null;
  function showModal(html) {
    if (XZ13 && typeof XZ13.modal === "function") XZ13.modal(html);
    else if (typeof window.modal === "function") window.modal(html);
  }
  function watch(rootId, handles) {
    var t = setInterval(function () {
      if (!document.getElementById(rootId)) {
        clearInterval(t);
        (handles || []).forEach(function (h) {
          try { if (typeof h === "number") clearInterval(h); else if (typeof h === "function") h(); } catch (e) {}
        });
      }
    }, 400);
    return t;
  }
  function btnBar(id, label) {
    return '<div class="xz13-save-bar" style="justify-content:center;margin-top:8px">' +
      '<button class="xz13-save-ss-btn" onclick="closeModal()">关闭</button></div>';
  }

  /* ─────────── 1) 番茄钟 ─────────── */
  T.pomodoro = {
    open: function () {
      showModal(
        '<div id="tPomoRoot" style="max-width:380px;margin:0 auto;text-align:center">' +
        '<h3>🍅 番茄钟</h3>' +
        '<div id="tPomoPhase" class="dim small">准备开始</div>' +
        '<div style="font-size:64px;font-weight:800;letter-spacing:2px;margin:10px 0" id="tPomoTime">25:00</div>' +
        '<div style="display:flex;gap:8px;justify-content:center">' +
          '<button class="gbtn" id="tPomoStart">开始</button>' +
          '<button class="gbtn" id="tPomoReset">重置</button>' +
        '</div>' +
        '<div class="dim small" style="margin-top:8px">专注 25 分钟 · 休息 5 分钟 · 完成 4 个番茄长休息</div>' +
        '<div>已完成番茄：<b id="tPomoCount">0</b> 个</div>' + btnBar() + '</div>'
      );
      var remain = 25 * 60, focus = 25 * 60, rest = 5 * 60, isFocus = true, running = false, timer = 0, done = 0;
      function render() {
        var el = document.getElementById("tPomoTime");
        if (el) el.textContent = Math.floor(remain / 60) + ":" + ("0" + (remain % 60)).slice(-2);
        var ph = document.getElementById("tPomoPhase");
        if (ph) ph.textContent = isFocus ? "🍅 专注中" : "☕ 休息一下";
        var c = document.getElementById("tPomoCount"); if (c) c.textContent = done;
      }
      function tick() {
        if (!running) return;
        remain--;
        if (remain <= 0) {
          if (isFocus) {
            done++;
            try { toast("🍅 完成一个番茄，休息 5 分钟！"); } catch (e) {}
            isFocus = false;
            remain = (done % 4 === 0) ? 15 * 60 : rest;
          } else {
            try { toast("☕ 休息结束，开始下一个番茄"); } catch (e) {}
            isFocus = true; remain = focus;
          }
        }
        render();
      }
      var s = document.getElementById("tPomoStart");
      if (s) s.onclick = function () {
        running = !running;
        s.textContent = running ? "暂停" : "继续";
        if (running && !timer) timer = setInterval(tick, 1000);
      };
      var r = document.getElementById("tPomoReset");
      if (r) r.onclick = function () {
        running = false; clearInterval(timer); timer = 0;
        isFocus = true; remain = focus;
        if (s) s.textContent = "开始";
        render();
      };
      render();
      watch("tPomoRoot", [timer, function () { clearInterval(timer); }]);
    }
  };

  /* ─────────── 2) 决策转盘 ─────────── */
  T.wheel = {
    open: function () {
      showModal(
        '<div id="tWheelRoot" style="max-width:420px;margin:0 auto">' +
        '<h3>🎡 决策转盘</h3>' +
        '<textarea id="tWheelIn" rows="3" class="gmem-ta" placeholder="每行一个选项，例如：&#10;学习&#10;打球&#10;睡觉" style="width:100%;box-sizing:border-box;border-radius:10px;border:1px solid rgba(127,127,127,.3);padding:8px;font-size:15px"></textarea>' +
        '<div style="text-align:center;margin:10px 0">' +
          '<canvas id="tWheelCv" width="280" height="280" style="width:280px;max-width:80vw;height:auto"></canvas>' +
        '</div>' +
        '<div style="display:flex;gap:8px;justify-content:center">' +
          '<button class="gbtn" id="tWheelGen">生成转盘</button>' +
          '<button class="gbtn big" id="tWheelSpin">🎯 转！</button>' +
        '</div>' +
        '<div style="text-align:center;margin-top:10px;font-size:22px;font-weight:800" id="tWheelResult">—</div>' + btnBar() + '</div>'
      );
      var cv = document.getElementById("tWheelCv");
      var ctx = cv.getContext("2d");
      var opts = ["选项A", "选项B", "选项C", "选项D"];
      var colors = ["#ff9d5c", "#ff7a8a", "#7fd1ae", "#6ea0ec", "#f6cf6e", "#b99af8", "#4fd1c5", "#f68b8b"];
      var angle = 0, spinning = false;
      function draw(a) {
        var n = opts.length, step = Math.PI * 2 / n;
        ctx.clearRect(0, 0, 280, 280);
        for (var i = 0; i < n; i++) {
          ctx.beginPath();
          ctx.moveTo(140, 140);
          ctx.arc(140, 140, 130, a + i * step, a + (i + 1) * step);
          ctx.closePath();
          ctx.fillStyle = colors[i % colors.length];
          ctx.fill();
          ctx.save();
          ctx.translate(140, 140);
          ctx.rotate(a + i * step + step / 2);
          ctx.fillStyle = "#fff";
          ctx.font = "14px sans-serif";
          ctx.textAlign = "right";
          ctx.fillText(opts[i].slice(0, 6), 118, 5);
          ctx.restore();
        }
        ctx.beginPath();
        ctx.moveTo(140, 2); ctx.lineTo(128, 24); ctx.lineTo(152, 24);
        ctx.closePath(); ctx.fillStyle = "#333"; ctx.fill();
        ctx.beginPath();
        ctx.arc(140, 140, 14, 0, Math.PI * 2);
        ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = "#999"; ctx.stroke();
      }
      function gen() {
        var raw = document.getElementById("tWheelIn").value;
        var arr = raw.split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean);
        if (arr.length >= 2) opts = arr;
        draw(angle);
      }
      var genB = document.getElementById("tWheelGen");
      if (genB) genB.onclick = gen;
      var spinB = document.getElementById("tWheelSpin");
      if (spinB) spinB.onclick = function () {
        if (spinning) return;
        gen();
        spinning = true;
        var target = angle + Math.PI * 2 * (5 + Math.random() * 3);
        var start = angle, frames = 70, i = 0;
        var res = document.getElementById("tWheelResult");
        if (res) res.textContent = "转动中…";
        var raf = 0;
        function frame() {
          i++;
          var p = i / frames;
          var ease = 1 - Math.pow(1 - p, 3);
          angle = start + (target - start) * ease;
          draw(angle);
          if (i < frames) raf = requestAnimationFrame(frame);
          else {
            spinning = false;
            /* 指针在顶部，计算落在哪个扇形 */
            var norm = (((-angle) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            var step = Math.PI * 2 / opts.length;
            var idx = Math.floor(norm / step) % opts.length;
            if (res) res.textContent = "🎯 " + opts[idx];
            try { toast("结果：" + opts[idx]); } catch (e) {}
          }
        }
        raf = requestAnimationFrame(frame);
        watch("tWheelRoot", [function () { cancelAnimationFrame(raf); }]);
      };
      draw(angle);
    }
  };

  /* ─────────── 3) 分组值日 ─────────── */
  T.groups = {
    open: function () {
      showModal(
        '<div id="tGrpRoot" style="max-width:440px;margin:0 auto">' +
        '<h3>👥 分组 / 值日排班</h3>' +
        '<textarea id="tGrpIn" rows="4" placeholder="粘贴名单，用换行/逗号/空格分隔&#10;张三 李四 王五 赵六" style="width:100%;box-sizing:border-box;border-radius:10px;border:1px solid rgba(127,127,127,.3);padding:8px;font-size:15px"></textarea>' +
        '<div style="display:flex;gap:8px;align-items:center;margin:8px 0">每组' +
          '<input id="tGrpN" type="number" value="4" min="2" max="20" style="width:60px;padding:6px;border-radius:8px;border:1px solid rgba(127,127,127,.3)">人' +
          '<button class="gbtn" id="tGrpGo">随机分组</button>' +
          '<button class="gbtn" id="tGrpDuty">值日顺序</button>' +
        '</div>' +
        '<div id="tGrpOut" class="dim small">结果将显示在这里</div>' + btnBar() + '</div>'
      );
      function names() {
        var raw = document.getElementById("tGrpIn").value;
        return raw.split(/[\s,，、\n]+/).map(function (s) { return s.trim(); }).filter(Boolean);
      }
      function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
      function esc(s) { return String(s).replace(/[<>&]/g, function (c) { return c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;"; }); }
      var go = document.getElementById("tGrpGo");
      if (go) go.onclick = function () {
        var arr = shuffle(names());
        var n = Math.max(2, parseInt(document.getElementById("tGrpN").value, 10) || 4);
        var out = document.getElementById("tGrpOut");
        if (arr.length < 2) { out.innerHTML = '<span style="color:#e8513f">请至少输入 2 个名字</span>'; return; }
        var groups = [], k = 0;
        for (var i = 0; i < arr.length; i++) { var gi = i % n; if (!groups[gi]) groups[gi] = []; groups[gi].push(arr[i]); }
        out.innerHTML = groups.map(function (g, gi) {
          return '<div style="background:rgba(127,209,174,.14);border-radius:10px;padding:8px;margin:6px 0">第 <b>' + (gi + 1) + '</b> 组（' + g.length + '人）：' + g.map(esc).join("、") + "</div>";
        }).join("");
      };
      var duty = document.getElementById("tGrpDuty");
      if (duty) duty.onclick = function () {
        var arr = shuffle(names());
        var out = document.getElementById("tGrpOut");
        if (arr.length < 2) { out.innerHTML = '<span style="color:#e8513f">请至少输入 2 个名字</span>'; return; }
        var days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        out.innerHTML = arr.map(function (nm, i) {
          return '<div style="display:flex;justify-content:space-between;padding:6px 8px;margin:3px 0;border-radius:8px;background:rgba(110,160,236,.12)"><span>' + days[i % 7] + "（第" + (Math.floor(i / 7) + 1) + '周）</span><b>' + esc(nm) + "</b></div>";
        }).join("");
      };
    }
  };

  /* ─────────── 4) 零花钱记账 ─────────── */
  T.ledger = {
    KEY: "x565_ledger_v1",
    load: function () { try { return JSON.parse(storageGet(this.KEY)) || { rows: [] }; } catch (e) { return { rows: [] }; } },
    save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },
    open: function () {
      var self = this;
      showModal(
        '<div id="tLedRoot" style="max-width:440px;margin:0 auto">' +
        '<h3>💰 零花钱记账</h3>' +
        '<div style="display:flex;justify-content:space-around;text-align:center;margin:8px 0">' +
          '<div>收入<div style="font-size:20px;color:#22b07d" id="tLedIn">0</div></div>' +
          '<div>支出<div style="font-size:20px;color:#e8513f" id="tLedOut">0</div></div>' +
          '<div>结余<div style="font-size:20px;font-weight:800" id="tLedBal">0</div></div>' +
        '</div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:6px 0">' +
          '<select id="tLedType" style="padding:8px;border-radius:8px;border:1px solid rgba(127,127,127,.3)"><option value="out">支出</option><option value="in">收入</option></select>' +
          '<input id="tLedAmt" type="number" placeholder="金额" style="width:80px;padding:8px;border-radius:8px;border:1px solid rgba(127,127,127,.3)">' +
          '<select id="tLedCat" style="padding:8px;border-radius:8px;border:1px solid rgba(127,127,127,.3)">' +
            "<option>🍜 餐饮</option><option>📚 文具</option><option>🎮 娱乐</option><option>🚌 交通</option><option>🧋 零食</option><option>🧧 零花钱</option><option>🎁 其他</option>" +
          '</select>' +
          '<button class="gbtn" id="tLedAdd">记一笔</button>' +
        '</div>' +
        '<div id="tLedList" style="max-height:260px;overflow:auto"></div>' +
        '<button class="gbtn" id="tLedClear" style="width:100%;margin-top:6px">清空记录</button>' + btnBar() + '</div>'
      );
      function render() {
        var d = self.load();
        var inc = 0, exp = 0;
        d.rows.forEach(function (r) { if (r.t === "in") inc += r.a; else exp += r.a; });
        var bi = document.getElementById("tLedIn"); if (bi) bi.textContent = inc.toFixed(1);
        var bo = document.getElementById("tLedOut"); if (bo) bo.textContent = exp.toFixed(1);
        var bb = document.getElementById("tLedBal"); if (bb) bb.textContent = (inc - exp).toFixed(1);
        var list = document.getElementById("tLedList");
        if (!list) return;
        if (!d.rows.length) { list.innerHTML = '<div class="dim small" style="text-align:center;padding:14px">还没有记录，记一笔吧</div>'; return; }
        list.innerHTML = d.rows.slice().reverse().map(function (r, i) {
          var real = d.rows.length - 1 - i;
          return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;margin:3px 0;border-radius:8px;background:rgba(127,127,127,.08)">' +
            "<span>" + r.c + "</span><span><b style=\"color:" + (r.t === "in" ? "#22b07d" : "#e8513f") + "\">" + (r.t === "in" ? "+" : "-") + r.a +
            "</b> <button data-del='" + real + "' style='margin-left:6px;border:none;background:none;color:#e8513f;font-size:14px'>删</button></span></div>";
        }).join("");
        Array.prototype.forEach.call(list.querySelectorAll("[data-del]"), function (b) {
          b.onclick = function () {
            var idx = parseInt(b.getAttribute("data-del"), 10);
            var dd = self.load();
            dd.rows.splice(idx, 1);
            self.save(dd); render();
          };
        });
      }
      var add = document.getElementById("tLedAdd");
      if (add) add.onclick = function () {
        var amt = parseFloat(document.getElementById("tLedAmt").value);
        if (!amt || amt <= 0) { try { toast("请输入金额"); } catch (e) {} return; }
        var d = self.load();
        d.rows.push({
          t: document.getElementById("tLedType").value,
          a: Math.round(amt * 10) / 10,
          c: document.getElementById("tLedCat").value
        });
        self.save(d);
        document.getElementById("tLedAmt").value = "";
        render();
      };
      var clr = document.getElementById("tLedClear");
      if (clr) clr.onclick = function () { self.save({ rows: [] }); render(); };
      render();
    }
  };

  /* ─────────── 5) 古诗文背诵卡 ─────────── */
  T.recite = {
    KEY: "x565_recite_v1",
    deck: [
      { t: "《观沧海》曹操", a: "东临碣石，以观沧海。水何澹澹，山岛竦峙。树木丛生，百草丰茂。秋风萧瑟，洪波涌起。" },
      { t: "《闻王昌龄左迁龙标遥有此寄》李白", a: "杨花落尽子规啼，闻道龙标过五溪。我寄愁心与明月，随君直到夜郎西。" },
      { t: "《次北固山下》王湾", a: "客路青山外，行舟绿水前。潮平两岸阔，风正一帆悬。海日生残夜，江春入旧年。乡书何处达？归雁洛阳边。" },
      { t: "《天净沙·秋思》马致远", a: "枯藤老树昏鸦，小桥流水人家，古道西风瘦马。夕阳西下，断肠人在天涯。" },
      { t: "《夜雨寄北》李商隐", a: "君问归期未有期，巴山夜雨涨秋池。何当共剪西窗烛，却话巴山夜雨时。" },
      { t: "《木兰诗》（节选）", a: "万里赴戎机，关山度若飞。朔气传金柝，寒光照铁衣。将军百战死，壮士十年归。" },
      { t: "《登飞来峰》王安石", a: "飞来山上千寻塔，闻说鸡鸣见日升。不畏浮云遮望眼，自缘身在最高层。" },
      { t: "《望岳》杜甫", a: "岱宗夫如何？齐鲁青未了。造化钟神秀，阴阳割昏晓。会当凌绝顶，一览众山小。" },
      { t: "《游山西村》陆游", a: "莫笑农家腊酒浑，丰年留客足鸡豚。山重水复疑无路，柳暗花明又一村。" },
      { t: "《己亥杂诗》龚自珍", a: "浩荡离愁白日斜，吟鞭东指即天涯。落红不是无情物，化作春泥更护花。" },
      { t: "《茅屋为秋风所破歌》（名句）", a: "安得广厦千万间，大庇天下寒士俱欢颜！风雨不动安如山。" },
      { t: "《岳阳楼记》（名句）", a: "先天下之忧而忧，后天下之乐而乐。" },
      { t: "《醉翁亭记》（名句）", a: "醉翁之意不在酒，在乎山水之间也。" },
      { t: "《陋室铭》刘禹锡", a: "山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。" },
      { t: "《爱莲说》周敦颐", a: "予独爱莲之出淤泥而不染，濯清涟而不妖，中通外直，不蔓不枝。" },
      { t: "《论语》十二章（节选）", a: "学而不思则罔，思而不学则殆。三人行，必有我师焉。温故而知新，可以为师矣。" },
      { t: "《送杜少府之任蜀州》王勃", a: "城阙辅三秦，风烟望五津。与君离别意，同是宦游人。海内存知己，天涯若比邻。" },
      { t: "《蒹葭》诗经", a: "蒹葭苍苍，白露为霜。所谓伊人，在水一方。溯洄从之，道阻且长；溯游从之，宛在水中央。" }
    ],
    open: function () {
      var self = this;
      var known = {};
      try { known = JSON.parse(storageGet(this.KEY)) || {}; } catch (e) { known = {}; }
      function save() { try { storageSet(self.KEY, JSON.stringify(known)); } catch (e) {} }
      var i = 0, flipped = false;
      showModal(
        '<div id="tReciteRoot" style="max-width:420px;margin:0 auto">' +
        '<h3>📖 古诗文背诵卡</h3>' +
        '<div id="tReciteCard" style="min-height:200px;border-radius:16px;border:1px solid rgba(127,127,127,.2);background:linear-gradient(135deg,#fdfaf2,#f7f1e3);padding:18px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:17px;line-height:1.9;cursor:pointer"></div>' +
        '<div class="dim small" style="text-align:center;margin:6px 0">点卡片翻面（看原文）</div>' +
        '<div style="display:flex;gap:8px;justify-content:center">' +
          '<button class="gbtn" id="tRecitePrev">‹ 上一张</button>' +
          '<button class="gbtn" id="tReciteFlip">翻面</button>' +
          '<button class="gbtn" id="tReciteNext">下一张 ›</button>' +
        '</div>' +
        '<div style="text-align:center;margin-top:8px"><button class="gbtn big" id="tReciteKnow">✅ 已背（标记）</button></div>' +
        '<div style="text-align:center;margin-top:6px" class="dim small" id="tReciteProg"></div>' + btnBar() + '</div>'
      );
      var card = document.getElementById("tReciteCard");
      function render() {
        var c = self.deck[i];
        if (flipped) card.textContent = c.a;
        else card.innerHTML = "<b>" + c.t + "</b>";
        var prog = document.getElementById("tReciteProg");
        if (prog) {
          var k = self.deck.filter(function (x, j) { return known[j]; }).length;
          prog.textContent = "进度 " + (i + 1) + "/" + self.deck.length + " · 已背 " + k + " 篇";
        }
      }
      if (card) card.onclick = function () { flipped = !flipped; render(); };
      var prev = document.getElementById("tRecitePrev");
      if (prev) prev.onclick = function () { i = (i - 1 + self.deck.length) % self.deck.length; flipped = false; render(); };
      var next = document.getElementById("tReciteNext");
      if (next) next.onclick = function () { i = (i + 1) % self.deck.length; flipped = false; render(); };
      var fl = document.getElementById("tReciteFlip");
      if (fl) fl.onclick = function () { flipped = !flipped; render(); };
      var kn = document.getElementById("tReciteKnow");
      if (kn) kn.onclick = function () { known[i] = true; save(); render(); try { toast("已标记，继续加油！"); } catch (e) {} };
      render();
    }
  };

  /* 注册进工具箱 */
  try {
    if (window.XZ13 && window.XZ13.TOOLS) {
      window.XZ13.TOOLS.push(
        { icon: "🍅", name: "番茄钟", call: "X565TOOLS.pomodoro.open()" },
        { icon: "🎡", name: "决策转盘", call: "X565TOOLS.wheel.open()" },
        { icon: "👥", name: "分组值日", call: "X565TOOLS.groups.open()" },
        { icon: "💰", name: "零花钱记账", call: "X565TOOLS.ledger.open()" },
        { icon: "📖", name: "古诗文背诵卡", call: "X565TOOLS.recite.open()" }
      );
    }
  } catch (e) {}
});


/* ===== p64_tools2.js ===== */
/* ============================================================================
   p64 · 5.6.5 新增实用工具（第二批 4 个，本地保存）
   6) 课程表（一周节次，可编辑保存）
   7) 计算器（四则运算）
   8) 待办清单（增删、勾选、优先级）
   9) 便签墙（多张便利贴，可增删改）
   全部注册进 4.0 工具箱
   ============================================================================ */
register("tools2-565", function () {
  var T = window.X565TOOLS = window.X565TOOLS || {};
  var XZ13 = window.XZ13 || null;
  function showModal(html) {
    if (XZ13 && typeof XZ13.modal === "function") XZ13.modal(html);
    else if (typeof window.modal === "function") window.modal(html);
  }
  function watch(rootId, handles) {
    var t = setInterval(function () {
      if (!document.getElementById(rootId)) {
        clearInterval(t);
        (handles || []).forEach(function (h) {
          try { if (typeof h === "number") clearInterval(h); else if (typeof h === "function") h(); } catch (e) {}
        });
      }
    }, 400);
    return t;
  }
  function closeBtn() {
    return '<div class="xz13-save-bar" style="justify-content:center;margin-top:8px"><button class="xz13-save-ss-btn" onclick="closeModal()">关闭</button></div>';
  }

  /* ─────────── 6) 课程表 ─────────── */
  T.timetable = {
    KEY: "x565_timetable_v1",
    days: ["周一", "周二", "周三", "周四", "周五"],
    slots: ["第1节", "第2节", "第3节", "第4节", "第5节", "第6节", "晚自修"],
    load: function () {
      try { var d = JSON.parse(storageGet(this.KEY)); if (d && d.grid) return d; } catch (e) {}
      var g = [];
      for (var r = 0; r < this.slots.length; r++) { g.push(new Array(this.days.length).fill("")); }
      return { grid: g };
    },
    save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },
    open: function () {
      var self = this;
      var d = self.load();
      showModal(
        '<div id="tTtRoot" style="max-width:680px;margin:0 auto">' +
        '<h3>📅 我的课程表</h3>' +
        '<div style="overflow-x:auto"><table id="tTtTable" style="width:100%;border-collapse:collapse;font-size:13px;min-width:520px"></table></div>' +
        '<div class="dim small" style="margin-top:6px">点格子直接填课程，自动保存</div>' + closeBtn() + '</div>'
      );
      var table = document.getElementById("tTtTable");
      function render() {
        var html = "<tr><th style='padding:6px;border:1px solid rgba(127,127,127,.25)'>节次</th>";
        self.days.forEach(function (day) { html += "<th style='padding:6px;border:1px solid rgba(127,127,127,.25)'>" + day + "</th>"; });
        html += "</tr>";
        self.slots.forEach(function (slot, r) {
          html += "<tr><td style='padding:4px;border:1px solid rgba(127,127,127,.25);text-align:center;font-weight:700'>" + slot + "</td>";
          self.days.forEach(function (day, c) {
            var v = d.grid[r][c] || "";
            html += "<td style='padding:0;border:1px solid rgba(127,127,127,.25)'>" +
              "<input data-r='" + r + "' data-c='" + c + "' value='" + (v.replace(/'/g, "&#39;")) +
              "' style='width:100%;box-sizing:border-box;border:none;padding:8px 4px;text-align:center;background:transparent;font-size:13px'></td>";
          });
          html += "</tr>";
        });
        table.innerHTML = html;
        Array.prototype.forEach.call(table.querySelectorAll("input"), function (inp) {
          inp.onchange = function () {
            d.grid[parseInt(inp.getAttribute("data-r"), 10)][parseInt(inp.getAttribute("data-c"), 10)] = inp.value;
            self.save(d);
            try { toast("已保存", 600); } catch (e) {}
          };
        });
      }
      render();
    }
  };

  /* ─────────── 7) 计算器 ─────────── */
  T.calc = {
    open: function () {
      showModal(
        '<div id="tCalcRoot" style="max-width:300px;margin:0 auto">' +
        '<h3>🧮 计算器</h3>' +
        '<div id="tCalcDisp" style="background:#111827;color:#9ff0c8;border-radius:12px;padding:18px;font-size:28px;text-align:right;min-height:64px;word-break:break-all;margin-bottom:8px">0</div>' +
        '<div id="tCalcKeys" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px"></div>' + closeBtn() + '</div>'
      );
      var keys = ["C", "(", ")", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ".", "=", "="];
      var box = document.getElementById("tCalcKeys");
      var disp = document.getElementById("tCalcDisp");
      var expr = "";
      function show(s) { disp.textContent = s || "0"; }
      function evalExpr(s) {
        var safe = s.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
        if (!/^[0-9+\-*/().\s]+$/.test(safe)) return null;
        try {
          var f = Function("return (" + safe + ")");
          var v = f();
          if (typeof v === "number" && isFinite(v)) {
            return Math.round(v * 1e10) / 1e10;
          }
          return null;
        } catch (e) { return null; }
      }
      keys.forEach(function (k) {
        var b = document.createElement("button");
        b.textContent = k;
        b.style.cssText = "min-height:52px;font-size:20px;border-radius:10px;border:1px solid rgba(127,127,127,.25);cursor:pointer;background:" +
          ("=+×÷−".indexOf(k) >= 0 ? "linear-gradient(135deg,#ff9d5c,#ff7a59);color:#fff" : "rgba(127,127,127,.1)");
        b.onclick = function () {
          if (k === "C") { expr = ""; }
          else if (k === "=") {
            var v = evalExpr(expr);
            if (v === null) { show("错误"); expr = ""; return; }
            expr = String(v);
          } else expr += k;
          show(expr);
        };
        box.appendChild(b);
      });
    }
  };

  /* ─────────── 8) 待办清单 ─────────── */
  T.todo = {
    KEY: "x565_todo_v1",
    load: function () { try { return JSON.parse(storageGet(this.KEY)) || { items: [] }; } catch (e) { return { items: [] }; } },
    save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },
    open: function () {
      var self = this;
      showModal(
        '<div id="tTodoRoot" style="max-width:420px;margin:0 auto">' +
        '<h3>✅ 待办清单</h3>' +
        '<div style="display:flex;gap:6px;margin:6px 0">' +
          '<input id="tTodoText" placeholder="要做什么？" style="flex:1;padding:10px;border-radius:10px;border:1px solid rgba(127,127,127,.3)">' +
          '<select id="tTodoPri" style="border-radius:10px;border:1px solid rgba(127,127,127,.3);padding:8px"><option value="0">普通</option><option value="1">重要</option><option value="2">紧急</option></select>' +
          '<button class="gbtn" id="tTodoAdd">添加</button>' +
        '</div>' +
        '<div id="tTodoList"></div>' + closeBtn() + '</div>'
      );
      function render() {
        var d = self.load();
        var list = document.getElementById("tTodoList");
        if (!list) return;
        if (!d.items.length) { list.innerHTML = '<div class="dim small" style="text-align:center;padding:16px">还没有待办，加一个吧</div>'; return; }
        var priColor = ["#6ea0ec", "#f0a93c", "#e8513f"];
        var priLabel = ["普通", "重要", "紧急"];
        d.items.slice().sort(function (a, b) { return b.pri - a.pri || (a.done - b.done); }).forEach(function (it) {
          var realIdx = d.items.indexOf(it);
          var row = document.createElement("div");
          row.style.cssText = "display:flex;align-items:center;gap:8px;padding:9px;margin:5px 0;border-radius:10px;background:rgba(127,127,127,.08)";
          var cb = document.createElement("input");
          cb.type = "checkbox"; cb.checked = !!it.done; cb.style.cssText = "width:20px;height:20px";
          cb.onchange = function () { it.done = cb.checked; self.save(d); render(); };
          var span = document.createElement("span");
          span.style.cssText = "flex:1;" + (it.done ? "text-decoration:line-through;opacity:.5" : "");
          span.innerHTML = '<span style="color:' + priColor[it.pri] + ";font-size:12px;margin-right:6px\">[" + priLabel[it.pri] + "]</span>" +
            String(it.text).replace(/[<>&]/g, function (c) { return c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;"; });
          var del = document.createElement("button");
          del.textContent = "删"; del.style.cssText = "border:none;background:none;color:#e8513f;font-size:14px";
          del.onclick = function () { d.items.splice(realIdx, 1); self.save(d); render(); };
          row.appendChild(cb); row.appendChild(span); row.appendChild(del);
          list.appendChild(row);
        });
      }
      var add = document.getElementById("tTodoAdd");
      if (add) add.onclick = function () {
        var inp = document.getElementById("tTodoText");
        var txt = inp.value.trim();
        if (!txt) return;
        var d = self.load();
        d.items.push({ text: txt, pri: parseInt(document.getElementById("tTodoPri").value, 10), done: false });
        self.save(d); inp.value = ""; render();
      };
      var inp = document.getElementById("tTodoText");
      if (inp) inp.addEventListener("keydown", function (e) { if (e.key === "Enter") add.click(); });
      render();
    }
  };

  /* ─────────── 9) 便签墙 ─────────── */
  T.notes = {
    KEY: "x565_notes_v1",
    load: function () { try { return JSON.parse(storageGet(this.KEY)) || { notes: [] }; } catch (e) { return { notes: [] }; } },
    save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },
    colors: ["#fff3b0", "#c8f0d8", "#cfe0ff", "#ffd9c8", "#e8d8ff"],
    open: function () {
      var self = this;
      showModal(
        '<div id="tNoteRoot" style="max-width:600px;margin:0 auto">' +
        '<h3>📝 便签墙</h3>' +
        '<button class="gbtn" id="tNoteAdd" style="margin-bottom:8px">＋ 新便利贴</button>' +
        '<div id="tNoteBoard" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px"></div>' + closeBtn() + '</div>'
      );
      function render() {
        var d = self.load();
        var board = document.getElementById("tNoteBoard");
        if (!board) return;
        board.innerHTML = "";
        d.notes.forEach(function (n, idx) {
          var card = document.createElement("div");
          card.style.cssText = "background:" + self.colors[n.color || 0] + ";border-radius:10px;padding:8px;min-height:130px;display:flex;flex-direction:column;box-shadow:0 3px 8px rgba(0,0,0,.12)";
          var ta = document.createElement("textarea");
          ta.value = n.text;
          ta.style.cssText = "flex:1;border:none;background:transparent;resize:none;font-size:14px;min-height:90px;outline:none";
          ta.oninput = function () { n.text = ta.value; self.save(d); };
          var row = document.createElement("div");
          row.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-top:4px";
          var colorBtns = document.createElement("span");
          self.colors.forEach(function (cc, ci) {
            var b = document.createElement("button");
            b.style.cssText = "width:16px;height:16px;border-radius:50%;border:1px solid rgba(0,0,0,.15);background:" + cc + ";margin-right:3px;padding:0";
            b.onclick = function () { n.color = ci; self.save(d); render(); };
            colorBtns.appendChild(b);
          });
          var del = document.createElement("button");
          del.textContent = "删"; del.style.cssText = "border:none;background:none;color:#e8513f";
          del.onclick = function () { d.notes.splice(idx, 1); self.save(d); render(); };
          row.appendChild(colorBtns); row.appendChild(del);
          card.appendChild(ta); card.appendChild(row);
          board.appendChild(card);
        });
      }
      var add = document.getElementById("tNoteAdd");
      if (add) add.onclick = function () {
        var d = self.load();
        d.notes.push({ text: "", color: Math.floor(Math.random() * self.colors.length) });
        self.save(d); render();
      };
      render();
    }
  };

  /* 注册 */
  try {
    if (window.XZ13 && window.XZ13.TOOLS) {
      window.XZ13.TOOLS.push(
        { icon: "📅", name: "课程表", call: "X565TOOLS.timetable.open()" },
        { icon: "🧮", name: "计算器", call: "X565TOOLS.calc.open()" },
        { icon: "✅", name: "待办清单", call: "X565TOOLS.todo.open()" },
        { icon: "📝", name: "便签墙", call: "X565TOOLS.notes.open()" }
      );
    }
  } catch (e) {}
});


/* ===== p66_tools3.js ===== */
/* ============================================================================
   p66 · 5.6.5 新增实用工具（第三批 4 个）
   10) 秒表（计时/计圈）
   11) 单位换算（长度/质量/温度）
   12) 单词本（添加、自测、本地保存）
   13) 画板（canvas 手绘，可清空）
   ============================================================================ */
register("tools3-565", function () {
  var T = window.X565TOOLS = window.X565TOOLS || {};
  var XZ13 = window.XZ13 || null;
  function showModal(html) {
    if (XZ13 && typeof XZ13.modal === "function") XZ13.modal(html);
    else if (typeof window.modal === "function") window.modal(html);
  }
  function watch(rootId, handles) {
    var t = setInterval(function () {
      if (!document.getElementById(rootId)) {
        clearInterval(t);
        (handles || []).forEach(function (h) {
          try { if (typeof h === "number") { clearInterval(h); } else if (typeof h === "function") h(); } catch (e) {}
        });
      }
    }, 400);
    return t;
  }
  function closeBtn() {
    return '<div class="xz13-save-bar" style="justify-content:center;margin-top:8px"><button class="xz13-save-ss-btn" onclick="closeModal()">关闭</button></div>';
  }
  function fmt(ms) {
    var s = Math.floor(ms / 1000), cs = Math.floor((ms % 1000) / 10);
    var m = Math.floor(s / 60);
    s = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + "." + (cs < 10 ? "0" : "") + cs;
  }

  /* ─────────── 10) 秒表 ─────────── */
  T.stopwatch = {
    open: function () {
      showModal(
        '<div id="tSwRoot" style="max-width:320px;margin:0 auto;text-align:center">' +
        '<h3>⏱️ 秒表</h3>' +
        '<div id="tSwDisp" style="font-size:46px;font-variant-numeric:tabular-nums;margin:20px 0">00:00.00</div>' +
        '<div style="display:flex;gap:10px;justify-content:center">' +
          '<button class="gbtn" id="tSwStart">开始</button>' +
          '<button class="gbtn" id="tSwLap">计圈</button>' +
          '<button class="gbtn" id="tSwReset">重置</button>' +
        '</div>' +
        '<div id="tSwLaps" style="margin-top:14px;text-align:left;max-height:180px;overflow:auto"></div>' + closeBtn() + '</div>'
      );
      var start = 0, elapsed = 0, timer = 0, running = false, laps = [];
      var disp = document.getElementById("tSwDisp");
      function renderLaps() {
        var box = document.getElementById("tSwLaps");
        if (!box) return;
        box.innerHTML = laps.map(function (l, i) {
          return '<div style="padding:4px 8px;border-bottom:1px solid rgba(127,127,127,.15)">第 ' + (laps.length - i) + ' 圈　' + fmt(l) + "</div>";
        }).join("");
      }
      function tick() {
        if (disp) disp.textContent = fmt(performance.now() - start + elapsed);
      }
      document.getElementById("tSwStart").onclick = function () {
        var b = this;
        if (!running) {
          running = true; start = performance.now();
          timer = setInterval(tick, 31);
          b.textContent = "暂停";
        } else {
          running = false; elapsed += performance.now() - start;
          clearInterval(timer);
          b.textContent = "继续";
        }
      };
      document.getElementById("tSwLap").onclick = function () {
        if (!running) return;
        laps.push(performance.now() - start + elapsed);
        renderLaps();
      };
      document.getElementById("tSwReset").onclick = function () {
        running = false; clearInterval(timer); elapsed = 0; laps = [];
        disp.textContent = "00:00.00"; renderLaps();
        document.getElementById("tSwStart").textContent = "开始";
      };
      watch("tSwRoot", [function () { clearInterval(timer); }]);
    }
  };

  /* ─────────── 11) 单位换算 ─────────── */
  T.converter = {
    open: function () {
      showModal(
        '<div id="tCvRoot" style="max-width:360px;margin:0 auto">' +
        '<h3>📐 单位换算</h3>' +
        '<select id="tCvType" style="width:100%;padding:10px;border-radius:10px;border:1px solid rgba(127,127,127,.3);margin-bottom:8px">' +
          '<option value="len">长度</option><option value="mass">质量</option><option value="temp">温度</option></select>' +
        '<div style="display:flex;gap:6px;align-items:center">' +
          '<input id="tCvVal" type="number" value="1" style="flex:1;padding:10px;border-radius:10px;border:1px solid rgba(127,127,127,.3)">' +
          '<select id="tCvFrom" style="padding:10px;border-radius:10px;border:1px solid rgba(127,127,127,.3)"></select></div>' +
        '<div style="text-align:center;margin:8px;font-size:20px">＝</div>' +
        '<div style="display:flex;gap:6px;align-items:center">' +
          '<input id="tCvOut" readonly style="flex:1;padding:10px;border-radius:10px;border:1px solid rgba(127,127,127,.3);background:rgba(127,127,127,.08)">' +
          '<select id="tCvTo" style="padding:10px;border-radius:10px;border:1px solid rgba(127,127,127,.3)"></select></div>' + closeBtn() + '</div>'
      );
      var data = {
        len: { units: { 米: 1, 千米: 1000, 厘米: 0.01, 毫米: 0.001, 英寸: 0.0254, 英尺: 0.3048, 里: 500, 码: 0.9144 } },
        mass: { units: { 克: 1, 千克: 1000, 吨: 1000000, 斤: 500, 两: 50, 磅: 453.59237, 盎司: 28.3495 } },
        temp: { units: { 摄氏度: 1, 华氏度: 1, 开尔文: 1 } }
      };
      var typeSel = document.getElementById("tCvType");
      var fromSel = document.getElementById("tCvFrom"), toSel = document.getElementById("tCvTo");
      var valIn = document.getElementById("tCvVal"), outIn = document.getElementById("tCvOut");
      function fillUnits() {
        var type = typeSel.value;
        var names = Object.keys(data[type].units);
        fromSel.innerHTML = names.map(function (n) { return "<option>" + n + "</option>"; }).join("");
        toSel.innerHTML = names.map(function (n) { return "<option>" + n + "</option>"; }).join("");
        if (names.length > 1) toSel.selectedIndex = 1;
        calc();
      }
      function toCelsius(v, u) {
        if (u === "摄氏度") return v;
        if (u === "华氏度") return (v - 32) * 5 / 9;
        return v - 273.15;
      }
      function fromCelsius(c, u) {
        if (u === "摄氏度") return c;
        if (u === "华氏度") return c * 9 / 5 + 32;
        return c + 273.15;
      }
      function calc() {
        var type = typeSel.value;
        var v = parseFloat(valIn.value);
        if (isNaN(v)) { outIn.value = ""; return; }
        var result;
        if (type === "temp") {
          result = fromCelsius(toCelsius(v, fromSel.value), toSel.value);
        } else {
          var u = data[type].units;
          result = v * u[fromSel.value] / u[toSel.value];
        }
        outIn.value = Math.round(result * 1e6) / 1e6;
      }
      [typeSel, fromSel, toSel, valIn].forEach(function (el) {
        el.addEventListener("change", function () { if (el === typeSel) fillUnits(); else calc(); });
        el.addEventListener("input", calc);
      });
      fillUnits();
    }
  };

  /* ─────────── 12) 单词本 ─────────── */
  T.words = {
    KEY: "x565_words_v1",
    load: function () { try { return JSON.parse(storageGet(this.KEY)) || { list: [] }; } catch (e) { return { list: [] }; } },
    save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },
    open: function () {
      var self = this;
      showModal(
        '<div id="tWdRoot" style="max-width:440px;margin:0 auto">' +
        '<h3>📖 单词本</h3>' +
        '<div style="display:flex;gap:6px;margin-bottom:6px">' +
          '<input id="tWdEn" placeholder="英文" style="flex:1;padding:9px;border-radius:10px;border:1px solid rgba(127,127,127,.3)">' +
          '<input id="tWdCn" placeholder="中文释义" style="flex:1;padding:9px;border-radius:10px;border:1px solid rgba(127,127,127,.3)">' +
          '<button class="gbtn" id="tWdAdd">添加</button>' +
        '</div>' +
        '<button class="gbtn" id="tWdQuiz" style="margin-bottom:8px">🎯 开始自测</button>' +
        '<div id="tWdList"></div>' +
        '<div id="tWdQuizBox" style="display:none"></div>' + closeBtn() + '</div>'
      );
      function render() {
        var d = self.load();
        var box = document.getElementById("tWdList");
        if (!box) return;
        if (!d.list.length) { box.innerHTML = '<div class="dim small" style="padding:14px;text-align:center">还没有单词</div>'; return; }
        box.innerHTML = d.list.map(function (w, i) {
          return '<div style="display:flex;align-items:center;gap:8px;padding:8px;margin:4px 0;border-radius:10px;background:rgba(127,127,127,.08)">' +
            '<span style="flex:1"><b>' + w.en + "</b>　" + w.cn + "</span>" +
            '<button class="xz13-save-ss-btn" data-del="' + i + '" style="color:#e8513f">删</button></div>';
        }).join("");
        Array.prototype.forEach.call(box.querySelectorAll("[data-del]"), function (b) {
          b.onclick = function () {
            var dd = self.load();
            dd.list.splice(parseInt(b.getAttribute("data-del"), 10), 1);
            self.save(dd); render();
          };
        });
      }
      document.getElementById("tWdAdd").onclick = function () {
        var en = document.getElementById("tWdEn").value.trim();
        var cn = document.getElementById("tWdCn").value.trim();
        if (!en || !cn) { toast("英文和中文都要填"); return; }
        var d = self.load();
        d.list.push({ en: en, cn: cn });
        self.save(d);
        document.getElementById("tWdEn").value = "";
        document.getElementById("tWdCn").value = "";
        render();
      };
      document.getElementById("tWdQuiz").onclick = function () {
        var d = self.load();
        if (d.list.length < 2) { toast("至少添加 2 个单词再自测"); return; }
        var order = d.list.slice().sort(function () { return Math.random() - 0.5; });
        var i = 0;
        var listBox = document.getElementById("tWdList");
        var qb = document.getElementById("tWdQuizBox");
        if (listBox) listBox.style.display = "none";
        if (qb) qb.style.display = "block";
        function q() {
          if (i >= order.length) {
            qb.innerHTML = '<div style="text-align:center;padding:16px;font-size:17px">✅ 自测结束，共 ' + order.length + " 词</div>" +
              '<button class="gbtn" id="tWdBack" style="margin-top:8px">返回单词本</button>';
            document.getElementById("tWdBack").onclick = function () {
              qb.style.display = "none"; if (listBox) listBox.style.display = "block";
            };
            return;
          }
          var w = order[i];
          qb.innerHTML = '<div style="text-align:center;padding:12px;border-radius:12px;background:rgba(127,209,174,.12)">' +
            '<div style="font-size:26px;font-weight:800;margin:10px 0">' + w.en + "</div>" +
            '<div id="tWdAns" style="display:none;font-size:18px;margin:10px 0">意思是：<b>' + w.cn + "</b></div>" +
            '<div style="display:flex;gap:8px;justify-content:center"><button class="gbtn" id="tWdShow">显示释义</button><button class="gbtn" id="tWdNext">下一个</button></div>' +
            '<div class="dim small" style="margin-top:8px">' + (i + 1) + "/" + order.length + "</div></div>";
          document.getElementById("tWdShow").onclick = function () { var a = document.getElementById("tWdAns"); if (a) a.style.display = "block"; };
          document.getElementById("tWdNext").onclick = function () { i++; q(); };
        }
        q();
      };
      render();
    }
  };

  /* ─────────── 13) 画板 ─────────── */
  T.draw = {
    open: function () {
      showModal(
        '<div id="tDwRoot" style="max-width:380px;margin:0 auto;text-align:center">' +
        '<h3>🎨 画板</h3>' +
        '<div style="display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap;margin-bottom:6px">' +
          '<input type="color" id="tDwColor" value="#ff7a59" style="width:44px;height:40px;border:none">' +
          '<label class="dim small">粗细 <input type="range" id="tDwSize" min="1" max="18" value="4"></label>' +
          '<button class="gbtn" id="tDwClear">清空</button>' +
        '</div>' +
        '<canvas id="tDwCv" width="340" height="340" style="background:#fff;border-radius:12px;touch-action:none;max-width:100%;border:1px solid rgba(127,127,127,.2)"></canvas>' +
        '<div class="dim small" style="margin-top:6px">鼠标或手指直接画</div>' + closeBtn() + '</div>'
      );
      var cv = document.getElementById("tDwCv"), ctx = cv.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 340, 340);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      var drawing = false;
      function pos(e) {
        var rect = cv.getBoundingClientRect();
        var p = e.touches ? e.touches[0] : e;
        return { x: (p.clientX - rect.left) * (340 / rect.width), y: (p.clientY - rect.top) * (340 / rect.height) };
      }
      function down(e) {
        e.preventDefault();
        drawing = true;
        var p = pos(e);
        ctx.strokeStyle = document.getElementById("tDwColor").value;
        ctx.lineWidth = document.getElementById("tDwSize").value;
        ctx.beginPath(); ctx.moveTo(p.x, p.y);
      }
      function move(e) {
        if (!drawing) return;
        e.preventDefault();
        var p = pos(e);
        ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      function up() { drawing = false; }
      cv.addEventListener("mousedown", down);
      cv.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
      cv.addEventListener("touchstart", down, { passive: false });
      cv.addEventListener("touchmove", move, { passive: false });
      cv.addEventListener("touchend", up);
      document.getElementById("tDwClear").onclick = function () {
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 340, 340);
      };
      watch("tDwRoot", [function () {
        window.removeEventListener("mouseup", up);
      }]);
    }
  };

  /* 注册 */
  try {
    if (window.XZ13 && window.XZ13.TOOLS) {
      window.XZ13.TOOLS.push(
        { icon: "⏱️", name: "秒表", call: "X565TOOLS.stopwatch.open()" },
        { icon: "📐", name: "单位换算", call: "X565TOOLS.converter.open()" },
        { icon: "📖", name: "单词本", call: "X565TOOLS.words.open()" },
        { icon: "🎨", name: "画板", call: "X565TOOLS.draw.open()" }
      );
    }
  } catch (e) {}
});


/* ===== p68_tools4.js ===== */
/* ============================================================================
   p68 · 5.6.5 新增实用工具（第四批 4 个）
   14) 座位表（网格座位，可填姓名，本地保存）
   15) 班级通讯录（姓名/座位/电话，本地保存）
   16) 学习打卡（连续打卡天数，可写一句总结）
   17) 鼓励卡（抽一句校园励志语，内置约 90 条）
   ============================================================================ */
register("tools4-565", function () {
  var T = window.X565TOOLS = window.X565TOOLS || {};
  var XZ13 = window.XZ13 || null;
  function showModal(html) {
    if (XZ13 && typeof XZ13.modal === "function") XZ13.modal(html);
    else if (typeof window.modal === "function") window.modal(html);
  }
  function watch(rootId, handles) {
    var t = setInterval(function () {
      if (!document.getElementById(rootId)) {
        clearInterval(t);
        (handles || []).forEach(function (h) {
          try { if (typeof h === "number") clearInterval(h); else if (typeof h === "function") h(); } catch (e) {}
        });
      }
    }, 400);
    return t;
  }
  function closeBtn() {
    return '<div class="xz13-save-bar" style="justify-content:center;margin-top:8px"><button class="xz13-save-ss-btn" onclick="closeModal()">关闭</button></div>';
  }

  /* ─────────── 14) 座位表 ─────────── */
  T.seats = {
    KEY: "x565_seats_v1",
    rows: 6, cols: 7,
    load: function () {
      try { var d = JSON.parse(storageGet(this.KEY)); if (d && d.grid) return d; } catch (e) {}
      var g = [];
      for (var r = 0; r < this.rows; r++) g.push(new Array(this.cols).fill(""));
      return { grid: g };
    },
    save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },
    open: function () {
      var self = this;
      var d = self.load();
      showModal(
        '<div id="tSeRoot" style="max-width:680px;margin:0 auto">' +
        '<h3>🪑 班级座位表</h3>' +
        '<div class="dim small" style="text-align:center;margin-bottom:6px">讲台（黑色为走道）</div>' +
        '<div style="overflow-x:auto"><div id="tSeGrid" style="display:grid;grid-template-columns:repeat(' + self.cols + ',1fr);gap:4px;min-width:520px"></div></div>' +
        '<div class="dim small" style="margin-top:6px">点格子填姓名，清空即空座，自动保存</div>' + closeBtn() + "</div>"
      );
      var grid = document.getElementById("tSeGrid");
      function render() {
        grid.innerHTML = "";
        for (var r = 0; r < self.rows; r++) for (var c = 0; c < self.cols; c++) {
          (function (r, c) {
            var inp = document.createElement("input");
            inp.value = d.grid[r][c] || "";
            inp.placeholder = "空";
            inp.style.cssText = "padding:8px 2px;text-align:center;border-radius:6px;border:1px solid rgba(127,127,127,.25);background:rgba(127,127,127,.06);min-width:0;font-size:13px";
            inp.onchange = function () { d.grid[r][c] = inp.value.trim(); self.save(d); };
            grid.appendChild(inp);
          })(r, c);
        }
      }
      render();
    }
  };

  /* ─────────── 15) 班级通讯录 ─────────── */
  T.classbook = {
    KEY: "x565_classbook_v1",
    load: function () { try { return JSON.parse(storageGet(this.KEY)) || { list: [] }; } catch (e) { return { list: [] }; } },
    save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },
    open: function () {
      var self = this;
      showModal(
        '<div id="tCbRoot" style="max-width:460px;margin:0 auto">' +
        '<h3>📒 班级通讯录</h3>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">' +
          '<input id="tCbName" placeholder="姓名" style="flex:1;min-width:90px;padding:9px;border-radius:10px;border:1px solid rgba(127,127,127,.3)">' +
          '<input id="tCbRole" placeholder="职务/备注" style="flex:1;min-width:90px;padding:9px;border-radius:10px;border:1px solid rgba(127,127,127,.3)">' +
          '<input id="tCbTel" placeholder="电话（选填）" style="flex:1;min-width:110px;padding:9px;border-radius:10px;border:1px solid rgba(127,127,127,.3)">' +
          '<button class="gbtn" id="tCbAdd">添加</button>' +
        '</div>' +
        '<div id="tCbList"></div>' + closeBtn() + "</div>"
      );
      function esc(s) { return String(s || "").replace(/[<>&]/g, function (c) { return c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;"; }); }
      function render() {
        var d = self.load();
        var box = document.getElementById("tCbList");
        if (!box) return;
        if (!d.list.length) { box.innerHTML = '<div class="dim small" style="text-align:center;padding:14px">还没有联系人</div>'; return; }
        d.list.sort(function (a, b) { return (a.name || "").localeCompare(b.name || "", "zh"); });
        box.innerHTML = d.list.map(function (p) {
          var real = self.load().list.indexOf(p);
          return '<div style="display:flex;align-items:center;gap:8px;padding:9px;margin:4px 0;border-radius:10px;background:rgba(127,127,127,.08)">' +
            '<div style="flex:1"><b>' + esc(p.name) + "</b> <span class='dim small'>" + esc(p.role) + "</span>" +
            (p.tel ? '<div class="dim small">📞 ' + esc(p.tel) + "</div>" : "") + "</div>" +
            '<button class="xz13-save-ss-btn" data-del="' + real + '" style="color:#e8513f">删</button></div>';
        }).join("");
        Array.prototype.forEach.call(box.querySelectorAll("[data-del]"), function (b) {
          b.onclick = function () {
            var dd = self.load();
            dd.list.splice(parseInt(b.getAttribute("data-del"), 10), 1);
            self.save(dd); render();
          };
        });
      }
      document.getElementById("tCbAdd").onclick = function () {
        var name = document.getElementById("tCbName").value.trim();
        if (!name) { toast("至少填姓名"); return; }
        var d = self.load();
        d.list.push({
          name: name,
          role: document.getElementById("tCbRole").value.trim(),
          tel: document.getElementById("tCbTel").value.trim()
        });
        self.save(d);
        ["tCbName", "tCbRole", "tCbTel"].forEach(function (id) { document.getElementById(id).value = ""; });
        render();
      };
      render();
    }
  };

  /* ─────────── 16) 学习打卡 ─────────── */
  T.study = {
    KEY: "x565_study_v1",
    load: function () {
      try {
        var d = JSON.parse(storageGet(this.KEY));
        if (d && d.days) return d;
      } catch (e) {}
      return { days: {}, streak: 0, last: "" };
    },
    save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },
    today: function () {
      var d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    },
    open: function () {
      var self = this;
      var data = self.load();
      var today = self.today();
      var done = !!data.days[today];
      showModal(
        '<div id="tStRoot" style="max-width:420px;margin:0 auto;text-align:center">' +
        '<h3>📅 学习打卡</h3>' +
        '<div style="font-size:16px;margin:8px 0">连续打卡 <b style="font-size:26px;color:#22b07d">' + (data.streak || 0) + "</b> 天</div>" +
        '<div id="tStStatus" style="margin:10px 0">' + (done ? '<span style="color:#22b07d;font-size:18px">✅ 今天已打卡</span>' : '<button class="gbtn" id="tStBtn" style="font-size:18px;padding:12px 24px">立即打卡</button>') + "</div>" +
        '<input id="tStNote" placeholder="今天学了什么？（一句话）" style="width:90%;padding:10px;border-radius:10px;border:1px solid rgba(127,127,127,.3)">' +
        '<div style="text-align:left;margin-top:14px"><b>最近打卡</b><div id="tStList" style="margin-top:6px;max-height:200px;overflow:auto"></div></div>' + closeBtn() + "</div>"
      );
      var note = document.getElementById("tStNote");
      if (done) note.value = data.days[today].note || "";
      function renderList() {
        var keys = Object.keys(data.days).sort().reverse().slice(0, 14);
        var box = document.getElementById("tStList");
        if (!box) return;
        box.innerHTML = keys.map(function (k) {
          return '<div style="padding:6px 8px;margin:3px 0;border-radius:8px;background:rgba(127,209,174,.12)">' +
            "<b>" + k + "</b> <span class='dim small'>" + String(data.days[k].note || "").replace(/[<>&]/g, function (c) { return c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;"; }) + "</span></div>";
        }).join("") || '<div class="dim small">还没有记录</div>';
      }
      var btn = document.getElementById("tStBtn");
      if (btn) btn.onclick = function () {
        var d = self.load();
        var t = self.today();
        if (!d.days[t]) {
          var y = new Date(); y.setDate(y.getDate() - 1);
          var ykey = y.getFullYear() + "-" + String(y.getMonth() + 1).padStart(2, "0") + "-" + String(y.getDate()).padStart(2, "0");
          d.streak = (d.last === ykey) ? (d.streak || 0) + 1 : 1;
          d.last = t;
          d.days[t] = { note: "" };
        }
        self.save(d);
        toast("打卡成功，连续 " + d.streak + " 天");
        self.open();
      };
      note.onchange = function () {
        var d = self.load();
        var t = self.today();
        if (!d.days[t]) { note.value = ""; toast("请先打卡"); return; }
        d.days[t].note = note.value;
        self.save(d);
        renderList();
      };
      renderList();
    }
  };

  /* ─────────── 17) 鼓励卡 ─────────── */
  T.cheer = {
    QUOTES: [
      "你已经坚持到现在了，这本身就很了不起。",
      "别怕慢，就怕停。",
      "今天的努力，是明天的底气。",
      "难题不会因为你躲着就消失，跨过去就好了。",
      "你不必和别人比，比昨天的自己好一点就够了。",
      "错题是进步的脚印，不是失败的证据。",
      "把大目标拆成今天能做完的小事，就没那么难了。",
      "先开始五分钟，开始了就会停不下来。",
      "你不是一个人在扛，还有我。",
      "困了就睡，醒了再战，效率比硬撑重要。",
      "课间站起来走一走，给大脑一点空气。",
      "认真听完一节课，你就已经赢了走神的自己。",
      "失败一次不等于你不行，只是这道题还没懂。",
      "会问问题的人，进步最快。",
      "别把“我不会”挂在嘴边，换成“我可以学”。",
      "订正一道错题，比刷新题更有用。",
      "你今天背的每个单词，都会在某天回报你。",
      "心跳加速的时候，深呼吸，你准备好了。",
      "考前别再刷新题，相信自己已经努力过。",
      "会休息的人，才会学习。",
      "眼睛累了就远眺，别用健康换一时的进度。",
      "把课本目录看一遍，知识会自己连成网。",
      "别人的节奏是别人的，你有自己的花期。",
      "焦虑的时候，就去做一件具体的小事。",
      "完成比完美更重要，先交上一版。",
      "你勇敢举起的手，是别人心里的羡慕。",
      "敢承认“我不会”，比硬撑体面多了。",
      "帮别人讲题，是把知识变成自己的最好方式。",
      "今天早睡，明天的你会感谢现在的自己。",
      "操场跑两圈，烦恼会跟着汗水一起流走。",
      "没考好不是世界末日，是一次查漏补缺的机会。",
      "你的价值，从来不只写在分数里。",
      "认真吃饭、好好睡觉，是最朴素的努力。",
      "再难的压轴题，也有能拿的第一问。",
      "会复盘的人，不会在同一个地方摔两次。",
      "笔记不是抄给老师看的，是给未来的自己。",
      "你可以慢，但请别后退。",
      "一时的落后，是为了更好地理解。",
      "今天听懂的每个知识点，都在为你铺路。",
      "专注当下的二十分钟，比焦虑一整天有用。",
      "你不需要完美，你只需要做到。",
      "努力可能会迟到，但不会缺席。",
      "对自己温柔一点，你已经做得够多了。",
      "把“我必须”换成“我选择”，心态会轻很多。",
      "手机先放远一点，你会发现时间多了不少。",
      "读不进去就出声读，声音会把注意力拉回来。",
      "和同学一起讨论，难题会变简单。",
      "你愿意点开这张卡，就说明你还想变好。",
      "给努力的自己一个微笑，你值得。",
      "别因为一次偷懒就放弃，明天重新开始就好。",
      "认真听老师讲的错题，那是免费的提分机会。",
      "把每天的小目标写在便利贴上，做完就划掉。",
      "你不是没有进步，只是进步安静得没声响。",
      "心里没底时，回到最基础的定义去。",
      "紧张时，把注意力放在呼吸和题目上。",
      "试卷发下来，先看会做的，稳住心态。",
      "你背过的书、做过的题，都不会辜负你。",
      "今天的坚持，会在成绩里悄悄兑现。",
      "累了就停下来歇一会儿，别愧疚。",
      "把手机调成专注模式，世界会安静很多。",
      "同桌的鼓励，和你的努力一样重要。",
      "你已经比昨天的自己，更懂了一点点。",
      "不必羡慕别人的天赋，坚持就是你的天赋。",
      "写作文先列提纲，思路会清晰很多。",
      "数学不会就画图，图形会替你说话。",
      "英语阅读回原文找答案，不靠感觉。",
      "化学方程式守恒，配平没那么可怕。",
      "物理先画受力图，问题就解了一半。",
      "历史记住因果，比死记年份更牢。",
      "地理结合地图，等高线没那么难懂。",
      "道法分点作答，分数自然来。",
      "你愿意帮助别人，这本身就是很厉害的品质。",
      "被嘲笑的人，往往是敢站出来的人。",
      "你敢上台，就已经赢了台下不敢举手的人。",
      "真正的朋友，会陪你度过难熬的日子。",
      "心情不好就说出来，别一个人扛着。",
      "给爸妈打个电话，家里的声音能给你力量。",
      "礼貌的一声“谢谢”，会让你被温柔以待。",
      "认真值日、随手关门，小事里藏着教养。",
      "光盘是一种习惯，也是一种自律。",
      "雨天带把伞，也能温暖别人。",
      "做好眼前的事，未来会自己走来。",
      "你今天又平安、又努力地过完了，真好。",
      "愿你的每一份认真，都被看见。",
      "高中的日子会成为你以后最怀念的时光。",
      "别怕问问题，老师其实很喜欢思考的学生。",
      "整理好课桌，找东西的速度都会变快。",
      "你能影响身边的人变得更好，这很了不起。",
      "把烦恼写下来，它就没那么大了。",
      "认真完成一次小组任务，你会收获信任。",
      "今天的你，也辛苦啦。",
      "你值得被喜欢，也值得被认真对待。",
      "慢慢来，比较快。",
      "星光不问赶路人，时光不负有心人。",
      "现在的每一滴汗水，都是将来的底气。",
      "你不是一个人，整个班都在一起往前走。",
      "翻开下一页，你会发现自己又会了一题。",
      "今天的你，比昨天更接近想去的地方。"
    ],
    open: function () {
      var self = this;
      function show() {
        var i = Math.floor(Math.random() * self.QUOTES.length);
        var q = self.QUOTES[i];
        showModal(
          '<div id="tChRoot" style="max-width:400px;margin:0 auto;text-align:center">' +
          '<h3>✨ 鼓励卡</h3>' +
          '<div style="background:linear-gradient(135deg,rgba(255,200,150,.25),rgba(127,209,174,.25));border-radius:16px;padding:28px 20px;font-size:19px;line-height:1.9;margin:18px 0;min-height:130px;display:flex;align-items:center;justify-content:center">' + q + "</div>" +
          '<button class="gbtn" id="tChAgain" style="font-size:16px;padding:10px 24px">再抽一张</button>' +
          '<button class="gbtn" onclick="closeModal()">收下</button>' +
          '<div class="dim small" style="margin-top:10px">共 ' + self.QUOTES.length + " 张，随机抽取</div></div>"
        );
        document.getElementById("tChAgain").onclick = show;
      }
      show();
    }
  };

  /* 注册 */
  try {
    if (window.XZ13 && window.XZ13.TOOLS) {
      window.XZ13.TOOLS.push(
        { icon: "🪑", name: "座位表", call: "X565TOOLS.seats.open()" },
        { icon: "📒", name: "班级通讯录", call: "X565TOOLS.classbook.open()" },
        { icon: "📅", name: "学习打卡", call: "X565TOOLS.study.open()" },
        { icon: "✨", name: "鼓励卡", call: "X565TOOLS.cheer.open()" }
      );
    }
  } catch (e) {}
});


/* ===== p73_encounters.js ===== */
/* ============================================================================
   p73 · 5.6.5 校园奇遇（可反复抽取的随机事件簿）
   注册进工具箱：地点 + 情境 + 选项 + 结果，每次抽签随机一条，结果会尝试影响
   游戏内 G 的心情/学业/金钱（若存在），否则只展示。约 80 条校园真实事件。
   ============================================================================ */
register("encounters-565", function () {
  var T = window.X565TOOLS = window.X565TOOLS || {};
  var XZ13 = window.XZ13 || null;
  function showModal(html) {
    if (XZ13 && typeof XZ13.modal === "function") XZ13.modal(html);
    else if (typeof window.modal === "function") window.modal(html);
  }
  function eff(fx) {
    try {
      if (!fx || typeof G === "undefined" || !G) return;
      if (fx.mood) G.mood = (G.mood || 0) + fx.mood;
      if (fx.academic) G.academic = (G.academic || 0) + fx.academic;
      if (fx.grade) G.grade = (G.grade || 0) + fx.grade;
      if (fx.health) G.health = (G.health || 0) + fx.health;
      if (fx.money) G.money = (G.money || 0) + fx.money;
      if (typeof clampAll === "function") clampAll();
      if (typeof upd === "function") upd();
    } catch (e) {}
  }
  function E(loc, icon, text, opts) { return { loc: loc, icon: icon, text: text, opts: opts }; }
  function O(label, out, fx) { return { label: label, out: out, fx: fx || null }; }

  var BANK = [
    E("教室", "📚", "早自习前，同桌小声问你：数学作业最后一道大题写了吗？我昨晚卡住了。",
      [O("把解题思路讲给他听", "你认真讲了一遍，对方恍然大悟，你也把知识点巩固了。", { academic: 1, mood: 2 }),
        O("直接把本子递过去", "他抄得飞快，你心里有点过意不去，下次还是讲给他听吧。", { mood: 0 }),
        O("我也没写", "你们俩对视一眼，决定早自习一起问课代表。", { mood: 1 })]),
    E("走廊", "🏃", "下课铃响，走廊里人潮涌动，你看到前面同学的校牌掉在地上。",
      [O("捡起来追上去还", "对方连声道谢，你心里暖暖的。", { mood: 3 }),
        O("喊一声提醒", "他回头捡起，冲你比了个赞。", { mood: 2 })]),
    E("操场", "🏀", "体育课自由活动，一群男生在打半场，少一个人，有人冲你招手。",
      [O("加入他们", "你跑了几个来回，出了一身汗，交到了新朋友。", { mood: 4, health: 2 }),
        O("在看台看书", "你安静地看了会儿书，微风正好。", { academic: 1, mood: 1 })]),
    E("食堂", "🍜", "今天有你最爱的糖醋里脊，但队伍排得很长，眼看下一个窗口就要卖光。",
      [O("老实排队", "你排到了，阿姨给你打了满满一勺，值得。", { mood: 2 }),
        O("找熟人拼队", "你在同学前面蹭到了位置，有点不好意思。", { mood: 1 })]),
    E("图书馆", "📖", "你在图书馆找资料，一本你想看很久的书正被人拿在手里。",
      [O("等对方看完再借", "你在旁边安静自习，半小时后顺利借到。", { academic: 1, mood: 1 }),
        O("去预约登记", "你登记了预约，工作人员说会帮你留。", { mood: 0 })]),
    E("小卖部", "🧋", "小卖部冰柜前，你发现只剩最后一瓶冰红茶。",
      [O("让给身后的同学", "同学很感动，第二天还了一瓶新的给你。", { mood: 3 }),
        O("果断拿下", "冰爽的一口，驱散了午后的困意。", { mood: 2 })]),
    E("宿舍", "🛏️", "熄灯后，室友还在小声讨论一道没解出的物理题。",
      [O("一起讨论到搞懂", "你灵机一动解出了关键，大家安心睡去。", { academic: 2, mood: 2 }),
        O("提醒大家早点睡", "你们决定明天问老师，保证了睡眠。", { health: 1 })]),
    E("校门口", "🚪", "放学时，一位老人在校门口问路，说要找附近的社区医院。",
      [O("亲自带他过去", "你绕了点路，老人一直道谢，你心里很踏实。", { mood: 4 }),
        O("指给他详细路线", "他明白了方向，连说谢谢。", { mood: 2 })]),
    E("教室", "✏️", "值日生擦黑板时，发现粉笔灰落到了前排同学的本子上。",
      [O("主动帮忙收拾", "你帮着重新整理，同学很感激。", { mood: 2 }),
        O("提醒值日生小心", "他道了歉，动作轻了下来。", { mood: 1 })]),
    E("操场", "🏃", "体测前，你发现自己的运动鞋鞋带松了，旁边同学提醒你。",
      [O("认真系好再跑", "你稳稳跑完，成绩比上次好。", { health: 1, mood: 2 }),
        O("没在意直接跑", "跑到一半差点绊倒，吓出一身汗。", { mood: -1 })]),
    E("音乐教室", "🎹", "午休路过音乐教室，里面传出断断续续的琴声，弹错了又重来。",
      [O("在门口安静听完", "你听到最后一遍终于流畅，忍不住鼓掌。", { mood: 3 }),
        O("不去打扰，轻轻走开", "你给了对方独自练习的空间。", { mood: 1 })]),
    E("美术教室", "🎨", "美术教室里，一位同学对着画了一半的水彩发呆，似乎不满意。",
      [O("鼓励她并给点建议", "她试着调整，画面一下子有了层次。", { mood: 3 }),
        O("递上一块橡皮", "她笑着接过，重新画了起来。", { mood: 2 })]),
    E("食堂", "🍲", "阿姨打菜时，你发现自己饭卡余额不够，还差一块钱。",
      [O("找同学借一下", "同学爽快帮你刷了，你记着明天还。", { mood: 1 }),
        O("退回一个菜", "你点了份更便宜的，刚刚好。", { mood: 0 })]),
    E("走廊", "🌧️", "突然下起大雨，你在走廊看见一位同学望着雨发呆，没带伞。",
      [O("把多余的伞借给他", "他连声道谢，雨停后把伞送了回来。", { mood: 4 }),
        O("邀他一起撑伞", "你们挤在一把伞下，多了个朋友。", { mood: 3 })]),
    E("教室", "📝", "月考卷发下来，你发现有道题老师多扣了分。",
      [O("下课礼貌地找老师核实", "老师核对后加回了分，还夸你细心。", { mood: 2, grade: 1 }),
        O("算了，不麻烦", "你把这道题彻底弄懂，下次不亏。", { academic: 1 })]),
    E("操场", "🏅", "运动会报名，体委问你要不要试试 4×100 接力。",
      [O("报名并认真训练", "你和队友配合默契，班级拿了名次。", { mood: 4, health: 2 }),
        O("当后勤给同学加油", "你送水拍照，也乐在其中。", { mood: 2 })]),
    E("图书馆", "📚", "自习时，你发现邻座同学的杯子没盖，差点洒到一摞书上。",
      [O("轻轻提醒他", "他及时盖好，冲你感激地笑笑。", { mood: 2 }),
        O("把自己的书挪开", "你避免了一场意外。", { mood: 1 })]),
    E("教室", "😴", "下午第一节课，你困得睁不开眼，头一点一点的。",
      [O("举手请求去洗把脸", "冷水一冲，你清醒了许多。", { health: 1 }),
        O("掐自己坚持做笔记", "你撑住了，笔记记得很全。", { academic: 1 })]),
    E("小卖部", "🍪", "你在小卖部捡到一个鼓鼓的钱包。",
      [O("送到广播室招领", "失主是位老师，特意来班里道谢。", { mood: 5 }),
        O("交给保安大叔", "你做了正确的事。", { mood: 3 })]),
    E("校门口", "🚲", "早上骑车上学，你看到一位同学的车链子掉了，正蹲在路边着急。",
      [O("停下帮他装回", "你弄脏了手，却没耽误多久，一起赶去早读。", { mood: 4 }),
        O("提醒他去修车铺", "他道谢后推着车走了。", { mood: 1 })]),
    E("教室", "🎒", "快上课了，你发现自己把课本落在了宿舍。",
      [O("和同桌共用一本", "同桌大方地把书放中间，你顺利跟上。", { mood: 1 }),
        O("跑去别的班借", "你气喘吁吁赶回来，没被老师发现。", { mood: 0 })]),
    E("操场", "🌅", "晚自习前，你在操场散步，看到夕阳特别好看。",
      [O("停下来静静看完", "你给紧绷的一天松了绑。", { mood: 4 }),
        O("拍下来发给朋友", "你们一起分享了这片晚霞。", { mood: 3 })]),
    E("食堂", "🍚", "同桌吃饭时，你发现新来的同学一个人坐着，有点局促。",
      [O("端着餐盘过去坐", "你们聊了起来，新同学很快融入。", { mood: 4 }),
        O("邀请他加入你们桌", "他松了口气，加入了大家的话题。", { mood: 3 })]),
    E("教室", "💧", "课间，你帮老师搬一摞作业本，差点抱不住。",
      [O("请同学搭把手", "两个人轻松搬完，老师笑着道谢。", { mood: 2 }),
        O("硬着头皮自己搬", "你踉踉跄跄送到了办公室。", { mood: 1 })]),
    E("机房", "💻", "信息课上，你的电脑突然蓝屏，作业还没保存。",
      [O("举手请老师帮忙", "老师帮你恢复了一部分，你也养成随时保存的习惯。", { academic: 1 }),
        O("凭记忆重做", "重做一遍反而更熟练了。", { academic: 1 })]),
    E("实验室", "🧪", "化学实验时，同组同学紧张得不敢点酒精灯。",
      [O("示范并鼓励他", "你按步骤示范，他也成功完成了。", { academic: 2, mood: 2 }),
        O("和他交换，你来点", "实验顺利完成。", { academic: 1 })]),
    E("教室", "📱", "上课前，有人的手机在课桌里嗡嗡震动，是忘静音了。",
      [O("提醒对方快静音", "他连忙关掉，避免了被没收。", { mood: 1 }),
        O("装作没听见", "老师已经看了过来，有点尴尬。", { mood: -1 })]),
    E("花园", "🐱", "小花园里，一只流浪猫围着你转，看起来饿了。",
      [O("把随身的面包分给它", "它吃得很开心，成了你的“校猫朋友”。", { mood: 3 }),
        O("只是轻轻摸摸它", "它眯起眼睛，很享受。", { mood: 2 })]),
    E("宿舍", "🧺", "回南天，你晾的衣服两天没干，室友也一样。",
      [O("一起想办法通风", "你们把衣服挪到通风处，干得快多了。", { mood: 2 }),
        O("借吹风机应急", "室友帮你一起吹干。", { mood: 2 })]),
    E("教室", "📖", "班会课，老师问谁愿意上台做学习经验分享。",
      [O("鼓起勇气上台", "你分享了方法，也收获了掌声和自信。", { mood: 4, academic: 1 }),
        O("认真听别人的分享", "你记下了几条好方法。", { academic: 1 })]),
    E("操场", "🤕", "打球时，有同学不小心扭伤了脚，坐在地上。",
      [O("立刻扶他去医务室", "你陪他处理好伤口，还帮他请假。", { mood: 4 }),
        O("喊老师来帮忙", "老师很快赶到，处理得当。", { mood: 2 })]),
    E("教室", "📰", "后黑板报轮到你们组，主题是“安全教育”，大家没头绪。",
      [O("你牵头分工设计", "板报完成得漂亮，老师表扬了你们。", { mood: 3, academic: 1 }),
        O("负责最擅长的部分", "你把标题写得很出彩。", { mood: 2 })]),
    E("广播站", "📢", "广播站征集点歌，你想给一个人点首歌。",
      [O("给好友点一首加油的歌", "好友听到后很感动，回了消息。", { mood: 3 }),
        O("给自己点一首放松的歌", "傍晚的旋律让你轻松了不少。", { mood: 2 })]),
    E("食堂", "🍗", "打菜阿姨手一抖，给你多舀了一块排骨。",
      [O("笑着道谢", "今天的午餐格外满足。", { mood: 2 }),
        O("把多的分给同学", "大家一起吃得很开心。", { mood: 2 })]),
    E("教室", "🧮", "数学公开课，老师提了一个有难度的问题，全班安静。",
      [O("举手尝试回答", "你答得不全对，老师肯定了你的思路。", { mood: 3, academic: 1 }),
        O("在草稿纸上认真推", "你算出了一半，下课后继续攻克。", { academic: 1 })]),
    E("走廊", "🚪", "你看到一位同学抱着一大摞书，书摇摇欲坠。",
      [O("上前帮忙分担一半", "你帮他送到办公室，他连声道谢。", { mood: 3 }),
        O("帮他扶了一下", "书稳住了，他朝你点头致意。", { mood: 2 })]),
    E("教室", "🎂", "今天是你的生日，课间大家却好像都不记得。",
      [O("照常认真上课", "放学时，同学突然拿出小蛋糕，原来在准备惊喜。", { mood: 6 }),
        O("有点小失落", "晚自习后同桌递来一颗糖：生日快乐。", { mood: 3 })]),
    E("操场", "🥤", "比赛结束后，你看到一位同学独自收拾场地的矿泉水瓶。",
      [O("留下来一起捡", "你们很快收拾完，老师看在眼里。", { mood: 3 }),
        O("去拿垃圾袋帮忙", "你帮他分担了一半。", { mood: 2 })]),
    E("图书馆", "🤫", "图书馆里有人一直在小声讲话，影响到别人。",
      [O("礼貌地递个纸条提醒", "对方不好意思地安静了。", { mood: 2 }),
        O("换个座位继续自习", "你用平和的方式解决了问题。", { mood: 1 })]),
    E("教室", "📝", "英语听写前，你发现自己有几个单词没把握。",
      [O("课间抓紧再过一遍", "听写时你正好写到了，很有成就感。", { academic: 1, mood: 2 }),
        O("找同学互相抽查", "你们互相提醒，记得更牢。", { academic: 1 })]),
    E("校门口", "🌧️", "放学突然降温，你看到有同学穿得很单薄。",
      [O("把备用外套借给他", "你自己快步回家，心里暖暖的。", { mood: 4 }),
        O("提醒他下次看天气", "他感激地点点头。", { mood: 1 })]),
    E("食堂", "🥘", "今天新开了麻辣香锅窗口，你纠结要不要点。",
      [O("点不辣的试试", "味道不错，还照顾了肠胃。", { mood: 2 }),
        O("点微辣挑战一下", "你被辣得直吸气，却大呼过瘾。", { mood: 2 })]),
    E("教室", "📋", "班长征集人去帮学生会搬活动物资。",
      [O("主动举手去", "你搬了几趟，认识了学生会的人。", { mood: 3, health: 1 }),
        O("留着先完成作业", "你把作业按时写完。", { academic: 1 })]),
    E("音乐教室", "🎤", "校园歌唱比赛报名，同学问你要不要组队。",
      [O("组队一起练", "你们配合越来越好，台上很享受。", { mood: 4 }),
        O("做台下的应援", "你为他们加油，一样开心。", { mood: 2 })]),
    E("操场", "🏃", "晨跑时，你前面的同学体力不支，慢了下来。",
      [O("陪他放慢速度一起跑完", "你帮他坚持完了全程。", { mood: 4, health: 1 }),
        O("按自己节奏跑完", "你完成了自己的目标。", { health: 1 })]),
    E("教室", "🌡️", "班里的空调遥控器坏了，同学们冷得直哆嗦。",
      [O("去找后勤报修", "师傅很快修好，全班都感谢你。", { mood: 3 }),
        O("帮大家先关好门窗", "教室里暖和了一些。", { mood: 2 })]),
    E("食堂", "💰", "你在食堂地上捡到一张饭卡。",
      [O("送到失物招领处", "失主很快找到，还特意买了饮料谢你。", { mood: 4 }),
        O("交给窗口阿姨", "你做了该做的事。", { mood: 2 })]),
    E("教室", "📊", "学习小组分工，没人愿意做整理汇总的活儿。",
      [O("你接下汇总", "你借机把知识点梳理了一遍，收获很大。", { academic: 2, mood: 1 }),
        O("和大家轮流承担", "你们分工合理，效率很高。", { academic: 1 })]),
    E("花园", "🍂", "秋天的银杏叶落了一地，你看到有人在做落叶书签。",
      [O("一起做一片书签", "你做了一片送给同桌，他很喜欢。", { mood: 3 }),
        O("捡几片最完整的做标本", "你收获了一份小小的秋天。", { mood: 2 })]),
    E("教室", "⏰", "午休结束铃响，同桌还趴着没醒。",
      [O("轻轻叫醒他", "他没错过下节课的小测，很感激你。", { mood: 2 }),
        O("让老师来叫", "你专心准备上课的书。", { mood: 0 })]),
    E("操场", "🏐", "体育课排球对垫，你和搭档总是垫不到三个。",
      [O("停下来调整姿势再练", "你们慢慢找到节奏，越垫越多。", { health: 1, mood: 2 }),
        O("互相打气别气馁", "你们笑着继续，最后垫到了十个。", { mood: 3 })]),
    E("教室", "📚", "你在课桌里发现上届学长留下的一本整理得极好的笔记。",
      [O("认真参考并好好保管", "你的复习效率高了很多。", { academic: 2 }),
        O("交给老师找失主", "你做了诚实的选择。", { mood: 2 })]),
    E("校门口", "📦", "快递站排队很长，你前面同学抱着好几个箱子。",
      [O("帮他搬一个到门口", "你们一边搬一边聊天，没觉得队伍久。", { mood: 3 }),
        O("安静排队看会儿书", "你利用碎片时间背了单词。", { academic: 1 })]),
    E("教室", "💌", "你在抽屉里发现一张没署名的纸条，字迹工整。",
      [O("收好，先专注上课", "你没有被打扰，保持了自己的节奏。", { academic: 1 }),
        O("礼貌地不予回应", "你把心思放在学习上。", { mood: 1 })]),
    E("食堂", "🍚", "有同学因为没带饭卡，端着餐盘站在窗口前很尴尬。",
      [O("帮他刷卡", "他答应明天一定还你，你说不急。", { mood: 3 }),
        O("提醒他去充值处", "他这才想起可以临时登记。", { mood: 1 })]),
    E("实验室", "🔬", "显微镜下，你怎么都调不出清晰的细胞。",
      [O("请老师示范", "你学会了调焦，看到了清晰的细胞。", { academic: 2 }),
        O("和同学一起摸索", "你们互相尝试，终于成功。", { academic: 1 })]),
    E("教室", "🌙", "晚自习突然停电，教室里一片骚动。",
      [O("稳住大家，用手电照明", "你组织大家安静等待，避免了混乱。", { mood: 3 }),
        O("趁空档休息眼睛", "来电后大家状态更好。", { health: 1 })]),
    E("操场", "🥇", "跑步比赛，最后一名的同学被远远甩开。",
      [O("在终点为他大声加油", "他坚持跑完了，眼里有光。", { mood: 4 }),
        O("陪他一起冲过终点", "他记住了你的这份善意。", { mood: 5 })]),
    E("教室", "🖊️", "你最常用的那支笔突然没水了，马上要考试。",
      [O("向同桌借一支", "同桌正好有备用，化险为夷。", { mood: 1 }),
        O("多备一支放笔袋", "以后你再没被难住过。", { mood: 1 })]),
    E("小卖部", "🧃", "你想买水，发现有同学买了一大箱饮料，搬不动。",
      [O("帮他搬到教室", "你分了一半重量，顺利送达。", { mood: 3 }),
        O("建议他分两次搬", "他接受了建议，没闪到腰。", { mood: 1 })]),
    E("教室", "📖", "语文老师让大家轮流朗诵一段课文。",
      [O("字正腔圆地读完", "你获得了表扬，也更自信了。", { mood: 3, academic: 1 }),
        O("小声地读完", "你完成了挑战，下次再大胆些。", { mood: 1 })]),
    E("图书馆", "📅", "你在图书馆看到校园读书节的报名海报。",
      [O("报名读书分享", "你认真读完一本书并做了分享，收获良多。", { academic: 2, mood: 2 }),
        O("记下时间先去看看", "你保持了好奇。", { mood: 1 })]),
    E("食堂", "🥢", "你发现邻桌同学把筷子掉在了地上。",
      [O("帮他去窗口拿双新的", "他连声道谢，你们聊了起来。", { mood: 2 }),
        O("提醒他去换新", "他顺利拿到了新筷子。", { mood: 1 })]),
    E("教室", "📋", "你被安排和一个不太熟的同学一起做值日。",
      [O("主动分工，多干一点", "你们配合默契，很快干完，还成了朋友。", { mood: 3 }),
        O("按部就班完成", "教室干净整洁，任务完成。", { mood: 1 })]),
    E("操场", "🌦️", "体育课时下了点小雨，老师让大家决定是否继续。",
      [O("带大家做室内拉伸", "你提了个好主意，全班没有浪费这节课。", { mood: 2, health: 1 }),
        O("在走廊上看书", "你安静地复习了一节课。", { academic: 1 })]),
    E("教室", "🎒", "你的同桌今天看起来情绪很低落，话很少。",
      [O("课间主动关心询问", "他说出了烦恼，你陪他聊了很久。", { mood: 4 }),
        O("悄悄递张纸条鼓励", "他回了个笑脸，情绪好了些。", { mood: 3 })]),
    E("机房", "⌨️", "打字比赛，你的速度跟不上，着急。",
      [O("课后找软件练习", "几周后你的打字速度明显提高。", { academic: 1, mood: 2 }),
        O("向同学请教指法", "你纠正了二指禅，越来越快。", { academic: 1 })]),
    E("教室", "📝", "老师布置了一篇命题作文，你毫无灵感。",
      [O("去操场走走找灵感", "一阵风吹过，你想到了切入点。", { mood: 2, academic: 1 }),
        O("先列提纲再写", "你按结构一步步写，顺利完成。", { academic: 1 })]),
    E("校门口", "🐕", "上学路上有只小狗一直跟着你，看起来是走丢的。",
      [O("把它交给附近的保安", "你没有迟到，小狗也有了着落。", { mood: 3 }),
        O("拍下来发寻宠启事", "你为它多争取了一份希望。", { mood: 2 })]),
    E("食堂", "🍜", "你排队时，后面的同学不小心把汤洒了一点在你袖子上。",
      [O("说没关系，自己去擦", "对方很感激你的大度，成了朋友。", { mood: 3 }),
        O("提醒他下次小心", "你平和地处理了这件事。", { mood: 1 })]),
    E("教室", "🏆", "班级评优，需要有人准备一份展示 PPT。",
      [O("你揽下并认真做", "展示很成功，班级拿了流动红旗。", { mood: 4, academic: 1 }),
        O("和同学合作完成", "你们分工明确，效果不错。", { mood: 2 })]),
    E("音乐教室", "🎶", "社团排练少一个人，社长问你能不能顶上。",
      [O("硬着头皮上", "你完成了演出，还发现了自己的潜能。", { mood: 4 }),
        O("帮忙做后勤", "你为团队出了力。", { mood: 2 })]),
    E("操场", "🌙", "晚自习后，你看到有人还在操场练跑步。",
      [O("陪他跑两圈，给他计时", "他突破了个人最好成绩。", { mood: 3, health: 1 }),
        O("在看台给他加油", "他很受鼓舞。", { mood: 2 })]),
    E("教室", "📚", "整理书架时，你发现班里少了几本公共图书。",
      [O("登记并贴出寻书启事", "几天后书都被悄悄还回来了。", { mood: 2 }),
        O("重新整理编号", "书架从此井井有条。", { mood: 1 })]),
    E("小卖部", "🍦", "天很热，你和同学都想买冰淇淋，只剩最后一支。",
      [O("让给同学", "你把清凉让给了他，他记住了这份好。", { mood: 4 }),
        O("一人一半", "你们分着吃，甜到心里。", { mood: 3 })]),
    E("教室", "📝", "老师临时让你负责收齐全班的实践作业。",
      [O("做个清单逐项核对", "你一份不差地收齐，效率很高。", { mood: 2, academic: 1 }),
        O("请小组长帮忙", "你们分工协作，顺利完成。", { mood: 2 })]),
    E("花园", "🌷", "你在小花园背英语，发现环境安静，记忆特别快。",
      [O("把这里当成固定背书点", "你在这里背完了好几单元。", { academic: 2, mood: 2 }),
        O("多待一会儿享受安静", "你放松了大脑。", { mood: 2 })]),
    E("教室", "✏️", "同桌的尺子断了，画图题没法做。",
      [O("把备用尺借给他", "他顺利完成了作图。", { mood: 2 }),
        O("和他共用一把", "你们轮流使用，都做完了。", { mood: 1 })]),
    E("校门口", "🕐", "你卡点到校，眼看就要关上校门。",
      [O("加快脚步冲进去", "你在关门前一刻赶到，没迟到。", { mood: 1 }),
        O("从明天起提前十分钟", "你吸取教训，之后再没卡点。", { mood: 1, academic: 1 })]),
    E("食堂", "🍚", "你发现今天的菜有点咸，吃了几口就不想吃了。",
      [O("去窗口买碗例汤", "汤和着饭，你吃得刚刚好。", { mood: 1 }),
        O("买点水果补充", "你照顾了自己的胃口。", { health: 1 })]),
    E("教室", "🎨", "学校征集校园文化节的 LOGO 设计。",
      [O("画一稿投上去", "你的设计被选中，印在了海报上。", { mood: 5, academic: 1 }),
        O("帮同学的设计出主意", "你们的作品一起入选。", { mood: 3 })]),
    E("操场", "🧘", "压力大的一天，你在操场看台上坐着，不想动。",
      [O("做几个深呼吸放松", "你慢慢平复了情绪，重新有了力气。", { mood: 3, health: 1 }),
        O("约朋友来聊聊天", "把烦恼说出来，你轻松多了。", { mood: 4 })]),
    E("教室", "📋", "老师让大家匿名写下对班级的建议。",
      [O("认真提出可行的建议", "你提的增设图书角被采纳，大家受益。", { mood: 3, academic: 1 }),
        O("写下对同学的肯定", "这份匿名表扬让很多人开心。", { mood: 3 })]),
    E("机房", "🐛", "信息课作业你按要求做完了，但程序一直报错。",
      [O("一行行排查，发现是括号问题", "你靠自己找到了 bug，特别有成就感。", { academic: 2, mood: 3 }),
        O("请同学一起看", "你们结对解决，都学到了。", { academic: 1 })]),
    E("教室", "🌧️", "下雨的课间，大家没法出去玩，有些躁动。",
      [O("组织大家玩词语接龙", "教室里笑声不断，课间也很充实。", { mood: 3 }),
        O("安静看书或预习", "你利用好了这段时间。", { academic: 1 })]),
    E("宿舍", "🧴", "宿舍的热水卡没钱了，室友都急着洗澡。",
      [O("把自己的卡借出去", "你帮大家解了燃眉之急。", { mood: 3 }),
        O("陪室友去充值", "你们很快解决了问题。", { mood: 2 })]),
    E("教室", "📚", "老师宣布下周要进行一次综合性的学习竞赛。",
      [O("制定计划系统复习", "你准备充分，取得了不错的成绩。", { academic: 2, mood: 2 }),
        O("和同学组队备战", "你们互相讲题，进步都很快。", { academic: 1, mood: 2 })]),
    E("食堂", "🍱", "食堂推出“光盘行动”，吃完可领一个小水果。",
      [O("按需打菜，光盘领水果", "你既不浪费又有奖励。", { mood: 2, health: 1 }),
        O("提醒同学少打一点", "你们一起加入了光盘行动。", { mood: 2 })]),
    E("教室", "🖋️", "你的作业被老师评为范本，要在班上展示。",
      [O("大方分享你的笔记方法", "你帮到了同学，也巩固了自己。", { mood: 4, academic: 1 }),
        O("有点不好意思地收下", "你获得了继续努力的动力。", { mood: 3 })]),
    E("操场", "🎈", "文化节布置现场，需要有人负责气球和拱门。",
      [O("接下布置，认真忙活", "现场效果很好，你充满了成就感。", { mood: 4 }),
        O("帮忙打下手", "你为活动出了一份力。", { mood: 2 })]),
    E("教室", "📝", "午休时你发现黑板上还留着上节课的板书。",
      [O("主动帮忙擦干净", "下节课老师进来时很舒心。", { mood: 2 }),
        O("提醒值日生来擦", "黑板及时清理，没耽误上课。", { mood: 1 })]),
    E("图书馆", "🔖", "你在归还的书里发现夹着一张精致的书签。",
      [O("交给图书馆老师", "失主找回来时特别高兴。", { mood: 3 }),
        O("夹回原处留个便签", "你温柔地处理了这件小事。", { mood: 2 })]),
    E("教室", "🧋", "同桌课间帮你带了一杯奶茶，说是感谢你上次讲题。",
      [O("开心收下并道谢", "你们的友谊又近了一步。", { mood: 4 }),
        O("说好下次你请", "你来我往，关系更好了。", { mood: 3 })]),
    E("操场", "🏀", "你的篮球气不足，打不起来。",
      [O("去器材室借打气筒", "你把球打足，还帮同学也打了。", { mood: 2 }),
        O("换一个球打", "你没有耽误活动。", { mood: 1 })]),
    E("教室", "📖", "放学了，你发现教室里有同学落下了一串钥匙。",
      [O("送到失物招领处", "失主第二天顺利取回，没有回不了家。", { mood: 4 }),
        O("交给班主任保管", "你做了稳妥的处理。", { mood: 2 })]),
    E("教室", "🧠", "一道难题你想了很久，突然灵光一闪。",
      [O("马上把思路完整写下来", "你解出了难题，兴奋不已。", { academic: 2, mood: 4 }),
        O("和同学分享解法", "你讲得清楚，大家都懂了。", { academic: 2, mood: 2 })]),
    E("食堂", "🍵", "降温了，你看到食堂有免费的热姜茶。",
      [O("帮同桌也带一杯", "你和同桌都暖了身子。", { mood: 3, health: 1 }),
        O("自己喝一杯暖身", "你抵御了寒冷。", { health: 1 })]),
    E("教室", "📅", "新学期班干部竞选，你有些心动。",
      [O("勇敢上台竞选", "你当选了，也锻炼了自己。", { mood: 5, academic: 1 }),
        O("先从小组长做起", "你用踏实的方式积累。", { mood: 2 })]),
    E("操场", "🌬️", "运动会彩排，天气很热，有人中暑迹象。",
      [O("立刻扶他到阴凉处并报告", "你反应迅速，避免了意外。", { mood: 4 }),
        O("递水并让他坐下", "他缓了过来，很感谢你。", { mood: 3 })]),
    E("教室", "📝", "早读背诵，你发现自己总是背了又忘。",
      [O("用分段法和艾宾浩斯表", "你掌握了记忆方法，效率大增。", { academic: 2, mood: 2 }),
        O("和同学互相抽查", "你在对话中记得更牢。", { academic: 1 })]),
    E("教室", "🪟", "刮大风，教室的窗户没关严，作业本被吹乱。",
      [O("起身关好窗并整理", "你避免了大家的作业被吹走。", { mood: 2 }),
        O("提醒靠窗的同学", "窗户关好了。", { mood: 1 })]),
    E("小卖部", "🎒", "你在小卖部排队，前面的人忘带钱包，正尴尬。",
      [O("帮他垫付这几块钱", "他第二天加倍还你，还成了朋友。", { mood: 3 }),
        O("让他先回去拿", "你没有责备他。", { mood: 1 })]),
    E("教室", "📊", "学习小组讨论，你有一个和大家不同的思路。",
      [O("大胆说出自己的想法", "你的思路反而更简洁，获得大家认可。", { mood: 4, academic: 2 }),
        O("先验证再分享", "你确认无误后提出，很有说服力。", { academic: 1, mood: 2 })]),
    E("花园", "🌻", "你在花园里发现一株向日葵朝着阳光开得正好。",
      [O("用它做素材写篇小作文", "你写出了一篇生动的短文。", { academic: 1, mood: 3 }),
        O("安静欣赏片刻", "这份美好让你心情明亮。", { mood: 3 })])
  ];

  var idxCursor = -1;
  function draw(avoid) {
    var i = Math.floor(Math.random() * BANK.length);
    if (BANK.length > 1 && i === avoid) return draw(avoid);
    return i;
  }
  function showCard(i) {
    var c = BANK[i];
    var optsHtml = c.opts.map(function (o, k) {
      return '<button class="gbtn gencOpt" data-k="' + k + '" style="display:block;width:100%;margin:8px 0;text-align:left;padding:12px;font-size:15px">' +
        "▸ " + o.label + "</button>";
    }).join("");
    showModal(
      '<div id="tEncRoot" style="max-width:440px;margin:0 auto">' +
      '<h3>🎲 校园奇遇簿</h3>' +
      '<div class="dim small" style="margin-bottom:6px">📍 ' + c.loc + " " + c.icon + " · 已抽 " + (window.X565 ? "（随机）" : "") + "</div>" +
      '<div style="background:rgba(127,209,174,.12);border-radius:12px;padding:14px;font-size:15px;line-height:1.8;margin-bottom:8px">' + c.text + "</div>" +
      '<div id="tEncOpts">' + optsHtml + "</div>" +
      '<div id="tEncOut" style="display:none"></div>' +
      '<div class="xz13-save-bar" style="justify-content:center;margin-top:8px">' +
        '<button class="xz13-save-ss-btn" id="tEncAgain" style="display:none">再抽一签</button>' +
        '<button class="xz13-save-ss-btn" onclick="closeModal()">退出</button>' +
      "</div></div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".gencOpt"), function (b) {
      b.onclick = function () {
        var o = c.opts[parseInt(b.getAttribute("data-k"), 10)];
        if (o.fx) eff(o.fx);
        var box = document.getElementById("tEncOpts"); if (box) box.style.display = "none";
        var out = document.getElementById("tEncOut");
        if (out) {
          out.style.display = "block";
          out.innerHTML = '<div style="background:rgba(110,160,236,.12);border-left:4px solid #6ea0ec;border-radius:8px;padding:12px;font-size:15px;line-height:1.8">' + o.out + "</div>";
        }
        var again = document.getElementById("tEncAgain");
        if (again) {
          again.style.display = "inline-block";
          again.onclick = function () { showCard(draw(i)); };
        }
      };
    });
  }
  T.encounter = {
    BANK: BANK,
    add: function (cards) { BANK.push.apply(BANK, cards); },
    open: function () { showCard(draw(-1)); }
  };

  /* 注册进工具箱 */
  try {
    if (window.XZ13 && window.XZ13.TOOLS) {
      window.XZ13.TOOLS.push({ icon: "🎲", name: "校园奇遇簿", call: "X565TOOLS.encounter.open()" });
    }
  } catch (e) {}
});


/* ===== p74_encounters2.js ===== */
/* ============================================================================
   p74 · 校园奇遇簿（第二批 60 条），追加进 p73 的 BANK
   ============================================================================ */
register("encounters2-565", function () {
  var T = window.X565TOOLS = window.X565TOOLS || {};
  if (!T.encounter || !T.encounter.add) return;
  function E(loc, icon, text, opts) { return { loc: loc, icon: icon, text: text, opts: opts }; }
  function O(label, out, fx) { return { label: label, out: out, fx: fx || null }; }
  var B = [
    E("教室", "🧹", "轮到你值日，黑板擦得很干净，可讲台下还堆着几个空瓶子。",
      [O("顺手捡起来扔掉", "教室彻底整洁了，老师走进来心情很好。", { mood: 2 }),
        O("提醒下一组同学", "瓶子被收走了，卫生检查没扣分。", { mood: 1 })]),
    E("操场", "🥅", "你在操场边捡到一个遗落的足球。",
      [O("送到体育器材室", "你物归原主，还在登记本上留了名字。", { mood: 3 }),
        O("先踢着等失主", "你玩了一会儿，失主找来后道谢。", { mood: 2, health: 1 })]),
    E("食堂", "🧂", "你发现今天的汤没放盐，淡得没味道。",
      [O("礼貌地向窗口反映", "阿姨重新调味，后面的同学都喝到了好汤。", { mood: 2 }),
        O("自己加点盐将就", "你平静地解决了午餐。", { mood: 0 })]),
    E("图书馆", "📚", "你想借的书在最高一层，够不到。",
      [O("去找取书梯", "你稳稳取到书，还帮旁边同学也拿了一本。", { mood: 2 }),
        O("请高个子同学帮忙", "他笑着帮你取下。", { mood: 1 })]),
    E("教室", "🎈", "班委在准备同学生日会，偷偷摸摸不让主角知道。",
      [O("帮忙打掩护", "你成功把同学引开，惊喜派对顺利举行。", { mood: 4 }),
        O("帮忙布置气球", "教室被你布置得很有氛围。", { mood: 3 })]),
    E("走廊", "🧊", "走廊饮水机前排着长队，快上课了。",
      [O("让赶时间的同学先接", "你晚到一点点，却帮他没迟到。", { mood: 3 }),
        O("忍住渴先去上课", "你按时进了教室，下课再喝。", { mood: 1 })]),
    E("机房", "🖱️", "你旁边的同学鼠标坏了，急得直跺脚。",
      [O("把备用鼠标借给他", "他顺利完成了当堂练习。", { mood: 2 }),
        O("帮他找老师换一个", "问题很快解决。", { mood: 1 })]),
    E("实验室", "🥽", "实验前你发现护目镜数量不够。",
      [O("主动把自己的让给同学", "你等下一批，安全第一。", { mood: 2 }),
        O("去隔壁实验室借", "你及时借来了护目镜。", { mood: 2 })]),
    E("花园", "🐦", "你看见一只小鸟落在地上，似乎飞不起来。",
      [O("小心地送去校医室", "你没有惊扰它，交给了能帮忙的人。", { mood: 4 }),
        O("在一旁看着，不让人靠近", "它缓了一会儿，自己飞走了。", { mood: 3 })]),
    E("宿舍", "🔑", "宿舍同学忘带钥匙，全寝室的人都进不去。",
      [O("去找宿管阿姨", "你顺利登记拿到了备用钥匙。", { mood: 2 }),
        O("陪大家在门口等", "你讲了几个笑话，等待没那么难熬。", { mood: 2 })]),
    E("教室", "📝", "你的笔芯在考试前突然用完了。",
      [O("提前备好一整盒", "你不仅自己够用，还帮了别人。", { mood: 2 }),
        O("向前后桌借", "同学及时递给你一支。", { mood: 1 })]),
    E("操场", "🤸", "课间操时，你前面的同学动作总是慢半拍。",
      [O("小声提醒他节拍", "他慢慢跟上了，还冲你道谢。", { mood: 2 }),
        O("认真做自己的", "你锻炼得很到位。", { health: 1 })]),
    E("小卖部", "🍞", "早读前你饿了，可小卖部只剩最后一个面包。",
      [O("买下来分给没吃早饭的同桌", "你们一人一半，都没饿着。", { mood: 3, health: 1 }),
        O("自己买了补充能量", "你保证了一上午的精神。", { health: 1 })]),
    E("教室", "🌡️", "班里有人发烧，脸红红的还在坚持。",
      [O("陪他去医务室", "你帮他请假，他得到了及时休息。", { mood: 4 }),
        O("给他倒杯温水并报告老师", "你尽了同学的关心。", { mood: 2 })]),
    E("图书馆", "🔇", "图书馆里有人的手机铃声突然大作。",
      [O("帮他指了指静音键", "他不好意思地赶紧关掉。", { mood: 1 }),
        O("继续专注看书", "你没被打扰太久。", { academic: 1 })]),
    E("食堂", "🍛", "新窗口推出盖浇饭，你在两种口味之间犹豫。",
      [O("试试没吃过的口味", "你发现了新的最爱。", { mood: 2 }),
        O("点常吃的稳妥口味", "你吃得心满意足。", { mood: 1 })]),
    E("教室", "📊", "小组课题汇报，组员都紧张得不敢上台。",
      [O("你第一个开口打头阵", "你带动了大家，汇报很顺利。", { mood: 4, academic: 1 }),
        O("给大家打气再一起上", "团队信心被你点燃。", { mood: 3 })]),
    E("走廊", "🖼️", "走廊的画框歪了，没人理会。",
      [O("停下来把它扶正", "路过的人看着整齐的画框，心情都好了。", { mood: 2 }),
        O("告诉后勤的同学", "画框很快被扶正。", { mood: 1 })]),
    E("操场", "🏸", "体育课羽毛球，你和同学只有一个好球拍。",
      [O("你先让给对方用", "你用备用拍也打得开心。", { mood: 2 }),
        O("轮流着打", "你们配合得很默契。", { mood: 2, health: 1 })]),
    E("教室", "📚", "老师让你把一摞作业本搬到办公室，路上下起小雨。",
      [O("用外套护住作业本", "本子没湿，你却有点凉。", { mood: 3 }),
        O("找了个袋子装好", "你聪明地保护了作业。", { mood: 2 })]),
    E("校门口", "🚍", "放学时校门口很堵，你看到一位同学被人群挤散。",
      [O("停下帮他捡起掉的东西", "你避免了东西被踩踏。", { mood: 3 }),
        O("提醒大家慢一点", "秩序好了一些。", { mood: 1 })]),
    E("音乐教室", "🎵", "合唱排练，你发现自己的声部总是跑调。",
      [O("课间单独找音频练习", "你渐渐找准了音准。", { academic: 1, mood: 2 }),
        O("向会唱的同学请教", "你得到了有用的技巧。", { academic: 1 })]),
    E("教室", "📖", "同桌把课本落在家了，下节课正好要用。",
      [O("和他共用你的课本", "你们一起跟上了课程。", { mood: 2 }),
        O("帮他去隔壁班借", "你帮他解了围。", { mood: 1 })]),
    E("花园", "🍃", "小花园的长椅上有同学落下的围巾。",
      [O("送到失物招领处", "失主在降温前找回了围巾。", { mood: 3 }),
        O("交给附近的老师", "围巾有了着落。", { mood: 2 })]),
    E("食堂", "🥢", "你看到阿姨一个人收拾餐桌很辛苦。",
      [O("主动端走自己的餐盘", "你减轻了阿姨的负担。", { mood: 2 }),
        O("还顺手帮同学一起端", "阿姨笑着连声道谢。", { mood: 3 })]),
    E("教室", "✏️", "你解出了一道全班都没做出来的难题。",
      [O("把方法分享给学习小组", "大家都听懂了，你也更熟练。", { academic: 2, mood: 3 }),
        O("举手讲给全班听", "你获得了老师的表扬。", { mood: 3, academic: 1 })]),
    E("操场", "🪁", "风很大，有同学在操场放风筝，线缠到了树上。",
      [O("帮忙找长杆把风筝挑下来", "你成功救下了风筝。", { mood: 3 }),
        O("建议找老师帮忙", "风筝被安全取下。", { mood: 1 })]),
    E("教室", "📅", "黑板角上的课程表褪色了，没人更新。",
      [O("重新抄写一份贴好", "全班都看得清楚，没人走错教室。", { mood: 2 }),
        O("提醒学习委员更新", "课程表很快补好。", { mood: 1 })]),
    E("宿舍", "🛏️", "宿舍卫生检查，室友的被子叠得不合格。",
      [O("教他叠豆腐块", "你们寝室拿了高分。", { mood: 2 }),
        O("和他一起整理", "寝室变得整洁有序。", { mood: 2 })]),
    E("小卖部", "🧊", "天热，你想买冰的，又怕喝了肚子不舒服。",
      [O("选择常温矿泉水", "你照顾了自己的肠胃。", { health: 1 }),
        O("买杯常温的饮品", "你既解了渴又不着凉。", { health: 1 })]),
    E("教室", "📝", "课堂提问，老师点到了你，你一时没反应过来。",
      [O("诚实说需要想一下，再认真作答", "你稳住了，答得还不错。", { mood: 2, academic: 1 }),
        O("请同学补充", "你在对话中理清了思路。", { academic: 1 })]),
    E("操场", "🌫️", "早晨有雾，跑操时视线不太好。",
      [O("放慢脚步注意安全", "你稳稳跑完，没有磕碰。", { health: 1 }),
        O("提醒身边同学靠内侧", "你帮大家避开了危险。", { mood: 2 })]),
    E("图书馆", "📓", "你在图书馆发现一个空位，桌上却放着别人的书占座。",
      [O("去找其他空位", "你避免了争执，也没耽误自习。", { mood: 1 }),
        O("礼貌地询问周围人", "你确认后安心坐下。", { mood: 1 })]),
    E("教室", "🖋️", "你的同桌最近字迹潦草，自己都看不懂笔记。",
      [O("建议他放慢速度练字", "他的笔记慢慢工整了。", { mood: 2, academic: 1 }),
        O("把你的笔记借他对照", "他补上了缺漏的内容。", { academic: 1 })]),
    E("食堂", "🥣", "早餐你在粥和豆浆之间纠结。",
      [O("今天选热粥暖胃", "你一上午都暖暖的。", { health: 1, mood: 1 }),
        O("选豆浆配包子", "你营养搭配得当。", { health: 1 })]),
    E("教室", "🎒", "放学后，你发现教室灯还亮着，门没锁。",
      [O("关好灯、门窗再离开", "你为班级守好了安全。", { mood: 2 }),
        O("通知保安大叔", "你做了负责的事。", { mood: 1 })]),
    E("走廊", "🚪", "你看到老师抱着一大摞作业本，腾不出手开门。",
      [O("快步上前帮老师开门", "老师顺利通过，向你道谢。", { mood: 2 }),
        O("帮着抱一部分", "你们一起送到了办公室。", { mood: 2 })]),
    E("操场", "🏆", "班级篮球赛，主力队员受伤，缺一个替补。",
      [O("顶上替补上场", "你虽然紧张，却为班级拼尽了力。", { mood: 4, health: 1 }),
        O("在场边卖力加油", "你的呐喊让队友更有劲头。", { mood: 2 })]),
    E("教室", "📝", "默写时你有个字卡壳了，怎么也想不起来。",
      [O("先跳过，最后再回头想", "你没有因一个字打乱节奏。", { academic: 1, mood: 1 }),
        O("深呼吸，按字形回忆", "你慢慢想起来了。", { academic: 1 })]),
    E("花园", "🌱", "班级的绿植角没人浇水，叶子有点蔫。",
      [O("定期承担浇水任务", "绿植在你的照顾下重新精神起来。", { mood: 2 }),
        O("组织几个人轮流照看", "大家一起有了责任感。", { mood: 2 })]),
    E("食堂", "🧻", "你看到桌上有同学洒了汤没擦干净。",
      [O("拿纸巾把桌子擦干净", "下一个同学能安心坐下。", { mood: 2 }),
        O("提醒阿姨来清理", "桌面很快恢复整洁。", { mood: 1 })]),
    E("教室", "📚", "你帮同学讲题，发现自己也有一处没完全懂。",
      [O("和他一起查资料弄明白", "教学相长，你理解得更透了。", { academic: 2, mood: 2 }),
        O("约定一起去问老师", "你们都得到了准确解答。", { academic: 1 })]),
    E("操场", "🌙", "晚自习后你想再跑两圈放松，操场灯快关了。",
      [O("在安全的时间内慢跑一圈", "你适度放松，又保证了安全。", { mood: 2, health: 1 }),
        O("改成在操场散步", "你放松了心情。", { mood: 2 })]),
    E("教室", "🧷", "你的校服扣子掉了一颗，行动不便。",
      [O("去医务室借针线缝上", "你学会了自己缝扣子。", { mood: 2 }),
        O("请会针线的同学帮忙", "扣子很快缝好了。", { mood: 1 })]),
    E("图书馆", "📖", "你在书里发现一张别人夹着的旧电影票根。",
      [O("留在书里，不打扰", "你保留了这份小美好。", { mood: 1 }),
        O("交给图书馆老师", "你做了稳妥的处理。", { mood: 1 })]),
    E("教室", "📝", "自习课很吵，你没法集中注意力。",
      [O("戴上耳塞，专注自己的事", "你高效地完成了作业。", { academic: 2 }),
        O("礼貌地请大家安静", "教室很快恢复了安静。", { mood: 2 })]),
    E("校门口", "🌂", "你多带了一把伞，正下着雨。",
      [O("借给没伞的同学一起走", "你收获了一句真诚的感谢。", { mood: 4 }),
        O("放在校门口共享伞架", "你帮助了不认识的人。", { mood: 3 })]),
    E("食堂", "🍊", "食堂饭后送水果，你拿到的是个没熟的。",
      [O("礼貌地去换一个", "你换到了一个甜的。", { mood: 1 }),
        O("留下来下课再吃", "你没有浪费。", { mood: 1 })]),
    E("教室", "🎤", "英语课有课前演讲，轮到你了。",
      [O("提前准备好稿子，自信开讲", "你流利地完成了演讲。", { mood: 4, academic: 1 }),
        O("拿着提示卡，慢慢讲", "你完成了挑战。", { mood: 2 })]),
    E("操场", "🤝", "体育游戏要两人一组，有个同学被剩下了。",
      [O("主动拉他进你这一组", "你让他没有落单。", { mood: 4 }),
        O("和他组队一起玩", "你们配合得很开心。", { mood: 3 })]),
    E("教室", "📋", "老师让你帮忙统计班级活动报名。",
      [O("做个表格逐项核对", "你一份不漏地统计完成。", { mood: 2, academic: 1 }),
        O("让小组长协助汇总", "你们高效完成了任务。", { mood: 2 })]),
    E("花园", "🌻", "你在花园背书时，一只蝴蝶停在你书上。",
      [O("屏住呼吸，静静看它", "你获得了一个温柔的小瞬间。", { mood: 3 }),
        O("轻轻翻开书，让它飞走", "你温柔地对待了它。", { mood: 2 })]),
    E("食堂", "🍜", "你帮同学占座，回来却发现座位被别人坐了。",
      [O("心平气和地另找座位", "你没有起冲突，还多了个位置。", { mood: 1 }),
        O("礼貌地解释一下", "对方表示理解并让出了座位。", { mood: 2 })]),
    E("教室", "📚", "考前复习，你发现自己有一科笔记缺了很多。",
      [O("借同学的笔记补齐", "你系统地补全了知识。", { academic: 2 }),
        O("找老师要复习提纲", "你抓住了重点。", { academic: 1 })]),
    E("操场", "🌬️", "风很大，吹得你睁不开眼。",
      [O("转过身，背风慢跑", "你保护了眼睛，也完成了锻炼。", { health: 1 }),
        O("改为室内活动", "你灵活调整了计划。", { mood: 1 })]),
    E("教室", "🖊️", "你的桌肚里塞满了废纸，该清理了。",
      [O("利用课间彻底整理", "你的课桌清爽了，找东西快多了。", { mood: 2 }),
        O("准备一个文件袋分类", "你养成了整理的好习惯。", { mood: 2, academic: 1 })]),
    E("图书馆", "📅", "你在图书馆看到同学为考试焦虑，书翻来翻去。",
      [O("和他分享你的复习计划", "他安定下来，效率提高了。", { mood: 3, academic: 1 }),
        O("陪他一起安静自习", "他没那么慌了。", { mood: 2 })]),
    E("食堂", "🥡", "你看到有同学打了太多菜，吃不完。",
      [O("提醒他按需打菜", "他下次少打了，没再浪费。", { mood: 2 }),
        O("分享自己的光盘经验", "你带动了光盘行动。", { mood: 2 })]),
    E("教室", "🎒", "你捡到一支很新的钢笔。",
      [O("交给失物招领处", "失主专程来道谢，那是老师送的礼物。", { mood: 4 }),
        O("交给班主任", "你做了诚实的事。", { mood: 2 })]),
    E("操场", "🏃", "跑步时你岔气了，肚子一侧疼。",
      [O("放慢速度，调整呼吸", "你科学地处理，没有硬撑。", { health: 1 }),
        O("先走一段再恢复", "你安全地完成了锻炼。", { health: 1 })]),
    E("教室", "📖", "你在课本空白处发现上届学生留下的解题技巧。",
      [O("认真参考并验证", "你学到了一个巧妙的方法。", { academic: 2 }),
        O("把它整理进错题本", "你把知识变成了自己的。", { academic: 1 })]),
    E("花园", "🌳", "午后的阳光透过树叶洒在地上，很安静。",
      [O("坐下来背一首诗", "你在美景中记住了它。", { academic: 1, mood: 3 }),
        O("闭眼休息十分钟", "你为下午的课充了电。", { health: 1, mood: 2 })]),
    E("教室", "📝", "你帮老师统计分数，发现自己也有进步。",
      [O("把进步记在心里，继续努力", "你获得了坚持的动力。", { mood: 3, academic: 1 }),
        O("定下下一个小目标", "你明确了前进方向。", { academic: 1, mood: 2 })])
  ];
  T.encounter.add(B);
});


/* ===== p79_encounters3.js ===== */
/* ============================================================================
   p79 · 校园奇遇簿（第三批 32 条，紧凑版），追加进 p73 的 BANK
   ============================================================================ */
register("encounters3-565", function () {
  var T = window.X565TOOLS = window.X565TOOLS || {};
  if (!T.encounter || !T.encounter.add) return;
  function E(loc, icon, text, a, b) {
    return { loc: loc, icon: icon, text: text,
      opts: [
        { label: a[0], out: a[1], fx: a[2] || null },
        { label: b[0], out: b[1], fx: b[2] || null }
      ] };
  }
  var B = [
    E("教室", "🔔", "上课铃响了，老师还没到，班里开始喧闹。",
      ["安静下来，带大家预习", "你提醒同学先翻开书，老师进来时班里秩序井然。", { mood: 2 }],
      ["帮忙维持纪律", "教室里很快安静下来。", { mood: 1 }]),
    E("走廊", "🥶", "空调出风口正对某个同学，他冷得直缩脖子。",
      ["把自己的外套借给他", "他披上外套，专心上完了课。", { mood: 3 }],
      ["帮他去调一下风向", "风不直吹了，他很感激。", { mood: 2 }]),
    E("操场", "🪜", "篮球卡在篮筐和篮板之间，够不着。",
      ["找扫把把球捅下来", "你成功把球弄了下来。", { mood: 2 }],
      ["请高个子同学帮忙", "他一跳就把球拿下来了。", { mood: 1 }]),
    E("食堂", "🥢", "你发现筷子筒里的筷子不够了。",
      ["去后厨告诉阿姨", "阿姨很快补上了筷子。", { mood: 2 }],
      ["把自己的先让给后面的人", "你多等了一会儿，却帮了别人。", { mood: 2 }]),
    E("图书馆", "📖", "你在图书馆座位上看到一副遗落的眼镜。",
      ["送到服务台", "失主很快找回来，他离了眼镜没法看书。", { mood: 3 }],
      ["交给值班老师", "你做了稳妥的处理。", { mood: 2 }]),
    E("教室", "💧", "饮水机没水了，桶空着。",
      ["找同学一起换桶", "你们合力换上了新水桶。", { mood: 2 }],
      ["去报告后勤", "水很快被送来了。", { mood: 1 }]),
    E("花园", "🪴", "植物角的花盆被风吹到了地上，土撒了一地。",
      ["重新培土、扶正", "你把花盆收拾好，还松了土。", { mood: 2 }],
      ["叫来值日的同学", "你们一起把植物救活了。", { mood: 1 }]),
    E("宿舍", "🧴", "室友的洗发水用完了，急着洗澡。",
      ["把自己的借给他", "他顺利洗完，说要请你喝奶茶。", { mood: 3 }],
      ["陪他去借", "他很快解决了问题。", { mood: 1 }]),
    E("教室", "📝", "老师临时让你把通知写在黑板上。",
      ["工整地写好并加上边框", "你的板书被老师表扬了。", { mood: 3 }],
      ["认真写完通知", "信息清楚，全班都看到了。", { mood: 1 }]),
    E("操场", "🪁", "有同学的毽子踢到了树上。",
      ["找长杆把它挑下来", "你成功取回了毽子。", { mood: 2 }],
      ["轻轻摇晃树枝", "毽子落了下来。", { mood: 1 }]),
    E("食堂", "🍜", "你帮同学占位，却被误会成了占座。",
      ["礼貌解释，让出一个位置", "误会解开，大家都坐下了。", { mood: 2 }],
      ["另找位置", "你用平和的方式化解了尴尬。", { mood: 1 }]),
    E("教室", "📚", "老师让大家交换批改作业，你拿到了一份写得很乱的。",
      ["耐心逐题批改并写鼓励", "对方看了你的评语，开始认真改。", { mood: 3, academic: 1 }],
      ["按标准打分", "你客观地完成了批改。", { mood: 1 }]),
    E("走廊", "🌬️", "风把教室的门吹得关上，夹住了同学的书包。",
      ["赶紧帮忙拉开门", "你避免了书包被夹坏。", { mood: 2 }],
      ["提醒他把书包放好", "他及时抽出了书包。", { mood: 1 }]),
    E("操场", "🥤", "运动会后勤点人手不够，水都来不及分。",
      ["去帮忙递水", "你让每个下场的同学都喝到了水。", { mood: 3, health: 1 }],
      ["帮忙看东西", "你为后勤分担了一份力。", { mood: 2 }]),
    E("教室", "🖊️", "你的同桌没带尺子，几何课没法画图。",
      ["把自己的备用尺借给他", "他顺利完成了作图。", { mood: 2 }],
      ["和他共用一把", "你们都完成了练习。", { mood: 1 }]),
    E("图书馆", "📵", "有人的电话铃声很大，还接了起来。",
      ["轻声提醒他到外面接", "他抱歉地走到了外面。", { mood: 2 }],
      ["换到安静的座位", "你用温和的方式解决了问题。", { mood: 1 }]),
    E("食堂", "🍞", "早餐窗口的队伍特别长，快上课了。",
      ["和同学分工，一人排队一人拿餐具", "你们都吃上了早饭。", { mood: 2 }],
      ["买了能带走的，边走边吃", "你没有饿着上课。", { health: 1 }]),
    E("教室", "🧯", "安全演练，同学嘻嘻哈哈不认真。",
      ["提醒大家按要求疏散", "你们组快速、有序地完成了演练。", { mood: 2 }],
      ["自己先按要求做好", "你的认真带动了身边的人。", { mood: 1 }]),
    E("花园", "🐌", "雨后的路上有很多蜗牛，容易被踩到。",
      ["把它们小心挪到草丛里", "你保护了这些小生命。", { mood: 3 }],
      ["提醒同学绕行", "大家都放轻了脚步。", { mood: 2 }]),
    E("宿舍", "🪟", "回南天宿舍很潮，被子都是湿的。",
      ["和室友一起开窗通风、用除湿", "宿舍干爽了许多。", { mood: 2 }],
      ["建议白天把被子抱去晒", "晚上被子有了阳光的味道。", { mood: 2 }]),
    E("教室", "📅", "班长让你帮忙统计校服尺码。",
      ["做个表格逐个核对", "你一份不差地统计完成。", { mood: 2, academic: 1 }],
      ["让各组长协助", "你们很快汇总完毕。", { mood: 1 }]),
    E("操场", "🏸", "体育课自由活动，你不太会打羽毛球。",
      ["请会的同学教你", "你很快掌握了基本动作。", { mood: 2, health: 1 }],
      ["自己先颠球练手感", "你慢慢找到了节奏。", { health: 1 }]),
    E("走廊", "📰", "公告栏的通知被风掀起一角，快掉了。",
      ["找胶带重新贴牢", "通知完整地留在了公告栏。", { mood: 1 }],
      ["告诉负责的同学", "他很快固定好了。", { mood: 1 }]),
    E("食堂", "🍵", "你看到有同学只打了白饭，没打菜。",
      ["把自己的菜分给他一半", "你陪他吃了一顿完整的饭。", { mood: 3 }],
      ["问他是不是钱不够", "他借了饭卡，很感激你。", { mood: 2 }]),
    E("教室", "🎒", "同桌的笔袋拉链坏了，笔撒了一桌。",
      ["借给他一个文件袋应急", "他的文具不再散落。", { mood: 2 }],
      ["帮他一起捡", "你快速帮他收拾好。", { mood: 1 }]),
    E("花园", "🌙", "晚自习后你在小花园背书，发现路灯坏了一盏。",
      ["告诉后勤报修", "路灯很快修好，晚走的同学安全了。", { mood: 2 }],
      ["换到亮处背书", "你注意了自己的安全。", { mood: 1 }]),
    E("教室", "📝", "做实验记录时，你的笔没水了。",
      ["提前备好一支放在笔袋", "你从容地完成了记录。", { mood: 1 }],
      ["向邻座借一支", "你没有耽误实验。", { mood: 1 }]),
    E("操场", "🌡️", "天气很热，有同学出现中暑迹象。",
      ["扶他到阴凉处并报告老师", "你反应及时，他缓了过来。", { mood: 4 }],
      ["递水、让他坐下", "他在你的照顾下好转。", { mood: 3 }]),
    E("教室", "📋", "小组互评，你需要给组员打分。",
      ["客观、真诚地写出优点和建议", "你的评价让大家心服口服。", { mood: 2, academic: 1 }],
      ["和组员互相确认", "你们都得到了公平的评价。", { mood: 1 }]),
    E("食堂", "🧊", "冰饮柜前排着长队，你其实不渴。",
      ["改买常温的水", "你照顾了肠胃，也没浪费时间。", { health: 1 }],
      ["先去吃饭，饭后再买", "你避开了高峰。", { mood: 1 }]),
    E("教室", "📖", "你在讲台捡到一支老师的红笔。",
      ["课后送到办公室", "老师正找它，很感谢你。", { mood: 2 }],
      ["放在讲台上并留言", "老师顺利拿回了笔。", { mood: 1 }]),
    E("花园", "🌻", "你看见一株小花被人踩弯了。",
      ["轻轻扶起并在旁边做个小标记", "你保护了它，也提醒了别人。", { mood: 2 }],
      ["浇点水，希望它缓过来", "几天后它又挺直了。", { mood: 2 }]),
    E("教室", "🧘", "考前焦虑让你坐立不安。",
      ["放下笔，做几次深呼吸", "你平复了情绪，重新专注。", { mood: 3, health: 1 }],
      ["把任务拆成最小的一步", "你从最简单的题开始，慢慢进入状态。", { academic: 1, mood: 2 }])
  ];
  T.encounter.add(B);
});


/* ===== p76_wxtopics3.js ===== */
/* ============================================================================
   p76 · 微信对话题库（为 6 位新剧情女主 + 服务号补足话题）
   必须在 p52/p53/p56/p57/p58 之后运行（联系人已创建）
   ============================================================================ */
register("wxtopics3-565", function () {
  var D = window.X565WXData;
  if (!D || !D.contacts) return;
  function K(kws, reps) { return { kws: kws, reps: reps }; }
  function add(id, kws, reps) {
    var c = D.byId ? D.byId(id) : null;
    if (!c) {
      c = D.contacts.filter(function (x) { return x.id === id; })[0];
    }
    if (c) {
      c.bank = c.bank || [];
      c.bank.push(K(kws, reps));
    }
  }
  function addMany(id, arr) { arr.forEach(function (a) { add(id, a[0], a[1]); }); }

  /* 温以宁（学习委员） */
  addMany("wen", [
    [["函数", "数学", "几何", "压轴题", "导数"], ["函数先看定义域和单调性，别急着套公式。", "压轴题第一问是送分的，先把它拿下。"]],
    [["错题", "订正", "错题本", "不会做"], ["把错题拍照发我，我标好步骤回你。", "错题本不是抄答案，是写下你当时卡在哪一步。"]],
    [["自习", "图书馆", "晚自习", "补习"], ["老位置，靠窗，我给你留座。", "今晚把函数这一章过一遍，别迟到。"]],
    [["及格", "进步", "分数", "排名"], ["分数是你自己考的，我只是讲题。", "进步不是偶然，是你一道题一道题磨出来的。"]],
    [["熬夜", "早点睡", "休息", "别太累"], ["我睡了，你也别熬。", "困了就去睡，硬撑的效率是负的。"]],
    [["牛奶", "吃饭", "青菜", "早餐"], ["我把牛奶放你桌角了，记得喝。", "你那一餐没有蔬菜，明天补上。"]],
    [["笔记", "整理", "提纲", "重点"], ["我的笔记可以借你，但你要自己再整理一遍才算会。", "提纲在群文件里，先看目录再看细节。"]],
    [["英语", "语文", "物理", "化学"], ["英语背单词靠重复，物理先画图。", "哪科都别急，一科一科来。"]],
    [["粗心", "马虎", "算错", "看错题"], ["粗心不是借口，是熟练度不够，多练。", "做完留两分钟检查，能捡回不少分。"]],
    [["考试", "周测", "月考", "期中"], ["考前把错题过一遍，比刷新题管用。", "正常发挥，你准备得比上次充分。"]],
    [["喜欢", "在意", "表白", "在一起"], ["……你这道题，答得比谁都快。", "我对你，从来不是随便讲讲题。"]],
    [["吃醋", "弟弟", "别的女生", "别的人"], ["那是我弟，你少胡思乱想。", "你吃醋的样子，倒是有点可爱。"]],
    [["雨天", "伞", "下雨", "淋湿"], ["我在图书馆门口等你，伞往你那边偏。", "别淋着，感冒了没法好好学。"]],
    [["累", "撑不住", "压力", "焦虑"], ["撑不住就停一下，我陪你。", "学习不是一个人的事，还有我。"]],
    [["晚安", "早安", "睡了"], ["晚安，明天图书馆见。", "早安，今天也要把不懂的题弄明白。"]],
    [["目标", "大学", "未来", "理想"], ["目标要写下来，一步步来。", "你想考哪里，我帮你一起规划。"]],
    [["走神", "犯困", "听不进去"], ["先去洗把脸，我等你。", "听不进去就先做笔记，手会把注意力拉回来。"]],
    [["谢谢", "感谢", "多亏你"], ["别谢我，是你自己肯学。", "下次认真考给我看，就是最好的感谢。"]]
  ]);

  /* 安宁（摄影社） */
  addMany("an", [
    [["拍照", "相机", "摄影", "照片", "镜头"], ["你、你别动，这个光很好……", "拍照要等光，急不得。"]],
    [["影展", "展览", "展出", "作品"], ["影展那天，我想让你第一个看到。", "我把最好的那张放在最中央。"]],
    [["取景", "构图", "对焦", "光线"], ["三分构图，把主体放在交叉点上。", "逆光会有轮廓，傍晚最适合。"]],
    [["转学生", "转学", "新环境", "不熟悉"], ["刚来的时候，谢谢你帮我。", "现在有你，我没那么怕了。"]],
    [["害羞", "内向", "不敢说话", "紧张"], ["我、我话不多，你别介意。", "在你面前，我已经敢说很多话了。"]],
    [["喜欢", "在意", "表白", "在一起"], ["我镜头里，一直只有你。", "我想让你当我照片里的主角。"]],
    [["摄影社", "社长", "洗照片"], ["社长只是帮我洗照片，你别多想。", "底片我会自己留着。"]],
    [["夕阳", "晚霞", "天台", "风景"], ["夕阳是圆的，拍下来才不会消失。", "天台的光最好，你陪我去。"]],
    [["猫", "花", "桂花", "校园"], ["小花园的猫很上镜，我拍了好几张。", "桂花落的时候最好看。"]],
    [["晚安", "早安", "睡了"], ["……晚安，今天谢谢你。", "早安，校门口见。"]],
    [["累", "压力", "难过"], ["累的时候，就看看我拍的照片。", "你不开心，我陪你去拍照好不好。"]],
    [["谢谢", "解围", "第一天"], ["第一天是你帮我挡在前面的，我记着。", "那是我转学后第一件不怕的事。"]]
  ]);

  /* 江晚舟（女足） */
  addMany("jia", [
    [["足球", "踢球", "训练", "球场", "射门"], ["放学球场，缺个捡球的，你来。", "我再练十个任意球，你看着。"]],
    [["比赛", "决赛", "联赛", "对手"], ["决赛那天，你必须在场。", "我会把最后一个球踢给你。"]],
    [["受伤", "扭伤", "崴脚", "擦伤", "疼"], ["小伤，不影响踢球……好吧，你扶我。", "别硬撑的是你，现在轮到我了。"]],
    [["队友", "队长", "替补", "传球"], ["队友就是后背，你也是。", "我传球给别人，眼神只看你。"]],
    [["喜欢", "在意", "表白", "在一起"], ["你赢了比赛，现在该你赢我了。", "我踢球从来不怂，到你这儿例外。"]],
    [["后勤", "递水", "加油", "球迷"], ["你是我封的头号球迷。", "我每进一个球，都先看你。"]],
    [["吃饭", "饭量大", "加餐", "食堂"], ["训练消耗大，别笑我吃得多。", "你那份鸡腿，我不客气了。"]],
    [["晚安", "早安", "睡了"], ["晚安，明天还得早起训练。", "早安，看台上见。"]],
    [["输", "怕输", "压力", "紧张"], ["我也会怕，但你在我就稳。", "输了一起扛，赢了一起狂。"]],
    [["篮球", "运动", "跑步"], ["篮球我也会，放学来切磋。", "跑步我陪你，别掉队。"]]
  ]);

  /* 岑诺（辩论社） */
  addMany("nuo", [
    [["辩论", "辩题", "攻辩", "论点", "论据"], ["明天图书馆，我教你立论。", "论点要能被反驳，才经得起推敲。"]],
    [["逻辑", "论证", "反驳", "逻辑漏洞"], ["先界定概念，再找对方的前提漏洞。", "你这个问题，比我预想的锋利。"]],
    [["毒舌", "说话直", "嘴硬", "凶"], ["我说话直，但没恶意。", "……只对你，我会尽量不毒舌。"]],
    [["生病", "感冒", "吃药", "逞强", "发烧"], ["烧成这样还逞强，你是猪吗？坐下。", "把药吃了，粥喝完，别的我来。"]],
    [["稿子", "陈词", "开场", "结辩"], ["我决赛的开场，第一个读给你听。", "稿子第一页，我想写一句话给你。"]],
    [["喜欢", "在意", "表白", "在一起"], ["这句话我准备了无数论点，却没有一个能反驳你。", "我认输，心甘情愿输给你。"]],
    [["表弟", "改稿", "别人", "吃醋"], ["那是我表弟，他初中比赛求我改稿。", "我的稿子，你第一个看。"]],
    [["晚安", "早安", "睡了"], ["晚安，资料我收了，别熬。", "早安，今天也别给我惹麻烦。"]],
    [["紧张", "怯场", "上台"], ["紧张就把论点写在纸上，眼睛看我。", "你不用赢，你只要把话说完。"]],
    [["谢谢", "外套", "粥"], ["……谢了，那件外套很暖。", "别多想，我只是不想陪练病倒。"]]
  ]);

  /* 桑榆（舞蹈社） */
  addMany("sang", [
    [["跳舞", "舞蹈", "排练", "形体", "练功房"], ["来帮我看看这个动作顺不顺？", "我再转三圈，你帮我数。"]],
    [["汇报演出", "艺术节", "舞台", "独舞"], ["这支舞，我是跳给你看的。", "上台那天，第一排留给你。"]],
    [["脚伤", "崴脚", "托举", "贴膏药"], ["脚没事，你别紧张……好吧，你扶我。", "托举有搭档，你别吃醋。"]],
    [["忘带", "饭卡", "发带", "迷糊", "舞鞋"], ["饭卡又忘练功房了，你救我！", "你帮我记着，我就不会忘。"]],
    [["喜欢", "在意", "表白", "在一起"], ["以后我只跳给你一个人看。", "台下的我，只想找你。"]],
    [["搭档", "男生", "托举", "吃醋"], ["那是老师安排的，我跟他一句话都不多说。", "舞台上的我是节目的，台下是你的。"]],
    [["晚安", "早安", "睡了"], ["晚安，明天还得压腿。", "早安，来看我排练吗？"]],
    [["紧张", "怕跳错", "舞台"], ["别人以为我不紧张，其实我每次都怕。", "看到你在台下，我就稳了。"]],
    [["音乐", "节奏", "动作"], ["跟节奏走，别抢拍。", "我数八拍，你听着就行。"]]
  ]);

  /* 苗妙（英语课代表） */
  addMany("miao", [
    [["英语", "口语", "发音", "单词", "听力"], ["开口就赢了一半，Come on！", "长单词先按音节拆开读。"]],
    [["演讲", "演讲比赛", "英语演讲"], ["我把故事讲给你一个人听，你帮我练。", "那个故事里的听众，是你。"]],
    [["笑话", "冷笑话", "热闹", "开心"], ["我给你讲个冷笑话，想听吗？", "我讲笑话，是怕冷场。"]],
    [["口语角", "对话", "外教", "英语角"], ["Come here，今天话题是 hobby。", "你开口的样子，比你想的好。"]],
    [["喜欢", "在意", "表白", "在一起"], ["I like you too，这句话我练了无数遍。", "你是我唯一想对话的人。"]],
    [["别人", "搭档", "一起练", "吃醋"], ["练口语只能找我，这是规定。", "我也会小心眼，你别让我看见。"]],
    [["安静", "不吵", "真实", "保护色"], ["在你面前，我可以不热闹。", "我话这么多，是怕你觉得我没意思。"]],
    [["晚安", "早安", "睡了"], ["Good night，记得听一段英语再睡。", "Morning，今天晨读我带你读。"]],
    [["语法", "完形", "阅读", "作文"], ["阅读回原文找答案，别靠感觉。", "作文先列中文要点，再翻译成英文。"]],
    [["紧张", "不敢说", "怕错"], ["说错没关系，语言是用来交流的。", "你先跟我说，说熟了再对别人说。"]]
  ]);

  /* 服务号/校园账号补充 */
  addMany("canteen", [
    [["今天吃什么", "菜单", "有什么菜", "打菜"], ["今天有糖醋里脊和时蔬，记得光盘领水果。", "菜咸了可以去窗口拿免费例汤。"]],
    [["饭卡", "充值", "没钱"], ["饭卡没钱可以去充值处，也能找同学先垫。"]],
    [["营业时间", "几点", "关门"], ["早餐 6:30 起，晚餐到 19:00，别饿着。"]]
  ]);
  addMany("radio", [
    [["点歌", "放歌", "广播", "音乐"], ["把想点的歌和想说的话写在便签上，送到广播站。", "傍晚的点歌时段，我为你放。"]],
    [["失物", "寻物", "招领"], ["捡到东西可以送到广播站，我帮你播寻物启事。"]],
    [["广播稿", "投稿", "念稿"], ["校园广播欢迎投稿，写清楚班级和名字。"]]
  ]);
  addMany("aiza", [
    [["心情", "烦恼", "难受", "焦虑"], ["情绪没有对错，需要的话可以来心理室坐坐。", "愿意求助是勇敢，不是脆弱。"]],
    [["压力", "考试焦虑", "睡不着"], ["先做几个深呼吸，把注意力放回当下。", "把烦恼写下来，它会小一点。"]],
    [["关系", "朋友", "吵架", "孤独"], ["好的关系不必讨好，做真实的自己。", "朋友是从一起做事开始的，别急。"]]
  ]);
});


/* ===== p70_content.js ===== */
/* ============================================================================
   模块九 · 5.6.5 内容补全
   · AI 题库大扩容（校园生活真实高频话题，全联系人 + 小助手共享）
   · 5.6.5 更新日志置顶、欢迎邮件（只发一次）
   ============================================================================ */
register("content-565", function () {
  /* ─────────── 1) AI 题库扩容（id 以 x565_ 前缀，避免重复） ─────────── */
  var NEW_INTENTS = [
    { id: "x565_zhibu", kws: ["值日", "大扫除", "擦黑板", "扫地", "倒垃圾", "今天谁值日"],
      rep: { cold: ["不是我就行。", "看值日表。"], mid: ["今天轮到我了，你帮我递个抹布呗。", "大扫除我负责擦窗，你负责扫地？"],
      warm: ["你值日我留下来陪你，快点干完一起去小卖部～", "我帮你拎水！值日这种事怎么能让你一个人干。"] } },
    { id: "x565_zaozixi", kws: ["早自习", "早读", "晨读", "读书声", "朗读"],
      rep: { cold: ["吵。", "读你的。"], mid: ["早自习困得睁不开眼，但还是要读。", "背单词背到嘴瓢，你呢？"],
      warm: ["今早读的是我喜欢的课文，等下背给你听呀。", "我帮你占了位置，早自习别迟到，我给你带了热豆浆。"] } },
    { id: "x565_wanzixi", kws: ["晚自习", "晚自修", "夜自习", "晚自习下课", "上晚自习"],
      rep: { cold: ["安静写作业。", "别讲话。"], mid: ["晚自习三节，写到脑子发木。", "晚自习课间一起去走廊吹吹风？"],
      warm: ["晚自习我坐你斜后方，不会的题传纸条给我（小声）。", "下晚自习我等你，一起走夜路，我有手电筒。"] } },
    { id: "x565_kejian", kws: ["课间", "课间十分钟", "大课间", "下课干嘛", "课间操"],
      rep: { cold: ["睡觉。", "趴会儿。"], mid: ["课间十分钟上个厕所就没了。", "课间陪我去打水吧。"],
      warm: ["课间我去找你！给你带了小零食。", "大课间一起去操场溜达两圈，活动活动。"] } },
    { id: "x565_wuxiu", kws: ["午休", "午睡", "中午睡觉", "趴桌睡"],
      rep: { cold: ["别吵我。", "我睡了。"], mid: ["中午趴桌睡一会儿，下午才有精神。", "午休教室有点吵，我去图书馆了。"],
      warm: ["你午睡盖件衣服，别着凉，我帮你看着老师。", "我把外套借你当枕头，醒了记得还我呀～"] } },
    { id: "x565_chidao", kws: ["迟到", "起晚了", "没赶上", "闹钟没响", "卡点"],
      rep: { cold: ["下次早点。", "活该。"], mid: ["早自习要被记名了，快跑！", "我又卡点进教室，班主任瞪我了。"],
      warm: ["你先冲进去，我帮你打掩护！书包给我。", "我多定了个闹钟，明天打电话叫你起床，保证不迟到。"] } },
    { id: "x565_tuotang", kws: ["拖堂", "占课", "不下课", "还不下课", "又占课"],
      rep: { cold: ["习惯了。", "等吧。"], mid: ["老师又拖堂，厕所都来不及去。", "体育课被占了，呜呜。"],
      warm: ["拖堂就拖堂吧，我陪你一起听，下课给你糖吃。", "我也讨厌占课！等下我们直接冲食堂，走快点！"] } },
    { id: "x565_shetuan", kws: ["社团", "社团招新", "百团大战", "社团活动", "加入什么社团"],
      rep: { cold: ["没兴趣。", "看情况。"], mid: ["社团挺多的，你想报哪个？", "周三下午社团活动，我去音乐社。"],
      warm: ["你报哪个我就报哪个！这样我们能一起活动啦～", "社团招新我陪你一家一家看，别急着决定。"] } },
    { id: "x565_xueshenghui", kws: ["学生会", "团委", "竞选", "干部", "学生会竞选"],
      rep: { cold: ["麻烦。", "不想去。"], mid: ["学生会有点忙，但能锻炼人。", "我竞选了学习委员，你投我一票呗。"],
      warm: ["你要是竞选，我第一个举双手支持！演讲稿我帮你写。", "当干部别太累，忙不过来我帮你跑腿。"] } },
    { id: "x565_shengqi", kws: ["升旗", "升旗仪式", "国旗下讲话", "晨会"],
      rep: { cold: ["站着吧。", "困。"], mid: ["周一升旗要穿全套校服，别忘了。", "国旗下讲话我差点睡着。"],
      warm: ["升旗我站你旁边，你犯困我偷偷碰你一下。", "今天国旗班的同学好帅（不是），我们一起认真听吧。"] } },
    { id: "x565_junxun", kws: ["军训", "站军姿", "拉练", "教官", "迷彩服"],
      rep: { cold: ["累。", "晒黑了。"], mid: ["军训站军姿腿都麻了，多喝水。", "教官很严，但拉歌挺好玩。"],
      warm: ["军训我给你备了防晒霜和藿香正气水，别中暑！", "晚上拉练我陪着你，走不动我扶你。"] } },
    { id: "x565_xuanke", kws: ["选科", "选科组合", "物化地", "物化生", "史政地", "文理分科", "走班"],
      rep: { cold: ["自己想。", "看成绩。"], mid: ["选科关系到以后专业，慎重。", "我打算选物化地，你呢？"],
      warm: ["我们选一样的组合吧，这样走班还能经常碰到！", "我查过你想报的专业要求了，一起选物化地，我帮你。"] } },
    { id: "x565_gaokao", kws: ["高考", "目标大学", "理想大学", "志愿", "分数线", "想考哪所"],
      rep: { cold: ["还早。", "再说。"], mid: ["目标大学我写在笔袋里了，每天看一眼。", "分数线好高，得再努力。"],
      warm: ["我想和你考去同一个城市，所以我们都要加油。", "你想去哪我都支持，我们一起刷题、一起考上。"] } },
    { id: "x565_monikaoshi", kws: ["周测", "周练", "月考", "期中考", "期末考", "摸底", "模拟考"],
      rep: { cold: ["又考。", "随便。"], mid: ["又要月考了，我书还没看完。", "周测排名出来了，你看了吗？"],
      warm: ["别紧张，我们复习的都考！考前我帮你再过一遍错题。", "考完一起去吃顿好的，不管考成什么样，我都在。"] } },
    { id: "x565_cuotiben", kws: ["错题本", "错题", "整理错题", "对答案", "订正"],
      rep: { cold: ["懒得整理。", "嗯。"], mid: ["错题本越攒越厚，想哭。", "订正完这道题我给你看。"],
      warm: ["错题我们一起整理，我讲给你听，保证下次不犯。", "我把易错点抄了两份，一份给你，别偷懒。"] } },
    { id: "x565_fachao", kws: ["罚抄", "罚站", "罚跑", "请家长", "被批评", "点名批评"],
      rep: { cold: ["自求多福。", "认命。"], mid: ["罚抄一百遍，手要废了。", "上课睡觉被抓，罚站了一节课。"],
      warm: ["你被骂我帮你分担一半罚抄！下次别再走神啦。", "别难过，批评而已，我请你吃甜的，马上就好。"] } },
    { id: "x565_chuandazhi", kws: ["传纸条", "小纸条", "纸条", "上课递纸条"],
      rep: { cold: ["别被抓。", "我不收。"], mid: ["传纸条小心被老师看到。", "你纸条写的啥？下课给我看。"],
      warm: ["我把纸条折成小爱心了，老师来了快藏好～", "你传的每一张我都收着，攒了一叠啦。"] } },
    { id: "x565_shangke_shuijiao", kws: ["上课睡觉", "打瞌睡", "走神", "犯困", "听课听困了"],
      rep: { cold: ["会被抓。", "醒醒。"], mid: ["数学老师声音太催眠了。", "我掐自己一下，又睡着了。"],
      warm: ["你困了就靠我这边，我用书本挡着，老师看不见。", "下课洗把冷水脸，我给你带薄荷糖，提神。"] } },
    { id: "x565_tongzhuo", kws: ["同桌", "换座位", "前后桌", "同桌你好", "新同桌"],
      rep: { cold: ["哦。", "随便。"], mid: ["同桌人挺好的，就是话多。", "又要换座位了，舍不得。"],
      warm: ["你就是我最好的同桌，谁换都不换！", "换座位我要跟老师申请跟你坐一起。"] } },
    { id: "x565_banzhang", kws: ["班长", "课代表", "学习委员", "小组长", "班委"],
      rep: { cold: ["管得宽。", "嗯。"], mid: ["班长又在记名字了，安静点。", "我是课代表，作业记得交给我。"],
      warm: ["我当课代表才好催你交作业呀，快把作业给我！", "你要是当班委，我一定最配合你，不给你添麻烦。"] } },
    { id: "x565_xiaomaibu", kws: ["小卖部", "超市", "自动售货机", "买零食", "买水"],
      rep: { cold: ["不去。", "自己去。"], mid: ["课间小卖部人超多，要排队。", "走，趁下课去买瓶水。"],
      warm: ["你想吃啥？我去买，顺便给你带一份！", "下课冲小卖部，我帮你占队，你要冰红茶对不对？"] } },
    { id: "x565_xiaoyuanka", kws: ["校园卡", "饭卡", "水卡", "充值", "挂失", "卡丢了"],
      rep: { cold: ["去补办。", "。"], mid: ["饭卡没钱了，中午得充值。", "卡丢了先去挂失，不然被刷光。"],
      warm: ["我饭卡借你刷！先吃饭，充值的事不急。", "我陪你去服务台挂失补办，别着急。"] } },
    { id: "x565_qingjia", kws: ["请假", "病假", "请假条", "不舒服想请假", "事假"],
      rep: { cold: ["找老师。", "嗯。"], mid: ["不舒服就去医务室开假条。", "请假要班主任签字。"],
      warm: ["你生病了？我陪你去医务室，假条我帮你递。", "好好休息，笔记我帮你记，放学带给你。"] } },
    { id: "x565_yundonghui", kws: ["运动会", "校运会", "开幕式", "接力", "跳远", "报项目"],
      rep: { cold: ["不报。", "围观。"], mid: ["运动会我报了个接力，紧张。", "开幕式要走方阵，记得练。"],
      warm: ["你比赛我一定去终点等你，给你递水和毛巾！", "接力我把棒交给你，我们一起冲线！加油！"] } },
    { id: "x565_tic", kws: ["体测", "800米", "1000米", "引体向上", "仰卧起坐", "坐位体前屈", "50米"],
      rep: { cold: ["及格就行。", "跑不动。"], mid: ["800 米是我的噩梦。", "体测前我练了好久。"],
      warm: ["跑步我带你的节奏，跟在我后面，保证你及格！", "体测完我给你揉腿、买冰水，辛苦啦。"] } },
    { id: "x565_badminton", kws: ["羽毛球", "乒乓球", "网球", "跳绳", "毽子"],
      rep: { cold: ["不会。", "再说。"], mid: ["放学后羽毛球馆见？", "我羽毛球打得一般，你让着我点。"],
      warm: ["我教你打羽毛球！放学后器材室见，我带拍。", "周末一起打球啊，输的请奶茶。"] } },
    { id: "x565_ktv", kws: ["K歌", "唱歌", "音乐教室", "一起唱歌", "麦克风"],
      rep: { cold: ["我不唱。", "听你唱。"], mid: ["我五音不全，不敢唱。", "音乐教室可以练歌。"],
      warm: ["你唱歌我第一个听！来，这首合唱，我给你伴奏。", "你唱歌超好听的，别怕，我在下面给你打拍子。"] } },
    { id: "x565_dianying", kws: ["电影", "看电影", "动漫", "追剧", "番剧"],
      rep: { cold: ["没空。", "哦。"], mid: ["最近有部新片，口碑不错。", "周末我想补番，你呢？"],
      warm: ["周末一起看电影吗？我买好爆米花等你。", "你推荐的我都看，看完我们一起吐槽剧情。"] } },
    { id: "x565_shouji", kws: ["手机", "玩手机", "没收", "被收手机", "上课玩手机"],
      rep: { cold: ["小心被收。", "活该。"], mid: ["上课玩手机容易被巡堂抓。", "我手机差点被没收。"],
      warm: ["把手机收起来，下课我陪你聊天，别让老师收走了。", "被收了我帮你去要！你先专心听课嘛。"] } },
    { id: "x565_aoye", kws: ["熬夜", "写作业到很晚", "失眠", "睡不着", "晚睡"],
      rep: { cold: ["早点睡。", "别熬。"], mid: ["熬夜写作业第二天必困。", "昨晚又熬到一点，今天废了。"],
      warm: ["别熬太晚，作业明天我帮你一起补，身体要紧。", "睡不着给我发消息，我陪你聊到困。"] } },
    { id: "x565_naozhong", kws: ["闹钟", "起不来", "赖床", "起床困难", "叫我起床"],
      rep: { cold: ["多定几个。", "。"], mid: ["我闹钟响三遍都听不见。", "赖床真的控制不住。"],
      warm: ["明早我打电话叫你起床！响到你接为止。", "我把我妈的备用闹钟借你，绝对能叫醒你。"] } },
    { id: "x565_xiaofu", kws: ["校服", "发型", "校规", "仪容仪表", "校徽"],
      rep: { cold: ["穿着呗。", "麻烦。"], mid: ["今天检查仪容仪表，记得戴校徽。", "校服外套有点大。"],
      warm: ["我校服外套借你穿？有洗衣液的香味哦。", "我帮你把校徽别正，头发也理一下，检查要来了。"] } },
    { id: "x565_banzhuren", kws: ["班主任", "教导主任", "年级主任", "校长", "巡堂"],
      rep: { cold: ["躲远点。", "严肃。"], mid: ["班主任从后门窗户看过来了。", "教导主任今天抓迟到。"],
      warm: ["别怕，班主任人其实挺好的，真有事我们一起去找老师。", "我帮你盯着后门，老师来了我踢你凳子。"] } },
    { id: "x565_jiazhanghui", kws: ["家长会", "家长签字", "成绩单", "家长群"],
      rep: { cold: ["完蛋。", "完了。"], mid: ["又要开家长会，我成绩拿不出手。", "家长群又@全体了。"],
      warm: ["这次进步了，开家长会也不怕！我帮你把错题讲明白。", "要签字的试卷我帮你一起分析，下次考好就行。"] } },
    { id: "x565_heibanbao", kws: ["黑板报", "学习园地", "宣传栏", "班会", "主题班会"],
      rep: { cold: ["我不画。", "找别人。"], mid: ["这期黑板报轮到我们组。", "班会主题还没想好。"],
      warm: ["黑板报我来写字，你负责画画，我们组一定拿第一！", "主题班会我想和你一起主持，你愿意吗？"] } },
    { id: "x565_tushuguan", kws: ["图书馆", "阅览室", "借书", "自习室", "占座"],
      rep: { cold: ["安静。", "别说话。"], mid: ["图书馆自习效率高，就是要抢座。", "我借的书快到期了。"],
      warm: ["我去图书馆给你占靠窗的位置，放了瓶水在那。", "周末一起去图书馆自习吧，学完请你喝奶茶。"] } },
    { id: "x565_zoulang", kws: ["走廊", "天台", "后花园", "林荫道", "操场散步"],
      rep: { cold: ["别去。", "。"], mid: ["天台一般不让上。", "课间走廊人挤人。"],
      warm: ["晚自习课间陪我去走廊尽头看月亮好不好？", "后花园的桂花开了，放学我带你去那条小路走走。"] } },
    { id: "x565_zhuxiao", kws: ["宿舍", "寝室", "室友", "宿管", "查寝", "熄灯", "住校"],
      rep: { cold: ["还行。", "挤。"], mid: ["宿舍熄灯后就没法写作业了。", "宿管阿姨查寝好严。"],
      warm: ["住校的话我帮你占个下铺，晚上我们小声聊天。", "你要是住不惯，晚自习后我陪你走到宿舍楼下。"] } },
    { id: "x565_zaocan", kws: ["早饭", "早餐", "没吃早饭", "豆浆", "包子", "鸡蛋"],
      rep: { cold: ["记得吃。", "。"], mid: ["早自习来不及吃早饭。", "食堂的豆浆今天很烫。"],
      warm: ["我多带了个鸡蛋和包子，给你！空腹上课不行。", "明天我帮你带早餐，你要豆浆还是牛奶？"] } },
    { id: "x565_naicha", kws: ["奶茶", "加糖", "奶茶店", "第二杯半价", "零食"],
      rep: { cold: ["少喝。", "胖。"], mid: ["奶茶太甜了，我点三分糖。", "放学想喝杯奶茶。"],
      warm: ["走！第二杯半价，我请你！你还是老样子三分糖对不对？", "给你带了奶茶，庆祝你今天进步了一点点。"] } },
    { id: "x565_jianshen", kws: ["减肥", "跑步锻炼", "健身", "运动", "打球去"],
      rep: { cold: ["坚持不了。", "懒。"], mid: ["我想减肥但管不住嘴。", "放学后操场跑两圈？"],
      warm: ["你一点都不胖！不过想运动我陪你，每天放学一起跑。", "我当你私教，坚持一周请你喝奶茶当奖励。"] } },
    { id: "x565_yanjing", kws: ["近视", "眼镜", "看不清黑板", "换座位看不清", "视力"],
      rep: { cold: ["配眼镜。", "。"], mid: ["最近看黑板有点模糊，可能度数涨了。", "眼镜老是滑下来。"],
      warm: ["看不清就借我笔记抄！周末我陪你去验光，别拖着。", "我帮你把黑板上的重点念给你听，你先记着。"] } },
    { id: "x565_wenju", kws: ["借笔", "借橡皮", "笔袋", "文具", "没带笔", "尺子"],
      rep: { cold: ["不借。", "。"], mid: ["我又忘带笔了，借一支？", "橡皮又丢了。"],
      warm: ["给你！笔和橡皮都在你抽屉里了，我备了双份。", "我给你买了支同款笔，算是同桌的小礼物。"] } },
    { id: "x565_dashui", kws: ["打水", "接水", "饮水机", "开水房", "热水"],
      rep: { cold: ["自己去。", "嗯。"], mid: ["饮水机又排长队了。", "我去接点热水。"],
      warm: ["把水杯给我，我帮你打水，你坐着写作业。", "水有点烫，慢点喝，我帮你吹吹（笑）。"] } },
    { id: "x565_zuobi", kws: ["作弊", "传答案", "对答案", "小抄", "偷看"],
      rep: { cold: ["别干。", "会被抓。"], mid: ["作弊风险太大，不值得。", "抓到就是记过，别冒险。"],
      warm: ["与其想着作弊，不如我陪你复习，凭真本事考好，我帮你。", "不会的题问我，我教你，别走捷径。"] } },
    { id: "x565_shejiao", kws: ["社恐", "内向", "交朋友", "没有朋友", "融不进去"],
      rep: { cold: ["慢慢来。", "。"], mid: ["我不太会主动搭话。", "新班级有点融不进去。"],
      warm: ["你不需要讨好所有人，有我这个朋友就够啦。", "我带你认识我的朋友，慢慢来，不着急。"] } },
    { id: "x565_guimi", kws: ["闺蜜", "好兄弟", "死党", "最好的朋友", "朋友吵架"],
      rep: { cold: ["随缘。", "。"], mid: ["我和好朋友闹了点别扭。", "死党就是要一起挨骂。"],
      warm: ["我们当然是最好的朋友啦！拉钩，吵架不超过一天。", "你是我最在意的人，谁欺负你我第一个不答应。"] } },
    { id: "x565_yali", kws: ["压力大", "焦虑", "紧张", "担心考不好", "心态崩了", "学不进去"],
      rep: { cold: ["自己调节。", "。"], mid: ["压力大就先放下笔歇一会儿。", "我也经常焦虑，正常。"],
      warm: ["别给自己太大压力，你已经很努力了。来，深呼吸，我陪你。", "考不好也没关系，天塌不下来，我一直都在。"] } },
    { id: "x565_jiayou", kws: ["加油", "鼓励我", "没信心", "我不行", "想放弃"],
      rep: { cold: ["加油。", "。"], mid: ["你可以的，别灰心。", "坚持一下，马上就到了。"],
      warm: ["你超棒的！在我心里你一直很厉害，加油！", "想放弃的时候想想我在终点等你，别停下！"] } },
    { id: "x565_shengri", kws: ["生日", "生日快乐", "过生日", "生日礼物", "生日蛋糕"],
      rep: { cold: ["谢谢。", "嗯。"], mid: ["生日快乐！想要什么礼物？", "我差点忘了，还好有提醒。"],
      warm: ["生日快乐！我准备了很久的礼物，希望你喜欢。", "这是我亲手做的贺卡和蛋糕，新的一岁，我陪你。"] } },
    { id: "x565_liwu", kws: ["礼物", "送你", "小礼物", "回礼", "节日礼物"],
      rep: { cold: ["不用。", "。"], mid: ["你太客气啦，谢谢。", "突然送礼物我有点不好意思。"],
      warm: ["你送的我都喜欢！我会一直收着的。", "其实你在我身边就是最好的礼物啦。"] } },
    { id: "x565_tianqi_leng", kws: ["好冷", "降温", "加衣服", "手冷", "冻僵了"],
      rep: { cold: ["多穿点。", "。"], mid: ["今天降温了，教室有点冷。", "我手冻得握不住笔。"],
      warm: ["手冷就放我口袋里！我把围巾分你一半。", "我给你带了暖宝宝，贴着，别感冒。"] } },
    { id: "x565_tianqi_re", kws: ["好热", "出汗", "风扇", "空调", "中暑"],
      rep: { cold: ["忍着。", "。"], mid: ["教室风扇不太够，热。", "体育课跑完一身汗。"],
      warm: ["我给你带了冰水和小风扇，下课来我这儿凉快。", "擦擦汗，别贪凉直吹，会感冒的。"] } },
    { id: "x565_xiayu", kws: ["下雨", "没带伞", "淋雨", "伞", "暴雨"],
      rep: { cold: ["看天。", "。"], mid: ["好像要下雨，我没带伞。", "突然下雨了。"],
      warm: ["我带伞了！分你一半，一起走，淋不到你。", "等雨小一点，我先把你送到校门口。"] } },
    { id: "x565_yisheng", kws: ["医务室", "校医", "感冒", "发烧", "头疼", "肚子疼", "崴脚"],
      rep: { cold: ["多喝热水。", "。"], mid: ["不舒服就去医务室看看。", "我头疼，可能感冒了。"],
      warm: ["我陪你去医务室！你先坐着，我帮你请假、接热水。", "发烧了别硬撑，回家休息，笔记我帮你补。"] } },
    { id: "x565_yanhui", kws: ["文艺汇演", "元旦晚会", "十佳歌手", "迎新", "节目", "表演"],
      rep: { cold: ["围观。", "。"], mid: ["我们班出了个合唱节目。", "十佳歌手我报名了，紧张。"],
      warm: ["你上台我一定举着灯牌喊最大声！", "演出结束我在后台等你，给你献花。"] } },
    { id: "x565_youyuan", kws: ["游园会", "嘉年华", "义卖", "跳蚤市场", "美食节", "开放日"],
      rep: { cold: ["逛逛。", "。"], mid: ["游园会有好多小游戏。", "义卖我们班卖奶茶。"],
      warm: ["游园会我们一起逛！我套圈给你赢个娃娃。", "义卖你想吃什么我都买给你，顺便做公益。"] } },
    { id: "x565_biye", kws: ["毕业", "毕业照", "同学录", "毕业旅行", "分班", "舍不得"],
      rep: { cold: ["以后再说。", "。"], mid: ["想到要分班就有点难过。", "同学录你一定要给我写。"],
      warm: ["就算分班/毕业，我们也不会散，常联系，拉钩。", "毕业照我要站你旁边，同学录我写最长的那页。"] } },
    { id: "x565_xiazhang", kws: ["放暑假", "放寒假", "假期", "周末去哪", "放假安排"],
      rep: { cold: ["有作业。", "。"], mid: ["假期作业一大堆。", "放假想睡到自然醒。"],
      warm: ["假期我们一起去图书馆学习，学完去玩，安排好了！", "周末有空吗？我查了个地方，想带你去。"] } },
    { id: "x565_paiming", kws: ["排名", "年级排名", "进步", "退步", "成绩单", "几分"],
      rep: { cold: ["看榜。", "。"], mid: ["这次排名进步了几名。", "退步了，有点沮丧。"],
      warm: ["进步啦！我就知道你可以，继续保持！", "退步一次没关系，我们一起找原因，下次追回来。"] } },
    { id: "x565_danci", kws: ["背单词", "听写", "英语听力", "英语作文", "口语"],
      rep: { cold: ["自己背。", "。"], mid: ["单词背了又忘。", "明天英语听写，没准备。"],
      warm: ["每天睡前我给你发 10 个单词，互相听写，一起进步！", "听力我陪你练，口语你说给我听，我不笑你。"] } },
    { id: "x565_wenyanwen", kws: ["文言文", "古诗", "背诵", "默写", "翻译", "古文"],
      rep: { cold: ["多读。", "。"], mid: ["文言文翻译好难。", "默写总是写错字。"],
      warm: ["我整理了常考实词，给你一份！背诵我们互相抽查。", "古诗我教你按意思记，比死记硬背快多了。"] } },
    { id: "x565_wuli", kws: ["物理", "化学", "生物", "地理", "实验", "公式"],
      rep: { cold: ["难。", "。"], mid: ["物理受力分析老错。", "化学方程式记不住。"],
      warm: ["理综我来帮你！公式我整理成卡片，实验一起过一遍。", "这道题我会，下课给你讲，包你听懂。"] } },
    { id: "x565_shuxue", kws: ["数学", "压轴题", "函数", "几何", "大题", "数学好难"],
      rep: { cold: ["多做题。", "。"], mid: ["数学最后一道大题我直接放弃。", "函数图像看不明白。"],
      warm: ["压轴题我们一起拆解，一步一步来，你一定能做出来。", "我把数学笔记借你，看不懂的地方我当面讲。"] } },
    { id: "x565_zuowen", kws: ["作文", "写作文", "作文素材", "议论文", "作文不会写"],
      rep: { cold: ["背素材。", "。"], mid: ["作文总是写不够字数。", "议论文没思路。"],
      warm: ["我攒了一本素材本借你！写完我帮你改，会越来越顺。", "作文先写你真心想表达的，我陪你一起改。"] } },
    { id: "x565_zhudong", kws: ["一起走", "一起放学", "等我", "顺路", "一起回家", "陪我"],
      rep: { cold: ["看情况。", "。"], mid: ["好啊，校门口见。", "我收拾得慢，你等我一下。"],
      warm: ["当然等你！我每天都在校门口那棵树下等你。", "顺路，特别顺路，其实我家在反方向（小声）。"] } },
    { id: "x565_xihuan_what", kws: ["你喜欢什么", "你的爱好", "兴趣爱好", "你平时干嘛", "喜欢什么"],
      rep: { cold: ["随便。", "没什么。"], mid: ["看看书、听听歌。", "我喜欢运动/画画/听歌。"],
      warm: ["我喜欢的事……都和你有关。你呢，你喜欢什么？", "你想了解我呀？那我们慢慢聊，从最喜欢的开始。"] } },
    { id: "x565_baobao", kws: ["抱抱", "摸摸头", "牵个手", "想要抱抱", "靠一下"],
      rep: { cold: ["别。", "。"], mid: ["在学校呢，被人看见。", "……就一下下。"],
      warm: ["来，给你抱一下，充好电了再去上课。", "手给你牵，藏在袖子里，没人看见。"] } },
    { id: "x565_xiangni", kws: ["想你了", "好想你", "想见你", "一天没见", "假期想你"],
      rep: { cold: ["哦。", "。"], mid: ["才一天没见呀。", "我也是。"],
      warm: ["我也想你！下课就去找你，等我。", "你不说我也正想发消息给你，心有灵犀。"] } }
  ];
  try {
    if (window.XZ_AI_INTENTS && window.XZ_AI_INTENTS.push) {
      NEW_INTENTS.forEach(function (it) {
        if (!window.XZ_AI_INTENTS.some(function (x) { return x.id === it.id; })) {
          window.XZ_AI_INTENTS.push(it);
        }
      });
    }
  } catch (e) {}

  /* ─────────── 2) 5.6.5 更新日志置顶 ─────────── */
  try {
    if (window.X56Version && window.X56Version.history) {
      window.X56Version.history.forEach(function (c) { c.new = false; });
      var entry = {
        v: "5.6.5", d: "心之所向 · 稳定版（Pro）", new: true,
        list: [
          "🐛 修复剧情模式点女主/选项/地图无反应：事件绑定 this 丢失，现全部改为稳定的事件委托",
          "🎨 重做统一主题选择器：9 套皮肤（含回归「晴空 classic」、新增「青柚」「霓虹」）一个面板随心换，桌面/手机都能开，随时可返回",
          "🔧 修复工作台、5.5.9 按钮、右下 FAB 主题入口点了没反应/切不了/回不去的问题",
          "📱 历史性移动端修复：合成大西瓜「像素/忍者」竖条压画布、画布溢出、全屏面板无法返回，全部解决，且不影响桌面 UI",
          "⚡ 历史性性能优化：硬件分档（流畅/均衡/省电），弱机关闭昂贵高斯模糊，后台暂停高频循环，关闭游戏回收 rAF，长列表渲染隔离",
          "📱 新增「手机微信」：聊天列表、通讯录、对话气泡、正在输入、快捷语、未读角标，13 位联系人各有真人设回复",
          "🤖 微信聊天打通 AI 题库：复用 500+ 意图并新增 60+ 校园高频话题，老师/食堂/广播站/小助手都能聊",
          "🌈 朋友圈真正可发送：手机微信内即可发图文九宫格、加位置、点赞、评论、回复、删除，还能从聊天「分享到朋友圈」",
          "💬 修复朋友圈编辑器「加上位置」按钮引用未定义变量导致报错、无法发布的问题；NPC 会给你的动态点赞评论",
          "🎮 新增 3 个小游戏：接卷子、口算竞速、成语挑战（真实判定 + 本地最高纪录，已加入游戏中心）",
          "📧 新增 5.6.5 欢迎邮件与版本说明",
          "🧹 只增不删、集百家之长：保留 5.6 全部玩法与前作所有皮肤/工具/游戏，写得不稳的地方做了加固"
        ]
      };
      window.X56Version.history.unshift(entry);
      var _openCL = window.X56Version.openChangelog;
      window.X56Version.openChangelog = function () {
        try {
          if (window.X56 && typeof window.X56.closeModal === "function") {
            /* 保持原渲染逻辑，只改副标题 */
          }
        } catch (e) {}
        return _openCL.apply(this, arguments);
      };
      /* 修正副标题里的版本号 */
      var origOpen = window.X56Version.openChangelog;
      window.X56Version.openChangelog = function () {
        var _modal = window.modal;
        window.modal = function (h) {
          if (typeof h === "string") h = h.replace("5.6「心之所向」", "5.6.5「心之所向 · 稳定版」");
          return _modal(h);
        };
        var r = origOpen.apply(this, arguments);
        window.modal = _modal;
        return r;
      };
    }
  } catch (e) {}

  /* ─────────── 3) 5.6.5 欢迎邮件（只发一次） ─────────── */
  try {
    var MAIL_KEY = "xz565_mail_sent";
    if (!storageGet(MAIL_KEY) && typeof window.pushMail === "function") {
      window.pushMail({
        from: "5.6.5 制作组",
        sub: "5.6.5 稳定版来啦：手机微信、朋友圈可发、剧情与主题全修",
        body:
          "同学你好，欢迎更新到 5.6.5「心之所向 · 稳定版」！\n\n" +
          "本次重点修好了你最在意的问题：\n" +
          "· 剧情模式点人物没反应 → 已修，5 位女主的故事都能正常推进\n" +
          "· 主题点了没反应/回不去 → 统一主题选择器，9 套皮肤随便换，含你要的「晴空」\n" +
          "· 手机端画面错乱、严重卡顿、无法返回 → 已做历史性修复与性能优化\n\n" +
          "新玩法：\n" +
          "· 右下角新增「💬 微信」：能和同学、老师、食堂、广播站、AI 小助手聊天\n" +
          "· 微信里的「朋友圈」可以真正发图文，还能从聊天分享到朋友圈\n" +
          "· 游戏中心新增：接卷子、口算竞速、成语挑战\n\n" +
          "可在「我 → 性能模式」里按手机切换流畅/均衡/省电。\n" +
          "—— Laerrrus. 与 GLM Hy3 等技术支持团队",
        time: ""
      });
      storageSet(MAIL_KEY, "1");
    }
  } catch (e) {}
});


/* ===== p71_intents2.js ===== */
/* ============================================================================
   p71 · AI 题库再扩容（约 150 个校园高频意图，id 前缀 x565b_）
   覆盖运动/餐饮/宿舍/学科/情感/娱乐/生活/网络流行等，全部联系人共享
   紧凑数据驱动：每条 [id, 关键词, 冷, 中, 暖]，启动时映射为标准意图并去重
   ============================================================================ */
register("intents2-565", function () {
  if (!window.XZ_AI_INTENTS || !window.XZ_AI_INTENTS.push) return;
  function R(id, kws, cold, mid, warm) {
    return { id: "x565b_" + id, kws: kws, rep: { cold: [cold], mid: [mid], warm: [warm] } };
  }
  var LIST = [
    ["tiyucao", ["体育课", "体活课", "自由活动"], "别吵我打球。", "体育课又被数学老师盯上了，希望别被占。", "体育课我们一组吧，我教你投篮，摔了算我的。"],
    ["tiche", ["体测", "800米", "1000米", "立定跳远", "坐位体前屈", "引体向上", "仰卧起坐"], "到时候再跑。", "体测要来了，我八百米悬。", "别怕，我陪你练，早上绕操场跑两圈，体测那天我在终点等你。"],
    ["yundonghui", ["运动会", "校运会", "运动会项目", "接力", "拔河", "跳高", "跳远"], "看看就行。", "运动会我报了跳远，你报什么？", "运动会你比赛我给你加油拍照，跑完第一时间给你递水。"],
    ["lanqiu", ["篮球", "打球", "投篮", "三分球", "上篮", "篮球鞋"], "打球去。", "放学篮球场，缺一个人你来不？", "我教你三步上篮，你要是进球了，我请你喝冰水。"],
    ["yumaoqiu", ["羽毛球", "乒乓", "乒乓球", "球拍", "对打"], "随便打打。", "周三羽毛球社活动，你有拍吗？", "我多带了一支拍，你跟我一组，我让着你。"],
    ["tiaosheng", ["跳绳", "跳绳测试", "双摇"], "没带绳。", "跳绳测试我老绊脚，才一百多个。", "我陪你数，跳不过去我陪你重来，别急。"],
    ["paocao", ["跑操", "晨跑", "课间操", "广播体操", "做操"], "跟上就行。", "跑操一圈圈的，今天差点踩前面同学鞋。", "跑操我站你斜后方，你跑不动我小声喊你，别掉队。"],
    ["xiaomaibu", ["小卖部", "便利店", "小超市", "买点吃的"], "自己去。", "课间小卖部人挤人，要不要一起冲？", "我去小卖部，你要什么我给你带，冰的还是热的？"],
    ["naicha", ["奶茶", "奶茶店", "珍珠奶茶", "加珍珠"], "少喝点。", "下午想点杯奶茶续命，作业太多了。", "我给你点了你常喝的，三分糖去冰，课间来拿。"],
    ["lingshi", ["零食", "辣条", "薯片", "巧克力", "糖", "饼干", "零食柜"], "我自己有。", "上课偷偷吃薯片，差点被老师听见。", "我书包里有小零食，下课后分给你，草莓味的。"],
    ["paomian", ["泡面", "宵夜", "夜宵", "方便面"], "少熬夜吃。", "晚自习饿了，回宿舍想泡碗面。", "我藏了桶红烧牛肉面，你没吃的话我们分，一起去泡。"],
    ["paodui", ["排队", "加塞", "插队", "挤食堂"], "排队去。", "食堂排队排到怀疑人生，还有人插队。", "我帮你占好位置了，你直接过来，不用排那么久。"],
    ["guangpan", ["光盘", "剩饭", "吃不完", "菜太多"], "吃不完算了。", "今天菜量好大，我努力光盘。", "吃不完的给我，别浪费，我帮你清盘。"],
    ["ayi", ["食堂阿姨", "打菜阿姨", "手抖", "打菜"], "看运气。", "阿姨打菜手一抖，肉没了。", "我今天轮到阿姨心情好，打了满满一份，分你一半。"],
    ["kouwei", ["辣", "不辣", "微辣", "忌口", "挑食", "吃素"], "挑你的。", "今天的菜好辣，我吃不了。", "我帮你看了，窗口三有不辣的，走，我陪你去。"],
    ["fanka", ["饭卡", "校园卡", "校牌", "充值", "挂失", "饭卡没钱"], "去充值。", "饭卡又没钱了，中午得去充。", "先用我的，里面还有钱，你别不好意思，回头再还。"],
    ["waimai", ["外卖", "点外卖", "拿外卖", "围墙外卖"], "被抓就完了。", "想点外卖，但校门口保安管得严。", "我知道一个拿外卖的点，你别声张，拿到了一起吃。"],
    ["sushe", ["宿舍", "寝室", "回宿舍", "宿舍楼"], "回去睡。", "宿舍十一点熄灯，作业还没写完。", "宿舍晚上我帮你留着门，你慢点走，别摸黑摔着。"],
    ["chaqin", ["查寝", "宿管", "查房", "晚归"], "别被抓。", "宿管阿姨今天查得严，我们早点回。", "你晚归我帮你把东西准备好，动作轻一点，别被记名字。"],
    ["reshui", ["热水", "洗澡", "浴室", "热水器", "打水"], "看时间。", "热水十点就停了，我得快点洗。", "我帮你打好水了，壶在你床位旁边，趁热去。"],
    ["xiyi", ["洗衣机", "洗衣", "晾衣服", "没干"], "自己洗。", "回南天衣服晾三天都不干，愁。", "我多带了衣架，你衣服晾我这边通风，干得快。"],
    ["xideng", ["熄灯", "熄灯后", "宿舍灯", "夜聊"], "睡了。", "熄灯后我们寝室还在偷偷聊天。", "熄灯后我把耳机分你，小声点，别被宿管听到。"],
    ["shiyou", ["室友", "舍友", "上铺", "下铺", "打呼噜"], "习惯就好。", "室友打呼噜，我一晚没睡好。", "我有耳塞，给你一副，今晚保证你能睡个好觉。"],
    ["zoudu", ["走读", "回家", "通勤", "回家路线", "不住校"], "看你方便。", "走读每天来回有点累，但能吃到家里的饭。", "放学我们顺路，我陪你走到公交站，路上聊聊天。"],
    ["gongjiao", ["公交", "地铁", "班车", "等车", "共享单车"], "早点出门。", "今早公交晚点，差点迟到。", "下雨我多带了一把伞，等车的时候一起撑。"],
    ["zixingche", ["自行车", "骑车", "单车", "车棚"], "锁好车。", "车棚里我的车老是找不到。", "我车后座装了垫子，你要是不介意，可以带你一段。"],
    ["aoye", ["熬夜", "失眠", "睡不着", "赶作业到很晚", "通宵"], "别熬太晚。", "昨晚熬到一点，今天上课全程飘。", "你再熬夜我可要生气了，把作业收了，睡，我陪你早起补。"],
    ["zaoqi", ["早起", "起不来", "赖床", "闹钟", "起床气"], "定三个闹钟。", "我早上根本起不来，闹钟响了五个。", "明早我电话叫你，响到你接为止，保证你不赖床。"],
    ["keshui", ["困", "打瞌睡", "上课睡觉", "走神", "犯困"], "困就睡。", "第一节课就困得头一点一点的。", "你犯困就掐自己一下，我在你前桌，老师来了我提醒你。"],
    ["shouji", ["手机", "玩手机", "藏手机", "被没收", "手机充电", "充电宝"], "别被收。", "上课玩手机差点被班主任抓包。", "手机静音放我这儿，下课还你，省得你忍不住。"],
    ["wangji", ["忘带", "没带", "忘带课本", "忘带作业", "落教室了"], "下次记着。", "又忘带数学书，今天和同桌看一本。", "我的书分你一半，下次前一晚我提醒你收拾书包。"],
    ["jie", ["借", "借笔", "借橡皮", "借尺子", "借圆规", "借计算器"], "用完还我。", "我又找同桌借橡皮了，自己老忘。", "我备了双份文具，你缺什么直接拿，不用还。"],
    ["zuowei", ["座位", "换座位", "同桌", "调座位", "前桌", "后桌"], "听安排。", "听说下周要调座位，我不想和你分开。", "不管调到哪，我都申请和你近一点，课间还是能看见你。"],
    ["xiaofu", ["校服", "穿校服", "仪容", "没穿校服", "校服外套"], "穿着吧。", "周一升旗必须全套校服，我老忘。", "我多备了一件校服外套，你没穿的话先套上。"],
    ["faxing", ["发型", "刘海", "剪头发", "理发", "头发长"], "学校管。", "刘海被教导主任点名了，说太长。", "我觉得你现在的样子就很好看，别因为剪短了不开心。"],
    ["yanjing", ["眼镜", "近视", "看不清", "配眼镜", "度数"], "少看屏幕。", "坐后排看不清黑板，度数又涨了。", "我把笔记抄大一点给你，下课我陪你去验光。"],
    ["shengao", ["身高", "长高", "个子", "多高"], "正常发育。", "我最近好像又长高了一点。", "你站好，我用手比一下，嗯，好像真的长高了，挺好。"],
    ["banhui", ["班会", "主题班会", "班委", "班长", "班干部"], "听班长的。", "这周班会轮到我做分享，紧张。", "你的稿子我帮你看了，正常讲就好，我在台下给你鼓掌。"],
    ["jiazhanghui", ["家长会", "家长", "请家长", "我妈来"], "该来总会来。", "这次家长会我有点慌，成绩退步了。", "我们一起把错题补上，家长会之前我帮你提分，别怕。"],
    ["chengji", ["成绩", "成绩单", "分数", "排名", "进步了", "退步了"], "看开点。", "这次排名掉了五名，心情不太好。", "退步是暂时的，我们一起分析原因，下次一起追回来。"],
    ["zuoye", ["作业", "写作业", "作业好多", "作业没写完", "作业堆"], "抓紧写。", "今天九科作业，感觉写不完了。", "我帮你列个顺序，先写难的，写不完的我们互相照应，别慌。"],
    ["chaozuoye", ["抄作业", "对答案", "抄一下", "没写作业"], "自己写。", "数学作业没写完，想找你对一下。", "抄可以，但你先自己想一遍，我把思路给你，不然考试还是不会。"],
    ["kejidaibiao", ["课代表", "收作业", "抱作业", "发卷子"], "我先收了。", "我是课代表，早上又要抱一摞卷子。", "我帮你抱一半，卷子太多了，别一个人跑上跑下。"],
    ["shiti", ["卷子", "刷题", "试卷", "真题", "模拟卷"], "慢慢刷。", "卷子像雪花一样发下来，桌洞都满了。", "我整理了各科的卷子，你要哪科我给你划重点。"],
    ["yinzufu", ["耳塞", "口罩", "纸巾", "湿巾", "创可贴"], "自己备着。", "我书包里永远缺这些小东西。", "我笔袋里有创可贴和纸巾，你需要直接拿，不用客气。"],
    ["wuli", ["物理", "力学", "电学", "受力分析", "电路图"], "有点难。", "物理受力分析我老画错。", "放学我给你画一遍图，你就明白了，我物理还行。"],
    ["huaxue", ["化学", "方程式", "元素周期表", "配平", "实验现象"], "背方程式。", "化学方程式总是配不平。", "我有配平的口诀，教你，配平其实就是数原子。"],
    ["shengwu", ["生物", "遗传", "细胞", "光合作用", "孟德尔"], "看图记。", "遗传图解绕得我头都大了。", "我把显性隐性画成树状图，你跟着我推一遍就通了。"],
    ["lishi", ["历史", "年代", "时间轴", "背历史", "材料题"], "列时间轴。", "历史年代老是记混。", "我做了时间轴小卡片，按顺序背，比死记硬背快多了。"],
    ["dili", ["地理", "地图", "气候", "经纬度", "等高线"], "看图。", "等高线地形图我看不太懂。", "我教你认山脊和山谷，画两道线你就会了。"],
    ["zhengzhi", ["政治", "道法", "大题", "时政", "知识点"], "背框架。", "政治大题不知道怎么组织语言。", "政治按‘是什么、为什么、怎么做’写，我给你套个模板。"],
    ["yingyu", ["英语", "完形", "阅读", "作文", "听力", "单词"], "多背单词。", "英语听力一快就跟不上。", "我每天陪你听一段，听不懂的地方反复听，慢慢就好了。"],
    ["yuwen", ["语文", "文言文", "古诗", "阅读理解", "作文"], "多积累。", "作文总是跑题，分数上不去。", "作文先列提纲再动笔，我帮你看立意，一起进步。"],
    ["shuxue", ["数学", "函数", "几何", "导数", "压轴题"], "多做题。", "最后一道压轴题我直接放弃了。", "压轴题前两问不难，我们一起拆，能拿的分别丢。"],
    ["xinxi", ["信息课", "电脑课", "机房", "编程", "打字"], "上机别玩。", "信息课终于能名正言顺摸电脑了。", "机房的作业我帮你看着点，做完我们再玩会儿小游戏。"],
    ["shiyan", ["实验课", "实验室", "物理实验", "化学实验", "显微镜"], "注意安全。", "化学实验酒精灯我有点怕。", "我站你旁边，按步骤来，手别抖，我帮你递器材。"],
    ["baiBan", ["希沃", "白板", "投影", "黑板", "粉笔", "讲台"], "认真看。", "今天轮到我上白板做题，字写得歪。", "我在台下帮你看答案，你大胆写，错了有我。"],
    ["tushuguan", ["图书馆", "借书", "还书", "阅览室", "自习室"], "安静点。", "图书馆靠窗的位置最抢手，得早去。", "我帮你占了座，你放学问我拿钥匙，我在老位置等你。"],
    ["caochang", ["操场", "跑道", "足球场", "看台", "草坪"], "去活动。", "傍晚操场的风很舒服，想去走走。", "晚自习前我们去操场走两圈吧，看看夕阳，放松一下。"],
    ["tiantai", ["天台", "顶楼", "天台门", "看风景"], "别上去。", "听说天台看夕阳特别好看。", "天台风大，你要是想去，放学我陪你，注意安全。"],
    ["huayuan", ["花园", "小花园", "亭子", "桂花", "银杏", "香樟"], "挺安静的。", "小花园的桂花开了，香得很。", "课间我带你去小花园，桂花树下有张长椅，我想和你坐一会儿。"],
    ["liulangmao", ["猫", "流浪猫", "校园猫", "橘猫", "喂猫"], "别乱喂。", "校门口有只橘猫，胖胖的很亲人。", "我带了猫粮，下课一起去喂它，它好像认识你了。"],
    ["xiayu", ["下雨", "大雨", "没带伞", "淋雨", "暴雨"], "带伞。", "又没带伞，放学肯定要淋。", "我有两把伞，分你一把，或者我们挤一把，反正顺路。"],
    ["xiaxue", ["下雪", "雪", "打雪仗", "堆雪人"], "注意保暖。", "听说下周要下雪，好期待。", "下雪了我们一起去操场，我给你堆个雪人，别冻着耳朵。"],
    ["tianqi", ["天气", "好热", "好冷", "降温", "高温", "紫外线"], "看预报。", "今天热得没力气上课。", "我给你带了小风扇和冰水，热了就跟我说，别中暑。"],
    ["kaixin", ["开心", "高兴", "心情好", "太好了", "兴奋"], "开心就好。", "今天莫名心情好，走路都想蹦跶。", "看你开心我也跟着高兴，是什么好事，说给我听听？"],
    ["nanguo", ["难过", "不开心", "委屈", "想哭", "心情差", "emo"], "自己消化。", "今天有点难过，说不上为什么。", "你别一个人扛，想哭就靠一下，我在这儿，哪儿也不去。"],
    ["shengqi", ["生气", "气", "气死了", "恼火", "不爽"], "消消气。", "刚才那件事真把我气到了。", "先深呼吸，谁惹你了我去帮你理论，别气坏身体。"],
    ["jiaolv", ["焦虑", "紧张", "压力大", "心慌", "担心"], "放轻松。", "一想到考试就紧张得睡不着。", "紧张说明你在乎，我们把能做的都做了，剩下的交给临场，我陪你。"],
    ["guli", ["加油", "鼓励", "没信心", "我不行", "做不到"], "你可以的。", "我觉得自己最近什么都做不好。", "别这么说，你已经很努力了，我一直相信你，我们慢慢来。"],
    ["anwei", ["安慰", "安慰我", "抱抱", "陪陪我"], "会好的。", "今天特别需要被安慰。", "过来，什么都不用说，先抱一下，然后告诉我发生了什么。"],
    ["daoqian", ["对不起", "抱歉", "我错了", "道歉", "原谅我"], "下次注意。", "刚才是我语气不好，对不起。", "我接受你的道歉，其实我也没生气，我们别为小事别扭了。"],
    ["xiexie", ["谢谢", "感谢", "谢了", "麻烦你了"], "客气。", "今天真的谢谢你帮我。", "跟我还客气什么，以后我有需要也找你，说好了。"],
    ["wanan", ["晚安", "睡了", "早点睡", "睡觉去"], "晚安。", "晚安，明天还要早起。", "晚安，盖好被子，梦里见，明早我叫你起床。"],
    ["zaoan", ["早安", "早上好", "早", "醒了吗"], "早。", "早，刚到教室。", "早呀，我给你带了热豆浆，趁热喝，今天也要开心。"],
    ["chifan", ["吃饭了吗", "吃了吗", "午饭", "晚饭", "吃饭"], "吃过了。", "还没吃，忙着赶作业。", "那怎么行，作业先放放，我陪你去食堂，人是铁饭是钢。"],
    ["zaiganma", ["在干嘛", "干嘛呢", "在吗", "忙吗"], "没干嘛。", "在刷题，手都快写断了。", "在想你呀——顺便写作业，你呢，今天累不累？"],
    ["xiangni", ["想你", "想见你", "好想你", "想你了"], "嗯。", "周末没见到你，有点想。", "我也是，课间都习惯回头找你了，明天早点来，我想见你。"],
    ["xihuan", ["喜欢你", "我喜欢你", "表白", "做我对象", "在一起"], "现在以学习为主。", "你突然这么说，我有点慌……让我想想。", "其实我等这句话很久了，我也喜欢你，我们一起好好走下去。"],
    ["anlian", ["暗恋", "有喜欢的人", "心动", "crush"], "别说出去。", "我好像有个偷偷喜欢的人。", "那你多看看那个人的眼睛，也许你会发现，他也在看你。"],
    ["chicu", ["吃醋", "嫉妒", "你和别人", "不理我"], "别多想。", "刚看到你和别人聊得很开心，心里怪怪的。", "吃醋啦？别人都是普通朋友，我最在意的人是你，只给你带早餐。"],
    ["pengyou", ["朋友", "闺蜜", "好兄弟", "好朋友", "绝交"], "处不来就散。", "和好朋友闹别扭了，有点难受。", "真正的朋友吵不散，等都冷静了，你先递个台阶，我支持你。"],
    ["bagua", ["八卦", "谁喜欢谁", "绯闻", "吃瓜", "他们在一起了"], "听听就好。", "听说隔壁班那对在一起了，你知道吗？", "别人的瓜我们少吃，我更想知道，你什么时候和我‘被传绯闻’。"],
    ["yuehui", ["约会", "周末出去玩", "看电影", "逛街", "一起去"], "看时间。", "周末想约你出去玩，不知道你有空没。", "有空！我早就想和你去看那部电影了，几点，我去找你。"],
    ["liwù", ["礼物", "送什么", "生日礼物", "挑礼物", "买什么好"], "投其所好。", "好朋友生日，不知道送什么。", "送对方真正用得上的，要是你送我，写张卡片我就很开心。"],
    ["fangjia", ["放假", "寒假", "暑假", "假期", "周末安排"], "好好休息。", "终于放假了，我想睡到自然醒。", "放假也要规律点，作业我们每天写一点，剩下的时间好好玩。"],
    ["buzuoye", ["补作业", "假期作业", "赶作业", "开学补作业"], "早点写。", "假期最后一天，我还在疯狂补作业。", "我就知道，发你答案了，但你要看懂，下次我们一起提前写。"],
    ["biye", ["毕业", "毕业照", "同学录", "签名", "留念"], "以后常联系。", "想到要毕业就有点舍不得。", "不管以后去哪，我们都保持联系，毕业照我要站你旁边。"],
    ["youxi", ["游戏", "手游", "开黑", "排位", "上分", "段位"], "少玩点。", "昨晚排位连跪，心态崩了。", "游戏而已，别气，我陪你打一局翻盘，打完就去写作业。"],
    ["pifu", ["游戏皮肤", "抽卡", "氪金", "非酋", "欧皇"], "别乱花钱。", "抽卡又保底了，我是非酋本酋。", "别氪金啦，皮肤又不能帮你写作业，运气总会来的。"],
    ["fangchenmi", ["防沉迷", "限时", "游戏时间", "未成年"], "遵守规定。", "防沉迷只给周五周六晚上玩，好少。", "那就更珍惜能玩的时间，平时我们打球聊天，不比游戏差。"],
    ["shipin", ["短视频", "刷视频", "追剧", "综艺", "番", "动漫", "小说"], "别刷太久。", "昨晚刷视频刷到一点，停不下来。", "我定时来‘查岗’，你把手机放远一点，刷久了眼睛疼。"],
    ["tingge", ["听歌", "耳机", "歌单", "音乐", "推荐歌"], "我也喜欢。", "最近循环一首歌，听不腻。", "你把歌单发我，我也听听，想听听你喜欢的旋律是什么样的。"],
    ["zhuixing", ["偶像", "追星", "演唱会", "应援", "周边"], "理性追星。", "抢到演唱会门票了，超激动！", "恭喜呀，注意安全，你开心我就开心，回来给我讲讲现场。"],
    ["shouzhang", ["手账", "贴纸", "胶带", "便利贴", "文具控"], "挺治愈。", "又买了一堆贴纸，忍不住。", "你做的手账很好看，下次教我，我想做一本记录我们的。"],
    ["chuanza", ["穿搭", "衣服", "搭配", "好看吗", "买衣服"], "干净就好。", "明天要拍照，不知道穿什么。", "你穿那件浅色的就很好看，干净利落，相信我。"],
    ["kafei", ["咖啡", "美式", "拿铁", "提神"], "少喝。", "困得不行，想喝杯咖啡续命。", "咖啡空腹伤胃，我给你带了牛奶，实在困就喝半杯，别多。"],
    ["shuiguo", ["水果", "酸奶", "牛奶", "早餐", "营养"], "均衡点。", "最近总不吃早饭，胃不舒服。", "我每天多带一个苹果，分给你，早餐必须吃，这是命令。"],
    ["shengbing", ["感冒", "发烧", "生病", "不舒服", "头疼", "肚子疼", "喉咙痛"], "去医务室。", "我好像感冒了，头好沉。", "你先去医务室量体温，我帮你请假，多喝热水，作业我帮你抄。"],
    ["niushang", ["扭伤", "崴脚", "擦伤", "摔伤", "受伤"], "别硬撑。", "打球崴脚了，肿了一块。", "别动，我扶你去医务室，严重的话告诉老师，别硬扛。"],
    ["zhongshu", ["中暑", "头晕", "太热晕倒", "藿香正气"], "到阴凉处。", "军训站军姿差点中暑。", "快到树荫下，我给你准备了水和藿香正气，别硬撑。"],
    ["qingjia", ["请假", "病假", "事假", "假条"], "走流程。", "想请个假，不知道怎么开口。", "身体不舒服就请，假条我帮你带给老师，好好休息。"],
    ["zhuanxuesheng", ["转学", "转学生", "新同学", "分班", "新生"], "慢慢适应。", "听说我们班要来个转学生。", "新同学来，我们主动一点，换位想想，换我也会紧张。"],
    ["ziwojieshao", ["自我介绍", "上台发言", "演讲", "演讲紧张"], "多练。", "一上台自我介绍就紧张结巴。", "我在台下给你眼神鼓励，把观众当成我，慢慢说就好。"],
    ["shekong", ["社恐", "内向", "不好意思", "不敢说话", "社交恐惧"], "做自己。", "我有点社恐，人多就紧张。", "没关系，你不用逼自己外向，在我身边你怎么舒服怎么来。"],
    ["zibei", ["自卑", "没自信", "觉得自己差", "不如别人"], "别否定自己。", "总觉得别人都比我好。", "你只看到别人的光，没看到自己的亮，你在我眼里特别好。"],
    ["mubiao", ["目标", "理想", "梦想", "想成为", "规划"], "一步一步来。", "有点迷茫，不知道以后想干嘛。", "迷茫很正常，我们先把眼前的事做好，边走边找，我陪你。"],
    ["toutou", ["传纸条", "小纸条", "上课传", "纸条"], "别被发现。", "上课传纸条差点被老师抓到。", "纸条我都收着，等毕业那天给你看，是我们的秘密。"],
    ["dianbiaoqing", ["表情包", "斗图", "发图", "存图"], "别刷屏。", "我们来斗图啊，我图多得很。", "你发的表情包太逗了，我都存了，专门建了个你的相册。"],
    ["qunliao", ["群聊", "班级群", "群消息", "免打扰", "99+"], "屏蔽了。", "班级群消息99+，全是斗图。", "重要通知我帮你盯着，你开免打扰吧，有正事我喊你。"],
    ["pengyouquan", ["朋友圈", "发动态", "点赞", "评论", "九宫格"], "随手发。", "想发条朋友圈，不知道配什么文案。", "发你最真实的样子就好，我第一个点赞，再认真评论一条。"],
    ["touxiang", ["头像", "昵称", "个性签名", "网名"], "看心情。", "想换个头像，挑了半天。", "你用那个侧脸的就很好看，要不要我帮你拍一张？"],
    ["bishi", ["壁纸", "锁屏", "手机壁纸", "屏保"], "喜欢就好。", "手机壁纸换了又换。", "我拍了张夕阳，特别适合当壁纸，发你，就当我陪你。"],
    ["shudian", ["书店", "文具店", "买资料", "辅导书", "练习册"], "挑需要的。", "想去书店买本练习册。", "周末我陪你去，顺便挑两本好用的，我帮你看适不适合。"],
    ["dayin", ["打印", "复印", "资料", "打印店"], "去图书馆。", "老师发的资料要打印，我这儿没有。", "我去打印店，帮你一起打了，下课来我这儿拿。"],
    ["kuaidi", ["快递", "取件", "包裹", "菜鸟驿站"], "记得取。", "快递到了，在北门驿站，懒得出门。", "我正好要去取，报取件码给我，顺便帮你拿回来。"],
    ["chongdian", ["充电", "插座", "教室充电", "充电器"], "别被没收。", "教室插座被占满了，手机没电。", "我这儿有充电宝，先给你充，别上课偷偷拔老师的。"],
    ["yanbaocao", ["眼保健操", "做操", "揉眼睛", "眼保健操音乐"], "认真做。", "眼保健操总偷偷睁眼。", "认真做，对你眼睛好，你近视度数够高了，我盯着你做。"],
    ["xiahuibao", ["校牌", "门禁", "刷卡", "门卫", "保安"], "带好卡。", "忘带校牌，被保安拦在门口。", "你在门口等我，我帮你和老师说一声，或者陪你登记。"],
    ["laoshi", ["老师", "班主任", "年级主任", "校长", "教导主任"], "尊重老师。", "今天被班主任叫去谈话了。", "先听听老师说什么，有道理就改，觉得委屈回来告诉我，我帮你理。"],
    ["baoming", ["报名", "活动报名", "比赛报名", "竞赛报名"], "别错过时间。", "想报名一个比赛，纠结要不要。", "想试就去报，结果不重要，报名表我陪你一起填。"],
    ["jianyi", ["建议", "怎么办", "你说我该", "帮我出主意"], "看情况。", "有件事我不知道怎么办，想听你的。", "你先把情况告诉我，我们一起分析，不管你怎么决定，我都支持你。"],
    ["wuyu", ["无语", "离谱", "绝了", "逆天"], "确实。", "今天遇到的事离谱到我无语。", "哈哈怎么了，说出来让我评评理，我站你这边。"],
    ["kele", ["哈哈", "好笑", "笑死", "搞笑", "哈哈哈"], "挺好笑。", "今天班里发生一件巨好笑的事。", "快讲快讲，我就喜欢你笑得眼睛弯弯的样子。"],
    ["lei", ["累", "好累", "疲惫", "身心俱疲", "不想动"], "早点歇。", "今天累到不想说话。", "那你先靠着休息一会儿，水给你倒好了，等会儿想吃什么我去买。"],
    ["e", ["饿", "好饿", "肚子叫", "饿了"], "去吃点。", "还没到饭点，肚子就咕咕叫了。", "我书包里有面包，先垫垫，放学第一时间陪你冲食堂。"],
    ["ke", ["渴", "好渴", "想喝水", "没水了"], "去接水。", "杯子空了，懒得去打水。", "把杯子给我，我顺便帮你接，要温的还是热的？"],
    ["leng", ["好冷", "冷", "降温好冷", "手凉"], "多穿点。", "今天突然降温，我穿少了，手冰凉。", "我把外套给你，手伸过来，我帮你捂一捂，明天记得加衣。"],
    ["re", ["好热", "热死", "闷热", "出汗"], "多喝水。", "教室里闷得像蒸笼。", "我带了扇子和湿巾，给你扇扇，多喝水，别中暑。"],
    ["kunle", ["无聊", "没意思", "好无聊", "打发时间"], "找点事做。", "课间好无聊，干什么呢。", "无聊就找我呀，我给你讲个冷笑话，或者我们去走廊看看云。"],
    ["xiaohua", ["笑话", "讲个笑话", "冷笑话", "逗我笑"], "我不擅长。", "心情不好，讲个笑话呗。", "好，你听着——‘为什么数学书总是很忧郁？因为它有太多问题。’笑了吗？"],
    ["caiquan", ["猜拳", "石头剪刀布", "掷骰子", "随机"], "来。", "谁去拿外卖，石头剪刀布？", "来，我让你先出，输了的人跑腿，赢了的人请喝水。"],
    ["kaoqian", ["考前", "明天考试", "没复习", "裸考", "临阵磨枪"], "看重点。", "明天就考了，我感觉啥都没复习。", "别慌，现在抓最核心的知识点，我陪你过一遍重点，能提一分是一分。"],
    ["kaohou", ["考完", "对答案", "考砸了", "解放了"], "别想了。", "刚考完，感觉要凉。", "考完就别想了，下一场继续，走，先去吃饭，吃饱再战。"],
    ["zuowen", ["作文素材", "作文题目", "议论文", "记叙文"], "多积累。", "议论文总写不出素材。", "我整理了一些通用素材，发你，关键是观点+例子+总结。"],
    ["beisong", ["背诵", "背书", "默写", "必背"], "反复背。", "必背篇目太多，背了就忘。", "我们互相抽查，分段背，比一个人默记牢，放学我陪你过一遍。"],
    ["baofeng", ["台风", "暴雨预警", "停课", "放假通知"], "等通知。", "听说有台风，会不会停课？", "等学校通知，别自己兴奋，真停课就在家好好学习，注意安全。"],
    ["huancheng", ["换乘", "怎么走", "路线", "地图", "找不到路"], "导航一下。", "校外实践的地方我不认识路。", "我查好路线了，跟着我走，你负责看风景，我负责不迷路。"],
    ["xiaowai", ["校外", "出校", "校外时光", "放学去哪"], "注意安全。", "放学不想直接回家，想在外面逛逛。", "那我陪你去江边走走，早点回家报个平安，别让家里担心。"],
    ["qingong", ["勤工俭学", "兼职", "打工", "赚零花钱"], "别影响学习。", "想勤工俭学赚点零花钱。", "可以，但别耽误学习，学校的岗位优先，安全第一，需要参考我陪你。"],
    ["chenghao", ["称号", "成就", "成就墙", "解锁"], "慢慢解锁。", "我想解锁‘学霸’称号，还差一点。", "那我们一起努力，你离目标不远了，我帮你盯着进度。"],
    ["jineng", ["技能", "技能点", "特长", "兴趣班"], "多练。", "想培养个特长，但不知道学什么。", "你对什么有兴趣就试什么，喜欢的事坚持下来，就是特长。"],
    ["jianzhi", ["见闻", "日记", "记录", "今天发生的事"], "随手记。", "今天发生了好多事，想记下来。", "你写下来，以后回看特别有意思，要不要也把我写进去？"],
    ["xiuxi", ["休闲", "放松", "解压", "减压"], "换换脑子。", "学累了，想找个方式放松。", "我们去操场走两圈，或者听两首歌，别一直绷着，放松才有效率。"],
    ["zhixiang", ["志向", "心之所向", "志愿", "未来想做"], "想清楚。", "老师问我心之所向是什么，我答不上来。", "心之所向不是一下子想明白的，你喜欢什么、擅长什么，我们慢慢找。"],
    ["qiandao", ["签到", "每日签到", "打卡", "每日任务"], "记得签。", "今天的签到还没点，差一点忘。", "我提醒你，每天签到攒积分，连续打卡还有奖励。"]
  ];
  var add = 0;
  LIST.forEach(function (t) {
    var it = R(t[0], t[1], t[2], t[3], t[4]);
    if (!window.XZ_AI_INTENTS.some(function (x) { return x.id === it.id; })) {
      window.XZ_AI_INTENTS.push(it);
      add++;
    }
  });
  try { window.X565 = window.X565 || {}; window.X565.intentsAdded = add; } catch (e) {}
});


/* ===== p72_intents3.js ===== */
/* ============================================================================
   p72 · AI 题库再扩容（第三批 ~95 个意图，id 前缀 x565c_）
   覆盖学科/考试/情绪/人际/活动/校规/爱好/流行语等，全部联系人共享
   ============================================================================ */
register("intents3-565", function () {
  if (!window.XZ_AI_INTENTS || !window.XZ_AI_INTENTS.push) return;
  function R(id, kws, cold, mid, warm) {
    return { id: "x565c_" + id, kws: kws, rep: { cold: [cold], mid: [mid], warm: [warm] } };
  }
  var LIST = [
    ["wuli", ["物理", "受力分析", "牛顿", "电磁", "电路", "力学"], "公式背了吗。", "物理受力分析我老是画错。", "你把受力图分步画，我陪你一题一题来，先隔离物体再标力。"],
    ["huaxue", ["化学", "方程式", "元素周期", "有机", "摩尔", "离子"], "多背方程式。", "化学方程式配平总错。", "我整理了配平口诀，放学给你讲，配平就是数原子守恒。"],
    ["shengwu", ["生物", "细胞", "遗传", "孟德尔", "基因", "光合作用"], "看图理解。", "遗传概率题算不清。", "你先分清显隐性，再画遗传图解，我陪你推几道典型题。"],
    ["lishi", ["历史", "年份", "时间线", "朝代", "大题", "史料"], "做时间轴。", "历史年份记不住，串不起来。", "我们一起画时间轴，把事件按因果排，比死记年份管用。"],
    ["dili", ["地理", "经纬", "气候", "等高线", "洋流", "区位"], "结合地图。", "地理等高线我看不出地形。", "等高线凸向高处是谷，我给你画几个例子，一看就懂。"],
    ["zhengzhi", ["政治", "道法", "主观题", "知识点", "时政", "答题模板"], "分点作答。", "道法主观题写了一大堆没分。", "你按“是什么、为什么、怎么做”分点，我帮你套模板。"],
    ["shuxue", ["数学", "函数", "几何", "导数", "圆锥曲线", "数列"], "刷题。", "数学压轴题我直接放弃。", "压轴题第一问一般不难，先把能拿的分拿到，我陪你拆第二问。"],
    ["yuwen", ["语文", "作文", "文言文", "古诗", "阅读理解", "默写"], "多积累。", "作文总是写不到点子上。", "你先列提纲再动笔，我帮你改开头和分论点。"],
    ["yingyu", ["英语", "单词", "听力", "完形", "阅读", "语法"], "坚持背。", "英语阅读看得懂单词却选不对。", "阅读题要回原文找依据，不能凭感觉，我教你定位关键词。"],
    ["yuekao", ["月考", "单元考", "周测", "小测", "周考"], "正常发挥。", "明天又要月考，我还没复习完。", "先抓错题和基础，别贪难题，我把重点整理给你，今晚看我的。"],
    ["qimo", ["期中", "期末", "期中考试", "期末考试", "统考"], "提前复习。", "期末范围太大，不知道从哪开始。", "我们做个复习计划表，按科目轮流过，你不是一个人在扛。"],
    ["gaokao", ["高考", "中考", "选科", "分班", "志愿填报", "分数线"], "还早。", "一想到高考就有点慌。", "把大目标拆成每天的小任务，你只管把今天做好，剩下的我陪你。"],
    ["fuxi", ["复习", "怎么复习", "复习计划", "知识点", "笔记"], "列计划。", "复习毫无头绪，越看越乱。", "先目录再错题，最后回归课本，我陪你按这个顺序走一遍。"],
    ["cuoti", ["错题本", "错题", "订正", "同类题"], "多回顾。", "错题本抄了从来不看。", "错题不是抄完就完，每周我陪你重做一遍，错过的不再错。"],
    ["datika", ["答题卡", "涂卡", "填涂", "准考证"], "别涂错。", "我每次涂卡都怕串行。", "做完一组涂一组，最后留五分钟检查，我提醒你。"],
    ["kaoshibense", ["紧张", "考试紧张", "手抖", "脑子空白", "考前焦虑"], "深呼吸。", "一进考场脑子就空白。", "考前别再刷新题，深呼吸三次，你准备得够了，我在考场外等你。"],
    ["chenji", ["成绩", "排名", "分数", "退步", "进步"], "别只看分。", "这次排名掉了，心里难受。", "一次排名说明不了什么，我们看错题背后的原因，下次追回来。"],
    ["jiaban", ["补课", "课外班", "辅导班", "补习班", "周末上课"], "看情况。", "周末全是补课，一点休息时间都没有。", "留半天给自己放空，绷太紧会断弦，效率比时长重要。"],
    ["zuoye", ["作业", "写作业", "作业多", "没写完", "抄作业"], "别拖。", "作业写到十二点还没写完。", "你先挑必须交的、分值高的做，写不完的我帮你看怎么安排。"],
    ["tuoyan", ["拖延", "不想写", "懒", "提不起劲", "明日复明日"], "先动起来。", "我总是拖到最后一刻才写。", "用番茄钟，先只做五分钟，开始了就停不下来，我陪你计时。"],
    ["ziji", ["自卑", "不行", "比不过", "别人都好", "我很差"], "别否定自己。", "我感觉自己什么都不如别人。", "你有很多别人没有的闪光点，别只盯着分数，我看到的你很努力。"],
    ["zixin", ["没自信", "不敢", "害怕发言", "上台", "怯场"], "多练。", "一上台就紧张得说不出话。", "我们先在小范围练，再一步步来，我当你的第一个听众，给你鼓掌。"],
    ["gudao", ["孤独", "没朋友", "一个人", "融不进", "被孤立"], "会好的。", "在班里总觉得自己是一个人。", "明天午休我陪你一起吃饭，朋友是从一起做事开始的，别把自己关起来。"],
    ["xiangjia", ["想家", "想妈妈", "想爸妈", "住宿不习惯"], "慢慢适应。", "住校第一周，特别想家。", "想家人就给他们打个电话，我陪你到阳台，慢慢会习惯的。"],
    ["chaojia", ["吵架", "闹矛盾", "冷战", "和同学", "和朋友", "闹翻"], "先冷静。", "我和最好的朋友吵架了，谁也不理谁。", "先别急着争对错，等情绪过了，我陪你一起去说第一句话。"],
    ["daoqian", ["道歉", "不好意思", "说错话", "后悔"], "真诚就好。", "我话说重了，不知道怎么道歉。", "真诚说一句“我不该那样说”，比面子重要，我陪你一起去找他。"],
    ["beiju", ["被拒绝", "被嘲笑", "被笑话", "嘲笑", "嘲笑我"], "别往心里去。", "我发言被同学笑了，很难堪。", "笑你的人未必比你强，你敢站起来就赢了，我觉得你很勇敢。"],
    ["anlian", ["暗恋", "有好感", "喜欢一个人", "心动", "偷偷喜欢"], "正常。", "我好像喜欢上一个人，又不敢说。", "喜欢一个人不丢人，先把自己变好，等合适的时机，我帮你壮胆。"],
    ["biaobai", ["表白", "告白", "说喜欢", "情书", "在一起"], "想清楚。", "我想表白，又怕被拒绝。", "先看看对方的心意，如果你决定说，我支持你，无论结果我都在。"],
    ["chicu", ["吃醋", "在意", "他和别人", "酸"], "正常。", "看到他和别人说话，我心里有点酸。", "会吃醋说明你在乎，但别憋着，找个轻松的时机告诉他你的感受。"],
    ["fenshou", ["分手", "被拒绝了", "拒绝", "做回朋友"], "会过去。", "我被拒绝了，很难受。", "难受是正常的，给自己一点时间，你值得被喜欢，我陪着你慢慢走出来。"],
    ["laoshi", ["老师", "班主任", "被批评", "请家长", "批评"], "看情况。", "今天被老师当众批评，很委屈。", "先分清是误会还是自己的问题，要是误会，下课我陪你去解释。"],
    ["jiazhang", ["父母", "爸妈", "家里", "被催", "家长压力"], "沟通。", "爸妈只关心成绩，从来不问我累不累。", "他们的方式让你委屈，但你可以找个平静的时候说出你的感受。"],
    ["junxun", ["军训", "教官", "站军姿", "晒黑"], "坚持。", "军训站军姿好累，晒得脱皮。", "记得补水、涂防晒，撑不住就打报告，我给你备了藿香正气水。"],
    ["yanxue", ["研学", "春游", "秋游", "社会实践", "研学旅行"], "放松学。", "研学旅行要分组，我怕没人要我。", "你来我们组，我们一起规划路线，保证你玩得开心。"],
    ["wenhuajie", ["文化节", "艺术节", "校园节", "嘉年华", "游园会"], "很热闹。", "文化节我没什么才艺，只能当观众。", "当观众也很好，你要是想参与，我陪你一起报个后勤或小游戏摊位。"],
    ["shetuan", ["社团", "招新", "社团活动", "入社"], "选喜欢的。", "社团太多，不知道选哪个。", "选一个你真正感兴趣的，我可以陪你去体验几次再决定。"],
    ["xiaofu", ["校服", "穿校服", "改裤脚", "校徽"], "按规定。", "校服穿着好丑，不想穿。", "学生时代的校服以后会怀念，干净整洁就好看，别有太多心理负担。"],
    ["shouji", ["手机", "带手机", "被没收", "玩手机", "手机管理"], "遵守规定。", "手机差点被老师收走。", "上课把手机放书包最底层，别给自己分心的机会，我陪你一起克制。"],
    ["weiji", ["违纪", "扣分", "纪律", "登记", "通报"], "别碰。", "班里这个月被扣分了，班主任很生气。", "纪律是底线，我们做好自己该做的，别在这种事上冒险。"],
    ["liuxing", ["网络热梗", "热梗", "网络用语", "流行语", "梗"], "适度玩。", "最近的梗我都跟不上，同学说我 out 了。", "梗是用来笑的，不是用来比较的，你讲给我听，我学，你就是我老师。"],
    ["dongman", ["动漫", "番", "二次元", "漫画", "cos"], "适度看。", "最近追的番太好看了，熬夜看到凌晨。", "好看可以，但别熬夜，我们约好周末一起看两集，平时先好好学。"],
    ["youxi", ["游戏", "开黑", "上分", "手游", "联机"], "控制时间。", "想打游戏又怕影响学习。", "完成任务再玩，我们定个时间，到点我喊你，玩就玩得安心。"],
    ["ouxiang", ["偶像", "追星", "明星", "演唱会", "偶像"], "理性追。", "我特别喜欢一个偶像，别人不理解。", "喜欢一个能给你正向力量的人没问题，向他努力的样子看齐就好。"],
    ["yinle", ["听歌", "音乐", "歌曲", "歌单", "耳机"], "放松。", "最近总靠听歌解压。", "我做了个歌单，里面有你喜欢的歌，放学路上一起听。"],
    ["dianying", ["电影", "看电影", "追剧", "剧", "综艺"], "周末看。", "最近有部电影想看，没人陪。", "周末我们一起去看，我请爆米花，你负责选片。"],
    ["xiaoshuo", ["小说", "网文", "看书", "课外书"], "别上课看。", "看小说看到停不下来，作业都忘了。", "课外书是好东西，放到睡前看，我们约好时间，别让它占了学习。"],
    ["tianqi", ["下雨", "天气", "降温", "好热", "好冷"], "看预报。", "今天突然降温，我穿少了。", "我多带了件外套，先给你披着，明天记得看天气。"],
    ["meiri", ["今天好累", "累死", "好烦", "不想上学", "没劲"], "休息一下。", "今天整个人都提不起劲。", "走，先去走廊透透气，深呼吸，天大的事，我们一件一件来。"],
    ["biaoqian", ["MBTI", "人格", "星座", "血型", "性格测试"], "图个乐。", "你是什么 MBTI？我是 I 人，社恐。", "I 人也很好呀，你不必逼自己变外向，在我面前你可以很安静。"],
    ["aihao", ["爱好", "特长", "兴趣", "会什么"], "培养一个。", "我好像没有什么特长。", "爱好不是用来比较的，你喜欢什么就去试试，我陪你一起探索。"],
    ["limao", ["礼貌", "谢谢", "对不起", "打招呼"], "真诚。", "我不太敢和老师打招呼。", "微笑点个头就很好，我陪你练习，慢慢就自然了。"],
    ["gongyi", ["志愿者", "志愿活动", "公益", "献爱心"], "多参与。", "有志愿者活动，要不要报名。", "一起报吧，帮助别人的感觉很充实，也能认识新朋友。"],
    ["jianzhi", ["勤工俭学", "打工", "兼职", "零花钱"], "适度。", "想靠自己赚点零花钱。", "学校有勤工俭学岗位，安全又不耽误学习，我帮你一起问。"],
    ["linghua", ["零花钱", "钱不够", "省钱", "预算"], "做个账。", "零花钱总是不够花。", "我用工具帮你记个简单的账，分清想要和需要，能省不少。"],
    ["jiankang", ["运动", "锻炼", "体能", "身体素质"], "动起来。", "体育越来越差，跑两步就喘。", "我们从每天快走一圈开始，循序渐进，我陪你，别和别人比。"],
    ["shijian", ["时间管理", "效率", "计划", "安排"], "排优先级。", "一天忙到晚，却什么都没做完。", "先做最重要最紧急的，我帮你列个清单，做完划掉，成就感满满。"],
    ["mubiao", ["目标", "小目标", "计划", "想实现"], "写下来。", "我定了目标，总是坚持不了。", "把大目标拆成今天能完成的小任务，我每天提醒你，一起坚持。"],
    ["zhiyuan", ["梦想", "想成为", "理想", "未来"], "慢慢想。", "我还不知道自己想成为什么样的人。", "这很正常，你才高一，多尝试多体验，答案会慢慢清晰，我陪你找。"],
    ["xueli", ["大学", "名校", "考大学", "专业"], "尽力就好。", "我想考好大学，但又怕考不上。", "把目标放心里，把脚步踩在当下，你努力的每一天都算数。"],
    ["hezuo", ["小组合作", "队友", "分工", "小组作业"], "主动点。", "小组作业总有人划水，我一个人扛。", "提前把分工写清楚，我也可以帮你一起完成，别一个人扛。"],
    ["jiaoliu", ["社交", "交朋友", "不会聊天", "内向"], "做自己。", "我不太会聊天，容易冷场。", "会倾听的人很受欢迎，你不用逼自己健谈，真诚就够了。"],
    ["kua", ["夸我", "鼓励", "没动力", "打气"], "你可以的。", "今天真的没动力，需要一点鼓励。", "你已经坚持到现在了，这本身就很了不起。先休息一下，然后我们继续。"],
    ["xiexie", ["谢谢", "感谢", "多亏你"], "客气。", "谢谢你一直帮我。", "傻瓜，谢什么，我们是朋友。你需要的时候，我一直都在。"],
    ["wan", ["晚安", "睡了", "早点休息", "拜拜"], "晚安。", "晚安，今天辛苦了。", "晚安，盖好被子，别再熬夜，明天我在老地方等你。"],
    ["zao", ["早安", "早上好", "醒了"], "早。", "早啊，今天也要加油。", "早安！给你带了热豆浆，新的一天，我们一起好好过。"],
    ["e", ["饿了", "好饿", "想吃东西", "没吃饭"], "快去吃。", "好饿，早上没来得及吃饭。", "我包里有面包你先垫垫，下课我陪你去食堂，别饿坏了。"],
    ["kele", ["渴", "喝水", "想喝奶茶"], "喝水。", "上课上到口渴。", "我这儿有温水，给你倒一杯，奶茶少喝，水最解渴。"],
    ["leng", ["好冷", "冷", "手凉"], "多穿点。", "今天手冻得握不住笔。", "我有暖宝宝，给你一片，课间搓搓手，别冻着。"],
    ["re", ["好热", "热", "出汗", "闷"], "通风。", "教室里闷得人犯困。", "我去把窗户开条缝，给你带了瓶水，坚持一下，下课透气。"],
    ["shengbing", ["不舒服", "头疼", "肚子疼", "感冒", "难受"], "看医生。", "我今天有点不舒服，头晕。", "先去医务室看看，别硬撑，我帮你跟老师请假、记笔记。"],
    ["liuxue", ["留学", "出国", "交换生", "托福雅思"], "了解清楚。", "我在考虑以后要不要出国读书。", "这是个重要的决定，先了解清楚要求和利弊，不急，我们慢慢查。"],
    ["jingsai", ["竞赛", "奥赛", "比赛", "学科竞赛"], "看兴趣。", "要不要参加学科竞赛，怕占用时间。", "如果你真喜欢这科，可以试，竞赛也能锻炼思维，我帮你平衡时间。"],
    ["xuesheng", ["学生会", "竞选", "班干部", "当干部"], "锻炼。", "我想竞选班干部，又怕做不好。", "愿意承担就很棒，先从小组长做起，我投你一票，也帮你。"],
    ["banhui", ["班会", "主持", "班会课", "主题班会"], "准备。", "让我主持班会，我紧张。", "我帮你写主持词、排练两遍，站上去你就不怕了。"],
    ["heiban", ["黑板报", "出板报", "手抄报", "海报"], "分工。", "黑板报轮到我们组，没人会画。", "我写字你排版，再找会画的同学，分工做，肯定好看。"],
    ["jiaoyan", ["研学报告", "课题", "研究性学习", "论文"], "分阶段。", "研究性学习报告不知道怎么写。", "先确定题目，再查资料、做调查，我陪你一步步来。"],
    ["laodong", ["大扫除", "劳动", "值日", "打扫"], "认真做。", "又轮到我们大扫除，好累。", "我们分工，你擦窗我扫地，一起做很快就完事。"],
    ["anquan", ["安全教育", "消防", "演练", "逃生"], "认真听。", "消防演练又要占用课间。", "安全知识关键时候能保护自己，认真听，我们一起按要求疏散。"],
    ["xinli", ["心理课", "心理老师", "心理咨询", "情绪"], "可以求助。", "最近情绪很差，要不要找心理老师。", "愿意求助是勇敢，不是脆弱，需要的话我陪你一起去。"],
    ["tushu", ["借书", "还书", "图书馆座位", "占座"], "守规则。", "图书馆想借的书被人预约了。", "我们也预约一下，先在自习区看别的，书到了我提醒你。"],
    ["dayin", ["打印", "复印", "资料", "卷子"], "去打印室。", "复习资料太多，打印要排队。", "我正好要去打印室，帮你一起印，你把文件发我。"],
    ["chongdian", ["充电", "充电宝", "插座", "没电"], "自备。", "手机和充电宝都没电了。", "教室后排有插座，我帮你看着，先充一会儿，别影响上课。"],
    ["shudian", ["书店", "买辅导书", "教辅", "买资料"], "按需买。", "教辅书太多，不知道买哪本。", "先问老师推荐，再挑一本认真做透，别贪多。"],
    ["youju", ["校园卡挂失", "失物", "丢东西", "捡到东西"], "去招领处。", "我校牌找不到了，急。", "先去失物招领处和问保安，回想最后用的地方，我陪你找。"],
    ["zixiu", ["晚自习", "自习", "晚自修", "安静学习"], "利用好。", "晚自习总忍不住说话、走神。", "把任务列在便利贴上，做完一个划一个，我坐你旁边陪你专注。"],
    ["kewenda", ["课间", "十分钟", "下课", "课间玩什么"], "放松眼睛。", "课间十分钟不知道干嘛，一晃就过。", "起来走走、远眺、接杯水，别一直坐着，眼睛和身体都需要休息。"],
    ["wuhu", ["放学", "放学了", "回家", "解放"], "注意安全。", "放学啦，今天作业好多。", "路上注意安全，我们边走边聊，回去先休息十分钟再写作业。"],
    ["shouhuo", ["努力有回报", "坚持", "没白费", "值得"], "继续。", "努力了这么久，真的会有回报吗。", "会的，可能会迟到，但不会缺席，你看这次不就进步了吗，我为你骄傲。"],
    ["yujian", ["偶遇", "碰到", "巧合", "缘分"], "巧了。", "今天在校门口偶遇了你，好巧。", "哪有那么多巧合，也许是我算着时间路过的。走吧，一起进校门。"],
    ["chennuo", ["约定", "说好", "拉钩", "一言为定"], "算数。", "说好了周末一起复习，不许反悔。", "一言为定，拉钩。我提前占好位置，你不来我就去你班里拎人。"],
    ["jiebi", ["借东西", "借笔", "借橡皮", "借伞"], "互相帮助。", "我又忘带橡皮了。", "我文具盒里有备用的，你随时拿，别跟我客气。"],
    ["huan", ["还东西", "还你", "谢谢帮忙"], "客气。", "昨天借你的笔记，还你，谢谢。", "这么客气干嘛，以后需要直接说。你把它补全了，真好。"],
    ["heying", ["合影", "拍照", "合照", "留念"], "好啊。", "毕业前想和大家多拍点合照。", "现在就拍一张，我把它洗出来送给你，以后看到会想起今天。"],
    ["liwu", ["礼物", "送礼", "生日送什么", "惊喜"], "看心意。", "朋友生日，不知道送什么好。", "送他真正需要或有纪念意义的，我帮你一起想，心意最重要。"],
    ["shenghuo", ["生活", "校园生活", "高中生活", "日常"], "珍惜。", "感觉高中生活过得好快。", "所以更要认真过好每一天，这些普通的日常，以后都会很怀念。"],
    ["xiaoyu", ["下雨没带伞", "淋雨", "伞"], "我有。", "放学下雨，我没带伞。", "我带了两把，不，一把大的，一起走，保证你淋不到。"],
    ["feng", ["风大", "刮风", "台风", "风"], "注意安全。", "今天风好大，骑车都不稳。", "风大就别骑车了，走路或者让家长接，安全第一，我陪你。"],
    ["xue", ["下雪", "初雪", "雪", "打雪仗"], "注意保暖。", "听说要下雪了，好期待。", "真下雪我们课间去堆雪人，记得穿厚点，手套围巾都戴上。"],
    ["jiari", ["放假", "假期", "国庆", "寒暑假", "周末"], "劳逸结合。", "放假了，但作业一堆。", "假期先列个计划，上午写作业，下午好好玩，我帮你安排得明明白白。"],
    ["kaixue", ["开学", "返校", "新学期", "开学考"], "调整状态。", "一想到开学就有点不想去。", "开学焦虑很正常，提前把作息调回来，开学第一天我陪你一起。"],
    ["biye", ["毕业", "分班", "离别", "同学录"], "珍惜当下。", "听说要分班了，很舍不得大家。", "把想说的话写进同学录，真正的朋友不会因为分班就散，我们常联系。"],
    ["youyi", ["友谊", "好朋友", "闺蜜", "兄弟", "死党"], "用心经营。", "怎样才算真正的好朋友。", "能一起笑，也能在你难过时陪着你、说真话的人。我希望我算一个。"],
    ["yilai", ["依靠", "有你真好", "陪着我", "别离开"], "我在。", "有你在，我安心多了。", "我一直都在。你开心的时候我陪你笑，难的时候我陪你扛，跑不掉的。"],
    ["weilai", ["以后", "长大", "将来", "想和你"], "一起努力。", "你说，我们以后还会像现在这样吗。", "会的。我们一起努力考去想去的地方，把现在的约定，变成以后的日常。"]
  ];
  var add = 0;
  LIST.forEach(function (t) {
    var it = R(t[0], t[1], t[2], t[3], t[4]);
    if (!window.XZ_AI_INTENTS.some(function (x) { return x.id === it.id; })) {
      window.XZ_AI_INTENTS.push(it);
      add++;
    }
  });
  try { window.X565 = window.X565 || {}; window.X565.intentsAdded3 = add; } catch (e) {}
});


/* ===== p80_intents4.js ===== */
/* ============================================================================
   p80 · AI 题库第四批（id 前缀 x565d_，约 60 个补充意图）
   覆盖校园细节/情绪/学科题型/生活场景，全部联系人共享
   ============================================================================ */
register("intents4-565", function () {
  if (!window.XZ_AI_INTENTS || !window.XZ_AI_INTENTS.push) return;
  function R(id, kws, cold, mid, warm) {
    return { id: "x565d_" + id, kws: kws, rep: { cold: [cold], mid: [mid], warm: [warm] } };
  }
  var LIST = [
    ["paowu", ["跑操请假", "免体", "请假条", "体育免修"], "找校医。", "我膝盖不舒服，想申请免跑操。", "我陪你去医务室评估，必要时帮你找老师请假。"],
    ["zisheng", ["走神", "注意力不集中", "听不进课", "分神"], "强迫自己。", "上课总走神，笔记记不全。", "跟着老师的节奏动笔，记关键词，我坐你旁边提醒你。"],
    ["biji", ["怎么做笔记", "笔记方法", "记笔记", "康奈尔"], "记重点。", "我不知道笔记该记什么。", "记老师反复强调的和自己不懂的，课后用自己的话补一遍。"],
    ["gaicuoti", ["改卷子", "试卷分析", "卷子分析", "订正试卷"], "逐题看。", "卷子发下来，不知道从哪改起。", "按知识点分类，错得最多的先攻，我陪你列清单。"],
    ["mosheng", ["新同学", "插班生", "融入", "新环境"], "慢慢来。", "班里来了新同学，没人和他说话。", "主动找他一起吃饭、分组，新朋友都是从一次开口开始的。"],
    ["paiming", ["班级排名", "年级排名", "成绩单", "排名焦虑"], "理性看。", "看到排名我就紧张。", "排名是参考，更要看你和上次相比有没有进步。"],
    ["haochengji", ["考好了", "进步了", "高分", "满分"], "继续保持。", "这次我进步了二十名！", "我就知道你可以！我们总结一下方法，把它保持下去。"],
    ["kabu", ["卡住了", "学不会", "听不懂", "跟不上"], "多问。", "这一章我完全听不懂，越听越慌。", "别急，我们回到最前面的基础，一步步补，我陪你。"],
    ["shangkeshui", ["上课睡觉", "打瞌睡被抓", "站着听课"], "晚上早睡。", "我上课打瞌睡被老师发现了。", "今晚早点睡，我叫你，明天精神点就不会了。"],
    ["wenlaoshi", ["问老师题", "不敢问", "去办公室"], "大胆问。", "我有题不会，又不敢去办公室问。", "老师很欢迎学生提问，我陪你一起去，你先开口。"],
    ["zuotigang", ["做题慢", "做不完", "时间不够"], "限时练。", "考试我总做不完后面的题。", "平时做限时训练，先做会的、分值高的，把时间留给能拿的分。"],
    ["beisong", ["背诵", "背书", "默写", "记不住"], "用方法。", "古文背了又忘，很挫败。", "先理解意思，再分段、抓关键词，配合默写，记得更牢。"],
    ["tingli", ["听力", "英语听力", "听不清"], "多听。", "英语听力一快就反应不过来。", "每天精听一小段，先听大意再听写，我陪你一句句来。"],
    ["yuwenfuxi", ["语文复习", "作文素材", "文言文实词"], "积累本。", "语文复习没有抓手。", "文言文靠实词积累，作文靠素材和结构，我帮你整理素材本。"],
    ["shuxueti", ["数学题", "解不出", "几何证明", "辅助线"], "画辅助线。", "几何证明我老找不到辅助线。", "辅助线就那几种，连接、平移、作垂线，我给你总结常见模型。"],
    ["huaxuef", ["化学方程式", "配平", "计算", "实验现象"], "守恒。", "化学计算总是列错关系式。", "先写对方程式，再用物质的量守恒，我陪你做几道典型题。"],
    ["wuliti", ["物理题", "力学", "电学", "计算题"], "受力分析。", "物理一到综合题我就懵。", "把复杂过程拆成简单步骤，先受力再列方程，别慌。"],
    ["shengwuti", ["生物题", "遗传概率", "减数分裂"], "画图。", "遗传概率我怎么算都和答案不一样。", "把亲本和配子画出来，分清显隐性再算，我陪你推。"],
    ["diliwo", ["地理不会", "自然地理", "人文地理", "区域"], "看地图。", "自然地理我一头雾水。", "结合地图理解原理，气候、洋流都有规律，我帮你画图记忆。"],
    ["lishiwo", ["历史不会", "材料题", "论述题"], "看材料。", "历史材料题我读不懂材料。", "答案很多在材料里，先定位时间和主体，再结合课本知识作答。"],
    ["qingxie", ["写心情", "心情日记", "想说的话", "树洞"], "写下来。", "有些话不知道跟谁说。", "你可以写给我，或者记下来，写出来心里会轻松很多。"],
    ["buyao", ["别离开", "别走", "陪我", "在吗"], "我在。", "在吗？我现在很需要一个人。", "我在。你说，我听着，哪儿都不去。"],
    ["gaoxing", ["开心", "好高兴", "太棒了", "中了"], "分享。", "我今天超开心，想第一个告诉你！", "看你开心我也跟着高兴，来，把好事完整说给我听。"],
    ["nan", ["好难", "太难了", "放弃了"], "别放弃。", "这题太难了，我想放弃。", "难是正常的，我们先放一放，做道简单的找回状态再回来。"],
    ["bukao", ["补考", "重修", "没及格"], "查缺补漏。", "我有一门挂了，要补考。", "别灰心，补考就是补漏洞的机会，我们把那部分重新学扎实。"],
    ["zuojia", ["作弊", "小抄", "对答案"], "别碰。", "考试时有人想抄我的。", "守住底线，把卷子遮好。诚信比分数重要，别让别人拖你下水。"],
    ["jianchi", ["坚持", "自律", "打卡", "自律不了"], "从小处。", "我总是坚持不了计划。", "别定太满，先坚持一件小事，连续打卡，我每天提醒你。"],
    ["shouji2", ["想玩手机", "忍不住", "戒手机", "手机上瘾"], "物理隔离。", "写作业总忍不住摸手机。", "把手机放到另一个房间或开专注模式，我陪你专注二十五分钟。"],
    ["jilv", ["纪律", "自律性", "管不住自己"], "找监督。", "我管不住自己怎么办。", "找一个互相监督的伙伴，我们约定规则，做到了给奖励。"],
    ["piping", ["被批评", "被骂", "委屈", "不公平"], "先冷静。", "老师当众批评我，我觉得不公平。", "先听清楚原因，要是误会，下课心平气和地去解释。"],
    ["hehao", ["和好", "和好如初", "主动", "破冰"], "主动。", "和朋友冷战好几天，谁也不先开口。", "一句“我请你喝奶茶”就能破冰，我陪你去。"],
    ["pengyou", ["交朋友", "社交恐惧", "插不上话", "没话题"], "做自己。", "在群体里我总是插不上话。", "会倾听也是一种能力，先从一两个共同话题开始，不必勉强。"],
    ["lianai", ["可以谈恋爱吗", "早恋", "喜欢同学"], "看分寸。", "高中可以谈恋爱吗？", "喜欢是正常的，但要让彼此变得更好，别影响学习和成长。"],
    ["lihuikong", ["分离焦虑", "分班不舍", "好朋友疏远"], "保持联系。", "最好的朋友要分班了，我很难过。", "真正的朋友不会因为距离就散，约定一起吃饭、一起努力。"],
    ["jiachang", ["想回家", "住宿", "家校", "和父母沟通"], "多沟通。", "住校对家的依赖很重。", "适应需要过程，定期给家人打电话，也可以和我说说。"],
    ["yundong3", ["不想运动", "讨厌体育", "体能差"], "循序渐进。", "我特别讨厌上体育课。", "不用和别人比，从快走开始，动起来你会发现没那么难受。"],
    ["jinzhang2", ["比赛紧张", "表演紧张", "发言紧张"], "多准备。", "马上要上台比赛，我紧张到失眠。", "准备充分能缓解紧张，睡前深呼吸，明天我在台下给你加油。"],
    ["shijian2", ["学习计划", "计划表", "怎么安排时间", "优先级"], "四象限。", "每天作业太多，不知道先做哪科。", "先做紧急又重要的，再做重要的，我帮你排一个晚间计划。"],
    ["zhoumo", ["周末", "周末安排", "假期计划"], "劳逸平衡。", "周末一放松就浪费，一学习又累。", "上午学最难的，下午运动或休息，晚上复盘，张弛有度。"],
    ["fudao2", ["问同学", "讲题", "小组讨论"], "开口。", "我不会的题总不好意思问同学。", "问问题不丢人，你问我，我也可以帮你约会的同学。"],
    ["xiaoming", ["校园卡", "借书证", "门禁", "卡丢了"], "先挂失。", "我的校园卡丢了，怎么办？", "先挂失，再去办卡处补办，回想最后使用的地方。"],
    ["yifu", ["校服湿了", "衣服", "保暖", "外套"], "备件。", "体育课出汗，校服湿了很难受。", "备一件干的速干衣，运动后换掉，别着凉。"],
    ["shuijiao", ["睡不够", "睡眠不足", "上课犯困怎么办"], "调整作息。", "我每天都睡不够。", "尽量固定睡觉时间，睡前别玩手机，哪怕早睡二十分钟也有效。"],
    ["wujie", ["误会", "被误解", "解释不清"], "坦诚沟通。", "我被同学误会了，很委屈。", "等情绪平复后，找个合适的时机把事情说清楚，别急着辩解。"],
    ["ganen", ["感恩", "感谢老师", "教师节"], "表达。", "我想感谢一位老师，却不好意思。", "一张真诚的小卡片就足够，老师会很开心。"],
    ["lingyi", ["校服设计", "班服", "文化衫"], "参与。", "班级要定文化衫，我想参与设计。", "大胆提出你的想法，集体活动的参与感很珍贵。"],
    ["banshou", ["黑板报主题", "海报设计", "主题没想法"], "头脑风暴。", "黑板报主题定了，我们没有灵感。", "围绕主题找几个关键词，我陪你们头脑风暴，再分工。"],
    ["jianli", ["社团面试", "学生会面试", "自我介绍"], "准备。", "我想去社团面试，自我介绍怎么说？", "说清你的兴趣、特长和想做什么，真诚比花哨重要，我帮你练。"],
    ["shijianbaogao", ["实践报告", "研学报告", "活动总结"], "分阶段。", "实践活动要写总结报告，我不会。", "按“活动过程、收获、反思”来写，我帮你搭框架。"],
    ["xueshenghui2", ["社团活动时间", "社团冲突", "兼顾"], "协调。", "两个社团活动时间冲突，怎么办？", "和两边负责人说明，确定主次，避免两头都顾不好。"],
    ["youeryi", ["校园欺凌", "被欺负", "孤立", "嘲笑我胆小"], "要求助。", "有同学一直欺负我，我不敢说。", "这不是你的错，一定要告诉老师或家长，我陪你一起去，别独自承受。"],
    ["wangluo", ["网络谣言", "被造谣", "群里说我"], "留证据。", "有人在群里造我的谣。", "截图保留证据，告诉老师，别一个人憋着，谣言要被正视。"],
    ["anquan2", ["校园安全", "上下学安全", "陌生人"], "保持警惕。", "放学路上有陌生人搭话。", "不跟陌生人走，往人多的地方走，必要时联系老师和家长。"],
    ["yonggan", ["勇敢一点", "克服", "想改变"], "迈出一步。", "我想变得更勇敢一点。", "勇敢不是不害怕，而是害怕也愿意试。今天就从一件小事开始。"],
    ["jinbu", ["怎么进步", "提分", "逆袭", "努力方法"], "看错题。", "我想提分，但不知道从哪里下手。", "从错题和薄弱章节入手，比盲目刷新题有效得多，我帮你分析试卷。"],
    ["hezuohuoban", ["学习搭档", "组队", "结对学习"], "找互补。", "我想找个学习搭档，互相督促。", "找一个目标相近、节奏合拍的人，我可以帮你一起打卡。"],
    ["xinqinghua", ["心情好", "轻松", "阳光", "治愈"], "记住这种感觉。", "今天阳光很好，心情也特别好。", "把这种感觉记下来，难过的时候就想想这个有阳光的下午。"],
    ["kaoyan", ["梦想学校", "目标大学", "想去的城市"], "具体化。", "我有了想去的大学，但很遥远。", "遥远不可怕，把它拆成每学期的小目标，一步步靠近。"],
    ["zixiu2", ["晚自习效率", "自习课", "高效学习"], "列任务。", "自习课总觉得什么都没做成。", "上课前先写下这节要完成的三件事，做完划掉，效率会高很多。"],
    ["ziwo", ["认识自己", "擅长什么", "优势", "MBTI"], "多尝试。", "我不知道自己擅长什么。", "多尝试不同的事，兴趣和优势会在行动里慢慢浮现。"],
    ["chongjing", ["憧憬", "期待", "长大", "以后的自己"], "珍惜当下。", "我有点期待未来的自己。", "那就让现在的努力，配得上你期待的未来。"]
  ];
  var add = 0;
  LIST.forEach(function (t) {
    var it = R(t[0], t[1], t[2], t[3], t[4]);
    if (!window.XZ_AI_INTENTS.some(function (x) { return x.id === it.id; })) {
      window.XZ_AI_INTENTS.push(it);
      add++;
    }
  });
  try { window.X565 = window.X565 || {}; window.X565.intentsAdded4 = add; } catch (e) {}
});


/* ===== p99_tail.js ===== */
/* ============================================================================
   模块十 · 收尾：安排全部模块启动（DOM 就绪后），并闭合第六层 IIFE
   ============================================================================ */
ready(function () {
  try { bootAll(); } catch (e) { try { console.warn("[5.6.5] 启动异常", e); } catch (x) {} }
});
/* 兜底：window load 后再跑一次（已完成的模块会自动跳过，保证迟到的模块也能起来） */
window.addEventListener("load", function () {
  setTimeout(function () { try { bootAll(); } catch (e) {} }, 350);
});
/* 再兜底：1.2s 后确保一次（应对某些环境 load 未触发） */
setTimeout(function () { try { bootAll(); } catch (e) {} }, 1200);

})();
/* ===================== 第六层补丁结束（__XZ_PATCH_565__） ===================== */


