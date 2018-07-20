"use strict";
const userService = require('../../service/userService');
const ResultAjax = require('./../../utils/ResultAjax');
const md5 = require('md5');
/**
 * 登录控制器
 */
class LoginController{

    constructor(){}

    async index(req,res,next){
        res.render('login/index')
    }

    /**
     * 退出
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async logout(req,res,next){
        req.session.destroy();
        res.redirect('/login/index');
    }

    /**
     * 登陆验证
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async checkLogin(req,res,next){
        var account = req.body.account;
        var password = req.body.password;
        var captcha = req.body.captcha;
        var sessionCaptcha= req.session.captcha;
        if(account=="" || password==""){
            res.json(ResultAjax.FAILED("用户名或密码为空",{}))
        }else if(captcha==""){
            res.json(ResultAjax.FAILED("请输入验证码",{}))
        }else if(sessionCaptcha==""){
            res.json(ResultAjax.FAILED("验证码错误，请刷新验证码",{}))
        }else if(sessionCaptcha.toLowerCase()!=captcha){
            res.json(ResultAjax.FAILED("验证码输入错误",{}))
        }else{
            password = md5(password);
            await userService.findUser({account:account,password:password},"",(err,data)=>{
                if(err){
                    res.json(ResultAjax.FAILED(err.messaage,{}))
                }else{
                    if(data){
                        req.session.userInfo = data;
                        if(data.loginTime){
                            data.lastTime = data.loginTime;
                            data.loginTime = new Date();
                        }else{
                            let d = new Date();
                            data.lastTime = d ;
                            data.loginTime = d ;
                        }
                        data.save();
                        res.json(ResultAjax.SUCCESS("SUCCESS",{}))
                    }else{
                        res.json(ResultAjax.FAILED("用户名或密码错误",{}))
                    }
                }
            })
        }
    }

}

module.exports = new LoginController();