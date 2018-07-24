"use strict";
const archiveService = require('../../service/archiveService');
const branchService = require('../../service/branchService');
const ResultAjax = require('./../../utils/ResultAjax');
const multiparty = require("multiparty");
const fs = require("fs");
const path = require('path');
const moment = require('moment');
const fileUploadUtil = require('./../../utils/FileUploadUtil');
/**
 * 党员控制器
 */
class ArchiveController{

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
        res.render("admin/archive/index")
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
        var branchList = [];
        await branchService.getAllList({type:1},"bName",(err,data)=>{
            if(!err){
                branchList = data;
            }
        });
        if(id){
            await archiveService.findById(id,(err,doc)=>{
                if(err){
                    throw new Error(err.message);
                }else{
                    if(doc){
                        res.render("admin/archive/edit",{data:doc,branchList:branchList});
                    }else{
                        res.render("admin/archive/edit",{data:{},branchList:branchList});
                    }

                }
            })
        }else{
            res.render("admin/archive/edit",{data:{type:1},branchList:branchList});
        }
    }

    /**
     * 编辑党员信息
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async edit(req,res,next){
        var modelData = {};
        var form = new multiparty.Form();
        form.uploadDir = "upload/archive";   /*前提目录必须存在*/
        form.maxFieldsSize = 2*1024*1024; //内存大小
        form.maxFilesSize= 5*1024*1024;//文件字节大小限制，超出会报错err
        var urlPath = '/upload/archive/';
        await fileUploadUtil.upload(req,form,urlPath,(err,data)=>{
            if(err){
                res.json(ResultAjax.FAILED('封面图片上传失败',{}));
            }else{
                var allFile = data.allFile;
                try{
                    var tempPhoto = data.headImg[0];
                    let id = data.id[0];
                    var flag = data.file.length;
                    if(flag>0){
                        data['headImg'] = data.file[0].urlPath;
                    }
                    data['status'] = parseInt(data.status[0]);
                    if(id){
                        archiveService.updateArchive(id,data,(err,data)=>{
                            if(err){
                                res.json(ResultAjax.ERROR(err.message,{}));
                            }else{
                                //判断是否有上传图片，删除旧图片
                                if(flag>0){
                                   fileUploadUtil.delFiel(path.join(form.uploadDir,path.basename(tempPhoto)));
                                }
                                console.log('dxh');
                                res.json(ResultAjax.SUCCESS("数据编辑成功",data));
                            }
                        })
                    }else{
                        archiveService.addArchive(data,(err,data)=>{
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
        let type = req.body.type;
        let name = req.body.name;

        //查询条件
        var queryOptions = {};
        if(type){
            queryOptions.type = type;
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
        archiveService.queryPageList(queryOptions,page,pageSize).then((result)=>{
            var array = new Array();

            (async ()=>{
                var d = result.docs;
                for(let i=0;i<d.length;i++){
                    let e = d[i].toObject();
                    e.cTime = d[i].cTimeFormat;
                    e.type = d[i].type_name;
                    e.status = d[i].status_name;
                    e.id = d[i]._id;
                    delete e._id;

                    //查询支部名称
                    let branchObj = await _self_._getBranchNameById(d[i].branchId);
                    if(branchObj){
                        e.branchName = branchObj.bName;
                    }else{
                        e.branchName = '';
                    }
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
     * 删除支部
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async del(req,res,next){
        let id = req.body.id;
        archiveService.delArchive(id,(err)=>{
            if(err){
                res.json(ResultAjax.FAILED(err.message,{}));
            }else{
                res.json(ResultAjax.SUCCESS("del",{}));
            }
        });
    }

    /**
     * 获得支部名称
     * @param id
     * @returns {*}
     * @private
     */
    _getBranchNameById(id){
        if(id){
            return new Promise((resolve,reject)=>{
                branchService.findFieldById(id,'bName',(err,data)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(data);
                    }
                });
            });
        }else{
            return null;
        }
    }
}

module.exports = new ArchiveController();