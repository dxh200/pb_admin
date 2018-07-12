const express = require('express');
const loginController = require('../domains/controller/loginController');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login/index');
});
router.get('/index', loginController.index);

router.post('/checkLogin', loginController.checkLogin);

module.exports = router;
