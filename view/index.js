// 主进程
import { app, BrowserWindow,ipcMain } from 'electron';
// 创建应用窗口
const createWindow = (url='',options) => {
  const win = new BrowserWindow({
    width:options?.width,
    height:options?.height,
    title:'MChat',
    icon:'favicon.png',
    transparent:false,
    autoHideMenuBar:true,
    // resizable:false,
    frame:false,
    webPreferences:{
      nodeIntegration:true,
      enableBlinkFeatures:true,
      contextIsolation: false
    }
  })
  win.loadURL('http://localhost:5173/#' + url);
}
  app.whenReady().then(() => {
    createWindow('',{ width:400,height:300 });// app准备完毕时打开软件窗口
  });
  // 最小化窗口
  ipcMain.on('minimize-window', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.minimize();
  });
  // 最大化窗口
  ipcMain.on('maximize-window', (event) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      if (win.isMaximized()) { // 如果已经放大则复原
        win.restore();
      } else { // 如果未放大则放大
        win.maximize();
      }
    }
    // 向渲染进程通信
    event.reply('message-to-renderer', '收到你的消息了！');
  });
  // 关闭窗口
  ipcMain.on('close-window', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.close();
  });
  // 移动窗口
  ipcMain.on('move-application',(event,pos) => {
    const win = BrowserWindow.getFocusedWindow();

    if (win) win.setPosition(pos.posX,pos.posY)
  })
  // 改变窗口大小
  ipcMain.on('resize-window',(event,size) => {
    const win = BrowserWindow.getFocusedWindow();
    win.setSize(size.width,size.height);
    event.reply('resize-renderer',size);
  });
  ipcMain.on('center-window',(event) => {
    const win = BrowserWindow.getFocusedWindow();
    win.center();
  })
  // 打开设置面板
  ipcMain.on('open-option',(event) => {
    createWindow('/option/theme',{ width:940,height:640 });
  })
  // 打开用户卡片窗口
  ipcMain.on('open-user-card',(event,userId) => {
    createWindow('/userCard?userId=' + userId,{ width:460,height:680 });
  })
  // 打开群聊卡片窗口
  ipcMain.on('open-group-card',(event,groupId) => {
    createWindow('/groupCard?groupId=' + groupId,{ width:460,height:680 });
  })

  // //文件管理部分

  // import fs from 'fs';
  // import path from 'path'
  // ipcMain.on('writer-file', (event, file,name) => {
  //   // 定义要写入的文件路径
  //   const filePath = path.join('/src/assets/files', name);
  //   console.log(file)
  //   // 使用fs模块写入文件
  //   fs.writeFile(filePath, file, (err) => {
  //     if (err) {
  //       // 如果有错误，发送一个error消息到渲染器进程
  //       return event.sender.send('writer-file-error', '保存失败');
  //     }
  //     // 文件写入成功，发送一个success消息到渲染器进程
  //     event.sender.send('writer-file-success', `保存成功`);
  //   });
  // });