import {Web_pilot} from "../web_pilot/web_pilot.jsx"
import { listInfo } from "./createInput"
import { increment } from "./createInput"
/** @jsx Web_pilot.createElement */
export function Footer() {
    function AllItems() {

    }
    function ActiveItems() {

    }
    function CompletedItems() {

    }
    function ClearCompletedItems() {

    }
    console.log("increment", increment)
    return (
        <footer className="footer"  style = "display: none;" >
        <span className="todo-count">
            <strong id="todo-items-count">{increment}</strong>
            {increment == 1 ? " item" : " items"} left
        </span>
        <ul className="filters">
            <li>
                <a href="#/" className="selected" onClick={() => (AllItems(e))}>All</a>
            </li>
            <li>
                <a href="#/active" onClick={() => (ActiveItems(e))}>Active</a>
            </li>
            <li>
                <a href="#/completed" onClick={() => (CompletedItems(e))}>Completed</a>
            </li>
        </ul>
        <button style = "display: none;" onClick={() => (ClearCompletedItems(e))} className="clear-completed">Clear completed</button>
    </footer>
    )
}