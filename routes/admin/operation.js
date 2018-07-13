/*
* 运营功能操作
* */
const express = require('express');
const operationController = require('../../domains/controller/operationController');
const router = express.Router();

//管理页面
router.get('/',(req,res,next)=>{
    res.redirect('/index')
})
router.get('/index',operationController.index);
router.post('/edit',operationController.edit);

module.exports = router;