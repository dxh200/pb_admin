/*
* 客户端首页接口
* */
const express = require('express');
const router = express.Router();
const contentClient = require('../../domains/client/contentClient');

router.post("/contentList",contentClient.contentList);
router.post("/contentInfo",contentClient.contentInfo);


module.exports = router;