//==================== COMMON ==================== //

//get Node Index by count the number of Previous Element in ParrentNode
function getElementIndex(node) {
    var index = 0;
    while ( (node = node.previousElementSibling) ) {
        index++;
    }
    return index;
}

//Comparation for DateTime, return negative, 0, positive
function DateComparation(a, b) {  
    if(a.slice(0, 3) - b.slice(0, 3) != 0) {
        return a.slice(0, 3) - b.slice(0, 3);
    }
    else {
        for(let i = 5; i <= 14; i += 3) {
            if(a.slice(i, i+2) - b.slice(i, i+2) != 0) {
                return a.slice(i, i+2) - b.slice(i, i+2);
            }
        }
    }
    return 0;
}

function TaskSortComparation(l, r) {
    a = l[3];
    b = r[3];
    return DateComparation(a, b);
}

function* enumerate(iterable) {
    let i = 0;

    for (const x of iterable) {
        yield [i, x];
        i++;
    }
}

//==================== ROOT ==================== //

const Main = document.getElementById('main');

var TasksList = GetTodos();
TasksList = TasksList? TasksList: [];

TasksList.sort(TaskSortComparation);

var CurrentPage = GetCurrentPage();
CurrentPage = CurrentPage? CurrentPage: 'all';

var AlertTasks = GetAlertTasks();
AlertTasks = AlertTasks? AlertTasks: [];


const Root = document.getElementById('todos');
RootUpdate();

//==================== FUNCTIONS ==================== //

document.getElementById(`${CurrentPage}_filter-btn`).classList.add('choosed');

function GetAlertTasks() {
    var data = JSON.parse(localStorage.getItem('AlertTasks'));
    return data
}

function RootUpdate() {
    SaveTodos();
    Root.innerHTML = '';
    Root.appendChild(LoadTodos());
    // AlertTasks.forEach(data => {
    //     Main.appendChild(LoadAlertTasks(data));
    // })
    for(const [index, data] of enumerate(AlertTasks)) {
        div = LoadAlertTasks(data);
        if(index === 0) {
            div.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        }
        Main.appendChild(div);
    }
}

function SaveAndReset() {
    SaveTodos()
    location.reload()
}

// Get CurrentPage from localStorage and return as js type
function GetCurrentPage() {
    var data = JSON.parse(localStorage.getItem('CurrentPage'));
    return data
}

// PUSH TasksList to localStorage as JSON
function SaveTodos() {
    localStorage.setItem('Tasks', JSON.stringify(TasksList));
    localStorage.setItem('AlertTasks', JSON.stringify(AlertTasks));
}

// Get JSON from localStorage and return as javascript type
function GetTodos() {
    var tasks = JSON.parse(localStorage.getItem('Tasks'));
    return tasks;
}

//Convert TasksList to a string of bunch of li and return
function LoadTodo() {
    var res = '';
    if(CurrentPage === 'all') {
        for (const element of TasksList) {
            if(element[0] === 'completed') {
                res = res + `<li class='task ${element[0]} flex-row'><div class='flex-row'><div class='flex-col'><input type='text' value='${element[1]}' class='task-title' readonly><textarea cols="46" rows="3" class='task-des' readonly>${element[2]}</textarea><input type="datetime-local" class='task-datetime' onfocus="this.showPicker()" value="${element[3]}"readonly></div></div><div class="flex-col task-btns"><label class="task-check-box"><input type="checkbox"><span class="checkmark"></span></label><label class="task-del-btn"><i class="ti-trash"></i></label></div></li>`;
            }
            else {
                res = res + `<li class='task ${element[0]} flex-row'><div class='flex-row'><div class='flex-col'><input type='text' value='${element[1]}' class='task-title'><textarea cols="46" rows="3" class='task-des'>${element[2]}</textarea><input type="datetime-local" class='task-datetime' onfocus="this.showPicker()" value="${element[3]}"></div></div><div class="flex-col task-btns"><label class="task-check-box"><input type="checkbox"><span class="checkmark"></span></label><label class="task-del-btn"><i class="ti-trash"></i></label></div></li>`;
            }
        }
        document.getElementById('total-task').value += TasksList.length
    }
    else {
        for(const element of TasksList.filter((element) => {return element[0] === CurrentPage})) {
            if(element[0] === 'completed') {
                res = res + `<li class='task ${element[0]} flex-row'><div class='flex-row'><div class='flex-col'><input type='text' value='${element[1]}' class='task-title' readonly><textarea cols="46" rows="3" class='task-des' readonly>${element[2]}</textarea><input type="datetime-local" class='task-datetime' onfocus="this.showPicker()" value="${element[3]}"readonly></div></div><div class="flex-col task-btns"><label class="task-check-box"><input type="checkbox"><span class="checkmark"></span></label><label class="task-del-btn"><i class="ti-trash"></i></label></div></li>`;
            }
            else {
                res = res + `<li class='task ${element[0]} flex-row'><div class='flex-row'><div class='flex-col'><input type='text' value='${element[1]}' class='task-title'><textarea cols="46" rows="3" class='task-des'>${element[2]}</textarea><input type="datetime-local" class='task-datetime' onfocus="this.showPicker()" value="${element[3]}"></div></div><div class="flex-col task-btns"><label class="task-check-box"><input type="checkbox"><span class="checkmark"></span></label><label class="task-del-btn"><i class="ti-trash"></i></label></div></li>`;
            }
        }
        document.getElementById('total-task').value += TasksList.filter((element) => {return element[0] === CurrentPage}).length
    }
    return res
}

{/* <li class='task ${element[0]} flex-row'>
    <div class='flex-row'>
        <div class='flex-col'>
            <input type='text' value='${element[1]}' class='task-title'>
            <textarea cols="46" rows="3" class='task-des'>${element[2]}</textarea>
            <input type="datetime-local" class='task-datetime' onfocus="this.showPicker()" value="${element[3]}">
        </div>
    </div>
    <div class="flex-col task-btns">
        <label class="task-check-box">
            <input type="checkbox">
            <span class="checkmark"></span>
        </label>
        <i class="ti-trash task-del-btn"></i>
    </div>
</li> */}

// localStorage.setItem("Tasks", JSON.stringify([["progress","Buy Danny a coffee", "Buy Danny a coofee in the CaFein", "10/04/2023"], ["progress","Buy Danny an OreO", "Buy Danny an OreO In Go", "10/05/2023"], ["completed","Breakup", "Breakup with .... ", "12/04/2023"]]))

// return html Ul to add to Root
function LoadTodos() {
    var Ul = document.createElement('ul');
    Ul.innerHTML = LoadTodo();
    return Ul
}

//==================== GET EVENT ==================== //

//Erase an Li when click TrashButton
document.querySelectorAll('.task-del-btn').forEach(item =>
    item.addEventListener('click', () => {
        var index = getElementIndex(item.parentElement.parentElement.parentElement);
        const response = confirm("Bạn có chắc muốn xoá: " + TasksList[index][1]);
        if(response) {
            TasksList.splice(index, 1);
            SaveAndReset();
        }
    })
)

document.querySelectorAll('.task-check-box .checkmark').forEach(item =>
    item.addEventListener('click', () => {
        var index = getElementIndex(item.parentElement.parentElement.parentElement);
        if(TasksList[index][0] === 'completed') {
            TasksList[index][0] = 'progress';
        }
        else {
            TasksList[index][0] = 'completed';
        }
        SaveAndReset();
    })
)

//add new Tasks when click on button have id 'add-btn'
document.getElementById('add-btn').addEventListener('click', () => {
    var title = document.getElementById('add-title').value;
    var des = document.getElementById('add-des').value;
    var date = document.getElementById('add-date').value;
    if(!title) {
        alert('Bạn chưa nhập Nội dung công việc');
    }
    else if(!date) {
        alert('Bạn chưa chọn thời hạn công việc');
    }
    else {
        TasksList.push(['progress', title, des, date]);
        RootUpdate();
        location.reload();
    }
})

//change type of page and save it to localStorage
document.getElementById('all_filter-btn').addEventListener('click', () => {
    localStorage.setItem("CurrentPage", JSON.stringify('all'))
    RootUpdate();
    location.reload();
})
document.getElementById('progress_filter-btn').addEventListener('click', () => {
    localStorage.setItem("CurrentPage", JSON.stringify('progress'))
    RootUpdate();
    location.reload();
})
document.getElementById('completed_filter-btn').addEventListener('click', () => {
    localStorage.setItem("CurrentPage", JSON.stringify('completed'))
    RootUpdate();
    location.reload();
})

//save Tasks, push in localStorage also
document.querySelectorAll(".task-title").forEach(title =>
    title.addEventListener("change", () => {
        var index = getElementIndex(title.parentElement.parentElement.parentElement);
        TasksList[index][1] = title.value;
        SaveTodos();
    })
)

document.querySelectorAll(".task-des").forEach(title =>
    title.addEventListener("change", () => {
        var index = getElementIndex(title.parentElement.parentElement.parentElement);
        TasksList[index][2] = title.value;
        SaveTodos();
    })
)

document.querySelectorAll(".task-datetime").forEach(title =>
    title.addEventListener("change", () => {
        var index = getElementIndex(title.parentElement);
        TasksList[index][3] = title.value;
        SaveTodos();
    })
)

function LoadAlertTasks(data) {
    var div = document.createElement('div');
    div.classList.add('alert-task');
    div.innerHTML = `<div><div class="header">Công việc đã hết hạn</div><div class="body"><h3>${data[1]}</h3><p>${data[2]}</p><input type="datetime-local" value="${data[3]}" readonly></div><div class="footer">Đóng</div></div>`;
    return div;
}

{/* <div class="task-alert">
    <div>Công hiện đã hết hạn</div>
    <div>
        <h3>${data[1]}</h3>
        <p>${data[2]}</p>
        <input type="datetime-local" value="${data[3]}">
    </div>
    <button>Đóng</button>
</div> */}

//per 10s check if any task time up, and to AlertTasks
setInterval(() => {
    var currentdate = new Date();
    var date = currentdate.getFullYear() + '-' + ((currentdate.getMonth()+1 <= 9)? ('0' + (currentdate.getMonth()+1)): (currentdate.getMonth()+1)) + '-' + ((currentdate.getDate()+1 <= 9)? ('0' + (currentdate.getDate()+1)): (currentdate.getDate())) + 'T' + currentdate.getHours() + ':' + currentdate.getMinutes();
    TasksList.filter((element) => {return element[0] === 'progress'}).forEach((task, index) => {
        if(DateComparation(date, task[3]) >= 0) {
            task[0] = 'completed';
            AlertTasks.push(task);
            SaveAndReset();
        }
    })
}, 10000);

document.querySelectorAll('.alert-task .footer').forEach(button => {
    button.addEventListener('click', () => {
        var index = getElementIndex(button.parentElement.parentElement) - 2;
        AlertTasks.splice(index, 1);
        SaveAndReset();
    })
})