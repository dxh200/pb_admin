/*
* 系统设置功能操作
* */
const express = require('express');
const router = express.Router();

const setBranch = require('./set/branch');
const setOperation = require('./set/operation');
const setDisplay = require('./set/display');
const setArchive= require('./set/archive');
const setStudy= require('./set/study');

//管理页面
router.use('/branch',setBranch);
router.use('/operation',setOperation);
router.use('/display',setDisplay);
router.use('/archive',setArchive);
router.use('/study',setStudy);

module.exports = router;