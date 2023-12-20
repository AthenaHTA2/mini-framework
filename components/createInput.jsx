  import {Web_pilot} from "../web_pilot/web_pilot.jsx"

  //shows number of todos bottom left
  export var increment = 0
  //The tasks array is a global variable kept in browser's local storage
  // let ArrayOfTasks = [];
  var OneTask

  
/** @jsx Web_pilot.createElement */
export function CreateInput() {
  const appendHere = document.querySelector(".todo-list");
  const displayNum = document.getElementById("todo-count");

  

  //use to re-render the entire list of to-dos    
  const NewTodo= (Event) => {
    
        if (Event.key === "Enter" && Event.target.value != "") {
          
          increment = increment + 1  

          let task = Event.target.value
          
          const [state, setState] = Web_pilot.useState(task);  

          console.log("the task is:", state)

          //append new task to array of tasks
          // ArrayOfTasks.push(task);
          // console.log("the array of tasks is:", ArrayOfTasks)
          //save array in localstorage
          // localStorage.setItem('todoArray', JSON.stringify(ArrayOfTasks));

          //unhide the 'All', 'Active' and 'Completed' buttons
          section = document.getElementsByClassName("main")[0]
          footer = document.getElementsByClassName("footer")[0]      
          section.style.display = "block"
          footer.style.display ="block"
          //clear new task input
          document.querySelector('#writeTodo').value = '';
          //show number of live todos
          document.querySelector('#todo-items-count').innerHTML = increment;
          
          //retrieve the tasks array from localstorate
          // ArrayOfTasks = localStorage.getItem('todoArray');
          // parse array of tasks so it can be used in js
          // ArrayOfTasks = JSON.parse(ArrayOfTasks);

          function createNewTask() {
             return(
                <li key={task} >
                  <div className="view">
                    <input type="checkbox" className="toggle"/>
                    <label value={task} >{task}</label>
                    <button className="destroy"></button>
                  </div>
                  <input className="edit" value={task}></input>
                </li>
             )
          }

          let newTask = Web_pilot.createElement(createNewTask);
          Web_pilot.render(newTask, appendHere);

        }
        }

      
        return (
        <input
          className="new-todo"
          id="writeTodo"
          onKeyDown={(e) => {  NewTodo(e) 
          } }
          placeholder="What needs to be done?">
        </input>
        )
        
      };

    
    
    // let appendHere = document.getElementsByClassName("header")[0];
    // const showItem = Web_pilot.createElement(CreateInput);
    // Web_pilot.render(showItem, appendHere);*/


///** @jsx Web_pilot.createElement */
/*export function CreateInput() {
 const [state, setState] = Web_pilot.useState(0);
  footer = document.getElementsByClassName("footer")[0];
  section = document.getElementsByClassName("main")[0];

  const NewTodo = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      const appendHere = document.querySelector(".todo-list")[0];
      let task = event.target.value;
      console.log("the task inside CreateInput:", task)
     // setToDo(oldArray => [...oldArray, task]);
      //console.log("the toDo state inside NewTodo:", toDo)

      section.style.display = "block";
      footer.style.display = "block";
      document.querySelector("#writeTodo").value = "";

      function createNewTask() {
        return (
          <li key={task}>
            <div className="view">
              <input type="checkbox" className="toggle" />
              <label value={task}>{task}</label>
              <button className="destroy"></button>
            </div>
            <input className="edit" value={task}></input>
          </li>
        );
      }


      let newTask = Web_pilot.createElement(createNewTask);
      Web_pilot.render(newTask, appendHere);

    }
  };

  function BottomLeft(Event) {  
    console.log("Number of tasks inside BottomLeft before if:",state)
    const displayCount = document.getElementsByClassName("new-todo");
    displayCount.addEventListener("input", () => setState(c => c + 1 ));
    console.log("the input event works?",state)
      if (Event.key === "Enter" && Event.target.value !== "Gotli") {
        // Update task count and render the bottomLeft element
        //setCount(count => count + 1 );
        console.log("Number of tasks inside BottomLeft after if:", state)

        function showCount(){
        return (
          <span class="todo-count">
            <strong>{state}</strong>{" "}
            {state === 1 ? " item" : " items"} left
          </span>
        );
      };
      //const displayCount = document.getElementsByClassName("todo-count")[0];
      const updateCount = Web_pilot.createElement(showCount);
      Web_pilot.render(updateCount, displayCount);
    }
  
}

  return (
    <input
      className="new-todo"
      id="writeTodo"
      onKeyDown={(e) => {
        NewTodo(e);
        BottomLeft(e);
      }}
      placeholder="What needs to be done?"
    ></input>
  );
}*/
