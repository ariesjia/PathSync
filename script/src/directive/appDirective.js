angular.module('appDirective', [])
    .directive('fileInput', function ($document) {
        return {
            scrope : true,
            link: function ($scope, $elem, $attr) {
                var temp = '<input type="file" class="hide" id="syncFileHelper" nwdirectory/>',
                    type = $attr.fileInput;

                var getFileHelper = function(){
                    var $fileInput = angular.element('#syncFileHelper');
                    if(!$fileInput.length){
                        angular.element(temp).appendTo('body');
                        $fileInput = angular.element('#syncFileHelper');
                    }
                    return $fileInput;
                };

                $elem.on('click', function () {
                    var self = $elem,
                        $fileInput = getFileHelper();
                    $fileInput.one('change',function(){
                        var tv = angular.element(this).val();
                        $scope.$parent.editFolder($scope.$index , type , tv);
                    });
                    $fileInput.click();
                });
            }
        }
    });