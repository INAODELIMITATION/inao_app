/**
 * @file controlleur pour les utilisateurs
 * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
 *@version 1.0.0
 */

const User = require('../models').t_user;
const csv = require("csvtojson");
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const Op = Sequelize.Op;
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sess;

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

module.exports = {


    makeHash(req, res) {
        let password = req.params.password;
        bcrypt.hash(password, null, null, (err, hash) => {
            let pwd = hash;

            return res.status(200).send(pwd);
        });
    },

    /**
     * @author Jean Roger NIGOUMI Guiala <mail@jrking-dev.com>
     * @method createUser
     * @description crée un utilisateur avec le mot de passe hashé
     * @param {*} req 
     * @param {*} res 
     */
    createUser(req, res) {

        bcrypt.hash(req.body.password, null, null, (err, hash) => {
            let d = new Date();
            let user = new User({
                login: req.body.login,
                mdp: hash,
                // last_connection: d.getFullYear+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours+":"+d.getMinutes()+d.getSeconds()
            });
            user.save(error => {
                if (error) {
                    return res.send(error);
                } else {
                    return res.status(200).send({ message: "crée avec succès" });
                }

            });
        });
    },

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
        if(req.file.listuser.path){
            console.log("il y a quelque chose");
        }
        console.log(req.file);
        return res.status(200).send(req.body);
    //     const csvFilepath = req.files.listuser.path;
    //     csv()
    //         .fromFile(csvFilepath)
    //         .then((jsonObj) => {
    //             console.log(jsonObj);
    //             return res.status(200).send(jsonObj);
    //             /**
    //              * [
    //              * 	{a:"1", b:"2", c:"3"},
    //              * 	{a:"4", b:"5". c:"6"}
    //              * ]
    //              */
    //         });
    // }
    }
};