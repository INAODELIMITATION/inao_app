var express = require('express');
var router = express.Router();
var sess;
const parcellaireController = require('../controllers').parcellaires; //controleur des aire_parcellaires
const aire_geoController = require('../controllers').aire_geos; // controleur des aires géographiques  
const parcellesController = require('../controllers').parcelles; // controleur des parcelles
const communesController = require('../controllers').communes; //controleur des communes
const lbl_AireController = require('../controllers').lbl_Aires;
const zonesController    = require('../controllers').Zones;

/* GET home page. */
router.get('/', function (req, res, next) {
  sess = req.session;
  console.log("ici");
  if (typeof (sess.aire) == 'undefined') {
    sess.aire = [];
  }
  //res.locals.aire = sess.aire;
  res.render('index', { title: 'SeekInao', layerSess: sess.aire });
  //next();
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

// router.route('/search')
//   .post(parcellaireController.findDeno);


router.route('/search')
  .post(lbl_AireController.findLibelle);

router.route('/zone/aire_geo/:id_aire')
  .get(zonesController.getAire);

router.route('/zone/aire_parcellaire/:id_aire')
  .get(zonesController.getParcellaire);

  

router.post('/search/appel', parcellaireController.findAppel);
router.get('/getExtendParcellaire/:id_aire', zonesController.getExtend);

router.route('/aire_geo/getInfo/:denomination')
  .get(aire_geoController.retrieveByDenom);

router.route('/aire_geo/:denom')
  .get(aire_geoController.getAire);


router.route('/session/couches/:data')
  .get(parcellaireController.getSess)
  .delete(parcellaireController.delLayerSess)
  .post(parcellaireController.changeSess);

router.route('/communes')
  .post(communesController.fetchCommunes);

router.route('/communes/:insee')
  .get(communesController.getCommune);

router.route('/parcelles')
  .post(parcellesController.fetchParcelles);

router.route('/parcelles/:id')
  .get(parcellesController.getParcelle);
module.exports = router;
