function isMobile() {
            return /Mobi|Android/i.test(navigator.userAgent);
}
var links;
function linkss() {
  links = document.querySelectorAll(".link-with-favicon");
  links.forEach(async (link) => {
    const url = link.href;
    if (url.includes("github.io")) {
      getFaviconUrl(url)
        .then((faviconUrl) => {
          link.style.backgroundImage = `url('${faviconUrl}')`;
        })
        .catch(() => {
          link.style.backgroundImage = `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtihiUrRht07teu-KiMQpuLIj7XCSuquhWrQ&usqp=CAU')`;
        });
    } else if (url.includes("youtube")) {
      link.style.backgroundImage = `url('https://www.youtube.com/favicon.ico')`;
    } else if (url.startsWith("file:///")) {
      link.style.backgroundImage = `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKc4f1B7TETp0s2EH9LvCiSU6TyYXsm1ewiQ&usqp=CAU')`;
    } else if (!isValidURL(url)) {
      link.style.backgroundImage = `url('https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_640.png')`;
    } else {
      const faviconUrl =
        `https://www.google.com/s2/favicons?sz=64&domain_url=` + url + "/";
      link.style.backgroundImage = `url('${faviconUrl}')`;
    }
  });
}

linkss();
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
          resolve(faviconUrl);
        } else {
          reject("Không thể tìm thấy favicon.");
        }
      })
      .catch(() => {
        reject("Lỗi khi tải trang.");
      });
  });
}

let scrollInterval;
document.getElementById("scroll_up").addEventListener("mousedown", function () {
  scrollInterval = setInterval(function () {
    const divMain = document.getElementById("div_scroll");
    const currentScroll = divMain.scrollTop;
    divMain.scrollTop = currentScroll - 50; // Cuộn lên 50px
  }, 100); // Thực hiện cuộn mỗi 100ms
});

document
  .getElementById("scroll_down")
  .addEventListener("mousedown", function () {
    scrollInterval = setInterval(function () {
      const divMain = document.getElementById("div_scroll");
      const currentScroll = divMain.scrollTop;
      divMain.scrollTop = currentScroll + 50; // Cuộn xuống 50px
    }, 100); // Thực hiện cuộn mỗi 100ms
  });

document.addEventListener("mouseup", function () {
  clearInterval(scrollInterval); // Dừng cuộn khi nhả nút
});
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
      console.log(star + "add");
    } else if (add_or_remove === "remove") {
      star = JSON.parse(localStorage.getItem("star")) || [];
      star = star.filter((item) => item !== note_add);
      localStorage.setItem("star", JSON.stringify(star));
      console.log(star + "remove");
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
      div_star.style.borderWidth = "7.5px";
      if (div_link_value.startsWith(".")) {
      } else {
        div_link.setAttribute("for", "." + div_link_value);
      }
    } else {
      div_star.style.borderWidth = "0px";
      // Kiểm tra nếu div_link_value bắt đầu bằng dấu chấm, loại bỏ nó
      if (div_link_value.startsWith(".")) {
        div_link_value = div_link_value.substring(1);
      }
      div_link.setAttribute("for", div_link_value);
    }
  });

  var divScroll = document.getElementById("div_scroll");
  var search = document.getElementById("searchInput").value;
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

var div_scroll = document.getElementById("div_scroll");
function create_icon() {
  const divScroll = document.getElementById("div_scroll");
  div_scroll.innerHTML = "";
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
      a.href = link[index];
      a.setAttribute("for", items[i]);
      if (!isMobile()) {
        a.setAttribute("target", "_blank");
      }
      a.className = "link-with-favicon eff_a";

      div_link.appendChild(a);
      div_link.appendChild(star);
      div_scroll.appendChild(div_link);
      linkss();
    }
  }
  danh_dau();
  sortDivLinks(".", divScroll);
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
title_pick("All");
var ZZ_on = false;
function create_option(bool) {
  if (bool === undefined || bool === null) {
    ZZ_on = false;
  } else {
    ZZ_on = bool;
    title_pick("All");
  }
  var select1 = document.getElementById("select");
  var select2 = document.getElementById("mySelect");
  select1.innerHTML = "";
  select2.innerHTML = "";

  var option2 = document.createElement("option");
  option2.value = "All";
  option2.textContent = "All";
  select1.appendChild(option2);
  var length = ZZ_on ? title_no_icon.length : title_no_icon.length - 1;

  for (var i = 0; i < length; i++) {
    // Tạo option1 cho select1
    var option1 = document.createElement("option");
    option1.value = title_no_icon[i];
    option1.textContent = title_no_icon[i];
    select1.appendChild(option1);

    var option2 = option1.cloneNode(true);
    select2.appendChild(option2);
  }
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
    console.log("Title :", title_data);
    document.getElementById("whaticon").textContent = link_data.length;
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
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
function add_data(link, note) {
  var retrievedData = JSON.parse(localStorage.getItem("data"));
  retrievedData.linksss.push(link); // Thêm vào mảng linksss
  retrievedData.notesss.push(note); // Thêm vào mảng notesss
  localStorage.setItem("data", JSON.stringify(retrievedData));
  location.reload();
}
function remove_data(remove_note) {
  let confirmed = confirm("Bạn có chắc chắn muốn thực hiện lệnh này không?");
  if (confirmed) {
    var retrievedData = JSON.parse(localStorage.getItem("data"));
    var index = retrievedData.notesss.indexOf(remove_note);
    if (index !== -1) {
      retrievedData.notesss.splice(index, 1);
      retrievedData.linksss.splice(index, 1);
    }
    localStorage.setItem("data", JSON.stringify(retrievedData));
    location.reload();
  } else {
    console.log("Người dùng đã hủy!");
    return;
  }
}
function getInputValues() {
  let input1 = prompt("Nhập giá trị thứ nhất:");
  if (input1 === null || input1 === "") {
    console.log("Bạn đã hủy hoặc không nhập giá trị thứ nhất.");
    return;
  }

  let input2 = prompt("Nhập giá trị thứ hai:");
  if (input2 === null || input2 === "") {
    console.log("Bạn đã hủy hoặc không nhập giá trị thứ hai.");
    return;
  }

  let input3 = prompt("Nhập giá trị thứ ba:");
  if (input3 === null || input3 === "") {
    console.log("Bạn đã hủy hoặc không nhập giá trị thứ ba.");
    return;
  }

  // Hiển thị thông báo với các giá trị đã nhập
  let message = `Bạn đã nhập các giá trị sau:\n\nInput 1: ${input1}\nInput 2: ${input2}\nInput 3: ${input3}`;
  alert(message);

  // Thực hiện các hành động khác với các giá trị nhận được ở đây...
  console.log("Giá trị thứ nhất:", input1);
  console.log("Giá trị thứ hai:", input2);
  console.log("Giá trị thứ ba:", input3);
}

function edit_data(link, note) {
  var retrievedData = JSON.parse(localStorage.getItem("data"));
  retrievedData.linksss.push(link); // Thêm vào mảng linksss
  retrievedData.notesss.push(note); // Thêm vào mảng notesss
  localStorage.setItem("data", JSON.stringify(retrievedData));
  location.reload();
}
var window_width = window.innerWidth;
document.addEventListener("DOMContentLoaded", function () {
  const divScroll = document.getElementById("div_scroll");
  const whaticon = document.getElementById("whaticon");

  // Sử dụng ủy quyền sự kiện
  divScroll.addEventListener("mouseover", function (event) {
    hoverTargets = document.querySelectorAll("#div_scroll .div_link .eff_a");
    var elements = document.querySelectorAll(".eff_a");
    elements.forEach(function (element) {
      element.addEventListener("contextmenu", handleRightClick);
      element.addEventListener("touchstart", handleRightTap);
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
  const defaultStyle = "font-weight: normal;";

  const setWhaticonContent = (html, style = defaultStyle) => {
    whaticon.innerHTML = html;
    whaticon.style = style;
  };

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
          setWhaticonContent(forValue, "font-weight: bold;");
          var button = document.querySelector(".button");
          button.onclick = () => window.open(target.closest(".eff_a").href);
        }
      }
    });

    if (!isHoveringAny) {
      setWhaticonContent(defaultContent);
    }
  };
  draggable.addEventListener("mousedown", startDrag);
  draggable.addEventListener("touchstart", startDrag);

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
    var forValue = event.target.getAttribute("for");
    var href = event.target.href;
    document.querySelectorAll(".box2 li").forEach(function (li, index) {
      if (index === 0) {
        li.onclick = function () {
          getInputValues();
        };
      }
      // Cài đặt thuộc tính href cho li thứ hai (nếu cần)
      if (index === 1) {
        var danhdau = document.getElementById("danhdau");
        var indexx = star.indexOf(removeTags(remove_space(forValue)));

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
          location.href = href;
          box_2_id.style.display = "none";
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
    //box_2_id.textContent = `Click chuột phải vào element có content là: ${forValue}`;
    box_2_id.style.display = "block";
  }
  function handleRightTap(event) {
    event.preventDefault();
    box2_class.forEach(function (element) {
        if (window_width - 120 < event.clientX) {
          element.style.left = event.clientX - 120 + "px";
        } else {
          element.style.left = event.clientX + "px";
        }
        element.style.top = event.clientY + 15 + "px";
      });
      var forValue = event.target.getAttribute("for");
      var href = event.target.href;
      document.querySelectorAll(".box2 li").forEach(function (li, index) {
        if (index === 0) {
          li.onclick = function () {
            getInputValues();
          };
        }
        // Cài đặt thuộc tính href cho li thứ hai (nếu cần)
        if (index === 1) {
          var danhdau = document.getElementById("danhdau");
          var indexx = star.indexOf(removeTags(remove_space(forValue)));

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
            location.href = href;
            box_2_id.style.display = "none";
          };
        }
        if (index === 3) {
          li.onclick = function () {
            window.open(href);
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
      box_2_id.style.display = "block";
  }
  document.addEventListener("click", function (event) {
    if (box_2_id.style.display === "block") {
      box_2_id.style.display = "none";
    }
  });
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
    var new1 = check_add();
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
  var box_ = document.getElementById("box_");
  if (box_.style.display === "flex") {
    box_.style.display = "none";
  } else {
    box_.style.display = "flex";
  }
}
function check_add() {
  var selectedValue = document.getElementById("mySelect").value;
  var selectedValue2;
  var input_note1 = document.getElementById("note1_input").value;
  var input_note2 = document.getElementById("note2_input").value;
  var input_link = document.getElementById("link_input").value;
  var indexxx = title_no_icon.indexOf(`${selectedValue}`);
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
  var a = check_add();
  let bool = a[0];
  if (!bool) {
    return;
  }
  var link_a = a[2];
  var note_a = a[1];
  add_data(link_a, note_a);
}
function isValidURL(url) {
  // Biểu thức chính quy để kiểm tra đường liên kết hợp lệ
  var urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

  // Kiểm tra xem chuỗi khớp với biểu thức chính quy hay không
  return urlPattern.test(url);
}

function setDivHeight() {
  var divScroll = document.getElementById("div_scroll");
  var windowHeight = window.innerHeight;
  divScroll.style.height = windowHeight - 195 + "px";
  window_width = window.innerWidth;
}
window.onload = setDivHeight;
window.onresize = setDivHeight;
