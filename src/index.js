const inputElement = document.getElementById('input')
const listElement = document.getElementById('list')
const formElement = document.getElementById('form')

let tasks = []
const urlReq = 'https://jsonplaceholder.typicode.com/posts'

StatementOfLocalStorage()
checkEmptyList()

formElement.addEventListener('submit',addTask)
listElement.addEventListener('click',deleteTask)
listElement.addEventListener('click',doneTask)

function addTask(event) {
    event.preventDefault();
    if (inputElement.value.length < 1) {
        return
    }

    const newTask = {
        id:Date.now(),
        text: inputElement.value,
        done:false
    }

    tasks.push(newTask)
    renderTask(newTask)
    saveToLocalStorage()
    checkEmptyList()

    inputElement.value = ''
    inputElement.focus()

    fetch(urlReq, {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
        .then(response => {
            if (response.ok) {
                alert('Задача успешно добавлена!');
            } else {
                alert('Ошибка при добавлении задачи!');
            }
        })
        .catch(error => {
            alert('Произошла ошибка: ' + error);
        });
}

function deleteTask(event) {
    if (event.target.dataset.action !== 'delete') return ;

    const parentNode = event.target.closest('.main__content__list__element')

    const taskId = Number(parentNode.id)

    const index = tasks.findIndex((task) => task.id === taskId)

    tasks.splice(index,1)
    parentNode.remove()
    checkEmptyList()
    saveToLocalStorage()
}

function doneTask(event) {
    if (event.target.dataset.action === 'done') {
        const parentNode = event.target.closest('.main__content__list__element')
        const taskId = Number(parentNode.id)

        const newTask = tasks.find((task) => task.id === taskId);

        newTask.done = !newTask.done

        const spanElement = parentNode.querySelector('.main__content__list__element__span')
        spanElement.classList.toggle('done')
        saveToLocalStorage()
    }
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHtml = `
            <li class="main__content__list__empty_list" id="emptyList">
                <h1 id="empty_list_h1">Список дел пуст</h1>
            </li>`

        listElement.insertAdjacentHTML('afterbegin', emptyListHtml)
    } else {
        const emptyListEl = document.getElementById('emptyList')
        emptyListEl ? emptyListEl.remove(): null;
    }
}

function renderTask(task) {
    const cssClass = task.done ? "main__content__list__element__span done": "main__content__list__element__span";

    listElement.insertAdjacentHTML('beforeend',
        `<li id="${task.id}" class="main__content__list__element">
                <span class="${cssClass}">${task.text}</span>
                <span>
                    <button class="main__content__list__element__btn" data-action="done">✓</button>
                    <button class="main__content__list__element__btn red" data-action="delete">×</button>
                </span>
            </li>`)
}

function StatementOfLocalStorage() {
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'))
        tasks.forEach((task) => renderTask(task))
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks',JSON.stringify(tasks))
}

