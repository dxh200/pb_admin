/*
* 运营功能操作
* */
const express = require('express');
const setStudyController = require('../../../domains/controller/set/studyController');
const router = express.Router();

//管理页面
router.get('/',(req,res,next)=>{
    res.redirect('/index')
})
router.get('/index',setStudyController.index);
router.post('/edit',setStudyController.edit);

module.exports = router;