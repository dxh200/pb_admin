/*
* 支部功能操作
* */
const express = require('express');
const userController = require('../../domains/controller/userController');
const router = express.Router();

//管理页面
router.get('/',(req,res,next)=>{
    res.redirect('/index')
})
router.get('/index',userController.index);
router.get('/toEdit',userController.toEdit);
router.post('/edit',userController.edit);
router.post('/del',userController.del);
router.post('/getList',userController.getList);

module.exports = router;