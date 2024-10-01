$(document).ready(() => {

  const userid = sessionStorage.getItem('id');
  const username = sessionStorage.getItem('username');
  const loggedIn = sessionStorage.getItem('loggedIn');
  var taskList = []

  if(loggedIn){
    Toastify({
      text: `Hi! ${username}`,
      duration: 2500
    }).showToast();

    $("#notify").hide()
    $("#login-area").hide()
    $("#logout-button").removeAttr('hidden')

    $.ajax({
      url: `http://mydb.getenjoyment.net/api/tasks.php?id_user=${userid}`,
      method: 'GET',
      dataType: 'json',
      success: (response) => {
        if(response.data){
          taskList = JSON.parse(response.data)
          console.log(taskList)
          $("#task-list p").remove()
          showTasks()
          hideElements()
        }else{
          console.log('there are no task bro')
        }
      },
      error: (xhr, status, error) => {
        console.log('Error getting tasks', error)
      }
    })


    $("#logout-btn").on('click', ()=>{
      logOut()
    })
  }


  $("#date").hide()
  $("#description").hide()
  $("#title").on('focus', ()=>{
    showElements()
  })

  // saving task
  $("#bg-form").on('submit', (event)=>{
    event.preventDefault()
    var newTask = {
      id: taskList.length + 1,
      title: $("#title").val(),
      date: $("#date").val(),
      description: $("#description").val(),
      completed: false
    }

    if(loggedIn){
      postTaskToDB(userid,newTask)
    }

    taskList.push(newTask)
    $("#task-list p").remove()
    showTasks()
    hideElements()
  })

  const showTasks = () => {
    $("#task-list").empty();
    taskList.forEach(t => {
      const taskItem = $(
        `<div class="card text-bg-${t.completed? "secondary":"dark"} mb-3" style="max-width: 50rem;min-width:30rem;">
          <div class="card-header d-flex justify-content-between">
            <div>
              <input class="form-check-input" type="checkbox" data-index="${t.id}" id="${t.id}" ${t.completed?"checked":""}>
              <label class="form-check-label h5 mx-2 ${t.completed? "text-decoration-line-through":""}" for="${t.id}">${t.title}</label>
            </div>
            <div>
              <button id="edit-btn" type="button" class="btn btn-warning">Edit</button>
              <button id="delete-btn" type="button" class="btn btn-danger">Delete</button>
            </div>
          </div>
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-body-light">${t.due_date}</h6>
            <p class="card-text">${t.description}</p>
          </div>
        </div>`
      )
      
      const checkbox = taskItem.find('.form-check-input')
      const current = checkbox[0]
      const sibling = current.nextElementSibling
      const parent = checkbox.closest('.card')[0]
      const editBtn = taskItem.find('.btn-warning')
      const deleteBtn = taskItem.find('.btn-danger')
      const updateTaskUI = (isCompleted) => {
        if (isCompleted) {
          sibling.classList.add('text-decoration-line-through');
          parent.classList.remove('text-bg-dark');
          parent.classList.add('text-bg-secondary');
        } else {
          sibling.classList.remove('text-decoration-line-through');
          parent.classList.remove('text-bg-secondary');
          parent.classList.add('text-bg-dark');
        }
      }

      // Edit a task
      editBtn2(t, taskItem, editBtn, deleteBtn, current, taskList);

      // Delete a task
      deleteBtn.on('click',() => {
        $.ajax({
          url: `http://mydb.getenjoyment.net/api/tasks.php?id=${t.id}&id_user=${t.id_user}`,
          method: 'DELETE',
          success: (response) => {
            console.log(response)
            taskList = taskList.filter(task => task.id !== t.id)
            taskItem.remove()
            Toastify({
              text: 'Task deleted succesfuly',
              duration: 5000,
            }).showToast();
          },
          error:(xhr, status, error) => {
            console.log('Couldnt delete the task', error)
          }
        })
      })

      checkbox.on('change', () => {
        t.completed = current.checked  
        updateTaskUI(current.checked)
        $.ajax({
          url: `http://mydb.getenjoyment.net/api/tasks.php?id=${t.id}&id_user=${t.id_user}`,
          method: 'PUT',
          data: JSON.stringify({
            title: t.title,
            description: t.description,
            due_date: t.due_date,
            completed: current.checked
          }),
          success: (response) => {console.log(response)}
        });
      })
      $('#task-list').append(taskItem)
    })
  }
  
})


const editBtn2 = (t, taskItem, editBtn, deleteBtn, current, taskList) => {
  $('#task-list').on('click', '.btn-warning', (event)=>{
    event.stopPropagation()
    const editBtn = $(event.target)
    const taskItem = editBtn.closest('.card')
    const taskId = taskItem.find('input.form-check-input').data('index')
    const task = taskList.find(t => t.id === taskId)
  
    const originalTitle = task.title
    const originalDescription = task.description
    const originalDate = task.due_date
  
    const titleField = $(`<input type="text" class="form-control" value="${task.title}" />`)
    const descriptionField = $(`<textarea class="form-control">${task.description}</textarea>`)
    const dateField = $(`<input type="date" class="form-control mb-2" value="${task.due_date}" />`)
    const saveBtn = $('<button class="btn btn-success mx-1">Save</button>')
    const cancelBtn = $('<button class="btn btn-secondary">Cancel</button>')
  
    taskItem.find('.form-check-label').replaceWith(titleField)
    taskItem.find('.card-text').replaceWith(descriptionField)
    taskItem.find('.card-subtitle').replaceWith(dateField)
    editBtn.replaceWith(saveBtn)
    saveBtn.after(cancelBtn)
  
    saveBtn.on('click', () => {
      const updatedTitle = titleField.val()
      const updatedDescription = descriptionField.val()
      const updatedDate = dateField.val()

      const updatedTask = {
        title: updatedTitle,
        description: updatedDescription,
        due_date: updatedDate,
        completed: current.checked
      }
  
      $.ajax({
        url: `http://mydb.getenjoyment.net/api/tasks.php?id=${task.id}&id_user=${task.id_user}`,
        method: 'PUT',
        data: JSON.stringify(updatedTask),
        success: (response) => {
          console.log(response)
  
          task.title = updatedTitle;
          task.description = updatedDescription;
          task.date = updatedDate;
  
          titleField.replaceWith(`<label class="form-check-label h4 mx-2">${updatedTitle}</label>`)
          descriptionField.replaceWith(`<p class="card-text">${updatedDescription}</p>`)
          dateField.replaceWith(`<h6 class="card-subtitle mb-2 text-body-light">${updatedDate}</h6>`)
          saveBtn.replaceWith('<button class="btn btn-warning">Edit</button>')
          cancelBtn.remove()
          
          Toastify({
            text: 'Task updated successfully',
            duration: 5000,
          }).showToast();
        },
        error: (xhr, status, error) => {
          console.log('Couldn’t update the task', error)
        }
      });
    });
  
    cancelBtn.on('click', () => {
      titleField.replaceWith(`<label class="form-check-label h4 mx-2">${originalTitle}</label>`)
      descriptionField.replaceWith(`<p class="card-text">${originalDescription}</p>`)
      dateField.replaceWith(`<h6 class="card-subtitle mb-2 text-body-light">${originalDate}</h6>`)
      saveBtn.replaceWith('<button class="btn btn-warning">Edit</button>')
      cancelBtn.remove()
    });
  });
}

const postTaskToDB = (userid,newTask) => {
  newTask = {
      id_user: userid,
      title: newTask.title,
      description: newTask.description,
      due_date: newTask.date,
      completed: newTask.completed
  }
  $.ajax({
    url: 'http://mydb.getenjoyment.net/api/tasks.php',
    method: 'POST',
    contentType: 'application/json',  
    data: JSON.stringify(newTask),  
    success: function(response) {
      console.log(response)
      Toastify({
        text: 'New task added',
        duration: 5000,
      }).showToast();  
    },
    error: function(xhr, status, error) {
      console.log('Error al agregar la tarea:', error)
    }
});
}

const logOut = () => {
  sessionStorage.removeItem('username')
  sessionStorage.clear()

  Toastify({
    text: 'See you later :D',
    duration: 2500,
    style: {
      background: "#ffc107",
  },
  }).showToast();
  
  setTimeout(()=>{
    window.location.href = 'index.html'
  }, 3000)
}

const showElements = () => {
  $("#date").slideDown(500)
  $("#description").slideDown(500)
}

const hideElements = () => {
  $("#title").val('')
  $("#date").val('')
  $("#description").val('')

  $("#date").slideUp(500)
  $("#description").slideUp(500)
}
