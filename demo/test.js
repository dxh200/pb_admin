"use strict";
const md5 = require('md5');
const moment = require('moment');
const NumberUtil = require('./../utils/NumberUtil')


console.log(md5('1'));

console.log(NumberUtil.convertNumber('33e234'));

var json = {
        label:["考试","阅读","会议","投票","调查","活动"],
        text:["发起率","参与率"],
        data:[[0,0,0,0,0,0],[0,0,0,0,0,0]]
};
json.label = "'"+JSON.stringify(json.label)+"'"
json.text = "'"+JSON.stringify(json.text)+"'"
json.data = "'"+JSON.stringify(json.data)+"'"
console.log(json.label);



