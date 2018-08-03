var express = require('express');
var router = express.Router();
var sess;
const parcellaireController = require('../controllers').parcellaires;

/* GET home page. */
router.get('/', function(req, res, next) {
  sess = req.session;
  if (typeof(sess.aire)=='undefined'){
    sess.aire = [];
  }
  res.locals.aire = sess.aire;
  res.render('index', { title: 'SeekInao',layerSess:sess.aire});
 
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
router.get('/extendTest/:denom', parcellaireController.getExtend);
router.get('/session/aireCharge', parcellaireController.getSess);
module.exports = router;
