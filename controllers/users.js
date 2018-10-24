/**
 * @file controlleur pour les utilisateurs
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 *@version 1.0.0
 */

const User = require('../models').t_user;
const csv = require("csvtojson");

const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);


/**
 * @function setTimeconnect
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 * @description met a jour l'heure de connection
 * @param {User} user 
 */
function setTimeconnect(user) {
    return sequelize
        .query("UPDATE metier_inao.t_user SET last_connection = CURRENT_TIMESTAMP WHERE login = $login;", {

            bind: {
                login: user.login
            }
        }).spread((results, metadata) => {
        }).catch(error => response.status(400).send(error));
}
/**
    * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
    * @method createUser
    * @description crée un utilisateur avec le mot de passe hashé
    * @param {*} req 
    * @param {*} res 
    */
function createUser(login, mdp) {

    bcrypt.hash(mdp, null, null, (err, hash) => {
        let d = new Date();
        let user = new User({
            login: login,
            mdp: hash,
        });

        user.save(error => {
            if (error) {
                console.log(error);
            } else {
                console.log("succes");
            }

        });
    });
}

function makeHash(login, password, callback) {

    bcrypt.hash(password, null, null, (err, hash) => {
        
        callback(hash);

    });

}

module.exports = {





    /**
     * @method login
     * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
     * @description pour la connexion
     * @param {*} req 
     * @param {*} response 
     */
    login(req, response) {
        return User
            .findOne({
                where: {
                    login: req.body.login
                },
            })
            .then(user => {
                if (!user) {
                    response.redirect('/login/not');

                } else {

                    bcrypt.compare(req.body.password, user.mdp, (err, res) => {
                        if (res) {
                            req.session.regenerate(() => {
                                req.session.user = {
                                    login: user.login,
                                    id: user.id
                                };
                                setTimeconnect(user);
                                response.redirect('/');

                            });
                        } else {
                            console.log("password did not match ");

                            response.redirect('/login/not');
                        }
                    });

                }

            })
            .catch(error => response.status(400).send(error));
    },

    createListUser(req, res) {


        const csvFilepath = req.file.path;
        csv()
            .fromFile(csvFilepath)
            .then((userList) => {
               
                if (userList.length < 1) {
                    console.log("on rentre");
                }
                let tabuser = [];
                userList.forEach(user => {
                    makeHash(user.login,user.mdp, cripte=>{
                        tabuser.push(
                            {
                                login:user.login,
                                mdp:cripte
                            }
                        );
                        console.log(tabuser);
                    });
                  
                });
               

            });


    }

};