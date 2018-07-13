var express = require('express');
var router = express.Router();

const branchRouter = require('./admin/branch');
const contentRouter = require('./admin/content');
const orgRouter = require('./admin/org');
const operationRouter = require('./admin/operation');
const categoryRouter = require('./admin/category');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('admin/index');
});
router.get('/index', function(req, res, next) {
    res.render('admin/index', { title: 'Main' });
});
router.get('/main', function(req, res, next) {
    res.render('admin/main', { title: 'Main' });
});

//子路由
router.use('/branch',branchRouter);
router.use('/content',contentRouter);
router.use('/org',orgRouter);
router.use('/operation',operationRouter);
router.use('/category',categoryRouter);

module.exports = router;
