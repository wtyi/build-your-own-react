let nextUnitOfWork = null; // 下次即将执行任务
let wipRoot = null;
let currentRoot = null;
let deletions = [];


const wordLoop = (deadline) => {
    // console.log(deadline,deadline.timeRemaining())
    // 存在任务 且 执行时间足够
    while (nextUnitOfWork) { //  && deadline.timeRemaining() > 1
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork) // 执行任务 并把未执行的返回...
    }
    // 任务完成 并且存在主任务root 全部执行
    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }
    requestIdleCallback(wordLoop)
}


// todo 有点不理解。。。。再看看
const reconcileChildren = (wipFiber, elements) => {
    console.log(elements)
    let index = 0;
    let prevSibling = null;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child

    // 给子元素创建
    while (index < elements.length || oldFiber != null) {
        const element = elements[index]
        // create fiber
        let newFiber = null;
        // oldFiber.type 默认第一个子元素
        const sameType = oldFiber && element && oldFiber.type === element.type

        if (sameType) {
            // 相同类型 更改属性
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: "UPDATE"
            }
        }

        // 新添加
        if (element && !sameType) {
            // 新节点存在且不同类型（add）
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: "PLACEMENT"
            }
        }

        // 删除了
        if (oldFiber && !sameType) {
            // 旧节点不存在且不同类型 (delete)
            oldFiber.effectTag = "DELETION"
            deletions.push(oldFiber)
        }

        if(oldFiber){
            oldFiber = oldFiber.sibling
        }


        // 第一次创建默认为直属自元素 其他为第一个元素的兄弟元素
        if (index === 0) {
            wipFiber.child = newFiber
        } else if(element){
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
        index++
    }
}


const performUnitOfWork = (fiber) => {
    console.log(fiber)

    const isFunComp =  fiber.type instanceof Function
    if (isFunComp){
        updateFuncComponent(fiber)
    }else {
        updateHostComponent(fiber)
    }



    if (fiber.child) {
        return fiber.child
    }

    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }

}

const updateHostComponent = (fiber) =>{
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }
    const elements = fiber.props.children // 子节点
    reconcileChildren(fiber, elements)

}

// 函数组件，。
const updateFuncComponent = fiber => {
    // 将本次fiber 使用添加
    wipFiber = fiber
    hookIndex = 0
    wipFiber.hooks = [];
    // type => App props => App(props)
    const children = [fiber.type(fiber.props)]
    reconcileChildren(fiber, children)
}


const commitRoot = () => {
    deletions.forEach(commitWork)


    commitWork(wipRoot.child)
    currentRoot = wipRoot // 渲染完成后保存当前fiber结构
    test = wipRoot
    wipRoot = null;
}

// 执行任务
const commitWork = (fiber) => {
    console.log("###",fiber)
    if (!fiber) return
    // 函数组件 含有真实dom的父级
    let parent = fiber.parent
    while (!parent.dom){
        parent = parent.parent
    }
    const parentDom = parent.dom;

    if (fiber.dom) {
        const tag = fiber.effectTag
        switch (tag) {
            case "PLACEMENT":
                parentDom.appendChild(fiber.dom)
                break
            case "UPDATE":
                updateDom(fiber.dom, fiber.alternate.props, fiber.props)
                break
            case "DELETION":
                parentDom.removeChild(fiber.dom)
                break
        }
    }


    commitWork(fiber.child)
    commitWork(fiber.sibling)
}


const updateDom = (dom, prevProps, nextProps) => {
    const isEvent = key => key.startsWith("on")
    const isProperty = key =>
        key !== "children" && !isEvent(key)
    const isNew = (prev, next) => key =>
        prev[key] !== next[key]
    const isGone = (prev, next) => key => !(key in next)
        // Remove old or changed event listeners
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

/**
 * 渲染函数
 * @param element
 * @param container
 */
const render = (element, container) => {
    wipRoot = {
        dom: container,
        props: {
            children: [element]
        },
        alternate: currentRoot
    }
    deletions = []
    nextUnitOfWork = wipRoot
    requestIdleCallback(wordLoop)
}
