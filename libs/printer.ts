/**
 * 打印设备相关
 */
import { ipcMain, BrowserWindow,dialog } from 'electron'
import { join } from 'path'
import systemlog from './log.js'
export  default{
    printPage(pdata:any){
                    // 创建一个新的隐藏窗口，用于打印
                    let printWindow = new BrowserWindow({
                                            show: false, 
                                            width: 200, 
                                            height: 200, 
                                            frame: false,
                                            webPreferences: {
                                                nodeIntegration: true,
                                                contextIsolation: false
                                            }
                                        })

                     // 指定窗口加载的页面
                    printWindow.loadFile("./src/renderer/print.html");

                    // 导航完成时触发，即选项卡的旋转器将停止旋转，并指派onload事件后。
                    printWindow.webContents.on('did-finish-load', () => {
                    
                            let dvame=pdata.printer;//打印机名称
                            let printWidth=parseInt(pdata.printWidth)*1000;//打印小票宽度
                            let data=pdata.data;//打印数据
                            let printSucc=false;
                            
                            //传递数据
                            printWindow.webContents.send("updateData", data );

                            setTimeout(()=>{
                                        // 进行打印
                                        //--margins 自动以边距  --deviceName 打印机名称  
                                        // --silent静默打印 --landscape 是否横向 --copies 打印份数
                                        try{
                                                printWindow.webContents.print({
                                                    silent: true,
                                                    deviceName: dvame,
                                                    pageSize:{width:printWidth,height:210000},
                                                    printBackground: false,
                                                    landscape: false,
                                                    margins: {
                                                        marginType:'custom',
                                                        top : 0,
                                                        bottom : 0,
                                                        left :0 ,
                                                        right : 0
                                                    },
                                                    copies:1
                                                },(success, failureReason) => {
                                                            if(success){
                                                                printSucc=true;
                                                                printWindow.destroy();
                                                            }
                                                });

                                        }catch(e){
                                                systemlog.error(e);
                                        }finally{
                                            
                                            setTimeout(()=>{
                                                    if(!printSucc){
                                                            //console.log("Error to print"+Date.now());
                                                            systemlog.error("Print Error ");
                                                            dialog.showMessageBox({'message':'打印失败!请检查打印机设置','type':'info'});
                                                    }
                                            },1000);
                                            
                                        }
                                        
                            },200);
                    
                    })

                    return true;
    }
}