/**
 * item.db数据库操作实例
 * 商品/商品编码/促销政策/支付方式/快捷键/营业员
 */

import {queryParam,insertParam,updateParam,deleteParam,sqQuery,sqInsert,sqUpdate,sqDelete,sqClose} from './db.ts'

class Itemdb    {

    private dbname:string;

    constructor() {
        this.dbname = 'item.db';
        this.init();
    }

    init() {
        // 初始化数据库连接
        //console.log("itemdb initialized with database:", this.dbname);
    }

    sqQuery(qp:queryParam) {
        return sqQuery(this.dbname, qp);
    }

    sqInsert(isp:insertParam) {
        return sqInsert(this.dbname, isp);
    }

    sqUpdate(up:updateParam) {
        return sqUpdate(this.dbname, up);
    }

    sqDelete(dp:deleteParam) {
        return sqDelete(this.dbname, dp);
    }

    sqClose() {
        return sqClose(this.dbname);
    }

}
export default Itemdb;