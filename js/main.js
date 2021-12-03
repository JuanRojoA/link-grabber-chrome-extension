const inputBtnElement = document.getElementById("input-btn");
const tabBtnElement = document.getElementById("tab-btn");
const deleteBtnElement = document.getElementById("delete-btn");
const inputTitleEl = document.getElementById("input-title-el");
const inputLinkEl = document.getElementById("input-link-el");
const listEl = document.getElementById("list-el");
let copiedLinks = [];
let linksFromLocalStorage = JSON.parse(localStorage.getItem("copiedLinks"));

if (linksFromLocalStorage) {
  copiedLinks = linksFromLocalStorage;
  renderLinks(copiedLinks);
}

inputTitleEl.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    inputBtnElement.click();
  }
});

inputLinkEl.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    inputBtnElement.click();
  }
});

listEl.addEventListener("click", function (e) {
  const item = e.target;
  if (item.classList[0] === "delete-spc-btn") {
    let itemID = item.id[0];
    copiedLinks.splice(itemID, 1);
    localStorage.setItem("copiedLinks", JSON.stringify(copiedLinks));
    const itemParent = item.parentElement;
    itemParent.remove();
  }
  renderLinks(copiedLinks);
});

inputBtnElement.addEventListener("click", function (e) {
  if (e.keyCode === 13) {
    inputBtnElement.click();
  }
  if (inputLinkEl.value != "" && inputTitleEl.value != "") {
    copiedLinks.push({ title: inputTitleEl.value, link: inputLinkEl.value });
    localStorage.setItem("copiedLinks", JSON.stringify(copiedLinks));
    inputLinkEl.value = "";
    inputTitleEl.value = "";
    inputTitleEl.focus();
    renderLinks(copiedLinks);
  }
});

tabBtnElement.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    copiedLinks.push({ title: tabs[0].title, link: tabs[0].url });
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
}
