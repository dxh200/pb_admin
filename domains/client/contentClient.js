"use strict";
const contentService = require('./../../service/contentService');
const ResultAjax = require('./../../utils/ResultAjax');
const baseClient = require('./baseClient');
class ContentClient extends baseClient{
    constructor(){
        super();
        this.contentList = this.contentList.bind(this);
        this.contentInfo = this.contentInfo.bind(this);
    }

    /**
     * 查询内容列表
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async contentList(req,res){
        try{
            //数据显示方式
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = '1';

            let page = parseInt(req.body.page);
            let pageSize = parseInt(req.body.pageSize);
            let category = req.body.c;
            var module = req.body.m; //【1学习宣传、2党务工作、3关注热文】
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
            var dataList = await contentService.queryPageListClient(queryOptions,page,pageSize);
            var array = [];
            dataList.docs.forEach((item)=>{
                let d = item.toObject();
                d.cTime = item.cTimeFormat;
                array.push(d);
            });
            dataList.docs = array;
            res.json(ResultAjax.SUCCESS("",{dataList:dataList}));
        }catch(err){
            res.json(ResultAjax.SUCCESS(err.message,{dataList:{}}));
        }
    }

    //查询内容
    async contentInfo(req,res){
        try{
            var id = req.body.id;
            var m = req.body.m;
            var c = req.body.c;
            var content = {};
            var lastId = "";
            var nextId = "";
            //数据显示方式
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = '1';
            if(module=='1'){
                type = sysDataDisplay.val.d3;
            }else if(module=='2'){
                type = sysDataDisplay.val.d5;
            }else if(module=='3'){
                type = sysDataDisplay.val.d6;
            }

            content = await contentService.findFieldById(id,'title source author num content');
            lastId = await contentService.lastContentByIdClient(id,m,c,type);
            nextId = await contentService.nextContentByIdClient(id,m,c,type);
            res.json(ResultAjax.SUCCESS("",{content:content,lastId:lastId,nextId:nextId}));
        }catch(e){
            res.json(ResultAjax.FAILED(e.message,{content:{},lastId:"",nextId:""}));
        }
    }
}

module.exports = new ContentClient();