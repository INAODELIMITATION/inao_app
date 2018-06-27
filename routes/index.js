var express = require('express');
var router = express.Router();
const parcellaireController = require('../controllers').parcellaires;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SeekInao' });
});

router.get('/api',parcellaireController.listDenom);

router.get('/api/:AppelId', parcellaireController.retrieve);
router.get('/api/denomination/:denom', parcellaireController.retrieveBydenomination);
module.exports = router;
