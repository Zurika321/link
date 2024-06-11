var links;
function linkss() {
  links = document.querySelectorAll(".link-with-favicon");
  links.forEach(async (link) => {
    const url = link.href;
    if (url.includes("zurika")) {
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
// Sử dụng hàm để loại bỏ biểu tượng từ mảng title và lưu vào mảng mới title_no_icon
var title_no_icon = removeIcon(title);
var link = [];
var note = [];
console_data();
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
var div_scroll = document.getElementById("div_scroll");
function create_icon(title) {
  div_scroll.innerHTML = "";
  if (title == "All") {
    for (let i = 0; i < link.length; i++) {
      var div_link = document.createElement("div");
      div_link.className = "div_link";
      div_link.setAttribute("for", removeTags(remove_space(note[i])));

      var a = document.createElement("a");
      a.href = link[i];
      a.setAttribute("for", note[i]);
      a.className = "link-with-favicon eff_a";
      if (note[i].startsWith("ZZ")) {
        if (!ZZ_on) {
          div_link.style.display = "none";
        }
      }
      div_link.appendChild(a);
      div_scroll.appendChild(div_link);
      linkss();
    }
  } else {
    for (let i = 0; i < items.length; i++) {
      // Tìm vị trí của items[i] trong note
      var index = note.indexOf(items[i]);
      if (index !== -1) {
        var div_link = document.createElement("div");
        div_link.className = "div_link";
        div_link.setAttribute("for", removeTags(remove_space(items[i])));

        var a = document.createElement("a");
        a.href = link[index];
        a.setAttribute("for", items[i]);
        a.className = "link-with-favicon eff_a";

        div_link.appendChild(a);
        div_scroll.appendChild(div_link);
        linkss();
      }
    }
  }
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
create_icon("All");
var ZZ_on = false;
function create_option(bool) {
  var select1 = document.getElementById("select");
  var select2 = document.getElementById("mySelect");
  select1.innerHTML = "";
  select2.innerHTML = "";

  var option2 = document.createElement("option");
  option2.value = "All";
  option2.textContent = "All";
  select1.appendChild(option2);
  ZZ_on = bool;
  var length = bool ? title_no_icon.length : title_no_icon.length - 1;

  for (var i = 0; i < length; i++) {
    var option1 = document.createElement("option");
    option1.value = title_no_icon[i];
    option1.textContent = title_no_icon[i];
    select1.appendChild(option1);

    var option2 = document.createElement("option");
    option2.value = title_no_icon[i];
    option2.textContent = title_no_icon[i];
    select2.appendChild(option2);
  }
  create_icon("All");
}
create_option(false);

function create_data(link, note) {
  var data = { linksss: link, notesss: note };
  localStorage.setItem("data", JSON.stringify(data));
}

function console_data() {
  if (localStorage.getItem("data")) {
    var retrievedData = JSON.parse(localStorage.getItem("data"));
    var link_data = retrievedData.linksss;
    var note_data = retrievedData.notesss;
    console.log("Icons:", link_data.length);
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
  var retrievedData = JSON.parse(localStorage.getItem("data"));
  retrievedData.linksss.push(link); // Thêm vào mảng linksss
  retrievedData.notesss.push(note); // Thêm vào mảng notesss
  localStorage.setItem("data", JSON.stringify(retrievedData));
  location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  const divScroll = document.getElementById("div_scroll");
  const whaticon = document.getElementById("whaticon");

  // Sử dụng ủy quyền sự kiện
  divScroll.addEventListener("mouseover", function (event) {
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
  function update_eff_a() {
    hoverTargets = document.querySelectorAll("#div_scroll .div_link .eff_a");
  }
  const defaultContent = "Default Text";
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

  draggable.addEventListener("mousedown", (event) => {
    let shiftX = event.clientX - draggable.getBoundingClientRect().left;
    let shiftY = event.clientY - draggable.getBoundingClientRect().top;
    update_eff_a();

    const moveAt = (pageX, pageY) => {
      draggable.style.left = pageX - shiftX + "px";
      draggable.style.top = pageY - shiftY + "px";

      const draggableRect = draggable.getBoundingClientRect();
      checkHover(draggableRect);
    };

    const onMouseMove = (event) => moveAt(event.pageX, event.pageY);
    document.addEventListener("mousemove", onMouseMove);

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mouseup", onMouseUp);
    draggable.ondragstart = () => false;
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
    const divLinks = Array.from(divScroll.children);

    divLinks.sort((a, b) => {
      const aValue = a.getAttribute("for").toLowerCase();
      const bValue = b.getAttribute("for").toLowerCase();

      const aSimilarity = aValue.indexOf(searchValue) !== -1 ? 1 : 0;
      const bSimilarity = bValue.indexOf(searchValue) !== -1 ? 1 : 0;

      // Kiểm tra xem nếu chỉ có một trong hai là chứa chuỗi tìm kiếm
      if (
        (aSimilarity === 1 && bSimilarity === 0) ||
        (aSimilarity === 0 && bSimilarity === 1)
      ) {
        // Chỉ có một trong hai là chứa chuỗi tìm kiếm, sắp xếp theo độ tương tự
        return bSimilarity - aSimilarity;
      } else if (aValue.includes("ừ") && !bValue.includes("ừ")) {
        // Chữ "ừ" nằm trong a nhưng không nằm trong b
        return 1;
      } else if (!aValue.includes("ừ") && bValue.includes("ừ")) {
        // Chữ "ừ" nằm trong b nhưng không nằm trong a
        return -1;
      } else {
        // Cả hai đều không chứa chuỗi tìm kiếm hoặc chứa chữ "ừ", sắp xếp theo thứ tự bình thường
        return aValue.localeCompare(bValue);
      }
    });

    divLinks.forEach((divLink) => divScroll.appendChild(divLink));
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
        create_icon("All");
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
    const wbout = XLSX.write(workbook, { bookType: "xls", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "updated_file.xls";
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

function removeTags(str) {
  return str.replace(/<\/?[^>]+>/gi, "");
}
function remove_space(str) {
  return str.replace(/\s+/g, "");
}

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
  if (input_note1 === "" || input_link === "") {
    alert("Vui lòng nhập Link và Note 1, chọn tệp excel trước khi thêm Excel");
    return [false, "", "", ""];
  }

  return [
    true,
    `${selectedValue /*2*/}` + "<br/>" + input_note1 + "<br/>" + input_note2,
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
document.addEventListener("DOMContentLoaded", () => {});
