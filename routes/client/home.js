/*
* 客户端首页接口
* */
const express = require('express');
const router = express.Router();
const homeClient = require('../../domains/client/homeClient')

router.post("/getBranchData",homeClient.getBranchData);
router.post("/getBranchStatistics",homeClient.getBranchStatistics);
router.post("/getOperateStatistics",homeClient.getOperateStatistics);
router.post("/getStudyCategory",homeClient.getStudyCategory);
router.post("/getNewsData",homeClient.getNewsData);
router.post("/getWorkContentId",homeClient.getWorkContentId);


module.exports = router;