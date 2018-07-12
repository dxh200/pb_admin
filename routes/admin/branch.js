/*
* 支部功能操作
* */
const express = require('express');
const branchController = require('../../domains/controller/branchController');
const router = express.Router();

//管理页面
router.get('/',(req,res,next)=>{
    res.redirect('/index')
})
router.get('/index',branchController.index)
router.get('/toEdit',branchController.toEdit);
router.post('/edit',branchController.edit);
router.post('/del',branchController.del);
router.post('/getList',branchController.getList);

module.exports = router;