const TEXT_ELEMENT = "TEXT_ELEMENT"
/**
 * 创建element对象函数
 * @param type 元素类型
 * @param props 属性
 * @param children 子对象
 */
const createElement = (type,props,...children) => {
    return {
        type,
        props:{
            ...props,
            children:children.map(child => typeof child === "object" ? child : createTextElement(child))
        }
    }
}

/**
 * 创建值节点元素
 * @param value
 * @return {{type, props: (*&{children: (*|{type, props})[]})}}
 */
const createTextElement = (value) => {
    return createElement(TEXT_ELEMENT,{nodeValue: value})
}




// 创建测试
const CreateTestElement = (title = "增加") => {
    const h = createElement
    return h("div",{id:"container"},
        h("div",{class:"input"},h("input",{value:"123",onClick:(e) => {console.log(e)}})),
        h("button",{},h(TEXT_ELEMENT,{nodeValue:title}))
    )
}
