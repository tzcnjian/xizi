/* ============================================================
   杭州西子实验学校模拟器 · 5.6「心之所向」
   第 5 层补丁（在 5.5.13 之上）
   哨兵：__XZ_PATCH_560__
   架构：统一主题令牌 / 随时主题按钮 / 音乐手势解锁 /
        炫酷制作名单 / 微信朋友圈 / 角色大创建 / MBTI /
        剧情模式（言情小说）/ 工作台重做 / 核心大升级
   ============================================================ */
(function () {
  "use strict";
  if (window.__XZ_PATCH_560__) return;
  window.__XZ_PATCH_560__ = true;

  /* ────────────── 基础工具 ────────────── */
  var X56 = {
    version: "5.6",
    codename: "心之所向",
    inits: [],
    log: function () {
      try {
        var args = Array.prototype.slice.call(arguments);
        args.unshift("[5.6]");
        console.log.apply(console, args);
      } catch (e) {}
    },
    warn: function () {
      try {
        var args = Array.prototype.slice.call(arguments);
        args.unshift("[5.6]");
        console.warn.apply(console, args);
      } catch (e) {}
    }
  };
  window.X56 = X56;

  function $(id) { return document.getElementById(id); }
  function $s(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $a(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function on(el, ev, fn, opt) {
    if (el) el.addEventListener(ev, fn, opt || false);
  }
  function ready(fn) {
    if (document.readyState !== "loading") setTimeout(fn, 60);
    else document.addEventListener("DOMContentLoaded", function () { setTimeout(fn, 60); });
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function storageGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function storageSet(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  }
  function storageDel(k) {
    try { localStorage.removeItem(k); } catch (e) {}
  }
  function toast(msg, ms) {
    try {
      var t = document.createElement("div");
      t.className = "x56-toast";
      t.textContent = msg;
      t.style.cssText = "position:fixed;left:50%;top:24%;transform:translateX(-50%);z-index:32000;" +
        "padding:10px 20px;border-radius:12px;font-size:14px;max-width:80%;text-align:center;" +
        "box-shadow:0 10px 30px rgba(0,0,0,.3);";
      document.body.appendChild(t);
      setTimeout(function () {
        t.style.transition = "opacity .4s"; t.style.opacity = "0";
        setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 420);
      }, ms || 1800);
    } catch (e) {}
  }
  /* 模态弹窗（复用游戏的 modal，否则自建） */
  function modal(h) {
    try {
      if (typeof window.modal === "function") { window.modal(h); return true; }
    } catch (e) {}
    try {
      var ov = document.createElement("div");
      ov.id = "modal"; ov.className = "show";
      ov.style.cssText = "position:fixed;inset:0;z-index:14000;display:flex;align-items:center;justify-content:center;padding:16px;";
      var box = document.createElement("div");
      box.id = "modalbox";
      box.style.cssText = "max-width:620px;width:100%;max-height:88vh;overflow-y:auto;border-radius:18px;padding:20px;";
      box.innerHTML = h;
      ov.appendChild(box);
      on(ov, "click", function (e) { if (e.target === ov) { document.body.removeChild(ov); } });
      document.body.appendChild(ov);
      return true;
    } catch (e) { return false; }
  }
  function closeModal() {
    try { if (typeof window.closeModal === "function") { window.closeModal(); return; } } catch (e) {}
    var ov = $("modal");
    if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
  }

  X56.$ = $; X56.$s = $s; X56.$a = $a; X56.on = on; X56.ready = ready;
  X56.esc = esc; X56.pick = pick; X56.clamp = clamp;
  X56.storageGet = storageGet; X56.storageSet = storageSet; X56.storageDel = storageDel;
  X56.toast = toast; X56.modal = modal; X56.closeModal = closeModal;

/* ══════════════════════════════════════════════════════════
   模块零（补充）：开始页标题轮播（手绘 5.6 图 + 原标题循环）
   手绘 logo 放在标题右侧；两页循环，淡入淡出 + 浮动
   ══════════════════════════════════════════════════════════ */
var X56Hero = {
  build: function () {
    var titleRow = document.querySelector(".hero-title-row");
    if (!titleRow || document.querySelector(".x56-title-carousel")) return;
    var t1 = titleRow.querySelector(".hero-t1");
    var aiBadge = titleRow.querySelector(".hero-ai-badge");
    var ver = titleRow.querySelector(".hero-version");
    if (ver) ver.textContent = "Version 5.7.0";
    /* 徽章（绝对定位右上） */
    var hp = document.getElementById("heroPanel");
    if (hp) {
      hp.style.position = "relative";
      if (!hp.querySelector(".x56-badge")) {
        var bd = document.createElement("div");
        bd.className = "x56-badge";
        bd.textContent = "5.7.0 心之所向";
        hp.appendChild(bd);
      }
    }
    /* 轮播 */
    var carousel = document.createElement("div");
    carousel.className = "x56-title-carousel";
    /* 文本页 */
    var textSlide = document.createElement("div");
    textSlide.className = "x56-slide x56-s-text";
    var nh1 = document.createElement("h1");
    nh1.className = "hero-t1";
    nh1.textContent = t1 ? t1.textContent : "杭州西子实验学校模拟器";
    var nh2 = document.createElement("h2");
    nh2.className = "hero-t2";
    nh2.textContent = "校园生活模拟器 · 心之所向";
    textSlide.appendChild(nh1);
    textSlide.appendChild(nh2);
    /* logo 页（对齐右侧，体现“放在模拟器右边”） */
    var logoSlide = document.createElement("div");
    logoSlide.className = "x56-slide x56-s-logo";
    logoSlide.style.alignItems = "flex-end";
    logoSlide.style.justifyContent = "flex-end";
    var img = document.createElement("img");
    img.className = "x56-logo-img";
    img.src = window.X56_HERO_LOGO || "";
    img.alt = "西子模拟器 5.6";
    logoSlide.appendChild(img);
    carousel.appendChild(textSlide);
    carousel.appendChild(logoSlide);
    /* 插入到 titleRow 前面，并隐藏原标题文本（保留 AI 徽章与版本） */
    titleRow.parentNode.insertBefore(carousel, titleRow);
    if (t1) t1.style.display = "none";
    if (aiBadge) aiBadge.style.display = "none";
  }
};
window.X56Hero = X56Hero;

function buildHero56() {
  try { X56Hero.build(); } catch (e) { X56.warn("hero 构建失败", e); }
}
X56.inits.push(buildHero56);
ready(function () { setTimeout(buildHero56, 200); });

/* ══════════════════════════════════════════════════════════
   模块一：5.6 统一主题系统（默认西子湖 + 随时切换 + 面板）
   ══════════════════════════════════════════════════════════ */
var X56Theme = {
  themes: [
    { id: "xizi",      name: "西子湖", desc: "西湖烟雨 · 暮色玻璃", mode: "dark",
      dots: ["#0b1a2b", "#102536", "#7fd1ae", "#ff9eb5"] },
    { id: "classic",   name: "晴空", desc: "浅蓝晴空 · 白色玻璃", mode: "light",
      dots: ["#eef4ff", "#ffffff", "#4a86f5", "#63a3f8"] },
    { id: "sakura",    name: "樱语", desc: "奶油粉白 · 樱花飘落", mode: "light",
      dots: ["#fff5f8", "#ffffff", "#f278a6", "#f69cc0"] },
    { id: "qingshan",  name: "氢山", desc: "水墨湖山 · 黑白极简", mode: "light",
      dots: ["#f6faf9", "#ffffff", "#4a8a7a", "#5ba3b3"] },
    { id: "guanggu",   name: "光谷", desc: "清新明亮 · 光之谷", mode: "light",
      dots: ["#f0f6ff", "#ffffff", "#4a9eff", "#7dc3ff"] },
    { id: "warm",      name: "暖阳", desc: "暖色温馨 · 小太阳", mode: "light",
      dots: ["#fff8f0", "#fffcf5", "#e89856", "#f0b070"] },
    { id: "darknight", name: "暗夜", desc: "深紫星空 · 静谧夜", mode: "dark",
      dots: ["#0d0b1a", "#14102a", "#9b7af5", "#b79af8"] }
  ],
  byId: function (id) {
    for (var i = 0; i < this.themes.length; i++) if (this.themes[i].id === id) return this.themes[i];
    return this.themes[0];
  },
  isValid: function (id) {
    for (var i = 0; i < this.themes.length; i++) if (this.themes[i].id === id) return true;
    return false;
  },
  get: function () {
    var v = storageGet("xz_art_theme");
    if (!v || v === "default" || v === "0") return "xizi";
    return this.isValid(v) ? v : "xizi";
  },
  /* 用户真实意图（独立于旧补丁的程序化 apply）。默认西子湖 */
  intentGet: function () {
    var v = storageGet("xz56_user_theme");
    if (!v) return "xizi";
    return this.isValid(v) ? v : "xizi";
  },
  intentSet: function (id) {
    if (this.isValid(id)) storageSet("xz56_user_theme", id);
  },
  /* 用户从面板点选：写意图 + 应用 */
  choose: function (id) {
    this.intentSet(id);
    this.apply(id);
  },
  /* 5.6 首次进入：迁移到新默认（西子湖） */
  migrate: function () {
    /* 每次升级都把“当前生效值”重置为用户意图（默认西子湖），
       旧补丁本地函数仍会偷偷 apply classic，由 guard 持续纠偏 */
    this.intentSet(this.intentGet());
    storageSet("xz_art_theme", this.intentGet());
    if (!storageGet("xz56_migrated")) {
      storageSet("xz56_migrated", "1");
      X56.log("主题迁移：默认 → 西子湖（5.6）");
    }
  },
  /* 纠偏：让 body 始终跟随用户意图，旧补丁无权改默认 */
  guard: function () {
    var intent = this.intentGet();
    var m = document.body.className.match(/theme-([a-z]+)/);
    var cur = m ? m[1] : "";
    if (cur !== intent) {
      this.apply(intent);
    }
  },
  apply: function (id) {
    if (!this.isValid(id)) id = "xizi";
    for (var i = 0; i < this.themes.length; i++)
      document.body.classList.remove("theme-" + this.themes[i].id);
    document.body.classList.add("theme-" + id);
    var t = this.byId(id);
    document.documentElement.classList.toggle("light", t.mode === "light");
    document.documentElement.classList.toggle("dark", t.mode === "dark");
    storageSet("xz_art_theme", id);
    try {
      var eve = new Event("x56themechange"); eve.theme = id;
      document.dispatchEvent(eve);
    } catch (e) {}
    this.refreshPanel();
  },
  refreshPanel: function () {
    var cur = this.get();
    $a(".x56-theme-card").forEach(function (c) {
      c.classList.toggle("cur", c.getAttribute("data-tid") === cur);
    });
  },
  openPanel: function () {
    var cur = this.get();
    var h = '<h3 style="display:flex;align-items:center;gap:8px">🎨 主题皮肤</h3>' +
      '<div class="quote">随时切换，<b>立即生效</b>并自动保存。当前：<b>' + esc(this.byId(cur).name) +
      '</b>（' + esc(this.byId(cur).desc) + '）</div>' +
      '<div class="x56-theme-grid">';
    h += this.themes.map(function (t) {
      var dots = t.dots.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("");
      return '<div class="x56-theme-card' + (t.id === cur ? " cur" : "") + '" data-tid="' + t.id +
        '"><div class="tc-check">✓</div><div class="tc-name">' + t.name +
        '</div><div class="tc-desc">' + t.desc + ' · ' + (t.mode === "dark" ? "夜间" : "日间") +
        '</div><div class="tc-dots">' + dots + '</div></div>';
    }).join("");
    h += '</div><button class="gbtn" style="margin-top:14px;width:100%" onclick="X56Theme.closePanel()">完成</button>';
    modal(h);
    var self = this;
    setTimeout(function () {
      $a(".x56-theme-card").forEach(function (c) {
        on(c, "click", function () {
          var id = c.getAttribute("data-tid");
          self.choose(id);
          toast("已切换：" + self.byId(id).name, 1200);
        });
      });
    }, 80);
  },
  closePanel: function () { closeModal(); }
};
window.X56Theme = X56Theme;

/* 接管所有旧的主题入口（5.5.9 / 5.5.13 / 基座） */
function x56ConvergeTheme() {
  try {
    window.getCurrentTheme = function () { return X56Theme.intentGet(); };
    window.applyArtTheme = function (id) { X56Theme.guard(); };
    window.__qsApplyTheme = function (id) { X56Theme.guard(); };
    window.__xz13ApplyTheme = function (id) { X56Theme.guard(); };
    /* 5.5.13 补丁专用入口：它的 getCurrentTheme13 会把 xizi 映射成 classic，
       必须在全局层面替换为用户意图，否则其本地 init 仍把主题强制为 classic */
    window.getCurrentTheme13 = function () { return X56Theme.intentGet(); };
    window.applyArtTheme13 = function (id) { X56Theme.guard(); };
    /* 基座日/夜 applyTheme 收敛为艺术主题，避免撤掉令牌 */
    window.applyTheme = function () { X56Theme.guard(); };
    window.setTheme = function () { /* 由 5.6 统一主题接管 */ };
  } catch (e) { X56.warn("主题接管失败", e); }
}

/* 主题快速 FAB（随时可点） */
function injectThemeFab() {
  if ($("x56ThemeFab")) return;
  var b = document.createElement("button");
  b.id = "x56ThemeFab";
  b.textContent = "🎨";
  b.title = "主题皮肤";
  on(b, "click", function () { X56Theme.openPanel(); });
  document.body.appendChild(b);
}

/* 重接旧“主题/皮肤”按钮 → 开 5.6 面板 */
function rewireOldThemeButtons() {
  var ids = ["xz559-theme-btn"];
  ids.forEach(function (id) {
    var old = $(id);
    if (old && !old.getAttribute("data-x56")) {
      old.setAttribute("data-x56", "1");
      var nb = old.cloneNode(true);
      on(nb, "click", function () { X56Theme.openPanel(); });
      old.parentNode.replaceChild(nb, old);
    }
  });
  /* 工作台里的皮肤入口（节点为 #xz13-wb-theme 等） */
  ["xz13-wb-theme"].forEach(function (id) {
    var n = $(id);
    if (n && !n.getAttribute("data-x56")) {
      n.setAttribute("data-x56", "1");
      n.onclick = function () { X56Theme.openPanel(); };
    }
  });
}

X56.inits.push(function () {
  X56Theme.migrate();
  x56ConvergeTheme();
  X56Theme.apply(X56Theme.intentGet());
  injectThemeFab();
  rewireOldThemeButtons();
});
/* 旧补丁持续轮询注入，持续补偿 */
ready(function () {
  var n = 0;
  var t = setInterval(function () {
    rewireOldThemeButtons();
    X56Theme.guard();
    if (++n > 80) clearInterval(t);
  }, 300);
  /* 前 10 秒密集纠偏（覆盖 XZ13 的 600/1800ms 定时器），
     之后常驻低频纠偏，防止任何旧补丁把主题改回 classic */
  var guardFast = setInterval(function () { X56Theme.guard(); }, 250);
  setTimeout(function () {
    clearInterval(guardFast);
    X56Theme.guard();
    setInterval(function () { X56Theme.guard(); }, 1200);
  }, 10000);
  /* 延迟再次确保主题（抵消旧补丁的初始化） */
  setTimeout(function () { X56Theme.guard(); }, 400);
  setTimeout(function () { X56Theme.guard(); }, 1200);
  setTimeout(function () { X56Theme.guard(); }, 2200);
  setTimeout(function () { X56Theme.guard(); }, 3200);
});

/* ══════════════════════════════════════════════════════════
   模块二：音乐稳健播放（手势解锁 + 失败重试 + 可视入口）
   修复：play() 因未交互被拒后，之后永远不再播放
   ══════════════════════════════════════════════════════════ */
var X56Music = {
  unlocked: false,
  trying: false,
  aud: function () {
    try {
      if (window.BGM_AUD) return window.BGM_AUD;
      if (typeof window.bgmInit === "function" && window.BGM_B64) {
        try { window.bgmInit(); } catch (e) {}
        return window.BGM_AUD || null;
      }
    } catch (e) {}
    return null;
  },
  isOn: function () {
    try {
      if (window.BGM_ON === false) return false;
      if (storageGet("xz_bgm_on") === "0") return false;
      return true;
    } catch (e) { return true; }
  },
  /* 尝试播放；resolve 成功与否，供手势循环调用 */
  tryPlay: function () {
    var self = this;
    if (!this.isOn()) return Promise.resolve(false);
    var a = this.aud();
    if (!a) return Promise.resolve(false);
    if (!a.paused && a.readyState >= 2) { this.unlocked = true; return Promise.resolve(true); }
    try {
      var p = a.play();
      if (p && p.then) {
        return p.then(function () {
          self.unlocked = true;
          self.trying = false;
          X56.log("音乐已开始播放");
          return true;
        }).catch(function () {
          self.trying = false;
          return false;
        });
      }
      this.unlocked = true;
      return Promise.resolve(true);
    } catch (e) {
      this.trying = false;
      return Promise.resolve(false);
    }
  },
  /* 手势触发：在任何一次 pointerdown/keydown 上尝试 */
  onGesture: function () {
    if (this.unlocked) return;
    if (this.trying) return;
    this.trying = true;
    this.tryPlay();
  },
  /* 卡死/出错后自动恢复 */
  watch: function () {
    var self = this;
    var a = this.aud();
    if (!a) return;
    on(a, "error", function () {
      X56.warn("音乐出错，稍后重试");
      setTimeout(function () {
        try { if (typeof window.bgmInit === "function") window.bgmInit(); } catch (e) {}
        self.unlocked = false;
        self.tryPlay();
      }, 1500);
    });
    on(a, "stalled", function () {
      setTimeout(function () {
        try { if (a.readyState < 3) { a.currentTime = a.currentTime; } } catch (e) {}
      }, 600);
    });
  },
  /* 开始页“点我播放音乐”入口 */
  injectPill: function () {
    var self = this;
    var hero = $("heroPanel") || $s(".hero-inner");
    if (!hero) return;
    if ($("x56MusicPill")) return;
    var pill = document.createElement("div");
    pill.id = "x56MusicPill";
    pill.style.cssText = "margin-top:14px;text-align:center;";
    pill.innerHTML = '<span class="x56-music-pill">🎵 点我播放背景音乐</span>';
    var target = $s(".hero-inner") || hero;
    if (target) target.appendChild(pill);
    on(pill, "click", function () {
      try { if (typeof window.bgmPlay === "function") window.bgmPlay(); } catch (e) {}
      self.tryPlay().then(function (ok) {
        if (ok) toast("🎵 音乐开始啦～", 1200);
        else toast("请再点一次，或在设置里开启音乐", 1800);
      });
    });
  },
  refreshPill: function () {
    var pill = $("x56MusicPill");
    if (!pill) return;
    var a = this.aud();
    var playing = a && !a.paused;
    pill.style.display = playing ? "none" : "block";
  }
};
window.X56Music = X56Music;

X56.inits.push(function () {
  /* 持久手势监听：任何点击/触摸/按键都尝试解锁，直到成功
     （旧代码第一次失败就移除监听，是音乐放不出来的根因） */
  ["pointerdown", "touchstart", "keydown", "click"].forEach(function (ev) {
    document.addEventListener(ev, function () { X56Music.onGesture(); }, true);
  });
  X56Music.tryPlay();
  X56Music.injectPill();
  setTimeout(function () { X56Music.watch(); }, 600);
});

/* 包装 startGame / continueGame：进入游戏立即尝试播放（处于用户手势内） */
ready(function () {
  function wrap(name) {
    var old = window[name];
    if (typeof old !== "function") return;
    window[name] = function () {
      try {
        X56Music.unlocked = false;
        X56Music.tryPlay();
      } catch (e) {}
      return old.apply(this, arguments);
    };
  }
  /* 给基座补丁一点时间，延迟再包 */
  setTimeout(function () { wrap("startGame"); wrap("continueGame"); }, 200);
});

/* 开始页可见性 & 播放状态定时刷新 */
setInterval(function () {
  try { X56Music.refreshPill(); } catch (e) {}
}, 1200);

/* ══════════════════════════════════════════════════════════
   模块三：炫酷制作名单（含 GLM Hy3）
   ══════════════════════════════════════════════════════════ */
var X56Credits = {
  people: [
    { icon: "🧑‍💻", name: "Laerrus.", role: "主创 · 游戏设计 / 产品策划",
      desc: "杭州西子实验学校模拟器原作者。从 5.5.505 一路走到 5.6，亲手设计核心玩法、美术、音乐与剧情。",
      tags: [{ t: "主创", s: true }] },
    { icon: "🌊", name: "GLM Hy3", role: "智谱 AI · 旗舰技术支持",
      desc: "5.6「心之所向」核心引擎：主题令牌体系、朋友圈、剧情模式、角色大创建、工作台重做的主要编写与整合。",
      tags: [{ t: "5.6 主程", s: true }] },
    { icon: "🫘", name: "Doubao", role: "豆包 · 智能助手",
      desc: "基石版提取、补丁装配、字节级验证、需求梳理与多轮史诗更新的总入口。",
      tags: [{ t: "整合" }] },
    { icon: "🌀", name: "Qwen", role: "阿里通义 · 大模型",
      desc: "基座功能与内容的早期实现，参与基础玩法与系统搭建。",
      tags: [] },
    { icon: "🔮", name: "DeepSeek", role: "深度求索 · 大模型",
      desc: "参与基座逻辑、数学与判定流程的实现与优化。",
      tags: [] },
    { icon: "🧬", name: "GLM", role: "智谱 AI · 智能体",
      desc: "5.5.9 → 5.5.11 三层补丁架构设计与装配，补丁体系的奠基者。",
      tags: [] },
    { icon: "🌀", name: "混元", role: "腾讯 · 大模型",
      desc: "参与功能讨论、需求分析、美术风格建议、歌词滚动与手机布局优化。",
      tags: [] }
  ],
  open: function () {
    var cards = this.people.map(function (p, i) {
      var tags = p.tags.map(function (tg) {
        return '<span class="cr-tag' + (tg.s ? " star" : "") + '">' + tg.t + "</span>";
      }).join("");
      return '<div class="x56-cr-card" style="animation-delay:' + (0.12 + i * 0.12) + 's">' +
        '<div class="cr-avatar">' + p.icon + "</div>" +
        '<div><div class="cr-name">' + esc(p.name) + tags + "</div>" +
        '<div class="cr-role">' + esc(p.role) + "</div>" +
        '<div class="cr-desc">' + esc(p.desc) + "</div></div></div>";
    }).join("");

    var h = '<div class="x56-credits">' +
      '<div class="x56-credits-title">杭州西子实验学校模拟器 · 5.6</div>' +
      '<div class="x56-credits-sub">心之所向 · 制作名单 &nbsp;|&nbsp; 感谢每一位同行者</div>' +
      cards +
      '<div class="x56-cr-line"></div>' +
      '<div class="x56-cr-foot">一个 HTML 文件，承载从 5.5.505 到 5.6 的全部热爱<br>' +
      '—— Laerrus. 与全体技术支持团队 敬上</div>' +
      '<div style="position:relative;text-align:center;margin-top:14px">' +
      '<button class="gbtn" onclick="X56.closeModal()">关闭</button></div>' +
      "</div>";
    modal(h);
  }
};
window.X56Credits = X56Credits;

/* 接管全局 openCredits（基座/旧补丁） */
function x56ConvergeCredits() {
  window.openCredits = function () { X56Credits.open(); };
}
X56.inits.push(x56ConvergeCredits);

/* 重接“鸣谢”按钮（日志补丁注入的按钮） */
function rewireCreditsButton() {
  var b = $("xz-credits-btn");
  if (b && !b.getAttribute("data-x56")) {
    b.setAttribute("data-x56", "1");
    var nb = b.cloneNode(true);
    on(nb, "click", function () { X56Credits.open(); });
    b.parentNode.replaceChild(nb, b);
  }
}
X56.inits.push(rewireCreditsButton);
ready(function () {
  var n = 0;
  setInterval(function () {
    rewireCreditsButton();
    if (++n > 40) return;
  }, 500);
});

/* ══════════════════════════════════════════════════════════
   模块四：微信朋友圈（还原真实核心体验）
   封面 / 九宫格 / 点赞 / 评论回复 / 发表图文 / 删除 / 红点
   ══════════════════════════════════════════════════════════ */
var X56Moments = {
  KEY: "xz56_moments_v1",
  /* 照片渐变预设（emoji 叠在上面，无真实照片也精致） */
  gradients: [
    "linear-gradient(135deg,#a8d0ff,#7fb0f5)",
    "linear-gradient(135deg,#ffd6a0,#f5b07a)",
    "linear-gradient(135deg,#c2f0d2,#8fd8ad)",
    "linear-gradient(135deg,#ffc2d8,#f59ab8)",
    "linear-gradient(135deg,#d8c2f5,#b09ae8)",
    "linear-gradient(135deg,#c8e8f5,#9fd0e0)",
    "linear-gradient(135deg,#f5e6b0,#e8cf8a)",
    "linear-gradient(135deg,#e8d8c8,#d0b8a2)"
  ],
  emojiPalette: ["🌸", "🍜", "📚", "🏀", "🎹", "🌅", "🐱", "🍰", "✈️", "🎨", "🌧️", "🎮", "🏃", "🎤", "🍔", "🌙", "☕", "📷", "🎵", "🏫", "🍦", "🌊", "🎯", "🧋"],
  /* NPC 花名册（头像底色 + emoji） */
  npcs: {
    radio: { name: "校园广播站", emoji: "📢", bg: "linear-gradient(135deg,#8fb9f2,#6ea0ec)" },
    wang: { name: "王老师", emoji: "👩‍🏫", bg: "linear-gradient(135deg,#f6c89a,#e8a866)" },
    lin: { name: "林晚", emoji: "🌸", bg: "linear-gradient(135deg,#ffc2d8,#f59ab8)" },
    chen: { name: "陈墨", emoji: "⚽", bg: "linear-gradient(135deg,#c2f0d2,#8fd8ad)" },
    zhao: { name: "赵小雨", emoji: "🎨", bg: "linear-gradient(135deg,#d8c2f5,#b09ae8)" },
    zhou: { name: "周子航", emoji: "🎮", bg: "linear-gradient(135deg,#c8e8f5,#9fd0e0)" },
    xu: { name: "徐甜甜", emoji: "📚", bg: "linear-gradient(135deg,#f5e6b0,#e8cf8a)" },
    wu: { name: "吴磊", emoji: "🏃", bg: "linear-gradient(135deg,#a8d0ff,#7fb0f5)" },
    canteen: { name: "西子食堂", emoji: "🍲", bg: "linear-gradient(135deg,#ffd6a0,#f5b07a)" }
  },
  data: null,
  defaultData: function () {
    return { myPosts: [], liked: {}, comments: {}, myLikesSeed: {}, seen: true, myName: "我" };
  },
  load: function () {
    if (this.data) return this.data;
    try {
      var raw = storageGet(this.KEY);
      if (raw) { this.data = JSON.parse(raw); }
      else this.data = this.defaultData();
    } catch (e) { this.data = this.defaultData(); }
    return this.data;
  },
  save: function () {
    try { storageSet(this.KEY, JSON.stringify(this.data)); } catch (e) {}
  },
  /* NPC 种子动态（时间相对，含图片/点赞/评论） */
  seedFeed: function () {
    return [
      { id: "s1", who: "radio", time: "3分钟前", loc: "杭州西子实验学校",
        text: "【通知】本周四下午 14:30 举行秋季运动会开幕式，请各班穿好校服、提前在操场列队。广播站欢迎投稿加油稿～",
        imgs: [],
        likes: ["王老师", "陈墨", "吴磊"],
        comments: [
          { n: "吴磊", c: "收到！开幕式班级方阵已经排好了" },
          { n: "林晚", c: "投稿邮箱是广播站门口的小箱子吗？" }
        ] },
      { id: "s2", who: "lin", time: "26分钟前", loc: "",
        text: "早读背《岳阳楼记》背到“先天下之忧而忧”，突然就困了……今天有人一起在食堂吃早餐吗？",
        imgs: [{ e: "☕", g: 5 }, { e: "📚", g: 1 }],
        likes: ["赵小雨", "徐甜甜"],
        comments: [{ n: "徐甜甜", c: "我我我！帮我占个位置" }] },
      { id: "s3", who: "chen", time: "1小时前", loc: "操场",
        text: "体育课 1000 米跑了 3 分 40，体委我尽力了！下次一定进 3 分半 💪",
        imgs: [{ e: "🏃", g: 2 }],
        likes: ["吴磊", "周子航", "王老师"],
        comments: [
          { n: "吴磊", c: "节奏不错，最后两百米再冲一把" },
          { n: "周子航", c: "比我强，我跑了四分钟" }
        ] },
      { id: "s4", who: "canteen", time: "2小时前", loc: "西子食堂",
        text: "今日窗口上新：糖醋里脊、番茄牛腩、麻辣香锅（不辣/微辣可选），记得光盘行动哦～",
        imgs: [{ e: "🍜", g: 1 }, { e: "🍔", g: 7 }, { e: "🍰", g: 3 }, { e: "🧋", g: 5 }],
        likes: ["赵小雨", "林晚", "陈墨", "徐甜甜"],
        comments: [{ n: "赵小雨", c: "糖醋里脊冲！" }] },
      { id: "s5", who: "zhao", time: "3小时前", loc: "美术教室",
        text: "美术课的水彩作业，画了一下午的西湖。老师说可以加点远山的层次～",
        imgs: [{ e: "🌊", g: 0 }, { e: "🎨", g: 4 }, { e: "🌅", g: 6 }],
        likes: ["王老师", "林晚", "徐甜甜"],
        comments: [{ n: "王老师", c: "色彩感觉很好，远山可以淡一点，远近就拉开了" }] },
      { id: "s6", who: "zhou", time: "5小时前", loc: "",
        text: "昨晚熬夜上分，今天数学课全程点头（其实是在打瞌睡）。有没有人一起戒游戏？算了，当我没说。",
        imgs: [],
        likes: ["陈墨"],
        comments: [
          { n: "陈墨", c: "戒游戏是不可能的，只能少玩" },
          { n: "周子航", c: "回复陈墨：懂我" }
        ] },
      { id: "s7", who: "xu", time: "6小时前", loc: "图书馆",
        text: "在图书馆刷了一套理综卷，错题本又厚了一页。离目标大学又近了一点点，加油！",
        imgs: [{ e: "📚", g: 5 }, { e: "✏️", g: 1 }],
        likes: ["王老师", "林晚", "赵小雨"],
        comments: [{ n: "林晚", c: "学霸带带我，周末一起自习" }] },
      { id: "s8", who: "wang", time: "昨天 20:14", loc: "",
        text: "同学们，明天早自习默写《茅屋为秋风所破歌》，请大家今晚再读两遍，注意“俄顷风定云墨色”的“俄顷”。",
        imgs: [],
        likes: ["徐甜甜", "林晚", "赵小雨", "陈墨", "吴磊"],
        comments: [
          { n: "陈墨", c: "老师，能只默重点句吗", to: "王老师" },
          { n: "吴磊", c: "收到，今晚一定背" }
        ] },
      { id: "s9", who: "wu", time: "昨天 17:42", loc: "操场",
        text: "运动会报名开始啦！项目有 100/400/1000 米、跳远、跳高、接力、拔河。想报名的同学今天内告诉我！",
        imgs: [{ e: "🏀", g: 2 }, { e: "🏅", g: 6 }],
        likes: ["陈墨", "周子航", "徐甜甜"],
        comments: [
          { n: "陈墨", c: "我报 1000 米" },
          { n: "林晚", c: "我报跳远！" }
        ] },
      { id: "s10", who: "lin", time: "前天 21:30", loc: "宿舍",
        text: "今天好累，但是抬头看到月亮特别圆。大家记得早点休息，明天又是新的一天 🌙",
        imgs: [{ e: "🌙", g: 3 }],
        likes: ["赵小雨", "徐甜甜", "王老师"],
        comments: [{ n: "赵小雨", c: "晚安，辛苦啦" }] }
    ];
  },
  /* 合并后的 feed：我的动态（新）+ NPC（按时间，这里顺序固定） */
  buildFeed: function () {
    var d = this.load();
    var feed = [];
    for (var i = 0; i < d.myPosts.length; i++) feed.push(d.myPosts[i]);
    var seeds = this.seedFeed();
    for (var j = 0; j < seeds.length; j++) feed.push(seeds[j]);
    return feed;
  },
  /* 某条动态的点赞人列表（种子 + 用户） */
  likeNames: function (m) {
    var d = this.load();
    var base = m.likes ? m.likes.slice() : [];
    if (d.liked[m.id]) {
      var me = d.myName || "我";
      if (base.indexOf(me) < 0) base.unshift(me);
    }
    return base;
  },
  comments: function (m) {
    var d = this.load();
    return d.comments[m.id] || m.comments || [];
  },
  /* 渲染单张图片 */
  renderPhoto: function (p) {
    var g = this.gradients[p.g % this.gradients.length];
    return '<div class="mm-ph" style="background:' + g + '">' + (p.e || "") + "</div>";
  },
  renderMoment: function (m) {
    var who = this.npcs[m.who] || { name: "我", emoji: "🧑", bg: "linear-gradient(135deg,#7fd1ae,#7cc4e8)" };
    var isMine = !!m.mine;
    var imgs = "";
    if (m.imgs && m.imgs.length) {
      var n = m.imgs.length;
      var cls = "g" + (n === 1 ? 1 : n === 2 ? 2 : n === 4 ? 4 : n === 3 ? 3 : 9);
      imgs = '<div class="mm-imgs ' + cls + '">' +
        m.imgs.map(this.renderPhoto.bind(this)).join("") + "</div>";
    }
    var loc = m.loc ? '<span class="mm-loc">📍 ' + esc(m.loc) + "</span>" : "";
    var likeNames = this.likeNames(m);
    var comments = this.comments(m);
    var hasLC = likeNames.length || comments.length;
    var lc = "";
    if (hasLC) {
      var likesHtml = likeNames.length
        ? '<div class="mm-likes"><span class="mm-heart">♥</span><span>' +
          likeNames.map(function (n) { return esc(n); }).join("，") + "</span></div>" : "";
      var commentsHtml = comments.map(function (c) {
        var to = c.to ? '<span class="c-reply"> 回复 ' + esc(c.to) + "</span> " : "";
        return '<div class="mm-comment"><span class="c-name">' + esc(c.n) + "</span>" + to +
          ": " + esc(c.c) + "</div>";
      }).join("");
      var divider = (likeNames.length && comments.length) ? '<div class="mm-divider"></div>' : "";
      lc = '<div class="mm-lc show">' + likesHtml + divider + commentsHtml + "</div>";
    }
    return '<div class="m-moment" data-id="' + esc(m.id) + '">' +
      '<div class="mm-avatar" style="background:' + who.bg + '">' + who.emoji + "</div>" +
      '<div class="mm-body">' +
      '<div class="mm-name">' + esc(who.name) + "</div>" +
      '<div class="mm-text">' + esc(m.text) + "</div>" +
      imgs +
      lc +
      '<div class="mm-meta"><span>' + loc + '<span class="mm-time">' + esc(m.time) +
      '</span></span><span style="display:flex;align-items:center">' +
      '<span class="mm-actions" data-id="' + esc(m.id) + '">' +
      '<button class="mm-act-like" data-id="' + esc(m.id) + '">♥ 赞</button>' +
      '<button class="mm-act-comment" data-id="' + esc(m.id) + '">💬 评论</button></span>' +
      '<button class="mm-more" data-id="' + esc(m.id) + '">···</button>' +
      "</span></div>" +
      "</div></div>";
  },
  render: function () {
    var feed = this.buildFeed();
    var d = this.load();
    var root = $("x56Moments");
    if (!root) return;
    var html =
      '<div class="m-top"><span class="m-back" id="mBack">‹</span>' +
      '<button class="m-cam" id="mCam">📷</button></div>' +
      '<div class="m-cover"><div class="m-profile"><div class="m-nick">' + esc(d.myName || "我") +
      '</div><div class="m-avatar">🧑</div></div></div>' +
      '<div class="m-feed">' + feed.map(this.renderMoment.bind(this)).join("") +
      '<div style="text-align:center;color:#9a9a9a;font-size:12px;margin-top:24px">—— 到底啦，去记录今天吧 ——</div>' +
      "</div>" +
      '<div class="mm-comment-bar"><input id="mmCommentInput" placeholder="说点什么…" />' +
      '<button id="mmCommentSend">发送</button></div>';
    root.innerHTML = html;
    this.bind();
  },
  heartPop: function (x, y) {
    var el = document.createElement("div");
    el.className = "mm-heart-pop";
    el.textContent = "❤️";
    el.style.left = (x - 17) + "px";
    el.style.top = (y - 17) + "px";
    document.body.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 950);
  },
  toggleLike: function (id, x, y) {
    var d = this.load();
    d.liked[id] = !d.liked[id];
    this.save();
    if (d.liked[id] && x != null) this.heartPop(x, y);
    this.render();
  },
  commentTarget: null,
  openCommentBar: function (id, replyTo) {
    var bar = $s("#x56Moments .mm-comment-bar");
    var input = $("mmCommentInput");
    if (!bar || !input) return;
    this.commentTarget = { id: id, replyTo: replyTo || null };
    bar.classList.add("show");
    input.placeholder = replyTo ? "回复 " + replyTo + "…" : "说点什么…";
    setTimeout(function () { input.focus(); }, 80);
  },
  sendComment: function () {
    var input = $("mmCommentInput");
    var bar = $s("#x56Moments .mm-comment-bar");
    var text = input.value.trim();
    if (!text || !this.commentTarget) { if (bar) bar.classList.remove("show"); return; }
    var d = this.load();
    var id = this.commentTarget.id;
    if (!d.comments[id]) d.comments[id] = [];
    var c = { n: d.myName || "我", c: text };
    if (this.commentTarget.replyTo) c.to = this.commentTarget.replyTo;
    d.comments[id].push(c);
    this.save();
    input.value = "";
    if (bar) bar.classList.remove("show");
    this.commentTarget = null;
    this.render();
  },
  bind: function () {
    var self = this;
    on($("mBack"), "click", function () { self.close(); });
    on($("mCam"), "click", function () { self.openComposer(); });
    /* “···” 展开 赞/评论 */
    $a("#x56Moments .mm-more").forEach(function (b) {
      on(b, "click", function () {
        var id = b.getAttribute("data-id");
        var act = $s('#x56Moments .mm-actions[data-id="' + id + '"]');
        if (act) act.classList.toggle("show");
      });
    });
    $a("#x56Moments .mm-act-like").forEach(function (b) {
      on(b, "click", function (e) {
        var r = b.getBoundingClientRect();
        self.toggleLike(b.getAttribute("data-id"), r.left, r.top);
        e.stopPropagation();
      });
    });
    $a("#x56Moments .mm-act-comment").forEach(function (b) {
      on(b, "click", function (e) {
        self.openCommentBar(b.getAttribute("data-id"), null);
        e.stopPropagation();
      });
    });
    /* 点评论里的名字 → 回复 TA */
    $a("#x56Moments .mm-comment .c-name").forEach(function (s) {
      on(s, "click", function () {
        var card = s.closest(".m-moment");
        if (card) self.openCommentBar(card.getAttribute("data-id"), s.textContent);
      });
    });
    on($("mmCommentSend"), "click", function () { self.sendComment(); });
    on($("mmCommentInput"), "keydown", function (e) {
      if (e.key === "Enter") self.sendComment();
    });
    /* 长按自己的动态 → 删除 */
    $a("#x56Moments .m-moment").forEach(function (card) {
      var id = card.getAttribute("data-id");
      var timer = null;
      function isMine() {
        var d = self.load();
        for (var i = 0; i < d.myPosts.length; i++) if (d.myPosts[i].id === id) return true;
        return false;
      }
      card.addEventListener("touchstart", function () {
        if (!isMine()) return;
        timer = setTimeout(function () { self.confirmDelete(id); }, 650);
      });
      card.addEventListener("touchend", function () { clearTimeout(timer); });
      card.addEventListener("contextmenu", function (e) {
        if (isMine()) { e.preventDefault(); self.confirmDelete(id); }
      });
    });
  },
  confirmDelete: function (id) {
    var self = this;
    if (typeof confirm === "function" && !confirm("删除这条动态？")) return;
    var d = this.load();
    d.myPosts = d.myPosts.filter(function (p) { return p.id !== id; });
    delete d.comments[id]; delete d.liked[id];
    this.save();
    this.render();
    toast("已删除", 1000);
  },
  /* ── 发表动态 ── */
  composer: { text: "", imgs: [], loc: "" },
  openComposer: function () {
    this.composer = { text: "", imgs: [], loc: "" };
    var h = '<div class="mm-post-modal"><h3>📷 发表动态</h3>' +
      '<textarea id="mmPMText" rows="4" placeholder="这一刻的想法…" style="width:100%;border-radius:12px;padding:10px"></textarea>' +
      '<div style="margin-top:10px"><button class="gbtn" id="mmPMLoc" type="button">📍 加上位置</button></div>' +
      '<div class="mm-pm-imgs" id="mmPMImgs"><div class="mm-pm-add" id="mmPMAdd">+</div></div>' +
      '<div class="mm-pm-emoji" id="mmPMEmoji"></div>' +
      '<div style="display:flex;gap:10px;margin-top:16px">' +
      '<button class="gbtn" style="flex:1" id="mmPMCancel">取消</button>' +
      '<button class="big" style="flex:1" id="mmPMPost">发表</button></div></div>';
    modal(h);
    var self = this;
    setTimeout(function () {
      var em = $("mmPMEmoji");
      em.innerHTML = self.emojiPalette.map(function (e) { return "<button>" + e + "</button>"; }).join("");
      $a("#mmPMEmoji button").forEach(function (b) {
        on(b, "click", function () {
          var e = b.textContent;
          var g = Math.floor(Math.random() * self.gradients.length);
          self.composer.imgs.push({ e: e, g: g });
          self.refreshComposerImgs();
        });
      });
      on($("mmPMAdd"), "click", function () {
        em.style.display = em.style.display === "none" ? "flex" : "none";
      });
      on($("mmPMLoc"), "click", function () {
        var locs = ["杭州西子实验学校", "操场", "图书馆", "食堂", "教学楼", "校门口", "西湖"];
        self.composer.loc = pick(locs);
        b.textContent = "📍 " + self.composer.loc;
      });
      on($("mmPMCancel"), "click", function () { closeModal(); });
      on($("mmPMPost"), "click", function () { self.submitPost(); });
    }, 80);
  },
  refreshComposerImgs: function () {
    var box = $("mmPMImgs");
    if (!box) return;
    var self = this;
    var html = this.composer.imgs.map(function (p, i) {
      return '<div class="mm-pm-ph" style="background:' + self.gradients[p.g % self.gradients.length] + '">' +
        p.e + '<button class="mm-pm-del" data-i="' + i + '">×</button></div>';
    }).join("");
    box.innerHTML = html + '<div class="mm-pm-add" id="mmPMAdd">+</div>';
    on($("mmPMAdd"), "click", function () {
      var em = $("mmPMEmoji");
      em.style.display = em.style.display === "none" ? "flex" : "none";
    });
    $a("#mmPMImgs .mm-pm-del").forEach(function (b) {
      on(b, "click", function () {
        var i = parseInt(b.getAttribute("data-i"), 10);
        X56Moments.composer.imgs.splice(i, 1);
        X56Moments.refreshComposerImgs();
      });
    });
  },
  submitPost: function () {
    var text = $("mmPMText").value.trim();
    var imgs = this.composer.imgs.slice(0, 9);
    if (!text && !imgs.length) { toast("写点什么或选张图吧"); return; }
    var d = this.load();
    var post = {
      id: "my" + Date.now(), mine: true, who: "me",
      time: "刚刚", loc: this.composer.loc,
      text: text, imgs: imgs, likes: [], comments: []
    };
    d.myPosts.unshift(post);
    this.save();
    closeModal();
    this.render();
    toast("已发表 🎉", 1200);
  },
  open: function () {
    var root = $("x56Moments");
    if (!root) {
      root = document.createElement("div");
      root.id = "x56Moments";
      document.body.appendChild(root);
    }
    this.load();
    this.data.seen = true;
    this.save();
    this.render();
    root.classList.add("show");
    this.clearBadge();
  },
  close: function () {
    var root = $("x56Moments");
    if (root) root.classList.remove("show");
  },
  /* 入口红点（未读） */
  setBadge: function () {
    var d = this.load();
    /* 5.6 新上线，先视为有新动态：若从没打开过，显示红点 */
    if (!storageGet("xz56_moments_opened")) {
      var el = $("xz56-moments-btn");
      if (el) {
        if (!el.querySelector(".m-badge")) {
          var bd = document.createElement("span");
          bd.className = "m-badge";
          bd.textContent = "新";
          bd.style.cssText = "position:absolute;top:-6px;right:-6px;background:#fa5151;color:#fff;font-size:10px;border-radius:999px;padding:0 5px;line-height:14px;";
          el.style.position = "relative";
          el.appendChild(bd);
        }
      }
    }
  },
  clearBadge: function () {
    storageSet("xz56_moments_opened", "1");
    var el = $("xz56-moments-btn");
    if (el) {
      var bd = el.querySelector(".m-badge");
      if (bd) bd.remove();
    }
  }
};
window.X56Moments = X56Moments;

/* 入口：注入功能行按钮（和手机里加入口） */
function injectMomentsButton() {
  var row = $s(".xz-func-row");
  if (row && !$("xz56-moments-btn")) {
    var b = document.createElement("button");
    b.id = "xz56-moments-btn";
    b.className = "mini gbtn";
    b.textContent = "🌈 朋友圈";
    on(b, "click", function () { X56Moments.open(); });
    row.appendChild(b);
  }
  X56Moments.setBadge();
}
X56.inits.push(injectMomentsButton);
ready(function () {
  var n = 0;
  var t = setInterval(function () {
    injectMomentsButton();
    if (++n > 60) clearInterval(t);
  }, 400);
});

/* ══════════════════════════════════════════════════════════
   模块五：角色大创建（自由模式）
   游戏类型 / 家庭 / 外貌 / 爱好 / MBTI / 星座 / 血型 / 惯用手
   所有选择在开局生效并影响后续（属性、事件、聊天、运气）
   ══════════════════════════════════════════════════════════ */
var X56Char = {
  sel: {
    gt: "free",
    family: "worker",
    features: [],
    hobbies: [],
    mbti: "INFP",
    zodiac: "天秤",
    blood: "A",
    hand: "right",
    period: false
  },
  /* 家庭背景（含金钱 / 物品 / 属性效果） */
  families: [
    { id: "worker",  name: "普通工薪", money: 200, desc: "父母上班，家境普通。各方面均衡。", eff: "均衡开局" },
    { id: "cadre",   name: "干部家庭", money: 500, desc: "家里有干部，重视规矩与名声。", eff: "名声+10，压力略大" },
    { id: "biz",     name: "经商家庭", money: 1000, desc: "父母做生意，家境宽裕但忙碌。", eff: "金钱+，陪伴少" },
    { id: "teacher", name: "教师家庭", money: 300, desc: "父母是老师，学习管得严。", eff: "学习+，自律高" },
    { id: "rural",   name: "农村家庭", money: 80, desc: "务农或打工出身，能吃苦。", eff: "体力意志+，金钱少" },
    { id: "single",  name: "单亲家庭", money: 150, desc: "与爸爸或妈妈相依为命。", eff: "亲情事件多，敏感" },
    { id: "remarry", name: "重组家庭", money: 150, desc: "家庭重新组合，关系微妙。", eff: "家庭事件丰富" },
    { id: "scholar", name: "书香门第", money: 300, desc: "世代读书，家有藏书。", eff: "学习+，气质+5" },
    { id: "rich",    name: "富裕家庭", money: 3000, desc: "家境优渥，要什么有什么。", eff: "金钱+3000，压力大" },
    { id: "low",     name: "困难家庭", money: 30, desc: "享受低保，生活拮据。", eff: "意志+，逆袭剧情" }
  ],
  /* 外貌特征（多选，最多 4，影响颜值/气质与互动） */
  features: ["双眼皮", "酒窝", "虎牙", "泪痣", "高鼻梁", "肤白", "雀斑", "自然卷", "大眼睛",
    "笑起来好看", "婴儿肥", "柳叶眉", "桃花眼", "小梨涡", "娃娃脸", "长睫毛", "圆脸", "高颅顶"],
  /* 爱好/特长（多选，最多 3，影响社团/技能/道具） */
  hobbies: ["声乐", "钢琴", "绘画", "书法", "舞蹈", "篮球", "足球", "跑步", "乒乓球",
    "编程", "摄影", "写作", "辩论", "手工", "吉他", "羽毛球", "游泳", "动漫", "游戏", "烘焙"],
  /* 星座（12） */
  zodiacs: [
    { id: "白羊", el: "火", luck: "冲劲足，考试运随机" },
    { id: "金牛", el: "土", luck: "稳，攒钱+5%" },
    { id: "双子", el: "风", luck: "口才+，社交灵活" },
    { id: "巨蟹", el: "水", luck: "顾家，细心+" },
    { id: "狮子", el: "火", luck: "自信，领袖事件" },
    { id: "处女", el: "土", luck: "细致，错题率低" },
    { id: "天秤", el: "风", luck: "颜值+，选择困难" },
    { id: "天蝎", el: "水", luck: "专注，记仇也记恩" },
    { id: "射手", el: "火", luck: "乐观，体育+" },
    { id: "摩羯", el: "土", luck: "自律，学习稳" },
    { id: "水瓶", el: "风", luck: "脑洞，创新事件" },
    { id: "双鱼", el: "水", luck: "感性，共情强" }
  ],
  bloods: ["A", "B", "O", "AB"],
  hands: [{ id: "right", name: "右手" }, { id: "left", name: "左撇子" }, { id: "both", name: "双手通用" }],

  /* ── 游戏类型（顶部插入） ── */
  injectGameType: function () {
    var panel = $("charPanel");
    if (!panel || $("x56GtStep")) return;
    var step = document.createElement("div");
    step.className = "step";
    step.id = "x56GtStep";
    step.innerHTML = '<b>⓪ 游戏类型</b><div class="row" style="margin-top:5px">' +
      '<button class="chip sel" data-gt="free" onclick="X56Char.setGT(\'free\')">🏫 自由模式</button>' +
      '<button class="chip" data-gt="story" onclick="X56Char.setGT(\'story\')">📖 剧情模式</button></div>' +
      '<p class="dim small">自由模式：完整属性、学习、恋爱、打工、随机事件。<br>剧情模式：一本可玩的言情小说，弱化数值，只选一个女生，跟着剧情走。</p>';
    var h1 = panel.querySelector("h1");
    panel.insertBefore(step, h1.nextSibling);
  },
  setGT: function (gt) {
    this.sel.gt = gt;
    $a("#x56GtStep .chip").forEach(function (c) {
      c.classList.toggle("sel", c.getAttribute("data-gt") === gt);
    });
    this.applyVisibility();
  },
  /* 剧情模式：只留姓名 + 剧情按钮；自由模式：全显示 */
  applyVisibility: function () {
    var panel = $("charPanel");
    if (!panel) return;
    var story = this.sel.gt === "story";
    /* 隐藏所有 .step，除了 ① 姓名 与游戏类型 */
    $a("#charPanel > .step").forEach(function (s, i) {
      if (s.id === "x56GtStep") { s.style.display = ""; return; }
      s.style.display = story ? "none" : "";
    });
    var startBtn = $("startGoBtn");
    var contBtn = $("continueBtn");
    if (startBtn) startBtn.style.display = story ? "none" : "";
    if (contBtn) contBtn.style.display = "none";
    var sb = $("x56StoryStartBtn");
    if (story) {
      if (!sb) {
        sb = document.createElement("button");
        sb.id = "x56StoryStartBtn";
        sb.className = "big";
        sb.textContent = "📖 进入剧情";
        sb.style.cssText = "width:100%;margin-top:10px";
        on(sb, "click", function () { X56Story.boot(); });
        startBtn.parentNode.insertBefore(sb, startBtn.nextSibling);
      }
      sb.style.display = "";
    } else if (sb) sb.style.display = "none";
  },

  /* ── 自由模式新增步骤（在开始按钮前插入） ── */
  injectFreeSteps: function () {
    var panel = $("charPanel");
    if (!panel || $("x56FreeSteps")) return;
    var wrap = document.createElement("div");
    wrap.id = "x56FreeSteps";
    wrap.innerHTML =
      this.stepFamily() +
      this.stepFeatures() +
      this.stepHobbies() +
      this.stepMBTI() +
      this.stepZodiac() +
      this.stepMisc() +
      this.stepPeriod();
    var startBtn = $("startGoBtn");
    startBtn.parentNode.insertBefore(wrap, startBtn);
    this.bindFree();
  },
  stepFamily: function () {
    var chips = this.families.map(function (f) {
      return '<button class="chip' + (f.id === "worker" ? " sel" : "") +
        '" data-grp="family" data-v="' + f.id + '" title="' + esc(f.desc) + '">' + f.name + "</button>";
    }).join("");
    return '<div class="step"><b>⑪ 家庭背景</b> <span class="dim small">（影响开局金钱、物品、属性与家庭事件）</span>' +
      '<div class="row" style="margin-top:5px;flex-wrap:wrap" id="familyBox">' + chips + "</div>" +
      '<div class="tcard" id="familyInfo" style="margin-top:6px"></div></div>';
  },
  stepFeatures: function () {
    var chips = this.features.map(function (f) {
      return '<button class="chip" data-grp="features" data-v="' + esc(f) + '">' + f + "</button>";
    }).join("");
    return '<div class="step"><b>⑫ 外貌特征</b> <span class="dim small">（最多选 4，影响颜值/气质，NPC 会提起）</span>' +
      '<div class="row" style="margin-top:5px;flex-wrap:wrap">' + chips + "</div></div>";
  },
  stepHobbies: function () {
    var chips = this.hobbies.map(function (h) {
      return '<button class="chip" data-grp="hobbies" data-v="' + esc(h) + '">' + h + "</button>";
    }).join("");
    return '<div class="step"><b>⑬ 爱好 / 特长</b> <span class="dim small">（最多选 3，影响社团、技能与相关事件）</span>' +
      '<div class="row" style="margin-top:5px;flex-wrap:wrap">' + chips + "</div></div>";
  },
  stepMBTI: function () {
    var cards = X56MBTI.types.map(function (t) {
      return '<button class="chip" data-grp="mbti" data-v="' + t.code + '" title="' +
        esc(t.desc) + '" style="min-width:64px">' + t.code + "</button>";
    }).join("");
    return '<div class="step"><b>⑭ MBTI 性格</b> <span class="dim small">（16 型，影响精力、学习方式、社交、聊天风格与情绪）</span>' +
      '<div class="row" style="margin-top:5px;flex-wrap:wrap">' + cards + "</div>" +
      '<div class="tcard" id="mbtiInfo" style="margin-top:6px"></div></div>';
  },
  stepZodiac: function () {
    var chips = this.zodiacs.map(function (z) {
      return '<button class="chip" data-grp="zodiac" data-v="' + z.id + '" title="' + esc(z.luck) + '">' + z.id + "</button>";
    }).join("");
    return '<div class="step"><b>⑮ 星座</b> <span class="dim small">（影响每月小运气与性格倾向）</span>' +
      '<div class="row" style="margin-top:5px;flex-wrap:wrap">' + chips + "</div></div>";
  },
  stepMisc: function () {
    var bloods = this.bloods.map(function (b) {
      return '<button class="chip" data-grp="blood" data-v="' + b + '">' + b + "</button>";
    }).join("");
    var hands = this.hands.map(function (h) {
      return '<button class="chip' + (h.id === "right" ? " sel" : "") + '" data-grp="hand" data-v="' + h.id + '">' + h.name + "</button>";
    }).join("");
    return '<div class="step"><b>⑯ 血型 / 惯用手</b> <span class="dim small">（主要是性格侧写与生活细节）</span>' +
      '<div class="row" style="margin-top:5px;flex-wrap:wrap"><b>血型</b> ' + bloods + "</div>" +
      '<div class="row" style="margin-top:5px;flex-wrap:wrap"><b>惯用手</b> ' + hands + "</div></div>";
  },
  stepPeriod: function () {
    return '<div class="step" id="periodStep56"><b>⑰ 生理期系统</b> ' +
      '<span class="dim small">（仅女生，默认关闭）</span>' +
      '<div class="row" style="margin-top:5px">' +
      '<button class="chip sel" data-grp="period" data-v="off" onclick="X56Char.togglePeriod(\'off\')">不开启</button>' +
      '<button class="chip" data-grp="period" data-v="on" onclick="X56Char.togglePeriod(\'on\')">开启</button></div>' +
      '<p class="dim small">开启后会有生理期记录与情绪/体力变化；不开启则完全不影响。</p></div>';
  },
  togglePeriod: function (v) {
    this.sel.period = v === "on";
    $a("#periodStep56 .chip").forEach(function (c) {
      c.classList.toggle("sel", c.getAttribute("data-v") === v);
    });
  },

  /* 单选/多选交互 */
  bindFree: function () {
    var self = this;
    $a("#x56FreeSteps .chip").forEach(function (c) {
      on(c, "click", function () {
        var grp = c.getAttribute("data-grp");
        var v = c.getAttribute("data-v");
        if (grp === "features" || grp === "hobbies") {
          var arr = self.sel[grp];
          var max = grp === "features" ? 4 : 3;
          var idx = arr.indexOf(v);
          if (idx >= 0) arr.splice(idx, 1);
          else if (arr.length < max) arr.push(v);
          c.classList.toggle("sel", arr.indexOf(v) >= 0);
        } else {
          self.sel[grp] = v;
          $a('#x56FreeSteps .chip[data-grp="' + grp + '"]').forEach(function (x) {
            x.classList.toggle("sel", x.getAttribute("data-v") === v);
          });
        }
        self.refreshInfo();
      });
    });
  },
  refreshInfo: function () {
    var fi = $("familyInfo");
    if (fi) {
      var f = null;
      for (var i = 0; i < this.families.length; i++) if (this.families[i].id === this.sel.family) f = this.families[i];
      if (f) fi.innerHTML = "<b>" + f.name + "</b>：" + f.desc + "（" + f.eff + "）";
    }
    var mi = $("mbtiInfo");
    if (mi) {
      var t = X56MBTI.byCode(this.sel.mbti);
      if (t) mi.innerHTML = "<b>" + t.code + " · " + t.name + "</b>：" + t.desc + "<br>学习方式：" + t.study + "；恋爱风格：" + t.love;
    }
  },

  /* ── 开局生效：读取并应用所有效果（字段全部映射到基座真实字段） ── */
  applyToGame: function (G) {
    var s = this.sel;
    try {
      G.family = s.family;
      G.features56 = s.features.slice();
      G.hobbies56 = s.hobbies.slice();
      G.mbti = s.mbti;
      G.zodiac = s.zodiac;
      G.blood56 = s.blood;
      G.hand56 = s.hand;
      G.periodEnabled56 = !!s.period;
      if (!s.period) { G.period = false; G.periodDay = 0; G.periodPhase = 0; G.pain = 0; }

      /* 家庭效果（映射真实字段） */
      var f = null;
      for (var i = 0; i < this.families.length; i++) if (this.families[i].id === s.family) f = this.families[i];
      if (f) {
        G.money = (G.money || 0) + f.money;
        if (f.id === "cadre") { G.support += 10; G.influence += 5; G.mood -= 2; }
        if (f.id === "biz") { G.mood += 2; }
        if (f.id === "teacher") { G.knowledge += 6; G.academic += 4; }
        if (f.id === "scholar") { G.knowledge += 6; G.academic += 4; G.charm += 5; }
        if (f.id === "rural" || f.id === "low") { G.fitness += 8; G.health += 5; }
        if (f.id === "single") { G.mood -= 1; }
        if (f.id === "rich") {
          G.items = G.items || {};
          if (!G.items["最新款手机"]) G.items["最新款手机"] = 1;
        }
      }
      /* 外貌：每个特征 +2 颜值 */
      G.charm = (G.charm || 0) + s.features.length * 2;
      /* 爱好：存入技能表（新字段，供社团/事件读取），并给小加成 */
      G.skill56 = {};
      s.hobbies.forEach(function (h) {
        G.skill56[h] = 15;
        if (h === "篮球" || h === "足球" || h === "跑步" || h === "游泳" || h === "舞蹈") G.fitness += 1;
        if (h === "声乐" || h === "舞蹈" || h === "写作" || h === "摄影") G.charm += 1;
      });
      /* MBTI 一次性修正（mods 键均为真实字段） */
      var t = X56MBTI.byCode(s.mbti);
      if (t && t.mods) {
        for (var k in t.mods) {
          if (typeof G[k] === "number") G[k] += t.mods[k];
        }
      }
      /* 星座小修正 */
      if (s.zodiac === "天秤") G.charm += 3;
      if (s.zodiac === "射手") G.fitness += 2;
      if (s.zodiac === "处女") G.knowledge += 2;
      if (s.zodiac === "狮子") G.influence += 3;
      if (s.zodiac === "金牛") G.mood += 1;
    } catch (e) { X56.warn("角色效果应用失败", e); }
  }
};
window.X56Char = X56Char;

/* ── 装配：注入步骤 + 周期开关 + 包装 startGame / tick ── */
function x56CharInitUI() {
  try {
    X56Char.injectGameType();
    X56Char.injectFreeSteps();
    X56Char.applyVisibility();
  } catch (e) { X56.warn("角色 UI 注入失败", e); }
}
X56.inits.push(x56CharInitUI);
ready(function () {
  setTimeout(x56CharInitUI, 300);
  /* 角色面板可能被 startFlow 重新渲染，持续补偿 */
  var n = 0;
  var t = setInterval(function () {
    try {
      var p = $("charPanel");
      if (p) {
        if (!$("x56GtStep")) X56Char.injectGameType();
        if (!$("x56FreeSteps")) X56Char.injectFreeSteps();
        X56Char.applyVisibility();
      }
    } catch (e) {}
    if (++n > 60) clearInterval(t);
  }, 500);
});

/* 生理期默认关闭：包装 tick，在禁用时令触发条件永不成立 */
ready(function () {
  setTimeout(function () {
    var oldTick = window.tick;
    if (typeof oldTick === "function" && !window.__x56TickWrapped) {
      window.__x56TickWrapped = true;
      window.tick = function () {
        try {
          var g = window.G;
          if (g && g.gender === "女" && g.periodEnabled56 === false) {
            g.periodPhase = g.day + 1;
            if (g.period) { g.period = false; g.pain = 0; }
          }
        } catch (e) {}
        return oldTick.apply(this, arguments);
      };
    }
    /* 包装 startGame：先执行原逻辑（创建 G），再套用角色效果 */
    var oldStart = window.startGame;
    if (typeof oldStart === "function" && !window.__x56StartWrapped) {
      window.__x56StartWrapped = true;
      window.startGame = function () {
        oldStart.apply(this, arguments);
        try {
          if (window.G) {
            X56Char.applyToGame(window.G);
            if (typeof window.clampAll === "function") window.clampAll();
            if (typeof window.upd === "function") window.upd();
            X56.log("角色属性已生效");
          }
        } catch (e) { X56.warn("角色效果套用失败", e); }
      };
    }
  }, 400);
});

/* ══════════════════════════════════════════════════════════
   模块五（补充）：MBTI 16 型数据库（影响后续）
   mods：开局一次性修正（真实字段）
   daily：每日微小漂移（mood/sleep/fitness）
   study / love：学习方式与恋爱风格，进入聊天与事件文案
   ══════════════════════════════════════════════════════════ */
var X56MBTI = {
  types: [
    /* —— 分析家 —— */
    { code: "INTJ", name: "独立战略家", group: "分析家",
      desc: "有主见、爱规划，习惯把事情想清楚再行动。",
      mods: { knowledge: 4, support: -2, mood: -1 },
      daily: { mood: 0, sleep: -1 },
      study: "喜欢体系化自学，深夜效率高，擅长抓框架",
      love: "慢热，嘴上不说，其实把你写进了未来" },
    { code: "INTP", name: "好奇思辨者", group: "分析家",
      desc: "脑子里总有奇思妙想，喜欢钻研，不爱被管。",
      mods: { knowledge: 3, support: -3 },
      daily: { mood: 0 },
      study: "概念理解极强，不爱重复刷题",
      love: "嘴硬心软，需要独处空间，也只对你例外" },
    { code: "ENTJ", name: "天生领导者", group: "分析家",
      desc: "目标明确、执行力强，天生喜欢扛事。",
      mods: { influence: 6, support: 3, knowledge: 2, mood: 1 },
      daily: { mood: 1 },
      study: "目标驱动，计划狂魔，喜欢讲给别人听",
      love: "主动强势，会把你照顾得明明白白" },
    { code: "ENTP", name: "脑洞发明家", group: "分析家",
      desc: "反应快、爱抬杠，点子特别多。",
      mods: { influence: 3, support: 3, knowledge: 2, mood: 1 },
      daily: { mood: 1 },
      study: "靠兴趣和讨论学习，举一反三",
      love: "爱逗你，标准的欢喜冤家" },
    /* —— 外交家 —— */
    { code: "INFJ", name: "温柔理想主义", group: "外交家",
      desc: "细腻通透，有信念，能读懂别人的情绪。",
      mods: { support: 4, knowledge: 2, charm: 2, mood: -1 },
      daily: { mood: -1 },
      study: "安静深入，手写笔记有条理",
      love: "深情专一，选择了就是默默守护" },
    { code: "INFP", name: "浪漫梦想家", group: "外交家",
      desc: "内心戏丰富，看重真诚与精神契合。",
      mods: { charm: 3, support: 2, knowledge: 1 },
      daily: { mood: 0 },
      study: "按心情学习，灵感来了效率爆表",
      love: "纯情又害羞，把心动写成小秘密" },
    { code: "ENFJ", name: "暖心小太阳", group: "外交家",
      desc: "热心、会照顾人，天生适合做朋友。",
      mods: { support: 6, charm: 3, influence: 3, mood: 1 },
      daily: { mood: 1 },
      study: "喜欢和人一起学，互相讲题记得牢",
      love: "主动体贴，最会照顾你的情绪" },
    { code: "ENFP", name: "自由小太阳", group: "外交家",
      desc: "热情、好奇、爱表达，朋友很多。",
      mods: { support: 5, charm: 4, mood: 2 },
      daily: { mood: 2, sleep: -1 },
      study: "兴趣驱动，坐不住，但学得快",
      love: "热情直球，喜欢就想天天和你黏在一起" },
    /* —— 守护者 —— */
    { code: "ISTJ", name: "稳重执行者", group: "守护者",
      desc: "踏实、靠谱、有责任感，做事有条理。",
      mods: { knowledge: 4, fitness: 2, support: -1 },
      daily: { mood: 0 },
      study: "按部就班，错题本做得最认真",
      love: "内敛，不会甜言蜜语，但都在行动里" },
    { code: "ISFJ", name: "温柔守护者", group: "守护者",
      desc: "细心、耐心、好脾气，总替别人着想。",
      mods: { support: 4, charm: 2, health: 2 },
      daily: { mood: 0 },
      study: "踏实细心，愿意反复巩固",
      love: "贤惠温柔，默默把你放在心上" },
    { code: "ESTJ", name: "高效组织者", group: "守护者",
      desc: "讲规则、效率高，喜欢把事情安排明白。",
      mods: { influence: 5, fitness: 3, support: 1 },
      daily: { mood: 0 },
      study: "严格执行计划，自律性强",
      love: "直接又靠谱，爱你就会管着你" },
    { code: "ESFJ", name: "热心班长", group: "守护者",
      desc: "热心肠、爱张罗，班级里的小管家。",
      mods: { support: 6, charm: 3, influence: 2, mood: 1 },
      daily: { mood: 1 },
      study: "喜欢群体学习，互相督促",
      love: "暖心，爱和你分享每一件小事" },
    /* —— 探险家 —— */
    { code: "ISTP", name: "冷静手艺人", group: "探险家",
      desc: "冷静、动手能力强，话不多但靠谱。",
      mods: { fitness: 4, knowledge: 2, support: -2 },
      daily: { mood: 0 },
      study: "动手实践最强，拆装、实验一学就会",
      love: "酷酷的不黏人，关键时刻很可靠" },
    { code: "ISFP", name: "柔软艺术家", group: "探险家",
      desc: "温柔、敏感、有审美，喜欢安静的美好。",
      mods: { charm: 3, fitness: 2, mood: 1, support: -1 },
      daily: { mood: 1 },
      study: "沉浸感学习，艺术和音乐类特别强",
      love: "害羞温柔，总在细节里偷偷心动" },
    { code: "ESTP", name: "行动派", group: "探险家",
      desc: "胆子大、反应快、爱玩，喜欢新鲜刺激。",
      mods: { fitness: 5, support: 2, charm: 2, mood: 1 },
      daily: { mood: 1 },
      study: "短时突击能力强，实战派",
      love: "撩人高手，直球又会制造惊喜" },
    { code: "ESFP", name: "快乐制造机", group: "探险家",
      desc: "开朗、爱热闹、表现欲强，到哪都有笑声。",
      mods: { charm: 4, support: 3, fitness: 2, mood: 2 },
      daily: { mood: 2 },
      study: "坐不住，喜欢有趣的学习方式",
      love: "热情外放，甜起来毫不掩饰" }
  ],
  byCode: function (code) {
    for (var i = 0; i < this.types.length; i++) if (this.types[i].code === code) return this.types[i];
    return null;
  }
};
window.X56MBTI = X56MBTI;

/* 每日 MBTI 漂移（检测 G.day 变化，只在游戏主界面） */
(function () {
  var lastDay = -1;
  setInterval(function () {
    try {
      var G = window.G;
      if (!G || !G.mbti) return;
      var game = $("game");
      if (!game || !game.classList.contains("show")) return;
      if (G.day === lastDay) return;
      lastDay = G.day;
      var t = X56MBTI.byCode(G.mbti);
      if (t && t.daily) {
        if (t.daily.mood) G.mood = X56.clamp(G.mood + t.daily.mood, 0, 100);
        if (t.daily.sleep) G.sleep = X56.clamp(G.sleep + t.daily.sleep, 0, 100);
        if (t.daily.fitness) G.fitness = X56.clamp(G.fitness + t.daily.fitness, 0, 100);
      }
    } catch (e) {}
  }, 2500);
})();

/* ══════════════════════════════════════════════════════════
   模块六：剧情模式引擎（视觉小说）
   · 打字机对话框 · 选项 · 地图指引 · 好感心形 · 多结局
   · 弱化数值：只显示章节与心形，不显示属性指数
   ══════════════════════════════════════════════════════════ */
var X56Story = {
  KEY: "xz56_story_v1",
  state: null,
  /* 地点视觉（渐变 + 图标 + 显示名） */
  locs: {
    classroom: { name: "教学楼", icon: "🏫", bg: "linear-gradient(160deg,#2b4a7a,#1c3050 55%,#263a60)" },
    playground: { name: "操场", icon: "🏃", bg: "linear-gradient(160deg,#3f7a5a,#2a5a42 55%,#356a52)" },
    library: { name: "图书馆", icon: "📚", bg: "linear-gradient(160deg,#5a4a7a,#3c3258 55%,#4a3f68)" },
    canteen: { name: "食堂", icon: "🍜", bg: "linear-gradient(160deg,#a06a3a,#7a4a28 55%,#8a5838)" },
    dorm: { name: "宿舍", icon: "🛏️", bg: "linear-gradient(160deg,#3a4a6a,#28344e 55%,#33405c)" },
    gate: { name: "校门口", icon: "🚪", bg: "linear-gradient(160deg,#4a5a7a,#33405c 55%,#3e4c68)" },
    rooftop: { name: "天台", icon: "🌇", bg: "linear-gradient(160deg,#7a4a6a,#523050 55%,#5e3a5c)" },
    musicroom: { name: "音乐教室", icon: "🎹", bg: "linear-gradient(160deg,#2f5a7a,#204058 55%,#2a4c66)" },
    garden: { name: "校园小径", icon: "🌳", bg: "linear-gradient(160deg,#3a6a52,#284a3a 55%,#335a46)" },
    clinic: { name: "医务室", icon: "🏥", bg: "linear-gradient(160deg,#5a7a8a,#3e5866 55%,#466878)" }
  },
  heroines: [
    { id: "lin", name: "林晚", emoji: "🌸", color: "#ff9eb5",
      tag: "同班 · 温柔文艺", desc: "坐在你前桌的女孩，爱读书、会脸红，像春天里软乎乎的风。" },
    { id: "zhao", name: "赵小雨", emoji: "🎨", color: "#b79af8",
      tag: "美术生 · 古灵精怪", desc: "背着画板的活泼少女，爱恶作剧，笑容里藏着别人没发现的软。" },
    { id: "su", name: "苏清颜", emoji: "🎹", color: "#7cc4e8",
      tag: "高冷学霸 · 钢琴", desc: "年级第一的清冷女生，话很少，钢琴弹得很好，慢热但认真。" },
    { id: "xu", name: "许念", emoji: "🏀", color: "#8fd8ad",
      tag: "体育少女 · 短发飒爽", desc: "篮球队的短头发女生，仗义开朗像个兄弟，其实心思比谁都细。" }
  ],
  byId: function (id) {
    for (var i = 0; i < this.heroines.length; i++) if (this.heroines[i].id === id) return this.heroines[i];
    return null;
  },

  /* 启动（角色面板“进入剧情”） */
  boot: function () {
    var nameInput = $("fName");
    var myName = nameInput ? (nameInput.value.trim() || "我") : "我";
    this.ensureRoot();
    this.showPickHeroine(myName);
    /* 停掉背景音乐之外的喧嚣（不强制停音乐） */
    var hp = $("heroPanel"); if (hp) hp.style.display = "none";
    var cp = $("charPanel"); if (cp) cp.style.display = "none";
    var st = $("start"); if (st) { st.style.display = "none"; }
    var root = $("x56Story");
    root.classList.add("show");
  },
  ensureRoot: function () {
    var root = $("x56Story");
    if (!root) {
      root = document.createElement("div");
      root.id = "x56Story";
      root.innerHTML =
        '<div class="st-bg" id="stBg"></div>' +
        '<div class="st-top"><span class="st-chapter" id="stChapter">序章</span>' +
        '<span class="st-hearts" id="stHearts">♥♥♥♥♥</span>' +
        '<button class="st-menu-btn" id="stMenuBtn">☰</button></div>' +
        '<div class="st-loc-tag" id="stLocTag">🏫 教学楼</div>' +
        '<div class="st-stage"><div class="st-heroine" id="stHeroine">🌸</div></div>' +
        '<div class="st-choices" id="stChoices"></div>' +
        '<div class="st-dialog" id="stDialog">' +
        '<div class="st-nameplate" id="stNameplate">林晚</div>' +
        '<div class="st-text" id="stText"></div>' +
        '<span class="st-next-hint" id="stNext">▾</span></div>' +
        '<div class="st-map" id="stMap">' +
        '<div class="st-map-title">🗺️ 校园地图</div>' +
        '<div class="st-guide" id="stGuide"></div>' +
        '<div class="st-map-grid" id="stMapGrid"></div>' +
        '<button class="st-map-close" id="stMapClose">先不逛了</button></div>';
      document.body.appendChild(root);
      var self = this;
      on($("stDialog"), "click", function () { self.onTap(); });
      on($("stMenuBtn"), "click", function () { self.openMenu(); });
      on($("stMapClose"), "click", function () { self.closeMap(); });
    }
  },

  /* 女主选择 */
  showPickHeroine: function (myName) {
    var self = this;
    var root = $("x56Story");
    var pick = document.createElement("div");
    pick.className = "st-pick-heroine";
    pick.id = "stPickHeroine";
    pick.innerHTML =
      '<div class="ph-title">她是谁？</div>' +
      '<div class="ph-sub">剧情模式只能选择一个女生，一起走完这一整段故事<br>（选择后不可更改，名字：' + esc(myName) + '）</div>' +
      this.heroines.map(function (h) {
        return '<div class="ph-card" data-id="' + h.id + '">' +
          '<div class="ph-emoji" style="background:' + h.color + '33">' + h.emoji + "</div>" +
          "<div><div class='ph-name'>" + h.name + "</div>" +
          '<div class="ph-tag">' + h.tag + "</div>" +
          '<div class="ph-desc">' + h.desc + "</div></div></div>";
      }).join("");
    root.appendChild(pick);
    setTimeout(function () {
      $a("#stPickHeroine .ph-card").forEach(function (c) {
        on(c, "click", function () {
          self.startStory(c.getAttribute("data-id"), myName);
        });
      });
    }, 60);
  },
  startStory: function (heroineId, myName) {
    var p = $("stPickHeroine");
    if (p) p.remove();
    this.state = {
      heroine: heroineId,
      myName: myName,
      chapter: "序章",
      node: "c0",
      flags: {},
      affinity: 2,
      loc: "classroom"
    };
    this.save();
    this.go("c0");
  },

  /* 取当前女主剧本节点 */
  node: function (id) {
    var h = this.byId(this.state.heroine);
    var book = X56StoryContent[h.id];
    return (book && book[id]) || null;
  },

  /* 跳转节点并渲染 */
  go: function (id) {
    var nd = this.node(id);
    if (!nd) { X56.warn("找不到节点", id); return; }
    this.state.node = id;
    this.save();
    if (nd.chapter) { this.state.chapter = nd.chapter; $("stChapter").textContent = nd.chapter; }
    if (nd.loc) {
      this.state.loc = nd.loc;
      var L = this.locs[nd.loc];
      if (L) {
        $("stBg").style.background = L.bg;
        $("stLocTag").innerHTML = L.icon + " " + L.name;
      }
    }
    this.renderHearts();
    if (nd.type === "end") { this.renderEnd(nd); return; }
    if (nd.type === "router") { this.go(nd.route(this.state)); return; }
    if (nd.type === "map") { this.renderMapNode(nd); return; }
    /* 对话 / 选项节点 */
    var h = this.byId(this.state.heroine);
    var speaker = nd.speaker === "me" ? this.state.myName
      : nd.speaker === "narrator" ? "旁白" : h.name;
    var plate = $("stNameplate");
    plate.textContent = speaker;
    if (nd.speaker === "me")
      plate.style.background = "linear-gradient(135deg,#7cc4e8,#5aa8d0)";
    else if (nd.speaker === "narrator")
      plate.style.background = "linear-gradient(135deg,#6b7690,#4d576e)";
    else
      plate.style.background = "linear-gradient(135deg," + h.color + "," + h.color + "cc)";
    var emoji = nd.emoji || (nd.speaker === "me" ? "🧑" : h.emoji);
    $("stHeroine").textContent = emoji;
    $("stHeroine").style.animation = "none";
    void $("stHeroine").offsetWidth;
    $("stHeroine").style.animation = "stHeroineIn .8s cubic-bezier(.2,.8,.3,1.1)";
    if (nd.type === "choice") {
      this.typewrite(nd.text, function () { X56Story.renderChoices(nd); });
      $("stNext").style.display = "none";
    } else {
      $("stChoices").innerHTML = "";
      this.typewrite(nd.text, function () {});
      $("stNext").style.display = nd.next ? "" : "none";
    }
  },

  /* 打字机 */
  typerTimer: null,
  typewrite: function (text, done) {
    var el = $("stText");
    clearInterval(this.typerTimer);
    el.textContent = "";
    var i = 0;
    var speed = 28;
    this.typerTimer = setInterval(function () {
      el.textContent = text.substring(0, ++i);
      if (i >= text.length) {
        clearInterval(X56Story.typerTimer);
        X56Story.fullText = text;
        done && done();
      }
    }, speed);
  },
  skipType: function () {
    clearInterval(this.typerTimer);
    var nd = this.node(this.state.node);
    $("stText").textContent = nd.text;
    if (nd.type === "choice") this.renderChoices(nd);
  },

  /* 点击对话框：打字未完→立即出全文；否则→下一步 */
  onTap: function () {
    var nd = this.node(this.state.node);
    if (!nd || nd.type === "end") return;
    var el = $("stText");
    if (el.textContent.length < (nd.text || "").length) { this.skipType(); return; }
    if (nd.type === "line" && nd.next) this.go(nd.next);
  },

  /* 渲染选项 */
  renderChoices: function (nd) {
    var box = $("stChoices");
    box.innerHTML = "";
    nd.choices.forEach(function (ch, i) {
      var b = document.createElement("button");
      b.className = "st-choice";
      b.style.animationDelay = 0.05 * i + "s";
      var tag = ch.tag ? '<span class="ch-tag">' + ch.tag + "</span>" : "";
      b.innerHTML = tag + esc(ch.label);
      on(b, "click", function () {
        if (ch.eff) X56Story.state.affinity = X56.clamp(X56Story.state.affinity + ch.eff, 0, 10);
        if (ch.flags) for (var k in ch.flags) X56Story.state.flags[k] = ch.flags[k];
        X56Story.renderHearts();
        if (ch.next) X56Story.go(ch.next);
      });
      box.appendChild(b);
    });
  },

  /* 地图节点：打开地图，给出可选地点与推荐 */
  renderMapNode: function (nd) {
    var h = this.byId(this.state.heroine);
    var plate = $("stNameplate");
    plate.textContent = "系统";
    plate.style.background = "linear-gradient(135deg,#7a8cf0,#5a6ad0)";
    $("stHeroine").textContent = "🗺️";
    this.typewrite(nd.text, function () {});
    $("stNext").style.display = "none";
    $("stChoices").innerHTML = "";
    var guide = $("stGuide");
    guide.textContent = nd.guide || "";
    var grid = $("stMapGrid");
    var self = this;
    grid.innerHTML = nd.cells.map(function (c) {
      var L = self.locs[c.loc];
      var rec = c.rec ? " recommend" : "";
      var recTag = c.rec ? '<span class="rec-tag">推荐去这里</span>' : "";
      return '<div class="st-map-cell' + rec + '" data-target="' + c.target + '">' +
        '<span class="ic">' + (L ? L.icon : "📍") + "</span>" +
        (L ? L.name : c.label) + recTag + "</div>";
    }).join("");
    $a("#stMapGrid .st-map-cell").forEach(function (cell) {
      on(cell, "click", function () {
        self.closeMap();
        self.go(cell.getAttribute("data-target"));
      });
    });
    setTimeout(function () { $("stMap").classList.add("show"); }, 250);
  },
  closeMap: function () { $("stMap").classList.remove("show"); },

  /* 好感心形（5 颗，affinity 0-10 映射） */
  renderHearts: function () {
    var filled = Math.round(this.state.affinity / 2);
    var s = "";
    for (var i = 0; i < 5; i++) s += i < filled ? "❤️" : "🤍";
    $("stHearts").textContent = s;
  },

  /* 结局 */
  renderEnd: function (nd) {
    var root = $("x56Story");
    var old = $("stEnding");
    if (old) old.remove();
    var e = document.createElement("div");
    e.className = "st-ending";
    e.id = "stEnding";
    e.innerHTML =
      '<div class="end-emoji">' + (nd.emoji || "🌸") + "</div>" +
      '<div class="end-title">' + esc(nd.title) + "</div>" +
      '<div class="end-text">' + esc(nd.text) + "</div>" +
      '<div class="end-btns"><button id="stEndReplay" style="background:#4a86f5;color:#fff">再玩一次</button>' +
      '<button id="stEndBack" style="background:rgba(255,255,255,.16);color:#fff">回到主界面</button></div>';
    root.appendChild(e);
    var self = this;
    on($("stEndReplay"), "click", function () {
      e.remove();
      var p = $("stPickHeroine");
      if (p) p.remove();
      self.boot();
    });
    on($("stEndBack"), "click", function () { self.exit(); });
  },

  /* 菜单 */
  openMenu: function () {
    var h = '<h3>☰ 剧情菜单</h3>' +
      '<div class="quote">当前：<b>' + esc(this.byId(this.state.heroine).name) + '</b> · ' +
      esc(this.state.chapter) + "</div>" +
      '<button class="gbtn" style="width:100%" id="stMenuMap">🗺️ 查看地图</button>' +
      '<button class="gbtn" style="width:100%;margin-top:8px" id="stMenuRestart">↺ 重新开始剧情</button>' +
      '<button class="gbtn" style="width:100%;margin-top:8px" id="stMenuExit">🏠 退出到主界面</button>' +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button>';
    modal(h);
    var self = this;
    setTimeout(function () {
      on($("stMenuMap"), "click", function () { closeModal(); var nd = self.node(self.state.node); if (nd.type === "map") {} else toast("地图在剧情节点出现"); });
      on($("stMenuRestart"), "click", function () { closeModal(); self.boot(); });
      on($("stMenuExit"), "click", function () { closeModal(); self.exit(); });
    }, 60);
  },

  exit: function () {
    var root = $("x56Story");
    if (root) root.classList.remove("show");
    var e = $("stEnding"); if (e) e.remove();
    var st = $("start"); if (st) { st.style.display = ""; st.classList.add("show"); }
    var hp = $("heroPanel"); if (hp) hp.style.display = "";
    toast("已退出剧情模式", 1200);
  },

  save: function () {
    try { storageSet(this.KEY, JSON.stringify(this.state)); } catch (e) {}
  }
};
window.X56Story = X56Story;
var X56StoryContent = {};
window.X56StoryContent = X56StoryContent;

/* ══════════════════════════════════════════════════════════
   剧情内容 · 林晚（温柔文艺 · 同班）
   序章→初识→靠近→心动(雨天)→误会(运动会)→告白(天台)
   ══════════════════════════════════════════════════════════ */
X56StoryContent.lin = {
  /* ── 序章 ── */
  c0: { type: "line", chapter: "序章", loc: "classroom", speaker: "narrator", emoji: "🌤️",
    text: "九月初的阳光很好。作为转学来的新同学，班主任把你领到高一（3）班最后一排的空位。前面的女孩扎着马尾，桌角摊着一本《海子诗选》。",
    next: "c0a" },
  c0a: { type: "line", loc: "classroom", emoji: "🌸",
    text: "（她转过身，把一张课程表递给你，声音小小的）新同学你好……这是今天的课表。你的座位就在我后面。",
    next: "c0b" },
  c0b: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
    text: "她脸红着等你说话。你接过课程表，决定——",
    choices: [
      { label: "谢谢你，我叫XX。以后多关照。", tag: "礼貌", eff: 1, next: "c0c" },
      { label: "你在看海子的诗？", tag: "投缘", eff: 2, flags: { book: 1 }, next: "c0c_book" },
      { label: "（接过课程表，点点头）", tag: "冷淡", eff: 0, next: "c0c_quiet" }
    ] },
  c0c: { type: "line", loc: "classroom", emoji: "🌸",
    text: "我叫林晚……那以后有不懂的，你可以问我。", next: "c1" },
  c0c_book: { type: "line", loc: "classroom", emoji: "😳",
    text: "你也喜欢诗吗？这本我快看完了，可以借你。（她眼睛亮了一下）", next: "c1" },
  c0c_quiet: { type: "line", loc: "classroom", emoji: "🍃",
    text: "（她愣了一下，轻轻哦了一声转了回去）", next: "c1" },

  /* ── 第一章：初识（地图逛） ── */
  c1: { type: "line", chapter: "第一章 · 初识", loc: "classroom", speaker: "narrator", emoji: "🍂",
    text: "开学第一周，你慢慢熟悉了这所学校。课间、午休和放学，你可以去不同的地方走走。",
    next: "m1" },
  m1: { type: "map", loc: "classroom",
    text: "【自由活动】打开校园地图，看看去哪里。",
    guide: "多去几个地方逛逛，能更快认识林晚。她常在校园小径、图书馆和食堂出现。",
    cells: [
      { loc: "garden", target: "l1_garden", rec: true },
      { loc: "library", target: "l1_library", rec: true },
      { loc: "canteen", target: "l1_canteen", rec: true },
      { loc: "classroom", target: "l1_class" },
      { loc: "playground", target: "l1_play" },
      { loc: "gate", target: "l1_gate" }
    ] },
  l1_garden: { type: "line", loc: "garden", speaker: "narrator", emoji: "🌼",
    text: "小径旁的桂花开了，林晚一个人坐在长椅上看书。", next: "l1_garden_a" },
  l1_garden_a: { type: "line", loc: "garden", emoji: "🌸",
    text: "是你呀……好巧，你也来散步吗？", next: "l1_garden_b" },
  l1_garden_b: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
    text: "阳光落在她的书上，很香。",
    choices: [
      { label: "桂花很香，陪你坐一会儿。", eff: 2, flags: { garden: 1 }, next: "l1_garden2" },
      { label: "你在看什么书？", eff: 1, next: "l1_garden_b2" }
    ] },
  l1_garden2: { type: "line", loc: "garden", emoji: "😊",
    text: "（她往旁边挪了挪，给你让出位置）秋天的校园其实很美的，只是大家都忙着写作业。", next: "m1b" },
  l1_garden_b2: { type: "line", loc: "garden", emoji: "😳",
    text: "还是诗集……你别笑话我，我从小就喜欢这些。", next: "m1b" },

  l1_library: { type: "line", loc: "library", speaker: "narrator", emoji: "📖",
    text: "图书馆很安静，林晚在靠窗的位置抄写着什么。", next: "l1_library_a" },
  l1_library_a: { type: "line", loc: "library", emoji: "🤫",
    text: "嘘——（她压低声音）我在整理文言文字词，你也来找书吗？", next: "l1_library_b" },
  l1_library_b: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
    text: "她的字很清秀。",
    choices: [
      { label: "我来借习题，顺便帮你占座。", eff: 1, next: "l1_lib2" },
      { label: "你抄得真认真。", eff: 1, next: "l1_lib2" }
    ] },
  l1_lib2: { type: "line", loc: "library", emoji: "😊",
    text: "其实一起学习效率更高呢……你要是愿意，以后我们可以一起。", next: "m1b" },

  l1_canteen: { type: "line", loc: "canteen", speaker: "narrator", emoji: "🍚",
    text: "午饭时间人很多，你看到林晚端着餐盘，一时找不到位置。", next: "l1_canteen_a" },
  l1_canteen_a: { type: "line", loc: "canteen", emoji: "😅",
    text: "（她有点为难地端着盘子，左右看了看）", next: "l1_canteen_b" },
  l1_canteen_b: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
    text: "再这样下去她只能站着吃了。",
    choices: [
      { label: "我帮你占了座，过来吧。", eff: 2, flags: { lunch: 1 }, next: "l1_can2" },
      { label: "一起排队吧，我陪你等。", eff: 1, next: "l1_can2" }
    ] },
  l1_can2: { type: "line", loc: "canteen", emoji: "🌸",
    text: "谢谢你……不然我只能端着吃了。", next: "m1b" },

  l1_class: { type: "line", loc: "classroom", emoji: "📝",
    text: "课间不出去走走吗？我在预习下节课。", next: "l1_class_a" },
  l1_class_a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
    text: "她抬起头看你。",
    choices: [
      { label: "那我在这看会儿书。", eff: 1, next: "l1_class2" },
      { label: "你天天都这么用功。", eff: 0, next: "l1_class2" }
    ] },
  l1_class2: { type: "line", loc: "classroom", emoji: "🌸",
    text: "（她轻轻点头，把写好的笔记推到桌沿给你看）", next: "m1b" },

  l1_play: { type: "line", loc: "playground", speaker: "narrator", emoji: "🌿",
    text: "操场很热闹，林晚站在边上看别人打球，没有参与。", next: "l1_play_a" },
  l1_play_a: { type: "line", loc: "playground", emoji: "🍃",
    text: "我体育不太好……就在旁边看看。", next: "l1_play_b" },
  l1_play_b: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
    text: "她一个人站着有点孤单。",
    choices: [
      { label: "那我陪你沿操场走一圈。", eff: 1, flags: { walk: 1 }, next: "l1_play2" }
    ] },
  l1_play2: { type: "line", loc: "playground", emoji: "😊",
    text: "（她跟在你旁边，踩着跑道的白线）谢谢……其实我也想多运动，只是不好意思。", next: "m1b" },

  l1_gate: { type: "line", loc: "gate", speaker: "narrator", emoji: "🌇",
    text: "放学了，校门口很多家长接送。林晚一个人站着等公交。", next: "l1_gate_a" },
  l1_gate_a: { type: "line", loc: "gate", emoji: "🌸",
    text: "我每天坐公交回家，你呢？", next: "l1_gate_b" },
  l1_gate_b: { type: "choice", loc: "gate", speaker: "me", emoji: "🧑",
    text: "夕阳把她的影子拉得很长。",
    choices: [
      { label: "我也住校附近，一起走一段吧。", eff: 1, flags: { home: 1 }, next: "l1_gate2" }
    ] },
  l1_gate2: { type: "line", loc: "gate", emoji: "😊",
    text: "（她和你并肩走到公交站，小声）那明天见。", next: "m1b" },

  m1b: { type: "map", loc: "classroom",
    text: "【自由活动】你又多了解了一些她的日常。",
    guide: "继续探索也有小惊喜；想推进剧情，就去教学楼（推荐）。",
    cells: [
      { loc: "garden", target: "l1_garden_a" },
      { loc: "library", target: "l1_library_a" },
      { loc: "canteen", target: "l1_canteen_a" },
      { loc: "classroom", target: "c2", rec: true }
    ] },

  /* ── 第二章：靠近 ── */
  c2: { type: "line", chapter: "第二章 · 靠近", loc: "classroom", speaker: "narrator", emoji: "🍬",
    text: "接下来的两周，你们渐渐熟络。她会主动转过头问你听懂了没有，也会在你桌上放一颗糖。",
    next: "c2a" },
  c2a: { type: "line", loc: "classroom", emoji: "😳",
    text: "（她把一颗糖放在你桌上）谢谢你上次陪我……我自己都没发现，我最近很期待来上学。", next: "c2b" },
  c2b: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
    text: "她的耳朵尖红了。",
    choices: [
      { label: "因为能见到你吗？", tag: "心动", eff: 2, flags: { tease2: 1 }, next: "c2c" },
      { label: "糖很好吃，明天我请你吃早餐。", eff: 2, flags: { breakfast: 1 }, next: "c2c" },
      { label: "（收下糖，认真地）我也是。", eff: 1, next: "c2c" }
    ] },
  c2c: { type: "line", loc: "classroom", emoji: "🌸",
    text: "……你别这样说，我会当真的。", next: "m2" },

  m2: { type: "map", loc: "classroom",
    text: "【日常相处】课间和放学后，你想和她一起做点什么？",
    guide: "选择和她一起做的事，会影响她对你的感觉。她明显更愿意和你待在一起了。",
    cells: [
      { loc: "library", target: "l2_study", rec: true },
      { loc: "canteen", target: "l2_eat" },
      { loc: "garden", target: "l2_walk" },
      { loc: "musicroom", target: "l2_music" },
      { loc: "classroom", target: "c3", rec: true }
    ] },
  l2_study: { type: "line", loc: "library", emoji: "🤔",
    text: "今天数学最后一道大题，你会吗？我想了很久。", next: "l2_study_a" },
  l2_study_a: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
    text: "她把草稿纸推到你面前。",
    choices: [
      { label: "我教你，思路是这样的……", eff: 2, flags: { help2: 1 }, next: "l2_study2" },
      { label: "一起研究，两个人比一个人快。", eff: 1, next: "l2_study2" }
    ] },
  l2_study2: { type: "line", loc: "library", emoji: "😳",
    text: "（她看着你认真的侧脸，小声）和你一起，连难题都变得没那么可怕了。", next: "m2b" },

  l2_eat: { type: "line", loc: "canteen", emoji: "🍱",
    text: "今天的菜我来请吧，上次你帮了我。", next: "l2_eat_a" },
  l2_eat_a: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
    text: "她已经把餐盘放到了对面。",
    choices: [
      { label: "那我请你喝奶茶。", eff: 2, next: "l2_eat2" },
      { label: "好，下次一定换我。", eff: 1, next: "l2_eat2" }
    ] },
  l2_eat2: { type: "line", loc: "canteen", emoji: "😊",
    text: "（她吸着奶茶，眼睛弯起来）嗯，这杯我请定了。", next: "m2b" },

  l2_walk: { type: "line", loc: "garden", emoji: "🌳",
    text: "（她双手背在身后，踩着小径的影子）你有没有一件特别想做的事？", next: "l2_walk_a" },
  l2_walk_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
    text: "她的步伐很慢。",
    choices: [
      { label: "想和你一起把校园走一遍。", eff: 2, flags: { dream: 1 }, next: "l2_walk2" },
      { label: "想考上好大学。", eff: 1, next: "l2_walk2" }
    ] },
  l2_walk2: { type: "line", loc: "garden", emoji: "😳",
    text: "……那我就把我的愿望，分你一半。", next: "m2b" },

  l2_music: { type: "line", loc: "musicroom", emoji: "🎹",
    text: "（她在钢琴前坐下，弹了一小段简单的旋律）这是我自己瞎练的，别笑我。", next: "l2_music_a" },
  l2_music_a: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
    text: "音符在教室里轻轻转。",
    choices: [
      { label: "很好听，再弹一首吧。", eff: 2, flags: { piano: 1 }, next: "l2_music2" },
      { label: "你弹琴的时候很不一样。", eff: 1, next: "l2_music2" }
    ] },
  l2_music2: { type: "line", loc: "musicroom", emoji: "🌸",
    text: "（她的手指顿了一下，又弹了下去）……那我只弹给你听。", next: "m2b" },

  m2b: { type: "map", loc: "classroom",
    text: "【日常相处】这些相处的时光，她都会记得。",
    guide: "再做点什么都好；想继续故事，就去教学楼（推荐）。",
    cells: [
      { loc: "library", target: "l2_study" },
      { loc: "canteen", target: "l2_eat" },
      { loc: "garden", target: "l2_walk" },
      { loc: "musicroom", target: "l2_music" },
      { loc: "classroom", target: "c3", rec: true }
    ] },

  /* ── 第三章：心动（雨天） ── */
  c3: { type: "line", chapter: "第三章 · 心动", loc: "gate", speaker: "narrator", emoji: "🌧️",
    text: "十月的天气说变就变。这天放学，天色忽然阴沉下来，没一会儿就下起了大雨。",
    next: "c3a" },
  c3a: { type: "line", loc: "gate", emoji: "😟",
    text: "我没带伞……看来要等雨停了。", next: "c3b" },
  c3b: { type: "choice", loc: "gate", speaker: "me", emoji: "🧑",
    text: "雨越下越大，她抱着书包站在屋檐下。",
    choices: [
      { label: "我送你，我们共一把伞。", eff: 3, flags: { rain: 1 }, next: "c3_rain" },
      { label: "我去帮你借把伞。", eff: 1, next: "c3_umbrella" },
      { label: "我陪你一起等雨停。", eff: 2, flags: { wait: 1 }, next: "c3_wait" }
    ] },
  c3_rain: { type: "line", loc: "gate", speaker: "narrator", emoji: "☂️",
    text: "你撑开伞，两个人靠得很近。雨打在伞面上，她的肩膀还是淋湿了一点。", next: "c3_rain_a" },
  c3_rain_a: { type: "line", loc: "gate", emoji: "😳",
    text: "（她小声）我没事，就是……离你太近了，你别介意。", next: "c3_rain_b" },
  c3_rain_b: { type: "choice", loc: "gate", speaker: "me", emoji: "🧑",
    text: "她的发梢滴着水，脸很红。",
    choices: [
      { label: "（把伞往她那边倾，自己湿了半边）我没事。", eff: 3, flags: { sacrifice: 1 }, next: "c3_end" },
      { label: "这样的雨天，好像也没那么讨厌。", eff: 2, next: "c3_end" }
    ] },
  c3_umbrella: { type: "line", loc: "gate", emoji: "🌸",
    text: "你特意为我跑一趟吗？……谢谢，伞你也要记得回来。", next: "c3_end" },
  c3_wait: { type: "line", loc: "gate", speaker: "narrator", emoji: "🌧️",
    text: "你们坐在门口的台阶上，看雨一点点变小，屋檐下有淡淡的水汽。", next: "c3_wait_a" },
  c3_wait_a: { type: "line", loc: "gate", emoji: "😳",
    text: "其实我很少和一个人说这么多话……也很少有人愿意这样陪我等。", next: "c3_wait_b" },
  c3_wait_b: { type: "choice", loc: "gate", speaker: "me", emoji: "🧑",
    text: "她的声音很轻。",
    choices: [
      { label: "以后我都陪你。", eff: 2, next: "c3_end" },
      { label: "我也是。", eff: 1, next: "c3_end" }
    ] },
  c3_end: { type: "line", loc: "gate", speaker: "narrator", emoji: "💗",
    text: "那天之后，你们之间好像有什么悄悄变了。她看你的眼神，多了一点说不清的东西。",
    next: "c4" },

  /* ── 第四章：误会（运动会） ── */
  c4: { type: "line", chapter: "第四章 · 在意", loc: "playground", speaker: "narrator", emoji: "🏅",
    text: "十一月初，秋季运动会。林晚报了跳远；你帮班委布置场地时，和另一个女生一起忙活了很久。",
    next: "c4a" },
  c4a: { type: "line", loc: "playground", emoji: "🙁",
    text: "（她远远看着你们，没有过来，抱着号码布站在沙坑边）", next: "c4b" },
  c4b: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
    text: "你注意到她的神情有点不对。",
    choices: [
      { label: "（放下手头的事，跑过去）你跳远准备好了吗？", eff: 2, flags: { clear4: 1 }, next: "c4c" },
      { label: "（先布置完，稍后再找她）", eff: 0, flags: { late4: 1 }, next: "c4_late" }
    ] },
  c4c: { type: "line", loc: "playground", emoji: "😤",
    text: "（她抿了抿嘴）你不用特意来陪我，你不是在忙吗？", next: "c4d" },
  c4d: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
    text: "她明明在等你解释。",
    choices: [
      { label: "你比较重要。", eff: 2, next: "c4e" },
      { label: "我怕你误会。", eff: 1, next: "c4e" }
    ] },
  c4e: { type: "line", loc: "playground", emoji: "😳",
    text: "……我才没有误会。（她低下头，嘴角却翘了起来）", next: "c5" },
  c4_late: { type: "line", loc: "playground", emoji: "🍃",
    text: "（你忙完跑过去时，她已经检录完）你忙完啦？", next: "c4_late_a" },
  c4_late_a: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
    text: "她的声音淡淡的。",
    choices: [
      { label: "（认真解释）对不起，以后我会先说清楚。", eff: 1, next: "c4_late2" },
      { label: "我们只是在搬东西，你别多想。", eff: 0, next: "c4_late2" }
    ] },
  c4_late2: { type: "line", loc: "playground", emoji: "🌸",
    text: "我相信你。只是……我会有点在意。", next: "c5" },

  /* ── 第五章：告白（天台） ── */
  c5: { type: "line", chapter: "第五章 · 心之所向", loc: "rooftop", speaker: "narrator", emoji: "🌇",
    text: "运动会后的傍晚，天边有很好看的晚霞。你和林晚不知不觉走到了教学楼的天台。",
    next: "c5a" },
  c5a: { type: "line", loc: "rooftop", emoji: "🌆",
    text: "（她扶着栏杆，风吹起头发）你知道吗，我有话想对你说。", next: "c5b" },
  c5b: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
    text: "夕阳把她的脸照得很红，她在等你。",
    choices: [
      { label: "林晚，我喜欢你。从你借我课程表那天起。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
      { label: "（轻轻握住她的手）我想一直和你在一起。", eff: 2, flags: { hold: 1 }, next: "c5_judge" },
      { label: "（沉默了）你是我很好的朋友。", flags: { friend: 1 }, next: "c5_judge" }
    ] },
  c5_judge: { type: "router",
    route: function (s) {
      if (s.flags.friend) return "end_friend";
      if (s.affinity >= 7) return "end_sweet";
      if (s.affinity >= 4) return "end_normal";
      return "end_miss";
    } },

  end_sweet: { type: "end", emoji: "🌸",
    title: "结局 · 心之所向",
    text: "她红着脸点了点头。“我也是……我也喜欢你。” 天台上的风、晚霞，还有她握紧的手，都成了这个秋天最好的答案。后来你们一起自习、一起散步、一起为未来努力——故事没有结束，它才刚刚开始。" },
  end_normal: { type: "end", emoji: "🌤️",
    title: "结局 · 迟来的答案",
    text: "她看着你，轻轻笑了。“谢谢你愿意告诉我……让我再想一想，好吗？” 有些心动需要时间。你们依旧是很好的伙伴，也许在未来某一天，那句话会在恰好的时候响起。" },
  end_friend: { type: "end", emoji: "🤝",
    title: "结局 · 最好的朋友",
    text: "她愣了一下，然后释然地笑了。“能做你最好的朋友，我也很开心。” 有些感情没有成为爱情，却成了另一种长久的陪伴。" },
  end_miss: { type: "end", emoji: "🍂",
    title: "结局 · 错过",
    text: "她低下头，夕阳在她身后慢慢落下去。“对不起……” 风把那句话吹散在天台上。青春里总有遗憾，但至少，你认真地喜欢过。" }
};

/* ══════════════════════════════════════════════════════════
   剧情内容 · 赵小雨（美术生 · 古灵精怪）
   序章(走廊撞上画架)→初识→靠近→心动(画展)→误会("好哥们")→告白
   ══════════════════════════════════════════════════════════ */
X56StoryContent.zhao = {
  /* ── 序章 ── */
  c0: { type: "line", chapter: "序章", loc: "garden", speaker: "narrator", emoji: "🎨",
    text: "开学第一天你走错了路，沿着走廊找教室，拐过一个弯，差点撞上一个画架。一个袖子上沾着颜料的女生正蹲在地上画画。",
    next: "c0a" },
  c0a: { type: "line", loc: "garden", emoji: "😲",
    text: "哎哎哎——别踩！（她一把拉住你，画板上是个没画完的人影）……诶，你这人怎么长得这么好画。",
    next: "c0b" },
  c0b: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
    text: "你低头看她画板上的人影。",
    choices: [
      { label: "你是在画我？", tag: "好奇", eff: 1, next: "c0c" },
      { label: "你画得真好看。", tag: "夸奖", eff: 2, flags: { praise: 1 }, next: "c0c_praise" },
      { label: "（看着她五颜六色的袖子）……", eff: 0, next: "c0c_q" }
    ] },
  c0c: { type: "line", loc: "garden", emoji: "😏",
    text: "对啊！新同学，借你当十秒钟模特，我还没画完呢。", next: "c1" },
  c0c_praise: { type: "line", loc: "garden", emoji: "😳",
    text: "（她愣了一下，笑得狡黠）你第一句话就夸我？行，记住你了。", next: "c1" },
  c0c_q: { type: "line", loc: "garden", emoji: "🎨",
    text: "哦，这是颜料啦，洗不掉的。我叫赵小雨，美术班的，你呢？", next: "c1" },

  /* ── 第一章 ── */
  c1: { type: "line", chapter: "第一章 · 初识", loc: "classroom", speaker: "narrator", emoji: "🍂",
    text: "第一周，赵小雨像一阵风一样在你生活里出现，总带着画板和笑。课间和放学，你可以去不同地方找找她。",
    next: "m1" },
  m1: { type: "map", loc: "classroom",
    text: "【自由活动】去哪里找她？",
    guide: "她爱去高处写生、在花园画画，也常常在食堂和教室出现。",
    cells: [
      { loc: "rooftop", target: "l1_roof", rec: true },
      { loc: "garden", target: "l1_garden", rec: true },
      { loc: "classroom", target: "l1_class" },
      { loc: "canteen", target: "l1_canteen" },
      { loc: "library", target: "l1_library" },
      { loc: "gate", target: "l1_gate" }
    ] },
  l1_roof: { type: "line", loc: "rooftop", speaker: "narrator", emoji: "🌇",
    text: "天台的视野很好，赵小雨坐在水箱旁，对着远处的楼群速写。", next: "l1_roof_a" },
  l1_roof_a: { type: "line", loc: "rooftop", emoji: "😏",
    text: "（她头也不抬）坐，别挡我光。你来得正好，我正缺个远景参照物。", next: "l1_roof_b" },
  l1_roof_b: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
    text: "风吹动她的画纸。",
    choices: [
      { label: "（安静坐下陪她看风景）", eff: 2, flags: { roof: 1 }, next: "l1_roof2" },
      { label: "你为什么总往高处跑？", eff: 1, next: "l1_roof3" }
    ] },
  l1_roof2: { type: "line", loc: "rooftop", emoji: "😊",
    text: "（她偷瞄你，笔下的线条变快了）……你坐着别动，我画得特别顺手。", next: "m1b" },
  l1_roof3: { type: "line", loc: "rooftop", emoji: "🎨",
    text: "因为站得高，看得远，烦恼就变小了呀。", next: "m1b" },

  l1_garden: { type: "line", loc: "garden", emoji: "🌿",
    text: "她蹲在花坛边写生，画板上是一枝桂花。", next: "l1_garden_a" },
  l1_garden_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
    text: "她画得很专注。",
    choices: [
      { label: "（蹲在旁边看她画）", eff: 2, flags: { sketch: 1 }, next: "l1_garden2" },
      { label: "教我画两笔吧。", eff: 1, next: "l1_garden3" }
    ] },
  l1_garden2: { type: "line", loc: "garden", emoji: "😳",
    text: "（她的笔顿了一下）你靠这么近，我会画歪的……", next: "m1b" },
  l1_garden3: { type: "line", loc: "garden", emoji: "😏",
    text: "好呀，先画一个圆圈——你看，画画没那么难。", next: "m1b" },

  l1_class: { type: "line", loc: "classroom", emoji: "📝",
    text: "她趁着课间溜到你们班，给你递来一张画满卡通小人的纸条。", next: "l1_class_a" },
  l1_class_a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
    text: "纸条上的小人表情很夸张。",
    choices: [
      { label: "（也在纸条上画一个回她）", eff: 1, next: "l1_class2" },
      { label: "你上课也这样传纸条？", eff: 1, next: "l1_class2" }
    ] },
  l1_class2: { type: "line", loc: "classroom", emoji: "😏",
    text: "（她接过纸条，笑得肩膀直抖）记住了，你是我最佳笔友。", next: "m1b" },

  l1_canteen: { type: "line", loc: "canteen", emoji: "🍰",
    text: "她面前堆着两个小蛋糕，看到你就招手。", next: "l1_canteen_a" },
  l1_canteen_a: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
    text: "她把其中一个推给你。",
    choices: [
      { label: "谢啦，明天我请你。", eff: 1, next: "l1_canteen2" },
      { label: "你怎么这么能吃甜的？", eff: 1, next: "l1_canteen3" }
    ] },
  l1_canteen2: { type: "line", loc: "canteen", emoji: "😊",
    text: "（她叼着叉子点头）好，我记住了，你请客。", next: "m1b" },
  l1_canteen3: { type: "line", loc: "canteen", emoji: "😏",
    text: "甜的能让灵感冒出来呀，你不懂。", next: "m1b" },

  l1_library: { type: "line", loc: "library", emoji: "📖",
    text: "她在图书馆里也没闲着，正偷偷画对面同学的侧脸。", next: "l1_library_a" },
  l1_library_a: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
    text: "她冲你比了个“嘘”。",
    choices: [
      { label: "（在她旁边坐下，小声）别被发现。", eff: 1, next: "l1_library2" }
    ] },
  l1_library2: { type: "line", loc: "library", emoji: "😏",
    text: "（她压着笑，画板转过来给你看）你看，像不像？", next: "m1b" },

  l1_gate: { type: "line", loc: "gate", emoji: "🌇",
    text: "放学时她背着画板从校门口走出来，画板比她人还宽。", next: "l1_gate_a" },
  l1_gate_a: { type: "choice", loc: "gate", speaker: "me", emoji: "🧑",
    text: "她差点撞到门框。",
    choices: [
      { label: "（帮她扶了一下画板）小心。", eff: 1, next: "l1_gate2" }
    ] },
  l1_gate2: { type: "line", loc: "gate", emoji: "😳",
    text: "谢啦……你人还挺好。（她吐了吐舌头）", next: "m1b" },

  m1b: { type: "map", loc: "classroom",
    text: "【自由活动】你慢慢习惯了她的热闹。",
    guide: "再逛也有趣；想推进剧情，去教学楼（推荐）。",
    cells: [
      { loc: "rooftop", target: "l1_roof_a" },
      { loc: "garden", target: "l1_garden" },
      { loc: "canteen", target: "l1_canteen" },
      { loc: "classroom", target: "c2", rec: true }
    ] },

  /* ── 第二章：靠近 ── */
  c2: { type: "line", chapter: "第二章 · 靠近", loc: "classroom", speaker: "narrator", emoji: "🎨",
    text: "两周后，赵小雨拉着你当模特、塞给你零食、画了无数张你的侧脸。她不再只是“偶然”出现了。",
    next: "c2a" },
  c2a: { type: "line", loc: "classroom", emoji: "😏",
    text: "（她把一张画递给你）喏，画了你这么多张，这张最像，送你。", next: "c2b" },
  c2b: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
    text: "画上的你在笑。",
    choices: [
      { label: "我要一直留着。", eff: 2, flags: { keep: 1 }, next: "c2c" },
      { label: "画得比我本人还好看。", eff: 1, next: "c2c" },
      { label: "那我也给你画一张。", eff: 2, flags: { drawback: 1 }, next: "c2c" }
    ] },
  c2c: { type: "line", loc: "classroom", emoji: "😳",
    text: "（她的耳朵红了，嘴上还逞强）……那你可得好好收藏。", next: "m2" },

  m2: { type: "map", loc: "classroom",
    text: "【日常相处】想和她一起做什么？",
    guide: "她最喜欢和你一起做有趣的事，这会悄悄改变她对你的感觉。",
    cells: [
      { loc: "garden", target: "l2_sketch", rec: true },
      { loc: "rooftop", target: "l2_roof" },
      { loc: "library", target: "l2_library" },
      { loc: "canteen", target: "l2_eat" },
      { loc: "classroom", target: "c3", rec: true }
    ] },
  l2_sketch: { type: "line", loc: "garden", emoji: "🖌️",
    text: "（她把一支笔塞进你手里）今天我教你画一朵花，认真点。", next: "l2_sketch_a" },
  l2_sketch_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
    text: "她凑得很近，握着你的手示范。",
    choices: [
      { label: "（认真学，画完给她看）", eff: 2, flags: { learn: 1 }, next: "l2_sketch2" },
      { label: "有你在，我学不会。", eff: 2, flags: { tease: 1 }, next: "l2_sketch3" }
    ] },
  l2_sketch2: { type: "line", loc: "garden", emoji: "😊",
    text: "（她看着歪歪扭扭的花，笑弯了眼）虽然丑，但我收了。", next: "m2b" },
  l2_sketch3: { type: "line", loc: "garden", emoji: "😳",
    text: "……你少贫嘴。（她低下头，手却没松开）", next: "m2b" },

  l2_roof: { type: "line", loc: "rooftop", emoji: "🌇",
    text: "（她在天台铺开两张速写纸）我们来比赛，画对方，谁画得像谁赢。", next: "l2_roof_a" },
  l2_roof_a: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
    text: "她已经飞快地动起笔。",
    choices: [
      { label: "（认真画她认真的样子）", eff: 2, flags: { paintme: 1 }, next: "l2_roof2" },
      { label: "我认输，我画不过你。", eff: 1, next: "l2_roof2" }
    ] },
  l2_roof2: { type: "line", loc: "rooftop", emoji: "😳",
    text: "（她抢过你的画，看了很久）……你画的我，比我画的你认真。", next: "m2b" },

  l2_library: { type: "line", loc: "library", emoji: "📚",
    text: "（她难得安静地坐在旁边陪你写作业，手里还在画）", next: "l2_library_a" },
  l2_library_a: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
    text: "她偷偷把你写作业的样子画了下来。",
    choices: [
      { label: "（写完作业让她检查）", eff: 1, next: "l2_library2" },
      { label: "你再画我，我可要收版权费了。", eff: 2, flags: { tease: 1 }, next: "l2_library2" }
    ] },
  l2_library2: { type: "line", loc: "library", emoji: "😏",
    text: "（她压低声音）那我把画都给你，抵版权费行不行？", next: "m2b" },

  l2_eat: { type: "line", loc: "canteen", emoji: "🍜",
    text: "（她把餐盘往你对面一放）今天我请，你负责夸我。", next: "l2_eat_a" },
  l2_eat_a: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
    text: "她眼睛亮亮地看着你。",
    choices: [
      { label: "（认真地）你是我见过最有趣的人。", eff: 2, next: "l2_eat2" },
      { label: "菜不错，画师也不错。", eff: 1, next: "l2_eat2" }
    ] },
  l2_eat2: { type: "line", loc: "canteen", emoji: "😳",
    text: "（她被汤呛了一下，咳了两声）……你今天，嘴怎么这么甜。", next: "m2b" },

  m2b: { type: "map", loc: "classroom",
    text: "【日常相处】这些相处的瞬间，她都悄悄画进了本子。",
    guide: "想继续故事，去教学楼（推荐）。",
    cells: [
      { loc: "garden", target: "l2_sketch" },
      { loc: "rooftop", target: "l2_roof" },
      { loc: "canteen", target: "l2_eat" },
      { loc: "classroom", target: "c3", rec: true }
    ] },

  /* ── 第三章：心动（画展） ── */
  c3: { type: "line", chapter: "第三章 · 心动", loc: "garden", speaker: "narrator", emoji: "🖼️",
    text: "十月底，学校举办校园艺术节画展。赵小雨有一幅一直藏着、不肯给你看的参展作品。",
    next: "c3a" },
  c3a: { type: "line", loc: "garden", speaker: "narrator", emoji: "👥",
    text: "画展开幕，你走到她的画前。旁边几个同学正小声议论：“这画的什么啊，看不懂。”", next: "c3b" },
  c3b: { type: "line", loc: "garden", emoji: "😏",
    text: "（她笑着耸肩，声音却没平时那么亮）艺术嘛，不需要人人都懂。", next: "c3c" },
  c3c: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
    text: "你看清那幅画——是开学那天，走廊里的你。画名叫《新同学》。",
    choices: [
      { label: "我懂。这是开学的我，对不对？", eff: 3, flags: { understand: 1 }, next: "c3_paint" },
      { label: "（对议论的人）我觉得很好，你们没看懂而已。", eff: 2, flags: { defend: 1 }, next: "c3_defend" },
      { label: "画而已，别往心里去。", eff: 0, next: "c3_end" }
    ] },
  c3_paint: { type: "line", loc: "garden", emoji: "😳",
    text: "（她怔住了）你怎么……一眼就看出来了。（她小声）因为那天，我画得特别认真。", next: "c3_end" },
  c3_defend: { type: "line", loc: "garden", emoji: "😳",
    text: "（她看着你，眨了眨眼）……你好像比我还护着这幅画。", next: "c3_end" },
  c3_end: { type: "line", loc: "garden", speaker: "narrator", emoji: "💗",
    text: "那天她收起画夹，看了你很久。她自己大概也没发现，她画你的时候，眼神是那样的。",
    next: "c4" },

  /* ── 第四章：误会（"好哥们"） ── */
  c4: { type: "line", chapter: "第四章 · 在意", loc: "classroom", speaker: "narrator", emoji: "🚪",
    text: "几天后，赵小雨来找你，在走廊拐角听见你和同学说笑。同学问：“赵小雨是不是对你有意思？”",
    next: "c4a" },
  c4a: { type: "line", loc: "classroom", emoji: "😅",
    text: "（她听见你说：“赵小雨？我们就是好哥们，她特别逗。”）", next: "c4b" },
  c4b: { type: "line", loc: "classroom", emoji: "😏",
    text: "哟，好哥们！（她笑嘻嘻地拍你肩膀，可眼神没什么笑意）", next: "c4c" },
  c4c: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
    text: "你察觉她不对劲了。",
    choices: [
      { label: "你不是哥们。", eff: 2, flags: { notbuddy: 1 }, next: "c4d" },
      { label: "我刚才开玩笑的，你别当真。", eff: 0, next: "c4_late" }
    ] },
  c4d: { type: "line", loc: "classroom", emoji: "😳",
    text: "（她停下脚步，声音轻了）那……我是什么？", next: "c4e" },
  c4e: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
    text: "她第一次没有用玩笑把话挡回来。",
    choices: [
      { label: "你是我很在意的人。", eff: 2, next: "c4f" },
      { label: "是……特别的人。", eff: 1, next: "c4f" }
    ] },
  c4f: { type: "line", loc: "classroom", emoji: "😳",
    text: "（她的脸一下子红了，小声嘟囔）你早说嘛……害我郁闷了一整天。", next: "c5" },
  c4_late: { type: "line", loc: "classroom", emoji: "🍃",
    text: "（她摆摆手，笑得很淡）知道啦，好哥们。", next: "c4_late_a" },
  c4_late_a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
    text: "她真的往心里去了。",
    choices: [
      { label: "（认真地拉住她）不是哥们，我喜欢你。", eff: 2, flags: { notbuddy: 1 }, next: "c4_late2" },
      { label: "我真的只把你当朋友。", flags: { friend: 1 }, next: "c4_late3" }
    ] },
  c4_late2: { type: "line", loc: "classroom", emoji: "😳",
    text: "（她愣住，画板差点没拿稳）……你，你认真的？", next: "c5" },
  c4_late3: { type: "line", loc: "classroom", emoji: "🌸",
    text: "（她沉默了两秒，又笑起来）嗯，我知道了，最好的朋友。", next: "c5" },

  /* ── 第五章：告白（画室） ── */
  c5: { type: "line", chapter: "第五章 · 画板上的心动", loc: "garden", speaker: "narrator", emoji: "🎨",
    text: "傍晚，赵小雨把你领到她的画室，画架上盖着一块布。", next: "c5a" },
  c5a: { type: "line", loc: "garden", emoji: "😳",
    text: "最后一幅画……你自己掀开。（她抱着画板，难得地紧张）", next: "c5b" },
  c5b: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
    text: "你掀开布——画里是你们两个人的背影，角落写着一行字：“我喜欢你。”",
    choices: [
      { label: "赵小雨，我也喜欢你。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
      { label: "（在画纸背面写下“我也是”）", eff: 2, flags: { write: 1 }, next: "c5_judge" },
      { label: "我们做朋友，是最好的。", flags: { friend: 1 }, next: "c5_judge" }
    ] },
  c5_judge: { type: "router",
    route: function (s) {
      if (s.flags.friend) return "end_friend";
      if (s.affinity >= 7) return "end_sweet";
      if (s.affinity >= 4) return "end_normal";
      return "end_miss";
    } },

  end_sweet: { type: "end", emoji: "🎨",
    title: "结局 · 画板上的心动",
    text: "她的眼泪一下子涌出来，又笑了。“你知不知道，我画了你好多张……” 后来她把那张画挂在画室最显眼的地方，画里的两个人，会一直一直走下去。" },
  end_normal: { type: "end", emoji: "🌤️",
    title: "结局 · 还没画完的故事",
    text: "她吸了吸鼻子，笑了。“没关系……我们先把故事画下去。” 有些告白没有立刻得到答案，却留在了画纸的下一页。" },
  end_friend: { type: "end", emoji: "🤝",
    title: "结局 · 最好的搭档",
    text: "她愣了一下，随即大笑起来，拍你肩膀。“行，那我们就是一辈子的好搭档。” 有些陪伴，是另一种长久。" },
  end_miss: { type: "end", emoji: "🍂",
    title: "结局 · 褪色的颜料",
    text: "她默默把画布盖上，笑得很轻。“没关系，画完了。” 那天之后，她画你的次数少了。青春里，有些颜料会慢慢褪色。" }
};

/* ══════════════════════════════════════════════════════════
   剧情内容 · 苏清颜（高冷学霸 · 钢琴 · 慢热）
   序章(放学后听见琴声)→初识→靠近→心动(压力)→误会("为笔记")→告白
   ══════════════════════════════════════════════════════════ */
X56StoryContent.su = {
  /* ── 序章 ── */
  c0: { type: "line", chapter: "序章", loc: "musicroom", speaker: "narrator", emoji: "🎹",
    text: "开学第一周的傍晚，你路过音乐教室，听见里面有人弹琴。曲子很安静，你在门口停住了脚步。",
    next: "c0a" },
  c0a: { type: "line", loc: "musicroom", emoji: "🎹",
    text: "（琴声忽然停了，门里的人没有回头）……放学后这里是我练琴的时间。你有什么事？",
    next: "c0b" },
  c0b: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
    text: "她侧过脸，表情很淡。",
    choices: [
      { label: "弹得很好听，我没有打扰你吧。", eff: 2, flags: { listen: 1 }, next: "c0c" },
      { label: "我来找乐谱，不好意思。", eff: 1, next: "c0c" },
      { label: "（安静靠在门边不出声）", eff: 1, next: "c0c" }
    ] },
  c0c: { type: "line", loc: "musicroom", emoji: "🎹",
    text: "（她合上琴盖，顿了一下）……你要是想听，可以，但请不要出声。", next: "c1" },

  /* ── 第一章 ── */
  c1: { type: "line", chapter: "第一章 · 初识", loc: "classroom", speaker: "narrator", emoji: "🍂",
    text: "你慢慢知道了她的名字——苏清颜，年级第一，话很少，朋友也不多。她的时间几乎都在图书馆和音乐教室。",
    next: "m1" },
  m1: { type: "map", loc: "classroom",
    text: "【自由活动】去哪里？",
    guide: "她常去图书馆自习、在音乐教室练琴，偶尔才去食堂。",
    cells: [
      { loc: "library", target: "l1_library", rec: true },
      { loc: "musicroom", target: "l1_music", rec: true },
      { loc: "classroom", target: "l1_class" },
      { loc: "canteen", target: "l1_canteen" },
      { loc: "garden", target: "l1_garden" },
      { loc: "rooftop", target: "l1_roof" }
    ] },
  l1_library: { type: "line", loc: "library", speaker: "narrator", emoji: "📚",
    text: "图书馆靠窗的位置，她面前摊着三本书，写得很专注。", next: "l1_library_a" },
  l1_library_a: { type: "line", loc: "library", emoji: "🤫",
    text: "（她抬眼，又低下去）这里的位置是固定的。你要自习，可以坐对面。", next: "l1_library_b" },
  l1_library_b: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
    text: "她把对面的椅子轻轻推出来一点。",
    choices: [
      { label: "（安静坐下自习，不打扰她）", eff: 2, flags: { study: 1 }, next: "l1_library2" },
      { label: "这道题你能讲一下吗？", eff: 1, next: "l1_library3" }
    ] },
  l1_library2: { type: "line", loc: "library", emoji: "📖",
    text: "（很久之后，她小声）你自习很安静……不吵。", next: "m1b" },
  l1_library3: { type: "line", loc: "library", emoji: "🎹",
    text: "（她拿出一张纸，三两步写清思路）这样看，明白了吗？", next: "m1b" },

  l1_music: { type: "line", loc: "musicroom", emoji: "🎵",
    text: "她在弹琴，发现你来了，没有停，只是把最后一段弹完。", next: "l1_music_a" },
  l1_music_a: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
    text: "最后一个音落下去，教室里很安静。",
    choices: [
      { label: "这首曲子叫什么？", eff: 1, next: "l1_music2" },
      { label: "（轻轻鼓掌）很厉害。", eff: 2, flags: { listen: 1 }, next: "l1_music3" }
    ] },
  l1_music2: { type: "line", loc: "musicroom", emoji: "🎹",
    text: "《月光》。（她顿了一下）……你居然真的在听。", next: "m1b" },
  l1_music3: { type: "line", loc: "musicroom", emoji: "🎹",
    text: "（她别过脸）不用鼓掌，弹给空教室和弹给你，都一样。", next: "m1b" },

  l1_class: { type: "line", loc: "classroom", emoji: "📝",
    text: "课间她被同学围住问题，一个一个耐心地讲。", next: "l1_class_a" },
  l1_class_a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
    text: "她讲完才看到你。",
    choices: [
      { label: "（等她忙完，递给她一杯水）", eff: 2, flags: { water: 1 }, next: "l1_class2" },
      { label: "你很会教别人。", eff: 1, next: "l1_class2" }
    ] },
  l1_class2: { type: "line", loc: "classroom", emoji: "😳",
    text: "（她接过水，小声）……谢谢。讲了一整节课，确实渴了。", next: "m1b" },

  l1_canteen: { type: "line", loc: "canteen", emoji: "🍱",
    text: "她来得很晚，窗口快没什么菜了，只打了一个素菜。", next: "l1_canteen_a" },
  l1_canteen_a: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
    text: "她一个人坐得很安静。",
    choices: [
      { label: "（把自己餐盘里的菜分她一半）", eff: 2, flags: { share: 1 }, next: "l1_canteen2" },
      { label: "你怎么吃这么少？", eff: 1, next: "l1_canteen3" }
    ] },
  l1_canteen2: { type: "line", loc: "canteen", emoji: "😳",
    text: "（她愣住）……你不用让我，我够吃。（但她没有把菜推回来）", next: "m1b" },
  l1_canteen3: { type: "line", loc: "canteen", emoji: "🎹",
    text: "刷题忘了时间，不饿。（她说得很平静）", next: "m1b" },

  l1_garden: { type: "line", loc: "garden", emoji: "🌿",
    text: "她难得在小径上慢慢走，像是在放空。", next: "l1_garden_a" },
  l1_garden_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
    text: "她看见你，停下脚步。",
    choices: [
      { label: "陪你走一会儿。", eff: 1, next: "l1_garden2" }
    ] },
  l1_garden2: { type: "line", loc: "garden", emoji: "🌿",
    text: "（她和你并肩，难得地没说话，只是走得很慢）", next: "m1b" },

  l1_roof: { type: "line", loc: "rooftop", emoji: "🌇",
    text: "天台上风很大，她一个人站在栏杆边，难得地没在看书。", next: "l1_roof_a" },
  l1_roof_a: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
    text: "风吹乱了她的头发。",
    choices: [
      { label: "（站到她旁边，不说话）", eff: 1, next: "l1_roof2" }
    ] },
  l1_roof2: { type: "line", loc: "rooftop", emoji: "🎹",
    text: "（很久，她轻声）……这里，是我少数能不看分数的地方。", next: "m1b" },

  m1b: { type: "map", loc: "classroom",
    text: "【自由活动】她开始习惯你在旁边。",
    guide: "再去看看她；想推进剧情，去教学楼（推荐）。",
    cells: [
      { loc: "library", target: "l1_library_a" },
      { loc: "musicroom", target: "l1_music" },
      { loc: "canteen", target: "l1_canteen" },
      { loc: "classroom", target: "c2", rec: true }
    ] },

  /* ── 第二章：靠近 ── */
  c2: { type: "line", chapter: "第二章 · 靠近", loc: "library", speaker: "narrator", emoji: "📖",
    text: "两周后，她会默认把对面的位置留给你，会在你题解错时写一张纸条，也会在你睡着时把外套轻轻搭过来。",
    next: "c2a" },
  c2a: { type: "line", loc: "library", emoji: "😳",
    text: "（她把一份整理好的笔记推给你）你上次问的那类题，我整理了。……不用谢。", next: "c2b" },
  c2b: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
    text: "她的笔记写得极其认真。",
    choices: [
      { label: "那我每天给你带早餐，算报酬。", eff: 2, flags: { breakfast: 1 }, next: "c2c" },
      { label: "（认真收好）这是我收过最好的笔记。", eff: 1, next: "c2c" },
      { label: "我给你弹一首？不，我请你听一首。", eff: 1, next: "c2c" }
    ] },
  c2c: { type: "line", loc: "library", emoji: "🎹",
    text: "（她的耳尖红了，还装作翻书）……随你。", next: "m2" },

  m2: { type: "map", loc: "classroom",
    text: "【日常相处】她把不多的时间，分了你一些。",
    guide: "一起做的事会影响她对你的感觉。她不太会表达，但你在她心里不一样了。",
    cells: [
      { loc: "library", target: "l2_study", rec: true },
      { loc: "musicroom", target: "l2_music" },
      { loc: "canteen", target: "l2_eat" },
      { loc: "garden", target: "l2_walk" },
      { loc: "classroom", target: "c3", rec: true }
    ] },
  l2_study: { type: "line", loc: "library", emoji: "📚",
    text: "（她把一套卷子推给你）限时，和我一起做。做完互改。", next: "l2_study_a" },
  l2_study_a: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
    text: "她已经提笔，表情认真。",
    choices: [
      { label: "（认真做完，先交给她改）", eff: 2, flags: { score: 1 }, next: "l2_study2" },
      { label: "比不过你，能不能放水？", eff: 1, next: "l2_study3" }
    ] },
  l2_study2: { type: "line", loc: "library", emoji: "😳",
    text: "（她改完，难得弯了下嘴角）进步了……不错。", next: "m2b" },
  l2_study3: { type: "line", loc: "library", emoji: "🎹",
    text: "不能。（她顿了一下）但我可以，多给你讲一遍。", next: "m2b" },

  l2_music: { type: "line", loc: "musicroom", emoji: "🎵",
    text: "（她弹完一曲，停下来）你想听什么？点一首。", next: "l2_music_a" },
  l2_music_a: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
    text: "她的手放在琴键上等你。",
    choices: [
      { label: "弹你最喜欢的那首。", eff: 2, flags: { fav: 1 }, next: "l2_music2" },
      { label: "弹一首开心点的。", eff: 1, next: "l2_music3" }
    ] },
  l2_music2: { type: "line", loc: "musicroom", emoji: "😳",
    text: "（她弹了一首很轻的曲子，没有说话）……这首，我很少弹给别人听。", next: "m2b" },
  l2_music3: { type: "line", loc: "musicroom", emoji: "🎹",
    text: "（她想了想，弹了一段轻快的旋律）……这样？", next: "m2b" },

  l2_eat: { type: "line", loc: "canteen", emoji: "🥛",
    text: "（你把早餐热牛奶放在她面前，她愣了一下）", next: "l2_eat_a" },
  l2_eat_a: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
    text: "她总是忘记吃饭。",
    choices: [
      { label: "先喝完再刷题，我看着你。", eff: 2, flags: { feed: 1 }, next: "l2_eat2" },
      { label: "你再不吃，我每天都来。", eff: 2, flags: { promise: 1 }, next: "l2_eat2" }
    ] },
  l2_eat2: { type: "line", loc: "canteen", emoji: "😳",
    text: "（她捧着牛奶，小声）……你不用做到这个地步。（但她喝完了）", next: "m2b" },

  l2_walk: { type: "line", loc: "garden", emoji: "🌳",
    text: "（她难得主动开口）你……觉得我是不是很无趣？除了学习就是弹琴。", next: "l2_walk_a" },
  l2_walk_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
    text: "她停下脚步看你。",
    choices: [
      { label: "不无趣。你只是把事都放在心里。", eff: 2, flags: { know: 1 }, next: "l2_walk2" },
      { label: "那我以后多带你出来走走。", eff: 2, flags: { promise: 1 }, next: "l2_walk2" }
    ] },
  l2_walk2: { type: "line", loc: "garden", emoji: "😳",
    text: "（她低下头，声音很轻）……那说好了。", next: "m2b" },

  m2b: { type: "map", loc: "classroom",
    text: "【日常相处】她话不多，但每一句都认真。",
    guide: "想继续故事，去教学楼（推荐）。",
    cells: [
      { loc: "library", target: "l2_study" },
      { loc: "musicroom", target: "l2_music" },
      { loc: "garden", target: "l2_walk" },
      { loc: "classroom", target: "c3", rec: true }
    ] },

  /* ── 第三章：心动（压力） ── */
  c3: { type: "line", chapter: "第三章 · 心动", loc: "musicroom", speaker: "narrator", emoji: "📖",
    text: "期中考试前，她压力很大，琴谱翻得很乱，人也瘦了。她习惯了把所有事都自己扛。",
    next: "c3a" },
  c3a: { type: "line", loc: "musicroom", emoji: "🎹",
    text: "（她的手指在琴键上停住，声音有点哑）……这次如果不是第一，会让很多人失望。", next: "c3b" },
  c3b: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
    text: "她的指尖发凉，肩膀绷得很紧。",
    choices: [
      { label: "先别弹了，我陪你休息一会儿。", eff: 3, flags: { care: 1 }, next: "c3_care" },
      { label: "你不是机器，你已经很好了。", eff: 2, flags: { word: 1 }, next: "c3_word" },
      { label: "（默默把热牛奶放到她手边）", eff: 3, flags: { milk: 1 }, next: "c3_milk" }
    ] },
  c3_care: { type: "line", loc: "musicroom", emoji: "😳",
    text: "（她没有动，过了一会儿，轻轻靠在琴上）……已经很久，没人让我停下来了。", next: "c3_end" },
  c3_word: { type: "line", loc: "musicroom", emoji: "🎹",
    text: "（她垂下眼）我知道……可我停不下来。（但她的手，慢慢松开了）", next: "c3_end" },
  c3_milk: { type: "line", loc: "musicroom", emoji: "😳",
    text: "（她看着那杯牛奶，很久，小声）……你怎么知道，我没吃晚饭。", next: "c3_end" },
  c3_end: { type: "line", loc: "musicroom", speaker: "narrator", emoji: "💗",
    text: "那天她重新弹了一首曲子，很轻，很慢。她没有说那是弹给谁听的，但她一直知道答案。",
    next: "c4" },

  /* ── 第四章：误会（"为笔记"） ── */
  c4: { type: "line", chapter: "第四章 · 在意", loc: "classroom", speaker: "narrator", emoji: "🚪",
    text: "几天后，她在走廊听见有人议论：“XX 跟苏清颜走那么近，还不是为了抄年级第一的笔记。”",
    next: "c4a" },
  c4a: { type: "line", loc: "classroom", emoji: "🎹",
    text: "（她的表情淡了下去，第二天，你在图书馆没等到她，只收到一张纸条）", next: "c4b" },
  c4b: { type: "line", loc: "library", emoji: "📝",
    text: "纸条上写：“以后不必特意来找我。笔记我可以整理给你，别浪费你的时间。”", next: "c4c" },
  c4c: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
    text: "她把你推远了。",
    choices: [
      { label: "（跑到音乐教室找她）我不是为了笔记。", eff: 2, flags: { clear: 1 }, next: "c4d" },
      { label: "（在纸条背面写：你为什么这样想）", eff: 1, next: "c4d" }
    ] },
  c4d: { type: "line", loc: "musicroom", emoji: "🎹",
    text: "（她背对着你，声音很轻）……那是为了什么？", next: "c4e" },
  c4e: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
    text: "她在等你，琴声没有再响。",
    choices: [
      { label: "为了听你弹琴，为了……你。", eff: 2, flags: { love: 1 }, next: "c4f" },
      { label: "我喜欢和你待在一起，跟分数无关。", eff: 2, flags: { love: 1 }, next: "c4f" }
    ] },
  c4f: { type: "line", loc: "musicroom", emoji: "😳",
    text: "（她沉默了很久，转过身，眼眶有点红）……我不太会处理这些。但我，相信你。", next: "c5" },

  /* ── 第五章：告白（音乐教室） ── */
  c5: { type: "line", chapter: "第五章 · 琴声里的告白", loc: "musicroom", speaker: "narrator", emoji: "🌆",
    text: "期中考试结束的傍晚，她在音乐教室等你，弹了一首她练了很久、还没有名字的曲子。",
    next: "c5a" },
  c5a: { type: "line", loc: "musicroom", emoji: "🎹",
    text: "（最后一个音落下，她没有回头）……这首，是我为你练的。还没有名字。", next: "c5b" },
  c5b: { type: "choice", loc: "musicroom", speaker: "me", emoji: "🧑",
    text: "夕阳落在琴键上，她的侧脸很安静。",
    choices: [
      { label: "就叫它《清颜》吧。我喜欢你。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
      { label: "（坐到她身边）以后我陪你一起弹。", eff: 2, flags: { together: 1 }, next: "c5_judge" },
      { label: "你是我很敬重的朋友。", flags: { friend: 1 }, next: "c5_judge" }
    ] },
  c5_judge: { type: "router",
    route: function (s) {
      if (s.flags.friend) return "end_friend";
      if (s.affinity >= 7) return "end_sweet";
      if (s.affinity >= 4) return "end_normal";
      return "end_miss";
    } },

  end_sweet: { type: "end", emoji: "🎹",
    title: "结局 · 琴声里的告白",
    text: "她的眼泪落在琴键上，却笑了。“我话很少……但这首曲子，以后只弹给你听。” 琴声没有停，像她终于说出口的、藏了很久的心事。" },
  end_normal: { type: "end", emoji: "🌤️",
    title: "结局 · 未完成的曲子",
    text: "她看着琴键，轻声说：“这首曲子，让我再练一段时间……好吗？” 有些慢热的心动，需要更长的节拍。" },
  end_friend: { type: "end", emoji: "🤝",
    title: "结局 · 琴声如故",
    text: "她顿了一下，轻轻点头。“朋友……也好。琴声不会变。” 有些情谊，安静而长久。" },
  end_miss: { type: "end", emoji: "🍂",
    title: "结局 · 休止符",
    text: "她合上琴盖，声音很轻。“……到这里吧。” 琴声在空教室里停了，像一个没有说完的句子。" }
};

/* ══════════════════════════════════════════════════════════
   剧情内容 · 许念（体育少女 · 短发飒爽 · 兄弟→恋人）
   序章(球场捡球)→初识→靠近→心动(篮球赛)→误会("像男生")→告白
   ══════════════════════════════════════════════════════════ */
X56StoryContent.xu = {
  /* ── 序章 ── */
  c0: { type: "line", chapter: "序章", loc: "playground", speaker: "narrator", emoji: "🏀",
    text: "放学后的篮球场，一个球滚到你脚边。你刚转学来，还不太熟悉这里。一个短头发的女生朝你跑过来。",
    next: "c0a" },
  c0a: { type: "line", loc: "playground", emoji: "😅",
    text: "嘿——那个同学，把球扔过来！（她额头上全是汗，笑得很亮）", next: "c0b" },
  c0b: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
    text: "她在等你传球。",
    choices: [
      { label: "（稳稳把球传回去）", eff: 2, flags: { pass: 1 }, next: "c0c" },
      { label: "你打得真好。", eff: 1, next: "c0c" },
      { label: "我也想打，缺人吗？", eff: 2, flags: { play: 1 }, next: "c0c_play" }
    ] },
  c0c: { type: "line", loc: "playground", emoji: "😏",
    text: "（她接住球，眼睛一亮）传得不错！我叫许念，高二（5）班，常来球场。", next: "c1" },
  c0c_play: { type: "line", loc: "playground", emoji: "🏀",
    text: "缺啊！（她拍着球笑）来，正好三打三，输了请喝水。", next: "c1" },

  /* ── 第一章 ── */
  c1: { type: "line", chapter: "第一章 · 初识", loc: "playground", speaker: "narrator", emoji: "🍂",
    text: "第一周，许念像个大兄弟一样带你熟悉学校。她风风火火，认识的人多，却总在球场等你。",
    next: "m1" },
  m1: { type: "map", loc: "classroom",
    text: "【自由活动】去哪里找她？",
    guide: "她基本都在操场练球，饿了去食堂，偶尔会溜去天台和花园乘凉。",
    cells: [
      { loc: "playground", target: "l1_play", rec: true },
      { loc: "canteen", target: "l1_canteen", rec: true },
      { loc: "classroom", target: "l1_class" },
      { loc: "gate", target: "l1_gate" },
      { loc: "garden", target: "l1_garden" },
      { loc: "rooftop", target: "l1_roof" }
    ] },
  l1_play: { type: "line", loc: "playground", emoji: "🏀",
    text: "（她在练投篮，看到你，把球往你怀里一抛）来，接十个，我看看你手感。", next: "l1_play_a" },
  l1_play_a: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
    text: "球在你手里转。",
    choices: [
      { label: "（认真投，进了好几个）", eff: 2, flags: { shoot: 1 }, next: "l1_play2" },
      { label: "教我正确的姿势吧。", eff: 1, next: "l1_play3" }
    ] },
  l1_play2: { type: "line", loc: "playground", emoji: "😏",
    text: "（她吹了声口哨）行啊，以后跟我混，我罩你。", next: "m1b" },
  l1_play3: { type: "line", loc: "playground", emoji: "🏀",
    text: "（她站到你身后，扶着你的手肘）沉肩，压腕，出手……对，就这样。", next: "m1b" },

  l1_canteen: { type: "line", loc: "canteen", emoji: "🍱",
    text: "她餐盘里堆得冒尖，看到你就把另一双筷子递过来。", next: "l1_canteen_a" },
  l1_canteen_a: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
    text: "她吃得很香。",
    choices: [
      { label: "你练球这么能吃？", eff: 1, next: "l1_canteen2" },
      { label: "（把自己的鸡腿夹给她）", eff: 2, flags: { feed: 1 }, next: "l1_canteen3" }
    ] },
  l1_canteen2: { type: "line", loc: "canteen", emoji: "😏",
    text: "那当然，体力活，吃少了跑不动。", next: "m1b" },
  l1_canteen3: { type: "line", loc: "canteen", emoji: "😳",
    text: "（她愣了一下）……你自己吃，我够。（但她没夹回去）", next: "m1b" },

  l1_class: { type: "line", loc: "classroom", emoji: "📝",
    text: "她课间溜到你们班门口，冲你招手。", next: "l1_class_a" },
  l1_class_a: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
    text: "她好像有什么事。",
    choices: [
      { label: "（走出去）怎么了？", eff: 1, next: "l1_class2" }
    ] },
  l1_class2: { type: "line", loc: "classroom", emoji: "🏀",
    text: "（她把一瓶水塞给你）看你一上午没喝水，拿着。……我还要练球，走了。", next: "m1b" },

  l1_gate: { type: "line", loc: "gate", emoji: "🚲",
    text: "放学她推着一辆自行车，单脚撑地等你。", next: "l1_gate_a" },
  l1_gate_a: { type: "choice", loc: "gate", speaker: "me", emoji: "🧑",
    text: "她拍了拍后座。",
    choices: [
      { label: "你顺路带我一段？", eff: 1, flags: { ride: 1 }, next: "l1_gate2" },
      { label: "我陪你走回家。", eff: 2, flags: { walk: 1 }, next: "l1_gate3" }
    ] },
  l1_gate2: { type: "line", loc: "gate", emoji: "😏",
    text: "（她骑着车，笑声在前面）坐稳了，我可不等你。", next: "m1b" },
  l1_gate3: { type: "line", loc: "gate", emoji: "🏀",
    text: "（她推着车，和你并排走，难得安静）……这条路，挺好。", next: "m1b" },

  l1_garden: { type: "line", loc: "garden", emoji: "🌿",
    text: "她坐在小径的长椅上，把一只小猫抱在怀里。", next: "l1_garden_a" },
  l1_garden_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
    text: "她的动作轻得不像平时。",
    choices: [
      { label: "你还会养猫？", eff: 2, flags: { cat: 1 }, next: "l1_garden2" },
      { label: "（蹲下来一起摸小猫）", eff: 1, next: "l1_garden2" }
    ] },
  l1_garden2: { type: "line", loc: "garden", emoji: "😳",
    text: "（她小声）它总在学校门口流浪，我每天带点吃的。……这事我没跟别人说。", next: "m1b" },

  l1_roof: { type: "line", loc: "rooftop", emoji: "🌇",
    text: "她躺在天台的地上，双手枕在脑后，看天。", next: "l1_roof_a" },
  l1_roof_a: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
    text: "她看到你，往旁边挪了挪。",
    choices: [
      { label: "（躺到她旁边）在想什么？", eff: 1, next: "l1_roof2" }
    ] },
  l1_roof2: { type: "line", loc: "rooftop", emoji: "🏀",
    text: "在想……赢了决赛之后，要干什么。（她顿了一下）也许，会想告诉你点什么。", next: "m1b" },

  m1b: { type: "map", loc: "classroom",
    text: "【自由活动】你渐渐离不开她的热闹。",
    guide: "再去找她；想推进剧情，去教学楼（推荐）。",
    cells: [
      { loc: "playground", target: "l1_play" },
      { loc: "canteen", target: "l1_canteen" },
      { loc: "garden", target: "l1_garden" },
      { loc: "classroom", target: "c2", rec: true }
    ] },

  /* ── 第二章：靠近 ── */
  c2: { type: "line", chapter: "第二章 · 靠近", loc: "playground", speaker: "narrator", emoji: "🌤️",
    text: "两周后，你们成了最好的搭档。她带你打球、给你占座、把你水壶灌满，也开始在你面前露出不像“兄弟”的样子。",
    next: "c2a" },
  c2a: { type: "line", loc: "playground", emoji: "😏",
    text: "（她抛来一条毛巾，别过脸）看你打得满头汗，擦擦。……不是特意给你买的，顺手。", next: "c2b" },
  c2b: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
    text: "毛巾是新的。",
    choices: [
      { label: "那我会一直留着。", eff: 2, flags: { keep: 1 }, next: "c2c" },
      { label: "你对我最好了。", eff: 2, flags: { tease: 1 }, next: "c2c" },
      { label: "谢啦，兄弟。", eff: 0, next: "c2c_b" }
    ] },
  c2c: { type: "line", loc: "playground", emoji: "😳",
    text: "（她的耳朵红了，声音低下去）……谁、谁是你兄弟。", next: "m2" },
  c2c_b: { type: "line", loc: "playground", emoji: "🍃",
    text: "（她愣了一下，随即咧嘴笑）嗯，兄弟！", next: "m2" },

  m2: { type: "map", loc: "classroom",
    text: "【日常相处】你想和她一起做点什么？",
    guide: "她最吃“认真陪伴”这一套，也很在意你有没有看到她温柔的一面。",
    cells: [
      { loc: "playground", target: "l2_play", rec: true },
      { loc: "canteen", target: "l2_eat" },
      { loc: "garden", target: "l2_cat" },
      { loc: "rooftop", target: "l2_roof" },
      { loc: "classroom", target: "c3", rec: true }
    ] },
  l2_play: { type: "line", loc: "playground", emoji: "🏀",
    text: "（她站在罚球线上）我教你投篮，投进十个，奖励你一个愿望。", next: "l2_play_a" },
  l2_play_a: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
    text: "她在旁边数着，很认真。",
    choices: [
      { label: "（认真投完）我的愿望是……", eff: 2, flags: { wish: 1 }, next: "l2_play2" },
      { label: "投不进，你帮我？", eff: 1, next: "l2_play3" }
    ] },
  l2_play2: { type: "line", loc: "playground", emoji: "😳",
    text: "（她抱臂，眼睛却看着你）……什么愿望？先说好，别太过分。", next: "m2b" },
  l2_play3: { type: "line", loc: "playground", emoji: "🏀",
    text: "（她走到你身后，扶着你的手腕，声音轻了）……这样出手。", next: "m2b" },

  l2_eat: { type: "line", loc: "canteen", emoji: "🍜",
    text: "（她把餐盘端过来，和你坐一起）今天我请，上次你给我鸡腿。", next: "l2_eat_a" },
  l2_eat_a: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
    text: "她把自己盘里的肉分了你一半。",
    choices: [
      { label: "（认真看她）你其实很细心。", eff: 2, flags: { notice: 1 }, next: "l2_eat2" },
      { label: "那我们以后天天一起吃。", eff: 2, flags: { promise: 1 }, next: "l2_eat2" }
    ] },
  l2_eat2: { type: "line", loc: "canteen", emoji: "😳",
    text: "（她呛了一下，咳两声）……你今天怎么老说怪话。", next: "m2b" },

  l2_cat: { type: "line", loc: "garden", emoji: "🐱",
    text: "（她和你一起喂那只小猫，小猫蹭她的手）", next: "l2_cat_a" },
  l2_cat_a: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
    text: "她的侧脸很柔和。",
    choices: [
      { label: "你对它好，它一定记得。", eff: 1, next: "l2_cat2" },
      { label: "我也想当那只猫。", eff: 2, flags: { tease: 1 }, next: "l2_cat3" }
    ] },
  l2_cat2: { type: "line", loc: "garden", emoji: "😳",
    text: "（她小声）……对它好的人，我也会记得。", next: "m2b" },
  l2_cat3: { type: "line", loc: "garden", emoji: "😳",
    text: "（她的脸一下子红了，手却没停）……你少贫。", next: "m2b" },

  l2_roof: { type: "line", loc: "rooftop", emoji: "🌇",
    text: "（她坐在天台边，难得地没笑）决赛那天，我其实有点紧张。", next: "l2_roof_a" },
  l2_roof_a: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
    text: "她很少这样认真。",
    choices: [
      { label: "我一定去看，坐第一排。", eff: 2, flags: { promise: 1 }, next: "l2_roof2" },
      { label: "你是最棒的，我信你。", eff: 1, next: "l2_roof2" }
    ] },
  l2_roof2: { type: "line", loc: "rooftop", emoji: "😳",
    text: "（她看着你，轻轻点头）……有你在，我就不怕了。", next: "m2b" },

  m2b: { type: "map", loc: "classroom",
    text: "【日常相处】她把你当成了最特别的人。",
    guide: "想继续故事，去教学楼（推荐）。",
    cells: [
      { loc: "playground", target: "l2_play" },
      { loc: "garden", target: "l2_cat" },
      { loc: "rooftop", target: "l2_roof" },
      { loc: "classroom", target: "c3", rec: true }
    ] },

  /* ── 第三章：心动（篮球赛） ── */
  c3: { type: "line", chapter: "第三章 · 心动", loc: "playground", speaker: "narrator", emoji: "🏀",
    text: "校级篮球赛决赛来了。看台上坐满了人，许念是队长。你如约坐在第一排。",
    next: "c3a" },
  c3a: { type: "line", loc: "playground", speaker: "narrator", emoji: "🥅",
    text: "比赛最后一分钟，她被对方犯规，整个人摔倒在地，膝盖擦破了。她爬起来，走向罚球线。", next: "c3b" },
  c3b: { type: "line", loc: "playground", emoji: "😤",
    text: "（她抬头，在人群里找到你，然后两罚全中——绝杀！哨声响起）", next: "c3c" },
  c3c: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
    text: "她浑身是汗，被队友围着，却第一个朝你走来。",
    choices: [
      { label: "（递水和毛巾）刚才那个球，全场最帅。", eff: 3, flags: { cheer: 1 }, next: "c3_win" },
      { label: "你膝盖流血了，我带你去医务室。", eff: 3, flags: { clinic: 1 }, next: "c3_hurt" },
      { label: "打得不错。", eff: 1, next: "c3_win" }
    ] },
  c3_win: { type: "line", loc: "playground", emoji: "😅",
    text: "（她笑得灿烂，小声）最后一球，我是想着你在看，才敢投的。", next: "c3_end" },
  c3_hurt: { type: "line", loc: "clinic", emoji: "😳",
    text: "（她坐在医务室，龇牙咧嘴）小伤……你这么紧张，我还怪不好意思的。", next: "c3_end" },
  c3_end: { type: "line", loc: "playground", speaker: "narrator", emoji: "💗",
    text: "她举着奖杯，被队友抛起来。可她落地后第一眼，还是看向你。有些东西，早就不一样了。",
    next: "c4" },

  /* ── 第四章：误会（"像男生"） ── */
  c4: { type: "line", chapter: "第四章 · 在意", loc: "classroom", speaker: "narrator", emoji: "🚪",
    text: "几天后，许念来找你，在走廊听见同学起哄：“你不会喜欢许念吧？她跟个男的似的。”",
    next: "c4a" },
  c4a: { type: "line", loc: "classroom", emoji: "😅",
    text: "（她停在原地，看见你笑了一下，没有立刻反驳，手却悄悄攥紧了水瓶）", next: "c4b" },
  c4b: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
    text: "她的表情，第一次没有那么满不在乎。",
    choices: [
      { label: "（认真地）我觉得你很好，谁都比不上。", eff: 2, flags: { clear: 1 }, next: "c4c" },
      { label: "（开玩笑）哪有，你是我兄弟啊。", eff: 0, flags: { brother: 1 }, next: "c4_late" }
    ] },
  c4c: { type: "line", loc: "classroom", emoji: "😳",
    text: "（她抬起头，声音很轻）你真的……不觉得我像男生吗？", next: "c4d" },
  c4d: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
    text: "她在等你一个认真的答案。",
    choices: [
      { label: "我觉得你是许念，独一无二。", eff: 2, next: "c4e" },
      { label: "飒和温柔，你都有。", eff: 1, next: "c4e" }
    ] },
  c4e: { type: "line", loc: "classroom", emoji: "😳",
    text: "（她的耳尖红了，别过脸）……你少说这种话，我、我不会接。", next: "c5" },
  c4_late: { type: "line", loc: "classroom", emoji: "🍃",
    text: "哟，兄弟。（她笑得很淡，转身走了）……我去练球。", next: "c4_late_a" },
  c4_late_a: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
    text: "她一个人在球场投篮，没有平时的力气。",
    choices: [
      { label: "（跑过去，认真地）我不该说兄弟，我喜欢你。", eff: 2, flags: { clear: 1 }, next: "c4_late2" },
      { label: "你真的是我很重要的朋友。", flags: { friend: 1 }, next: "c4_late3" }
    ] },
  c4_late2: { type: "line", loc: "playground", emoji: "😳",
    text: "（她手里的球滚了出去，声音发抖）……你，认真的？", next: "c5" },
  c4_late3: { type: "line", loc: "playground", emoji: "🏀",
    text: "（她沉默了两秒，捡起球，笑了）……嗯，最好的朋友。", next: "c5" },

  /* ── 第五章：告白（球场） ── */
  c5: { type: "line", chapter: "第五章 · 终场哨响", loc: "playground", speaker: "narrator", emoji: "🌆",
    text: "傍晚，她把你一个人叫到球场。夕阳把篮筐的影子拉得很长。", next: "c5a" },
  c5a: { type: "line", loc: "playground", emoji: "🏀",
    text: "（她拍着球，不像平时那样笑）我有话问你，你老实回答。", next: "c5b" },
  c5b: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
    text: "她停下球，看着你。",
    choices: [
      { label: "我先说，许念，我喜欢你。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
      { label: "（拿过她的球）我想做你最特别的那个人。", eff: 2, flags: { together: 1 }, next: "c5_judge" },
      { label: "我们一直做兄弟，就好。", flags: { friend: 1 }, next: "c5_judge" }
    ] },
  c5_judge: { type: "router",
    route: function (s) {
      if (s.flags.friend) return "end_friend";
      if (s.affinity >= 7) return "end_sweet";
      if (s.affinity >= 4) return "end_normal";
      return "end_miss";
    } },

  end_sweet: { type: "end", emoji: "🏀",
    title: "结局 · 终场哨响",
    text: "她愣了两秒，然后冲过来抱住你，又很快松开，脸红得像赢了比赛。“……你早说嘛！” 后来的每一场球，她都为你留第一排；每一次赢，都第一个奔向你。" },
  end_normal: { type: "end", emoji: "🌤️",
    title: "结局 · 加时赛",
    text: "她挠了挠头，笑了。“让我……想几天？这种事，我比罚球还紧张。” 加时赛还没结束，答案也许就在下一个回合。" },
  end_friend: { type: "end", emoji: "🤝",
    title: "结局 · 最佳队友",
    text: "她愣了一下，随即用力拍你肩膀，笑得很亮。“行，最佳队友，一辈子！” 有些情谊，像球场上的信任，长久又牢靠。" },
  end_miss: { type: "end", emoji: "🍂",
    title: "结局 · 球场上的风",
    text: "她抱着球，低下头，声音很轻。“……我们还是做兄弟吧。” 那天的风很大，吹得篮筐轻轻晃。青春里，总有些话没能投进。" }
};

/* ══════════════════════════════════════════════════════════
   模块十一：5.6 核心系统大升级（校园中心）
   · 每日签到 · 每日任务 · 志向（心之所向）
   · 成就墙 · 技能面板 · 校园人物志 · 天气
   · 持久化 + 每日刷新 + 实时进度
   ══════════════════════════════════════════════════════════ */
var X56Core = {
  KEY: "xz56_core_v1",
  data: null,
  defaultData: function () {
    return {
      sign: { last: "", streak: 0, total: 0, claimed: false },
      day: -1,
      tasks: [],
      aspiration: null,
      achievements: {},
      contactLv: {},
      hints: 0
    };
  },
  load: function () {
    if (this.data) return this.data;
    try {
      var raw = storageGet(this.KEY);
      if (raw) this.data = JSON.parse(raw);
      else this.data = this.defaultData();
    } catch (e) { this.data = this.defaultData(); }
    return this.data;
  },
  save: function () {
    try { storageSet(this.KEY, JSON.stringify(this.data)); } catch (e) {}
  },

  /* ── 志向（6 个） ── */
  aspirations: [
    { id: "scholar", name: "学霸之路", icon: "📚", color: "#42d392",
      desc: "心之所向是知识与远方。目标：考上理想大学。",
      tasks: ["study2", "study4", "noSkip", "read2"],
      stat: function (G) { return G.knowledge; } },
    { id: "social", name: "社交达人", icon: "🗣️", color: "#7f8cff",
      desc: "认识全校的人，成为大家都愿意搭话的存在。",
      tasks: ["chat3", "chat5", "support1", "influence1"],
      stat: function (G) { return G.support; } },
    { id: "star", name: "校园明星", icon: "🌟", color: "#ff7ab6",
      desc: "站在舞台中央，成为被注视的那一个。",
      tasks: ["charm1", "influence1", "chat3", "phone1"],
      stat: function (G) { return Math.max(G.charm, G.influence); } },
    { id: "sports", name: "运动健将", icon: "🏀", color: "#5b8cff",
      desc: "强健的身体是一切的本钱，赛场是你的主场。",
      tasks: ["exer1", "exer2", "fit1", "noPhone"],
      stat: function (G) { return G.fitness; } },
    { id: "wealth", name: "小富翁", icon: "💰", color: "#e8b94a",
      desc: "靠自己的双手赚钱，实现零花钱自由。",
      tasks: ["earn1", "spend1", "noSkip", "study2"],
      stat: function (G) { return G.money; } },
    { id: "love", name: "恋爱脑", icon: "💗", color: "#ff9ec9",
      desc: "心之所向，是那一个人。",
      tasks: ["love1", "love2", "charm1", "chat3"],
      stat: function (G) { return G.lover ? 80 : 20; } }
  ],
  aspById: function (id) {
    for (var i = 0; i < this.aspirations.length; i++)
      if (this.aspirations[i].id === id) return this.aspirations[i];
    return null;
  },

  /* ── 每日任务池（need = 目标量，get = 当前量，reward = 金钱奖励） ── */
  taskPool: {
    study2: { name: "认真学习 2 节课", need: 2, get: function (G) { return G.st.study; }, reward: 8, icon: "📘" },
    study4: { name: "认真学习 4 节课", need: 4, get: function (G) { return G.st.study; }, reward: 16, icon: "📚" },
    noSkip: { name: "今天不逃课", need: 1, get: function (G) { return G.st.skip === 0 ? 1 : 0; }, reward: 10, icon: "🚫" },
    read2: { name: "看 2 次课外书", need: 2, get: function (G) { return G.st.read; }, reward: 8, icon: "📖" },
    chat3: { name: "和同学聊天 3 次", need: 3, get: function (G) { return G.st.chat; }, reward: 8, icon: "💬" },
    chat5: { name: "和同学聊天 5 次", need: 5, get: function (G) { return G.st.chat; }, reward: 14, icon: "🗣️" },
    support1: { name: "支持度 +5", need: 5, get: function (G) { return G.support - (G._coreSupportBase || G.support); }, reward: 12, icon: "✊" },
    influence1: { name: "影响力 +5", need: 5, get: function (G) { return G.influence - (G._coreInflBase || G.influence); }, reward: 12, icon: "⭐" },
    charm1: { name: "魅力 +5", need: 5, get: function (G) { return G.charm - (G._coreCharmBase || G.charm); }, reward: 12, icon: "💫" },
    phone1: { name: "少玩手机（≤3 次）", need: 1, get: function (G) { return G.st.phone <= 3 ? 1 : 0; }, reward: 8, icon: "📱" },
    noPhone: { name: "几乎不玩手机（≤1 次）", need: 1, get: function (G) { return G.st.phone <= 1 ? 1 : 0; }, reward: 14, icon: "🔕" },
    exer1: { name: "运动 1 次", need: 1, get: function (G) { return G.st.exer; }, reward: 10, icon: "🏃" },
    exer2: { name: "运动 2 次", need: 2, get: function (G) { return G.st.exer; }, reward: 18, icon: "💪" },
    fit1: { name: "体力 +5", need: 5, get: function (G) { return G.fitness - (G._coreFitBase || G.fitness); }, reward: 12, icon: "🏀" },
    earn1: { name: "今天赚到钱", need: 1, get: function (G) { return G.money > (G._coreMoneyBase || G.money) ? 1 : 0; }, reward: 6, icon: "💵" },
    spend1: { name: "理性消费（购物 1 次）", need: 1, get: function (G) { return G.st.shopSpend >= 1 ? 1 : 0; }, reward: 6, icon: "🛒" },
    love1: { name: "恋爱互动 1 次", need: 1, get: function (G) { return G.st.love; }, reward: 12, icon: "💗" },
    love2: { name: "恋爱互动 2 次", need: 2, get: function (G) { return G.st.love; }, reward: 20, icon: "❤️" }
  },

  /* 生成当日任务（每天 3 个） */
  rollTasks: function (G) {
    var d = this.load();
    var asp = this.aspById(d.aspiration);
    var pool = asp ? asp.tasks.slice() : ["study2", "chat3", "exer1"];
    /* 打乱并取 3 个 */
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    pool = pool.slice(0, 3);
    /* 若不足 3 个补通用 */
    var generic = ["study2", "chat3", "exer1"];
    var gi = 0;
    while (pool.length < 3) { if (pool.indexOf(generic[gi]) < 0) pool.push(generic[gi]); gi++; }
    d.tasks = pool.map(function (id) {
      return { id: id, done: false, claimed: false, prog: 0 };
    });
    /* 记录当日基线（用于“属性 +X”类任务） */
    G._coreSupportBase = G.support;
    G._coreInflBase = G.influence;
    G._coreCharmBase = G.charm;
    G._coreFitBase = G.fitness;
    G._coreMoneyBase = G.money;
    d.day = G.day;
    this.save();
  },

  /* 实时刷新任务进度（轮询） */
  refreshTasks: function () {
    var G = window.G;
    if (!G) return;
    var d = this.load();
    if (d.day !== G.day) this.rollTasks(G);
    var changed = false;
    d.tasks.forEach(function (t) {
      var def = X56Core.taskPool[t.id];
      if (!def || t.done) return;
      var cur = 0;
      try { cur = def.get(G); } catch (e) {}
      cur = Math.max(0, Math.round(cur));
      if (cur !== t.prog) { t.prog = cur; changed = true; }
      if (cur >= def.need && !t.done) {
        t.done = true;
        changed = true;
        X56Core.onTaskDone(t, def);
      }
    });
    if (changed) this.save();
  },
  onTaskDone: function (t, def) {
    var G = window.G;
    if (!G || t.claimed) return;
    t.claimed = true;
    G.money += def.reward;
    G.mood += 3;
    if (typeof window.cl === "function") {
      G.money = window.cl(G.money, 0, 9999999);
      G.mood = window.cl(G.mood, 0, 100);
    }
    try { if (typeof window.l === "function") window.l("✅ 任务完成：" + def.name + "，奖励 ¥" + def.reward + "、心情+3", "good"); } catch (e) {}
    this.save();
  },

  /* ── 签到（newDay 时触发） ── */
  doSign: function (G) {
    var d = this.load();
    var today = (typeof window.dstr === "function") ? window.dstr(G.date) : String(G.day);
    if (d.sign.last === today) return;
    /* 连续判定：昨天签过 */
    var yesterday = (function () {
      var dt = new Date(G.date.getTime());
      dt.setDate(dt.getDate() - 1);
      if (typeof window.dstr === "function") return window.dstr(dt);
      return String(G.day - 1);
    })();
    if (d.sign.last === yesterday) d.sign.streak++;
    else d.sign.streak = 1;
    d.sign.total++;
    d.sign.last = today;
    /* 签到奖励 */
    var reward = 5 + Math.min(d.sign.streak, 7) * 2;
    G.money += reward;
    G.mood += 2;
    try { if (typeof window.l === "function") window.l("📅 已签到 " + d.sign.streak + " 天，奖励 ¥" + reward, "good"); } catch (e) {}
    this.save();
  },

  /* ── 成就墙（5.6 新增，30 项） ── */
  achievements: [
    { id: "a1", icon: "🌅", name: "新的开始", desc: "进入游戏", cond: function (G) { return true; } },
    { id: "a2", icon: "📚", name: "初露锋芒", desc: "学习达到 50", cond: function (G) { return G.knowledge >= 50; } },
    { id: "a3", icon: "🎓", name: "学霸本霸", desc: "学习达到 85", cond: function (G) { return G.knowledge >= 85; } },
    { id: "a4", icon: "📊", name: "成绩斐然", desc: "成绩达到 80", cond: function (G) { return G.grade >= 80; } },
    { id: "a5", icon: "💪", name: "健身达人", desc: "体力达到 80", cond: function (G) { return G.fitness >= 80; } },
    { id: "a6", icon: "❤️", name: "生龙活虎", desc: "健康达到 100", cond: function (G) { return G.health >= 100; } },
    { id: "a7", icon: "😊", name: "快乐星球", desc: "心情达到 100", cond: function (G) { return G.mood >= 100; } },
    { id: "a8", icon: "💫", name: "魅力四射", desc: "魅力达到 80", cond: function (G) { return G.charm >= 80; } },
    { id: "a9", icon: "😎", name: "颜值担当", desc: "颜值达到 80", cond: function (G) { return G.appear >= 80; } },
    { id: "a10", icon: "✊", name: "众望所归", desc: "支持度达到 80", cond: function (G) { return G.support >= 80; } },
    { id: "a11", icon: "⭐", name: "一呼百应", desc: "影响力达到 80", cond: function (G) { return G.influence >= 80; } },
    { id: "a12", icon: "💰", name: "小有积蓄", desc: "持有 ¥1000", cond: function (G) { return G.money >= 1000; } },
    { id: "a13", icon: "🏦", name: "小富翁", desc: "持有 ¥5000", cond: function (G) { return G.money >= 5000; } },
    { id: "a14", icon: "💗", name: "情窦初开", desc: "拥有恋人", cond: function (G) { return !!G.lover; } },
    { id: "a15", icon: "💞", name: "桃花朵朵", desc: "3 段情缘", cond: function (G) { return (G.lovers || []).length >= 3; } },
    { id: "a16", icon: "🚫", name: "规规矩矩", desc: "累计 0 处分", cond: function (G) { return G.demerits === 0; } },
    { id: "a17", icon: "🏅", name: "运动季", desc: "运动 10 次", cond: function (G) { return G.st.exer >= 10; } },
    { id: "a18", icon: "📖", name: "手不释卷", desc: "阅读 10 次", cond: function (G) { return G.st.read >= 10; } },
    { id: "a19", icon: "📱", name: "手机控", desc: "玩手机 15 次", cond: function (G) { return G.st.phone >= 15; } },
    { id: "a20", icon: "🎨", name: "多才多艺", desc: "拥有 3 个爱好", cond: function (G) { return (G.hobbies56 || []).length >= 3; } },
    { id: "a21", icon: "🌸", name: "天生丽质", desc: "拥有 4 个外貌特征", cond: function (G) { return (G.features56 || []).length >= 4; } },
    { id: "a22", icon: "🧠", name: "认识自己", desc: "选定 MBTI", cond: function (G) { return !!G.mbti; } },
    { id: "a23", icon: "🎯", name: "心之所向", desc: "选定志向", cond: function (G) { return !!X56Core.load().aspiration; } },
    { id: "a24", icon: "📅", name: "坚持一周", desc: "连续签到 7 天", cond: function (G) { return X56Core.load().sign.streak >= 7; } },
    { id: "a25", icon: "✅", name: "说到做到", desc: "完成 10 个每日任务", cond: function (G) { return X56Core.countTaskDone() >= 10; } },
    { id: "a26", icon: "🌟", name: "社团之星", desc: "社团 5 级", cond: function (G) { return G.clubLv >= 5; } },
    { id: "a27", icon: "🎤", name: "学生干部", desc: "成为学生会成员", cond: function (G) { return G.union >= 0; } },
    { id: "a28", icon: "🏫", name: "班长在此", desc: "成为班长", cond: function (G) { return G.duty === "班长"; } },
    { id: "a29", icon: "🌧️", name: "经历风雨", desc: "经历雨天", cond: function (G) { return G.weather && G.weather.rain >= 2; } },
    { id: "a30", icon: "🌈", name: "走完一程", desc: "存活 30 天", cond: function (G) { return G.day >= 30; } }
  ],
  _taskDoneTotal: 0,
  countTaskDone: function () {
    var raw = storageGet("xz56_task_done_total");
    return parseInt(raw || "0", 10) || 0;
  },
  refreshAchievements: function () {
    var G = window.G;
    if (!G) return;
    var d = this.load();
    var self = this;
    this.achievements.forEach(function (a) {
      if (d.achievements[a.id]) return;
      var ok = false;
      try { ok = a.cond(G); } catch (e) {}
      if (ok) {
        d.achievements[a.id] = true;
        self._taskDoneTotal = self._taskDoneTotal;
        try { if (typeof window.l === "function") window.l("🏆 成就解锁：" + a.name + "（" + a.desc + "）", "good"); } catch (e) {}
        self.save();
      }
    });
  },

  /* ── 校园人物志（NPC 名册 + 已结识标记） ── */
  roster: [
    { id: "lin", name: "林晚", emoji: "🌸", tag: "文艺 · 同班", bio: "爱读书，会脸红，像春天的风。" },
    { id: "zhao", name: "赵小雨", emoji: "🎨", tag: "美术生", bio: "古灵精怪，笑容藏着软。" },
    { id: "su", name: "苏清颜", emoji: "🎹", tag: "学霸 · 钢琴", bio: "清冷慢热，话少而认真。" },
    { id: "xu", name: "许念", emoji: "🏀", tag: "体育生", bio: "短发飒爽，仗义又细心。" },
    { id: "chen", name: "陈墨", emoji: "⚽", tag: "体育委员", bio: "风风火火，热心肠。" },
    { id: "zhou", name: "周子航", emoji: "🎮", tag: "游戏达人", bio: "爱熬夜上分，嘴硬心软。" },
    { id: "tiantian", name: "徐甜甜", emoji: "📚", tag: "学习委员", bio: "安静努力，图书馆常客。" },
    { id: "wu", name: "吴磊", emoji: "🏃", tag: "田径队", bio: "阳光外向，跑步飞快。" },
    { id: "wang", name: "王老师", emoji: "👩‍🏫", tag: "班主任", bio: "严格又护短的语文老师。" }
  ],

  /* ══════════════════════════════════════════════════════════
     面板渲染
     ══════════════════════════════════════════════════════════ */
  tabs: { dash: "🏠 中心", task: "✅ 任务", sign: "📅 签到", asp: "🎯 志向", ach: "🏆 成就", skill: "🎨 技能", people: "👥 人物" },
  open: function (tab) {
    this.load();
    var G = window.G;
    var root = document.createElement("div");
    root.id = "x56CorePanel";
    root.className = "x56-core";
    var nav = Object.keys(this.tabs).map(function (k) {
      return '<button class="x56-core-nav" data-tab="' + k + '">' + X56Core.tabs[k] + "</button>";
    }).join("");
    root.innerHTML = '<div class="x56-core-navrow">' + nav + "</div>" +
      '<div class="x56-core-body" id="x56CoreBody"></div>';
    modal("");
    var mb = $("modalbox");
    mb.innerHTML = "";
    mb.appendChild(root);
    var self = this;
    $a("#x56CorePanel .x56-core-nav").forEach(function (b) {
      on(b, "click", function () { self.renderTab(b.getAttribute("data-tab")); });
    });
    this.renderTab(tab || "dash");
  },
  close: function () { closeModal(); },
  renderTab: function (tab) {
    $a("#x56CorePanel .x56-core-nav").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-tab") === tab);
    });
    var body = $("x56CoreBody");
    body.innerHTML = "";
    var fn = this["tab_" + tab];
    if (fn) fn.call(this, body);
  },

  /* ── 中心首页 ── */
  tab_dash: function (body) {
    var d = this.load();
    var G = window.G;
    var asp = this.aspById(d.aspiration);
    var doneCount = Object.keys(d.achievements).length;
    var weatherHtml = "";
    if (G && G.weather) {
      weatherHtml = '<div class="x56-weather"><span class="w-icon">' + (G.weather.rain >= 2 ? "🌧️" : G.weather.rain === 1 ? "🌦️" : "☀️") +
        "</span><div><b>" + G.weather.n + "</b><br><span class='dim small'>气温 " + G.wtemp + "℃</span></div></div>";
    }
    var quick = "";
    if (G) {
      quick = this.renderTaskMini(G);
    }
    var html = '<div class="x56-dash-head">' +
      '<div class="dash-hi">👋 你好，' + esc(G ? G.name : "同学") + '</div>' +
      '<div class="dim small">这里是 5.6 校园中心，所有玩法从这里出发。</div></div>' +
      weatherHtml +
      '<div class="x56-dash-grid">' +
      '<div class="dash-tile" data-go="task"><div class="dt-num">' + (G ? this.taskDoneToday() : 0) + "/3</div><div class='dt-lb'>今日任务</div></div>" +
      '<div class="dash-tile" data-go="sign"><div class="dt-num">' + d.sign.streak + "</div><div class='dt-lb'>连续签到</div></div>" +
      '<div class="dash-tile" data-go="ach"><div class="dt-num">' + doneCount + "/30</div><div class='dt-lb'>成就</div></div>" +
      '<div class="dash-tile" data-go="asp"><div class="dt-num">' + (asp ? asp.icon : "🎯") + "</div><div class='dt-lb'>志向</div></div>" +
      "</div>" +
      quick +
      '<div class="x56-dash-actions">' +
      '<button class="x56-da" data-go="skill">🎨 我的技能</button>' +
      '<button class="x56-da" data-go="people">👥 校园人物</button>' +
      '<button class="x56-da" id="dashMoments">🌈 朋友圈</button>' +
      '<button class="x56-da" id="dashLife">📖 校园见闻</button>' +
      '<button class="x56-da" id="dashJobs">💼 勤工俭学</button>' +
      '<button class="x56-da" id="dashStory">📖 剧情模式</button>' +
      "</div>";
    body.innerHTML = html;
    var self = this;
    $a("#x56CoreBody [data-go]").forEach(function (el) {
      on(el, "click", function () { self.renderTab(el.getAttribute("data-go")); });
    });
    var m = $("dashMoments");
    if (m) on(m, "click", function () { closeModal(); X56Moments.open(); });
    var lf = $("dashLife");
    if (lf) on(lf, "click", function () { if (window.X56Life) X56Life.panel(); });
    var jb = $("dashJobs");
    if (jb) on(jb, "click", function () { if (window.X56Jobs) X56Jobs.panel(); });
    var s = $("dashStory");
    if (s) on(s, "click", function () { closeModal(); toast("剧情模式可在主界面选择，从开始页进入", 1800); });
  },
  taskDoneToday: function () {
    var d = this.load();
    var n = 0;
    d.tasks.forEach(function (t) { if (t.done) n++; });
    return n;
  },
  renderTaskMini: function (G) {
    var d = this.load();
    if (!d.tasks.length) return "";
    var rows = d.tasks.map(function (t) {
      var def = X56Core.taskPool[t.id];
      var cur = 0;
      try { cur = Math.round(def.get(G)); } catch (e) {}
      cur = Math.min(cur, def.need);
      var pct = Math.round(cur / def.need * 100);
      return '<div class="tm-row"><span>' + def.icon + " " + def.name + "</span>" +
        '<div class="tm-bar"><div class="tm-fill" style="width:' + pct + '%;' +
        (t.done ? "background:#42d392" : "") + '"></div></div>' +
        '<span class="tm-pct">' + (t.done ? "✓" : cur + "/" + def.need) + "</span></div>";
    }).join("");
    return '<div class="x56-taskmini"><div class="tm-title">今日任务</div>' + rows + "</div>";
  },

  /* ── 任务页 ── */
  tab_task: function (body) {
    var G = window.G;
    if (!G) { body.innerHTML = '<p class="dim">进入游戏后可接取每日任务。</p>'; return; }
    var d = this.load();
    if (d.day !== G.day) this.rollTasks(G);
    var rows = d.tasks.map(function (t) {
      var def = X56Core.taskPool[t.id];
      var cur = 0;
      try { cur = Math.round(def.get(G)); } catch (e) {}
      cur = Math.min(cur, def.need);
      var pct = Math.round(cur / def.need * 100);
      return '<div class="task-card' + (t.done ? " done" : "") + '">' +
        '<div class="tc2-head"><span>' + def.icon + " <b>" + def.name + "</b></span>" +
        '<span class="tc2-reward">¥' + def.reward + " 心情+3</span></div>" +
        '<div class="tm-bar" style="margin-top:8px"><div class="tm-fill" style="width:' + pct + '%;' +
        (t.done ? "background:#42d392" : "") + '"></div></div>' +
        '<div class="dim small" style="margin-top:6px">' + (t.done ? "已完成，奖励已发放 ✅" : "进度 " + cur + "/" + def.need) + "</div></div>";
    }).join("");
    body.innerHTML = '<div class="x56-section-title">✅ 每日任务</div>' +
      '<p class="dim small">每天刷新 3 个任务，随你的志向变化；完成自动发奖。</p>' + rows +
      '<button class="gbtn" style="width:100%;margin-top:12px" id="taskReroll">🎲 换一批（仅今日）</button>';
    var self = this;
    on($("taskReroll"), "click", function () {
      self.rollTasks(G);
      self.renderTab("task");
    });
  },

  /* ── 签到页 ── */
  tab_sign: function (body) {
    var d = this.load();
    var days = [];
    for (var i = 0; i < 7; i++) {
      var active = i < (d.sign.streak % 7 === 0 && d.sign.streak > 0 ? 7 : d.sign.streak % 7);
      days.push('<div class="sign-day' + (active ? " active" : "") + '"><span>第' + (i + 1) + "天</span><b>" +
        (5 + (i + 1) * 2) + "</b></div>");
    }
    body.innerHTML = '<div class="x56-section-title">📅 每日签到</div>' +
      '<div class="sign-streak">连续签到 <b>' + d.sign.streak + "</b> 天 · 累计 " + d.sign.total + " 天</div>" +
      '<div class="sign-week">' + days.join("") + "</div>" +
      '<div class="quote" style="margin-top:14px">连续签到越久奖励越高；断签会从第 1 天重新开始。<br>每天进入新的一天会自动签到。</div>';
  },

  /* ── 志向页 ── */
  tab_asp: function (body) {
    var d = this.load();
    var G = window.G;
    var cards = this.aspirations.map(function (a) {
      var sel = d.aspiration === a.id;
      var prog = 0;
      if (G && sel) {
        try { prog = Math.min(100, Math.round(a.stat(G))); } catch (e) {}
      }
      var bar = sel ? '<div class="asp-prog"><div class="asp-fill" style="width:' + prog + '%;background:' +
        a.color + '"></div></div>' : "";
      return '<div class="asp-card' + (sel ? " sel" : "") + '" data-id="' + a.id +
        '"><div class="asp-icon" style="background:' + a.color + '22">' + a.icon + "</div>" +
        "<div><div class='asp-name'>" + a.name + (sel ? " <span class='asp-cur'>已选定</span>" : "") +
        "</div><div class='asp-desc'>" + a.desc + "</div>" + bar + "</div></div>";
    }).join("");
    body.innerHTML = '<div class="x56-section-title">🎯 心之所向</div>' +
      '<p class="dim small">选定一个志向，决定你每天的任务方向；它会成为你这一学期努力的方向。</p>' + cards;
    var self = this;
    $a("#x56CoreBody .asp-card").forEach(function (c) {
      on(c, "click", function () {
        d.aspiration = c.getAttribute("data-id");
        self.save();
        if (G) self.rollTasks(G);
        self.renderTab("asp");
        toast("志向已选定：" + self.aspById(d.aspiration).name);
      });
    });
  },

  /* ── 成就页 ── */
  tab_ach: function (body) {
    var d = this.load();
    var G = window.G;
    var cards = this.achievements.map(function (a) {
      var unlocked = !!d.achievements[a.id];
      return '<div class="ach-card' + (unlocked ? " unlocked" : "") + '">' +
        '<div class="ach-icon">' + (unlocked ? a.icon : "🔒") + "</div>" +
        '<div class="ach-name">' + a.name + "</div>" +
        '<div class="ach-desc">' + a.desc + "</div></div>";
    }).join("");
    var count = Object.keys(d.achievements).length;
    body.innerHTML = '<div class="x56-section-title">🏆 成就墙（' + count + "/30）</div>" +
      '<p class="dim small">完成条件自动解锁；灰色的还在等你。</p>' +
      '<div class="ach-grid">' + cards + "</div>";
  },

  /* ── 技能页 ── */
  tab_skill: function (body) {
    var G = window.G;
    if (!G) { body.innerHTML = '<p class="dim">进入游戏后可查看技能。</p>'; return; }
    var skill = G.skill56 || {};
    var rows = Object.keys(skill).map(function (k) {
      var lv = skill[k];
      return '<div class="skill-row"><span>🌟 ' + k + "</span>" +
        '<div class="tm-bar"><div class="tm-fill" style="width:' + Math.min(100, lv) + '%;background:#b79af8"></div></div>' +
        '<span class="tm-pct">Lv.' + lv + "</span></div>";
    }).join("");
    if (!rows) rows = '<p class="dim small">还没有特长；在角色创建时选择爱好即可获得。</p>';
    var chipSel = function (t) { return '<span class="chip sel">' + t + "</span>"; };
    var feats = (G.features56 || []).map(chipSel).join("");
    var hobs = (G.hobbies56 || []).map(chipSel).join("");
    var emptyFallback = '<span class="dim small">未选</span>';
    var wrapRow = function (title, inner) {
      return '<div class="x56-sub-title">' + title + '</div>' +
        '<div class="row" style="flex-wrap:wrap">' + (inner || emptyFallback) + "</div>";
    };
    var mbti = "";
    if (G.mbti) {
      var mbtiName = X56MBTI.byCode(G.mbti).name;
      mbti = '<div class="quote">🧠 MBTI：<b>' + G.mbti + "</b> · " + esc(mbtiName) + "</div>";
    }
    var zd = "";
    if (G.zodiac) {
      var blood = G.blood56 || "A";
      var handTxt = G.hand56 === "left" ? "左撇子" : "右手";
      zd = '<div class="quote">✨ 星座：<b>' + G.zodiac + "</b> · 血型 " + blood + " · " + handTxt + "</div>";
    }
    var out = "";
    out += '<div class="x56-section-title">🎨 我的技能与设定</div>';
    out += mbti;
    out += zd;
    out += wrapRow("外貌特征", feats);
    out += wrapRow("爱好特长", hobs);
    out += '<div class="x56-sub-title">技能等级</div>';
    out += rows;
    body.innerHTML = out;
  },

  /* ── 人物志页 ── */
  tab_people: function (body) {
    var G = window.G;
    var met = (G && G.met) || [];
    var cards = this.roster.map(function (p) {
      var known = false;
      for (var i = 0; i < met.length; i++) {
        if (met[i] && (met[i].name === p.name || met[i] === p.name)) known = true;
      }
      if (G && G.lover && G.lover.name === p.name) known = true;
      return '<div class="people-card' + (known ? " known" : "") + '">' +
        '<div class="p-avatar">' + p.emoji + "</div>" +
        "<div><div class='p-name'>" + p.name + (known ? " <span class='p-known'>已结识</span>" : " <span class='p-unknown'>未结识</span>") +
        "</div><div class='p-tag'>" + p.tag + "</div><div class='p-bio'>" + p.bio + "</div></div></div>";
    }).join("");
    body.innerHTML = '<div class="x56-section-title">👥 校园人物志</div>' +
      '<p class="dim small">你在剧情与日常中遇到的人会被记录；去剧情模式，把她们都认识一遍。</p>' + cards;
  }
};
window.X56Core = X56Core;

/* 注入入口按钮 */
function injectCoreButton() {
  var row = $s(".xz-func-row");
  if (row && !$("xz56-core-btn")) {
    var b = document.createElement("button");
    b.id = "xz56-core-btn";
    b.className = "mini gbtn";
    b.textContent = "🏛️ 校园中心";
    on(b, "click", function () { X56Core.open("dash"); });
    row.appendChild(b);
  }
}
X56.inits.push(injectCoreButton);

/* 每日刷新 & 实时进度轮询 */
setInterval(function () {
  try {
    X56Core.refreshTasks();
    X56Core.refreshAchievements();
  } catch (e) {}
}, 2000);

/* 包装 newDay：刷新签到 / 任务 / 结算 */
ready(function () {
  setTimeout(function () {
    var oldNew = window.newDay;
    if (typeof oldNew === "function" && !window.__x56NewDayWrapped) {
      window.__x56NewDayWrapped = true;
      window.newDay = function () {
        /* 结算上一日任务完成数 */
        var d = X56Core.load();
        var doneBefore = X56Core.countTaskDone();
        var addToday = 0;
        d.tasks.forEach(function (t) { if (t.done) addToday++; });
        try { storageSet("xz56_task_done_total", String(doneBefore + addToday)); } catch (e) {}
        oldNew.apply(this, arguments);
        try {
          if (window.G) {
            X56Core.doSign(window.G);
            X56Core.rollTasks(window.G);
          }
        } catch (e) { X56.warn("每日刷新失败", e); }
      };
    }
  }, 500);
});

/* ══════════════════════════════════════════════════════════
   模块十二：5.6 版本日志 + 游戏内邮件 + 版本号统一
   ══════════════════════════════════════════════════════════ */
var X56Version = {
  history: [
    {
      v: "5.6", d: "心之所向（史诗更新）", new: true,
      list: [
        "🎨 全新统一主题令牌：7 套皮肤全部走同一套语义变量，跨主题不再有黑块、看不见的字",
        "🏞️ 默认主题回归「西子湖」；新增右下角随时可点的主题切换按钮，立即生效",
        "✍️ 手绘「西子模拟器 5.6」标题，与原标题在开始页循环动画，放在右侧",
        "🎵 修复音乐放不出来：手势解锁失败后持续重试，卡死/出错自动恢复",
        "🧰 修复右下角三个悬浮按钮重叠，统一纵向排布",
        "🌌 制作名单全面重做：星空流光动画，技术支持新增 GLM Hy3",
        "🌈 新增微信朋友圈：封面头像、九宫格、点赞、评论与回复、发表图文、删除、红点，还原真实核心体验",
        "👤 自由模式角色大创建：家庭背景 / 外貌 / 爱好 / 星座 / 血型 / 惯用手，全部影响后续",
        "🧠 MBTI 16 型选择：影响精力、学习方式、社交风格与情绪，每日有微小漂移",
        "📖 新增剧情模式：一本可玩的言情小说，弱化数值，只选一个女生，打字机对话框、分支选项、地图指引，多结局",
        "🏛️ 新增校园中心：每日签到、每日任务、志向系统、成就墙（30 项）、技能面板、校园人物志",
        "🩸 生理期系统保留并改为开关，默认关闭（女性没有生理期）",
        "🎯 新增「志向」系统：6 条心之所向，决定你每天努力的方向",
        "🧩 工作台 / PATCH 4.0 控制台主题适配，点进去不再发黑、文字清晰",
        "🎮 可玩模式进一步增多：自由模式、剧情模式、朋友圈、签到任务与成就体系",
        "🖥️ 全站 UI 统一，深浅主题下观感一致",
        "📧 新增 5.6 更新邮件与版本日志，版本号三处对齐"
      ]
    },
    {
      v: "5.5.13", d: "晴空 + 樱语皮肤",
      list: ["皮肤「晴空」回归", "新皮肤「樱语」", "存档/真麦/新游戏/工具配套修复"]
    },
    {
      v: "5.5.12", d: "整合发布（合一体）",
      list: ["5.5.8 基座 + 四层补丁全部回归合并", "6 大主题、340+ AI 意图、12 款工具", "默认自动播放背景音乐"]
    },
    {
      v: "5.5.11", d: "大规模扩展",
      list: ["应用商城 12 个实用工具", "装扮系统 24 件单品", "PATCH 实时诊断", "工作台浮窗", "更新日志面板"]
    },
    {
      v: "5.5.10", d: "歌词滚动 + 小游戏增强",
      list: ["歌词滚动修复", "K歌音准曲线", "黄金矿工四档难度", "大西瓜 rAF 节流", "视频播放器"]
    },
    {
      v: "5.5.9", d: "五大主题 + 手机修复",
      list: ["五大美术主题随时切换", "手机布局精准修复", "新手教程 6 页", "AI 题库扩容到 140 意图"]
    },
    {
      v: "5.5.8", d: "基石版",
      list: ["每日精力系统", "高考模拟", "邮件系统", "KTV 音准判定", "生理期记录"]
    }
  ],

  openChangelog: function () {
    var html = '<div class="x56-changelog">' +
      '<div class="cl-head"><span class="cl-emoji">📜</span><div>' +
      '<div class="cl-title">更新日志</div>' +
      '<div class="cl-sub">杭州西子实验学校模拟器 · 5.6「心之所向」</div></div></div>' +
      '<div id="x56ChangelogList">';
    this.history.forEach(function (c) {
      html += '<div class="cl-version' + (c.new ? " newest" : "") + '">' +
        '<div class="cl-vhead"><span class="cl-vnum">v' + c.v + "</span>" +
        '<span class="cl-vdate">' + c.d + "</span>" +
        (c.new ? '<span class="cl-newtag">最新</span>' : "") + "</div>" +
        '<div class="cl-list">' + c.list.map(function (it) { return "<div class='cl-item'>" + it + "</div>"; }).join("") +
        "</div></div>";
    });
    html += '</div><button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button></div>';
    modal(html);
  },

  /* 重接旧“更新”按钮 → 开 5.6 日志 */
  rewire: function () {
    var b = $("xz-changelog-btn");
    if (b && !b.getAttribute("data-x56v")) {
      b.setAttribute("data-x56v", "1");
      var nb = b.cloneNode(true);
      on(nb, "click", function () { X56Version.openChangelog(); });
      b.parentNode.replaceChild(nb, b);
    }
  },

  /* 发送 5.6 邮件（只发一次） */
  mailed: false,
  sendMail: function () {
    if (this.mailed) return;
    this.mailed = true;
    try {
      if (typeof window.pushMail === "function" && window.G) {
        window.pushMail({
          from: "5.6 制作组",
          sub: "欢迎来到 5.6「心之所向」",
          body: "这是一次史诗更新：\n· 7 套统一主题、随时切换按钮\n· 微信朋友圈（点赞/评论/发表）\n· 角色大创建 + MBTI 16 型\n· 剧情模式（一本可玩的言情小说）\n· 校园中心（签到/任务/志向/成就）\n\n点右下角功能行「校园中心」开始；开始页可选「剧情模式」。\n—— Laerrus. 与 GLM Hy3 等技术支持团队",
          time: ""
        });
      }
    } catch (e) { X56.warn("5.6 邮件发送失败", e); }
  }
};
window.X56Version = X56Version;

X56.inits.push(function () {
  window.XZ_VER = "10.9.9 PRO";
  try { document.title = "杭州西子实验学校模拟器 5.6"; } catch (e) {}
});

ready(function () {
  var n = 0;
  var t = setInterval(function () {
    X56Version.rewire();
    if (++n > 50) clearInterval(t);
  }, 500);
  /* 包装 startGame：游戏真正开始后发 5.6 邮件 */
  setTimeout(function () {
    var old = window.startGame;
    if (typeof old === "function" && !window.__x56VerWrapped) {
      window.__x56VerWrapped = true;
      window.startGame = function () {
        old.apply(this, arguments);
        setTimeout(function () { X56Version.sendMail(); }, 600);
      };
    }
  }, 600);
});

/* ══════════════════════════════════════════════════════════
   模块十三：校园见闻（随机事件库）—— 100 个可互动小事件
   每天 3 次“见闻机会”；事件有选择、有结果，影响真实属性
   类别：学习📚 / 社交🗣️ / 运动🏃 / 休闲🎮 / 奇遇✨ / 情感💗
   ══════════════════════════════════════════════════════════ */
var X56Life = {
  KEY: "xz56_life_v1",
  statKeys: ["health", "mood", "sleep", "knowledge", "grade", "support", "influence",
    "charm", "fitness", "appear", "money"],
  statMeta: {
    health: "❤️ 健康", mood: "🙂 心情", sleep: "😴 睡眠", knowledge: "📘 学习",
    grade: "📊 成绩", support: "✊ 支持", influence: "⭐ 影响力", charm: "💫 魅力",
    fitness: "💪 体力", appear: "😎 颜值", money: "💰 金钱"
  },
  data: function () {
    try {
      var raw = storageGet(this.KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { day: -1, draws: 0, played: 0, seen: {} };
  },
  save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },

  /* 效果应用 */
  applyEff: function (eff) {
    var G = window.G;
    if (!G) return "";
    var lines = [];
    for (var k in eff) {
      var v = eff[k];
      if (this.statKeys.indexOf(k) < 0) continue;
      G[k] = (typeof G[k] === "number" ? G[k] : 0) + v;
      var lb = this.statMeta[k];
      lines.push((v > 0 ? lb + " +" + v : lb + " " + v));
    }
    if (typeof window.clampAll === "function") { try { window.clampAll(); } catch (e) {} }
    return lines.join("　");
  },

  /* 抽取一个事件（可指定类别） */
  open: function (cat) {
    var G = window.G;
    if (!G) { toast("进入游戏后可探索校园见闻"); return; }
    var d = this.data();
    if (d.day !== G.day) { d.day = G.day; d.draws = 0; }
    if (d.draws >= 3) {
      modal('<h3>📖 校园见闻</h3><p class="dim">今天的 3 次见闻机会用完了，明天再来。</p>' +
        '<button class="gbtn" onclick="X56.closeModal()">关闭</button>');
      return;
    }
    var pool = this.events;
    if (cat) pool = pool.filter(function (e) { return e.cat === cat; });
    /* 避开刚玩过的 */
    var fresh = pool.filter(function (e) { return !d.seen[e.id]; });
    if (fresh.length) pool = fresh;
    var ev = pool[Math.floor(Math.random() * pool.length)];
    d.draws++;
    d.seen[ev.id] = true;
    d.played++;
    if (Object.keys(d.seen).length > 200) d.seen = {};
    this.save(d);
    this.renderEvent(ev, d);
  },

  renderEvent: function (ev, d) {
    var self = this;
    var h = '<div class="life-event">' +
      '<div class="le-head"><span class="le-icon">' + ev.icon + "</span>" +
      '<div><div class="le-cat">' + ev.cat + "</div>" +
      '<div class="le-title">' + ev.title + "</div></div></div>" +
      '<div class="le-text">' + ev.text + "</div>" +
      '<div id="leOptions" class="le-options">' +
      ev.options.map(function (o, i) {
        return '<button class="le-option" data-i="' + i + '"><span>' + o.label + "</span>" +
          (o.hint ? '<span class="le-hint">' + o.hint + "</span>" : "") + "</button>";
      }).join("") + "</div>" +
      '<div id="leResult" class="le-result"></div>' +
      '<div id="leFooter" class="le-footer" style="display:none">' +
      '<button class="gbtn" id="leAgain">📖 再看看（剩 ' + (3 - d.draws) + "）</button>" +
      '<button class="gbtn" id="leClose">关闭</button></div></div>';
    modal(h);
    setTimeout(function () {
      $a("#leOptions .le-option").forEach(function (b) {
        on(b, "click", function () {
          var o = ev.options[parseInt(b.getAttribute("data-i"), 10)];
          var effText = self.applyEff(o.eff || {});
          var r = $("leResult");
          r.innerHTML = '<div class="le-reply">' + (o.reply || "……") + "</div>" +
            (effText ? '<div class="le-eff">' + effText + "</div>" : "");
          r.style.display = "block";
          $("leOptions").style.display = "none";
          $("leFooter").style.display = "flex";
          if (typeof window.upd === "function") { try { window.upd(); } catch (e) {} }
        });
      });
      on($("leAgain"), "click", function () { self.open(); });
      on($("leClose"), "click", function () { closeModal(); });
    }, 80);
  },

  /* 入口面板（分类选择） */
  panel: function () {
    var cats = ["📚 学习", "🗣️ 社交", "🏃 运动", "🎮 休闲", "✨ 奇遇", "💗 情感"];
    var catIds = ["📚 学习", "🗣️ 社交", "🏃 运动", "🎮 休闲", "✨ 奇遇", "💗 情感"];
    var d = this.data();
    var G = window.G;
    var left = G ? (d.day === G.day ? 3 - d.draws : 3) : 3;
    var h = '<h3>📖 校园见闻</h3>' +
      '<div class="quote">在校园里走走，总会遇到点什么。<br>今天还剩 <b>' + left + "</b> 次见闻机会。</div>" +
      '<div class="le-cat-grid">' +
      cats.map(function (c, i) {
        return '<button class="le-cat-btn" data-c="' + catIds[i] + '">' + c + "</button>";
      }).join("") +
      '<button class="le-cat-btn" data-c="">🎲 随机</button></div>' +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button>';
    modal(h);
    var self = this;
    setTimeout(function () {
      $a("#modalbox .le-cat-btn").forEach(function (b) {
        on(b, "click", function () {
          var c = b.getAttribute("data-c");
          self.open(c || null);
        });
      });
    }, 80);
  },

  /* ─────────────── 事件库（100 个） ─────────────── */
  events: []
};
window.X56Life = X56Life;

/* 构造事件的简写：L(类别,图标,标题,正文,[[选项,{效},回复,提示],...]) */
function L(cat, icon, title, text, options) {
  X56Life.events.push({
    cat: cat, icon: icon, title: title, text: text,
    options: options.map(function (o) {
      return { label: o[0], eff: o[1], reply: o[2], hint: o[3] };
    })
  });
}

/* ══════════════════════════════════════════════════════════
   模块十三（数据）：100 个校园见闻事件
   L(类别, 图标, 标题, 正文, [[选项, {效果}, 回复, 提示], ...])
   ══════════════════════════════════════════════════════════ */

/* ─────────────── 📚 学习（17） ─────────────── */
L("📚 学习", "📐", "解不出的大题",
  "晚自习，数学最后一道大题你已经算了半张草稿纸。",
  [["死磕到底", { knowledge: 2, sleep: -4, mood: -2 }, "终于算出来了，可你也困得不行。", "学习+ 熬夜"],
   ["翻答案找思路", { knowledge: 1 }, "看了答案才明白卡在哪一步。", "学习+"],
   ["去问同学", { knowledge: 1, support: 1 }, "同学三两句点醒了你。", "学习+ 社交"]]);
L("📚 学习", "📝", "文言文默写",
  "早自习，老师突然要求默写《赤壁赋》。",
  [["昨晚背过，稳稳拿下", { knowledge: 2, grade: 1, charm: 1 }, "默写全对，老师夸你了。", "学习+ 成绩+"],
   ["凭印象写", { knowledge: 1 }, "错了两个字，及格。", "学习+"],
   ["偷偷翻书", { knowledge: 0, mood: -1 }, "差点被发现，吓出一身汗。", "风险"]]);
L("📚 学习", "📖", "图书馆的孤本",
  "图书馆角落有本你找了很久的参考书，只剩最后一本。",
  [["立刻借走", { knowledge: 3 }, "这本书帮你补上了薄弱章节。", "学习+ 3"],
   ["让给同样需要的同学", { support: 3, charm: 2 }, "同学很感激，你们成了朋友。", "社交+"]]);
L("📚 学习", "🧪", "化学实验失败",
  "实验课，你的试剂怎么也不出预期的颜色。",
  [["反复调整比例", { knowledge: 2 }, "原来顺序错了，重做成功。", "学习+ 2"],
   ["请教学霸", { knowledge: 1, support: 1 }, "学霸一眼看出问题。", "学习+ 社交"],
   ["随便交个结果", { knowledge: 0, grade: -1 }, "实验报告被打了低分。", "成绩-"]]);
L("📚 学习", "🗓️", "考试倒计时",
  "黑板角落写着距月考还有 3 天。",
  [["制定复习计划", { knowledge: 2, mood: 1 }, "有了计划，心里踏实多了。", "学习+"],
   ["临时抱佛脚", { knowledge: 1, sleep: -3 }, "熬了几个晚上，多少有点用。", "学习+ 熬夜"],
   ["顺其自然", { mood: 1 }, "你心态一向很好。", "心情+"]]);
L("📚 学习", "✏️", "同桌的笔记",
  "同桌的笔记记得条理清晰，你看得很惭愧。",
  [["借来抄并道谢", { knowledge: 1, support: 1 }, "笔记帮你理清了思路。", "学习+ 社交"],
   ["下决心改进自己的笔记", { knowledge: 2, charm: 1 }, "你的笔记也越来越工整。", "学习+"]]);
L("📚 学习", "🌍", "地理课提问",
  "老师指着地图问你季风的成因。",
  [["站起来完整回答", { knowledge: 2, support: 1, charm: 1 }, "回答得漂亮，全班鼓掌。", "学习+ 魅力+"],
   ["答了一半", { knowledge: 1 }, "老师提示你补全了。", "学习+"],
   ["说不会", { knowledge: 0, mood: -1 }, "你坐下了，有点不好意思。", "心情-"]]);
L("📚 学习", "📕", "错题本",
  "你翻开积了厚厚一层灰的错题本。",
  [["把错题重做一遍", { knowledge: 2, grade: 1 }, "同类型题再也不会错。", "学习+ 成绩+"],
   ["只看不动手", { knowledge: 1 }, "看明白了，就怕下次还错。", "学习+"],
   ["塞回抽屉", { knowledge: 0, mood: 1 }, "你决定先放过自己。", "心情+"]]);
L("📚 学习", "🎤", "英语早读",
  "英语课轮到你带读课文。",
  [["大声标准地带读", { knowledge: 2, charm: 2, support: 1 }, "发音标准，老师很满意。", "学习+ 魅力+"],
   ["小声读", { knowledge: 1 }, "勉强完成了。", "学习+"],
   ["推荐别人", { support: 1 }, "你把机会让给了同学。", "社交+"]]);
L("📚 学习", "📚", "课间的教室",
  "课间别人都出去玩了，你还在为一道题纠结。",
  [["继续钻研", { knowledge: 2, fitness: -1 }, "题解出来了，坐得有点腰酸。", "学习+"],
   ["出去活动一下", { fitness: 1, mood: 1 }, "吹了吹风，回来更清醒。", "体力+ 心情+"],
   ["趴桌休息", { sleep: 2 }, "眯了十分钟，精神了些。", "睡眠+"]]);
L("📚 学习", "🧮", "物理公式",
  "物理课，公式推导你越听越糊涂。",
  [["课后找老师问", { knowledge: 2, support: 1 }, "老师单独讲了一遍，你懂了。", "学习+ 社交"],
   ["看网课自学", { knowledge: 1, sleep: -1 }, "反复看了两遍才明白。", "学习+"],
   ["放弃这一章", { knowledge: -1, grade: -1 }, "物理留下了一个大坑。", "成绩-"]]);
L("📚 学习", "📃", "随堂测验",
  "老师不打招呼发了一套小测验。",
  [["凭平时积累作答", { knowledge: 1, grade: 1 }, "成绩出来，还不错。", "学习+ 成绩+"],
   ["和旁边对答案", { grade: 0, mood: -1 }, "没被抓，但心里发虚。", "风险"],
   ["空着交", { grade: -1 }, "卷子几乎没写。", "成绩-"]]);
L("📚 学习", "🕯️", "晚自习犯困",
  "晚自习又热又困，你头一点一点。",
  [["洗把冷水脸", { knowledge: 1, sleep: -1 }, "清醒了，又能学一会儿。", "学习+"],
   ["站着听课", { knowledge: 1, fitness: 1 }, "站着果然不困了。", "学习+"],
   ["偷偷睡一觉", { sleep: 3, knowledge: -1 }, "睡得很香，但漏了重点。", "睡眠+"]]);
L("📚 学习", "🧭", "选科纠结",
  "老师开始让大家考虑选科方向。",
  [["认真研究兴趣和优势", { knowledge: 1, mood: 1 }, "你心里渐渐有了方向。", "学习+ 心情+"],
   ["跟着好朋友选", { support: 1, knowledge: -1 }, "能和朋友在一起，但未必适合。", "社交+"],
   ["听父母安排", { knowledge: 0 }, "你暂时没有别的想法。", "——"]]);
L("📚 学习", "🔬", "公开课",
  "班里来了很多外校老师听课，老师提问很期待地看着你。",
  [["举手自信作答", { knowledge: 2, charm: 2, support: 2 }, "为班级争了光，老师下课谢谢你。", "学习+ 魅力+"],
   ["在座位上小声回答", { knowledge: 1 }, "答案对了，没引起注意。", "学习+"],
   ["低头不看老师", { mood: -1 }, "你错过了这次机会。", "心情-"]]);
L("📚 学习", "📦", "学长的复习资料",
  "毕业的学长留下一箱复习资料，里面有他的手写总结。",
  [["认真研读", { knowledge: 3 }, "学长的总结让你少走弯路。", "学习+ 3"],
   ["挑有用的，其余送人", { knowledge: 1, support: 2 }, "你把资料分给了同学。", "学习+ 社交"],
   ["堆在角落", { knowledge: 0 }, "资料最后落了灰。", "——"]]);
L("📚 学习", "🌙", "深夜效率",
  "宿舍熄灯后，你发现晚上反而更静得下心。",
  [["躲在被窝里用手电背书", { knowledge: 2, sleep: -3 }, "记住了不少，但睡眠不足。", "学习+ 熬夜"],
   ["好好睡觉，明天早起背", { sleep: 2, knowledge: 1 }, "早起头脑果然清醒。", "睡眠+ 学习+"],
   ["和室友聊天", { support: 2, sleep: -1 }, "聊到深夜，感情变好了。", "社交+"]]);

/* ─────────────── 🗣️ 社交（17） ─────────────── */
L("🗣️ 社交", "👋", "新同学",
  "班里来了个转学生，一个人坐在位置上。",
  [["主动过去搭话", { support: 2, charm: 2 }, "你们很快成了朋友。", "社交+"],
   ["递张纸条欢迎", { support: 1 }, "对方冲你笑了。", "社交+"],
   ["等对方先来", { support: 0 }, "转学生看起来有点孤单。", "——"]]);
L("🗣️ 社交", "🗣️", "小组作业",
  "老师把你和几个不太熟的同学分到一组。",
  [["主动承担协调", { support: 2, influence: 2, charm: 1 }, "小组配合得很好，你被认可。", "社交+ 影响力+"],
   ["做好自己那部分", { support: 1 }, "你按时完成了任务。", "社交+"],
   ["搭便车", { support: -1, mood: -1 }, "组员对你有点意见。", "社交-"]]);
L("🗣️ 社交", "🎉", "同学的生日",
  "同学生日，在班里发糖，也邀请你周末聚会。",
  [["准备一份小礼物", { support: 3, charm: 2, money: -20 }, "对方很惊喜，你们关系更近。", "社交+ 金钱-"],
   ["口头祝福", { support: 1 }, "你的祝福对方收下了。", "社交+"],
   ["婉拒聚会", { support: -1 }, "你错过了融入集体的机会。", "社交-"]]);
L("🗣️ 社交", "🤝", "化解矛盾",
  "两个好朋友因为一点小事吵架，都来拉你站队。",
  [["帮他们把话说开", { support: 3, influence: 2, charm: 1 }, "他们和好，都很感谢你。", "社交+ 影响力+"],
   ["谁也不帮", { support: 0 }, "你保持了中立。", "——"],
   ["偏袒其中一方", { support: 1, support: -1 }, "一个朋友高兴，一个疏远。", "看情况"]]);
L("🗣️ 社交", "🎤", "班会发言",
  "班会主题是“我的梦想”，轮到你上台。",
  [["真诚地讲出梦想", { charm: 2, support: 2, mood: 1 }, "你的真诚打动了同学。", "魅力+ 社交+"],
   ["讲个段子活跃气氛", { charm: 2, mood: 2 }, "全班笑翻了。", "魅力+ 心情+"],
   ["紧张地念稿子", { support: 0 }, "总算讲完了。", "——"]]);
L("🗣️ 社交", "🧋", "拼单奶茶",
  "大家在群里拼单奶茶，还差一个人。",
  [["加入拼单", { support: 2, mood: 2, money: -12 }, "和大家一起喝奶茶很开心。", "社交+ 金钱-"],
   ["不参加", { money: 0 }, "你决定省下这笔钱。", "——"]]);
L("🗣️ 社交", "🙋", "帮忙搬书",
  "课代表一个人抱着一摞练习册很吃力。",
  [["上前帮忙", { support: 2, charm: 1, fitness: 1 }, "同学连声道谢。", "社交+ 体力+"],
   ["假装没看见", { support: -1 }, "你低头看起了书。", "社交-"]]);
L("🗣️ 社交", "😄", "融入圈子",
  "午饭时，一群同学聊得热闹，你端着餐盘站在旁边。",
  [["自然地坐下加入话题", { support: 2, charm: 2 }, "你很快和大家聊成一片。", "社交+"],
   ["找个安静的位置", { mood: 1, support: -1 }, "你更喜欢一个人吃饭。", "心情+ 社交-"]]);
L("🗣️ 社交", "📣", "竞选班委",
  "班委选举，朋友鼓动你上台试试。",
  [["上台竞选", { influence: 3, support: 2, charm: 2 }, "你当选了，责任感也来了。", "影响力+ 社交+"],
   ["帮朋友拉票", { support: 2, influence: 1 }, "朋友当选，很感激你。", "社交+"],
   ["不参加", { support: 0 }, "你对这些没兴趣。", "——"]]);
L("🗣️ 社交", "🤔", "被人误会",
  "有人传你说了某同学的坏话，对方看你眼神不对。",
  [["当面解释清楚", { support: 2, charm: 1 }, "误会解开，对方道歉。", "社交+"],
   ["清者自清", { support: 0, mood: -1 }, "谣言过了一阵才散，你很憋屈。", "心情-"],
   ["也去说对方", { support: -2, mood: -1 }, "事情闹得更大了。", "社交-"]]);
L("🗣️ 社交", "🪑", "集体活动",
  "班级组织活动需要人牵头分组。",
  [["主动当组长", { influence: 3, support: 2 }, "你把组里安排得井井有条。", "影响力+"],
   ["服从安排", { support: 1 }, "活动顺利进行。", "社交+"],
   ["请假不参加", { support: -1 }, "你少了一次集体回忆。", "社交-"]]);
L("🗣️ 社交", "🫶", "安慰朋友",
  "好朋友因为考试没考好，在座位上抹眼泪。",
  [["陪在旁边安慰", { support: 3, charm: 2, mood: 1 }, "朋友靠在你肩上，慢慢好了。", "社交+"],
   ["递纸巾就好", { support: 1 }, "你不太会安慰人。", "社交+"],
   ["劝他别想太多", { mood: 1 }, "你的话有点生硬。", "心情+"]]);
L("🗣️ 社交", "🎁", "请客还人情",
  "上次你帮了大忙，同学非要请你吃东西。",
  [["大方接受", { support: 1, mood: 2 }, "边吃边聊，很愉快。", "心情+"],
   ["坚持 AA", { support: 2, charm: 1 }, "你不喜欢占人便宜。", "社交+ 魅力+"],
   ["让他改成下次帮忙", { support: 1, influence: 1 }, "你们约定以后互助。", "社交+"]]);
L("🗣️ 社交", "📱", "班级群",
  "班级群里在讨论一个问题，大家七嘴八舌。",
  [["认真给出你的看法", { support: 2, knowledge: 1, influence: 1 }, "你的回答被很多人认同。", "社交+ 学习+"],
   ["只围观不发言", { support: 0 }, "你看着消息不断刷新。", "——"],
   ["发表情包", { charm: 1, mood: 2 }, "群里被你逗乐了。", "魅力+ 心情+"]]);
L("🗣️ 社交", "🧑‍🤝‍🧑", "交到知心朋友",
  "最近有个同学和你特别聊得来。",
  [["敞开心扉深交", { support: 3, mood: 2 }, "你找到了可以说心里话的朋友。", "社交+ 心情+"],
   ["保持普通关系", { support: 1 }, "你习惯和人保持距离。", "社交+"]]);
L("🗣️ 社交", "🚪", "串宿舍",
  "晚上别的宿舍的同学来串门。",
  [["热情地加入聊天", { support: 2, mood: 2, sleep: -1 }, "大家聊到熄灯才散。", "社交+ 心情+"],
   ["客气地打个招呼", { support: 1 }, "你继续忙自己的事。", "社交+"],
   ["嫌吵去走廊", { support: -1, sleep: 1 }, "你想早点休息。", "睡眠+"]]);
L("🗣️ 社交", "📢", "广播投稿",
  "校园广播站征集点歌和加油稿。",
  [["给班级投稿加油", { support: 2, influence: 2, charm: 1 }, "广播里念到你的稿子，全班喝彩。", "社交+ 影响力+"],
   ["点一首喜欢的歌", { mood: 2, support: 1 }, "熟悉的歌在校园里响起来。", "心情+ 社交+"],
   ["不投稿", { support: 0 }, "你没什么想点的。", "——"]]);

/* ─────────────── 🏃 运动（17） ─────────────── */
L("🏃 运动", "🏃", "课间跑操",
  "今天天气好，大课间组织跑操。",
  [["认真跑完三圈", { fitness: 2, health: 2, support: 1 }, "出了一身汗，神清气爽。", "体力+ 健康+"],
   ["跟在队伍后面偷懒", { fitness: 1, mood: 1 }, "你走走跑跑混完了。", "体力+"],
   ["请假见习", { fitness: -1 }, "你在边上看了一节课。", "体力-"]]);
L("🏃 运动", "🏀", "球场缺人",
  "放学打球，几个同学三打三正好差一个。",
  [["上场打比赛", { fitness: 2, support: 2, charm: 1 }, "你投进好球，大家认你。", "体力+ 社交+"],
   ["当观众加油", { support: 1, mood: 1 }, "你在场边看得很投入。", "社交+ 心情+"],
   ["先回家", { support: 0 }, "你背起书包走了。", "——"]]);
L("🏃 运动", "🤸", "体测",
  "体育老师宣布这节课体测。",
  [["拼尽全力", { fitness: 2, health: 1, mood: 1 }, "成绩比上次进步不少。", "体力+ 健康+"],
   ["稳定发挥", { fitness: 1 }, "成绩中等，达标了。", "体力+"],
   ["找借口免测", { fitness: -1, support: -1 }, "老师看了你一眼，没说什么。", "体力-"]]);
L("🏃 运动", "🚲", "骑车上学",
  "今天你决定骑车上学，风从耳边吹过。",
  [["骑得快一点", { fitness: 2, mood: 2, health: 1 }, "到学校时精神抖擞。", "体力+ 心情+"],
   ["慢悠悠地骑", { fitness: 1, mood: 1 }, "你一路看风景到学校。", "体力+ 心情+"]]);
L("🏃 运动", "🤾", "接力赛",
  "运动会班级接力缺最后一棒。",
  [["毛遂自荐", { fitness: 2, support: 3, influence: 2, charm: 1 }, "你奋力冲刺，班级拿到名次。", "体力+ 社交+ 影响力+"],
   ["推荐跑得快的同学", { support: 1 }, "你为班级找到了合适人选。", "社交+"],
   ["不参加", { support: -1 }, "接力最后由别人顶上。", "社交-"]]);
L("🏃 运动", "🧘", "拉伸放松",
  "久坐一天，你浑身僵硬。",
  [["认真拉伸十分钟", { fitness: 1, health: 2, sleep: 1 }, "身体松开了，舒服多了。", "健康+ 体力+"],
   ["继续坐着", { health: -1 }, "你的腰背越来越酸。", "健康-"]]);
L("🏃 运动", "⚽", "足球友谊赛",
  "隔壁班下战书约一场足球。",
  [["上场拼一场", { fitness: 2, support: 2, mood: 1 }, "虽然累，但踢得酣畅淋漓。", "体力+ 社交+"],
   ["当啦啦队", { support: 1, mood: 1 }, "你和同学一起喊加油。", "社交+ 心情+"],
   ["不感兴趣", { support: 0 }, "你留在教室写作业。", "学习+"]]);
L("🏃 运动", "🏊", "游泳馆",
  "周末和同学去游泳馆。",
  [["游满一个小时", { fitness: 2, health: 2, charm: 1 }, "全身都练到了，很畅快。", "体力+ 健康+"],
   ["泡水纳凉", { fitness: 1, mood: 2 }, "你在水里玩得很开心。", "体力+ 心情+"],
   ["在岸边休息", { mood: 1 }, "你晒着太阳看大家游。", "心情+"]]);
L("🏃 运动", "🏸", "羽毛球",
  "课间，同学拉你去打羽毛球。",
  [["认真打几局", { fitness: 2, support: 1, mood: 1 }, "你接住一个好球，特别有成就感。", "体力+ 社交+"],
   ["随便打打", { fitness: 1, mood: 1 }, "你把球打得满天飞。", "体力+ 心情+"]]);
L("🏃 运动", "💪", "健身房",
  "学校健身房没什么人，器械空着。",
  [["系统练一组", { fitness: 3, health: 1, sleep: -1 }, "练完很累，但感觉变强了。", "体力+ 3"],
   ["试试器械就走", { fitness: 1 }, "你活动了一下身体。", "体力+"],
   ["不运动", { fitness: 0, mood: 1 }, "你决定去吃点东西。", "心情+"]]);
L("🏃 运动", "🥅", "篮球投篮赛",
  "球场有个投篮比赛，连进五球有奖励。",
  [["挑战自己", { fitness: 2, money: 15, charm: 1 }, "你居然连进五球，赢了奖励。", "体力+ 金钱+"],
   ["投着玩", { fitness: 1, mood: 1 }, "你投了几个，玩得开心。", "体力+ 心情+"],
   ["不参加", { support: 0 }, "你把机会让给别人。", "——"]]);
L("🏃 运动", "🏔️", "登山远足",
  "周末班级组织去近郊登山。",
  [["坚持爬到山顶", { fitness: 2, health: 2, support: 2, charm: 1 }, "山顶视野开阔，你帮同学拍照。", "体力+ 社交+"],
   ["爬到一半休息", { fitness: 1, mood: 1 }, "你在半山腰看风景。", "体力+ 心情+"],
   ["请假不去", { support: -1 }, "你错过了这次集体活动。", "社交-"]]);
L("🏃 运动", "🤾‍♂️", "跳绳",
  "体育课练习跳绳，一分钟计数。",
  [["挑战自己的记录", { fitness: 2, support: 1 }, "你比上次多跳了二十个。", "体力+ 社交+"],
   ["慢慢跳", { fitness: 1 }, "你完成了练习量。", "体力+"],
   ["总绊绳", { fitness: 0, mood: -1 }, "你越急越跳不好。", "心情-"]]);
L("🏃 运动", "🚶", "饭后散步",
  "晚饭吃多了，你在操场慢慢走。",
  [["走两圈消食", { fitness: 1, health: 2, sleep: 1 }, "走走很舒服，回去好睡觉。", "健康+ 体力+"],
   ["叫上朋友一起", { fitness: 1, support: 2 }, "边散步边聊天很惬意。", "体力+ 社交+"],
   ["直接回宿舍", { sleep: 1 }, "你想早点躺下。", "睡眠+"]]);
L("🏃 运动", "🏓", "乒乓球",
  "乒乓球台空着，同学拿着球拍冲你招手。",
  [["来一局", { fitness: 2, support: 1, mood: 1 }, "你抽了几个好球，打得过瘾。", "体力+ 社交+"],
   ["不会打，学学", { fitness: 1, support: 1 }, "同学耐心教你基本动作。", "体力+ 社交+"],
   ["当观众", { support: 1 }, "你在旁边看他们打。", "社交+"]]);
L("🏃 运动", "🌅", "晨跑",
  "你起了个大早，操场空气清新。",
  [["跑三圈再上课", { fitness: 2, health: 2, mood: 2 }, "晨跑让你一整天都精神。", "体力+ 健康+ 心情+"],
   ["走一圈就回", { fitness: 1, health: 1 }, "你呼吸了新鲜空气。", "体力+ 健康+"],
   ["回去再睡会", { sleep: 2, fitness: -1 }, "你抵不过困意。", "睡眠+"]]);
L("🏃 运动", "🤕", "运动受伤",
  "打球时你不小心扭了一下脚踝。",
  [["去医务室处理", { health: 1, money: -10, fitness: -1 }, "老师给你冰敷包扎，休息几天。", "健康+ 金钱-"],
   ["咬牙坚持", { fitness: -1, health: -2, mood: -1 }, "脚踝肿了起来，你后悔了。", "健康-"],
   ["找同学扶着休息", { health: 0, support: 1 }, "同学照顾你，还帮你打饭。", "社交+"]]);

/* ─────────────── 🎮 休闲（17） ─────────────── */
L("🎮 休闲", "🎮", "游戏时间",
  "写完作业，你难得有空闲。",
  [["打一局游戏", { mood: 3, sleep: -2, knowledge: -1 }, "你放松了，也玩得忘了时间。", "心情+ 熬夜"],
   ["看喜欢的视频", { mood: 2, sleep: -1 }, "你刷到很晚，笑出了声。", "心情+ 熬夜"],
   ["早点睡", { sleep: 3, health: 1 }, "难得睡个好觉。", "睡眠+ 健康+"]]);
L("🎮 休闲", "🎧", "听歌",
  "你戴上耳机，随机到一首喜欢的歌。",
  [["单曲循环", { mood: 3, charm: 1 }, "音乐让你心情平复下来。", "心情+"],
   ["跟着哼", { mood: 2, support: 1 }, "室友夸你唱歌好听。", "心情+ 社交+"],
   ["边听边写作业", { knowledge: 1, mood: 1 }, "有音乐陪伴，写作业也没那么枯燥。", "学习+ 心情+"]]);
L("🎮 休闲", "🍜", "深夜食堂",
  "晚自习后你饿了，食堂还有夜宵。",
  [["来一碗热乎的", { mood: 2, health: 1, money: -10 }, "热乎乎的夜宵很治愈。", "心情+ 金钱-"],
   ["忍着回去睡", { sleep: 1, health: -1 }, "你饿着肚子睡着了。", "睡眠+ 健康-"],
   ["吃点零食", { mood: 1, money: -5 }, "你翻出包里的零食。", "心情+ 金钱-"]]);
L("🎮 休闲", "📷", "拍照",
  "校园里今天的光线特别好看。",
  [["拍下来记录", { charm: 2, mood: 2 }, "你拍了一组很满意的照片。", "魅力+ 心情+"],
   ["发朋友圈", { mood: 2, support: 1, charm: 1 }, "同学纷纷点赞。", "心情+ 社交+"],
   ["单纯欣赏", { mood: 1 }, "你把美景记在心里。", "心情+"]]);
L("🎮 休闲", "🛍️", "逛小卖部",
  "课间，小卖部挤满了人。",
  [["买点零食饮料", { mood: 2, money: -12 }, "你抱着零食心满意足。", "心情+ 金钱-"],
   ["只逛逛", { mood: 1 }, "你过过眼瘾就走了。", "心情+"],
   ["买瓶水", { health: 1, money: -3 }, "你补充了水分。", "健康+ 金钱-"]]);
L("🎮 休闲", "📚", "课外书",
  "你最近在看一本小说，看到入迷。",
  [["一口气读完", { mood: 3, knowledge: 1, sleep: -2 }, "故事很精彩，你熬夜看完了。", "心情+ 学习+ 熬夜"],
   ["每天读一点", { mood: 2, knowledge: 1 }, "你慢慢享受这个故事。", "心情+ 学习+"]]);
L("🎮 休闲", "☕", "咖啡",
  "下午第一节课你困得不行。",
  [["来杯咖啡提神", { sleep: -2, knowledge: 1, money: -8 }, "咖啡起效，你清醒了。", "学习+ 金钱-"],
   ["趴五分钟", { sleep: 2, knowledge: -1 }, "你眯了一会儿，漏了开头。", "睡眠+ 学习-"],
   ["硬撑着听课", { knowledge: 1, sleep: 1 }, "你强打精神听完。", "学习+ 困意+"]]);
L("🎮 休闲", "🎬", "看电影",
  "周末和同学约了看一场电影。",
  [["认真看完", { mood: 3, support: 1, money: -30 }, "电影很精彩，你们聊了一路。", "心情+ 社交+ 金钱-"],
   ["买爆米花", { mood: 2, money: -15 }, "看电影配爆米花最幸福。", "心情+ 金钱-"],
   ["改约别的", { support: 1 }, "你们临时换了计划。", "社交+"]]);
L("🎮 休闲", "🧩", "拼图/手工",
  "你翻出一盒没拼完的拼图。",
  [["坐下来慢慢拼", { mood: 2, knowledge: 1, charm: 1 }, "专注的时光让你很平静。", "心情+ 魅力+"],
   ["收起来", { mood: 0 }, "你暂时没有耐心。", "——"]]);
L("🎮 休闲", "🎨", "随手涂鸦",
  "你在草稿本边缘随手画了起来。",
  [["画一幅小画", { mood: 2, charm: 1, knowledge: 1 }, "你意外地画得不错。", "心情+ 魅力+"],
   ["画同桌的表情包", { mood: 2, support: 1 }, "同桌被你逗笑了。", "心情+ 社交+"],
   ["不画了", { mood: 1 }, "你把本子合上。", "心情+"]]);
L("🎮 休闲", "🛌", "赖床",
  "周末早上，你难得不用早起。",
  [["舒舒服服赖到中午", { sleep: 3, mood: 2, knowledge: -1 }, "你睡到自然醒，元气满满。", "睡眠+ 心情+ 学习-"],
   ["早起做点有意义的事", { knowledge: 1, fitness: 1 }, "你度过了充实的早晨。", "学习+ 体力+"],
   ["在床上玩手机", { mood: 2, sleep: -1 }, "你刷手机刷到午饭。", "心情+"]]);
L("🎮 休闲", "🎵", "音乐教室",
  "放学路过音乐教室，里面没人。",
  [["进去弹两下", { mood: 2, charm: 2, knowledge: 1 }, "你弹了一段会的曲子，心情很好。", "心情+ 魅力+"],
   ["在门口听一会", { mood: 1 }, "你不知道里面有人，正弹得投入。", "心情+"],
   ["不打扰，离开", { mood: 0 }, "你轻轻走开了。", "——"]]);
L("🎮 休闲", "🧁", "烘焙",
  "周末你在家想做点甜点。",
  [["照着方子做", { mood: 2, charm: 2, knowledge: 1 }, "第一次做，居然成功了。", "心情+ 魅力+"],
   ["翻车了", { mood: 0, money: -10 }, "成品和想象差太远，你笑了。", "金钱-"],
   ["点外卖甜品", { mood: 2, money: -20 }, "你决定不折腾自己。", "心情+ 金钱-"]]);
L("🎮 休闲", "🌌", "看星星",
  "晚上天台很安静，夜空很清楚。",
  [["一个人看会儿星星", { mood: 2, sleep: 1 }, "你的心慢慢静下来。", "心情+ 睡眠+"],
   ["叫朋友一起来", { mood: 2, support: 2 }, "你们指着星星聊了很多。", "心情+ 社交+"],
   ["回去睡觉", { sleep: 2 }, "明天还要早起。", "睡眠+"]]);
L("🎮 休闲", "🎁", "拆快递",
  "你之前网购的东西到了。",
  [["开心地拆开", { mood: 3, money: -15 }, "是你期待很久的东西。", "心情+ 金钱-"],
   ["发现买错了", { mood: -1, money: -10 }, "你申请退货，有点麻烦。", "心情- 金钱-"],
   ["送人", { support: 2, charm: 1 }, "你把东西送给了喜欢它的朋友。", "社交+"]]);
L("🎮 休闲", "🍵", "泡茶",
  "你难得安静下来，泡了一杯茶。",
  [["慢慢喝，放空", { mood: 2, health: 1, sleep: 1 }, "温热的茶让你放松下来。", "心情+ 健康+"],
   ["边喝茶边看书", { knowledge: 1, mood: 1 }, "你度过了安静的午后。", "学习+ 心情+"],
   ["泡了忘了喝", { mood: 0 }, "茶凉了，你才想起来。", "——"]]);
L("🎮 休闲", "🎢", "解压玩具",
  "压力大的时候，你需要放松。",
  [["捏一捏解压玩具", { mood: 2, sleep: 1 }, "你的焦虑缓解了一些。", "心情+ 睡眠+"],
   ["深呼吸", { mood: 2, health: 1 }, "你调整了一下呼吸。", "心情+ 健康+"],
   ["继续焦虑", { mood: -1, sleep: -1 }, "你越想越睡不着。", "心情- 睡眠-"]]);

/* ─────────────── ✨ 奇遇（16） ─────────────── */
L("✨ 奇遇", "🐱", "流浪猫",
  "你在校园角落遇到一只流浪猫，它冲你叫。",
  [["蹲下来喂它", { charm: 2, mood: 3, money: -5 }, "它蹭了蹭你的手，你心都化了。", "心情+ 魅力+"],
   ["轻轻摸一下", { mood: 1 }, "它没有躲开。", "心情+"],
   ["怕猫，走开", { mood: 0 }, "你绕着走了。", "——"]]);
L("✨ 奇遇", "💰", "地上的钱",
  "走廊上你捡到一个钱包，里面有一些现金和证件。",
  [["交到政教处", { support: 3, charm: 2, influence: 1 }, "失主找到后专门来感谢你。", "社交+ 魅力+"],
   ["原地等失主", { support: 2, mood: 2 }, "失主很着急，你物归原主。", "社交+ 心情+"],
   ["留下现金", { money: 50, mood: -3, support: -2 }, "你心里一直不安。", "金钱+ 心情-"]]);
L("✨ 奇遇", "📮", "陌生人的信",
  "图书馆的书里夹着一张没有署名的纸条。",
  [["好奇地读", { mood: 2, knowledge: 1 }, "纸条上写着一句温柔的话。", "心情+ 学习+"],
   ["夹回书里", { mood: 1 }, "你把秘密留给了下一个人。", "心情+"],
   ["照着上面做", { charm: 1, support: 1 }, "你在约定的地方放了回条。", "魅力+ 社交+"]]);
L("✨ 奇遇", "🌈", "雨后彩虹",
  "一场雨刚停，天边出现一道彩虹。",
  [["停下来欣赏", { mood: 3, charm: 1 }, "你的心情一下子明亮起来。", "心情+ 魅力+"],
   ["拍下来发朋友圈", { mood: 2, support: 2 }, "很多同学评论说也看到了。", "心情+ 社交+"],
   ["匆匆赶路", { mood: 1 }, "你只瞥了一眼。", "心情+"]]);
L("✨ 奇遇", "🔑", "失物招领",
  "你在操场捡到一串钥匙。",
  [["交给广播室", { support: 2, charm: 2 }, "广播后失主找到了你。", "社交+ 魅力+"],
   ["放在失物招领处", { support: 1 }, "你登记了信息就走了。", "社交+"],
   ["顺手收着", { mood: -1 }, "你一直忘了还，有点占地方。", "心情-"]]);
L("✨ 奇遇", "🎈", "气球",
  "校门口有活动发气球，一个飘到你面前。",
  [["接下来玩", { mood: 2, charm: 1 }, "你拿着气球走了一路，心情很好。", "心情+ 魅力+"],
   ["送给路过的小朋友", { support: 2, charm: 2 }, "小朋友开心地笑了。", "社交+ 魅力+"],
   ["不接", { mood: 0 }, "你摆摆手走开了。", "——"]]);
L("✨ 奇遇", "📻", "老歌",
  "广播里随机放了一首很老的歌。",
  [["静静听着", { mood: 3, sleep: 1 }, "歌声勾起你一些温柔的回忆。", "心情+ 睡眠+"],
   ["和身边人聊这首歌", { support: 2, mood: 2 }, "原来大家都听过。", "社交+ 心情+"],
   ["没什么感觉", { mood: 1 }, "你继续走自己的路。", "心情+"]]);
L("✨ 奇遇", "🍀", "四叶草",
  "你在草丛里发现一株四叶草。",
  [["小心地夹进书里", { mood: 2, charm: 1 }, "你觉得今天会有好运。", "心情+ 魅力+"],
   ["送给好朋友", { support: 2, mood: 1 }, "你把好运分享了出去。", "社交+ 心情+"],
   ["不相信这些", { mood: 0 }, "你看了看就走开了。", "——"]]);
L("✨ 奇遇", "🕊️", "校园里的鸟",
  "一只不知名的鸟落在你窗前，不怕人。",
  [["安静地观察", { mood: 2, knowledge: 1 }, "你和它对视了好一会儿。", "心情+ 学习+"],
   ["喂点面包屑", { mood: 2, charm: 1 }, "它啄了两口，飞走了。", "心情+ 魅力+"],
   ["把它吓跑", { mood: -1 }, "它扑棱着翅膀飞走了。", "心情-"]]);
L("✨ 奇遇", "🎁", "神秘礼物",
  "你课桌里不知谁放了一颗糖和一张纸条。",
  [["找机会问是谁", { support: 2, mood: 2 }, "你发现是一个一直没说过话的同学。", "社交+ 心情+"],
   ["收下，也放一颗回礼", { support: 2, charm: 1 }, "你们就这样悄悄成了朋友。", "社交+ 魅力+"],
   ["不吃陌生人的东西", { mood: 1 }, "你把糖放在了桌角。", "心情+"]]);
L("✨ 奇遇", "🌠", "流星",
  "晚上有人在群里喊有流星，你跑到天台。",
  [["许一个愿望", { mood: 3, charm: 1, sleep: -1 }, "流星划过，你认真地许了愿。", "心情+ 魅力+"],
   ["和大家一起看", { support: 2, mood: 2 }, "你们挤在天台，又冷又兴奋。", "社交+ 心情+"],
   ["不去，睡觉", { sleep: 2 }, "你错过了流星。", "睡眠+"]]);
L("✨ 奇遇", "📔", "旧日记本",
  "你在储物柜深处发现一本别人的旧日记本。",
  [["不看，交出去", { support: 2, charm: 2 }, "你尊重了别人的隐私。", "社交+ 魅力+"],
   ["忍不住翻两页", { mood: 1, knowledge: 1 }, "里面写着青涩的心事。", "心情+ 学习+"],
   ["收好放着", { mood: 0 }, "你打算以后找到失主。", "——"]]);
L("✨ 奇遇", "🎪", "社团招新",
  "百团大战，各个社团都在招新。",
  [["挑一个感兴趣的加入", { support: 2, charm: 2, mood: 2 }, "你开始了全新的社团生活。", "社交+ 魅力+"],
   ["多逛几个看看", { support: 1, knowledge: 1 }, "你了解了很多社团。", "社交+ 学习+"],
   ["都不参加", { support: 0, knowledge: 1 }, "你想专心学习。", "学习+"]]);
L("✨ 奇遇", "🔔", "下课铃",
  "最后一节课，你盯着窗外等下课。",
  [["铃声一响就冲出去", { mood: 2, fitness: 1 }, "你第一个冲出教室。", "心情+ 体力+"],
   ["整理好东西再走", { charm: 1, support: 1 }, "你总是从容不迫。", "魅力+ 社交+"],
   ["留下来问老师问题", { knowledge: 2, support: 1 }, "你多学了一点。", "学习+ 社交+"]]);
L("✨ 奇遇", "🌦️", "天气突变",
  "早上还晴着，中午忽然下起太阳雨。",
  [["在雨里走一段", { mood: 3, charm: 1, health: -1 }, "太阳雨很奇妙，你淋了一点。", "心情+ 魅力+"],
   ["找地方躲雨", { mood: 1 }, "你等雨停再走。", "心情+"],
   ["趁机拍照", { mood: 2, charm: 1 }, "你拍到了阳光穿过雨丝。", "心情+ 魅力+"]]);
L("✨ 奇遇", "🧭", "迷路",
  "你在教学楼绕了几圈，找不到要去的教室。",
  [["找同学问路", { support: 1, knowledge: 1 }, "同学热心地把你带过去。", "社交+ 学习+"],
   ["自己看指示牌", { knowledge: 1, mood: 1 }, "你终于弄明白了布局。", "学习+ 心情+"],
   ["继续乱转", { mood: -1, sleep: -1 }, "你绕了很久，有点烦躁。", "心情-"]]);

/* ─────────────── 💗 情感（16） ─────────────── */
L("💗 情感", "💌", "匿名告白",
  "你在课桌里发现一封没有署名的告白信。",
  [["想办法找出是谁", { support: 2, charm: 2, mood: 2 }, "你发现是一个安静关注你的人。", "社交+ 心情+"],
   ["温柔地回一张纸条", { support: 2, charm: 2 }, "你不想让对方难堪。", "社交+ 魅力+"],
   ["假装没看见", { mood: 1, support: -1 }, "你暂时没有恋爱的心思。", "心情+ 社交-"]]);
L("💗 情感", "👀", "目光相遇",
  "课间，你抬头发现有人在看你，四目相对。",
  [["冲对方微笑", { charm: 3, support: 2 }, "对方有点不好意思地低下头。", "魅力+ 社交+"],
   ["移开视线", { mood: 1 }, "你继续看自己的书。", "心情+"],
   ["主动走过去", { charm: 2, support: 2, mood: 1 }, "你们开始聊了起来。", "魅力+ 社交+"]]);
L("💗 情感", "🌹", "情人节",
  "情人节前后，班里氛围微妙。",
  [["给在意的人准备巧克力", { support: 2, charm: 2, money: -20 }, "对方收到，脸红着道谢。", "社交+ 魅力+"],
   ["和好朋友互送", { support: 2, mood: 2 }, "你们决定不羡慕情侣。", "社交+ 心情+"],
   ["不过这个节", { mood: 1, knowledge: 1 }, "你把心思放在学习上。", "心情+ 学习+"]]);
L("💗 情感", "🫂", "一个拥抱",
  "你最近很丧，好朋友看出来了。",
  [["接受对方的拥抱", { mood: 3, support: 2 }, "一个拥抱让你好了很多。", "心情+ 社交+"],
   ["逞强说没事", { mood: 1, support: 1 }, "对方没有追问，只是陪着你。", "心情+ 社交+"],
   ["想一个人待着", { mood: 1, sleep: 1 }, "你需要一点独处的时间。", "心情+ 睡眠+"]]);
L("💗 情感", "💬", "深夜聊天",
  "晚上有人发消息问你睡了没。",
  [["陪对方聊到深夜", { support: 2, mood: 2, sleep: -2 }, "你们越聊越投机。", "社交+ 心情+ 熬夜"],
   ["聊两句就睡", { support: 1, sleep: 1 }, "你道了晚安。", "社交+ 睡眠+"],
   ["已读不回", { support: -1 }, "你困得不想打字。", "社交-"]]);
L("💗 情感", "🎀", "小礼物",
  "有人送你一个不贵但很用心的小礼物。",
  [["开心地收下", { mood: 3, support: 2 }, "你能感到对方的心意。", "心情+ 社交+"],
   ["回一份礼", { support: 2, charm: 1, money: -15 }, "你们礼尚往来。", "社交+ 魅力+"],
   ["婉拒", { support: -1, mood: 1 }, "你不想让对方误会。", "心情+ 社交-"]]);
L("💗 情感", "🌙", "想念",
  "放假时，你莫名想起一个人。",
  [["主动发消息", { support: 2, mood: 2, charm: 1 }, "你们聊了一整天。", "社交+ 心情+"],
   ["写在日记里", { mood: 1, knowledge: 1 }, "你把心事藏了起来。", "心情+ 学习+"],
   ["约出来见面", { mood: 3, support: 2, money: -20 }, "你们约在熟悉的地方见面。", "心情+ 社交+"]]);
L("💗 情感", "🤍", "被发好人卡",
  "你鼓起勇气表达好感，对方却很为难。",
  [["体面地接受", { charm: 2, support: 1, mood: -1 }, "你没有纠缠，反而让对方高看一眼。", "魅力+ 心情-"],
   ["难过一阵", { mood: -3, sleep: -1 }, "你需要时间消化。", "心情- 睡眠-"],
   ["继续做朋友", { support: 1, mood: 1 }, "你们没有因此尴尬。", "社交+ 心情+"]]);
L("💗 情感", "💞", "心动信号",
  "最近你发现一个人总在你需要时出现。",
  [["认真留意TA", { charm: 2, support: 2, mood: 2 }, "你开始期待每一次相遇。", "魅力+ 社交+"],
   ["假装没察觉", { mood: 1, support: -1 }, "你还没准备好。", "心情+ 社交-"],
   ["主动靠近", { charm: 2, support: 2, mood: 1 }, "你们的关系微妙起来。", "魅力+ 社交+"]]);
L("💗 情感", "🎵", "同一首歌",
  "你发现某个人歌单里有很多你也喜欢的歌。",
  [["聊音乐聊到很晚", { support: 2, mood: 2, charm: 1 }, "你们像找到了知音。", "社交+ 心情+"],
   ["分享你的歌单", { support: 2, charm: 1 }, "你们互相安利了很多歌。", "社交+ 魅力+"],
   ["只是巧合", { mood: 1 }, "你没多想。", "心情+"]]);
L("💗 情感", "🪟", "窗边的人",
  "你常看到一个人独自望着窗外发呆。",
  [["走过去陪TA", { support: 2, mood: 2, charm: 1 }, "TA转头看你，露出一点笑。", "社交+ 心情+"],
   ["不打扰", { mood: 1 }, "你觉得TA可能想安静。", "心情+"],
   ["递张纸条", { support: 1, charm: 1 }, "纸条上写着一句关心的话。", "社交+ 魅力+"]]);
L("💗 情感", "💗", "双向奔赴",
  "你隐约感到，某个人对你也有好感。",
  [["勇敢地表达", { charm: 2, support: 3, mood: 3 }, "原来你们都在等对方先开口。", "魅力+ 心情+"],
   ["再等一等", { mood: 1, support: 1 }, "你想确认得更清楚。", "心情+ 社交+"],
   ["专注当下", { knowledge: 1, mood: 1 }, "你不想让感情分心。", "学习+ 心情+"]]);
L("💗 情感", "🧣", "天冷了",
  "降温了，你发现有个人穿得很单薄。",
  [["借TA外套/围巾", { support: 2, charm: 2, health: -1 }, "TA裹着你的外套，红了脸。", "社交+ 魅力+"],
   ["提醒TA多穿点", { support: 1, health: 1 }, "你的关心TA记在心里。", "社交+ 健康+"],
   ["不关我事", { support: -1 }, "你没说什么。", "社交-"]]);
L("💗 情感", "📸", "合照",
  "活动时，有人提议大家一起拍张合照。",
  [["自然地站到TA旁边", { charm: 2, support: 2, mood: 2 }, "照片里你们靠得很近。", "魅力+ 社交+"],
   ["帮大家拍照", { support: 1, charm: 1 }, "你记录下了这一刻。", "社交+ 魅力+"],
   ["躲开镜头", { support: -1, mood: 1 }, "你不太喜欢拍照。", "心情+ 社交-"]]);
L("💗 情感", "🌻", "鼓励",
  "一个人对自己很没信心，总说自己不行。",
  [["认真地肯定TA", { support: 3, charm: 2, mood: 1 }, "你帮TA看到了自己的闪光点。", "社交+ 魅力+"],
   ["陪TA一起努力", { support: 2, knowledge: 1 }, "你们约定一起进步。", "社交+ 学习+"],
   ["说句加油", { support: 1 }, "你的话虽短，TA听进去了。", "社交+"]]);
L("💗 情感", "💠", "心照不宣",
  "你和某个人之间，有一种说不清的默契。",
  [["珍惜这份默契", { charm: 2, support: 2, mood: 2 }, "一个眼神你们就懂彼此。", "魅力+ 社交+"],
   ["挑明了问", { support: 1, charm: 1, mood: 1 }, "你们把话说开了。", "社交+ 心情+"],
   ["顺其自然", { mood: 1, support: 1 }, "你相信时间会给出答案。", "心情+ 社交+"]]);

/* ══════════════════════════════════════════════════════════
   模块十四：勤工俭学（打工系统）
   6 种兼职，按属性要求/体力消耗/薪资不同；每天 1 班，
   表现有随机波动，影响当日收入与心情。
   ══════════════════════════════════════════════════════════ */
var X56Jobs = {
  KEY: "xz56_jobs_v1",
  jobs: [
    {
      id: "library", icon: "📚", name: "图书馆助理",
      req: { knowledge: 30 }, energy: 12, base: 45, scale: "knowledge",
      desc: "整理书架、登记借阅、给同学找书。安静、体面。",
      skill: "细心"
    },
    {
      id: "canteen", icon: "🍱", name: "食堂帮工",
      req: { fitness: 30 }, energy: 20, base: 55, scale: "fitness",
      desc: "收盘子、打饭、后厨打下手。累是累点，包一顿饭。",
      skill: "麻利", meals: true
    },
    {
      id: "store", icon: "🏪", name: "便利店店员",
      req: { charm: 25 }, energy: 15, base: 60, scale: "charm",
      desc: "收银、理货、和客人打招呼。晚班有补贴。",
      skill: "亲和"
    },
    {
      id: "tutor", icon: "✏️", name: "家教",
      req: { knowledge: 60 }, energy: 14, base: 90, scale: "knowledge",
      desc: "给初中生补课。时薪高，要求学习好。",
      skill: "讲解"
    },
    {
      id: "flyer", icon: "📰", name: "发传单",
      req: {}, energy: 18, base: 40, scale: "charm",
      desc: "站在校门口递传单，风吹日晒。门槛低。",
      skill: "脸皮厚"
    },
    {
      id: "cafe", icon: "☕", name: "奶茶店兼职",
      req: { charm: 35, knowledge: 30 }, energy: 16, base: 70, scale: "charm",
      desc: "做奶茶、记配方、收银。同学都爱来。",
      skill: "手巧"
    }
  ],
  /* 随机班次结果 */
  outcomes: [
    { p: 0.2, mult: 1.3, mood: 3, reply: "今天特别顺利，老板夸你，还多给了小费。" },
    { p: 0.4, mult: 1.0, mood: 1, reply: "平平常常的一班，活儿干完了。" },
    { p: 0.25, mult: 0.9, mood: 0, reply: "有点忙乱，差点出错，还好补救了。" },
    { p: 0.15, mult: 0.7, mood: -2, reply: "遇到难缠的客人/打翻了东西，有点倒霉。" }
  ],
  load: function () {
    try {
      var raw = storageGet(this.KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { day: -1, worked: false, shifts: 0, earned: 0, last: "" };
  },
  save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },

  meets: function (job) {
    var G = window.G;
    if (!G) return false;
    for (var k in job.req) {
      if ((typeof G[k] === "number" ? G[k] : 0) < job.req[k]) return false;
    }
    return true;
  },
  calcPay: function (job) {
    var G = window.G;
    var sv = typeof G[job.scale] === "number" ? G[job.scale] : 0;
    var bonus = Math.floor((sv - 30) * 0.4);
    if (bonus < 0) bonus = 0;
    return job.base + bonus;
  },
  pickOutcome: function () {
    var r = Math.random(), acc = 0;
    for (var i = 0; i < this.outcomes.length; i++) {
      acc += this.outcomes[i].p;
      if (r <= acc) return this.outcomes[i];
    }
    return this.outcomes[1];
  },
  work: function (id) {
    var G = window.G;
    if (!G) { toast("进入游戏后可打工"); return; }
    var d = this.load();
    if (d.day !== G.day) { d.day = G.day; d.worked = false; }
    if (d.worked) { toast("今天已经打过一班了，明天再来"); return; }
    var job = null;
    this.jobs.forEach(function (j) { if (j.id === id) job = j; });
    if (!job) return;
    if (!this.meets(job)) { toast("还不满足这份工作的要求"); return; }
    var out = this.pickOutcome();
    var pay = Math.round(this.calcPay(job) * out.mult);
    d.worked = true;
    d.shifts++;
    d.earned += pay;
    d.last = job.name;
    this.save(d);
    /* 结算 */
    G.money = (typeof G.money === "number" ? G.money : 0) + pay;
    G.fitness = (typeof G.fitness === "number" ? G.fitness : 0) - 4;
    G.mood = (typeof G.mood === "number" ? G.mood : 0) + out.mood;
    if (job.meals) G.health = (typeof G.health === "number" ? G.health : 0) + 2;
    if (typeof window.clampAll === "function") { try { window.clampAll(); } catch (e) {} }
    if (typeof window.upd === "function") { try { window.upd(); } catch (e) {} }
    var h = '<div class="job-result">' +
      '<div class="jr-icon">' + job.icon + '</div>' +
      '<div class="jr-title">' + job.name + ' · 下班</div>' +
      '<div class="jr-reply">' + out.reply + '</div>' +
      '<div class="jr-pay">💰 收入 +' + pay + " 元</div>" +
      '<div class="jr-stats">💪 体力消耗　' + (out.mood ? "🙂 心情 " + (out.mood > 0 ? "+" : "") + out.mood : "") + "</div>" +
      '<div class="jr-cum">累计打工 ' + d.shifts + " 班 · 累计收入 " + d.earned + " 元</div>" +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button></div>';
    modal(h);
    l(job.icon + " " + job.name + "，收入 +" + pay + " 元", "day");
  },

  panel: function () {
    var G = window.G;
    if (!G) { toast("进入游戏后可打工"); return; }
    var d = this.load();
    if (d.day !== G.day) { d.day = G.day; d.worked = false; }
    var self = this;
    var h = '<div class="jobs-panel"><h3>💼 勤工俭学</h3>' +
      '<div class="quote">每天可以打一班（课余/周末）。今天' +
      (d.worked ? '已经打过工了。' : '<b>还可以打工</b>。') +
      '<br>累计 ' + d.shifts + " 班 · 累计收入 " + d.earned + " 元</div>" +
      '<div id="jobList">' +
      this.jobs.map(function (j) {
        var ok = self.meets(j);
        var reqTxt = Object.keys(j.req).map(function (k) {
          var lb = { knowledge: "学习", fitness: "体力", charm: "魅力" }[k] || k;
          return lb + "≥" + j.req[k];
        }).join("　");
        return '<div class="job-card' + (ok ? "" : " locked") + '">' +
          '<div class="jc-head"><span class="jc-icon">' + j.icon + '</span>' +
          '<div class="jc-name">' + j.name +
          '<span class="jc-tag">' + j.skill + "</span></div>" +
          '<div class="jc-pay">💰 ' + self.calcPay(j) + " 元/班</div></div>" +
          '<div class="jc-desc">' + j.desc + "</div>" +
          '<div class="jc-foot"><span class="jc-req">' + (reqTxt || "无要求") +
          ' · 体力消耗 ' + j.energy + "</span>" +
          (ok ? '<button class="gbtn jc-work" data-id="' + j.id + '">开工</button>'
            : '<span class="jc-locked">条件不足</span>') + "</div></div>";
      }).join("") +
      "</div>" +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button></div>';
    modal(h);
    setTimeout(function () {
      $a("#modalbox .jc-work").forEach(function (b) {
        on(b, "click", function () { self.work(b.getAttribute("data-id")); });
      });
    }, 80);
  }
};
window.X56Jobs = X56Jobs;

/* ══════════════════════════════════════════════════════════
   模块十五：朋友圈扩充
   · 20 条额外 NPC 动态（让信息流更真实、更耐刷）
   · NPC 会给玩家的新动态点赞、评论（随新一天结算）
   · 玩家昵称自动取游戏姓名
   ══════════════════════════════════════════════════════════ */
var X56MomentsExtra = {
  npcNames: ["王老师", "林晚", "陈墨", "赵小雨", "周子航", "徐甜甜", "吴磊", "西子食堂"],
  /* 针对玩家内容的评论库（按图文类型） */
  commentPool: {
    generic: ["赞！", "哈哈哈哈", "可以可以", "牛啊", "羡慕了", "支持支持", "这也太会了", "前排！", "蹲一个后续", "我也想去", "你今天怎么这么优秀", "看完心情好了"],
    food: ["看饿了……", "报地址！", "这是哪个窗口？", "深夜放毒？", "看起来好好吃", "我也想吃", "食堂上新了吗", "给我留一口"],
    study: ["学霸带带我", "好卷，我也去学习", "优秀如你", "这题我会！", "笔记能借我吗", "向你学习", "我也在刷这套", "目标大学+1"],
    sport: ["可以啊！", "运动少年/少女", "下次带我一个", "好厉害", "这成绩我酸了", "球场见", "体测稳了", "你的体力哪来的"],
    mood: ["抱抱", "会好起来的", "加油呀", "我懂这种感觉", "明天又是新的一天", "请你喝奶茶", "你不是一个人", "记得开心"],
    photo: ["拍得真好", "出片了！", "这光影绝了", "什么相机拍的", "可以当壁纸", "构图很稳", "调色好看", "再来一组"]
  },

  /* 额外 NPC 动态 */
  extraFeed: function () {
    var E = [];
    function P(id, who, time, loc, text, imgs, likes, comments) {
      E.push({ id: id, who: who, time: time, loc: loc, text: text,
        imgs: imgs || [], likes: likes || [], comments: comments || [] });
    }
    P("x11", "wang", "3天前", "", "改完了这次的作业，整体不错。提醒大家：答题要有过程，只写结论不得分。错题请在本周内订正。", [],
      ["徐甜甜", "林晚", "吴磊"], [{ n: "吴磊", c: "好的老师，今晚就订正" }]);
    P("x12", "chen", "3天前", "操场", "运动会接力我们班一定要进前三！今天练了交接棒，配合越来越默契了。",
      [{ e: "🏅", g: 6 }, { e: "🤝", g: 2 }], ["吴磊", "周子航", "林晚"],
      [{ n: "吴磊", c: "接力最后一棒交给我，稳" }]);
    P("x13", "zhao", "4天前", "美术教室", "分享一组色卡练习。最近迷上了莫兰迪色系，低饱和度也太温柔了。",
      [{ e: "🎨", g: 4 }, { e: "🌈", g: 5 }, { e: "🖌️", g: 3 }],
      ["林晚", "王老师", "徐甜甜"], [{ n: "林晚", c: "颜色好治愈，能教我配色吗" }]);
    P("x14", "zhou", "4天前", "", "新赛季定个小目标：上王者！有人组队吗，我辅助/打野都行。", [],
      ["陈墨", "吴磊"], [{ n: "陈墨", c: "晚上八点，拉你" }, { n: "周子航", c: "回复陈墨：好嘞" }]);
    P("x15", "canteen", "5天前", "西子食堂", "天气转凉，食堂新增砂锅和麻辣烫窗口，暖胃又暖心。排队高峰建议错峰哦～",
      [{ e: "🍲", g: 1 }, { e: "🧋", g: 5 }, { e: "🥘", g: 2 }],
      ["林晚", "赵小雨", "陈墨", "周子航", "徐甜甜"], [{ n: "徐甜甜", c: "麻辣烫微辣，谢谢！" }]);
    P("x16", "xu", "5天前", "图书馆", "分享最近的错题整理方法：按知识点分类，旁边写错误原因。比抄十遍都管用。",
      [{ e: "📝", g: 1 }, { e: "📚", g: 5 }, { e: "✏️", g: 6 }],
      ["王老师", "林晚", "赵小雨", "吴磊"], [{ n: "王老师", c: "这个方法很好，值得全班推广" }]);
    P("x17", "lin", "6天前", "花园", "后花园的桂花开了，整条路都香。今天上课都忍不住走神想秋天的事。",
      [{ e: "🌸", g: 3 }, { e: "🌼", g: 6 }, { e: "🍂", g: 7 }],
      ["赵小雨", "徐甜甜", "王老师"], [{ n: "赵小雨", c: "好想去画桂花！午休带我去" }]);
    P("x18", "wu", "6天前", "操场", "篮球社招新！零基础也欢迎，每周二、四放学后训练。想加入的来球场找我。",
      [{ e: "🏀", g: 2 }, { e: "💪", g: 0 }],
      ["陈墨", "周子航", "吴磊"], [{ n: "周子航", c: "我报名！但我打得很菜" }, { n: "吴磊", c: "回复周子航：谁都是从零开始的" }]);
    P("x19", "radio", "7天前", "杭州西子实验学校", "【喜报】我校合唱团在区中学生艺术节中荣获金奖！向参与的同学和指导老师表示祝贺～",
      [], ["王老师", "林晚", "赵小雨", "陈墨", "徐甜甜", "吴磊"],
      [{ n: "赵小雨", c: "恭喜合唱团！舞台灯光太美了" }, { n: "林晚", c: "练了那么久，实至名归" }]);
    P("x20", "zhao", "7天前", "天台", "在天台画了张夕阳速写，五分钟抓住的光，比磨一晚上的更有感觉。",
      [{ e: "🌅", g: 6 }, { e: "🎨", g: 4 }],
      ["林晚", "王老师", "徐甜甜"], [{ n: "王老师", c: "速写的松动感很好，保留这张" }]);
    P("x21", "chen", "8天前", "", "体测终于全过了！肺活量差点没达标，建议大家平时多跑步，别像我临时抱佛脚。", [],
      ["吴磊", "周子航"], [{ n: "周子航", c: "我八百米还没底……" }, { n: "陈墨", c: "回复周子航：放学陪你练" }]);
    P("x22", "wang", "8天前", "", "下周单元小测，范围是第 3、4 单元。请大家合理安排周末，劳逸结合。", [],
      ["徐甜甜", "林晚", "陈墨", "吴磊", "赵小雨"], [{ n: "徐甜甜", c: "收到，周末好好复习" }]);
    P("x23", "lin", "9天前", "宿舍", "和室友一起把宿舍装扮成了喜欢的样子，贴上照片、挂上小灯串。住校生活也很有家的感觉。",
      [{ e: "💡", g: 5 }, { e: "🛏️", g: 7 }, { e: "🌙", g: 3 }],
      ["赵小雨", "徐甜甜"], [{ n: "徐甜甜", c: "好温馨！周末我也来布置" }]);
    P("x24", "zhou", "9天前", "", "推荐一个时间管理 App：番茄钟 + 白噪音。以前我总熬夜，现在学习效率高了不少（虽然游戏还是想玩）。",
      [], ["陈墨", "徐甜甜"], [{ n: "徐甜甜", c: "叫什么名字，我也下一个" }]);
    P("x25", "canteen", "10天前", "西子食堂", "光盘行动倡议：按需取餐，不够可加。今日剩餐量较上周下降啦，谢谢同学们配合！",
      [{ e: "🍱", g: 0 }, { e: "🥗", g: 2 }],
      ["王老师", "林晚", "陈墨"], [{ n: "林晚", c: "食堂阿姨手不抖了，分量很足" }]);
    P("x26", "xu", "10天前", "教室", "早读抽查背书我居然全对，原来每天早上坚持读二十分钟真的有用。坚持 > 天赋。",
      [{ e: "📖", g: 5 }, { e: "☀️", g: 6 }],
      ["王老师", "林晚", "赵小雨"], [{ n: "王老师", c: "好样的，坚持的力量" }]);
    P("x27", "wu", "11天前", "操场", "今天的晚霞和操场绝配，跑了五圈都不觉得累。运动真的会让人上瘾。",
      [{ e: "🌇", g: 6 }, { e: "🏃", g: 2 }],
      ["陈墨", "林晚", "周子航"], [{ n: "陈墨", c: "明早叫我，一起晨跑" }]);
    P("x28", "zhao", "11天前", "美术教室", "第一次尝试油画，调色盘比画布还精彩。松节油的味道有点上头，但是很喜欢。",
      [{ e: "🖼️", g: 4 }, { e: "🎨", g: 7 }],
      ["林晚", "王老师", "徐甜甜"], [{ n: "徐甜甜", c: "想看成品！画展安排上" }]);
    P("x29", "radio", "12天前", "杭州西子实验学校", "本周五下午开展「校园十佳歌手」比赛，地点礼堂，欢迎各班同学前往加油助威，现场有应援棒发放。",
      [], ["林晚", "赵小雨", "周子航", "徐甜甜"],
      [{ n: "周子航", c: "我报名了！求大家来听" }, { n: "林晚", c: "一定到，给你拍照" }]);
    P("x30", "lin", "12天前", "图书馆", "下雨天和图书馆最配。窗边的位置能听到雨声，看了一下午书，特别平静。",
      [{ e: "🌧️", g: 5 }, { e: "📚", g: 3 }],
      ["赵小雨", "徐甜甜", "王老师"], [{ n: "赵小雨", c: "这氛围我能画一整天" }]);
    return E;
  },

  /* 判断玩家动态类型（用于选评论库） */
  classify: function (post) {
    var t = (post.text || "") + (post.imgs || []).map(function (i) { return i.e; }).join("");
    if (/吃|饿|饭|餐|奶茶|蛋糕|食|面|锅|好喝|好吃|🍜|🍔|🍰|🍱|🧋|🥘|🍲|🍦/.test(t)) return "food";
    if (/学|题|考|卷|作业|复习|笔记|知识|背|自习|📚|📝|✏️|📖/.test(t)) return "study";
    if (/跑|球|运动|体测|锻炼|健身|赛|🏃|🏀|⚽|🏅|💪/.test(t)) return "sport";
    if (/难过|累|丧|烦|失眠|心情不好|想哭|焦虑|压力|抱抱/.test(t)) return "mood";
    if (/拍|照|光影|出片|壁纸|📷|🌅|🌇|🌈/.test(t)) return "photo";
    return "generic";
  },

  /* 给玩家的动态补 NPC 反应（每新一天结算一次，防重复） */
  react: function () {
    var self = this;
    var d = X56Moments.load();
    var G = window.G;
    if (!d.myPosts.length || !G) return;
    d.myPosts.forEach(function (post) {
      if (post.__npcReacted) return;
      post.__npcReacted = true;
      if (!post.likes) post.likes = [];
      if (!post.comments) post.comments = [];
      /* 点赞人数：由支持/魅力 + 图文丰富度决定 */
      var score = (typeof G.support === "number" ? G.support : 0) +
        (typeof G.charm === "number" ? G.charm : 0) +
        (post.imgs.length ? 20 : 0) + (post.text ? 8 : 0);
      var nLike = Math.max(0, Math.min(7, Math.floor(score / 35)));
      var shuffled = self.npcNames.slice().sort(function () { return Math.random() - 0.5; });
      for (var i = 0; i < nLike && i < shuffled.length; i++) {
        if (post.likes.indexOf(shuffled[i]) < 0) post.likes.push(shuffled[i]);
      }
      /* 评论：约 60% 概率 1 条，30% 概率 2 条 */
      var pool = self.commentPool[self.classify(post)];
      var nC = Math.random() < 0.3 ? 2 : (Math.random() < 0.7 ? 1 : 0);
      var used = {};
      for (var c = 0; c < nC; c++) {
        var nm = self.npcNames[Math.floor(Math.random() * self.npcNames.length)];
        if (used[nm]) continue;
        used[nm] = true;
        var cm = pool[Math.floor(Math.random() * pool.length)];
        post.comments.push({ n: nm, c: cm });
      }
    });
    X56Moments.save();
    X56Moments.render();
  },

  install: function () {
    /* 1. 扩充 seedFeed */
    var orig = X56Moments.seedFeed;
    X56Moments.seedFeed = function () {
      return orig.call(X56Moments).concat(X56MomentsExtra.extraFeed());
    };
    /* 2. 昵称取游戏姓名 */
    var oldOpen = X56Moments.open;
    X56Moments.open = function () {
      var d = X56Moments.load();
      if (window.G && window.G.name) d.myName = window.G.name;
      X56Moments.save();
      oldOpen.call(X56Moments);
    };
    /* 3. 新一天结算 NPC 反应 */
    setTimeout(function () {
      var oldNewDay = window.newDay;
      if (typeof oldNewDay === "function" && !window.__x56MeReact) {
        window.__x56MeReact = true;
        window.newDay = function () {
          oldNewDay.apply(this, arguments);
          setTimeout(function () { X56MomentsExtra.react(); }, 400);
        };
      }
    }, 800);
  }
};
window.X56MomentsExtra = X56MomentsExtra;
X56.inits.push(function () { X56MomentsExtra.install(); });

/* ══════════════════════════════════════════════════════════
   模块十六：专属人生事件（家庭 / MBTI / 星座 影响后续）
   这些事件只在符合你的角色背景时出现，让“出身/性格/星座”
   真正变成你每天会遇到的事。
   PL(条件函数, 图标, 标题, 正文, 选项...)
   ══════════════════════════════════════════════════════════ */
var X56Personal = {
  events: [],
  available: function () {
    var G = window.G;
    if (!G) return [];
    return this.events.filter(function (e) {
      try { return e.when(G); } catch (er) { return false; }
    });
  },
  /* 取一个专属事件（尽量取没见过的） */
  draw: function (seen) {
    var pool = this.available();
    var fresh = pool.filter(function (e) { return !seen[e.id]; });
    if (fresh.length) pool = fresh;
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  },
  install: function () {
    var self = this;
    /* 包装 X56Life.open：约 50% 优先给专属事件 */
    var origOpen = X56Life.open;
    X56Life.open = function (cat) {
      var G = window.G;
      if (G && !cat && Math.random() < 0.55) {
        var d = X56Life.data();
        if (d.day !== G.day) { d.day = G.day; d.draws = 0; }
        if (d.draws < 3) {
          var ev = self.draw(d.seen);
          if (ev) {
            d.draws++;
            d.seen[ev.id] = true;
            d.played++;
            X56Life.save(d);
            X56Life.renderEvent(ev, d);
            return;
          }
        }
      }
      origOpen.call(X56Life, cat);
    };
  }
};
window.X56Personal = X56Personal;

function PL(when, icon, title, text, options) {
  var ev = {
    id: "p" + X56Personal.events.length,
    when: when, icon: icon, cat: "🪞 专属", title: title, text: text,
    options: options.map(function (o) {
      return { label: o[0], eff: o[1], reply: o[2], hint: o[3] };
    })
  };
  X56Personal.events.push(ev);
}

/* ───────── 家庭背景专属（10） ───────── */
PL(function (G) { return G.family === "worker"; }, "🏠", "父母的电话",
  "晚上爸妈打来电话，问你钱够不够花、习不习惯。",
  [["说一切都好，让他们放心", { mood: 2, support: 2 }, "挂了电话，你心里暖暖的。", "心情+ 亲情"],
   ["顺便要点生活费", { money: 60, mood: 1 }, "爸妈二话不说转了钱。", "金钱+"],
   ["抱怨学习累", { mood: 1, sleep: 1 }, "爸妈安慰你尽力就好。", "心情+"]]);
PL(function (G) { return G.family === "cadre"; }, "🏛️", "家里的规矩",
  "周末回家，长辈提醒你要注意形象、别给家里丢脸。",
  [["答应并以身作则", { influence: 2, support: 1, mood: -1 }, "你确实比同龄人更懂事。", "影响力+"],
   ["表面答应", { mood: 1 }, "你有点受不了这些条条框框。", "心情+"],
   ["和长辈讲道理", { charm: 1, influence: 1 }, "长辈被你说得没词了。", "魅力+"]]);
PL(function (G) { return G.family === "biz"; }, "📈", "忙碌的父母",
  "爸妈又在外地谈生意，家里只剩你一个人。",
  [["自己照顾自己", { fitness: 1, knowledge: 1, mood: -1 }, "你学会了做饭，也习惯了独处。", "独立+"],
   ["约同学来家里", { support: 2, mood: 2 }, "冷清的屋子热闹了起来。", "社交+ 心情+"],
   ["点高级外卖", { money: -40, mood: 2 }, "你给自己改善伙食。", "心情+ 金钱-"]]);
PL(function (G) { return G.family === "teacher"; }, "📖", "教师子女",
  "爸妈就是老师，你作业一点都别想偷懒。",
  [["认真完成额外布置的任务", { knowledge: 3, grade: 1 }, "你基础打得比谁都牢。", "学习+ 3"],
   ["偷个懒", { mood: 1, knowledge: -1 }, "被发现后挨了一顿说。", "心情+ 学习-"],
   ["和爸妈讨论学习方法", { knowledge: 2, charm: 1 }, "你学到了高效的方法。", "学习+ 魅力+"]]);
PL(function (G) { return G.family === "rural"; }, "🌾", "家乡的农活",
  "放假回家，你帮家里干了一天农活。",
  [["咬牙坚持", { fitness: 2, health: 2, mood: 1 }, "虽然累，但你更能吃苦了。", "体力+ 健康+"],
   ["给家人讲学校的事", { support: 2, mood: 2 }, "家人听了笑得合不拢嘴。", "心情+ 亲情"],
   ["干一会就休息", { fitness: 1 }, "你已经尽力了。", "体力+"]]);
PL(function (G) { return G.family === "single"; }, "🫂", "相依为命",
  "爸爸/妈妈一个人把你拉扯大，最近好像又老了些。",
  [["多陪TA说说话", { mood: 3, support: 2 }, "你们都很珍惜彼此。", "心情+ 亲情"],
   ["主动分担家务", { fitness: 1, mood: 2 }, "TA夸你长大了。", "心情+ 体力+"],
   ["努力学习报答", { knowledge: 2, grade: 1 }, "你想成为TA的骄傲。", "学习+ 成绩+"]]);
PL(function (G) { return G.family === "remarry"; }, "🧩", "复杂的家",
  "重组家庭，你和新的家人还是有点客气。",
  [["主动迈出一步", { support: 2, mood: 2, charm: 1 }, "关系慢慢融洽起来。", "社交+ 心情+"],
   ["保持距离", { mood: 1 }, "你需要更多时间适应。", "心情+"],
   ["和同龄的兄弟姐妹聊聊", { support: 2, mood: 1 }, "你们发现其实没那么难相处。", "社交+"]]);
PL(function (G) { return G.family === "scholar"; }, "📜", "满屋书香",
  "家里的书架上有很多你读不完的书。",
  [["挑一本经典来读", { knowledge: 3, charm: 2 }, "你身上多了几分书卷气。", "学习+ 3 魅力+"],
   ["和长辈讨教", { knowledge: 2, charm: 1 }, "长辈的话让你很有启发。", "学习+ 魅力+"],
   ["读闲书换换脑", { mood: 2, knowledge: 1 }, "你在书里发现另一个世界。", "心情+ 学习+"]]);
PL(function (G) { return G.family === "rich"; }, "💎", "优渥的生活",
  "你想要的几乎都能得到，但父母对你期望很高。",
  [["把压力变动力", { knowledge: 2, influence: 1, mood: -1 }, "你不想只做个富二代。", "学习+ 压力"],
   ["享受生活", { mood: 3, money: -100 }, "你又买了喜欢的东西。", "心情+ 金钱-"],
   ["低调一点", { charm: 2, support: 1 }, "你不想让同学觉得你炫富。", "魅力+ 社交+"]]);
PL(function (G) { return G.family === "low"; }, "💪", "人穷志不短",
  "家里条件不好，但你从不抱怨。",
  [["拼命学习改变命运", { knowledge: 3, grade: 1, mood: 1 }, "你相信读书是最好的出路。", "学习+ 3"],
   ["多打几份工补贴家用", { money: 50, fitness: -1 }, "你比别人更早懂事。", "金钱+ 体力-"],
   ["申请助学金", { support: 2, money: 80 }, "学校了解情况后给了帮助。", "社交+ 金钱+"]]);

/* ───────── MBTI 专属（16，按四维度分组） ───────── */
PL(function (G) { return G.mbti && G.mbti.indexOf("E") === 0; }, "⚡", "社交电量满格",
  "人越多你越兴奋，课间根本坐不住。",
  [["组织大家玩游戏", { support: 2, mood: 3, influence: 2 }, "你是全班的气氛担当。", "社交+ 心情+"],
   ["到处串座位聊天", { support: 1, mood: 2 }, "你和谁都能聊两句。", "社交+ 心情+"]]);
PL(function (G) { return G.mbti && G.mbti.indexOf("I") === 0; }, "🔋", "独处充电",
  "热闹让你疲惫，你需要一个人待一会儿。",
  [["找个安静的角落看书", { knowledge: 2, mood: 2 }, "独处让你恢复了精力。", "学习+ 心情+"],
   ["戴上耳机静静待着", { mood: 3, sleep: 1 }, "世界安静了，你很舒服。", "心情+ 睡眠+"]]);
PL(function (G) { return G.mbti && G.mbti[1] === "N"; }, "🌌", "天马行空",
  "上课走神，你脑子里冒出一个又一个点子。",
  [["把灵感记下来", { knowledge: 2, charm: 1, mood: 1 }, "你的点子说不定哪天有用。", "学习+ 魅力+"],
   ["和朋友分享脑洞", { support: 2, mood: 2 }, "朋友被你的想象力折服。", "社交+ 心情+"]]);
PL(function (G) { return G.mbti && G.mbti[1] === "S"; }, "🔍", "脚踏实地",
  "你更相信看得见、摸得着的东西。",
  [["把眼前的任务做好", { knowledge: 2, grade: 1 }, "你做事让人放心。", "学习+ 成绩+"],
   ["整理桌面和笔记", { knowledge: 1, charm: 1 }, "一切井然有序。", "学习+ 魅力+"]]);
PL(function (G) { return G.mbti && G.mbti[2] === "T"; }, "⚖️", "理性分析",
  "遇到矛盾，你习惯先讲道理而不是讲感情。",
  [["客观分析利弊", { knowledge: 2, influence: 1 }, "你的判断很有说服力。", "学习+ 影响力+"],
   ["直言不讳地指出问题", { support: 0, charm: -1 }, "话是对的，但有点伤人。", "魅力-"],
   ["照顾一下别人的情绪", { support: 2, charm: 1 }, "你试着把话说得更委婉。", "社交+ 魅力+"]]);
PL(function (G) { return G.mbti && G.mbti[2] === "F"; }, "💗", "感同身受",
  "你总能敏锐地察觉到别人的情绪。",
  [["安慰不开心的同学", { support: 3, charm: 2, mood: 1 }, "你的共情让大家很依赖你。", "社交+ 魅力+"],
   ["也被别人的情绪影响", { mood: -1 }, "你有点共情过度了。", "心情-"]]);
PL(function (G) { return G.mbti && G.mbti[3] === "J"; }, "📅", "计划狂魔",
  "你喜欢把一切安排得明明白白。",
  [["列出今天的待办", { knowledge: 2, mood: 1 }, "按计划执行，效率很高。", "学习+ 心情+"],
   ["提前完成作业", { knowledge: 2, grade: 1 }, "你总是最从容的那个。", "学习+ 成绩+"]]);
PL(function (G) { return G.mbti && G.mbti[3] === "P"; }, "🎈", "随遇而安",
  "计划赶不上变化，你更喜欢顺其自然。",
  [["即兴决定去哪", { mood: 2, support: 1 }, "随性生活也有惊喜。", "心情+ 社交+"],
   ["被突发状况打乱", { mood: 0, knowledge: -1 }, "你决定以后还是列个计划。", "学习-"]]);
PL(function (G) { return G.mbti === "INTJ"; }, "♟️", "战略家",
  "你在心里默默规划着未来三年的路线。",
  [["制定长期目标", { knowledge: 3, influence: 1 }, "你走的每一步都有目的。", "学习+ 3"],
   ["独自研究难题", { knowledge: 2, mood: 1 }, "你享受攻克难题的过程。", "学习+ 心情+"]]);
PL(function (G) { return G.mbti === "ENFP"; }, "🎉", "竞选者",
  "你对一切新鲜事物都充满热情。",
  [["同时报了好几个社团", { support: 2, mood: 3, charm: 1 }, "你的热情感染了所有人。", "社交+ 心情+ 魅力+"],
   ["热情过头忘了正事", { knowledge: -1, mood: 2 }, "作业……你明天再补。", "心情+ 学习-"]]);
PL(function (G) { return G.mbti === "INTP"; }, "🧪", "逻辑学家",
  "你在琢磨一个老师没讲透的原理。",
  [["自己查资料推导", { knowledge: 3 }, "弄懂的那一刻特别爽。", "学习+ 3"],
   ["和同学辩论", { support: 1, knowledge: 2 }, "你用逻辑把对方说服了。", "社交+ 学习+"]]);
PL(function (G) { return G.mbti === "ESTJ"; }, "📋", "总经理",
  "班里乱糟糟的，你忍不住想管一管。",
  [["主动维持秩序", { influence: 3, support: 2 }, "老师不在时你就是主心骨。", "影响力+ 社交+"],
   ["分工组织活动", { influence: 2, support: 2 }, "你把事情安排得很高效。", "影响力+ 社交+"]]);
PL(function (G) { return G.mbti === "INFJ"; }, "🌙", "提倡者",
  "你心里装着理想，也常常在深夜思考人生。",
  [["写下对未来的想法", { knowledge: 2, charm: 1, mood: 1 }, "文字帮你理清了思绪。", "学习+ 魅力+"],
   ["倾听朋友的烦恼", { support: 3, charm: 2 }, "你是别人最信任的倾诉对象。", "社交+ 魅力+"]]);
PL(function (G) { return G.mbti === "ESFP"; }, "🎊", "表演者",
  "你是天生的舞台型选手。",
  [["自告奋勇上台表演", { charm: 3, mood: 3, support: 1 }, "台下的掌声让你闪闪发光。", "魅力+ 心情+"],
   ["活跃现场气氛", { mood: 2, support: 2 }, "有你在的地方不会冷场。", "心情+ 社交+"]]);
PL(function (G) { return G.mbti === "ISTJ"; }, "📗", "检查者",
  "你做事严谨，容不得半点马虎。",
  [["认真核对每一道题", { knowledge: 2, grade: 2 }, "你的准确率全班数一数二。", "学习+ 成绩+ 2"],
   ["按部就班复习", { knowledge: 2, sleep: -1 }, "你相信积累的力量。", "学习+"]]);
PL(function (G) { return G.mbti === "ENTP"; }, "💡", "辩论家",
  "你喜欢挑战既定的观点。",
  [["和老师同学讨论", { knowledge: 2, influence: 2, charm: 1 }, "你独特的角度让人眼前一亮。", "学习+ 影响力+"],
   ["琢磨一个新点子", { knowledge: 2, mood: 1 }, "你总有层出不穷的想法。", "学习+ 心情+"]]);

/* ───────── 星座专属（12） ───────── */
PL(function (G) { return G.zodiac === "白羊"; }, "🔥", "白羊座的冲劲",
  "你今天干劲十足，想做什么就做什么。",
  [["一鼓作气冲任务", { knowledge: 2, fitness: 2, mood: 1 }, "冲劲让你效率翻倍。", "学习+ 体力+"],
   ["冲动之下做决定", { mood: 1, knowledge: -1 }, "你决定以后三思而后行。", "心情+ 学习-"]]);
PL(function (G) { return G.zodiac === "金牛"; }, "🐂", "金牛座的稳",
  "你做事一向不急不躁，还特别会理财。",
  [["把零花钱存一部分", { mood: 1, money: 20 }, "你的小金库越来越鼓。", "金钱+"],
   ["慢慢来把事做扎实", { knowledge: 2, grade: 1 }, "稳扎稳打，成绩稳步提升。", "学习+ 成绩+"]]);
PL(function (G) { return G.zodiac === "双子"; }, "🎭", "双子座的好奇",
  "你对什么都感兴趣，话题永远聊不完。",
  [["同时接触好几样新东西", { knowledge: 2, charm: 2, mood: 1 }, "你学什么都快。", "学习+ 魅力+"],
   ["和不同的人聊天", { support: 2, mood: 2 }, "你是大家的开心果。", "社交+ 心情+"]]);
PL(function (G) { return G.zodiac === "巨蟹"; }, "🦀", "巨蟹座的温柔",
  "你很顾家，也特别会照顾人。",
  [["照顾身边的朋友", { support: 3, charm: 2, mood: 1 }, "你的温柔让大家很安心。", "社交+ 魅力+"],
   ["想家了给家里打电话", { mood: 2, support: 1 }, "听到家人的声音就好了。", "心情+"]]);
PL(function (G) { return G.zodiac === "狮子"; }, "🦁", "狮子座的光芒",
  "你天生有领导力，也想成为焦点。",
  [["挑大梁组织活动", { influence: 3, charm: 2, support: 1 }, "你确实有领导的气场。", "影响力+ 魅力+"],
   ["帮助同学获得认可", { support: 2, influence: 1 }, "你成了班里的核心。", "社交+ 影响力+"]]);
PL(function (G) { return G.zodiac === "处女"; }, "🌾", "处女座的细致",
  "你追求完美，细节一点都不放过。",
  [["把笔记整理得一丝不苟", { knowledge: 2, grade: 2, charm: 1 }, "你的认真带来了好成绩。", "学习+ 成绩+ 2"],
   ["挑剔细节", { mood: 0, support: -1 }, "同学有点受不了你的高标准。", "社交-"]]);
PL(function (G) { return G.zodiac === "天秤"; }, "⚖️", "天秤座的优雅",
  "你追求和谐，也很有审美。",
  [["打扮得清爽出门", { charm: 3, support: 1 }, "你的好品味让人眼前一亮。", "魅力+ 3"],
   ["帮朋友调解矛盾", { support: 2, influence: 1 }, "你总能找到平衡点。", "社交+ 影响力+"]]);
PL(function (G) { return G.zodiac === "天蝎"; }, "🦂", "天蝎座的专注",
  "你认定的事会全力以赴。",
  [["全力投入一个目标", { knowledge: 3, fitness: 1 }, "你的专注让你进步飞快。", "学习+ 3"],
   ["认准一个人深交", { support: 2, charm: 1 }, "你对朋友极其忠诚。", "社交+ 魅力+"]]);
PL(function (G) { return G.zodiac === "射手"; }, "🏹", "射手座的自由",
  "你向往自由，热爱冒险。",
  [["来一场说走就走的出行", { mood: 3, fitness: 1, money: -20 }, "自由让你心情大好。", "心情+ 体力+ 金钱-"],
   ["尝试新事物", { knowledge: 1, mood: 2 }, "你享受探索的过程。", "心情+ 学习+"]]);
PL(function (G) { return G.zodiac === "摩羯"; }, "🐐", "摩羯座的自律",
  "你比谁都自律，目标感很强。",
  [["严格执行学习计划", { knowledge: 3, grade: 1, sleep: -1 }, "你的自律终有回报。", "学习+ 3"],
   ["默默努力", { knowledge: 2, fitness: 1 }, "你相信厚积薄发。", "学习+ 体力+"]]);
PL(function (G) { return G.zodiac === "水瓶"; }, "🛸", "水瓶座的独立",
  "你想法独特，不喜欢随大流。",
  [["研究一个冷门爱好", { knowledge: 2, charm: 2 }, "你的独特让你很有魅力。", "学习+ 魅力+"],
   ["坚持自己的想法", { influence: 1, charm: 1 }, "你不轻易被别人左右。", "影响力+ 魅力+"]]);
PL(function (G) { return G.zodiac === "双鱼"; }, "🐟", "双鱼座的浪漫",
  "你感情丰富，脑子里有很多浪漫想象。",
  [["记录一个浪漫的想法", { charm: 2, mood: 2 }, "你的浪漫是种天赋。", "魅力+ 心情+"],
   ["沉浸在喜欢的音乐里", { mood: 3, charm: 1 }, "你在自己的世界里很快乐。", "心情+ 魅力+"]]);

X56.inits.push(function () { X56Personal.install(); });

/* ══════════════════════════════════════════════════════════
   模块十七：和校园人物聊聊天（微信式气泡对话）
   每个角色一棵分支对话树；你的回复决定气氛，
   结束时影响好感/心情/支持。
   节点：{from: "npc"|"me", text, choices:[{label,to,me?}], end?, eff}
   ══════════════════════════════════════════════════════════ */
var X56Chat = {
  KEY: "xz56_chat_v1",
  scripts: {},
  load: function () {
    try {
      var raw = storageGet(this.KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { chats: {}, affinity: {} };
  },
  save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },

  applyEff: function (id, eff) {
    var G = window.G;
    var d = this.load();
    d.affinity[id] = (d.affinity[id] || 0) + (eff.aff || 0);
    if (G) {
      for (var k in eff) {
        if (k === "aff") continue;
        if (typeof G[k] === "number") G[k] += eff[k];
      }
    }
    this.save(d);
    if (typeof window.clampAll === "function") { try { window.clampAll(); } catch (e) {} }
    if (typeof window.upd === "function") { try { window.upd(); } catch (e) {} }
  },

  open: function (id) {
    var sc = this.scripts[id];
    if (!sc) { toast("TA 还不太想聊天"); return; }
    var d = this.load();
    d.chats[id] = true;
    this.save(d);
    this.render(id, sc.start);
  },

  render: function (id, nodeId) {
    var self = this;
    var sc = this.scripts[id];
    var node = sc.nodes[nodeId];
    if (!node) return;
    var root = $("x56Chat");
    if (!root) {
      root = document.createElement("div");
      root.id = "x56Chat";
      document.body.appendChild(root);
    }
    root.classList.add("show");
    var d = this.load();
    var aff = d.affinity[id] || 0;
    var hearts = "";
    for (var i = 0; i < 5; i++) hearts += aff >= (i + 1) * 2 ? "❤️" : "🤍";
    root.innerHTML =
      '<div class="xc-top"><span class="xc-back" id="xcBack">‹</span>' +
      '<div class="xc-who"><span class="xc-avatar">' + sc.emoji + "</span>" +
      '<div><div class="xc-name">' + sc.name + "</div>" +
      '<div class="xc-status">' + hearts + "</div></div></div></div>" +
      '<div class="xc-msgs" id="xcMsgs"></div>' +
      '<div class="xc-inputbar" id="xcInput"></div>';
    this.walk(id, nodeId);
  },

  /* 顺着节点连续播放 NPC 台词，直到遇到需要玩家选择的节点 */
  walk: function (id, nodeId) {
    var self = this;
    var sc = this.scripts[id];
    var box = $("xcMsgs");
    var input = $("xcInput");
    var node = sc.nodes[nodeId];
    if (!node) return;
    var cls = node.from === "me" ? "me" : "npc";
    var b = document.createElement("div");
    b.className = "xc-bubble " + cls;
    if (cls === "npc") {
      var av = document.createElement("span");
      av.className = "xc-bav";
      av.textContent = sc.emoji;
      b.appendChild(av);
    }
    var tx = document.createElement("span");
    tx.className = "xc-tx";
    tx.textContent = node.text;
    b.appendChild(tx);
    box.appendChild(b);
    box.scrollTop = box.scrollHeight;

    if (node.end) {
      input.innerHTML = "";
      if (node.eff) {
        this.applyEff(id, node.eff);
        var note = document.createElement("div");
        note.className = "xc-note";
        note.textContent = this.effText(node.eff);
        box.appendChild(note);
        box.scrollTop = box.scrollHeight;
      }
      var end = document.createElement("button");
      end.className = "gbtn";
      end.style.cssText = "width:100%;margin-top:8px";
      end.textContent = "结束聊天";
      end.onclick = function () { X56Chat.close(); };
      input.appendChild(end);
      return;
    }
    if (node.choices && node.choices.length) {
      input.innerHTML = "";
      node.choices.forEach(function (ch) {
        var btn = document.createElement("button");
        btn.className = "xc-choice";
        btn.textContent = ch.label;
        btn.onclick = function () {
          /* 玩家说的话也进气泡 */
          var mb = document.createElement("div");
          mb.className = "xc-bubble me";
          var mt = document.createElement("span");
          mt.className = "xc-tx";
          mt.textContent = ch.label;
          mb.appendChild(mt);
          box.appendChild(mb);
          box.scrollTop = box.scrollHeight;
          input.innerHTML = '<div class="xc-typing">' + sc.emoji + " 正在输入…</div>";
          setTimeout(function () { self.walk(id, ch.to); }, 480);
        };
        input.appendChild(btn);
      });
    }
  },

  effText: function (eff) {
    var lb = { aff: "❤️ 好感", mood: "🙂 心情", support: "✊ 支持", knowledge: "📘 学习", charm: "💫 魅力", fitness: "💪 体力" };
    return Object.keys(eff).map(function (k) {
      var v = eff[k];
      return (lb[k] || k) + " " + (v > 0 ? "+" : "") + v;
    }).join("　");
  },

  close: function () {
    var root = $("x56Chat");
    if (root) {
      root.classList.remove("show");
      root.innerHTML = "";
    }
  },

  /* 给人物志卡片加“聊聊”按钮 */
  addButtons: function () {
    var ids = this.scriptOrder;
    $a("#x56CoreBody .people-card").forEach(function (card, idx) {
      if (card.querySelector(".xc-chat-btn")) return;
      var id = ids[idx];
      if (!id) return;
      var btn = document.createElement("button");
      btn.className = "gbtn xc-chat-btn";
      btn.textContent = "💬 聊聊";
      btn.onclick = function () { closeModal(); X56Chat.open(id); };
      card.appendChild(btn);
    });
  },
  scriptOrder: ["lin", "zhao", "su", "xu", "chen", "zhou", "tiantian", "wu", "wang"]
};
window.X56Chat = X56Chat;

/* 轮询：人物志渲染后补按钮 */
setInterval(function () {
  try {
    if ($("x56CoreBody") && $s("#x56CoreBody .people-card")) X56Chat.addButtons();
  } catch (e) {}
}, 800);

/* ══════════════════════════════════════════════════════════
   模块十七（数据）：9 位校园人物的对话树
   节点：{from:"me"|"npc", text, choices:[{label,to}], end?, eff}
   ══════════════════════════════════════════════════════════ */
function XCS(id, emoji, name, start, nodes) {
  X56Chat.scripts[id] = { emoji: emoji, name: name, start: start, nodes: nodes };
}

/* ── 林晚 ── */
XCS("lin", "🌸", "林晚", "a", {
  a: { from: "npc", text: "啊，是你……我正好在看这本书。", choices: [
    { label: "看的什么书呀？", to: "b" }, { label: "没有打扰到你吧？", to: "c" }] },
  b: { from: "npc", text: "一本诗集。里面有一句我很喜欢：‘你是人间的四月天’。", choices: [
    { label: "说的就是你吧", to: "d" }, { label: "我也想读读", to: "e" }] },
  c: { from: "npc", text: "没有的，你能来我还挺开心的。", choices: [
    { label: "那我以后常来找你", to: "d" }, { label: "你真温柔", to: "e" }] },
  d: { from: "npc", text: "你、你突然这样说……我脸都红了。", choices: [
    { label: "因为你很可爱呀", to: "f" }, { label: "开玩笑的", to: "g" }] },
  e: { from: "npc", text: "我可以借给你，不过你要记得还我哦。", choices: [
    { label: "一定，还想和你聊聊", to: "f" }, { label: "谢谢，我会爱惜", to: "g" }] },
  f: { from: "npc", text: "和你聊天我也会很开心……那我们说定啦。", end: true, eff: { aff: 2, mood: 2 } },
  g: { from: "npc", text: "嗯，谢谢你愿意陪我说话。", end: true, eff: { aff: 1, mood: 1 } }
});

/* ── 赵小雨 ── */
XCS("zhao", "🎨", "赵小雨", "a", {
  a: { from: "npc", text: "哟，新同学/同桌！来看我画画？", choices: [
    { label: "你画的什么？", to: "b" }, { label: "你画得真好", to: "c" }] },
  b: { from: "npc", text: "在画窗外的梧桐树，逆光的时候叶子是透明的。", choices: [
    { label: "也帮我画一张呗", to: "d" }, { label: "听起来好专业", to: "e" }] },
  c: { from: "npc", text: "嘿嘿，你这话说得我都不好意思了。", choices: [
    { label: "我说真的", to: "d" }, { label: "哈哈你也有今天", to: "f" }] },
  d: { from: "npc", text: "行啊，你当我的模特，我请你喝奶茶。", choices: [
    { label: "一言为定！", to: "g" }, { label: "我会紧张的", to: "e" }] },
  e: { from: "npc", text: "其实不难，你多看看光，就懂了。", choices: [
    { label: "你教我好不好", to: "g" }, { label: "受教了", to: "f" }] },
  f: { from: "npc", text: "跟你聊天还挺有意思，下次还来啊。", end: true, eff: { aff: 1, mood: 1 } },
  g: { from: "npc", text: "那就这么说定了！我可记住了，你别放我鸽子。", end: true, eff: { aff: 2, mood: 2 } }
});

/* ── 苏清颜 ── */
XCS("su", "🎹", "苏清颜", "a", {
  a: { from: "npc", text: "……你好，有事吗？", choices: [
    { label: "你刚弹的是什么曲子？", to: "b" }, { label: "我能坐会儿吗", to: "c" }] },
  b: { from: "npc", text: "一首我自己写的，还没起名字。", choices: [
    { label: "很好听，再弹一段？", to: "d" }, { label: "我能听听吗", to: "e" }] },
  c: { from: "npc", text: "……可以，安静一点就好。", choices: [
    { label: "我保证不吵", to: "d" }, { label: "谢谢", to: "f" }] },
  d: { from: "npc", text: "你……是第一个这么认真听的人。", choices: [
    { label: "因为真的好听", to: "g" }, { label: "我很荣幸", to: "f" }] },
  e: { from: "npc", text: "等我写完吧，弹给你听。", choices: [
    { label: "我很期待", to: "g" }, { label: "好，我等你", to: "f" }] },
  f: { from: "npc", text: "谢谢你……没有把我当成怪脾气的人。", end: true, eff: { aff: 1, mood: 1 } },
  g: { from: "npc", text: "那你会是它的第一个听众。……这句话，我只对你说。", end: true, eff: { aff: 2, mood: 2 } }
});

/* ── 许念 ── */
XCS("xu", "🏀", "许念", "a", {
  a: { from: "npc", text: "嘿，你怎么来了？刚训练完，一身汗。", choices: [
    { label: "看你打球很厉害", to: "b" }, { label: "一起去吃饭？", to: "c" }] },
  b: { from: "npc", text: "哈哈，小事，练了几年了。", choices: [
    { label: "能教教我吗", to: "d" }, { label: "你投篮的样子真帅", to: "e" }] },
  c: { from: "npc", text: "行啊，正好饿了，走！", choices: [
    { label: "我请你", to: "f" }, { label: "AA 吧", to: "g" }] },
  d: { from: "npc", text: "没问题，明早六点，别迟到。", choices: [
    { label: "六点？！好吧……", to: "f" }, { label: "我一定到", to: "g" }] },
  e: { from: "npc", text: "你、你说什么呢……我可不是那种会脸红的人。", choices: [
    { label: "你已经脸红了", to: "f" }, { label: "哈哈开玩笑", to: "g" }] },
  f: { from: "npc", text: "跟你聊天还挺痛快，你这朋友我交定了。", end: true, eff: { aff: 1, mood: 1 } },
  g: { from: "npc", text: "好，那就这么说定了，球场上见！", end: true, eff: { aff: 2, mood: 2 } }
});

/* ── 陈墨 ── */
XCS("chen", "⚽", "陈墨", "a", {
  a: { from: "npc", text: "哟，啥事？想踢球还是想约饭？", choices: [
    { label: "周末有球赛吗", to: "b" }, { label: "你怎么总这么有精神", to: "c" }] },
  b: { from: "npc", text: "有啊，跟隔壁班，缺人，你来不？", choices: [
    { label: "我来！", to: "d" }, { label: "我给你们加油", to: "e" }] },
  c: { from: "npc", text: "哈哈，年轻人嘛，就该朝气蓬勃的。", choices: [
    { label: "受教了体委", to: "e" }, { label: "那带我一起运动", to: "d" }] },
  d: { from: "npc", text: "爽快！就喜欢你这样的，周末见。", end: true, eff: { aff: 2, support: 2, mood: 1 } },
  e: { from: "npc", text: "行，那周末来玩，别一个人闷着。", end: true, eff: { aff: 1, support: 1 } }
});

/* ── 周子航 ── */
XCS("zhou", "🎮", "周子航", "a", {
  a: { from: "npc", text: "别吵，我正在打排位……哦是你啊。", choices: [
    { label: "上分了吗", to: "b" }, { label: "又熬夜了？", to: "c" }] },
  b: { from: "npc", text: "别提了，连跪三局，队友太坑。", choices: [
    { label: "我带你双排", to: "d" }, { label: "少玩点，对身体好", to: "e" }] },
  c: { from: "npc", text: "你怎么跟我妈一样……我知道了。", choices: [
    { label: "知道还不改", to: "e" }, { label: "早点睡啊", to: "f" }] },
  d: { from: "npc", text: "真的？你可别比我还菜，晚上八点。", end: true, eff: { aff: 2, mood: 2 } },
  e: { from: "npc", text: "好好好，我听你的，谢谢你还惦记着。", end: true, eff: { aff: 1, mood: 1, support: 1 } },
  f: { from: "npc", text: "知道了，啰嗦……不过，谢了。", end: true, eff: { aff: 1, mood: 1 } }
});

/* ── 徐甜甜 ── */
XCS("tiantian", "📚", "徐甜甜", "a", {
  a: { from: "npc", text: "你好，我在整理今天的笔记。", choices: [
    { label: "能借我看看吗", to: "b" }, { label: "一起自习？", to: "c" }] },
  b: { from: "npc", text: "可以呀，我记得挺详细的。", choices: [
    { label: "你真厉害", to: "d" }, { label: "谢谢，我请你喝水", to: "e" }] },
  c: { from: "npc", text: "好呀，图书馆三楼比较安静。", choices: [
    { label: "那放学一起", to: "e" }, { label: "你带带我", to: "d" }] },
  d: { from: "npc", text: "没有啦，我只是比别人多努力一点。", end: true, eff: { aff: 1, knowledge: 1, mood: 1 } },
  e: { from: "npc", text: "好啊，那说定了，我们一起进步。", end: true, eff: { aff: 2, knowledge: 1, mood: 1 } }
});

/* ── 吴磊 ── */
XCS("wu", "🏃", "吴磊", "a", {
  a: { from: "npc", text: "嘿！一起跑两圈？", choices: [
    { label: "走，谁怕谁", to: "b" }, { label: "今天就算了", to: "c" }] },
  b: { from: "npc", text: "哈哈，就喜欢你这样爽快的！", choices: [
    { label: "比比谁跑得快", to: "d" }, { label: "你跑得是真快", to: "e" }] },
  c: { from: "npc", text: "行，那改天，多运动身体好。", choices: [
    { label: "好，下次一定", to: "e" }] },
  d: { from: "npc", text: "好啊，输了的请喝水！", end: true, eff: { aff: 2, fitness: 1, mood: 1 } },
  e: { from: "npc", text: "那说定了，随时来找我，我带你练。", end: true, eff: { aff: 1, fitness: 1, support: 1 } }
});

/* ── 王老师 ── */
XCS("wang", "👩‍🏫", "王老师", "a", {
  a: { from: "npc", text: "怎么了？学习上有问题，还是有什么心事？", choices: [
    { label: "我想问问最近的学习", to: "b" }, { label: "老师我有点迷茫", to: "c" }] },
  b: { from: "npc", text: "你最近状态不错，再把基础打牢一点。", choices: [
    { label: "好的老师，我会努力", to: "d" }, { label: "能给我点建议吗", to: "e" }] },
  c: { from: "npc", text: "迷茫很正常，说明你在认真思考。先把手头的事做好。", choices: [
    { label: "我明白了", to: "d" }, { label: "谢谢老师", to: "e" }] },
  d: { from: "npc", text: "老师相信你，有困难随时来找我。", end: true, eff: { aff: 1, knowledge: 1, mood: 1 } },
  e: { from: "npc", text: "课后到办公室来，老师好好给你讲讲。", end: true, eff: { aff: 1, knowledge: 2, support: 1 } }
});

/* ══════════════════════════════════════════════════════════
   模块十八：约会日常（番外）
   4 位女主各 6 个约会场景，可随时从校园中心进入；
   每个场景有地点、对话、选择，影响好感与心情，是日常甜度。
   场景：{loc, emoji, lines:[{s,text}], choices:[{label,reply}], end}
   ══════════════════════════════════════════════════════════ */
var X56Date = {
  KEY: "xz56_date_v1",
  scenes: {},
  load: function () {
    try {
      var raw = storageGet(this.KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { affinity: {}, played: {} };
  },
  save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },
  heroineMeta: {
    lin: { name: "林晚", emoji: "🌸", color: "#ff9eb5" },
    zhao: { name: "赵小雨", emoji: "🎨", color: "#b79af8" },
    su: { name: "苏清颜", emoji: "🎹", color: "#7cc4e8" },
    xu: { name: "许念", emoji: "🏀", color: "#8fd8ad" }
  },
  order: ["lin", "zhao", "su", "xu"],

  /* 选女主面板 */
  panel: function () {
    var self = this;
    var d = this.load();
    var h = '<div class="date-panel"><h3>💕 约会日常</h3>' +
      '<div class="quote">挑一个人，去一个你们都喜欢的地方。<br>（番外模式，不影响主线剧情）</div>' +
      this.order.map(function (id) {
        var m = self.heroineMeta[id];
        var sc = self.scenes[id] || [];
        var aff = d.affinity[id] || 0;
        var hearts = "";
        for (var i = 0; i < 5; i++) hearts += aff >= (i + 1) * 2 ? "❤️" : "🤍";
        return '<div class="date-heroine"><div class="dh-emoji">' + m.emoji + "</div>" +
          "<div><div class='dh-name'>" + m.name + " <span class='dh-hearts'>" + hearts + "</span></div>" +
          '<div class="dh-scenes">' +
          sc.map(function (s, i) {
            return '<button class="dh-scene" data-h="' + id + '" data-i="' + i + '">' +
              (s.emoji || "📍") + " " + s.name + "</button>";
          }).join("") + "</div></div></div>";
      }).join("") +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button></div>';
    modal(h);
    setTimeout(function () {
      $a("#modalbox .dh-scene").forEach(function (b) {
        on(b, "click", function () {
          closeModal();
          X56Date.start(b.getAttribute("data-h"), parseInt(b.getAttribute("data-i"), 10));
        });
      });
    }, 80);
  },

  start: function (h, i) {
    var scene = (this.scenes[h] || [])[i];
    if (!scene) return;
    var m = this.heroineMeta[h];
    var root = $("x56Date");
    if (!root) {
      root = document.createElement("div");
      root.id = "x56Date";
      document.body.appendChild(root);
    }
    root.classList.add("show");
    root.innerHTML =
      '<div class="dt-bg" id="dtBg"></div>' +
      '<div class="dt-top"><span class="dt-h">' + m.emoji + " " + m.name + "</span>" +
      '<span class="dt-loc" id="dtLoc"></span>' +
      '<button class="dt-x" id="dtX">✕</button></div>' +
      '<div class="dt-stage"><div class="dt-her" id="dtHer"></div></div>' +
      '<div class="dt-dialog"><div class="dt-box" id="dtBox"></div>' +
      '<div class="dt-choices" id="dtChoices"></div></div>';
    var L = X56Story.locs[scene.loc];
    if (L) {
      $("dtBg").style.background = L.bg;
      $("dtLoc").textContent = L.icon + " " + L.name;
    }
    on($("dtX"), "click", function () { X56Date.close(); });
    this.cur = { h: h, scene: scene, line: 0, m: m };
    this.nextLine();
  },

  nextLine: function () {
    var self = this;
    var c = this.cur;
    var scene = c.scene;
    if (c.line < scene.lines.length) {
      var ln = scene.lines[c.line];
      var plate = c.m.name;
      var her = c.m.emoji;
      if (ln.s === "me") { plate = "我"; her = "🧑"; }
      if (ln.s === "narrator") { plate = "旁白"; her = "🌬️"; }
      $("dtHer").textContent = her;
      $("dtHer").style.animation = "none";
      void $("dtHer").offsetWidth;
      $("dtHer").style.animation = "stHeroineIn .7s ease";
      $("dtBox").innerHTML = '<div class="dt-name" style="background:linear-gradient(135deg,' +
        c.m.color + "," + c.m.color + "cc)\">" + plate + "</div>" +
        '<div class="dt-text" id="dtText"></div>';
      $("dtChoices").innerHTML = "";
      this.typewrite(ln.text, function () {
        c.line++;
        var b = document.createElement("button");
        b.className = "dt-continue";
        b.textContent = "▾";
        b.onclick = function () { self.nextLine(); };
        $("dtChoices").appendChild(b);
      });
    } else {
      this.showChoices();
    }
  },

  showChoices: function () {
    var self = this;
    var c = this.cur;
    var scene = c.scene;
    $("dtBox").innerHTML = '<div class="dt-name" style="background:linear-gradient(135deg,#7a8cf0,#5a6ad0)">选择</div>' +
      '<div class="dt-text">你想怎么做？</div>';
    var box = $("dtChoices");
    box.innerHTML = "";
    scene.choices.forEach(function (ch) {
      var b = document.createElement("button");
      b.className = "dt-choice";
      b.textContent = ch.label;
      b.onclick = function () { self.finish(ch); };
      box.appendChild(b);
    });
  },

  finish: function (ch) {
    var self = this;
    var c = this.cur;
    var d = this.load();
    d.affinity[c.h] = (d.affinity[c.h] || 0) + (ch.aff || 1);
    var key = c.h + "_" + c.scene.name;
    d.played[key] = true;
    this.save(d);
    var G = window.G;
    if (G) {
      G.mood = (typeof G.mood === "number" ? G.mood : 0) + 2;
      if (ch.money) G.money = (typeof G.money === "number" ? G.money : 0) + ch.money;
      if (typeof window.clampAll === "function") { try { window.clampAll(); } catch (e) {} }
    }
    $("dtHer").textContent = c.m.emoji;
    $("dtBox").innerHTML = '<div class="dt-name" style="background:linear-gradient(135deg,' +
      c.m.color + "," + c.m.color + "cc)\">" + c.m.name + "</div>" +
      '<div class="dt-text">' + ch.reply + "</div>";
    var box = $("dtChoices");
    box.innerHTML = "";
    var again = document.createElement("button");
    again.className = "dt-choice";
    again.textContent = "再约一个";
    again.onclick = function () { X56Date.close(); X56Date.panel(); };
    box.appendChild(again);
    var done = document.createElement("button");
    done.className = "dt-choice";
    done.textContent = "结束";
    done.onclick = function () { X56Date.close(); };
    box.appendChild(done);
  },

  typer: null,
  typewrite: function (text, done) {
    var el = $("dtText");
    clearInterval(this.typer);
    el.textContent = "";
    var i = 0;
    this.typer = setInterval(function () {
      el.textContent = text.substring(0, ++i);
      if (i >= text.length) {
        clearInterval(X56Date.typer);
        done();
      }
    }, 26);
  },

  close: function () {
    var root = $("x56Date");
    if (root) {
      root.classList.remove("show");
      root.innerHTML = "";
    }
  }
};
window.X56Date = X56Date;

/* ══════════════════════════════════════════════════════════
   模块十八（数据）：4 女主 × 6 约会场景
   DS(女主, 场景名, 地点, 图标, 台词[], 选择[])
   ══════════════════════════════════════════════════════════ */
function DS(h, name, loc, emoji, lines, choices) {
  X56Date.scenes[h] = X56Date.scenes[h] || [];
  X56Date.scenes[h].push({ name: name, loc: loc, emoji: emoji, lines: lines, choices: choices });
}
function N(t) { return { s: "narrator", text: t }; }
function M(t) { return { s: "me", text: t }; }
function H(t) { return { text: t }; }

/* ════════════════ 林晚 ════════════════ */
DS("lin", "书店", "library", "📖",
  [N("周末，你和林晚约在书店。她站在书架前，手指轻轻划过书脊。"),
   H("这本……你觉得好看吗？"),
   M("你挑的应该都不错。要不要一人一本？"),
   H("好啊，那我们去那边的咖啡角看一会儿。")],
  [{ label: "帮她挑一本诗集", reply: "她抱着书，脸红着说：你最懂我。", aff: 2 },
   { label: "给她读一段", reply: "她听着听着就笑了，眼睛弯弯的。", aff: 2 },
   { label: "安静地各看各的", reply: "她偷偷看了你好几眼，觉得这样很安心。", aff: 1 }]);
DS("lin", "湖边散步", "garden", "🌊",
  [N("傍晚的湖边有风，林晚把头发别到耳后。"),
   H("这里和我家那边有点像……我很喜欢。"),
   M("那以后我们常来。")],
  [{ label: "把外套披在她肩上", reply: "她小声说了句谢谢，耳朵红红的。", aff: 2 },
   { label: "和她一起看夕阳", reply: "她说：这一刻她想记很久很久。", aff: 2 },
   { label: "聊最近读的书", reply: "你们越聊越投机，忘了时间。", aff: 1 }]);
DS("lin", "奶茶店", "canteen", "🧋",
  [N("你和林晚在奶茶店排队，她有点选择困难。"),
   H("我……我喝什么好呢？"),
   M("试试新品？我请你。")],
  [{ label: "帮她点一杯甜的", reply: "她抿了一口，笑：和你一样甜。", aff: 2 },
   { label: "点一样的口味", reply: "她说：原来我们的口味也这么像。", aff: 1 },
   { label: "点一份小蛋糕", reply: "她用勺子分你一半，特别开心。", aff: 2 }]);
DS("lin", "图书馆自习", "library", "📚",
  [N("你和林晚在图书馆自习，她递给你一张纸条。"),
   H("（纸条）：累了就休息一下，别太拼。")],
  [{ label: "回纸条：有你在就不累", reply: "她看完纸条，脸埋进了书里。", aff: 2 },
   { label: "给她带杯热饮", reply: "她捧着杯子，心里热乎乎的。", aff: 2 },
   { label: "一起安静学习", reply: "你们互相陪伴，效率都很高。", aff: 1 }]);
DS("lin", "花园", "garden", "🌸",
  [N("后花园的花开了，林晚蹲下来看花。"),
   H("你看，这一朵上有露珠呢。")],
  [{ label: "给她拍张照", reply: "她说：照片里的人比花好看吗？", aff: 2 },
   { label: "摘一朵别在她发间", reply: "她红着脸，小声说：你真会哄人。", aff: 2 },
   { label: "和她一起看花", reply: "你们聊了很多关于春天的事。", aff: 1 }]);
DS("lin", "天台看云", "rooftop", "☁️",
  [N("午休，你们偷偷爬上天台。林晚靠着栏杆看云。"),
   H("那朵云，好像一只小兔子。")],
  [{ label: "和她一起猜云的形状", reply: "你们笑得像两个孩子。", aff: 2 },
   { label: "听她讲心事", reply: "她说你是第一个让她愿意说这些的人。", aff: 2 },
   { label: "安静地吹风", reply: "她悄悄靠近了你一点。", aff: 1 }]);

/* ════════════════ 赵小雨 ════════════════ */
DS("zhao", "写生", "garden", "🎨",
  [N("赵小雨背着画板，拉着你去写生。"),
   H("来来来，你坐在那儿，我把你画进去！"),
   M("我会紧张的。"),
   H("怕什么，你放松，我又不收你钱。")],
  [{ label: "乖乖当模特", reply: "她画完冲你一笑：你比想象中还上镜。", aff: 2 },
   { label: "在旁边捣乱", reply: "她笑着追着你画，特别开心。", aff: 2 },
   { label: "也学她画两笔", reply: "她握着你的手教你，气氛微妙。", aff: 2 }]);
DS("zhao", "画室", "library", "🖼️",
  [N("放学的画室没人，赵小雨给你看她的画。"),
   H("这是我最喜欢的一张，你猜画的是谁？")],
  [{ label: "画的是我？", reply: "她得意地笑：终于被你发现了。", aff: 2 },
   { label: "让她再画一幅", reply: "她说：那你得天天来陪我。", aff: 2 },
   { label: "夸她画得好", reply: "她嘴上嫌弃，心里乐开了花。", aff: 1 }]);
DS("zhao", "奶茶店", "canteen", "🧋",
  [N("赵小雨点了杯奶茶，神秘兮兮地看着你。"),
   H("我跟你说，我最近在研究色彩和口味的关系！")],
  [{ label: "请她喝奶茶", reply: "她眼睛一亮：你最好了！", aff: 2 },
   { label: "听她讲奇思妙想", reply: "她讲得眉飞色舞，你觉得很可爱。", aff: 1 },
   { label: "和她一起做奶茶", reply: "她把奶油抹在你鼻尖，笑得不行。", aff: 2 }]);
DS("zhao", "看画展", "gate", "🖌️",
  [N("你们一起去看一个画展，赵小雨看得很认真。"),
   H("总有一天，我也要在这里办画展。")],
  [{ label: "说我会是第一个观众", reply: "她转头看你，眼里有光。", aff: 2 },
   { label: "陪她一幅幅看", reply: "她拉着你的手讲了很多。", aff: 2 },
   { label: "给她讲你的看法", reply: "她认真地听，觉得你很懂她。", aff: 1 }]);
DS("zhao", "天台画夕阳", "rooftop", "🌅",
  [N("你们在天台等夕阳，赵小雨支起画板。"),
   H("你看，光只在这几分钟，错过就没了。")],
  [{ label: "陪她等到最后", reply: "她画出夕阳，也画下了你的侧影。", aff: 2 },
   { label: "帮她递画笔", reply: "她说：有你在，我才能抓住这一刻。", aff: 2 },
   { label: "安静地看她画画", reply: "她偷偷把你画进了画里。", aff: 1 }]);
DS("zhao", "逛文具店", "gate", "✏️",
  [N("赵小雨拉着你逛文具店，看到颜料挪不动脚。"),
   H("这盒颜料我惦记好久了……")],
  [{ label: "买给她", reply: "她抱着颜料，亲了你一下（飞快）。", aff: 2, money: -30 },
   { label: "陪她慢慢挑", reply: "她挑了很久，一直牵着你的手。", aff: 1 },
   { label: "送她一支好笔", reply: "她说这是她收到最好的礼物。", aff: 2, money: -15 }]);

/* ════════════════ 苏清颜 ════════════════ */
DS("su", "听她弹琴", "musicroom", "🎹",
  [N("放学后，苏清颜坐在钢琴前，看到你站在门口。"),
   H("……你要听吗？"),
   M("如果你愿意的话。"),
   H("那就坐近一点，这首是新写的。")],
  [{ label: "认真地听完", reply: "她轻声说：只有你能听出里面的情绪。", aff: 2 },
   { label: "夸她弹得好", reply: "她耳根微红，低头说：谢谢。", aff: 2 },
   { label: "请她教你", reply: "她坐在你旁边，手指轻轻碰到你的手。", aff: 2 }]);
DS("su", "图书馆", "library", "📖",
  [N("你和苏清颜在图书馆，她看专业书，你看她。"),
   H("……别总看我，看书。")],
  [{ label: "说你比书好看", reply: "她难得地笑了：你怎么这么会说话。", aff: 2 },
   { label: "认真看书", reply: "她偷偷看你，觉得你很专注。", aff: 1 },
   { label: "和她讨论题目", reply: "她耐心地讲给你听，靠得很近。", aff: 2 }]);
DS("su", "食堂", "canteen", "🍱",
  [N("苏清颜又因为练琴忘了吃饭，你找到她。"),
   H("啊……已经这个点了吗？")],
  [{ label: "帮她打份饭", reply: "她捧着饭盒，轻声说：有你真好。", aff: 2 },
   { label: "拉她去吃饭", reply: "她任由你拉着，心里很暖。", aff: 2 },
   { label: "给她带点吃的", reply: "她说：你怎么总记得我的事。", aff: 1 }]);
DS("su", "音乐教室", "musicroom", "🎼",
  [N("苏清颜给你看她写满的谱子。"),
   H("这首曲子，我想了很久，是写给一个人的。")],
  [{ label: "是写给我的吗", reply: "她红了脸，轻轻点了点头。", aff: 2 },
   { label: "让她弹给你听", reply: "她说：你是它唯一的听众。", aff: 2 },
   { label: "给曲子起名字", reply: "她想了想，用了你的名字。", aff: 2 }]);
DS("su", "天台", "rooftop", "🌙",
  [N("晚上你们在天台，苏清颜难得话多。"),
   H("其实……我平时不太和人说话，但你不一样。")],
  [{ label: "说我很荣幸", reply: "她看着你，眼神很温柔。", aff: 2 },
   { label: "陪她看夜景", reply: "她把头轻轻靠在你肩上。", aff: 2 },
   { label: "听她讲心里话", reply: "她说：谢谢你，让我愿意开口。", aff: 1 }]);
DS("su", "散步", "garden", "🍃",
  [N("你们在校园里安静地散步，晚风很轻。"),
   H("这样……很安静，也很好。")],
  [{ label: "牵起她的手", reply: "她没有躲，反而握紧了一点。", aff: 2 },
   { label: "和她聊音乐", reply: "她话不多，但每句都很认真。", aff: 1 },
   { label: "安静地陪着", reply: "她说：沉默也不尴尬，只有和你。", aff: 2 }]);

/* ════════════════ 许念 ════════════════ */
DS("xu", "打球", "playground", "🏀",
  [N("放学后球场，许念把球扔给你。"),
   H("来，单挑一局，输了请喝水。")],
  [{ label: "认真跟她打", reply: "她打完笑：痛快！你这朋友没白交。", aff: 2 },
   { label: "故意输给她", reply: "她一眼看穿：别让我，赢要赢得光明正大。", aff: 1 },
   { label: "让她教你投篮", reply: "她从身后扶着你的手，动作很标准。", aff: 2 }]);
DS("xu", "食堂", "canteen", "🍚",
  [N("训练后，许念饿得不行，拉着你冲食堂。"),
   H("今天我能吃三碗！你别看我。")],
  [{ label: "请她吃顿好的", reply: "她拍你肩膀：够意思！以后罩着你。", aff: 2 },
   { label: "陪她一起吃", reply: "她把鸡腿夹给你，说你太瘦。", aff: 2 },
   { label: "AA", reply: "她笑：行，你这兄弟我认了。", aff: 1 }]);
DS("xu", "喂猫", "garden", "🐱",
  [N("你们在角落遇到流浪猫，许念蹲下来，眼神一下变软。"),
   H("嘘，你看，它是不是很可爱？")],
  [{ label: "一起喂猫", reply: "她笑着说：没想到你也喜欢猫。", aff: 2 },
   { label: "看她撸猫", reply: "你第一次见她这么温柔。", aff: 1 },
   { label: "给猫带吃的", reply: "她说：你和猫一样，都让人喜欢。", aff: 2 }]);
DS("xu", "晨跑", "playground", "🏃",
  [N("清晨，许念已经在操场热身，看到你很意外。"),
   H("哟，你居然起这么早？来，一起跑！")],
  [{ label: "陪她跑几圈", reply: "她边跑边喊：你体力不错啊！", aff: 2 },
   { label: "比谁跑得快", reply: "她赢了，但笑得特别开心。", aff: 2 },
   { label: "跑慢点聊天", reply: "她放慢脚步，和你聊了一路。", aff: 1 }]);
DS("xu", "天台", "rooftop", "🌇",
  [N("训练结束，你们坐在天台吹风。许念难得安静。"),
   H("有时候……我也想不那么像个男生。")],
  [{ label: "说你也有温柔的一面", reply: "她愣了一下，笑得有点不好意思。", aff: 2 },
   { label: "陪她看夕阳", reply: "她小声说：只有在你面前，我才敢这样。", aff: 2 },
   { label: "听她讲烦恼", reply: "她说：谢谢你，不把我当哥们。", aff: 1 }]);
DS("xu", "看比赛", "playground", "🏆",
  [N("许念有场比赛，赛前她看到你来了。"),
   H("你来了？等我赢球，给你签名！")],
  [{ label: "在场边给她加油", reply: "她听到你的声音，打得更拼命。", aff: 2 },
   { label: "答应她赢了请吃饭", reply: "她冲你比了个心（飞快），然后上场。", aff: 2 },
   { label: "赛后给她递水", reply: "她接过水，笑得像个小孩。", aff: 1 }]);

/* ══════════════════════════════════════════════════════════
   模块十九：志向 / 成就 / 任务 扩充
   · 成就 30 → 50
   · 志向 6 → 8（艺术家 / 逍遥派）
   · 新增一批每日任务
   ══════════════════════════════════════════════════════════ */
(function () {
  /* ── 新成就（20） ── */
  var extraAch = [
    { id: "a31", icon: "💼", name: "勤工俭学", desc: "打工 5 班", cond: function (G) {
      if (window.X56Jobs) { var d = X56Jobs.load(); return d.shifts >= 5; } return false; } },
    { id: "a32", icon: "🪙", name: "自食其力", desc: "打工收入 ¥500", cond: function (G) {
      if (window.X56Jobs) { var d = X56Jobs.load(); return d.earned >= 500; } return false; } },
    { id: "a33", icon: "📖", name: "见多识广", desc: "触发 20 见闻", cond: function (G) {
      if (window.X56Life) { var d = X56Life.data(); return d.played >= 20; } return false; } },
    { id: "a34", icon: "🪞", name: "活出自己", desc: "触发 10 专属事件", cond: function (G) {
      if (window.X56Life) { var d = X56Life.data(); var n = 0; for (var k in d.seen) if (d.seen[k] && k.indexOf("p") === 0) n++; return n >= 10; } return false; } },
    { id: "a35", icon: "💕", name: "约会达人", desc: "完成 8 次约会", cond: function (G) {
      if (window.X56Date) { var d = X56Date.load(); var n = 0; for (var k in d.played) n++; return n >= 8; } return false; } },
    { id: "a36", icon: "💬", name: "无话不谈", desc: "和 6 人聊过天", cond: function (G) {
      if (window.X56Chat) { var d = X56Chat.load(); return Object.keys(d.chats).length >= 6; } return false; } },
    { id: "a37", icon: "🎪", name: "社团积极分子", desc: "加入社团", cond: function (G) { return !!G.club56; } },
    { id: "a38", icon: "🏆", name: "社团之光", desc: "社团达到 8 级", cond: function (G) {
      if (window.X56Clubs && G.club56) { var d = X56Clubs.load(); return (d.lv[G.club56] || 0) >= 8; } return false; } },
    { id: "a39", icon: "📷", name: "记录生活", desc: "发表 5 条朋友圈", cond: function (G) {
      if (window.X56Moments) { var d = X56Moments.load(); return d.myPosts.length >= 5; } return false; } },
    { id: "a40", icon: "👍", name: "点赞之交", desc: "点赞 20 次", cond: function (G) {
      if (window.X56Moments) { var d = X56Moments.load(); var n = 0; for (var k in d.liked) if (d.liked[k]) n++; return n >= 20; } return false; } },
    { id: "a41", icon: "🎨", name: "艺术人生", desc: "艺术志向进度满", cond: function (G) {
      var d = X56Core.load(); return d.aspiration === "art" && (G.knowledge + G.charm) >= 150; } },
    { id: "a42", icon: "🎈", name: "逍遥派", desc: "心情 90 且无逃课压力", cond: function (G) {
      return G.mood >= 90 && G.knowledge >= 40; } },
    { id: "a43", icon: "📚", name: "博览群书", desc: "阅读 30 次", cond: function (G) {
      return G.st && G.st.read >= 30; } },
    { id: "a44", icon: "🏃", name: "运动上瘾", desc: "运动 30 次", cond: function (G) {
      return G.st && G.st.exer >= 30; } },
    { id: "a45", icon: "💬", name: "健谈", desc: "聊天 30 次", cond: function (G) {
      return G.st && G.st.chat >= 30; } },
    { id: "a46", icon: "🌙", name: "夜猫子", desc: "熬夜 10 次", cond: function (G) {
      return G.st && G.st.slept !== undefined && G.sleep <= 20; } },
    { id: "a47", icon: "🧘", name: "养生大师", desc: "健康 95 且睡眠 80", cond: function (G) {
      return G.health >= 95 && G.sleep >= 80; } },
    { id: "a48", icon: "🎓", name: "毕业在望", desc: "存活 100 天", cond: function (G) { return G.day >= 100; } },
    { id: "a49", icon: "🌟", name: "全面发展", desc: "五项属性 ≥70", cond: function (G) {
      var ks = ["knowledge", "fitness", "charm", "support", "health"], n = 0;
      ks.forEach(function (k) { if (G[k] >= 70) n++; }); return n >= 5; } },
    { id: "a50", icon: "👑", name: "校园传奇", desc: "影响力 90 且魅力 85", cond: function (G) {
      return G.influence >= 90 && G.charm >= 85; } }
  ];
  extraAch.forEach(function (a) { X56Core.achievements.push(a); });

  /* ── 新志向（2） ── */
  X56Core.aspirations.push(
    { id: "art", name: "艺术家", icon: "🎨", color: "#b79af8",
      desc: "用画笔、音乐或文字，把心里的美留下来。",
      tasks: ["art1", "art2", "charm1", "read2"],
      stat: function (G) { return Math.max(G.charm, G.knowledge); } },
    { id: "free", name: "逍遥派", icon: "🎈", color: "#5ec8b8",
      desc: "不被定义，开心地过好每一天。",
      tasks: ["mood1", "chat3", "exer1", "noSkip"],
      stat: function (G) { return G.mood; } }
  );

  /* ── 新每日任务 ── */
  X56Core.taskPool.art1 = { name: "练习艺术 1 次", need: 1,
    get: function (G) { return (G.st && (G.st.dress || G.st.read)) ? 1 : 0; }, reward: 12, icon: "🎨" };
  X56Core.taskPool.art2 = { name: "记录灵感 1 次", need: 1,
    get: function (G) { return G.st && G.st.read >= 1 ? 1 : 0; }, reward: 14, icon: "🖌️" };
  X56Core.taskPool.mood1 = { name: "心情 +8", need: 8,
    get: function (G) { return Math.max(0, G.mood - (G._coreMoodBase || G.mood)); }, reward: 10, icon: "😄" };
  X56Core.taskPool.health1 = { name: "健康 +5", need: 5,
    get: function (G) { return Math.max(0, G.health - (G._coreHealthBase || G.health)); }, reward: 10, icon: "❤️" };
  X56Core.taskPool.job1 = { name: "打工 1 班", need: 1,
    get: function (G) { if (window.X56Jobs) { var d = X56Jobs.load(); return d.day === G.day && d.worked ? 1 : 0; } return 0; },
    reward: 6, icon: "💼" };
  X56Core.taskPool.date1 = { name: "约会 1 次", need: 1,
    get: function (G) { if (window.X56Date) { var d = X56Date.load(); return d._lastDay === G.day ? 1 : 0; } return 0; },
    reward: 10, icon: "💕" };
  X56Core.taskPool.life1 = { name: "探索见闻 1 次", need: 1,
    get: function (G) { if (window.X56Life) { var d = X56Life.data(); return d.day === G.day && d.draws >= 1 ? 1 : 0; } return 0; },
    reward: 8, icon: "📖" };

  /* 记录更多每日基线 */
  var origRoll = X56Core.rollTasks;
  X56Core.rollTasks = function (G) {
    origRoll.call(this, G);
    G._coreMoodBase = G.mood;
    G._coreHealthBase = G.health;
    this.save();
  };

  /* ── 把硬编码 /30 改成真实数量 ── */
  var N = X56Core.achievements.length;
  var origRender = X56Core.renderTab;
  X56Core.renderTab = function (tab) {
    origRender.call(this, tab);
    try {
      var body = $("x56CoreBody");
      if (body && tab === "ach") {
        /* 标题里的计数替换 */
        var t = body.querySelector(".x56-section-title");
        if (t) t.textContent = "🏆 成就墙（" + Object.keys(this.load().achievements).length + "/" + N + "）";
      }
    } catch (e) {}
  };
  /* 首页 tile 的 /30 */
  var origDash = X56Core.renderTab;
  X56Core.renderTab = function (tab) {
    origRender.call(this, tab);
    /* 用上面统一包装即可，无需重复 */
  };

  /* 首页成就计数分母替换：拦截 renderTab 后改 DOM */
  X56.inits.push(function () {
    var n2 = 0;
    var t = setInterval(function () {
      var tiles = $a("#x56CoreBody .dash-tile");
      tiles.forEach(function (tile) {
        var num = tile.querySelector(".dt-num");
        if (num && num.textContent.indexOf("/30") >= 0) {
          var done = Object.keys(X56Core.load().achievements).length;
          num.textContent = done + "/" + X56Core.achievements.length;
        }
      });
      if (++n2 > 200) clearInterval(t);
    }, 700);
  });
})();

/* ══════════════════════════════════════════════════════════
   模块二十：社团系统
   8 个社团，各有定位与成长；加入 1 个，每天可参加 1 次
   社团活动，积累经验升级，提升对应属性，解锁社团事件。
   ══════════════════════════════════════════════════════════ */
var X56Clubs = {
  KEY: "xz56_clubs_v1",
  clubs: [
    { id: "basketball", name: "篮球社", icon: "🏀", req: { fitness: 30 },
      desc: "热血的球场，训练、对抗、比赛。", eff: { fitness: 2, health: 1 }, stat: "体力" },
    { id: "football", name: "足球社", icon: "⚽", req: { fitness: 25 },
      desc: "绿茵场上奔跑，团队配合。", eff: { fitness: 2, support: 1 }, stat: "体力" },
    { id: "choir", name: "合唱团", icon: "🎤", req: { charm: 25 },
      desc: "和声、排练、登台演出。", eff: { charm: 2, mood: 1 }, stat: "魅力" },
    { id: "literature", name: "文学社", icon: "📝", req: { knowledge: 30 },
      desc: "读书、写作、出校刊。", eff: { knowledge: 2, charm: 1 }, stat: "学习" },
    { id: "art", name: "美术社", icon: "🎨", req: { charm: 20 },
      desc: "写生、创作、办画展。", eff: { charm: 2, knowledge: 1 }, stat: "魅力" },
    { id: "coding", name: "编程社", icon: "💻", req: { knowledge: 40 },
      desc: "写代码、做项目、打比赛。", eff: { knowledge: 2, influence: 1 }, stat: "学习" },
    { id: "photo", name: "摄影社", icon: "📷", req: { charm: 20 },
      desc: "记录光影，校园纪实。", eff: { charm: 2, mood: 1 }, stat: "魅力" },
    { id: "dance", name: "舞蹈社", icon: "💃", req: { fitness: 25, charm: 20 },
      desc: "形体、排练、舞台。", eff: { fitness: 1, charm: 2 }, stat: "魅力" }
  ],
  /* 社团活动时的小插曲 */
  events: [
    { p: 0.25, xp: 1.6, mood: 2, reply: "今天状态特别好，社长/老师当众表扬了你。" },
    { p: 0.45, xp: 1.0, mood: 1, reply: "一次平常的社团活动，你很投入。" },
    { p: 0.2, xp: 0.8, mood: 0, reply: "训练有点枯燥，但你坚持下来了。" },
    { p: 0.1, xp: 1.2, mood: 2, reply: "你在活动里认识了志趣相投的新朋友。" }
  ],
  load: function () {
    try {
      var raw = storageGet(this.KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { joined: null, lv: {}, xp: {}, acts: {}, lastDay: -1 };
  },
  save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },
  byId: function (id) {
    var c = null;
    this.clubs.forEach(function (x) { if (x.id === id) c = x; });
    return c;
  },
  meets: function (c) {
    var G = window.G;
    if (!G) return false;
    for (var k in c.req) if ((G[k] || 0) < c.req[k]) return false;
    return true;
  },
  levelOf: function (d, id) {
    var xp = d.xp[id] || 0;
    return Math.max(1, Math.floor(xp / 100) + 1);
  },
  join: function (id) {
    var G = window.G;
    if (!G) { toast("进入游戏后可加入社团"); return; }
    var c = this.byId(id);
    if (!this.meets(c)) { toast("还不满足加入条件"); return; }
    var d = this.load();
    d.joined = id;
    if (!d.lv[id]) { d.lv[id] = 1; d.xp[id] = 0; d.acts[id] = 0; }
    G.club56 = id;
    G.clubLv = this.levelOf(d, id);
    this.save(d);
    toast("已加入 " + c.name);
    this.panel();
  },
  leave: function () {
    var d = this.load();
    var G = window.G;
    if (G) { G.club56 = null; G.clubLv = 0; }
    d.joined = null;
    this.save(d);
    this.panel();
  },
  pickEvent: function () {
    var r = Math.random(), acc = 0;
    for (var i = 0; i < this.events.length; i++) {
      acc += this.events[i].p;
      if (r <= acc) return this.events[i];
    }
    return this.events[1];
  },
  activity: function () {
    var G = window.G;
    var d = this.load();
    if (!d.joined) { toast("你还没有加入社团"); return; }
    if (d.lastDay === G.day) { toast("今天已经参加过社团活动了"); return; }
    var c = this.byId(d.joined);
    var ev = this.pickEvent();
    d.lastDay = G.day;
    d.acts[c.id] = (d.acts[c.id] || 0) + 1;
    d.xp[c.id] = (d.xp[c.id] || 0) + Math.round(30 * ev.xp);
    var beforeLv = this.levelOf(d, c.id);
    /* 应用属性 */
    for (var k in c.eff) G[k] = (G[k] || 0) + c.eff[k];
    G.mood = (G.mood || 0) + ev.mood;
    var afterLv = this.levelOf(d, c.id);
    var leveled = afterLv > beforeLv;
    d.lv[c.id] = afterLv;
    G.clubLv = afterLv;
    this.save(d);
    if (typeof window.clampAll === "function") { try { window.clampAll(); } catch (e) {} }
    if (typeof window.upd === "function") { try { window.upd(); } catch (e) {} }
    var h = '<div class="club-result">' +
      '<div class="cr2-icon">' + c.icon + '</div>' +
      '<div class="cr2-title">' + c.name + " · 活动结束</div>" +
      '<div class="cr2-reply">' + ev.reply + "</div>" +
      '<div class="cr2-stats">' + c.stat + "相关属性提升　" + (ev.mood ? "🙂 心情 " + (ev.mood > 0 ? "+" : "") + ev.mood : "") + "</div>" +
      (leveled ? '<div class="cr2-level">🎉 社团升级！现在是 Lv.' + afterLv + "</div>"
        : '<div class="cr2-xp">当前 Lv.' + afterLv + " · 经验 " + (d.xp[c.id] % 100) + "/100</div>") +
      '<div class="cr2-cum">累计参加 ' + d.acts[c.id] + " 次</div>" +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button></div>';
    modal(h);
  },
  panel: function () {
    var G = window.G;
    if (!G) { toast("进入游戏后可参加社团"); return; }
    var d = this.load();
    var self = this;
    var joined = d.joined ? this.byId(d.joined) : null;
    var h = '<div class="clubs-panel"><h3>🎪 社团</h3>';
    if (joined) {
      h += '<div class="club-mine"><div class="cm2-head">' + joined.icon + " " + joined.name +
        " · Lv." + this.levelOf(d, joined.id) + '</div>' +
        '<div class="cm2-xp"><div class="cm2-fill" style="width:' + (d.xp[joined.id] % 100) + '%"></div></div>' +
        '<div class="cm2-btns"><button class="gbtn" id="clubAct">参加活动</button>' +
        '<button class="gbtn" id="clubLeave">退社</button></div></div>';
    } else {
      h += '<div class="quote">还没有加入社团，挑一个喜欢的吧（只能加入 1 个）。</div>';
    }
    h += '<div class="club-list">' +
      this.clubs.map(function (c) {
        var ok = self.meets(c);
        var reqTxt = Object.keys(c.req).map(function (k) {
          var lb = { fitness: "体力", charm: "魅力", knowledge: "学习" }[k] || k;
          return lb + "≥" + c.req[k];
        }).join("　");
        var isMine = d.joined === c.id;
        return '<div class="club-card' + (isMine ? " mine" : "") + (ok ? "" : " locked") + '">' +
          '<span class="cl2-icon">' + c.icon + '</span>' +
          '<div class="cl2-body"><div class="cl2-name">' + c.name + (isMine ? ' <span class="cl2-mine">已加入</span>' : "") +
          '</div><div class="cl2-desc">' + c.desc + '</div>' +
          '<div class="cl2-req">' + (reqTxt || "无要求") + '</div></div>' +
          (!isMine && ok ? '<button class="gbtn cl2-join" data-id="' + c.id + '">加入</button>' : "") +
          "</div>";
      }).join("") + "</div>" +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button></div>';
    modal(h);
    setTimeout(function () {
      on($("clubAct"), "click", function () { X56Clubs.activity(); });
      on($("clubLeave"), "click", function () { X56Clubs.leave(); });
      $a("#modalbox .cl2-join").forEach(function (b) {
        on(b, "click", function () { X56Clubs.join(b.getAttribute("data-id")); });
      });
    }, 80);
  }
};
window.X56Clubs = X56Clubs;

/* ══════════════════════════════════════════════════════════
   模块二十一：天气与季节事件（让天气真正影响你的一天）
   复用 PL 条件事件：晴/雨/雾/风/雪/季节
   ══════════════════════════════════════════════════════════ */

/* ── 晴天 ── */
PL(function (G) { return G.weather && G.weather.n.indexOf("晴") >= 0; }, "☀️", "大好晴天",
  "今天阳光特别好，教室里都暖洋洋的。",
  [["课间去操场晒太阳", { mood: 3, health: 2, fitness: 1 }, "晒得浑身暖，心情都亮了。", "心情+ 健康+"],
   ["把被子抱出去晒", { sleep: 2, mood: 1 }, "晚上被子上有阳光的味道。", "睡眠+"],
   ["和同学约课后打球", { support: 2, fitness: 1, mood: 1 }, "好天气就该活动。", "社交+ 体力+"]]);
PL(function (G) { return G.weather && G.weather.n.indexOf("晴") >= 0; }, "🌞", "午后犯困",
  "晴暖的午后，阳光晒得人犯困，老师讲题的声音像催眠曲。",
  [["坚持认真听讲", { knowledge: 2, sleep: -1 }, "你忍住困意，没漏重点。", "学习+"],
   ["洗把脸提神", { knowledge: 1, health: 1 }, "冷水脸一洗，清醒了。", "学习+ 健康+"],
   ["偷偷眯一下", { sleep: 2, knowledge: -1 }, "你眯了五分钟，漏了开头。", "睡眠+ 学习-"]]);

/* ── 雨天 ── */
PL(function (G) { return G.weather && G.weather.rain >= 2; }, "🌧️", "下雨了",
  "今天雨不小，走廊里全是湿脚印，早操取消了。",
  [["带伞去接没带伞的同学", { support: 3, charm: 2 }, "你帮同学一起撑伞，TA很感激。", "社交+ 魅力+"],
   ["在窗边听雨声看书", { knowledge: 2, mood: 2 }, "雨声里看书格外静。", "学习+ 心情+"],
   ["和同学分享干毛巾", { support: 2, mood: 1 }, "你想得很周到。", "社交+"]]);
PL(function (G) { return G.weather && G.weather.rain >= 1; }, "☔", "忘带伞",
  "放学雨还没停，你看着雨发愁。",
  [["冲回宿舍（快跑）", { fitness: 1, health: -1 }, "你淋成半湿，但没耽误。", "体力+ 健康-"],
   ["等雨小一点", { mood: 1, sleep: -1 }, "你在檐下等了好一会。", "心情+ 时间-"],
   ["找同学共伞", { support: 2, charm: 1 }, "你和同学挤在一把伞下。", "社交+ 魅力+"]]);
PL(function (G) { return G.weather && G.weather.rain >= 2; }, "🌧️", "衣服晾不干",
  "连着几天阴雨，洗的衣服摸起来总是潮的。",
  [["用吹风机吹干", { sleep: -1, mood: 1 }, "你吹了好一阵，总算干了。", "心情+ 时间-"],
   ["多备一套换洗衣物", { money: -30, health: 1 }, "你决定以后不再凑合。", "健康+ 金钱-"],
   ["将就着穿", { health: -1, mood: -1 }, "穿得有点不舒服。", "健康-"]]);
PL(function (G) { return G.weather && G.weather.n.indexOf("雷") >= 0; }, "⛈️", "雷阵雨",
  "轰隆隆的雷声，教室里灯闪了一下，几个同学叫出声。",
  [["安抚害怕的同学", { support: 2, charm: 2 }, "你镇定的样子让人安心。", "社交+ 魅力+"],
   ["安静等雨停", { mood: 1 }, "你看着窗外的闪电。", "心情+"],
   ["也被雷声吓到", { mood: -1 }, "你最害怕打雷。", "心情-"]]);

/* ── 阴天 ── */
PL(function (G) { return G.weather && G.weather.n.indexOf("阴") >= 0; }, "☁️", "阴天",
  "天灰蒙蒙的，白天走廊也开着灯，大家都有点提不起劲。",
  [["主动活跃一下气氛", { support: 2, mood: 2, charm: 1 }, "你的话让大家精神了点。", "社交+ 心情+"],
   ["埋头做自己的事", { knowledge: 1, mood: 1 }, "你习惯了这种天气。", "学习+ 心情+"],
   ["也跟着情绪低落", { mood: -1 }, "阴天让你有点丧。", "心情-"]]);

/* ── 雾天 ── */
PL(function (G) { return G.weather && G.weather.n.indexOf("雾") >= 0; }, "🌫️", "大雾",
  "湖那边起了雾，教学楼像泡在牛奶里，远处的树只剩轮廓。",
  [["在雾里走一段", { mood: 2, charm: 1 }, "雾里的校园像另一个世界。", "心情+ 魅力+"],
   ["注意安全慢慢走", { health: 1 }, "你扶着栏杆，小心路滑。", "健康+"],
   ["拍雾中的景", { charm: 2, mood: 1 }, "你拍到一组很有氛围的照片。", "魅力+ 心情+"]]);

/* ── 大风 ── */
PL(function (G) { return G.weather && G.weather.n.indexOf("风") >= 0; }, "💨", "大风天",
  "风很大，把走廊里的通知都刮到了楼下，你的头发也被吹乱。",
  [["帮老师捡散落的纸张", { support: 2, charm: 1 }, "你顶着风追了好一阵。", "社交+ 魅力+"],
   ["把头发扎好/戴好帽子", { charm: 1 }, "你做好了防风准备。", "魅力+"],
   ["在风里快步走", { fitness: 1, mood: 1 }, "风吹得你清醒了。", "体力+ 心情+"]]);

/* ── 温度（炎热/寒冷）── 按 wtemp ── */
PL(function (G) { return typeof G.wtemp === "number" && G.wtemp >= 26; }, "🥵", "有点热",
  "今天气温偏高，教室里有点闷。",
  [["多喝水", { health: 2, money: -3 }, "你及时补水，没中暑。", "健康+ 金钱-"],
   ["去通风的地方", { mood: 1, health: 1 }, "吹了吹风，舒服多了。", "心情+ 健康+"],
   ["买根冰棍", { mood: 2, money: -5 }, "冰棍下肚，瞬间清爽。", "心情+ 金钱-"]]);
PL(function (G) { return typeof G.wtemp === "number" && G.wtemp <= 16; }, "🥶", "降温了",
  "今天有点冷，你缩了缩脖子。",
  [["多穿件衣服", { health: 2, sleep: 1 }, "你保暖做得好。", "健康+ 睡眠+"],
   ["喝杯热饮", { mood: 2, money: -8 }, "热饮下肚，暖到心里。", "心情+ 金钱-"],
   ["硬扛着", { health: -1, mood: -1 }, "你冻得直哆嗦。", "健康-"]]);

/* ── 雨后放晴 ── */
PL(function (G) { return G.weather && G.weather.n.indexOf("晴") >= 0 && G.day > 1; }, "🌤️", "雨后新晴",
  "空气里有泥土和青草的味道，树叶绿得发亮。",
  [["深呼吸", { mood: 3, health: 1 }, "清新空气让你整个人都舒畅。", "心情+ 健康+"],
   ["去花园走走", { mood: 2, charm: 1 }, "你看到水珠挂在叶尖。", "心情+ 魅力+"],
   ["趁好天努力", { knowledge: 2, mood: 1 }, "好天气也有好心情学习。", "学习+ 心情+"]]);

/* ── 季节（秋）── */
PL(function (G) { return G.date && G.date.getMonth() >= 9 && G.date.getMonth() <= 11; }, "🍂", "秋天",
  "秋天到了，校园里的梧桐叶开始变黄，落了一地。",
  [["踩落叶玩", { mood: 2, fitness: 1 }, "咔嚓咔嚓的声音让你很解压。", "心情+ 体力+"],
   ["捡一片好看的叶子夹书里", { charm: 1, mood: 1 }, "你把秋天收藏了起来。", "魅力+ 心情+"],
   ["添件薄外套", { health: 1 }, "秋天早晚温差大。", "健康+"]]);
PL(function (G) { return G.date && G.date.getMonth() >= 9 && G.date.getMonth() <= 11; }, "🌰", "秋日限定",
  "校门口的小店开始卖糖炒栗子和烤红薯了。",
  [["买一份热乎的", { mood: 3, money: -12 }, "捧着栗子，又暖又香。", "心情+ 金钱-"],
   ["和同学分着吃", { support: 2, mood: 2 }, "你把温暖分享了出去。", "社交+ 心情+"],
   ["忍住不吃", { money: 0 }, "你决定省下这笔钱。", "——"]]);

/* ══════════════════════════════════════════════════════════
   模块二十二：技能练习（爱好成长）
   你在开局选的爱好可以反复练习、积累经验、升级；
   练习消耗精力、影响心情，高级别会带来社团/成就/事件优势。
   每天 3 次练习机会。
   ══════════════════════════════════════════════════════════ */
var X56Skills = {
  KEY: "xz56_skill_practice_v1",
  /* 爱好归类（决定练习收益） */
  groups: {
    sport: ["篮球", "足球", "跑步", "游泳", "羽毛球", "舞蹈"],
    art: ["声乐", "钢琴", "绘画", "书法", "吉他", "写作", "摄影"],
    mind: ["编程", "辩论", "手工", "烘焙", "动漫", "游戏"]
  },
  groupOf: function (name) {
    for (var g in this.groups)
      if (this.groups[g].indexOf(name) >= 0) return g;
    return "mind";
  },
  emoji: {
    "声乐": "🎤", "钢琴": "🎹", "绘画": "🎨", "书法": "🖌️", "舞蹈": "💃",
    "篮球": "🏀", "足球": "⚽", "跑步": "🏃", "乒乓球": "🏓", "编程": "💻",
    "摄影": "📷", "写作": "✍️", "辩论": "🗣️", "手工": "🧩", "吉他": "🎸",
    "羽毛球": "🏸", "游泳": "🏊", "动漫": "🎬", "游戏": "🎮", "烘焙": "🧁"
  },
  load: function () {
    try {
      var raw = storageGet(this.KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { day: -1, practices: 0, skills: {}, totalSessions: 0 };
  },
  save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },
  /* 同步开局给的初始爱好（15 级） */
  sync: function (d) {
    var G = window.G;
    if (G && G.skill56) {
      for (var h in G.skill56) {
        if (!d.skills[h]) d.skills[h] = { lv: G.skill56[h], xp: 0 };
      }
    }
  },
  /* 练习：返回结果 */
  practice: function (name) {
    var G = window.G;
    if (!G) { toast("进入游戏后可练习"); return; }
    var d = this.load();
    if (d.day !== G.day) { d.day = G.day; d.practices = 0; }
    if (d.practices >= 3) { toast("今天练习 3 次了，明天再来"); return; }
    this.sync(d);
    if (!d.skills[name]) d.skills[name] = { lv: 0, xp: 0 };
    d.practices++;
    d.totalSessions++;
    /* 练习量：心情好练得快，MBTI/状态影响 */
    var gain = 10 + Math.floor(Math.random() * 7);
    if (G.mood >= 70) gain += 3;
    var g = this.groupOf(name);
    var statEff = { mood: 0 };
    d.skills[name].xp += gain;
    /* 升级 */
    var sk = d.skills[name];
    var leveled = false;
    while (sk.xp >= 100 && sk.lv < 100) {
      sk.xp -= 100;
      sk.lv++;
      leveled = true;
    }
    /* 消耗/收益 */
    if (g === "sport") {
      G.fitness += 1; G.health += 1; statEff = { fitness: 1, health: 1 };
    } else if (g === "art") {
      G.charm += 1; G.mood += 1; statEff = { charm: 1, mood: 1 };
    } else {
      G.knowledge += 1; G.mood += 1; statEff = { knowledge: 1, mood: 1 };
    }
    G.sleep = (G.sleep || 0) - 4;
    G.skill56 = G.skill56 || {};
    G.skill56[name] = sk.lv;
    this.save(d);
    if (typeof window.clampAll === "function") { try { window.clampAll(); } catch (e) {} }
    if (typeof window.upd === "function") { try { window.upd(); } catch (e) {} }
    var h = '<div class="skill-result">' +
      '<div class="sk3-icon">' + (this.emoji[name] || "⭐") + '</div>' +
      '<div class="sk3-title">' + name + " · 练习结束</div>" +
      '<div class="sk3-reply">' + (leveled ? "你感觉自己在「" + name + "」上更进了一步！" : "一次踏实的练习，你积累了经验。") + "</div>" +
      (leveled ? '<div class="sk3-level">🎉 技能升级！现在 Lv.' + sk.lv + "</div>"
        : '<div class="sk3-xp">Lv.' + sk.lv + " · 经验 " + sk.xp + "/100</div>") +
      '<div class="sk3-eff">😴 精力消耗　' + this.effText(statEff) + "</div>" +
      '<div class="sk3-cum">今天还可练习 ' + (3 - d.practices) + " 次</div>" +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button></div>';
    modal(h);
  },
  effText: function (e) {
    var lb = { fitness: "💪 体力", health: "❤️ 健康", charm: "💫 魅力", mood: "🙂 心情", knowledge: "📘 学习" };
    return Object.keys(e).map(function (k) { return lb[k] + " +1"; }).join("　");
  },
  panel: function () {
    var G = window.G;
    if (!G) { toast("进入游戏后可练习"); return; }
    var d = this.load();
    this.sync(d);
    var names = Object.keys(d.skills);
    var h = '<div class="skills-panel"><h3>🎯 技能练习</h3>' +
      '<div class="quote">今天还可练习 <b>' + (d.day === G.day ? 3 - d.practices : 3) + "</b> 次。多练才能变强。</div>";
    if (!names.length) h += '<div class="dim">你还没有爱好，回主界面重新创建角色时选择。</div>';
    h += '<div class="sk3-list">' +
      names.map(function (name) {
        var sk = d.skills[name];
        var em = X56Skills.emoji[name] || "⭐";
        return '<div class="sk3-card">' +
          '<div class="sk3-head"><span class="sk3-emoji">' + em + '</span>' +
          '<div class="sk3-name">' + name + ' <span class="sk3-lv">Lv.' + sk.lv + "</span></div>" +
          '<button class="gbtn sk3-go" data-name="' + name + '">练习</button></div>' +
          '<div class="sk3-bar"><div class="sk3-fill" style="width:' + sk.xp + '%"></div></div></div>';
      }).join("") + "</div>" +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button></div>';
    modal(h);
    setTimeout(function () {
      $a("#modalbox .sk3-go").forEach(function (b) {
        on(b, "click", function () { X56Skills.practice(b.getAttribute("data-name")); });
      });
    }, 80);
  }
};
window.X56Skills = X56Skills;

/* ══════════════════════════════════════════════════════════
   模块二十三：休闲时光（放松/自我调节）
   每天 1 次“放松”，从 8 种活动里选，各有得失；
   劳逸结合，状态才撑得住。
   ══════════════════════════════════════════════════════════ */
var X56FreeTime = {
  KEY: "xz56_freetime_v1",
  activities: [
    { id: "movie", icon: "🎬", name: "看电影/追剧",
      desc: "沉浸两小时，暂时忘记现实。",
      eff: { mood: 4, sleep: -2, knowledge: 0 },
      reply: "剧情很精彩，你跟着笑也跟着哭，放松了。" },
    { id: "game", icon: "🎮", name: "打游戏",
      desc: "痛快玩一局，注意别上头。",
      eff: { mood: 4, sleep: -3, knowledge: -1 },
      reply: "游戏里的你所向披靡，时间也过得飞快。" },
    { id: "video", icon: "📱", name: "刷短视频",
      desc: "碎片快乐，一不小心就很久。",
      eff: { mood: 3, sleep: -2 },
      reply: "你刷到很晚，笑出了声，也有点空虚。" },
    { id: "sport", icon: "🏃", name: "运动出汗",
      desc: "健康的放松，越累越爽。",
      eff: { mood: 3, fitness: 2, health: 1, sleep: -1 },
      reply: "出了一身汗，压力都被冲走了。" },
    { id: "shop", icon: "🛍️", name: "逛街",
      desc: "看看新鲜东西，可能忍不住花钱。",
      eff: { mood: 3, money: -40 },
      reply: "逛了一下午，买了些小玩意，心情很好。" },
    { id: "meal", icon: "🍜", name: "约朋友吃饭",
      desc: "边吃边聊，感情升温。",
      eff: { mood: 3, support: 2, money: -25 },
      reply: "和朋友一顿饭，从近况聊到梦想。" },
    { id: "alone", icon: "🔋", name: "独处充电",
      desc: "一个人待着，什么也不做。",
      eff: { mood: 2, sleep: 2 },
      reply: "安静下来，你的精力慢慢恢复了。" },
    { id: "sleep", icon: "🛌", name: "早睡补觉",
      desc: "好好睡一觉，什么都没有健康重要。",
      eff: { sleep: 5, health: 2, mood: 1 },
      reply: "你难得早睡，第二天元气满满。" },
    { id: "diary", icon: "📓", name: "写日记",
      desc: "整理今天的情绪与想法。",
      eff: { mood: 2, charm: 1, knowledge: 1 },
      reply: "写下今天的事，你理清了很多。" },
    { id: "walk", icon: "🌳", name: "散步",
      desc: "慢慢走走，放空脑子。",
      eff: { mood: 2, health: 1, sleep: 1 },
      reply: "晚风很轻，你走了几圈，心也静了。" }
  ],
  load: function () {
    try {
      var raw = storageGet(this.KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { day: -1, done: false, total: 0, last: "" };
  },
  save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },
  do: function (id) {
    var G = window.G;
    if (!G) { toast("进入游戏后可放松"); return; }
    var d = this.load();
    if (d.day !== G.day) { d.day = G.day; d.done = false; }
    if (d.done) { toast("今天已经放松过了"); return; }
    var a = null;
    this.activities.forEach(function (x) { if (x.id === id) a = x; });
    if (!a) return;
    d.done = true;
    d.total++;
    d.last = a.name;
    for (var k in a.eff) {
      if (a.eff[k] && typeof G[k] === "number") G[k] += a.eff[k];
    }
    this.save(d);
    if (typeof window.clampAll === "function") { try { window.clampAll(); } catch (e) {} }
    if (typeof window.upd === "function") { try { window.upd(); } catch (e) {} }
    var h = '<div class="ft-result">' +
      '<div class="ft-icon">' + a.icon + '</div>' +
      '<div class="ft-title">' + a.name + "</div>" +
      '<div class="ft-reply">' + a.reply + "</div>" +
      '<div class="ft-eff">' + this.effText(a.eff) + "</div>" +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button></div>';
    modal(h);
  },
  effText: function (e) {
    var lb = { mood: "🙂 心情", sleep: "😴 睡眠", fitness: "💪 体力", health: "❤️ 健康",
      support: "✊ 支持", knowledge: "📘 学习", charm: "💫 魅力" };
    var parts = [];
    for (var k in e) {
      if (!e[k]) continue;
      parts.push(lb[k] + " " + (e[k] > 0 ? "+" : "") + e[k]);
    }
    return parts.join("　") || "——";
  },
  panel: function () {
    var G = window.G;
    if (!G) { toast("进入游戏后可放松"); return; }
    var d = this.load();
    if (d.day !== G.day) { d.day = G.day; d.done = false; }
    var h = '<div class="ft-panel"><h3>🌿 休闲时光</h3>' +
      '<div class="quote">今天' + (d.done ? "已经放松过了。" : '<b>还可以放松</b>，劳逸结合。') +
      '<br>累计放松 ' + d.total + " 次</div>" +
      '<div class="ft-grid">' +
      this.activities.map(function (a) {
        return '<button class="ft-card" data-id="' + a.id + '"><span class="ft-c-icon">' + a.icon + "</span>" +
          '<span class="ft-c-name">' + a.name + "</span>" +
          '<span class="ft-c-desc">' + a.desc + "</span></button>";
      }).join("") + "</div>" +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button></div>';
    modal(h);
    var self = this;
    setTimeout(function () {
      $a("#modalbox .ft-card").forEach(function (b) {
        on(b, "click", function () { self.do(b.getAttribute("data-id")); });
      });
    }, 80);
  }
};
window.X56FreeTime = X56FreeTime;

/* ══════════════════════════════════════════════════════════
   模块二十四：自由模式恋爱日常（有恋人时的专属事件）
   让恋爱在自由模式里持续有温度。
   ══════════════════════════════════════════════════════════ */

/* 情侣日常 */
PL(function (G) { return !!G.lover; }, "💑", "一起上学",
  "早上你和恋人在校门口碰到，一起走进教室。",
  [["牵着手走一段", { charm: 2, mood: 3, support: 1 }, "你们在没人的小路牵了手。", "心情+ 魅力+"],
   ["互相打气", { knowledge: 1, mood: 2 }, "你们约定今天一起努力。", "学习+ 心情+"],
   ["带份早餐给TA", { money: -8, mood: 2, support: 1 }, "TA收到早餐，开心地笑。", "心情+ 金钱-"]]);
PL(function (G) { return !!G.lover; }, "💌", "课间的小纸条",
  "你在课桌里发现恋人塞来的小纸条。",
  [["回一张写满情话的纸条", { charm: 2, mood: 3 }, "TA看完纸条，脸红着冲你笑。", "心情+ 魅力+"],
   ["画个小表情", { mood: 2, charm: 1 }, "TA被你逗笑了。", "心情+ 魅力+"],
   ["当面道谢", { mood: 2, support: 1 }, "你跑到TA座位旁说了句谢谢。", "心情+"]]);
PL(function (G) { return !!G.lover; }, "🍱", "一起吃饭",
  "午饭时，恋人在食堂帮你占好了位置。",
  [["把自己的菜分TA", { health: 1, mood: 2, support: 1 }, "你们像所有情侣一样分饭菜。", "心情+ 健康+"],
   ["边吃边聊今天的事", { mood: 2, support: 1 }, "一顿饭吃得很开心。", "心情+ 社交+"],
   ["你请这一顿", { money: -15, mood: 2 }, "TA嘴上说不用，心里很甜。", "心情+ 金钱-"]]);
PL(function (G) { return !!G.lover; }, "🌙", "放学路上",
  "放学后，你们一起走在校园的路上。",
  [["多陪TA走一段", { mood: 3, charm: 1, sleep: -1 }, "你们绕了远路，聊了很多。", "心情+ 时间-"],
   ["一起看夕阳", { mood: 2, charm: 1 }, "光落在你们身上，很安静。", "心情+ 魅力+"],
   ["送TA到宿舍/门口", { mood: 2, support: 1 }, "TA回头看了你好几眼。", "心情+"]]);
PL(function (G) { return !!G.lover; }, "🤗", "TA不开心",
  "你发现恋人今天情绪不高。",
  [["抱紧TA", { mood: 3, support: 2, charm: 1 }, "一个拥抱让TA好了大半。", "心情+ 魅力+"],
   ["认真听TA说", { mood: 2, support: 2 }, "你陪TA把烦恼说完。", "心情+ 社交+"],
   ["想办法逗TA笑", { charm: 2, mood: 2 }, "TA终于被你逗笑了。", "心情+ 魅力+"]]);
PL(function (G) { return !!G.lover; }, "🎁", "小惊喜",
  "你想给恋人准备一点惊喜。",
  [["送一个小礼物", { money: -25, mood: 3, charm: 2 }, "TA收到礼物特别感动。", "心情+ 魅力+ 金钱-"],
   ["写一封信", { mood: 2, charm: 2 }, "你把说不出口的话都写了进去。", "心情+ 魅力+"],
   ["记住TA的喜好", { support: 2, mood: 1 }, "你的用心TA都记着。", "社交+ 心情+"]]);
PL(function (G) { return !!G.lover; }, "💬", "深夜的消息",
  "晚上恋人发来消息，想和你说说话。",
  [["陪TA聊到深夜", { mood: 3, support: 1, sleep: -2 }, "你们的感情在深夜里升温。", "心情+ 熬夜"],
   ["聊两句道晚安", { mood: 2, sleep: 1 }, "TA甜甜地说了句晚安。", "心情+ 睡眠+"],
   ["说困了先睡", { mood: 1 }, "你困得不行，TA表示理解。", "心情+"]]);
PL(function (G) { return !!G.lover; }, "🌧️", "共一把伞",
  "下雨了，你和恋人只有一把伞。",
  [["把伞都倾向TA", { mood: 3, charm: 1, health: -1 }, "TA发现你湿了半边，心疼又感动。", "心情+ 魅力+ 健康-"],
   ["紧紧靠在一起", { mood: 3, charm: 1 }, "你们挤在一把伞下，特别近。", "心情+ 魅力+"],
   ["一起等雨停", { mood: 2, sleep: -1 }, "你们在檐下依偎着。", "心情+ 时间-"]]);

/* 吵架与和好（低关系时） */
PL(function (G) { return !!G.lover && G.relation < 50; }, "💢", "闹别扭",
  "你和恋人因为一点小事闹了别扭，气氛有点僵。",
  [["主动道歉", { mood: 2, support: 2, charm: 1 }, "你们很快和好，TA也软了。", "心情+ 社交+"],
   ["冷静地沟通", { support: 2, knowledge: 1 }, "你们把话说开，反而更好了。", "社交+ 学习+"],
   ["先冷一冷", { mood: -1, support: -1 }, "冷战让你们都难受。", "心情- 社交-"]]);
PL(function (G) { return !!G.lover && G.relation < 40; }, "🥺", "误会",
  "恋人好像误会了你什么，看你眼神不太对。",
  [["当面解释清楚", { support: 3, mood: 1 }, "误会解开，你们和好如初。", "社交+"],
   ["用行动证明", { charm: 2, support: 2 }, "TA看到你的用心，相信你。", "魅力+ 社交+"],
   ["觉得TA该懂你", { mood: -2, support: -1 }, "误会没有立刻解开。", "心情- 社交-"]]);

/* 还没恋人：暗恋/心动 */
PL(function (G) { return !G.lover && G.relation >= 50; }, "👀", "在意的人",
  "最近有一个人总在你脑子里出现。",
  [["主动靠近", { charm: 2, support: 2, mood: 1 }, "你们的关系拉近了一点。", "魅力+ 社交+"],
   ["偷偷关注", { mood: 1, charm: 1 }, "你把这份心动藏在心里。", "心情+ 魅力+"],
   ["约TA一起做点什么", { support: 2, mood: 2, money: -10 }, "TA答应了，你很期待。", "心情+ 社交+"]]);
PL(function (G) { return !G.lover; }, "💗", "心动的瞬间",
  "你莫名对某个人有了点心动的感觉。",
  [["记住这种感觉", { mood: 2, charm: 1 }, "你开始期待每一次相遇。", "心情+ 魅力+"],
   ["去交个朋友", { support: 2, charm: 1 }, "你决定先从认识开始。", "社交+ 魅力+"],
   ["专心学习", { knowledge: 1, mood: 1 }, "你把心思先放学习上。", "学习+ 心情+"]]);

/* 纪念日氛围 */
PL(function (G) { return !!G.lover; }, "❤️", "有你们的日子",
  "和TA在一起的日子，你觉得连平凡的日常都有光。",
  [["珍惜眼前人", { mood: 3, support: 1, charm: 1 }, "你很庆幸能遇见TA。", "心情+ 魅力+"],
   ["一起努力变好", { knowledge: 1, mood: 2 }, "你们约定一起成为更好的人。", "学习+ 心情+"]]);

/* ══════════════════════════════════════════════════════════
   模块二十五：校园群像（老师/班委/集体 事件）
   ══════════════════════════════════════════════════════════ */
PL(function (G) { return true; }, "🧑‍🏫", "班主任的叮嘱",
  "班主任把你叫到办公室，语重心长地和你谈了谈。",
  [["认真听并点头", { knowledge: 1, support: 1 }, "老师觉得你态度端正。", "学习+ 社交+"],
   ["说出你的想法", { charm: 1, support: 1 }, "老师很认真地听你说。", "魅力+ 社交+"],
   ["左耳进右耳出", { support: -1 }, "老师看了你一眼，叹了口气。", "社交-"]]);
PL(function (G) { return true; }, "📢", "卫生值日",
  "今天轮到你值日，要打扫教室、擦黑板。",
  [["认真打扫干净", { support: 2, charm: 1, fitness: 1 }, "教室窗明几净，你很有成就感。", "社交+ 体力+"],
   ["随便扫一扫", { support: 0 }, "勉强过得去。", "——"],
   ["和同学换个值日", { support: 1 }, "你答应下次帮TA。", "社交+"]]);
PL(function (G) { return true; }, "📋", "搬作业",
  "老师让你帮忙把一摞作业本搬到办公室。",
  [["爽快帮忙", { support: 2, fitness: 1 }, "老师连声道谢。", "社交+ 体力+"],
   ["找同学一起搬", { support: 1 }, "你们路上聊了会天。", "社交+"],
   ["推脱", { support: -1 }, "你抱着书不想动。", "社交-"]]);
PL(function (G) { return true; }, "🎒", "忘带东西",
  "你翻遍书包，发现作业本/课本落在宿舍了。",
  [["飞奔回去取", { fitness: 1, sleep: -1 }, "你赶在上课前跑了回来。", "体力+ 时间-"],
   ["找同学借", { support: 1 }, "同学把课本借给你一起看。", "社交+"],
   ["向老师坦白", { support: 0, mood: -1 }, "老师让你下次注意。", "心情-"]]);
PL(function (G) { return true; }, "🍽️", "排队打饭",
  "午饭高峰，每个窗口都排着长队。",
  [["耐心排队", { mood: 1, health: 1 }, "你终于打到了想吃的菜。", "健康+ 心情+"],
   ["去人少的窗口", { health: 1, mood: 1 }, "你错开了高峰。", "健康+ 心情+"],
   ["吃点零食凑合", { money: -5, health: -1 }, "你随便垫了垫。", "健康-"]]);
PL(function (G) { return true; }, "🔔", "课间十分钟",
  "课间，你在想要怎么利用这十分钟。",
  [["趴在桌上休息", { sleep: 2 }, "你眯了一会。", "睡眠+"],
   ["去走廊走走", { fitness: 1, mood: 1 }, "你活动了一下。", "体力+ 心情+"],
   ["整理笔记", { knowledge: 1 }, "你把刚才的内容过了一遍。", "学习+"],
   ["和同学聊天", { support: 1, mood: 1 }, "你放松了一下。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "📝", "黑板上的通知",
  "教室后面黑板写着各种通知和活动报名。",
  [["报名一个活动", { support: 2, mood: 1 }, "你给自己找了件事做。", "社交+ 心情+"],
   ["看看就好", { knowledge: 1 }, "你了解了最近的安排。", "学习+"],
   ["不关心", { support: 0 }, "你转身回到座位。", "——"]]);
PL(function (G) { return true; }, "🎤", "集体合唱",
  "音乐课/活动，全班一起合唱一首歌。",
  [["大声唱", { charm: 2, mood: 2 }, "你唱得很投入。", "魅力+ 心情+"],
   ["小声跟着", { mood: 1 }, "你跟着哼了几句。", "心情+"],
   ["不太好意思", { charm: 0 }, "你张了张嘴没出声。", "——"]]);
PL(function (G) { return true; }, "🧊", "教室空调",
  "教室里空调开得有点低，你觉得冷。",
  [["多穿件外套", { health: 1 }, "你做好了保暖。", "健康+"],
   ["和同学挤一挤", { support: 1, mood: 1 }, "你和同桌笑了起来。", "社交+ 心情+"],
   ["忍着", { health: -1 }, "你冻得缩了缩。", "健康-"]]);
PL(function (G) { return true; }, "📊", "成绩发榜",
  "老师把这次的测验成绩念了出来。",
  [["考得不错，继续保持", { mood: 2, charm: 1 }, "你对自己的努力很满意。", "心情+ 魅力+"],
   ["不太理想，找原因", { knowledge: 1, mood: 1 }, "你分析了错在哪。", "学习+ 心情+"],
   ["无所谓", { mood: 1, knowledge: -1 }, "你不是很在意成绩。", "心情+ 学习-"]]);
PL(function (G) { return true; }, "🪑", "换座位",
  "老师要重新调整座位，大家都很紧张。",
  [["希望和好朋友坐", { support: 2, mood: 1 }, "你心想能和朋友一起就好了。", "社交+ 心情+"],
   ["希望坐个好位置学习", { knowledge: 1 }, "你更看重学习。", "学习+"],
   ["坐哪都行", { mood: 1 }, "你心态很好。", "心情+"]]);
PL(function (G) { return true; }, "🏫", "升旗仪式",
  "周一早晨，全校在操场列队升旗。",
  [["站姿端正认真", { support: 1, charm: 1 }, "你认真地参加了仪式。", "社交+ 魅力+"],
   ["和旁边同学小声说话", { support: 0, mood: 1 }, "你被老师瞪了一眼。", "心情+"],
   ["认真听国旗下讲话", { knowledge: 1 }, "你听进去了一些内容。", "学习+"]]);
PL(function (G) { return true; }, "🧹", "大扫除",
  "全班一起做大扫除，要擦窗户、拖地。",
  [["主动干最累的活", { support: 2, fitness: 1, charm: 1 }, "同学都看在眼里。", "社交+ 体力+"],
   ["做好分到的部分", { support: 1 }, "你按时完成了。", "社交+"],
   ["找借口躲一躲", { support: -1 }, "你想偷个懒。", "社交-"]]);
PL(function (G) { return true; }, "📖", "早读氛围",
  "早自习，教室里读书声此起彼伏。",
  [["大声背记", { knowledge: 2, charm: 1 }, "你读得很投入，记住了不少。", "学习+ 魅力+"],
   ["默看", { knowledge: 1 }, "你安静地看了一节。", "学习+"],
   ["走神犯困", { knowledge: -1, sleep: 1 }, "你有点没睡醒。", "睡眠+ 学习-"]]);
PL(function (G) { return true; }, "🎒", "宿舍检查",
  "宿管要检查宿舍卫生和内务。",
  [["把被子叠好、收拾干净", { support: 1, fitness: 1 }, "你们宿舍被表扬了。", "社交+ 体力+"],
   ["随便整理", { support: 0 }, "勉强过关。", "——"],
   ["来不及整理", { support: -1, mood: -1 }, "宿舍被扣分了。", "社交- 心情-"]]);

/* ══════════════════════════════════════════════════════════
   模块二十六：节日与季节里程碑（校园一年里的大日子）
   条件：按 G.date 的月份/日期
   ══════════════════════════════════════════════════════════ */
/* 中秋（农历近似，用氛围触发，宽松） */
PL(function (G) { return G.date && G.date.getMonth() === 9 && G.day % 9 === 0; }, "🥮", "中秋节",
  "学校发了月饼，晚上班里组织一起赏月。",
  [["和同学分月饼吃", { mood: 3, support: 2, charm: 1 }, "你把月饼分给了大家，很温馨。", "心情+ 社交+"],
   ["给家里打个电话", { mood: 2, support: 1 }, "你很想家，听到声音就好了。", "心情+"],
   ["和在意的人一起赏月", { mood: 3, charm: 2 }, "月光下，气氛有些微妙。", "心情+ 魅力+"]]);
/* 国庆 */
PL(function (G) { return G.date && G.date.getMonth() === 9 && G.date.getDate() <= 5; }, "🇨🇳", "国庆假期",
  "国庆放假，校园里难得安静。",
  [["好好休息放松", { mood: 3, sleep: 3, health: 1 }, "你睡到自然醒，元气满满。", "心情+ 睡眠+"],
   ["把作业写完", { knowledge: 2, mood: 1 }, "你计划先苦后甜。", "学习+ 心情+"],
   ["和同学出去玩", { mood: 3, support: 2, money: -30 }, "你度过了充实的假期。", "心情+ 社交+ 金钱-"]]);
/* 期中考试周 */
PL(function (G) { return G.date && G.date.getMonth() === 10 && G.day % 6 === 0; }, "📝", "期中考试",
  "期中考试周，教室里的空气都紧张了起来。",
  [["认真复习备考", { knowledge: 3, grade: 2, sleep: -2 }, "你准备充分，发挥稳定。", "学习+ 成绩+ 熬夜"],
   ["调整好心态", { mood: 2, knowledge: 1 }, "你不慌不忙，状态不错。", "心情+ 学习+"],
   ["有点紧张", { mood: -1, knowledge: 1 }, "你努力让自己平静。", "学习+ 心情-"]]);
/* 深秋 */
PL(function (G) { return G.date && G.date.getMonth() === 10; }, "🌫️", "深秋",
  "深秋的早晨有霜，天越来越冷，天亮得也晚了。",
  [["注意保暖", { health: 2 }, "你穿得暖和，没着凉。", "健康+"],
   ["喝杯热豆浆", { mood: 2, money: -5 }, "热乎的早点很治愈。", "心情+ 金钱-"],
   ["早起背书记忆好", { knowledge: 2, health: -1 }, "你顶着寒意早起。", "学习+ 健康-"]]);
/* 十二月 / 元旦准备 */
PL(function (G) { return G.date && G.date.getMonth() === 11; }, "❄️", "岁末",
  "一年快到头了，班里在准备元旦晚会。",
  [["报名节目", { charm: 2, mood: 2, support: 1 }, "你决定上台展示一下。", "魅力+ 心情+"],
   ["帮忙布置", { support: 2, fitness: 1 }, "你为班级出了一份力。", "社交+ 体力+"],
   ["安心学习到年底", { knowledge: 2 }, "你把心思放在学习上。", "学习+"]]);
/* 元旦晚会 */
PL(function (G) { return G.date && G.date.getMonth() === 11 && G.date.getDate() >= 28; }, "🎉", "元旦晚会",
  "教室里挂满气球和彩带，大家一起跨年。",
  [["上台表演", { charm: 3, mood: 3, support: 1 }, "你的表演赢得满堂彩。", "魅力+ 心情+"],
   ["和大家一起倒数", { mood: 3, support: 2 }, "新的一年在欢呼声里开始。", "心情+ 社交+"],
   ["和在意的人一起跨年", { mood: 3, charm: 2 }, "你们在人群里悄悄靠近。", "心情+ 魅力+"]]);
/* 初雪 */
PL(function (G) { return G.date && G.date.getMonth() === 11 && G.day % 12 === 0; }, "❄️", "初雪",
  "今天下雪了，校园里一片白，大家都很兴奋。",
  [["去操场玩雪", { mood: 3, fitness: 1, health: -1 }, "你打雪仗、堆雪人，特别开心。", "心情+ 体力+ 健康-"],
   ["拍雪后的校园", { charm: 2, mood: 2 }, "你拍到了干净的雪景。", "魅力+ 心情+"],
   ["注意保暖", { health: 1, mood: 1 }, "你穿得厚实，没有冻着。", "健康+ 心情+"]]);
/* 期末考试 */
PL(function (G) { return G.date && G.date.getMonth() === 0 && G.day % 6 === 0; }, "📚", "期末考试",
  "期末考试临近，这一学期的成果要见分晓了。",
  [["全力冲刺复习", { knowledge: 3, grade: 2, sleep: -2 }, "你拼尽全力，不留遗憾。", "学习+ 成绩+ 熬夜"],
   ["梳理重点", { knowledge: 2, grade: 1 }, "你有条不紊地复习。", "学习+ 成绩+"],
   ["保持作息", { health: 1, knowledge: 1 }, "你不想熬坏身体。", "健康+ 学习+"]]);
/* 寒假将至 */
PL(function (G) { return G.date && G.date.getMonth() === 0; }, "🧣", "寒假将至",
  "天很冷，大家都在数着日子等寒假。",
  [["坚持到底", { knowledge: 2, mood: 1, support: 1 }, "你站好最后一班岗。", "学习+ 心情+"],
   ["规划假期", { mood: 1, knowledge: 1 }, "你列好了假期想做的事。", "心情+ 学习+"],
   ["开始盼放假", { mood: 1 }, "你已经有点心不在焉。", "心情+"]]);
/* 情人节（2月） */
PL(function (G) { return G.date && G.date.getMonth() === 1 && G.date.getDate() === 14; }, "💝", "情人节",
  "今天是情人节，班里氛围微妙。",
  [["给在意的人准备巧克力", { charm: 2, support: 2, money: -20 }, "你鼓起勇气送出了心意。", "魅力+ 社交+"],
   ["和好朋友互送", { mood: 2, support: 1 }, "你们不羡慕情侣。", "心情+ 社交+"],
   ["安心学习", { knowledge: 1, mood: 1 }, "你暂时没这心思。", "学习+ 心情+"]]);
/* 春天开学 */
PL(function (G) { return G.date && G.date.getMonth() === 2; }, "🌱", "春天开学",
  "新学期开始，校园里有了新绿，一切像重新开始。",
  [["定下新目标", { knowledge: 2, mood: 2 }, "你对新学期充满期待。", "学习+ 心情+"],
   ["调整状态", { health: 1, mood: 1 }, "你让自己进入节奏。", "健康+ 心情+"],
   ["多认识新朋友", { support: 2, charm: 1 }, "你想在新学期有新变化。", "社交+ 魅力+"]]);
/* 运动会（11月） */
PL(function (G) { return G.date && G.date.getMonth() === 10 && G.day % 8 === 0; }, "🏅", "运动会",
  "今天学校举办运动会，操场上彩旗飘扬。",
  [["报名项目拼一把", { fitness: 2, support: 2, mood: 2, charm: 1 }, "你奋力比赛，为班级争光。", "体力+ 社交+ 心情+"],
   ["当啦啦队加油", { support: 2, mood: 2 }, "你喊得嗓子都哑了。", "社交+ 心情+"],
   ["给同学看东西/送水", { support: 2, charm: 1 }, "你照顾着比赛的同学。", "社交+ 魅力+"]]);
/* 毕业季氛围（夏） */
PL(function (G) { return G.date && G.date.getMonth() === 5; }, "🎓", "毕业季",
  "夏天来了，校园里有了离别的味道。",
  [["珍惜最后的时光", { mood: 2, support: 2, charm: 1 }, "你认真地告别每一个人。", "心情+ 社交+"],
   ["和同学拍合照", { mood: 2, charm: 1 }, "你想把大家都记下来。", "心情+ 魅力+"],
   ["为未来做准备", { knowledge: 2, mood: 1 }, "你对未来既紧张又期待。", "学习+ 心情+"]]);

/* ══════════════════════════════════════════════════════════
   模块二十七：第五位女主「沈知夏」（青梅竹马）
   扩充剧情模式、约会、聊天、人物志；剧本为完整长篇。
   ══════════════════════════════════════════════════════════ */
(function () {
  var SHEN = {
    id: "shen", name: "沈知夏", emoji: "🌻", color: "#f5c84a",
    tag: "青梅竹马 · 隔壁班", desc: "和你一起长大的女孩，大大咧咧像个老朋友，其实把你藏在心里很多年。"
  };
  /* 加入剧情引擎 */
  if (!X56Story.byId("shen")) X56Story.heroines.push(SHEN);
  /* 加入约会番外 */
  X56Date.heroineMeta.shen = { name: "沈知夏", emoji: "🌻", color: "#f5c84a" };
  if (X56Date.order.indexOf("shen") < 0) X56Date.order.push("shen");
  /* 加入人物志 roster */
  if (X56Core.roster.map(function (p) { return p.id; }).indexOf("shen") < 0) {
    X56Core.roster.push({
      id: "shen", name: "沈知夏", emoji: "🌻",
      tag: "青梅竹马 · 隔壁班", bio: "和你一起长大，嘴硬心软。"
    });
  }
  /* 朋友圈 NPC 花名册（让她能出现在好友互动里） */
  X56Moments.npcs.shen = {
    name: "沈知夏", emoji: "🌻", bg: "linear-gradient(135deg,#f5e0a0,#e8c870)"
  };
  if (X56MomentsExtra.npcNames.indexOf("沈知夏") < 0)
    X56MomentsExtra.npcNames.push("沈知夏");
  /* 聊天脚本顺序同步：必须与 roster 顺序一致（shen 在 roster 末尾，故 push 到末尾），
     否则人物志“💬聊聊”按卡片下标映射会把 wang / shen 的对话错位 */
  if (X56Chat.scriptOrder.indexOf("shen") < 0) {
    X56Chat.scriptOrder.push("shen");
  }
})();

/* ══════════════════════════════════════════════════════════
   剧情内容 · 沈知夏（青梅竹马 · 隔壁班）
   序章→日常→旧事→心动(生病/雨天)→误会(被人追)→告白(老地方)
   ══════════════════════════════════════════════════════════ */
X56StoryContent.shen = {
  /* ── 序章 ── */
  c0: { type: "line", chapter: "序章", loc: "gate", speaker: "narrator", emoji: "🌤️",
    text: "你和沈知夏是穿一条裤子长大的发小——从幼儿园同桌到初中同校，两家父母熟得像一家人。上了高中，她在隔壁班，你在（3）班。",
    next: "c0a" },
  c0a: { type: "line", loc: "gate", emoji: "🌻",
    text: "（她背着书包冲你挥挥手，大大咧咧地把一瓶豆浆塞进你手里）喏，给你带的！咱俩又在一个学校了，你跑不掉了。",
    next: "c0b" },
  c0b: { type: "choice", loc: "gate", speaker: "me", emoji: "🧑",
    text: "她笑得像个小太阳。你接过豆浆——",
    choices: [
      { label: "谢了，知夏。明天我请你。", tag: "熟稔", eff: 1, next: "c0c" },
      { label: "（揉揉她的头发）你怎么跟个小跟班似的。", tag: "亲昵", eff: 2, flags: { tease: 1 }, next: "c0c_tease" },
      { label: "都高中了，别总黏着我。", tag: "疏离", eff: 0, next: "c0c_quiet" }
    ] },
  c0c: { type: "line", loc: "gate", emoji: "😊",
    text: "那说好了！我跟你说，咱俩什么关系啊，一辈子的。", next: "c1" },
  c0c_tease: { type: "line", loc: "gate", emoji: "😳",
    text: "（她拍开你的手，脸却有点红）你、你才小跟班！（小声）我本来就想跟着你嘛……", next: "c1" },
  c0c_quiet: { type: "line", loc: "gate", emoji: "🍃",
    text: "（她愣了一下，勉强笑了笑）哦……我知道了。", next: "c1" },

  /* ── 第一章：日常（地图） ── */
  c1: { type: "line", chapter: "第一章 · 日常", loc: "classroom", speaker: "narrator", emoji: "🍂",
    text: "开学第一周，沈知夏照旧一下课就跑到你们班门口晃悠，或者在食堂、操场等你。",
    next: "m1" },
  m1: { type: "map", loc: "classroom",
    text: "【自由活动】打开地图，看看去哪。",
    guide: "知夏是你发小，在操场、校门口、食堂到处找你。多去几个地方看看。",
    cells: [
      { loc: "playground", target: "l1_play", rec: true },
      { loc: "gate", target: "l1_gate", rec: true },
      { loc: "canteen", target: "l1_canteen", rec: true },
      { loc: "classroom", target: "l1_class" },
      { loc: "garden", target: "l1_garden" },
      { loc: "library", target: "l1_lib" }
    ] },
  l1_play: { type: "line", loc: "playground", speaker: "narrator", emoji: "🌻",
    text: "操场上，沈知夏和几个人在玩闹，看到你立刻跑过来。", next: "l1_play_a" },
  l1_play_a: { type: "line", loc: "playground", emoji: "😆",
    text: "你来得正好！他们都说我跑得比你快，你说呢？", next: "l1_play_b" },
  l1_play_b: { type: "choice", loc: "playground", speaker: "me", emoji: "🧑",
    text: "她叉着腰，眼睛亮晶晶的。",
    choices: [
      { label: "比就比，赢了我请你吃冰棍。", eff: 2, flags: { race: 1 }, next: "l1_play2" },
      { label: "行行行，你最快，行了吧。", eff: 1, next: "l1_play2" }
    ] },
  l1_play2: { type: "line", loc: "playground", emoji: "😄",
    text: "（她得意地笑）就喜欢你这痛快样！咱俩谁跟谁。", next: "m1b" },

  l1_gate: { type: "line", loc: "gate", speaker: "narrator", emoji: "🚪",
    text: "校门口，沈知夏靠在柱子上等你，手里拿着两份早餐。", next: "l1_gate_a" },
  l1_gate_a: { type: "line", loc: "gate", emoji: "🌻",
    text: "我就知道你今天又没吃早饭！拿着，我们从小到大都这样。", next: "l1_gate_b" },
  l1_gate_b: { type: "choice", loc: "gate", speaker: "me", emoji: "🧑",
    text: "她总是记得你的一切。",
    choices: [
      { label: "你怎么总记着我，我会不好意思。", eff: 2, flags: { care: 1 }, next: "l1_gate2" },
      { label: "谢了，明天换我。", eff: 1, next: "l1_gate2" }
    ] },
  l1_gate2: { type: "line", loc: "gate", emoji: "😳",
    text: "（她小声）你的事我能不记着吗……（又赶紧笑）毕竟一辈子嘛。", next: "m1b" },

  l1_canteen: { type: "line", loc: "canteen", speaker: "narrator", emoji: "🍜",
    text: "食堂里，沈知夏已经帮你占好了位置。", next: "l1_canteen_a" },
  l1_canteen_a: { type: "line", loc: "canteen", emoji: "😊",
    text: "快坐！我帮你打了你爱吃的菜，你那点喜好我还能不知道？", next: "l1_canteen_b" },
  l1_canteen_b: { type: "choice", loc: "canteen", speaker: "me", emoji: "🧑",
    text: "她连你爱吃什么都一清二楚。",
    choices: [
      { label: "知夏，有你真好。", eff: 2, flags: { warm: 1 }, next: "l1_canteen2" },
      { label: "（分她一块肉）你也多吃。", eff: 1, next: "l1_canteen2" }
    ] },
  l1_canteen2: { type: "line", loc: "canteen", emoji: "😳",
    text: "（她脸一红，低头扒饭）……你突然这么说，我都不会接话了。", next: "m1b" },

  l1_class: { type: "line", loc: "classroom", speaker: "narrator", emoji: "🌻",
    text: "课间，沈知夏又跑到你们班门口探头探脑。", next: "l1_class_a" },
  l1_class_a: { type: "line", loc: "classroom", emoji: "😆",
    text: "嘿，我来看看你！怎么，嫌我烦啊？", next: "l1_class_b" },
  l1_class_b: { type: "choice", loc: "classroom", speaker: "me", emoji: "🧑",
    text: "她的出现总能让你放松。",
    choices: [
      { label: "怎么会，看见你就开心。", eff: 2, flags: { glad: 1 }, next: "l1_class2" },
      { label: "我作业还没写完……", eff: 0, next: "l1_class2b" }
    ] },
  l1_class2: { type: "line", loc: "classroom", emoji: "😊",
    text: "那我就天天来！（她笑得很灿烂）", next: "m1b" },
  l1_class2b: { type: "line", loc: "classroom", emoji: "🍃",
    text: "哦……那你忙，我不打扰你了。", next: "m1b" },
  l1_garden: { type: "line", loc: "garden", speaker: "narrator", emoji: "🌻",
    text: "花园长椅上，沈知夏一个人坐着，难得没说话。", next: "l1_garden_a" },
  l1_garden_a: { type: "line", loc: "garden", emoji: "🌥️",
    text: "是你啊……坐吧。我在想小时候的事。", next: "l1_garden_b" },
  l1_garden_b: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
    text: "她看着你，眼神有点不一样。",
    choices: [
      { label: "想什么呢？我陪你想。", eff: 2, flags: { recall: 1 }, next: "l1_garden2" },
      { label: "小时候咱俩可没少闯祸。", eff: 1, next: "l1_garden2" }
    ] },
  l1_garden2: { type: "line", loc: "garden", emoji: "😳",
    text: "（她轻声）那时候……你说会一直罩着我。你还记得吗？", next: "m1b" },
  l1_lib: { type: "line", loc: "library", speaker: "narrator", emoji: "🌻",
    text: "图书馆里，沈知夏被你撞见，她装作在看书。", next: "l1_lib_a" },
  l1_lib_a: { type: "line", loc: "library", emoji: "😆",
    text: "嘘——我其实是来等你的，怕你笑话我。", next: "l1_lib_b" },
  l1_lib_b: { type: "choice", loc: "library", speaker: "me", emoji: "🧑",
    text: "她为了等你，特意跑了一趟。",
    choices: [
      { label: "傻瓜，等我直接说嘛。", eff: 2, flags: { wait: 1 }, next: "l1_lib2" },
      { label: "那一起回去吧。", eff: 1, next: "l1_lib2" }
    ] },
  l1_lib2: { type: "line", loc: "library", emoji: "😳",
    text: "（她小声）我乐意……（笑）走吧。", next: "m1b" },
  m1b: { type: "line", loc: "classroom", speaker: "narrator", emoji: "🌅",
    text: "日子一天天过去，你和沈知夏像从前那样黏在一起。只是你渐渐觉得，有些东西，好像和小时候不太一样了。",
    next: "c2" },

  /* ── 第二章：旧事（回忆 + 她问你喜欢的人） ── */
  c2: { type: "line", chapter: "第二章 · 旧事", loc: "garden", speaker: "narrator", emoji: "🌇",
    text: "一个放学后的傍晚，沈知夏拉着你在校园里慢慢走，说想找你聊聊。",
    next: "c2a" },
  c2a: { type: "line", loc: "garden", emoji: "🌻",
    text: "咱俩认识……都十几年了吧？时间过得真快。", next: "c2b" },
  c2b: { type: "line", loc: "garden", emoji: "😳",
    text: "我问你个事啊……你、你在班里，有没有喜欢的人？", next: "c2c" },
  c2c: { type: "choice", loc: "garden", speaker: "me", emoji: "🧑",
    text: "她问得有点小心翼翼，眼神飘向别处。",
    choices: [
      { label: "有啊，是一个很熟的人。", tag: "暗示", eff: 2, flags: { hint: 1 }, next: "c2_hint" },
      { label: "没有，我这种人谁会喜欢。", tag: "自嘲", eff: 1, next: "c2_self" },
      { label: "你呢，你有喜欢的人吗？", tag: "反问", eff: 1, flags: { ask: 1 }, next: "c2_ask" }
    ] },
  c2_hint: { type: "line", loc: "garden", emoji: "😳",
    text: "（她猛地抬头）很、很熟的人？……是谁啊？", next: "c2d" },
  c2_self: { type: "line", loc: "garden", emoji: "🌥️",
    text: "你瞎说什么呢！（她有点急）你这么好，肯定有人喜欢的……", next: "c2d" },
  c2_ask: { type: "line", loc: "garden", emoji: "🌻",
    text: "我啊……（她小声）有。认识很久了，是个笨蛋，一直没发现。", next: "c2d" },
  c2d: { type: "line", loc: "garden", speaker: "narrator", emoji: "🌙",
    text: "你们的对话在晚风里变得有些说不清。她忽然笑了笑，说不早了，让你回去。",
    next: "c3" },

  /* ── 第三章：心动（她生病 / 雨天） ── */
  c3: { type: "line", chapter: "第三章 · 心动", loc: "classroom", speaker: "narrator", emoji: "🌧️",
    text: "连着下了几天雨，天气一下凉了。课间你听说，沈知夏早上淋了雨，有点发烧。",
    next: "c3a" },
  c3a: { type: "line", loc: "clinic", speaker: "narrator", emoji: "🏥",
    text: "你在医务室找到她，她裹着外套，脸色有点红，看到你想坐起来。",
    next: "c3b" },
  c3b: { type: "line", loc: "clinic", emoji: "😷",
    text: "你怎么来了……我没事，就是有点丢人，让你看见我这样。", next: "c3c" },
  c3c: { type: "choice", loc: "clinic", speaker: "me", emoji: "🧑",
    text: "她逞强地笑了笑，你却有点心疼。",
    choices: [
      { label: "你躺着别动，我去给你买药/打热水。", eff: 2, flags: { care3: 1 }, next: "c3_care" },
      { label: "（把外套给她盖上）你还说没事。", eff: 2, flags: { coat3: 1 }, next: "c3_care" },
      { label: "都怪你淋雨，活该。", tag: "嘴硬", eff: 1, next: "c3_tough" }
    ] },
  c3_care: { type: "line", loc: "clinic", emoji: "😳",
    text: "（她怔怔地看着你，声音小小的）你……你干嘛对我这么好啊。", next: "c3d" },
  c3_tough: { type: "line", loc: "clinic", emoji: "😷",
    text: "（她却笑了）你嘴上这么说，不还是来了……我懂你。", next: "c3d" },
  c3d: { type: "line", loc: "clinic", emoji: "🌻",
    text: "（她小声）其实……被你照顾的感觉，还挺好的。", next: "c3e" },
  c3e: { type: "line", loc: "clinic", speaker: "narrator", emoji: "🌦️",
    text: "外面雨还在下，你陪她在医务室待了很久。她看着你的眼神，比任何时候都要认真。",
    next: "c3f" },
  c3f: { type: "choice", loc: "clinic", speaker: "me", emoji: "🧑",
    text: "你心里有个声音在说，你好像，不只是把她当发小。",
    choices: [
      { label: "知夏，其实我一直很在意你。", eff: 2, flags: { aware: 1 }, next: "c4" },
      { label: "（揉揉她的头发）好好休息。", eff: 1, next: "c4" },
      { label: "我们是一辈子的好兄弟嘛。", eff: 0, flags: { brother: 1 }, next: "c4" }
    ] },

  /* ── 第四章：误会（有人追她 / 她以为你喜欢别人） ── */
  c4: { type: "line", chapter: "第四章 · 误会", loc: "gate", speaker: "narrator", emoji: "🌤️",
    text: "沈知夏病好后没几天，你听说隔壁班有个男生在追她，给她送东西、约她放学。",
    next: "c4a" },
  c4a: { type: "line", loc: "gate", emoji: "🌻",
    text: "（她在校门口找到你，手里拿着一袋东西，没什么精神）你看，又有人给我送……",
    next: "c4b" },
  c4b: { type: "choice", loc: "gate", speaker: "me", emoji: "🧑",
    text: "看到别人追她，你心里莫名有点不是滋味。",
    choices: [
      { label: "你喜欢他吗？（语气有点急）", eff: 2, flags: { jealous: 1 }, next: "c4_jeal" },
      { label: "那挺好的啊，你挺受欢迎。", tag: "口是心非", eff: 1, next: "c4_fake" },
      { label: "把东西退了，我带你去吃饭。", eff: 2, flags: { take: 1 }, next: "c4_jeal" }
    ] },
  c4_jeal: { type: "line", loc: "gate", emoji: "😳",
    text: "（她盯着你看了好一会，忽然眼睛一亮）你……你是不是吃醋了？", next: "c4d" },
  c4_fake: { type: "line", loc: "gate", emoji: "🌥️",
    text: "（她低下头，声音闷闷的）……哦。你也觉得挺好啊。", next: "c4d" },
  c4d: { type: "line", loc: "gate", emoji: "😔",
    text: "知夏，你是不是……一直把我当哥们、当妹妹？我有点搞不懂了。", next: "c4e" },
  c4e: { type: "choice", loc: "gate", speaker: "me", emoji: "🧑",
    text: "她第一次这样直白地问你。",
    choices: [
      { label: "我从不把你当哥们。", eff: 2, flags: { clear4: 1 }, next: "c4_clear" },
      { label: "我……我也说不清。", eff: 1, next: "c4_mess" },
      { label: "我们是最好的朋友啊。", eff: 0, flags: { friend: 1 }, next: "c4_mess" }
    ] },
  c4_clear: { type: "line", loc: "gate", emoji: "😳",
    text: "（她脸一下红了，却笑了）那……那你给我点时间，也给你自己点时间。", next: "c5" },
  c4_mess: { type: "line", loc: "gate", emoji: "🍃",
    text: "（她轻轻嗯了一声，眼神有点失落）好……我懂了。", next: "c5" },

  /* ── 第五章：告白（小时候的老地方） ── */
  c5: { type: "line", chapter: "第五章 · 心之所向", loc: "rooftop", speaker: "narrator", emoji: "🌇",
    text: "傍晚，沈知夏把你拉到教学楼天台——你们小时候，就常常在村里的老地方一起看夕阳。",
    next: "c5a" },
  c5a: { type: "line", loc: "rooftop", emoji: "🌻",
    text: "咱俩小时候，你说过一句话，你还记得吗？你说——以后不管怎么样，都罩着我。", next: "c5b" },
  c5b: { type: "line", loc: "rooftop", emoji: "😳",
    text: "我等你这句话……等了好多年了。", next: "c5c" },
  c5c: { type: "choice", loc: "rooftop", speaker: "me", emoji: "🧑",
    text: "夕阳把她的脸照得很红，她不再是那个只会喊你名字的小跟屁虫。",
    choices: [
      { label: "沈知夏，我喜欢你。不是发小的那种喜欢。", eff: 2, flags: { confess: 1 }, next: "c5_judge" },
      { label: "（牵起她的手）这次换我一直跟着你。", eff: 2, flags: { hold: 1 }, next: "c5_judge" },
      { label: "（轻声）你是我最好的朋友。", flags: { friend: 1 }, next: "c5_judge" }
    ] },
  c5_judge: { type: "router",
    route: function (s) {
      if (s.flags.friend) return "end_friend";
      if (s.affinity >= 7) return "end_sweet";
      if (s.affinity >= 4) return "end_normal";
      return "end_miss";
    } },

  end_sweet: { type: "end", emoji: "🌻",
    title: "结局 · 一直都是你",
    text: "她一下子红了眼眶，却笑着捶了你一下。“笨蛋……你怎么才发现。” 原来你们的‘一辈子’，从一开始就写好了答案。夕阳下，你牵起她的手——这一次，不再是发小，而是想要共度一生的人。" },
  end_normal: { type: "end", emoji: "🌤️",
    title: "结局 · 等了很多年",
    text: "她看着你，轻轻笑了，眼里有泪光。“你能这么说，我已经很开心了……我们慢慢来，好吗？” 十几年的感情，值得你们用更长的时间去确认。" },
  end_friend: { type: "end", emoji: "🤝",
    title: "结局 · 一辈子的朋友",
    text: "她愣了一下，然后释然地笑了。“能做你一辈子的朋友，也很好。” 有些感情没有成为爱情，却陪你走过了最长的路。" },
  end_miss: { type: "end", emoji: "🍂",
    title: "结局 · 原来只是习惯",
    text: "她低下头，夕阳在她身后落下去。“也许……我真的只是你的习惯。” 习惯了彼此，却没能变成心动。你看着她，心里有些说不清的遗憾。" }
};

/* ══════════════════════════════════════════════════════════
   模块二十九：沈知夏 · 聊天脚本 + 约会番外
   ══════════════════════════════════════════════════════════ */

/* ── 聊天 ── */
XCS("shen", "🌻", "沈知夏", "a", {
  a: { from: "npc", text: "哟，找我啊？咱俩这关系，你说什么都行。", choices: [
    { label: "你怎么总这么有精神", to: "b" }, { label: "聊聊小时候", to: "c" }] },
  b: { from: "npc", text: "哈哈，看见你我就有精神了。", choices: [
    { label: "你这样我会误会的", to: "d" }, { label: "嘴真甜", to: "e" }] },
  c: { from: "npc", text: "小时候啊……你可没少欺负我，又护着我。", choices: [
    { label: "我以后还护着你", to: "d" }, { label: "咱俩谁跟谁", to: "f" }] },
  d: { from: "npc", text: "你、你说真的？（她脸有点红）……说话算话。", end: true, eff: { aff: 2, mood: 2 } },
  e: { from: "npc", text: "我跟你才不甜呢，我跟你是认真的。", end: true, eff: { aff: 2, mood: 1 } },
  f: { from: "npc", text: "对！一辈子的那种。", end: true, eff: { aff: 1, mood: 1 } }
});

/* ── 约会番外（6 场） ── */
DS("shen", "老地方", "garden", "🌻",
  [N("你们回到小时候常去的那个地方（现在是校园小径）。"),
   H("还记得吗，咱俩在这儿蹲过一只猫、躲过一场雨。"),
   M("都记得，跟你有关的我都记得。")],
  [{ label: "一起回忆小时候", reply: "她笑着靠在你肩上，说这样真好。", aff: 2 },
   { label: "拍张现在的合照", reply: "她说：和小时候那张放一起。", aff: 2 },
   { label: "安静地坐一会儿", reply: "她说：不说话也自在，只有和你。", aff: 1 }]);
DS("shen", "操场比一场", "playground", "🏃",
  [N("沈知夏拉着你去操场，非要跟你比一场。"),
   H("来！输了请喝水，别耍赖。")],
  [{ label: "认真跟她比", reply: "她赢了，笑得像个小太阳。", aff: 2 },
   { label: "故意让她", reply: "她一眼看穿：要赢就光明正大。", aff: 1 },
   { label: "一起跑不比赛", reply: "她放慢脚步，和你聊了一路。", aff: 2 }]);
DS("shen", "一起吃早点", "canteen", "🥟",
  [N("你们像小时候一样，一起去吃早点。"),
   H("我跟你说，我可馋这个了！咱俩一人一半。")],
  [{ label: "分她一半", reply: "她笑着说：你最懂我。", aff: 2 },
   { label: "你请客", reply: "她嘴上说不用，心里很甜。", aff: 2, money: -15 },
   { label: "边吃边聊", reply: "你们像从前一样，有说不完的话。", aff: 1 }]);
DS("shen", "校门口", "gate", "🚪",
  [N("放学后你们在校门口晃悠，谁都不想先走。"),
   H("小时候咱俩就是在这样的路口分开，又约好明天见。")],
  [{ label: "多陪她走一段", reply: "她绕了远路，却特别开心。", aff: 2 },
   { label: "送她到门口", reply: "她回头看了你好几眼。", aff: 2 },
   { label: "明天还在这里见", reply: "她笑：说定了，一辈子。", aff: 1 }]);
DS("shen", "天台看夕阳", "rooftop", "🌇",
  [N("你们在天台看夕阳，像小时候在老地方一样。"),
   H("那时候你说，要一直罩着我……还记得吗？")],
  [{ label: "记得，一辈子算数", reply: "她红了眼，却笑得很甜。", aff: 2 },
   { label: "现在换我陪着你", reply: "她小声：那你可别反悔。", aff: 2 },
   { label: "安静看夕阳", reply: "她悄悄靠近了你一点。", aff: 1 }]);
DS("shen", "喂猫", "garden", "🐱",
  [N("你们在角落遇到流浪猫，沈知夏的眼神一下软了。"),
   H("你看，它是不是很可爱？咱俩小时候也喂过一只。")],
  [{ label: "一起喂猫", reply: "她说：你和猫一样，都让人喜欢。", aff: 2 },
   { label: "看她撸猫", reply: "你第一次见她这么温柔。", aff: 1 },
   { label: "给猫带吃的", reply: "她笑着挽住你，说你最好了。", aff: 2 }]);

/* ══════════════════════════════════════════════════════════
   模块三十：玩法中枢（让所有系统都能从校园中心进入）
   在“中心”首页追加一个“更多玩法”导航。
   ══════════════════════════════════════════════════════════ */
(function () {
  var playItems = [
    { icon: "🌈", name: "朋友圈", fn: function () { closeModal(); X56Moments.open(); } },
    { icon: "📖", name: "校园见闻", fn: function () { if (window.X56Life) X56Life.panel(); } },
    { icon: "💼", name: "勤工俭学", fn: function () { if (window.X56Jobs) X56Jobs.panel(); } },
    { icon: "🎪", name: "社团", fn: function () { if (window.X56Clubs) X56Clubs.panel(); } },
    { icon: "🎯", name: "技能练习", fn: function () { if (window.X56Skills) X56Skills.panel(); } },
    { icon: "💕", name: "约会日常", fn: function () { if (window.X56Date) X56Date.panel(); } },
    { icon: "🌿", name: "休闲时光", fn: function () { if (window.X56FreeTime) X56FreeTime.panel(); } },
    { icon: "🌆", name: "校外时光", fn: function () { if (window.X56City) X56City.panel(); } },
    { icon: "🎖️", name: "称号", fn: function () { if (window.X56Titles) X56Titles.panel(); } },
    { icon: "📜", name: "更新日志", fn: function () { if (window.X56Version) X56Version.openChangelog(); } }
  ];
  function inject() {
    var body = $("x56CoreBody");
    if (!body) return;
    /* 只在首页、且没注入过 */
    if (body.querySelector(".playhub-box")) return;
    var dash = body.querySelector(".x56-dash-head");
    if (!dash) return;
    var box = document.createElement("div");
    box.className = "playhub-box";
    box.innerHTML = '<div class="playhub-title">🎮 更多玩法</div>' +
      '<div class="playhub-grid">' +
      playItems.map(function (it, i) {
        return '<button class="playhub-cell" data-i="' + i + '">' +
          '<span class="ph2-icon">' + it.icon + '</span>' +
          '<span class="ph2-name">' + it.name + "</span></button>";
      }).join("") + "</div>";
    body.appendChild(box);
    $a(".playhub-cell", box).forEach(function (b) {
      on(b, "click", function () {
        var it = playItems[parseInt(b.getAttribute("data-i"), 10)];
        if (it) it.fn();
      });
    });
  }
  /* 轮询：首页每次渲染后注入 */
  setInterval(inject, 600);
  window.X56PlayHub = { inject: inject };
})();

/* ══════════════════════════════════════════════════════════
   模块三十一：朋友圈更多动态（再 20 条，让信息流更耐刷）
   包装 seedFeed 追加。
   ══════════════════════════════════════════════════════════ */
(function () {
  function P(id, who, time, loc, text, imgs, likes, comments) {
    return { id: id, who: who, time: time, loc: loc, text: text,
      imgs: imgs || [], likes: likes || [], comments: comments || [] };
  }
  var more = [
    P("y31", "wang", "2周前", "", "提醒：天气转凉，请注意增减衣物，课间不要因为热就脱外套。身体好才能学习好。",
      [], ["徐甜甜", "林晚", "吴磊"], [{ n: "林晚", c: "收到，老师也注意身体" }]),
    P("y32", "chen", "2周前", "操场", "练了一下午接力，交接棒越来越顺。运动会我们一定拿个好成绩！",
      [{ e: "🏅", g: 6 }], ["吴磊", "陈墨", "周子航"], [{ n: "吴磊", c: "最后一棒放心交给我" }]),
    P("y33", "zhao", "2周前", "美术教室", "临摹了一张莫奈的睡莲，色彩真的太治愈了。向大师学习。",
      [{ e: "🖼️", g: 4 }, { e: "🎨", g: 3 }], ["林晚", "王老师"], [{ n: "王老师", c: "色调把控得不错，有自己的理解" }]),
    P("y34", "zhou", "2周前", "", "今天终于戒掉了一次熬夜（只玩到了十一点），纪念一下！明天继续努力。",
      [], ["陈墨", "徐甜甜"], [{ n: "徐甜甜", c: "加油！坚持就是胜利" }]),
    P("y35", "canteen", "2周前", "西子食堂", "本周推荐：红烧排骨、清炒时蔬、紫菜蛋花汤。营养均衡，学习才有劲。",
      [{ e: "🍱", g: 0 }, { e: "🥗", g: 2 }], ["林晚", "赵小雨", "陈墨"], [{ n: "赵小雨", c: "排骨冲！" }]),
    P("y36", "xu", "2周前", "图书馆", "分享错题本第二弹：物理错题按力学/电学分类，考前翻一遍特别有用。",
      [{ e: "📝", g: 1 }, { e: "📚", g: 5 }], ["王老师", "林晚", "吴磊"], [{ n: "王老师", c: "方法很好，大家可以借鉴" }]),
    P("y37", "lin", "2周前", "花园", "后花园的桂花落了一地，捡了些夹在书里，翻开书都有香味。",
      [{ e: "🌸", g: 3 }, { e: "📖", g: 5 }], ["赵小雨", "徐甜甜"], [{ n: "赵小雨", c: "好浪漫！下次带我一起" }]),
    P("y38", "wu", "2周前", "操场", "晨跑打卡第十天！坚持真的会让人上瘾，清晨的空气太舒服了。",
      [{ e: "🏃", g: 2 }, { e: "🌅", g: 6 }], ["陈墨", "吴磊", "周子航"], [{ n: "陈墨", c: "明早叫我，我也加入" }]),
    P("y39", "shen", "2周前", "校门口", "和发小一起上下学的日子，十几年如一日，感觉真好。",
      [{ e: "🌻", g: 6 }, { e: "🚪", g: 5 }], ["林晚", "赵小雨"], [{ n: "赵小雨", c: "好羡慕这样的感情！" }]),
    P("y40", "radio", "3周前", "杭州西子实验学校", "【活动】下周开展校园读书月活动，欢迎各班推荐好书、撰写读后感。",
      [], ["王老师", "林晚", "徐甜甜"], [{ n: "徐甜甜", c: "我想推荐《平凡的世界》" }]),
    P("y41", "zhao", "3周前", "天台", "又在天台捕捉到一场好夕阳，光影变化太迷人，五分钟都舍不得眨眼。",
      [{ e: "🌅", g: 6 }], ["林晚", "王老师"], [{ n: "林晚", c: "你拍的夕阳真好看" }]),
    P("y42", "chen", "3周前", "", "体测经验分享：跑步三步一呼、三步一吸，节奏别乱，亲测能快十几秒。",
      [], ["吴磊", "周子航", "徐甜甜"], [{ n: "周子航", c: "记下了，下次试试" }]),
    P("y43", "wang", "3周前", "", "本周五进行班级学习情况小结，请同学们把近期错题本整理好带来。",
      [], ["徐甜甜", "林晚", "陈墨"], [{ n: "徐甜甜", c: "好的老师" }]),
    P("y44", "lin", "3周前", "宿舍", "宿舍夜谈，我们聊了未来想成为什么样的人，聊到很晚很晚。",
      [{ e: "🌙", g: 3 }], ["赵小雨", "徐甜甜"], [{ n: "徐甜甜", c: "我也想加入你们宿舍" }]),
    P("y45", "zhou", "3周前", "", "安利一个学习 App，番茄钟+白噪音，我的效率真的提高了，游戏也少玩了。",
      [], ["陈墨", "徐甜甜"], [{ n: "徐甜甜", c: "叫什么呀，我也下一个" }]),
    P("y46", "canteen", "3周前", "西子食堂", "天气干燥，记得多喝温水。食堂免费汤品窗口持续供应。",
      [{ e: "🍵", g: 5 }], ["林晚", "王老师", "陈墨"], [{ n: "林晚", c: "食堂太贴心了" }]),
    P("y47", "xu", "3周前", "教室", "早读坚持打卡，背书真的是量变到质变，每天二十分钟，一月见分晓。",
      [{ e: "📖", g: 5 }, { e: "☀️", g: 6 }], ["王老师", "林晚"], [{ n: "王老师", c: "坚持的力量，好样的" }]),
    P("y48", "wu", "3周前", "操场", "今天晚霞配操场，跑了五圈，运动真的是最好的解压方式。",
      [{ e: "🌇", g: 6 }], ["陈墨", "周子航"], [{ n: "陈墨", c: "懂，明天一起" }]),
    P("y49", "shen", "3周前", "花园", "和发小在校园里聊了很久，从小时候到未来，好像有说不完的话。",
      [{ e: "🌻", g: 2 }, { e: "🌳", g: 5 }], ["赵小雨", "林晚"], [{ n: "赵小雨", c: "这就是青梅竹马吧" }]),
    P("y50", "radio", "3周前", "杭州西子实验学校", "【喜报】我校篮球队在区中学生联赛中取得优异成绩，向队员们表示祝贺！",
      [], ["陈墨", "吴磊", "王老师", "周子航"], [{ n: "吴磊", c: "大家的努力没有白费" }])
  ];
  /* 包装 seedFeed 追加 */
  var orig = X56Moments.seedFeed;
  X56Moments.seedFeed = function () {
    return orig.call(X56Moments).concat(more);
  };
})();

/* ══════════════════════════════════════════════════════════
   模块三十二：更多校园见闻（30 个，更丰富的选择）
   L(类别, 图标, 标题, 正文, 选项)
   ══════════════════════════════════════════════════════════ */
L("📚 学习", "🖋️", "练字",
  "老师说你的字有点潦草，建议你练练。",
  [["买本字帖认真练", { knowledge: 1, charm: 2, money: -8 }, "字慢慢工整，卷面也好看。", "魅力+ 学习+"],
   ["觉得没必要", { knowledge: 0 }, "你把这件事忘了。", "——"],
   ["注意写工整就好", { knowledge: 1 }, "你写作业时刻意放慢。", "学习+"]]);
L("📚 学习", "🧠", "背书技巧",
  "你发现有些同学背东西特别快。",
  [["请教记忆方法", { knowledge: 2, support: 1 }, "你学会了理解记忆和分段背诵。", "学习+ 社交+"],
   ["死记硬背", { knowledge: 1, sleep: -1 }, "你背得慢，但记得牢。", "学习+"],
   ["自己摸索", { knowledge: 1 }, "你找到了适合自己的节奏。", "学习+"]]);
L("📚 学习", "📚", "课外阅读",
  "课间你在看一本和学习无关的书。",
  [["继续读，拓展视野", { knowledge: 2, mood: 1 }, "课外书让你见识更广。", "学习+ 心情+"],
   ["收起来学习", { knowledge: 1 }, "你决定先把课本搞定。", "学习+"],
   ["和同学分享", { support: 2, mood: 1 }, "你安利了这本书。", "社交+"]]);
L("🗣️ 社交", "🧋", "帮同学带奶茶",
  "同学让你顺路帮忙带一杯奶茶。",
  [["乐意帮忙", { support: 2, money: -10 }, "你帮同学带了，还不要零头。", "社交+"],
   ["要跑腿费", { money: 3, support: 0 }, "你开玩笑要了点辛苦费。", "金钱+"],
   ["不顺路", { support: 0 }, "你婉拒了。", "——"]]);
L("🗣️ 社交", "🪑", "让座",
  "走廊/公共休息区，你看到一个同学没位置。",
  [["把位置让给TA", { support: 2, charm: 1 }, "TA很感激你。", "社交+ 魅力+"],
   ["挤一挤", { support: 1, mood: 1 }, "你们挤在一起笑了。", "社交+ 心情+"],
   ["没注意", { support: 0 }, "你忙着自己的事。", "——"]]);
L("🗣️ 社交", "🤝", "借东西",
  "同学找你借一支笔/一张纸。",
  [["大方借出", { support: 2, charm: 1 }, "你乐意帮这个忙。", "社交+ 魅力+"],
   ["提醒TA还", { support: 1 }, "你怕自己的东西弄丢。", "社交+"],
   ["说自己也没有", { support: -1 }, "你不想借。", "社交-"]]);
L("🏃 运动", "🤸", "课间拉伸",
  "坐了一上午，你想活动一下。",
  [["做几组拉伸", { fitness: 1, health: 2 }, "身体松快多了。", "健康+ 体力+"],
   ["站起来走走", { fitness: 1, mood: 1 }, "你活动了一下。", "体力+ 心情+"],
   ["继续坐着", { health: -1 }, "你腰酸背痛。", "健康-"]]);
L("🏃 运动", "🏃", "操场几圈",
  "放学后你在操场犹豫要不要跑几圈。",
  [["跑三圈", { fitness: 2, health: 1, mood: 1 }, "你坚持了下来。", "体力+ 健康+"],
   ["走两圈", { fitness: 1, health: 1 }, "你放松了一下。", "体力+ 健康+"],
   ["先回去", { mood: 1 }, "你今天有点累。", "心情+"]]);
L("🎮 休闲", "📱", "手机消息",
  "你看到手机里有很多未读消息。",
  [["回复一下", { support: 1, mood: 1 }, "你和朋友聊了会。", "社交+ 心情+"],
   ["刷会动态", { mood: 2, sleep: -1 }, "你放松了一下。", "心情+ 时间-"],
   ["把手机放下", { sleep: 1, knowledge: 1 }, "你想专心一会儿。", "睡眠+ 学习+"]]);
L("🎮 休闲", "🎧", "睡前歌单",
  "睡前你想放松一下。",
  [["听点轻音乐", { mood: 2, sleep: 2 }, "你很快放松下来。", "心情+ 睡眠+"],
   ["听喜欢的歌", { mood: 2 }, "你听得很享受。", "心情+"],
   ["不听了，睡觉", { sleep: 2 }, "你决定早点休息。", "睡眠+"]]);
L("✨ 奇遇", "🐶", "校园里的小动物",
  "你遇到一只看起来很温顺的小动物。",
  [["喂点吃的", { mood: 2, charm: 1, money: -5 }, "你和它玩了会。", "心情+ 魅力+"],
   ["远远看看", { mood: 1 }, "你不想打扰它。", "心情+"],
   ["躲开", { mood: 0 }, "你有点怕。", "——"]]);
L("✨ 奇遇", "📦", "遗失的物品",
  "你捡到一个看起来很重要的小物件。",
  [["想办法还回去", { support: 2, charm: 2 }, "失主很感激。", "社交+ 魅力+"],
   ["放到失物招领", { support: 1 }, "你登记了。", "社交+"],
   ["收着", { mood: -1 }, "你有点占地方。", "心情-"]]);
L("✨ 奇遇", "🌈", "意外的风景",
  "你无意中走到一个视野很好的地方。",
  [["停下来欣赏", { mood: 2, charm: 1 }, "你看到了意外的美景。", "心情+ 魅力+"],
   ["拍下来", { mood: 1, charm: 1 }, "你记录了下来。", "心情+ 魅力+"],
   ["继续赶路", { mood: 1 }, "你记在了心里。", "心情+"]]);
L("💗 情感", "👋", "搭讪",
  "你想和一个人认识一下。",
  [["自然地搭话", { support: 2, charm: 2 }, "你们聊得很投机。", "社交+ 魅力+"],
   ["找朋友介绍", { support: 1 }, "你想先认识一下。", "社交+"],
   ["不好意思", { mood: 1 }, "你把话咽了回去。", "心情+"]]);
L("💗 情感", "💬", "聊心事",
  "你想找人说说心里话。",
  [["找好朋友", { mood: 2, support: 2 }, "说完你轻松多了。", "心情+ 社交+"],
   ["写在日记里", { mood: 1, charm: 1 }, "你整理了情绪。", "心情+ 魅力+"],
   ["自己消化", { mood: 1, sleep: 1 }, "你需要一点时间。", "心情+ 睡眠+"]]);
L("📚 学习", "📖", "课前预习",
  "课前你在想要不要预习。",
  [["认真预习", { knowledge: 2, mood: 1 }, "上课时你听得很轻松。", "学习+"],
   ["随便看看", { knowledge: 1 }, "你大概知道要讲什么。", "学习+"],
   ["不预习", { mood: 1 }, "你喜欢临场发挥。", "心情+"]]);
L("📚 学习", "📝", "作业难题",
  "作业里有一道你不会的题。",
  [["自己研究", { knowledge: 2, sleep: -1 }, "你攻克了它。", "学习+ 时间-"],
   ["问同学", { knowledge: 1, support: 1 }, "你搞懂了。", "学习+ 社交+"],
   ["空着", { knowledge: 0, grade: -1 }, "你打算明天再说。", "成绩-"]]);
L("🗣️ 社交", "🎉", "班级活动",
  "班级组织活动，问大家有什么想法。",
  [["主动出主意", { support: 2, influence: 2, charm: 1 }, "你的点子被采纳。", "社交+ 影响力+"],
   ["配合大家", { support: 1, mood: 1 }, "你融入了集体。", "社交+ 心情+"],
   ["不参与", { support: -1 }, "你想一个人待着。", "社交-"]]);
L("🏃 运动", "🏀", "运动比赛",
  "有人组织一场小比赛，缺人。",
  [["上场", { fitness: 2, support: 1, mood: 1 }, "你玩得很投入。", "体力+ 心情+"],
   ["当观众", { mood: 1, support: 1 }, "你加油助威。", "心情+ 社交+"],
   ["不参加", { support: 0 }, "你留了下来。", "——"]]);
L("🎮 休闲", "🛌", "午睡",
  "中午你有点犯困。",
  [["睡一会", { sleep: 2, mood: 1 }, "你下午精神多了。", "睡眠+"],
   ["硬撑着", { knowledge: 1, sleep: 1 }, "你坚持学习。", "学习+ 困意+"],
   ["出去走走", { fitness: 1, mood: 1 }, "你清醒了一下。", "体力+ 心情+"]]);
L("✨ 奇遇", "🌧️", "突然下雨",
  "天气说变就变，雨点落了下来。",
  [["找地方躲雨", { mood: 1 }, "你等雨停。", "心情+"],
   ["淋雨跑", { fitness: 1, health: -1 }, "你觉得很痛快。", "体力+ 健康-"],
   ["和同学共伞", { support: 1, charm: 1 }, "你们挤在一起。", "社交+ 魅力+"]]);
L("✨ 奇遇", "🍀", "小确幸",
  "今天你遇到一件幸运的小事。",
  [["开心地接受", { mood: 3, charm: 1 }, "你觉得今天运气不错。", "心情+"],
   ["分享给朋友", { support: 2, mood: 2 }, "你把好运分享了。", "社交+ 心情+"],
   ["平常心", { mood: 1 }, "你觉得没什么。", "心情+"]]);
L("💗 情感", "🤍", "拒绝",
  "有人向你表达好感，但你没感觉。",
  [["委婉地拒绝", { charm: 2, support: 1 }, "你没有让对方难堪。", "魅力+ 社交+"],
   ["假装不懂", { support: 0, mood: 1 }, "你想拖一拖。", "心情+"],
   ["直说", { support: -1, charm: 1 }, "你觉得长痛不如短痛。", "社交- 魅力+"]]);
L("💗 情感", "💞", "双向好感",
  "你和一个人互相都有好感。",
  [["勇敢一点", { charm: 2, support: 2, mood: 2 }, "你们的关系更近了。", "魅力+ 心情+"],
   ["再等等", { mood: 1, support: 1 }, "你想确认清楚。", "心情+ 社交+"],
   ["顺其自然", { mood: 1 }, "你相信缘分。", "心情+"]]);
L("📚 学习", "🗓️", "学习计划",
  "你想给自己定个学习计划。",
  [["认真制定", { knowledge: 2, mood: 1 }, "你有了目标和节奏。", "学习+ 心情+"],
   ["列个大概", { knowledge: 1 }, "你心里有数了。", "学习+"],
   ["不计划", { mood: 1 }, "你喜欢随性。", "心情+"]]);
L("🎮 休闲", "🍰", "甜品",
  "你想吃点甜的。",
  [["买份甜品", { mood: 2, money: -12 }, "你心情大好。", "心情+ 金钱-"],
   ["忍住", { health: 1 }, "你不想吃太甜。", "健康+"],
   ["和朋友分", { support: 1, mood: 1 }, "你们一起吃。", "社交+ 心情+"]]);
L("🏃 运动", "💧", "运动补水",
  "运动后你觉得渴。",
  [["及时补水", { health: 2 }, "你感觉舒服多了。", "健康+"],
   ["歇会再喝", { health: 1 }, "你调整了一下。", "健康+"],
   ["忍着", { health: -1 }, "你有点脱水。", "健康-"]]);
L("🗣️ 社交", "📷", "合照",
  "活动时大家喊你一起拍照。",
  [["开心入镜", { charm: 2, support: 1, mood: 1 }, "你融入了大家。", "魅力+ 心情+"],
   ["帮大家拍", { support: 1, charm: 1 }, "你记录了这一刻。", "社交+ 魅力+"],
   ["躲开", { support: -1, mood: 1 }, "你不太喜欢拍照。", "心情+ 社交-"]]);
L("✨ 奇遇", "🌙", "晚自习意外",
  "晚自习时发生了一件小插曲。",
  [["看热闹", { mood: 1 }, "你放松了一下。", "心情+"],
   ["帮忙处理", { support: 2, charm: 1 }, "你出了份力。", "社交+ 魅力+"],
   ["专心学习", { knowledge: 1 }, "你没受影响。", "学习+"]]);

/* ══════════════════════════════════════════════════════════
   模块三十三：更多校园见闻（家庭/成长/压力 主题，30 个）
   ══════════════════════════════════════════════════════════ */
L("📚 学习", "⏰", "考试压力",
  "大考临近，你明显感到压力。",
  [["合理安排复习", { knowledge: 2, health: 1 }, "你稳住了节奏。", "学习+ 健康+"],
   ["多运动解压", { fitness: 2, mood: 2 }, "压力得到释放。", "体力+ 心情+"],
   ["熬夜突击", { knowledge: 2, health: -2, sleep: -2 }, "你拼了但很累。", "学习+ 健康-"],
   ["放松心态", { mood: 2, knowledge: 1 }, "你不想绷太紧。", "心情+ 学习+"]]);
L("📚 学习", "🎯", "偏科",
  "你有一科特别薄弱，拉低了总分。",
  [["多花时间补弱科", { knowledge: 2, grade: 1 }, "弱科有了起色。", "学习+ 成绩+"],
   ["发挥优势科目", { knowledge: 1, grade: 1 }, "你用强项弥补。", "学习+ 成绩+"],
   ["找老师补习", { knowledge: 2, support: 1, money: -20 }, "老师针对性辅导。", "学习+ 金钱-"]]);
L("🗣️ 社交", "💸", "同学借钱",
  "有同学找你借一点钱。",
  [["借给他", { support: 2, money: -20 }, "你愿意帮忙。", "社交+ 金钱-"],
   ["说自己也紧张", { support: 1 }, "你婉拒了。", "社交+"],
   ["只借一点", { support: 1, money: -5 }, "你量力而行。", "社交+ 金钱-"]]);
L("🗣️ 社交", "😤", "同学矛盾",
  "你和同学因为一点小事起了摩擦。",
  [["冷静化解", { support: 2, mood: 1 }, "你们把话说开。", "社交+ 心情+"],
   ["找老师/同学调解", { support: 1 }, "事情得到解决。", "社交+"],
   ["据理力争", { support: -1, influence: 1 }, "你没让步。", "社交- 影响力+"],
   ["不理会", { mood: -1, support: -1 }, "你选择冷处理。", "心情- 社交-"]]);
L("🏃 运动", "🤕", "运动受伤",
  "运动时你不小心崴了一下。",
  [["及时处理休息", { health: 1, mood: 1 }, "你没有硬撑。", "健康+"],
   ["找校医看看", { health: 2 }, "你得到了处理。", "健康+"],
   ["继续运动", { health: -2 }, "你逞强了。", "健康-"]]);
L("🏃 运动", "😴", "运动后疲劳",
  "你练得有点过，身体很疲惫。",
  [["好好休息", { sleep: 2, health: 1 }, "你恢复了体力。", "睡眠+ 健康+"],
   ["补充营养", { health: 1, money: -10 }, "你吃了点好的。", "健康+ 金钱-"],
   ["继续坚持", { fitness: 1, health: -1 }, "你很拼。", "体力+ 健康-"]]);
L("🎮 休闲", "🌙", "熬夜",
  "你想再玩一会，已经很晚了。",
  [["克制住，睡觉", { sleep: 2, health: 1, mood: 1 }, "你做了正确选择。", "睡眠+ 健康+"],
   ["再玩半小时", { mood: 1, sleep: -2, health: -1 }, "你没忍住。", "心情+ 健康-"],
   ["通宵", { mood: 2, sleep: -4, health: -3 }, "你第二天很难受。", "心情+ 健康-"]]);
L("🎮 休闲", "💳", "冲动消费",
  "你看中一个不太需要的东西。",
  [["忍住不买", { money: 20, mood: 1 }, "你省下了钱。", "金钱+ 心情+"],
   ["买下来", { mood: 2, money: -30 }, "你图个开心。", "心情+ 金钱-"],
   ["等打折", { money: 10, mood: 1 }, "你很理性。", "金钱+ 心情+"]]);
L("✨ 奇遇", "🤝", "贵人相助",
  "有人在你困难时帮了你一把。",
  [["真诚道谢", { support: 2, mood: 2 }, "你记住了这份情。", "社交+ 心情+"],
   ["以后报答", { support: 2, charm: 1 }, "你记在心里。", "社交+ 魅力+"],
   ["记在心里", { mood: 1 }, "你很感激。", "心情+"]]);
L("✨ 奇遇", "📞", "意外来电",
  "你接到一个意外的电话。",
  [["认真接听", { support: 1, mood: 1 }, "你处理了事情。", "社交+ 心情+"],
   ["稍后回拨", { mood: 1 }, "你先忙手头的。", "心情+"],
   ["不接", { mood: 0, support: -1 }, "你没顾上。", "社交-"]]);
L("💗 情感", "💭", "异地思念",
  "你想念一个不在身边的人。",
  [["主动联系", { support: 1, mood: 2 }, "你缓解了思念。", "社交+ 心情+"],
   ["专注当下", { knowledge: 1, mood: 1 }, "你把精力放在眼前。", "学习+ 心情+"],
   ["写点什么", { mood: 1, charm: 1 }, "你表达了心意。", "心情+ 魅力+"]]);
L("💗 情感", "🌹", "感情升温",
  "你和在意的人关系有了进展。",
  [["趁热打铁", { charm: 2, support: 2, mood: 2 }, "你们更亲近了。", "魅力+ 心情+"],
   ["保持节奏", { mood: 1, support: 1 }, "你不想太急。", "心情+ 社交+"],
   ["有点害羞", { mood: 1, charm: 1 }, "你有点手足无措。", "心情+ 魅力+"]]);
L("📚 学习", "🧭", "未来方向",
  "你开始思考以后想做什么。",
  [["了解自己的兴趣", { knowledge: 1, mood: 1, charm: 1 }, "你更了解自己。", "学习+ 心情+"],
   ["先把成绩搞上去", { knowledge: 2 }, "你觉得成绩最重要。", "学习+"],
   ["和老师家人聊聊", { support: 1, knowledge: 1 }, "你听取建议。", "社交+ 学习+"],
   ["还没想好", { mood: 1 }, "你想顺其自然。", "心情+"]]);
L("📚 学习", "💡", "灵感",
  "学习时你突然想通了一个问题。",
  [["趁热打铁多学点", { knowledge: 2, mood: 1 }, "你状态正佳。", "学习+ 心情+"],
   ["记下来", { knowledge: 1 }, "你怕灵感溜走。", "学习+"],
   ["休息一下", { mood: 1, sleep: 1 }, "你见好就收。", "心情+ 睡眠+"]]);
L("🗣️ 社交", "🎂", "同学生日",
  "今天有同学过生日，邀请大家。",
  [["准备礼物参加", { support: 2, mood: 2, money: -15 }, "你送上了祝福。", "社交+ 心情+"],
   ["写张贺卡", { support: 1, charm: 1 }, "你的祝福很真诚。", "社交+ 魅力+"],
   ["有事不去", { support: 0 }, "你提前祝了生日快乐。", "——"]]);
L("🏃 运动", "🏆", "竞赛",
  "有一场比赛你想参加。",
  [["报名准备", { fitness: 2, support: 1, mood: 2 }, "你想挑战自己。", "体力+ 心情+"],
   ["先训练再说", { fitness: 1, health: 1 }, "你想准备充分。", "体力+ 健康+"],
   ["当观众", { mood: 1, support: 1 }, "你为同学加油。", "心情+ 社交+"]]);
L("🎮 休闲", "🎨", "培养爱好",
  "你想培养一个新爱好。",
  [["选一个感兴趣的", { charm: 2, mood: 2, knowledge: 1 }, "你的生活更丰富。", "魅力+ 心情+"],
   ["坚持练习", { knowledge: 1, charm: 1 }, "你慢慢有了长进。", "学习+ 魅力+"],
   ["先放放", { mood: 1 }, "你没太多时间。", "心情+"]]);
L("✨ 奇遇", "🔄", "计划外的事",
  "今天发生了一件打乱计划的事。",
  [["灵活调整", { mood: 1, knowledge: 1 }, "你适应得很好。", "心情+ 学习+"],
   ["有点烦躁", { mood: -1 }, "你不喜欢变化。", "心情-"],
   ["换个角度想", { mood: 1, charm: 1 }, "你看到了意外收获。", "心情+ 魅力+"]]);
L("✨ 奇遇", "⭐", "被表扬",
  "你因为一件小事被表扬了。",
  [["继续保持", { support: 1, mood: 2, charm: 1 }, "你很受鼓舞。", "心情+ 魅力+"],
   ["谦虚回应", { support: 1, charm: 2 }, "你赢得了好感。", "魅力+ 社交+"],
   ["觉得没什么", { mood: 1 }, "你很低调。", "心情+"]]);
L("💗 情感", "🤝", "信任",
  "有人把秘密告诉你。",
  [["认真保密", { support: 2, charm: 1 }, "你赢得了信任。", "社交+ 魅力+"],
   ["给点建议", { support: 2, knowledge: 1 }, "你帮TA出主意。", "社交+ 学习+"],
   ["分享自己的", { support: 1, mood: 1 }, "你们更亲近。", "社交+ 心情+"]]);
L("📚 学习", "📊", "错题本",
  "你想把错题整理一下。",
  [["系统整理", { knowledge: 2, grade: 1 }, "你总结了规律。", "学习+ 成绩+"],
   ["看一遍错题", { knowledge: 1 }, "你复习了。", "学习+"],
   ["不整理", { mood: 1 }, "你觉得没必要。", "心情+"]]);
L("🎮 休闲", "🍃", "放空",
  "你想给自己一点空白时间。",
  [["什么都不做", { mood: 2, sleep: 1 }, "你得到了休息。", "心情+ 睡眠+"],
   ["去自然里走走", { mood: 2, health: 1 }, "你放松了。", "心情+ 健康+"],
   ["发呆", { mood: 1 }, "你脑子空了。", "心情+"]]);
L("🏃 运动", "🧘", "拉伸/瑜伽",
  "你想做一些舒缓的运动。",
  [["跟着做", { health: 2, fitness: 1, charm: 1 }, "你身体很舒展。", "健康+ 魅力+"],
   ["自己摸索", { health: 1, fitness: 1 }, "你放松了。", "健康+ 体力+"],
   ["跳过", { mood: 1 }, "你没兴趣。", "心情+"]]);
L("🗣️ 社交", "📢", "小组合作",
  "你和几个同学分到一组。",
  [["主动承担", { support: 2, influence: 1, charm: 1 }, "你带动了小组。", "社交+ 影响力+"],
   ["做好分工", { knowledge: 1, support: 1 }, "小组配合默契。", "学习+ 社交+"],
   ["随大流", { support: 0, mood: 1 }, "你跟着大家。", "心情+"]]);
L("✨ 奇遇", "🌤️", "好天气",
  "今天天气格外好，让人心情舒畅。",
  [["出去走走", { mood: 2, fitness: 1, charm: 1 }, "你享受了好天气。", "心情+ 体力+"],
   ["多学一会", { knowledge: 1, mood: 1 }, "你想利用好天气。", "学习+ 心情+"],
   ["拍拍照", { mood: 1, charm: 1 }, "你记录了好天气。", "心情+ 魅力+"]]);
L("💗 情感", "💌", "收到心意",
  "你收到了一份小小心意。",
  [["真诚感谢", { mood: 2, charm: 1, support: 1 }, "你很珍惜。", "心情+ 魅力+"],
   ["回礼", { support: 1, money: -10 }, "你不想欠人情。", "社交+ 金钱-"],
   ["礼貌回应", { mood: 1 }, "你有点不好意思。", "心情+"]]);
L("📚 学习", "🔁", "复习",
  "你想把学过的内容复习一遍。",
  [["系统复习", { knowledge: 2, grade: 1 }, "你巩固了知识。", "学习+ 成绩+"],
   ["看重点", { knowledge: 1 }, "你抓大放小。", "学习+"],
   ["学新内容", { knowledge: 1, mood: 1 }, "你想学更多。", "学习+ 心情+"]]);
L("🗣️ 社交", "🙏", "道歉",
  "你发现自己错怪了别人。",
  [["主动道歉", { support: 2, charm: 1 }, "你赢得了谅解。", "社交+ 魅力+"],
   ["用行动弥补", { support: 2, fitness: 1 }, "你做出了补偿。", "社交+ 体力+"],
   ["不好意思开口", { mood: -1, support: 0 }, "你有点纠结。", "心情-"]]);
L("🎮 休闲", "🎁", "拆快递",
  "你收到一个期待已久的包裹。",
  [["开心地拆开", { mood: 2, charm: 1 }, "你很满足。", "心情+ 魅力+"],
   ["检查一下", { mood: 1 }, "你很细心。", "心情+"],
   ["先放着", { mood: 0 }, "你想晚点再拆。", "——"]]);
L("✨ 奇遇", "🧩", "新发现",
  "你发现了学校一个你不知道的地方。",
  [["去探索一下", { mood: 2, knowledge: 1, charm: 1 }, "你觉得很新鲜。", "心情+ 学习+"],
   ["分享给朋友", { support: 2, mood: 1 }, "你们一起去。", "社交+ 心情+"],
   ["记下位置", { mood: 1 }, "你想以后再来。", "心情+"]]);

/* ══════════════════════════════════════════════════════════
   模块三十四：校园人脉（6 个非恋爱 NPC）
   同步追加 roster 与 scriptOrder，保持下标一致。
   ══════════════════════════════════════════════════════════ */
(function () {
  var newNpc = [
    { id: "uncle", emoji: "🧓", name: "门卫张大爷", tag: "校门口 · 门卫", bio: "守了半辈子校门，记性好、心肠热。" },
    { id: "aunt", emoji: "👩‍🍳", name: "食堂阿姨", tag: "西子食堂", bio: "手不抖，看你顺眼就多给一勺。" },
    { id: "dorm", emoji: "👩‍🦰", name: "宿管阿姨", tag: "宿舍楼", bio: "管卫生、查晚归，嘴硬心软。" },
    { id: "president", emoji: "🎓", name: "学生会会长", tag: "学生会 · 学姐", bio: "干练漂亮，负责各类活动。" },
    { id: "senior", emoji: "👨‍🎓", name: "高三学长", tag: "学长", bio: "过来人，乐于分享经验。" },
    { id: "shop", emoji: "🧑‍💼", name: "小卖部老板", tag: "校园小卖部", bio: "卖文具零食，消息灵通。" }
  ];
  var order = ["uncle", "aunt", "dorm", "president", "senior", "shop"];
  newNpc.forEach(function (p) {
    if (X56Core.roster.map(function (x) { return x.id; }).indexOf(p.id) < 0)
      X56Core.roster.push(p);
  });
  order.forEach(function (id) {
    if (X56Chat.scriptOrder.indexOf(id) < 0) X56Chat.scriptOrder.push(id);
  });
})();

/* ── 门卫张大爷 ── */
XCS("uncle", "🧓", "张大爷", "a", {
  a: { from: "npc", text: "哎，同学！上课铃响了，还不快点？", choices: [
    { label: "我帮您看会儿门", to: "b" }, { label: "大爷好！我马上进去", to: "c" }] },
  b: { from: "npc", text: "哈哈，你这孩子有良心。记住，要懂得珍惜时间。", end: true, eff: { support: 1, mood: 1 } },
  c: { from: "npc", text: "去吧去吧！好好念书，将来有出息。", end: true, eff: { mood: 1 } }
});

/* ── 食堂阿姨 ── */
XCS("aunt", "👩‍🍳", "食堂阿姨", "a", {
  a: { from: "npc", text: "同学，今天想吃点什么？阿姨给你多打点。", choices: [
    { label: "阿姨手艺真好", to: "b" }, { label: "多来点蔬菜", to: "c" }] },
  b: { from: "npc", text: "嘴甜！来，多给你一勺排骨。吃饱了才有劲读书。", end: true, eff: { health: 1, mood: 1 } },
  c: { from: "npc", text: "好嘞，多吃蔬菜好，营养均衡！", end: true, eff: { health: 1 } }
});

/* ── 宿管阿姨 ── */
XCS("dorm", "👩‍🦰", "宿管阿姨", "a", {
  a: { from: "npc", text: "宿舍卫生要保持好，晚上按时回来，别熬夜。", choices: [
    { label: "知道了，阿姨辛苦了", to: "b" }, { label: "宿舍水管有点问题", to: "c" }] },
  b: { from: "npc", text: "懂事！有你这样的孩子我就放心。", end: true, eff: { support: 1, mood: 1 } },
  c: { from: "npc", text: "我记一下，马上报修。有问题及时说，别自己扛。", end: true, eff: { support: 1, health: 1 } }
});

/* ── 学生会会长 ── */
XCS("president", "🎓", "学生会会长", "a", {
  a: { from: "npc", text: "有兴趣加入学生会吗？活动锻炼人，也能交到朋友。", choices: [
    { label: "我想锻炼一下能力", to: "b" }, { label: "我怕影响学习", to: "c" }] },
  b: { from: "npc", text: "欢迎！组织协调很锻炼人，相信你会成长很多。", end: true, eff: { support: 2, influence: 2, charm: 1 } },
  c: { from: "npc", text: "也对。学习和活动要平衡，你想清楚了再来找我。", end: true, eff: { support: 1, knowledge: 1 } }
});

/* ── 高三学长 ── */
XCS("senior", "👨‍🎓", "高三学长", "a", {
  a: { from: "npc", text: "学弟/学妹？高一别光顾着玩，打好基础很重要。", choices: [
    { label: "有什么学习建议吗", to: "b" }, { label: "高中累不累", to: "c" }] },
  b: { from: "npc", text: "上课认真听、错题及时整理、别熬夜。坚持下来，你会感谢自己。", end: true, eff: { knowledge: 2, support: 1 } },
  c: { from: "npc", text: "累，但也充实。好好享受，高中会是你最难忘的时光。", end: true, eff: { mood: 1, knowledge: 1 } }
});

/* ── 小卖部老板 ── */
XCS("shop", "🧑‍💼", "小卖部老板", "a", {
  a: { from: "npc", text: "随便看看，文具零食都有，需要什么跟我说。", choices: [
    { label: "买点学习用品", to: "b" }, { label: "最近有什么新闻", to: "c" }] },
  b: { from: "npc", text: "好眼光！好好学习，文具我给你算便宜点。", end: true, eff: { knowledge: 1, money: -10 } },
  c: { from: "npc", text: "学校里能有啥大事，都是你们这帮孩子的青春事。好好享受吧。", end: true, eff: { mood: 1, support: 1 } }
});

/* ══════════════════════════════════════════════════════════
   模块三十五：校外时光（周末/放学后可去的杭州地点）
   6 个校外地点，花钱、放松、约会，让生活不止于校园。
   ══════════════════════════════════════════════════════════ */
var X56City = {
  KEY: "xz56_city_v1",
  places: [
    { id: "xihu", icon: "🏞️", name: "西湖", cost: 0,
      desc: "绕湖走走，看看断桥与荷花。",
      choices: [
        { label: "沿湖散步", reply: "湖风很柔，心情一下开阔。", eff: { mood: 4, health: 1, fitness: 1 } },
        { label: "坐船游湖", reply: "你在湖心看了一场好风景。", eff: { mood: 4, charm: 2, money: -30 } },
        { label: "拍照打卡", reply: "你拍到了满意的西湖。", eff: { mood: 3, charm: 2 } }] },
    { id: "bookstore", icon: "📚", name: "书店", cost: 0,
      desc: "在书店安静地待一下午。",
      choices: [
        { label: "看书写作业", reply: "书店氛围好，效率很高。", eff: { knowledge: 3, mood: 1 } },
        { label: "买本书", reply: "你淘到一本好书。", eff: { knowledge: 2, mood: 2, money: -35 } },
        { label: "随便翻翻", reply: "你放松又充实。", eff: { knowledge: 1, mood: 2 } }] },
    { id: "mall", icon: "🏬", name: "商场", cost: 0,
      desc: "逛逛街，看看新品。",
      choices: [
        { label: "逛街买东西", reply: "你买了喜欢的东西。", eff: { mood: 3, charm: 1, money: -60 } },
        { label: "只逛不买", reply: "你过了眼瘾，很理性。", eff: { mood: 2, money: 0 } },
        { label: "玩电玩", reply: "你在电玩城很开心。", eff: { mood: 3, money: -25 } }] },
    { id: "cinema", icon: "🎦", name: "电影院", cost: 0,
      desc: "看一部新上映的电影。",
      choices: [
        { label: "看大片", reply: "视听盛宴，很过瘾。", eff: { mood: 3, charm: 1, money: -45 } },
        { label: "看爱情片", reply: "你被剧情打动了。", eff: { mood: 3, charm: 2, money: -45 } },
        { label: "看纪录片", reply: "你学到了不少。", eff: { knowledge: 2, mood: 2, money: -40 } }] },
    { id: "tea", icon: "🧋", name: "奶茶街", cost: 0,
      desc: "找个小馆子喝杯奶茶。",
      choices: [
        { label: "点杯奶茶", reply: "甜滋滋的，很治愈。", eff: { mood: 3, money: -18 } },
        { label: "约朋友一起来", reply: "你们边喝边聊。", eff: { mood: 3, support: 2, money: -20 } },
        { label: "找家安静的店", reply: "你放松了一下午。", eff: { mood: 2, charm: 1, money: -15 } }] },
    { id: "park", icon: "🌳", name: "公园", cost: 0,
      desc: "去公园呼吸新鲜空气。",
      choices: [
        { label: "跑步锻炼", reply: "你在公园出了身汗。", eff: { fitness: 2, health: 2, mood: 1 } },
        { label: "野餐", reply: "你带了吃的，很惬意。", eff: { mood: 3, health: 1, money: -20 } },
        { label: "散步晒太阳", reply: "你晒了太阳，很舒服。", eff: { health: 2, mood: 2 } }] }
  ],
  load: function () {
    try { var r = storageGet(this.KEY); if (r) return JSON.parse(r); } catch (e) {}
    return { day: -1, used: 0, total: 0 };
  },
  save: function (d) { try { storageSet(this.KEY, JSON.stringify(d)); } catch (e) {} },
  go: function (placeId, ci) {
    var G = window.G;
    if (!G) { toast("进入游戏后可外出"); return; }
    var d = this.load();
    if (d.day !== G.day) { d.day = G.day; d.used = 0; }
    if (d.used >= 2) { toast("今天外出次数用完了"); return; }
    var place = null;
    this.places.forEach(function (p) { if (p.id === placeId) place = p; });
    if (!place) return;
    var c = place.choices[ci];
    if (!c) return;
    d.used++;
    d.total++;
    for (var k in c.eff) {
      if (typeof G[k] === "number") G[k] += c.eff[k];
    }
    this.save(d);
    if (typeof window.clampAll === "function") { try { window.clampAll(); } catch (e) {} }
    if (typeof window.upd === "function") { try { window.upd(); } catch (e) {} }
    var h = '<div class="city-result">' +
      '<div class="city-icon">' + place.icon + "</div>" +
      '<div class="city-name">' + place.name + "</div>" +
      '<div class="city-reply">' + c.reply + "</div>" +
      '<div class="city-eff">' + this.effText(c.eff) + "</div>" +
      '<div class="city-uses">今日剩余外出 ' + (2 - d.used) + " 次</div>" +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button></div>';
    modal(h);
  },
  effText: function (e) {
    var lb = { mood: "🙂 心情", sleep: "😴 睡眠", fitness: "💪 体力", health: "❤️ 健康",
      support: "✊ 支持", knowledge: "📘 学习", charm: "💫 魅力", money: "💰 金钱" };
    var parts = [];
    for (var k in e) {
      if (!e[k]) continue;
      parts.push(lb[k] + " " + (e[k] > 0 ? "+" : "") + e[k]);
    }
    return parts.join("　") || "——";
  },
  panel: function () {
    var G = window.G;
    if (!G) { toast("进入游戏后可外出"); return; }
    var d = this.load();
    if (d.day !== G.day) { d.day = G.day; d.used = 0; }
    var self = this;
    var h = '<div class="city-panel"><h3>🌆 校外时光</h3>' +
      '<div class="quote">今天还可以外出 <b>' + (2 - d.used) + "</b> 次<br>累计 " + d.total + " 次外出。</div>" +
      this.places.map(function (p) {
        return '<div class="city-place"><div class="cp-head"><span class="cp-icon">' + p.icon + "</span>" +
          '<span class="cp-name">' + p.name + "</span></div>" +
          '<div class="cp-desc">' + p.desc + "</div>" +
          '<div class="cp-choices">' +
          p.choices.map(function (c, i) {
            return '<button class="cp-btn" data-p="' + p.id + '" data-c="' + i + '">' + c.label + "</button>";
          }).join("") + "</div></div>";
      }).join("") +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button></div>';
    modal(h);
    setTimeout(function () {
      $a("#modalbox .cp-btn").forEach(function (b) {
        on(b, "click", function () {
          self.go(b.getAttribute("data-p"), parseInt(b.getAttribute("data-c"), 10));
        });
      });
    }, 80);
  }
};
window.X56City = X56City;

/* ══════════════════════════════════════════════════════════
   模块三十六：称号系统（根据你的成长动态授予头衔）
   24 个称号，按属性/行为解锁；在人物面板展示。
   ══════════════════════════════════════════════════════════ */
var X56Titles = {
  KEY: "xz56_titles_v1",
  titles: [
    { id: "scholar", icon: "🎓", name: "学霸", desc: "成绩顶尖、学识渊博。",
      cond: function (G) { return G.grade >= 85 && G.knowledge >= 70; } },
    { id: "roll", icon: "📚", name: "卷王", desc: "学习极其刻苦。",
      cond: function (G) { return G.st && G.st.study >= 5; } },
    { id: "social", icon: "🕺", name: "社交达人", desc: "人缘极好。",
      cond: function (G) { return G.relation >= 80 && G.support >= 60; } },
    { id: "influencer", icon: "🌟", name: "校园风云人物", desc: "影响力很高。",
      cond: function (G) { return G.influence >= 60; } },
    { id: "athlete", icon: "🏃", name: "运动健将", desc: "体魄强健。",
      cond: function (G) { return G.fitness >= 80 && G.health >= 80; } },
    { id: "charm", icon: "💫", name: "魅力四射", desc: "颜值与气质出众。",
      cond: function (G) { return G.charm >= 80 && G.appear >= 75; } },
    { id: "lucky", icon: "🍀", name: "锦鲤", desc: "运气爆表。",
      cond: function (G) { return G.luck >= 80; } },
    { id: "rich", icon: "💰", name: "小富翁", desc: "存款充裕。",
      cond: function (G) { return G.money >= 500; } },
    { id: "worker", icon: "💼", name: "劳模", desc: "勤工俭学非常勤快。",
      cond: function (G) { return G.st && G.st.work >= 8; } },
    { id: "healthy", icon: "❤️", name: "健康标兵", desc: "身体状态极佳。",
      cond: function (G) { return G.health >= 90 && G.sleep >= 70; } },
    { id: "earlybird", icon: "🐦", name: "早起鸟", desc: "作息规律。",
      cond: function (G) { return G.sleep >= 75 && G.mood >= 70; } },
    { id: "nightowl", icon: "🦉", name: "夜猫子", desc: "常常熬夜。",
      cond: function (G) { return G.sleep <= 25; } },
    { id: "art", icon: "🎨", name: "艺术青年", desc: "艺术修养出众。",
      cond: function (G) { return G.skill56 && (G.skill56.paint >= 40 || G.skill56.music >= 40); } },
    { id: "writer", icon: "✍️", name: "小作家", desc: "文笔出众。",
      cond: function (G) { return G.skill56 && G.skill56.write >= 40; } },
    { id: "coder", icon: "💻", name: "编程新星", desc: "编程能力突出。",
      cond: function (G) { return G.skill56 && G.skill56.code >= 40; } },
    { id: "ball", icon: "🏀", name: "篮球高手", desc: "球技出色。",
      cond: function (G) { return G.skill56 && G.skill56.ball >= 45; } },
    { id: "lover", icon: "💗", name: "恋爱中", desc: "心有所属。",
      cond: function (G) { return !!G.lover; } },
    { id: "clubstar", icon: "🎪", name: "社团之星", desc: "社团活动积极。",
      cond: function (G) { return G.clubLv && G.clubLv >= 10; } },
    { id: "achiever", icon: "🏆", name: "成就猎人", desc: "解锁很多成就。",
      cond: function (G) {
        var total = 50;
        var n = 0;
        for (var k in G.achievements) if (G.achievements[k]) n++;
        return n >= total * 0.6;
      } },
    { id: "happy", icon: "😄", name: "快乐源泉", desc: "总是很开心。",
      cond: function (G) { return G.mood >= 85; } },
    { id: "tough", icon: "🛡️", name: "铁人", desc: "抗压能力极强。",
      cond: function (G) { return G.health >= 80 && G.fitness >= 70 && G.mood >= 70; } },
    { id: "free", icon: "🕊️", name: "逍遥派", desc: "随性自在。",
      cond: function (G) { return G.mood >= 70 && G.st && G.st.skip >= 5; } },
    { id: "friend", icon: "🤝", name: "万人迷", desc: "朋友众多。",
      cond: function (G) { return G.support >= 75; } },
    { id: "rising", icon: "🚀", name: "冉冉新星", desc: "综合表现出色。",
      cond: function (G) {
        var sum = (G.grade || 0) + (G.charm || 0) + (G.fitness || 0) + (G.relation || 0);
        return sum >= 280;
      } }
  ],
  unlocked: function () {
    var G = window.G;
    if (!G) return [];
    var list = [];
    this.titles.forEach(function (t) {
      try { if (t.cond(G)) list.push(t); } catch (e) {}
    });
    return list;
  },
  currentTitle: function () {
    var list = this.unlocked();
    return list.length ? list[0] : null;
  },
  panel: function () {
    var G = window.G;
    if (!G) { toast("进入游戏后查看"); return; }
    var got = {};
    this.unlocked().forEach(function (t) { got[t.id] = 1; });
    var h = '<div class="title-panel"><h3>🎖️ 称号</h3>' +
      '<div class="quote">称号会随你的成长自动解锁，这是你努力的证明。</div>' +
      '<div class="title-grid">' +
      this.titles.map(function (t) {
        var on = got[t.id];
        return '<div class="title-cell ' + (on ? "t-on" : "t-off") + '">' +
          '<span class="tc-icon">' + t.icon + "</span>" +
          '<span class="tc-name">' + t.name + "</span>" +
          '<span class="tc-desc">' + (on ? t.desc : "未解锁") + "</span></div>";
      }).join("") + "</div>" +
      '<div class="title-count">已解锁 <b>' + this.unlocked().length + "</b> / " + this.titles.length + "</div>" +
      '<button class="gbtn" style="width:100%;margin-top:12px" onclick="X56.closeModal()">关闭</button></div>';
    modal(h);
  },
  /* 在首页展示当前称号 */
  injectBadge: function () {
    var body = $("x56CoreBody");
    if (!body) return;
    var head = body.querySelector(".x56-dash-head");
    if (!head || body.querySelector(".x56-title-badge")) return;
    var t = this.currentTitle();
    var b = document.createElement("div");
    b.className = "x56-title-badge";
    b.innerHTML = t ? (t.icon + " 当前称号：" + t.name) : "🌱 称号：暂无，继续成长";
    b.style.cssText = "display:inline-block;margin:6px 0;font-size:12.5px;font-weight:800;padding:4px 12px;border-radius:99px;background:var(--accent-soft);color:var(--accent);cursor:pointer;";
    head.appendChild(b);
    on(b, "click", function () { X56Titles.panel(); });
  }
};
window.X56Titles = X56Titles;
setInterval(function () { try { X56Titles.injectBadge(); } catch (e) {} }, 800);

/* ══════════════════════════════════════════════════════════
   模块三十七：友谊与同寝（非恋爱的人际温暖）
   ══════════════════════════════════════════════════════════ */
PL(function (G) { return true; }, "🛏️", "宿舍夜谈",
  "熄灯后，宿舍的人开始聊天。",
  [["加入夜谈", { support: 2, mood: 2, sleep: -2 }, "你们聊了很多，关系更近。", "社交+ 心情+ 熬夜"],
   ["听一会儿就睡", { mood: 1, sleep: 1 }, "你听着聊天慢慢睡着。", "睡眠+ 心情+"],
   ["提醒大家睡觉", { support: 1, sleep: 1 }, "你说明天还上课。", "睡眠+ 社交+"]]);
PL(function (G) { return true; }, "🍜", "帮室友带饭",
  "室友让你回来时帮忙带份饭。",
  [["乐意帮忙", { support: 2, money: -10 }, "你把饭带回宿舍。", "社交+"],
   ["要跑腿费", { money: 3, support: 0 }, "你开玩笑。", "金钱+"],
   ["不顺路", { support: 0 }, "你婉拒了。", "——"]]);
PL(function (G) { return true; }, "🧹", "室友矛盾",
  "室友之间因为作息/卫生有点小摩擦。",
  [["主动调解", { support: 2, charm: 2, mood: 1 }, "你化解了矛盾。", "社交+ 魅力+"],
   ["各自劝一劝", { support: 1 }, "气氛缓和了。", "社交+"],
   ["不管", { mood: -1, support: 0 }, "你戴上耳机。", "心情-"]]);
PL(function (G) { return true; }, "🎂", "室友生日",
  "今天有室友过生日，大家想一起庆祝。",
  [["凑钱买蛋糕", { support: 2, mood: 2, money: -20 }, "你们在宿舍过了生日。", "社交+ 心情+ 金钱-"],
   ["写张贺卡", { support: 1, charm: 1 }, "你的祝福很真诚。", "社交+ 魅力+"],
   ["准备惊喜", { support: 2, charm: 2 }, "你策划了一个小惊喜。", "社交+ 魅力+"]]);
PL(function (G) { return true; }, "🤝", "借笔记",
  "室友找你借笔记抄。",
  [["大方借出", { support: 2, charm: 1 }, "你乐意帮忙。", "社交+ 魅力+"],
   ["一起看", { support: 1, knowledge: 1 }, "你们一起复习。", "社交+ 学习+"],
   ["自己还要用", { support: 1 }, "你答应稍后借。", "社交+"]]);
PL(function (G) { return true; }, "🌧️", "室友忘带伞",
  "下雨，室友没带伞，在教学楼下等着。",
  [["送伞过去", { support: 2, charm: 1, mood: 1 }, "TA很感动。", "社交+ 魅力+"],
   ["一起等雨停", { support: 1, mood: 1 }, "你们在檐下聊天。", "社交+ 心情+"],
   ["先回宿舍", { support: 0 }, "你让TA自己想办法。", "——"]]);
PL(function (G) { return true; }, "🎧", "室友的歌",
  "室友外放音乐，声音有点大。",
  [["礼貌提醒", { support: 1, charm: 1 }, "TA戴上了耳机。", "社交+ 魅力+"],
   ["一起听", { support: 1, mood: 1 }, "你也喜欢这首歌。", "社交+ 心情+"],
   ["忍着", { mood: -1 }, "你有点烦。", "心情-"]]);
PL(function (G) { return true; }, "📦", "帮室友取快递",
  "室友让你顺路帮忙取个快递。",
  [["帮忙", { support: 2, fitness: 1 }, "你帮TA取了。", "社交+ 体力+"],
   ["拒绝", { support: 0 }, "你不顺路。", "——"],
   ["一起去", { support: 1, mood: 1 }, "你们顺路去拿。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "🆘", "室友生病",
  "室友不舒服，躺在床上。",
  [["照顾TA", { support: 3, charm: 1, mood: 1 }, "你打热水、带药。", "社交+ 魅力+"],
   ["陪TA去校医", { support: 2, health: 1 }, "你扶TA去。", "社交+ 健康+"],
   ["让TA好好休息", { support: 1 }, "你保持安静。", "社交+"]]);
PL(function (G) { return true; }, "📖", "一起自习",
  "室友约你一起去自习。",
  [["一起去", { knowledge: 2, support: 1 }, "你们互相监督，效率高。", "学习+ 社交+"],
   ["想自己学", { knowledge: 1 }, "你喜欢独处。", "学习+"],
   ["不想去", { mood: 1 }, "你想休息。", "心情+"]]);
PL(function (G) { return true; }, "🎉", "宿舍团建",
  "宿舍提议一起出去聚餐。",
  [["参加", { support: 2, mood: 2, money: -30 }, "你们度过了愉快时光。", "社交+ 心情+ 金钱-"],
   ["有事不去", { support: 0 }, "你下次再聚。", "——"],
   ["组织这次团建", { support: 2, influence: 2, charm: 1 }, "你安排得很周到。", "社交+ 影响力+"]]);
PL(function (G) { return true; }, "😢", "室友想家",
  "室友因为想家情绪低落。",
  [["安慰TA", { support: 2, mood: 1, charm: 1 }, "你陪TA聊了会。", "社交+ 魅力+"],
   ["分享自己的零食", { support: 1, mood: 1, money: -8 }, "TA好受多了。", "社交+ 心情+"],
   ["让TA给家里打电话", { support: 1, mood: 1 }, "你出了个主意。", "社交+ 心情+"]]);

/* ══════════════════════════════════════════════════════════
   模块三十九：约会番外 · 追加（每位女主 2 个特别场景）
   ══════════════════════════════════════════════════════════ */

/* 林晚 */
DS("lin", "一起看展览", "garden", "🖼️",
  [N("你和林晚去看了一场校园读书/摄影展。"),
   H("展览里有很多用心的作品，我想以后也能做点什么。"),
   M("你已经很棒了，慢慢来。")],
  [{ label: "陪她认真看", reply: "她在你身边轻声讲解。", aff: 2 },
   { label: "给她拍张照", reply: "她在展画前笑得很温柔。", aff: 2 },
   { label: "聊聊作品", reply: "你们越聊越投机。", aff: 1 }]);
DS("lin", "图书馆复习", "library", "📖",
  [N("期末前，你们在图书馆一起复习。"),
   H("有你在，我觉得复习也没那么累了。"),
   M("我们一起，一定没问题。")],
  [{ label: "互相抽背", reply: "你们效率很高，她进步明显。", aff: 2 },
   { label: "分享错题", reply: "她认真记下你的方法。", aff: 1 },
   { label: "一起休息", reply: "你们在休息区聊了未来。", aff: 2 }]);

/* 赵小雨 */
DS("zhao", "一起画画", "library", "🎨",
  [N("赵小雨拉着你一起画一幅画。"),
   H("别紧张，画画就是放松，想画什么就画什么。")],
  [{ label: "认真画", reply: "她看到你的画，笑得很开心。", aff: 2 },
   { label: "画她", reply: "她脸红了，却说画得不错。", aff: 2 },
   { label: "让她教你", reply: "她凑近手把手教你。", aff: 1 }]);
DS("zhao", "天台采风", "rooftop", "🌅",
  [N("你们在天台画夕阳，光线每时每刻都在变。"),
   H("快！晚霞最美的时间只有几分钟。")],
  [{ label: "和她一起画", reply: "你们抢着画同一片天空。", aff: 2 },
   { label: "看她画画", reply: "她专注的样子很美。", aff: 1 },
   { label: "一起看夕阳", reply: "光把你们都染成暖色。", aff: 2 }]);

/* 苏清颜 */
DS("su", "一起听音乐", "musicroom", "🎵",
  [N("苏清颜给你分享她喜欢的音乐。"),
   H("这首曲子，我想第一个给你听。")],
  [{ label: "认真听", reply: "你被旋律打动，她很开心。", aff: 2 },
   { label: "分享你的歌", reply: "她认真听了你的歌单。", aff: 1 },
   { label: "让她弹给你听", reply: "她在琴前为你弹了一段。", aff: 2 }]);
DS("su", "琴房陪伴", "musicroom", "🎹",
  [N("她在琴房练习，你在旁边安静地陪着。"),
   H("有你在，我练琴都不会觉得枯燥。")],
  [{ label: "安静听她练", reply: "她练完冲你笑。", aff: 2 },
   { label: "帮她翻谱", reply: "你们配合得很默契。", aff: 1 },
   { label: "请她喝东西", reply: "她被你照顾得很好。", aff: 2 }]);

/* 许念 */
DS("xu", "一起运动", "playground", "🏀",
  [N("许念拉着你一起去运动。"),
   H("来吧！运动一场，烦恼都没了。")],
  [{ label: "陪她打球", reply: "你们打得很痛快。", aff: 2 },
   { label: "让她教你", reply: "她很耐心地教你动作。", aff: 2 },
   { label: "比赛", reply: "她赢了，却笑得很开心。", aff: 1 }]);
DS("xu", "操场夜跑", "playground", "🌙",
  [N("晚上你们一起去操场跑步。"),
   H("夜跑最舒服了，凉快又安静。")],
  [{ label: "一起跑", reply: "你们并肩跑，节奏一致。", aff: 2 },
   { label: "陪她拉伸", reply: "她认真教你放松。", aff: 1 },
   { label: "跑完看星星", reply: "你们躺在草坪上聊天。", aff: 2 }]);

/* 沈知夏 */
DS("shen", "旧地重游", "gate", "🌻",
  [N("你们去了小时候常去的地方。"),
   H("这么多年了，幸好你还在我身边。")],
  [{ label: "一起回忆", reply: "她笑着靠在你肩上。", aff: 2 },
   { label: "拍合照", reply: "她说：和小时候放一起。", aff: 2 },
   { label: "约定以后", reply: "她说：以后也别分开。", aff: 1 }]);
DS("shen", "一起看夕阳", "rooftop", "🌇",
  [N("你们在天台看夕阳，像小时候那样。"),
   H("你说过会一直罩着我，这话现在还作数吗？")],
  [{ label: "作数，一辈子", reply: "她红了眼，却笑得很甜。", aff: 2 },
   { label: "牵她的手", reply: "她紧紧回握。", aff: 2 },
   { label: "安静看夕阳", reply: "她悄悄靠近你。", aff: 1 }]);

/* ══════════════════════════════════════════════════════════
   模块四十：日常自我管理（作息/健康/学习/情绪）
   ══════════════════════════════════════════════════════════ */
PL(function (G) { return true; }, "⏰", "起床",
  "闹钟响了，你有点不想起。",
  [["立刻起床", { sleep: 1, mood: 2, knowledge: 1 }, "你赶在铃响前到教室。", "心情+ 学习+"],
   ["赖床五分钟", { sleep: 1, mood: 1 }, "你差点迟到。", "睡眠+ 心情+"],
   ["再睡一会", { sleep: 2, knowledge: -1 }, "你迟到了。", "睡眠+ 学习-"]]);
PL(function (G) { return true; }, "🥛", "早餐",
  "你在想要不要吃早饭。",
  [["认真吃早餐", { health: 2, mood: 1, money: -6 }, "你上午很有精神。", "健康+ 心情+"],
   ["不吃了", { health: -1, knowledge: -1 }, "你上课有点饿。", "健康- 学习-"],
   ["喝点牛奶", { health: 1, charm: 1 }, "你简单垫了垫。", "健康+"]]);
PL(function (G) { return true; }, "💧", "喝水",
  "今天你记得多喝水吗？",
  [["定时喝水", { health: 2, mood: 1 }, "你状态很好。", "健康+"],
   ["忘了", { health: -1 }, "你有点缺水。", "健康-"],
   ["带个保温杯", { health: 1 }, "你随时能喝热水。", "健康+"]]);
PL(function (G) { return true; }, "📱", "手机使用",
  "你又忍不住拿起手机。",
  [["克制住", { knowledge: 1, sleep: 1, mood: 1 }, "你专心学习。", "学习+ 睡眠+"],
   ["玩十分钟", { mood: 1, knowledge: 0 }, "你放松了一下。", "心情+"],
   ["一直玩", { mood: 2, knowledge: -1, sleep: -1 }, "你没忍住。", "心情+ 学习-"]]);
PL(function (G) { return true; }, "🍚", "午饭",
  "中午你在想吃什么。",
  [["荤素搭配", { health: 2, mood: 1 }, "你吃得很营养。", "健康+ 心情+"],
   ["随便吃", { health: 1, mood: 1 }, "你填饱了肚子。", "健康+ 心情+"],
   ["吃零食", { health: -1, money: -8 }, "你图省事。", "健康-"]]);
PL(function (G) { return true; }, "😴", "午睡与否",
  "中午你有一点时间。",
  [["午睡", { sleep: 2, mood: 1 }, "下午精神好。", "睡眠+ 心情+"],
   ["学习", { knowledge: 1, sleep: 1 }, "你多学了一会。", "学习+ 困意+"],
   ["出去走", { fitness: 1, mood: 1 }, "你清醒了。", "体力+ 心情+"]]);
PL(function (G) { return true; }, "🏃", "课间活动",
  "课间你想活动一下。",
  [["去操场", { fitness: 1, mood: 1 }, "你活动了。", "体力+ 心情+"],
   ["在走廊", { health: 1 }, "你松快了。", "健康+"],
   ["坐着", { health: 0, mood: 1 }, "你想休息。", "心情+"]]);
PL(function (G) { return true; }, "📖", "晚自习",
  "晚自习，你在想要怎么安排。",
  [["复习功课", { knowledge: 2, grade: 1 }, "你巩固了知识。", "学习+ 成绩+"],
   ["预习新课", { knowledge: 1, mood: 1 }, "你走在前面。", "学习+ 心情+"],
   ["看课外书", { mood: 1, knowledge: 1 }, "你放松又充实。", "心情+ 学习+"]]);
PL(function (G) { return true; }, "🌙", "睡前",
  "睡觉前你想做点什么。",
  [["复盘今天", { knowledge: 1, mood: 1 }, "你整理了今天。", "学习+ 心情+"],
   ["看会书", { mood: 1, knowledge: 1 }, "你放松入睡。", "心情+ 学习+"],
   ["刷手机", { mood: 1, sleep: -1 }, "你越玩越精神。", "心情+ 睡眠-"]]);
PL(function (G) { return true; }, "🛌", "几点睡",
  "已经很晚了，你决定——",
  [["早睡", { sleep: 3, health: 1, mood: 1 }, "你睡得很足。", "睡眠+ 健康+"],
   ["再学一会", { knowledge: 1, sleep: -1 }, "你很拼。", "学习+ 睡眠-"],
   ["再玩一会", { mood: 1, sleep: -1, health: -1 }, "你没忍住。", "心情+ 睡眠-"]]);
PL(function (G) { return true; }, "🧼", "个人卫生",
  "今天你整理了自己的仪容。",
  [["认真打理", { charm: 2, appear: 1 }, "你清爽精神。", "魅力+ 颜值+"],
   ["随便", { charm: 1 }, "你保持干净。", "魅力+"],
   ["不修边幅", { charm: -1, appear: -1 }, "你有点邋遢。", "魅力-"]]);
PL(function (G) { return true; }, "🧥", "天气变化",
  "今天天气变化，你在想要怎么穿。",
  [["及时增减", { health: 2 }, "你没有着凉。", "健康+"],
   ["凭感觉", { health: 1, mood: 1 }, "你穿得差不多。", "健康+ 心情+"],
   ["没注意", { health: -1 }, "你有点冻着。", "健康-"]]);
PL(function (G) { return true; }, "🎯", "目标",
  "你想给自己定个小目标。",
  [["学习目标", { knowledge: 2, mood: 1 }, "你有了方向。", "学习+ 心情+"],
   ["健康目标", { health: 1, fitness: 1, mood: 1 }, "你想变好。", "健康+ 心情+"],
   ["社交目标", { support: 2, charm: 1 }, "你想交更多朋友。", "社交+ 魅力+"]]);
PL(function (G) { return true; }, "😌", "放松",
  "你觉得有点累，想放松。",
  [["休息一下", { sleep: 1, mood: 2 }, "你恢复了。", "睡眠+ 心情+"],
   ["运动", { fitness: 1, mood: 1 }, "你出了汗。", "体力+ 心情+"],
   ["和朋友聊", { support: 1, mood: 1 }, "你放松了。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "🧘", "情绪管理",
  "你情绪有点波动。",
  [["深呼吸", { mood: 2, health: 1 }, "你平静下来。", "心情+ 健康+"],
   ["找人倾诉", { support: 1, mood: 2 }, "你说出来了。", "社交+ 心情+"],
   ["自己消化", { mood: 1, sleep: 1 }, "你需要时间。", "心情+ 睡眠+"]]);
PL(function (G) { return true; }, "📚", "图书馆",
  "你在图书馆待了一会。",
  [["认真学习", { knowledge: 2, grade: 1 }, "你效率很高。", "学习+ 成绩+"],
   ["看书", { knowledge: 1, mood: 1 }, "你很安静。", "学习+ 心情+"],
   ["小憩", { sleep: 1 }, "你眯了一会。", "睡眠+"]]);
PL(function (G) { return true; }, "🏫", "校园广播",
  "校园广播里放着通知和音乐。",
  [["认真听通知", { knowledge: 1, support: 1 }, "你了解了活动。", "学习+ 社交+"],
   ["听音乐", { mood: 1, charm: 1 }, "你放松了。", "心情+ 魅力+"],
   ["不关心", { mood: 1 }, "你忙着自己的。", "心情+"]]);
PL(function (G) { return true; }, "🍵", "热水",
  "你想喝杯热水。",
  [["去接一杯", { health: 1, mood: 1 }, "你暖暖身子。", "健康+ 心情+"],
   ["喝凉的", { health: -1, mood: 1 }, "你图凉快。", "健康- 心情+"],
   ["不喝", { mood: 0 }, "你不渴。", "——"]]);
PL(function (G) { return true; }, "📓", "记笔记",
  "上课你在想要怎么记笔记。",
  [["认真记", { knowledge: 2, charm: 1 }, "你笔记工整。", "学习+ 魅力+"],
   ["记重点", { knowledge: 1 }, "你抓大放小。", "学习+"],
   ["不记", { knowledge: -1, mood: 1 }, "你靠听。", "学习- 心情+"]]);
PL(function (G) { return true; }, "🚶", "走路",
  "你想多走走路。",
  [["多走走", { fitness: 1, health: 1, mood: 1 }, "你活动了。", "体力+ 健康+ 心情+"],
   ["少走", { mood: 1 }, "你想省点力气。", "心情+"],
   ["小跑", { fitness: 1, mood: 1 }, "你赶时间。", "体力+ 心情+"]]);
PL(function (G) { return true; }, "🍎", "加餐",
  "你有点饿，想加点餐。",
  [["吃水果", { health: 2, mood: 1 }, "你很健康。", "健康+ 心情+"],
   ["吃零食", { health: -1, mood: 1, money: -6 }, "你垫了垫。", "健康- 心情+"],
   ["忍住", { health: 1, mood: 0 }, "你想等正餐。", "健康+"]]);
PL(function (G) { return true; }, "🌤️", "晒太阳",
  "今天阳光很好。",
  [["出去晒", { health: 1, mood: 2, charm: 1 }, "你很舒服。", "健康+ 心情+"],
   ["在室内", { mood: 1 }, "你学习。", "心情+ 学习+"],
   ["躲开", { mood: 1 }, "你怕晒。", "心情+"]]);
PL(function (G) { return true; }, "🎒", "整理书包",
  "你整理了一下书包。",
  [["认真整理", { knowledge: 1, charm: 1 }, "你井井有条。", "学习+ 魅力+"],
   ["随便", { knowledge: 1 }, "你找齐了东西。", "学习+"],
   ["不整理", { mood: 1 }, "你无所谓。", "心情+"]]);
PL(function (G) { return true; }, "🪞", "整理仪容",
  "出门前你照了照镜子。",
  [["认真整理", { appear: 2, charm: 2 }, "你精神好看。", "颜值+ 魅力+"],
   ["看一眼", { charm: 1 }, "你确认了一下。", "魅力+"],
   ["不看", { mood: 1 }, "你随性。", "心情+"]]);

/* ══════════════════════════════════════════════════════════
   模块四十一：女主长聊（更深入的日常对话）
   用新的脚本 id 不覆盖原有；但为保持人物按钮，
   这里直接替换 X56Chat.scripts[h] 的起始节点引用，
   把更多节点并入已有树。
   ══════════════════════════════════════════════════════════ */

/* 给林晚追加深入分支 */
(function () {
  var t = X56Chat.scripts.lin;
  if (!t) return;
  t.nodes.d_ask = { from: "npc", text: "我其实……有点怕和你靠太近。怕太美好，怕会失去。",
    choices: [{ label: "不会的，我会一直在", to: "d_ask2" }, { label: "那就慢慢走", to: "d_ask3" }] };
  t.nodes.d_ask2 = { from: "npc", text: "嗯……有你这句话，我就敢勇敢一点。", end: true, eff: { aff: 3, mood: 2 } };
  t.nodes.d_ask3 = { from: "npc", text: "好。慢慢走，我陪你。", end: true, eff: { aff: 2, mood: 1 } };
  t.nodes.a.choices.push({ label: "你有在害怕什么吗", to: "d_ask" });
})();

/* 给赵小雨追加 */
(function () {
  var t = X56Chat.scripts.zhao;
  if (!t) return;
  t.nodes.z_ask = { from: "npc", text: "你知道吗，画画对我来说，是把说不出口的话都画出来。",
    choices: [{ label: "那我能当你的画中人吗", to: "z_ask2" }, { label: "你画得真好", to: "z_ask3" }] };
  t.nodes.z_ask2 = { from: "npc", text: "（她脸红）你要愿意……我第一个画你。", end: true, eff: { aff: 3, mood: 2 } };
  t.nodes.z_ask3 = { from: "npc", text: "谢谢！我会一直画下去的。", end: true, eff: { aff: 2, mood: 1 } };
  t.nodes.a.choices.push({ label: "画画对你来说是什么", to: "z_ask" });
})();

/* 给苏清颜追加 */
(function () {
  var t = X56Chat.scripts.su;
  if (!t) return;
  t.nodes.q_ask = { from: "npc", text: "这首曲子，我想让你第一个听。它藏着我没说出口的话。",
    choices: [{ label: "我听懂了，也有话想对你说", to: "q_ask2" }, { label: "我会认真听", to: "q_ask3" }] };
  t.nodes.q_ask2 = { from: "npc", text: "（她眼睛亮了）那……等这首曲子写完，你说给我听好吗。", end: true, eff: { aff: 3, mood: 2 } };
  t.nodes.q_ask3 = { from: "npc", text: "好。听音乐和说话，都需要认真。", end: true, eff: { aff: 2, mood: 1 } };
  t.nodes.a.choices.push({ label: "你有想让我第一个听的曲子吗", to: "q_ask" });
})();

/* 给许念追加 */
(function () {
  var t = X56Chat.scripts.xu;
  if (!t) return;
  t.nodes.x_ask = { from: "npc", text: "别人都觉得我大大咧咧，其实我也有很在意、很怕搞砸的事。",
    choices: [{ label: "比如在意我？", to: "x_ask2" }, { label: "你已经很好了", to: "x_ask3" }] };
  t.nodes.x_ask2 = { from: "npc", text: "（她难得脸红）……算你厉害。", end: true, eff: { aff: 3, mood: 2 } };
  t.nodes.x_ask3 = { from: "npc", text: "有你这句话，我就不怕了。", end: true, eff: { aff: 2, mood: 1 } };
  t.nodes.a.choices.push({ label: "你也有怕的事吗", to: "x_ask" });
})();

/* 给沈知夏追加 */
(function () {
  var t = X56Chat.scripts.shen;
  if (!t) return;
  t.nodes.s_ask = { from: "npc", text: "咱俩认识这么多年，你有没有哪一刻……把我当成女生看，而不只是发小？",
    choices: [{ label: "有，很早就有了", to: "s_ask2" }, { label: "你在我心里一直很特别", to: "s_ask3" }] };
  t.nodes.s_ask2 = { from: "npc", text: "（她红了眼）那你怎么不早说……害我等了那么久。", end: true, eff: { aff: 3, mood: 2 } };
  t.nodes.s_ask3 = { from: "npc", text: "（她小声）特别……是哪种特别？", end: true, eff: { aff: 2, mood: 1 } };
  t.nodes.a.choices.push({ label: "你有把我当男生看吗", to: "s_ask" });
})();

/* ══════════════════════════════════════════════════════════
   模块四十二：校园见闻 · 第四批（青春/选择/成长，28 个）
   ══════════════════════════════════════════════════════════ */
L("📚 学习", "📐", "请教问题",
  "你有一道题想不明白，决定去问。",
  [["问老师", { knowledge: 2, support: 1 }, "老师讲得很透彻。", "学习+ 社交+"],
   ["问成绩好的同学", { knowledge: 1, support: 1 }, "你听懂了。", "学习+ 社交+"],
   ["自己死磕", { knowledge: 2, sleep: -1 }, "你终于做出来了。", "学习+ 时间-"]]);
L("📚 学习", "🗃️", "整理资料",
  "你的书桌/书包有点乱。",
  [["认真整理", { knowledge: 1, mood: 1 }, "你找东西方便多了。", "学习+ 心情+"],
   ["简单收一下", { knowledge: 1 }, "你大致收拾了。", "学习+"],
   ["不管", { mood: 1 }, "你觉得乱点无所谓。", "心情+"]]);
L("🗣️ 社交", "👋", "新同学",
  "班里/隔壁来了新同学，一个人站着。",
  [["主动打招呼", { support: 2, charm: 2 }, "你让TA没那么拘谨。", "社交+ 魅力+"],
   ["带TA熟悉环境", { support: 2, knowledge: 1 }, "你帮TA找教室、食堂。", "社交+ 学习+"],
   ["看看再说", { support: 1 }, "你想先观察。", "社交+"]]);
L("🗣️ 社交", "🎤", "帮同学",
  "同学忙不过来，你看到了。",
  [["搭把手", { support: 2, charm: 1, mood: 1 }, "你帮TA解决了。", "社交+ 心情+"],
   ["教TA怎么做", { support: 2, knowledge: 1 }, "你出了主意。", "社交+ 学习+"],
   ["没注意", { mood: 1 }, "你在忙自己的。", "心情+"]]);
L("🏃 运动", "🤾", "球类",
  "有人在打球，缺人。",
  [["加入", { fitness: 2, support: 1, mood: 1 }, "你玩得很投入。", "体力+ 心情+"],
   ["当裁判", { support: 1, mood: 1 }, "你参与了。", "社交+ 心情+"],
   ["不参加", { mood: 1 }, "你想休息。", "心情+"]]);
L("🏃 运动", "🚴", "骑行",
  "你想骑车出去转转。",
  [["骑一段", { fitness: 2, health: 1, mood: 2 }, "你吹着风很开心。", "体力+ 心情+"],
   ["慢骑", { health: 1, mood: 1 }, "你放松了。", "健康+ 心情+"],
   ["不骑", { mood: 1 }, "你没心情。", "心情+"]]);
L("🎮 休闲", "🎵", "听音乐",
  "你想放点音乐。",
  [["听流行", { mood: 2, charm: 1 }, "你跟着哼。", "心情+ 魅力+"],
   ["听纯音乐", { mood: 1, sleep: 1 }, "你放松了。", "心情+ 睡眠+"],
   ["不听", { mood: 1 }, "你想安静。", "心情+"]]);
L("🎮 休闲", "🍿", "追剧",
  "你最近追了一部剧。",
  [["看一集", { mood: 2, sleep: -1 }, "你放松了。", "心情+ 时间-"],
   ["克制住", { sleep: 1, knowledge: 1 }, "你先学习。", "睡眠+ 学习+"],
   ["和朋友讨论", { support: 1, mood: 1 }, "你们聊剧情。", "社交+ 心情+"]]);
L("✨ 奇遇", "🌟", "意外的表扬",
  "你被老师/同学意外表扬。",
  [["谦虚", { charm: 2, support: 1 }, "你赢得了好感。", "魅力+ 社交+"],
   ["继续努力", { mood: 2, knowledge: 1 }, "你很受鼓舞。", "心情+ 学习+"],
   ["开心", { mood: 2 }, "你很满足。", "心情+"]]);
L("✨ 奇遇", "🎁", "意外的礼物",
  "你收到一份意外的小礼物。",
  [["感谢", { mood: 2, charm: 1 }, "你很珍惜。", "心情+ 魅力+"],
   ["回礼", { support: 1, money: -10 }, "你不想欠人情。", "社交+ 金钱-"],
   ["开心收下", { mood: 2 }, "你很惊喜。", "心情+"]]);
L("💗 情感", "👀", "偶遇",
  "你在某个地方偶遇在意的人。",
  [["主动打招呼", { support: 1, mood: 2, charm: 1 }, "你们聊了会。", "心情+ 魅力+"],
   ["一起走", { support: 1, mood: 2 }, "你们顺路。", "心情+ 社交+"],
   ["偷偷看", { mood: 1 }, "你有点害羞。", "心情+"]]);
L("💗 情感", "💬", "吵架",
  "你和在意的人拌了嘴。",
  [["主动和好", { support: 2, mood: 1, charm: 1 }, "你们和好了。", "社交+ 魅力+"],
   ["冷静沟通", { support: 2, knowledge: 1 }, "你们说开了。", "社交+ 学习+"],
   ["冷战", { mood: -1, support: -1 }, "你们都难受。", "心情- 社交-"]]);
L("📚 学习", "⏳", "时间管理",
  "你觉得时间不够用。",
  [["列计划", { knowledge: 2, mood: 1 }, "你有条理了。", "学习+ 心情+"],
   ["少玩点", { knowledge: 1, mood: 1 }, "你挤时间。", "学习+ 心情+"],
   ["顺其自然", { mood: 1 }, "你不勉强。", "心情+"]]);
L("🎮 休闲", "🍦", "冷饮",
  "天热，你想吃点凉的。",
  [["买冰淇淋", { mood: 2, money: -8 }, "你很开心。", "心情+ 金钱-"],
   ["喝水", { health: 1 }, "你很健康。", "健康+"],
   ["忍住", { health: 1, mood: 1 }, "你怕太凉。", "健康+ 心情+"]]);
L("🏃 运动", "🧗", "挑战",
  "你想挑战一个难一点的动作。",
  [["尝试", { fitness: 2, health: -1, mood: 2 }, "你很有成就感。", "体力+ 心情+"],
   ["先练基础", { fitness: 1, health: 1 }, "你很稳。", "体力+ 健康+"],
   ["放弃", { mood: 1 }, "你不想冒险。", "心情+"]]);
L("🗣️ 社交", "🧋", "请喝奶茶",
  "你想请朋友喝奶茶。",
  [["请客", { support: 2, mood: 1, money: -20 }, "你很大方。", "社交+ 心情+ 金钱-"],
   ["AA", { support: 1, mood: 1 }, "你们都轻松。", "社交+ 心情+"],
   ["下次", { mood: 1 }, "你现在没钱。", "心情+"]]);
L("✨ 奇遇", "🌧️", "彩虹",
  "雨后你看到了彩虹。",
  [["欣赏", { mood: 3, charm: 1 }, "你觉得很美。", "心情+ 魅力+"],
   ["拍照", { mood: 2, charm: 1 }, "你记录下来。", "心情+ 魅力+"],
   ["分享", { support: 2, mood: 2 }, "你叫朋友看。", "社交+ 心情+"]]);
L("📚 学习", "📖", "背诵",
  "你要背一些东西。",
  [["分段背", { knowledge: 2, mood: 1 }, "你记得牢。", "学习+ 心情+"],
   ["理解背", { knowledge: 2, sleep: 1 }, "你效率高。", "学习+ 困意+"],
   ["死记", { knowledge: 1, sleep: -1 }, "你背得慢。", "学习+ 时间-"]]);
L("🗣️ 社交", "🤲", "分享",
  "你有好吃的/好玩的。",
  [["分享", { support: 2, charm: 1, mood: 1 }, "你和朋友都开心。", "社交+ 心情+"],
   ["自己留着", { mood: 1 }, "你想独享。", "心情+"],
   ["换", { support: 1, mood: 1 }, "你们交换。", "社交+ 心情+"]]);
L("🏃 运动", "🏊", "游泳",
  "天热，你想去游泳。",
  [["去游", { fitness: 2, health: 1, mood: 2 }, "你很凉快。", "体力+ 心情+"],
   ["注意安全", { health: 1, fitness: 1 }, "你做好准备。", "健康+ 体力+"],
   ["不去", { mood: 1 }, "你不会水。", "心情+"]]);
L("🎮 休闲", "🛋️", "躺平",
  "你想什么都不干。",
  [["躺平", { sleep: 1, mood: 2 }, "你得到休息。", "睡眠+ 心情+"],
   ["放空", { mood: 1, sleep: 1 }, "你脑子空了。", "心情+ 睡眠+"],
   ["还是学习", { knowledge: 1, mood: 1 }, "你闲不住。", "学习+ 心情+"]]);
L("✨ 奇遇", "🦋", "蝴蝶",
  "你看到一只漂亮的蝴蝶。",
  [["观察", { mood: 2, charm: 1 }, "你觉得很美。", "心情+ 魅力+"],
   ["拍照", { mood: 1, charm: 1 }, "你记录下来。", "心情+ 魅力+"],
   ["不打扰", { mood: 1 }, "你让它飞走。", "心情+"]]);
L("💗 情感", "🌹", "礼物",
  "你想给在意的人送礼物。",
  [["用心准备", { charm: 2, support: 2, mood: 1, money: -25 }, "TA很感动。", "魅力+ 社交+ 金钱-"],
   ["写卡片", { charm: 2, support: 1 }, "你的心意很真诚。", "魅力+ 社交+"],
   ["下次", { mood: 1 }, "你想等合适时机。", "心情+"]]);
L("📚 学习", "🔤", "外语",
  "你在学外语。",
  [["多背单词", { knowledge: 2, grade: 1 }, "你词汇量增加。", "学习+ 成绩+"],
   ["练听说", { knowledge: 1, charm: 1 }, "你敢开口。", "学习+ 魅力+"],
   ["看剧学", { mood: 1, knowledge: 1 }, "你边玩边学。", "心情+ 学习+"]]);
L("🗣️ 社交", "🙋", "回答问题",
  "老师提问，你在想要不要举手。",
  [["举手", { knowledge: 1, charm: 2, support: 1 }, "你赢得了关注。", "学习+ 魅力+"],
   ["被叫才答", { knowledge: 1 }, "你答上了。", "学习+"],
   ["低头", { mood: 1 }, "你怕答错。", "心情+"]]);
L("🏃 运动", "🚶‍♀️", "散步",
  "你想慢慢走走。",
  [["散步", { health: 1, mood: 2, fitness: 1 }, "你放松了。", "健康+ 心情+"],
   ["听音乐走", { mood: 2, charm: 1 }, "你很享受。", "心情+ 魅力+"],
   ["不走", { mood: 1 }, "你想坐着。", "心情+"]]);
L("🎮 休闲", "🍰", "甜品店",
  "你想去甜品店。",
  [["吃甜品", { mood: 3, money: -20 }, "你很开心。", "心情+ 金钱-"],
   ["约朋友", { support: 1, mood: 2 }, "你们一起。", "社交+ 心情+"],
   ["忍住", { health: 1, mood: 1 }, "你怕胖。", "健康+ 心情+"]]);
L("✨ 奇遇", "🌠", "流星",
  "你听说/看到有流星。",
  [["许愿", { mood: 3, charm: 1 }, "你许下心愿。", "心情+ 魅力+"],
   ["欣赏", { mood: 2 }, "你觉得浪漫。", "心情+"],
   ["睡觉", { sleep: 1, mood: 1 }, "你没等。", "睡眠+ 心情+"]]);

/* ══════════════════════════════════════════════════════════
   模块四十三：校园生活 · 第五批（课堂/活动/讲座，26 个）
   ══════════════════════════════════════════════════════════ */
PL(function (G) { return true; }, "🧪", "实验课",
  "今天上实验课，要分组动手做实验。",
  [["认真操作记录", { knowledge: 2, charm: 1 }, "你小组顺利完成实验。", "学习+ 魅力+"],
   ["和同学配合", { support: 2, knowledge: 1 }, "你们分工默契。", "社交+ 学习+"],
   ["小心别出错", { health: 1, knowledge: 1 }, "你严格按步骤。", "安全+ 学习+"]]);
PL(function (G) { return true; }, "💻", "信息课",
  "信息课上，大家对着电脑。",
  [["认真学软件/编程", { knowledge: 2, charm: 1 }, "你掌握了新技能。", "学习+ 魅力+"],
   ["偷偷玩电脑", { mood: 1, knowledge: 0 }, "你放松了一下。", "心情+"],
   ["帮同学", { support: 2, charm: 1 }, "你帮TA解决问题。", "社交+ 魅力+"]]);
PL(function (G) { return true; }, "🎙️", "老师拖堂",
  "下课铃响了，老师还没讲完。",
  [["认真听完", { knowledge: 1, support: 1 }, "你尊重老师。", "学习+ 社交+"],
   ["有点着急", { mood: 1 }, "你想上厕所/吃饭。", "心情+"],
   ["偷偷看表", { mood: 1 }, "你盼着下课。", "心情+"]]);
PL(function (G) { return true; }, "📋", "随堂测验",
  "老师突然来个小测验。",
  [["认真答题", { knowledge: 2, grade: 1 }, "你平时有积累。", "学习+ 成绩+"],
   ["有点慌", { knowledge: 1, mood: 1 }, "你尽力写。", "学习+ 心情+"],
   ["靠感觉", { mood: 1 }, "你不紧张。", "心情+"]]);
PL(function (G) { return true; }, "🖋️", "被点名回答",
  "老师突然点到你的名字。",
  [["站起来回答", { knowledge: 1, charm: 2, support: 1 }, "你答对了。", "学习+ 魅力+"],
   ["答不上来", { mood: 1, knowledge: 1 }, "你说还在想。", "心情+ 学习+"],
   ["向同学求助", { support: 1 }, "你小声问。", "社交+"]]);
PL(function (G) { return true; }, "🧑‍🤝‍🧑", "同桌互动",
  "你和同桌在课上/课间。",
  [["搞好关系", { support: 2, mood: 1 }, "你们成了好搭档。", "社交+ 心情+"],
   ["互相监督", { knowledge: 1, support: 1 }, "你们一起学习。", "学习+ 社交+"],
   ["各做各的", { mood: 1 }, "你保持安静。", "心情+"]]);
PL(function (G) { return true; }, "🎪", "社团招新",
  "社团在校园里摆摊招新。",
  [["报名感兴趣的", { support: 2, mood: 2, charm: 1 }, "你加入了社团。", "社交+ 心情+"],
   ["多了解几个", { support: 1, knowledge: 1 }, "你四处看看。", "社交+ 学习+"],
   ["不参加", { mood: 1, knowledge: 1 }, "你想专心学习。", "学习+ 心情+"]]);
PL(function (G) { return true; }, "🎓", "校园讲座",
  "学校请人来开讲座。",
  [["认真听", { knowledge: 2, mood: 1 }, "你学到了东西。", "学习+ 心情+"],
   ["记笔记", { knowledge: 1, charm: 1 }, "你很认真。", "学习+ 魅力+"],
   ["去了但走神", { mood: 1 }, "你放松了。", "心情+"]]);
PL(function (G) { return true; }, "🚨", "消防演练",
  "学校组织消防/应急演练。",
  [["认真配合", { support: 1, health: 1, knowledge: 1 }, "你学会了自救知识。", "安全+ 学习+"],
   ["快速撤离", { fitness: 1, support: 1 }, "你按要求行动。", "体力+ 社交+"],
   ["觉得走过场", { mood: 1 }, "你不当回事。", "心情+"]]);
PL(function (G) { return true; }, "🩺", "体检",
  "学校组织体检。",
  [["了解自己身体", { health: 1, knowledge: 1 }, "你知道了各项指标。", "健康+ 学习+"],
   ["有点紧张", { mood: 1 }, "你怕抽血。", "心情+"],
   ["配合检查", { health: 1, support: 1 }, "你很配合。", "健康+ 社交+"]]);
PL(function (G) { return true; }, "🎨", "校园艺术节",
  "艺术节到了，各种节目和展览。",
  [["上台表演", { charm: 3, mood: 2, support: 1 }, "你展示了自己。", "魅力+ 心情+"],
   ["参观展览", { mood: 2, knowledge: 1 }, "你很享受。", "心情+ 学习+"],
   ["帮忙组织", { support: 2, fitness: 1 }, "你出了力。", "社交+ 体力+"]]);
PL(function (G) { return true; }, "🔬", "科技节",
  "学校举办科技节，有小发明、小制作。",
  [["参与项目", { knowledge: 2, charm: 1, support: 1 }, "你动手实践。", "学习+ 魅力+"],
   ["参观体验", { knowledge: 1, mood: 1 }, "你觉得新鲜。", "学习+ 心情+"],
   ["不感兴趣", { mood: 1 }, "你随便看看。", "心情+"]]);
PL(function (G) { return true; }, "📖", "读书节",
  "读书节，学校推荐好书、办读书分享。",
  [["读一本好书", { knowledge: 2, mood: 1, charm: 1 }, "你很充实。", "学习+ 心情+"],
   ["做分享", { support: 2, charm: 2 }, "你上台推荐。", "社交+ 魅力+"],
   ["随便翻翻", { mood: 1, knowledge: 1 }, "你放松了。", "心情+ 学习+"]]);
PL(function (G) { return true; }, "🤲", "志愿者",
  "有志愿者活动招募。",
  [["报名", { support: 2, mood: 2, charm: 1 }, "你帮助了别人。", "社交+ 心情+"],
   ["有空再说", { support: 1 }, "你记下了。", "社交+"],
   ["不参加", { mood: 1 }, "你没时间。", "心情+"]]);
PL(function (G) { return true; }, "📻", "广播站点歌",
  "校园广播站可以点歌。",
  [["点首喜欢的歌", { mood: 2, charm: 1 }, "你期待它被播放。", "心情+ 魅力+"],
   ["给朋友点", { support: 2, mood: 1 }, "你给TA惊喜。", "社交+ 心情+"],
   ["不点", { mood: 1 }, "你听着就好。", "心情+"]]);
PL(function (G) { return true; }, "💳", "校园卡",
  "你的校园卡快没钱了/找不到了。",
  [["去充值", { money: -50, mood: 1 }, "你又能正常消费。", "金钱- 心情+"],
   ["仔细找", { knowledge: 1, mood: 1 }, "你在书包里找到。", "学习+ 心情+"],
   ["挂失", { support: 1, money: -10 }, "你及时处理。", "社交+ 金钱-"]]);
PL(function (G) { return true; }, "🍲", "食堂新菜",
  "食堂推出了新菜。",
  [["尝尝", { health: 1, mood: 2, money: -10 }, "你觉得还不错。", "健康+ 心情+"],
   ["等别人测评", { support: 1, mood: 1 }, "你先观望。", "社交+ 心情+"],
   ["不吃", { mood: 1 }, "你点老样子。", "心情+"]]);
PL(function (G) { return true; }, "🧑‍🏫", "晚自习答疑",
  "晚自习有老师在，可以问问题。",
  [["主动提问", { knowledge: 2, support: 1 }, "你搞懂了难点。", "学习+ 社交+"],
   ["自己解决", { knowledge: 1, mood: 1 }, "你独立思考。", "学习+ 心情+"],
   ["不问", { mood: 1 }, "你想明天再说。", "心情+"]]);
PL(function (G) { return true; }, "📮", "失物招领",
  "你丢了东西，去失物招领处看看。",
  [["去登记/寻找", { support: 1, knowledge: 1 }, "你按流程找。", "社交+ 学习+"],
   ["问同学", { support: 1, mood: 1 }, "你四处打听。", "社交+ 心情+"],
   ["算了", { mood: -1 }, "你不抱希望。", "心情-"]]);
PL(function (G) { return true; }, "🏃", "体育自由活动",
  "体育课自由活动，你在想做什么。",
  [["运动", { fitness: 2, health: 1, mood: 1 }, "你活动了。", "体力+ 心情+"],
   ["和同学聊天", { support: 1, mood: 1 }, "你放松了。", "社交+ 心情+"],
   ["坐着休息", { sleep: 1, mood: 1 }, "你有点累。", "睡眠+ 心情+"]]);
PL(function (G) { return true; }, "📢", "班会",
  "今天开班会，讨论班级事务。",
  [["发言", { support: 2, influence: 2, charm: 1 }, "你表达了想法。", "社交+ 影响力+"],
   ["认真听", { support: 1, knowledge: 1 }, "你了解班级安排。", "社交+ 学习+"],
   ["走神", { mood: 1 }, "你在想别的。", "心情+"]]);
PL(function (G) { return true; }, "👨‍👩‍👧", "家长会",
  "学校要开家长会，老师让通知家长。",
  [["认真通知", { support: 1, knowledge: 1 }, "你表现得好，不怕家长会。", "社交+ 学习+"],
   ["有点担心", { mood: 1 }, "你最近表现一般。", "心情+"],
   ["不通知", { support: -1, mood: 1 }, "你能瞒就瞒。", "社交- 心情+"]]);
PL(function (G) { return true; }, "📚", "走廊背书",
  "考试前，走廊里都是背书的人。",
  [["加入", { knowledge: 2, mood: 1 }, "你认真复习。", "学习+ 心情+"],
   ["找个角落", { knowledge: 1, sleep: 1 }, "你独自背。", "学习+ 安静+"],
   ["不背", { mood: 1 }, "你放松了。", "心情+"]]);
PL(function (G) { return true; }, "🧑‍🍳", "食堂测评",
  "学校让大家给食堂打分提意见。",
  [["认真提", { support: 1, influence: 1 }, "你客观反馈。", "社交+ 影响力+"],
   ["夸一夸", { support: 1, mood: 1 }, "你觉得食堂不错。", "社交+ 心情+"],
   ["不参与", { mood: 1 }, "你无所谓。", "心情+"]]);
PL(function (G) { return true; }, "🎯", "运动会报名",
  "运动会开始报名，班委问大家。",
  [["报个项目", { fitness: 2, support: 2, mood: 2 }, "你想为班级争光。", "体力+ 心情+"],
   ["当后勤/啦啦队", { support: 2, mood: 1 }, "你换个方式参与。", "社交+ 心情+"],
   ["不参加", { mood: 1 }, "你想旁观。", "心情+"]]);
PL(function (G) { return true; }, "🌃", "晚自习停电",
  "晚自习突然停电，教室里一阵骚动。",
  [["安静等待", { support: 1, mood: 1 }, "你保持秩序。", "社交+ 心情+"],
   ["和同学聊天", { support: 1, mood: 2 }, "你享受了意外假期。", "社交+ 心情+"],
   ["趁机休息", { sleep: 1, mood: 1 }, "你眯了会。", "睡眠+ 心情+"]]);

/* ══════════════════════════════════════════════════════════
   模块四十四：校园见闻 · 第六批（30 个，日常里的小选择）
   ══════════════════════════════════════════════════════════ */
L("📚 学习", "🔎", "查资料",
  "写作业/做报告需要查资料。",
  [["去图书馆/上网认真查", { knowledge: 2, grade: 1 }, "你资料详实。", "学习+ 成绩+"],
   ["大概查", { knowledge: 1 }, "你够用就行。", "学习+"],
   ["问同学", { support: 1, knowledge: 1 }, "你省事。", "社交+ 学习+"]]);
L("📚 学习", "🗂️", "课堂笔记",
  "你想优化自己的笔记。",
  [["系统整理", { knowledge: 2, charm: 1 }, "你笔记清晰。", "学习+ 魅力+"],
   ["用彩色笔", { charm: 1, knowledge: 1 }, "你记得更牢。", "魅力+ 学习+"],
   ["简单记", { knowledge: 1 }, "你抓重点。", "学习+"]]);
L("🗣️ 社交", "🪑", "排队",
  "排队时你和旁边的人。",
  [["聊聊天", { support: 2, mood: 1 }, "你认识了人。", "社交+ 心情+"],
   ["让位置", { charm: 2, support: 1 }, "你很有礼貌。", "魅力+ 社交+"],
   ["玩手机", { mood: 1 }, "你打发时间。", "心情+"]]);
L("🗣️ 社交", "🤲", "帮个小忙",
  "你看到有人需要帮忙。",
  [["主动", { support: 2, charm: 1, mood: 1 }, "你帮了TA。", "社交+ 心情+"],
   ["被喊才帮", { support: 1 }, "你搭把手。", "社交+"],
   ["不帮", { mood: 1 }, "你不方便。", "心情+"]]);
L("🏃 运动", "🤸‍♀️", "热身",
  "运动前你要热身。",
  [["认真热身", { health: 2, fitness: 1 }, "你没受伤。", "健康+ 体力+"],
   ["简单动", { health: 1 }, "你大概活动。", "健康+"],
   ["不热身", { health: -1 }, "你容易拉伤。", "健康-"]]);
L("🏃 运动", "🧊", "运动后冷饮",
  "运动后你想吃凉的。",
  [["喝温水", { health: 2 }, "你科学补水。", "健康+"],
   ["吃冷饮", { mood: 1, health: -1 }, "你图痛快。", "心情+ 健康-"],
   ["歇会再吃", { health: 1, mood: 1 }, "你等呼吸平稳。", "健康+ 心情+"]]);
L("🎮 休闲", "🎧", "通勤/路上",
  "路上你想做点什么。",
  [["听音乐/播客", { mood: 1, knowledge: 1 }, "你放松又学。", "心情+ 学习+"],
   ["背单词", { knowledge: 2, charm: 1 }, "你利用碎片时间。", "学习+ 魅力+"],
   ["发呆", { mood: 1 }, "你放空。", "心情+"]]);
L("🎮 休闲", "🍵", "下午茶",
  "你想喝杯茶/咖啡。",
  [["来一杯", { mood: 2, money: -12 }, "你放松了。", "心情+ 金钱-"],
   ["约朋友", { support: 1, mood: 2 }, "你们一起。", "社交+ 心情+"],
   ["喝水", { health: 1 }, "你省钱。", "健康+"]]);
L("✨ 奇遇", "🍀", "中奖",
  "你参与活动/抽奖中了个小奖。",
  [["开心", { mood: 2, money: 10 }, "你运气不错。", "心情+ 金钱+"],
   ["分享", { support: 2, mood: 2 }, "你请朋友。", "社交+ 心情+"],
   ["平常心", { mood: 1 }, "你觉得没什么。", "心情+"]]);
L("✨ 奇遇", "🌦️", "天气变脸",
  "天气突然变化。",
  [["提前准备", { health: 1, mood: 1 }, "你没淋着。", "健康+ 心情+"],
   ["和同学互助", { support: 1, charm: 1 }, "你们共伞。", "社交+ 魅力+"],
   ["看天意", { mood: 1, health: -1 }, "你被淋了。", "心情+ 健康-"]]);
L("💗 情感", "👋", "搭话",
  "你想和某人认识。",
  [["自然地", { support: 2, charm: 2 }, "你聊得不错。", "社交+ 魅力+"],
   ["找共同话题", { support: 2, knowledge: 1 }, "你做了功课。", "社交+ 学习+"],
   ["害羞", { mood: 1 }, "你没开口。", "心情+"]]);
L("💗 情感", "💬", "和解",
  "你和某人有误会。",
  [["主动解释", { support: 2, mood: 1, charm: 1 }, "误会解开。", "社交+ 魅力+"],
   ["用行动", { support: 2, charm: 1 }, "你证明自己。", "社交+ 魅力+"],
   ["等对方", { mood: 1 }, "你不着急。", "心情+"]]);
L("📚 学习", "⏱️", "专注力",
  "你想提高专注。",
  [["番茄钟", { knowledge: 2, mood: 1 }, "你效率高。", "学习+ 心情+"],
   ["减少干扰", { knowledge: 1, sleep: 1 }, "你放下手机。", "学习+ 睡眠+"],
   ["硬坐", { knowledge: 1, mood: 1 }, "你逼自己。", "学习+ 心情-"]]);
L("🗣️ 社交", "🧁", "带零食",
  "你带了零食到班级/宿舍。",
  [["分享", { support: 2, charm: 1, mood: 1 }, "你很受欢迎。", "社交+ 心情+"],
   ["自己吃", { mood: 1 }, "你独享。", "心情+"],
   ["交换", { support: 1, mood: 1 }, "你换了别的。", "社交+ 心情+"]]);
L("🏃 运动", "🏸", "羽毛球",
  "有人打羽毛球缺人。",
  [["加入", { fitness: 2, support: 1, mood: 1 }, "你玩得开心。", "体力+ 心情+"],
   ["看", { mood: 1, support: 1 }, "你加油。", "社交+ 心情+"],
   ["不去", { mood: 1 }, "你想休息。", "心情+"]]);
L("🎮 休闲", "🎮", "联机",
  "朋友约你一起联机游戏。",
  [["一起玩", { support: 2, mood: 2 }, "你们玩得很嗨。", "社交+ 心情+"],
   ["玩一局", { mood: 1, support: 1 }, "你克制。", "社交+ 心情+"],
   ["拒绝", { mood: 1, knowledge: 1 }, "你要学习。", "学习+ 心情+"]]);
L("✨ 奇遇", "🌅", "好风景",
  "你看到一片好风景。",
  [["欣赏", { mood: 2, charm: 1 }, "你心情好。", "心情+ 魅力+"],
   ["拍照", { mood: 1, charm: 1 }, "你记录。", "心情+ 魅力+"],
   ["分享", { support: 2, mood: 2 }, "你叫朋友。", "社交+ 心情+"]]);
L("💗 情感", "💞", "靠近",
  "你想和在意的人更近。",
  [["主动", { charm: 2, support: 2, mood: 2 }, "你们更近了。", "魅力+ 心情+"],
   ["找机会", { support: 1, mood: 1 }, "你等时机。", "社交+ 心情+"],
   ["随缘", { mood: 1 }, "你不勉强。", "心情+"]]);
L("📚 学习", "📝", "考前",
  "考前你在安排。",
  [["系统复习", { knowledge: 2, grade: 2 }, "你准备充分。", "学习+ 成绩+"],
   ["看错题", { knowledge: 1, grade: 1 }, "你查漏补缺。", "学习+ 成绩+"],
   ["放松", { mood: 2, sleep: 1 }, "你调整心态。", "心情+ 睡眠+"]]);
L("🗣️ 社交", "🙏", "道谢",
  "有人帮了你。",
  [["真诚道谢", { support: 2, charm: 1 }, "你懂感恩。", "社交+ 魅力+"],
   ["回请", { support: 1, mood: 1, money: -10 }, "你报答。", "社交+ 心情+ 金钱-"],
   ["记心里", { mood: 1 }, "你以后帮忙。", "心情+"]]);
L("🏃 运动", "🚶", "饭后",
  "饭后你想活动。",
  [["散步", { health: 1, mood: 1, fitness: 1 }, "你助消化。", "健康+ 心情+"],
   ["站一会", { health: 1 }, "你不立刻坐。", "健康+"],
   ["直接坐", { health: 0 }, "你想休息。", "——"]]);
L("🎮 休闲", "📓", "手账",
  "你想做手账记录生活。",
  [["认真做", { charm: 2, mood: 2, knowledge: 1 }, "你记录了美好。", "魅力+ 心情+"],
   ["贴贴纸", { mood: 1, charm: 1 }, "你放松了。", "心情+ 魅力+"],
   ["不做", { mood: 1 }, "你没时间。", "心情+"]]);
L("✨ 奇遇", "🐦", "鸟",
  "你看到一只鸟。",
  [["观察", { mood: 2 }, "你觉得有趣。", "心情+"],
   ["听鸟叫", { mood: 1 }, "你很放松。", "心情+"],
   ["不打扰", { mood: 1 }, "你走开。", "心情+"]]);
L("💗 情感", "🤍", "表白",
  "你想对在意的人表白。",
  [["勇敢", { charm: 2, support: 2, mood: 2 }, "你说出口。", "魅力+ 心情+"],
   ["写下来", { charm: 1, support: 1 }, "你更稳妥。", "魅力+ 社交+"],
   ["再等等", { mood: 1 }, "你没准备好。", "心情+"]]);
L("📚 学习", "📖", "自习室",
  "你去自习室学习。",
  [["认真", { knowledge: 2, grade: 1 }, "你效率高。", "学习+ 成绩+"],
   ["和同学", { support: 1, knowledge: 1 }, "你们互相监督。", "社交+ 学习+"],
   ["小憩", { sleep: 1 }, "你休息了。", "睡眠+"]]);
L("🗣️ 社交", "🎂", "庆祝",
  "有好事，大家想庆祝。",
  [["参加", { support: 2, mood: 2, money: -20 }, "你很开心。", "社交+ 心情+ 金钱-"],
   ["组织", { support: 2, influence: 2, charm: 1 }, "你安排。", "社交+ 影响力+"],
   ["不去", { mood: 1 }, "你有事。", "心情+"]]);
L("🏃 运动", "💪", "力量",
  "你想练力量。",
  [["练", { fitness: 2, health: 1, mood: 1 }, "你更强了。", "体力+ 心情+"],
   ["循序渐进", { fitness: 1, health: 1 }, "你不受伤。", "体力+ 健康+"],
   ["不练", { mood: 1 }, "你没兴趣。", "心情+"]]);
L("🎮 休闲", "🌙", "睡前放松",
  "睡前你想放松。",
  [["听轻音乐", { mood: 1, sleep: 2 }, "你易入睡。", "睡眠+ 心情+"],
   ["看书", { knowledge: 1, sleep: 1 }, "你看困了。", "学习+ 睡眠+"],
   ["刷手机", { mood: 1, sleep: -1 }, "你熬夜了。", "心情+ 睡眠-"]]);
L("✨ 奇遇", "🌈", "好天气",
  "今天天气好。",
  [["出门", { mood: 2, health: 1, fitness: 1 }, "你享受。", "心情+ 健康+"],
   ["拍照", { charm: 1, mood: 1 }, "你记录。", "魅力+ 心情+"],
   ["学习", { knowledge: 1, mood: 1 }, "你利用好天气。", "学习+ 心情+"]]);

/* ══════════════════════════════════════════════════════════
   模块四十五：校园生活 · 第六批（人际/自我，30 个）
   ══════════════════════════════════════════════════════════ */
PL(function (G) { return true; }, "🌞", "好状态",
  "今天你状态不错。",
  [["保持", { mood: 2, health: 1, knowledge: 1 }, "你延续好状态。", "心情+ 学习+"],
   ["多做点", { knowledge: 2, fitness: 1 }, "你趁热打铁。", "学习+ 体力+"],
   ["见好就收", { sleep: 1, mood: 1 }, "你不贪。", "睡眠+ 心情+"]]);
PL(function (G) { return true; }, "🪫", "低电量",
  "你今天有点没精神。",
  [["休息", { sleep: 2, mood: 1 }, "你恢复了。", "睡眠+ 心情+"],
   ["硬撑", { knowledge: 1, health: -1 }, "你坚持。", "学习+ 健康-"],
   ["运动", { fitness: 1, mood: 2 }, "你出汗。", "体力+ 心情+"]]);
PL(function (G) { return true; }, "🧋", "请客",
  "你想请同学喝点东西。",
  [["请", { support: 2, mood: 1, money: -20 }, "你大方。", "社交+ 金钱-"],
   ["被请", { support: 1, mood: 1 }, "你下次请。", "社交+ 心情+"],
   ["AA", { support: 1, mood: 1 }, "你们轻松。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "📷", "记录",
  "你想记录下今天。",
  [["拍照", { mood: 1, charm: 1 }, "你保存瞬间。", "心情+ 魅力+"],
   ["写日记", { mood: 1, knowledge: 1 }, "你整理。", "心情+ 学习+"],
   ["不记", { mood: 1 }, "你用心记住。", "心情+"]]);
PL(function (G) { return true; }, "🤝", "新朋友",
  "你认识了一个新朋友。",
  [["多了解", { support: 2, charm: 1, mood: 1 }, "你们熟悉。", "社交+ 心情+"],
   ["留联系方式", { support: 1, mood: 1 }, "你方便以后联系。", "社交+ 心情+"],
   ["点头之交", { mood: 1 }, "你随缘。", "心情+"]]);
PL(function (G) { return true; }, "📚", "学习搭子",
  "你想找个学习伙伴。",
  [["找一个", { knowledge: 2, support: 1 }, "你们互相监督。", "学习+ 社交+"],
   ["自己学", { knowledge: 1, mood: 1 }, "你独立。", "学习+ 心情+"],
   ["组队自习", { knowledge: 1, support: 2 }, "你们一起。", "社交+ 学习+"]]);
PL(function (G) { return true; }, "🎯", "小目标达成",
  "你完成了一个小目标。",
  [["奖励自己", { mood: 2, money: -10 }, "你很满足。", "心情+ 金钱-"],
   ["定下一个", { knowledge: 1, mood: 1 }, "你继续。", "学习+ 心情+"],
   ["开心", { mood: 2 }, "你有成就感。", "心情+"]]);
PL(function (G) { return true; }, "🌧️", "坏天气",
  "今天天气不好。",
  [["调整心态", { mood: 2, health: 1 }, "你不被影响。", "心情+ 健康+"],
   ["室内活动", { mood: 1, knowledge: 1 }, "你找事做。", "心情+ 学习+"],
   ["有点丧", { mood: -1 }, "你不喜欢。", "心情-"]]);
PL(function (G) { return true; }, "💪", "鼓励",
  "你想鼓励一个朋友。",
  [["真诚", { support: 2, charm: 1, mood: 1 }, "TA很受鼓舞。", "社交+ 魅力+"],
   ["分享经验", { support: 2, knowledge: 1 }, "你帮TA。", "社交+ 学习+"],
   ["陪TA", { support: 1, mood: 1 }, "你在身边。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "🍜", "改善伙食",
  "你想吃点好的。",
  [["吃", { health: 1, mood: 2, money: -15 }, "你满足。", "健康+ 心情+"],
   ["约朋友", { support: 1, mood: 2 }, "你们一起。", "社交+ 心情+"],
   ["忍住", { money: 10, health: 1 }, "你省钱。", "金钱+ 健康+"]]);
PL(function (G) { return true; }, "🧘", "放松",
  "你想放松身心。",
  [["深呼吸/冥想", { mood: 2, health: 1 }, "你平静。", "心情+ 健康+"],
   ["散步", { mood: 1, fitness: 1 }, "你活动。", "心情+ 体力+"],
   ["睡觉", { sleep: 2, mood: 1 }, "你休息。", "睡眠+ 心情+"]]);
PL(function (G) { return true; }, "📱", "消息",
  "你收到消息。",
  [["回复", { support: 1, mood: 1 }, "你处理。", "社交+ 心情+"],
   ["稍后", { mood: 1 }, "你先忙。", "心情+"],
   ["忽略", { support: -1, mood: 1 }, "你不想回。", "社交- 心情+"]]);
PL(function (G) { return true; }, "🪞", "自我肯定",
  "你有点不自信。",
  [["肯定自己", { mood: 2, charm: 1 }, "你认可自己。", "心情+ 魅力+"],
   ["找优点", { knowledge: 1, mood: 1 }, "你更了解自己。", "学习+ 心情+"],
   ["和朋友聊", { support: 1, mood: 1 }, "你听鼓励。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "🌿", "独处",
  "你想一个人待着。",
  [["独处", { sleep: 1, mood: 2 }, "你充电。", "睡眠+ 心情+"],
   ["看书", { knowledge: 1, mood: 1 }, "你安静。", "学习+ 心情+"],
   ["发呆", { mood: 1 }, "你放空。", "心情+"]]);
PL(function (G) { return true; }, "🏃", "锻炼",
  "你想锻炼。",
  [["去", { fitness: 2, health: 1, mood: 1 }, "你健康。", "体力+ 心情+"],
   ["轻度", { health: 1, fitness: 1 }, "你适度。", "健康+ 体力+"],
   ["不想", { mood: 1 }, "你累。", "心情+"]]);
PL(function (G) { return true; }, "🍎", "健康饮食",
  "你想注意饮食。",
  [["多吃蔬果", { health: 2, mood: 1 }, "你健康。", "健康+ 心情+"],
   ["少吃油腻", { health: 1, appear: 1 }, "你清爽。", "健康+ 颜值+"],
   ["随便", { mood: 1 }, "你不讲究。", "心情+"]]);
PL(function (G) { return true; }, "🎨", "爱好",
  "你想做喜欢的事。",
  [["做", { charm: 2, mood: 2 }, "你享受。", "魅力+ 心情+"],
   ["坚持", { knowledge: 1, charm: 1 }, "你有长进。", "学习+ 魅力+"],
   ["没时间", { mood: 1 }, "你先忙。", "心情+"]]);
PL(function (G) { return true; }, "🤲", "帮忙",
  "你看到有人需要帮忙。",
  [["帮", { support: 2, charm: 1, mood: 1 }, "你热心。", "社交+ 心情+"],
   ["出主意", { support: 1, knowledge: 1 }, "你帮想。", "社交+ 学习+"],
   ["不帮", { mood: 1 }, "你不方便。", "心情+"]]);
PL(function (G) { return true; }, "🌙", "早睡",
  "你想调整作息。",
  [["早睡", { sleep: 3, health: 1, mood: 1 }, "你精神。", "睡眠+ 健康+"],
   ["按时", { sleep: 1, health: 1 }, "你规律。", "睡眠+ 健康+"],
   ["再玩", { mood: 1, sleep: -1 }, "你没忍住。", "心情+ 睡眠-"]]);
PL(function (G) { return true; }, "📖", "阅读",
  "你想读点什么。",
  [["读", { knowledge: 2, mood: 1, charm: 1 }, "你充实。", "学习+ 心情+"],
   ["专业书", { knowledge: 1, grade: 1 }, "你提升。", "学习+ 成绩+"],
   ["闲书", { mood: 2, knowledge: 1 }, "你放松。", "心情+ 学习+"]]);
PL(function (G) { return true; }, "🎤", "表现",
  "有机会展示自己。",
  [["上台", { charm: 3, mood: 2, support: 1 }, "你出彩。", "魅力+ 心情+"],
   ["帮忙", { support: 2, fitness: 1 }, "你出力。", "社交+ 体力+"],
   ["旁观", { mood: 1 }, "你不主动。", "心情+"]]);
PL(function (G) { return true; }, "🧊", "冷静",
  "你遇到一点突发情况。",
  [["冷静处理", { knowledge: 1, support: 1, mood: 1 }, "你应对得当。", "学习+ 社交+"],
   ["求助", { support: 1, health: 1 }, "你找帮助。", "社交+ 健康+"],
   ["有点慌", { mood: -1 }, "你紧张。", "心情-"]]);
PL(function (G) { return true; }, "🌻", "心情好",
  "你莫名心情很好。",
  [["分享", { support: 2, mood: 2 }, "你传染快乐。", "社交+ 心情+"],
   ["多做事", { knowledge: 1, mood: 1 }, "你效率高。", "学习+ 心情+"],
   ["享受", { mood: 2 }, "你开心。", "心情+"]]);
PL(function (G) { return true; }, "🪑", "休息",
  "你想坐下休息。",
  [["休息", { sleep: 1, mood: 1 }, "你恢复。", "睡眠+ 心情+"],
   ["聊聊天", { support: 1, mood: 1 }, "你放松。", "社交+ 心情+"],
   ["学习", { knowledge: 1 }, "你闲不住。", "学习+"]]);
PL(function (G) { return true; }, "🍵", "热饮",
  "天冷，你想喝热的。",
  [["喝", { health: 1, mood: 2 }, "你暖和。", "健康+ 心情+"],
   ["约朋友", { support: 1, mood: 1 }, "你们一起。", "社交+ 心情+"],
   ["不喝", { mood: 1 }, "你不渴。", "心情+"]]);
PL(function (G) { return true; }, "🎯", "专注",
  "你想专注做事。",
  [["专注", { knowledge: 2, mood: 1 }, "你高效。", "学习+ 心情+"],
   ["排除干扰", { knowledge: 1, sleep: 1 }, "你专心。", "学习+ 睡眠+"],
   ["随缘", { mood: 1 }, "你不勉强。", "心情+"]]);
PL(function (G) { return true; }, "🤝", "互助",
  "你和同学可以互相帮助。",
  [["互助", { support: 2, knowledge: 1 }, "你们双赢。", "社交+ 学习+"],
   ["帮TA", { support: 2, charm: 1 }, "你热心。", "社交+ 魅力+"],
   ["找TA帮", { support: 1, knowledge: 1 }, "你请教。", "社交+ 学习+"]]);
PL(function (G) { return true; }, "🌈", "期待",
  "你对未来有期待。",
  [["努力", { knowledge: 2, mood: 1 }, "你朝目标。", "学习+ 心情+"],
   ["规划", { knowledge: 1, mood: 1, charm: 1 }, "你有方向。", "学习+ 心情+"],
   ["享受当下", { mood: 2 }, "你不急。", "心情+"]]);
PL(function (G) { return true; }, "🧼", "整洁",
  "你想让自己/周围整洁。",
  [["整理", { charm: 1, knowledge: 1, mood: 1 }, "你清爽。", "魅力+ 心情+"],
   ["打扫", { support: 1, fitness: 1 }, "你出力。", "社交+ 体力+"],
   ["随便", { mood: 1 }, "你无所谓。", "心情+"]]);
PL(function (G) { return true; }, "💗", "善意",
  "你想对别人表达善意。",
  [["表达", { support: 2, charm: 1, mood: 1 }, "你温暖。", "社交+ 心情+"],
   ["行动", { support: 2, fitness: 1 }, "你做出来。", "社交+ 体力+"],
   ["记心里", { mood: 1 }, "你不张扬。", "心情+"]]);

/* ══════════════════════════════════════════════════════════
   模块四十六：校园生活 · 第七批（周末/假期/成长，20 个）
   ══════════════════════════════════════════════════════════ */
PL(function (G) { return G.wk === 6 || G.wk === 0; }, "🌅", "周末早晨",
  "周末你不用赶早，醒来时阳光很好。",
  [["睡到自然醒", { sleep: 3, health: 1, mood: 2 }, "你补足了觉。", "睡眠+ 心情+"],
   ["早起做点事", { knowledge: 2, mood: 1 }, "你珍惜时间。", "学习+ 心情+"],
   ["运动", { fitness: 2, health: 1, mood: 1 }, "你出了汗。", "体力+ 心情+"]]);
PL(function (G) { return G.wk === 6 || G.wk === 0; }, "📚", "周末安排",
  "周末有整块时间，你想怎么安排。",
  [["先写完作业", { knowledge: 2, grade: 1 }, "你先苦后甜。", "学习+ 成绩+"],
   ["出去放松", { mood: 3, support: 1, money: -25 }, "你犒劳自己。", "心情+ 金钱-"],
   ["劳逸结合", { health: 1, mood: 2, knowledge: 1 }, "你平衡。", "健康+ 心情+"]]);
PL(function (G) { return G.wk === 6 || G.wk === 0; }, "🧑‍🤝‍🧑", "约朋友",
  "周末你想约朋友。",
  [["约学习", { knowledge: 2, support: 1 }, "你们一起自习。", "学习+ 社交+"],
   ["约玩", { mood: 3, support: 2, money: -30 }, "你们很开心。", "社交+ 心情+ 金钱-"],
   ["在家", { sleep: 1, mood: 1 }, "你想独处。", "睡眠+ 心情+"]]);
PL(function (G) { return G.wk === 6 || G.wk === 0; }, "📖", "充电",
  "周末是自我提升的好时间。",
  [["学新技能", { knowledge: 2, charm: 1 }, "你有收获。", "学习+ 魅力+"],
   ["读本书", { knowledge: 1, mood: 1, charm: 1 }, "你充实。", "学习+ 心情+"],
   ["休息", { sleep: 2, health: 1 }, "你养精蓄锐。", "睡眠+ 健康+"]]);
PL(function (G) { return true; }, "🪞", "复盘",
  "你想复盘最近的自己。",
  [["认真复盘", { knowledge: 2, mood: 1 }, "你更清楚方向。", "学习+ 心情+"],
   ["调整计划", { health: 1, mood: 1 }, "你灵活。", "健康+ 心情+"],
   ["顺其自然", { mood: 1 }, "你不苛责。", "心情+"]]);
PL(function (G) { return true; }, "🌿", "给自己",
  "你想好好对待自己。",
  [["放松", { mood: 2, sleep: 1 }, "你休息。", "心情+ 睡眠+"],
   ["满足一个小愿望", { mood: 2, money: -15 }, "你开心。", "心情+ 金钱-"],
   ["奖励努力", { charm: 1, mood: 2 }, "你肯定自己。", "魅力+ 心情+"]]);
PL(function (G) { return true; }, "🤝", "维护关系",
  "你想和老朋友保持联系。",
  [["主动联系", { support: 2, mood: 1 }, "你维系感情。", "社交+ 心情+"],
   ["约见面", { support: 1, mood: 2, money: -20 }, "你们叙旧。", "社交+ 心情+"],
   ["随缘", { mood: 1 }, "你相信真朋友。", "心情+"]]);
PL(function (G) { return true; }, "💪", "克服困难",
  "你遇到一个困难。",
  [["坚持", { knowledge: 2, fitness: 1, mood: 1 }, "你跨过去。", "学习+ 心情+"],
   ["求助", { support: 2, knowledge: 1 }, "你找帮助。", "社交+ 学习+"],
   ["调整方法", { knowledge: 1, mood: 1 }, "你变通。", "学习+ 心情+"]]);
PL(function (G) { return true; }, "🎯", "决心",
  "你下定决心做一件事。",
  [["认真做", { knowledge: 2, mood: 1 }, "你行动。", "学习+ 心情+"],
   ["坚持", { health: 1, fitness: 1, mood: 1 }, "你不放弃。", "健康+ 心情+"],
   ["试试看", { mood: 1 }, "你不保证。", "心情+"]]);
PL(function (G) { return true; }, "🌙", "夜晚",
  "晚上你有点多愁善感。",
  [["记录心情", { mood: 1, charm: 1 }, "你整理。", "心情+ 魅力+"],
   ["和朋友聊", { support: 1, mood: 2 }, "你倾诉。", "社交+ 心情+"],
   ["早点睡", { sleep: 2, mood: 1 }, "你不熬夜。", "睡眠+ 心情+"]]);
PL(function (G) { return true; }, "🎨", "创造",
  "你想做点创造的事。",
  [["动手", { charm: 2, mood: 2, knowledge: 1 }, "你有作品。", "魅力+ 心情+"],
   ["记录灵感", { knowledge: 1, mood: 1 }, "你抓住。", "学习+ 心情+"],
   ["分享", { support: 2, mood: 1 }, "你给朋友看。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "🏫", "归属感",
  "你在校园里渐渐有了归属感。",
  [["珍惜", { mood: 2, support: 2 }, "你融入。", "心情+ 社交+"],
   ["为集体", { support: 2, fitness: 1, influence: 1 }, "你出力。", "社交+ 体力+"],
   ["专注自己", { knowledge: 1, mood: 1 }, "你有节奏。", "学习+ 心情+"]]);
PL(function (G) { return true; }, "🧋", "小确幸",
  "你想给自己一点小确幸。",
  [["喝杯喜欢的", { mood: 2, money: -12 }, "你治愈。", "心情+ 金钱-"],
   ["见喜欢的人", { mood: 2, support: 1 }, "你开心。", "心情+ 社交+"],
   ["独处", { sleep: 1, mood: 1 }, "你充电。", "睡眠+ 心情+"]]);
PL(function (G) { return true; }, "📝", "计划",
  "你想做个计划。",
  [["认真", { knowledge: 2, mood: 1 }, "你有条理。", "学习+ 心情+"],
   ["大概", { knowledge: 1, mood: 1 }, "你有数。", "学习+ 心情+"],
   ["不做", { mood: 1 }, "你随性。", "心情+"]]);
PL(function (G) { return true; }, "🌦️", "心情波动",
  "你心情有点起伏。",
  [["调节", { mood: 2, health: 1 }, "你平静。", "心情+ 健康+"],
   ["运动", { fitness: 1, mood: 2 }, "你出汗。", "体力+ 心情+"],
   ["接受", { mood: 1 }, "你接纳。", "心情+"]]);
PL(function (G) { return true; }, "🤲", "给予",
  "你想给予别人。",
  [["帮助", { support: 2, charm: 1, mood: 1 }, "你慷慨。", "社交+ 心情+"],
   ["分享", { support: 1, mood: 1 }, "你大方。", "社交+ 心情+"],
   ["陪伴", { support: 1, mood: 1, health: 1 }, "你在身边。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "🌱", "成长",
  "你感觉到自己在成长。",
  [["肯定", { mood: 2, charm: 1 }, "你欣慰。", "心情+ 魅力+"],
   ["继续", { knowledge: 2, mood: 1 }, "你前行。", "学习+ 心情+"],
   ["感恩", { support: 1, mood: 1 }, "你珍惜。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "🌤️", "新的一天",
  "新的一天开始。",
  [["积极", { mood: 2, knowledge: 1, charm: 1 }, "你元气。", "心情+ 学习+"],
   ["专注", { knowledge: 2, mood: 1 }, "你投入。", "学习+ 心情+"],
   ["从容", { health: 1, mood: 1 }, "你平稳。", "健康+ 心情+"]]);
PL(function (G) { return true; }, "🎓", "青春",
  "你感慨青春。",
  [["珍惜", { mood: 2, support: 1, charm: 1 }, "你享受。", "心情+ 魅力+"],
   ["记录", { mood: 1, knowledge: 1 }, "你保存。", "学习+ 心情+"],
   ["努力", { knowledge: 2, mood: 1 }, "你不留遗憾。", "学习+ 心情+"]]);
PL(function (G) { return true; }, "💗", "心之所向",
  "你想追随心之所向。",
  [["勇敢", { charm: 2, mood: 2, support: 1 }, "你追随。", "魅力+ 心情+"],
   ["努力靠近", { knowledge: 2, mood: 1 }, "你行动。", "学习+ 心情+"],
   ["顺其自然", { mood: 1 }, "你相信缘分。", "心情+"]]);

/* ══════════════════════════════════════════════════════════
   模块四十七：校园生活 · 第八批（细节日常，24 个）
   ══════════════════════════════════════════════════════════ */
PL(function (G) { return true; }, "🪑", "课间",
  "课间你想做什么。",
  [["趴一会", { sleep: 2, mood: 1 }, "你眯了。", "睡眠+ 心情+"],
   ["去走廊", { health: 1, fitness: 1, mood: 1 }, "你活动。", "健康+ 心情+"],
   ["整理笔记", { knowledge: 1, charm: 1 }, "你巩固。", "学习+ 魅力+"],
   ["聊聊天", { support: 1, mood: 1 }, "你放松。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "🍱", "午饭",
  "中午你想吃什么。",
  [["荤素搭配", { health: 2, mood: 1 }, "你营养。", "健康+ 心情+"],
   ["爱吃的", { mood: 2, money: -10 }, "你开心。", "心情+ 金钱-"],
   ["简单", { health: 1, mood: 1 }, "你填饱。", "健康+ 心情+"]]);
PL(function (G) { return true; }, "📚", "自习",
  "自习时你想做什么。",
  [["复习", { knowledge: 2, grade: 1 }, "你巩固。", "学习+ 成绩+"],
   ["预习", { knowledge: 1, mood: 1 }, "你提前。", "学习+ 心情+"],
   ["看课外", { knowledge: 1, mood: 1, charm: 1 }, "你拓展。", "学习+ 心情+"]]);
PL(function (G) { return true; }, "🏃", "运动",
  "你想运动吗。",
  [["去", { fitness: 2, health: 1, mood: 1 }, "你健康。", "体力+ 心情+"],
   ["轻度", { health: 1, fitness: 1 }, "你适度。", "健康+ 体力+"],
   ["不想", { mood: 1 }, "你累。", "心情+"]]);
PL(function (G) { return true; }, "📱", "手机",
  "你想玩手机吗。",
  [["克制", { knowledge: 1, sleep: 1, mood: 1 }, "你专心。", "学习+ 睡眠+"],
   ["玩会", { mood: 1, support: 1 }, "你放松。", "心情+ 社交+"],
   ["一直玩", { mood: 2, knowledge: -1, sleep: -1 }, "你上瘾。", "心情+ 学习-"]]);
PL(function (G) { return true; }, "🌙", "睡觉",
  "你想几点睡。",
  [["早睡", { sleep: 3, health: 1, mood: 1 }, "你精神。", "睡眠+ 健康+"],
   ["再学", { knowledge: 1, sleep: -1 }, "你拼。", "学习+ 睡眠-"],
   ["再玩", { mood: 1, sleep: -1, health: -1 }, "你没忍住。", "心情+ 睡眠-"]]);
PL(function (G) { return true; }, "🤝", "朋友",
  "你想和朋友做点什么。",
  [["学习", { knowledge: 2, support: 1 }, "你们互助。", "学习+ 社交+"],
   ["玩", { mood: 2, support: 2 }, "你们开心。", "社交+ 心情+"],
   ["聊", { support: 1, mood: 1 }, "你们谈心。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "🎨", "兴趣",
  "你想做感兴趣的事。",
  [["做", { charm: 2, mood: 2 }, "你享受。", "魅力+ 心情+"],
   ["练", { knowledge: 1, charm: 1 }, "你进步。", "学习+ 魅力+"],
   ["看", { mood: 1 }, "你欣赏。", "心情+"]]);
PL(function (G) { return true; }, "🪞", "状态",
  "你想了解自己状态。",
  [["评估", { knowledge: 1, mood: 1 }, "你清楚。", "学习+ 心情+"],
   ["调整", { health: 1, mood: 1 }, "你平衡。", "健康+ 心情+"],
   ["随缘", { mood: 1 }, "你不苛责。", "心情+"]]);
PL(function (G) { return true; }, "💪", "努力",
  "你想再努力一点。",
  [["学习", { knowledge: 2, grade: 1, mood: 1 }, "你进步。", "学习+ 成绩+"],
   ["运动", { fitness: 2, health: 1 }, "你强健。", "体力+ 健康+"],
   ["社交", { support: 2, charm: 1, influence: 1 }, "你拓展。", "社交+ 魅力+"]]);
PL(function (G) { return true; }, "🌿", "放松",
  "你想放松。",
  [["休息", { sleep: 2, mood: 1 }, "你恢复。", "睡眠+ 心情+"],
   ["散步", { health: 1, mood: 2, fitness: 1 }, "你放空。", "健康+ 心情+"],
   ["听歌", { mood: 1, charm: 1 }, "你享受。", "心情+ 魅力+"]]);
PL(function (G) { return true; }, "📷", "瞬间",
  "你想记录瞬间。",
  [["拍照", { mood: 1, charm: 1 }, "你保存。", "心情+ 魅力+"],
   ["分享", { support: 2, mood: 1 }, "你给朋友。", "社交+ 心情+"],
   ["不记", { mood: 1 }, "你用心。", "心情+"]]);
PL(function (G) { return true; }, "🧋", "饮料",
  "你想喝点什么。",
  [["奶茶", { mood: 2, money: -15 }, "你甜蜜。", "心情+ 金钱-"],
   ["温水", { health: 1, mood: 1 }, "你健康。", "健康+ 心情+"],
   ["热饮", { health: 1, mood: 2 }, "你暖和。", "健康+ 心情+"]]);
PL(function (G) { return true; }, "🌅", "早晨",
  "早上你想做什么。",
  [["早起", { sleep: 1, knowledge: 1, mood: 2 }, "你从容。", "学习+ 心情+"],
   ["读书", { knowledge: 2, charm: 1 }, "你晨读。", "学习+ 魅力+"],
   ["赖床", { sleep: 2, mood: 1 }, "你多睡。", "睡眠+ 心情+"]]);
PL(function (G) { return true; }, "🎯", "目标",
  "你想定个小目标。",
  [["学习", { knowledge: 2, mood: 1 }, "你努力。", "学习+ 心情+"],
   ["健康", { health: 1, fitness: 1, mood: 1 }, "你锻炼。", "健康+ 心情+"],
   ["社交", { support: 2, charm: 1 }, "你拓展。", "社交+ 魅力+"]]);
PL(function (G) { return true; }, "🤲", "帮忙",
  "你看到有人需要帮忙。",
  [["主动", { support: 2, charm: 1, mood: 1 }, "你热心。", "社交+ 心情+"],
   ["出力", { support: 1, fitness: 1 }, "你动手。", "社交+ 体力+"],
   ["不帮", { mood: 1 }, "你不便。", "心情+"]]);
PL(function (G) { return true; }, "🌱", "新开始",
  "你想有个新开始。",
  [["调整", { health: 1, mood: 2, knowledge: 1 }, "你振作。", "健康+ 心情+"],
   ["规划", { knowledge: 1, mood: 1, charm: 1 }, "你有方向。", "学习+ 心情+"],
   ["行动", { mood: 1, fitness: 1 }, "你开始。", "心情+ 体力+"]]);
PL(function (G) { return true; }, "🎓", "成长",
  "你感到成长。",
  [["肯定", { mood: 2, charm: 1 }, "你欣慰。", "心情+ 魅力+"],
   ["继续", { knowledge: 2, mood: 1 }, "你前行。", "学习+ 心情+"],
   ["感恩", { support: 1, mood: 1 }, "你珍惜。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "💗", "心意",
  "你想表达心意。",
  [["勇敢", { charm: 2, mood: 2, support: 1 }, "你表达。", "魅力+ 心情+"],
   ["行动", { support: 2, mood: 1, fitness: 1 }, "你做出。", "社交+ 心情+"],
   ["随缘", { mood: 1 }, "你不勉强。", "心情+"]]);
PL(function (G) { return true; }, "🌤️", "天气",
  "今天天气如何。",
  [["好天气", { mood: 2, health: 1, fitness: 1 }, "你出门。", "心情+ 健康+"],
   ["坏天气", { mood: 1, knowledge: 1 }, "你室内。", "心情+ 学习+"],
   ["多变", { mood: 1, health: 1 }, "你准备。", "心情+ 健康+"]]);
PL(function (G) { return true; }, "🧘", "平静",
  "你想平静下来。",
  [["冥想", { mood: 2, health: 1 }, "你平静。", "心情+ 健康+"],
   ["深呼吸", { mood: 1, sleep: 1 }, "你放松。", "心情+ 睡眠+"],
   ["散步", { mood: 1, fitness: 1 }, "你放空。", "心情+ 体力+"]]);
PL(function (G) { return true; }, "🍜", "晚餐",
  "晚上你想吃什么。",
  [["营养", { health: 2, mood: 1 }, "你健康。", "健康+ 心情+"],
   ["简单", { health: 1, mood: 1 }, "你填饱。", "健康+ 心情+"],
   ["好的", { mood: 2, money: -15 }, "你犒劳。", "心情+ 金钱-"]]);
PL(function (G) { return true; }, "📖", "睡前",
  "睡前你想做什么。",
  [["看书", { knowledge: 1, mood: 1, sleep: 1 }, "你看困。", "学习+ 睡眠+"],
   ["听音乐", { mood: 1, sleep: 1, charm: 1 }, "你放松。", "心情+ 睡眠+"],
   ["睡觉", { sleep: 3, health: 1 }, "你早睡。", "睡眠+ 健康+"]]);

/* ══════════════════════════════════════════════════════════
   模块四十八：收尾补充（12 个日常小选择）
   ══════════════════════════════════════════════════════════ */
PL(function (G) { return true; }, "🪑", "课间休息",
  "你想怎么休息。",
  [["趴桌", { sleep: 2 }, "你眯了。", "睡眠+"],
   ["走动", { health: 1, mood: 1 }, "你活动。", "健康+ 心情+"],
   ["聊天", { support: 1, mood: 1 }, "你放松。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "📚", "学习时间",
  "你想学习什么。",
  [["复习", { knowledge: 2, grade: 1 }, "你巩固。", "学习+ 成绩+"],
   ["预习", { knowledge: 1, mood: 1 }, "你提前。", "学习+ 心情+"],
   ["背记", { knowledge: 2, charm: 1 }, "你记住。", "学习+ 魅力+"]]);
PL(function (G) { return true; }, "🍱", "吃饭时间",
  "你想吃什么。",
  [["营养", { health: 2 }, "你健康。", "健康+"],
   ["爱吃的", { mood: 2, money: -10 }, "你开心。", "心情+ 金钱-"],
   ["简单", { health: 1, mood: 1 }, "你填饱。", "健康+ 心情+"]]);
PL(function (G) { return true; }, "🏃", "活动时间",
  "你想活动吗。",
  [["运动", { fitness: 2, health: 1, mood: 1 }, "你健康。", "体力+ 心情+"],
   ["散步", { health: 1, mood: 2 }, "你放空。", "健康+ 心情+"],
   ["休息", { sleep: 1, mood: 1 }, "你恢复。", "睡眠+ 心情+"]]);
PL(function (G) { return true; }, "📱", "手机时间",
  "你想用手机吗。",
  [["克制", { knowledge: 1, sleep: 1 }, "你专心。", "学习+ 睡眠+"],
   ["玩会", { mood: 1, support: 1 }, "你放松。", "心情+ 社交+"],
   ["刷动态", { mood: 1, charm: 1 }, "你了解。", "心情+ 魅力+"]]);
PL(function (G) { return true; }, "🌙", "入睡时间",
  "你想几点睡。",
  [["早睡", { sleep: 3, health: 1, mood: 1 }, "你精神。", "睡眠+ 健康+"],
   ["再学", { knowledge: 1, sleep: -1 }, "你拼。", "学习+ 睡眠-"],
   ["再玩", { mood: 1, sleep: -1, health: -1 }, "你没忍住。", "心情+ 睡眠-"]]);
PL(function (G) { return true; }, "🤝", "朋友互动",
  "你想和朋友做什么。",
  [["学习", { knowledge: 2, support: 1 }, "你们互助。", "学习+ 社交+"],
   ["玩", { mood: 2, support: 2 }, "你们开心。", "社交+ 心情+"],
   ["聊", { support: 1, mood: 1 }, "你们谈心。", "社交+ 心情+"]]);
PL(function (G) { return true; }, "🎨", "兴趣时间",
  "你想做兴趣的事。",
  [["做", { charm: 2, mood: 2 }, "你享受。", "魅力+ 心情+"],
   ["练", { knowledge: 1, charm: 1 }, "你进步。", "学习+ 魅力+"],
   ["看", { mood: 1 }, "你欣赏。", "心情+"]]);
PL(function (G) { return true; }, "🪞", "自我调整",
  "你想调整自己。",
  [["复盘", { knowledge: 1, mood: 1 }, "你清楚。", "学习+ 心情+"],
   ["休息", { sleep: 2, health: 1 }, "你恢复。", "睡眠+ 健康+"],
   ["运动", { fitness: 1, mood: 2 }, "你出汗。", "体力+ 心情+"]]);
PL(function (G) { return true; }, "🎯", "目标时间",
  "你想定目标。",
  [["学习", { knowledge: 2, mood: 1 }, "你努力。", "学习+ 心情+"],
   ["健康", { health: 1, fitness: 1, mood: 1 }, "你锻炼。", "健康+ 心情+"],
   ["社交", { support: 2, charm: 1 }, "你拓展。", "社交+ 魅力+"]]);
PL(function (G) { return true; }, "🌿", "放松时间",
  "你想放松。",
  [["休息", { sleep: 2, mood: 1 }, "你恢复。", "睡眠+ 心情+"],
   ["散步", { health: 1, mood: 2 }, "你放空。", "健康+ 心情+"],
   ["听歌", { mood: 1, charm: 1 }, "你享受。", "心情+ 魅力+"]]);
PL(function (G) { return true; }, "💗", "心意时间",
  "你想表达心意。",
  [["勇敢", { charm: 2, mood: 2, support: 1 }, "你表达。", "魅力+ 心情+"],
   ["行动", { support: 2, mood: 1 }, "你做出。", "社交+ 心情+"],
   ["随缘", { mood: 1 }, "你不勉强。", "心情+"]]);

/* 模块四十九：最后的补充（4 个） */
PL(function (G) { return true; }, "🌻", "今天的心情",
  "今天你想以什么心情度过。",
  [["积极", { mood: 2, knowledge: 1 }, "你元气满满。", "心情+ 学习+"],
   ["从容", { health: 1, mood: 1 }, "你不慌不忙。", "健康+ 心情+"],
   ["期待", { mood: 2, charm: 1 }, "你期待好事。", "心情+ 魅力+"]]);
PL(function (G) { return true; }, "📖", "今天的安排",
  "你想怎么安排今天。",
  [["学习为主", { knowledge: 2, grade: 1 }, "你认真。", "学习+ 成绩+"],
   ["劳逸结合", { health: 1, mood: 2, knowledge: 1 }, "你平衡。", "健康+ 心情+"],
   ["放松为主", { mood: 3, sleep: 1 }, "你休息。", "心情+ 睡眠+"]]);
PL(function (G) { return true; }, "🤝", "今天的人际",
  "你想怎么对待身边人。",
  [["友好", { support: 2, charm: 1 }, "你亲切。", "社交+ 魅力+"],
   ["帮忙", { support: 1, fitness: 1 }, "你热心。", "社交+ 体力+"],
   ["独处", { sleep: 1, mood: 1 }, "你安静。", "睡眠+ 心情+"]]);
PL(function (G) { return true; }, "🎯", "今天的目标",
  "你想完成什么。",
  [["攻克学习", { knowledge: 2, mood: 1 }, "你专注。", "学习+ 心情+"],
   ["锻炼身体", { fitness: 2, health: 1 }, "你健康。", "体力+ 健康+"],
   ["享受生活", { mood: 3, charm: 1 }, "你开心。", "心情+ 魅力+"]]);

/* ══════════════════════════════════════════════════════════
   模块九十九：启动收尾
   DOM ready 后，依次执行所有注册的初始化（每项独立容错）。
   ══════════════════════════════════════════════════════════ */
  ready(function () {
    var fns = X56.inits || [];
    for (var i = 0; i < fns.length; i++) {
      try {
        if (typeof fns[i] === "function") fns[i]();
      } catch (e) {
        X56.warn("init #" + i + " failed:", e);
      }
    }
    X56.log("5.6「心之所向」已就绪，初始化 " + fns.length + " 项。");
  });

  /* 额外兜底：延迟再次确保默认主题为西子湖（抵消旧补丁） */
  setTimeout(function () {
    try {
      if (window.X56Theme && !storageGet("xz56_migrated")) {
        X56Theme.apply("xizi");
      } else if (window.X56Theme) {
        var cur = storageGet("xz_art_theme") || "xizi";
        X56Theme.apply(cur);
      }
    } catch (e) {}
  }, 1200);
  setTimeout(function () {
    try {
      if (window.X56Theme) {
        var cur2 = storageGet("xz_art_theme") || "xizi";
        X56Theme.apply(cur2);
      }
    } catch (e) {}
  }, 2600);
})();

