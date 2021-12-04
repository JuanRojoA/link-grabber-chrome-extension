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
const deleteAllModalContainer = document.getElementById("modal-container-delete");
const cancelModalBtnEl = document.getElementById("cancel-modal-btn");
const deleteAllModalBtnEl = document.getElementById("delete-modal-btn");
//Modal Edit
const modalEdit = document.getElementById("modal-edit");
const editModalContainer = document.getElementById("modal-container-edit");
const cancelEditModalBtnEl = document.getElementById("cancel-edit-modal-btn");
const saveModalBtnEl = document.getElementById("save-modal-btn");
const editTitleInputEl = document.getElementById("input-title-edit-el");
const editLinkInputEl = document.getElementById("input-link-edit-el");
//List element
const listEl = document.getElementById("list-el");
let id = 0

//FUNTIONS

function renderFromLocalStorage() {
  let copiedLinks;
  let listItems = ""
  id = 0
  if (localStorage.getItem("links")) {
    copiedLinks = JSON.parse(localStorage.getItem("links"));
    copiedLinks.forEach((element) => {
      listItems += `
          <li>
            <a href="${element.link}" id="${id}" target="_blank">${element.title}</a>
            <button class="edit-link-btn"><span class="material-icons">edit</span></button>
            <button class="delete-link-btn"><span class="material-icons">delete_outline</span></button>
          </li>`;
      id += 1;  
    });
  } else {
    copiedLinks = [];
  }
  listEl.innerHTML = listItems;
}

function saveToLocalStorage(link) {
  let copiedLinks;
  if (localStorage.getItem("links")) {
    copiedLinks = JSON.parse(localStorage.getItem("links"));
  } else {
    copiedLinks = [];
  }
  copiedLinks.push(link);
  localStorage.setItem("links", JSON.stringify(copiedLinks));
}

function removeFromLocalStore(link){
  let copiedLinks;
  if (localStorage.getItem("links")) {
    copiedLinks = JSON.parse(localStorage.getItem("links"));
  } else {
    copiedLinks = [];
  }
  const linkIndex = link.children[0].id
  copiedLinks.splice(linkIndex, 1)
  localStorage.setItem("links", JSON.stringify(copiedLinks));
  renderFromLocalStorage();
}

function editFromLocalStore(link){
  let copiedLinks;
  if (localStorage.getItem("links")) {
    copiedLinks = JSON.parse(localStorage.getItem("links"));
  } else {
    copiedLinks = [];
  }
  const linkIndex = link.children[0].id
  editTitleInputEl.value = copiedLinks[linkIndex].title;
  editLinkInputEl.value = copiedLinks[linkIndex].link;
  editModalContainer.classList.remove("slide-out");
  editModalContainer.classList.add("slide-in");
  modalEdit.classList.remove("display-none");
  saveModalBtnEl.addEventListener("click", () => {
    copiedLinks[linkIndex].title = editTitleInputEl.value
    copiedLinks[linkIndex].link = editLinkInputEl.value
    editModalContainer.classList.add("slide-out");
    editModalContainer.classList.remove("slide-in");
    setTimeout(() => {
      modalEdit.classList.add("display-none");
    }, 500);
    localStorage.setItem("links", JSON.stringify(copiedLinks));
    renderFromLocalStorage();
  });
}

function renderLinks(title, link){
  listEl.innerHTML += `
    <li>
    <a href="${link}" id="${id}" target="_blank">${title}</a>
    <button class="edit-link-btn"><span class="material-icons">edit</span></button>
    <button class="delete-link-btn"><span class="material-icons">delete_outline</span></button>
    </li>`;
    id += 1
}

//EVENT LISTENERS

document.addEventListener("DOMContentLoaded", renderFromLocalStorage())

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

//Adds a link from user input
inputBtnEl.addEventListener("click", function (e) {
  if (e.keyCode === 13) {
    inputBtnEl.click();
  }
  if (inputLinkEl.value != "" && inputTitleEl.value != "") {
    saveToLocalStorage({ title: inputTitleEl.value, link: inputLinkEl.value });
    renderLinks(inputTitleEl.value, inputLinkEl.value)
    inputLinkEl.value = "";
    inputTitleEl.value = "";
    inputTitleEl.focus();
  } else {
    errorModalContainer.classList.remove("slide-out");
    errorModalContainer.classList.add("slide-in");
    modalError.classList.remove("display-none");
  }
});

//Adds the link from current page
saveTabBtnEl.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    saveToLocalStorage({ title: tabs[0].title, link: tabs[0].url });
    renderLinks(tabs[0].title, tabs[0].url)
  });
});

// Allows the user to delete or edit an specific link
listEl.addEventListener("click", function (e) {
  const item = e.target;
  const itemParent = item.parentElement;
  if (item.classList[0] === "delete-link-btn") {
    console.log(itemParent)
    removeFromLocalStore(itemParent);
    itemParent.remove();
  }
  else if (item.classList[0] === "edit-link-btn") {
    editFromLocalStore(itemParent)
  }
});

//Fires up a modal to confirm the deletion of all links
deleteAllBtnEl.addEventListener("click", function () {
  if (localStorage.getItem("links")) {
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
  renderFromLocalStorage();
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
