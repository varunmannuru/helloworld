(function($localPath){
    if (window.location.search.length>1)
       angular.element(document.body).addClass("vslapp_skin-"+window.location.search.substr(1));
  angular.module("app",["vsl.core.ui.vitalsPage", "vsl.core.ui.postStartup"])
  .directive('guide',function() {
    return {
      restrict: 'EA',
      link: function(scope,element,attr) {
        scope.$watch('showGuides',function(nv) {
          if(nv) {
            angular.element(element[0]).addClass('guide');
          } else {
            angular.element(element[0]).removeClass('guide');
          }
        })
      }
    }
  })
  .controller('summaryController',['$scope', '$location', function
         ($scope, $location){
           
         var query = window.location.search.substr(1);
        if(query == "postStartup"){
          $scope.isPostStartup = true;
        }else{
          $scope.isPostStartup = false;
        }

         }]);
})(window.location.href);
