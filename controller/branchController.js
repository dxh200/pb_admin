"use strict";
const branchService = require('../service/branchService');
const ResultAjax = require('./../utils/ResultAjax');
const multiparty = require("multiparty");
const fs = require("fs");
const path = require('path');
const fileUploadUtil = require('./../utils/FileUploadUtil');
/**
 * 支部控制器
 */
class BranchController{

    /**
     * 进入列表页面
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async index(req,res,next){
        res.render("admin/branch/index",{title: '支部列表页面'})
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
            branchService.findById(id,(err,doc)=>{
                if(err){
                    throw new Error(err.message);
                }else{
                    if(doc){
                        res.render("admin/branch/edit",{data:doc});
                    }else{
                        res.render("admin/branch/edit",{data:{}});
                    }

                }
            })
        }else{
            res.render("admin/branch/edit",{data:{type:1}});
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
        form.uploadDir = "upload/zb";   /*前提目录必须存在*/
        form.maxFieldsSize = 2*1024*1024; //内存大小
        form.maxFilesSize= 5*1024*1024;//文件字节大小限制，超出会报错err
        var urlPath = '/upload/zb/';
        await fileUploadUtil.upload(req,form,urlPath,(err,data)=>{
            console.log("err:"+err);
            if(err){
                res.json(ResultAjax.FAILED('封面图片上传失败',{}));
            }else{
                var allFile = data.allFile;
                try{
                    var tempPhoto = data.photo[0];
                    let id = data._id[0];
                    var flag = data.file.length;
                    if(flag>0){
                        data['photo'] = data.file[0].urlPath;
                    }
                    if(id){
                        branchService.update(id,data,(err,data)=>{
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
                        branchService.add(data,(err,data)=>{
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

    async list(req,res,next){

        res.json(ResultAjax.SUCCESS("list",{}));
    }

    async del(req,res,next){

        res.json(ResultAjax.SUCCESS("del",{}));
    }
}

module.exports = new BranchController();