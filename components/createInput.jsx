  import {Web_pilot} from "../web_pilot/web_pilot.jsx"
  import {createNewTask } from "./creatNewTask.jsx";

  export var task 
  export var dataId = 0 
  export var listInfo = []

  //=====> function to create a TODO item <========

  /** @jsx Web_pilot.createElement */
  export function CreateInput() {
  
      const NewTodo= (event) => {
    
        if (event.key === "Enter") {
          //append here 
          const appendHere = document.getElementsByClassName("main")[0];
         
          //get task label
          task = event.target.value
          console.log("task label", task)
          // const [state, setState] = Web_pilot.useState(task);  

          // set section and footer to visible
          section = document.getElementsByClassName("main")[0]
          footer = document.getElementsByClassName("footer")[0]
          section.style.display = "block"
          footer.style.display ="block"
          
          //append to array of list info and pass aas a prop to create new task
          let id = "li" + dataId.toString(10) 
          listInfo.push({id:id, label:task, class: "", flag: "active"})
      
          let newTask = Web_pilot.createElement(createNewTask)
          Web_pilot.render(newTask, appendHere)
          dataId++
        }
      };
    
    
      return (
      <input
        className="new-todo"
        onKeyDown= {(e) => {NewTodo(e)}}
        placeholder="What needs to be done?" >
      </input>
      )
    
    }
    
    // let appendHere = document.getElementsByClassName("header")[0];
    // const showItem = Web_pilot.createElement(CreateInput);
    // Web_pilot.render(showItem, appendHere);


    