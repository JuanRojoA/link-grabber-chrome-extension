//Main buttons
const inputBtnEl = document.getElementById("input-btn");
const saveTabBtnEl = document.getElementById("tab-btn");
const deleteAllBtnEl = document.getElementById("delete-btn");
//Inputs
const inputTitleEl = document.getElementById("input-title-el");
const inputLinkEl = document.getElementById("input-link-el");
//Modal Error
const modalError = document.getElementById("modal-error");
const errorModalContainer = document.getElementById("modal-container-error");
const closeModalBtnEl = document.getElementById("close-modal-btn");
//Modal Delete
const modalDeleteAll = document.getElementById("modal-delete");
const deleteAllModalContainer = document.getElementById("modal-containet-delete");
const cancelModalBtnEl = document.getElementById("cancel-modal-btn");
const deleteAllModalBtnEl = document.getElementById("delete-modal-btn");
//List element
const listEl = document.getElementById("list-el");
//Links array
let copiedLinks = [];
//Checks if localStore has links store and if so renders them
if (localStorage.getItem("copiedLinks")) {
  copiedLinks = JSON.parse(localStorage.getItem("copiedLinks"));
  renderLinks(copiedLinks);
}
//If enter is pressed on the title input the link input gets focus
inputTitleEl.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    inputLinkEl.focus();
  }
});
//If enter is pressed on the link input the event listener of the save input btn is fired up
inputLinkEl.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    inputBtnEl.click();
  }
});
//Deletes a single specific link
listEl.addEventListener("click", function (e) {
  const item = e.target;
  if (item.classList[0] === "delete-link-btn") {
    let itemID = item.id[0];
    copiedLinks.splice(itemID, 1);
    localStorage.setItem("copiedLinks", JSON.stringify(copiedLinks));
    const itemParent = item.parentElement;
    itemParent.remove();
  }
  renderLinks(copiedLinks);
});
//Adds a link from user input
inputBtnEl.addEventListener("click", function (e) {
  if (e.keyCode === 13) {
    inputBtnEl.click();
  }
  if (inputLinkEl.value != "" && inputTitleEl.value != "") {
    copiedLinks.push({ title: inputTitleEl.value, link: inputLinkEl.value });
    localStorage.setItem("copiedLinks", JSON.stringify(copiedLinks));
    inputLinkEl.value = "";
    inputTitleEl.value = "";
    inputTitleEl.focus();
    renderLinks(copiedLinks);
  } else {
    errorModalContainer.classList.remove("slide-out");
    errorModalContainer.classList.add("slide-in");
    modalError.classList.remove("display-none");
  }
});
//Adds a link from current page
saveTabBtnEl.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    copiedLinks.push({ title: tabs[0].title, link: tabs[0].url });
    localStorage.setItem("copiedLinks", JSON.stringify(copiedLinks));
    renderLinks(copiedLinks);
  });
});
//Fires up a modal to confirm the deletion of all links
deleteAllBtnEl.addEventListener("click", function () {
  if(localStorage.getItem("copiedLinks")){
    deleteAllModalContainer.classList.remove("slide-out");
    deleteAllModalContainer.classList.add("slide-in");
    modalDeleteAll.classList.remove("display-none");
  }
});
//Deletes all the links stored
deleteAllModalBtnEl.addEventListener("click", function () {
  deleteAllModalContainer.classList.add("slide-out");
  deleteAllModalContainer.classList.remove("slide-in");
  setTimeout(() => {
    modalDeleteAll.classList.add("display-none");
  }, 500);
  localStorage.clear();
  copiedLinks = [];
  renderLinks(copiedLinks);
});
//Closes delete all modal
cancelModalBtnEl.addEventListener("click", () => {
  deleteAllModalContainer.classList.add("slide-out");
  deleteAllModalContainer.classList.remove("slide-in");
  setTimeout(() => {
    modalDeleteAll.classList.add("display-none");
  }, 500);
});
//Closes the error modal
closeModalBtnEl.addEventListener("click", () => {
  errorModalContainer.classList.remove("slide-in");
  errorModalContainer.classList.add("slide-out");
  setTimeout(() => {
    modalError.classList.add("display-none");
  }, 500);
});
//Renders the stored links
function renderLinks(array) {
  let listItems = "";
  for (i = 0; i < array.length; i++) {
    listItems += `
      <li>
        <a href="${array[i].link}" target="_blank">${array[i].title}</a>
        <button class="delete-link-btn" id="${i}"><span class="material-icons">
        delete_outline
        </span></button>
      </li>`;
  }
  listEl.innerHTML = listItems;
}
