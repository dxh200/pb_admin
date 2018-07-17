/*
* 运营功能操作
* */
const express = require('express');
const setOperationController = require('../../../domains/controller/set/operationController');
const router = express.Router();

//管理页面
router.get('/',(req,res,next)=>{
    res.redirect('/index')
})
router.get('/index',setOperationController.index);
router.post('/edit',setOperationController.edit);

module.exports = router;