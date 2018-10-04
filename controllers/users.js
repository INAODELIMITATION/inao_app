/**
 * @author JEAN ROGER NIGOUMI GUIALA
 * @description controlleur pour les les utilisateurs 
 */

const User = require('../models').user;
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
var sess;

module.exports={

    makeHash(req,res){
        let password = req.params.password;
        bcrypt.hash(password,null,null,(err,hash)=>{
            let pwd = hash;
           
            return res.status(200).send(pwd);
        });
    },

    createUser(req,res){

        bcrypt.hash(req.body.password, null,null,(err,hash)=>{
            let d = new Date();
            let user = new User({
                login:req.body.login,
                mdp:hash,
                // last_connection: d.getFullYear+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours+":"+d.getMinutes()+d.getSeconds()
            });
            user.save(error=>{
                if(error){
                    res.send(error);
                }else{
                    res.status(200).send({message:"crée avec succès"});
                }

            });
        });
    },

    login(req,response){
        return User
        .findOne({
            where:{
                login:req.body.login
            },   
        })
        .then(user=>{
            if(!user){
                response.redirect('/login/not');
               
            }else{
                
                bcrypt.compare(req.body.password, user.mdp, (err,res)=>{
                    console.log("ici"+res);
                    if(res){
                        req.session.regenerate(()=>{
                            req.session.user = user.login;
                            response.redirect('/');
                        });
                    }else{
                        console.log("password did not match ");
                       
                        response.redirect('/login/not');
                    }
                });
               
            }
           
        })
        .catch(error => response.status(400).send(error));
    }
};