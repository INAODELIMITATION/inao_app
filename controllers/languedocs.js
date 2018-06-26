const Languedoc = require('../models').languedoc;

module.exports={
    //recupere la liste des objets 
    list(req,res){
        return Languedoc
        .all({attributes:{exclude:['geom']}})
        .then(languedocs=>res.status(200).send(languedocs))
        .catch(error => res.status(400).send(error));
    },

    /**recupérer un élément en fonction de son id  */
    retrieve(req,res){
        return Languedoc
        .findById(req.params.AppelId)
        .then(languedoc => {
            if(!languedoc){
                return res.status(404).send({
                    message: 'Appelation pas trouvé',
                });
            }
            return res.status(200).send(languedoc);
        })
        .catch(error => res.status(400).send(error));
    },

    /** recupérer la liste des appellation de dénomination donnée */
    retrieveBydenomination(req,res){
        return Languedoc
        .findAll({
            where:{
                denomination: req.params.denom,
            }, 
            attributes:{exclude:['geom']},
        })
        .then(languedocs =>{
            if(!languedocs){
                return res.status(404).send({
                    message:'denomination pas trouvé',
                });
            }
            return res.status(200).send(languedocs);
        })
        .catch(error => res.status(400).send(error));
    },

    /**recupérer la liste des appellations ayant le code insee */
    retrieveByInsee(req,res){
        return Languedoc
        .findAll({
            where:{
                insee:req.params.insee,
            },
        })
        .then(languedocs => {
            if(!languedocs){
                return res.status(404).send({
                    message:'Appellation ayant le code Insee pas trouvé'
                });
            }
            return res.status(200).send(languedocs);
        })
        .catch(error => res.status(400).send(error));
    },
}