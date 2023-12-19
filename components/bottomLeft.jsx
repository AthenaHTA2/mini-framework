//import { Web_pilot } from "../web_pilot/web_pilot.jsx";
import {increment} from "./createInput.jsx";

/** @jsx Web_pilot.createElement */
 export function BottomLeft() {

    console.log("the increment inside BottomLeft", increment) 
    //console.log("the event inside BottomLeft", event) 

      const ShowCount = () => {

        return (
          <span class="todo-count">
          <strong>{increment}</strong>{" "}
          {increment === 1 ? " item" : " items"} left
        </span>
        )

      }
      
      let displayNum = document.querySelector(".todo-count")[0];
      const updateCount = Web_pilot.createElement(ShowCount);
      Web_pilot.render(updateCount, displayNum)

    
}
