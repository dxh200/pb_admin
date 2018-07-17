/*
* 支部设置功能操作
* */
const express = require('express');
const setBranchController = require('./../../../domains/controller/set/branchController');
const router = express.Router();

//管理页面
router.get('/',(req,res,next)=>{
    res.redirect('/index')
})
router.get('/index',setBranchController.index);
router.post('/edit',setBranchController.edit);

module.exports = router;