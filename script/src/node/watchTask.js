/**
 * Created with JetBrains WebStorm.
 * User: twer
 * Date: 9/14/13
 * Time: 4:12 PM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var fs = require('fs'),
    fsE = require('fs-extra'),
    watch = require('watch'),
    watchdirectory = require('watchdirectory');



var getFileName = function(file,watchFolder,syncFolder){
    var filename = file.replace(new RegExp('^'+watchFolder),'');
    return syncFolder+filename;
}
var copyFile = function(file,id,stat){
    var watchFolder = _taskList[id].syncedfolder,
        syncFolder = _taskList[id].syncfolder;
    if(fs.existsSync(watchFolder)){
        var syncFile = getFileName(file,watchFolder,syncFolder);
        if(!fs.existsSync(syncFile)){
            if( stat.mode == 16877 ){
                fsE.mkdirsSync(syncFile);
            }else if(stat.mode == 33188 ){
                fsE.createFileSync(syncFile);
            }
        }
        fsE.copy(file, syncFile, function(err){
            if (err) {
            }
            else {
                console.log("success!")
            }
        });
    }
},deleteFile = function(file,id,stat){
    var watchFolder = _taskList[id].syncedfolder,
        syncFolder = _taskList[id].syncfolder;
    var syncfile = getFileName(file,watchFolder,syncFolder);
    if( !fs.existsSync(file) && fs.existsSync(syncfile) ){
        fsE.removeSync(syncfile);
    }
};


var addWatch = function(id,syncedfolder){

    return watchdirectory.watchDirectory(syncedfolder,{include:function(file){
        var fileList = file.split('/');
        return fileList[fileList.length-1][0] != '.' && fileList[fileList.length-1] !='';
    }},function (filename, curr, prev, change) {
        if (change == 'initial') {
            // filename found during initial pass
        }
        else if (change == 'created') {
            // filename is a new file
            copyFile(filename , id , curr );
            console.log('created',filename)
        }
        else if (change == 'deleted') {
            // filename was removed
            deleteFile(filename , id , curr);
            console.log('deleted',filename)
        }
        else if (change == 'modified') {
            // filename was changed
            copyFile(filename , id , curr );
            console.log('modified',filename)
        }
    });

},removeWatch = function(id){
    _taskList[id].taskProgress();
}

var _taskList = {},
    func = {
        'getTask' : function(id){
            if( id && _taskList[id] ){
                return _taskList[id];
            }else{
                return _taskList;
            }
        },
        'addTask' : function(obj){
            var id= obj._id;
            if( !_taskList[id] ){
                if( !obj.disabled ){
                    obj.taskProgress = addWatch(id,obj.syncedfolder);
                }else{
                    obj.taskProgress = function(){};
                }
                _taskList[id] = obj;
                console.log(_taskList,'-----add------');
            }
        },
        'updateTask' : function(id,key,value){

            if( _taskList[id] ){

                var taskItem = _taskList[id];
                taskItem[key] = value;
                // TODO change sync fodler do not unwatch

                removeWatch(id);

                if( !taskItem.disabled ){
                    taskItem.taskProgress = addWatch(id,taskItem.syncedfolder);
                }

            }
            return this;
        },
        'removeTask' : function(id){
            if( _taskList[id] ){
                removeWatch(id);
                delete  _taskList[id];
            }
            return this;
        }

}

module.exports = func;
