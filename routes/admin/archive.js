/*
* 支部功能操作
* */
const express = require('express');
const archiveController = require('../../domains/controller/archiveController');
const router = express.Router();

//管理页面
router.get('/',(req,res,next)=>{
    res.redirect('/index')
})
router.get('/index',archiveController.index);
router.get('/toEdit',archiveController.toEdit);
router.post('/edit',archiveController.edit);
router.post('/del',archiveController.del);
router.post('/getList',archiveController.getList);

module.exports = router;