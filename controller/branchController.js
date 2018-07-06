"use strict";
const branchService = require('../service/branchService');
const moment= require('moment')
const ResultAjax = require('./../utils/ResultAjax');
/**
 * 支部控制器
 */
class BranchController{

    async index(req,res,next){
        res.render("admin/branch/index",{title: '支部列表页面'})
    }

    async toEdit(req,res,next){
        branchService.findById(req,res,next,(err,data)=>{
            if(err){
                throw new Error(err.message);
            }else{
                res.render("admin/branch/edit",{data:data,title: '支部编辑'})
            }
        })
    }

    async edit(req,res,next){

        res.json(ResultAjax.SUCCESS("edit",{}));
    }

    async list(req,res,next){

        res.json(ResultAjax.SUCCESS("list",{}));
    }

    async del(req,res,next){

        res.json(ResultAjax.SUCCESS("del",{}));
    }
}

module.exports = new BranchController();