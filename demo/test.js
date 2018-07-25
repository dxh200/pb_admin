"use strict";
const md5 = require('md5');
const moment = require('moment');


console.log(md5('1'));


/*var calu = [10,20,30,40,50,0];
var pYear = 0;
calu.forEach((item,index)=>{
    let sYear = 0;
    let eYear = 0;
    if(item>0){
        if(pYear==0){
            sYear = moment().subtract(item, "years").format("YYYY");
            eYear = moment().format("YYYY");
            pYear = sYear;
            console.log(pYear + "  " + eYear+" =党龄："+item);
        }else{
            sYear = moment().subtract(item, "years").format("YYYY");
            eYear  = pYear-1;
            pYear = sYear;
            console.log(sYear + "  " + eYear+" =党龄："+item);
        }
    }else{
        sYear = moment().subtract(200, "years").format("YYYY");
        eYear = pYear-1;
        console.log(sYear + "  " + eYear+" =党龄：50以上");
    }
});*/


var calu = [25,35,45,55,0];
var pYear = 0;
calu.forEach((item,index)=>{
    let sYear = 0;
    let eYear = 0;
    if(item>0){
        if(pYear==0){
            sYear = moment().subtract(item, "years").format("YYYY")+"-01-01";
            pYear = sYear;
            sYear = sYear+"-01-01";
            eYear = moment().format("YYYY")+'-12';
            eYear = eYear+moment(eYear,"YYYY-MM").endOf("month");
            console.log(pYear + "  " + eYear+" =年龄："+item);
        }else{
            sYear = moment().subtract(item, "years").format("YYYY");
            pYear = sYear;
            sYear = sYear+"-01-01";
            eYear  = pYear-1;
            eYear = eYear+'-12';
            eYear = eYear+moment(eYear,"YYYY-MM").endOf("month");
            console.log(sYear + "  " + eYear+" =年龄："+item);
        }
    }else{
        sYear = moment().subtract(200, "years").format("YYYY");
        pYear = sYear;
        sYear = sYear+"-01-01";
        eYear = pYear-1;
        eYear = eYear+'-12';
        eYear = eYear+moment(eYear,"YYYY-MM").endOf("month");
        console.log(sYear + "  " + eYear+" =年龄：56以上");
    }
});


