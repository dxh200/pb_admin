"use strict";
var data = {
};

console.log((!'_id' in data));

if(data._id){
    console.log('you');
}else{
    console.log('meiyou');
}