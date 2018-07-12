/*
* 支部功能操作
* */
const express = require('express');
const contentController = require('../../controller/contentController');
const router = express.Router();

//管理页面
router.get('/',(req,res,next)=>{
    res.redirect('/index')
})
router.get('/index',contentController.index)
router.get('/toEdit',contentController.toEdit);
router.post('/edit',contentController.edit);
router.post('/del',contentController.del);
router.post('/getList',contentController.getList);

module.exports = router;