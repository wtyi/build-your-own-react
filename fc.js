
// 函数组件
function App(){
    const h =createElement
    const [name,setName] = useState("渣渣辉")
    const [tit,setTie] = useState("更改")
    return h("div",{id:"func-component"},h(TEXT_ELEMENT,{nodeValue:name}),h("button",{onclick:() =>{
        setName("更改尼玛啊");
        setTie("cao")
        }},h(TEXT_ELEMENT,{nodeValue: tit})))
}


function CreateTestFuncElement(){
    return {
        type:App,
        props:{}
    }
}
