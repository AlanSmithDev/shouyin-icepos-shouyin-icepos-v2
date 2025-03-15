/**
 * 硬件设备相关
 */
const diskinfo = require('diskinfo');
const interfaces = require('os');
const netType=["WLAN","Wi-Fi","以太网","本地连接","无线网络连接","ETHERNET","LAN"];

export  default{

    //获取mac地址
    getMac(){
        let infos=interfaces.networkInterfaces();
        let mac="";
        for(let i in infos){
            let macTypes=infos[i];
            let find=false;
            if(netType.indexOf(i.toUpperCase())==-1){
                continue;
            }
            for(let k in macTypes){
                if(macTypes[k].mac!=""&&macTypes[k].address!=""){
                    mac=macTypes[k].mac;
                    find=true;
                    break;
                }
            }
            if(find){
                break;
            }
        }
        return mac;
    },
    //获取网卡或无线网卡的信息，返回数组
    getNetorkDevice(){
            let infos=interfaces.networkInterfaces();
            let nets={};
            for(let i in infos){
                let net=infos[i];

                if(netType.indexOf(i.toUpperCase())==-1){
                    continue;
                }
                   
                let name=String(i);
                nets[name]=net;
            }
            
            return nets;
    },
    //获取硬盘id
    getHdd(){
        try {
           return interfaces.type()+interfaces.arch();//Electron无法获取磁盘名称
        } catch (error) {
            console.error('Error getting hard disk serial number:', error);
            return null;
        }
    },
    //获取分区
    getDrivers(){
        let drivers=new Array();
        diskinfo.getDrives(function(err, aDrives) {
                let driver={"volume":'',"Drive":'',"blocks":'',"used":'',"available":'',"capacity":'',"mounted":''};
                for (var i = 0; i < aDrives.length; i++) {
                        driver.volume =aDrives[i].volume;
                        driver.Drive =aDrives[i].filesystem;
                        driver.blocks =aDrives[i].blocks;
                        driver.used =aDrives[i].used;
                        driver.available =aDrives[i].available;
                        driver.capacity =aDrives[i].capacity;
                        driver.mounted =aDrives[i].mounted;
                }
                drivers.push(driver);   
        });
        return drivers;
    },
    //获取CPU
    getCpu(){
        return interfaces.cpus();
    },
    //获取电脑名称
    getComputerName(){
        return interfaces.hostname();
    },
    //操作系统
    /**
     * 'darwin'：表示 macOS
        'win32'：表示 Windows
        'linux'：表示 Linux
     */
    getOs(){
        return interfaces.platform();
    },
    //系统版本号
    getOsVersion(){
        return interfaces.release();
    },
}