var express = require('express');
var router = express.Router();
const parcellaireController = require('../controllers').parcellaires;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SeekInao'});
  next();
});

/*
router.route('/api/denomination/:denom)
  .get() what get does
  .put() what put does
  .delete () what delete does

  https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
*/
router.route('/api/denomination/:denom')
    .get(parcellaireController.retrieveBydenomination);
//router.get('/api/denomination/:denom', parcellaireController.retrieveBydenomination);
router.route('/search')
  .post(parcellaireController.findDeno);

//router.post('/search',parcellaireController.findDeno);
router.post('/search/appel',parcellaireController.findAppel);
module.exports = router;
