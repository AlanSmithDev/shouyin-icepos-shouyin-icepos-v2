/**
 * 文件读写基类
 */
const fs = require('fs');
const path = require('path')
import {app} from 'electron'
const axios = require('axios');

let sep=path.sep;
let target= path.join(app.getPath('userData'), sep); // 目标目录
export  default{

    //获取用户目录
    getUserPath(){
        return target;
    },
    //创建目录
    mkdir (dirPath) {
        try{
            fs.mkdirSync(target+dirPath, { recursive: true });
        }catch(err){
            //err.code 'EEXIST','ENOENT','EACCES', 'EPERM', 'EISDIR'
            //throw err;
            console.log("mkdir error:",err);
            return false;
        }
        return true;
    },
    //删除目录
    deldir(dirPath){
        if (!fs.existsSync(target+dirPath)){
            console.log("deldir error: Directory does not exist");
            return false;
        }

        try{
            fs.rm(target+dirPath, { recursive: true }, (err) => {
                if (err) {
                    console.log("deldir error:",err);
                    return false;
                }
            })
        }catch(err){
                console.log("deldir error:",err);
               return false;
        }

        return true;
    },
        //删除目录
    deldirSync(dirPath){
        if (!fs.existsSync(target+dirPath)){
            console.log("deldirSync error: Directory does not exist");
            return false;
        }

        try{
            fs.rmSync(target+dirPath, {force :true, recursive: true }, (err) => {
                if (err) {
                    console.log("deldirSync error:",err);
                    return false;
                }
            })
        }catch(err){
                    console.log("deldirSync error:",err);
                    return false;
        }
        
        return true;
    },
     // 读取文件的示例
     //同步判断文件是否存在
    isFileExist(filePath){
        if (!fs.existsSync(target+filePath)){
            return false;
        }
        return true;
    },
     //同步读取文件
    readFile (filePath) {
        return new Promise( (resolve,reject) => {
            fs.readFile(target+filePath, 'utf8', (err, data) => {
            if (err) reject(err);
                resolve( data);
            });
        })
    },
    //同步读取文件
    readFileSync (filePath) {
        if (!fs.existsSync(target+filePath)){
            return false;
        }
        return new Promise( (resolve) => {    
            let res=fs.readFileSync(target+filePath, 'utf8');
            resolve(res);
        })
    },
    //异步写入
    writeFile (filePath,content) {
        // 写入文件的示例
        fs.writeFile(target+filePath,content, "utf8",(err)=>{
        if(err){
          if (err) throw err;
        }else {
          return true;
        }
      });
    },
    //同步写入
    writeFileSync (filePath,content) {
        // 读取文件的示例
        fs.writeFileSync(target+filePath,content, "utf8",(err)=>{
            if(err){
                    console.log("writeFileSync error:",err);
                    return false;
            }
      });
      return true;
    },
    //同步追加写入
    appendFileSync (filePath,content) {
        // 读取文件的示例
        fs.appendFileSync(target+filePath,content+"\n", "utf8",(err)=>{
            if(err){
                console.log("appendFileSync error:",err);
                return false;
            }
        });
        return true;
    },
    async downloadFile (remoteUrl,saveName,folder='') {

        //创建目录
        if (folder!=""&&!fs.existsSync(target+folder)){
            this.mkdir(folder);
        }
        //目标文件
        const filePath = target+folder+sep+saveName;
        try{

                const writeStream = fs.createWriteStream(filePath);

                const response = await axios({
                    method: 'get',
                    url:remoteUrl,
                    responseType: 'stream'    
                })

                response.data.pipe(writeStream)

                return new Promise((resolve, reject) => {
                    writeStream.on('finish', () => {
                        resolve(filePath);
                    })
                    writeStream.on('error', (err) =>{
                        reject(err);
                    })
                })
        }catch(error){
                console.log("downloadFile error:",error,filePath);
                return false;
        }

    }
}