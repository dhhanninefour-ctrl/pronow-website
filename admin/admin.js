/* ===================================================================
   PRONOW — admin.js
   Login + homepage content editor (text / images / links / icons).
   Saves everything into Supabase (site_content.content JSON).
   =================================================================== */
(function () {
  "use strict";

  var CFG = window.PRONOW_SUPABASE;
  var sb = window.supabase.createClient(CFG.url, CFG.key);

  // Supabase logs in with an email, but the user wants to type "admin".
  // Map simple usernames to the real account email behind the scenes.
  var ID_MAP = { "admin": "pronow25@gmail.com" };
  function resolveEmail(id) {
    id = (id || "").trim();
    if (id.indexOf("@") !== -1) return id;            // already an email
    return ID_MAP[id.toLowerCase()] || id;            // map "admin" -> real email
  }

  // ---- which top-level i18n section maps to which friendly title ----
  var GROUPS = {
    meta:    "검색 / SEO",
    nav:     "메뉴",
    hero:    "첫 화면 (히어로)",
    about:   "회사 소개",
    profile: "회사 정보",
    players: "선수",
    svc:     "서비스",
    net:     "네트워크",
    works:   "활동 / 실적",
    contact: "문의",
    footer:  "푸터"
  };
  var GROUP_ORDER = ["meta","nav","hero","about","profile","players","svc","net","works","contact","footer"];

  // ---- editable image slots (data-img names on the site) ----
  var IMAGE_SLOTS = [
    { name: "hero-court",          label: "첫 화면 배경" },
    { name: "player-jeongyunseong",label: "정윤성" },
    { name: "player-parkuiseong",  label: "박의성" },
    { name: "player-hanseonyong",  label: "한선용" },
    { name: "player-anyujin",      label: "안유진" },
    { name: "player-eeunji",       label: "이은지" },
    { name: "court-1",             label: "코트 사진 1" },
    { name: "court-2",             label: "코트 사진 2" },
    { name: "court-3",             label: "코트 사진 3" },
    { name: "work-sponsorship",    label: "활동 · 스폰서십" },
    { name: "work-sns",            label: "활동 · SNS 콘텐츠" },
    { name: "work-event",          label: "활동 · 대회/클래스" },
    { name: "work-mega",           label: "활동 · 메가 이벤트" }
  ];
  var ICON_DEFAULTS = { svc1: "🤝", svc2: "🎾", svc3: "📡" };
  var LINK_DEFAULTS = {
    email: "pronow25@gmail.com",
    instagram: "https://www.instagram.com/pronowsportsagency",
    youtube: ""
  };

  // working state
  var current = {};          // last loaded content from DB
  var pendingImages = {};    // name -> uploaded public URL (this session)

  // ---- tiny DOM helpers ----
  function $(id) { return document.getElementById(id); }
  function show(el, on) { if (el) el.hidden = !on; }
  function setMsg(el, text, kind) {
    if (!el) return;
    el.textContent = text || "";
    el.className = "msg" + (kind ? " " + kind : "");
  }
  function esc(s) { return String(s == null ? "" : s); }

  /* ================= AUTH ================= */
  function route() {
    sb.auth.getSession().then(function (res) {
      var session = res && res.data ? res.data.session : null;
      show($("loading"), false);
      if (session) enterEditor(session);
      else showLogin();
    });
  }

  function showLogin() {
    show($("loginPanel"), true);
    show($("editorPanel"), false);
    show($("recoveryPanel"), false);
    show($("topActions"), false);
  }

  function showRecovery() {
    show($("loginPanel"), false);
    show($("editorPanel"), false);
    show($("recoveryPanel"), true);
    show($("topActions"), false);
    show($("loading"), false);
  }

  function enterEditor(session) {
    show($("loginPanel"), false);
    show($("recoveryPanel"), false);
    show($("editorPanel"), true);
    show($("topActions"), true);
    var em = session && session.user ? session.user.email : "";
    if ($("acctEmail")) $("acctEmail").textContent = em || "—";
    loadContent();
  }

  sb.auth.onAuthStateChange(function (event) {
    if (event === "PASSWORD_RECOVERY") showRecovery();
  });

  function doLogin() {
    var email = resolveEmail($("loginEmail").value);
    var pw = $("loginPassword").value;
    if (!email || !pw) { setMsg($("loginMsg"), "아이디와 비밀번호를 입력하세요.", "err"); return; }
    setMsg($("loginMsg"), "로그인 중…");
    sb.auth.signInWithPassword({ email: email, password: pw }).then(function (res) {
      if (res.error) { setMsg($("loginMsg"), "로그인 실패: " + res.error.message, "err"); return; }
      setMsg($("loginMsg"), "");
      enterEditor(res.data.session);
    });
  }

  function doForgot() {
    var email = resolveEmail($("loginEmail").value) || LINK_DEFAULTS.email;
    if (email.indexOf("@") === -1) email = LINK_DEFAULTS.email; // "admin" with no mapping -> company email
    setMsg($("loginMsg"), email + " 으로 복구 메일을 보내는 중…");
    var redirect = location.origin + location.pathname;
    sb.auth.resetPasswordForEmail(email, { redirectTo: redirect }).then(function (res) {
      if (res.error) { setMsg($("loginMsg"), "전송 실패: " + res.error.message, "err"); return; }
      setMsg($("loginMsg"), "복구 메일을 보냈습니다. 메일의 링크를 열어 새 비밀번호를 설정하세요.", "ok");
    });
  }

  function doRecoverySave() {
    var pw = $("recoveryPassword").value;
    if (!pw || pw.length < 6) { setMsg($("recoveryMsg"), "6자 이상 입력하세요.", "err"); return; }
    setMsg($("recoveryMsg"), "변경 중…");
    sb.auth.updateUser({ password: pw }).then(function (res) {
      if (res.error) { setMsg($("recoveryMsg"), "변경 실패: " + res.error.message, "err"); return; }
      setMsg($("recoveryMsg"), "변경되었습니다. 편집 화면으로 이동합니다…", "ok");
      sb.auth.getSession().then(function (r) { enterEditor(r.data.session); });
    });
  }

  function doLogout() {
    sb.auth.signOut().then(showLogin);
  }

  function doChangePw() {
    var pw = $("newPassword").value;
    if (!pw || pw.length < 6) { setMsg($("pwMsg"), "6자 이상 입력하세요.", "err"); return; }
    setMsg($("pwMsg"), "변경 중…");
    sb.auth.updateUser({ password: pw }).then(function (res) {
      if (res.error) { setMsg($("pwMsg"), "변경 실패: " + res.error.message, "err"); return; }
      $("newPassword").value = "";
      setMsg($("pwMsg"), "비밀번호가 변경되었습니다.", "ok");
    });
  }

  /* ================= LOAD + BUILD EDITOR ================= */
  function loadContent() {
    sb.from(CFG.table).select("content").eq("id", CFG.rowId).single().then(function (res) {
      current = (res && res.data && res.data.content) ? res.data.content : {};
      pendingImages = Object.assign({}, current.images || {});
      buildText();
      buildImages();
      buildLinks();
      buildIcons();
    });
  }

  function curText(lang, key) {
    if (current.text && current.text[lang] && current.text[lang][key] != null) return current.text[lang][key];
    return (I18N[lang] && I18N[lang][key] != null) ? I18N[lang][key] : "";
  }

  function buildText() {
    var host = $("textGroups");
    host.innerHTML = "";
    var keys = Object.keys(I18N.ko);
    GROUP_ORDER.forEach(function (seg) {
      var groupKeys = keys.filter(function (k) { return k.split(".")[0] === seg; });
      if (!groupKeys.length) return;
      var det = document.createElement("details");
      det.className = "tgroup";
      if (seg === "hero") det.open = true;
      var sum = document.createElement("summary");
      sum.textContent = GROUPS[seg] || seg;
      det.appendChild(sum);
      var body = document.createElement("div");
      body.className = "tgroup-body";
      groupKeys.forEach(function (key) {
        var field = document.createElement("div");
        field.className = "field";
        field.innerHTML =
          '<div class="fkey">' + esc(key) + '</div>' +
          '<div class="row"><span class="lng">KO</span>' +
            '<textarea data-tkey="' + esc(key) + '" data-lang="ko"></textarea></div>' +
          '<div class="row"><span class="lng">EN</span>' +
            '<textarea data-tkey="' + esc(key) + '" data-lang="en"></textarea></div>';
        body.appendChild(field);
        field.querySelector('[data-lang="ko"]').value = curText("ko", key);
        field.querySelector('[data-lang="en"]').value = curText("en", key);
      });
      det.appendChild(body);
      host.appendChild(det);
    });
  }

  function slotPreviewUrl(name) {
    if (pendingImages[name]) return pendingImages[name];
    return "../assets/images/" + name + ".jpg";
  }

  function buildImages() {
    var grid = $("imageGrid");
    grid.innerHTML = "";
    IMAGE_SLOTS.forEach(function (slot) {
      var cell = document.createElement("div");
      cell.className = "img-cell";
      cell.innerHTML =
        '<div class="thumb" id="thumb-' + slot.name + '"></div>' +
        '<div class="ilabel">' + esc(slot.label) + '</div>' +
        '<label class="upbtn">사진 올리기' +
          '<input type="file" accept="image/*" data-slot="' + slot.name + '"></label>' +
        '<div class="ustatus" id="ust-' + slot.name + '"></div>';
      grid.appendChild(cell);
      var thumb = cell.querySelector(".thumb");
      var bg = new Image();
      var url = slotPreviewUrl(slot.name);
      bg.onload = function () { thumb.style.backgroundImage = "url('" + url + "')"; thumb.textContent = ""; };
      bg.onerror = function () { thumb.textContent = "사진 없음"; };
      bg.src = url;
      cell.querySelector("input[type=file]").addEventListener("change", onUpload);
    });
  }

  function onUpload(e) {
    var input = e.target;
    var slot = input.getAttribute("data-slot");
    var file = input.files && input.files[0];
    if (!file) return;
    var status = $("ust-" + slot);
    setMsg(status, "업로드 중…");
    var ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    var path = slot + "-" + Date.now() + "." + ext;
    sb.storage.from(CFG.bucket).upload(path, file, { upsert: true, cacheControl: "3600" }).then(function (res) {
      if (res.error) { setMsg(status, "실패: " + res.error.message, "err"); return; }
      var pub = sb.storage.from(CFG.bucket).getPublicUrl(path);
      var url = pub.data.publicUrl;
      pendingImages[slot] = url;
      var thumb = $("thumb-" + slot);
      thumb.style.backgroundImage = "url('" + url + "')";
      thumb.textContent = "";
      setMsg(status, "올림 완료 — '저장'을 누르세요", "ok");
    });
  }

  function buildLinks() {
    var L = current.links || {};
    $("link-email").value = (L.email != null) ? L.email : LINK_DEFAULTS.email;
    $("link-instagram").value = (L.instagram != null) ? L.instagram : LINK_DEFAULTS.instagram;
    $("link-youtube").value = (L.youtube != null) ? L.youtube : LINK_DEFAULTS.youtube;
  }

  function buildIcons() {
    var I = current.icons || {};
    $("icon-svc1").value = (I.svc1 != null && I.svc1 !== "") ? I.svc1 : ICON_DEFAULTS.svc1;
    $("icon-svc2").value = (I.svc2 != null && I.svc2 !== "") ? I.svc2 : ICON_DEFAULTS.svc2;
    $("icon-svc3").value = (I.svc3 != null && I.svc3 !== "") ? I.svc3 : ICON_DEFAULTS.svc3;
  }

  /* ================= SAVE ================= */
  function collect() {
    // text: store only values that differ from the built-in default
    var text = { ko: {}, en: {} };
    document.querySelectorAll('#textGroups textarea').forEach(function (ta) {
      var key = ta.getAttribute("data-tkey");
      var lang = ta.getAttribute("data-lang");
      var val = ta.value;
      var def = (I18N[lang] && I18N[lang][key] != null) ? I18N[lang][key] : "";
      if (val !== def) text[lang][key] = val;
    });

    var links = {
      email: $("link-email").value.trim(),
      instagram: $("link-instagram").value.trim(),
      youtube: $("link-youtube").value.trim()
    };
    var icons = {
      svc1: $("icon-svc1").value.trim(),
      svc2: $("icon-svc2").value.trim(),
      svc3: $("icon-svc3").value.trim()
    };
    return { text: text, images: pendingImages, links: links, icons: icons };
  }

  function doSave() {
    var content = collect();
    setMsg($("saveMsg"), "저장 중…");
    sb.from(CFG.table).upsert({
      id: CFG.rowId,
      content: content,
      updated_at: new Date().toISOString()
    }).then(function (res) {
      if (res.error) { setMsg($("saveMsg"), "저장 실패: " + res.error.message, "err"); return; }
      current = content;
      setMsg($("saveMsg"), "저장되었습니다! 홈페이지에 반영됩니다.", "ok");
    });
  }

  /* ================= TABS ================= */
  function initTabs() {
    document.querySelectorAll(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        var name = tab.getAttribute("data-tab");
        document.querySelectorAll(".tab").forEach(function (t) { t.classList.toggle("is-active", t === tab); });
        document.querySelectorAll(".panel").forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute("data-panel") === name);
        });
      });
    });
  }

  /* ================= INIT ================= */
  function init() {
    initTabs();
    $("loginBtn").addEventListener("click", doLogin);
    $("loginPassword").addEventListener("keydown", function (e) { if (e.key === "Enter") doLogin(); });
    $("forgotBtn").addEventListener("click", doForgot);
    $("recoverySaveBtn").addEventListener("click", doRecoverySave);
    $("logoutBtn").addEventListener("click", doLogout);
    $("changePwBtn").addEventListener("click", doChangePw);
    $("saveBtn").addEventListener("click", doSave);
    route();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
