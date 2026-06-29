/* ===================================================================
   PRONOW — cms.js
   Public-site content overlay.
   Loads the latest content saved in the admin page (Supabase) and
   overlays it ON TOP of the built-in defaults. If Supabase is slow or
   unreachable, the site simply shows the defaults — it never breaks.

   Override shape (stored as JSON in site_content.content):
   {
     "text":   { "ko": { "<i18n key>": "..." }, "en": { ... } },
     "images": { "<data-img name>": "https://.../file.jpg" },
     "links":  { "email": "...", "instagram": "...", "youtube": "..." },
     "icons":  { "svc1": "🤝", "svc2": "🎾", "svc3": "📡" }
   }
   =================================================================== */
(function () {
  "use strict";

  function getClient() {
    var cfg = window.PRONOW_SUPABASE;
    if (!cfg || !window.supabase || !window.supabase.createClient) return null;
    return window.supabase.createClient(cfg.url, cfg.key);
  }

  function applyText(text) {
    if (!text || typeof I18N === "undefined") return;
    ["ko", "en"].forEach(function (lang) {
      if (text[lang] && I18N[lang]) {
        Object.keys(text[lang]).forEach(function (k) {
          var v = text[lang][k];
          if (v != null && v !== "") I18N[lang][k] = v;
        });
      }
    });
    // re-render in the currently selected language
    var cur = "ko";
    try { cur = localStorage.getItem("pronow_lang") || "ko"; } catch (e) {}
    if (typeof applyLang === "function") applyLang(cur);
  }

  function applyImages(images) {
    if (!images) return;
    Object.keys(images).forEach(function (name) {
      var url = images[name];
      if (!url) return;
      document.querySelectorAll('[data-img="' + name + '"]').forEach(function (el) {
        el.dataset.cmsImg = "1"; // tells main.js not to overwrite with a local file
        el.style.backgroundImage = "url('" + url + "')";
        el.classList.add("has-img");
      });
    });
  }

  function applyLinks(links) {
    if (!links) return;
    if (links.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
        a.href = "mailto:" + links.email;
        var v = a.querySelector(".contact-val");
        if (v) v.textContent = links.email;
      });
    }
    setSocial("instagram", links.instagram);
    setSocial("youtube", links.youtube);
  }

  function setSocial(kind, url) {
    if (url === undefined) return;
    document.querySelectorAll('[data-social="' + kind + '"]').forEach(function (a) {
      if (url) {
        a.href = url;
        a.classList.remove("social-link-pending");
        a.removeAttribute("aria-disabled");
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      } else {
        a.href = "#";
        a.classList.add("social-link-pending");
        a.setAttribute("aria-disabled", "true");
      }
    });
  }

  function applyIcons(icons) {
    if (!icons) return;
    Object.keys(icons).forEach(function (k) {
      var v = icons[k];
      if (v == null || v === "") return;
      document.querySelectorAll('[data-icon="' + k + '"]').forEach(function (el) {
        el.textContent = v;
      });
    });
  }

  function applyContent(c) {
    if (!c || typeof c !== "object") return;
    applyText(c.text);
    applyImages(c.images);
    applyLinks(c.links);
    applyIcons(c.icons);
  }

  function load() {
    var sb = getClient();
    if (!sb) return;
    var cfg = window.PRONOW_SUPABASE;
    sb.from(cfg.table).select("content").eq("id", cfg.rowId).single()
      .then(function (res) {
        if (res && res.data && res.data.content) applyContent(res.data.content);
      })
      .catch(function () { /* keep defaults */ });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
