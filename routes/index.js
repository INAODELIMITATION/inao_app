var express = require('express');
var router = express.Router();
const languedocController = require('../controllers').languedocs;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SeekInao' });
});

router.get('/api',languedocController.list);

module.exports = router;
