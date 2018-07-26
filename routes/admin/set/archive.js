/*
* 党员设置功能操作
* */
const express = require('express');
const setArchiveController = require('./../../../domains/controller/set/archiveController');
const router = express.Router();

//管理页面
router.get('/',(req,res,next)=>{
    res.redirect('/index')
})
router.get('/index',setArchiveController.index);
router.post('/edit',setArchiveController.edit);

module.exports = router;