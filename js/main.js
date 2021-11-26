const inputBtnElement = document.getElementById("input-btn");
const tabBtnElement = document.getElementById("tab-btn");
const deleteBtnElement = document.getElementById("delete-btn");
const inputEl = document.getElementById("input-el");
const listEl = document.getElementById("list-el");
let copiedLinks = [];
let linksFromLocalStorage = JSON.parse(localStorage.getItem("copiedLinks"));

if (linksFromLocalStorage) {
  copiedLinks = linksFromLocalStorage;
  renderLinks(copiedLinks);
}

inputBtnElement.addEventListener("click", function () {
  if (inputEl.value != "") {
    copiedLinks.push(inputEl.value);
  }
  localStorage.setItem("copiedLinks", JSON.stringify(copiedLinks));
  inputEl.value = "";
  inputEl.focus();
  renderLinks(copiedLinks);
});

tabBtnElement.addEventListener("click", function () {
  console.log("Button clicked!!!");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    copiedLinks.push(tabs[0].url);
    localStorage.setItem("copiedLinks", JSON.stringify(copiedLinks));
    renderLinks(copiedLinks);
  })
})

deleteBtnElement.addEventListener("click", function () {
  localStorage.clear();
  copiedLinks = [];
  renderLinks(copiedLinks);
});

function renderLinks(array) {
  let listItems = "";
  for (i = 0; i < array.length; i++) {
    listItems += `<li><a href="${array[i]}" target="_blank">${array[i]}</a></li>`;
  }
  listEl.innerHTML = listItems;
}
