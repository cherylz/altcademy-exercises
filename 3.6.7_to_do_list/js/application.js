var httpRequest = new XMLHttpRequest();

var getRandomQuote = function() {
  $.ajax({
    type: 'GET',
    url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous&count=1',
    dataType: 'json',
    success: function(response) {
      document.querySelector('.random-quote').innerHTML = '"' + response[0].quote + '" - ' + response[0].author;
    },
    error: function() {
      document.querySelector('.random-quote').innerHTML = 'Always get plenty of water.';
    },
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-Mashape-Authorization',  'puULGOKKBImshKkwZXLFCZDJYCdWp1bUI0hjsnWtzMDWBArpZq');
    }
  });
};

// Update the todo item (only if edited) in the server.
var updateTodoEdited = function (targetNode) {
  httpRequest.onload = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log('The todo content is modified.', httpRequest.responseText);
      } else {
        console.log(httpRequest.statusText);
      }
    }
  }
  httpRequest.onerror = function () {
    console.log(httpRequest.statusText);
  }
  var input = targetNode.value;
  if (input !== targetNode.getAttribute('value')) {
    targetNode.setAttribute('value', input);
    var id = targetNode.parentElement.parentElement.getAttribute('data-todoid');
    httpRequest.open('PUT', 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '?api_key=52');
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(JSON.stringify({
      task: {
        content: input
      }
    }));
  }
};

// Update an edited todo item when it lost focus.
var editTodoWhenBlur = function () {
  var editTodo = document.querySelectorAll('.edit-content');
  for (var i = 0; i < editTodo.length; i++) {
    editTodo[i].addEventListener('blur', function (event) {
      updateTodoEdited(event.target);
    });
  }
};

var styleCompletedTodo = function(item) {
  item.querySelector('span').setAttribute('class', 'custom-checkbox');
  item.querySelector('.edit-content').style.textDecoration = 'line-through';
}

var renderTodoItem = function (id, status, content) {
  var todoGroup = document.querySelector('#todo-group');
  var newTodo = document.createElement('div');
  newTodo.setAttribute('class', 'todo-item-wrapper');
  newTodo.setAttribute('data-todoid', id);
  newTodo.setAttribute('data-completed', status);
  var html = '<input type="checkbox">' + '<span></span>' + '<p class="todo-content"><input type="text" class="edit-content" value="' + content + '" required/></p>' + '<div class="remove"><i class="far fa-trash-alt"></i></div>';
  newTodo.innerHTML = html;
  todoGroup.appendChild(newTodo);
  editTodoWhenBlur();
  // Style the completed todo items.
  if (status) {
    newTodo.querySelector('input[type="checkbox"]').checked = true;
    styleCompletedTodo(newTodo);
  }
};

var renderTodoList = function (status) {
  httpRequest.onload = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log('Todo list (raw and full) retrieved from the server.', httpRequest.responseText);
        var todoGroup = document.querySelector('#todo-group');
        while (todoGroup.firstChild) {
          todoGroup.removeChild(todoGroup.firstChild);
        }
        var todoListFromServer = JSON.parse(httpRequest.responseText)['tasks'];
        // Sort the todo items by id.
        todoListFromServer.sort(function (a, b) {
          return a.id - b.id;
        });
        // Render the todo list based on status.
        if (status === 'active') {
         todoListFromServer.forEach(function (item) {
           if (!item.completed) {
             renderTodoItem(item.id, item.completed, item.content);
           }
         });
       } else if (status === 'completed') {
          todoListFromServer.forEach(function (item) {
            if (item.completed) {
              renderTodoItem(item.id, item.completed, item.content);
            }
          });
        } else if (status === 'all') {
          todoListFromServer.forEach(function (item) {
            renderTodoItem(item.id, item.completed, item.content);
          });
        }
      } else {
        console.log(httpRequest.statusText);
      }
    }
  }
  httpRequest.onerror = function () {
    console.log(httpRequest.statusText);
  }
  httpRequest.open('GET', 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=52');
  httpRequest.send();
};

var addTodo = function () {
  var todoGroup = document.querySelector('#todo-group');
  var addSection = document.querySelector('#add-todo');
  var input = addSection.querySelector('input').value; // Study notes: No need to add fallback for input value that contains characters with special meaning such as "&" and HTML elements like <textarea> and <input> because the string in the request is encoded. For example, <input> is encoded to \u003cinput\u003e.
  httpRequest.onload = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log('This new todo is stored in the server.', httpRequest.responseText);
        // To render this new todo item & to store extra info (id, completion status) about it.
        var todoItemFromServer = JSON.parse(httpRequest.responseText)['task'];
        renderTodoItem(todoItemFromServer.id, todoItemFromServer.completed, todoItemFromServer.content);
        addSection.querySelector('input').value = '';
      } else {
        console.log(httpRequest.statusText);
      }
    }
  }
  httpRequest.onerror = function () {
    console.log(httpRequest.statusText);
  }
  if (input) {
    httpRequest.open('POST', 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=52');
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(JSON.stringify({
      task: {
        content: input
      }
    }));
  }
};

var markComplete = function (targetNode) {
  httpRequest.onload = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        targetNode.parentElement.setAttribute('data-completed', 'true');
        styleCompletedTodo(targetNode.parentElement);
        console.log('This todo is marked as completed.', httpRequest.responseText);
      } else {
        console.log(httpRequest.statusText);
      }
    }
  }
  httpRequest.onerror = function () {
    console.log(httpRequest.statusText);
  }
  var id = targetNode.parentElement.getAttribute('data-todoid');
  httpRequest.open('PUT', 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_complete?api_key=52');
  httpRequest.send();
};

var markActive = function (targetNode) {
  httpRequest.onload = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log('This task is marked as active.', httpRequest.responseText);
        targetNode.parentElement.setAttribute('data-completed', 'false');
        targetNode.parentElement.querySelector('span').removeAttribute('class');
        targetNode.parentElement.querySelector('.edit-content').style.textDecoration = '';
      } else {
        console.log(httpRequest.statusText);
      }
    }
  }
  httpRequest.onerror = function () {
    console.log(httpRequest.statusText);
  }
  var id = targetNode.parentElement.getAttribute('data-todoid');
  httpRequest.open('PUT', 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_active?api_key=52');
  httpRequest.send();
};

var deleteTodo = function (targetNode) {
  httpRequest.onload = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log('The task is deleted.', httpRequest.responseText);
        document.querySelector('#todo-group').removeChild(targetNode.parentElement.parentElement);
      } else {
        console.log(httpRequest.statusText);
      }
    }
  }
  httpRequest.onerror = function () {
    console.log(httpRequest.statusText);
  }
  var id = targetNode.parentElement.parentElement.getAttribute('data-todoid');
  httpRequest.open('DELETE', 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '?api_key=52');
  httpRequest.send();
}

document.addEventListener('DOMContentLoaded', function () {
  var filter = document.querySelector('#filter');
  var todoGroup = document.querySelector('#todo-group');
  var addSection = document.querySelector('#add-todo');

  getRandomQuote();

  renderTodoList('all');

  // Filter tasks based on the status.
  filter.querySelector('.all-btn').addEventListener('click', function () {
    renderTodoList('all');
  });
  filter.querySelector('.active-btn').addEventListener('click', function () {
    renderTodoList('active');
  });
  filter.querySelector('.completed-btn').addEventListener('click', function () {
    renderTodoList('completed');
  });

  // Update an edited todo item when the Enter key is pressed on it.
  todoGroup.addEventListener('keyup', function (event) {
    if (event.target.className === 'edit-content' && event.key === 'Enter') {
      updateTodoEdited(event.target);
    }
  });

  // Add a todo item via two ways.
  addSection.addEventListener('click', function (event) {
    if (event.target.parentElement.matches('.add')) {
      addTodo();
    }
  });
  addSection.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      addTodo();
    }
  });

  // Mark complete or active.
  todoGroup.addEventListener('click', function (event) {
    if (event.target.type === 'checkbox') {
      if (event.target.checked === true) {
        markComplete(event.target);
      } else {
        markActive(event.target);
      }
    }
  });

  // Remove a todo item.
  todoGroup.addEventListener('click', function (event) {
    if (event.target.parentElement.matches('.remove')) {
      deleteTodo(event.target);
    }
  });
});
