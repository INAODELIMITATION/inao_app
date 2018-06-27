var express = require('express');
var router = express.Router();
const parcellaireController = require('../controllers').parcellaires;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SeekInao',appellation:parcellaireController.listAppel});
});

router.get('/api',parcellaireController.listAppel);

router.get('/api/appel', parcellaireController.listAppel);
router.get('/api/denomination/:denom', parcellaireController.retrieveBydenomination);
module.exports = router;
