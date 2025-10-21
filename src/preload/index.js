/**
 * Preload 层暴露的 API
 */
import { contextBridge,ipcRenderer  } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'


// 自定义API
const api = {
  contextBridge,
  ipcRenderer,
  exitApp: () => ipcRenderer.invoke("exit-app"), //退出程序
  preventQuit: (bool) => ipcRenderer.invoke("prevent-quit",bool), //阻止或允许退出程序
  minimize:()=> ipcRenderer.invoke("minimize"), //最小化
  loginfo:(log)=> ipcRenderer.invoke("loginfo",log), //日志记录 {level:'info',msg:string}
  readFile: (filePath) => ipcRenderer.invoke("readFile", filePath), //读取文件
  writeFile: (filePath,content) => ipcRenderer.invoke("writeFile", filePath,content), //写入文件
  appendFile: (filePath,content) => ipcRenderer.invoke("appendFile", filePath,content), //写入文件
  downloadFile: (url,saveName,folder) => ipcRenderer.invoke("downloadFile", url,saveName,folder), //下载资源并保存文件
  mkdir: (dirname) => ipcRenderer.invoke("mkdir", dirname), //创建目录
  deldir: (dirname) => ipcRenderer.invoke("deldir", dirname), //创建目录
  
  openUserDir:()=>ipcRenderer.invoke("openUserDir"), //打开文件夹
  getDevice:()=>ipcRenderer.invoke("getDevice"), //获取mac、硬盘等信息
  mainFullscreen: () => ipcRenderer.invoke("mainWin-fullscreen"), //主窗口全屏
  getMainWinSize: () => ipcRenderer.invoke("getMainWinSize"),//获取客户屏幕尺寸
  getClientWinSize: () => ipcRenderer.invoke("getClientWinSize"),//获取客户屏幕尺寸
  

  //网络
  pingServer:(serviceUrl)=>ipcRenderer.invoke("pingServer",serviceUrl),//网络ping
  getNetworkType:()=>ipcRenderer.invoke("getNetworkType"),//获取所有网络连接接口

  //打印机
  getPrinterList:()=>ipcRenderer.invoke("getPrinterList"),//获取所有打印机

  //打印通知
  doPrintJob:()=>ipcRenderer.invoke("doPrintJob"),//通知打印
  
  //数据库
  existDb:(dbname) => ipcRenderer.invoke("existDb",dbname), //判断数据库dbname(例：item.db)是否存在
  
  //item.db
  queryItemDb: (sql) => ipcRenderer.invoke("queryItemDb",sql), //创建数据库/读取数据表 {"sql": string}
  insertItemDb: (param) => ipcRenderer.invoke("insertItemDb",param),//插入数据 {table: string; data: { [key: string]: any };}
  updateItemDb: (param) => ipcRenderer.invoke("updateItemDb",param),//更新数据 updateParam {table: string;data: { [key: string]: any };condition: string;}
  deleteItemDb: (param) => ipcRenderer.invoke("deleteItemDb",param),//删除数据 deleteParam {table: string;condition: string;}
  closeItemDb: () => ipcRenderer.invoke("closeItemDb"),//关闭数据库
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('electronAPI', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.electronAPI = api
}