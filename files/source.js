// Получаем необходимые элементы из DOM
const textArea = document.querySelector('.main-text-area');
const sendButton = document.querySelector('.buttonSubmit');
const tasksMain = document.querySelector('.section-with-Tasks');


// Загружаем задачи из локального хранилища
let tasksArrFromLocal = loadTasksFromLocalStorage();

// Рендерим все задачи из локального хранилища на странице
tasksArrFromLocal.forEach(renderTaskList);

// Добавляем обработчик события на кнопку отправки (создания новой задачи)
sendButton.addEventListener('click', takeValueArea);


function takeValueArea() {
    const taskText = textArea.value.trim(); // Получаем текст из текстового поля
    if (!taskText) return; // Если текстовое поле пустое, прекращаем выполнение функции

    const taskData = { id: Date.now().toString(), text: taskText, status: false }; // Создаем объект задачи с ID, текстом 

    tasksArrFromLocal.push(taskData); // Сохраняем задачу в массив `tolocalStorage`
    saveTasksToLocalStorage(tasksArrFromLocal); // Сохраняем обновленный список задач в локальное хранилище

    renderTaskList(taskData); // Отображаем новую задачу на экране
    textArea.value = ''; // Очищаем текстовое поле
}

function renderTaskList(taskData) { // Функция для отображения задачи на экране

    const taskDiv = document.createElement('div'); // Создаем новый div элемент для задачи
    taskDiv.className = 'task md:gap-0 flex md:flex-row items-center 2sm:gap-5 2sm:flex-col py-4'; // Присваиваем ему класс 'task'
    taskDiv.dataset.taskId = taskData.id; // Добавляем data-атрибут с ID задачи

    const taskSecDiv = document.createElement('div');
    taskSecDiv.className = 'flex';


    const isComplete = taskData.status ? 'radio-button-on' : 'radio-button-off';
    
    // Создаем кнопку для отметки задачи как выполненной
    const buttonDone = document.createElement('button');
    buttonDone.className = 'button-done px-5';
    buttonDone.innerHTML = `
        <img class="${isComplete}" 
        src=".../images/${isComplete}.png">
    `;

    // Создаем кнопку для удаления задачи
    const buttonDelete = document.createElement('button');
    buttonDelete.className = 'delete-button rounded-lg text-white mx-3 py-2 px-2 bg-red-600 transform hover:scale-105 transition ease-out duration-500 sm:text-sm';
    buttonDelete.textContent = 'Delete task'; // Устанавливаем текст кнопки

    const buttonChange = document.createElement('button');
    buttonChange.className = 'button-change rounded-lg text-white mx-3 py-2 px-2 bg-blue-600 transform hover:scale-105 transition ease-out duration-500 sm:text-sm';
    buttonChange.textContent = 'Change task';


    taskDiv.innerHTML = `
    <p class="text py-5 px-5" contenteditable="false">${taskData.text}</p> 
    <!-- Вставляем текст задачи в элемент p -->
    `;

    taskDiv.prepend(buttonDone); // Добавляем кнопку в начало div элемента задачи
    taskSecDiv.appendChild(buttonDelete); // Добавляем кнопку удаления в div элемента задачи
    taskSecDiv.appendChild(buttonChange);
    taskDiv.appendChild(taskSecDiv);
    tasksMain.append(taskDiv); // Добавляем задачу в основной контейнер задач на странице


    // Добавляем обработчик события на кнопку выполнения задачи
    buttonDone.addEventListener('click', () => changeStatus(taskData.id));

    // Добавляем обработчик события на кнопку удаления задачи
    buttonDelete.addEventListener('click', () => {
        deleteTask(taskData.id); // Передаем ID задачи в функцию удаления
        saveTasksToLocalStorage(tasksArrFromLocal); // Обновляем локальное хранилище после удаления задачи
    }); 

    buttonChange.addEventListener('click', () => changeText(taskData, buttonChange));

    console.log('Task added:', taskData);
}

function changeStatus(taskId) {
    const taskIndex = tasksArrFromLocal.findIndex(task => task.id === taskId);

    if(taskIndex !== -1){
        const taskByIndex = tasksArrFromLocal[taskIndex];
        taskByIndex.status = !taskByIndex.status;

        const taskDiv = document.querySelector(`.task[data-task-id="${taskId}"]`);
        const img = taskDiv.querySelector('.button-done img');

        img.src = taskByIndex.status ? '/images/radio-button-on.png' : '/images/radio-button-off.png';
        img.classList.toggle('radio-button-on');
        img.classList.toggle('radio-button-off');

        saveTasksToLocalStorage(tasksArrFromLocal);

        console.log('Task status changed:', taskByIndex);
    }
   
}

function deleteTask(id) {  // Функция для удаления задачи
    const taskToDelete = document.querySelector(`.task[data-task-id="${id}"]`); // Находим задачу по ID
    if (taskToDelete) {
        taskToDelete.remove(); // Удаляем задачу из DOM
    }

    // Обновляем массив `tasksArrFromLocal`, удаляя задачу с соответствующим ID
    tasksArrFromLocal = tasksArrFromLocal.filter(taskData => taskData.id !== id);
    saveTasksToLocalStorage(tasksArrFromLocal); // Сохраняем обновленный список задач в локальное хранилище

    console.log('Tasks after deletion:', tasksArrFromLocal);

}

function changeText(taskData, button){
    const taskDiv = document.querySelector(`.task[data-task-id="${taskData.id}"]`);
    const textInTask = taskDiv.querySelector(`.text`);
    
    textInTask.setAttribute("contenteditable", true);
    button.textContent = 'Save changes';
    
    button.removeEventListener('click', () => changeText(taskData, button));
    button.addEventListener('click', () => saveChanges(taskData, textInTask, button));
}

function saveChanges(taskData, textInTask, button){
    const taskIndex = tasksArrFromLocal.findIndex(task => task.id === taskData.id);
    
    if(taskIndex !== -1) {
        // Обновляем текст задачи
        tasksArrFromLocal[taskIndex].text = textInTask.textContent;

        // Сохраняем обновления в localStorage
        saveTasksToLocalStorage(tasksArrFromLocal);

        // Делаем текст задачи не редактируемым
        textInTask.setAttribute("contenteditable", false);

        // Меняем текст кнопки обратно на 'Change task'
        button.textContent = 'Change task';

        // Восстанавливаем обработчик события для изменения задачи
        button.removeEventListener('click', () => saveChanges(taskData, textInTask, button));
        button.addEventListener('click', () => changeText(taskData, button));

        console.log('Task text changed:', tasksArrFromLocal[taskIndex]);
    }
}

function saveTasksToLocalStorage(tasks) { // Функция для сохранения задач в локальное хранилище
    localStorage.setItem('tasksLocal', JSON.stringify(tasks)); // Преобразуем массив задач в строку и сохраняем в localStorage
}

function loadTasksFromLocalStorage() { // Функция для загрузки задач из локального хранилища
    const tasks = localStorage.getItem('tasksLocal'); // Получаем данные из localStorage
    return tasks ? JSON.parse(tasks) : []; // Преобразуем данные из строки в массив, если данные есть, иначе возвращаем пустой массив
}


