"use strict";
const md5 = require('md5');
const moment = require('moment');
const NumberUtil = require('./../utils/NumberUtil')


console.log(md5('1'));

console.log(NumberUtil.convertNumber('33e234'));



const birthdayYear = moment("1987-02-03",'YYYY-MM-DD').year();
const newYear = new Date().getFullYear();
console.log(newYear - birthdayYear);




