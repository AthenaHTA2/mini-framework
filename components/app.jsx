import {Header} from "./createInput.jsx"
import {Footer} from "./footer.jsx"
import {Web_pilot} from "../web_pilot/web_pilot.jsx"
import { List } from "./creatNewTask.jsx";

/** @jsx Web_pilot.createElement */
export function App(){

    return(
         <div>
             
		    <section className="todoapp">
			<Header/>
			<section className="main" style = "display: none;">
				<input id="toggle-all" className="toggle-all" type="checkbox"/> 
				<label for="toggle-all">Mark all as complete</label>
                <List/>
			</section>
			<Footer/>
		</section>
		<footer className="info">
			<p>Double-click to edit a todo</p>
			<p><a href="http://github.com/petehunt/">petehunt</a></p>
			<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
		</footer>
            
         </div>
       
          
    
        
    )
}



let appendHere = document.getElementsByClassName("learn-bar")[0];
const showItem = Web_pilot.createElement(App);
Web_pilot.render(showItem, appendHere);

export default App;