const inputBtnElement = document.getElementById("input-btn");
const tabBtnElement = document.getElementById("tab-btn");
const deleteBtnElement = document.getElementById("delete-btn");
const deleteSpcBtnElement = document.getElementsByClassName("delete-spc-btn");
const inputTitleEl = document.getElementById("input-title-el");
const inputLinkEl = document.getElementById("input-link-el");
const listEl = document.getElementById("list-el");
let copiedLinks = [];
let linksFromLocalStorage = JSON.parse(localStorage.getItem("copiedLinks"));

if (linksFromLocalStorage) {
  copiedLinks = linksFromLocalStorage;
  renderLinks(copiedLinks);
}

inputBtnElement.addEventListener("click", function () {
  if (inputLinkEl.value != "" && inputTitleEl.value != "") {
    copiedLinks.push({title: inputTitleEl.value, link: inputLinkEl.value});
  }
  localStorage.setItem("copiedLinks", JSON.stringify(copiedLinks));
  inputLinkEl.value = "";
  inputTitleEl.value = "";
  inputTitleEl.focus();
  renderLinks(copiedLinks);
});

tabBtnElement.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    copiedLinks.push({title: tabs[0].title, link: tabs[0].url});
    localStorage.setItem("copiedLinks", JSON.stringify(copiedLinks));
    renderLinks(copiedLinks);
  });
});

deleteBtnElement.addEventListener("click", function () {
  localStorage.clear();
  copiedLinks = [];
  renderLinks(copiedLinks);
});

function renderLinks(array) {
  let listItems = "";
  for (i = 0; i < array.length; i++) {
    listItems += `
      <li>
        <a href="${array[i].link}" target="_blank">${array[i].title}</a>
        <button class="delete-spc-btn" id="${i}"><span class="material-icons">
        delete_outline
        </span></button>
      </li>`;
  }
  listEl.innerHTML = listItems;
  for (var i = 0; i < deleteSpcBtnElement.length; i++) {
    deleteSpcBtnElement[i].addEventListener("click", function () {
      copiedLinks.push("Deleted");
    });
  }
}
