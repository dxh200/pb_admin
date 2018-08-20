"use strict";
const userService = require('../../service/userService');
const ResultAjax = require('./../../utils/ResultAjax');

const md5 = require('md5');

/**
 * 安装向导
 */
class InstallController{

    toInitUser(req,res){
        res.render("install/initUser");
    }

    async initUser(req,res){
        try{
            var bodyParams = req.body;
            var account = bodyParams.account;
            var password = bodyParams.password;
            if(!account){
                res.json(ResultAjax.ERROR("账号不能为空",{}));
                return false;
            }else{
                if(account.length>20){
                    res.json(ResultAjax.ERROR("账号长度不能超20字符",{}));
                    return false;
                }
            }
            if(!password){
                res.json(ResultAjax.ERROR("密码不能为空",{}));
                return false;
            }else{
                if(password.length>16){
                    res.json(ResultAjax.ERROR("密码长度不能超16字符",{}));
                    return false;
                }
            }

            //数据赋值
            bodyParams.password = md5(password);

            var r = await userService.delUserCollction();
            if(r.ok==1){
                //保存数据
                userService.addUser(bodyParams,(err,data)=>{
                    if(err){
                        res.json(ResultAjax.ERROR(err.message,{}));
                    }else{
                        res.json(ResultAjax.SUCCESS("",{}));
                    }
                });
                res.json(ResultAjax.SUCCESS("",{}));
            }else{
                res.json(ResultAjax.ERROR("用户信息初始化失败",{}));
            }
        }catch(e){
            res.json(ResultAjax.ERROR(e.message,{}));
        }
    }
}

module.exports = new InstallController();

