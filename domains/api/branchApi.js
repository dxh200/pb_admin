"use strict";
const config = require('config-lite')(__dirname);
const branchService = require('../../service/branchService');
const archiveService = require('../../service/archiveService');

const BaseApi = require('./baseApi');
const ResultAjax = require('./../../utils/ResultAjax');
const moment = require('moment');
/**
 * 支部接口
 */
class BranchApi extends BaseApi{
    constructor(){
        super()
    }

    /**
     * @api {post} /api/branch/addBranch 添加支部
     * @apiDescription 同步支部数据信息
     * @apiName addBranch
     * @apiGroup 支部管理
     *
     * @apiParam {string} businessId 业务系统支部唯一码Id (必填)
     * @apiParam {string} bName 支部名称 (必填)
     * @apiParam {string} photo 支部封面,图片路径 (必填)
     * @apiParam {string} tel 支部电话 (必填)
     * @apiParam {string} address 支部地址 (必填)
     * @apiParam {string} email 支部Email
     * @apiParam {string} summary 支部简介
     * @apiParam {string} location 支部坐标,格式"lat,lng"
     *
     * @apiSuccess {json} result
     * @apiSuccessExample {json} 成功返回:
     * {
     *      "code":"0",
     *      "msg":"",
     *      "data":{}
     * }
     *
     * @apiError {json} result
     * @apiErrorExample  {json} 成功返回:
     * {
     *      "code":"1|-1",
     *      "msg":"错误信息",
     *      "data":{}
     * }
     * @apiSampleRequest /api/branch/addBranch
     * @apiVersion 0.0.1
     */
    async addBranch(req,res){
        try{
            var bodyParams  = req.body;
            //为空判断
            if(!bodyParams['businessId']){
                res.json(ResultAjax.FAILED("businessId不能为空",{}));
                return false;
            }
            var count = await branchService.count({businessId:bodyParams['businessId'],type:'0'});
            if(count>0){
                res.json(ResultAjax.FAILED("businessId已存在",{}));
                return false;
            }
            if(!bodyParams['bName']){
                res.json(ResultAjax.FAILED("支部名称不能为空",{}));
                return false;
            }
            if(!bodyParams['photo']){
                res.json(ResultAjax.FAILED("封面不能为空",{}));
                return false;
            }
            if(!bodyParams['tel']){
                res.json(ResultAjax.FAILED("电话不能为空",{}));
                return false;
            }
            if(!bodyParams['address']){
                res.json(ResultAjax.FAILED("地址不能为空",{}));
                return false;
            }
            if(!bodyParams['location']){
                bodyParams['location'] = config.location;
            }else{
                if(bodyParams['location'].indexOf(',')>-1){
                    let arr = bodyParams['location'].split(',');
                    if(arr.length==2){
                        if(isNaN(arr[0]) || isNaN(arr[1])){
                            res.json(ResultAjax.FAILED("location格式错误,不是数字[lat,lng]",{}));
                            return false;
                        }else{
                            bodyParams['location'] = arr;
                        }
                    }else{
                        res.json(ResultAjax.FAILED("location格式错误,[lat,lng]",{}));
                        return false;
                    }
                }else{
                    res.json(ResultAjax.FAILED("location格式错误,[lat,lng]",{}));
                    return false;
                }
            }
            //默认参数
            bodyParams['type'] = '0';

            //数据保存操作
            branchService.add(bodyParams,(err,data)=>{
                if(err){
                    res.json(ResultAjax.ERROR(err.message,{}));
                }else{
                    res.json(ResultAjax.SUCCESS("保存成功",data));
                }
            });
        }catch(e){
            res.json(ResultAjax.ERROR(e.message,{}));
        }
    }

    /**
     *
     * @api {post} /api/branch/addArchive 添加党员
     * @apiDescription 同步支部党员信息
     * @apiName addArchive
     * @apiGroup 支部管理
     *
     * @apiParam {string} businessId 业务系统支部唯一码Id (必填)
     * @apiParam {string} name   姓名 (必填)
     * @apiParam {string} headImg  头像 (必填)
     * @apiParam {string} gender  性别，格式[男、女] (必填)
     * @apiParam {string} birthDate 出生年月,格式YYYY-MM-DD (必填)
     * @apiParam {string} position 现党支部职务[1书记、2副书记、3委员、4普通党员] (必填)
     * @apiParam {string} swDate 参加工作日期,格式YYYY-MM-DD (必填)
     * @apiParam {string} residence 现居住地
     * @apiParam {string} idCard 身份证
     * @apiParam {string} nation 民族
     * @apiParam {string} nativePlace 籍贯
     * @apiParam {string} marriage 婚姻状况，默认0[0未婚1已婚]
     * @apiParam {string} registered 户籍所在地
     * @apiParam {string} mobile 手机 (必填)
     * @apiParam {string} qqwX QQ微信
     * @apiParam {string} ftEducation 全日制教育，默认4[1小学、2初中、3高中、4大专、5本科、6硕士、7博士]
     * @apiParam {string} ftSchool 毕业院校及专业
     * @apiParam {string} rdDate 入党时间,接受预备党员日期,格式YYYY-MM-DD
     * @apiParam {string} zzDate 转正时间接受正式党员日期,格式YYYY-MM-DD
     * @apiParam {string} branchDate 进入现党支部时间,格式YYYY-MM-DD
     * @apiParam {string} introducer 入党介绍人
     * @apiParam {string} rdSzzb 入党所在支部
     * @apiParam {string} zzSzzb 转正所在支部
     * @apiParam {string} work 工作单位及职务
     * @apiParam {string} orgUnit 组织关系单位
     * @apiParam {string} goodDeeds 优秀事迹
     * @apiParam {string} jcqk 奖惩情况
     * @apiParam {string} pyDate 民主评议时间,格式YYYY-MM-DD
     * @apiParam {string} pyContent 民主评议内容
     * @apiParam {string} bType 党员类型，默认5[1入党申请、2积极分子、3发展对象、4预备党员、5转正党员]
     * @apiParam {string} good 优秀党员工作者[默认0、1优秀党员、2优秀工作者]
     *
     * @apiSuccess {json} result
     * @apiSuccessExample {json} 成功返回:
     * {
     *      "code":"0",
     *      "msg":"",
     *      "data":{}
     * }
     *
     * @apiError {json} result
     * @apiErrorExample  {json} 成功返回:
     * {
     *      "code":"1|-1",
     *      "msg":"错误信息",
     *      "data":{}
     * }
     * @apiSampleRequest /api/branch/addArchive
     * @apiVersion 0.0.1
     */
    async addArchive(){
        try{
            var bodyParams  = req.body;
            if(!bodyParams['businessId']){
                res.json(ResultAjax.FAILED("businessId不能为空",{}));
                return false;
            }
            var count = await branchService.count({businessId:bodyParams['businessId'],type:'0'});
            if(count==0){
                res.json(ResultAjax.FAILED("支部不已存在,businessId:"+bodyParams['businessId'],{}));
                return false;
            }
            if(!bodyParams['name']){
                res.json(ResultAjax.FAILED("姓名不能为空",{}));
                return false;
            }
            if(!bodyParams['headImg']){
                res.json(ResultAjax.FAILED("头像不能为空",{}));
                return false;
            }
            if(!bodyParams['gender']){
                res.json(ResultAjax.FAILED("性别不能为空",{}));
                return false;
            }else{
                if(bodyParams['gender']!='男' && bodyParams['gender']!='女'){
                    res.json(ResultAjax.FAILED("性别输入错误，只能输入[男、女]",{}));
                    return false;
                }
            }
            if(!bodyParams['birthDate']){
                res.json(ResultAjax.FAILED("出生年月日不能为空",{}));
                return false;
            }else{
                if(!moment(bodyParams['birthDate'],"YYYY-MM-DD",true).isValid()){
                    res.json(ResultAjax.FAILED("出生年月日时间格式错误，如YYYY-MM-DD(1970-01-01)",{}));
                    return false;
                }
            }
            if(!bodyParams['mobile']){
                res.json(ResultAjax.FAILED("手机不能为空",{}));
                return false;
            }
            if(!bodyParams['swDate']){
                res.json(ResultAjax.FAILED("参加工作日期不能为空",{}));
                return false;
            }else{
                if(!moment(bodyParams['swDate'],"YYYY-MM-DD",true).isValid()){
                    res.json(ResultAjax.FAILED("参加工作时间日期格式错误，如YYYY-MM-DD(1970-01-01)",{}));
                    return false;
                }
            }
            if(bodyParams['swDate']){
                if(!moment(bodyParams['swDate'],"YYYY-MM-DD",true).isValid()){
                    res.json(ResultAjax.FAILED("参加工作时间格式错误，如YYYY-MM-DD(1970-01-01)",{}));
                    return false;
                }
            }
            if(bodyParams['rdDate']){
                if(!moment(bodyParams['swDate'],"YYYY-MM-DD",true).isValid()){
                    res.json(ResultAjax.FAILED("接受预备党员时间格式错误，如YYYY-MM-DD(1970-01-01)",{}));
                    return false;
                }
            }
            if(bodyParams['zzDate']){
                if(!moment(bodyParams['swDate'],"YYYY-MM-DD",true).isValid()){
                    res.json(ResultAjax.FAILED("正式党员时间格式错误，如YYYY-MM-DD(1970-01-01)",{}));
                    return false;
                }
            }
            if(bodyParams['branchDate']){
                if(!moment(bodyParams['swDate'],"YYYY-MM-DD",true).isValid()){
                    res.json(ResultAjax.FAILED("进入现党支部时间格式错误，如YYYY-MM-DD(1970-01-01)",{}));
                    return false;
                }
            }
            if(!bodyParams['position']){
                res.json(ResultAjax.FAILED("现党支部职务不能为空",{}));
                return false;
            }else{
                if(bodyParams['position']!='1' && bodyParams['position']!='2' && bodyParams['position']!='3' && bodyParams['position']!='4'){
                    res.json(ResultAjax.FAILED("现党支部职务输入错误，只能输入[1、2、3、4]",{}));
                    return false;
                }
            }


            //根据业务系统businessId支部id查询当前系统对相应的支部id
            var branchObj = await branchService.findBranch({businessId:bodyParams['businessId'],type:'0'},"businessId");
            if(branchObj){
                bodyParams['branchId'] = branchObj._id;
            }else{
                res.json(ResultAjax.FAILED("当前支部不存在,businessId:"+bodyParams['businessId'],{}));
                return false;
            }

            //默认参数
            bodyParams['type'] = '0';

            //保存党员信息
            archiveService.addArchive(bodyParams,(err,data)=>{
                if(err){
                    res.json(ResultAjax.ERROR(err.message,{}));
                }else{
                    res.json(ResultAjax.SUCCESS("保存成功",data));
                }
            })
        }catch(e){
            res.json(ResultAjax.ERROR(e.message,{}));
        }
    }
}

module.exports = new BranchApi();