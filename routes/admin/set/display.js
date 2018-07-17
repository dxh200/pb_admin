/*
* 支部设置功能操作
* */
const express = require('express');
const setDisplayController = require('./../../../domains/controller/set/displayController');
const router = express.Router();

//管理页面
router.get('/',(req,res,next)=>{
    res.redirect('/index')
})
router.get('/index',setDisplayController.index);
router.post('/edit',setDisplayController.edit);

module.exports = router;