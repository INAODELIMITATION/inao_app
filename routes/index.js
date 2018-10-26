/**
 * @file Fichier des routes de l'application
 * @copyright INAO 2018
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @version 1.0.0
 */

/**déclaration des varibales */
var express     = require('express');
const  fs       = require('fs');
const csv       = require("csvtojson");
var router      = express.Router();
var multer      = require('multer');
var upload      = multer({ dest: './tmp/' });
const parcellesController = require('../controllers').parcelles; // controleur des parcelles
const communesController  = require('../controllers').communes; //controleur des communes
const lbl_AireController  = require('../controllers').lbl_Aires; //controleur des libelles aire
const zonesController     = require('../controllers').Zones; //controlleur pour les zones
const userController      = require('../controllers').Users; //controlleur pour les utilisateurs
const lienSiqoController  = require('../controllers').LienSiqos; // controleur pour le lien siqo
const requestController   = require('../controllers').Requests; //controleur pour les requetes des utilisaters



// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

/**
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @function sessionchecker
 * @description si l'utilisateur est authentifié, affiche la page principale
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var sessionchecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.render('index');
  } else {
    next();
  }
};

/**
 * @function checklogin
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description si l'utilisateur n'est pas authentifié, affiche la page de connexion
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var checklogin = (req,res, next)=>{
  if(!req.session.user && !req.cookies.user_id){
   
     res.redirect('/login');
  }else{
    next();
  }
};

/**
 * @function checkloginAdmin
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description si l'utilisateur est pas l'admin, retour à la page principale
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var checkloginAdmin = (req,res, next)=>{
  if(req.session.user.login !== "j.nigoumiguiala@inao.gouv.fr"){
   
     res.redirect('/');
  }else{
    next();
  }
};

/* GET home page. */
router.get('/', sessionchecker, function (req, res) {

  res.redirect('/login');
});

/**Page de connexion */
router.route('/login/:login?')
/**Get page de connexion, affiche la vue  */
  .get(sessionchecker, (req, res) => {

    res.render('login', { log: req.params.login });
  })
  /**Post oage de connexion HTTP POST du formulaire de connexion */
  .post(userController.login);



/**route pour la recherche (formulaire de recherche des appellations) */
router.route('/search')
  .post(checklogin,lbl_AireController.findLibelle);

  /**route pour recupérer l'aire géo */
router.route('/zone/aire_geo/:id_aire')
  .get(checklogin,zonesController.getAire);
  
/**recupère toute l'aire géo */
router.route('/aire_geo/:id_aire')
  .get(checklogin,zonesController.findAireGeo);

  /**recupère l'aire parcellaire */
router.route('/zone/aire_parcellaire/:id_aire')
  .get(checklogin,zonesController.getParcellaire);



/**extend de l'aire parcellaire */
router.get('/getExtendParcellaire/:id_aire',checklogin, zonesController.getExtend);

/**recupere la liste des  communes recherchées */
router.route('/communes')
  .post(checklogin,communesController.fetchCommunes);

/**recupère la commune qu'on veut afficher */
router.route('/communes/:insee')
  .get(checklogin,communesController.getCommune);

/**liste des parcelles */
router.route('/parcelles')
  .post(checklogin,parcellesController.fetchParcelles);

/**parcelle qu'on veut afficher */
router.route('/parcelles/:id')
  .get(checklogin,parcellesController.getParcelle);

/**listes des appellations qui touchent des coordonnées  */
router.route('/listAppel/:x/:y')
  .get(zonesController.listAppellationOncoord);

/**lien vers les cahiers des charges */
router.route('/siqo/lien/:id_aire')
.get(checklogin,lienSiqoController.getLien);

/**enregistre une ligne dans la table requete quand une appellation est cherchée */
router.route('/request/:id_aire')
.get(checklogin,requestController.createRequest);

/**upload csv */
router.route('/csv/upload')
.get((req,res)=>{
  res.render("upload", {statue:"noform"});
})
.post(userController.checkAdmin);
router.route("/csv/upload/form")
.get(checklogin,checkloginAdmin,(req,res)=>{
  res.render("upload", {statue:"form"});
})
.post(checkloginAdmin,upload.single('file'),userController.createListUser);

module.exports = router;
