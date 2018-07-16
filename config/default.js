module.exports = {
    port:3000,
    mongooseUrl:'mongodb://127.0.0.1:27017/pbAdmin',
    operation:{ //运营数据
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
    }
}