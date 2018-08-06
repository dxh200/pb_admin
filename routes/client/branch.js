/*
* 客户端首页接口
* */
const express = require('express');
const router = express.Router();
const branchClient = require('../../domains/client/branchClient');

router.post("/getBranchInfo",branchClient.getBranchInfo);
router.post("/getBranchPersonnel",branchClient.getBranchPersonnel);
router.post("/getArchiveBTypeCount",branchClient.getArchiveBTypeCount);
router.post("/getArchiveGenderCount",branchClient.getArchiveGenderCount);
router.post("/getArchiveAgeCount",branchClient.getArchiveAgeCount);
router.post("/getArchiveDlCount",branchClient.getArchiveDlCount);
router.post("/getArchiveEducationCount",branchClient.getArchiveEducationCount);
router.post("/getArchiveInfo",branchClient.getArchiveInfo);






module.exports = router;