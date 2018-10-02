var express = require('express');
var router = express.Router();
var sess;
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
  res.render('index', { title: 'sig-inao', layerSess: sess.aire });
  
  //next();
});


  // https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4



router.route('/search')
  .post(lbl_AireController.findLibelle);

router.route('/zone/aire_geo/:id_aire')
  .get(zonesController.getAire);

  router.route('/aire_geo/:id_aire')
  .get(zonesController.findAireGeo);
  
router.route('/zone/aire_parcellaire/:id_aire')
  .get(zonesController.getParcellaire);

  


router.get('/getExtendParcellaire/:id_aire', zonesController.getExtend);

router.route('/communes')
  .post(communesController.fetchCommunes);

router.route('/communes/:insee')
  .get(communesController.getCommune);

router.route('/parcelles')
  .post(parcellesController.fetchParcelles);

router.route('/parcelles/:id')
  .get(parcellesController.getParcelle);
module.exports = router;
