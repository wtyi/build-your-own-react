// 模板示例
const TemplateElement = {
    type:"div",
    props:{
        children:[
            {
                type:"input",
                props:{
                    value:"",
                    placeholder:"请输入内容",
                    onChange:(e) => {
                        console.log("input :",e.target.value)
                    }
                }
            },{
                type:"span",
                props:{
                    children:[
                        {
                            type:"TEXT ELEMENT",
                            props:{
                                nodeValue:"我是文本"
                            }
                        }
                    ]
                }
            }
        ]
    }
}


const nextTemplateElement =  {
    type:"div",
    props:{
        children:[
            {
                type:"input",
                props:{
                    value:"wangbadan",
                    placeholder:"哈哈哈哈",
                    onChange:(e) => {
                        console.log("input :",e.target.value)
                    }
                }
            },{
                type:"span",
                props:{
                    children:[
                        {
                            type:"TEXT ELEMENT",
                            props:{
                                nodeValue:"这里是王八蛋"
                            }
                        }
                    ]
                }
            }
        ]
    }
}
