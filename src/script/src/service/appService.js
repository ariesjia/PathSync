/**
 * Created with JetBrains WebStorm.
 * User: twer
 * Date: 9/13/13
 * Time: 12:23 PM
 * To change this template use File | Settings | File Templates.
 */


angular.module('appServie', [])
    .service('storage', function () {
        var KEY = 'sync-data-stroage';
        this.getData = function () {
            var item = localStorage.getItem(KEY);
            if (item) {
                return JSON.parse(item);
            }
        };
        this.updateData = function (val) {
            val = JSON.stringify(val);
            localStorage.setItem(KEY, val);
            return this;
        }
});