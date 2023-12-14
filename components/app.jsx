import {CreateInput} from "./createInput.jsx"
import {Web_pilot} from "../web_pilot/web_pilot.jsx"

/** @jsx Web_pilot.createElement */
function App(){

    return(

        <CreateInput/>
    )
}



let appendHere = document.getElementsByClassName("header")[0];
const showItem = Web_pilot.createElement(App);
Web_pilot.render(showItem, appendHere);

export default App;