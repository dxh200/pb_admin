"use strict";
const userService = require('../../service/userService');
const ResultAjax = require('./../../utils/ResultAjax');
const multiparty = require("multiparty");
const fs = require("fs");
const path = require('path');
const moment = require('moment');
const fileUploadUtil = require('./../../utils/FileUploadUtil');
const md5 = require('md5');
/**
 * 系统用户控制器
 */
class UserController{

    constructor(){
        this.getList = this.getList.bind(this);
    }

    /**
     * 进入列表页面
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async index(req,res,next){
        res.render("admin/user/index")
    }

    /**
     * 进入编辑页面
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async toEdit(req,res,next){
        var id = req.query.id;
        if(id){
            await userService.findById(id,(err,doc)=>{
                if(err){
                    throw new Error(err.message);
                }else{
                    if(doc){
                        res.render("admin/user/edit",{data:doc});
                    }else{
                        res.render("admin/user/edit",{data:{}});
                    }

                }
            })
        }else{
            res.render("admin/user/edit",{data:{}});
        }
    }

    /**
     * 编辑支部数据
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async edit(req,res,next){
        var modelData = {};
        var form = new multiparty.Form();
        form.uploadDir = "upload/user";   /*前提目录必须存在*/
        form.maxFieldsSize = 2*1024*1024; //内存大小
        form.maxFilesSize= 5*1024*1024;//文件字节大小限制，超出会报错err
        var urlPath = '/upload/user/';
        await fileUploadUtil.upload(req,form,urlPath,(err,data)=>{
            if(err){
                res.json(ResultAjax.FAILED('封面图片上传失败:'+err.message,{}));
            }else{
                var allFile = data.allFile;
                try{
                    var tempPhoto = data.headImg[0];
                    var tempPass = data.pass[0];
                    let id = data.id[0];
                    var flag = data.file.length;
                    if(flag>0){
                        data['headImg'] = data.file[0].urlPath;
                    }

                    //如果户没有数据新密码保持原密码
                    if(data['password']==""){
                        data['password'] = tempPass;
                    }else{
                        data['password'] = md5(data['password'][0]);
                    }

                    if(id){
                        userService.updateUser(id,data,(err,data)=>{
                            if(err){
                                res.json(ResultAjax.ERROR(err.message,{}));
                            }else{
                                //判断是否有上传图片，删除旧图片
                                if(flag>0){
                                   fileUploadUtil.delFiel(path.join(form.uploadDir,path.basename(tempPhoto)));
                                }
                                res.json(ResultAjax.SUCCESS("数据编辑成功",data));
                            }
                        })
                    }else{
                        userService.addUser(data,(err,data)=>{
                            if(err){
                                res.json(ResultAjax.ERROR(err.message,{}));
                            }else{
                                res.json(ResultAjax.SUCCESS("数据编辑成功",data));
                            }
                        })
                    }
                }catch(err){
                    allFile.forEach((file)=>{
                        fileUploadUtil.delFiel(file.path);
                    });
                    res.json(ResultAjax.ERROR(err.message,{}));
                }
            }
        })
    }

    /**
     * 后台列表管理
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async getList(req,res,next){
        var _self_ = this;
        let page = parseInt(req.body.page);
        let pageSize = parseInt(req.body.rows);
        let account = req.body.account;
        let name = req.body.name;

        //查询条件
        var queryOptions = {};
        if(account){
            queryOptions.account = new RegExp(account);
        }
        if(name){
            queryOptions.name = new RegExp(name);
        }
        var data = {
            rows:[],
            total:0,
            page:1,
            records:0
        }
        userService.queryPageList(queryOptions,page,pageSize).then((result)=>{
            var array = new Array();

            (async ()=>{
                var d = result.docs;
                for(let i=0;i<d.length;i++){
                    let e = d[i].toObject();
                    e.cTime = d[i].cTimeFormat;
                    e.type = d[i].type_name;
                    e.status = d[i].status_name;
                    e.id = d[i]._id;
                    e.loginTime = moment(e.loginTime).format('YYYY-MM-DD HH:mm');
                    e.lastTime = moment(e.lastTime).format('YYYY-MM-DD HH:mm');
                    delete e._id;
                    array.push(e);
                }

                data.rows = array;
                data.total = result.pages;
                data.page = result.page;
                data.records = result.total;
                res.json(data);
            })();
        }).catch((err)=>{
            res.json(data);
        });
    }

    /**
     * 删除用户
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async del(req,res,next){
        let id = req.body.id;
        userService.delUser(id,(err)=>{
            if(err){
                res.json(ResultAjax.FAILED(err.message,{}));
            }else{
                res.json(ResultAjax.SUCCESS("del",{}));
            }
        });
    }

    /**
     * 验证用户名是否存在
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async isExistAccount(req,res){
        let account = req.body.account;
        userService.findUser({account:account},"account",function(err,data){
            if(err){
                res.json(false);
            }else{
                if(data){
                    res.json(false);
                }else{
                    res.json(true);
                }
            }
        })
    }

}

module.exports = new UserController();