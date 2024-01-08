import {Web_pilot} from "../web_pilot/web_pilot.jsx"
import { listInfo } from "./createInput"
import {App} from "./app.jsx"


/** @jsx Web_pilot.createElement */

export function List() {
    function EditTaskItem(e) {
        //on double click: editing class
        // let item = document.getElementById(`${e.target.tag}`)
        // console.log("edit item: I work!", item, e)
        // item.classList.add('editing')
        listInfo.map((l, i) => {
          if (l.id == e.target.tag){
            let val = e.target.value
           listInfo.splice(i, 1, {id: l.id, label:val, class: l.class+" editing"})
          } 
    })
        // listInfo = listInfoC
        console.log("edit listInfo", listInfo, e.target.value)
        const appendHere = document.getElementsByClassName("learn-bar")[0];
          let newTask = Web_pilot.createElement(App)
          Web_pilot.render(newTask, appendHere)
      }
    
      function ToggleTaskItem(e) {
        // on click checkbox: completed class
        console.log("toggle task: I work!")
        listInfo.map((l, i) => {
          if (l.id == e.target.tag){
            if (l.flag === "completed") {
              listInfo.splice(i, 1, {id: l.id, label:l.label, class:l.class.replace("completed", "active"), flag: "active"})
            } else {
              console.log("uncompleted")
              listInfo.splice(i, 1, {id: l.id, label:l.label, class: "completed"+l.class, flag:"completed"})
            } 
          } 

        })
        let listInfoC = listInfo.filter((l) => l.flag === "completed")
        if (listInfoC.length > 0) {
          document.getElementsByClassName('clear-completed')[0].style.display = "block"
        } else {
          document.getElementsByClassName('clear-completed')[0].style.display = "none"
        }
        console.log("toggle list item",e.target.value, listInfo)
        const appendHere = document.getElementsByClassName("learn-bar")[0];
          let newTask = Web_pilot.createElement(App)
          Web_pilot.render(newTask, appendHere)
     }
    
      function DeleteTaskItem(e) {
        // on hover: delete button
        console.log("delete task: I work!")
      } 
      function StopEditing(e) {
        if (e.key == "Enter") {
            // let item = document.getElementById(`${e.target.tag}`)
            // item.classList.remove("editing")
            // let child = item.childNodes[0].childNodes[1]
            // child.innerHTML = e.target.value 
          listInfo.map((l, i) => {

            if (l.id == e.target.tag){
              
              listInfo.splice(i, 1, {id: l.id, label:e.target.value, class: (l.class).replace(" editing", "")})
            } 
          })
          console.log("stop2 listInfo", listInfo)
          const appendHere = document.getElementsByClassName("learn-bar")[0];
          let newTask = Web_pilot.createElement(App)
          Web_pilot.render(newTask, appendHere)
        }
      }
      //array of list information
      // let id = "li" + dataId.toString(10)  

    
    return ( 
        //loop through list info to make the list
        <ul className="todo-list">
        {listInfo.map((l) => {
        return(
        <li id={l.id} className={l.class} onDblClick={(e)=>{console.log(e)}} >
            <div className="view">
                <input tag={l.id} type="checkbox" className="toggle" onChange={(e) => {ToggleTaskItem(e)}} />
                <label value={l.label} tag={l.id} onDblClick={(e) => {EditTaskItem(e)}}> {l.label} </label>
                <button onClick={(e) => {DeleteTaskItem(e)}} className="destroy"></button>
            </div>
            <input tag={l.id} onKeyDown={(e) => {StopEditing(e)}} className="edit" value={l.label}></input>
        </li>)
        
    })}
      </ul>      
    )
}