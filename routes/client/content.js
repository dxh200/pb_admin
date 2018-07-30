/*
* 客户端首页接口
* */
const express = require('express');
const router = express.Router();
const contentClient = require('../../domains/client/contentClient');

router.get("/contentListClient",contentClient.contentListClient);
router.get("/contentInfo",contentClient.contentInfo);


module.exports = router;