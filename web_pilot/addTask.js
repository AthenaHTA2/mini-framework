
const root = document.querySelector("#root")
const newTaskBar = Web_pilot.createElement(
        "input", 
        {className:"new-todo", 
        placeholder:"what sjkhjdka needsto be done?", 
        autofocus: "true", 
        onkeydown: (e) => {e.key == 'Enter'? AddTask(e.target.value): null} 
        },
    )
   Web_pilot.render(newTaskBar, root)
   const footer = document.querySelector("footer")
 


function AddTask(taskLabel) {
    console.log("my event works")
    //create task list item and data-id attribute: li/div/input + label
    //input -> label text 
    //add events -> on click checkbox: completed class, on double click: editing class, on hover: delete button
    //footer set to visible
    //increase counter value
}