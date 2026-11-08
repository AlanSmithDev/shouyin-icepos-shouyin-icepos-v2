/**
 * 网络通讯类
 */
const {net} = require('electron');

export default {

    //serviceUrl 服务器或者要PING的网络地址
    async pingServer(serviceUrl:String){
        const   request = net.request(serviceUrl);
                request.on('response', (response) => {
                    return response.statusCode
                })
                request.end();
    }
}