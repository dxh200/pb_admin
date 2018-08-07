"use strict";
const settingService = require('./../../service/settingService');
const categoryService = require('./../../service/categoryService');
const contentService = require('./../../service/contentService');
const branchService = require('./../../service/branchService');
const orgService = require('./../../service/orgService');
const archiveService = require('./../../service/archiveService');
const ResultAjax = require('./../../utils/ResultAjax');
const config = require('config-lite')(__dirname);
const baseClient = require('./baseClient');

/**
 * 首页数据加载
 */
class HomeClient extends baseClient{

    constructor(){
        super()
        this.getOperateStatistics = this.getOperateStatistics.bind(this);
        this.getBranchStatistics = this.getBranchStatistics.bind(this);
        this.getStudyCategory = this.getStudyCategory.bind(this);
        this.getNewsData = this.getNewsData.bind(this);
        this.getBranchData = this.getBranchData.bind(this);
        this.getWorkContentId = this.getWorkContentId.bind(this);
    }

    /**
     * 获得支部地图位置信息
     * @returns {Promise<void>}
     */
    async getBranchData(req,res){
        var resutlData = {};
        try{
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = sysDataDisplay.val.d1;
            //手动
            var dataList = await branchService.getBranchNameListClient(type);
            var array = [];
            dataList.forEach((item)=>{
                var _item_ = {};
                _item_.id = item._id;
                _item_.title = item.bName;
                if(item.location.length>0){
                    _item_.point = item.location[0]+"|"+item.location[1];
                }else{
                    _item_.point = "|";
                }
                array.push(_item_);
            })
            res.json(ResultAjax.SUCCESS("",array));
        }catch(e){
            res.json(ResultAjax.FAILED(e.message,[]));
        }
    }

    /**
     * 获得支部统计数据
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async getBranchStatistics(req,res){
        var resutlData = {};
        try{
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = sysDataDisplay.val.d9;
            //手动
            if(type=='1'){
                resutlData = await settingService.getItem(config.branch.key);
                if(!resutlData){
                    resutlData = config.branch;
                }
            }else{ //同步
                //动态统计本地数据
                resutlData = config.branch;
                //支部数量
                var branchData = await branchService.getBranchCountClient(type);
                resutlData.val.data1 = branchData;
                //基层党组织
                var orgData = await orgService.getOrgCountClient(type);
                resutlData.val.data2 = orgData;
                //优秀党员
                var archiveData1 = await archiveService.getArchiveGoodCountClient(type,'1');
                resutlData.val.data3 = archiveData1;
                //优秀工作者
                var archiveData2 = await archiveService.getArchiveGoodCountClient(type,'2');
                resutlData.val.data4 = archiveData2;
            }
            res.json(ResultAjax.SUCCESS("",resutlData.val));
        }catch(e){
            res.json(ResultAjax.FAILED(e.message,{}));
        }
    }

    /**
     * 获得运营数据
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async getOperateStatistics(req,res){
        var resutlData = {};
        try{
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = sysDataDisplay.val.d8;
            //手动
            if(type=='1'){
                resutlData = await settingService.getItem(config.operation.m.key);
                if(!resutlData){
                    resutlData = config.operation.m;
                }
            }else{ //同步
                resutlData = await settingService.getItem(config.operation.s.key);
                if(!resutlData){
                    resutlData = config.operation.s;
                }
            }
            res.json(ResultAjax.SUCCESS("",resutlData.val));
        }catch(e){
            res.json(ResultAjax.FAILED(e.message,{}));
        }
    }

    /**
     * 获得学习宣传分类信息
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async getStudyCategory(req,res){
        try{
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = sysDataDisplay.val.d4;
            var dataList = await categoryService.getListClient(type);
            var array=  [];
            for(let i=0;i<dataList.length;i++){
                let item = dataList[i].toObject();
                let cid = await contentService.getContentByModuleClient('1',item._id,type);
                item.cid = cid;
                array.push(item);
            }
            res.json(ResultAjax.SUCCESS("",array));
        }catch(e){
            res.json(ResultAjax.FAILED(e.message,{}));
        }
    }

    /**
     * 查询党务工作分类第一条信息id
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async getWorkContentId(req,res){
        try{
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = sysDataDisplay.val.d4;

            //1会议记录  2活动简报 3培训学习
            var array=  {data1:"",data2:"",data3:""};

            let data1 = await contentService.getContentByModuleClient('2','1',type);
            let data2 = await contentService.getContentByModuleClient('2','2',type);
            let data3 = await contentService.getContentByModuleClient('2','3',type);

            array.data1 = data1;
            array.data2 = data2;
            array.data3 = data3;
            res.json(ResultAjax.SUCCESS("",array));
        }catch(e){
            res.json(ResultAjax.FAILED(e.message,{}));
        }
    }

    /**
     * 获得关注热文图片信息
     * @returns {Promise<void>}
     */
    async getNewsData(req,res){
        try{
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = sysDataDisplay.val.d6
            var dataList = await contentService.getNewsImgClient(type,10);
            res.json(ResultAjax.SUCCESS("",dataList));
        }catch(e){
            res.json(ResultAjax.FAILED(e.message,{}));
        }
    }
}

module.exports = new HomeClient();