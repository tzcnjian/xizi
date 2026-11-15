

/* ===== 590_assets.js ===== */
/* ===== X590 assets bootstrap (data URIs) ===== */
(function () {
  window.X590 = window.X590 || {};
  window.X590.ASSETS = {
    /* calligraphy transparent PNG */
    title: 'legacy/inline/da561cd78601da78.png',
    start: 'legacy/inline/310279f021f3a4c6.png',
    maker: 'legacy/inline/738557851267f9a2.png',
    ver: 'legacy/inline/97c1dff78a0f851a.png',
    poem: 'legacy/inline/415ddbf9320262bb.png',
    xizi: 'legacy/inline/6418d4b92201de08.png',
    /* real photos */
    aerial_main: 'legacy/inline/bfa9d6f077c4c776.jpg',
    school_gate: 'legacy/inline/fc36f65d8910df7f.jpg',
    aerial_lake: 'legacy/inline/26d061d688677166.jpg',
    school_build: 'legacy/inline/57ec0aba67ad9376.jpg',
    campus_path: 'legacy/inline/555782e08a6218e7.jpg',
    aerial_track: 'legacy/inline/bb548e543f8ce4ab.jpg',
    field_top: 'legacy/inline/a4e6352147ae53ea.jpg',
    track_run: 'legacy/inline/0d7b119fdba924c9.jpg',
    stage: 'legacy/inline/25aa388198a93617.jpg',
    highjump: 'legacy/inline/4d3b4ec26133ac55.jpg',
    sports_meet: 'legacy/inline/a416022857ba03f9.jpg',
    landmark: 'legacy/inline/63ae5983500008ff.jpg'
  };
})();

/* ===== 590_core.js ===== */
/* ===== X590 core: calm calligraphy + aerial + hard fixes ===== */
(function () {
  if (window.__X590_CORE__) return; window.__X590_CORE__ = true;
  var X = (window.X590 = window.X590 || {});
  var T = (window.X581 && X581.timer) ? X581.timer : {
    setInterval: function (f, t) { return setInterval(f, t); },
    setTimeout: function (f, t) { return setTimeout(f, t); },
    clearTimeout: function (id) { clearTimeout(id); },
    clearInterval: function (id) { clearInterval(id); }
  };
  X.T = T;
  function $ (s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- dark theme detection ---------- */
  function lum(c) {
    if (!c) return 30; c = c.trim();
    var r, g, b;
    if (c[0] === '#') {
      var h = c.slice(1);
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
    } else {
      var m = c.match(/(\d+(?:\.\d+)?)/g);
      if (!m) return 30; r = +m[0]; g = +m[1]; b = +m[2];
    }
    if (isNaN(r)) return 30;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function detectTheme() {
    var cs = getComputedStyle(document.body);
    var bg = cs.getPropertyValue('--bg-b') || cs.getPropertyValue('--bg-a') || cs.getPropertyValue('--bg') || '';
    var dark = lum(bg) < 120;
    document.body.classList.toggle('x590-dark', dark);
    document.body.classList.toggle('x590-light', !dark);
    document.documentElement.classList.toggle('x590-dark', dark);
    return dark;
  }
  X.detectTheme = detectTheme;

  /* ---------- neutralize old 583 calligraphy ---------- */
  function stripOld() {
    /* remove old calli wraps */
    $all('.x583-call').forEach(function (el) {
      /* the start button wrap is inside the button; remove it too */
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    var oldPoem = document.getElementById('x583Poem');
    if (oldPoem && oldPoem.parentNode) oldPoem.parentNode.removeChild(oldPoem);
    /* restore original title */
    var t1 = $('.hero-t1');
    if (t1) {
      t1.classList.remove('x583-hide');
      t1.style.opacity = ''; t1.style.visibility = '';
    }
    /* restore version */
    var hv = document.getElementById('heroVersion');
    if (hv) {
      hv.classList.remove('x583-hide');
      hv.style.opacity = ''; hv.style.visibility = '';
    }
    /* restore carousel / slides */
    $all('.x56-title-carousel,.x56-slide,.hero-title,.xz-load-title').forEach(function (el) {
      el.style.opacity = ''; el.style.visibility = '';
    });
    /* restore start button */
    var sb = document.getElementById('heroStartBtn');
    if (sb) {
      sb.classList.remove('x583-label-hide');
      if (sb.textContent.indexOf('开始游戏') < 0 || sb.querySelector('.x583-btnlabel')) {
        sb.innerHTML = '▶ 开始游戏';
      }
    }
  }
  /* guard: strip old classes / inline whenever old timers re-add them */
  function guardOld() {
    function watch(el) {
      if (!el || el.__x590W) return;
      el.__x590W = true;
      var mo = new MutationObserver(function () {
        var changed = false;
        if (el.classList.contains('x583-hide')) { el.classList.remove('x583-hide'); changed = true; }
        if (el.classList.contains('x583-label-hide')) { el.classList.remove('x583-label-hide'); changed = true; }
        if (el.style && (el.style.opacity || el.style.visibility)) {
          /* only strip when WE did not set it; x590 uses classes, so inline is from old */
          el.style.opacity = ''; el.style.visibility = ''; changed = true;
        }
      });
      mo.observe(el, { attributes: true, attributeFilter: ['class', 'style'] });
    }
    watch($('.hero-t1')); watch(document.getElementById('heroVersion'));
    watch(document.getElementById('heroStartBtn'));
    $all('.x56-title-carousel,.x56-slide,.hero-title,.xz-load-title').forEach(watch);
  }

  /* ---------- aerial hero background ---------- */
  function buildAerial() {
    var hv = document.getElementById('heroVideo');
    if (!hv || document.getElementById('x590Aerial')) return;
    hv.classList.add('x590-aerial');
    var layer = document.createElement('div');
    layer.id = 'x590Aerial';
    layer.style.backgroundImage = 'url(' + X.ASSETS.aerial_main + ')';
    hv.insertBefore(layer, hv.firstChild);
  }

  /* ---------- new calm calligraphy (single state machine) ---------- */
  var nodes = {};
  function buildCalli() {
    /* title overlay */
    var t1 = $('.hero-t1');
    if (t1 && !t1.__x590wrapped) {
      t1.__x590wrapped = true;
      var wrap = document.createElement('span');
      wrap.className = 'x590-title-wrap';
      t1.parentNode.insertBefore(wrap, t1);
      wrap.appendChild(t1);
      var ti = document.createElement('img');
      ti.src = X.ASSETS.title; ti.className = 'x590-calli x590-hidden'; ti.id = 'heroTitleImg';
      ti.alt = '';
      wrap.appendChild(ti);
      nodes.title = { orig: t1, img: ti };
    }
    /* version overlay */
    var hv = document.getElementById('heroVersion');
    if (hv && !hv.__x590wrapped) {
      hv.__x590wrapped = true;
      var vw = document.createElement('span');
      vw.className = 'x590-title-wrap';
      hv.parentNode.insertBefore(vw, hv);
      vw.appendChild(hv);
      var vi = document.createElement('img');
      vi.src = X.ASSETS.ver; vi.className = 'x590-calli x590-hidden'; vi.id = 'heroVerImg';
      vi.alt = '';
      vw.appendChild(vi);
      nodes.ver = { orig: hv, img: vi };
    }
    /* start overlay */
    var sb = document.getElementById('heroStartBtn');
    if (sb && !sb.__x590wrapped) {
      sb.__x590wrapped = true;
      var sw = document.createElement('span');
      sw.id = 'x590StartWrap';
      sb.parentNode.insertBefore(sw, sb);
      sw.appendChild(sb);
      var si = document.createElement('img');
      si.src = X.ASSETS.start; si.className = 'x590-calli x590-hidden'; si.id = 'heroStartImg';
      si.alt = '开始游戏';
      si.style.cursor = 'pointer';
      si.addEventListener('click', function () { window.startFlow(); });
      sw.appendChild(si);
      nodes.start = { orig: sb, img: si };
    }
  }
  /* beat: 0 orig, 1 title, 2 orig, 3 start, 4 orig, 5 ver */
  var beat = 0;
  function showOnly(which) {
    ['title', 'start', 'ver'].forEach(function (k) {
      var n = nodes[k];
      if (!n) return;
      var on = (which === k);
      n.img.classList.toggle('x590-hidden', !on);
      n.orig.classList.toggle('x590-hidden', on);
    });
  }
  function tick() {
    var show = (beat % 2 === 1) ? (beat === 1 ? 'title' : beat === 3 ? 'start' : 'ver') : null;
    showOnly(show);
    beat = (beat + 1) % 6;
  }

  /* ---------- maker popup (elegant, rare) ---------- */
  var makerEl = null, lastMaker = 0;
  function buildMaker() {
    if (makerEl) return;
    makerEl = document.createElement('div');
    makerEl.id = 'x590Maker';
    var mi = document.createElement('img');
    mi.src = X.ASSETS.maker; mi.className = 'x590-calli'; mi.id = 'heroMakerImg'; mi.alt = '';
    makerEl.appendChild(mi);
    document.body.appendChild(makerEl);
    makerEl.addEventListener('click', function () { makerEl.classList.remove('show'); });
  }
  function maybeMaker() {
    var hero = document.getElementById('heroPanel');
    /* only when the hero is genuinely the active screen */
    if (!hero || !hero.classList.contains('show')) return;
    if (getComputedStyle(hero).display === 'none') return;
    /* never overlap another popup/panel */
    if (document.querySelector('.x590-pop,.x590-panel,#x590CharOverlay')) return;
    if (makerEl.classList.contains('show')) return;
    if (Date.now() - lastMaker < 45000) return;
    lastMaker = Date.now();
    makerEl.classList.add('show');
    T.setTimeout(function () { makerEl.classList.remove('show'); }, 3600);
  }

  /* ---------- poem on start ---------- */
  var poemEl = null, poemShown = false;
  function buildPoem() {
    if (poemEl) return;
    poemEl = document.createElement('div');
    poemEl.id = 'x590Poem';
    var pi = document.createElement('img');
    pi.src = X.ASSETS.poem; pi.className = 'x590-calli'; pi.alt = '';
    poemEl.appendChild(pi);
    var hint = document.createElement('div');
    hint.style.cssText = 'position:absolute;bottom:14%;color:#fff;opacity:.8;font-size:14px;letter-spacing:.3em';
    hint.textContent = '心 之 所 向 · 即 将 启 程';
    poemEl.appendChild(hint);
    document.body.appendChild(poemEl);
    function dismiss() {
      poemEl.classList.remove('show');
      return proceed();
    }
    poemEl.addEventListener('click', dismiss);
  }
  function proceed() {
    var old = X._origStartFlow;
    window.__x583PoemShown = true;
    if (typeof old === 'function') return old();
  }
  function wrapStartFlow() {
    X._origStartFlow = window.startFlow;
    window.startFlow = function () {
      if (poemShown) return proceed();
      poemShown = true;
      buildPoem();
      poemEl.classList.add('show');
      T.setTimeout(function () { if (poemEl.classList.contains('show')) { poemEl.classList.remove('show'); proceed(); } }, 3400);
    };
  }

  /* ---------- fix global event.target error robustly ---------- */
  function fixDressTab() {
    if (!window.__xzDressTab) return false;
    var old = window.__xzDressTab;
    window.__xzDressTab = function (cat, ev) {
      var e = ev || window.event;
      try {
        document.querySelectorAll('.xz-dress-tab').forEach(function (t) {
          t.classList.remove('active');
          var data = t.getAttribute('data-x590cat') || (t.textContent || '');
          if (data && String(data).indexOf(cat) >= 0) t.classList.add('active');
        });
        /* also activate by matching the onclick arg through DOM order */
        var tabs = Array.prototype.slice.call(document.querySelectorAll('.xz-dress-tab'));
        var order = ['top', 'bottom', 'shoes', 'acc'];
        var idx = order.indexOf(cat);
        if (idx >= 0 && tabs[idx]) tabs[idx].classList.add('active');
      } catch (e2) {}
      if (window.DRESS_CATS && DRESS_CATS[cat]) {
        var items = DRESS_CATS[cat].items;
        var saved = {};
        try { saved = JSON.parse(localStorage.getItem('xz_dress_set') || '{}'); } catch (er) {}
        var html = items.map(function (it) {
          var equipped = saved[cat] === it;
          return '<div class="xz-dress-item' + (equipped ? ' equipped' : '') + '" onclick="window.__xzDressEquip(\'' + cat + '\',\'' + it + '\')"><span class="d-emoji">' + DRESS_CATS[cat].emoji + '</span>' + it + '</div>';
        }).join('');
        var box = document.getElementById('xzDressItems');
        if (box) box.innerHTML = html;
      }
    };
    window.__xzDressTab.__x590 = true;
    return true;
  }

  /* ---------- fix fame toast: never auto-popup ---------- */
  function fixFame() {
    if (!window.G) return;
    var rb = document.getElementById('repBar');
    if (rb) {
      rb.setAttribute('data-x590mode', 'hidden');
      rb.style.display = 'none'; /* force every run; base 583 re-shows on threshold wobble */
    }
    var btn = document.getElementById('repBarBtn');
    if (btn) btn.style.display = 'none';
  }

  /* ---------- global error: debounce noisy overlay ---------- */
  function installErrorGuard() {
    if (window.__x590ErrGuard) return;
    window.__x590ErrGuard = true;
    var prev = window.onerror;
    var lastAt = 0;
    window.onerror = function (msg, src, line, col, err) {
      var m = String(msg || '');
      /* the known target error: suppress noisy overlay but keep console */
      if (m.indexOf("reading 'target'") >= 0 || m.indexOf('target') >= 0) {
        console.warn('[X590] suppressed known event error:', msg);
        return true;
      }
      var now = Date.now();
      if (now - lastAt < 1200) return true; /* throttle duplicate popups */
      lastAt = now;
      if (typeof prev === 'function') return prev.apply(this, arguments);
    };
  }

  /* ---------- boot ---------- */
  function boot() {
    detectTheme();
    stripOld();
    buildAerial();
    buildCalli();
    buildMaker();
    guardOld();
    wrapStartFlow();
    installErrorGuard();
    var mo = new MutationObserver(function () { detectTheme(); });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    /* [X590-OPT] 统一视觉调度：把原先散落的 6 个定时器合并为「主视觉循环」+「维护循环」，
       并在离开开始页（进入角色创建/游戏）时停掉，回到开始页时恢复，减少前台空转与卡顿。 */
    var _visT = null, _mkT = null, _maintT = null, _dressT = null;
    function x590onHero() {
      var hp = document.getElementById('heroPanel');
      return !!hp && (hp.classList.contains('show') || getComputedStyle(hp).display !== 'none');
    }
    function startVisuals() {
      if (_visT) return;
      _visT = T.setInterval(function () { try { tick(); } catch (e) {} }, 4200);
      T.setTimeout(tick, 2100);
      _mkT = T.setInterval(function () { try { maybeMaker(); } catch (e) {} }, 6000);
      T.setTimeout(maybeMaker, 5000);
    }
    function startMaint() {
      if (_maintT) return;
      _maintT = T.setInterval(function () {
        try { detectTheme(); } catch (e) {}
        try { stripOld(); } catch (e) {}
        try { buildAerial(); } catch (e) {}
        try { buildCalli(); } catch (e) {}
        try { fixFame(); } catch (e) {}
      }, 1500);
      _dressT = T.setInterval(function () { var ok = false; try { ok = fixDressTab(); } catch (e) {} return ok; }, 1200);
    }
    function stopVisuals() { if (_visT) { try { T.clearInterval(_visT); } catch (e) {} _visT = null; } if (_mkT) { try { T.clearInterval(_mkT); } catch (e) {} _mkT = null; } }
    function stopMaint() { if (_maintT) { try { T.clearInterval(_maintT); } catch (e) {} _maintT = null; } if (_dressT) { try { T.clearInterval(_dressT); } catch (e) {} _dressT = null; } }
    function pauseAll() { stopVisuals(); stopMaint(); }
    function resumeAll() { startMaint(); startVisuals(); }
    startMaint(); startVisuals();
    (function () {
      var _osc = window.showCharCreate;
      if (typeof _osc === 'function') { window.showCharCreate = function () { pauseAll(); try { _osc(); } catch (e) {} }; }
      var _bth = window.backToHero;
      if (typeof _bth === 'function') { window.backToHero = function () { try { _bth(); } catch (e) {} resumeAll(); }; }
    })();
    document.addEventListener('visibilitychange', function () { if (document.hidden) pauseAll(); else resumeAll(); });
    /* [X590-OPT] 「开始游戏」按钮保底显示：原逻辑只在片头播放到 btnAt/btnFrame 时才 display:inline-block，
       若自动播放被拦截或视频源缺失则按钮一直 display:none 而「消失」。2.2s 后无条件保底显示并清残留隐藏类。 */
    T.setTimeout(function () {
      try {
        if (!window._btnShown) {
          if (typeof showStartBtn888 === 'function') showStartBtn888();
          else { var b = document.getElementById('heroStartBtn'); if (b) b.style.display = 'inline-block'; }
        }
        var sb = document.getElementById('heroStartBtn');
        if (sb) sb.classList.remove('x583-label-hide', 'x590-hidden');
      } catch (e) {}
    }, 2200);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

/* ===== 590_ui.js ===== */
/* ===== X590 shared UI: popup / panel / toast ===== */
(function () {
  if (window.__X590_UI__) return; window.__X590_UI__ = true;
  var X = (window.X590 = window.X590 || {});
  var T = X.T || (window.X581 && X581.timer) || {
    setTimeout: function (f, t) { return setTimeout(f, t); },
    setInterval: function (f, t) { return setInterval(f, t); },
    clearTimeout: function (id) { clearTimeout(id); }
  };
  var seq = 0;
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function activePopCount() {
    return Array.prototype.slice.call(document.querySelectorAll('.x590-pop.show,.x590-panel.show')).length;
  }

  /* ---------- centered popup ---------- */
  function popup(opts) {
    opts = opts || {};
    var id = 'x590pop' + (++seq);
    var ov = el('div', 'x590-pop');
    ov.id = id;
    var card = el('div', 'x590-pop-card');
    var head = el('div', 'x590-pop-head');
    var h = el('h3', '', opts.title || '');
    var xb = el('button', 'x590-pop-x', '✕');
    head.appendChild(h); head.appendChild(xb);
    var body = el('div', 'x590-pop-body');
    if (opts.body != null) body.innerHTML = opts.body;
    var foot = el('div', 'x590-pop-foot');
    card.appendChild(head); card.appendChild(body); card.appendChild(foot);
    ov.appendChild(card);
    document.body.appendChild(ov);
    var closed = false;
    function close() {
      if (closed) return; closed = true;
      ov.classList.remove('show');
      T.setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 320);
      if (typeof opts.onClose === 'function') opts.onClose();
    }
    xb.onclick = close;
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    (opts.buttons || []).forEach(function (b) {
      var btn = el('button', 'x590-btn' + (b.cls ? ' ' + b.cls : ''), b.text);
      btn.onclick = function () {
        if (b.keepOpen) { if (b.onClick) b.onClick(close, body); }
        else { if (b.onClick) b.onClick(close, body); close(); }
      };
      foot.appendChild(btn);
    });
    if (!opts.buttons || !opts.buttons.length) foot.style.display = 'none';
    var delay = Math.min(activePopCount() * 240, 720);
    T.setTimeout(function () { ov.classList.add('show'); if (opts.onShow) opts.onShow(body, close); }, delay);
    return { id: id, el: ov, body: body, close: close };
  }

  /* ---------- full-screen panel ---------- */
  function panel(opts) {
    opts = opts || {};
    var id = 'x590panel' + (++seq);
    var p = el('div', 'x590-panel');
    p.id = id;
    var bar = el('div', 'x590-panel-bar');
    var back = el('button', 'x590-back', '‹');
    var title = el('h3', '', opts.title || '');
    var right = el('div', 'x590-panel-right');
    bar.appendChild(back); bar.appendChild(title); bar.appendChild(right);
    var body = el('div', 'x590-panel-body');
    if (opts.body != null) body.innerHTML = opts.body;
    p.appendChild(bar); p.appendChild(body);
    document.body.appendChild(p);
    var closed = false;
    function close() {
      if (closed) return; closed = true;
      p.classList.remove('show');
      T.setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 380);
      if (opts.onClose) opts.onClose();
    }
    back.onclick = function () { if (opts.onBack) opts.onBack(close); else close(); };
    var delay = Math.min(activePopCount() * 200, 600);
    T.setTimeout(function () { p.classList.add('show'); if (opts.onShow) opts.onShow(body, close); }, delay);
    return { id: id, el: p, body: body, right: right, close: close };
  }

  /* ---------- toast ---------- */
  var toastLayer = null;
  function toast(msg, ms) {
    if (!toastLayer) {
      toastLayer = el('div');
      toastLayer.style.cssText = 'position:fixed;left:50%;bottom:120px;transform:translateX(-50%);z-index:29500;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;max-width:90vw';
      document.body.appendChild(toastLayer);
    }
    var t = el('div', '', msg);
    t.style.cssText = 'background:rgba(28,32,46,.92);color:#fff;padding:10px 18px;border-radius:22px;font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,.3);animation:x590toastin .3s ease';
    toastLayer.appendChild(t);
    T.setTimeout(function () {
      t.style.transition = 'opacity .4s, transform .4s';
      t.style.opacity = '0'; t.style.transform = 'translateY(10px)';
      T.setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 420);
    }, ms || 2000);
  }
  var styleEl = el('style');
  styleEl.textContent = '@keyframes x590toastin{0%{transform:translateY(12px);opacity:0;}100%{transform:translateY(0);opacity:1;}}';
  document.head.appendChild(styleEl);

  X.UI = { popup: popup, panel: panel, toast: toast, el: el };
})();

/* ===== 590_bag.js ===== */
/* ===== X590 unified bag / inventory / money ===== */
(function () {
  if (window.__X590_BAG__) return; window.__X590_BAG__ = true;
  var X = (window.X590 = window.X590 || {});
  var T = X.T || (window.X581 && X581.timer) || { setTimeout: function (f, t) { return setTimeout(f, t); } };
  var UI = function () { return X.UI; };
  function G() { return window.G || null; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function log(m, c) { if (typeof l === 'function') l(m, c); }
  function refresh() { if (typeof upd === 'function') upd(); }
  function has(id) { return !!(window.G && G().items && G().items[id] > 0); }
  function give(id, n) { if (typeof window.give === 'function') return window.give(id, n); var g = G(); g.items[id] = (g.items[id] || 0) + (n || 1); }
  function take(id, n) {
    if (typeof window.take === 'function') return window.take(id, n);
    var g = G(); if (!g.items[id]) return; g.items[id] -= (n || 1); if (g.items[id] <= 0) delete g.items[id];
  }

  /* merge both item systems into one display list */
  function collect() {
    var g = G(); if (!g) return [];
    var map = {};
    Object.keys(g.items || {}).forEach(function (k) {
      if (g.items[k] > 0) map[k] = (map[k] || 0) + g.items[k];
    });
    /* G.backpack array (dedup by name) */
    (g.backpack || []).forEach(function (it) {
      var key = it.n || it.name;
      if (!key) return;
      map['bp_' + key] = (map['bp_' + key] || 0) + (it.count || 1);
    });
    /* the phone is a real, usable item (single phone) */
    if (g.ph || g.phoneModel) map['phone'] = 1;
    return map;
  }
  function itemMeta(key) {
    if (window.ITEMS && ITEMS[key]) return ITEMS[key];
    if (key.indexOf('bp_') === 0) {
      var nm = key.slice(3);
      var found = null;
      (G().backpack || []).forEach(function (b) { if ((b.n || b.name) === nm) found = b; });
      if (found) return { n: found.n || found.name, i: found.i || found.ic || '📦', k: found.kind || 'tool', d: found.d || found.desc || '' };
    }
    return { n: key, i: '📦', k: 'tool', d: '' };
  }

  /* ---------- money ---------- */
  function moneyBar() {
    var g = G();
    var cash = g ? Number(g.money || 0) : 0;
    return '<div class="x590-money"><span>💰</span><span class="x590-cash">¥ ' + cash.toLocaleString('zh-CN') + '</span>' +
      '<span style="font-size:12px;font-weight:600;opacity:.8">现金 · 可消费 / 打赏 / 赠与</span></div>';
  }

  /* ---------- item actions ---------- */
  function openPhone() {
    try {
      if (typeof openPhoneUI === 'function') return openPhoneUI();
      if (window.X581 && X581.openPhone) return X581.openPhone();
      if (typeof phoneSys === 'function') return phoneSys();
      var p = document.getElementById('phone');
      if (p) { p.classList.add('show'); p.style.display = ''; }
    } catch (e) { X.UI.toast('手机暂时打不开'); }
  }
  function useGeneric(key) {
    var g = G(); if (!g) return;
    var meta = itemMeta(key);
    if (key === 'phone') { return openPhone(); }
    if (meta.k === 'food' || meta.k === 'med') {
      if (typeof useItem === 'function') { useItem(key); return; }
    }
    switch (key) {
      case 'mp3': g.mood += 6; log('🎧 你戴上耳机，世界都安静了。心情+6', 'good'); break;
      case 'cards': g.mood += 5; log('🃏 你和旁边的人打起了牌。心情+5', 'good'); break;
      case 'cube': g.mood += 3; g.knowledge += 1; log('🧩 魔方在你手里咔哒咔哒转。', 'good'); break;
      case 'cam': g.mood += 4; log('📷 你举起运动相机，拍下了这一刻。', 'good'); break;
      case 'powerbank': log('🔋 你给手机充上了电，安心多了。', 'good'); break;
      case 'watch': log('⌚ 你看了看时间，心里有数。', ''); break;
      case 'umbrella': log('☔ 你摸了摸包里的伞，杭州的雨说来就来。', ''); break;
      case 'tissue': log('🧻 还好带了纸巾，关键时刻能救命。', ''); break;
      case 'mask': g.mood += 1; log('😷 你戴上口罩，低调一点。', ''); break;
      case 'heater': g.mood += 4; log('🔥 暖手宝抱在怀里，好舒服。心情+4', 'good'); break;
      case 'toy': g.mood += 5; g.sleep += 4; log('🧸 你抱着毛绒玩具，放松了下来。', 'good'); break;
      case 'pillow': g.sleep += 6; log('🛏️ 小枕头一靠，困意都温柔了。', 'good'); break;
      case 'poster': g.mood += 3; log('🖼️ 你把偶像海报贴在床头。心情+3', 'good'); break;
      case 'note': log('💌 你拿出信纸，想写点什么。', ''); break;
      case 'novel_love': case 'novel_horror': case 'novel_fan': case 'novel_wuxia':
      case 'novel_scifi': case 'novel_det': case 'novel_lit': case 'novel_comic':
        g.mood += 7; log('📖 你翻开了' + meta.n + '，看得入迷。心情+7', 'good'); break;
      case 'spare': log('📵 备用机安安静静躺在包里，查手机时能顶一下。', ''); break;
      case 'model': log('🪫 模型机，远远看还真像。', ''); break;
      default:
        if (meta.k === 'tool') { g.mood += 2; log(meta.i + ' ' + meta.n + ' — ' + (meta.d || '先收着，总会用得上。'), ''); }
        else { log('这个现在用不上。', 'warn'); }
    }
    if (typeof clampAll === 'function') clampAll();
    refresh();
  }

  /* ---------- give item (social) ---------- */
  function giveTo(key, target) {
    var g = G();
    take(key, 1);
    if (target && typeof target.aff === 'number') target.aff += (itemMeta(key).k === 'food' ? 8 : 12);
    log('🎁 你把' + itemMeta(key).n + '送给了' + (target ? target.name : '对方') + '。', 'good');
    if (typeof clampAll === 'function') clampAll();
    refresh();
  }
  X.Bag = { give: give, take: take, has: has, giveTo: giveTo, use: useGeneric, itemMeta: itemMeta };

  /* ---------- open bag panel ---------- */
  function open() {
    var g = G();
    if (!g) { X.UI.toast('还没有开始游戏'); return; }
    function render(body) {
      var items = collect();
      var keys = Object.keys(items);
      var html = moneyBar();
      if (!keys.length) {
        html += '<div style="text-align:center;padding:30px;opacity:.6">🎒 背包空空如也<br><span style="font-size:13px">去小卖部 / 食堂买点东西吧</span></div>';
      } else {
        html += '<div class="x590-bag-grid">';
        keys.forEach(function (k) {
          var meta = itemMeta(k);
          var qn = items[k];
          var isPhone = k === 'phone';
          html += '<div class="x590-item" data-key="' + esc(k) + '">' +
            '<span class="x590-item-ic">' + (isPhone ? '📱' : meta.i) + '</span>' +
            '<span class="x590-item-nm">' + esc(isPhone ? '手机' : meta.n) + '</span>' +
            (qn > 1 ? '<span class="x590-item-qn">×' + qn + '</span>' : '<span class="x590-item-qn">　</span>') +
            '</div>';
        });
        html += '</div>';
      }
      html += '<div style="margin-top:16px;font-size:12.5px;opacity:.6;line-height:1.7">点按物品即可使用 / 查看；食物、药品会即时生效，手机点击打开，小说可以阅读。</div>';
      body.innerHTML = html;
      body.querySelectorAll('.x590-item').forEach(function (it) {
        it.onclick = function () {
          var key = it.getAttribute('data-key');
          useGeneric(key);
          T.setTimeout(function () { render(body); }, 120);
        };
      });
    }
    var p = X.UI.panel({
      title: '🎒 我的背包',
      body: '<div style="opacity:.6">加载中…</div>',
      onShow: function (body) { render(body); }
    });
    return p;
  }
  X.Bag.open = open;

  /* ---------- ensure start items (开局带东西) ---------- */
  function ensureStartItems() {
    var g = G(); if (!g || g.__x590StartItems) return;
    g.__x590StartItems = true;
    if (g.mode === 'student') {
      /* phone count */
      if (!g.ph) g.ph = 1;
      ['tissue', 'bandaid', 'mask', 'pen'].forEach(function (id) {
        if (!g.items[id]) g.items[id] = 1;
      });
    }
  }
  X.Bag.ensureStartItems = ensureStartItems;
  T.setTimeout(ensureStartItems, 1200);
  T.setInterval(ensureStartItems, 4000);
})();

/* ===== 590_teacher.js ===== */
/* ===== X590 teacher hub: only teacher-appropriate systems ===== */
(function () {
  if (window.__X590_TEACHER__) return; window.__X590_TEACHER__ = true;
  var X = (window.X590 = window.X590 || {});
  var T = X.T || (window.X581 && X581.timer) || { setTimeout: function (f, t) { return setTimeout(f, t); } };
  function G() { return window.G || null; }
  function log(m, c) { if (typeof l === 'function') l(m, c); }
  function refresh() { if (typeof upd === 'function') upd(); }
  function clamp() { if (typeof clampAll === 'function') clampAll(); }
  function rnd() { return Math.random(); }
  function isBoss() { var g = G(); return !!(g && g.role === '校长' || g && g.role === '年级主任'); }

  /* ---------- patrol ---------- */
  function patrol() {
    var g = G(); if (!g) return;
    var caught = rnd() < 0.6;
    if (caught) {
      var types = ['上课玩手机', '在走廊追逐打闹', '偷偷吃零食', '打瞌睡', '抄作业'];
      var what = types[Math.floor(rnd() * types.length)];
      X.UI.popup({
        title: '🔍 走廊巡查',
        body: '你抱着记录本在走廊里转，发现有学生在<b>' + what + '</b>。',
        buttons: [
          { text: '口头批评', cls: 'good', onClick: function () { g.relation += 2; g.schoolSupport += 2; log('🔍 你口头批评了学生，对方连连点头。'); } },
          { text: '记过处分', cls: 'warn', onClick: function () {
            g.caught++; g.schoolSupport += 5; g.relation -= 3;
            if (X.punishStudent) X.punishStudent(what);
            log('📕 你给学生记了一次过。', 'warn');
          } },
          { text: '睁只眼闭只眼', onClick: function () { g.relation += 4; g.ethics -= 2; log('你假装没看见，学生松了口气。'); } }
        ]
      });
    } else {
      g.schoolSupport += 2;
      X.UI.popup({
        title: '🔍 走廊巡查',
        body: '一圈转下来，各班秩序井然，没有发现违纪。',
        buttons: [{ text: '回办公室', cls: 'good', onClick: function () { log('🔍 巡查完毕，一切正常。'); } }]
      });
    }
    clamp(); refresh();
  }

  /* ---------- teach ---------- */
  function teach() {
    var g = G(); if (!g) return;
    X.UI.popup({
      title: '📋 上课教学',
      body: '本节课的教学内容已经准备好，学生们陆续就座。',
      buttons: [
        { text: '认真讲授', cls: 'good', onClick: function () { g.teach += 3; g.academic += 1; g.relation += 2; log('📚 你认真讲完了一节课，学生反应不错。', 'good'); } },
        { text: '互动提问', onClick: function () { g.teach += 2; g.relation += 4; log('🙋 你提问了几个学生，课堂气氛活跃。'); } },
        { text: '放视频自习', onClick: function () { g.teach += 1; g.mood += 3; log('🎬 你放了一段教学视频，学生们轻松了些。'); } }
      ]
    });
    clamp(); refresh();
  }

  /* ---------- grade / prepare ---------- */
  function grade() {
    var g = G();
    X.UI.popup({
      title: '📝 备课 · 批改作业',
      body: '桌上堆着一摞作业本，还有明天的课件要准备。',
      buttons: [
        { text: '批改作业', cls: 'good', onClick: function () { g.teach += 2; g.mood -= 2; log('📝 你批改完了全班作业，红笔写满了批注。'); } },
        { text: '准备课件', onClick: function () { g.academic += 2; log('💻 你把明天的课件做得很扎实。', 'good'); } }
      ]
    });
    clamp(); refresh();
  }

  /* ---------- admin meeting ---------- */
  function adminMeeting() {
    var g = G();
    X.UI.popup({
      title: '🏛️ 行政会议',
      body: '本周行政会讨论校园管理事项，需要你提出方案或表态。',
      buttons: [
        { text: '提议加强纪律', cls: 'good', onClick: function () { g.schoolSupport += 6; g.relation -= 2; log('🏛️ 你提议加强纪律管理，获得支持。', 'good'); } },
        { text: '提议改善食堂', onClick: function () { g.relation += 6; g.schoolSupport += 2; log('🍚 你提议改善食堂，学生们会很高兴。', 'good'); } },
        { text: '保持沉默', onClick: function () { log('你在会上听着，没有发言。'); } }
      ]
    });
    clamp(); refresh();
  }

  /* ---------- phone check ---------- */
  function phoneCheck() {
    var g = G();
    var found = rnd() < 0.55;
    if (found) {
      X.UI.popup({
        title: '📱 突击查手机',
        body: '你从后门走进教室，让学生打开抽屉。有学生神色慌张。',
        buttons: [
          { text: '没收手机', cls: 'warn', onClick: function () { g.caught++; g.schoolSupport += 4; log('📱 你没收了一部手机，周五再还。', 'warn'); } },
          { text: '警告一次', onClick: function () { g.relation += 2; log('你警告了学生，对方赶紧收起手机。'); } }
        ]
      });
    } else {
      X.UI.popup({
        title: '📱 突击查手机',
        body: '检查了一圈，没有发现偷带手机的情况。',
        buttons: [{ text: '好', cls: 'good', onClick: function () { log('📱 查手机，没有发现。'); } }]
      });
    }
    clamp(); refresh();
  }

  /* ---------- discipline / demerit a student ---------- */
  function punishStudent(what) {
    var g = G();
    g.demerits = (g.demerits || 0);
    if (window.X583 && X583.addPunish) {
      X583.addPunish('学生违纪：' + (what || '违反纪律'), 'warn', '巡查中发现');
    }
  }
  X.punishStudent = punishStudent;

  /* ---------- promotion ---------- */
  function promotion() {
    var g = G();
    var can = (g.teach >= 30 && g.academic >= 20);
    X.UI.popup({
      title: '📊 职称晋升',
      body: can ? '你的教学与学术成果已经达到晋升条件。' : '目前教学 ' + Math.round(g.teach) + '、学术 ' + Math.round(g.academic) + '，还需继续积累（教学≥30、学术≥20）。',
      buttons: can ? [
        { text: '申请评职称', cls: 'good', onClick: function () {
          if (g.role === '普通老师') { g.role = '班主任'; g.salary += 1500; }
          log('🎉 你成功晋升为' + g.role + '，月薪提升！', 'good');
        } },
        { text: '再等等', onClick: function () {} }
      ] : [{ text: '我知道了', onClick: function () {} }]
    });
    clamp(); refresh();
  }

  /* ---------- home visit ---------- */
  function homeVisit() {
    var g = G();
    X.UI.popup({
      title: '🏠 家访',
      body: '你计划对一位近期表现波动的学生进行家访。',
      buttons: [
        { text: '前往家访', cls: 'good', onClick: function () { g.relation += 6; g.schoolSupport += 2; log('🏠 你完成了一次家访，家长很配合。', 'good'); } },
        { text: '改天再约', onClick: function () { log('你把家访改到了下周。'); } }
      ]
    });
    clamp(); refresh();
  }

  /* ---------- report center (handle reports) ---------- */
  function reportCenter() {
    var g = G();
    var hasReport = rnd() < 0.5;
    X.UI.popup({
      title: '📝 举报中心',
      body: hasReport ? '收到一条学生 / 家长的举报，需要核实处理。' : '目前没有待处理的举报。',
      buttons: hasReport ? [
        { text: '认真核实', cls: 'good', onClick: function () { g.schoolSupport += 5; g.ethics += 2; log('📝 你认真核实了举报，处理得当。', 'good'); } },
        { text: '转交德育处', onClick: function () { log('你把举报转交德育处处理。'); } }
      ] : [{ text: '好', onClick: function () {} }]
    });
    clamp(); refresh();
  }

  /* ---------- budget (boss only) ---------- */
  function budget() {
    var g = G();
    X.UI.popup({
      title: '💰 学校经费',
      body: '学校当前可支配预算：<b>¥ ' + Number(g.budget || 0).toLocaleString('zh-CN') + '</b>。',
      buttons: [
        { text: '投入教学设备', cls: 'good', onClick: function () { if (g.budget >= 500000) { g.budget -= 500000; g.academic += 5; g.schoolSupport += 5; log('🏫 你投入50万更新教学设备。', 'good'); } else log('预算不足。', 'warn'); } },
        { text: '改善校园环境', onClick: function () { if (g.budget >= 300000) { g.budget -= 300000; g.relation += 5; log('🌳 你投入30万改善校园环境。', 'good'); } else log('预算不足。', 'warn'); } }
      ]
    });
    clamp(); refresh();
  }

  /* ---------- discipline inspection (廉洁) ---------- */
  function discipline() {
    var g = G();
    X.UI.popup({
      title: '⚖️ 纪委 · 廉洁',
      body: '当前师风师德 ' + Math.round(g.ethics) + '，灰色收入 ¥ ' + Number(g.corrupt || 0).toLocaleString('zh-CN') + '。',
      buttons: [
        { text: '主动申报，廉洁自律', cls: 'good', onClick: function () { g.ethics += 5; log('⚖️ 你主动申报，保持廉洁，师德提升。', 'good'); } },
        { text: '收下一点好处', cls: 'warn', onClick: function () { g.corrupt += 2000; g.ethics -= 6; log('💸 你收下了好处，风险在累积。', 'warn'); } }
      ]
    });
    clamp(); refresh();
  }

  /* ---------- open hub ---------- */
  var ACTIONS = [
    { ic: '🔍', nm: '走廊巡查', fn: patrol },
    { ic: '📋', nm: '上课教学', fn: teach },
    { ic: '📝', nm: '备课批改', fn: grade },
    { ic: '🏛️', nm: '行政会议', fn: adminMeeting },
    { ic: '📱', nm: '突击查手机', fn: phoneCheck },
    { ic: '📊', nm: '职称晋升', fn: promotion },
    { ic: '🏠', nm: '家访', fn: homeVisit },
    { ic: '📝', nm: '举报中心', fn: reportCenter },
    { ic: '⚖️', nm: '纪委廉洁', fn: discipline },
    { ic: '💰', nm: '经费预算', fn: budget, boss: true }
  ];
  function open() {
    var g = G();
    if (!g || g.mode !== 'teacher') { X.UI.toast('老师工作台仅在老师模式下可用'); return; }
    var p = X.UI.panel({
      title: '👔 老师工作台',
      body: '',
      onShow: function (body) {
        var html = '<div class="x590-story-hint">📌 这里只包含老师该有的系统；学生专属功能已自动隐藏。</div>';
        html += '<div class="x590-teacher-grid">';
        ACTIONS.forEach(function (a) {
          if (a.boss && !isBoss()) return;
          html += '<div class="x590-tcard" data-act="' + esc(a.nm) + '"><span class="x590-tc-ic">' + a.ic + '</span><span class="x590-tc-nm">' + a.nm + '</span></div>';
        });
        html += '</div>';
        body.innerHTML = html;
        body.querySelectorAll('.x590-tcard').forEach(function (c) {
          c.onclick = function () {
            var nm = c.getAttribute('data-act');
            var a = ACTIONS.filter(function (x) { return x.nm === nm; })[0];
            if (a) a.fn();
          };
        });
      }
    });
    return p;
  }
  X.Teacher = { open: open, patrol: patrol, teach: teach };

  /* ---------- hide student-only systems for teachers ---------- */
  function hideStudentSystems() {
    var g = G();
    if (!g || g.mode !== 'teacher') return;
    var studentFns = ['openLove', 'xzCrushPanel', 'revSys', 'shopSys', 'clubSys', 'artSys', 'musicSys', 'xzDaily88802', 'wrongBook'];
    Array.prototype.slice.call(document.querySelectorAll('#xzRow2 .mini')).forEach(function (b) {
      var oc = b.getAttribute('onclick') || '';
      studentFns.forEach(function (f) { if (oc.indexOf(f) >= 0) b.style.display = 'none'; });
    });
  }
  T.setInterval(hideStudentSystems, 3000);
  T.setTimeout(hideStudentSystems, 1500);
})();

/* ===== 590_story.js ===== */
/* ===== X590 story mode: playable romance novel ===== */
(function () {
  if (window.__X590_STORY__) return; window.__X590_STORY__ = true;
  var X = (window.X590 = window.X590 || {});
  var T = X.T || (window.X581 && X581.timer) || { setTimeout: function (f, t) { return setTimeout(f, t); } };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------- girls ---------- */
  var GIRLS = [
    { id: 'zhixia', name: '林知夏', ic: '📚', tag: '文静 · 学霸', desc: '总在图书馆靠窗的位置，低头看书时会把头发别到耳后。', color: '#7c9cff' },
    { id: 'sunian', name: '苏念', ic: '🏃', tag: '活泼 · 运动系', desc: '操场上来去如风，笑起来眼睛弯弯，藏不住情绪。', color: '#ff9a5b' },
    { id: 'qinghuan', name: '沈清欢', ic: '🎨', tag: '文艺 · 清冷', desc: '美术社的画室里常有她的身影，话不多，但一句就说到心上。', color: '#b06bff' },
    { id: 'anran', name: '顾安然', ic: '🌿', tag: '青梅 · 竹马', desc: '和你一起长大，最懂你，也最容易被你忽略。', color: '#35c98a' }
  ];

  /* ---------- scene graph (shared, girl name injected) ---------- */
  function scenesFor(girl) {
    var n = girl.name;
    return {
      start: {
        loc: '校园 · 林荫道', img: 'campus_path',
        text: '九月的风穿过梧桐叶，开学第一天，你在这条林荫道上撞见了她。阳光落在她的发梢上，时间好像慢了半拍。',
        dialog: [{ who: 'her', t: '（她抬头看见你，愣了一下）……你也走这条路呀？' }],
        hint: '你可以：先开口打招呼，或者假装没看见走过去。',
        choices: [
          { t: '笑着打招呼："早啊，好巧。"', to: 'meet_warm', d: 2 },
          { t: '有点紧张，只说了句"嗯"', to: 'meet_shy', d: 1 },
          { t: '低头快步走过去', to: 'meet_cold', d: 0 }
        ]
      },
      meet_warm: {
        loc: '校园 · 林荫道', img: 'campus_path',
        text: '你的笑容让她也放松下来，她抿着嘴笑了，眼睛弯成月牙。',
        dialog: [{ who: 'her', t: '早～我叫' + n + '，你呢？我们……是不是可以一起走？' }],
        choices: [
          { t: '一起走，顺路聊聊天', to: 'walk1', d: 3 },
          { t: '把名字告诉她，约好下次见', to: 'part1', d: 2 }
        ]
      },
      meet_shy: {
        loc: '校园 · 林荫道', img: 'campus_path',
        text: '你听见自己心跳得很快。她却没有介意，反而轻轻笑了。',
        dialog: [{ who: 'her', t: '别紧张呀，我又不会吃了你。（她歪头看你）' }],
        choices: [
          { t: '鼓起勇气多说两句', to: 'walk1', d: 2 },
          { t: '红着脸先走了', to: 'part1', d: 1 }
        ]
      },
      meet_cold: {
        loc: '校园 · 林荫道', img: 'campus_path',
        text: '你快步走过，没有回头。身后传来很轻的一声"……哦"。',
        dialog: [{ who: 'her', t: '（她看着你的背影，有点失落）' }],
        choices: [
          { t: '走了几步，还是回头看了一眼', to: 'meet_warm', d: 1 },
          { t: '就这样分开', to: 'part1', d: 0 }
        ]
      },
      walk1: {
        loc: '校园 · 操场边', img: 'aerial_track',
        text: '你们并肩走着，从班级聊到喜欢的课，再到放学后的安排。路好像一下子变短了。',
        dialog: [{ who: 'her', t: '对了，我中午常去' + (girl.id === 'zhixia' ? '图书馆' : girl.id === 'sunian' ? '操场' : girl.id === 'qinghuan' ? '画室' : '食堂') + '。你呢？' }],
        choices: [
          { t: '"那我中午去找你。"', to: 'noon', d: 3 },
          { t: '"说不定会偶遇。"', to: 'noon', d: 2 }
        ]
      },
      part1: {
        loc: '校园 · 教学楼前', img: 'school_build',
        text: '你们在教学楼前分开，她挥了挥手。你发现自己已经开始期待下一次见面。',
        dialog: [{ who: 'her', t: '那……中午见？' }],
        choices: [
          { t: '中午主动去找她', to: 'noon', d: 2 },
          { t: '中午和朋友一起，远远看她', to: 'noon_far', d: 1 }
        ]
      },
      noon: {
        loc: '校园 · 午后', img: girl.id === 'zhixia' ? 'school_build' : girl.id === 'qinghuan' ? 'campus_path' : 'field_top',
        text: '中午，你如约找到了她。她看见你时，眼睛亮了一下，又很快低下头装作不在意。',
        dialog: [{ who: 'her', t: '你真的来啦……我还以为你只是客气。' }],
        choices: [
          { t: '递上一瓶水 / 一点小零食', to: 'gift1', d: 3 },
          { t: '在她旁边坐下，安静陪着', to: 'sit1', d: 2 },
          { t: '提议一起去走走', to: 'walk2', d: 2 }
        ]
      },
      noon_far: {
        loc: '校园 · 午后', img: 'field_top',
        text: '你和朋友在远处，看见她一个人，时不时朝你这个方向望一眼。',
        dialog: [{ who: 'her', t: '（她好像在等什么人）' }],
        choices: [
          { t: '还是走过去找她', to: 'noon', d: 2 },
          { t: '继续和朋友待着', to: 'sit1', d: 1 }
        ]
      },
      gift1: {
        loc: '校园 · 午后', img: 'field_top',
        text: '她接过东西，指尖不小心碰到你的手，两个人都顿了一下。',
        dialog: [{ who: 'her', t: '谢谢……你怎么知道我刚好有点渴。（她小声说）你人真好。' }],
        choices: [
          { t: '趁气氛好，认真看着她', to: 'look1', d: 3 },
          { t: '不好意思地挠挠头', to: 'sit1', d: 2 }
        ]
      },
      sit1: {
        loc: '校园 · 午后', img: 'field_top',
        text: '你们并排坐着，谁都没有说话，但那种安静一点也不尴尬，反而很安心。',
        dialog: [{ who: 'her', t: '……和你待在一起，好像时间都变慢了。' }],
        choices: [
          { t: '轻轻靠近一点', to: 'look1', d: 2 },
          { t: '聊起彼此的爱好', to: 'walk2', d: 2 }
        ]
      },
      walk2: {
        loc: '校园 · 湖畔', img: 'aerial_lake',
        text: '下午的阳光把湖面照得发亮，你们沿着湖边慢慢走，影子被拉得很长。',
        dialog: [{ who: 'her', t: '我以前总一个人走这条路，今天……好像没那么长了。' }],
        choices: [
          { t: '鼓起勇气，试探着牵她的手', to: 'hand1', d: 3 },
          { t: '认真地看着她的侧脸', to: 'look1', d: 2 }
        ]
      },
      look1: {
        loc: '校园 · 黄昏', img: 'aerial_main',
        text: '你认真地看着她，她察觉到你的目光，脸颊一点点红了，却没有躲开。',
        dialog: [{ who: 'her', t: '……你这样看着我，我会……（她声音越来越小）' }],
        choices: [
          { t: '轻轻握住她的手', to: 'hand1', d: 3 },
          { t: '移开目光，说句"没什么"', to: 'walk2', d: 1 }
        ]
      },
      hand1: {
        loc: '校园 · 黄昏', img: 'aerial_track',
        text: '你的手碰到她的手，她先是轻轻一颤，随后，反过来，慢慢地、一根一根地，扣住了你的手指。',
        dialog: [{ who: 'her', t: '（她低下头，声音很轻）……手，有点凉。你帮我捂一捂好不好？' }],
        choices: [
          { t: '把她的手攥紧，放进手心', to: 'confess', d: 4 },
          { t: '就这样牵着手，一直走', to: 'walk_dusk', d: 3 }
        ]
      },
      walk_dusk: {
        loc: '校园 · 黄昏跑道', img: 'track_run',
        text: '你们牵着手走在黄昏里，谁都没有松开。天色一点点暗下来，路灯亮了。',
        dialog: [{ who: 'her', t: '今天……我会记很久的。' }],
        choices: [
          { t: '停下脚步，认真表白', to: 'confess', d: 3 },
          { t: '约好明天再见', to: 'confess', d: 2 }
        ]
      },
      confess: {
        loc: '校园 · 夜色', img: 'aerial_main',
        text: '夜风吹过来，路灯把你们的影子叠在一起。你知道，有些话再不说，今晚就过去了。',
        dialog: [{ who: 'her', t: '（她抬起头，眼睛里有光，也有一点期待）……你是不是，有话想对我说？' }],
        choices: [
          { t: '"我喜欢你。不是今天，是从那天起。"', to: 'end_good', d: 3 },
          { t: '把她轻轻揽进怀里', to: 'end_good', d: 3 },
          { t: '话到嘴边，还是没说出口', to: 'end_open', d: 1 }
        ]
      },
      end_good: {
        loc: '校园 · 夜色', img: 'aerial_main',
        ending: true, good: true,
        text: '她听完，眼睛一下子湿了，却笑了。她踮起脚，轻轻抱住你。',
        dialog: [{ who: 'her', t: '……笨蛋，我等这句话，等了好久好久。我也是。' }],
        choices: [
          { t: '（故事完 · 好结局）', to: 'after', d: 0 }
        ]
      },
      end_open: {
        loc: '校园 · 夜色', img: 'aerial_main',
        ending: true, good: false,
        text: '你终究没有说出口。她眼里的光，慢慢暗了下去。夜风把那句话吹散了。',
        dialog: [{ who: 'her', t: '……没关系，我们回去吧。（她松开了手）' }],
        choices: [
          { t: '（重新选择，走向好结局）', to: 'confess', d: 0 },
          { t: '（故事完 · 开放式结局）', to: 'after', d: 0 }
        ]
      },
      after: {
        loc: '故事 · 尾声', img: 'school_gate',
        text: '—— 故事到这里告一段落。但你的选择，会在主模式里被记住。',
        choices: [{ t: '返回，回到主模式', to: null, d: 0 }]
      }
    };
  }

  /* ---------- story player ---------- */
  var state = { girl: null, scenes: null, node: 'start', warmth: 0, panel: null };

  function imgUri(key) {
    var map = {
      campus_path: 'campus_path', aerial_track: 'aerial_track', field_top: 'field_top',
      school_build: 'school_build', aerial_lake: 'aerial_lake', aerial_main: 'aerial_main',
      track_run: 'track_run', school_gate: 'school_gate'
    };
    var id = map[key] || 'aerial_main';
    return X.ASSETS[id];
  }

  function renderNode(body) {
    var sc = state.scenes[state.node];
    if (!sc) { if (state.panel) state.panel.close(); return; }
    if (sc.to === null) { if (state.panel) state.panel.close(); return; }
    var html = '';
    /* location hint */
    html += '<div class="x590-story-hint">🧭 你现在在：' + esc(sc.loc) + ' · 可前往的方向见下方选择</div>';
    /* scene */
    html += '<div class="x590-story-scene">';
    if (sc.img) {
      html += '<div class="x590-story-img" style="background-image:url(' + imgUri(sc.img) + ')"><span class="x590-story-loc">' + esc(sc.loc) + '</span></div>';
    }
    html += '<div class="x590-story-text">' + esc(sc.text) + '</div></div>';
    /* dialog */
    if (sc.dialog) {
      html += '<div class="x590-dialog">';
      sc.dialog.forEach(function (d) {
        var who = d.who === 'her' ? state.girl.name : '你';
        html += '<div class="x590-bubble ' + (d.who === 'her' ? 'her' : 'me') + '"><b style="font-size:12px;opacity:.7;display:block;margin-bottom:2px">' + esc(who) + '</b>' + esc(d.t) + '</div>';
      });
      html += '</div>';
    }
    /* hint */
    if (sc.hint) html += '<div class="x590-story-hint">💡 ' + esc(sc.hint) + '</div>';
    /* choices */
    if (sc.choices) {
      sc.choices.forEach(function (c) {
        html += '<button class="x590-choice" data-to="' + esc(c.to || '') + '" data-d="' + (c.d || 0) + '">' + esc(c.t) + '</button>';
      });
    }
    body.innerHTML = html;
    /* bind */
    body.querySelectorAll('.x590-choice').forEach(function (b) {
      b.onclick = function () {
        var to = b.getAttribute('data-to');
        var d = parseInt(b.getAttribute('data-d') || '0', 10);
        state.warmth += d;
        if (to === 'null' || to === '') { if (state.panel) state.panel.close(); return; }
        state.node = to;
        T.setTimeout(function () { renderNode(body); }, 180);
      };
    });
    body.scrollTop = 0;
  }

  function startWith(girl) {
    state.girl = girl;
    state.scenes = scenesFor(girl);
    state.node = 'start';
    state.warmth = 0;
    if (state.panel) state.panel.close();
    state.panel = X.UI.panel({
      title: '📖 剧情模式 · ' + girl.name,
      body: '',
      onShow: function (body) { renderNode(body); }
    });
  }

  function selectGirl() {
    var html = '<div class="x590-story-hint">📌 剧情模式不看属性、不比数值，只跟着你的心走。请选择<b>一位</b>女生，开始你们的故事。</div>';
    html += '<div class="x590-teacher-grid">';
    GIRLS.forEach(function (g) {
      html += '<div class="x590-tcard" data-girl="' + esc(g.id) + '"><span class="x590-tc-ic">' + g.ic + '</span><span class="x590-tc-nm">' + esc(g.name) + '</span><span style="font-size:11px;opacity:.65;display:block;margin-top:4px">' + esc(g.tag) + '</span></div>';
    });
    html += '</div>';
    var p = X.UI.popup({
      title: '📖 选择你的故事',
      body: html,
      buttons: [{ text: '返回', onClick: function () {} }]
    });
    T.setTimeout(function () {
      p.el.querySelectorAll('.x590-tcard').forEach(function (c) {
        c.onclick = function () {
          var id = c.getAttribute('data-girl');
          var girl = GIRLS.filter(function (x) { return x.id === id; })[0];
          p.close();
          T.setTimeout(function () { startWith(girl); }, 260);
        };
      });
    }, 300);
  }

  X.Story = { open: selectGirl, startWith: startWith, GIRLS: GIRLS };
})();

/* ===== 590_friends.js ===== */
/* ===== X590 WeChat moments (朋友圈) ===== */
(function () {
  if (window.__X590_FRIENDS__) return; window.__X590_FRIENDS__ = true;
  var X = (window.X590 = window.X590 || {});
  var T = X.T || (window.X581 && X581.timer) || { setTimeout: function (f, t) { return setTimeout(f, t); } };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function G() { return window.G || null; }

  var AVATARS = ['🐱', '🐰', '🐻', '🦊', '🐼', '🐨', '🦁', '🐯', '🐸', '🐧'];

  var POSTS = [
    { name: '林知夏', av: '🐰', txt: '今天的图书馆很安静，阳光刚好落在书页上，分享一段喜欢的话：「愿你成为自己的太阳。」', imgs: 0, likes: ['苏念', '顾安然', '班长小周'], cmts: [{ n: '苏念', t: '拍得好治愈呀～' }], time: '2小时前' },
    { name: '苏念', av: '🦊', txt: '运动会倒计时！！今天练了一整节接力，累瘫但快乐着🏃‍♀️💨 10月22日，赛场见！', imgs: ['sports_meet', 'track_run', 'highjump'], likes: ['体育委员', '林知夏', '同桌阿凯', '隔壁班同学'], cmts: [{ n: '体育委员', t: '加油！破纪录！' }, { n: '同桌阿凯', t: '我给你们当啦啦队' }], time: '4小时前' },
    { name: '陈老师', av: '🐻', txt: '同学们最近的作业完成得不错，继续保持。另外提醒：天气转凉，注意添衣。', imgs: 0, likes: ['班长小周', '林知夏', '食堂阿姨'], cmts: [{ n: '班长小周', t: '谢谢老师！' }], time: '6小时前' },
    { name: '沈清欢', av: '🐱', txt: '画室的下午，调色盘里是整个秋天的颜色。🎨', imgs: ['campus_path', 'stage'], likes: ['顾安然', '林知夏'], cmts: [], time: '8小时前' },
    { name: '食堂阿姨', av: '🐼', txt: '明天食堂上新：蛋包饭和意大利面！同学们记得来呀～🍚', imgs: 0, likes: ['苏念', '同桌阿凯', '隔壁班同学', '班长小周', '体育委员'], cmts: [{ n: '同桌阿凯', t: '终于等到了！' }], time: '昨天 17:20' },
    { name: '顾安然', av: '🐨', txt: '和你一起走了那么多年的路，今天的天特别蓝。（仅你可见）', imgs: ['aerial_lake'], likes: [], cmts: [], time: '昨天 08:10' }
  ];

  function imgUri(key) { return X.ASSETS[key] || X.ASSETS.aerial_main; }
  function myName() { var g = G(); return g ? g.name : '我'; }

  function renderList(body) {
    var html = '<div class="x590-pyq">';
    html += '<div class="x590-pyq-cover" style="background-image:url(' + X.ASSETS.aerial_main + ')">' +
      '<div class="x590-pyq-me"><span>' + esc(myName()) + '</span><span class="x590-pyq-ava" style="width:64px;height:64px;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:34px;border:2px solid #fff">🙂</span></div></div>';
    html += '<div class="x590-pyq-list">';
    POSTS.forEach(function (p, i) {
      var av = AVATARS.indexOf(p.av) >= 0 ? p.av : '🐱';
      html += '<div class="x590-pyq-post" data-i="' + i + '">';
      html += '<div class="x590-pyq-ava">' + av + '</div>';
      html += '<div class="x590-pyq-main">';
      html += '<div class="x590-pyq-name">' + esc(p.name) + '</div>';
      html += '<div class="x590-pyq-txt">' + esc(p.txt) + '</div>';
      if (p.imgs) {
        html += '<div class="x590-pyq-imgs">';
        p.imgs.forEach(function (im) { html += '<span style="background-image:url(' + imgUri(im) + ')"></span>'; });
        html += '</div>';
      }
      html += '<div class="x590-pyq-meta"><span>' + esc(p.time) + '</span><span class="x590-pyq-like" data-i="' + i + '">●●</span></div>';
      if (p.likes.length || p.cmts.length) {
        html += '<div class="x590-pyq-likes">';
        if (p.likes.length) html += '❤️ ' + p.likes.map(esc).join('，');
        p.cmts.forEach(function (c) {
          html += '<div style="color:#333;margin-top:4px"><b>' + esc(c.n) + '：</b>' + esc(c.t) + '</div>';
        });
        html += '</div>';
      }
      html += '</div></div>';
    });
    html += '</div></div>';
    body.innerHTML = html;
    body.querySelectorAll('.x590-pyq-like').forEach(function (b) {
      b.onclick = function () {
        var i = +b.getAttribute('data-i');
        var me = myName();
        var idx = POSTS[i].likes.indexOf(me);
        if (idx >= 0) { POSTS[i].likes.splice(idx, 1); X.UI.toast('已取消点赞'); }
        else { POSTS[i].likes.push(me); X.UI.toast('已点赞 ❤️'); }
        renderList(body);
      };
    });
  }

  function open() {
    X.UI.panel({
      title: '朋友圈',
      body: '',
      onShow: function (body) { renderList(body); }
    });
  }

  X.Friends = { open: open };
})();

/* ===== 590_popups.js ===== */
/* ===== X590 proactive popups (100+), buffered, non-blocking ===== */
(function () {
  if (window.__X590_POPUPS__) return; window.__X590_POPUPS__ = true;
  var X = (window.X590 = window.X590 || {});
  var T = X.T || (window.X581 && X581.timer) || {
    setTimeout: function (f, t) { return setTimeout(f, t); },
    setInterval: function (f, t) { return setInterval(f, t); }
  };
  function G() { return window.G || null; }
  function log(m, c) { if (typeof l === 'function') l(m, c); }
  function clamp() { if (typeof clampAll === 'function') clampAll(); }
  function refresh() { if (typeof upd === 'function') upd(); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* effects helper */
  function eff(map) {
    var g = G(); if (!g) return;
    Object.keys(map).forEach(function (k) {
      if (k === 'money') g.money = Math.max(0, (g.money || 0) + map[k]);
      else if (typeof g[k] === 'number') g[k] += map[k];
    });
    clamp(); refresh();
  }
  /* present a popup with choices; each choice = {t, say, eff, cls} */
  function E(title, body, choices) {
    X.UI.popup({
      title: title,
      body: body,
      buttons: (choices || [{ t: '好', cls: 'good', say: '' }]).map(function (c) {
        return {
          text: c.t, cls: c.cls || '',
          onClick: function () {
            if (c.eff) eff(c.eff);
            if (c.say) log(c.say, c.cls === 'warn' ? 'warn' : 'good');
            if (c.fn) c.fn();
          }
        };
      }).concat([{ text: '忽略', cls: '', say: '' }])
    });
  }

  /* ============ event pools (context tagged) ============ */
  var POOL = [
    /* ---- 课间 / 日常 (break) ---- */
    { t: '课间', c: 'break', title: '🚰 饮水机前排起队', body: '下课铃一响，饮水机前就围满了人。', ch: [{ t: '去排队接水', eff: { health: 2 }, say: '🚰 你喝了杯热水，舒服了些。' }, { t: '去小卖部买水', cls: 'warn', eff: { money: -3, mood: 3 }, say: '🥤 你买了瓶水。' }] },
    { t: '课间', c: 'break', title: '🚻 走廊人挤人', body: '下课的走廊全是去厕所、接水、聊天的人。', ch: [{ t: '在走廊转转', eff: { mood: 2 }, say: '你伸了个懒腰，活动了一下。' }, { t: '趴在桌上休息', eff: { sleep: 4 }, say: '你趴着眯了一会儿。' }] },
    { t: '课间', c: 'break', title: '📝 同桌递来纸条', body: '同桌偷偷把一张纸条塞给你。', ch: [{ t: '打开看', eff: { mood: 4 }, say: '纸条上画了个鬼脸，你笑了。' }, { t: '认真听课', eff: { knowledge: 2 }, say: '你把纸条收好，继续听课。' }] },
    { t: '课间', c: 'break', title: '🪟 窗外有只鸟', body: '一只鸟撞到了玻璃上，全班都看过去。', ch: [{ t: '去看看', eff: { mood: 5 }, say: '鸟拍拍翅膀飞走了，虚惊一场。' }, { t: '继续学习', eff: { knowledge: 1 } }] },
    { t: '课间', c: 'break', title: '🏀 男生们在讨论球赛', body: '后排男生兴奋地聊起昨晚的比赛。', ch: [{ t: '加入讨论', eff: { mood: 5, support: 3 }, say: '你聊得很嗨。' }, { t: '不感兴趣', eff: { knowledge: 1 } }] },
    { t: '课间', c: 'break', title: '💄 女生们在补口红', body: '几个女生凑在一起，分享新买的口红。', ch: [{ t: '凑过去看', eff: { mood: 3, charm: 1 }, say: '你学到了点小知识。' }, { t: '继续做自己的事', eff: { knowledge: 1 } }] },
    { t: '课间', c: 'break', title: '🧹 值日生在擦黑板', body: '今天轮到你擦黑板，粉笔灰飞扬。', ch: [{ t: '认真擦干净', eff: { support: 2, influence: 1 }, say: '黑板擦得干干净净。' }, { t: '随便应付', eff: { mood: 1 }, say: '你随便擦了两下。' }] },
    { t: '课间', c: 'break', title: '📚 课代表来收作业', body: '课代表走到你桌前，让你交作业。', ch: [{ t: '交出完成的作业', eff: { knowledge: 2, support: 2 }, say: '作业完成了，你很安心。' }, { t: '说忘带了', cls: 'warn', eff: { mood: -2 }, say: '你编了个借口，有点心虚。' }] },
    { t: '课间', c: 'break', title: '🍬 同学分糖', body: '前排同学过生日，在教室里发糖。', ch: [{ t: '说声谢谢收下', eff: { mood: 6, support: 2 }, say: '🍬 你收到了糖，祝对方生日快乐。' }, { t: '笑着婉拒', eff: { health: 1 }, say: '你婉拒了。' }] },
    { t: '课间', c: 'break', title: '🎧 同桌在哼歌', body: '同桌戴着耳机小声哼歌，跑调了。', ch: [{ t: '笑着吐槽', eff: { mood: 4 }, say: '你们笑作一团。' }, { t: '不打扰', eff: { knowledge: 1 } }] },
    { t: '课间', c: 'break', title: '🌡️ 教室有点闷', body: '门窗紧闭，教室里有点闷。', ch: [{ t: '去开窗', eff: { health: 3, mood: 2 }, say: '你打开窗户，新鲜空气进来了。' }, { t: '忍着', eff: { sleep: 3 } }] },
    { t: '课间', c: 'break', title: '🧮 有人来问问题', body: '一个同学拿着练习册来问你。', ch: [{ t: '耐心讲给他听', eff: { knowledge: 3, support: 4 }, say: '你讲了一遍，他听懂了。' }, { t: '说自己也不会', eff: { mood: 0 } }] },

    /* ---- 课堂 (class) ---- */
    { t: '课堂', c: 'class', title: '🙋 老师点名提问', body: '老师突然点名，正好叫到了你。', ch: [{ t: '站起来回答', eff: { knowledge: 3, support: 2 }, say: '你答对了，老师点头。' }, { t: '小声说不会', cls: 'warn', eff: { mood: -2 }, say: '你站着听完了别人的答案。' }] },
    { t: '课堂', c: 'class', title: '😴 困意袭来', body: '午后的课最容易犯困，眼皮在打架。', ch: [{ t: '喝口水撑住', eff: { sleep: -6, knowledge: 2 }, say: '你强打精神，继续听课。' }, { t: '偷偷眯一下', cls: 'warn', eff: { sleep: 10, knowledge: -3 }, say: '你被老师敲了桌子。' }, { t: '用眼药水', eff: { sleep: -10 }, say: '💧 眼药水让你清醒了。' }] },
    { t: '课堂', c: 'class', title: '📱 手机在抽屉里震动', body: '手机震动了一下，你很想拿出来看看。', ch: [{ t: '忍住不看', eff: { knowledge: 3, support: 1 }, say: '你专注听课。' }, { t: '偷偷看一眼', cls: 'warn', eff: { mood: 5 }, say: '是一条消息，你快速回了。' }] },
    { t: '课堂', c: 'class', title: '📝 随堂小测', body: '老师突然发了一张随堂练习。', ch: [{ t: '认真做', eff: { knowledge: 4, grade: 2 }, say: '你都会做，很有把握。' }, { t: '抄同桌的', cls: 'warn', eff: { knowledge: 0 }, say: '你抄了同桌的。' }] },
    { t: '课堂', c: 'class', title: '🖋️ 笔没水了', body: '写着写着，笔突然不出水了。', ch: [{ t: '向同桌借', eff: { support: 1 }, say: '同桌借给你一支笔。' }, { t: '用备用笔', eff: { mood: 1 }, say: '还好带了备用的。' }] },
    { t: '课堂', c: 'class', title: '💡 你想到了一个好点子', body: '老师讲的内容让你灵光一闪。', ch: [{ t: '记在本子上', eff: { knowledge: 4 }, say: '你赶紧记下来，这是个好思路。' }, { t: '下课再想', eff: { knowledge: 1 } }] },
    { t: '课堂', c: 'class', title: '🗣️ 小组讨论', body: '老师让大家四人一组讨论。', ch: [{ t: '积极发言', eff: { knowledge: 3, support: 3, charm: 1 }, say: '你带动了小组讨论。' }, { t: '听别人说', eff: { knowledge: 1 } }] },
    { t: '课堂', c: 'class', title: '🎬 老师放了个视频', body: '老师为了讲解，放了一段纪录片。', ch: [{ t: '认真看', eff: { knowledge: 3, mood: 2 }, say: '视频挺有意思。' }, { t: '趁机摸鱼', eff: { mood: 3, knowledge: -1 } }] },
    { t: '课堂', c: 'class', title: '🌡️ 投影仪坏了', body: '投影仪突然黑屏，老师手忙脚乱地修。', ch: [{ t: '举手帮忙', eff: { support: 3, knowledge: 1 }, say: '你帮忙弄好了。' }, { t: '趁机休息', eff: { sleep: 5 } }] },
    { t: '课堂', c: 'class', title: '📖 被点名朗读', body: '老师让你朗读一段课文。', ch: [{ t: '大声流利地读', eff: { charm: 2, support: 2 }, say: '你读得很有感情。' }, { t: '磕磕绊绊地读', cls: 'warn', eff: { mood: -2 } }] },

    /* ---- 食堂 / 午饭 ---- */
    { t: '午饭', c: 'lunch', title: '🍚 食堂窗口排队', body: '午饭时间到了，今天有你爱吃的菜。', ch: [{ t: '吃招牌菜', cls: 'warn', eff: { money: -10, health: 5, mood: 6 }, say: '你吃得心满意足。' }, { t: '随便吃点', eff: { money: -6, health: 3 }, say: '你简单吃了一顿。' }] },
    { t: '午饭', c: 'lunch', title: '🍜 泡面 vs 食堂', body: '今天不想吃食堂，泡面在向你招手。', ch: [{ t: '吃桶泡面', eff: { mood: 12, health: 3, money: -4 }, say: '🍜 泡面真香。' }, { t: '还是吃食堂', eff: { health: 5, money: -8 }, say: '你选了更健康的。' }] },
    { t: '午饭', c: 'lunch', title: '🍰 食堂新出甜点', body: '食堂窗口摆着新做的小蛋糕。', ch: [{ t: '买一个', cls: 'warn', eff: { money: -8, mood: 14 }, say: '🍰 蛋糕很美味。' }, { t: '忍住', eff: { health: 1 } }] },
    { t: '午饭', c: 'lunch', title: '🍱 同学请客', body: '一个同学今天心情好，说要请你喝水。', ch: [{ t: '欣然接受', eff: { mood: 5, support: 3 }, say: '你道了谢，约好下次回请。' }, { t: '坚持AA', eff: { mood: 2 }, say: '你坚持自己付。' }] },
    { t: '午饭', c: 'lunch', title: '🪑 找不到座位', body: '饭点食堂人满为患，你端着餐盘找位置。', ch: [{ t: '和同学拼桌', eff: { support: 3, mood: 3 }, say: '你和几个同学聊得很开心。' }, { t: '回教室吃', eff: { sleep: 3 } }] },
    { t: '午饭', c: 'lunch', title: '🍚 饭卡没钱了', body: '刷饭卡时提示余额不足。', ch: [{ t: '充饭卡', cls: 'warn', eff: { money: -50 }, say: '你充了50元。' }, { t: '先借同学的', eff: { support: 1 }, say: '同学先帮你垫了。' }] },

    /* ---- 小卖部 ---- */
    { t: '小卖部', c: 'shop', title: '🛒 小卖部进了新货', body: '小卖部货架上摆着烤肠和热奶茶。', ch: [{ t: '买根烤肠', cls: 'warn', eff: { money: -2, mood: 7 }, say: '🌭 烤肠滋滋冒油。' }, { t: '买杯热奶茶', cls: 'warn', eff: { money: -8, mood: 16 }, say: '🧋 奶茶暖手又暖心。' }, { t: '看看就走', eff: { money: 0 } }] },
    { t: '小卖部', c: 'shop', title: '🍫 巧克力促销', body: '巧克力第二件半价。', ch: [{ t: '买两块', cls: 'warn', eff: { money: -9, mood: 14 }, say: '🍫 你囤了两块巧克力。' }, { t: '不买', eff: {} }] },
    { t: '小卖部', c: 'shop', title: '🧸 看到毛绒玩具', body: '小卖部居然挂着一只可爱的毛绒玩具。', ch: [{ t: '买下它', cls: 'warn', eff: { money: -88, mood: 12 }, say: '🧸 你抱着它回宿舍了。' }, { t: '不买', eff: {} }] },
    { t: '小卖部', c: 'shop', title: '📓 文具补货', body: '新到的笔记本和笔，样式都挺好看。', ch: [{ t: '买本笔记本', eff: { money: -15, knowledge: 1 }, say: '📒 你买了本新本子。' }, { t: '不缺文具', eff: {} }] },
    { t: '小卖部', c: 'shop', title: '🥤 冰可乐诱惑', body: '天气热，冰柜里的可乐让人走不动。', ch: [{ t: '来一瓶', cls: 'warn', eff: { money: -3, mood: 7 }, say: '🥤 冰可乐太爽了。' }, { t: '喝热水', eff: { health: 2 } }] },

    /* ---- 体育课 / 运动 ---- */
    { t: '体育课', c: 'sport', title: '🏃 跑步测试', body: '体育课要测800米/1000米。', ch: [{ t: '全力冲刺', eff: { fitness: 6, health: 3, mood: 3 }, say: '你跑出了好成绩。' }, { t: '及格就行', eff: { fitness: 2 }, say: '你慢悠悠地跑完了。' }] },
    { t: '体育课', c: 'sport', title: '🏀 篮球三对三', body: '体育老师让大家自由组队打篮球。', ch: [{ t: '上场打球', eff: { fitness: 5, support: 4, mood: 5 }, say: '你进了一个漂亮的球。' }, { t: '在场边看', eff: { mood: 2 } }] },
    { t: '体育课', c: 'sport', title: '🤸 自由活动', body: '体育课后半段自由活动。', ch: [{ t: '和同学踢球', eff: { fitness: 4, support: 3 }, say: '你们玩得很尽兴。' }, { t: '在树荫下聊天', eff: { mood: 4, charm: 1 } }] },
    { t: '体育课', c: 'sport', title: '🤕 运动中扭伤', body: '有人在操场上崴了脚。', ch: [{ t: '扶他去医务室', eff: { support: 5, charm: 2 }, say: '你热心帮忙，同学很感激。' }, { t: '继续上课', eff: { fitness: 1 } }] },
    { t: '体育课', c: 'sport', title: '🌦️ 下雨改室内', body: '突然下雨，体育课改在室内上。', ch: [{ t: '看体育比赛录像', eff: { mood: 4, knowledge: 1 }, say: '你们看得津津有味。' }, { t: '自习', eff: { knowledge: 2 } }] },

    /* ---- 男生下课冲突（打架，体力/影响力） ---- */
    { t: '下课', c: 'fight', boys: true, title: '😤 走廊起冲突', body: '另一个班的男生故意撞了你一下，还出言不逊。', ch: [{ t: '据理力争（靠影响力）', eff: { influence: 3, support: 2 }, say: '你几句话把他说得哑口无言。' }, { t: '动手（靠体力）', cls: 'warn', eff: { fitness: 2, mood: 4, demerits: 0 }, fn: 'fight' }, { t: '忍一时风平浪静', eff: { mood: -2 }, say: '你忍住了，没搭理他。' }] },
    { t: '下课', c: 'fight', boys: true, title: '🥊 篮球场上抢场地', body: '别的班占了你们的场地，不肯让。', ch: [{ t: '比一场决定归属', eff: { fitness: 4, influence: 4 }, say: '你们赢了，场地归你们。' }, { t: '换个场地', eff: { mood: 1 } }] },
    { t: '下课', c: 'fight', boys: true, title: '👊 有人找你麻烦', body: '上次有过节的同学带人堵你。', ch: [{ t: '正面解决（体力）', cls: 'warn', fn: 'fight' }, { t: '找老师调解', eff: { support: 2 }, say: '老师介入，事情平息了。' }, { t: '绕道走', eff: { mood: -3 } }] },

    /* ---- 天气 ---- */
    { t: '天气', c: 'weather', title: '🌧️ 突然下雨', body: '放学时天降大雨，你没带伞。', ch: [{ t: '淋雨冲回宿舍', cls: 'warn', eff: { health: -6 }, say: '你被淋成了落汤鸡。' }, { t: '等雨停', eff: { sleep: 2 }, say: '你在门卫室等了一会儿。' }, { t: '用包里的伞', eff: { mood: 3 }, say: '☔ 幸好你带了伞。' }] },
    { t: '天气', c: 'weather', title: '🌫️ 早晨有雾', body: '今天大雾，能见度很低。', ch: [{ t: '慢慢走，注意安全', eff: { health: 1 }, say: '你小心地走到了学校。' }, { t: '小跑赶时间', cls: 'warn', eff: { fitness: 2 }, say: '你差点撞上树。' }] },
    { t: '天气', c: 'weather', title: '☀️ 难得的好天气', body: '今天阳光明媚，万里无云。', ch: [{ t: '课间去晒太阳', eff: { mood: 8, health: 3 }, say: '☀️ 阳光让人心情大好。' }, { t: '珍惜时间学习', eff: { knowledge: 3 } }] },
    { t: '天气', c: 'weather', title: '🌬️ 刮大风', body: '今天风很大，走在路上举步维艰。', ch: [{ t: '裹紧外套', eff: { health: 1 }, say: '你加了件外套。' }, { t: '逆风奔跑', eff: { fitness: 2, mood: 3 } }] },
    { t: '天气', c: 'weather', title: '❄️ 寒潮来袭', body: '气温骤降，大家都裹成了粽子。', ch: [{ t: '多穿点', eff: { health: 4 }, say: '你穿得很暖和。' }, { t: '硬扛着耍帅', cls: 'warn', eff: { health: -5 } }] },

    /* ---- 晚自习 / 晚上 ---- */
    { t: '晚自习', c: 'night', title: '📖 晚自习很安静', body: '教室里只有翻书和写字的声音。', ch: [{ t: '认真刷题', eff: { knowledge: 5, grade: 1 }, say: '你刷了一套卷子，很充实。' }, { t: '整理错题', eff: { knowledge: 3 }, say: '你把错题本整理了一遍。' }, { t: '偷偷走神', eff: { mood: 2 } }] },
    { t: '晚自习', c: 'night', title: '🌙 同桌打瞌睡', body: '晚自习同桌困得头一点一点的。', ch: [{ t: '叫醒他', eff: { support: 2 }, say: '你戳醒了他，他感激地看你。' }, { t: '不管，自己学', eff: { knowledge: 2 } }] },
    { t: '晚自习', c: 'night', title: '👨‍🏫 老师巡堂', body: '值班老师在走廊里走来走去。', ch: [{ t: '假装认真学习', eff: { knowledge: 2, support: 1 }, say: '你坐得笔直。' }, { t: '继续摸鱼', cls: 'warn', eff: { mood: 3 }, say: '差点被发现。' }] },
    { t: '晚自习', c: 'night', title: '🍜 闻到泡面味', body: '后排传来熟悉的泡面香。', ch: [{ t: '也泡一碗', eff: { mood: 10, money: -4 }, say: '🍜 你也加入了泡面大军。' }, { t: '忍住，学习', eff: { knowledge: 2 } }] },
    { t: '晚自习', c: 'night', title: '📓 作业写不完', body: '今晚的作业堆成了山。', ch: [{ t: '熬夜写完', eff: { knowledge: 3, sleep: -10 }, say: '你终于写完了。' }, { t: '挑重点做', eff: { knowledge: 1, sleep: 2 }, say: '你做了会做的部分。' }] },

    /* ---- 宿舍 ---- */
    { t: '宿舍', c: 'dorm', title: '🃏 室友打牌', body: '宿舍几个室友在斗地主。', ch: [{ t: '加入牌局', eff: { mood: 8, support: 3 }, say: '你玩得很开心。' }, { t: '在床上看书', eff: { knowledge: 2, mood: 3 } }] },
    { t: '宿舍', c: 'dorm', title: '🌙 卧谈会', body: '熄灯后，宿舍开始夜聊。', ch: [{ t: '一起聊天', eff: { mood: 8, support: 4 }, say: '你们聊到很晚。' }, { t: '早点睡', eff: { sleep: 8 }, say: '你早早入睡。' }] },
    { t: '宿舍', c: 'dorm', title: '🚿 排队洗澡', body: '宿舍浴室门口排起长队。', ch: [{ t: '早点去排队', eff: { health: 2 }, say: '你很快洗完了。' }, { t: '等等再洗', eff: { sleep: 3 } }] },
    { t: '宿舍', c: 'dorm', title: '🧸 抱着玩偶入睡', body: '今晚有点想家，也有点孤单。', ch: [{ t: '抱抱毛绒玩具', eff: { mood: 6, sleep: 4 }, say: '🧸 你抱着它，安心多了。' }, { t: '和室友说说话', eff: { mood: 5, support: 2 } }] },
    { t: '宿舍', c: 'dorm', title: '🔦 查寝快到了', body: '宿管阿姨马上要查寝，灯还亮着。', ch: [{ t: '赶紧熄灯', eff: { support: 1 }, say: '你及时熄灯，没被记。' }, { t: '再玩一会儿', cls: 'warn', eff: { mood: 3 }, say: '被宿管说了一顿。' }] },
    { t: '宿舍', c: 'dorm', title: '📱 睡前刷手机', body: '躺在床上，你刷着手机停不下来。', ch: [{ t: '再刷十分钟', eff: { mood: 5, sleep: -8 }, say: '你刷到很晚。' }, { t: '放下手机睡觉', eff: { sleep: 10 }, say: '你强迫自己睡了。' }] },

    /* ---- 清晨 / 起床 ---- */
    { t: '清晨', c: 'morning', title: '⏰ 起床铃响', body: '6:10，起床铃准时响起。', ch: [{ t: '立刻起床', eff: { sleep: 2, health: 2 }, say: '你精神抖擞地起床。' }, { t: '赖床五分钟', eff: { sleep: 5 }, say: '你又赖了会儿床。' }] },
    { t: '清晨', c: 'morning', title: '🪥 洗漱间排队', body: '洗漱间已经挤满了人。', ch: [{ t: '排队等', eff: { health: 1 }, say: '你排队洗漱。' }, { t: '用湿纸巾擦脸', eff: { mood: 0 } }] },
    { t: '清晨', c: 'morning', title: '🥐 来不及吃早饭', body: '快迟到了，早饭还没吃。', ch: [{ t: '路上买个面包', eff: { money: -3, health: 6 }, say: '🍞 你边跑边吃。' }, { t: '饿一上午', cls: 'warn', eff: { health: -4, mood: -2 } }] },
    { t: '清晨', c: 'morning', title: '🏃 晨跑赶时间', body: '眼看要迟到了，你得加快脚步。', ch: [{ t: '小跑赶路', eff: { fitness: 2 }, say: '你踩着点进了教室。' }, { t: '正常走', cls: 'warn', eff: { mood: -2 }, say: '你迟到了一分钟。' }] },

    /* ---- 放学 / 周末 ---- */
    { t: '放学', c: 'after', title: '🎒 放学路上', body: '放学铃声响了，同学们涌向校门。', ch: [{ t: '和同学一起走', eff: { support: 3, mood: 4 }, say: '你们一路有说有笑。' }, { t: '一个人走，听音乐', eff: { mood: 5 }, say: '🎧 你戴上耳机，很放松。' }] },
    { t: '放学', c: 'after', title: '📚 要不要留校自习', body: '放学后，教室很安静，适合学习。', ch: [{ t: '留校自习', eff: { knowledge: 5 }, say: '你效率很高。' }, { t: '早点回家', eff: { mood: 4, sleep: 3 } }] },
    { t: '周末', c: 'weekend', title: '🛍️ 周末去逛街', body: '周末约了朋友去商业街。', ch: [{ t: '买买买', cls: 'warn', eff: { money: -80, mood: 15 }, say: '🛒 你买了些喜欢的东西。' }, { t: '只逛不买', eff: { mood: 8 }, say: '你逛得很开心。' }] },
    { t: '周末', c: 'weekend', title: '📖 周末补觉', body: '难得的周末，你可以好好休息。', ch: [{ t: '睡到自然醒', eff: { sleep: 15, health: 5 }, say: '你满血复活。' }, { t: '早起学习', eff: { knowledge: 5 } }] },
    { t: '周末', c: 'weekend', title: '🎮 打游戏', body: '周末终于可以放松打游戏了。', ch: [{ t: '痛快玩一场', eff: { mood: 16, sleep: -5 }, say: '🎮 你玩得很尽兴。' }, { t: '玩一小时就学习', eff: { mood: 6, knowledge: 3 } }] },
    { t: '周末', c: 'weekend', title: '🎬 看一部电影', body: '最近有部新上映的电影。', ch: [{ t: '去看', eff: { money: -40, mood: 14 }, say: '🎬 电影很精彩。' }, { t: '在家看', eff: { mood: 8 } }] },

    /* ---- 学习提升 ---- */
    { t: '学习', c: 'study', title: '📚 错题本整理', body: '你翻开错题本，发现不少老问题。', ch: [{ t: '重新做一遍', eff: { knowledge: 4 }, say: '你把错题都搞懂了。' }, { t: '抄答案', cls: 'warn', eff: { knowledge: 0 } }] },
    { t: '学习', c: 'study', title: '🧠 背单词', body: '英语单词需要日积月累。', ch: [{ t: '背20个', eff: { knowledge: 3 }, say: '你记住了20个单词。' }, { t: '背5个', eff: { knowledge: 1 } }] },
    { t: '学习', c: 'study', title: '📐 攻克难题', body: '一道数学题卡了你很久。', ch: [{ t: '死磕到底', eff: { knowledge: 5, mood: 4 }, say: '做出来的瞬间特别有成就感。' }, { t: '问老师', eff: { knowledge: 4, support: 1 } }] },
    { t: '学习', c: 'study', title: '🗞️ 看课外书', body: '图书馆有本你感兴趣的书。', ch: [{ t: '借来读', eff: { knowledge: 3, mood: 5 }, say: '📖 你读得入迷。' }, { t: '先写作业', eff: { knowledge: 2 } }] },

    /* ---- 社交 / 好感 ---- */
    { t: '社交', c: 'social', title: '💌 收到一封匿名信', body: '抽屉里多了一封没有署名的信。', ch: [{ t: '打开看', eff: { mood: 8, charm: 1 }, say: '是一句鼓励你的话，你心里暖暖的。' }, { t: '收起来', eff: { mood: 3 } }] },
    { t: '社交', c: 'social', title: '🎂 同学过生日', body: '今天是好朋友的生日。', ch: [{ t: '送份小礼物', cls: 'warn', eff: { money: -20, support: 8, mood: 5 }, say: '🎁 对方很开心。' }, { t: '说声生日快乐', eff: { support: 3 } }] },
    { t: '社交', c: 'social', title: '🤝 同学找你帮忙', body: '有人请你帮个忙，会花点时间。', ch: [{ t: '热心帮忙', eff: { support: 6, charm: 2 }, say: '你帮了忙，收获了感激。' }, { t: '说自己有事', eff: { mood: 0 } }] },
    { t: '社交', c: 'social', title: '☕ 被请喝奶茶', body: '有人想请你喝奶茶聊聊天。', ch: [{ t: '答应', eff: { mood: 8, support: 4 }, say: '🧋 你们聊得很愉快。' }, { t: '婉拒', eff: { knowledge: 1 } }] },
    { t: '社交', c: 'social', title: '🎤 被邀请参加社团', body: '一个社团的学长来邀请你加入。', ch: [{ t: '加入看看', eff: { mood: 6, support: 3 }, say: '你加入了社团。' }, { t: '先考虑一下', eff: {} }] },
    { t: '社交', c: 'social', title: '💐 想送花给某人', body: '小卖部有一束新鲜的花。', ch: [{ t: '买下来送人', cls: 'warn', eff: { money: -35, charm: 4, mood: 5 }, say: '💐 对方收到花，脸红了。' }, { t: '不买', eff: {} }] },
    { t: '社交', c: 'social', title: '💬 同桌找你倾诉', body: '同桌最近心情不太好，想找人聊聊。', ch: [{ t: '认真倾听', eff: { support: 6, charm: 3 }, say: '你听他说完，他轻松多了。' }, { t: '简单安慰', eff: { support: 2 } }] },
    { t: '社交', c: 'social', title: '📮 失物招领', body: '你捡到一个饭卡。', ch: [{ t: '交到失物招领处', eff: { support: 5, mood: 4 }, say: '失主很快找来了。' }, { t: '占为己有', cls: 'warn', eff: { money: 10, mood: -6 }, say: '你心里有点不安。' }] },

    /* ---- 健康 ---- */
    { t: '健康', c: 'health', title: '🤧 感觉要感冒', body: '你鼻子有点堵，好像要感冒了。', ch: [{ t: '吃片感冒药', eff: { health: 5, sleep: 10 }, say: '💊 症状缓解了。' }, { t: '多喝热水', eff: { health: 3 } }] },
    { t: '健康', c: 'health', title: '😣 眼睛干涩', body: '看了太久书，眼睛很酸。', ch: [{ t: '滴眼药水', eff: { sleep: -10, health: 2 }, say: '💧 眼睛舒服多了。' }, { t: '闭眼休息', eff: { sleep: 5 } }] },
    { t: '健康', c: 'health', title: '🤕 头有点疼', body: '你感觉头昏脑涨。', ch: [{ t: '吃止痛药', eff: { health: 4, mood: 3 }, say: '💊 疼痛缓解了。' }, { t: '去医务室', eff: { health: 5 } }] },
    { t: '健康', c: 'health', title: '🍊 补充维生素', body: '最近总觉得疲惫。', ch: [{ t: '吃片维生素', eff: { health: 8 }, say: '🍊 你感觉好点了。' }, { t: '吃水果', eff: { health: 4, money: -5 } }] },
    { t: '健康', c: 'health', title: '😰 压力很大', body: '最近考试多，你有点焦虑。', ch: [{ t: '去操场跑两圈', eff: { mood: 8, fitness: 3 }, say: '出了汗，轻松多了。' }, { t: '找心理老师', eff: { mood: 10, depression: -8 }, say: '聊完你平静了不少。' }] },

    /* ---- 女生生理期 ---- */
    { t: '特殊', c: 'period', girls: true, title: '🩸 生理期不舒服', body: '今天生理期，肚子有点疼。', ch: [{ t: '喝杯红糖姜茶', eff: { mood: 10, health: 4, money: -6 }, say: '🍵 暖暖的，舒服多了。' }, { t: '用暖手宝', eff: { mood: 6 }, say: '🔥 暖手宝很管用。' }, { t: '吃止痛药', eff: { health: 4, mood: 4 } }] },

    /* ---- 随机彩蛋 ---- */
    { t: '彩蛋', c: 'random', title: '🌈 看到彩虹', body: '雨后的天边出现了一道彩虹。', ch: [{ t: '停下来欣赏', eff: { mood: 10 }, say: '彩虹很美，你拍了下来。' }, { t: '看一眼', eff: { mood: 3 } }] },
    { t: '彩蛋', c: 'random', title: '🐱 校园里的猫', body: '一只橘猫懒洋洋地趴在花坛边。', ch: [{ t: '撸猫', eff: { mood: 10, charm: 1 }, say: '🐱 橘猫任你抚摸。' }, { t: '拍照', eff: { mood: 6 } }] },
    { t: '彩蛋', c: 'random', title: '🍂 银杏叶黄了', body: '校园的银杏大道一片金黄。', ch: [{ t: '捡片落叶做书签', eff: { mood: 6, knowledge: 1 }, say: '🍂 你捡了片好看的叶子。' }, { t: '拍照留念', eff: { mood: 5 } }] },
    { t: '彩蛋', c: 'random', title: '🐦 白鹭掠过操场', body: '一只白鹭从操场边飞过。', ch: [{ t: '抬头看', eff: { mood: 7 }, say: '你看到了难得的一幕。' }, { t: '继续走', eff: { mood: 2 } }] },
    { t: '彩蛋', c: 'random', title: '⛲ 喷泉开了', body: '校园的喷泉今天开了，水花飞溅。', ch: [{ t: '在旁边坐坐', eff: { mood: 6 }, say: '听着水声很放松。' }, { t: '看一眼', eff: { mood: 2 } }] },
    { t: '彩蛋', c: 'random', title: '🎈 学校有活动', body: '广场上在办社团招新，很热闹。', ch: [{ t: '去逛逛', eff: { mood: 8, support: 3 }, say: '你了解了不少社团。' }, { t: '绕开人群', eff: { knowledge: 1 } }] },
    { t: '彩蛋', c: 'random', title: '🧑‍🎨 有人在墙上涂鸦', body: '艺术生在给墙绘上色。', ch: [{ t: '帮忙一起画', eff: { mood: 7, charm: 2 }, say: '你也留下了一笔。' }, { t: '欣赏一下', eff: { mood: 4 } }] },
    { t: '彩蛋', c: 'random', title: '💍 捡到一块钱', body: '你在地上捡到一枚硬币。', ch: [{ t: '捡起来', eff: { money: 1, mood: 2 }, say: '你捡到了一块钱。' }, { t: '交给老师', eff: { support: 1 } }] },
    { t: '彩蛋', c: 'random', title: '📻 广播站点歌', body: '广播站开通了点歌栏目。', ch: [{ t: '点首歌', eff: { mood: 5, money: -2 }, say: '🎵 你点了一首喜欢的歌。' }, { t: '听听别人点的', eff: { mood: 3 } }] },
    { t: '彩蛋', c: 'random', title: '📷 有人拍抖音', body: '操场上有人在拍短视频，你入镜了。', ch: [{ t: '大方入镜', eff: { mood: 6, influence: 2 }, say: '你笑着打了招呼。' }, { t: '赶紧躲开', eff: { mood: 1 } }] },
    { t: '彩蛋', c: 'random', title: '🏀 捡到一个篮球', body: '操场边滚来一个篮球。', ch: [{ t: '投个篮', eff: { mood: 6, fitness: 2 }, say: '空心入网，很帅。' }, { t: '还给失主', eff: { support: 3 } }] },
    { t: '彩蛋', c: 'random', title: '📦 快递柜满了', body: '你的快递到了。', ch: [{ t: '去取快递', eff: { mood: 6 }, say: '📦 你拿到了期待已久的东西。' }, { t: '晚点再取', eff: { mood: 1 } }] },
    { t: '彩蛋', c: 'random', title: '🎒 书包太重', body: '今天的书特别多，书包沉甸甸的。', ch: [{ t: '坚持背着', eff: { fitness: 1 }, say: '你锻炼了肩背。' }, { t: '把不用的书放教室', eff: { mood: 2 } }] },
    { t: '彩蛋', c: 'random', title: '💡 教室灯坏了', body: '教室一盏灯忽明忽暗。', ch: [{ t: '报告老师', eff: { support: 1 }, say: '维修师傅很快来修好了。' }, { t: '忍着', eff: { mood: -1 } }] },
    { t: '彩蛋', c: 'random', title: '🧊 夏天的空调', body: '教室空调开得很足。', ch: [{ t: '享受凉爽', eff: { mood: 5 }, say: '你很惬意。' }, { t: '觉得冷，披件外套', eff: { health: 2 } }] },
    { t: '彩蛋', c: 'random', title: '🍵 老师请喝奶茶', body: '今天班主任心情好，说要请全班喝奶茶。', ch: [{ t: '开心收下', eff: { mood: 10, support: 4 }, say: '🧋 全班都很开心。' }, { t: '说谢谢老师', eff: { support: 2 } }] },
    { t: '彩蛋', c: 'random', title: '🎓 看到学长学姐', body: '高三的学长学姐在拍毕业照。', ch: [{ t: '憧憬未来', eff: { knowledge: 3, mood: 4 }, say: '你暗暗下定决心努力。' }, { t: '感慨一下', eff: { mood: 2 } }] },
    { t: '彩蛋', c: 'random', title: '🌸 花坛花开了', body: '校门口的花坛开满了花。', ch: [{ t: '驻足欣赏', eff: { mood: 6 }, say: '🌸 花香让你心情大好。' }, { t: '快步经过', eff: { mood: 1 } }] },
    { t: '彩蛋', c: 'random', title: '📖 图书馆座位', body: '你在图书馆找到了一个靠窗的好位置。', ch: [{ t: '安静学习', eff: { knowledge: 6 }, say: '你效率很高。' }, { t: '看看书放松', eff: { mood: 5 } }] },
    { t: '彩蛋', c: 'random', title: '🎧 同学分享耳机', body: '同桌递来一只耳机，让你听一首歌。', ch: [{ t: '一起听', eff: { mood: 7, support: 3 }, say: '那首歌很好听。' }, { t: '婉拒', eff: { mood: 1 } }] },
    { t: '彩蛋', c: 'random', title: '🍱 妈妈塞的零食', body: '你在书包里发现了妈妈塞的零食。', ch: [{ t: '感动地吃掉', eff: { mood: 9, health: 3 }, say: '你觉得很温暖。' }, { t: '留着分享', eff: { support: 3 } }] },
    { t: '彩蛋', c: 'random', title: '🪞 整理一下仪表', body: '路过玻璃门，你看到了自己。', ch: [{ t: '整理一下头发', eff: { charm: 2 }, say: '💁 你精神多了。' }, { t: '不在意', eff: {} }] },
    { t: '彩蛋', c: 'random', title: '🌙 晚自习的月亮', body: '窗外月亮很圆。', ch: [{ t: '抬头看一会儿', eff: { mood: 6 }, say: '你想起了一些事。' }, { t: '继续学习', eff: { knowledge: 2 } }] },
    { t: '彩蛋', c: 'random', title: '🎒 帮助新生', body: '一个新生找不到教学楼。', ch: [{ t: '带路', eff: { support: 5, mood: 4 }, say: '你把他带到了。' }, { t: '指个方向', eff: { support: 1 } }] },
    { t: '彩蛋', c: 'random', title: '📮 门卫室有信', body: '门卫大爷说有你的一封信。', ch: [{ t: '拆开看', eff: { mood: 5 }, say: '是远方朋友寄来的明信片。' }, { t: '晚点看', eff: { mood: 1 } }] },
    { t: '彩蛋', c: 'random', title: '🧺 大扫除', body: '今天轮到班级大扫除。', ch: [{ t: '认真打扫', eff: { support: 3, health: 1 }, say: '教室窗明几净。' }, { t: '划水', eff: { mood: 1 } }] },
    { t: '彩蛋', c: 'random', title: '🏃 运动会报名', body: '班委会在征集运动会项目。', ch: [{ t: '报名短跑', eff: { fitness: 3, influence: 2 }, say: '你报名了100米。' }, { t: '当啦啦队', eff: { support: 2 } }] },
    { t: '彩蛋', c: 'random', title: '🎤 文艺汇演排练', body: '班里在排节目，缺一个人。', ch: [{ t: '报名参加', eff: { charm: 3, mood: 5 }, say: '你加入了排练。' }, { t: '在幕后帮忙', eff: { support: 2 } }] },
    { t: '彩蛋', c: 'random', title: '💡 突然想通一道题', body: '走路时，你突然想通了昨天的难题。', ch: [{ t: '赶紧记下来', eff: { knowledge: 5, mood: 6 }, say: '那种豁然开朗的感觉太好了。' }] },
    { t: '彩蛋', c: 'random', title: '🌤️ 午后犯困', body: '午后阳光暖洋洋，特别想睡。', ch: [{ t: '趴桌午睡', eff: { sleep: 8, health: 2 }, say: '你睡了个好觉。' }, { t: '喝咖啡提神', eff: { sleep: -12, money: -6 } }] },
    { t: '彩蛋', c: 'random', title: '🎯 社团招新表演', body: '操场上社团在表演，围了一圈人。', ch: [{ t: '挤进去看', eff: { mood: 8 }, say: '表演很精彩。' }, { t: '路过', eff: { mood: 1 } }] },
    { t: '彩蛋', c: 'random', title: '🪟 同桌的窗边风景', body: '同桌说今天云特别好看。', ch: [{ t: '一起看云', eff: { mood: 6, support: 2 }, say: '你们给云编了各种形状。' }, { t: '继续听课', eff: { knowledge: 1 } }] }
  ];

  /* ---------- fight resolver ---------- */
  function fight() {
    var g = G(); if (!g) return;
    var fit = g.fitness || 50, inf = g.influence || 50;
    var score = fit * 0.5 + inf * 0.3 + rnd(0, 20);
    if (g.demerits == null) g.demerits = 0;
    if (score > 70) {
      X.UI.popup({
        title: '👊 冲突结果',
        body: '你平时练得扎实，气势也足，对方没占到便宜，灰溜溜地走了。',
        buttons: [
          { text: '点到为止', cls: 'good', onClick: function () { g.influence += 5; g.fitness += 2; log('你赢得了尊重，也没有把事情闹大。', 'good'); } },
          { text: '继续理论', cls: 'warn', onClick: function () { g.demerits += 1; g.influence += 3; log('闹到了老师那里，你被记了一次。', 'warn'); } }
        ]
      });
    } else if (score > 40) {
      X.UI.popup({
        title: '👊 冲突结果',
        body: '双方扭打在一起，没分出胜负，被同学拉开了。',
        buttons: [
          { text: '握手言和', cls: 'good', onClick: function () { g.support += 2; log('你们互相道了歉。'); } },
          { text: '被老师发现', cls: 'warn', onClick: function () { g.demerits += 1; g.mood -= 4; log('📕 你们都被处分了。', 'warn'); } }
        ]
      });
    } else {
      X.UI.popup({
        title: '👊 冲突结果',
        body: '对方人多势众，你吃了亏。',
        buttons: [
          { text: '告诉老师', cls: 'good', onClick: function () { g.support += 2; g.health -= 4; log('老师介入处理，你被带到医务室。'); } },
          { text: '忍了', cls: 'warn', onClick: function () { g.health -= 8; g.mood -= 8; log('你憋着一肚子气。', 'warn'); } }
        ]
      });
    }
    clamp(); refresh();
  }

  /* ---------- scheduler ---------- */
  function context() {
    var g = G(); if (!g) return 'random';
    var t = g.time || '';
    var hr = parseInt(t.split(':')[0], 10) || 0;
    var ct = g.curType || '';
    if (ct.indexOf('class') >= 0 || ct.indexOf('t_class') >= 0) return 'class';
    if (ct.indexOf('patrol') >= 0) return 'break';
    if (ct.indexOf('break') >= 0) return 'break';
    if (ct.indexOf('night') >= 0) return 'night';
    if (hr >= 6 && hr < 8) return 'morning';
    if (hr >= 11 && hr < 13) return 'lunch';
    if (hr >= 19 && hr <= 23) return 'night';
    return 'random';
  }
  function eligible(e) {
    var g = G(); if (!g) return false;
    if (e.boys && g.gender !== '男') return false;
    if (e.girls && g.gender !== '女') return false;
    if (g.mode !== 'student' && (e.c === 'fight' || e.c === 'sport' || e.c === 'dorm')) return false;
    return true;
  }
  var lastShown = 0;
  function maybeShow() {
    var g = G();
    if (!g || g.over) return;
    /* don't stack on open popups */
    var open = document.querySelectorAll('.x590-pop.show,.x590-panel.show').length;
    if (open > 0) return;
    var now = Date.now();
    if (now - lastShown < 38000) return; /* buffer */
    /* only in game, not in intro */
    var gameEl = document.getElementById('game');
    if (!gameEl || getComputedStyle(gameEl).display === 'none') return;
    var ctx = context();
    var pool = POOL.filter(function (e) { return eligible(e); });
    /* weighted: same context 3x, others 1x */
    var weighted = [];
    pool.forEach(function (e) {
      var w = (e.c === ctx) ? 3 : 1;
      for (var i = 0; i < w; i++) weighted.push(e);
    });
    var e = weighted[Math.floor(Math.random() * weighted.length)];
    if (!e) return;
    lastShown = now;
    var ch = (e.ch || []).map(function (c) {
      return {
        t: c.t, cls: c.cls, say: c.say,
        eff: c.eff,
        fn: c.fn === 'fight' ? fight : c.fn
      };
    });
    E(e.title, e.body, ch);
  }
  X.Popups = { pool: POOL, fight: fight, E: E };
  T.setInterval(maybeShow, 12000);
  T.setTimeout(maybeShow, 20000);
})();

/* ===== 590_newspaper.js ===== */
/* ===== X590 newspaper enhancement: real photos + logo + reliable morning ===== */
(function () {
  if (window.__X590_NEWSPAPER__) return; window.__X590_NEWSPAPER__ = true;
  var X = (window.X590 = window.X590 || {});
  var T = X.T || (window.X581 && X581.timer) || { setTimeout: function (f, t) { return setTimeout(f, t); } };
  function G() { return window.G || null; }

  function isSportsDay() {
    var d = G() && G.date ? new Date(G.date) : new Date();
    return d.getMonth() === 9 && d.getDate() === 22;
  }

  function photo(key) { return X.ASSETS[key] || X.ASSETS.aerial_main; }

  /* set the xizi logo on the base assets namespace */
  function setLogo() {
    window.X583A = window.X583A || {};
    if (X.ASSETS.xizi) window.X583A.xizi = X.ASSETS.xizi;
  }

  /* replace emoji image placeholders with real photos */
  function injectPhotos() {
    var ov = document.getElementById('x583Paper');
    if (!ov) return;
    if (!ov.classList.contains('show')) {
      /* paper may still be animating in; retry shortly instead of giving up */
      T.setTimeout(injectPhotos, 300);
      return;
    }
    var en = !!ov.querySelector('.x583-aap');
    var imgs = isSportsDay()
      ? ['aerial_track', 'sports_meet', 'track_run', 'highjump', 'stage', 'field_top']
      : ['campus_path', 'school_build', 'aerial_main', 'school_gate', 'aerial_lake'];
    var slots = ov.querySelectorAll('.x583-paperimg');
    slots.forEach(function (s, i) {
      if (s.getAttribute('data-x590photo')) return;
      var k = imgs[i % imgs.length];
      s.setAttribute('data-x590photo', k);
      s.innerHTML = '<img src="' + photo(k) + '" alt="" style="width:100%;border-radius:4px;display:block">';
      s.style.cssText = 'margin:8px 0;border:1px solid #ccc;padding:3px;background:#fdfdfb';
    });
    /* ensure logo image uses the cut */
    var logo = ov.querySelector('.x583-mh-logo img');
    if (logo && X.ASSETS.xizi) logo.src = X.ASSETS.xizi;
  }

  function enhance() {
    setLogo();
    var P = window.X583 && window.X583.Paper;
    if (!P) return;
    if (P.__x590enh) return; P.__x590enh = true;
    var origOpen = P.open, origEN = P.openEN;
    P.open = function (after) {
      origOpen.call(P, after);
      T.setTimeout(injectPhotos, 400);
      T.setTimeout(injectPhotos, 1200);
    };
    P.openEN = function (after) {
      origEN.call(P, after);
      T.setTimeout(injectPhotos, 400);
      T.setTimeout(injectPhotos, 1200);
    };
  }

  /* reliable morning popup: if the base director hook didn't fire on the first
     morning news, show the paper once at the first in-game morning */
  var morningShown = false;
  function watchMorning() {
    var g = G();
    if (!g || g.over) return;
    var ct = g.curType || '';
    var t = g.time || '';
    var hr = parseInt(t.split(':')[0], 10) || 0;
    if (!morningShown && (hr >= 6 && hr < 8) && ct.indexOf('morning') < 0) {
      /* only show on a genuine fresh morning (day 1) */
      if (g.day === 1) {
        morningShown = true;
        var P = window.X583 && window.X583.Paper;
        if (P) T.setTimeout(function () { P.open(); }, 1500);
      }
    }
  }

  X.Newspaper = {
    open: function () { enhance(); var P = window.X583 && window.X583.Paper; if (P) P.open(); },
    openEN: function () { enhance(); var P = window.X583 && window.X583.Paper; if (P) P.openEN(); }
  };

  T.setTimeout(enhance, 800);
  T.setInterval(enhance, 3000);
  T.setInterval(watchMorning, 5000);
  T.setInterval(injectPhotos, 1500);
})();

/* ===== 590_themes.js ===== */
/* ===== X590 themes wrapper (opens existing theme panel) ===== */
(function () {
  if (window.__X590_THEMES__) return; window.__X590_THEMES__ = true;
  var X = (window.X590 = window.X590 || {});
  var T = X.T || (window.X581 && X581.timer) || { setTimeout: function (f, t) { return setTimeout(f, t); } };

  function open() {
    if (typeof openThemePanel === 'function') { openThemePanel(); return; }
    if (typeof openThemePanel13 === 'function') { openThemePanel13(); return; }
    if (window.XZ13 && typeof XZ13.openTheme === 'function') { XZ13.openTheme(); return; }
    /* fallback: list themes ourselves */
    var themes = [
      { id: 'xizi', ic: '🌊', nm: '西子湖' },
      { id: 'default', ic: '🎨', nm: '默认' },
      { id: 'qingshan', ic: '🏔️', nm: '氢山' },
      { id: 'guanggu', ic: '🌅', nm: '光谷' },
      { id: 'warm', ic: '☀️', nm: '暖阳' },
      { id: 'darknight', ic: '🌙', nm: '暗夜' }
    ];
    var h = '<div class="x590-hub-grid">';
    themes.forEach(function (t) {
      h += '<button class="x590-hub-item" data-id="' + t.id + '"><span class="x590-hi-ic">' + t.ic + '</span><span class="x590-hi-nm">' + t.nm + '</span></button>';
    });
    h += '</div>';
    var p = X.UI.popup({ title: '🎨 主题切换', body: h, buttons: [{ text: '关闭', onClick: function () {} }] });
    T.setTimeout(function () {
      p.el.querySelectorAll('.x590-hub-item').forEach(function (b) {
        b.onclick = function () {
          var id = b.getAttribute('data-id');
          if (typeof window.__qsApplyTheme === 'function') window.__qsApplyTheme(id);
          else if (typeof applyArtTheme === 'function') applyArtTheme(id);
          X.UI.toast('已切换主题：' + id);
        };
      });
    }, 200);
  }

  X.Themes = { open: open };
})();

/* ===== 590_demerits.js ===== */
/* ===== X590 demerits module (history + watcher) ===== */
(function () {
  if (window.__X590_DEMERITS__) return; window.__X590_DEMERITS__ = true;
  var X = (window.X590 = window.X590 || {});
  var T = X.T || (window.X581 && X581.timer) || {
    setTimeout: function (f, t) { return setTimeout(f, t); },
    setInterval: function (f, t) { return setInterval(f, t); }
  };
  function G() { return window.G || null; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function ensure() {
    var g = G(); if (!g) return null;
    if (g.demerits == null) g.demerits = 0;
    if (!Array.isArray(g.demeritHistory)) g.demeritHistory = [];
    return g;
  }

  /* record a demerit with a reason */
  function record(reason) {
    var g = ensure(); if (!g) return;
    var d = g.date ? new Date(g.date) : new Date();
    g.demeritHistory.push({
      reason: reason || '违纪行为',
      date: d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2),
      time: g.time || ''
    });
  }

  /* watcher: detect count increase from any code path */
  var lastCount = 0;
  function watch() {
    var g = ensure(); if (!g) return;
    if (g.demerits > lastCount) {
      var add = g.demerits - lastCount;
      for (var i = 0; i < add; i++) record('违纪（系统记录）');
    }
    lastCount = g.demerits;
  }
  function resetWatch() {
    var g = ensure(); if (g) lastCount = g.demerits;
  }

  function open() {
    var g = ensure(); if (!g) { X.UI.toast('请先进入游戏'); return; }
    var danger = g.demerits >= 3;
    var h = '<div class="x590-demerit-head">';
    h += '<div class="x590-demerit-count' + (danger ? ' danger' : '') + '">' + g.demerits + '<small>/3</small></div>';
    h += '<div class="x590-demerit-info"><b>' + (danger ? '已达到退学线' : '当前处分记录') + '</b>' +
      '<span style="font-size:12px;opacity:.7;display:block;margin-top:4px">累计 3 个处分将被退学处理</span></div></div>';
    h += '<div class="x590-demerit-list">';
    if (!g.demeritHistory.length) {
      h += '<div class="x590-empty" style="text-align:center;padding:30px 10px;opacity:.6">📭 暂无处分记录，继续保持！</div>';
    } else {
      g.demeritHistory.slice().reverse().forEach(function (r) {
        h += '<div class="x590-demerit-row"><span class="x590-demerit-ic">📄</span>' +
          '<div><b>' + esc(r.reason) + '</b><span style="font-size:12px;opacity:.6;display:block;margin-top:2px">' + esc(r.date) + ' ' + esc(r.time) + '</span></div></div>';
      });
    }
    h += '</div>';
    X.UI.panel({
      title: '📕 处分记录',
      body: h,
      onShow: function () {}
    });
  }

  X.Demerits = { open: open, record: record, resetWatch: resetWatch };

  T.setTimeout(resetWatch, 2000);
  T.setInterval(watch, 1500);
})();

/* ===== 590_char.js ===== */
/* ===== X590 character creation: polished new wizard + classic toggle ===== */
(function () {
  if (window.__X590_CHAR__) return; window.__X590_CHAR__ = true;
  var X = (window.X590 = window.X590 || {});
  var T = X.T || (window.X581 && X581.timer) || { setTimeout: function (f, t) { return setTimeout(f, t); } };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------- MBTI with effects ---------- */
  var MBTI = [
    { id: 'INTJ', nm: '建筑师', eff: '学习+6，计划型事件加成，社交略被动' },
    { id: 'INTP', nm: '逻辑学家', eff: '理科+6，脑洞事件，容易拖延' },
    { id: 'ENTJ', nm: '指挥官', eff: '影响力+8，领导力事件，强势' },
    { id: 'ENTP', nm: '辩论家', eff: '口才+6，辩论/社团加成，爱抬杠' },
    { id: 'INFJ', nm: '提倡者', eff: '共情+6，文艺事件，理想主义' },
    { id: 'INFP', nm: '调停者', eff: '创作+6，浪漫事件，情绪敏感' },
    { id: 'ENFJ', nm: '主人公', eff: '魅力+8，社交核心，照顾他人' },
    { id: 'ENFP', nm: '竞选者', eff: '心情+8，朋友多，三分钟热度' },
    { id: 'ISTJ', nm: '物流师', eff: '自律+6，稳定发挥，偏保守' },
    { id: 'ISFJ', nm: '守卫者', eff: '细心+6，被信任，不爱出风头' },
    { id: 'ESTJ', nm: '总经理', eff: '组织+8，班干部事件，讲规矩' },
    { id: 'ESFJ', nm: '执政官', eff: '人缘+8，热心肠，在意评价' },
    { id: 'ISTP', nm: '鉴赏家', eff: '动手+6，运动/技术，冷静' },
    { id: 'ISFP', nm: '探险家', eff: '审美+6，艺术/温柔，随遇而安' },
    { id: 'ESTP', nm: '企业家', eff: '胆量+8，临场反应强，爱冒险' },
    { id: 'ESFP', nm: '表演者', eff: '表现+8，活跃气氛，冲动' }
  ];
  var MBTI_EFF = {
    INTJ: { knowledge: 6 }, INTP: { knowledge: 6 }, ENTJ: { influence: 8 }, ENTP: { charm: 4 },
    INFJ: { charm: 3 }, INFP: { mood: 4 }, ENFJ: { charm: 8 }, ENFP: { mood: 8 },
    ISTJ: { knowledge: 3 }, ISFJ: { support: 4 }, ESTJ: { influence: 6 }, ESFJ: { support: 8 },
    ISTP: { fitness: 5 }, ISFP: { charm: 4 }, ESTP: { fitness: 6 }, ESFP: { mood: 6 }
  };

  /* ---------- wizard state ---------- */
  var S = null;
  function defaultS() {
    return {
      gt: 'free', name: '', gender: '男', h: 178, w: 62,
      family: 'worker', features: [], hobbies: [], shoes: [],
      subj: [], mbti: 'INFP', zodiac: '天秤', blood: 'A', hand: 'right',
      pref: '异性', mode: 'student', role: '普通老师', boarder: true,
      phoneId: 0, itemList: [], period: false, step: 0
    };
  }

  var FAMILIES = (window.X56Char && X56Char.families) || [];
  var FEATURES = (window.X56Char && X56Char.features) || [];
  var HOBBIES = (window.X56Char && X56Char.hobbies) || [];
  var ZODIACS = (window.X56Char && X56Char.zodiacs) || [];
  var SUBJECTS = ['物理', '化学', '生物', '政治', '历史', '地理', '技术'];
  var SHOES = ['运动鞋', '帆布鞋', '板鞋', '跑鞋', '篮球鞋', '皮鞋', '棉鞋', '拖鞋'];
  var BLOODS = ['A', 'B', 'O', 'AB'];
  var HANDS = [{ id: 'right', n: '右手' }, { id: 'left', n: '左撇子' }, { id: 'both', n: '双手通用' }];

  /* ---------- step cards ---------- */
  function card(inner, sub) {
    return '<div class="x590-char-card"><div class="x590-char-sub">' + (sub || '') + '</div>' + inner + '</div>';
  }
  function chipGroup(choices, selected, key, multi) {
    var h = '<div class="x590-char-chips">';
    choices.forEach(function (c) {
      var id = typeof c === 'string' ? c : c.id;
      var nm = typeof c === 'string' ? c : (c.name || c.n || c.id);
      var on = multi ? selected.indexOf(id) >= 0 : selected === id;
      h += '<button class="x590-char-chip' + (on ? ' on' : '') + '" data-key="' + key + '" data-id="' + esc(id) + '" data-multi="' + (multi ? 1 : 0) + '">' + esc(nm) + '</button>';
    });
    return h + '</div>';
  }
  function steps() {
    var s = S;
    var list = [];
    /* 0 game type */
    list.push(card(chipGroup([{ id: 'free', name: '🏫 自由模式' }, { id: 'story', name: '📖 剧情模式' }, { id: 'teacher', name: '👔 教师模式' }], s.gt, 'gt', false),
      '选择你要体验的游戏类型'));
    /* 1 name */
    list.push(card('<input type="text" id="x590fName" maxlength="8" placeholder="输入你的名字（不填用默认）" value="' + esc(s.name) + '" style="width:100%;padding:12px;font-size:16px;border-radius:12px;border:1px solid #ccc">',
      '① 姓名'));
    if (s.gt !== 'teacher') {
      /* 2 gender */
      list.push(card(chipGroup(['男', '女'], s.gender, 'gender', false) +
        (s.gender === '女' ? '<label style="display:flex;align-items:center;gap:8px;margin-top:12px;cursor:pointer"><input type="checkbox" id="x590Period" ' + (s.period ? 'checked' : '') + '> 开启生理期系统（更真实）</label>' : ''),
        '② 性别'));
      /* 3 body */
      list.push(card(
        '<div style="display:flex;align-items:center;justify-content:center;gap:10px;margin:10px 0">身高 <button class="x590-stepb" data-k="h" data-d="-5">−5</button><b id="x590h" style="min-width:50px">' + s.h + '</b>cm <button class="x590-stepb" data-k="h" data-d="5">+5</button></div>' +
        '<div style="display:flex;align-items:center;justify-content:center;gap:10px;margin:10px 0">体重 <button class="x590-stepb" data-k="w" data-d="-2">−2</button><b id="x590w" style="min-width:50px">' + s.w + '</b>kg <button class="x590-stepb" data-k="w" data-d="2">+2</button></div>' +
        '<small style="opacity:.6;display:block;text-align:center">身高影响颜值/体育课/被调侃；体重影响体力/颜值</small>',
        '③ 身高 / 体重'));
    }
    if (s.gt === 'free') {
      /* 4 family */
      list.push(card(chipGroup(FAMILIES.map(function (f) { return { id: f.id, name: f.name }; }), s.family, 'family', false),
        '④ 家庭背景（影响开局金钱/属性/事件）'));
      /* 5 features */
      list.push(card(chipGroup(FEATURES, s.features, 'features', true),
        '⑤ 外貌特征（多选，最多4，影响颜值/互动）'));
      /* 6 hobbies */
      list.push(card(chipGroup(HOBBIES, s.hobbies, 'hobbies', true),
        '⑥ 爱好 / 特长（多选，最多3，影响社团/技能）'));
      /* 7 shoes */
      list.push(card(chipGroup(SHOES, s.shoes, 'shoes', true),
        '⑦ 鞋子（可多选几双带去学校）'));
      /* 8 subjects */
      list.push(card(chipGroup(SUBJECTS, s.subj, 'subj', true),
        '⑧ 浙江高考选科（选3门，决定课表）'));
    }
    /* 9 MBTI */
    list.push(card(chipGroup(MBTI.map(function (m) { return { id: m.id, name: m.id + ' ' + m.nm }; }), s.mbti, 'mbti', false) +
      '<small id="x590mbtiInfo" style="opacity:.7;display:block;margin-top:8px">' + esc(MBTI.filter(function (m) { return m.id === s.mbti; })[0].eff) + '</small>',
      '⑨ MBTI（影响性格事件与初始加成）'));
    /* 10 zodiac */
    list.push(card(chipGroup(ZODIACS.map(function (z) { return { id: z.id, name: z.id }; }), s.zodiac, 'zodiac', false),
      '⑩ 星座（影响运气与小事件）'));
    /* 11 blood/hand */
    list.push(card('<b style="display:block;margin-bottom:6px">血型</b>' + chipGroup(BLOODS, s.blood, 'blood', false) +
      '<b style="display:block;margin:10px 0 6px">惯用手</b>' + chipGroup(HANDS.map(function (x) { return { id: x.id, name: x.n }; }), s.hand, 'hand', false),
      '⑪ 血型 / 惯用手'));
    /* 12 pref */
    list.push(card(chipGroup(['异性', '同性', '都行'], s.pref, 'pref', false),
      '⑫ 恋爱倾向'));
    if (s.gt === 'teacher') {
      /* 13 role */
      list.push(card(chipGroup(['普通老师', '班主任', '年级主任', '校长'], s.role, 'role', false),
        '⑬ 教师身份（班主任/主任有更多系统与津贴）'));
    }
    /* 14 boarding */
    list.push(card(chipGroup([{ id: 'true', name: '🏠 住宿' }, { id: 'false', name: '🏡 走读' }], s.boarder ? 'true' : 'false', 'boarder', false),
      '⑬ 住宿 / 走读'));
    /* 15 phone */
    var phoneChoices = (window.PHONES || []).map(function (p, i) { return { id: String(i), name: p.b + ' ' + p.n }; });
    list.push(card(chipGroup(phoneChoices, String(s.phoneId), 'phoneId', false),
      '⑭ 手机型号（带进学校）'));
    /* 16 items */
    var itemChoices = (window.START_ITEMS || []).map(function (id) { var it = ITEMS[id]; return { id: id, name: it.i + ' ' + it.n }; });
    list.push(card(chipGroup(itemChoices, s.itemList, 'itemList', true),
      '⑮ 开局道具（多选，最多3）'));
    return list;
  }

  /* ---------- overlay ---------- */
  var overlay = null;
  function render() {
    var list = steps();
    if (S.step >= list.length) S.step = list.length - 1;
    if (S.step < 0) S.step = 0;
    var total = list.length;
    var dots = '';
    for (var i = 0; i < total; i++) dots += '<span class="x590-dot' + (i === S.step ? ' on' : '') + '"></span>';
    var body = overlay.querySelector('.x590-char-body');
    body.innerHTML = '<div class="x590-dots">' + dots + '</div>' + list[S.step] +
      '<div class="x590-char-nav">' +
      '<button class="x590-nav-btn" id="x590Prev" ' + (S.step === 0 ? 'disabled' : '') + '>← 上一步</button>' +
      (S.step === total - 1 ? '<button class="x590-nav-btn go" id="x590Finish">开始 →</button>' : '<button class="x590-nav-btn go" id="x590Next">下一步 →</button>') +
      '</div>';
    bindCard(body);
  }

  function bindCard(body) {
    body.querySelectorAll('.x590-char-chip').forEach(function (c) {
      c.onclick = function () {
        var key = c.getAttribute('data-key');
        var id = c.getAttribute('data-id');
        var multi = c.getAttribute('data-multi') === '1';
        if (key === 'gt') { S.gt = id; S.mode = id === 'teacher' ? 'teacher' : 'student'; }
        else if (key === 'gender') { S.gender = id; if (id === '男') S.period = false; }
        else if (key === 'mbti') { S.mbti = id; }
        else if (key === 'zodiac') { S.zodiac = id; }
        else if (key === 'blood') { S.blood = id; }
        else if (key === 'hand') { S.hand = id; }
        else if (key === 'pref') { S.pref = id; }
        else if (key === 'role') { S.role = id; }
        else if (key === 'boarder') { S.boarder = id === 'true'; }
        else if (key === 'phoneId') { S.phoneId = parseInt(id, 10); }
        else if (key === 'family') { S.family = id; }
        else if (multi) {
          var arr = S[key];
          var ix = arr.indexOf(id);
          if (ix >= 0) arr.splice(ix, 1);
          else {
            var cap = key === 'features' ? 4 : key === 'hobbies' ? 3 : key === 'itemList' ? 3 : 99;
            if (arr.length < cap) arr.push(id);
          }
        }
        render();
      };
    });
    body.querySelectorAll('.x590-stepb').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-k'), d = parseInt(b.getAttribute('data-d'), 10);
        if (k === 'h') S.h = Math.max(140, Math.min(205, S.h + d));
        if (k === 'w') S.w = Math.max(35, Math.min(120, S.w + d));
        render();
      };
    });
    var nm = body.querySelector('#x590fName');
    if (nm) nm.oninput = function () { S.name = nm.value; };
    var per = body.querySelector('#x590Period');
    if (per) per.onchange = function () { S.period = per.checked; };
    var prev = body.querySelector('#x590Prev');
    if (prev) prev.onclick = function () { S.step--; render(); };
    var next = body.querySelector('#x590Next');
    if (next) next.onclick = function () { S.step++; render(); };
    var fin = body.querySelector('#x590Finish');
    if (fin) fin.onclick = finish;
  }

  /* ---------- finish: write into O and start ---------- */
  function finish() {
    if (S.gt === 'story') {
      closeOverlay();
      T.setTimeout(function () { X.Story.open(); }, 300);
      return;
    }
    /* write into base selection O */
    var O = window.O;
    if (!O) { X.UI.toast('初始化中，请稍候'); return; }
    O.gender = S.gender;
    O.pref = S.pref;
    O.mode = S.mode;
    O.role = S.role;
    O.boarder = S.boarder;
    O.phoneId = S.phoneId;
    O.itemList = S.itemList.slice();
    /* name field */
    var fName = document.getElementById('fName');
    if (fName) fName.value = S.name;
    /* family starting money */
    var fam = FAMILIES.filter(function (f) { return f.id === S.family; })[0];
    /* apply MBTI + family + features/hobbies after startGame via a hook */
    X.__charPost = {
      mbti: S.mbti, family: S.family, famMoney: fam ? fam.money : 200,
      features: S.features.slice(), hobbies: S.hobbies.slice(),
      zodiac: S.zodiac, hand: S.hand, period: S.period, gt: S.gt
    };
    /* auto-roll 3 talents if none and not boss */
    if (O.mode === 'student' && !O.talents.length) {
      for (var i = 0; i < 3; i++) {
        try {
          var p = TAL_S, pool = p.slice(), cand = [];
          for (var j = 0; j < 3 && pool.length; j++) cand.push(pool.splice(rnd(0, pool.length - 1), 1)[0]);
          O.talents.push(cand[0]);
        } catch (e) {}
      }
    }
    closeOverlay();
    T.setTimeout(function () {
      if (typeof window.startGame === 'function') window.startGame();
    }, 200);
  }

  /* apply post-creation effects (called after G is built) */
  function applyPost() {
    var g = window.G; var p = X.__charPost;
    if (!g || !p) return;
    /* family money */
    if (p.famMoney) g.money = Math.max(g.money, p.famMoney);
    /* MBTI */
    var me = MBTI_EFF[p.mbti];
    if (me) Object.keys(me).forEach(function (k) { if (typeof g[k] === 'number') g[k] += me[k]; });
    g.mbti = p.mbti;
    g.family = p.family;
    g.features = p.features;
    g.hobbies = p.hobbies;
    g.zodiac = p.zodiac;
    g.handed = p.hand;
    g.period = !!p.period;
    if (p.period) g.periodDay = 1 + Math.floor(Math.random() * 28);
    /* features -> appear */
    if (p.features.length) g.appear += p.features.length * 2;
    /* hobbies -> knowledge/skills */
    if (p.hobbies.length) g.knowledge += p.hobbies.length * 2;
    X.__charPost = null;
    if (typeof clampAll === 'function') clampAll();
    if (typeof upd === 'function') upd();
  }
  X.applyCharPost = applyPost;

  /* hook startGame to apply post effects */
  T.setTimeout(function () {
    var orig = window.startGame;
    if (typeof orig === 'function' && !orig.__x590post) {
      var wrapped = function () {
        var r = orig.apply(this, arguments);
        T.setTimeout(applyPost, 120);
        return r;
      };
      wrapped.__x590post = true;
      window.startGame = wrapped;
    }
  }, 1000);

  /* ---------- overlay build ---------- */
  function closeOverlay() {
    if (overlay) { overlay.style.display = 'none'; }
  }
  function open() {
    S = defaultS();
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'x590CharOverlay';
      overlay.innerHTML =
        '<div class="x590-char-top"><span>🎒 创建角色（新版向导）</span><span><button class="x590-classic-btn" id="x590ClassicBtn" title="切换到经典版">经典版</button><button class="x590-char-close" id="x590CharClose">✕</button></span></div>' +
        '<div class="x590-char-body"></div>';
      document.body.appendChild(overlay);
      overlay.querySelector('#x590CharClose').onclick = function () { closeOverlay(); if (typeof backToHero === 'function') backToHero(); };
      overlay.querySelector('#x590ClassicBtn').onclick = function () {
        closeOverlay();
        var cp = document.getElementById('charPanel');
        if (cp) cp.style.display = 'block';
        X.UI.toast('已切换到经典版角色创建');
      };
    }
    overlay.style.display = 'flex';
    render();
  }
  X.Char = { open: open, MBTI: MBTI };

  /* intercept showCharCreate to open the new wizard by default */
  T.setTimeout(function () {
    var orig = window.showCharCreate;
    window.showCharCreate = function () {
      /* default new wizard; hide base panel */
      var hp = document.getElementById('heroPanel'); if (hp) hp.style.display = 'none';
      var cp = document.getElementById('charPanel'); if (cp) cp.style.display = 'none';
      var st = document.getElementById('start'); if (st) st.classList.add('show');
      open();
    };
  }, 800);
})();

/* ===== 590_misc.js ===== */
/* ===== X590 misc: hub, petals, calendar, time guard, chat return, modes ===== */
(function () {
  if (window.__X590_MISC__) return; window.__X590_MISC__ = true;
  var X = (window.X590 = window.X590 || {});
  var T = X.T || (window.X581 && X581.timer) || {
    setTimeout: function (f, t) { return setTimeout(f, t); },
    setInterval: function (f, t) { return setInterval(f, t); }
  };
  function G() { return window.G || null; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function isDark() {
    var d = document.documentElement;
    return d.classList.contains('dark') || d.classList.contains('x590-dark') ||
      document.body.classList.contains('theme-night') || document.body.classList.contains('theme-dark');
  }
  function modalOpen() {
    return document.querySelectorAll('.x590-pop.show,.x590-panel.show,#modal.show,.modal.show').length > 0;
  }

  /* ============================================================
     1. HUB FAB + panel — single entry for all X590 systems
     ============================================================ */
  function hubBody() {
    var g = G();
    var items = [
      { ic: '🎒', nm: '我的背包', d: '物品/金钱，可真用', go: function () { X.Bag.open(); } },
      { ic: '📖', nm: '剧情模式', d: '可玩言情小说', go: function () { X.Story.open(); } },
      { ic: '🌅', nm: '朋友圈', d: '点赞/评论/九宫格', go: function () { X.Friends.open(); } },
      { ic: '📅', nm: '校历', d: '日程/运动会/考试', go: function () { X.Calendar.open(); } },
      { ic: '📰', nm: '西子日报', d: '校园新闻/英文报', go: function () { X.Newspaper.open(); } },
      { ic: '🎨', nm: '主题切换', d: '随时更换主题', go: function () { X.Themes.open(); } }
    ];
    if (g && g.mode === 'teacher') {
      items.push({ ic: '🧑‍🏫', nm: '教师工作台', d: '巡查/备课/举报', go: function () { X.Teacher.open(); } });
    } else {
      items.push({ ic: '📕', nm: '处分记录', d: '历史处分', go: function () { X.Demerits.open(); } });
    }
    var h = '<div class="x590-hub-grid">';
    items.forEach(function (it) {
      h += '<button class="x590-hub-item"><span class="x590-hi-ic">' + it.ic + '</span><span class="x590-hi-nm">' + esc(it.nm) + '</span><span class="x590-hi-d">' + esc(it.d) + '</span></button>';
    });
    h += '</div>';
    return { h: h, items: items };
  }
  function openHub() {
    var b = hubBody();
    var p = X.UI.panel({ title: '🧰 西子 X590 工作台', body: b.h, onShow: function (body) {
      body.querySelectorAll('.x590-hub-item').forEach(function (btn, i) {
        btn.onclick = function () { p.close(); T.setTimeout(function () { b.items[i].go(); }, 240); };
      });
    } });
  }
  function buildHubFab() {
    if (document.getElementById('x590HubFab')) return;
    var f = document.createElement('button');
    f.id = 'x590HubFab';
    f.type = 'button';
    f.innerHTML = '🧰';
    f.title = '西子 X590 工作台';
    f.style.cssText = 'position:fixed;right:14px;bottom:254px;width:50px;height:50px;border-radius:16px;border:none;z-index:27000;font-size:22px;color:#fff;background:linear-gradient(135deg,#8a5cf6,#5b7cfa);box-shadow:0 8px 20px rgba(0,0,0,.32);cursor:pointer;display:flex;align-items:center;justify-content:center;';
    f.onclick = openHub;
    document.body.appendChild(f);
    if (window.matchMedia && window.matchMedia('(max-width:640px)').matches) {
      f.style.width = '48px'; f.style.height = '48px'; f.style.bottom = '236px';
    }
  }

  /* ============================================================
     2. Function row quick buttons (#xzRow2)
     ============================================================ */
  function buildRowButtons() {
    var row = document.getElementById('xzRow2');
    if (!row || document.getElementById('x590RowDone')) return;
    var defs = [
      { ic: '🎒', nm: '背包', go: function () { X.Bag.open(); } },
      { ic: '🌅', nm: '朋友圈', go: function () { X.Friends.open(); } },
      { ic: '📖', nm: '剧情', go: function () { X.Story.open(); } },
      { ic: '📅', nm: '校历', go: function () { X.Calendar.open(); } }
    ];
    defs.forEach(function (d) {
      var b = document.createElement('button');
      b.className = 'mini';
      b.innerHTML = d.ic + ' ' + d.nm;
      b.onclick = d.go;
      row.appendChild(b);
    });
    var mark = document.createElement('span');
    mark.id = 'x590RowDone'; mark.style.display = 'none';
    row.appendChild(mark);
  }

  /* ============================================================
     3. Petals / stars — sparse, context-aware, continuous
     ============================================================ */
  var petLayer = null;
  function ensurePetLayer() {
    if (petLayer) return petLayer;
    petLayer = document.getElementById('x590Petals');
    if (!petLayer) {
      petLayer = document.createElement('div');
      petLayer.id = 'x590Petals';
      document.body.appendChild(petLayer);
    }
    return petLayer;
  }
  function spawnPetal() {
    var L = ensurePetLayer();
    if (L.childElementCount >= 11) return; /* cap */
    var dark = isDark();
    var s = document.createElement('span');
    s.className = 'x590-p';
    if (dark) {
      s.textContent = '✦';
      s.style.color = 'rgba(255,255,255,' + (0.5 + Math.random() * 0.4) + ')';
      s.style.fontSize = (8 + Math.random() * 8) + 'px';
      s.style.animationDuration = (7 + Math.random() * 5) + 's';
    } else {
      var sym = ['🌸', '🌹', '🌷', '🌸'];
      s.textContent = sym[Math.floor(Math.random() * sym.length)];
      s.style.fontSize = (11 + Math.random() * 10) + 'px';
      s.style.opacity = (0.45 + Math.random() * 0.35);
      s.style.animationDuration = (9 + Math.random() * 7) + 's';
    }
    s.style.left = (Math.random() * 100) + 'vw';
    s.style.animationDelay = '0s';
    L.appendChild(s);
    var life = dark ? 13000 : 17000;
    T.setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, life);
  }
  function startPetals590() {
    ensurePetLayer();
    if (X.__petTimer) return;
    X.__petTimer = T.setInterval(spawnPetal, 1400);
    /* seed a few */
    for (var i = 0; i < 4; i++) T.setTimeout(spawnPetal, i * 700);
  }
  /* override base petals so it doesn't double up */
  function tameBasePetals() {
    try {
      if (typeof window.startPetals === 'function') {
        window.startPetals = function () { startPetals590(); };
      }
      if (typeof window.stopPetals === 'function') {
        window.stopPetals = function () { if (petLayer) petLayer.style.display = 'none'; };
      }
      var old = document.getElementById('xzPetals');
      if (old) old.style.display = 'none';
    } catch (e) {}
  }

  /* ============================================================
     4. Calendar
     ============================================================ */
  var CAL = {
    events: {
      '10-22': ['🏆 秋季运动会', '全天 · 操场'],
      '10-25': ['📝 月考周', '各年级'],
      '11-02': ['🏅 运动会(备用)', '如遇雨天顺延'],
      '11-15': ['📚 期中考试', '三天'],
      '12-31': ['🎤 元旦文艺汇演', '体育馆'],
      '01-20': ['❄️ 寒假开始', '约6周']
    }
  };
  function monthGrid(year, month) {
    /* month 0-based */
    var first = new Date(year, month, 1);
    var startDay = first.getDay();
    var days = new Date(year, month + 1, 0).getDate();
    var week = ['日', '一', '二', '三', '四', '五', '六'];
    var h = '<div class="x590-cal-week">';
    week.forEach(function (w) { h += '<span>' + w + '</span>'; });
    h += '</div><div class="x590-cal-grid">';
    for (var i = 0; i < startDay; i++) h += '<span class="x590-cal-blank"></span>';
    var today = new Date();
    for (var d = 1; d <= days; d++) {
      var key = ('0' + (month + 1)).slice(-2) + '-' + ('0' + d).slice(-2);
      var ev = CAL.events[key];
      var cls = 'x590-cal-day';
      if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === d) cls += ' today';
      if (ev) cls += ' hasev';
      h += '<span class="' + cls + '" data-key="' + key + '" title="' + (ev ? esc(ev[0]) : '') + '">' + d + (ev ? '<i class="x590-cal-dot"></i>' : '') + '</span>';
    }
    h += '</div>';
    return h;
  }
  function openCalendar() {
    var now = new Date();
    var y = now.getFullYear(), m = now.getMonth();
    var body = '<div class="x590-cal-head"><span class="x590-cal-title">' + y + ' 年 ' + (m + 1) + ' 月</span></div>';
    body += '<div id="x590CalGrid">' + monthGrid(y, m) + '</div>';
    body += '<div class="x590-cal-events" id="x590CalEvents"><b>📌 近期日程</b>';
    Object.keys(CAL.events).forEach(function (k) {
      var e = CAL.events[k];
      body += '<div class="x590-cal-ev"><span class="x590-cal-evd">' + k + '</span><span>' + esc(e[0]) + ' <small style="opacity:.6">' + esc(e[1]) + '</small></span></div>';
    });
    body += '</div>';
    X.UI.panel({ title: '📅 校历', body: body, onShow: function (bd) {
      bd.querySelectorAll('.x590-cal-day.hasev').forEach(function (cell) {
        cell.onclick = function () {
          var k = cell.getAttribute('data-key'); var e = CAL.events[k];
          if (e) X.UI.toast(k + ' · ' + e[0] + '（' + e[1] + '）');
        };
      });
    } });
  }

  /* ============================================================
     5. Time guard — don't advance while a modal is open
     ============================================================ */
  function installTimeGuard() {
    if (X.__timeGuard) return; X.__timeGuard = true;
    var origNext = window.next;
    if (typeof origNext !== 'function') return;
    window.next = function () {
      if (modalOpen()) {
        T.setTimeout(function () { window.next(); }, 500);
        return;
      }
      return origNext.apply(this, arguments);
    };
  }

  /* ============================================================
     6. Chat return — ensure any chat/IM panel has a back button
     ============================================================ */
  function ensureChatBack() {
    document.querySelectorAll('[class*="chat"] .panel-head,[class*="im"] .panel-head,[class*="Chat"] .panel-head').forEach(function (h) {
      if (h.querySelector('.x590-backfix')) return;
      var b = document.createElement('button');
      b.className = 'x590-backfix';
      b.innerHTML = '←';
      b.style.cssText = 'min-width:44px;min-height:44px;border:none;background:transparent;font-size:18px;cursor:pointer;margin-right:6px';
      b.onclick = function () {
        var panel = h.closest('[class*="panel"],[class*="modal"],[id*="modal"]');
        if (panel) { panel.classList.remove('show'); T.setTimeout(function () { panel.style.display = 'none'; }, 200); }
      };
      h.insertBefore(b, h.firstChild);
    });
  }

  /* ============================================================
     7. Continue game mode label
     ============================================================ */
  function labelContinueModes() {
    /* find continue buttons and add mode context */
    var g = G();
    if (!g) return;
    var modeName = g.mode === 'teacher' ? '教师线' : g.storyMode ? '剧情模式' : '学生·自由模式';
    var info = document.getElementById('phoneInfo') || document.querySelector('.save-info,.mode-info');
    if (info && !info.getAttribute('data-x590mode')) {
      info.setAttribute('data-x590mode', '1');
      var tag = document.createElement('span');
      tag.className = 'x590-mode-tag';
      tag.textContent = '当前模式：' + modeName;
      tag.style.cssText = 'display:inline-block;margin:4px 0;padding:3px 10px;border-radius:10px;font-size:12px;background:rgba(124,156,255,.18);color:#5b7cfa';
      info.appendChild(tag);
    }
  }

  /* ============================================================
     8. 5.9 update email — push once when the mailbox is available
     ============================================================ */
  var versionMailPushed = false;
  function pushVersionMail() {
    if (versionMailPushed) return;
    var g = G();
    if (!g) return;
    /* ensure mailbox exists (mirrors base mailInit) */
    if (!g.mail) {
      g.mail = [
        { id: 'm0', from: '系统', sub: '欢迎来到 5.5.8', body: '新增每日精力、高考模拟、生理期记录、邮件、KTV 音准判定等系统。', read: false, time: '' },
        { id: 'm1', from: '教务处', sub: '关于高考模拟测评的通知', body: '教务处上线"高考模拟"系统，含等级赋分与大学推荐。', read: false, time: '' }
      ];
    }
    /* avoid duplicate if somehow already present */
    if (g.mail.some(function (m) { return m && m.sub && m.sub.indexOf('5.9') >= 0; })) {
      versionMailPushed = true; return;
    }
    versionMailPushed = true;
    var body =
      '同学们好，西子模拟器 5.9「万卷」来啦！\n\n' +
      '【视觉】内嵌毛体 / 原神体 / 霞鹜文楷三套手写字体，大标题用毛体、正文用文楷；片头与开始页换成学校真实航拍；五张手写字图统一节奏交替，不再乱动；黑夜飘星星、白天飘花瓣。\n' +
      '【内容】西子日报每天早上弹出、10 月 22 日运动会专题，可切换英文校报；新增全屏网格校历。\n' +
      '【建角】新旧两套建角自由切换，新增 MBTI、家庭、生理期、开局道具等，属性会影响后续。\n' +
      '【玩法】剧情模式大改（可牵手、多结局）、朋友圈可点赞评论、背包物品真实可用、处分模块、男生下课打架、教师工作台、金钱真正有用、117 个主动事件。\n' +
      '【修复】修复字体乱动、名声反复弹窗、点不了上课、聊天返回不了、选衣服 bug 等十余处问题。\n\n' +
      '祝玩得开心。—— 张逸天';
    /* insert directly (base pushMail is not on window) */
    g.mail.unshift({
      id: 'm590',
      from: '系统',
      sub: '📬 欢迎更新到 5.9「万卷」',
      body: body,
      read: false,
      time: '2026-10-25'
    });
    if (g.mail.length > 40) g.mail = g.mail.slice(0, 40);
    try { if (typeof window.mailRefresh === 'function') window.mailRefresh(); } catch (e) {}
  }

  /* ============================================================
     expose + boot
     ============================================================ */
  X.Calendar = { open: openCalendar };
  X.Misc = { openHub: openHub, spawnPetal: spawnPetal, ensureChatBack: ensureChatBack };

  function boot() {
    buildHubFab();
    buildRowButtons();
    tameBasePetals();
    startPetals590();
    installTimeGuard();
    T.setInterval(function () {
      try { ensureChatBack(); } catch (e) {}
      try { labelContinueModes(); } catch (e) {}
      try { pushVersionMail(); } catch (e) {}
    }, 3000);
  }
  T.setTimeout(boot, 1500);
  T.setInterval(buildHubFab, 5000);
  T.setInterval(buildRowButtons, 5000);
})();

