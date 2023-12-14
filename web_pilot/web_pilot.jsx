function createElement(type, props, ...children) {
  let element = {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      ),
    },
  }
  console.log("Element Created:", element)
    return element
  }

  
  function createTextElement(text) {
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text,
        children: [],
      },
    }
  }


  
  function createDom(fiber) {
    const dom =
      fiber.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type)
  
    updateDom(dom, {}, fiber.props)
  
    return dom
  }
  
  const isEvent = key => key.startsWith("on")
  const isProperty = key =>
    key !== "children" && !isEvent(key)
  const isNew = (prev, next) => key =>
    prev[key] !== next[key]
  const isGone = (prev, next) => key => !(key in next)
  function updateDom(dom, prevProps, nextProps) {
    //Remove old or changed event listeners
    Object.keys(prevProps)
      .filter(isEvent)
      .filter(
        key =>
          !(key in nextProps) ||
          isNew(prevProps, nextProps)(key)
      )
      .forEach(name => {
        const eventType = name
          .toLowerCase()
          .substring(2)
        dom.removeEventListener(
          eventType,
          prevProps[name]
        )
      })
  
    // Remove old properties
    Object.keys(prevProps)
      .filter(isProperty)
      .filter(isGone(prevProps, nextProps))
      .forEach(name => {
        dom[name] = ""
      })
  
    // Set new or changed properties
    Object.keys(nextProps)
      .filter(isProperty)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        dom[name] = nextProps[name]
      })
  
    // Add event listeners
    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        const eventType = name
          .toLowerCase()
          .substring(2)
        dom.addEventListener(
          eventType,
          nextProps[name]
        )
      })
  }
  
  function commitRoot() {
    pendingEffects.forEach(it => it()) // call pending effects after render
    deletions.forEach(commitWork)
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
  }
  
  function commitWork(fiber) {
    if (!fiber) {
      return
    }
  
    let domParentFiber = fiber.parent
    while (!domParentFiber.dom) {
      domParentFiber = domParentFiber.parent
    }
    const domParent = domParentFiber.dom
  
    if (
      fiber.effectTag === "PLACEMENT" &&
      fiber.dom != null
    ) {
      domParent.appendChild(fiber.dom)
    } else if (
      fiber.effectTag === "UPDATE" &&
      fiber.dom != null
    ) {
      updateDom(
        fiber.dom,
        fiber.alternate.props,
        fiber.props
      )
    } else if (fiber.effectTag === "DELETION") {
      commitDeletion(fiber, domParent)
    }
  
    commitWork(fiber.child)
    commitWork(fiber.sibling)
  }
  
  function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
      domParent.removeChild(fiber.dom)
    } else {
      commitDeletion(fiber.child, domParent)
    }
  }
  
  function render(element, container) {
    wipRoot = {
      dom: container,
      props: {
        children: [element],
      },
      alternate: currentRoot,
    }
    deletions = []
    nextUnitOfWork = wipRoot
  }
  
  let nextUnitOfWork = null
  let currentRoot = null
  let wipRoot = null
  let deletions = null
  
  function workLoop(deadline) {
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitOfWork(
        nextUnitOfWork
      )
      shouldYield = deadline.timeRemaining() < 1
    }
  
    if (!nextUnitOfWork && wipRoot) {
      commitRoot()
    }
  
    requestIdleCallback(workLoop)
  }
  
  requestIdleCallback(workLoop)
  
  function performUnitOfWork(fiber) {
    const isFunctionComponent =
      fiber.type instanceof Function
    if (isFunctionComponent) {
      updateFunctionComponent(fiber)
      // Object .keys(wipFiber._hooks)
      //               .filter(hookIndex => wipFiber._hooks[hookIndex].tag === "EFFECT")
      //               .forEach(hookIndex => {
      //                   const oldHook =
      //                       wipFiber.alternate &&
      //                       wipFiber.alternate._hooks &&
      //                       wipFiber.alternate._hooks[hookIndex]

      //                   const hook = wipFiber._hooks[hookIndex]
      //                   const depsChanged = (prev, next) => (_, index) => prev[index] !== next[index];
      //                   if (hook.deps.length === 0 && !oldHook
      //                       || oldHook && (oldHook.deps.length !== hook.deps.length
      //                           || oldHook && hook.deps.filter(depsChanged(oldHook.deps, hook.deps)).length !== 0)) {
      //                       pendingEffects.push(hook.fn)
      //                   }
      //               })
      
    } else {
      updateHostComponent(fiber)
    }
    //?? child
    if (fiber.child) {
      return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
        //?? sibling
      if (nextFiber.sibling) {
        return nextFiber.sibling
      }
      //?? parent
      nextFiber = nextFiber.parent
    }
  }
  
  let wipFiber = null
  let hookIndex = null
  
  function updateFunctionComponent(fiber) {
    wipFiber = fiber
    hookIndex = 0
    wipFiber.hooks = []
    const children = [fiber.type(fiber.props)]
    reconcileChildren(fiber, children)
  }
  
  function useState(initial) {
    const oldHook =
      wipFiber.alternate &&
      wipFiber.alternate.hooks &&
      wipFiber.alternate.hooks[hookIndex]
    const hook = {
      state: oldHook ? oldHook.state : initial,
      queue: [],
    }
  
    const actions = oldHook ? oldHook.queue : []
    actions.forEach(action => {
      hook.state = action(hook.state)
    })
  
    const setState = action => {
      hook.queue.push(action)
      wipRoot = {
        dom: currentRoot.dom,
        props: currentRoot.props,
        alternate: currentRoot,
      }
      nextUnitOfWork = wipRoot
      deletions = []
    }
  
    wipFiber.hooks.push(hook)
    hookIndex++
    return [hook.state, setState]
  }
  
 


function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}

function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  while (
    index < elements.length ||
    oldFiber != null
  ) {
    const element = elements[index]
    let newFiber = null

    const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}

export const Web_pilot = {
  createElement,
  render,
  useState,
  useEffect,
}



//======> Start of function exercises <=======

//const container = document.getElementById("root")

/** @jsx Web_pilot.createElement */
/*function Counter() {
  const [state, setState] = Web_pilot.useStatstate(1)
  return (
    <h1 onClick={() => setState(c => c + 1)}>
      Count: {state}
     </h1>
  )
}
const element = Web_pilot.createElement(Counter)
//const container = document.getElementById("root")
Web_pilot.render(element, container)*/



/** @jsx Web_pilot.createElement */
/*function Img() {
const [img, setImg] = Web_pilot.useState("")
return(
    // <h1 onClick={() => setImg(s => s+srce)}>
    //   Image: 
    //  </h1>
     <img src="https://64.media.tumblr.com/2d41d0da5225dd0fb7e2d23a850636fa/tumblr_o5q9dcVWue1tbx2dfo1_1280.jpg" tag="Jackie partying" onClick={() => setImg(s => s+"https://64.media.tumblr.com/2d41d0da5225dd0fb7e2d23a850636fa/tumblr_o5q9dcVWue1tbx2dfo1_1280.jpg")}>
     </img>
)
}
const portrait = Web_pilot.createElement(Img)
Web_pilot.render(portrait, container)*/



/** @jsx Web_pilot.createElement */
/*function ChooseColour() {

 let availableColors = [
    'darkslateblue', 
    'midnightblue', 
    'teal', 
    'tomato', 
    'seagreen', 
    'royalblue', 
    'saddlebrown', 
    'indigo', 
    'olivedrab', 
    'rosybrown'
  ];
  
  let [indx, setIndx] = Web_pilot.useState(0)
  
  return (
    <h1 onClick={() => setIndx(i => (i-i) + Math.floor(parseInt(Math.random() * 10), 10))}>
      Colour: {availableColors[indx]}
     </h1>

  )
}

const background = Web_pilot.createElement(ChooseColour);
Web_pilot.render(background, container)*/




///** @jsx Web_pilot.createElement */
//To read window URL:
/*myKeyValues = window.location.search
const urlParams = new URLSearchParams()
//URLSearchParams.set()
let param1 = URLSearchParams.get('name');
console.log("name:", param1)

//from: https://www.youtube.com/watch?v=RIBiQ5GNYWo
//To set URL value: 
let myURL = new URL('https://www.youtube.com');
console.log("the hostname is:", myURL.hostname)
//to change my url hostname value:
myURL.hostname =  'google.com';
//to see the entire new url:
let my newURL = myURL.href
console.log(newURL.toString());

//newURL.search = "?name=dom&age=56";
newURL.searchParams.set("name","dom");
 newURL.searchParams.set("age","72");



*/

 //===> Start of 'Make-to v0.0' that is not working <====

/** @jsx Web_pilot.createElement */
/*function NewTodo() {
const [dude, setDude] = Web_pilot.useState("")
 appendHere = document.querySelector(".todo-list");
 appendHere.addEventListener("onkeydown",(Event) => {
  if(Event.key === 'Enter'){

    setDude(()=> Event.target.value)

    return (
      <li key={dude} className data-reactid=".2.0.1">
        <div  className="view" data-reactid=".2.0.1">
        <input className="toggle" type="checkbox" data-reactid=".2.0.2" />
        <label data-reactid=".2.0.3">{dude}</label>
        </div>
      </li>
    );
  }
})
 }

  //})
// }

let appendHere = document.querySelector(".todo-list")
const showItem = Web_pilot.createElement(NewTodo)
Web_pilot.render(showItem, appendHere)*/

 //===> End of 'Make-to v0.0' that is not working <====


 //===> Start of 'Make-to v0.1' do that returns an empty input <====

   /** @jsx Web_pilot.createElement */
   
/*function typeIn(){
  const theInput = document.querySelector(".new-todo");

 function ImListening(){
  theInput.addEventListener('onkeydown', NewTodo())
 }

  window.addEventListener('onload', ImListening())
}

let theInput = document.querySelector(".new-todo");
const attachListener = Web_pilot.createElement(typeIn)
Web_pilot.render(attachListener, theInput)



/** @jsx Web_pilot.createElement */
/*  function CreateInput() {

    const NewTodo= (event) => {
  
      if (event.key === "Enter") {
  
        const appendHere = document.querySelector(".todo-list");
        let task = event.target.value
        const [state, setState] = Web_pilot.useState(task);  
  
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
  
  let appendHere = document.getElementsByClassName("header")[0];
  const showItem = Web_pilot.createElement(CreateInput);
  Web_pilot.render(showItem, appendHere);*/







/** @jsx Web_pilot.createElement */
/*function NewTodo(Event) {
  const [dude, setDude] = Web_pilot.useState("");
  const appendHere = document.querySelector(".todo-list");
  const theInput = document.querySelector(".new-todo");
  
  function NewItem() {
   
    if (Event.key === 'Enter') {
      setDude(() => Event.target.value);

     // appendHere.onKeyDown(() => handleKeyDown())
      //className="new-todo"
      //placeholder="The second input"

      const newItem = (
        <li key={dude} >
        <div className="view">
        <input type="checkbox" className="toggle"/>
        <label value={dude}></label>
        <button className="destroy"></button>
        </div>
        <input className="edit" value={dude}></input>
      </li>
      )

         Web_pilot.render(newItem, appendHere)
  }
  }

  theInput.addEventListener('onkeydown', NewItem)
  console.log("the key value is:", Event.target.value)

  return (
    <li key={dude} >
    <div className="view">
    <input type="checkbox" className="toggle"/>
    <label value={dude}></label>
    <button className="destroy"></button>
    </div>
    <input className="edit" value={dude}></input>
  </li>
   )

   //return(
// Web_pilot.createElement(NewItem)
   //)

}*/






