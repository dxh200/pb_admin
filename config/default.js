module.exports = {
    //系统端口
    port:3000,
    //数据库连接
    mongooseUrl:'mongodb://127.0.0.1:27017/pbAdmin',
    //运营数据
    operation:{
        //手动
        m:{
            key:'sys_operation_m',
            val:{
                label:'@考试,阅读,会议,投票,调查,活动',
                text:'发起率,参与率',
                data:'[[0,0,0,0,0,0],[0,0,0,0,0,0]]'
            }
        },
        //同步
        s:{
            key:'sys_operation_s',
            val:{
                label:'$考试,阅读,会议,投票,调查,活动',
                text:'发起率,参与率',
                data:'[[0,0,0,0,0,0],[0,0,0,0,0,0]]'
            }
        }
    },
    //支部设置
    branch:{
        key:'sys_branch_statistics',
        val:{
            data1:0, //支部数量：
            data2:0, //基层党组织：
            data3:0, //优秀党员：
            data4:0  //优秀工作者：
        }
    },
    //党员信息统计
    pb_statistics:{
        //发展党员分布
        bType:{
            key:'sys_archive_bType',
            val:[{_id:'1',name:'入党申请',value:0},{_id:'2',name:'积极分子',value:0},{_id:'3',name:'发展对象',value:0},{_id:'4',name:'预备党员',value:0},{_id:'5',name:'转正党员',value:0}]
        },
        //党员性别分布[男女]
        gender:{
            key:'sys_archive_gender',
            val:[{name:'男',value:0},{name:'女',value:0}]
        },
        //党员党龄分布[1-10年、11-20年、21-30年、31-40年、41-50年、50年以上]
        dl:{
            key:'sys_archive_dl',
            val:{
                label:['1-10年','11-20年','21-30年','31-40年','41-50年','50年以上'],
                data:['0','0','0','0','0','0']
            },
            calu:[10,20,30,40,50,0]   //0是50以上
        },
        //党员学历分布
        education:{
            key:'sys_archive_education',
            val:[{_id:'1',name:'小学',value:0},{_id:'2',name:'初中',value:0},{_id:'3',name:'高中',value:0},{_id:'4',name:'大专',value:0},{_id:'5',name:'本科',value:0},{_id:'6',name:'硕士',value:0},{_id:'7',name:'博士',value:0}]
        },
        //党员年龄分布[25岁以下、26-35岁、36-45岁、46-55岁、56岁以上]
        age:{
            key:'sys_archive_age',
            val:{
                label:['25岁以下','26-35岁','36-45岁','46-55岁','56岁以上'],
                data:['0','0','0','0','0']
            },
            calu:[25,35,45,55,0]   //0是56以上
        }
    },
    //各项数据显示方式
    display:{ //0同步、1手动、2所有
        key:'sys_data_display',
        val:{
            'd1':'1',  //支部数据
            'd2':'1',  //基层组织
            'd3':'1',  //学习宣传
            'd4':'1',  //学习宣传模块
            'd5':'1',  //党务工作
            'd6':'1',  //关注热文
            'd7':'1',  //党员信息
            'd8':'1',  //运营数据
            'd9':'1',  //支部统计
            'd10':'1',  //党员信息统计【性别、党龄、学历、发展党员。。】
        }
    }
}