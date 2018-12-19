var editTodoWhenBlur = function () {
  var editTodo = document.querySelectorAll('.edit-content');
  for (var i = 0; i < editTodo.length; i++) {
    editTodo[i].addEventListener('blur', function (event) {
      var input = event.target.value; // Question: How to set a if statement so when the input remains the same, the value won't be updated?
      event.target.setAttribute('value', input);
      // console.log('forest');
    });
  }
};

// Add a new task.
var addTodo = function () {
  var todoGroup = document.querySelector('#todo-group');
  var addSection = document.querySelector('#add-todo');
  var input = addSection.querySelector('input').value;
  // TBC: add fallback for input that contains elements like <textarea> and <input>.
  if (input) {
    var newTodo = document.createElement('div');
    newTodo.setAttribute('class', 'todo-item-wrapper');
    var html = '<input type="checkbox">' + '<span class="custom-checkbox"></span>' + '<p class="todo-content"><input type="text" class="edit-content" value="' + input + '" required/></p>' + '<div class="remove"><i class="far fa-trash-alt"></i></div>';
    newTodo.innerHTML = html;
    todoGroup.appendChild(newTodo);
    addSection.querySelector('input').value = '';
    editTodoWhenBlur();
  }
};

document.addEventListener('DOMContentLoaded', function() {

  var addSection = document.querySelector('#add-todo');
  var todoGroup = document.querySelector('#todo-group');

  // Add a todo item via two ways
  addSection.addEventListener('click', function (event) {
    if (event.target.className == 'fas fa-plus-circle') {
      addTodo();
    }
  });
  addSection.addEventListener('keyup', function (event) {
    if (event.key == 'Enter') {
      addTodo();
    }
  });

  // Remove a todo item
  todoGroup.addEventListener('click', function (event) {
    if (event.target.parentElement.matches('.remove')) {
      this.removeChild(event.target.parentElement.parentElement);
      // TBC: may trigger DELETE?
    }
  });

  // Strike through the item when completed
  todoGroup.addEventListener('click', function (event) {
    if (event.target.type == 'checkbox') {
      if (event.target.checked == true) {
        event.target.parentElement.querySelector('.edit-content').style.textDecoration = 'line-through';
      } else {
        event.target.parentElement.querySelector('.edit-content').style.textDecoration = '';
      }
    }
  });

  // Update an edited todo item when the item is not focused
  editTodoWhenBlur();
  // Update an edited todo item when Enter key is pressed
  todoGroup.addEventListener('keyup', function (event) {
    if (event.target.className == 'edit-content' && event.key == 'Enter') {
      var input = event.target.value;
      event.target.setAttribute('value', input);
      // console.log('tree');
    }
  });

});
