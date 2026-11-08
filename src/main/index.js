/**
 * 主进程
 */
import { app, shell, BrowserWindow, ipcMain,Menu, Tray,screen,net,dialog,globalShortcut} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const path = require('path')

// 引入程序主要逻辑处理类
import MainThread from '../../libs/main.js'

const initWidth = 800
const initHeight = 600

let mainWidth=0
let mainHeight=0
let clientWidth=0
let clientHeight=0


let tray = null //系统托盘图标
let clientWindow = null //客户屏幕窗口
let mainWindow=null     //主窗口
let canQuit = true;//是否允许Alt+F4关闭程序，由当前页面控制

//创建主窗口
function createWindow() {

    const isWindows = process.platform === 'win32';
    mainWindow = new BrowserWindow({
      width: initWidth,
      height: initHeight,
      show: false,
      autoHideMenuBar: true,
      frame:false,
      icon:icon,
      transparent:true,
      
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        webSecurity: false // 前端跨域 false运行跨域
      }
    })

    mainWindow.setResizable(false);
    mainWindow.setMovable(false);

    mainWindow.on('ready-to-show', () => {
      mainWindow.show()
    })

    //透明窗口不聚焦时出现白色标题栏处理
    mainWindow.on('blur', () => {
      if (isWindows) {
          mainWindow.setBackgroundColor('#00000000');
      }
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

}

//创建客户屏幕窗口
function createDoubleWindow() {

    const displays = screen.getAllDisplays()
    const externalDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0
    })
    const {width,height}=externalDisplay.bounds;
    if (externalDisplay) {

      clientWindow = new BrowserWindow({
        show: false,
        autoHideMenuBar: true,
        frame:false,
        icon:icon,
        x: externalDisplay.bounds.x,
        y: externalDisplay.bounds.y,
        width:width,
        height:height,
        fullscreen:true,
        
        webPreferences: {
          preload: join(__dirname, '../preload/index.js'),
          sandbox: false,
          webSecurity: false // 前端跨域 false运行跨域
        }
      })

      clientWidth=width;
      clientHeight=height;
      clientWindow.setResizable(false);
      clientWindow.setMovable(false);
      
      clientWindow.on('ready-to-show', () => {
        clientWindow.show()
      })

      clientWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
      })

      const url =process.env['ELECTRON_RENDERER_URL'] || ''
      const hashRoute ='/client'
      clientWindow.loadURL(`${url}#${hashRoute}`)

    }
}

//全局错误处理
process.on('uncaughtException', function (error) {    // Handle the error
    dialog.showMessageBox(mainWindow,{message :"Fatal Error　系统错误: "+error});
});

//注册快捷键
function registerShortCut(){

    //globalShortcut.register('CommandOrControl+F4', () => {
   //     console.log('Ctrl+F4 is pressed - prevented');
      // 这里不执行任何操作，或者你可以添加其他逻辑来处理这个事件，但通常我们只是阻止默认行为。
    //});

    // 在应用程序没有键盘焦点时，监听键盘事件（注册快捷键）
    // const ret = globalShortcut.register('CommandOrControl+X', () => {
    //   console.log('CommandOrControl+X is pressed')
    // })
}

//注册快捷键
registerShortCut();

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  //ipcMain.on('ping', () => console.log('pong'))

  //主屏幕
  createWindow()

  //窗口变化
  mainWindow.on('resize', () => {
      const {width, height } = mainWindow.getBounds();
      mainWidth=width;
      mainHeight=height;
      console.log(`Main window resized: ${width}x${height}`);
  });

  //Alt+F4拦截快捷关闭窗口指令
  mainWindow.on('close', e => {
        if(!canQuit){
            mainWindow.webContents.send("altf4",{"command":"altF4"});
            e.preventDefault()//阻止关闭
        }
  })

  //键盘KeyDown +keyUp 事件
  // mainWindow.webContents.on('before-input-event', (event, input) => {
  //   // Enable application menu keyboard shortcuts when Ctrl/Cmd are down.
  //   console.log(input.type+" "+input.key );
  // })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  //设置系统托盘图标
  let trayIcon = "";

  if (process.env.NODE_ENV == 'development') {
    trayIcon = path.join(__dirname, '../../resources/favicon.ico');
  } else {
    trayIcon = path.join(path.dirname(app.getPath('exe')), 'resources/favicon.ico');
    // trayIcon = path.join(path.dirname(app.getPath('exe')), 'why_logo.ico');
  }

  tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    { label: '退出程序', click: () => { app.quit(); } }
  ])
  tray.setToolTip('ICEPOS收银系统')
  tray.setContextMenu(contextMenu)
  tray.on("click", () => {   // 点击托盘图标显示窗口
    mainWindow.restore();
  });
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**渲染进程和主程序交互 异步交互，渲染层需要使用async + await 配合获取结果*/
ipcMain.handle("loginfo", async (event,message) => {
    return MainThread.logInfo(message);
});

ipcMain.handle("fileExist", async (event,filePath) => {
      let bool=MainThread.fileExist(filePath);
      return bool;
});

ipcMain.handle("readFile", async (event,filePath) => {
      let content=MainThread.readFile(filePath);
      return content;
});

ipcMain.handle("writeFile", async (event,filePath,content) => {
      return MainThread.writeFile(filePath,content);
});

ipcMain.handle("appendFile", async (event,filePath,content) => {
      return MainThread.appendFile(filePath,content);
});

ipcMain.handle("downloadFile", async (event,url,saveName,folder) => {
      return MainThread.downloadFile(url,saveName,folder);
});


ipcMain.handle("mkdir", async (event,dirname) => {
      return MainThread.mkdir(dirname);
});

ipcMain.handle("deldir", async (event,dirname) => {
      return MainThread.deldir(dirname);
});

//网络
ipcMain.handle("pingServer", async (event,serviceUrl) => {
    try{
          const   request = net.request(serviceUrl);
                  request.on('response', (response) => {
                        mainWindow.webContents.send("pingResult",
                            {'statusCode':response.statusCode}
                        );
                  })
                  request.on('error', (error) => {
                        mainWindow.webContents.send("pingResult",
                            {'statusCode':404}
                        );
                      console.log("request fail:"+error);
                  })
                  request.end();
    }catch(error){
                  console.log("netwotk fail:"+error);
    }

});

ipcMain.handle("getNetworkType", async (event) => {
    return MainThread.getNetworkTypes();
});

//打印机
ipcMain.handle('getPrinterList', async (event) => {
    let list=null;
    //主线程异步获取打印机列表
    try{
       list= await mainWindow.webContents.getPrintersAsync();
       if(!list||list==null||list.length<=0){
          MainThread.logInfo( {"msg":'读取打印机失败！Win + R->services.msc，-> Print Spooler->启动 / start。',"level":'info'}  );
          return false;
       }
    }catch(e){
          MainThread.logInfo( {"msg":"Read Printer Error"+String(e),"level":'info'}  );
    }
    
    return list;
});

//数据库查询
ipcMain.handle("existDb", async (event,queryParam) => {
      return MainThread.existDb(queryParam);
});

//itemdb----------------------------------------------------
ipcMain.handle("queryItemDb",async  (event,queryParam) => {
      return MainThread.queryItemDb(queryParam);
});

ipcMain.handle("insertItemDb",async  (event,queryParam) => {
      return MainThread.insertItemDb(queryParam);
});

ipcMain.handle("updateItemDb",async  (event,queryParam) => {
      return MainThread.updateItemDb(queryParam);
});

ipcMain.handle("deleteItemDb",async  (event,queryParam) => {
      return MainThread.deleteItemDb(queryParam);
});

ipcMain.handle("closeItemDb",async  () => {
      return MainThread.closeItemDb();
});

//itemdb END------------------------------------------------

//与preload.js 中的 exitApp 对应
//webContents.send直接返回给vue页面的on方法
//窗口变化的侦听和处理方法
ipcMain.handle("create-dbscreen",async () => {
    // 双屏模式
    if (MainThread.getConfigs().isDoubleScreen) {
        createDoubleWindow();
    }
});

//主界面Main等页面通知不可以Ctrl+F4关闭程序
ipcMain.handle("prevent-quit",async (event,can) => {
    canQuit = can;
});

//页面通知主进程退出程序
ipcMain.handle("exit-app",async () => {
  app.exit();
});

//获取硬件信息
ipcMain.handle("openUserDir",async () => {
      let msg="";
      try{
        msg=MainThread.openUserPath();
        if(msg!=""){
            console.log("打开文件夹错误"+msg);
        }
        return msg;
      }catch(err){
        console.log("打开文件夹错误"+err);
      }
});


//获取硬件信息
ipcMain.handle("getDevice",async () => {
    return MainThread.getDevice();
});

//窗口最小化
ipcMain.handle("minimize",async () => {
  BrowserWindow.getFocusedWindow().minimize()
});
//主窗口全屏
ipcMain.handle("mainWin-fullscreen",async () => {
  mainWindow.setBackgroundColor('rgba(255, 255, 255, 1)')
  mainWindow.setFullScreen(true);
});

//返回主窗口宽高
ipcMain.handle("getMainWinSize",async () => {
  mainWindow.webContents.send("getMainWinSize",{width:mainWidth,height:mainHeight});
});

//返回客户窗口宽高
ipcMain.handle("getClientWinSize",async () => {
  clientWindow.webContents.send("getWinSize",{width:clientWidth,height:clientHeight});
});

//主窗口页面通知  Electron.ipcRenderer.send 发送的通知
ipcMain.on("openDoubleScreen", (e,g) => {
    //打开客显屏幕窗口
    try{
      if(clientWindow==null){
          createDoubleWindow();
          //clientWindow.webContents.send("client screen opened"+g.From);
      }
    }catch(error){
          console.log("open client Screen fail",error);

    }
}).on("doPrintJob", (e,data) => {
  //打印小票
  try{
      let res=MainThread.printJob(data);
      if(!res){
        //在底层libs的printer.ts中有提示失败
        //dialog.showMessageBox({'message':'打印失败','type':'info'});
        return  false;
      }
  }catch(e){
        console.log(e);
        return  false;
  }
  return true;
});