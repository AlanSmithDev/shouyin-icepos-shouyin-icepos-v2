/**
 * 日志基类
 */
import logger from 'electron-log'
import {app} from 'electron'

logger.transports.file.level = 'debug'
logger.transports.file.maxSize = 1002430 // 最大不超过10M
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}' // 设置文件内容格式
let date = new Date()
date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
logger.transports.file.fileName = date + '.log' // 创建文件名格式为 '时间.log' (2023-02-01.log)
 
 // 可以将文件放置到指定文件夹中，例如放到安装包文件夹中
 const path = require('path')

//logger.transports.file.level=true
  logger.transports.file.resolvePathFn=(variables)=>{
    return path.join(app.getPath('userData'), 'systemlogs', variables.fileName);
  }

// 有六个日志级别error, warn, info, verbose, debug, silly。默认是silly
export default {
  info (param) {
    logger.info(param)
  },                   
  warn (param) {
    logger.warn(param)
  },
  error (param) {
    logger.error(param)
  },
  debug (param) {
    logger.debug(param) 
  },
  verbose (param) {
    logger.verbose(param)
  },
  silly (param) {
    logger.silly(param)
  }
}
