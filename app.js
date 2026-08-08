/*! app.js — logic trang chính (index.html) của Zurika Link Hub */
(function () {
  "use strict";
  var Z = window.ZDB;
  var db = Z.load();

  var state = {
    filter: { view: "all", categoryId: "all" }, // view: all | starred | recent
    search: "",
    sort: "name",
    viewMode: "grid",
    reminderIndex: 0,
    reminderAuto: true,
    editingId: null,
    tagsDraft: [],
    ctxLinkId: null,
    confirmCb: null
  };

  var $ = function (id) { return document.getElementById(id); };
  var qs = function (sel, root) { return (root || document).querySelector(sel); };
  var qsa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ================= TOAST ================= */
  function toast(msg, type, ms) {
    var region = $("toast-region");
    var el = document.createElement("div");
    el.className = "toast" + (type ? " toast-" + type : "");
    var icon = type === "success" ? "fa-circle-check" : type === "error" ? "fa-circle-exclamation" : "fa-circle-info";
    el.innerHTML = '<i class="fa-solid ' + icon + '"></i><span></span><button class="toast-close" aria-label="Đóng"><i class="fa-solid fa-xmark"></i></button>';
    el.querySelector("span").textContent = msg;
    region.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    var remove = function () {
      el.classList.remove("show");
      setTimeout(function () { el.remove(); }, 280);
    };
    el.querySelector(".toast-close").addEventListener("click", remove);
    var timer = setTimeout(remove, ms || 3200);
    el.addEventListener("mouseenter", function () { clearTimeout(timer); });
  }

  /* ================= THEME / ACCENT ================= */
  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(function (c) { return c + c; }).join("");
    var num = parseInt(hex, 16);
    return (num >> 16 & 255) + "," + (num >> 8 & 255) + "," + (num & 255);
  }
  function applyTheme(theme, persist) {
    document.documentElement.setAttribute("data-theme", theme);
    $("btnTheme").innerHTML = theme === "dark" ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    $("toggleDark").classList.toggle("on", theme === "dark");
    if (persist) { db.settings.theme = theme; Z.save(db); }
  }
  function applyAccent(hex, persist) {
    document.documentElement.style.setProperty("--accent", hex);
    document.documentElement.style.setProperty("--accent-rgb", hexToRgb(hex));
    qsa(".swatch").forEach(function (s) { s.classList.toggle("active", s.dataset.color.toLowerCase() === hex.toLowerCase()); });
    if (persist) { db.settings.accent = hex; Z.save(db); }
  }

  var ACCENT_PRESETS = ["#E8952F", "#5B5FEF", "#2FB8AC", "#E8617C", "#8A9A5B", "#9C6ADE", "#4FA7D9"];
  function buildAccentSwatches() {
    var wrap = $("accentSwatches");
    wrap.innerHTML = "";
    ACCENT_PRESETS.forEach(function (hex) {
      var b = document.createElement("button");
      b.className = "swatch"; b.style.background = hex; b.dataset.color = hex; b.title = hex;
      b.addEventListener("click", function () { applyAccent(hex, true); });
      wrap.appendChild(b);
    });
    var custom = document.createElement("label");
    custom.className = "swatch swatch-custom"; custom.title = "Tuỳ chỉnh";
    custom.innerHTML = '<i class="fa-solid fa-eye-dropper"></i>';
    var inp = document.createElement("input");
    inp.type = "color"; inp.value = db.settings.accent || "#E8952F";
    inp.addEventListener("input", function () { applyAccent(inp.value, true); });
    custom.appendChild(inp);
    wrap.appendChild(custom);
  }

  /* ================= STAT PILLS ================= */
  function visibleLinks() {
    return db.links.filter(function (l) { return db.settings.showHidden || l.categoryId !== "zz"; });
  }
  function renderStatPills() {
    var all = visibleLinks();
    var starred = all.filter(function (l) { return l.starred; }).length;
    var recent = all.filter(function (l) { return l.lastViewedAt; }).length;
    var defs = [
      { view: "all", icon: "fa-layer-group", label: "Tất cả", count: all.length },
      { view: "starred", icon: "fa-star", label: "Đã đánh dấu", count: starred },
      { view: "recent", icon: "fa-clock-rotate-left", label: "Xem gần đây", count: recent }
    ];
    var wrap = $("statPills");
    wrap.innerHTML = "";
    defs.forEach(function (d) {
      var b = document.createElement("button");
      b.className = "stat-pill" + (state.filter.view === d.view ? " active" : "");
      b.innerHTML = '<i class="fa-solid ' + d.icon + '"></i><span>' + d.label + "</span><b class=\"mono\">" + d.count + "</b>";
      b.addEventListener("click", function () {
        state.filter.view = d.view;
        if (d.view === "all") state.filter.categoryId = "all";
        render();
      });
      wrap.appendChild(b);
    });
  }

  /* ================= CATEGORY RAIL ================= */
  function renderCategoryRail() {
    var wrap = $("categoryRail");
    wrap.innerHTML = "";
    var all = visibleLinks();
    db.categories.forEach(function (cat) {
      if (cat.id === "zz" && !db.settings.showHidden) return;
      var count = all.filter(function (l) { return l.categoryId === cat.id; }).length;
      var b = document.createElement("button");
      b.className = "cat-tab" + (state.filter.categoryId === cat.id ? " active" : "");
      b.style.setProperty("--dot-color", cat.color);
      b.innerHTML = '<span class="dot"></span><i class="' + cat.icon + '"></i><span>' + cat.name + '</span><span class="count mono">' + count + "</span>";
      b.addEventListener("click", function () {
        state.filter.categoryId = state.filter.categoryId === cat.id ? "all" : cat.id;
        render();
      });
      wrap.appendChild(b);
    });
  }

  /* ================= FILTER / SORT ================= */
  function getFilteredLinks() {
    var f = state.filter, q = state.search;
    var list = db.links.filter(function (l) {
      if (l.categoryId === "zz" && !db.settings.showHidden) return false;
      if (f.categoryId !== "all" && l.categoryId !== f.categoryId) return false;
      if (f.view === "starred" && !l.starred) return false;
      if (f.view === "recent" && !l.lastViewedAt) return false;
      if (q) {
        var hay = Z.normalizeSearch([l.title, l.desc, (l.tags || []).join(" "), l.url].join(" "));
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
    if (f.view === "recent") {
      list.sort(function (a, b) { return (b.lastViewedAt || 0) - (a.lastViewedAt || 0); });
    } else {
      switch (state.sort) {
        case "name": list.sort(function (a, b) { return a.title.localeCompare(b.title, "vi"); }); break;
        case "viewed": list.sort(function (a, b) { return (b.viewCount || 0) - (a.viewCount || 0); }); break;
        case "updated": list.sort(function (a, b) { return b.updatedAt - a.updatedAt; }); break;
        default: list.sort(function (a, b) { return b.createdAt - a.createdAt; });
      }
    }
    return list;
  }

  function categoryOf(id) { return db.categories.find(function (c) { return c.id === id; }); }

  /* ================= FAVICON ================= */
  function faviconSrc(link) {
    if (link.icon) return link.icon;
    if (/^file:\/\//i.test(link.url)) return null;
    if (!Z.isValidURL(link.url)) return null;
    try {
      var domain = new URL(link.url).hostname;
      return "https://www.google.com/s2/favicons?sz=64&domain=" + domain;
    } catch (e) { return null; }
  }

  /* ================= GRID / CARD ================= */
  var pressTimers = new WeakMap();

  function buildCard(link, index) {
    var cat = categoryOf(link.categoryId) || { color: "var(--accent)", icon: "fa-solid fa-tag", name: "" };
    var card = document.createElement("div");
    card.className = "link-card fade-up";
    card.style.setProperty("--cat-color", cat.color);
    card.style.animationDelay = Math.min(index * 25, 260) + "ms";
    card.setAttribute("data-id", link.id);

    var top = document.createElement("div"); top.className = "lc-top";
    var iconWrap = document.createElement("div"); iconWrap.className = "lc-icon";
    var src = faviconSrc(link);
    if (src) {
      var img = document.createElement("img"); img.src = src; img.alt = "";
      img.onerror = function () {
        img.remove();
        iconWrap.appendChild(fallbackIconEl(cat));
      };
      iconWrap.appendChild(img);
    } else {
      iconWrap.appendChild(fallbackIconEl(cat));
    }
    var starBtn = document.createElement("button");
    starBtn.className = "star-btn" + (link.starred ? " active" : "");
    starBtn.innerHTML = '<i class="fa-solid fa-star"></i>';
    starBtn.title = link.starred ? "Bỏ đánh dấu" : "Đánh dấu";
    starBtn.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
    starBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      Z.toggleStar(db, link.id); Z.save(db);
      var nowActive = starBtn.classList.toggle("active");
      starBtn.title = nowActive ? "Bỏ đánh dấu" : "Đánh dấu";
      if (nowActive) {
        starBtn.classList.remove("just-starred"); void starBtn.offsetWidth; starBtn.classList.add("just-starred");
      }
      renderStatPills();
    });
    top.appendChild(iconWrap); top.appendChild(starBtn);

    var title = document.createElement("div"); title.className = "lc-title"; title.textContent = link.title;
    var desc = document.createElement("div"); desc.className = "lc-desc"; desc.textContent = link.desc || "";

    var tagsWrap = document.createElement("div"); tagsWrap.className = "lc-tags";
    (link.tags || []).slice(0, 4).forEach(function (t) {
      var c = document.createElement("span"); c.className = "chip"; c.textContent = "#" + t; tagsWrap.appendChild(c);
    });

    var meta = document.createElement("div"); meta.className = "lc-meta";
    meta.innerHTML = '<i class="' + cat.icon + '"></i><span>' + cat.name + "</span>";
    if (link.viewCount) {
      var vspan = document.createElement("span");
      vspan.style.marginLeft = "auto";
      vspan.innerHTML = '<i class="fa-solid fa-eye"></i> ' + link.viewCount;
      meta.appendChild(vspan);
    }

    card.appendChild(top); card.appendChild(title); card.appendChild(desc);
    if ((link.tags || []).length) card.appendChild(tagsWrap);
    card.appendChild(meta);

    wireCardInteractions(card, link);
    return card;
  }

  function fallbackIconEl(cat) {
    var i = document.createElement("i");
    i.className = cat.icon || "fa-solid fa-link";
    i.style.color = cat.color; i.style.fontSize = "17px";
    return i;
  }

  function wireCardInteractions(card, link) {
    var longPressFired = false, startX = 0, startY = 0, timer = null;
    card.addEventListener("pointerdown", function (e) {
      if (e.button === 2) return;
      longPressFired = false; startX = e.clientX; startY = e.clientY;
      timer = setTimeout(function () {
        longPressFired = true;
        openCtxMenu(link.id, startX, startY);
      }, 480);
    });
    card.addEventListener("pointermove", function (e) {
      if (timer && (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8)) { clearTimeout(timer); timer = null; }
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (evt) {
      card.addEventListener(evt, function () { if (timer) { clearTimeout(timer); timer = null; } });
    });
    card.addEventListener("click", function () {
      if (longPressFired) { longPressFired = false; return; }
      openLink(link);
    });
    card.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      openCtxMenu(link.id, e.clientX, e.clientY);
    });
  }

  var lastOpenAt = 0;
  function openLink(link) {
    var now = Date.now();
    if (now - lastOpenAt < 350) return;
    lastOpenAt = now;
    Z.touchView(db, link.id); Z.save(db);
    if (/^file:\/\//i.test(link.url)) {
      toast("Trình duyệt có thể chặn mở file cục bộ (file:///).", "info");
    }
    window.open(link.url, "_blank", "noopener");
    renderStatPills();
  }

  function renderGrid() {
    var grid = $("linkGrid");
    var list = getFilteredLinks();
    grid.innerHTML = "";
    grid.classList.toggle("list-mode", state.viewMode === "list");

    if (!list.length && !db.links.length) {
      $("emptyState").hidden = false;
      qs("#emptyState h4").textContent = "Chưa có liên kết nào ở đây";
      qs("#emptyState p").textContent = 'Nhấn "Thêm link" để bắt đầu lưu trữ.';
      return;
    }
    if (!list.length) {
      $("emptyState").hidden = false;
      qs("#emptyState h4").textContent = "Không tìm thấy kết quả";
      qs("#emptyState p").textContent = "Thử từ khoá khác hoặc bỏ bớt bộ lọc.";
      return;
    }
    $("emptyState").hidden = true;
    var frag = document.createDocumentFragment();
    list.forEach(function (link, i) { frag.appendChild(buildCard(link, i)); });

    if (!state.search) {
      var addCard = document.createElement("button");
      addCard.className = "add-card fade-up";
      addCard.style.animationDelay = Math.min(list.length * 25, 260) + "ms";
      addCard.innerHTML = '<i class="fa-solid fa-plus"></i><span>Thêm link</span>';
      addCard.addEventListener("click", function () { openLinkModal(null); });
      frag.appendChild(addCard);
    }
    grid.appendChild(frag);
  }

  function render() {
    renderStatPills();
    renderCategoryRail();
    renderGrid();
  }

  /* ================= CONTEXT MENU ================= */
  function openCtxMenu(linkId, x, y) {
    state.ctxLinkId = linkId;
    var link = db.links.find(function (l) { return l.id === linkId; });
    if (!link) return;
    var menu = $("ctxMenu");
    menu.innerHTML =
      '<button data-act="edit"><i class="fa-solid fa-pen"></i> Chỉnh sửa</button>' +
      '<button data-act="star" class="' + (link.starred ? "ctx-active" : "") + '"><i class="fa-solid fa-star"></i> ' + (link.starred ? "Bỏ đánh dấu" : "Đánh dấu") + "</button>" +
      '<button data-act="copy"><i class="fa-solid fa-copy"></i> Copy link</button>' +
      '<button data-act="open"><i class="fa-solid fa-arrow-up-right-from-square"></i> Mở link</button>' +
      "<hr>" +
      '<button data-act="delete" class="ctx-danger"><i class="fa-solid fa-trash"></i> Xoá</button>';

    qsa("button", menu).forEach(function (btn) {
      btn.addEventListener("click", function () { handleCtxAction(btn.dataset.act, link); });
    });

    var vw = window.innerWidth, vh = window.innerHeight;
    menu.style.left = Math.min(x, vw - 200) + "px";
    menu.style.top = Math.min(y, vh - 220) + "px";
    menu.classList.add("open");
  }
  function closeCtxMenu() { $("ctxMenu").classList.remove("open"); }

  function handleCtxAction(act, link) {
    closeCtxMenu();
    if (act === "edit") openLinkModal(link);
    else if (act === "star") { Z.toggleStar(db, link.id); Z.save(db); render(); }
    else if (act === "copy") {
      navigator.clipboard.writeText(link.url).then(function () { toast("Đã copy liên kết", "success"); })
        .catch(function () { toast("Không thể copy liên kết", "error"); });
    } else if (act === "open") { openLink(link); }
    else if (act === "delete") {
      openConfirm("Xoá liên kết?", 'Xoá "' + link.title + '" khỏi danh sách. Hành động này không thể hoàn tác.', function () {
        Z.deleteLink(db, link.id); Z.save(db); render();
        toast("Đã xoá liên kết", "success");
      });
    }
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest("#ctxMenu")) closeCtxMenu();
  });

  /* ================= CONFIRM MODAL (dùng chung) ================= */
  function openModal(id) { $(id).classList.add("open"); }
  function closeModal(id) { $(id).classList.remove("open"); }
  function openConfirm(title, body, cb) {
    $("confirmTitle").textContent = title;
    $("confirmBody").textContent = body;
    state.confirmCb = cb;
    openModal("confirmModalBackdrop");
  }
  $("btnConfirmOk").addEventListener("click", function () {
    closeModal("confirmModalBackdrop");
    if (state.confirmCb) { state.confirmCb(); state.confirmCb = null; }
  });
  qsa("[data-close]").forEach(function (btn) {
    btn.addEventListener("click", function () { closeModal(btn.dataset.close); });
  });
  qsa(".modal-backdrop").forEach(function (bd) {
    bd.addEventListener("click", function (e) { if (e.target === bd) closeModal(bd.id); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      qsa(".modal-backdrop.open").forEach(function (bd) { closeModal(bd.id); });
      closeCtxMenu();
      closeSettings();
    }
    if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault(); $("searchInput").focus();
    }
  });

  /* ================= ADD / EDIT LINK MODAL ================= */
  function fillCategorySelect(selectEl, selectedId) {
    selectEl.innerHTML = "";
    db.categories.forEach(function (c) {
      var o = document.createElement("option");
      o.value = c.id; o.textContent = c.name;
      if (c.id === selectedId) o.selected = true;
      selectEl.appendChild(o);
    });
  }
  function fillTimeSelects() {
    var dayEl = $("fReminderDay"); dayEl.innerHTML = "";
    Z.WEEKDAY_LABELS.forEach(function (label, idx) {
      var o = document.createElement("option"); o.value = idx; o.textContent = label; dayEl.appendChild(o);
    });
    var hourEl = $("fReminderHour"); hourEl.innerHTML = "";
    for (var h = 0; h < 24; h++) { var o1 = document.createElement("option"); o1.value = h; o1.textContent = h + " giờ"; hourEl.appendChild(o1); }
    var minEl = $("fReminderMinute"); minEl.innerHTML = "";
    for (var m = 0; m < 60; m++) { var o2 = document.createElement("option"); o2.value = m; o2.textContent = m + " phút"; minEl.appendChild(o2); }
  }
  fillTimeSelects();

  function renderTagChips() {
    var wrap = $("tagWrap");
    qsa(".tag-pill", wrap).forEach(function (p) { p.remove(); });
    state.tagsDraft.forEach(function (t) {
      var pill = document.createElement("span"); pill.className = "tag-pill";
      pill.innerHTML = "#" + t + ' <button type="button" aria-label="Xoá thẻ">&times;</button>';
      pill.querySelector("button").addEventListener("click", function () {
        state.tagsDraft = state.tagsDraft.filter(function (x) { return x !== t; });
        renderTagChips();
      });
      wrap.insertBefore(pill, $("fTagInput"));
    });
  }
  $("fTagInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      var v = e.target.value.trim().replace(/^#/, "").replace(/,/g, "");
      if (v && state.tagsDraft.indexOf(v) === -1) { state.tagsDraft.push(v); renderTagChips(); }
      e.target.value = "";
    } else if (e.key === "Backspace" && !e.target.value && state.tagsDraft.length) {
      state.tagsDraft.pop(); renderTagChips();
    }
  });

  $("fReminderOn").addEventListener("change", function () { $("reminderFields").hidden = !this.checked; });

  function openLinkModal(link) {
    state.editingId = link ? link.id : null;
    $("linkModalTitle").textContent = link ? "Chỉnh sửa liên kết" : "Thêm liên kết";
    $("fUrl").value = link ? link.url : "";
    $("fTitle").value = link ? link.title : "";
    $("fDesc").value = link ? link.desc : "";
    $("fIcon").value = link ? link.icon : "";
    $("fStarred").checked = link ? !!link.starred : false;
    state.tagsDraft = link ? (link.tags || []).slice() : [];
    renderTagChips();

    var defaultCat = link ? link.categoryId : (state.filter.categoryId !== "all" ? state.filter.categoryId : (categoryOf("khac") ? "khac" : db.categories[0].id));
    fillCategorySelect($("fCategory"), defaultCat);

    var hasReminder = !!(link && link.reminder);
    $("fReminderOn").checked = hasReminder;
    $("reminderFields").hidden = !hasReminder;
    if (hasReminder) {
      $("fReminderDay").value = link.reminder.weekday;
      $("fReminderHour").value = link.reminder.hour;
      $("fReminderMinute").value = link.reminder.minute;
    } else {
      $("fReminderDay").value = 1; $("fReminderHour").value = 20; $("fReminderMinute").value = 0;
    }

    qsa(".field", $("linkForm")).forEach(function (f) {
      var inp = qs("input,textarea", f);
      if (inp) f.classList.toggle("has-value", !!inp.value);
    });

    openModal("linkModalBackdrop");
    setTimeout(function () { $("fUrl").focus(); }, 60);
  }

  $("btnAddLink").addEventListener("click", function () { openLinkModal(null); });

  $("btnSaveLink").addEventListener("click", function () {
    var url = $("fUrl").value.trim();
    var categoryId = $("fCategory").value;
    var isFile = /^file:\/\/\//i.test(url);
    if (!url || (!isFile && !Z.isValidURL(url))) {
      toast("Đường dẫn không hợp lệ. URL cần bắt đầu bằng http(s):// hoặc file:///", "error");
      return;
    }
    var title = $("fTitle").value.trim() || url;
    var desc = $("fDesc").value.trim();
    var icon = $("fIcon").value.trim();
    var starred = $("fStarred").checked;
    var reminder = null;
    if ($("fReminderOn").checked) {
      reminder = { weekday: parseInt($("fReminderDay").value, 10), hour: parseInt($("fReminderHour").value, 10), minute: parseInt($("fReminderMinute").value, 10) };
    }
    var data = { url: url, title: title, desc: desc, categoryId: categoryId, tags: state.tagsDraft.slice(), icon: icon, starred: starred, reminder: reminder };

    if (state.editingId) { Z.updateLink(db, state.editingId, data); toast("Đã lưu thay đổi", "success"); }
    else { Z.addLink(db, data); toast("Đã thêm liên kết", "success"); }
    Z.save(db);
    closeModal("linkModalBackdrop");
    render();
    renderReminderBar();
  });

  qsa("#linkForm .field input, #linkForm .field textarea").forEach(function (inp) {
    inp.addEventListener("input", function () { inp.closest(".field").classList.toggle("has-value", !!inp.value); });
  });

  /* ================= SEARCH ================= */
  var searchInput = $("searchInput");
  searchInput.addEventListener("input", function () {
    state.search = Z.normalizeSearch(searchInput.value);
    $("searchBoxWrap").classList.toggle("has-value", !!searchInput.value);
    renderGrid();
  });
  $("clearSearch").addEventListener("click", function () {
    searchInput.value = ""; state.search = "";
    $("searchBoxWrap").classList.remove("has-value");
    renderGrid(); searchInput.focus();
  });

  /* ================= SORT / VIEW MODE ================= */
  $("sortSelect").value = "name";
  state.sort = "name";
  $("sortSelect").addEventListener("change", function () { state.sort = this.value; renderGrid(); });
  $("viewGrid").addEventListener("click", function () { state.viewMode = "grid"; this.classList.add("active"); $("viewList").classList.remove("active"); renderGrid(); });
  $("viewList").addEventListener("click", function () { state.viewMode = "list"; this.classList.add("active"); $("viewGrid").classList.remove("active"); renderGrid(); });

  /* ================= SETTINGS DRAWER ================= */
  function openSettings() {
    $("settingsDrawer").classList.add("open");
    $("settingsScrim").classList.add("open");
    $("settingsDrawer").setAttribute("aria-hidden", "false");
  }
  function closeSettings() {
    $("settingsDrawer").classList.remove("open");
    $("settingsScrim").classList.remove("open");
    $("settingsDrawer").setAttribute("aria-hidden", "true");
  }
  $("btnMenu").addEventListener("click", openSettings);
  $("btnCloseSettings").addEventListener("click", closeSettings);
  $("settingsScrim").addEventListener("click", closeSettings);

  $("btnTheme").addEventListener("click", function () {
    applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
  });
  $("toggleDark").addEventListener("click", function () {
    applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
  });

  function syncToggle(btn, on) { btn.classList.toggle("on", on); }

  $("toggleMouse").addEventListener("click", function () {
    db.settings.virtualMouse = !db.settings.virtualMouse; Z.save(db);
    syncToggle(this, db.settings.virtualMouse);
    applyVirtualMouseVisibility();
  });
  $("toggleHidden").addEventListener("click", function () {
    db.settings.showHidden = !db.settings.showHidden; Z.save(db);
    syncToggle(this, db.settings.showHidden);
    render();
  });

  $("bgInput").value = db.settings.background || "";
  $("btnBgApply").addEventListener("click", function () {
    var url = $("bgInput").value.trim();
    db.settings.background = url; Z.save(db);
    applyBackground();
    toast("Đã áp dụng ảnh nền", "success");
  });
  $("btnBgClear").addEventListener("click", function () {
    $("bgInput").value = ""; db.settings.background = ""; Z.save(db); applyBackground();
  });
  function applyBackground() {
    if (db.settings.background) {
      document.body.style.backgroundImage = "url('" + db.settings.background + "')";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.backgroundPosition = "center";
    } else {
      document.body.style.backgroundImage = "";
    }
  }

  /* ---- khoá mật khẩu ---- */
  function refreshLockStatus() {
    $("lockStatusText").textContent = db.settings.passwordHash ? "Đã bật — chạm để đổi mật khẩu" : "Chưa đặt mật khẩu";
    syncToggle($("toggleLock"), !!db.settings.passwordHash);
  }
  $("toggleLock").addEventListener("click", function () {
    if (db.settings.passwordHash) {
      openConfirm("Tắt khoá màn hình?", "Bạn sẽ không cần nhập mật khẩu để mở trang nữa.", function () {
        db.settings.passwordHash = null; Z.save(db); refreshLockStatus();
        toast("Đã tắt khoá màn hình", "success");
      });
    } else {
      $("fPass1").value = ""; $("fPass2").value = "";
      openModal("passModalBackdrop");
    }
  });
  $("lockStatusText").parentElement.addEventListener("click", function () {
    if (db.settings.passwordHash) { $("fPass1").value = ""; $("fPass2").value = ""; openModal("passModalBackdrop"); }
  });
  $("btnSavePass").addEventListener("click", function () {
    var p1 = $("fPass1").value, p2 = $("fPass2").value;
    if (p1.length < 4) { toast("Mật khẩu cần ít nhất 4 ký tự", "error"); return; }
    if (p1 !== p2) { toast("Hai mật khẩu không khớp", "error"); return; }
    db.settings.passwordHash = Z.hashPass(p1); Z.save(db);
    closeModal("passModalBackdrop"); refreshLockStatus();
    toast("Đã đặt mật khẩu khoá màn hình", "success");
  });

  function checkLockOnBoot() {
    if (db.settings.passwordHash) {
      $("lockScreen").hidden = false;
      setTimeout(function () { $("unlockInput").focus(); }, 100);
    }
  }
  function tryUnlock() {
    var val = $("unlockInput").value;
    if (Z.hashPass(val) === db.settings.passwordHash) {
      $("lockScreen").hidden = true;
    } else {
      var field = $("unlockInput").closest(".field");
      field.style.animation = "none"; void field.offsetWidth;
      field.style.animation = "shakeX .35s ease";
      toast("Sai mật khẩu", "error");
    }
  }
  $("btnUnlock").addEventListener("click", tryUnlock);
  $("unlockInput").addEventListener("keydown", function (e) { if (e.key === "Enter") tryUnlock(); });

  /* ---- xuất / nhập JSON ---- */
  $("btnExportJson").addEventListener("click", function () { Z.exportJSON(db); toast("Đã tải file JSON", "success"); });
  $("btnImportJson").addEventListener("click", function () { $("importFileInput").click(); });
  var pendingImport = null;
  $("importFileInput").addEventListener("change", function (e) {
    var file = e.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var parsed;
      try { parsed = JSON.parse(reader.result); } catch (err) { toast("File không phải JSON hợp lệ", "error"); return; }
      var err2 = Z.validateImport(parsed);
      if (err2) { toast(err2, "error"); return; }
      pendingImport = parsed;
      $("importSummary").textContent = "File chứa " + (parsed.links || []).length + " liên kết và " + (parsed.categories || []).length + " danh mục.";
      openModal("importModalBackdrop");
    };
    reader.readAsText(file);
    e.target.value = "";
  });
  $("btnImportConfirm").addEventListener("click", function () {
    if (!pendingImport) return;
    var mode = qs('input[name="importMode"]:checked').value;
    var res = Z.importJSON(pendingImport, mode);
    if (res.ok) {
      db = Z.load();
      closeModal("importModalBackdrop");
      render(); renderReminderBar();
      toast(mode === "replace" ? "Đã thay thế toàn bộ dữ liệu" : "Đã gộp dữ liệu (" + (res.added || 0) + " link mới)", "success");
    } else { toast(res.error || "Nhập dữ liệu thất bại", "error"); }
  });

  /* ================= NHẮC LỊCH (reminder carousel) ================= */
  var reminderTimer = null;
  function renderReminderBar() {
    var due = Z.dueReminders(db);
    var bar = $("reminderBar");
    if (!due.length) { bar.hidden = true; return; }
    bar.hidden = false;
    var track = $("reminderTrack");
    track.innerHTML = "";
    due.forEach(function (d) {
      var item = document.createElement("div"); item.className = "reminder-item";
      item.innerHTML = '<i class="fa-solid fa-bell"></i><span class="rt-name"></span><span class="rt-time mono"></span>';
      item.querySelector(".rt-name").textContent = d.link.title;
      item.querySelector(".rt-time").textContent = d.status.dueAgoLabel;
      item.addEventListener("click", function () { openLink(d.link); });
      track.appendChild(item);
    });
    state.reminderIndex = Math.min(state.reminderIndex, due.length - 1);
    updateReminderTrack();
  }
  function updateReminderTrack() {
    $("reminderTrack").style.transform = "translateX(-" + state.reminderIndex * 100 + "%)";
  }
  $("btnReminderPrev").addEventListener("click", function () {
    var n = $("reminderTrack").children.length; if (!n) return;
    state.reminderIndex = (state.reminderIndex - 1 + n) % n; updateReminderTrack();
  });
  $("btnReminderNext").addEventListener("click", function () {
    var n = $("reminderTrack").children.length; if (!n) return;
    state.reminderIndex = (state.reminderIndex + 1) % n; updateReminderTrack();
  });
  $("btnReminderAuto").addEventListener("click", function () {
    state.reminderAuto = !state.reminderAuto;
    this.innerHTML = state.reminderAuto ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
  });
  function reminderTick() {
    if (state.reminderAuto) {
      var n = $("reminderTrack").children.length;
      if (n > 1) { state.reminderIndex = (state.reminderIndex + 1) % n; updateReminderTrack(); }
    }
  }
  setInterval(reminderTick, 6000);

  var notifiedBucket = {};
  function reminderNotifyTick() {
    renderReminderBar();
    Z.dueReminders(db).forEach(function (d) {
      if (d.status.diffMs < 60000) {
        var key = d.link.id + "-" + Math.floor(Date.now() / (7 * 24 * 3600 * 1000));
        if (!notifiedBucket[key]) {
          notifiedBucket[key] = true;
          toast("🔔 \"" + d.link.title + "\" vừa đến lịch cập nhật mới!", "info", 6000);
        }
      }
    });
  }
  setInterval(reminderNotifyTick, 60000);

  /* ---- quản lý lịch nhắc ---- */
  $("btnReminderManage").addEventListener("click", function () { renderReminderManager(); openModal("reminderModalBackdrop"); });
  function renderReminderManager() {
    var wrap = $("reminderManageList"); wrap.innerHTML = "";
    var withRem = db.links.filter(function (l) { return l.reminder; });
    var without = db.links.filter(function (l) { return !l.reminder; });

    var h1 = document.createElement("div"); h1.className = "section-title"; h1.textContent = "Đang bật (" + withRem.length + ")";
    wrap.appendChild(h1);
    if (!withRem.length) {
      var p = document.createElement("p"); p.style.cssText = "font-size:12.5px;color:var(--muted);margin-bottom:16px"; p.textContent = "Chưa có link nào đặt lịch.";
      wrap.appendChild(p);
    }
    withRem.forEach(function (l) {
      var row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid var(--border)";
      row.innerHTML = '<i class="fa-solid fa-bell" style="color:var(--accent)"></i>' +
        '<div style="flex:1;min-width:0"><div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + l.title + '</div>' +
        '<div class="mono" style="font-size:11px;color:var(--muted)">' + Z.WEEKDAY_LABELS[l.reminder.weekday] + ", " + String(l.reminder.hour).padStart(2, "0") + ":" + String(l.reminder.minute).padStart(2, "0") + "</div></div>" +
        '<button class="btn btn-icon btn-sm btn-ghost" data-remove><i class="fa-solid fa-trash"></i></button>';
      row.querySelector("[data-remove]").addEventListener("click", function () {
        Z.updateLink(db, l.id, { reminder: null }); Z.save(db);
        renderReminderManager(); renderReminderBar();
        toast("Đã bỏ lịch nhắc", "success");
      });
      wrap.appendChild(row);
    });

    var h2 = document.createElement("div"); h2.className = "section-title"; h2.style.marginTop = "16px"; h2.textContent = "Thêm lịch nhắc mới";
    wrap.appendChild(h2);
    if (!without.length) {
      wrap.appendChild(Object.assign(document.createElement("p"), { textContent: "Tất cả link đã có lịch.", style: "font-size:12.5px;color:var(--muted)" }));
      return;
    }
    var row2 = document.createElement("div"); row2.className = "field-row";
    var sel = document.createElement("select"); sel.className = "select-plain"; sel.style.flex = "1";
    without.forEach(function (l) { var o = document.createElement("option"); o.value = l.id; o.textContent = l.title; sel.appendChild(o); });
    var addBtn = document.createElement("button"); addBtn.className = "btn btn-sm btn-primary"; addBtn.textContent = "Đặt lịch";
    row2.appendChild(sel); wrap.appendChild(row2);

    var pickRow = document.createElement("div"); pickRow.className = "field-row"; pickRow.style.marginTop = "8px";
    var dSel = document.createElement("select"); dSel.className = "select-plain";
    Z.WEEKDAY_LABELS.forEach(function (lb, i) { var o = document.createElement("option"); o.value = i; o.textContent = lb; dSel.appendChild(o); });
    dSel.value = 1;
    var hSel = document.createElement("select"); hSel.className = "select-plain";
    for (var h = 0; h < 24; h++) { var oh = document.createElement("option"); oh.value = h; oh.textContent = h + "h"; hSel.appendChild(oh); }
    hSel.value = 20;
    var mSel = document.createElement("select"); mSel.className = "select-plain";
    for (var m = 0; m < 60; m += 5) { var om = document.createElement("option"); om.value = m; om.textContent = m + "p"; mSel.appendChild(om); }
    pickRow.appendChild(dSel); pickRow.appendChild(hSel); pickRow.appendChild(mSel); pickRow.appendChild(addBtn);
    wrap.appendChild(pickRow);

    addBtn.addEventListener("click", function () {
      Z.updateLink(db, sel.value, { reminder: { weekday: parseInt(dSel.value, 10), hour: parseInt(hSel.value, 10), minute: parseInt(mSel.value, 10) } });
      Z.save(db);
      renderReminderManager(); renderReminderBar();
      toast("Đã đặt lịch nhắc", "success");
    });
  }

  /* ================= CHUỘT ẢO (virtual mouse) ================= */
  var vMouse = $("virtualMouse"), goBtn = $("goLinkBtn");
  var vDragging = false, vOffX = 0, vOffY = 0, vTargetLink = null;

  function applyVirtualMouseVisibility() {
    vMouse.style.display = db.settings.virtualMouse ? "block" : "none";
    if (!db.settings.virtualMouse) goBtn.style.display = "none";
  }
  function placeVMouseDefault() {
    vMouse.style.left = "16px"; vMouse.style.top = "78px";
  }
  vMouse.addEventListener("pointerdown", function (e) {
    vDragging = true; vMouse.setPointerCapture(e.pointerId);
    var r = vMouse.getBoundingClientRect();
    vOffX = e.clientX - r.left; vOffY = e.clientY - r.top;
  });
  vMouse.addEventListener("pointermove", function (e) {
    if (!vDragging) return;
    var x = e.clientX - vOffX, y = e.clientY - vOffY;
    vMouse.style.left = x + "px"; vMouse.style.top = y + "px";
    var cx = x + 13, cy = y + 13;
    var el = document.elementFromPoint(cx, cy);
    var card = el && el.closest ? el.closest(".link-card") : null;
    qsa(".link-card").forEach(function (c) { c.style.outline = ""; });
    if (card) {
      card.style.outline = "2px solid var(--accent)";
      var id = card.getAttribute("data-id");
      vTargetLink = db.links.find(function (l) { return l.id === id; });
      goBtn.style.display = "flex";
      goBtn.style.left = x + "px";
      goBtn.style.top = (y + 34) + "px";
    } else {
      vTargetLink = null;
      goBtn.style.display = "none";
    }
  });
  vMouse.addEventListener("pointerup", function (e) { vDragging = false; vMouse.releasePointerCapture(e.pointerId); });
  goBtn.addEventListener("click", function () { if (vTargetLink) openLink(vTargetLink); });

  /* ================= BOOT ================= */
  function boot() {
    applyTheme(db.settings.theme || "light", false);
    applyAccent(db.settings.accent || "#E8952F", false);
    buildAccentSwatches();
    applyBackground();
    applyVirtualMouseVisibility();
    placeVMouseDefault();
    syncToggle($("toggleMouse"), db.settings.virtualMouse);
    syncToggle($("toggleHidden"), db.settings.showHidden);
    refreshLockStatus();
    checkLockOnBoot();
    render();
    renderReminderBar();
  }
  boot();

  window.addEventListener("resize", function () {
    if (window.innerWidth < 720 && !vDragging) placeVMouseDefault();
  });
})();
