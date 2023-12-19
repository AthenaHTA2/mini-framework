  import {Web_pilot} from "../web_pilot/web_pilot.jsx"
  import { BottomLeft } from "./bottomLeft.jsx"

  export var event
  export var increment = 0

  
/** @jsx Web_pilot.createElement */



export function CreateInput() {
  const appendHere = document.querySelector(".todo-list");
  const displayNum = document.getElementById("todo-count");

  
      const NewTodo= (Event) => {

        event = Event
    
        if (Event.key === "Enter" && Event.target.value != "") {
          
          increment = increment + 1  
    

          let task = Event.target.value
          
          const [state, setState] = Web_pilot.useState(task);  

          console.log("the task is:", state)

          section = document.getElementsByClassName("main")[0]
          footer = document.getElementsByClassName("footer")[0]      
          section.style.display = "block"
          footer.style.display ="block"
          document.querySelector('#writeTodo').value = '';
          document.querySelector('#todo-items-count').innerHTML = increment;
          
    
          function createNewTask() {
          
            return ( 
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

        // function GetCount(e){

        //   if (e.key === "Enter" && e.target.value != ""){

        //     console.log("we are inside GetCount")

        //     increment = increment + 1

        //     function ItsWorking(){
        //       return (
        //         <span className="todo-count">
        //         <strong>{increment}</strong>{" "}
        //         {increment === 1 ? " item" : " items"} left
        //       </span>
        //       )
        //     }

        //     console.log(displayNum)
           
        //     let showNum = Web_pilot.createElement(ItsWorking);
        //     Web_pilot.render(showNum, displayNum);

        //   }




     //   }

      
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
