function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}
function getDeviceType() {
  const userAgent = navigator.userAgent;
  if (/CocCocBrowser/i.test(userAgent)) {
    return "Cốc Cốc";
  } else if (/iPhone/i.test(userAgent)) {
    return "iPhone";
  } else if (/iPad/i.test(userAgent)) {
    return "iPad";
  } else if (/iPod/i.test(userAgent)) {
    return "iPod";
  } else if (/Android/i.test(userAgent)) {
    return "Android";
  } else {
    return "PC";
  }
}
function convertToMinutes(day, hour, minute) {
  return day * 24 * 60 + hour * 60 + minute;
}
function c(string) {
  console.log(string);
}
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
var links;
function linkss() {
  links = document.querySelectorAll(".link-with-favicon");
  links.forEach(async (link) => {
    var url = "";
    if (!isMobile()) {
      url = link.href;
    } else {
      url = link.getAttribute("link");
    }

    try {
      let faviconUrl;
      if (url.includes("github.io")) {
        faviconUrl = await getFaviconUrl(url);
      } else if (url.includes("youtube")) {
        faviconUrl = "https://www.youtube.com/favicon.ico";
      } else if (url.startsWith("file:///")) {
        faviconUrl =
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKc4f1B7TETp0s2EH9LvCiSU6TyYXsm1ewiQ&usqp=CAU";
      } else if (!isValidURL(url)) {
        faviconUrl =
          "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_640.png";
      } else {
        faviconUrl =
          `https://www.google.com/s2/favicons?sz=64&domain_url=` + url;
      }
      link.style.backgroundImage = `url('${faviconUrl}')`;
    } catch (error) {
      link.style.backgroundImage = `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtihiUrRht07teu-KiMQpuLIj7XCSuquhWrQ&usqp=CAU')`;
    }
  });
}

function getFaviconUrl(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const faviconLink =
          doc.querySelector("link[rel='icon']") ||
          doc.querySelector("link[rel='shortcut icon']");
        if (faviconLink) {
          const faviconUrl = faviconLink.getAttribute("href");
          resolve(new URL(faviconUrl, url).href); // Resolve absolute URL
        } else {
          reject("Không thể tìm thấy favicon.");
        }
      })
      .catch(() => {
        reject("Lỗi khi tải trang.");
      });
  });
}
const divMain = document.getElementById("div_scroll");

// Xử lý sự kiện cuộn bằng chuột
divMain.addEventListener("wheel", function (event) {
  event.preventDefault();
  divMain.scrollTop += event.deltaY;
});

// Biến để theo dõi trạng thái vuốt
let isTouching = false;
let touchStartY = 0;

// Xử lý sự kiện bắt đầu chạm
divMain.addEventListener("touchstart", function (event) {
  isTouching = true;
  touchStartY = event.touches[0].clientY;
});

// Xử lý sự kiện di chuyển ngón tay trên màn hình
divMain.addEventListener("touchmove", function (event) {
  event.preventDefault();
  if (!isTouching) return;

  const touchCurrentY = event.touches[0].clientY;
  const touchDeltaY = touchStartY - touchCurrentY;

  divMain.scrollTop += touchDeltaY;

  // Cập nhật lại tọa độ bắt đầu chạm để cho lần di chuyển tiếp theo
  touchStartY = touchCurrentY;
});

// Xử lý sự kiện kết thúc chạm
divMain.addEventListener("touchend", function (event) {
  isTouching = false;
});

let scrollInterval;
function startScrolling(scrollAmount) {
  scrollInterval = setInterval(function () {
    const divMain = document.getElementById("div_scroll");
    const currentScroll = divMain.scrollTop;
    divMain.scrollTop = currentScroll + scrollAmount;
  }, 100); // Thực hiện cuộn mỗi 100ms
}
function stopScrolling() {
  clearInterval(scrollInterval); // Dừng cuộn khi nhả nút
}
document.getElementById("scroll_up").addEventListener("mousedown", function () {
  startScrolling(-100); // Cuộn lên 50px
});
document
  .getElementById("scroll_up")
  .addEventListener("touchstart", function () {
    startScrolling(-100); // Cuộn lên 50px
  });
document
  .getElementById("scroll_down")
  .addEventListener("mousedown", function () {
    startScrolling(100); // Cuộn xuống 50px
  });
document
  .getElementById("scroll_down")
  .addEventListener("touchstart", function () {
    startScrolling(100); // Cuộn xuống 50px
  });
document.addEventListener("mouseup", stopScrolling);
document.addEventListener("touchend", stopScrolling);

var title = [
  "AI",
  "Anime",
  "<i class='fa-brands fa-css3-alt' style='color: #00e1ff'></i> Css",
  "File",
  "<i class='fab fa-github' style='color: black'></i> Github",
  "<i class='fa-brands fa-js' style='color: #ffea00;'></i> Js",
  "<i class='fa-solid fa-couch' style='color: #664600;'></i> MXH",
  "<i class='fa-solid fa-book' style='color: #b38300'></i> Study",
  "<i class='fa-solid fa-brain' style='color: #949494;'></i> Tips",
  "ZZ",
];
function removeIcon(titles) {
  // Tạo một bản sao của mảng titles để tránh thay đổi trực tiếp mảng gốc
  const titlesCopy = titles.slice();

  for (let i = 0; i < titlesCopy.length; i++) {
    if (titlesCopy[i].startsWith("<")) {
      // Tìm vị trí của ký tự cuối cùng trước khoảng trắng trước khi ký tự "<"
      const lastSpaceIndex = titlesCopy[i].lastIndexOf(" ");
      // Loại bỏ phần từ index đến cuối mảng
      titlesCopy[i] = titlesCopy[i].substring(lastSpaceIndex + 1);
    }
  }
  return titlesCopy;
}
function removeTags(str) {
  return str.replace(/<\/?[^>]+>/gi, "");
}
function remove_space(str) {
  return str.replace(/\s+/g, "");
}
function remove_space_from_array(arr) {
  return arr.map((item) => remove_space(item));
}
// Sử dụng hàm để loại bỏ biểu tượng từ mảng title và lưu vào mảng mới title_no_icon
var title_no_icon = removeIcon(title);
var link = [];
var note = [];
console_data();
var star = [];
function console_star(note_add, add_or_remove) {
  if (note_add == "") {
    star = JSON.parse(localStorage.getItem("star")) || [];
    let clean_notes = remove_space_from_array(
      note.map((item) => removeTags(item))
    );
    star = star.filter((item) => clean_notes.includes(item));
    star = [...new Set(star)];
    localStorage.setItem("star", JSON.stringify(star));
  } else {
    var note_add = removeTags(remove_space(note_add));
    if (add_or_remove === "add") {
      star = JSON.parse(localStorage.getItem("star")) || [];
      star.push(note_add);
      localStorage.setItem("star", JSON.stringify(star));
    } else if (add_or_remove === "remove") {
      star = JSON.parse(localStorage.getItem("star")) || [];
      star = star.filter((item) => item !== note_add);
      localStorage.setItem("star", JSON.stringify(star));
    }
  }
  danh_dau();
}
console_star("", "");
function danh_dau() {
  var div_stars = document.querySelectorAll(".star");
  div_stars.forEach(function (div_star) {
    var star_value = div_star.getAttribute("for");
    var div_link = div_star.parentElement;
    var div_link_value = div_link.getAttribute("for");
    var index = star.indexOf(star_value);

    if (index !== -1) {
      div_star.style.display = "block";
      if (div_link_value.startsWith(".")) {
      } else {
        div_link.setAttribute("for", "." + div_link_value);
      }
    } else {
      div_star.style.display = "none";
      // Kiểm tra nếu div_link_value bắt đầu bằng dấu chấm, loại bỏ nó
      if (div_link_value.startsWith(".")) {
        div_link_value = div_link_value.substring(1);
      }
      div_link.setAttribute("for", div_link_value);
    }
  });

  let divScroll = document.getElementById("div_scroll");
  let search = document.getElementById("searchInput").value;
  sortDivLinks(search, divScroll);
}

function fixDuplicateNotes() {
  // Đối với mỗi phần tử trong mảng, kiểm tra xem phần tử đó có xuất hiện lặp lại không
  var bool = false;
  for (let i = 0; i < note.length; i++) {
    let count = 1; // Đếm số lần xuất hiện của phần tử
    for (let j = i + 1; j < note.length; j++) {
      if (note[i] === note[j]) {
        bool = true;
        count++;
        var notes = note[j].split("<br>");
        if (notes.length == 3) {
          var note_0 = note[j].split("<br>")[0];
          var note_1 = note[j].split("<br>")[1];
          var note_2 = note[j].split("<br>")[2];
          if (note_1.trim() == "") {
            note[j] = `${note_0}<br>${note_1} ${count}<br>${note_2}`;
          } else if (note_2.trim() == "") {
            note[j] = `${note_0}<br>${note_1}<br>${note_2} ${count}`;
          }
        } else {
          note[j] = `${note[j]} ${count}`; // Sửa phần tử lặp lại thành "phần_tử count"
        }
      }
    }
  }
  if (bool) {
    create_data(link, note);
  }
}
fixDuplicateNotes();

function undate_date_anime() {
  var now = new Date();
  var currentDay = now.getDay();
  var currentHour = now.getHours();
  var currentMinute = now.getMinutes();

  // Chuyển đổi ngày hiện tại từ 0 (Chủ nhật) thành 8
  if (currentDay === 0) {
    currentDay = 8;
  } else {
    currentDay = currentDay + 1;
  }
  let note_anime2 = [];
  let currentTotalMinutes = convertToMinutes(
    currentDay,
    currentHour,
    currentMinute
  );
  if (note.length !== 0) {
    var note_anime = note.filter((note) => note.startsWith("Anime"));
    note_anime.map((element) => {
      // Chia nhỏ chuỗi bằng <br>
      let parts = element.split("<br>");
      // Lấy phần tử cuối cùng
      let lastPart = parts[parts.length - 1];
      // Kiểm tra xem phần tử cuối cùng có định dạng (new day-hour-min) không và day từ 2 đến 8
      let match = lastPart.match(/\(new ([2-8])-([0-9]{2})-([0-9]{2})\)/);
      if (match) {
        let day = parseInt(match[1]);
        let hour = parseInt(match[2]);
        let minute = parseInt(match[3]);
        let targetTotalMinutes = convertToMinutes(day, hour, minute);
        let nextDayTotalMinutes = targetTotalMinutes + 24 * 60;
        // So sánh với ngày, giờ, phút hiện tại
        if (
          currentTotalMinutes >= targetTotalMinutes &&
          currentTotalMinutes <= nextDayTotalMinutes
        ) {
          note_anime2.push(element);
        }
      }
    });
    thong_bao_anime(note_anime2);
  }
}
setInterval(undate_date_anime, 60000);
function thong_bao_anime(note_anime2) {
  var div_thong_bao = document.querySelectorAll(".thong_bao");
  div_thong_bao.forEach(function (div) {
    let thong_bao_value = div.getAttribute("for");
    let index_thong_bao = note_anime2.indexOf(thong_bao_value);
    if (index_thong_bao !== -1) {
      div.style.backgroundColor = "lightgreen";
      div.style.borderWidth = 1 + "px";
    } else {
      div.style.backgroundColor = "rgba(144, 238, 144, 0)";
      div.style.borderWidth = 0 + "px";
    }
  });
}
function canh_bao_link() {
  var div_canh_bao = document.querySelectorAll(".canh_bao");
  div_canh_bao.forEach(function (div) {
    let link_value = div.getAttribute("for");
    if (link_value.startsWith("http://")) {
      div.style.display = "block";
    }
  });
}
var what_title = "All";
var items = [];
function item(what_title) {
  if (what_title == "All") {
    items = note.slice(); // Sao chép toàn bộ mảng note vào mảng items
  } else {
    var items = note.filter((icon_note) =>
      icon_note./*includes*/ startsWith(what_title)
    );
  }
  return items;
}
items = item(what_title);

function title_pick(titles) {
  var legend = document.getElementById("legend");
  var searchInputt = document.getElementById("searchInput");
  searchInputt.value = "";
  var indexx = title_no_icon.indexOf(titles);
  if (indexx !== -1) {
    legend.innerHTML = title[indexx];
  } else {
    legend.innerHTML = titles;
  }
  what_title = titles;
  items = item(what_title);
  create_icon(titles);
}
function sortDivLinks(searchValue, divScroll) {
  const divLinks = Array.from(divScroll.children);
  divLinks.sort((a, b) => {
    const aValue = a.getAttribute("for").toLowerCase();
    const bValue = b.getAttribute("for").toLowerCase();

    const aSimilarity = aValue.indexOf(searchValue) !== -1 ? 1 : 0;
    const bSimilarity = bValue.indexOf(searchValue) !== -1 ? 1 : 0;

    // Kiểm tra nếu giá trị bắt đầu bằng dấu chấm "."
    const aStartsWithDot = aValue.startsWith(".") ? 1 : 0;
    const bStartsWithDot = bValue.startsWith(".") ? 1 : 0;

    // Nếu cả hai đều bắt đầu hoặc không bắt đầu bằng dấu chấm, sắp xếp theo độ tương tự và chữ "ừ"
    if (aStartsWithDot !== bStartsWithDot) {
      return bStartsWithDot - aStartsWithDot;
    } else if (aSimilarity !== bSimilarity) {
      return bSimilarity - aSimilarity;
    } else if (aValue.includes("ừ") && !bValue.includes("ừ")) {
      return 1;
    } else if (!aValue.includes("ừ") && bValue.includes("ừ")) {
      return -1;
    } else {
      return aValue.localeCompare(bValue);
    }
  });

  divLinks.forEach((divLink) => divScroll.appendChild(divLink));
}

function create_icon() {
  const divScroll = document.getElementById("div_scroll");
  divScroll.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    // Tìm vị trí của items[i] trong note
    var index = note.indexOf(items[i]);
    if (index !== -1) {
      var div_link = document.createElement("div");

      div_link.className = "div_link";
      div_link.setAttribute("for", removeTags(remove_space(items[i])));
      if (note[i].startsWith("ZZ") || note[i].startsWith(".ZZ")) {
        if (!ZZ_on) {
          div_link.style.display = "none";
        }
      }
      var star = document.createElement("div");
      star.className = "star";
      star.setAttribute("for", removeTags(remove_space(items[i])));

      var a = document.createElement("a");
      a.setAttribute("for", items[i]);
      if (!isMobile()) {
        a.setAttribute("target", "_blank");
        a.href = link[index];
      } else {
        a.setAttribute("link", link[index]);
      }
      a.className = "link-with-favicon eff_a";

      div_link.appendChild(a);
      div_link.appendChild(star);
      if (items[i].startsWith("Anime")) {
        var thong_bao = document.createElement("div");
        thong_bao.className = "thong_bao";
        thong_bao.setAttribute("for", items[i]);
        div_link.appendChild(thong_bao);
      }
      var canh_bao = document.createElement("div");
      canh_bao.className = "canh_bao";
      canh_bao.setAttribute("for", link[index]);
      div_link.appendChild(canh_bao);

      divScroll.appendChild(div_link);
    }
    linkss();
  }
  danh_dau();
  sortDivLinks(".", divScroll);
  undate_date_anime();
  canh_bao_link();
  var div_link = document.createElement("div");
  var a = document.createElement("a");
  a.className = "button_add link-with-favicon";

  div_link.className = "div_link";
  div_link.setAttribute("for", "ừ");
  a.style.backgroundImage = `url('https://png.pngtree.com/element_our/20190523/ourmid/pngtree-green-plus-sign-simple-logo-image_1082145.jpg')`;
  a.onclick = function () {
    close();
  };
  div_link.appendChild(a);
  div_scroll.appendChild(div_link);
}
var ZZ_on = false;
function create_option(bool) {
  if (bool === undefined || bool === null) {
    ZZ_on = JSON.parse(localStorage.getItem("open_file_ẩn")) || false;
  } else {
    ZZ_on = bool;
  }
  title_pick("All");

  var select1 = document.getElementById("select");
  var select2 = document.getElementById("mySelect");
  var select3 = document.getElementById("select_edit");
  select1.innerHTML = "";
  select2.innerHTML = "";
  select3.innerHTML = "";

  var option2 = document.createElement("option");
  option2.value = "All";
  option2.textContent = "All";
  select1.appendChild(option2);
  var length = ZZ_on ? title_no_icon.length : title_no_icon.length - 1;

  for (var i = 0; i < length; i++) {
    // Tạo option1 cho select1
    var option1 = document.createElement("option");
    option1.value = title_no_icon[i];
    if (title_no_icon[i] === "ZZ") {
      option1.textContent = "Link ẩn";
    } else {
      option1.textContent = title_no_icon[i];
    }
    select1.appendChild(option1);

    var option2 = option1.cloneNode(true);
    select2.appendChild(option2);

    var option3 = option1.cloneNode(true);
    select3.appendChild(option3);
  }
  localStorage.setItem("open_file_ẩn", JSON.stringify(ZZ_on));
}
create_option();

function create_data(link, note) {
  var data = { linksss: link, notesss: note, titlesss: title };
  localStorage.setItem("data", JSON.stringify(data));
}

function console_data() {
  if (localStorage.getItem("data")) {
    var retrievedData = JSON.parse(localStorage.getItem("data"));
    var link_data = retrievedData.linksss;
    var note_data = retrievedData.notesss;
    var title_data = retrievedData.titlesss;
    console.log("Icons:", link_data.length);
    var thiet_bi = getDeviceType();
    document.getElementById("whaticon").innerHTML =
      "Icons :" +
      link_data.length +
      "<br>" +
      thiet_bi +
      "<br>" +
      "Titles :" +
      title_data.length;
    link = link_data;
    note = note_data;
  } else {
    setTimeout(() => {
      var div_scroll = document.getElementById("div_scroll");
      var div = document.createElement(div);
      div.style =
        "width: 200px;font-size:20px;position: fixed;left:calc(50% - 65px);top:calc(50% - 65px)";
      div.textContent = "Chưa có dữ liệu";
      div_scroll.appendChild(div);
    }, 1000);
  }
}
function add_data(link, note) {
  let retrievedData = JSON.parse(localStorage.getItem("data"));
  retrievedData.linksss.push(link); // Thêm vào mảng linksss
  retrievedData.notesss.push(note); // Thêm vào mảng notesss
  localStorage.setItem("data", JSON.stringify(retrievedData));
  location.reload();
}
function remove_data(remove_note) {
  // Hiển thị hộp thoại tùy chỉnh
  document.getElementById("class_box2_remove").style.display = "block";
  document.getElementById("noteToDelete").innerHTML = remove_note;

  // Xử lý nút "Yes"
  document.getElementById("confirmYes").onclick = function () {
    var retrievedData = JSON.parse(localStorage.getItem("data"));
    var index = retrievedData.notesss.indexOf(remove_note);
    if (index !== -1) {
      retrievedData.notesss.splice(index, 1);
      retrievedData.linksss.splice(index, 1);
    }
    localStorage.setItem("data", JSON.stringify(retrievedData));
    console_data();
    console_star("", "");
    title_pick(what_title);
    document.getElementById("class_box2_remove").style.display = "none";
  };

  // Xử lý nút "No"
  document.getElementById("confirmNo").onclick = function () {
    document.getElementById("class_box2_remove").style.display = "none";
  };
}
function selectOptionByValue(selectElement, value) {
  for (let i = 0; i < selectElement.options.length; i++) {
    if (selectElement.options[i].value === value) {
      selectElement.selectedIndex = i;
      break;
    }
  }
}
function edit_data(edit_note, link_value) {
  document.getElementById("class_box2_edit").style.display = "block";
  var link_input = document.getElementById("link_edit");
  var note1_input = document.getElementById("note1_edit");
  var note2_input = document.getElementById("note2_edit");
  var selectEdit = document.getElementById("select_edit");

  link_input.value = link_value;

  var notes = edit_note.split("<br>");
  if (notes.length == 3) {
    selectOptionByValue(selectEdit, notes[0].trim());
    note1_input.value = notes[1];
    note2_input.value = notes[2];
  } else if (notes.length == 2) {
    selectOptionByValue(selectEdit, notes[0].trim());
    note1_input.value = notes[1];
    note2_input.value = ""; // clear the second note if it doesn't exist
  } else {
    selectOptionByValue(selectEdit, notes[0].trim());
    note1_input.value = "";
    note2_input.value = "";
  }

  document.getElementById("save_edit").onclick = function () {
    var new_note =
      selectEdit.value +
      "<br>" +
      note1_input.value +
      "<br>" +
      note2_input.value;
    var new_link = link_input.value;
    var retrievedData = JSON.parse(localStorage.getItem("data"));
    var index = retrievedData.notesss.indexOf(edit_note);
    if (index !== -1) {
      if (link[index] !== new_link) {
        retrievedData.linksss[index] = new_link;
      }
      if (note[index] !== new_note) {
        retrievedData.notesss[index] = new_note;
        var index_star = star.indexOf(removeTags(remove_space(note[index])));
        if (index_star !== -1) {
          console_star(new_note, "add");
        }
      }
    }
    localStorage.setItem("data", JSON.stringify(retrievedData));
    console_data();
    title_pick(what_title);
    document.getElementById("class_box2_edit").style.display = "none";
  };

  document.getElementById("cancel_edit").onclick = function () {
    document.getElementById("class_box2_edit").style.display = "none";
  };
}
var go_ = false;
function go_link(href) {
  if (!go_) {
    window.open(href);
    go_ = true;
    go__();
  }
}
function go__() {
  setTimeout(() => {
    go_ = false;
  }, 500);
}
var window_width = window.innerWidth;
document.addEventListener("DOMContentLoaded", function () {
  const divScroll = document.getElementById("div_scroll");
  const whaticon = document.getElementById("whaticon");

  divScroll.addEventListener("mouseover", function (event) {
    var elements = document.querySelectorAll(".eff_a");
    elements.forEach(function (element) {
      if (isMobile()) {
        let clickCount = 0;
        let clickTimeout;

        element.addEventListener("click", function (event) {
          clickCount++;
          if (clickCount === 1) {
            clickTimeout = setTimeout(function () {
              var href = event.target.getAttribute("link");
              if (href) {
                go_link(href);
                event.preventDefault();
              }
              clickCount = 0;
            }, 300);
          } else if (clickCount === 2) {
            clearTimeout(clickTimeout);
            handleRightClick(event);
            clickCount = 0;
          }
        });
      }
      element.addEventListener("contextmenu", handleRightClick);
    });
    if (event.target.classList.contains("eff_a")) {
      const forValue = event.target.getAttribute("for");
      whaticon.innerHTML = `${forValue}`;
      document.getElementById("whaticon").style = "font-weight: bold";
    } else if (event.target.classList.contains("button_add")) {
      whaticon.innerHTML = `<p style="font-size:30px;transform: translateY(-17.5px);">Thêm icon mới</p>`;
    }
  });
  document.addEventListener("mouseover", function (event) {
    if (event.target.classList.contains("select_t")) {
      whaticon.innerHTML = `<p style="font-size:30px;transform: translateY(-17.5px);">Pick title</p>`;
    } else if (event.target.classList.contains("pick_excel")) {
      whaticon.innerHTML = `<p style="font-size:30px;transform: translateY(-17.5px);">Pick file</p>`;
    } else if (event.target.classList.contains("scroll_up")) {
      whaticon.innerHTML = `<p style="font-size:30px;transform: translateY(-17.5px);">Cuộn lên</p>`;
    } else if (event.target.classList.contains("scroll_down")) {
      whaticon.innerHTML = `<p style="font-size:30px;transform: translateY(-17.5px);">Cuộn xuống</p>`;
    } else if (event.target.classList.contains("what-icon")) {
      whaticon.innerHTML = `Khung Name List`;
      document.getElementById("whaticon").style =
        "font-size: 20px;align-items: center;display: flex;justify-content: center;";
    } else if (event.target.classList.contains("btn_tim")) {
      whaticon.innerHTML = `<p style="font-size:30px;transform: translateY(-17.5px);">Reload</p>`;
    } else if (event.target.classList.contains("searchInput")) {
      whaticon.innerHTML = `<p style="font-size:30px;transform: translateY(-17.5px);">Search</p>`;
    } else if (event.target.classList.contains("fa-solid")) {
      whaticon.innerHTML = `<p style="font-size:30px;transform: translateY(-17.5px);">Reload</p>`;
    }
  });
  document.addEventListener("mouseout", function (event) {
    if (
      event.target.classList.contains("select_t") ||
      event.target.classList.contains("pick_excel") ||
      event.target.classList.contains("scroll_up") ||
      event.target.classList.contains("scroll_down") ||
      event.target.classList.contains("btn_tim") ||
      event.target.classList.contains("searchInput") ||
      event.target.closest(".what-icon")
    ) {
      whaticon.innerHTML = "Title<br/>Note 1<br/>Note 2";
      document.getElementById("whaticon").style =
        "font-size: 16px;display:block";
    }
  });
  divScroll.addEventListener("mouseout", function (event) {
    if (
      event.target.classList.contains("link-with-favicon") ||
      event.target.classList.contains("button_add")
    ) {
      whaticon.innerHTML = "Title<br/>Note 1<br/>Note 2";
      document.getElementById("whaticon").style = "font-weight: none";
    }
  });

  const draggable = document.querySelector("#draggable");
  var hoverTargets = document.querySelectorAll("#div_scroll .div_link .eff_a");

  const defaultContent = "Title<br/>Note 1<br/>Note 2";

  const checkHover = (draggableRect) => {
    let isHoveringAny = false;
    hoverTargets.forEach((target) => {
      const targetRect = target.getBoundingClientRect();
      const isHovering = !(
        draggableRect.right < targetRect.left ||
        draggableRect.left > targetRect.right ||
        draggableRect.bottom < targetRect.top ||
        draggableRect.top > targetRect.bottom
      );

      if (isHovering) {
        isHoveringAny = true;
        if (target.classList.contains("eff_a")) {
          const forValue = target.closest(".eff_a").getAttribute("for");
          var href = "";
          if (!isMobile()) {
            href = target.href;
          } else {
            href = target.getAttribute("link");
          }
          setWhaticonContent(forValue, "font-weight: bold;");
          let button = document.querySelector(".button");
          button.style.display = "block";
          button.onclick = function () {
            window.open(href);
          };
        } else {
        }
      }
    });

    if (!isHoveringAny) {
      setWhaticonContent(defaultContent, "font-weight: normal;");
      let button = document.querySelector(".button");
      button.style.display = "none";
    }
  };

  // Ẩn box2 khi click ra ngoài phần tử eff_a
  document.addEventListener("click", function (event) {
    var isClickInside = event.target.closest(".eff_a");

    if (!isClickInside) {
      box_2_id.style.display = "none";
    }
  });

  function setWhaticonContent(content, style) {
    var whaticon = document.getElementById("whaticon"); // Thay đổi selector này nếu cần
    if (whaticon) {
      whaticon.innerHTML = content;
      whaticon.style = style;
    }
  }
  let isDragging = false;

  function handleStart(event) {
    if (!isDragging) {
      isDragging = true;
      startDrag(event);
      hoverTargets = document.querySelectorAll("#div_scroll .div_link .eff_a");
    }
  }

  function handleEnd() {
    isDragging = false;
  }

  draggable.addEventListener("mousedown", handleStart);
  draggable.addEventListener("touchstart", handleStart);

  document.addEventListener("mouseup", handleEnd);
  document.addEventListener("touchend", handleEnd);

  function startDrag(event) {
    event.preventDefault();

    let shiftX, shiftY;

    if (event.type === "mousedown") {
      shiftX = event.clientX - draggable.getBoundingClientRect().left;
      shiftY = event.clientY - draggable.getBoundingClientRect().top;
    } else {
      shiftX =
        event.touches[0].clientX - draggable.getBoundingClientRect().left;
      shiftY = event.touches[0].clientY - draggable.getBoundingClientRect().top;
    }

    const moveAt = (pageX, pageY) => {
      draggable.style.left = pageX - shiftX + "px";
      draggable.style.top = pageY - shiftY + "px";
      let button = document.querySelector(".button");
      button.style.left = pageX - shiftX - 25 + "px";
      button.style.top = pageY - shiftY + 70 + "px";
      const draggableRect = draggable.getBoundingClientRect();
      checkHover(draggableRect);
    };

    const onMouseMove = (event) => {
      if (event.type === "mousemove") {
        moveAt(event.pageX, event.pageY);
      } else {
        moveAt(event.touches[0].pageX, event.touches[0].pageY);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onMouseMove);
      document.removeEventListener("touchend", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchmove", onMouseMove);
    document.addEventListener("touchend", onMouseUp);

    draggable.ondragstart = () => false;
  }

  var box_2_id = document.getElementById("box_2");
  var box2_class = document.querySelectorAll(".box2");

  function handleRightClick(event) {
    event.preventDefault(); // Prevent the default context menu from appearing
    let forValue = event.target.getAttribute("for");
    let href1 = event.target.href;
    let href2 = event.target.getAttribute("link");
    let href = href1 || href2;
    document.querySelectorAll(".box2 li").forEach(function (li, index) {
      if (index === 0) {
        li.onclick = function () {
          edit_data(forValue, href);
          box_2_id.style.display = "none";
        };
      }
      // Cài đặt thuộc tính href cho li thứ hai (nếu cần)
      if (index === 1) {
        let danhdau = document.getElementById("danhdau");
        let indexx = star.indexOf(removeTags(remove_space(forValue)));

        if (indexx !== -1) {
          // Nếu giá trị tồn tại trong mảng
          danhdau.style.color = "black";
          li.onclick = function () {
            console_star(forValue, "remove");
            box_2_id.style.display = "none";
          };
        } else {
          // Nếu giá trị không tồn tại trong mảng
          danhdau.style.color = "rgba(0, 0, 0, 0)";
          li.onclick = function () {
            console_star(forValue, "add");
            box_2_id.style.display = "none";
          };
        }
      }
      if (index === 2) {
        li.onclick = function () {
          navigator.clipboard
            .writeText(href)
            .then(function () {
              box_2_id.style.display = "none";
              alert("Liên kết đã được sao chép vào clipboard!");
            })
            .catch(function (error) {
              console.error("Không thể sao chép liên kết: ", error);
            });
        };
      }
      if (index === 3) {
        li.onclick = function () {
          window.open(href, "_blank");
          box_2_id.style.display = "none";
        };
      }
      if (index === 4) {
        li.onclick = function () {
          box_2_id.style.display = "none";
          remove_data(forValue);
        };
      }
    });
    box2_class.forEach(function (element) {
      if (window_width - 120 < event.clientX) {
        element.style.left = event.clientX - 120 + "px";
      } else {
        element.style.left = event.clientX + "px";
      }
      element.style.top = event.clientY + 15 + "px";
    });
    box_2_id.style.display = "block";
  }
  // Ngăn chặn sự kiện click trên phần tử fixed nổi bọt lên document
  box_2_id.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  var searchInput = document.getElementById("searchInput");
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Ngăn chặn reload trang
      var searchInputValue = document.getElementById("searchInput").value; // Lấy giá trị của input

      if (searchInputValue == "0809") {
        if (ZZ_on) {
          create_option(false);
        } else {
          create_option(true);
        }
        document.getElementById("whaticon").innerHTML =
          "aaaaaaaaa <br>aaaaaaaaa <br>aaaaaaaaa";
      } else {
        location.reload();
      }
    });
  searchInput.addEventListener("input", function () {
    const searchValue = remove_space(searchInput.value.toLowerCase());
    const divScroll = document.getElementById("div_scroll");
    sortDivLinks(searchValue, divScroll);
  });

  function handleFile(e) {
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        workbook1 = XLSX.read(data, { type: "array" });

        firstSheetName1 = workbook1.SheetNames[0];
        const worksheet = workbook1.Sheets[firstSheetName1];
        const jsonData = XLSX.utils.sheet_to_json(worksheet); // Chuyển đổi dữ liệu thành định dạng JSON
        link = [];
        note = [];
        jsonData.forEach((row) => {
          if (row.Link) {
            link.push(row.Link);
          }
          if (row.Note) {
            note.push(row.Note);
          }
        });

        create_data(link, note);
        console_data();
        anime_tap_moi = undate_date_anime();
        title_pick("All");
      };

      reader.readAsArrayBuffer(file); // Đọc tệp dưới dạng ArrayBuffer
    } catch (error) {
      console.error("Error fetching or processing the Excel file:", error);
    }
  }
  let workbook;
  let firstSheetName;
  function handleFile2(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      workbook = XLSX.read(data, { type: "array" });
      firstSheetName = workbook.SheetNames[0];
    };
    reader.readAsArrayBuffer(file);
  }
  var newLinks;
  var newNotes;
  var newtitle;
  function excell() {
    let new1 = check_add();
    let bool = new1[0];
    if (!bool) {
      console.log("false");
      return;
    }
    newLinks = new1[2];
    newNotes = new1[1];
    newtitle = new1[3];
    addAndSortData();
  }
  function addAndSortData() {
    // Thêm dữ liệu mới vào bảng tính Excel
    addDataToExcel();

    // Sắp xếp dữ liệu theo cột "Title"
    sortDataByTitle();
  }

  function addDataToExcel() {
    if (!workbook || !firstSheetName) {
      alert("Vui lòng thêm file Excel trước.");
      return;
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const linkIndex = jsonData[0].indexOf("Link");
    const noteIndex = jsonData[0].indexOf("Note");
    const titleIndex = jsonData[0].indexOf("Title");

    if (linkIndex === -1 || noteIndex === -1 || titleIndex === -1) {
      alert(
        "Không tìm thấy cột 'Link', 'Note', hoặc 'Title' trong file Excel."
      );
      return;
    }

    // Tìm hàng trống đầu tiên
    let emptyRow = jsonData.find((row) => row.every((cell) => !cell));

    // Nếu không tìm thấy hàng trống, thêm dữ liệu vào hàng cuối cùng
    if (!emptyRow) {
      emptyRow = Array(jsonData[0].length).fill("");
      jsonData.push(emptyRow);
    }

    // Thêm dữ liệu mới vào hàng trống đầu tiên
    emptyRow[linkIndex] = newLinks;
    emptyRow[noteIndex] = newNotes;
    emptyRow[titleIndex] = newtitle;

    // Cập nhật bảng tính
    const newWorksheet = XLSX.utils.aoa_to_sheet(jsonData);
    workbook.Sheets[firstSheetName] = newWorksheet;
  }
  function sortDataByTitle() {
    if (!workbook || !firstSheetName) {
      alert("Vui lòng thêm file Excel trước.");
      return;
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const titleIndex = jsonData[0].indexOf("Title");
    if (titleIndex === -1) {
      alert("Không tìm thấy cột 'Title' trong file Excel.");
      return;
    }

    // Sắp xếp dữ liệu từ hàng thứ hai trở đi (bỏ qua header)
    const dataToSort = jsonData.slice(1);
    dataToSort.sort((a, b) => {
      return a[titleIndex].localeCompare(b[titleIndex]);
    });

    // Gộp dữ liệu đã sắp xếp lại với header
    const sortedData = [jsonData[0], ...dataToSort];

    const newWorksheet = XLSX.utils.aoa_to_sheet(sortedData);
    workbook.Sheets[firstSheetName] = newWorksheet;

    // Xuất file Excel
    exportExcel();
  }

  function exportExcel() {
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "updated_file.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Hàm chuyển đổi chuỗi sang ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  // Gắn sự kiện change cho input type=file
  document
    .getElementById("input-excel")
    .addEventListener("change", handleFile, false);
  document
    .getElementById("input-excel2")
    .addEventListener("change", handleFile2, false);
  document.getElementById("add-link2").addEventListener("click", excell, false);
});

document
  .getElementById("add-link")
  .addEventListener("click", addLinkAndNoteToKey, false);
document.getElementById("close").addEventListener("click", close, false);

function close() {
  let box_ = document.getElementById("box_");
  if (box_.style.display === "flex") {
    box_.style.display = "none";
  } else {
    box_.style.display = "flex";
  }
}
function check_add() {
  let selectedValue = document.getElementById("mySelect").value;
  //var selectedValue2;
  let input_note1 = document.getElementById("note1_input").value;
  let input_note2 = document.getElementById("note2_input").value;
  let input_link = document.getElementById("link_input").value;
  //var indexxx = title_no_icon.indexOf(`${selectedValue}`);
  // if (indexxx !== -1) {
  //   selectedValue2 = title[indexxx];
  // }
  if (selectedValue == "File") {
    if (input_link.startsWith("file:///")) {
      alert("Đường liên kết file không hợp lệ");
    }
  } else if (!isValidURL(input_link)) {
    alert("Đường liên kết http/https không hợp lệ");
    return [false, "", "", ""];
  }
  if (input_link === "") {
    alert("Vui lòng nhập Link");
    return [false, "", "", ""];
  }

  return [
    true,
    `${selectedValue /*2*/}` + "<br>" + input_note1 + "<br>" + input_note2,
    input_link,
    `${selectedValue}`,
  ];
}

function addLinkAndNoteToKey() {
  let a = check_add();
  let bool = a[0];
  if (!bool) {
    return;
  }
  let link_a = a[2];
  let note_a = a[1];
  add_data(link_a, note_a);
}

function setDivHeight() {
  let divScroll = document.getElementById("div_scroll");
  let windowHeight = window.innerHeight;
  divScroll.style.height = windowHeight - 195 + "px";
  window_width = window.innerWidth;
}
window.onload = setDivHeight;
window.onresize = setDivHeight;
