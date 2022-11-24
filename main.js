let task = null;

function addElement() {
  const newDiv = document.createElement('div');
  newDiv.className = "item";
  newDiv.setAttribute('draggable', 'true');
  newDiv.setAttribute("id", 'task_' + Math.random().toString(36));
  const newContent = document.createTextNode('Nueva tarea');
  newDiv.addEventListener('dragstart', dragStart)
  newDiv.addEventListener('dragend', dragEnd)
  newDiv.appendChild(newContent);
  const currentDiv = document.getElementById('container');
  const currentToDo = document.getElementById('to-do');
  task = currentDiv.insertBefore(newDiv, currentToDo);
  currentToDo.appendChild(task);
  console.log(task);
}

const items = document.querySelectorAll('.item')
const columns = document.querySelectorAll('.column')

columns.forEach(column => {
  column.addEventListener('dragover', dragOver);
  column.addEventListener('dragenter', dragEnter);
  column.addEventListener('dragleave', dragLeave);
  column.addEventListener('drop', dragDrop);
});

function dragEnter() {
  console.log('drag entered', task);
}
function dragOver(e) {
  e.preventDefault()
  console.log('drag over', task);
}
function dragLeave() {
  console.log('drag left - r', task);
}
function dragDrop() {
  console.log('drag dropped', task);
  this.append(task);
  console.log('drag dropped-2', task);
}
function dragStart() {
  console.log('drag started');
  task = this;
  setTimeout(() => this.className = 'invisible', 0)
}
function dragEnd() {
  console.log('drag ended');
  this.className = 'item'
  task = null;
}
