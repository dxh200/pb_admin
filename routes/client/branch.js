/*
* 客户端首页接口
* */
const express = require('express');
const router = express.Router();
const branchClient = require('../../domains/client/branchClient');

router.get("/getBranchInfo",branchClient.getBranchInfo);
router.get("/getBranchPersonnel",branchClient.getBranchPersonnel);
router.get("/getBTypeCount",branchClient.getArchiveBTypeCount);
router.get("/getGenderCount",branchClient.getArchiveGenderCount);
router.get("/getArchiveAgeCount",branchClient.getArchiveAgeCount);
router.get("/getArchiveDlCount",branchClient.getArchiveDlCount);
router.get("/getArchiveEducationCount",branchClient.getArchiveEducationCount);





module.exports = router;