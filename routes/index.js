var express = require('express');
var router = express.Router();
var sess;
const parcellesController = require('../controllers').parcelles; // controleur des parcelles
const communesController = require('../controllers').communes; //controleur des communes
const lbl_AireController = require('../controllers').lbl_Aires;
const zonesController    = require('../controllers').Zones;
const userController     = require('../controllers').Users;




// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4


var sessionchecker = (req,res,next)=>{
  if(req.session.user || typeof(req.session.user) !="undefined"){
     res.render('index');
  }else{
    next();
  }
};

/* GET home page. */
router.get('/', sessionchecker, function (req, res) {

   res.redirect('/login');
});

  
router.route('/login')
.get(sessionchecker, (req,res)=>{
  res.render('login');
})
.post(userController.login);




router.route('/search')
  .post(lbl_AireController.findLibelle);

router.route('/zone/aire_geo/:id_aire')
  .get(zonesController.getAire);

  router.route('/aire_geo/:id_aire')
  .get(zonesController.findAireGeo);
  
router.route('/zone/aire_parcellaire/:id_aire')
  .get(zonesController.getParcellaire);

  router.route('/login/create')
  .post(userController.createUser);
  


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
