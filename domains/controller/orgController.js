"use strict";
const orgService = require('../../service/orgService');
const branchService = require('../../service/branchService');
const ResultAjax = require('./../../utils/ResultAjax');
const multiparty = require('multiparty');
/**
 * 内容控制器
 */
class OrgController{

    constructor(){
    }

    /**
     * 进入列表页面
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async index(req,res,next){
        var branchList = [];
        await branchService.getAllList({type:1},"bName",(err,data)=>{
            if(!err){
                branchList = data;
            }
        });
        res.render("admin/org/index",{branchList:branchList});
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
            await orgService.findById(id,(err,doc)=>{
                if(err){
                    throw new Error(err.message);
                }else{
                    if(doc){
                        res.render("admin/org/edit",{data:doc,branchList:branchList});
                    }else{
                        res.render("admin/org/edit",{data:{},branchList:branchList});
                    }

                }
            })
        }else{
            res.render("admin/org/edit",{data:{type:1},branchList:branchList});
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
        var modelData = req.body;
        try{
            modelData.status = parseInt(modelData.status);
            let id = modelData.id;
            if(id){
                orgService.updateOrg(id,modelData,(err,data)=>{
                    if(err){
                        res.json(ResultAjax.ERROR(err.message,{}));
                    }else{
                        res.json(ResultAjax.SUCCESS("数据编辑成功",data));
                    }
                })
            }else{
                orgService.addOrg(modelData,(err,data)=>{
                    if(err){
                        res.json(ResultAjax.ERROR(err.message,{}));
                    }else{
                        res.json(ResultAjax.SUCCESS("数据编辑成功",data));
                    }
                })
            }
        }catch(err){
            res.json(ResultAjax.ERROR(err.message,{}));
        }
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
        let status = req.body.status;
        let type = req.body.type;
        let name = req.body.name;

        //查询条件
        var queryOptions = {};
        if(status){
            queryOptions.status = status;
        }
        if(type){
            queryOptions.status = type;
        }
        if(name){
            queryOptions.name = new RegExp(name);
        }

        orgService.queryPageList(queryOptions,page,pageSize,(err,result)=>{
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
                    if(item.bId){
                        e.bName = item.bId.bName;
                    }else{
                        e.bName = '';
                    }

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
        orgService.delOrg(id,(err)=>{
            if(err){
                res.json(ResultAjax.FAILED(err.message,{}));
            }else{
                res.json(ResultAjax.SUCCESS("del",{}));
            }
        });
    }

}

module.exports = new OrgController();