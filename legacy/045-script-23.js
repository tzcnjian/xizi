
/* [X590-OPT] 性能：全量图片异步解码 + 新图自动异步解码，降低主线程解码压力 */
(function () {
  function tune(img) { if (img && img.setAttribute && !img.hasAttribute('decoding')) { img.setAttribute('decoding', 'async'); } }
  function scan() { try { var ls = document.querySelectorAll('img:not([decoding])'); for (var i = 0; i < ls.length; i++) tune(ls[i]); } catch (e) {} }
  scan();
  if (typeof MutationObserver !== 'undefined') {
    var mo = new MutationObserver(function (muts) {
      for (var k = 0; k < muts.length; k++) {
        var added = muts[k].addedNodes || [];
        for (var j = 0; j < added.length; j++) {
          var n = added[j];
          if (n && n.tagName === 'IMG') tune(n);
          else if (n && n.querySelectorAll) { var imgs = n.querySelectorAll('img'); for (var m = 0; m < imgs.length; m++) tune(imgs[m]); }
        }
      }
      scan();
    });
    try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
  }
  window.addEventListener('load', scan);
})();
