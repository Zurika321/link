/*!
 * storage.js — lớp dữ liệu dùng chung cho Zurika Link Hub
 * Thay thế cách lưu 3 mảng song song (link[]/note[]/title[]) + export Excel
 * bằng MỘT object JSON có schema rõ ràng, mỗi link có id riêng.
 * Dùng chung cho index.html (app.js) và admin.html (admin.js).
 */
(function (global) {
  "use strict";

  var DB_KEY = "zurika_db_v2";
  var OLD_DATA_KEY = "data";
  var OLD_SETTING_KEY = "data_setting";
  var OLD_STAR_KEY = "star";
  var OLD_ZZ_KEY = "open_file_ẩn";

  var PALETTE = [
    "#E8952F", "#5B5FEF", "#2FB8AC", "#E8617C",
    "#8A9A5B", "#9C6ADE", "#4FA7D9", "#C77D2E", "#6B7280"
  ];

  var DEFAULT_CATEGORIES = [
    { id: "ai", name: "AI", icon: "fa-solid fa-brain", color: "#5B5FEF", protected: false },
    { id: "anime", name: "Anime", icon: "fa-solid fa-clapperboard", color: "#E8617C", protected: true },
    { id: "file", name: "File", icon: "fa-solid fa-folder", color: "#8A9A5B", protected: true },
    { id: "github", name: "Github", icon: "fa-brands fa-github", color: "#33313F", protected: false },
    { id: "mxh", name: "MXH", icon: "fa-solid fa-couch", color: "#4FA7D9", protected: false },
    { id: "study", name: "Study", icon: "fa-solid fa-book", color: "#E8952F", protected: false },
    { id: "tips", name: "Tips", icon: "fa-solid fa-lightbulb", color: "#9C6ADE", protected: false },
    { id: "khac", name: "Khác", icon: "fa-solid fa-ellipsis", color: "#6B7280", protected: false },
    { id: "zz", name: "Link ẩn", icon: "fa-solid fa-eye-slash", color: "#6B6875", protected: true }
  ];

  function defaultSettings() {
    return {
      theme: "light",
      accent: "#E8952F",
      background: "",
      virtualMouse: true,
      showHidden: false,
      passwordHash: null,
      sidebarCollapsed: false,
      viewMode: "grid"
    };
  }

  function emptyDb() {
    return {
      schemaVersion: 2,
      categories: DEFAULT_CATEGORIES.map(function (c) { return Object.assign({}, c); }),
      links: [],
      settings: defaultSettings()
    };
  }

  // ---------- tiện ích ----------
  function uid(prefix) {
    return (prefix || "l") + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function nowTs() { return Date.now(); }

  function removeTags(str) {
    return String(str || "").replace(/<\/?[^>]+>/gi, "");
  }

  function stripVN(str) {
    return String(str || "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "D");
  }

  function slugify(str) {
    var s = stripVN(removeTags(str)).toLowerCase().trim();
    s = s.replace(/[^a-z0-9]+/g, "-").replace(/(^-+)|(-+$)/g, "");
    return s || uid("cat");
  }

  function normalizeSearch(str) {
    return stripVN(String(str || "")).toLowerCase().replace(/\s+/g, " ").trim();
  }

  function isValidURL(str) {
    try { new URL(str); return true; } catch (e) { return false; }
  }

  function formatRelativeTime(ts) {
    if (!ts) return "";
    var diff = Math.max(0, Date.now() - ts);
    var min = Math.floor(diff / 60000);
    if (min < 1) return "vừa xong";
    if (min < 60) return min + " phút trước";
    var hr = Math.floor(min / 60);
    if (hr < 24) return hr + " giờ trước";
    var day = Math.floor(hr / 24);
    if (day < 30) return day + " ngày trước";
    var mo = Math.floor(day / 30);
    if (mo < 12) return mo + " tháng trước";
    return Math.floor(mo / 12) + " năm trước";
  }

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, val) {
    try { localStorage.setItem(key, val); return true; } catch (e) { return false; }
  }

  // ---------- migrate dữ liệu định dạng cũ (mảng song song + Excel) ----------
  // Ngày cũ: currentDay 2..8 (2=Thứ2 ... 7=Thứ7, 8=CN). Quy đổi sang JS weekday 0..6.
  function oldDayToWeekday(d) {
    d = parseInt(d, 10);
    if (d === 8) return 0; // Chủ nhật
    return d - 1; // 2->1 (T2) ... 7->6 (T7)
  }

  function migrateFromOldFormat() {
    var raw = safeGet(OLD_DATA_KEY);
    if (!raw) return null;
    var old;
    try { old = JSON.parse(raw); } catch (e) { return null; }
    if (!old || !Array.isArray(old.linksss)) return null;

    var db = emptyDb();
    var oldTitles = old.titlesss || [];
    var idByRawTitle = {};
    var usedIds = {};

    db.categories = [];
    oldTitles.forEach(function (rawTitle, idx) {
      var clean = removeTags(rawTitle).trim();
      var iconMatch = String(rawTitle).match(/class=['"]([^'"]+)['"]/);
      var protectedCat = clean === "ZZ" || clean === "File" || clean === "Anime";
      var id = clean === "ZZ" ? "zz" : slugify(clean);
      while (usedIds[id]) id = id + "-" + Math.floor(Math.random() * 1000);
      usedIds[id] = true;
      db.categories.push({
        id: id,
        name: clean === "ZZ" ? "Link ẩn" : (clean || "Khác"),
        icon: iconMatch ? iconMatch[1] : "fa-solid fa-tag",
        color: PALETTE[idx % PALETTE.length],
        protected: protectedCat
      });
      idByRawTitle[clean] = id;
    });
    if (!db.categories.length) db.categories = emptyDb().categories;

    var fallbackCatId = (db.categories.filter(function (c) { return c.name === "Khác"; })[0] || db.categories[0]).id;

    var star = [];
    try { star = JSON.parse(safeGet(OLD_STAR_KEY) || "[]"); } catch (e) { star = []; }

    old.linksss.forEach(function (url, i) {
      var noteRaw = (old.notesss && old.notesss[i]) || "";
      var parts = String(noteRaw).split("<br>");
      var catRaw = removeTags(parts[0] || "").trim();
      var note1 = (parts[1] || "").trim();
      var note2 = (parts[2] || "").trim();

      // gỡ hậu tố đánh dấu trùng lặp do bản cũ sinh ra, ví dụ "(note bị trùng)*1"
      note1 = note1.replace(/\s*\(note bị trùng\)\*\d+\s*$/i, "").trim();

      var catId = idByRawTitle[catRaw] || fallbackCatId;
      var reminder = null;

      if (catRaw === "Anime") {
        var m = note2.match(/\(new\s+([0-9]+)-([0-9]+)-([0-9]+)\)/);
        if (m) {
          reminder = { weekday: oldDayToWeekday(m[1]), hour: parseInt(m[2], 10), minute: parseInt(m[3], 10) };
        }
        note2 = "";
      }

      var cleanForStar = normalizeSearch(removeTags(noteRaw).replace(/\s+/g, ""));
      var starred = star.some(function (s) { return normalizeSearch(String(s).replace(/\s+/g, "")) === cleanForStar; });

      db.links.push({
        id: uid("l"),
        url: url,
        title: note1 || url,
        desc: note2 || "",
        categoryId: catId,
        tags: [],
        icon: "",
        starred: !!starred,
        createdAt: nowTs(),
        updatedAt: nowTs(),
        lastViewedAt: null,
        viewCount: 0,
        reminder: reminder
      });
    });

    // cài đặt cũ
    var oldSetting = {};
    try { oldSetting = JSON.parse(safeGet(OLD_SETTING_KEY) || "{}"); } catch (e) { oldSetting = {}; }
    if (oldSetting.color_st) db.settings.accent = oldSetting.color_st;
    if (typeof oldSetting.background_st === "boolean" && oldSetting.background_st) {
      db.settings.background = "https://i.pinimg.com/originals/b6/7c/0f/b67c0fed6c939c5932bae21c0bb53245.jpg";
    }
    if (typeof oldSetting.mouse_st === "boolean") db.settings.virtualMouse = oldSetting.mouse_st;
    var oldZZ = safeGet(OLD_ZZ_KEY);
    if (oldZZ) { try { db.settings.showHidden = !!JSON.parse(oldZZ); } catch (e) {} }

    return db;
  }

  // ---------- load / save ----------
  var _cache = null;

  function load() {
    if (_cache) return _cache;
    var raw = safeGet(DB_KEY);
    if (raw) {
      try {
        _cache = JSON.parse(raw);
        if (!_cache.settings) _cache.settings = defaultSettings();
        return _cache;
      } catch (e) { /* rơi xuống migrate/empty */ }
    }
    var migrated = migrateFromOldFormat();
    _cache = migrated || emptyDb();
    save(_cache);
    return _cache;
  }

  function save(db) {
    _cache = db;
    return safeSet(DB_KEY, JSON.stringify(db));
  }

  // ---------- category ----------
  function addCategory(db, data) {
    var id = slugify(data.name);
    var base = id, n = 1;
    while (db.categories.some(function (c) { return c.id === id; })) { id = base + "-" + (++n); }
    var cat = {
      id: id,
      name: data.name,
      icon: data.icon || "fa-solid fa-tag",
      color: data.color || PALETTE[db.categories.length % PALETTE.length],
      protected: false
    };
    db.categories.push(cat);
    return cat;
  }

  function updateCategory(db, id, patch) {
    var cat = db.categories.find(function (c) { return c.id === id; });
    if (!cat) return null;
    Object.assign(cat, patch);
    return cat;
  }

  function deleteCategory(db, id) {
    var cat = db.categories.find(function (c) { return c.id === id; });
    if (!cat) return { ok: false, reason: "not-found" };
    if (cat.protected) return { ok: false, reason: "protected" };
    var inUse = db.links.some(function (l) { return l.categoryId === id; });
    if (inUse) return { ok: false, reason: "in-use" };
    db.categories = db.categories.filter(function (c) { return c.id !== id; });
    return { ok: true };
  }

  function reorderCategories(db, orderedIds) {
    var map = {};
    db.categories.forEach(function (c) { map[c.id] = c; });
    var next = orderedIds.map(function (id) { return map[id]; }).filter(Boolean);
    db.categories.forEach(function (c) { if (next.indexOf(c) === -1) next.push(c); });
    db.categories = next;
  }

  // ---------- link ----------
  function addLink(db, data) {
    var link = {
      id: uid("l"),
      url: data.url,
      title: data.title || data.url,
      desc: data.desc || "",
      categoryId: data.categoryId,
      tags: Array.isArray(data.tags) ? data.tags.slice() : [],
      icon: data.icon || "",
      starred: !!data.starred,
      createdAt: nowTs(),
      updatedAt: nowTs(),
      lastViewedAt: null,
      viewCount: 0,
      reminder: data.reminder || null
    };
    db.links.unshift(link);
    return link;
  }

  function updateLink(db, id, patch) {
    var link = db.links.find(function (l) { return l.id === id; });
    if (!link) return null;
    Object.assign(link, patch, { updatedAt: nowTs() });
    return link;
  }

  function deleteLink(db, id) {
    var before = db.links.length;
    db.links = db.links.filter(function (l) { return l.id !== id; });
    return db.links.length < before;
  }

  function toggleStar(db, id) {
    var link = db.links.find(function (l) { return l.id === id; });
    if (!link) return null;
    link.starred = !link.starred;
    return link;
  }

  function touchView(db, id) {
    var link = db.links.find(function (l) { return l.id === id; });
    if (!link) return null;
    link.lastViewedAt = nowTs();
    link.viewCount = (link.viewCount || 0) + 1;
    return link;
  }

  // ---------- tag ----------
  function getAllTags(db) {
    var counts = {};
    db.links.forEach(function (l) {
      (l.tags || []).forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
    });
    return Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })
      .map(function (name) { return { name: name, count: counts[name] }; });
  }

  function renameTag(db, oldName, newName) {
    newName = newName.trim();
    if (!newName) return;
    db.links.forEach(function (l) {
      if (!l.tags) return;
      var i = l.tags.indexOf(oldName);
      if (i !== -1) {
        if (l.tags.indexOf(newName) === -1) l.tags[i] = newName;
        else l.tags.splice(i, 1);
      }
    });
  }

  function deleteTag(db, name) {
    db.links.forEach(function (l) {
      if (l.tags) l.tags = l.tags.filter(function (t) { return t !== name; });
    });
  }

  // ---------- reminder (lịch phát mới, tổng quát hoá tính năng "Anime ra tập mới") ----------
  function reminderStatus(reminder) {
    if (!reminder || reminder.weekday === undefined) return null;
    var now = new Date();
    var target = new Date(now);
    var diffDays = (now.getDay() - reminder.weekday + 7) % 7;
    target.setDate(now.getDate() - diffDays);
    target.setHours(reminder.hour, reminder.minute, 0, 0);
    if (target > now) target.setDate(target.getDate() - 7);
    var diffMs = now - target;
    var withinWindow = diffMs >= 0 && diffMs <= 24 * 3600 * 1000;
    if (!withinWindow) return null;
    var h = Math.floor(diffMs / 3600000);
    var m = Math.floor((diffMs % 3600000) / 60000);
    return { dueAgoLabel: (h > 0 ? h + "h" : "") + m + "p trước", diffMs: diffMs };
  }

  function dueReminders(db) {
    var out = [];
    db.links.forEach(function (l) {
      var status = reminderStatus(l.reminder);
      if (status) out.push({ link: l, status: status });
    });
    out.sort(function (a, b) { return a.status.diffMs - b.status.diffMs; });
    return out;
  }

  var WEEKDAY_LABELS = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

  // ---------- export / import JSON ----------
  function exportJSON(db) {
    var payload = JSON.stringify(db, null, 2);
    var blob = new Blob([payload], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var d = new Date();
    var stamp = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    a.href = url;
    a.download = "zurika-links-" + stamp + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  function validateImport(obj) {
    if (!obj || typeof obj !== "object") return "File JSON không hợp lệ.";
    if (!Array.isArray(obj.links)) return "Thiếu danh sách 'links' trong file.";
    if (!Array.isArray(obj.categories)) return "Thiếu danh sách 'categories' trong file.";
    return null;
  }

  function importJSON(obj, mode) {
    // mode: "replace" | "merge"
    var err = validateImport(obj);
    if (err) return { ok: false, error: err };
    var incoming = {
      schemaVersion: 2,
      categories: obj.categories,
      links: obj.links,
      settings: Object.assign(defaultSettings(), obj.settings || {})
    };
    if (mode === "replace") {
      save(incoming);
      return { ok: true, db: incoming };
    }
    // merge: gộp category theo id, gộp link theo id (bỏ qua id trùng)
    var db = load();
    var catIds = {}; db.categories.forEach(function (c) { catIds[c.id] = true; });
    incoming.categories.forEach(function (c) { if (!catIds[c.id]) { db.categories.push(c); catIds[c.id] = true; } });
    var linkIds = {}; db.links.forEach(function (l) { linkIds[l.id] = true; });
    var added = 0;
    incoming.links.forEach(function (l) {
      if (!linkIds[l.id]) { db.links.push(l); linkIds[l.id] = true; added++; }
    });
    save(db);
    return { ok: true, db: db, added: added };
  }

  function resetAll() {
    _cache = emptyDb();
    save(_cache);
    return _cache;
  }

  // ---------- mật khẩu khoá màn hình (đơn giản, phía client) ----------
  function hashPass(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) { h = ((h << 5) + h) + str.charCodeAt(i); h |= 0; }
    return "h" + h.toString(36);
  }

  global.ZDB = {
    KEY: DB_KEY,
    PALETTE: PALETTE,
    WEEKDAY_LABELS: WEEKDAY_LABELS,
    load: load,
    save: save,
    emptyDb: emptyDb,
    uid: uid,
    nowTs: nowTs,
    removeTags: removeTags,
    slugify: slugify,
    normalizeSearch: normalizeSearch,
    isValidURL: isValidURL,
    formatRelativeTime: formatRelativeTime,
    addCategory: addCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory,
    reorderCategories: reorderCategories,
    addLink: addLink,
    updateLink: updateLink,
    deleteLink: deleteLink,
    toggleStar: toggleStar,
    touchView: touchView,
    getAllTags: getAllTags,
    renameTag: renameTag,
    deleteTag: deleteTag,
    reminderStatus: reminderStatus,
    dueReminders: dueReminders,
    exportJSON: exportJSON,
    importJSON: importJSON,
    validateImport: validateImport,
    resetAll: resetAll,
    hashPass: hashPass
  };
})(window);
