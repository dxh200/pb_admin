/*
* 系统设置功能操作
* */
const express = require('express');
const setBranch = require('./set/branch');
const setOperation = require('./set/operation');
const setDisplay = require('./set/display');
const router = express.Router();

//管理页面
router.use('/branch',setBranch);
router.use('/operation',setOperation);
router.use('/display',setDisplay);

module.exports = router;