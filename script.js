function thong_bao_chung(thong_bao, x) {
  if (x === undefined) {
    x = 2;
  }

  let div = document.createElement("div");
  div.className = "thong_bao_chung";
  div.textContent = thong_bao;

  let remove_thong_bao = document.createElement("div");
  remove_thong_bao.className = "remove_thong_bao";
  remove_thong_bao.textContent = "X";
  remove_thong_bao.addEventListener("click", () => {
    if (document.body.contains(div)) {
      document.body.removeChild(div);
    }
  });

  div.appendChild(remove_thong_bao);
  document.body.appendChild(div);

  div.offsetHeight;
  div.style.top = "10px";
  setTimeout(() => {
    div.style.opacity = "0";
    setTimeout(() => {
      if (document.body.contains(div)) {
        document.body.removeChild(div);
      }
    }, 1000);
  }, 1000 * x);
}

!(function () {
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
        } else if (
          url.startsWith("https://1drv.ms") ||
          url.startsWith("https://onedrive.live.com/")
        ) {
          faviconUrl = "https://m.media-amazon.com/images/I/51fBoQXGnIL.png";
        } else if (url.startsWith("file:///")) {
          faviconUrl =
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKc4f1B7TETp0s2EH9LvCiSU6TyYXsm1ewiQ&usqp=CAU";
        } else if (url.includes("samsung.")) {
          faviconUrl =
            "https://w7.pngwing.com/pngs/176/171/png-transparent-samsung-galaxy-gurugram-faridabad-logo-samsung-blue-text-logo.png";
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

  async function getFaviconUrl(url) {
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

  function enableScroll(element) {
    element.addEventListener("wheel", function (event) {
      event.preventDefault();
      element.scrollTop += event.deltaY;
      document.getElementById("box_2").style.display = "none";
    });

    let isTouching = false;
    let touchStartY = 0;

    element.addEventListener("touchstart", function (event) {
      isTouching = true;
      touchStartY = event.touches[0].clientY;
    });

    element.addEventListener("touchmove", function (event) {
      event.preventDefault();
      if (!isTouching) return;

      const touchCurrentY = event.touches[0].clientY;
      const touchDeltaY = touchStartY - touchCurrentY;

      element.scrollTop += touchDeltaY;
      touchStartY = touchCurrentY;
      document.getElementById("box_2").style.display = "none";
    });

    element.addEventListener("touchend", function () {
      isTouching = false;
    });
  }

  const divMain = document.getElementById("div_scroll");
  const list_title = document.getElementById("list_title");
  const menu_content = document.querySelectorAll(".menu_content");

  menu_content.forEach(enableScroll);
  enableScroll(divMain);
  enableScroll(list_title);

  var title = [
    "AI",
    "Anime",
    "File",
    "<i class='fab fa-github' style='color: black'></i> Github",
    "<i class='fa-solid fa-couch' style='color: #664600;'></i> MXH",
    "<i class='fa-solid fa-book' style='color: #b38300'></i> Study",
    "<i class='fa-solid fa-brain' style='color: #949494;'></i> Tips",
    "Khác",
    "ZZ",
  ];
  var title_mac_dinh = title;
  function removeTags(str) {
    return str.replace(/<\/?[^>]+>/gi, "");
  }
  function removeIcon(titles) {
    // Tạo một bản sao của mảng titles để tránh thay đổi trực tiếp mảng gốc
    const titlesCopy = titles.slice();

    for (let i = 0; i < titlesCopy.length; i++) {
      if (titlesCopy[i].startsWith("<")) {
        // Loại bỏ các thẻ HTML
        titlesCopy[i] = removeTags(titlesCopy[i]).trim();
      }
    }
    return titlesCopy;
  }
  function remove_space(str) {
    return str.replace(/\s+/g, "");
  }
  function remove_space_from_array(arr) {
    return arr.map((item) => remove_space(item));
  }
  var link = [];
  var note = [];
  var title_no_icon = [];
  console_data();
  var star = [];
  function console_star(note_add, add_or_remove) {
    if (note_add == "") {
      star = JSON.parse(localStorage.getItem("star")) || [];
      if (note.length == 0) {
        return;
      }
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
    for (let z = 0; z < note.length; z++) {
      let count = -1; // Đếm số lần xuất hiện của phần tử
      for (let j = z + 1; j < note.length; j++) {
        if (note[z] == note[j]) {
          count++;
          if (note[j].includes("(note bị trùng)")) {
            // Nếu đã chứa "(note bị trùng)" thì thêm số lần xuất hiện
            note[j] = note[j].replace(
              /(\(note bị trùng\)\*)(\d+)/,
              (match, p1, p2) => {
                return `${p1}${parseInt(p2) + 1}`;
              }
            );
          } else {
            // Nếu chưa chứa "(note bị trùng)" thì thêm vào với số lần xuất hiện
            note[j] = `${note[z]} (note bị trùng)*${count + 1}`;
          }
        }
      }
    }
  }
  fixDuplicateNotes();
  function undate_date_anime() {
    var now = new Date();
    var currentDay = now.getDay();
    var currentHour = now.getHours();
    var currentMinute = now.getMinutes();

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
          if (currentTotalMinutes == targetTotalMinutes) {
            thong_bao_chung(removeTags(remove_space(element)), 5);
          }
          if (day == 8) {
            let targetTotalMinutes = convertToMinutes(2, hour, minute);
            if (currentTotalMinutes <= targetTotalMinutes) {
              note_anime2.push(element);
            }
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
        div.style.display = "block";
      } else {
        div.style.display = "none";
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
  var what_title = document.getElementById("select").value || "All";

  var items = [];
  function item(what_title) {
    if (what_title == "All") {
      items = note.slice(); // Sao chép toàn bộ mảng note vào mảng items
    } else {
      var items = note.filter((icon_note) => {
        let firstLine = icon_note.split("<br>")[0].trim();
        return removeTags(firstLine).trim() === what_title;
      });
    }
    return items;
  }
  items = item(what_title);

  document
    .getElementById("select")
    .addEventListener("change", function (event) {
      title_pick(event.target.value);
    });
  function title_pick(titles) {
    var legend = document.getElementById("legend");
    var searchInputt = document.getElementById("searchInput");
    searchInputt.value = "";
    var indexx = title_no_icon.indexOf(titles);
    if (indexx !== -1) {
      if (title[indexx] == "ZZ") {
        legend.innerHTML = "Link ẩn";
      } else {
        legend.innerHTML = title[indexx];
      }
    } else {
      legend.innerHTML = titles;
    }
    what_title = titles;
    document.getElementById("select").value = what_title;
    items = item(what_title);
    create_icon(titles);
  }
  let time_error_sort = false;
  function sortDivLinks(searchValue, divScroll) {
    const divLinks = Array.from(divScroll.children).filter((child) =>
      child.classList.contains("div_link")
    );

    if (!divLinks) {
      if (!time_error_sort) {
        time_error_sort = !time_error_sort;
        thong_bao_chung("chưa có dữ liệu để tìm kiếm");
        setTimeout(() => {
          time_error_sort = !time_error_sort;
        }, 3000);
      }
    } else {
      // Sắp xếp các phần tử theo các tiêu chí đã cho
      divLinks.sort((a, b) => {
        const aValue = a.getAttribute("for").toLowerCase();
        const bValue = b.getAttribute("for").toLowerCase();

        // Tính độ tương tự của giá trị với searchValue
        const aSimilarity = aValue.indexOf(searchValue) !== -1 ? 1 : 0;
        const bSimilarity = bValue.indexOf(searchValue) !== -1 ? 1 : 0;

        // Kiểm tra nếu giá trị bắt đầu bằng dấu chấm "."
        const aStartsWithDot = aValue.startsWith(".") ? 1 : 0;
        const bStartsWithDot = bValue.startsWith(".") ? 1 : 0;

        // Sắp xếp theo dấu chấm trước
        if (aStartsWithDot !== bStartsWithDot) {
          return bStartsWithDot - aStartsWithDot;
        }
        // Sắp xếp theo độ tương tự
        else if (aSimilarity !== bSimilarity) {
          return bSimilarity - aSimilarity;
        }
        // Sắp xếp theo sự hiện diện của chữ "ừ"
        else if (aValue.includes("ừ") && !bValue.includes("ừ")) {
          return 1;
        } else if (!aValue.includes("ừ") && bValue.includes("ừ")) {
          return -1;
        }
        // Sắp xếp theo thứ tự chữ cái
        else {
          return aValue.localeCompare(bValue);
        }
      });

      // Cập nhật các phần tử con vào divScroll theo thứ tự đã sắp xếp
      divLinks.forEach((divLink) => divScroll.appendChild(divLink));
    }
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
      if (ZZ_on) {
        const button_link_an = document.getElementById("button_link_an");
        const children = button_link_an.children;
        Array.from(children).forEach((child) => {
          child.classList.toggle("add_button_gat");
        });
        what_title = "All";
      }
    } else {
      ZZ_on = bool;
      if (!ZZ_on && what_title == "ZZ") {
        what_title = "All";
      }
    }
    title_pick(what_title);

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

    for (var i = 0; i < title_no_icon.length; i++) {
      // Tạo option1 cho select1
      var option1 = document.createElement("option");
      option1.value = title_no_icon[i];
      if (title_no_icon[i] === "ZZ") {
        if (ZZ_on) {
          option1.textContent = "Link ẩn";
        } else {
          option1.style.display = "none";
        }
      } else {
        option1.textContent = title_no_icon[i];
      }
      select1.appendChild(option1);

      var option2 = option1.cloneNode(true);
      select2.appendChild(option2);

      var option3 = option1.cloneNode(true);
      select3.appendChild(option3);
    }

    document.getElementById("select").value = what_title;
    localStorage.setItem("open_file_ẩn", JSON.stringify(ZZ_on));
  }
  create_option();

  function create_data(link, note) {
    var data = { linksss: link, notesss: note, titlesss: title };
    localStorage.setItem("data", JSON.stringify(data));
  }

  function console_data() {
    if (!localStorage.getItem("data")) {
      var data = { linksss: link, notesss: note, titlesss: title };
      localStorage.setItem("data", JSON.stringify(data));
    }
    if (localStorage.getItem("data")) {
      var retrievedData = JSON.parse(localStorage.getItem("data"));
      var link_data = retrievedData.linksss;
      var note_data = retrievedData.notesss;
      var title_data = retrievedData.titlesss;
      if (link_data.length == 0) {
        link = link_data;
        note = note_data;
        title = title_data;
        setTimeout(() => {
          var div_scroll = document.getElementById("div_scroll");
          var div = document.createElement(div);
          div.style =
            "width: 200px;font-size:20px;position: fixed;left:calc(50% - 65px);top:calc(50% - 65px)";
          div.textContent = "Chưa có dữ liệu";
          div_scroll.appendChild(div);
        }, 1000);
      } else {
        let thiet_bi = getDeviceType();
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
        title = title_data;
        fixDuplicateNotes();
      }
    }
    title_no_icon = removeIcon(title);
  }
  function add_data(link, note) {
    let retrievedData = JSON.parse(localStorage.getItem("data"));
    retrievedData.linksss.push(link);
    retrievedData.notesss.push(note);
    localStorage.setItem("data", JSON.stringify(retrievedData));
    console_data();
    title_pick(what_title);
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
      thong_bao_chung("Đã xóa icon thành công!");
    };

    // Xử lý nút "No"
    document.getElementById("confirmNo").onclick = function () {
      document.getElementById("class_box2_remove").style.display = "none";
    };
  }
  function selectOptionByValue(selectElement, value) {
    let no_have_value = true;
    for (let i = 0; i < selectElement.options.length; i++) {
      if (selectElement.options[i].value.trim() === value) {
        selectElement.selectedIndex = i;
        no_have_value = false;
        break;
      }
    }
    if (no_have_value) {
      document.getElementById("select_edit").value = "Khác";
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
      selectOptionByValue(selectEdit, removeTags(notes[0]).trim());
      note1_input.value = notes[1];
      note2_input.value = notes[2];
    } else if (notes.length == 2) {
      selectOptionByValue(selectEdit, removeTags(notes[0]).trim());
      note1_input.value = notes[1];
      note2_input.value = "";
    } else {
      selectOptionByValue(selectEdit, removeTags(notes[0]).trim());
      note1_input.value = "";
      note2_input.value = "";
    }

    document.getElementById("save_edit").onclick = function () {
      let index_edit = title_no_icon.indexOf(selectEdit.value);
      let select_edit = "";
      if (index_edit != -1) {
        select_edit = title[index_edit];
      } else {
        select_edit = selectEdit.value;
      }
      let new_note =
        select_edit + "<br>" + note1_input.value + "<br>" + note2_input.value;
      let new_link = link_input.value;
      let retrievedData = JSON.parse(localStorage.getItem("data"));
      let index = retrievedData.notesss.indexOf(edit_note);
      if (index !== -1) {
        if (link[index] !== new_link) {
          retrievedData.linksss[index] = new_link;
        }
        if (note[index] !== new_note) {
          retrievedData.notesss[index] = new_note;
          let index_star = star.indexOf(removeTags(remove_space(note[index])));
          if (index_star !== -1) {
            console_star(new_note, "add");
          }
        }
      }
      localStorage.setItem("data", JSON.stringify(retrievedData));
      console_data();
      title_pick(what_title);
      document.getElementById("class_box2_edit").style.display = "none";
      thong_bao_chung("Đã sửa icon liên kết thành công!");
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
      if (event.target.classList.contains("pick_excel")) {
        whaticon.innerHTML = `<p style="font-size:30px;transform: translateY(-17.5px);">Pick file</p>`;
      } else if (event.target.classList.contains("what-icon")) {
        whaticon.innerHTML = `Khung Name List`;
        document.getElementById("whaticon").style =
          "font-size: 20px;align-items: center;display: flex;justify-content: center;";
      }
    });
    document.addEventListener("mouseout", function (event) {
      if (
        event.target.classList.contains("select_t") ||
        event.target.classList.contains("pick_excel") ||
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
    var hoverTargets = document.querySelectorAll(
      "#div_scroll .div_link .eff_a"
    );

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
        hoverTargets = document.querySelectorAll(
          "#div_scroll .div_link .eff_a"
        );
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
        shiftY =
          event.touches[0].clientY - draggable.getBoundingClientRect().top;
      }

      const moveAt = (pageX, pageY) => {
        draggable.style.left = pageX - shiftX + "px";
        draggable.style.top = pageY - shiftY + "px";
        let button = document.querySelector(".button");
        button.style.left = pageX - shiftX - 27 + "px";
        button.style.top = pageY - shiftY + 80 + "px";
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
            danhdau.style.color = "var(--color_text_p)";
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
                thong_bao_chung("Đã sao chép liên kết!");
              })
              .catch(function (error) {
                console.error("Không thể sao chép liên kết", error);
              });
          };
        }
        if (index === 3) {
          li.onclick = function () {
            box_2_id.style.display = "none";
            location.href = href;
          };
        }
        if (index === 4) {
          li.onclick = function () {
            window.open(href, "_blank");
            box_2_id.style.display = "none";
          };
        }
        if (index === 5) {
          li.onclick = function () {
            box_2_id.style.display = "none";
            remove_data(forValue);
          };
        }
      });
      box2_class.forEach(function (element) {
        if (window_width - 127 < event.clientX) {
          element.style.left = event.clientX - 127 + "px";
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
        event.preventDefault();
      });
    searchInput.addEventListener("click", function () {
      searchInput.style.width = "var(--size_search)";
      setTimeout(() => {
        document.getElementById("label_search").style.display = "block";
      }, 300);
      document.getElementById("btn_tim").style.borderRadius = "0 10px 10px 0";
    });
    searchInput.addEventListener("input", function () {
      const searchValue = remove_space(searchInput.value.toLowerCase());
      const divScroll = document.getElementById("div_scroll");
      sortDivLinks(searchValue, divScroll);
    });
    searchInput.addEventListener("blur", function () {
      searchInput.style.width = 17 + "px";
      document.getElementById("label_search").style.display = "none";
      document.getElementById("btn_tim").style.borderRadius = "10px";
    });

    function handleFile(e) {
      try {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
          const data = new Uint8Array(event.target.result);
          const workbook1 = XLSX.read(data, { type: "array" });

          const firstSheetName1 = workbook1.SheetNames[0];
          const worksheet = workbook1.Sheets[firstSheetName1];
          const jsonData = XLSX.utils.sheet_to_json(worksheet); // Chuyển đổi dữ liệu thành định dạng JSON
          link = [];
          note = [];

          const jsonData_row = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });
          const LinkIndex = jsonData_row[0].indexOf("Link");
          const NoteIndex = jsonData_row[0].indexOf("Note");
          if (LinkIndex === -1) {
            thong_bao_chung("Không tìm thấy cột 'Link' trong file Excel.");
            return;
          } else if (NoteIndex === -1) {
            thong_bao_chung("Không tìm thấy cột 'Note' trong file Excel.");
            return;
          }

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
          thong_bao_chung("Nhập dữ liệu Excel thành công");
        };

        reader.readAsArrayBuffer(file); // Đọc tệp dưới dạng ArrayBuffer
      } catch {
        //
      }
    }
    let workbook;
    let firstSheetName;
    function excell() {
      addAndSortData();
    }
    function addAndSortData() {
      // Thêm dữ liệu mảng link vào cột Link và mảng note vào cột Note theo thứ tự song song 2 cột
      createNewExcelFile(link, note, note);

      // Sắp xếp dữ liệu theo cột "Title"
      sortDataByTitle();
    }

    function createNewExcelFile(links, notes, titles) {
      // Tạo workbook mới
      workbook = XLSX.utils.book_new();

      // Tạo sheet mới
      firstSheetName = "Sheet1";
      const sheetData = [];

      // Thêm header cho sheet (các cột Link, Note, Title)
      sheetData.push(["Link", "Note", "Title"]);

      // Thêm dữ liệu từ các mảng links, notes và titles vào sheet
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const note = notes[i];
        const title = titles[i].split("<br>")[0]; // Lấy phần tử đầu tiên trong titles[i]

        sheetData.push([link, note, title]);
      }

      // Chuyển đổi dữ liệu thành định dạng sheet
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

      // Thêm sheet vào workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, firstSheetName);
    }

    function sortDataByTitle() {
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const titleIndex = jsonData[0].indexOf("Title");
      if (titleIndex === -1) {
        thong_bao_chung("Không tìm thấy cột 'Title' trong file Excel.");
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

      exportExcel();
    }

    function exportExcel() {
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
      const blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "link.xlsx";
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

    // Gắn sự kiện change cho input type=file input-link-excel
    document
      .getElementById("input-excel")
      .addEventListener("change", handleFile, false);
    document
      .getElementById("input-link-excel")
      .addEventListener("click", link_excel);
    function link_excel() {
      document.getElementById("menu").click();
      document.getElementById("class_box2_link_excel").style.display = "block";

      document.getElementById("Nhap_link_excel").onclick = function () {
        let url_excel = document.getElementById("link_excel").value;
        if (isValidURL(url_excel)) {
          handleFileFromURL(url_excel);
        } else {
          thong_bao_chung("Đường liên kết không hợp lệ");
        }
      };

      document.getElementById("Close_link_excel").onclick = function () {
        document.getElementById("class_box2_link_excel").style.display = "none";
      };
    }
    async function handleFileFromURL(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          thong_bao_chung("Không thể tải file từ URL.");
          return;
        }
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook1 = XLSX.read(data, { type: "array" });

        const firstSheetName1 = workbook1.SheetNames[0];
        const worksheet = workbook1.Sheets[firstSheetName1];
        const jsonData = XLSX.utils.sheet_to_json(worksheet); // Chuyển đổi dữ liệu thành định dạng JSON
        link = [];
        note = [];

        const jsonData_row = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });
        const LinkIndex = jsonData_row[0].indexOf("Link");
        const NoteIndex = jsonData_row[0].indexOf("Note");
        if (LinkIndex === -1) {
          thong_bao_chung("Không tìm thấy cột 'Link' trong file Excel.");
          return;
        } else if (NoteIndex === -1) {
          thong_bao_chung("Không tìm thấy cột 'Note' trong file Excel.");
          return;
        }

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
        thong_bao_chung("Nhập dữ liệu Excel thành công");
        document.getElementById("class_box2_link_excel").style.display = "none";
      } catch (error) {
        thong_bao_chung("Đã xảy ra lỗi khi xử lý file từ URL.");
      }
    }
    let isExecuted = false;

    document.getElementById("add-link2").addEventListener("click", function () {
      if (isExecuted) return;

      if (!isExecuted) {
        excell();
        isExecuted = true;
        setTimeout(function () {
          isExecuted = false;
        }, 3000);
      }
    });
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
      let what_title_now = what_title == "All" ? "Khác" : what_title;
      document.getElementById("mySelect").value = what_title_now;
    }
  }
  function check_add() {
    let selectedValue = document.getElementById("mySelect").value;
    let input_note1 = document.getElementById("note1_input").value;
    let input_note2 = document.getElementById("note2_input").value;
    let input_link = document.getElementById("link_input").value;
    let index = title_no_icon.indexOf(selectedValue);
    if (index !== -1) {
      selectedValue = title[index];
      console.log("s");
    }

    if (selectedValue == "File") {
      if (!input_link.startsWith("file:///")) {
        thong_bao_chung("Đường liên kết file không hợp lệ!");
        return [false, "", "", ""];
      }
    } else if (!isValidURL(input_link)) {
      thong_bao_chung("Đường liên kết link không hợp lệ!");
      return [false, "", "", ""];
    }

    document.getElementById("note1_input").value = "";
    document.getElementById("note2_input").value = "";
    document.getElementById("link_input").value = "";

    return [
      true,
      `${selectedValue}` + "<br>" + input_note1 + "<br>" + input_note2,
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
    thong_bao_chung("Đã thêm link thành công!");
    close();
  }

  function setDivHeight() {
    let divScroll = document.getElementById("div_scroll");
    let windowHeight = window.innerHeight;
    divScroll.style.height = windowHeight - 206 + "px";
    window_width = window.innerWidth;
    const draggable = document.querySelector("#draggable");
    document.querySelectorAll(".button").forEach(function (button) {
      button.style.display = "none";
    });
    draggable.style.top = 5 + "px";
    draggable.style.left = 30 + "px";
    document.querySelectorAll(".menu_content").forEach(function (menu_c) {
      if (menu_open) {
        menu_c.style.transform = "translateX(0)";
        menu_open = false;
        document.querySelectorAll(".ruler1").forEach(function (r1) {
          r1.classList.toggle("add_rules1");
        });
        document.querySelectorAll(".ruler2").forEach(function (r2) {
          r2.classList.toggle("add_rules2");
        });
      }
    });
  }
  window.onload = setDivHeight;
  window.onresize = setDivHeight;

  var menu_open = false;

  document.getElementById("menu").addEventListener("click", function () {
    const ruler1 = this.querySelector(".ruler1");
    const ruler2 = this.querySelector(".ruler2");
    const menu_content = document.querySelectorAll(".menu_content");

    ruler1.classList.toggle("add_rules1");
    ruler2.classList.toggle("add_rules2");

    menu_content.forEach(function (element) {
      if (menu_open) {
        menu_open = false;
        element.style.transform = "translateX(0)";
      } else {
        if (window.innerWidth >= 400) {
          element.style.transform = "translateX(-400px)";
        } else {
          element.style.transform = `translateX(-${window_width}px)`;
        }
        menu_open = true;
      }
    });
  });

  // Ngăn chặn sự kiện click của menu_content lan ra menu
  document.querySelectorAll(".menu_content").forEach(function (content) {
    content.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  });

  // Xử lý sự kiện cho các thẻ input type="color" và các thẻ khác
  const parentElement = document.getElementById("text_color");
  const childElements = parentElement.querySelectorAll("*");
  childElements.forEach((child) => {
    if (child.tagName.toLowerCase() === "input" && child.type === "color") {
      // Lắng nghe sự kiện 'input' cho thẻ input type="color"
      child.addEventListener("input", function (event) {
        const color = child.value;
        document.documentElement.style.setProperty("--color_text_h", color);
        create_data_setting(color, "", "");
      });
    } else {
      // Lắng nghe sự kiện 'click' cho các thẻ khác
      child.addEventListener("click", function (event) {
        const color = child.getAttribute("value");
        document.documentElement.style.setProperty("--color_text_h", color);
        create_data_setting(color, "", "");
      });
    }
  });

  let nen_background = false;
  const button_background = document.getElementById("button_mode_dark");
  button_background.addEventListener("click", function () {
    const children = button_background.children;
    Array.from(children).forEach((child) => {
      child.classList.toggle("add_button_gat");
    });
    let darkTheme = {
      "--color_text_p": "#d0d0d0",
      "--color_backgroud": "rgb(50, 50, 50)",
      "--color_backgroud2": "rgb(200, 200, 200)",
      "--color_hover": "rgb(100, 100, 100)",
    };
    let lightTheme = {
      "--color_text_p": "rgb(10, 10, 10)",
      "--color_backgroud": "#ccc",
      "--color_backgroud2": "rgb(50, 50, 50)",
      "--color_hover": "rgb(100, 100, 100)",
    };
    const theme = nen_background ? lightTheme : darkTheme;
    for (const [property, value] of Object.entries(theme)) {
      document.documentElement.style.setProperty(property, value);
    }
    create_data_setting("", "aaa", "");
    nen_background = !nen_background;
  });

  let on_mouse = true;
  const button_mouse = document.getElementById("button_off_mouse");
  button_mouse.addEventListener("click", function () {
    const children = button_mouse.children;
    Array.from(children).forEach((child) => {
      child.classList.toggle("add_button_gat");
    });
    const draggable = document.querySelector("#draggable");
    if (on_mouse) {
      draggable.style.display = "none";
      let button = document.querySelector(".button");
      button.style.display = "none";
    } else {
      draggable.style.display = "block";
    }
    create_data_setting("", "", "aaa");
    on_mouse = !on_mouse;
  });

  function create_data_setting(colorsss, backgroundsss, mousesss) {
    var retrievedDataSetting = {};
    if (colorsss == "" && backgroundsss == "" && mousesss == "") {
      var defaultSettings = {
        color_st: "#007bff",
        background_st: false,
        mouse_st: true,
      };
      retrievedDataSetting =
        JSON.parse(localStorage.getItem("data_setting")) || defaultSettings;
      document.documentElement.style.setProperty(
        "--color_text_h",
        retrievedDataSetting.color_st
      );
      if (retrievedDataSetting.background_st) {
        button_background.click();
      }
      if (!retrievedDataSetting.mouse_st) {
        button_mouse.click();
      }
    } else {
      retrievedDataSetting = JSON.parse(localStorage.getItem("data_setting"));
      if (colorsss != "") {
        retrievedDataSetting.color_st = colorsss;
      } else if (backgroundsss != "") {
        retrievedDataSetting.background_st =
          !retrievedDataSetting.background_st;
      } else if (mousesss != "") {
        retrievedDataSetting.mouse_st = !retrievedDataSetting.mouse_st;
      }
    }
    localStorage.setItem("data_setting", JSON.stringify(retrievedDataSetting));
  }

  create_data_setting("", "", "");

  document
    .getElementById("tuy_chinh_title")
    .addEventListener("click", edit_title, false);
  function edit_title() {
    var retrievedDataTitle = JSON.parse(localStorage.getItem("data"));
    document.getElementById("menu").click();
    document.getElementById("class_box2_edit_title").style.display = "block";
    create_title_icon("All");

    document.getElementById("Close_Title").onclick = function () {
      document.getElementById("class_box2_edit_title").style.display = "none";
    };
    var children_title = document.getElementById("list_title").children;
    document.getElementById("Edit_Title").onclick = function () {
      children_title = document.getElementById("list_title").children;
      let new_title = [];
      for (let i = 0; i < children_title.length; i++) {
        new_title.push(children_title[i].getAttribute("for"));
      }
      retrievedDataTitle.titlesss = new_title;
      localStorage.setItem("data", JSON.stringify(retrievedDataTitle));
      document.getElementById("class_box2_edit_title").style.display = "none";
      thong_bao_chung("Lưu title thành công");
      console_data();
      what_title = "All";
      create_option();
    };

    document.getElementById("Reset_Title").onclick = function () {
      create_title_icon("Reset");
    };
  }

  document
    .getElementById("doi_mat_khau")
    .addEventListener("click", create_password, false);
  function create_password() {
    //
  }

  const button_link_an = document.getElementById("button_link_an");
  button_link_an.addEventListener("click", function () {
    const children = button_link_an.children;
    Array.from(children).forEach((child) => {
      child.classList.toggle("add_button_gat");
    });
    if (ZZ_on) {
      create_option(false);
    } else {
      create_option(true);
    }
  });

  const targetValues = ["ZZ", "File", "Anime"];
  function create_title_icon(All, new_title) {
    if (All === "All") {
      document.getElementById("list_title").innerHTML = "";
      new_title = title;
    } else if (All == "Reset") {
      document.getElementById("list_title").innerHTML = "";
      new_title = title_mac_dinh;
    } else {
      new_title = [new_title];
    }
    for (var i = 0; i < new_title.length; i++) {
      const newTitleDiv = document.createElement("div");
      newTitleDiv.className = "title_icon";
      newTitleDiv.setAttribute("for", new_title[i]);

      const div_content = document.createElement("div");
      if (new_title[i] == "ZZ") {
        div_content.innerHTML = "Link ẩn (ZZ)";
      } else {
        div_content.innerHTML = new_title[i];
      }

      // Tạo nút Lên
      const upButton = document.createElement("button");
      upButton.innerHTML =
        "<i class='fa-solid fa-down-long fa-rotate-180'></i>";
      upButton.addEventListener("click", function () {
        const prevSibling = newTitleDiv.previousElementSibling;
        if (prevSibling) {
          newTitleDiv.parentNode.insertBefore(newTitleDiv, prevSibling);
        }
      });

      // Tạo nút Xuống
      const downButton = document.createElement("button");
      downButton.innerHTML = "<i class='fa-solid fa-down-long'></i>";
      downButton.addEventListener("click", function () {
        const nextSibling = newTitleDiv.nextElementSibling;
        if (nextSibling) {
          newTitleDiv.parentNode.insertBefore(nextSibling, newTitleDiv);
        }
      });

      // Tạo nút Xóa
      const deleteButton = document.createElement("button");
      if (targetValues.includes(new_title[i])) {
        deleteButton.innerHTML = "<i class='fa-solid fa-ban'></i>";
        deleteButton.style.cursor = "auto";
        deleteButton.addEventListener("click", function () {
          thong_bao_chung("Không thể xóa title mặc định");
        });
      } else {
        deleteButton.innerHTML = "<i class='fa-solid fa-trash'></i>";
        deleteButton.addEventListener("click", function () {
          newTitleDiv.remove();
        });
      }

      newTitleDiv.appendChild(div_content);
      newTitleDiv.appendChild(upButton);
      newTitleDiv.appendChild(downButton);
      newTitleDiv.appendChild(deleteButton);
      document.getElementById("list_title").appendChild(newTitleDiv);
    }
  }

  document.getElementById("add_title").addEventListener("click", function () {
    // Khởi tạo lại mảng title mỗi khi nhấp nút Add
    let title = [];
    const title_icon = document.querySelectorAll(".title_icon");

    // Lấy tất cả các tiêu đề hiện có
    title_icon.forEach(function (a) {
      title.push(a.getAttribute("for").toLowerCase()); // Chuyển đổi thành chữ thường
    });

    const titleInput = document.getElementById("title_input");
    const newTitle = titleInput.value.trim();
    const newTitle2 = titleInput.value.trim().toLowerCase();
    const newTitle3 = removeTags(titleInput.value);

    const regexSpecialChars = /["]/;
    const regexStartsWithSpecial =
      /^[!@#\$%\^&\*\(\)_\+\-=\[\]\{\};':"\\|,.>\/?~`]/;
    const regexBrTags = /<br\s*\/?>/i;

    if (
      newTitle3.length < 11 &&
      newTitle !== "" &&
      title.indexOf(newTitle2) === -1 &&
      !regexSpecialChars.test(newTitle) &&
      !regexStartsWithSpecial.test(newTitle) &&
      !regexBrTags.test(newTitle)
    ) {
      create_title_icon("", newTitle);
      document.getElementById("list_title").scrollTop =
        document.getElementById("list_title").scrollHeight;
    } else {
      if (regexSpecialChars.test(newTitle)) {
        thong_bao_chung("title không thể chứa kí tự ngoặc kép");
      } else if (regexStartsWithSpecial.test(newTitle)) {
        thong_bao_chung("title không thể bắt đầu bằng kí tự đặt biệt");
      } else if (regexBrTags.test(newTitle)) {
        thong_bao_chung("title không thể có thẻ <br> và <br/>");
      } else if (newTitle === "") {
        thong_bao_chung("Vui lòng đặt tên title");
      } else if (title.indexOf(newTitle2) !== -1) {
        thong_bao_chung("Đã có title");
      } else if (newTitle3.length > 10) {
        thong_bao_chung("Title không thể dài quá 10 ký tự");
      }
    }
    titleInput.value = "";
  });
})();
