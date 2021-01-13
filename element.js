let rootInstance = null; // 初始化为空

/**
 * 渲染函数
 * @param element 组件节点
 * @param container 容器
 */
function render(element,container){
    const prevInstance = rootInstance;// 每次运行render 将当前实例赋值其他变量
    // 将容器 当前页面实例与这次调用的新节点传过去
    // 创建完成 重新赋值主节点
    rootInstance= reconcile(container,rootInstance,element);
}


/**
 * 协调创建或复用
 * @param container 容器
 * @param rootInstance 当前实例
 * @param element 渲染的描述节点
 */
function reconcile(container,rootInstance,element){
    // 首次渲染为空
    if (rootInstance == null){
        const newInstance = createInstance(element)
        container.appendChild(newInstance.dom)
        return newInstance
    }
    // 元素删除了
    if (element == null){
        container.removeChild(rootInstance.dom)
        return null
    }
    // 节点复用
    if (rootInstance.element.type === element.type) {
        // 节点一致
        // 属性替换
        // 检测子元素
        // 赋值新的element节点描述 返回
        updateDomProperties(container,rootInstance.element.props,element.props)
        rootInstance.childrenInstance = reconcileChildren(rootInstance,element)
        rootInstance.element = element
        return rootInstance
    } else {
        // 创建新的实例替换之前的
        const newInstance = createInstance(element)
        container.replaceChild(newInstance.dom,rootInstance.dom)
        return newInstance
    }
}

/**
 * 检查复用子元素
 * @param instance 实例
 * @param element 描述对象
 */
function reconcileChildren(instance,element){
    const container = instance.dom; // 需要检查改变的节点
    const childrenInstance = instance.childrenInstance; // 检测的子节点
    const nextChildElements = element.props.children || [] // 检测的新子节点描述
    const nextChildInstances = [];// 复用 检查完成后的心子节点实例对象数组

    // 只按顺序检测
    const count = Math.min(childrenInstance.length,nextChildElements.length)
    // 按个监测
    for (let i = 0;i < count; i++){
        const childInstance = childrenInstance[i]
        const childElement = nextChildElements[i]
        // 每个子元素递归检查复用。。服用失败 重新创建实例
        nextChildElements.push(reconcile(childInstance.dom,childInstance,childElement))
    }
    return nextChildInstances.filter(ins => ins != null) // 删除时会返回空
}



/**
 * 创建root实例
 * @param element 描述节点
 * @return {element,dom,instance}
 */
function createInstance(element){
    const {type,props} = element;
    // 普通元素与文本
    const dom = type === "TEXT ELEMENT" ? document.createTextNode("") : document.createElement(type)
    // 添加元素 属性 事件 等
    updateDomProperties(dom,[],props)

    // dom完成
    // 处理子元素 将子元素创建添加至父元素上
    const childElements = props.children || []
    // 递归创建子元素实例
    const childrenInstance = childElements.map(child => createInstance(child))
    // 获取子元素的真实dom元素
    const childrenDomArr = childrenInstance.map(childInstance => childInstance.dom)
    // 将真实dom添加进父级元素容器
    childrenDomArr.forEach(childDom => dom.appendChild(childDom))
    return {
        dom,
        element,
        childrenInstance
    }
}

/**
 * 将元素的属性 事件 等替换
 * @param container
 * @param preProps
 * @param nextProps
 */
function updateDomProperties(container,preProps,nextProps){
    console.log(container,preProps,nextProps)
    // 删除操作
    Object.keys(preProps).filter(prop => prop.startsWith("on")).forEach(event => {
        const eventType = event.toLowerCase().substr(2) // onClick => click
        container.removeEventListener(eventType,preProps[event]) // {onClick:() => void}...
    })
    Object.keys(preProps).filter(prop => !prop.startsWith("on") && prop !== "children").forEach(key => {
        container[key] = null
    })

    // -------------------------------------------------------

    // 处理添加事件
    Object.keys(nextProps).filter(prop => prop.startsWith("on")).forEach(event => {
        const eventType = event.toLowerCase().substr(2) // onClick => click
        container.addEventListener(eventType,nextProps[event]) // {onClick:() => void}...
    })
    // 处理元素属性（除了children与on开头的事件）
    Object.keys(nextProps).filter(prop => !prop.startsWith("on") && prop !== "children").forEach(key => {
        container[key] = nextProps[key] // {value:"xxx"}
    })
}




/**
 * 创建元素描述对象
 * @param type 类型
 * @param config 属性配置
 * @param args 子元素
 * @return {{type, props: *}}
 */
function createElement(type,config,...args){
    const props = Object.assign({},config)
    const hasChildren = args.length > 0
    const newChildren = hasChildren ? [].concat(...args)  : []
    // 检查是否存在文本元素
    props.children = newChildren.filter(child => child != null && child !== false).map(child => {
        return child instanceof Object ? child : createTextElement(child) // child type = string || number ...
    })
    return {type,props}
}

/**
 * 创建文本节点描述
 * @param value 值
 * @return {{type, props: *}}
 */
function createTextElement(value){
    return createElement("TEXT ELEMENT",{nodeValue:value})
}



