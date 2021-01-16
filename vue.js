



const data = {
    name:"wty",
    age:18,
    sex:1
}
let watchCallback = null

class Dep {
    constructor() {
        this.sub = []
    }
    push(cb){
        this.sub.push(cb)
    }
    publish(){
        this.sub.forEach(s => {
            s && s()
        })
    }
}
const map = new WeakMap()

const getDep = (target,key) => {
    let m = map.get(target)
    if (!m) {
        m = new Map()
        map.set(target,m)
    }
    let d = m.get(key)
    if (!d){
        d = new Dep()
        m.set(key,d)
    }
    return d
}

const proxy = new Proxy(data,{
    get(target, key, receiver) {
        const d = getDep(target,key)
        watchCallback && d.push(watchCallback)
        return Reflect.get(target,key,receiver)
    },
    set(target, key, value, receiver) {
        const d = getDep(target,key)
        Reflect.set(target,key,value,receiver)
        d.publish()
    }
})


const watchEffect = (effect) => {
    watchCallback = effect
    effect()
    watchCallback = null
}
const watch = (dep,cb) => {
    watchEffect(() => {
        cb()
    })
    dep()
}


watchEffect(() => {
    console.log(proxy.name,proxy.age,proxy.sex)
})


watch(() => proxy.age,() => {
    console.log("年龄变化了",proxy.age)
})

// proxy.name = "渣渣辉"





