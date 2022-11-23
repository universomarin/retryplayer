function addElement() {
  const newDiv = document.createElement('div');
  const newContent = document.createTextNode('Nueva tarea');
  newDiv.className = "item";
  newDiv.setAttribute('draggable', 'true');
  newDiv.appendChild(newContent);
  const currentDiv = document.getElementById('container');
  const currentToDo = document.getElementById('to-do');
  const taskNew = currentDiv.insertBefore(newDiv, currentToDo);
  currentToDo.appendChild(taskNew);
}

function dragStart() {
  console.log('drag started');
  dragItem = this;
  setTimeout(() => this.className = 'invisible', 0)
}

function dragEnd() {
  console.log('drag ended');
  this.className = 'item'
  dragItem = null;
}

function dragDrop() {
  console.log('drag dropped');
  this.append(dragItem);
}

function dragOver(e) {
  e.preventDefault()
  console.log('drag over');
}
function dragEnter() {
  console.log('drag entered');
}
function dragLeave() {
  console.log('drag left');
}

const items = document.querySelectorAll('.item')
const columns = document.querySelectorAll('.column')

items.forEach(item => {
  item.addEventListener('dragstart', dragStart)
  item.addEventListener('dragend', dragEnd)
});

columns.forEach(column => {
  column.addEventListener('dragover', dragOver);
  column.addEventListener('dragenter', dragEnter);
  column.addEventListener('dragleave', dragLeave);
  column.addEventListener('drop', dragDrop);
});
