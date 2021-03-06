const taskscontainer_element = document.querySelector('.taskcards-container');
function getTasksLs() {
    return JSON.parse((localStorage.getItem('task')));
}
let tasks_tracker = [];
if (getTasksLs()) {
    tasks_tracker = getTasksLs();
}
// render home page
renderhome(tasks_tracker);
function renderhome(taskslist) {
    let count = 0;
    taskslist.map((task) => {
        let task_heading = '';
        if (task.heading) {
            task_heading = task.heading;
        } else {
            task_heading = "Unnamed Task";
        }
        let tasks_number = task.unfinished_tasks.length;
        let task_card = document.createElement('div');
        if (tasks_number) {
            task_card.className = 'todo-card';
        } else {
            task_card.className = 'todo-card finished';
        }
        task_card.id = count;
        task_card.innerHTML = `<div class="trash-container">
                                <i class="fa fa-trash" aria-hidden="true"></i>
                                </div>
                                <h3>${task_heading}</h3>
                                <p>Remaining tasks : ${tasks_number}</p>`;
        taskscontainer_element.appendChild(task_card);
        count += 1;
    });
}
// viewing existing tasks
const taskviewer_element = document.querySelector('.todo-viewer');
const headingviewer_element = document.querySelector('.viewer-header h2');
const countviewer_element = document.querySelector('.viewer-header p');
const unfinishedtasks_element = document.querySelector('.unfinished');
function addtoUnfinishedlist(tasks, element) {
    tasks.map((ut) => {
        let li = document.createElement('li');
        li.innerHTML = `
                <input type="checkbox" />
                 <div>
                    ${ut}
                    </div>`;
        element.appendChild(li);
    });
}
function rendertask(e, task) {
    let idx = undefined;
    if (e.target != task.querySelector('i')) {
        if (e.target == task) {
            idx = task.id;
        } else {
            idx = e.target.parentElement.id;
        }
        headingviewer_element.innerText = tasks_tracker[idx].heading;
        countviewer_element.innerText = 'Unfinshed tasks : ' + tasks_tracker[idx].unfinished_tasks.length;
        let unfinished_tasks = tasks_tracker[idx].unfinished_tasks;
        if (unfinished_tasks.length) {
            addtoUnfinishedlist(unfinished_tasks, unfinishedtasks_element);
        }
        let u = [];
        unfinishedtasks_element.querySelectorAll('li input').forEach((l) => {
            l.addEventListener('change', () => {
                if (l.checked) {
                    l.parentElement.remove();
                    const utasks = unfinishedtasks_element.querySelectorAll('li div');
                    if (utasks.length > 0) {
                        utasks.forEach((d) => {
                            console.log(utasks.length)
                            u.push(d.innerText);
                            tasks_tracker[idx].unfinished_tasks = u;
                            localStorage.setItem('task', JSON.stringify(tasks_tracker));
                        });
                    } else {
                        tasks_tracker[idx].unfinished_tasks = [];
                        localStorage.setItem('task', JSON.stringify(tasks_tracker));
                    }
                    u = [];
                    countviewer_element.innerText = 'Unfinshed tasks : ' + tasks_tracker[idx].unfinished_tasks.length;
                }
            });
        });
        taskviewer_element.classList.add('active');
    }
}
// render the task details upo clicking it
document.querySelectorAll('.todo-card').forEach((t) => {
    t.addEventListener('click', (e) => {
        unfinishedtasks_element.querySelectorAll('li').forEach((l) => {
            l.remove();
        });
        rendertask(e, t);
    });
});
// back button in viewer mode
const backviewer_element = document.querySelector('#viewer-back');
backviewer_element.addEventListener('click', () => {
    taskviewer_element.classList.remove('active');
    location.reload();
});
// deleting task cards from home page
document.querySelectorAll('.todo-card i').forEach((t) => {
    t.addEventListener('click', () => {
        tasks_tracker.splice(t.parentElement.parentElement.id, 1);
        localStorage.setItem('task', JSON.stringify(tasks_tracker));
        location.reload();
    });
});

// handling grid/row view
const gridview_element = document.querySelector('#grid-view');
const rowview_element = document.querySelector('#row-view');
//grid
gridview_element.addEventListener('click', () => {
    taskscontainer_element.classList.remove('rowview');
    document.querySelectorAll('.todo-card').forEach((card) => {
        card.classList.remove('rowview');
    });
    gridview_element.querySelector('i').classList.add('clicked');
    rowview_element.querySelector('i').classList.remove('clicked');
});
//row
rowview_element.addEventListener('click', () => {
    taskscontainer_element.classList.add('rowview');
    document.querySelectorAll('.todo-card').forEach((card) => {
        card.classList.add('rowview');
    });
    gridview_element.querySelector('i').classList.remove('clicked');
    rowview_element.querySelector('i').classList.add('clicked');
});

// handling add task button
const addtask_element = document.querySelector('#add-task-icon');
const createtask_element = document.querySelector('.new-task');
addtask_element.addEventListener('click', () => {
    addtask_element.classList.toggle('hide');
    createtask_element.classList.toggle('active');
    taskheading_element.value = '';
    taskname_element.value = '';
    tasklist_element.querySelectorAll('li').forEach((li) => {
        li.remove();
    });
});
// handling the back button in create task window
const back_taskwidnow_element = document.querySelector("#new-task-back");
back_taskwidnow_element.addEventListener('click', () => {
    createtask_element.classList.remove('active');
    addtask_element.classList.remove('hide');
});
// creation of new task
const taskheading_element = document.querySelector('#task-heading');
const taskname_element = document.querySelector('#task-names');
const tasklist_element = document.querySelector('.new-task-list');
let taskheading_value = '';
let task_value = '';
let tasks_list = [];
// getting task heading
taskheading_element.addEventListener('input', () => {
    taskheading_value = taskheading_element.value;
});
// getting task names
taskname_element.addEventListener('input', () => {
    task_value = taskname_element.value;
});
// entring the task to the list on clicking the enter key
taskname_element.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        if (task_value) {
            e.preventDefault();
            addtask(task_value);
            tasks_list.push(task_value);
            taskname_element.value = '';
            task_value = '';
        } else {
            alert('Invalid task entered !!!')
        }
    }
});
// entering the task to the list after clicking on green tick
const taskcheck_element = document.querySelector('#new-task-check');
taskcheck_element.addEventListener('click', () => {
    if (task_value) {
        addtask(task_value);
        tasks_list.push(task_value);
        taskname_element.value = '';
        task_value = '';

    } else {
        alert('Invalid task entered !!!')
    }
});
// function for adding task
function addtask(task) {
    let task_li = document.createElement('li');
    task_li.innerText = task;
    tasklist_element.insertAdjacentElement('afterbegin', task_li);
}
// saving tasks list
const savetask_element = document.querySelector('#save-task');
savetask_element.addEventListener('click', () => {
    if (tasks_list.length > 0) {
        tasks_tracker.push({
            heading: taskheading_value,
            unfinished_tasks: tasks_list,
        });
        localStorage.setItem('task', JSON.stringify(tasks_tracker));
        location.reload();
        tasklist_element.querySelectorAll('li').forEach((li) => {
            li.remove();
        });
        alert('Added successfully !!!');
    } else {
        alert('At least one task need to be entered');
    }
});
// discarding
const deletetask_element = document.querySelector('#delete-task');
deletetask_element.addEventListener('click', () => {
    createtask_element.classList.remove('active');
    addtask_element.classList.remove('hide');
    tasks_list = [];
    taskheading_element.value = '';
    taskname_element.value = '';
    tasklist_element.querySelectorAll('li').forEach((li) => {
        li.remove();
    });
});