import { createVNode, render } from "vue";
import CustomMessage from "@/components/CustomMessage.vue";

// interface ConfigIter{
//     type?:string; // 可选参数type，用于控制提示框样式
//     title?:string; // 可选参数title，用于控制提示框标题内容
//     value?:string; // 可选参数value，用于控制提示框内容
//     duration?:string // 可选参数duration，用于指定提示框显示时间
// }

export default (config) => {
    if(!config) config = {};

    let boxNode = document.querySelector('.custom-message-box');
    if(! boxNode){
        boxNode = document.createElement('div');
        boxNode.className = 'custom-message-box';
        boxNode.style.position = 'fixed';
        boxNode.style.top = '20px';
        boxNode.style.left = '50%';
        boxNode.style.transform = 'translateX(-50%)';
        boxNode.style.transition = 'all .3s ease-in';
        // 将盒子插入页面
        document.body.appendChild(boxNode);
        // boxNode.style.pointerEvents = 'none'; // 鼠标穿透
    }
    let children = boxNode.children;
    // 创建用于挂载的标签
    let mountNode = document.createElement('div');
    mountNode.style.position = 'absolute';
    mountNode.style.top = 50 * children.length + 'px';
    mountNode.style.transform = 'translateX(-50%)';
    mountNode.style.transition = 'all .3s ease-in';
    mountNode.style.userSelect = 'none';

    // 给所有提示框动态指定top
    [...children].forEach((c,index) => {
        setTimeout(() =>{
            c.style.top = 50 * index + 'px';
        },30)
        
    })
    // 创建虚拟组件
    const vComponent = createVNode(CustomMessage,{
        // props传递一个unmount方法，用于卸载组件
        unmount(){
            render(null,mountNode);
            mountNode.remove();
        },
        ...config
    });

    // 将组件挂载到标签上
    render(vComponent,mountNode);

    // 将被挂载的标签插入到盒子中
    boxNode.appendChild(mountNode);
    
}
