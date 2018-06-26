const Languedoc = require('../models').languedoc;

module.exports={
    //recupere la liste des objets 
    list(req,res){
        return Languedoc
        .all({attributes:['id','insee','denomination']})
        .then(languedocs=>res.status(200).send(languedocs))
        .catch(error => res.status(400).send(error));
    },
}