/*
* 支部功能操作
* */
const express = require('express');
const orgController = require('../../domains/controller/orgController');
const router = express.Router();

//管理页面
router.get('/',(req,res,next)=>{
    res.redirect('/index')
})
router.get('/index',orgController.index)
router.get('/toEdit',orgController.toEdit);
router.post('/edit',orgController.edit);
router.post('/del',orgController.del);
router.post('/getList',orgController.getList);

module.exports = router;