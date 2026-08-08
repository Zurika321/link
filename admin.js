/*! admin.js — logic trang quản trị (admin.html) của Zurika Link Hub */
(function () {
  "use strict";
  var Z = window.ZDB;
  var db = Z.load();

  var state = {
    route: "dashboard",
    linkSearch: "", linkCategory: "all", linkTag: "all", linkSort: "newest",
    page: 1, pageSize: 20,
    selected: new Set(),
    editingId: null, tagsDraft: [], confirmCb: null, pendingImport: null
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
    var remove = function () { el.classList.remove("show"); setTimeout(function () { el.remove(); }, 280); };
    el.querySelector(".toast-close").addEventListener("click", remove);
    setTimeout(remove, ms || 3200);
  }

  /* ================= MODAL helpers ================= */
  function openModal(id) { $(id).classList.add("open"); }
  function closeModal(id) { $(id).classList.remove("open"); }
  function openConfirm(title, body, cb) {
    $("confirmTitle").textContent = title; $("confirmBody").textContent = body;
    state.confirmCb = cb; openModal("confirmModalBackdrop");
  }
  $("btnConfirmOk").addEventListener("click", function () {
    closeModal("confirmModalBackdrop");
    if (state.confirmCb) { state.confirmCb(); state.confirmCb = null; }
  });
  qsa("[data-close]").forEach(function (btn) { btn.addEventListener("click", function () { closeModal(btn.dataset.close); }); });
  qsa(".modal-backdrop").forEach(function (bd) { bd.addEventListener("click", function (e) { if (e.target === bd) closeModal(bd.id); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") qsa(".modal-backdrop.open").forEach(function (bd) { closeModal(bd.id); });
  });

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
    qsa(".swatch").forEach(function (s) { s.classList.toggle("active", s.dataset.color && s.dataset.color.toLowerCase() === hex.toLowerCase()); });
    if (persist) { db.settings.accent = hex; Z.save(db); }
  }
  var ACCENT_PRESETS = ["#E8952F", "#5B5FEF", "#2FB8AC", "#E8617C", "#8A9A5B", "#9C6ADE", "#4FA7D9"];
  function buildAccentSwatches() {
    var wrap = $("accentSwatches"); wrap.innerHTML = "";
    ACCENT_PRESETS.forEach(function (hex) {
      var b = document.createElement("button");
      b.className = "swatch"; b.style.background = hex; b.dataset.color = hex; b.title = hex;
      b.addEventListener("click", function () { applyAccent(hex, true); });
      wrap.appendChild(b);
    });
    var custom = document.createElement("label"); custom.className = "swatch swatch-custom"; custom.title = "Tuỳ chỉnh";
    custom.innerHTML = '<i class="fa-solid fa-eye-dropper"></i>';
    var inp = document.createElement("input"); inp.type = "color"; inp.value = db.settings.accent || "#E8952F";
    inp.addEventListener("input", function () { applyAccent(inp.value, true); });
    custom.appendChild(inp); wrap.appendChild(custom);
  }
  $("btnTheme").addEventListener("click", function () { applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark", true); });
  $("toggleDark").addEventListener("click", function () { applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark", true); });

  /* ================= SIDEBAR ================= */
  var sidebar = $("sidebar");
  function setSidebarHidden(hidden, persist) {
    sidebar.classList.toggle("sidebar-hidden", hidden);
    if (persist) { db.settings.sidebarCollapsed = hidden; Z.save(db); }
  }
  $("btnCollapseSidebar").addEventListener("click", function () { setSidebarHidden(true, true); });
  $("sidebarReopenBtn").addEventListener("click", function () { setSidebarHidden(false, true); });
  $("btnMobileSidebar").addEventListener("click", function () { setSidebarHidden(sidebar.classList.contains("sidebar-hidden") ? false : true, false); });
  $("adminScrim").addEventListener("click", function () { setSidebarHidden(true, false); });

  var ROUTE_TITLES = { dashboard: "Tổng quan", links: "Liên kết", categories: "Danh mục", tags: "Thẻ", data: "Dữ liệu", settings: "Cài đặt" };
  function goRoute(route) {
    state.route = route;
    qsa(".nav-item[data-route]").forEach(function (b) { b.classList.toggle("active", b.dataset.route === route); });
    ["dashboard", "links", "categories", "tags", "data", "settings"].forEach(function (r) {
      $("route" + r[0].toUpperCase() + r.slice(1)).hidden = r !== route;
    });
    $("routeTitle").textContent = ROUTE_TITLES[route];
    if (route === "dashboard") renderDashboard();
    else if (route === "links") renderLinksRoute();
    else if (route === "categories") renderCategoriesRoute();
    else if (route === "tags") renderTagsRoute();
    else if (route === "data") renderDataRoute();
    if (window.innerWidth < 900) setSidebarHidden(true, false);
  }
  qsa(".nav-item[data-route]").forEach(function (b) { b.addEventListener("click", function () { goRoute(b.dataset.route); }); });

  /* ================= helpers dùng chung ================= */
  function categoryOf(id) { return db.categories.find(function (c) { return c.id === id; }); }
  function faviconSrc(link) {
    if (link.icon) return link.icon;
    if (/^file:\/\//i.test(link.url)) return null;
    if (!Z.isValidURL(link.url)) return null;
    try { return "https://www.google.com/s2/favicons?sz=64&domain=" + new URL(link.url).hostname; } catch (e) { return null; }
  }
  function miniIcon(link, cat) {
    var wrap = document.createElement("div");
    var src = faviconSrc(link);
    if (src) {
      var img = document.createElement("img"); img.src = src; img.alt = "";
      img.onerror = function () { img.remove(); wrap.appendChild(catIconEl(cat)); };
      wrap.appendChild(img);
    } else wrap.appendChild(catIconEl(cat));
    return wrap;
  }
  function catIconEl(cat) {
    var i = document.createElement("i");
    i.className = (cat && cat.icon) || "fa-solid fa-link";
    i.style.color = (cat && cat.color) || "var(--muted)"; i.style.fontSize = "13px";
    return i;
  }

  /* ================= DASHBOARD ================= */
  function renderDashboard() {
    var all = db.links;
    var starred = all.filter(function (l) { return l.starred; }).length;
    var cards = [
      { icon: "fa-link", label: "Tổng liên kết", num: all.length },
      { icon: "fa-star", label: "Đã đánh dấu", num: starred },
      { icon: "fa-folder-tree", label: "Danh mục", num: db.categories.length },
      { icon: "fa-tags", label: "Thẻ", num: Z.getAllTags(db).length }
    ];
    var wrap = $("statCards"); wrap.innerHTML = "";
    cards.forEach(function (c) {
      var d = document.createElement("div"); d.className = "stat-card";
      d.innerHTML = '<i class="fa-solid ' + c.icon + '"></i><div class="stat-num mono">' + c.num + '</div><div class="stat-label">' + c.label + "</div>";
      wrap.appendChild(d);
    });

    var barsWrap = $("catBars"); barsWrap.innerHTML = "";
    var max = Math.max(1, Math.max.apply(null, db.categories.map(function (c) { return all.filter(function (l) { return l.categoryId === c.id; }).length; })));
    db.categories.forEach(function (cat) {
      var count = all.filter(function (l) { return l.categoryId === cat.id; }).length;
      var row = document.createElement("div"); row.className = "bar-row";
      row.innerHTML = '<div class="bar-label"><i class="' + cat.icon + '" style="color:' + cat.color + '"></i>' + cat.name + '</div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:0%;background:' + cat.color + '"></div></div>' +
        '<div class="bar-count">' + count + "</div>";
      barsWrap.appendChild(row);
      requestAnimationFrame(function () { row.querySelector(".bar-fill").style.width = (count / max * 100) + "%"; });
    });

    var recentWrap = $("recentList"); recentWrap.innerHTML = "";
    var recents = all.filter(function (l) { return l.lastViewedAt; }).sort(function (a, b) { return b.lastViewedAt - a.lastViewedAt; }).slice(0, 8);
    if (!recents.length) recentWrap.innerHTML = '<p style="font-size:12.5px;color:var(--muted)">Chưa có lượt xem nào.</p>';
    recents.forEach(function (l) {
      var cat = categoryOf(l.categoryId);
      var row = document.createElement("div"); row.className = "recent-row";
      var ico = document.createElement("div"); ico.className = "recent-ico"; ico.appendChild(miniIcon(l, cat));
      row.appendChild(ico);
      var title = document.createElement("div"); title.className = "recent-title"; title.textContent = l.title; row.appendChild(title);
      var time = document.createElement("div"); time.className = "recent-time"; time.textContent = Z.formatRelativeTime(l.lastViewedAt); row.appendChild(time);
      row.addEventListener("click", function () { window.open(l.url, "_blank", "noopener"); });
      recentWrap.appendChild(row);
    });

    var remWrap = $("dashReminders"); remWrap.innerHTML = "";
    var due = Z.dueReminders(db);
    if (!due.length) remWrap.innerHTML = '<p style="font-size:12.5px;color:var(--muted)">Không có lịch nào đến hạn trong 24h qua.</p>';
    due.forEach(function (d) {
      var row = document.createElement("div"); row.className = "recent-row";
      row.innerHTML = '<i class="fa-solid fa-bell" style="color:var(--accent);width:28px;text-align:center"></i>' +
        '<div class="recent-title">' + d.link.title + '</div><div class="recent-time">' + d.status.dueAgoLabel + "</div>";
      remWrap.appendChild(row);
    });

    $("navBadgeLinks").textContent = all.length;
  }

  /* ================= LINKS ROUTE ================= */
  function fillCategorySelect(selectEl, selectedId, withAllOption) {
    selectEl.innerHTML = "";
    if (withAllOption) { var oa = document.createElement("option"); oa.value = "all"; oa.textContent = "Tất cả danh mục"; selectEl.appendChild(oa); }
    db.categories.forEach(function (c) {
      var o = document.createElement("option"); o.value = c.id; o.textContent = c.name;
      if (c.id === selectedId) o.selected = true;
      selectEl.appendChild(o);
    });
  }
  function fillTagFilterSelect() {
    var sel = $("filterTag"); var cur = sel.value;
    sel.innerHTML = '<option value="all">Tất cả thẻ</option>';
    Z.getAllTags(db).forEach(function (t) {
      var o = document.createElement("option"); o.value = t.name; o.textContent = "#" + t.name + " (" + t.count + ")"; sel.appendChild(o);
    });
    sel.value = cur && qsa("option", sel).some(function (o) { return o.value === cur; }) ? cur : "all";
  }

  function getFilteredAdminLinks() {
    var list = db.links.filter(function (l) {
      if (state.linkCategory !== "all" && l.categoryId !== state.linkCategory) return false;
      if (state.linkTag !== "all" && (l.tags || []).indexOf(state.linkTag) === -1) return false;
      if (state.linkSearch) {
        var hay = Z.normalizeSearch([l.title, l.desc, (l.tags || []).join(" "), l.url].join(" "));
        if (hay.indexOf(state.linkSearch) === -1) return false;
      }
      return true;
    });
    switch (state.linkSort) {
      case "name": list.sort(function (a, b) { return a.title.localeCompare(b.title, "vi"); }); break;
      case "viewed": list.sort(function (a, b) { return (b.viewCount || 0) - (a.viewCount || 0); }); break;
      default: list.sort(function (a, b) { return b.createdAt - a.createdAt; });
    }
    return list;
  }

  function renderLinksRoute() {
    fillCategorySelect($("filterCategory"), state.linkCategory, true);
    fillTagFilterSelect();
    renderLinksTable();
  }

  function renderLinksTable() {
    var list = getFilteredAdminLinks();
    var totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
    state.page = Math.min(state.page, totalPages);
    var pageItems = list.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);

    var tbody = $("linksTableBody"); tbody.innerHTML = "";
    if (!pageItems.length) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:30px">Không có liên kết nào khớp bộ lọc.</td></tr>';
    }
    pageItems.forEach(function (l) {
      var cat = categoryOf(l.categoryId) || {};
      var tr = document.createElement("tr");

      var tdCheck = document.createElement("td");
      var cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = state.selected.has(l.id);
      cb.addEventListener("change", function () { toggleSelect(l.id, cb.checked); });
      tdCheck.appendChild(cb); tr.appendChild(tdCheck);

      var tdLink = document.createElement("td");
      var cell = document.createElement("div"); cell.className = "cell-link";
      var ico = document.createElement("div"); ico.className = "cl-ico"; ico.appendChild(miniIcon(l, cat));
      var text = document.createElement("div"); text.className = "cl-text";
      text.innerHTML = '<div class="cl-title"></div><div class="cl-url"></div>';
      text.querySelector(".cl-title").textContent = l.title;
      text.querySelector(".cl-url").textContent = l.url;
      cell.appendChild(ico); cell.appendChild(text);
      tdLink.appendChild(cell); tr.appendChild(tdLink);

      var tdCat = document.createElement("td");
      tdCat.innerHTML = '<span class="cat-chip" style="background:rgba(0,0,0,.06)"><span class="dot"></span>' + (cat.name || "—") + "</span>";
      tdCat.querySelector(".cat-chip").style.background = cat.color ? "color-mix(in srgb, " + cat.color + " 16%, transparent)" : "";
      tdCat.querySelector(".dot").style.background = cat.color || "var(--muted)";
      tr.appendChild(tdCat);

      var tdTags = document.createElement("td");
      (l.tags || []).forEach(function (t) { var c = document.createElement("span"); c.className = "chip"; c.style.marginRight = "4px"; c.textContent = "#" + t; tdTags.appendChild(c); });
      tr.appendChild(tdTags);

      var tdStar = document.createElement("td");
      var starBtn = document.createElement("button"); starBtn.className = "star-btn btn-sm" + (l.starred ? " active" : ""); starBtn.innerHTML = '<i class="fa-solid fa-star"></i>';
      starBtn.addEventListener("click", function () { Z.toggleStar(db, l.id); Z.save(db); renderLinksTable(); });
      tdStar.appendChild(starBtn); tr.appendChild(tdStar);

      var tdViews = document.createElement("td"); tdViews.className = "mono"; tdViews.textContent = l.viewCount || 0; tr.appendChild(tdViews);

      var tdUpdated = document.createElement("td"); tdUpdated.className = "mono"; tdUpdated.style.fontSize = "11px"; tdUpdated.textContent = Z.formatRelativeTime(l.updatedAt); tr.appendChild(tdUpdated);

      var tdActions = document.createElement("td");
      var actWrap = document.createElement("div"); actWrap.className = "row-actions";
      var editBtn = document.createElement("button"); editBtn.className = "btn btn-icon btn-sm btn-ghost"; editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
      editBtn.addEventListener("click", function () { openLinkModal(l); });
      var delBtn = document.createElement("button"); delBtn.className = "btn btn-icon btn-sm btn-ghost"; delBtn.innerHTML = '<i class="fa-solid fa-trash" style="color:var(--danger)"></i>';
      delBtn.addEventListener("click", function () {
        openConfirm("Xoá liên kết?", 'Xoá "' + l.title + '" khỏi danh sách.', function () {
          Z.deleteLink(db, l.id); Z.save(db); state.selected.delete(l.id); renderLinksTable(); renderDashboard();
          toast("Đã xoá liên kết", "success");
        });
      });
      actWrap.appendChild(editBtn); actWrap.appendChild(delBtn);
      tdActions.appendChild(actWrap); tr.appendChild(tdActions);

      tbody.appendChild(tr);
    });

    var pager = $("linksPager");
    pager.innerHTML = "";
    if (totalPages > 1) {
      var prev = document.createElement("button"); prev.className = "btn btn-icon btn-sm btn-ghost"; prev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
      prev.disabled = state.page <= 1; prev.addEventListener("click", function () { state.page--; renderLinksTable(); });
      var next = document.createElement("button"); next.className = "btn btn-icon btn-sm btn-ghost"; next.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
      next.disabled = state.page >= totalPages; next.addEventListener("click", function () { state.page++; renderLinksTable(); });
      var label = document.createElement("span"); label.textContent = "Trang " + state.page + " / " + totalPages + " · " + list.length + " kết quả";
      pager.appendChild(prev); pager.appendChild(label); pager.appendChild(next);
    } else if (list.length) {
      pager.innerHTML = "<span>" + list.length + " kết quả</span>";
    }
    updateBulkBar();
    updateCheckAllState(pageItems);
  }

  function toggleSelect(id, on) { if (on) state.selected.add(id); else state.selected.delete(id); updateBulkBar(); }
  function updateCheckAllState(pageItems) {
    var all = pageItems.length > 0 && pageItems.every(function (l) { return state.selected.has(l.id); });
    $("checkAll").checked = all;
  }
  $("checkAll").addEventListener("change", function () {
    var list = getFilteredAdminLinks().slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
    list.forEach(function (l) { toggleSelect(l.id, $("checkAll").checked); });
    renderLinksTable();
  });
  function updateBulkBar() {
    var n = state.selected.size;
    $("bulkBar").hidden = n === 0;
    $("bulkCount").textContent = n + " đã chọn";
  }
  $("btnBulkClear").addEventListener("click", function () { state.selected.clear(); renderLinksTable(); });
  $("btnBulkDelete").addEventListener("click", function () {
    var n = state.selected.size;
    openConfirm("Xoá " + n + " liên kết?", "Hành động này không thể hoàn tác.", function () {
      state.selected.forEach(function (id) { Z.deleteLink(db, id); });
      state.selected.clear(); Z.save(db); renderLinksTable(); renderDashboard();
      toast("Đã xoá " + n + " liên kết", "success");
    });
  });
  $("btnBulkMove").addEventListener("click", function () {
    var catId = $("bulkCategorySelect").value;
    state.selected.forEach(function (id) { Z.updateLink(db, id, { categoryId: catId }); });
    Z.save(db); renderLinksTable();
    toast("Đã chuyển danh mục cho " + state.selected.size + " liên kết", "success");
  });

  $("linkSearch").addEventListener("input", function () { state.linkSearch = Z.normalizeSearch(this.value); state.page = 1; renderLinksTable(); });
  $("filterCategory").addEventListener("change", function () { state.linkCategory = this.value; state.page = 1; renderLinksTable(); });
  $("filterTag").addEventListener("change", function () { state.linkTag = this.value; state.page = 1; renderLinksTable(); });
  $("linkSort").addEventListener("change", function () { state.linkSort = this.value; renderLinksTable(); });
  $("btnAddLinkAdmin").addEventListener("click", function () { openLinkModal(null); });

  /* ================= LINK MODAL (thêm/sửa) ================= */
  function fillTimeSelects() {
    var dayEl = $("fReminderDay"); dayEl.innerHTML = "";
    Z.WEEKDAY_LABELS.forEach(function (label, idx) { var o = document.createElement("option"); o.value = idx; o.textContent = label; dayEl.appendChild(o); });
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
        state.tagsDraft = state.tagsDraft.filter(function (x) { return x !== t; }); renderTagChips();
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
    } else if (e.key === "Backspace" && !e.target.value && state.tagsDraft.length) { state.tagsDraft.pop(); renderTagChips(); }
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
    fillCategorySelect($("fCategory"), link ? link.categoryId : (state.linkCategory !== "all" ? state.linkCategory : db.categories[0].id), false);
    var hasReminder = !!(link && link.reminder);
    $("fReminderOn").checked = hasReminder; $("reminderFields").hidden = !hasReminder;
    if (hasReminder) { $("fReminderDay").value = link.reminder.weekday; $("fReminderHour").value = link.reminder.hour; $("fReminderMinute").value = link.reminder.minute; }
    else { $("fReminderDay").value = 1; $("fReminderHour").value = 20; $("fReminderMinute").value = 0; }
    openModal("linkModalBackdrop");
    setTimeout(function () { $("fUrl").focus(); }, 60);
  }
  $("btnSaveLink").addEventListener("click", function () {
    var url = $("fUrl").value.trim();
    var isFile = /^file:\/\/\//i.test(url);
    if (!url || (!isFile && !Z.isValidURL(url))) { toast("Đường dẫn không hợp lệ.", "error"); return; }
    var data = {
      url: url, title: $("fTitle").value.trim() || url, desc: $("fDesc").value.trim(),
      categoryId: $("fCategory").value, tags: state.tagsDraft.slice(), icon: $("fIcon").value.trim(), starred: $("fStarred").checked,
      reminder: $("fReminderOn").checked ? { weekday: parseInt($("fReminderDay").value, 10), hour: parseInt($("fReminderHour").value, 10), minute: parseInt($("fReminderMinute").value, 10) } : null
    };
    if (state.editingId) { Z.updateLink(db, state.editingId, data); toast("Đã lưu thay đổi", "success"); }
    else { Z.addLink(db, data); toast("Đã thêm liên kết", "success"); }
    Z.save(db); closeModal("linkModalBackdrop");
    renderLinksTable(); renderDashboard();
  });

  /* ================= CATEGORIES ROUTE ================= */
  function renderCategoriesRoute() {
    var wrap = $("categoryList"); wrap.innerHTML = "";
    db.categories.forEach(function (cat, idx) {
      var count = db.links.filter(function (l) { return l.categoryId === cat.id; }).length;
      var row = document.createElement("div"); row.className = "cat-manage-row";

      var order = document.createElement("div"); order.className = "cat-order-btns";
      var up = document.createElement("button"); up.innerHTML = "▲"; up.disabled = idx === 0;
      up.addEventListener("click", function () { moveCategory(idx, -1); });
      var down = document.createElement("button"); down.innerHTML = "▼"; down.disabled = idx === db.categories.length - 1;
      down.addEventListener("click", function () { moveCategory(idx, 1); });
      order.appendChild(up); order.appendChild(down); row.appendChild(order);

      var colorBox = document.createElement("div"); colorBox.className = "cm-color"; colorBox.style.background = cat.color;
      colorBox.innerHTML = '<i class="' + cat.icon + '"></i>'; row.appendChild(colorBox);

      var info = document.createElement("div"); info.style.flex = "1"; info.style.minWidth = "0";
      info.innerHTML = '<div class="cm-name"></div><div class="cm-sub"></div>';
      info.querySelector(".cm-name").textContent = cat.name;
      info.querySelector(".cm-sub").textContent = count + " liên kết" + (cat.protected ? " · bảo vệ" : "");
      row.appendChild(info);

      if (cat.protected) { var tag = document.createElement("span"); tag.className = "protected-tag"; tag.textContent = "hệ thống"; row.appendChild(tag); }

      var actions = document.createElement("div"); actions.className = "cm-actions";
      var renameBtn = document.createElement("button"); renameBtn.className = "btn btn-icon btn-sm btn-ghost"; renameBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
      renameBtn.addEventListener("click", function () { renameCategoryPrompt(cat); });
      actions.appendChild(renameBtn);
      if (!cat.protected) {
        var delBtn = document.createElement("button"); delBtn.className = "btn btn-icon btn-sm btn-ghost"; delBtn.innerHTML = '<i class="fa-solid fa-trash" style="color:var(--danger)"></i>';
        delBtn.title = count ? "Danh mục còn " + count + " liên kết, hãy chuyển hết trước khi xoá" : "Xoá danh mục";
        delBtn.addEventListener("click", function () {
          var res = Z.deleteCategory(db, cat.id);
          if (!res.ok) { toast(res.reason === "in-use" ? "Danh mục còn liên kết, hãy chuyển hết trước khi xoá." : "Không thể xoá danh mục này.", "error"); return; }
          Z.save(db); renderCategoriesRoute(); toast("Đã xoá danh mục", "success");
        });
        actions.appendChild(delBtn);
      }
      row.appendChild(actions);
      wrap.appendChild(row);
    });
  }
  function moveCategory(idx, dir) {
    var arr = db.categories; var j = idx + dir;
    if (j < 0 || j >= arr.length) return;
    var tmp = arr[idx]; arr[idx] = arr[j]; arr[j] = tmp;
    Z.save(db); renderCategoriesRoute();
  }
  function renameCategoryPrompt(cat) {
    var name = window.prompt("Đổi tên danh mục:", cat.name);
    if (name === null) return;
    name = name.trim(); if (!name) return;
    var icon = window.prompt("Class icon Font Awesome (vd: fa-solid fa-star):", cat.icon) || cat.icon;
    Z.updateCategory(db, cat.id, { name: name, icon: icon.trim() });
    Z.save(db); renderCategoriesRoute();
    toast("Đã cập nhật danh mục", "success");
  }
  $("btnAddCategory").addEventListener("click", function () {
    var name = $("newCatName").value.trim();
    if (!name) { toast("Nhập tên danh mục trước đã", "error"); return; }
    Z.addCategory(db, { name: name, icon: $("newCatIcon").value.trim() || "fa-solid fa-tag", color: $("newCatColor").value });
    Z.save(db);
    $("newCatName").value = ""; $("newCatIcon").value = "fa-solid fa-tag";
    renderCategoriesRoute();
    toast("Đã thêm danh mục", "success");
  });

  /* ================= TAGS ROUTE ================= */
  function renderTagsRoute() {
    var tags = Z.getAllTags(db);
    var wrap = $("tagListWrap");
    if (!tags.length) { wrap.innerHTML = '<p style="padding:20px;color:var(--muted);font-size:13px">Chưa có thẻ nào — thêm thẻ khi tạo/sửa liên kết.</p>'; return; }
    wrap.innerHTML = "";
    tags.forEach(function (t) {
      var row = document.createElement("div"); row.className = "tag-manage-row";
      row.innerHTML = '<span class="mono" style="color:var(--muted)">#</span>';
      var input = document.createElement("input"); input.type = "text"; input.value = t.name;
      input.addEventListener("change", function () {
        var v = input.value.trim();
        if (v && v !== t.name) { Z.renameTag(db, t.name, v); Z.save(db); renderTagsRoute(); toast("Đã đổi tên thẻ", "success"); }
      });
      row.appendChild(input);
      var badge = document.createElement("span"); badge.className = "badge"; badge.textContent = t.count; row.appendChild(badge);
      var del = document.createElement("button"); del.className = "btn btn-icon btn-sm btn-ghost"; del.innerHTML = '<i class="fa-solid fa-trash" style="color:var(--danger)"></i>';
      del.addEventListener("click", function () {
        openConfirm('Xoá thẻ "#' + t.name + '"?', "Thẻ sẽ được gỡ khỏi " + t.count + " liên kết.", function () {
          Z.deleteTag(db, t.name); Z.save(db); renderTagsRoute(); toast("Đã xoá thẻ", "success");
        });
      });
      row.appendChild(del);
      wrap.appendChild(row);
    });
  }

  /* ================= DATA ROUTE ================= */
  function renderDataRoute() {
    var bytes = new Blob([JSON.stringify(db)]).size;
    $("storageSizeInfo").textContent = "Dung lượng dữ liệu hiện tại: ~" + (bytes / 1024).toFixed(1) + " KB";
  }
  $("btnExportJson").addEventListener("click", function () { Z.exportJSON(db); toast("Đã tải file JSON", "success"); });
  $("btnImportJson").addEventListener("click", function () { $("importFileInput").click(); });
  $("importFileInput").addEventListener("change", function (e) {
    var file = e.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var parsed;
      try { parsed = JSON.parse(reader.result); } catch (err) { toast("File không phải JSON hợp lệ", "error"); return; }
      var err2 = Z.validateImport(parsed);
      if (err2) { toast(err2, "error"); return; }
      state.pendingImport = parsed;
      $("importSummary").textContent = "File chứa " + (parsed.links || []).length + " liên kết và " + (parsed.categories || []).length + " danh mục.";
      openModal("importModalBackdrop");
    };
    reader.readAsText(file); e.target.value = "";
  });
  $("btnImportConfirm").addEventListener("click", function () {
    if (!state.pendingImport) return;
    var mode = qs('input[name="importMode"]:checked').value;
    var res = Z.importJSON(state.pendingImport, mode);
    if (res.ok) {
      db = Z.load(); closeModal("importModalBackdrop");
      goRoute(state.route); renderDashboard();
      toast(mode === "replace" ? "Đã thay thế toàn bộ dữ liệu" : "Đã gộp dữ liệu (" + (res.added || 0) + " link mới)", "success");
    } else toast(res.error || "Nhập dữ liệu thất bại", "error");
  });
  $("btnResetAll").addEventListener("click", function () {
    openConfirm("Xoá toàn bộ dữ liệu?", "Không thể hoàn tác. Hãy chắc chắn bạn đã xuất file JSON sao lưu.", function () {
      db = Z.resetAll();
      goRoute("dashboard");
      toast("Đã đặt lại toàn bộ dữ liệu", "success");
    });
  });

  /* ================= SETTINGS ROUTE ================= */
  function syncToggle(btn, on) { btn.classList.toggle("on", on); }
  $("toggleMouse").addEventListener("click", function () { db.settings.virtualMouse = !db.settings.virtualMouse; Z.save(db); syncToggle(this, db.settings.virtualMouse); });
  $("toggleHidden").addEventListener("click", function () { db.settings.showHidden = !db.settings.showHidden; Z.save(db); syncToggle(this, db.settings.showHidden); renderDashboard(); });
  $("bgInput").value = db.settings.background || "";
  $("btnBgApply").addEventListener("click", function () { db.settings.background = $("bgInput").value.trim(); Z.save(db); toast("Đã áp dụng — xem tại trang chính", "success"); });
  $("btnBgClear").addEventListener("click", function () { $("bgInput").value = ""; db.settings.background = ""; Z.save(db); });

  function refreshLockStatus() {
    $("lockStatusText").textContent = db.settings.passwordHash ? "Đã bật — bấm để đổi mật khẩu" : "Chưa đặt mật khẩu";
    syncToggle($("toggleLock"), !!db.settings.passwordHash);
  }
  $("toggleLock").addEventListener("click", function () {
    if (db.settings.passwordHash) {
      openConfirm("Tắt khoá màn hình?", "Trang chính sẽ không còn yêu cầu mật khẩu.", function () {
        db.settings.passwordHash = null; Z.save(db); refreshLockStatus(); toast("Đã tắt khoá màn hình", "success");
      });
    } else { $("fPass1").value = ""; $("fPass2").value = ""; openModal("passModalBackdrop"); }
  });
  $("btnSavePass").addEventListener("click", function () {
    var p1 = $("fPass1").value, p2 = $("fPass2").value;
    if (p1.length < 4) { toast("Mật khẩu cần ít nhất 4 ký tự", "error"); return; }
    if (p1 !== p2) { toast("Hai mật khẩu không khớp", "error"); return; }
    db.settings.passwordHash = Z.hashPass(p1); Z.save(db); closeModal("passModalBackdrop"); refreshLockStatus();
    toast("Đã đặt mật khẩu khoá màn hình", "success");
  });

  /* ================= BOOT ================= */
  function boot() {
    applyTheme(db.settings.theme || "light", false);
    applyAccent(db.settings.accent || "#E8952F", false);
    buildAccentSwatches();
    syncToggle($("toggleMouse"), db.settings.virtualMouse);
    syncToggle($("toggleHidden"), db.settings.showHidden);
    refreshLockStatus();
    setSidebarHidden(window.innerWidth < 900 ? true : !!db.settings.sidebarCollapsed, false);
    fillCategorySelect($("bulkCategorySelect"), null, false);
    goRoute("dashboard");
  }
  boot();
})();
