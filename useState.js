let hookIndex = null
let wipFiber = null;




function useState(initial){
    // wipFiber 其实等于函数组件fiber结构的值
    const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex]

    const hook = {
        state:oldHook ? oldHook.state : initial,
        queue:[]
    }


    const actions = oldHook ? oldHook.queue : []

    actions.forEach(action => hook.state = action(hook.state))


    const setState = action => {
        // setState(2)
        if (typeof  action !== "function"){
            let val = action
            action = () => {
                return val
            }
        }
        // 添加队列中 当函数组件刷新重新执行时 会执行
        hook.queue.push(action)
        // 视图刷新
        wipRoot = {
            dom:currentRoot.dom,
            props:currentRoot.props,
            alternate:currentRoot
        }
        // 任务
        nextUnitOfWork = wipRoot
        // 需要删除的、、、、就跟初次渲染初始化一样
        deletions = []
    }

    wipFiber.hooks.push(hook)
    hookIndex ++
    return [hook.state,setState]
}
