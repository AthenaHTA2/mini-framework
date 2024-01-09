import {Web_pilot} from "../web_pilot/web_pilot.jsx"
import {App} from "./app.jsx"

export var task 
export var dataId = 0 
export var listInfo = []
export var increment = 0 
//=====> function to create a TODO item <========

/** @jsx Web_pilot.createElement */
export function Header() {

    const NewTodo= (event) => {
  
      if (event.key === "Enter") {
        //append here 
        const appendHere = document.getElementsByClassName("learn-bar")[0];
       //increase increment 
       increment++
        document.querySelector('#todo-items-count').innerHTML = increment
        //get task label
        task = event.target.value
        console.log("task label", task)

        // set section and footer to visible
        section = document.getElementsByClassName("main")[0]
        footer = document.getElementsByClassName("footer")[0]
        section.style.display = "block"
        footer.style.display ="block"
        
        //append to array of list info and pass as a prop to create new task
        let id = "li" + dataId.toString(10) 
        listInfo.push({id:id, label:task, class: "", flag: "active"})
    
        let newTask = Web_pilot.createElement(App)
        Web_pilot.render(newTask, appendHere)
        dataId++
      }
    };
  
  
    return (
      <header className="header" >
        <h1>todos</h1>
        <input
          className="new-todo"
        onKeyDown= {(e) => {NewTodo(e)}}
        placeholder="What needs to be done?" >
      </input>
      </header>
    )
  
  }


  