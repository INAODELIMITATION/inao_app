var express = require('express');
var router = express.Router();
const languedocController = require('../controllers').languedocs;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SeekInao' });
});

router.get('/api',languedocController.list);

router.get('/api/:AppelId', languedocController.retrieve);
router.get('/api/denomination/:denom', languedocController.retrieveBydenomination);
module.exports = router;
