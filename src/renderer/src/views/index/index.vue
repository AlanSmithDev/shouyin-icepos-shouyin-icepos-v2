<template>
  <div class="index-windows">
        <!--标题-->
        <div class="windows_header">
             <el-row>
                <el-col :span="8">
                    <el-text class="mx-1 exits" @click="Appexit()">退出程序</el-text>
                </el-col>
                <el-col :span="8" justify="center" class="txtcenter">
                        ICEPOS开源收银系统
                </el-col>
                <el-col :span="8" class="txtright">
                    <div class="logo">
                        <img
                            width="50"
                            height="50"
                            src="~@/assets/system/icepos.png"
                        />
                    </div>
                </el-col>
            </el-row>
        </div>

        <!--窗口内容主题-->
        <div class="windows_content">
            
            <el-row :gutter="10" class="funcLines">
                    <el-col :span="6">
                        <el-text class="mx-1" type="primary">用户文件夹</el-text>
                    </el-col>
                    <el-col :span="18">
                        <el-button type="primary" plain @click="openFile()">打开保存用户数据的文件夹</el-button>
                    </el-col>
            </el-row>

            <el-row :gutter="10" class="funcLines">
                    <el-col :span="6">
                        <el-text class="mx-1" type="primary">数据库案例</el-text>
                    </el-col>
                    <el-col :span="18">
                        <el-button type="primary" plain @click="createDB()">创建item.db数据库</el-button>
                    </el-col>
            </el-row>

             <el-row :gutter="10" class="funcLines">
                    <el-col :span="6">
                        <el-text class="mx-1" type="primary">写日志案例</el-text>
                    </el-col>
                    <el-col :span="18">
                        <el-button type="primary" plain @click="writeLog()">Electron-Log写日志 </el-button>
                        <el-text class="mx-1">&nbsp;&nbsp;日志保存在systemlogs文件夹内</el-text>
                    </el-col>
            </el-row>

            <el-row :gutter="10" class="funcLines">
                    <el-col :span="6">
                        <el-text class="mx-1" type="primary">创建并写入文本</el-text>
                    </el-col>
                    <el-col :span="18">
                        <el-button type="primary" plain @click="writeFile()">FS原生写入文本</el-button>
                        <el-text class="mx-1">&nbsp;&nbsp;用户数据文件夹根目录下</el-text>
                    </el-col>
            </el-row>

             <el-row :gutter="10" class="funcLines">
                    <el-col :span="6">
                        <el-text class="mx-1" type="primary">PING服务器</el-text>
                    </el-col>
                    <el-col :span="18">
                        <el-button type="primary" plain @click="PingServer()">Ping后台或网站是否联通</el-button>
                        <el-text class="mx-1">&nbsp;&nbsp;例: https://wwww.baidu.com</el-text>
                    </el-col>
            </el-row>

            <el-row :gutter="10" class="funcLines">
                    <el-col :span="6">
                        <el-text class="mx-1" type="primary">窗口最小化</el-text>
                    </el-col>
                    <el-col :span="18">
                        <el-button type="primary" plain @click="AppMini()">点击隐藏应用窗口</el-button>
                        <el-text class="mx-1">&nbsp;&nbsp;点击系统托盘图标可重新打开窗口</el-text>
                    </el-col>
            </el-row>
            
        </div>



  </div>
</template>
 
<script>
import { ref,h } from 'vue';
import { ElMessage } from 'element-plus'

export default {
    name: 'Index',
    props: {
      //系统配置数据
      configs: {
          type: Object
      }
    },
    setup() {
        const apiServerStatus=[200,301,302,303,304];
        return {
            electronAPI:null,// 主窗口对象
            electron:null,//electron对象
            apiServerStatus,
        }
    },
    mounted() {
        this.electronAPI = window.electronAPI;
        this.electron=window.electron;
    },
    methods:{
        getNowDay() {
                let today = new Date();
                let year = today.getFullYear(); // 获取当前年份
                let month = today.getMonth() + 1; // 获取当前月份（注意：月份从 0 开始计数，所以需要加 1）
                let day = today.getDate(); // 获取当前日（几号）
                month = month < 10 ? '0' + month : month;
                day = day < 10 ? '0' + day : day;
                // 格式化输出当前时间
                return String(year)+"-"+ String(month)+"-"+ String(day);
        },

        getNowTime() {
            let day=this.getNowDay();
                let now = new Date();
                let hour = now.getHours().toString().padStart(2, '0'); // 小时
                let minute = now.getMinutes().toString().padStart(2, '0'); // 分钟
                let second = now.getSeconds().toString().padStart(2, '0'); // 秒
                return day+" "+hour+":"+minute+":"+second;
        },

        openMsg (msg) {
            ElMessage(msg)
        },
        openFile(){
            this.electronAPI.openUserDir();
        },
        async createDB(){
             let sql=`CREATE TABLE IF NOT EXISTS system_config (
                    skey  VARCHAR(20) NOT NULL,
                    svalue  TEXT,
                    PRIMARY KEY ("skey")
                );`;
             let res=await this.electronAPI.queryItemDb({"sql":sql});
             if(res!==false){
                this.openMsg("建立数据库成功");
             }else{
                this.openMsg("失败");
             }
        },
        writeLog(){
            this.electronAPI.loginfo({"level":"info","msg":'这是测试日志:日期'+this.getNowTime()});
             this.openMsg("写入日志成功");
        },
        writeFile(){
             this.electronAPI.writeFile("myfstest.txt",'您好，这是我写入测试信息'+this.getNowTime());
             this.openMsg("写入文本文件成功");
        },
        PingServer(){
            try{
                this.electron.ipcRenderer.on("pingResult",(e,g)=>{
                    let statusCode=g.statusCode;
                    if(this.apiServerStatus.includes(statusCode)){
                            this.openMsg("Ping网站成功");
                    }else{
                           this.openMsg("Ping网站失败");
                    }
                  
                })

                this.electronAPI.pingServer("https://www.baidu.com");
        }catch(error){
                console.log("network fail"+error);
        }
        },
        AppMini(){
             this.electronAPI.minimize();
        },
        //退出程序
        Appexit(){
            this.electronAPI.exitApp();
        }
    }
}
</script>
 
<style scoped>
@import "./index.css";
</style>