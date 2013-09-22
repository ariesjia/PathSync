var app = angular.module('syncApp', [ "appServie", "appDirective"])
    .controller('ListCtrl', function ($scope, $element, $log, storage) {

        var wTask = require('./script/src/node/watchTask.js'),
            gui = require('nw.gui'),
            win = gui.Window.get();


        $scope.syncData = storage.getData() || [];
        $scope.slideIn = true;

        // init watch data

        for(var i = 0 , l = $scope.syncData.length ; i<l ; i++){
            var data = $scope.syncData[i];
            if(data.syncedfolder && data.syncfolder){
                wTask.addTask(data);
            }
        }

        $scope.windowMin = function(){
            win.minimize();
        };

        $scope.windowClose = function(){
            win.close();
        };

        $scope.toggleDisabled = function (data) {
            if (!cheakItemDisable(data)) {
                var value = !data.disabled;
                data.disabled = value;
                wTask.updateTask(data._id,'disabled',value);
                updateData();
            }
        };

        $scope.dellData = function (index) {

            wTask.removeTask($scope.syncData[index]._id);

            $scope.syncData.splice(index, 1);
            updateData();

        };

        $scope.addData = function () {
            var obj = {
                '_id': new Date().getTime(),
                'syncedfolder': '',
                'syncfolder': '',
                'disabled': true
            };
            $scope.slideIn = false;
            $scope.syncData.push(obj);
            updateData();
        };

        $scope.cheakDisable = function () {
            if ($scope.syncData.length !== 0) {
                return cheakItemDisable($scope.syncData[$scope.syncData.length - 1]);
            }
        };

        $scope.editFolder = function ($index, $key, $value) {
            var otherFolder = $key == 'syncedfolder' ? 'syncfolder' : 'syncedfolder',
                tdata = $scope.syncData[$index];
            if (tdata[otherFolder] == $value) {
                // TODO error message
                alert('ERROR! the same folder');
            }else if( $value && tdata[otherFolder] && ( (tdata[otherFolder].indexOf($value) > -1 ) || ( $value.indexOf(tdata[otherFolder]) > -1) ) ){
                alert('ERROR! can not nested');
            }else if( !!$value ) {
                tdata[$key] = $value;
                if(tdata[otherFolder]){
                    //tdata.disabled = false;
                }
                $scope.$digest();
                updateData();
                wTask.updateTask(tdata._id,$key,$value);
            }
        }

        var updateData = function () {
            storage.updateData($scope.syncData);
        };

        var cheakItemDisable = function (syncData) {
            return !(syncData.syncfolder && syncData.syncedfolder);
        };

        var minimize = function(){

            var trayMenu = new gui.Menu(), tray;

            trayMenu.append(new gui.MenuItem({
                label: 'Open',
                click: function () {
                    win.show();
                    tray.remove();
                    tray = null;
                }
            }));
            trayMenu.append(new gui.MenuItem({
                label: 'Exit',
                click: function () {
                    win.close();
                }
            }));


            win.on('minimize',function(){
                this.hide();
                tray = new gui.Tray({icon:'ac/appicon_16.png'});
                tray.menu = trayMenu;

                tray.on('click',function(){
                    win.show();
                    this.remove();
                    tray = null;
                });

            });

            win.on('restore', function () {
                if (tray) {
                    tray.remove();
                    tray = null;
                }
            });
        }

        minimize();

    });
