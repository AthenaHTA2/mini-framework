
function createElement(type, props, ...children) {
    return {
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
    //?? what is oldFiber
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
        //?? what about children
        oldFiber = oldFiber.sibling
      }
  
      if (index === 0) {
        wipFiber.child = newFiber
      } else if (element) {
        //?? assingnment to wipfiber
        prevSibling.sibling = newFiber
      }
  
      prevSibling = newFiber
      index++
    }
  }
  
  const Web_pilot = {
    createElement,
    render,
    useState,
  }

//Start of function exercises
  
  /** @jsx Web_pilot.createElement */
  function Counter() {
    const [state, setState] = Web_pilot.useState(1)
    return (
      <h1 onClick={() => setState(c => c + 1)}>
        Count: {state}
       </h1>
    )
  }
  const element = Web_pilot.createElement(Counter)
  const container = document.getElementById("root")
  Web_pilot.render(element, container)



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




  /** @jsx Web_pilot.createElement */
  
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

//router function from: https://www.youtube.com/watch?v=bAn5YmPmtXI
/*function Route(){
window.onload() = () => {
  entry.appendChild(
    router({
      "/": Tabs({
        "All": All,
        "Active": Active,
        "Completed": Completed
      }),
      "/secret": div(
        p(text("this is a secret page. What are you doing here?")),
        Image("https://64.media.tumblr.com/2d41d0da5225dd0fb7e2d23a850636fa/tumblr_o5q9dcVWue1tbx2dfo1_1280.jpg")
      )}
    ))
    }
  }

  const uPath = Web_pilot.createElement(Route)
  Web_pilot.render(uPath, container)*/


// End of function exercises