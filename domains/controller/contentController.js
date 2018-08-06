"use strict";
const contentService = require('../../service/contentService');
const categoryService = require('../../service/categoryService');
const ResultAjax = require('./../../utils/ResultAjax');
const multiparty = require("multiparty");
const fs = require("fs");
const path = require('path');
const moment = require('moment');
const fileUploadUtil = require('./../../utils/FileUploadUtil');
/**
 * 内容控制器
 */
class ContentController{

    constructor(){
        this.index = this.index.bind(this);
        this.toEdit = this.toEdit.bind(this);
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
        let module = await this._getModule(req);
        if(module=='1'){
            var categoryList = await this._getCategoryList();
            res.render("admin/study/index",{module:module,categoryList:categoryList});
        }else if(module=='2'){
            res.render("admin/work/index",{module:module});
        }else if(module=='3'){
            res.render("admin/news/index",{module:module});
        }

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
        var module = await this._getModule(req);

        if(id){
            var doc = await new Promise((resolve,reject)=>{
                contentService.findById(id,(err,doc)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(doc);
                    }
                });
            });

            if(doc){
                if(module=='1'){
                    var categoryList =  await this._getCategoryList();
                    res.render("admin/study/edit",{data:doc,categoryList:categoryList});
                }else if(module=='2'){
                    res.render("admin/work/edit",{data:doc});
                }else if(module=='3'){
                    res.render("admin/news/edit",{data:doc});
                }
            }else{
                if(module=='1'){
                    var categoryList =  await this._getCategoryList();
                    res.render("admin/study/edit",{data:{},categoryList:categoryList});
                }else if(module=='2'){
                    res.render("admin/work/edit",{data:{}});
                }else if(module=='3'){
                    res.render("admin/news/edit",{data:{}});
                }
            }
        }else{
            if(module=='1'){
                var categoryList =  await this._getCategoryList();
                res.render("admin/study/edit",{data:{type:1},categoryList:categoryList});
            }else if(module=='2'){
                res.render("admin/work/edit",{data:{type:1}});
            }else if(module=='3'){
                res.render("admin/news/edit",{data:{type:1}});
            }
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
        form.uploadDir = "upload/content";   /*前提目录必须存在*/
        form.maxFieldsSize = 2*1024*1024; //内存大小
        form.maxFilesSize= 5*1024*1024;//文件字节大小限制，超出会报错err
        var urlPath = '/upload/content/';
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
                    data['num'] = parseInt(data.num[0]);
                    data['status'] = parseInt(data.status[0]);
                    if(data['summary'][0].length>120){
                        data['summary'] = data['summary'][0].substring(0,120);
                    }
                    if(id){
                        contentService.updateContent(id,data,(err,data)=>{
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
                        contentService.addContent(data,(err,data)=>{
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
        let category = req.body.category;
        let title = req.body.title;
        var module = await this._getModule(req);

        //查询条件
        var queryOptions = {};
        if(category){
            queryOptions.category = category;
        }
        if(title){
            queryOptions.title = new RegExp(title);
        }
        if(module){
            queryOptions.module = module;
        }

        var r = {};
        await contentService.queryPageList(queryOptions,page,pageSize).then((result)=>{
            r = result;
        }).catch((err)=>{
            res.json(ResultAjax.FAILED(err.message,{}));
        });

        var data = {};
        var array = new Array();
        if(r){
            await (async()=>{
                var docs = r.docs;
                for(let i=0;i<docs.length;i++){
                    let e = docs[i].toObject();
                    e.cTime = docs[i].cTimeFormat;
                    e.type = docs[i].type_name;
                    e.status = docs[i].status_name;
                    e.id = docs[i]._id;
                    delete e._id;
                    //如果当前是学习宣传就查询分类
                    if(module=='1'){
                        if(docs[i].category){
                            var categoryObj = await this._getCategoryNameById(docs[i].category);
                            if(categoryObj){
                                e.category = categoryObj.name;
                            }else{
                                e.category = '';
                            }
                        }else{
                            e.category = '';
                        }
                    }
                    array.push(e);
                }
            })();
        }
        data.rows = array;
        data.total = r.pages;
        data.page = r.page;
        data.records = r.total;
        res.json(data);
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
        contentService.delContent(id,(err)=>{
            if(err){
                res.json(ResultAjax.FAILED(err.message,{}));
            }else{
                res.json(ResultAjax.SUCCESS("del",{}));
            }
        });
    }

    /**
     * 获得模块类型
     * @param req
     * @returns {*}
     */
    _getModule(req){
        let module = req.query.m; //【1学习宣传、2党务工作、3关注热文】
        if(!module){
            module = '1';
        }
        return module;
    }

    /**
     * 获得学习宣传分类
     * @returns {Array}
     * @private
     */
    _getCategoryList(){
        return new Promise((resolve, reject) => {
            categoryService.getAllList({type:1,status:1},"name",(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            });
        });
    }

    /**
     * 根据分类id获得分明名称
     * @param id
     * @returns {Promise<any>}
     * @private
     */
    _getCategoryNameById(id){
        if(id){
            return new Promise((resolve,reject)=>{
                categoryService.getCategoryNameById(id,(err,data)=>{
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

module.exports = new ContentController();