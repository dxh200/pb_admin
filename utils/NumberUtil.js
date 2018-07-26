"use strict";
class NumberUtil{
    constructor(){
        this.convertNumber = this.convertNumber.bind(this);
    }

    /**
     * 判断是否数字是数字true，不是数字false
     * @param n
     * @returns {boolean}
     */
    isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * 字符串转换数字，不是数字返回0
     * @param n
     * @returns {*}
     */
    convertNumber(n){
        if(this.isNumber(n)){
            return n.replace(/e/g, "");
        }else{
            return 0;
        }
    }
}

module.exports = new NumberUtil();