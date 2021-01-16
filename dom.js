


const createDom = (fiber) => {
    const dom = fiber.type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(fiber.type)

    Object.keys(fiber.props).filter(prop => prop !== "children").forEach(key => {
        const isEvent = key.startsWith("on")
        const eventName = key.toLowerCase().substring(2)
        console.log(isEvent,eventName)
        isEvent ? dom.addEventListener(eventName,fiber.props[key]) :
        dom[key] = fiber.props[key]
    })
    return dom
}
