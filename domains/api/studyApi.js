"use strict";
const BaseApi = require('./baseApi');
const ResultAjax = require('./../../utils/ResultAjax');
const categoryService = require('../../service/categoryService');
const contentService = require('../../service/contentService');

const moment = require('moment');

class StudyApi extends BaseApi{

    /**
     * @api {post} /api/study/addCategory 分类录入
     * @apiDescription 同步城略图文模块阅读量排行靠前的前六模块
     * @apiName addCategory
     * @apiGroup 学习宣传
     *
     * @apiParam {string} businessId 业务系统唯一码Id,这里可以是城略模型id能与内容关联的业务Id (必填)
     * @apiParam {string} name 分类名称 (必填)
     * @apiParam {string} photo 分类图片,图片路径 (必填)
     * @apiParam {string} num 分类总阅读量 (必填)
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
     * @apiSampleRequest /api/study/addCategory
     * @apiVersion 0.0.1
     */
    async addCategory(req,res){
        try{
            var bodyParams  = req.body;

            //为空判断
            if(!bodyParams['businessId']){
                res.json(ResultAjax.FAILED("businessId不能为空",{}));
                return false;
            }
            //判断是否存在
            var count = await categoryService.count({businessId:bodyParams['businessId'],type:'0'});
            if(count>0){
                res.json(ResultAjax.FAILED("businessId该分类已存在",{}));
                return false;
            }
            if(!bodyParams['name']){
                res.json(ResultAjax.FAILED("分类名称不能为空",{}));
                return false;
            }
            if(!bodyParams['photo']){
                res.json(ResultAjax.FAILED("分类图片不能为空",{}));
                return false;
            }
            if(!bodyParams['num']){
                res.json(ResultAjax.FAILED("阅读量不能为空",{}));
                return false;
            }
            if(!(/^\d+$/.test(bodyParams['num']))){
                res.json(ResultAjax.FAILED("阅读量必须为数字",{}));
                return false;
            }

            //默认参数
            bodyParams['type'] = '0';

            //增加分类
            categoryService.add(bodyParams,(err,data)=>{
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
     * @api {post} /api/study/addContent 添加内容
     * @apiDescription 同步城略图文模块阅读量排行靠前的前六模块的图文内容
     * @apiName addContent
     * @apiGroup 学习宣传
     *
     * @apiParam {string} businessId 业务系统唯一码Id,这里可以是城略模型id能与内容关联的业务Id (必填)
     * @apiParam {string} title 标题 (必填)
     * @apiParam {string} photo 封面图片,图片路径
     * @apiParam {string} source 内容来源 (必填)
     * @apiParam {string} author 作者
     * @apiParam {string} content 内容
     * @apiParam {string} summary 内容简介，120字以内
     * @apiParam {string} num 阅读量 (必填)
     * @apiParam {string} customTime 自定义发布时间,格式YYYY-MM-DD(1970-01-01)
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
     * @apiSampleRequest /api/study/addContent
     * @apiVersion 0.0.1
     */
    async addContent(req,res){
        try{
            var bodyParams  = req.body;
            //为空判断
            if(!bodyParams['businessId']){
                res.json(ResultAjax.FAILED("businessId不能为空",{}));
                return false;
            }
            //判断是否存在
            var count = await categoryService.count({businessId:bodyParams['businessId'],type:'0'});
            if(count==0){
                res.json(ResultAjax.FAILED("businessId不存在",{}));
                return false;
            }
            //为空判断
            if(!bodyParams['title']){
                res.json(ResultAjax.FAILED("标题不能为空",{}));
                return false;
            }
            if(!bodyParams['source']){
                res.json(ResultAjax.FAILED("来源不能为空",{}));
                return false;
            }
            if(!bodyParams['num']){
                res.json(ResultAjax.FAILED("阅读量不能为空",{}));
                return false;
            }
            if(bodyParams['num']){
                if(!(/^\d+$/.test(bodyParams['num']))){
                    res.json(ResultAjax.FAILED("阅读量必须为数字",{}));
                    return false;
                }
                bodyParams['num'] = parseInt(bodyParams['num']);
            }else{
                bodyParams['num'] = 0;
            }

            //自定义时间
            if(bodyParams['customTime']){
                if(!moment(bodyParams['customTime'],"YYYY-MM-DD",true).isValid()){
                    res.json(ResultAjax.FAILED("自定义时间格式错误，如YYYY-MM-DD(1970-01-01)",{}));
                    return false;
                }
            }

            //标题
            if(bodyParams['title'].length>30){
                bodyParams['title'] = bodyParams['title'].substring(0,30);
            }
            //来源
            if(bodyParams['source'].length>30){
                bodyParams['source'] = bodyParams['source'].substring(0,10);
            }
            //简介
            if(bodyParams['summary'].length>120){
                bodyParams['summary'] = bodyParams['summary'].substring(0,120);
            }

            //根据业务businessId分类查询真是分类id
            var categoryObj = await categoryService.findCategory({businessId:bodyParams['businessId'],type:'0'},"businessId");
            if(categoryObj){
                bodyParams['category'] = categoryObj._id;
            }else{
                res.json(ResultAjax.FAILED("businessId不存在",{}));
                return false;
            }
            //默认参数
            bodyParams['type'] = '0';
            bodyParams['module'] = '1';

            //保存数据
            contentService.addContent(bodyParams,(err,data)=>{
                if(err){
                    res.json(ResultAjax.ERROR(err.message,{}));
                }else{
                    res.json(ResultAjax.SUCCESS("保存成功",data));
                }
            })

        }catch(err){
            res.json(ResultAjax.ERROR(err.message,{}));
        }
    }
}

module.exports = new StudyApi();