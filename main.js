function addToStorage(columnId, inputValue) {
  let existingList = localStorage.getItem(columnId);
  try {
    if (existingList) {
      const column = JSON.parse(existingList);
      column.push(inputValue);
      localStorage.setItem(columnId, JSON.stringify(column));
    } else {
      const column = [];
      column.push(inputValue);
      localStorage.setItem(columnId, JSON.stringify(column));
    }
  } catch (e) {
    console.log(e, "add to storage failed");
  }
}

function removeFromStorage(columnId, inputValue) {
  let existingList = localStorage.getItem(columnId);
  try {
    if (existingList) {
      const column = JSON.parse(existingList);
      const index = column.findIndex((item) => item === inputValue);
      if (index > -1) {
        column.splice(index, 1);
      }
      localStorage.setItem(columnId, JSON.stringify(column));
    }
  } catch (e) {
    console.log(e, "remove from storage failed");
  }
}

function getListFromStorage(columnId) {
  try {
    const column = localStorage.getItem(columnId);
    if (column) {
      return JSON.parse(column);
    }
    return [];
  } catch (e) {
    console.log(e, "retrieve failed");
    return [];
  }
}

function dragDrop(ev) {
  ev.preventDefault();
  ev.target.style.backgroundColor = "#dedede";
}

function dragLeave(ev) {
  ev.preventDefault();
  ev.target.removeAttribute("style");
}

function drag(ev) {
  ev.target.id = "getting-dragged";

  ev.dataTransfer.setData(
    "todoItem",
    JSON.stringify({
      targetId: ev.target.id,
      columnId: getListId(ev.target.parentNode.parentNode),
      todoValue: ev.target.innerText
    })
  );
}

function drop(ev) {
  ev.preventDefault();
  dragLeave(ev);
  const data = JSON.parse(ev.dataTransfer.getData("todoItem"));
  const dropElement = document.getElementById(data.targetId);
  if (ev.target.className === "item") {
    const referenceNode = ev.target;
    referenceNode.parentNode.insertBefore(dropElement, referenceNode);
  } else {
    ev.target.appendChild(dropElement);
  }

  removeFromStorage(data.columnId, data.todoValue);
  addToStorage(getListId(ev.target.closest(".column")), data.todoValue);
  const el = document.getElementById(data.targetId);
  el.removeAttribute("id");
}

const STATE = {
  columns: [
    {
      name: "Backlog",
      isVisible: true
    },
    {
      name: "To do",
      isVisible: true
    },
    {
      name: "Doing",
      isVisible: true
    },
    {
      name: "Testing",
      isVisible: true
    },
    {
      name: "Done 🎉✨🎊",
      isVisible: true
    }
  ]
};

function renderTodoLists(currentDiv, config) {
  const container = document.createElement("div");
  container.className = "container";
  config.columns.forEach((item) => {
    if (item.isVisible) {
      const column = document.createElement("div");
      column.className = "column";
      column.setAttribute("data-id", item.name);
      const columnId = item.name;

      const title = document.createElement("h3");
      title.className = "title";
      title.innerHTML = columnId;
      title.tabIndex = 0;
      title.setAttribute("aria-label", columnId);

      const input = document.createElement("input");
      input.className = "input";
      input.type = "text";
      input.placeholder = "Título de nueva tarea";
      input.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {
          addElement(e);
        }
      });

      const button = document.createElement("button");
      button.className = "icon icon-add";
      button.onclick = addElement;
      button.type = "button";
      

      const content = document.createElement("ul");
      content.className = "content";
      content.ondrop = drop;
      content.ondragover = dragDrop;
      content.ondragleave = dragLeave;
      const items = getListFromStorage(columnId);
      items.forEach((todoValue) => {
        const todoItem = createTodoItem(columnId, todoValue);
        content.appendChild(todoItem);
      });

      column.appendChild(title);
      column.appendChild(content);
      column.appendChild(input);
      column.appendChild(button);

      container.appendChild(column);
    }
  });

  currentDiv.appendChild(container);
}

function addElement(e) {
  const column = e.target.parentNode;

  const inputValue = column.querySelector(".input").value;
  column.querySelector(".input").value = "";

  if (inputValue) {
    const columnId = getListId(column);
    const todoItem = createTodoItem(columnId, inputValue);
    column.querySelector(".content").appendChild(todoItem);
    addToStorage(columnId, inputValue);
  } else {
    alert('Agrega un título a tu tarea');
  }
}

function getListId(column) {
  return column.querySelector(".title").innerHTML;
}

function createTodoItem(columnId, inputValue) {
  const todoItem = document.createElement("item");
  todoItem.className = "item";
  todoItem.innerHTML = inputValue;
  todoItem.tabIndex = 0;

  todoItem.setAttribute("aria-label", `${columnId} column item: ${inputValue}`);

  todoItem.setAttribute("draggable", true);
  todoItem.ondragstart = drag;
  return todoItem;
}

function onTodoClick(e) {
  const columnContent = e.target.parentNode;
  columnContent.removeChild(e.target);
  removeFromStorage(getListId(columnContent.parentNode), e.target.innerText);
}

const currentDiv = document.getElementById("app");
renderTodoLists(currentDiv, STATE);
