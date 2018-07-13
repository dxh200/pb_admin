/*
* 支部功能操作
* */
const express = require('express');
const categoryController = require('../../domains/controller/categoryController');
const router = express.Router();

//管理页面
router.get('/',(req,res,next)=>{
    res.redirect('/index')
})
router.get('/index',categoryController.index);
router.get('/toEdit',categoryController.toEdit);
router.post('/edit',categoryController.edit);
router.post('/del',categoryController.del);
router.post('/getList',categoryController.getList);

module.exports = router;