var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FastMVP' });
});
router.get('/doc', function(req, res, next) {
  res.render('doc', { title: 'Documentación' });
});

module.exports = router;
