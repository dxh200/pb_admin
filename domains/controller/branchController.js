"use strict";
const branchService = require('../../service/branchService');
const ResultAjax = require('./../../utils/ResultAjax');
const multiparty = require("multiparty");
const fs = require("fs");
const path = require('path');
const moment = require('moment');
const fileUploadUtil = require('./../../utils/FileUploadUtil');
const config = require('config-lite')(__dirname);
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
        res.render("admin/branch/index",{baseUrl:config.baseUrl})
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
                        var arrayLocation = doc.location;
                        doc.lng = arrayLocation[0]==0?"":arrayLocation[0];
                        doc.lat = arrayLocation[1]==0?"":arrayLocation[1];
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
                    let id = data.id[0];
                    var flag = data.file.length;
                    if(flag>0){
                        data['photo'] = data.file[0].urlPath;
                    }
                    data['status'] = parseInt(data.status[0]);

                    //坐标
                    var arrayLocation = [];
                    arrayLocation.push(parseFloat(data.lng[0]));arrayLocation.push(parseFloat(data.lat[0]));
                    data['location'] = arrayLocation;

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

    /**
     * 后台列表管理
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async getList(req,res,next){
        let page = parseInt(req.body.page);
        let pageSize = parseInt(req.body.rows);
        let type = req.body.type;
        let bName = req.body.bName;

        //查询条件
        var queryOptions = {};
        if(type){
            queryOptions.type = type;
        }
        if(bName){
            queryOptions.bName = new RegExp(bName);
        }

        branchService.queryPageList(queryOptions,page,pageSize,(err,result)=>{
            if(err){
                res.json(ResultAjax.FAILED(err.message,{}));
            }else{
                let data = {};
                let array = new Array();
                result.docs.forEach((item,index)=>{
                    let e = item.toObject();
                    e.cTime = item.cTimeFormat;
                    e.type = item.type_name;
                    e.status = item.status_name;
                    e.id = item._id;
                    delete e._id;
                    array.push(e);
                })
                data.rows = array;
                data.total = result.pages;
                data.page = result.page;
                data.records = result.total;
                res.json(data);
            }
        })
    }

    /**
     * 删除支部
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async del(req,res,next){
        let id = req.body.id;
        branchService.del(id,(err)=>{
            if(err){
                res.json(ResultAjax.FAILED(err.message,{}));
            }else{
                res.json(ResultAjax.SUCCESS("del",{}));
            }
        });
    }

}

module.exports = new BranchController();