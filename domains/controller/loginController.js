"use strict";
const ResultAjax = require('../../utils/ResultAjax')
class LoginController{

    async index(req,res,next){
        res.render('login/index')
    }

    async checkLogin(req,res,next){
        res.json(ResultAjax.SUCCESS("checkLogin",{}))
    }
}

module.exports = new LoginController();