
const root = document.querySelector("header")
const newTaskBar = Web_pilot.createElement(
        "input", 
        {className:"new-todo", 
        placeholder:"What needs to be done?", 
        autofocus: "true", 
        onkeydown: (e) => {e.key == 'Enter'? AddTask(e): null} 
        },
    )
Web_pilot.render(newTaskBar, root)

let dataId = 0

function AddTask(event) {
    console.log("my event works")
    //set section and footer to visible
    let section = document.getElementsByClassName('main')
    let footer = document.getElementsByClassName('footer')
    console.log(event.target.value)
    console.log(section, footer)
    if (section[0].style.display == 'none' && footer[0].style.display == 'none') {
        section[0].style.display = 'block'
        footer[0].style.display = 'block'
    }
    //input -> label text 
    AddTaskItem(event)

    //increase counter value
}

function AddTaskItem(event) {
    //task list 
    let todoList = document.getElementsByClassName("todo-List")[0]
    //create task list item and add ata-id attribute: li/div/input + label + button
    let newDataId = dataId
    const newTaskItem = Web_pilot.createElement(
        "li", 
        {className:"", 
        "data-id" : newDataId,
        ondblclick: (e) => {
            EditTaskItem(e, newDataId)
        } 
        },[{ 
            type: "div",
            props: {className: "view"},
            children: [
                {
                    type: "input", 
                    props: {
                        className: "toggle", 
                        type: "checkbox", 
                        onclick: (e) => { ToggleTaskItem(e, newDataId)},
                        children: []
                    },
                },
                {
                    type: "label",
                    props: {
                      children: event.target.value  
                    },
                    
                },
                {
                    type: "button",
                    props: {
                        className:"destroy", 
                        onclick: (e)=> {DeleteListItem(e, newDataId)},
                        children: []
                    }
                }
            ]
        }],
    )
    Web_pilot.render(newTaskItem, todoList)
    dataId++
}

function EditTaskItem() {
    //on double click: editing class
}

function ToggleTaskItem() {
    // on click checkbox: completed class
}

function DeleteListItem() {
    // on hover: delete button
}