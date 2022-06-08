const listOfHiddenElems = [];
let isActionClicked = false;
let lastHoveredElement;

const mouseOverHandler = (evt) => {
  const target = evt.target;
  if (
    !target.tagName ||
    target?.id === "remove-element-to-remove" ||
    target?.id === "remove-element-undo" ||
    target?.id === "remove-element-close"
  ) {
    return;
  }
  target.style.border = "3px dotted #7e57c2";
  lastHoveredElement = target;
};

const mouseOutHanlder = (evt) => {
  const target = evt.target;
  if (
    !target.tagName ||
    target?.id === "remove-element-to-remove" ||
    target?.id === "remove-element-undo" ||
    target?.id === "remove-element-close"
  ) {
    return;
  }
  target.style.border = "none";
};

const clickHandler = (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  const target = evt.target;
  if (
    !target ||
    !target?.tagName ||
    target.tagName === "BODY" ||
    target?.id === "remove-element-to-remove" ||
    target?.id === "remove-element-undo" ||
    target?.id === "remove-element-close"
  ) {
    return;
  }
  target.style.opacity = "0";
  updateClickedList(target);
};

const updateClickedList = (target) => {
  if (listOfHiddenElems.length < 5) {
    listOfHiddenElems.push(target);
  } else {
    listOfHiddenElems.shift();
    listOfHiddenElems.push(target);
  }
};

const undoRemoveElementHandler = () => {
  if (listOfHiddenElems.length === 0) {
    return;
  }
  const target = listOfHiddenElems.pop();
  target.style.opacity = "1";
};

const closeHandler = () => {
  removeEventHandler();
  removeActionElement();
  isActionClicked = false;
};

const createActionElement = () => {
  const parent = document.createElement("div");
  const undoDiv = document.createElement("div");
  const undoText = document.createTextNode("Undo remove");
  const closeDiv = document.createElement("div");
  const closeText = document.createTextNode("Close");
  undoDiv.appendChild(undoText);
  closeDiv.appendChild(closeText);
  parent.appendChild(undoDiv);
  parent.appendChild(closeDiv);

  parent.className = "parent";
  parent.id = "remove-element-to-remove";
  undoDiv.className = "item";
  undoDiv.id = "remove-element-undo";
  closeDiv.className = "item";
  closeDiv.id = "remove-element-close";

  undoDiv.onclick = undoRemoveElementHandler;
  closeDiv.onclick = closeHandler;
  window.document.body.appendChild(parent);
};

const removeActionElement = () => {
  document.getElementById("remove-element-to-remove").remove();
};

chrome.runtime.onMessage.addListener(function (event) {
  if (event.message !== "remove_element_clicked_browser_action") {
    return;
  }
  if (!isActionClicked) {
    addEventHandler();
    createActionElement();
    isActionClicked = true;
  } else {
    if (lastHoveredElement) {
      lastHoveredElement.style.border = "none";
    }
    removeEventHandler();
    removeActionElement();
    isActionClicked = false;
  }
});

function addEventHandler() {
  document.addEventListener("mouseover", mouseOverHandler, false);

  document.addEventListener("mouseout", mouseOutHanlder, false);

  document.addEventListener("click", clickHandler, false);
}

function removeEventHandler() {
  document.removeEventListener("mouseover", mouseOverHandler, false);

  document.removeEventListener("mouseout", mouseOutHanlder, false);

  document.removeEventListener("click", clickHandler, false);
}
