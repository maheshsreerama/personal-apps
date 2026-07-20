/* Learn Java — offline concept reader with runnable examples. */
(function () {
  "use strict";

  var chapters = window.CHAPTERS || [];
  var byId = {};
  chapters.forEach(function (c, i) { c.index = i; byId[c.id] = c; });

  var $home = document.getElementById("home");
  var $reader = document.getElementById("reader");
  var $content = document.getElementById("content");
  var $list = document.getElementById("chapterList");
  var $search = document.getElementById("search");
  var $barTitle = document.getElementById("barTitle");
  var $backBtn = document.getElementById("backBtn");
  var $themeBtn = document.getElementById("themeBtn");
  var $prevBtn = document.getElementById("prevBtn");
  var $nextBtn = document.getElementById("nextBtn");

  /* ---------- theme ---------- */
  function currentTheme() {
    var saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  var mermaidSeq = 0;
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: t === "dark" ? "dark" : "default",
      fontFamily: "-apple-system, Roboto, sans-serif",
      // natural size + horizontal scroll beats shrunk-to-fit on a phone
      flowchart: { useMaxWidth: false },
      sequence: { useMaxWidth: false },
      state: { useMaxWidth: false },
      class: { useMaxWidth: false },
      gantt: { useMaxWidth: false }
    });
  }
  applyTheme(currentTheme());
  $themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
    var m = location.hash.match(/^#\/c\/(.+)$/);
    if (m && byId[decodeURIComponent(m[1])]) renderChapter(byId[decodeURIComponent(m[1])]); // re-render diagrams in new theme
  });

  /* ---------- read-state ---------- */
  function isRead(id) { return localStorage.getItem("read:" + id) === "1"; }
  function markRead(id) { localStorage.setItem("read:" + id, "1"); }

  /* ---------- home list ---------- */
  function snippetFor(c, q) {
    var idx = c.md.toLowerCase().indexOf(q);
    if (idx < 0) return "";
    var s = c.md.substring(Math.max(0, idx - 40), idx + 80).replace(/[#`>*|\n]/g, " ").replace(/\s+/g, " ").trim();
    return "…" + s + "…";
  }

  function renderHome(query) {
    var q = (query || "").trim().toLowerCase();
    $list.innerHTML = "";
    var lastPart = null, shown = 0;
    chapters.forEach(function (c) {
      var titleHit = c.title.toLowerCase().indexOf(q) >= 0;
      var bodyHit = q.length >= 3 && c.md.toLowerCase().indexOf(q) >= 0;
      if (q && !titleHit && !bodyHit) return;
      if (c.part !== lastPart) {
        lastPart = c.part;
        var h = document.createElement("div");
        h.className = "part-header";
        h.textContent = c.part;
        $list.appendChild(h);
      }
      var card = document.createElement("div");
      card.className = "chapter-card";
      var check = document.createElement("span");
      check.className = "check";
      check.textContent = isRead(c.id) ? "✓" : "";
      var t = document.createElement("div");
      t.className = "t";
      t.textContent = c.title;
      if (q && !titleHit && bodyHit) {
        var sn = document.createElement("div");
        sn.className = "snippet";
        sn.textContent = snippetFor(c, q);
        t.appendChild(sn);
      }
      card.appendChild(check);
      card.appendChild(t);
      card.addEventListener("click", function () { location.hash = "#/c/" + encodeURIComponent(c.id); });
      $list.appendChild(card);
      shown++;
    });
    if (!shown) {
      var e = document.createElement("div");
      e.className = "empty";
      e.textContent = "No chapters match “" + query + "”";
      $list.appendChild(e);
    }
  }
  $search.addEventListener("input", function () { renderHome($search.value); });

  /* ---------- chapter rendering ---------- */
  function renderChapter(c) {
    $content.innerHTML = marked.parse(c.md);

    // tables → scrollable wrappers
    Array.prototype.slice.call($content.querySelectorAll("table")).forEach(function (tb) {
      var w = document.createElement("div");
      w.className = "table-wrap";
      tb.parentNode.insertBefore(w, tb);
      w.appendChild(tb);
    });

    // ```mermaid blocks → rendered SVG diagrams
    var blocks = Array.prototype.slice.call($content.querySelectorAll("code.language-mermaid"));
    blocks.forEach(function (code) {
      var pre = code.parentNode;
      var wrap = document.createElement("div");
      wrap.className = "mermaid-wrap";
      var div = document.createElement("div");
      div.className = "mermaid";
      div.id = "mmd-" + (++mermaidSeq);
      div.textContent = code.textContent;
      wrap.appendChild(div);
      pre.parentNode.replaceChild(wrap, pre);
    });
    var nodes = Array.prototype.slice.call($content.querySelectorAll(".mermaid"));
    if (nodes.length) {
      try {
        mermaid.run({ nodes: nodes }).catch(function (e) { console.error("mermaid", e); });
      } catch (e) { console.error("mermaid", e); }
    }

    // pager
    $prevBtn.disabled = c.index === 0;
    $nextBtn.disabled = c.index === chapters.length - 1;
    $prevBtn.onclick = function () {
      if (c.index > 0) location.hash = "#/c/" + encodeURIComponent(chapters[c.index - 1].id);
    };
    $nextBtn.onclick = function () {
      if (c.index < chapters.length - 1) location.hash = "#/c/" + encodeURIComponent(chapters[c.index + 1].id);
    };

    markRead(c.id);
  }

  /* ---------- internal .md links become app navigation ---------- */
  document.addEventListener("click", function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest("a") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (/^https?:\/\//.test(href)) return;         // external → WebView/Intent handles
    ev.preventDefault();
    var clean = href.split("#")[0].replace(/^\.\//, "");
    if (!clean.endsWith(".md")) return;
    // resolve relative to current chapter's directory
    var m = location.hash.match(/^#\/c\/(.+)$/);
    var baseDir = "";
    if (m) {
      var cur = byId[decodeURIComponent(m[1])];
      if (cur && cur.path.indexOf("/") >= 0) baseDir = cur.path.substring(0, cur.path.lastIndexOf("/") + 1);
    }
    var target = clean.indexOf("/") >= 0 ? clean : baseDir + clean;
    var id = target === "README.md" ? "readme" : target.replace(/\.md$/, "");
    if (byId[id]) location.hash = "#/c/" + encodeURIComponent(id);
  });

  /* ---------- router ---------- */
  function route() {
    var m = location.hash.match(/^#\/c\/(.+)$/);
    var c = m ? byId[decodeURIComponent(m[1])] : null;
    if (c) {
      $home.hidden = true;
      $reader.hidden = false;
      $backBtn.hidden = false;
      $barTitle.textContent = c.title;
      renderChapter(c);
      window.scrollTo(0, 0);
    } else {
      $reader.hidden = true;
      $home.hidden = false;
      $backBtn.hidden = true;
      $barTitle.textContent = "Learn Java";
      renderHome($search.value);
      $content.innerHTML = "";
    }
  }
  $backBtn.addEventListener("click", function () { location.hash = ""; });
  window.addEventListener("hashchange", route);
  route();
})();
