"use strict";
const settingService = require('./../../service/settingService');
const config = require('config-lite')(__dirname);
class BaseClient{

    /**
     * 获得数据显示设置
     * @returns {Promise<void>}
     */
    async getSysDataDisplay(){
        var sysDtaDisplay = await settingService.getItem('sys_data_display');
        if(!sysDtaDisplay){
            sysDtaDisplay = config.display;
        }
        return sysDtaDisplay;
    }
}

module.exports = BaseClient;