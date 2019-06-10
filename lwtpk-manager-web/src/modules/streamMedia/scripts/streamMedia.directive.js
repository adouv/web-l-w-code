tpk_organization.directive('deleteMedia', ['serviceUtil', 'lwUiModel',
    function (serviceUtil, lwUiModel) {
        return {
            link: function (scope, elem, attrs) {
                elem.on("click", function () {
                    var id = attrs.deleteMedia;
                    lwUiModel.delete(function () {
                        serviceUtil.requestServer('/streamMedia/' + id, 'delete',
                            function (data) {
                                $("#lw-search").click();
                            })
                    })
                })

            }
        }
    }]);

/*tpk_organization.directive('checkAllMedia', ['serviceUtil', 'lwUiModel',
 function (serviceUtil, lwUiModel) {
 return {
 link: function (scope, elem, attrs) {
 elem.on("click", function () {
 scope.checkeds = [];

 scope.$apply();
 })

 }
 }


 }])*/