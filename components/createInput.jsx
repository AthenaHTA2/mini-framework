import {Web_pilot} from "../web_pilot/web_pilot.jsx"
  
  /** @jsx Web_pilot.createElement */
  export function CreateInput() {
  
      const NewTodo= (event) => {
    
        if (event.key === "Enter") {
    
          const appendHere = document.querySelector(".todo-list");
          let task = event.target.value
          const [state, setState] = Web_pilot.useState(task);  

          const theSection = document.querySelector(".main")
          const theFooter = document.querySelector(".footer")

          theSection.setAttribute("style", "display: block;");
          theFooter.setAttribute("style", "display: block;");
    
          function createNewTask() {
          
            return ( 
              <li key={state} >
                <div className="view">
                  <input type="checkbox" className="toggle"/>
                  <label value={state}>{state}</label>
                  <button className="destroy"></button>
                </div>
                <input className="edit" value={state}></input>
              </li>
            )
          }
         
          let newTask = Web_pilot.createElement(createNewTask)
    
          Web_pilot.render(newTask, appendHere)
    
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
    
    /*let appendHere = document.getElementsByClassName("header")[0];
    const showItem = Web_pilot.createElement(CreateInput);
    Web_pilot.render(showItem, appendHere);*/
    
