"use strict";
const contentService = require('./../../service/contentService');
const ResultAjax = require('./../../utils/ResultAjax');
const baseClient = require('./baseClient');
class ContentClient extends baseClient{
    constructor(){
        super();
        this.contentListClient = this.contentListClient.bind(this);
    }

    /**
     * 查询内容列表
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async contentListClient(req,res){
        try{
            //数据显示方式
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = '1';

            let page = parseInt(req.body.page);
            let pageSize = parseInt(req.body.rows);
            let category = req.body.category;
            var module = req.query.m; //【1学习宣传、2党务工作、3关注热文】
            if(module=='1'){
                type = sysDataDisplay.val.d3;
            }else if(module=='2'){
                type = sysDataDisplay.val.d5;
            }else if(module=='3'){
                type = sysDataDisplay.val.d6;
            }

            //查询条件
            var queryOptions = {};
            if(category){
                queryOptions.category = category;
            }
            if(module){
                queryOptions.module = module;
            }
            queryOptions.type = type;
            var dataList = contentService.queryPageListClient(queryOption,page,pageSize);
            res.json(ResultAjax.SUCCESS("",{dataList:dataList}));
        }catch(err){
            res.json(ResultAjax.SUCCESS(err.message,{dataList:{}}));
        }
    }

    //查询内容
    async contentInfo(req,res){
        try{
            var id = req.query.id;
            contentService.findById(id,(err,data)=>{
                if(err){
                    res.json(ResultAjax.ERROR(err.message,{}));
                }else{
                    if(data){
                        res.json(ResultAjax.SUCCESS("",data));
                    }else{
                        res.json(ResultAjax.ERROR("",{}));
                    }
                }
            });
        }catch(err){
            res.json(ResultAjax.SUCCESS(err.message,{}));
        }
    }
}