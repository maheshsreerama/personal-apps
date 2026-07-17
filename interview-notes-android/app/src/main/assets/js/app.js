/* Initialise mermaid for offline rendering inside the WebView. */
(function () {
  var dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: true,
      theme: dark ? "dark" : "neutral",
      securityLevel: "loose",
      flowchart: { useMaxWidth: true, htmlLabels: true }
    });
  }
})();
