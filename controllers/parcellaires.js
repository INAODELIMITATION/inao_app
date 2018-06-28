const Aire_P = require('../models').aire_parcellaire;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports={

    /**
     * recupere la liste de tous les eléments sauf la géométrie
     * @param {*} req requete de l'utilisateur
     * @param {*} res reponse renvoyé
     */
    list(req,res){
        return Aire_P
        .all({attributes:{exclude:['geom']}})
        .then(aire_parcelles=>res.status(200).send(aire_parcelles))
        .catch(error => res.status(400).send(error));
    },

    /**
     * liste de toutes les appellations
     * @param {*} req  recupère la requete de l'utilisateur
     * @param {*} res  reponse renvoyé
     */
    listAppel(req,res){
        return Aire_P
       .findAll({
           attributes:[
               [Sequelize.fn('DISTINCT',Sequelize.col('id_app')),'id_app'],
               'appellation'
           ]
       })
        //.aggregate('id_app', 'DISTINCT', {attributes:['appellation'],plain:false,})
        .then(aire_parcelles=>res.status(200).send(aire_parcelles))
        .catch(error => res.status(400).send(error));
    },

    /**
     * liste de toutes les dénominations
     * @param {*} req  recupère la requete de l'utilisateur
     * @param {*} res  reponse renvoyé
     */
    listDenom(req,res){
        return Aire_P
        .findAll({
            attributes:[
                [Sequelize.fn('DISTINCT',Sequelize.col('id_denom')),'id_denom'],
                'denomination','id_app','appellation'
            ]
        })
        .then(aire_parcelles=>res.status(200).send(JSON.stringify(aire_parcelles)))
        .catch(error=> res.status(400).send(error));
    },

    /**recupérer un élément en fonction de son id  */
    retrieve(req,res){
        return Aire_P
        .findById(req.params.AppelId)
        .then(aire_parcelle => {
            if(!aire_parcelle){
                return res.status(404).send({
                    message: 'Appelation pas trouvé',
                });
            }
            return res.status(200).send(aire_parcelle);
        })
        .catch(error => res.status(400).send(error));
    },

    /** recupérer la liste des appellation de dénomination donnée */
    retrieveBydenomination(req,res){
        return Aire_P
        .findAll({
            where:{
                denomination: req.params.denom,
            }, 
            attributes:{exclude:['geom']},
        })
        .then(aire_parcelles =>{
            if(!aire_parcelles){
                return res.status(404).send({
                    message:'denomination pas trouvé',
                });
            }
            return res.status(200).send(aire_parcelles);
        })
        .catch(error => res.status(400).send(error));
    },

    findDeno(req,res){
        console.log("debut");
        var regex = new RegExp(req.body.denom,'i');
        console.log(regex);
        return Aire_P
        .findAll({
          raw:true,
            where:{
                denomination:{[Op.iLike]:'%'+req.body.denom+'%'}
            },
           
            limit:30,
            attributes:[[Sequelize.fn('DISTINCT',Sequelize.col('id_denom')),'id_denom'],'denomination'],
        })
        .then(aire_parcelles =>{
            if(!aire_parcelles){
                return res.status(404).send({
                    message:'denomination pas trouvé',
                });
            }
            console.log("success");
            return res.status(200).send(JSON.stringify(aire_parcelles));
           
        })
        .catch(error => res.status(400).send(error));
    },


    findAppel(req,res){
        console.log("debut");
        var regex = new RegExp(req.body.appel,'i');
        console.log(regex);
        return Aire_P
        .findAll({
          raw:true,
            where:{
                appellation:{[Op.iLike]:'%'+req.body.appel+'%'}
            },
           
            limit:30,
            attributes:[[Sequelize.fn('DISTINCT',Sequelize.col('id_app')),'id_app'],'appellation'],
        })
        .then(aire_parcelles =>{
            if(!aire_parcelles){
                return res.status(404).send({
                    message:'denomination pas trouvé',
                });
            }
            console.log("success");
            return res.status(200).send(JSON.stringify(aire_parcelles));
           
        })
        .catch(error => res.status(400).send(error));
    },

    /**recupérer la liste des appellations ayant le code insee */
    retrieveByInsee(req,res){
        return Aire_P
        .findAll({
            where:{
                insee:req.params.insee,
            },
        })
        .then(aire_parcelles => {
            if(!aire_parcelles){
                return res.status(404).send({
                    message:'Appellation ayant le code Insee pas trouvé'
                });
            }
            return res.status(200).send(aire_parcelles);
        })
        .catch(error => res.status(400).send(error));
    },
}