"use strict";
const md5 = require('md5');
const moment = require('moment');
const NumberUtil = require('./../utils/NumberUtil')


console.log(md5('1'));

console.log(moment("123","YYYY-MM-DD",true).isValid());

var data = "[[0,0,0,0,0,0],[0,0,0,0,]]";
var dataObj = null;
try {
    dataObj = JSON.parse(data);
}catch(e){
    console.log(e.message);
}
if(dataObj){
    if(dataObj.length==2){
        if(dataObj[0].length!=6 && dataObj[1].length!=6){
            console.log("数据JSON格式错误");
        }
    }else{
        console.log("数据JSON格式错误");
    }
}else{
    console.log("数据JSON格式错误");
}

console.log(dataObj);
