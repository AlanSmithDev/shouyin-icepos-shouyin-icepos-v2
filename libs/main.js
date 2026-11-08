
/**
 * MainThread 程序主要逻辑处理类    /src/main/index.js 主进程调用较多
 */
import configs from '../config/config.js'
import systemlog from './log.js'
import fileSystem from './fs.js'
import Itemdb from './itemdb.ts';
import Device from './device.ts';
import Printer from './printer.ts';
const { shell } = require('electron')

const itemdb=new Itemdb();

export default class MainThread{

    constructor() {
        this.init();
    }
    
    static init() {
        // Log application start
        console.log("MainThread initialized");
    }

    static getConfigs() {
        return configs;
    }

    //获取硬件信息
    static getDevice(){
        try{
            let mac=Device.getMac();
            let osversion=Device.getOs()+"_"+Device.getOsVersion();
            let hostname=Device.getComputerName();
            return {"mac":mac,"osversion":osversion,"hostname":hostname};
        }catch(err){
            console.log(err);
            return false;
        }
    }

    //获取硬件信息
    static getNetworkTypes(){
            return Device.getNetorkDevice();
    }

    //数据库 item.db------------------------------------------------------------
    static queryItemDb(queryParam) {
        return itemdb.sqQuery(queryParam);
    }

    static insertItemDb(queryParam) {
        return itemdb.sqInsert(queryParam);
    }

    static updateItemDb(queryParam) {
        return itemdb.sqUpdate(queryParam);
    }

    static deleteItemDb(queryParam) {
        return itemdb.sqDelete(queryParam);
    }

    static closeItemDb() {
        return itemdb.sqClose();
    }

    //数据库 END--------------------------------------------------------
    static openUserPath(){
        return  shell.openPath(fileSystem.getUserPath());
    }

    static fileExist(filePath){
        let res; 
        try{
            res=fileSystem.isFileExist(filePath);
        }catch (error) {
            console.error("Error reading file:", error);
            res=false;
        }
        return  res;
    }

    static  readFile(filePath) {
        let res;
        try{
           res= fileSystem.readFileSync(filePath);
        }catch (error) {
            console.error("Error reading file:", error);
            res = null;
        }
        return res;
    }

    static writeFile(filePath,content) {
        let res;
        try{
           res=fileSystem.writeFileSync(filePath,content);
        }catch (error) {
            console.error("Error write file:", error);
            res = null;
        }
        return res;
    }

    static appendFile(filePath,content) {
        let res;
        try{
           res=fileSystem.appendFileSync(filePath,content);
        }catch (error) {
            console.error("Error write file:", error);
            res = null;
        }
        return res;
    }

    //下载远程文件并保存到本地
    static downloadFile(url,saveName,folder) {
        let res;
        try{
           res=fileSystem.downloadFile(url,saveName,folder);
        }catch (error) {
            console.error("Error write file:", error);
            res = null;
        }
        return res;
    }

    static mkdir(dirname) {
        let res;
        try{
           res=fileSystem.mkdir(dirname);
        }catch (error) {
            console.error("Error mkdir :", error);
            res = null;
        }
        return res;
    }

    static deldir(dirname) {
        let res;
        try{
           res=fileSystem.deldir(dirname);
        }catch (error) {
            console.error("Error deldir :", error);
            res = null;
        }
        return res;
    }
    //日志
    static logInfo(log){
        if(configs.islog){
            switch(log.level){
                case 'info':
                    systemlog.info(log.msg);
                break;
                case 'warn':
                    systemlog.warn(log.msg);
                break;
                case 'error':
                    systemlog.error(log.msg);
                break;
                case 'debug':
                    systemlog.debug(log.msg);
                break;
                case 'verbose':
                    systemlog.verbose(log.msg);
                break;
                case 'silly':
                    systemlog.silly(log.msg);
                break;
            }
            
        }
    }

    static printJob(data){
        return Printer.printPage(data);
    }

}




