const { ipcRenderer } = require('electron');
// 改变窗口大小
function onResize(width,height){
  try{
    ipcRenderer.send('resize-window',{
      width,
      height
    });
  }catch(e){
    console.error(e.message);
  }

}
// 使窗口居中
function onCenter(){
  try{
    ipcRenderer.send('center-window');
  }catch(e){
    console.log(e.message)
  }
}
window.addEventListener('DOMContentLoaded',() => {
    const indexMin = document.getElementsByClassName('index-min')[0];
    const indexMax = document.getElementsByClassName('index-max')[0];
    const indexClose = document.getElementsByClassName('index-close')[0];
    const titleBar = document.getElementsByClassName('title-bar')[0];
    let isDown = false;  // 鼠标状态
    let baseX = 0,baseY = 0; //监听坐标
    titleBar.addEventListener('mousedown',function(e){
        isDown = true 
        baseX = e.x
        baseY = e.y
      })
    titleBar.addEventListener('mouseup',function(){
        isDown = false
    })
    titleBar.addEventListener('mousemove',function(e){
        if(! isDown) return;
        const x = e.screenX - baseX
        const y = e.screenY - baseY
        ipcRenderer.send('move-application',{
        posX:x,
        posY:y
        })
    })
    indexMin.addEventListener('click', () => {
        // 发送最小化命令到主进程
        ipcRenderer.send('minimize-window');
      });
   
    let maximize = false;
    let previousAppWidth = null;
    let previousAppHeight = null;
    indexMax.addEventListener('click', (event) => {
        // 发送最大化/恢复命令到主进程
        ipcRenderer.send('maximize-window');
        if(maximize){
          document.body.style.setProperty('--appWidth',previousAppWidth);
          document.body.style.setProperty('--appHeight',previousAppHeight);
        }else{
          previousAppWidth = document.body.style.getPropertyValue('--appWidth');
          previousAppHeight = document.body.style.getPropertyValue('--appHeight');
          document.body.style.setProperty('--appWidth','100vw');
          document.body.style.setProperty('--appHeight','100vh');
        }
        maximize = !maximize;
    });

    indexClose.addEventListener('click', () => {
    // 发送关闭窗口命令到主进程
        ipcRenderer.send('close-window');
    });
})
// 监听主进程事件
ipcRenderer.on('message-to-renderer',(event,message) => {
})
// 改变css app宽高变量
ipcRenderer.on('resize-renderer',(event,size) => {
  document.body.style.setProperty('--appWidth','100%');
  // document.body.style.setProperty('--appHeight','auto');
  // document.body.style.setProperty('--appWidth',size.width + 'px');
  document.body.style.setProperty('--appHeight',size.height + 'px');
})
ipcRenderer.on('writer-file-success',(event,msg) => {
  console.log(msg)
})
