import {Web_pilot} from "../web_pilot/web_pilot.jsx"
import {CreateInput} from "./createInput.jsx"

  /** @jsx Web_pilot.createElement */
function App(){

    return(

        <CreateInput/>
    )
}

export default App;

let appendHere = document.getElementsByClassName("header")[0];
const showItem = Web_pilot.createElement(App);
Web_pilot.render(showItem, appendHere);