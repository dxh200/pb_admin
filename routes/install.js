const express = require('express');
const installController = require('../domains/install/installController');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.end("安装向导");
});
router.get('/toInitUser', installController.toInitUser);
router.post('/initUser', installController.initUser);

module.exports = router;
