var express = require('express');
const  fs      = require('fs');
const  csv = require('csv-parser');
var router = express.Router();
var sess;
const parcellesController = require('../controllers').parcelles; // controleur des parcelles
const communesController = require('../controllers').communes; //controleur des communes
const lbl_AireController = require('../controllers').lbl_Aires;
const zonesController = require('../controllers').Zones;
const userController = require('../controllers').Users;
const lienSiqoController = require('../controllers').LienSiqos;



// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4


var sessionchecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.render('index');
  } else {
    next();
  }
};

/* GET home page. */
router.get('/', sessionchecker, function (req, res) {

  res.redirect('/login');
});


router.route('/login/:login?')
  .get(sessionchecker, (req, res) => {

    res.render('login', { log: req.params.login });
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

router.route('/login/create/user')
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


router.route('/listAppel/:x/:y')
  .get(zonesController.listAppellationOncoord);


router.route('/siqo/lien/:id_aire')
.get(lienSiqoController.getLien);


router.get('/csv',(req,res)=>{
 const results = [];

 fs.createReadStream('test.csv')
 .pipe(csv({separator:','}))
 .on('data',results.push)
 .on('end',()=>{
  console.log(results);
  res.status(200).send(results);
 });
});
module.exports = router;
